import React from 'react';

interface HeaderProps {
  title: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
  return (
    <div className="border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4 bg-white">
      <h2 className="text-base sm:text-lg font-semibold text-gray-800 truncate">
        {title}
      </h2>
    </div>
  );
};

export default Header;