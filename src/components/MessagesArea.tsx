import React from 'react';
import { Edit2, Image, FileText, Link, X, Check } from 'lucide-react';
import type { Message, Attachment } from '../../types';
import { truncateText } from '../utils';

interface MessagesAreaProps {
  messages: Message[];
  isLoading: boolean;
  editingMessageId: string | null;
  editedContent: string;
  onStartEditing: (messageId: string, content: string) => void;
  onSaveEditing: (messageId: string) => void;
  onCancelEditing: () => void;
  onSetEditedContent: (content: string) => void;
  messagesEndRef: React.RefObject<HTMLDivElement>;
}

const MessagesArea: React.FC<MessagesAreaProps> = ({
  messages,
  isLoading,
  editingMessageId,
  editedContent,
  onStartEditing,
  onSaveEditing,
  onCancelEditing,
  onSetEditedContent,
  messagesEndRef,
}) => {
  const renderAttachment = (attachment: Attachment) => {
    const Icon = attachment.type === 'image' ? Image : 
                 attachment.type === 'file' ? FileText : Link;
    
    return (
      <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-2">
        <Icon className="w-4 h-4 text-gray-600" />
        <span className="text-sm text-gray-700 truncate">
          {attachment.type === 'link' ? 'HTML Content' : attachment.name}
        </span>
        <button className="p-1 hover:bg-gray-200 rounded">
          <X className="w-3 h-3 text-gray-500" />
        </button>
      </div>
    );
  };

  return (
    <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 sm:py-8">
      {messages.map((message) => (
        <div key={message.id} className={`mb-4 sm:mb-6 ${message.role === 'user' ? 'flex justify-end' : 'flex justify-start'}`}>
          {editingMessageId === message.id ? (
            <div className="max-w-full sm:max-w-3xl w-full">
              <textarea
                value={editedContent}
                onChange={(e) => onSetEditedContent(e.target.value)}
                className="w-full border-2 border-blue-500 rounded-2xl px-4 sm:px-5 py-3 text-gray-800 resize-none outline-none"
                rows={3}
                autoFocus
              />
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => onSaveEditing(message.id)}
                  className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors"
                >
                  <Check className="w-4 h-4" />
                  Save & Submit
                </button>
                <button
                  onClick={onCancelEditing}
                  className="px-3 py-1.5 bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="group relative max-w-full sm:max-w-3xl">
              <div className={`${message.role === 'user' ? 'bg-black text-white' : 'bg-gray-100 text-gray-800'} rounded-2xl px-4 sm:px-5 py-3`}>
                <p className="whitespace-pre-wrap break-words text-sm sm:text-base">
                  {message.content}
                </p>
                
                {message.attachments && message.attachments.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {message.attachments.map(attachment => renderAttachment(attachment))}
                  </div>
                )}
              </div>
              {message.role === 'user' && (
                <button
                  onClick={() => onStartEditing(message.id, message.content)}
                  className="absolute top-2 -left-8 opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-100 rounded transition-all"
                  title="Edit message"
                >
                  <Edit2 className="w-4 h-4 text-gray-500" />
                </button>
              )}
            </div>
          )}
        </div>
      ))}
      
      {isLoading && (
        <div className="flex justify-start mb-6">
          <div className="max-w-3xl bg-gray-100 text-gray-800 rounded-2xl px-5 py-3">
            <div className="flex items-center gap-2">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
              <span className="text-sm text-gray-600">Aiden is thinking...</span>
            </div>
          </div>
        </div>
      )}
      
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessagesArea;