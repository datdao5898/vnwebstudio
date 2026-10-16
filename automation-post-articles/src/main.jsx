import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

const api = async (url, options) => {
  const res = await fetch(url, { headers: { 'Content-Type': 'application/json' }, ...options });
  if (!res.ok) throw new Error((await res.json()).error || res.statusText);
  return res.json();
};

function App() {
  const [health, setHealth] = useState(null);
  const [posts, setPosts] = useState([]);
  const [logs, setLogs] = useState([]);
  const [message, setMessage] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [images, setImages] = useState([]);
  const [selected, setSelected] = useState([]);

  const load = async () => {
    const [h, p, l, i] = await Promise.all([api('/api/health'), api('/api/posts'), api('/api/logs'), api('/api/images')]);
    setHealth(h); setPosts(p); setLogs(l); setImages(i);
  };
  useEffect(() => { load(); const timer = setInterval(load, 5000); return () => clearInterval(timer); }, []);

  const connectFacebook = () => { window.location.assign('/auth/facebook'); };
  const publish = async (draft = false) => {
    try {
      setMessage(draft ? 'Đang lưu nháp...' : 'Đang đăng bài...');
      const result = await api('/api/direct-post', { method: 'POST', body: JSON.stringify({ title, content, draft, images: selected }) });
      if (draft) setMessage(`Đã lưu nháp trên Page (chưa ai thấy): ${result.facebookPostId}`);
      else setMessage(result.dryRun ? 'Đã chạy thử, chưa đăng thật vì DRY_RUN=true.' : `Đã đăng Facebook: ${result.facebookPostId}`);
      setTitle(''); setContent(''); setSelected([]); await load();
    } catch (err) { setMessage(`Lỗi: ${err.message}`); }
  };
  const toggleImage = (name) => setSelected(current => current.includes(name) ? current.filter(item => item !== name) : [...current, name].slice(0, 10));
  const publishDraft = async (id) => {
    if (!window.confirm('Đăng công khai bài nháp này lên Page?')) return;
    try {
      const result = await api(`/api/posts/${id}/publish`, { method: 'POST', body: '{}' });
      setMessage(result.dryRun ? 'Đã chạy thử, chưa đăng thật vì DRY_RUN=true.' : `Đã đăng công khai: ${result.facebookPostId}`);
      await load();
    } catch (err) { setMessage(`Lỗi: ${err.message}`); }
  };

  return <main>
    <section className="hero">
      <div>
        <p className="eyebrow">Hermes → Facebook Page</p>
        <h1>Facebook Publisher</h1>
        <p>Anh trò chuyện trực tiếp với em để viết bài. Khi anh yêu cầu đăng, em sẽ tạo nội dung và đăng ngay lên Page VN Web Studio.</p>
      </div>
      <div className="status">
        <b>Trạng thái</b>
        <span className={health?.ok ? 'ok' : 'bad'}>{health?.ok ? 'Đang chạy' : 'Chưa kết nối'}</span>
        <small>Đăng thật: {health?.dryRun ? 'Chưa bật' : 'Đang bật'}</small>
      </div>
    </section>

    <section className="grid">
      <div className="card">
        <h2>Kết nối Facebook Page</h2>
        <p>Page ID: {health?.facebook?.pageId || 'Chưa cấu hình'}</p>
        <p>Token: <b>{health?.facebook?.tokenStored ? 'Đã lưu — hãy xác thực lại nếu token cũ lỗi' : 'Chưa có'}</b></p>
        {!health?.facebook?.configured && <p className="message">Cần điền FACEBOOK_APP_ID, FACEBOOK_APP_SECRET và FACEBOOK_PAGE_ID trong file .env.</p>}
        <button onClick={connectFacebook} disabled={!health?.facebook?.configured}>Kết nối / xác thực lại Facebook Page</button>
      </div>

      <div className="card">
        <h2>Đăng bài trực tiếp</h2>
        <input value={title} onChange={event => setTitle(event.target.value)} placeholder="Tiêu đề nội bộ (không bắt buộc)" />
        <textarea value={content} onChange={event => setContent(event.target.value)} placeholder="Nội dung bài Facebook" rows="7" />
        <div className="images">
          <p>Ảnh đính kèm <small>{selected.length ? `Đã chọn ${selected.length}` : 'Không bắt buộc. Bỏ ảnh vào thư mục post-images để hiện ở đây.'}</small></p>
          <div className="image-grid">{images.map(image => <label key={image.name} className={selected.includes(image.name) ? 'thumb on' : 'thumb'} title={image.name}>
            <input type="checkbox" checked={selected.includes(image.name)} onChange={() => toggleImage(image.name)} aria-label={`Chọn ảnh ${image.name}`} />
            <img src={`/post-images/${encodeURIComponent(image.name)}`} alt="" loading="lazy" />
            <span>{image.name}</span>
          </label>)}</div>
        </div>
        <button className="secondary" onClick={() => publish(true)} disabled={!content.trim()}>Lưu nháp lên Page</button>
        <button onClick={() => publish(false)} disabled={!content.trim()}>Đăng lên Facebook ngay</button>
        <p className="message">{message}</p>
      </div>
    </section>

    <section className="card">
      <h2>Bài đã tạo</h2>
      <table>
        <thead><tr><th>Tiêu đề / nội dung</th><th>Thời gian</th><th>Trạng thái</th><th>Facebook ID</th><th>Lỗi</th></tr></thead>
        <tbody>{posts.map(post => <tr key={post.id}>
          <td><b>{post.title || '(Không tiêu đề)'}</b><small>{post.content.slice(0, 160)}</small></td>
          <td>{new Date(post.created_at).toLocaleString('vi-VN')}</td>
          <td><span className={`pill ${post.status}`}>{post.status}</span></td>
          <td>{post.facebook_post_id ? <a href={`https://www.facebook.com/${post.facebook_post_id}`} target="_blank" rel="noreferrer">{post.facebook_post_id}</a> : '-'}{post.status === 'draft' && <button className="small" onClick={() => publishDraft(post.id)}>Đăng bài nháp</button>}</td>
          <td>{post.last_error || '-'}</td>
        </tr>)}</tbody>
      </table>
    </section>

    <section className="card">
      <h2>Log gần đây</h2>
      <div className="logs">{logs.map(log => <p key={log.id}><time>{new Date(log.created_at).toLocaleString('vi-VN')}</time> [{log.level}] {log.message}</p>)}</div>
    </section>
  </main>;
}

createRoot(document.getElementById('root')).render(<App />);
