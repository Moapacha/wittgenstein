import type { Modality, PolyglotCodec } from "@polyglot/schemas";
import { PolyglotError } from "./errors.js";

export type AnyCodec = PolyglotCodec<unknown, unknown>;

export class CodecRegistry {
  private readonly codecs = new Map<Modality, AnyCodec>();

  public register<Req, Parsed>(codec: PolyglotCodec<Req, Parsed>): this {
    this.codecs.set(codec.modality, codec as unknown as AnyCodec);
    return this;
  }

  public get(modality: Modality): AnyCodec | undefined {
    return this.codecs.get(modality);
  }

  public getOrThrow(modality: Modality): AnyCodec {
    const codec = this.get(modality);

    if (!codec) {
      throw new PolyglotError(
        "UNKNOWN_MODALITY",
        `No codec registered for modality: ${modality}`,
      );
    }

    return codec;
  }

  public list(): AnyCodec[] {
    return [...this.codecs.values()];
  }
}
