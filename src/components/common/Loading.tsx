// src/components/common/Loading.tsx
import React from "react";

interface LoadingProps {
  message?: string;
  overlay?: boolean;
}

const Loading: React.FC<LoadingProps> = ({ message, overlay }) => {
  const content = (
    <div className="flex flex-col items-center justify-center p-6">
      <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin"></div>
      <p className="mt-4 text-gray-600">{message || "جاري التحميل..."}</p>
    </div>
  );

  if (overlay) {
    return (
      <div className="fixed inset-0 bg-white bg-opacity-80 z-50 flex items-center justify-center">
        {content}
      </div>
    );
  }

  return content;
};

export default Loading;
