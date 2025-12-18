import React from 'react';
import { Question } from '../../../types';

interface ReadingQuestionProps {
  question: Question;
  currentIndex: number;
  totalQuestions: number;
  selected: number | null;
  isAnswered: boolean;
  onSelect: (index: number) => void;
  onCheck: () => void;
  onNext: () => void;
}

const ReadingQuestion: React.FC<ReadingQuestionProps> = ({
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
    <div className="max-w-6xl mx-auto">
      {/* HUD Progress Bar */}
      <div className="mb-6 md:mb-8">
        <div className="flex justify-between items-end mb-2 font-mono text-[10px] font-black uppercase tracking-widest text-zinc-400">
          <span>Tiến độ (Reading)</span>
          <span>{currentIndex + 1} / {totalQuestions}</span>
        </div>
        <div className="h-2.5 w-full bg-zinc-200 dark:bg-zinc-800 border-2 border-zinc-900 dark:border-zinc-700 p-0.5 overflow-hidden rounded-full">
          <div className="h-full bg-zinc-900 dark:bg-zinc-100 transition-all duration-500 ease-out rounded-full" style={{ width: `${((currentIndex + 1) / totalQuestions) * 100}%` }} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Passage */}
        <div className="h-full">
            <div className="bg-white dark:bg-zinc-900 border-2 border-zinc-900 dark:border-zinc-700 p-6 md:p-8 sharp-shadow h-full overflow-y-auto max-h-[80vh]">
                <div className="flex items-center gap-2 mb-4 text-zinc-500 border-b-2 border-zinc-100 dark:border-zinc-800 pb-2">
                   <span className="text-[10px] font-black uppercase tracking-widest">Bài đọc</span>
                </div>
                <div className="prose dark:prose-invert max-w-none text-base md:text-lg leading-relaxed whitespace-pre-wrap font-serif">
                    {q.passage || "Không có nội dung bài đọc."}
                </div>
            </div>
        </div>

        {/* Right Column: Question & Options */}
        <div className="flex flex-col">
            <div className="bg-white dark:bg-zinc-900 border-2 border-zinc-900 dark:border-zinc-700 p-6 md:p-8 sharp-shadow relative flex-1">
                
                {/* Question */}
                <div className="mb-6 md:mb-8 text-left">
                   <h3 className="text-lg md:text-xl font-black leading-snug uppercase tracking-tight text-zinc-900 dark:text-zinc-100 w-full">
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
                        className={`group flex items-center p-3 md:p-4 border-2 text-left transition-all rounded-lg ${stateClass}`}
                      >
                        <span className={`w-6 h-6 flex items-center justify-center font-mono text-[10px] font-black border-2 mr-3 shrink-0 transition-all rounded ${isSelected ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 border-zinc-900 dark:border-zinc-100' : 'border-zinc-200 dark:border-zinc-800 group-hover:border-zinc-900 dark:group-hover:border-zinc-100'}`}>
                          {String.fromCharCode(65 + i)}
                        </span>
                        <span className="text-sm font-medium">{opt}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Explanation */}
                 {isAnswered && (
                   <div className="mb-8 p-4 bg-zinc-50 dark:bg-zinc-800/30 border-l-4 border-zinc-900 dark:border-zinc-100 animate-in fade-in slide-in-from-top-2">
                      <div className="flex items-center gap-2 mb-2 text-zinc-500">
                         <span className="text-[10px] font-black uppercase tracking-widest">Giải thích</span>
                      </div>
                      <p className="text-sm leading-relaxed text-zinc-700 dark:text-zinc-300 italic">
                        {q.explanation}
                      </p>
                   </div>
                 )}

                {/* Actions */}
                <div className="flex justify-center pt-4 mt-auto">
                    {!isAnswered ? (
                      <button
                        onClick={onCheck}
                        disabled={selected === null}
                        className="w-full px-8 py-3 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-950 font-black uppercase tracking-widest text-xs disabled:opacity-20 hover:scale-105 transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)]"
                      >
                        CHỐT ĐÁP ÁN
                      </button>
                    ) : (
                      <button
                        onClick={onNext}
                        className="w-full px-8 py-3 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-950 font-black uppercase tracking-widest text-xs hover:scale-105 transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)]"
                      >
                        {currentIndex < totalQuestions - 1 ? 'CÂU KẾ TIẾP' : 'XEM KẾT QUẢ'}
                      </button>
                    )}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ReadingQuestion;
