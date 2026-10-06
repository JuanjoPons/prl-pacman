/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { TileType, Player, Hazard, PPEItem } from '../../types/game';

export const CORNER_TOLERANCE = 0.44; // Ventana generosa de giro para no perder la esquina
export const INPUT_BUFFER_MS = 380;   // Tiempo de retención de intención de giro en milisegundos

export class MovementEngine {
  private map: number[][];
  private cols: number;
  private rows: number;
  private inputBufferTime: number = 0;

  constructor(map: number[][]) {
    this.map = map;
    this.rows = map.length;
    this.cols = map[0].length;
  }

  public setMap(newMap: number[][]) {
    this.map = newMap;
    this.rows = newMap.length;
    this.cols = newMap[0].length;
  }

  public isPassable(col: number, row: number, allowSpawnGate: boolean = false): boolean {
    // Manejo de túneles laterales
    if (col < 0 || col >= this.cols) {
      const wrappedCol = ((col % this.cols) + this.cols) % this.cols;
      if (row < 0 || row >= this.rows) return false;
      const tile = this.map[row][wrappedCol];
      return tile !== TileType.WALL && (tile !== TileType.SPAWN_GATE || allowSpawnGate);
    }

    if (row < 0 || row >= this.rows) return false;
    const tile = this.map[row][col];
    if (tile === TileType.WALL) return false;
    if (tile === TileType.SPAWN_GATE && !allowSpawnGate) return false;
    return true;
  }

  public queueInput(player: Player, dx: number, dy: number) {
    player.queuedDirX = dx;
    player.queuedDirY = dy;
    this.inputBufferTime = performance.now();
  }

  public updatePlayer(
    player: Player,
    deltaRatio: number,
    onCollectDot?: (c: number, r: number, tile: TileType) => void
  ) {
    const now = performance.now();
    const hasBufferedInput =
      (player.queuedDirX !== 0 || player.queuedDirY !== 0) &&
      now - this.inputBufferTime <= INPUT_BUFFER_MS;

    const qx = hasBufferedInput ? player.queuedDirX : 0;
    const qy = hasBufferedInput ? player.queuedDirY : 0;

    const curCol = Math.round(player.x);
    const curRow = Math.round(player.y);

    // 1. Inversión Inmediata 180° (giro hacia atrás instantáneo en cualquier punto)
    if (qx !== 0 || qy !== 0) {
      if (qx === -player.dirX && qy === -player.dirY) {
        player.dirX = qx;
        player.dirY = qy;
        player.queuedDirX = 0;
        player.queuedDirY = 0;
      }
    }

    // 2. Giro Perpendicular con Asistencia de Esquinas (Corner Smoothing)
    if (qx !== 0 || qy !== 0) {
      const isPerpendicular =
        (player.dirX !== 0 && qy !== 0) ||
        (player.dirY !== 0 && qx !== 0) ||
        (player.dirX === 0 && player.dirY === 0);

      if (isPerpendicular) {
        if (player.dirX !== 0) {
          // Desplazándose en X, intentando girar en Y
          const targetCol = Math.round(player.x);
          const distToCol = Math.abs(player.x - targetCol);

          if (distToCol <= CORNER_TOLERANCE) {
            const nextRow = curRow + qy;
            if (this.isPassable(targetCol, nextRow)) {
              // Centrar suavemente en la columna y realizar el giro
              player.x = targetCol;
              player.dirX = 0;
              player.dirY = qy;
              player.queuedDirX = 0;
              player.queuedDirY = 0;
            }
          }
        } else if (player.dirY !== 0) {
          // Desplazándose en Y, intentando girar en X
          const targetRow = Math.round(player.y);
          const distToRow = Math.abs(player.y - targetRow);

          if (distToRow <= CORNER_TOLERANCE) {
            const nextCol = curCol + qx;
            if (this.isPassable(nextCol, targetRow)) {
              // Centrar suavemente en la fila y realizar el giro
              player.y = targetRow;
              player.dirX = qx;
              player.dirY = 0;
              player.queuedDirX = 0;
              player.queuedDirY = 0;
            }
          }
        } else {
          // Jugador detenido: arrancar si la dirección es transitable
          if (this.isPassable(curCol + qx, curRow + qy)) {
            player.x = curCol;
            player.y = curRow;
            player.dirX = qx;
            player.dirY = qy;
            player.queuedDirX = 0;
            player.queuedDirY = 0;
          }
        }
      }
    }

    // 3. Movimiento y Detección de Colisión Frontal
    const moveDist = player.speed * deltaRatio;

    if (player.dirX !== 0) {
      const targetCol = player.dirX > 0 ? curCol + 1 : curCol - 1;
      const canProceed = this.isPassable(targetCol, curRow);

      if (canProceed) {
        player.x += player.dirX * moveDist;
      } else {
        // Acercarse hasta el centro exacto de la baldosa y detenerse limpiamente
        if (player.dirX > 0) {
          if (player.x + moveDist >= curCol) {
            player.x = curCol;
            player.dirX = 0;
          } else {
            player.x += moveDist;
          }
        } else {
          if (player.x - moveDist <= curCol) {
            player.x = curCol;
            player.dirX = 0;
          } else {
            player.x -= moveDist;
          }
        }
      }
    } else if (player.dirY !== 0) {
      const targetRow = player.dirY > 0 ? curRow + 1 : curRow - 1;
      const canProceed = this.isPassable(curCol, targetRow);

      if (canProceed) {
        player.y += player.dirY * moveDist;
      } else {
        // Acercarse hasta el centro exacto de la baldosa y detenerse limpiamente
        if (player.dirY > 0) {
          if (player.y + moveDist >= curRow) {
            player.y = curRow;
            player.dirY = 0;
          } else {
            player.y += moveDist;
          }
        } else {
          if (player.y - moveDist <= curRow) {
            player.y = curRow;
            player.dirY = 0;
          } else {
            player.y -= moveDist;
          }
        }
      }
    }

    // 4. Manejo de Túneles Laterales (Wrap)
    if (player.x < -0.5) {
      player.x = this.cols - 0.5;
    } else if (player.x > this.cols - 0.5) {
      player.x = -0.5;
    }

    // Clamp vertical por seguridad
    player.y = Math.max(0, Math.min(this.rows - 1, player.y));

    // 5. Ángulo y Estado de Movimiento
    player.isMoving = player.dirX !== 0 || player.dirY !== 0;
    if (player.dirX === 1) player.angle = 0;
    else if (player.dirX === -1) player.angle = Math.PI;
    else if (player.dirY === 1) player.angle = Math.PI / 2;
    else if (player.dirY === -1) player.angle = -Math.PI / 2;

    // 6. Recogida de Medidas Preventivas y EPIs
    const tileCol = Math.round(player.x);
    const tileRow = Math.round(player.y);
    const distToCenter = Math.hypot(player.x - tileCol, player.y - tileRow);

    if (
      distToCenter < 0.45 &&
      tileRow >= 0 &&
      tileRow < this.rows &&
      tileCol >= 0 &&
      tileCol < this.cols
    ) {
      const tile = this.map[tileRow][tileCol];
      if (tile === TileType.PREVENTIVE_DOT || tile === TileType.PPE_SPECIAL) {
        this.map[tileRow][tileCol] = TileType.EMPTY;
        if (onCollectDot) {
          onCollectDot(tileCol, tileRow, tile);
        }
      }
    }
  }

  private chooseHazardDirection(
    hazard: Hazard,
    col: number,
    row: number,
    player: Player,
    isProtocolActive: boolean
  ) {
    const directions = [
      { dx: 0, dy: -1 }, // ARRIBA
      { dx: 1, dy: 0 },  // DERECHA
      { dx: 0, dy: 1 },  // ABAJO
      { dx: -1, dy: 0 }, // IZQUIERDA
    ];

    // Comprobar cuáles de las 4 direcciones son transitables
    const passable = directions.filter((d) => this.isPassable(col + d.dx, row + d.dy));

    if (passable.length === 0) {
      hazard.dirX = -hazard.dirX;
      hazard.dirY = -hazard.dirY;
      return;
    }

    // Excluir giro de 180° atrás a menos que sea la única salida
    const nonReverse = passable.filter(
      (d) => !(d.dx === -hazard.dirX && d.dy === -hazard.dirY && (hazard.dirX !== 0 || hazard.dirY !== 0))
    );

    const candidates = nonReverse.length > 0 ? nonReverse : passable;

    if (candidates.length === 1) {
      hazard.dirX = candidates[0].dx;
      hazard.dirY = candidates[0].dy;
      return;
    }

    // Objetivo de IA preventiva
    let targetX = player.x;
    let targetY = player.y;

    if (isProtocolActive) {
      // En protocolo de seguridad, el riesgo huye del operario hacia la esquina opuesta
      targetX = player.x < this.cols / 2 ? this.cols - 1 : 0;
      targetY = player.y < this.rows / 2 ? this.rows - 1 : 0;
    } else {
      switch (hazard.type) {
        case 'FORKLIFT': // Carretilla AGV: rastreo frontal
          targetX = player.x;
          targetY = player.y;
          break;
        case 'CHEMICAL': // Derrame químico: corta paso adelantando
          targetX = player.x + player.dirX * 2;
          targetY = player.y + player.dirY * 2;
          break;
        case 'ELECTRICAL': // Cuadro eléctrico: flanqueo
          targetX = player.x - player.dirY * 2;
          targetY = player.y + player.dirX * 2;
          break;
        case 'FALL': // Carga suspendida: zona aleatoria
        default:
          if (Math.random() < 0.5) {
            const chosen = candidates[Math.floor(Math.random() * candidates.length)];
            hazard.dirX = chosen.dx;
            hazard.dirY = chosen.dy;
            return;
          }
          break;
      }
    }

    // 70% heurística de distancia al objetivo, 30% dispersión aleatoria
    if (Math.random() < 0.70) {
      candidates.sort((a, b) => {
        const distA = Math.hypot(col + a.dx - targetX, row + a.dy - targetY);
        const distB = Math.hypot(col + b.dx - targetX, row + b.dy - targetY);
        return distA - distB;
      });
      hazard.dirX = candidates[0].dx;
      hazard.dirY = candidates[0].dy;
    } else {
      const chosen = candidates[Math.floor(Math.random() * candidates.length)];
      hazard.dirX = chosen.dx;
      hazard.dirY = chosen.dy;
    }
  }

  public updateHazard(
    hazard: Hazard,
    player: Player,
    deltaRatio: number,
    isProtocolActive: boolean
  ) {
    if (hazard.isNeutralized) {
      // Retornar al centro de spawn de riesgos
      const distToSpawn = Math.hypot(hazard.x - hazard.respawnX, hazard.y - hazard.respawnY);
      if (distToSpawn < 0.4) {
        hazard.isNeutralized = false;
        hazard.x = hazard.respawnX;
        hazard.y = hazard.respawnY;
        hazard.dirX = 0;
        hazard.dirY = 0;
        this.chooseHazardDirection(hazard, hazard.respawnX, hazard.respawnY, player, false);
      } else {
        const angle = Math.atan2(hazard.respawnY - hazard.y, hazard.respawnX - hazard.x);
        hazard.x += Math.cos(angle) * hazard.speed * 2.2 * deltaRatio;
        hazard.y += Math.sin(angle) * hazard.speed * 2.2 * deltaRatio;
        return;
      }
    }

    const speed = isProtocolActive ? hazard.speed * 0.55 : hazard.speed;
    const moveDist = speed * deltaRatio;

    // Si el riesgo está quieto, asignarle una dirección válida
    if (hazard.dirX === 0 && hazard.dirY === 0) {
      this.chooseHazardDirection(
        hazard,
        Math.round(hazard.x),
        Math.round(hazard.y),
        player,
        isProtocolActive
      );
      if (hazard.dirX === 0 && hazard.dirY === 0) return;
    }

    const curCol = Math.round(hazard.x);
    const curRow = Math.round(hazard.y);

    if (hazard.dirX > 0) {
      const nextX = hazard.x + moveDist;
      const targetCol = Math.floor(hazard.x) + 1;
      if (nextX >= targetCol) {
        hazard.x = targetCol;
        this.chooseHazardDirection(hazard, targetCol, curRow, player, isProtocolActive);
      } else {
        if (this.isPassable(Math.floor(hazard.x) + 1, curRow)) {
          hazard.x = nextX;
        } else {
          hazard.x = Math.floor(hazard.x);
          this.chooseHazardDirection(hazard, Math.floor(hazard.x), curRow, player, isProtocolActive);
        }
      }
    } else if (hazard.dirX < 0) {
      const nextX = hazard.x - moveDist;
      const targetCol = Math.ceil(hazard.x) - 1;
      if (nextX <= targetCol) {
        hazard.x = targetCol;
        this.chooseHazardDirection(hazard, targetCol, curRow, player, isProtocolActive);
      } else {
        if (this.isPassable(Math.ceil(hazard.x) - 1, curRow)) {
          hazard.x = nextX;
        } else {
          hazard.x = Math.ceil(hazard.x);
          this.chooseHazardDirection(hazard, Math.ceil(hazard.x), curRow, player, isProtocolActive);
        }
      }
    } else if (hazard.dirY > 0) {
      const nextY = hazard.y + moveDist;
      const targetRow = Math.floor(hazard.y) + 1;
      if (nextY >= targetRow) {
        hazard.y = targetRow;
        this.chooseHazardDirection(hazard, curCol, targetRow, player, isProtocolActive);
      } else {
        if (this.isPassable(curCol, Math.floor(hazard.y) + 1)) {
          hazard.y = nextY;
        } else {
          hazard.y = Math.floor(hazard.y);
          this.chooseHazardDirection(hazard, curCol, Math.floor(hazard.y), player, isProtocolActive);
        }
      }
    } else if (hazard.dirY < 0) {
      const nextY = hazard.y - moveDist;
      const targetRow = Math.ceil(hazard.y) - 1;
      if (nextY <= targetRow) {
        hazard.y = targetRow;
        this.chooseHazardDirection(hazard, curCol, targetRow, player, isProtocolActive);
      } else {
        if (this.isPassable(curCol, Math.ceil(hazard.y) - 1)) {
          hazard.y = nextY;
        } else {
          hazard.y = Math.ceil(hazard.y);
          this.chooseHazardDirection(hazard, curCol, Math.ceil(hazard.y), player, isProtocolActive);
        }
      }
    }

    // Túnel lateral
    if (hazard.x < -0.5) hazard.x = this.cols - 0.5;
    if (hazard.x > this.cols - 0.5) hazard.x = -0.5;
  }
}
