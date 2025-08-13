const jwt = require('jsonwebtoken');


const validateJWT = (req, res, next) => {
    
    const token = req.header('x-token'); //This is the name of the header frontend will send the token
    if (!token) {
        return res.status(401).json({
            message: 'No token provided'
        });
    }

    try {
        
        const { userId } = jwt.verify(token, process.env.JWT_SECRET);
        
        const idToDelete = req.params.id;
        
        if (userId !== parseInt(idToDelete, 10)) {
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
