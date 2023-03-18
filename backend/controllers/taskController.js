const asyncHandler = require('express-async-handler');
const Task = require('../models/taskModel')
const User = require('../models/userModel')

// @description : Get tasks
// @route: GET /api/tasks
// @access :private
const getTask = asyncHandler(async (req, res) => {

    const tasks = await Task.find({ user: req.user.id });
    res.status(200).json(tasks);
})

// @description : set tasks
// @route: POST /api/tasks
// @access :private
const setTask = asyncHandler(async (req, res) => {

    //console.log(req.body);
    const task = await Task.create({
        text: req.body.text,
        user: req.user.id
    });
    if (!req.body.text) {
        res.status(400);
        throw new Error('Please add the text field');
    }

    res.status(200).json(task)
})

// @description : Update tasks
// @route: PUT /api/tasks
// @access :private
const updateTask = asyncHandler(async (req, res) => {

    const task = await Task.findById(req.params.id);
    if (!task) {
        res.status(400);
        throw new Error("Task not found");
    }

    // check for user
    const user = await User.findById(req.user.id);
    if (!user) {
        res.status(400);
        throw new Error("User not found");

    }

    // to check whether logged in user matches the goal user
    if (task.user.toString() !== user.id) {
        res.status(400);
        throw new Error("User not authorized");
    }

    const updatedData = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true })

    res.status(200).json(updatedData);
})

// @description : Delete tasks
// @route: DELETE /api/tasks
// @access :private
const deleteTask = asyncHandler(async (req, res) => {

    const task = await Task.findById(req.params.id);
    if (!task) {

        res.status(400);
        throw new Error('Task not found');
    }
    // check for user
    const user = await User.findById(req.user.id);
    if (!user) {
        res.status(400);
        throw new Error("User not found");

    }

    // to check whether logged in user matches the goal user
    if (task.user.toString() !== user.id) {
        res.status(400);
        throw new Error("User not authorized");
    }

    await Task.findByIdAndDelete(req.params.id);

    res.status(200).json({
        id: req.params.id
    })
})



module.exports = { getTask, setTask, updateTask, deleteTask };