import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Map, ArrowRight, Navigation, Phone, MapPin } from 'lucide-react';

const HealthCenters: React.FC = () => {
  const navigate = useNavigate();
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Mock health center data
  const healthCenter = {
    id: 1,
    name: 'مستشفى الملك فهد',
    distance: '2.3',
    address: 'شارع الأمير فهد، حي العليا، الرياض',
    phone: '0118324000',
    lat: 24.7136, // Example coordinates
    lng: 46.6753, // Example coordinates
    services: ['طوارئ', 'عيادات خارجية', 'أشعة', 'طب الأسرة', 'مختبر', 'صيدلية'],
    workingHours: 'على مدار الساعة'
  };
  
  // Fetch user location
  useEffect(() => {
    const getUserLocation = async () => {
      setLoading(true);
      
      try {
        // Try to get location from TWK first
        if (window.TWK && window.TWK.getUserLocation) {
          const twkLocation = await window.TWK.getUserLocation();
          
          if (twkLocation.success && twkLocation.result.data) {
            const { latitude, longitude } = twkLocation.result.data;
            setUserLocation({ lat: latitude, lng: longitude });
            setLoading(false);
            return;
          }
        }
        
        // Fallback to browser geolocation if TWK doesn't provide it
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            position => {
              setUserLocation({
                lat: position.coords.latitude,
                lng: position.coords.longitude
              });
              setLoading(false);
            },
            error => {
              console.error('Error getting location:', error);
              // Use a default location as fallback
              setUserLocation({ lat: 24.7136, lng: 46.6753 }); // Default to Riyadh
              setLoading(false);
            }
          );
        } else {
          console.error('Geolocation not supported');
          setUserLocation({ lat: 24.7136, lng: 46.6753 }); // Default to Riyadh
          setLoading(false);
        }
      } catch (error) {
        console.error('Error getting user location:', error);
        setUserLocation({ lat: 24.7136, lng: 46.6753 }); // Default to Riyadh
        setLoading(false);
      }
    };
    
    getUserLocation();
  }, []);
  
  // Handle navigation to maps app
  const handleOpenDirections = () => {
    if (!userLocation) return;
    
    // Create maps URL with coordinates
    const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${healthCenter.lat},${healthCenter.lng}`;
    
    // Use TWK openUrl if available
    if (window.TWK && window.TWK.openUrl) {
      window.TWK.openUrl(mapsUrl, 1); // Using UrlType.http = 1
    } else {
      // Fallback to window.open
      window.open(mapsUrl, '_blank');
    }
  };
  
  // Handle phone call
  const handleCall = () => {
    const telUrl = `tel:${healthCenter.phone}`;
    
    // Use TWK openUrl if available
    if (window.TWK && window.TWK.openUrl) {
      window.TWK.openUrl(telUrl, 2); // Using UrlType.tel = 2
    } else {
      // Fallback to window.location
      window.location.href = telUrl;
    }
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
        <h2 className="text-xl font-bold mr-2">المركز الصحي المخصص</h2>
      </div>
      
      {loading ? (
        <div className="bg-gray-50 rounded-lg p-6 mb-6 flex justify-center items-center min-h-[200px]">
          <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin"></div>
        </div>
      ) : (
        <>
          {/* Map section */}
          <div className="bg-gray-100 rounded-lg h-48 mb-6 relative overflow-hidden">
            {/* This would be a real map in production */}
            <div className="absolute inset-0 flex items-center justify-center">
              <MapPin size={32} className="text-red-500" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            <div className="absolute bottom-3 right-3 bg-white p-2 rounded-lg shadow text-sm font-medium">
              {healthCenter.name}
            </div>
          </div>
          
          {/* Health center details */}
          <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
            <div className="flex justify-between items-start">
              <h3 className="font-bold text-lg">{healthCenter.name}</h3>
              <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                {healthCenter.distance} كم
              </span>
            </div>
            
            <p className="text-gray-600 mt-2">{healthCenter.address}</p>
            
            <div className="mt-3 grid grid-cols-2 gap-2">
              <div>
                <span className="text-xs text-gray-500">ساعات العمل:</span>
                <p className="text-sm">{healthCenter.workingHours}</p>
              </div>
              <div>
                <span className="text-xs text-gray-500">رقم الهاتف:</span>
                <p className="text-sm">{healthCenter.phone}</p>
              </div>
            </div>
            
            <div className="mt-4">
              <span className="text-xs text-gray-500 block mb-1">الخدمات المتوفرة:</span>
              <div className="flex flex-wrap gap-1">
                {healthCenter.services.map((service, idx) => (
                  <span key={idx} className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded">
                    {service}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="mt-4 grid grid-cols-2 gap-3">
              <button 
                onClick={handleOpenDirections}
                className="flex items-center justify-center bg-blue-500 text-white py-2 px-4 rounded-md"
              >
                <Navigation size={16} className="ml-1" />
                الاتجاهات
              </button>
              <button 
                onClick={handleCall}
                className="flex items-center justify-center bg-gray-100 text-gray-800 py-2 px-4 rounded-md"
              >
                <Phone size={16} className="ml-1" />
                اتصال
              </button>
            </div>
          </div>
          
          <div className="text-center text-sm text-gray-500">
            هذا هو المركز الصحي المخصص لك بناءً على عنوانك المسجل
          </div>
        </>
      )}
    </div>
  );
};

export default HealthCenters;
