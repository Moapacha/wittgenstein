import type { PolyglotRequest } from "@polyglot/schemas";
import type { CodecRegistry } from "./registry.js";

export function routeRequest(request: PolyglotRequest, registry: CodecRegistry) {
  return registry.getOrThrow(request.modality);
}
