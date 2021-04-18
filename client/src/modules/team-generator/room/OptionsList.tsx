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
import {Pool} from '../TeamGeneratorState';

const getPoolOptionsDisplay = (pool: Pool): string => {
  const options = [];

  if (pool.fullyEvolved) {
    options.push('FE');
  }

  if (pool.notFullyEvolved) {
    options.push('NFE');
  }

  if (pool.restrictedLegendaries) {
    options.push('RL');
  }

  if (pool.subLegendaries) {
    options.push('SL');
  }

  if (pool.mythicals) {
    options.push('M');
  }

  if (pool.minimumBaseStatTotal > 0 && pool.maximumBaseStatTotal > 0) {
    options.push(
      `${pool.minimumBaseStatTotal}>=BST<=${pool.maximumBaseStatTotal}`
    );
  } else if (pool.minimumBaseStatTotal > 0) {
    options.push(`BST>=${pool.minimumBaseStatTotal}`);
  } else if (pool.maximumBaseStatTotal > 0) {
    options.push(`BST<=${pool.maximumBaseStatTotal}`);
  }

  return options.length > 0 ? options.join(', ') : 'None';
};

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
