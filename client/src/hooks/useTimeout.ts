import {EffectCallback, useEffect} from 'react';

export const useTimeout = (effect: EffectCallback, delay: number): void => {
  useEffect(() => {
    const timeout = setTimeout(effect, delay);

    return () => clearTimeout(timeout);
  }, [effect, delay]);
};
