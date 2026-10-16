import axios from 'axios';
import crypto from 'crypto';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { config } from '../config.js';
import { savePages } from '../projects.js';

const states = new Map();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.resolve(__dirname, '..', '..', '.env');
const requiredScopes = ['pages_show_list', 'pages_manage_posts'];

function assertOAuthConfig() {
  const missing = [];
  if (!config.facebook.appId) missing.push('FACEBOOK_APP_ID');
  if (!config.facebook.appSecret) missing.push('FACEBOOK_APP_SECRET');
  if (missing.length) throw new Error(`Thiếu cấu hình: ${missing.join(', ')}`);
}

export function getFacebookAuthorizationUrl() {
  assertOAuthConfig();
  const state = crypto.randomBytes(24).toString('hex');
  states.set(state, Date.now() + 10 * 60_000);
  const params = new URLSearchParams({
    client_id: config.facebook.appId,
    redirect_uri: config.facebook.redirectUri,
    state,
    response_type: 'code',
    // Luôn hỏi lại quyền và danh sách Page, để tích thêm Page mới (vd. TopKhoaHoc) thay vì dùng lại lựa chọn cũ.
    auth_type: 'rerequest',
    scope: requiredScopes.join(',')
  });
  return `https://www.facebook.com/${config.facebook.graphVersion}/dialog/oauth?${params}`;
}

function validateState(state) {
  const expiresAt = states.get(state);
  states.delete(state);
  if (!expiresAt || expiresAt < Date.now()) throw new Error('Phiên kết nối Facebook đã hết hạn. Hãy bấm kết nối lại.');
}

async function saveEnvValue(key, value) {
  const escapedKey = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  let content = '';
  try { content = await fs.readFile(envPath, 'utf8'); } catch (err) { if (err.code !== 'ENOENT') throw err; }
  const line = `${key}=${value}`;
  const matcher = new RegExp(`^${escapedKey}=.*$`, 'm');
  const next = matcher.test(content)
    ? content.replace(matcher, line)
    : `${content.replace(/\n?$/, '\n')}${line}\n`;
  const tempPath = `${envPath}.tmp`;
  await fs.writeFile(tempPath, next, { mode: 0o600 });
  await fs.rename(tempPath, envPath);
}

export async function connectFacebookPage({ code, state }) {
  assertOAuthConfig();
  validateState(state);
  const base = `https://graph.facebook.com/${config.facebook.graphVersion}`;
  const tokenResponse = await axios.get(`${base}/oauth/access_token`, {
    params: {
      client_id: config.facebook.appId,
      client_secret: config.facebook.appSecret,
      redirect_uri: config.facebook.redirectUri,
      code
    }
  });
  const shortToken = tokenResponse.data?.access_token;
  if (!shortToken) throw new Error('Facebook không trả user access token.');
  // Đổi sang token dài hạn: token Page lấy từ token dài hạn sẽ không hết hạn.
  const longResponse = await axios.get(`${base}/oauth/access_token`, {
    params: { grant_type: 'fb_exchange_token', client_id: config.facebook.appId, client_secret: config.facebook.appSecret, fb_exchange_token: shortToken }
  }).catch(() => null);
  const userAccessToken = longResponse?.data?.access_token || shortToken;

  const pagesResponse = await axios.get(`${base}/me/accounts`, {
    params: {
      fields: 'id,name,access_token,tasks',
      access_token: userAccessToken
    }
  });
  const availablePages = (pagesResponse.data?.data || []).filter(item => item.access_token);
  if (!availablePages.length) throw new Error('Meta không trả về Page nào. Hãy chọn đủ các Page (VN Web Studio, TopKhoaHoc…) khi Facebook hỏi cấp quyền.');
  // Lưu token của mọi Page được cấp quyền, để mỗi dự án chọn Page riêng trên dashboard.
  savePages(availablePages.map(item => ({ id: String(item.id), name: item.name || 'Facebook Page', token: item.access_token })));

  const page = availablePages.find(item => String(item.id) === String(config.facebook.pageId));
  if (page) {
    await saveEnvValue('FACEBOOK_PAGE_ACCESS_TOKEN', page.access_token);
    config.facebook.pageAccessToken = page.access_token;
  }
  return { pageId: availablePages.map(item => item.id).join(', '), pageName: availablePages.map(item => item.name).join(', '), connected: true };
}

export function getFacebookConnectionStatus() {
  return {
    configured: Boolean(config.facebook.appId && config.facebook.appSecret && config.facebook.pageId),
    tokenStored: Boolean(config.facebook.pageAccessToken),
    pageId: config.facebook.pageId || null,
    redirectUri: config.facebook.redirectUri
  };
}
