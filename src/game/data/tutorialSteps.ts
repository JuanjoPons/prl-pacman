/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface InteractiveTutorialPhase {
  step: number;
  title: string;
  badge: string;
  conceptPRL: string;
  gameMetaphor: string;
  instruction: string;
  targetCount?: number;
}

export const TUTORIAL_PHASES: InteractiveTutorialPhase[] = [
  {
    step: 1,
    title: 'Vías de Circulación y Tránsito Seguro',
    badge: 'RD 486/1997',
    conceptPRL:
      'En plantas industriales y almacenes, los peatones deben circular exclusivamente por las zonas de paso delimitadas con franjas de seguridad para evitar atropellos o tropiezos.',
    gameMetaphor:
      'Tu personaje es el Técnico de PRL. Los pasillos del mapa representan las sendas peatonales seguras de la nave.',
    instruction:
      'Usa las FLECHAS o WASD (o el D-Pad táctil) para desplazarte. Comprueba la fluidez de giro en las esquinas.',
  },
  {
    step: 2,
    title: 'Medidas Preventivas Básicas (Puntos de Control)',
    badge: 'Buenas Prácticas',
    conceptPRL:
      'La prevención diaria se basa en pequeños hábitos: mantener el orden y la limpieza (las 5S), despejar pasillos, revisar extintores y señalizar obstáculos.',
    gameMetaphor:
      'Cada punto del pasillo es una "Medida Preventiva" que auditas e implementas. Recogerlas todas sella la seguridad del área.',
    instruction:
      'Avanza por el pasillo y recolecta al menos 6 Medidas Preventivas.',
    targetCount: 6,
  },
  {
    step: 3,
    title: 'Identificación de Riesgos Laborales (Peligros Activos)',
    badge: 'Evaluación de Riesgos',
    conceptPRL:
      'En planta existen 4 familias de riesgos críticos: Riesgo de Atropello por Carretillas, Fuga o Derrame Químico, Arco Eléctrico en cuadros y Caída de objetos o en altura.',
    gameMetaphor:
      'Los fantasmas representan estos riesgos laborales en movimiento. Sin el equipo y protocolo adecuado, colisionar con ellos causa un accidente laboral.',
    instruction:
      'Observa cómo patrullan los riesgos. Mantén distancia de seguridad y esquívalos mientras inspeccionas.',
  },
  {
    step: 4,
    title: 'EPIs y Protocolo de Seguridad Activo',
    badge: 'RD 773/1997',
    conceptPRL:
      'Cuando el riesgo no se puede suprimir, se emplean Equipos de Protección Individual (EPIs certificados). Al equiparte correctamente, quedas protegido para auditar y controlar el peligro.',
    gameMetaphor:
      'Las insignias especiales en las esquinas son EPIs reglamentarios (cascos, extintores, guantes). Al tomar uno, respondes una cuestión de PRL y neutralizas riesgos.',
    instruction:
      'Dirígete hacia un EPI especial en la esquina, recógelo y pon a prueba tu criterio preventivo.',
  },
  {
    step: 5,
    title: '¡Certificación de Inducción Completada!',
    badge: 'Auditoría Lista',
    conceptPRL:
      'Has interiorizado la jerarquía preventiva: 1º Vías seguras, 2º Medidas preventivas de orden, 3º Detección de peligros y 4º Uso riguroso de EPIs.',
    gameMetaphor:
      'Ahora estás listo para completar la inspección completa de los 5 sectores de la planta industrial.',
    instruction:
      'Haz clic en "Comenzar Auditoría de Planta" para iniciar el Nivel 1.',
  },
];
