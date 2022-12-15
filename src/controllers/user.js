const { response } = require("express");
const { Users } = require("../models/user");
// const { Jwt } = require("jsonwebtoken");

const signup = async (req, res) => {
    const { name, username, password } = req.body;
    if (!username || !password) {
        return res.json({ status: "Error", msg: "Username and password must be provided!" })
    }

    // validate username

    var isUserExist = await Users.findOne({ username: username });
    if (isUserExist) {
        return res.json({
            status: "Error",
            msg: "User already exists"
        })
    }

    var newUser = await Users.create(req.body);
    newUser.encry_passwrod = undefined;
    newUser.salt = undefined;

    return res.json({
        status: "User Registered successfully",
        user: newUser
    });
}

const login = (req, res) => {
    const { username, password } = req.body;
    var user = new User(username, password);
    if (!user) {
        return res.json({
            status: "Error",
            msg: "Username not found!"
        });
    }

    if (!user.authenticate(password)) {
        return response.json({ status: "Error", msg: "You entered wrong password!" });

    }

    var token = Jwt.sign({ _id: user._id }, user.salt);
    return res.json({ status: "Done", user, token });
}

const isAuthenticate = (req, res) => {
    return res.json({ status: "Done" });
}

module.exports = { signup, login, isAuthenticate };