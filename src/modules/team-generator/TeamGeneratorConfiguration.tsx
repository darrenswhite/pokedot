import React, {useState} from 'react';
import {
  Button,
  Card,
  CardHeader,
  CardContent,
  Grid,
  TextField,
} from '@material-ui/core';
import {Add} from '@material-ui/icons';
import {isEmpty} from 'lodash/fp';
import {RandomTeamGeneratorOptions} from '../../pkmn/RandomTeamGenerator';

export interface TeamGeneratorConfigurationProps {
  value: RandomTeamGeneratorOptions;
  onChange: (options: RandomTeamGeneratorOptions) => void;
}

export const TeamGeneratorConfiguration: React.FC<TeamGeneratorConfigurationProps> = ({
  value,
  onChange,
}: TeamGeneratorConfigurationProps) => {
  const [currentName, setCurrentName] = useState<string>('');

  const addPlayerName = () => {
    if (!isEmpty(currentName) && !value.players.includes(currentName)) {
      onChange({
        ...value,
        players: [...value.players, currentName],
      });
      setCurrentName('');
    }
  };

  return (
    <>
      <Card>
        <CardHeader title="Configuration" />

        <CardContent>
          <Grid container spacing={2} alignItems="flex-end" justify="center">
            <Grid item>
              <TextField
                label="Player name"
                placeholder="Enter name..."
                value={currentName}
                onChange={e => setCurrentName(e.currentTarget.value)}
                onKeyUp={e => e.key === 'Enter' && addPlayerName()}
              />
            </Grid>

            <Grid item>
              <Button variant="contained" size="small" onClick={addPlayerName}>
                <Add />
                Add player
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </>
  );
};
