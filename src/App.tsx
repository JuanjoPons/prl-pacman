/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  GameStatus,
  GameStats,
  Player,
  Hazard,
  TileType,
  PPEItem,
  PRLQuestion,
} from './types/game';
import { LEVEL_MAPS, TUTORIAL_MAP, PPE_CATALOG } from './game/data/levelMaps';
import { PRL_QUESTIONS } from './game/data/quizQuestions';
import { MovementEngine } from './game/physics/MovementEngine';
import { IndustrialRenderer } from './game/render/IndustrialRenderer';
import { sound } from './game/audio/SoundSynthesizer';
import { IndustrialHUD } from './components/IndustrialHUD';
import { IndustrialControls } from './components/IndustrialControls';
import { PRLQuizModal } from './components/PRLQuizModal';
import { PRLTutorialOverlay } from './components/PRLTutorialOverlay';
import { PRLReportModal } from './components/PRLReportModal';
import {
  ShieldAlert,
  Play,
  HelpCircle,
  HardHat,
  Award,
  BookOpen,
  Building2,
  CheckCircle2,
  FileSpreadsheet,
  AlertTriangle,
} from 'lucide-react';

export default function App() {
  // Estado de navegación y partida
  const [status, setStatus] = useState<GameStatus>('REGISTER');
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  // Registro del alumno
  const [studentName, setStudentName] = useState<string>('Alumno PRL');
  const [studentGroup, setStudentGroup] = useState<string>('1º Grupo A');
  const [studentCycle, setStudentCycle] = useState<string>('Prevención de Riesgos Laborales / Ciclo Formativo');
  const [startWithTutorial, setStartWithTutorial] = useState<boolean>(true);

  // Estadísticas del juego
  const [stats, setStats] = useState<GameStats>({
    playerName: '',
    playerGroup: '',
    playerCycle: '',
    score: 0,
    lives: 3,
    level: 1,
    dotsCollected: 0,
    totalDotsInLevel: 0,
    ppesCollected: 0,
    hazardsNeutralized: 0,
    quizCorrect: 0,
    quizTotal: 0,
    elapsedSeconds: 0,
  });

  // Tutorial interactivo
  const [tutorialStep, setTutorialStep] = useState<number>(1);
  const [tutorialDots, setTutorialDots] = useState<number>(0);
  const [tutorialHasMoved, setTutorialHasMoved] = useState<boolean>(false);
  const [tutorialHasPPE, setTutorialHasPPE] = useState<boolean>(false);

  // Reto didáctico de PRL
  const [activeQuizQuestion, setActiveQuizQuestion] = useState<PRLQuestion | null>(null);
  const [activePPE, setActivePPE] = useState<PPEItem | null>(null);
  const [levelClearedNotice, setLevelClearedNotice] = useState<string | null>(null);

  // Temporizador de protocolo de seguridad
  const [protocolTimeRemaining, setProtocolTimeRemaining] = useState<number>(0);

  // Referencias del motor
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const currentMapRef = useRef<number[][]>([]);
  const engineRef = useRef<MovementEngine | null>(null);
  const rendererRef = useRef<IndustrialRenderer | null>(null);
  const questionPoolRef = useRef<PRLQuestion[]>([]);
  const levelRef = useRef<number>(1);

  const playerRef = useRef<Player>({
    x: 9,
    y: 16,
    dirX: 0,
    dirY: 0,
    queuedDirX: 0,
    queuedDirY: 0,
    speed: 0.088,
    angle: 0,
    isMoving: false,
    equippedPPE: null,
    footstepTimer: 0,
  });

  const hazardsRef = useRef<Hazard[]>([]);
  const animFrameIdRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(performance.now());
  const protocolCounterRef = useRef<number>(0);
  const dotsRemainingRef = useRef<number>(0);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  // Inicializar nivel
  const setupLevel = useCallback((levelNum: number, isTutorialMode: boolean = false) => {
    const rawTemplate = isTutorialMode
      ? TUTORIAL_MAP
      : LEVEL_MAPS[(levelNum - 1) % LEVEL_MAPS.length];

    // Clonar mapa bidimensional
    const newMap = rawTemplate.map((row) => [...row]);
    currentMapRef.current = newMap;

    let dotCount = 0;
    for (let r = 0; r < newMap.length; r++) {
      for (let c = 0; c < newMap[r].length; c++) {
        if (newMap[r][c] === TileType.PREVENTIVE_DOT || newMap[r][c] === TileType.PPE_SPECIAL) {
          dotCount++;
        }
      }
    }
    dotsRemainingRef.current = dotCount;

    // Posición inicial del operario
    const startX = Math.floor(newMap[0].length / 2);
    const startY = newMap.length - 3;

    playerRef.current = {
      x: startX,
      y: startY,
      dirX: 0,
      dirY: 0,
      queuedDirX: 0,
      queuedDirY: 0,
      speed: 0.084 + levelNum * 0.008,
      angle: -Math.PI / 2,
      isMoving: false,
      equippedPPE: null,
      footstepTimer: 0,
    };

    // Configuración de los riesgos laborales
    const hazardTypes: { type: Hazard['type']; title: string; code: string; color: string }[] = [
      { type: 'FORKLIFT', title: 'Carretilla Elevadora AGV', code: 'RD 1215/1997', color: '#f59e0b' },
      { type: 'CHEMICAL', title: 'Fuga de Químico Corrosivo', code: 'Reglamento CLP', color: '#10b981' },
      { type: 'ELECTRICAL', title: 'Cuadro de Alta Tensión', code: 'RD 614/2001', color: '#0284c7' },
      { type: 'FALL', title: 'Carga Suspendida en Altura', code: 'RD 2177/2004', color: '#dc2626' },
    ];

    // Encontrar la fila de pasillo central transitable más cercana al centro
    const centerCol = Math.floor(newMap[0].length / 2);
    let openRow = Math.floor(newMap.length / 2) - 1;

    for (let r = openRow - 1; r <= openRow + 2; r++) {
      if (
        r >= 0 &&
        r < newMap.length &&
        newMap[r][centerCol] !== TileType.WALL &&
        newMap[r][centerCol] !== TileType.SPAWN_GATE
      ) {
        openRow = r;
        break;
      }
    }

    // Buscar columnas libres contiguas en openRow
    const openCols: number[] = [];
    for (let c = centerCol - 4; c <= centerCol + 4; c++) {
      if (
        c >= 0 &&
        c < newMap[0].length &&
        newMap[openRow][c] !== TileType.WALL &&
        newMap[openRow][c] !== TileType.SPAWN_GATE
      ) {
        openCols.push(c);
      }
    }
    const safeCols = openCols.length > 0 ? openCols : [centerCol];

    const numHazards = isTutorialMode ? 2 : Math.min(2 + Math.floor((levelNum + 1) / 2), 4);
    const newHazards: Hazard[] = [];

    for (let i = 0; i < numHazards; i++) {
      const hConfig = hazardTypes[i % hazardTypes.length];
      const spawnX = safeCols[i % safeCols.length];
      const spawnY = openRow;
      const initialDirX = i % 2 === 0 ? 1 : -1;
      newHazards.push({
        id: i,
        type: hConfig.type,
        name: hConfig.title,
        title: hConfig.title,
        regulationCode: hConfig.code,
        x: spawnX,
        y: spawnY,
        dirX: initialDirX,
        dirY: 0,
        speed: (0.062 + levelNum * 0.007) * (isTutorialMode ? 0.65 : 1),
        baseColor: hConfig.color,
        warningIcon: '⚠️',
        isNeutralized: false,
        neutralizedTimer: 0,
        respawnX: centerCol,
        respawnY: openRow,
      });
    }
    hazardsRef.current = newHazards;

    // Actualizar motor de movimiento
    if (!engineRef.current) {
      engineRef.current = new MovementEngine(newMap);
    } else {
      engineRef.current.setMap(newMap);
    }

    // Configurar dimensiones de canvas
    if (canvasRef.current) {
      const cols = newMap[0].length;
      const rows = newMap.length;
      const tileSize = cols > 18 ? 28 : 32;
      canvasRef.current.width = cols * tileSize;
      canvasRef.current.height = rows * tileSize;
      rendererRef.current = new IndustrialRenderer(canvasRef.current, tileSize);
    }

    protocolCounterRef.current = 0;
    setProtocolTimeRemaining(0);

    setStats((prev) => ({
      ...prev,
      level: levelNum,
      dotsCollected: 0,
      totalDotsInLevel: dotCount,
    }));
  }, []);

  // Asegurar que el renderizador se inicializa tan pronto como el canvas esté montado en el DOM
  useEffect(() => {
    if (
      (status === 'PLAYING' || status === 'TUTORIAL') &&
      canvasRef.current &&
      currentMapRef.current.length > 0
    ) {
      const cols = currentMapRef.current[0].length;
      const rows = currentMapRef.current.length;
      const tileSize = cols > 18 ? 28 : 32;
      canvasRef.current.width = cols * tileSize;
      canvasRef.current.height = rows * tileSize;
      rendererRef.current = new IndustrialRenderer(canvasRef.current, tileSize);
    }
  }, [status, stats.level]);

  // Iniciar partida o tutorial
  const handleStartGame = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!studentName.trim()) {
      return;
    }

    const initialStats: GameStats = {
      playerName: studentName.trim(),
      playerGroup: studentGroup.trim() || 'General',
      playerCycle: studentCycle.trim() || 'Prevención de Riesgos Laborales',
      score: 0,
      lives: 3,
      level: 1,
      dotsCollected: 0,
      totalDotsInLevel: 0,
      ppesCollected: 0,
      hazardsNeutralized: 0,
      quizCorrect: 0,
      quizTotal: 0,
      elapsedSeconds: 0,
    };
    setStats(initialStats);

    if (startWithTutorial) {
      setStatus('TUTORIAL');
      setTutorialStep(1);
      setTutorialDots(0);
      setTutorialHasMoved(false);
      setTutorialHasPPE(false);
      setupLevel(1, true);
    } else {
      setStatus('PLAYING');
      setupLevel(1, false);
    }
  };

  // Obtener la siguiente pregunta del pool sin repeticiones
  const getNextQuizQuestion = useCallback((): PRLQuestion => {
    if (questionPoolRef.current.length === 0) {
      // Barajar el banco completo de 25 preguntas
      const shuffled = [...PRL_QUESTIONS].sort(() => Math.random() - 0.5);
      questionPoolRef.current = shuffled;
    }
    return questionPoolRef.current.pop() || PRL_QUESTIONS[0];
  }, []);

  // Nivel superado y transición al siguiente sector
  const handleLevelCleared = useCallback(() => {
    sound.playVictory();
    const currentLvl = levelRef.current;

    if (currentLvl >= 5) {
      setLevelClearedNotice('¡AUDITORÍA INTEGRAL DE PLANTA SUPERADA!');
      setTimeout(() => {
        setLevelClearedNotice(null);
        setStatus('VICTORY');
      }, 1600);
      return;
    }

    const nextLvl = currentLvl + 1;
    levelRef.current = nextLvl;
    setLevelClearedNotice(`¡SECTOR ${currentLvl} AUDITADO! (+500 PUNTOS)`);

    setStats((prev) => ({
      ...prev,
      score: prev.score + 500,
      level: nextLvl,
    }));

    setTimeout(() => {
      setLevelClearedNotice(null);
      setupLevel(nextLvl, false);
    }, 1800);
  }, [setupLevel]);

  // Recogida de puntos y EPIs
  const handleItemCollected = useCallback(
    (col: number, row: number, tile: TileType) => {
      // 1. Reducir siempre el contador de elementos pendientes del nivel
      dotsRemainingRef.current = Math.max(0, dotsRemainingRef.current - 1);

      if (tile === TileType.PREVENTIVE_DOT) {
        sound.playDot();
        setStats((prev) => ({
          ...prev,
          score: prev.score + 10,
          dotsCollected: prev.dotsCollected + 1,
        }));

        if (status === 'TUTORIAL') {
          setTutorialDots((prev) => prev + 1);
        }
      } else if (tile === TileType.PPE_SPECIAL) {
        sound.playPPE();
        const ppe = PPE_CATALOG[Math.floor(Math.random() * PPE_CATALOG.length)];
        const question = getNextQuizQuestion();

        setActivePPE(ppe);
        setActiveQuizQuestion(question);
        setStatus('QUIZ');

        if (status === 'TUTORIAL') {
          setTutorialHasPPE(true);
        }
      }

      // 2. Comprobar cuántos elementos quedan físicamente en el mapa
      let remainingOnBoard = 0;
      for (let r = 0; r < currentMapRef.current.length; r++) {
        for (let c = 0; c < currentMapRef.current[r].length; c++) {
          if (
            currentMapRef.current[r][c] === TileType.PREVENTIVE_DOT ||
            currentMapRef.current[r][c] === TileType.PPE_SPECIAL
          ) {
            remainingOnBoard++;
          }
        }
      }

      // Si se han recogido todas las medidas preventivas y EPIs del sector
      if (dotsRemainingRef.current <= 0 || remainingOnBoard <= 0) {
        if (status === 'TUTORIAL') {
          setTutorialStep(5);
        } else if (status === 'PLAYING') {
          handleLevelCleared();
        }
      }
    },
    [status, getNextQuizQuestion, handleLevelCleared]
  );

  // Respuesta al reto de PRL
  const handleQuizAnswer = (isCorrect: boolean) => {
    const pointsAwarded = isCorrect ? 150 : 25;
    const protocolDuration = isCorrect ? 540 : 300; // ~9s o 5s

    protocolCounterRef.current = protocolDuration;
    setProtocolTimeRemaining(protocolDuration);

    setStats((prev) => ({
      ...prev,
      score: prev.score + pointsAwarded,
      ppesCollected: prev.ppesCollected + 1,
      quizTotal: prev.quizTotal + 1,
      quizCorrect: isCorrect ? prev.quizCorrect + 1 : prev.quizCorrect,
    }));

    setActiveQuizQuestion(null);
    setActivePPE(null);

    // Comprobar si al cerrar el quiz el sector ya estaba completado
    let remainingOnBoard = 0;
    for (let r = 0; r < currentMapRef.current.length; r++) {
      for (let c = 0; c < currentMapRef.current[r].length; c++) {
        if (
          currentMapRef.current[r][c] === TileType.PREVENTIVE_DOT ||
          currentMapRef.current[r][c] === TileType.PPE_SPECIAL
        ) {
          remainingOnBoard++;
        }
      }
    }

    if (dotsRemainingRef.current <= 0 || remainingOnBoard <= 0) {
      if (tutorialStep < 5 && tutorialDots < 30 && status === 'TUTORIAL') {
        setTutorialStep(5);
      } else {
        setStatus('PLAYING');
        handleLevelCleared();
      }
    } else {
      setStatus(tutorialStep < 5 && tutorialDots < 30 ? 'TUTORIAL' : 'PLAYING');
    }
  };

  // Manejo de impacto con riesgo
  const handleHazardCollision = (hazard: Hazard) => {
    if (protocolCounterRef.current > 0) {
      // Neutralizar riesgo
      sound.playNeutralize();
      hazard.isNeutralized = true;
      setStats((prev) => ({
        ...prev,
        score: prev.score + 200,
        hazardsNeutralized: prev.hazardsNeutralized + 1,
      }));
    } else {
      // Accidente laboral: perder un casco de seguridad
      sound.playHazardHit();
      const remainingLives = stats.lives - 1;
      setStats((prev) => ({
        ...prev,
        lives: remainingLives,
      }));

      if (remainingLives <= 0) {
        setStatus('GAME_OVER');
      } else {
        // Respawnear al operario en su posición inicial
        const cols = currentMapRef.current[0].length;
        const rows = currentMapRef.current.length;
        playerRef.current.x = Math.floor(cols / 2);
        playerRef.current.y = rows - 3;
        playerRef.current.dirX = 0;
        playerRef.current.dirY = 0;
        playerRef.current.queuedDirX = 0;
        playerRef.current.queuedDirY = 0;

        // Reposicionar riesgos en su punto central de patrulla
        hazardsRef.current.forEach((h, idx) => {
          h.x = h.respawnX;
          h.y = h.respawnY;
          h.dirX = idx % 2 === 0 ? 1 : -1;
          h.dirY = 0;
          h.isNeutralized = false;
        });
      }
    }
  };

  // Enviar dirección desde teclado o D-Pad
  const sendDirection = useCallback((dx: number, dy: number) => {
    if (!engineRef.current) return;
    engineRef.current.queueInput(playerRef.current, dx, dy);
    setTutorialHasMoved(true);
  }, []);

  // Listeners de teclado y gestos táctiles
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (status !== 'PLAYING' && status !== 'TUTORIAL') return;

      const key = e.key;
      if (['ArrowUp', 'w', 'W'].includes(key)) {
        e.preventDefault();
        sendDirection(0, -1);
      } else if (['ArrowDown', 's', 'S'].includes(key)) {
        e.preventDefault();
        sendDirection(0, 1);
      } else if (['ArrowLeft', 'a', 'A'].includes(key)) {
        e.preventDefault();
        sendDirection(-1, 0);
      } else if (['ArrowRight', 'd', 'D'].includes(key)) {
        e.preventDefault();
        sendDirection(1, 0);
      } else if (key === 'p' || key === 'P') {
        setIsPaused((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [status, sendDirection]);

  // Gestos táctiles Swipe en Canvas
  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (e.touches.length > 0) {
      touchStartRef.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
      };
    }
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (!touchStartRef.current || e.changedTouches.length === 0) return;
    const dx = e.changedTouches[0].clientX - touchStartRef.current.x;
    const dy = e.changedTouches[0].clientY - touchStartRef.current.y;
    touchStartRef.current = null;

    if (Math.abs(dx) > Math.abs(dy)) {
      if (Math.abs(dx) > 20) {
        sendDirection(dx > 0 ? 1 : -1, 0);
      }
    } else {
      if (Math.abs(dy) > 20) {
        sendDirection(0, dy > 0 ? 1 : -1);
      }
    }
  };

  // Bucle principal de juego (Game Loop a 60 FPS con deltaRatio)
  useEffect(() => {
    if (status !== 'PLAYING' && status !== 'TUTORIAL') {
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
      return;
    }

    let isRunning = true;

    const loop = (currentTime: number) => {
      if (!isRunning) return;

      const deltaMs = currentTime - lastTimeRef.current;
      lastTimeRef.current = currentTime;
      const deltaRatio = Math.min(Math.max(deltaMs / 16.666, 0.5), 2.2);

      // Auto-inicialización resiliente del renderizador si el canvas ya está en el DOM
      if (!rendererRef.current && canvasRef.current && currentMapRef.current.length > 0) {
        const cols = currentMapRef.current[0].length;
        const rows = currentMapRef.current.length;
        const tileSize = cols > 18 ? 28 : 32;
        canvasRef.current.width = cols * tileSize;
        canvasRef.current.height = rows * tileSize;
        rendererRef.current = new IndustrialRenderer(canvasRef.current, tileSize);
      }

      if (!isPaused && engineRef.current && rendererRef.current) {
        // Actualizar temporizador de protocolo de seguridad
        if (protocolCounterRef.current > 0) {
          protocolCounterRef.current -= deltaRatio;
          if (protocolCounterRef.current <= 0) {
            protocolCounterRef.current = 0;
          }
          setProtocolTimeRemaining(Math.round(protocolCounterRef.current));
        }

        // 1. Actualizar posición del operario
        engineRef.current.updatePlayer(playerRef.current, deltaRatio, handleItemCollected);

        // 2. Actualizar riesgos y comprobar colisiones
        const isProtocolActive = protocolCounterRef.current > 0;
        const player = playerRef.current;

        hazardsRef.current.forEach((hazard) => {
          engineRef.current!.updateHazard(hazard, player, deltaRatio, isProtocolActive);

          // Comprobar colisión entre operario y riesgo
          const distToPlayer = Math.hypot(player.x - hazard.x, player.y - hazard.y);
          if (distToPlayer < 0.72 && !hazard.isNeutralized) {
            handleHazardCollision(hazard);
          }
        });

        // 3. Renderizar todo el frame en canvas
        rendererRef.current.clear();
        rendererRef.current.renderFloorAndWalls(currentMapRef.current);
        rendererRef.current.renderItems(currentMapRef.current, currentTime);
        rendererRef.current.renderPlayer(playerRef.current, currentTime);

        hazardsRef.current.forEach((h) => {
          rendererRef.current!.renderHazard(h, isProtocolActive, currentTime);
        });
      }

      animFrameIdRef.current = requestAnimationFrame(loop);
    };

    lastTimeRef.current = performance.now();
    animFrameIdRef.current = requestAnimationFrame(loop);

    return () => {
      isRunning = false;
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
    };
  }, [status, isPaused, handleItemCollected]);

  // Transiciones del tutorial interactivo
  const handleTutorialNext = () => {
    if (tutorialStep < 5) {
      setTutorialStep((prev) => prev + 1);
    } else {
      // Iniciar partida formal
      setStatus('PLAYING');
      setupLevel(1, false);
    }
  };

  const handleTutorialSkip = () => {
    setStatus('PLAYING');
    setupLevel(1, false);
  };

  const handleRestartFull = () => {
    setStatus('REGISTER');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center select-none font-sans">
      
      {/* Top Bar Contract (1 fila, 3 zonas obligatorias) */}
      <header className="w-full border-b border-slate-800 bg-slate-900/90 backdrop-blur-md px-4 sm:px-8 py-3 flex items-center justify-between z-30">
        {/* Zona 1: Wordmark / Título único de marca */}
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
            <span className="text-xl">🪖</span>
            <span>PRL Industrial Safety</span>
          </span>
          <span className="hidden sm:inline-block text-xs font-mono text-amber-400 bg-amber-950/60 border border-amber-500/40 px-2 py-0.5 rounded">
            ISO 7010
          </span>
        </div>

        {/* Zona 2: Enlaces / Estado */}
        <div className="hidden md:flex items-center gap-6 text-xs font-medium text-slate-400">
          <span className="hover:text-slate-200 transition-colors">RD 486/1997 Lugares de Trabajo</span>
          <span aria-hidden="true">·</span>
          <span className="hover:text-slate-200 transition-colors">RD 773/1997 EPIs</span>
          <span aria-hidden="true">·</span>
          <span className="hover:text-slate-200 transition-colors">Norma ISO 45001</span>
        </div>

        {/* Zona 3: Acciones primarias */}
        <div className="flex items-center gap-3">
          {status !== 'REGISTER' && (
            <button
              type="button"
              onClick={handleRestartFull}
              className="px-3.5 py-1.5 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors whitespace-nowrap cursor-pointer"
            >
              Nueva Inspección
            </button>
          )}
        </div>
      </header>

      {/* Contenido Principal */}
      <main className="w-full max-w-5xl px-4 py-6 flex flex-col items-center gap-6 flex-1">
        
        {/* PANTALLA 1: Formulario de Registro e Identificación del Alumno */}
        {status === 'REGISTER' && (
          <div className="w-full max-w-xl bg-slate-900 border-2 border-sky-500/80 rounded-2xl p-6 sm:p-8 shadow-2xl flex flex-col gap-6 my-auto animate-fadeIn">
            <div className="text-center space-y-1.5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-950 border border-sky-500/40 text-xs font-mono text-sky-400 mb-2">
                <HardHat className="w-3.5 h-3.5" />
                <span>Simulador Técnico de Planta</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                PRL PAC-MAN
              </h1>
              <p className="text-sm text-slate-400">
                Auditoría formativa de prevención de riesgos laborales y señalización reglamentaria
              </p>
            </div>

            <form onSubmit={handleStartGame} className="flex flex-col gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">
                  Nombre y Apellidos del Alumno <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Marcos García Fernández"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-700 focus:border-sky-400 focus:ring-1 focus:ring-sky-400 text-sm text-white placeholder-slate-500 outline-none transition-all"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Grupo o Módulo</label>
                  <input
                    type="text"
                    placeholder="Ej: Grupo A / Módulo FOL"
                    value={studentGroup}
                    onChange={(e) => setStudentGroup(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-700 focus:border-sky-400 text-sm text-white placeholder-slate-500 outline-none transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Ciclo Formativo</label>
                  <input
                    type="text"
                    placeholder="Ej: CFGS Mantenimiento"
                    value={studentCycle}
                    onChange={(e) => setStudentCycle(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-700 focus:border-sky-400 text-sm text-white placeholder-slate-500 outline-none transition-all"
                  />
                </div>
              </div>

              {/* Opción de Tutorial Interactivo */}
              <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 flex items-start gap-3">
                <input
                  type="checkbox"
                  id="chkTutorial"
                  checked={startWithTutorial}
                  onChange={(e) => setStartWithTutorial(e.target.checked)}
                  className="mt-1 w-4 h-4 rounded text-sky-500 focus:ring-sky-400 cursor-pointer"
                />
                <label htmlFor="chkTutorial" className="text-xs text-slate-300 cursor-pointer">
                  <strong className="text-white block font-medium">
                    Iniciar con Tutorial Interactivo de Inducción (Recomendado)
                  </strong>
                  Aprende la metáfora de PRL paso a paso: desplazamiento por sendas seguras, recogida de medidas preventivas y neutralización con EPIs.
                </label>
              </div>

              {/* Botón de Comienzo */}
              <button
                type="submit"
                className="w-full py-3.5 px-6 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-sm shadow-xl shadow-sky-500/20 flex items-center justify-center gap-2 transition-all active:scale-[0.98] cursor-pointer mt-2"
              >
                <Play className="w-5 h-5 fill-slate-950" />
                <span>COMENZAR AUDITORÍA DE PLANTA</span>
              </button>
            </form>

            {/* Metáforas de PRL explicadas */}
            <div className="border-t border-slate-800 pt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-[11px] text-center">
              <div className="p-2 bg-slate-950/50 rounded-lg border border-slate-800/80">
                <div className="text-base mb-1">👷</div>
                <strong className="block text-slate-200">El Operario</strong>
                <span className="text-slate-400">Técnico de PRL</span>
              </div>
              <div className="p-2 bg-slate-950/50 rounded-lg border border-slate-800/80">
                <div className="text-base mb-1">🟡</div>
                <strong className="block text-slate-200">Pastillas</strong>
                <span className="text-slate-400">Medidas Preventivas</span>
              </div>
              <div className="p-2 bg-slate-950/50 rounded-lg border border-slate-800/80">
                <div className="text-base mb-1">🪖</div>
                <strong className="block text-slate-200">Insignias</strong>
                <span className="text-slate-400">EPIs Reglamentarios</span>
              </div>
              <div className="p-2 bg-slate-950/50 rounded-lg border border-slate-800/80">
                <div className="text-base mb-1">🚜</div>
                <strong className="block text-slate-200">Fantasmas</strong>
                <span className="text-slate-400">Riesgos Laborales</span>
              </div>
            </div>
          </div>
        )}

        {/* PANTALLA 2: Juego Activo / Tutorial */}
        {(status === 'PLAYING' || status === 'TUTORIAL' || status === 'QUIZ') && (
          <div className="w-full flex flex-col items-center gap-4">
            
            {/* HUD de Instrumentación y Telemetría */}
            <IndustrialHUD
              stats={stats}
              isPaused={isPaused}
              isMuted={isMuted}
              protocolTimeRemaining={protocolTimeRemaining}
              onTogglePause={() => setIsPaused((prev) => !prev)}
              onToggleMute={() => {
                const nextMuted = sound.toggleMute();
                setIsMuted(nextMuted);
              }}
              onRestart={() => setupLevel(stats.level, status === 'TUTORIAL')}
              onSendDirection={sendDirection}
            />

            {/* Si estamos en modo tutorial, mostrar tarjeta interactiva */}
            {status === 'TUTORIAL' && (
              <PRLTutorialOverlay
                currentStep={tutorialStep}
                dotsCollectedInTutorial={tutorialDots}
                hasMoved={tutorialHasMoved}
                hasCollectedPPE={tutorialHasPPE}
                onNextStep={handleTutorialNext}
                onSkipTutorial={handleTutorialSkip}
              />
            )}

            {/* Canvas de Planta Industrial */}
            <div className="relative p-2.5 bg-slate-900 border-2 border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden max-w-full">
              <canvas
                ref={canvasRef}
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
                className="block mx-auto rounded-lg shadow-inner cursor-pointer"
                style={{
                  maxWidth: '100%',
                  height: 'auto',
                  imageRendering: 'pixelated',
                }}
              />

              {/* Cartel de Nivel Superado */}
              {levelClearedNotice && (
                <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center animate-fadeIn p-6 z-30">
                  <div className="text-center p-6 bg-slate-900 border-2 border-emerald-500 rounded-2xl shadow-2xl max-w-sm">
                    <div className="text-4xl mb-2">🏢</div>
                    <h3 className="text-lg font-black text-emerald-400 mb-1">{levelClearedNotice}</h3>
                    <p className="text-xs text-slate-300">
                      Cargando planos y equipos de seguridad del siguiente sector...
                    </p>
                  </div>
                </div>
              )}

              {/* Cartel de Pausa */}
              {isPaused && (
                <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center">
                  <div className="text-center p-6 bg-slate-900 border border-sky-500 rounded-xl shadow-2xl">
                    <h3 className="text-xl font-bold text-sky-400 mb-2">INSPECCIÓN EN PAUSA</h3>
                    <p className="text-xs text-slate-300 mb-4">
                      Presiona "P" o el botón de reproducir para continuar
                    </p>
                    <button
                      type="button"
                      onClick={() => setIsPaused(false)}
                      className="px-5 py-2 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs rounded-lg shadow cursor-pointer"
                    >
                      Reanudar
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Botonera de Control Táctil D-Pad */}
            <div className="w-full flex justify-center pt-2">
              <IndustrialControls
                onSendDirection={sendDirection}
                activeDir={{ dx: playerRef.current.dirX, dy: playerRef.current.dirY }}
              />
            </div>
          </div>
        )}

        {/* MODAL DE RETO DIDÁCTICO DE PRL (Al recoger un EPI) */}
        {status === 'QUIZ' && activeQuizQuestion && activePPE && (
          <PRLQuizModal
            question={activeQuizQuestion}
            ppeItem={activePPE}
            onAnswerComplete={handleQuizAnswer}
          />
        )}

        {/* MODAL DE RESULTADOS: GAME OVER o VICTORIA */}
        {(status === 'GAME_OVER' || status === 'VICTORY') && (
          <PRLReportModal
            stats={stats}
            isVictory={status === 'VICTORY'}
            onRestart={handleRestartFull}
          />
        )}
      </main>
    </div>
  );
}
