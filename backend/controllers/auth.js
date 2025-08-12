const { request, response } = require("express");



const user = require("../models/user");



const loginUser = async(req = request, res = response) => {
    res.send("Login endpoint is not implemented yet");
}



module.exports = {
    loginUser
};