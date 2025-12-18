
import React, { useState } from 'react';
import { Question } from '../../types';

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

  return (
    <div className="max-w-3xl mx-auto">
      {/* HUD Progress Bar */}
      <div className="mb-6 md:mb-8">
        <div className="flex justify-between items-end mb-2 font-mono text-[10px] font-black uppercase tracking-widest text-zinc-400">
          <span>Tiến độ</span>
          <span>{currentIndex + 1} / {questions.length}</span>
        </div>
        <div className="h-2.5 w-full bg-zinc-200 dark:bg-zinc-800 border-2 border-zinc-900 dark:border-zinc-700 p-0.5 overflow-hidden rounded-full">
          <div className="h-full bg-zinc-900 dark:bg-zinc-100 transition-all duration-500 ease-out rounded-full" style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }} />
        </div>
      </div>

      {/* Main Card */}
      <div className="bg-white dark:bg-zinc-900 border-2 border-zinc-900 dark:border-zinc-700 p-6 md:p-10 sharp-shadow relative">
          
          {/* Question */}
          <div className="mb-8 md:mb-10 text-left">
             <h3 className="text-xl md:text-2xl font-black leading-snug uppercase tracking-tight text-zinc-900 dark:text-zinc-100 w-full">
                Câu {currentIndex + 1}: {q.question}
             </h3>
          </div>

          {/* Options */}
          <div className="grid gap-3 mb-8">
            {q.options.map((opt, i) => {
              const isCorrect = i === q.correctIndex;
              const isSelected = i === selected;
              
              let stateClass = "border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/50";
              if (isSelected) stateClass = "border-zinc-900 dark:border-zinc-100 bg-zinc-100 dark:bg-zinc-800 ring-1 ring-zinc-900 dark:ring-zinc-100";
              if (isAnswered) {
                if (isCorrect) stateClass = "bg-green-100 dark:bg-green-950/40 border-green-600 text-green-700 dark:text-green-400 font-bold";
                else if (isSelected) stateClass = "bg-red-100 dark:bg-red-950/40 border-red-600 text-red-700 dark:text-red-400 font-bold opacity-50";
                else stateClass = "border-zinc-100 dark:border-zinc-900 opacity-30 grayscale";
              }

              return (
                <button
                  key={i}
                  disabled={isAnswered}
                  onClick={() => setSelected(i)}
                  className={`group flex items-center p-4 md:p-5 border-2 text-left transition-all rounded-lg ${stateClass}`}
                >
                  <span className={`w-8 h-8 flex items-center justify-center font-mono text-xs font-black border-2 mr-4 shrink-0 transition-all rounded ${isSelected ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 border-zinc-900 dark:border-zinc-100' : 'border-zinc-200 dark:border-zinc-800 group-hover:border-zinc-900 dark:group-hover:border-zinc-100'}`}>
                    {String.fromCharCode(65 + i)}
                  </span>
                  <span className="text-sm md:text-lg font-medium">{opt}</span>
                </button>
              );
            })}
          </div>

          {/* Explanation */}
           {isAnswered && (
             <div className="mb-8 p-6 bg-zinc-50 dark:bg-zinc-800/30 border-l-4 border-zinc-900 dark:border-zinc-100 animate-in fade-in slide-in-from-top-2">
                <div className="flex items-center gap-2 mb-2 text-zinc-500">
                   <span className="text-[10px] font-black uppercase tracking-widest">Giải thích</span>
                </div>
                <p className="text-sm md:text-base leading-relaxed text-zinc-700 dark:text-zinc-300 italic">
                  {q.explanation}
                </p>
             </div>
           )}

          {/* Actions */}
          <div className="flex justify-center pt-4">
              {!isAnswered ? (
                <button
                  onClick={handleCheck}
                  disabled={selected === null}
                  className="w-full md:w-auto px-12 py-4 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-950 font-black uppercase tracking-widest text-sm disabled:opacity-20 hover:scale-105 transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)]"
                >
                  CHỐT ĐÁP ÁN
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  className="w-full md:w-auto px-12 py-4 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-950 font-black uppercase tracking-widest text-sm hover:scale-105 transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)]"
                >
                  {currentIndex < questions.length - 1 ? 'CÂU KẾ TIẾP' : 'XEM KẾT QUẢ'}
                </button>
              )}
          </div>
      </div>
    </div>
  );
};

export default QuizView;
