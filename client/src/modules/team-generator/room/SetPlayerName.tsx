import {Button, Grid, TextField, makeStyles} from '@material-ui/core';
import React, {useContext, useState} from 'react';

import {TeamGeneratorContext} from '../TeamGeneratorProvider';

const useStyles = makeStyles(() => ({
  nameInput: {
    '& input': {
      textTransform: 'uppercase',
      '&::placeholder': {
        textTransform: 'none',
      },
    },
  },
}));

export const SetPlayerName: React.FC = () => {
  const classes = useStyles();
  const {room} = useContext(TeamGeneratorContext);
  const [name, setName] = useState<string>('');
  const [nameError, setNameError] = useState<string>('');

  const submitName = () => {
    setNameError('');

    if (name.length > 0) {
      room.send('SET_PLAYER_NAME', {
        name,
      });
    } else {
      setNameError('Name is required');
    }
  };

  return (
    <Grid
      container
      justify="center"
      alignItems="center"
      style={{height: '100%'}}
    >
      <Grid item container justify="center" spacing={2}>
        <Grid item container justify="center">
          <Grid item xs={12} sm={4} md={3} lg={2} xl={2}>
            <TextField
              label="Nickname"
              placeholder="Enter name..."
              onChange={e => setName(e.target.value.trim())}
              onKeyUp={e => e.key === 'Enter' && submitName()}
              value={name}
              className={classes.nameInput}
              helperText={nameError}
              error={!!nameError}
              fullWidth
            />
          </Grid>
        </Grid>

        <Grid item container justify="center">
          <Grid item xs={12} sm={4} md={3} lg={2} xl={2}>
            <Button
              onClick={submitName}
              variant="contained"
              color="primary"
              fullWidth
            >
              Submit
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};
