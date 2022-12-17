const mongoose = require('mongoose');
const studentSchema = new mongoose.Schema({
    // name: { type: String, trim: true },
    email: { type: String, unique: true, required: true },
    age: Number,
    first_name: String,
    last_name: String,
    username: String,
    enc_password: String,
}, { timestamps: true, toJSON: { virtuals: true } });


studentSchema.virtual("name").set(function (name) {
    var splitedName = name.split(" ");
    this.first_name = splitedName[0];
    this.last_name = splitedName[1];
    // console.log(name, splitedName);
}).get(function () {
    return this.first_name + " " + this.last_name;
});

studentSchema.virtual("password").set(function (password) {
    this.enc_password = password + "Hi";
});

studentSchema.methods = {
    authenticate: function (password) {
        return this.enc_password === password + "Hi";
    },
}

const Student = mongoose.model('students', studentSchema);

module.exports = { Student };












