import {
  Button,
  CircularProgress,
  Grid,
  TextField,
  makeStyles,
} from '@material-ui/core';
import {Alert} from '@material-ui/lab';
import {useRouter} from 'next/router';
import React, {useState} from 'react';

import {ROOM_ID_LENGTH} from '../../hooks/useRoom';

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

export interface JoinRoomProps {
  onBack: () => void;
}

export const JoinRoom: React.FC<JoinRoomProps> = ({onBack}: JoinRoomProps) => {
  const classes = useStyles();
  const router = useRouter();
  const [roomId, setRoomId] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const joinRoom = () => {
    setError(null);
    setIsLoading(true);

    router
      .push(`/team-generator/${roomId}`)
      .then(() => {
        setIsLoading(false);
      })
      .catch(e => {
        console.error(
          `Failed to navigate to team generator room ${roomId}.`,
          e
        );
        setError('Failed to join room.');
        setIsLoading(false);
      });
  };

  return (
    <Grid
      container
      justify="center"
      alignItems="center"
      style={{height: '100%'}}
    >
      <Grid item container xs={12} justify="center" spacing={2}>
        <Grid item container justify="center">
          <Grid item xs={12} sm={4} md={3} lg={2} xl={2}>
            <TextField
              label="Room code"
              placeholder="Enter code..."
              onChange={e => setRoomId(e.target.value)}
              onKeyUp={e => e.key === 'Enter' && joinRoom()}
              value={roomId}
              className={classes.roomInput}
              inputProps={{maxLength: ROOM_ID_LENGTH}}
              fullWidth
            />
          </Grid>
        </Grid>

        {error && (
          <Grid item container justify="center">
            <Grid item xs={12} sm={4} md={3} lg={2} xl={2}>
              <Alert variant="outlined" severity="error">
                {error}
              </Alert>
            </Grid>
          </Grid>
        )}

        {isLoading && (
          <Grid item container justify="center">
            <Grid item>
              <CircularProgress size={24} />
            </Grid>
          </Grid>
        )}

        <Grid item container justify="center">
          <Grid item xs={12} sm={4} md={3} lg={2} xl={2}>
            <Button
              onClick={joinRoom}
              variant="contained"
              color="primary"
              fullWidth
              disabled={isLoading}
            >
              Join room
            </Button>
          </Grid>
        </Grid>

        <Grid item container justify="center">
          <Grid item xs={12} sm={4} md={3} lg={2} xl={2}>
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
    </Grid>
  );
};
