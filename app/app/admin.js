/* شُرفة — لوحة المنظم */
(() => {
  "use strict";
  const A = window.ShurfaApp;
  const { $, $$, esc } = A;
  const KEY = "admin";
  const TYPE = { student: "طالب", intl: "طالب دولي", staff: "موظف", visitor: "زائر" };
  const fmt = (d) => d ? new Date(d).toLocaleString("ar-OM", { dateStyle: "short", timeStyle: "short" }) : "";

  if (!A.ready) { $("#notReady").hidden = false; return; }

  let sess = A.session.get(KEY);   // { token, exp, email }
  let visitors = [], teams = [];

  /* ---------- الدخول (Supabase Auth) ---------- */
  function showLogin(msg) {
    $("#dash").hidden = true; $("#logoutBtn").hidden = true; $("#loginView").hidden = false;
    $("#loginMsg").innerHTML = msg ? `<div class="msg err">${esc(msg)}</div>` : "";
  }

  $("#loginView").addEventListener("submit", async (e) => {
    e.preventDefault();
    const f = e.target, btn = $("#loginBtn");
    btn.disabled = true; $("#loginMsg").innerHTML = "";
    try {
      const d = await A.call("/auth/v1/token?grant_type=password", { body: { email: f.email.value.trim(), password: f.password.value } });
      f.password.value = "";
      sess = { token: d.access_token, exp: Date.now() + (d.expires_in || 3600) * 1000 - 60000, email: f.email.value.trim() };
      const isOrg = await A.call("/rest/v1/rpc/is_organizer", { body: {}, token: sess.token });
      if (isOrg !== true) { sess = null; showLogin(A.errText("not_authorized")); return; }
      A.session.set(KEY, sess);
      openDash();
    } catch (err) {
      showLogin(err.status === 400 ? "البريد أو كلمة المرور غير صحيحة." : A.errText(err.code));
    } finally { btn.disabled = false; }
  });

  $("#logoutBtn").addEventListener("click", async () => { A.session.del(KEY); if (sess && sess.shared) await A.auth.signOut(); sess = null; showLogin(); });

  const tok = async () => {
    if (sess && sess.shared) {
      try { return await A.auth.token(); }
      catch (e) { sess = null; showLogin("انتهت الجلسة، سجّل الدخول مرة أخرى."); throw Object.assign(new Error("expired"), { code: "not_authorized" }); }
    }
    if (!sess || Date.now() > sess.exp) { A.session.del(KEY); sess = null; showLogin("انتهت الجلسة، سجّل الدخول مرة أخرى."); throw Object.assign(new Error("expired"), { code: "not_authorized" }); }
    return sess.token;
  };
  const guard = (fn) => async (...a) => { try { return await fn(...a); } catch (e) { if (e.message !== "expired") A.toast(A.errText(e.code), "err"); } };

  /* ---------- التبويبات ---------- */
  $$(".tab").forEach((t) => t.addEventListener("click", () => {
    $$(".tab").forEach((x) => x.classList.toggle("on", x === t));
    $$("[data-panel]").forEach((p) => { p.hidden = p.dataset.panel !== t.dataset.tab; });
    ({ overview: loadStats, stalls: () => { loadStats(); loadStaff(); }, visitors: loadVisitors, teams: loadTeams, links: renderLinks })[t.dataset.tab]();
  }));

  /* ---------- نظرة عامة + الأكشاك ---------- */
  const loadStats = guard(async () => {
    const s = await A.rpc("admin_stats", { p_event: A.eventId }, await tok());
    const bt = s.by_type || {};
    $("#stats").innerHTML = [
      ["الزوار المسجلون", s.visitors], ["تسجيلات اليوم", s.visitors_today], ["الأختام", s.stamps], ["المكافآت المسلّمة", s.rewards],
      ["الأكشاك", (s.stalls || []).length], ["فرق البطولة", s.teams],
      ["طلاب", bt.student || 0], ["طلاب دوليون", bt.intl || 0]
    ].map(([l, v]) => `<div class="stat"><b>${esc(v)}</b><span>${esc(l)}</span></div>`).join("");

    const rows = s.stalls || [];
    $("#stallStats").innerHTML = `<tr><th>الكشك</th><th>النوع</th><th>الزوار</th><th>الزيارات</th><th>المكافآت</th><th>العرض</th></tr>` +
      (rows.length ? rows.map((r) => `<tr><td>${esc(r.name)}</td><td>${esc(A.KIND[r.kind] || r.kind)}</td><td>${r.visitors}</td><td>${r.visits}</td><td>${r.rewards}</td><td>${esc(A.offerText(r))}</td></tr>`).join("")
        : `<tr><td colspan="6" class="empty">لا توجد أكشاك بعد — أضفها من تبويب «الأكشاك».</td></tr>`);

    $("#stallTable").innerHTML = `<tr><th>الكشك</th><th>العرض</th><th>الفاصل</th><th>الحالة</th><th></th></tr>` +
      (rows.length ? rows.map((r) => `<tr>
        <td>${esc(r.name)}</td><td>${esc(A.offerText(r))}</td><td>${r.cooldown} د</td>
        <td><span class="pill ${r.active ? "on" : "off"}">${r.active ? "مفعّل" : "متوقف"}</span>${r.locked ? ' <span class="pill off">مقفل مؤقتًا</span>' : ""}</td>
        <td class="btns"><button class="btn btn-ghost btn-sm" data-pin="${esc(r.id)}" data-name="${esc(r.name)}">رمز جديد</button>
            <button class="btn btn-ghost btn-sm" data-toggle="${esc(r.id)}" data-active="${r.active}">${r.active ? "إيقاف" : "تفعيل"}</button></td>
      </tr>`).join("") : `<tr><td colspan="5" class="empty">لا توجد أكشاك بعد.</td></tr>`);
  });

  $("#reloadBtn").addEventListener("click", loadStats);

  $("#stallForm").addEventListener("submit", guard(async (e) => {
    e.preventDefault();
    const f = e.target, btn = $("#stallBtn");
    $("#stallMsg").innerHTML = "";
    const req = parseInt(f.required.value, 10);
    if (f.name.value.trim().length < 2 || !f.reward1.value.trim() || !(req >= 1 && req <= 20)) {
      $("#stallMsg").innerHTML = `<div class="msg err">أكمل الاسم وعدد الزيارات (1–20) والمكافأة الأولى.</div>`; return;
    }
    btn.disabled = true;
    try {
      const d = await A.rpc("admin_create_stall", {
        p_event: A.eventId, p_name: f.name.value.trim(), p_kind: f.kind.value, p_required: req,
        p_reward1: f.reward1.value.trim(), p_reward2: f.reward2.value.trim() || null, p_cooldown: parseInt(f.cooldown.value || "30", 10)
      }, await tok());
      showPin(f.name.value.trim(), d.pin);
      f.reset();
      loadStats(); loadStaff();
    } finally { btn.disabled = false; }
  }));

  function showPin(name, pin) {
    $("#pinTitle").textContent = "رمز الكشك: " + name;
    $("#pinBox").textContent = pin;
    $("#pinCard").hidden = false;
    $("#pinCard").scrollIntoView({ behavior: "smooth", block: "center" });
  }

  $("#stallTable").addEventListener("click", guard(async (e) => {
    const b = e.target.closest("button");
    if (!b) return;
    if (b.dataset.pin) {
      if (!confirm(`إنشاء رمز جديد لـ «${b.dataset.name}»؟ سيتوقف الرمز القديم فورًا.`)) return;
      const d = await A.rpc("admin_reset_pin", { p_stall: b.dataset.pin }, await tok());
      showPin(b.dataset.name, d.pin);
      loadStats();
    } else if (b.dataset.toggle) {
      await A.rpc("admin_set_stall_active", { p_stall: b.dataset.toggle, p_active: b.dataset.active !== "true" }, await tok());
      loadStats();
    }
  }));

  /* ---------- موظفو الأكشاك ---------- */
  let stallList = [];
  const loadStaff = guard(async () => {
    const s = await A.rpc("admin_stats", { p_event: A.eventId }, await tok());
    stallList = s.stalls || [];
    $("#staffStall").innerHTML = stallList.map((r) => `<option value="${esc(r.id)}">${esc(r.name)}</option>`).join("") || `<option value="">أضف كشكًا أولًا</option>`;
    const rows = await A.rpc("admin_list_staff", { p_event: A.eventId }, await tok()) || [];
    $("#staffTable").innerHTML = `<tr><th>الكشك</th><th>البريد</th><th>الصلاحية</th><th>الحالة</th><th></th></tr>` +
      (rows.length ? rows.map((r) => `<tr><td>${esc(r.stall)}</td><td dir="ltr">${esc(r.email)}</td><td>${r.role === "manager" ? "مدير الكشك" : "موظف"}</td>
        <td><span class="pill ${r.linked ? "on" : ""}">${r.linked ? "دخل التطبيق" : "بانتظار أول دخول"}</span></td>
        <td><button class="btn btn-danger btn-sm" type="button" data-rm="${esc(r.stall_id)}" data-email="${esc(r.email)}">إزالة</button></td></tr>`).join("")
        : `<tr><td colspan="5" class="empty">لم يُضف موظفون بعد.</td></tr>`);
  });
  $("#staffForm").addEventListener("submit", guard(async (e) => {
    e.preventDefault();
    const f = e.target, btn = $("#staffBtn"), email = f.email.value.trim().toLowerCase();
    $("#staffMsg").innerHTML = "";
    if (!f.stall.value) { $("#staffMsg").innerHTML = `<div class="msg err">أضف كشكًا أولًا.</div>`; return; }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) { $("#staffMsg").innerHTML = `<div class="msg err">أدخل بريدًا صحيحًا.</div>`; return; }
    btn.disabled = true;
    try {
      const d = await A.rpc("admin_add_staff", { p_stall: f.stall.value, p_email: email, p_role: f.role.value }, await tok());
      $("#staffMsg").innerHTML = `<div class="msg ok">${d.linked ? "تمت الإضافة. ستظهر له واجهة الكشك فورًا." : "تمت الإضافة. ستظهر له واجهة الكشك عند أول دخول للتطبيق بهذا البريد."}</div>`;
      f.email.value = "";
      loadStaff();
    } finally { btn.disabled = false; }
  }));
  $("#staffTable").addEventListener("click", guard(async (e) => {
    const b = e.target.closest("button[data-rm]"); if (!b) return;
    if (!confirm(`إزالة ${b.dataset.email} من الكشك؟`)) return;
    await A.rpc("admin_remove_staff", { p_stall: b.dataset.rm, p_email: b.dataset.email }, await tok());
    loadStaff();
  }));

  /* ---------- الزوار والفرق (قراءة عبر RLS) ---------- */
  const loadVisitors = guard(async () => {
    visitors = await A.call(`/rest/v1/visitors?select=code,name,phone,visitor_type,created_at&event_id=eq.${encodeURIComponent(A.eventId)}&order=created_at.desc&limit=1000`, { method: "GET", token: await tok() }) || [];
    $("#visitorTable").innerHTML = `<tr><th>الرمز</th><th>الاسم</th><th>الهاتف</th><th>الفئة</th><th>التسجيل</th></tr>` +
      (visitors.length ? visitors.map((v) => `<tr><td dir="ltr">${esc(v.code)}</td><td>${esc(v.name)}</td><td dir="ltr">${esc(v.phone)}</td><td>${esc(TYPE[v.visitor_type] || v.visitor_type)}</td><td>${esc(fmt(v.created_at))}</td></tr>`).join("")
        : `<tr><td colspan="5" class="empty">لا يوجد زوار بعد.</td></tr>`);
  });
  const loadTeams = guard(async () => {
    teams = await A.call(`/rest/v1/teams?select=team_name,game,p1_name,p1_phone,p2_name,p2_phone,created_at&event_id=eq.${encodeURIComponent(A.eventId)}&order=created_at.asc`, { method: "GET", token: await tok() }) || [];
    $("#teamTable").innerHTML = `<tr><th>#</th><th>الفريق</th><th>اللعبة</th><th>اللاعب 1</th><th>الهاتف</th><th>اللاعب 2</th><th>الهاتف</th><th>التسجيل</th></tr>` +
      (teams.length ? teams.map((t, i) => `<tr><td>${i + 1}</td><td>${esc(t.team_name)}</td><td>${esc(t.game)}</td><td>${esc(t.p1_name)}</td><td dir="ltr">${esc(t.p1_phone)}</td><td>${esc(t.p2_name)}</td><td dir="ltr">${esc(t.p2_phone)}</td><td>${esc(fmt(t.created_at))}</td></tr>`).join("")
        : `<tr><td colspan="8" class="empty">لا توجد فرق بعد.</td></tr>`);
  });

  $("#exportVisitors").addEventListener("click", () => {
    A.csvDownload(`shurfa-${A.eventId}-visitors.csv`, [["الرمز", "الاسم", "الهاتف", "الفئة", "وقت التسجيل"],
      ...visitors.map((v) => [v.code, v.name, v.phone, TYPE[v.visitor_type] || v.visitor_type, fmt(v.created_at)])]);
  });
  $("#exportTeams").addEventListener("click", () => {
    A.csvDownload(`shurfa-${A.eventId}-teams.csv`, [["الفريق", "اللعبة", "اللاعب 1", "هاتف 1", "اللاعب 2", "هاتف 2", "وقت التسجيل"],
      ...teams.map((t) => [t.team_name, t.game, t.p1_name, t.p1_phone, t.p2_name, t.p2_phone, fmt(t.created_at)])]);
  });

  /* ---------- روابط وQR ---------- */
  function renderLinks() {
    const base = location.href.replace(/admin\.html.*$/, "");
    const links = { Visitor: `${base}index.html?e=${A.eventId}`, Team: `${base}team.html?e=${A.eventId}`, Stall: `${base}stall.html?e=${A.eventId}` };
    Object.entries(links).forEach(([k, url]) => { A.qr($("#qr" + k), url, 200); $("#lnk" + k).textContent = url; });
  }
  $("#printBtn").addEventListener("click", () => window.print());

  function openDash() {
    $("#loginView").hidden = true; $("#dash").hidden = false; $("#logoutBtn").hidden = false;
    loadStats();
  }

  (async () => {
    // جلسة التطبيق المشتركة (دخول برمز البريد)
    if (A.auth.signedIn()) {
      try {
        const t = await A.auth.token();
        const isOrg = await A.call("/rest/v1/rpc/is_organizer", { body: {}, token: t });
        if (isOrg === true) { sess = { shared: true, email: A.auth.email() }; openDash(); return; }
        showLogin("حسابك (" + A.auth.email() + ") ليس حساب منظم."); return;
      } catch (e) { /* ننتقل لتسجيل الدخول العادي */ }
    }
    if (sess && Date.now() < sess.exp) openDash(); else showLogin();
  })();
})();
