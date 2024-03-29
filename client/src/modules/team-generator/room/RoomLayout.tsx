import {Grid} from '@mui/material';
import React from 'react';

import {OptionsList} from './OptionsList';
import {PlayerList} from './PlayerList';
import {TeamList} from './TeamList';

export interface RoomLayoutProps {
  children: NonNullable<React.ReactNode>;
  header?: React.ReactNode;
}

export const RoomLayout: React.FC<RoomLayoutProps> = ({
  children,
  header,
}: RoomLayoutProps) => {
  return (
    <Grid
      container
      justifyContent="center"
      spacing={1}
      style={{height: '100%'}}
    >
      <Grid container item xs={12} sm={8} md={10} justifyContent="center">
        <Grid item xs={12}>
          {header}
        </Grid>

        <Grid item xs={12}>
          {children}
        </Grid>
      </Grid>

      <Grid container item xs={12} sm={4} md={2} direction="column" spacing={1}>
        <Grid item xs>
          <TeamList />
        </Grid>

        <Grid item xs>
          <PlayerList />
        </Grid>

        <Grid item xs>
          <OptionsList />
        </Grid>
      </Grid>
    </Grid>
  );
};
