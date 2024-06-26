import {Alert, Button, CircularProgress, Grid, TextField} from '@mui/material';
import {useRouter} from 'next/router';
import React, {useState} from 'react';

import {ROOM_ID_LENGTH} from '../../hooks/useRoom';

export interface JoinRoomProps {
  onBack: () => void;
}

export const JoinRoom: React.FC<JoinRoomProps> = ({onBack}: JoinRoomProps) => {
  const router = useRouter();
  const [roomId, setRoomId] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const joinRoom = () => {
    setError(null);
    setIsLoading(true);

    router.push(`/team-generator/${roomId}`).catch(e => {
      console.error(`Failed to navigate to team generator room ${roomId}.`, e);
      setError('Failed to join room.');
      setIsLoading(false);
    });
  };

  return (
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      style={{height: '100%'}}
    >
      <Grid item container justifyContent="center" spacing={2}>
        <Grid item container justifyContent="center">
          <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
            <TextField
              label="Room code"
              placeholder="Enter code..."
              onChange={e => setRoomId(e.target.value)}
              onKeyUp={e => e.key === 'Enter' && joinRoom()}
              value={roomId}
              inputProps={{maxLength: ROOM_ID_LENGTH}}
              fullWidth
              sx={{
                '& input': {
                  textTransform: 'uppercase',
                  '&::placeholder': {
                    textTransform: 'none',
                  },
                },
              }}
            />
          </Grid>
        </Grid>

        {error && (
          <Grid item container justifyContent="center">
            <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
              <Alert variant="outlined" severity="error">
                {error}
              </Alert>
            </Grid>
          </Grid>
        )}

        {isLoading && (
          <Grid item container justifyContent="center">
            <Grid item>
              <CircularProgress size={24} />
            </Grid>
          </Grid>
        )}

        <Grid item container justifyContent="center">
          <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
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

        <Grid item container justifyContent="center">
          <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
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
