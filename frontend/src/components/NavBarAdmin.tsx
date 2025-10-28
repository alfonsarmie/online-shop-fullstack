
import { Link } from "react-router-dom";
import "../styles/nav.css";
import "../index.css";
import logo from "../assets/img/logo.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faBars } from "@fortawesome/free-solid-svg-icons";
import { User } from "../types/user";
import { useState, useEffect } from "react";
import UserSidebar from "./UserSideBar";
import SuccessMessage from "./SuccessMessage";


interface NavbarProps {
  user: User | null;
  setUser: (user: User | null) => void;
}

function NavBarAdmin({ user, setUser }: NavbarProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage("");
      }, 3000); 

      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  useEffect(() => {
    if (!isMobileMenuOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      const mobileMenu = document.querySelector('.mobile-menu') as HTMLElement;
      const navToggle = document.querySelector('.nav-toggle') as HTMLElement;
      
      if (mobileMenu && navToggle && 
          !mobileMenu.contains(event.target as Node) && 
          !navToggle.contains(event.target as Node)) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMobileMenuOpen]);

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const openUserSidebar = () => {
    setIsSidebarOpen(true);
  };

  const closeUserSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div>
      <SuccessMessage
        message={successMessage}
        onClose={() => setSuccessMessage("")}
      />

      <nav>
        <div className="nav-toggle" id="navToggle" onClick={handleMobileMenuToggle}>
          <FontAwesomeIcon icon={faBars} />
        </div>

        <div className={`mobile-menu${isMobileMenuOpen ? " open" : ""}`}>
          <button className="nav-toggle close" onClick={handleMobileMenuToggle} aria-label="Cerrar menú">
            &times;
          </button>
          <ul className="mobile-menu-links">
            <li onClick={closeMobileMenu}><Link to="/admin-dashboard">ESTADÍSTICAS</Link></li>
            <li onClick={closeMobileMenu}><Link to="/admin-orders">PEDIDOS</Link></li>
            <li onClick={closeMobileMenu}><Link to="/admin-products">PRODUCTOS</Link></li>
            <li onClick={closeMobileMenu}><Link to="/admin-categories">CATEGORÍAS</Link></li>
            <li onClick={closeMobileMenu}><Link to="/admin-users">USUARIOS</Link></li>
          </ul>
        </div>

        <div className="nav-left">
          <Link to="/admin-dashboard">
            {" "}
            <img src={logo} alt="logo" />
          </Link>
        </div>

        <div className="nav-links" id="navLinks">
          <ul>
            <li>
              <Link to="/admin-dashboard">ESTADÍSTICAS</Link>
            </li>
            <li>
              <Link to="/admin-orders">PEDIDOS</Link>
            </li>
            <li>
              <Link to="/admin-products">PRODUCTOS</Link>
            </li>
            <li>
              <Link to="/admin-categories">CATEGORÍAS</Link>
            </li>
            <li>
              <Link to="/admin-users">USUARIOS</Link>
            </li>
          </ul>
        </div>

        <div className="btnsRight">
          {user ? (
            <>
              <button onClick={openUserSidebar} className="userOptions">
                <FontAwesomeIcon icon={faUser} className="user-icon" />
                <span className="user-name">Hola, {user.name}!</span>
              </button>

              <UserSidebar
                isOpen={isSidebarOpen}
                onClose={closeUserSidebar}
                user={user}
                setUser={setUser}
                setSuccessMessage={setSuccessMessage}
              />
            </>
          ) : (
            <Link to="/login" className="btnLogIn">
              <FontAwesomeIcon icon={faUser} />
            </Link>
          )}
        </div>
      </nav>
    </div>
  );
}

export default NavBarAdmin;
