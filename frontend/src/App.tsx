import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import CompanyList from './components/CompanyList';
import CompanyDetails from './components/CompanyDetails';
import NotFound from './components/NotFound';
import LoginDialog from './components/LoginDialog';
import RegisterDialog from './components/RegisterDialog';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Unauthorized from './components/Unauthorized';
import Navbar from './components/NavBar';

function App() {
  useEffect(() => {
    console.log('App mounted');
    return () => {
      console.log('App unmounted');
    };
  }, []);
  
  return (
      <Router>
        <AuthProvider>
          <div className='backg'>
            <Navbar />
            <div style={{ paddingTop: '100px' }}> {/* Add padding top to avoid overlap */}
              <Routes>
                <Route path="/" element={<CompanyList />} />
                <Route path="/company/:id" element={<ProtectedRoute component={CompanyDetails} />} />
                <Route path="/login" element={<LoginDialog />} />
                <Route path="/register" element={<RegisterDialog />} />
                <Route path="/unauthorized" element={<Unauthorized />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
          </div>
        </AuthProvider>
      </Router>
  );
}

export default App;