import * as path from 'path';

export default class PathHelper {
  static getPublicFilePath(filename: string): string {
    return path.join(__dirname, '..', '..', 'public', 'files', filename);
  }

  static getTempDir(): string {
    return path.join(__dirname, '..', '..', 'public', 'temp');
  }
}
