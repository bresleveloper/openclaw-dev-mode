import { y as isAcpSessionKey } from "./session-key-CBvmC8zz.mjs";
import { r as isDefaultAgentRuntimeId } from "./agent-runtime-id-9mBje111.mjs";
import { t as resolveDefaultModelForAgent } from "./model-selection-config-DZ4sk4C2.mjs";
import "./model-selection-CaFyCMqp.mjs";
import { n as resolveAvailableAgentHarnessPolicy } from "./availability-CUZDnZeh.mjs";
import { i as resolveSessionRuntimeOverrideForProvider, r as resolvePersistedSessionRuntimeId } from "./session-runtime-compat-DmCrQjUt.mjs";
//#region src/agents/acp-runtime-overlay.ts
/** Applies ACP session-key metadata overrides to agent runtime classification. */
/**
* When a session key and persisted session metadata identify an ACP
* control-plane session, override the resolved runtime metadata to report the
* ACP runtime id with a "session-key" source — regardless of what the
* agent-config policy resolved to.
*
* Callers that already have model/provider context (resolveModelAgentRuntimeMetadata)
* still benefit here because the model-runtime policy chain does not inspect session
* keys for the ACP indicator.
*
* Key shape alone is not sufficient: ACP bridge sessions may use ACP-shaped
* keys without persisted SessionAcpMeta and still run the configured model.
*
* When `acpBackend` is provided and non-empty, it is used as the runtime id so that
* sessions backed by a configured non-default ACP backend (e.g. a custom registered
* backend) are reported faithfully instead of always being labelled "acpx".
* Falls back to "acpx" when no backend is known.
*/
function applyAcpRuntimeOverlay(meta, sessionKey, acpRuntime, acpBackend) {
	if (acpRuntime === true && isAcpSessionKey(sessionKey)) return {
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
	}, params.sessionKey, params.acpRuntime, params.acpBackend);
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
	}, params.sessionKey, params.acpRuntime, params.acpBackend);
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
