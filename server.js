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
      connected: true,
    };
  }

  return player;
};

const disconnectPlayerFromCurrentRoom = socket => {
  const roomId = socket.roomId;
  const playerId = socket.playerId;

  if (roomId in rooms && playerId in rooms[roomId].players) {
    rooms[roomId].players[socket.playerId].connected = false;

    playersUpdated(socket);

    console.log(`Disconnected player ${playerId} from room ${roomId}.`);
  }
};

const removePlayerFromCurrentRoom = (socket, force) => {
  const roomId = socket.roomId;
  const playerId = socket.playerId;

  if (roomId in rooms && playerId in rooms[roomId].players) {
    if (force || !rooms[roomId].players[socket.playerId].connected) {
      delete rooms[roomId].players[socket.playerId];

      console.log(`Removed player ${playerId} from room ${roomId}.`);

      if (Object.keys(rooms[roomId].players).length > 0) {
        playersUpdated(socket);
      } else {
        delete rooms[roomId];

        console.log(`Removed stale room ${roomId}.`);
      }

      socket.leave(roomId);
    }
  }
};

const playersUpdated = socket => {
  const roomId = socket.roomId;

  if (roomId in rooms) {
    io.in(roomId).emit('players-updated', rooms[roomId].players);
  }
};

io.on('connection', socket => {
  console.log('connection: new client connected.');

  socket.on('create-room', (options, fn) => {
    console.log(`create-room: creating with options ${options}...`);

    const room = createRoom(options);

    if (room) {
      fn('room-created', room.id);

      console.log(`create-room: created ${room.id}.`);
    } else {
      console.error(`create-room: failed to create room.`);
      fn('room-create-error');
    }
  });

  socket.on('join-room', (roomId, playerId, fn) => {
    console.log(`join-room: joining room ${roomId}...`);

    removePlayerFromCurrentRoom(socket, true);

    if (roomId in rooms) {
      if (playerId && playerId in rooms[roomId].players) {
        console.log(
          `join-room: player ${playerId} re-joining room ${roomId}...`
        );

        rooms[roomId].players[playerId].connected = true;

        playersUpdated(socket);

        fn('room-joined', rooms[roomId], playerId);

        console.log(`join-room: player ${playerId} re-joined room ${roomId}.`);
      } else {
        console.log(`join-room: creating new player for room ${roomId}...`);

        const player = createPlayer(roomId);

        if (player) {
          console.log(
            `join-room: player created ${player.id} for room ${roomId}.`
          );

          rooms[roomId].players[player.id] = player;

          socket.roomId = roomId;
          socket.playerId = player.id;

          socket.join(roomId);

          playersUpdated(socket);

          fn('room-joined', rooms[roomId], player.id);

          console.log(`join-room: player ${player.id} joined room ${roomId}.`);
        } else {
          console.log(`join-room: failed to create player for room ${roomId}.`);
          fn('room-join-error');
        }
      }
    } else {
      console.log(`join-room: room does not exist ${roomId}.`);
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
      console.log(
        `update-player: player ${playerId} not valid for room ${roomId}.`
      );
    }
  });

  socket.on('disconnect', reason => {
    console.log(`disconnect: client disconnected ${reason}.`);

    disconnectPlayerFromCurrentRoom(socket);

    setTimeout(() => {
      removePlayerFromCurrentRoom(socket, false);
    }, 30000);
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
