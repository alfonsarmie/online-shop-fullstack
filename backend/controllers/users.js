const { request, response } = require("express");


//TODO: CREATE A USER
const createUser = (req = request, res = response) => {
  res.send("User created successfully", 200);
}





module.exports = {  
    createUser
};

