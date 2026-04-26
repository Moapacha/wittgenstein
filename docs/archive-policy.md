# Archive Policy

This document defines how Wittgenstein treats stale, superseded, historical, and mixed-surface files.

The goal is **not** to keep everything forever, and **not** to delete everything aggressively. The goal is to preserve provenance without polluting active guidance.

---

## The four outcomes

When you find an old file, choose exactly one of these outcomes:

### 1. Delete

Delete the file if all of the following are true:

- it is low-value or purely temporary;
- it has no meaningful role in current reasoning or provenance;
- it is not linked from current docs, issues, RFCs, ADRs, or execution guides;
- git history is enough if someone ever needs it again.

Typical examples:

- one-off scratch notes;
- abandoned duplicates;
- generated intermediates;
- half-finished drafts with no surviving references.

### 2. Archive

Archive the file if it is no longer active guidance **but still matters historically**.

Archive is the right move when the file:

- carried a real decision path, milestone, or handoff;
- is explicitly superseded by a newer surface;
- is still useful for provenance, release history, or research traceability;
- would be misleading if left in an active path.

Typical examples:

- superseded day-1 plans;
- old showcase or benchmark snapshots;
- replaced RFCs / ADRs / handoff materials that still explain why a later decision exists.

### 3. Refresh

Refresh the file if it is still meant to be active guidance but has drifted.

Use this when the file still occupies a live slot in:

- `README.md`
- `docs/index.md`
- `AGENTS.md`
- contributor onboarding
- current issue / PR / exec-plan flows

If a file is still on the main path, do not silently let it rot.

### 4. Reclassify

Some files are neither purely active nor purely historical. They are **mixed-surface** documents: still useful, but no longer the canonical execution brief.

In that case:

- keep the path stable if many references already point to it;
- add a clear status banner at the top;
- explicitly point readers to the current active surface;
- say what historical or legacy role the page still serves.

This is usually better than a rushed archive move.

---

## Archive placement rules

Prefer **surface-local archive paths**, not one giant catch-all graveyard.

Good examples:

- `docs/exec-plans/archive/`
- `docs/research/archive/` if research notes later need it
- a codec-local or site-local archive folder if that surface accumulates its own history

Every archive folder should contain a `README.md` that answers:

1. What lives here?
2. Why was it archived?
3. What active surface supersedes it?
4. What should readers use instead?

Do not link archived files as active guidance.

---

## Required metadata for archived material

When archiving a file, say at least:

- **status** — archived / superseded / historical
- **reason** — why it moved out of the active path
- **superseded by** — exact current file or issue if one exists
- **usage rule** — e.g. "kept for provenance, not for execution"

If a file cannot be described this way, it is often a sign it should be deleted instead.

---

## Review checklist

Before archiving or deleting a file, check:

- Is it linked from `README.md`, `docs/index.md`, `AGENTS.md`, or contributor guides?
- Is it cited by an RFC, ADR, exec-plan, issue, or PR that still matters?
- Is it a historical receipt that supports a release, benchmark, or milestone claim?
- Would an agent mistake it for active guidance if it stayed where it is?

If the answer to the last question is yes, action is required: archive, refresh, or reclassify.

---

## Current repo stance

For Wittgenstein specifically:

- **active guidance** should stay concentrated in `AGENTS.md`, `docs/index.md`, active exec-plans, current agent guides, and the current doctrine documents;
- **locked doctrine** lives in thesis / ADR / hard-constraints / naming surfaces;
- **historical receipts** should be preserved when they explain a milestone, benchmark, release, or handoff;
- **mixed-surface pages** should be clearly marked rather than quietly left ambiguous.

This policy is an extension of `docs/engineering-discipline.md`, not a replacement for it.
