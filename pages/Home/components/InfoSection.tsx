import React from 'react';

const InfoSection: React.FC = () => {
  return (
    <div className="flex flex-col md:flex-row items-start gap-8 border-t-4 border-zinc-900 dark:border-zinc-100 pt-8 w-full max-w-3xl">
      <div className="flex-1">
        <p className="font-mono text-sm text-zinc-600 dark:text-zinc-400 font-medium leading-relaxed tracking-wide text-justify">
          HỆ THỐNG AI CHUYÊN SÂU GIÚP BẠN TRÍCH XUẤT KIẾN THỨC TỪ TÀI LIỆU VÀ TẠO ĐỀ THI TRẮC NGHIỆM NGAY LẬP TỨC.
        </p>
      </div>
      <div className="flex flex-col gap-3 text-[10px] font-black uppercase tracking-widest text-zinc-500 min-w-[140px] border-l-2 border-zinc-200 dark:border-zinc-800 pl-6 md:pl-8">
        <div className="flex items-center gap-3 group cursor-default">
          <div className="w-1.5 h-1.5 bg-zinc-900 dark:bg-zinc-100 group-hover:bg-red-500 transition-colors"></div>
          <span className="group-hover:text-zinc-900 dark:group-hover:text-zinc-100 transition-colors">PDF Support</span>
        </div>
        <div className="flex items-center gap-3 group cursor-default">
          <div className="w-1.5 h-1.5 bg-zinc-400 dark:bg-zinc-600 group-hover:bg-red-500 transition-colors"></div>
          <span className="group-hover:text-zinc-900 dark:group-hover:text-zinc-100 transition-colors">Text Analysis</span>
        </div>
        <div className="flex items-center gap-3 group cursor-default">
          <div className="w-1.5 h-1.5 bg-zinc-400 dark:bg-zinc-600 group-hover:bg-red-500 transition-colors"></div>
          <span className="group-hover:text-zinc-900 dark:group-hover:text-zinc-100 transition-colors">Instant Quiz</span>
        </div>
      </div>
    </div>
  );
};

export default InfoSection;
