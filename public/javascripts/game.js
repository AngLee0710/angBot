const socket = io('http://localhost:3002');

socket.on('connecnt', function (data) {
    socket.emit('connect', 'asd');
});