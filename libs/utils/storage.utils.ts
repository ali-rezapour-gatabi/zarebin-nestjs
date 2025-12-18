import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { existsSync, mkdirSync } from 'fs';
import type { Request } from 'express';

const assetsRoot = join(process.cwd(), 'assets');

function ensureDir(path: string) {
  if (!existsSync(path)) mkdirSync(path, { recursive: true });
}

export const filesStorage = diskStorage({
  destination: (req, file, cb) => {
    const user = (req as Request & { user?: { userId?: string } }).user;

    const userKey = user?.userId || 'user';
    const folder = file.fieldname === 'documents' ? join(assetsRoot, userKey, 'documents') : join(assetsRoot, userKey, 'avatar');

    ensureDir(folder);
    cb(null, folder);
  },

  filename: (req, file, cb) => {
    const user = (req as Request & { user?: { userId?: string } }).user;

    const userKey = user?.userId?.replace(/\D/g, '') || user?.userId || 'user';

    const now = new Date();
    const timestamp = `${now.getFullYear()}${`${now.getMonth() + 1}`.padStart(2, '0')}${`${now.getDate()}`.padStart(2, '0')}-${`${now.getHours()}`.padStart(2, '0')}${`${now.getMinutes()}`.padStart(2, '0')}${`${now.getSeconds()}`.padStart(2, '0')}`;

    const uniqueSuffix = Math.round(Math.random() * 1_000_000).toString();
    const extension = extname(file.originalname);

    const prefix = file.fieldname === 'documents' ? 'doc' : 'avatar';

    cb(null, `${prefix}-${userKey}-${timestamp}-${uniqueSuffix}${extension}`);
  },
});
