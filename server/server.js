var express = require('express')
var app = express()

var authRoutes = require('./routes/auth.js')

app.use('/api', authRoutes)


var port = process.env.PORT || 8000
app.listen(port, () => {
    console.log(`Listening on port ${port}`)
}) 