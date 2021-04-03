import {Button, Grid, Slider, Switch, Typography} from '@material-ui/core';
import {useRouter} from 'next/router';
import React, {useContext, useState} from 'react';

import {createRoom, useRoomListeners} from '../../hooks/useRoom';

import {RoomContext} from './RoomProvider';
import {TeamGeneratorOptions} from './TeamGeneratorState';

const DEFAULT_TEAM_SIZE = 6;
const DEFAULT_POOL_SIZE = 3;
const DEFAULT_POOL_SELECTION_TIME = 30000;

interface Slider {
  field: keyof TeamGeneratorOptions;
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
  const [options, setOptions] = useState<TeamGeneratorOptions>({
    teamSize: DEFAULT_TEAM_SIZE,
    poolSize: DEFAULT_POOL_SIZE,
    poolSelectionTime: DEFAULT_POOL_SELECTION_TIME,
    legendaries: 0,
    mythicals: 0,
    exclusivePools: false,
  });

  const createNewRoom = () => {
    createRoom(client, 'team-generator', options)
      .then(room => {
        setRoom(room);
        setState(room.state);
        router.push(`/rooms/${room.id}`);
      })
      .catch(() => {
        // TODO display friendly error
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
      max: 60000,
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

  const setOptionValue = (key: keyof TeamGeneratorOptions) => {
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
      direction="column"
      spacing={2}
      style={{height: '100%'}}
    >
      {sliders.map(slider => (
        <Grid key={slider.field} item container justify="center">
          <Grid item xs={12} sm={4} md={3} lg={2} xl={1}>
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
        <Grid item xs={12} sm={4} md={3} lg={2} xl={1}>
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

      <Grid item container justify="center">
        <Grid item xs={12} sm={4} md={3} lg={2} xl={1}>
          <Button
            onClick={createNewRoom}
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
  );
};
