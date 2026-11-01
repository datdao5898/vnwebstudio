# Dựng project HyperFrames cho Reel mẫu website hằng ngày của VN Web Studio (1080x1920).
# reel.mjs gọi file này bằng Python của venv VieNeu, sau khi đã chụp ảnh trang và ghi storyboard:
#   <venv>/Scripts/python -X utf8 daily/reel/build.py <storyboard.json> <thư mục project> [--no-voice]
# Giọng đọc, phụ đề, font và hiệu ứng âm thanh dùng chung thư viện video của topkhoahoc (video/make.py).
import html, json, os, pathlib, shutil, sys

LIB = pathlib.Path(os.environ.get("TOPKHOAHOC_VIDEO_LIB", r"C:\Users\datda\OneDrive\Desktop\Codex\topkhoahoc\video"))
sys.path.insert(0, str(LIB))
import make as M  # noqa: E402

M.VOICE = os.environ.get("REEL_VOICE", "Quang Sơn")
W, H = 1080, 1920
BG, BLUE, CYAN, YELLOW, INK, MUTED = "#050a18", "#1266ff", "#12dfff", "#ffcb68", "#f3f7ff", "#a6b6d0"
SITE_LABEL = "datdao5898.github.io/vnwebstudio"
r, esc = M.r, M.esc

BASE_CSS = f"""{M.FONTS}
    #root {{ position: absolute; inset: 0; overflow: hidden; background: {BG}; font-family: "BVP"; color: {INK}; }}
    .glow {{ position: absolute; border-radius: 50%; }}
    .chip {{ position: absolute; left: 90px; display: inline-block; padding: 12px 26px; border-radius: 999px; font-weight: 800; font-size: 30px;
             letter-spacing: .08em; text-transform: uppercase; color: {BG}; background: {CYAN}; }}
    .phone {{ position: absolute; border-radius: 64px; background: #0d1426; border: 3px solid #2a3758; box-shadow: 0 40px 120px rgba(18,102,255,.35); overflow: hidden; }}
    .screen {{ position: absolute; overflow: hidden; background: #fff; border-radius: 46px; }}
    .screen img {{ position: absolute; left: 0; top: 0; display: block; }}
    .notch {{ position: absolute; left: 50%; width: 130px; height: 30px; margin-left: -65px; border-radius: 0 0 18px 18px; background: #0d1426; }}"""


def glows(p):
    return (f'<div id="{p}-g1" class="glow" style="left:-260px;top:-200px;width:900px;height:900px;background:radial-gradient(circle,rgba(18,102,255,.45),rgba(18,102,255,0) 70%)"></div>'
            f'<div id="{p}-g2" class="glow" style="left:420px;top:1050px;width:1000px;height:1000px;background:radial-gradient(circle,rgba(18,223,255,.25),rgba(18,223,255,0) 70%)"></div>')


def glow_js(p, dur):
    return (f'tl.fromTo("#{p}-g1", {{ x: 0, y: 0 }}, {{ x: 120, y: 80, duration: {r(dur)}, ease: "none" }}, 0);\n'
            f'    tl.fromTo("#{p}-g2", {{ x: 0, y: 0 }}, {{ x: -140, y: -60, duration: {r(dur)}, ease: "none" }}, 0);')


def phone(p, left, top, sw, sh, img, bezel=20):
    return (f'<div id="{p}-phone" class="phone" style="left:{left}px;top:{top}px;width:{sw + 2 * bezel}px;height:{sh + 2 * bezel}px">'
            f'<div class="screen" style="left:{bezel}px;top:{bezel}px;width:{sw}px;height:{sh}px">'
            f'<img id="{p}-shot" src="assets/{img}" style="width:{sw}px" alt=""></div>'
            f'<div class="notch" style="top:{bezel}px"></div></div>')


def scene_doc(sid, dur, css, body, js):
    return f'''<template>
  <style>
{BASE_CSS}
{css}
  </style>
  <div id="root" data-composition-id="{sid}" data-width="{W}" data-height="{H}" data-layout-allow-overflow data-layout-allow-overlap>
    {glows(sid)}
{body}
  </div>
  <script>
    const tl = gsap.timeline({{ paused: true }});
    {glow_js(sid, dur)}
{js}
    window.__timelines["{sid}"] = tl;
  </script>
</template>
'''


def build_hook(sb, dur):
    css = f"""    #hook-text {{ position: absolute; left: 90px; top: 300px; width: 900px; font-weight: 900; font-size: 68px; line-height: 1.16; color: {INK}; }}
    #hook-text em {{ font-style: normal; color: {YELLOW}; }}"""
    hook = esc(sb["hook"])
    body = (f'    <div id="hook-chip" class="chip" style="top:200px">Mẫu website · {esc(sb["industry"])}</div>\n'
            f'    <div id="hook-text">{hook}</div>\n'
            f'    {phone("hook", 270, 690, 500, 1060, "mobile.jpg")}')
    # Khung 0 đã có chữ và điện thoại (ảnh bìa Reel); chỉ nhích nhẹ để có chuyển động.
    js = f"""    tl.fromTo("#hook-text", {{ y: 0 }}, {{ y: -10, duration: {r(dur)}, ease: "none" }}, 0);
    tl.fromTo("#hook-phone", {{ y: 0, rotation: -2 }}, {{ y: -40, rotation: 0, duration: {r(dur)}, ease: "sine.inOut" }}, 0);
    tl.fromTo("#hook-shot", {{ y: 0 }}, {{ y: -{r(min(sb['_mob_max'](500, 1060), 260))}, duration: {r(dur)}, ease: "sine.inOut" }}, 0);"""
    return scene_doc("hook", dur, css, body, js), []


def build_features(sb, start, dur):
    sw, sh = 470, 910
    scale = sw / sb["mobile"]["width"]
    maxy = max(0, sb["mobile"]["height"] * scale - sh)
    css = f"""    .ft {{ position: absolute; left: 90px; top: 210px; width: 900px; opacity: 0; }}
    .ft small {{ display: block; font-weight: 800; font-size: 28px; letter-spacing: .14em; color: {CYAN}; margin-bottom: 8px; }}
    .ft b {{ display: block; font-weight: 900; font-size: 54px; line-height: 1.12; color: {INK}; }}"""
    feats = sb["features"]
    body = [f'    <div id="ft-{i}" class="ft"><small>TÍNH NĂNG {i + 1}/{len(feats)}</small><b>{esc(f["title"])}</b></div>' for i, f in enumerate(feats)]
    body.append(f'    {phone("ft", (W - sw - 40) // 2, 400, sw, sh, "mobile.jpg")}')
    js = ['    tl.fromTo("#ft-phone", { y: 60, scale: 0.96 }, { y: 0, scale: 1, duration: 0.5, ease: "power3.out" }, 0);']
    sfx = []
    n = len(feats)
    prev = 0
    for i, f in enumerate(feats):
        t0 = max(0.0, f["_start"] - start - 0.15)
        t1 = (feats[i + 1]["_start"] - start - 0.15) if i + 1 < n else dur
        off = f.get("offset")
        target = min(maxy, max(0, off * scale - 60)) if off is not None else maxy * (i + 1) / (n + 1)
        js.append(f'    tl.fromTo("#ft-{i}", {{ opacity: 0, y: 30 }}, {{ opacity: 1, y: 0, duration: 0.35, ease: "back.out(2)" }}, {r(t0)});')
        if i + 1 < n:
            js.append(f'    tl.to("#ft-{i}", {{ opacity: 0, y: -20, duration: 0.2, ease: "power2.in" }}, {r(t1 - 0.2)});')
        ri = ", immediateRender: false" if i else ""
        move = min(0.9, max(0.4, (t1 - t0) * 0.3))
        js.append(f'    tl.fromTo("#ft-shot", {{ y: -{r(prev)} }}, {{ y: -{r(target)}, duration: {r(move)}, ease: "power2.inOut"{ri} }}, {r(t0)});')
        drift = min(maxy, target + 120)
        js.append(f'    tl.fromTo("#ft-shot", {{ y: -{r(target)} }}, {{ y: -{r(drift)}, duration: {r(max(0.2, t1 - t0 - move))}, ease: "none", immediateRender: false }}, {r(t0 + move)});')
        prev = drift
        sfx.append(("pop.mp3", start + t0 + 0.05, 0.45))
    return scene_doc("ft", dur, css, "\n".join(body), "\n".join(js)), sfx


def build_desktop(sb, dur):
    fw, fh = 940, 588
    scale = fw / sb["desktop"]["width"]
    maxy = max(0, sb["desktop"]["height"] * scale - fh)
    css = f"""    #dk-title {{ position: absolute; left: 90px; top: 220px; width: 900px; font-weight: 900; font-size: 60px; line-height: 1.12; }}
    #dk-sub {{ position: absolute; left: 90px; top: 300px; font-weight: 500; font-size: 32px; color: {MUTED}; }}
    #dk-frame {{ position: absolute; left: 70px; top: 400px; width: {fw}px; height: {fh + 44}px; border-radius: 18px; overflow: hidden; background: #fff; box-shadow: 0 40px 120px rgba(18,102,255,.35); }}
    #dk-bar {{ height: 44px; background: #e9eef8; display: flex; align-items: center; gap: 10px; padding-left: 20px; }}
    #dk-bar i {{ width: 13px; height: 13px; border-radius: 50%; background: #c3cde0; }}
    #dk-view {{ position: absolute; left: 0; top: 44px; width: {fw}px; height: {fh}px; overflow: hidden; }}
    #dk-shot {{ position: absolute; left: 0; top: 0; width: {fw}px; display: block; }}"""
    body = (f'    <div id="dk-title">Máy tính cũng đẹp</div>\n'
            f'    <div id="dk-sub">Một website, hiển thị chuẩn trên mọi màn hình</div>\n'
            f'    <div id="dk-frame"><div id="dk-bar"><i></i><i></i><i></i></div><div id="dk-view"><img id="dk-shot" src="assets/desktop.jpg" alt=""></div></div>\n'
            f'    {phone("dkm", 790, 700, 210, 420, "mobile.jpg", bezel=10)}')
    js = f"""    tl.fromTo("#dk-title", {{ opacity: 0, y: 30 }}, {{ opacity: 1, y: 0, duration: 0.35, ease: "power3.out" }}, 0.05);
    tl.fromTo("#dk-sub", {{ opacity: 0 }}, {{ opacity: 1, duration: 0.3 }}, 0.25);
    tl.fromTo("#dk-frame", {{ y: 80, scale: 0.94, opacity: 0 }}, {{ y: 0, scale: 1, opacity: 1, duration: 0.5, ease: "power3.out" }}, 0);
    tl.fromTo("#dkm-phone", {{ x: 160, opacity: 0 }}, {{ x: 0, opacity: 1, duration: 0.5, ease: "power3.out" }}, 0.3);
    tl.fromTo("#dk-shot", {{ y: 0 }}, {{ y: -{r(min(maxy, 1100))}, duration: {r(max(0.5, dur - 0.6))}, ease: "sine.inOut" }}, 0.5);"""
    return scene_doc("dk", dur, css, body, js), []


def build_outro(sb, dur):
    css = f"""    #ot-mark {{ position: absolute; left: 0; right: 0; top: 470px; text-align: center; font-weight: 900; font-size: 116px; letter-spacing: -.02em; }}
    #ot-line {{ position: absolute; left: 340px; width: 400px; top: 620px; height: 10px; border-radius: 5px; background: linear-gradient(90deg,{BLUE},{CYAN}); }}
    #ot-sub {{ position: absolute; left: 90px; right: 90px; top: 680px; text-align: center; font-weight: 500; font-size: 40px; color: {MUTED}; }}
    #ot-cta {{ position: absolute; left: 0; right: 0; top: 820px; text-align: center; }}
    #ot-cta span {{ display: inline-block; padding: 26px 48px; border-radius: 999px; background: {YELLOW}; color: {BG}; font-weight: 900; font-size: 44px; }}
    #ot-url {{ position: absolute; left: 0; right: 0; top: 990px; text-align: center; font-weight: 800; font-size: 36px; color: {CYAN}; }}"""
    body = ('    <div id="ot-mark">VN Web Studio</div>\n    <div id="ot-line"></div>\n'
            '    <div id="ot-sub">Thiết kế website cho shop &amp; dịch vụ</div>\n'
            '    <div id="ot-cta"><span>Inbox để nhận bản demo</span></div>\n'
            f'    <div id="ot-url">{SITE_LABEL}</div>')
    js = """    tl.fromTo("#ot-mark", { opacity: 0, scale: 1.2 }, { opacity: 1, scale: 1, duration: 0.45, ease: "power4.out" }, 0.05);
    tl.fromTo("#ot-line", { scaleX: 0 }, { scaleX: 1, duration: 0.5, ease: "power3.out" }, 0.3);
    tl.fromTo("#ot-sub", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.35 }, 0.45);
    tl.fromTo("#ot-cta span", { opacity: 0, scale: 0.7 }, { opacity: 1, scale: 1, duration: 0.45, ease: "back.out(2.4)" }, 0.7);
    tl.fromTo("#ot-url", { opacity: 0 }, { opacity: 1, duration: 0.35 }, 1.0);"""
    return scene_doc("ot", dur, css, body, js), [("impact-bass-1.mp3", 0.05, 0.4), ("pop.mp3", 0.75, 0.45)]


def main():
    if len(sys.argv) < 3:
        print("build.py <storyboard.json> <out_dir> [--no-voice]")
        sys.exit(1)
    sb = json.loads(pathlib.Path(sys.argv[1]).read_text(encoding="utf-8"))
    out = pathlib.Path(sys.argv[2])
    out.mkdir(parents=True, exist_ok=True)
    M.scaffold(out, out.name)
    for key in ("mobile", "desktop"):
        shutil.copy(sb[key]["file"], out / "assets" / f"{key}.jpg")
    hook = {"say": sb["hookSay"]}
    feats = sb["features"]
    desk = {"say": sb["desktopSay"]}
    outro = {"say": sb["outroSay"]}
    scenes = [{"beats": [hook]}, {"beats": feats}, {"beats": [desk]}, {"beats": [outro]}]
    timing = out / ".vo" / "timing.json"
    beats = [(si, b) for si, sc in enumerate(scenes) for b in sc["beats"]]
    if "--no-voice" in sys.argv and timing.exists():
        data = json.loads(timing.read_text(encoding="utf-8"))
        for (_, b), (st, du) in zip(beats, data["beats"]):
            b["_start"], b["_dur"] = st, du
        speech_end = data["end"]
    else:
        print(f"Tạo giọng đọc ({M.VOICE})…", flush=True)
        beats, speech_end = M.voice({"scenes": scenes}, out)
        timing.write_text(json.dumps({"beats": [[b["_start"], b["_dur"]] for _, b in beats], "end": speech_end}), encoding="utf-8")
    total = round(speech_end + 2.0, 2)
    starts = [0.0] + [max(0.0, sc["beats"][0]["_start"] - 0.3) for sc in scenes[1:]]
    ends = starts[1:] + [total]
    sb["_mob_max"] = lambda sw, sh: max(0, sb["mobile"]["height"] * sw / sb["mobile"]["width"] - sh)
    (out / "compositions").mkdir(exist_ok=True)
    docs = [("hook",) + build_hook(sb, ends[0] - starts[0]),
            ("ft",) + build_features(sb, starts[1], ends[1] - starts[1]),
            ("dk",) + build_desktop(sb, ends[2] - starts[2]),
            ("ot",) + build_outro(sb, ends[3] - starts[3])]
    hosts, sfx = [], []
    for k, (sid, doc, sx) in enumerate(docs):
        (out / "compositions" / f"{sid}.html").write_text(doc, encoding="utf-8")
        # build_features trả giờ tuyệt đối; các cảnh khác trả giờ trong cảnh
        sfx += [(n, a if sid == "ft" else starts[k] + a, v) for n, a, v in sx]
        if k:
            sfx.append(("whoosh.mp3" if k % 2 else "whoosh-short.mp3", starts[k] - 0.05, 0.35))
        hosts.append(f'      <div id="{sid}" data-composition-id="{sid}" data-composition-src="compositions/{sid}.html" data-start="{r(starts[k])}" data-duration="{r(ends[k] - starts[k])}" data-track-index="1" data-track-kind="graphics" data-width="{W}" data-height="{H}" style="z-index:{1 + k}"></div>')
    # Phụ đề cho phần tính năng và máy tính (câu mở đầu và lời chào cuối đã hiện chữ lớn trên hình)
    cap_beats = [(si, b) for si, b in beats if si in (1, 2)]
    (out / "compositions" / "captions.html").write_text(M.captions_html(cap_beats, "pop"), encoding="utf-8")
    audio = ['      <audio id="vo" class="clip" src="assets/vo.mp3" data-start="0" data-track-index="3" data-volume="1"></audio>']
    for j, (name, at, vol) in enumerate(sfx):
        audio.append(f'      <audio id="sfx-{j}" class="clip" src="assets/sfx/{name}" data-start="{r(max(0, at))}" data-track-index="{4 + j}" data-volume="{vol}"></audio>')
    (out / "index.html").write_text(f'''<!doctype html>
<html lang="vi">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width={W}, height={H}" />
    <script src="https://cdn.jsdelivr.net/npm/gsap@3.14.2/dist/gsap.min.js"></script>
    <style>
      * {{ margin: 0; padding: 0; box-sizing: border-box; }}
      html, body {{ margin: 0; width: {W}px; height: {H}px; overflow: hidden; background: {BG}; }}
      #root {{ width: 100%; height: 100%; position: relative; background: {BG}; }}
    </style>
  </head>
  <body>
    <div id="root" data-composition-id="main" data-start="0" data-duration="{r(total)}" data-width="{W}" data-height="{H}">
{chr(10).join(hosts)}
      <div id="captions" data-composition-id="captions" data-composition-src="compositions/captions.html" data-start="0" data-duration="{r(total)}" data-track-index="2" data-track-kind="captions" data-width="{W}" data-height="{H}" style="z-index: 30"></div>
{chr(10).join(audio)}
    </div>
    <script>
      window.__timelines = window.__timelines || {{}};
      window.__timelines["main"] = gsap.timeline({{ paused: true }});
    </script>
  </body>
</html>
''', encoding="utf-8")
    print(f"OK: {out} ({r(total)} s)")


if __name__ == "__main__":
    main()
