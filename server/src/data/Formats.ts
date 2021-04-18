import axios from 'axios';
import {Statistics, UsageStatistics} from 'smogon';

export type FormatsData = Record<string, number[]>;

const FORMAT_WEIGHT_REGEX = />(\w+)-(\d+)\.(?:\w+)</g;

export class Formats {
  getLatestDate = async (): Promise<string> => {
    const latestResponse = await axios(Statistics.URL);

    return Statistics.latest(latestResponse.data);
  };

  getLatestFormats = async (): Promise<FormatsData> => {
    return this.getFormats(await this.getLatestDate());
  };

  getFormats = async (date: string): Promise<FormatsData> => {
    const formats: FormatsData = {};
    const response = await axios(`${Statistics.URL}/${date}/chaos`);
    const regexp = new RegExp(FORMAT_WEIGHT_REGEX);
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

  getLatestStats = async (
    format: string,
    weight?: number | boolean
  ): Promise<UsageStatistics> => {
    const date = await this.getLatestDate();
    const url = Statistics.url(date, format, weight);
    const response = await axios.get(url);

    return response.data as UsageStatistics;
  };
}
