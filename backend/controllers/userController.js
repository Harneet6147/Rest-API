const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const asyncHandler = require('express-async-handler');
const User = require('../models/userModel')

// @description : Register user
// @route: POST /api/users
// @access :public
const registerUser = asyncHandler(async (req, res) => {

    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        res.status(400)
        throw new Error("Please enter all fields")

    }

    //check whether user is already registered
    const userRegistered = await User.findOne({ email });
    if (userRegistered) {
        res.status(404);
        throw new Error("User already Registered");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
        name: name,
        email: email,
        password: hashedPassword
    })

    if (user) {

        res.status(200).json({

            _id: user.id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id)
        });
    }
    else {
        res.status(404);
        throw new Error("Invalid credentials");
    }
})


// @description : Authenticate user
// @route: POST /api/users/login
// @access :public
const loginUser = asyncHandler(async (req, res) => {

    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
        res.status(200).json({
            _id: user.id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id)
        })
    }
    else {
        res.status(404);
        throw new Error("Invalid credentials");
    }
})


// @description : getME
// @route: POST /api/users/me
// @access :private
const getMe = asyncHandler(async (req, res) => {

    const { email, name, _id } = await User.findById(req.user.id);

    res.status(200).json({
        _id: _id,
        name: name,
        email: email
    });
})

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
}

module.exports = { registerUser, loginUser, getMe };