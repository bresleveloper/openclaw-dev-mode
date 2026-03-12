import { Fo as setRuntimeConfigSnapshot, Io as setRuntimeConfigSnapshotRefreshHandler, Tc as replaceRuntimeAuthProfileStoreSnapshots, co as isNonEmptyString, kc as resolveOpenClawAgentDir, oo as resolveSecretRefValues, wc as loadAuthProfileStoreForSecretsRuntime, wo as clearRuntimeConfigSnapshot, xc as clearRuntimeAuthProfileStoreSnapshots } from "./auth-profiles-CIqoN6FN.js";
import { a as resolveAgentDir, r as listAgentIds } from "./agent-scope-BAb0j1gt.js";
import { v as resolveUserPath } from "./utils-DMInpDZe.js";
import { d as resolveSecretInputRef } from "./types.secrets-BEA4gMCN.js";
import { a as applyResolvedAssignments, c as pushWarning, n as collectConfigAssignments, o as createResolverContext, s as pushAssignment, t as resolveRuntimeWebTools, u as collectCommandSecretAssignmentsFromSnapshot } from "./runtime-web-tools-BLhk2bwq.js";
//#region src/secrets/runtime-auth-collectors.ts
function collectApiKeyProfileAssignment(params) {
	const { explicitRef: keyRef, inlineRef: inlineKeyRef, ref: resolvedKeyRef } = resolveSecretInputRef({
		value: params.profile.key,
		refValue: params.profile.keyRef,
		defaults: params.defaults
	});
	if (!resolvedKeyRef) return;
	if (!keyRef && inlineKeyRef) params.profile.keyRef = inlineKeyRef;
	if (keyRef && isNonEmptyString(params.profile.key)) pushWarning(params.context, {
		code: "SECRETS_REF_OVERRIDES_PLAINTEXT",
		path: `${params.agentDir}.auth-profiles.${params.profileId}.key`,
		message: `auth-profiles ${params.profileId}: keyRef is set; runtime will ignore plaintext key.`
	});
	pushAssignment(params.context, {
		ref: resolvedKeyRef,
		path: `${params.agentDir}.auth-profiles.${params.profileId}.key`,
		expected: "string",
		apply: (value) => {
			params.profile.key = String(value);
		}
	});
}
function collectTokenProfileAssignment(params) {
	const { explicitRef: tokenRef, inlineRef: inlineTokenRef, ref: resolvedTokenRef } = resolveSecretInputRef({
		value: params.profile.token,
		refValue: params.profile.tokenRef,
		defaults: params.defaults
	});
	if (!resolvedTokenRef) return;
	if (!tokenRef && inlineTokenRef) params.profile.tokenRef = inlineTokenRef;
	if (tokenRef && isNonEmptyString(params.profile.token)) pushWarning(params.context, {
		code: "SECRETS_REF_OVERRIDES_PLAINTEXT",
		path: `${params.agentDir}.auth-profiles.${params.profileId}.token`,
		message: `auth-profiles ${params.profileId}: tokenRef is set; runtime will ignore plaintext token.`
	});
	pushAssignment(params.context, {
		ref: resolvedTokenRef,
		path: `${params.agentDir}.auth-profiles.${params.profileId}.token`,
		expected: "string",
		apply: (value) => {
			params.profile.token = String(value);
		}
	});
}
function collectAuthStoreAssignments(params) {
	const defaults = params.context.sourceConfig.secrets?.defaults;
	for (const [profileId, profile] of Object.entries(params.store.profiles)) {
		if (profile.type === "api_key") {
			collectApiKeyProfileAssignment({
				profile,
				profileId,
				agentDir: params.agentDir,
				defaults,
				context: params.context
			});
			continue;
		}
		if (profile.type === "token") collectTokenProfileAssignment({
			profile,
			profileId,
			agentDir: params.agentDir,
			defaults,
			context: params.context
		});
	}
}
//#endregion
//#region src/secrets/runtime.ts
let activeSnapshot = null;
let activeRefreshContext = null;
const preparedSnapshotRefreshContext = /* @__PURE__ */ new WeakMap();
function cloneSnapshot(snapshot) {
	return {
		sourceConfig: structuredClone(snapshot.sourceConfig),
		config: structuredClone(snapshot.config),
		authStores: snapshot.authStores.map((entry) => ({
			agentDir: entry.agentDir,
			store: structuredClone(entry.store)
		})),
		warnings: snapshot.warnings.map((warning) => ({ ...warning })),
		webTools: structuredClone(snapshot.webTools)
	};
}
function cloneRefreshContext(context) {
	return {
		env: { ...context.env },
		explicitAgentDirs: context.explicitAgentDirs ? [...context.explicitAgentDirs] : null,
		loadAuthStore: context.loadAuthStore
	};
}
function clearActiveSecretsRuntimeState() {
	activeSnapshot = null;
	activeRefreshContext = null;
	setRuntimeConfigSnapshotRefreshHandler(null);
	clearRuntimeConfigSnapshot();
	clearRuntimeAuthProfileStoreSnapshots();
}
function collectCandidateAgentDirs(config) {
	const dirs = /* @__PURE__ */ new Set();
	dirs.add(resolveUserPath(resolveOpenClawAgentDir()));
	for (const agentId of listAgentIds(config)) dirs.add(resolveUserPath(resolveAgentDir(config, agentId)));
	return [...dirs];
}
function resolveRefreshAgentDirs(config, context) {
	const configDerived = collectCandidateAgentDirs(config);
	if (!context.explicitAgentDirs || context.explicitAgentDirs.length === 0) return configDerived;
	return [...new Set([...context.explicitAgentDirs, ...configDerived])];
}
async function prepareSecretsRuntimeSnapshot(params) {
	const sourceConfig = structuredClone(params.config);
	const resolvedConfig = structuredClone(params.config);
	const context = createResolverContext({
		sourceConfig,
		env: params.env ?? process.env
	});
	collectConfigAssignments({
		config: resolvedConfig,
		context
	});
	const loadAuthStore = params.loadAuthStore ?? loadAuthProfileStoreForSecretsRuntime;
	const candidateDirs = params.agentDirs?.length ? [...new Set(params.agentDirs.map((entry) => resolveUserPath(entry)))] : collectCandidateAgentDirs(resolvedConfig);
	const authStores = [];
	for (const agentDir of candidateDirs) {
		const store = structuredClone(loadAuthStore(agentDir));
		collectAuthStoreAssignments({
			store,
			context,
			agentDir
		});
		authStores.push({
			agentDir,
			store
		});
	}
	if (context.assignments.length > 0) {
		const resolved = await resolveSecretRefValues(context.assignments.map((assignment) => assignment.ref), {
			config: sourceConfig,
			env: context.env,
			cache: context.cache
		});
		applyResolvedAssignments({
			assignments: context.assignments,
			resolved
		});
	}
	const snapshot = {
		sourceConfig,
		config: resolvedConfig,
		authStores,
		warnings: context.warnings,
		webTools: await resolveRuntimeWebTools({
			sourceConfig,
			resolvedConfig,
			context
		})
	};
	preparedSnapshotRefreshContext.set(snapshot, {
		env: { ...params.env ?? process.env },
		explicitAgentDirs: params.agentDirs?.length ? [...candidateDirs] : null,
		loadAuthStore
	});
	return snapshot;
}
function activateSecretsRuntimeSnapshot(snapshot) {
	const next = cloneSnapshot(snapshot);
	const refreshContext = preparedSnapshotRefreshContext.get(snapshot) ?? activeRefreshContext ?? {
		env: { ...process.env },
		explicitAgentDirs: null,
		loadAuthStore: loadAuthProfileStoreForSecretsRuntime
	};
	setRuntimeConfigSnapshot(next.config, next.sourceConfig);
	replaceRuntimeAuthProfileStoreSnapshots(next.authStores);
	activeSnapshot = next;
	activeRefreshContext = cloneRefreshContext(refreshContext);
	setRuntimeConfigSnapshotRefreshHandler({ refresh: async ({ sourceConfig }) => {
		if (!activeSnapshot || !activeRefreshContext) return false;
		activateSecretsRuntimeSnapshot(await prepareSecretsRuntimeSnapshot({
			config: sourceConfig,
			env: activeRefreshContext.env,
			agentDirs: resolveRefreshAgentDirs(sourceConfig, activeRefreshContext),
			loadAuthStore: activeRefreshContext.loadAuthStore
		}));
		return true;
	} });
}
function getActiveSecretsRuntimeSnapshot() {
	if (!activeSnapshot) return null;
	const snapshot = cloneSnapshot(activeSnapshot);
	if (activeRefreshContext) preparedSnapshotRefreshContext.set(snapshot, cloneRefreshContext(activeRefreshContext));
	return snapshot;
}
function getActiveRuntimeWebToolsMetadata() {
	if (!activeSnapshot) return null;
	return structuredClone(activeSnapshot.webTools);
}
function resolveCommandSecretsFromActiveRuntimeSnapshot(params) {
	if (!activeSnapshot) throw new Error("Secrets runtime snapshot is not active.");
	if (params.targetIds.size === 0) return {
		assignments: [],
		diagnostics: [],
		inactiveRefPaths: []
	};
	const inactiveRefPaths = [...new Set(activeSnapshot.warnings.filter((warning) => warning.code === "SECRETS_REF_IGNORED_INACTIVE_SURFACE").map((warning) => warning.path))];
	const resolved = collectCommandSecretAssignmentsFromSnapshot({
		sourceConfig: activeSnapshot.sourceConfig,
		resolvedConfig: activeSnapshot.config,
		commandName: params.commandName,
		targetIds: params.targetIds,
		inactiveRefPaths: new Set(inactiveRefPaths)
	});
	return {
		assignments: resolved.assignments,
		diagnostics: resolved.diagnostics,
		inactiveRefPaths
	};
}
function clearSecretsRuntimeSnapshot() {
	clearActiveSecretsRuntimeState();
}
//#endregion
export { prepareSecretsRuntimeSnapshot as a, getActiveSecretsRuntimeSnapshot as i, clearSecretsRuntimeSnapshot as n, resolveCommandSecretsFromActiveRuntimeSnapshot as o, getActiveRuntimeWebToolsMetadata as r, activateSecretsRuntimeSnapshot as t };
