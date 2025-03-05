// src/components/forms/VitalsForm.tsx
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useHealthData } from "../../context/HealthDataContext";
import { Activity, ArrowRight, Check, Info, AlertTriangle } from "lucide-react";
import {
  calculateBMI,
  getBMICategory,
  getBloodPressureCategory,
} from "../../services/HealthService";

interface VitalsFormProps {
  type?: string;
  title?: string;
}

const VitalsForm: React.FC<VitalsFormProps> = ({
  type: propType,
  title: propTitle,
}) => {
  const navigate = useNavigate();
  const params = useParams<{ type?: string }>();
  const { healthData, updateData, isLoading } = useHealthData();

  // Use prop type or param type
  const type = propType || params.type;
  // Use prop title or generate from type
  const title = propTitle || getFormTitle(type);

  // Form states
  const [mode, setMode] = useState<"view" | "add" | "history">("view");
  const [formValues, setFormValues] = useState<Record<string, any>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);
  const [vitalData, setVitalData] = useState<any>(null);
  const [historyData, setHistoryData] = useState<any[]>([]);
  const [statusInfo, setStatusInfo] = useState<any>(null);
  const [isFasting, setIsFasting] = useState(true); // For blood glucose

  // Initialize vital data from context
  useEffect(() => {
    if (healthData && healthData.vitals && type) {
      let data = null;
      let history: any[] = [];

      switch (type) {
        case "bmi":
          data = healthData.vitals.bmi?.value;
          history = healthData.vitals.bmi?.history || [];
          break;
        case "blood-pressure":
          data = healthData.vitals.bloodPressure?.value;
          history = healthData.vitals.bloodPressure?.history || [];
          break;
        case "blood-glucose":
          data = healthData.vitals.bloodGlucose?.value;
          history = healthData.vitals.bloodGlucose?.history || [];
          break;
        case "waist":
          data = healthData.vitals.waist?.value;
          history = healthData.vitals.waist?.history || [];
          break;
        case "weight":
          data = healthData.vitals.weight?.value;
          history = healthData.vitals.weight?.history || [];
          break;
        case "height":
          data = healthData.vitals.height?.value;
          history = healthData.vitals.height?.history || [];
          break;
      }

      setVitalData(data);
      setHistoryData(history);

      // Set status information based on type
      if (data) {
        updateStatusInfo(data);
      }
    }
  }, [healthData, type]);

  // Get form title based on type
  function getFormTitle(formType?: string): string {
    switch (formType) {
      case "bmi":
        return "مؤشر كتلة الجسم";
      case "blood-pressure":
        return "ضغط الدم";
      case "blood-glucose":
        return "سكر الدم";
      case "waist":
        return "محيط الخصر";
      case "weight":
        return "الوزن";
      case "height":
        return "الطول";
      default:
        return "القياسات الحيوية";
    }
  }

  // Update status information based on vital data
  const updateStatusInfo = (data: any) => {
    switch (type) {
      case "bmi":
        setStatusInfo(getBMICategory(data));
        break;
      case "blood-pressure":
        setStatusInfo(getBloodPressureCategory(data));
        break;
      // Add other status info updates as needed
      default:
        setStatusInfo(null);
    }
  };

  // Format date to local format
  const formatDate = (dateString: string) => {
    if (!dateString) return "غير متوفر";

    const date = new Date(dateString);
    return new Intl.DateTimeFormat("ar-SA", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(date);
  };

  // Handle form input changes
  const handleInputChange = (field: string, value: any) => {
    setFormValues({
      ...formValues,
      [field]: value,
    });
  };

  // Handle form submission
  const handleSubmit = async () => {
  // Validate form based on type
  if (!validateForm()) {
    return;
  }
  
  // Clear errors
  setFormError(null);
  
  let newValue: any = null;
  let newHistory = [...historyData];
  
  // Prepare data based on type
  switch (type) {
    case 'bmi':
      // BMI is calculated from weight and height
      if (!formValues.weight || !formValues.height) {
        setFormError('الرجاء إدخال الوزن والطول');
        return;
      }
      
      const bmiValue = calculateBMI(
        parseFloat(formValues.weight),
        parseFloat(formValues.height)
      );
      
      newValue = bmiValue;
      newHistory.unshift({
        date: formValues.date || new Date().toISOString().split('T')[0],
        value: bmiValue
      });
      break;
      
    case 'blood-pressure':
      if (!formValues.systolic || !formValues.diastolic) {
        setFormError('الرجاء إدخال قيم ضغط الدم');
        return;
      }
      
      newValue = {
        systolic: parseInt(formValues.systolic),
        diastolic: parseInt(formValues.diastolic)
      };
      
      newHistory.unshift({
        date: formValues.date || new Date().toISOString().split('T')[0],
        value: newValue
      });
      break;
      
    default:
      if (!formValues.value) {
        setFormError('الرجاء إدخال القيمة');
        return;
      }
      
      newValue = parseFloat(formValues.value);
      newHistory.unshift({
        date: formValues.date || new Date().toISOString().split('T')[0],
        value: newValue
      });
  }
  
  // Keep only the most recent 10 entries
  if (newHistory.length > 10) {
    newHistory = newHistory.slice(0, 10);
  }
  
  // Prepare data for update
  const updatedVital = {
    value: newValue,
    history: newHistory
  };
  
  // Map type to context property
  const vitalTypeMap: Record<string, string> = {
    'bmi': 'bmi',
    'blood-pressure': 'bloodPressure',
    'blood-glucose': 'bloodGlucose',
    'waist': 'waist',
    'weight': 'weight',
    'height': 'height'
  };

  if (!type) {
    setFormError('نوع القياس غير محدد');
    return;
  }
  
  // Update context data
  const success = await updateData('vitals', vitalTypeMap[type], updatedVital);
  
  if (success) {
    // If type is BMI, also update weight and height
    if (type === 'bmi' && formValues.weight && formValues.height) {
      // Update weight
      const weightVital = {
        value: parseFloat(formValues.weight),
        history: [
          {
            date: formValues.date || new Date().toISOString().split('T')[0],
            value: parseFloat(formValues.weight)
          },
          ...(healthData.vitals.weight?.history || []).slice(0, 9)
        ]
      };
      await updateData('vitals', 'weight', weightVital);
      
      // Update height
      const heightVital = {
        value: parseFloat(formValues.height),
        history: [
          {
            date: formValues.date || new Date().toISOString().split('T')[0],
            value: parseFloat(formValues.height)
          },
          ...(healthData.vitals.height?.history || []).slice(0, 9)
        ]
      };
      await updateData('vitals', 'height', heightVital);
    }
    
    setVitalData(newValue);
    setHistoryData(newHistory);
    updateStatusInfo(newValue);
    setFormSuccess('تم تحديث البيانات بنجاح');
    
    // Reset form
    setFormValues({});
    
    // Switch back to view mode after a delay
    setTimeout(() => {
      setMode('view');
      setFormSuccess(null);
    }, 1500);
  }
};

  // Validate form based on type
  const validateForm = (): boolean => {
    setFormError(null);

    switch (type) {
      case "bmi":
        if (!formValues.weight) {
          setFormError("الرجاء إدخال الوزن");
          return false;
        }
        if (!formValues.height) {
          setFormError("الرجاء إدخال الطول");
          return false;
        }

        const weight = parseFloat(formValues.weight);
        const height = parseFloat(formValues.height);

        if (isNaN(weight) || weight <= 0 || weight > 500) {
          setFormError("الرجاء إدخال وزن صحيح (1-500 كجم)");
          return false;
        }

        if (isNaN(height) || height <= 0 || height > 300) {
          setFormError("الرجاء إدخال طول صحيح (1-300 سم)");
          return false;
        }
        break;

      case "blood-pressure":
        if (!formValues.systolic) {
          setFormError("الرجاء إدخال الضغط الانقباضي");
          return false;
        }
        if (!formValues.diastolic) {
          setFormError("الرجاء إدخال الضغط الانبساطي");
          return false;
        }

        const systolic = parseInt(formValues.systolic);
        const diastolic = parseInt(formValues.diastolic);

        if (isNaN(systolic) || systolic < 70 || systolic > 250) {
          setFormError("الرجاء إدخال قيمة صحيحة للضغط الانقباضي (70-250)");
          return false;
        }

        if (isNaN(diastolic) || diastolic < 40 || diastolic > 150) {
          setFormError("الرجاء إدخال قيمة صحيحة للضغط الانبساطي (40-150)");
          return false;
        }

        if (diastolic >= systolic) {
          setFormError("الضغط الانبساطي يجب أن يكون أقل من الانقباضي");
          return false;
        }
        break;

      case "blood-glucose":
        if (!formValues.value) {
          setFormError("الرجاء إدخال قيمة سكر الدم");
          return false;
        }

        const glucose = parseFloat(formValues.value);

        if (isNaN(glucose) || glucose < 20 || glucose > 600) {
          setFormError(
            "الرجاء إدخال قيمة صحيحة لسكر الدم (20-600 ملغم/ديسيلتر)"
          );
          return false;
        }
        break;

      case "waist":
        if (!formValues.value) {
          setFormError("الرجاء إدخال قيمة محيط الخصر");
          return false;
        }

        const waist = parseFloat(formValues.value);

        if (isNaN(waist) || waist < 30 || waist > 200) {
          setFormError("الرجاء إدخال قيمة صحيحة لمحيط الخصر (30-200 سم)");
          return false;
        }
        break;

      case "weight":
        if (!formValues.value) {
          setFormError("الرجاء إدخال الوزن");
          return false;
        }

        const weightValue = parseFloat(formValues.value);

        if (isNaN(weightValue) || weightValue <= 0 || weightValue > 500) {
          setFormError("الرجاء إدخال وزن صحيح (1-500 كجم)");
          return false;
        }
        break;

      case "height":
        if (!formValues.value) {
          setFormError("الرجاء إدخال الطول");
          return false;
        }

        const heightValue = parseFloat(formValues.value);

        if (isNaN(heightValue) || heightValue <= 0 || heightValue > 300) {
          setFormError("الرجاء إدخال طول صحيح (1-300 سم)");
          return false;
        }
        break;
    }

    return true;
  };

  // Get measurement unit based on type
  const getMeasurementUnit = (): string => {
    switch (type) {
      case "bmi":
        return "كجم/م²";
      case "blood-pressure":
        return "ملم زئبق";
      case "blood-glucose":
        return "ملغم/ديسيلتر";
      case "waist":
        return "سم";
      case "weight":
        return "كجم";
      case "height":
        return "سم";
      default:
        return "";
    }
  };

  // Get formatted value string based on type
  const getFormattedValue = (value: any): string => {
    if (value === null || value === undefined) return "غير مسجل";

    switch (type) {
      case "blood-pressure":
        return `${value.systolic}/${value.diastolic} ${getMeasurementUnit()}`;
      default:
        return `${value} ${getMeasurementUnit()}`;
    }
  };

  // Render view mode
  const renderViewMode = () => (
    <div>
      {/* Header with add button */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">{title}</h2>
        <div className="flex space-x-2 space-x-reverse">
          {historyData.length > 0 && (
            <button
              onClick={() => setMode("history")}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
            >
              السجل السابق
            </button>
          )}
          <button
            onClick={() => setMode("add")}
            className="px-4 py-2 bg-blue-500 text-white rounded-md"
          >
            تحديث
          </button>
        </div>
      </div>

      {/* Success message */}
      {formSuccess && (
        <div className="mb-6 p-3 bg-green-50 text-green-700 rounded-md flex items-center">
          <Check size={16} className="ml-2" />
          {formSuccess}
        </div>
      )}

      {/* Current value */}
      <div className="bg-gray-50 rounded-lg p-6 mb-6">
        <h3 className="text-lg font-medium mb-4">القيمة الحالية</h3>
        {vitalData ? (
          <div>
            <div className="text-3xl font-bold mb-2">
              {type === "blood-pressure"
                ? `${vitalData.systolic}/${vitalData.diastolic}`
                : vitalData}
              <span className="text-base font-normal text-gray-500 mr-2">
                {getMeasurementUnit()}
              </span>
            </div>

            {/* Last update date */}
            {historyData.length > 0 && (
              <div className="text-sm text-gray-500">
                آخر تحديث: {formatDate(historyData[0]?.date)}
              </div>
            )}

            {/* Status information */}
            {statusInfo && (
              <div
                className={`mt-4 p-3 rounded-md ${
                  statusInfo.color === "green"
                    ? "bg-green-50 text-green-700"
                    : statusInfo.color === "yellow"
                    ? "bg-yellow-50 text-yellow-700"
                    : statusInfo.color === "orange"
                    ? "bg-orange-50 text-orange-700"
                    : statusInfo.color === "red"
                    ? "bg-red-50 text-red-700"
                    : "bg-blue-50 text-blue-700"
                }`}
              >
                <div className="flex items-center">
                  <Info size={16} className="ml-2" />
                  <div>
                    <div className="font-medium">{statusInfo.category}</div>
                    <div className="text-sm">{statusInfo.description}</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8">
            <Activity size={40} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500">لا توجد قيمة مسجلة</p>
            <button
              onClick={() => setMode("add")}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md"
            >
              إضافة قياس
            </button>
          </div>
        )}
      </div>

      {/* Additional information based on type */}
      {type === "bmi" && (
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-medium mb-4">معلومات إضافية</h3>
          <p className="text-gray-600 mb-2">
            مؤشر كتلة الجسم (BMI) هو مقياس للوزن بالنسبة للطول، يستخدم لتقدير ما
            إذا كان الشخص يعاني من نقص الوزن أو وزن صحي أو زيادة الوزن أو
            السمنة.
          </p>
          <div className="mt-4 space-y-2">
            <div className="p-2 bg-blue-50 text-blue-700 rounded">
              نقص في الوزن: أقل من 18.5
            </div>
            <div className="p-2 bg-green-50 text-green-700 rounded">
              وزن طبيعي: 18.5 - 24.9
            </div>
            <div className="p-2 bg-yellow-50 text-yellow-700 rounded">
              زيادة في الوزن: 25 - 29.9
            </div>
            <div className="p-2 bg-orange-50 text-orange-700 rounded">
              سمنة: 30 أو أكثر
            </div>
          </div>
        </div>
      )}

      {type === "blood-pressure" && (
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-medium mb-4">معلومات إضافية</h3>
          <p className="text-gray-600 mb-2">
            يقاس ضغط الدم بقيمتين: الضغط الانقباضي (الرقم العلوي) والضغط
            الانبساطي (الرقم السفلي).
          </p>
          <div className="mt-4 space-y-2">
            <div className="p-2 bg-green-50 text-green-700 rounded">
              طبيعي: أقل من 120/80
            </div>
            <div className="p-2 bg-yellow-50 text-yellow-700 rounded">
              مرتفع: 120-129/أقل من 80
            </div>
            <div className="p-2 bg-orange-50 text-orange-700 rounded">
              ارتفاع المرحلة الأولى: 130-139/80-89
            </div>
            <div className="p-2 bg-red-50 text-red-700 rounded">
              ارتفاع المرحلة الثانية: 140 أو أعلى/90 أو أعلى
            </div>
          </div>
        </div>
      )}

      {type === "blood-glucose" && (
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-medium mb-4">معلومات إضافية</h3>
          <p className="text-gray-600 mb-2">
            يقاس سكر الدم عادةً بمستويات الجلوكوز في الدم الصائم أو العشوائي.
          </p>
          <div className="mt-4 space-y-2">
            <div className="p-2 bg-blue-50 text-blue-700 rounded">
              منخفض: أقل من 70 ملغم/ديسيلتر
            </div>
            <div className="p-2 bg-green-50 text-green-700 rounded">
              طبيعي (صائم): 70-99 ملغم/ديسيلتر
            </div>
            <div className="p-2 bg-yellow-50 text-yellow-700 rounded">
              مقدمات السكري (صائم): 100-125 ملغم/ديسيلتر
            </div>
            <div className="p-2 bg-red-50 text-red-700 rounded">
              مرتفع (صائم): 126 ملغم/ديسيلتر أو أعلى
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // Render add form
  const renderAddForm = () => (
    <div>
      {/* Header with back button */}
      <div className="flex items-center mb-6">
        <button
          onClick={() => {
            setMode("view");
            setFormValues({});
            setFormError(null);
          }}
          className="p-2 rounded-full hover:bg-gray-100"
        >
          <ArrowRight size={20} />
        </button>
        <h2 className="text-xl font-bold mr-2">
          {vitalData ? "تحديث القياس" : "إضافة قياس جديد"}
        </h2>
      </div>

      {/* Error message */}
      {formError && (
        <div className="mb-6 p-3 bg-red-50 text-red-700 rounded-md flex items-center">
          <AlertTriangle size={16} className="ml-2" />
          {formError}
        </div>
      )}

      {/* Success message */}
      {formSuccess && (
        <div className="mb-6 p-3 bg-green-50 text-green-700 rounded-md flex items-center">
          <Check size={16} className="ml-2" />
          {formSuccess}
        </div>
      )}

      {/* Form fields based on type */}
      <div className="space-y-6">
        {type === "bmi" ? (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                الوزن (كجم)
              </label>
              <input
                type="number"
                value={formValues.weight || ""}
                onChange={(e) => handleInputChange("weight", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="أدخل الوزن بالكيلوجرام"
                min="1"
                max="500"
                step="0.1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                الطول (سم)
              </label>
              <input
                type="number"
                value={formValues.height || ""}
                onChange={(e) => handleInputChange("height", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="أدخل الطول بالسنتيمتر"
                min="1"
                max="300"
                step="0.1"
              />
            </div>
          </>
        ) : type === "blood-pressure" ? (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                الضغط الانقباضي (العلوي)
              </label>
              <input
                type="number"
                value={formValues.systolic || ""}
                onChange={(e) => handleInputChange("systolic", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="أدخل الضغط الانقباضي"
                min="70"
                max="250"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                الضغط الانبساطي (السفلي)
              </label>
              <input
                type="number"
                value={formValues.diastolic || ""}
                onChange={(e) => handleInputChange("diastolic", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="أدخل الضغط الانبساطي"
                min="40"
                max="150"
              />
            </div>
          </>
        ) : type === "blood-glucose" ? (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                مستوى سكر الدم (ملغم/ديسيلتر)
              </label>
              <input
                type="number"
                value={formValues.value || ""}
                onChange={(e) => handleInputChange("value", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="أدخل مستوى سكر الدم"
                min="20"
                max="600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                نوع القياس
              </label>
              <div className="flex">
                <button
                  type="button"
                  className={`flex-1 py-2 ${
                    isFasting
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100 text-gray-700"
                  } rounded-r-md`}
                  onClick={() => setIsFasting(true)}
                >
                  صائم
                </button>
                <button
                  type="button"
                  className={`flex-1 py-2 ${
                    !isFasting
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100 text-gray-700"
                  } rounded-l-md`}
                  onClick={() => setIsFasting(false)}
                >
                  فاطر
                </button>
              </div>
            </div>
          </>
        ) : (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {type === "waist"
                ? "محيط الخصر (سم)"
                : type === "weight"
                ? "الوزن (كجم)"
                : "الطول (سم)"}
            </label>
            <input
              type="number"
              value={formValues.value || ""}
              onChange={(e) => handleInputChange("value", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder={`أدخل ${
                type === "waist"
                  ? "محيط الخصر"
                  : type === "weight"
                  ? "الوزن"
                  : "الطول"
              }`}
              min={type === "waist" ? "30" : type === "weight" ? "1" : "1"}
              max={type === "waist" ? "200" : type === "weight" ? "500" : "300"}
              step="0.1"
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            تاريخ القياس
          </label>
          <input
            type="date"
            value={formValues.date || new Date().toISOString().split("T")[0]}
            onChange={(e) => handleInputChange("date", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            max={new Date().toISOString().split("T")[0]}
          />
        </div>

        {/* Submit button */}
        <div className="flex justify-end">
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-500 text-white rounded-md"
            disabled={isLoading}
          >
            {isLoading ? "جاري الحفظ..." : "حفظ"}
          </button>
        </div>
      </div>
    </div>
  );

  // Continuing from the previous code...

  // Render history view
  const renderHistoryView = () => (
    <div>
      {/* Header with back button */}
      <div className="flex items-center mb-6">
        <button
          onClick={() => setMode("view")}
          className="p-2 rounded-full hover:bg-gray-100"
        >
          <ArrowRight size={20} />
        </button>
        <h2 className="text-xl font-bold mr-2">سجل القياسات السابقة</h2>
      </div>

      {/* History list */}
      {historyData.length === 0 ? (
        <div className="text-center py-10 bg-gray-50 rounded-lg">
          <Activity size={40} className="mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500">لا توجد قياسات سابقة</p>
        </div>
      ) : (
        <div className="space-y-4">
          {historyData.map((item, index) => (
            <div
              key={index}
              className="p-4 bg-white rounded-lg shadow-sm border border-gray-100"
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-500">
                    {formatDate(item.date)}
                  </p>
                  <h3 className="font-medium mt-1">
                    {type === "blood-pressure"
                      ? `${item.value.systolic}/${
                          item.value.diastolic
                        } ${getMeasurementUnit()}`
                      : `${item.value} ${getMeasurementUnit()}`}
                  </h3>
                </div>
                {index === 0 && (
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                    أحدث قياس
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  // Main render
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      {mode === "view"
        ? renderViewMode()
        : mode === "add"
        ? renderAddForm()
        : renderHistoryView()}
    </div>
  );
};

export default VitalsForm;
