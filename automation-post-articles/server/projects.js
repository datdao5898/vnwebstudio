// Nhiều dự án dùng chung một tool: mỗi dự án đăng lên Page riêng và tự kèm link trang web riêng.
// Token các Page lưu ở data/pages.json (không commit), lấy về khi bấm "Kết nối Facebook" trên dashboard.
// Page của từng dự án chọn trên dashboard, lưu ở data/projects.json; hoặc đặt sẵn bằng biến môi trường.
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { config } from './config.js';

const dataDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'data');
const pagesFile = path.join(dataDir, 'pages.json');
const projectsFile = path.join(dataDir, 'projects.json');

const defaults = {
  vnwebstudio: {
    name: 'VN Web Studio',
    siteUrl: config.siteUrl,
    siteLabel: '🌐 Xem các mẫu website tại:',
    pageId: config.facebook.pageId
  },
  topkhoahoc: {
    name: 'TopKhoaHoc',
    siteUrl: process.env.TOPKHOAHOC_SITE_URL || 'https://topkhoahoc.online/',
    siteLabel: '📖 Tra thêm thuật ngữ trending tại:',
    pageId: process.env.TOPKHOAHOC_FACEBOOK_PAGE_ID || ''
  }
};
export const defaultProject = 'vnwebstudio';

function readJson(file) {
  try { return JSON.parse(fs.readFileSync(file, 'utf8')); } catch { return {}; }
}
function writeJson(file, value) {
  fs.mkdirSync(dataDir, { recursive: true });
  fs.writeFileSync(`${file}.tmp`, JSON.stringify(value, null, 2), { mode: 0o600 });
  fs.renameSync(`${file}.tmp`, file);
}

export function savePages(pages) {
  const stored = readJson(pagesFile);
  for (const page of pages) stored[page.id] = { name: page.name, token: page.token, updatedAt: new Date().toISOString() };
  writeJson(pagesFile, stored);
}

export function pageToken(pageId) {
  if (!pageId) return null;
  return readJson(pagesFile)[pageId]?.token || (String(pageId) === String(config.facebook.pageId) ? config.facebook.pageAccessToken : null);
}

// Danh sách Page đã kết nối (không kèm token) để hiện trên dashboard.
export function connectedPages() {
  const pages = Object.entries(readJson(pagesFile)).map(([id, page]) => ({ id, name: page.name }));
  if (config.facebook.pageId && config.facebook.pageAccessToken && !pages.some(page => page.id === String(config.facebook.pageId))) {
    pages.unshift({ id: String(config.facebook.pageId), name: 'VN Web Studio' });
  }
  return pages;
}

export function getProject(id = defaultProject) {
  if (!defaults[id]) throw new Error(`Không có dự án "${id}". Các dự án: ${Object.keys(defaults).join(', ')}.`);
  const project = { id, ...defaults[id], ...readJson(projectsFile)[id] };
  return { ...project, token: pageToken(project.pageId) };
}

export function projectByPageId(pageId) {
  return Object.keys(defaults).map(getProject).find(project => pageId && String(project.pageId) === String(pageId));
}

export function listProjects() {
  return Object.keys(defaults).map(id => {
    const { token, ...project } = getProject(id);
    return { ...project, connected: Boolean(token) };
  });
}

export function setProjectPage(id, pageId) {
  getProject(id);
  if (pageId && !connectedPages().some(page => page.id === String(pageId))) throw new Error('Page này chưa được kết nối.');
  const stored = readJson(projectsFile);
  stored[id] = { ...stored[id], pageId: String(pageId || '') };
  writeJson(projectsFile, stored);
  return getProject(id);
}
