import React from 'react';
import { Question } from '../../../types';

interface StandardQuestionProps {
  question: Question;
  currentIndex: number;
  totalQuestions: number;
  selected: number | null;
  isAnswered: boolean;
  onSelect: (index: number) => void;
  onCheck: () => void;
  onNext: () => void;
}

const StandardQuestion: React.FC<StandardQuestionProps> = ({
  question: q,
  currentIndex,
  totalQuestions,
  selected,
  isAnswered,
  onSelect,
  onCheck,
  onNext,
}) => {
  const renderQuestionText = (text: string) => {
    const parts = text.split(/(\[.*?\])/g);
    return parts.map((part, index) => {
      if (part.startsWith('[') && part.endsWith(']')) {
        return (
          <span key={index} className="border-b-2 border-zinc-900 dark:border-zinc-100 pb-0.5 mx-1 font-bold inline-block">
            {part.slice(1, -1)}
          </span>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* HUD Progress Bar */}
      <div className="mb-6 md:mb-8">
        <div className="flex justify-between items-end mb-2 font-mono text-[10px] font-black uppercase tracking-widest text-zinc-400">
          <span>Tiến độ</span>
          <span>{currentIndex + 1} / {totalQuestions}</span>
        </div>
        <div className="h-2.5 w-full bg-zinc-200 dark:bg-zinc-800 border-2 border-zinc-900 dark:border-zinc-700 p-0.5 overflow-hidden rounded-full">
          <div className="h-full bg-zinc-900 dark:bg-zinc-100 transition-all duration-500 ease-out rounded-full" style={{ width: `${((currentIndex + 1) / totalQuestions) * 100}%` }} />
        </div>
      </div>

      {/* Main Card */}
      <div className="bg-white dark:bg-zinc-900 border-2 border-zinc-900 dark:border-zinc-700 p-6 md:p-10 sharp-shadow relative">
          
          {/* Question */}
          <div className="mb-8 md:mb-10 text-left">
             <h3 className="text-xl md:text-2xl font-black leading-snug uppercase tracking-tight text-zinc-900 dark:text-zinc-100 w-full">
                Câu {currentIndex + 1}: {renderQuestionText(q.question)}
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
                  onClick={() => onSelect(i)}
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
                  onClick={onCheck}
                  disabled={selected === null}
                  className="w-full md:w-auto px-12 py-4 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-950 font-black uppercase tracking-widest text-sm disabled:opacity-20 hover:scale-105 transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)]"
                >
                  CHỐT ĐÁP ÁN
                </button>
              ) : (
                <button
                  onClick={onNext}
                  className="w-full md:w-auto px-12 py-4 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-950 font-black uppercase tracking-widest text-sm hover:scale-105 transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)]"
                >
                  {currentIndex < totalQuestions - 1 ? 'CÂU KẾ TIẾP' : 'XEM KẾT QUẢ'}
                </button>
              )}
          </div>
      </div>
    </div>
  );
};

export default StandardQuestion;
