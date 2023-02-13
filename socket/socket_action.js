module.exports = (io) => {
    io.on("connection", (socket) => {

        console.log("⚡ connect teacher or student to socket.io")

        socket.on('tx', data => {
            console.log(data)
        })

        socket.on('disconnect',  () => {
            console.log('🔥: A user disconnected');
        })

    })
}