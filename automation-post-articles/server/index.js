import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { config, missingConfig } from './config.js';
import { db, log } from './db.js';
import { connectFacebookPage, getFacebookAuthorizationUrl, getFacebookConnectionStatus } from './services/facebook-oauth.js';
import { publishDirectPost, publishStoredDraft } from './services/direct-post.js';
import fs from 'fs';
import { imagesDir, listImages } from './images.js';
import { connectedPages, listProjects, setProjectPage } from './projects.js';

const app = express();
// Chỉ cho phép dashboard của chính app gọi API, chặn trang web lạ đăng bài thay anh.
app.use(cors({ origin: [`http://localhost:${config.port}`, `http://127.0.0.1:${config.port}`, 'http://localhost:5174', 'http://127.0.0.1:5174'] }));
app.use('/api', (req, res, next) => {
  if (req.method === 'GET' || req.is('application/json')) return next();
  res.status(415).json({ error: 'Yêu cầu phải gửi dạng JSON.' });
});
app.use(express.json({ limit: '2mb' }));

app.get('/api/health', (req, res) => {
  res.json({ ok: true, app: 'Facebook Publisher', dryRun: config.dryRun, missingConfig: missingConfig(), facebook: getFacebookConnectionStatus() });
});

app.get('/auth/facebook', (req, res) => {
  try { res.redirect(getFacebookAuthorizationUrl()); }
  catch (err) { res.status(400).send(`Không thể bắt đầu kết nối Facebook: ${err.message}`); }
});

app.get('/auth/facebook/callback', async (req, res) => {
  try {
    if (req.query.error) throw new Error(req.query.error_description || 'Anh chưa cấp quyền Facebook cần thiết.');
    if (!req.query.code || !req.query.state) throw new Error('Thiếu dữ liệu xác thực từ Facebook.');
    const result = await connectFacebookPage({ code: req.query.code, state: req.query.state });
    log('info', `Đã kết nối Facebook Page ${result.pageName}`, { pageId: result.pageId });
    res.type('html').send(`<!doctype html><meta charset="utf-8"><title>Đã kết nối Facebook</title><body style="font-family:system-ui;padding:32px"><h1>Đã kết nối ${result.pageName}</h1><p>Page đã sẵn sàng. Anh có thể đóng cửa sổ này và quay lại dashboard.</p></body>`);
  } catch (err) {
    log('error', 'Kết nối Facebook thất bại', { error: err.message });
    res.status(400).type('html').send(`<!doctype html><meta charset="utf-8"><title>Kết nối Facebook thất bại</title><body style="font-family:system-ui;padding:32px"><h1>Kết nối Facebook thất bại</h1><p>${err.message}</p><p>Đóng cửa sổ này, kiểm tra quyền Page rồi thử lại.</p></body>`);
  }
});

app.get('/api/posts', (req, res) => {
  const posts = db.prepare('SELECT * FROM posts ORDER BY schedule_at DESC LIMIT 200').all();
  res.json(posts);
});

app.get('/api/projects', (req, res) => res.json({ projects: listProjects(), pages: connectedPages() }));

app.post('/api/projects/:id/page', (req, res) => {
  try {
    const { token, ...project } = setProjectPage(req.params.id, req.body.pageId);
    res.json(project);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get('/api/logs', (req, res) => {
  const logs = db.prepare('SELECT * FROM logs ORDER BY id DESC LIMIT 100').all();
  res.json(logs);
});

app.post('/api/direct-post', async (req, res) => {
  try {
    res.json(await publishDirectPost({ project: req.body.project || undefined, title: req.body.title, content: req.body.content, draft: req.body.draft === true, images: req.body.images || [], link: req.body.link || undefined }));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/posts/:id/publish', async (req, res) => {
  try {
    res.json(await publishStoredDraft(Number(req.params.id)));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distPath = path.join(__dirname, '..', 'dist');

app.get('/api/images', (req, res) => res.json(listImages()));
app.use('/post-images', express.static(imagesDir));

// Xem các landing page trong thư mục web của dự án tại /preview/<tên-thư-mục>/
const previewDir = path.resolve(__dirname, '..', process.env.PREVIEW_DIR || '../web');
if (fs.existsSync(previewDir)) app.use('/preview', express.static(previewDir));
app.use(express.static(distPath));
app.use((req, res, next) => {
  if (req.path.startsWith('/api')) return next();
  res.sendFile(path.join(distPath, 'index.html'), err => { if (err) res.status(404).send('Chạy npm run build để tạo frontend production.'); });
});

app.listen(config.port, '127.0.0.1', () => {
  log('info', `Facebook Publisher chạy tại http://localhost:${config.port}`);
});
