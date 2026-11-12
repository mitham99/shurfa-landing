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
    },
    {
      id: "squ-eat",
      name: "SQU إيييت — مهرجان الطعام",
      summary: "مهرجان الطعام في جامعة السلطان قابوس: أكشاك طعام، مسابقة طهي، وبطولة ورقة — مع الباقات والجواز الرقمي على شُرفة.",
      location: "جامعة السلطان قابوس، مسقط",
      date: "15 – 17 نوفمبر 2026",
      dateNote: "",
      /* «قريبًا» حتى يُفعَّل النظام الفعلي؛ غيّرها إلى "available" يوم الإطلاق */
      status: "soon",
      url: "squ-eat.html",
      image: "assets/img/events/squ-eat.jpg",
      imagePosition: "center 42%",
      icon: "i-food",
      colors: { from: "#1E3F8F", to: "#3D8BE0", accent: "#F2B33A" },
      tags: ["مسابقة الطهي", "بطولة الورقة", "الباقات", "الجواز الرقمي"],
      logo: "assets/img/events/squ-eat-logo.jpg",
      /* ألوان مأخوذة من ملصقات المهرجان */
      theme: {
        primary: "#3D8BE0",
        secondary: "#A63FB0",
        ink: "#1E3F8F",
        soft: "#EEF5FD",
        accents: [ { c: "#3D8BE0", ink: "#fff" }, { c: "#A63FB0", ink: "#fff" }, { c: "#F26A2E", ink: "#fff" }, { c: "#F2B33A", ink: "#1A2E28" } ]
      },
      page: {
        services: ["passport", "packages"],
        eyebrow: "جامعة السلطان قابوس · جماعة التجارة",
        title: "SQU إيييت",
        titleHl: "مهرجان الطعام على شُرفة",
        primaryCta: { href: "app/index.html?e=squ-eat", label: "احصل على جوازك الرقمي", icon: "i-passport" },
        lead: "ثلاثة أيام من الأكل والمسابقات في جامعة السلطان قابوس. كوّن باقتك من الأكشاك المشاركة، واجمع أختام كل كشك في جوازك الرقمي.",
        facts: [
          { icon: "i-calendar", text: "الأحد 15 – الثلاثاء 17 نوفمبر" },
          { icon: "i-spark", text: "من 4 إلى 9 مساءً" },
          { icon: "i-pin", text: "مواقف المسرح المفتوح، جامعة السلطان قابوس" },
          { icon: "i-users", text: "تنظيم: جماعة التجارة" }
        ],
        chips: {
          passport: ["ختم جديد", "في بطاقة الكشك"],
          packages: ["باقة الطالب", "وجبة + مشروب"]
        },
        program: {
          kicker: "برنامج المهرجان",
          title: "ثلاثة أيام من الأكل والمنافسة",
          lead: "مسابقات بتكون في هذه النسخة من SQU إيييت!",
          items: [
            { title: "مسابقة الطهي", icon: "i-food", color: "#A63FB0",
              desc: "تقدر تختار سولو أو دوو! المكونات علينا، والتخليط عليكم.",
              rows: [ ["اليوم الأول", "مسابقة للمشاهير"], ["اليوم الثاني", "مسابقة للطلاب"], ["اليوم الثالث", "مسابقة للطلاب الدوليين"] ],
              note: "وصح على فكرة.. ترا فيه جوائز!" },
            { title: "بطولة الورقة", icon: "i-users", color: "#3D8BE0",
              desc: "ورقة، بلوت، مشترى… دوّر لك ربيع لعيب وسجّل. نظام لعب تيمات.",
              rows: [ ["المركز الأول", "100 ريال"], ["المركز الثاني", "50 ريال"] ],
              note: "على البراد صدقني!",
              link: { href: "app/team.html?e=squ-eat", label: "سجّل فريقك" } },
            { title: "أكشاك الطعام", icon: "i-sweet", color: "#F26A2E",
              desc: "مطاعم ومقاهٍ وأكشاك مشاركة طوال أيام المهرجان — كوّن منها باقتك، واجمع أختام كل كشك في جوازك الرقمي.",
              note: "قائمة الأكشاك المشاركة تُعلن قريبًا",
              link: { href: "app/index.html?e=squ-eat", label: "احصل على جوازك" } }
          ]
        },
        /* باقات توضيحية — المكونات والأسعار النهائية تُحدد مع الأكشاك المشاركة */
        packages: {
          items: [
            { id: "meal",   name: "وجبة رئيسية",  note: "من الأكشاك المشاركة", icon: "i-food",   art: "linear-gradient(135deg,#E4573D,#C7432B)" },
            { id: "coffee", name: "قهوة ومشروبات", note: "من المقاهي المشاركة", icon: "i-coffee", art: "linear-gradient(135deg,#8B5E3C,#6B4529)" },
            { id: "sweets", name: "حلويات",       note: "من الأكشاك المشاركة", icon: "i-sweet",  art: "linear-gradient(135deg,#F5A623,#E08E0B)" },
            { id: "snack",  name: "وجبة خفيفة",   note: "سناك من الأكشاك",     icon: "i-star",   art: "linear-gradient(135deg,#3D8BE0,#2F6FC0)" }
          ],
          presets: {
            family:  { label: "باقة الطالب",  title: "باقة الطالب",   hint: "وجبة رئيسية + مشروب.", items: ["meal", "coffee"] },
            friends: { label: "باقة التذوّق", title: "باقة التذوّق",  hint: "وجبة + حلى + مشروب + سناك — جرّب أكثر من كشك.", items: ["meal", "sweets", "coffee", "snack"] },
            custom:  { label: "باقتي",       title: "باقتي المخصصة", hint: "اختر ما يناسبك من الأكشاك المشاركة.", items: [] }
          }
        },
        /* بطاقات ولاء توضيحية — كل كشك يحدد عدد الزيارات ومكافأته */
        passportCards: [
          { id: "food", label: "كشك طعام", name: "كشك مشارك", icon: "i-food", stamps: 3,
            rewards: [ { at: 4, label: "مجانًا", ordinal: "الرابعة", note: "الوجبة الرابعة مجانية" } ] },
          { id: "games", label: "مقهى", name: "مقهى مشارك", icon: "i-coffee", stamps: 2,
            rewards: [ { at: 3, label: "خصم 50%", ordinal: "الثالثة", note: "نسبة الخصم يحددها المقهى" } ] }
        ]
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

