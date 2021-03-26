import React, {ReactElement, useEffect, useState} from 'react';
import {
  RandomGeneratedTeam,
  RandomTeamGeneratorOptions,
} from '../../pkmn/RandomTeamGenerator';
import {PMatrixTable} from '../table/PMatrixTable';
import {Matrix} from '../../pkmn/matrix/Matrix';
import {PCol} from '../table/model/PCol';
import {PValue} from '../table/model/PRow';
import {PokeInfo} from '../../pkmn/PokeInfo';
import {find, range} from 'lodash/fp';
import {SpeciesImage} from '../coverage/SpeciesImage';

export interface TeamGeneratorResultsProps {
  options: RandomTeamGeneratorOptions;
  teams: RandomGeneratedTeam[];
}

const renderIndexHeader = (field: string): ReactElement => {
  return <span>#{Number(field) + 1}</span>;
};

const renderSpeciesCell = (value: PValue): ReactElement => {
  return <SpeciesImage name={value as string} />;
};

interface TeamMatrixProps {
  player: string;
  index: number;
  info: PokeInfo;
}

export const TeamGeneratorResults: React.FC<TeamGeneratorResultsProps> = ({
  options,
  teams,
}: TeamGeneratorResultsProps) => {
  const [revealed, setRevealed] = useState(0);
  const matrix = new Matrix<TeamMatrixProps>(
    options.players.flatMap(player => {
      const playerTeam = find(team => team.player === player, teams);
      const team = playerTeam?.team ?? Array(options.sampleSize);

      return range(0, options.sampleSize).map(index => ({
        player,
        index,
        info: index < revealed ? team[index] : '',
      }));
    })
  );

  const idFieldOverrides: Partial<PCol> = {
    renderHeader: renderIndexHeader,
    renderCell: renderSpeciesCell,
    mapValue: value => (value as TeamMatrixProps[])[0].info?.species,
  };

  useEffect(() => {
    setRevealed(0);
  }, [teams]);

  useEffect(() => {
    if (teams.length > 0 && revealed < options.sampleSize) {
      const interval = setInterval(() => {
        setRevealed(revealed + 1);
      }, options.revealMs);

      return () => clearInterval(interval);
    }
  }, [teams, revealed]);

  return (
    <PMatrixTable
      matrix={matrix}
      columnField="player"
      idField="index"
      valueField="info"
      idFieldOverrides={idFieldOverrides}
    />
  );
};
