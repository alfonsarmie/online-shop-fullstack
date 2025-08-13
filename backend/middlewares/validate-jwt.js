const jwt = require('jsonwebtoken');
const user = require('../models/user');


const validateJWT = async(req, res, next) => {
    
    const token = req.header('x-token'); //This is the name of the header frontend will send the token
    if (!token) {
        return res.status(401).json({
            message: 'No token provided'
        });
    }

    try {
        
        const { userId } = jwt.verify(token, process.env.JWT_SECRET);
        const idToDelete = req.params.id;
        
        console.log();
        

        const userToValidate = await user.findByPk(userId);

        if (userToValidate.role !== 'admin') {
            return res.status(403).json({
                message: 'You do not have permission to perform this action'
            });
        }

        // Verify if user is not already deleted or exists
        if(!userToValidate || userToValidate.status === 'deleted') {
            return res.status(404).json({
                message: 'User not found or already deleted'
            });
        }


        // Only admin can delete any user, non-admin can only delete themselves
        if (userId !== parseInt(idToDelete, 10) && userToValidate.role !== 'admin') {
            return res.status(403).json({
                message: 'You do not have permission to perform this action'
            });
        }



        next();
    
    
    } catch (error) {

        console.log(error);
        
        return res.status(401).json({
            message: 'Invalid token'
        });
        
    }


}


module.exports = {
    validateJWT
};
