import { GoogleGenAI, Type, Schema } from "@google/genai";
import { GenerationParams, PromptResponse, AspectRatio } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const PROMPT_GENERATION_MODEL = "gemini-2.5-flash";
const IMAGE_GENERATION_MODEL = "gemini-2.5-flash-image"; 

/**
 * Generates a list of detailed image prompts based on user parameters.
 */
export const generatePrompts = async (params: GenerationParams): Promise<PromptResponse> => {
  const systemInstruction = `
You are a Bulk AI Image Generation Engine.
Your task is to generate high-quality AI images in bulk (1 to ${params.imageCount} per request) based on user-provided parameters.

Always output in this JSON format:
{
  "images": [
     { "final_prompt": "..." },
     { "final_prompt": "..." }
  ]
}
`;

  const userContent = `
--------------------------------------
USER PARAMETERS
--------------------------------------
Generate ${params.imageCount} image prompts.

Theme: ${params.theme}
Style: ${params.style}
Camera angle: ${params.cameraAngle}
Quality: ${params.quality}
Resolution: ${params.resolution || "1K"}
Format/Ratio: ${params.formatRatio}

Character description (optional): ${params.characterDescription || "None"}
Reference Image Provided: ${params.referenceImage ? "Yes" : "No"}
Text overlay (optional): ${params.textOverlay || "None"}
Text color: ${params.textColor || "N/A"}
Font style: ${params.fontStyle || "N/A"}
Color tone/style: ${params.colorsStyle || "Standard"}
Extra instructions: ${params.extraInstructions || "None"}

--------------------------------------
RULES
--------------------------------------
1. Support ${params.imageCount} images.
2. Each image must follow all selected parameters.
3. If a character description is provided, keep the character’s appearance consistent.
4. If a reference image is provided, ensure the prompts describe the subject in a way that aligns with using that image as a strong reference.
5. If text is provided, place it cleanly on the image.
6. All prompts must include:
   - Theme
   - Style
   - Camera angle
   - Quality (HD/4K/8K/Ultra)
   - Format/ratio
   - Color tone
   - Optional text overlay details
   - Optional character details
7. Make every prompt slightly different while keeping the same theme.
8. Output only JSON. No extra notes.
`;

  const schema: Schema = {
    type: Type.OBJECT,
    properties: {
      images: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            final_prompt: { type: Type.STRING },
          },
          required: ["final_prompt"],
        },
      },
    },
    required: ["images"],
  };

  try {
    const response = await ai.models.generateContent({
      model: PROMPT_GENERATION_MODEL,
      contents: userContent,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: schema,
        temperature: 0.7, 
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response text from Gemini");

    return JSON.parse(text) as PromptResponse;
  } catch (error) {
    console.error("Error generating prompts:", error);
    throw error;
  }
};

/**
 * Generates a single image from a specific prompt, optionally using a reference image.
 */
export const generateImage = async (prompt: string, aspectRatioStr: string, referenceImage?: string): Promise<string> => {
  // Map the generic ratio string to Gemini specific ratio enum-like strings if needed,
  // but gemini-2.5-flash-image usually takes "1:1", "16:9", etc. directly in config.
  // We will attempt to use the string directly as it matches standard format.
  
  try {
    const parts: any[] = [];
    
    // Add reference image if available (Multimodal input)
    if (referenceImage) {
        // Extract base64 data and mime type
        // Data URL format: data:[<mediatype>][;base64],<data>
        const matches = referenceImage.match(/^data:(.+);base64,(.+)$/);
        if (matches && matches.length === 3) {
            parts.push({
                inlineData: {
                    mimeType: matches[1],
                    data: matches[2]
                }
            });
        }
    }

    // Add text prompt
    parts.push({ text: prompt });

    const response = await ai.models.generateContent({
      model: IMAGE_GENERATION_MODEL,
      contents: {
        parts: parts,
      },
      config: {
        imageConfig: {
          aspectRatio: aspectRatioStr as any, 
        },
      },
    });

    // Extract image
    // The response structure for images usually contains inlineData in the parts
    const contentParts = response.candidates?.[0]?.content?.parts;
    if (!contentParts) throw new Error("No content generated");

    for (const part of contentParts) {
        if (part.inlineData && part.inlineData.data) {
            const base64 = part.inlineData.data;
            const mimeType = part.inlineData.mimeType || "image/jpeg";
            return `data:${mimeType};base64,${base64}`;
        }
    }
    
    throw new Error("No image data found in response");
  } catch (error) {
    console.error("Error generating image:", error);
    throw error;
  }
};