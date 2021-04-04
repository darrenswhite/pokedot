import {
  Divider,
  List,
  ListItem,
  ListItemText,
  ListSubheader,
  Paper,
} from '@material-ui/core';
import React, {useContext} from 'react';

import {RoomContext} from './RoomProvider';

export const OptionsList: React.FC = () => {
  const {state} = useContext(RoomContext);
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
          <ListItemText>Team size: {options.teamSize}</ListItemText>
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
          <ListItemText>Legendaries: {options.legendaries}</ListItemText>
        </ListItem>
        <ListItem>
          <ListItemText>Mythicals: {options.mythicals}</ListItemText>
        </ListItem>
        <ListItem>
          <ListItemText>
            Exclusive pools: {options.exclusivePools ? 'Yes' : 'No'}
          </ListItemText>
        </ListItem>
      </List>
    </Paper>
  );
};
