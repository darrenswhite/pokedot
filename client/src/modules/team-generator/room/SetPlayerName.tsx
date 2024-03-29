import {Button, Grid, TextField} from '@mui/material';
import React, {useContext, useState} from 'react';

import {TeamGeneratorContext} from '../TeamGeneratorProvider';

export const SetPlayerName: React.FC = () => {
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
      justifyContent="center"
      alignItems="center"
      style={{height: '100%'}}
    >
      <Grid item container justifyContent="center" spacing={2}>
        <Grid item container justifyContent="center">
          <Grid item xs={12} sm={4} md={3} lg={2} xl={2}>
            <TextField
              label="Nickname"
              placeholder="Enter name..."
              onChange={e => setName(e.target.value.trim())}
              onKeyUp={e => e.key === 'Enter' && submitName()}
              value={name}
              helperText={nameError}
              error={!!nameError}
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

        <Grid item container justifyContent="center">
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
