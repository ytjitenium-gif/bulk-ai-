import React from 'react';
import { GeneratedPrompt } from '../types';
import { Image as ImageIcon, Copy, AlertCircle, Download } from 'lucide-react';

interface ImageCardProps {
  item: GeneratedPrompt;
  onGenerate: (id: string) => void;
}

const ImageCard: React.FC<ImageCardProps> = ({ item, onGenerate }) => {
  const handleCopy = () => {
    navigator.clipboard.writeText(item.final_prompt);
  };

  const handleDownload = () => {
    if (item.imageUrl) {
        const link = document.createElement('a');
        link.href = item.imageUrl;
        link.download = `generated-${item.id}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
  };

  return (
    <div className="bg-zinc-800/50 border border-zinc-700/50 rounded-xl overflow-hidden flex flex-col shadow-sm hover:shadow-md transition-shadow duration-300">
      {/* Image Area */}
      <div className="relative aspect-square bg-zinc-900 w-full border-b border-zinc-800 flex items-center justify-center group">
        {item.status === 'completed' && item.imageUrl ? (
          <>
            <img 
                src={item.imageUrl} 
                alt={item.final_prompt} 
                className="w-full h-full object-cover"
                loading="lazy"
            />
             <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button 
                    onClick={handleDownload}
                    className="bg-zinc-100 text-zinc-900 p-2 rounded-full hover:bg-white transition-colors"
                    title="Download"
                >
                    <Download size={20} />
                </button>
             </div>
          </>
        ) : (
          <div className="flex flex-col items-center text-zinc-500 px-4 text-center">
            {item.status === 'generating' ? (
               <div className="flex flex-col items-center gap-2">
                   <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                   <span className="text-xs animate-pulse text-blue-400">Rendering Image...</span>
               </div>
            ) : item.status === 'failed' ? (
                <div className="text-red-400 flex flex-col items-center gap-2">
                    <AlertCircle size={24} />
                    <span className="text-xs">Generation Failed</span>
                </div>
            ) : (
              <>
                <ImageIcon size={32} className="mb-2 opacity-50" />
                <span className="text-xs">Preview Area</span>
              </>
            )}
          </div>
        )}
      </div>

      {/* Content Area */}
      <div className="p-4 flex flex-col flex-grow">
        <div className="flex justify-between items-start gap-2 mb-3">
          <span className="text-xs font-mono text-zinc-500 bg-zinc-900/50 px-2 py-1 rounded">ID: {item.id.slice(0, 4)}</span>
          <button 
            onClick={handleCopy}
            className="text-zinc-500 hover:text-white transition-colors p-1"
            title="Copy Prompt"
          >
            <Copy size={14} />
          </button>
        </div>
        
        <p className="text-sm text-zinc-300 line-clamp-4 font-light leading-relaxed flex-grow">
          {item.final_prompt}
        </p>

        <div className="mt-4 pt-4 border-t border-zinc-700/50">
          <button
            onClick={() => onGenerate(item.id)}
            disabled={item.status === 'generating' || item.status === 'completed'}
            className={`w-full py-2 px-4 rounded-lg text-sm font-medium transition-all ${
              item.status === 'completed' 
                ? 'bg-emerald-900/30 text-emerald-400 border border-emerald-900/50 cursor-default'
                : item.status === 'generating'
                ? 'bg-zinc-700 text-zinc-400 cursor-not-allowed'
                : 'bg-zinc-100 text-zinc-900 hover:bg-white hover:shadow-lg hover:shadow-white/10'
            }`}
          >
            {item.status === 'completed' ? 'Done' : item.status === 'generating' ? 'Generating...' : 'Generate Image'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageCard;
