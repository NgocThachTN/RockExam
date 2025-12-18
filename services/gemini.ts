
import { GoogleGenAI, Type } from "@google/genai";
import { Question } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });

export async function generateQuiz(source: { type: 'text' | 'prompt', content: string }, count: number = 5): Promise<Question[]> {
  try {
    // Increased substring limit from 18,000 to 250,000 characters to support very long documents
    const contentLimit = 250000;
    
    // Generate a random strategy to force diversity
    const strategies = [
      "JLPT Ngữ pháp (Bunpou): Trợ từ, chia động từ, cấu trúc câu, kính ngữ.",
      "JLPT Từ vựng (Goi/Kanji): Cách đọc, ý nghĩa, từ gần nghĩa, cách dùng từ.",
      "JLPT Đọc hiểu (Dokkai): Ý chính, đại từ chỉ định, lý do, nội dung chi tiết.",
      "Tập trung vào các định nghĩa, khái niệm chính và ý nghĩa của chúng.",
      "Tập trung vào mối quan hệ nguyên nhân - kết quả và các lập luận logic.",
      "Chọn ngẫu nhiên các đoạn văn từ giữa hoặc cuối văn bản để đặt câu hỏi.",
      "Điền từ vào chỗ trống hoặc sắp xếp trật tự từ trong câu (Mondai sắp xếp)."
    ];
    const randomStrategy = strategies[Math.floor(Math.random() * strategies.length)];
    const randomSeed = Math.floor(Math.random() * 1000000);

    const instruction = source.type === 'text' 
      ? `Tạo ${count} câu hỏi trắc nghiệm từ tài liệu sau.
         CHIẾN LƯỢC: "${randomStrategy}"
         YÊU CẦU: 
         - Chọn khía cạnh ngẫu nhiên, TRÁNH trùng lặp.
         - Seed: ${randomSeed}.
         NỘI DUNG: ${source.content.substring(0, contentLimit)}`
      : `Tạo ${count} câu hỏi trắc nghiệm từ yêu cầu: "${source.content}" (Chiến lược: "${randomStrategy}", Seed: ${randomSeed})`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `${instruction}
      
      QUY ĐỊNH JSON:
      - Trả về danh sách "Nhóm câu hỏi" (type: "single" hoặc "reading").
      - "reading": có trường "passage".
      - "questions": mảng các câu hỏi.
      
      QUY ĐỊNH NỘI DUNG:
      - ƯU TIÊN ĐỊNH DẠNG JLPT nếu nội dung là tiếng Nhật.
      - TỪ VỰNG/KANJI: Đặt từ cần hỏi trong ngoặc vuông [ ]. Ví dụ: "Cách đọc của [導入] là gì?".
      - ĐIỀN TỪ/NGỮ PHÁP: Dùng ký hiệu "(___)" để biểu thị chỗ trống. Ví dụ: "熱い(___)に、召し上がってください。".
      - KHÔNG dùng Markdown (**in đậm**).
      - Giải thích: Tiếng Việt chi tiết, giải thích ngữ pháp/từ vựng liên quan.
      - Câu hỏi/Đáp án: Tiếng Nhật (nếu là đề thi tiếng Nhật) hoặc Tiếng Việt.
      - Kanji/Tiếng Nhật: Kèm Hiragana trong giải thích.
      `,
      config: {
        temperature: 0.9,
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
