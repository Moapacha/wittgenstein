import type { AsciipngIr } from "./schema.js";

function stripFences(raw: string): string {
  let t = raw.trim();
  if (t.startsWith("```")) {
    t = t.replace(/^```(?:\w*)?\s*/i, "");
    t = t.replace(/\s*```$/i, "");
  }
  return t.trim();
}

/** One display column: ASCII printable or placeholder for wide chars. */
function normalizeChar(ch: string): string {
  const cp = ch.codePointAt(0) ?? 32;
  if (cp === 9) {
    return " ";
  }
  if (cp >= 32 && cp <= 126) {
    return ch;
  }
  return "?";
}

/**
 * Turn free-form Minimax (text-only) output into row-major grid text for {@link renderPseudoAsciiPng}.
 * Does not trust the model to return JSON — only lines of characters.
 */
export function minimaxTextToAsciiIr(
  rawModelText: string,
  columns: number,
  rows: number,
  cell: number,
): AsciipngIr {
  const body = stripFences(rawModelText);
  const rawLines = body.split(/\r?\n/).map((l) => l.trimEnd());
  const lines: string[] = [];
  for (const line of rawLines) {
    if (line.length === 0) {
      continue;
    }
    let norm = "";
    for (const ch of line) {
      if (norm.length >= columns) {
        break;
      }
      norm += normalizeChar(ch);
    }
    lines.push(norm.padEnd(columns, " "));
    if (lines.length >= rows) {
      break;
    }
  }
  while (lines.length < rows) {
    lines.push(" ".repeat(columns));
  }
  const text = lines.slice(0, rows).join("");
  return {
    text,
    columns,
    rows,
    cell,
    fg: [68, 255, 170],
    bg: [6, 8, 10],
    glyphMode: "density",
  };
}
