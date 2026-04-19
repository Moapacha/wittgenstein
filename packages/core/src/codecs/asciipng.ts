import { asciipngCodec } from "@wittgenstein/codec-asciipng";
import type { CodecRegistry } from "../runtime/registry.js";

export function registerAsciipngCodec(registry: CodecRegistry): CodecRegistry {
  registry.register(asciipngCodec);
  return registry;
}
