import React, {useState} from 'react';
import {useRouter} from 'next/router';
import {Box, Button, Grid, Slider, Switch, Typography} from '@material-ui/core';
import {getSocket} from '../../hooks/useSocket';
import {RoomId, RoomOptions} from './Room';

const DEFAULT_TEAM_SIZE = 6;
const DEFAULT_POOL_SIZE = 5;

const socket = getSocket();

interface Slider {
  field: keyof RoomOptions;
  label: string;
  min: number;
  max: number;
}

export interface CreateRoomProps {
  onBack: () => void;
}

export const CreateRoom: React.FC<CreateRoomProps> = ({
  onBack,
}: CreateRoomProps) => {
  const router = useRouter();
  const [options, setOptions] = useState<RoomOptions>({
    teamSize: DEFAULT_TEAM_SIZE,
    poolSize: DEFAULT_POOL_SIZE,
    legendaries: 0,
    mythicals: 0,
    exclusivePools: false,
  });

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

  const createRoom = () => {
    socket.emit('create-room', options, (event: string, roomId: RoomId) => {
      if (event === 'room-created') {
        router.push(`/rooms/${roomId}`);
      } else if (event === 'room-create-error') {
        // TODO display friendly error
        console.error('Failed to create room.');
      }
    });
  };

  const setOptionValue = (key: keyof RoomOptions) => {
    return (_: React.ChangeEvent<unknown>, newValue: unknown) => {
      setOptions({
        ...options,
        [key]: newValue,
      });
    };
  };

  return (
    <>
      {sliders.map(slider => (
        <Box key={slider.field} display="flex" p={1} justifyContent="center">
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
                  step={1}
                  marks
                  min={slider.min}
                  max={slider.max}
                />
              </Grid>
            </Grid>
          </Grid>
        </Box>
      ))}

      <Box display="flex" p={1} justifyContent="center">
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
      </Box>

      <Box display="flex" p={1} justifyContent="center">
        <Grid item xs={12} sm={4} md={3} lg={2} xl={1}>
          <Button
            onClick={createRoom}
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
            onClick={onBack}
            variant="contained"
            color="primary"
            fullWidth
          >
            Back
          </Button>
        </Grid>
      </Box>
    </>
  );
};
