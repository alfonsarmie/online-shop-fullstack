import { DataTypes, Model } from "sequelize";
import db from '../db/connection';

interface ProductSizeAttributes {
  idProduct: number;
  idSize: number;
}

class ProductSize extends Model<ProductSizeAttributes> implements ProductSizeAttributes {
  public idProduct!: number;
  public idSize!: number;
}

ProductSize.init({
  idProduct: {
    type: DataTypes.INTEGER.UNSIGNED,
    primaryKey: true,
    allowNull: false
  },
  idSize: {
    type: DataTypes.INTEGER.UNSIGNED,
    primaryKey: true,
    allowNull: false
  }
}, {
  sequelize: db,
  tableName: 'product_size',
  timestamps: false
});

export default ProductSize;