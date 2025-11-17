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
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Welcome to Your App</h1>
        <p className="text-gray-600 mb-6">This is a sample application I created for you</p>
        <div className="bg-blue-50 rounded-lg p-6 mb-6">
          <p className="text-4xl font-bold text-blue-600 text-center">{count}</p>
        </div>
        <button 
          onClick={() => setCount(count + 1)}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors"
        >
          Increment Counter
        </button>
      </div>
    </div>
  );
};

export default App;`;

// List of topics that should receive a polite decline response
const restrictedTopics = [
  'harmful', 'dangerous', 'illegal', 'malicious', 'hack', 'cheat',
  'exploit', 'virus', 'malware', 'phishing', 'spam', 'fraud',
  'discriminatory', 'hate speech', 'harassment', 'bullying'
];

// Check if prompt contains restricted content
const containsRestrictedContent = (prompt: string): boolean => {
  const lowerPrompt = prompt.toLowerCase();
  return restrictedTopics.some(topic => lowerPrompt.includes(topic));
};

export const simulateApiCall = async (prompt: string): Promise<Message> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Check for restricted content first
      if (containsRestrictedContent(prompt)) {
        resolve({
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: `I appreciate your question, but I'm designed to focus on creating positive, constructive applications and providing helpful information. I'm not able to assist with requests that could potentially be harmful or unethical.\n\nI'd be happy to help you build something creative, educational, or productive instead! Could you tell me more about what kind of positive application you'd like to create?`,
          timestamp: new Date()
        });
        return;
      }

      // Determine if this should return code or just text
      const shouldReturnCode = prompt.toLowerCase().includes('build') || 
                              prompt.toLowerCase().includes('create') ||
                              prompt.toLowerCase().includes('app') ||
                              prompt.toLowerCase().includes('website') ||
                              prompt.toLowerCase().includes('develop') ||
                              prompt.toLowerCase().includes('make');

      if (shouldReturnCode) {
        resolve({
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: `I'd be happy to help you create "${prompt}"! I've put together a React application as a starting point. This is a fully functional component with Tailwind CSS styling that you can customize to fit your exact needs.\n\nWhat specific features or design elements would you like me to adjust to make this perfect for your project?`,
          code: sampleCode,
          hasArtifact: true,
          timestamp: new Date()
        });
      } else {
        resolve({
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: `Thank you for your question about "${prompt}".\n\nI specialize in helping create various types of applications including:\n• Web applications with React and Tailwind CSS\n• Mobile-responsive designs that work on all devices\n• Interactive user interface components\n• Educational and productivity tools\n• Creative projects and prototypes\n\nTo help you best, could you share more details about what you'd like me to build? The more specific you can be, the better I can assist you in creating something wonderful!`,
          timestamp: new Date()
        });
      }
    }, 2000);
  });
};

// Enhanced version with more specific guidance
export const getHelpfulResponse = (prompt: string): Partial<Message> => {
  const lowerPrompt = prompt.toLowerCase();
  
  // Greeting responses
  if (lowerPrompt.match(/(hi|hello|hey|greetings)/)) {
    return {
      content: "Hello! I'm Aiden, your AI development assistant. I'm here to help you build amazing applications and bring your ideas to life. What would you like to create today?"
    };
  }
  
  // Help requests
  if (lowerPrompt.includes('help') || lowerPrompt.includes('what can you do')) {
    return {
      content: `I'd be delighted to help! I can assist you with:\n\n🎨 **Building Applications**\n• Create React components with Tailwind CSS\n• Design responsive web applications\n• Build interactive user interfaces\n• Develop prototypes and MVPs\n\n💡 **Guidance & Best Practices**\n• Code structure and organization\n• UI/UX design principles\n• Performance optimization\n• Modern development workflows\n\n🚀 **Features**\n• Real-time code preview\n• GitHub integration\n• Project history management\n• Collaborative sharing\n\nWhat would you like to start with?`
    };
  }
  
  // Thank you responses
  if (lowerPrompt.match(/(thanks|thank you|appreciate)/)) {
    return {
      content: "You're very welcome! I'm glad I could help. If you have any more questions or want to continue building, just let me know. I'm here to support your development journey! 🚀"
    };
  }
  
  return {};
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