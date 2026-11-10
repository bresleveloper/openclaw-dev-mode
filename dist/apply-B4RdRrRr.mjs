import { t as hasNonEmptyString } from "./string-coerce-1VuiLaaR.mjs";
import { o as resolveUserPath } from "./home-dir-CtsdYvX3.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { a as coerceSecretRef } from "./types.secrets-Dgbd2kyP.mjs";
import "./utils-gjJ-tD2q.mjs";
import { r as resolveStateDir } from "./state-dir-C8s3cOPX.mjs";
import { r as normalizeProviderId } from "./provider-id-D1VImdKk.mjs";
import { a as resolveAgentDir } from "./agent-scope-config-fjA2T9Gz.mjs";
import { o as normalizePluginConfigId } from "./provider-auth-aliases-DCRcDae6.mjs";
import { g as coercePersistedAuthProfileStore } from "./user-model-account-authority-DFFjC5J5.mjs";
import { i as loadPersistedSharedAuthProfileStore, n as loadPersistedAuthProfileStore } from "./persisted-DbIYEoQ3.mjs";
import { v as resolveAuthProfileDatabasePath } from "./sqlite-BlFpr2YD.mjs";
import { d as resolveSharedAuthStorePath } from "./path-resolve-21Orzn6B.mjs";
import "./agent-scope-DXrnO3F4.mjs";
import { i as listKnownSecretEnvVarNames } from "./provider-env-vars-D43Pu6eG.mjs";
import { r as parseEnvValue } from "./shared-BVDjoVcf.mjs";
import { p as assertExpectedResolvedSecretValue } from "./runtime-shared-DqMZ_k3n.mjs";
import { n as getPath, r as setPathCreateStrict, t as deletePathStrict } from "./path-utils-aDSU1mEq.mjs";
import { r as replaceConfigFile } from "./mutate-h3hU3xe4.mjs";
import "./config-B3oiWDlr.mjs";
import "./model-selection-DdQ-ffuG.mjs";
import { n as captureAuthProfileStorePersistenceSnapshot, p as restoreAuthProfileStorePersistenceSnapshot } from "./store-BPXZsh12.mjs";
import { p as loadAuthProfileStoreForSecretsRuntime, x as saveAuthProfileStoreIfPersistenceSnapshotMatches } from "./store-runtime-CwqGD12G.mjs";
import { n as resolveSecretRefValue } from "./resolve-D1-YVpS6.mjs";
import "./auth-profiles-DB76NhmT.mjs";
import { n as listSecretsDotEnvPaths } from "./storage-scan-DiuSHndC.mjs";
import { t as getSkippedExecRefStaticError } from "./exec-resolution-policy-DxaB7Xe4.mjs";
import { a as prepareSecretsRuntimeSnapshot } from "./runtime-Dnoq_32U.mjs";
import { i as iterateAuthProfileCredentials, n as writeTextFileAtomic, r as listAuthProfileStoreTargets, t as createSecretsConfigIO } from "./config-io-CIWrveRv.mjs";
import { n as normalizeSecretsPlanOptions, r as resolveValidatedPlanTarget } from "./plan-CQz_qA7x.mjs";
import fs from "node:fs";
import os from "node:os";
import { isDeepStrictEqual } from "node:util";
//#region src/secrets/apply.ts
/** Applies secrets migration plans across config files, auth stores, and env files. */
function planContainsExecReferences(plan) {
	if (plan.targets.some((target) => target.ref.source === "exec")) return true;
	return Object.values(plan.providerUpserts ?? {}).some((provider) => provider.source === "exec");
}
function hasPluginPolicyId(list, pluginId) {
	return Array.isArray(list) && list.some((entry) => normalizePluginConfigId(entry) === pluginId);
}
function findPluginEntry(entries, pluginId) {
	if (!isRecord(entries)) return;
	for (const [key, value] of Object.entries(entries)) {
		if (normalizePluginConfigId(key) !== pluginId) continue;
		return isRecord(value) ? value : {};
	}
}
function resolveTarget(target) {
	const resolved = resolveValidatedPlanTarget(target);
	if (!resolved) throw new Error(`Invalid plan target path for ${target.type}: ${target.path}`);
	return resolved;
}
function scrubEnvRaw(raw, migratedValues, allowedEnvKeys) {
	if (migratedValues.size === 0 || allowedEnvKeys.size === 0) return raw;
	const lines = raw.split(/\r?\n/);
	const nextLines = lines.filter((line) => {
		const match = line.match(/^\s*(?:export\s+)?([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/);
		return !match || !allowedEnvKeys.has(match[1] ?? "") || !migratedValues.has(parseEnvValue(match[2] ?? ""));
	});
	if (nextLines.length === lines.length) return raw;
	const hadTrailingNewline = raw.endsWith("\n");
	const joined = nextLines.join("\n");
	return hadTrailingNewline || joined.length === 0 ? `${joined}${joined.endsWith("\n") ? "" : "\n"}` : joined;
}
function applyProviderPlanMutations(params) {
	const currentProviders = params.config.secrets?.providers ?? {};
	let changed = false;
	for (const providerAlias of params.deletes ?? []) {
		if (!Object.hasOwn(currentProviders, providerAlias)) continue;
		delete currentProviders[providerAlias];
		changed = true;
	}
	for (const [providerAlias, providerConfig] of Object.entries(params.upserts ?? {})) {
		const previous = currentProviders[providerAlias];
		if (isDeepStrictEqual(previous, providerConfig)) continue;
		currentProviders[providerAlias] = structuredClone(providerConfig);
		changed = true;
	}
	for (const providerConfig of Object.values(params.upserts ?? {})) {
		if (providerConfig.source !== "exec" || !("pluginIntegration" in providerConfig)) continue;
		const pluginId = normalizePluginConfigId(providerConfig.pluginIntegration.pluginId);
		params.config.plugins ??= {};
		if (params.config.plugins.enabled === false) throw new Error(`Cannot apply plugin-managed SecretRef provider "${pluginId}" because plugins.enabled is false. Enable plugins before applying this plan.`);
		if (hasPluginPolicyId(params.config.plugins.deny, pluginId)) throw new Error(`Cannot apply plugin-managed SecretRef provider "${pluginId}" because plugins.deny includes "${pluginId}". Remove the deny rule before applying this plan.`);
		const previousEntry = findPluginEntry(params.config.plugins.entries, pluginId);
		if (previousEntry?.enabled === false) throw new Error(`Cannot apply plugin-managed SecretRef provider "${pluginId}" because plugins.entries.${pluginId}.enabled is false. Enable the plugin explicitly before applying this plan.`);
		if (Array.isArray(params.config.plugins.allow) && params.config.plugins.allow.length > 0 && !hasPluginPolicyId(params.config.plugins.allow, pluginId)) throw new Error(`Cannot apply plugin-managed SecretRef provider "${pluginId}" because plugins.allow does not include "${pluginId}". Add the plugin to plugins.allow before applying this plan.`);
		params.config.plugins.entries ??= {};
		if (previousEntry?.enabled === true) continue;
		params.config.plugins.entries[pluginId] = {
			...isRecord(previousEntry) ? previousEntry : {},
			enabled: true
		};
		changed = true;
	}
	if (!changed) return false;
	params.config.secrets ??= {};
	if (Object.keys(currentProviders).length === 0) {
		if ("providers" in params.config.secrets) delete params.config.secrets.providers;
		return true;
	}
	params.config.secrets.providers = currentProviders;
	return true;
}
async function projectPlanState(params) {
	const { snapshot, writeOptions } = await createSecretsConfigIO({ env: params.env }).readConfigFileSnapshotForWrite();
	if (!snapshot.valid) throw new Error("Cannot apply secrets plan: config is invalid.");
	const options = normalizeSecretsPlanOptions(params.plan.options);
	const nextConfig = structuredClone(snapshot.config);
	const stateDir = resolveStateDir(params.env, os.homedir);
	const authStoreEnv = {
		...params.env,
		OPENCLAW_STATE_DIR: stateDir
	};
	const changedFiles = /* @__PURE__ */ new Set();
	const warnings = [];
	const configPath = resolveUserPath(snapshot.path);
	if (applyProviderPlanMutations({
		config: nextConfig,
		upserts: params.plan.providerUpserts,
		deletes: params.plan.providerDeletes
	})) changedFiles.add(configPath);
	const targetMutations = applyConfigTargetMutations({
		planTargets: params.plan.targets,
		nextConfig,
		stateDir,
		env: params.env,
		changedFiles
	});
	if (targetMutations.configChanged) changedFiles.add(configPath);
	scrubAuthStoresForProviderTargets({
		nextConfig,
		stateDir,
		env: params.env,
		providerTargets: targetMutations.providerTargets,
		scrubbedValues: targetMutations.scrubbedValues,
		authStores: targetMutations.authStores,
		changedFiles,
		warnings,
		enabled: options.scrubAuthProfilesForProviderTargets
	});
	const envRawByPath = scrubEnvFiles({
		configPath,
		stateDir,
		scrubbedValues: targetMutations.scrubbedValues,
		changedFiles,
		enabled: options.scrubEnv
	});
	const checkFullRuntime = params.write ? changedFiles.size > 0 : params.allowExecInDryRun;
	const validation = await validateProjectedSecretsState({
		env: params.env,
		nextConfig,
		resolvedTargets: targetMutations.resolvedTargets,
		authStores: targetMutations.authStores,
		write: params.write,
		allowExecInDryRun: params.allowExecInDryRun,
		checkFullRuntime
	});
	return {
		nextConfig,
		authStoreEnv,
		configSnapshot: snapshot,
		configPath,
		configWriteOptions: writeOptions,
		authStores: targetMutations.authStores,
		envRawByPath,
		changedFiles,
		warnings,
		refsChecked: validation.refsChecked,
		skippedExecRefs: validation.skippedExecRefs,
		resolvabilityComplete: validation.resolvabilityComplete
	};
}
function applyConfigTargetMutations(params) {
	const authStores = /* @__PURE__ */ new Map();
	const resolvedTargets = params.planTargets.map((target) => ({
		target,
		resolved: resolveTarget(target)
	}));
	const scrubbedValues = /* @__PURE__ */ new Set();
	const providerTargets = /* @__PURE__ */ new Set();
	let configChanged = false;
	for (const { target, resolved } of resolvedTargets) {
		if (resolved.entry.configFile === "auth-profile-store") {
			const { path, store } = resolveAuthStoreForTarget({
				target,
				nextConfig: params.nextConfig,
				stateDir: params.stateDir,
				env: params.env,
				authStores
			});
			const containerChanged = ensureAuthProfileContainer({
				target,
				resolved,
				store
			});
			const refChanged = applySecretRefTargetMutation(store, target, resolved, scrubbedValues);
			if (containerChanged || refChanged) params.changedFiles.add(path);
			continue;
		}
		if (applySecretRefTargetMutation(params.nextConfig, target, resolved, scrubbedValues)) configChanged = true;
		if (resolved.entry.secretShape !== "sibling_ref" && resolved.entry.trackProviderShadowing && resolved.providerId) providerTargets.add(normalizeProviderId(resolved.providerId));
	}
	return {
		resolvedTargets,
		scrubbedValues,
		providerTargets,
		configChanged,
		authStores
	};
}
function scrubAuthStoresForProviderTargets(params) {
	if (!params.enabled || params.providerTargets.size === 0) return;
	for (const target of listAuthProfileStoreTargets(params.nextConfig, params.stateDir, params.env)) {
		const authStorePath = target.path;
		const existing = params.authStores.get(authStorePath)?.store;
		if (!existing && !fs.existsSync(authStorePath)) continue;
		const parsed = existing ?? (target.kind === "shared" ? loadPersistedSharedAuthProfileStore(target.env) : loadPersistedAuthProfileStore(target.agentDir));
		if (!parsed || !isRecord(parsed.profiles)) continue;
		let mutated = false;
		for (const profile of iterateAuthProfileCredentials(parsed.profiles)) {
			const provider = normalizeProviderId(profile.provider);
			if (!params.providerTargets.has(provider)) continue;
			if (profile.kind === "api_key" || profile.kind === "token") {
				if (hasNonEmptyString(profile.value)) params.scrubbedValues.add(profile.value.trim());
				if (profile.valueField in profile.profile) {
					delete profile.profile[profile.valueField];
					mutated = true;
				}
				if (profile.refField in profile.profile && coerceSecretRef(profile.refValue, params.nextConfig.secrets?.defaults) === null) {
					delete profile.profile[profile.refField];
					mutated = true;
				}
				continue;
			}
			if (profile.kind === "oauth" && (profile.hasAccess || profile.hasRefresh)) params.warnings.push(`Provider "${provider}" has OAuth credentials in ${authStorePath}; those still take precedence and are out of scope for static SecretRef migration.`);
		}
		if (mutated) {
			params.authStores.set(authStorePath, {
				store: parsed,
				target
			});
			params.changedFiles.add(authStorePath);
		}
	}
}
function resolveAuthStoreForTarget(params) {
	const agentId = (params.target.agentId ?? "").trim();
	if (!agentId) throw new Error(`Missing required agentId for auth-profiles target ${params.target.path}.`);
	const scopedEnv = {
		...params.env,
		OPENCLAW_STATE_DIR: params.stateDir,
		OPENCLAW_AGENT_DIR: void 0
	};
	const agentDir = resolveAgentDir(params.nextConfig, agentId, scopedEnv);
	const authStoreTarget = {
		kind: "agent",
		agentDir,
		path: resolveAuthProfileDatabasePath(agentDir)
	};
	const authStorePath = authStoreTarget.path;
	const loaded = params.authStores.get(authStorePath)?.store ?? loadPersistedAuthProfileStore(authStoreTarget.agentDir);
	const next = isRecord(loaded) ? loaded : {};
	const profiles = isRecord(next.profiles) ? next.profiles : {};
	if (typeof next.version !== "number" || !Number.isFinite(next.version)) next.version = 1;
	const store = {
		...next,
		profiles
	};
	params.authStores.set(authStorePath, {
		store,
		target: authStoreTarget
	});
	return {
		path: authStorePath,
		store
	};
}
function ensureAuthProfileContainer(params) {
	const profilePathSegments = params.resolved.pathSegments.slice(0, 2);
	const profileId = profilePathSegments[1];
	if (!profileId) throw new Error(`Invalid auth profile target path: ${params.target.path}`);
	const current = getPath(params.store, profilePathSegments);
	const expectedType = params.resolved.entry.authProfileType;
	if (isRecord(current)) {
		if (expectedType && typeof current.type === "string" && current.type !== expectedType) throw new Error(`Auth profile "${profileId}" type mismatch for ${params.target.path}: expected "${expectedType}", got "${current.type}".`);
		if (!hasNonEmptyString(current.provider) && hasNonEmptyString(params.target.authProfileProvider)) return setPathCreateStrict(params.store, [...profilePathSegments, "provider"], params.target.authProfileProvider);
		return false;
	}
	if (!expectedType) throw new Error(`Auth profile target ${params.target.path} is missing auth profile type metadata.`);
	const provider = (params.target.authProfileProvider ?? "").trim();
	if (!provider) throw new Error(`Cannot create auth profile "${profileId}" for ${params.target.path} without authProfileProvider.`);
	return setPathCreateStrict(params.store, profilePathSegments, {
		type: expectedType,
		provider
	});
}
function applySecretRefTargetMutation(root, target, resolved, scrubbedValues) {
	const previous = getPath(root, resolved.pathSegments);
	if (hasNonEmptyString(previous)) scrubbedValues.add(previous.trim());
	if (resolved.entry.secretShape === "sibling_ref") {
		const refPathTokens = resolved.refPathTokens;
		if (!refPathTokens) throw new Error(resolved.entry.configFile === "auth-profile-store" ? `Missing sibling ref path for auth-profiles target ${target.path}.` : `Missing sibling ref path for target ${target.type}.`);
		const wroteRef = setPathCreateStrict(root, refPathTokens, target.ref);
		const deletedPlaintext = deletePathStrict(root, resolved.pathSegments);
		return wroteRef || deletedPlaintext;
	}
	return setPathCreateStrict(root, resolved.pathTokens, target.ref);
}
function scrubEnvFiles(params) {
	const envRawByPath = /* @__PURE__ */ new Map();
	if (!params.enabled || params.scrubbedValues.size === 0) return envRawByPath;
	const knownSecretEnvVars = new Set(listKnownSecretEnvVarNames());
	for (const envPath of listSecretsDotEnvPaths({
		configPath: params.configPath,
		stateDir: params.stateDir
	})) {
		if (!fs.existsSync(envPath)) continue;
		const current = fs.readFileSync(envPath, "utf8");
		const scrubbed = scrubEnvRaw(current, params.scrubbedValues, knownSecretEnvVars);
		if (scrubbed !== current) {
			envRawByPath.set(envPath, scrubbed);
			params.changedFiles.add(envPath);
		}
	}
	return envRawByPath;
}
async function validateProjectedSecretsState(params) {
	const cache = {};
	let refsChecked = 0;
	let skippedExecRefs = 0;
	for (const { target, resolved: resolvedTarget } of params.resolvedTargets) {
		if (!params.write && target.ref.source === "exec" && !params.allowExecInDryRun) {
			skippedExecRefs += 1;
			const staticError = getSkippedExecRefStaticError({
				ref: target.ref,
				config: params.nextConfig
			});
			if (staticError) throw new Error(staticError);
			continue;
		}
		const resolved = await resolveSecretRefValue(target.ref, {
			config: params.nextConfig,
			env: params.env,
			cache
		});
		refsChecked += 1;
		assertExpectedResolvedSecretValue({
			value: resolved,
			expected: resolvedTarget.entry.expectedResolvedValue,
			errorMessage: resolvedTarget.entry.expectedResolvedValue === "string" ? `Ref ${target.ref.source}:${target.ref.provider}:${target.ref.id} is not a non-empty string.` : `Ref ${target.ref.source}:${target.ref.provider}:${target.ref.id} is not string/object.`
		});
	}
	const authStoreLookup = /* @__PURE__ */ new Map();
	for (const [authStorePath, { store }] of params.authStores) authStoreLookup.set(resolveUserPath(authStorePath, params.env), store);
	if (params.checkFullRuntime) await prepareSecretsRuntimeSnapshot({
		config: params.nextConfig,
		env: params.env,
		includeAuthStoreRefs: params.write || params.authStores.size > 0,
		loadAuthStore: (agentDir) => {
			const storePath = resolveUserPath(agentDir ? resolveAuthProfileDatabasePath(agentDir) : resolveSharedAuthStorePath(params.env), params.env);
			const override = authStoreLookup.get(storePath);
			if (override) return coercePersistedAuthProfileStore(override) ?? {
				version: 1,
				profiles: {}
			};
			return loadAuthProfileStoreForSecretsRuntime(agentDir);
		}
	});
	return {
		refsChecked,
		skippedExecRefs,
		resolvabilityComplete: params.write || params.allowExecInDryRun || skippedExecRefs === 0
	};
}
function captureFileSnapshot(pathname) {
	if (!fs.existsSync(pathname)) return {
		existed: false,
		content: "",
		mode: 384
	};
	const stat = fs.statSync(pathname);
	return {
		existed: true,
		content: fs.readFileSync(pathname, "utf8"),
		mode: stat.mode & 511
	};
}
function restoreFileSnapshot(pathname, snapshot, env) {
	if (!snapshot.existed) {
		if (fs.existsSync(pathname)) fs.rmSync(pathname, { force: true });
		return;
	}
	writeTextFileAtomic(pathname, snapshot.content, snapshot.mode || 384, env);
}
/** Applies a normalized secrets plan, or reports file/auth-store changes in dry-run mode. */
async function runSecretsApply(params) {
	const env = params.env ?? process.env;
	const write = params.write === true;
	const allowExec = Boolean(params.allowExec);
	if (write && planContainsExecReferences(params.plan) && !allowExec) throw new Error("Plan contains exec SecretRefs/providers. Re-run with --allow-exec.");
	const allowExecInDryRun = write ? true : allowExec;
	const projected = await projectPlanState({
		plan: params.plan,
		env,
		write,
		allowExecInDryRun
	});
	const changedFiles = [...projected.changedFiles].toSorted();
	const result = {
		mode: write ? "write" : "dry-run",
		changed: changedFiles.length > 0,
		changedFiles,
		checks: {
			resolvability: true,
			resolvabilityComplete: projected.resolvabilityComplete
		},
		refsChecked: projected.refsChecked,
		skippedExecRefs: projected.skippedExecRefs,
		warningCount: projected.warnings.length,
		warnings: projected.warnings
	};
	if (!write || changedFiles.length === 0) return result;
	const io = createSecretsConfigIO({ env });
	const snapshots = /* @__PURE__ */ new Map();
	const authStoreSnapshots = /* @__PURE__ */ new Map();
	const capture = (pathname) => {
		if (!snapshots.has(pathname)) snapshots.set(pathname, captureFileSnapshot(pathname));
	};
	capture(projected.configPath);
	for (const pathname of projected.envRawByPath.keys()) capture(pathname);
	for (const [pathname, { target }] of projected.authStores) authStoreSnapshots.set(pathname, {
		target,
		persistence: captureAuthProfileStorePersistenceSnapshot(target.kind === "agent" ? target.agentDir : void 0, { env: target.kind === "shared" ? target.env : projected.authStoreEnv })
	});
	try {
		await replaceConfigFile({
			nextConfig: projected.nextConfig,
			snapshot: projected.configSnapshot,
			writeOptions: projected.configWriteOptions,
			io,
			afterWrite: { mode: "auto" }
		});
		for (const [pathname, raw] of projected.envRawByPath.entries()) writeTextFileAtomic(pathname, raw, 384, env);
		for (const [pathname, { store: value, target }] of projected.authStores) {
			const store = coercePersistedAuthProfileStore(value);
			if (store) {
				const snapshot = authStoreSnapshots.get(pathname);
				if (!snapshot) throw new Error(`missing captured auth profile store for ${pathname}`);
				const committed = saveAuthProfileStoreIfPersistenceSnapshotMatches({
					store,
					snapshot: snapshot.persistence,
					agentDir: target.kind === "agent" ? target.agentDir : void 0,
					...target.kind === "shared" ? { stateDir: target.stateDir } : {}
				});
				snapshot.owned = committed.owned;
				if (!committed.publishRuntimeSnapshots()) throw new Error(`auth profile runtime publication failed for ${pathname}`);
			}
		}
	} catch (err) {
		for (const [pathname, snapshot] of snapshots.entries()) try {
			restoreFileSnapshot(pathname, snapshot, env);
		} catch {}
		for (const snapshot of authStoreSnapshots.values()) {
			if (!snapshot.owned) continue;
			try {
				restoreAuthProfileStorePersistenceSnapshot(snapshot.persistence, snapshot.owned, snapshot.target.kind === "agent" ? snapshot.target.agentDir : void 0, snapshot.target.kind === "shared" ? { stateDir: snapshot.target.stateDir } : {});
			} catch {}
		}
		throw new Error(`Secrets apply failed: ${String(err)}`, { cause: err });
	}
	return result;
}
const testing = { async projectConfigForTest(params) {
	return (await projectPlanState({
		plan: params.plan,
		env: params.env ?? process.env,
		write: false,
		allowExecInDryRun: false
	})).nextConfig;
} };
//#endregion
export { testing as n, runSecretsApply as t };
