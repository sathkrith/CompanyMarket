from flask import Flask, jsonify, request, abort
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from models import db, get_all_companies, get_company_by_id, get_locations_by_company_id, register_user, authenticate_user
import logging
import os
import numpy as np
import pandas as pd
from datetime import datetime, timedelta
from werkzeug.exceptions import HTTPException

app = Flask(__name__)

# Configure logging
logging.basicConfig(level=logging.INFO)

# Database configuration
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# JWT configuration
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY')  # Change this to a random secret key
jwt = JWTManager(app)

db.init_app(app)

def generate_stock_data(company_name, start_date, end_date):
    np.random.seed(sum(ord(c) for c in company_name))  # Seed with company name

    date_range = pd.date_range(start=start_date, end=end_date, freq='D')
    prices = np.random.uniform(100, 200, len(date_range))  # Random prices between 100 and 200

    data = pd.DataFrame({'date': date_range, 'price': prices})
    return data


def generate_stock_prices(symbol):
    # Generate a date range from 5 years ago to today
    end_date = datetime.now()
    start_date = end_date - timedelta(days=5*365)

    # Create a date range
    dates = pd.date_range(start=start_date, end=end_date, freq='D')

    # Generate random stock prices
    np.random.seed(0)
    prices = np.random.normal(loc=100, scale=10, size=len(dates))

    # Create a DataFrame
    stock_data = pd.DataFrame({'date': dates, 'price': prices})

    return stock_data

@app.route('/api/stock_prices/<company_name>/<time_frame>', methods=['GET'])
@jwt_required()
def get_stock_prices(company_name, time_frame):
    end_date = datetime.now()
    if time_frame == '5y':
        start_date = end_date - timedelta(days=5*365)
    elif time_frame == '1y':
        start_date = end_date - timedelta(days=365)
    elif time_frame == '6m':
        start_date = end_date - timedelta(days=182)
    elif time_frame == '1m':
        start_date = end_date - timedelta(days=30)
    elif time_frame == '1d':
        start_date = end_date - timedelta(days=1)
    else:
        return jsonify({'error': 'Invalid time frame'}), 400

    data = generate_stock_data(company_name, start_date, end_date)
    return data.to_json(orient='records')

@app.route('/api/companies', methods=['GET'])
def companies():
    logging.info('Fetching all companies')
    try:
        companies = get_all_companies()
        result = []
        for company in companies:
            result.append(company.serialize())
        return jsonify(result), 200
    except Exception as e:
        logging.error(f"Error fetching companies: {str(e)}")
        return internal_error()

@app.route('/api/companies/<int:company_id>', methods=['GET'])
@jwt_required()
def company_by_id(company_id):
    logging.info(f'Fetching company details for company_id: {company_id}')
    try:
        company = get_company_by_id(company_id)
        if company:
            return jsonify(company.serialize()), 200
        else:
            return not_found()
    except Exception as e:
        logging.error(f"Error fetching company: {str(e)}")
        return internal_error()

@app.route('/api/companies/<int:company_id>/locations', methods=['GET'])
@jwt_required()
def locations_by_company_id(company_id):
    logging.info(f'Fetching locations for company_id: {company_id}')
    try:
        locations = get_locations_by_company_id(company_id)
        if locations:
            return jsonify([location.serialize() for location in locations]), 200
        else:
            return not_found()
    except Exception as e:
        logging.error(f"Error fetching locations: {str(e)}")
        return internal_error()

@app.route('/api/register', methods=['POST'])
def register():
    data = request.get_json()
    if not data or not data.get('username') or not data.get('password'):
        abort(400, description="Username and password are required")
    
    try:
        register_user(data['username'], data['password'])
        return jsonify({"message": "User registered successfully"}), 201
    except Exception as e:
        logging.error(f"Error registering user: {str(e)}")
        return internal_error()

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    if not data or not data.get('username') or not data.get('password'):
        abort(400, description="Username and password are required")
    
    try:
        user = authenticate_user(data['username'], data['password'])
        if user:
            access_token = create_access_token(identity=user.user_id)
            return jsonify(access_token=access_token), 200
        else:
            return unauthorized_error()
    except Exception as e:
        logging.error(f"Error logging in user: {str(e)}")
        return internal_error()

@app.route('/api/stock/<string:symbol>', methods=['GET'])
@jwt_required()
def get_stock_price(symbol):
    logging.info(f'Generating stock prices for symbol: {symbol}')
    try:
        stock_data = generate_stock_prices(symbol)
        return jsonify(stock_data.to_dict(orient='records')), 200
    except Exception as e:
        logging.error(f"Error generating stock prices: {str(e)}")
        return internal_error()

# Error handling
@app.errorhandler(404)
def not_found():
    return jsonify({'error':'Could not find resource'}), 404

@app.errorhandler(500)
def internal_error():
    return jsonify({'error': 'Internal server error'}), 500

@app.errorhandler(401)
def unauthorized_error():
    return jsonify({'error': 'Unauthorized'}), 500

# API Documentation
@app.route('/api/api-docs', methods=['GET'])
def api_docs():
    docs = {
        "endpoints": {
            "/api/companies": "GET - Get all companies",
            "/api/companies/<company_id>": "GET - Get company details by ID",
            "/api/companies/<company_id>/locations": "GET - Get all locations for a specific company ID",
            "/api/register": "POST - Register a new user",
            "/api/login": "POST - Login an existing user",
            "/api/stock/<symbol>": "GET - Get generated stock prices for a company symbol"
        }
    }
    return jsonify(docs), 200

if __name__ == '__main__':
    app.run(debug=True)
