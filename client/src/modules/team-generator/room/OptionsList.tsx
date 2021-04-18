import {
  Divider,
  List,
  ListItem,
  ListItemText,
  ListSubheader,
  Paper,
} from '@material-ui/core';
import React, {useContext} from 'react';

import {TeamGeneratorContext} from '../TeamGeneratorProvider';
import {getPoolOptionsDisplay} from '../TeamGeneratorState';

export const OptionsList: React.FC = () => {
  const {state} = useContext(TeamGeneratorContext);
  const {options} = state;

  return (
    <Paper style={{height: '100%'}}>
      <List
        aria-labelledby="options-subheader"
        subheader={
          <ListSubheader id="options-subheader">Options</ListSubheader>
        }
      >
        <Divider />

        <ListItem>
          <ListItemText>Pools: {options.pools.length}</ListItemText>
        </ListItem>

        <ListItem>
          <ListItemText>Pool size: {options.poolSize}</ListItemText>
        </ListItem>

        <ListItem>
          <ListItemText>
            Pool Selection Time: {options.poolSelectionTime / 1000}s
          </ListItemText>
        </ListItem>

        <ListItem>
          <ListItemText>
            Exclusive pools: {options.exclusivePools ? 'Yes' : 'No'}
          </ListItemText>
        </ListItem>

        <Divider />

        {options.pools.map((pool, index) => (
          <ListItem key={index}>
            <ListItemText>
              Pool #{index + 1}: {getPoolOptionsDisplay(pool)}
            </ListItemText>
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};
