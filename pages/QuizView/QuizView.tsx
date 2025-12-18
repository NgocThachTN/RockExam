
import React, { useState } from 'react';
import { Question } from '../../types';
import StandardQuestion from './components/StandardQuestion';
import ReadingQuestion from './components/ReadingQuestion';

interface QuizViewProps {
  questions: Question[];
  onRestart: () => void;
}

const QuizView: React.FC<QuizViewProps> = ({ questions, onRestart }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const q = questions[currentIndex];

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(c => c + 1);
      setSelected(null);
      setIsAnswered(false);
    } else {
      setFinished(true);
    }
  };

  const handleCheck = () => {
    if (selected === null) return;
    setIsAnswered(true);
    if (selected === q.correctIndex) setScore(s => s + 1);
  };

  if (finished) {
    return (
      <div className="max-w-2xl mx-auto p-8 md:p-16 bg-white dark:bg-zinc-900 border-4 border-zinc-900 dark:border-zinc-100 sharp-shadow text-center">
        <div className="mb-10">
          <span className="bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-950 px-3 py-1 text-[10px] font-black uppercase tracking-widest">Hoàn thành</span>
          <h2 className="text-4xl md:text-6xl font-black uppercase mt-4 tracking-tighter">BÁO CÁO</h2>
        </div>
        
        <div className="flex flex-col items-center gap-4 mb-12 py-8 border-y-2 border-zinc-100 dark:border-zinc-800">
          <div className="font-mono text-8xl font-black text-zinc-900 dark:text-zinc-100 leading-none">
            {score}
          </div>
          <div className="flex flex-col items-center">
            <span className="text-zinc-400 font-black uppercase text-[10px] tracking-widest">Tổng câu đúng</span>
            <span className="text-2xl font-bold">/ {questions.length}</span>
          </div>
        </div>

        <button 
          onClick={onRestart}
          className="w-full py-4 md:py-6 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-950 font-black uppercase tracking-[0.4em] text-sm hover:invert transition-all"
        >
          LÀM ĐỀ MỚI
        </button>
      </div>
    );
  }

  if (q.type === 'reading' && q.passage) {
    return (
      <ReadingQuestion
        question={q}
        currentIndex={currentIndex}
        totalQuestions={questions.length}
        selected={selected}
        isAnswered={isAnswered}
        onSelect={setSelected}
        onCheck={handleCheck}
        onNext={handleNext}
      />
    );
  }

  return (
    <StandardQuestion
      question={q}
      currentIndex={currentIndex}
      totalQuestions={questions.length}
      selected={selected}
      isAnswered={isAnswered}
      onSelect={setSelected}
      onCheck={handleCheck}
      onNext={handleNext}
    />
  );
};

export default QuizView;
