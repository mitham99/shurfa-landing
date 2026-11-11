/* =========================================================
   شُرفة — الصفحة الرئيسية للمنصة
   يعرض الفعاليات والخدمات والشركاء من assets/js/data.js
   ========================================================= */
(() => {
  "use strict";

  const DATA = window.SHURFA_DATA || { events: [], services: [], partnerTypes: [], partners: [] };
  const $ = (s, el = document) => el.querySelector(s);
  const icon = (id) => `<svg class="ico" aria-hidden="true"><use href="#${id}"/></svg>`;
  // أيقونة الهوية (b-) إن وُجدت، وإلا الأيقونة الخطية البسيطة
  const bicon = (id) => {
    const b = "b-" + String(id || "").replace(/^i-/, "");
    return document.getElementById(b) ? `<svg class="ico" aria-hidden="true"><use href="#${b}"/></svg>` : icon(id);
  };
  const esc = (v) => String(v ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  const EVENT_STATUS = {
    available: { label: "متاحة", cls: "st-live" },
    soon:      { label: "قريبًا", cls: "st-soon" },
    ended:     { label: "منتهية", cls: "st-ended" }
  };
  const SERVICE_STATUS = {
    live:  { label: "متاح", cls: "st-live" },
    event: { label: "ضمن الفعاليات", cls: "st-event" },
    soon:  { label: "قريبًا", cls: "st-soon" }
  };

  /* ---------- الفعاليات ---------- */
  function renderEvents() {
    const grid = $("#eventGrid");
    const filters = $("#eventFilters");
    if (!grid) return;
    const events = DATA.events || [];

    const card = (ev) => {
      const st = EVENT_STATUS[ev.status] || EVENT_STATUS.soon;
      const c = ev.colors || {};
      const style = `--ev-from:${esc(c.from || "#1A2E28")};--ev-to:${esc(c.to || "#2E5148")};--ev-ac:${esc(c.accent || "#F5A623")}`;
      const href = ev.url && ev.status !== "ended" ? esc(ev.url) : "";
      const cover = ev.image
        ? `<img src="${esc(ev.image)}" alt="${esc(ev.name)}" loading="lazy">`
        : `<span class="ev-art">${bicon(ev.icon || "i-calendar")}</span>`;
      const tags = (ev.tags || []).map((t) => `<li>${esc(t)}</li>`).join("");
      const btn = href
        ? `<a class="btn btn-primary btn-sm ev-btn" href="${href}">استكشف الفعالية${icon("i-arrow")}</a>`
        : `<span class="btn btn-sm ev-btn is-disabled">${ev.status === "ended" ? "انتهت الفعالية" : "تفاصيل قريبًا"}</span>`;
      return `
        <article class="event-card ${ev.status === "ended" ? "is-ended" : ""}" data-status="${esc(ev.status)}" style="${style}">
          <div class="ev-cover">${cover}<span class="st ${st.cls}">${st.label}</span></div>
          <div class="ev-body">
            <h3>${href ? `<a href="${href}">${esc(ev.name)}</a>` : esc(ev.name)}</h3>
            <p>${esc(ev.summary)}</p>
            <ul class="ev-meta">
              <li>${icon("i-pin")}${esc(ev.location || "—")}</li>
              <li>${icon("i-calendar")}${esc(ev.date || ev.dateNote || "يُعلن لاحقًا")}</li>
            </ul>
            ${tags ? `<ul class="ev-tags">${tags}</ul>` : ""}
            ${btn}
          </div>
        </article>`;
    };

    const comingCard = DATA.showComingSoonCard ? `
      <article class="event-card is-coming" data-status="soon">
        <span class="ec-ico">${icon("i-plus")}</span>
        <h3>فعاليات وتجارب جديدة قريبًا</h3>
        <p>تستعد شُرفة لاستضافة فعاليات وتجارب سياحية أخرى في مختلف مناطق عُمان.</p>
        <a class="btn btn-ghost btn-sm" href="partners.html">تنظّم فعالية؟ انضم إلى شُرفة</a>
      </article>` : "";

    const render = (filter) => {
      const list = filter === "all" ? events : events.filter((e) => e.status === filter);
      grid.innerHTML = list.length
        ? list.map(card).join("") + (filter === "all" || filter === "soon" ? comingCard : "")
        : `<p class="empty-note">لا توجد فعاليات بهذه الحالة حاليًا.</p>` + (filter === "soon" ? comingCard : "");
    };

    // أزرار التصفية تظهر فقط عند وجود أكثر من حالة
    const statuses = [...new Set(events.map((e) => e.status))];
    if (filters && statuses.length > 1) {
      const opts = [["all", "الكل"], ...["available", "soon", "ended"].filter((s) => statuses.includes(s)).map((s) => [s, EVENT_STATUS[s].label])];
      filters.innerHTML = opts.map(([k, l], i) => `<button class="chip-btn${i === 0 ? " is-active" : ""}" data-f="${k}" aria-pressed="${i === 0}">${l}</button>`).join("");
      filters.addEventListener("click", (e) => {
        const b = e.target.closest("[data-f]");
        if (!b) return;
        filters.querySelectorAll("[data-f]").forEach((x) => { x.classList.toggle("is-active", x === b); x.setAttribute("aria-pressed", String(x === b)); });
        render(b.dataset.f);
      });
    } else if (filters) {
      filters.hidden = true;
    }
    render("all");
  }

  /* ---------- الخدمات ---------- */
  function renderServices() {
    const grid = $("#serviceGrid");
    if (!grid) return;
    grid.innerHTML = (DATA.services || []).map((s) => {
      const st = SERVICE_STATUS[s.status] || SERVICE_STATUS.soon;
      const inner = `
        <span class="svc-ico">${bicon(s.icon)}</span>
        <span class="st ${st.cls}">${st.label}</span>
        <h3>${esc(s.name)}</h3>
        <p>${esc(s.desc)}</p>
        ${s.note ? `<small class="svc-note">${esc(s.note)}</small>` : ""}`;
      const style = `style="--ac:${esc(s.color || "var(--green)")}"`;
      return s.link && s.status !== "soon"
        ? `<a class="svc-card reveal" href="${esc(s.link)}" ${style}>${inner}<span class="svc-go">${icon("i-arrow")}</span></a>`
        : `<div class="svc-card reveal ${s.status === "soon" ? "is-soon" : ""}" ${style}>${inner}</div>`;
    }).join("");
  }

  /* ---------- الشركاء ---------- */
  function renderPartners() {
    const grid = $("#partnerGrid");
    const filters = $("#partnerFilters");
    if (!grid) return;
    const types = DATA.partnerTypes || [];
    const partners = DATA.partners || [];
    const typeName = (id) => (types.find((t) => t.id === id) || {}).name || "";

    filters.innerHTML = [["all", "الكل", "i-grid"], ...types.map((t) => [t.id, t.name, t.icon])]
      .map(([k, l, ic], i) => `<button class="chip-btn${i === 0 ? " is-active" : ""}" data-f="${k}" aria-pressed="${i === 0}">${icon(ic)}${esc(l)}</button>`).join("");

    const render = (f) => {
      const list = f === "all" ? partners : partners.filter((p) => p.type === f);
      if (list.length) {
        grid.className = "partner-grid has-logos";
        grid.innerHTML = list.map((p) => `
          <div class="partner-logo" title="${esc(p.name)}">
            ${p.logo ? `<img src="${esc(p.logo)}" alt="${esc(p.name)}" loading="lazy">` : `<b>${esc(p.name)}</b>`}
            <small>${esc(typeName(p.type))}${p.event ? ` · ${esc(p.event)}` : ""}</small>
          </div>`).join("");
        return;
      }
      // لا يوجد شركاء معلنون بعد: نعرض مجالات الشراكة بصدق مع حالة «قريبًا»
      grid.className = "partner-grid";
      const shown = f === "all" ? types : types.filter((t) => t.id === f);
      grid.innerHTML = shown.map((t) => `
        <div class="ptype-card">
          <span class="pt-ico">${bicon(t.icon)}</span>
          <div><b>${esc(t.name)}</b><p>${esc(t.desc)}</p></div>
          <span class="pt-soon">يُعلن عن الشركاء قريبًا</span>
        </div>`).join("");
    };

    filters.addEventListener("click", (e) => {
      const b = e.target.closest("[data-f]");
      if (!b) return;
      filters.querySelectorAll("[data-f]").forEach((x) => { x.classList.toggle("is-active", x === b); x.setAttribute("aria-pressed", String(x === b)); });
      render(b.dataset.f);
    });
    render("all");
  }

  /* ---------- زر «اكتشف الجواز الرقمي» ---------- */
  function setupPassportHow() {
    const btn = $("#hpHowBtn");
    const box = $("#passportHow");
    if (!btn || !box) return;
    btn.addEventListener("click", () => {
      const open = box.hidden;
      box.hidden = !open;
      btn.setAttribute("aria-expanded", String(open));
      if (open) box.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  }

  renderEvents();
  renderServices();
  renderPartners();
  setupPassportHow();
})();
