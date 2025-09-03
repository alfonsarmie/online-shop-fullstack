import { Link } from 'react-router-dom';

function DropdownMenu() {
  const categories = [
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
        {categories.map(cat => (
        <li className="dropdown-item" key={cat.title}>
          <span className="category-title">{cat.title}</span>  {/* Sin Link */}
          <ul className="submenu">
            {cat.items.map(subcat => (
              <li key={subcat}>
                <Link to={`/productos/${cat.basePath}/${subcat.toLowerCase()}`}>
                  {subcat}
                </Link>
              </li>
            ))}
            {/* Opcional: agregar un enlace "Ver todo" */}
            <li>
              <Link to={`/productos/${cat.basePath}`} className="view-all">
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
