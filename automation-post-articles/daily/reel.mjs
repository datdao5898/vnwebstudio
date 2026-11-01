// Làm Reel dọc cho mẫu website trong ngày rồi lên lịch đăng lên Page VN Web Studio.
// Chạy từ thư mục automation-post-articles, sau publish.mjs:
//   node daily/reel.mjs 2026-11-01            → dựng video, lên lịch Reel lúc REEL_AT (mặc định 19:30) hôm đó
//   node daily/reel.mjs 2026-11-01 --no-post  → chỉ dựng video
// Các bước: chụp toàn trang (điện thoại 390px + máy tính 1440px) → storyboard (mục "reel" trong out/DATE.json,
// thiếu thì tự rút từ caption) → daily/reel/build.py (giọng VieNeu + cảnh HyperFrames) → hyperframes render → đăng.
// Đã có video.mp4 thì dùng lại; muốn dựng lại thì xoá thư mục project trong REEL_DIR.
import fs from 'fs';
import path from 'path';
import { execFileSync } from 'child_process';
import { pathToFileURL } from 'url';
import puppeteer from 'puppeteer-core';
import { publishDirectPost } from '../server/services/direct-post.js';

const date = process.argv[2];
if (!/^\d{4}-\d{2}-\d{2}$/.test(date || '')) throw new Error('Thiếu ngày dạng YYYY-MM-DD.');
const noPost = process.argv.includes('--no-post');
const outFile = path.resolve('daily', 'out', `${date}.json`);
const job = JSON.parse(fs.readFileSync(outFile, 'utf8'));
if (job.skip) { console.log('Bỏ qua:', job.skip); process.exit(0); }
if (job.reelPostId && !noPost) { console.log('Hôm nay đã có Reel:', job.reelPostId); process.exit(0); }

const base = job.slug.replace(/-landing$/, '');
const siteIndex = path.resolve('..', 'web', job.slug, 'index.html');
const reelRoot = process.env.REEL_DIR || 'C:\\Users\\datda\\Videos\\vnwebstudio';
const project = path.join(reelRoot, `${date}-${base}`);
const shots = path.join(reelRoot, '.shots', `${date}-${base}`);
fs.mkdirSync(shots, { recursive: true });
const python = process.env.VIENEU_PYTHON || 'C:\\Users\\datda\\Videos\\topkhoahoc\\voice-samples\\vieneu-env\\Scripts\\python.exe';
const hf = 'hyperframes@0.8.201';
const run = (cmd, args, opts = {}) => execFileSync(cmd, args, { stdio: 'inherit', ...opts });

// ---------- storyboard ----------
const clean = s => String(s).replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE0F}✔👉🌐]/gu, '').replace(/\s+/g, ' ').trim();
function fallbackReel() {
  const paras = job.caption.split(/\n\s*\n/).map(p => p.trim());
  const bullets = job.caption.split('\n').filter(l => l.trim().startsWith('✔')).map(clean);
  const firstSentence = clean(paras[1] || job.summary).split(/(?<=[.!?])\s/)[0];
  return {
    hook: `Mẫu website ${job.industry.toLowerCase()} – ${job.brand}`,
    hookSay: `${firstSentence}`,
    features: bullets.slice(0, 4).map(b => ({ title: b.split(/[:,–]/)[0].trim().split(' ').slice(0, 6).join(' '), say: b.replace(/\s*\/\s*/g, ' và ') + '.' }))
  };
}
const reel = job.reel?.features?.length ? job.reel : fallbackReel();

// ---------- chụp trang ----------
const exe = ['C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe', 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'].find(f => fs.existsSync(f));
async function capture() {
  const browser = await puppeteer.launch({ executablePath: exe, headless: true, args: ['--allow-file-access-from-files', '--hide-scrollbars'] });
  const res = {};
  try {
    for (const [key, width, height, dpr, maxH] of [['mobile', 390, 844, 2, 12000], ['desktop', 1440, 900, 1, 2800]]) {
      const page = await browser.newPage();
      await page.setViewport({ width, height, deviceScaleFactor: dpr, isMobile: key === 'mobile', hasTouch: key === 'mobile' });
      await page.goto(pathToFileURL(siteIndex).href, { waitUntil: 'networkidle0', timeout: 60000 }).catch(() => {});
      await page.evaluate(() => document.fonts?.ready);
      // Cuộn hết trang để các hiệu ứng hiện khi cuộn (reveal) chạy, rồi về đầu trang.
      await page.evaluate(async () => {
        for (let y = 0; y < document.documentElement.scrollHeight; y += 400) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 60)); }
        window.scrollTo(0, 0);
        await new Promise(r => setTimeout(r, 800));
      });
      const full = await page.evaluate(() => document.documentElement.scrollHeight);
      const h = Math.min(full, maxH);
      // Ảnh quá 16.384px thì trình render (GPU) vẽ sai, nên giảm độ nét khi trang dài.
      const fit = Math.min(dpr, Math.floor((16000 / h) * 100) / 100);
      if (fit < dpr) await page.setViewport({ width, height, deviceScaleFactor: fit, isMobile: key === 'mobile', hasTouch: key === 'mobile' });
      const file = path.join(shots, `${key}.jpg`);
      await page.screenshot({ path: file, type: 'jpeg', quality: 88, clip: { x: 0, y: 0, width, height: h }, captureBeyondViewport: true });
      res[key] = { file, width, height: h };
      if (key === 'mobile') {
        res.offsets = await page.evaluate(sels => sels.map(s => {
          try { const el = s && document.querySelector(s); return el ? Math.round(el.getBoundingClientRect().top + window.scrollY) : null; } catch { return null; }
        }), reel.features.map(f => f.section || null));
      }
      await page.close();
    }
  } finally { await browser.close(); }
  return res;
}

const videoFile = path.join(project, 'video.mp4');
if (!fs.existsSync(videoFile)) {
  const cap = await capture();
  console.log('Đã chụp trang:', cap.mobile.height, 'px (điện thoại),', cap.desktop.height, 'px (máy tính)');
  const board = {
    brand: job.brand, industry: job.industry,
    hook: clean(reel.hook),
    hookSay: clean(reel.hookSay || reel.hook),
    features: reel.features.slice(0, 4).map((f, i) => ({ title: clean(f.title), say: clean(f.say), offset: cap.offsets[i] })),
    desktopSay: clean(reel.desktopSay || 'Trên máy tính, giao diện vẫn rõ ràng và dễ dùng như trên điện thoại.'),
    outroSay: clean(reel.outroSay || 'Inbox VN Web Studio để nhận bản demo theo thương hiệu của bạn nhé.'),
    mobile: cap.mobile, desktop: cap.desktop
  };
  // Phần nằm ngoài ảnh chụp thì bỏ offset (cuộn chia đều).
  board.features.forEach(f => { if (f.offset != null && f.offset > cap.mobile.height - 400) f.offset = null; });
  const boardFile = path.join(shots, 'storyboard.json');
  // Lời đọc không đổi so với lần dựng trước thì dùng lại giọng đã tạo.
  const says = b => JSON.stringify([b.hookSay, ...b.features.map(f => f.say), b.desktopSay, b.outroSay]);
  const old = fs.existsSync(boardFile) ? JSON.parse(fs.readFileSync(boardFile, 'utf8')) : null;
  const reuseVoice = old && says(old) === says(board) && fs.existsSync(path.join(project, '.vo', 'timing.json'));
  fs.writeFileSync(boardFile, JSON.stringify(board, null, 2));
  run(python, ['-X', 'utf8', path.resolve('daily', 'reel', 'build.py'), boardFile, project, ...(reuseVoice ? ['--no-voice'] : [])], { env: { ...process.env, HF_HUB_DISABLE_SYMLINKS_WARNING: '1' } });
  run('npx', ['--yes', hf, 'check'], { cwd: project, shell: true });
  run('npx', ['--yes', hf, 'render', '--output', 'video.mp4'], { cwd: project, shell: true, timeout: 40 * 60 * 1000 });
  if (!fs.existsSync(videoFile)) throw new Error('Render xong nhưng không thấy video.mp4');
} else console.log('Dùng video đã dựng:', videoFile);

if (noPost) { console.log('Chỉ dựng video (--no-post):', videoFile); process.exit(0); }

// ---------- đăng ----------
const homeUrl = process.env.SITE_URL || 'https://datdao5898.github.io/vnwebstudio/';
const utm = `?utm_source=facebook&utm_medium=reel&utm_campaign=${date}`;
const tags = (job.caption.match(/#\w+/g) || ['#thietkeweb', '#vnwebstudio']).join(' ');
const message = `${job.caption.split('\n')[0].trim()}\n\n${clean(reel.hookSay || reel.hook)}\n\n👉 Xem demo: ${homeUrl}demos/${base}/${utm}\n💬 Inbox VN Web Studio để nhận bản demo theo thương hiệu của mình nhé.\n\n${tags} #reels`;

// Lên lịch REEL_AT (giờ Việt Nam) hôm nay; đã quá giờ đó (còn dưới 20 phút) thì đăng ngay.
const at = process.env.REEL_AT || '19:30';
let scheduleAt = new Date(`${date}T${at}:00+07:00`);
if (scheduleAt.getTime() < Date.now() + 20 * 60 * 1000) scheduleAt = undefined;
const result = await publishDirectPost({ title: `Reel: Mẫu website ${job.industry} – ${job.brand}`, content: message, video: videoFile, scheduleAt });
const fresh = JSON.parse(fs.readFileSync(outFile, 'utf8'));
fs.writeFileSync(outFile, JSON.stringify({ ...fresh, reelPostId: result.facebookPostId, reelScheduledFor: result.scheduledFor || null, reelCaption: message }, null, 2));
console.log(result.scheduledFor ? `Đã lên lịch Reel ${result.facebookPostId}, Facebook tự đăng lúc ${result.scheduledFor}` : `Đã đăng Reel https://www.facebook.com/reel/${result.facebookPostId}`);

try {
  const git = (...args) => execFileSync('git', args, { cwd: path.resolve('..'), encoding: 'utf8', env: { ...process.env, GIT_TERMINAL_PROMPT: '0' } });
  git('add', outFile);
  git('commit', '-q', '-m', `Ghi kết quả Reel ngày ${date}`);
  git('push', '-q', 'origin', 'main');
} catch (err) { console.error('Đẩy lên GitHub thất bại:', err.message); }
