import React, { useState, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import ImageCard from './components/ImageCard';
import { GenerationParams, GeneratedPrompt, PromptResponse } from './types';
import { generatePrompts, generateImage } from './services/gemini';
import { LayoutGrid, Wand2, AlertTriangle } from 'lucide-react';

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
    <div className="flex flex-col md:flex-row min-h-screen bg-black text-zinc-100">
      {/* Sidebar Form */}
      <Sidebar onSubmit={handleDraftPrompts} isGenerating={isDrafting} />

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 h-screen overflow-y-auto relative">
        <div className="max-w-7xl mx-auto">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    <LayoutGrid className="text-blue-500" />
                    Generated Prompts
                </h2>
                <p className="text-zinc-400 mt-1">
                    {prompts.length > 0 
                        ? `Showing ${prompts.length} generated prompts.` 
                        : "Configure parameters on the left to start."}
                </p>
            </div>

            {prompts.length > 0 && (
                <button 
                    onClick={handleGenerateAll}
                    className="bg-white text-black hover:bg-zinc-200 px-5 py-2.5 rounded-lg font-semibold flex items-center gap-2 transition-colors shadow-lg shadow-white/5"
                >
                    <Wand2 size={18} />
                    Generate All Images
                </button>
            )}
          </div>

          {/* Error Banner */}
          {error && (
            <div className="bg-red-900/20 border border-red-900/50 text-red-200 p-4 rounded-lg mb-6 flex items-center gap-3">
                <AlertTriangle size={20} />
                {error}
            </div>
          )}

          {/* Empty State */}
          {prompts.length === 0 && !isDrafting && !error && (
             <div className="h-[60vh] flex flex-col items-center justify-center text-zinc-600 border-2 border-dashed border-zinc-800 rounded-2xl bg-zinc-900/20">
                <Wand2 size={48} className="mb-4 opacity-20" />
                <p className="text-lg font-medium">Ready to forge</p>
                <p className="text-sm">Set your parameters and click "Generate Prompts"</p>
             </div>
          )}

          {/* Loading State (Initial) */}
          {isDrafting && (
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-pulse">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="bg-zinc-900 rounded-xl h-96 border border-zinc-800"></div>
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