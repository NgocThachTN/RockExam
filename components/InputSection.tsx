
import React, { useState } from 'react';

interface InputSectionProps {
  onGenerate: (source: { type: 'text' | 'prompt', content: string }, count: number) => void;
  isLoading: boolean;
}

const InputSection: React.FC<InputSectionProps> = ({ onGenerate, isLoading }) => {
  const [tab, setTab] = useState<'pdf' | 'command'>('pdf');
  const [prompt, setPrompt] = useState('');
  const [count, setCount] = useState(5);
  const [error, setError] = useState<string | null>(null);
  const [isParsing, setIsParsing] = useState(false);
  const [parsingProgress, setParsingProgress] = useState(0);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || file.type !== 'application/pdf') {
      setError('Vui lòng chọn một file PDF hợp lệ.');
      return;
    }

    setError(null);
    setIsParsing(true);
    setParsingProgress(0);

    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const typedArray = new Uint8Array(e.target?.result as ArrayBuffer);
          // @ts-ignore
          const pdf = await window.pdfjsLib.getDocument(typedArray).promise;
          let fullText = '';
          const totalPages = pdf.numPages;

          for (let i = 1; i <= totalPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            const strings = textContent.items.map((item: any) => item.str);
            fullText += strings.join(' ') + '\n';
            setParsingProgress(Math.round((i / totalPages) * 100));
          }

          if (fullText.trim().length < 50) {
            throw new Error('Không trích xuất được văn bản đáng kể từ tài liệu.');
          }

          setIsParsing(false);
          onGenerate({ type: 'text', content: fullText }, count);
        } catch (innerErr: any) {
          setError(innerErr.message || 'Lỗi xử lý PDF.');
          setIsParsing(false);
        }
      };
      reader.onerror = () => {
        setError('Lỗi khi đọc file.');
        setIsParsing(false);
      };
      reader.readAsArrayBuffer(file);
    } catch (err) {
      setError('Lỗi đọc PDF. Thử cách nhập lệnh trực tiếp.');
      setIsParsing(false);
    }
  };

  const handleCommandSubmit = () => {
    if (prompt.trim().length < 10) {
      setError('Lệnh quá ngắn. Hãy nhập chủ đề cụ thể hơn.');
      return;
    }
    onGenerate({ type: 'prompt', content: prompt }, count);
  };

  const showLoader = isLoading || isParsing;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex bg-zinc-200 dark:bg-zinc-800 p-1 border-2 border-zinc-900 dark:border-zinc-700">
        <button 
          onClick={() => setTab('pdf')}
          className={`flex-1 py-4 font-black text-xs uppercase tracking-[0.2em] transition-all ${tab === 'pdf' ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950' : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100'}`}
        >
          Nhập File PDF
        </button>
        <button 
          onClick={() => setTab('command')}
          className={`flex-1 py-4 font-black text-xs uppercase tracking-[0.2em] transition-all ${tab === 'command' ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950' : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100'}`}
        >
          Câu lệnh AI
        </button>
      </div>

      <div className={`p-10 bg-white dark:bg-zinc-900 border-2 border-zinc-900 dark:border-zinc-700 sharp-shadow ${showLoader ? 'opacity-50 pointer-events-none' : ''}`}>
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <label className="text-[10px] font-black uppercase text-zinc-400 dark:text-zinc-500 tracking-widest">Quy mô đề thi</label>
            <span className="font-mono text-xs font-bold">{count} câu hỏi</span>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {[5, 10, 20, 50].map(n => (
              <button 
                key={n}
                onClick={() => setCount(n)}
                className={`py-3 font-mono text-sm border-2 transition-all ${count === n ? 'bg-zinc-900 text-white border-zinc-900 dark:bg-zinc-100 dark:text-zinc-950 dark:border-zinc-100' : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-900 dark:hover:border-zinc-100'}`}
              >
                {n}
              </button>
            ))}
          </div>
        </div>

        {tab === 'pdf' ? (
          <div className="space-y-4">
            <div className="relative border-2 border-dashed border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950/50 p-16 text-center group hover:border-zinc-900 dark:hover:border-zinc-100 transition-colors cursor-pointer">
              <input type="file" accept=".pdf" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" disabled={showLoader} />
              <div className="flex flex-col items-center">
                <svg className="w-10 h-10 mb-4 text-zinc-300 dark:text-zinc-700 group-hover:text-zinc-900 dark:group-hover:text-zinc-100" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                <p className="font-black text-xs uppercase tracking-widest text-zinc-400 dark:text-zinc-600 group-hover:text-zinc-900 dark:group-hover:text-zinc-100">Click để chọn tài liệu</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <textarea
              placeholder="Nhập yêu cầu chi tiết cho AI..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full h-40 p-6 bg-zinc-50 dark:bg-zinc-950/50 border-2 border-zinc-200 dark:border-zinc-800 focus:border-zinc-900 dark:focus:border-zinc-100 resize-none font-medium text-zinc-900 dark:text-zinc-100 text-sm leading-relaxed"
            />
            <button 
              onClick={handleCommandSubmit}
              disabled={showLoader}
              className="w-full py-5 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-950 font-black uppercase text-xs tracking-[0.3em] hover:bg-zinc-800 dark:hover:bg-white transition-all disabled:opacity-50"
            >
              Tạo Quiz
            </button>
          </div>
        )}

        {error && (
          <div className="mt-6 p-4 bg-red-100 dark:bg-red-950/30 border-l-4 border-red-600 text-red-600 dark:text-red-400 text-[10px] font-black uppercase tracking-widest">
            Lỗi: {error}
          </div>
        )}
      </div>
      
      {showLoader && (
        <div className="text-center py-10 animate-in fade-in duration-500">
          <div className="inline-block w-12 h-12 border-4 border-zinc-900 dark:border-zinc-100 border-t-transparent animate-spin"></div>
          <p className="text-[10px] font-black uppercase mt-4 tracking-[0.4em] animate-pulse text-zinc-900 dark:text-zinc-100">
            {isParsing ? `Đang trích xuất: ${parsingProgress}%` : 'AI đang xử lý dữ liệu...'}
          </p>
        </div>
      )}
    </div>
  );
};

export default InputSection;
