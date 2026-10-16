import { N as resolveOptionalIntegerOption } from "./number-coercion-CuVhdCBs.mjs";
import os from "node:os";
//#region src/config/agent-limits.ts
const MIN_AGENT_MAX_CONCURRENT = 8;
const AGENT_RUNS_PER_CPU = 4;
let defaultAgentMaxConcurrent;
function resolveDefaultAgentMaxConcurrent() {
	if (defaultAgentMaxConcurrent === void 0) defaultAgentMaxConcurrent = Math.max(MIN_AGENT_MAX_CONCURRENT, os.availableParallelism() * AGENT_RUNS_PER_CPU);
	return defaultAgentMaxConcurrent;
}
function isSubagentSpawnDepthAllowed(depth, maxSpawnDepth = 5) {
	return depth < maxSpawnDepth;
}
/** Resolves top-level agent concurrency, flooring finite values and clamping to at least one. */
function resolveAgentMaxConcurrent(cfg) {
	return resolveOptionalIntegerOption(cfg?.agents?.defaults?.maxConcurrent, { min: 1 }) ?? resolveDefaultAgentMaxConcurrent();
}
/** Resolves per-session subagent concurrency, flooring finite values and clamping to at least one. */
function resolveSubagentMaxConcurrent(cfg) {
	return resolveOptionalIntegerOption(cfg?.agents?.defaults?.subagents?.maxConcurrent, { min: 1 }) ?? 8;
}
//#endregion
export { resolveAgentMaxConcurrent as n, resolveSubagentMaxConcurrent as r, isSubagentSpawnDepthAllowed as t };
