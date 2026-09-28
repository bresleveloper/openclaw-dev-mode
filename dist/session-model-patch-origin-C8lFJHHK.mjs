import { n as resolveSessionModelRef } from "./session-model-ref-DGVV7laa.mjs";
import { AsyncLocalStorage } from "node:async_hooks";
//#region src/config/sessions/session-model-fallback.ts
function createAgentPatchedSessionModelFallback(params) {
	const { entry } = params;
	return {
		prevModel: params.model,
		prevProvider: params.provider,
		...entry.modelOverride ? { prevModelOverride: entry.modelOverride } : {},
		...entry.providerOverride ? { prevProviderOverride: entry.providerOverride } : {},
		...entry.modelOverrideSource ? { prevModelOverrideSource: entry.modelOverrideSource } : {},
		...entry.modelOverrideRouteResolution ? { prevModelOverrideRouteResolution: entry.modelOverrideRouteResolution } : {},
		...entry.modelOverrideFallbackOriginProvider ? { prevModelOverrideFallbackOriginProvider: entry.modelOverrideFallbackOriginProvider } : {},
		...entry.modelOverrideFallbackOriginModel ? { prevModelOverrideFallbackOriginModel: entry.modelOverrideFallbackOriginModel } : {},
		...entry.authProfileOverride ? { prevAuthProfileOverride: entry.authProfileOverride } : {},
		...entry.authProfileOverrideSource ? { prevAuthProfileOverrideSource: entry.authProfileOverrideSource } : {},
		...entry.authProfileOverrideCompactionCount !== void 0 ? { prevAuthProfileOverrideCompactionCount: entry.authProfileOverrideCompactionCount } : {},
		...entry.contextWindow ? { prevContextWindow: entry.contextWindow } : {},
		...entry.thinkingLevel ? { prevThinkingLevel: entry.thinkingLevel } : {},
		ts: params.ts,
		source: "agent-patch"
	};
}
//#endregion
//#region src/gateway/session-model-patch-origin.ts
const agentSessionModelPatch = new AsyncLocalStorage();
function withAgentSessionModelPatchOrigin(run) {
	return agentSessionModelPatch.run({ kind: "agent" }, run);
}
async function withSessionStatusModelPatchOrigin(run) {
	const origin = {
		kind: "session-status",
		applied: false
	};
	return {
		result: await agentSessionModelPatch.run(origin, run),
		applied: origin.applied
	};
}
function isAgentSessionModelPatchOrigin() {
	return agentSessionModelPatch.getStore()?.kind === "agent";
}
/** Status selections remain per-session and do not establish an automatic fallback. */
function isSessionStatusModelPatchOrigin() {
	return agentSessionModelPatch.getStore()?.kind === "session-status";
}
/** Only the mutation owner records whether the scoped selection committed a change. */
function recordSessionStatusModelPatchOutcome(applied) {
	const origin = agentSessionModelPatch.getStore();
	if (origin?.kind === "session-status") origin.applied ||= applied;
}
function snapshotAgentModelFallback(cfg, entry, agentId, now) {
	const prior = resolveSessionModelRef(cfg, entry, agentId);
	return createAgentPatchedSessionModelFallback({
		model: prior.model,
		provider: prior.provider,
		entry,
		ts: now
	});
}
//#endregion
export { withAgentSessionModelPatchOrigin as a, snapshotAgentModelFallback as i, isSessionStatusModelPatchOrigin as n, withSessionStatusModelPatchOrigin as o, recordSessionStatusModelPatchOutcome as r, createAgentPatchedSessionModelFallback as s, isAgentSessionModelPatchOrigin as t };
