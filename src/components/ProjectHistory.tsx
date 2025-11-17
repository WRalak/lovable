import React, { useState, useEffect } from 'react';
import { X, Folder, MoreVertical, Pin, Share2, Trash2, Eye, Download } from 'lucide-react';
import type { Conversation } from '../../types';
import { truncateText } from '../utils';

interface ProjectHistoryProps {
  showProjects: boolean;
  setShowProjects: (show: boolean) => void;
  conversations: Conversation[];
  onLoadConversation: (conversation: Conversation) => void;
  onDeleteConversation: (conversationId: string, e: React.MouseEvent) => void;
  onShareConversation: (conversationId: string, e: React.MouseEvent) => void;
  onTogglePinConversation: (conversationId: string, e: React.MouseEvent) => void;
  onNewConversation: () => void;
}

const ProjectHistory: React.FC<ProjectHistoryProps> = ({
  showProjects,
  setShowProjects,
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

  if (!showProjects) return null;

  const handleProjectClick = (conversation: Conversation) => {
    onLoadConversation(conversation);
    setActiveMenu(null);
    setShowProjects(false); // Close projects view when opening a project
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

  const getProjectPreview = (conversation: Conversation) => {
    // Get the first code artifact or return a default preview
    const codeMessage = conversation.messages.find((msg) => msg.hasArtifact && msg.code);
    if (codeMessage?.code) {
      return {
        hasCode: true,
        preview: truncateText(codeMessage.code, 100)
      };
    }
    return {
      hasCode: false,
      preview: truncateText(conversation.messages[0]?.content || 'No content', 100)
    };
  };

  const getProjectColor = (id: string) => {
    const colors = [
      'bg-gradient-to-br from-blue-500 to-blue-600',
      'bg-gradient-to-br from-green-500 to-green-600',
      'bg-gradient-to-br from-purple-500 to-purple-600',
      'bg-gradient-to-br from-orange-500 to-orange-600',
      'bg-gradient-to-br from-pink-500 to-pink-600',
      'bg-gradient-to-br from-indigo-500 to-indigo-600'
    ];
    // eslint-disable-next-line react-hooks/purity
    const index = parseInt(id) % colors.length || Math.floor(Math.random() * colors.length);
    return colors[index];
  };

  const handleNewProject = () => {
    onNewConversation();
    setShowProjects(false); // Close projects view when creating new project
  };

  return (
    <div className="absolute inset-0 bg-white z-20 overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Project History</h2>
            <p className="text-gray-600 mt-1">Your saved projects and conversations</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleNewProject}
              className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg transition-colors"
            >
              <Folder className="w-4 h-4" />
              New Project
            </button>
            <button
              onClick={() => setShowProjects(false)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="p-6">
        {conversations.length === 0 ? (
          <div className="text-center py-16">
            <Folder className="w-24 h-24 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No projects yet</h3>
            <p className="text-gray-500 mb-6">Start a new conversation to create your first project</p>
            <button
              onClick={handleNewProject}
              className="px-6 py-3 bg-black text-white rounded-lg transition-colors"
            >
              Create Your First Project
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {conversations.map((conv) => {
              const projectPreview = getProjectPreview(conv);
              const projectColor = getProjectColor(conv.id);
              
              return (
                <div
                  key={conv.id}
                  className="group relative bg-white border border-gray-200 rounded-xl hover:shadow-lg transition-all duration-200 overflow-hidden"
                >
                  {/* Project Card */}
                  <div className="flex flex-col h-full">
                    {/* Project Preview/Thumbnail */}
                    <div 
                      className="relative h-32 cursor-pointer"
                      onClick={() => handleProjectClick(conv)}
                    >
                      <div className={`absolute inset-0 ${projectColor} flex items-center justify-center`}>
                        <Folder className="w-12 h-12 text-white opacity-80" />
                      </div>
                      
                      {/* Pinned Badge */}
                      {conv.pinned && (
                        <div className="absolute top-2 left-2 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                          <Pin className="w-3 h-3 fill-current" />
                          Pinned
                        </div>
                      )}

                      {/* Code Badge */}
                      {projectPreview.hasCode && (
                        <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                          Code
                        </div>
                      )}

                      {/* Hover Overlay */}
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center">
                        <Eye className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                      </div>
                    </div>

                    {/* Project Info */}
                    <div className="p-4 flex-1 flex flex-col">
                      <div className="flex-1">
                        <h3 
                          className="font-semibold text-gray-800 mb-2 cursor-pointer hover:text-blue-600 transition-colors line-clamp-2"
                          onClick={() => handleProjectClick(conv)}
                          title={conv.title}
                        >
                          {conv.title}
                        </h3>
                        
                        <p className="text-xs text-gray-500 mb-3">
                          {conv.timestamp.toLocaleDateString()} • {conv.messages.length} messages
                        </p>

                        {projectPreview.preview && (
                          <p className="text-sm text-gray-600 line-clamp-2 text-xs">
                            {projectPreview.preview}
                          </p>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                        <button
                          onClick={() => handleProjectClick(conv)}
                          className="flex items-center gap-1 px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                          Open
                        </button>
                        
                        <div className="flex items-center gap-1">
                          <button
                            onClick={(e) => handleShare(conv.id, e)}
                            className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
                            title="Share"
                          >
                            <Share2 className="w-4 h-4" />
                          </button>
                          
                          <button
                            onClick={(e) => toggleMenu(conv.id, e)}
                            className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Dropdown Menu */}
                  {activeMenu === conv.id && (
                    <div className="absolute right-2 top-2 bg-white border border-gray-200 rounded-lg shadow-lg z-10 py-1 min-w-40">
                      <button
                        onClick={(e) => handleTogglePin(conv.id, e)}
                        className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                      >
                        <Pin className="w-4 h-4" />
                        {conv.pinned ? 'Unpin Project' : 'Pin Project'}
                      </button>
                      <button
                        onClick={(e) => handleShare(conv.id, e)}
                        className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                      >
                        <Share2 className="w-4 h-4" />
                        Share Project
                      </button>
                      {projectPreview.hasCode && (
                        <button className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors">
                          <Download className="w-4 h-4" />
                          Download Code
                        </button>
                      )}
                      <div className="border-t border-gray-100 my-1"></div>
                      <button
                        onClick={(e) => handleDelete(conv.id, e)}
                        className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete Project
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectHistory;