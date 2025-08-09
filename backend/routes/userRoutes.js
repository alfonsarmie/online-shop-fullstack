const { Router } = require('express');

const { createUser } = require('../controllers/users');



const router = Router();


//TODO: Add middlewares 
router.post("/create", createUser);


module.exports = router;



