
import React, { useState, useEffect } from 'react';
import Home from './pages/Home/Home';
import QuizView from './pages/QuizView/QuizView';
import MatrixRain from './components/MatrixRain';
import { generateQuiz } from './services/gemini';
import { Question } from './types';

const App: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [timeLimit, setTimeLimit] = useState<number | null>(null);

  useEffect(() => {
    if (darkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [darkMode]);

  const handleGenerate = async (source: { type: 'text' | 'prompt', content: string, note?: string }, count: number, time?: number) => {
    setIsLoading(true);
    setTimeLimit(time || null);
    try {
      const result = await generateQuiz(source, count);
      setQuestions(result);
    } catch (err) {
      alert("Đã có lỗi xảy ra. Hãy thử lại.");
    } finally {
      setIsLoading(false);
    }
  };

  const reset = () => {
    setQuestions([]);
    setTimeLimit(null);
  };

  return (
    <div className="min-h-screen pb-20 selection:bg-zinc-900 selection:text-white dark:selection:bg-white dark:selection:text-zinc-950 relative">
      <MatrixRain />
      <div className="relative z-10">
      {/* Heavy Geometric Header */}
      <nav className="border-b-2 border-zinc-900 dark:border-zinc-100 bg-sky-50 dark:bg-zinc-900 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto flex justify-between items-center h-14 px-4 md:px-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-zinc-900 dark:bg-zinc-100 flex items-center justify-center font-black text-white dark:text-zinc-950 text-sm transform rotate-3">RE</div>
            <div className="flex flex-col">
              <h1 className="font-black text-xl uppercase tracking-tighter leading-none">RockExam</h1>
              <span className="text-[8px] font-mono tracking-[0.3em] font-bold text-zinc-500">ENGINE v1.0.0</span>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setDarkMode(!darkMode)}
              className="w-8 h-8 flex items-center justify-center border-2 border-zinc-900 dark:border-zinc-100 hover:bg-zinc-900 hover:text-white dark:hover:bg-zinc-100 dark:hover:text-zinc-950 transition-all"
            >
              {darkMode ? (
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" /></svg>
              ) : (
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" /></svg>
              )}
            </button>
            {questions.length > 0 && (
              <button 
                onClick={reset}
                className="bg-red-600 text-white text-[10px] font-black uppercase px-3 py-1.5 border-2 border-zinc-900 hover:bg-red-700 transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
              >
                Làm Đề Khác
              </button>
            )}
          </div>
        </div>
      </nav>

      {questions.length === 0 ? (
        <Home onGenerate={handleGenerate} isLoading={isLoading} />
      ) : (
        <main className="px-6 mt-8">
          <QuizView questions={questions} onRestart={reset} timeLimit={timeLimit} />
        </main>
      )}
      
      {/* Industrial Grid Background */}
      <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden opacity-[0.03] dark:opacity-[0.05]">
        <div className="absolute top-0 left-0 w-full h-full" style={{ backgroundImage: 'linear-gradient(90deg, #000 2px, transparent 2px), linear-gradient(#000 2px, transparent 2px)', backgroundSize: '60px 60px' }} />
      </div>
      </div>
    </div>
  );
};

export default App;
