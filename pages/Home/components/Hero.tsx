import React from 'react';

const Hero: React.FC = () => {
  return (
    <div className="flex flex-col items-start w-full relative">
      {/* Badge */}
      <div className="animate-fade-in inline-flex items-center gap-3 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-950 px-4 py-2 text-[10px] font-black uppercase tracking-[0.25em] mb-10 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)] border border-zinc-900 dark:border-zinc-100">
        <span className="w-1.5 h-1.5 bg-red-500 animate-pulse"></span>
        Học tập thông minh hơn
      </div>
      
      {/* Main Title */}
      <h2 className="relative text-6xl md:text-9xl font-black uppercase leading-[0.85] tracking-tighter mb-12 text-zinc-900 dark:text-zinc-100 select-none">
        <span className="block relative z-10 animate-slide-up delay-100">QUIZ GENERATOR</span>
        <span className="block text-zinc-500 relative z-10 animate-slide-up delay-200">
          FOR EXAM
        </span>
        
        {/* Decorative Elements */}
        <div className="absolute -right-12 top-2 text-[10px] font-mono text-zinc-400 rotate-90 origin-top-right tracking-widest opacity-50 hidden md:block animate-fade-in delay-500">
          <span className="typing-effect">SYSTEM_READY :: v2.0</span>
        </div>
        
        {/* Technical Line */}
        <div className="absolute -left-6 top-0 bottom-0 w-[2px] bg-zinc-200 dark:bg-zinc-800 hidden md:block animate-fade-in delay-300">
          <div className="absolute top-[10%] left-0 w-full h-[20%] bg-zinc-900 dark:bg-zinc-100 animate-pulse"></div>
          <div className="absolute bottom-[20%] left-0 w-full h-[10%] bg-zinc-900 dark:bg-zinc-100 animate-pulse delay-700"></div>
        </div>
      </h2>
    </div>
  );
};

export default Hero;
