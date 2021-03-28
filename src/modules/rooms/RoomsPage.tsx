import React, {useState} from 'react';
import {useRouter} from 'next/router';
import {Box, Button, Grid, makeStyles, TextField} from '@material-ui/core';
import {getSocket} from '../../hooks/useSocket';
import {RoomId, ROOM_ID_LENGTH} from './Room';

const socket = getSocket();

const useStyles = makeStyles(() => ({
  roomInput: {
    '& input': {
      textTransform: 'uppercase',
      '&::placeholder': {
        textTransform: 'none',
      },
    },
  },
}));

export const RoomsPage: React.FC = () => {
  const classes = useStyles();
  const router = useRouter();
  const [roomId, setRoomId] = useState<RoomId>('');
  const [showRoomId, setShowRoomId] = useState(false);
  const [roomIdError, setRoomIdError] = useState<string>('');

  const createRoom = () => {
    socket.emit('create-room', {}, (event: string, roomId: RoomId) => {
      if (event === 'room-created') {
        router.push(`/rooms/${roomId}`);
      } else if (event === 'room-create-error') {
        // TODO display friendly error
        console.error('Failed to create room.');
      }
    });
  };

  const joinRoom = () => {
    setRoomIdError('');

    if (roomId.length === ROOM_ID_LENGTH) {
      socket.emit('join-room', roomId, (event: string) => {
        if (event === 'room-joined') {
          router.push(`/rooms/${roomId}`);
        } else if (event === 'room-invalid') {
          setRoomIdError('Room does not exist');
        } else if (event === 'room-join-error') {
          // TODO display friendly error
          console.error('Failed to join room: ' + roomId);
        }
      });
    } else {
      setRoomIdError('Invalid room code');
    }
  };

  let content;

  if (showRoomId) {
    content = (
      <>
        <Box display="flex" p={1} justifyContent="center">
          <Grid item xs={12} sm={4} md={3} lg={2} xl={1}>
            <TextField
              label="Room code"
              placeholder="Enter code..."
              onChange={e => setRoomId(e.target.value)}
              onKeyUp={e => e.key === 'Enter' && joinRoom()}
              value={roomId}
              helperText={roomIdError}
              error={!!roomIdError}
              className={classes.roomInput}
              inputProps={{maxLength: ROOM_ID_LENGTH}}
              fullWidth
            />
          </Grid>
        </Box>

        <Box display="flex" p={1} justifyContent="center">
          <Grid item xs={12} sm={4} md={3} lg={2} xl={1}>
            <Button
              onClick={joinRoom}
              variant="contained"
              color="primary"
              fullWidth
            >
              Join
            </Button>
          </Grid>
        </Box>

        <Box display="flex" p={1} justifyContent="center">
          <Grid item xs={12} sm={4} md={3} lg={2} xl={1}>
            <Button
              onClick={() => setShowRoomId(false)}
              variant="contained"
              color="primary"
              fullWidth
            >
              Back
            </Button>
          </Grid>
        </Box>
      </>
    );
  } else {
    content = (
      <>
        <Box display="flex" p={1} justifyContent="center">
          <Grid item xs={12} sm={4} md={3} lg={2} xl={1}>
            <Button
              onClick={createRoom}
              variant="contained"
              color="primary"
              fullWidth
            >
              Create room
            </Button>
          </Grid>
        </Box>

        <Box display="flex" p={1} justifyContent="center">
          <Grid item xs={12} sm={4} md={3} lg={2} xl={1}>
            <Button
              onClick={() => setShowRoomId(true)}
              variant="contained"
              color="primary"
              fullWidth
            >
              Join room
            </Button>
          </Grid>
        </Box>
      </>
    );
  }

  return (
    <Box
      display="flex"
      height="100%"
      alignContent="center"
      justifyContent="center"
      flexDirection="column"
    >
      {content}
    </Box>
  );
};
