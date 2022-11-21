// this module uses ESM by default - let's re-export the CJS module directly instead
declare module '@pkmn/sim/build/cjs/sim' {
  export * from '@pkmn/sim';
}
