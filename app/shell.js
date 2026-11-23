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
  // أيقونات هوية شُرفة (Shurfah Icon Pack) — اللون الأساسي currentColor ولون التمييز --ia
  const bi = (n, cls = "bico") => `<svg class="${cls}" aria-hidden="true" focusable="false"><use href="brand-icons.svg#b-${n}"></use></svg>`;
  const ic = (n, s = 20, w = 1.8) => `<svg aria-hidden="true" width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"><path d="${P[n] || P.star}"></path></svg>`;

  /* ---------- أدوات ---------- */
  let toastT;
  function toast(msg, type = "") {
    const t = $("#toast");
    t.textContent = msg; t.className = "toast show " + type;
    clearTimeout(toastT); toastT = setTimeout(() => { t.className = "toast"; }, 3200);
  }
  const errMsg = (e) => A.errText(e && e.code);
  const EVDB = {};   // محتوى الفعاليات من قاعدة البيانات (تعدّله إدارة شُرفة)
  function evById(id) {
    const base = (D.events || []).find((e) => e.id === id), db = EVDB[id];
    if (!base && !db) return undefined;
    const b = base || { id, page: {} }, x = db || {};
    const m = Object.assign({}, b, {
      id, name: x.name || b.name || id, summary: x.summary || b.summary || "", location: x.location || b.location || "",
      date: x.date || b.date || "", status: x.status || b.status || "soon", image: x.image || b.image || "", logo: x.logo || b.logo || "",
      colors: Object.assign({}, b.colors || {}, x.color_from ? { from: x.color_from } : {}, x.color_to ? { to: x.color_to } : {}),
      hours: x.hours || "", sort: x.sort != null ? x.sort : 100, visible: x.visible !== false, db: x
    });
    if (!m.page) m.page = {};
    return m;
  }
  const allEvents = () => {
    const ids = [...new Set([...(D.events || []).map((e) => e.id), ...Object.keys(EVDB)])];
    return ids.map(evById).filter((e) => e && (e.visible || isAdmin())).sort((a, b) => (a.sort - b.sort));
  };
  const img = (p) => (!p ? "" : /^https:\/\//.test(p) ? p : "../" + p.replace(/^\/+/, ""));
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
    authOpen: false, after: null, role: "visitor",
    authStep: "login", loginBy: "email", email: "", resendAt: 0, signup: null
  };

  /* =========================================================
     الدخول
     ========================================================= */
  function renderAuth() {
    bar.hidden = true; scr.className = "screen no-tabs auth-screen"; $("#appbar").hidden = true; closeMenu();
    const ev = evById(EV), st = S.authStep;
    // في «أكمل بياناتك» الدور يُعرف من الحساب نفسه (إدارة/منظم/شريك) وليس من الجهاز
    const profRole = () => !S.me ? (S.role || "visitor") : S.me.shurfa_admin ? "admin" : (S.me.org_events || []).length ? "organizer"
      : (S.me.partner || (S.me.stalls || []).length) ? "partner" : (S.role || "visitor");
    const R = st === "profile" ? profRole() : (S.role || "visitor");
    const evName = ev ? esc(ev.name.split("—")[0].trim()) : "";
    const TL = {
      visitor: ["أهلًا بك في شُرفة", (isOffers() ? "سجّل دخولك لشراء جوازك الرقمي وخصومات الأكشاك" : "سجّل دخولك لشراء جوازك الرقمي وجمع الأختام") + (evName ? " في " + evName : "") + "."],
      partner: ["بوابة الشركاء", "شريك" + (evName ? " في " + evName : "") + ": أدر كشكك وبطاقة الولاء وامسح جوازات الزوار."],
      organizer: ["دخول المنظمين", "منظم" + (evName ? " في " + evName : "") + ": اعتمد جوازات الزوار بعد الدفع."],
      admin: ["إدارة شُرفة", "دخول فريق إدارة المنصة: اعتماد المنظمين والشركاء ومتابعة المؤشرات."]
    };
    const T = {
      who: ["سجّل دخولك إلى شُرفة", evName ? "اختر صفتك في " + evName + "." : "اختر صفتك والفعالية."],
      login: TL[R],
      signup: R === "partner" ? ["تسجيل شريك جديد", "الخطوة 1 من 2: حساب المسؤول عن المشروع. بعدها تُدخل بيانات المشروع وبطاقة الولاء."]
        : R === "organizer" ? ["تسجيل منظم فعالية", "الخطوة 1 من 2: حساب المسؤول. بعدها تُدخل بيانات الجهة والفعالية، ويعتمدها فريق شُرفة."]
        : ["إنشاء حساب زائر", "مرة واحدة، وتدخل بعدها بالبريد أو رقم الهاتف وكلمة المرور."],
      code: ["تأكيد البريد", R === "partner" ? "بعد التأكيد تنتقل لبيانات مشروعك وبطاقة الولاء." : R === "organizer" ? "بعد التأكيد تنتقل لبيانات الجهة والفعالية." : "خطوة أخيرة لحماية حسابك."],
      forgot: ["استعادة كلمة المرور", "نرسل لك رابطًا لتعيين كلمة مرور جديدة."],
      mfa: ["التحقق بخطوتين", "أدخل الرمز المكوّن من 6 أرقام من تطبيق المصادقة في جوالك."],
      reset: ["كلمة مرور جديدة", "اختر كلمة مرور جديدة لحسابك."],
      profile: [S.me && S.me.profile ? "تعديل بياناتي" : "أكمل بيانات حسابك",
        R === "admin" ? "بيانات حساب إدارة شُرفة." : R === "organizer" ? "الاسم ورقم التواصل لحساب المنظم." : R === "partner" ? "الاسم ورقم التواصل لحساب الشريك." : "مرة واحدة، لاستخدامها في جوازك الرقمي."]
    }[st] || ["شُرفة", ""];
    const topBg = st === "who" ? "" : R === "partner" ? "linear-gradient(150deg,#7A4F00,#B07400)" : R === "organizer" ? "linear-gradient(150deg,#1E7C7A,#14524F)" : R === "admin" ? "linear-gradient(150deg,#5F4486,#7B5BA7)" : "";
    const badge = st === "who" ? "" : R === "admin" ? "إدارة المنصة" : (R === "partner" ? "شريك" : R === "organizer" ? "منظم" : "زائر") + (evName ? " · " + evName : "");
    const top = `<div class="auth-top"${topBg ? ` style="background:${topBg}"` : ""}><div class="between"><img src="../assets/img/brand/monogram-160.png" alt="">${badge ? `<span class="st st-glass">${badge}</span>` : ""}</div><h1>${T[0]}</h1><p>${T[1]}</p>${["who", "login", "signup", "forgot", "code"].includes(st) && R !== "admin" ? `<button type="button" class="linkbtn" data-a="browse" style="color:var(--cream);align-self:flex-start;padding:0;opacity:.9">تصفّح شُرفة بدون تسجيل ←</button>` : ""}</div>`;
    const pw = (name, label, ac, hint) => `<div class="field"><label for="au-${name}">${label}</label>
      <div style="position:relative"><input class="input" id="au-${name}" name="${name}" type="password" autocomplete="${ac}" dir="ltr" minlength="8" required style="padding-left:52px">
      <button type="button" class="iconbtn" data-a="pw-toggle" aria-label="إظهار كلمة المرور" style="position:absolute;left:3px;top:3px">${ic("eye", 20)}</button></div>${hint ? `<span class="sub">${hint}</span>` : ""}</div>`;
    let body = "";
    if (st === "who") {
      const pick = !!A.session.get("pick");
      const evs = allEvents();
      const roles = [
        ["visitor", "زائر", "award", "#1A2E28", "#2E5148", isOffers() ? (evName ? `اشترِ جواز ${evName} واستمتع بخصومات الأكشاك` : "اشترِ الجواز الرقمي واستمتع بالخصومات") : evName ? `اشترِ جواز ${evName} واجمع أختام الأكشاك` : "اشترِ الجواز الرقمي واجمع الأختام"],
        ["partner", "شريك", "users", "#7A4F00", "#B07400", evName ? `سجّل كشكك في ${evName} وصمّم بطاقة الولاء` : "سجّل مشروعك وصمّم بطاقة الولاء"],
        ["organizer", "منظم", "scan", "#14524F", "#1E7C7A", evName ? `اعتمد جوازات الزوار في ${evName}` : "اعتمد جوازات زوار فعاليتك"]
      ];
      body = `<div class="auth-body">
        ${pick ? `<div class="field"><span>الفعالية</span><div class="hscroll" style="padding:2px 0 6px;margin:0 -2px">${evs.map((e) => `<button type="button" class="st ${e.id === EV ? "st-ok" : "st-mute"}" data-a="who-event" data-id="${esc(e.id)}" style="border:0;padding:8px 14px;font-size:13.5px">${esc(e.name.split("—")[0].trim())}</button>`).join("")}</div></div>` : ""}
        <div class="field"><span>أنت</span></div>
        ${roles.map(([k, l, i, c1, c2, d]) => `<button type="button" class="who-card" data-a="who" data-k="${k}" style="background:linear-gradient(150deg,${c1},${c2})">
          <span class="ico-tile" style="background:rgba(255,255,255,.16);color:#fff;width:50px;height:50px">${ic(i, 26)}</span>
          <span class="grow"><b>${l}${evName ? ` <small>· ${evName}</small>` : ""}</b><span>${d}</span></span>${ic("fwd", 20, 2)}</button>`).join("")}
        <button type="button" class="linkbtn" data-a="who" data-k="admin" style="align-self:center;color:var(--purple)">${ic("shield", 16)} دخول إدارة شُرفة</button>
      </div>`;
    } else if (st === "login") {
      body = `<form class="auth-body" data-f="login" novalidate>
        <div class="card flat between" style="padding:10px 14px"><span style="font-size:14px">${R === "admin" ? "تدخل بصفتك <b>إدارة شُرفة</b>" : `تدخل بصفتك <b>${R === "partner" ? "شريك" : R === "organizer" ? "منظم" : "زائر"}</b>${evName ? " في <b>" + evName + "</b>" : ""}`}</span><button type="button" class="linkbtn" data-a="auth-go" data-k="who" style="padding:0;min-height:auto">تغيير</button></div>
        <div class="field"><label for="au-id">البريد الإلكتروني أو رقم الهاتف</label><input class="input" id="au-id" name="ident" autocomplete="username" dir="ltr" style="text-align:right" placeholder="name@example.com / 9xxxxxxx" value="${esc(S.email)}" required></div>
        ${pw("password", "كلمة المرور", "current-password")}
        <button type="button" class="linkbtn" data-a="auth-go" data-k="forgot" style="align-self:flex-start;padding:0;min-height:30px">نسيت كلمة المرور؟</button>
        <div id="au-msg"></div>
        <button class="btn btn-dark" type="submit">${R === "partner" ? "دخول الشريك" : R === "organizer" ? "دخول المنظم" : R === "admin" ? "دخول الإدارة" : "تسجيل الدخول"}</button>
        ${R === "admin" ? `<p class="sub" style="text-align:center">حسابات الإدارة تُضاف من فريق شُرفة فقط.</p>` : `<div class="row" style="justify-content:center;gap:6px"><span class="sub">${R === "partner" ? "شريك جديد؟" : R === "organizer" ? "منظم جديد؟" : "ليس لديك حساب؟"}</span><button type="button" class="linkbtn" data-a="auth-go" data-k="signup">${R === "partner" ? "سجّل مشروعك" : R === "organizer" ? "سجّل جهتك وفعاليتك" : "أنشئ حسابًا"}</button></div>`}
        ${R === "organizer" ? `<p class="sub" style="text-align:center">يراجع فريق شُرفة طلبات المنظمين قبل تفعيل لوحة الإدارة.</p>` : ""}
      </form>`;
    } else if (st === "signup") {
      const v = S.signup || {};
      body = `<form class="auth-body" data-f="signup" novalidate>
        ${R === "partner" ? `<div class="row" style="gap:8px"><span class="st st-warn">1 الحساب</span><span class="sub">←</span><span class="st st-mute">2 المشروع وبطاقة الولاء</span></div>` : ""}
        ${R === "organizer" ? `<div class="row" style="gap:8px"><span class="st st-teal">1 الحساب</span><span class="sub">←</span><span class="st st-mute">2 الجهة والفعالية</span></div>` : ""}
        <div class="field"><label for="su-name">${R === "partner" ? "اسم المسؤول عن المشروع" : R === "organizer" ? "اسم المسؤول" : "الاسم"}</label><input class="input" id="su-name" name="name" autocomplete="name" maxlength="60" placeholder="مثال: أحمد سالم" value="${esc(v.name || "")}" required></div>
        <div class="field"><label for="su-phone">رقم الهاتف</label><input class="input" id="su-phone" name="phone" inputmode="tel" autocomplete="tel" dir="ltr" style="text-align:right" placeholder="9xxxxxxx" value="${esc(v.phone || "")}" required></div>
        <div class="field"><label for="su-email">البريد الإلكتروني</label><input class="input" id="su-email" name="email" type="email" inputmode="email" autocomplete="email" dir="ltr" placeholder="name@example.com" value="${esc(v.email || "")}" required></div>
        ${pw("password", "كلمة المرور", "new-password", "8 أحرف على الأقل.")}
        ${pw("password2", "تأكيد كلمة المرور", "new-password")}
        <label class="check"><input type="checkbox" name="consent"> <span>${R !== "visitor" ? "أوافق على استخدام بياناتي لإدارة حسابي والتواصل بخصوص الفعاليات." : "أوافق على استخدام بياناتي لتشغيل حسابي وجوازي الرقمي في الفعاليات فقط."} <a href="privacy.html">سياسة الخصوصية</a></span></label>
        <div id="au-msg"></div>
        <button class="btn btn-cta" type="submit">${R === "partner" ? "التالي: بيانات المشروع" : R === "organizer" ? "التالي: بيانات الجهة" : "إنشاء الحساب"}</button>
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
    } else if (st === "mfa") {
      body = `<form class="auth-body" data-f="mfa" novalidate>
        <div class="card flat row" style="gap:10px">${ic("lock", 20)}<span class="grow" style="font-size:14px">حسابك محمي بالتحقق بخطوتين. افتح تطبيق المصادقة (Google Authenticator أو Microsoft Authenticator) وأدخل الرمز الحالي.</span></div>
        <div class="field"><label for="au-mfa">رمز التحقق</label>
          <input class="input code" id="au-mfa" name="code" inputmode="numeric" autocomplete="one-time-code" maxlength="6" placeholder="••••••" required></div>
        <div id="au-msg"></div>
        <button class="btn btn-dark" type="submit">تحقق ودخول</button>
        <button type="button" class="linkbtn" data-a="logout" style="align-self:center">خروج</button>
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
        <label class="check"><input type="checkbox" name="consent" ${p.name ? "checked" : ""}> <span>${R === "visitor" ? "أوافق على استخدام اسمي ورقمي لتشغيل الجواز الرقمي في الفعاليات فقط." : "أوافق على استخدام اسمي ورقمي لإدارة حسابي والتواصل بخصوص الفعاليات."} <a href="privacy.html">سياسة الخصوصية</a></span></label>
        <div id="au-msg"></div>
        <button class="btn btn-cta" type="submit">${S.me && S.me.profile ? "حفظ" : "متابعة"}</button>
        ${S.me && S.me.profile ? `<button type="button" class="btn btn-line" data-a="go-tab" data-tab="account">إلغاء</button>`
          : `<div class="row" style="justify-content:center;gap:6px"><span class="sub dir-ltr" dir="ltr">${esc((S.me && S.me.email) || "")}</span><button type="button" class="linkbtn" data-a="logout">ليس حسابك؟ خروج</button></div>`}
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

  /* التحقق بخطوتين: هل للحساب عامل مفعّل؟ إن نعم نطلب الرمز */
  async function needMfa() {
    try {
      const f = (await A.auth.factors()).find((x) => x.status === "verified");
      if (!f) return false;
      S.mfaFactor = f.id; S.authOpen = true; goAuth("mfa"); return true;
    } catch (e) { return false; }
  }

  /* =========================================================
     التشغيل
     ========================================================= */
  async function boot() {
    if (A.session.get("role")) S.role = A.session.get("role");
    { const q0 = new URLSearchParams(location.search);
      // من شُرفة العامة (بدون فعالية في الرابط) ← يختار الفعالية؛ من صفحة فعالية ← الفعالية ثابتة
      if (q0.get("pick") === "1" || !q0.has("e")) A.session.set("pick", 1);
      else A.session.del("pick"); }
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
      catch (e) {
        if (e.code === "mfa_required" && await needMfa()) return;
        if (e.code === "not_signed_in" || e.status === 401) await A.auth.signOut(); S.me = null;
      }
    } else if (A.session.get("pending-email")) {
      S.email = A.session.get("pending-email"); S.authOpen = true; goAuth("code"); return;
    }
    if (S.me && !S.me.profile) { S.authOpen = true; goAuth("profile"); return; }
    S.myGames = [];
    if (S.me) { try { S.myGames = await A.urpc("my_games"); } catch (e) { S.myGames = []; } }
    S.authOpen = false;

    await loadEvInfo();
    const q =new URLSearchParams(location.search);
    if (q.get("tab") && tabs().some((t) => t[0] === q.get("tab"))) S.tab = q.get("tab");
    if (!S.after && A.session.get("after")) S.after = A.session.get("after");
    const qr = q.get("role");
    if (q.get("join") === "partner" || qr === "partner") {
      history.replaceState(null, "", location.pathname + "?e=" + EV); setRole("partner");
      if (!S.me) { S.after = "partner"; A.session.set("after", "partner"); S.authOpen = true; goAuth(q.get("join") ? "signup" : "login"); return; }
      return startIntent("partner");
    }
    if (qr === "admin") { history.replaceState(null, "", location.pathname); setRole("admin"); return S.me ? startIntent("admin") : requireLogin("admin", "admin"); }
    if (qr === "organizer") { history.replaceState(null, "", location.pathname + "?e=" + EV); setRole("organizer"); return S.me ? startIntent("organizer") : requireLogin("organizer", "organizer"); }
    if (q.get("login") === "1" && !S.me) { history.replaceState(null, "", location.pathname + "?e=" + EV); return requireLogin(null, null); }
    // فعالية مخفية: الزوار ينتقلون لأول فعالية ظاهرة
    { const cur = evById(EV); if (cur && !cur.visible && !isAdmin()) { const alt = allEvents()[0]; if (alt) { toast("هذه الفعالية غير متاحة حاليًا"); location.replace(location.pathname + "?e=" + encodeURIComponent(alt.id)); return; } } }
    if (isAdmin() && !q.get("tab")) S.tab = "admin";
    if (!q.get("tab") && S.tab === "home" && isWorker()) S.tab = "work";
    if (S.me) loadBands();
    await loadGames(); if (S.me) await loadTickets();
    const bandQ = (q.get("band") || "").toUpperCase(), goQ = q.get("go");
    if (bandQ || goQ) history.replaceState(null, "", location.pathname + "?e=" + EV);
    setGuard(); startPulse();
    if (/^[A-Z0-9]{10}$/.test(bandQ)) {
      if (S.me && isOrg()) { S.tab = "work"; S.work.mode = "org"; S.sub = null; render(); overlay({ k: "wait", icon: "scan", title: "جارٍ إبلاغ ولي الأمر…" }); return orgBand(bandQ); }
      A.session.set("band", bandQ); S.tab = "home"; S.sub = { name: "bands", code: bandQ }; return render();
    }
    if (goQ === "pass") S.tab = "pass";
    else if (goQ === "bands") S.sub = { name: "bands" };
    else if (goQ === "packages") S.sub = { name: "packages" };
    else if (goQ === "games") S.sub = { name: "games" };
    else if (goQ === "soon" && q.get("k")) S.sub = { name: "soon", id: q.get("k") };
    if (S.after) { const a = S.after; S.after = null; return startIntent(a); }
    render();
  }

  /* نية بعد تسجيل الدخول: شراء الجواز أو التسجيل كشريك */
  function startIntent(kind) {
    if (!S.me) return requireLogin(kind);
    A.session.del("after");
    if (kind === "buy") { S.tab = "pass"; S.sub = myPassRef() ? null : { name: "checkout" }; }
    else if (kind === "games") { S.tab = "home"; S.sub = { name: "games" }; }
    else if (kind === "band") { S.tab = "home"; S.sub = { name: "bands", code: A.session.get("band") || "" }; A.session.del("band"); }
    else if (kind === "partner") {
      // شريك: إن كان لديه كشك يفتح «كشكي»، وإلا نموذج المشروع
      if (isStaff() && approvedStalls().length) { S.tab = "work"; S.work.mode = "stall"; S.sub = null; }
      else { S.tab = isStaff() ? "work" : "account"; S.sub = isStaff() ? null : { name: "partner" }; }
    }
    else if (kind === "admin") {
      if (isAdmin()) { S.tab = "admin"; S.sub = null; }
      else { toast("هذا الحساب ليس من إدارة شُرفة.", "err"); S.tab = "home"; S.sub = null; setRole("visitor"); }
    }
    else if (kind === "organizer") {
      if (isOrg()) { S.tab = "work"; S.work.mode = "org"; S.sub = null; }
      else { S.tab = "account"; S.sub = { name: "orgapply" }; }
    }
    render();
  }
  function requireLogin(intent, role) {
    if (role) setRole(role); else if (intent === "partner") setRole("partner"); else if (intent === "buy") setRole("visitor");
    S.after = intent; A.session.set("after", intent || null); S.authOpen = true;
    S.authStep = (role || intent) ? "login" : "who"; renderAuth();
  }
  function setRole(r) { S.role = r; A.session.set("role", r); }

  async function loadEvInfo() {
    try {
      const list = await A.rpc("list_events");
      (list || []).forEach((e) => { EVDB[e.id] = e; });
      S.ev = EVDB[EV] || null;
    } catch (e) { S.ev = S.ev || null; }
    return S.ev;
  }
  const myPassRef = () => S.me && (S.me.passes || []).find((p) => p.event === EV);
  const price = () => (S.ev && S.ev.price_baisa) || 0;
  const fmtPrice = (b) => !b ? "مجانًا" : b % 1000 === 0 ? (b === 1000 ? "1 ريال" : `${b / 1000} ريالات`) : b < 1000 ? `${b} بيسة` : `${(b / 1000).toFixed(3)} ر.ع`;
  const canSell = () => !!(S.ev && S.ev.active);
  const fmtMoney = (b) => (b ? fmtPrice(b) : "0");   // مبالغ الصندوق: الصفر يظهر 0 لا «مجانًا»
  /* جواز الفعالية: عرض واحد من كل كشك + صندوق الشركاء (events.pass_mode = offers) */
  const isOffers = (id = EV) => ((EVDB[id] || {}).pass_mode) === "offers";
  const stallEv = (id) => ((((S.me && S.me.stalls) || []).find((x) => x.id === id)) || {}).event || EV;

  /* =========================================================
     التبويبات
     ========================================================= */
  const staffStalls = () => ((S.me && S.me.stalls) || []).filter((s) => s.event === EV || true);
  const approvedStalls = () => staffStalls().filter((s) => s.status === "approved" && s.active !== false);
  const isStaff = () => staffStalls().length > 0;
  const orgEvents = () => (S.me && S.me.org_events) || [];
  const isOrg = () => orgEvents().length > 0;
  const isAdmin = () => !!(S.me && S.me.shurfa_admin);
  const isOperator = () => !!(S.myGames && S.myGames.length);     // مشغّل اللعبة (صاحب اللعبة أو الماسك لها)
  const isWorker = () => isStaff() || isOrg() || isOperator();
  const myName = () => (S.me && S.me.profile && S.me.profile.name) || "";

  function tabs() {
    if (isAdmin()) return [["admin", "الإدارة", "shield"], ["home", "الرئيسية", "home"], ["events", "الفعاليات", "compass"], ["pass", "الجواز", "award"], ["account", "حسابي", "user"]];
    const t = [["home", "الرئيسية", "home"], ["pass", "جوازي", "award"]];
    if (isWorker()) { const n = [isStaff(), isOrg(), isOperator()].filter(Boolean).length; t.push(["work", n > 1 ? "عملي" : isStaff() ? "كشكي" : isOrg() ? "الاعتماد" : "لعبتي", "scan"]); }
    if (isAdmin()) t.push(["admin", "شُرفة", "shield"]);
    t.push(["events", "الفعاليات", "compass"], ["account", S.me ? "حسابي" : "دخول", "user"]);
    return t;
  }
  function renderBar() {
    const items = tabs().map(([k, l, i]) => `<button data-a="go-tab" data-tab="${k}" ${S.tab === k ? 'aria-current="page"' : ""}>${ic(i, 20, S.tab === k ? 2.1 : 1.8)}<span>${l}</span></button>`).join("");
    const ab = $("#appbar"); ab.hidden = false;
    $("#appnav").innerHTML = items;
    $("#drawer").innerHTML = items;
    closeMenu();
    bar.hidden = true;
  }
  function closeMenu() { const d = $("#drawer"), m = $("#menuBtn"); if (d) d.hidden = true; if (m) m.setAttribute("aria-expanded", "false"); }

  let refreshT, railRAF;
  /* سجل التنقل: زر الرجوع في المتصفح/الجوال يبقى داخل التطبيق.
     أول سطر في السجل «حارس» يعيد المستخدم لصفحته الأساسية بدل صفحة الهبوط. */
  let restoring = false;
  const homeTab = () => isAdmin() ? "admin" : isWorker() ? "work" : "home";
  const sameNav = (st) => st && st.s && !st.guard && st.tab === S.tab && JSON.stringify(st.sub || null) === JSON.stringify(S.sub || null);
  function pushNav() {
    if (restoring) return;
    const st = history.state;
    if (sameNav(st)) return;
    try { history.pushState({ s: 1, depth: ((st && st.s && st.depth) || 0) + 1, tab: S.tab, sub: S.sub || null }, ""); } catch (e) { /* ignore */ }
  }
  function setGuard() { try { history.replaceState({ s: 1, guard: 1, depth: 0 }, ""); } catch (e) { /* ignore */ } }
  window.addEventListener("popstate", (e) => {
    const st = e.state;
    if (!st || !st.s) return;
    closeOverlay(false); closeMenu();
    if (S.authOpen) { if (S.me && !S.me.profile) { pushNav(); return; } S.authOpen = false; S.after = null; A.session.del("after"); }
    if (st.guard) { S.tab = homeTab(); S.sub = null; render(); return; }   // render يضيف سطرًا جديدًا فوق الحارس
    S.tab = st.tab; S.sub = st.sub || null;
    if (!tabs().some((t) => t[0] === S.tab)) S.tab = homeTab();
    restoring = true; try { render(); } finally { restoring = false; }
  });

  function render() {
    clearInterval(refreshT); cancelAnimationFrame(railRAF);
    stopScanner(); S.passFill = null; onScan = null; onBand = null; onTicket = null;
    pushNav();
    scr.className = "screen";
    renderBar();
    window.scrollTo(0, 0);
    if (S.sub && SUB[S.sub.name]) { const h = SUB[S.sub.name](S.sub); if (typeof h === "string") scr.innerHTML = h; afterSub(S.sub); return; }
    if (isAdmin() && !tabs().some((t) => t[0] === S.tab)) S.tab = "admin";
    ({ home: renderHome, pass: renderPass, work: renderWork, admin: renderAdmin, events: renderEvents, account: renderAccount }[S.tab] || renderHome)();
  }
  const head = (title, back = true, extra = "") => `<div class="phead">${back ? `<button class="iconbtn" data-a="back" aria-label="رجوع">${ic("back", 24, 2)}</button>` : ""}<h2>${esc(title)}</h2>${extra}</div>`;
  const loginBtn = () => `<button class="btn btn-dark btn-sm" data-a="login" style="width:auto;padding:0 16px">${ic("user", 18)} دخول</button>`;

  /* ---------------- الرئيسية ---------------- */
  function renderHome() {
    const ev = evById(EV) || {};
    const c = ev.colors || { from: "#1A2E28", to: "#2E5148" };
    const others = allEvents().filter((e) => e.id !== EV);
    const prog = (ev.page && ev.page.program && ev.page.program.items) || [];
    const ref = myPassRef();
    const services = [];
    const photo = ev.image ? img(ev.image) : "";
    const pIcon = (p) => /users/.test(p.icon || "") ? "users" : /sweet/.test(p.icon || "") ? "sweet" : /coffee/.test(p.icon || "") ? "coffee" : "food";
    featList(ev).forEach((k) => services.push(feat(k, ev, true)));
    prog.filter((p) => p.link && !/(^|\/)app\/(index\.html)?(\?|$)/.test(p.link.href)).forEach((p) => services.push({ t: p.title, d: p.desc, main: pIcon(p), deco: ["game", "star", "gift"],
      c1: p.color || "#3D8BE0", c2: "#16306E", badge: (p.rows && p.rows[0] && p.rows[0][1]) || "", href: img(p.link.href), cta: p.link.label }));
    prog.filter((p) => !p.link).forEach((p) => services.push({ t: p.title, d: p.desc, main: pIcon(p), deco: ["spark", "gift", "star"],
      c1: p.color || "#A63FB0", c2: "#4B1A55", badge: p.note && /جوائز/.test(p.note) ? "جوائز" : "", a: `data-a="sub" data-name="program" data-title="${esc(p.title)}"`, cta: "التفاصيل" }));

    let passCard;
    if (!ref) passCard = `<button class="card row" data-a="buy" style="gap:14px;border:1.5px solid var(--purple)"><span class="ico-tile" style="background:var(--purple-soft);color:var(--purple)">${ic("award", 22)}</span>
        <span class="grow"><b>احصل على جوازك الرقمي</b><span class="sub" style="display:block">${isOffers() ? "خصم وباقات من كل كشك مشارك" : "اجمع أختام الأكشاك واحصل على مكافآتها"}${price() ? " · " + fmtPrice(price()) : ""}</span></span>${ic("fwd", 18, 2)}</button>`;
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
          ${ev.hours || (ev.db && ev.db.location) ? `${ev.hours ? `<span class="row" style="gap:6px">${ic("clock", 16)}${esc(ev.hours)}</span>` : ""}${ev.location ? `<span class="row" style="gap:6px">${ic("pin", 16)}${esc(ev.location)}</span>` : ""}`
            : ev.page && ev.page.facts ? ev.page.facts.slice(1, 3).map((f) => `<span class="row" style="gap:6px">${ic(f.icon === "i-pin" ? "pin" : "clock", 16)}${esc(f.text)}</span>`).join("") : ""}</div>
        ${ref && ref.status === "active" ? `<button class="btn btn-soft" data-a="go-tab" data-tab="pass" style="margin-top:4px">${ic("qr", 20)} اعرض جوازي للكشك</button>`
          : `<button class="btn btn-soft" data-a="sub" data-name="event" data-id="${esc(EV)}" style="margin-top:4px">تفاصيل الفعالية وخدماتها</button>`}
      </section>
      <div class="sp"></div>
      ${canSell() || ref ? `<div class="pad">${passCard}</div><div class="sp"></div>` : ""}
      ${isStaff() || isOrg() ? `<div class="pad"><button class="card row" data-a="go-tab" data-tab="work" style="gap:14px;background:var(--teal-soft);box-shadow:none"><span class="ico-tile" style="background:#fff;color:var(--teal-ink)">${ic(isStaff() ? "scan" : "chart", 22)}</span><span class="grow"><b>${isStaff() ? "واجهة الكشك" : "اعتماد الجوازات"}</b><span class="sub" style="display:block;color:var(--ink)">${isStaff() ? "امسح جوازات الزوار وأضف الأختام" : "امسح رمز الزائر بعد الدفع لتفعيل جوازه"}</span></span>${ic("fwd", 18, 2)}</button></div><div class="sp"></div>` : ""}
      ${isOperator() && !isStaff() && !isOrg() ? `<div class="pad"><button class="card row" data-a="go-tab" data-tab="work" style="gap:14px;background:var(--gold-soft);box-shadow:none"><span class="ico-tile" style="background:#fff;color:var(--gold-ink)">${bi("game")}</span><span class="grow"><b>مشغّل اللعبة</b><span class="sub" style="display:block;color:var(--ink)">امسح تذاكر الزوار: استلم الدفع وسجّل الدخول</span></span>${ic("fwd", 18, 2)}</button></div><div class="sp"></div>` : ""}
      ${S.me && S.me.shurfa_admin ? `<div class="pad"><button class="card row" data-a="go-tab" data-tab="admin" style="gap:14px;background:var(--purple-soft);box-shadow:none"><span class="ico-tile" style="background:#fff;color:var(--purple)">${ic("shield", 22)}</span><span class="grow"><b>إدارة شُرفة</b><span class="sub" style="display:block;color:var(--ink)">المنظمون والشركاء والمؤشرات</span></span>${ic("fwd", 18, 2)}</button></div><div class="sp"></div>` : ""}
      <div id="railWrap"></div>
      ${services.length ? `<div class="pad"><h3 class="sec-t">خدمات الفعالية</h3></div>
      <div class="hscroll" style="padding-top:10px">${services.map((s) => `${s.href ? `<a class="svc" href="${esc(s.href)}">` : `<button class="svc" ${s.a}>`}
        <span class="art svc-art" style="--c1:${esc(s.c1)};--c2:${esc(s.c2)};${photo ? `--photo:url('${esc(photo)}')` : ""}">
          <span class="svc-pattern"></span>
          ${s.deco.map((d, i) => `<span class="svc-deco d${i + 1}">${bi(d)}</span>`).join("")}
          <span class="svc-main">${bi(s.main)}</span>
          ${s.badge ? `<span class="svc-badge">${esc(s.badge)}</span>` : ""}
        </span>
        <span class="b"><b style="font-size:16px">${esc(s.t)}</b><span class="sub" style="line-height:1.6">${esc(s.d || "")}</span><span class="svc-cta" style="--c1:${esc(s.c1)}">${esc(s.cta)} ${ic("fwd", 16, 2.2)}</span></span>
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
        if (isOffers()) {
          const L = S.passOffers || [], used = L.filter((o) => o.state === "used").length;
          el.innerHTML = `<span class="between"><b>جوازي الرقمي</b><b class="num" style="color:var(--purple)">${L.length - used} ${L.length - used === 1 ? "عرض متاح" : "عروض متاحة"}</b></span>
            <span class="sub" style="display:block;margin-top:4px">${used ? `استخدمت ${used} من ${L.length} · ` : ""}اعرض رمزك عند الطلب لخصم الكشك</span>`;
          return;
        }
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
      <span class="grow"><b>${esc(s.name)}</b><span class="sub" style="display:block">${esc(isOffers() ? s.reward1 : A.offerText(s))}</span></span>${ic("fwd", 16, 2)}</button>`).join("");
  }
  /* عروض جواز الفعالية مع حالة كل عرض للزائر */
  const OFFER_ST = { used: ["استخدمته", "st-mute"], pending: ["بانتظار تأكيدك", "st-warn"] };
  const OFFER_HOW = `<div class="card flat row" style="gap:10px;align-items:flex-start">${ic("qr", 20)}<span class="grow sub" style="color:var(--ink);line-height:1.7">عند الطلب: اعرض رمزك للكشك ← يطبّق لك الخصم أو الباقة اللي تختارها ← تدفع للكشك مباشرة بالسعر بعد الخصم. <b>لكل كشك مرة وحدة.</b></span></div>`;
  function passOffersHTML(list, own = true) {
    return OFFER_HOW + `<div class="offer-list">` + list.map((o) => { const st = OFFER_ST[o.state]; return `<div class="card offer-item${o.state === "used" ? " is-used" : ""}">
      <div class="row" style="gap:12px">${logoTile(o, 44)}<span class="grow"><b>${esc(o.name)}</b>${o.description ? `<span class="sub" style="display:block">${esc(o.description).slice(0, 90)}</span>` : ""}</span>
      ${!own ? "" : st ? `<span class="st ${st[1]}">${st[0]}</span>` : '<span class="st st-ok">متاح</span>'}</div>
      ${o.state === "used" ? `<span class="sub">استخدمت: <b>${esc(o.used_label || o.offer)}</b>${o.used_at ? " · " + esc(dayTime(o.used_at)) : ""}</span>` : dealHTML(o.deal, { fallback: o.offer })}</div>`; }).join("") + `</div>`;
  }

  async function loadPass() {
    try { S.pass = await A.urpc("my_pass", { p_event: EV }); }
    catch (e) { if (e.code === "not_signed_in") return signedOut(); S.pass = null; }
    if (isOffers() && S.pass && S.pass.ok) { try { S.passOffers = await A.urpc("pass_offers", { p_event: EV }); } catch (e) { S.passOffers = S.passOffers || []; } }
    // تحديث حالة الجواز في الذاكرة (بعد تفعيله من المنظم)
    const ref = myPassRef(); if (ref && S.pass && S.pass.status) ref.status = S.pass.status;
  }
  async function loadGames() {
    try { S.games = await A.rpc("list_games", { p_event: EV }); } catch (e) { S.games = S.games || []; }
    return S.games;
  }
  async function loadTickets() {
    if (!S.me) { S.tickets = []; return S.tickets; }
    try { S.tickets = await A.urpc("my_tickets", { p_event: EV }); } catch (e) { S.tickets = S.tickets || []; }
    return S.tickets;
  }
  async function loadStalls() {
    try { S.stalls = await A.rpc("list_stalls", { p_event: EV }); } catch (e) { S.stalls = S.stalls || []; }
  }

  /* ---------- خدمات الفعالية: التذاكر · الباقات · الجواز · سوار الأمان ---------- */
  const featList = (e) => { const l = (e && e.page && e.page.services) || []; return l.length ? l.filter((k) => ["tickets", "packages", "passport", "safety"].includes(k)) : ["passport"]; };
  function feat(k, e, cur) {
    const F = {
      tickets: { t: "تذاكر الألعاب", d: "احجز تذاكر دخول الألعاب والأنشطة واحتفظ بها في جوالك، وتُمسح عند الدخول.", main: "ticket", deco: ["star", "calendar", "spark"], c1: "#F5A623", c2: "#9A5B00",
        soon: cur ? !(S.games || []).length : false, go: "games", cta: cur && (S.tickets || []).length ? "تذاكري" : "احجز تذكرتك",
        badge: cur && (S.games || []).length ? (Math.min(...S.games.map((g) => g.price_baisa)) ? "من " + fmtPrice(Math.min(...S.games.map((g) => g.price_baisa))) : "مجانًا") : "" },
      packages: { t: "الباقات", d: isOffers(e.id) ? "باقة الفرد والعائلة والربع من أكثر من كشك، أو كوّن باقتك بنفسك." : e.page && e.page.packages ? "باقات من الأكشاك المشاركة تناسب ميزانيتك." : "باقات تجمع الدخول والوجبات والأنشطة بسعر أوفر.", main: "box", deco: ["food", "coffee", "sweet"], c1: "#E4573D", c2: "#8E2A17",
        soon: !(e.page && e.page.packages) && !isOffers(e.id), badge: "وفّر أكثر", go: "packages", cta: "تصفّح الباقات" },
      passport: { t: "الجواز الرقمي", d: isOffers(e.id) ? "خصومات وباقات من كل كشك مشارك، وتدفع للكشك مباشرة بالسعر بعد الخصم." : "بطاقة ولاء لكل كشك: اجمع الأختام واحصل على المكافآت.", main: "passport", deco: ["stamp", "gift", "star"], c1: "#7B5BA7", c2: "#3E2A63",
        badge: cur && canSell() ? (price() ? fmtPrice(price()) : "مجانًا") : "", go: "pass", cta: cur && myPassRef() ? "افتح جوازي" : "احصل على الجواز" },
      safety: { t: "سوار الأمان", d: "سوار برمز QR مرتبط بحسابك، يصلك إشعار فوري إذا مسحه فريق التنظيم.", main: "band", deco: ["shield", "bell", "lock"], c1: "#2CA6A4", c2: "#14524F",
        badge: "للأطفال", go: "bands", cta: (S.bands || []).length ? "أساوري" : "فعّل سوار طفلك" }
    }[k];
    if (F.soon) { F.badge = "قريبًا"; F.cta = "التفاصيل"; F.go = "soon"; }
    if (!cur && k === "tickets") F.badge = "";
    F.key = k;
    F.a = !cur ? `data-a="ev-go" data-id="${esc(e.id)}" data-go="${F.go}" data-k="${k}"` : F.go === "pass" ? 'data-a="go-tab" data-tab="pass"' : `data-a="sub" data-name="${F.go}" data-id="${k}"`;
    return F;
  }
  const SOON = {
    tickets: ["تذاكر الألعاب", "ticket", "#F5A623", ["اختر اللعبة وعدد التذاكر من التطبيق", "ادفع لمشغّل اللعبة وتتفعّل تذكرتك برمز QR", "اعرضها عند دخول اللعبة ليمسحها مشغّلها"]],
    packages: ["الباقات", "box", "#E4573D", ["اختر باقة جاهزة (عائلة، أصدقاء) أو كوّن باقتك", "ادفع مرة واحدة وتصلك قسيمة لكل مكوّن", "اعرض القسيمة عند الكشك أو البوابة"]]
  };

  /* ---------------- جوازي ---------------- */
  function renderPass() {
    const ev = evById(EV) || {};
    const evName = esc((ev.name || "").split("—")[0].trim());
    const ref = myPassRef(), OF = isOffers();
    if (OF && S.passTab === "cards") S.passTab = "offers";
    const benefits = `<div class="card stack" style="gap:10px">
        ${(OF ? [["gift", "خصم عند كل كشك مشارك", "كل مطعم ومقهى يحدد خصمه لحاملي الجواز"], ["food", "باقات بسعر أقل", "تشوف وش في الباقة وسعرها قبل وبعد الخصم"], ["qr", "رمز واحد لكل الأكشاك", "اعرضه عند الطلب، وادفع للكشك مباشرة"], ["award", "لكل كشك مرة وحدة", "تابع العروض المتبقية من جوازك"]]
          : [["award", "بطاقة ولاء لكل شريك", "كل زيارة لكشك = ختم في بطاقته"], ["gift", "مكافآت حقيقية", "خصومات ووجبات مجانية يحددها كل شريك"], ["qr", "رمز واحد لكل الأكشاك", "اعرضه عند كل زيارة"]])
          .map(([i, t, d]) => `<div class="row" style="gap:12px"><span class="ico-tile" style="background:var(--purple-soft);color:var(--purple);width:38px;height:38px">${ic(i, 18)}</span><div><b style="font-size:14px">${t}</b><div class="sub">${d}</div></div></div>`).join("")}</div>`;

    if (!S.me || !ref) {
      scr.innerHTML = `${head("جوازي الرقمي", false)}
        <section class="pp-cover"><span style="font-size:12.5px;opacity:.9">جواز شُرفة · ${evName}</span>
          <b style="font-size:24px;font-family:var(--head)">جوازك الرقمي للفعالية</b>
          <p style="opacity:.92;font-size:14px">${OF ? "جواز واحد يعطيك خصومات وباقات من كل الأكشاك المشاركة في الفعالية." : "اجمع أختام الأكشاك المشاركة، وكل بطاقة تكتمل تفتح لك مكافأة."}</p>
          <div class="between" style="background:rgba(255,255,255,.14);border-radius:14px;padding:12px 14px"><span>سعر الجواز</span><b style="font-size:22px">${fmtPrice(price())}</b></div></section>
        <div class="sp"></div><div class="pad stack">${benefits}
          ${OF ? `<b style="font-size:17px">وش تحصل في الجواز؟</b><div id="ppPreview" class="stack"><div class="skel"></div></div>
            <div class="card flat row" style="gap:10px">${bi("ticket")}<span class="grow sub">تذاكر الألعاب منفصلة عن الجواز، وتحجزها بسعر أقل من «تذاكر الألعاب».</span></div>` : ""}
          ${canSell() ? `<button class="btn btn-cta" data-a="buy">${S.me ? (price() ? `اشترِ الجواز · ${fmtPrice(price())}` : "احصل على جوازك مجانًا") : (price() ? "سجّل دخولك لشراء الجواز" : "سجّل دخولك واحصل على جوازك مجانًا")}</button>`
            : `<div class="card flat sub" style="text-align:center">بيع الجواز لهذه الفعالية غير متاح حاليًا.</div>`}
          ${S.me ? "" : `<p class="sub" style="text-align:center">ليس لديك حساب؟ <button class="linkbtn" data-a="signup" style="padding:0;min-height:auto">أنشئ حسابًا</button></p>`}
        </div><div class="sp"></div>`;
      if (OF) A.rpc("event_offers", { p_event: EV }).then((L) => { S.evOffers = L || []; const box = $("#ppPreview"); if (!box) return;
        box.innerHTML = (L || []).length ? passOffersHTML(L, false) : `<div class="empty card">${ic("gift", 36)}<b>العروض تُعلن قريبًا</b><span>تظهر هنا خصومات الأكشاك وباقاتها أول ما يعتمدها فريق شُرفة.</span></div>`; })
        .catch(() => { const box = $("#ppPreview"); if (box) box.innerHTML = ""; });
      return;
    }

    const pending = ref.status === "pending_payment";
    const tab = S.passTab;
    scr.classList.add("pass-layout");
    scr.innerHTML = `${head("جوازي الرقمي", false)}
      <section class="pp-cover">
        <div class="between"><span style="font-size:12.5px;opacity:.9">جواز شُرفة · ${evName}</span>${pending ? '<span class="st" style="background:var(--gold);color:var(--ink)">بانتظار الدفع</span>' : '<span class="st st-glass">مفعّل</span>'}</div>
        <b style="font-size:20px;font-family:var(--head)">${esc(myName())}</b>
        <div class="qr" id="ppQr"></div>
        <div class="pp-code">${esc(ref.code)}</div>
        <p style="text-align:center;font-size:13px;opacity:.9">${pending ? "اعرض هذا الرمز في منصة المنظمين عند الدفع" : OF ? "اعرض هذا الرمز عند الطلب ليطبّق لك الكشك خصمه أو باقتك" : "اعرض هذا الرمز لموظف الكشك عند كل زيارة"}</p>
        ${pending ? "" : `<div class="pp-stats"><div><b class="num" id="ppVisits">–</b><span>${OF ? "عروض استخدمتها" : "زيارات"}</span></div><div><b class="num" id="ppCards">–</b><span>${OF ? "عروض متاحة" : "بطاقات"}</span></div><div><b class="num" id="ppRewards">–</b><span>${OF ? "أكشاك مشاركة" : "مكافآت"}</span></div></div>`}
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
        ${(OF ? [["offers", "عروض الجواز"], ["log", "السجل"]] : [["cards", "بطاقاتي"], ["offers", "العروض"], ["log", "السجل"]]).map(([k, l]) => `<button data-a="pass-tab" data-k="${k}" aria-pressed="${tab === k}">${l}</button>`).join("")}</div></div>
      <div class="pad stack" id="ppBody"><div class="skel"></div></div><div class="sp"></div>`}`;
    A.qr($("#ppQr"), "SHURFA:" + ref.code, 190);

    if (pending) return;   // التفعيل يصل عبر النبضة (startPulse) ويظهر إشعار فوري
    const fill = () => {
      const p = S.pass; if (!p || !p.ok || !$("#ppBody")) return;
      let h = "";
      if (OF) {
        const L = S.passOffers || [], used = L.filter((o) => o.state === "used").length;
        $("#ppVisits").textContent = used; $("#ppCards").textContent = L.length - used; $("#ppRewards").textContent = L.length;
      } else { $("#ppVisits").textContent = p.visits; $("#ppCards").textContent = p.cards.length; $("#ppRewards").textContent = p.rewards; }
      if (OF && S.passTab === "offers") {
        h = `<button class="card row" data-a="sub" data-name="packages" style="gap:12px;border:1.5px solid var(--gold)"><span class="ico-tile" style="background:var(--gold-soft);color:var(--gold-ink)">${ic("grid", 20)}</span><span class="grow"><b>باقات شُرفة</b><span class="sub" style="display:block">باقة الفرد والعائلة والربع من أكثر من كشك، أو كوّن باقتك</span></span>${ic("fwd", 16, 2)}</button>`
          + ((S.passOffers || []).length ? passOffersHTML(S.passOffers) : `<div class="empty card">${ic("gift", 36)}<b>لم تُعلن العروض بعد</b><span>تظهر هنا عروض الأكشاك المشاركة أول ما يعتمدها فريق شُرفة.</span></div>`);
      } else if (S.passTab === "cards") {
        h = p.cards.length ? p.cards.map((c) => { const st = A.cardState(c); return `<div class="loyalty">
            <div class="loyalty-head"><span class="row" style="gap:10px">${logoTile({ name: c.stall, logo: c.logo }, 36)}<b>${esc(c.stall)}</b>${c.rounds ? `<span class="sub">البطاقة ${c.rounds + 1}</span>` : ""}</span>${st.done >= c.required ? '<span class="st st-warn">مكافأة بانتظارك</span>' : `<span class="st st-purple">${st.done}/${c.required}</span>`}</div>
            <div class="slots">${A.slotsHTML(c)}</div><p class="loyalty-next">${esc(st.next)}</p></div>`; }).join("")
          : p.completed ? `<div class="empty card">${ic("gift", 36)}<b>أكملت ${p.completed === 1 ? "بطاقة ولاء واحدة" : p.completed === 2 ? "بطاقتي ولاء" : p.completed + " بطاقات ولاء"} 🎉</b><span>بطاقاتك المكتملة في «السجل». اعرض رمزك عند أي كشك لتبدأ بطاقة جديدة.</span></div>`
          : `<div class="empty card">${ic("award", 36)}<b>لا توجد أختام بعد</b><span>اعرض رمزك عند أي كشك مشارك، وستظهر بطاقته هنا مباشرة.</span></div>`;
      } else if (S.passTab === "offers") {
        h = offersHTML(S.stalls || []) || `<div class="empty card">${ic("gift", 36)}<b>لم تُعلن العروض بعد</b></div>`;
      } else {
        h = p.history && p.history.length ? `<div class="card" style="padding:4px 16px">${p.history.map((x) => `<div class="li"><span class="ico-tile" style="width:38px;height:38px;${x.kind === "reward" ? "background:var(--gold-soft);color:var(--gold-ink)" : "background:var(--purple-soft);color:var(--purple)"}">${ic(x.kind === "reward" ? "gift" : "check", 18, 2)}</span>
            <div class="grow"><b style="font-size:14px">${esc(x.stall)}</b><div class="sub">${x.kind === "reward" ? (OF ? "عرض: " : "مكافأة: ") + esc(x.reward) + (x.status === "pending" ? " · بانتظار تأكيدك" : x.status === "declined" ? " · لم تُستلم بعد" : "") : "ختم زيارة"} · ${esc(dayTime(x.at))}</div></div></div>`).join("")}</div>`
          : `<div class="empty card">${ic("list", 36)}<b>لا يوجد نشاط بعد</b></div>`;
      }
      $("#ppBody").innerHTML = h;
    };
    S.passFill = fill;
    Promise.all([loadPass(), S.stalls ? null : loadStalls()]).then(() => { fill(); if (S.pass && (S.pass.pending_rewards || []).length) askReward(S.pass.pending_rewards[0]); });
  }

  /* نبضة الزائر: كل 3 ثوانٍ في «جوازي» (6 في غيرها) — تفعيل الجواز أو ختم/مكافأة جديدة ⇐ إشعار فوري */
  let pulseT = null, pulseKey = null, pulseN = 0, pulseEv = null;
  function startPulse() {
    clearInterval(pulseT); pulseKey = null; pulseEv = EV;
    pulseT = setInterval(pulse, 3000); pulse();
  }
  async function pulse() {
    if (document.visibilityState !== "visible" || !S.me || S.authOpen) return;
    if (!$("#ovl .r-alert")) bandTick();
    if ((S.tickets || []).length) ticketsTick();
    if (!myPassRef()) return;
    if (S.tab !== "pass" && (pulseN++ % 2)) return;
    let d; try { d = await A.urpc("pass_pulse", { p_event: EV }); } catch (e) { return; }
    if (!d || !d.ok) return;
    const key = `${d.status}:${d.last_id || 0}:${d.n}:${d.pend || ""}`;
    if (pulseKey === null || pulseEv !== EV) { pulseKey = key; pulseEv = EV; return; }
    if (key === pulseKey) return;
    const prevN = +pulseKey.split(":")[2] || 0; pulseKey = key;
    const ref = myPassRef(), wasPending = ref && ref.status === "pending_payment";
    await loadPass();
    if (wasPending && d.status === "active") {
      try { if (navigator.vibrate) navigator.vibrate([80, 50, 80]); } catch (e) { /* ignore */ }
      overlay({ k: "ok", icon: "check", title: "تم تفعيل جوازك 🎉", body: isOffers() ? "استلم المنظم الدفع وتفعّل جوازك الرقمي.<br>اعرض رمزك عند الأكشاك المشاركة لتحصل على عروضها." : "استلم المنظم الدفع وتفعّل جوازك الرقمي.<br>اعرض رمزك عند الأكشاك المشاركة لجمع الأختام.", auto: 7000, onClose: () => { if (S.tab === "pass" || S.tab === "home") render(); } });
      if (S.tab === "pass" || S.tab === "home") render();
      return;
    }
    if (S.pass && (S.pass.pending_rewards || []).length) askReward(S.pass.pending_rewards[0]);
    else if (d.n > prevN && S.pass && S.pass.last && S.pass.last.kind !== "reward") notifyStamp(S.pass.last);
    if (S.passFill) S.passFill();
  }
  let tickSig = null;
  async function ticketsTick() {
    let d; try { d = await A.urpc("tickets_pulse", { p_event: EV }); } catch (e) { return; }
    if (!d || !d.ok) return;
    if (tickSig === null) { tickSig = d.sig; return; }
    if (d.sig === tickSig) return;
    tickSig = d.sig;
    const before = Object.fromEntries((S.tickets || []).map((t) => [t.code, t]));
    await loadTickets();
    for (const t of S.tickets) {
      const o = before[t.code]; if (!o) continue;
      if (o.status === "pending_payment" && t.status === "active") {
        try { if (navigator.vibrate) navigator.vibrate([80, 50, 80]); } catch (e) { /* ignore */ }
        overlay({ k: "ok", icon: "b:ticket", title: "تم تفعيل تذكرتك 🎟️", body: `<b>${esc(t.game)}</b> · ${tktCount(t.qty)}<br>اعرض الرمز لمشغّل اللعبة عند الدخول.`, auto: 7000 }); break;
      }
      if (t.used > o.used) {
        try { if (navigator.vibrate) navigator.vibrate(70); } catch (e) { /* ignore */ }
        overlay({ k: "ok", icon: "check", title: "استمتع باللعبة! 🎉", body: `<b>${esc(t.game)}</b> · دخل ${t.used - o.used}${t.qty - t.used ? `<br>المتبقي: ${t.qty - t.used}` : "<br>استُخدمت التذكرة بالكامل"}`, auto: 6000 }); break;
      }
    }
    if (S.sub && S.sub.name === "tickets") render();
  }
  /* الزائر يؤكد استلام المكافأة: نعم ← تُحسب (وتبدأ بطاقة جديدة إن كانت الأخيرة)، لا ← يخبر مزود الخدمة */
  let askingReward = 0;
  function askReward(r) {
    if (!r || askingReward === r.id || ($("#ovl") && $("#ovl .r-alert"))) return;
    askingReward = r.id;
    try { if (navigator.vibrate) navigator.vibrate([80, 50, 80, 50, 120]); } catch (e) { /* ignore */ }
    overlay({ k: "gold", icon: "gift", title: `هل حصلت على ${r.reward}؟`, body: `من <b>${esc(r.stall)}</b><br><span class="sub">أكّد بعد ما يطبّق مزود الخدمة ${isOffers() ? "العرض" : "المكافأة"} على طلبك.</span>`,
      extra: `<div class="row" style="gap:8px;width:100%"><button class="btn btn-cta btn-sm" style="flex:1" data-a="reward-yes" data-id="${r.id}">نعم، حصلت عليها</button><button class="btn btn-line btn-sm" style="flex:1" data-a="reward-no" data-id="${r.id}">لا</button></div>`,
      onClose: () => { askingReward = 0; } });
  }
  function notifyStamp(L) {
    const st = esc(L.stall), pos = L.position || 0, req = L.required || 0, logo = logoTile({ name: L.stall, logo: L.logo }, 64);
    let k = "ok", t, b;
    if (L.kind === "reward") {
      k = "gold"; t = `مبروك! حصلت على ${L.reward} 🎁`;
      b = pos >= (L.cycle || 0) ? `من ${st}. اكتملت بطاقة ولائك، وتبدأ بطاقة جديدة في زيارتك القادمة.` : `من ${st}. وفي زيارتك القادمة: <b>${esc(L.reward2 || "")}</b>`;
    } else if (pos === req) {
      k = "gold"; t = "مبروك! أكملت الأختام 🎉";
      b = `في ${st}: زيارتك القادمة تمنحك <b>${esc(L.reward1 || "")}</b>`;
    } else {
      const left = req - pos;
      t = "تمت إضافة ختم ✓";
      b = `${st}: ختم ${pos} من ${req}<br>${left === 1 ? "بقي ختم واحد" : left === 2 ? "بقي ختمان" : `بقيت ${left} أختام`} ثم <b>${esc(L.reward1 || "")}</b>`;
    }
    try { if (navigator.vibrate) navigator.vibrate(k === "gold" ? [80, 50, 80, 50, 120] : 70); } catch (e) { /* ignore */ }
    overlay({ k, title: t, body: b, auto: k === "gold" ? 9000 : 6000, logo: `<span class="ovl-logo">${logo}</span>` });
  }

  /* ---------------- الماسح (مشترك: الكشك والمنظم) ---------------- */
  /* قراءة واحدة لكل فتح للكاميرا: أول قراءة صحيحة توقف الكاميرا فورًا وتظهر النتيجة في نافذة واضحة */
  let scanner = null, scanBusy = false, scanLock = false, lastScan = { code: "", at: 0 }, onScan = null, onBand = null, onTicket = null;
  async function stopScanner() {
    const sc = scanner; scanner = null;
    if (sc) {
      try { if (sc.isScanning) await sc.stop(); } catch (e) { /* ignore */ }
      try { sc.clear(); } catch (e) { /* ignore */ }
    }
    const r = $("#reader"), b = $("#scanBtn");
    if (r) { r.hidden = true; r.innerHTML = ""; }
    if (b) { b.querySelector("b").textContent = b.dataset.label; b.classList.remove("on"); }
  }
  async function toggleScan() {
    if (scanBusy) return;
    if (scanner) return stopScanner();
    const r = $("#reader"), b = $("#scanBtn"); if (!r || !b) return;
    if (!window.Html5Qrcode) return toast("تعذّر تحميل قارئ الكاميرا — أدخل الرمز يدويًا.", "err");
    scanBusy = true; scanLock = false; r.hidden = false;
    try {
      const L = window.__Html5QrcodeLibrary__ || {}, F = window.Html5QrcodeSupportedFormats || L.Html5QrcodeSupportedFormats;
      const cfg = { verbose: false, experimentalFeatures: { useBarCodeDetectorIfSupported: true } };
      if (F) cfg.formatsToSupport = [F.QR_CODE];
      scanner = new window.Html5Qrcode("reader", cfg);
      await scanner.start({ facingMode: "environment" },
        { fps: 15, aspectRatio: 1, disableFlip: true, qrbox: (w, h) => { const m = Math.max(180, Math.floor(Math.min(w, h) * 0.78)); return { width: m, height: m }; } },
        onDecode, () => {});
      b.querySelector("b").textContent = "إيقاف الكاميرا"; b.classList.add("on");
      r.scrollIntoView({ block: "center", behavior: "smooth" });
    } catch (e) {
      await stopScanner();
      toast("لم نتمكن من فتح الكاميرا. اسمح للمتصفح باستخدامها أو أدخل الرمز يدويًا.", "err");
    } finally { scanBusy = false; }
  }
  function onDecode(text) {
    if (scanLock) return;            // تجاهل القراءات المتكررة لنفس الإطار
    scanLock = true;
    try { if (navigator.vibrate) navigator.vibrate(40); } catch (e) { /* ignore */ }
    stopScanner();
    scanned(text, true);
  }
  function scanned(raw, fromCam) {
    const txt = String(raw || "").trim();
    const bm = txt.match(/[?&]band=([A-Za-z0-9]{10})/) || (/^[A-Za-z0-9]{10}$/.test(txt) ? [0, txt] : null);
    if (bm) {
      const bc = bm[1].toUpperCase();
      if (!onBand) return showRes("warn", "b:band", "هذا سوار أمان طفل", "اصطحب الطفل إلى منصة المنظمين أو أبلغ فريق التنظيم ليمسحه ويُبلغ ولي أمره.", fromCam ? scanNextBtn() : "", 9000);
      if (onScan) overlay({ k: "wait", icon: "scan", title: "جارٍ إبلاغ ولي الأمر…", body: "" });
      return onBand(bc);
    }
    const tm = txt.match(/^SHURFA-T:([A-Za-z0-9]{8})$/i) || (/^[A-Za-z0-9]{8}$/.test(txt) ? [0, txt] : null);
    if (tm) {
      const tc = tm[1].toUpperCase();
      if (!onTicket) return showRes("warn", "b:ticket", "هذه تذكرة لعبة", "تذاكر الألعاب يمسحها <b>مشغّل اللعبة</b> عند الدخول.", fromCam ? scanNextBtn() : "", 7000);
      overlay({ k: "wait", icon: "scan", title: "جارٍ التحقق…", body: `التذكرة <b dir="ltr">${esc(tc)}</b>` });
      return onTicket(tc);
    }
    const code = txt.replace(/^SHURFA:/i, "").toUpperCase();
    if (!/^[A-Z0-9]{7}$/.test(code)) return showRes("err", "x", "رمز غير صالح", "هذا ليس رمز جواز شُرفة. اطلب من الزائر فتح «جوازي» وعرض الرمز.", fromCam ? scanNextBtn() : "", 6000);
    if (code === lastScan.code && Date.now() - lastScan.at < 2500) return;
    lastScan = { code, at: Date.now() };
    if (onScan && !S.work.busy) { overlay({ k: "wait", icon: "scan", title: "جارٍ التحقق…", body: `الرمز <b dir="ltr">${esc(code)}</b>` }); onScan(code); }
  }
  const scanNextBtn = () => `<button class="btn btn-line" data-a="scan-next">${ic("scan", 18)} امسح التالي</button>`;

  /* نافذة النتيجة (تظهر فوق كل شيء ثم تُغلق تلقائيًا وتعيد المستخدم لصفحته) */
  let ovT = null, ovOnClose = null;
  function overlay({ k = "ok", icon = "check", title = "", body = "", extra = "", auto = 0, onClose = null, logo = "" }) {
    clearTimeout(ovT); const old = $("#ovl"); if (old) old.remove();
    const el = document.createElement("div");
    el.className = "ovl"; el.id = "ovl"; el.setAttribute("role", "alertdialog"); el.setAttribute("aria-modal", "true"); el.setAttribute("aria-labelledby", "ovlT");
    el.innerHTML = `<div class="ovl-card r-${k}">${logo || `<span class="big">${k === "wait" ? '<span class="spin"></span>' : /^b:/.test(icon) ? bi(icon.slice(2)) : ic(icon, 40, 2.4)}</span>`}
      <h3 id="ovlT">${esc(title)}</h3>${body ? `<div class="ovl-body">${body}</div>` : ""}
      ${extra ? `<div class="ovl-acts">${extra}</div>` : ""}
      ${k === "wait" ? "" : `<button class="btn btn-dark" data-a="ovl-close">${auto ? "تم" : "إغلاق"}</button>`}
      ${auto ? `<span class="ovl-bar" style="animation-duration:${auto}ms"></span>` : ""}</div>`;
    document.body.appendChild(el);
    ovOnClose = onClose;
    if (auto) ovT = setTimeout(() => closeOverlay(), auto);
    const f = el.querySelector("[data-a=ovl-close]"); if (f) setTimeout(() => { try { f.focus({ preventScroll: true }); } catch (e) { /* ignore */ } }, 30);
  }
  function closeOverlay(fire = true) {
    clearTimeout(ovT); const el = $("#ovl"); if (el) el.remove();
    const f = ovOnClose; ovOnClose = null; if (fire && f) f();
  }
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && $("#ovl") && !$("#ovl .r-wait")) closeOverlay(); });
  const scanUI = (label, sub) => `<div id="reader" hidden></div>
    <button class="otile" data-a="scan-toggle" id="scanBtn" data-label="${esc(label)}"><span class="ico-tile" style="background:rgba(250,246,240,.14);color:var(--cream)">${ic("scan", 26)}</span><span class="grow"><b style="font-size:18px">${esc(label)}</b><span style="display:block;font-size:12.5px;opacity:.85">${esc(sub)}</span></span></button>
    <form class="manual" data-f="manual"><input class="input" id="manualCode" maxlength="10" placeholder="أو أدخل الرمز" aria-label="رمز الجواز" autocomplete="off"><button class="btn btn-dark btn-sm" type="submit">تحقق</button></form>
    <div id="scanRes"></div>`;
  function showRes(k, icon, title, body, extra = "", auto = 0, onClose = null) {
    overlay({ k, icon, title, body, extra, auto, onClose });
    return "";
  }

  /* ---------------- عملي: الكشك + المنظم ---------------- */
  function renderWork() {
    const W = S.work;
    const modes = [isStaff() && ["stall", "كشكي"], isOrg() && ["org", "اعتماد الجوازات"], isOperator() && ["game", "لعبتي"]].filter(Boolean);
    if (!modes.some((m) => m[0] === W.mode)) W.mode = modes[0][0];
    const sw = modes.length > 1 ? `<div class="seg" role="group" aria-label="الواجهة" style="background:rgba(250,246,240,.12)">
      ${modes.map(([k, l]) => `<button data-a="work-mode" data-k="${k}" aria-pressed="${W.mode === k}">${l}</button>`).join("")}</div>` : "";
    if (W.mode === "org") return renderOrg(sw);
    if (W.mode === "game") return renderOperator(sw);

    const ok = approvedStalls();
    if (!ok.length) {
      const st = staffStalls()[0] || {};
      const rejected = st.status === "rejected";
      scr.innerHTML = `<div class="ohead">${sw}<div><div style="font-size:12.5px;opacity:.85">واجهة الشريك</div><h2>${esc(st.name || "كشكي")}</h2></div></div>
        <div class="pad stack" style="padding-top:16px">
          <div class="result ${rejected ? "r-err" : "r-warn"}"><span class="big">${ic(rejected ? "x" : "clock", 30, 2.4)}</span><h3>${rejected ? "لم يُعتمد الطلب" : "طلبك قيد المراجعة"}</h3>
            <span class="sub" style="color:var(--ink)">${rejected ? "راجع ملاحظة المنظم وعدّل بياناتك ثم أعد الإرسال." : `سيراجع فريق شُرفة بياناتك ${isOffers(st.event) ? "وعرضك" : "وبطاقة الولاء"}. بعد الاعتماد تظهر هنا أداة مسح جوازات الزوار.`}</span></div>
          <button class="btn btn-line" data-a="sub" data-name="partner">${ic("edit", 18)} ${isOffers(st.event) ? "بياناتي وعرضي" : "بياناتي وبطاقة الولاء"}</button>
        </div>`;
      return;
    }
    if (!W.stall || !ok.find((s) => s.id === W.stall)) W.stall = ((A.local.get("work-stall") && ok.find((s) => s.id === A.local.get("work-stall"))) || ok[0]).id;
    const s = ok.find((x) => x.id === W.stall), OF = isOffers(s.event);
    onScan = addVisit;
    scr.innerHTML = `<div class="ohead">${sw}
        <div class="between"><div><div style="font-size:12.5px;opacity:.85">${s.role === "manager" ? "مدير الكشك" : "موظف الكشك"} · ${esc(firstName(myName()))}</div><h2>${esc(s.name)}</h2></div><span class="row" style="gap:6px;font-size:12px"><span style="width:9px;height:9px;border-radius:5px;background:#5BD6A8;display:inline-block"></span>متصل</span></div>
        ${ok.length > 1 ? `<select data-c="work-stall" aria-label="الكشك">${ok.map((x) => `<option value="${esc(x.id)}" ${x.id === s.id ? "selected" : ""}>${esc(x.name)}</option>`).join("")}</select>` : ""}
        <span style="font-size:13px;opacity:.9">${OF ? "عرضك لحاملي الجواز: " + esc(s.reward1) : "بطاقة الولاء: " + esc(A.offerText(s))}</span>
      </div>
      <div class="pad stack" style="padding-top:16px">
        ${OF && s.kind === "games" ? `<div class="msg info">الألعاب خارج خصومات الجواز. زوار شُرفة يحجزون تذكرتك من «تذاكر الألعاب»، وتنمسح التذكرة من واجهة «لعبتي».</div>` : ""}
        ${OF && s.kind !== "games" ? `<div class="card flat row" style="gap:10px">${ic("scan", 20)}<span class="grow sub" style="color:var(--ink)">امسح جواز الزائر، وبعدها اختر: <b>خصم الكشك</b> أو <b>منتج من باقته</b>.</span></div>` : ""}
        ${scanUI("امسح جواز الزائر", "بالكاميرا الخلفية")}
        <h3 class="sec-t">اليوم في ${esc(s.name)}</h3>
        <div class="kpis3" id="stKpis"><div><b>–</b><span>${OF ? "عروض اليوم" : "زيارات اليوم"}</span></div><div><b>–</b><span>${OF ? "مؤكدة من الزوار" : "مكافآت اليوم"}</span></div><div><b>–</b><span>زوار الكشك</span></div></div>
        ${OF ? `<div class="card stack" id="stPool" style="gap:10px;border:1.5px solid var(--gold)"><div class="skel" style="height:80px"></div></div>` : ""}
        <div class="between"><h3 class="sec-t">آخر العمليات</h3><button class="linkbtn" data-a="work-refresh">تحديث</button></div>
        <div class="card" style="padding:4px 16px" id="stRecent"><div class="li sub">…</div></div>
        ${s.role === "manager" ? `<button class="btn btn-line" data-a="sub" data-name="partner">${ic("edit", 18)} ${OF ? "بيانات الشريك والعرض" : "بيانات الشريك وبطاقة الولاء"}</button>` : ""}
      </div>`;
    loadStaffStats();
    refreshT = setInterval(() => { if (document.visibilityState === "visible") loadStaffStats(); }, 20000);
  }


  async function loadStaffStats() {
    try {
      const OF = isOffers(stallEv(S.work.stall));
      const [d, pl] = await Promise.all([A.urpc("staff_stats", { p_stall: S.work.stall }), OF ? A.urpc("staff_pool", { p_stall: S.work.stall }).catch(() => null) : null]);
      const k = $("#stKpis"); if (!k) return;
      k.innerHTML = `<div><b class="num">${d.today_visits}</b><span>${OF ? "عروض اليوم" : "زيارات اليوم"}</span></div><div><b class="num">${OF ? (pl && pl.ok ? pl.confirmed : "–") : d.today_rewards}</b><span>${OF ? "مؤكدة من الزوار" : "مكافآت اليوم"}</span></div><div><b class="num">${d.visitors}</b><span>زوار الكشك</span></div>`;
      const pb = $("#stPool");
      if (pb && pl && pl.ok) pb.innerHTML = `<div class="between"><b>${ic("gift", 18)} نصيبك من صندوق الجواز</b><span class="st st-warn">تقديري</span></div>
        <div class="kpis3" style="margin:0"><div><b class="num">${pl.visits}</b><span>زياراتك</span></div><div><b class="num">${pl.rank ? "#" + pl.rank : "–"}</b><span>ترتيبك من ${pl.stalls}</span></div><div><b class="num" style="font-size:17px">${fmtMoney(pl.amount_baisa)}</b><span>نصيبك حتى الآن</span></div></div>
        <span class="sub">الصندوق ${pl.pool_pct}% من مبيعات الجواز (${pl.passes} جواز = ${fmtMoney(pl.pool_baisa)}). نصيبك = زياراتك ${pl.visits} ÷ مجموع الزيارات ${pl.total_visits}${pl.total_visits ? ` (${pl.share_pct}%)` : ""}. يتغير الرقم حتى نهاية الفعالية.</span>`;
      $("#stRecent").innerHTML = d.recent.length ? d.recent.map((r) => `<div class="li"><span class="ico-tile" style="width:36px;height:36px;${r.kind === "reward" ? "background:var(--gold-soft);color:var(--gold-ink)" : "background:var(--ok-soft);color:var(--ok)"}">${ic(r.kind === "reward" ? "gift" : "check", 18, 2)}</span><div class="grow"><b style="font-size:14px">${esc(r.visitor)}</b><div class="sub">${r.kind === "reward" ? (OF ? "عرض: " : "مكافأة: ") + esc(r.reward) : "ختم زيارة"}</div></div><span class="sub">${esc(time(r.at))}</span></div>`).join("")
        : `<div class="li sub">لا توجد عمليات بعد.</div>`;
    } catch (e) { if (e.code === "not_signed_in") signedOut(); }
  }

  const waitConfirm = `<span id="rwState" class="row" style="gap:8px;justify-content:center;margin-top:6px"><span class="spin" style="border-color:rgba(122,79,0,.25);border-top-color:var(--gold-ink);width:18px;height:18px;border-width:2.5px"></span> بانتظار تأكيد الزائر من جواله…</span>`;
  function scanErr(e) {
    const d = e.data || {};
    if (e.code === "offer_used") showRes("warn", "gift", "الزائر استخدم خصمك مسبقًا", `${esc(d.visitor || "الزائر")} حصل على <b>${esc(d.reward || "الخصم")}</b>${d.used_at ? " " + esc(dayTime(d.used_at)) : ""}.<br>خصم الكشك يُستخدم مرة واحدة لكل زائر.`, scanNextBtn(), 8000);
    else if (e.code === "item_redeemed") showRes("warn", "check", "المنتج مُسلَّم مسبقًا", "هذا المنتج من الباقة استلمه الزائر من قبل.", scanNextBtn(), 7000);
    else if (e.code === "cooldown") showRes("warn", "clock", "أُضيف ختم قبل قليل", `${esc(d.visitor || "")} — يمكن إضافة ختم جديد ${d.retry_at ? "بعد " + esc(time(d.retry_at)) : "لاحقًا"}`, scanNextBtn(), 7000);
    else if (e.code === "pass_not_paid") showRes("warn", "lock", "الجواز غير مفعّل", `${esc(d.visitor || "الزائر")} لم يُكمل الدفع بعد. وجّهه إلى منصة المنظمين.`, scanNextBtn(), 8000);
    else showRes("err", "x", "لم تتم العملية", esc(errMsg(e)), scanNextBtn(), 7000);
  }
  // جواز الفعالية: قراءة الجواز أولًا (بدون تسجيل)، ثم يختار الكشك: خصمه أو منتج من باقة الزائر
  async function stallLookup(code) {
    S.work.busy = true;
    try {
      const d = await A.urpc("staff_lookup", { p_stall: S.work.stall, p_code: code });
      S.work.last = code;
      const dc = d.discount || {}, lines = d.lines || [];
      const discRow = dc.state === "used"
        ? `<div class="lk-row is-done">${ic("check", 18)}<span class="grow">استخدم خصمك${dc.used_at ? " · " + esc(dayTime(dc.used_at)) : ""}</span></div>`
        : `<button class="lk-row" data-a="lk-disc">${ic("gift", 18)}<span class="grow"><b>طبّق خصم الكشك</b><span class="sub" style="display:block">${esc(dc.label || "")}${dc.state === "pending" ? " · بانتظار تأكيده" : ""}</span></span>${ic("fwd", 16, 2)}</button>`;
      const lineRows = lines.map((l) => l.state === "done"
        ? `<div class="lk-row is-done">${ic("check", 18)}<span class="grow">${esc(l.item)}${l.qty > 1 ? " ×" + l.qty : ""}<span class="sub" style="display:block">${esc(l.package)} · تم التسليم</span></span></div>`
        : `<button class="lk-row" data-a="lk-line" data-id="${esc(l.id)}">${ic("grid", 18)}<span class="grow"><b>سلّم: ${esc(l.item)}${l.qty > 1 ? " ×" + l.qty : ""}</b><span class="sub" style="display:block">${esc(l.package)} · يدفع لك ${omr(l.after * l.qty)}${l.state === "pending" ? " · بانتظار تأكيده" : ""}</span></span>${ic("fwd", 16, 2)}</button>`).join("");
      showRes("gold", "user", `جواز ${d.visitor}`, `<div class="lk-list">${lineRows ? `<span class="lk-h">من باقاته عندك</span>${lineRows}` : ""}<span class="lk-h">خصم الكشك</span>${discRow}</div>`, scanNextBtn());
    } catch (e) { scanErr(e); }
    finally { S.work.busy = false; }
  }
  function offerResult(d) {
    try { if (navigator.vibrate) navigator.vibrate([80, 60, 80]); } catch (e) { /* ignore */ }
    const acts = scanNextBtn() + `<button class="linkbtn" data-a="undo" style="color:var(--err)">${ic("undo", 16)} تراجع عن هذه العملية</button>`;
    if (d.package) showRes("gold", "gift", "سلّم من الباقة", `سلّم <b>${esc(d.reward)}</b> لـ <b>${esc(d.visitor)}</b>.<br>الزائر يدفع لك <b>${omr(d.pay)}</b>.<br>${waitConfirm}`, acts);
    else showRes("gold", "gift", "طبّق خصم الكشك", `طبّق <b>${esc(d.reward)}</b> على طلب <b>${esc(d.visitor)}</b>.<br>${waitConfirm}`, acts);
    watchReward(d.id, d.reward, false, true);
    loadStaffStats();
  }
  async function addVisit(code) {
    if (S.work.busy) return;
    const cur = approvedStalls().find((x) => x.id === S.work.stall) || {};
    if (isOffers(stallEv(S.work.stall)) && cur.kind !== "games") return stallLookup(code);
    S.work.busy = true;
    try {
      const d = await A.urpc("staff_scan", { p_stall: S.work.stall, p_code: code });
      S.work.last = code;
      try { if (navigator.vibrate) navigator.vibrate(d.kind === "reward" ? [80, 60, 80] : 60); } catch (e) { /* ignore */ }
      const acts = scanNextBtn() + `<button class="linkbtn" data-a="undo" style="color:var(--err)">${ic("undo", 16)} تراجع عن هذه العملية</button>`;
      const back = () => { const r = $("#scanRes"); if (r) r.innerHTML = ""; };
      if (d.offer) {
        showRes("gold", "gift", "طبّق عرض الجواز: " + d.reward,
          `طبّق <b>${esc(d.reward)}</b> على طلب <b>${esc(d.visitor)}</b>.<br><span id="rwState" class="row" style="gap:8px;justify-content:center;margin-top:6px"><span class="spin" style="border-color:rgba(122,79,0,.25);border-top-color:var(--gold-ink);width:18px;height:18px;border-width:2.5px"></span> بانتظار تأكيد الزائر من جواله…</span>`, acts);
        watchReward(d.id, d.reward, false, true);
      } else if (d.kind === "reward") {
        showRes("gold", "gift", "مكافأة الزائر: " + d.reward,
          `طبّق <b>${esc(d.reward)}</b> على طلب <b>${esc(d.visitor)}</b>.<br><span id="rwState" class="row" style="gap:8px;justify-content:center;margin-top:6px"><span class="spin" style="border-color:rgba(122,79,0,.25);border-top-color:var(--gold-ink);width:18px;height:18px;border-width:2.5px"></span> بانتظار تأكيد الزائر من جواله…</span>`, acts);
        watchReward(d.id, d.reward, d.final);
      } else {
        showRes("ok", "check", "تمت إضافة الختم",
          `الزائر <b>${esc(d.visitor)}</b> · ختم ${d.position} من ${d.required}${d.next_reward ? `<br>اكتملت أختامه! زيارته القادمة: <b>${esc(d.next_reward)}</b>` : ""}<br><span class="sub">وصل للزائر إشعار بالختم.</span>`, acts, 6000, back);
      }
      loadStaffStats();
    } catch (e) {
      const d = e.data || {};
      if (e.code === "offer_used") showRes("warn", "gift", "الزائر استخدم عرضك مسبقًا", `${esc(d.visitor || "الزائر")} حصل على <b>${esc(d.reward || "العرض")}</b>${d.used_at ? " " + esc(dayTime(d.used_at)) : ""}.<br>عرض الجواز يُستخدم مرة واحدة لكل زائر، فما تنحسب زيارة جديدة.`, scanNextBtn(), 8000);
      else if (e.code === "cooldown") showRes("warn", "clock", "أُضيف ختم قبل قليل", `${esc(d.visitor || "")} — يمكن إضافة ختم جديد ${d.retry_at ? "بعد " + esc(time(d.retry_at)) : "لاحقًا"}`, scanNextBtn(), 7000);
      else if (e.code === "pass_not_paid") showRes("warn", "lock", "الجواز غير مفعّل", `${esc(d.visitor || "الزائر")} لم يُكمل الدفع بعد. وجّهه إلى منصة المنظمين.`, scanNextBtn(), 8000);
      else showRes("err", "x", "لم تتم الإضافة", esc(errMsg(e)), scanNextBtn(), 7000);
    } finally { S.work.busy = false; }
  }

  /* ---------- المنظم: اعتماد الجوازات لفعاليته فقط ---------- */
  const orgEv = () => {
    const list = orgEvents();
    if (!S.work.orgEvent || !list.find((e) => e.id === S.work.orgEvent)) S.work.orgEvent = (list.find((e) => e.id === EV) || list[0] || {}).id;
    return S.work.orgEvent;
  };
  async function renderOrg(sw) {
    const list = orgEvents(), id = orgEv(), ev = list.find((e) => e.id === id) || {};
    onScan = orgLookup; onBand = orgBand;
    scr.innerHTML = `<div class="ohead">${sw}
        <div><div style="font-size:12.5px;opacity:.85">منظم · ${esc(firstName(myName()))}</div><h2>${esc((ev.name || "").split("—")[0].trim())}</h2></div>
        ${list.length > 1 ? `<select data-c="org-event" aria-label="الفعالية">${list.map((e) => `<option value="${esc(e.id)}" ${e.id === id ? "selected" : ""}>${esc(e.name)}</option>`).join("")}</select>` : ""}
        <span style="font-size:13px;opacity:.9">امسح جواز الزائر بعد استلام المبلغ لتفعيله، أو سوار الطفل لإبلاغ ولي أمره.</span></div>
      <div class="pad stack" style="padding-top:16px">
        ${scanUI("امسح الجواز أو السوار", "تفعيل الجواز · سوار أمان الطفل")}
        <label class="card flat row" style="gap:10px;padding:10px 14px">${bi("pin")}<span class="grow"><span class="sub" style="display:block">نقطة التنظيم (تظهر لولي الأمر)</span><input class="input" data-c="org-point" value="${esc(orgPoint())}" maxlength="60" style="min-height:40px;margin-top:4px"></span></label>
        <div class="kpis3" id="orgAct" style="grid-template-columns:1fr 1fr"><div><b>–</b><span>فعّلتها اليوم</span></div><div><b>–</b><span>المجموع</span></div></div>
      </div>`;
    loadOrgActivity();
  }
  async function loadOrgActivity() {
    try {
      const d = await A.urpc("org_my_activity", { p_event: orgEv() });
      const el = $("#orgAct"); if (el) el.innerHTML = `<div><b class="num">${d.today}</b><span>فعّلتها اليوم</span></div><div><b class="num">${d.total}</b><span>المجموع</span></div>`;
    } catch (e) { /* ignore */ }
  }

  /* ---------- إدارة شُرفة: لكل فعالية على حدة ---------- */
  const adminEv = () => S.adminEv || EV;
  function renderAdmin() {
    const t = S.adminTab || "content", evs = allEvents(), cur = adminEv();
    scr.innerHTML = `<div class="ohead" style="background:linear-gradient(150deg,#5F4486,#7B5BA7)"><div class="between"><div><div style="font-size:12.5px;opacity:.85">إدارة شُرفة</div><h2>${esc(((evById(cur) || {}).name || cur).split("—")[0].trim())}</h2></div></div>
        <div class="chips">${evs.map((e) => `<button data-a="admin-ev" data-id="${esc(e.id)}" aria-pressed="${e.id === cur}"${e.visible ? "" : ' style="opacity:.65"'}>${e.visible ? "" : ic("lock", 14) + " "}${esc(e.name.split("—")[0].trim())}${e.visible ? "" : " · مخفية"}</button>`).join("")}<button data-a="admin-new-ev">+ فعالية</button></div>
        <div class="seg" role="group" aria-label="الأقسام" style="background:rgba(250,246,240,.14)">${[["content", "المحتوى"], ["games", "الألعاب"], ["packages", "الباقات"], ["orgs", "المنظمون"], ["partners", "الشركاء"], ["stats", "المؤشرات"], ["security", "الأمان"]].map(([k, l]) => `<button data-a="admin-tab" data-k="${k}" aria-pressed="${t === k}">${l}</button>`).join("")}</div></div>
      <div class="pad stack wrap-md" style="padding-top:16px" id="pfBody"><div class="skel"></div><div class="skel"></div></div><div class="sp"></div>`;
    if (t === "content") renderEventForm(S.newEvent ? null : cur);
    else if (t === "orgs") loadPlatform();
    else if (t === "partners") loadAdminPartners();
    else if (t === "games") loadGamesAdmin(cur);
    else if (t === "packages") loadPackagesAdmin(cur);
    else if (t === "security") loadSecurity();
    else loadAdminStats();
  }
  const media = {};
  function renderEventForm(id) {
    const el = $("#pfBody"); if (!el) return;
    const e = id ? (evById(id) || {}) : { status: "soon", db: {} }, x = e.db || {};
    media.image = x.image || null; media.logo = x.logo || null;
    const prev = (k, u) => u ? `<img src="${esc(img(u))}" alt="" style="width:100%;height:100%;object-fit:cover">` : `<span class="sub">${k === "image" ? "صورة الغلاف" : "الشعار"}</span>`;
    el.innerHTML = `<form class="stack" data-f="event" novalidate>
      ${id ? "" : `<div class="msg info">فعالية جديدة: اختر معرّفًا قصيرًا بالإنجليزية (مثل: winter-fest-2026). لا يمكن تغييره لاحقًا.</div>
        <div class="field"><label for="ev-id">المعرّف</label><input class="input" id="ev-id" name="id" dir="ltr" maxlength="40" placeholder="my-event-2026" required></div>`}
      <div class="card stack" style="gap:10px;${e.visible === false ? "border:1.5px solid var(--err)" : ""}"><b>ظهور الفعالية</b>
        <label class="check"><input type="checkbox" name="visible" ${e.visible === false ? "" : "checked"}> <span>إظهار الفعالية في شُرفة للزوار والشركاء</span></label>
        <span class="sub">عند الإخفاء تختفي الفعالية من التطبيق، ويتوقف بيع الجواز وتسجيل الشركاء. لا يُحذف شيء: الجوازات والأختام والشركاء والإحصاءات تبقى محفوظة، وتقدر ترجّعها في أي وقت.</span></div>
      <div class="card stack" style="gap:12px"><b>المحتوى الظاهر للزوار</b>
        <div class="field"><label for="ev-name">اسم الفعالية</label><input class="input" id="ev-name" name="name" maxlength="80" value="${esc(x.name || e.name || "")}" required></div>
        <div class="field"><label for="ev-sum">نبذة</label><textarea class="input" id="ev-sum" name="summary" maxlength="400" rows="3" style="height:auto;padding:10px 14px">${esc(x.summary || e.summary || "")}</textarea></div>
        <div class="grid2">
          <div class="field"><label for="ev-date">التاريخ</label><input class="input" id="ev-date" name="date" maxlength="80" placeholder="15 – 17 نوفمبر 2026" value="${esc(x.date || e.date || "")}"></div>
          <div class="field"><label for="ev-hours">الأوقات</label><input class="input" id="ev-hours" name="hours" maxlength="80" placeholder="من 4 إلى 9 مساءً" value="${esc(x.hours || "")}"></div>
        </div>
        <div class="field"><label for="ev-loc">المكان</label><input class="input" id="ev-loc" name="location" maxlength="120" value="${esc(x.location || e.location || "")}"></div>
        <div class="field"><label for="ev-st">حالة الفعالية</label><select class="input" id="ev-st" name="status">${[["soon", "قريبًا"], ["available", "متاحة"], ["ended", "انتهت"]].map(([k, l]) => `<option value="${k}" ${(x.status || e.status) === k ? "selected" : ""}>${l}</option>`).join("")}</select></div>
        <div class="grid2">
          <div class="field"><span>صورة الغلاف</span><label class="media-box" style="aspect-ratio:16/9">${prev("image", media.image || e.image)}<input type="file" accept="image/png,image/jpeg,image/webp" data-c="ev-media" data-k="image" hidden></label></div>
          <div class="field"><span>الشعار</span><label class="media-box" style="aspect-ratio:1/1;max-width:9rem">${prev("logo", media.logo || e.logo)}<input type="file" accept="image/png,image/jpeg,image/webp" data-c="ev-media" data-k="logo" hidden></label></div>
        </div>
        <div class="grid2">
          <div class="field"><label for="ev-c1">لون الهوية 1</label><input class="input" id="ev-c1" name="color_from" type="color" value="${esc(x.color_from || (e.colors || {}).from || "#1A2E28")}" style="padding:4px"></div>
          <div class="field"><label for="ev-c2">لون الهوية 2</label><input class="input" id="ev-c2" name="color_to" type="color" value="${esc(x.color_to || (e.colors || {}).to || "#2E5148")}" style="padding:4px"></div>
        </div>
        <div class="field"><label for="ev-sort">ترتيب الظهور</label><input class="input" id="ev-sort" name="sort" type="number" min="0" max="999" value="${esc(x.sort != null ? x.sort : 100)}"></div>
      </div>
      <div class="card stack" style="gap:12px"><b>الجواز الرقمي والشركاء</b>
        <label class="check"><input type="checkbox" name="active" ${x.active ? "checked" : ""}> <span>بيع الجواز الرقمي مفتوح لهذه الفعالية</span></label>
        <div class="grid2">
          <div class="field"><label for="ev-price">سعر الجواز (بيسة)</label><input class="input" id="ev-price" name="price" type="number" min="0" max="100000" step="50" value="${esc(x.price_baisa != null ? x.price_baisa : 1000)}"><span class="sub">1000 بيسة = 1 ريال</span></div>
          <div class="field"><label for="ev-pay">تعليمات الدفع للزائر</label><input class="input" id="ev-pay" name="pay_note" maxlength="300" value="${esc(x.pay_note || "")}"></div>
        </div>
        <label class="check"><input type="checkbox" name="partner_signup" ${x.partner_signup !== false ? "checked" : ""}> <span>تسجيل الشركاء مفتوح لهذه الفعالية</span></label>
      </div>
      <div class="card stack" style="gap:12px"><b>نوع الجواز</b>
        <label class="opt"><input type="radio" name="pass_mode" value="loyalty" ${x.pass_mode !== "offers" ? "checked" : ""}><span class="grow">بطاقات الولاء<span class="sub" style="display:block;font-weight:500">كل كشك له بطاقة أختام ومكافأة بعد عدد زيارات</span></span></label>
        <label class="opt"><input type="radio" name="pass_mode" value="offers" ${x.pass_mode === "offers" ? "checked" : ""}><span class="grow">جواز الفعالية (عروض + صندوق الشركاء)<span class="sub" style="display:block;font-weight:500">كل كشك عرض واحد يُستخدم مرة لكل زائر، وجزء من مبيعات الجواز يتوزع على الشركاء حسب زياراتهم</span></span></label>
        <div class="field"><label for="ev-pool">نسبة صندوق الشركاء من مبيعات الجواز (%)</label><input class="input" id="ev-pool" name="pool_pct" type="number" min="0" max="90" value="${esc(x.pool_pct != null ? x.pool_pct : 50)}"><span class="sub">تُستخدم في «جواز الفعالية» فقط. الباقي لشُرفة.</span></div>
      </div>
      <div id="evMsg"></div>
      <button class="btn btn-cta" type="submit">${id ? "حفظ المحتوى" : "إضافة الفعالية"}</button>
      ${id ? `<button type="button" class="btn btn-line" data-a="admin-preview">${ic("eye", 18)} معاينة كما يراها الزائر</button>` : ""}
    </form>`;
  }
  /* ---------- الإدارة: سجل الأمان ---------- */
  const AUDIT_AR = { admin_session: "دخول حساب إدارة", login_failed: "محاولة دخول خاطئة", rate_limited: "تجاوز حد الطلبات", insert: "إضافة", update: "تعديل", delete: "حذف",
    login: "تسجيل دخول", user_signedup: "حساب جديد", user_recovery_requested: "طلب استعادة كلمة المرور", user_updated_password: "تغيير كلمة المرور",
    user_modified: "تعديل الحساب", factor_in_progress: "بدء تفعيل التحقق بخطوتين", factor_verified: "تفعيل التحقق بخطوتين", factor_unenrolled: "إيقاف التحقق بخطوتين", user_deleted: "حذف حساب" };
  const TBL_AR = { events: "الفعاليات", stalls: "الأكشاك", partners: "الشركاء", organizers: "المنظمون", organizer_requests: "طلبات المنظمين", shurfa_admins: "مدراء شُرفة",
    stall_staff: "موظفو الأكشاك", games: "الألعاب", game_staff: "مشغّلو الألعاب", visitors: "الجوازات", game_tickets: "تذاكر الألعاب", auth: "الحساب", bands: "الأساور" };
  async function loadSecurity() {
    const box = $("#pfBody"); if (!box) return;
    let d;
    try { d = await A.urpc("admin_security_log", { p_limit: 120 }); } catch (e) { box.innerHTML = `<div class="msg err">${esc(errMsg(e))}</div>`; return; }
    const row = (at, title, sub, warn) => `<div class="li"><span class="ico-tile" style="width:34px;height:34px;${warn ? "background:var(--err-soft);color:var(--err)" : "background:var(--sand-2);color:var(--ink)"}">${ic(warn ? "lock" : "list", 16)}</span><div class="grow"><b style="font-size:14px">${title}</b><div class="sub" dir="auto">${sub}</div></div><span class="sub">${esc(dayTime(at))}</span></div>`;
    box.innerHTML = `${d.alerts.length ? `<div class="result r-err"><span class="big">${ic("lock", 26, 2.2)}</span><h3>تنبيه: محاولات دخول خاطئة متكررة</h3>
        <span class="sub" style="color:var(--ink)">${d.alerts.map((a) => `رقم ينتهي بـ <b dir="ltr">${esc(a.target)}</b>: ${a.fails} محاولات خلال الساعة`).join("<br>")}<br>بعد 5 محاولات يُوقف الدخول لهذا الرقم 15 دقيقة تلقائيًا.</span></div>`
        : `<div class="result r-ok"><span class="big">${ic("shield", 26, 2.2)}</span><h3>لا توجد تنبيهات</h3><span class="sub" style="color:var(--ink)">لا محاولات دخول خاطئة متكررة خلال الساعة الماضية.</span></div>`}
      <div class="kpis3" style="grid-template-columns:1fr 1fr"><div><b class="num">${d.blocked_now || 0}</b><span>موقوف الآن</span></div><div><b class="num">${d.alerts.length}</b><span>تنبيهات الساعة</span></div></div>
      <h3 class="sec-t">أحداث الحسابات (Supabase Auth)</h3>
      <div class="card" style="padding:4px 14px">${(d.auth || []).length ? d.auth.map((e) => row(e.at, esc(AUDIT_AR[e.action] || e.action), `<span dir="ltr">${esc(e.who || "")}</span>${e.ip ? ` · <span dir="ltr">${esc(e.ip)}</span>` : ""}`, /password|factor_unenrolled|deleted/.test(e.action))).join("") : '<div class="li sub">لا توجد أحداث.</div>'}</div>
      <h3 class="sec-t">سجل العمليات</h3>
      <div class="card" style="padding:4px 14px">${d.events.length ? d.events.map((e) => row(e.at, `${esc(AUDIT_AR[e.action] || e.action)} · ${esc(TBL_AR[e.tbl] || e.tbl || "")}`,
          `<span dir="ltr">${esc(e.actor || "زائر")}</span>${e.details ? ` · <span dir="ltr" style="font-size:11.5px">${esc(JSON.stringify(e.details).slice(0, 140))}</span>` : ""}`, /login_failed|rate_limited|delete/.test(e.action))).join("") : '<div class="li sub">لا توجد أحداث بعد.</div>'}</div>
      <p class="sub">كلمات المرور لا تُحفظ ولا تظهر في أي سجل. أرقام الهواتف تظهر مختصرة.</p>`;
  }
  const gameMedia = { image: null };
  /* ---------- إدارة شُرفة: تكوين باقات الفرد / العائلة / الربع من منتجات الأكشاك ---------- */
  const PK_KINDS = [["single", "باقة الفرد", "لشخص واحد"], ["family", "باقة العائلة", "لأربعة أشخاص"], ["friends", "باقة الربع", "للشلة"]];
  async function loadPackagesAdmin(ev) {
    const box = $("#pfBody"); if (!box) return;
    let d;
    try { d = await A.urpc("admin_list_packages", { p_event: ev }); } catch (e) { box.innerHTML = `<div class="msg err">${esc(errMsg(e))}</div>`; return; }
    const cat = d.catalog || [];
    if (!cat.length) { box.innerHTML = `<div class="empty card">${ic("grid", 36)}<b>ما فيه منتجات للباقات بعد</b><span>المنتجات تظهر هنا بعد ما يضيفها الشركاء في نموذج التسجيل وتعتمد أكشاكهم.</span></div>`; return; }
    box.innerHTML = `<p class="sub">كوّن كل باقة من منتجات الأكشاك المعتمدة. حط الكمية لكل منتج (0 = مو داخل الباقة). السعر يُحسب من أسعار الأكشاك داخل الباقات.</p>`
      + PK_KINDS.map(([k, n, hint]) => {
        const pk = (d.packages || []).find((x) => x.kind === k) || {}, q = Object.fromEntries((pk.items || []).map((x) => [x.item, x.qty]));
        return `<form class="card stack" data-f="pkg-admin" data-kind="${k}" style="gap:10px">
          <div class="between"><b style="font-size:17px">${n}</b><label class="check" style="margin:0"><input type="checkbox" name="active" ${pk.active === false ? "" : "checked"}> <span>ظاهرة للزوار</span></label></div>
          <div class="field"><label>اسم الباقة</label><input class="input" name="name" maxlength="40" value="${esc(pk.name || n)}"></div>
          <div class="field"><label>وصف قصير</label><input class="input" name="description" maxlength="160" placeholder="${hint}" value="${esc(pk.description || "")}"></div>
          <div class="card flat" style="padding:2px 12px">${cat.map((i) => `<div class="li"><div class="grow"><b style="font-size:14px">${esc(i.name)}</b><div class="sub">${esc(i.stall_name)} · ${esc(CAT[i.category] || "")} · <s>${omr(i.before)}</s> ${omr(i.after)}</div></div>
              <input class="input" name="q" data-item="${esc(i.id)}" data-b="${i.before}" data-a="${i.after}" type="number" min="0" max="10" value="${q[i.id] || 0}" style="width:64px;text-align:center" data-c="pk-adm" aria-label="كمية ${esc(i.name)}"></div>`).join("")}</div>
          <div class="between"><span class="sub pk-adm-t"></span><button class="btn btn-cta btn-sm" type="submit" style="width:auto;padding:0 18px;flex:none">حفظ</button></div>
        </form>`; }).join("");
    box.querySelectorAll("form[data-f=pkg-admin]").forEach(pkAdmTotal);
  }
  function pkAdmTotal(f) {
    let b = 0, a = 0, n = 0, st = new Set();
    f.querySelectorAll("input[name=q]").forEach((x) => { const q = Math.max(0, Math.min(10, parseInt(x.value || "0", 10) || 0)); if (q) { b += q * +x.dataset.b; a += q * +x.dataset.a; n++; } });
    const t = f.querySelector(".pk-adm-t"); if (t) t.innerHTML = n ? `${plural(n, "منتج واحد", "منتجين", "منتجات", "منتج")} · <s>${omr(b)}</s> <b style="color:var(--ink)">${omr(a)}</b> · وفّر ${savePct(b, a)}%` : "ما فيه منتجات";
  }
  async function loadGamesAdmin(ev) {
    const box = $("#pfBody"); if (!box) return;
    S.gameEv = ev;
    if (S.gameEdit) return renderGameForm(box);
    let list = [];
    try { list = await A.urpc("admin_list_games", { p_event: ev }); } catch (e) { box.innerHTML = `<div class="msg err">${esc(errMsg(e))}</div>`; return; }
    S.gamesAdmin = list;
    setTimeout(() => list.forEach((g) => loadGameStaff(g.id)), 0);
    box.innerHTML = `<div class="between"><b>ألعاب ${esc(((evById(ev) || {}).name || ev).split("—")[0].trim())}</b><button class="btn btn-cta btn-sm" data-a="game-new" style="width:auto;padding:0 16px">+ إضافة لعبة</button></div>
      <p class="sub">اللعبة المفعّلة تظهر مباشرة للزوار في صفحة «تذاكر الألعاب». تذاكر كل لعبة يمسحها <b>مشغّل اللعبة</b> (صاحبها أو الماسك لها)، وليس منظم المهرجان.</p>
      ${list.length ? list.map((g) => `<div class="card stack" style="gap:10px">
        <div class="row" style="gap:12px"><span class="ico-tile" style="width:56px;height:56px;border-radius:14px;overflow:hidden;background:var(--gold-soft);color:var(--gold-ink)">${g.image ? `<img src="${esc(img(g.image))}" alt="" style="width:100%;height:100%;object-fit:cover">` : bi("game")}</span>
          <div class="grow"><b>${esc(g.name)}</b><div class="sub">${fmtPrice(g.price_baisa)}${g.min_age ? ` · +${g.min_age} سنوات` : ""}${g.capacity ? ` · السعة ${g.capacity}` : " · بدون حد"}</div></div>
          ${g.active ? '<span class="st st-ok">مفعّلة</span>' : '<span class="st st-mute">متوقفة</span>'}</div>
        <div class="kpis3" style="grid-template-columns:repeat(4,1fr)"><div><b class="num">${g.sold}</b><span>محجوزة</span></div><div><b class="num">${g.paid}</b><span>مدفوعة</span></div><div><b class="num">${g.entered}</b><span>دخلوا</span></div><div><b class="num" style="font-size:15px">${g.revenue ? fmtPrice(g.revenue) : "0"}</b><span>الإيراد</span></div></div>
        <div class="card flat stack" style="gap:8px;padding:12px"><b style="font-size:14px">${bi("users")} مشغّلو اللعبة</b><div class="stack" style="gap:6px" id="gs-${esc(g.id)}"><span class="sub">…</span></div>
          <form class="row" data-f="game-staff" data-id="${esc(g.id)}" style="gap:8px"><input class="input" name="email" type="email" dir="ltr" placeholder="بريد مشغّل اللعبة" style="min-height:42px" required><button class="btn btn-dark btn-sm" type="submit" style="width:auto;padding:0 14px">إضافة</button></form>
          <span class="sub">مشغّل اللعبة يسجّل بحسابه العادي بنفس البريد، فتظهر له «لعبتي» ليمسح تذاكرها ويستلم الدفع.</span></div>
        <button class="btn btn-line btn-sm" data-a="game-edit" data-id="${esc(g.id)}">${ic("edit", 16)} تعديل</button></div>`).join("")
        : `<div class="empty card">${bi("game")}<b>ما فيه ألعاب بعد</b><span>أضف أول لعبة، وتظهر مباشرة في صفحة تذاكر الألعاب.</span></div>`}`;
  }
  async function loadGameStaff(id) {
    const el = $("#gs-" + id); if (!el) return;
    try {
      const l = await A.urpc("admin_list_game_staff", { p_game: id });
      el.innerHTML = l.length ? l.map((x) => `<div class="between"><span dir="ltr" style="font-size:14px">${esc(x.email)}</span><span class="row" style="gap:6px">${x.linked ? '<span class="st st-ok">مسجّل</span>' : '<span class="st st-warn">لم يسجّل بعد</span>'}<button class="linkbtn" data-a="game-staff-rm" data-id="${esc(id)}" data-email="${esc(x.email)}" style="color:var(--err);padding:0;min-height:auto">حذف</button></span></div>`).join("")
        : '<span class="sub">ما فيه مشغّل بعد.</span>';
    } catch (e) { el.innerHTML = `<span class="sub">${esc(errMsg(e))}</span>`; }
  }
  function renderGameForm(box) {
    const g = S.gameEdit === "new" ? { active: true, price_baisa: 500, sort: 100 } : ((S.gamesAdmin || []).find((x) => x.id === S.gameEdit) || {});
    gameMedia.image = g.image || null;
    box.innerHTML = `<form class="stack" data-f="game" novalidate>
      <div class="between"><b>${g.id ? "تعديل اللعبة" : "لعبة جديدة"}</b><button type="button" class="linkbtn" data-a="game-back">رجوع للقائمة</button></div>
      <label class="media-box" style="aspect-ratio:16/9">${g.image ? `<img src="${esc(img(g.image))}" alt="" style="width:100%;height:100%;object-fit:cover">` : `<span class="sub">صورة اللعبة (اختياري)</span>`}
        <input type="file" accept="image/png,image/jpeg,image/webp" data-c="game-img" hidden></label>
      <div class="field"><label for="gm-name">اسم اللعبة</label><input class="input" id="gm-name" name="name" maxlength="60" value="${esc(g.name || "")}" required></div>
      <div class="field"><label for="gm-desc">وصف قصير</label><textarea class="input" id="gm-desc" name="description" maxlength="300" rows="2" style="height:auto;padding:10px 14px">${esc(g.description || "")}</textarea></div>
      <div class="grid2">
        <div class="field"><label for="gm-price">سعر التذكرة (بيسة)</label><input class="input" id="gm-price" name="price" type="number" min="0" max="100000" step="50" value="${esc(g.price_baisa != null ? g.price_baisa : 500)}"><span class="sub">1000 بيسة = 1 ريال · 0 = مجانية</span></div>
        <div class="field"><label for="gm-age">أقل عمر (اختياري)</label><input class="input" id="gm-age" name="min_age" type="number" min="0" max="99" value="${esc(g.min_age != null ? g.min_age : "")}"></div>
      </div>
      <div class="grid2">
        <div class="field"><label for="gm-cap">عدد التذاكر المتاحة</label><input class="input" id="gm-cap" name="capacity" type="number" min="0" max="100000" value="${esc(g.capacity || "")}" placeholder="فارغ = بدون حد"></div>
        <div class="field"><label for="gm-sort">ترتيب الظهور</label><input class="input" id="gm-sort" name="sort" type="number" min="0" max="999" value="${esc(g.sort != null ? g.sort : 100)}"></div>
      </div>
      <label class="check"><input type="checkbox" name="active" ${g.active !== false ? "checked" : ""}> <span>مفعّلة: تظهر للزوار ويمكن حجزها</span></label>
      <div id="gmMsg"></div>
      <button class="btn btn-cta" type="submit">${g.id ? "حفظ اللعبة" : "إضافة اللعبة"}</button>
    </form>`;
  }
  async function loadAdminPartners() {
    const el = $("#pfBody"); if (!el) return;
    try {
      const apps = await A.urpc("admin_list_applications", { p_event: adminEv() });
      el.innerHTML = apps.length ? apps.map(appCard).join("") : `<div class="empty card">${ic("users", 36)}<b>لا توجد طلبات شركاء بعد</b><span>رابط تسجيل الشركاء: <b dir="ltr">${esc(location.origin + location.pathname)}?role=partner&amp;join=partner</b></span></div>`;
    } catch (e) { el.innerHTML = `<div class="msg err">${esc(errMsg(e))}</div>`; }
  }
  async function loadAdminStats() {
    const el = $("#pfBody"); if (!el) return;
    try {
      const OF = isOffers(adminEv());
      const [s, pl] = await Promise.all([A.urpc("admin_stats", { p_event: adminEv() }), OF && isAdmin() ? A.urpc("admin_pool", { p_event: adminEv() }).catch(() => null) : null]);
      S.poolData = pl;
      el.innerHTML = `${pl ? poolHTML(pl) : ""}<div class="kpis3"><div><b class="num">${s.paid}</b><span>جوازات مفعّلة</span></div><div><b class="num">${s.pending_payment}</b><span>بانتظار الدفع</span></div><div><b class="num" style="font-size:18px">${s.revenue_baisa ? fmtPrice(s.revenue_baisa) : "0"}</b><span>المبيعات</span></div></div>
        <div class="kpis3"><div><b class="num">${s.visitors_today}</b><span>طلبات اليوم</span></div><div><b class="num">${s.stamps}</b><span>أختام</span></div><div><b class="num">${s.rewards}</b><span>مكافآت</span></div></div>
        <h3 class="sec-t">أداء الأكشاك المعتمدة</h3>
        <div class="card" style="padding:4px 16px">${(s.stalls || []).length ? s.stalls.map((x) => `<div class="li"><span class="ico-tile" style="width:38px;height:38px;background:var(--gold-soft);color:var(--gold-ink)">${ic(KIND_ICON[x.kind] || "star", 18)}</span><div class="grow"><b style="font-size:14px">${esc(x.name)}</b><div class="sub">${x.visitors} زائر · ${x.visits} زيارة · ${x.rewards} مكافأة</div></div>${x.active ? "" : '<span class="st st-mute">متوقف</span>'}</div>`).join("") : '<div class="li sub">لا توجد أكشاك معتمدة بعد.</div>'}</div>
        <a class="btn btn-dark" href="admin.html?e=${encodeURIComponent(adminEv())}">${ic("grid", 20)} لوحة التحكم الكاملة</a>`;
    } catch (e) { el.innerHTML = `<div class="msg err">${esc(errMsg(e))}</div>`; }
  }
  /* صندوق الشركاء: نصيب كل شريك = زياراته ÷ مجموع الزيارات × الصندوق */
  function poolHTML(p) {
    return `<div class="card stack" style="gap:12px;border:1.5px solid var(--gold)">
        <div class="between"><b>${ic("gift", 18)} صندوق الشركاء</b><span class="st st-warn">${p.pool_pct}% من مبيعات الجواز</span></div>
        <div class="kpis3" style="margin:0"><div><b class="num" style="font-size:17px">${fmtMoney(p.revenue_baisa)}</b><span>مبيعات الجواز (${p.passes})</span></div><div><b class="num" style="font-size:17px">${fmtMoney(p.pool_baisa)}</b><span>الصندوق</span></div><div><b class="num" style="font-size:17px">${fmtMoney(p.revenue_baisa - p.pool_baisa)}</b><span>نصيب شُرفة</span></div></div>
        <span class="sub">مجموع الزيارات ${p.total_visits} · قيمة الزيارة تقريبًا ${fmtMoney(p.per_visit_baisa)}. الزيارة تنحسب إذا أكّدها الزائر أو ما رد بعد، والمرفوضة ما تنحسب.</span>
        <div class="card flat" style="padding:4px 14px">${(p.stalls || []).length ? p.stalls.map((x) => `<div class="li"><span class="ico-tile" style="width:34px;height:34px;background:var(--gold-soft);color:var(--gold-ink);font-weight:800">${x.rank}</span><div class="grow"><b style="font-size:14px">${esc(x.name)}</b><div class="sub">${x.visits} زيارة (${x.confirmed} مؤكدة) · ${x.share_pct}%</div></div><b class="num">${fmtMoney(x.amount_baisa)}</b></div>`).join("") : '<div class="li sub">لا توجد أكشاك معتمدة بعد.</div>'}</div>
        <button class="btn btn-line btn-sm" data-a="pool-csv">${ic("list", 16)} تصدير التوزيع (Excel)</button>
      </div>`;
  }
  const STATUS_AR = { pending: ["قيد المراجعة", "st-warn"], approved: ["معتمد", "st-ok"], rejected: ["مرفوض", "st-err"] };
  const appCard = (a) => `<div class="card stack" style="gap:10px">
      <div class="row" style="gap:12px">${logoTile(a, 52)}<div class="grow"><b>${esc(a.name)}</b><div class="sub">${esc(A.KIND[a.kind] || a.kind)} · <span dir="ltr">${esc(a.owner_email || "")}</span></div></div><span class="st ${STATUS_AR[a.status][1]}">${STATUS_AR[a.status][0]}</span></div>
      ${a.description ? `<p style="font-size:14px">${esc(a.description)}</p>` : ""}
      <div class="card flat" style="padding:10px 12px" id="cardv-${esc(a.stall)}"><div class="between"><span class="sub">${isOffers(adminEv()) ? "عرض الجواز" : "بطاقة الولاء"}</span>${isAdmin() ? `<button class="linkbtn" style="padding:0;min-height:auto" data-a="card-edit" data-id="${esc(a.stall)}" data-req="${a.required}" data-r1="${esc(a.reward1 || "")}" data-r2="${esc(a.reward2 || "")}" data-cd="${a.cooldown}">${ic("edit", 14)} تعديل البطاقة</button>` : ""}</div><div><b>${esc(isOffers(adminEv()) ? a.reward1 : A.offerText(a))}</b></div>${isOffers(adminEv()) ? `<button class="linkbtn" style="padding:0;min-height:auto" data-a="adm-deal" data-id="${esc(a.stall)}">${ic("eye", 14)} تفاصيل العرض والباقات</button><div id="admDeal-${esc(a.stall)}"></div>` : `<span class="sub">فاصل بين ختمين: ${a.cooldown} دقيقة</span>`}</div>
      ${a.phone || a.instagram ? `<span class="sub">${a.phone ? `<span dir="ltr">${esc(a.phone)}</span>` : ""}${a.instagram ? ` · <span dir="ltr">@${esc(a.instagram)}</span>` : ""}</span>` : ""}
      ${a.note ? `<span class="sub">ملاحظة: ${esc(a.note)}</span>` : ""}
      ${a.status === "pending" ? `<div class="row" style="gap:8px"><button class="btn btn-dark btn-sm" style="flex:1" data-a="review" data-id="${esc(a.stall)}" data-ok="1">${ic("check", 18, 2)} اعتماد</button><button class="btn btn-danger btn-sm" style="flex:1" data-a="review" data-id="${esc(a.stall)}" data-ok="0">رفض</button></div>`
        : a.status === "approved" ? `<button class="linkbtn" data-a="review" data-id="${esc(a.stall)}" data-ok="0" style="color:var(--err);align-self:flex-start">إيقاف الشريك</button>` : `<button class="linkbtn" data-a="review" data-id="${esc(a.stall)}" data-ok="1" style="align-self:flex-start">اعتماد</button>`}
    </div>`;

  async function orgLookup(code) {
    try {
      const d = await A.urpc("admin_pass_lookup", { p_event: orgEv(), p_code: code });
      if (d.status === "active") return showRes("ok", "check", "الجواز مفعّل مسبقًا", `<b>${esc(d.name)}</b> · ${d.pay_method === "free" ? "مجاني" : "مدفوع"} ${d.paid_at ? esc(dayTime(d.paid_at)) : ""}`, scanNextBtn(), 6000);
      showRes("warn", "lock", "بانتظار الدفع", `<b>${esc(d.name)}</b><br>المبلغ المطلوب: <b>${fmtPrice(d.amount_baisa || price())}</b><br><span class="sub">بعد استلام المبلغ اختر طريقة الدفع لتفعيل الجواز.</span>`,
        `<div class="row" style="gap:8px;width:100%"><button class="btn btn-cta btn-sm" style="flex:1" data-a="activate" data-code="${esc(d.code)}" data-m="cash">استلمت نقدًا</button><button class="btn btn-line btn-sm" style="flex:1" data-a="activate" data-code="${esc(d.code)}" data-m="transfer">تحويل بنكي</button></div>`);
    } catch (e) { showRes("err", "x", "لم يُعثر على الجواز", esc(errMsg(e)), scanNextBtn(), 7000); }
  }

  /* ---------------- الفعاليات ---------------- */
  function renderEvents() {
    const list = allEvents();
    scr.innerHTML = `${head("فعاليات شُرفة", false, S.me ? "" : loginBtn())}
      <div class="pad stack"><p class="sub">الفعاليات والمهرجانات المستضافة على شُرفة. اضغط على أي فعالية لتفاصيلها وخدماتها.</p>
      ${list.map((e) => eventCard(e, true)).join("")}</div><div class="sp"></div>`;
  }

  /* ---------------- حسابي ---------------- */
  function renderAccount() {
    if (S.me && isAdmin()) {
      const p = S.me.profile || {};
      scr.innerHTML = `<div class="ohead" style="background:linear-gradient(150deg,#5F4486,#7B5BA7)"><div><div style="font-size:12.5px;opacity:.85">إدارة شُرفة</div><h2>حسابي</h2></div></div>
        <div class="pad stack" style="padding-top:16px">
          <div class="card row"><span class="avatar lg" style="background:var(--purple)">${esc(firstName(p.name).charAt(0))}</span><div class="grow"><b style="font-size:17px">${esc(p.name || "")}</b>
            <div class="sub" dir="ltr" style="text-align:right">${esc(S.me.email)}</div><div class="sub" dir="ltr" style="text-align:right">${esc(p.phone || "")}</div></div></div>
          <div class="card" style="padding:0;overflow:hidden">
            <button class="menu-btn" data-a="go-tab" data-tab="admin">${ic("shield", 20)}<span class="grow">الطلبات والمؤشرات</span>${ic("fwd", 16, 2)}</button>
            <a class="menu-btn" href="admin.html?e=${encodeURIComponent(EV)}">${ic("grid", 20)}<span class="grow">لوحة التحكم الكاملة</span>${ic("ext", 16, 2)}</a>
            <button class="menu-btn" data-a="edit-profile">${ic("edit", 20)}<span class="grow">تعديل بياناتي</span>${ic("fwd", 16, 2)}</button>
            <button class="menu-btn" data-a="sub" data-name="mfa">${ic("shield", 20)}<span class="grow">التحقق بخطوتين</span>${ic("fwd", 16, 2)}</button>
            <a class="menu-btn" href="/">${ic("home", 20)}<span class="grow">موقع شُرفة</span>${ic("ext", 16, 2)}</a>
            <button class="menu-btn danger" data-a="logout">${ic("logout", 20)}<span class="grow">تسجيل الخروج</span></button>
          </div></div>`;
      return;
    }
    if (!S.me) {
      scr.innerHTML = `${head("حسابي", false)}
        <div class="pad stack">
          <div class="card stack" style="align-items:center;text-align:center;gap:10px;padding:26px 18px"><span class="avatar lg">${ic("user", 26)}</span>
            <b style="font-size:18px">سجّل دخولك إلى شُرفة</b><span class="sub">${isOffers() ? "لشراء الجواز الرقمي والاستفادة من خصومات الأكشاك" : "لشراء الجواز الرقمي وجمع الأختام"}، أو للتسجيل كشريك.</span>
            <button class="btn btn-dark" data-a="login">تسجيل الدخول</button><button class="btn btn-line" data-a="signup">إنشاء حساب</button></div>
          <div class="card" style="padding:0;overflow:hidden">
            <button class="menu-btn" data-a="partner-login">${ic("users", 20)}<span class="grow">بوابة الشركاء (دخول أو تسجيل)</span>${ic("fwd", 16, 2)}</button>
            <button class="menu-btn" data-a="org-login">${ic("chart", 20)}<span class="grow">دخول المنظمين</span>${ic("fwd", 16, 2)}</button>
            <button class="menu-btn" data-a="go-tab" data-tab="events">${ic("compass", 20)}<span class="grow">فعاليات شُرفة</span>${ic("fwd", 16, 2)}</button>
            <a class="menu-btn" href="privacy.html">${ic("shield", 20)}<span class="grow">الخصوصية والبيانات</span>${ic("fwd", 16, 2)}</a>
            <a class="menu-btn" href="/">${ic("home", 20)}<span class="grow">موقع شُرفة</span>${ic("ext", 16, 2)}</a>
          </div></div><div class="sp"></div>`;
      return;
    }
    const p = S.me.profile || {};
    const roles = ['<span class="st st-purple">زائر</span>'];
    if (S.me.partner || isStaff()) roles.push('<span class="st st-warn">شريك</span>');
    if (isOrg()) roles.push('<span class="st st-teal">منظم</span>');
    if (isAdmin()) roles.push('<span class="st st-purple">إدارة شُرفة</span>');
    scr.innerHTML = `${head("حسابي", false)}
      <div class="pad"><div class="card row"><span class="avatar lg">${esc(firstName(p.name).charAt(0))}</span><div class="grow"><b style="font-size:17px">${esc(p.name)}</b>
        <div class="sub" dir="ltr" style="text-align:right">${esc(S.me.email)}</div><div class="sub" dir="ltr" style="text-align:right">${esc(p.phone)}</div></div></div>
        <div class="tags" style="margin-top:10px">${roles.join("")}</div></div>
      <div class="sp"></div>
      <div class="pad"><div class="card" style="padding:0;overflow:hidden">
        <button class="menu-btn" data-a="go-tab" data-tab="pass">${ic("award", 20)}<span class="grow">جوازي الرقمي</span>${ic("fwd", 16, 2)}</button>
        <button class="menu-btn" data-a="sub" data-name="tickets">${bi("ticket")}<span class="grow">تذاكري (الألعاب)</span>${(S.tickets || []).length ? `<span class="st st-ok">${S.tickets.length}</span>` : ""}${ic("fwd", 16, 2)}</button>
        <button class="menu-btn" data-a="sub" data-name="bands">${bi("band")}<span class="grow">سوار الأمان (أساوري)</span>${(S.bands || []).length ? `<span class="st st-ok">${S.bands.length}</span>` : ""}${ic("fwd", 16, 2)}</button>
        <button class="menu-btn" data-a="sub" data-name="partner">${ic("users", 20)}<span class="grow">${S.me.partner ? (isOffers() ? "بيانات الشريك والعرض" : "بيانات الشريك وبطاقة الولاء") : "انضم كشريك"}</span>${ic("fwd", 16, 2)}</button>
        ${isWorker() ? `<button class="menu-btn" data-a="go-tab" data-tab="work">${ic("scan", 20)}<span class="grow">${isStaff() ? "واجهة الكشك" : isOrg() ? "اعتماد الجوازات" : "مشغّل اللعبة"}</span>${ic("fwd", 16, 2)}</button>` : ""}
        ${isOrg() ? "" : `<button class="menu-btn" data-a="sub" data-name="orgapply">${ic("chart", 20)}<span class="grow">سجّل كمنظم فعالية</span>${S.me.org_request === "pending" ? '<span class="st st-warn">قيد المراجعة</span>' : ""}${ic("fwd", 16, 2)}</button>`}
        ${isAdmin() ? `<button class="menu-btn" data-a="go-tab" data-tab="admin">${ic("shield", 20)}<span class="grow">إدارة شُرفة</span>${ic("fwd", 16, 2)}</button>
          <a class="menu-btn" href="admin.html?e=${encodeURIComponent(EV)}">${ic("grid", 20)}<span class="grow">لوحة التحكم الكاملة</span>${ic("ext", 16, 2)}</a>` : ""}
        <button class="menu-btn" data-a="edit-profile">${ic("edit", 20)}<span class="grow">تعديل بياناتي</span>${ic("fwd", 16, 2)}</button>
        <button class="menu-btn" data-a="sub" data-name="mfa">${ic("shield", 20)}<span class="grow">التحقق بخطوتين</span>${ic("fwd", 16, 2)}</button>
      </div></div>
      <div class="sp"></div>
      <div class="pad"><div class="card" style="padding:0;overflow:hidden">
        <a class="menu-btn" href="privacy.html">${ic("shield", 20)}<span class="grow">الخصوصية والبيانات</span>${ic("fwd", 16, 2)}</a>
        <a class="menu-btn" href="/">${ic("home", 20)}<span class="grow">موقع شُرفة</span>${ic("ext", 16, 2)}</a>
        <button class="menu-btn danger" data-a="delete-data">${ic("trash", 20)}<span class="grow">حذف بياناتي وجوازاتي</span></button>
        <button class="menu-btn danger" data-a="logout">${ic("logout", 20)}<span class="grow">تسجيل الخروج</span></button>
      </div></div>
      <p class="sub" style="text-align:center;padding:18px">شُرفة · النسخة التجريبية</p>`;
  }

  /* ---------------- الشاشات الفرعية ---------------- */
  const SUB = {
    event(o) {
      const e = evById(o.id) || {};
      const svcs = (e.page && e.page.services) || [];
      const isCur = e.id === EV;
      const ref = isCur && myPassRef();
      return `${head(e.name || "", true, S.me ? "" : loginBtn())}
        <div class="pad stack">
          <div class="evc full" style="cursor:default"><span class="img" style="height:180px;background-image:url('${esc(img(e.image))}');background-color:${esc((e.colors || {}).from || "#1A2E28")};background-position:${esc(e.imagePosition || "center")}">${statusChip(e.status)}</span>
            <span class="b"><span class="sub row" style="gap:6px">${ic("pin", 14)}${esc(e.location || "")}</span><span class="sub row" style="gap:6px">${ic("cal", 14)}${esc(e.date || e.dateNote || "يُعلن قريبًا")}</span>
            <p style="font-size:14.5px;margin-top:4px">${esc(e.summary || "")}</p></span></div>
          ${svcs.length ? `<h3 class="sec-t">خدماتك في هذه الفعالية</h3><div class="feat-grid">${featList(e).map((k) => { const f = feat(k, e, isCur); return `<button class="feat" ${f.a} style="--c1:${f.c1};--c2:${f.c2}">
              <span class="feat-ico">${bi(f.main)}</span><span class="grow"><b>${esc(f.t)}</b><span class="sub">${esc(f.d)}</span></span>
              ${f.soon ? '<span class="st st-mute">قريبًا</span>' : '<span class="st st-ok">متاح</span>'}</button>`; }).join("")}</div>`
            : `<div class="card flat sub">نعمل مع المنظمين على إعداد خدمات الفعالية داخل شُرفة. سنعلن عنها فور إطلاقها.</div>`}
          ${!isCur ? `<button class="btn btn-cta" data-a="ev-go" data-id="${esc(e.id)}" data-go="home">ادخل تجربة ${esc((e.name || "").split("—")[0].trim())} في التطبيق</button>` : ""}
          ${isCur && canSell() ? (ref ? `<button class="btn btn-dark" data-a="go-tab" data-tab="pass">${ic("award", 20)} جوازي في هذه الفعالية</button>`
            : `<button class="btn btn-cta" data-a="buy">${ic("award", 20)} ${price() ? "اشترِ الجواز الرقمي · " + fmtPrice(price()) : "احصل على الجواز الرقمي مجانًا"}</button>`) : ""}
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
        ${isOffers() ? `<div class="loyalty"><div class="loyalty-head"><b>عرض الجواز</b><span class="st st-warn">مرة واحدة</span></div>
          <div id="stDeal" data-id="${esc(s.id)}" style="margin:6px 0">${dealHTML(((S.evOffers || []).find((x) => x.id === s.id) || {}).deal, { fallback: s.reward1 })}</div>
          <p class="loyalty-next">اعرض رمز جوازك عند الطلب ← يطبّق لك الكشك الخصم أو الباقة ← تدفع له مباشرة.</p></div>`
        : `<div class="loyalty"><div class="loyalty-head"><b>بطاقة الولاء</b><span class="st st-purple">${esc(A.offerText(s))}</span></div><div class="slots">${slots}</div>
          <p class="loyalty-next">اعرض رمز جوازك عند كل زيارة لتُضاف الأختام.</p></div>`}
        ${myPassRef() ? "" : `<button class="btn btn-cta" data-a="buy">احصل على الجواز الرقمي${price() ? " · " + fmtPrice(price()) : ""}</button>`}
      </div><div class="sp"></div>`;
    },
    checkout() {
      const ev = evById(EV) || {};
      if (!price()) {   // جواز مجاني: بدون دفع، يتفعّل فورًا
        const when = [ev.date, ev.hours].filter(Boolean).join(" · ");
        return `${head("الجواز الرقمي المجاني")}
        <div class="pad stack">
          <div class="card stack" style="gap:8px"><b>ملخص الطلب</b>
            <div class="between"><span>الجواز الرقمي · ${esc((ev.name || "").split("—")[0].trim())}</span><b class="num" style="color:var(--ok)">مجانًا</b></div>
            <span class="sub">بطاقة ولاء لكل كشك مشارك · بدون دفع</span></div>
          <div class="card stack" style="gap:6px;border:1.5px solid var(--gold);background:var(--gold-soft)">
            <b class="row" style="gap:8px">${ic("cal", 18)} متاح ${when ? "خلال الفعالية فقط" : "لفترة محدودة"}</b>
            ${when ? `<span style="font-size:14px">${esc(when)}</span>` : ""}
            ${S.ev && S.ev.pay_note ? `<span class="sub" style="color:var(--ink)">${esc(S.ev.pay_note)}</span>` : ""}</div>
          <div class="card flat stack" style="gap:6px"><b style="font-size:14px">كيف يتم؟</b>
            <span class="sub">1) اضغط «احصل على جوازك مجانًا».</span>
            <span class="sub">2) يتفعّل جوازك فورًا ويظهر رمزك.</span>
            <span class="sub">3) ${isOffers() ? "اعرض رمزك عند الأكشاك المشاركة واحصل على خصمها أو باقتها." : "اعرض رمزك عند الأكشاك المشاركة واجمع الأختام والمكافآت."}</span></div>
          <div id="coMsg"></div>
          <button class="btn btn-cta" data-a="confirm-buy">${ic("award", 20)} احصل على جوازك مجانًا</button>
        </div><div class="sp"></div>`;
      }
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
            <span class="sub">3) يمسح المنظم رمزك فيتفعّل جوازك فورًا${isOffers() ? "، وتقدر تستخدم خصومات الأكشاك." : "، وتبدأ بجمع الأختام."}</span></div>
          <p class="sub row" style="gap:6px">${ic("shield", 14)} لا نطلب ولا نحفظ بيانات بطاقتك في شُرفة. الدفع الإلكتروني سيتم عبر بوابة دفع مرخّصة.</p>
          <div id="coMsg"></div>
          <button class="btn btn-cta" data-a="confirm-buy">تأكيد الطلب · ${fmtPrice(price())}</button>
        </div><div class="sp"></div>`;
    },
    partner() {
      return `${head(isOffers() ? "الشريك والعرض" : "الشريك وبطاقة الولاء")}<div class="pad stack" id="ptBody"><div class="skel"></div><div class="skel"></div></div>`;
    },
    orgapply() {
      return `${head("طلب منظم فعالية")}<div class="pad stack" id="oaBody"><div class="skel"></div><div class="skel"></div></div>`;
    },
    soon(o) {
      const [t, icon, c, steps] = SOON[o.id] || SOON.tickets;
      return `${head(t)}<div class="pad stack">
        <div class="soon-hero" style="--c1:${c}"><span class="feat-ico">${bi(icon)}</span><b>${esc(t)}</b><span class="st st-glass">قريبًا</span></div>
        <div class="card stack" style="gap:10px"><b>كيف ستعمل؟</b>${steps.map((x, i) => `<div class="row" style="gap:10px"><span class="ico-tile" style="width:34px;height:34px;background:var(--sand-2);color:var(--ink)">${i + 1}</span><span class="grow" style="font-size:14px">${esc(x)}</span></div>`).join("")}</div>
        <p class="sub" style="text-align:center">نعمل مع المنظمين على إطلاق هذه الخدمة. نعلن عنها في التطبيق فور تفعيلها.</p></div><div class="sp"></div>`;
    },
    mfa() {
      return `${head("التحقق بخطوتين")}<div class="pad stack wrap-md">
        <div class="card stack" style="gap:8px"><b>حماية إضافية لحسابك</b><span class="sub" style="line-height:1.7">بعد التفعيل، يطلب منك الدخول رمزًا متغيرًا من تطبيق المصادقة في جوالك، إضافة لكلمة المرور. حتى لو عرف أحد كلمة مرورك، ما يقدر يدخل بدون جوالك. <b>ننصح به بقوة لحسابات الإدارة والمنظمين ومشغّلي الألعاب.</b></span></div>
        <div id="mfaBody" class="stack"><div class="skel"></div></div></div><div class="sp"></div>`;
    },
    games() {
      const list = S.games || [], my = S.tickets || [];
      const hero = `<div class="soon-hero" style="--c1:#F5A623;--c2:#9A5B00"><span class="feat-ico">${bi("ticket")}</span><b>تذاكر الألعاب</b><span style="font-size:13.5px;opacity:.95">احجز تذكرتك، وادفع عند اللعبة لمشغّلها، واعرض الرمز عند الدخول.</span></div>`;
      if (!list.length) {
        const [, , , steps] = SOON.tickets;
        return `${head("تذاكر الألعاب")}<div class="pad stack">${hero.replace("</div>", '<span class="st st-glass">قريبًا</span></div>')}
          <div class="card stack" style="gap:10px"><b>كيف تعمل؟</b>${steps.map((x, i) => `<div class="row" style="gap:10px"><span class="ico-tile" style="width:34px;height:34px;background:var(--sand-2);color:var(--ink)">${i + 1}</span><span class="grow" style="font-size:14px">${esc(x)}</span></div>`).join("")}</div>
          <p class="sub" style="text-align:center">تُضاف الألعاب هنا فور إعلانها من المنظمين.</p></div><div class="sp"></div>`;
      }
      return `${head("تذاكر الألعاب", true, my.length ? `<button class="btn btn-dark btn-sm" data-a="sub" data-name="tickets" style="width:auto;padding:0 14px">${bi("ticket")} تذاكري (${my.length})</button>` : "")}
        <div class="pad stack">${hero}
        <div class="games-grid">${list.map((g) => { const out = g.remaining === 0; return `<div class="game">
          <div class="game-img"${g.image ? ` style="background-image:url('${esc(img(g.image))}')"` : ""}>${g.image ? "" : bi("game")}${g.min_age ? `<span class="st st-glass">+${g.min_age} سنوات</span>` : ""}</div>
          <div class="stack" style="gap:6px;padding:14px">
            <div class="between"><b style="font-size:17px">${esc(g.name)}</b><b class="num" style="color:var(--gold-ink)">${fmtPrice(g.price_baisa)}</b></div>
            ${g.description ? `<span class="sub" style="line-height:1.6">${esc(g.description)}</span>` : ""}
            ${g.remaining != null ? `<span class="sub">${out ? '<span class="st st-err">نفدت التذاكر</span>' : `المتبقي: <b>${g.remaining}</b> تذكرة`}</span>` : ""}
            ${out ? "" : `<div class="row" style="gap:10px;margin-top:6px">
              <div class="qty"><button type="button" data-a="qty" data-id="${esc(g.id)}" data-d="-1" aria-label="أقل">−</button><b id="q-${esc(g.id)}">1</b><button type="button" data-a="qty" data-id="${esc(g.id)}" data-d="1" data-max="${Math.min(10, g.remaining == null ? 10 : g.remaining)}" aria-label="أكثر">+</button></div>
              <button class="btn btn-cta btn-sm grow" data-a="game-book" data-id="${esc(g.id)}" data-price="${g.price_baisa}">احجز · <span id="t-${esc(g.id)}">${fmtPrice(g.price_baisa)}</span></button></div>`}
          </div></div>`; }).join("")}</div>
        <p class="sub" style="text-align:center">الدفع عند اللعبة لمشغّلها (نقدًا أو تحويل). الدفع الإلكتروني قريبًا.</p></div><div class="sp"></div>`;
    },
    tickets() {
      const my = S.tickets || [];
      const ST = { pending_payment: ["بانتظار الدفع", "st-warn"], active: ["صالحة", "st-ok"], used: ["مستخدمة", "st-mute"] };
      return `${head("تذاكري")}<div class="pad stack">
        ${my.length ? my.map((t) => `<div class="card stack ticket ${t.status}" style="gap:10px">
          <div class="between"><b style="font-size:17px">${esc(t.game)}</b><span class="st ${ST[t.status][1]}">${ST[t.status][0]}</span></div>
          <div class="row" style="gap:14px;align-items:center">
            <div class="tqr" data-code="${esc(t.code)}"></div>
            <div class="stack grow" style="gap:6px"><span class="pp-code" style="font-size:18px;letter-spacing:3px;color:var(--ink)">${esc(t.code)}</span>
              <span class="sub">${t.qty === 1 ? "تذكرة واحدة" : t.qty === 2 ? "تذكرتان" : t.qty + " تذاكر"}${t.used ? ` · دخل ${t.used}` : ""}</span>
              ${t.status === "pending_payment" ? `<span class="sub" style="color:var(--ink)">ادفع <b>${fmtPrice(t.amount_baisa)}</b> لمشغّل اللعبة واعرض الرمز</span>
                <button class="linkbtn" data-a="ticket-cancel" data-code="${esc(t.code)}" style="color:var(--err);padding:0;min-height:auto;align-self:flex-start">إلغاء الحجز</button>`
                : t.status === "active" ? `<span class="sub" style="color:var(--ink)">اعرض الرمز لمشغّل اللعبة عند الدخول</span>` : `<span class="sub">استُخدمت التذكرة بالكامل</span>`}</div></div></div>`).join("")
          : `<div class="empty card">${bi("ticket")}<b>ما عندك تذاكر بعد</b><span>احجز من صفحة تذاكر الألعاب.</span></div>`}
        <button class="btn btn-line" data-a="sub" data-name="games">${bi("game")} تصفّح الألعاب</button></div><div class="sp"></div>`;
    },
    bands(o) {
      const steps = [["band", "استلم السوار من منصة المنظمين"], ["scan", "امسح رمزه من هنا واربطه بحسابك"], ["bell", "يصلك إشعار فوري إذا مسحه فريق التنظيم"]];
      return `${head("سوار الأمان")}<div class="pad stack">
        <div class="soon-hero" style="--c1:#2CA6A4;--c2:#14524F"><span class="feat-ico">${bi("band")}</span><b>راحة بال أكبر لعائلتك</b><span style="font-size:13.5px;opacity:.92">سوار برمز QR مرتبط بحسابك. إذا ضاع طفلك يمسحه فريق التنظيم، فيصلك إشعار بمكان استلامه.</span></div>
        <div class="card stack" style="gap:10px">${steps.map(([i, x], n) => `<div class="row" style="gap:10px"><span class="ico-tile" style="width:36px;height:36px;background:var(--teal-soft);color:var(--teal-ink)">${bi(i)}</span><span class="grow" style="font-size:14px"><b>${n + 1}.</b> ${esc(x)}</span></div>`).join("")}
          <div class="tags"><span class="st st-mute">رقمك لا يظهر للمنظم</span><span class="st st-mute">بدون GPS أو تتبع</span><span class="st st-mute">الرمز لا يحمل بيانات الطفل</span></div></div>
        <div id="bandsBody" class="stack"><div class="skel"></div></div></div><div class="sp"></div>`;
    },
    packages() {
      if (isOffers()) return `${head("باقات شُرفة")}<div class="pad stack" id="pkBody"><div class="skel"></div><div class="skel"></div></div><div class="sp"></div>`;
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
  /* ---------- باقات شُرفة: جاهزة (الفرد / العائلة / الربع) + «كوّن باقتك» + باقاتي ---------- */
  const PK_IC = { single: "user", family: "users", friends: "users" };
  async function loadPackages(reload = true) {
    if (!$("#pkBody")) return;
    S.pk = S.pk || { tab: "ready", sel: {} };
    if (reload) {
      const [list, cat, mine] = await Promise.all([
        A.rpc("event_packages", { p_event: EV }).catch(() => []), A.rpc("event_package_catalog", { p_event: EV }).catch(() => []),
        S.me ? A.urpc("my_packages", { p_event: EV }).catch(() => []) : []]);
      Object.assign(S.pk, { list: list || [], cat: cat || [], mine: mine || [] });
    }
    renderPackages();
  }
  const pkItemLi = (i) => `<div class="li"><span class="ico-tile" style="width:34px;height:34px;background:var(--gold-soft);color:var(--gold-ink)">${ic(CAT_IC[i.category] || "food", 16)}</span>
      <div class="grow"><b style="font-size:14px">${i.qty > 1 ? i.qty + " × " : ""}${esc(i.name)}</b><div class="sub">${esc(i.stall_name)}</div></div>
      <span class="deal-price"><s>${omr(i.before * i.qty)}</s><b>${omr(i.after * i.qty)}</b></span></div>`;
  function renderPackages() {
    const box = $("#pkBody"); if (!box) return;
    const P = S.pk, ref = myPassRef(), active = !!(ref && ref.status === "active");
    const gate = active ? "" : `<div class="card row" style="gap:12px;border:1.5px solid var(--purple)">${ic("lock", 20)}<span class="grow sub" style="color:var(--ink)">${!S.me ? "سجّل دخولك واشترِ جواز الفعالية عشان تاخذ الباقات." : !ref ? "الباقات لحاملي جواز الفعالية." : "جوازك بانتظار الدفع. بعد التفعيل تقدر تاخذ الباقات."}</span>${ref ? "" : `<button class="btn btn-cta btn-sm" data-a="buy" style="width:auto;padding:0 14px">احصل على الجواز</button>`}</div>`;
    const tabs = `<div class="seg" role="group" aria-label="الباقات">${[["ready", "الباقات الجاهزة"], ["custom", "كوّن باقتك"], ["mine", `باقاتي${P.mine.length ? " (" + P.mine.length + ")" : ""}`]].map(([k, l]) => `<button data-a="pk-tab" data-k="${k}" aria-pressed="${P.tab === k}">${l}</button>`).join("")}</div>`;
    const how = `<div class="card flat row" style="gap:10px;align-items:flex-start">${ic("qr", 20)}<span class="grow sub" style="color:var(--ink);line-height:1.7">الباقة تجمع منتجات من <b>أكثر من كشك</b> بسعر أقل. عند كل كشك: اعرض رمز جوازك ← استلم منتجك ← ادفع للكشك سعره في الباقة.</span></div>`;
    let h = "";
    if (P.tab === "ready") {
      h = P.list.length ? P.list.map((k) => `<div class="card stack" style="gap:10px">
          <div class="row" style="gap:12px"><span class="ico-tile" style="background:var(--purple-soft);color:var(--purple)">${ic(PK_IC[k.kind] || "grid", 22)}</span>
            <span class="grow"><b style="font-size:17px">${esc(k.name)}</b>${k.description ? `<span class="sub" style="display:block">${esc(k.description)}</span>` : ""}</span>
            <span class="st st-ok">وفّر ${savePct(k.before, k.after)}%</span></div>
          <div class="card flat" style="padding:2px 12px">${k.items.map(pkItemLi).join("")}</div>
          <div class="between"><span class="sub">من ${k.stalls} ${k.stalls > 2 ? "أكشاك" : k.stalls === 2 ? "كشكين" : "كشك"}</span><span class="deal-price" style="flex-direction:row;gap:8px;align-items:baseline"><s>${omr(k.before)}</s><b style="font-size:19px">${omr(k.after)}</b></span></div>
          <button class="btn btn-cta" data-a="pk-take" data-k="${esc(k.kind)}" ${active ? "" : "disabled"}>خذ ${esc(k.name)}</button></div>`).join("")
        : `<div class="empty card">${ic("grid", 36)}<b>الباقات الجاهزة تُعلن قريبًا</b><span>تقدر الحين تكوّن باقتك بنفسك من منتجات الأكشاك.</span></div>`;
    } else if (P.tab === "custom") {
      const sel = P.sel, chosen = P.cat.filter((i) => sel[i.id]);
      const tb = chosen.reduce((t, i) => t + i.before * sel[i.id], 0), ta = chosen.reduce((t, i) => t + i.after * sel[i.id], 0);
      const groups = Object.keys(CAT).map((c) => [c, P.cat.filter((i) => i.category === c)]).filter((g) => g[1].length);
      h = groups.length ? groups.map(([c, L]) => `<h3 class="sec-t" style="margin:4px 0 0">${CAT[c]}</h3><div class="card" style="padding:2px 12px">${L.map((i) => `<div class="li">
            <div class="grow"><b style="font-size:14px">${esc(i.name)}</b><div class="sub">${esc(i.stall_name)} · <s>${omr(i.before)}</s> <b style="color:var(--ink)">${omr(i.after)}</b></div></div>
            <span class="stepper"><button data-a="pk-q" data-id="${esc(i.id)}" data-d="-1" aria-label="أنقص" ${sel[i.id] ? "" : "disabled"}>−</button><b class="num">${sel[i.id] || 0}</b><button data-a="pk-q" data-id="${esc(i.id)}" data-d="1" aria-label="زِد">+</button></span></div>`).join("")}</div>`).join("")
          + `<div class="pk-total"><div class="grow"><span class="sub">${chosen.length ? `${plural(chosen.length, "منتج واحد", "منتجين", "منتجات", "منتج")} · وفّرت ${omr(tb - ta)}` : "اختر منتجاتك"}</span>
              <div class="row" style="gap:8px;align-items:baseline">${chosen.length ? `<s class="sub">${omr(tb)}</s>` : ""}<b style="font-size:19px">${omr(ta)}</b></div></div>
            <button class="btn btn-cta btn-sm" data-a="pk-save" style="width:auto;padding:0 16px" ${chosen.length && active ? "" : "disabled"}>احفظ باقتي</button></div>`
        : `<div class="empty card">${ic("grid", 36)}<b>ما فيه منتجات بعد</b><span>تظهر هنا منتجات الأكشاك المشاركة أول ما يعتمدها فريق شُرفة.</span></div>`;
    } else {
      const ST = { open: ["متاح عند الكشك", "st-ok"], pending: ["بانتظار تأكيدك", "st-warn"], done: ["استلمته", "st-mute"] };
      h = P.mine.length ? P.mine.map((k) => `<div class="card stack" style="gap:8px">
          <div class="between"><b style="font-size:16px">${esc(k.name)}</b><span class="deal-price" style="flex-direction:row;gap:8px;align-items:baseline"><s>${omr(k.before)}</s><b>${omr(k.after)}</b></span></div>
          <div class="card flat" style="padding:2px 12px">${k.lines.map((l) => `<div class="li"><div class="grow"><b style="font-size:14px">${l.qty > 1 ? l.qty + " × " : ""}${esc(l.item)}</b><div class="sub">${esc(l.stall)} · ادفع له ${omr(l.after * l.qty)}</div></div><span class="st ${ST[l.state][1]}">${ST[l.state][0]}</span></div>`).join("")}</div>
          ${k.lines.every((l) => l.state === "open") ? `<button class="linkbtn" data-a="pk-cancel" data-id="${esc(k.id)}" style="color:var(--err);align-self:flex-start">${ic("trash", 14)} إلغاء الباقة</button>` : ""}</div>`).join("")
        : `<div class="empty card">${ic("grid", 36)}<b>ما عندك باقات بعد</b><span>خذ باقة جاهزة أو كوّن باقتك.</span></div>`;
    }
    box.innerHTML = gate + how + tabs + h;
  }
  async function pkAction(a, b) {
    const P = S.pk || {};
    if (a === "pk-tab") { P.tab = b.dataset.k; return renderPackages(); }
    if (a === "pk-q") { const id = b.dataset.id, q = Math.max(0, Math.min(10, (P.sel[id] || 0) + parseInt(b.dataset.d, 10))); if (q) P.sel[id] = q; else delete P.sel[id]; return renderPackages(); }
    b.disabled = true;
    try {
      if (a === "pk-take") await A.urpc("pass_take_package", { p_event: EV, p_kind: b.dataset.k, p_items: null });
      else if (a === "pk-save") { await A.urpc("pass_take_package", { p_event: EV, p_kind: "custom", p_items: Object.entries(P.sel).map(([item, qty]) => ({ item, qty })) }); P.sel = {}; }
      else if (a === "pk-cancel") { if (!confirm("تلغي هذه الباقة؟")) { b.disabled = false; return; } await A.urpc("pass_cancel_package", { p_id: b.dataset.id }); }
      toast(a === "pk-cancel" ? "أُلغيت الباقة" : "أُضيفت الباقة إلى «باقاتي». اعرض رمز جوازك عند كل كشك.", "ok");
      P.tab = "mine"; await loadPackages(true); window.scrollTo(0, 0);
    } catch (e) { toast(errMsg(e), "err"); b.disabled = false; }
  }
  function afterSub(o) {
    if (o.name === "partner") loadPartnerForm();
    if (o.name === "orgapply") loadOrgApply();
    if (o.name === "bands") loadBandsScreen(o);
    if (o.name === "mfa") loadMfaScreen();
    if (o.name === "packages" && isOffers()) loadPackages();
    if (o.name === "tickets") { document.querySelectorAll(".tqr").forEach((el) => A.qr(el, "SHURFA-T:" + el.dataset.code, 120)); }
    const sd = $("#stDeal");
    if (sd && !(S.evOffers || []).some((x) => x.id === sd.dataset.id && x.deal)) A.rpc("event_offers", { p_event: EV }).then((L) => {
      S.evOffers = L || []; const box = $("#stDeal"), it = S.evOffers.find((x) => x.id === (box && box.dataset.id));
      if (box && it && it.deal) box.innerHTML = dealHTML(it.deal); }).catch(() => {});


  }

  /* ---------- التحقق بخطوتين: الإعداد ---------- */
  async function loadMfaScreen() {
    const box = $("#mfaBody"); if (!box) return;
    let fs = [];
    try { fs = await A.auth.factors(); } catch (e) { box.innerHTML = `<div class="msg err">${esc(errMsg(e))}</div>`; return; }
    const on = fs.find((f) => f.status === "verified");
    box.innerHTML = on
      ? `<div class="result r-ok"><span class="big">${ic("shield", 28, 2.2)}</span><h3>التحقق بخطوتين مفعّل</h3><span class="sub" style="color:var(--ink)">يُطلب رمز من تطبيق المصادقة عند كل دخول.</span></div>
         <button class="btn btn-line" data-a="mfa-off" data-id="${esc(on.id)}" style="color:var(--err)">إيقاف التحقق بخطوتين</button>`
      : `<div class="card stack" style="gap:10px"><b>خطوات التفعيل</b>
          <span class="sub">1) نزّل تطبيق مصادقة: Google Authenticator أو Microsoft Authenticator.</span>
          <span class="sub">2) اضغط «ابدأ التفعيل» وامسح الرمز بالتطبيق.</span>
          <span class="sub">3) أدخل الرمز المكوّن من 6 أرقام اللي يظهر في التطبيق.</span></div>
         <button class="btn btn-cta" data-a="mfa-start">${ic("shield", 18)} ابدأ التفعيل</button>`;
  }

  /* ---------- سوار الأمان: ولي الأمر ---------- */
  const serial = (n) => "#" + String(n || 0).padStart(3, "0");
  async function loadBands() {
    if (!S.me) { S.bands = []; return S.bands; }
    try { S.bands = await A.urpc("my_bands"); } catch (e) { S.bands = S.bands || []; }
    return S.bands;
  }
  async function loadBandsScreen(o) {
    const box = $("#bandsBody"); if (!box) return;
    if (!S.me) {
      box.innerHTML = `<div class="card stack" style="gap:10px;border:1.5px solid var(--teal)">${o.code ? `<b>وجدت طفلًا يرتدي هذا السوار؟</b><span class="sub" style="color:var(--ink)">اصطحبه إلى منصة المنظمين أو أقرب فرد من فريق التنظيم. لا تُعرض هنا أي بيانات عن الطفل أو أهله.</span><div style="height:1px;background:var(--sand)"></div>` : ""}
        <b>${o.code ? "هل هذا سوار طفلك؟" : "فعّل سوار طفلك"}</b><span class="sub">سجّل دخولك لربط السوار بحسابك.</span>
        <button class="btn btn-cta" data-a="band-login">${ic("user", 18)} سجّل دخولك</button></div>`;
      return;
    }
    await loadBands();
    let top = "";
    if (o.code) {
      try {
        const st = await A.urpc("band_status", { p_code: o.code });
        top = st.state === "free" ? "" : st.state === "taken"
          ? `<div class="result r-warn"><span class="big">${ic("lock", 28, 2.2)}</span><h3>هذا السوار مرتبط بحساب آخر</h3><span class="sub" style="color:var(--ink)">إذا وجدت طفلًا يرتديه، اصطحبه إلى منصة المنظمين.</span></div>`
          : `<div class="result r-ok"><span class="big">${ic("check", 28, 2.4)}</span><h3>هذا السوار مرتبط بحسابك</h3><span class="sub" style="color:var(--ink)">سوار ${serial(st.serial)}</span></div>`;
        if (st.state !== "free") o.code = "";
      } catch (e) { top = `<div class="msg err">${esc(errMsg(e))}</div>`; o.code = ""; }
    }
    const list = S.bands || [];
    box.innerHTML = `${top}
      ${list.length ? `<h3 class="sec-t">أساوري</h3>${list.map((b) => `<div class="card stack" style="gap:8px">
        <div class="row" style="gap:12px"><span class="ico-tile" style="background:var(--teal-soft);color:var(--teal-ink)">${bi("band")}</span>
          <div class="grow"><b>${esc(b.child || "سوار بدون اسم")}</b><div class="sub">سوار ${serial(b.serial)}${b.last_alert ? ` · آخر مسح: ${esc(dayTime(b.last_alert.at))}` : ""}</div></div>
          ${b.lost ? '<span class="st st-err">مفقود</span>' : '<span class="st st-ok">مفعّل</span>'}</div>
        <div class="row" style="gap:6px;flex-wrap:wrap">
          <button class="linkbtn" data-a="band-rename" data-code="${esc(b.code)}" data-child="${esc(b.child || "")}">${ic("edit", 16)} الاسم</button>
          <button class="linkbtn" data-a="band-lost" data-code="${esc(b.code)}" data-lost="${b.lost ? 0 : 1}">${b.lost ? "وجدت السوار" : "أبلغ عن فقدان السوار"}</button>
          <button class="linkbtn" data-a="band-unlink" data-code="${esc(b.code)}" style="color:var(--err)">فك الربط</button></div></div>`).join("")}` : ""}
      <h3 class="sec-t">${list.length ? "أضف سوارًا آخر" : "اربط سوار طفلك"}</h3>
      ${o.code ? "" : scanUI("امسح رمز السوار", "بالكاميرا الخلفية لربطه بحسابك")}
      <form class="card stack" data-f="band-add" style="gap:10px">
        <div class="field"><label for="bd-code">رمز السوار</label><input class="input" id="bd-code" name="code" dir="ltr" maxlength="10" placeholder="مثال: 5Q664Z9ZBC" value="${esc(o.code || "")}" autocomplete="off" required></div>
        <div class="field"><label for="bd-child">اسم الطفل الأول (اختياري)</label><input class="input" id="bd-child" name="child" maxlength="40" placeholder="يظهر لك وحدك في الإشعار"></div>
        <div id="bd-msg"></div>
        <button class="btn btn-cta" type="submit">${ic("check", 18, 2)} اربط السوار بحسابي</button>
        <span class="sub">بالربط توافق على أن يُرسل لك إشعار عند مسح السوار من فريق التنظيم. لا نخزّن صورًا أو مواقع.</span></form>`;
    onBand = (code) => { closeOverlay(false); const i = $("#bd-code"); if (i) { i.value = code; const c = $("#bd-child"); if (c) c.focus(); toast("تمت قراءة رمز السوار", "ok"); } };
    if (o.code) { const c = $("#bd-child"); if (c) c.focus(); }
  }
  // إشعار ولي الأمر عند مسح السوار
  let bandShown = 0;
  async function bandTick() {
    if (!S.me || !(S.bands || []).length) return;
    let d; try { d = await A.urpc("band_pulse"); } catch (e) { return; }
    const al = d && d.alert; if (!al || al.id === bandShown) return;
    bandShown = al.id;
    try { if (navigator.vibrate) navigator.vibrate([400, 150, 400, 150, 400]); } catch (e) { /* ignore */ }
    overlay({ k: "alert", icon: "b:bell", title: `🔔 تم العثور على ${al.child || "طفلك"}`,
      body: `مسح فريق التنظيم سوار ${serial(al.serial)}${al.event ? ` في <b>${esc(al.event.split("—")[0].trim())}</b>` : ""}.<br>توجّه الآن إلى: <b style="font-size:1.15rem">${esc(al.point || "منصة المنظمين")}</b><br><span class="sub">${esc(time(al.at))}</span>`,
      onClose: () => { A.urpc("band_ack", { p_id: al.id }).catch(() => {}); } });
    const b = $("#ovl [data-a=ovl-close]"); if (b) b.textContent = "حسنًا، أنا في الطريق";
  }

  /* ---------- المنظم: مسح السوار ---------- */
  const orgPoint = () => A.local.get("org-point") || "منصة المنظمين";
  async function orgBand(code) {
    try {
      const d = await A.urpc("band_scan", { p_event: orgEv(), p_code: code, p_point: orgPoint() });
      try { if (navigator.vibrate) navigator.vibrate([80, 40, 80]); } catch (x) { /* ignore */ }
      showRes("ok", "b:bell", "وصل الإشعار لولي الأمر", `سوار <b>${serial(d.serial)}</b>${d.lost ? " (مُبلّغ عن فقدانه)" : ""}<br>طلبنا من ولي الأمر التوجّه إلى: <b>${esc(d.point)}</b><br><span class="sub">ابقَ مع الطفل في هذه النقطة حتى يصل.</span>`, scanNextBtn());
    } catch (e) {
      const d = e.data || {};
      if (e.code === "band_unlinked") showRes("warn", "b:band", "السوار غير مفعّل", `سوار <b>${serial(d.serial)}</b> لم يربطه ولي الأمر بحسابه، فلا يمكن إرسال إشعار.<br>أبقِ الطفل في منصة المنظمين وأعلن عنه.`, scanNextBtn());
      else showRes("err", "x", "تعذّر قراءة السوار", esc(errMsg(e)), scanNextBtn(), 8000);
    }
  }

  /* ---------- مشغّل اللعبة: «لعبتي» ---------- */
  const opGame = () => { const l = S.myGames || []; if (!S.work.game || !l.find((g) => g.id === S.work.game)) S.work.game = (l.find((g) => g.event === EV) || l[0] || {}).id; return l.find((g) => g.id === S.work.game) || {}; };
  function renderOperator(sw) {
    const l = S.myGames || [], g = opGame();
    onTicket = orgTicket;
    onScan = () => showRes("warn", "award", "هذا جواز رقمي", "الجواز يمسحه موظف الكشك أو منظم المهرجان. امسح <b>تذكرة اللعبة</b> من «تذاكري» في جوال الزائر.", scanNextBtn(), 7000);
    scr.innerHTML = `<div class="ohead" style="background:linear-gradient(150deg,#B07400,#7A4F00)">${sw}
        <div class="between"><div><div style="font-size:12.5px;opacity:.85">مشغّل اللعبة · ${esc(firstName(myName()))}</div><h2>${esc(g.name || "")}</h2></div>${g.active === false ? '<span class="st st-mute">متوقفة</span>' : ""}</div>
        ${l.length > 1 ? `<select data-c="op-game" aria-label="اللعبة">${l.map((x) => `<option value="${esc(x.id)}" ${x.id === g.id ? "selected" : ""}>${esc(x.name)} · ${esc((x.event_name || "").split("—")[0].trim())}</option>`).join("")}</select>` : ""}
        <span style="font-size:13px;opacity:.9">${esc((g.event_name || "").split("—")[0].trim())} · ${fmtPrice(g.price_baisa || 0)} للتذكرة${g.min_age ? ` · +${g.min_age} سنوات` : ""}</span></div>
      <div class="pad stack" style="padding-top:16px">
        ${scanUI("امسح تذكرة الزائر", "استلام الدفع · تسجيل الدخول")}
        <div class="kpis3"><div><b class="num">${g.today_entered || 0}</b><span>دخلوا اليوم</span></div><div><b class="num" style="font-size:16px">${g.today_paid ? fmtPrice(g.today_paid) : "0"}</b><span>دفع اليوم</span></div><div><b class="num">${g.entered || 0}/${g.paid || 0}</b><span>دخلوا/مدفوعة</span></div></div>
        <p class="sub" style="text-align:center">الزائر يعرض التذكرة من «تذاكري». إذا ما دفع، استلم المبلغ ثم سجّل دخوله.</p>
      </div>`;
  }
  async function refreshMyGames() { try { S.myGames = await A.urpc("my_games"); } catch (e) { /* ignore */ } }

  /* ---------- الشريك: متابعة تأكيد المكافأة من الزائر ---------- */
  let rwTimer = null;
  function watchReward(id, reward, final, offer) {
    clearInterval(rwTimer); const t0 = Date.now();
    rwTimer = setInterval(async () => {
      const el = $("#rwState"); if (!el || Date.now() - t0 > 180000) { clearInterval(rwTimer); return; }
      let r; try { r = await A.urpc("staff_reward_status", { p_stall: S.work.stall, p_id: id }); } catch (e) { return; }
      if (r.status === "confirmed") {
        clearInterval(rwTimer); try { if (navigator.vibrate) navigator.vibrate([60, 40, 60]); } catch (x) { /* ignore */ }
        showRes("ok", "check", offer ? "أكّد الزائر استلام العرض ✓" : "أكّد الزائر استلام المكافأة ✓", `<b>${esc(reward)}</b>${offer ? "<br>انحسبت لك زيارة في صندوق الجواز." : final ? "<br>اكتملت بطاقته، وتبدأ له بطاقة جديدة." : ""}`, scanNextBtn(), 6000, () => { const x = $("#scanRes"); if (x) x.innerHTML = ""; });
        loadStaffStats();
      } else if (r.status === "declined") {
        clearInterval(rwTimer);
        showRes("warn", "gift", offer ? "الزائر يقول ما حصل على العرض" : "الزائر يقول ما حصل على المكافأة", `طبّق <b>${esc(reward)}</b> على طلبه، ثم <b>امسح رمزه مرة ثانية</b> ليؤكد الاستلام.<br><span class="sub">${offer ? "الزيارة ما تنحسب لك إلا بعد تأكيده." : "المكافأة باقية له ولن تُحسب إلا بعد تأكيده."}</span>`, scanNextBtn());
      }
    }, 2000);
  }

  /* ---------- مشغّل اللعبة: تذاكر الألعاب ---------- */
  const tktCount = (n) => n === 1 ? "تذكرة واحدة" : n === 2 ? "تذكرتان" : n + " تذاكر";
  async function orgTicket(code) {
    try {
      const d = await A.urpc("ticket_lookup", { p_event: orgEv(), p_code: code });
      const head = `<b>${esc(d.game)}</b> · ${esc(d.name)} · ${tktCount(d.qty)}${d.min_age ? `<br><span class="sub">العمر المسموح: +${d.min_age} سنوات</span>` : ""}`;
      if (d.status === "pending_payment") return showRes("warn", "lock", "تذكرة بانتظار الدفع", `${head}<br>المبلغ المطلوب: <b>${fmtPrice(d.amount_baisa)}</b>`,
        `<div class="row" style="gap:8px;width:100%"><button class="btn btn-cta btn-sm" style="flex:1" data-a="ticket-pay" data-code="${esc(d.code)}" data-m="cash">استلمت نقدًا</button><button class="btn btn-line btn-sm" style="flex:1" data-a="ticket-pay" data-code="${esc(d.code)}" data-m="transfer">تحويل بنكي</button></div>`);
      if (d.status === "active") {
        const left = d.qty - d.used, opts = [...new Set([1, Math.min(2, left), left])].filter((n) => n >= 1 && n <= left);
        return showRes("ok", "b:ticket", "تذكرة صالحة", `${head}<br>المتبقي للدخول: <b>${left}</b> من ${d.qty}`,
          `<div class="row" style="gap:8px;width:100%;flex-wrap:wrap">${opts.map((n) => `<button class="btn ${n === left ? "btn-cta" : "btn-line"} btn-sm" style="flex:1" data-a="ticket-use" data-code="${esc(d.code)}" data-n="${n}">${n === left && left > 1 ? `دخول الكل (${n})` : `دخول ${n}`}</button>`).join("")}</div>`);
      }
      showRes("err", "x", "التذكرة مستخدمة", `${head}<br>دخل ${d.used} من ${d.qty}.`, scanNextBtn(), 7000);
    } catch (e) {
      if (e.code === "ticket_other_game") return showRes("warn", "b:ticket", "تذكرة لعبة أخرى", `هذه التذكرة للعبة <b>${esc((e.data || {}).game || "")}</b>. وجّه الزائر لها.`, scanNextBtn(), 8000);
      showRes("err", "x", "لم يُعثر على التذكرة", esc(errMsg(e)), scanNextBtn(), 7000);
    }
  }

  /* ---------- طلب المنظم ---------- */
  async function loadOrgApply() {
    const box = $("#oaBody"); if (!box) return;
    if (!S.me) return requireLogin("organizer", "organizer");
    let r = null, evs = [];
    try { [r, evs] = await Promise.all([A.urpc("my_organizer_request"), A.rpc("list_events")]); r = r.request; }
    catch (e) { box.innerHTML = `<div class="msg err">${esc(errMsg(e))}</div>`; return; }
    r = r || {};
    const st = r.status;
    const statusBox = st ? `<div class="result ${st === "approved" ? "r-ok" : st === "rejected" ? "r-err" : "r-warn"}" style="padding:14px">
        <h3 style="font-size:17px">${st === "approved" ? "تم اعتمادك كمنظم" : st === "rejected" ? "لم يُعتمد الطلب" : "طلبك قيد مراجعة فريق شُرفة"}</h3>
        <span class="sub" style="color:var(--ink)">${st === "approved" ? "تبويب «الاعتماد» متاح لك الآن لمسح جوازات الزوار وتفعيلها." : st === "rejected" ? (r.review_note ? "ملاحظة: " + esc(r.review_note) : "يمكنك تعديل البيانات وإعادة الإرسال.") : "سنراجع بيانات الجهة والفعالية ونفعّل لك أداة اعتماد الجوازات بعد الموافقة."}</span>
        ${st === "approved" ? `<button class="btn btn-dark btn-sm" data-a="org-open">${ic("scan", 18)} افتح اعتماد الجوازات</button>` : ""}</div>` : "";
    if (st === "approved") { box.innerHTML = statusBox; return; }
    const evOpts = evs.map((e) => `<label class="opt"><input type="radio" name="event" value="${esc(e.id)}" ${r.event === e.id || (!r.event && !r.event_name && e.id === EV) ? "checked" : ""}><span class="grow">${esc(e.name)}</span></label>`).join("");
    box.innerHTML = `${statusBox}
      ${st ? "" : `<div class="row" style="gap:8px"><span class="st st-mute">1 الحساب ✓</span><span class="sub">←</span><span class="st st-teal">2 الجهة والفعالية</span></div>`}
      <form class="stack" data-f="orgapply" novalidate>
        <div class="card stack" style="gap:12px"><b>الجهة المنظمة</b>
          <div class="field"><label for="oa-org">اسم الجهة</label><input class="input" id="oa-org" name="org" maxlength="80" placeholder="مثال: جماعة التجارة — جامعة السلطان قابوس" value="${esc(r.org || "")}" required></div>
          <div class="field"><label for="oa-pos">منصبك</label><input class="input" id="oa-pos" name="position" maxlength="60" placeholder="مثال: رئيس اللجنة المنظمة" value="${esc(r.position || "")}"></div>
          <div class="field"><label for="oa-ph">رقم التواصل</label><input class="input" id="oa-ph" name="phone" inputmode="tel" dir="ltr" style="text-align:right" value="${esc(r.phone || (S.me.profile || {}).phone || "")}"></div>
        </div>
        <div class="card stack" style="gap:10px"><b>الفعالية</b>
          ${evOpts}
          <label class="opt"><input type="radio" name="event" value="" ${!r.event && r.event_name ? "checked" : ""}><span class="grow">فعالية جديدة غير موجودة في شُرفة</span></label>
          <div class="stack" id="oaNew" style="gap:10px">
            <div class="field"><label for="oa-en">اسم الفعالية</label><input class="input" id="oa-en" name="event_name" maxlength="80" value="${esc(r.event_name || "")}"></div>
            <div class="field"><label for="oa-ed">التاريخ</label><input class="input" id="oa-ed" name="event_date" maxlength="60" placeholder="مثال: 20 – 25 ديسمبر 2026" value="${esc(r.event_date || "")}"></div>
            <div class="field"><label for="oa-el">المكان</label><input class="input" id="oa-el" name="event_location" maxlength="80" value="${esc(r.event_location || "")}"></div>
          </div>
        </div>
        <div class="field"><label for="oa-note">ملاحظات (اختياري)</label><textarea class="input" id="oa-note" name="note" maxlength="400" rows="3" style="height:auto;padding:10px 14px">${esc(r.note || "")}</textarea></div>
        <label class="check"><input type="checkbox" name="consent" ${r.org ? "checked" : ""}> <span>أؤكد أنني مخوّل بتمثيل الجهة المنظمة، وألتزم بحماية بيانات الزوار.</span></label>
        <div id="oaMsg"></div>
        <button class="btn btn-cta" type="submit">${st ? "إعادة إرسال الطلب" : "إرسال الطلب لفريق شُرفة"}</button>
      </form>`;
    toggleNewEvent();
  }
  function toggleNewEvent() {
    const f = $("form[data-f=orgapply]"); if (!f) return;
    const v = (f.querySelector("input[name=event]:checked") || {}).value;
    $("#oaNew").hidden = !!v;
  }

  /* ---------- إدارة شُرفة: اعتماد المنظمين ---------- */
  async function loadPlatform() {
    const box = $("#pfBody"); if (!box) return;
    try {
      const all = await A.urpc("shurfa_list_org_requests");
      const list = S.tab === "admin" ? all.filter((r) => r.event === adminEv() || !r.event) : all;
      const ST = { pending: ["قيد المراجعة", "st-warn"], approved: ["معتمد", "st-ok"], rejected: ["مرفوض", "st-err"] };
      box.innerHTML = list.length ? list.map((r) => `<div class="card stack" style="gap:8px">
          <div class="between"><b>${esc(r.org)}</b><span class="st ${ST[r.status][1]}">${ST[r.status][0]}</span></div>
          <span class="sub">${esc(r.name || "")}${r.position ? " · " + esc(r.position) : ""}</span>
          <span class="sub" dir="ltr" style="text-align:right">${esc(r.email || "")}${r.phone ? " · " + esc(r.phone) : ""}</span>
          <div class="card flat" style="padding:10px 12px"><span class="sub">الفعالية</span><div><b>${esc(r.event_title || r.event_name || "")}</b></div>
            ${r.event ? "" : `<span class="sub">${esc([r.event_date, r.event_location].filter(Boolean).join(" · "))} · فعالية جديدة (تُضاف لاحقًا)</span>`}</div>
          ${r.note ? `<span class="sub">ملاحظات: ${esc(r.note)}</span>` : ""}
          ${r.review_note ? `<span class="sub">ملاحظة المراجعة: ${esc(r.review_note)}</span>` : ""}
          ${r.status === "pending" ? `<div class="row" style="gap:8px"><button class="btn btn-dark btn-sm" style="flex:1" data-a="org-review" data-id="${esc(r.id)}" data-ok="1">${ic("check", 18, 2)} اعتماد</button><button class="btn btn-danger btn-sm" style="flex:1" data-a="org-review" data-id="${esc(r.id)}" data-ok="0">رفض</button></div>`
            : r.status === "approved" ? `<button class="linkbtn" data-a="org-review" data-id="${esc(r.id)}" data-ok="0" style="color:var(--err);align-self:flex-start">إيقاف صلاحية المنظم</button>`
            : `<button class="linkbtn" data-a="org-review" data-id="${esc(r.id)}" data-ok="1" style="align-self:flex-start">اعتماد</button>`}
        </div>`).join("") : `<div class="empty card">${ic("users", 36)}<b>لا توجد طلبات منظمين بعد</b><span>رابط تسجيل المنظمين: <b dir="ltr">${esc(location.origin + location.pathname)}?role=organizer</b></span></div>`;
    } catch (e) { box.innerHTML = `<div class="msg err">${esc(errMsg(e))}</div>`; }
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
    const locked = st.status === "approved";   // بعد الاعتماد: البطاقة يعدّلها مدير النظام فقط
    const ev = evById(EV) || {};
    if (st.id) { try { const so = await A.urpc("stall_offer", { p_stall: st.id }); ptOffer = (so && so.offer) || null; ptItems = (so && so.items) || []; } catch (e) { ptOffer = null; ptItems = []; } }
    else { ptOffer = null; ptItems = []; }
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
          <div class="field"><label for="pt-kind">النوع</label><select class="input" id="pt-kind" name="kind" data-c="pt-kind">${Object.entries(A.KIND).map(([k, l]) => `<option value="${k}" ${p.kind === k ? "selected" : ""}>${l}</option>`).join("")}</select></div>
          <div class="field"><label for="pt-desc">نبذة قصيرة</label><textarea class="input" id="pt-desc" name="description" maxlength="300" rows="3" style="height:auto;padding:10px 14px">${esc(p.description || "")}</textarea></div>
          <div class="field"><label for="pt-phone">رقم التواصل</label><input class="input" id="pt-phone" name="phone" inputmode="tel" dir="ltr" style="text-align:right" value="${esc(p.phone || (S.me.profile || {}).phone || "")}"></div>
          <div class="field"><label for="pt-ig">انستقرام (اختياري)</label><input class="input" id="pt-ig" name="instagram" dir="ltr" placeholder="@shop" value="${esc(p.instagram ? "@" + p.instagram : "")}"></div>
        </div>
        <div id="ptOfferBox">${offerBoxHTML(p.kind || "food", ptOffer, ptItems, locked)}</div>
        <div class="card stack" style="gap:10px"><b>المشاركة</b>
          <label class="opt"><input type="radio" name="event" value="${esc(EV)}" checked><span class="grow">${esc((ev.name || EV).split("—")[0].trim())}<span class="sub" style="display:block;font-weight:500">يراجع المنظم طلبك قبل ظهوره للزوار</span></span></label>
          <label class="opt"><input type="radio" name="event" value=""><span class="grow">شريك في شُرفة بشكل عام<span class="sub" style="display:block;font-weight:500">نحفظ بياناتك ونتواصل معك للفعاليات القادمة</span></span></label>
        </div>
        <label class="check"><input type="checkbox" name="consent" ${p.name ? "checked" : ""}> <span id="ptConsentTxt">${consentTxt(p.kind || "food")}</span></label>
        <div id="ptMsg"></div>
        <button class="btn btn-cta" type="submit">${st.status ? "حفظ التعديلات" : "إرسال طلب الشراكة"}</button>
      </form>`;
    previewOffer();
  }

  /* ---------- عرض الشريك: خصم الكشك + منتجاته في باقات شُرفة، أو تذكرة لعبة ---------- */
  let ptOffer = null, ptItems = [];
  const omr = (b) => `${(Math.round(b || 0) / 1000).toLocaleString("en", { maximumFractionDigits: 3 })} ريال`;
  const toBaisa = (v) => { const n = parseFloat(String(v || "").replace(/[٠-٩]/g, (d) => "٠١٢٣٤٥٦٧٨٩".indexOf(d)).replace(",", ".")); return isFinite(n) ? Math.round(n * 1000) : NaN; };
  const savePct = (b, a) => (b > 0 && a < b ? Math.round((1 - a / b) * 100) : 0);
  const CAT = { meal: "وجبة", drink: "مشروب", dessert: "حلى", snack: "سناك", other: "أخرى" };
  const CAT_IC = { meal: "food", drink: "cafe", dessert: "sweets", snack: "star", other: "gift" };
  const consentTxt = (kind) => kind === "games"
    ? "أؤكد صحة البيانات، وألتزم بسعر شُرفة للتذاكر المحجوزة من التطبيق."
    : "أؤكد صحة البيانات، وألتزم بخصمي لحاملي الجواز، وبأسعار منتجاتي داخل باقات شُرفة.";
  function offerLabel(o) {
    if (!o) return "";
    if (o.type === "ticket") return `تذكرة بـ ${omr(o.online)} بدل ${omr(o.door)}`.slice(0, 40);
    return `خصم ${o.pct}%${o.on ? " " + o.on : ""}`.slice(0, 40);
  }
  const discountOn = (o) => (o.scope === "items" && (o.items || []).length ? "على " + o.items.join(" و") : "على كل المنيو");
  // بطاقة العرض كما يشوفها الزائر (الجواز وصفحة الكشك ومعاينة الشريك)
  function dealHTML(o, opt = {}) {
    if (!o) return opt.fallback ? `<p style="font-size:16px;font-weight:700;margin:4px 0">${ic("gift", 18)} ${esc(opt.fallback)}</p>` : "";
    if (o.type === "ticket") return `<div class="deal"><div class="deal-head"><span class="deal-pct deal-tk">${bi("ticket")}</span>
        <span class="grow"><b>تذكرة بسعر شُرفة</b><span class="sub" style="display:block">احجزها من «تذاكر الألعاب»</span></span></div>
        <div class="deal-row"><span>عند الشباك</span><s>${omr(o.door)}</s></div>
        <div class="deal-row"><span>من شُرفة</span><b>${omr(o.online)}</b><span class="st st-ok">وفّر ${savePct(o.door, o.online)}%</span></div>
        ${o.note ? `<span class="sub">${esc(o.note)}</span>` : ""}</div>`;
    const its = o.scope === "items" ? (o.items || []) : [];
    return `<div class="deal"><div class="deal-head"><span class="deal-pct">${esc(o.pct)}%</span>
        <span class="grow"><b>خصم ${esc(o.pct)}%</b><span class="sub" style="display:block">${its.length ? "على منتجات محددة" : "على كل المنيو"}</span></span></div>
        ${its.length ? `<div class="chip-list">${its.map((x) => `<span>${esc(x)}</span>`).join("")}</div>` : ""}</div>`;
  }
  // منتج في باقات شُرفة (سطر في النموذج)
  function itemRow(k, i, locked) {
    const dis = locked ? "disabled" : "";
    return `<div class="card flat stack pt-item" data-id="${esc(k.id || "")}" style="gap:8px;padding:12px">
        <div class="between"><b style="font-size:14px">منتج ${i + 1}</b>${locked ? "" : `<button type="button" class="linkbtn" data-a="pt-item-del" style="padding:0;min-height:auto;color:var(--err)">${ic("trash", 14)} حذف</button>`}</div>
        <div class="row" style="gap:8px">
          <input class="input grow" name="it_name" maxlength="40" placeholder="اسم المنتج، مثال: برجر لحم" value="${esc(k.name || "")}" ${dis} data-c="pt-offer" aria-label="اسم المنتج">
          <select class="input" name="it_cat" style="width:104px" ${dis} data-c="pt-offer" aria-label="النوع">${Object.entries(CAT).map(([c, l]) => `<option value="${c}" ${(k.category || "meal") === c ? "selected" : ""}>${l}</option>`).join("")}</select></div>
        <div class="row" style="gap:8px;align-items:flex-end">
          <div class="field grow"><label>سعره العادي (ريال)</label><input class="input" name="it_before" inputmode="decimal" dir="ltr" placeholder="2" value="${k.before ? k.before / 1000 : ""}" ${dis} data-c="pt-offer"></div>
          <div class="field grow"><label>سعره في الباقة (ريال)</label><input class="input" name="it_after" inputmode="decimal" dir="ltr" placeholder="1.5" value="${k.before && k.after != null ? k.after / 1000 : ""}" ${dis} data-c="pt-offer"></div></div>
      </div>`;
  }
  function poolExplainHTML() {
    const e = EVDB[EV] || {}, pct = e.pool_pct ?? 40, price = (evById(EV) || {}).price_baisa || e.price_baisa || 1000;
    const passes = 300, total = 600, mine = 60, pool = Math.round(passes * price * pct / 100), share = Math.round(pool * mine / total);
    return `<div class="card flat stack" style="gap:8px;padding:14px;background:var(--gold-soft)">
        <b class="ihead" style="font-size:15px">${ic("chart", 16)} كم تجمع؟ وكم زيارة؟</b>
        <span class="sub" style="color:var(--ink);line-height:1.8">• من كل جواز ينباع (${omr(price)}) يروح <b>${pct}%</b> لصندوق الشركاء، يعني <b>${omr(price * pct / 100)}</b> عن كل جواز.<br>
        • كل زائر تخدمه بخصمك أو بمنتج من باقة = <b>زيارة وحدة</b> لكشكك (مرة لكل زائر).<br>
        • نصيبك = (زياراتك ÷ زيارات كل الأكشاك) × الصندوق، ويتحوّل لك بعد الفعالية.</span>
        <div class="pool-ex"><div><span>${passes} جواز</span><b>${omr(pool)}</b><small>الصندوق</small></div><div><span>${mine} من ${total} زيارة</span><b>${Math.round(mine * 100 / total)}%</b><small>حصتك</small></div><div><span>نصيبك</span><b>${omr(share)}</b><small>غير مبيعاتك</small></div></div>
        <span class="sub">مثال توضيحي. تتابع زياراتك ونصيبك أول بأول من «كشكي».</span></div>`;
  }
  function offerBoxHTML(kind, o, items, locked) {
    const dis = locked ? "disabled" : "";
    const lockMsg = locked ? `<div class="msg info">العرض معتمد. لأي تعديل تواصل مع إدارة شُرفة.</div>` : "";
    if (kind === "games") {
      const t = o && o.type === "ticket" ? o : {};
      return `<div class="card stack" style="gap:12px"><b class="ihead">${bi("ticket")} تذكرة لعبتك على شُرفة</b>
          <span class="sub">الألعاب لها <b>نظام تذاكر منفصل</b> عن خصومات الجواز. زوار شُرفة يحجزون تذكرتك من التطبيق بسعر أقل من الشباك، وأنت أو موظفك تمسح التذكرة عند الدخول.</span>
          ${lockMsg}
          <div class="row" style="gap:8px;align-items:flex-end">
            <div class="field grow"><label for="pt-door">سعر التذكرة عند الشباك (ريال)</label><input class="input" id="pt-door" name="t_door" inputmode="decimal" dir="ltr" placeholder="2" value="${t.door ? t.door / 1000 : ""}" ${dis} data-c="pt-offer"></div>
            <div class="field grow"><label for="pt-online">سعرها من شُرفة (ريال)</label><input class="input" id="pt-online" name="t_online" inputmode="decimal" dir="ltr" placeholder="1.5" value="${t.door && t.online != null ? t.online / 1000 : ""}" ${dis} data-c="pt-offer"></div></div>
          <div class="field"><label for="pt-tnote">ملاحظة للزائر (اختياري)</label><input class="input" id="pt-tnote" name="t_note" maxlength="120" placeholder="مثال: التذكرة لمدة 10 دقائق، للأعمار 6+" value="${esc(t.note || "")}" ${dis} data-c="pt-offer"></div>
          <div class="card flat stack" style="gap:6px;padding:12px"><b class="ihead" style="font-size:14px">${ic("chart", 16)} وش تستفيد؟</b>
            <span class="sub" style="line-height:1.8">• حجوزات مسبقة من زوار المهرجان قبل ما يوصلون لعبتك.<br>• دخلك من التذاكر نفسها، والألعاب ما تدخل صندوق الجواز.<br>• تشوف عدد التذاكر المحجوزة والمستخدمة من حسابك.</span></div>
          <div><span class="sub" style="font-weight:700">كذا يشوفها الزائر:</span><div id="ptOfferPrev" style="margin-top:6px"></div></div>
        </div>`;
    }
    const d = o && o.type === "discount" ? o : {}, sc = d.scope === "items" ? "items" : "all", dItems = d.items || [];
    return `<div class="card stack" style="gap:12px"><b class="ihead">${ic("gift", 18)} 1) خصمك لحاملي جواز الفعالية</b>
        <span class="sub">كل زائر معه الجواز ياخذ خصمك عند كشكك <b>مرة وحدة</b>: يعرض رمزه، تمسحه، ويدفع لك مباشرة بالسعر بعد الخصم.</span>
        ${lockMsg}
        <div class="field" style="width:130px"><label for="pt-pct">نسبة الخصم %</label><input class="input" id="pt-pct" name="o_pct" type="number" min="5" max="90" dir="ltr" placeholder="20" value="${esc(d.pct || "")}" ${dis} data-c="pt-offer"></div>
        <div class="stack" style="gap:6px"><span style="font-weight:700;font-size:14px">الخصم على:</span>
          <label class="opt"><input type="radio" name="o_scope" value="all" ${sc === "all" ? "checked" : ""} ${dis} data-c="pt-scope"><span class="grow">كل المنيو</span></label>
          <label class="opt"><input type="radio" name="o_scope" value="items" ${sc === "items" ? "checked" : ""} ${dis} data-c="pt-scope"><span class="grow">منتجات محددة</span></label></div>
        <div class="stack" id="ptScopeItems" style="gap:6px" ${sc === "items" ? "" : "hidden"}>
          ${[0, 1, 2, 3, 4].map((i) => `<input class="input" name="o_item" maxlength="40" placeholder="${i === 0 ? "مثال: برجر لحم" : "منتج آخر (اختياري)"}" value="${esc(dItems[i] || "")}" ${dis} data-c="pt-offer" aria-label="منتج عليه الخصم ${i + 1}">`).join("")}</div>
        <div><span class="sub" style="font-weight:700">كذا يشوفه الزائر في جوازه:</span><div id="ptOfferPrev" style="margin-top:6px"></div></div>
      </div>
      <div class="card stack" style="gap:12px;margin-top:12px"><b class="ihead">${ic("grid", 18)} 2) منتجاتك في باقات شُرفة <span class="sub" style="font-weight:500">(اختياري)</span></b>
        <span class="sub" style="line-height:1.8">باقات شُرفة تجمع منتجات من <b>أكثر من كشك</b>: برجر من كشك، ومشروب من كشك ثاني، وحلى من ثالث.
          الباقات: <b>باقة الفرد، باقة العائلة، باقة الربع</b>، وباقة يكوّنها الزائر بنفسه. أضف المنتجات اللي توافق تدخل الباقات، وحدد سعرها داخل الباقة.
          الزائر يدفع لك سعر منتجك مباشرة لما يستلمه.</span>
        <div class="stack" id="ptItems" style="gap:8px">${(items || []).map((k, i) => itemRow(k, i, locked)).join("")}</div>
        ${locked ? "" : `<button type="button" class="btn btn-soft btn-sm" data-a="pt-item-add" ${(items || []).length >= 6 ? "hidden" : ""}>+ أضف منتج للباقات</button>`}
      </div>
      <div style="margin-top:12px">${poolExplainHTML()}</div>`;
  }
  // يقرأ العرض والمنتجات من النموذج: {offer, items} أو {error}
  function readOffer(f) {
    const kind = f.kind.value;
    if (kind === "games") {
      const door = toBaisa(f.t_door.value), online = toBaisa(f.t_online.value);
      if (!(door >= 100 && door <= 100000) || !(online >= 0 && online < door)) return { error: "bad_ticket" };
      return { offer: { type: "ticket", door, online, note: f.t_note.value.trim() || null }, items: [] };
    }
    const pct = parseInt(f.o_pct.value, 10);
    if (!(pct >= 5 && pct <= 90)) return { error: "bad_discount" };
    const scope = (f.querySelector("input[name=o_scope]:checked") || {}).value === "items" ? "items" : "all";
    const dItems = scope === "items" ? [...f.querySelectorAll("input[name=o_item]")].map((x) => x.value.trim()).filter((x) => x.length >= 2) : [];
    if (scope === "items" && !dItems.length) return { error: "bad_discount_items" };
    const items = [];
    for (const r of f.querySelectorAll(".pt-item")) {
      const name = r.querySelector("[name=it_name]").value.trim(), category = r.querySelector("[name=it_cat]").value;
      const before = toBaisa(r.querySelector("[name=it_before]").value), after = toBaisa(r.querySelector("[name=it_after]").value);
      if (!name && !(before > 0)) continue;   // سطر فاضي يُتجاهل
      if (name.length < 2 || !(before >= 100 && before <= 100000) || !(after >= 0 && after < before)) return { error: "bad_item" };
      items.push({ id: r.dataset.id || null, name, category, before, after });
    }
    const offer = { type: "discount", pct, scope, items: dItems };
    offer.on = discountOn(offer);
    return { offer, items };
  }
  function previewOffer() {
    const f = $("form[data-f=partner]"), box = $("#ptOfferPrev"); if (!f || !box) return;
    const r = readOffer(f);
    if (r.offer) { box.innerHTML = dealHTML(r.offer); return; }
    const fill = f.kind.value === "games" ? { type: "ticket", door: 2000, online: 1500 } : { type: "discount", pct: 20, scope: "all" };
    box.innerHTML = `<div style="opacity:.55">${dealHTML(fill)}</div>`;
  }
  async function uploadLogo(file, maxSide = 400) {
    if (!/^image\/(png|jpeg|webp)$/.test(file.type)) throw { code: "bad_logo" };
    const bmp = await new Promise((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = rej; i.src = URL.createObjectURL(file); });
    const n = maxSide, sc = Math.min(1, n / Math.max(bmp.width, bmp.height));
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
      method: "POST", headers: { apikey: A.SB.anonKey, Authorization: "Bearer " + token, "Content-Type": blob.type }, body: blob
    });
    if (!r.ok) { let t = ""; try { t = await r.text(); } catch (x) { /* ignore */ } throw { code: "upload_failed" }; }
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
    clearInterval(pulseT); pulseKey = null; closeOverlay(false);
    S.me = null; S.pass = null; S.tab = "home"; S.sub = null; S.email = ""; S.work = { stall: null, mode: "stall", res: null, last: null, busy: false };
    setRole("visitor"); A.session.del("after");
    render();
  }

  /* =========================================================
     الأحداث
     ========================================================= */
  document.addEventListener("click", async (ev) => {
    if (ev.target.closest("#menuBtn")) { const d = $("#drawer"), open = d.hidden; d.hidden = !open; $("#menuBtn").setAttribute("aria-expanded", String(open)); return; }
    const b = ev.target.closest("[data-a]"); if (!b) return;
    const a = b.dataset.a;
    if (a === "go-tab") { S.tab = b.dataset.tab; S.sub = null; S.authOpen = false; render(); }
    else if (a === "sub") { S.sub = { name: b.dataset.name, id: b.dataset.id, title: b.dataset.title }; render(); }
    else if (a === "back") { const st = history.state; if (st && st.s && st.depth > 1 && st.sub) history.back(); else { S.sub = null; render(); } }
    else if (a === "ovl-close") closeOverlay();
    else if (a === "adm-deal") {
      const box = $("#admDeal-" + b.dataset.id); if (!box) return;
      if (box.innerHTML) { box.innerHTML = ""; return; }
      try { const d = await A.urpc("stall_offer", { p_stall: b.dataset.id }); box.innerHTML = (d.offer ? `<div style="margin-top:8px">${dealHTML(d.offer)}</div>` : `<span class="sub">ما فيه تفاصيل خصم.</span>`)
        + ((d.items || []).length ? `<div class="card flat" style="padding:2px 12px;margin-top:8px"><span class="sub" style="font-weight:700;display:block;padding-top:8px">منتجاته في الباقات</span>${d.items.map((i) => `<div class="li"><div class="grow"><b style="font-size:14px">${esc(i.name)}</b><div class="sub">${esc(CAT[i.category] || "")}</div></div><span class="deal-price"><s>${omr(i.before)}</s><b>${omr(i.after)}</b></span></div>`).join("")}</div>` : ""); }
      catch (e) { toast(errMsg(e), "err"); }
    }
    else if (/^pk-(tab|q|take|save|cancel)$/.test(a)) pkAction(a, b);
    else if (a === "lk-disc" || a === "lk-line") {
      if (S.work.busy || !S.work.last) return; S.work.busy = true; b.disabled = true;
      try {
        const d = a === "lk-disc" ? await A.urpc("staff_scan_offer", { p_stall: S.work.stall, p_code: S.work.last, p_choice: 0 })
          : await A.urpc("staff_redeem_line", { p_stall: S.work.stall, p_code: S.work.last, p_line: b.dataset.id });
        offerResult(d);
      } catch (e) { scanErr(e); }
      finally { S.work.busy = false; }
    }
    else if (a === "pt-item-add") {
      const list = $("#ptItems"); if (!list) return;
      const n = list.querySelectorAll(".pt-item").length; if (n >= 6) return;
      list.insertAdjacentHTML("beforeend", itemRow({}, n, false));
      if (n + 1 >= 6) b.hidden = true;
      list.lastElementChild.querySelector("input").focus();
    }
    else if (a === "pt-item-del") {
      b.closest(".pt-item").remove();
      document.querySelectorAll("#ptItems .pt-item").forEach((r, i) => { r.querySelector("b").textContent = `منتج ${i + 1}`; });
      const add = $("[data-a=pt-item-add]"); if (add) add.hidden = false;
    }
    else if (a === "card-edit") {
      const box = $("#cardv-" + b.dataset.id); if (!box) return;
      box.innerHTML = `<form class="stack" data-f="card-admin" data-id="${esc(b.dataset.id)}" style="gap:8px"><b style="font-size:14px">تعديل بطاقة الولاء (إدارة شُرفة)</b>
        <div class="grid2"><div class="field"><label>عدد الزيارات</label><input class="input" name="required" type="number" min="1" max="20" value="${esc(b.dataset.req)}"></div>
        <div class="field"><label>الفاصل (دقائق)</label><input class="input" name="cooldown" type="number" min="0" max="1440" value="${esc(b.dataset.cd)}"></div></div>
        <div class="field"><label>المكافأة الأولى</label><input class="input" name="reward1" maxlength="40" value="${esc(b.dataset.r1)}"></div>
        <div class="field"><label>مكافأة ثانية (اختياري)</label><input class="input" name="reward2" maxlength="40" value="${esc(b.dataset.r2)}"></div>
        <span class="sub" style="color:var(--warn)">تغيير عدد الزيارات يغيّر مكان الزوار في بطاقاتهم. يُفضّل تعديله قبل بدء الفعالية.</span>
        <div class="row" style="gap:8px"><button class="btn btn-dark btn-sm" type="submit" style="flex:1">حفظ البطاقة</button><button class="btn btn-line btn-sm" type="button" data-a="card-cancel" style="flex:1">إلغاء</button></div></form>`;
    }
    else if (a === "card-cancel") loadAdminPartners();
    else if (a === "pool-csv" && S.poolData) {
      const p = S.poolData, R = (b) => (b / 1000).toFixed(3);
      A.csvDownload(`shurfa-pool-${adminEv()}.csv`, [["الترتيب", "الشريك", "العرض", "الزيارات", "المؤكدة", "النسبة %", "النصيب (ر.ع)"],
        ...p.stalls.map((x) => [x.rank, x.name, x.offer, x.visits, x.confirmed, x.share_pct, R(x.amount_baisa)]),
        [], ["مبيعات الجواز", R(p.revenue_baisa)], ["الصندوق", R(p.pool_baisa)], ["نصيب شُرفة", R(p.revenue_baisa - p.pool_baisa)]]);
    }
    else if (a === "reward-yes" || a === "reward-no") {
      const ok = a === "reward-yes"; b.disabled = true;
      try {
        const r = await A.urpc("confirm_reward", { p_id: +b.dataset.id, p_ok: ok });
        askingReward = 0; closeOverlay(false); await loadPass(); if (S.passFill) S.passFill();
        if (ok && isOffers()) overlay({ k: "ok", icon: "check", title: "استمتع بالعرض 🎉", body: `<b>${esc(r.reward)}</b> من ${esc(r.stall)}<br>شوف باقي العروض في جوازك.`, auto: 7000 });
        else if (ok) overlay({ k: "ok", icon: "check", title: "استمتع بمكافأتك 🎉", body: `<b>${esc(r.reward)}</b> من ${esc(r.stall)}<br>${r.final ? "اكتملت بطاقتك، وتبدأ بطاقة جديدة من زيارتك القادمة." : r.next_reward ? `زيارتك القادمة: <b>${esc(r.next_reward)}</b>` : ""}`, auto: 7000 });
        else overlay({ k: "warn", icon: "gift", title: "أخبر مزود الخدمة", body: `عندك ${isOffers() ? "عرض" : "مكافأة"} <b>${esc(r.reward)}</b> في ${esc(r.stall)}.<br>أخبر الموظف ليطبّقه على طلبك، ثم يمسح رمزك مرة ثانية لتأكيده.<br><span class="sub">${isOffers() ? "العرض باقٍ لك ولن يضيع." : "مكافأتك باقية ولن تضيع."}</span>` });
        if (S.pass && (S.pass.pending_rewards || []).length && ok) setTimeout(() => askReward(S.pass.pending_rewards[0]), 7500);
      } catch (e) { b.disabled = false; toast(errMsg(e), "err"); }
    }
    else if (a === "ev-go") { const g = b.dataset.go, id = b.dataset.id; location.href = location.pathname + "?e=" + encodeURIComponent(id) + (g && g !== "home" ? "&go=" + g + (g === "soon" ? "&k=" + (b.dataset.k || "") : "") : ""); }
    else if (a === "band-login") requireLogin("band", "visitor");
    else if (a === "mfa-start") {
      b.disabled = true;
      try {
        const d = await A.auth.mfaEnroll(); S.mfaFactor = d.id;
        $("#mfaBody").innerHTML = `<div class="card stack" style="gap:12px;align-items:center;text-align:center">
            <b>امسح الرمز بتطبيق المصادقة</b>
            <img src="${esc(d.totp.qr_code)}" alt="رمز QR للتحقق بخطوتين" style="width:200px;height:200px;background:#fff;border-radius:12px;padding:6px">
            <span class="sub">أو أدخل هذا المفتاح يدويًا:</span><code dir="ltr" style="word-break:break-all;font-size:14px">${esc(d.totp.secret)}</code></div>
          <form class="card stack" data-f="mfa-enroll" style="gap:10px">
            <div class="field"><label for="mf-code">الرمز من التطبيق</label><input class="input code" id="mf-code" name="code" inputmode="numeric" autocomplete="one-time-code" maxlength="6" placeholder="••••••" required></div>
            <div id="mf-msg"></div><button class="btn btn-cta" type="submit">تأكيد وتفعيل</button></form>`;
      } catch (e) { b.disabled = false; toast(errMsg(e), "err"); }
    }
    else if (a === "mfa-off") {
      if (!confirm("إيقاف التحقق بخطوتين؟ سيصير الدخول بكلمة المرور فقط.")) return;
      try { await A.auth.mfaUnenroll(b.dataset.id); toast("أُوقف التحقق بخطوتين", "ok"); loadMfaScreen(); } catch (e) { toast(errMsg(e), "err"); }
    }
    else if (a === "qty") {
      const id = b.dataset.id, el = $("#q-" + id), up = b.parentElement.querySelector("[data-max]"), max = +(up && up.dataset.max) || 10;
      const n = Math.min(max, Math.max(1, (+el.textContent || 1) + (+b.dataset.d))); el.textContent = n;
      const bk = document.querySelector(`[data-a="game-book"][data-id="${id}"]`); if (bk) $("#t-" + id).textContent = fmtPrice(+bk.dataset.price * n);
    }
    else if (a === "game-book") {
      if (!S.me) return requireLogin("games", "visitor");
      const n = +($("#q-" + b.dataset.id) || {}).textContent || 1; b.disabled = true;
      try {
        const d = await A.urpc("book_game", { p_game: b.dataset.id, p_qty: n });
        await Promise.all([loadTickets(), loadGames()]); tickSig = null;
        S.sub = { name: "tickets" }; render();
        overlay(d.status === "active" ? { k: "ok", icon: "b:ticket", title: "تذكرتك جاهزة 🎟️", body: "اعرض الرمز لمشغّل اللعبة عند الدخول.", auto: 6000 }
          : { k: "gold", icon: "b:ticket", title: "تم الحجز ✓", body: `ادفع <b>${fmtPrice(d.amount_baisa)}</b> عند اللعبة لمشغّلها واعرض رمز التذكرة،<br>وتتفعّل مباشرة ويوصلك إشعار.`, auto: 9000 });
      } catch (e) { b.disabled = false; toast(errMsg(e), "err"); }
    }
    else if (a === "ticket-cancel") {
      if (!confirm("إلغاء هذا الحجز؟")) return;
      try { await A.urpc("cancel_my_ticket", { p_code: b.dataset.code }); await Promise.all([loadTickets(), loadGames()]); tickSig = null; toast("أُلغي الحجز", "ok"); render(); } catch (e) { toast(errMsg(e), "err"); }
    }
    else if (a === "ticket-pay") {
      b.disabled = true;
      try { await A.urpc("ticket_pay", { p_event: orgEv(), p_code: b.dataset.code, p_method: b.dataset.m });
        try { if (navigator.vibrate) navigator.vibrate([60, 40, 60]); } catch (x) { /* ignore */ }
        toast("تم استلام الدفع · وصل الزائر إشعار", "ok"); refreshMyGames(); orgTicket(b.dataset.code); }
      catch (e) { b.disabled = false; toast(errMsg(e), "err"); }
    }
    else if (a === "ticket-use") {
      b.disabled = true;
      try { const d = await A.urpc("ticket_use", { p_event: orgEv(), p_code: b.dataset.code, p_count: +b.dataset.n });
        try { if (navigator.vibrate) navigator.vibrate(60); } catch (x) { /* ignore */ }
        showRes("ok", "check", `تم تسجيل دخول ${d.entered}`, d.qty - d.used ? `المتبقي في التذكرة: <b>${d.qty - d.used}</b> من ${d.qty}` : "استُخدمت التذكرة بالكامل.", scanNextBtn(), 6000, () => { refreshMyGames().then(() => { if (S.tab === "work" && S.work.mode === "game" && !S.sub) render(); }); }); }
      catch (e) { b.disabled = false; toast(errMsg(e), "err"); }
    }
    else if (a === "game-staff-rm") {
      if (!confirm("حذف هذا المشغّل من اللعبة؟")) return;
      try { await A.urpc("admin_remove_game_staff", { p_game: b.dataset.id, p_email: b.dataset.email }); loadGameStaff(b.dataset.id); } catch (e) { toast(errMsg(e), "err"); }
    }
    else if (a === "game-new") { S.gameEdit = "new"; loadGamesAdmin(S.gameEv); }
    else if (a === "game-edit") { S.gameEdit = b.dataset.id; loadGamesAdmin(S.gameEv); }
    else if (a === "game-back") { S.gameEdit = null; loadGamesAdmin(S.gameEv); }
    else if (a === "band-unlink") {
      if (!confirm("فك ربط هذا السوار من حسابك؟ لن يصلك إشعار إذا مُسح بعد ذلك.")) return;
      try { await A.urpc("band_unlink", { p_code: b.dataset.code }); toast("تم فك الربط", "ok"); render(); } catch (e) { toast(errMsg(e), "err"); }
    }
    else if (a === "band-lost") {
      try { await A.urpc("band_set_lost", { p_code: b.dataset.code, p_lost: b.dataset.lost === "1" }); toast(b.dataset.lost === "1" ? "سُجّل السوار كمفقود" : "تم تحديث الحالة", "ok"); render(); } catch (e) { toast(errMsg(e), "err"); }
    }
    else if (a === "band-rename") {
      const n = prompt("اسم الطفل الأول (يظهر لك وحدك):", b.dataset.child || ""); if (n === null) return;
      try { await A.urpc("band_link", { p_code: b.dataset.code, p_child: n }); toast("حُفظ الاسم", "ok"); render(); } catch (e) { toast(errMsg(e), "err"); }
    }
    else if (a === "scan-next") { closeOverlay(false); toggleScan(); }
    else if (a === "login") requireLogin(null, null);
    else if (a === "who") { const k = b.dataset.k; setRole(k); S.after = k === "visitor" ? null : k; A.session.set("after", S.after); goAuth("login"); }
    else if (a === "who-event") { location.href = location.pathname + "?e=" + encodeURIComponent(b.dataset.id) + "&login=1&pick=1"; }
    else if (a === "signup") { S.after = null; setRole("visitor"); S.authOpen = true; goAuth("signup"); }
    else if (a === "browse") { S.authOpen = false; S.after = null; A.session.del("after"); A.session.del("pending-email"); setRole("visitor"); render(); }
    else if (a === "role") { setRole(b.dataset.k); S.after = b.dataset.k === "visitor" ? null : b.dataset.k; A.session.set("after", S.after); goAuth("login"); }
    else if (a === "partner-login") requireLogin("partner", "partner");
    else if (a === "org-login") requireLogin("organizer", "organizer");
    else if (a === "buy") { if (!canSell()) return toast("بيع الجواز غير متاح حاليًا.", "err"); startIntent("buy"); }
    else if (a === "partner-join") startIntent("partner");
    else if (a === "confirm-buy") {
      b.disabled = true;
      try {
        const d = await A.urpc("join_event", { p_event: EV });
        S.me = await A.urpc("me");
        S.sub = null; S.tab = "pass"; render();
        if (d.status === "active") overlay({ k: "ok", icon: "award", title: "جوازك جاهز 🎉", body: isOffers() ? "اعرض رمزك عند الأكشاك المشاركة واحصل على خصمها أو باقتها." : "اعرض رمزك عند الأكشاك المشاركة واجمع الأختام والمكافآت.", auto: 6000 });
        else toast("تم إنشاء طلبك. أكمل الدفع لدى منصة المنظمين.", "ok");
      } catch (e) { const m = $("#coMsg"); if (m) m.innerHTML = `<div class="msg err">${esc(errMsg(e))}</div>`; b.disabled = false; }
    }
    else if (a === "pass-tab") { S.passTab = b.dataset.k; S.tab = "pass"; S.sub = null; render(); }
    else if (a === "work-mode") { S.work.mode = b.dataset.k; render(); }
    else if (a === "work-refresh") loadStaffStats();
    else if (a === "admin-tab") { S.adminTab = b.dataset.k; S.newEvent = false; S.gameEdit = null; render(); }
    else if (a === "admin-ev") { S.adminEv = b.dataset.id; S.newEvent = false; render(); }
    else if (a === "admin-new-ev") { S.newEvent = true; S.adminTab = "content"; render(); }
    else if (a === "admin-preview") { if (adminEv() !== EV) { location.href = location.pathname + "?e=" + encodeURIComponent(adminEv()) + "&tab=home"; return; } S.tab = "home"; render(); }
    else if (a === "org-open") { S.me = await A.urpc("me"); S.tab = "work"; S.work.mode = "org"; S.sub = null; render(); }
    else if (a === "org-review") {
      const okv = b.dataset.ok === "1"; let note = null;
      if (!okv) { note = prompt("سبب الرفض أو الإيقاف (يظهر للمنظم):", ""); if (note === null) return; }
      try { await A.urpc("shurfa_review_org_request", { p_id: b.dataset.id, p_approve: okv, p_note: note }); toast(okv ? "تم اعتماد المنظم" : "تم تحديث الحالة", "ok"); loadPlatform(); }
      catch (e) { toast(errMsg(e), "err"); }
    }
    else if (a === "scan-toggle") toggleScan();
    else if (a === "undo") {
      if (!S.work.last) return;
      try { await A.urpc("staff_undo", { p_stall: S.work.stall, p_code: S.work.last }); S.work.res = ""; closeOverlay(false); toast("تم التراجع عن آخر عملية", "ok"); loadStaffStats(); }
      catch (e) { toast(errMsg(e), "err"); }
    }
    else if (a === "activate") {
      b.disabled = true;
      try { const d = await A.urpc("admin_activate_pass", { p_event: orgEv(), p_code: b.dataset.code, p_method: b.dataset.m });
        try { if (navigator.vibrate) navigator.vibrate([60, 40, 60]); } catch (x) { /* ignore */ }
        showRes("ok", "check", "تم تفعيل الجواز", `<b>${esc(d.name)}</b> · ${b.dataset.m === "cash" ? "نقدًا" : "تحويل بنكي"}<br><span class="sub">وصل للزائر إشعار بتفعيل جوازه.</span>`, scanNextBtn(), 6000); loadOrgActivity(); }
      catch (e) { b.disabled = false; toast(e.code === "already_active" ? "الجواز مفعّل مسبقًا." : errMsg(e), "err"); }
    }
    else if (a === "review") {
      const okv = b.dataset.ok === "1";
      let note = null;
      if (!okv) { note = prompt("سبب الرفض أو الإيقاف (يظهر للشريك):", ""); if (note === null) return; }
      try { await A.urpc("admin_review_stall", { p_stall: b.dataset.id, p_approve: okv, p_note: note }); toast(okv ? "تم اعتماد الشريك" : "تم تحديث الحالة", "ok"); loadAdminPartners(); }
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
    if (t.dataset.c === "ev-media" && t.files && t.files[0]) {
      const k = t.dataset.k, m = $("#evMsg"); m.innerHTML = `<div class="msg info">جارٍ رفع الصورة…</div>`;
      try { media[k] = await uploadLogo(t.files[0], k === "image" ? 1600 : 500); t.parentElement.querySelector("img, span").outerHTML = `<img src="${esc(media[k])}" alt="" style="width:100%;height:100%;object-fit:cover">`; m.innerHTML = `<div class="msg ok">تم رفع الصورة. اضغط «حفظ المحتوى».</div>`; }
      catch (e) { m.innerHTML = `<div class="msg err">${esc(A.errText(e.code === "bad_logo" ? "bad_logo" : "upload_failed"))}</div>`; }
      return;
    }
    if (t.dataset.c === "org-event") { S.work.orgEvent = t.value; render(); return; }
    if (t.dataset.c === "op-game") { S.work.game = t.value; render(); return; }
    if (t.dataset.c === "game-img" && t.files && t.files[0]) {
      const m = $("#gmMsg"); m.innerHTML = `<div class="msg info">جارٍ رفع الصورة…</div>`;
      try { gameMedia.image = await uploadLogo(t.files[0], 1200); t.parentElement.querySelector("img, span").outerHTML = `<img src="${esc(gameMedia.image)}" alt="" style="width:100%;height:100%;object-fit:cover">`; m.innerHTML = `<div class="msg ok">تم رفع الصورة.</div>`; }
      catch (e) { m.innerHTML = `<div class="msg err">${esc(A.errText(e.code === "bad_logo" ? "bad_logo" : "upload_failed"))}</div>`; }
      return;
    }
    if (t.dataset.c === "org-point") { A.local.set("org-point", t.value.trim().slice(0, 60) || "منصة المنظمين"); toast("حُفظت نقطة التنظيم", "ok"); return; }
    if (t.dataset.c === "work-stall") { S.work.stall = t.value; S.work.res = ""; A.local.set("work-stall", t.value); render(); }
    else if (t.dataset.c === "pt-logo" && t.files && t.files[0]) {
      const m = $("#ptMsg"); m.innerHTML = `<div class="msg info">جارٍ رفع الشعار…</div>`;
      try { ptLogo = await uploadLogo(t.files[0]); $("#ptLogoPrev").innerHTML = logoTile({ name: "", logo: ptLogo }, 72); m.innerHTML = `<div class="msg ok">تم رفع الشعار.</div>`; }
      catch (e) { m.innerHTML = `<div class="msg err">${esc(A.errText(e.code === "bad_logo" ? "bad_logo" : "upload_failed"))}</div>`; }
    }
  });
  document.addEventListener("change", (ev) => { if (ev.target.name === "event" && ev.target.closest("form[data-f=orgapply]")) toggleNewEvent(); });
  document.addEventListener("input", (ev) => { if (ev.target.dataset && ev.target.dataset.c === "pt-offer") previewOffer(); });
  document.addEventListener("input", (ev) => { if (ev.target.dataset && ev.target.dataset.c === "pk-adm") pkAdmTotal(ev.target.closest("form")); });
  document.addEventListener("change", (ev) => {
    if (!(ev.target.dataset && ev.target.dataset.c === "pt-scope")) return;
    const box = $("#ptScopeItems"); if (box) box.hidden = ev.target.value !== "items";
    if (ev.target.value === "items") { const i = box && box.querySelector("input"); if (i) i.focus(); }
    previewOffer();
  });
  document.addEventListener("change", (ev) => {
    if (!(ev.target.dataset && ev.target.dataset.c === "pt-kind")) return;
    const box = $("#ptOfferBox"); if (!box) return;
    box.innerHTML = offerBoxHTML(ev.target.value, null, [], !!box.querySelector("[disabled]"));
    const ct = $("#ptConsentTxt"); if (ct) ct.textContent = consentTxt(ev.target.value);
    previewOffer();
  });

  document.addEventListener("submit", async (ev) => {
    const f = ev.target.closest("form[data-f]"); if (!f) return;
    ev.preventDefault();
    const btn = f.querySelector("button[type=submit]");
    const k = f.dataset.f;
    if (k === "card-admin") {
      const f = ev.target, req = parseInt(f.required.value, 10);
      if (!(req >= 1 && req <= 20) || !f.reward1.value.trim()) return toast(A.errText("bad_card"), "err");
      try { await A.urpc("admin_update_stall_card", { p_stall: f.dataset.id, p_required: req, p_reward1: f.reward1.value.trim(), p_reward2: f.reward2.value.trim() || null, p_cooldown: parseInt(f.cooldown.value || "30", 10) });
        toast("حُفظت بطاقة الولاء", "ok"); loadAdminPartners(); S.stalls = null; }
      catch (e) { toast(errMsg(e), "err"); }
      return;
    }
    if (k === "mfa-enroll") {
      const f = ev.target, m = $("#mf-msg"), code = f.code.value.replace(/\D/g, "");
      if (code.length !== 6) { m.innerHTML = `<div class="msg err">${esc(A.errText("mfa_bad_code"))}</div>`; return; }
      try { await A.auth.mfaVerify(S.mfaFactor, code); toast("تم تفعيل التحقق بخطوتين ✓", "ok"); loadMfaScreen(); }
      catch (e) { m.innerHTML = `<div class="msg err">${esc(errMsg(e))}</div>`; }
      return;
    }
    if (k === "game-staff") {
      const f = ev.target, id = f.dataset.id;
      try { const d = await A.urpc("admin_add_game_staff", { p_game: id, p_email: f.email.value.trim() }); f.reset(); loadGameStaff(id);
        toast(d.linked ? "أُضيف المشغّل · تظهر له «لعبتي»" : "أُضيف المشغّل · تظهر له «لعبتي» بعد ما يسجّل بنفس البريد", "ok"); }
      catch (e) { toast(errMsg(e), "err"); }
      return;
    }
    if (k === "game") {
      const f = ev.target, m = $("#gmMsg"), btn = f.querySelector("[type=submit]"); m.innerHTML = "";
      const num = (v) => (String(v).trim() === "" ? null : parseInt(v, 10));
      btn.disabled = true;
      try {
        await A.urpc("admin_save_game", { p_id: S.gameEdit === "new" ? null : S.gameEdit, p_event: S.gameEv, p_name: f.name.value.trim(), p_description: f.description.value.trim(),
          p_image: gameMedia.image, p_price: parseInt(f.price.value || "0", 10), p_min_age: num(f.min_age.value), p_capacity: num(f.capacity.value),
          p_active: f.active.checked, p_sort: parseInt(f.sort.value || "100", 10) });
        S.gameEdit = null; toast("حُفظت اللعبة · تظهر للزوار مباشرة", "ok");
        if (S.gameEv === EV) loadGames();
        loadGamesAdmin(S.gameEv);
      } catch (e) { m.innerHTML = `<div class="msg err">${esc(errMsg(e))}</div>`; btn.disabled = false; }
      return;
    }
    if (k === "band-add") {
      const f = ev.target, m = $("#bd-msg"), code = f.code.value.trim().toUpperCase().replace(/.*BAND=/, "");
      if (!/^[A-Z0-9]{10}$/.test(code)) { m.innerHTML = `<div class="msg err">${esc(A.errText("band_not_found"))}</div>`; return; }
      const btn = f.querySelector("[type=submit]"); btn.disabled = true;
      try {
        const d = await A.urpc("band_link", { p_code: code, p_child: f.child.value });
        await loadBands();
        overlay({ k: "ok", icon: "check", title: "تم ربط السوار ✓", body: `سوار ${serial(d.serial)}${f.child.value.trim() ? ` · ${esc(f.child.value.trim())}` : ""}<br>إذا مسحه فريق التنظيم يصلك إشعار فوري هنا.`, auto: 6000 });
        S.sub = { name: "bands" }; render();
      } catch (e) { m.innerHTML = `<div class="msg err">${esc(errMsg(e))}</div>`; btn.disabled = false; }
      return;
    }
    if (k === "manual") { const i = $("#manualCode"); lastScan = { code: "", at: 0 }; scanned(i.value); i.value = ""; i.blur(); return; }
    if (k === "event") {
      const m = $("#evMsg"); m.innerHTML = "";
      const id = f.id && f.id.value !== undefined && f.querySelector("#ev-id") ? f.querySelector("#ev-id").value.trim().toLowerCase() : adminEv();
      btn.disabled = true;
      try {
        await A.urpc("admin_save_event", { p_id: id, p_name: f.name.value.trim(), p_summary: f.summary.value.trim(), p_location: f.location.value.trim(),
          p_date: f.date.value.trim(), p_hours: f.hours.value.trim(), p_status: f.status.value, p_price: parseInt(f.price.value || "0", 10),
          p_pay_note: f.pay_note.value.trim(), p_active: f.active.checked, p_partner_signup: f.partner_signup.checked,
          p_image: media.image, p_logo: media.logo, p_color_from: f.color_from.value, p_color_to: f.color_to.value, p_sort: parseInt(f.sort.value || "100", 10) });
        const vis = f.visible.checked, was = (evById(id) || {}).visible !== false;
        if (vis !== was || !vis) await A.urpc("admin_set_event_visible", { p_id: id, p_visible: vis });
        const pm = (f.querySelector("input[name=pass_mode]:checked") || {}).value || "loyalty", pp = parseInt(f.pool_pct.value || "50", 10);
        if (pm !== ((EVDB[id] || {}).pass_mode || "loyalty") || pp !== ((EVDB[id] || {}).pool_pct ?? 50)) await A.urpc("admin_set_event_pass_mode", { p_id: id, p_mode: pm, p_pool_pct: pp });
        await loadEvInfo();
        S.adminEv = id; S.newEvent = false;
        toast(f.visible.checked ? "حُفظ محتوى الفعالية" : "حُفظت الفعالية وهي مخفية عن الزوار", "ok"); render();
      } catch (e) { m.innerHTML = `<div class="msg err">${esc(A.errText(e.code))}</div>`; }
      finally { if (document.body.contains(btn)) btn.disabled = false; }
      return;
    }
    if (k === "orgapply") {
      const m = $("#oaMsg"); m.innerHTML = "";
      const err = (c) => { m.innerHTML = `<div class="msg err">${esc(A.errText(c))}</div>`; };
      const evSel = (f.querySelector("input[name=event]:checked") || {}).value;
      if (f.org.value.trim().length < 2) return err("bad_org");
      if (evSel === undefined || (!evSel && f.event_name.value.trim().length < 2)) return err("bad_event");
      if (!f.consent.checked) return err("consent_required");
      btn.disabled = true;
      try {
        await A.urpc("organizer_apply", { p_org: f.org.value.trim(), p_position: f.position.value.trim(), p_phone: f.phone.value.replace(/[\s-]/g, ""),
          p_event: evSel || null, p_event_name: evSel ? null : f.event_name.value.trim(), p_event_date: evSel ? null : f.event_date.value.trim(),
          p_event_location: evSel ? null : f.event_location.value.trim(), p_note: f.note.value.trim() });
        S.me = await A.urpc("me");
        toast("تم إرسال طلبك لفريق شُرفة", "ok"); loadOrgApply(); window.scrollTo(0, 0);
      } catch (e) { err(e.code); }
      finally { if (document.body.contains(btn)) btn.disabled = false; }
      return;
    }
    if (k === "pkg-admin") {
      const items = [...f.querySelectorAll("input[name=q]")].map((x) => ({ item: x.dataset.item, qty: Math.max(0, Math.min(10, parseInt(x.value || "0", 10) || 0)) })).filter((x) => x.qty);
      btn.disabled = true;
      try { await A.urpc("admin_save_package", { p_event: adminEv(), p_kind: f.dataset.kind, p_name: f.name.value.trim(), p_description: f.description.value.trim(), p_items: items, p_active: f.active.checked }); toast("حُفظت الباقة", "ok"); }
      catch (e) { toast(errMsg(e), "err"); }
      finally { btn.disabled = false; }
      return;
    }
    if (k === "partner") {
      const m = $("#ptMsg"); m.innerHTML = "";
      const err = (c) => { m.innerHTML = `<div class="msg err">${esc(A.errText(c))}</div>`; };
      if (f.name.value.trim().length < 2) return err("bad_name");
      const evSel = (f.querySelector("input[name=event]:checked") || {}).value || "";
      const locked = !!f.querySelector("#ptOfferBox [disabled]");
      const r = locked || !evSel ? { offer: null } : readOffer(f);
      if (r.error) return err(r.error);
      if (!f.consent.checked) return err("consent_required");
      btn.disabled = true;
      try {
        const d = await A.urpc("partner_apply", {
          p_name: f.name.value.trim(), p_kind: f.kind.value, p_description: f.description.value.trim(), p_phone: f.phone.value.replace(/[\s-]/g, ""),
          p_instagram: f.instagram.value.trim(), p_logo: ptLogo, p_event: evSel || null, p_required: 1,
          p_reward1: (r.offer ? offerLabel(r.offer) : "") || "عرض الجواز", p_reward2: null, p_cooldown: 0
        });
        if (r.offer && d.stall && !d.card_locked) {
          await A.urpc("partner_set_offer", { p_stall: d.stall, p_offer: r.offer });
          await A.urpc("partner_set_items", { p_stall: d.stall, p_items: r.items || [] });
        }
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
        try { await A.auth.signIn(email, pass); if (await needMfa()) return; }
        catch (e) {
          if (e.code === "email_not_confirmed") { S.email = email; A.session.set("pending-email", email); try { await A.auth.resendConfirm(email); S.resendAt = Date.now() + 60000; } catch (x) { /* ignore */ } goAuth("code"); return; }
          throw e;
        }
        await boot();
      } else if (k === "signup") {
        const v = { name: f.name.value.trim(), phone: f.phone.value.replace(/[\s-]/g, ""), email: f.email.value.trim().toLowerCase(),
          type: (f.querySelector("input[name=type]:checked") || {}).value || "visitor" };
        S.signup = v;
        if (S.role === "partner" || S.role === "organizer") { S.after = S.role; A.session.set("after", S.role); }
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
      } else if (k === "mfa") {
        const code = f.code.value.replace(/\D/g, "");
        if (code.length !== 6) throw { code: "mfa_bad_code" };
        await A.auth.mfaVerify(S.mfaFactor, code);
        await boot();
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
