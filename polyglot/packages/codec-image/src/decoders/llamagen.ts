export function loadLlamagenDecoderBridge() {
  throw createNotImplementedError("codec-image decoder bridge: llamagen");
}

function createNotImplementedError(scope: string): Error & { code: string } {
  return Object.assign(new Error(`NotImplementedError(${scope})`), {
    name: "NotImplementedError",
    code: "NOT_IMPLEMENTED",
  });
}
