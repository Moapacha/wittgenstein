import type { ImageSceneSpec } from "./schema.js";
import type { codecV2 } from "@wittgenstein/schemas";

export interface ImageArtifactMetadata extends codecV2.BaseArtifactMetadata {
  readonly codec: "image";
  readonly route: "raster";
  warnings: codecV2.CodecWarning[];
  readonly llmTokens: { input: number; output: number };
  readonly costUsd: number;
  readonly durationMs: number;
  readonly seed: number | null;
  readonly promptExpanded: string | null;
  readonly llmOutputRaw: string | null;
  readonly llmOutputParsed: ImageSceneSpec | null;
  readonly quality: {
    readonly structural: {
      readonly schemaValidated: boolean;
      readonly route: "raster";
      readonly paletteCount: number;
      readonly palette: string[];
    };
    readonly partial: {
      readonly reason: "adapter-stub";
    };
  };
  readonly adapterHash: string;
  readonly decoderHash: {
    readonly value: string;
    readonly frozen: true;
    readonly slot: "LFQ-family-decoder";
  };
  artifactSha256: string | null;
}

export interface ImageArtifact extends codecV2.BaseArtifact {
  readonly outPath: string;
  bytes?: Uint8Array;
  readonly mime: "image/png";
  readonly width: number;
  readonly height: number;
  readonly metadata: ImageArtifactMetadata;
}
