const User = require("../models/user.model.js");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


const generateToken = (user) => {
    return jwt.sign(

        {
            id: user._id, role: user.role
        },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
    )
}


const sendToken = (res, token) => {

    res.cookie('token', token, {
        httpOnly: true,
        secure: false,
        sameSite: 'strict'
    })


}


const register = async (req, res) => {
    console.log("API hit");

    try {

        const { name, email, password, role } = req.body

        const allowedRoles = ['viewer', 'analyst', 'admin'];

        let finalRole = 'viewer';

        // If admin is creating user, allow role assignment
        if (req.user && req.user.role === 'admin' && role && allowedRoles.includes(role)) {
            finalRole = role;
        }
        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ message: "User Already Exists" })
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role: finalRole
        })

        const token = generateToken(user);

        sendToken(res, token);

        res.status(201).json({ message: "User Registred. " })
    } catch (error) {
        console.error("Error creating user, ", error);
        res.status(500).json({ message: error.message });

    }

}


const login = async (req, res) => {

    try {

        if (!req.body) {
            return res.status(400).json({ message: "Request body is missing" });
        }

        const { email, password } = req.body

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: "Invalid Credentials" });
        }

        if (user.status === "inactive") {
            return res.status(403).json({ message: "User is Inactive" });

        }

        if (!password || !user.password) {
            return res.status(400).json({ message: "Invalid Credentials" });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ message: "Invalid Credentials" });
        }

        const token = generateToken(user);
        sendToken(res, token);
        res.json({ message: "Login Successfull" })

    } catch (error) {
        console.error("Error While Login, ", error);

        res.status(500).json({ message: error.message })
    }

}

const logout = async (req, res) => {
    res.clearCookie('token');

    res.json({ message: "Logged out" });


}

module.exports = { register, login, logout }