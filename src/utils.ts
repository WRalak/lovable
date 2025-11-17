// utils.ts
// utils.ts
import type { Message } from '../types';

export const truncateText = (text: string, maxLength: number): string => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

export const sampleCode = `import React, { useState } from 'react';

const App = () => {
  const [count, setCount] = useState(0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-8">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Your App</h1>
        <p className="text-gray-600 mb-6">This is your generated application</p>
        <div className="bg-blue-50 rounded-lg p-6 mb-6">
          <p className="text-4xl font-bold text-blue-600 text-center">{count}</p>
        </div>
        <button 
          onClick={() => setCount(count + 1)}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors"
        >
          Increment
        </button>
      </div>
    </div>
  );
};

export default App;`;

export const simulateApiCall = async (prompt: string): Promise<Message> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `I'll help you build ${prompt}. Here's your application:`,
        code: sampleCode,
        hasArtifact: true,
        timestamp: new Date()
      });
    }, 2000);
  });
};