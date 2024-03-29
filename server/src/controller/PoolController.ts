import {GenerationNum} from '@pkmn/data';
import {Request, Response} from 'express';
import {Inject} from 'typescript-ioc';

import {PoolGenerator} from '../data/PoolGenerator';
import {Controller, Post} from '../decorator';
import {Pool} from '../team-generator/Pool';

@Controller('/pools')
export class PoolController {
  generator: PoolGenerator;

  constructor(@Inject generator: PoolGenerator) {
    this.generator = generator;
  }

  @Post('/eligiblePokemon/:gen')
  getEligiblePokemon(req: Request, res: Response): void {
    const pool = req.body as Pool;
    const genParam = req.params.gen;
    const gen =
      typeof genParam === 'string'
        ? (parseInt(genParam) as GenerationNum)
        : null;

    if (gen) {
      const eligiblePokemon = this.generator.eligiblePokemon(gen, pool);

      res.status(200).json(eligiblePokemon);
    } else {
      res.status(400);
    }
  }
}
