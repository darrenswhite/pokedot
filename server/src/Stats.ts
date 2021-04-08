import axios from 'axios';
import {Statistics} from 'smogon';

export type FormatsData = Record<string, number[]>;

export class Stats {
  static FORMAT_WEIGHT_REGEX = />(\w+)-(\d+)\.(?:\w+)</g;

  static getLatestDate = async (): Promise<string> => {
    const latestResponse = await axios(Statistics.URL);

    return Statistics.latest(latestResponse.data);
  };

  static getFormats = async (date: string): Promise<FormatsData> => {
    const formats: FormatsData = {};
    const response = await axios(`${Statistics.URL}/${date}/chaos`);
    const regexp = new RegExp(Stats.FORMAT_WEIGHT_REGEX);
    let match;

    while ((match = regexp.exec(response.data)) !== null) {
      const format = match[1];
      const weight = match[2];

      if (format && weight) {
        const weightNumber = parseInt(weight);
        const curr = formats[format];

        if (!isNaN(weightNumber)) {
          if (curr) {
            curr.push(Number(weight));
          } else {
            formats[format] = [Number(weight)];
          }
        }
      }
    }

    return formats;
  };
}
