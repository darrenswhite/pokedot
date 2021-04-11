import {
  Button,
  CircularProgress,
  Grid,
  Slider,
  Switch,
  Typography,
} from '@material-ui/core';
import {Alert} from '@material-ui/lab';
import {useRouter} from 'next/router';
import React, {useContext, useState} from 'react';

import {createRoom, useRoomListeners} from '../../hooks/useRoom';

import {RoomContext, initialState} from './RoomProvider';
import {Options} from './TeamGeneratorState';

interface Slider {
  field: keyof Options;
  label: string;
  min?: number;
  max?: number;
  step?: number | null;
  valueLabelFormat?:
    | string
    | ((value: number, index: number) => React.ReactNode);
}

export interface CreateRoomProps {
  onBack: () => void;
}

export const CreateRoom: React.FC<CreateRoomProps> = ({
  onBack,
}: CreateRoomProps) => {
  const {client, setRoom, setState} = useContext(RoomContext);
  const router = useRouter();
  const [options, setOptions] = useState<Options>(initialState().options);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const createNewRoom = () => {
    setError(null);
    setIsLoading(true);

    createRoom(client, 'team-generator', options)
      .then(room => {
        setRoom(room);
        setState(room.state);
        router
          .push(`/team-generator/${room.id}`)
          .then(() => {
            setIsLoading(false);
          })
          .catch(e => {
            console.error(
              `Failed to navigate to team generator room ${room.id}.`,
              e
            );
            setError('Failed to join newly created room.');
            setIsLoading(false);
          });
      })
      .catch(() => {
        setError('Failed to create room.');
        setIsLoading(false);
      });
  };

  useRoomListeners();

  const sliders: Slider[] = [
    {
      field: 'teamSize',
      label: 'Team size',
      min: 1,
      max: 6,
    },
    {
      field: 'poolSize',
      label: 'Pool size',
      min: 2,
      max: 10,
    },
    {
      field: 'poolSelectionTime',
      label: 'Pool Selection Time',
      min: 10000,
      max: 120000,
      step: 10000,
      valueLabelFormat: value => value / 1000 + 's',
    },
    {
      field: 'legendaries',
      label: 'Legendaries',
      min: 0,
      max: options.teamSize - options.mythicals,
    },
    {
      field: 'mythicals',
      label: 'Mythicals',
      min: 0,
      max: options.teamSize - options.legendaries,
    },
  ];

  const setOptionValue = (key: keyof Options) => {
    return (_: React.ChangeEvent<unknown>, newValue: unknown) => {
      setOptions({
        ...options,
        [key]: newValue,
      });
    };
  };

  return (
    <Grid
      container
      justify="center"
      alignItems="center"
      style={{height: '100%'}}
    >
      <Grid item container xs={12} justify="center" spacing={2}>
        {sliders.map(slider => (
          <Grid key={slider.field} item container justify="center">
            <Grid item xs={12} sm={4} md={3} lg={2} xl={2}>
              <Grid item container spacing={2}>
                <Grid item xs={5}>
                  <Typography id={`${slider.field}-size-slider`}>
                    {slider.label}
                  </Typography>
                </Grid>

                <Grid item xs>
                  <Slider
                    value={options[slider.field] as number}
                    onChange={setOptionValue(slider.field)}
                    aria-labelledby={`${slider.field}-size-slider`}
                    valueLabelDisplay="auto"
                    step={slider.step}
                    marks
                    min={slider.min}
                    max={slider.max}
                    valueLabelFormat={slider.valueLabelFormat}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        ))}

        <Grid item container justify="center">
          <Grid item xs={12} sm={4} md={3} lg={2} xl={2}>
            <Grid item container spacing={2}>
              <Grid item xs={5}>
                <Typography id="exclusive-pools-switch">
                  Exclusive pools
                </Typography>
              </Grid>

              <Grid item container xs justify="flex-end">
                <Switch
                  checked={options.exclusivePools}
                  onChange={setOptionValue('exclusivePools')}
                  color="primary"
                  aria-labelledby="exclusive-pools-switch"
                />
              </Grid>
            </Grid>
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
              onClick={createNewRoom}
              variant="contained"
              color="primary"
              fullWidth
              disabled={isLoading}
            >
              Create room
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
