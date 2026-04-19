import { videoCodec } from "@polyglot/codec-video";
import type { CodecRegistry } from "../runtime/registry.js";

export function registerVideoCodec(registry: CodecRegistry): CodecRegistry {
  registry.register(videoCodec);
  return registry;
}
