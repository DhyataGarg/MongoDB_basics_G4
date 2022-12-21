const { Users } = require("../models/user");
const jwt = require("jsonwebtoken");

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

const login = async (request, response) => {
    const { username, password } = request.body;
    if (!username || !password) {
        return response.json({
            status: "Error",
            msg: "Username and password required",
        });
    }

    var user = await Users.findOne({ username: username });
    if (!user) {
        return response.json({
            status: "Error",
            msg: "Username not found",
        });
    }

    if (!user.authenticate(password)) {
        return response.json({
            status: "Error",
            msg: "You entered wrong password.",
        });
    }

    var token = jwt.sign({ _id: user._id }, SECREAT_KEY);

    return response.json({ status: "Done", user, token });
};
const isAuthenticate = async (request, response, next) => {
    var token = request.headers.authorization;
    if (!token) {
        return response.json({ status: "Un-Authenticated" });
    }
    var user;
    try {
        user = jwt.verify(token, SECREAT_KEY);
    } catch {
        return response.json({ status: "Un-Authenticated" });
    }

    user = await Users.findById(user._id);

    next();
    // return response.json({ status: "Done", user });
};

module.exports = { signup, login, isAuthenticate };