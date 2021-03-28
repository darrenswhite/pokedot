const app = require('express')();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const next = require('next');
const nanoid = require('nanoid');

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== 'production';
const nextApp = next({dev});
const nextHandler = nextApp.getRequestHandler();

const rooms = {};

const ID_MAX_RETRIES = 1000;

const generateId = nanoid.customAlphabet(
  'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
  4
);

const generateIdWithRetry = array => {
  let currentId;
  let validId;

  for (let i = 0; i < ID_MAX_RETRIES; i++) {
    currentId = generateId();

    if (!(currentId in array)) {
      validId = currentId;
      break;
    }
  }

  return validId;
};

const createRoom = options => {
  const id = generateIdWithRetry(rooms);
  let room;

  if (id) {
    room = {
      id,
      options,
      players: {},
    };

    rooms[id] = room;
  }

  return room;
};

const createPlayer = roomId => {
  const id = generateIdWithRetry(rooms[roomId].players);
  let player;

  if (id) {
    player = {
      id,
    };
  }

  return player;
};

const removePlayerFromCurrentRoom = socket => {
  const roomId = socket.roomId;
  const playerId = socket.playerId;

  if (roomId in rooms && playerId in rooms[roomId].players) {
    delete rooms[roomId].players[socket.playerId];

    if (Object.keys(rooms[roomId].players).length > 0) {
      playersUpdated(socket, roomId);
    } else {
      delete rooms[roomId];
    }

    socket.leave(roomId);
  }
};

const playersUpdated = (socket, roomId) => {
  socket.broadcast.in(roomId).emit('players-updated', rooms[roomId].players);
};

io.on('connection', socket => {
  socket.on('create-room', (options, fn) => {
    const room = createRoom(options);

    if (room) {
      fn('room-created', room.id);
    } else {
      fn('room-create-error');
    }
  });

  socket.on('join-room', (roomId, fn) => {
    if (socket.roomId !== roomId) {
      removePlayerFromCurrentRoom(socket);

      if (roomId in rooms) {
        const player = createPlayer(roomId);

        if (player) {
          rooms[roomId].players[player.id] = player;

          socket.roomId = roomId;
          socket.playerId = player.id;

          socket.join(roomId);

          playersUpdated(socket, roomId);

          fn('room-joined', rooms[roomId]);
        } else {
          fn('room-join-error');
        }
      } else {
        fn('room-invalid', roomId);
      }
    } else {
      fn('room-joined', rooms[roomId]);
    }
  });

  socket.on('update-player', player => {
    const roomId = socket.roomId;
    const playerId = socket.playerId;

    if (
      roomId in rooms &&
      playerId in rooms[roomId].players &&
      player.id === playerId
    ) {
      rooms[roomId].players = player;

      playersUpdated();
    }
  });

  socket.on('disconnect', () => {
    removePlayerFromCurrentRoom(socket);
  });
});

nextApp.prepare().then(() => {
  app.get('*', nextHandler);

  server.listen(port, err => {
    if (err) {
      throw err;
    }

    console.log(`> Ready on http://localhost:${port}`);
  });
});