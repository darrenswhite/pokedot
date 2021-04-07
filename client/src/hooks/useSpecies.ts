import {Specie} from '@pkmn/data';
import {useContext, useEffect, useState} from 'react';

import {GenerationContext} from '../modules/generation/GenerationProvider';

export const useSpecie = (name: string): Specie | null => {
  const {generation} = useContext(GenerationContext);
  const [specie, setSpecie] = useState<Specie | null>(null);

  useEffect(() => {
    if (generation && name && name.length > 0) {
      const specie = generation.species.get(name);

      if (specie) {
        setSpecie(specie);
      } else {
        setSpecie(null);
      }
    } else {
      setSpecie(null);
    }
  }, [generation, name]);

  return specie;
};
