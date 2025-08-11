const { validationResult } = require("express-validator");


const validateFields = (req, res, next) => {
  
    const errors = validationResult(req);
    if ( !errors.isEmpty() ) {
            return res.status(400).json({
            errors
            });
    }
    
    // If there are no validation errors, proceed to the next middleware or controller
    next();
}


module.exports = validateFields;