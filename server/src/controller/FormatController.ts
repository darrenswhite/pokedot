import {Request, Response} from 'express';
import {Inject} from 'typescript-ioc';

import {Formats} from '../data/Formats';
import {Controller, Get} from '../decorator';
import {Logger} from '../util/Logger';

@Controller('/formats')
export class FormatController {
  formats: Formats;

  constructor(@Inject formats: Formats) {
    this.formats = formats;
  }

  @Get('/latest')
  async getLatest(req: Request, res: Response): Promise<void> {
    return this.formats
      .getLatestFormats()
      .then(formats => {
        res.status(200).json(formats);
      })
      .catch((err: unknown) => {
        Logger.error({err}, 'Failed to get latest formats.');
        res.status(500).send();
      });
  }

  @Get('/:format/latest/stats')
  async getLatestStats(req: Request, res: Response): Promise<void> {
    const format = req.params.format;
    const weightParam = req.query.weight;
    const weight =
      typeof weightParam === 'string' ? parseInt(weightParam) : false;

    if (format) {
      return this.formats
        .getLatestStats(format, weight)
        .then(stats => {
          res.status(200).json(stats);
        })
        .catch((err: unknown) => {
          Logger.error(
            {err, format, weightParam},
            'Failed to get format latest stats.'
          );
        });
    } else {
      res.send(400);
    }
  }
}
