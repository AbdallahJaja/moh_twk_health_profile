import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Pill, ArrowRight, AlertTriangle, Clock } from 'lucide-react';

interface MedicationsProps {
  type?: 'current' | 'previous';
}

const Medications: React.FC<MedicationsProps> = ({ type: propType }) => {
  const navigate = useNavigate();
  const params = useParams<{ type?: string }>();
  
  // Use prop type or param type
  const type = propType || params.type as 'current' | 'previous';
  
  // Sample data for medications
  const [currentMedications] = useState([
    {
      id: 1,
      name: 'باراسيتامول',
      dose: '500 ملغ',
      frequency: '3 مرات يومياً',
      startDate: '2025-01-15',
      duration: '10 أيام',
      doctor: 'د. أحمد سعيد',
      notes: 'يؤخذ بعد الطعام'
    },
    {
      id: 2,
      name: 'أموكسيسيلين',
      dose: '250 ملغ',
      frequency: 'مرتين يومياً',
      startDate: '2025-02-10',
      duration: '7 أيام',
      doctor: 'د. خالد محمد',
      notes: 'يؤخذ قبل الطعام بساعة'
    }
  ]);
  
  const [previousMedications] = useState([
    {
      id: 1,
      name: 'إيبوبروفين',
      dose: '400 ملغ',
      frequency: 'عند الحاجة',
      startDate: '2024-12-05',
      endDate: '2024-12-15',
      doctor: 'د. سارة العلي',
      notes: 'لتسكين الآلام'
    },
    {
      id: 2,
      name: 'كلاريثروميسين',
      dose: '500 ملغ',
      frequency: 'مرتين يومياً',
      startDate: '2024-11-20',
      endDate: '2024-11-30',
      doctor: 'د. محمد العمر',
      notes: 'للالتهاب الرئوي'
    },
    {
      id: 3,
      name: 'لوراتادين',
      dose: '10 ملغ',
      frequency: 'مرة واحدة يومياً',
      startDate: '2024-10-15',
      endDate: '2024-11-15',
      doctor: 'د. أحمد سعيد',
      notes: 'للحساسية الموسمية'
    }
  ]);
  
  // Format date to local format
  const formatDate = (dateString: string) => {
    if (!dateString) return 'غير متوفر';
    
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('ar-SA', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).format(date);
  };
  
  const isCurrentType = type === 'current';
  const medications = isCurrentType ? currentMedications : previousMedications;
  
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center mb-6">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-full hover:bg-gray-100"
        >
          <ArrowRight size={20} />
        </button>
        <h2 className="text-xl font-bold mr-2">
          {isCurrentType ? 'الأدوية الحالية' : 'الأدوية السابقة'}
        </h2>
      </div>
      
      {medications.length === 0 ? (
        <div className="text-center py-10 bg-gray-50 rounded-lg">
          <Pill size={40} className="mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500">
            {isCurrentType 
              ? 'لا توجد أدوية حالية مسجلة' 
              : 'لا توجد أدوية سابقة مسجلة'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {medications.map(med => (
            <div key={med.id} className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-start">
                <h3 className="font-medium">{med.name}</h3>
                {isCurrentType && (
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full flex items-center">
                    <Clock size={12} className="ml-1" />
                    نشط
                  </span>
                )}
              </div>
              
              <div className="grid grid-cols-2 gap-2 mt-3">
                <div>
                  <span className="text-xs text-gray-500">الجرعة:</span>
                  <p className="text-sm">{med.dose}</p>
                </div>
                <div>
                  <span className="text-xs text-gray-500">التكرار:</span>
                  <p className="text-sm">{med.frequency}</p>
                </div>
                <div>
                  <span className="text-xs text-gray-500">تاريخ البدء:</span>
                  <p className="text-sm">{formatDate(med.startDate)}</p>
                </div>
                <div>
                  <span className="text-xs text-gray-500">{isCurrentType ? 'المدة:' : 'تاريخ الانتهاء:'}</span>
                  <p className="text-sm">{'duration' in med ? med.duration : formatDate(med.endDate)}</p>
                </div>
              </div>
              
              <div className="mt-3">
                <span className="text-xs text-gray-500">الطبيب:</span>
                <p className="text-sm">{med.doctor}</p>
              </div>
              
              {med.notes && (
                <div className="mt-3 bg-yellow-50 p-2 rounded-md text-sm flex items-start">
                  <AlertTriangle size={16} className="text-yellow-500 ml-2 mt-0.5" />
                  <div>
                    <span className="text-xs font-medium text-yellow-700">ملاحظات:</span>
                    <p className="text-yellow-700">{med.notes}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Medications;