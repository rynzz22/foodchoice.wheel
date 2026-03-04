import React, { useState, useEffect } from 'react';
import Wheel from './components/Wheel';
import EditModal from './components/EditModal';
import Confetti from './components/Confetti';
import { WheelItem, Preset } from './types';
import { WHEEL_COLORS, PRESETS } from './constants';
import { Settings, RefreshCw, AlertCircle, X, ChevronRight } from 'lucide-react';

const App: React.FC = () => {
  // Initialize with the Budget/Pinoy preset
  const [items, setItems] = useState<WheelItem[]>(() => 
    PRESETS[0].items.map((item, i) => ({
      ...item,
      id: `init-${i}`,
      // Use predefined color or fallback to cycle
      color: item.color || WHEEL_COLORS[i % WHEEL_COLORS.length]
    }))
  );

  const [isSpinning, setIsSpinning] = useState(false);
  const [winner, setWinner] = useState<WheelItem | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showReminder, setShowReminder] = useState(true);
  
  // Customization state
  const [spinDuration, setSpinDuration] = useState(5); // Default 5 seconds

  const handleSpinEnd = (winningItem: WheelItem) => {
    setWinner(winningItem);
    setShowConfetti(true);
    if (navigator.vibrate) navigator.vibrate([100, 50, 100]);
    setTimeout(() => setShowConfetti(false), 5000);
  };

  const loadPreset = (preset: Preset) => {
    setItems(preset.items.map((item, i) => ({
      ...item,
      id: `preset-${Date.now()}-${i}`,
      color: item.color || WHEEL_COLORS[i % WHEEL_COLORS.length]
    })));
    setWinner(null);
  };

  return (
    <div className="min-h-screen bg-[#FDF2F8] flex flex-col items-center font-sans text-slate-800 selection:bg-rose-200">
      <Confetti trigger={showConfetti} />
      
      {/* Navbar */}
      <header className="w-full p-6 flex justify-between items-center max-w-lg z-20">
        <div>
          <h1 className="text-3xl font-black bg-gradient-to-r from-rose-500 to-orange-500 bg-clip-text text-transparent tracking-tight">
            Spin & Decide
          </h1>
          <p className="text-xs text-rose-400/80 font-bold tracking-widest ml-1 uppercase">
            SPIN DA WHEEL - lorenz version
          </p>
        </div>
        <button 
          onClick={() => setIsEditModalOpen(true)}
          className="p-3 bg-white/50 backdrop-blur-md border border-white/60 rounded-full shadow-sm text-slate-600 hover:text-rose-500 transition-all active:scale-95"
        >
          <Settings className="w-6 h-6" />
        </button>
      </header>

      {/* Reminder Notification */}
      {showReminder && (
        <div className="max-w-lg w-[90%] mx-auto mb-2 animate-in fade-in slide-in-from-top-4 duration-700">
          <div className="bg-white/60 backdrop-blur-md border border-rose-100 p-4 rounded-2xl shadow-sm flex gap-3 items-start relative">
             <div className="bg-rose-100 p-2 rounded-full shrink-0">
               <AlertCircle className="w-5 h-5 text-rose-500" />
             </div>
             <div className="pr-6">
                <p className="text-sm font-semibold text-slate-700">Friendly Reminder 💡</p>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Hey, you should save some money right? Don't be too harsh on the budget! Let the wheel pick something reasonable.
                </p>
             </div>
             <button 
               onClick={() => setShowReminder(false)}
               className="absolute top-2 right-2 text-slate-300 hover:text-slate-500 p-1"
             >
               <X className="w-4 h-4" />
             </button>
          </div>
        </div>
      )}

      {/* Main Scrollable Area */}
      <main className="flex-1 flex flex-col items-center w-full max-w-lg px-4 pb-12">
        
        {/* Winner Display (Congrats UI) */}
        <div className="min-h-[140px] flex items-center justify-center w-full mt-4 mb-4 relative z-30 perspective-1000">
            {winner ? (
                <div className="animate-in zoom-in slide-in-from-bottom-8 duration-500 w-[95%] text-center bg-white/95 backdrop-blur-xl p-6 rounded-[2.5rem] shadow-2xl shadow-rose-200/50 border-4 border-rose-200 transform hover:scale-[1.02] transition-transform">
                    <div className="absolute -top-4 -left-2 rotate-[-10deg] bg-rose-500 text-white px-4 py-1 rounded-full text-xs font-black uppercase shadow-lg border-2 border-white">
                        It's decided!
                    </div>
                    
                    <p className="text-xs font-black text-rose-500 uppercase tracking-[0.2em] mb-4 mt-2">
                        Hey! We're gonna eat this!
                    </p>
                    
                    <div className="flex flex-col items-center gap-4 justify-center">
                       {winner.isImage && winner.icon && (
                          <div className="relative group">
                            <div className="absolute inset-0 bg-gradient-to-tr from-rose-400 to-orange-400 rounded-full blur-xl opacity-40 animate-pulse group-hover:opacity-60 transition-opacity"></div>
                            <img src={winner.icon} alt="" className="relative w-32 h-32 rounded-full object-cover border-4 border-white shadow-xl transform transition-transform group-hover:scale-105" />
                          </div>
                       )}
                       {!winner.isImage && (
                          <span className="text-8xl filter drop-shadow-xl animate-bounce leading-none mb-2 transform hover:rotate-12 transition-transform cursor-default">
                             {winner.icon}
                          </span>
                       )}
                       <h2 className="text-4xl font-black text-slate-800 leading-tight bg-gradient-to-br from-slate-900 to-slate-600 bg-clip-text text-transparent px-2">
                          {winner.label}
                       </h2>
                    </div>
                </div>
            ) : isSpinning ? (
                 <div className="p-8 rounded-3xl bg-white/40 border border-white/60 backdrop-blur-sm animate-pulse">
                     <p className="text-2xl text-rose-400 font-black tracking-wide">Spinning...</p>
                 </div>
            ) : (
                <div className="text-center opacity-60 py-8">
                   <p className="text-sm font-bold uppercase tracking-widest text-slate-400">Ready to decide?</p>
                </div>
            )}
        </div>

        <div className="my-6 transform transition-all duration-500">
          <Wheel 
            items={items} 
            isSpinning={isSpinning} 
            setIsSpinning={setIsSpinning} 
            onSpinEnd={handleSpinEnd}
            spinDuration={spinDuration}
          />
        </div>

        {/* Big Spin Button */}
        <button
          onClick={() => {
             if (items.length < 2) { alert("Add at least 2 items!"); return; }
             setWinner(null);
             setIsSpinning(true);
          }}
          disabled={isSpinning || items.length < 2}
          className={`
            w-full max-w-[280px] py-4 rounded-3xl text-xl font-black text-white shadow-xl shadow-rose-300/40 
            transition-all transform active:scale-95 flex items-center justify-center gap-3 relative overflow-hidden group mb-8
            ${isSpinning 
                ? 'bg-slate-300 cursor-not-allowed grayscale' 
                : 'bg-gradient-to-r from-rose-500 to-orange-400'}
          `}
        >
          <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 rounded-3xl" />
          {isSpinning ? (
            'Good luck!'
          ) : (
             <>
               <RefreshCw className="w-6 h-6 animate-spin-slow" style={{ animationDuration: '3s' }} /> 
               <span className="tracking-wide">SPIN IT!</span>
             </>
          )}
        </button>

        {/* Presets Section (In-flow) */}
        <div className="w-full mt-4 mb-8">
            <div className="flex items-center gap-2 mb-3 px-2">
                <div className="w-1 h-4 bg-rose-400 rounded-full"></div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Quick Modes
                </p>
            </div>
            
            <div className="bg-white/50 backdrop-blur-sm p-4 rounded-3xl border border-white/60 shadow-sm">
                <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide snap-x px-1">
                    {PRESETS.map((preset) => (
                        <button
                        key={preset.name}
                        onClick={() => loadPreset(preset)}
                        className="snap-start shrink-0 flex flex-col items-center justify-center w-20 h-24 bg-white border border-slate-100 rounded-2xl shadow-sm text-sm font-semibold text-slate-600 hover:border-rose-300 hover:shadow-md hover:-translate-y-1 transition-all active:scale-95 group"
                        >
                        <div className="w-9 h-9 rounded-full bg-slate-50 group-hover:bg-rose-50 flex items-center justify-center text-rose-400 mb-2 transition-colors">
                            {preset.icon}
                        </div>
                        <span className="text-[10px] text-center leading-tight px-1 line-clamp-2">{preset.name}</span>
                        </button>
                    ))}
                    {/* Add custom fake one for UX hint */}
                    <button
                        onClick={() => setIsEditModalOpen(true)}
                        className="snap-start shrink-0 flex flex-col items-center justify-center w-20 h-24 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 hover:border-rose-300 hover:text-rose-400 transition-all active:scale-95"
                    >
                        <Settings className="w-6 h-6 mb-1 opacity-50" />
                        <span className="text-[10px] font-bold">Custom</span>
                    </button>
                </div>
            </div>
        </div>

      </main>

      <EditModal 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)} 
        items={items}
        setItems={setItems}
        spinDuration={spinDuration}
        setSpinDuration={setSpinDuration}
      />
    </div>
  );
};

export default App;