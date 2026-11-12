/* =========================================================
   إعدادات صفحة شُرفة — عدّل هذا الملف فقط لتحديث الروابط
   ---------------------------------------------------------
   • اترك القيمة فارغة "" إذا لم يتوفر الرابط بعد:
     - أزرار المتاجر ستظهر بشارة «قريبًا» ولن تفتح رابطًا وهميًا.
     - رمز QR سيظهر تلقائيًا فور إضافة الرابط الرسمي.
     - حسابات التواصل ومعلومات الاتصال تظهر فقط عند تعبئتها.
   ========================================================= */
window.SHURFA_CONFIG = {
  stores: {
    appStore: "",    // مثال: "https://apps.apple.com/app/idXXXXXXXXX"
    googlePlay: ""   // مثال: "https://play.google.com/store/apps/details?id=XXXX"
  },

  social: {
    instagram: "",
    x: "",
    tiktok: "",
    snapchat: "",
    youtube: ""
  },

  /* طلبات الانضمام كشريك (صفحة partners.html)
     • formEndpoint: رابط يستقبل النموذج بطريقة POST (مثل Formspree أو Google Apps Script أو خادمكم).
     • email: بديل في حال عدم وجود formEndpoint — يُفتح بريد الزائر برسالة جاهزة إلى هذا العنوان.
     • إذا تُرك الاثنان فارغين: يظهر للزائر أن استقبال الطلبات سيتفعّل قريبًا، ولا يُعرض نجاح وهمي. */
  partners: {
    formEndpoint: "",
    email: ""
  },

  /* النظام التجريبي (app/): قاعدة بيانات Supabase
     • url: رابط المشروع (Project URL) مثل https://xxxx.supabase.co
     • anonKey: المفتاح العام (anon public) فقط — ⚠ لا تضع أبدًا مفتاح service_role هنا
     • eventId: الفعالية الافتراضية للنظام
     إذا تُرك فارغًا تظهر صفحات النظام بحالة «قيد التجهيز». */
  supabase: {
    url: "https://bemejwbccqnujoyjnsht.supabase.co",
    anonKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJlbWVqd2JjY3FudWpveWpuc2h0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTQ1MTA4NDYsImV4cCI6MjExMDA4Njg0Nn0.t_1WRheDvBTwdo8pVSA05vho0lcrwQdPFyXBx00yGy0",
    eventId: "squ-eat"
  },

  contact: {
    email: "",       // مثال: "hello@example.om"
    phone: "",       // مثال: "+968 XXXX XXXX"
    location: ""     // مثال: "صحار، سلطنة عُمان"
  }
};
