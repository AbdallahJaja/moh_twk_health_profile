import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Heart, 
  Activity, 
  Users, 
  ChevronRight, 
  Moon, 
  Sun, 
  Languages, 
  FileText, 
  Map, 
  Pill
} from 'lucide-react';

interface DashboardProps {
  userData: {
    id: string;
    name: string;
    gender: string;
    birthDate: string;
  } | null;
}

const Dashboard: React.FC<DashboardProps> = ({ userData }) => {
  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [language, setLanguage] = useState<'ar' | 'en'>('ar');

  // Calculate age based on birthDate
  const calculateAge = (birthDateStr: string) => {
    const birthDate = new Date(birthDateStr);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };
  
  useEffect(() => {
  // Load saved theme preference
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    setIsDarkMode(true);
    document.documentElement.classList.add('dark');
  } else {
    setIsDarkMode(false);
    document.documentElement.classList.remove('dark');
  }
  
  // Load saved language preference
  const savedLanguage = localStorage.getItem('language') as 'ar' | 'en' | null;
  if (savedLanguage) {
    setLanguage(savedLanguage);
    
    // Set direction based on language
    if (savedLanguage === 'ar') {
      document.documentElement.setAttribute('dir', 'rtl');
    } else {
      document.documentElement.setAttribute('dir', 'ltr');
    }
  }
}, []);

  // Get appropriate greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    
    if (hour >= 5 && hour < 12) {
      return 'صباح الخير';
    } else if (hour >= 12 && hour < 17) {
      return 'مساء الخير';
    } else {
      return 'مساء الخير';
    }
  };

  // Navigation handlers
  const navigateToSection = (section: string, type: string = '') => {
    navigate(`/${section}${type ? '/' + type : ''}`);
  };

  // Toggle theme with page reload
const toggleTheme = () => {
  // Toggle theme state
  const newTheme = !isDarkMode;
  setIsDarkMode(newTheme);
  
  // Save to localStorage
  localStorage.setItem('theme', newTheme ? 'dark' : 'light');
  
  // Apply theme to document
  if (newTheme) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
  
  // Reload the current page to apply theme changes
  window.location.reload();
};

// Toggle language with page reload
const toggleLanguage = () => {
  // Toggle language state
  const newLang = language === 'ar' ? 'en' : 'ar';
  setLanguage(newLang);
  
  // Save to localStorage
  localStorage.setItem('language', newLang);
  
  // Set direction based on language
  if (newLang === 'ar') {
    document.documentElement.setAttribute('dir', 'rtl');
  } else {
    document.documentElement.setAttribute('dir', 'ltr');
  }
  
  // Reload the current page to apply language changes
  window.location.reload();
};

  return (
    <div className="space-y-6">
      {/* Action buttons section */}
      <div className="flex justify-end space-x-2 space-x-reverse">
        <button
          onClick={toggleTheme}
          className="p-2 bg-white rounded-full shadow"
          aria-label={isDarkMode ? 'وضع النهار' : 'وضع الليل'}
        >
          {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
        <button
          onClick={toggleLanguage}
          className="p-2 bg-white rounded-full shadow"
          aria-label="تغيير اللغة"
        >
          <Languages size={20} />
        </button>
      </div>

      {/* User profile section with improved spacing */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center">
          <div className="flex-shrink-0 h-16 w-16 bg-gray-200 rounded-full overflow-hidden">
            {/* User avatar placeholder */}
            <div className="h-full w-full flex items-center justify-center text-gray-500 font-bold text-xl">
              {userData?.name?.charAt(0) || 'م'}
            </div>
          </div>
          <div className="mr-5"> {/* Increased spacing from mr-4 to mr-5 */}
            <h2 className="text-xl font-bold">{getGreeting()}</h2>
            <p className="text-gray-600">
              {userData?.name || 'المستخدم'}
              {userData?.birthDate && `, ${calculateAge(userData.birthDate)} سنة`}
            </p>
            
            {/* New: Health Record link */}
            <div className="mt-2 flex items-center">
  <span className="text-xs text-gray-500 ml-1">الرقم الصحي:</span>
  <span className="text-sm font-medium">MRN-10254367</span>
</div>
          </div>
        </div>
      </div>

      {/* Allergies Section */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-red-50 to-white p-4 border-b">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-full">
              <Heart className="text-red-500" size={20} />
            </div>
            <h2 className="text-lg font-medium text-gray-900 mr-3">
              الحساسية
            </h2>
          </div>
        </div>

        <div className="divide-y divide-gray-100">
          <div
            onClick={() => navigateToSection('allergies', 'medicine')}
            className="p-4 flex items-center justify-between hover:bg-gray-50 cursor-pointer"
          >
            <div>
              <h3 className="font-medium">حساسية الأدوية</h3>
            </div>
            <ChevronRight className="text-gray-400" size={20} />
          </div>
          
          <div
            onClick={() => navigateToSection('allergies', 'food')}
            className="p-4 flex items-center justify-between hover:bg-gray-50 cursor-pointer"
          >
            <div>
              <h3 className="font-medium">حساسية الأطعمة</h3>
            </div>
            <ChevronRight className="text-gray-400" size={20} />
          </div>
          
          <div
            onClick={() => navigateToSection('allergies', 'material')}
            className="p-4 flex items-center justify-between hover:bg-gray-50 cursor-pointer"
          >
            <div>
              <h3 className="font-medium">حساسية المواد</h3>
            </div>
            <ChevronRight className="text-gray-400" size={20} />
          </div>
          
          <div
            onClick={() => navigateToSection('allergies', 'doctor')}
            className="p-4 flex items-center justify-between hover:bg-gray-50 cursor-pointer"
          >
            <div>
              <h3 className="font-medium">حساسية مدخلة من الطبيب</h3>
            </div>
            <ChevronRight className="text-gray-400" size={20} />
          </div>
        </div>
      </div>

      {/* Vitals Section */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-blue-50 to-white p-4 border-b">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-full">
              <Activity className="text-blue-500" size={20} />
            </div>
            <h2 className="text-lg font-medium text-gray-900 mr-3">
              المؤشرات الحيوية
            </h2>
          </div>
        </div>

        <div className="divide-y divide-gray-100">
          <div
            onClick={() => navigateToSection('vitals', 'bmi')}
            className="p-4 flex items-center justify-between hover:bg-gray-50 cursor-pointer"
          >
            <div>
              <h3 className="font-medium">مؤشر كتلة الجسم</h3>
            </div>
            <ChevronRight className="text-gray-400" size={20} />
          </div>
          
          <div
            onClick={() => navigateToSection('vitals', 'blood-pressure')}
            className="p-4 flex items-center justify-between hover:bg-gray-50 cursor-pointer"
          >
            <div>
              <h3 className="font-medium">ضغط الدم</h3>
            </div>
            <ChevronRight className="text-gray-400" size={20} />
          </div>
          
          <div
            onClick={() => navigateToSection('vitals', 'blood-glucose')}
            className="p-4 flex items-center justify-between hover:bg-gray-50 cursor-pointer"
          >
            <div>
              <h3 className="font-medium">سكر الدم</h3>
            </div>
            <ChevronRight className="text-gray-400" size={20} />
          </div>
          
          <div
            onClick={() => navigateToSection('vitals', 'waist')}
            className="p-4 flex items-center justify-between hover:bg-gray-50 cursor-pointer"
          >
            <div>
              <h3 className="font-medium">محيط الخصر</h3>
            </div>
            <ChevronRight className="text-gray-400" size={20} />
          </div>
          
          <div
            onClick={() => navigateToSection('vitals', 'weight')}
            className="p-4 flex items-center justify-between hover:bg-gray-50 cursor-pointer"
          >
            <div>
              <h3 className="font-medium">الوزن</h3>
            </div>
            <ChevronRight className="text-gray-400" size={20} />
          </div>
          
          <div
            onClick={() => navigateToSection('vitals', 'height')}
            className="p-4 flex items-center justify-between hover:bg-gray-50 cursor-pointer"
          >
            <div>
              <h3 className="font-medium">الطول</h3>
            </div>
            <ChevronRight className="text-gray-400" size={20} />
          </div>
        </div>
      </div>

      {/* Medications Section (New) */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-purple-50 to-white p-4 border-b">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-full">
              <Pill className="text-purple-500" size={20} />
            </div>
            <h2 className="text-lg font-medium text-gray-900 mr-3">
              الأدوية
            </h2>
          </div>
        </div>

        <div className="divide-y divide-gray-100">
          <div
            onClick={() => navigateToSection('medications', 'current')}
            className="p-4 flex items-center justify-between hover:bg-gray-50 cursor-pointer"
          >
            <div>
              <h3 className="font-medium">الأدوية الحالية</h3>
            </div>
            <ChevronRight className="text-gray-400" size={20} />
          </div>
          
          <div
            onClick={() => navigateToSection('medications', 'previous')}
            className="p-4 flex items-center justify-between hover:bg-gray-50 cursor-pointer"
          >
            <div>
              <h3 className="font-medium">الأدوية السابقة</h3>
            </div>
            <ChevronRight className="text-gray-400" size={20} />
          </div>
        </div>
      </div>

      {/* General Health Section */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-green-50 to-white p-4 border-b">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-full">
              <Users className="text-green-500" size={20} />
            </div>
            <h2 className="text-lg font-medium text-gray-900 mr-3">
              معلومات صحية عامة
            </h2>
          </div>
        </div>

        <div className="divide-y divide-gray-100">
          <div
            onClick={() => navigateToSection('general', 'blood-type')}
            className="p-4 flex items-center justify-between hover:bg-gray-50 cursor-pointer"
          >
            <div>
              <h3 className="font-medium">فصيلة الدم</h3>
            </div>
            <ChevronRight className="text-gray-400" size={20} />
          </div>
          
          <div
            onClick={() => navigateToSection('general', 'health-conditions')}
            className="p-4 flex items-center justify-between hover:bg-gray-50 cursor-pointer"
          >
            <div>
              <h3 className="font-medium">الحالات الصحية</h3>
            </div>
            <ChevronRight className="text-gray-400" size={20} />
          </div>
          
          <div
            onClick={() => navigateToSection('general', 'family-history')}
            className="p-4 flex items-center justify-between hover:bg-gray-50 cursor-pointer"
          >
            <div>
              <h3 className="font-medium">التاريخ المرضي للعائلة</h3>
            </div>
            <ChevronRight className="text-gray-400" size={20} />
          </div>
          
          {/* New: Health Centers */}
          <div
            onClick={() => navigateToSection('general', 'health-centers')}
            className="p-4 flex items-center justify-between hover:bg-gray-50 cursor-pointer"
          >
            <div>
              <h3 className="font-medium">المراكز الصحية القريبة</h3>
            </div>
            <ChevronRight className="text-gray-400" size={20} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;