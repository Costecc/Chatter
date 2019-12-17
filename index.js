const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const port = 3000;

server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

app.get('/football', (req, res) => {
    res.sendFile(__dirname + '/public/football.html');
});

app.get('/volleyball', (req, res) => {
    res.sendFile(__dirname + '/public/volleyball.html');
});

app.get('/basketball', (req, res) => {
    res.sendFile(__dirname + '/public/basketball.html');
});

const sports = io.of('/sports');

sports.on('connection', (socket) => {
    socket.on('join', (data) => {
        socket.join(data.room);
        sports.in(data.room).emit('message', `New user joined ${data.room} room!`)
    });

    socket.on('message', (data) => {
        console.log(`message: ${data.msg}`);
        sports.in(data.room).emit('message', data.msg);
    });

    socket.on('disconnect', () => {
        console.log('user disconnected');
        sports.emit('message', 'user disconnected');
    });
});