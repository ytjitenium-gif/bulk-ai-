import React, { useState, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import ImageCard from './components/ImageCard';
import { GenerationParams, GeneratedPrompt, PromptResponse } from './types';
import { generatePrompts, generateImage } from './services/gemini';
import { LayoutGrid, Wand2, AlertTriangle, Sparkles } from 'lucide-react';

export default function App() {
  const [prompts, setPrompts] = useState<GeneratedPrompt[]>([]);
  const [isDrafting, setIsDrafting] = useState(false);
  const [currentParams, setCurrentParams] = useState<GenerationParams | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleDraftPrompts = async (params: GenerationParams) => {
    setIsDrafting(true);
    setError(null);
    setPrompts([]); // Clear previous
    setCurrentParams(params);

    try {
      const response: PromptResponse = await generatePrompts(params);
      
      const newPrompts: GeneratedPrompt[] = response.images.map((img, idx) => ({
        id: `${Date.now()}-${idx}`,
        final_prompt: img.final_prompt,
        status: 'pending'
      }));

      setPrompts(newPrompts);
    } catch (err: any) {
      setError(err.message || "Failed to generate prompts.");
    } finally {
      setIsDrafting(false);
    }
  };

  const handleGenerateImage = useCallback(async (id: string) => {
    const promptToGen = prompts.find(p => p.id === id);
    if (!promptToGen || !currentParams) return;

    // Update state to generating
    setPrompts(prev => prev.map(p => p.id === id ? { ...p, status: 'generating' } : p));

    try {
      const base64Image = await generateImage(
        promptToGen.final_prompt, 
        currentParams.formatRatio,
        currentParams.referenceImage
      );
      setPrompts(prev => prev.map(p => p.id === id ? { ...p, status: 'completed', imageUrl: base64Image } : p));
    } catch (err) {
        console.error(err);
      setPrompts(prev => prev.map(p => p.id === id ? { ...p, status: 'failed', error: 'Generation failed' } : p));
    }
  }, [prompts, currentParams]);

  const handleGenerateAll = async () => {
    // Filter pending items
    const pending = prompts.filter(p => p.status === 'pending');
    
    // We process them sequentially to avoid hitting rate limits too hard, 
    // though Gemini 2.5 Flash Image is fast.
    // Parallel limit of 3
    const BATCH_SIZE = 3;
    
    for (let i = 0; i < pending.length; i += BATCH_SIZE) {
        const batch = pending.slice(i, i + BATCH_SIZE);
        await Promise.all(batch.map(p => handleGenerateImage(p.id)));
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen text-slate-800 relative overflow-hidden bg-slate-50">
      
      {/* Ambient Background Blobs (Light Pastel) */}
      <div className="absolute top-[-10%] right-[-10%] w-[800px] h-[800px] bg-blue-200/40 rounded-full blur-[120px] pointer-events-none z-0"></div>
      <div className="absolute bottom-[-10%] left-[10%] w-[600px] h-[600px] bg-purple-200/40 rounded-full blur-[100px] pointer-events-none z-0"></div>

      {/* Sidebar Form */}
      <Sidebar onSubmit={handleDraftPrompts} isGenerating={isDrafting} />

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 h-screen overflow-y-auto relative z-10 scrollbar-thin">
        <div className="max-w-7xl mx-auto">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4 bg-white/60 backdrop-blur-md p-6 rounded-2xl border border-slate-200 shadow-xl shadow-slate-200/50">
            <div>
                <h2 className="text-3xl font-bold text-slate-900 flex items-center gap-3 tracking-tight">
                    <div className="p-2 bg-blue-100 rounded-lg border border-blue-200">
                        <LayoutGrid className="text-blue-600" size={24} />
                    </div>
                    Prompt Workspace
                </h2>
                <p className="text-slate-500 mt-2 text-sm font-medium pl-1">
                    {prompts.length > 0 
                        ? `Viewing ${prompts.length} generated prompts ready for visualization.` 
                        : "Configure your parameters on the left sidebar to begin."}
                </p>
            </div>

            {prompts.length > 0 && (
                <button 
                    onClick={handleGenerateAll}
                    className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white shadow-lg shadow-orange-500/20 px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all hover:scale-105"
                >
                    <Wand2 size={20} />
                    Generate All Images
                </button>
            )}
          </div>

          {/* Error Banner */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-xl mb-6 flex items-center gap-3 backdrop-blur-sm shadow-sm">
                <AlertTriangle size={20} className="text-red-600" />
                {error}
            </div>
          )}

          {/* Empty State */}
          {prompts.length === 0 && !isDrafting && !error && (
             <div className="h-[55vh] flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-200 rounded-3xl bg-white/40 backdrop-blur-sm">
                <div className="p-6 bg-white rounded-full mb-6 shadow-xl shadow-slate-200">
                    <Sparkles size={48} className="text-slate-300" />
                </div>
                <p className="text-xl font-bold text-slate-700">Canvas Empty</p>
                <p className="text-sm mt-2 opacity-60">Set your parameters and click "Generate Prompts"</p>
             </div>
          )}

          {/* Loading State (Initial) */}
          {isDrafting && (
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-pulse">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="bg-white rounded-2xl h-96 border border-slate-200 shadow-sm"></div>
                ))}
             </div>
          )}

          {/* Results Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-20">
            {prompts.map((prompt) => (
              <ImageCard 
                key={prompt.id} 
                item={prompt} 
                onGenerate={handleGenerateImage} 
              />
            ))}
          </div>

        </div>
      </main>
    </div>
  );
}