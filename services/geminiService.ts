import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateCreativeChoices = async (topic: string): Promise<string[]> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Generate a list of 8 fun, short, and creative options for a couple deciding on: "${topic}". Keep options under 20 characters.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            items: {
              type: Type.ARRAY,
              items: {
                type: Type.STRING
              }
            }
          }
        }
      }
    });

    const json = JSON.parse(response.text || '{"items": []}');
    return json.items || [];
  } catch (error) {
    console.error("Gemini generation failed:", error);
    // Fallback if API fails
    return [`Generic ${topic} 1`, `Generic ${topic} 2`, `Generic ${topic} 3`];
  }
};
