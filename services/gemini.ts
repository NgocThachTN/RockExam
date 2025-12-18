
import { GoogleGenAI, Type } from "@google/genai";
import { Question } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });

export async function generateQuiz(source: { type: 'text' | 'prompt', content: string }, count: number = 5): Promise<Question[]> {
  try {
    // Increased substring limit from 18,000 to 250,000 characters to support very long documents
    const contentLimit = 250000;
    const instruction = source.type === 'text' 
      ? `Dựa trên nội dung tài liệu sau đây, hãy tạo ra ${count} câu hỏi trắc nghiệm ôn thi: \n\n ${source.content.substring(0, contentLimit)}`
      : `Hãy tạo ra một đề thi trắc nghiệm gồm ${count} câu hỏi dựa trên yêu cầu sau: "${source.content}"`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `${instruction}
      
      YÊU CẦU QUAN TRỌNG:
      - Mỗi câu hỏi phải có đúng 4 phương án trả lời.
      - Có 1 đáp án đúng duy nhất.
      - Lời giải thích chi tiết tại sao đáp án đó đúng và lý do các phương án còn lại sai.
      - Ngôn ngữ: Tiếng Việt.
      - ĐẶC BIỆT: Nếu nội dung liên quan đến chữ Hán (Kanji) hoặc tiếng Nhật, trong phần giải thích (explanation), hãy viết kèm cách đọc bằng Hiragana ngay sau chữ Hán đó (ví dụ: Chữ Hán [Hiragana]), tuyệt đối KHÔNG sử dụng thẻ Furigana hay định dạng HTML phức tạp cho phần cách đọc.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              question: { type: Type.STRING },
              options: { 
                type: Type.ARRAY, 
                items: { type: Type.STRING }
              },
              correctIndex: { type: Type.INTEGER },
              explanation: { type: Type.STRING }
            },
            required: ["question", "options", "correctIndex", "explanation"]
          }
        }
      }
    });

    return JSON.parse(response.text || "[]");
  } catch (error) {
    console.error("Quiz generation error:", error);
    throw new Error("Lỗi khi kết nối với AI. Vui lòng thử lại sau.");
  }
}
