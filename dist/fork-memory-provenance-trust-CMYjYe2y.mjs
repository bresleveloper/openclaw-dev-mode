//#region src/memory/fork-memory-provenance-trust.ts
/**
* SEC-103 (openclaw-dev-mode fork): dev-mode never marks the agent's memory Markdown untrusted.
*
* Upstream labels every OpenClaw write to MEMORY.md, USER.md, users/<id>/USER.md and memory/*.md
* in the state DB (plugin `core:memory-artifact-provenance`). A write lands "untrusted" when the
* sender is not the owner, when any tool result in the turn came from the network (web_fetch,
* web_search, browser…), when the previous label was already untrusted (sticky forever), or
* when the file changed outside OpenClaw since the last labeled write (Ariel's hand edits,
* Claude Code's own Edit/Write on claude-cli runs, scripts). Untrusted MEMORY.md / USER.md are
* silently dropped from the bootstrap prompt, and untrusted chunks are kept out of auto-recall,
* dreaming and short-term promotion. On the VPS MEMORY.md dropped out of the main agent's prompt
* on 2026-10-10, 10-12 and 10-16 (report: dev-mode/claude-sub/fork-fix-memory-provenance.md).
*
* Dev-mode removes the quarantine (Ariel, 2026-10-16: "remove the 'marked as unsafe' system for
* the agents md files"):
* - writes are stored as "agent" (src/memory/memory-artifact-provenance.ts, the writer);
* - labels stored earlier read back as "agent" (same file, toPublicProvenance, which feeds both
*   readers: memory-core's path classifier, dreaming, promotion, forget);
* - the bootstrap gate never drops MEMORY.md / USER.md for provenance, including its fail-closed
*   paths (src/agents/bootstrap-files.ts, resolveIneligibleAutomaticMemoryFiles).
* Untouched: the "system" class of DREAMS.md and memory/dreaming/ (dreaming's own output), session
* transcript provenance, paths outside the workspace, and the main-session-only privacy rule for
* MEMORY.md. Trade-off, accepted on a single-owner box: text a web page talks the agent into
* writing to MEMORY.md is injected into every later prompt.
*
* Same gate as src/globals.ts isDevMode(), read here directly: this storage module is reachable
* from the plugin SDK (memory-core-host-runtime-core) and stays free of the logger imports.
*
* Regression checklist (every upstream upgrade):
* - the writer still computes one originClass from params.originClass + the previous row, and
*   the hook still wraps it (upstream main moved it into a compareAndApply loop after 10.4);
* - both readers still return rows through toPublicProvenance, and no new reader bypasses it
*   (`git grep -n "originClass" src/memory/memory-artifact-provenance.ts`);
* - bootstrap still gates MEMORY.md / USER.md in resolveIneligibleAutomaticMemoryFiles;
* - no new consumer quarantines workspace memory from another source (`git grep -n
*   "untrusted" extensions/memory-core/src src/agents/bootstrap-files.ts`);
* - src/memory/fork-memory-provenance-trust.test.ts passes.
*/
/** True while dev-mode keeps every workspace memory file trusted. */
function forkTrustsAllMemoryFiles() {
	return process.env.OPENCLAW_DEV_MODE === "1";
}
/** Dev-mode stores and reads every memory artifact as "agent"; otherwise upstream's class. */
function resolveForkMemoryOriginClass(originClass) {
	return forkTrustsAllMemoryFiles() ? "agent" : originClass;
}
//#endregion
export { resolveForkMemoryOriginClass as n, forkTrustsAllMemoryFiles as t };
