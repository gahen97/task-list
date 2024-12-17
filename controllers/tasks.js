const Task = require('../models/Task.js')
const createTask = (req, res) => {
    res.json(req.body)
}

const updateTask = (req, res) => {
    res.send('Modify Task')
}

const deleteTask = (req, res) => {
    res.send('Delete Task')
}

const getTask = (req, res) => {
    res.json({ id: req.params.id })
}

const getAllTasks = (req, res) => {
    res.send('All Items')
}


module.exports = {
    createTask,
    updateTask,
    deleteTask,
    getTask,
    getAllTasks
}