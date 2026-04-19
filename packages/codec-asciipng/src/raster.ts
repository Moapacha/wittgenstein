import { PNG } from "pngjs";
import type { AsciipngIr } from "./schema.js";

function weightForChar(ch: string): number {
  if (ch === " " || ch === "\t") {
    return 0;
  }
  if ("#%@$&WM".includes(ch)) {
    return 0.88;
  }
  if ("*+=Xx".includes(ch)) {
    return 0.62;
  }
  if (".:,'`".includes(ch)) {
    return 0.28;
  }
  const cp = ch.codePointAt(0) ?? 32;
  return 0.38 + (cp % 17) / 100;
}

/** Density glyph from printable text (post-Minimax), not a real font. */
function charPatternDensity(ch: string, gx: number, gy: number, seed: number | null): number[][] {
  const w = weightForChar(ch);
  let h = ((seed ?? 1) ^ (gx << 4) ^ (gy << 8) ^ (ch.codePointAt(0) ?? 0) * 131) >>> 0;
  const rows: number[][] = [];
  for (let y = 0; y < 7; y++) {
    const row: number[] = [];
    for (let x = 0; x < 5; x++) {
      h = Math.imul(h, 1664525) + 1013904223;
      row.push(((h >>> 8) & 0xff) / 255 < w ? 1 : 0);
    }
    rows.push(row);
  }
  return rows;
}

/** 5×7 binary matrix from codepoint + grid + seed (pseudo-glyph, not a real font). */
function charPattern(cp: number, gx: number, gy: number, seed: number | null): number[][] {
  let h = (cp ^ (gx << 8) ^ (gy << 16) ^ (seed ?? 0x5eed)) >>> 0;
  const rows: number[][] = [];
  for (let y = 0; y < 7; y++) {
    const row: number[] = [];
    for (let x = 0; x < 5; x++) {
      h = Math.imul(h, 1103515245) + 12345;
      row.push((h >>> (x + y + 3)) & 1);
    }
    rows.push(row);
  }
  return rows;
}

function setPixel(
  png: PNG,
  px: number,
  py: number,
  r: number,
  g: number,
  b: number,
): void {
  if (px < 0 || py < 0 || px >= png.width || py >= png.height) {
    return;
  }
  const i = (png.width * py + px) << 2;
  png.data[i] = r;
  png.data[i + 1] = g;
  png.data[i + 2] = b;
  png.data[i + 3] = 255;
}

function drawCell(
  png: PNG,
  gx: number,
  gy: number,
  cell: number,
  ch: string,
  fg: readonly [number, number, number],
  bg: readonly [number, number, number],
  seed: number | null,
  glyphMode: "pseudo" | "density",
): void {
  const cp = ch.codePointAt(0) ?? 32;
  const pat =
    glyphMode === "density" ? charPatternDensity(ch, gx, gy, seed) : charPattern(cp, gx, gy, seed);
  const ox = gx * cell;
  const oy = gy * cell;
  for (let py = 0; py < cell; py++) {
    for (let px = 0; px < cell; px++) {
      const px2 = Math.min(4, Math.floor((px * 5) / cell));
      const py2 = Math.min(6, Math.floor((py * 7) / cell));
      const on = pat[py2]![px2]!;
      const [r, g, b] = on ? fg : bg;
      setPixel(png, ox + px, oy + py, r, g, b);
    }
  }
}

export function renderPseudoAsciiPng(ir: AsciipngIr, seed: number | null): Uint8Array {
  const { columns, rows, cell, fg, bg, text, glyphMode } = ir;
  const mode = glyphMode ?? "pseudo";
  const src = text.length > 0 ? text : " ";
  const w = columns * cell;
  const h = rows * cell;
  const png = new PNG({ width: w, height: h });

  for (let py = 0; py < h; py++) {
    for (let px = 0; px < w; px++) {
      setPixel(png, px, py, bg[0]!, bg[1]!, bg[2]!);
    }
  }

  const total = columns * rows;
  for (let i = 0; i < total; i++) {
    const ch = src[i % src.length]!;
    const gx = i % columns;
    const gy = Math.floor(i / columns);
    if (gy >= rows) {
      break;
    }
    drawCell(png, gx, gy, cell, ch, fg, bg, seed, mode);
  }

  return new Uint8Array(PNG.sync.write(png));
}
