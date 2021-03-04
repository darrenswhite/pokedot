import React, {useEffect, useState} from 'react';
import {TypeResistanceTable} from 'src/components/team/TypeResistanceTable';
import {TeamInfo} from 'src/info/TeamInfo';

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

const TeamAnalysis: React.FC = () => {
  const [teamInfo, setTeamInfo] = useState<TeamInfo>();

  useEffect(() => {
    TeamInfo.fromString(str).then(setTeamInfo);
  }, [str]);

  if (teamInfo) {
    return <TypeResistanceTable teamInfo={teamInfo} />;
  } else {
    return null;
  }
};

export default TeamAnalysis;
