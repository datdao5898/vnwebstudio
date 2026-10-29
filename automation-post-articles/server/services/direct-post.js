import { db, log } from '../db.js';
import fs from 'fs';
import path from 'path';
import { publishFacebookPost, publishFacebookReel, publishDraftPost, resolveTarget } from './facebook.js';
import { resolveImages } from '../images.js';

// video: đường dẫn file .mp4 dọc, đăng thành Reel (không kèm ảnh hay link xem trước).
// scheduleAt: chỉ cho Reel, Facebook tự đăng vào giờ đó; bài ghi status 'fb_scheduled' (khác 'scheduled' của lịch Lark).
export async function publishDirectPost({ project = 'vnwebstudio', title = '', content, draft = false, images = [], link, video, scheduleAt }) {
  const message = String(content || '').trim();
  if (!message) throw new Error('Nội dung bài đăng không được để trống.');
  if (video && !fs.existsSync(video)) throw new Error(`Không tìm thấy video: ${video}`);
  if (scheduleAt && !video) throw new Error('Hiện chỉ lên lịch được Reel (cần --video).');
  if (scheduleAt && (Number.isNaN(scheduleAt.getTime()) || scheduleAt.getTime() < Date.now() + 15 * 60 * 1000)) {
    throw new Error('Giờ lên lịch phải hợp lệ và sau hiện tại ít nhất 15 phút.');
  }
  const imageFiles = video ? [] : resolveImages(images);
  const { pageId } = resolveTarget({ project });

  const directId = `direct_${Date.now()}_${Math.random().toString(16).slice(2, 8)}`;
  const result = db.prepare(`
    INSERT INTO posts(lark_record_id, title, content, facebook_page_id, schedule_at, status, raw_json, project)
    VALUES (?, ?, ?, ?, ?, 'publishing', ?, ?)
  `).run(directId, String(title || '').trim(), message, pageId, (scheduleAt || new Date()).toISOString(), JSON.stringify({ source: 'direct_chat', draft, link, images: imageFiles.map(image => image.name), video: video ? path.basename(video) : undefined }), project);

  try {
    const facebook = video
      ? await publishFacebookReel({ project, message, draft, videoPath: video, scheduleAt })
      : await publishFacebookPost({ project, message, draft, images: imageFiles, link });
    const status = draft ? 'draft' : facebook.scheduledFor ? 'fb_scheduled' : 'published';
    db.prepare(`UPDATE posts SET status=?, facebook_post_id=?, last_error=NULL, updated_at=CURRENT_TIMESTAMP WHERE id=?`)
      .run(status, facebook.id, result.lastInsertRowid);
    log('info', draft ? 'Đã lưu bài chưa đăng lên Facebook Page' : facebook.scheduledFor ? 'Đã lên lịch Reel trên Facebook' : 'Đã đăng bài trực tiếp lên Facebook', { project, postId: result.lastInsertRowid, facebookPostId: facebook.id, images: imageFiles.length, scheduledFor: facebook.scheduledFor, dryRun: Boolean(facebook.dryRun) });
    return { id: result.lastInsertRowid, project, facebookPostId: facebook.id, draft, images: imageFiles.length, scheduledFor: facebook.scheduledFor, dryRun: Boolean(facebook.dryRun) };
  } catch (err) {
    db.prepare(`UPDATE posts SET status='failed', last_error=?, updated_at=CURRENT_TIMESTAMP WHERE id=?`)
      .run(err.message, result.lastInsertRowid);
    log('error', draft ? 'Lưu bài chưa đăng thất bại' : 'Đăng bài trực tiếp lên Facebook thất bại', { postId: result.lastInsertRowid, error: err.message });
    throw err;
  }
}

export async function publishStoredDraft(id) {
  const post = db.prepare('SELECT * FROM posts WHERE id=?').get(id);
  if (!post) throw new Error('Không tìm thấy bài.');
  if (post.status !== 'draft' || !post.facebook_post_id) throw new Error('Bài này không ở trạng thái nháp.');
  const result = await publishDraftPost(post.facebook_post_id);
  if (result.dryRun) return { id: post.id, facebookPostId: post.facebook_post_id, dryRun: true };
  db.prepare(`UPDATE posts SET status='published', last_error=NULL, updated_at=CURRENT_TIMESTAMP WHERE id=?`).run(post.id);
  log('info', 'Đã đăng công khai bài nháp', { postId: post.id, facebookPostId: post.facebook_post_id });
  return { id: post.id, facebookPostId: post.facebook_post_id, dryRun: false };
}
