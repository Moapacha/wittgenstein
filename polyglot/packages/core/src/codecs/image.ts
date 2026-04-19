import { imageCodec } from "@polyglot/codec-image";
import type { CodecRegistry } from "../runtime/registry.js";

export function registerImageCodec(registry: CodecRegistry): CodecRegistry {
  registry.register(imageCodec);
  return registry;
}
