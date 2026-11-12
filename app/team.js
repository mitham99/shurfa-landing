/* شُرفة — تسجيل فرق بطولة الورقة */
(() => {
  "use strict";
  const A = window.ShurfaApp;
  const { $, esc } = A;
  if (!A.ready) { $("#notReady").hidden = false; return; }
  $("#teamView").hidden = false;

  const okPhone = (p) => /^\+?[0-9]{8,15}$/.test(p);

  $("#teamForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const f = e.target, msg = $("#teamMsg"), btn = $("#teamBtn");
    msg.innerHTML = "";
    const v = {
      team: f.team.value.trim(), game: f.game.value,
      p1: f.p1.value.trim(), p1p: f.p1p.value.replace(/[\s-]/g, ""),
      p2: f.p2.value.trim(), p2p: f.p2p.value.replace(/[\s-]/g, "")
    };
    const err = (t) => { msg.innerHTML = `<div class="msg err">${esc(t)}</div>`; };
    if (v.team.length < 2) return err("أدخل اسم الفريق.");
    if (!v.game) return err(A.errText("bad_game"));
    if (v.p1.length < 2 || v.p2.length < 2) return err(A.errText("bad_name"));
    if (!okPhone(v.p1p) || !okPhone(v.p2p)) return err(A.errText("bad_phone"));
    if (v.p1p === v.p2p) return err("أدخل رقمًا مختلفًا لكل لاعب.");
    if (!f.consent.checked) return err(A.errText("consent_required"));

    btn.disabled = true; btn.textContent = "جارٍ التسجيل…";
    try {
      const d = await A.rpc("register_team", {
        p_event: A.eventId, p_team: v.team, p_game: v.game,
        p_p1_name: v.p1, p_p1_phone: v.p1p, p_p2_name: v.p2, p_p2_phone: v.p2p, p_consent: true
      });
      f.hidden = true;
      $("#doneMsg").textContent = `تم تسجيل فريق «${d.team}» في بطولة ${v.game}. سيتواصل معكم المنظمون بالتفاصيل. بالتوفيق!`;
      $("#doneView").hidden = false;
    } catch (ex) {
      err(A.errText(ex.code));
    } finally {
      btn.disabled = false; btn.textContent = "سجّل الفريق";
    }
  });
})();
