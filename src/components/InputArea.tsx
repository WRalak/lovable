import React from 'react';
import { Plus, Mic, ArrowRight, Clock, X, Image, FileText, Link, Code, Github } from 'lucide-react';
import type { Attachment } from '../../types';

interface InputAreaProps {
  input: string;
  setInput: (input: string) => void;
  attachments: Attachment[];
  setAttachments: (attachments: Attachment[]) => void;
  showAttachModal: boolean;
  setShowAttachModal: (show: boolean) => void;
  isRecording: boolean;
  setIsRecording: (recording: boolean) => void;
  htmlInput: string;
  setHtmlInput: (input: string) => void;
  showHtmlInput: boolean;
  setShowHtmlInput: (show: boolean) => void;
  isLoading: boolean;
  onSend: () => void;
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  isHome: boolean;
  onShowHistory: () => void;
  onCopyCode: () => void;
  onSaveToGithub: () => void;
}

const InputArea: React.FC<InputAreaProps> = ({
  input,
  setInput,
  attachments,
  setAttachments,
  showAttachModal,
  setShowAttachModal,
  isRecording,
  setIsRecording,
  htmlInput,
  setHtmlInput,
  showHtmlInput,
  setShowHtmlInput,
  isLoading,
  onSend,
  textareaRef,
  fileInputRef,
  isHome,
  onShowHistory,
  onCopyCode,
  onSaveToGithub,
}) => {
  const quickActions = ['Edtech App', 'Health care portal', 'E-commerce Website'];
  const attachmentOptions = [
    { icon: Image, label: 'Upload Image', type: 'image' },
    { icon: FileText, label: 'Upload PDF', type: 'file' },
    { icon: FileText, label: 'Upload DOCS', type: 'file' },
    { icon: Link, label: 'Add HTML', type: 'link' }
  ];

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const newAttachment: Attachment = {
          id: Date.now().toString(),
          name: file.name,
          type: file.type.startsWith('image/') ? 'image' : 'file',
          content: e.target?.result as string
        };
        setAttachments([...attachments, newAttachment]);
      };
      reader.readAsDataURL(file);
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setShowAttachModal(false);
  };

  const handleHtmlSubmit = () => {
    if (htmlInput.trim()) {
      const newAttachment: Attachment = {
        id: Date.now().toString(),
        name: 'HTML Content',
        type: 'link',
        content: htmlInput
      };
      setAttachments([...attachments, newAttachment]);
      setHtmlInput('');
      setShowHtmlInput(false);
      setShowAttachModal(false);
    }
  };

  const removeAttachment = (id: string) => {
    setAttachments(attachments.filter(att => att.id !== id));
  };

  const handleQuickAction = (action: string) => {
    setInput(`Build a ${action}`);
  };

  const toggleRecording = () => {
    // Speech recognition implementation
    setIsRecording(!isRecording);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  const renderAttachment = (attachment: Attachment) => {
    const Icon = attachment.type === 'image' ? Image : 
                 attachment.type === 'file' ? FileText : Link;
    
    return (
      <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-2">
        <Icon className="w-4 h-4 text-gray-600" />
        <span className="text-sm text-gray-700 truncate">
          {attachment.type === 'link' ? 'HTML Content' : attachment.name}
        </span>
        <button
          onClick={() => removeAttachment(attachment.id)}
          className="p-1 hover:bg-gray-200 rounded"
        >
          <X className="w-3 h-3 text-gray-500" />
        </button>
      </div>
    );
  };

  return (
    <div className="p-4 sm:p-6 border-t border-gray-200 bg-white">
      <div className="flex justify-center">
        <div 
          className="relative bg-white border border-gray-900 rounded-3xl shadow-sm w-full max-w-2xl"
          style={{ minHeight: '120px', padding: '16px' }}
        >
          {attachments.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {attachments.map(attachment => renderAttachment(attachment))}
            </div>
          )}

          <div className="flex items-start gap-3">
            <button
              onClick={() => setShowAttachModal(!showAttachModal)}
              className="p-1 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0 mt-1"
            >
              <Plus className="w-5 h-5 text-gray-900" />
            </button>

            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask Aiden"
              className="flex-1 resize-none outline-none text-gray-900 placeholder-gray-400 text-base max-h-32"
              rows={1}
              style={{ minHeight: '24px' }}
            />

            <div className="flex gap-2 flex-shrink-0">
              <button
                onClick={toggleRecording}
                className={`p-1 hover:bg-gray-100 rounded-lg transition-colors ${isRecording ? 'text-red-500' : 'text-gray-900'} mt-1`}
              >
                <Mic className="w-5 h-5" />
              </button>

              <button
                onClick={onSend}
                disabled={(!input.trim() && attachments.length === 0) || isLoading}
                className={`p-2 rounded-lg transition-colors mt-1 ${
                  (input.trim() || attachments.length > 0) && !isLoading
                    ? 'bg-black text-white hover:bg-gray-800' 
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="flex gap-2 flex-wrap pt-3 border-t border-gray-200 mt-3">
            {isHome ? (
              quickActions.map((action) => (
                <button
                  key={action}
                  onClick={() => handleQuickAction(action)}
                  className="px-3 py-1.5 border border-gray-900 rounded-full text-sm text-gray-900 hover:bg-gray-50 transition-colors"
                >
                  {action}
                </button>
              ))
            ) : (
              <>
                <button
                  onClick={() => setShowAttachModal(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-full text-xs text-gray-700 transition-colors"
                >
                  <Plus className="w-3 h-3" />
                  Add
                </button>
                <button
                  onClick={onCopyCode}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-full text-xs text-gray-700 transition-colors"
                >
                  <Code className="w-3 h-3" />
                  Copy Code
                </button>
                <button
                  onClick={onSaveToGithub}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-full text-xs text-gray-700 transition-colors"
                >
                  <Github className="w-3 h-3" />
                  Save to GitHub
                </button>
              </>
            )}
          </div>

          {showAttachModal && (
            <div className="absolute bottom-full left-0 mb-2 bg-white border border-gray-900 rounded-xl shadow-lg p-2 z-10 min-w-48">
              <div className="flex flex-col gap-1">
                {attachmentOptions.map((option) => (
                  <button
                    key={option.type}
                    onClick={() => {
                      if (option.type === 'link') {
                        setShowHtmlInput(true);
                      } else if (option.type === 'image' || option.type === 'file') {
                        fileInputRef.current?.click();
                      }
                    }}
                    className="flex items-center gap-3 px-4 py-3 border hover:bg-gray-100 rounded-lg transition-colors text-left whitespace-nowrap"
                  >
                    <option.icon className="w-5 h-5 text-gray-600" />
                    <span className="text-sm text-gray-900">{option.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            multiple
            accept="image/*,.pdf,.doc,.docx,.txt"
            onChange={handleFileUpload}
          />

          {showHtmlInput && (
            <div className="absolute bottom-full left-0 mb-2 bg-white border border-gray-900 rounded-xl shadow-lg p-4 z-20 w-full max-w-sm sm:max-w-md">
              <div className="flex flex-col gap-3">
                <h3 className="font-semibold text-gray-800">Add HTML Content</h3>
                <textarea
                  value={htmlInput}
                  onChange={(e) => setHtmlInput(e.target.value)}
                  placeholder="Paste your HTML code here..."
                  className="w-full h-32 border border-gray-300 rounded-lg p-3 text-sm resize-none outline-none focus:border-blue-500"
                />
                <div className="flex gap-2 justify-end">
                  <button
                    onClick={() => setShowHtmlInput(false)}
                    className="px-3 py-1.5 bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleHtmlSubmit}
                    disabled={!htmlInput.trim()}
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    Add HTML
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-center mt-4">
        <button 
          onClick={onShowHistory}
          className="flex items-center gap-2 border-2 border-gray-900 rounded-2xl px-4 py-2 text-sm text-gray-900 hover:bg-gray-50 transition-colors"
        >
          <Clock className="w-4 h-4" />
          Project History
        </button>
      </div>
    </div>
  );
};

export default InputArea;