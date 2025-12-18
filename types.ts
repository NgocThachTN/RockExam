
export interface Question {
  type?: 'multiple-choice' | 'reading';
  passage?: string; // For reading/dokkai questions
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface QuizResult {
  total: number;
  score: number;
  answers: {
    questionIndex: number;
    selectedOption: number;
    isCorrect: boolean;
  }[];
}
