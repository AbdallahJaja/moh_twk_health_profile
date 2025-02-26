// js/constants.js

// Flag to use mock data (true for now)
const USE_MOCK = true;

// English localization strings
const LANG_EN = {
  homeTitle: "MOH Services - Home",
  vitalDetailsTitle: "Vital Details",
  vitalsDashboardTitle: "MOH Vitals Dashboard",
  greeting: "Hi",
  age: "Age",
  back: "Back",
  select: "Select",
  cancelSelect: "Cancel",
  deleteSelected: "Delete Selected",
  moreActions: "More Actions",
  copied: "Copied to clipboard!",
  digitalTwinInsight: "You have {count} entries. Regular review aids in preventive and predictive care.",
  copy: "Copy",
  delete: "Delete",
  noVitalSelected: "No vital selected.",
  switchText: "العربية",
  swipeHint: "Swipe left to copy or delete",
  services: {
    vitals: "Vitals",
    visits: "Visits",
    appointments: "Appointments",
    bookAppointment: "Book Appointment",
    settings: "Settings"
  },
  vitalListTitle: "Your Vitals"
};

// Arabic localization strings
const LANG_AR = {
  homeTitle: "خدمات وزارة الصحة",
  vitalDetailsTitle: "تفاصيل الحالة الصحية",
  vitalsDashboardTitle: "لوحة عرض الحالات الصحية",
  greeting: "مرحبًا",
  age: "العمر",
  back: "عودة",
  select: "تحديد",
  cancelSelect: "إلغاء التحديد",
  deleteSelected: "حذف المحدد",
  moreActions: "المزيد",
  copied: "تم النسخ!",
  digitalTwinInsight: "لديك {count} مدخلات. المراجعة الدورية تساعد في الوقاية والرعاية التنبؤية.",
  copy: "نسخ",
  delete: "حذف",
  noVitalSelected: "لم يتم تحديد حالة صحية.",
  switchText: "English",
  swipeHint: "اسحب لليسار للنسخ أو الحذف",
  services: {
    vitals: "الحالات الصحية",
    visits: "الزيارات",
    appointments: "المواعيد",
    bookAppointment: "حجز موعد",
    settings: "الإعدادات"
  },
  vitalListTitle: "قائمة الحالات الصحية"
};

// Mapping for vital keys to localized titles
const VITALS_TRANSLATION = {
  drug_allergy_list: { en: "Drug Allergy List", ar: "قائمة الحساسية من الأدوية" },
  food_allergy_list: { en: "Food Allergy List", ar: "قائمة الحساسية من الأطعمة" },
  substance_allergy_list: { en: "Substance Allergy List", ar: "قائمة الحساسية من المواد" },
  bmi: { en: "Body Mass Index", ar: "مؤشر كتلة الجسم" },
  blood_pressure: { en: "Blood Pressure", ar: "ضغط الدم" },
  blood_sugar: { en: "Blood Sugar", ar: "سكر الدم" },
  body_mass: { en: "Body Mass", ar: "كتلة الجسم" },
  waist_circumference: { en: "Waist Circumference", ar: "محيط الخصر" },
  blood_type: { en: "Blood Type", ar: "فصيلة الدم" },
  user_health_conditions: { en: "User Health Conditions", ar: "الحالات الصحية للمستخدم" },
  weight: { en: "Weight", ar: "الوزن" },
  height: { en: "Height", ar: "الطول" },
  family_medical_history: { en: "Family Medical History", ar: "التاريخ المرضي للأسرة" }
  // Add additional mappings as needed...
};