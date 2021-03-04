import React, {useEffect, useState} from 'react';
import {Container, Typography} from '@material-ui/core';
import {Icons} from '@pkmn/img';
import {
  SortableTable,
  SortableTableRow,
} from '../src/components/table/SortableTable';
import {SortableTableHeadCell} from '../src/components/table/SortableTableHead';
import {PokeInfo} from '../src/info/PokeInfo';
import {TeamInfo} from '../src/info/TeamInfo';

const str = `Clefairy @ Eviolite  
Ability: Friend Guard  
Level: 50  
EVs: 252 HP / 220 Def / 36 SpD  
Calm Nature  
IVs: 0 Atk  
- Follow Me  
- Helping Hand  
- Moonblast  
- Protect  

Conkeldurr @ Flame Orb  
Ability: Guts  
Shiny: Yes  
EVs: 212 HP / 156 Atk / 140 SpD  
Adamant Nature  
- Drain Punch  
- Ice Punch  
- Mach Punch  
- Protect  

Corviknight @ Lum Berry  
Ability: Mirror Armor  
Level: 50  
EVs: 252 HP / 20 Atk / 60 Def / 140 SpD / 36 Spe  
Careful Nature  
- Brave Bird  
- Bulk Up  
- Iron Head  
- Roost  

Duraludon @ Assault Vest  
Ability: Stalwart  
Level: 50  
Gigantamax: Yes  
EVs: 252 HP / 252 SpA / 4 Spe  
Modest Nature  
IVs: 0 Atk  
- Body Press  
- Draco Meteor  
- Flash Cannon  
- Thunderbolt  

Porygon-Z @ Life Orb  
Ability: Adaptability  
Level: 50  
EVs: 4 HP / 252 SpA / 252 Spe  
Modest Nature  
IVs: 0 Atk  
- Dark Pulse  
- Hyper Beam  
- Protect  
- Thunderbolt  

Sylveon @ Pixie Plate  
Ability: Pixilate  
Shiny: Yes  
EVs: 4 HP / 252 Def / 252 SpA  
Modest Nature  
- Hyper Voice  
- Protect  
- Quick Attack  
- Yawn  

`;

const getHeaders = (teamInfo: TeamInfo): SortableTableHeadCell[] => {
  const typeHeader: SortableTableHeadCell = {
    id: 'type',
    label: 'Type',
    align: 'left',
  };
  const totalHeaders: SortableTableHeadCell[] = [
    {
      id: 'totalWeak',
      label: 'Total Weak',
      align: 'right',
    },
    {
      id: 'totalResist',
      label: 'Total Resist',
      align: 'right',
    },
  ];

  return [typeHeader]
    .concat(
      teamInfo.pokeInfo.map(info => ({
        id: info.num,
        label: info.name,
        align: 'right',
        before: <span style={Icons.getPokemon(info.name).css} />,
      }))
    )
    .concat(totalHeaders);
};

const getTypeResistance = (value: number): React.ReactNode => {
  switch (value) {
    case 0:
      return 'Immune';
    case 0.25:
      return '1/4x';
    case 0.5:
      return '1/2x';
    case 1:
      return null;
    case 2:
      return '2x';
    case 4:
      return '4x';
    default:
      throw new Error(`Invalid type resistance value: ${value}.`);
  }
};

const getRows = (teamInfo: TeamInfo): SortableTableRow[] => {
  return PokeInfo.types().map(type => {
    const typeName = type.name;
    const typeUrl = Icons.getType(typeName).url;
    const typeResistances = teamInfo.pokeInfo
      .map(info => ({
        [info.num]: info.resistances[typeName] || 1,
      }))
      .reduce((prev, curr) => Object.assign(prev, curr), {});
    const totalWeak = Object.values(typeResistances).filter(val => val > 1)
      .length;
    const totalResist = Object.values(typeResistances).filter(val => val < 1)
      .length;

    return {
      type: {
        value: <img src={typeUrl} />,
        sortValue: typeName,
      },
      ...Object.fromEntries(
        Object.entries(typeResistances).map(([num, value]) => [
          num,
          {
            value: getTypeResistance(value),
            sortValue: value,
          },
        ])
      ),
      totalWeak: {
        value: totalWeak,
        sortValue: totalWeak,
      },
      totalResist: {
        value: totalResist,
        sortValue: totalResist,
      },
    };
  });
};

const TeamAnalysis: React.FC = () => {
  const [teamInfo, setTeamInfo] = useState<TeamInfo>();

  useEffect(() => {
    TeamInfo.fromString(str).then(setTeamInfo);
  }, [str]);

  if (teamInfo) {
    const headers = getHeaders(teamInfo);
    const rows = getRows(teamInfo);

    return (
      <Container>
        <Typography variant="h5" component="h2" gutterBottom>
          Resistance Chart
        </Typography>

        <SortableTable headers={headers} rows={rows} />
      </Container>
    );
  } else {
    return null;
  }
};

export default TeamAnalysis;
