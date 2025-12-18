
import React from 'react';
import { GameState, Owner } from '../types';

interface HUDProps {
  gameState: GameState;
  onMenu: () => void;
}

const HUD: React.FC<HUDProps> = ({ gameState, onMenu }) => {
  const totalFleets = gameState.planets
    .filter(p => p.owner === Owner.PLAYER)
    .reduce((acc, p) => acc + p.fleetCount, 0) +
    gameState.fleets.filter(f => f.owner === Owner.PLAYER).reduce((acc, f) => acc + f.count, 0);

  const levelProgress = gameState.planets.filter(p => p.owner === Owner.PLAYER).length / gameState.planets.length;

  return (
    <div className="absolute inset-0 pointer-events-none p-6 flex flex-col justify-between">
      {/* Top Bar */}
      <div className="flex justify-between items-start pointer-events-auto">
        <div className="bg-black/40 backdrop-blur-md p-4 rounded-xl border border-white/10 shadow-2xl">
          <h2 className="text-blue-400 text-xs font-bold uppercase tracking-widest mb-1">Commander Terminal</h2>
          <div className="flex items-end gap-4">
            <div>
              <span className="text-3xl font-black text-white">{totalFleets}</span>
              <span className="text-gray-400 text-sm ml-2">FLEETS</span>
            </div>
            <div className="h-8 w-[2px] bg-white/10" />
            <div>
              <span className="text-3xl font-black text-white">{gameState.planets.filter(p => p.owner === Owner.PLAYER).length}</span>
              <span className="text-gray-400 text-sm ml-2">PLANETS</span>
            </div>
          </div>
        </div>

        <button 
          onClick={onMenu}
          className="bg-black/40 backdrop-blur-md hover:bg-white hover:text-black p-3 rounded-lg border border-white/10 transition-all active:scale-95"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
        </button>
      </div>

      {/* Planet Labels Overlay - Simulated simple labels */}
      <div className="absolute inset-0 pointer-events-none">
        {gameState.planets.map(p => (
           <div 
            key={p.id}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 text-center"
            style={{ 
               left: '50%', // In a real app, you'd project 3D to 2D screen coords
               top: '50%',
               display: 'none' // Simplified for now as full 3D to 2D projection logic is lengthy
            }}
           >
             <div className="bg-black/60 px-2 py-1 rounded text-xs font-bold border border-white/20">
               {p.fleetCount}
             </div>
           </div>
        ))}
      </div>

      {/* Footer Info */}
      <div className="flex justify-between items-end">
        <div className="w-64 bg-black/40 backdrop-blur-md p-4 rounded-xl border border-white/10 pointer-events-auto">
          <div className="flex justify-between text-xs text-gray-400 mb-2">
            <span>DOMINATION LEVEL</span>
            <span>{Math.round(levelProgress * 100)}%</span>
          </div>
          <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-500 transition-all duration-500" 
              style={{ width: `${levelProgress * 100}%` }}
            />
          </div>
        </div>
        
        <div className="text-right">
          <h3 className="text-white text-sm font-bold opacity-50">LEVEL {gameState.currentLevel}</h3>
          <p className="text-white text-2xl font-black italic">SOLAR CONQUEST</p>
        </div>
      </div>
    </div>
  );
};

export default HUD;
