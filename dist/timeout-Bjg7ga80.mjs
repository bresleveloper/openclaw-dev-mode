import { N as resolveOptionalIntegerOption, m as clampTimerTimeoutMs, n as MAX_TIMER_TIMEOUT_MS } from "./number-coercion-CLj0HTDM.mjs";
//#region src/agents/timeout.ts
/**
* Agent run timeout resolver.
*
* Converts config and per-run overrides into timer-safe millisecond deadlines.
*/
const DEFAULT_AGENT_TIMEOUT_SECONDS = 172800;
const DEFAULT_AGENT_TIMEOUT_MS = DEFAULT_AGENT_TIMEOUT_SECONDS * 1e3;
const NO_TIMEOUT_MS = MAX_TIMER_TIMEOUT_MS;
function resolveAgentTimeoutMs(opts) {
	const minMs = Math.max(resolveOptionalIntegerOption(opts.minMs) ?? 1, 1);
	const clampTimeoutMs = (valueMs) => clampTimerTimeoutMs(valueMs, minMs) ?? minMs;
	const seconds = resolveOptionalIntegerOption(opts.cfg?.agents?.defaults?.timeoutSeconds) ?? DEFAULT_AGENT_TIMEOUT_SECONDS;
	const defaultMs = seconds === 0 ? NO_TIMEOUT_MS : clampTimeoutMs(Math.max(seconds, 1) * 1e3);
	const overrideMs = resolveOptionalIntegerOption(opts.overrideMs);
	if (overrideMs !== void 0) {
		if (overrideMs === 0) return NO_TIMEOUT_MS;
		if (overrideMs < 0) return defaultMs;
		return clampTimeoutMs(overrideMs);
	}
	const overrideSeconds = resolveOptionalIntegerOption(opts.overrideSeconds);
	if (overrideSeconds !== void 0) {
		if (overrideSeconds === 0) return NO_TIMEOUT_MS;
		if (overrideSeconds < 0) return defaultMs;
		return clampTimeoutMs(overrideSeconds * 1e3);
	}
	return defaultMs;
}
//#endregion
export { resolveAgentTimeoutMs as n, DEFAULT_AGENT_TIMEOUT_MS as t };
