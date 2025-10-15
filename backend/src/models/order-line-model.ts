import { DataTypes, Model } from "sequelize";
import db from "../db/connection";

interface OrderLineAttributes {
  idOrder: number;
  idProduct: number;
  quantity: number;
  subtotal: number;
}

class OrderLine extends Model<OrderLineAttributes> implements OrderLineAttributes {
  public idOrder!: number;
  public idProduct!: number;
  public quantity!: number;
  public subtotal!: number;
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
    subtotal: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    }
  },
  {
    sequelize: db,
    tableName: "order_line",
    timestamps: false,
  }
);

export default OrderLine;