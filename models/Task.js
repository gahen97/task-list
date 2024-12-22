const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        maxlength: [40, 'Name is too long (Cannot be longer than 40 characters)'],
        trim: true
    },
    description: {
        type: String,
        default: '',
        trim: true
    },
    duedate: {
        type: Date,
        default: () => Date.now() + 24 * 60 * 60 * 1000,
        validate: [(value) => {
            const today = new Date();
            today.setHours(0, 0, 0, 0); // Set today's time to 00:00:00 to ignore time part
            const utcToday = new Date(today.toISOString()); // Convert to UTC

            console.log(`Today in EST (local time): ${today}`);
            console.log(`Today in UTC: ${utcToday}`);
            console.log(`Due date: ${value}`);
            console.log(`Is due date >= today? ${value >= utcToday}`);

            return value >= utcToday;
        }, 'Due date cannot be before today']

    },
    completed: {
        type: Boolean,
        default: false
    }
})

module.exports = mongoose.model('Task', TaskSchema)