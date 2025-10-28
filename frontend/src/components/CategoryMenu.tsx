import { Link } from 'react-router-dom';

interface CategoryMenuProps {
  title: string;
  items: string[];
  basePath: string;
}

function CategoryMenu({ title, items, basePath }: CategoryMenuProps) {
  return (
    <div className="dropdown-category">
      <h4>{title}</h4>
      <ul>

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