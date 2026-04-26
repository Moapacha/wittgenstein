import type { Modality, WittgensteinCodec, codecV2 } from "@wittgenstein/schemas";
import { WittgensteinError } from "./errors.js";

export type AnyCodec =
  | WittgensteinCodec<unknown, unknown>
  | codecV2.Codec<unknown, codecV2.BaseArtifact>;

export class CodecRegistry {
  private readonly codecs = new Map<Modality, AnyCodec>();

  public register<Req, Parsed, Art extends codecV2.BaseArtifact>(
    codec: WittgensteinCodec<Req, Parsed> | codecV2.Codec<Req, Art>,
  ): this {
    this.codecs.set(codec.modality, codec as unknown as AnyCodec);
    return this;
  }

  public get(modality: Modality): AnyCodec | undefined {
    return this.codecs.get(modality);
  }

  public getOrThrow(modality: Modality): AnyCodec {
    const codec = this.get(modality);

    if (!codec) {
      throw new WittgensteinError(
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
