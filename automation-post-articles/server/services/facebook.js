import fs from 'fs/promises';
import axios from 'axios';
import { config } from '../config.js';
import { getProject, pageToken, projectByPageId } from '../projects.js';

function graphUrl(path) {
  return `https://graph.facebook.com/${config.facebook.graphVersion}/${path}`;
}

function graphError(err) {
  const fb = err.response?.data?.error;
  return fb ? new Error(`Facebook: ${fb.message} (code ${fb.code})`) : err;
}

// Tải ảnh lên Page ở chế độ ẩn, trả về id để gắn vào bài viết.
async function uploadHiddenPhoto(pageId, token, image) {
  const form = new FormData();
  form.append('source', new Blob([await fs.readFile(image.path)], { type: image.type }), image.name);
  form.append('published', 'false');
  form.append('access_token', token);
  const res = await fetch(graphUrl(`${pageId}/photos`), { method: 'POST', body: form });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data.id) {
    throw new Error(data.error ? `Facebook (tải ảnh ${image.name}): ${data.error.message} (code ${data.error.code})` : `Tải ảnh ${image.name} thất bại.`);
  }
  return data.id;
}

// Bài nào chưa có link trang web của dự án thì chèn thêm, đặt trước dòng hashtag cuối bài (nếu có).
export function withSiteLink(message, project = getProject()) {
  if (!project.siteUrl || message.includes(project.siteUrl.replace(/\/$/, ''))) return message;
  const date = new Date().toLocaleDateString('sv-SE', { timeZone: 'Asia/Ho_Chi_Minh' });
  const link = `${project.siteLabel} ${project.siteUrl}?utm_source=facebook&utm_campaign=${date}`;
  const parts = message.trim().split(/\n\s*\n/);
  if (parts.length > 1 && parts.at(-1).trim().startsWith('#')) parts.splice(-1, 0, link); else parts.push(link);
  return parts.join('\n\n');
}

// Dự án quyết định Page và link trang web. Không truyền project thì đoán theo pageId (bài từ Lark), mặc định VN Web Studio.
export function resolveTarget({ project, pageId }) {
  const target = project ? getProject(project) : (projectByPageId(pageId) || getProject());
  const targetPageId = project ? target.pageId : (pageId || target.pageId);
  const token = pageToken(targetPageId);
  if (!targetPageId || !token) throw new Error(`Dự án ${target.name} chưa có Facebook Page. Mở dashboard, bấm "Kết nối Facebook" rồi chọn Page cho dự án.`);
  return { project: target, pageId: targetPageId, token };
}

// draft=true tạo bài chưa đăng (published=false): bài nằm trên Page nhưng không hiện cho người xem.
// Bài chưa đăng không công khai nên vẫn được tạo thật kể cả khi DRY_RUN=true.
// images: danh sách { name, path, type } đã kiểm tra bởi resolveImages().
// link: bài có ô xem trước link (ảnh + tiêu đề lấy từ trang). Facebook không cho kèm cả ảnh lẫn link, nên có ảnh thì bỏ link.
export async function publishFacebookPost({ project, pageId, message, draft = false, images = [], link }) {
  const target = resolveTarget({ project, pageId });
  if (config.dryRun && !draft) {
    return { id: `dry_run_${Date.now()}`, dryRun: true, pageId: target.pageId, message: withSiteLink(message, target.project) };
  }
  try {
    const mediaIds = [];
    for (const image of images) mediaIds.push(await uploadHiddenPhoto(target.pageId, target.token, image));

    const params = { message: withSiteLink(message, target.project), access_token: target.token };
    if (draft) params.published = false;
    if (link && !mediaIds.length) params.link = link;
    mediaIds.forEach((id, index) => { params[`attached_media[${index}]`] = JSON.stringify({ media_fbid: id }); });

    const res = await axios.post(graphUrl(`${target.pageId}/feed`), null, { params });
    if (!res.data?.id) throw new Error(`Facebook không trả post id: ${JSON.stringify(res.data)}`);
    return { ...res.data, draft, imageCount: mediaIds.length, pageId: target.pageId };
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
      // Post id có dạng <pageId>_<id>, lấy token đúng Page đó.
      params: { is_published: true, access_token: pageToken(facebookPostId.split('_')[0]) || config.facebook.pageAccessToken }
    });
    if (!res.data?.success) throw new Error(`Facebook không xác nhận đăng bài: ${JSON.stringify(res.data)}`);
    return { id: facebookPostId };
  } catch (err) {
    throw graphError(err);
  }
}
