import { DataTypes, Model, Optional } from "sequelize";
import db from "../db/connection";

interface ProductAttributes {
  idProduct: number;
  name: string;
  description: string;
  stock: number;
  idCategory: number;
}

interface ProductCreationAttributes
  extends Optional<ProductAttributes, "idProduct"> {}

class Product
  extends Model<ProductAttributes, ProductCreationAttributes>
  implements ProductAttributes
{
  public idProduct!: number;
  public name!: string;
  public description!: string;
  public stock!: number;
  public idCategory!: number;
}

Product.init(
  {
    idProduct: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING(500),
      allowNull: false,
      defaultValue: "",
    },
    stock: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0,
    },
    idCategory: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
  },
  {
    sequelize: db,
    tableName: "product",
    timestamps: false,
  }
);

export default Product;
