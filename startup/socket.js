const socket = require('socket.io')
const config = require('config')

module.exports = (server) => {
    const io = socket(server, {
        cors: {
            origin: config.get('front'),
            credentials: true
        }
    })
    require('../socket/socket_action')(io)
    // return io;
}