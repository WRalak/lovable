import React from 'react';

interface QuickActionsProps {
  onQuickAction: (action: string) => void;
}

const QuickActions: React.FC<QuickActionsProps> = ({ onQuickAction }) => {
  const quickActions = ['Edtech App', 'Health care portal', 'E-commerce Website'];

  return (
    <div className="flex gap-3 flex-wrap justify-center">
      {quickActions.map((action) => (
        <button
          key={action}
          onClick={() => onQuickAction(action)}
          className="px-4 py-2 border border-gray-300 rounded-full text-gray-700 hover:bg-gray-50 transition-colors"
        >
          {action}
        </button>
      ))}
    </div>
  );
};

export default QuickActions;