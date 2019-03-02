module.exports = function(io) {
    io.sockets.on('connection', (socket) => {
        socket.emit('connected', 'test');
    })
}