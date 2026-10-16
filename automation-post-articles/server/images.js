import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const imagesDir = path.resolve(__dirname, '..', 'post-images');
fs.mkdirSync(imagesDir, { recursive: true });

const types = { '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.gif': 'image/gif' };

export function listImages() {
  return fs.readdirSync(imagesDir, { withFileTypes: true })
    .filter(entry => entry.isFile() && types[path.extname(entry.name).toLowerCase()])
    .map(entry => {
      const stat = fs.statSync(path.join(imagesDir, entry.name));
      return { name: entry.name, size: stat.size, modifiedAt: stat.mtime.toISOString() };
    })
    .sort((a, b) => b.modifiedAt.localeCompare(a.modifiedAt));
}

// Chỉ nhận tên file nằm trong post-images, chặn đường dẫn kiểu ../
export function resolveImages(names = []) {
  if (!Array.isArray(names)) throw new Error('Danh sách ảnh không hợp lệ.');
  if (names.length > 10) throw new Error('Tối đa 10 ảnh cho một bài.');
  return names.map(name => {
    const base = path.basename(String(name));
    const full = path.join(imagesDir, base);
    const type = types[path.extname(base).toLowerCase()];
    if (base !== name || !type || !fs.existsSync(full)) throw new Error(`Không tìm thấy ảnh "${name}" trong thư mục post-images.`);
    return { name: base, path: full, type };
  });
}
