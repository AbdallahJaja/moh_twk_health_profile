import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, ArrowRight } from 'lucide-react';

const HealthRecord: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center mb-6">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-full hover:bg-gray-100"
        >
          <ArrowRight size={20} />
        </button>
        <h2 className="text-xl font-bold mr-2">السجل الصحي</h2>
      </div>
      
      <div className="bg-gray-50 rounded-lg p-6 mb-6">
        <div className="flex items-center justify-center mb-4">
          <FileText size={40} className="text-blue-500" />
        </div>
        <h3 className="text-lg font-medium text-center mb-2">السجل الصحي</h3>
        <p className="text-gray-600 text-center">
          يمكنك الاطلاع على سجلك الصحي الكامل هنا، بما في ذلك الزيارات الطبية والوصفات الطبية والفحوصات.
        </p>
        
        <div className="mt-6 space-y-4">
          <div className="border border-gray-200 rounded-lg p-4">
            <h4 className="font-medium mb-2">آخر زيارة طبية</h4>
            <p className="text-sm text-gray-600">
              عيادة عامة - مستشفى الملك فهد
            </p>
            <p className="text-sm text-gray-500">
              15/02/2025
            </p>
          </div>
          
          <div className="border border-gray-200 rounded-lg p-4">
            <h4 className="font-medium mb-2">آخر وصفة طبية</h4>
            <p className="text-sm text-gray-600">
              باراسيتامول 500 ملغ - 3 مرات يومياً
            </p>
            <p className="text-sm text-gray-500">
              10/02/2025
            </p>
          </div>
          
          <div className="border border-gray-200 rounded-lg p-4">
            <h4 className="font-medium mb-2">آخر فحص مخبري</h4>
            <p className="text-sm text-gray-600">
              فحص دم شامل - مختبر العليا
            </p>
            <p className="text-sm text-gray-500">
              05/02/2025
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HealthRecord;
