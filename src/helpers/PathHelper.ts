import * as path from 'path';

export default class PathHelper {
  static toSlug(filename: string) {
    const ext = path.extname(filename);
    const name = path.basename(filename, ext);
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+/, '')
      .replace(/-+$/, '');
    return `${slug}-${Date.now()}${ext}`;
  }

  static getAvatarFilePath(filename: string): string {
    return path.relative(
      process.cwd(),
      path.join('public', 'avatars', PathHelper.toSlug(filename)),
    );
  }

  static getPublicFilePath(filename: string): string {
    return path.relative(
      process.cwd(),
      path.join('public', 'files', PathHelper.toSlug(filename)),
    );
  }

  static getTempDir(): string {
    return path.relative(process.cwd(), path.join('public', 'temp'));
  }
}
