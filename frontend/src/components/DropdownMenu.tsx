import { Link } from 'react-router-dom';

// Interface for category items
interface Category {
  title: string;
  items: string[];
  basePath: string;
}

// Component to display a dropdown menu with product categories and subcategories
function DropdownMenu() {
  const categories: Category[] = [
    {
      title: 'Hombre',
      items: ['Remeras', 'Pantalones', 'Shorts', 'Buzos', 'Accesorios'],
      basePath: 'hombre'
    },
    {
      title: 'Mujer',
      items: ['Remeras', 'Pantalones', 'Shorts', 'Buzos', 'Accesorios'],
      basePath: 'mujer'
    },
    {
      title: 'Niño',
      items: ['Remeras', 'Pantalones', 'Shorts', 'Buzos', 'Accesorios'],
      basePath: 'nino'
    }
  ];

  return (
    <div className="dropdown">
      <span>PRODUCTOS</span>
      <ul className="dropdown-menu">

        {/* Render category items */}
        {categories.map(cat => (
        <li className="dropdown-item" key={cat.title}>
          <span className="category-title">{cat.title}</span> 
          <ul className="submenu">

            {/* Render subcategory items */}
            {cat.items.map(subcat => (
              <li key={subcat}>
                <Link to={`/catalog`}>
                  {subcat}
                </Link>
              </li>
            ))} 
            <li>
              {/* Link to view all products in the category */}
              <Link to={`/catalog/${cat.basePath}`} className="view-all">
                Ver todos
              </Link>
            </li>
          </ul>
        </li>
        ))}
      </ul>
    </div>
  );
}

export default DropdownMenu;