// Ảnh thật cho mẫu website, lấy từ Pixabay (cần PIXABAY_API_KEY trong .env).
// Chạy trước bước Claude, từ thư mục automation-post-articles: node daily/photos.mjs 2026-11-03
// Tải ảnh ứng viên của chủ đề kế tiếp vào daily/photo-candidates/DATE/ để Claude xem rồi chọn.
// Lỗi ở đây không chặn job: không có manifest.json thì Claude vẽ minh họa bằng SVG/CSS như trước.
import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { pathToFileURL } from 'url';

const candidatesRoot = path.resolve('daily', 'photo-candidates');
const PER_QUERY = 6;
const MAX_TOTAL = 16;
// Giấy phép Pixabay cấm dùng nội dung có thương hiệu cho mục đích thương mại.
const BLOCKED_TAGS = /\b(apple|iphone|ipad|imac|macbook|mac|samsung|google|microsoft|nike|adidas|coca|pepsi|starbucks|logo|brand|trademark|ai[- ]generated)\b/i;

async function fetchCandidates(date) {
  const key = process.env.PIXABAY_API_KEY;
  if (!key) throw new Error('Thiếu PIXABAY_API_KEY trong .env');

  const topics = JSON.parse(fs.readFileSync(path.resolve('daily', 'topics.json'), 'utf8'));
  const topic = topics.find(t => !t.done && !fs.existsSync(path.resolve('..', 'web', `${t.slug}-landing`)));
  if (!topic) { console.log('Không còn chủ đề nào.'); return; }

  fs.rmSync(candidatesRoot, { recursive: true, force: true }); // chỉ giữ ảnh ứng viên của ngày đang chạy
  const dir = path.join(candidatesRoot, date);
  fs.mkdirSync(dir, { recursive: true });

  const queries = topic.photoQueries?.length ? topic.photoQueries : [topic.slug.replace(/-/g, ' ')];
  const seen = new Set();
  const photos = [];
  for (const query of queries) {
    const params = new URLSearchParams({ key, q: query, image_type: 'photo', safesearch: 'true', min_width: '1200', per_page: '30', order: 'popular' });
    const res = await fetch(`https://pixabay.com/api/?${params}`, { signal: AbortSignal.timeout(30000) });
    if (!res.ok) { console.error(`Tìm "${query}" lỗi HTTP ${res.status}`); continue; } // không in URL vì có key
    const hits = (await res.json()).hits.filter(h => !BLOCKED_TAGS.test(h.tags) && !seen.has(h.id));
    for (const hit of hits.slice(0, PER_QUERY)) {
      if (photos.length >= MAX_TOTAL) break;
      seen.add(hit.id);
      try {
        const img = await fetch(hit.largeImageURL, { signal: AbortSignal.timeout(60000) });
        if (!img.ok) throw new Error(`HTTP ${img.status}`);
        const file = `${hit.id}.jpg`;
        const scale = Math.min(1, 1280 / Math.max(hit.imageWidth, hit.imageHeight)); // largeImageURL tối đa 1280px
        fs.writeFileSync(path.join(dir, file), Buffer.from(await img.arrayBuffer()));
        photos.push({ id: hit.id, file, query, tags: hit.tags, width: Math.round(hit.imageWidth * scale), height: Math.round(hit.imageHeight * scale), source: hit.pageURL });
      } catch (err) { console.error(`Tải ảnh ${hit.id} lỗi:`, err.message); }
    }
  }
  if (!photos.length) { fs.rmSync(dir, { recursive: true, force: true }); throw new Error('Không tải được ảnh nào.'); }
  fs.writeFileSync(path.join(dir, 'manifest.json'), JSON.stringify({ slug: topic.slug, photos }, null, 2));
  console.log(`Đã tải ${photos.length} ảnh ứng viên cho ${topic.slug}`);
}

// Gọi từ publish.mjs: chép ảnh Claude đã chọn (mục "photos" trong out/DATE.json) vào thư mục mẫu.
// Trang còn trỏ tới ảnh không tồn tại thì báo lỗi, để không đăng bài có ảnh vỡ.
export function installPhotos(job, siteDir, date, root = candidatesRoot) {
  const imagesDir = path.join(siteDir, 'images');
  for (const photo of job.photos || []) {
    const src = path.join(root, date, `${photo.id}.jpg`);
    const dest = path.join(imagesDir, photo.file);
    if (fs.existsSync(dest)) continue; // chạy lại trong ngày
    if (!fs.existsSync(src)) throw new Error(`Không thấy ảnh ứng viên ${photo.id}`);
    fs.mkdirSync(imagesDir, { recursive: true });
    fs.copyFileSync(src, dest);
  }
  const source = ['index.html', 'styles.css', 'script.js'].map(f => path.join(siteDir, f)).filter(f => fs.existsSync(f)).map(f => fs.readFileSync(f, 'utf8')).join('\n');
  for (const [, file] of source.matchAll(/images\/([\w.-]+\.(?:jpe?g|png|webp))/gi)) {
    if (!fs.existsSync(path.join(imagesDir, file))) throw new Error(`Trang trỏ tới ảnh không tồn tại: images/${file}`);
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const date = process.argv[2];
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date || '')) throw new Error('Thiếu ngày dạng YYYY-MM-DD.');
  await fetchCandidates(date);
}
