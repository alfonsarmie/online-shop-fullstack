import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../services/api";

interface Category {
  idCategory: number;
  name: string;
}

// Component to display a dropdown menu with product categories and subcategories


function DropdownMenu() {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    api.get('/categories')
      .then(res => {
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

  return (
    <div className="dropdown">
      <span>PRODUCTOS</span>
      <ul className="dropdown-menu">
        {categories.map((cat) => (
          <li className="dropdown-item" key={cat.idCategory}>
            <Link to={`/catalog/${cat.name.toLowerCase()}`} className="category-title">
              {cat.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default DropdownMenu;
