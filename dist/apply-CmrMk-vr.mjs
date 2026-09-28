import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { o as resolveUserPath } from "./home-dir-BKwhAL2c.mjs";
import "./utils-aKqR_F_U.mjs";
import { r as normalizeProviderId } from "./provider-id-DCtsDflE.mjs";
import { a as resolveAgentDir } from "./agent-scope-config-IQKOEtZ4.mjs";
import { E as resolveStateDir } from "./paths-DehQwyE0.mjs";
import { a as coerceSecretRef } from "./types.secrets-B5xWSzLp.mjs";
import "./agent-scope-CTuYDtny.mjs";
import { o as normalizePluginConfigId } from "./provider-auth-aliases-DKt99_dy.mjs";
import { i as listKnownSecretEnvVarNames } from "./provider-env-vars-BM4XH1SL.mjs";
import { t as isNonEmptyString } from "./shared-BUXrUFz5.mjs";
import { f as assertExpectedResolvedSecretValue } from "./runtime-shared-Bpp2PLaL.mjs";
import { n as getPath, r as setPathCreateStrict, t as deletePathStrict } from "./path-utils-C3EgzLrx.mjs";
import { r as replaceConfigFile } from "./mutate-CdmDoEFy.mjs";
import "./config-DryArA1l.mjs";
import { n as resolveSecretRefValue } from "./resolve-C3ItmvEK.mjs";
import { c as resolveSharedAuthStorePath } from "./path-resolve-Bm8Ih2d_.mjs";
import { h as resolveAuthProfileDatabasePath } from "./sqlite-BIg_k8qE.mjs";
import { a as loadPersistedAuthProfileStore, i as coercePersistedAuthProfileStore, s as loadPersistedSharedAuthProfileStore } from "./persisted-B486xwB_.mjs";
import { n as captureAuthProfileStorePersistenceSnapshot, p as restoreAuthProfileStorePersistenceSnapshot } from "./store-CTvq6MSF.mjs";
import { c as loadAuthProfileStoreForSecretsRuntime, d as saveAuthProfileStoreIfPersistenceSnapshotMatches } from "./store-runtime-CzCVI_rv.mjs";
import "./auth-profiles-BFAOd5yW.mjs";
import "./model-selection-CFnUi6iD.mjs";
import { n as listSecretsDotEnvPaths, r as parseEnvAssignmentValue } from "./storage-scan-CnU2zCr3.mjs";
import { t as getSkippedExecRefStaticError } from "./exec-resolution-policy-BBKscxZv.mjs";
import { c as prepareSecretsRuntimeSnapshot } from "./runtime-DEo-RVto.mjs";
import { i as iterateAuthProfileCredentials, n as writeTextFileAtomic, r as listAuthProfileStoreTargets$1, t as createSecretsConfigIO } from "./config-io-B663r7gr.mjs";
import { n as normalizeSecretsPlanOptions, r as resolveValidatedPlanTarget } from "./plan-CPPcYYs2.mjs";
import fs from "node:fs";
import { isDeepStrictEqual } from "node:util";
import os from "node:os";
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
	if (migratedValues.size === 0 || allowedEnvKeys.size === 0) return {
		nextRaw: raw,
		removed: 0
	};
	const lines = raw.split(/\r?\n/);
	const nextLines = [];
	let removed = 0;
	for (const line of lines) {
		const match = line.match(/^\s*(?:export\s+)?([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/);
		if (!match) {
			nextLines.push(line);
			continue;
		}
		const envKey = match[1] ?? "";
		if (!allowedEnvKeys.has(envKey)) {
			nextLines.push(line);
			continue;
		}
		const parsedValue = parseEnvAssignmentValue(match[2] ?? "");
		if (migratedValues.has(parsedValue)) {
			removed += 1;
			continue;
		}
		nextLines.push(line);
	}
	const hadTrailingNewline = raw.endsWith("\n");
	const joined = nextLines.join("\n");
	return {
		nextRaw: hadTrailingNewline || joined.length === 0 ? `${joined}${joined.endsWith("\n") ? "" : "\n"}` : joined,
		removed
	};
}
function applyProviderPlanMutations(params) {
	const currentProviders = isRecord(params.config.secrets?.providers) ? structuredClone(params.config.secrets?.providers) : {};
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
		authStoreByPath: /* @__PURE__ */ new Map(),
		authStoreTargetByPath: /* @__PURE__ */ new Map(),
		changedFiles
	});
	if (targetMutations.configChanged) changedFiles.add(configPath);
	const authStoreByPath = scrubAuthStoresForProviderTargets({
		nextConfig,
		stateDir,
		env: params.env,
		providerTargets: targetMutations.providerTargets,
		scrubbedValues: targetMutations.scrubbedValues,
		authStoreByPath: targetMutations.authStoreByPath,
		authStoreTargetByPath: targetMutations.authStoreTargetByPath,
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
		authStoreByPath,
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
		authStoreByPath,
		authStoreTargetByPath: targetMutations.authStoreTargetByPath,
		envRawByPath,
		changedFiles,
		warnings,
		refsChecked: validation.refsChecked,
		skippedExecRefs: validation.skippedExecRefs,
		resolvabilityComplete: validation.resolvabilityComplete
	};
}
function applyConfigTargetMutations(params) {
	const resolvedTargets = params.planTargets.map((target) => ({
		target,
		resolved: resolveTarget(target)
	}));
	const scrubbedValues = /* @__PURE__ */ new Set();
	const providerTargets = /* @__PURE__ */ new Set();
	let configChanged = false;
	for (const { target, resolved } of resolvedTargets) {
		if (resolved.entry.configFile === "auth-profile-store") {
			if (applyAuthProfileTargetMutation({
				target,
				resolved,
				nextConfig: params.nextConfig,
				stateDir: params.stateDir,
				env: params.env,
				authStoreByPath: params.authStoreByPath,
				authStoreTargetByPath: params.authStoreTargetByPath,
				scrubbedValues
			})) {
				const agentId = (target.agentId ?? "").trim();
				if (!agentId) throw new Error(`Missing required agentId for auth-profiles target ${target.path}.`);
				params.changedFiles.add(resolveAuthStoreTargetForAgent({
					nextConfig: params.nextConfig,
					stateDir: params.stateDir,
					env: params.env,
					agentId
				}).path);
			}
			continue;
		}
		const targetPathSegments = resolved.pathSegments;
		if (resolved.entry.secretShape === "sibling_ref") {
			const previous = getPath(params.nextConfig, targetPathSegments);
			if (isNonEmptyString(previous)) scrubbedValues.add(previous.trim());
			const refPathTokens = resolved.refPathTokens;
			if (!refPathTokens) throw new Error(`Missing sibling ref path for target ${target.type}.`);
			const wroteRef = setPathCreateStrict(params.nextConfig, refPathTokens, target.ref);
			const deletedLegacy = deletePathStrict(params.nextConfig, targetPathSegments);
			if (wroteRef || deletedLegacy) configChanged = true;
			continue;
		}
		const previous = getPath(params.nextConfig, targetPathSegments);
		if (isNonEmptyString(previous)) scrubbedValues.add(previous.trim());
		if (setPathCreateStrict(params.nextConfig, resolved.pathTokens, target.ref)) configChanged = true;
		if (resolved.entry.trackProviderShadowing && resolved.providerId) providerTargets.add(normalizeProviderId(resolved.providerId));
	}
	return {
		resolvedTargets,
		scrubbedValues,
		providerTargets,
		configChanged,
		authStoreByPath: params.authStoreByPath,
		authStoreTargetByPath: params.authStoreTargetByPath
	};
}
function scrubAuthStoresForProviderTargets(params) {
	if (!params.enabled || params.providerTargets.size === 0) return params.authStoreByPath;
	for (const target of listAuthProfileStoreTargets(params.nextConfig, params.stateDir, params.env)) {
		const authStorePath = target.path;
		const existing = params.authStoreByPath.get(authStorePath);
		if (!existing && !fs.existsSync(authStorePath)) continue;
		const parsed = existing ?? (target.kind === "shared" ? loadPersistedSharedAuthProfileStore(target.env) : loadPersistedAuthProfileStore(target.agentDir));
		if (!parsed || !isRecord(parsed.profiles)) continue;
		const nextStore = structuredClone(parsed);
		const profiles = nextStore.profiles;
		if (!isRecord(profiles)) continue;
		let mutated = false;
		for (const profile of iterateAuthProfileCredentials(profiles)) {
			const provider = normalizeProviderId(profile.provider);
			if (!params.providerTargets.has(provider)) continue;
			if (profile.kind === "api_key" || profile.kind === "token") {
				if (isNonEmptyString(profile.value)) params.scrubbedValues.add(profile.value.trim());
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
			params.authStoreByPath.set(authStorePath, nextStore);
			params.authStoreTargetByPath.set(authStorePath, target);
			params.changedFiles.add(authStorePath);
		}
	}
	return params.authStoreByPath;
}
function ensureMutableAuthStore(store) {
	const next = store ? structuredClone(store) : {};
	const profiles = isRecord(next.profiles) ? next.profiles : {};
	if (typeof next.version !== "number" || !Number.isFinite(next.version)) next.version = 1;
	return {
		...next,
		profiles
	};
}
function resolveAuthStoreForTarget(params) {
	const agentId = (params.target.agentId ?? "").trim();
	if (!agentId) throw new Error(`Missing required agentId for auth-profiles target ${params.target.path}.`);
	const authStoreTarget = resolveAuthStoreTargetForAgent({
		nextConfig: params.nextConfig,
		stateDir: params.stateDir,
		env: params.env,
		agentId
	});
	const authStorePath = authStoreTarget.path;
	const loaded = params.authStoreByPath.get(authStorePath) ?? loadPersistedAuthProfileStore(authStoreTarget.agentDir);
	const store = ensureMutableAuthStore(isRecord(loaded) ? loaded : void 0);
	params.authStoreByPath.set(authStorePath, store);
	params.authStoreTargetByPath.set(authStorePath, authStoreTarget);
	return {
		path: authStorePath,
		store
	};
}
function resolveAuthStoreTargetForAgent(params) {
	const scopedEnv = {
		...params.env,
		OPENCLAW_STATE_DIR: params.stateDir,
		OPENCLAW_AGENT_DIR: void 0
	};
	const agentDir = resolveAgentDir(params.nextConfig, params.agentId, scopedEnv);
	return {
		kind: "agent",
		agentDir,
		path: resolveAuthProfileDatabasePath(agentDir)
	};
}
function listAuthProfileStoreTargets(config, stateDir, env) {
	return listAuthProfileStoreTargets$1(config, stateDir, env);
}
function ensureAuthProfileContainer(params) {
	let changed = false;
	const profilePathSegments = params.resolved.pathSegments.slice(0, 2);
	const profileId = profilePathSegments[1];
	if (!profileId) throw new Error(`Invalid auth profile target path: ${params.target.path}`);
	const current = getPath(params.store, profilePathSegments);
	const expectedType = params.resolved.entry.authProfileType;
	if (isRecord(current)) {
		if (expectedType && typeof current.type === "string" && current.type !== expectedType) throw new Error(`Auth profile "${profileId}" type mismatch for ${params.target.path}: expected "${expectedType}", got "${current.type}".`);
		if (!isNonEmptyString(current.provider) && isNonEmptyString(params.target.authProfileProvider)) {
			const wroteProvider = setPathCreateStrict(params.store, [...profilePathSegments, "provider"], params.target.authProfileProvider);
			changed = changed || wroteProvider;
		}
		return changed;
	}
	if (!expectedType) throw new Error(`Auth profile target ${params.target.path} is missing auth profile type metadata.`);
	const provider = (params.target.authProfileProvider ?? "").trim();
	if (!provider) throw new Error(`Cannot create auth profile "${profileId}" for ${params.target.path} without authProfileProvider.`);
	const wroteProfile = setPathCreateStrict(params.store, profilePathSegments, {
		type: expectedType,
		provider
	});
	changed = changed || wroteProfile;
	return changed;
}
function applyAuthProfileTargetMutation(params) {
	if (params.resolved.entry.configFile !== "auth-profile-store") return false;
	const { store } = resolveAuthStoreForTarget({
		target: params.target,
		nextConfig: params.nextConfig,
		stateDir: params.stateDir,
		env: params.env,
		authStoreByPath: params.authStoreByPath,
		authStoreTargetByPath: params.authStoreTargetByPath
	});
	let changed = ensureAuthProfileContainer({
		target: params.target,
		resolved: params.resolved,
		store
	});
	const targetPathSegments = params.resolved.pathSegments;
	if (params.resolved.entry.secretShape === "sibling_ref") {
		const previous = getPath(store, targetPathSegments);
		if (isNonEmptyString(previous)) params.scrubbedValues.add(previous.trim());
		const refPathTokens = params.resolved.refPathTokens;
		if (!refPathTokens) throw new Error(`Missing sibling ref path for auth-profiles target ${params.target.path}.`);
		const wroteRef = setPathCreateStrict(store, refPathTokens, params.target.ref);
		const deletedPlaintext = deletePathStrict(store, targetPathSegments);
		changed = changed || wroteRef || deletedPlaintext;
		return changed;
	}
	const previous = getPath(store, targetPathSegments);
	if (isNonEmptyString(previous)) params.scrubbedValues.add(previous.trim());
	const wroteRef = setPathCreateStrict(store, params.resolved.pathTokens, params.target.ref);
	changed = changed || wroteRef;
	return changed;
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
		if (scrubbed.removed > 0 && scrubbed.nextRaw !== current) {
			envRawByPath.set(envPath, scrubbed.nextRaw);
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
	for (const [authStorePath, store] of params.authStoreByPath.entries()) authStoreLookup.set(resolveUserPath(authStorePath, params.env), store);
	if (params.checkFullRuntime) await prepareSecretsRuntimeSnapshot({
		config: params.nextConfig,
		env: params.env,
		includeAuthStoreRefs: params.write || params.authStoreByPath.size > 0,
		loadAuthStore: (agentDir) => {
			const storePath = resolveUserPath(agentDir ? resolveAuthProfileDatabasePath(agentDir) : resolveSharedAuthStorePath(params.env), params.env);
			const override = authStoreLookup.get(storePath);
			if (override) return coercePersistedAuthProfileStore(structuredClone(override)) ?? {
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
function restoreFileSnapshot(pathname, snapshot) {
	if (!snapshot.existed) {
		if (fs.existsSync(pathname)) fs.rmSync(pathname, { force: true });
		return;
	}
	writeTextFileAtomic(pathname, snapshot.content, snapshot.mode || 384);
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
	if (!write) return {
		mode: "dry-run",
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
	if (changedFiles.length === 0) return {
		mode: "write",
		changed: false,
		changedFiles: [],
		checks: {
			resolvability: true,
			resolvabilityComplete: true
		},
		refsChecked: projected.refsChecked,
		skippedExecRefs: 0,
		warningCount: projected.warnings.length,
		warnings: projected.warnings
	};
	const io = createSecretsConfigIO({ env });
	const snapshots = /* @__PURE__ */ new Map();
	const authStoreSnapshots = /* @__PURE__ */ new Map();
	const capture = (pathname) => {
		if (!snapshots.has(pathname)) snapshots.set(pathname, captureFileSnapshot(pathname));
	};
	const captureAuthStore = (pathname, target) => {
		if (!authStoreSnapshots.has(pathname)) authStoreSnapshots.set(pathname, {
			target,
			persistence: captureAuthProfileStorePersistenceSnapshot(target.kind === "agent" ? target.agentDir : void 0, { env: target.kind === "shared" ? target.env : projected.authStoreEnv })
		});
	};
	capture(projected.configPath);
	const writes = [];
	for (const [pathname, raw] of projected.envRawByPath.entries()) {
		capture(pathname);
		writes.push({
			path: pathname,
			content: raw,
			mode: 384
		});
	}
	for (const [pathname, target] of projected.authStoreTargetByPath.entries()) captureAuthStore(pathname, target);
	try {
		await replaceConfigFile({
			nextConfig: projected.nextConfig,
			snapshot: projected.configSnapshot,
			writeOptions: projected.configWriteOptions,
			io,
			afterWrite: { mode: "auto" }
		});
		for (const writeLocal of writes) writeTextFileAtomic(writeLocal.path, writeLocal.content, writeLocal.mode);
		for (const [pathname, value] of projected.authStoreByPath.entries()) {
			const target = projected.authStoreTargetByPath.get(pathname);
			const store = coercePersistedAuthProfileStore(value);
			if (target && store) {
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
			restoreFileSnapshot(pathname, snapshot);
		} catch {}
		for (const snapshot of authStoreSnapshots.values()) {
			if (!snapshot.owned) continue;
			try {
				restoreAuthProfileStorePersistenceSnapshot(snapshot.persistence, snapshot.owned, snapshot.target.kind === "agent" ? snapshot.target.agentDir : void 0, snapshot.target.kind === "shared" ? { stateDir: snapshot.target.stateDir } : {});
			} catch {}
		}
		throw new Error(`Secrets apply failed: ${String(err)}`, { cause: err });
	}
	return {
		mode: "write",
		changed: changedFiles.length > 0,
		changedFiles,
		checks: {
			resolvability: true,
			resolvabilityComplete: true
		},
		refsChecked: projected.refsChecked,
		skippedExecRefs: 0,
		warningCount: projected.warnings.length,
		warnings: projected.warnings
	};
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
