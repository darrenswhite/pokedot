import {Button, Grid} from '@mui/material';
import dynamic from 'next/dynamic';
import React, {useState} from 'react';

import {CreateRoomProps} from './CreateRoom';
import {JoinRoomProps} from './JoinRoom';

const CreateRoom = dynamic<CreateRoomProps>(() =>
  import('./CreateRoom').then(m => m.CreateRoom)
);

const JoinRoom = dynamic<JoinRoomProps>(() =>
  import('./JoinRoom').then(m => m.JoinRoom)
);

export const TeamGeneratorPage: React.FC = () => {
  const [create, setCreate] = useState(false);
  const [join, setJoin] = useState(false);

  const reset = () => {
    setCreate(false);
    setJoin(false);
  };

  const showCreate = () => {
    setJoin(false);
    setCreate(true);
  };

  const showJoin = () => {
    setCreate(false);
    setJoin(true);
  };

  return (
    <>
      {create && <CreateRoom onBack={reset} />}

      {join && <JoinRoom onBack={reset} />}

      {!join && !create && (
        <Grid
          container
          justifyContent="center"
          alignItems="center"
          style={{height: '100%'}}
        >
          <Grid item container xs={12} justifyContent="center" spacing={2}>
            <Grid item container justifyContent="center">
              <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                <Button
                  onClick={showCreate}
                  variant="contained"
                  color="primary"
                  fullWidth
                >
                  Create room
                </Button>
              </Grid>
            </Grid>

            <Grid item container justifyContent="center">
              <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                <Button
                  onClick={showJoin}
                  variant="contained"
                  color="primary"
                  fullWidth
                >
                  Join room
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      )}
    </>
  );
};
