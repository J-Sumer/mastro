const express = require('express')
const app = express()

const morgan = require('morgan')
const bodyParser = require('body-parser')
const cors = require('cors')
require('dotenv').config();
const expressJwt = require('express-jwt')
const mongoose = require('mongoose')

// DB connection
mongoose.connect(process.env.DATABASE, {})
    .then(() => console.log("DB connected"))
    .catch((err) => console.log("DB Error => ", err));

//apply middleware 
app.use(morgan('dev'))
app.use(bodyParser.json())
app.use(cors({
    origin: process.env.CLIENT_URL
}))

// Import routes
const authRoutes = require('./routes/auth.js')
const userRoutes = require('./routes/user.js')
// Use routes
app.use('/api', authRoutes)
app.use('/api', userRoutes)


// Default route
app.get('/', (req, res) => {
    res.send("Your have reached the default route")
})

const port = process.env.PORT || 8000
app.listen(port, () => {
    console.log(`Listening on port ${port}`)
}) 