// src/components/Placeholder.tsx
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowRight } from "lucide-react";

interface PlaceholderProps {
  title?: string;
}

const Placeholder: React.FC<PlaceholderProps> = ({ title }) => {
  const navigate = useNavigate();
  const params = useParams();

  const getTitle = () => {
    const category = params.category;
    const type = params.type;

    if (category === "allergies") {
      if (type === "medicine") return "حساسية الأدوية";
      if (type === "food") return "حساسية الأطعمة";
      if (type === "material") return "حساسية المواد";
      if (type === "doctor") return "حساسية مدخلة من الطبيب";
    } else if (category === "vitals") {
      if (type === "bmi") return "مؤشر كتلة الجسم";
      if (type === "blood-pressure") return "ضغط الدم";
      if (type === "blood-glucose") return "سكر الدم";
      if (type === "waist") return "محيط الخصر";
      if (type === "weight") return "الوزن";
      if (type === "height") return "الطول";
    } else if (category === "general") {
      if (type === "blood-type") return "فصيلة الدم";
      if (type === "health-conditions") return "الحالات الصحية";
      if (type === "family-history") return "التاريخ المرضي للعائلة";
    }

    return title || "معلومات الصفحة";
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center mb-6">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-full hover:bg-gray-100"
        >
          <ArrowRight size={20} />
        </button>
        <h2 className="text-xl font-bold mr-2">{getTitle()}</h2>
      </div>

      <div className="text-center py-10 bg-gray-50 rounded-lg">
        <p className="text-gray-500 mb-2">هذه الصفحة قيد التطوير</p>
        <p className="text-gray-400 text-sm">
          قسم: {params.category}
          <br />
          نوع: {params.type}
        </p>
      </div>
    </div>
  );
};

export default Placeholder;
