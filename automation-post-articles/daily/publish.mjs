// Chụp 3 ảnh cho website mẫu trong ngày rồi đăng lên Facebook Page (mặc định lưu nháp).
// Chạy từ thư mục automation-post-articles: node daily/publish.mjs 2026-10-16
import fs from 'fs';
import path from 'path';
import { execFileSync } from 'child_process';
import { pathToFileURL } from 'url';
import { publishDirectPost } from '../server/services/direct-post.js';
import { imagesDir } from '../server/images.js';

const date = process.argv[2];
if (!/^\d{4}-\d{2}-\d{2}$/.test(date || '')) throw new Error('Thiếu ngày dạng YYYY-MM-DD.');

const outDir = path.resolve('daily', 'out');
const outFile = path.join(outDir, `${date}.json`);
if (!fs.existsSync(outFile)) throw new Error(`Không thấy ${outFile}. Bước tạo website chưa chạy xong.`);
const job = JSON.parse(fs.readFileSync(outFile, 'utf8'));
if (job.skip) { console.log('Bỏ qua:', job.skip); process.exit(0); }

const siteDir = path.resolve('..', 'web', job.slug);
const siteIndex = path.join(siteDir, 'index.html');
if (!fs.existsSync(siteIndex)) throw new Error(`Không thấy ${siteIndex}.`);

const browsers = [
  { exe: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe', headless: '--headless=old' },
  { exe: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', headless: '--headless=new' }
].filter(b => fs.existsSync(b.exe));
if (!browsers.length) throw new Error('Không tìm thấy Edge hoặc Chrome để chụp ảnh.');

const profile = path.join(outDir, '.browser-profile');
function shotTo(target, url, size) {
  fs.rmSync(target, { force: true });
  for (const b of browsers) {
    try {
      execFileSync(b.exe, [b.headless, '--disable-gpu', '--hide-scrollbars', '--allow-file-access-from-files',
        `--user-data-dir=${profile}`, '--blink-settings=preferredColorScheme=1', '--virtual-time-budget=6000',
        `--window-size=${size}`, `--screenshot=${target}`, url], { stdio: 'ignore', timeout: 90000 });
    } catch { /* thử trình duyệt kế tiếp */ }
    if (fs.existsSync(target)) return true;
  }
  return false;
}

// Thêm mẫu vào "Kho giao diện" trên trang chủ VN Web Studio (web/vn-web-studio-react). Lỗi ở bước này không chặn việc đăng bài.
const base = job.slug.replace(/-landing$/, '');
try {
  const react = path.resolve('..', 'web', 'vn-web-studio-react');
  const demosFile = path.join(react, 'src', 'demos.json');
  const demos = JSON.parse(fs.readFileSync(demosFile, 'utf8'));
  if (!demos.some(d => d.slug === base)) {
    const demoDir = path.join(react, 'public', 'demos', base);
    fs.cpSync(siteDir, demoDir, { recursive: true });
    const demoIndex = path.join(demoDir, 'index.html');
    let html = fs.readFileSync(demoIndex, 'utf8').replaceAll('href="../vn-web-studio-react/"', 'href="../../"');
    // Đếm lượt truy cập bằng GoatCounter (vnwebstudio.goatcounter.com)
    if (!html.includes('goatcounter')) html = html.replace('</head>', '  <script data-goatcounter="https://vnwebstudio.goatcounter.com/count" async src="https://gc.zgo.at/count.js"></script>\n</head>');
    // Thương hiệu trong demo là giả nên không cho Google lập chỉ mục (SEO dồn về trang chủ)
    if (!html.includes('name="robots"')) html = html.replace('</head>', '  <meta name="robots" content="noindex, follow">\n</head>');
    fs.writeFileSync(demoIndex, html);
    shotTo(path.join(react, 'public', 'assets', `${base}-sample.png`), pathToFileURL(demoIndex).href, '1440,815');
    const vi = job.summary || `Mẫu website ${job.industry.toLowerCase()} giao diện máy tính và điện thoại.`;
    demos.push({ slug: base, name: job.brand, type: { en: job.industryEn || job.industry, vi: job.industry }, description: { en: job.summaryEn || vi, vi } });
    fs.writeFileSync(demosFile, JSON.stringify(demos, null, 2) + '\n');
    console.log('Đã thêm vào trang chủ VN Web Studio:', base);
  }
} catch (err) { console.error('Không thêm được vào trang chủ:', err.message); }

// Đẩy toàn bộ thay đổi lên GitHub; GitHub Actions sẽ build lại trang chủ trên GitHub Pages.
function pushRepo(message) {
  const git = (...args) => execFileSync('git', args, { cwd: path.resolve('..'), encoding: 'utf8', env: { ...process.env, GIT_TERMINAL_PROMPT: '0' } });
  try {
    git('add', '-A');
    if (!git('status', '--porcelain').trim()) return;
    git('commit', '-q', '-m', message);
    git('push', '-q', 'origin', 'main');
    console.log('Đã đẩy lên GitHub:', message);
  } catch (err) { console.error('Đẩy lên GitHub thất bại:', err.message); }
}

if (job.facebookPostId) { console.log('Hôm nay đã đăng rồi:', job.facebookPostId); process.exit(0); }
if (!job.caption?.trim()) throw new Error('Caption trống.');
pushRepo(`Mẫu website ngày ${date}: ${job.brand}`);

// Chèn link demo + trang chủ vào caption, trước dòng hashtag.
const homeUrl = process.env.SITE_URL || 'https://datdao5898.github.io/vnwebstudio/';
// utm_campaign = ngày đăng, để GoatCounter biết bài ngày nào kéo được bao nhiêu lượt vào web.
const utm = `?utm_source=facebook&utm_campaign=${date}`;
const links = `👉 Xem demo: ${homeUrl}demos/${base}/${utm}\n🌐 Trang chủ VN Web Studio: ${homeUrl}${utm}`;
const parts = job.caption.trim().split(/\n\s*\n/);
if (parts.length > 1 && parts.at(-1).trim().startsWith('#')) parts.splice(-1, 0, links); else parts.push(links);
const caption = parts.join('\n\n');
const siteUrl = pathToFileURL(siteIndex).href;

function shot(file, url, size) {
  if (shotTo(path.join(imagesDir, file), url, size)) return file;
  throw new Error(`Chụp ảnh ${file} thất bại.`);
}

const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
const frameCss = `html,body{margin:0;overflow:hidden}body{background:#e9ede6;font-family:"Be Vietnam Pro",system-ui,sans-serif;position:relative;color:#1d2820}
.label{position:absolute;left:80px;top:56px}.label small{display:block;font-size:15px;letter-spacing:.16em;text-transform:uppercase;color:#2d5b44;font-weight:600}
.label b{font-size:42px;font-weight:600}.tag{position:absolute;right:90px;top:70px;text-align:right;color:#5a685d;font-size:17px}.tag b{display:block;color:#1d2820;font-size:20px}
.phone{position:absolute;width:390px;height:720px;border-radius:44px;border:12px solid #1d2820;overflow:hidden;background:#fff;box-shadow:0 30px 80px rgba(29,40,32,.28)}
.phone iframe{border:0;width:390px;height:3200px;display:block}`;
const head = `<!doctype html><html lang="vi"><head><meta charset="utf-8"><link href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@500;600&display=swap" rel="stylesheet">`;
const label = `<div class="label"><small>Mẫu website ${esc(job.industry)}</small><b>${esc(job.brand)}</b></div><div class="tag"><b>VN Web Studio</b>Giao diện máy tính & điện thoại</div>`;

// Ảnh 1: máy tính + điện thoại
const cover = path.join(outDir, `${date}-cover.html`);
fs.writeFileSync(cover, `${head}<style>${frameCss}html,body{width:1600px;height:1000px}
.desk{position:absolute;left:80px;top:180px;width:1140px;height:740px;border-radius:14px;overflow:hidden;background:#fff;box-shadow:0 30px 80px rgba(29,40,32,.22)}
.bar{height:36px;background:#f4f6f1;border-bottom:1px solid #dbe2d8;display:flex;gap:8px;align-items:center;padding-left:16px}.bar i{width:11px;height:11px;border-radius:50%;background:#d0d8cc}
.desk iframe{border:0;width:1440px;height:885px;transform:scale(.7917);transform-origin:0 0}</style></head><body>${label}
<div class="desk"><div class="bar"><i></i><i></i><i></i></div><iframe src="${siteUrl}" scrolling="no"></iframe></div>
<div class="phone" style="right:90px;top:250px"><iframe src="${siteUrl}" scrolling="no"></iframe></div></body></html>`);

// Ảnh 3: ba điện thoại ở ba đoạn khác nhau của trang
const phones = path.join(outDir, `${date}-phones.html`);
fs.writeFileSync(phones, `${head}<style>${frameCss}html,body{width:1600px;height:1000px}</style></head><body>${label}
${[0, 900, 1800].map((y, i) => `<div class="phone" style="left:${110 + i * 480}px;top:200px"><iframe src="${siteUrl}" scrolling="no" style="margin-top:-${y}px"></iframe></div>`).join('')}
</body></html>`);

const images = [
  shot(`${base}-01-tong-quan.png`, pathToFileURL(cover).href, '1600,1000'),
  shot(`${base}-02-trang-chu.png`, siteUrl, '1440,1900'),
  shot(`${base}-03-dien-thoai.png`, pathToFileURL(phones).href, '1600,1000')
];
console.log('Đã chụp:', images.join(', '));

const draft = String(process.env.DAILY_POST_DRAFT ?? 'true').toLowerCase() !== 'false';
const result = await publishDirectPost({ title: `Mẫu website ${job.industry} – ${job.brand}`, content: caption, draft, images });
fs.writeFileSync(outFile, JSON.stringify({ ...job, images, draft, postedCaption: caption, postId: result.id, facebookPostId: result.facebookPostId, dryRun: result.dryRun }, null, 2));
console.log(draft ? 'Đã lưu nháp trên Page:' : 'Đã đăng lên Page:', result.facebookPostId, result.dryRun ? '(DRY_RUN)' : '');
pushRepo(`Ghi kết quả đăng bài ngày ${date}`);
