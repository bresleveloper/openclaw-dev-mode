import { c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
import "./agent-scope-B2Pk_xhT.js";
import { u as normalizeAgentId } from "./session-key-VWT_xzM9.js";
import { c as resolveDefaultAgentId, r as resolveAgentConfig, t as listAgentEntries } from "./agent-scope-config-BxAUeF6t.js";
import { t as parseDurationMs } from "./parse-duration-D33cPjCs.js";
import { l as resolveHeartbeatPrompt } from "./heartbeat-Butmf3AR.js";
//#region src/agents/heartbeat-system-prompt.ts
/**
* Builds heartbeat-specific guidance for agent system prompts.
*/
function resolveHeartbeatConfigForSystemPrompt(config, agentId) {
	const defaults = config?.agents?.defaults?.heartbeat;
	if (!config || !agentId) return defaults;
	const overrides = resolveAgentConfig(config, agentId)?.heartbeat;
	if (!defaults && !overrides) return overrides;
	return {
		...defaults,
		...overrides
	};
}
function isHeartbeatEnabledByAgentPolicy(config, agentId) {
	const resolvedAgentId = normalizeAgentId(agentId);
	const agents = listAgentEntries(config);
	if (agents.some((entry) => Boolean(entry?.heartbeat))) return agents.some((entry) => Boolean(entry?.heartbeat) && normalizeAgentId(entry.id) === resolvedAgentId);
	return resolvedAgentId === resolveDefaultAgentId(config);
}
function isHeartbeatCadenceEnabled(heartbeat) {
	const trimmedEvery = normalizeOptionalString(heartbeat?.every ?? "30m") ?? "";
	if (!trimmedEvery) return false;
	try {
		return parseDurationMs(trimmedEvery, { defaultUnit: "m" }) > 0;
	} catch {
		return false;
	}
}
/** Returns true when heartbeat guidance should be included in the system prompt. */
function shouldIncludeHeartbeatGuidanceForSystemPrompt(params) {
	const defaultAgentId = params.defaultAgentId ?? resolveDefaultAgentId(params.config ?? {});
	const agentId = params.agentId ?? defaultAgentId;
	if (!agentId || normalizeAgentId(agentId) !== normalizeAgentId(defaultAgentId)) return false;
	if (params.config && !isHeartbeatEnabledByAgentPolicy(params.config, agentId)) return false;
	const heartbeat = resolveHeartbeatConfigForSystemPrompt(params.config, agentId);
	if (heartbeat?.includeSystemPromptSection === false) return false;
	return isHeartbeatCadenceEnabled(heartbeat);
}
/** Resolves the heartbeat system prompt section for the selected/default agent. */
function resolveHeartbeatPromptForSystemPrompt(params) {
	const agentId = params.agentId ?? params.defaultAgentId ?? resolveDefaultAgentId(params.config ?? {});
	const heartbeat = resolveHeartbeatConfigForSystemPrompt(params.config, agentId);
	if (!shouldIncludeHeartbeatGuidanceForSystemPrompt(params)) return;
	return resolveHeartbeatPrompt(heartbeat?.prompt);
}
//#endregion
export { shouldIncludeHeartbeatGuidanceForSystemPrompt as n, resolveHeartbeatPromptForSystemPrompt as t };
