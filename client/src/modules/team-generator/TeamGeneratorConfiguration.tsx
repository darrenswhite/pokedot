import React, {useState} from 'react';
import {
  Button,
  Card,
  CardHeader,
  CardContent,
  Grid,
  makeStyles,
  Slider,
  TextField,
  Typography,
} from '@material-ui/core';
import {Add} from '@material-ui/icons';
import {isEmpty} from 'lodash/fp';
import {TeamGeneratorOptions} from '../../pkmn/TeamGenerator';

const useStyles = makeStyles(theme => ({
  addPlayerButton: {
    marginTop: theme.spacing(2),
  },
}));

export interface TeamGeneratorConfigurationProps {
  value: TeamGeneratorOptions;
  onChange: (options: TeamGeneratorOptions) => void;
}

export const TeamGeneratorConfiguration: React.FC<TeamGeneratorConfigurationProps> = ({
  value,
  onChange,
}: TeamGeneratorConfigurationProps) => {
  const classes = useStyles();
  const [currentName, setCurrentName] = useState<string>('');
  const [nameError, setNameError] = useState<string>('');

  const addPlayerName = () => {
    const nameLowercase = currentName.trim().toLowerCase();

    if (isEmpty(nameLowercase)) {
      setNameError('Name is required');
    } else if (value.players.includes(nameLowercase)) {
      setNameError('Name already exists');
    } else {
      onChange({
        ...value,
        players: [...value.players, nameLowercase],
      });
      setCurrentName('');
      setNameError('');
    }
  };

  const setOptionValue = (key: keyof TeamGeneratorOptions) => {
    return (_: React.ChangeEvent<unknown>, newValue: unknown) => {
      onChange({
        ...value,
        [key]: newValue,
      });
    };
  };

  return (
    <>
      <Card>
        <CardHeader title="Configuration" />

        <CardContent>
          <Grid container spacing={2}>
            <Grid item container spacing={2}>
              <Grid item xs>
                <TextField
                  label="Player name"
                  placeholder="Enter name..."
                  value={currentName}
                  onChange={e => setCurrentName(e.currentTarget.value)}
                  onKeyUp={e => e.key === 'Enter' && addPlayerName()}
                  helperText={nameError}
                  error={!!nameError}
                  fullWidth
                />
              </Grid>

              <Grid item>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={addPlayerName}
                  className={classes.addPlayerButton}
                >
                  <Add />
                  Add player
                </Button>
              </Grid>
            </Grid>

            <Grid item container spacing={2}>
              <Grid item xs={3}>
                <Typography id="sample-size-slider">Team size</Typography>
              </Grid>

              <Grid item xs>
                <Slider
                  value={value.sampleSize}
                  onChange={setOptionValue('sampleSize')}
                  aria-labelledby="sample-size-slider"
                  valueLabelDisplay="auto"
                  step={1}
                  marks
                  min={1}
                  max={6}
                />
              </Grid>
            </Grid>

            <Grid item container spacing={2}>
              <Grid item xs={3}>
                <Typography id="reveal-slider">Reveal time</Typography>
              </Grid>

              <Grid item xs>
                <Slider
                  value={value.reveal}
                  onChange={setOptionValue('reveal')}
                  aria-labelledby="reveal-slider"
                  valueLabelDisplay="auto"
                  valueLabelFormat={value => value / 1000 + 's'}
                  step={1000}
                  marks
                  min={0}
                  max={10000}
                />
              </Grid>
            </Grid>

            <Grid item container spacing={2}>
              <Grid item xs={3}>
                <Typography id="legendary-slider"># of Legendaries</Typography>
              </Grid>

              <Grid item xs>
                <Slider
                  value={value.legendaries}
                  onChange={setOptionValue('legendaries')}
                  aria-labelledby="legendary-slider"
                  valueLabelDisplay="auto"
                  step={1}
                  marks
                  min={0}
                  max={value.sampleSize - value.mythicals}
                />
              </Grid>
            </Grid>

            <Grid item container spacing={2}>
              <Grid item xs={3}>
                <Typography id="mythical-slider"># of Mythical</Typography>
              </Grid>

              <Grid item xs>
                <Slider
                  value={value.mythicals}
                  onChange={setOptionValue('mythicals')}
                  aria-labelledby="mythical-slider"
                  valueLabelDisplay="auto"
                  step={1}
                  marks
                  min={0}
                  max={value.sampleSize - value.legendaries}
                />
              </Grid>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </>
  );
};
