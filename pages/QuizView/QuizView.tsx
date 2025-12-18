
import React, { useState, useEffect } from 'react';
import { Question } from '../../types';
import StandardQuestion from './components/StandardQuestion';
import ReadingQuestion from './components/ReadingQuestion';

interface QuizViewProps {
  questions: Question[];
  onRestart: () => void;
  timeLimit?: number | null;
}

const QuizView: React.FC<QuizViewProps> = ({ questions, onRestart, timeLimit }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number | null>(timeLimit ? timeLimit * 60 : null);

  const [userAnswers, setUserAnswers] = useState<(number | null)[]>([]);

  useEffect(() => {
    if (timeLeft === null || finished) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev !== null && prev <= 1) {
          clearInterval(timer);
          setFinished(true);
          return 0;
        }
        return prev !== null ? prev - 1 : null;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, finished]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

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
    
    const newAnswers = [...userAnswers];
    newAnswers[currentIndex] = selected;
    setUserAnswers(newAnswers);

    if (selected === q.correctIndex) setScore(s => s + 1);

    if (timeLimit) {
      // Mock mode: Move to next question immediately without showing result
      if (currentIndex < questions.length - 1) {
        setCurrentIndex(c => c + 1);
        setSelected(null);
      } else {
        setFinished(true);
      }
    } else {
      // Practice mode: Show result
      setIsAnswered(true);
    }
  };

  if (finished) {
    return (
      <div className="max-w-7xl mx-auto p-4 md:p-8">
        <div className="flex flex-col-reverse md:flex-row gap-8">
          {/* Left Column: Details */}
          <div className="flex-1 space-y-8 animate-slide-up">
              <h3 className="text-2xl font-black uppercase tracking-tighter text-zinc-900 dark:text-zinc-100 border-b-2 border-zinc-900 dark:border-zinc-100 pb-4">Chi tiết bài làm</h3>
              {questions.map((q, index) => {
                  const userAnswer = userAnswers[index];
                  const isCorrect = userAnswer === q.correctIndex;
                  
                  return (
                      <div key={index} className={`bg-sky-50 dark:bg-zinc-900 border-2 p-6 ${isCorrect ? 'border-zinc-200 dark:border-zinc-800' : 'border-red-500 dark:border-red-500'}`}>
                          <div className="flex items-start gap-4">
                              <div className={`shrink-0 w-8 h-8 flex items-center justify-center font-black text-sm border-2 ${isCorrect ? 'bg-zinc-900 text-white border-zinc-900 dark:bg-zinc-100 dark:text-zinc-950' : 'bg-red-500 text-white border-red-500'}`}>
                                  {index + 1}
                              </div>
                              <div className="flex-1 min-w-0">
                                  <p className="font-bold text-lg text-zinc-900 dark:text-zinc-100 mb-4 break-words">{q.question}</p>
                                  
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-4">
                                      {q.options.map((opt, i) => {
                                          const isOptCorrect = i === q.correctIndex;
                                          const isOptSelected = i === userAnswer;
                                          
                                          let style = "border-zinc-200 dark:border-zinc-800 opacity-50";
                                          if (isOptCorrect) style = "border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 font-bold opacity-100";
                                          else if (isOptSelected) style = "border-red-500 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 font-bold opacity-100";
                                          
                                          return (
                                              <div key={i} className={`p-3 border-2 rounded text-sm ${style}`}>
                                                  <span className="font-black mr-2">{String.fromCharCode(65 + i)}.</span>
                                                  {opt}
                                              </div>
                                          )
                                      })}
                                  </div>

                                  <div className="bg-zinc-50 dark:bg-zinc-800/50 p-4 border-l-4 border-zinc-900 dark:border-zinc-100 text-sm text-zinc-600 dark:text-zinc-400 italic">
                                      <span className="font-black not-italic mr-2 text-zinc-900 dark:text-zinc-100">GIẢI THÍCH:</span>
                                      {q.explanation}
                                  </div>
                              </div>
                          </div>
                      </div>
                  );
              })}
          </div>

          {/* Right Column: Summary (Sticky) */}
          <div className="w-full md:w-80 shrink-0">
            <div className="sticky top-24 bg-white dark:bg-zinc-900 border-4 border-zinc-900 dark:border-zinc-100 sharp-shadow text-center p-6 md:p-8">
              <div className="mb-6">
                <span className="bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-950 px-3 py-1 text-[10px] font-black uppercase tracking-widest">Hoàn thành</span>
                <h2 className="text-3xl font-black uppercase mt-4 tracking-tighter text-zinc-900 dark:text-zinc-100">BÁO CÁO</h2>
              </div>
              
              <div className="flex flex-col items-center gap-2 mb-8 py-6 border-y-2 border-zinc-100 dark:border-zinc-800">
                <div className="font-mono text-6xl font-black text-zinc-900 dark:text-zinc-100 leading-none">
                  {score}
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-zinc-400 font-black uppercase text-[10px] tracking-widest">Tổng câu đúng</span>
                  <span className="text-xl font-bold text-zinc-900 dark:text-zinc-100">/ {questions.length}</span>
                </div>
              </div>

              <button 
                onClick={onRestart}
                className="w-full py-4 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-950 font-black uppercase tracking-[0.2em] text-sm hover:invert transition-all"
              >
                LÀM ĐỀ MỚI
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const renderContent = () => {
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
          isMock={!!timeLimit}
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
        isMock={!!timeLimit}
      />
    );
  };

  return (
    <div className="relative">
      {timeLeft !== null && (
        <div className={`fixed top-20 right-4 md:right-8 z-40 px-4 py-2 font-mono font-black text-xl border-2 shadow-lg transition-colors ${timeLeft < 60 ? 'bg-red-500 text-white border-red-600 animate-pulse' : 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 border-white dark:border-zinc-900'}`}>
          {formatTime(timeLeft)}
        </div>
      )}
      {renderContent()}
    </div>
  );
};

export default QuizView;
