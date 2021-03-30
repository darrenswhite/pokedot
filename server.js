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
      name: 'Anonymous',
      ready: false,
      team: [],
    };
  }

  return player;
};

const removePlayerFromCurrentRoom = socket => {
  const roomId = socket.roomId;
  const playerId = socket.playerId;

  if (roomId in rooms && playerId in rooms[roomId].players) {
    delete rooms[roomId].players[socket.playerId];

    console.log(`Removed playing ${playerId} from room ${roomId}`);

    if (Object.keys(rooms[roomId].players).length > 0) {
      playersUpdated(socket);
    } else {
      delete rooms[roomId];

      console.log(`Removed stale room ${roomId}`);
    }

    socket.leave(roomId);
  }
};

const playersUpdated = socket => {
  const roomId = socket.roomId;

  if (roomId in rooms) {
    io.in(roomId).emit('players-updated', rooms[roomId].players);
  }
};

io.on('connection', socket => {
  console.log('New client connected');

  socket.on('create-room', (options, fn) => {
    const room = createRoom(options);

    if (room) {
      fn('room-created', room.id);

      console.log(`Created room ${room.id}`);
    } else {
      console.error('Failed to create room');
      fn('room-create-error');
    }
  });

  socket.on('join-room', (roomId, fn) => {
    console.log(`join-room request ${roomId}`);

    removePlayerFromCurrentRoom(socket);

    if (roomId in rooms) {
      const player = createPlayer(roomId);

      if (player) {
        rooms[roomId].players[player.id] = player;

        socket.roomId = roomId;
        socket.playerId = player.id;

        socket.join(roomId);

        playersUpdated(socket);

        fn('room-joined', rooms[roomId], player.id);

        console.log(`Player ${player.id} joined room ${roomId}`);
      } else {
        console.log('Failed to create player');
        fn('room-join-error');
      }
    } else {
      console.log('Room does not exist');
      fn('room-invalid');
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
      rooms[roomId].players[playerId] = player;

      playersUpdated(socket);
    } else {
      console.log('Player not valid');
    }
  });

  socket.on('disconnect', reason => {
    console.log('Client disconnected ', reason);

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
