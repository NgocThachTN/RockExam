
import { GoogleGenAI, Type } from "@google/genai";
import { Question } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });

export async function generateQuiz(source: { type: 'text' | 'prompt', content: string, note?: string }, count: number = 5): Promise<Question[]> {
  try {
    // Optimized limit to save quota (~15k tokens max)
    const contentLimit = 60000;
    
    let processedContent = source.content;
    if (source.type === 'text' && source.content.length > contentLimit) {
      // Smart sampling: Take start, middle, and end segments to represent the document better
      const segmentSize = 20000;
      const midPoint = Math.floor(source.content.length / 2);
      processedContent = 
        source.content.substring(0, segmentSize) + 
        "\n\n...[ĐOẠN GIỮA]...\n\n" +
        source.content.substring(midPoint - segmentSize / 2, midPoint + segmentSize / 2) +
        "\n\n...[ĐOẠN CUỐI]...\n\n" +
        source.content.substring(source.content.length - segmentSize);
    }

    // Generate a random strategy to force diversity
    const strategies = [
      "Tập trung vào định nghĩa, khái niệm chính.",
      "Tập trung vào quan hệ nguyên nhân - kết quả.",
      "Chọn ngẫu nhiên đoạn văn từ giữa/cuối.",
      "Điền từ hoặc sắp xếp câu."
    ];
    const randomStrategy = strategies[Math.floor(Math.random() * strategies.length)];
    const randomSeed = Math.floor(Math.random() * 1000000);

    const instruction = source.type === 'text' 
      ? `Tạo ${count} câu hỏi trắc nghiệm.
         CHIẾN LƯỢC: "${randomStrategy}"
         ${source.note ? `GHI CHÚ: "${source.note}" (Ưu tiên cao nhất)` : ''}
         YÊU CẦU: Chọn ý ngẫu nhiên, TRÁNH trùng lặp. Seed: ${randomSeed}.
         NỘI DUNG: ${processedContent}`
      : `Tạo ${count} câu hỏi từ: "${source.content}" (Seed: ${randomSeed})`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `${instruction}
      
      OUTPUT JSON: Danh sách nhóm câu hỏi (type: "single"|"reading"). "reading" có "passage".
      
      LOGIC:
      1. TIẾNG NHẬT (JLPT):
         - BẮT BUỘC theo format JLPT:
           + Mojigoi (Từ vựng/Kanji): Hỏi cách đọc (Hiragana) hoặc Kanji đúng.
           + Bunpou (Ngữ pháp): Điền trợ từ/động từ vào "(___)".
           + Dokkai (Đọc hiểu): Đoạn văn ngắn + câu hỏi nội dung.
      2. Ngoại ngữ khác (TOEIC...): Hỏi từ vựng [từ], ngữ pháp, đọc hiểu.
      3. Chuyên môn (Sử, IT...): Hỏi kiến thức, logic. KHÔNG hỏi ngữ pháp.
      
      FORMAT:
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
