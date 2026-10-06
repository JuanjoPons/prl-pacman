/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { GameStats } from '../types/game';
import { sound } from '../game/audio/SoundSynthesizer';
import {
  Volume2,
  VolumeX,
  Pause,
  Play,
  RotateCcw,
  Shield,
  Clock,
  Award,
  UserCheck,
  Activity,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
} from 'lucide-react';

interface IndustrialHUDProps {
  stats: GameStats;
  isPaused: boolean;
  isMuted: boolean;
  protocolTimeRemaining: number;
  onTogglePause: () => void;
  onToggleMute: () => void;
  onRestart: () => void;
  onSendDirection: (dx: number, dy: number) => void;
}

export const IndustrialHUD: React.FC<IndustrialHUDProps> = ({
  stats,
  isPaused,
  isMuted,
  protocolTimeRemaining,
  onTogglePause,
  onToggleMute,
  onRestart,
  onSendDirection,
}) => {
  const percentComplete =
    stats.totalDotsInLevel > 0
      ? Math.min(100, Math.round((stats.dotsCollected / stats.totalDotsInLevel) * 100))
      : 0;

  return (
    <div className="w-full flex flex-col gap-3">
      {/* Barra de Telemetría Superior */}
      <div className="w-full bg-slate-900 border border-slate-700/80 rounded-xl p-3 shadow-lg flex flex-wrap items-center justify-between gap-3 text-xs">
        
        {/* Identificación del Alumno */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-sky-500/10 border border-sky-400/40 flex items-center justify-center text-sky-400">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-white text-sm">{stats.playerName || 'Alumno'}</span>
              <span className="text-slate-400">·</span>
              <span className="text-slate-300 font-mono text-xs">{stats.playerGroup}</span>
            </div>
            <div className="text-slate-400 text-[11px] truncate max-w-xs">{stats.playerCycle}</div>
          </div>
        </div>

        {/* Nivel de Planta y Progreso */}
        <div className="flex items-center gap-6">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-0.5">
              Sector / Nivel
            </span>
            <div className="flex items-center gap-1.5">
              <span className="font-mono font-bold text-sky-400 text-sm">
                NIVEL {stats.level} / 5
              </span>
              <span className="text-[11px] text-slate-400 font-mono">
                ({percentComplete}% auditado)
              </span>
            </div>
          </div>

          {/* Vidas / Cascos de Protección */}
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-0.5">
              Cascos de Seguridad
            </span>
            <div className="flex items-center gap-1 text-base">
              {Array.from({ length: 3 }).map((_, i) => (
                <span
                  key={i}
                  className={`transition-all ${
                    i < stats.lives
                      ? 'opacity-100 drop-shadow-[0_0_6px_rgba(234,179,8,0.5)]'
                      : 'opacity-20 grayscale'
                  }`}
                  title={i < stats.lives ? 'Casco disponible' : 'Casco dañado por impacto'}
                >
                  🪖
                </span>
              ))}
            </div>
          </div>

          {/* Marcador de Puntos Preventivos */}
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-0.5">
              Puntos de Seguridad
            </span>
            <div className="font-mono font-bold text-amber-400 text-sm tabular-nums">
              {stats.score.toLocaleString()} pts
            </div>
          </div>
        </div>

        {/* Botones de Utilidad */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={onTogglePause}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors cursor-pointer"
            title={isPaused ? 'Reanudar inspección' : 'Pausar inspección'}
          >
            {isPaused ? <Play className="w-4 h-4 text-emerald-400" /> : <Pause className="w-4 h-4" />}
          </button>

          <button
            type="button"
            onClick={onToggleMute}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors cursor-pointer"
            title={isMuted ? 'Activar audio' : 'Silenciar audio'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4" />}
          </button>

          <button
            type="button"
            onClick={onRestart}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors cursor-pointer"
            title="Reiniciar nivel"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Alerta de Protocolo de Seguridad Activo (EPI activado) */}
      {protocolTimeRemaining > 0 && (
        <div className="w-full bg-sky-950/90 border border-sky-400/80 rounded-lg p-2 px-3 shadow-md flex items-center justify-between text-xs text-sky-200 animate-pulse">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-sky-400 shrink-0" />
            <span className="font-bold">
              🛡️ PROTOCOLO DE SEGURIDAD ACTIVO: Los riesgos laborales están neutralizados para inspección
            </span>
          </div>
          <div className="font-mono font-bold text-sky-300 tabular-nums">
            {(protocolTimeRemaining / 60).toFixed(1)}s
          </div>
        </div>
      )}

      {/* Barra de progreso de inspección de la planta */}
      <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden border border-slate-800">
        <div
          className="bg-gradient-to-r from-sky-500 to-emerald-400 h-full transition-all duration-300"
          style={{ width: `${percentComplete}%` }}
        />
      </div>
    </div>
  );
};
