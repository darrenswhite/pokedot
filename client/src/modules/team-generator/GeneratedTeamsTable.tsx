import React, {ReactElement, useEffect, useState} from 'react';

import {
  GeneratedTeamsMatrix,
  GeneratedTeamsMatrixProps,
} from '../../pkmn/matrix/GeneratedTeamsMatrix';
import {GeneratedTeam, TeamGeneratorOptions} from '../../pkmn/TeamGenerator';
import {SpeciesImage} from '../pokemon-info/SpeciesImage';
import {PCol} from '../table/model/PCol';
import {PValue} from '../table/model/PRow';
import {PMatrixTable} from '../table/PMatrixTable';

export interface GeneratedTeamsTableProps {
  teams: GeneratedTeam[];
  options: TeamGeneratorOptions;
}

const renderIndexCell = (value: PValue): ReactElement => {
  return <span>#{Number(value) + 1}</span>;
};

const renderSpeciesCell = (value: PValue): ReactElement => {
  return <SpeciesImage name={value as string} moreInfo />;
};

const mapSpeciesValue = (
  revealed: number
): ((value: PValue) => PValue) | undefined => {
  return value => {
    const entry = (value as GeneratedTeamsMatrixProps[])[0];

    return entry.index <= revealed ? entry.info?.species : '';
  };
};

export const GeneratedTeamsTable: React.FC<GeneratedTeamsTableProps> = ({
  teams,
  options,
}: GeneratedTeamsTableProps) => {
  const [revealed, setRevealed] = useState(0);
  const matrix = GeneratedTeamsMatrix.forTeams(teams, options);

  const columnFieldOverrides: Partial<PCol> = {
    headerName: 'Pokémon Slot',
    renderCell: renderIndexCell,
  };

  const idFieldOverrides: Partial<PCol> = {
    renderCell: renderSpeciesCell,
    mapValue: mapSpeciesValue(revealed),
  };

  useEffect(() => {
    setRevealed(0);
  }, [teams]);

  useEffect(() => {
    if (teams.length > 0 && revealed < options.sampleSize - 1) {
      const interval = setInterval(() => {
        setRevealed(revealed + 1);
      }, options.reveal);

      return () => clearInterval(interval);
    }
  }, [teams, revealed, options.reveal, options.sampleSize]);

  return (
    <PMatrixTable
      matrix={matrix}
      columnField="index"
      idField="player"
      valueField="info"
      columnFieldOverrides={columnFieldOverrides}
      idFieldOverrides={idFieldOverrides}
    />
  );
};
