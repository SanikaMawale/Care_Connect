import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import './Home.css';

const Home = () => {
  const [showLogin, setShowLogin] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (role) => {
    navigate(`login/${role}`);
    setShowLogin(false);
  };

  return (
    <div className="home">
      <Navbar />

      <div className="intro">
        <h2>Welcome to CARE Connect</h2>
        <p>
          A secure and efficient hospital management platform for doctors,
          staff, patients, and pharmacy.
        </p>

        <button onClick={() => setShowLogin(true)}>Login</button>
      </div>

      {showLogin && (
        <div className="modal">
          <div className="modal-content">
            <h3>Select Login Type</h3>
            <button onClick={() => handleLogin('doctor')}>Doctor</button>
            <button onClick={() => handleLogin('staff')}>Staff</button>
            <button onClick={() => handleLogin('patient')}>Patient</button>
            <button onClick={() => handleLogin('pharmacy')}>Pharmacy</button>
            <button onClick={() => setShowLogin(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
