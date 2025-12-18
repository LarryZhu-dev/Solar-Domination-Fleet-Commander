import React, { useState, useEffect, useRef } from 'react';
import { GameState, Planet, FleetGroup, Owner } from './types';
import { LEVELS } from './constants';
import GameScene from './scenes/GameScene';
import Menu from './components/Menu';
import HUD from './components/HUD';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>({
    planets: [],
    fleets: [],
    gameStatus: 'MENU',
    currentLevel: 1,
    isMultiplayer: false,
  });

  const [selectedPlanetId, setSelectedPlanetId] = useState<string | null>(null);
  const gameLoopRef = useRef<number | null>(null);

  const startLevel = (levelId: number) => {
    const level = LEVELS.find(l => l.id === levelId);
    if (!level) return;

    const planets: Planet[] = level.planets.map((p, idx) => ({
      ...p,
      id: `planet-${idx}`,
    }));

    setGameState({
      planets,
      fleets: [],
      gameStatus: 'PLAYING',
      currentLevel: levelId,
      isMultiplayer: false,
    });
  };

  const handlePlanetClick = (id: string) => {
    setGameState(prev => {
      const clickedPlanet = prev.planets.find(p => p.id === id);
      if (!clickedPlanet) return prev;

      if (selectedPlanetId === null) {
        if (clickedPlanet.owner === Owner.PLAYER) {
          setSelectedPlanetId(id);
        }
        return prev;
      } else {
        if (selectedPlanetId !== id) {
          // Send fleet from selected to clicked
          sendFleet(selectedPlanetId, id, 0.5); // 50% default
          setSelectedPlanetId(null);
          return prev;
        } else {
          // Deselect
          setSelectedPlanetId(null);
          return prev;
        }
      }
    });
  };

  const sendFleet = (fromId: string, toId: string, ratio: number) => {
    setGameState(prev => {
      const fromPlanet = prev.planets.find(p => p.id === fromId);
      if (!fromPlanet || fromPlanet.fleetCount < 2) return prev;

      const countToSend = Math.floor(fromPlanet.fleetCount * ratio);
      const newFleet: FleetGroup = {
        id: `fleet-${Date.now()}-${Math.random()}`,
        fromId,
        toId,
        count: countToSend,
        owner: fromPlanet.owner,
        progress: 0,
        speed: 0.1,
      };

      const updatedPlanets = prev.planets.map(p => 
        p.id === fromId ? { ...p, fleetCount: p.fleetCount - countToSend } : p
      );

      return {
        ...prev,
        planets: updatedPlanets,
        fleets: [...prev.fleets, newFleet],
      };
    });
  };

  // Main Game Logic (Production & AI)
  useEffect(() => {
    if (gameState.gameStatus !== 'PLAYING') return;

    const interval = setInterval(() => {
      setGameState(prev => {
        // 1. Production
        const updatedPlanets = prev.planets.map(p => {
          if (p.owner === Owner.NEUTRAL) return p;
          return { ...p, fleetCount: p.fleetCount + p.productionRate };
        });

        // 2. AI Logic
        const newFleetsFromAI: FleetGroup[] = [];
        const nextPlanets = updatedPlanets.map(p => {
          if (p.owner !== Owner.PLAYER && p.owner !== Owner.NEUTRAL && p.fleetCount > 30) {
            const targets = updatedPlanets.filter(target => target.owner !== p.owner);
            if (targets.length > 0 && Math.random() > 0.7) {
              const target = targets[Math.floor(Math.random() * targets.length)];
              const countToSend = Math.floor(p.fleetCount * 0.5);
              
              newFleetsFromAI.push({
                id: `fleet-ai-${Date.now()}-${Math.random()}`,
                fromId: p.id,
                toId: target.id,
                count: countToSend,
                owner: p.owner,
                progress: 0,
                speed: 0.1
              });
              
              return { ...p, fleetCount: p.fleetCount - countToSend };
            }
          }
          return p;
        });

        return { ...prev, planets: nextPlanets, fleets: [...prev.fleets, ...newFleetsFromAI] };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [gameState.gameStatus]);

  // Movement & Combat Loop
  useEffect(() => {
    if (gameState.gameStatus !== 'PLAYING') return;

    const updateFrame = () => {
      setGameState(prev => {
        let planets = [...prev.planets];
        let fleets = prev.fleets.map(f => ({ ...f, progress: f.progress + 0.005 }));

        const arrivedFleets = fleets.filter(f => f.progress >= 1);
        const remainingFleets = fleets.filter(f => f.progress < 1);

        arrivedFleets.forEach(f => {
          const targetIdx = planets.findIndex(p => p.id === f.toId);
          if (targetIdx === -1) return;

          const planet = planets[targetIdx];
          if (planet.owner === f.owner) {
            planets[targetIdx] = { ...planet, fleetCount: planet.fleetCount + f.count };
          } else {
            if (f.count > planet.fleetCount) {
              planets[targetIdx] = { 
                ...planet, 
                owner: f.owner, 
                fleetCount: f.count - planet.fleetCount 
              };
            } else {
              planets[targetIdx] = { ...planet, fleetCount: planet.fleetCount - f.count };
            }
          }
        });

        const playerPlanets = planets.filter(p => p.owner === Owner.PLAYER);
        const enemyPlanets = planets.filter(p => p.owner !== Owner.PLAYER && p.owner !== Owner.NEUTRAL);

        let status = prev.gameStatus;
        if (playerPlanets.length === 0 && prev.fleets.filter(f => f.owner === Owner.PLAYER).length === 0) {
          status = 'LOST';
        } else if (enemyPlanets.length === 0 && prev.fleets.filter(f => f.owner !== Owner.PLAYER && f.owner !== Owner.NEUTRAL).length === 0) {
          status = 'WON';
        }

        return { ...prev, planets, fleets: remainingFleets, gameStatus: status };
      });
      gameLoopRef.current = requestAnimationFrame(updateFrame);
    };

    gameLoopRef.current = requestAnimationFrame(updateFrame);
    return () => {
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
    };
  }, [gameState.gameStatus]);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black select-none">
      {gameState.gameStatus === 'MENU' ? (
        <Menu onStartPVE={startLevel} />
      ) : (
        <>
          <GameScene 
            planets={gameState.planets} 
            fleets={gameState.fleets} 
            selectedPlanetId={selectedPlanetId}
            onPlanetClick={handlePlanetClick}
          />
          <HUD 
            gameState={gameState} 
            onMenu={() => setGameState(p => ({ ...p, gameStatus: 'MENU' }))} 
          />
          
          {(gameState.gameStatus === 'WON' || gameState.gameStatus === 'LOST') && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm z-50">
              <div className="text-center p-8 bg-gray-900 border-2 border-white/20 rounded-2xl shadow-2xl">
                <h1 className={`text-6xl font-black mb-4 ${gameState.gameStatus === 'WON' ? 'text-green-500' : 'text-red-500'}`}>
                  {gameState.gameStatus === 'WON' ? 'VICTORY' : 'DEFEAT'}
                </h1>
                <p className="text-gray-400 mb-8 text-xl">
                  {gameState.gameStatus === 'WON' ? 'The solar system is yours.' : 'The cosmos has claimed you.'}
                </p>
                <button 
                  onClick={() => setGameState(p => ({ ...p, gameStatus: 'MENU' }))}
                  className="px-8 py-3 bg-white text-black font-bold rounded-lg hover:bg-gray-200 transition-colors"
                >
                  RETURN TO BASE
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default App;