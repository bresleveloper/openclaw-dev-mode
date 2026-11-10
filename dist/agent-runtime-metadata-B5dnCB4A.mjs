import { r as isDefaultAgentRuntimeId } from "./agent-runtime-id-BZLMe-UU.mjs";
import { t as resolveDefaultModelForAgent } from "./model-selection-config-CrboVKXT.mjs";
import { n as resolveAvailableAgentHarnessPolicy } from "./availability-CUqXgij4.mjs";
import "./model-selection-DdQ-ffuG.mjs";
import { i as resolveSessionRuntimeOverrideForProvider, r as resolvePersistedSessionRuntimeId } from "./session-runtime-compat-BQN27lQg.mjs";
//#region src/agents/acp-runtime-overlay.ts
/** Persisted ACP ownership is authoritative even for ordinary session keys. */
function applyAcpRuntimeOverlay(meta, acpRuntime, acpBackend) {
	if (acpRuntime === true) return {
		id: acpBackend && acpBackend.length > 0 ? acpBackend : "acpx",
		source: "session-key"
	};
	return meta;
}
//#endregion
//#region src/agents/agent-runtime-metadata.ts
/** Resolves the runtime id/source that should be reported for a model-backed agent session. */
function resolveModelAgentRuntimeMetadata(params) {
	const persistedRuntimeId = resolvePersistedSessionRuntimeId(params.sessionEntry);
	if (persistedRuntimeId && !isDefaultAgentRuntimeId(persistedRuntimeId)) return applyAcpRuntimeOverlay({
		id: persistedRuntimeId,
		source: "session"
	}, params.acpRuntime, params.acpBackend);
	const agentId = params.agentScope ? params.agentScope.agentId : params.agentId;
	const resolved = params.provider && params.model ? {
		provider: params.provider,
		model: params.model
	} : resolveDefaultModelForAgent({
		cfg: params.cfg,
		agentId
	});
	const policy = resolveAvailableAgentHarnessPolicy({
		...params,
		mode: "projection",
		provider: resolved.provider,
		modelId: resolved.model,
		config: params.cfg,
		sessionKey: params.sessionKey,
		agentHarnessRuntimeOverride: params.agentHarnessRuntimeOverride
	});
	return applyAcpRuntimeOverlay({
		id: policy.runtime,
		source: policy.runtimeSource ?? "implicit"
	}, params.acpRuntime, params.acpBackend);
}
/** Resolves the runtime selected for the next turn, excluding historical producer metadata. */
function resolveCurrentSessionAgentRuntimeMetadata(params) {
	const { sessionEntry, ...configuredParams } = params;
	const sessionRuntime = resolveSessionRuntimeOverrideForProvider({
		provider: params.provider,
		entry: sessionEntry,
		cfg: params.cfg
	});
	if (params.acpRuntime || !sessionRuntime) return resolveModelAgentRuntimeMetadata(configuredParams);
	return {
		id: resolveModelAgentRuntimeMetadata({
			...configuredParams,
			...sessionEntry?.modelSelectionLocked === true ? { sessionEntry } : { agentHarnessRuntimeOverride: sessionRuntime }
		}).id,
		source: sessionEntry?.modelSelectionLocked === true ? "session" : "session-key"
	};
}
//#endregion
export { resolveModelAgentRuntimeMetadata as n, resolveCurrentSessionAgentRuntimeMetadata as t };
