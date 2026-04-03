const User = require("../models/user.model");

const getAllUsers = async (req, res) => {

    try {

        const users = await User.find().select(" -password");

        if (!users) {
            return res.status(400).json({ message: "No Users" });
        }

    } catch (error) {

        console.error("Error getting all Users", error);

        res.status(500).json({ message: error.message });

    }
}

const updateUserRole = async (req, res) => {
    try {

        const { role } = req.body;

        const validRoles = ['viewer', 'analyst', 'admin'];
        if (!validRoles.includes(role)) {
            return res.status(400).json({ message: "Invalid role" });
        }

        const user = await User.findByIdAndUpdate(req.params.id,
            { role },
            { new: true }
        ).select("-password");


        res.json({ message: "Role Updated", user });



    } catch (error) {

        console.error("Error Updating user Role", error);

        res.status(500).json({ message: error.message });


    }
}

const updateUserStatus = async (req, res) => {
    try {
        const { status } = req.body;

        const user = await User.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        ).select('-password');

        res.json({ message: "Status updated", user });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = { getAllUsers, updateUserRole, updateUserStatus }