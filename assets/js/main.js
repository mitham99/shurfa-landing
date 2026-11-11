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
  const PACKAGE_ITEMS = [
    { id: "entry",   name: "دخول المهرجان",   note: "أساس كل باقة",          icon: "i-ticket", art: "linear-gradient(135deg,#1A2E28,#2E5148)", locked: true },
    { id: "concert", name: "حفلة غنائية",     note: "عند توفرها",            icon: "i-music",  art: "linear-gradient(135deg,#7B5BA7,#5F4486)" },
    { id: "meal",    name: "وجبة أو عشاء",    note: "من المطاعم المشاركة",   icon: "i-food",   art: "linear-gradient(135deg,#E4573D,#C7432B)" },
    { id: "coffee",  name: "قهوة ومشروبات",   note: "من المقاهي المشاركة",   icon: "i-coffee", art: "linear-gradient(135deg,#8B5E3C,#6B4529)" },
    { id: "sweets",  name: "حلويات",          note: "من العلامات المشاركة",  icon: "i-sweet",  art: "linear-gradient(135deg,#F5A623,#E08E0B)" },
    { id: "games",   name: "ألعاب وأنشطة",    note: "ترفيه للعائلة",         icon: "i-game",   art: "linear-gradient(135deg,#2CA6A4,#1F8583)" }
  ];

  const PRESETS = {
    family:  { title: "باقة العائلة",   hint: "دخول المهرجان + وجبة عائلية + مشروبات + ألعاب للأطفال.",       items: ["entry", "meal", "coffee", "games"] },
    friends: { title: "باقة الأصدقاء",  hint: "دخول المهرجان + حفلة عند توفرها + مشروبات وحلويات.",           items: ["entry", "concert", "coffee", "sweets"] },
    custom:  { title: "باقتي المخصصة",  hint: "اختر الخدمات التي تناسب اهتماماتك وميزانيتك — اضغط لإضافتها.", items: ["entry"] }
  };

  /* ---------- أختام الجواز (عرض توضيحي) ---------- */
  const PASSPORT_STAMPS = [
    { name: "الدخول", icon: "i-ticket" },
    { name: "مطعم",   icon: "i-food" },
    { name: "مقهى",   icon: "i-coffee" },
    { name: "حلويات", icon: "i-sweet" },
    { name: "ألعاب",  icon: "i-game" },
    { name: "حفلة",   icon: "i-music" }
  ];
  const POINTS_PER_STAMP = 50; // قيمة توضيحية فقط

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
      const url = stores[a.dataset.store];
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
    const social = Object.entries(CONFIG.social || {}).filter(([, url]) => url);
    $("#socialList").innerHTML = social.length
      ? social.map(([k, url]) => `<a href="${url}" target="_blank" rel="noopener" aria-label="${SOCIAL_META[k]?.[1] || k}">${icon(SOCIAL_META[k]?.[0] || "i-link")}</a>`).join("")
      : "";

    const c = CONFIG.contact || {};
    const items = [];
    if (c.email) items.push(`<li>${icon("i-mail")}<a href="mailto:${c.email}">${c.email}</a></li>`);
    if (c.phone) items.push(`<li>${icon("i-phone")}<a href="tel:${c.phone.replace(/\s/g, "")}" dir="ltr">${c.phone}</a></li>`);
    if (c.location) items.push(`<li>${icon("i-pin")}<span>${c.location}</span></li>`);
    $("#contactList").innerHTML = items.length || social.length
      ? items.join("")
      : `<li class="soon">معلومات التواصل وحسابات التواصل الاجتماعي ستُضاف قريبًا.</li>`;
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
      const links = $$("a:not([data-tab])", nav);
      const sections = links.map((a) => $(a.getAttribute("href"))).filter(Boolean);
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

  /* ---------- جواز السياحة الرقمي ---------- */
  function setupPassport() {
    const stampsEl = $("#ppStamps");
    if (!stampsEl) return () => {};
    const pointsEl = $("#ppPoints");
    const bar = $("#ppBar");
    const next = $("#ppNext");
    const reward = $("#ppReward");
    const addBtn = $("#ppAdd");
    const resetBtn = $("#ppReset");
    const flow = $("#flow3");
    const fSteps = $$(".f-step", flow);
    const fLines = $$(".f-line", flow);
    const total = PASSPORT_STAMPS.length;
    let count = 0, points = 0, autoTimer = null, flowTimer = null;

    stampsEl.innerHTML = PASSPORT_STAMPS.map((s) => `<div class="stamp">${icon(s.icon)}<span>${s.name}</span></div>`).join("");
    const stamps = $$(".stamp", stampsEl);

    const animateNumber = (from, to) => {
      if (reduceMotion) { pointsEl.textContent = to; return; }
      const start = performance.now(), dur = 600;
      const step = (t) => {
        const p = Math.min(1, (t - start) / dur);
        pointsEl.textContent = Math.round(from + (to - from) * (1 - Math.pow(1 - p, 3)));
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };

    const playFlow = () => {
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

    const addStamp = () => {
      if (count >= total) return;
      stamps[count].classList.add("on");
      count++;
      const prev = points;
      points += POINTS_PER_STAMP;
      animateNumber(prev, points);
      bar.style.width = `${(count / total) * 100}%`;
      next.textContent = count < total ? `بقي ${total - count} أختام لفتح مكافأتك` : "اكتمل جوازك — مكافأتك متاحة!";
      playFlow();
      if (count === total) {
        reward.classList.add("show");
        addBtn.disabled = true;
        addBtn.style.opacity = ".5";
      }
    };

    const reset = () => {
      clearInterval(autoTimer);
      count = 0; points = 0;
      stamps.forEach((s) => s.classList.remove("on"));
      pointsEl.textContent = "0";
      bar.style.width = "0";
      next.textContent = "أكمل الأختام لفتح مكافأتك";
      reward.classList.remove("show");
      addBtn.disabled = false;
      addBtn.style.opacity = "";
      fSteps.forEach((s) => s.classList.remove("active", "done"));
      fLines.forEach((l) => l.classList.remove("fill"));
    };

    addBtn.addEventListener("click", () => { clearInterval(autoTimer); addStamp(); });
    resetBtn.addEventListener("click", reset);

    // تشغيل تلقائي لأول ثلاثة أختام عند فتح تبويب الجواز لأول مرة
    let started = false;
    return () => {
      if (started) return;
      started = true;
      let n = 0;
      autoTimer = setInterval(() => { addStamp(); if (++n >= 3) clearInterval(autoTimer); }, 1000);
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
  setupHeader();
  setupMockQR();
  setupPackages();
  setupTabs(setupPassport());
  setupReveal();
})();
