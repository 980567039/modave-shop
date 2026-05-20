import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

const IconShowcase = () => {
  const [selectedIcon, setSelectedIcon] = useState(null);
  const [icons, setIcons] = useState([]);

  useEffect(() => {
    const loadIcons = async () => {
      const lucide = await import('lucide-react');
      const iconNames = Object.keys(lucide).filter(
        (key) => typeof lucide[key] === 'function' && key !== 'createLucideIcon'
      );
      setIcons(iconNames);
    };

    loadIcons();
  }, []);

  const handleIconClick = (iconName) => {
    setSelectedIcon(iconName);
  };

  const DynamicIcon = ({ name }) => {
    const LucideIcon = dynamic(() => import('lucide-react').then((mod) => mod[name]));
    return <LucideIcon className="w-8 h-8" />;
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Lucide Icons Showcase</h1>
      {selectedIcon && (
        <div className="mb-4 p-2 bg-blue-100 rounded">
          <p className="font-semibold">Selected Icon: {selectedIcon}</p>
        </div>
      )}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
        {icons.map((iconName) => (
          <div
            key={iconName}
            className="flex flex-col items-center justify-center p-2 border rounded cursor-pointer hover:bg-gray-100"
            onClick={() => handleIconClick(iconName)}
          >
            <DynamicIcon name={iconName} />
            <span className="mt-2 text-xs text-center">{iconName}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default IconShowcase;