COPY companies(company_id, name, address, latitude, longitude) FROM '/csv/companies.csv' DELIMITER ',' CSV HEADER;
COPY locations(location_id, company_id, name, address, latitude, longitude) FROM '/csv/locations.csv' DELIMITER ',' CSV HEADER;
