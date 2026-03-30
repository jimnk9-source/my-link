"use client";

import { useState } from "react";
import Image from "next/image";

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showSecret, setShowSecret] = useState(false);

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-black text-white overflow-x-hidden font-sans">
      {/* Name Display */}
      <div className="absolute top-10 left-10 z-10">
        <h1 className="text-4xl font-bold tracking-tighter">지민규</h1>
      </div>

      {/* Hamburger Menu Button */}
      <button
        onClick={() => setIsMenuOpen(true)}
        className="fixed top-10 right-10 z-50 flex flex-col gap-1.5 p-2 hover:opacity-70 transition-opacity"
        aria-label="Open menu"
      >
        <div className="w-8 h-1 bg-white rounded-full"></div>
        <div className="w-8 h-1 bg-white rounded-full"></div>
        <div className="w-8 h-1 bg-white rounded-full"></div>
      </button>

      {/* Drawer Overlay */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
          onClick={() => setIsMenuOpen(false)}
        ></div>
      )}

      {/* Drawer Content */}
      <div
        className={`fixed top-0 right-0 h-full w-1/2 bg-zinc-900 z-50 transform transition-transform duration-300 ease-in-out p-12 overflow-y-auto ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <button
          onClick={() => setIsMenuOpen(false)}
          className="absolute top-10 right-10 text-3xl font-light hover:rotate-90 transition-transform"
        >
          ✕
        </button>
        
        <div className="mt-16 space-y-12">
          <section>
            <h2 className="text-2xl font-bold mb-4 text-blue-400">은하수 (Milky Way)</h2>
            <p className="text-lg leading-relaxed text-zinc-300">
              은하수는 우리가 살고 있는 지구와 태양계가 속해 있는 거대한 은하계입니다. 
              밤하늘을 가로지르는 하얀 띠 모양으로 보이며, 약 2,000억에서 4,000억 개의 별들이 
              중력으로 묶여 거대한 나선 구조를 이루고 있습니다.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-purple-400">빅뱅 이론 (Big Bang Theory)</h2>
            <p className="text-lg leading-relaxed text-zinc-300">
              빅뱅 이론은 현대 우주론의 핵심 모델로, 우주가 약 138억 년 전 아주 작고 뜨거운 
              고밀도의 한 점으로부터 거대한 폭발(대팽창)을 통해 시작되었다는 이론입니다. 
              이후 우주는 지속적으로 팽창하며 식어갔고, 현재 우리가 보는 별과 은하들이 형성되었습니다.
            </p>
          </section>
        </div>
      </div>

      {/* Center Background Section */}
      <main className="flex-1 flex flex-col items-center justify-center p-4 w-full">
        <div className="relative w-full max-w-4xl aspect-video rounded-2xl overflow-hidden border border-white/10 bg-zinc-900/50 shadow-[0_0_50px_rgba(255,255,255,0.05)] flex items-center justify-center">
          <p className="text-zinc-500 italic">우주의 신비</p>
        </div>
      </main>

      {/* Footer Content */}
      <footer className="pb-10 flex flex-col items-center gap-8">
        {!showSecret ? (
          <button
            onClick={() => setShowSecret(true)}
            className="text-xs text-zinc-500 hover:text-white transition-colors cursor-pointer"
          >
            made by jimnk.
          </button>
        ) : (
          <div 
            className="animate-bounce"
            onClick={() => setShowSecret(false)}
          >
            <h1 className="text-9xl font-black text-red-600 drop-shadow-[0_0_20px_rgba(220,38,38,0.8)] cursor-pointer">
              바보
            </h1>
          </div>
        )}
      </footer>
    </div>
  );
}
