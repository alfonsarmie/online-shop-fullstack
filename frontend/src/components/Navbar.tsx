import { Link, useNavigate } from "react-router-dom";
import "../styles/nav.css";
import "../index.css";
import logo from "../assets/img/logo.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faCartShopping,
  faBars,
  faMagnifyingGlass,
} from "@fortawesome/free-solid-svg-icons";
import { useCart } from "./CartContext";
import DropdownMenu from "./DropdownMenu";
import { User } from "../types/user";
import { useState, useEffect, useRef, type ChangeEvent, type FormEvent } from "react";
import UserSidebar from "./UserSideBar";
import SuccessMessage from "./SuccessMessage";

interface NavbarProps {
  user: User | null;
  setUser: (user: User | null) => void;
}

function Navbar({ user, setUser }: NavbarProps) {
  const navigate = useNavigate();
  const { openCart, cartCount } = useCart();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileDropdownOpen, setIsMobileDropdownOpen] = useState(false);
  const [isMainMenuAnimating, setIsMainMenuAnimating] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage("");
      }, 3000); 

      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  useEffect(() => {
    if (!isSearchOpen) {
      return;
    }

    const focusTimer = window.setTimeout(() => {
      searchInputRef.current?.focus();
    }, 0);

    return () => window.clearTimeout(focusTimer);
  }, [isSearchOpen]);

  useEffect(() => {
    if (!isSearchOpen) {
      return;
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setIsSearchOpen(false);
        setSearchTerm("");
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsSearchOpen(false);
        setSearchTerm("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isSearchOpen]);

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen((prev) => !prev);
    setIsMobileDropdownOpen(false);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    setIsMobileDropdownOpen(false);
  };

  const handleMobileDropdownToggle = () => {
    setIsMobileDropdownOpen((prev) => !prev);
  };

  const handleBackToMainMenu = () => {
    setIsMobileDropdownOpen(false);
    setIsMainMenuAnimating(true);

    setTimeout(() => {
      setIsMainMenuAnimating(false);
    }, 400); 
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleHomeClick = () => {
    navigate("/");
    window.scrollTo(0, 0);
    closeMobileMenu(); 
  };

  const handleSearchToggle = () => {
    setIsSearchOpen((prev) => {
      if (prev) {
        setSearchTerm("");
      }
      return !prev;
    });
  };

  const handleSearchInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedQuery = searchTerm.trim();

    if (!trimmedQuery) {
      return;
    }

    navigate(`/catalog?search=${encodeURIComponent(trimmedQuery)}`);
    setIsSearchOpen(false);
    setSearchTerm("");
    window.scrollTo(0, 0);
  };

  const openOptions = () => {
    const optionsMenu = document.getElementById("optionsMenu");
    if (optionsMenu) {
      optionsMenu.classList.toggle("show");
    }
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

        <div className="nav-left" onClick={handleHomeClick}>
          <Link to="/">
            <img src={logo} alt="logo" />
          </Link>
        </div>

        <div className={`mobile-menu${isMobileMenuOpen ? " open" : ""}`}>
          <button className="nav-toggle close" onClick={handleMobileMenuToggle} aria-label="Cerrar menú">
            &times;
          </button>
          {!isMobileDropdownOpen ? (
            <ul className={`mobile-menu-links${isMainMenuAnimating ? " animate-main-menu" : ""}`}>
              <li onClick={handleHomeClick}><Link to="/">INICIO</Link></li>
              <li>
                <button className="mobile-dropdown-btn" onClick={handleMobileDropdownToggle}>
                  PRODUCTOS
                  <span className={`mobile-dropdown-caret${isMobileDropdownOpen ? " open" : ""}`}>{isMobileDropdownOpen ? "↓" : "→"}</span>
                </button>
              </li>
              <li onClick={closeMobileMenu}><Link to="/about-us">ACERCA DE NOSOTROS</Link></li>
              <li onClick={closeMobileMenu}><Link to="/delivery">FORMAS DE ENTREGA</Link></li>
            </ul>
          ) : (
            <div className="dropdown-mobile">
              <DropdownMenu 
                mobile={true} 
                isOpen={isMobileDropdownOpen} 
                onClose={closeMobileMenu}
                onBackToMenu={handleBackToMainMenu}
              />
            </div>
          )}
        </div>

        <div className="nav-links" id="navLinks">
          <ul>
            <li onClick={handleHomeClick}>
              <Link to="/">INICIO</Link>
            </li>
            <li>
              <DropdownMenu />
            </li>
            <li>
              <Link to="/about-us">ACERCA DE NOSOTROS</Link>
            </li>
            <li>
              <Link to="/delivery">FORMAS DE ENTREGA</Link>
            </li>
          </ul>
        </div>

        <div className="btnsRight">
          <div
            ref={searchContainerRef}
            className={`nav-search${isSearchOpen ? " open" : ""}`}
          >
            <button
              type="button"
              className="nav-search__toggle"
              onClick={handleSearchToggle}
              aria-expanded={isSearchOpen}
              aria-controls="nav-search-form"
              aria-label={isSearchOpen ? "Cerrar buscador" : "Abrir buscador"}
            >
              <FontAwesomeIcon icon={faMagnifyingGlass} />
            </button>

            <form
              id="nav-search-form"
              className="nav-search__form"
              role="search"
              aria-hidden={!isSearchOpen}
              onSubmit={handleSearchSubmit}
            >
              <input
                ref={searchInputRef}
                type="search"
                value={searchTerm}
                onChange={handleSearchInputChange}
                placeholder="Buscar productos..."
                aria-label="Buscar productos"
                tabIndex={isSearchOpen ? 0 : -1}
              />
              <button
                type="submit"
                className="nav-search__submit"
                aria-label="Buscar"
                tabIndex={isSearchOpen ? 0 : -1}
              >
                <FontAwesomeIcon icon={faMagnifyingGlass} />
              </button>
            </form>
          </div>

          {user ? (
            <>
              <button onClick={openUserSidebar} className="userOptions">
                <FontAwesomeIcon icon={faUser} className="user-icon" />
                <span className="user-name">Hola, {user.name}!</span>
              </button>

              {user.role === "admin" && <></>}

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

          {(!user || (user.role !== "admin" && user.role !== "receptionist")) && (
            <button onClick={openCart} className="cart-icon cart-btn">
              <FontAwesomeIcon icon={faCartShopping} />
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </button>
          )}
        </div>
      </nav>
    </div>
  );
}

export default Navbar;

