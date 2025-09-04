import { DataTypes, Model, Optional } from 'sequelize';
import db from '../db/connection';

interface UserAttributes {
  idUser: number;
  dni?: number;
  email: string;
  name: string;
  surname: string;
  password: string;
  imgProfile?: string;
  role?: string;
  isMember: boolean;
  registrationDate: Date;
  status: string;
}

interface UserCreationAttributes extends Optional<UserAttributes, 'idUser' | 'dni' | 'imgProfile' | 'role' > {}

class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public idUser!: number;
  public dni?: number;
  public email!: string;
  public name!: string;
  public surname!: string;
  public password!: string;
  public imgProfile?: string;
  public role?: string;
  public isMember!: boolean;
  public registrationDate!: Date;
  public status!: string;

  toJSON(): Omit<UserAttributes, 'password'> {
    const values = Object.assign({}, this.get()) as UserAttributes;
    delete (values as any).password; // Delete password from the object
    return values;
  }  
}

User.init({
  idUser: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false
  },
  dni: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: true
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  surname: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  imgProfile: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  role: {
    type: DataTypes.STRING(50),
    allowNull: true,
    defaultValue: 'client'
  },
  isMember: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  registrationDate: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  status: {
    type: DataTypes.STRING(150),
    allowNull: false,
    defaultValue: 'pending'
  }
}, {
  sequelize: db,
  tableName: 'user',
  timestamps: false
});

export default User;