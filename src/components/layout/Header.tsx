import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

interface HeaderProps {
  userName?: string;
}

const Header: React.FC<HeaderProps> = ({ userName }) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const isRootPath = location.pathname === '/';
  
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center">
          {!isRootPath && (
            <button 
              onClick={() => navigate(-1)}
              className="p-2 rounded-full hover:bg-gray-100 ml-3"
              aria-label="رجوع"
            >
              <ArrowRight size={20} />
            </button>
          )}
          <h1 className="text-lg font-bold text-gray-900">الملف الصحي الموحد</h1>
        </div>
        {userName && (
          <span className="text-sm text-gray-500">مرحباً، {userName}</span>
        )}
      </div>
    </header>
  );
};

export default Header;