/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { GameStats } from '../types/game';
import { Award, CheckCircle, AlertTriangle, RotateCcw, Printer, Shield, FileCheck } from 'lucide-react';

interface PRLReportModalProps {
  stats: GameStats;
  isVictory: boolean;
  onRestart: () => void;
}

export const PRLReportModal: React.FC<PRLReportModalProps> = ({
  stats,
  isVictory,
  onRestart,
}) => {
  const quizAccuracy =
    stats.quizTotal > 0 ? Math.round((stats.quizCorrect / stats.quizTotal) * 100) : 100;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-slate-900 border-2 border-slate-700 rounded-2xl shadow-2xl p-6 sm:p-8 text-slate-100 flex flex-col gap-6">
        
        {/* Cabecera Oficial */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-700">
          <div className="flex items-center gap-3">
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl border ${
                isVictory
                  ? 'bg-emerald-500/20 border-emerald-400 text-emerald-400'
                  : 'bg-rose-500/20 border-rose-400 text-rose-400'
              }`}
            >
              {isVictory ? <Award className="w-7 h-7" /> : <AlertTriangle className="w-7 h-7" />}
            </div>
            <div>
              <div className="text-xs uppercase font-bold tracking-wider text-slate-400">
                Auditoría Técnica de Prevención (ISO 45001 / RD 486/1997)
              </div>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                {isVictory ? '¡Auditoría de Planta Superada con Éxito!' : 'Auditoría Interrumpida por Incidente'}
              </h1>
            </div>
          </div>

          <div
            className={`px-3 py-1.5 rounded-lg border text-xs font-mono font-bold self-start sm:self-center ${
              isVictory
                ? 'bg-emerald-950 text-emerald-300 border-emerald-500/50'
                : 'bg-rose-950 text-rose-300 border-rose-500/50'
            }`}
          >
            {isVictory ? 'APTO EN PRL' : 'REVISIÓN REQUERIDA'}
          </div>
        </div>

        {/* Datos del Alumno y Entorno */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-xl bg-slate-950/70 border border-slate-800 text-xs">
          <div>
            <span className="text-slate-400 block mb-0.5">Alumno Evaluado:</span>
            <span className="font-bold text-white text-sm">{stats.playerName || 'Alumno'}</span>
          </div>
          <div>
            <span className="text-slate-400 block mb-0.5">Grupo / Módulo:</span>
            <span className="font-bold text-slate-200">{stats.playerGroup || 'General'}</span>
          </div>
          <div>
            <span className="text-slate-400 block mb-0.5">Ciclo Formativo:</span>
            <span className="font-bold text-slate-200 truncate block">{stats.playerCycle || 'PRL'}</span>
          </div>
        </div>

        {/* Métricas de Evaluación Preventiva */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
            <span className="text-[11px] text-slate-400 block mb-1">Puntos Totales</span>
            <span className="text-xl font-bold font-mono text-amber-400 tabular-nums">
              {stats.score.toLocaleString()}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
            <span className="text-[11px] text-slate-400 block mb-1">Sector Alcanzado</span>
            <span className="text-xl font-bold font-mono text-sky-400">
              {stats.level} / 5
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
            <span className="text-[11px] text-slate-400 block mb-1">Criterio en EPIs</span>
            <span className="text-xl font-bold font-mono text-emerald-400 tabular-nums">
              {quizAccuracy}%
            </span>
            <span className="text-[10px] text-slate-400 block mt-0.5">
              ({stats.quizCorrect}/{stats.quizTotal} aciertos)
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
            <span className="text-[11px] text-slate-400 block mb-1">Riesgos Auditados</span>
            <span className="text-xl font-bold font-mono text-purple-400 tabular-nums">
              {stats.hazardsNeutralized}
            </span>
          </div>
        </div>

        {/* Dictamen Didáctico */}
        <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/50 text-xs leading-relaxed text-slate-300">
          <div className="flex items-center gap-2 font-bold text-white mb-1.5 text-sm">
            <FileCheck className="w-4 h-4 text-sky-400" />
            <span>Dictamen Pedagógico:</span>
          </div>
          {isVictory ? (
            <p>
              El operario ha demostrado un conocimiento riguroso de las sendas peatonales de la planta,
              identificación proactiva de riesgos (químicos, mecánicos, eléctricos y caídas) y una correcta
              aplicación de los EPIs reglamentarios conforme al RD 773/1997.
            </p>
          ) : (
            <p>
              El operario ha sufrido incidentes de seguridad que agotaron los cascos de protección. Se
              recomienda extremar la precaución en cruces con carretillas elevadoras, mantener mayor distancia
              con cuadros eléctricos y consolidar el uso de EPIs antes de intervenir en zonas de riesgo.
            </p>
          )}
        </div>

        {/* Acciones */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-slate-800">
          <button
            type="button"
            onClick={handlePrint}
            className="w-full sm:w-auto px-4 py-2.5 rounded-lg border border-slate-600 hover:bg-slate-800 text-xs font-semibold text-slate-300 flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Imprimir / Guardar Acta</span>
          </button>

          <button
            type="button"
            onClick={onRestart}
            className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-bold shadow-lg shadow-sky-500/20 flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>{isVictory ? 'Iniciar Nueva Auditoría' : 'Reintentar Inspección'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
