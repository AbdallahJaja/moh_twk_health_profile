// src/App.tsx
import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';

// Import components
import Dashboard from './components/Dashboard';
import VitalsForm from './components/forms/VitalsForm';
import AllergiesForm from './components/forms/AllergiesForm';
import GeneralHealthForm from './components/forms/GeneralHealthForm';
import Header from './components/layout/Header';
import Loading from './components/common/Loading';
import Error from './components/common/Error';
import HealthRecord from './components/views/HealthRecord';
import Medications from './components/views/Medications';
import HealthCenters from './components/views/HealthCenters';

// Context provider
import { HealthDataProvider } from './context/HealthDataContext';

// Define user data type
interface UserData {
  id: string;
  name: string;
  gender: string;
  birthDate: string;
}

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    // Fetch user data from Tawakkalna
    const fetchUserData = async () => {
      try {
        if (window.TWK) {
          const userId = await window.TWK.getUserId();
          const userName = await window.TWK.getUserFullName();
          const gender = await window.TWK.getUserGender();
          const birthDate = await window.TWK.getUserBirthDate();
          
          setUserData({
            id: userId.result?.data || '123456789',
            name: userName.result?.data || 'المستخدم',
            gender: gender.result?.data || 'male',
            birthDate: birthDate.result?.data || '1990-01-01'
          });
        } else {
          // Fallback
          setUserData({
            id: '123456789',
            name: 'عبدالله محمد',
            gender: 'male',
            birthDate: '1990-01-01'
          });
        }
        
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError('حدث خطأ في جلب بيانات المستخدم');
        setIsLoading(false);
      }
    };

    // Simulate loading delay
    setTimeout(() => {
      fetchUserData();
    }, 1000);
  }, []);

  if (isLoading) {
    return <Loading message="جاري تحميل البيانات..." />;
  }

  if (error) {
    return <Error message={error} />;
  }

  return (
    <HealthDataProvider>
      <div className="min-h-screen bg-gray-50 font-sans" dir="rtl">
        <Header userName={userData?.name} />
        
        <main className="max-w-7xl mx-auto px-4 py-6">
         <Routes>
  <Route path="/" element={<Dashboard userData={userData} />} />
  
  {/* Allergies Routes */}
  <Route path="/allergies/medicine" element={<AllergiesForm type="medicine" />} />
  <Route path="/allergies/food" element={<AllergiesForm type="food" />} />
  <Route path="/allergies/material" element={<AllergiesForm type="material" />} />
  <Route path="/allergies/doctor" element={<AllergiesForm type="doctor" />} />
  
  {/* Vitals Routes */}
  <Route path="/vitals/bmi" element={<VitalsForm type="bmi" />} />
  <Route path="/vitals/blood-pressure" element={<VitalsForm type="blood-pressure" />} />
  <Route path="/vitals/blood-glucose" element={<VitalsForm type="blood-glucose" />} />
  <Route path="/vitals/waist" element={<VitalsForm type="waist" />} />
  <Route path="/vitals/weight" element={<VitalsForm type="weight" />} />
  <Route path="/vitals/height" element={<VitalsForm type="height" />} />
  
  {/* General Health Routes */}
  <Route path="/general/blood-type" element={<GeneralHealthForm type="blood-type" />} />
  <Route path="/general/health-conditions" element={<GeneralHealthForm type="health-conditions" />} />
  <Route path="/general/family-history" element={<GeneralHealthForm type="family-history" />} />
  <Route path="/general/health-centers" element={<HealthCenters />} />
  
  {/* New Routes */}
  <Route path="/health-record" element={<HealthRecord />} />
  <Route path="/medications/current" element={<Medications type="current" />} />
  <Route path="/medications/previous" element={<Medications type="previous" />} />
</Routes>
        </main>
      </div>
    </HealthDataProvider>
  );
};

export default App;