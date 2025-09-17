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
      title: 'Remeras',
      items: ['Hombre', 'Mujer', 'Niño'],
      basePath: 'remeras'
    },
    {
      title: 'Buzos',
      items: ['Hombre', 'Mujer', 'Niño'],
      basePath: 'buzos'
    },
    {
      title: 'Pantalones',
      items: ['Hombre', 'Mujer', 'Niño'],
      basePath: 'pantalones'
    },
    {
      title: 'Camperas',
      items: ['Hombre', 'Mujer', 'Niño'],
      basePath: 'camperas'
    },
    {
      title: 'Tops',
      items: ['Mujer', 'Niña'],
      basePath: 'tops'
    },
    {
      title: 'Shorts',
      items: ['Hombre', 'Mujer', 'Niño'],
      basePath: 'shorts'
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
            {cat.items.map(gender => (
              <li key={gender}>
                <Link to={`/catalog/${cat.basePath}/${gender.toLowerCase()}`}>
                  {gender}
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