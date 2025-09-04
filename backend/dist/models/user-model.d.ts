import { Model, Optional } from 'sequelize';
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
interface UserCreationAttributes extends Optional<UserAttributes, 'idUser' | 'dni' | 'imgProfile' | 'role'> {
}
declare class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
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
    toJSON(): Omit<UserAttributes, 'password'>;
}
export default User;
//# sourceMappingURL=user-model.d.ts.map