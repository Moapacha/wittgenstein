const checkpoints = [
  "Harness runtime with manifests, retry, seed, and budget tracking",
  "Four codec packages with typed schema and render seams",
  "Official site, docs, CLI, and CI in the same monorepo",
];

export default function HomePage() {
  return (
    <main className="min-h-screen px-6 py-8 md:px-10">
      <section className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-7xl grid-cols-1 gap-8 border border-grid bg-white shadow-frame md:grid-cols-12">
        <div className="border-b border-grid p-6 md:col-span-3 md:border-b-0 md:border-r">
          <div className="flex h-full flex-col justify-between">
            <div className="space-y-4">
              <p className="font-mono text-xs uppercase tracking-[0.3em] text-black/55">
                Polyglot
              </p>
              <h1 className="max-w-xs text-4xl font-semibold leading-tight md:text-5xl">
                Text-native models,
                <br />
                file-native outputs.
              </h1>
            </div>
            <p className="max-w-xs font-mono text-sm leading-6 text-black/65">
              LLM as planner. Harness as runtime. Structured IR as the handoff.
            </p>
          </div>
        </div>

        <div className="relative overflow-hidden md:col-span-9">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,transparent_0,transparent_calc(100%-1px),rgba(17,17,17,0.08)_100%),linear-gradient(to_bottom,transparent_0,transparent_calc(100%-1px),rgba(17,17,17,0.08)_100%)] bg-[size:56px_56px]" />
          <div className="relative grid h-full grid-cols-1 gap-6 p-6 md:grid-cols-10 md:p-10">
            <div className="space-y-6 md:col-span-6">
              <p className="max-w-2xl text-base leading-7 text-black/72 md:text-lg">
                The scaffold is live: shared runtime, typed codec contracts, reproducibility spine,
                and the sole neural image path are wired into a production-grade monorepo.
              </p>

              <div className="grid gap-3">
                {checkpoints.map((checkpoint, index) => (
                  <div
                    key={checkpoint}
                    className="flex items-start gap-3 border border-grid bg-canvas/80 p-4 backdrop-blur-sm"
                  >
                    <span className="font-mono text-xs text-black/45">
                      0{index + 1}
                    </span>
                    <p className="text-sm leading-6 text-black/78">{checkpoint}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col justify-between border border-grid bg-black p-5 text-white md:col-span-4">
              <div className="space-y-4">
                <p className="font-mono text-xs uppercase tracking-[0.25em] text-white/50">
                  Locked Image Path
                </p>
                <div className="space-y-2 text-sm leading-6 text-white/78">
                  <p>LLM</p>
                  <p>JSON scene spec</p>
                  <p>Adapter</p>
                  <p>Frozen decoder</p>
                  <p>PNG</p>
                </div>
              </div>
              <div className="border-t border-white/15 pt-4 font-mono text-xs leading-5 text-white/60">
                No SVG fallback. No painter tier. Decoder allowed, generator excluded.
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
