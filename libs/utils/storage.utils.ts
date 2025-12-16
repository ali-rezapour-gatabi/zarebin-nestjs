import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { existsSync, mkdirSync } from 'fs';
import type { Request } from 'express';

const avatarUploadPath = join(process.cwd(), 'assets', 'user');

export const avatarStorage = diskStorage({
  destination: (_, __, cb) => {
    if (!existsSync(avatarUploadPath)) {
      mkdirSync(avatarUploadPath, { recursive: true });
    }
    cb(null, avatarUploadPath);
  },
  filename: (req, file, cb) => {
    const user = (req as Request & { user?: { userId?: string; phoneNumber?: string } }).user;
    const phone = user?.phoneNumber?.replace(/\D/g, '') || user?.userId || 'user';
    const now = new Date();
    const timestamp = `${now.getFullYear()}${`${now.getMonth() + 1}`.padStart(2, '0')}${`${now.getDate()}`.padStart(2, '0')}-${`${now.getHours()}`.padStart(2, '0')}${`${now.getMinutes()}`.padStart(2, '0')}${`${now.getSeconds()}`.padStart(2, '0')}`;
    const uniqueSuffix = Math.round(Math.random() * 1_000_000).toString();
    const extension = extname(file.originalname);
    cb(null, `${phone}-${timestamp}-${uniqueSuffix}${extension}`);
  },
});
