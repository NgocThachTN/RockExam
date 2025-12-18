
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
      - Cấu trúc trả về là một danh sách các "Nhóm câu hỏi".
      - Mỗi nhóm có thể là một câu hỏi đơn lẻ hoặc một bài đọc hiểu kèm theo nhiều câu hỏi.
      - Ngôn ngữ: 
        + Giải thích (explanation): Luôn luôn là Tiếng Việt.
        + Câu hỏi (question) và Đáp án (options): 
          * Nếu là môn Tiếng Việt hoặc kiến thức chung: Tiếng Việt.
          * Nếu là môn ngoại ngữ (Tiếng Anh, Tiếng Nhật...): Sử dụng chính ngôn ngữ đó.
      - ĐẶC BIỆT: Nếu nội dung liên quan đến chữ Hán (Kanji) hoặc tiếng Nhật, trong phần giải thích (explanation), hãy viết kèm cách đọc bằng Hiragana ngay sau chữ Hán đó.
      
      ĐỊNH DẠNG JSON:
      Trả về một mảng các object (Nhóm), mỗi object có:
      - "type": "single" (câu đơn) hoặc "reading" (bài đọc hiểu).
      - "passage": Nội dung bài đọc (chỉ bắt buộc nếu type="reading").
      - "questions": Danh sách các câu hỏi thuộc nhóm này.
      
      VỚI BÀI ĐỌC HIỂU (Reading/Dokkai):
      - Tùy thuộc vào nội dung, có thể tạo:
        + Một đoạn văn ngắn đi kèm 1 câu hỏi.
        + HOẶC một bài đọc dài đi kèm nhiều câu hỏi (2-5 câu).
      - Đặt "type": "reading".
      - Điền nội dung bài đọc vào trường "passage".
      `,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              type: { type: Type.STRING, enum: ["single", "reading"] },
              passage: { type: Type.STRING },
              questions: {
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
            },
            required: ["type", "questions"]
          }
        }
      }
    });

    const rawData = JSON.parse(response.text || "[]");
    const flattenedQuestions: Question[] = [];

    for (const group of rawData) {
      if (group.questions && Array.isArray(group.questions)) {
        for (const q of group.questions) {
          flattenedQuestions.push({
            ...q,
            type: group.type === 'reading' ? 'reading' : 'multiple-choice',
            passage: group.type === 'reading' ? group.passage : undefined
          });
        }
      }
    }

    return flattenedQuestions;
  } catch (error) {
    console.error("Quiz generation error:", error);
    throw new Error("Lỗi khi kết nối với AI. Vui lòng thử lại sau.");
  }
}
