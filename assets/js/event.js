/* =========================================================
   شُرفة — قالب صفحة الفعالية (مشترك لكل المهرجانات)
   ---------------------------------------------------------
   كل صفحة فعالية (مثل sohar-festival.html) تحتوي فقط:
     <div id="eventRoot" class="ev-page" data-event="sohar-festival"></div>
   وهذا الملف يبني محتواها من assets/js/data.js ← events.
   الإطار (الترويسة، الأزرار، التذييل) يبقى بهوية شُرفة،
   والمشهد (الشعار، الألوان، الصورة) بهوية المهرجان.
   ⚠ هذا الملف مولَّد من قالب؛ عدّل النصوص العامة هنا، وبيانات كل مهرجان في data.js
   ========================================================= */
(() => {
  "use strict";

  const TPL = {
"tabs": {
"tickets": "      <button class=\"ex-tab\" role=\"tab\" aria-selected=\"false\" aria-controls=\"tab-tickets\" data-tab=\"tickets\" style=\"--ac:{{AC}}\">\n        <span class=\"t-ico\"><svg class=\"ico\"><use href=\"#b-ticket\"/></svg></span>\n        <span class=\"t-txt\"><b>حجز التذاكر</b><small>تذكرتك رقميًا</small><em class=\"t-short\">التذاكر</em></span>\n        <span class=\"t-prog\"><i></i></span>\n      </button>",
"packages": "      <button class=\"ex-tab\" role=\"tab\" aria-selected=\"false\" aria-controls=\"tab-packages\" data-tab=\"packages\" style=\"--ac:{{AC}}\">\n        <span class=\"t-ico\"><svg class=\"ico\"><use href=\"#b-box\"/></svg></span>\n        <span class=\"t-txt\"><b>الباقات المخصصة</b><small>جمّع تجربتك</small><em class=\"t-short\">الباقات</em></span>\n        <span class=\"t-prog\"><i></i></span>\n      </button>",
"passport": "      <button class=\"ex-tab\" role=\"tab\" aria-selected=\"false\" aria-controls=\"tab-passport\" data-tab=\"passport\" style=\"--ac:{{AC}}\">\n        <span class=\"t-ico\"><svg class=\"ico\"><use href=\"#b-passport\"/></svg></span>\n        <span class=\"t-txt\"><b>الجواز الرقمي</b><small>بطاقات ولاء</small><em class=\"t-short\">الجواز</em></span>\n        <span class=\"t-prog\"><i></i></span>\n      </button>",
"safety": "      <button class=\"ex-tab\" role=\"tab\" aria-selected=\"false\" aria-controls=\"tab-safety\" data-tab=\"safety\" style=\"--ac:{{AC}}\">\n        <span class=\"t-ico\"><svg class=\"ico\"><use href=\"#b-band\"/></svg></span>\n        <span class=\"t-txt\"><b>سوار الأمان</b><small>راحة بال للعائلة</small><em class=\"t-short\">السوار</em></span>\n        <span class=\"t-prog\"><i></i></span>\n      </button>"
},
"panels": {
"tickets": "      <!-- التذاكر -->\n      <article class=\"ex-panel\" id=\"tab-tickets\" role=\"tabpanel\" data-tab=\"tickets\" style=\"--ac:{{AC}};--ac-ink:{{ACINK}}\">\n        <div class=\"ex-copy\">\n          <span class=\"ex-num\">{{NUM}} · حجز التذاكر</span>\n          <h3>تذكرتك للمهرجان، <br>في مكان واحد</h3>\n          <p>احجز تذاكر الدخول إلكترونيًا واحتفظ بها داخل التطبيق.</p>\n          <ol class=\"ex-steps\">\n            <li><span>1</span>اختر عدد التذاكر</li>\n            <li><span>2</span>أتمم عملية الشراء</li>\n            <li><span>3</span>تذكرتك الرقمية مع رمز QR</li>\n          </ol>\n          <div class=\"ex-ctas\"><a class=\"btn btn-accent\" href=\"#download\"><svg class=\"ico\"><use href=\"#i-download\"/></svg>حمّل التطبيق واحجز</a></div>\n          <p class=\"fine light\">يتم التحقق من الدخول عبر رمز QR وفق آلية التشغيل المعتمدة في المهرجان.</p>\n        </div>\n        <div class=\"ex-visual\" aria-hidden=\"true\">\n          <div class=\"tk tk-lg\">\n            <div class=\"tk-main\">\n              <small>شُرفة · تذكرة دخول</small>\n              <strong>{{NAME}}</strong>\n              <div class=\"tk-meta\"><span>الزائر</span><span>تذكرة رقمية</span></div>\n            </div>\n            <div class=\"tk-stub\"><div class=\"mock-qr\" data-seed=\"3\"></div></div>\n          </div>\n          <div class=\"ex-float\"><span class=\"c-ico c-gold\"><svg class=\"ico\"><use href=\"#i-scan\"/></svg></span><b>جاهزة للمسح عند البوابة</b></div>\n        </div>\n      </article>",
"packages": "      <!-- الباقات -->\n      <article class=\"ex-panel\" id=\"tab-packages\" role=\"tabpanel\" data-tab=\"packages\" style=\"--ac:{{AC}};--ac-ink:{{ACINK}}\">\n        <div class=\"ex-copy\">\n          <span class=\"ex-num\">{{NUM}} · الباقات المخصصة</span>\n          <h3>جمّع تجربتك على ذوقك</h3>\n          <p>الدخول والمطاعم والمقاهي والألعاب والفعاليات في عملية شراء واحدة.</p>\n          <div class=\"pkg-presets\" role=\"group\" aria-label=\"اختر نوع الباقة\">\n            <button class=\"preset is-active\" aria-pressed=\"true\" data-preset=\"family\">باقة العائلة</button>\n            <button class=\"preset\" aria-pressed=\"false\" data-preset=\"friends\">باقة الأصدقاء</button>\n            <button class=\"preset\" aria-pressed=\"false\" data-preset=\"custom\">باقتي المخصصة</button>\n          </div>\n          <div class=\"pkg-chips\" id=\"pkgItems\"><!-- تُبنى من main.js (PACKAGE_ITEMS) --></div>\n          <p class=\"pkg-hint\" id=\"pkgHint\"></p>\n          <div class=\"ex-ctas\"><a class=\"btn btn-accent\" href=\"#download\"><svg class=\"ico\"><use href=\"#i-download\"/></svg>كوّن باقتك في التطبيق</a></div>\n        </div>\n        <div class=\"ex-visual\">\n          <div class=\"phone phone-sm\">\n            <div class=\"phone-screen\">\n              <div class=\"app-status\"><span>9:41</span><span class=\"notch\"></span><span>●●●</span></div>\n              <div class=\"app-title\"><svg class=\"ico\"><use href=\"#i-box\"/></svg><strong id=\"pkgPhoneTitle\">باقة العائلة</strong></div>\n              <ul class=\"basket\" id=\"pkgBasket\"></ul>\n              <div class=\"basket-empty\" id=\"pkgEmpty\">اختر مكونات باقتك</div>\n              <div class=\"basket-foot\">\n                <div class=\"basket-count\"><span id=\"pkgCount\">0</span> عناصر في باقتك</div>\n                <span class=\"btn btn-brick btn-block\">متابعة</span>\n              </div>\n            </div>\n          </div>\n          <p class=\"fine light center\">المكونات والأسعار تُعرض داخل التطبيق حسب الشركاء المشاركين.</p>\n        </div>\n      </article>",
"passport": "      <!-- الجواز -->\n      <article class=\"ex-panel\" id=\"tab-passport\" role=\"tabpanel\" data-tab=\"passport\" style=\"--ac:{{AC}};--ac-ink:{{ACINK}}\">\n        <div class=\"ex-copy\">\n          <span class=\"ex-num\">{{NUM}} · الجواز الرقمي</span>\n          <h3>كل زيارة <br>تقرّبك من مكافأة</h3>\n          <p>لكل مطعم ولعبة في المهرجان بطاقة أختام خاصة بها. اجمع أختامك لدى الشريك نفسه واحصل على المكافأة التي يحددها، ووثّق لحظاتك بالصور.</p>\n          <div class=\"flow3\" id=\"flow3\">\n            <div class=\"f-step\"><span class=\"f-ico\"><svg class=\"ico\"><use href=\"#b-spark\"/></svg></span><b>زُر الشريك</b></div>\n            <div class=\"f-line\"><i></i></div>\n            <div class=\"f-step\"><span class=\"f-ico\"><svg class=\"ico\"><use href=\"#b-star\"/></svg></span><b>اجمع أختامه</b></div>\n            <div class=\"f-line\"><i></i></div>\n            <div class=\"f-step\"><span class=\"f-ico\"><svg class=\"ico\"><use href=\"#b-gift\"/></svg></span><b>استلم مكافأته</b></div>\n          </div>\n          <div class=\"ex-ctas\">\n            <button class=\"btn btn-accent\" id=\"ppAdd\"><svg class=\"ico\"><use href=\"#i-plus\"/></svg><span>جرّب: أضف زيارة</span></button>\n            <button class=\"btn btn-ghost-light\" id=\"ppReset\">إعادة</button>\n          </div>\n          <p class=\"fine light\">عرض توضيحي — عدد الزيارات ونوع المكافأة يحددهما كل شريك.</p>\n          <a class=\"ex-link\" href=\"index.html#passport\">اعرف المزيد عن الجواز الرقمي في شُرفة<svg class=\"ico\"><use href=\"#i-arrow\"/></svg></a>\n        </div>\n        <div class=\"ex-visual\">\n          <div class=\"phone phone-sm phone-dark\">\n            <div class=\"phone-screen pp-screen\">\n              <div class=\"app-status light\"><span>9:41</span><span class=\"notch\"></span><span>●●●</span></div>\n              <div class=\"pp-book\">\n                <div class=\"pp-cover\">\n                  <svg class=\"pp-emblem\"><use href=\"#logo-mark-white\"/></svg>\n                  <div><small>الجواز الرقمي</small><strong>{{NAME}}</strong></div>\n                </div>\n                <div class=\"pp-tabs\" role=\"tablist\" aria-label=\"أقسام الجواز\">\n                  <button type=\"button\" role=\"tab\" data-card=\"food\" class=\"is-active\" aria-selected=\"true\">مطعم</button>\n                  <button type=\"button\" role=\"tab\" data-card=\"games\" aria-selected=\"false\">ألعاب</button>\n                  <button type=\"button\" role=\"tab\" data-card=\"journal\" aria-selected=\"false\">يومياتي</button>\n                </div>\n                <div class=\"pp-card\" id=\"ppCard\">\n                  <div class=\"pp-card-head\"><span class=\"pp-card-ico\" id=\"ppCardIcon\"></span><div><b id=\"ppCardName\">مطعم شريك</b><small>بطاقة ولاء</small></div></div>\n                  <div class=\"pp-slots\" id=\"ppSlots\"></div>\n                  <small class=\"pp-next\" id=\"ppNext\"></small>\n                </div>\n                <div class=\"pp-journal\" id=\"ppJournal\" hidden>\n                  <div class=\"pj-list\" id=\"ppJournalList\"></div>\n                  <span class=\"pj-add\"><svg class=\"ico\"><use href=\"#i-camera\"/></svg>أضف صورة ولحظة من المكان</span>\n                </div>\n                <div class=\"pp-reward\" id=\"ppReward\">\n                  <svg class=\"ico\"><use href=\"#i-gift\"/></svg>\n                  <div><b id=\"ppRewardTitle\"></b><small id=\"ppRewardSub\"></small></div>\n                </div>\n              </div>\n            </div>\n          </div>\n        </div>\n      </article>",
"safety": "      <!-- السوار -->\n      <article class=\"ex-panel\" id=\"tab-safety\" role=\"tabpanel\" data-tab=\"safety\" style=\"--ac:{{AC}};--ac-ink:{{ACINK}}\">\n        <div class=\"ex-copy\">\n          <span class=\"ex-num\">{{NUM}} · سوار الأمان للأطفال · اختياري</span>\n          <h3>راحة بال أكبر لعائلتك</h3>\n          <p>سوار برمز QR مرتبط بحسابك، يصلك إشعار فور مسحه من فريق التنظيم.</p>\n          <ol class=\"ex-steps\">\n            <li><span>1</span>فعّل السوار واربطه بحسابك</li>\n            <li><span>2</span>المنظم يمسح الرمز عند الحاجة</li>\n            <li><span>3</span>يصلك إشعار وتتواصل مع الفريق</li>\n          </ol>\n          <ul class=\"ex-tags\">\n            <li><svg class=\"ico\"><use href=\"#i-eyeoff\"/></svg>رقمك لا يظهر للمنظم</li>\n            <li><svg class=\"ico\"><use href=\"#i-lock\"/></svg>صلاحيات محددة</li>\n            <li><svg class=\"ico\"><use href=\"#i-shield\"/></svg>بدون GPS أو تتبع</li>\n          </ul>\n          <div class=\"ex-ctas\"><a class=\"btn btn-accent\" href=\"#download\"><svg class=\"ico\"><use href=\"#i-download\"/></svg>فعّل السوار من التطبيق</a></div>\n        </div>\n        <div class=\"ex-visual\">\n          <figure class=\"band-figure\">\n            <div class=\"band-bg\"></div>\n            <!-- ضع صورة السوار الرسمية في assets/img/wristband.png -->\n            <img class=\"band-img\" src=\"assets/img/wristband.png\" alt=\"سوار الأمان من شُرفة برمز QR\" loading=\"lazy\" onerror=\"this.closest('.band-figure').classList.add('no-img')\">\n            <svg class=\"band-fallback\" viewBox=\"0 0 320 320\" aria-hidden=\"true\">\n              <defs><linearGradient id=\"bandG\" x1=\"0\" x2=\"1\"><stop offset=\"0\" stop-color=\"#2CA6A4\"/><stop offset=\"1\" stop-color=\"#1F8583\"/></linearGradient></defs>\n              <ellipse cx=\"160\" cy=\"165\" rx=\"128\" ry=\"112\" fill=\"none\" stroke=\"url(#bandG)\" stroke-width=\"34\"/>\n              <ellipse cx=\"160\" cy=\"165\" rx=\"128\" ry=\"112\" fill=\"none\" stroke=\"#fff\" stroke-opacity=\".18\" stroke-width=\"2\" stroke-dasharray=\"4 10\"/>\n              <rect x=\"112\" y=\"30\" width=\"96\" height=\"78\" rx=\"18\" fill=\"#FAF6F0\" stroke=\"#1A2E28\" stroke-width=\"3\"/>\n              <g fill=\"#1A2E28\"><rect x=\"124\" y=\"42\" width=\"18\" height=\"18\" rx=\"2\"/><rect x=\"178\" y=\"42\" width=\"18\" height=\"18\" rx=\"2\"/><rect x=\"124\" y=\"78\" width=\"18\" height=\"18\" rx=\"2\"/><rect x=\"150\" y=\"44\" width=\"6\" height=\"6\"/><rect x=\"160\" y=\"54\" width=\"6\" height=\"6\"/><rect x=\"150\" y=\"64\" width=\"6\" height=\"6\"/><rect x=\"166\" y=\"70\" width=\"6\" height=\"6\"/><rect x=\"180\" y=\"80\" width=\"6\" height=\"6\"/><rect x=\"190\" y=\"70\" width=\"6\" height=\"6\"/><rect x=\"156\" y=\"84\" width=\"6\" height=\"6\"/></g>\n            </svg>\n          </figure>\n          <div class=\"sf-notif\" aria-hidden=\"true\">\n            <span class=\"n-ico\"><svg class=\"ico\"><use href=\"#b-bell\"/></svg></span>\n            <div><b>شُرفة · سوار الأمان</b><small>تم مسح سوار طفلك من فريق التنظيم. تواصل مع الفريق لاستلامه.</small></div>\n          </div>\n        </div>\n      </article>"
},
"festSys": "    <div class=\"fest-sys reveal\">\n      <h3><svg class=\"ico\"><use href=\"#i-grid\"/></svg>المنظومة الرقمية للمهرجان</h3>\n      <ul>\n        <li><span><svg class=\"ico\"><use href=\"#b-user\"/></svg></span><b>الزائر</b><small>التذاكر والباقات والجواز وسوار الأمان</small></li>\n        <li><span><svg class=\"ico\"><use href=\"#b-handshake\"/></svg></span><b>الشريك</b><small>المشاركة في الباقات والعروض والمكافآت</small></li>\n        <li><span><svg class=\"ico\"><use href=\"#b-scan\"/></svg></span><b>المنظم</b><small>التحقق من التذاكر والقسائم ومسح الأساور</small></li>\n        <li><span><svg class=\"ico\"><use href=\"#b-grid\"/></svg></span><b>الإدارة</b><small>التذاكر والباقات والمكافآت والإشعارات والتقارير</small></li>\n      </ul>\n    </div>",
"download": "<!-- ================= 3. ابدأ الآن (الخطوات + التحميل) ================= -->\n<section class=\"section download dark\" id=\"download\">\n  <div class=\"pattern pattern-light\" aria-hidden=\"true\"></div>\n  <div class=\"container\">\n    <div class=\"download-grid\">\n      <div class=\"dl-copy\">\n        <span class=\"kicker kicker-gold reveal\">تطبيق شُرفة</span>\n        <h2 class=\"reveal\" data-delay=\"1\">لا تفوّت التجربة…<br><span class=\"hl-gold\">ابدأها مع شُرفة</span></h2>\n        <p class=\"reveal\" data-delay=\"2\">كل ما تحتاجه لتجربة {{NAME}}، في تطبيق شُرفة.</p>\n\n        <div class=\"stores reveal\" data-delay=\"3\">\n          <div class=\"store\">\n            <a class=\"store-btn\" data-store=\"appStore\" href=\"#download\" target=\"_blank\" rel=\"noopener\">\n              <svg class=\"ico\"><use href=\"#i-apple\"/></svg>\n              <span><small>حمّله من</small><b>App Store</b></span>\n            </a>\n            <div class=\"qr-box\" data-qr=\"appStore\"><span class=\"qr-wait\">رمز QR<br>يظهر عند إضافة الرابط</span></div>\n          </div>\n          <div class=\"store\">\n            <a class=\"store-btn\" data-store=\"googlePlay\" href=\"#download\" target=\"_blank\" rel=\"noopener\">\n              <svg class=\"ico\"><use href=\"#i-play\"/></svg>\n              <span><small>احصل عليه من</small><b>Google Play</b></span>\n            </a>\n            <div class=\"qr-box\" data-qr=\"googlePlay\"><span class=\"qr-wait\">رمز QR<br>يظهر عند إضافة الرابط</span></div>\n          </div>\n        </div>\n        <p class=\"fine light store-note\" id=\"storeNote\">روابط التحميل الرسمية ستُضاف قريبًا.</p>\n      </div>\n\n      <div class=\"dl-visual reveal\" data-delay=\"2\" aria-hidden=\"true\">\n        <div class=\"halo halo-gold\"></div>\n        <div class=\"phone\">\n          <div class=\"phone-screen dl-screen\">\n            <div class=\"app-status light\"><span>9:41</span><span class=\"notch\"></span><span>●●●</span></div>\n            <div class=\"dl-splash\">\n              <svg class=\"dl-logo\"><use href=\"#logo-mark-white\"/></svg>\n              <strong>شُرفة</strong>\n              <small>تجربتك في {{NAME}}</small>\n            </div>\n            <div class=\"dl-tiles\">\n              <span style=\"--c:var(--gold)\"><svg class=\"ico\"><use href=\"#i-ticket\"/></svg>تذاكر</span>\n              <span style=\"--c:var(--brick)\"><svg class=\"ico\"><use href=\"#i-box\"/></svg>باقات</span>\n              <span style=\"--c:var(--purple)\"><svg class=\"ico\"><use href=\"#i-passport\"/></svg>الجواز</span>\n              <span style=\"--c:var(--teal)\"><svg class=\"ico\"><use href=\"#i-band\"/></svg>السوار</span>\n            </div>\n          </div>\n        </div>\n      </div>\n    </div>\n\n  </div>\n</section>",
"phoneTickets": "      <div class=\"phone phone-tilt\">\n        <div class=\"phone-screen\">\n          <div class=\"app-status\"><span>9:41</span><span class=\"notch\"></span><span>●●●</span></div>\n          <div class=\"app-head\">\n            <div>\n              <small>أهلًا بك في</small>\n              <strong>{{NAME}}</strong>\n            </div>\n            <span class=\"avatar\"><svg class=\"ico\"><use href=\"#i-user\"/></svg></span>\n          </div>\n\n          <div class=\"app-ticket\">\n            <div class=\"app-ticket-info\">\n              <small>تذكرة دخول</small>\n              <strong>{{NAME}}</strong>\n              <span class=\"tag\">تذكرتك جاهزة</span>\n            </div>\n            <div class=\"mock-qr\" data-seed=\"7\"></div>\n          </div>\n\n          <div class=\"app-quick\">\n            <span class=\"q q-gold\"><svg class=\"ico\"><use href=\"#i-ticket\"/></svg>التذاكر</span>\n            <span class=\"q q-brick\"><svg class=\"ico\"><use href=\"#i-box\"/></svg>الباقات</span>\n            <span class=\"q q-purple\"><svg class=\"ico\"><use href=\"#i-passport\"/></svg>الجواز</span>\n            <span class=\"q q-teal\"><svg class=\"ico\"><use href=\"#i-band\"/></svg>السوار</span>\n          </div>\n\n          <div class=\"app-passport-mini\">\n            <div class=\"row\"><strong>الجواز الرقمي</strong><small>بطاقة مطعم</small></div>\n            <div class=\"bar\"><span style=\"--w:62%\"></span></div>\n            <div class=\"stamps-mini\"><i class=\"on\"></i><i class=\"on\"></i><i class=\"on\"></i><i></i><i></i></div>\n          </div>\n        </div>\n      </div>",
"phoneSoon": "      <div class=\"phone phone-tilt\">\n        <div class=\"phone-screen dl-screen\">\n          <div class=\"app-status light\"><span>9:41</span><span class=\"notch\"></span><span>●●●</span></div>\n          <div class=\"dl-splash\">\n            <svg class=\"dl-logo\"><use href=\"#logo-mark-white\"/></svg>\n            <strong>{{NAME}}</strong>\n            <small>قريبًا على شُرفة</small>\n          </div>\n        </div>\n      </div>"
};

  const root = document.getElementById("eventRoot");
  if (!root) return;
  const DATA = window.SHURFA_DATA || { events: [] };
  const ev = (DATA.events || []).find((e) => e.id === root.dataset.event);
  const esc = (v) => String(v ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const icon = (id) => `<svg class="ico" aria-hidden="true"><use href="#${id}"/></svg>`;

  if (!ev) {
    root.innerHTML = `<section class="section"><div class="container center" style="padding-top:120px">
      <h1>لم نجد هذه الفعالية</h1><p>ربما انتهت أو تغيّر رابطها.</p>
      <a class="btn btn-primary" href="index.html#events">عودة إلى الفعاليات</a></div></section>`;
    return;
  }

  const page = ev.page || {};
  const theme = ev.theme || {};
  const services = (page.services || []).filter((s) => TPL.panels[s]);
  const N = esc(ev.name);

  /* ---------- ألوان المهرجان كمتغيرات CSS ---------- */
  const vars = {
    "--ev-1": theme.primary || "#F5A623",
    "--ev-2": theme.secondary || "#2CA6A4",
    "--ev-ink": theme.ink || "#1A2E28",
    "--ev-soft": theme.soft || "#FAF6F0"
  };
  Object.entries(vars).forEach(([k, v]) => root.style.setProperty(k, v));
  const accents = theme.accents && theme.accents.length ? theme.accents : [{ c: vars["--ev-1"], ink: "#1A2E28" }, { c: vars["--ev-2"], ink: "#fff" }];

  const fill = (html, i) => {
    const a = accents[i % accents.length];
    return html.split("{{NAME}}").join(N)
      .split("{{AC}}").join(a.c)
      .split("{{ACINK}}").join(a.ink || "#fff")
      .split("{{NUM}}").join(String(i + 1).padStart(2, "0"));
  };

  const SERVICE_META = {
    tickets:  { point: "تذاكر رقمية",   icon: "i-ticket",   chip: ["تذكرتك", "رمز QR للدخول"],        c: "c-gold" },
    packages: { point: "باقات مخصصة",   icon: "i-box",      chip: ["باقة العائلة", "دخول + وجبة + ألعاب"], c: "c-brick" },
    passport: { point: "الجواز الرقمي", icon: "i-passport", chip: ["ختم جديد", "في جوازك الرقمي"],     c: "c-purple" },
    safety:   { point: "سوار أمان",     icon: "i-band",     chip: ["السوار مرتبط", "بحساب ولي الأمر"],  c: "c-teal" }
  };

  /* ---------- 1. الواجهة: هوية المهرجان ---------- */
  const logo = ev.logo ? `<span class="ev-logo-plate"><img src="${esc(ev.logo)}" alt="شعار ${N}"></span>` : "";
  const points = services.map((s) => `<li>${icon(SERVICE_META[s].icon)}${SERVICE_META[s].point}</li>`).join("");
  const chips = services.slice(0, 4).map((s, i) => `<div class="float-chip chip-${i + 1}"><span class="c-ico ${SERVICE_META[s].c}">${icon(SERVICE_META[s].icon)}</span><span><b>${SERVICE_META[s].chip[0]}</b><small>${SERVICE_META[s].chip[1]}</small></span></div>`).join("");
  const phone = services.includes("tickets") ? fill(TPL.phoneTickets, 0) : fill(TPL.phoneSoon, 0);
  const statusLabel = { available: "متاحة الآن", soon: "قريبًا على شُرفة", ended: "انتهت" }[ev.status] || "";

  const hero = `
<section class="hero ev-hero" id="top">
  <div class="pattern" aria-hidden="true"></div>
  <div class="container hero-grid">
    <div class="hero-copy">
      <nav class="crumbs reveal" aria-label="مسار التنقل"><a href="index.html">${icon("i-home")}شُرفة</a><span aria-hidden="true">‹</span><a href="index.html#events">الفعاليات</a><span aria-hidden="true">‹</span><b aria-current="page">${N}</b></nav>
      <div class="ev-cobrand reveal">${logo}<span class="ev-x" aria-hidden="true">×</span><span class="ev-by"><svg class="ev-by-mark"><use href="#logo-mark"/></svg><span>على شُرفة</span></span></div>
      <span class="eyebrow reveal"><span class="dot"></span>${esc(page.eyebrow || ev.location || "")}${statusLabel ? ` · ${statusLabel}` : ""}</span>
      <h1 class="reveal" data-delay="1">${esc(page.title || ev.name)}${page.titleHl ? `<br><span class="hl">${esc(page.titleHl)}</span>` : ""}</h1>
      <p class="lead reveal" data-delay="2">${esc(page.lead || ev.summary || "")}</p>
      <div class="hero-ctas reveal" data-delay="3">
        <a class="btn btn-primary btn-lg" href="#download">${icon("i-download")}حمّل تطبيق شُرفة</a>
        <a class="btn btn-ghost btn-lg" href="#explore">${services.length ? "اكتشف الخدمات" : "ما الذي ينتظرك"}${icon("i-arrow")}</a>
      </div>
      ${points ? `<ul class="hero-points reveal" data-delay="4">${points}</ul>` : ""}
    </div>

    <div class="hero-visual reveal" data-delay="2" aria-hidden="true">
      <div class="halo"></div>
      ${ev.image ? `<div class="ev-photo" style="background-image:url('${esc(ev.image)}');background-position:${esc(ev.imagePosition || "center")}"></div>` : `<div class="arch-frame"></div>`}
      ${phone}
      ${chips}
    </div>
  </div>
</section>`;

  /* ---------- 2. الخدمات (المفعّلة لهذا المهرجان فقط) ---------- */
  let explore = "";
  if (services.length) {
    const tabs = services.map((s, i) => fill(TPL.tabs[s], i).replace('class="ex-tab"', i === 0 ? 'class="ex-tab is-active"' : 'class="ex-tab"').replace('aria-selected="false"', `aria-selected="${i === 0}"`)).join("\n");
    const panels = services.map((s, i) => fill(TPL.panels[s], i).replace('class="ex-panel"', i === 0 ? 'class="ex-panel is-active"' : 'class="ex-panel"')).join("\n");
    explore = `
<section class="explore ev-explore" id="explore">
  <div class="container">
    <div class="ex-head reveal">
      <div>
        <span class="kicker ev-kicker">تجربة ${N} الرقمية</span>
        <h2>${esc(page.exploreTitle || "كل تجربة المهرجان،")}<br>في تطبيق واحد</h2>
      </div>
      <p>خدمات مخصصة لزوار ${N} داخل تطبيق شُرفة — اختر واحدة واستكشفها.</p>
    </div>
    <div class="ex-tabs reveal ev-tabs-${services.length}" role="tablist" aria-label="خدمات ${N}">
${tabs}
    </div>
    <div class="ex-stage reveal" id="exStage">
${panels}
    </div>
    ${page.system ? TPL.festSys : ""}
  </div>
</section>`;
  } else {
    /* لا توجد خدمات مفعّلة بعد: صفحة «قريبًا» صادقة */
    explore = `
<section class="section ev-soon" id="explore">
  <div class="container">
    <div class="ev-soon-box reveal">
      <span class="kicker ev-kicker">التجربة الرقمية</span>
      <h2>تجربة ${N} الرقمية<br>قادمة إلى شُرفة</h2>
      <p>${esc(page.soonText || "نعمل مع منظمي المهرجان على إعداد خدماته داخل شُرفة. حمّل التطبيق ليصلك الإعلان فور إطلاقها.")}</p>
      <div class="ev-soon-links">
        <a class="btn btn-primary" href="#download">${icon("i-download")}حمّل التطبيق</a>
        <a class="btn btn-ghost" href="index.html#passport">تعرّف على الجواز الرقمي${icon("i-arrow")}</a>
      </div>
      <a class="ev-soon-partner" href="partners.html">${icon("i-handshake")}تقدّم خدمة في ${N}؟ انضم إلى شُرفة كشريك</a>
    </div>
  </div>
</section>`;
  }

  /* ---------- 3. التحميل (إطار شُرفة) ---------- */
  const download = fill(TPL.download, 0);

  root.innerHTML = hero + explore + download;
})();
