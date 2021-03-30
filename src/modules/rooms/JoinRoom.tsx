import React, {useState} from 'react';
import {useRouter} from 'next/router';
import {Button, Grid, makeStyles, TextField} from '@material-ui/core';
import {ROOM_ID_LENGTH} from '../../hooks/useRoom';

const useStyles = makeStyles(() => ({
  roomInput: {
    '& input': {
      // textTransform: 'uppercase',
      '&::placeholder': {
        // textTransform: 'none',
      },
    },
  },
}));

export interface JoinRoomProps {
  onBack: () => void;
}

export const JoinRoom: React.FC<JoinRoomProps> = ({onBack}: JoinRoomProps) => {
  const classes = useStyles();
  const router = useRouter();
  const [roomId, setRoomId] = useState<string>('');

  const joinRoom = () => {
    router.push(`/rooms/${roomId}`);
  };

  return (
    <Grid
      container
      justify="center"
      direction="column"
      spacing={2}
      style={{height: '100%'}}
    >
      <Grid item container justify="center">
        <Grid item xs={12} sm={4} md={3} lg={2} xl={1}>
          <TextField
            label="Room code"
            placeholder="Enter code..."
            onChange={e => setRoomId(e.target.value.trim())}
            onKeyUp={e => e.key === 'Enter' && joinRoom()}
            value={roomId}
            className={classes.roomInput}
            inputProps={{maxLength: ROOM_ID_LENGTH}}
            fullWidth
          />
        </Grid>
      </Grid>

      <Grid item container justify="center">
        <Grid item xs={12} sm={4} md={3} lg={2} xl={1}>
          <Button
            onClick={joinRoom}
            variant="contained"
            color="primary"
            fullWidth
          >
            Join room
          </Button>
        </Grid>
      </Grid>

      <Grid item container justify="center">
        <Grid item xs={12} sm={4} md={3} lg={2} xl={1}>
          <Button
            onClick={onBack}
            variant="contained"
            color="primary"
            fullWidth
          >
            Back
          </Button>
        </Grid>
      </Grid>
    </Grid>
  );
};
