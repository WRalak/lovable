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
      // Determine if this should return code or just text
      const shouldReturnCode = prompt.toLowerCase().includes('build') || 
                              prompt.toLowerCase().includes('create') ||
                              prompt.toLowerCase().includes('app') ||
                              prompt.toLowerCase().includes('website') ||
                              prompt.toLowerCase().includes('develop');

      if (shouldReturnCode) {
        resolve({
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: `I'll help you build "${prompt}". Here's the React application I've created for you:\n\nThis is a fully functional React component with Tailwind CSS styling. You can customize it further based on your specific requirements.`,
          code: sampleCode,
          hasArtifact: true,
          timestamp: new Date()
        });
      } else {
        resolve({
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: `I understand you're asking about "${prompt}". \n\nI can help you build various types of applications including:\n• Web applications with React and Tailwind CSS\n• Mobile-responsive designs\n• Interactive UI components\n• Database integrations\n• API connections\n\nCould you provide more specific details about what you'd like me to create?`,
          timestamp: new Date()
        });
      }
    }, 2000);
  });
};

// API endpoints - uncomment and modify when backend is ready
/*
export const apiEndpoints = {
  // Send chat message
  chat: '/api/chat',
  
  // Get conversation history
  conversations: '/api/conversations',
  
  // Get specific conversation
  conversation: (id: string) => `/api/conversations/${id}`,
  
  // Delete conversation
  deleteConversation: (id: string) => `/api/conversations/${id}`,
  
  // Update conversation (pin, title, etc.)
  updateConversation: (id: string) => `/api/conversations/${id}`,
  
  // Upload files
  upload: '/api/upload',
  
  // Generate code from prompt
  generateCode: '/api/generate-code',
  
  // Save to GitHub
  saveToGithub: '/api/github/save',
  
  // Preview application
  preview: '/api/preview'
};

// Example API call functions
export const apiCalls = {
  async sendMessage(message: string, attachments: any[] = [], conversationId?: string) {
    const response = await fetch(apiEndpoints.chat, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        attachments,
        conversationId,
        timestamp: new Date().toISOString()
      })
    });
    
    if (!response.ok) throw new Error('Failed to send message');
    return response.json();
  },
  
  async getConversations() {
    const response = await fetch(apiEndpoints.conversations);
    if (!response.ok) throw new Error('Failed to fetch conversations');
    return response.json();
  },
  
  async deleteConversation(id: string) {
    const response = await fetch(apiEndpoints.deleteConversation(id), {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error('Failed to delete conversation');
    return response.json();
  },
  
  async uploadFile(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await fetch(apiEndpoints.upload, {
      method: 'POST',
      body: formData
    });
    
    if (!response.ok) throw new Error('Failed to upload file');
    return response.json();
  }
};
*/