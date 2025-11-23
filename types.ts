export interface GenerationParams {
  imageCount: number;
  theme: string;
  style: string;
  cameraAngle: string;
  quality: string;
  formatRatio: string;
  characterDescription?: string;
  textOverlay?: string;
  textColor?: string;
  fontStyle?: string;
  colorsStyle?: string;
  extraInstructions?: string;
  referenceImage?: string;
}

export interface GeneratedPrompt {
  id: string;
  final_prompt: string;
  status: 'pending' | 'generating' | 'completed' | 'failed';
  imageUrl?: string;
  error?: string;
}

export interface PromptResponse {
  images: { final_prompt: string }[];
}

export enum AspectRatio {
  Square = "1:1",
  Portrait = "3:4",
  Landscape = "4:3",
  Wide = "16:9",
  Tall = "9:16",
}