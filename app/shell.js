/* =========================================================
   شُرفة — تطبيق المستخدم
   • التصفح متاح بدون تسجيل؛ الدخول (بالبريد/الهاتف + كلمة المرور) لشراء الجواز أو التسجيل كشريك
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
    compass: "M12 3a9 9 0 1 0 0 18a9 9 0 0 0 0-18zM15.5 8.5l-2 5-5 2 2-5z", box: "M3 7l9-4 9 4v10l-9 4-9-4zM3 7l9 4 9-4M12 11v10", eye: "M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12zM12 9a3 3 0 1 0 0 6a3 3 0 0 0 0-6z", ext: "M14 4h6v6M20 4l-9 9M18 14v6H4V6h6"
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
    me: null,               // نتيجة me() — null = زائر بدون تسجيل
    ev: null,               // event_info(EV): السعر وتعليمات الدفع
    pass: null,             // my_pass(EV)
    stalls: null,           // list_stalls(EV)
    tab: "home", sub: null, // شاشة فرعية فوق التبويب
    passTab: "cards",
    work: { stall: null, mode: "stall", res: null, last: null, busy: false },
    authOpen: false, after: null,
    authStep: "login", loginBy: "email", email: "", resendAt: 0, signup: null
  };

  /* =========================================================
     الدخول
     ========================================================= */
  function renderAuth() {
    bar.hidden = true; scr.className = "screen no-tabs";
    const ev = evById(EV), st = S.authStep;
    const T = {
      login: ["أهلًا بك في شُرفة", "سجّل دخولك لشراء جوازك الرقمي وجمع الأختام" + (ev ? " في " + esc(ev.name.split("—")[0].trim()) : "") + "."],
      signup: ["إنشاء حساب", "مرة واحدة، وتدخل بعدها بالبريد أو رقم الهاتف وكلمة المرور."],
      code: ["تأكيد البريد", "خطوة أخيرة لحماية حسابك."],
      forgot: ["استعادة كلمة المرور", "نرسل لك رابطًا لتعيين كلمة مرور جديدة."],
      reset: ["كلمة مرور جديدة", "اختر كلمة مرور جديدة لحسابك."],
      profile: [S.me && S.me.profile ? "تعديل بياناتي" : "أكمل بياناتك", "لإصدار جوازك الرقمي."]
    }[st] || ["شُرفة", ""];
    const top = `<div class="auth-top"><img src="../assets/img/brand/monogram-160.png" alt=""><h1>${T[0]}</h1><p>${T[1]}</p>${["login", "signup", "forgot", "code"].includes(st) ? `<button type="button" class="linkbtn" data-a="browse" style="color:var(--cream);align-self:flex-start;padding:0;opacity:.9">تصفّح شُرفة بدون تسجيل ←</button>` : ""}</div>`;
    const pw = (name, label, ac, hint) => `<div class="field"><label for="au-${name}">${label}</label>
      <div style="position:relative"><input class="input" id="au-${name}" name="${name}" type="password" autocomplete="${ac}" dir="ltr" minlength="8" required style="padding-left:52px">
      <button type="button" class="iconbtn" data-a="pw-toggle" aria-label="إظهار كلمة المرور" style="position:absolute;left:3px;top:3px">${ic("eye", 20)}</button></div>${hint ? `<span class="sub">${hint}</span>` : ""}</div>`;
    let body = "";
    if (st === "login") {
      const byPhone = S.loginBy === "phone";
      body = `<form class="auth-body" data-f="login" novalidate>
        <div class="seg" role="group" aria-label="طريقة الدخول"><button type="button" data-a="login-by" data-k="email" aria-pressed="${!byPhone}">البريد الإلكتروني</button><button type="button" data-a="login-by" data-k="phone" aria-pressed="${byPhone}">رقم الهاتف</button></div>
        ${byPhone ? `<div class="field"><label for="au-id">رقم الهاتف</label><input class="input" id="au-id" name="ident" inputmode="tel" autocomplete="tel" dir="ltr" style="text-align:right" placeholder="9xxxxxxx" required></div>`
          : `<div class="field"><label for="au-id">البريد الإلكتروني</label><input class="input" id="au-id" name="ident" type="email" inputmode="email" autocomplete="username" dir="ltr" placeholder="name@example.com" value="${esc(S.email)}" required></div>`}
        ${pw("password", "كلمة المرور", "current-password")}
        <button type="button" class="linkbtn" data-a="auth-go" data-k="forgot" style="align-self:flex-start;padding:0;min-height:30px">نسيت كلمة المرور؟</button>
        <div id="au-msg"></div>
        <button class="btn btn-dark" type="submit">تسجيل الدخول</button>
        <div class="row" style="justify-content:center;gap:6px"><span class="sub">ليس لديك حساب؟</span><button type="button" class="linkbtn" data-a="auth-go" data-k="signup">أنشئ حسابًا</button></div>
      </form>`;
    } else if (st === "signup") {
      const v = S.signup || {};
      body = `<form class="auth-body" data-f="signup" novalidate>
        <div class="field"><label for="su-name">الاسم</label><input class="input" id="su-name" name="name" autocomplete="name" maxlength="60" placeholder="مثال: أحمد سالم" value="${esc(v.name || "")}" required></div>
        <div class="field"><label for="su-phone">رقم الهاتف</label><input class="input" id="su-phone" name="phone" inputmode="tel" autocomplete="tel" dir="ltr" style="text-align:right" placeholder="9xxxxxxx" value="${esc(v.phone || "")}" required></div>
        <div class="field"><label for="su-email">البريد الإلكتروني</label><input class="input" id="su-email" name="email" type="email" inputmode="email" autocomplete="email" dir="ltr" placeholder="name@example.com" value="${esc(v.email || "")}" required></div>
        ${pw("password", "كلمة المرور", "new-password", "8 أحرف على الأقل.")}
        ${pw("password2", "تأكيد كلمة المرور", "new-password")}
        <div class="field"><span>أنت</span><div class="opts">${Object.entries(TYPE).map(([k, l]) => `<label class="opt"><input type="radio" name="type" value="${k}" ${(v.type || "student") === k ? "checked" : ""}>${l}</label>`).join("")}</div></div>
        <label class="check"><input type="checkbox" name="consent"> <span>أوافق على استخدام بياناتي لتشغيل حسابي وجوازي الرقمي في الفعاليات فقط. <a href="privacy.html">سياسة الخصوصية</a></span></label>
        <div id="au-msg"></div>
        <button class="btn btn-cta" type="submit">إنشاء الحساب</button>
        <div class="row" style="justify-content:center;gap:6px"><span class="sub">لديك حساب؟</span><button type="button" class="linkbtn" data-a="auth-go" data-k="login">سجّل الدخول</button></div>
      </form>`;
    } else if (st === "code") {
      const wait = Math.max(0, Math.ceil((S.resendAt - Date.now()) / 1000));
      body = `<form class="auth-body" data-f="code" novalidate>
        <div class="card flat row" style="gap:10px">${ic("mail", 20)}<span class="grow" style="font-size:14px">أرسلنا رمز التأكيد إلى <b dir="ltr">${esc(S.email)}</b></span></div>
        <div class="field"><label for="au-code">رمز التأكيد</label>
          <input class="input code" id="au-code" name="code" inputmode="numeric" autocomplete="one-time-code" maxlength="10" placeholder="••••••" required></div>
        <p class="sub">تحقق من صندوق الوارد أو الرسائل غير المرغوبة (Spam). إذا وصلك رابط بدل الرمز، اضغط عليه من هذا الجهاز.</p>
        <div id="au-msg"></div>
        <button class="btn btn-dark" type="submit">تأكيد</button>
        <button type="button" class="linkbtn" data-a="au-resend" id="au-resend" ${wait ? "disabled" : ""} style="align-self:center">${wait ? `إعادة الإرسال بعد ${wait} ث` : "أعد إرسال الرمز"}</button>
        <button type="button" class="linkbtn" data-a="auth-go" data-k="login" style="align-self:center">العودة لتسجيل الدخول</button>
      </form>`;
    } else if (st === "forgot") {
      body = `<form class="auth-body" data-f="forgot" novalidate>
        <div class="field"><label for="au-femail">البريد الإلكتروني للحساب</label><input class="input" id="au-femail" name="email" type="email" inputmode="email" autocomplete="email" dir="ltr" placeholder="name@example.com" value="${esc(S.email)}" required></div>
        <div id="au-msg"></div>
        <button class="btn btn-dark" type="submit">${ic("mail", 20)} أرسل رابط الاستعادة</button>
        <button type="button" class="linkbtn" data-a="auth-go" data-k="login" style="align-self:center">العودة لتسجيل الدخول</button>
      </form>`;
    } else if (st === "reset") {
      body = `<form class="auth-body" data-f="reset" novalidate>
        ${pw("password", "كلمة المرور الجديدة", "new-password", "8 أحرف على الأقل.")}
        ${pw("password2", "تأكيدها", "new-password")}
        <div id="au-msg"></div>
        <button class="btn btn-dark" type="submit">حفظ كلمة المرور</button>
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
    window.scrollTo(0, 0);
    const f = scr.querySelector(".auth-body input:not([type=radio]):not([type=checkbox])");
    if (f && !f.value && st !== "login") setTimeout(() => f.focus(), 50);
    if (st === "code") tickResend();
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
  const goAuth = (step) => { S.authStep = step; renderAuth(); };

  /* =========================================================
     التشغيل
     ========================================================= */
  async function boot() {
    if (!A.ready) {
      scr.innerHTML = `<div class="empty" style="padding-top:80px">${ic("lock", 36)}<b>النظام قيد التجهيز</b><span>سيُفعَّل قريبًا.</span></div>`;
      return;
    }
    // روابط البريد (تأكيد الحساب أو استعادة كلمة المرور)
    const hp = new URLSearchParams(location.hash.replace(/^#/, ""));
    let recovery = false;
    if (hp.get("access_token") && hp.get("refresh_token")) {
      A.auth._save({ access_token: hp.get("access_token"), refresh_token: hp.get("refresh_token"), expires_in: +hp.get("expires_in") || 3600 }, A.session.get("pending-email") || "");
      recovery = hp.get("type") === "recovery";
      A.session.del("pending-email");
      history.replaceState(null, "", location.pathname + location.search);
    } else if (hp.get("error")) {
      history.replaceState(null, "", location.pathname + location.search);
      toast("انتهت صلاحية الرابط. اطلب رابطًا جديدًا.", "err");
    }
    if (recovery) { S.authOpen = true; goAuth("reset"); return; }

    S.me = null;
    if (A.auth.signedIn()) {
      try { S.me = await A.urpc("me"); }
      catch (e) { if (e.code === "not_signed_in" || e.status === 401) await A.auth.signOut(); S.me = null; }
    } else if (A.session.get("pending-email")) {
      S.email = A.session.get("pending-email"); S.authOpen = true; goAuth("code"); return;
    }
    if (S.me && !S.me.profile) { S.authOpen = true; goAuth("profile"); return; }
    S.authOpen = false;

    await loadEvInfo();
    const q =new URLSearchParams(location.search);
    if (q.get("tab") && tabs().some((t) => t[0] === q.get("tab"))) S.tab = q.get("tab");
    if (q.get("join") === "partner") { history.replaceState(null, "", location.pathname + "?e=" + EV); return startIntent("partner"); }
    if (q.get("login") === "1" && !S.me) { history.replaceState(null, "", location.pathname + "?e=" + EV); return requireLogin(null); }
    if (S.after) { const a = S.after; S.after = null; return startIntent(a); }
    render();
  }

  /* نية بعد تسجيل الدخول: شراء الجواز أو التسجيل كشريك */
  function startIntent(kind) {
    if (!S.me) return requireLogin(kind);
    if (kind === "buy") { S.tab = "pass"; S.sub = myPassRef() ? null : { name: "checkout" }; }
    else if (kind === "partner") { S.tab = "account"; S.sub = { name: "partner" }; }
    render();
  }
  function requireLogin(intent) {
    S.after = intent; S.authOpen = true; S.authStep = "login"; renderAuth();
  }

  async function loadEvInfo() {
    try { S.ev = await A.rpc("event_info", { p_event: EV }); } catch (e) { S.ev = S.ev || null; }
    return S.ev;
  }
  const myPassRef = () => S.me && (S.me.passes || []).find((p) => p.event === EV);
  const price = () => (S.ev && S.ev.price_baisa) || 0;
  const fmtPrice = (b) => !b ? "مجانًا" : b % 1000 === 0 ? (b === 1000 ? "1 ريال" : `${b / 1000} ريالات`) : b < 1000 ? `${b} بيسة` : `${(b / 1000).toFixed(3)} ر.ع`;
  const canSell = () => !!(S.ev && S.ev.active);

  /* =========================================================
     التبويبات
     ========================================================= */
  const staffStalls = () => ((S.me && S.me.stalls) || []).filter((s) => s.event === EV || true);
  const approvedStalls = () => staffStalls().filter((s) => s.status === "approved" && s.active !== false);
  const isStaff = () => staffStalls().length > 0;
  const isOrg = () => !!(S.me && S.me.organizer);
  const myName = () => (S.me && S.me.profile && S.me.profile.name) || "";

  function tabs() {
    const t = [["home", "الرئيسية", "home"], ["pass", "جوازي", "award"]];
    if (isStaff() || isOrg()) t.push(["work", isStaff() && isOrg() ? "عملي" : isStaff() ? "كشكي" : "الإدارة", isStaff() ? "scan" : "chart"]);
    t.push(["events", "الفعاليات", "compass"], ["account", S.me ? "حسابي" : "دخول", "user"]);
    return t;
  }
  function renderBar() {
    bar.hidden = false;
    bar.innerHTML = tabs().map(([k, l, i]) => `<button data-a="go-tab" data-tab="${k}" ${S.tab === k ? 'aria-current="page"' : ""}>${ic(i, 22, S.tab === k ? 2.1 : 1.8)}${l}</button>`).join("");
  }

  let refreshT, railRAF;
  function render() {
    clearInterval(refreshT); cancelAnimationFrame(railRAF);
    stopScanner();
    scr.className = "screen";
    renderBar();
    window.scrollTo(0, 0);
    if (S.sub && SUB[S.sub.name]) { const h = SUB[S.sub.name](S.sub); if (typeof h === "string") scr.innerHTML = h; afterSub(S.sub); return; }
    ({ home: renderHome, pass: renderPass, work: renderWork, events: renderEvents, account: renderAccount }[S.tab] || renderHome)();
  }
  const head = (title, back = true, extra = "") => `<div class="phead">${back ? `<button class="iconbtn" data-a="back" aria-label="رجوع">${ic("back", 24, 2)}</button>` : ""}<h2>${esc(title)}</h2>${extra}</div>`;
  const loginBtn = () => `<button class="btn btn-dark btn-sm" data-a="login" style="width:auto;padding:0 16px">${ic("user", 18)} دخول</button>`;

  /* ---------------- الرئيسية ---------------- */
  function renderHome() {
    const ev = evById(EV) || {};
    const c = ev.colors || { from: "#1A2E28", to: "#2E5148" };
    const others = (D.events || []).filter((e) => e.id !== EV);
    const prog = (ev.page && ev.page.program && ev.page.program.items) || [];
    const ref = myPassRef();
    const services = [];
    services.push({ t: "الجواز الرقمي", d: `بطاقة ولاء لكل شريك: اجمع الأختام واحصل على المكافآت. ${price() ? "السعر " + fmtPrice(price()) + "." : ""}`, i: "award", bg: "linear-gradient(135deg,#7B5BA7,#5F4486)", a: 'data-a="go-tab" data-tab="pass"', cta: ref ? "افتح جوازي" : "اشترِ الجواز" });
    if (ev.page && ev.page.packages) services.push({ t: "الباقات", d: "باقات من الأكشاك المشاركة تناسب ميزانيتك.", i: "box", bg: "linear-gradient(135deg,#E4573D,#C7432B)", a: 'data-a="sub" data-name="packages"', cta: "تصفّح الباقات" });
    prog.filter((p) => p.link && !/index\.html/.test(p.link.href)).forEach((p) => services.push({ t: p.title, d: p.desc, i: "users", bg: `linear-gradient(135deg,${p.color || "#3D8BE0"},#1E3F8F)`, href: img(p.link.href), cta: p.link.label }));
    prog.filter((p) => !p.link).forEach((p) => services.push({ t: p.title, d: p.desc, i: "food", bg: `linear-gradient(135deg,${p.color || "#A63FB0"},#5F4486)`, a: `data-a="sub" data-name="program" data-title="${esc(p.title)}"`, cta: "التفاصيل" }));

    let passCard;
    if (!ref) passCard = `<button class="card row" data-a="buy" style="gap:14px;border:1.5px solid var(--purple)"><span class="ico-tile" style="background:var(--purple-soft);color:var(--purple)">${ic("award", 22)}</span>
        <span class="grow"><b>احصل على جوازك الرقمي</b><span class="sub" style="display:block">اجمع أختام الأكشاك واحصل على مكافآتها${price() ? " · " + fmtPrice(price()) : ""}</span></span>${ic("fwd", 18, 2)}</button>`;
    else if (ref.status === "pending_payment") passCard = `<button class="card row" data-a="go-tab" data-tab="pass" style="gap:14px;background:var(--warn-soft);box-shadow:none"><span class="ico-tile" style="background:#fff;color:var(--warn)">${ic("clock", 22)}</span>
        <span class="grow"><b>جوازك بانتظار الدفع</b><span class="sub" style="display:block;color:var(--ink)">ادفع ${fmtPrice(price())} لدى منصة المنظمين واعرض رمزك</span></span>${ic("fwd", 18, 2)}</button>`;
    else passCard = `<button class="card row" data-a="go-tab" data-tab="pass" id="homePass" style="gap:14px"><span class="ico-tile" style="background:var(--purple-soft);color:var(--purple)">${ic("award", 22)}</span><span class="grow"><span class="skel" style="display:block;min-height:40px"></span></span></button>`;

    scr.innerHTML = `
      <div class="phead"><div class="grow"><div class="sub">${S.me ? greet() : "أهلًا بك في شُرفة"}</div><h2 style="font-size:21px">${S.me ? esc(firstName(myName())) : "اكتشف فعاليات عُمان"}</h2></div>
        ${S.me ? `<button class="avatar" data-a="go-tab" data-tab="account" aria-label="حسابي">${esc(firstName(myName()).charAt(0))}</button>` : loginBtn()}</div>
      <section class="hero" style="background:linear-gradient(150deg,${esc(c.from)},${esc(c.to)})">
        ${ev.image ? `<div class="bg" style="background-image:url('${esc(img(ev.image))}')"></div>` : ""}
        <div class="between">${ev.logo ? `<img class="logo" src="${esc(img(ev.logo))}" alt="">` : "<span></span>"}${canSell() ? '<span class="st st-glass">الجواز الرقمي متاح</span>' : statusChip(ev.status)}</div>
        <h3>${esc((ev.name || "").split("—")[0].trim())}</h3>
        <div class="meta">${ev.date ? `<span class="row" style="gap:6px">${ic("cal", 16)}${esc(ev.date)}</span>` : ""}
          ${ev.page && ev.page.facts ? ev.page.facts.slice(1, 3).map((f) => `<span class="row" style="gap:6px">${ic(f.icon === "i-pin" ? "pin" : "clock", 16)}${esc(f.text)}</span>`).join("") : ""}</div>
        ${ref && ref.status === "active" ? `<button class="btn btn-soft" data-a="go-tab" data-tab="pass" style="margin-top:4px">${ic("qr", 20)} اعرض جوازي للكشك</button>`
          : `<button class="btn btn-soft" data-a="sub" data-name="event" data-id="${esc(EV)}" style="margin-top:4px">تفاصيل الفعالية وخدماتها</button>`}
      </section>
      <div class="sp"></div>
      ${canSell() || ref ? `<div class="pad">${passCard}</div><div class="sp"></div>` : ""}
      ${isStaff() || isOrg() ? `<div class="pad"><button class="card row" data-a="go-tab" data-tab="work" style="gap:14px;background:var(--teal-soft);box-shadow:none"><span class="ico-tile" style="background:#fff;color:var(--teal-ink)">${ic(isStaff() ? "scan" : "chart", 22)}</span><span class="grow"><b>${isStaff() ? "واجهة الكشك" : "واجهة المنظم"}</b><span class="sub" style="display:block;color:var(--ink)">${isStaff() ? "امسح جوازات الزوار وأضف الأختام" : "الجوازات والشركاء ومؤشرات الفعالية"}</span></span>${ic("fwd", 18, 2)}</button></div><div class="sp"></div>` : ""}
      <div id="railWrap"></div>
      ${services.length ? `<div class="pad"><h3 class="sec-t">خدمات الفعالية</h3></div>
      <div class="hscroll" style="padding-top:10px">${services.map((s) => `${s.href ? `<a class="svc" href="${esc(s.href)}">` : `<button class="svc" ${s.a}>`}
        <span class="art" style="background:${s.bg}">${ic(s.i, 34, 1.6)}</span>
        <span class="b"><b style="font-size:16px">${esc(s.t)}</b><span class="sub" style="line-height:1.6">${esc(s.d || "")}</span><span class="linkbtn" style="padding:0;min-height:28px;margin-top:auto">${esc(s.cta)} ←</span></span>
        ${s.href ? "</a>" : "</button>"}`).join("")}</div><div class="sp"></div>` : ""}
      ${others.length ? `<div class="pad between"><h3 class="sec-t">استكشف فعاليات شُرفة</h3><button class="linkbtn" data-a="go-tab" data-tab="events">الكل</button></div>
      <div class="hscroll" style="padding-top:8px">${others.map((e) => eventCard(e)).join("")}</div><div class="sp"></div>` : ""}
      <div class="pad"><button class="card row" data-a="partner-join" style="gap:14px;background:var(--gold-soft);box-shadow:none"><span class="ico-tile" style="background:#fff;color:var(--gold-ink)">${ic("users", 22)}</span>
        <span class="grow"><b>عندك مطعم أو كشك أو مشروع؟</b><span class="sub" style="display:block;color:var(--ink)">سجّل كشريك وصمّم بطاقة الولاء الخاصة بك</span></span>${ic("fwd", 18, 2)}</button></div>
      <div class="sp"></div>`;

    loadStalls().then(() => {
      const w = $("#railWrap"); if (!w) return;
      const list = S.stalls || [];
      w.innerHTML = list.length ? `<div class="pad between"><h3 class="sec-t">شركاء الفعالية</h3><button class="linkbtn" data-a="pass-tab" data-k="offers">العروض</button></div>${railHTML(list)}<div class="sp"></div>` : "";
      if (list.length) startRail();
    });
    if (ref && ref.status === "active") {
      loadPass().then(() => {
        const p = S.pass, el = $("#homePass .grow"); if (!el || !p || !p.ok) return;
        const ready = (p.cards || []).filter((c) => A.cardState(c).done >= c.required).length;
        el.innerHTML = `<span class="between"><b>جوازي الرقمي</b><b class="num" style="color:var(--purple)">${p.visits} ${p.visits === 1 ? "زيارة" : "زيارات"}</b></span>
          <span class="sub" style="display:block;margin-top:4px">${p.cards.length ? `${plural(p.cards.length, "بطاقة واحدة", "بطاقتان", "بطاقات", "بطاقة")}${ready ? ` · ${ready} مكافأة بانتظارك` : ""}` : "اعرض رمزك عند أول كشك لتبدأ"}</span>`;
      });
    }
  }

  /* ---------- شريط شعارات الشركاء (يتحرك تلقائيًا ويمكن سحبه) ---------- */
  const initials = (n) => String(n || "").trim().split(/\s+/).slice(0, 2).map((w) => w.charAt(0)).join("");
  const logoTile = (s, size = 64) => s.logo
    ? `<img src="${esc(s.logo)}" alt="" loading="lazy" style="width:${size}px;height:${size}px;border-radius:${size / 4}px;object-fit:cover;background:#fff">`
    : `<span style="width:${size}px;height:${size}px;border-radius:${size / 4}px;display:flex;align-items:center;justify-content:center;background:var(--gold-soft);color:var(--gold-ink);font-weight:700;font-size:${size / 3}px">${esc(initials(s.name))}</span>`;
  function railHTML(list) {
    let items = list.slice();
    while (items.length < 8) items = items.concat(list);
    const one = items.map((s) => `<button class="rail-item" data-a="sub" data-name="stall" data-id="${esc(s.id)}" aria-label="${esc(s.name)}">${logoTile(s)}<span>${esc(s.name)}</span></button>`).join("");
    return `<div class="rail" id="rail" dir="ltr"><div class="rail-track">${one}${one}</div></div>`;
  }
  function startRail() {
    const rail = $("#rail"); if (!rail) return;
    let pausedUntil = 0, dragging = false, startX = 0, startLeft = 0, moved = 0, acc = 0;
    const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const half = () => rail.firstElementChild.scrollWidth / 2;
    const step = () => {
      if (!document.body.contains(rail)) return;
      if (!reduce && !dragging && Date.now() > pausedUntil) {
        acc += 0.5; const px = Math.floor(acc); acc -= px;      // حركة هادئة
        rail.scrollLeft += px;
      }
      if (rail.scrollLeft >= half()) rail.scrollLeft -= half();
      if (rail.scrollLeft <= 0 && half() > 0) rail.scrollLeft += half();
      railRAF = requestAnimationFrame(step);
    };
    const pause = () => { pausedUntil = Date.now() + 2500; };
    rail.addEventListener("touchstart", pause, { passive: true });
    rail.addEventListener("wheel", pause, { passive: true });
    rail.addEventListener("scroll", () => { if (dragging) pause(); }, { passive: true });
    rail.addEventListener("pointerdown", (e) => { if (e.pointerType !== "mouse") { pause(); return; } dragging = true; moved = 0; startX = e.clientX; startLeft = rail.scrollLeft; rail.classList.add("drag"); });
    window.addEventListener("pointermove", (e) => { if (!dragging) return; const dx = e.clientX - startX; moved = Math.max(moved, Math.abs(dx)); rail.scrollLeft = startLeft - dx; });
    window.addEventListener("pointerup", () => { if (!dragging) return; dragging = false; pause(); rail.classList.remove("drag"); });
    rail.addEventListener("click", (e) => { if (moved > 6) { e.stopPropagation(); e.preventDefault(); moved = 0; } }, true);
    rail.scrollLeft = 1;
    railRAF = requestAnimationFrame(step);
  }

  const eventCard = (e, full) => `<button class="evc${full ? " full" : ""}" data-a="sub" data-name="event" data-id="${esc(e.id)}">
    <span class="img" style="background-image:url('${esc(img(e.image))}');background-color:${esc((e.colors || {}).from || "#1A2E28")};background-position:${esc(e.imagePosition || "center")}">${statusChip(e.status)}</span>
    <span class="b"><b style="font-size:15px">${esc(e.name)}</b>
      <span class="sub row" style="gap:6px">${ic("pin", 14)}${esc(e.location || "")}</span>
      <span class="sub row" style="gap:6px">${ic("cal", 14)}${esc(e.date || e.dateNote || "يُعلن قريبًا")}</span></span></button>`;

  function offersHTML(list) {
    return list.map((s) => `<button class="card row" data-a="sub" data-name="stall" data-id="${esc(s.id)}" style="gap:12px">${logoTile(s, 44)}
      <span class="grow"><b>${esc(s.name)}</b><span class="sub" style="display:block">${esc(A.offerText(s))}</span></span>${ic("fwd", 16, 2)}</button>`).join("");
  }

  async function loadPass() {
    try { S.pass = await A.urpc("my_pass", { p_event: EV }); }
    catch (e) { if (e.code === "not_signed_in") return signedOut(); S.pass = null; }
    // تحديث حالة الجواز في الذاكرة (بعد تفعيله من المنظم)
    const ref = myPassRef(); if (ref && S.pass && S.pass.status) ref.status = S.pass.status;
  }
  async function loadStalls() {
    try { S.stalls = await A.rpc("list_stalls", { p_event: EV }); } catch (e) { S.stalls = S.stalls || []; }
  }

  /* ---------------- جوازي ---------------- */
  function renderPass() {
    const ev = evById(EV) || {};
    const evName = esc((ev.name || "").split("—")[0].trim());
    const ref = myPassRef();
    const benefits = `<div class="card stack" style="gap:10px">
        ${[["award", "بطاقة ولاء لكل شريك", "كل زيارة لكشك = ختم في بطاقته"], ["gift", "مكافآت حقيقية", "خصومات ووجبات مجانية يحددها كل شريك"], ["qr", "رمز واحد لكل الأكشاك", "اعرضه عند كل زيارة"]]
          .map(([i, t, d]) => `<div class="row" style="gap:12px"><span class="ico-tile" style="background:var(--purple-soft);color:var(--purple);width:38px;height:38px">${ic(i, 18)}</span><div><b style="font-size:14px">${t}</b><div class="sub">${d}</div></div></div>`).join("")}</div>`;

    if (!S.me || !ref) {
      scr.innerHTML = `${head("جوازي الرقمي", false)}
        <section class="pp-cover"><span style="font-size:12.5px;opacity:.9">جواز شُرفة · ${evName}</span>
          <b style="font-size:24px;font-family:var(--head)">جوازك الرقمي للفعالية</b>
          <p style="opacity:.92;font-size:14px">اجمع أختام الأكشاك المشاركة، وكل بطاقة تكتمل تفتح لك مكافأة.</p>
          <div class="between" style="background:rgba(255,255,255,.14);border-radius:14px;padding:12px 14px"><span>سعر الجواز</span><b style="font-size:22px">${fmtPrice(price())}</b></div></section>
        <div class="sp"></div><div class="pad stack">${benefits}
          ${canSell() ? `<button class="btn btn-cta" data-a="buy">${S.me ? `اشترِ الجواز · ${fmtPrice(price())}` : "سجّل دخولك لشراء الجواز"}</button>`
            : `<div class="card flat sub" style="text-align:center">بيع الجواز لهذه الفعالية غير متاح حاليًا.</div>`}
          ${S.me ? "" : `<p class="sub" style="text-align:center">ليس لديك حساب؟ <button class="linkbtn" data-a="signup" style="padding:0;min-height:auto">أنشئ حسابًا</button></p>`}
        </div><div class="sp"></div>`;
      return;
    }

    const pending = ref.status === "pending_payment";
    const tab = S.passTab;
    scr.innerHTML = `${head("جوازي الرقمي", false)}
      <section class="pp-cover">
        <div class="between"><span style="font-size:12.5px;opacity:.9">جواز شُرفة · ${evName}</span>${pending ? '<span class="st" style="background:var(--gold);color:var(--ink)">بانتظار الدفع</span>' : `<span class="st st-glass">${esc(TYPE[(S.me.profile || {}).type] || "")}</span>`}</div>
        <b style="font-size:20px;font-family:var(--head)">${esc(myName())}</b>
        <div class="qr" id="ppQr"></div>
        <div class="pp-code">${esc(ref.code)}</div>
        <p style="text-align:center;font-size:13px;opacity:.9">${pending ? "اعرض هذا الرمز في منصة المنظمين عند الدفع" : "اعرض هذا الرمز لموظف الكشك عند كل زيارة"}</p>
        ${pending ? "" : `<div class="pp-stats"><div><b class="num" id="ppVisits">–</b><span>زيارات</span></div><div><b class="num" id="ppCards">–</b><span>بطاقات</span></div><div><b class="num" id="ppRewards">–</b><span>مكافآت</span></div></div>`}
      </section>
      ${pending ? `<div class="sp"></div><div class="pad stack">
          <div class="card stack" style="gap:10px;border:1.5px solid var(--gold)">
            <div class="between"><b>إتمام الدفع</b><b class="num" style="font-size:20px">${fmtPrice(price())}</b></div>
            <div class="row" style="gap:10px;align-items:flex-start"><span class="ico-tile" style="width:36px;height:36px;background:var(--gold-soft);color:var(--gold-ink)">1</span><span class="grow" style="font-size:14px">توجّه إلى منصة المنظمين في الفعالية.</span></div>
            <div class="row" style="gap:10px;align-items:flex-start"><span class="ico-tile" style="width:36px;height:36px;background:var(--gold-soft);color:var(--gold-ink)">2</span><span class="grow" style="font-size:14px">ادفع ${fmtPrice(price())} نقدًا أو بالتحويل البنكي.</span></div>
            <div class="row" style="gap:10px;align-items:flex-start"><span class="ico-tile" style="width:36px;height:36px;background:var(--gold-soft);color:var(--gold-ink)">3</span><span class="grow" style="font-size:14px">يمسح المنظم رمزك، فيتفعّل جوازك هنا تلقائيًا.</span></div>
            ${S.ev && S.ev.pay_note ? `<p class="sub">${esc(S.ev.pay_note)}</p>` : ""}
          </div>
          <div class="card flat row" style="gap:10px">${ic("lock", 20)}<span class="grow sub">الدفع الإلكتروني (Apple Pay والبطاقة البنكية) يُتاح قريبًا عبر بوابة دفع آمنة.</span></div>
        </div><div class="sp"></div>`
      : `<div class="pad" style="padding-top:14px;padding-bottom:14px"><div class="seg" role="group" aria-label="أقسام الجواز">
        ${[["cards", "بطاقاتي"], ["offers", "العروض"], ["log", "السجل"]].map(([k, l]) => `<button data-a="pass-tab" data-k="${k}" aria-pressed="${tab === k}">${l}</button>`).join("")}</div></div>
      <div class="pad stack" id="ppBody"><div class="skel"></div></div><div class="sp"></div>`}`;
    A.qr($("#ppQr"), "SHURFA:" + ref.code, 190);

    if (pending) {
      refreshT = setInterval(async () => {
        if (document.visibilityState !== "visible") return;
        await loadPass();
        if (S.pass && S.pass.status === "active") { toast("تم تفعيل جوازك! 🎉", "ok"); render(); }
      }, 8000);
      return;
    }
    const fill = () => {
      const p = S.pass; if (!p || !p.ok || !$("#ppBody")) return;
      $("#ppVisits").textContent = p.visits; $("#ppCards").textContent = p.cards.length; $("#ppRewards").textContent = p.rewards;
      let h = "";
      if (S.passTab === "cards") {
        h = p.cards.length ? p.cards.map((c) => { const st = A.cardState(c); return `<div class="loyalty">
            <div class="loyalty-head"><span class="row" style="gap:10px">${logoTile({ name: c.stall, logo: c.logo }, 36)}<b>${esc(c.stall)}</b></span>${st.done >= c.required ? '<span class="st st-warn">مكافأة بانتظارك</span>' : `<span class="st st-purple">${st.done}/${c.required}</span>`}</div>
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

  /* ---------------- الماسح (مشترك: الكشك والمنظم) ---------------- */
  let scanner = null, lastScan = { code: "", at: 0 }, onScan = null;
  async function stopScanner() {
    try { if (scanner && scanner.isScanning) await scanner.stop(); } catch (e) { /* ignore */ }
  }
  async function toggleScan() {
    const r = $("#reader"), b = $("#scanBtn");
    if (scanner && scanner.isScanning) { await stopScanner(); r.hidden = true; b.querySelector("b").textContent = b.dataset.label; return; }
    if (!window.Html5Qrcode) return toast("تعذّر تحميل قارئ الكاميرا — أدخل الرمز يدويًا.", "err");
    r.hidden = false;
    try {
      scanner = new window.Html5Qrcode("reader");
      await scanner.start({ facingMode: "environment" }, { fps: 10, qrbox: { width: 230, height: 230 } }, (t) => scanned(t), () => {});
      b.querySelector("b").textContent = "إيقاف الكاميرا";
    } catch (e) {
      r.hidden = true;
      toast("لم نتمكن من فتح الكاميرا. اسمح للمتصفح باستخدامها أو أدخل الرمز يدويًا.", "err");
    }
  }
  function scanned(raw) {
    const code = String(raw || "").trim().replace(/^SHURFA:/i, "").toUpperCase();
    if (!/^[A-Z0-9]{7}$/.test(code)) return showRes("err", "x", "رمز غير صالح", "هذا ليس رمز جواز شُرفة.");
    if (code === lastScan.code && Date.now() - lastScan.at < 4000) return;
    lastScan = { code, at: Date.now() };
    if (onScan) onScan(code);
  }
  const scanUI = (label, sub) => `<div id="reader" hidden></div>
    <button class="otile" data-a="scan-toggle" id="scanBtn" data-label="${esc(label)}"><span class="ico-tile" style="background:rgba(250,246,240,.14);color:var(--cream)">${ic("scan", 26)}</span><span class="grow"><b style="font-size:18px">${esc(label)}</b><span style="display:block;font-size:12.5px;opacity:.85">${esc(sub)}</span></span></button>
    <form class="manual" data-f="manual"><input class="input" id="manualCode" maxlength="7" placeholder="أو أدخل الرمز" aria-label="رمز الجواز" autocomplete="off"><button class="btn btn-dark btn-sm" type="submit">تحقق</button></form>
    <div id="scanRes"></div>`;
  function showRes(k, icon, title, body, extra = "") {
    const h = `<div class="result r-${k}" role="alert"><span class="big">${ic(icon, 30, 2.4)}</span><h3>${esc(title)}</h3><span class="sub" style="color:var(--ink)">${body}</span>${extra}</div>`;
    const el = $("#scanRes"); if (el) el.innerHTML = h;
    return h;
  }

  /* ---------------- عملي: الكشك + المنظم ---------------- */
  function renderWork() {
    const W = S.work;
    if (!(isStaff() && isOrg())) W.mode = isStaff() ? "stall" : "org";
    const sw = isStaff() && isOrg() ? `<div class="seg" role="group" aria-label="الواجهة" style="background:rgba(250,246,240,.12)">
      <button data-a="work-mode" data-k="stall" aria-pressed="${W.mode === "stall"}" style="color:var(--cream)">كشكي</button><button data-a="work-mode" data-k="org" aria-pressed="${W.mode === "org"}" style="color:var(--cream)">الإدارة</button></div>` : "";
    if (W.mode === "org") return renderOrg(sw);

    const ok = approvedStalls();
    if (!ok.length) {
      const st = staffStalls()[0] || {};
      const rejected = st.status === "rejected";
      scr.innerHTML = `<div class="ohead">${sw}<div><div style="font-size:12.5px;opacity:.85">واجهة الشريك</div><h2>${esc(st.name || "كشكي")}</h2></div></div>
        <div class="pad stack" style="padding-top:16px">
          <div class="result ${rejected ? "r-err" : "r-warn"}"><span class="big">${ic(rejected ? "x" : "clock", 30, 2.4)}</span><h3>${rejected ? "لم يُعتمد الطلب" : "طلبك قيد المراجعة"}</h3>
            <span class="sub" style="color:var(--ink)">${rejected ? "راجع ملاحظة المنظم وعدّل بياناتك ثم أعد الإرسال." : "سيراجع منظمو الفعالية بياناتك وبطاقة الولاء. بعد الاعتماد تظهر هنا أداة مسح جوازات الزوار."}</span></div>
          <button class="btn btn-line" data-a="sub" data-name="partner">${ic("edit", 18)} بياناتي وبطاقة الولاء</button>
        </div>`;
      return;
    }
    if (!W.stall || !ok.find((s) => s.id === W.stall)) W.stall = ((A.local.get("work-stall") && ok.find((s) => s.id === A.local.get("work-stall"))) || ok[0]).id;
    const s = ok.find((x) => x.id === W.stall);
    onScan = addVisit;
    scr.innerHTML = `<div class="ohead">${sw}
        <div class="between"><div><div style="font-size:12.5px;opacity:.85">${s.role === "manager" ? "مدير الكشك" : "موظف الكشك"} · ${esc(firstName(myName()))}</div><h2>${esc(s.name)}</h2></div><span class="row" style="gap:6px;font-size:12px"><span style="width:9px;height:9px;border-radius:5px;background:#5BD6A8;display:inline-block"></span>متصل</span></div>
        ${ok.length > 1 ? `<select data-c="work-stall" aria-label="الكشك">${ok.map((x) => `<option value="${esc(x.id)}" ${x.id === s.id ? "selected" : ""}>${esc(x.name)}</option>`).join("")}</select>` : ""}
        <span style="font-size:13px;opacity:.9">بطاقة الولاء: ${esc(A.offerText(s))}</span>
      </div>
      <div class="pad stack" style="padding-top:16px">
        ${scanUI("امسح جواز الزائر", "بالكاميرا الخلفية")}
        <h3 class="sec-t">اليوم في ${esc(s.name)}</h3>
        <div class="kpis3" id="stKpis"><div><b>–</b><span>زيارات اليوم</span></div><div><b>–</b><span>مكافآت اليوم</span></div><div><b>–</b><span>زوار الكشك</span></div></div>
        <div class="between"><h3 class="sec-t">آخر العمليات</h3><button class="linkbtn" data-a="work-refresh">تحديث</button></div>
        <div class="card" style="padding:4px 16px" id="stRecent"><div class="li sub">…</div></div>
        ${s.role === "manager" ? `<button class="btn btn-line" data-a="sub" data-name="partner">${ic("edit", 18)} بيانات الشريك وبطاقة الولاء</button>` : ""}
      </div>`;
    if (W.res) $("#scanRes").innerHTML = W.res;
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

  async function addVisit(code) {
    if (S.work.busy) return; S.work.busy = true;
    try {
      const d = await A.urpc("staff_scan", { p_stall: S.work.stall, p_code: code });
      S.work.last = code;
      try { if (navigator.vibrate) navigator.vibrate(d.kind === "reward" ? [80, 60, 80] : 60); } catch (e) { /* ignore */ }
      const undo = `<button class="linkbtn" data-a="undo" style="color:var(--err)">${ic("undo", 16)} تراجع عن هذه العملية</button>`;
      S.work.res = d.kind === "reward"
        ? showRes("gold", "gift", "مكافأة: " + d.reward, `الزائر: <b>${esc(d.visitor)}</b> · طبّق المكافأة على الطلب`, undo)
        : showRes("ok", "check", "تمت إضافة الختم", `الزائر: <b>${esc(d.visitor)}</b> · ختم ${d.position} من ${d.required}`, undo);
      loadStaffStats();
    } catch (e) {
      const d = e.data || {};
      if (e.code === "cooldown") S.work.res = showRes("warn", "clock", "تمت زيارة قبل قليل", `${esc(d.visitor || "")} — يمكن إضافة ختم جديد ${d.retry_at ? "بعد " + esc(time(d.retry_at)) : "لاحقًا"}`);
      else if (e.code === "pass_not_paid") S.work.res = showRes("warn", "lock", "الجواز غير مفعّل", `${esc(d.visitor || "الزائر")} لم يُكمل الدفع بعد. وجّهه إلى منصة المنظمين.`);
      else S.work.res = showRes("err", "x", "لم تتم الإضافة", esc(errMsg(e)));
    } finally { S.work.busy = false; }
  }

  /* ---------- المنظم ---------- */
  async function renderOrg(sw) {
    const ev = evById(EV) || {};
    onScan = orgLookup;
    scr.innerHTML = `<div class="ohead">${sw}
        <div><div style="font-size:12.5px;opacity:.85">منظم · ${esc(firstName(myName()))}</div><h2>${esc((ev.name || EV).split("—")[0].trim())}</h2></div></div>
      <div class="pad stack" style="padding-top:16px">
        <h3 class="sec-t">تفعيل جواز بعد الدفع</h3>
        ${scanUI("امسح جواز الزائر", "لتأكيد الدفع وتفعيل الجواز")}
        <div id="orgBody" class="stack"><div class="skel"></div><div class="skel"></div></div>
      </div>`;
    loadOrg();
  }
  async function loadOrg() {
    try {
      const [s, apps] = await Promise.all([A.urpc("admin_stats", { p_event: EV }), A.urpc("admin_list_applications", { p_event: EV })]);
      const el = $("#orgBody"); if (!el) return;
      const pend = apps.filter((a) => a.status === "pending");
      el.innerHTML = `<div class="kpis3"><div><b class="num">${s.paid}</b><span>جوازات مفعّلة</span></div><div><b class="num">${s.pending_payment}</b><span>بانتظار الدفع</span></div><div><b class="num" style="font-size:18px">${s.revenue_baisa ? fmtPrice(s.revenue_baisa) : "0"}</b><span>المبيعات</span></div></div>
        <div class="kpis3"><div><b class="num">${s.visitors_today}</b><span>طلبات اليوم</span></div><div><b class="num">${s.stamps}</b><span>أختام</span></div><div><b class="num">${s.rewards}</b><span>مكافآت</span></div></div>
        <div class="between"><h3 class="sec-t">طلبات الشركاء ${pend.length ? `<span class="st st-warn">${pend.length} جديد</span>` : ""}</h3><button class="linkbtn" data-a="org-refresh">تحديث</button></div>
        ${apps.length ? apps.map(appCard).join("") : `<div class="card flat sub" style="text-align:center">لا توجد طلبات شركاء بعد. شارك رابط التسجيل: <b dir="ltr">${esc(location.origin + location.pathname)}?join=partner</b></div>`}
        <h3 class="sec-t">أداء الأكشاك المعتمدة</h3>
        <div class="card" style="padding:4px 16px">${(s.stalls || []).length ? s.stalls.map((x) => `<div class="li"><span class="ico-tile" style="width:38px;height:38px;background:var(--gold-soft);color:var(--gold-ink)">${ic(KIND_ICON[x.kind] || "star", 18)}</span><div class="grow"><b style="font-size:14px">${esc(x.name)}</b><div class="sub">${x.visitors} زائر · ${x.visits} زيارة · ${x.rewards} مكافأة</div></div>${x.active ? "" : '<span class="st st-mute">متوقف</span>'}</div>`).join("") : '<div class="li sub">لا توجد أكشاك معتمدة بعد.</div>'}</div>
        <a class="btn btn-dark" href="admin.html?e=${encodeURIComponent(EV)}">${ic("grid", 20)} لوحة التحكم الكاملة</a>`;
    } catch (e) {
      const el = $("#orgBody"); if (el) el.innerHTML = `<div class="msg err">${esc(errMsg(e))}</div>`;
    }
  }
  const STATUS_AR = { pending: ["قيد المراجعة", "st-warn"], approved: ["معتمد", "st-ok"], rejected: ["مرفوض", "st-err"] };
  const appCard = (a) => `<div class="card stack" style="gap:10px">
      <div class="row" style="gap:12px">${logoTile(a, 52)}<div class="grow"><b>${esc(a.name)}</b><div class="sub">${esc(A.KIND[a.kind] || a.kind)} · <span dir="ltr">${esc(a.owner_email || "")}</span></div></div><span class="st ${STATUS_AR[a.status][1]}">${STATUS_AR[a.status][0]}</span></div>
      ${a.description ? `<p style="font-size:14px">${esc(a.description)}</p>` : ""}
      <div class="card flat" style="padding:10px 12px"><span class="sub">بطاقة الولاء</span><div><b>${esc(A.offerText(a))}</b></div><span class="sub">فاصل بين ختمين: ${a.cooldown} دقيقة</span></div>
      ${a.phone || a.instagram ? `<span class="sub">${a.phone ? `<span dir="ltr">${esc(a.phone)}</span>` : ""}${a.instagram ? ` · <span dir="ltr">@${esc(a.instagram)}</span>` : ""}</span>` : ""}
      ${a.note ? `<span class="sub">ملاحظة: ${esc(a.note)}</span>` : ""}
      ${a.status === "pending" ? `<div class="row" style="gap:8px"><button class="btn btn-dark btn-sm" style="flex:1" data-a="review" data-id="${esc(a.stall)}" data-ok="1">${ic("check", 18, 2)} اعتماد</button><button class="btn btn-danger btn-sm" style="flex:1" data-a="review" data-id="${esc(a.stall)}" data-ok="0">رفض</button></div>`
        : a.status === "approved" ? `<button class="linkbtn" data-a="review" data-id="${esc(a.stall)}" data-ok="0" style="color:var(--err);align-self:flex-start">إيقاف الشريك</button>` : `<button class="linkbtn" data-a="review" data-id="${esc(a.stall)}" data-ok="1" style="align-self:flex-start">اعتماد</button>`}
    </div>`;

  async function orgLookup(code) {
    try {
      const d = await A.urpc("admin_pass_lookup", { p_event: EV, p_code: code });
      if (d.status === "active") return showRes("ok", "check", "الجواز مفعّل", `<b>${esc(d.name)}</b> · ${esc(TYPE[d.type] || "")} · ${d.pay_method === "free" ? "مجاني" : "مدفوع"} ${d.paid_at ? esc(dayTime(d.paid_at)) : ""}`);
      showRes("warn", "lock", "بانتظار الدفع", `<b>${esc(d.name)}</b> · ${esc(TYPE[d.type] || "")} · المبلغ ${fmtPrice(d.amount_baisa || price())}`,
        `<div class="row" style="gap:8px;width:100%;margin-top:6px"><button class="btn btn-dark btn-sm" style="flex:1" data-a="activate" data-code="${esc(d.code)}" data-m="cash">استلمت نقدًا</button><button class="btn btn-line btn-sm" style="flex:1" data-a="activate" data-code="${esc(d.code)}" data-m="transfer">تحويل بنكي</button></div>`);
    } catch (e) { showRes("err", "x", "لم يُعثر على الجواز", esc(errMsg(e))); }
  }

  /* ---------------- الفعاليات ---------------- */
  function renderEvents() {
    const list = D.events || [];
    scr.innerHTML = `${head("فعاليات شُرفة", false, S.me ? "" : loginBtn())}
      <div class="pad stack"><p class="sub">الفعاليات والمهرجانات المستضافة على شُرفة. اضغط على أي فعالية لتفاصيلها وخدماتها.</p>
      ${list.map((e) => eventCard(e, true)).join("")}</div><div class="sp"></div>`;
  }

  /* ---------------- حسابي ---------------- */
  function renderAccount() {
    if (!S.me) {
      scr.innerHTML = `${head("حسابي", false)}
        <div class="pad stack">
          <div class="card stack" style="align-items:center;text-align:center;gap:10px;padding:26px 18px"><span class="avatar lg">${ic("user", 26)}</span>
            <b style="font-size:18px">سجّل دخولك إلى شُرفة</b><span class="sub">لشراء الجواز الرقمي وجمع الأختام، أو للتسجيل كشريك.</span>
            <button class="btn btn-dark" data-a="login">تسجيل الدخول</button><button class="btn btn-line" data-a="signup">إنشاء حساب</button></div>
          <div class="card" style="padding:0;overflow:hidden">
            <button class="menu-btn" data-a="partner-join">${ic("users", 20)}<span class="grow">انضم كشريك</span>${ic("fwd", 16, 2)}</button>
            <button class="menu-btn" data-a="go-tab" data-tab="events">${ic("compass", 20)}<span class="grow">فعاليات شُرفة</span>${ic("fwd", 16, 2)}</button>
            <a class="menu-btn" href="privacy.html">${ic("shield", 20)}<span class="grow">الخصوصية والبيانات</span>${ic("fwd", 16, 2)}</a>
            <a class="menu-btn" href="../index.html">${ic("home", 20)}<span class="grow">موقع شُرفة</span>${ic("ext", 16, 2)}</a>
          </div></div><div class="sp"></div>`;
      return;
    }
    const p = S.me.profile || {};
    const roles = ['<span class="st st-purple">زائر</span>'];
    if (S.me.partner || isStaff()) roles.push('<span class="st st-warn">شريك</span>');
    if (isOrg()) roles.push('<span class="st st-teal">منظم</span>');
    scr.innerHTML = `${head("حسابي", false)}
      <div class="pad"><div class="card row"><span class="avatar lg">${esc(firstName(p.name).charAt(0))}</span><div class="grow"><b style="font-size:17px">${esc(p.name)}</b>
        <div class="sub" dir="ltr" style="text-align:right">${esc(S.me.email)}</div><div class="sub" dir="ltr" style="text-align:right">${esc(p.phone)}</div></div></div>
        <div class="tags" style="margin-top:10px">${roles.join("")}<span class="st st-mute">${esc(TYPE[p.type] || "")}</span></div></div>
      <div class="sp"></div>
      <div class="pad"><div class="card" style="padding:0;overflow:hidden">
        <button class="menu-btn" data-a="go-tab" data-tab="pass">${ic("award", 20)}<span class="grow">جوازي الرقمي</span>${ic("fwd", 16, 2)}</button>
        <button class="menu-btn" data-a="sub" data-name="partner">${ic("users", 20)}<span class="grow">${S.me.partner ? "بيانات الشريك وبطاقة الولاء" : "انضم كشريك"}</span>${ic("fwd", 16, 2)}</button>
        ${isStaff() || isOrg() ? `<button class="menu-btn" data-a="go-tab" data-tab="work">${ic(isStaff() ? "scan" : "chart", 20)}<span class="grow">${isStaff() ? "واجهة الكشك" : "واجهة المنظم"}</span>${ic("fwd", 16, 2)}</button>` : ""}
        ${isOrg() ? `<a class="menu-btn" href="admin.html?e=${encodeURIComponent(EV)}">${ic("grid", 20)}<span class="grow">لوحة التحكم الكاملة</span>${ic("ext", 16, 2)}</a>` : ""}
        <button class="menu-btn" data-a="edit-profile">${ic("edit", 20)}<span class="grow">تعديل بياناتي</span>${ic("fwd", 16, 2)}</button>
      </div></div>
      <div class="sp"></div>
      <div class="pad"><div class="card" style="padding:0;overflow:hidden">
        <a class="menu-btn" href="privacy.html">${ic("shield", 20)}<span class="grow">الخصوصية والبيانات</span>${ic("fwd", 16, 2)}</a>
        <a class="menu-btn" href="../index.html">${ic("home", 20)}<span class="grow">موقع شُرفة</span>${ic("ext", 16, 2)}</a>
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
      const isCur = e.id === EV;
      const ref = isCur && myPassRef();
      return `${head(e.name || "", true, S.me ? "" : loginBtn())}
        <div class="pad stack">
          <div class="evc full" style="cursor:default"><span class="img" style="height:180px;background-image:url('${esc(img(e.image))}');background-color:${esc((e.colors || {}).from || "#1A2E28")};background-position:${esc(e.imagePosition || "center")}">${statusChip(e.status)}</span>
            <span class="b"><span class="sub row" style="gap:6px">${ic("pin", 14)}${esc(e.location || "")}</span><span class="sub row" style="gap:6px">${ic("cal", 14)}${esc(e.date || e.dateNote || "يُعلن قريبًا")}</span>
            <p style="font-size:14.5px;margin-top:4px">${esc(e.summary || "")}</p></span></div>
          ${svcs.length ? `<h3 class="sec-t">الخدمات في هذه الفعالية</h3><div class="tags">${svcs.map((k) => `<span class="st st-mute">${esc(svcNames[k] || k)}</span>`).join("")}</div>` : `<div class="card flat sub">نعمل مع المنظمين على إعداد خدمات الفعالية داخل شُرفة. سنعلن عنها فور إطلاقها.</div>`}
          ${isCur && canSell() ? (ref ? `<button class="btn btn-dark" data-a="go-tab" data-tab="pass">${ic("award", 20)} جوازي في هذه الفعالية</button>`
            : `<button class="btn btn-cta" data-a="buy">${ic("award", 20)} اشترِ الجواز الرقمي · ${fmtPrice(price())}</button>`) : ""}
          ${isCur ? `<button class="btn btn-line" data-a="partner-join">${ic("users", 18)} سجّل كشريك في هذه الفعالية</button>` : ""}
          ${e.url ? `<a class="btn btn-soft" href="${esc(img(e.url))}">صفحة الفعالية ${ic("ext", 16, 2)}</a>` : ""}
        </div><div class="sp"></div>`;
    },
    stall(o) {
      const s = (S.stalls || []).find((x) => x.id === o.id);
      if (!s) return `${head("الشريك")}<div class="pad"><div class="empty card">غير متاح</div></div>`;
      const cyc = s.required + (s.reward2 ? 2 : 1);
      let slots = ""; for (let i = 1; i <= cyc; i++) slots += i <= s.required ? `<span class="slot">${i}</span>` : `<span class="slot reward">${esc(i === s.required + 1 ? s.reward1 : s.reward2)}</span>`;
      return `${head(s.name)}<div class="pad stack">
        <div class="card stack" style="align-items:center;text-align:center;gap:10px">${logoTile(s, 96)}<b style="font-size:20px">${esc(s.name)}</b><span class="st st-mute">${esc(A.KIND[s.kind] || "")}</span>
          ${s.description ? `<p style="font-size:14.5px">${esc(s.description)}</p>` : ""}
          ${s.instagram ? `<a class="linkbtn" dir="ltr" href="https://instagram.com/${esc(s.instagram)}" target="_blank" rel="noopener">@${esc(s.instagram)}</a>` : ""}</div>
        <div class="loyalty"><div class="loyalty-head"><b>بطاقة الولاء</b><span class="st st-purple">${esc(A.offerText(s))}</span></div><div class="slots">${slots}</div>
          <p class="loyalty-next">اعرض رمز جوازك عند كل زيارة لتُضاف الأختام.</p></div>
        ${myPassRef() ? "" : `<button class="btn btn-cta" data-a="buy">احصل على الجواز الرقمي${price() ? " · " + fmtPrice(price()) : ""}</button>`}
      </div><div class="sp"></div>`;
    },
    checkout() {
      const ev = evById(EV) || {};
      return `${head("شراء الجواز الرقمي")}
        <div class="pad stack">
          <div class="card stack" style="gap:8px"><b>ملخص الطلب</b>
            <div class="between"><span>الجواز الرقمي · ${esc((ev.name || "").split("—")[0].trim())}</span><b class="num">${fmtPrice(price())}</b></div>
            <span class="sub">صالح طوال أيام الفعالية · بطاقة ولاء لكل كشك مشارك</span>
            <div style="height:1px;background:var(--sand)"></div><div class="between"><b>الإجمالي</b><b class="num" style="font-size:20px">${fmtPrice(price())}</b></div></div>
          <h3 class="sec-t">طريقة الدفع</h3>
          <label class="opt" style="opacity:.55;cursor:not-allowed"><input type="radio" name="pm" disabled>${ic("phone", 20)}<span class="grow">Apple Pay</span><span class="st st-mute">قريبًا</span></label>
          <label class="opt" style="opacity:.55;cursor:not-allowed"><input type="radio" name="pm" disabled>${ic("lock", 20)}<span class="grow">بطاقة بنكية (عبر بوابة دفع آمنة)</span><span class="st st-mute">قريبًا</span></label>
          <label class="opt"><input type="radio" name="pm" value="desk" checked>${ic("users", 20)}<span class="grow">الدفع لدى منصة المنظمين<span class="sub" style="display:block;font-weight:500">نقدًا أو بالتحويل البنكي</span></span></label>
          <div class="card flat stack" style="gap:6px"><b style="font-size:14px">كيف يتم؟</b>
            <span class="sub">1) أكّد الطلب الآن فيظهر لك رمز جوازك.</span>
            <span class="sub">2) ادفع ${fmtPrice(price())} لدى منصة المنظمين في الفعالية.</span>
            <span class="sub">3) يمسح المنظم رمزك فيتفعّل جوازك فورًا، وتبدأ بجمع الأختام.</span></div>
          <p class="sub row" style="gap:6px">${ic("shield", 14)} لا نطلب ولا نحفظ بيانات بطاقتك في شُرفة. الدفع الإلكتروني سيتم عبر بوابة دفع مرخّصة.</p>
          <div id="coMsg"></div>
          <button class="btn btn-cta" data-a="confirm-buy">تأكيد الطلب · ${fmtPrice(price())}</button>
        </div><div class="sp"></div>`;
    },
    partner() {
      return `${head("الشريك وبطاقة الولاء")}<div class="pad stack" id="ptBody"><div class="skel"></div><div class="skel"></div></div>`;
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
  function afterSub(o) {
    if (o.name === "partner") loadPartnerForm();
  }

  /* ---------- نموذج الشريك + مصمم بطاقة الولاء ---------- */
  let ptLogo = null;   // رابط الشعار بعد الرفع
  async function loadPartnerForm() {
    const box = $("#ptBody"); if (!box) return;
    if (!S.me) return requireLogin("partner");
    let d = { partner: null, stalls: [] };
    try { d = await A.urpc("my_partner"); } catch (e) { box.innerHTML = `<div class="msg err">${esc(errMsg(e))}</div>`; return; }
    const p = d.partner || {}, st = (d.stalls || []).find((x) => x.event === EV) || {};
    ptLogo = p.logo || null;
    const locked = st.status === "approved";
    const ev = evById(EV) || {};
    const statusBox = st.status ? `<div class="result ${st.status === "approved" ? "r-ok" : st.status === "rejected" ? "r-err" : "r-warn"}" style="padding:14px">
        <h3 style="font-size:17px">${st.status === "approved" ? "معتمد في " : st.status === "rejected" ? "لم يُعتمد في " : "قيد المراجعة في "}${esc((ev.name || "").split("—")[0].trim())}</h3>
        ${st.note ? `<span class="sub" style="color:var(--ink)">ملاحظة المنظم: ${esc(st.note)}</span>` : ""}
        ${st.status === "approved" ? `<button class="btn btn-dark btn-sm" data-a="go-tab" data-tab="work">${ic("scan", 18)} افتح واجهة الكشك</button>` : ""}</div>` : "";
    box.innerHTML = `${statusBox}
      <form class="stack" data-f="partner" novalidate>
        <div class="card stack" style="gap:12px"><b>بيانات المشروع</b>
          <div class="row" style="gap:14px"><span id="ptLogoPrev">${logoTile({ name: p.name || "؟", logo: ptLogo }, 72)}</span>
            <label class="btn btn-soft btn-sm" style="cursor:pointer">${ic("edit", 16)} ${ptLogo ? "تغيير الشعار" : "رفع الشعار"}<input type="file" accept="image/png,image/jpeg,image/webp" data-c="pt-logo" hidden></label></div>
          <div class="field"><label for="pt-name">اسم المشروع / الكشك</label><input class="input" id="pt-name" name="name" maxlength="60" value="${esc(p.name || "")}" required></div>
          <div class="field"><label for="pt-kind">النوع</label><select class="input" id="pt-kind" name="kind">${Object.entries(A.KIND).map(([k, l]) => `<option value="${k}" ${p.kind === k ? "selected" : ""}>${l}</option>`).join("")}</select></div>
          <div class="field"><label for="pt-desc">نبذة قصيرة</label><textarea class="input" id="pt-desc" name="description" maxlength="300" rows="3" style="height:auto;padding:10px 14px">${esc(p.description || "")}</textarea></div>
          <div class="field"><label for="pt-phone">رقم التواصل</label><input class="input" id="pt-phone" name="phone" inputmode="tel" dir="ltr" style="text-align:right" value="${esc(p.phone || (S.me.profile || {}).phone || "")}"></div>
          <div class="field"><label for="pt-ig">انستقرام (اختياري)</label><input class="input" id="pt-ig" name="instagram" dir="ltr" placeholder="@shop" value="${esc(p.instagram ? "@" + p.instagram : "")}"></div>
        </div>
        <div class="card stack" style="gap:12px"><b>بطاقة الولاء</b>
          <span class="sub">هذه البطاقة تظهر في الجواز الرقمي لكل زائر، وتُضاف الأختام عليها عند كل زيارة.</span>
          ${locked ? `<div class="msg info">البطاقة معتمدة ولا يمكن تغييرها أثناء الفعالية. تواصل مع المنظم لأي تعديل.</div>` : ""}
          <div class="field"><label for="pt-req">عدد الزيارات قبل المكافأة</label><input class="input" id="pt-req" name="required" type="number" min="1" max="20" value="${esc(st.required || 3)}" ${locked ? "disabled" : ""} data-c="pt-card"></div>
          <div class="field"><label for="pt-r1">المكافأة الأولى</label><input class="input" id="pt-r1" name="reward1" maxlength="40" placeholder="مثال: خصم 30%" value="${esc(st.reward1 || "")}" ${locked ? "disabled" : ""} data-c="pt-card"></div>
          <div class="field"><label for="pt-r2">مكافأة ثانية (اختياري)</label><input class="input" id="pt-r2" name="reward2" maxlength="40" placeholder="مثال: الوجبة مجانًا" value="${esc(st.reward2 || "")}" ${locked ? "disabled" : ""} data-c="pt-card"></div>
          <div class="field"><label for="pt-cd">الفاصل بين ختمين (دقائق)</label><input class="input" id="pt-cd" name="cooldown" type="number" min="0" max="1440" value="${esc(st.cooldown ?? 30)}" ${locked ? "disabled" : ""}><span class="sub">يمنع إضافة أكثر من ختم للزائر نفسه خلال هذه المدة.</span></div>
          <div class="loyalty" style="background:var(--cream)"><div class="loyalty-head"><b>معاينة البطاقة</b><span class="st st-purple" id="ptOffer"></span></div><div class="slots" id="ptSlots"></div></div>
        </div>
        <div class="card stack" style="gap:10px"><b>المشاركة</b>
          <label class="opt"><input type="radio" name="event" value="${esc(EV)}" checked><span class="grow">${esc((ev.name || EV).split("—")[0].trim())}<span class="sub" style="display:block;font-weight:500">يراجع المنظم طلبك قبل ظهوره للزوار</span></span></label>
          <label class="opt"><input type="radio" name="event" value=""><span class="grow">شريك في شُرفة بشكل عام<span class="sub" style="display:block;font-weight:500">نحفظ بياناتك ونتواصل معك للفعاليات القادمة</span></span></label>
        </div>
        <label class="check"><input type="checkbox" name="consent" ${p.name ? "checked" : ""}> <span>أؤكد صحة البيانات، وألتزم بتقديم مكافآت بطاقة الولاء للزوار كما حددتها.</span></label>
        <div id="ptMsg"></div>
        <button class="btn btn-cta" type="submit">${st.status ? "حفظ التعديلات" : "إرسال طلب الشراكة"}</button>
      </form>`;
    previewCard();
  }
  function previewCard() {
    const f = $("form[data-f=partner]"); if (!f) return;
    const req = Math.min(20, Math.max(1, parseInt(f.required.value || "3", 10) || 3));
    const c = { required: req, reward1: f.reward1.value.trim() || "المكافأة", reward2: f.reward2.value.trim() || null, visits: 0 };
    $("#ptSlots").innerHTML = A.slotsHTML(c);
    $("#ptOffer").textContent = A.offerText(c);
  }
  async function uploadLogo(file) {
    if (!/^image\/(png|jpeg|webp)$/.test(file.type)) throw { code: "bad_logo" };
    const bmp = await new Promise((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = rej; i.src = URL.createObjectURL(file); });
    const n = 400, sc = Math.min(1, n / Math.max(bmp.width, bmp.height));
    const cv = document.createElement("canvas"); cv.width = Math.round(bmp.width * sc); cv.height = Math.round(bmp.height * sc);
    cv.getContext("2d").drawImage(bmp, 0, 0, cv.width, cv.height);
    URL.revokeObjectURL(bmp.src);
    let blob = await new Promise((r) => cv.toBlob(r, "image/webp", 0.86));
    if (!blob || blob.type !== "image/webp") blob = await new Promise((r) => cv.toBlob(r, "image/png"));
    if (blob.size > 1048576) throw { code: "bad_logo" };
    const token = await A.auth.token();
    const me = await A.call("/auth/v1/user", { method: "GET", token });
    const uid = me && me.id; if (!uid) throw { code: "upload_failed" };
    const path = `${uid}/logo-${Date.now()}.${blob.type === "image/webp" ? "webp" : "png"}`;
    const base = A.SB.url.replace(/\/$/, "");
    const r = await fetch(`${base}/storage/v1/object/logos/${path}`, {
      method: "POST", headers: { apikey: A.SB.anonKey, Authorization: "Bearer " + token, "Content-Type": blob.type, "x-upsert": "true" }, body: blob
    });
    if (!r.ok) throw { code: "upload_failed" };
    return `${base}/storage/v1/object/public/logos/${path}`;
  }

  /* ---------------- الخروج ---------------- */
  async function signedOut() {
    await A.auth.signOut();
    S.me = null; S.pass = null; S.sub = null; S.tab = "home";
    toast(A.errText("not_signed_in"), "err");
    render();
  }
  async function logout() {
    await A.auth.signOut(); A.session.del("pending-email");
    S.me = null; S.pass = null; S.tab = "home"; S.sub = null; S.email = ""; S.work = { stall: null, mode: "stall", res: null, last: null, busy: false };
    render();
  }

  /* =========================================================
     الأحداث
     ========================================================= */
  document.addEventListener("click", async (ev) => {
    const b = ev.target.closest("[data-a]"); if (!b) return;
    const a = b.dataset.a;
    if (a === "go-tab") { S.tab = b.dataset.tab; S.sub = null; S.authOpen = false; render(); }
    else if (a === "sub") { S.sub = { name: b.dataset.name, id: b.dataset.id, title: b.dataset.title }; render(); }
    else if (a === "back") { S.sub = null; render(); }
    else if (a === "login") requireLogin(null);
    else if (a === "signup") { S.after = null; S.authOpen = true; goAuth("signup"); }
    else if (a === "browse") { S.authOpen = false; S.after = null; A.session.del("pending-email"); render(); }
    else if (a === "buy") { if (!canSell()) return toast("بيع الجواز غير متاح حاليًا.", "err"); startIntent("buy"); }
    else if (a === "partner-join") startIntent("partner");
    else if (a === "confirm-buy") {
      b.disabled = true;
      try {
        const d = await A.urpc("join_event", { p_event: EV });
        S.me = await A.urpc("me");
        S.sub = null; S.tab = "pass"; render();
        toast(d.status === "active" ? "جوازك مفعّل!" : "تم إنشاء طلبك. أكمل الدفع لدى منصة المنظمين.", "ok");
      } catch (e) { const m = $("#coMsg"); if (m) m.innerHTML = `<div class="msg err">${esc(errMsg(e))}</div>`; b.disabled = false; }
    }
    else if (a === "pass-tab") { S.passTab = b.dataset.k; S.tab = "pass"; S.sub = null; render(); }
    else if (a === "work-mode") { S.work.mode = b.dataset.k; render(); }
    else if (a === "work-refresh") loadStaffStats();
    else if (a === "org-refresh") loadOrg();
    else if (a === "scan-toggle") toggleScan();
    else if (a === "undo") {
      if (!S.work.last) return;
      try { await A.urpc("staff_undo", { p_stall: S.work.stall, p_code: S.work.last }); S.work.res = ""; $("#scanRes").innerHTML = ""; toast("تم التراجع عن آخر عملية", "ok"); loadStaffStats(); }
      catch (e) { toast(errMsg(e), "err"); }
    }
    else if (a === "activate") {
      b.disabled = true;
      try { const d = await A.urpc("admin_activate_pass", { p_event: EV, p_code: b.dataset.code, p_method: b.dataset.m }); showRes("ok", "check", "تم تفعيل الجواز", `<b>${esc(d.name)}</b> · ${b.dataset.m === "cash" ? "نقدًا" : "تحويل بنكي"}`); loadOrg(); }
      catch (e) { b.disabled = false; toast(e.code === "already_active" ? "الجواز مفعّل مسبقًا." : errMsg(e), "err"); }
    }
    else if (a === "review") {
      const okv = b.dataset.ok === "1";
      let note = null;
      if (!okv) { note = prompt("سبب الرفض أو الإيقاف (يظهر للشريك):", ""); if (note === null) return; }
      try { await A.urpc("admin_review_stall", { p_stall: b.dataset.id, p_approve: okv, p_note: note }); toast(okv ? "تم اعتماد الشريك" : "تم تحديث الحالة", "ok"); loadOrg(); }
      catch (e) { toast(errMsg(e), "err"); }
    }
    else if (a === "edit-profile") { S.authOpen = true; goAuth("profile"); }
    else if (a === "logout") logout();
    else if (a === "delete-data") {
      if (!confirm("سيتم حذف بياناتك وجوازاتك وأختامها نهائيًا من شُرفة. هل أنت متأكد؟")) return;
      try { await A.urpc("delete_my_data"); await logout(); toast("حُذفت بياناتك", "ok"); }
      catch (e) { toast(errMsg(e), "err"); }
    }
    else if (a === "auth-go") { if (b.dataset.k === "login") A.session.del("pending-email"); goAuth(b.dataset.k); }
    else if (a === "login-by") { S.loginBy = b.dataset.k; goAuth("login"); }
    else if (a === "pw-toggle") { const i = b.parentElement.querySelector("input"); i.type = i.type === "password" ? "text" : "password"; }
    else if (a === "au-resend") { try { await A.auth.resendConfirm(S.email); S.resendAt = Date.now() + 60000; tickResend(); toast("أرسلنا رمزًا جديدًا", "ok"); } catch (e) { authMsg(errMsg(e)); } }
    else if (a === "reload") boot();
  });

  document.addEventListener("change", async (ev) => {
    const t = ev.target;
    if (t.dataset.c === "work-stall") { S.work.stall = t.value; S.work.res = ""; A.local.set("work-stall", t.value); render(); }
    else if (t.dataset.c === "pt-logo" && t.files && t.files[0]) {
      const m = $("#ptMsg"); m.innerHTML = `<div class="msg info">جارٍ رفع الشعار…</div>`;
      try { ptLogo = await uploadLogo(t.files[0]); $("#ptLogoPrev").innerHTML = logoTile({ name: "", logo: ptLogo }, 72); m.innerHTML = `<div class="msg ok">تم رفع الشعار.</div>`; }
      catch (e) { m.innerHTML = `<div class="msg err">${esc(A.errText(e.code === "bad_logo" ? "bad_logo" : "upload_failed"))}</div>`; }
    }
  });
  document.addEventListener("input", (ev) => { if (ev.target.dataset && ev.target.dataset.c === "pt-card") previewCard(); });

  document.addEventListener("submit", async (ev) => {
    const f = ev.target.closest("form[data-f]"); if (!f) return;
    ev.preventDefault();
    const btn = f.querySelector("button[type=submit]");
    const k = f.dataset.f;
    if (k === "manual") { const i = $("#manualCode"); scanned(i.value); i.value = ""; return; }
    if (k === "partner") {
      const m = $("#ptMsg"); m.innerHTML = "";
      const req = parseInt(f.required.value, 10);
      const err = (c) => { m.innerHTML = `<div class="msg err">${esc(A.errText(c))}</div>`; };
      if (f.name.value.trim().length < 2) return err("bad_name");
      if (!f.required.disabled && (!(req >= 1 && req <= 20) || !f.reward1.value.trim())) return err("bad_card");
      if (!f.consent.checked) return err("consent_required");
      btn.disabled = true;
      try {
        const evSel = (f.querySelector("input[name=event]:checked") || {}).value || "";
        const d = await A.urpc("partner_apply", {
          p_name: f.name.value.trim(), p_kind: f.kind.value, p_description: f.description.value.trim(), p_phone: f.phone.value.replace(/[\s-]/g, ""),
          p_instagram: f.instagram.value.trim(), p_logo: ptLogo, p_event: evSel || null, p_required: req || 3,
          p_reward1: f.reward1.value.trim() || "مكافأة", p_reward2: f.reward2.value.trim() || null, p_cooldown: parseInt(f.cooldown.value || "30", 10)
        });
        S.me = await A.urpc("me");
        toast(d.status === "pending" ? "تم إرسال طلبك للمنظم" : "حُفظت بياناتك", "ok");
        renderBar(); loadPartnerForm(); window.scrollTo(0, 0);
      } catch (e) { err(e.code); }
      finally { if (document.body.contains(btn)) btn.disabled = false; }
      return;
    }
    authMsg("");
    btn.disabled = true;
    try {
      if (k === "login") {
        const id = f.ident.value.trim(), pass = f.password.value;
        if (!id || !pass) throw { code: "bad_login" };
        let email = id.toLowerCase();
        if (!id.includes("@")) {
          const d = await A.rpc("login_email_for_phone", { p_phone: id.replace(/[\s-]/g, ""), p_password: pass });
          email = d.email;
        } else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) throw { code: "bad_email" };
        try { await A.auth.signIn(email, pass); }
        catch (e) {
          if (e.code === "email_not_confirmed") { S.email = email; A.session.set("pending-email", email); try { await A.auth.resendConfirm(email); S.resendAt = Date.now() + 60000; } catch (x) { /* ignore */ } goAuth("code"); return; }
          throw e;
        }
        await boot();
      } else if (k === "signup") {
        const v = { name: f.name.value.trim(), phone: f.phone.value.replace(/[\s-]/g, ""), email: f.email.value.trim().toLowerCase(),
          type: (f.querySelector("input[name=type]:checked") || {}).value || "visitor" };
        S.signup = v;
        if (v.name.length < 2) throw { code: "bad_name" };
        if (!/^\+?[0-9]{8,15}$/.test(v.phone)) throw { code: "bad_phone" };
        if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v.email)) throw { code: "bad_email" };
        if (f.password.value.length < 8) throw { code: "weak_password" };
        if (f.password.value !== f.password2.value) throw { code: "password_mismatch" };
        if (!f.consent.checked) throw { code: "consent_required" };
        const chk = await A.rpc("phone_available", { p_phone: v.phone });
        if (!chk.available) throw { code: "phone_taken" };
        const r = await A.auth.signUp(v.email, f.password.value, { name: v.name, phone: v.phone, type: v.type, consent: true });
        S.email = v.email;
        if (r.session) { S.signup = null; await boot(); }
        else { A.session.set("pending-email", v.email); S.resendAt = Date.now() + 60000; goAuth("code"); }
      } else if (k === "code") {
        const code = f.code.value.replace(/\D/g, "");
        if (code.length < 6) throw { code: "bad_otp" };
        await A.auth.verify(S.email, code);
        A.session.del("pending-email"); S.signup = null;
        await boot();
      } else if (k === "forgot") {
        const email = f.email.value.trim().toLowerCase();
        if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) throw { code: "bad_email" };
        await A.auth.recover(email);
        S.email = email;
        authMsg("إذا كان البريد مسجّلًا لدينا فسيصلك رابط الاستعادة خلال دقائق. افتحه من هذا الجهاز.", "ok");
      } else if (k === "reset") {
        if (f.password.value.length < 8) throw { code: "weak_password" };
        if (f.password.value !== f.password2.value) throw { code: "password_mismatch" };
        await A.auth.setPassword(f.password.value);
        toast("تم تغيير كلمة المرور", "ok");
        await boot();
      } else if (k === "profile") {
        if (!f.consent.checked) throw { code: "consent_required" };
        const phone = f.phone.value.replace(/[\s-]/g, "");
        if (f.name.value.trim().length < 2) throw { code: "bad_name" };
        if (!/^\+?[0-9]{8,15}$/.test(phone)) throw { code: "bad_phone" };
        const first = !(S.me && S.me.profile);
        await A.urpc("save_profile", { p_name: f.name.value.trim(), p_phone: phone, p_type: (f.querySelector("input[name=type]:checked") || {}).value || "visitor", p_consent: true });
        S.me = await A.urpc("me");
        S.authOpen = false;
        if (first) { await boot(); } else { S.tab = "account"; toast("حُفظت بياناتك", "ok"); render(); }
      }
    } catch (e) {
      if (e && e.code === "not_signed_in") return signedOut();
      authMsg(errMsg(e));
    } finally { if (document.body.contains(btn)) btn.disabled = false; }
  });

  document.addEventListener("visibilitychange", () => { if (document.visibilityState === "hidden") stopScanner(); });

  boot();
})();
