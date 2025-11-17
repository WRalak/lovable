import React from 'react';
import { X, Eye, Code } from 'lucide-react';

interface PreviewAreaProps {
  currentArtifact: string;
  viewMode: 'preview' | 'code';
  setViewMode: (mode: 'preview' | 'code') => void;
  onClose: () => void;
}

const PreviewArea: React.FC<PreviewAreaProps> = ({
  currentArtifact,
  viewMode,
  setViewMode,
  onClose,
}) => {
  const renderPreview = () => {
    return (
      <iframe
        srcDoc={`
          <!DOCTYPE html>
          <html>
            <head>
              <script src="https://cdn.tailwindcss.com"></script>
              <script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
              <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
              <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
            </head>
            <body>
              <div id="root"></div>
              <script type="text/babel">
                ${currentArtifact}
                ReactDOM.render(<App />, document.getElementById('root'));
              </script>
            </body>
          </html>
        `}
        className="w-full h-full border-0"
        title="Preview"
      />
    );
  };

  return (
    <div className="w-1/2 border-l border-gray-200 bg-gray-50 overflow-hidden flex flex-col">
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="font-semibold text-gray-800 text-sm sm:text-base">
            {viewMode === 'preview' ? 'Preview' : 'Code'}
          </h2>
          <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('preview')}
              className={`p-1.5 rounded transition-colors ${viewMode === 'preview' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'}`}
              title="Preview"
            >
              <Eye className="w-4 h-4 text-gray-600" />
            </button>
            <button
              onClick={() => setViewMode('code')}
              className={`p-1.5 rounded transition-colors ${viewMode === 'code' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'}`}
              title="Code"
            >
              <Code className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1 hover:bg-gray-100 rounded transition-colors"
        >
          <X className="w-5 h-5 text-gray-600" />
        </button>
      </div>
      <div className="flex-1 overflow-auto">
        {viewMode === 'preview' ? (
          <div className="h-full">
            {renderPreview()}
          </div>
        ) : (
          <div className="h-full p-4 sm:p-6 bg-gray-900">
            <pre className="text-sm text-gray-100 font-mono overflow-x-auto">
              <code>{currentArtifact}</code>
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default PreviewArea;