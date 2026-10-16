import axios from 'axios';
import { config } from '../config.js';

let tokenCache = { value: null, expiresAt: 0 };

export async function getTenantAccessToken() {
  if (tokenCache.value && Date.now() < tokenCache.expiresAt) return tokenCache.value;
  const res = await axios.post('https://open.larksuite.com/open-apis/auth/v3/tenant_access_token/internal', {
    app_id: config.lark.appId,
    app_secret: config.lark.appSecret
  });
  if (res.data.code !== 0) throw new Error(`Lark auth failed: ${res.data.msg}`);
  tokenCache = { value: res.data.tenant_access_token, expiresAt: Date.now() + (res.data.expire - 120) * 1000 };
  return tokenCache.value;
}

function readCell(fields, name) {
  const value = fields?.[name];
  if (Array.isArray(value)) return value.map(v => v.text || v.name || v.url || v.file_token || '').filter(Boolean).join('\n');
  if (value && typeof value === 'object') return value.text || value.name || value.url || value.value || JSON.stringify(value);
  return value ?? '';
}

function parseSchedule(value) {
  if (!value) return null;
  if (typeof value === 'number') return new Date(value > 9999999999 ? value : value * 1000).toISOString();
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

export async function listApprovedBaseRecords() {
  const token = await getTenantAccessToken();
  const url = `https://open.larksuite.com/open-apis/bitable/v1/apps/${config.lark.appToken}/tables/${config.lark.tableId}/records/search?page_size=100`;
  const filter = {
    conjunction: 'and',
    conditions: [
      { field_name: config.lark.fields.status, operator: 'is', value: [config.lark.approvedValue] }
    ]
  };
  const res = await axios.post(url, { filter }, { headers: { Authorization: `Bearer ${token}` } });
  if (res.data.code !== 0) throw new Error(`Lark Base error: ${res.data.msg}`);
  return (res.data.data?.items || []).map(item => {
    const fields = item.fields || {};
    const contentFromBase = readCell(fields, config.lark.fields.content);
    const driveText = readCell(fields, config.lark.fields.driveFile);
    return {
      lark_record_id: item.record_id,
      title: readCell(fields, config.lark.fields.title),
      content: contentFromBase || driveText,
      facebook_page_id: readCell(fields, config.lark.fields.facebookPage) || config.facebook.pageId,
      schedule_at: parseSchedule(readCell(fields, config.lark.fields.schedule)),
      status: 'scheduled',
      raw_json: JSON.stringify(item)
    };
  }).filter(post => post.content && post.schedule_at);
}

export async function updateRecordStatus(recordId, statusText, facebookPostId = '') {
  const token = await getTenantAccessToken();
  const url = `https://open.larksuite.com/open-apis/bitable/v1/apps/${config.lark.appToken}/tables/${config.lark.tableId}/records/${recordId}`;
  const fields = { [config.lark.fields.status]: statusText };
  if (facebookPostId) fields['Facebook Post ID'] = facebookPostId;
  const res = await axios.put(url, { fields }, { headers: { Authorization: `Bearer ${token}` } });
  if (res.data.code !== 0) throw new Error(`Update Lark record failed: ${res.data.msg}`);
  return res.data;
}
