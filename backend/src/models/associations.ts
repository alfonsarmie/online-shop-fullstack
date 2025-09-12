import Product from './product-model';
import Category from './category-model';
import Price from './price-model';
import Image from './image-model';
import Size from './size-model';
import ProductSize from './size-product-model';

export const defineAssociations = () => {
  // Product - Category
  Product.belongsTo(Category, { 
    foreignKey: 'idCategory', 
    as: 'category' 
  });
  Category.hasMany(Product, { 
    foreignKey: 'idCategory', 
    as: 'products' 
  });

  // Product - Price
  Product.hasMany(Price, { 
    foreignKey: 'idProduct', 
    as: 'prices' 
  });
  Price.belongsTo(Product, { 
    foreignKey: 'idProduct', 
    as: 'product' 
  });

  // Product - Image
  Product.hasMany(Image, { 
    foreignKey: 'idProduct', 
    as: 'images' 
  });
  Image.belongsTo(Product, { 
    foreignKey: 'idProduct', 
    as: 'product' 
  });

  // Product - Size (Many-to-Many)
  Product.belongsToMany(Size, {
    through: ProductSize,
    foreignKey: 'idProduct',
    otherKey: 'idSize',
    as: 'sizes'
  });
  Size.belongsToMany(Product, {
    through: ProductSize,
    foreignKey: 'idSize',
    otherKey: 'idProduct',
    as: 'products'
  });

  // ProductSize associations
  ProductSize.belongsTo(Product, { 
    foreignKey: 'idProduct', 
    as: 'product' 
  });
  ProductSize.belongsTo(Size, { 
    foreignKey: 'idSize', 
    as: 'size' 
  });
};