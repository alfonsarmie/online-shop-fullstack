const { request, response } = require("express");
const bcrypt = require("bcryptjs");


const user = require("../models/user");
const { generateJWT } = require("../helpers/generate-jwt");



const loginUser = async(req = request, res = response) => {

    const { email, password } = req.body;

    try {

        // Check if the user exists
        const userFound = await user.findOne({ where: { email } });
        if (!userFound) {
            return res.status(400).json({
                msg: 'Invalid email or password - email'
            });
        }

        // Check if user is active

        if (userFound.status !== 'active') {
            return res.status(400).json({
                msg: 'User is not active. Please contact the administrator.'
            });
        }

        // Verify password
        const validPassword = bcrypt.compareSync(password, userFound.password);
        if (!validPassword) {
            return res.status(400).json({
                msg: 'Invalid email or password - password'
            });
        }

        // Generate JWT
        const token = await generateJWT( userFound.idUser );

        return res.json({
            msg: 'Login successful - User authenticated',
            userFound,
            token
        });

        
    } catch (error) {

        console.log(error);

        return res.status(500).json({
            msg: 'Auth server error. Please contact the administrator.'
        });
        
    }
    
    
}



module.exports = {
    loginUser
};