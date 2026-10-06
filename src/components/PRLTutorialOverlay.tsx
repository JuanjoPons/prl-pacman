/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { TUTORIAL_PHASES, InteractiveTutorialPhase } from '../game/data/tutorialSteps';
import { ShieldCheck, ArrowRight, SkipForward, CheckCircle2, Navigation, AlertOctagon } from 'lucide-react';

interface PRLTutorialOverlayProps {
  currentStep: number;
  dotsCollectedInTutorial: number;
  hasMoved: boolean;
  hasCollectedPPE: boolean;
  onNextStep: () => void;
  onSkipTutorial: () => void;
}

export const PRLTutorialOverlay: React.FC<PRLTutorialOverlayProps> = ({
  currentStep,
  dotsCollectedInTutorial,
  hasMoved,
  hasCollectedPPE,
  onNextStep,
  onSkipTutorial,
}) => {
  const phase: InteractiveTutorialPhase =
    TUTORIAL_PHASES.find((p) => p.step === currentStep) || TUTORIAL_PHASES[0];

  let isRequirementMet = false;
  let statusText = '';

  switch (currentStep) {
    case 1:
      isRequirementMet = hasMoved;
      statusText = hasMoved
        ? '¡Desplazamiento iniciado con éxito! Comprueba el viraje suave.'
        : 'Usa las FLECHAS o WASD (o el D-Pad) para mover al operario.';
      break;
    case 2:
      const needed = phase.targetCount || 6;
      isRequirementMet = dotsCollectedInTutorial >= needed;
      statusText = `Medidas preventivas recogidas: ${Math.min(dotsCollectedInTutorial, needed)} / ${needed}`;
      break;
    case 3:
      isRequirementMet = true; // Observation step
      statusText = 'Riesgos observados. Mantén siempre las distancias de seguridad reglamentarias.';
      break;
    case 4:
      isRequirementMet = hasCollectedPPE;
      statusText = hasCollectedPPE
        ? '¡EPI recogido y evaluado correctamente!'
        : 'Avanza hacia un EPI reglamentario en las esquinas del pasillo.';
      break;
    case 5:
      isRequirementMet = true;
      statusText = 'Todo listo para la inspección oficial de la planta.';
      break;
  }

  return (
    <div className="w-full bg-slate-900/95 border-2 border-amber-500/80 rounded-xl p-4 shadow-xl backdrop-blur-md text-slate-100 flex flex-col gap-3">
      {/* Barra superior del tutorial */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-amber-500 text-slate-950 font-bold text-xs flex items-center justify-center">
            {currentStep}
          </span>
          <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
            Tutorial de Inducción PRL ({currentStep}/5)
          </span>
          <span className="text-xs text-slate-400">·</span>
          <span className="text-xs text-slate-400 font-mono">{phase.badge}</span>
        </div>

        <button
          type="button"
          onClick={onSkipTutorial}
          className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1 transition-colors cursor-pointer"
        >
          <span>Saltar inducción</span>
          <SkipForward className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Contenido didáctico */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs bg-slate-950/60 p-3 rounded-lg border border-slate-800">
        <div>
          <span className="font-semibold text-sky-400 block mb-0.5">Concepto Técnico PRL:</span>
          <p className="text-slate-300 leading-relaxed">{phase.conceptPRL}</p>
        </div>
        <div>
          <span className="font-semibold text-amber-300 block mb-0.5">Metáfora en la Planta:</span>
          <p className="text-slate-300 leading-relaxed">{phase.gameMetaphor}</p>
        </div>
      </div>

      {/* Instrucción práctica y estado */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-1 border-t border-slate-800">
        <div className="flex items-center gap-2">
          {isRequirementMet ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          ) : (
            <Navigation className="w-4 h-4 text-sky-400 shrink-0 animate-pulse" />
          )}
          <span className={`text-xs font-medium ${isRequirementMet ? 'text-emerald-300' : 'text-slate-300'}`}>
            {statusText}
          </span>
        </div>

        <button
          type="button"
          onClick={onNextStep}
          disabled={!isRequirementMet}
          className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
            isRequirementMet
              ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md shadow-amber-500/20 active:scale-95'
              : 'bg-slate-800 text-slate-500 cursor-not-allowed opacity-60'
          }`}
        >
          <span>{currentStep === 5 ? 'Iniciar Inspección Oficial' : 'Siguiente Concepto'}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
