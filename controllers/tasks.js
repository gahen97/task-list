const Task = require('../models/Task.js')
const asyncWrapper = require('../middleware/async.js')
const { createCustomError } = require('../errors/custom-error.js')

const createTask = asyncWrapper(async (req, res) => {
    const task = await Task.create(req.body)
    res.status(201).json({ task })

})

const updateTask = asyncWrapper(async (req, res) => {
    const task = await Task.findOneAndUpdate({ _id: req.params.id }, req.body, {
        new: true,
        runValidators: true
    })
    if (!task) {
        return next(createCustomError(`ID : ${req.params.id} does not correspond to any Tasks`, 404))
    }
    res.status(200).json({ task })
})

const deleteTask = asyncWrapper(async (req, res) => {
    const task = await Task.findOneAndDelete({ _id: req.params.id })
    if (!task) {
        return next(createCustomError(`ID : ${req.params.id} does not correspond to any Tasks`, 404))
    }
    res.status(200).json({ task })
})

const getTask = asyncWrapper(async (req, res) => {
    const task = await Task.findOne({ _id: req.params.id })
    if (!task) {
        return next(createCustomError(`ID : ${req.params.id} does not correspond to any Tasks`, 404))
    }
    res.status(200).json({ task })
})

const getAllTasks = asyncWrapper(async (req, res) => {
    const tasks = await Task.find({})
    tasks.sort((a, b) => new Date(a.duedate) - new Date(b.duedate));
    res.status(200).json({ tasks })
})


module.exports = {
    createTask,
    updateTask,
    deleteTask,
    getTask,
    getAllTasks
}