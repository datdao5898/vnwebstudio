# Dựng project HyperFrames cho Reel mẫu website hằng ngày của VN Web Studio (1080x1920).
# Phong cách (từ 2026-11-09, theo Reel Thú Y Bạn Bốn Chân): ảnh chụp trang điện thoại phủ kín khung, cuộn từ trên xuống
# qua từng phần; dưới đáy có nhãn cam "01 / 05 · THƯƠNG HIỆU · PHẦN" và câu đang đọc chữ trắng; cuối là thẻ tối mời làm web.
# Giọng VieNeu "Hải Đăng" đọc đúng câu hiện trên hình.
# reel.mjs gọi file này bằng Python của venv VieNeu, sau khi đã chụp ảnh trang và ghi storyboard:
#   <venv>/Scripts/python -X utf8 daily/reel/build.py <storyboard.json> <thư mục project> [--no-voice]
# Giọng đọc, font và hiệu ứng âm thanh dùng chung thư viện video của topkhoahoc (video/make.py).
import json, os, pathlib, shutil, sys

LIB = pathlib.Path(os.environ.get("TOPKHOAHOC_VIDEO_LIB", r"C:\Users\datda\OneDrive\Desktop\Codex\topkhoahoc\video"))
sys.path.insert(0, str(LIB))
import make as M  # noqa: E402

M.VOICE = os.environ.get("REEL_VOICE", "Hải Đăng")
W, H = 1080, 1920
DARK, ORANGE, INK, MUTED, LABEL = "#101218", "#ff6b35", "#ffffff", "#aab0bf", "#ffd9c7"
SITE_LABEL = "DATDAO5898.GITHUB.IO/VNWEBSTUDIO"
PAD_L, PAD_R = 64, 150   # chừa mép phải cho nút like/bình luận của Reels
CAP_BOTTOM = 380         # chữ nằm trên vùng tên Page/mô tả Facebook phủ ở đáy
r, esc = M.r, M.esc


def upper(s):
    return esc(str(s).upper())


def build_reel(sb, segs, ot_start, total):
    """segs: [{label, say, start, end, y}] (giờ tuyệt đối, y = vị trí cuộn tính bằng px video)."""
    k = W / sb["mobile"]["width"]
    img_h = sb["mobile"]["height"] * k
    maxy = max(0.0, img_h - H)
    n = len(segs)
    css = f"""{M.FONTS}
    #root {{ position: absolute; inset: 0; overflow: hidden; background: #fff; font-family: "BVP"; color: {INK}; }}
    #shot {{ position: absolute; left: 0; top: 0; width: {W}px; display: block; }}
    #shade {{ position: absolute; left: 0; right: 0; bottom: 0; height: 1080px;
             background: linear-gradient(180deg, rgba(16,18,24,0) 0%, rgba(16,18,24,.7) 18%, rgba(16,18,24,.93) 34%, rgba(16,18,24,.97) 100%); }}
    .seg {{ position: absolute; left: {PAD_L}px; right: {PAD_R}px; bottom: {CAP_BOTTOM}px; opacity: 0; }}
    .tag {{ display: flex; align-items: center; gap: 18px; margin-bottom: 22px; white-space: nowrap; }}
    .num {{ flex: none; padding: 7px 16px; border-radius: 8px; background: {ORANGE}; color: {DARK}; font-weight: 900; font-size: 26px; letter-spacing: .06em; }}
    .lbl {{ overflow: hidden; text-overflow: ellipsis; font-weight: 800; font-size: 25px; letter-spacing: .16em; color: {LABEL}; }}
    .say {{ font-weight: 800; font-size: 50px; line-height: 1.3; color: {INK}; text-shadow: 0 2px 18px rgba(0,0,0,.35); }}
    #ot {{ position: absolute; inset: 0; background: {DARK}; }}
    #ot-dots {{ position: absolute; left: 90px; top: 150px; display: flex; gap: 14px; }}
    #ot-dots i {{ width: 18px; height: 18px; border-radius: 50%; background: {ORANGE}; }}
    #ot-q {{ position: absolute; left: 90px; top: 640px; font-weight: 800; font-size: 28px; letter-spacing: .2em; color: {ORANGE}; }}
    #ot-h {{ position: absolute; left: 90px; right: 90px; top: 700px; font-weight: 900; font-size: 112px; line-height: 1.04; letter-spacing: -.01em; }}
    #ot-h em {{ font-style: normal; color: {ORANGE}; }}
    #ot-sub {{ position: absolute; left: 90px; right: 160px; top: 1100px; font-weight: 500; font-size: 38px; line-height: 1.4; color: {MUTED}; }}
    #ot-url {{ position: absolute; left: 90px; top: 1270px; padding: 22px 30px; border: 2px solid #3a3f4d; border-radius: 12px;
              font-weight: 800; font-size: 28px; letter-spacing: .14em; color: {INK}; }}"""
    body = [f'    <img id="shot" src="assets/mobile.jpg" alt="">', '    <div id="shade"></div>']
    for i, s in enumerate(segs):
        body.append(f'    <div id="seg-{i}" class="seg"><div class="tag"><span class="num">{i + 1:02d} / {n:02d}</span>'
                    f'<span class="lbl">{upper(sb["brand"])} · {upper(s["label"])}</span></div>'
                    f'<div class="say">{esc(s["say"])}</div></div>')
    body.append('    <div id="ot"><div id="ot-dots"><i></i><i></i><i></i></div>'
                '<div id="ot-q">BẠN THÍCH MẪU NÀO?</div>'
                '<div id="ot-h">Làm website cho <em>thương hiệu</em> của bạn.</div>'
                '<div id="ot-sub">Nhắn tin cho VN Web Studio để nhận bản demo theo thương hiệu riêng.</div>'
                f'<div id="ot-url">{SITE_LABEL}</div></div>')

    js, sfx, prev = [], [], 0.0
    for i, s in enumerate(segs):
        t0, t1 = s["start"], s["end"]
        target = min(maxy, max(0.0, s["y"]))
        if i == 0:
            # khung 0 là ảnh bìa: đầu trang, nhãn và câu mở đầu đã hiện sẵn
            js.append(f'    tl.set("#seg-0", {{ opacity: 1 }}, 0);')
            move = 0.0
        else:
            js.append(f'    tl.fromTo("#seg-{i}", {{ opacity: 0, y: 26 }}, {{ opacity: 1, y: 0, duration: 0.35, ease: "power3.out" }}, {r(t0 + 0.2)});')
            move = min(1.0, max(0.5, (t1 - t0) * 0.3))
            js.append(f'    tl.fromTo("#shot", {{ y: -{r(prev)} }}, {{ y: -{r(target)}, duration: {r(move)}, ease: "power2.inOut", immediateRender: false }}, {r(t0)});')
            sfx.append(("whoosh-short.mp3", t0, 0.22))
        # trôi chậm trong lúc đọc để hình luôn chuyển động
        drift = min(maxy, target + min(220.0, (t1 - t0) * 45))
        ir = "" if i == 0 else ", immediateRender: false"
        js.append(f'    tl.fromTo("#shot", {{ y: -{r(target)} }}, {{ y: -{r(drift)}, duration: {r(max(0.2, t1 - t0 - move))}, ease: "none"{ir} }}, {r(t0 + move)});')
        prev = drift
        # phần cuối ẩn đi khi thẻ kết trượt lên (t1 = lúc thẻ kết bắt đầu)
        js.append(f'    tl.to("#seg-{i}", {{ opacity: 0, y: -16, duration: 0.2, ease: "power2.in" }}, {r(t1 - 0.05)});')
    js.append(f'    tl.fromTo("#ot", {{ y: {H} }}, {{ y: 0, duration: 0.6, ease: "power3.out" }}, {r(ot_start)});')
    js.append(f'    tl.fromTo("#ot-dots i", {{ scale: 0 }}, {{ scale: 1, duration: 0.3, stagger: 0.08, ease: "back.out(3)" }}, {r(ot_start + 0.45)});')
    js.append(f'    tl.fromTo("#ot-q", {{ opacity: 0, y: 20 }}, {{ opacity: 1, y: 0, duration: 0.3 }}, {r(ot_start + 0.55)});')
    js.append(f'    tl.fromTo("#ot-h", {{ opacity: 0, y: 40 }}, {{ opacity: 1, y: 0, duration: 0.45, ease: "power3.out" }}, {r(ot_start + 0.65)});')
    js.append(f'    tl.fromTo("#ot-sub", {{ opacity: 0 }}, {{ opacity: 1, duration: 0.35 }}, {r(ot_start + 1.0)});')
    js.append(f'    tl.fromTo("#ot-url", {{ opacity: 0, y: 16 }}, {{ opacity: 1, y: 0, duration: 0.35 }}, {r(ot_start + 1.2)});')
    sfx += [("whoosh.mp3", ot_start - 0.05, 0.3), ("pop.mp3", ot_start + 0.7, 0.35)]
    doc = f'''<template>
  <style>
{css}
  </style>
  <div id="root" data-composition-id="reel" data-width="{W}" data-height="{H}" data-layout-allow-overflow data-layout-allow-overlap>
{chr(10).join(body)}
  </div>
  <script>
    const tl = gsap.timeline({{ paused: true }});
{chr(10).join(js)}
    window.__timelines["reel"] = tl;
  </script>
</template>
'''
    return doc, sfx


def main():
    if len(sys.argv) < 3:
        print("build.py <storyboard.json> <out_dir> [--no-voice]")
        sys.exit(1)
    sb = json.loads(pathlib.Path(sys.argv[1]).read_text(encoding="utf-8"))
    out = pathlib.Path(sys.argv[2])
    out.mkdir(parents=True, exist_ok=True)
    M.scaffold(out, out.name)
    shutil.copy(sb["mobile"]["file"], out / "assets" / "mobile.jpg")
    feats = sb["features"]
    parts = [{"label": "Mở đầu", "say": sb["hookSay"]}] + [{"label": f.get("label") or f["title"], "say": f["say"], "offset": f.get("offset")} for f in feats]
    outro = {"say": sb["outroSay"]}
    # mỗi phần là một cảnh để giữa các phần có khoảng nghỉ dài hơn
    scenes = [{"beats": [{"say": p["say"]}]} for p in parts] + [{"beats": [outro]}]
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
    k = W / sb["mobile"]["width"]
    maxy = max(0.0, sb["mobile"]["height"] * k - H)
    segs = []
    for i, p in enumerate(parts):
        if i == 0:
            y = 0.0
        elif p.get("offset") is not None:
            y = p["offset"] * k - 110   # đầu phần nằm sát mép trên
        else:
            y = maxy * i / len(parts)
        segs.append({"label": p["label"], "say": p["say"], "start": starts[i], "end": starts[i + 1], "y": y})
    doc, sfx = build_reel(sb, segs, starts[-1], total)
    (out / "compositions").mkdir(exist_ok=True)
    (out / "compositions" / "reel.html").write_text(doc, encoding="utf-8")
    old = out / "compositions"
    for f in ("hook.html", "ft.html", "dk.html", "ot.html", "captions.html"):
        (old / f).unlink(missing_ok=True)
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
      html, body {{ margin: 0; width: {W}px; height: {H}px; overflow: hidden; background: {DARK}; }}
      #root {{ width: 100%; height: 100%; position: relative; background: {DARK}; }}
    </style>
  </head>
  <body>
    <div id="root" data-composition-id="main" data-start="0" data-duration="{r(total)}" data-width="{W}" data-height="{H}">
      <div id="reel" data-composition-id="reel" data-composition-src="compositions/reel.html" data-start="0" data-duration="{r(total)}" data-track-index="1" data-track-kind="graphics" data-width="{W}" data-height="{H}"></div>
{chr(10).join(audio)}
    </div>
    <script>
      window.__timelines = window.__timelines || {{}};
      window.__timelines["main"] = gsap.timeline({{ paused: true }});
    </script>
  </body>
</html>
''', encoding="utf-8")
    print(f"OK: {out} ({r(total)} s, {len(segs)} phần)")


if __name__ == "__main__":
    main()
