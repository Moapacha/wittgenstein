import { mkdir, writeFile, stat } from "node:fs/promises";
import { dirname, extname } from "node:path";
import type { RenderCtx, RenderResult } from "@wittgenstein/schemas";
import type { VideoComposition } from "./schema.js";

export async function renderWithHyperFrames(
  composition: VideoComposition,
  ctx: RenderCtx,
): Promise<RenderResult> {
  const startedAt = Date.now();
  const artifactPath = resolveHyperFramesArtifactPath(ctx.outPath);
  const html = buildHyperFramesHtml(composition, ctx);

  await mkdir(dirname(artifactPath), { recursive: true });
  await writeFile(artifactPath, html, "utf8");

  const bytes = (await stat(artifactPath)).size;

  return {
    artifactPath,
    mimeType: "text/html; charset=utf-8",
    bytes,
    metadata: {
      codec: "video",
      route: "hyperframes-html",
      llmTokens: { input: 0, output: 0 },
      costUsd: 0,
      durationMs: Date.now() - startedAt,
      seed: ctx.seed,
    },
  };
}

function resolveHyperFramesArtifactPath(outPath: string): string {
  const ext = extname(outPath);
  if (ext.toLowerCase() === ".html" || ext.toLowerCase() === ".htm") {
    return outPath;
  }

  // The harness default for video is still `output.mp4`, but this codec stage emits a
  // HyperFrames-style HTML composition (render-to-mp4 happens via HyperFrames CLI).
  if (ext.toLowerCase() === ".mp4") {
    return `${outPath.slice(0, -".mp4".length)}.hyperframes.html`;
  }

  return `${outPath}.hyperframes.html`;
}

function buildHyperFramesHtml(composition: VideoComposition, ctx: RenderCtx): string {
  const width = 1920;
  const height = 1080;
  const compositionId = sanitizeId(`wittgenstein-${ctx.runId}`);

  const scenes =
    composition.scenes.length > 0
      ? composition.scenes
      : [
          {
            name: "scene-1",
            description: composition.scenes.length === 0 ? "Auto scene (no scenes provided)." : "",
            durationSec: composition.durationSec,
          },
        ];

  const totalDurationSec = Math.max(
    composition.durationSec,
    scenes.reduce((sum, s) => sum + s.durationSec, 0),
    0.25,
  );

  let t = 0;
  const clips = scenes.map((scene, index) => {
    const start = t;
    t += scene.durationSec;
    return { scene, index, start };
  });

  return [
    "<!doctype html>",
    `<html lang="en">`,
    `<head>`,
    `<meta charset="utf-8" />`,
    `<meta name="viewport" content="width=device-width, initial-scale=1" />`,
    `<title>${escapeHtml(compositionId)}</title>`,
    `<style>`,
    `:root { color-scheme: dark; }`,
    `html, body { height: 100%; margin: 0; background: #070a12; font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial; }`,
    `#stage { position: relative; width: ${width}px; height: ${height}px; margin: 0 auto; background: radial-gradient(1200px 800px at 30% 20%, #1b2a55, #070a12 55%), linear-gradient(180deg, #0b1020, #070a12); overflow: hidden; }`,
    `.hf-clip { position: absolute; inset: 0; display: grid; place-items: center; padding: 96px; box-sizing: border-box; }`,
    `.hf-card { width: min(1400px, 92vw); border: 1px solid rgba(255,255,255,0.12); border-radius: 28px; padding: 56px 64px; background: rgba(10, 14, 28, 0.72); backdrop-filter: blur(10px); box-shadow: 0 30px 120px rgba(0,0,0,0.45); }`,
    `.hf-kicker { letter-spacing: 0.14em; text-transform: uppercase; font-size: 14px; color: rgba(255,255,255,0.55); margin: 0 0 18px; }`,
    `.hf-title { margin: 0 0 22px; font-size: 64px; line-height: 1.05; font-weight: 650; color: rgba(255,255,255,0.95); }`,
    `.hf-body { margin: 0; font-size: 34px; line-height: 1.35; color: rgba(255,255,255,0.78); white-space: pre-wrap; }`,
    `.hf-meta { margin-top: 34px; font-size: 18px; color: rgba(255,255,255,0.45); }`,
    `</style>`,
    `</head>`,
    `<body>`,
    `<div`,
    `  id="stage"`,
    `  data-composition-id="${escapeHtml(compositionId)}"`,
    `  data-start="0"`,
    `  data-width="${width}"`,
    `  data-height="${height}"`,
    `  data-duration="${totalDurationSec}"`,
    `>`,
    ...clips.map(({ scene, index, start }) => {
      const trackIndex = index % 8;
      return [
        `<div`,
        `  class="hf-clip"`,
        `  data-start="${start}"`,
        `  data-duration="${scene.durationSec}"`,
        `  data-track-index="${trackIndex}"`,
        `>`,
        `  <div class="hf-card">`,
        `    <p class="hf-kicker">${escapeHtml(scene.name)}</p>`,
        `    <h1 class="hf-title">${escapeHtml(scene.name)}</h1>`,
        `    <p class="hf-body">${escapeHtml(scene.description)}</p>`,
        `    <div class="hf-meta">fps=${escapeHtml(String(composition.fps))} · seed=${escapeHtml(String(ctx.seed))}</div>`,
        `  </div>`,
        `</div>`,
      ].join("\n");
    }),
    `</div>`,
    `</body>`,
    `</html>`,
    "",
  ].join("\n");
}

function sanitizeId(input: string): string {
  return input.replace(/[^a-zA-Z0-9_-]+/g, "-").replace(/^-+|-+$/g, "") || "composition";
}

function escapeHtml(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
