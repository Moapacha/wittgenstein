import { imageV2Codec } from "@wittgenstein/codec-image";
import type { CodecRegistry } from "../runtime/registry.js";

export function registerImageCodec(registry: CodecRegistry): CodecRegistry {
  registry.register(imageV2Codec);
  return registry;
}
