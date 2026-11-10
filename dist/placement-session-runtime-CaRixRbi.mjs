import { a as captureRuntimeStateEnvironment } from "./paths-orClZ-2Z.mjs";
import { p as getActivePluginRegistryWorkspaceDirFromStateCore } from "./model-ref-shared-BRJ3VRZV.mjs";
import { n as captureOpenClawStateReadWorkerContext } from "./openclaw-state-worker-context-BDhKaXgP.mjs";
import { i as isIncognitoSessionKey } from "./incognito-session-key-BWpn88lo.mjs";
import { M as parseAgentSessionKey } from "./session-key-CSDERtm3.mjs";
import { v as resolveEffectiveAgentDir } from "./agent-scope-config-fjA2T9Gz.mjs";
import { n as prepareBundledDiscoveryMode } from "./bundled-discovery-state-Bb6gGYEi.mjs";
import { l as withPluginMetadataSnapshotScope } from "./current-plugin-metadata-snapshot-BK2DY7Lo.mjs";
import { d as resolvePluginMetadataSnapshotAsync } from "./plugin-metadata-snapshot-DET-4y9k.mjs";
import { u as resolveSharedAuthStoreOwnershipAsync } from "./path-resolve-21Orzn6B.mjs";
import { t as resolveDefaultModelForAgent } from "./model-selection-config-CrboVKXT.mjs";
import { c as withSessionEntriesFromStoresInWorker } from "./session-entry-read-runtime-CgqUrGct.mjs";
import { s as resolveStoredSessionKeyForAgentStore } from "./session-store-key-DKpto8R6.mjs";
import { h as resolveSessionPinnedHarnessId } from "./agent-harness-session-key-zbrcLVpT.mjs";
import { r as resolveGatewaySessionStoreTargetInWorker } from "./session-utils-store-worker-u3lCvEEg.mjs";
import { n as getRegisteredAgentHarness } from "./registry-BDZ8eM01.mjs";
import { t as isCliProvider } from "./model-selection-cli-CxV7VRIV.mjs";
import { i as resolveLegacyInheritedAuthAgentId } from "./legacy-inherited-auth-dir-BO2hiLXD.mjs";
import { c as resolveCliRuntimeExecutionProvider } from "./model-runtime-aliases-DJRpB3Nd.mjs";
import { i as resolveSessionRuntimeOverrideForProvider } from "./session-runtime-compat-BQN27lQg.mjs";
import { t as resolveSessionConfiguredDefault } from "./session-model-ref-BTkDCi12.mjs";
import { o as resolveEffectiveAgentRuntime } from "./thinking-runtime-DuxsJR5q.mjs";
import { i as readSessionRuntimeOwnershipAsync, t as resolveSessionSelectedModelRef } from "./session-utils-model-selection-pzj_r9Dj.mjs";
import { t as captureSessionEntryMetadataRead } from "./session-entry-source-authority-CY_NaTk4.mjs";
import { r as resolveStoredModelOverrideAsync } from "./stored-model-overrides-RKQxlZXm.mjs";
import { t as resolveWorkerPlacementCapabilities } from "./placement-capabilities-B7Dg_n0B.mjs";
//#region src/gateway/worker-environments/placement-session-runtime.ts
function resolveWorkerPlacementSessionRuntime(params) {
	const { provider, model } = resolveSessionSelectedModelRef({
		...params,
		preparedRuntimeOwnership: params.preparedRuntimeOwnership,
		source: {
			entry: params.entry,
			readSourceEntry: params.readSourceEntry
		}
	});
	return resolveWorkerPlacementModelRuntime({
		...params,
		provider,
		model
	});
}
async function resolveWorkerPlacementSessionRuntimeAsync(params) {
	const preparedEnvironment = captureRuntimeStateEnvironment();
	const workspaceDir = getActivePluginRegistryWorkspaceDirFromStateCore();
	const [metadataSnapshot, activateDiscovery] = await Promise.all([
		resolvePluginMetadataSnapshotAsync({
			config: params.cfg,
			env: preparedEnvironment,
			...workspaceDir ? { workspaceDir } : {},
			allowWorkspaceScopedCurrent: true
		}),
		prepareBundledDiscoveryMode(preparedEnvironment),
		resolveSharedAuthStoreOwnershipAsync(captureOpenClawStateReadWorkerContext({ env: preparedEnvironment }))
	]);
	params.assertCurrent?.();
	activateDiscovery();
	return withPluginMetadataSnapshotScope(metadataSnapshot, async () => {
		const ownership = await readSessionRuntimeOwnershipAsync({
			config: params.cfg,
			agentId: params.agentId,
			sessionKey: params.sessionKey,
			sessionEntry: params.entry,
			assertCurrent: params.assertCurrent,
			readPreparedPreviousSessionId: () => params.entry.previousSessionId
		});
		params.assertCurrent?.();
		const configured = ownership?.modelRef ?? resolveSessionConfiguredDefault(params.cfg, params.agentId);
		const storedOverride = ownership?.modelRef ? null : await resolveStoredModelOverrideAsync({
			sessionEntry: params.entry,
			sessionKey: params.sessionKey,
			parentSessionKey: params.entry.parentSessionKey,
			defaultProvider: configured.provider,
			loadSessionEntry: params.readSourceEntry ?? ((key) => readWorkerPlacementModelSource(params, key))
		});
		params.assertCurrent?.();
		return resolveWorkerPlacementModelRuntime({
			...params,
			provider: storedOverride?.provider ?? configured.provider,
			model: storedOverride?.model ?? configured.model,
			preparedRuntimeOwnership: ownership ?? null,
			preparedEnvironment,
			metadataSnapshot
		});
	}, {
		config: params.cfg,
		env: preparedEnvironment,
		...workspaceDir ? { workspaceDir } : {}
	});
}
/** Preserve qualified parent precedence and sentinel physical ownership during async selection. */
async function readWorkerPlacementModelSource(params, key) {
	const metadata = captureSessionEntryMetadataRead({
		sessionKey: key,
		agentId: params.agentId
	}, () => params.assertCurrent?.());
	if (metadata) return metadata.readCurrent();
	if (key === "global" || key === "unknown") {
		const target = params.initialTarget ?? await resolveGatewaySessionStoreTargetInWorker({
			cfg: params.cfg,
			agentId: params.agentId,
			key: params.sessionKey,
			assertActive: params.assertCurrent
		});
		return await withSessionEntriesFromStoresInWorker([{
			agentId: target.readSource?.agentId ?? target.agentId,
			storePath: target.readSource?.path ?? target.storePath,
			sessionKeys: [key],
			projection: "exact"
		}], ([read]) => {
			params.assertCurrent?.();
			return read.result.entries.find((row) => row.sessionKey === key)?.entry;
		});
	}
	const agentId = parseAgentSessionKey(key)?.agentId ?? params.agentId;
	const storedKey = resolveStoredSessionKeyForAgentStore({
		cfg: params.cfg,
		agentId,
		sessionKey: key,
		preserveQualifiedAddress: true
	});
	const entry = (await resolveGatewaySessionStoreTargetInWorker({
		cfg: params.cfg,
		agentId,
		key: storedKey,
		preserveQualifiedAddress: true,
		assertActive: params.assertCurrent
	})).store[storedKey];
	if (entry || isIncognitoSessionKey(storedKey)) return entry;
	if (resolveStoredSessionKeyForAgentStore({
		cfg: params.cfg,
		agentId,
		sessionKey: key
	}) === storedKey) return;
	const aliased = await resolveGatewaySessionStoreTargetInWorker({
		cfg: params.cfg,
		agentId: params.agentId,
		key,
		assertActive: params.assertCurrent
	});
	return aliased.store[aliased.canonicalKey];
}
function resolveWorkerPlacementModelRuntime(params) {
	const sessionRuntimeOverride = resolveSessionRuntimeOverrideForProvider(params);
	if (params.cfg.cloudWorkers?.requiredProfile) return "openclaw";
	const pinnedHarnessId = resolveSessionPinnedHarnessId(params.entry);
	const pinnedCliRuntime = !(pinnedHarnessId !== void 0 && pinnedHarnessId === sessionRuntimeOverride) && sessionRuntimeOverride && isCliProvider(sessionRuntimeOverride, params.cfg, params.metadataSnapshot) ? sessionRuntimeOverride : void 0;
	const cliExecutionProvider = pinnedCliRuntime ?? (sessionRuntimeOverride ? void 0 : resolveCliRuntimeExecutionProvider({
		...params,
		metadataSnapshot: params.metadataSnapshot === null ? { plugins: [] } : params.metadataSnapshot,
		modelId: params.model,
		authProfileId: params.entry.authProfileOverride,
		preparedAuthDirectories: {
			env: params.preparedEnvironment ?? captureRuntimeStateEnvironment(),
			get agentDir() {
				return resolveEffectiveAgentDir(params.cfg, params.agentId, { env: this.env });
			},
			get inheritedAuthDir() {
				return resolveEffectiveAgentDir(params.cfg, resolveLegacyInheritedAuthAgentId(params.cfg), { env: this.env });
			}
		}
	}));
	return pinnedCliRuntime !== void 0 || !sessionRuntimeOverride && isCliProvider(cliExecutionProvider ?? params.provider, params.cfg, params.metadataSnapshot) ? cliExecutionProvider ?? params.provider : resolveEffectiveAgentRuntime({
		cfg: params.cfg,
		provider: params.provider,
		modelId: params.model,
		agentScope: {
			kind: "prepared",
			agentId: params.agentId
		},
		sessionKey: params.sessionKey,
		sessionEntry: params.entry
	});
}
function resolveWorkerPlacementExecutionMode(runtime) {
	return resolveWorkerPlacementCapabilities(runtime).executionMode;
}
/** Projects the same configured runtime choice a new default-model dashboard session will persist. */
function resolveDefaultWorkerPlacementExecutionMode(params) {
	const { provider, model } = resolveDefaultModelForAgent(params);
	return resolveWorkerPlacementExecutionMode(resolveWorkerPlacementModelRuntime({
		...params,
		provider,
		model,
		entry: {
			sessionId: "prepared-pool-presence",
			updatedAt: 0
		},
		sessionKey: `agent:${params.agentId}:dashboard:prepared-pool-presence`
	}));
}
function projectWorkerPlacementAgentRuntime(runtime) {
	const { source, workspaceEnvironment: _previousEnvironment, ...identity } = runtime;
	const { executionMode, devicePlacement } = resolveWorkerPlacementCapabilities(runtime.id);
	const workspaceEnvironment = getRegisteredAgentHarness(runtime.id)?.harness.workspaceEnvironment;
	return {
		...identity,
		...workspaceEnvironment ? { workspaceEnvironment } : {},
		cloudPlacementSupported: executionMode !== void 0,
		...executionMode ? { cloudPlacementExecutionMode: executionMode } : {},
		...devicePlacement ? { devicePlacement } : {},
		devicePlacementSupported: devicePlacement !== void 0,
		source
	};
}
//#endregion
export { resolveWorkerPlacementModelRuntime as a, resolveWorkerPlacementExecutionMode as i, readWorkerPlacementModelSource as n, resolveWorkerPlacementSessionRuntime as o, resolveDefaultWorkerPlacementExecutionMode as r, resolveWorkerPlacementSessionRuntimeAsync as s, projectWorkerPlacementAgentRuntime as t };
