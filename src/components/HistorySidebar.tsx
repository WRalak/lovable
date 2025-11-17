// components/HistorySidebar.tsx
import React from 'react';
import { X, MessageSquare, Pin, Share2, Trash2 } from 'lucide-react';
import type { Conversation } from '../../types';
import { truncateText } from '../utils';

interface HistorySidebarProps {
  showHistory: boolean;
  setShowHistory: (show: boolean) => void;
  conversations: Conversation[];
  onLoadConversation: (conversation: Conversation) => void;
  onDeleteConversation: (conversationId: string, e: React.MouseEvent) => void;
  onShareConversation: (conversationId: string, e: React.MouseEvent) => void;
  onTogglePinConversation: (conversationId: string, e: React.MouseEvent) => void;
}

const HistorySidebar: React.FC<HistorySidebarProps> = ({
  showHistory,
  setShowHistory,
  conversations,
  onLoadConversation,
  onDeleteConversation,
  onShareConversation,
  onTogglePinConversation,
}) => {
  if (!showHistory) return null;

  return (
    <div className="absolute left-0 top-0 bottom-0 w-80 bg-white border-r border-gray-200 z-20 overflow-y-auto">
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <h2 className="font-semibold text-gray-800">Project History</h2>
        <button
          onClick={() => setShowHistory(false)}
          className="p-1 hover:bg-gray-100 rounded transition-colors"
        >
          <X className="w-5 h-5 text-gray-600" />
        </button>
      </div>
      <div className="p-2">
        {conversations.length === 0 ? (
          <p className="text-center text-gray-500 py-8">No conversations yet</p>
        ) : (
          conversations.map((conv) => (
            <button
              key={conv.id}
              onClick={() => onLoadConversation(conv)}
              className="w-full text-left p-3 hover:bg-gray-100 rounded-lg transition-colors mb-1 group relative"
            >
              <div className="flex items-start gap-3">
                <MessageSquare className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    {conv.pinned && <Pin className="w-3 h-3 text-blue-500 fill-blue-500" />}
                    <p className="text-sm text-gray-800 font-medium truncate">
                      {truncateText(conv.title, 25)}
                    </p>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {conv.timestamp.toLocaleDateString()}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {conv.messages.length} messages
                  </p>
                </div>
              </div>
              
              <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 flex gap-1 transition-opacity">
                <button
                  onClick={(e) => onTogglePinConversation(conv.id, e)}
                  className={`p-1 rounded transition-colors ${
                    conv.pinned 
                      ? 'bg-blue-100 text-blue-600' 
                      : 'hover:bg-gray-200 text-gray-500'
                  }`}
                  title={conv.pinned ? 'Unpin' : 'Pin'}
                >
                  <Pin className="w-3 h-3" />
                </button>
                <button
                  onClick={(e) => onShareConversation(conv.id, e)}
                  className="p-1 hover:bg-gray-200 rounded transition-colors text-gray-500"
                  title="Share"
                >
                  <Share2 className="w-3 h-3" />
                </button>
                <button
                  onClick={(e) => onDeleteConversation(conv.id, e)}
                  className="p-1 hover:bg-red-100 rounded transition-colors text-gray-500 hover:text-red-600"
                  title="Delete"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
};

export default HistorySidebar;