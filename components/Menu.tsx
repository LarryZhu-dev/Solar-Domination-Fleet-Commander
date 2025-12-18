import React from 'react';
import { LEVELS } from '../constants';

interface MenuProps {
  onStartPVE: (levelId: number) => void;
}

const Menu: React.FC<MenuProps> = ({ onStartPVE }) => {
  return (
    <div className="menu-container">
      {/* Background Ambience */}
      <div className="menu-ambience">
        <div className="glow-blue" />
        <div className="glow-red" />
      </div>

      <div className="menu-content">
        <header className="menu-header">
          <h1 className="menu-title">
            SOLAR <span className="title-accent">MAX</span>
          </h1>
          <p className="menu-subtitle">Deep Space Fleet Commander</p>
        </header>

        <div className="level-grid">
          {LEVELS.map((level) => (
            <button
              key={level.id}
              onClick={() => onStartPVE(level.id)}
              className="level-card"
            >
              <div className="level-number">
                0{level.id}
              </div>
              <div className="level-card-info">
                <h3 className="level-card-title">{level.name}</h3>
                <p className="level-card-action">Mission Start</p>
              </div>
              <div className="level-card-glow" />
            </button>
          ))}
        </div>

        <div className="menu-actions">
          <div className="multiplayer-status">
              <span className="beta-tag">Multiplayer Beta</span>
              <button className="btn-disabled">
                JOIN PvP ROOM
              </button>
          </div>
        </div>
      </div>

      <div className="menu-footer">
        System Operational // Encryption Active // Sector 7G
      </div>
    </div>
  );
};

export default Menu;