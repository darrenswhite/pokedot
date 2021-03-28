import React, {useState} from 'react';
import {Box, Button, Grid} from '@material-ui/core';
import {CreateRoom} from './CreateRoom';
import {JoinRoom} from './JoinRoom';

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
      <>
        <Box display="flex" p={1} justifyContent="center">
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
        </Box>

        <Box display="flex" p={1} justifyContent="center">
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
