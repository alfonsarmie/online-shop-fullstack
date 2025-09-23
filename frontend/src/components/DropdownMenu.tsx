import { Link } from "react-router-dom";

// Interface for category items
interface Category {
  title: string;
  items: string[];
  basePath: string;
}

// Component to display a dropdown menu with product categories and subcategories

function DropdownMenu() {
  // Solo categorías principales, sin subcategorías
  const categories = [
    { title: "Remeras", basePath: "remeras" },
    { title: "Buzos", basePath: "buzos" },
    { title: "Pantalones", basePath: "pantalones" },
    { title: "Camperas", basePath: "camperas" },
    { title: "Tops", basePath: "tops" },
    { title: "Shorts", basePath: "shorts" },
  ];

  return (
    <div className="dropdown">
      <span>PRODUCTOS</span>
      <ul className="dropdown-menu">
        {categories.map((cat) => (
          <li className="dropdown-item" key={cat.title}>
            <Link to={`/catalog/${cat.basePath}`} className="category-title">
              {cat.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default DropdownMenu;
