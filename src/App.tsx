import React, { useState, useRef, useEffect } from 'react';
import { toast } from 'react-toastify';
import type { Conversation, Message, Attachment } from '../types';
import { sampleCode, simulateApiCall } from './utils';
import Header from './components/Header';
import HistorySidebar from './components/HistorySidebar';
import MessagesArea from './components/MessagesArea';
import InputArea from './components/InputArea';
import PreviewArea from './components/PreviewArea';
import ProjectHistory from './components/ProjectHistory';

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
  const [showProjects, setShowProjects] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [user, setUser] = useState(null);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  const isHome = !currentConversation && !currentArtifact;

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

  // Load conversations from localStorage on component mount
  useEffect(() => {
    const savedConversations = localStorage.getItem('aiden-conversations');
    if (savedConversations) {
      try {
        const parsedConversations = JSON.parse(savedConversations);
        setConversations(parsedConversations.map((conv: any) => ({
          ...conv,
          timestamp: new Date(conv.timestamp),
          messages: conv.messages.map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp)
          }))
        })));
      } catch (error) {
        console.error('Error loading conversations from localStorage:', error);
      }
    }
  }, []);

  // Save conversations to localStorage whenever conversations change
  useEffect(() => {
    localStorage.setItem('aiden-conversations', JSON.stringify(conversations));
  }, [conversations]);

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
      // Using mock API for demonstration
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
          title: input.split('\n')[0].substring(0, 30) || 'Untitled Conversation',
          messages: [userMessage, assistantMessage],
          timestamp: new Date()
        };
        setCurrentConversation(newConversation);
        setConversations([newConversation, ...conversations]);
      }

      if (assistantMessage.code) {
        setCurrentArtifact(assistantMessage.code);
      }
      
    } catch (error) {
      console.error('Error sending message:', error);
      // Fallback to mock response if API fails
      const fallbackMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `I'll help you build "${input}". Here's what I can create for you:`,
        code: sampleCode,
        hasArtifact: true,
        timestamp: new Date()
      };

      if (currentConversation) {
        const updatedConversation = {
          ...currentConversation,
          messages: [...currentConversation.messages, userMessage, fallbackMessage],
          timestamp: new Date()
        };
        setCurrentConversation(updatedConversation);
        setConversations(conversations.map(c => c.id === updatedConversation.id ? updatedConversation : c));
      } else {
        const newConversation: Conversation = {
          id: Date.now().toString(),
          title: input.split('\n')[0].substring(0, 30) || 'Untitled Conversation',
          messages: [userMessage, fallbackMessage],
          timestamp: new Date()
        };
        setCurrentConversation(newConversation);
        setConversations([newConversation, ...conversations]);
      }

      setCurrentArtifact(sampleCode);
    } finally {
      setIsLoading(false);
      setInput('');
      setAttachments([]);
      setViewMode('preview');
    }
  };

  const closePreview = () => {
    setCurrentArtifact(null);
    setCurrentConversation(null); // Reset to home page
  };

  const loadConversation = (conversation: Conversation) => {
    setCurrentConversation(conversation);
    setShowHistory(false);
    const lastMessage = conversation.messages[conversation.messages.length - 1];
    if (lastMessage.hasArtifact && lastMessage.code) {
      setCurrentArtifact(lastMessage.code);
      setViewMode('preview');
    } else {
      setCurrentArtifact(null);
    }
  };

  const startNewConversation = () => {
    console.log('startNewConversation called'); // Debug log
    // Temporary: Skip user check for development
    // if (!user) {
    //   setShowLoginModal(true);
    //   return;
    // }
    setCurrentConversation(null);
    setCurrentArtifact(null);
    setInput('');
    setShowHistory(false);
    setShowProjects(false);
    toast.info('Started new conversation');
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
    toast.info(`Share conversation ${conversationId} - This would open share dialog`);
  };

  const togglePinConversation = (conversationId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setConversations(conversations.map(conv => 
      conv.id === conversationId ? { ...conv, pinned: !conv.pinned } : conv
    ));
  };

  const startEditingMessage = (messageId: string, content: string) => {
    setEditingMessageId(messageId);
    setEditedContent(content);
  };

  const saveEditedMessage = async (messageId: string) => {
    if (!currentConversation) return;

    const updatedMessages = currentConversation.messages.map(msg => 
      msg.id === messageId ? { ...msg, content: editedContent } : msg
    );

    const updatedConversation = {
      ...currentConversation,
      messages: updatedMessages,
      timestamp: new Date()
    };

    setCurrentConversation(updatedConversation);
    setConversations(conversations.map(c => c.id === updatedConversation.id ? updatedConversation : c));
    setEditingMessageId(null);
    setEditedContent('');
  };

  const cancelEditing = () => {
    setEditingMessageId(null);
    setEditedContent('');
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
        onNewConversation={startNewConversation}
      />

      <ProjectHistory
        showProjects={showProjects}
        setShowProjects={setShowProjects}
        conversations={sortedConversations}
        onLoadConversation={loadConversation}
        onDeleteConversation={deleteConversation}
        onShareConversation={shareConversation}
        onTogglePinConversation={togglePinConversation}
        onNewConversation={startNewConversation}
      />

      <div className="flex-1 flex overflow-hidden">
        {/* Left Side - Chat Area */}
        <div className={`flex flex-col ${currentArtifact ? 'w-1/2' : 'w-full'} transition-all duration-300`}>
          {currentConversation && (
            <Header 
              title={currentConversation.title} 
              onNewConversation={startNewConversation}
            />
          )}

          {isHome && (
            <div className="flex-1 flex flex-col items-center justify-center px-4 py-8">
              <div className="text-center mb-8">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-gray-800 mb-4">
                  Hi, I'm Aiden. <br />
                  What can I help you build today?
                </h1>
              </div>
            </div>
          )}

          {currentConversation && (
            <MessagesArea
              messages={currentConversation.messages}
              isLoading={isLoading}
              editingMessageId={editingMessageId}
              editedContent={editedContent}
              onStartEditing={startEditingMessage}
              onSaveEditing={saveEditedMessage}
              onCancelEditing={cancelEditing}
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
            onShowProjects={() => setShowProjects(true)}
            onNewConversation={startNewConversation}
            textareaRef={textareaRef}
            fileInputRef={fileInputRef}
            isHome={isHome}
            onShowHistory={() => setShowHistory(true)}
            onCopyCode={() => {
              if (currentArtifact) {
                navigator.clipboard.writeText(currentArtifact);
                toast.success('Code copied to clipboard!');
              }
            }}
            onSaveToGithub={() => toast.info('Save to GitHub functionality')}
            recognitionRef={recognitionRef}
          />
        </div>

        {/* Right Side - Preview Area */}
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