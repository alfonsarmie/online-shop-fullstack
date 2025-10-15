import { DataTypes, Model, Optional } from "sequelize";
import db from "../db/connection";

interface OrderAttributes {
  idOrder: number;
  orderDate: Date;
  expectedPickupDate?: Date;
  actualPickupDate?: Date;
  idUser: number;
  idPaymentMethod: number;
  external_reference?: string;
  payment_id?: string;
  total_amount: number;
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  customer_notes?: string;
  sports?: any;
  statusMp?: string; 
  currencyId?: string; 
}

interface OrderCreationAttributes extends Optional<OrderAttributes, 
  "idOrder" | "expectedPickupDate" | "actualPickupDate" | "external_reference" | 
  "payment_id" | "customer_phone" | "customer_notes" | "sports" | "statusMp" | "currencyId"> {}

class Order extends Model<OrderAttributes, OrderCreationAttributes> 
  implements OrderAttributes {
  
  public idOrder!: number;
  public orderDate!: Date;
  public expectedPickupDate?: Date;
  public actualPickupDate?: Date;
  public idUser!: number;
  public idPaymentMethod!: number;
  public external_reference?: string;
  public payment_id?: string;
  public total_amount!: number;
  public customer_name!: string;
  public customer_email!: string;
  public customer_phone?: string;
  public customer_notes?: string;
  public sports?: any;
  public statusMp?: string;
  public currencyId?: string;
}

Order.init({
  idOrder: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  },
  orderDate: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  expectedPickupDate: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  actualPickupDate: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  idUser: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
  },
  idPaymentMethod: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
  },
  external_reference: { //Id that any payment method will refer to the order
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  payment_id: { // Id returned by the payment method (e.g., Mercado Pago payment id)
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  total_amount: { // Total amount of the order
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0,
  },
  customer_name: { // Name of the person that will retire the order
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  customer_email: { // Email of the person that will retire the order
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  customer_phone: { // Phone number of the person that will retire the order
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  customer_notes: { // Additional notes for the order
    type: DataTypes.TEXT,
    allowNull: true,
  },
  sports: { // Sports data related to the order, stored as JSON !
    type: DataTypes.JSON,
    allowNull: true,
  },
  statusMp: { // Status of the payment returned by Mercado Pago 
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  currencyId: { // Currency code, default to 'ARS'
    type: DataTypes.STRING(10),
    allowNull: true,
    defaultValue: 'ARS',
  },
}, {
  sequelize: db,
  tableName: "order",
  timestamps: false,
});

export default Order;