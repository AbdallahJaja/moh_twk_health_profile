// src/components/forms/GeneralHealthForm.tsx
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useHealthData } from "../../context/HealthDataContext";
import { Users, Plus, ArrowRight, Check, AlertTriangle, X } from "lucide-react";

interface GeneralHealthFormProps {
  type?: string;
  title?: string;
}

const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const GeneralHealthForm: React.FC<GeneralHealthFormProps> = ({
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
  const [mode, setMode] = useState<"view" | "add" | "edit">("view");
  const [formValues, setFormValues] = useState<Record<string, any>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);
  const [generalData, setGeneralData] = useState<any>(null);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  // Get form title based on type
  function getFormTitle(formType?: string): string {
    switch (formType) {
      case "blood-type":
        return "فصيلة الدم";
      case "health-conditions":
        return "الحالات الصحية";
      case "family-history":
        return "التاريخ المرضي للعائلة";
      default:
        return "معلومات صحية عامة";
    }
  }

  // Initialize data from context
  useEffect(() => {
    if (healthData && healthData.general && type) {
      switch (type) {
        case "blood-type":
          setGeneralData(healthData.general.bloodType);
          break;
        case "health-conditions":
          setGeneralData(healthData.general.healthConditions || []);
          break;
        case "family-history":
          setGeneralData(healthData.general.familyHistory || []);
          break;
      }
    }
  }, [healthData, type]);

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

    // Prepare data based on type
    switch (type) {
      case "blood-type":
        newValue = formValues.bloodType;
        break;

      case "health-conditions":
      case "family-history":
        if (mode === "add") {
          // Add new item
          const newItem = {
            id: Date.now(),
            name: formValues.name,
            date: new Date().toISOString().split("T")[0],
            ...(type === "family-history"
              ? { relation: formValues.relation }
              : {}),
          };

          newValue = [
            ...(Array.isArray(generalData) ? generalData : []),
            newItem,
          ];
        } else if (mode === "edit" && selectedItem) {
          // Update existing item
          const updatedItem = {
            ...selectedItem,
            name: formValues.name,
            ...(type === "family-history"
              ? { relation: formValues.relation }
              : {}),
          };

          newValue = (generalData as any[]).map((item) =>
            item.id === selectedItem.id ? updatedItem : item
          );
        }
        break;
    }

    // Map type to context property
    const generalTypeMap: Record<string, string> = {
      "blood-type": "bloodType",
      "health-conditions": "healthConditions",
      "family-history": "familyHistory",
    };

    if (!type) {
      setFormError("نوع المعلومات غير محدد");
      return;
    }

    // Update context data
    const success = await updateData("general", generalTypeMap[type], newValue);

    if (success) {
      setGeneralData(newValue);
      setFormSuccess("تم تحديث البيانات بنجاح");

      // Reset form
      setFormValues({});
      setSelectedItem(null);

      // Switch back to view mode after a delay
      setTimeout(() => {
        setMode("view");
        setFormSuccess(null);
      }, 1500);
    }
  };

  // Handle deleting an item
  const handleDeleteItem = async (id: number) => {
    if (!type || (type !== "health-conditions" && type !== "family-history")) {
      return;
    }

    // Filter out the selected item
    const updatedItems = (generalData as any[]).filter(
      (item) => item.id !== id
    );

    // Map type to context property
    const generalTypeMap: Record<string, string> = {
      "health-conditions": "healthConditions",
      "family-history": "familyHistory",
    };

    // Update context data
    const success = await updateData(
      "general",
      generalTypeMap[type],
      updatedItems
    );

    if (success) {
      setGeneralData(updatedItems);
      setFormSuccess("تم الحذف بنجاح");

      // Clear success message after delay
      setTimeout(() => {
        setFormSuccess(null);
      }, 1500);
    }
  };

  // Handle selecting an item for editing
  const handleEditItem = (item: any) => {
    setSelectedItem(item);
    setFormValues({
      name: item.name,
      ...(type === "family-history" ? { relation: item.relation } : {}),
    });
    setMode("edit");
  };

  // Validate form based on type
  const validateForm = (): boolean => {
    setFormError(null);

    switch (type) {
      case "blood-type":
        if (!formValues.bloodType) {
          setFormError("الرجاء اختيار فصيلة الدم");
          return false;
        }
        break;

      case "health-conditions":
        if (!formValues.name || !formValues.name.trim()) {
          setFormError("الرجاء إدخال اسم الحالة الصحية");
          return false;
        }
        break;

      case "family-history":
        if (!formValues.name || !formValues.name.trim()) {
          setFormError("الرجاء إدخال اسم الحالة المرضية");
          return false;
        }

        if (!formValues.relation || !formValues.relation.trim()) {
          setFormError("الرجاء إدخال صلة القرابة");
          return false;
        }
        break;
    }

    return true;
  };

  // Render view mode
  const renderViewMode = () => {
    if (type === "blood-type") {
      return (
        <div>
          {/* Header with edit button */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">{title}</h2>
            <button
              onClick={() => {
                setMode("add");
                setFormValues({ bloodType: generalData || "" });
              }}
              className="px-4 py-2 bg-blue-500 text-white rounded-md"
            >
              تحديث
            </button>
          </div>

          {/* Success message */}
          {formSuccess && (
            <div className="mb-6 p-3 bg-green-50 text-green-700 rounded-md flex items-center">
              <Check size={16} className="ml-2" />
              {formSuccess}
            </div>
          )}

          {/* Blood type display */}
          <div className="bg-gray-50 rounded-lg p-6">
            {generalData ? (
              <div className="text-center">
                <span className="text-4xl font-bold">{generalData}</span>
                <p className="mt-4 text-gray-600">فصيلة الدم الخاصة بك</p>
              </div>
            ) : (
              <div className="text-center py-8">
                <Users size={40} className="mx-auto text-gray-300 mb-3" />
                <p className="text-gray-500">لم يتم تحديد فصيلة الدم</p>
                <button
                  onClick={() => setMode("add")}
                  className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md"
                >
                  تحديد فصيلة الدم
                </button>
              </div>
            )}
          </div>

          {/* Blood type information */}
          <div className="mt-6 bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-medium mb-4">معلومات عن فصائل الدم</h3>
            <p className="text-gray-600 mb-2">
              معرفة فصيلة الدم الخاصة بك أمر ضروري للطوارئ الطبية وعمليات نقل
              الدم.
            </p>
          </div>
        </div>
      );
    } else {
      // Health conditions or family history
      return (
        <div>
          {/* Header with add button */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">{title}</h2>
            <button
              onClick={() => {
                setMode("add");
                setFormValues({});
              }}
              className="px-4 py-2 bg-blue-500 text-white rounded-md flex items-center"
            >
              <Plus size={16} className="ml-1" />
              إضافة
            </button>
          </div>

          {/* Success message */}
          {formSuccess && (
            <div className="mb-6 p-3 bg-green-50 text-green-700 rounded-md flex items-center">
              <Check size={16} className="ml-2" />
              {formSuccess}
            </div>
          )}

          {/* Items list */}
          {!Array.isArray(generalData) || generalData.length === 0 ? (
            <div className="text-center py-10 bg-gray-50 rounded-lg">
              <Users size={40} className="mx-auto text-gray-300 mb-3" />
              <p className="text-gray-500">
                {type === "health-conditions"
                  ? "لا توجد حالات صحية مسجلة"
                  : "لا يوجد تاريخ مرضي عائلي مسجل"}
              </p>
              <button
                onClick={() => setMode("add")}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md inline-flex items-center"
              >
                <Plus size={16} className="ml-1" />
                إضافة
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {generalData.map((item: any) => (
                <div
                  key={item.id}
                  className="p-4 bg-white rounded-lg shadow-sm border border-gray-100"
                >
                  <div className="flex justify-between">
                    <div>
                      <h3 className="font-medium">{item.name}</h3>
                      {type === "family-history" && item.relation && (
                        <p className="text-sm text-gray-600">
                          صلة القرابة: {item.relation}
                        </p>
                      )}
                      <p className="text-sm text-gray-500">
                        تاريخ التسجيل: {formatDate(item.date)}
                      </p>
                    </div>
                    <div className="flex items-center">
                      <button
                        onClick={() => handleEditItem(item)}
                        className="p-1 text-blue-500 hover:text-blue-700 ml-2"
                      >
                        تعديل
                      </button>
                      <button
                        onClick={() => handleDeleteItem(item.id)}
                        className="p-1 text-red-500 hover:text-red-700"
                      >
                        حذف
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      );
    }
  };

  // Render add/edit form for blood type
  const renderBloodTypeForm = () => (
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
        <h2 className="text-xl font-bold mr-2">تحديد فصيلة الدم</h2>
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

      {/* Blood type selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          اختر فصيلة الدم
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {bloodTypes.map((bloodType) => (
            <div
              key={bloodType}
              className={`
                p-3 border rounded-md cursor-pointer text-center
                ${
                  formValues.bloodType === bloodType
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200"
                }
              `}
              onClick={() => handleInputChange("bloodType", bloodType)}
            >
              <span className="text-lg font-medium">{bloodType}</span>
            </div>
          ))}
        </div>
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
  );

  // Render add/edit form for health conditions or family history
  const renderItemForm = () => (
    <div>
      {/* Header with back button */}
      <div className="flex items-center mb-6">
        <button
          onClick={() => {
            setMode("view");
            setFormValues({});
            setSelectedItem(null);
            setFormError(null);
          }}
          className="p-2 rounded-full hover:bg-gray-100"
        >
          <ArrowRight size={20} />
        </button>
        <h2 className="text-xl font-bold mr-2">
          {mode === "add"
            ? type === "health-conditions"
              ? "إضافة حالة صحية"
              : "إضافة تاريخ مرضي"
            : type === "health-conditions"
            ? "تعديل حالة صحية"
            : "تعديل تاريخ مرضي"}
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

      {/* Name input */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {type === "health-conditions" ? "اسم الحالة الصحية" : "اسم المرض"}
        </label>
        <input
          type="text"
          value={formValues.name || ""}
          onChange={(e) => handleInputChange("name", e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          placeholder={
            type === "health-conditions"
              ? "أدخل اسم الحالة الصحية"
              : "أدخل اسم المرض"
          }
        />
      </div>

      {/* Relation input for family history */}
      {type === "family-history" && (
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            صلة القرابة
          </label>
          <input
            type="text"
            value={formValues.relation || ""}
            onChange={(e) => handleInputChange("relation", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="مثال: الأب، الأم، الجد"
          />
        </div>
      )}

      {/* Submit button */}
      <div className="flex justify-end">
        <button
          onClick={handleSubmit}
          className="px-4 py-2 bg-blue-500 text-white rounded-md"
          disabled={isLoading}
        >
          {isLoading ? "جاري الحفظ..." : mode === "add" ? "إضافة" : "تحديث"}
        </button>
      </div>
    </div>
  );

  // Main render
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      {isLoading && (
        <div className="fixed inset-0 bg-white bg-opacity-80 z-50 flex items-center justify-center">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-600">جاري معالجة البيانات...</p>
          </div>
        </div>
      )}

      {mode === "view"
        ? renderViewMode()
        : type === "blood-type"
        ? renderBloodTypeForm()
        : renderItemForm()}
    </div>
  );
};

export default GeneralHealthForm;
