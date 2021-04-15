import {Grid, Typography} from '@material-ui/core';
import React, {useContext} from 'react';

import {PoolSelectionCard} from './PoolSelectionCard';
import {RoomContext} from './RoomProvider';
import {TeamGeneratorContainer} from './TeamGeneratorContainer';

export const PoolSelections: React.FC = () => {
  const {room, state} = useContext(RoomContext);
  const {currentPool, currentPoolTime, options, players} = state;
  const player = players[room.sessionId];
  const pool = player?.pool || [];
  const team = player?.team || [];

  const selectFromPool = (index: number) => {
    room.send('SET_PLAYER_POOL_SELECTION', {
      index,
    });
  };

  return (
    <TeamGeneratorContainer
      header={
        <>
          <Typography variant="h5" component="h2" align="center" gutterBottom>
            Pool {currentPool + 1} / {options.pools.length}
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
                <Grid key={index} item>
                  <PoolSelectionCard
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
    </TeamGeneratorContainer>
  );
};
