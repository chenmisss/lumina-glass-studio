import { GoogleGenAI, Type, Schema } from "@google/genai";
import { GlassRecipe, ComparisonResult, GeneratedDesign } from "../types";

// Initialize the Google GenAI client dynamically
let aiClient: GoogleGenAI | null = null;
let currentKey: string | null = localStorage.getItem('lumina_api_key') || null;

// Initialize if key exists in env (fallback)
if (!currentKey && import.meta.env.VITE_API_KEY) {
  currentKey = import.meta.env.VITE_API_KEY;
}

const getClientConfig = (key: string) => {
  const baseConfig: any = { apiKey: key };

  // Check for Proxy URL
  const proxyUrl = import.meta.env.VITE_GEMINI_PROXY_URL;
  if (proxyUrl) {
    // Assuming the SDK supports baseUrl or rootUrl. 
    // For @google/genai, it is often 'baseUrl'.
    // If using the REST proxy method via Cloudflare, we might need to conform to how the SDK appends paths.
    // Usually setting baseUrl to "https://my-worker.dev" is sufficient if the SDK appends /v1beta/...
    baseConfig.baseUrl = proxyUrl;
  }
  return baseConfig;
}

if (currentKey) {
  aiClient = new GoogleGenAI(getClientConfig(currentKey));
}

export const setApiKey = (key: string) => {
  currentKey = key;
  localStorage.setItem('lumina_api_key', key);
  aiClient = new GoogleGenAI(getClientConfig(key));
};

export const getApiKey = () => currentKey;

const getAI = () => {
  if (!aiClient) {
    throw new Error("MISSING_API_KEY");
  }
  return aiClient;
};

// Fallback images in case of API limitations or errors
// 使用精选的高质量玻璃艺术图片
const MOCK_IMAGES = [
  "/images/mock/glass-blown.png",
  "/images/mock/glass-lampwork.png",
  "/images/mock/glass-fused.png",
  "/images/mock/glass-masterpiece.png",
  "/images/mock/glass-student.png",
  "/images/mock/glass-blown.png" // Duplicate for fallback variety if needed
];

// JSON Schema for Glass Recipe
const recipeSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING, description: "作品名称 (中文)" },
    description: { type: Type.STRING, description: "作品设计理念与描述 (中文)" },
    techniques: { type: Type.ARRAY, items: { type: Type.STRING }, description: "所需技法列表 (中文)" },
    difficulty: { type: Type.STRING, enum: ['Beginner', 'Intermediate', 'Advanced', 'Master'] },
    estimatedTime: { type: Type.STRING, description: "预计耗时，例如 '4小时' (中文)" },
    materials: { type: Type.ARRAY, items: { type: Type.STRING }, description: "所需材料列表 (中文)" },
    steps: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          stepNumber: { type: Type.INTEGER },
          instruction: { type: Type.STRING, description: "步骤详情 (中文)" },
          tip: { type: Type.STRING, description: "大师贴士 (中文)" }
        },
        required: ['stepNumber', 'instruction']
      }
    },
    visualPrompt: {
      type: Type.STRING,
      description: "A highly detailed, photorealistic visual prompt in English to generate an image of this glass artwork. Include lighting, texture, and color details."
    }
  },
  required: ['title', 'description', 'techniques', 'difficulty', 'estimatedTime', 'materials', 'steps', 'visualPrompt']
};

// JSON Schema for Comparison Result
const comparisonSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    score: { type: Type.INTEGER, description: "0-100之间的评分" },
    comment: { type: Type.STRING, description: "来自玻璃艺术大师的中文建设性点评" },
    strengths: { type: Type.ARRAY, items: { type: Type.STRING }, description: "优点列表 (中文)" },
    improvements: { type: Type.ARRAY, items: { type: Type.STRING }, description: "改进建议列表 (中文)" }
  },
  required: ['score', 'comment', 'strengths', 'improvements']
};

export const generateGlassRecipe = async (userDescription: string): Promise<GlassRecipe> => {
  try {
    const response = await getAI().models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `作为一位世界级的玻璃艺术大师，请基于这个想法设计一个专业的玻璃制作配方："${userDescription}"。
      
      要求：
      1. 除了 'visualPrompt' 必须保留英文外，其他所有字段（标题、描述、步骤、材料等）必须使用**中文**。
      2. 方案应兼具艺术性与可操作性。
      3. 难度评级请客观评估。`,
      config: {
        responseMimeType: 'application/json',
        responseSchema: recipeSchema,
        systemInstruction: "你是 Lumina，一位专业的玻璃艺术工作室 AI 助手。你提供关于吹制玻璃、灯工和冷加工技术的专家指导。请始终使用中文回答（除了图片生成提示词）。",
      }
    });

    const text = response.text;
    if (!text) throw new Error("Failed to generate recipe data.");

    return JSON.parse(text) as GlassRecipe;
  } catch (error) {
    console.error("Recipe generation failed:", error);
    throw new Error("AI 构思配方时遇到阻碍，请检查网络或稍后重试。");
  }
};

export const generateRecipeFromImage = async (imageBase64: string, prompt?: string): Promise<GeneratedDesign> => {
  try {
    const getBase64 = (dataUrl: string) => dataUrl.split(',')[1];
    const getMimeType = (dataUrl: string) => dataUrl.split(';')[0].split(':')[1];

    const response = await getAI().models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [
        {
          text: `作为一位世界级的玻璃艺术大师，请分析这张图片中的玻璃艺术品。
        1. 识别其工艺技法（如吹制、灯工、窑铸等）。
        2. 反向推导其制作配方。
        3. 如果用户提供了额外描述："${prompt || ''}"，请结合参考。
        
        请严格按照 JSON 格式输出配方数据。要求：
        - 除了 'visualPrompt' 必须保留英文外，其他所有字段（标题、描述、步骤、材料等）必须使用**中文**。
        - 步骤需详尽专业。` },
        {
          inlineData: {
            mimeType: getMimeType(imageBase64),
            data: getBase64(imageBase64)
          }
        }
      ],
      config: {
        responseMimeType: 'application/json',
        responseSchema: recipeSchema,
        systemInstruction: "你是 Lumina，一位专业的玻璃艺术工作室 AI 助手。你擅长通过视觉分析玻璃艺术品的材质、光泽和成型工艺。请始终使用中文回答（除了图片生成提示词）。",
      }
    });

    const text = response.text;
    if (!text) throw new Error("Failed to generate recipe from image.");

    const recipe = JSON.parse(text) as GlassRecipe;

    return {
      imageUrl: imageBase64, // Use the input image as the visual reference
      recipe
    };
  } catch (error) {
    console.error("Image analysis failed:", error);
    throw new Error("AI 无法解析该图片中的玻璃工艺，请尝试更清晰的图片。");
  }
};

export const generateGlassImage = async (visualPrompt: string): Promise<string> => {
  try {
    // Using gemini-2.5-flash-image (Nano Banana) for generation
    // We append a style modifier to ensure the look matches the app's aesthetic
    const enhancedPrompt = `${visualPrompt}, cinematic lighting, 8k resolution, highly detailed glass texture, studio photography, shallow depth of field, masterpiece`;

    const response = await getAI().models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: enhancedPrompt,
      config: {
        // Nano banana models do not support responseMimeType or responseSchema
      }
    });

    // Iterate through parts to find the image
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      }
    }

    throw new Error("No image generated by the model.");
  } catch (error) {
    console.warn("Real image generation failed, falling back to mock:", error);
    // Fallback to high-quality Unsplash image if generation fails (e.g. safety blocks or quota)
    const randomIndex = Math.floor(Math.random() * MOCK_IMAGES.length);
    return MOCK_IMAGES[randomIndex];
  }
};

export const compareDesigns = async (prototypeImage: string, userImage: string): Promise<ComparisonResult> => {
  // If the prototypeImage is from our mock list or local fallback, we return a mock comparison
  // Checking for 'http' is a simple heuristic for demo purposes.
  if (prototypeImage.startsWith('http')) {
    return {
      score: 88,
      comment: "（演示模式）由于原型使用的是参考图库图片，我们为您提供模拟评分。您的作品在形态上还原度很高，光泽感处理得当。",
      strengths: ["整体比例协调", "色彩还原准确", "表面光洁度高"],
      improvements: ["尝试使用AI生成的图片进行真实对比", "注意底部的收口处理", "纹理的流动感可以更自然"]
    };
  }

  try {
    const getBase64 = (dataUrl: string) => dataUrl.split(',')[1];
    const getMimeType = (dataUrl: string) => dataUrl.split(';')[0].split(':')[1];

    const response = await getAI().models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [
        { text: "作为一名严格的玻璃艺术评论家，请对比学员的实物作品（User Creation）与设计原型（Prototype Design）。评估形态、色彩还原度和技术执行力。请务必使用**中文**输出 JSON 结果。" },
        { text: "设计原型 (Prototype Design):" },
        {
          inlineData: {
            mimeType: getMimeType(prototypeImage),
            data: getBase64(prototypeImage)
          }
        },
        { text: "学员实作 (User Creation):" },
        {
          inlineData: {
            mimeType: getMimeType(userImage),
            data: getBase64(userImage)
          }
        }
      ],
      config: {
        responseMimeType: 'application/json',
        responseSchema: comparisonSchema
      }
    });

    const text = response.text;
    if (!text) throw new Error("Failed to generate comparison.");

    return JSON.parse(text) as ComparisonResult;
  } catch (error) {
    console.error("Comparison failed:", error);
    return {
      score: 0,
      comment: "AI 视觉分析服务暂时不可用，请检查网络或稍后重试。",
      strengths: [],
      improvements: []
    };
  }
};

export const generateCraftDescription = async (imageBase64: string): Promise<string> => {
  // 检查是否有 API Key
  const apiKey = localStorage.getItem('lumina_api_key');
  if (!apiKey) {
    // Fallback mock response
    return "这是一件精美的玻璃艺术品，光影效果极佳。通过精湛的火候控制，呈现出独特的流动美感。（AI 试用模式）";
  }

  try {
    const getBase64 = (dataUrl: string) => dataUrl.split(',')[1];
    const getMimeType = (dataUrl: string) => dataUrl.split(';')[0].split(':')[1];

    const response = await getAI().models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [
        { text: "请分析这张玻璃艺术品的图片，用艺术家的口吻写一段简短的“朋友圈”风格文案。重点描述它的工艺特点（如吹制、灯工、颜色叠加等）和视觉美感。字数在80字以内，语气要专业又富有激情。请务必使用中文。" },
        {
          inlineData: {
            mimeType: getMimeType(imageBase64),
            data: getBase64(imageBase64)
          }
        }
      ]
    });

    return response.text || "AI 正在细细品味您的作品...";
  } catch (error) {
    console.error("Description generation failed:", error);
    return "AI 正在细细品味您的作品... (网络请求失败，请稍后重试)";
  }
};