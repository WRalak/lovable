import React from 'react';

interface QuickActionsProps {
  onQuickAction: (action: string) => void;
}

const QuickActions: React.FC<QuickActionsProps> = ({ onQuickAction }) => {
  const quickActions = [
    {
      icon: '🎓',
      title: 'EdTech App',
      prompt: 'Build an edtech app with video lessons, quizzes, and progress tracking using React and Tailwind CSS'
    },
    {
      icon: '🏥',
      title: 'Healthcare Portal',
      prompt: 'Create a healthcare portal for patient management with appointment scheduling and medical records'
    },
    {
      icon: '🛒',
      title: 'E-commerce Site',
      prompt: 'Develop an e-commerce website with product catalog, shopping cart, and payment integration'
    },
    {
      icon: '📝',
      title: 'Task Manager',
      prompt: 'Build a task manager app with drag-and-drop functionality, due dates, and categories'
    }
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl px-4">
      {quickActions.map((action) => (
        <button
          key={action.title}
          onClick={() => onQuickAction(action.prompt)}
          className="flex flex-col items-center p-6 border border-gray-200 rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 group"
        >
          <span className="text-2xl mb-3 group-hover:scale-110 transition-transform">{action.icon}</span>
          <span className="font-semibold text-gray-800 text-sm text-center">{action.title}</span>
        </button>
      ))}
    </div>
  );
};

export default QuickActions;