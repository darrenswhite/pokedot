import {
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Paper,
} from '@mui/material';
import React, {useContext} from 'react';

import {SpeciesImage, SpeciesImageType} from '../../species/SpeciesImage';
import {SpeciesContext} from '../../species/SpeciesProvider';
import {TeamGeneratorContext} from '../TeamGeneratorProvider';

export const TeamList: React.FC = () => {
  const {room, state} = useContext(TeamGeneratorContext);
  const player = state.players[room.sessionId];
  const team = player?.team || [];
  const {setOpen, setSpecies} = useContext(SpeciesContext);

  const showMoreInfo = (name: string) => {
    setSpecies(name);
    setOpen(true);
  };

  return (
    <Paper style={{height: '100%'}}>
      <List
        aria-labelledby="team-subheader"
        subheader={<ListSubheader id="team-subheader">Team</ListSubheader>}
      >
        <Divider />

        {team.map(pokemon => (
          <ListItem
            key={pokemon.num}
            button
            onClick={() => showMoreInfo(pokemon.name)}
          >
            <ListItemIcon>
              <SpeciesImage name={pokemon.name} type={SpeciesImageType.ICON} />
            </ListItemIcon>

            <ListItemText
              primary={pokemon.baseSpecies}
              secondary={pokemon.form}
            />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};
