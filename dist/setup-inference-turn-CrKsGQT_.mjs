import { t as AsyncWorkScope } from "./async-work-scope-BYeX3gh6.mjs";
import { D as withPluginCache, a as createPluginCache } from "./plugin-cache-BABafcXD.mjs";
import { h as parseSecretRef } from "./types.secrets-DsPRn9Dz.mjs";
import { t as formatErrorMessage } from "./errors-O33D01XW.mjs";
import { t as _usingCtx } from "./usingCtx-DwOBYOJf.mjs";
import { d as resolveAgentWorkspaceDir } from "./agent-scope-config-CDYpzA0r.mjs";
import { i as loadInstalledPluginIndex } from "./installed-plugin-index-Zl-RSskC.mjs";
import { i as loadInstalledPluginIndexInstallRecordsSync } from "./installed-plugin-index-record-reader-C4Wdbs53.mjs";
import { u as resolvePluginMetadataSnapshot } from "./plugin-metadata-snapshot-6weqkLDz.mjs";
import "./agent-scope-CG17uXFn.mjs";
import { i as resolveProviderIdForAuth } from "./provider-auth-aliases-15nvbxqy.mjs";
import { r as getPluginRegistryForContext } from "./gateway-request-scope-BSmCVVpP.mjs";
import { a as clearAgentRunContext, y as registerAgentRunContext } from "./agent-run-registry-BaxMDLZF.mjs";
import { n as withPluginRuntimeGenerationScope } from "./generation-scope-BNE7YdYW.mjs";
import { i as isMissingSecretRefResolutionError } from "./resolve-errors-DYenvPyo.mjs";
import { f as restoreAuthProfileStorePersistenceSnapshot, n as captureAuthProfileStorePersistenceSnapshot, u as resolvePersistedAuthProfileOwnerAgentDir } from "./store-SwwRUDrm.mjs";
import { P as getRuntimeAuthProfileStoreCredentialMutationToken, c as getRuntimeAuthProfileStoreCredentialsRevision } from "./runtime-snapshots-CSLjByUx.mjs";
import { i as getPluginRuntimeLoadContext } from "./load-context-Bf_u2yr8.mjs";
import { d as prepareSystemAgentRunAdmission } from "./admitted-run-context-QJnFIxUZ.mjs";
import { u as withSetupCredentialAccess } from "./order-B7W96aON.mjs";
import { d as saveAuthProfileStoreIfPersistenceSnapshotMatches, l as loadAuthProfileStoreWithoutExternalProfiles, o as loadAuthProfileStoreForRuntime } from "./store-runtime-CzCCJ_Oe.mjs";
import { n as loadAgentRuntimePluginRegistryHandle } from "./runtime-plugins-CKN1sUTv.mjs";
import { t as buildAgentRuntimeAuthPlan } from "./auth-BP0sUc83.mjs";
import { t as SessionManager } from "./session-manager-B2n0aSnK.mjs";
import "./sessions-DVbpm5GD.mjs";
import { a as sameDefaultInferenceRoute, i as resolveSystemAgentConfiguredRouteFromConfig, r as projectInferenceRoute } from "./inference-route-D8mI3-Om.mjs";
import { _ as resolveToolFreeCliSetupError, a as SetupInferenceCancelledError, c as invalidSetupConfigError, f as redactSetupInferenceError, l as parseInferenceRef, m as resolveSetupInferenceWinnerError, o as SetupInferenceOwnerDriftError, s as describeSetupInferenceError, v as setupInferenceLog, y as throwIfSetupInferenceCancelled } from "./setup-inference-core-DRaaZAu8.mjs";
import { a as resolveSystemAgentVerifiedInferenceRoute, n as createSystemAgentVerifiedInferenceBinding, r as hasCurrentSystemAgentOwnerPluginArtifacts, t as captureSystemAgentOwnerPluginArtifacts } from "./verified-inference-BLAb2uCx.mjs";
import { i as extractAgentRunText, r as extractAgentRunTerminalError } from "./agent-run-result-BvkKJ5Uv.mjs";
import path from "node:path";
import fs from "node:fs/promises";
import os from "node:os";
import { isDeepStrictEqual } from "node:util";
import { randomUUID } from "node:crypto";
//#region src/system-agent/setup-inference-credential-access.ts
/** Prepares one selected account without publishing a candidate runtime. */
async function withPreparedSetupCredentialAccess(ctx, staged, profileId, verify, failure) {
	const { params } = ctx;
	const access = {
		profileId,
		agentDir: ctx.agentDir,
		signal: params.signal
	};
	return await withSetupCredentialAccess(access, async () => {
		const credentialsRevision = getRuntimeAuthProfileStoreCredentialsRevision();
		const credential = loadAuthProfileStoreWithoutExternalProfiles(ctx.agentDir).profiles[profileId];
		const refInput = credential?.type === "api_key" ? credential.keyRef ?? credential.key : credential?.type === "token" ? credential.tokenRef ?? credential.token : void 0;
		const ref = parseSecretRef(refInput, staged.config.secrets?.defaults);
		if (!credential || !ref) return await verify();
		const source = structuredClone(credential);
		const { prepareSecretsRuntimeSnapshot } = await import("./runtime-D0jb4vxR.mjs");
		const assertOriginalGeneration = () => {
			if (credentialsRevision !== getRuntimeAuthProfileStoreCredentialsRevision()) throw new SetupInferenceOwnerDriftError("The saved credential changed during preparation. Retry this sign-in in Model Setup.");
		};
		assertOriginalGeneration();
		let prepared;
		try {
			prepared = await prepareSecretsRuntimeSnapshot({
				config: staged.config,
				agentDirs: [ctx.agentDir],
				includeConfigRefs: false,
				loadAuthStore: () => ({
					version: 1,
					profiles: { [profileId]: structuredClone(source) }
				})
			});
		} catch (error) {
			if (!isMissingSecretRefResolutionError({
				ref,
				error
			})) throw error;
			throwIfSetupInferenceCancelled(params);
			assertOriginalGeneration();
			return failure({
				ok: false,
				status: "unknown",
				error: "The saved credential could not be resolved. Restore its secret and retry this sign-in in Model Setup."
			});
		}
		throwIfSetupInferenceCancelled(params);
		assertOriginalGeneration();
		if (prepared.authStoreCredentialsRevision !== credentialsRevision) throw new SetupInferenceOwnerDriftError("The saved credential changed during preparation. Retry this sign-in in Model Setup.");
		const materialized = prepared.authStores[0]?.store.profiles[profileId];
		if (!materialized) return failure({
			ok: false,
			status: "auth",
			error: "The saved credential could not be prepared. Retry this sign-in in Model Setup."
		});
		const runtimeCredential = {
			source,
			materialized,
			credentialsRevision
		};
		return await withSetupCredentialAccess({
			...access,
			runtimeCredential
		}, () => verify(runtimeCredential));
	});
}
async function activateSavedSetupCredential(params) {
	if (!params.credential.setup) return;
	const agentDir = params.stateDir ? params.agentDir : resolvePersistedAuthProfileOwnerAgentDir(params);
	const before = captureAuthProfileStorePersistenceSnapshot(agentDir, { stateDir: params.stateDir });
	const store = structuredClone(loadAuthProfileStoreWithoutExternalProfiles(agentDir));
	const current = store.profiles[params.profileId];
	if (!current || !isDeepStrictEqual(current, params.credential)) throw new Error("The saved sign-in changed before activation. Test it again in Model Setup.");
	delete current.setup;
	params.beforeWrite?.();
	const committed = saveAuthProfileStoreIfPersistenceSnapshotMatches({
		store,
		snapshot: before,
		agentDir,
		stateDir: params.stateDir
	});
	const credentialOwner = {
		kind: "resolved",
		databasePath: committed.owned.owner.databasePath,
		sharedDatabasePath: committed.owned.owner.sharedDatabasePath
	};
	let mutationToken;
	const rollback = () => {
		restoreAuthProfileStorePersistenceSnapshot(before, committed.owned, agentDir, { stateDir: params.stateDir });
		if (!isDeepStrictEqual(loadAuthProfileStoreWithoutExternalProfiles(agentDir).profiles[params.profileId], params.credential)) throw new SetupInferenceOwnerDriftError("A newer credential update superseded this activation. Review Model Setup.");
		mutationToken = getRuntimeAuthProfileStoreCredentialMutationToken(agentDir, params.profileId, { owner: credentialOwner });
	};
	try {
		if (!committed.publishRuntimeSnapshots()) throw new Error("The saved sign-in could not be published. Retry it in Model Setup.");
	} catch (error) {
		rollback();
		throw error;
	}
	mutationToken = getRuntimeAuthProfileStoreCredentialMutationToken(agentDir, params.profileId, { owner: credentialOwner });
	return {
		rollback,
		assertCurrent: () => {
			const currentToken = getRuntimeAuthProfileStoreCredentialMutationToken(agentDir, params.profileId, { owner: credentialOwner });
			if (!mutationToken.known || !currentToken.known || mutationToken.revision !== currentToken.revision) throw new SetupInferenceOwnerDriftError("The credential changed before activation completed. Review Model Setup.");
		}
	};
}
async function activatePreparedSetupCredential(ctx, profileId, credential, runtimeCredential, revalidate, assertCurrent) {
	const { params } = ctx;
	return await withSetupCredentialAccess({
		profileId,
		agentDir: ctx.agentDir,
		signal: params.signal,
		runtimeCredential
	}, async () => {
		await revalidate();
		return await activateSavedSetupCredential({
			agentDir: ctx.agentDir,
			profileId,
			credential,
			beforeWrite: () => {
				assertCurrent();
				throwIfSetupInferenceCancelled(params);
				if (runtimeCredential && runtimeCredential.credentialsRevision !== getRuntimeAuthProfileStoreCredentialsRevision()) throw new SetupInferenceOwnerDriftError("The saved credential changed before activation. Test this sign-in again.");
			}
		});
	});
}
//#endregion
//#region src/system-agent/setup-inference-probe-work.ts
/** The probe is setup evidence, not a chat turn: its events must never reach Gateway projection. */
function registerHiddenSetupInferenceProbeRun(runId, agentId, sessionKey) {
	registerAgentRunContext(runId, {
		agentId,
		sessionKey,
		isControlUiVisible: false,
		projectSessionActive: false,
		projectSessionLifecycle: false,
		projectSessionMessages: false
	});
}
/** Setup must release the isolated probe generation before activation can replace it. */
async function runSetupInferenceProbeWork(run, params) {
	const failures = /* @__PURE__ */ new Set();
	const work = new AsyncWorkScope(failures);
	let result;
	try {
		result = await work.track(() => run(params));
	} finally {
		await AsyncWorkScope.runWhenAllIdle(() => [work], () => work.drain());
	}
	if (failures.size > 0) throw new AggregateError([...failures], "Inference setup probe cleanup did not finish safely.");
	return result;
}
//#endregion
//#region src/system-agent/setup-inference-profile.ts
/** A pinned profile must exist and belong to the route before any request leaves the host. */
function resolveSetupInferenceProfileError(route, workspaceDir, deps) {
	const profileId = route.authProfileId?.trim();
	if (!profileId) return;
	const credential = (deps.loadAuthProfileStoreForRuntime ?? loadAuthProfileStoreForRuntime)(route.agentDir, {
		readOnly: true,
		allowKeychainPrompt: false,
		config: route.runConfig,
		externalCliProviderIds: [route.provider]
	}).profiles[profileId];
	if (!credential) return `No credentials found for the configured setup profile "${profileId}".`;
	if (route.runner === "embedded") {
		if (buildAgentRuntimeAuthPlan({
			provider: route.provider,
			authProfileProvider: credential.provider,
			authProfileMode: credential.type,
			sessionAuthProfileId: profileId,
			config: route.runConfig,
			workspaceDir,
			harnessId: route.agentHarnessRuntimeOverride,
			harnessRuntime: route.agentHarnessRuntimeOverride,
			allowHarnessAuthProfileForwarding: true
		}).forwardedAuthProfileId === profileId) return;
	} else {
		const aliasContext = {
			config: route.runConfig,
			workspaceDir
		};
		try {
			if (resolveProviderIdForAuth(route.provider, aliasContext) === resolveProviderIdForAuth(credential.provider, {
				...aliasContext,
				storedCredential: true
			})) return;
		} catch {
			return `Could not verify that configured setup profile "${profileId}" belongs to the selected ${route.provider} inference route.`;
		}
	}
	return `Configured setup profile "${profileId}" belongs to ${credential.provider}, not the selected ${route.provider} inference route.`;
}
//#endregion
//#region src/system-agent/setup-inference-turn.ts
/**
* Runs one bounded, tool-free turn through the exact configured route. The turn is evidence,
* never a mutation: auth state stays read-only and the prepared runtime stays isolated so a
* staged config can be tested before it is written.
*/
async function runSetupInferenceTurn(params) {
	const { route, deps } = params;
	const runId = `probe-setup-inference-${randomUUID()}`;
	const sessionKey = `agent:${route.agentId}:setup-inference:incognito-${runId}`;
	const timeoutMs = deps.timeoutMs ?? 9e4;
	const started = Date.now();
	const workspaceDir = await (deps.createTempDir ?? (() => fs.mkdtemp(path.join(os.tmpdir(), "openclaw-setup-inference-"))))();
	const failed = (status, error) => {
		setupInferenceLog.warn("Inference setup probe failed.", {
			event: "setup_inference_probe_failed",
			provider: route.provider,
			model: route.model,
			runner: route.runner,
			runId,
			phase: "response",
			status,
			timeoutMs,
			durationMs: Date.now() - started
		});
		return {
			ok: false,
			status,
			error: status === "timeout" ? "The setup response check timed out. Retry setup, or choose another model or runtime. No default model was changed." : error
		};
	};
	const preparedRunAdmission = prepareSystemAgentRunAdmission(route.runConfig, runId, route.agentId, "system-agent.setup-inference");
	let successfulAuth;
	const shared = {
		preparedRunAdmission,
		sessionId: runId,
		sessionKey,
		sessionManager: SessionManager.inMemory(workspaceDir),
		agentId: route.agentId,
		trigger: "manual",
		sessionFile: `in-memory:${runId}`,
		workspaceDir,
		agentDir: route.agentDir,
		config: route.runConfig,
		prompt: params.prompt ?? "Reply with the single word OK. Do not use tools.",
		provider: route.provider,
		model: route.model,
		timeoutMs,
		runId,
		messageChannel: "openclaw",
		messageProvider: "openclaw",
		disableTools: true,
		...route.authProfileId ? { authProfileId: route.authProfileId } : {},
		onSuccessfulAuthBinding: (binding) => {
			successfulAuth = binding;
		},
		...params.signal ? { abortSignal: params.signal } : {}
	};
	try {
		if (params.signal?.aborted) throw new SetupInferenceCancelledError();
		registerHiddenSetupInferenceProbeRun(runId, route.agentId, sessionKey);
		const cliError = await resolveToolFreeCliSetupError(route);
		if (cliError) return failed("unavailable", cliError);
		const profileError = resolveSetupInferenceProfileError(route, workspaceDir, deps);
		if (profileError) return failed("auth", profileError);
		let result;
		if (route.runner === "cli") result = await (deps.runCliAgent ?? (await import("./cli-runner-BkB2OIrR.mjs")).runCliAgent)({
			...shared,
			executionMode: "side-question",
			cleanupCliLiveSessionOnRunEnd: true
		});
		else {
			const runEmbedded = deps.runEmbeddedAgent ?? (await import("./embedded-agent-BA01iFq8.mjs")).runEmbeddedAgent;
			const harness = route.agentHarnessRuntimeOverride;
			result = await runSetupInferenceProbeWork(runEmbedded, {
				...shared,
				sessionPersistence: "detached",
				...route.authProfileId ? { authProfileIdSource: "user" } : {},
				authProfileStateMode: "read-only",
				allowAuthProfileFallback: false,
				retryConnectionErrors: false,
				preparedModelRuntimeMode: "isolated-read-only",
				...harness === "codex" ? { cleanupBundleMcpOnRunEnd: true } : {},
				...harness ? { agentHarnessRuntimeOverride: harness } : {},
				lane: `session:probe-setup-inference:${route.provider}`,
				thinkLevel: "off",
				reasoningLevel: "off",
				verboseLevel: "off",
				disableTrajectory: true,
				...params.prompt === void 0 && (!harness || harness === "openclaw") ? { streamParams: { maxTokens: 256 } } : {},
				modelRun: true
			});
		}
		if (params.signal?.aborted) throw new SetupInferenceCancelledError();
		const terminalError = extractAgentRunTerminalError(result);
		if (terminalError) throw new Error(terminalError);
		const text = extractAgentRunText(result)?.trim();
		if (!text) return failed("format", "The model started but did not send a reply. Try again or pick another option.");
		const winnerError = await resolveSetupInferenceWinnerError(route, result);
		if (winnerError) return failed("unknown", winnerError);
		if (route.authProfileId && successfulAuth?.authProfileId !== route.authProfileId) return failed("auth", `The inference run used profile "${successfulAuth?.authProfileId ?? "unknown"}" instead of the configured profile "${route.authProfileId}".`);
		if (params.requireExecutionOwner && !successfulAuth) return failed("unknown", "Inference succeeded, but its runtime did not report an owner that OpenClaw can safely reuse.");
		return {
			ok: true,
			latencyMs: Date.now() - started,
			text,
			auth: successfulAuth ?? (route.authProfileId ? { authProfileId: route.authProfileId } : {})
		};
	} catch (error) {
		const described = describeSetupInferenceError(error, route);
		return failed(described.status, described.error);
	} finally {
		preparedRunAdmission.close();
		clearAgentRunContext(runId);
		try {
			await (deps.removeTempDir ?? ((dir) => fs.rm(dir, {
				recursive: true,
				force: true
			})))(workspaceDir);
		} catch (error) {
			params.runtime?.error?.(`Could not remove temporary AI setup files: ${await redactSetupInferenceError(error)}`);
			setupInferenceLog.warn("Could not remove the temporary inference test directory.");
		}
	}
}
/** Setup owns fresh package facts without replacing the Gateway's startup generation. */
function loadSetupInferencePluginGeneration(params) {
	const preferBuiltPluginArtifacts = getPluginRuntimeLoadContext(getPluginRegistryForContext() ?? void 0)?.preferBuiltPluginArtifacts;
	return withPluginCache(params.cache, () => {
		const index = params.pendingPluginInstalls ? loadInstalledPluginIndex({
			config: params.config,
			workspaceDir: params.workspaceDir,
			env: process.env,
			installRecords: {
				...loadInstalledPluginIndexInstallRecordsSync(),
				...params.pendingPluginInstalls
			}
		}) : void 0;
		const generation = {
			config: params.config,
			metadataSnapshot: (params.resolvePluginMetadataSnapshot ?? resolvePluginMetadataSnapshot)({
				config: params.config,
				env: process.env,
				workspaceDir: params.workspaceDir,
				allowCurrent: false,
				...index ? { index } : {}
			})
		};
		const pluginRegistry = withPluginRuntimeGenerationScope(generation, () => loadAgentRuntimePluginRegistryHandle({
			config: params.config,
			workspaceDir: params.workspaceDir,
			metadataSnapshot: generation.metadataSnapshot,
			preferBuiltPluginArtifacts,
			selections: [params.selection]
		}));
		if (!pluginRegistry) throw new Error(`Could not load the ${params.selection.runtime} runtime plugin.`);
		return {
			...generation,
			pluginRegistry
		};
	});
}
async function revalidateSetupInferenceOwner(params) {
	const configuredHarnessId = params.route.runner === "embedded" ? params.route.agentHarnessRuntimeOverride?.trim() : void 0;
	const successfulHarnessId = params.auth.agentHarnessId?.trim() || (configuredHarnessId && configuredHarnessId !== "auto" ? configuredHarnessId : void 0);
	const createBinding = () => (params.deps.createSystemAgentVerifiedInferenceBinding ?? createSystemAgentVerifiedInferenceBinding)({
		configuredRoute: params.route,
		executionRoute: params.route,
		auth: params.auth,
		deps: params.deps
	});
	if (params.ownerPluginIds?.length || params.route.runner === "embedded" && successfulHarnessId && successfulHarnessId !== "openclaw") try {
		var _usingCtx$1 = _usingCtx();
		const workspaceDir = resolveAgentWorkspaceDir(params.route.runConfig, params.route.agentId, process.env);
		const generation = loadSetupInferencePluginGeneration({
			cache: _usingCtx$1.a(createPluginCache()),
			config: params.route.runConfig,
			workspaceDir,
			selection: {
				provider: parseInferenceRef(params.route.modelLabel).provider,
				modelId: params.route.model,
				...params.route.runner === "cli" ? { runtime: params.route.provider } : successfulHarnessId ? { runtime: successfulHarnessId } : {},
				agentId: params.route.agentId
			},
			resolvePluginMetadataSnapshot: params.deps.resolvePluginMetadataSnapshot
		});
		return await withPluginRuntimeGenerationScope(generation, createBinding);
	} catch (_) {
		_usingCtx$1.e = _;
	} finally {
		await _usingCtx$1.d();
	}
	return await createBinding();
}
function hasSameOwnerPluginArtifacts(binding, snapshot) {
	return isDeepStrictEqual(binding.ownerPluginIds, snapshot.ownerPluginIds) && isDeepStrictEqual(binding.ownerPluginArtifacts, snapshot.ownerPluginArtifacts);
}
/**
* Revalidate the successful probe's owner against current config. Any drift
* throws SetupInferenceOwnerDriftError, which activation returns as an auth
* failure result — a throw that escapes here would crash the onboarding ladder.
*/
async function revalidateStableSetupInferenceOwner(params) {
	let binding;
	try {
		binding = await revalidateSetupInferenceOwner({
			route: params.route,
			auth: params.auth,
			ownerPluginIds: params.stagedOwnerPluginArtifacts?.ownerPluginIds,
			deps: params.deps
		});
	} catch (error) {
		throw new SetupInferenceOwnerDriftError(`The verified inference owner changed before activation completed. Retry the inference check. (${formatErrorMessage(error)})`, { cause: error });
	}
	if (!params.stagedOwnerPluginArtifacts || !hasSameOwnerPluginArtifacts(binding, params.stagedOwnerPluginArtifacts)) throw new SetupInferenceOwnerDriftError("The verified inference owner changed before activation completed. Retry the inference check. (The owner plugin runtime changed during its live test.)");
	return binding;
}
async function verifySetupInference(params) {
	const readSnapshot = params.deps?.readConfigFileSnapshot ?? (await import("./config/config.js")).readConfigFileSnapshot;
	const snapshot = await readSnapshot();
	if (!snapshot.exists) return {
		ok: false,
		status: "unavailable",
		error: "No OpenClaw config exists. Run `openclaw onboard` first."
	};
	if (!snapshot.valid) return {
		ok: false,
		status: "format",
		error: invalidSetupConfigError(snapshot)
	};
	const cfg = snapshot.runtimeConfig ?? snapshot.config;
	const routeOptions = { modelTarget: params.modelTarget };
	const baselineRoute = await projectInferenceRoute(cfg, params.agentId, routeOptions);
	let verifiedBinding;
	const verification = await verifySetupInferenceConfig({
		config: cfg,
		configSnapshot: snapshot,
		readCurrentConfigSnapshot: async () => {
			const current = await readSnapshot();
			if (!current.exists || !current.valid) throw new Error("The current inference config is unavailable. Retry the inference check.");
			return current;
		},
		runtime: params.runtime,
		requireExecutionOwner: params.bindSession === true,
		...params.modelTarget ? { modelTarget: params.modelTarget } : {},
		...params.agentId ? { agentId: params.agentId } : {},
		...params.timeoutMs !== void 0 ? { timeoutMs: params.timeoutMs } : {},
		...params.deps ? { deps: params.deps } : {},
		onVerifiedExecution: params.bindSession ? (binding) => {
			verifiedBinding = binding;
		} : void 0
	});
	if (!verification.ok) return verification;
	const latestSnapshot = await readSnapshot().catch(() => null);
	const latestConfig = latestSnapshot?.exists && latestSnapshot.valid ? latestSnapshot.runtimeConfig ?? latestSnapshot.config : void 0;
	const latestRoute = latestConfig ? await projectInferenceRoute(latestConfig, params.agentId, routeOptions) : void 0;
	if (!latestRoute || !sameDefaultInferenceRoute(baselineRoute, latestRoute)) return {
		ok: false,
		status: "unknown",
		error: "The inference route changed during its live test. Review current model/auth/runtime settings and retry."
	};
	if (!params.bindSession) return verification;
	if (!verifiedBinding) return {
		ok: false,
		status: "unknown",
		error: "The successful inference run did not report an exact execution binding. Retry setup before starting OpenClaw."
	};
	return {
		...verification,
		binding: verifiedBinding
	};
}
function executionRouteIdentity(route) {
	const { runConfig: _runConfig, sourceConfig: _sourceConfig, ...identity } = route;
	return identity;
}
/**
* Strict credentials need only the static owner check. Opaque runtimes can
* prove liveness only by completing another exact turn at the side-effect
* boundary; the result must still be the original frozen route.
*/
async function resolvePersistentApplyInference(params) {
	const deps = params.deps ?? {};
	const resolveVerified = deps.resolveVerifiedInferenceRoute ?? resolveSystemAgentVerifiedInferenceRoute;
	const initialRoute = await resolveVerified(params.binding, deps);
	if (!initialRoute) return null;
	const hasCurrentOwnerPluginArtifacts = deps.hasCurrentOwnerPluginArtifacts ?? hasCurrentSystemAgentOwnerPluginArtifacts;
	if (!await hasCurrentOwnerPluginArtifacts(params.binding, deps)) return null;
	if (params.binding.auth.proofKind !== "runtime-owner") return initialRoute;
	const live = await (deps.verifyBoundInference ?? verifySetupInference)({
		runtime: params.runtime,
		bindSession: true,
		agentId: params.binding.execution.agentId,
		deps
	});
	if (!live.ok || !isDeepStrictEqual(live.binding.configuredRoute, params.binding.configuredRoute) || !isDeepStrictEqual(executionRouteIdentity(live.binding.execution), executionRouteIdentity(params.binding.execution)) || !isDeepStrictEqual(live.binding.executionFingerprint, params.binding.executionFingerprint) || !isDeepStrictEqual(live.binding.ownerPluginIds, params.binding.ownerPluginIds) || !isDeepStrictEqual(live.binding.ownerPluginArtifacts, params.binding.ownerPluginArtifacts) || !isDeepStrictEqual(live.binding.auth, params.binding.auth)) return null;
	const finalRoute = await resolveVerified(params.binding, deps);
	if (!finalRoute || !await hasCurrentOwnerPluginArtifacts(params.binding, deps)) return null;
	return finalRoute;
}
/** Live-test a candidate config through the same route used after activation. */
async function verifySetupInferenceConfig(params) {
	const deps = {
		...params.deps,
		...params.timeoutMs !== void 0 ? { timeoutMs: params.timeoutMs } : {}
	};
	const configuredRoute = await resolveSystemAgentConfiguredRouteFromConfig(params.config, params.agentId, {
		loadAuthProfileStoreForRuntime: deps.loadAuthProfileStoreForRuntime,
		modelTarget: params.modelTarget
	}, params.configSnapshot);
	if (!configuredRoute) return {
		ok: false,
		status: "unavailable",
		error: "No agent model is configured. Run `openclaw onboard` first."
	};
	const route = params.agentDir ? {
		...configuredRoute,
		agentDir: params.agentDir
	} : configuredRoute;
	const requireExecutionOwner = params.requireExecutionOwner === true || params.onVerifiedExecution !== void 0;
	const baselineRoute = requireExecutionOwner ? await projectInferenceRoute(params.config, route.agentId, { modelTarget: params.modelTarget }) : void 0;
	let stagedOwnerPluginArtifacts;
	if (requireExecutionOwner) try {
		stagedOwnerPluginArtifacts = (deps.captureSystemAgentOwnerPluginArtifacts ?? captureSystemAgentOwnerPluginArtifacts)({
			config: route.sourceConfig,
			executionRoute: route,
			deps
		});
	} catch (error) {
		return {
			ok: false,
			status: "unavailable",
			error: `Could not bind the configured inference plugin runtime. Refresh or reinstall the plugin and retry. (${await redactSetupInferenceError(error)})`
		};
	}
	const turn = await runSetupInferenceTurn({
		route,
		deps,
		requireExecutionOwner,
		runtime: params.runtime
	});
	if (!turn.ok) return {
		...turn,
		error: await redactSetupInferenceError(turn.error)
	};
	if (requireExecutionOwner) try {
		const currentSnapshot = params.readCurrentConfigSnapshot ? await params.readCurrentConfigSnapshot() : params.configSnapshot;
		const currentConfig = params.readCurrentConfigSnapshot && currentSnapshot ? currentSnapshot.runtimeConfig ?? currentSnapshot.config : params.config;
		const currentRoute = await resolveSystemAgentConfiguredRouteFromConfig(currentConfig, route.agentId, {
			loadAuthProfileStoreForRuntime: deps.loadAuthProfileStoreForRuntime,
			modelTarget: params.modelTarget
		}, currentSnapshot);
		if (!currentRoute || !sameDefaultInferenceRoute(baselineRoute, await projectInferenceRoute(currentConfig, route.agentId, { modelTarget: params.modelTarget }))) throw new Error("The inference route changed during its live test. Retry the inference check.");
		const binding = await revalidateStableSetupInferenceOwner({
			route: params.agentDir ? {
				...currentRoute,
				agentDir: params.agentDir
			} : currentRoute,
			auth: turn.auth,
			stagedOwnerPluginArtifacts,
			deps
		});
		params.onVerifiedExecution?.(binding);
	} catch (error) {
		return {
			ok: false,
			status: "auth",
			error: await redactSetupInferenceError(error)
		};
	}
	return {
		ok: true,
		modelRef: route.modelLabel,
		latencyMs: turn.latencyMs,
		...route.modelTarget ? { modelTarget: route.modelTarget } : {}
	};
}
/** Run one tool-free completion through the configured setup inference route. */
async function completeSetupInference(params) {
	const snapshot = await (params.deps?.readConfigFileSnapshot ?? (await import("./config/config.js")).readConfigFileSnapshot)();
	if (!snapshot.exists) return {
		ok: false,
		status: "unavailable",
		error: "No OpenClaw config exists."
	};
	if (!snapshot.valid) return {
		ok: false,
		status: "format",
		error: invalidSetupConfigError(snapshot)
	};
	return await completeSetupInferenceConfig({
		...params,
		config: snapshot.runtimeConfig ?? snapshot.config,
		configSnapshot: snapshot
	});
}
/** Config-injected variant used by setup clients and live provider tests. */
async function completeSetupInferenceConfig(params) {
	const deps = {
		...params.deps,
		...params.timeoutMs !== void 0 ? { timeoutMs: params.timeoutMs } : {}
	};
	const route = await resolveSystemAgentConfiguredRouteFromConfig(params.config, params.agentId, { loadAuthProfileStoreForRuntime: deps.loadAuthProfileStoreForRuntime }, params.configSnapshot);
	if (!route) return {
		ok: false,
		status: "unavailable",
		error: "No agent model is configured."
	};
	const turn = await runSetupInferenceTurn({
		route,
		prompt: params.prompt,
		deps,
		requireExecutionOwner: false,
		runtime: params.runtime
	});
	if (!turn.ok) return {
		...turn,
		error: await redactSetupInferenceError(turn.error)
	};
	return {
		ok: true,
		modelRef: route.modelLabel,
		latencyMs: turn.latencyMs,
		text: turn.text
	};
}
//#endregion
export { revalidateStableSetupInferenceOwner as a, verifySetupInferenceConfig as c, withPreparedSetupCredentialAccess as d, resolvePersistentApplyInference as i, activatePreparedSetupCredential as l, completeSetupInferenceConfig as n, runSetupInferenceTurn as o, loadSetupInferencePluginGeneration as r, verifySetupInference as s, completeSetupInference as t, activateSavedSetupCredential as u };
