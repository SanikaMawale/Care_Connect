import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';
import './Navbar.css';

const Navbar = ({ showMenu = true }) => {
  const navigate = useNavigate();

  return (
    <nav className="navbar">
      <div className="navbar-left" onClick={() => navigate('/')}>
        <img src={logo} alt="CARE Connect Logo" className="navbar-logo" />
        <span className="brand-name">CARE Connect</span>
      </div>

      {showMenu && (
        <ul className="navbar-links">
          <li onClick={() => navigate('/')}>Home</li>
          <li onClick={() => navigate('/')}>Contact</li>
          <li onClick={() => navigate('/')}>About</li>
        </ul>
      )}
    </nav>
  );
};

export default Navbar;
