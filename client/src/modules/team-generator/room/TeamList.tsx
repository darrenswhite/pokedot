import {
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Paper,
} from '@material-ui/core';
import React, {useContext} from 'react';

import {SpeciesImage, SpeciesImageType} from '../../species/SpeciesImage';
import {TeamGeneratorContext} from '../TeamGeneratorProvider';

export const TeamList: React.FC = () => {
  const {room, state} = useContext(TeamGeneratorContext);
  const player = state.players[room.sessionId];
  const team = player?.team || [];

  return (
    <Paper style={{height: '100%'}}>
      <List
        aria-labelledby="team-subheader"
        subheader={<ListSubheader id="team-subheader">Team</ListSubheader>}
      >
        <Divider />

        {team.map(pokemon => (
          <ListItem key={pokemon.num}>
            <ListItemIcon>
              <SpeciesImage
                name={pokemon.name}
                type={SpeciesImageType.ICON}
                moreInfo
              />
            </ListItemIcon>

            <ListItemText>{pokemon.name}</ListItemText>
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};
