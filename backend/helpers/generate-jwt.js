
const jwt = require('jsonwebtoken');


const generateJWT = ( userId = '') => {

    return new Promise( (resolve, reject) => {
        
        const payload = { userId };
        
        jwt.sign( payload, process.env.JWT_SECRET, {
            expiresIn: '4h' // Token expires in 4 hours
        
        }, (err, token) => {
            
            if (err) {
                console.error(err);
                reject('Error generating JWT');
            
            } else {
            
                resolve(token);
            }
        
        });
    
    });
}

module.exports = {
    generateJWT
};

