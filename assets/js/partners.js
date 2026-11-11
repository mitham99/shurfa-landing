/* =========================================================
   شُرفة — نموذج طلب الانضمام كشريك
   الإرسال يُضبط من assets/js/config.js ← partners
   ========================================================= */
(() => {
  "use strict";

  const form = document.getElementById("partnerForm");
  if (!form) return;

  const CFG = (window.SHURFA_CONFIG && window.SHURFA_CONFIG.partners) || {};
  const body = document.getElementById("formBody");
  const success = document.getElementById("formSuccess");
  const status = document.getElementById("formStatus");
  const submit = document.getElementById("formSubmit");
  const submitLabel = submit.innerHTML;

  const MESSAGES = {
    valueMissing: "هذا الحقل مطلوب",
    typeMismatch: { email: "أدخل بريدًا إلكترونيًا صحيحًا", url: "أدخل رابطًا صحيحًا يبدأ بـ https://" },
    patternMismatch: "أدخل رقم هاتف صحيحًا"
  };

  const setStatus = (text, type = "info") => {
    status.className = `form-status ${text ? type : ""}`;
    status.textContent = text;
  };

  /* ---------- التحقق من الحقول ---------- */
  function validateField(input) {
    const field = input.closest(".field");
    if (!field) return input.checkValidity();
    let msg = field.querySelector(".msg");
    const v = input.validity;
    let text = "";
    if (v.valueMissing) text = MESSAGES.valueMissing;
    else if (v.typeMismatch) text = MESSAGES.typeMismatch[input.type] || "القيمة غير صحيحة";
    else if (v.patternMismatch) text = MESSAGES.patternMismatch;

    field.classList.toggle("invalid", !!text);
    input.setAttribute("aria-invalid", text ? "true" : "false");
    if (text) {
      if (!msg) { msg = document.createElement("span"); msg.className = "msg"; field.appendChild(msg); }
      msg.textContent = text;
    } else if (msg) msg.remove();
    return !text;
  }

  function validateGroup(name) {
    const ok = form.querySelectorAll(`input[name="${name}"]:checked`).length > 0;
    form.querySelector(`[data-error-for="${name}"]`).classList.toggle("show", !ok);
    return ok;
  }

  function validateAll() {
    let firstBad = null;
    form.querySelectorAll(".field input, .field select, .field textarea").forEach((el) => {
      if (!validateField(el) && !firstBad) firstBad = el;
    });
    if (!validateGroup("participation") && !firstBad) firstBad = form.querySelector('input[name="participation"]');
    const consent = form.querySelector('input[name="consent"]');
    consent.closest(".consent").classList.toggle("invalid", !consent.checked);
    if (!consent.checked && !firstBad) firstBad = consent;
    if (firstBad) firstBad.focus({ preventScroll: false });
    return !firstBad;
  }

  form.addEventListener("blur", (e) => {
    if (e.target.matches(".field input, .field select, .field textarea")) validateField(e.target);
  }, true);
  form.addEventListener("input", (e) => {
    if (e.target.closest(".field.invalid")) validateField(e.target);
  });
  form.addEventListener("change", (e) => {
    if (e.target.name === "participation") validateGroup("participation");
    if (e.target.name === "consent") e.target.closest(".consent").classList.toggle("invalid", !e.target.checked);
  });

  /* ---------- تجهيز البيانات ---------- */
  function collect() {
    const fd = new FormData(form);
    const data = {};
    for (const [k, v] of fd.entries()) {
      if (k === "consent") continue;
      data[k] = data[k] ? `${data[k]}، ${v}` : String(v).trim();
    }
    data.consent = "نعم";
    data.submitted_at = new Date().toISOString();
    return data;
  }

  const LABELS = {
    business_name: "اسم الجهة", business_type: "نوع النشاط", city: "الولاية / المدينة", website: "الموقع / الحساب",
    contact_name: "اسم المسؤول", phone: "الهاتف", email: "البريد الإلكتروني", participation: "المشاركة المطلوبة", message: "نبذة"
  };

  function showSuccess() {
    body.hidden = true;
    success.hidden = false;
    form.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  /* ---------- الإرسال ---------- */
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    setStatus("");
    if (!validateAll()) { setStatus("يرجى استكمال الحقول المطلوبة.", "error"); return; }

    const data = collect();

    // 1) رابط استقبال (الخيار المفضل)
    if (CFG.formEndpoint) {
      submit.disabled = true;
      submit.textContent = "جارٍ الإرسال…";
      try {
        const res = await fetch(CFG.formEndpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify(data)
        });
        if (!res.ok) throw new Error(String(res.status));
        form.reset();
        showSuccess();
      } catch (err) {
        setStatus("تعذّر إرسال الطلب الآن. تحقق من اتصالك وحاول مرة أخرى.", "error");
      } finally {
        submit.disabled = false;
        submit.innerHTML = submitLabel;
      }
      return;
    }

    // 2) بديل: فتح البريد برسالة جاهزة
    if (CFG.email) {
      const lines = Object.keys(LABELS).filter((k) => data[k]).map((k) => `${LABELS[k]}: ${data[k]}`);
      const subject = `طلب انضمام كشريك — ${data.business_name}`;
      window.location.href = `mailto:${CFG.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join("\n"))}`;
      setStatus("فُتح تطبيق البريد برسالة جاهزة — اضغط «إرسال» فيه لإتمام الطلب.", "info");
      return;
    }

    // 3) لم يُضبط أي استقبال بعد: لا نعرض نجاحًا وهميًا
    setStatus("استقبال طلبات الشراكة عبر الموقع سيتفعّل قريبًا. شكرًا لاهتمامك — يرجى المحاولة لاحقًا.", "info");
  });

  document.getElementById("formAgain").addEventListener("click", () => {
    success.hidden = true;
    body.hidden = false;
    setStatus("");
  });
})();
