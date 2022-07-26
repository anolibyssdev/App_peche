import { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/Images/logoPoisson.png";
import "./Navbar.css";

function Navbar() {
  const [showLinks, setShowLinks] = useState(false);

  const handleShowLinks = () => {
    setShowLinks(!showLinks);
  };
  return (
    <nav className={`navbar ${showLinks ? "show-nav" : "hide-nav"}`}>
      <section className="navbar-logo">
        <img src={logo} alt="logo" className="logonav" />
      </section>
      <ul className="navbar_links">
        <li className="navbar_item-slideInDown-logomobile">
          <Link to="/" className="navbar_link">
            <img src={logo} alt="logo" className="logomobile" />
          </Link>
        </li>
        <li className="navbar_item slideInDown-1">
          <Link to="/trouver_un_lieu" className="navbar_link">
            🗺️ Trouver un lieu de pêche
          </Link>
        </li>
        <li className="navbar_item slideInDown-logo">
          <Link to="/" className="navbar_link">
            <img src={logo} alt="logo" className="logo" />
          </Link>
        </li>
        <li className="navbar_item slideInDown-3">
          <Link to="/creer_photo" className="navbar_link">
            📸 Poster une Photo
          </Link>
        </li>
        <li className="navbar_item slideInDown-4">
          <Link to="/contact" className="navbar_link">
            Contact
          </Link>
        </li>
      </ul>
      <button type="button" className="navbar_burger" onClick={handleShowLinks}>
        <span className="burger-bar" />
      </button>
    </nav>
  );
}

export default Navbar;
