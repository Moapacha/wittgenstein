# Sensor Port Guide (M3)

This guide is for a contributor or coding agent picking up the **sensor codec port** as a standalone line, after M0 + M1 + M2 land.

It is deliberately narrow:

- **in scope:** porting `codec-sensor` to the v2 protocol shape; closing the modality sweep; preparing the M5b sensor benchmark bridge.
- **out of scope:** adding new signal types, swapping the operator runtime, image / audio / video work, doctrine relitigation.

Read the audio port guide (`docs/agent-guides/audio-port.md`) first — sensor's port is structurally simpler than audio's, and the audio guide's pattern transfers directly. Sensor's job is to confirm the protocol holds on a trivial case, not to discover anything new.

---

## 1. Mission

Port `codec-sensor` from the v0.1 surface to the Codec v2 protocol shape, while:

- preserving **byte-for-byte SHA-256 parity** on every shipping artifact (sensor synthesis is fully deterministic — there is no LLM-stage drift excuse);
- proving that `BaseCodec.passthrough` works as the L4 stage (sensor has no trained adapter);
- moving manifest authorship into the codec's `package` stage;
- keeping the user-facing `SensorRequest` surface unchanged.

You are not allowed to:

- add a new signal type (RFC required);
- add a new operator (RFC required);
- replace the operator-expansion runtime;
- introduce an L4 adapter — the *point* of M3 is that some codecs don't need one.

## 2. Read order

1. `AGENTS.md`
2. `docs/codecs/sensor.md` — codec surface, operator library, decoder rationale, no-adapter justification.
3. `docs/exec-plans/active/codec-v2-port.md` §M3 — per-package diff and gate.
4. `docs/agent-guides/audio-port.md` — the immediately-prior port pattern; sensor mirrors it with fewer pieces.
5. `docs/research/briefs/E_benchmarks_v2.md` §sensor — NeuroKit2 / rule-list bridge picks.

If M1 image and M2 audio have already landed, read their merged diffs — sensor reuses both shapes.

## 3. Why this is the confirmation case

Sensor has no L4 adapter, a fully deterministic L3, and a small operator library. Porting it to v2 is supposed to be *boring*:

- if the port spills past ~20 lines of codec-specific logic per signal type, the protocol shape is wrong (not the codec);
- if any artifact byte drifts, the codec has a real bug (synthesis is deterministic by contract);
- if `adapt` becomes anything other than `BaseCodec.passthrough`, you are over-implementing.

Sensor is the canonical "L4-as-pass-through" case the v2 protocol absorbs. If your diff makes that look easy, the protocol is right.

## 4. M3 deliverables

In order:

1. **`SensorCodec extends BaseCodec<SensorRequest, SensorArtifact>`** in `packages/codec-sensor/src/codec.ts`. The codec's `route(req)` selects the renderer per `signal` field.
2. **`adapt = BaseCodec.passthrough`** — explicit, greppable, no override.
3. **Three thin renderer files** (`signals/ecg.ts`, `signals/temperature.ts`, `signals/gyro.ts`) sharing the operator-expansion runtime.
4. **`package` stage authors all manifest rows** — including the JSON / CSV / HTML triple emit in one transaction.
5. **`packages/core/src/codecs/sensor.ts`** becomes a shim. The sensor branch in `packages/core/src/runtime/harness.ts` is deleted.
6. **Migration tests** under `packages/codec-sensor/test/`:
   - `parity-byte.test.ts` — byte-for-byte SHA-256 against goldens for all three signals.
   - `passthrough.test.ts` — asserts `SensorCodec.adapt === BaseCodec.passthrough`. Greppable invariant.
   - `route-trip.test.ts` — round-trip round-the-protocol for each signal in ≤20 lines.

## 5. Goldens and parity

Pin the v0.1 baseline at PR-open:

- `artifacts/showcase/workflow-examples/sensor/` — covers ECG, temperature, gyro. **All byte-for-byte SHA-256.**

Sensor has no LLM-stage drift to blame. If a SHA changes, you have a bug. Bisect; do not regenerate.

## 6. Manifest invariants for sensor

The codec's `package` stage must write:

- `signal` — the signal the codec dispatched on (ECG / temperature / gyro).
- `seed`, `sampleRateHz`, `durationSec`, `algorithm` digest.
- `artifact.sha256` for each of the three emitted files (JSON / CSV / HTML).
- `quality.structural` — operator composition recorded for replay.
- `quality.partial: { reason: "dashboard_unavailable" }` if the HTML loupe template is missing — JSON + CSV still emit.

The HTML dashboard is the only soft surface. Its absence does not block the run.

## 7. Two-hats checklist for this port

### Researcher hat

- Did you preserve every operator family without adding or removing any? Operator-library size is a feature.
- Is `adapt` the explicit pass-through, not a custom no-op? The greppable invariant matters.
- Does the M5b benchmark bridge stub still call into NeuroKit2 (Python) for ECG and rule lists for temperature/gyro per Brief E? If you re-pick the metric, you break M5b.

### Hacker hat

- Is the per-signal renderer file ≤20 lines of signal-specific logic on top of the shared operator runtime?
- Is the harness fully modality-blind after this port (no remaining `if (req.modality === "sensor")`)?
- Does the round-trip test fit in ≤20 lines for each signal? If not, the protocol shape is wrong — escalate.

If any answer is no, the gate is not met.

## 8. Failure modes you will hit

- **SHA drift on any artifact** — real bug. Bisect against the prior commit before doing anything else.
- **Operator-expansion produces NaN / Infinity** — surface as a structured render error. No silent zero-fill.
- **BPM out of clinical range for ECG** — refuse at parse time with the cap cited; this is a doctrine boundary, not a UX nicety.
- **HTML dashboard template missing** — JSON + CSV still emit; manifest records `quality.partial` for the dashboard miss; run does not fail.
- **Tempted to add a new operator to support a request** — stop. File an RFC. The operator library's narrowness is intentional.

## 9. Prompt block for an implementation agent

> You are implementing the Wittgenstein v0.2 sensor codec port (M3).
> Stay inside the locked doctrine: three signals (ECG / temperature / gyro), no new signals, no new operators, deterministic synthesis only, manifest spine preserved, modality branching moves out of the harness.
> Sensor has no L4 adapter — `adapt` is `BaseCodec.passthrough`. Do not override it.
> Read `AGENTS.md`, `docs/codecs/sensor.md`, `docs/exec-plans/active/codec-v2-port.md` §M3, and `docs/agent-guides/audio-port.md` first. The audio port is the immediately-prior pattern.
> Your task is to land M3: byte-for-byte parity on goldens, pass-through `adapt`, manifest authorship in the codec, harness branch deleted.
> Do not relitigate doctrine. Do not add a new operator. Do not widen scope.
> Prefer small diffs, deterministic parity, and receipt-preserving behavior.

## 10. Exit condition

This guide has done its job when:

- the port lands the M3 gate in `docs/exec-plans/active/codec-v2-port.md`;
- the harness is fully modality-blind (greppable);
- the codec catalog has image + audio + sensor at v2 parity, ready for M4 cleanup.
