import React from 'react';
import InputSection from '../../components/InputSection';
import Hero from './components/Hero';
import InfoSection from './components/InfoSection';

interface HomeProps {
  onGenerate: (source: { type: 'text' | 'prompt', content: string }, count: number) => Promise<void>;
  isLoading: boolean;
}

const Home: React.FC<HomeProps> = ({ onGenerate, isLoading }) => {
  return (
    <div className="w-full min-h-[calc(100vh-3.5rem)] flex flex-col">
      {!isLoading && (
        <div className="max-w-6xl mx-auto pt-16 md:pt-24 pb-12 px-6 w-full">
          <div className="flex flex-col items-start">
            <Hero />
            <InfoSection />
          </div>
        </div>
      )}

      <main className="flex-1 px-6 mt-4 mb-20 w-full max-w-6xl mx-auto">
        <InputSection onGenerate={onGenerate} isLoading={isLoading} />
      </main>
    </div>
  );
};

export default Home;
