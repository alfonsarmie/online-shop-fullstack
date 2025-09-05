import { Link } from 'react-router-dom';

// Component to display a category menu with links
function CategoryMenu({ title, items, basePath }) {
  return (
    <div className="dropdown-category">
      <h4>{title}</h4>
      <ul>

        {/* Render category items */}
        {items.map(item => (
          <li key={item}>
            <Link to={`/productos/${basePath}/${item.toLowerCase()}`}>
              {item}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CategoryMenu;
