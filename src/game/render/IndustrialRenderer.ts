/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { TileType, Player, Hazard, PPEItem } from '../../types/game';

export class IndustrialRenderer {
  private ctx: CanvasRenderingContext2D;
  private canvas: HTMLCanvasElement;
  private tileSize: number;

  constructor(canvas: HTMLCanvasElement, tileSize: number = 32) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    this.tileSize = tileSize;
  }

  public setTileSize(size: number) {
    this.tileSize = size;
  }

  public getTileSize(): number {
    return this.tileSize;
  }

  public clear() {
    this.ctx.fillStyle = '#0b1120';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  // 1. Pavimento de Planta Industrial con Cuadrícula y Líneas de Marcado Vial
  public renderFloorAndWalls(map: number[][]) {
    const ts = this.tileSize;
    const rows = map.length;
    const cols = map[0].length;

    // Fondo epoxi industrial
    this.ctx.fillStyle = '#0f172a';
    this.ctx.fillRect(0, 0, cols * ts, rows * ts);

    // Cuadrícula técnica sutil de replanteo
    this.ctx.strokeStyle = 'rgba(51, 65, 85, 0.4)';
    this.ctx.lineWidth = 1;
    this.ctx.beginPath();
    for (let c = 0; c <= cols; c++) {
      this.ctx.moveTo(c * ts, 0);
      this.ctx.lineTo(c * ts, rows * ts);
    }
    for (let r = 0; r <= rows; r++) {
      this.ctx.moveTo(0, r * ts);
      this.ctx.lineTo(cols * ts, r * ts);
    }
    this.ctx.stroke();

    // Líneas viales de circulación peatonal (RD 486/1997)
    this.ctx.strokeStyle = 'rgba(234, 179, 8, 0.25)';
    this.ctx.lineWidth = 2;
    this.ctx.setLineDash([4, 6]);
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (map[r][c] !== TileType.WALL) {
          // Si el pasillo es transitable horizontalmente
          if (c > 0 && map[r][c - 1] !== TileType.WALL) {
            this.ctx.beginPath();
            this.ctx.moveTo((c - 0.5) * ts, (r + 0.5) * ts);
            this.ctx.lineTo((c + 0.5) * ts, (r + 0.5) * ts);
            this.ctx.stroke();
          }
          // Si es transitable verticalmente
          if (r > 0 && map[r - 1][c] !== TileType.WALL) {
            this.ctx.beginPath();
            this.ctx.moveTo((c + 0.5) * ts, (r - 0.5) * ts);
            this.ctx.lineTo((c + 0.5) * ts, (r + 0.5) * ts);
            this.ctx.stroke();
          }
        }
      }
    }
    this.ctx.setLineDash([]);

    // Muros y estanterías industriales con zócalo de franjas de advertencia (amarillo/negro)
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const tile = map[r][c];
        if (tile === TileType.WALL) {
          this.drawIndustrialWall(c * ts, r * ts, ts, r, c);
        } else if (tile === TileType.SPAWN_GATE) {
          this.drawSpawnGate(c * ts, r * ts, ts);
        }
      }
    }
  }

  // Dibujar muro/bloque con textura de estantería y franjas de advertencia
  private drawIndustrialWall(x: number, y: number, ts: number, r: number, c: number) {
    const ctx = this.ctx;

    // Cuerpo principal de la estructura de hormigón/acero
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(x, y, ts, ts);

    // Borde biselado metálico
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(x + 1, y + 1, ts - 2, ts - 2);

    // Remaches en las esquinas del bloque
    ctx.fillStyle = '#64748b';
    const rivetOffsets = [
      [3, 3],
      [ts - 4, 3],
      [3, ts - 4],
      [ts - 4, ts - 4],
    ];
    rivetOffsets.forEach(([rx, ry]) => {
      ctx.beginPath();
      ctx.arc(x + rx, y + ry, 1.2, 0, Math.PI * 2);
      ctx.fill();
    });

    // Franja diagonal de advertencia de seguridad (amarillo/negro) en el perímetro
    ctx.save();
    ctx.beginPath();
    ctx.rect(x + 3, y + 3, ts - 6, ts - 6);
    ctx.clip();

    ctx.fillStyle = '#111827';
    ctx.fillRect(x, y, ts, ts);

    ctx.fillStyle = '#eab308';
    const stripeWidth = 5;
    for (let i = -ts; i < ts * 2; i += stripeWidth * 2) {
      ctx.beginPath();
      ctx.moveTo(x + i, y);
      ctx.lineTo(x + i + stripeWidth, y);
      ctx.lineTo(x + i + stripeWidth - ts, y + ts);
      ctx.lineTo(x + i - ts, y + ts);
      ctx.closePath();
      ctx.fill();
    }
    ctx.restore();
  }

  // Compuerta del centro de mantenimiento (spawn)
  private drawSpawnGate(x: number, y: number, ts: number) {
    const ctx = this.ctx;
    ctx.fillStyle = 'rgba(239, 68, 68, 0.2)';
    ctx.fillRect(x, y, ts, ts);

    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 2;
    ctx.setLineDash([3, 3]);
    ctx.beginPath();
    ctx.moveTo(x, y + ts / 2);
    ctx.lineTo(x + ts, y + ts / 2);
    ctx.stroke();
    ctx.setLineDash([]);
  }

  // 2. Medidas Preventivas y EPIs Especiales
  public renderItems(map: number[][], time: number) {
    const ts = this.tileSize;
    const rows = map.length;
    const cols = map[0].length;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const tile = map[r][c];
        const cx = c * ts + ts / 2;
        const cy = r * ts + ts / 2;

        if (tile === TileType.PREVENTIVE_DOT) {
          // Medida Preventiva: Baliza de inspección ámbar brillante
          this.ctx.fillStyle = '#fde047';
          this.ctx.beginPath();
          this.ctx.arc(cx, cy, 3.5, 0, Math.PI * 2);
          this.ctx.fill();

          // Destello sutil
          this.ctx.fillStyle = 'rgba(253, 224, 71, 0.3)';
          this.ctx.beginPath();
          this.ctx.arc(cx, cy, 6, 0, Math.PI * 2);
          this.ctx.fill();
        } else if (tile === TileType.PPE_SPECIAL) {
          // EPI Especial: Señal redonda reglamentaria azul ISO 7010 con aura
          const pulse = 1 + Math.sin(time / 160) * 0.15;
          const radius = (ts / 2 - 3) * pulse;

          // Halo de seguridad
          this.ctx.fillStyle = 'rgba(14, 165, 233, 0.25)';
          this.ctx.beginPath();
          this.ctx.arc(cx, cy, radius + 4, 0, Math.PI * 2);
          this.ctx.fill();

          // Señal azul reglamentaria
          this.ctx.fillStyle = '#0284c7';
          this.ctx.beginPath();
          this.ctx.arc(cx, cy, radius, 0, Math.PI * 2);
          this.ctx.fill();

          this.ctx.strokeStyle = '#ffffff';
          this.ctx.lineWidth = 1.8;
          this.ctx.stroke();

          // Pictograma central de EPI
          this.ctx.fillStyle = '#ffffff';
          this.ctx.font = `${Math.floor(ts * 0.55)}px sans-serif`;
          this.ctx.textAlign = 'center';
          this.ctx.textBaseline = 'middle';
          this.ctx.fillText('🪖', cx, cy);
        }
      }
    }
  }

  // 3. El Operario de PRL (Jugador) con Linterna y Chaleco de Alta Visibilidad
  public renderPlayer(player: Player, time: number) {
    const ts = this.tileSize;
    const px = player.x * ts + ts / 2;
    const py = player.y * ts + ts / 2;
    const radius = ts / 2 - 3;
    const ctx = this.ctx;

    ctx.save();
    ctx.translate(px, py);

    // Haz de luz de la linterna de inspección que ilumina el pasillo en su dirección
    ctx.save();
    ctx.rotate(player.angle);
    const grad = ctx.createRadialGradient(0, 0, 4, ts * 1.8, 0, ts * 2.5);
    grad.addColorStop(0, 'rgba(254, 240, 138, 0.45)');
    grad.addColorStop(0.6, 'rgba(254, 240, 138, 0.18)');
    grad.addColorStop(1, 'rgba(254, 240, 138, 0)');

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.arc(0, 0, ts * 2.6, -Math.PI / 6, Math.PI / 6);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    // Rotación del operario según avance
    ctx.rotate(player.angle);

    // Animación de boca/compás o paso
    const mouthOpen = player.isMoving
      ? Math.abs(Math.sin(time / 110)) * 0.28 + 0.05
      : 0.1;

    // Cuerpo base: Chaleco amarillo flúor reflectante (EN ISO 20471)
    ctx.fillStyle = '#eab308';
    ctx.beginPath();
    ctx.arc(0, 0, radius, mouthOpen * Math.PI, (2 - mouthOpen) * Math.PI);
    ctx.lineTo(0, 0);
    ctx.closePath();
    ctx.fill();

    // Bandas reflectantes plateadas sobre el chaleco
    ctx.strokeStyle = '#f8fafc';
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.arc(0, 0, radius * 0.65, mouthOpen * Math.PI, (2 - mouthOpen) * Math.PI);
    ctx.stroke();

    // Casco de seguridad en la coronilla
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(-2, 0, radius * 0.4, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = '#0284c7';
    ctx.lineWidth = 1.2;
    ctx.stroke();

    // Ojo / Visor protector
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.arc(radius * 0.35, -radius * 0.45, 2.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  // 4. Riesgos Laborales (Fantasmas temáticos según tipo)
  public renderHazard(hazard: Hazard, isProtocolActive: boolean, time: number) {
    const ts = this.tileSize;
    const hx = hazard.x * ts + ts / 2;
    const hy = hazard.y * ts + ts / 2;
    const radius = ts / 2 - 3;
    const ctx = this.ctx;

    ctx.save();
    ctx.translate(hx, hy);

    if (hazard.isNeutralized) {
      // Riesgo en retorno al taller de mantenimiento (baliza parpadeante neutralizada)
      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.arc(0, 0, 5, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = 'rgba(56, 189, 248, 0.6)';
      ctx.lineWidth = 2;
      ctx.setLineDash([2, 4]);
      ctx.beginPath();
      ctx.arc(0, 0, 10, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.restore();
      return;
    }

    if (isProtocolActive) {
      // Estado "Protocolo Activo": El riesgo está controlado e inspeccionable (azul de contención)
      const flash = Math.sin(time / 100) > 0 ? '#0284c7' : '#38bdf8';
      ctx.fillStyle = flash;
      this.drawHazardBody(radius, time);

      // Símbolo de inspección segura / escudo
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 10px monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('PRL', 0, -2);
      ctx.restore();
      return;
    }

    // Dibujo específico por tipo de riesgo laboral
    switch (hazard.type) {
      case 'FORKLIFT': {
        // Carretilla Elevadora / AGV: Cuerpo amarillo con girofaro destellante
        ctx.fillStyle = '#f59e0b';
        this.drawHazardBody(radius, time);

        // Franja de advertencia frontal
        ctx.fillStyle = '#18181b';
        ctx.fillRect(-radius + 2, -2, radius * 2 - 4, 3);

        // Luz de girofaro naranja destellante en la cúpula
        const flashAlpha = Math.abs(Math.sin(time / 120));
        ctx.fillStyle = `rgba(249, 115, 22, ${flashAlpha})`;
        ctx.beginPath();
        ctx.arc(0, -radius - 2, 4, 0, Math.PI * 2);
        ctx.fill();
        break;
      }

      case 'CHEMICAL': {
        // Fuga o Derrame Químico: Verde tóxico / corrosivo
        ctx.fillStyle = '#10b981';
        this.drawHazardBody(radius, time);

        // Burbujas tóxicas
        ctx.fillStyle = '#a7f3d0';
        ctx.beginPath();
        ctx.arc(-3, -2, 2.5, 0, Math.PI * 2);
        ctx.arc(4, 2, 2, 0, Math.PI * 2);
        ctx.fill();
        break;
      }

      case 'ELECTRICAL': {
        // Riesgo Eléctrico / Cuadro de Alta Tensión: Azul eléctrico con chispas
        ctx.fillStyle = '#0284c7';
        this.drawHazardBody(radius, time);

        // Rayo de advertencia en el pecho
        ctx.strokeStyle = '#fde047';
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.moveTo(1, -6);
        ctx.lineTo(-2, -1);
        ctx.lineTo(2, -1);
        ctx.lineTo(-1, 5);
        ctx.stroke();
        break;
      }

      case 'FALL': {
        // Riesgo de Caída de Cargas / Altura: Púrpura de peligro grave
        ctx.fillStyle = '#dc2626';
        this.drawHazardBody(radius, time);

        // Gancho / flecha hacia abajo
        ctx.fillStyle = '#ffffff';
        ctx.font = '10px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('⚠️', 0, -2);
        break;
      }
    }

    // Ojos técnicos direccionales
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(-4, -4, 3.5, 0, Math.PI * 2);
    ctx.arc(4, -4, 3.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#0f172a';
    const eyeOffsetX = hazard.dirX * 1.8;
    const eyeOffsetY = hazard.dirY * 1.8;
    ctx.beginPath();
    ctx.arc(-4 + eyeOffsetX, -4 + eyeOffsetY, 1.8, 0, Math.PI * 2);
    ctx.arc(4 + eyeOffsetX, -4 + eyeOffsetY, 1.8, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  // Geometría del cuerpo del riesgo / peligro con ondulación inferior
  private drawHazardBody(radius: number, time: number) {
    const ctx = this.ctx;
    ctx.beginPath();
    ctx.arc(0, -2, radius, Math.PI, 0);
    ctx.lineTo(radius, radius);

    const wave = Math.sin(time / 150) * 2;
    const feet = 3;
    const step = (radius * 2) / feet;

    for (let i = 0; i < feet; i++) {
      const startX = radius - i * step;
      const midX = startX - step / 2;
      const endX = startX - step;
      ctx.quadraticCurveTo(midX, radius + 3 + (i % 2 === 0 ? wave : -wave), endX, radius);
    }

    ctx.lineTo(-radius, -2);
    ctx.closePath();
    ctx.fill();
  }
}
