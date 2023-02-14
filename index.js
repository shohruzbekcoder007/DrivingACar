const express = require('express')
const app = express()

require('./startup/logging')()
// require('./startup/process_error')()
require('./startup/db')()
require('./startup/router')(app)

let server = app.listen(8080, err => {
    if(err)
        console.error(err);
    else
        console.log(`8080 portni tinglash boshlandi!!!`);
})

// const io = require('./startup/socket')(server)
// app.io = io

module.exports.server = server