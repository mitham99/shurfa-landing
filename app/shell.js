/* =========================================================
   شُرفة — تطبيق المستخدم
   • دخول برمز يُرسل للبريد، والجلسة تبقى محفوظة في الجهاز
   • ما يظهر يعتمد على دور الحساب في قاعدة البيانات:
       زائر ← الرئيسية · جوازي · الفعاليات · حسابي
       شريك (موظف كشك) ← + «كشكي» لمسح جوازات الزوار
       منظم ← + «الإدارة» لمؤشرات الفعالية
   • كل الأرقام والبطاقات من قاعدة البيانات (لا بيانات وهمية)
   ========================================================= */
(() => {
  "use strict";
  const A = window.ShurfaApp;
  const D = window.SHURFA_DATA || { events: [] };
  const { esc } = A;
  const $ = (s, el = document) => el.querySelector(s);
  const scr = $("#screen"), bar = $("#tabbar");
  const EV = A.eventId;                                     // الفعالية الحالية (افتراضيًا squ-eat)
  const TYPE = { student: "طالب", intl: "طالب دولي", staff: "موظف", visitor: "زائر" };
  const KIND_ICON = { food: "food", cafe: "cafe", sweets: "sweets", games: "games", other: "star" };

  /* ---------- أيقونات ---------- */
  const P = {
    home: "M3 10.5 12 3l9 7.5V21h-6v-6H9v6H3z", award: "M12 3a6 6 0 1 0 0 12a6 6 0 0 0 0-12zM8.5 14 7 22l5-3 5 3-1.5-8",
    user: "M12 4a4 4 0 1 0 0 8a4 4 0 0 0 0-8zM4 21c0-4 4-6 8-6s8 2 8 6", cal: "M3 5h18v16H3zM3 10h18M8 3v4M16 3v4",
    clock: "M12 3a9 9 0 1 0 0 18a9 9 0 0 0 0-18zM12 7v5l3 2", pin: "M12 21s7-6 7-12a7 7 0 0 0-14 0c0 6 7 12 7 12zM12 6.5a2.5 2.5 0 1 0 0 5a2.5 2.5 0 0 0 0-5z",
    back: "m9 6 6 6-6 6", fwd: "m15 6-6 6 6 6", check: "m5 12 5 5 9-10", x: "M6 6l12 12M18 6 6 18", alert: "M12 3 2 20h20zM12 10v4M12 17v.5",
    scan: "M4 8V5a1 1 0 0 1 1-1h3M16 4h3a1 1 0 0 1 1 1v3M20 16v3a1 1 0 0 1-1 1h-3M8 20H5a1 1 0 0 1-1-1v-3M4 12h16",
    food: "M7 3v8M5 3v5a2 2 0 0 0 4 0V3M7 11v10M17 3c-2 1-3 3-3 6v4h3v8", cafe: "M5 8h12v6a5 5 0 0 1-5 5h-2a5 5 0 0 1-5-5zM17 10h1a2 2 0 0 1 0 4h-1M9 3v2M13 3v2",
    sweets: "M8 8a4 4 0 1 1 8 0a4 4 0 0 1-8 0M12 12v9", games: "M6 10h4M8 8v4M15 11h.01M18 9h.01M3 13a5 5 0 0 0 5 5c1.5 0 2.5-1 4-1s2.5 1 4 1a5 5 0 0 0 5-5l-1-5a3 3 0 0 0-3-2H7a3 3 0 0 0-3 2z",
    gift: "M3 8h18v4H3zM5 12v9h14v-9M12 8v13M12 8C10 4 6 4 6 6.5S9 8 12 8c3 0 6-.5 6-1.5S14 4 12 8", users: "M16 20c0-3-3-5-6-5s-6 2-6 5M10 12a4 4 0 1 0 0-8a4 4 0 0 0 0 8M17 11a3 3 0 1 0 0-6M22 20c0-2.5-2-4-4-4.5",
    chart: "M4 20V10M10 20V4M16 20v-7M22 20H2", list: "M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01", lock: "M5 11h14v10H5zM8 11V8a4 4 0 0 1 8 0v3",
    star: "M12 3l2.8 5.7 6.2.9-4.5 4.4 1 6.2L12 17.3 6.5 20.2l1-6.2L3 9.6l6.2-.9z", logout: "M9 21H5V3h4M16 17l5-5-5-5M21 12H9", mail: "M3 5h18v14H3zM3 6l9 7 9-7",
    grid: "M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z", qr: "M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h3v3h-3zM20 14v1M14 20h1M18 18h3v3h-3",
    phone: "M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2", shield: "M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6zM9 12l2 2 4-4",
    undo: "M9 14 4 9l5-5M4 9h11a5 5 0 0 1 0 10h-3", edit: "M4 20h4L19 9l-4-4L4 16zM14 6l4 4", trash: "M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3",
    compass: "M12 3a9 9 0 1 0 0 18a9 9 0 0 0 0-18zM15.5 8.5l-2 5-5 2 2-5z", box: "M3 7l9-4 9 4v10l-9 4-9-4zM3 7l9 4 9-4M12 11v10", ext: "M14 4h6v6M20 4l-9 9M18 14v6H4V6h6"
  };
  const ic = (n, s = 20, w = 1.8) => `<svg aria-hidden="true" width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"><path d="${P[n] || P.star}"></path></svg>`;

  /* ---------- أدوات ---------- */
  let toastT;
  function toast(msg, type = "") {
    const t = $("#toast");
    t.textContent = msg; t.className = "toast show " + type;
    clearTimeout(toastT); toastT = setTimeout(() => { t.className = "toast"; }, 3200);
  }
  const errMsg = (e) => A.errText(e && e.code);
  const evById = (id) => (D.events || []).find((e) => e.id === id);
  const img = (p) => (p ? "../" + p.replace(/^\/+/, "") : "");
  const firstName = (n) => String(n || "").trim().split(/\s+/)[0] || "";
  const greet = () => { const h = new Date().getHours(); return h < 12 ? "صباح الخير" : "مساء الخير"; };
  const time = (d) => { try { return new Date(d).toLocaleTimeString("ar-OM-u-nu-latn", { hour: "numeric", minute: "2-digit" }); } catch (e) { return ""; } };
  const dayTime = (d) => { try { return new Date(d).toLocaleString("ar-OM-u-nu-latn", { weekday: "short", hour: "numeric", minute: "2-digit" }); } catch (e) { return ""; } };
  const plural = (n, one, two, few, many) => n === 1 ? one : n === 2 ? two : n >= 3 && n <= 10 ? `${n} ${few}` : `${n} ${many}`;
  const statusChip = (s) => s === "available" ? '<span class="st st-ok">متاحة</span>' : s === "ended" ? '<span class="st st-mute">انتهت</span>' : '<span class="st st-warn">قريبًا</span>';

  /* ---------- الحالة ---------- */
  const S = {
    me: null,               // نتيجة me()
    pass: null,             // my_pass(EV)
    stalls: null,           // list_stalls(EV)
    passOk: false,          // هل الجواز مفعّل لهذه الفعالية
    tab: "home", sub: null, // شاشة فرعية فوق التبويب
    passTab: "cards",
    work: { stall: null, mode: "stall", res: null, last: null, busy: false },
    authStep: "email", email: "", resendAt: 0
  };
  const isStaff = () => !!(S.me && S.me.stalls && S.me.stalls.length);
  const isOrg = () => !!(S.me && S.me.organizer);
  const myName = () => (S.me && S.me.profile && S.me.profile.name) || "";

  /* =========================================================
     الدخول
     ========================================================= */
  function renderAuth() {
    bar.hidden = true; scr.className = "screen no-tabs";
    const ev = evById(EV);
    const top = `<div class="auth-top">
      <img src="../assets/img/brand/monogram-160.png" alt="">
      <h1>${S.authStep === "profile" ? "أكمل بياناتك" : "أهلًا بك في شُرفة"}</h1>
      <p>${S.authStep === "profile" ? "مرة واحدة فقط، لإصدار جوازك الرقمي." : "منصة الفعاليات والتجارب في عُمان. سجّل دخولك لتحصل على جوازك الرقمي" + (ev ? " في " + esc(ev.name.split("—")[0].trim()) : "") + "."}</p>
    </div>`;
    let body = "";
    if (S.authStep === "email") {
      body = `<form class="auth-body" data-f="email" novalidate>
        <div class="field"><label for="au-email">البريد الإلكتروني</label>
          <input class="input" id="au-email" name="email" type="email" inputmode="email" autocomplete="email" dir="ltr" placeholder="name@example.com" value="${esc(S.email)}" required></div>
        <p class="sub">نرسل رمز دخول من 6 أرقام إلى بريدك. لا نحتاج كلمة مرور.</p>
        <div id="au-msg"></div>
        <button class="btn btn-dark" type="submit">${ic("mail", 20)} أرسل رمز الدخول</button>
        <p class="sub" style="text-align:center">بالمتابعة توافق على <a href="privacy.html">سياسة الخصوصية</a>.</p>
      </form>`;
    } else if (S.authStep === "code") {
      const wait = Math.max(0, Math.ceil((S.resendAt - Date.now()) / 1000));
      body = `<form class="auth-body" data-f="code" novalidate>
        <div class="card flat row" style="gap:10px">${ic("mail", 20)}<span class="grow" style="font-size:14px">أرسلنا الرمز إلى <b dir="ltr">${esc(S.email)}</b></span><button type="button" class="linkbtn" data-a="au-change">تغيير</button></div>
        <div class="field"><label for="au-code">رمز الدخول</label>
          <input class="input code" id="au-code" name="code" inputmode="numeric" autocomplete="one-time-code" maxlength="10" placeholder="••••••" required></div>
        <p class="sub">تحقق من صندوق الوارد أو الرسائل غير المرغوبة (Spam). إذا وصلك رابط بدل الرمز، اضغط عليه من هذا الجهاز.</p>
        <div id="au-msg"></div>
        <button class="btn btn-dark" type="submit">تأكيد الدخول</button>
        <button type="button" class="linkbtn" data-a="au-resend" id="au-resend" ${wait ? "disabled" : ""} style="align-self:center">${wait ? `إعادة الإرسال بعد ${wait} ث` : "أعد إرسال الرمز"}</button>
      </form>`;
    } else {
      const p = (S.me && S.me.profile) || {};
      body = `<form class="auth-body" data-f="profile" novalidate>
        <div class="field"><label for="pf-name">الاسم</label><input class="input" id="pf-name" name="name" autocomplete="name" maxlength="60" placeholder="مثال: أحمد" value="${esc(p.name || "")}" required></div>
        <div class="field"><label for="pf-phone">رقم الهاتف</label><input class="input" id="pf-phone" name="phone" inputmode="tel" autocomplete="tel" dir="ltr" style="text-align:right" placeholder="9xxxxxxx" value="${esc(p.phone || "")}" required></div>
        <div class="field"><span>أنت</span><div class="opts">${Object.entries(TYPE).map(([k, l]) => `<label class="opt"><input type="radio" name="type" value="${k}" ${(p.type || "student") === k ? "checked" : ""}>${l}</label>`).join("")}</div></div>
        <label class="check"><input type="checkbox" name="consent" ${p.name ? "checked" : ""}> <span>أوافق على استخدام اسمي ورقمي لتشغيل الجواز الرقمي في الفعاليات فقط. <a href="privacy.html">سياسة الخصوصية</a></span></label>
        <div id="au-msg"></div>
        <button class="btn btn-cta" type="submit">${S.me && S.me.profile ? "حفظ" : "أصدر جوازي"}</button>
        ${S.me && S.me.profile ? `<button type="button" class="btn btn-line" data-a="go-tab" data-tab="account">إلغاء</button>` : ""}
      </form>`;
    }
    scr.innerHTML = top + body;
    const f = scr.querySelector("input:not([type=radio]):not([type=checkbox])");
    if (f && !f.value) setTimeout(() => f.focus(), 50);
    if (S.authStep === "code") tickResend();
  }
  let resendTimer;
  function tickResend() {
    clearTimeout(resendTimer);
    const b = $("#au-resend"); if (!b) return;
    const wait = Math.max(0, Math.ceil((S.resendAt - Date.now()) / 1000));
    b.disabled = wait > 0; b.textContent = wait ? `إعادة الإرسال بعد ${wait} ث` : "أعد إرسال الرمز";
    if (wait) resendTimer = setTimeout(tickResend, 1000);
  }
  const authMsg = (t, k = "err") => { const m = $("#au-msg"); if (m) m.innerHTML = t ? `<div class="msg ${k}">${esc(t)}</div>` : ""; };

  async function sendCode(email) {
    await A.auth.sendCode(email);
    S.email = email; S.resendAt = Date.now() + 60000; S.authStep = "code";
    A.session.set("pending-email", email);
    renderAuth();
  }

  /* =========================================================
     التشغيل
     ========================================================= */
  async function boot() {
    if (!A.ready) {
      scr.innerHTML = `<div class="empty" style="padding-top:80px">${ic("lock", 36)}<b>النظام قيد التجهيز</b><span>سيُفعَّل قريبًا.</span></div>`;
      return;
    }
    // دخول عبر رابط البريد (إذا وصل المستخدم رابطًا بدل الرمز)
    const hp = new URLSearchParams(location.hash.replace(/^#/, ""));
    if (hp.get("access_token") && hp.get("refresh_token")) {
      A.auth._save({ access_token: hp.get("access_token"), refresh_token: hp.get("refresh_token"), expires_in: +hp.get("expires_in") || 3600 }, A.session.get("pending-email") || "");
      A.session.del("pending-email");
      history.replaceState(null, "", location.pathname + location.search);
    } else if (hp.get("error")) {
      history.replaceState(null, "", location.pathname + location.search);
      toast("انتهت صلاحية رابط الدخول. اطلب رمزًا جديدًا.", "err");
    }
    if (!A.auth.signedIn()) {
      const pe = A.session.get("pending-email");
      if (pe) { S.email = pe; S.authStep = "code"; } else S.authStep = "email";
      renderAuth(); return;
    }
    try {
      S.me = await A.urpc("me");
    } catch (e) {
      if (e.code === "not_signed_in" || e.status === 401) { await A.auth.signOut(); S.authStep = "email"; renderAuth(); return; }
      scr.innerHTML = `<div class="empty" style="padding-top:80px">${ic("alert", 36)}<b>${esc(errMsg(e))}</b><button class="btn btn-dark btn-sm" data-a="reload">إعادة المحاولة</button></div>`;
      return;
    }
    if (!S.me.profile) { S.authStep = "profile"; renderAuth(); return; }
    await ensurePass();
    const want = new URLSearchParams(location.search).get("tab");
    if (want && tabs().some((t) => t[0] === want)) S.tab = want;
    render();
  }

  async function ensurePass() {
    const has = (S.me.passes || []).find((p) => p.event === EV);
    if (has) { S.passOk = true; return; }
    try {
      await A.urpc("join_event", { p_event: EV });
      S.passOk = true;
      S.me = await A.urpc("me");
    } catch (e) { S.passOk = false; }
  }

  /* =========================================================
     التبويبات
     ========================================================= */
  function tabs() {
    const t = [["home", "الرئيسية", "home"], ["pass", "جوازي", "award"]];
    if (isStaff() || isOrg()) t.push(["work", isStaff() && isOrg() ? "عملي" : isStaff() ? "كشكي" : "الإدارة", isStaff() ? "scan" : "chart"]);
    t.push(["events", "الفعاليات", "compass"], ["account", "حسابي", "user"]);
    return t;
  }
  function renderBar() {
    bar.hidden = false;
    bar.innerHTML = tabs().map(([k, l, i]) => `<button data-a="go-tab" data-tab="${k}" ${S.tab === k ? 'aria-current="page"' : ""}>${ic(i, 22, S.tab === k ? 2.1 : 1.8)}${l}</button>`).join("");
  }

  let refreshT;
  function render() {
    clearInterval(refreshT);
    stopScanner();
    scr.className = "screen";
    renderBar();
    window.scrollTo(0, 0);
    if (S.sub) { scr.innerHTML = SUB[S.sub.name](S.sub); afterSub(); return; }
    ({ home: renderHome, pass: renderPass, work: renderWork, events: renderEvents, account: renderAccount }[S.tab] || renderHome)();
  }
  const head = (title, back = true, extra = "") => `<div class="phead">${back ? `<button class="iconbtn" data-a="back" aria-label="رجوع">${ic("back", 24, 2)}</button>` : ""}<h2>${esc(title)}</h2>${extra}</div>`;

  /* ---------------- الرئيسية ---------------- */
  function renderHome() {
    const ev = evById(EV) || {};
    const c = ev.colors || { from: "#1A2E28", to: "#2E5148" };
    const others = (D.events || []).filter((e) => e.id !== EV);
    const prog = (ev.page && ev.page.program && ev.page.program.items) || [];
    const services = [];
    if (S.passOk) services.push({ t: "الجواز الرقمي", d: "بطاقة ولاء لكل كشك: اجمع الأختام واحصل على المكافآت.", i: "award", bg: "linear-gradient(135deg,#7B5BA7,#5F4486)", a: 'data-a="go-tab" data-tab="pass"', cta: "افتح جوازي" });
    if (ev.page && ev.page.packages) services.push({ t: "الباقات", d: "باقات من الأكشاك المشاركة تناسب ميزانيتك.", i: "box", bg: "linear-gradient(135deg,#E4573D,#C7432B)", a: 'data-a="sub" data-name="packages"', cta: "تصفّح الباقات" });
    prog.filter((p) => p.link && !/index\.html/.test(p.link.href)).forEach((p) => services.push({ t: p.title, d: p.desc, i: "users", bg: `linear-gradient(135deg,${p.color || "#3D8BE0"},#1E3F8F)`, href: img(p.link.href), cta: p.link.label }));
    prog.filter((p) => !p.link).forEach((p) => services.push({ t: p.title, d: p.desc, i: "food", bg: `linear-gradient(135deg,${p.color || "#A63FB0"},#5F4486)`, a: `data-a="sub" data-name="program" data-title="${esc(p.title)}"`, cta: "التفاصيل" }));

    scr.innerHTML = `
      <div class="phead"><div class="grow"><div class="sub">${greet()}</div><h2 style="font-size:21px">${esc(firstName(myName()))}</h2></div>
        <button class="avatar" data-a="go-tab" data-tab="account" aria-label="حسابي">${esc(firstName(myName()).charAt(0))}</button></div>
      <section class="hero" style="background:linear-gradient(150deg,${esc(c.from)},${esc(c.to)})">
        ${ev.image ? `<div class="bg" style="background-image:url('${esc(img(ev.image))}')"></div>` : ""}
        <div class="between">${ev.logo ? `<img class="logo" src="${esc(img(ev.logo))}" alt="">` : "<span></span>"}${S.passOk ? '<span class="st st-glass">الجواز الرقمي مفعّل</span>' : statusChip(ev.status)}</div>
        <h3>${esc((ev.name || "").split("—")[0].trim())}</h3>
        <div class="meta">${ev.date ? `<span class="row" style="gap:6px">${ic("cal", 16)}${esc(ev.date)}</span>` : ""}
          ${ev.page && ev.page.facts ? ev.page.facts.slice(1, 3).map((f) => `<span class="row" style="gap:6px">${ic(f.icon === "i-pin" ? "pin" : "clock", 16)}${esc(f.text)}</span>`).join("") : ""}</div>
        ${S.passOk ? `<button class="btn btn-soft" data-a="go-tab" data-tab="pass" style="margin-top:4px">${ic("qr", 20)} اعرض جوازي للكشك</button>`
          : `<a class="btn btn-soft" href="${esc(img(ev.url || ""))}" style="margin-top:4px">تفاصيل الفعالية</a>`}
      </section>
      <div class="sp"></div>
      ${S.passOk ? `<div class="pad"><button class="card row" data-a="go-tab" data-tab="pass" id="homePass" style="gap:14px"><span class="ico-tile" style="background:var(--purple-soft);color:var(--purple)">${ic("award", 22)}</span><span class="grow"><span class="skel" style="display:block;min-height:40px"></span></span></button></div><div class="sp"></div>` : ""}
      ${isStaff() || isOrg() ? `<div class="pad"><button class="card row" data-a="go-tab" data-tab="work" style="gap:14px;background:var(--teal-soft);box-shadow:none"><span class="ico-tile" style="background:#fff;color:var(--teal-ink)">${ic(isStaff() ? "scan" : "chart", 22)}</span><span class="grow"><b>${isStaff() ? "واجهة الكشك" : "واجهة المنظم"}</b><span class="sub" style="display:block;color:var(--ink)">${isStaff() ? "امسح جوازات الزوار وأضف الأختام" : "مؤشرات الفعالية مباشرة"}</span></span>${ic("fwd", 18, 2)}</button></div><div class="sp"></div>` : ""}
      ${services.length ? `<div class="pad"><h3 class="sec-t">خدمات الفعالية</h3></div>
      <div class="hscroll" style="padding-top:10px">${services.map((s) => `${s.href ? `<a class="svc" href="${esc(s.href)}">` : `<button class="svc" ${s.a}>`}
        <span class="art" style="background:${s.bg}">${ic(s.i, 34, 1.6)}</span>
        <span class="b"><b style="font-size:16px">${esc(s.t)}</b><span class="sub" style="line-height:1.6">${esc(s.d || "")}</span><span class="linkbtn" style="padding:0;min-height:28px;margin-top:auto">${esc(s.cta)} ←</span></span>
        ${s.href ? "</a>" : "</button>"}`).join("")}</div><div class="sp"></div>` : ""}
      ${S.passOk ? `<div class="pad between"><h3 class="sec-t">عروض الأكشاك</h3><button class="linkbtn" data-a="pass-tab" data-k="offers">الكل</button></div>
      <div class="pad stack" id="homeOffers" style="padding-top:8px"><div class="skel"></div></div><div class="sp"></div>` : ""}
      ${others.length ? `<div class="pad between"><h3 class="sec-t">استكشف فعاليات شُرفة</h3><button class="linkbtn" data-a="go-tab" data-tab="events">الكل</button></div>
      <div class="hscroll" style="padding-top:8px">${others.map((e) => eventCard(e)).join("")}</div>` : ""}
      <div class="sp"></div>`;

    if (S.passOk) {
      loadPass().then(() => {
        const p = S.pass, el = $("#homePass .grow"); if (!el || !p) return;
        const ready = (p.cards || []).filter((c) => A.cardState(c).done >= c.required).length;
        el.innerHTML = `<span class="between"><b>جوازي الرقمي</b><b class="num" style="color:var(--purple)">${p.visits} ${p.visits === 1 ? "زيارة" : "زيارات"}</b></span>
          <span class="sub" style="display:block;margin-top:4px">${p.cards.length ? `${plural(p.cards.length, "بطاقة واحدة", "بطاقتان", "بطاقات", "بطاقة")}${ready ? ` · ${ready} مكافأة بانتظارك` : ""}` : "اعرض رمزك عند أول كشك لتبدأ"}</span>`;
      });
      loadStalls().then(() => {
        const el = $("#homeOffers"); if (!el) return;
        el.innerHTML = offersHTML((S.stalls || []).slice(0, 3)) || `<div class="card flat sub" style="text-align:center">تُعلن الأكشاك المشاركة وعروضها قريبًا.</div>`;
      });
    }
  }

  const eventCard = (e, full) => `<button class="evc${full ? " full" : ""}" data-a="sub" data-name="event" data-id="${esc(e.id)}">
    <span class="img" style="background-image:url('${esc(img(e.image))}');background-color:${esc((e.colors || {}).from || "#1A2E28")};background-position:${esc(e.imagePosition || "center")}">${statusChip(e.status)}</span>
    <span class="b"><b style="font-size:15px">${esc(e.name)}</b>
      <span class="sub row" style="gap:6px">${ic("pin", 14)}${esc(e.location || "")}</span>
      <span class="sub row" style="gap:6px">${ic("cal", 14)}${esc(e.date || e.dateNote || "يُعلن قريبًا")}</span></span></button>`;

  function offersHTML(list) {
    return list.map((s) => `<div class="card row" style="gap:12px"><span class="ico-tile" style="background:var(--gold-soft);color:var(--gold-ink)">${ic(KIND_ICON[s.kind] || "star", 20)}</span>
      <span class="grow"><b>${esc(s.name)}</b><span class="sub" style="display:block">${esc(A.offerText(s))}</span></span></div>`).join("");
  }

  async function loadPass() {
    try { S.pass = await A.urpc("my_pass", { p_event: EV }); } catch (e) { if (e.code === "not_signed_in") return signedOut(); }
  }
  async function loadStalls() {
    try { S.stalls = await A.rpc("list_stalls", { p_event: EV }); } catch (e) { S.stalls = S.stalls || []; }
  }

  /* ---------------- جوازي ---------------- */
  function renderPass() {
    const ev = evById(EV) || {};
    if (!S.passOk) {
      scr.innerHTML = head("جوازي الرقمي", false) + `<div class="pad"><div class="empty card">${ic("award", 36)}<b>الجواز الرقمي غير مفعّل لهذه الفعالية بعد</b><span>سيظهر هنا عند إطلاقه.</span></div></div>`;
      return;
    }
    const tab = S.passTab;
    scr.innerHTML = `${head("جوازي الرقمي", false)}
      <section class="pp-cover">
        <div class="between"><span style="font-size:12.5px;opacity:.9">جواز شُرفة · ${esc((ev.name || "").split("—")[0].trim())}</span><span class="st st-glass">${esc(TYPE[(S.me.profile || {}).type] || "")}</span></div>
        <b style="font-size:20px;font-family:var(--head)">${esc(myName())}</b>
        <div class="qr" id="ppQr"></div>
        <div class="pp-code" id="ppCode">${esc(((S.me.passes || []).find((p) => p.event === EV) || {}).code || "")}</div>
        <p style="text-align:center;font-size:13px;opacity:.9">اعرض هذا الرمز لموظف الكشك عند كل زيارة</p>
        <div class="pp-stats"><div><b class="num" id="ppVisits">–</b><span>زيارات</span></div><div><b class="num" id="ppCards">–</b><span>بطاقات</span></div><div><b class="num" id="ppRewards">–</b><span>مكافآت</span></div></div>
      </section>
      <div class="pad" style="padding-top:14px;padding-bottom:14px"><div class="seg" role="group" aria-label="أقسام الجواز">
        ${[["cards", "بطاقاتي"], ["offers", "العروض"], ["log", "السجل"]].map(([k, l]) => `<button data-a="pass-tab" data-k="${k}" aria-pressed="${tab === k}">${l}</button>`).join("")}</div></div>
      <div class="pad stack" id="ppBody"><div class="skel"></div></div><div class="sp"></div>`;
    const code = $("#ppCode").textContent.trim();
    if (code) A.qr($("#ppQr"), "SHURFA:" + code, 190);
    const fill = () => {
      const p = S.pass; if (!p || !$("#ppBody")) return;
      $("#ppVisits").textContent = p.visits; $("#ppCards").textContent = p.cards.length; $("#ppRewards").textContent = p.rewards;
      let h = "";
      if (S.passTab === "cards") {
        h = p.cards.length ? p.cards.map((c) => { const st = A.cardState(c); return `<div class="loyalty">
            <div class="loyalty-head"><b>${esc(c.stall)}</b>${st.done > c.required || (st.done === c.required) ? '<span class="st st-warn">مكافأة بانتظارك</span>' : `<span class="st st-purple">${st.done}/${c.required}</span>`}</div>
            <div class="slots">${A.slotsHTML(c)}</div><p class="loyalty-next">${esc(st.next)}</p></div>`; }).join("")
          : `<div class="empty card">${ic("award", 36)}<b>لا توجد أختام بعد</b><span>اعرض رمزك عند أي كشك مشارك، وستظهر بطاقته هنا مباشرة.</span></div>`;
      } else if (S.passTab === "offers") {
        h = offersHTML(S.stalls || []) || `<div class="empty card">${ic("gift", 36)}<b>لم تُعلن العروض بعد</b></div>`;
      } else {
        h = p.history && p.history.length ? `<div class="card" style="padding:4px 16px">${p.history.map((x) => `<div class="li"><span class="ico-tile" style="width:38px;height:38px;${x.kind === "reward" ? "background:var(--gold-soft);color:var(--gold-ink)" : "background:var(--purple-soft);color:var(--purple)"}">${ic(x.kind === "reward" ? "gift" : "check", 18, 2)}</span>
            <div class="grow"><b style="font-size:14px">${esc(x.stall)}</b><div class="sub">${x.kind === "reward" ? "مكافأة: " + esc(x.reward) : "ختم زيارة"} · ${esc(dayTime(x.at))}</div></div></div>`).join("")}</div>`
          : `<div class="empty card">${ic("list", 36)}<b>لا يوجد نشاط بعد</b></div>`;
      }
      $("#ppBody").innerHTML = h;
    };
    Promise.all([loadPass(), S.stalls ? null : loadStalls()]).then(fill);
    refreshT = setInterval(() => { if (document.visibilityState === "visible") loadPass().then(fill); }, 15000);
  }

  /* ---------------- عملي: الكشك + المنظم ---------------- */
  let scanner = null, lastScan = { code: "", at: 0 };
  async function stopScanner() {
    try { if (scanner && scanner.isScanning) await scanner.stop(); } catch (e) { /* ignore */ }
  }

  function renderWork() {
    const W = S.work;
    if (isStaff() && isOrg()) {
      // يملك الدورين: مبدّل
    } else W.mode = isStaff() ? "stall" : "org";
    const sw = isStaff() && isOrg() ? `<div class="seg" role="group" aria-label="الواجهة" style="background:rgba(250,246,240,.12)">
      <button data-a="work-mode" data-k="stall" aria-pressed="${W.mode === "stall"}" style="color:var(--cream)">كشكي</button><button data-a="work-mode" data-k="org" aria-pressed="${W.mode === "org"}" style="color:var(--cream)">الإدارة</button></div>` : "";
    if (W.mode === "org") return renderOrg(sw);

    const stalls = S.me.stalls || [];
    if (!W.stall || !stalls.find((s) => s.id === W.stall)) W.stall = (A.local.get("work-stall") && stalls.find((s) => s.id === A.local.get("work-stall")) || stalls[0]).id;
    const s = stalls.find((x) => x.id === W.stall);
    scr.innerHTML = `<div class="ohead">${sw}
        <div class="between"><div><div style="font-size:12.5px;opacity:.85">${s.role === "manager" ? "مدير الكشك" : "موظف الكشك"} · ${esc(firstName(myName()))}</div><h2>${esc(s.name)}</h2></div><span class="row" style="gap:6px;font-size:12px"><span style="width:9px;height:9px;border-radius:5px;background:#5BD6A8;display:inline-block"></span>متصل</span></div>
        ${stalls.length > 1 ? `<select data-c="work-stall" aria-label="الكشك">${stalls.map((x) => `<option value="${esc(x.id)}" ${x.id === s.id ? "selected" : ""}>${esc(x.name)}</option>`).join("")}</select>` : ""}
        <span style="font-size:13px;opacity:.9">العرض: ${esc(A.offerText(s))}</span>
      </div>
      <div class="pad stack" style="padding-top:16px">
        <div id="reader" hidden></div>
        <button class="otile" data-a="scan-toggle" id="scanBtn"><span class="ico-tile" style="background:rgba(250,246,240,.14);color:var(--cream)">${ic("scan", 26)}</span><span class="grow"><b style="font-size:18px">امسح جواز الزائر</b><span style="display:block;font-size:12.5px;opacity:.85">بالكاميرا الخلفية</span></span></button>
        <form class="manual" data-f="manual"><input class="input" id="manualCode" maxlength="7" placeholder="أو أدخل الرمز" aria-label="رمز الجواز" autocomplete="off"><button class="btn btn-dark btn-sm" type="submit">إضافة</button></form>
        <div id="scanRes">${W.res || ""}</div>
        <h3 class="sec-t">اليوم في ${esc(s.name)}</h3>
        <div class="kpis3" id="stKpis"><div><b>–</b><span>زيارات اليوم</span></div><div><b>–</b><span>مكافآت اليوم</span></div><div><b>–</b><span>زوار الكشك</span></div></div>
        <div class="between"><h3 class="sec-t">آخر العمليات</h3><button class="linkbtn" data-a="work-refresh">تحديث</button></div>
        <div class="card" style="padding:4px 16px" id="stRecent"><div class="li sub">…</div></div>
      </div>`;
    loadStaffStats();
    refreshT = setInterval(() => { if (document.visibilityState === "visible") loadStaffStats(); }, 20000);
  }

  async function loadStaffStats() {
    try {
      const d = await A.urpc("staff_stats", { p_stall: S.work.stall });
      const k = $("#stKpis"); if (!k) return;
      k.innerHTML = `<div><b class="num">${d.today_visits}</b><span>زيارات اليوم</span></div><div><b class="num">${d.today_rewards}</b><span>مكافآت اليوم</span></div><div><b class="num">${d.visitors}</b><span>زوار الكشك</span></div>`;
      $("#stRecent").innerHTML = d.recent.length ? d.recent.map((r) => `<div class="li"><span class="ico-tile" style="width:36px;height:36px;${r.kind === "reward" ? "background:var(--gold-soft);color:var(--gold-ink)" : "background:var(--ok-soft);color:var(--ok)"}">${ic(r.kind === "reward" ? "gift" : "check", 18, 2)}</span><div class="grow"><b style="font-size:14px">${esc(r.visitor)}</b><div class="sub">${r.kind === "reward" ? "مكافأة: " + esc(r.reward) : "ختم زيارة"}</div></div><span class="sub">${esc(time(r.at))}</span></div>`).join("")
        : `<div class="li sub">لا توجد عمليات بعد.</div>`;
    } catch (e) { if (e.code === "not_signed_in") signedOut(); }
  }

  async function addVisit(raw) {
    const code = String(raw || "").trim().replace(/^SHURFA:/i, "").toUpperCase();
    if (!/^[A-Z0-9]{7}$/.test(code)) return showRes("err", "x", "رمز غير صالح", "هذا ليس رمز جواز شُرفة.");
    if (code === lastScan.code && Date.now() - lastScan.at < 4000) return;          // نفس الرمز أمام الكاميرا
    lastScan = { code, at: Date.now() };
    if (S.work.busy) return; S.work.busy = true;
    try {
      const d = await A.urpc("staff_scan", { p_stall: S.work.stall, p_code: code });
      S.work.last = code;
      if (navigator.vibrate) navigator.vibrate(d.kind === "reward" ? [80, 60, 80] : 60);
      if (d.kind === "reward") showRes("gold", "gift", "مكافأة: " + d.reward, `الزائر: <b>${esc(d.visitor)}</b> · طبّق المكافأة على الطلب`, true);
      else showRes("ok", "check", "تمت إضافة الختم", `الزائر: <b>${esc(d.visitor)}</b> · ختم ${d.position} من ${d.required}`, true);
      loadStaffStats();
    } catch (e) {
      if (e.code === "cooldown") {
        const d = e.data || {};
        showRes("warn", "clock", "تمت زيارة قبل قليل", `${esc(d.visitor || "")} — يمكن إضافة ختم جديد ${d.retry_at ? "بعد " + esc(time(d.retry_at)) : "لاحقًا"}`);
      } else showRes("err", "x", "لم تتم الإضافة", esc(errMsg(e)));
    } finally { S.work.busy = false; }
  }
  function showRes(k, icon, title, body, undo) {
    const h = `<div class="result r-${k}" role="alert"><span class="big">${ic(icon, 30, 2.4)}</span><h3>${esc(title)}</h3><span class="sub" style="color:var(--ink)">${body}</span>
      ${undo ? `<button class="linkbtn" data-a="undo" style="color:var(--err)">${ic("undo", 16)} تراجع عن هذه العملية</button>` : ""}</div>`;
    S.work.res = h;
    const el = $("#scanRes"); if (el) el.innerHTML = h;
  }

  async function toggleScan() {
    const r = $("#reader"), b = $("#scanBtn");
    if (scanner && scanner.isScanning) { await stopScanner(); r.hidden = true; b.querySelector("b").textContent = "امسح جواز الزائر"; return; }
    if (!window.Html5Qrcode) return toast("تعذّر تحميل قارئ الكاميرا — استخدم الإدخال اليدوي.", "err");
    r.hidden = false;
    try {
      scanner = new window.Html5Qrcode("reader");
      await scanner.start({ facingMode: "environment" }, { fps: 10, qrbox: { width: 230, height: 230 } }, (t) => addVisit(t), () => {});
      b.querySelector("b").textContent = "إيقاف الكاميرا";
    } catch (e) {
      r.hidden = true;
      toast("لم نتمكن من فتح الكاميرا. اسمح للمتصفح باستخدامها أو أدخل الرمز يدويًا.", "err");
    }
  }

  async function renderOrg(sw) {
    const ev = evById(EV) || {};
    scr.innerHTML = `<div class="ohead">${sw}
        <div><div style="font-size:12.5px;opacity:.85">منظم · ${esc(firstName(myName()))}</div><h2>${esc((ev.name || EV).split("—")[0].trim())}</h2></div></div>
      <div class="pad stack" style="padding-top:16px" id="orgBody"><div class="skel"></div><div class="skel"></div></div>`;
    try {
      const s = await A.urpc("admin_stats", { p_event: EV });
      const bt = s.by_type || {};
      const el = $("#orgBody"); if (!el) return;
      el.innerHTML = `<div class="kpis3"><div><b class="num">${s.visitors}</b><span>زوار مسجلون</span></div><div><b class="num">${s.visitors_today}</b><span>تسجيلات اليوم</span></div><div><b class="num">${(s.stalls || []).length}</b><span>أكشاك</span></div></div>
        <div class="kpis3"><div><b class="num">${s.stamps}</b><span>أختام</span></div><div><b class="num">${s.rewards}</b><span>مكافآت</span></div><div><b class="num">${s.teams}</b><span>فرق البطولة</span></div></div>
        <div class="card stack" style="gap:6px"><b>فئات الزوار</b>${Object.entries(TYPE).map(([k, l]) => { const n = bt[k] || 0, pct = s.visitors ? Math.round((n / s.visitors) * 100) : 0; return `<div><div class="between sub"><span>${l}</span><span class="num">${n}</span></div><div class="prog"><i style="width:${pct}%;background:var(--teal)"></i></div></div>`; }).join("")}</div>
        <h3 class="sec-t">أداء الأكشاك</h3>
        <div class="card" style="padding:4px 16px">${(s.stalls || []).length ? s.stalls.map((x) => `<div class="li"><span class="ico-tile" style="width:38px;height:38px;background:var(--gold-soft);color:var(--gold-ink)">${ic(KIND_ICON[x.kind] || "star", 18)}</span><div class="grow"><b style="font-size:14px">${esc(x.name)}</b><div class="sub">${x.visitors} زائر · ${x.visits} زيارة · ${x.rewards} مكافأة</div></div>${x.active ? "" : '<span class="st st-mute">متوقف</span>'}</div>`).join("") : '<div class="li sub">لا توجد أكشاك بعد.</div>'}</div>
        <a class="btn btn-dark" href="admin.html?e=${encodeURIComponent(EV)}">${ic("grid", 20)} لوحة التحكم الكاملة</a>
        <p class="sub" style="text-align:center">إضافة الأكشاك وموظفيها، قوائم الزوار والفرق، والتصدير — من لوحة التحكم.</p>`;
    } catch (e) {
      const el = $("#orgBody"); if (el) el.innerHTML = `<div class="msg err">${esc(errMsg(e))}</div>`;
    }
  }

  /* ---------------- الفعاليات ---------------- */
  function renderEvents() {
    const list = D.events || [];
    scr.innerHTML = `${head("فعاليات شُرفة", false)}
      <div class="pad stack"><p class="sub">الفعاليات والمهرجانات المستضافة على شُرفة. اضغط على أي فعالية لتفاصيلها وخدماتها.</p>
      ${list.map((e) => eventCard(e, true)).join("")}</div><div class="sp"></div>`;
  }

  /* ---------------- حسابي ---------------- */
  function renderAccount() {
    const p = S.me.profile || {};
    const roles = ['<span class="st st-purple">زائر</span>'];
    if (isStaff()) roles.push('<span class="st st-warn">شريك</span>');
    if (isOrg()) roles.push('<span class="st st-teal">منظم</span>');
    scr.innerHTML = `${head("حسابي", false)}
      <div class="pad"><div class="card row"><span class="avatar lg">${esc(firstName(p.name).charAt(0))}</span><div class="grow"><b style="font-size:17px">${esc(p.name)}</b>
        <div class="sub" dir="ltr" style="text-align:right">${esc(S.me.email)}</div><div class="sub" dir="ltr" style="text-align:right">${esc(p.phone)}</div></div></div>
        <div class="tags" style="margin-top:10px">${roles.join("")}<span class="st st-mute">${esc(TYPE[p.type] || "")}</span></div></div>
      <div class="sp"></div>
      <div class="pad"><div class="card" style="padding:0;overflow:hidden">
        <button class="menu-btn" data-a="go-tab" data-tab="pass">${ic("award", 20)}<span class="grow">جوازي الرقمي</span>${ic("fwd", 16, 2)}</button>
        ${isStaff() || isOrg() ? `<button class="menu-btn" data-a="go-tab" data-tab="work">${ic(isStaff() ? "scan" : "chart", 20)}<span class="grow">${isStaff() ? "واجهة الكشك" : "واجهة المنظم"}</span>${ic("fwd", 16, 2)}</button>` : ""}
        ${isOrg() ? `<a class="menu-btn" href="admin.html?e=${encodeURIComponent(EV)}">${ic("grid", 20)}<span class="grow">لوحة التحكم الكاملة</span>${ic("ext", 16, 2)}</a>` : ""}
        <button class="menu-btn" data-a="edit-profile">${ic("edit", 20)}<span class="grow">تعديل بياناتي</span>${ic("fwd", 16, 2)}</button>
        <button class="menu-btn" data-a="go-tab" data-tab="events">${ic("compass", 20)}<span class="grow">فعاليات شُرفة</span>${ic("fwd", 16, 2)}</button>
      </div></div>
      <div class="sp"></div>
      <div class="pad"><div class="card" style="padding:0;overflow:hidden">
        <a class="menu-btn" href="privacy.html">${ic("shield", 20)}<span class="grow">الخصوصية والبيانات</span>${ic("fwd", 16, 2)}</a>
        <button class="menu-btn danger" data-a="delete-data">${ic("trash", 20)}<span class="grow">حذف بياناتي وجوازاتي</span></button>
        <button class="menu-btn danger" data-a="logout">${ic("logout", 20)}<span class="grow">تسجيل الخروج</span></button>
      </div></div>
      <p class="sub" style="text-align:center;padding:18px">شُرفة · النسخة التجريبية</p>`;
  }

  /* ---------------- الشاشات الفرعية ---------------- */
  const SUB = {
    event(o) {
      const e = evById(o.id) || {};
      const svcNames = { tickets: "التذاكر", packages: "الباقات", passport: "الجواز الرقمي", safety: "سوار الأمان" };
      const svcs = (e.page && e.page.services) || [];
      const live = e.id === EV && S.passOk;
      return `${head(e.name || "")}
        <div class="pad stack">
          <div class="evc full" style="cursor:default"><span class="img" style="height:180px;background-image:url('${esc(img(e.image))}');background-color:${esc((e.colors || {}).from || "#1A2E28")};background-position:${esc(e.imagePosition || "center")}">${statusChip(e.status)}</span>
            <span class="b"><span class="sub row" style="gap:6px">${ic("pin", 14)}${esc(e.location || "")}</span><span class="sub row" style="gap:6px">${ic("cal", 14)}${esc(e.date || e.dateNote || "يُعلن قريبًا")}</span>
            <p style="font-size:14.5px;margin-top:4px">${esc(e.summary || "")}</p></span></div>
          ${svcs.length ? `<h3 class="sec-t">الخدمات في هذه الفعالية</h3><div class="tags">${svcs.map((k) => `<span class="st st-mute">${esc(svcNames[k] || k)}</span>`).join("")}</div>` : `<div class="card flat sub">نعمل مع المنظمين على إعداد خدمات الفعالية داخل شُرفة. سنعلن عنها فور إطلاقها.</div>`}
          ${live ? `<button class="btn btn-dark" data-a="go-tab" data-tab="pass">${ic("award", 20)} جوازي في هذه الفعالية</button>` : ""}
          ${e.url ? `<a class="btn btn-line" href="${esc(img(e.url))}">صفحة الفعالية ${ic("ext", 16, 2)}</a>` : ""}
        </div><div class="sp"></div>`;
    },
    packages() {
      const ev = evById(EV) || {}, pk = (ev.page && ev.page.packages) || { items: [], presets: {} };
      const item = (id) => pk.items.find((i) => i.id === id) || {};
      return `${head("الباقات")}
        <div class="pad stack"><p class="sub">باقات من الأكشاك المشاركة. اعرض الباقة عند الكشك، وتُضاف زيارتك لبطاقته في جوازك.</p>
        ${Object.values(pk.presets).filter((p) => p.items.length).map((p) => `<div class="card stack" style="gap:10px"><b style="font-size:17px">${esc(p.title)}</b><span class="sub">${esc(p.hint)}</span>
          <div>${p.items.map((id) => `<div class="li"><span class="ico-tile" style="width:36px;height:36px;color:#fff;background:${esc(item(id).art || "var(--sand-2)")}">${ic("food", 18)}</span><div class="grow"><b style="font-size:14px">${esc(item(id).name)}</b><div class="sub">${esc(item(id).note || "")}</div></div></div>`).join("")}</div></div>`).join("")}
        <div class="card flat stack" style="gap:6px;border-style:dashed"><b>${esc((pk.presets.custom || {}).title || "باقتك")}</b><span class="sub">${esc((pk.presets.custom || {}).hint || "")}</span></div>
        <p class="sub" style="text-align:center">الأسعار والمكونات النهائية تحددها الأكشاك المشاركة.</p></div><div class="sp"></div>`;
    },
    program(o) {
      const ev = evById(EV) || {}, it = ((ev.page && ev.page.program && ev.page.program.items) || []).find((x) => x.title === o.title) || {};
      return `${head(it.title || "")}<div class="pad stack"><div class="card stack" style="gap:10px"><p>${esc(it.desc || "")}</p>
        ${(it.rows || []).map((r) => `<div class="between" style="border-bottom:1px solid var(--sand-2);padding:6px 0"><span class="muted">${esc(r[0])}</span><b>${esc(r[1])}</b></div>`).join("")}
        ${it.note ? `<span class="sub">${esc(it.note)}</span>` : ""}</div></div>`;
    }
  };
  function afterSub() { /* لا شيء حاليًا */ }

  /* ---------------- الخروج ---------------- */
  async function signedOut() {
    await A.auth.signOut();
    S.me = null; S.pass = null; S.sub = null; S.tab = "home"; S.authStep = "email";
    toast(A.errText("not_signed_in"), "err");
    renderAuth();
  }

  /* =========================================================
     الأحداث
     ========================================================= */
  document.addEventListener("click", async (ev) => {
    const b = ev.target.closest("[data-a]"); if (!b) return;
    const a = b.dataset.a;
    if (a === "go-tab") { S.tab = b.dataset.tab; S.sub = null; render(); }
    else if (a === "sub") { S.sub = { name: b.dataset.name, id: b.dataset.id, title: b.dataset.title }; render(); }
    else if (a === "back") { S.sub = null; render(); }
    else if (a === "pass-tab") { S.passTab = b.dataset.k; if (S.tab !== "pass" || S.sub) { S.tab = "pass"; S.sub = null; render(); } else render(); }
    else if (a === "work-mode") { S.work.mode = b.dataset.k; render(); }
    else if (a === "work-refresh") loadStaffStats();
    else if (a === "scan-toggle") toggleScan();
    else if (a === "undo") {
      if (!S.work.last) return;
      try { await A.urpc("staff_undo", { p_stall: S.work.stall, p_code: S.work.last }); S.work.res = ""; $("#scanRes").innerHTML = ""; toast("تم التراجع عن آخر عملية", "ok"); loadStaffStats(); }
      catch (e) { toast(errMsg(e), "err"); }
    }
    else if (a === "edit-profile") { S.authStep = "profile"; renderAuth(); }
    else if (a === "logout") { await A.auth.signOut(); A.session.del("pending-email"); S.me = null; S.tab = "home"; S.sub = null; S.authStep = "email"; S.email = ""; renderAuth(); }
    else if (a === "delete-data") {
      if (!confirm("سيتم حذف بياناتك وجوازاتك وأختامها نهائيًا من شُرفة. هل أنت متأكد؟")) return;
      try { await A.urpc("delete_my_data"); await A.auth.signOut(); S.me = null; S.authStep = "email"; S.email = ""; renderAuth(); toast("حُذفت بياناتك", "ok"); }
      catch (e) { toast(errMsg(e), "err"); }
    }
    else if (a === "au-change") { S.authStep = "email"; A.session.del("pending-email"); renderAuth(); }
    else if (a === "au-resend") { try { await sendCode(S.email); toast("أرسلنا رمزًا جديدًا", "ok"); } catch (e) { authMsg(errMsg(e)); } }
    else if (a === "reload") boot();
  });

  document.addEventListener("change", (ev) => {
    const t = ev.target;
    if (t.dataset.c === "work-stall") { S.work.stall = t.value; S.work.res = ""; A.local.set("work-stall", t.value); render(); }
  });

  document.addEventListener("submit", async (ev) => {
    const f = ev.target.closest("form[data-f]"); if (!f) return;
    ev.preventDefault();
    const btn = f.querySelector("button[type=submit]");
    const k = f.dataset.f;
    if (k === "manual") { const i = $("#manualCode"); addVisit(i.value); i.value = ""; return; }
    authMsg("");
    btn.disabled = true;
    try {
      if (k === "email") {
        const email = f.email.value.trim().toLowerCase();
        if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) throw { code: "bad_email" };
        await sendCode(email);
      } else if (k === "code") {
        const code = f.code.value.replace(/\D/g, "");
        if (code.length < 6) throw { code: "bad_otp" };
        await A.auth.verify(S.email, code);
        A.session.del("pending-email");
        await boot();
      } else if (k === "profile") {
        if (!f.consent.checked) throw { code: "consent_required" };
        const phone = f.phone.value.replace(/[\s-]/g, "");
        if (f.name.value.trim().length < 2) throw { code: "bad_name" };
        if (!/^\+?[0-9]{8,15}$/.test(phone)) throw { code: "bad_phone" };
        const first = !(S.me && S.me.profile);
        await A.urpc("save_profile", { p_name: f.name.value.trim(), p_phone: phone, p_type: (f.querySelector("input[name=type]:checked") || {}).value || "visitor", p_consent: true });
        S.me = await A.urpc("me");
        if (first) { await ensurePass(); S.tab = "pass"; } else { S.tab = "account"; toast("حُفظت بياناتك", "ok"); }
        render();
      }
    } catch (e) {
      if (e && e.code === "not_signed_in") return signedOut();
      authMsg(errMsg(e));
    } finally { if (document.body.contains(btn)) btn.disabled = false; }
  });

  document.addEventListener("visibilitychange", () => { if (document.visibilityState === "hidden") stopScanner(); });

  boot();
})();
