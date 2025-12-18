
import React, { useState } from 'react';

interface FileImporterProps {
  onTextExtracted: (text: string, count: number) => void;
  isLoading: boolean;
}

const FileImporter: React.FC<FileImporterProps> = ({ onTextExtracted, isLoading }) => {
  const [error, setError] = useState<string | null>(null);
  const [questionCount, setQuestionCount] = useState<number>(5);

  const counts = [5, 10, 15, 20, 50];

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      setError('Vui lòng chọn file PDF hợp lệ.');
      return;
    }

    setError(null);
    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const typedArray = new Uint8Array(e.target?.result as ArrayBuffer);
        // @ts-ignore
        const pdf = await window.pdfjsLib.getDocument(typedArray).promise;
        let fullText = '';
        
        // Hỗ trợ tối đa 15 trang để đảm bảo context window
        const maxPages = Math.min(pdf.numPages, 15);
        for (let i = 1; i <= maxPages; i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          const pageText = textContent.items.map((item: any) => item.str).join(' ');
          fullText += pageText + '\n';
        }
        
        if (fullText.trim().length < 50) {
          setError('Tài liệu quá ngắn hoặc không thể trích xuất văn bản.');
          return;
        }

        onTextExtracted(fullText, questionCount);
      };
      reader.readAsArrayBuffer(file);
    } catch (err) {
      setError('Có lỗi xảy ra khi đọc file PDF.');
      console.error(err);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-8 bg-white rounded-2xl shadow-sm border border-slate-200">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-50 text-blue-600 rounded-full mb-4">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-slate-800">Tạo đề ôn tập</h2>
        <p className="text-slate-500 mt-2">Chọn số câu hỏi và tải tài liệu PDF lên để bắt đầu</p>
      </div>

      <div className="mb-8">
        <label className="block text-sm font-semibold text-slate-700 mb-3">Số lượng câu hỏi muốn tạo:</label>
        <div className="grid grid-cols-5 gap-2">
          {counts.map((count) => (
            <button
              key={count}
              type="button"
              onClick={() => setQuestionCount(count)}
              disabled={isLoading}
              className={`py-2 rounded-lg text-sm font-bold transition-all border-2 ${
                questionCount === count
                  ? 'bg-blue-600 border-blue-600 text-white shadow-md'
                  : 'bg-white border-slate-200 text-slate-600 hover:border-blue-300'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {count}
            </button>
          ))}
        </div>
        {questionCount >= 30 && (
          <p className="text-[10px] text-orange-500 mt-2 italic">* Số lượng câu hỏi lớn có thể mất nhiều thời gian hơn để xử lý.</p>
        )}
      </div>

      <div className="relative group">
        <input
          type="file"
          accept=".pdf"
          onChange={handleFileChange}
          disabled={isLoading}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
        />
        <div className={`border-2 border-dashed rounded-xl p-10 text-center transition-colors ${
          isLoading ? 'bg-slate-50 border-slate-200' : 'border-slate-300 group-hover:border-blue-400 group-hover:bg-blue-50/30'
        }`}>
          {isLoading ? (
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-blue-600 font-medium italic">Đang phân tích và tạo {questionCount} câu hỏi...</p>
            </div>
          ) : (
            <>
              <p className="text-slate-600 font-medium">Kéo thả hoặc Click để tải PDF</p>
              <p className="text-slate-400 text-xs mt-1">Hỗ trợ trích xuất văn bản từ tài liệu</p>
            </>
          )}
        </div>
      </div>

      {error && (
        <div className="mt-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg flex items-center">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {error}
        </div>
      )}
    </div>
  );
};

export default FileImporter;
