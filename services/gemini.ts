
import { GoogleGenAI, Type } from "@google/genai";
import { Question } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });

export async function generateQuiz(source: { type: 'text' | 'prompt', content: string }, count: number = 5): Promise<Question[]> {
  try {
    // Increased substring limit from 18,000 to 250,000 characters to support very long documents
    const contentLimit = 250000;
    
    // Generate a random strategy to force diversity
    const strategies = [
      "Tập trung vào các định nghĩa, khái niệm chính và ý nghĩa của chúng.",
      "Tập trung vào mối quan hệ nguyên nhân - kết quả và các lập luận logic.",
      "Chọn ngẫu nhiên các đoạn văn từ giữa hoặc cuối văn bản để đặt câu hỏi.",
      "Điền từ vào chỗ trống hoặc sắp xếp trật tự từ trong câu."
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
      : `Tạo ${count} câu hỏi trắc nghiệm từ yêu cầu: "${source.content}" (Seed: ${randomSeed})`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `${instruction}
      
      QUY ĐỊNH JSON:
      - Trả về danh sách "Nhóm câu hỏi" (type: "single" hoặc "reading").
      - "reading": có trường "passage".
      - "questions": mảng các câu hỏi.
      
      QUY ĐỊNH NỘI DUNG:
      - PHÂN TÍCH TÀI LIỆU ĐỂ CHỌN LOẠI CÂU HỎI:
        1. Nếu là tài liệu học ngoại ngữ (VD: Luyện thi JLPT, TOEIC): Tập trung vào từ vựng, ngữ pháp, đọc hiểu.
        2. Nếu là tài liệu kiến thức chuyên môn (VD: Lịch sử, Địa lý, IT, Y học...): Tập trung hỏi về kiến thức, sự kiện, khái niệm, logic. KHÔNG hỏi về ngữ pháp/từ vựng.
      
      - ĐỊNH DẠNG CHUNG:
        - TỪ VỰNG (chỉ dùng cho loại 1): Đặt từ cần hỏi trong ngoặc vuông [ ].
        - ĐIỀN TỪ: Dùng ký hiệu "(___)" để biểu thị chỗ trống.
        - KHÔNG dùng Markdown (**in đậm**).
        - Giải thích: Tiếng Việt chi tiết.
        - Câu hỏi/Đáp án: Giữ nguyên ngôn ngữ của văn bản gốc (hoặc Tiếng Việt nếu văn bản là Tiếng Việt).
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
