import User from "../models/user-model";


export const existsEmail = async (email: string): Promise<void> => {
  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    throw new Error(`Ya existe una cuenta con este correo electrónico`);
  }
};


export const existsDni = async (dni: number): Promise<void> => {
  if (dni) {
    const existingDniUser = await User.findOne({ where: { dni } });
    if (existingDniUser) {
      throw new Error(`DNI already exists`);
    }
  }
};

export const existsUserById = async (id: string): Promise<void> => {
  const existsUser = await User.findByPk(id);
  if (!existsUser) {
    throw new Error(`User with ID ${id} does not exist`);
  }
};

