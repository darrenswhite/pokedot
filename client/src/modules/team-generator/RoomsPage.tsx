import {Button, Grid} from '@material-ui/core';
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

export const RoomsPage: React.FC = () => {
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

  let content;

  if (create) {
    content = <CreateRoom onBack={reset} />;
  } else if (join) {
    content = <JoinRoom onBack={reset} />;
  } else {
    content = (
      <Grid
        container
        justify="center"
        direction="column"
        spacing={2}
        style={{height: '100%'}}
      >
        <Grid item container justify="center">
          <Grid item xs={12} sm={4} md={3} lg={2} xl={1}>
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

        <Grid item container justify="center">
          <Grid item xs={12} sm={4} md={3} lg={2} xl={1}>
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
    );
  }

  return content;
};
