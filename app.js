const express = require('express');
const app = express();
const tasks = require('./routes/tasks')
const connectDB = require('./db/connect')
require('dotenv').config()

app.use(express.json())

app.get('/hello', (req, res) => {
    res.send('Task List')
})

app.use('/api/v1/tasks', tasks)

const port = 5000
const start = async () => {
    try {
        await connectDB(process.env.MONGO_DATABASE)
        app.listen(port, console.log(`Listening on port: ${port}`))
    } catch (err) {
        console.log(err)
    }
}

start()
