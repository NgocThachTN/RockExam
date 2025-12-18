
import React, { useState } from 'react';
import { Question } from '../types';

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
      <div className="max-w-2xl mx-auto p-16 bg-white dark:bg-zinc-900 border-4 border-zinc-900 dark:border-zinc-100 sharp-shadow">
        <div className="mb-10">
          <span className="bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-950 px-3 py-1 text-[10px] font-black uppercase tracking-widest">Hoàn thành</span>
          <h2 className="text-6xl font-black uppercase mt-4 tracking-tighter">BÁO CÁO</h2>
        </div>
        
        <div className="flex items-center gap-8 mb-12 py-8 border-y-2 border-zinc-100 dark:border-zinc-800">
          <div className="font-mono text-8xl font-black text-zinc-900 dark:text-zinc-100 leading-none">
            {score}
          </div>
          <div className="flex flex-col">
            <span className="text-zinc-400 font-black uppercase text-[10px] tracking-widest">Tổng câu đúng</span>
            <span className="text-2xl font-bold">/ {questions.length}</span>
          </div>
        </div>

        <button 
          onClick={onRestart}
          className="w-full py-6 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-950 font-black uppercase tracking-[0.4em] text-sm hover:invert transition-all"
        >
          LÀM ĐỀ MỚI
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* HUD Progress Bar */}
      <div className="mb-12">
        <div className="flex justify-between items-end mb-3 font-mono text-[10px] font-black uppercase tracking-widest text-zinc-400">
          <span>Tiến độ thực hiện</span>
          <span>{currentIndex + 1} OF {questions.length}</span>
        </div>
        <div className="h-4 w-full bg-zinc-200 dark:bg-zinc-800 border-2 border-zinc-900 dark:border-zinc-700 p-0.5 overflow-hidden">
          <div className="h-full bg-zinc-900 dark:bg-zinc-100 transition-all duration-700 ease-out" style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }} />
        </div>
      </div>

      <div className="grid md:grid-cols-[1fr_350px] gap-8">
        {/* Question Area */}
        <div className="bg-white dark:bg-zinc-900 border-2 border-zinc-900 dark:border-zinc-700 p-10 sharp-shadow">
          <div className="mb-12">
             <div className="w-12 h-1 bg-zinc-900 dark:bg-zinc-100 mb-6" />
             <h3 className="text-3xl font-black leading-none uppercase tracking-tighter text-zinc-900 dark:text-zinc-100">
                {q.question}
             </h3>
          </div>

          <div className="grid gap-3">
            {q.options.map((opt, i) => {
              const isCorrect = i === q.correctIndex;
              const isSelected = i === selected;
              
              let stateClass = "border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/50";
              if (isSelected) stateClass = "border-zinc-900 dark:border-zinc-100 bg-zinc-100 dark:bg-zinc-800";
              if (isAnswered) {
                if (isCorrect) stateClass = "bg-green-100 dark:bg-green-950/40 border-green-600 text-green-700 dark:text-green-400 font-bold scale-[1.02] z-10";
                else if (isSelected) stateClass = "bg-red-100 dark:bg-red-950/40 border-red-600 text-red-700 dark:text-red-400 font-bold";
                else stateClass = "border-zinc-100 dark:border-zinc-900 opacity-30";
              }

              return (
                <button
                  key={i}
                  disabled={isAnswered}
                  onClick={() => setSelected(i)}
                  className={`group flex items-center p-6 border-2 text-left transition-all ${stateClass} relative`}
                >
                  <span className={`w-8 h-8 flex items-center justify-center font-mono text-xs font-black border-2 mr-6 shrink-0 transition-all ${isSelected ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 border-zinc-900 dark:border-zinc-100' : 'border-zinc-200 dark:border-zinc-800 group-hover:bg-zinc-900 group-hover:text-white'}`}>
                    {String.fromCharCode(65 + i)}
                  </span>
                  <span className="text-sm md:text-base font-medium">{opt}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Sidebar Actions/Explanations */}
        <div className="space-y-6">
           <div className="bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-950 p-8 border-2 border-zinc-900 dark:border-zinc-100">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-6 opacity-60">Thao tác</p>
              {!isAnswered ? (
                <button
                  onClick={handleCheck}
                  disabled={selected === null}
                  className="w-full py-4 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 font-black uppercase tracking-widest text-xs disabled:opacity-20 hover:scale-105 transition-all shadow-[4px_4px_0px_0px_rgba(255,255,255,0.3)]"
                >
                  CHỐT ĐÁP ÁN
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  className="w-full py-4 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 font-black uppercase tracking-widest text-xs hover:scale-105 transition-all shadow-[4px_4px_0px_0px_rgba(255,255,255,0.3)]"
                >
                  {currentIndex < questions.length - 1 ? 'CÂU KẾ TIẾP' : 'XEM KẾT QUẢ'}
                </button>
              )}
           </div>

           {isAnswered && (
             <div className="bg-white dark:bg-zinc-900 p-8 border-2 border-zinc-900 dark:border-zinc-700 animate-in fade-in slide-in-from-bottom duration-500">
                <div className="flex items-center gap-2 mb-4 text-zinc-400">
                   <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" /></svg>
                   <span className="text-[10px] font-black uppercase tracking-widest">Phân tích chuyên sâu</span>
                </div>
                <p className="text-sm leading-relaxed text-zinc-700 dark:text-zinc-300 font-medium italic">
                  {q.explanation}
                </p>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default QuizView;
