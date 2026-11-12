/* =========================================================
   شُرفة SHURFA — تفاعلات صفحة الهبوط
   ========================================================= */
(() => {
  "use strict";

  const CONFIG = window.SHURFA_CONFIG || { stores: {}, social: {}, contact: {} };
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const icon = (id) => `<svg class="ico" aria-hidden="true"><use href="#${id}"/></svg>`;

  /* ---------- محتوى الباقات (عدّل هنا) ----------
     art: لون خلفية البطاقة. image: مسار صورة اختيارية (مثل assets/img/pkg-food.jpg) */
  // يمكن لصفحة الفعالية تعريف باقاتها عبر window.SHURFA_PACKAGES = { items, presets }
  const PACKAGE_ITEMS = (window.SHURFA_PACKAGES && window.SHURFA_PACKAGES.items) || [
    { id: "entry",   name: "دخول المهرجان",   note: "أساس كل باقة",          icon: "i-ticket", art: "linear-gradient(135deg,#1A2E28,#2E5148)", locked: true },
    { id: "concert", name: "حفلة غنائية",     note: "عند توفرها",            icon: "i-music",  art: "linear-gradient(135deg,#7B5BA7,#5F4486)" },
    { id: "meal",    name: "وجبة أو عشاء",    note: "من المطاعم المشاركة",   icon: "i-food",   art: "linear-gradient(135deg,#E4573D,#C7432B)" },
    { id: "coffee",  name: "قهوة ومشروبات",   note: "من المقاهي المشاركة",   icon: "i-coffee", art: "linear-gradient(135deg,#8B5E3C,#6B4529)" },
    { id: "sweets",  name: "حلويات",          note: "من العلامات المشاركة",  icon: "i-sweet",  art: "linear-gradient(135deg,#F5A623,#E08E0B)" },
    { id: "games",   name: "ألعاب وأنشطة",    note: "ترفيه للعائلة",         icon: "i-game",   art: "linear-gradient(135deg,#2CA6A4,#1F8583)" }
  ];

  const PRESETS = (window.SHURFA_PACKAGES && window.SHURFA_PACKAGES.presets) || {
    family:  { title: "باقة العائلة",   hint: "دخول المهرجان + وجبة عائلية + مشروبات + ألعاب للأطفال.",       items: ["entry", "meal", "coffee", "games"] },
    friends: { title: "باقة الأصدقاء",  hint: "دخول المهرجان + حفلة عند توفرها + مشروبات وحلويات.",           items: ["entry", "concert", "coffee", "sweets"] },
    custom:  { title: "باقتي المخصصة",  hint: "اختر الخدمات التي تناسب اهتماماتك وميزانيتك — اضغط لإضافتها.", items: ["entry"] }
  };

  /* ---------- أختام الجواز (عرض توضيحي) ---------- */
  /* ---------- بطاقات الولاء في الجواز الرقمي (عرض توضيحي) ----------
     لكل شريك بطاقته: stamps = عدد الزيارات المختومة، ثم المكافآت (at = رقم الزيارة).
     يمكن لأي صفحة تعريف بطاقاتها عبر window.SHURFA_PASSPORT_CARDS */
  const PASSPORT_CARDS = window.SHURFA_PASSPORT_CARDS || [
    { id: "food", name: "مطعم شريك", icon: "i-food", stamps: 6,
      rewards: [
        { at: 7, label: "خصم 30%", ordinal: "السابعة", note: "نسبة الخصم يحددها المطعم" },
        { at: 8, label: "مجانًا", ordinal: "الثامنة", note: "الوجبة الثامنة مجانية" }
      ] },
    { id: "games", name: "لعبة شريكة", icon: "i-game", stamps: 3,
      rewards: [
        { at: 4, label: "مجانًا", ordinal: "الرابعة", note: "اللعبة الرابعة مجانية" }
      ] }
  ];
  /* لحظات «يومياتي» التوضيحية: صورة من المكان + سطر عن الشعور */
  const PASSPORT_MOMENTS = [
    { place: "مهرجان صحار", note: "أمسية جميلة مع العائلة عند المسرح", feel: "الشعور: سعيد", a: "#2CA6A4", b: "#7B5BA7" },
    { place: "مطعم شريك", note: "أول مرة نجرب الحلوى العُمانية هنا", feel: "الشعور: مستمتع", a: "#E4573D", b: "#F5A623" },
    { place: "ركن الألعاب", note: "أول فوز للصغار اليوم", feel: "الشعور: فخور", a: "#7B5BA7", b: "#E4573D" },
    { place: "مهرجان صحار", note: "الأضواء في المساء تستحق الصورة", feel: "الشعور: هادئ", a: "#1A2E28", b: "#2CA6A4" }
  ];

  /* ---------- أدوات ---------- */
  const toast = (() => {
    const el = $("#toast");
    let t;
    return (msg) => {
      el.textContent = msg;
      el.classList.add("show");
      clearTimeout(t);
      t = setTimeout(() => el.classList.remove("show"), 2800);
    };
  })();

  const onVisible = (el, cb, opts = { threshold: 0.35 }) => {
    if (!el) return;
    if (!("IntersectionObserver" in window)) return cb();
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { cb(); io.disconnect(); } });
    }, opts);
    io.observe(el);
  };

  /* ---------- روابط المتاجر و QR ---------- */
  function setupStores() {
    const stores = CONFIG.stores || {};
    const anyLink = Object.values(stores).some(Boolean);

    $$("[data-store]").forEach((a) => {
      const url = /^https:\/\//i.test(stores[a.dataset.store] || "") ? stores[a.dataset.store] : "";
      if (url) {
        a.href = url;
      } else {
        a.href = "#download";
        a.removeAttribute("target");
        a.classList.add("is-pending");
        a.setAttribute("aria-label", `${a.textContent.trim()} — الرابط قريبًا`);
        a.addEventListener("click", (e) => {
          e.preventDefault();
          toast("رابط التحميل سيتوفر قريبًا — تابعنا ليصلك الإعلان.");
        });
      }
    });

    const note = $("#storeNote");
    if (note && anyLink) note.hidden = true;

    const renderQR = () => {
      $$("[data-qr]").forEach((box) => {
        const url = stores[box.dataset.qr];
        if (!url || !window.QRCode) return;
        box.innerHTML = "";
        new window.QRCode(box, { text: url, width: 220, height: 220, colorDark: "#1A2E28", colorLight: "#FAF6F0", correctLevel: window.QRCode.CorrectLevel.M });
        box.setAttribute("title", "امسح الرمز لتحميل التطبيق");
      });
    };
    if (window.QRCode) renderQR(); else window.addEventListener("load", renderQR);
  }

  /* ---------- التواصل والتذييل ---------- */
  function setupFooter() {
    $("#year").textContent = new Date().getFullYear();

    const SOCIAL_META = {
      instagram: ["i-insta", "إنستغرام"], x: ["i-x", "إكس"], tiktok: ["i-tiktok", "تيك توك"],
      snapchat: ["i-snap", "سناب شات"], youtube: ["i-yt", "يوتيوب"]
    };
    // القيم تأتي من config.js؛ نهرّبها ونقبل روابط https فقط (حماية من إدخال كود)
    const esc = (v) => String(v ?? "").replace(/[&<>"']/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch]));
    const safeUrl = (u) => /^https:\/\/[^\s"'<>]+$/i.test(String(u || "")) ? esc(u) : "";
    const social = Object.entries(CONFIG.social || {}).filter(([, url]) => safeUrl(url));
    $("#socialList").innerHTML = social.length
      ? social.map(([k, url]) => `<a href="${safeUrl(url)}" target="_blank" rel="noopener noreferrer" aria-label="${esc(SOCIAL_META[k]?.[1] || k)}">${icon(SOCIAL_META[k]?.[0] || "i-link")}</a>`).join("")
      : "";

    const c = CONFIG.contact || {};
    const items = [];
    const email = /^[^\s@<>"']+@[^\s@<>"']+\.[^\s@<>"']+$/.test(c.email || "") ? esc(c.email) : "";
    const phone = /^[+0-9\s-]{6,20}$/.test(c.phone || "") ? esc(c.phone) : "";
    if (email) items.push(`<li>${icon("i-mail")}<a href="mailto:${email}">${email}</a></li>`);
    if (phone) items.push(`<li>${icon("i-phone")}<a href="tel:${phone.replace(/\s/g, "")}" dir="ltr">${phone}</a></li>`);
    if (c.location) items.push(`<li>${icon("i-pin")}<span>${esc(c.location)}</span></li>`);
    $("#contactList").innerHTML = items.length || social.length
      ? items.join("")
      : `<li class="soon">معلومات التواصل وحسابات التواصل الاجتماعي ستُضاف قريبًا.</li>`;
  }

  /* ---------- صورة السوار: يظهر الرسم البديل إن لم تتوفر الصورة (بدون onerror داخل HTML) ---------- */
  function setupImageFallbacks() {
    $$(".band-img").forEach((img) => {
      const fail = () => img.closest(".band-figure")?.classList.add("no-img");
      if (img.complete && !img.naturalWidth) fail();
      img.addEventListener("error", fail);
    });
  }

  /* ---------- الترويسة والقائمة وزر الهاتف ---------- */
  function setupHeader() {
    const header = $("#siteHeader");
    const nav = $("#mainNav");
    const toggle = $("#navToggle");
    const mobileCta = $("#mobileCta");
    const hero = $(".hero");
    const download = $("#download") || $("#apply"); // نهاية الصفحة: التحميل أو نموذج الشراكة

    const onScroll = () => header.classList.toggle("scrolled", window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    toggle.addEventListener("click", () => {
      const open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(open));
    });
    $$("a", nav).forEach((a) => a.addEventListener("click", () => {
      nav.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    }));

    if ("IntersectionObserver" in window && hero && download && mobileCta) {
      // يظهر زر الهاتف بعد تجاوز الواجهة، ويختفي عند الوصول لقسم التحميل
      let heroVisible = true, dlVisible = false;
      const update = () => mobileCta.classList.toggle("show", !heroVisible && !dlVisible);
      new IntersectionObserver(([e]) => { heroVisible = e.isIntersecting; update(); }, { threshold: 0.1 }).observe(hero);
      new IntersectionObserver(([e]) => { dlVisible = e.isIntersecting; update(); }, { threshold: 0.1 }).observe(download);

      // تمييز الرابط النشط
      // الروابط الداخلية فقط (#قسم)؛ روابط الصفحات الأخرى لا تُراقب
      const links = $$("a:not([data-tab])", nav).filter((a) => /^#.+/.test(a.getAttribute("href") || ""));
      const sections = links.map((a) => document.getElementById(a.getAttribute("href").slice(1))).filter(Boolean);
      const spy = new IntersectionObserver((entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          links.forEach((a) => a.classList.toggle("active", a.getAttribute("href") === `#${e.target.id}`));
        });
      }, { rootMargin: "-45% 0px -50% 0px" });
      sections.forEach((s) => spy.observe(s));
    }
  }

  /* ---------- ظهور العناصر عند التمرير ---------- */
  function setupReveal() {
    const els = $$(".reveal");
    if (reduceMotion || !("IntersectionObserver" in window)) { els.forEach((el) => el.classList.add("in")); return; }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
    }, { threshold: 0.15, rootMargin: "0px 0px -40px 0px" });
    els.forEach((el) => io.observe(el));
  }

  /* ---------- رموز QR التوضيحية داخل الشاشات ---------- */
  function setupMockQR() {
    $$(".mock-qr").forEach((el) => {
      const n = 17;
      let seed = Number(el.dataset.seed || 1);
      const rand = () => ((seed = (seed * 9301 + 49297) % 233280) / 233280);
      const finder = (r, c) => {
        const inBox = (r0, c0) => r >= r0 && r < r0 + 5 && c >= c0 && c < c0 + 5;
        const box = [[0, 0], [0, n - 5], [n - 5, 0]].find(([r0, c0]) => inBox(r0, c0));
        if (!box) return null;
        const [r0, c0] = box, rr = r - r0, cc = c - c0;
        return rr === 0 || rr === 4 || cc === 0 || cc === 4 || (rr === 2 && cc === 2);
      };
      let html = "";
      for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) {
        const f = finder(r, c);
        const on = f === null ? rand() > 0.52 : f;
        html += `<i${on ? "" : ' class="off"'}></i>`;
      }
      el.innerHTML = html;
    });
  }

  /* ---------- منشئ الباقات ---------- */
  function setupPackages() {
    const grid = $("#pkgItems");
    if (!grid) return;
    const basket = $("#pkgBasket");
    const empty = $("#pkgEmpty");
    const count = $("#pkgCount");
    const title = $("#pkgPhoneTitle");
    const hint = $("#pkgHint");
    let selected = new Set(PRESETS.family.items);
    let current = "family";

    grid.innerHTML = PACKAGE_ITEMS.map((it) => `
      <button class="pkg-chip${it.locked ? " locked" : ""}" data-id="${it.id}" aria-pressed="false" style="--art:${it.art}">
        ${icon(it.icon)}<span>${it.name}</span>${icon("i-check").replace('class="ico"', 'class="ico mark"')}
      </button>`).join("");

    const render = () => {
      $$(".pkg-chip", grid).forEach((b) => {
        const on = selected.has(b.dataset.id);
        b.classList.toggle("on", on);
        b.setAttribute("aria-pressed", String(on));
      });
      const chosen = PACKAGE_ITEMS.filter((it) => selected.has(it.id));
      basket.innerHTML = chosen.map((it, i) => `
        <li style="--art:${it.art};animation-delay:${i * 60}ms">
          <span class="b-ico">${icon(it.icon)}</span>
          <span><b>${it.name}</b><small>${it.note}</small></span>
          <span class="b-ok">${icon("i-check")}</span>
        </li>`).join("");
      empty.classList.toggle("show", chosen.length === 0);
      count.textContent = chosen.length;
    };

    // أسماء أزرار الباقات من بيانات الفعالية إن وُجدت
    $$(".preset").forEach((b) => { const pr = PRESETS[b.dataset.preset]; if (pr && pr.label) b.textContent = pr.label; });

    const setPreset = (key) => {
      current = key;
      selected = new Set(PRESETS[key].items);
      title.textContent = PRESETS[key].title;
      hint.textContent = PRESETS[key].hint;
      $$(".preset").forEach((p) => {
        const on = p.dataset.preset === key;
        p.classList.toggle("is-active", on);
        p.setAttribute("aria-pressed", String(on));
      });
      render();
    };

    $$(".preset").forEach((p) => p.addEventListener("click", () => setPreset(p.dataset.preset)));

    grid.addEventListener("click", (e) => {
      const btn = e.target.closest(".pkg-chip");
      if (!btn) return;
      const id = btn.dataset.id;
      const item = PACKAGE_ITEMS.find((x) => x.id === id);
      if (item.locked) { toast("دخول المهرجان جزء أساسي من كل باقة."); return; }
      selected.has(id) ? selected.delete(id) : selected.add(id);
      // أي تعديل يدوي يحوّل الباقة إلى «مخصصة»
      if (current !== "custom") {
        current = "custom";
        title.textContent = PRESETS.custom.title;
        hint.textContent = PRESETS.custom.hint;
        $$(".preset").forEach((p) => {
          const on = p.dataset.preset === "custom";
          p.classList.toggle("is-active", on);
          p.setAttribute("aria-pressed", String(on));
        });
      }
      render();
    });

    setPreset("family");
  }

  /* ---------- الجواز الرقمي: بطاقة ولاء لكل شريك + يومياتي ----------
     لا توجد نقاط ولا تُجمع الأختام بين شركاء مختلفين:
     كل شريك له بطاقته، وكل زيارة له = ختم في بطاقته فقط،
     والشريك يحدد عدد الزيارات ونوع المكافأة. */
  function setupPassport() {
    const slotsEl = $("#ppSlots");
    if (!slotsEl) return () => {};
    const tabs = $$(".pp-tabs [data-card]");
    const cardEl = $("#ppCard");
    const nameEl = $("#ppCardName");
    const iconEl = $("#ppCardIcon");
    const next = $("#ppNext");
    const reward = $("#ppReward");
    const rewardTitle = $("#ppRewardTitle");
    const rewardSub = $("#ppRewardSub");
    const journal = $("#ppJournal");
    const journalList = $("#ppJournalList");
    const addBtn = $("#ppAdd");
    const addLabel = addBtn ? addBtn.querySelector("span") : null;
    const resetBtn = $("#ppReset");
    const flow = $("#flow3");
    const fSteps = flow ? $$(".f-step", flow) : [];
    const fLines = flow ? $$(".f-line", flow) : [];

    const CARDS = PASSPORT_CARDS;
    // أسماء تبويبات البطاقات من بيانات الفعالية إن وُجدت
    tabs.forEach((t) => { const c = CARDS.find((x) => x.id === t.dataset.card); if (c && c.label) t.textContent = c.label; });
    const visits = Object.fromEntries(CARDS.map((c) => [c.id, 0]));
    let current = CARDS[0].id, autoTimer = null, flowTimer = null, momentIdx = 0;

    const card = () => CARDS.find((c) => c.id === current);
    const total = (c) => c.stamps + c.rewards.length;
    const rewardAt = (c, n) => c.rewards.find((r) => r.at === n);

    const render = () => {
      if (current === "journal") return;
      const c = card(), v = visits[c.id], t = total(c);
      nameEl.textContent = c.name;
      iconEl.innerHTML = icon(c.icon);
      slotsEl.style.setProperty("--cols", t <= 4 ? t : 4);
      let html = "";
      for (let n = 1; n <= t; n++) {
        const r = rewardAt(c, n);
        const done = v >= n, ready = v === n - 1;
        if (r) {
          const lbl = r.label.replace(/(\d+\s*%)/, '<span dir="ltr">$1</span>'); // يبقى «30%» بالترتيب الصحيح داخل النص العربي
          html += `<div class="pp-slot is-reward${done ? " used" : ""}${ready ? " ready" : ""}"><b>${lbl}</b><small>${r.ordinal}</small></div>`;
        } else {
          html += `<div class="pp-slot${done ? " on" : ""}">${done ? icon("i-check") : `<span>${n}</span>`}</div>`;
        }
      }
      slotsEl.innerHTML = html;

      // ما الذي ينتظرك؟
      const upcoming = c.rewards.find((r) => r.at > v);
      if (!upcoming) {
        next.textContent = "اكتملت البطاقة — تبدأ بطاقة جديدة مع زيارتك القادمة";
      } else if (upcoming.at === v + 1) {
        next.textContent = `زيارتك القادمة (${upcoming.ordinal}): ${upcoming.label}`;
      } else {
        const left = upcoming.at - 1 - v;
        const leftTxt = left === 1 ? "بقيت زيارة واحدة" : left === 2 ? "بقيت زيارتان" : `بقيت ${left} زيارات`;
        next.textContent = `${leftTxt}، ثم ${upcoming.label} في الزيارة ${upcoming.ordinal}`;
      }
      const ready = c.rewards.find((r) => r.at === v + 1);
      const used = [...c.rewards].reverse().find((r) => r.at === v);
      if (ready || used) {
        const r = ready || used;
        rewardTitle.textContent = ready ? `مكافأتك جاهزة: ${r.label}` : `حصلت على: ${r.label}`;
        rewardSub.textContent = ready ? `على زيارتك ${r.ordinal} لدى ${c.name}` : r.note;
        reward.classList.add("show");
      } else {
        reward.classList.remove("show");
      }
    };

    const playFlow = () => {
      if (!fSteps.length) return;
      clearTimeout(flowTimer);
      fSteps.forEach((s) => s.classList.remove("active", "done"));
      fLines.forEach((l) => l.classList.remove("fill"));
      const seq = [
        () => fSteps[0].classList.add("active"),
        () => { fSteps[0].classList.replace("active", "done"); fLines[0].classList.add("fill"); },
        () => fSteps[1].classList.add("active"),
        () => { fSteps[1].classList.replace("active", "done"); fLines[1].classList.add("fill"); },
        () => fSteps[2].classList.add("active")
      ];
      let i = 0;
      const run = () => { seq[i++](); if (i < seq.length) flowTimer = setTimeout(run, 380); };
      run();
    };

    const renderJournal = () => {
      journalList.innerHTML = PASSPORT_MOMENTS.slice(0, momentIdx + 1).reverse().map((m) => `
        <article class="pj-entry">
          <div class="pj-photo" style="--a:${m.a};--b:${m.b}">${icon("i-camera")}</div>
          <div class="pj-text"><b>${m.place}</b><p>«${m.note}»</p><span class="pj-feel">${m.feel}</span></div>
        </article>`).join("");
    };

    const show = (id) => {
      current = id;
      tabs.forEach((t) => { const on = t.dataset.card === id; t.classList.toggle("is-active", on); t.setAttribute("aria-selected", String(on)); });
      const isJournal = id === "journal";
      cardEl.hidden = isJournal;
      journal.hidden = !isJournal;
      if (isJournal) { reward.classList.remove("show"); renderJournal(); }
      if (addLabel) addLabel.textContent = isJournal ? "جرّب: أضف لحظة" : "جرّب: أضف زيارة";
      render();
    };

    const addVisit = () => {
      if (current === "journal") {
        momentIdx = Math.min(momentIdx + 1, PASSPORT_MOMENTS.length - 1);
        renderJournal();
        return;
      }
      const c = card();
      visits[c.id] = visits[c.id] >= total(c) ? 1 : visits[c.id] + 1; // بعد اكتمال البطاقة تبدأ بطاقة جديدة
      render();
      playFlow();
    };

    const reset = () => {
      clearInterval(autoTimer);
      CARDS.forEach((c) => { visits[c.id] = 0; });
      momentIdx = 0;
      fSteps.forEach((s) => s.classList.remove("active", "done"));
      fLines.forEach((l) => l.classList.remove("fill"));
      show(CARDS[0].id);
    };

    tabs.forEach((t) => t.addEventListener("click", () => { clearInterval(autoTimer); show(t.dataset.card); }));
    if (addBtn) addBtn.addEventListener("click", () => { clearInterval(autoTimer); addVisit(); });
    if (resetBtn) resetBtn.addEventListener("click", reset);
    show(CARDS[0].id);

    // تشغيل تلقائي: أربع زيارات للمطعم عند ظهور الجواز لأول مرة
    let started = false;
    return () => {
      if (started) return;
      started = true;
      let n = 0;
      autoTimer = setInterval(() => { addVisit(); if (++n >= 4) clearInterval(autoTimer); }, 900);
    };
  }

  /* ---------- تبويبات «اكتشف شُرفة» ----------
     تتنقل تلقائيًا كل 8 ثوانٍ حتى يتفاعل الزائر، ثم تتوقف. */
  function setupTabs(onPassport) {
    const section = $("#explore");
    const stage = $("#exStage");
    if (!section || !stage) return;
    const tabs = $$(".ex-tab");
    const panels = $$(".ex-panel");
    const navLinks = $$("#mainNav a[data-tab]");
    const order = tabs.map((t) => t.dataset.tab);
    const DURATION = 8000;
    const isMobile = () => window.matchMedia("(max-width: 960px)").matches;
    let current = order[0], timer = null, auto = !reduceMotion, inView = false;

    const updateNav = () => navLinks.forEach((a) => a.classList.toggle("active", inView && a.dataset.tab === current));

    const schedule = () => {
      clearTimeout(timer);
      if (!auto || !inView) return;
      timer = setTimeout(() => activate(order[(order.indexOf(current) + 1) % order.length]), DURATION);
    };

    function activate(key, { focus = false } = {}) {
      current = key;
      tabs.forEach((t) => {
        const on = t.dataset.tab === key;
        t.classList.toggle("is-active", on);
        t.setAttribute("aria-selected", String(on));
        t.tabIndex = on ? 0 : -1;
        if (on && focus) t.focus();
        t.classList.remove("is-playing");
        if (on && auto && inView) { void t.offsetWidth; t.classList.add("is-playing"); }
        if (on && isMobile()) {
          const bar = t.parentElement;
          bar.scrollTo({ left: t.offsetLeft - (bar.clientWidth - t.clientWidth) / 2, behavior: reduceMotion ? "auto" : "smooth" });
        }
      });
      panels.forEach((p) => p.classList.toggle("is-active", p.dataset.tab === key));
      if (key === "passport") onPassport();
      updateNav();
      schedule();
    }

    const stopAuto = () => {
      if (!auto) return;
      auto = false;
      clearTimeout(timer);
      tabs.forEach((t) => t.classList.remove("is-playing"));
    };

    tabs.forEach((t) => {
      t.style.setProperty("--dur", `${DURATION}ms`);
      t.addEventListener("click", () => { stopAuto(); activate(t.dataset.tab); });
      t.addEventListener("keydown", (e) => {
        const dir = { ArrowLeft: 1, ArrowRight: -1 }[e.key]; // اتجاه RTL
        if (!dir) return;
        e.preventDefault();
        stopAuto();
        activate(order[(order.indexOf(current) + dir + order.length) % order.length], { focus: true });
      });
    });
    stage.addEventListener("pointerdown", stopAuto);
    stage.addEventListener("focusin", stopAuto);

    // روابط القائمة والتذييل التي تفتح تبويبًا محددًا
    $$("a[data-tab]").forEach((a) => a.addEventListener("click", () => { stopAuto(); activate(a.dataset.tab); }));

    if ("IntersectionObserver" in window) {
      new IntersectionObserver(([e]) => {
        inView = e.isIntersecting;
        if (inView) activate(current);
        else { clearTimeout(timer); tabs.forEach((t) => t.classList.remove("is-playing")); updateNav(); }
      }, { threshold: 0.3 }).observe(section);
    }
  }

  /* ---------- تشغيل ---------- */
  document.documentElement.classList.remove("no-js");
  setupStores();
  setupFooter();
  setupImageFallbacks();
  setupHeader();
  setupMockQR();
  setupPackages();
  const startPassport = setupPassport();
  setupTabs(startPassport);
  // في الصفحات التي لا تحتوي تبويبات (مثل الرئيسية) يبدأ عرض الجواز عند ظهوره
  if (!document.getElementById("explore")) onVisible($("#ppSlots"), startPassport);
  setupReveal();
})();
