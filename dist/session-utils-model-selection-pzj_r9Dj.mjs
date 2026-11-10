import { c as resolveSessionStorePathCore } from "./paths-YgcBNLgG.mjs";
import { t as warnPluginSdkDeprecation } from "./sdk-deprecation-DjTmOhOX.mjs";
import { v as resolveSessionAgentIdsStrict } from "./agent-scope-DXrnO3F4.mjs";
import { t as AgentHarnessPreflightError } from "./errors-BAipjK5G.mjs";
import { a as readCapturedSessionActorEntry, n as captureSessionActorStorageOwner } from "./session-actor-storage-binding-oCtbPk00.mjs";
import { i as readSessionEntryReadOnlyInWorker } from "./session-entry-read-runtime-CgqUrGct.mjs";
import { h as resolveSessionPinnedHarnessId } from "./agent-harness-session-key-zbrcLVpT.mjs";
import { n as getRegisteredAgentHarness } from "./registry-BDZ8eM01.mjs";
import { t as resolveSessionConfiguredDefault } from "./session-model-ref-BTkDCi12.mjs";
import { i as resolveStoredModelOverrideCore } from "./stored-model-overrides-RKQxlZXm.mjs";
//#region src/agents/harness/session-runtime-ownership.ts
var SessionRuntimeOwnershipChanged = class extends AgentHarnessPreflightError {};
function captureSessionRuntimeOwnershipRead(params) {
	const entry = params.sessionEntry;
	const sessionId = entry?.sessionId;
	const harnessId = resolveSessionPinnedHarnessId(entry);
	if (!sessionId || !harnessId) return;
	const harness = getRegisteredAgentHarness(harnessId)?.harness;
	if (!harness) return;
	const { agentId, sessionKey, storePath } = params;
	const privateSource = sessionKey ? captureSessionActorStorageOwner({
		agentId,
		sessionKey,
		storePath
	}, {
		assertCurrent() {
			params.assertCurrent?.();
		},
		authorize() {}
	}) : void 0;
	let active = true;
	const assertCurrent = () => {
		if (active) {
			params.assertCurrent?.();
			privateSource?.owner?.assertCurrent();
		}
		if (!active || getRegisteredAgentHarness(harnessId)?.harness !== harness || entry?.sessionId !== sessionId || resolveSessionPinnedHarnessId(entry) !== harnessId) throw new SessionRuntimeOwnershipChanged("Native session ownership changed while reading its runtime. Reattach the original native session before retrying.");
	};
	return {
		harness,
		sessionId,
		privateSource,
		assertCurrent,
		input: {
			config: params.config,
			agentId: params.agentId,
			sessionId,
			sessionKey: params.sessionKey,
			storePath: params.storePath,
			assertCurrent
		},
		readPreviousSessionId: () => {
			assertCurrent();
			if (params.readPreparedPreviousSessionId) {
				const previousSessionId = params.readPreparedPreviousSessionId();
				assertCurrent();
				return previousSessionId;
			}
			if (privateSource) {
				const key = sessionKey?.trim();
				const current = !key ? void 0 : readCapturedSessionActorEntry(privateSource, key);
				assertCurrent();
				return current?.sessionId === sessionId ? current.previousSessionId : void 0;
			}
			return entry?.previousSessionId;
		},
		finish(ownership) {
			assertCurrent();
			return ownership ? {
				...ownership,
				...ownership.modelRef ? { modelRef: { ...ownership.modelRef } } : {}
			} : void 0;
		},
		close() {
			active = false;
		}
	};
}
function previousSessionReadScope(params) {
	const { config, agentId, sessionKey, storePath } = params;
	const key = sessionKey?.trim();
	if (!key) return;
	const { sessionAgentId } = resolveSessionAgentIdsStrict({
		config,
		agentId,
		sessionKey
	});
	return {
		agentId: sessionAgentId,
		sessionKey: key,
		storePath: storePath?.trim() || resolveSessionStorePathCore(config?.session?.store, { agentId: sessionAgentId }),
		hydrateSkillPromptRefs: false,
		readConsistency: "latest"
	};
}
/** Retained native adapter for final authority checks and the released synchronous hook. */
function readSessionRuntimeOwnership(params) {
	const read = captureSessionRuntimeOwnershipRead(params);
	if (!read) return;
	const { harness, assertCurrent } = read;
	try {
		assertCurrent();
		if (harness.resolveSessionRuntimeOwnership) warnPluginSdkDeprecation({
			family: "agent-harness-session-runtime-ownership",
			method: "AgentHarness.resolveSessionRuntimeOwnership",
			replacement: "AgentHarness.resolveSessionRuntimeOwnershipAsync",
			pluginId: getRegisteredAgentHarness(harness.id)?.ownerPluginId,
			compatibility: "The synchronous hook remains available for released plugins and final authority checks."
		});
		return read.finish(harness.resolveSessionRuntimeOwnership?.({
			...read.input,
			readPreviousSessionId: read.readPreviousSessionId,
			assertCurrent
		}));
	} finally {
		read.close();
	}
}
/** Prefer the worker-owned contract; the released synchronous hook is a selected legacy adapter. */
async function readSessionRuntimeOwnershipAsync(params) {
	const read = captureSessionRuntimeOwnershipRead(params);
	if (!read) return;
	const { harness, sessionId, privateSource, assertCurrent } = read;
	const resolveOwnership = harness.resolveSessionRuntimeOwnershipAsync?.bind(harness);
	if (!resolveOwnership) {
		read.close();
		return readSessionRuntimeOwnership(params);
	}
	try {
		assertCurrent();
		const ownership = await resolveOwnership({
			...read.input,
			version: 2,
			readPreviousSessionId: async () => {
				assertCurrent();
				if (params.readPreparedPreviousSessionId || privateSource) return read.readPreviousSessionId();
				const scope = previousSessionReadScope(params);
				const current = scope ? await readSessionEntryReadOnlyInWorker(scope, assertCurrent) : void 0;
				assertCurrent();
				return current?.sessionId === sessionId ? current.previousSessionId : void 0;
			},
			assertCurrent
		});
		return read.finish(ownership);
	} finally {
		read.close();
	}
}
//#endregion
//#region src/gateway/session-utils-model-selection.ts
function resolveSessionSelectedModelRef(params) {
	const ownership = params.preparedRuntimeOwnership === void 0 ? readSessionRuntimeOwnership({
		config: params.cfg,
		agentId: params.agentId,
		sessionKey: params.sessionKey,
		sessionEntry: params.source.entry
	}) : params.preparedRuntimeOwnership;
	if (ownership?.modelRef) return {
		...ownership.modelRef,
		storedOverrideSource: null
	};
	const configuredDefault = resolveSessionConfiguredDefault(params.cfg, params.agentId, {
		allowPluginNormalization: params.allowPluginNormalization,
		manifestPlugins: params.manifestPlugins,
		configuredDefaultModelByAgent: params.rowContext?.configuredDefaultModelByAgent
	});
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
/** Ordinary preparation reads native ownership through the harness's worker-owned contract. */
async function resolveSessionSelectedModelRefAsync(params) {
	const ownership = await readSessionRuntimeOwnershipAsync({
		config: params.cfg,
		agentId: params.agentId,
		sessionKey: params.sessionKey,
		sessionEntry: params.source.entry,
		assertCurrent: params.assertCurrent
	});
	params.assertCurrent?.();
	return resolveSessionSelectedModelRef({
		...params,
		preparedRuntimeOwnership: ownership ?? null
	});
}
//#endregion
export { readSessionRuntimeOwnershipAsync as i, resolveSessionSelectedModelRefAsync as n, SessionRuntimeOwnershipChanged as r, resolveSessionSelectedModelRef as t };
