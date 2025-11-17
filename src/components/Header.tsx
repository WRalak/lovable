import React from 'react';
import { Plus } from 'lucide-react';

interface HeaderProps {
  title: string;
  onNewConversation?: () => void;
}

const Header: React.FC<HeaderProps> = ({ title, onNewConversation }) => {
  return (
    <div className="border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4 bg-white flex items-center justify-between">
      <h2 className="text-base sm:text-lg font-semibold text-gray-800 truncate">
        {title}
      </h2>
      {onNewConversation && (
        <button
          onClick={onNewConversation}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          title="New Conversation"
        >
          <Plus className="w-5 h-5 text-gray-600" />
        </button>
      )}
    </div>
  );
};

export default Header;