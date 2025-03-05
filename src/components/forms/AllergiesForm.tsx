// src/components/forms/AllergiesForm.tsx
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useHealthData } from "../../context/HealthDataContext";
import { Heart, Search, Plus, X, ArrowRight, Check } from "lucide-react";

interface AllergiesFormProps {
  type?: string;
  title?: string;
}

const severityOptions = [
  { id: "mild", label: "خفيفة", color: "yellow" },
  { id: "moderate", label: "متوسطة", color: "orange" },
  { id: "severe", label: "شديدة", color: "red" },
];

const AllergiesForm: React.FC<AllergiesFormProps> = ({
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
  const [mode, setMode] = useState<"list" | "add" | "edit">("list");
  const [allergies, setAllergies] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAllergy, setSelectedAllergy] = useState<any>(null);
  const [allergyName, setAllergyName] = useState("");
  const [severity, setSeverity] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);

  // Get form title based on type
  function getFormTitle(formType?: string): string {
    switch (formType) {
      case "medicine":
        return "حساسية الأدوية";
      case "food":
        return "حساسية الأطعمة";
      case "material":
        return "حساسية المواد";
      case "doctor":
        return "حساسية مدخلة من الطبيب";
      default:
        return "الحساسية";
    }
  }

  // Suggestions based on type
  const getSuggestions = (): string[] => {
    switch (type) {
      case "medicine":
        return [
          "باراسيتامول",
          "أسبرين",
          "أموكسيسيلين",
          "إيبوبروفين",
          "سيفالوسبورين",
        ];
      case "food":
        return ["فراولة", "مكسرات", "بيض", "حليب", "قمح", "سمك"];
      case "material":
        return ["لاتكس", "نيكل", "مطاط", "صوف", "غبار"];
      default:
        return [];
    }
  };

  // Filter suggestions based on search term
  const filteredSuggestions = getSuggestions().filter((suggestion) =>
    suggestion.includes(searchTerm)
  );

  // Initialize allergies from context
  useEffect(() => {
    if (healthData && healthData.allergies && type) {
      switch (type) {
        case "medicine":
          setAllergies(healthData.allergies.medicine || []);
          break;
        case "food":
          setAllergies(healthData.allergies.food || []);
          break;
        case "material":
          setAllergies(healthData.allergies.material || []);
          break;
        case "doctor":
          setAllergies(healthData.allergies.doctor || []);
          break;
        default:
          setAllergies([]);
      }
    }
  }, [healthData, type]);

  // Handle adding a new allergy
  const handleAddAllergy = async () => {
    // Validate form
    if (!allergyName.trim()) {
      setFormError("الرجاء إدخال اسم الحساسية");
      return;
    }

    if (!severity) {
      setFormError("الرجاء اختيار شدة الحساسية");
      return;
    }

    // Clear errors
    setFormError(null);

    // Create new allergy object
    const newAllergy = {
      id: Date.now(),
      name: allergyName.trim(),
      severity,
      date: new Date().toISOString().split("T")[0],
    };

    // Add to allergies list
    const updatedAllergies = [...allergies, newAllergy];

    // Update context data
    if (!type) {
      setFormError("نوع الحساسية غير محدد");
      return;
    }

    const success = await updateData("allergies", type, updatedAllergies);

    if (success) {
      setAllergies(updatedAllergies);
      setFormSuccess("تمت إضافة الحساسية بنجاح");

      // Reset form
      setAllergyName("");
      setSeverity("");

      // Switch back to list mode after a delay
      setTimeout(() => {
        setMode("list");
        setFormSuccess(null);
      }, 1500);
    }
  };

  // Handle updating an existing allergy
  const handleUpdateAllergy = async () => {
    if (!selectedAllergy) return;

    // Validate form
    if (!allergyName.trim()) {
      setFormError("الرجاء إدخال اسم الحساسية");
      return;
    }

    if (!severity) {
      setFormError("الرجاء اختيار شدة الحساسية");
      return;
    }

    // Clear errors
    setFormError(null);

    // Update allergy object
    const updatedAllergy = {
      ...selectedAllergy,
      name: allergyName.trim(),
      severity,
      date: new Date().toISOString().split("T")[0], // Update date to today
    };

    // Update allergies list
    const updatedAllergies = allergies.map((allergy) =>
      allergy.id === selectedAllergy.id ? updatedAllergy : allergy
    );

    // Update context data
    if (!type) {
      setFormError("نوع الحساسية غير محدد");
      return;
    }

    const success = await updateData("allergies", type, updatedAllergies);

    if (success) {
      setAllergies(updatedAllergies);
      setFormSuccess("تم تحديث الحساسية بنجاح");

      // Reset form
      setSelectedAllergy(null);
      setAllergyName("");
      setSeverity("");

      // Switch back to list mode after a delay
      setTimeout(() => {
        setMode("list");
        setFormSuccess(null);
      }, 1500);
    }
  };

  // Handle deleting an allergy
  const handleDeleteAllergy = async (id: number) => {
    // Filter out the selected allergy
    const updatedAllergies = allergies.filter((allergy) => allergy.id !== id);

    // Update context data
    if (!type) {
      setFormError("نوع الحساسية غير محدد");
      return;
    }

    const success = await updateData("allergies", type, updatedAllergies);

    if (success) {
      setAllergies(updatedAllergies);
      setFormSuccess("تم حذف الحساسية بنجاح");

      // Clear success message after delay
      setTimeout(() => {
        setFormSuccess(null);
      }, 1500);
    }
  };

  // Handle selecting an allergy for editing
  const handleEditAllergy = (allergy: any) => {
    setSelectedAllergy(allergy);
    setAllergyName(allergy.name);
    setSeverity(allergy.severity);
    setMode("edit");
  };

  // Handle suggestion selection
  const handleSelectSuggestion = (suggestion: string) => {
    setAllergyName(suggestion);
    setSearchTerm("");
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

  // Render list view
  const renderListView = () => (
    <div>
      {/* Header with add button */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">{title}</h2>
        <button
          onClick={() => setMode("add")}
          className="px-4 py-2 bg-blue-500 text-white rounded-md flex items-center"
          disabled={type === "doctor"} // Can't add allergies entered by doctors
        >
          <Plus size={16} className="ml-1" />
          إضافة حساسية
        </button>
      </div>

      {/* Success message */}
      {formSuccess && (
        <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-md flex items-center">
          <Check size={16} className="ml-2" />
          {formSuccess}
        </div>
      )}

      {/* Allergies list */}
      {allergies.length === 0 ? (
        <div className="text-center py-10 bg-gray-50 rounded-lg">
          <Heart size={40} className="mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500">لا توجد حساسية مسجلة</p>
          {type !== "doctor" && (
            <button
              onClick={() => setMode("add")}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md inline-flex items-center"
            >
              <Plus size={16} className="ml-1" />
              إضافة حساسية
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {allergies.map((allergy) => (
            <div
              key={allergy.id}
              className="p-4 bg-white rounded-lg shadow-sm border border-gray-100"
            >
              <div className="flex justify-between">
                <div>
                  <h3 className="font-medium">{allergy.name}</h3>
                  <p className="text-sm text-gray-500">
                    تاريخ التسجيل: {formatDate(allergy.date)}
                  </p>
                </div>
                <div className="flex items-center">
                  <span
                    className={`
                      px-2 py-1 text-xs rounded-full ml-2
                      ${
                        allergy.severity === "mild"
                          ? "bg-yellow-100 text-yellow-800"
                          : allergy.severity === "moderate"
                          ? "bg-orange-100 text-orange-800"
                          : "bg-red-100 text-red-800"
                      }
                    `}
                  >
                    {allergy.severity === "mild"
                      ? "خفيفة"
                      : allergy.severity === "moderate"
                      ? "متوسطة"
                      : "شديدة"}
                  </span>

                  {type !== "doctor" && (
                    <div className="flex">
                      <button
                        onClick={() => handleEditAllergy(allergy)}
                        className="p-1 text-blue-500 hover:text-blue-700 ml-2"
                      >
                        تعديل
                      </button>
                      <button
                        onClick={() => handleDeleteAllergy(allergy.id)}
                        className="p-1 text-red-500 hover:text-red-700"
                      >
                        حذف
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  // Render add/edit form
  const renderForm = () => (
    <div>
      {/* Header with back button */}
      <div className="flex items-center mb-6">
        <button
          onClick={() => {
            setMode("list");
            setSelectedAllergy(null);
            setAllergyName("");
            setSeverity("");
            setFormError(null);
          }}
          className="p-2 rounded-full hover:bg-gray-100"
        >
          <ArrowRight size={20} />
        </button>
        <h2 className="text-xl font-bold mr-2">
          {mode === "add" ? "إضافة حساسية جديدة" : "تعديل الحساسية"}
        </h2>
      </div>

      {/* Error message */}
      {formError && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md">
          {formError}
        </div>
      )}

      {/* Success message */}
      {formSuccess && (
        <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-md flex items-center">
          <Check size={16} className="ml-2" />
          {formSuccess}
        </div>
      )}

      {/* Search box with suggestions */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          اسم الحساسية
        </label>
        <div className="relative">
          <input
            type="text"
            value={allergyName}
            onChange={(e) => {
              setAllergyName(e.target.value);
              setSearchTerm(e.target.value);
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="أدخل اسم الحساسية"
          />
          {searchTerm && filteredSuggestions.length > 0 && (
            <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md border border-gray-200 py-1">
              {filteredSuggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleSelectSuggestion(suggestion)}
                >
                  {suggestion}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Severity selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          شدة الحساسية
        </label>
        <div className="space-y-2">
          {severityOptions.map((option) => (
            <div
              key={option.id}
              className={`
                p-3 border rounded-md cursor-pointer flex items-center
                ${
                  severity === option.id
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200"
                }
              `}
              onClick={() => setSeverity(option.id)}
            >
              <div
                className={`
                w-5 h-5 rounded-full flex items-center justify-center 
                ${
                  severity === option.id
                    ? "bg-blue-500"
                    : "border border-gray-300"
                }
              `}
              >
                {severity === option.id && (
                  <Check size={12} className="text-white" />
                )}
              </div>
              <span className="mr-2">{option.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Submit button */}
      <div className="flex justify-end">
        <button
          onClick={mode === "add" ? handleAddAllergy : handleUpdateAllergy}
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
      {mode === "list" ? renderListView() : renderForm()}
    </div>
  );
};

export default AllergiesForm;
