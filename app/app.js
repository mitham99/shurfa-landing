/* =========================================================
   شُرفة — النظام التجريبي (مشترك بين صفحات app/)
   الاتصال بـ Supabase عبر REST فقط (بدون مكتبات)، وكل العمليات
   العامة تمر بدوال قاعدة البيانات (RPC) المحمية.
   الإعداد: ../assets/js/config.js ← supabase { url, anonKey, eventId }
   ========================================================= */
(() => {
  "use strict";

  const CFG = window.SHURFA_CONFIG || {};
  const SB = CFG.supabase || {};
  const ready = /^https?:\/\//.test(SB.url || "") && !!SB.anonKey;
  const params = new URLSearchParams(location.search);
  const eventId = (params.get("e") || SB.eventId || "squ-eat").replace(/[^a-z0-9-]/gi, "");

  /* ---------- رسائل الأخطاء بالعربي ---------- */
  const ERR = {
    consent_required: "يلزم الموافقة على استخدام البيانات للمتابعة.",
    event_closed: "التسجيل لهذه الفعالية غير متاح حاليًا.",
    bad_name: "أدخل اسمًا صحيحًا (حرفان على الأقل).",
    bad_phone: "أدخل رقم هاتف صحيحًا (8 أرقام على الأقل).",
    bad_game: "اختر اللعبة.",
    rate_limited: "محاولات كثيرة خلال وقت قصير. حاول بعد دقائق.",
    not_found: "لم نجد هذا الجواز. سجّل من جديد أو راجع المنظمين.",
    bad_pin: "رمز الكشك غير صحيح.",
    stall_locked: "تم قفل الكشك مؤقتًا بسبب محاولات خاطئة. حاول بعد 15 دقيقة.",
    stall_not_found: "الكشك غير موجود أو غير مفعّل.",
    visitor_not_found: "رمز الجواز غير صحيح لهذه الفعالية.",
    cooldown: "تمت إضافة زيارة لهذا الزائر قبل قليل.",
    nothing_to_undo: "لا توجد عملية حديثة للتراجع عنها.",
    already_registered: "أحد اللاعبَين مسجّل مسبقًا في فريق آخر.",
    not_authorized: "ليس لديك صلاحية المنظم.",
    network: "تعذّر الاتصال. تحقق من الإنترنت وحاول مرة أخرى.",
    not_ready: "النظام قيد التجهيز وسيُفعَّل قريبًا."
  };
  const errText = (code) => ERR[code] || ERR.network;

  /* ---------- الاتصال ---------- */
  async function call(path, { method = "POST", body, token, headers = {} } = {}) {
    if (!ready) throw Object.assign(new Error("not_ready"), { code: "not_ready" });
    let res;
    try {
      res = await fetch(SB.url.replace(/\/$/, "") + path, {
        method,
        headers: Object.assign({
          apikey: SB.anonKey,
          Authorization: "Bearer " + (token || SB.anonKey),
          "Content-Type": "application/json"
        }, headers),
        body: body === undefined ? undefined : JSON.stringify(body)
      });
    } catch (e) {
      throw Object.assign(new Error("network"), { code: "network" });
    }
    const text = await res.text();
    let data = null;
    try { data = text ? JSON.parse(text) : null; } catch (e) { data = text; }
    if (!res.ok) {
      const msg = (data && (data.message || data.error_description || data.msg)) || "network";
      const code = res.status === 429 ? "otp_wait"
        : Object.keys(ERR).find((k) => String(msg).includes(k)) || (res.status === 401 ? "not_authorized" : "network");
      throw Object.assign(new Error(code), { code, status: res.status, raw: data });
    }
    return data;
  }

  /* دالة RPC: ترجع { ok, ... } أو ترمي خطأ برمز مفهوم */
  async function rpc(fn, args, token) {
    const data = await call("/rest/v1/rpc/" + fn, { body: args || {}, token });
    if (data && typeof data === "object" && data.ok === false) {
      throw Object.assign(new Error(data.error || "network"), { code: data.error || "network", data });
    }
    return data;
  }

  /* ---------- تخزين آمن (قد يفشل في التصفح الخاص) ---------- */
  const mk = (area) => ({
    get(k) { try { return JSON.parse(area.getItem("shurfa:" + k)); } catch (e) { return null; } },
    set(k, v) { try { area.setItem("shurfa:" + k, JSON.stringify(v)); return true; } catch (e) { return false; } },
    del(k) { try { area.removeItem("shurfa:" + k); } catch (e) { /* ignore */ } }
  });
  let local, session;
  try { local = mk(window.localStorage); session = mk(window.sessionStorage); }
  catch (e) { const mem = {}; local = session = { get: (k) => mem[k] ?? null, set: (k, v) => { mem[k] = v; return true; }, del: (k) => { delete mem[k]; } }; }

  /* ---------- أدوات واجهة ---------- */
  const esc = (v) => String(v ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];

  function toast(msg, type = "info") {
    let t = $("#appToast");
    if (!t) { t = document.createElement("div"); t.id = "appToast"; t.className = "app-toast"; t.setAttribute("role", "status"); document.body.appendChild(t); }
    t.textContent = msg;
    t.className = "app-toast show " + type;
    clearTimeout(t._h);
    t._h = setTimeout(() => t.classList.remove("show"), 3200);
  }

  function qr(el, text, size = 220) {
    el.innerHTML = "";
    if (!window.QRCode) { el.textContent = text; return; }
    new window.QRCode(el, { text, width: size, height: size, colorDark: "#1A2E28", colorLight: "#FFFFFF", correctLevel: window.QRCode.CorrectLevel.M });
  }

  /* بطاقة الولاء: موقع الزائر في الدورة الحالية */
  function cardState(c) {
    const cycle = c.required + (c.reward2 ? 2 : 1);
    const done = c.visits % cycle;           // زيارات الدورة الحالية
    let next;
    if (done < c.required) {
      const left = c.required - done;
      next = (left === 1 ? "بقيت زيارة واحدة" : left === 2 ? "بقيت زيارتان" : `بقيت ${left} زيارات`) + `، ثم ${c.reward1}`;
    } else if (done === c.required) {
      next = `زيارتك القادمة: ${c.reward1}`;
    } else {
      next = `زيارتك القادمة: ${c.reward2}`;
    }
    if (done === 0 && c.visits > 0) next = "اكتملت بطاقتك! بدأت بطاقة جديدة — " + next;
    return { cycle, done, next };
  }

  function slotsHTML(c) {
    const { cycle, done } = cardState(c);
    let h = "";
    for (let i = 1; i <= cycle; i++) {
      const isReward = i > c.required;
      const label = i === c.required + 1 ? c.reward1 : c.reward2;
      h += isReward
        ? `<span class="slot reward${i <= done ? " on" : ""}${i === done + 1 ? " next" : ""}" title="${esc(label)}">${esc(label)}</span>`
        : `<span class="slot${i <= done ? " on" : ""}">${i <= done ? "✓" : i}</span>`;
    }
    return h;
  }

  function offerText(s) {
    return `${s.required} ${s.required === 1 ? "زيارة" : s.required === 2 ? "زيارتان" : "زيارات"} ← ${s.reward1}` + (s.reward2 ? ` ← ${s.reward2}` : "");
  }

  const KIND = { food: "طعام", cafe: "مقهى", sweets: "حلويات", games: "ألعاب", other: "أخرى" };

  function csvDownload(filename, rows) {
    const escCsv = (v) => { const s = String(v ?? ""); return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s; };
    const csv = "﻿" + rows.map((r) => r.map(escCsv).join(",")).join("\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    a.download = filename;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 2000);
  }

  /* ---------- الحساب: دخول برمز البريد (Supabase Auth) ----------
     الجلسة تُحفظ في الجهاز (localStorage) وتتجدد تلقائيًا، فيبقى المستخدم مسجّلًا */
  const AUTH_KEY = "auth";
  const auth = {
    get() { return local.get(AUTH_KEY); },
    signedIn() { const s = local.get(AUTH_KEY); return !!(s && s.refresh_token); },
    email() { const s = local.get(AUTH_KEY); return s ? s.email : ""; },
    _save(d, email) {
      const s = { access_token: d.access_token, refresh_token: d.refresh_token,
        expires_at: Date.now() + (d.expires_in || 3600) * 1000 - 60000,
        email: (d.user && d.user.email) || email || "" };
      local.set(AUTH_KEY, s);
      return s;
    },
    async sendCode(email) {
      await call("/auth/v1/otp", { body: { email, create_user: true } });
    },
    async verify(email, code) {
      let d;
      try { d = await call("/auth/v1/verify", { body: { type: "email", email, token: code } }); }
      catch (e) {
        if (e.status === 400 || e.status === 403) {
          try { d = await call("/auth/v1/verify", { body: { type: "signup", email, token: code } }); }
          catch (e2) { throw Object.assign(new Error("bad_otp"), { code: "bad_otp" }); }
        } else throw e;
      }
      if (!d || !d.access_token) throw Object.assign(new Error("bad_otp"), { code: "bad_otp" });
      return auth._save(d, email);
    },
    _refreshing: null,
    async token() {
      const s = local.get(AUTH_KEY);
      if (!s || !s.refresh_token) throw Object.assign(new Error("not_signed_in"), { code: "not_signed_in" });
      if (Date.now() < s.expires_at) return s.access_token;
      if (!auth._refreshing) {
        auth._refreshing = call("/auth/v1/token?grant_type=refresh_token", { body: { refresh_token: s.refresh_token } })
          .then((d) => auth._save(d, s.email).access_token)
          .catch((e) => { if (e.status === 400 || e.status === 401) local.del(AUTH_KEY); throw Object.assign(new Error("not_signed_in"), { code: e.code === "network" ? "network" : "not_signed_in" }); })
          .finally(() => { auth._refreshing = null; });
      }
      return auth._refreshing;
    },
    async signOut() {
      const s = local.get(AUTH_KEY);
      local.del(AUTH_KEY);
      if (s && s.access_token) { try { await call("/auth/v1/logout", { body: {}, token: s.access_token }); } catch (e) { /* ignore */ } }
    }
  };
  /* RPC باسم المستخدم المسجّل */
  async function urpc(fn, args) { return rpc(fn, args, await auth.token()); }
  Object.assign(ERR, {
    bad_otp: "الرمز غير صحيح أو انتهت صلاحيته. اطلب رمزًا جديدًا.",
    bad_email: "أدخل بريدًا إلكترونيًا صحيحًا.",
    not_signed_in: "انتهت الجلسة. سجّل الدخول من جديد.",
    profile_required: "أكمل بياناتك أولًا.",
    otp_wait: "انتظر قليلًا قبل طلب رمز جديد."
  });

  window.ShurfaApp = { ready, SB, eventId, call, rpc, urpc, auth, ERR, errText, local, session, esc, $, $$, toast, qr, cardState, slotsHTML, offerText, KIND, csvDownload };
})();
