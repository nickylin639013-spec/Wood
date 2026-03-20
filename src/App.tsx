import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import VolumeCalculator from './components/VolumeCalculator';
import CutOptimizer from './components/CutOptimizer';
import AngleCalculator from './components/AngleCalculator';
import SpacingCalculator from './components/SpacingCalculator';
import QuoteCalculator from './components/QuoteCalculator';
import UnitConverter from './components/UnitConverter';
import ReferenceTables from './components/ReferenceTables';

type Page = 'volume' | 'cut' | 'angle' | 'spacing' | 'quote' | 'unit' | 'reference';

const NAV_ITEMS = [
  { id: 'volume', emoji: '📐', label: '材數計算' },
  { id: 'cut', emoji: '🪚', label: '裁切優化' },
  { id: 'angle', emoji: '📏', label: '角度斜切' },
  { id: 'spacing', emoji: '🔩', label: '間距等分' },
  { id: 'quote', emoji: '💰', label: '報價快算' },
  { id: 'unit', emoji: '🔄', label: '單位換算' },
  { id: 'reference', emoji: '📖', label: '參考表' },
] as const;

export default function App() {
  const [activePage, setActivePage] = useState<Page>('volume');
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2000);
  };

  const renderPage = () => {
    const props = { showToast };
    switch (activePage) {
      case 'volume': return <VolumeCalculator {...props} />;
      case 'cut': return <CutOptimizer {...props} />;
      case 'angle': return <AngleCalculator {...props} />;
      case 'spacing': return <SpacingCalculator {...props} />;
      case 'quote': return <QuoteCalculator {...props} />;
      case 'unit': return <UnitConverter {...props} />;
      case 'reference': return <ReferenceTables {...props} />;
      default: return <VolumeCalculator {...props} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col max-w-[900px] mx-auto shadow-2xl bg-wood-bg">
      {/* Header */}
      <header className="wood-grain-header pt-12 pb-6 px-6 text-white shadow-lg">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-2xl font-bold tracking-tight">木工計算工具箱</h1>
          <span className="text-xs bg-wood-accent text-wood-dark px-2 py-1 rounded font-bold">方禾家具</span>
        </div>
        <p className="text-sm opacity-80">專業現場作業工具 · 繁體中文版</p>
      </header>

      {/* Navigation Grid */}
      <nav className="grid grid-cols-4 gap-2 p-3 bg-white border-b border-wood-light/10 sticky top-0 z-50">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            onClick={() => setActivePage(item.id)}
            className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all border-2 ${
              activePage === item.id 
                ? 'border-wood-accent bg-yellow-50 shadow-sm' 
                : 'border-transparent hover:bg-wood-bg'
            }`}
          >
            <span className="text-2xl mb-1">{item.emoji}</span>
            <span className={`text-[10px] font-bold ${activePage === item.id ? 'text-wood-dark' : 'text-wood-light'}`}>
              {item.label}
            </span>
          </button>
        ))}
      </nav>

      {/* Main Content */}
      <main className="flex-1 p-4 overflow-x-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={activePage}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
          >
            {renderPage()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-20 left-1/2 -translate-x-1/2 bg-wood-dark text-white px-6 py-3 rounded-full shadow-2xl z-[100] font-bold text-sm border border-wood-accent/30"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer / Safe Area */}
      <footer className="p-4 text-center text-[10px] text-wood-light opacity-50 safe-area-inset-bottom">
        © 2026 方禾家具 · 木工計算工具箱 v1.0
      </footer>
    </div>
  );
}
