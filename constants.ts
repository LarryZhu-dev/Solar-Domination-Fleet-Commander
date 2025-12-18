import { Vector3 } from 'three';
import { Owner, LevelConfig } from './types';

export const COLORS = {
  [Owner.NEUTRAL]: '#808080',
  [Owner.PLAYER]: '#3b82f6', // Blue
  [Owner.AI]: '#ef4444',     // Red
  [Owner.AI_RED]: '#ef4444',
  [Owner.AI_GREEN]: '#10b981', // Green
};

export const LEVELS: LevelConfig[] = [
  {
    id: 1,
    name: "Inner Ring Conflict",
    planets: [
      { name: "Mercury", position: new Vector3(-10, 0, 0), size: 1.5, fleetCount: 10, owner: Owner.PLAYER, productionRate: 1 },
      { name: "Venus", position: new Vector3(0, 5, 0), size: 2.2, fleetCount: 20, owner: Owner.NEUTRAL, productionRate: 1.5 },
      { name: "Earth", position: new Vector3(10, 0, 0), size: 2.5, fleetCount: 50, owner: Owner.AI, productionRate: 2 },
    ]
  },
  {
    id: 2,
    name: "Mars Expansion",
    planets: [
      { name: "Earth", position: new Vector3(-15, 0, 0), size: 2.5, fleetCount: 20, owner: Owner.PLAYER, productionRate: 2 },
      { name: "Moon", position: new Vector3(-10, 5, 5), size: 1.0, fleetCount: 5, owner: Owner.PLAYER, productionRate: 0.5 },
      { name: "Mars", position: new Vector3(15, 0, 0), size: 2.0, fleetCount: 50, owner: Owner.AI, productionRate: 1.8 },
      { name: "Phobos", position: new Vector3(10, -5, 0), size: 0.8, fleetCount: 10, owner: Owner.NEUTRAL, productionRate: 0.5 },
      { name: "Deimos", position: new Vector3(10, 5, 0), size: 0.8, fleetCount: 10, owner: Owner.NEUTRAL, productionRate: 0.5 },
    ]
  },
  {
    id: 3,
    name: "Gas Giant Front",
    planets: [
      { name: "Ceres", position: new Vector3(-20, 0, 0), size: 1.2, fleetCount: 15, owner: Owner.PLAYER, productionRate: 1 },
      { name: "Jupiter", position: new Vector3(0, 0, 0), size: 4.5, fleetCount: 100, owner: Owner.NEUTRAL, productionRate: 5 },
      { name: "Saturn", position: new Vector3(20, 10, 0), size: 4.0, fleetCount: 60, owner: Owner.AI, productionRate: 4 },
      { name: "Titan", position: new Vector3(25, -5, 5), size: 1.8, fleetCount: 15, owner: Owner.NEUTRAL, productionRate: 1.2 },
    ]
  },
  {
    id: 4,
    name: "Outer Rim Reach",
    planets: [
      { name: "Uranus", position: new Vector3(-25, 10, 0), size: 3.0, fleetCount: 30, owner: Owner.PLAYER, productionRate: 2.5 },
      { name: "Neptune", position: new Vector3(25, -10, 0), size: 2.8, fleetCount: 40, owner: Owner.AI, productionRate: 2.5 },
      { name: "Pluto", position: new Vector3(0, 20, 10), size: 1.0, fleetCount: 10, owner: Owner.NEUTRAL, productionRate: 0.8 },
      { name: "Eris", position: new Vector3(0, -20, -10), size: 1.1, fleetCount: 10, owner: Owner.NEUTRAL, productionRate: 0.8 },
      { name: "Triton", position: new Vector3(20, 0, 0), size: 1.5, fleetCount: 20, owner: Owner.AI, productionRate: 1.5 },
    ]
  },
  {
    id: 5,
    name: "Solar System War",
    planets: [
      { name: "Sun", position: new Vector3(0, 0, 0), size: 6.0, fleetCount: 200, owner: Owner.NEUTRAL, productionRate: 10 },
      { name: "Mercury", position: new Vector3(-10, 5, 2), size: 1.2, fleetCount: 20, owner: Owner.PLAYER, productionRate: 1 },
      { name: "Venus", position: new Vector3(-15, -5, -3), size: 2.0, fleetCount: 20, owner: Owner.PLAYER, productionRate: 1.8 },
      { name: "Earth", position: new Vector3(20, 5, 0), size: 2.2, fleetCount: 50, owner: Owner.AI, productionRate: 2 },
      { name: "Mars", position: new Vector3(25, -5, 5), size: 1.8, fleetCount: 30, owner: Owner.AI, productionRate: 1.5 },
      { name: "Jupiter", position: new Vector3(-30, 15, -10), size: 4.0, fleetCount: 100, owner: Owner.AI_GREEN, productionRate: 5 },
      { name: "Saturn", position: new Vector3(30, -20, 10), size: 3.5, fleetCount: 80, owner: Owner.AI_RED, productionRate: 4 },
    ]
  }
];

export const GAME_SPEED = 1.0;