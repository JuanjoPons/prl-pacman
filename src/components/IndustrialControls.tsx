/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Compass } from 'lucide-react';

interface IndustrialControlsProps {
  onSendDirection: (dx: number, dy: number) => void;
  activeDir?: { dx: number; dy: number };
}

export const IndustrialControls: React.FC<IndustrialControlsProps> = ({
  onSendDirection,
  activeDir,
}) => {
  return (
    <div className="flex flex-col items-center gap-3 select-none">
      <div className="flex items-center gap-2 text-xs text-slate-400">
        <Compass className="w-3.5 h-3.5 text-sky-400" />
        <span>Control: <strong>Flechas</strong> / <strong>WASD</strong> o botonera táctil industrial</span>
      </div>

      {/* Botonera Industrial D-Pad (tipo mando telemandado industrial) */}
      <div className="p-3 bg-slate-900/90 border-2 border-slate-700/80 rounded-2xl shadow-xl flex flex-col items-center gap-2">
        {/* Fila Superior */}
        <div className="flex justify-center">
          <button
            type="button"
            onPointerDown={() => onSendDirection(0, -1)}
            className={`w-14 h-14 rounded-xl font-bold flex items-center justify-center border transition-all active:scale-95 cursor-pointer ${
              activeDir?.dy === -1
                ? 'bg-amber-500 text-slate-950 border-amber-300 shadow-md shadow-amber-500/30'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-600'
            }`}
            title="Avanzar hacia el norte (Arriba)"
          >
            <ArrowUp className="w-7 h-7" />
          </button>
        </div>

        {/* Fila Central */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onPointerDown={() => onSendDirection(-1, 0)}
            className={`w-14 h-14 rounded-xl font-bold flex items-center justify-center border transition-all active:scale-95 cursor-pointer ${
              activeDir?.dx === -1
                ? 'bg-amber-500 text-slate-950 border-amber-300 shadow-md shadow-amber-500/30'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-600'
            }`}
            title="Girar hacia el oeste (Izquierda)"
          >
            <ArrowLeft className="w-7 h-7" />
          </button>

          <div className="w-14 h-14 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-center text-xs font-mono font-bold text-slate-500">
            PRL
          </div>

          <button
            type="button"
            onPointerDown={() => onSendDirection(1, 0)}
            className={`w-14 h-14 rounded-xl font-bold flex items-center justify-center border transition-all active:scale-95 cursor-pointer ${
              activeDir?.dx === 1
                ? 'bg-amber-500 text-slate-950 border-amber-300 shadow-md shadow-amber-500/30'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-600'
            }`}
            title="Girar hacia el este (Derecha)"
          >
            <ArrowRight className="w-7 h-7" />
          </button>
        </div>

        {/* Fila Inferior */}
        <div className="flex justify-center">
          <button
            type="button"
            onPointerDown={() => onSendDirection(0, 1)}
            className={`w-14 h-14 rounded-xl font-bold flex items-center justify-center border transition-all active:scale-95 cursor-pointer ${
              activeDir?.dy === 1
                ? 'bg-amber-500 text-slate-950 border-amber-300 shadow-md shadow-amber-500/30'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-600'
            }`}
            title="Avanzar hacia el sur (Abajo)"
          >
            <ArrowDown className="w-7 h-7" />
          </button>
        </div>
      </div>
    </div>
  );
};
