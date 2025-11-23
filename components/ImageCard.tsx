import React from 'react';
import { GeneratedPrompt } from '../types';
import { Image as ImageIcon, Copy, AlertCircle, Download, Wand2 } from 'lucide-react';

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
    <div className="group bg-white border border-slate-200 rounded-2xl overflow-hidden flex flex-col shadow-lg shadow-slate-200/50 transition-all duration-300 hover:border-blue-500/40 hover:shadow-[0_0_25px_rgba(59,130,246,0.15)] hover:-translate-y-1">
      {/* Image Area */}
      <div className="relative aspect-square bg-slate-100 w-full border-b border-slate-100 flex items-center justify-center overflow-hidden">
        {item.status === 'completed' && item.imageUrl ? (
          <>
            <img 
                src={item.imageUrl} 
                alt={item.final_prompt} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
            />
             <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 backdrop-blur-[2px]">
                <button 
                    onClick={handleDownload}
                    className="bg-white/90 text-slate-900 p-3 rounded-full hover:bg-white hover:scale-110 transition-all shadow-xl"
                    title="Download"
                >
                    <Download size={20} />
                </button>
             </div>
          </>
        ) : (
          <div className="flex flex-col items-center text-slate-400 px-4 text-center">
            {item.status === 'generating' ? (
               <div className="flex flex-col items-center gap-3">
                   <div className="relative">
                       <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
                       <div className="absolute inset-0 rounded-full h-10 w-10 border-2 border-blue-600/20 animate-ping"></div>
                   </div>
                   <span className="text-xs font-medium animate-pulse text-blue-600">Forging Visuals...</span>
               </div>
            ) : item.status === 'failed' ? (
                <div className="text-red-500 flex flex-col items-center gap-2">
                    <AlertCircle size={28} />
                    <span className="text-xs">Generation Failed</span>
                </div>
            ) : (
              <div className="group-hover:text-slate-500 transition-colors flex flex-col items-center gap-2">
                <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center mb-1 group-hover:bg-blue-50 shadow-sm border border-slate-200 transition-colors">
                    <ImageIcon size={32} className="opacity-40" />
                </div>
                <span className="text-xs font-medium opacity-60">Preview</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Content Area */}
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex justify-between items-start gap-2 mb-3">
          <span className="text-[10px] uppercase tracking-wider font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded border border-blue-100">
              #{item.id.slice(0, 4)}
          </span>
          <button 
            onClick={handleCopy}
            className="text-slate-400 hover:text-blue-600 transition-colors p-1.5 hover:bg-blue-50 rounded-md"
            title="Copy Prompt"
          >
            <Copy size={14} />
          </button>
        </div>
        
        <p className="text-sm text-slate-600 line-clamp-4 font-normal leading-relaxed flex-grow">
          {item.final_prompt}
        </p>

        <div className="mt-5 pt-4 border-t border-slate-100">
          <button
            onClick={() => onGenerate(item.id)}
            disabled={item.status === 'generating' || item.status === 'completed'}
            className={`w-full py-2.5 px-4 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 ${
              item.status === 'completed' 
                ? 'bg-emerald-50 text-emerald-600 border border-emerald-100 cursor-default'
                : item.status === 'generating'
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-lg shadow-emerald-500/20 hover:-translate-y-0.5'
            }`}
          >
            {item.status === 'completed' ? (
                <>Done</>
            ) : item.status === 'generating' ? (
                'Generating...'
            ) : (
                <>
                    <Wand2 size={16} />
                    Generate Image
                </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageCard;