import React, { useState, useRef } from 'react';
import { GenerationParams, AspectRatio } from '../types';
import { Settings2, Palette, Camera, User, Type as TypeIcon, Sparkles, ChevronDown, Upload, X, Image as ImageIcon, Wrench, Hammer } from 'lucide-react';

interface SidebarProps {
  onSubmit: (params: GenerationParams) => void;
  isGenerating: boolean;
}

const THEME_PRESETS = [
  { label: 'Cyberpunk City', value: 'Cyberpunk City' },
  { label: 'Photorealistic', value: 'Photorealistic' },
  { label: 'Cinematic', value: 'Cinematic' },
  { label: 'Anime / Manga', value: 'Anime Style' },
  { label: '3D Render', value: '3D Render, Unreal Engine 5' },
  { label: 'Oil Painting', value: 'Oil Painting' },
  { label: 'Watercolor', value: 'Watercolor' },
  { label: 'Retro Futurism', value: 'Retro Futurism' },
  { label: 'Steampunk', value: 'Steampunk' },
  { label: 'Dark Fantasy', value: 'Dark Fantasy' },
  { label: 'High Fantasy', value: 'High Fantasy' },
  { label: 'Sci-Fi Space', value: 'Sci-Fi Space' },
  { label: 'Concept Art', value: 'Concept Art' },
  { label: 'Noir / Black & White', value: 'Noir' },
  { label: 'Minimalist', value: 'Minimalist' },
  { label: 'Pop Art', value: 'Pop Art' },
  { label: 'Pixel Art', value: 'Pixel Art' },
  { label: 'Low Poly', value: 'Low Poly' },
  { label: 'Isometric', value: 'Isometric' },
  { label: 'Studio Photography', value: 'Studio Photography' },
  { label: 'Vaporwave', value: 'Vaporwave' },
  { label: 'Synthwave', value: 'Synthwave' },
  { label: 'Gothic', value: 'Gothic' },
  { label: 'Surrealism', value: 'Surrealism' },
  { label: 'Impressionism', value: 'Impressionism' },
  { label: 'Charcoal Sketch', value: 'Charcoal Sketch' },
  { label: 'Ukiyo-e', value: 'Ukiyo-e' },
  { label: 'Graffiti', value: 'Graffiti Art' },
  { label: 'Origami', value: 'Origami' },
  { label: 'Claymation', value: 'Claymation' },
  { label: 'Paper Cutout', value: 'Paper Cutout' },
  { label: 'Vector Art', value: 'Vector Art' },
  { label: 'Line Art', value: 'Line Art' },
  { label: 'Flat Design', value: 'Flat Design' },
  { label: 'Glitch Art', value: 'Glitch Art' },
  { label: 'Renaissance', value: 'Renaissance Style' },
  { label: 'Baroque', value: 'Baroque Style' },
  { label: 'Dystopian', value: 'Dystopian' },
  { label: 'Ethereal', value: 'Ethereal' },
  { label: 'Bauhaus', value: 'Bauhaus' },
  { label: 'Cubism', value: 'Cubism' },
  { label: 'Mosaic', value: 'Mosaic' },
  { label: 'Stained Glass', value: 'Stained Glass' },
  { label: 'Knolling', value: 'Knolling Photography' },
];

const STYLE_PRESETS = [
  { label: 'Photorealistic', value: 'Photorealistic' },
  { label: 'Cinematic', value: 'Cinematic' },
  { label: '3D Render', value: '3D Render, Unreal Engine 5' },
  { label: 'Digital Art', value: 'Digital Art' },
  { label: 'Oil Painting', value: 'Oil Painting' },
  { label: 'Watercolor', value: 'Watercolor' },
  { label: 'Anime', value: 'Anime Style' },
  { label: 'Manga', value: 'Manga Style' },
  { label: 'Comic Book', value: 'Comic Book Style' },
  { label: 'Pencil Sketch', value: 'Pencil Sketch' },
  { label: 'Charcoal Drawing', value: 'Charcoal Drawing' },
  { label: 'Ink Illustration', value: 'Ink Illustration' },
  { label: 'Line Art', value: 'Line Art' },
  { label: 'Vector Art', value: 'Vector Art' },
  { label: 'Flat Design', value: 'Flat Design' },
  { label: 'Pixel Art', value: 'Pixel Art' },
  { label: 'Low Poly', value: 'Low Poly' },
  { label: 'Voxel Art', value: 'Voxel Art' },
  { label: 'Isometric', value: 'Isometric' },
  { label: 'Concept Art', value: 'Concept Art' },
  { label: 'Matte Painting', value: 'Matte Painting' },
  { label: 'Surrealism', value: 'Surrealism' },
  { label: 'Impressionism', value: 'Impressionism' },
  { label: 'Abstract', value: 'Abstract' },
  { label: 'Pop Art', value: 'Pop Art' },
  { label: 'Art Nouveau', value: 'Art Nouveau' },
  { label: 'Art Deco', value: 'Art Deco' },
  { label: 'Baroque', value: 'Baroque' },
  { label: 'Renaissance', value: 'Renaissance' },
  { label: 'Gothic', value: 'Gothic' },
  { label: 'Ukiyo-e', value: 'Ukiyo-e' },
  { label: 'Cyberpunk', value: 'Cyberpunk' },
  { label: 'Steampunk', value: 'Steampunk' },
  { label: 'Vaporwave', value: 'Vaporwave' },
  { label: 'Glitch Art', value: 'Glitch Art' },
  { label: 'Origami', value: 'Origami' },
  { label: 'Claymation', value: 'Claymation' },
  { label: 'Stained Glass', value: 'Stained Glass' },
  { label: 'Graffiti', value: 'Graffiti' },
  { label: 'Film Noir', value: 'Film Noir' },
  { label: 'Polaroid', value: 'Polaroid Style' },
  { label: 'Double Exposure', value: 'Double Exposure' },
  { label: 'Typographic Art', value: 'Typographic Art' },
  { label: 'Geometric', value: 'Geometric' },
  { label: 'Psychedelic', value: 'Psychedelic' },
];

const COLOR_PRESETS = [
  { label: 'Standard', value: 'Standard' },
  { label: 'Warm / Golden Hour', value: 'Warm, Golden Hour' },
  { label: 'Cool / Blue Tone', value: 'Cool, Blue Tone' },
  { label: 'Black & White', value: 'Black and White, Noir' },
  { label: 'Sepia / Vintage', value: 'Sepia, Vintage' },
  { label: 'Pastel', value: 'Pastel Colors' },
  { label: 'Neon / Cyberpunk', value: 'Neon, Cyberpunk' },
  { label: 'Vivid / Vibrant', value: 'Vivid, Vibrant, High Saturation' },
  { label: 'Muted / Desaturated', value: 'Muted, Low Saturation' },
  { label: 'Earth Tones', value: 'Earth Tones, Natural' },
  { label: 'Teal & Orange', value: 'Teal and Orange, Cinematic' },
  { label: 'Dark & Moody', value: 'Dark, Moody, Atmospheric' },
  { label: 'High Key (Bright)', value: 'High Key, Bright, Airy' },
  { label: 'Low Key (Dark)', value: 'Low Key, Dark, Shadowy' },
  { label: 'Monochromatic', value: 'Monochromatic' },
  { label: 'Gothic', value: 'Gothic, Red and Black' },
  { label: 'Vaporwave', value: 'Vaporwave, Pink and Blue' },
  { label: 'Matte', value: 'Matte Finish' },
  { label: 'Technicolor', value: 'Technicolor' },
  { label: 'HDR', value: 'HDR, High Dynamic Range' },
];

const TEXT_COLOR_GROUPS = [
  {
    label: "Single Colors",
    options: [
      { label: 'White', value: 'White' },
      { label: 'Black', value: 'Black' },
      { label: 'Red', value: 'Red' },
      { label: 'Blue', value: 'Blue' },
      { label: 'Green', value: 'Green' },
      { label: 'Yellow', value: 'Yellow' },
      { label: 'Purple', value: 'Purple' },
      { label: 'Orange', value: 'Orange' },
      { label: 'Pink', value: 'Pink' },
      { label: 'Cyan', value: 'Cyan' },
      { label: 'Magenta', value: 'Magenta' },
      { label: 'Gold', value: 'Gold' },
      { label: 'Silver', value: 'Silver' },
      { label: 'Neon Green', value: 'Neon Green' },
      { label: 'Neon Pink', value: 'Neon Pink' },
    ]
  },
  {
    label: "Dual Colors",
    options: [
      { label: 'Black & White', value: 'Black and White' },
      { label: 'Red & Black', value: 'Red and Black' },
      { label: 'Blue & White', value: 'Blue and White' },
      { label: 'Blue & Gold', value: 'Blue and Gold' },
      { label: 'Pink & Purple', value: 'Pink and Purple Gradient' },
      { label: 'Teal & Orange', value: 'Teal and Orange' },
      { label: 'Red & Blue', value: 'Red and Blue' },
      { label: 'Yellow & Black', value: 'Yellow and Black' },
      { label: 'Green & Black', value: 'Green and Black' },
    ]
  },
  {
    label: "Tri-Colors",
    options: [
      { label: 'Red, White & Blue', value: 'Red, White, and Blue' },
      { label: 'Cyan, Magenta & Yellow', value: 'Cyan, Magenta, and Yellow' },
      { label: 'Fire (Red, Orange, Yellow)', value: 'Red, Orange, Yellow Gradient' },
      { label: 'Cool (Blue, Purple, Pink)', value: 'Blue, Purple, Pink Gradient' },
      { label: 'Rasta (Green, Yellow, Red)', value: 'Green, Yellow, Red' },
      { label: 'Vaporwave (Cyan, Pink, Purple)', value: 'Cyan, Pink, Purple' },
    ]
  },
  {
    label: "Special Combinations",
    options: [
      { label: 'Rainbow', value: 'Rainbow Colors' },
      { label: 'Holographic', value: 'Holographic' },
      { label: 'Metallic Gold', value: 'Metallic Gold' },
      { label: 'Chrome', value: 'Chrome Silver' },
      { label: 'Pastel Gradient', value: 'Pastel Gradient' },
      { label: 'Iridescent', value: 'Iridescent' },
    ]
  }
];

const FONT_GROUPS = [
  {
    label: "Sans Serif",
    options: [
      { label: "Helvetica", value: "Helvetica, Sans-serif" },
      { label: "Arial", value: "Arial, Sans-serif" },
      { label: "Roboto", value: "Roboto" },
      { label: "Open Sans", value: "Open Sans" },
      { label: "Montserrat", value: "Montserrat" },
      { label: "Lato", value: "Lato" },
      { label: "Poppins", value: "Poppins" },
      { label: "Futura", value: "Futura" },
      { label: "Impact", value: "Impact, Bold" },
      { label: "Bebas Neue", value: "Bebas Neue" },
      { label: "Gotham", value: "Gotham" },
    ]
  },
  {
    label: "Serif",
    options: [
      { label: "Times New Roman", value: "Times New Roman" },
      { label: "Garamond", value: "Garamond" },
      { label: "Georgia", value: "Georgia" },
      { label: "Playfair Display", value: "Playfair Display" },
      { label: "Baskerville", value: "Baskerville" },
      { label: "Merriweather", value: "Merriweather" },
      { label: "Bodoni", value: "Bodoni" },
      { label: "Didot", value: "Didot" },
    ]
  },
  {
    label: "Handwritten & Script",
    options: [
      { label: "Handwritten", value: "Handwritten Style" },
      { label: "Brush Script", value: "Brush Script" },
      { label: "Pacifico", value: "Pacifico" },
      { label: "Lobster", value: "Lobster" },
      { label: "Dancing Script", value: "Dancing Script" },
      { label: "Great Vibes", value: "Great Vibes" },
      { label: "Signature Style", value: "Signature Style" },
      { label: "Calligraphy", value: "Calligraphy" },
      { label: "Graffiti", value: "Graffiti Font" },
      { label: "Comic Sans", value: "Comic Sans MS" },
    ]
  },
  {
    label: "Display & Decorative",
    options: [
      { label: "Old English / Gothic", value: "Old English, Gothic" },
      { label: "Typewriter", value: "Vintage Typewriter" },
      { label: "Neon Light", value: "Neon Light Text" },
      { label: "Bubble Text", value: "Bubble Letters" },
      { label: "Chalkboard", value: "Chalkboard Style" },
      { label: "3D Text", value: "3D Rendered Text" },
      { label: "Cinematic Title", value: "Cinematic Title Font" },
      { label: "Retro / Vaporwave", value: "Retro Vaporwave Font" },
      { label: "Glitch Text", value: "Glitch Text Style" },
      { label: "Horror / Grudge", value: "Horror / Grunge Font" },
      { label: "Pixel Art", value: "Pixel Art Font" },
    ]
  },
  {
    label: "Monospace",
    options: [
      { label: "Courier New", value: "Courier New" },
      { label: "Fira Code", value: "Fira Code" },
      { label: "Terminal", value: "Terminal Font" },
    ]
  },
  {
    label: "Indian / Hindi Styles",
    options: [
      { label: "Devanagari Bold", value: "Devanagari Bold" },
      { label: "Hindi Calligraphy", value: "Hindi Calligraphy" },
      { label: "Marathi Cursive", value: "Marathi Cursive" },
      { label: "Sanskrit Classic", value: "Sanskrit Classic" },
      { label: "Hindi Brush", value: "Hindi Brush Style" },
      { label: "Bollywood Poster", value: "Bollywood Poster Style" },
      { label: "Samarkan (English-Hindi Look)", value: "Samarkan" },
      { label: "Kalam (Handwriting)", value: "Kalam" },
      { label: "Gotu", value: "Gotu" },
      { label: "Ek Mukta", value: "Ek Mukta" },
    ]
  }
];

const Sidebar: React.FC<SidebarProps> = ({ onSubmit, isGenerating }) => {
  const [params, setParams] = useState<GenerationParams>({
    imageCount: 4,
    theme: 'Cyberpunk City',
    style: 'Photorealistic',
    cameraAngle: 'Wide Angle',
    quality: '8K',
    formatRatio: '1:1',
    characterDescription: '',
    textOverlay: '',
    textColor: 'White',
    fontStyle: 'Bold Sans-serif',
    colorsStyle: 'Neon, Cyberpunk',
    extraInstructions: '',
    referenceImage: undefined,
  });

  const [isCustomTheme, setIsCustomTheme] = useState(false);
  const [isCustomStyle, setIsCustomStyle] = useState(false);
  const [isCustomColor, setIsCustomColor] = useState(false);
  const [isCustomFont, setIsCustomFont] = useState(false);
  const [isCustomTextColor, setIsCustomTextColor] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setParams((prev) => ({ ...prev, [name]: value }));
  };

  const handleThemeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value === 'custom') {
      setIsCustomTheme(true);
      setParams(prev => ({ ...prev, theme: '' }));
    } else {
      setIsCustomTheme(false);
      setParams(prev => ({ ...prev, theme: value }));
    }
  };

  const handleStyleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value === 'custom') {
      setIsCustomStyle(true);
      setParams(prev => ({ ...prev, style: '' }));
    } else {
      setIsCustomStyle(false);
      setParams(prev => ({ ...prev, style: value }));
    }
  };

  const handleColorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value === 'custom') {
      setIsCustomColor(true);
      setParams(prev => ({ ...prev, colorsStyle: '' }));
    } else {
      setIsCustomColor(false);
      setParams(prev => ({ ...prev, colorsStyle: value }));
    }
  };

  const handleFontChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value === 'custom') {
      setIsCustomFont(true);
      setParams(prev => ({ ...prev, fontStyle: '' }));
    } else {
      setIsCustomFont(false);
      setParams(prev => ({ ...prev, fontStyle: value }));
    }
  };

  const handleTextColorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value === 'custom') {
      setIsCustomTextColor(true);
      setParams(prev => ({ ...prev, textColor: '' }));
    } else {
      setIsCustomTextColor(false);
      setParams(prev => ({ ...prev, textColor: value }));
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setParams(prev => ({ ...prev, referenceImage: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeReferenceImage = () => {
    setParams(prev => ({ ...prev, referenceImage: undefined }));
    if (fileInputRef.current) {
        fileInputRef.current.value = '';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(params);
  };

  return (
    <aside className="w-full md:w-80 lg:w-96 bg-zinc-900 border-r border-zinc-800 h-screen overflow-y-auto sticky top-0 scrollbar-thin">
      <div className="p-6 border-b border-zinc-800">
        <div className="flex items-center gap-3 mb-2">
          {/* Custom Logo: Blue Square with Orange Crossed Tools (Wrench + Hammer) */}
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center relative overflow-hidden shrink-0 shadow-lg shadow-blue-900/40">
              <Wrench className="absolute text-amber-500 w-6 h-6 transform -rotate-[135deg] top-2 left-2" strokeWidth={2.5} />
              <Hammer className="absolute text-amber-500 w-6 h-6 transform -rotate-[45deg] top-2 right-2" strokeWidth={2.5} />
          </div>
          <h1 className="text-xl font-bold text-white tracking-tight">Promise Tool</h1>
        </div>
        <p className="text-xs text-zinc-400">Bulk AI Prompt & Image Engine</p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-8">
        
        {/* Core Settings */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-blue-400 text-sm font-semibold uppercase tracking-wider">
            <Settings2 size={14} /> Core Settings
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-xs text-zinc-400 mb-1">Theme</label>
              <div className="relative">
                <select
                  value={isCustomTheme ? 'custom' : params.theme}
                  onChange={handleThemeChange}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-sm text-white focus:ring-2 focus:ring-blue-500 outline-none appearance-none"
                >
                  {THEME_PRESETS.map((preset) => (
                    <option key={preset.value} value={preset.value}>
                      {preset.label}
                    </option>
                  ))}
                  <option value="custom">Custom...</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" size={14} />
              </div>
              
              {isCustomTheme && (
                <input
                  type="text"
                  name="theme"
                  value={params.theme}
                  onChange={handleChange}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-sm text-white focus:ring-2 focus:ring-blue-500 outline-none mt-2"
                  placeholder="Enter custom theme..."
                  autoFocus
                  required
                />
              )}
            </div>

             <div className="col-span-1">
              <label className="block text-xs text-zinc-400 mb-1">Count (1-50)</label>
              <input
                type="number"
                name="imageCount"
                min="1"
                max="50"
                value={params.imageCount}
                onChange={handleChange}
                className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-sm text-white focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div className="col-span-1">
               <label className="block text-xs text-zinc-400 mb-1">Ratio</label>
               <div className="relative">
                 <select
                  name="formatRatio"
                  value={params.formatRatio}
                  onChange={handleChange}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-sm text-white focus:ring-2 focus:ring-blue-500 outline-none appearance-none"
                >
                  <option value={AspectRatio.Square}>1:1 Square</option>
                  <option value={AspectRatio.Wide}>16:9 Wide</option>
                  <option value={AspectRatio.Tall}>9:16 Tall</option>
                  <option value={AspectRatio.Portrait}>3:4 Portrait</option>
                  <option value={AspectRatio.Landscape}>4:3 Landscape</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" size={14} />
               </div>
            </div>
          </div>
        </div>

        {/* Artistic Style */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-purple-400 text-sm font-semibold uppercase tracking-wider">
            <Palette size={14} /> Style & Tone
          </div>
          
          <div className="space-y-3">
             <div>
              <label className="block text-xs text-zinc-400 mb-1">Art Style</label>
              <div className="relative">
                <select
                  value={isCustomStyle ? 'custom' : params.style}
                  onChange={handleStyleChange}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-sm text-white focus:ring-2 focus:ring-purple-500 outline-none appearance-none"
                >
                  {STYLE_PRESETS.map((preset) => (
                    <option key={preset.value} value={preset.value}>
                      {preset.label}
                    </option>
                  ))}
                  <option value="custom">Custom...</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" size={14} />
              </div>
              {isCustomStyle && (
                <input
                  type="text"
                  name="style"
                  value={params.style}
                  onChange={handleChange}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-sm text-white focus:ring-2 focus:ring-purple-500 outline-none mt-2"
                  placeholder="e.g. Oil Painting, 3D Render"
                  autoFocus
                />
              )}
            </div>
            
            <div>
              <label className="block text-xs text-zinc-400 mb-1">Color Tone</label>
              <div className="relative">
                <select
                  value={isCustomColor ? 'custom' : params.colorsStyle}
                  onChange={handleColorChange}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-sm text-white focus:ring-2 focus:ring-purple-500 outline-none appearance-none"
                >
                  {COLOR_PRESETS.map((preset) => (
                    <option key={preset.value} value={preset.value}>
                      {preset.label}
                    </option>
                  ))}
                  <option value="custom">Custom...</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" size={14} />
              </div>
               {isCustomColor && (
                 <input
                  type="text"
                  name="colorsStyle"
                  value={params.colorsStyle}
                  onChange={handleChange}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-sm text-white focus:ring-2 focus:ring-purple-500 outline-none mt-2"
                  placeholder="e.g. Pastel, Neon, Grayscale"
                  autoFocus
                />
               )}
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div>
                  <label className="block text-xs text-zinc-400 mb-1">Camera</label>
                  <div className="relative">
                    <select name="cameraAngle" value={params.cameraAngle} onChange={handleChange} className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-sm text-white focus:ring-2 focus:ring-purple-500 outline-none appearance-none">
                      <option value="Wide Angle">Wide Angle</option>
                      <option value="Close Up">Close Up</option>
                      <option value="Aerial View">Aerial View</option>
                      <option value="Eye Level">Eye Level</option>
                      <option value="Low Angle">Low Angle</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" size={14} />
                  </div>
               </div>
               <div>
                  <label className="block text-xs text-zinc-400 mb-1">Quality</label>
                  <div className="relative">
                     <select name="quality" value={params.quality} onChange={handleChange} className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-sm text-white focus:ring-2 focus:ring-purple-500 outline-none appearance-none">
                      <option value="HD">HD</option>
                      <option value="4K">4K</option>
                      <option value="8K">8K</option>
                      <option value="Ultra Realistic">Ultra</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" size={14} />
                  </div>
               </div>
            </div>
          </div>
        </div>

        {/* Subject & Text */}
        <div className="space-y-4">
           <div className="flex items-center gap-2 text-emerald-400 text-sm font-semibold uppercase tracking-wider">
            <User size={14} /> Subject
          </div>
          <div>
            <label className="block text-xs text-zinc-400 mb-1">Character Description (Optional)</label>
            <textarea
              name="characterDescription"
              value={params.characterDescription}
              onChange={handleChange}
              className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-sm text-white focus:ring-2 focus:ring-emerald-500 outline-none resize-none h-20"
              placeholder="A robot with blue eyes..."
            />
          </div>

          <div>
             <label className="block text-xs text-zinc-400 mb-1">Character Reference (Optional)</label>
             {!params.referenceImage ? (
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full h-24 border-2 border-dashed border-zinc-700 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-emerald-500 hover:bg-zinc-800/50 transition-all group"
                >
                   <Upload className="text-zinc-500 group-hover:text-emerald-400 mb-2" size={20} />
                   <span className="text-xs text-zinc-500 group-hover:text-zinc-300">Upload Reference Image</span>
                </div>
             ) : (
                <div className="relative w-full h-32 rounded-lg overflow-hidden border border-zinc-700 group">
                   <img src={params.referenceImage} alt="Reference" className="w-full h-full object-cover" />
                   <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button 
                        type="button"
                        onClick={removeReferenceImage}
                        className="p-2 bg-red-500/80 hover:bg-red-500 text-white rounded-full transition-colors"
                      >
                         <X size={16} />
                      </button>
                   </div>
                   <div className="absolute bottom-1 right-2 bg-black/60 px-2 py-0.5 rounded text-[10px] text-white backdrop-blur-sm">
                      Reference Active
                   </div>
                </div>
             )}
             <input 
               type="file" 
               ref={fileInputRef} 
               onChange={handleImageUpload} 
               accept="image/*" 
               className="hidden" 
             />
             <p className="text-[10px] text-zinc-500 mt-1">Upload an image to maintain consistency.</p>
          </div>

          <div className="flex items-center gap-2 text-amber-400 text-sm font-semibold uppercase tracking-wider mt-6">
            <TypeIcon size={14} /> Text Overlay
          </div>
          <div>
            <label className="block text-xs text-zinc-400 mb-1">Text Content (Optional)</label>
            <input
              type="text"
              name="textOverlay"
              value={params.textOverlay}
              onChange={handleChange}
              className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-sm text-white focus:ring-2 focus:ring-amber-500 outline-none"
              placeholder="Text to appear on image"
            />
          </div>
          {params.textOverlay && (
            <div className="grid grid-cols-2 gap-4">
               <div>
                  <label className="block text-xs text-zinc-400 mb-1">Font Style</label>
                  <div className="relative">
                    <select
                      value={isCustomFont ? 'custom' : params.fontStyle}
                      onChange={handleFontChange}
                      className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-sm text-white focus:ring-2 focus:ring-amber-500 outline-none appearance-none"
                    >
                      {FONT_GROUPS.map((group) => (
                        <optgroup key={group.label} label={group.label}>
                          {group.options.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </optgroup>
                      ))}
                      <option value="custom">Custom...</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" size={14} />
                  </div>
                  {isCustomFont && (
                    <input
                        type="text"
                        name="fontStyle"
                        value={params.fontStyle}
                        onChange={handleChange}
                        className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-sm text-white focus:ring-2 focus:ring-amber-500 outline-none mt-2"
                        placeholder="e.g. Comic Sans"
                        autoFocus
                    />
                  )}
               </div>
                <div>
                  <label className="block text-xs text-zinc-400 mb-1">Text Color</label>
                  <div className="relative">
                    <select
                      value={isCustomTextColor ? 'custom' : params.textColor}
                      onChange={handleTextColorChange}
                      className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-sm text-white focus:ring-2 focus:ring-amber-500 outline-none appearance-none"
                    >
                      {TEXT_COLOR_GROUPS.map((group) => (
                        <optgroup key={group.label} label={group.label}>
                          {group.options.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </optgroup>
                      ))}
                      <option value="custom">Custom...</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" size={14} />
                  </div>
                   {isCustomTextColor && (
                    <input
                        type="text"
                        name="textColor"
                        value={params.textColor}
                        onChange={handleChange}
                        className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-sm text-white focus:ring-2 focus:ring-amber-500 outline-none mt-2"
                        placeholder="e.g. Neon Pink"
                        autoFocus
                    />
                  )}
               </div>
            </div>
          )}
        </div>

        {/* Extra */}
        <div className="space-y-4 pt-2 border-t border-zinc-800">
          <div>
            <label className="block text-xs text-zinc-400 mb-1">Extra Instructions</label>
            <textarea
              name="extraInstructions"
              value={params.extraInstructions}
              onChange={handleChange}
              className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-sm text-white focus:ring-2 focus:ring-zinc-500 outline-none resize-none h-16"
              placeholder="Any specific details..."
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isGenerating}
          className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-4 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2 shadow-lg shadow-blue-900/20"
        >
          {isGenerating ? (
            <>
               <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Drafting Prompts...
            </>
          ) : (
            <>
              <Sparkles size={18} />
              Generate Prompts
            </>
          )}
        </button>
      </form>
    </aside>
  );
};

export default Sidebar;