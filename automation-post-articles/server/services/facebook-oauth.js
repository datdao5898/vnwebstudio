import axios from 'axios';
import crypto from 'crypto';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { config } from '../config.js';

const states = new Map();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.resolve(__dirname, '..', '..', '.env');
const requiredScopes = ['pages_show_list', 'pages_manage_posts'];

function assertOAuthConfig() {
  const missing = [];
  if (!config.facebook.appId) missing.push('FACEBOOK_APP_ID');
  if (!config.facebook.appSecret) missing.push('FACEBOOK_APP_SECRET');
  if (!config.facebook.pageId) missing.push('FACEBOOK_PAGE_ID');
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
  const userAccessToken = tokenResponse.data?.access_token;
  if (!userAccessToken) throw new Error('Facebook không trả user access token.');

  const pagesResponse = await axios.get(`${base}/me/accounts`, {
    params: {
      fields: 'id,name,access_token,tasks',
      access_token: userAccessToken
    }
  });
  const availablePages = pagesResponse.data?.data || [];
  const page = availablePages.find(item => String(item.id) === String(config.facebook.pageId));
  if (!page?.access_token) {
    const returnedPages = availablePages
      .map(item => `${item.name || 'Không tên'} (ID: ${item.id}; quyền: ${(item.tasks || []).join(', ') || 'không rõ'})`)
      .join(' | ') || 'Không có Page nào được Meta trả về cho tài khoản này';
    throw new Error(`Không tìm thấy Page ID ${config.facebook.pageId} trong danh sách Meta trả về. Danh sách: ${returnedPages}. Hãy kiểm tra FACEBOOK_PAGE_ID hoặc quyền Full control của đúng tài khoản Facebook.`);
  }

  await saveEnvValue('FACEBOOK_PAGE_ACCESS_TOKEN', page.access_token);
  config.facebook.pageAccessToken = page.access_token;
  return { pageId: page.id, pageName: page.name || 'Facebook Page', connected: true };
}

export function getFacebookConnectionStatus() {
  return {
    configured: Boolean(config.facebook.appId && config.facebook.appSecret && config.facebook.pageId),
    tokenStored: Boolean(config.facebook.pageAccessToken),
    pageId: config.facebook.pageId || null,
    redirectUri: config.facebook.redirectUri
  };
}
