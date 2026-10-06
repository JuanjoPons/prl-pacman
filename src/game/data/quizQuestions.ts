/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { PRLQuestion } from '../../types/game';

export const PRL_QUESTIONS: PRLQuestion[] = [
  {
    id: 'prl-01',
    category: 'Equipos de Protección Individual (EPI)',
    standardReference: 'RD 773/1997',
    question: '¿Cuándo es legalmente obligatorio el uso de un Equipo de Protección Individual (EPI)?',
    options: [
      'Siempre que el trabajador lo prefiera para mayor comodidad personal.',
      'Cuando los riesgos no se hayan podido evitar o limitar suficientemente por medios técnicos o protección colectiva.',
      'Únicamente cuando lo ordene una inspección de trabajo por escrito.',
    ],
    correctIndex: 1,
    explanation:
      'Los EPIs constituyen la última barrera preventiva. Su uso es preceptivo cuando los riesgos no se pueden eliminar ni controlar por protección colectiva (RD 773/1997, art. 3).',
  },
  {
    id: 'prl-02',
    category: 'Protección contra Incendios',
    standardReference: 'RIPCI / CTE DB-SI',
    question: 'En un conato de incendio en un cuadro eléctrico con tensión viva, ¿qué extintor es el adecuado?',
    options: [
      'Extintor de Agua a chorro sin aditivo.',
      'Extintor de Dióxido de Carbono (CO2) o Polvo ABC dieléctrico certificado.',
      'Extintor de Espuma física convencional.',
    ],
    correctIndex: 1,
    explanation:
      'El CO2 es un gas limpio no conductor de electricidad y no deja residuos en los circuitos electrónicos. El agua conduce la corriente y ocasionaría electrocución.',
  },
  {
    id: 'prl-03',
    category: 'Manipulación Manual de Cargas',
    standardReference: 'RD 487/1997 y Guía Técnica INSST',
    question: 'En condiciones ideales de manipulación para prevenir lesiones de espalda, ¿cuál es el peso máximo recomendado con carácter general?',
    options: [
      '15 kg en cualquier circunstancia de trabajo.',
      '25 kg en condiciones ergonómicas ideales de agarre y proximidad al tronco.',
      '40 kg si el operario utiliza faja elástica de compresión.',
    ],
    correctIndex: 1,
    explanation:
      'La Guía Técnica del INSST fija 25 kg como valor de referencia general en condiciones ideales de agarre y levantamiento cerca del cuerpo.',
  },
  {
    id: 'prl-04',
    category: 'Señalización de Seguridad',
    standardReference: 'RD 485/1997 / ISO 7010',
    question: 'Una señal redonda con pictograma blanco sobre fondo azul indica:',
    options: [
      'Prohibición tajante de una acción.',
      'Obligación de un comportamiento o uso preceptivo de un EPI.',
      'Advertencia de peligro inminente.',
    ],
    correctIndex: 1,
    explanation:
      'El círculo azul con pictograma blanco establece una OBLIGACIÓN (ej. "Uso obligatorio de casco", "Uso obligatorio de gafas"). Las de prohibición son redondas con borde rojo.',
  },
  {
    id: 'prl-05',
    category: 'Riesgo Eléctrico',
    standardReference: 'RD 614/2001',
    question: '¿Cuál es el primer paso de las "5 Reglas de Oro" para trabajar con seguridad sin tensión eléctrica?',
    options: [
      'Colocar mantas aislantes en los bornes.',
      'Desconectar y realizar el corte efectivo de todas las fuentes de alimentación.',
      'Poner a tierra y en cortocircuito las fases.',
    ],
    correctIndex: 1,
    explanation:
      'Las 5 Reglas de Oro son: 1º Desconectar, 2º Bloquear y señalizar (LOTO), 3º Comprobar ausencia de tensión, 4º Poner a tierra y en cortocircuito, 5º Delimitar y señalizar la zona.',
  },
  {
    id: 'prl-06',
    category: 'Tránsito y Circulación en Planta',
    standardReference: 'RD 486/1997 (Lugares de Trabajo)',
    question: 'En pasillos de circulación de una nave con tráfico de carretillas elevadoras y peatones, ¿qué medida es preceptiva?',
    options: [
      'El peatón siempre debe correr hacia los lados al oír el motor.',
      'Delimitar sendas peatonales segregadas con líneas visibles y mantener distancia de seguridad respecto a la maquinaria.',
      'Compartir el mismo pasillo sin señalización si los operarios llevan chaleco.',
    ],
    correctIndex: 1,
    explanation:
      'El RD 486/1997 exige que las vías de circulación de vehículos y peatones estén claramente identificadas, con dimensiones suficientes y separación física o señalizada de seguridad.',
  },
  {
    id: 'prl-07',
    category: 'Riesgo Químico',
    standardReference: 'Reglamento CLP / FDS',
    question: 'Ante un derrame accidental de un reactivo corrosivo en el suelo del taller, ¿cuál es el protocolo correcto?',
    options: [
      'Fregarlo inmediatamente con agua tibia corriente y lejía.',
      'Consultar la Ficha de Datos de Seguridad (FDS), acordonar la zona y verter absorbente neutralizante con los EPIs adecuados.',
      'Encender un ventilador y esperar a que se evapore por sí solo.',
    ],
    correctIndex: 1,
    explanation:
      'La sección 6 de la Ficha de Datos de Seguridad (FDS) detalla el procedimiento de contención ante vertidos, exigiendo neutralizantes específicos y protección química antes de intervenir.',
  },
  {
    id: 'prl-08',
    category: 'Trabajos en Altura',
    standardReference: 'RD 2177/2004',
    question: '¿A partir de qué cota de desnivel se considera reglamentariamente "trabajo en altura" con exigencia de protección anticaídas?',
    options: [
      '1,0 metro.',
      '2,0 metros sobre el plano de sustentación inferior.',
      '3,5 metros.',
    ],
    correctIndex: 1,
    explanation:
      'A partir de 2 metros de desnivel es imperativo disponer de protecciones colectivas (barandillas, redes) o individuales (arnés con punto de anclaje certificado EN 795).',
  },
  {
    id: 'prl-09',
    category: 'Orden y Limpieza',
    standardReference: 'RD 486/1997 (Anexo II)',
    question: '¿Por qué mantener los pasillos limpios de embalajes, palets y derrames es una medida preventiva fundamental?',
    options: [
      'Únicamente para superar auditorías cosméticas sin valor real.',
      'Porque previene caídas al mismo nivel por tropiezo y asegura vías expeditas en caso de evacuación urgente.',
      'No tiene impacto en la siniestralidad si el calzado dispone de puntera metálica.',
    ],
    correctIndex: 1,
    explanation:
      'Las caídas al mismo nivel suponen uno de los tipos de accidente laboral más frecuentes con baja. Despejar pasillos garantiza además una evacuación ágil sin tropiezos.',
  },
  {
    id: 'prl-10',
    category: 'Primeros Auxilios',
    standardReference: 'Protocolo PAS (Proteger, Avisar, Socorrer)',
    question: 'Ante un accidente laboral grave en la planta, ¿cuál es la secuencia correcta de actuación según el protocolo PAS?',
    options: [
      '1º Socorrer inmediatamente a la víctima, 2º Avisar al médico y 3º Proteger el entorno.',
      '1º Proteger el lugar del accidente para evitar nuevos riesgos, 2º Avisar a emergencias (112) y 3º Socorrer según conocimientos.',
      'Avisar a la gerencia, abandonar la nave y esperar fuera.',
    ],
    correctIndex: 1,
    explanation:
      'El protocolo P-A-S establece con total claridad: PROTEGER para que nadie más resulte herido, AVISAR a los servicios de socorro y SOCORRER aplicando primeros auxilios.',
  },
  {
    id: 'prl-11',
    category: 'Riesgo por Ruido',
    standardReference: 'RD 286/2006',
    question: 'A partir de qué nivel de exposición diaria al ruido es legalmente obligatorio el uso de protectores auditivos (tapones u orejeras)?',
    options: [
      '70 dB(A).',
      '85 dB(A) (a partir de 80 dB(A) deben ponerse a disposición del trabajador).',
      '105 dB(A).',
    ],
    correctIndex: 1,
    explanation:
      'El RD 286/2006 fija el nivel superior de acción en 85 dB(A), a partir del cual el uso de protección auditiva es obligatorio. A partir de 80 dB(A) el empresario debe suministrarlos.',
  },
  {
    id: 'prl-12',
    category: 'Calzado de Seguridad',
    standardReference: 'UNE-EN ISO 20345',
    question: '¿Qué protección básica garantiza la puntera de seguridad de un calzado profesional certificado según norma EN ISO 20345?',
    options: [
      'Resistencia a impactos de hasta 200 Julios y aplastamiento de 15 kN.',
      'Protección exclusiva contra salpicaduras de agua limpia.',
      'Aislamiento térmico hasta 400 grados centígrados.',
    ],
    correctIndex: 0,
    explanation:
      'El calzado de seguridad debe resistir un impacto de al menos 200 Julios (equivalente a una masa de 20 kg caída desde 1 metro de altura) y compresión de 15 kN.',
  },
  {
    id: 'prl-13',
    category: 'Carretillas Elevadoras',
    standardReference: 'NTP 714 / RD 1215/1997',
    question: 'Al circular con una carretilla elevadora con una carga voluminosa que oculta por completo la visibilidad delantera, ¿cómo debe conducirse?',
    options: [
      'Aumentar la velocidad para salir rápido del pasillo.',
      'Circular marcha atrás con precaución y campo visual directo, usando el avisador acústico.',
      'Pedir a otro operario que se suba en las horquillas para guiar con la mano.',
    ],
    correctIndex: 1,
    explanation:
      'Cuando la carga impide la visibilidad hacia delante, el carretillero debe circular en marcha atrás, a velocidad reducida y prestando atención a peatones e intersecciones.',
  },
  {
    id: 'prl-14',
    category: 'Señales de Seguridad',
    standardReference: 'RD 485/1997',
    question: 'Una señal triangular con fondo amarillo, borde negro y pictograma negro indica:',
    options: [
      'Advertencia de un peligro o riesgo.',
      'Una instrucción de salvamento o primeros auxilios.',
      'Una prohibición legal estricta.',
    ],
    correctIndex: 0,
    explanation:
      'El triángulo amarillo es el código universal de ADVERTENCIA (ej. peligro eléctrico, sustancias tóxicas, paso de carretillas, baja temperatura).',
  },
  {
    id: 'prl-15',
    category: 'Señales de Seguridad',
    standardReference: 'RD 485/1997',
    question: 'Una señal rectangular con fondo verde y pictograma blanco informa sobre:',
    options: [
      'Obligación de llevar guantes de trabajo.',
      'Salida de emergencia, vía de evacuación o puesto de primeros auxilios.',
      'Ubicación de un extintor de incendios.',
    ],
    correctIndex: 1,
    explanation:
      'El color verde en señalética de seguridad se reserva para salvamento, socorro, puestos de lavaojos, botiquines y salidas de evacuación seguras.',
  },
  {
    id: 'prl-16',
    category: 'Seguridad en Maquinaria',
    standardReference: 'RD 1215/1997',
    question: '¿Qué función cumple el pulsador de parada de emergencia en forma de "seta" roja en una máquina industrial?',
    options: [
      'Encender las luces de trabajo del cuadro.',
      'Detener de forma inmediata el movimiento de los elementos móviles peligrosos ante una situación de riesgo inminente.',
      'Reiniciar el software de la máquina sin cortar la fuerza motriz.',
    ],
    correctIndex: 1,
    explanation:
      'La parada de emergencia (seta roja sobre fondo amarillo) detiene de manera prioritaria e instantánea las piezas móviles para evitar atrapamientos o cortes graves.',
  },
  {
    id: 'prl-17',
    category: 'Riesgo Químico',
    standardReference: 'Reglamento CLP',
    question: '¿Por qué está terminantemente prohibido almacenar productos químicos ácidos y bases juntos en el mismo cubeto de retención?',
    options: [
      'Porque pueden reaccionar violentamente de forma exotérmica emitiendo gases tóxicos o vapores corrosivos.',
      'Únicamente para mantener el orden alfabético de las etiquetas.',
      'No hay peligro alguno si los botes están bien cerrados con cinta.',
    ],
    correctIndex: 0,
    explanation:
      'El principio de incompatibilidad química exige separar sustancias que puedan reaccionar entre sí (como ácidos fuertes y bases, o inflamables y comburentes) para evitar explosiones e intoxicaciones.',
  },
  {
    id: 'prl-18',
    category: 'Ergonomía',
    standardReference: 'Guía Técnica Manipulación de Cargas',
    question: 'Para levantar una caja pesada desde el suelo de forma biomecánicamente segura, ¿qué técnica debe aplicarse?',
    options: [
      'Mantener las piernas completamente rectas y doblar la cintura hacia abajo.',
      'Flexionar las rodillas, mantener la espalda recta, aproximar la carga al pecho y hacer la fuerza con los cuádriceps.',
      'Girar el tronco rápidamente mientras se levanta el peso.',
    ],
    correctIndex: 1,
    explanation:
      'Flexionar las rodillas y mantener la espalda alineada transfiere la carga biomecánica a los potentes músculos de las piernas, protegiendo las vértebras lumbares de hernias discales.',
  },
  {
    id: 'prl-19',
    category: 'Protección Ocular',
    standardReference: 'UNE-EN 166',
    question: 'En operaciones donde existe riesgo de salpicaduras químicas de líquidos corrosivos, ¿qué tipo de protección ocular se debe exigir?',
    options: [
      'Gafas de sol convencionales polarizadas.',
      'Gafas de montura integral estanca o pantalla facial certificada según EN 166.',
      'Gafas universales de patillas abiertas sin resguardo lateral.',
    ],
    correctIndex: 1,
    explanation:
      'Las salpicaduras químicas pueden ingresar por los laterales de unas gafas de patilla abierta. Se requiere montura integral estanca con ventilación indirecta o pantalla facial completa.',
  },
  {
    id: 'prl-20',
    category: 'Espacios Confinados',
    standardReference: 'NTP 223 / RD 486/1997',
    question: 'Antes de entrar a trabajar en un espacio confinado (tanque, pozo, galería), ¿cuál es el requisito imprescindible de seguridad?',
    options: [
      'Encender una cerilla dentro para comprobar si hay oxígeno.',
      'Medir la atmósfera con detector calibrado (oxígeno, gases tóxicos e inflamabilidad) y disponer de vigía exterior permanente.',
      'Entrar en solitario para no poner en riesgo a dos trabajadores.',
    ],
    correctIndex: 1,
    explanation:
      'Es preceptivo evaluar previamente la atmósfera con explosímetro/oxigenómetro y mantener un recurso preventivo o vigía en el exterior con arnés y equipo de rescate listo.',
  },
  {
    id: 'prl-21',
    category: 'Estrés Térmico',
    standardReference: 'RD 486/1997',
    question: 'En jornadas con alerta por altas temperaturas en naves o exteriores, ¿cuál es una medida preventiva clave contra el golpe de calor?',
    options: [
      'Beber agua frecuentemente sin esperar a tener sed, realizar pausas en zonas aclimatadas y evitar tareas pesadas en las horas punta.',
      'Tomar bebidas muy azucaradas y no detener la actividad en ningún momento.',
      'Abrigarse con ropa gruesa para sudar más rápidamente.',
    ],
    correctIndex: 0,
    explanation:
      'La hidratación regular, la habilitación de pausas a la sombra y la adaptación de los ritmos de trabajo son medidas esenciales para evitar el golpe de calor, que puede ser mortal.',
  },
  {
    id: 'prl-22',
    category: 'Protección Anticaídas',
    standardReference: 'UNE-EN 361',
    question: '¿Qué componente es indispensable intercalar entre el arnés anticaídas y el punto de anclaje para amortiguar el impacto sobre el cuerpo en una caída libre?',
    options: [
      'Una cuerda de cáñamo estática sin certificar.',
      'Un absorbedor de energía de desgarro textil homologado (UNE-EN 355).',
      'Una cadena de hierro eslabonada.',
    ],
    correctIndex: 1,
    explanation:
      'El absorbedor de energía disipa la energía cinética de la caída limitando la fuerza de frenado sobre el cuerpo humano por debajo del umbral de lesión de 6 kN.',
  },
  {
    id: 'prl-23',
    category: 'Incendios Especiales',
    standardReference: 'UNE-EN 2 / RIPCI',
    question: 'En un fuego de cocina con sartenes con aceite vegetal hirviendo (Fuegos clase F), ¿qué ocurre si se echa agua directamente?',
    options: [
      'El fuego se extingue al instante de forma segura.',
      'Se produce una violenta explosión de vapor ("boilover") que proyecta aceite ardiendo por todo el recinto.',
      'El agua absorbe el aceite sin ninguna reacción.',
    ],
    correctIndex: 1,
    explanation:
      'El agua líquida es más densa que el aceite caliente y se va al fondo, vaporizándose instantáneamente (se expande 1700 veces) y provocando una enorme bola de fuego.',
  },
  {
    id: 'prl-24',
    category: 'Organización Preventiva',
    standardReference: 'Ley 31/1995 de PRL',
    question: '¿Qué es el Comité de Seguridad y Salud en una empresa?',
    options: [
      'Una reunión informal de directivos sin presencia de trabajadores.',
      'El órgano paritario y colegiado de participación destinado a la consulta regular y periódica sobre prevención de riesgos.',
      'Un tribunal disciplinario que sanciona a los operarios.',
    ],
    correctIndex: 1,
    explanation:
      'Es el órgano paritario compuesto a partes iguales por Delegados de Prevención (representantes de los trabajadores) y representantes del empresario (obligatorio en empresas de 50 o más trabajadores).',
  },
  {
    id: 'prl-25',
    category: 'Alta Visibilidad',
    standardReference: 'UNE-EN ISO 20471',
    question: '¿Cuál es la función principal de las prendas de alta visibilidad (chalecos, monos) en un almacén logístico?',
    options: [
      'Evitar que la ropa de calle se ensucie con el polvo.',
      'Hacer que el operario sea visualmente detectable de forma inequívoca ante conductores de carretillas en cualquier condición de luz.',
      'Proteger frente a descargas eléctricas de alta tensión.',
    ],
    correctIndex: 1,
    explanation:
      'El material fluorescente diurno y las bandas retrorreflectantes nocturnas garantizan que el operador de maquinaria distinga al peatón a gran distancia, evitando atropellos.',
  },
];
