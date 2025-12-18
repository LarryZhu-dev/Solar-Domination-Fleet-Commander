
import { Vector3 } from 'three';

export enum Owner {
  NEUTRAL = 'NEUTRAL',
  PLAYER = 'PLAYER',
  AI = 'AI',
  AI_RED = 'AI_RED',
  AI_GREEN = 'AI_GREEN'
}

export interface Planet {
  id: string;
  name: string;
  position: Vector3;
  size: number;
  fleetCount: number;
  owner: Owner;
  productionRate: number; // Fleets per second
  isSelected?: boolean;
  isTargeted?: boolean;
}

export interface FleetGroup {
  id: string;
  fromId: string;
  toId: string;
  count: number;
  owner: Owner;
  progress: number; // 0 to 1
  speed: number;
}

export interface GameState {
  planets: Planet[];
  fleets: FleetGroup[];
  gameStatus: 'MENU' | 'PLAYING' | 'WON' | 'LOST' | 'LOBBY';
  currentLevel: number;
  isMultiplayer: boolean;
  roomId?: string;
  playerId?: string;
}

export interface LevelConfig {
  id: number;
  name: string;
  planets: Omit<Planet, 'id' | 'isSelected' | 'isTargeted'>[];
}
