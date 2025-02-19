/* constants.js */
const API_BASE_URL = "https://www.api.moh.gov.sa/v1";
const VITALS_API_URL = API_BASE_URL + "/user/vitals";
const SAVE_VITALS_API_URL = API_BASE_URL + "/user/save_vitals"; // Append /{id} when calling

// Vital records translations (mapped by vital_key)
const VITALS_TRANSLATION = {
  "update_drug_allergy_list": { en: "Update Drug Allergy List", ar: "تحديث قائمة الحساسية من الأدوية" },
  "update_food_allergy_list": { en: "Update Food Allergy List", ar: "تحديث قائمة الحساسية من الأطعمة" },
  "update_substance_allergy_list": { en: "Update Substance Allergy List", ar: "تحديث قائمة الحساسية من المواد" },
  "update_bmi": { en: "Update Body Mass Index (BMI)", ar: "تحديث مؤشر كتلة الجسم" },
  "update_blood_pressure": { en: "Update Blood Pressure", ar: "تحديث قياس ضغط الدم" },
  "update_blood_sugar": { en: "Update Blood Sugar", ar: "تحديث قياس سكر الدم" },
  "update_body_mass": { en: "Update Body Mass", ar: "تحديث قياس كتلة الجسم" },
  "update_waist_circumference": { en: "Update Waist Circumference", ar: "تحديث قياس محيط الخصر" },
  "update_blood_type": { en: "Update Blood Type", ar: "تحديث نوع فصيلة الدم" },
  "update_weight": { en: "Update Weight Measurement", ar: "تحديث قياس الوزن" },
  "update_height": { en: "Update Height Measurement", ar: "تحديث قياس الطول" },
  "view_bmi": { en: "View Body Mass Index (BMI)", ar: "استعراض مؤشر كتلة الجسم" },
  "view_blood_pressure": { en: "View Blood Pressure", ar: "استعراض قياس ضغط الدم" },
  "view_blood_sugar": { en: "View Blood Sugar", ar: "استعراض قياس سكر الدم" },
  "view_body_mass": { en: "View Body Mass", ar: "استعراض قياس كتلة الجسم" },
  "view_waist_circumference": { en: "View Waist Circumference", ar: "استعراض قياس محيط الخصر" },
  "view_blood_type": { en: "View Blood Type", ar: "استعراض نوع فصيلة الدم" },
  "view_weight": { en: "View Weight Measurement", ar: "استعراض قياس الوزن" },
  "view_height": { en: "View Height Measurement", ar: "استعراض قياس الطول" },
  "view_lab_test_results": { en: "View Lab Test Results", ar: "استعراض نتائج الفحوصات المخبرية" }
};

// i18n language strings
const LANG_EN = {
  greeting: "Hi",
  copy: "Copy",
  close: "Close",
  cancel: "Cancel",
  save: "Save",
  editMetric: "Edit Metric",
  metricDetails: "Metric Details",
};

const LANG_AR = {
  greeting: "مرحبا",
  copy: "نسخ",
  close: "إغلاق",
  cancel: "إلغاء",
  save: "حفظ",
  editMetric: "تحرير القياس",
  metricDetails: "تفاصيل القياس",
};
