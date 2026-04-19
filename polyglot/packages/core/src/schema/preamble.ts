export function injectSchemaPreamble(prompt: string, schemaPreamble: string): string {
  return [
    "You are Polyglot.",
    "Return valid JSON only.",
    schemaPreamble.trim(),
    `User prompt:\n${prompt.trim()}`,
  ].join("\n\n");
}
