import {
  Button,
  CircularProgress,
  Grid,
  Slider,
  Switch,
  Typography,
} from '@material-ui/core';
import {Alert} from '@material-ui/lab';
import {produce} from 'immer';
import {useRouter} from 'next/router';
import React, {useContext, useState} from 'react';

import {useCreateRoom} from '../../hooks/useRoom';

import {EditPools} from './EditPools';
import {TeamGeneratorContext, initialPoolState} from './TeamGeneratorProvider';
import {Options, Pool} from './TeamGeneratorState';

export interface CreateRoomProps {
  onBack: () => void;
}

export const CreateRoom: React.FC<CreateRoomProps> = ({
  onBack,
}: CreateRoomProps) => {
  const context = useContext(TeamGeneratorContext);
  const [editPools, setEditPools] = useState(false);
  const {createRoom, error, isLoading} = useCreateRoom(TeamGeneratorContext);
  const router = useRouter();
  const [options, setOptions] = useState<Options>(
    context.initialState().options
  );

  const handleCreateRoom = () => {
    createRoom('team-generator', options, room => {
      return router.push(`/team-generator/${room.id}`);
    });
  };

  const updatePool = (index: number, recipe: (pool: Pool) => void) => {
    setOptions(
      produce(options, draft => {
        const pool = draft.pools[index];

        if (pool) {
          recipe(pool);
        }
      })
    );
  };

  const handlePoolsChange = (
    _: React.ChangeEvent<unknown>,
    value: number | number[]
  ) => {
    const pools = Array.from(Array(value as number).keys()).map(index => {
      const curr = options.pools[index];

      return curr ?? initialPoolState();
    });

    setOptions({
      ...options,
      pools,
    });
  };

  return (
    <>
      {!editPools && (
        <Grid
          container
          justify="center"
          alignItems="center"
          style={{height: '100%'}}
        >
          <Grid item container justify="center" spacing={1}>
            <Grid item container justify="center">
              <Grid item xs={12} sm={4} md={3} lg={2} xl={2}>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs>
                    <Typography id="pools-slider">Pools</Typography>
                  </Grid>

                  <Grid item xs>
                    <Slider
                      value={options.pools.length}
                      onChange={handlePoolsChange}
                      aria-labelledby="pools-slider"
                      valueLabelDisplay="auto"
                      marks
                      min={1}
                      max={6}
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>

            <Grid item container justify="center">
              <Grid item xs={12} sm={4} md={3} lg={2} xl={2}>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs>
                    <Typography id="poolSize-slider">Pool size</Typography>
                  </Grid>

                  <Grid item xs>
                    <Slider
                      value={options.poolSize}
                      onChange={(_, value) => {
                        setOptions(
                          produce(options, draft => {
                            draft.poolSize = value as number;
                          })
                        );
                      }}
                      aria-labelledby="poolSize-slider"
                      valueLabelDisplay="auto"
                      marks
                      min={2}
                      max={10}
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>

            <Grid item container justify="center">
              <Grid item xs={12} sm={4} md={3} lg={2} xl={2}>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs>
                    <Typography id="poolSelectionTime-slider">
                      Pool Selection Time
                    </Typography>
                  </Grid>

                  <Grid item xs>
                    <Slider
                      value={options.poolSelectionTime}
                      onChange={(_, value) => {
                        setOptions(
                          produce(options, draft => {
                            draft.poolSelectionTime = value as number;
                          })
                        );
                      }}
                      aria-labelledby="poolSelectionTime-slider"
                      valueLabelDisplay="auto"
                      step={15000}
                      marks
                      min={15000}
                      max={60000}
                      valueLabelFormat={value => String(value / 1000) + 's'}
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>

            <Grid item container justify="center">
              <Grid item xs={12} sm={4} md={3} lg={2} xl={2}>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs>
                    <Typography id="exclusive-pools-switch">
                      Exclusive pools
                    </Typography>
                  </Grid>

                  <Grid item>
                    <Switch
                      checked={options.exclusivePools}
                      onChange={(_, value) => {
                        setOptions(
                          produce(options, draft => {
                            draft.exclusivePools = value;
                          })
                        );
                      }}
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
                  onClick={() => setEditPools(true)}
                  variant="contained"
                  color="primary"
                  fullWidth
                >
                  Edit pools
                </Button>
              </Grid>
            </Grid>

            <Grid item container justify="center">
              <Grid item xs={12} sm={4} md={3} lg={2} xl={2}>
                <Button
                  onClick={handleCreateRoom}
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
      )}

      {editPools && (
        <EditPools
          pools={options.pools}
          onBack={() => setEditPools(false)}
          onChange={updatePool}
        />
      )}
    </>
  );
};
