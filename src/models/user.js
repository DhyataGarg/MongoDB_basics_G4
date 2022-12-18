const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");
var CryptoJS = require("crypto-js");

const userSchema = new mongoose.Schema({
    name: String,
    username: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    encry_passwrod: {
        type: String,
        trim: true,
        required: true,
    },
    salt: String,
},
    { timestamps: true }
);

userSchema.virtual("password").set(function (password) {
    this.salt = uuidv4();
    this.encry_passwrod = this.securePassword(password);
}).get(function () { });

userSchema.methods = {
    authenticate: function (plainPassword) {
        return this.encry_passwrod == this.securePassword(plainPassword);
    },
    securePassword: function (plainPassword) {
        if (!plainPassword) return "";
        var ciphertext = CryptoJS.SHA256.encrypt(plainPassword, this.salt).toString();
        return ciphertext;
    },
};

const Users = mongoose.model("Users", userSchema);
module.exports = { Users };