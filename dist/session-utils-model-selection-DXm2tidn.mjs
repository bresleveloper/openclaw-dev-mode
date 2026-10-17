import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import "./session-key-C09ow4h0.mjs";
import { l as resolveSessionStorePathCore } from "./paths-dpReqUI8.mjs";
import { y as resolveSessionAgentIdsStrict } from "./agent-scope-CG17uXFn.mjs";
import { n as getRegisteredAgentHarness } from "./registry-BrXrewXj.mjs";
import { t as AgentHarnessPreflightError } from "./errors-Bd6GQRkh.mjs";
import { h as resolveSessionPinnedHarnessId } from "./agent-harness-session-key-D8EQIzja.mjs";
import { o as loadSessionEntryReadOnly } from "./session-accessor.sqlite-entry-DjT1nXRD.mjs";
import "./session-accessor-CQ-g9yb2.mjs";
import { r as resolveStoredModelOverrideCore } from "./stored-model-overrides-C9b7mZbZ.mjs";
import { r as resolveSessionModelRefCore } from "./session-model-ref-xnA7gN4_.mjs";
//#region src/agents/harness/session-runtime-ownership.ts
/** Reads private ownership for a caller-supplied authoritative session, never a pin heuristic. */
function readSessionRuntimeOwnership(params) {
	const entry = params.sessionEntry;
	const sessionId = entry?.sessionId;
	const harnessId = resolveSessionPinnedHarnessId(entry);
	if (!sessionId || !harnessId) return;
	const harness = getRegisteredAgentHarness(harnessId)?.harness;
	if (!harness?.resolveSessionRuntimeOwnership) return;
	const { config, agentId, sessionKey, storePath } = params;
	let active = true;
	const assertCurrent = () => {
		params.assertCurrent?.();
		if (!active || getRegisteredAgentHarness(harnessId)?.harness !== harness || entry?.sessionId !== sessionId || resolveSessionPinnedHarnessId(entry) !== harnessId) throw new AgentHarnessPreflightError("Native session ownership changed while reading its runtime. Reattach the original native session before retrying.");
	};
	try {
		assertCurrent();
		const ownership = harness.resolveSessionRuntimeOwnership({
			config,
			agentId,
			sessionId,
			sessionKey,
			storePath,
			readPreviousSessionId: () => {
				assertCurrent();
				const key = sessionKey?.trim();
				if (!key) return;
				const { sessionAgentId } = resolveSessionAgentIdsStrict({
					config,
					agentId,
					sessionKey
				});
				const current = loadSessionEntryReadOnly({
					agentId: sessionAgentId,
					sessionKey: key,
					storePath: storePath?.trim() || resolveSessionStorePathCore(config?.session?.store, { agentId: sessionAgentId }),
					hydrateSkillPromptRefs: false,
					readConsistency: "latest"
				});
				assertCurrent();
				return current?.sessionId === sessionId ? current.previousSessionId : void 0;
			},
			assertCurrent
		});
		assertCurrent();
		return ownership ? {
			...ownership,
			...ownership.modelRef ? { modelRef: { ...ownership.modelRef } } : {}
		} : void 0;
	} finally {
		active = false;
	}
}
//#endregion
//#region src/gateway/session-utils-model-selection.ts
function resolveSessionSelectedModelRef(params) {
	const ownership = readSessionRuntimeOwnership({
		config: params.cfg,
		agentId: params.agentId,
		sessionKey: params.sessionKey,
		sessionEntry: params.source.entry
	});
	if (ownership?.modelRef) return {
		...ownership.modelRef,
		storedOverrideSource: null
	};
	const defaultKey = JSON.stringify([normalizeAgentId(params.agentId), params.allowPluginNormalization !== false]);
	let configuredDefault = params.rowContext?.configuredDefaultModelByAgent.get(defaultKey);
	if (!configuredDefault) {
		configuredDefault = resolveSessionModelRefCore(params.cfg, void 0, params.agentId, {
			allowPluginNormalization: params.allowPluginNormalization,
			manifestPlugins: params.manifestPlugins
		});
		params.rowContext?.configuredDefaultModelByAgent.set(defaultKey, configuredDefault);
	}
	const storedOverride = resolveStoredModelOverrideCore({
		loadSessionEntry: params.source.readSourceEntry,
		sessionEntry: params.source.entry,
		sessionKey: params.sessionKey,
		parentSessionKey: params.source.entry?.parentSessionKey,
		defaultProvider: configuredDefault.provider,
		allowPluginNormalization: params.allowPluginNormalization,
		manifestPlugins: params.manifestPlugins
	});
	if (!storedOverride) return {
		...configuredDefault,
		storedOverrideSource: null
	};
	return {
		provider: storedOverride.provider ?? configuredDefault.provider,
		model: storedOverride.model,
		storedOverrideSource: storedOverride.source
	};
}
//#endregion
export { readSessionRuntimeOwnership as n, resolveSessionSelectedModelRef as t };
