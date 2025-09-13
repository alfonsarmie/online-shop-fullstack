/**
 * Admin Navigation Bar
 * Purpose: top navigation for all `/admin/*` pages.
 * Reuses public navbar styles for visual consistency and exposes admin links.
 */
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

// Navbar props interface
// Props contract: current user (or null) and a setter to update auth state
interface NavbarProps {
  user: User | null;
  setUser: (user: User | null) => void;
}

function NavBarAdmin({ user, setUser }: NavbarProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Effect to auto-clear success messages after 3 seconds
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage("");
      }, 3000); // 3 seconds

      // Clear the timer if the component unmounts or the message changes
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  // Toggle sidebar function
  // se borra?
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Removed custom home click; logo link handles navigation

  // Toggle options menu
  // se borra?
  const openOptions = () => {
    const optionsMenu = document.getElementById("optionsMenu");
    if (optionsMenu) {
      optionsMenu.classList.toggle("show");
    }
  };

  // Open user sidebar
  const openUserSidebar = () => {
    setIsSidebarOpen(true);
  };

  // Close user sidebar
  const closeUserSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div>
      {/* SuccessMessage a nivel superior */}
      <SuccessMessage
        message={successMessage}
        onClose={() => setSuccessMessage("")}
      />

      <nav>
        <div className="nav-toggle" id="navToggle">
          <FontAwesomeIcon icon={faBars} />
        </div>

        <div className="nav-left">
          <Link to="/admin-dashboard">
            {" "}
            {/* debería renderizarse el dashboard */}
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
          </ul>
        </div>

        <div className="btnsRight">
          {/* conditional rendering */}
          {user ? (
            <>
              {/* Button to open user sidebar */}
              <button onClick={openUserSidebar} className="userOptions">
                <span className="user-name">Hola, {user.name}!</span>
              </button>

              {/* User Sidebar is only displayed if user exists */}
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
