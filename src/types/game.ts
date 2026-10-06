/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Direction = {
  dx: number;
  dy: number;
};

export const DIR_NONE: Direction = { dx: 0, dy: 0 };
export const DIR_UP: Direction = { dx: 0, dy: -1 };
export const DIR_DOWN: Direction = { dx: 0, dy: 1 };
export const DIR_LEFT: Direction = { dx: -1, dy: 0 };
export const DIR_RIGHT: Direction = { dx: 1, dy: 0 };

export enum TileType {
  EMPTY = 0,
  WALL = 1,
  PREVENTIVE_DOT = 2,
  PPE_SPECIAL = 3,
  SPAWN_GATE = 4,
}

export type HazardType = 'FORKLIFT' | 'CHEMICAL' | 'ELECTRICAL' | 'FALL';

export interface Hazard {
  id: number;
  type: HazardType;
  title: string;
  name: string;
  regulationCode: string;
  x: number;
  y: number;
  dirX: number;
  dirY: number;
  speed: number;
  baseColor: string;
  warningIcon: string;
  isNeutralized: boolean;
  neutralizedTimer: number;
  respawnX: number;
  respawnY: number;
}

export type PPEType = 'HELMET' | 'GLOVES' | 'EXTINGUISHER' | 'HARNESS';

export interface PPEItem {
  type: PPEType;
  name: string;
  standard: string;
  icon: string;
  description: string;
}

export interface Player {
  x: number;
  y: number;
  dirX: number;
  dirY: number;
  queuedDirX: number;
  queuedDirY: number;
  speed: number;
  angle: number;
  isMoving: boolean;
  equippedPPE: PPEItem | null;
  footstepTimer: number;
}

export interface PRLQuestion {
  id: string;
  category: string;
  standardReference: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export type GameStatus =
  | 'REGISTER'
  | 'TUTORIAL'
  | 'PLAYING'
  | 'QUIZ'
  | 'PAUSED'
  | 'LEVEL_CLEARED'
  | 'GAME_OVER'
  | 'VICTORY';

export interface TutorialStep {
  id: number;
  title: string;
  concept: string;
  directive: string;
  targetTiles?: { x: number; y: number }[];
  requiredAction?: 'MOVE' | 'COLLECT_DOTS' | 'COLLECT_PPE' | 'AVOID_HAZARD';
}

export interface GameStats {
  playerName: string;
  playerGroup: string;
  playerCycle: string;
  score: number;
  lives: number;
  level: number;
  dotsCollected: number;
  totalDotsInLevel: number;
  ppesCollected: number;
  hazardsNeutralized: number;
  quizCorrect: number;
  quizTotal: number;
  elapsedSeconds: number;
}
