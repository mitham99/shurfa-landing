/* شُرفة — صفحة الزائر: التسجيل + الجواز الرقمي */
(() => {
  "use strict";
  const A = window.ShurfaApp;
  const { $, esc } = A;
  const KEY = "pass:" + A.eventId;

  if (!A.ready) { $("#notReady").hidden = false; return; }

  let pass = A.local.get(KEY);
  let timer = null;

  function showRegister() {
    $("#passView").hidden = true;
    $("#registerView").hidden = false;
  }

  async function loadStalls() {
    try {
      const list = await A.rpc("list_stalls", { p_event: A.eventId });
      $("#stallList").innerHTML = (list || []).length
        ? list.map((s) => `<div class="stall-item"><b>${esc(s.name)}</b><span>${esc(A.offerText(s))}</span></div>`).join("")
        : `<p class="empty">تُعلن الأكشاك المشاركة قريبًا.</p>`;
    } catch (e) {
      $("#stallList").innerHTML = `<p class="empty">${esc(A.errText(e.code))}</p>`;
    }
  }

  async function loadCard(silent) {
    try {
      const d = await A.rpc("my_card", { p_code: pass.code, p_secret: pass.secret });
      $("#hello").textContent = "أهلًا " + d.name.split(" ")[0];
      $("#myCards").innerHTML = (d.cards || []).length
        ? d.cards.map((c) => {
            const st = A.cardState(c);
            return `<div class="loyalty">
              <div class="loyalty-head"><b>${esc(c.stall)}</b><small>${esc(A.KIND[c.kind] || "")}</small></div>
              <div class="slots">${A.slotsHTML(c)}</div>
              <p class="loyalty-next">${esc(st.next)}</p>
            </div>`;
          }).join("")
        : `<p class="empty">لا توجد أختام بعد — ابدأ من أي كشك مشارك.</p>`;
    } catch (e) {
      if (e.code === "not_found") {
        A.local.del(KEY); pass = null; showRegister();
        $("#regMsg").innerHTML = `<div class="msg err">${esc(A.errText("not_found"))}</div>`;
        return;
      }
      if (!silent) A.toast(A.errText(e.code), "err");
    }
  }

  function showPass() {
    $("#registerView").hidden = true;
    $("#passView").hidden = false;
    A.qr($("#passQr"), "SHURFA:" + pass.code, 220);
    $("#passCode").textContent = pass.code;
    loadCard();
    loadStalls();
    clearInterval(timer);
    // تحديث تلقائي كل 20 ثانية والصفحة ظاهرة (لرؤية الختم بعد المسح)
    timer = setInterval(() => { if (!document.hidden) loadCard(true); }, 20000);
  }

  $("#regForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const f = e.target;
    const msg = $("#regMsg");
    msg.innerHTML = "";
    const name = f.name.value.trim(), phone = f.phone.value.replace(/[\s-]/g, "");
    if (name.length < 2) { msg.innerHTML = `<div class="msg err">${A.errText("bad_name")}</div>`; f.name.focus(); return; }
    if (!/^\+?[0-9]{8,15}$/.test(phone)) { msg.innerHTML = `<div class="msg err">${A.errText("bad_phone")}</div>`; f.phone.focus(); return; }
    if (!f.consent.checked) { msg.innerHTML = `<div class="msg err">${A.errText("consent_required")}</div>`; return; }
    const btn = $("#regBtn"); btn.disabled = true; btn.textContent = "جارٍ الإنشاء…";
    try {
      const d = await A.rpc("register_visitor", { p_event: A.eventId, p_name: name, p_phone: phone, p_type: f.type.value, p_consent: true });
      pass = { code: d.code, secret: d.secret };
      if (!A.local.set(KEY, pass)) A.toast("صوّر الشاشة لحفظ رمزك؛ المتصفح لا يحفظ البيانات.", "info");
      showPass();
      A.toast("تم إنشاء جوازك 🎉", "ok");
    } catch (err) {
      msg.innerHTML = `<div class="msg err">${esc(A.errText(err.code))}</div>`;
    } finally {
      btn.disabled = false; btn.textContent = "أنشئ جوازي";
    }
  });

  $("#refreshBtn").addEventListener("click", () => loadCard());
  $("#forgetBtn").addEventListener("click", () => {
    if (!confirm("سيُزال الجواز من هذا الجهاز فقط. لن تتمكن من استرجاعه بدون مساعدة المنظمين. متابعة؟")) return;
    A.local.del(KEY); pass = null; clearInterval(timer); showRegister();
  });

  if (pass && pass.code && pass.secret) showPass(); else showRegister();
})();
