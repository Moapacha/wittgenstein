import { sensorCodec } from "@polyglot/codec-sensor";
import type { CodecRegistry } from "../runtime/registry.js";

export function registerSensorCodec(registry: CodecRegistry): CodecRegistry {
  registry.register(sensorCodec);
  return registry;
}
