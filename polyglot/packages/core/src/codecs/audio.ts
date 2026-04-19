import { audioCodec } from "@polyglot/codec-audio";
import type { CodecRegistry } from "../runtime/registry.js";

export function registerAudioCodec(registry: CodecRegistry): CodecRegistry {
  registry.register(audioCodec);
  return registry;
}
