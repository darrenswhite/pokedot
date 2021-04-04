import {Grid} from '@material-ui/core';
import React from 'react';

import {OptionsList} from './OptionsList';
import {PlayerList} from './PlayerList';

export interface TeamGeneratorContainerProps {
  children: NonNullable<React.ReactNode>;
  header?: React.ReactNode;
}

export const TeamGeneratorContainer: React.FC<TeamGeneratorContainerProps> = ({
  children,
  header,
}: TeamGeneratorContainerProps) => {
  return (
    <Grid container justify="center" spacing={1} style={{height: '100%'}}>
      <Grid container item xs={12} sm={8} md={10} justify="center">
        <Grid item xs={12}>
          {header}
        </Grid>

        <Grid item xs={12} justify="center">
          {children}
        </Grid>
      </Grid>

      <Grid container item xs={12} sm={4} md={2} direction="column" spacing={1}>
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
