
import React, { useState, useEffect } from 'react';
import InputSection from './components/InputSection';
import QuizView from './pages/QuizView/QuizView';
import { generateQuiz } from './services/gemini';
import { Question } from './types';

const App: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (darkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [darkMode]);

  const handleGenerate = async (source: { type: 'text' | 'prompt', content: string }, count: number) => {
    setIsLoading(true);
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
  };

  return (
    <div className="min-h-screen pb-20 selection:bg-zinc-900 selection:text-white dark:selection:bg-white dark:selection:text-zinc-950">
      {/* Heavy Geometric Header */}
      <nav className="border-b-4 border-zinc-900 dark:border-zinc-100 bg-white dark:bg-zinc-900 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto flex justify-between items-center h-20 px-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-zinc-900 dark:bg-zinc-100 flex items-center justify-center font-black text-white dark:text-zinc-950 text-xl transform rotate-3">AI</div>
            <div className="flex flex-col">
              <h1 className="font-black text-2xl uppercase tracking-tighter leading-none">EXAM</h1>
              <span className="text-[10px] font-mono tracking-[0.3em] font-bold text-zinc-500">ENGINE v2.0</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setDarkMode(!darkMode)}
              className="w-10 h-10 flex items-center justify-center border-2 border-zinc-900 dark:border-zinc-100 hover:bg-zinc-900 hover:text-white dark:hover:bg-zinc-100 dark:hover:text-zinc-950 transition-all"
            >
              {darkMode ? (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" /></svg>
              ) : (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" /></svg>
              )}
            </button>
            {questions.length > 0 && (
              <button 
                onClick={reset}
                className="bg-red-600 text-white text-[10px] font-black uppercase px-4 py-2 border-2 border-zinc-900 hover:bg-red-700 transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
              >
                Làm Đề Khác
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      {questions.length === 0 && !isLoading && (
        <div className="max-w-4xl mx-auto pt-20 pb-12 px-6">
          <div className="inline-block bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-950 px-3 py-1 text-[10px] font-black uppercase tracking-widest mb-6">
            Học tập thông minh hơn
          </div>
          <h2 className="text-6xl md:text-8xl font-black uppercase leading-[0.8] tracking-tighter mb-8 italic">
            TỰ ĐỘNG <br/> <span className="text-transparent border-text" style={{ WebkitTextStroke: '1px currentColor' }}>HÓA</span> <br/> ÔN TẬP
          </h2>
          <p className="max-w-md font-mono text-xs text-zinc-500 uppercase leading-relaxed tracking-wider border-l-2 border-zinc-300 dark:border-zinc-700 pl-4">
            Hệ thống AI chuyên sâu giúp bạn trích xuất kiến thức từ PDF và tạo đề thi trắc nghiệm ngay lập tức.
          </p>
        </div>
      )}

      <main className="px-6 mt-8">
        {questions.length === 0 ? (
          <InputSection onGenerate={handleGenerate} isLoading={isLoading} />
        ) : (
          <QuizView questions={questions} onRestart={reset} />
        )}
      </main>
      
      {/* Industrial Grid Background */}
      <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden opacity-[0.03] dark:opacity-[0.05]">
        <div className="absolute top-0 left-0 w-full h-full" style={{ backgroundImage: 'linear-gradient(90deg, #000 2px, transparent 2px), linear-gradient(#000 2px, transparent 2px)', backgroundSize: '60px 60px' }} />
      </div>
    </div>
  );
};

export default App;
