const user = require("../models/user");


// Validate uniqueness of email
const existsEmail = async (email) => {
  const existingUser = await user.findOne({ where: { email } });
    if (existingUser) {
        throw new Error(`Email already exists`);
    }
}  


// Validate uniqueness of DNI
const existsDni = async (dni) => {
    if (dni) {
        const existingDniUser = await user.findOne({ where: { dni } });
        if (existingDniUser) {
            throw new Error(`DNI already exists`);
        }
    }
}


const existsUserById = async (id) => {

    const existsUser = await user.findByPk(id);

    if (!existsUser) {
        throw new Error(`User with ID ${id} does not exist`);
    }


}        




module.exports = {
    existsEmail,
    existsDni,
    existsUserById
}



      