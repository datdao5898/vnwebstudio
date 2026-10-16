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
  const [projects, setProjects] = useState({ projects: [], pages: [] });
  const [project, setProject] = useState('vnwebstudio');

  const load = async () => {
    const [h, p, l, i, pr] = await Promise.all([api('/api/health'), api('/api/posts'), api('/api/logs'), api('/api/images'), api('/api/projects')]);
    setHealth(h); setPosts(p); setLogs(l); setImages(i); setProjects(pr);
  };
  useEffect(() => { load(); const timer = setInterval(load, 5000); return () => clearInterval(timer); }, []);

  const connectFacebook = () => { window.location.assign('/auth/facebook'); };
  const publish = async (draft = false) => {
    try {
      setMessage(draft ? 'Đang lưu nháp...' : 'Đang đăng bài...');
      const result = await api('/api/direct-post', { method: 'POST', body: JSON.stringify({ project, title, content, draft, images: selected }) });
      if (draft) setMessage(`Đã lưu nháp trên Page (chưa ai thấy): ${result.facebookPostId}`);
      else setMessage(result.dryRun ? 'Đã chạy thử, chưa đăng thật vì DRY_RUN=true.' : `Đã đăng Facebook: ${result.facebookPostId}`);
      setTitle(''); setContent(''); setSelected([]); await load();
    } catch (err) { setMessage(`Lỗi: ${err.message}`); }
  };
  const choosePage = async (id, pageId) => {
    try { await api(`/api/projects/${id}/page`, { method: 'POST', body: JSON.stringify({ pageId }) }); await load(); }
    catch (err) { setMessage(`Lỗi: ${err.message}`); }
  };
  const projectName = id => projects.projects.find(item => item.id === id)?.name || id;
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
        <p>Một tool đăng bài cho nhiều dự án: mỗi dự án đăng lên Page riêng và tự kèm link trang web của dự án đó.</p>
      </div>
      <div className="status">
        <b>Trạng thái</b>
        <span className={health?.ok ? 'ok' : 'bad'}>{health?.ok ? 'Đang chạy' : 'Chưa kết nối'}</span>
        <small>Đăng thật: {health?.dryRun ? 'Chưa bật' : 'Đang bật'}</small>
      </div>
    </section>

    <section className="grid">
      <div className="card">
        <h2>Dự án & Facebook Page</h2>
        <div className="projects">{projects.projects.map(item => <div key={item.id} className="project">
          <b>{item.name}</b>
          <small><a href={item.siteUrl} target="_blank" rel="noreferrer">{item.siteUrl}</a></small>
          <select value={item.pageId || ''} onChange={event => choosePage(item.id, event.target.value)} aria-label={`Page của ${item.name}`}>
            <option value="">— Chọn Page —</option>
            {projects.pages.map(page => <option key={page.id} value={page.id}>{page.name} ({page.id})</option>)}
            {item.pageId && !projects.pages.some(page => page.id === item.pageId) && <option value={item.pageId}>{item.pageId} (chưa có token)</option>}
          </select>
          <span className={`pill ${item.connected ? 'published' : 'failed'}`}>{item.connected ? 'Sẵn sàng đăng' : 'Chưa kết nối'}</span>
        </div>)}</div>
        {!health?.facebook?.configured && <p className="message">Cần điền FACEBOOK_APP_ID và FACEBOOK_APP_SECRET trong file .env.</p>}
        <p><small>Thiếu Page trong danh sách? Bấm nút dưới, đăng nhập Facebook và tích chọn tất cả Page cần dùng.</small></p>
        <button onClick={connectFacebook} disabled={!health?.facebook?.configured}>Kết nối / xác thực lại Facebook</button>
      </div>

      <div className="card">
        <h2>Đăng bài trực tiếp</h2>
        <select value={project} onChange={event => setProject(event.target.value)} aria-label="Dự án">
          {projects.projects.map(item => <option key={item.id} value={item.id} disabled={!item.connected}>{item.name}{item.connected ? '' : ' (chưa kết nối Page)'}</option>)}
        </select>
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
        <thead><tr><th>Dự án</th><th>Tiêu đề / nội dung</th><th>Thời gian</th><th>Trạng thái</th><th>Facebook ID</th><th>Lỗi</th></tr></thead>
        <tbody>{posts.map(post => <tr key={post.id}>
          <td>{projectName(post.project)}</td>
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
