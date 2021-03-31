import {Button, Grid, TextField} from '@material-ui/core';
import React, {useState} from 'react';

export interface PlayerNameProps {
  onSubmit: (name: string) => void;
}

export const PlayerName: React.FC<PlayerNameProps> = ({
  onSubmit,
}: PlayerNameProps) => {
  const [name, setName] = useState<string>('');
  const [nameError, setNameError] = useState<string>('');

  const submitName = () => {
    setNameError('');

    if (name.length > 0) {
      onSubmit(name);
    } else {
      setNameError('Name is required');
    }
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
            label="Nickname"
            placeholder="Enter name..."
            onChange={e => setName(e.target.value.trim())}
            onKeyUp={e => e.key === 'Enter' && submitName()}
            value={name}
            helperText={nameError}
            error={!!nameError}
            fullWidth
          />
        </Grid>
      </Grid>

      <Grid item container justify="center">
        <Grid item xs={12} sm={4} md={3} lg={2} xl={1}>
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
  );
};
