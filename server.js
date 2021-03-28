const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const next = require('next');

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== 'production';
const nextApp = next({dev});
const nextHandler = nextApp.getRequestHandler();

const rooms = {};
let currentRoomId = 1;

io.on('connection', socket => {
  socket.on('createroom', options => {
    const roomId = currentRoomId++;

    rooms[roomId] = {
      options: options,
      players: [],
      messages: [],
    };

    socket.emit('roomcreated', roomId);
  });

  socket.on('joinroom', roomId => {
    if (socket.roomId) {
      socket.leave(socket.roomId);
    }

    if (rooms[roomId]) {
      socket.roomId = roomId;

      socket.join(roomId);

      socket.emit('roomjoined', rooms[roomId]);
    } else {
      socket.emit('invalidroom');
    }
  });

  socket.on('addplayer', name => {
    const roomId = socket.roomId;

    console.log('addplayer: ' + roomId + ', ' + name);

    if (name && roomId) {
      socket.name = name;

      rooms[roomId].players.push(name);

      socket.broadcast.in(roomId).emit('updateplayers', rooms[roomId].players);
    }
  });

  socket.on('sendmessage', message => {
    const roomId = socket.roomId;
    const name = socket.name;

    console.log('sendmessage: ' + roomId + ', ' + name + ', ' + message);

    if (message && roomId && name) {
      rooms[roomId].messages.push(message);

      io.sockets.in(roomId).emit('updatemessages', rooms[roomId].messages);
    }
  });

  socket.on('disconnect', function () {
    const roomId = socket.roomId;

    if (roomId) {
      delete rooms[roomId].players[socket.name];

      if (rooms[roomId].players.length > 0) {
        io.sockets.emit('updateplayers', rooms[roomId].players);
      } else {
        delete rooms[roomId];
      }

      socket.leave(roomId);
    }
  });
});

nextApp.prepare().then(() => {
  app.get('/rooms/:id/cache', (req, res) => {
    res.json(rooms[req.params.id]);
  });

  app.get('*', nextHandler);

  server.listen(port, err => {
    if (err) {
      throw err;
    }

    console.log(`> Ready on http://localhost:${port}`);
  });
});
