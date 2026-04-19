export function resolveSeed(
  requestedSeed: number | null | undefined,
  defaultSeed: number | null | undefined,
): number | null {
  if (requestedSeed !== undefined) {
    return requestedSeed;
  }

  return defaultSeed ?? null;
}

export function createRunId(now = new Date()): string {
  const stamp = now.toISOString().replace(/[:.]/g, "-");
  const suffix = Math.random().toString(36).slice(2, 8);
  return `${stamp}-${suffix}`;
}

export function createDeterministicRandom(seed: number): () => number {
  let state = seed >>> 0;

  return () => {
    state += 0x6d2b79f5;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
