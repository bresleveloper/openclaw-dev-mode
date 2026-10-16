import { d as resolveAgentWorkspaceDir } from "./agent-scope-config-CDYpzA0r.mjs";
import { t as cloneConfigWithResolutionFacts } from "./resolution-facts-HH1cnmIY.mjs";
import { u as normalizePluginsConfig } from "./config-state-DY_WJYue.mjs";
import { i as loadPluginRegistrySnapshot } from "./plugin-registry-snapshot-CMOJTUWl.mjs";
import "./agent-scope-CG17uXFn.mjs";
import { i as passesManifestOwnerBasePolicy } from "./manifest-owner-policy-B2H7kBCF.mjs";
import { a as fingerprintPluginRuntimeArtifact, o as loadPluginRuntimeArtifactIdentitySources } from "./plugin-setup-module-Cbs40ZXx.mjs";
import "./plugin-registry-Cl9kmLsR.mjs";
import { f as resolveOwningPluginIdsForProviderRef, u as resolveOwningPluginIdsForModelRefs } from "./providers-DQUFJKZx.mjs";
import { o as loadAuthProfileStoreForRuntime } from "./store-runtime-CzCCJ_Oe.mjs";
import { n as getRegisteredAgentHarness } from "./registry-BUEqtPpd.mjs";
import { r as resolveAgentHarnessOwnerPluginIds } from "./runtime-plugin-load-plan-BRzvw1z3.mjs";
import { t as resolveApiKeyForProviderCore } from "./model-auth-provider-BJK6Yjjx.mjs";
import "./model-auth-DfAz5WFK.mjs";
import { a as fingerprintResolvedAuthProfileCredential, i as fingerprintOpaqueRuntimeOwner, n as fingerprintAuthProfileOwnerShape, o as fingerprintResolvedProviderAuth, r as fingerprintAwsSdkRuntimeOwner, t as fingerprintAuthProfileCredential } from "./execution-auth-binding-CVDaRnoO.mjs";
import "./runtime-plugin-B5HyKAVV.mjs";
import { i as resolveSystemAgentConfiguredRouteFromConfig, r as projectInferenceRoute } from "./inference-route-D8mI3-Om.mjs";
import { a as resolveCliRuntimeOwnerFingerprint, i as resolveCliRuntimeArtifactFingerprint, n as resolveCliAuthBindingFingerprint } from "./cli-auth-epoch-CTtIMf66.mjs";
import { isDeepStrictEqual } from "node:util";
//#region src/system-agent/verified-inference.ts
/** Exact child harness artifact every verified embedded OpenClaw call must carry. */
function resolveSystemAgentExpectedAgentHarnessRuntimeArtifact(binding) {
	if (binding.execution.runner !== "embedded" || binding.execution.agentHarnessRuntimeOverride === "openclaw") return;
	const harnessId = binding.execution.agentHarnessRuntimeOverride;
	const artifactId = binding.auth.runtimeArtifactId?.trim();
	const fingerprint = binding.auth.runtimeArtifactFingerprint;
	if (binding.auth.agentHarnessId !== harnessId || !artifactId || !fingerprint) throw new Error("The verified inference harness artifact is incomplete.");
	return {
		harnessId,
		artifact: {
			id: artifactId,
			fingerprint
		}
	};
}
async function validateAgentHarnessRuntimeArtifact(params) {
	try {
		if (params.deps.validateAgentHarnessRuntimeArtifact) return await params.deps.validateAgentHarnessRuntimeArtifact({
			harnessId: params.harnessId,
			artifact: params.artifact
		});
		return await (getRegisteredAgentHarness(params.harnessId)?.harness)?.runtimeArtifact?.validate(params.artifact) === true;
	} catch {
		return false;
	}
}
async function resolveAgentHarnessAuthBindingFingerprint(params) {
	const input = {
		harnessId: params.harnessId,
		authProfileId: params.authProfileId,
		authProfileStore: params.authProfileStore,
		agentDir: params.agentDir,
		config: params.config
	};
	if (params.deps.resolveAgentHarnessAuthBindingFingerprint) return params.deps.resolveAgentHarnessAuthBindingFingerprint(input);
	return getRegisteredAgentHarness(params.harnessId)?.harness.authBinding?.fingerprint(input);
}
function systemAgentRouteIdentity(route) {
	const { runConfig: _runConfig, sourceConfig: _sourceConfig, authProfileId: _authProfileId, ...identity } = route;
	return identity;
}
function loadRouteAuthProfileStore(route, deps) {
	return (deps.loadAuthProfileStoreForRuntime ?? loadAuthProfileStoreForRuntime)(route.agentDir, {
		readOnly: true,
		migrationProvider: route.provider,
		allowKeychainPrompt: false,
		config: route.runConfig,
		externalCliProviderIds: [route.provider]
	});
}
async function resolveCurrentRuntimeOwnerFingerprint(params) {
	if (params.route.runner === "cli") {
		if (params.kind !== "cli-runtime") return;
		return (params.deps.resolveCliRuntimeOwnerFingerprint ?? resolveCliRuntimeOwnerFingerprint)({
			provider: params.route.provider,
			config: params.route.runConfig,
			agentDir: params.route.agentDir,
			agentId: params.route.agentId,
			runtimeOwnerId: params.runtimeOwnerId,
			...params.authProfileId ? { authProfileId: params.authProfileId } : {},
			...params.skipLocalCredential ? { skipLocalCredential: true } : {},
			...params.runtimeArtifactFingerprint ? { runtimeArtifactFingerprint: params.runtimeArtifactFingerprint } : {}
		});
	}
	let authProfileOwnerFingerprint;
	if (params.authProfileId) {
		const store = loadRouteAuthProfileStore(params.route, params.deps);
		authProfileOwnerFingerprint = fingerprintAuthProfileOwnerShape({
			profileId: params.authProfileId,
			credential: store.profiles[params.authProfileId]
		});
		if (!authProfileOwnerFingerprint) return;
	}
	if (params.kind === "plugin-harness") {
		if (params.route.agentHarnessRuntimeOverride === "openclaw") return;
		return fingerprintOpaqueRuntimeOwner({
			kind: "plugin-harness",
			runner: "embedded",
			provider: params.route.provider,
			backendId: params.route.agentHarnessRuntimeOverride,
			...params.runtimeArtifactFingerprint ? { runtimeArtifactFingerprint: params.runtimeArtifactFingerprint } : {},
			...params.authProfileId ? { authProfileId: params.authProfileId } : {},
			...authProfileOwnerFingerprint ? { authProfileOwnerFingerprint } : {}
		});
	}
	if (params.kind !== "aws-sdk") return;
	const auth = await (params.deps.resolveApiKeyForProvider ?? resolveApiKeyForProviderCore)({
		provider: params.route.provider,
		cfg: params.route.runConfig,
		agentDir: params.route.agentDir,
		workspaceDir: resolveAgentWorkspaceDir(params.route.runConfig, params.route.agentId, process.env),
		...params.authProfileId ? {
			profileId: params.authProfileId,
			lockedProfile: true
		} : {},
		secretSentinels: true
	});
	if (params.authProfileId && auth.profileId !== params.authProfileId) return;
	return fingerprintAwsSdkRuntimeOwner({
		provider: params.route.provider,
		backendId: params.route.agentHarnessRuntimeOverride,
		auth
	});
}
function projectRelevantPlugins(config, route, ownerPluginIds) {
	if (!route || ownerPluginIds.length === 0) return;
	const normalizedPlugins = normalizePluginsConfig(config.plugins);
	return Object.fromEntries(ownerPluginIds.map((id) => [id, {
		active: passesManifestOwnerBasePolicy({
			plugin: { id },
			normalizedConfig: normalizedPlugins
		}),
		entry: normalizedPlugins.entries[id]
	}]));
}
function projectOwnerPluginRuntime(record) {
	return {
		pluginId: record.pluginId,
		origin: record.origin,
		rootDir: record.rootDir,
		manifestPath: record.manifestPath,
		manifestHash: record.manifestHash,
		source: record.source ?? null,
		packageName: record.packageName ?? null,
		packageVersion: record.packageVersion ?? null,
		installRecordHash: record.installRecordHash ?? null,
		packageJson: record.packageJson ? {
			path: record.packageJson.path,
			hash: record.packageJson.hash
		} : null
	};
}
function projectOwnerPluginRuntimes(params) {
	if (params.ownerPluginIds.length === 0) return [];
	const loadRegistry = params.deps.loadPluginRegistrySnapshot ?? loadPluginRegistrySnapshot;
	const workspaceDir = resolveAgentWorkspaceDir(params.config, params.route.agentId, process.env);
	const registry = loadRegistry({
		config: params.config,
		workspaceDir,
		env: process.env
	});
	const recordsById = new Map(registry.plugins.map((record) => [record.pluginId, record]));
	return params.ownerPluginIds.map((pluginId) => {
		const record = recordsById.get(pluginId);
		if (!record) throw new Error(`The inference owner plugin ${pluginId} is not installed.`);
		return projectOwnerPluginRuntime(record);
	});
}
function projectOwnerPluginArtifacts(params) {
	if (params.ownerPluginIds.length === 0) return [];
	const fingerprintArtifact = params.deps.fingerprintPluginRuntimeArtifact ?? fingerprintPluginRuntimeArtifact;
	const workspaceDir = resolveAgentWorkspaceDir(params.config, params.route.agentId, process.env);
	const registryParams = {
		config: params.config,
		workspaceDir,
		env: process.env
	};
	const records = params.deps.loadPluginRegistrySnapshot ? params.deps.loadPluginRegistrySnapshot(registryParams).plugins : loadPluginRuntimeArtifactIdentitySources(registryParams);
	const recordsById = new Map(records.map((record) => [record.pluginId, record]));
	return params.ownerPluginIds.map((pluginId) => {
		const record = recordsById.get(pluginId);
		if (!record) throw new Error(`The inference owner plugin ${pluginId} is not installed.`);
		return {
			pluginId,
			fingerprint: fingerprintArtifact({
				pluginId,
				origin: record.origin,
				rootDir: record.rootDir,
				...record.source ? { source: record.source } : {},
				...record.packageBuild ? { packageBuild: record.packageBuild } : {},
				sourcePreferred: record.sourcePreferred
			})
		};
	});
}
async function projectVerifiedExecutionFingerprint(config, route, ownerPluginIds, deps) {
	const projection = await projectInferenceRoute(config, route.agentId, {
		...deps,
		modelTarget: route.modelTarget
	});
	const { authProfileId: _authProfileId, ...routeIdentity } = projection.route ?? {};
	return {
		route: projection.route ? routeIdentity : null,
		defaultSelection: projection.defaultSelection,
		auth: projection.auth,
		models: projection.models,
		defaults: projection.defaults,
		...projection.agent === void 0 ? {} : { agent: projection.agent },
		plugins: projectRelevantPlugins(config, projection.route, ownerPluginIds),
		ownerPluginRuntimes: projectOwnerPluginRuntimes({
			config,
			route,
			ownerPluginIds,
			deps
		})
	};
}
function resolveRouteHarnessOwnerPluginIds(config, route) {
	if (route.runner !== "embedded" || !route.agentHarnessRuntimeOverride || route.agentHarnessRuntimeOverride === "openclaw") return [];
	const workspaceDir = resolveAgentWorkspaceDir(config, route.agentId, process.env);
	return resolveAgentHarnessOwnerPluginIds({
		runtime: route.agentHarnessRuntimeOverride,
		provider: route.provider,
		config,
		workspaceDir
	});
}
function resolveRouteOwnerPluginIds(config, route) {
	const workspaceDir = resolveAgentWorkspaceDir(config, route.agentId, process.env);
	return [
		...resolveOwningPluginIdsForModelRefs({
			models: [route.modelLabel],
			config,
			workspaceDir,
			env: process.env
		}),
		...resolveOwningPluginIdsForProviderRef({
			provider: route.provider,
			config,
			workspaceDir,
			env: process.env
		}) ?? [],
		...resolveRouteHarnessOwnerPluginIds(config, route)
	].filter((id, index, ids) => ids.indexOf(id) === index).toSorted();
}
/** Capture once immediately before a live setup turn. */
function captureSystemAgentOwnerPluginArtifacts(params) {
	const deps = params.deps ?? {};
	const ownerPluginIds = resolveRouteOwnerPluginIds(params.config, params.executionRoute);
	return {
		ownerPluginIds,
		ownerPluginArtifacts: projectOwnerPluginArtifacts({
			config: params.config,
			route: params.executionRoute,
			ownerPluginIds,
			deps
		})
	};
}
async function resolveCurrentAuthFingerprint(params) {
	if (params.route.runner === "cli") {
		const resolveBinding = params.deps.resolveCliAuthBindingFingerprint ?? resolveCliAuthBindingFingerprint;
		let resolvedAuth;
		if (params.authProfileId) {
			const store = loadRouteAuthProfileStore(params.route, params.deps);
			const authCredential = store.profiles[params.authProfileId];
			if (authCredential?.type === "api_key" && !authCredential.key || authCredential?.type === "token" && !authCredential.token) {
				resolvedAuth = await (params.deps.resolveApiKeyForProvider ?? resolveApiKeyForProviderCore)({
					store,
					provider: params.route.provider,
					cfg: params.route.runConfig,
					agentDir: params.route.agentDir,
					workspaceDir: resolveAgentWorkspaceDir(params.route.runConfig, params.route.agentId, process.env),
					profileId: params.authProfileId,
					lockedProfile: true,
					secretSentinels: false
				});
				if (resolvedAuth.profileId !== params.authProfileId || !resolvedAuth.apiKey || !authCredential) return;
			}
		}
		return resolveBinding({
			provider: params.route.provider,
			config: params.route.runConfig,
			agentDir: params.route.agentDir,
			...params.authProfileId ? { authProfileId: params.authProfileId } : {},
			...resolvedAuth ? { resolvedAuth } : {},
			...params.skipLocalCredential ? { skipLocalCredential: true } : {}
		});
	}
	let store;
	let materializedProfile;
	if (params.authProfileId) {
		store = loadRouteAuthProfileStore(params.route, params.deps);
		const credential = store.profiles[params.authProfileId];
		if (!credential) return;
		if (credential.type === "oauth") return fingerprintAuthProfileCredential({
			profileId: params.authProfileId,
			credential
		});
		if (params.route.agentHarnessRuntimeOverride !== "openclaw") {
			const harnessId = params.route.agentHarnessRuntimeOverride;
			if ((getRegisteredAgentHarness(harnessId)?.harness)?.authBootstrap === "harness") return resolveAgentHarnessAuthBindingFingerprint({
				harnessId,
				authProfileId: params.authProfileId,
				authProfileStore: store,
				agentDir: params.route.agentDir,
				config: params.route.runConfig,
				deps: params.deps
			});
			materializedProfile = {
				profileId: params.authProfileId,
				credential
			};
		}
	}
	if (!params.modelId || !params.modelApi) return;
	const auth = await (params.deps.resolveApiKeyForProvider ?? resolveApiKeyForProviderCore)({
		store,
		provider: params.route.provider,
		cfg: params.route.runConfig,
		agentDir: params.route.agentDir,
		workspaceDir: resolveAgentWorkspaceDir(params.route.runConfig, params.route.agentId, process.env),
		...params.authProfileId ? {
			profileId: params.authProfileId,
			lockedProfile: true
		} : { allowAuthProfileFallback: false },
		modelId: params.modelId,
		modelApi: params.modelApi,
		secretSentinels: materializedProfile === void 0
	});
	if (params.authProfileId && auth.profileId !== params.authProfileId) return;
	if (materializedProfile) return auth.apiKey ? fingerprintResolvedAuthProfileCredential({
		...materializedProfile,
		resolvedAuth: auth
	}) : void 0;
	return fingerprintResolvedProviderAuth(auth);
}
async function createSystemAgentVerifiedInferenceBinding(params) {
	const deps = params.deps ?? {};
	const runConfig = cloneConfigWithResolutionFacts(params.executionRoute.runConfig);
	const configuredExecution = {
		...params.executionRoute,
		sourceConfig: cloneConfigWithResolutionFacts(params.executionRoute.sourceConfig),
		runConfig
	};
	const authProfileId = params.auth.authProfileId ?? configuredExecution.authProfileId;
	const modelId = params.auth.modelId?.trim();
	const modelApi = params.auth.modelApi?.trim();
	if (authProfileId) configuredExecution.authProfileId = authProfileId;
	const proofKind = params.auth.runtimeOwnerFingerprint ? "runtime-owner" : "credential";
	if (params.auth.authFingerprint && params.auth.runtimeOwnerFingerprint || !params.auth.authFingerprint && !params.auth.runtimeOwnerFingerprint) throw new Error("The successful inference run did not report one exact execution owner.");
	const runtimeOwnerId = params.auth.runtimeOwnerId?.trim();
	if (proofKind === "runtime-owner" && (!params.auth.runtimeOwnerKind || !runtimeOwnerId)) throw new Error("The successful inference run did not report its exact runtime owner.");
	let successfulHarnessId;
	if (configuredExecution.runner === "embedded") {
		const configuredHarnessId = configuredExecution.agentHarnessRuntimeOverride?.trim();
		const reportedHarnessId = params.auth.agentHarnessId?.trim();
		if ((!configuredHarnessId || configuredHarnessId === "auto") && !reportedHarnessId) throw new Error("The successful inference run did not report its exact agent harness.");
		if (reportedHarnessId && configuredHarnessId && configuredHarnessId !== "auto" && reportedHarnessId !== configuredHarnessId) throw new Error(`The successful inference run used agent harness "${reportedHarnessId}" instead of "${configuredHarnessId}".`);
		successfulHarnessId = reportedHarnessId ?? configuredHarnessId;
	}
	const execution = configuredExecution.runner === "embedded" ? {
		...configuredExecution,
		agentHarnessRuntimeOverride: successfulHarnessId
	} : configuredExecution;
	let currentRuntimeArtifactFingerprint;
	if (execution.runner === "cli") {
		if (!params.auth.runtimeArtifactFingerprint || !params.auth.runtimeArtifactId?.trim()) throw new Error("The successful CLI inference run did not report its runtime artifact.");
		currentRuntimeArtifactFingerprint = await (deps.resolveCliRuntimeArtifactFingerprint ?? resolveCliRuntimeArtifactFingerprint)({
			provider: execution.provider,
			config: execution.runConfig,
			agentId: execution.agentId,
			runtimeArtifactId: params.auth.runtimeArtifactId.trim()
		});
		if (currentRuntimeArtifactFingerprint !== params.auth.runtimeArtifactFingerprint) throw new Error("The successful CLI runtime artifact is no longer active.");
	}
	const pluginHarnessId = execution.runner === "embedded" && successfulHarnessId !== "openclaw" ? successfulHarnessId : void 0;
	if (pluginHarnessId) {
		if (params.auth.runtimeOwnerKind !== "plugin-harness" || runtimeOwnerId !== pluginHarnessId || !params.auth.runtimeArtifactId?.trim() || !params.auth.runtimeArtifactFingerprint) throw new Error("The successful inference harness did not report its exact runtime artifact.");
		const artifact = {
			id: params.auth.runtimeArtifactId.trim(),
			fingerprint: params.auth.runtimeArtifactFingerprint
		};
		if (!await validateAgentHarnessRuntimeArtifact({
			harnessId: pluginHarnessId,
			artifact,
			deps
		})) throw new Error("The successful inference harness runtime artifact is no longer active.");
		currentRuntimeArtifactFingerprint = artifact.fingerprint;
	}
	const currentAuthFingerprint = await (proofKind === "runtime-owner" ? resolveCurrentRuntimeOwnerFingerprint({
		route: execution,
		kind: params.auth.runtimeOwnerKind,
		runtimeOwnerId: params.auth.runtimeOwnerId,
		...authProfileId ? { authProfileId } : {},
		...params.auth.skipLocalCredential ? { skipLocalCredential: true } : {},
		...currentRuntimeArtifactFingerprint ? { runtimeArtifactFingerprint: currentRuntimeArtifactFingerprint } : {},
		deps
	}) : resolveCurrentAuthFingerprint({
		route: execution,
		...authProfileId ? { authProfileId } : {},
		...modelId ? { modelId } : {},
		...modelApi ? { modelApi } : {},
		...params.auth.skipLocalCredential ? { skipLocalCredential: true } : {},
		deps
	}));
	const reportedAuthFingerprint = params.auth.authFingerprint ?? params.auth.runtimeOwnerFingerprint;
	if (!currentAuthFingerprint || reportedAuthFingerprint !== currentAuthFingerprint) throw new Error("The successful inference credential is no longer the active route owner.");
	if (pluginHarnessId && resolveRouteHarnessOwnerPluginIds(params.configuredRoute.sourceConfig, execution).length === 0) throw new Error("The successful inference harness has no trusted manifest owner.");
	const { ownerPluginIds, ownerPluginArtifacts } = captureSystemAgentOwnerPluginArtifacts({
		config: params.configuredRoute.sourceConfig,
		executionRoute: execution,
		deps
	});
	return {
		configuredRoute: systemAgentRouteIdentity(params.configuredRoute),
		execution,
		executionFingerprint: await projectVerifiedExecutionFingerprint(params.configuredRoute.sourceConfig, execution, ownerPluginIds, deps),
		ownerPluginIds,
		ownerPluginArtifacts,
		auth: {
			...authProfileId ? { authProfileId } : {},
			...successfulHarnessId ? { agentHarnessId: successfulHarnessId } : {},
			...modelId ? { modelId } : {},
			...modelApi ? { modelApi } : {},
			authFingerprint: currentAuthFingerprint,
			...proofKind === "runtime-owner" ? { proofKind } : {},
			...params.auth.runtimeOwnerKind ? { runtimeOwnerKind: params.auth.runtimeOwnerKind } : {},
			...runtimeOwnerId ? { runtimeOwnerId } : {},
			...params.auth.runtimeArtifactFingerprint ? { runtimeArtifactFingerprint: params.auth.runtimeArtifactFingerprint } : {},
			...params.auth.runtimeArtifactId ? { runtimeArtifactId: params.auth.runtimeArtifactId.trim() } : {},
			...params.auth.skipLocalCredential ? { skipLocalCredential: true } : {}
		}
	};
}
/** Re-hash plugin-owned runtime files only at a persistent side-effect boundary. */
async function hasCurrentSystemAgentOwnerPluginArtifacts(binding, deps = {}) {
	const snapshot = await (deps.readConfigFileSnapshot ?? (await import("./config/config.js")).readConfigFileSnapshot)();
	if (!snapshot.exists || !snapshot.valid) return false;
	const config = snapshot.runtimeConfig ?? snapshot.config;
	try {
		const ownerPluginIds = resolveRouteOwnerPluginIds(config, binding.execution);
		if (!isDeepStrictEqual(ownerPluginIds, binding.ownerPluginIds)) return false;
		return isDeepStrictEqual(projectOwnerPluginArtifacts({
			config,
			route: binding.execution,
			ownerPluginIds,
			deps
		}), binding.ownerPluginArtifacts);
	} catch {
		return false;
	}
}
/**
* Re-check authored route ownership, then return only the frozen verified run.
* Workspace/channel changes are excluded; broad plugin/env/tool config cannot
* switch this frozen run, while relevant runtime plugin membership and the
* actual selected credential are checked explicitly.
*/
async function resolveSystemAgentVerifiedInferenceState(binding, deps = {}) {
	const snapshot = await (deps.readConfigFileSnapshot ?? (await import("./config/config.js")).readConfigFileSnapshot)();
	if (!snapshot.exists || !snapshot.valid) return null;
	const config = snapshot.runtimeConfig ?? snapshot.config;
	const currentRoute = await resolveSystemAgentConfiguredRouteFromConfig(config, binding.execution.agentId, deps, snapshot);
	if (!currentRoute || !isDeepStrictEqual(systemAgentRouteIdentity(currentRoute), binding.configuredRoute)) return null;
	const currentExecution = {
		...binding.execution,
		sourceConfig: currentRoute.sourceConfig,
		runConfig: currentRoute.runConfig
	};
	let currentOwnerPluginIds;
	let currentFingerprint;
	try {
		currentOwnerPluginIds = resolveRouteOwnerPluginIds(config, currentExecution);
		if (!isDeepStrictEqual(currentOwnerPluginIds, binding.ownerPluginIds)) return null;
		currentFingerprint = await projectVerifiedExecutionFingerprint(config, currentExecution, currentOwnerPluginIds, deps);
	} catch {
		return null;
	}
	if (!isDeepStrictEqual(currentFingerprint, binding.executionFingerprint)) return null;
	if (binding.execution.runner === "embedded" && binding.auth.agentHarnessId !== binding.execution.agentHarnessRuntimeOverride) return null;
	let currentRuntimeArtifactFingerprint;
	if (binding.execution.runner === "cli") {
		currentRuntimeArtifactFingerprint = await (deps.resolveCliRuntimeArtifactFingerprint ?? resolveCliRuntimeArtifactFingerprint)({
			provider: currentExecution.provider,
			config: currentExecution.runConfig,
			agentId: currentExecution.agentId,
			runtimeArtifactId: binding.auth.runtimeArtifactId
		}).catch(() => void 0);
		if (currentRuntimeArtifactFingerprint !== binding.auth.runtimeArtifactFingerprint) return null;
	} else if (binding.execution.runner === "embedded" && binding.execution.agentHarnessRuntimeOverride !== "openclaw") {
		const harnessId = binding.execution.agentHarnessRuntimeOverride;
		const artifactId = binding.auth.runtimeArtifactId?.trim();
		const artifactFingerprint = binding.auth.runtimeArtifactFingerprint;
		if (!harnessId || !artifactId || !artifactFingerprint) return null;
		if (!await validateAgentHarnessRuntimeArtifact({
			harnessId,
			artifact: {
				id: artifactId,
				fingerprint: artifactFingerprint
			},
			deps
		})) return null;
		currentRuntimeArtifactFingerprint = artifactFingerprint;
	}
	if (await (binding.auth.proofKind === "runtime-owner" ? resolveCurrentRuntimeOwnerFingerprint({
		route: currentExecution,
		kind: binding.auth.runtimeOwnerKind,
		runtimeOwnerId: binding.auth.runtimeOwnerId,
		...binding.auth.authProfileId ? { authProfileId: binding.auth.authProfileId } : {},
		...binding.auth.skipLocalCredential ? { skipLocalCredential: true } : {},
		...currentRuntimeArtifactFingerprint ? { runtimeArtifactFingerprint: currentRuntimeArtifactFingerprint } : {},
		deps
	}) : resolveCurrentAuthFingerprint({
		route: currentExecution,
		...binding.auth.authProfileId ? { authProfileId: binding.auth.authProfileId } : {},
		...binding.auth.modelId ? { modelId: binding.auth.modelId } : {},
		...binding.auth.modelApi ? { modelApi: binding.auth.modelApi } : {},
		...binding.auth.skipLocalCredential ? { skipLocalCredential: true } : {},
		deps
	})).catch(() => void 0) !== binding.auth.authFingerprint) return null;
	return {
		config,
		route: binding.execution
	};
}
async function resolveSystemAgentVerifiedInferenceRoute(binding, deps = {}) {
	return (await resolveSystemAgentVerifiedInferenceState(binding, deps))?.route ?? null;
}
//#endregion
export { resolveSystemAgentVerifiedInferenceRoute as a, resolveSystemAgentExpectedAgentHarnessRuntimeArtifact as i, createSystemAgentVerifiedInferenceBinding as n, resolveSystemAgentVerifiedInferenceState as o, hasCurrentSystemAgentOwnerPluginArtifacts as r, captureSystemAgentOwnerPluginArtifacts as t };
