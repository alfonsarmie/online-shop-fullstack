const { Router } = require('express');
const router = Router();
const { check } = require('express-validator');


const { loginUser } = require('../controllers/auth');
const validateFields = require('../middlewares/validate-fields');






router.post("/login",[
    check('email', 'Email must be a valid one').isEmail(),
    check('password', 'Password is required').notEmpty(),
    validateFields
],loginUser);


module.exports = router;