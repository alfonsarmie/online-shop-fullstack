import { Link } from "react-router-dom";
import { useEffect, useRef, useState, type FocusEvent, type KeyboardEvent } from "react";
import api from "../services/api";

interface Category {
  idCategory: number;
  name: string;
}

interface DropdownMenuProps {
  mobile?: boolean;
  isOpen?: boolean;
  onClose?: () => void;
  onBackToMenu?: () => void;
}

function DropdownMenu({ mobile = false, isOpen: mobileOpen, onClose, onBackToMenu }: DropdownMenuProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const closeTimer = useRef<number | null>(null);
  const menuId = "products-menu";

  useEffect(() => {
    api
      .get("/categories")
      .then((res) => {
        if (Array.isArray(res.data)) {
          setCategories(res.data);
        } else if (res.data && Array.isArray(res.data.categories)) {
          setCategories(res.data.categories);
        } else {
          setCategories([]);
        }
      })
      .catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    return () => {
      if (closeTimer.current !== null) {
        window.clearTimeout(closeTimer.current);
      }
    };
  }, []);

  const clearCloseTimer = () => {
    if (closeTimer.current !== null) {
      window.clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };

  const openMenu = () => {
    clearCloseTimer();
    setIsOpen(true);
  } 

  const scheduleClose = () => {
    clearCloseTimer();
    closeTimer.current = window.setTimeout(() => setIsOpen(false), 140);
    if (onClose) onClose();
  };

  const handleToggle = () => {
    if (isOpen) {
      scheduleClose();
    } else {
      openMenu();
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLSpanElement>) => {
    if (event.key === "Escape") {
      event.stopPropagation();
      scheduleClose();
      return;
    }

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleToggle();
    }
  };

  const handleBlur = (event: FocusEvent<HTMLDivElement>) => {
    const nextTarget = event.relatedTarget as Node | null;

    if (!event.currentTarget.contains(nextTarget)) {
      scheduleClose();
    }
  };

  // MOBILE SIDEBAR MODE
  if (mobile) {
    return (
      <div className={`dropdown-mobile${mobileOpen ? " is-open" : ""}`}> 
        <button
          className="back-arrow-mobile"
          onClick={onBackToMenu || onClose}
        >
          ← Volver
        </button>
        <ul
          className={`dropdown-menu-mobile${mobileOpen ? " animate-mobile-dropdown" : ""}`}
          aria-label="Categorias de productos"
        >
          {categories.map((cat) => (
            <li className="dropdown-item" key={cat.idCategory}>
              <Link
                to={`/catalog/${cat.name.toLowerCase()}`}
                className="category-title"
                onClick={onClose}
              >
                {cat.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  // DESKTOP DROPDOWN
  return (
    <div
      className={`dropdown${isOpen ? " is-open" : ""}`}
      role="navigation"
      onMouseEnter={openMenu}
      onMouseLeave={scheduleClose}
      onFocusCapture={openMenu}
      onBlurCapture={handleBlur}
    >
      <span
        className="dropdown-trigger"
        tabIndex={0}
        role="button"
        aria-haspopup="true"
        aria-expanded={isOpen}
        aria-controls={menuId}
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
      >
        PRODUCTOS
      </span>
      {isOpen && (
        <ul
          className="dropdown-menu"
          id={menuId}
          aria-label="Categorias de productos"
          onMouseEnter={openMenu}
          onMouseLeave={scheduleClose}
        >
          {categories.map((cat) => (
            <li className="dropdown-item" key={cat.idCategory}>
              <Link
                to={`/catalog/${cat.name.toLowerCase()}`}
                className="category-title"
                onClick={scheduleClose}
              >
                {cat.name}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default DropdownMenu;




