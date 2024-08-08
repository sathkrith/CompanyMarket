import React, { useEffect } from 'react';

const Unauthorized : React.FC = () => {

    useEffect(() => {
      document.title = '401 - Unauthorized';
    }, []);

    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Unauthorized</h1>
          <p className="text-xl">You do not have permission to view this page. Please log in or register.</p>
          <a href="/" className="mt-4 text-blue-500 underline">Go back to Home</a>
        </div>
      </div>
    );
  };

export default Unauthorized;
