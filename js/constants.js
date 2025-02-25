/* js/constants.js */
const API_BASE_URL = "https://www.api.moh.gov.sa/v1";
const VITALS_API_URL = API_BASE_URL + "/user/vitals";
const SAVE_VITALS_API_URL = API_BASE_URL + "/user/save_vitals"; // Append /{id} when calling
const AUTH_API_URL = "https://www.api.moh.gov.sa/v1/auth/login";
const VISITS_API_URL = API_BASE_URL + "/user/visits";

// Revised translations (without "Update")
const VITALS_TRANSLATION = {
  "drug_allergy_list": { en: "Drug Allergy List", ar: "قائمة الحساسية من الأدوية" },
  "food_allergy_list": { en: "Food Allergy List", ar: "قائمة الحساسية من الأطعمة" },
  "substance_allergy_list": { en: "Substance Allergy List", ar: "قائمة الحساسية من المواد" },
  "bmi": { en: "BMI", ar: "مؤشر كتلة الجسم" },
  "blood_pressure": { en: "Blood Pressure", ar: "قياس ضغط الدم" },
  "blood_sugar": { en: "Blood Sugar", ar: "قياس سكر الدم" },
  "body_mass": { en: "Body Mass", ar: "قياس كتلة الجسم" },
  "waist_circumference": { en: "Waist Circumference", ar: "قياس محيط الخصر" },
  "blood_type": { en: "Blood Type", ar: "نوع فصيلة الدم" },
  "user_health_conditions": { en: "Health Conditions", ar: "الحالات الصحية" },
  "weight": { en: "Weight", ar: "الوزن" },
  "height": { en: "Height", ar: "الطول" },
  "family_medical_history": { en: "Family Medical History", ar: "التاريخ المرضي في الأسرة" },
  "doctor_allergy_list": { en: "Doctor Allergy List", ar: "قائمة الحساسية من الطبيب" },
  "user_allergy_list": { en: "User Allergy List", ar: "قائمة الحساسية من المستخدم" },
  "health_id": { en: "Health ID", ar: "الرقم الصحي" },
  "previous_medications": { en: "Previous Medications", ar: "الأدوية السابقة" },
  "current_medications": { en: "Current Medications", ar: "الأدوية الحالية" },
  "general_vaccinations": { en: "General Vaccinations", ar: "التطعيمات العامة" },
  "children_vaccinations": { en: "Children’s Vaccinations", ar: "تطعيمات الأطفال" },
  "doctor_health_conditions": { en: "Doctor Health Conditions", ar: "الحالات المسجلة" },
  "previous_medications_list": { en: "Previous Medications List", ar: "قائمة الأدوية السابقة" },
  "surgeries_procedures": { en: "Surgeries and Procedures", ar: "العمليات والإجراءات" },
  "visits": { en: "Visits", ar: "الزيارات" },
  "lab_test_results": { en: "Lab Test Results", ar: "نتائج الفحوصات المخبرية" },
  "additional_info": { en: "Additional Information", ar: "معلومات إضافية" },
  "location_health_facility": { en: "Location & Health Facility", ar: "الموقع والمنشأة الصحية" }
};

const LANG_EN = {
  greeting: "Hi",
  copy: "Copy",
  close: "Close",
  cancel: "Cancel",
  save: "Save",
  editMetric: "Edit Metric",
  metricDetails: "Metric Details",
  convertUnits: "Convert Units",
  moreInfo: "More Info"
};

const LANG_AR = {
  greeting: "مرحبا",
  copy: "نسخ",
  close: "إغلاق",
  cancel: "إلغاء",
  save: "حفظ",
  editMetric: "تحرير القياس",
  metricDetails: "تفاصيل القياس",
  convertUnits: "تحويل الوحدات",
  moreInfo: "مزيد من المعلومات"
};

const STORAGE_KEY = "MOH_TOKEN";
const USE_MOCK = true;