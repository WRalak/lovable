import React, { useState, useEffect } from 'react';
import { X, MessageSquare, Pin, Share2, Trash2, Plus, MoreVertical } from 'lucide-react';
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
  onNewConversation: () => void;
}

const HistorySidebar: React.FC<HistorySidebarProps> = ({
  showHistory,
  setShowHistory,
  conversations,
  onLoadConversation,
  onDeleteConversation,
  onShareConversation,
  onTogglePinConversation,
  onNewConversation,
}) => {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setActiveMenu(null);
    };

    if (activeMenu) {
      document.addEventListener('click', handleClickOutside);
      return () => {
        document.removeEventListener('click', handleClickOutside);
      };
    }
  }, [activeMenu]);

  if (!showHistory) return null;

  const handleConversationClick = (conversation: Conversation) => {
    onLoadConversation(conversation);
    setActiveMenu(null);
  };

  const handleDelete = (conversationId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onDeleteConversation(conversationId, e);
    setActiveMenu(null);
  };

  const handleShare = (conversationId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onShareConversation(conversationId, e);
    setActiveMenu(null);
  };

  const handleTogglePin = (conversationId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onTogglePinConversation(conversationId, e);
    setActiveMenu(null);
  };

  const toggleMenu = (conversationId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveMenu(activeMenu === conversationId ? null : conversationId);
  };

  return (
    <div className="absolute left-0 top-0 bottom-0 w-80 bg-white border-r border-gray-200 z-20 overflow-y-auto">
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <h2 className="font-semibold text-gray-800">Conversation History</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={onNewConversation}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title="New Conversation"
          >
            <Plus className="w-5 h-5 text-gray-600" />
          </button>
          <button
            onClick={() => setShowHistory(false)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>
      
      <div className="p-2">
        {conversations.length === 0 ? (
          <div className="text-center py-8">
            <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No conversations yet</p>
            <p className="text-sm text-gray-400 mt-1">Start a new conversation to see it here</p>
          </div>
        ) : (
          conversations.map((conv) => (
            <div
              key={conv.id}
              className="relative group mb-2"
            >
              <button
                onClick={() => handleConversationClick(conv)}
                className="w-full text-left p-3 hover:bg-gray-100 rounded-lg transition-colors border border-transparent hover:border-gray-200"
              >
                <div className="flex items-start gap-3">
                  <MessageSquare className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      {conv.pinned && <Pin className="w-3 h-3 text-blue-500 fill-blue-500" />}
                      <p className="text-sm text-gray-800 font-medium truncate">
                        {conv.title}
                      </p>
                    </div>
                    <p className="text-xs text-gray-500 mb-1">
                      {conv.timestamp.toLocaleDateString()} at {conv.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                    {conv.messages.length > 0 && (
                      <p className="text-xs text-gray-400 truncate">
                        {truncateText(conv.messages[0].content, 80)}
                      </p>
                    )}
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-gray-400">
                        {conv.messages.length} message{conv.messages.length !== 1 ? 's' : ''}
                      </span>
                      {conv.messages.some(m => m.hasArtifact) && (
                        <span className="text-xs text-blue-500 bg-blue-50 px-1 rounded">
                          Has Code
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </button>
              
              {/* Menu button */}
              <button
                onClick={(e) => toggleMenu(conv.id, e)}
                className="absolute right-2 top-2 p-1 hover:bg-gray-200 rounded transition-colors text-gray-500"
              >
                <MoreVertical className="w-4 h-4" />
              </button>

              {/* Dropdown menu */}
              {activeMenu === conv.id && (
                <div className="absolute right-2 top-8 bg-white border border-gray-200 rounded-lg shadow-lg z-10 py-1 min-w-32">
                  <button
                    onClick={(e) => handleTogglePin(conv.id, e)}
                    className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    <Pin className="w-4 h-4" />
                    {conv.pinned ? 'Unpin' : 'Pin'}
                  </button>
                  <button
                    onClick={(e) => handleShare(conv.id, e)}
                    className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    <Share2 className="w-4 h-4" />
                    Share
                  </button>
                  <button
                    onClick={(e) => handleDelete(conv.id, e)}
                    className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default HistorySidebar;