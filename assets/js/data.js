/* =========================================================
   بيانات منصة شُرفة — الفعاليات والخدمات والشركاء
   ---------------------------------------------------------
   عدّل هذا الملف لإضافة فعالية أو شريك أو تغيير حالة خدمة،
   دون الحاجة لتعديل تصميم الصفحة.
   الأيقونات المتاحة: انظر رموز <symbol id="i-..."> في أعلى index.html
   ========================================================= */
window.SHURFA_DATA = {

  /* ---------- الفعاليات ----------
     status: "available" متاحة | "soon" قريبًا | "ended" منتهية
     url: صفحة الفعالية (انسخ dhahirah-festival.html باسم جديد وغيّر data-event فيه إلى id الفعالية)
     logo: شعار المهرجان بخلفية شفافة — theme: ألوان المهرجان — page: نصوص الصفحة والخدمات المفعّلة
     image: مسار صورة الغلاف (اختياري) — مثل "assets/img/events/sohar-festival.jpg"
     imagePosition: الجزء الظاهر من الصورة في البطاقة (اختياري) — مثل "center 60%"
            اتركه فارغًا لاستخدام الغلاف الرسومي بألوان الفعالية.
     date: تاريخ الفعالية كنص (اتركه فارغًا إذا لم يُعلن بعد).
     ⚠ لا تضع تواريخ أو صورًا غير رسمية. */
  events: [
    {
      id: "sohar-festival",
      name: "مهرجان صحار",
      summary: "تجربة رقمية متكاملة لزوار المهرجان: تذاكر، باقات، بطاقات ولاء في الجواز الرقمي، وسوار أمان للأطفال.",
      location: "صحار، شمال الباطنة",
      date: "",
      dateNote: "المواعيد تُعلن عبر التطبيق",
      status: "available",
      url: "sohar-festival.html",
      image: "assets/img/events/sohar-festival.jpg",
      imagePosition: "center 60%",
      icon: "i-festival",
      colors: { from: "#1A2E28", to: "#2E5148", accent: "#F5A623" },
      tags: ["التذاكر", "الباقات", "الجواز الرقمي", "سوار الأمان"],
      logo: "assets/img/events/sohar-festival-logo.png",
      /* هوية المهرجان داخل إطار شُرفة (ألوان مأخوذة من شعار المهرجان) */
      theme: {
        primary: "#FCAE10",   // أصفر الشعار
        secondary: "#2F5DA6", // أزرق الشعار
        ink: "#1E3A6E",       // أزرق داكن للعناصر الداكنة
        soft: "#FFF6E0",
        accents: [ { c: "#FCAE10", ink: "#1A2E28" }, { c: "#2F5DA6", ink: "#fff" } ]
      },
      /* صفحة الفعالية: الخدمات المفعّلة بالترتيب (tickets / packages / passport / safety) */
      page: {
        services: ["tickets", "packages", "passport", "safety"],
        system: true,
        eyebrow: "صحار، شمال الباطنة",
        title: "مهرجان صحار…",
        titleHl: "تجربتك تبدأ من شُرفة",
        lead: "احجز تذكرتك، كوّن باقتك الخاصة، اجمع أختام بطاقات الولاء، واستمتع بتجربة أكثر سهولة وتفاعلًا مع شُرفة."
      }
    },
    {
      id: "dhahirah-festival",
      name: "مهرجان الظاهرة السياحي",
      summary: "تجربة مهرجان الظاهرة الرقمية قادمة إلى شُرفة.",
      location: "محافظة الظاهرة",
      date: "",
      dateNote: "المواعيد تُعلن قريبًا",
      status: "soon",
      url: "dhahirah-festival.html",
      image: "assets/img/events/dhahirah-festival.jpg",
      imagePosition: "center 55%",
      icon: "i-festival",
      colors: { from: "#24184A", to: "#4A2A2A", accent: "#F2AE40" },
      tags: [],
      logo: "assets/img/events/dhahirah-festival-logo.png",
      theme: {
        primary: "#F2AE40",   // أصفر القوس
        secondary: "#008484", // تركواز القوس
        ink: "#24184A",       // بنفسجي النص الداكن
        soft: "#FFF4E3",
        accents: [ { c: "#F2AE40", ink: "#24184A" }, { c: "#008484", ink: "#fff" }, { c: "#843018", ink: "#fff" }, { c: "#D63C7A", ink: "#fff" } ]
      },
      /* لا توجد خدمات مفعّلة بعد ← تظهر الصفحة بحالة «قريبًا»
         عند الاتفاق أضف الخدمات مثل: services: ["tickets", "passport"] */
      page: {
        services: [],
        eyebrow: "محافظة الظاهرة",
        title: "مهرجان الظاهرة السياحي",
        titleHl: "قريبًا على شُرفة",
        lead: "نستعد لإطلاق تجربة المهرجان الرقمية داخل شُرفة. حمّل التطبيق ليصلك الإعلان فور إطلاقها.",
        soonText: "نعمل مع منظمي المهرجان على إعداد خدماته داخل شُرفة. حمّل التطبيق ليصلك الإعلان فور إطلاقها."
      }
    }
    /* مثال لإضافة فعالية جديدة (احذف علامات التعليق وعدّل القيم):
    ,{
      id: "new-event",
      name: "اسم الفعالية",
      summary: "وصف مختصر للفعالية.",
      location: "المدينة، المحافظة",
      date: "",
      dateNote: "يُعلن قريبًا",
      status: "soon",
      url: "",
      image: "",
      icon: "i-compass",
      colors: { from: "#7B5BA7", to: "#5F4486", accent: "#F5A623" },
      tags: ["الجواز الرقمي"]
    }
    */
  ],

  /* بطاقة دعوة تظهر بعد الفعاليات (اجعلها false لإخفائها) */
  showComingSoonCard: true,

  /* ---------- خدمات شُرفة ----------
     status: "live" متاح | "event" ضمن الفعاليات المشاركة | "soon" قريبًا */
  services: [
    { name: "الجواز الرقمي", desc: "بطاقة ولاء لكل شريك تجمع أختام زياراتك له، وتوثيق لرحلتك بالصور واللحظات.", icon: "i-passport", status: "event", note: "أول تجربة: مهرجان صحار", link: "#passport", color: "var(--purple)" },
    { name: "اكتشاف الفعاليات", desc: "تصفّح الفعاليات المستضافة على شُرفة وتفاصيلها وخدماتها.", icon: "i-calendar", status: "live", link: "#events", color: "var(--gold)" },
    { name: "الباقات السياحية", desc: "باقات جاهزة أو مخصصة تجمع الدخول والمطاعم والأنشطة في عملية شراء واحدة.", icon: "i-box", status: "event", note: "متاح في مهرجان صحار", link: "sohar-festival.html#explore", color: "var(--brick)" },
    { name: "التجارب والأنشطة", desc: "تجارب سياحية وأنشطة خارج الفعاليات في مختلف مناطق عُمان.", icon: "i-compass", status: "soon", color: "var(--teal)" },
    { name: "برامج الولاء والمكافآت", desc: "مكافآت يحددها كل شريك عند اكتمال أختام بطاقته، مثل خصم أو زيارة مجانية.", icon: "i-gift", status: "event", note: "مع الشركاء المشاركين", color: "var(--gold)" },
    { name: "الشركاء ومقدمو الخدمات", desc: "قناة لمقدمي الخدمات للوصول إلى زوار الفعاليات والتجارب.", icon: "i-handshake", status: "live", note: "انضم الآن", link: "partners.html", color: "var(--green)" }
  ],

  /* ---------- أنواع الشركاء (للتصفية) ---------- */
  partnerTypes: [
    { id: "food",   name: "مطاعم ومقاهٍ",        icon: "i-food",     desc: "وجبات ومشروبات ضمن الباقات والعروض." },
    { id: "fun",    name: "أنشطة وترفيه",        icon: "i-game",     desc: "ألعاب وأنشطة وتجارب للعائلة والأصدقاء." },
    { id: "events", name: "فعاليات ومنظّمون",    icon: "i-calendar", desc: "مهرجانات وفعاليات تستضيف تجربتها على شُرفة." },
    { id: "tour",   name: "تجارب وجهات سياحية",  icon: "i-compass",  desc: "معالم وتجارب سياحية تشارك في الجواز الرقمي." },
    { id: "stay",   name: "إقامة وضيافة",         icon: "i-bed",      desc: "فنادق ونُزل تقدم عروضًا لمستخدمي شُرفة." },
    { id: "local",  name: "علامات محلية",         icon: "i-store",    desc: "منتجات وحلويات وعلامات تجارية عُمانية." }
  ],

  /* ---------- الشركاء المعتمدون ----------
     أضف الشركاء الرسميين فقط بعد الاتفاق معهم.
     مثال: { name: "اسم الشريك", type: "food", logo: "assets/img/partners/name.png", event: "مهرجان صحار" } */
  partners: []
};

