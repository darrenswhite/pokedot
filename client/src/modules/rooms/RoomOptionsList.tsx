import {
  Box,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListSubheader,
  Paper,
  makeStyles,
} from '@material-ui/core';
import React from 'react';

import {TeamGeneratorOptions} from './TeamGeneratorState';

const useStyles = makeStyles(() => ({
  paper: {
    height: '100%',
  },
}));

export interface RoomOptionsListProps {
  options: TeamGeneratorOptions;
}

export const RoomOptionsList: React.FC<RoomOptionsListProps> = ({
  options,
}: RoomOptionsListProps) => {
  const classes = useStyles();

  return (
    <Box height="100%">
      <Paper className={classes.paper}>
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
    </Box>
  );
};
