import { DataTypes, Model } from "sequelize";
import db from "../db/connection";

interface OrderLineAttributes {
  idOrder: number;
  idProduct: number;
  quantity: number;
  unit_price: number;
  size?: string;
  product_name: string;
}

class OrderLine extends Model<OrderLineAttributes> implements OrderLineAttributes {
  public idOrder!: number;
  public idProduct!: number;
  public quantity!: number;
  public unit_price!: number;
  public size?: string;
  public product_name!: string;
}

OrderLine.init(
  {
    idOrder: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      allowNull: false,
    },
    idProduct: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    unit_price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    size: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    product_name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
  },
  {
    sequelize: db,
    tableName: "order_line",
    timestamps: false,
  }
);

export default OrderLine;