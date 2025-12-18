
import React from 'react';
import { LEVELS } from '../constants';

interface MenuProps {
  onStartPVE: (levelId: number) => void;
}

const Menu: React.FC<MenuProps> = ({ onStartPVE }) => {
  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-black to-black">
      {/* Background Ambience */}
      <div className="absolute inset-0 overflow-hidden opacity-30 pointer-events-none">
        <div className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 bg-blue-500/20 blur-[120px] rounded-full" />
        <div className="absolute -bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-red-500/10 blur-[120px] rounded-full" />
      </div>

      <div className="z-10 text-center mb-12">
        <h1 className="text-7xl md:text-8xl font-black text-white tracking-tighter mb-2 italic">
          SOLAR <span className="text-blue-500">MAX</span>
        </h1>
        <p className="text-gray-500 tracking-[0.3em] font-light uppercase">Deep Space Fleet Commander</p>
      </div>

      <div className="z-10 grid grid-cols-1 md:grid-cols-5 gap-4 px-4 w-full max-w-6xl">
        {LEVELS.map((level) => (
          <button
            key={level.id}
            onClick={() => onStartPVE(level.id)}
            className="group relative h-48 bg-gray-900/50 backdrop-blur-md border border-white/5 rounded-2xl p-6 flex flex-col justify-end text-left overflow-hidden transition-all hover:border-blue-500/50 hover:bg-gray-800"
          >
            <div className="absolute top-4 left-4 text-gray-700 font-black text-5xl group-hover:text-blue-500/20 transition-colors">
              0{level.id}
            </div>
            <div className="relative z-10">
              <h3 className="text-white font-bold text-lg mb-1">{level.name}</h3>
              <p className="text-gray-500 text-xs uppercase tracking-widest group-hover:text-blue-400 transition-colors">Mission Start</p>
            </div>
            <div className="absolute bottom-0 right-0 w-24 h-24 bg-blue-500/10 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
        ))}
      </div>

      <div className="z-10 mt-12 flex gap-8">
        <div className="text-center">
            <span className="block text-gray-600 text-[10px] tracking-[0.2em] uppercase mb-2">Multiplayer Beta</span>
            <button className="px-8 py-3 bg-white/5 border border-white/10 text-gray-400 font-bold rounded-lg cursor-not-allowed opacity-50">
              JOIN PvP ROOM
            </button>
        </div>
      </div>

      <div className="absolute bottom-8 text-gray-600 text-[10px] tracking-widest uppercase">
        System Operational // Encryption Active // Sector 7G
      </div>
    </div>
  );
};

export default Menu;
