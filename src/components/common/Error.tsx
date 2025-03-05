// src/components/common/Error.tsx
import React from "react";
import { AlertTriangle } from "lucide-react";

interface ErrorProps {
  message?: string;
}

const Error: React.FC<ErrorProps> = ({ message }) => {
  return (
    <div className="p-4 bg-red-50 text-red-700 rounded-lg flex items-start">
      <AlertTriangle className="mt-1 ml-2 flex-shrink-0" size={20} />
      <div>
        <h3 className="font-bold">حدث خطأ</h3>
        <p>{message || "حدث خطأ غير متوقع، يرجى المحاولة مرة أخرى."}</p>
      </div>
    </div>
  );
};

export default Error;
