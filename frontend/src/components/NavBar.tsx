import React, { useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaHome } from 'react-icons/fa';
import { IoIosArrowBack } from 'react-icons/io';

const Navbar = (): JSX.Element => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  console.log('Navbar render', { user });

  const isHome = location.pathname === '/';

  return (
    <nav className="p-4 fixed w-full top-0 z-10 flex justify-between items-center pr-1.25">
      <div className="text-black flex items-center">
        {isHome ? (
          <FaHome className="text-2xl mr-2" />
        ) : (
          <IoIosArrowBack className="text-2xl mr-2 cursor-pointer" onClick={() => navigate(-1)} />
        )}
        <Link to="/" className="text-2xl font-bold no-underline">Home</Link>
      </div>
      <div className="text-black">
        {user ? (
          <>
            <span className="mr-4">Welcome, {user.username}</span>
            <button
              onClick={logout}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2 no-underline">
              Login
            </Link>
            <Link to="/register" className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded no-underline">
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
