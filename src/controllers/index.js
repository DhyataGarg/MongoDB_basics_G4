const { Student } = require("../models/models");

module.exports = {
    getStudents: async (req, res) => {
        var { id, name } = req.query;

        if (id) {
            try {
                // var allStudents = await Student.findById(id).select("name email");
                var allStudents = await Student.findById(id);
                console.log(allStudents.isUserExist(id));
                // console.log(allStudents.name);
            } catch (err) {
                var allStudents = null;
            }
        }
        else if (name) {
            var allStudents = await Student.findOne({ name })
        } else { var allStudents = await Student.find({}); }

        // var allStudents = await Student.find(req.query);

        // var allStudents = await Student.find({ age: { $gt: 25 } });
        // var allStudents = await Student.find({ age: { $lte: 25, $gt: 20 } }); // $gt is greater than and $lte us less than equal to

        // var allStudents = await Student.find({ $or: [{ name: 'Dhyata' }, { name: 'abc' }] });  // or operator

        // var allStudents = await Student.find({ name: { $regex: "Node", $options: "i" } });
        return res.json(allStudents)
    },

    createNewStudent: async (req, res) => {
        // var newStudent = await Student.create(req.body)
        var newStudent = new Student(req.body);
        newStudent.age += 5;
        newStudent = await newStudent.save();
        return res.json({ msg: "Student created", data: newStudent });
    },

    updateStudent: async (req, res) => {
        var StudentId = req.query.id;
        try {
            var studen = await Student.findById(StudentId);
        } catch {
            return response.status(404).json({ data: "Student not found" });
        }
        await Student.findByIdAndUpdate(StudentId, req.body);
        return res.json({ data: "Student updated" });
    },

    deleteStudent: async (req, res) => {
        var studentId = req.query.id;
        await Student.findByIdAndDelete(studentId, req.body);
        return res.json({ data: "Student deleted" });
    },

    login: async (req, res) => {
        const { username, password } = req.body;
        var user = await Student.findOne({ username })
        console.log(username, password);
        if (!user) {
            return res.json({ status: "You have entered wrong username" });
        }

        if (!user.authenticate(password)) {
            return res.json({ status: "You rntered wrong password" });
        }

        user.updatedAt = new Date();
        var user = await user.save();
        user.enc_password = undefined;
        return res.json({ status: "Logged In", user })
    }
}