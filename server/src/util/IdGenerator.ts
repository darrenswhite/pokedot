import {customAlphabet} from 'nanoid';

const ALPHABET_ALPHANUMERIC = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
const DEFAULT_ID_LENGTH = 4;

export class IdGenerator {
  static generateAlphanumeric(length = DEFAULT_ID_LENGTH): string {
    return customAlphabet(ALPHABET_ALPHANUMERIC, length)();
  }
}
