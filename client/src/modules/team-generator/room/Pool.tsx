import {Grid, Typography} from '@material-ui/core';
import React, {useContext} from 'react';

import {TeamGeneratorContext} from '../TeamGeneratorProvider';

import {PoolCard} from './PoolCard';
import {RoomLayout} from './RoomLayout';

export const Pool: React.FC = () => {
  const {room, state} = useContext(TeamGeneratorContext);
  const {currentPool, currentPoolTime, players} = state;
  const player = players[room.sessionId];
  const pool = player?.pool || [];
  const team = player?.team || [];

  const selectFromPool = (index: number) => {
    room.send('SET_PLAYER_POOL_SELECTION', {
      index,
    });
  };

  return (
    <RoomLayout
      header={
        <>
          <Typography variant="h5" component="h2" align="center" gutterBottom>
            Pool #{currentPool + 1}
          </Typography>

          <Typography variant="h5" component="h2" align="center" gutterBottom>
            {currentPoolTime / 1000}s
          </Typography>
        </>
      }
    >
      <Grid container justify="center">
        <Grid item xs={12} sm={12} md={12} lg={10} xl={5}>
          <Grid container justify="center" spacing={2} wrap="wrap">
            {pool.map((pokemon, index) => {
              const selected = team[currentPool]?.name === pokemon.name;

              return (
                <Grid key={pokemon.name} item>
                  <PoolCard
                    pokemon={pokemon}
                    onSelect={() => selectFromPool(index)}
                    selected={selected}
                  />
                </Grid>
              );
            })}
          </Grid>
        </Grid>
      </Grid>
    </RoomLayout>
  );
};
