const { Router } = require('express');
const { check } = require('express-validator');

const { createUser } = require('../controllers/users');
const validateFields = require('../middlewares/validate-fields');
const { existsEmail, existsDni } = require('../helpers/db-validators');



const router = Router();


//TODO: Add middlewares 

router.post("/create", [
    check('email', 'Email must be valid').isEmail(),
    check('email', 'Email is required').notEmpty(),
    check('email', 'Email must be at most 200 characters').isLength({ max: 200 }),
    check('email').custom( existsEmail ), // Custom validator to check if email exists
    check('name', 'Name is required').notEmpty(),
    check('name', 'Name must be at most 200 characters').isLength({ max: 200 }),
    check('surname', 'Surname is required').notEmpty(),
    check('surname', 'Surname must be at most 200 characters').isLength({ max: 200 }),
    check('password', 'Password is required and must be at least 6 characters').isLength({ min: 6 }),
    check('password', 'Password must be at most 200 characters').isLength({ max: 200 }),
    check('password','Password must contain at least one uppercase letter and one number')
        .matches(/^(?=.*[A-Z])(?=.*\d).+$/),
    check('dni', 'DNI must be a number').optional().isNumeric(),
    check('dni', 'DNI must be at most 200 characters').optional().isLength({ max: 200 }),
    check('dni').custom( existsDni ), // Custom validator to check if DNI exists
    check('imgProfile', 'Image profile URL must be a valid one').optional().isURL(),
    check('imgProfile', 'Image profile URL must be at most 200 characters').optional().isLength({ max: 200 }),
    validateFields

], createUser);


router.delete("/delete/:id", [
    check('id', 'ID must be a number').isNumeric(),
    validateFields
],)





module.exports = router;



