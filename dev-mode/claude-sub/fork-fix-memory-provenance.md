# Fork fix: MEMORY.md keeps dropping out of the prompt ("untrusted" provenance label)

**Date:** 2026-10-16 · **Fork:** /opt/openclaw-dev-mode (HEAD 5b6ed96ee, OpenClaw 2026.9.6)
**Status:** labels cleared today (backup `private/backups/provenance-rows-2026-10-16.json`). The code fix below is **not applied yet**.

---

## 1. Symptom

- `MEMORY.md` silently stops being loaded into Jarvis's prompt. There's no error and no visible warning, only a `warn` line in the gateway log.
- Our 05:30 cron (`scripts/check-memory-provenance.py`) catches it and alerts through JarvisHub (#6646 today).
- This has happened 3 times: Oct 10, Oct 12, and Oct 16. Clearing it by hand fixes it until the next time.

## 2. How the label works

Every write OpenClaw makes to a memory file (`MEMORY.md`, `USER.md`, `memory/*.md`) records a row in
`state/openclaw.sqlite → plugin_state_entries` (plugin `core:memory-artifact-provenance`):
`{relativePath, fileHash, originClass: "agent" | "untrusted", sessionId, observedAt}`.

At bootstrap, `MEMORY.md`/`USER.md` are injected **only if** their class is eligible (`agent`/`owner`):

- `src/agents/bootstrap-files.ts:240` `resolveIneligibleAutomaticMemoryFiles()` → excluded files
- `extensions/memory-core/src/memory/memory-path-provenance.ts:78` → `if (recorded) return recorded.originClass`
- If a file has no row, it defaults to `agent` (line 84). That's why deleting the row "fixes" it.

## 3. Root cause: three flaws that stack up

### Flaw A: one tainted turn labels the file forever

`src/agents/agent-tools.ts:268`

```ts
resolveOriginClass: () =>
  options?.senderIsOwner === false || options?.isTurnTainted?.() === true ? "untrusted" : "agent",
```

`turn-taint-state.ts:8`: a turn becomes tainted as soon as **any** tool result comes from the network (web_fetch, web_search, browser...).
So if Ariel says "remember X" in a turn where I also did a web lookup, the MEMORY.md edit gets labeled `untrusted`.
This is intended upstream (it blocks prompt injection from web pages into memory), but nothing ever undoes it.

### Flaw B: the label never comes off

`src/memory/memory-artifact-provenance.ts:151-156`

```ts
const originClass =
  params.originClass === "agent" &&
  (!previous ||
    (previous.originClass === "agent" && previous.fileHash === sha256(params.contentBefore)))
    ? "agent"
    : "untrusted";
```

- Once a file is `untrusted`, every later write keeps it `untrusted`, even clean writes by the owner.
- And `memory-path-provenance.ts:78` uses the stored label **without checking whether the file still has that content**. So even if Ariel rewrites MEMORY.md completely by hand, the old label still applies.

### Flaw C: edits OpenClaw can't see turn the next clean write untrusted

Same lines 151-156: when the previous row is `agent` but its `fileHash` ≠ the file's current content, the new write is labeled `untrusted`.
These all change MEMORY.md without updating the row:

- Jarvis on the **claude-cli runtime**: Claude Code's own `Edit`/`Write` tools bypass OpenClaw's provenance wrapper.
- Ariel replacing the file himself (e.g. Oct 12 20:53, his WhatsApp doc).
- shell scripts / crons / `sed`.

After any of those, the **next** native OpenClaw edit, even in a perfectly clean turn, sees a hash mismatch and labels the file `untrusted`.

### Today's actual chain (Oct 15)

- Main session was stuck on `ollama/glm-5.3-flash` (embedded runtime, native `edit` tool) during the WhatsApp ghost-pipe crisis. That was a heavily web-tainted turn.
- 10:12 UTC: MEMORY.md was edited → labeled `untrusted` (Flaw A). It stayed that way (Flaw B) until it was cleared by hand this morning.
- 10:52 UTC: the `session-memory` hook saved `memory/2026-10-15-1052.md` labeled `untrusted`, because the transcript held inter-session/hub messages (`hooks/bundled/session-memory/handler.ts:259`). Daily snapshot files aren't injected at bootstrap, so this one is harmless. It's only filtered from memory promotion.

## 4. The fix (3 small patches, all inside the fork)

### Patch 1: a stale label must not outlive its content (fixes Flaw B + C)

**File:** `extensions/memory-core/src/memory/memory-path-provenance.ts` (~line 78)

Only trust the stored label if it still describes the current file:

```ts
if (recorded) {
  const current = await fs.readFile(params.absolutePath, "utf8").catch(() => undefined);
  if (current !== undefined && sha256(current) === recorded.fileHash) {
    return { curatedRoot, originClass: recorded.originClass };
  }
  // File was rewritten out-of-band (owner, claude-cli, shell): label is stale -> fall through to default.
}
```

**File:** `src/memory/memory-artifact-provenance.ts:151`. Out-of-band edits must not poison the next clean write:

```ts
const stale = previous && previous.fileHash !== sha256(params.contentBefore);
const effectivePrevious = stale ? undefined : previous;
const originClass =
  params.originClass === "agent" &&
  (!effectivePrevious || effectivePrevious.originClass === "agent")
    ? "agent"
    : "untrusted";
```

Result: a hand edit by Ariel, or a claude-cli edit by Jarvis, makes the file trusted again. A tainted native write still labels it `untrusted` until the next out-of-band edit.

### Patch 2: owner-only exemption for the two curated root files (fixes Flaw A for our setup)

**File:** `src/agents/agent-tools.ts:268`. In an **owner** session, network taint alone doesn't mark `MEMORY.md`/`USER.md` untrusted:

```ts
resolveOriginClass: (relativePath?: string) =>
  options?.senderIsOwner === false
    ? "untrusted"
    : options?.isTurnTainted?.() === true && !isOwnerCuratedRoot(relativePath)
      ? "untrusted"
      : "agent",
```

Thread `relativePath` through `createMemoryWriteProvenanceObserver` (`src/agents/memory-write-provenance.ts:103`, call site `resolveOriginClass()` at ~line 131), with
`isOwnerCuratedRoot = p => p === "MEMORY.md" || p === "USER.md"`.
Gate it behind config so it's opt-in and easy to switch off: `memory.provenance.ownerCuratedRootsTrusted: true`.

**Trade-off:** if a web page tricks Jarvis into writing into MEMORY.md, that text gets injected into every future prompt.
On our box it's single-owner, owner-only DM, and MEMORY.md is git-tracked and diffable, so the risk is acceptable. **Don't upstream this one.**

### Patch 3: make the drop visible (defense in depth)

**File:** `src/agents/bootstrap-files.ts:240-305`. When `MEMORY.md`/`USER.md` is excluded for provenance, also emit
a diagnostic event (or POST JarvisHub `/notify`, source `memory-provenance`) right away, instead of only `params.warn` to the log.
Our 05:30 cron stays as the backstop.

## 5. Tests to add/run

- `src/memory/memory-artifact-provenance.test.ts`: agent row + out-of-band edit + clean write → `agent` (previously `untrusted`).
- `extensions/memory-core/.../memory-path-provenance.test.ts`: `untrusted` row + file content changed → default `agent`; unchanged → `untrusted`.
- `src/agents/agent-tools*.test.ts`: owner + tainted turn + `MEMORY.md` → `agent` when the flag is on, `untrusted` when it's off; `memory/x.md` still `untrusted`.
- Non-owner sender → always `untrusted` (unchanged).

## 6. Rollout

1. Patch → `pnpm test` (the files above) → build dist (same flow as `SEC-100`/`FIX-09`) → commit to the fork.
2. Ariel redeploys the fork (Jarvis never runs update/reinstall on this box).
3. Gateway restart → run the gateway-restart checklist (cron count, hub backlog).
4. Verify: edit MEMORY.md in a web-tainted owner turn → `python3 -I scripts/check-memory-provenance.py` → `{"untrusted": []}`.
5. Keep the 05:30 cron. After 2 clean weeks, downgrade it to weekly.

## 7. Manual clear recipe (until the patch lands)

Back up and delete the `untrusted` rows:
`plugin_state_entries WHERE plugin_id='core:memory-artifact-provenance' AND json_extract(value_json,'$.originClass')='untrusted'`
(Done Oct 12 and Oct 16. Backups are in `private/backups/provenance-rows-*.json`.)
