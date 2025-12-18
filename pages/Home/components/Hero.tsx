import React from 'react';

const Hero: React.FC = () => {
  return (
    <div className="flex flex-col items-start w-full relative">
      {/* Badge */}
      <div className="inline-flex items-center gap-3 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-950 px-4 py-2 text-[10px] font-black uppercase tracking-[0.25em] mb-10 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)] border border-zinc-900 dark:border-zinc-100">
        <span className="w-1.5 h-1.5 bg-red-500 animate-pulse"></span>
        Học tập thông minh hơn
      </div>
      
      {/* Main Title */}
      <h2 className="relative text-6xl md:text-9xl font-black uppercase leading-[0.7] tracking-tighter mb-12 text-zinc-900 dark:text-zinc-100 select-none">
        <span className="block relative z-10">QUIZ GENERATOR</span>
        <span className="block relative z-10">FOR EXAM</span>
        
        {/* Decorative Elements */}
        <div className="absolute -right-4 top-0 text-[10px] font-mono text-zinc-400 rotate-90 origin-top-right tracking-widest opacity-50 hidden md:block">
          SYSTEM_READY
        </div>
      </h2>
    </div>
  );
};

export default Hero;
