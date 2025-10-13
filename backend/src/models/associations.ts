import Product from './product-model';
import Category from './category-model';
import Price from './price-model';
import Image from './image-model';
import Size from './size-model';
import ProductSize from './size-product-model';
import Order from './order-model';
import OrderLine from './order-line-model';
import Status from './status-model';
import PaymentMethod from './payment-method-model';
import User from './user-model';

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

  // Order - User
  Order.belongsTo(User, { 
    foreignKey: 'idUser', 
    as: 'user' 
  });
  User.hasMany(Order, { 
    foreignKey: 'idUser', 
    as: 'orders' 
  });

  // Order - PaymentMethod
  Order.belongsTo(PaymentMethod, { 
    foreignKey: 'idPaymentMethod', 
    as: 'paymentMethod' 
  });
  PaymentMethod.hasMany(Order, { 
    foreignKey: 'idPaymentMethod', 
    as: 'orders' 
  });

  // Order - Status (historial)
  Order.hasMany(Status, { 
    foreignKey: 'idOrder', 
    as: 'statusHistory' 
  });
  Status.belongsTo(Order, { 
    foreignKey: 'idOrder', 
    as: 'order' 
  });

  // Order - OrderLine
  Order.hasMany(OrderLine, { 
    foreignKey: 'idOrder', 
    as: 'orderLines' 
  });
  OrderLine.belongsTo(Order, { 
    foreignKey: 'idOrder', 
    as: 'order' 
  });

  // OrderLine - Product
  OrderLine.belongsTo(Product, { 
    foreignKey: 'idProduct', 
    as: 'product' 
  });
  Product.hasMany(OrderLine, { 
    foreignKey: 'idProduct', 
    as: 'orderLines' 
  });
};