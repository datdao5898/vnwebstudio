import { db, log } from '../db.js';
import { publishFacebookPost, publishDraftPost, resolveTarget } from './facebook.js';
import { resolveImages } from '../images.js';

export async function publishDirectPost({ project = 'vnwebstudio', title = '', content, draft = false, images = [], link }) {
  const message = String(content || '').trim();
  if (!message) throw new Error('Nội dung bài đăng không được để trống.');
  const imageFiles = resolveImages(images);
  const { pageId } = resolveTarget({ project });

  const directId = `direct_${Date.now()}_${Math.random().toString(16).slice(2, 8)}`;
  const result = db.prepare(`
    INSERT INTO posts(lark_record_id, title, content, facebook_page_id, schedule_at, status, raw_json, project)
    VALUES (?, ?, ?, ?, ?, 'publishing', ?, ?)
  `).run(directId, String(title || '').trim(), message, pageId, new Date().toISOString(), JSON.stringify({ source: 'direct_chat', draft, link, images: imageFiles.map(image => image.name) }), project);

  try {
    const facebook = await publishFacebookPost({ project, message, draft, images: imageFiles, link });
    const status = draft ? 'draft' : 'published';
    db.prepare(`UPDATE posts SET status=?, facebook_post_id=?, last_error=NULL, updated_at=CURRENT_TIMESTAMP WHERE id=?`)
      .run(status, facebook.id, result.lastInsertRowid);
    log('info', draft ? 'Đã lưu bài chưa đăng lên Facebook Page' : 'Đã đăng bài trực tiếp lên Facebook', { project, postId: result.lastInsertRowid, facebookPostId: facebook.id, images: imageFiles.length, dryRun: Boolean(facebook.dryRun) });
    return { id: result.lastInsertRowid, project, facebookPostId: facebook.id, draft, images: imageFiles.length, dryRun: Boolean(facebook.dryRun) };
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
