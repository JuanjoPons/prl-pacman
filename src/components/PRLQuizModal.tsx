/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { PRLQuestion, PPEItem } from '../types/game';
import { sound } from '../game/audio/SoundSynthesizer';
import { ShieldCheck, AlertTriangle, BookOpen, CheckCircle, ArrowRight } from 'lucide-react';

interface PRLQuizModalProps {
  question: PRLQuestion;
  ppeItem: PPEItem;
  onAnswerComplete: (isCorrect: boolean) => void;
}

export const PRLQuizModal: React.FC<PRLQuizModalProps> = ({
  question,
  ppeItem,
  onAnswerComplete,
}) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);

  const handleSelect = (index: number) => {
    if (isAnswered) return;
    setSelectedIndex(index);
    setIsAnswered(true);

    const isCorrect = index === question.correctIndex;
    if (isCorrect) {
      sound.playQuizCorrect();
    } else {
      sound.playQuizWrong();
    }
  };

  const handleContinue = () => {
    onAnswerComplete(selectedIndex === question.correctIndex);
  };

  const isCorrect = selectedIndex === question.correctIndex;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-xl bg-slate-900 border-2 border-sky-500 rounded-xl shadow-2xl p-6 text-slate-100 flex flex-col gap-5">
        
        {/* Cabecera del EPI Equipado */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-sky-500/20 border border-sky-400 flex items-center justify-center text-2xl shadow-inner">
              {ppeItem.icon}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-sky-400 tracking-wider uppercase">
                  {ppeItem.standard}
                </span>
                <span className="text-xs text-slate-400">·</span>
                <span className="text-xs text-slate-300">{question.category}</span>
              </div>
              <h2 className="text-lg font-bold text-white tracking-tight">{ppeItem.name}</h2>
            </div>
          </div>
          <div className="px-3 py-1 bg-sky-950 border border-sky-500/40 rounded text-xs font-mono text-sky-300 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-sky-400" />
            <span>Reto de EPI</span>
          </div>
        </div>

        {/* Pregunta Técnica de PRL */}
        <div className="space-y-1">
          <div className="text-xs font-medium text-amber-400 flex items-center gap-1">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Referencia: {question.standardReference}</span>
          </div>
          <p className="text-base font-semibold text-slate-100 leading-snug">
            {question.question}
          </p>
        </div>

        {/* Opciones de Respuesta */}
        <div className="space-y-2.5">
          {question.options.map((option, idx) => {
            let optionStyles = 'bg-slate-800/80 hover:bg-slate-700/80 border-slate-700 text-slate-200';

            if (isAnswered) {
              if (idx === question.correctIndex) {
                optionStyles = 'bg-emerald-950/80 border-emerald-500 text-emerald-200 font-medium shadow-sm';
              } else if (idx === selectedIndex) {
                optionStyles = 'bg-rose-950/80 border-rose-500 text-rose-200 line-through';
              } else {
                optionStyles = 'bg-slate-800/40 border-slate-800 text-slate-500 opacity-60';
              }
            }

            return (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelect(idx)}
                disabled={isAnswered}
                className={`w-full text-left p-3.5 rounded-lg border transition-all flex items-start gap-3 text-sm leading-relaxed ${optionStyles} ${
                  !isAnswered ? 'cursor-pointer active:scale-[0.99]' : 'cursor-default'
                }`}
              >
                <span className="w-6 h-6 rounded bg-slate-900/80 border border-slate-600 flex items-center justify-center font-mono text-xs font-bold text-slate-300 shrink-0 mt-0.5">
                  {String.fromCharCode(65 + idx)}
                </span>
                <span className="flex-1">{option}</span>
                {isAnswered && idx === question.correctIndex && (
                  <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
                )}
                {isAnswered && idx === selectedIndex && idx !== question.correctIndex && (
                  <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {/* Retroalimentación didáctica y explicación */}
        {isAnswered && (
          <div
            className={`p-4 rounded-lg border text-xs leading-relaxed animate-fadeIn ${
              isCorrect
                ? 'bg-emerald-950/50 border-emerald-600/70 text-emerald-200'
                : 'bg-amber-950/50 border-amber-600/70 text-amber-200'
            }`}
          >
            <div className="font-bold flex items-center gap-1.5 mb-1 text-sm">
              {isCorrect ? (
                <>
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  <span>¡Criterio Preventivo Correcto! (+150 pts)</span>
                </>
              ) : (
                <>
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  <span>Criterio a Reforzar (+25 pts de consolidación)</span>
                </>
              )}
            </div>
            <p className="opacity-95">{question.explanation}</p>
            {isCorrect && (
              <div className="mt-2 text-sky-300 font-medium">
                🛡️ Protocolo de Seguridad Activado: los riesgos quedan neutralizados temporalmente para inspección.
              </div>
            )}
          </div>
        )}

        {/* Botón de Acción */}
        {isAnswered && (
          <div className="pt-2 flex justify-end">
            <button
              type="button"
              onClick={handleContinue}
              className="px-5 py-2.5 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-sm rounded-lg shadow-lg shadow-sky-500/20 flex items-center gap-2 transition-transform active:scale-95 cursor-pointer"
            >
              <span>Continuar Inspección de Planta</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
