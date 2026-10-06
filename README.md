# 🪖 PRL Pac-Man: Simulador de Seguridad y Salud Laboral

Videojuego educativo y simulador interactivo de **Prevención de Riesgos Laborales (PRL)** adaptado a la mecánica clásica de Pac-Man. Diseñado para alumnos de Ciclos Formativos (FP), módulos de FOL (Formación y Orientación Laboral) y acciones formativas de seguridad en plantas industriales y almacenes logísticos.

---

## 📋 Características Principales

- **🎮 Jugabilidad Arcade & Físicas Fluidas**: Motor con asistencia de viraje en esquinas (*Corner Smoothing Engine*), centrado ortogonal automático y cero incrustación en muros.
- **🏭 Entorno Gráfico Técnico Realista**: Pavimento epoxi industrial con vías peatonales segregadas (RD 486/1997), muros con zócalo de franjas de advertencia amarillo/negro y señalética reglamentaria ISO 7010.
- **👷 Personaje Principal (Técnico de PRL)**: Operario con chaleco de alta visibilidad (EN ISO 20471), casco homologado y haz de linterna direccional que ilumina el pasillo.
- **⚠️ 4 Familias de Riesgos Laborales (Fantasmas)**:
  - 🚜 **Carretilla Elevadora / AGV**: Riesgo de atropello y carga móvil con girofaro destellante.
  - 🧪 **Derrame Químico**: Fuga de sustancia corrosiva o tóxica con señal de peligro.
  - ⚡ **Cuadro de Alta Tensión**: Riesgo de arco eléctrico y descargas.
  - 🏗️ **Carga Suspendida**: Riesgo de caída de objetos y trabajos en altura.
- **📚 Metáforas Preventivas**:
  - *Pastillas Menores*: Medidas Preventivas de orden, limpieza (5S) y revisión diaria.
  - *Insignias Especiales*: EPIs reglamentarios (cascos UNE-EN 397, extintores dieléctricos UNE-EN 3-7, guantes EN 60903, arnés EN 361).
- **📝 Retos Didácticos Evaluativos**: Al recoger un EPI se activa una pregunta técnica del banco de **25 cuestiones normativas** (RD 773/1997, RD 486/1997, RD 614/2001, RD 286/2006, etc.) con pool dinámico sin repeticiones y explicación didáctica.
- **🛡️ Protocolo de Seguridad Activo**: Responder acertadamente activa la ventana de protección, permitiendo auditar y neutralizar riesgos temporalmente.
- **📘 Tutorial Interactivo Guiado**: Módulo paso a paso para enseñar los principios de PRL antes de la partida.
- **📜 Acta Final Imprimible**: Certificado de evaluación con puntos, sector alcanzado, tasa de acierto y dictamen pedagógico.
- **🔊 Audio Sintetizado**: Efectos mecánicos y de alarma generados en tiempo real mediante Web Audio API sin librerías pesadas.

---

## 🚀 Requisitos Previos

- [Node.js](https://nodejs.org/) (versión 18 o superior recomendada)
- `npm` o `pnpm` / `yarn`

---

## 🛠️ Instalación y Ejecución Local

1. **Clonar el repositorio**:
   ```bash
   git clone https://github.com/TU_USUARIO/prl-pacman.git
   cd prl-pacman
   ```

2. **Instalar dependencias**:
   ```bash
   npm install
   ```

3. **Iniciar el servidor de desarrollo**:
   ```bash
   npm run dev
   ```
   Abre tu navegador en `http://localhost:3000`.

4. **Compilar para producción**:
   ```bash
   npm run build
   ```
   Los archivos estáticos listos para desplegar se generarán en la carpeta `dist/`.

---

## 🌐 Despliegue en GitHub Pages (Paso a Paso)

Para que tus alumnos puedan jugar directamente online desde cualquier navegador u ordenador del aula sin instalar nada:

1. Instala el paquete de GitHub Pages:
   ```bash
   npm install --save-dev gh-pages
   ```

2. Añade en `package.json` las siguientes líneas:
   ```json
   "homepage": "https://TU_USUARIO.github.io/prl-pacman",
   "scripts": {
     ...
     "predeploy": "npm run build",
     "deploy": "gh-pages -d dist"
   }
   ```

3. Ejecuta el despliegue automático:
   ```bash
   npm run deploy
   ```

También puedes desplegarlo gratuitamente en plataformas como **Vercel** o **Netlify** conectando directamente tu repositorio de GitHub.

---

## 📄 Marco Normativo y Pedagógico Integrado

- **Ley 31/1995**, de Prevención de Riesgos Laborales.
- **Real Decreto 486/1997**, disposiciones mínimas de seguridad y salud en los lugares de trabajo.
- **Real Decreto 773/1997**, utilización por los trabajadores de equipos de protección individual.
- **Real Decreto 485/1997**, señalización de seguridad y salud en el trabajo.
- **Real Decreto 614/2001**, protección contra el riesgo eléctrico.
- **Real Decreto 286/2006**, protección contra los riesgos del ruido.
- **Norma ISO 7010**, símbolos gráficos y colores de seguridad.

---

## 📜 Licencia

Distribuido bajo licencia Apache 2.0. Desarrollado con fines educativos y pedagógicos para la formación en Prevención de Riesgos Laborales.
