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
    <div className="hud-container">
      {/* Top Bar */}
      <div className="hud-top-bar">
        <div className="terminal-card">
          <h2 className="terminal-label">Commander Terminal</h2>
          <div className="terminal-stats">
            <div className="stat-group">
              <span className="stat-value">{totalFleets}</span>
              <span className="stat-unit">FLEETS</span>
            </div>
            <div className="stat-divider" />
            <div className="stat-group">
              <span className="stat-value">{gameState.planets.filter(p => p.owner === Owner.PLAYER).length}</span>
              <span className="stat-unit">PLANETS</span>
            </div>
          </div>
        </div>

        <button 
          onClick={onMenu}
          className="btn-icon"
          title="Return to Menu"
        >
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
        </button>
      </div>

      {/* Footer Info */}
      <div className="hud-footer">
        <div className="progress-card">
          <div className="progress-header">
            <span>DOMINATION LEVEL</span>
            <span>{Math.round(levelProgress * 100)}%</span>
          </div>
          <div className="progress-bar-bg">
            <div 
              className="progress-bar-fill" 
              style={{ width: `${levelProgress * 100}%` }}
            />
          </div>
        </div>
        
        <div className="level-info">
          <h3 className="level-tag">LEVEL {gameState.currentLevel}</h3>
          <p className="level-name">SOLAR CONQUEST</p>
        </div>
      </div>
    </div>
  );
};

export default HUD;