import { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';
import './portfolio-extra.css';
import './review-fixes.css';
import './library.css';
import demos from './demos.json';

const copy = {
  en: {
    availability: 'Available for new projects', nav: ['Services', 'Work', 'Process'], start: 'Start a project',
    eyebrow: 'Digital design studio · Vietnam', heroTitle: <>Websites that<br /><em>move business</em><br />forward.</>, heroText: 'Professional website design, optimization, and management — for ambitious brands ready to look sharper, work smarter and grow online.', heroCta: 'Let’s build your website', workCta: 'See selected work', trusted: 'Trusted by 50+ students\nand their families', stats: ['Projects launched', 'Years of craft', 'Care & support'], trust: 'Built for brands that take digital seriously',
    servicesEyebrow: 'What we do', servicesTitle: <>Built to be<br /><em>noticed.</em></>, servicesText: 'From the first scroll to the final click, every detail has a job: make your brand memorable and your next step obvious.', serviceButton: 'Explore service',
    workEyebrow: 'Selected work', workTitle: <>Recent<br /><em>launches.</em></>, workText: 'Three different audiences. One shared goal: an online presence that makes the right impression.', view: 'View project',
    processEyebrow: 'A simpler process', processTitle: <>Clarity from<br />day <em>one.</em></>, testimonialEyebrow: 'Kind words from clients', quote: 'VN Web Studio made our brand feel like the business we knew it could become. The process was direct, collaborative and incredibly smooth.', quoteRole: 'Founder, local lifestyle brand',
    contactEyebrow: 'Start something great', contactTitle: <>Ready when<br /><em>you are.</em></>, contactText: 'Tell us what you’re building. We’ll reply with a clear next step, not a sales pitch.', name: 'Your name', namePlaceholder: 'How should we call you?', email: 'Email address', emailPlaceholder: 'you@company.com', need: 'What do you need?', note: 'Tell us a little', notePlaceholder: 'Your idea, goal or challenge…', send: 'Continue on Telegram', success: 'Message copied. Telegram is open — paste it and tap Send.', copyFallback: 'Telegram is open. Please copy the details above and send them to us.', footer: 'Built with purpose.'
  },
  vi: {
    availability: 'Đang nhận dự án mới', nav: ['Dịch vụ', 'Dự án', 'Quy trình'], start: 'Bắt đầu dự án',
    eyebrow: 'Digital design studio · Việt Nam', heroTitle: <>Website giúp<br /><em>doanh nghiệp</em><br />tiến xa hơn.</>, heroText: 'Thiết kế, tối ưu và quản lý website chuyên nghiệp — dành cho những thương hiệu muốn khác biệt, hiệu quả hơn và phát triển bền vững trên nền tảng số.', heroCta: 'Cùng làm website', workCta: 'Xem dự án nổi bật', trusted: 'Được 50+ thương hiệu\ntin tưởng', stats: ['Dự án ra mắt', 'Năm kinh nghiệm', 'Chăm sóc & hỗ trợ'], trust: 'Đồng hành cùng những thương hiệu nghiêm túc với digital',
    servicesEyebrow: 'Chúng tôi làm gì', servicesTitle: <>Sinh ra để<br /><em>nổi bật.</em></>, servicesText: 'Từ cú cuộn đầu tiên đến cú nhấp cuối cùng, mỗi chi tiết đều có một mục tiêu: giúp thương hiệu được nhớ đến và khách hàng biết bước tiếp theo cần làm.', serviceButton: 'Khám phá dịch vụ',
    workEyebrow: 'Dự án nổi bật', workTitle: <>Những dự án<br /><em>mới nhất.</em></>, workText: 'Ba lĩnh vực khác nhau. Một mục tiêu chung: tạo dấu ấn trực tuyến đúng với thương hiệu.', view: 'Xem dự án',
    processEyebrow: 'Quy trình rõ ràng', processTitle: <>Rõ ràng ngay<br />từ <em>đầu.</em></>, testimonialEyebrow: 'Khách hàng chia sẻ', quote: 'VN Web Studio đã giúp thương hiệu của chúng tôi trông đúng như tiềm năng vốn có. Quy trình rõ ràng, hợp tác sát sao và cực kỳ mượt mà.', quoteRole: 'Founder, thương hiệu lifestyle địa phương',
    contactEyebrow: 'Bắt đầu một điều hay', contactTitle: <>Sẵn sàng khi<br /><em>bạn sẵn sàng.</em></>, contactText: 'Hãy cho chúng tôi biết bạn đang xây dựng điều gì. Bạn sẽ nhận lại một hướng đi rõ ràng, không phải một màn chào bán.', name: 'Tên của bạn', namePlaceholder: 'Chúng tôi nên gọi bạn thế nào?', email: 'Email', emailPlaceholder: 'ban@congty.com', need: 'Bạn cần gì?', note: 'Chia sẻ thêm', notePlaceholder: 'Ý tưởng, mục tiêu hoặc vấn đề của bạn…', send: 'Tiếp tục qua Telegram', success: 'Đã sao chép nội dung. Telegram đang mở — anh/chị chỉ cần dán và nhấn Gửi.', copyFallback: 'Telegram đang mở. Anh/chị vui lòng sao chép thông tin phía trên và gửi cho chúng tôi.', footer: 'Được xây dựng có chủ đích.'
  }
};

const localized = {
  en: { services: [['01','Website design','Clean, distinctive websites built around how your customers think, feel and decide.'],['02','Website optimization','Speed, SEO and conversion improvements that make every visit work harder.'],['03','Website management','Reliable updates, content support and ongoing care after your website goes live.']], projects: [['Hospitality','Azure Haven','A refined resort experience made for effortless bookings.'],['Food & Beverage','Mơ Mộng Tea','A playful, high-energy milk tea brand with flavour built in.'],['Personal Brand','Hannah Tutor','A trustworthy personal tutor site that turns interest into booked calls.']], process: [['01','Discover','Your goals, audience and the opportunity in front of you.'],['02','Design','A purposeful visual system and experience that feels like your brand.'],['03','Launch','A polished, responsive website ready for real people and real growth.']] },
  vi: { services: [['01','Thiết kế website','Website chỉn chu, khác biệt, được xây dựng theo cách khách hàng suy nghĩ, cảm nhận và ra quyết định.'],['02','Tối ưu website','Cải thiện tốc độ, SEO và chuyển đổi để mỗi lượt truy cập tạo ra nhiều giá trị hơn.'],['03','Quản lý website','Cập nhật đáng tin cậy, hỗ trợ nội dung và chăm sóc liên tục sau khi website hoạt động.']], projects: [['Khách sạn & Resort','Azure Haven','Trải nghiệm resort tinh tế, được thiết kế để việc đặt phòng trở nên tự nhiên.'],['Ẩm thực & Đồ uống','Mơ Mộng Tea','Thương hiệu trà sữa trẻ trung, giàu năng lượng và có hương vị riêng.'],['Thương hiệu cá nhân','Hannah Tutor','Website gia sư tạo dựng sự tin cậy và chuyển sự quan tâm thành lịch hẹn.']], process: [['01','Khám phá','Mục tiêu, khách hàng và cơ hội đang chờ thương hiệu của bạn.'],['02','Thiết kế','Hệ thống hình ảnh và trải nghiệm có chủ đích, thật sự giống thương hiệu của bạn.'],['03','Ra mắt','Website hoàn thiện, responsive, sẵn sàng phục vụ người dùng và tăng trưởng thực tế.']] }
};

const projectMedia = [
  ['assets/hotel-sample.png','demos/hotel/index.html','gold'],
  ['assets/milk-tea-sample.png','demos/milk-tea/index.html','pink'],
  ['assets/tutor-sample.png','demos/tutor/index.html','mint'],
  ['assets/construction-sample.png','demos/construction/index.html','oxide'],
  ['assets/travel-sample.png','demos/travel/index.html','travel'],
  ['demos/office/assets/office-hero.png','demos/office/index.html','office'],
  ['assets/portfolio-luxury-photographer-sample.png','demos/portfolio-01/index.html','portfolio-luxury'],
  ['assets/portfolio-wedding-event-mc-sample.png','demos/portfolio-02/index.html','portfolio-mc'],
  ['assets/driving-sample.png','demos/driving/index.html','driving'],
  // Mẫu thêm từ src/demos.json (job đăng bài hằng ngày tự ghi thêm vào file này)
  ...demos.map(({ slug }) => [`assets/${slug}-sample.png`, `demos/${slug}/index.html`, slug])
];

function App() {
  const [language, setLanguage] = useState('en');
  const [open, setOpen] = useState(false);
  const [sent, setSent] = useState('');
  const [showAll, setShowAll] = useState(false);
  const t = copy[language];
  const data = localized[language];
  const projects = [...data.projects, language === 'en'
    ? ['Architecture & Build', 'K2 Studio', 'A high-impact construction studio concept with a bold editorial layout.']
    : ['Kiến trúc & Thi công', 'K2 Studio', 'Mẫu website studio kiến trúc tạo ấn tượng mạnh bằng bố cục editorial.'], language === 'en'
    ? ['Travel & Tourism', 'Mây Travel', 'A distinctive travel dossier with route rail, ticket form and departure board.']
    : ['Du lịch & Trải nghiệm', 'Mây Travel', 'Mẫu travel dossier riêng biệt với route rail, vé mời và bảng hành trình.'], language === 'en'
    ? ['Workspace & Real Estate', 'NEST Workspaces', 'An editorial office-rental experience with live availability and an interactive floor plan.']
    : ['Văn phòng & Bất động sản', 'NEST Workspaces', 'Website thuê văn phòng phong cách editorial với bảng phòng trống và sơ đồ tầng tương tác.'], language === 'en'
    ? ['Personal Portfolio', 'Étienne Mori', 'A classic luxury portfolio for a photographer, featuring biography, experience, skills and selected commissions.']
    : ['Portfolio cá nhân', 'Étienne Mori', 'Portfolio cổ điển sang trọng dành cho nhiếp ảnh gia, gồm tiểu sử, kinh nghiệm, kỹ năng và dự án tiêu biểu.'], language === 'en'
    ? ['Wedding & Event MC', 'Minh Khôi', 'A stage-inspired portfolio for a bilingual wedding and premium event host, with experience, skills and selected events.']
    : ['MC Wedding & Sự kiện', 'Minh Khôi', 'Portfolio cảm hứng sân khấu dành cho MC wedding và sự kiện cao cấp, gồm kinh nghiệm, kỹ năng và show nổi bật.'], language === 'en'
    ? ['Driving School', 'Đèn Xanh', 'A driving school site with an interactive 11-exercise test course, class pricing and trial-lesson booking.']
    : ['Đào tạo lái xe', 'Đèn Xanh', 'Website trung tâm dạy lái với sơ đồ sa hình 11 bài tương tác, bảng học phí và đặt lịch học thử.'],
    ...demos.map(({ name, type, description }) => [type[language], name, description[language]])];
  const tech = language === 'en'
    ? { eyebrow: 'Built for your next edit', title: <>A website you can<br /><em>actually run.</em></>, text: 'We build on practical, easy-to-manage foundations — so everyday content changes do not need a developer.', items: [['01', 'Easy content updates', 'Change copy, photos, menus and offers whenever your business needs it.'], ['02', 'Fast, reliable foundation', 'Responsive, SEO-ready and structured to grow with your next campaign.']], rush: 'Launch Today', rushTitle: <>Need it<br />today?</>, rushText: 'A focused landing page for a campaign, event or offer — designed and launched within one working day.', rushButton: 'Ask about one-day launch' }
    : { eyebrow: 'Xây để bạn tự chủ động', title: <>Website dễ quản lý,<br /><em>không phụ thuộc.</em></>, text: 'Website được xây trên nền tảng thực tế, dễ sử dụng để các cập nhật thường ngày không cần gọi lập trình viên.', items: [['01', 'Tự cập nhật nội dung', 'Thay đổi chữ, ảnh, menu và ưu đãi bất cứ khi nào doanh nghiệp cần.'], ['02', 'Nền tảng nhanh & ổn định', 'Responsive, sẵn sàng SEO và đủ linh hoạt cho chiến dịch tiếp theo.']], rush: 'Launch Today', rushTitle: <>Cần website<br />trong ngày?</>, rushText: 'Một landing page tập trung cho chiến dịch, sự kiện hoặc ưu đãi — thiết kế và ra mắt trong một ngày làm việc.', rushButton: 'Tư vấn gói làm nhanh' };
  const navigation = language === 'en' ? ['Services', 'UI library', 'Process'] : ['Dịch vụ', 'Kho giao diện', 'Quy trình'];
  const library = language === 'en'
    ? { eyebrow: 'UI library', title: <>Interface<br /><em>experiments.</em></>, text: 'A growing collection of visual directions for different industries. Open any demo to explore its full experience.', view: 'Open demo', consult: 'Free consultation', count: 'templates', latest: 'New', more: (n) => `Show ${n} more templates`, less: 'Show less' }
    : { eyebrow: 'Kho giao diện demo', title: <>Những giao diện<br /><em>để khám phá.</em></>, text: 'Bộ sưu tập các hướng thiết kế cho nhiều ngành nghề. Mở từng demo để xem trọn vẹn trải nghiệm.', view: 'Mở demo', consult: 'Tư vấn miễn phí', count: 'mẫu giao diện', latest: 'Mới', more: (n) => `Xem thêm ${n} mẫu`, less: 'Thu gọn' };
  // Mẫu mới nhất (cuối danh sách) hiện trước; ban đầu chỉ hiện 9 thẻ.
  const libraryItems = projects.map((project, index) => [project, projectMedia[index]]).reverse();
  const visibleItems = showAll ? libraryItems : libraryItems.slice(0, 9);

  useEffect(() => {
    const show = () => document.querySelectorAll('.reveal').forEach((element) => {
      if (element.getBoundingClientRect().top < window.innerHeight * 0.9) element.classList.add('visible');
    });
    show(); window.addEventListener('scroll', show, { passive: true });
    return () => window.removeEventListener('scroll', show);
  }, [language, showAll]);

  useEffect(() => {
    document.documentElement.lang = language;
    document.title = language === 'en'
      ? 'VN Web Studio — Design. Optimize. Grow.'
      : 'VN Web Studio — Thiết kế, tối ưu và quản lý website';
    document.querySelector('meta[name="description"]')?.setAttribute(
      'content',
      language === 'en'
        ? 'Professional website design, optimization, and management by VN Web Studio.'
        : 'Dịch vụ thiết kế, tối ưu và quản lý website chuyên nghiệp tại VN Web Studio.'
    );
  }, [language]);

  const scrollTo = (id) => {
    setOpen(false);
    const target = document.querySelector(id);
    target?.classList.toggle('visible', target.classList.contains('reveal'));
    target?.querySelectorAll('.reveal').forEach((element) => element.classList.add('visible'));
    target?.scrollIntoView({ behavior: 'smooth' });
  };
  const submitForm = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const values = new FormData(form);
    const message = language === 'en'
      ? `Hello VN Web Studio!\n\nName: ${values.get('name')}\nEmail: ${values.get('email')}\nService: ${values.get('service')}\nMessage: ${values.get('message') || '—'}`
      : `Xin chào VN Web Studio!\n\nTên: ${values.get('name')}\nEmail: ${values.get('email')}\nDịch vụ: ${values.get('service')}\nNội dung: ${values.get('message') || '—'}`;

    window.open('https://t.me/daviddao98', '_blank', 'noopener,noreferrer');
    try {
      await navigator.clipboard.writeText(message);
      setSent(t.success);
      form.reset();
    } catch {
      setSent(t.copyFallback);
    }
  };
  const toggleLanguage = () => {
    setSent('');
    setLanguage((current) => current === 'en' ? 'vi' : 'en');
  };

  return <>
    <div className="top-line"><span>VN Web Studio</span><span>Design · Optimize · Grow</span><span>{t.availability}</span></div>
    <header className={open ? 'header menu-open' : 'header'}>
      <button className="brand" onClick={() => scrollTo('#home')} aria-label="Back to home"><img src="assets/vn-logo.png" alt="VN Web Studio logo" /><span>VN Web Studio<small>Design · Optimize · Grow</small></span></button>
      <nav className={open ? 'nav open' : 'nav'}><button onClick={() => scrollTo('#services')}>{navigation[0]}</button><button onClick={() => scrollTo('#work')}>{navigation[1]}</button><button onClick={() => scrollTo('#process')}>{navigation[2]}</button><div className="mobile-nav-actions"><button className="nav-cta" onClick={toggleLanguage} aria-label="Change language">{language === 'en' ? 'VI' : 'EN'}</button><button className="nav-cta" onClick={() => scrollTo('#contact')}>{t.start} <span>↗</span></button></div></nav>
      <div className="desktop-nav-actions"><button className="nav-cta" onClick={toggleLanguage} aria-label="Change language">{language === 'en' ? 'VI' : 'EN'}</button><button className="nav-cta" onClick={() => scrollTo('#contact')}>{t.start} <span>↗</span></button></div>
      <button className="mobile-menu" onClick={() => setOpen(!open)} aria-label="Toggle navigation">{open ? '×' : '☰'}</button>
    </header>

    <main>
      <section className="hero" id="home"><div className="hero-grid"></div><div className="orb orb-one"></div><div className="orb orb-two"></div><div className="hero-content reveal"><p className="eyebrow"><i></i> {t.eyebrow}</p><h1>{t.heroTitle}</h1><p className="hero-copy">{t.heroText}</p><div className="hero-actions"><button className="primary-button" onClick={() => scrollTo('#contact')}>{t.heroCta} <span>→</span></button><button className="play-button" onClick={() => scrollTo('#work')}><b>▶</b> {library.eyebrow}</button></div></div><div className="hero-art reveal"><div className="hero-panel"><img src="assets/hero-user-banner.png" alt="VN Web Studio banner artwork" /></div><div className="metric-card"><span>Site health</span><strong>98<small>/100</small></strong><b>● Excellent score</b></div><div className="code-card"><span>&lt;/&gt;</span><code>strategy.<br />design.<br /><i>growth.</i></code></div></div><div className="hero-stats"><div><strong>50<span>+</span></strong><p>{t.stats[0]}</p></div><div><strong>6<span>+</span></strong><p>{t.stats[1]}</p></div><div><strong>FREE</strong><p>{library.consult}</p></div></div></section>
      <section className="trust"><span>{t.trust}</span><div><b>STARTUP</b><b>HOSPITALITY</b><b>LOCAL BUSINESS</b><b>CREATORS</b><b>RETAIL</b></div></section>
      <section className="services section" id="services"><div className="section-intro reveal"><p className="eyebrow"><i></i> {t.servicesEyebrow}</p><h2>{t.servicesTitle}</h2><p>{t.servicesText}</p></div><div className="service-list">{data.services.map(([number,title,text]) => <article className="service-card reveal" key={number}><span>{number}</span><div className="service-icon">{number === '01' ? '✦' : number === '02' ? '◫' : '↗'}</div><h3>{title}</h3><p>{text}</p><button onClick={() => scrollTo('#contact')}>{t.serviceButton} <i>→</i></button></article>)}</div></section>
      <section className="tech-section" id="tech"><div className="tech-main"><p className="eyebrow"><i></i> {tech.eyebrow}</p><h2>{tech.title}</h2><p>{tech.text}</p><div className="tech-list">{tech.items.map(([number, title, text]) => <article className="reveal" key={number}><span>{number}</span><div><h3>{title}</h3><p>{text}</p></div></article>)}</div></div><aside className="rush-card reveal"><span>{tech.rush}</span><div className="rush-orbit">24H</div><h3>{tech.rushTitle}</h3><p>{tech.rushText}</p><button onClick={() => scrollTo('#contact')}>{tech.rushButton} <b>↗</b></button></aside></section>
      <section className="work section" id="work"><div className="work-heading reveal"><div><p className="eyebrow"><i></i> {library.eyebrow}</p><h2>{library.title}</h2></div><div className="work-meta"><p>{library.text}</p><strong>{libraryItems.length} <small>{library.count}</small></strong></div></div><div className="project-grid">{visibleItems.map(([[type, name, description], [image, href, tone]], index) => <article className={`project-card ${tone} reveal`} key={name}><a className="project-image" href={href} target="_blank" rel="noreferrer"><img src={image} alt={`${name} website concept`} loading="lazy" /><span>{type}</span>{index === 0 && <b className="project-new">{library.latest}</b>}</a><div className="project-details"><h3>{name}</h3><p>{description}</p><a href={href} target="_blank" rel="noreferrer">{library.view} <i>↗</i></a></div></article>)}</div>{libraryItems.length > 9 && <div className="project-more"><button onClick={() => setShowAll(!showAll)}>{showAll ? library.less : library.more(libraryItems.length - 9)}</button></div>}</section>
      <section className="process" id="process"><div className="process-intro reveal"><p className="eyebrow"><i></i> {t.processEyebrow}</p><h2>{t.processTitle}</h2></div><div className="process-steps">{data.process.map(([number,title,text]) => <div className="process-step reveal" key={number}><span>{number}</span><h3>{title}</h3><p>{text}</p></div>)}</div></section>
      <section className="testimonial section"><div className="quote-mark">“</div><p className="eyebrow reveal"><i></i> {t.testimonialEyebrow}</p><blockquote className="reveal">{t.quote}</blockquote><div className="quote-by reveal"><span>TM</span><p><strong>Thảo Minh</strong><small>{t.quoteRole}</small></p></div></section>
      <section className="contact" id="contact"><div className="contact-glow"></div><div className="contact-copy reveal"><p className="eyebrow"><i></i> {t.contactEyebrow}</p><h2>{t.contactTitle}</h2><p>{t.contactText}</p><div className="contact-socials"><a href="https://t.me/daviddao98" target="_blank" rel="noreferrer" aria-label="Telegram"><span className="social-icon telegram">➤</span><small>Telegram</small></a><a href="https://zalo.me/0944190237" target="_blank" rel="noreferrer" aria-label="Zalo"><span className="social-icon zalo">Z</span><small>Zalo</small></a><a href="https://www.facebook.com/profile.php?id=61592644081779" target="_blank" rel="noreferrer" aria-label="Facebook"><span className="social-icon facebook">f</span><small>Facebook</small></a></div></div><form className="contact-form reveal" onSubmit={submitForm}><label>{t.name}<input required name="name" placeholder={t.namePlaceholder} /></label><label>{t.email}<input required type="email" name="email" placeholder={t.emailPlaceholder} /></label><label>{t.need}<select name="service"><option>{language === 'en' ? 'A new website' : 'Website mới'}</option><option>{language === 'en' ? 'Landing page design' : 'Thiết kế landing page'}</option><option>{language === 'en' ? 'Website refresh' : 'Làm mới website'}</option><option>{language === 'en' ? 'Not sure yet' : 'Chưa chắc chắn'}</option></select></label><label>{t.note}<textarea name="message" rows="3" placeholder={t.notePlaceholder}></textarea></label><button className="primary-button" type="submit">{t.send} <span>→</span></button>{sent && <p className="success" role="status">{sent}</p>}</form></section>
    </main>
    <footer><div className="footer-brand"><img src="assets/vn-logo.png" alt="" /><p>VN Web Studio<br /><small>Design · Optimize · Grow</small></p></div><p>© 2026 VN Web Studio. {t.footer}</p><div className="footer-links"><a href="https://t.me/daviddao98" target="_blank" rel="noreferrer" aria-label="Telegram">TG</a><a href="https://zalo.me/0944190237" target="_blank" rel="noreferrer" aria-label="Zalo">Zalo</a><a href="https://www.facebook.com/profile.php?id=61592644081779" target="_blank" rel="noreferrer" aria-label="Facebook">fb</a></div></footer>
  </>;
}

createRoot(document.getElementById('root')).render(<App />);
