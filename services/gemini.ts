
import { GoogleGenAI, Type } from "@google/genai";
import { Question } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });

export async function generateQuiz(source: { type: 'text' | 'prompt', content: string, note?: string }, count: number = 5): Promise<Question[]> {
  try {
    // Optimized limit to save quota (~15k tokens max)
    const contentLimit = 60000;
    
    let processedContent = source.content;
    if (source.type === 'text' && source.content.length > contentLimit) {
      // Random sampling: Pick random chunks to ensure different questions each time
      const chunkSize = 15000;
      const numChunks = 3;
      const maxStartIndex = source.content.length - chunkSize;
      
      const chunks = [];
      // Always try to include a bit of the beginning for context
      chunks.push(source.content.substring(0, 5000)); 
      
      for (let i = 0; i < numChunks; i++) {
          const randomStart = Math.floor(Math.random() * maxStartIndex);
          chunks.push(source.content.substring(randomStart, randomStart + chunkSize));
      }
      
      processedContent = chunks.join("\n\n... [ĐOẠN TIẾP THEO] ...\n\n");
    }

    // Generate a random strategy to force diversity
    const strategies = [
      "Tập trung vào chi tiết nhỏ và các ngoại lệ.",
      "Tập trung vào quan hệ nguyên nhân - kết quả phức tạp.",
      "Chọn ngẫu nhiên đoạn văn bất kỳ để hỏi.",
      "Hỏi về các ứng dụng thực tế hoặc tình huống cụ thể."
    ];
    const randomStrategy = strategies[Math.floor(Math.random() * strategies.length)];
    const randomSeed = Math.floor(Math.random() * 1000000);

    const instruction = source.type === 'text' 
      ? `Tạo ${count} câu hỏi trắc nghiệm.
         CHIẾN LƯỢC: "${randomStrategy}"
         ${source.note ? `GHI CHÚ: "${source.note}" (Ưu tiên cao nhất)` : ''}
         YÊU CẦU: Chọn ý ngẫu nhiên, TRÁNH trùng lặp. Seed: ${randomSeed}-${Date.now()}.
         NỘI DUNG: ${processedContent}`
      : `Tạo ${count} câu hỏi trắc nghiệm về chủ đề: "${source.content}".
         YÊU CẦU QUAN TRỌNG:
         - KHÔNG hỏi những câu hỏi phổ biến nhất. Hãy tìm các khía cạnh cụ thể, chi tiết hoặc nâng cao.
         - Đổi mới hoàn toàn so với các lần trước.
         - Seed ngẫu nhiên: ${randomSeed}-${Date.now()}.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `${instruction}
      
      OUTPUT JSON: Danh sách nhóm câu hỏi (type: "single"|"reading"). "reading" có "passage".
      
      LOGIC:
      1. TIẾNG NHẬT (JLPT):
         - BẮT BUỘC theo format JLPT:
           + Mojigoi (Từ vựng/Kanji): Hỏi cách đọc (Hiragana) hoặc Kanji đúng. TỪ CẦN HỎI phải để trong ngoặc vuông [ ] để gạch chân.
           + Bunpou (Ngữ pháp): Điền trợ từ/động từ vào "(___)".
           + Dokkai (Đọc hiểu): Đoạn văn ngắn + câu hỏi nội dung.
      2. Ngoại ngữ khác (TOEIC...): Hỏi từ vựng [từ], ngữ pháp, đọc hiểu.
      3. Chuyên môn (Sử, IT...): Hỏi kiến thức, logic. KHÔNG hỏi ngữ pháp.
      
      FORMAT:
      - TỪ VỰNG/KANJI (Bắt buộc): Đặt từ cần hỏi trong ngoặc vuông [ ] (Ví dụ: [漢字]の読み方...).
      - Điền từ: "(___)"
      - KHÔNG Markdown.
      - Giải thích: Tiếng Việt chi tiết.
        * ĐẶC BIỆT VỚI TIẾNG NHẬT: Giải thích phải bao gồm cách đọc Hiragana của Kanji và nghĩa tiếng Việt.
      - Câu hỏi/Đáp án: Giữ nguyên ngôn ngữ gốc.
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
          // Shuffle options to prevent "Always A" bias from AI
          const options = [...(q.options || [])];
          let correctIndex = q.correctIndex;

          if (options.length > 0 && typeof correctIndex === 'number' && correctIndex >= 0 && correctIndex < options.length) {
             const correctOption = options[correctIndex];
             // Fisher-Yates shuffle
             for (let i = options.length - 1; i > 0; i--) {
               const j = Math.floor(Math.random() * (i + 1));
               [options[i], options[j]] = [options[j], options[i]];
             }
             correctIndex = options.indexOf(correctOption);
          }

          flattenedQuestions.push({
            ...q,
            options,
            correctIndex,
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
