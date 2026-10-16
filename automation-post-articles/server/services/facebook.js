import fs from 'fs/promises';
import axios from 'axios';
import { config } from '../config.js';

function graphUrl(path) {
  return `https://graph.facebook.com/${config.facebook.graphVersion}/${path}`;
}

function graphError(err) {
  const fb = err.response?.data?.error;
  return fb ? new Error(`Facebook: ${fb.message} (code ${fb.code})`) : err;
}

// Tải ảnh lên Page ở chế độ ẩn, trả về id để gắn vào bài viết.
async function uploadHiddenPhoto(pageId, image) {
  const form = new FormData();
  form.append('source', new Blob([await fs.readFile(image.path)], { type: image.type }), image.name);
  form.append('published', 'false');
  form.append('access_token', config.facebook.pageAccessToken);
  const res = await fetch(graphUrl(`${pageId}/photos`), { method: 'POST', body: form });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data.id) {
    throw new Error(data.error ? `Facebook (tải ảnh ${image.name}): ${data.error.message} (code ${data.error.code})` : `Tải ảnh ${image.name} thất bại.`);
  }
  return data.id;
}

// Bài nào chưa có link trang chủ thì chèn thêm, đặt trước dòng hashtag cuối bài (nếu có).
export function withSiteLink(message) {
  if (!config.siteUrl || message.includes(config.siteUrl)) return message;
  const date = new Date().toLocaleDateString('sv-SE', { timeZone: 'Asia/Ho_Chi_Minh' });
  const link = `🌐 Xem các mẫu website tại: ${config.siteUrl}?utm_source=facebook&utm_campaign=${date}`;
  const parts = message.trim().split(/\n\s*\n/);
  if (parts.length > 1 && parts.at(-1).trim().startsWith('#')) parts.splice(-1, 0, link); else parts.push(link);
  return parts.join('\n\n');
}

// draft=true tạo bài chưa đăng (published=false): bài nằm trên Page nhưng không hiện cho người xem.
// Bài chưa đăng không công khai nên vẫn được tạo thật kể cả khi DRY_RUN=true.
// images: danh sách { name, path, type } đã kiểm tra bởi resolveImages().
export async function publishFacebookPost({ pageId, message, draft = false, images = [] }) {
  if (config.dryRun && !draft) {
    return { id: `dry_run_${Date.now()}`, dryRun: true };
  }
  const targetPageId = pageId || config.facebook.pageId;
  try {
    const mediaIds = [];
    for (const image of images) mediaIds.push(await uploadHiddenPhoto(targetPageId, image));

    const params = { message: withSiteLink(message), access_token: config.facebook.pageAccessToken };
    if (draft) params.published = false;
    mediaIds.forEach((id, index) => { params[`attached_media[${index}]`] = JSON.stringify({ media_fbid: id }); });

    const res = await axios.post(graphUrl(`${targetPageId}/feed`), null, { params });
    if (!res.data?.id) throw new Error(`Facebook không trả post id: ${JSON.stringify(res.data)}`);
    return { ...res.data, draft, imageCount: mediaIds.length };
  } catch (err) {
    throw graphError(err);
  }
}

// Đăng công khai một bài đang ở trạng thái chưa đăng.
export async function publishDraftPost(facebookPostId) {
  if (config.dryRun) {
    return { id: facebookPostId, dryRun: true };
  }
  try {
    const res = await axios.post(graphUrl(facebookPostId), null, {
      params: { is_published: true, access_token: config.facebook.pageAccessToken }
    });
    if (!res.data?.success) throw new Error(`Facebook không xác nhận đăng bài: ${JSON.stringify(res.data)}`);
    return { id: facebookPostId };
  } catch (err) {
    throw graphError(err);
  }
}
