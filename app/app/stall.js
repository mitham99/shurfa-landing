/* شُرفة — واجهة الكشك: مسح جواز الزائر وإضافة ختم أو تسليم مكافأة */
(() => {
  "use strict";
  const A = window.ShurfaApp;
  const { $, esc } = A;
  const KEY = "stall:" + A.eventId;

  if (!A.ready) { $("#notReady").hidden = false; return; }

  let auth = A.session.get(KEY) || A.local.get(KEY);   // { stall, pin, name, offer }
  let scanner = null, busy = false, lastCode = "", lastAt = 0, undoCode = "";

  /* ---------- الدخول ---------- */
  async function showLogin(msg) {
    $("#scanView").hidden = true;
    $("#loginView").hidden = false;
    if (msg) $("#loginMsg").innerHTML = `<div class="msg err">${esc(msg)}</div>`;
    const sel = $("#loginView select[name=stall]");
    try {
      const list = await A.rpc("list_stalls", { p_event: A.eventId });
      sel.innerHTML = `<option value="">اختر الكشك</option>` + (list || []).map((s) => `<option value="${esc(s.id)}">${esc(s.name)}</option>`).join("");
      if (!(list || []).length) sel.innerHTML = `<option value="">لا توجد أكشاك مفعّلة بعد</option>`;
    } catch (e) {
      sel.innerHTML = `<option value="">${esc(A.errText(e.code))}</option>`;
    }
  }

  $("#loginView").addEventListener("submit", async (e) => {
    e.preventDefault();
    const f = e.target, btn = $("#loginBtn");
    $("#loginMsg").innerHTML = "";
    if (!f.stall.value || !f.pin.value) { $("#loginMsg").innerHTML = `<div class="msg err">اختر الكشك وأدخل الرمز.</div>`; return; }
    btn.disabled = true;
    try {
      const d = await A.rpc("stall_scan", { p_stall: f.stall.value, p_pin: f.pin.value, p_code: null });
      auth = { stall: f.stall.value, pin: f.pin.value, name: d.stall, offer: A.offerText(d) };
      A.session.set(KEY, auth);
      if (f.remember.checked) A.local.set(KEY, auth); else A.local.del(KEY);
      f.pin.value = "";
      showScan();
    } catch (err) {
      $("#loginMsg").innerHTML = `<div class="msg err">${esc(A.errText(err.code))}</div>`;
    } finally { btn.disabled = false; }
  });

  /* ---------- المسح ---------- */
  function showScan() {
    $("#loginView").hidden = true;
    $("#scanView").hidden = false;
    $("#stallName").textContent = auth.name;
    $("#stallOffer").textContent = "العرض: " + auth.offer;
  }

  function showResult(kind, title, sub) {
    $("#result").innerHTML = `<div class="result ${kind}"><b>${esc(title)}</b>${sub ? `<span>${esc(sub)}</span>` : ""}</div>`;
  }

  async function addVisit(raw) {
    const code = String(raw || "").trim().toUpperCase().replace(/^SHURFA:/, "");
    if (!code) return;
    const now = Date.now();
    if (busy || (code === lastCode && now - lastAt < 4000)) return;   // تجاهل المسح المكرر السريع
    busy = true; lastCode = code; lastAt = now;
    try {
      const d = await A.rpc("stall_scan", { p_stall: auth.stall, p_pin: auth.pin, p_code: code });
      undoCode = code; $("#undoBtn").hidden = false;
      if (d.kind === "reward") {
        showResult("reward", `🎁 ${d.reward}`, `طبّق المكافأة لـ ${d.visitor} — الزيارة رقم ${d.position}`);
        if (navigator.vibrate) navigator.vibrate([80, 60, 80]);
      } else {
        showResult("stamp", `✓ تمت إضافة ختم`, `${d.visitor} — ${d.position} من ${d.required}`);
        if (navigator.vibrate) navigator.vibrate(60);
      }
    } catch (err) {
      if (err.code === "bad_pin" || err.code === "stall_locked" || err.code === "stall_not_found") {
        A.session.del(KEY); A.local.del(KEY); await stopCam(); showLogin(A.errText(err.code)); return;
      }
      const extra = err.code === "cooldown" && err.data && err.data.retry_at
        ? `يمكن إضافة الزيارة التالية بعد ${new Date(err.data.retry_at).toLocaleTimeString("ar-OM", { hour: "2-digit", minute: "2-digit" })}` : "";
      showResult("err", A.errText(err.code), extra);
      if (navigator.vibrate) navigator.vibrate(200);
    } finally {
      setTimeout(() => { busy = false; }, 1200);
    }
  }

  async function startCam() {
    if (!window.Html5Qrcode) { A.toast("تعذّر تحميل قارئ الكاميرا — استخدم الإدخال اليدوي.", "err"); return; }
    try {
      scanner = scanner || new window.Html5Qrcode("reader");
      await scanner.start({ facingMode: "environment" }, { fps: 10, qrbox: { width: 230, height: 230 } }, (text) => addVisit(text), () => {});
      $("#camBtn").hidden = true; $("#camStop").hidden = false;
    } catch (e) {
      A.toast("لم نتمكن من فتح الكاميرا. اسمح بالوصول للكاميرا من إعدادات المتصفح، أو استخدم الإدخال اليدوي.", "err");
    }
  }
  async function stopCam() {
    try { if (scanner && scanner.isScanning) await scanner.stop(); } catch (e) { /* ignore */ }
    $("#camBtn").hidden = false; $("#camStop").hidden = true;
  }

  $("#camBtn").addEventListener("click", startCam);
  $("#camStop").addEventListener("click", stopCam);
  $("#manualForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const inp = e.target.code;
    lastCode = ""; addVisit(inp.value); inp.value = "";
  });
  $("#undoBtn").addEventListener("click", async () => {
    if (!undoCode || !confirm("التراجع عن آخر عملية لهذا الزائر؟")) return;
    try {
      await A.rpc("stall_undo", { p_stall: auth.stall, p_pin: auth.pin, p_code: undoCode });
      showResult("stamp", "تم التراجع عن آخر عملية", "");
      $("#undoBtn").hidden = true; undoCode = "";
    } catch (err) { showResult("err", A.errText(err.code), ""); }
  });
  $("#logoutBtn").addEventListener("click", async () => {
    await stopCam(); A.session.del(KEY); A.local.del(KEY); auth = null; showLogin();
  });

  if (auth && auth.stall && auth.pin) showScan(); else showLogin();
})();
