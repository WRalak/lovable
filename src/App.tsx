import React, { useState, useRef, useEffect } from 'react';
import type { Conversation, Message, Attachment } from '../types';
import { sampleCode, simulateApiCall, truncateText } from '../src/utils';
import Header from '../src/components/Header';
import HistorySidebar from '../src/components/HistorySidebar';
import MessagesArea from '../src/components/MessagesArea';
import InputArea from '../src/components/InputArea';
import PreviewArea from '../src/components/PreviewArea';
import QuickActions from '../src/components/QuickActions';

const AidenAppBuilder: React.FC = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null);
  const [input, setInput] = useState('');
  const [showAttachModal, setShowAttachModal] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [currentArtifact, setCurrentArtifact] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'preview' | 'code'>('preview');
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editedContent, setEditedContent] = useState('');
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [htmlInput, setHtmlInput] = useState('');
  const [showHtmlInput, setShowHtmlInput] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const isHome = !currentConversation;

  // Auto-expand textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 150) + 'px';
    }
  }, [input]);

  // Scroll to bottom when new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentConversation?.messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() && attachments.length === 0) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      attachments: [...attachments],
      timestamp: new Date()
    };

    setIsLoading(true);

    try {
      const assistantMessage = await simulateApiCall(input);

      if (currentConversation) {
        const updatedConversation = {
          ...currentConversation,
          messages: [...currentConversation.messages, userMessage, assistantMessage],
          timestamp: new Date()
        };
        setCurrentConversation(updatedConversation);
        setConversations(conversations.map(c => c.id === updatedConversation.id ? updatedConversation : c));
      } else {
        const newConversation: Conversation = {
          id: Date.now().toString(),
          title: truncateText(input, 30) || 'Untitled Conversation',
          messages: [userMessage, assistantMessage],
          timestamp: new Date()
        };
        setCurrentConversation(newConversation);
        setConversations([newConversation, ...conversations]);
      }

      setCurrentArtifact(sampleCode);
      
    } catch (error) {
      console.error('Error sending message:', error);
      // Fallback handling...
    } finally {
      setIsLoading(false);
      setInput('');
      setAttachments([]);
      setViewMode('preview');
    }
  };

  const closePreview = () => {
    setCurrentArtifact(null);
    setCurrentConversation(null);
  };

  const loadConversation = (conversation: Conversation) => {
    setCurrentConversation(conversation);
    setShowHistory(false);
    const lastMessage = conversation.messages[conversation.messages.length - 1];
    if (lastMessage.hasArtifact && lastMessage.code) {
      setCurrentArtifact(lastMessage.code);
      setViewMode('preview');
    }
  };

  const deleteConversation = (conversationId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setConversations(conversations.filter(c => c.id !== conversationId));
    if (currentConversation?.id === conversationId) {
      setCurrentConversation(null);
      setCurrentArtifact(null);
    }
  };

  const shareConversation = (conversationId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    alert(`Share conversation ${conversationId} - This would open share dialog`);
  };

  const togglePinConversation = (conversationId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setConversations(conversations.map(conv => 
      conv.id === conversationId ? { ...conv, pinned: !conv.pinned } : conv
    ));
  };

  // Sort conversations: pinned first, then by timestamp
  const sortedConversations = [...conversations].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
  });

  return (
    <div className="h-screen flex flex-col bg-white relative">
      <HistorySidebar
        showHistory={showHistory}
        setShowHistory={setShowHistory}
        conversations={sortedConversations}
        onLoadConversation={loadConversation}
        onDeleteConversation={deleteConversation}
        onShareConversation={shareConversation}
        onTogglePinConversation={togglePinConversation}
      />

      <div className="flex-1 flex overflow-hidden">
        <div className={`flex flex-col ${currentArtifact ? 'w-1/2' : 'w-full'} transition-all duration-300`}>
          {!isHome && currentConversation && (
            <Header title={currentConversation.title} />
          )}

          {isHome && (
            <div className="flex-1 flex flex-col items-center justify-center px-4 py-8 sm:py-0">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-gray-800 mb-4 sm:mb-6 text-center">
                Hi, I'm Aiden.<br />What can I help you build today?
              </h1>
             
            </div>
          )}

          {!isHome && currentConversation && (
            <MessagesArea
              messages={currentConversation.messages}
              isLoading={isLoading}
              editingMessageId={editingMessageId}
              editedContent={editedContent}
              onStartEditing={setEditingMessageId}
              onSaveEditing={() => {}} // Implement as needed
              onCancelEditing={() => setEditingMessageId(null)}
              onSetEditedContent={setEditedContent}
              messagesEndRef={messagesEndRef}
            />
          )}

          <InputArea
            input={input}
            setInput={setInput}
            attachments={attachments}
            setAttachments={setAttachments}
            showAttachModal={showAttachModal}
            setShowAttachModal={setShowAttachModal}
            isRecording={isRecording}
            setIsRecording={setIsRecording}
            htmlInput={htmlInput}
            setHtmlInput={setHtmlInput}
            showHtmlInput={showHtmlInput}
            setShowHtmlInput={setShowHtmlInput}
            isLoading={isLoading}
            onSend={handleSend}
            textareaRef={textareaRef}
            fileInputRef={fileInputRef}
            isHome={isHome}
            onShowHistory={() => setShowHistory(true)}
            onCopyCode={() => {
              if (currentArtifact) {
                navigator.clipboard.writeText(currentArtifact);
                alert('Code copied to clipboard!');
              }
            }}
            onSaveToGithub={() => alert('Save to GitHub functionality')}
          />
        </div>

        {currentArtifact && (
          <PreviewArea
            currentArtifact={currentArtifact}
            viewMode={viewMode}
            setViewMode={setViewMode}
            onClose={closePreview}
          />
        )}
      </div>
    </div>
  );
};

export default AidenAppBuilder;
