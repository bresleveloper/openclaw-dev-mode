import { c as normalizeOptionalString } from "../../string-coerce-DW4mBlAt.js";
import { y as parseStrictNonNegativeInteger } from "../../number-coercion-CJQ8TR--.js";
import { _ as uniqueStrings } from "../../string-normalization-CRyoFBPt.js";
import { w as pathExists } from "../../fs-safe-aqmM_n6V.js";
import { c as isRecord } from "../../utils-BApvfmPs.js";
import { c as resolveDefaultAgentId, o as resolveAgentWorkspaceDir, r as resolveAgentConfig } from "../../agent-scope-config-C3ijpoNo.js";
import { t as mutateConfigFile } from "../../config-A41fTHlt.js";
import { m as updateAuthProfileStoreWithLock, u as loadAuthProfileStoreWithoutExternalProfiles, z as readCodexCliCredentialsCached } from "../../store-SfOB_T2S.js";
import { t as asBoolean } from "../../boolean-CrriykWV.js";
import "../../number-runtime-DBLVDypr.js";
import "../../security-runtime-ZGC3cmUc.js";
import "../../string-coerce-runtime-BiZzULo_.js";
import { t as definePluginEntry } from "../../plugin-entry-BZpzqykQ.js";
import { n as buildApiKeyCredential, t as applyAuthProfileConfig } from "../../provider-auth-helpers-sTwxNMVI.js";
import { t as buildOauthProviderAuthResult } from "../../provider-auth-result-_VrXMg4X.js";
import { d as buildOpenAICodexCredentialExtra, h as resolveOpenAICodexImportProfileName, m as resolveOpenAICodexAuthIdentity } from "../../provider-auth-DKbeFxjY.js";
import { n as readJsonFileWithFallback } from "../../json-store-CWaMsrLM.js";
import { n as resolveLivePluginConfigObject, r as resolvePluginConfigObject } from "../../plugin-config-runtime-DWfSLpLu.js";
import "../../config-mutation-6lHNauPf.js";
import "../../agent-runtime-CZ5Y3DkP.js";
import { c as hasMigrationConfigPatchConflict, d as markMigrationItemSkipped, i as applyMigrationManualItem, l as markMigrationItemConflict, m as readMigrationConfigPath, n as MIGRATION_REASON_TARGET_EXISTS, o as createMigrationItem, s as createMigrationManualItem, u as markMigrationItemError, v as summarizeMigrationItems, y as writeMigrationConfigPath } from "../../migration-CRXv-K-p.js";
import { i as writeMigrationReport, n as copyMigrationFileItem, r as withCachedMigrationConfigRuntime, t as archiveMigrationItem } from "../../migration-runtime-MU8xUQdp.js";
import { t as createCodexAppServerAgentHarness } from "../../harness-DxpSMaIj.js";
import { F as ensureCodexPluginActivation, I as pluginReadParams, R as defaultCodexAppInventoryCache } from "../../thread-lifecycle-Dc5B-aD0.js";
import { d as resolveCodexAppServerRuntimeOptions, t as CODEX_PLUGINS_MARKETPLACE_NAME, u as readCodexPluginConfig } from "../../config-BtNblzni.js";
import { t as buildCodexProvider } from "../../provider-C5LKuYLo.js";
import { t as buildCodexMediaUnderstandingProvider } from "../../media-understanding-provider-DVOGl9Wv.js";
import { n as describeControlFailure } from "../../capabilities-CjLiE3_H.js";
import { a as formatCodexDisplayText } from "../../app-server-policy-BP1xRJni.js";
import { a as clearSharedCodexAppServerClientIfCurrentAndWait, c as getLeasedSharedCodexAppServerClient, g as resolveCodexAppServerAuthAccountCacheKey, u as releaseLeasedSharedCodexAppServerClient, v as resolveCodexAppServerAuthProfileIdForAgent, y as resolveCodexAppServerFallbackApiKeyCacheKey } from "../../shared-client-BdFUC0J9.js";
import { a as createCodexCliSessionNodeInvokePolicies, c as resolveCodexCliSessionForBindingOnNode, i as createCodexCliSessionNodeHostCommands, l as resumeCodexCliSessionOnNode, n as handleCodexConversationInboundClaim, s as listCodexCliSessionsOnNode, t as handleCodexConversationBindingResolved } from "../../conversation-binding-Dqmravht.js";
import { n as buildCodexPluginAppCacheKey } from "../../plugin-app-cache-key-CUqOxDA6.js";
import { t as requestCodexAppServerJson } from "../../request-B1sbHQs-.js";
import { t as createCodexWebSearchProviderBase } from "../../web-search-provider.shared-C7eio53H.js";
import path from "node:path";
import fs from "node:fs/promises";
import os from "node:os";
//#region extensions/codex/src/commands.ts
/** Creates the reserved `/codex` command definition exposed by the plugin. */
function createCodexCommand(options) {
	return {
		name: "codex",
		description: "Inspect and control the Codex app-server harness",
		ownership: "reserved",
		agentPromptGuidance: [{
			text: "Native Codex app-server plugin is available (`/codex ...`). For Codex bind/control/thread/resume/steer/stop requests, prefer `/codex bind`, `/codex threads`, `/codex resume`, `/codex steer`, and `/codex stop` over ACP. When OpenClaw sandboxing is active, native Codex execution modes are unavailable; use normal Codex harness turns.",
			surfaces: ["openclaw_main"]
		}, {
			text: "Use ACP for Codex only when the user explicitly asks for ACP/acpx or wants to test the ACP path.",
			surfaces: ["openclaw_main"]
		}],
		acceptsArgs: true,
		requireAuth: true,
		handler: (ctx) => handleCodexCommand(ctx, options)
	};
}
/** Dispatches a `/codex` command to the subcommand handler and formats failures for chat. */
async function handleCodexCommand(ctx, options = {}) {
	const { loadSubcommandHandler, ...subcommandOptions } = options;
	try {
		return await (loadSubcommandHandler ? await loadSubcommandHandler() : await loadDefaultCodexSubcommandHandler())(ctx, subcommandOptions);
	} catch (error) {
		return { text: `Codex command failed: ${formatCodexDisplayText(describeControlFailure(error))}` };
	}
}
async function loadDefaultCodexSubcommandHandler() {
	const { handleCodexSubcommand } = await import("../../command-handlers-BGe0ASNK.js");
	return handleCodexSubcommand;
}
//#endregion
//#region extensions/codex/src/migration/helpers.ts
async function exists(filePath) {
	return await pathExists(filePath);
}
async function isDirectory(filePath) {
	if (!filePath) return false;
	try {
		return (await fs.stat(filePath)).isDirectory();
	} catch {
		return false;
	}
}
function resolveUserHomeDir() {
	return process.env.HOME?.trim() || os.homedir();
}
function resolveHomePath(value) {
	if (value === "~") return resolveUserHomeDir();
	if (value.startsWith("~/")) return path.join(resolveUserHomeDir(), value.slice(2));
	return path.resolve(value);
}
function sanitizeName(value) {
	return value.trim().toLowerCase().replaceAll(/[^a-z0-9._-]+/gu, "-").replaceAll(/^-+|-+$/gu, "").slice(0, 64);
}
async function readJsonObject(filePath) {
	if (!filePath) return {};
	const { value: parsed } = await readJsonFileWithFallback(filePath, {});
	return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : {};
}
//#endregion
//#region extensions/codex/src/migration/auth.ts
const OPENAI_PROVIDER_ID = "openai";
const OPENAI_CODEX_DEFAULT_MODEL = "openai/gpt-5.5";
const CODEX_IMPORT_DISPLAY_NAME = "Codex import";
const CODEX_REASON_AUTH_NOT_SELECTED = "auth credential migration not selected";
const CODEX_REASON_AUTH_PROFILE_EXISTS = "auth profile exists";
const CODEX_REASON_AUTH_PROFILE_WRITE_FAILED = "failed to write auth profile";
const CODEX_REASON_AUTH_NO_LONGER_PRESENT = "auth credential no longer present";
const CODEX_REASON_MISSING_AUTH_METADATA = "missing auth metadata";
const CODEX_CONFIG_PATCH_MODE_RETURN$1 = "return";
var CodexAuthConfigConflict = class extends Error {};
async function readModelRefs(source) {
	const cache = await readJsonObject(source.modelsCachePath);
	const models = Array.isArray(cache.models) ? cache.models : [];
	const refs = /* @__PURE__ */ new Set();
	for (const model of models) {
		const slug = typeof model === "string" ? model.trim() : isRecord(model) ? normalizeOptionalString(model.slug) ?? normalizeOptionalString(model.id) ?? normalizeOptionalString(model.name) : void 0;
		if (!slug) continue;
		refs.add(`${OPENAI_PROVIDER_ID}/${slug}`);
	}
	refs.add(OPENAI_CODEX_DEFAULT_MODEL);
	return [...refs].toSorted();
}
function readProviderAuthModelConfigs(result) {
	const models = result.configPatch?.agents?.defaults?.models;
	if (isRecord(models)) return { ...models };
	return { [normalizeOptionalString(result.defaultModel) ?? OPENAI_CODEX_DEFAULT_MODEL]: {} };
}
async function buildCodexOAuthCredential(source) {
	const credential = readCodexCliCredentialsCached({
		codexHome: source.codexHome,
		allowKeychainPrompt: false,
		ttlMs: 0
	});
	if (!credential) return null;
	const identity = resolveOpenAICodexAuthIdentity({
		access: credential.access,
		accountId: credential.accountId
	});
	const modelRefs = await readModelRefs(source);
	const configPatch = { agents: { defaults: { models: Object.fromEntries(modelRefs.map((modelRef) => [modelRef, {}])) } } };
	const result = buildOauthProviderAuthResult({
		providerId: OPENAI_PROVIDER_ID,
		defaultModel: OPENAI_CODEX_DEFAULT_MODEL,
		access: credential.access,
		refresh: credential.refresh,
		expires: credential.expires,
		email: identity.email,
		profileName: resolveOpenAICodexImportProfileName(identity, "codex-import"),
		displayName: CODEX_IMPORT_DISPLAY_NAME,
		credentialExtra: buildOpenAICodexCredentialExtra({
			accountId: identity.accountId,
			chatgptPlanType: identity.chatgptPlanType,
			idToken: credential.idToken
		}),
		configPatch
	});
	const profile = result.profiles[0];
	return profile ? {
		kind: "oauth",
		provider: OPENAI_PROVIDER_ID,
		profileId: profile.profileId,
		result,
		modelConfigs: readProviderAuthModelConfigs(result)
	} : null;
}
async function buildCodexApiKeyCredential(source) {
	const key = normalizeOptionalString((await readJsonObject(source.authPath)).OPENAI_API_KEY);
	if (!key) return null;
	return {
		kind: "api_key",
		provider: OPENAI_PROVIDER_ID,
		profileId: "openai:codex-import",
		key
	};
}
async function readCodexAuthCredentials(source) {
	return [await buildCodexOAuthCredential(source), await buildCodexApiKeyCredential(source)].filter((entry) => entry !== null);
}
function findMatchingOAuthProfile(store, credential) {
	for (const [profileId, existing] of Object.entries(store.profiles)) {
		if (existing.type !== "oauth" || existing.provider !== credential.provider) continue;
		if (credential.accountId && existing.accountId === credential.accountId) return profileId;
		if ((!credential.accountId || !existing.accountId) && credential.email && existing.email === credential.email) return profileId;
	}
}
function findMatchingApiKeyProfile(store, provider, key) {
	for (const [profileId, existing] of Object.entries(store.profiles)) if (existing.type === "api_key" && existing.provider === provider && existing.key === key) return profileId;
}
function itemProfileTarget(credential, store) {
	if (credential.kind === "oauth") {
		const profile = credential.result.profiles[0];
		const matched = profile?.credential.type === "oauth" ? findMatchingOAuthProfile(store, profile.credential) : void 0;
		return {
			profileId: matched ?? credential.profileId,
			matchedExisting: Boolean(matched)
		};
	}
	const matched = findMatchingApiKeyProfile(store, credential.provider, credential.key);
	return {
		profileId: matched ?? credential.profileId,
		matchedExisting: Boolean(matched)
	};
}
function replaceConfigDraft(draft, next) {
	for (const key of Object.keys(draft)) delete draft[key];
	Object.assign(draft, next);
}
function existingAuthProfileConfigIsCompatible(existing, profile) {
	if (existing.provider !== profile.provider || existing.mode !== profile.mode) return false;
	if (existing.email && profile.email && existing.email !== profile.email) return false;
	return true;
}
function hasAuthProfileConfigConflict(config, profile, overwrite) {
	if (overwrite) return false;
	const existing = config.auth?.profiles?.[profile.profileId];
	return Boolean(existing && !existingAuthProfileConfigIsCompatible(existing, profile));
}
function hasCurrentAuthProfileConfigConflict(ctx, profile) {
	let config = ctx.config;
	try {
		config = ctx.runtime?.config?.current?.() ?? config;
	} catch {}
	return hasAuthProfileConfigConflict(config, profile, Boolean(ctx.overwrite));
}
function applyDefaultModelIfMissing(cfg) {
	const currentModel = cfg.agents?.defaults?.model;
	if (typeof currentModel === "string" ? currentModel : isRecord(currentModel) ? normalizeOptionalString(currentModel.primary) : void 0) return cfg;
	return {
		...cfg,
		agents: {
			...cfg.agents,
			defaults: {
				...cfg.agents?.defaults,
				model: {
					...isRecord(currentModel) ? currentModel : {},
					primary: OPENAI_CODEX_DEFAULT_MODEL
				}
			}
		}
	};
}
function mergeModelConfigEntry(existing, patch) {
	if (existing && isRecord(existing) && isRecord(patch)) return {
		...existing,
		...patch
	};
	return existing ?? patch;
}
function applyOAuthModelConfigsToConfig(cfg, credential) {
	const existingModels = cfg.agents?.defaults?.models ?? {};
	const models = credential.result.replaceDefaultModels ? { ...credential.modelConfigs } : { ...existingModels };
	if (!credential.result.replaceDefaultModels) for (const [modelRef, modelConfig] of Object.entries(credential.modelConfigs)) models[modelRef] = mergeModelConfigEntry(models[modelRef], modelConfig);
	return {
		...cfg,
		agents: {
			...cfg.agents,
			defaults: {
				...cfg.agents?.defaults,
				models
			}
		}
	};
}
function applyOAuthConfigToConfig(cfg, credential, profileId) {
	let next = applyOAuthModelConfigsToConfig(cfg, credential);
	const profile = credential.result.profiles[0];
	if (profile) next = applyAuthProfileConfig(next, {
		profileId,
		provider: profile.credential.provider,
		mode: "oauth",
		..."email" in profile.credential && profile.credential.email ? { email: profile.credential.email } : {},
		..."displayName" in profile.credential && profile.credential.displayName ? { displayName: profile.credential.displayName } : {},
		preferProfileFirst: false
	});
	return applyDefaultModelIfMissing(next);
}
function applyApiKeyConfigToConfig(cfg, credential, profileId) {
	return applyAuthProfileConfig(cfg, {
		profileId,
		provider: credential.provider,
		mode: "api_key",
		displayName: CODEX_IMPORT_DISPLAY_NAME,
		preferProfileFirst: false
	});
}
function shouldReturnAuthConfigPatch(ctx) {
	return ctx.providerOptions?.configPatchMode === CODEX_CONFIG_PATCH_MODE_RETURN$1;
}
function oauthAuthProfileConfig(credential, profileId) {
	const profile = credential.result.profiles[0];
	if (!profile || profile.credential.type !== "oauth") return null;
	return {
		profileId,
		provider: profile.credential.provider,
		mode: "oauth",
		..."email" in profile.credential && profile.credential.email ? { email: profile.credential.email } : {},
		..."displayName" in profile.credential && profile.credential.displayName ? { displayName: profile.credential.displayName } : {}
	};
}
function apiKeyAuthProfileConfig(credential, profileId) {
	return {
		profileId,
		provider: credential.provider,
		mode: "api_key",
		displayName: CODEX_IMPORT_DISPLAY_NAME
	};
}
function authProfileConfigForCredential(credential, profileId) {
	return credential.kind === "oauth" ? oauthAuthProfileConfig(credential, profileId) : apiKeyAuthProfileConfig(credential, profileId);
}
async function applyCodexAuthProfileConfig(ctx, profile, applyConfig) {
	const configApi = ctx.runtime?.config;
	if (!configApi?.current || !configApi.mutateConfigFile) return "unavailable";
	try {
		await configApi.mutateConfigFile({
			base: "runtime",
			afterWrite: { mode: "auto" },
			mutate(draft) {
				const current = draft;
				if (hasAuthProfileConfigConflict(current, profile, Boolean(ctx.overwrite))) throw new CodexAuthConfigConflict();
				replaceConfigDraft(draft, applyConfig(current));
			}
		});
		return "configured";
	} catch (error) {
		return error instanceof CodexAuthConfigConflict ? "conflict" : "unavailable";
	}
}
async function applyOAuthConfig(ctx, credential, profileId) {
	const profile = oauthAuthProfileConfig(credential, profileId);
	if (!profile) return "unavailable";
	return applyCodexAuthProfileConfig(ctx, profile, (config) => applyOAuthConfigToConfig(config, credential, profileId));
}
async function applyApiKeyConfig(ctx, credential, profileId) {
	return applyCodexAuthProfileConfig(ctx, apiKeyAuthProfileConfig(credential, profileId), (config) => applyApiKeyConfigToConfig(config, credential, profileId));
}
async function buildCodexAuthItems(params) {
	const credentials = await readCodexAuthCredentials(params.source);
	if (credentials.length === 0) return [];
	const store = loadAuthProfileStoreWithoutExternalProfiles(params.targets.agentDir);
	const skipped = !params.ctx.includeSecrets;
	return credentials.map((credential) => {
		const { profileId, matchedExisting } = itemProfileTarget(credential, store);
		const targetExists = Boolean(store.profiles[profileId]);
		const configProfile = authProfileConfigForCredential(credential, profileId);
		const configConflict = configProfile ? hasAuthProfileConfigConflict(params.ctx.config, configProfile, Boolean(params.ctx.overwrite)) : false;
		const conflict = (targetExists && !matchedExisting && !params.ctx.overwrite || configConflict) && !skipped;
		return createMigrationItem({
			id: `auth:${credential.provider}`,
			kind: "auth",
			action: skipped ? "skip" : "create",
			source: params.source.authPath,
			target: `${params.targets.agentDir}/auth-profiles.json#${profileId}`,
			status: skipped ? "skipped" : conflict ? "conflict" : "planned",
			sensitive: true,
			reason: skipped ? CODEX_REASON_AUTH_NOT_SELECTED : conflict ? CODEX_REASON_AUTH_PROFILE_EXISTS : void 0,
			message: credential.kind === "oauth" ? "Import Codex OAuth credentials and configure OpenAI Codex models." : "Import Codex OpenAI API key.",
			details: {
				provider: credential.provider,
				profileId,
				sourceProfileId: credential.profileId,
				sourceKind: "codex-auth-json",
				credentialKind: credential.kind
			}
		});
	});
}
async function applyCodexAuthItem(params) {
	const { ctx, item, source, targets } = params;
	if (item.status !== "planned") return item;
	const profileId = typeof item.details?.profileId === "string" ? item.details.profileId : "";
	const provider = typeof item.details?.provider === "string" ? item.details.provider : "";
	const sourceProfileId = typeof item.details?.sourceProfileId === "string" ? item.details.sourceProfileId : void 0;
	if (!profileId || !provider) return markMigrationItemError(item, CODEX_REASON_MISSING_AUTH_METADATA);
	const credential = (await readCodexAuthCredentials(source)).find((candidate) => candidate.provider === provider);
	if (!credential) return markMigrationItemSkipped(item, CODEX_REASON_AUTH_NO_LONGER_PRESENT);
	if (credential.kind === "oauth" && sourceProfileId && credential.profileId !== sourceProfileId) return markMigrationItemSkipped(item, CODEX_REASON_AUTH_NO_LONGER_PRESENT);
	const oauthProfile = credential.kind === "oauth" ? credential.result.profiles[0] : void 0;
	const oauthCredential = oauthProfile?.credential.type === "oauth" ? oauthProfile.credential : void 0;
	if (credential.kind === "oauth" && !oauthCredential) return markMigrationItemError(item, CODEX_REASON_MISSING_AUTH_METADATA);
	const configProfile = authProfileConfigForCredential(credential, profileId);
	if (!configProfile) return markMigrationItemError(item, CODEX_REASON_MISSING_AUTH_METADATA);
	if (hasCurrentAuthProfileConfigConflict(ctx, configProfile)) return markMigrationItemConflict(item, CODEX_REASON_AUTH_PROFILE_EXISTS);
	let conflicted = false;
	let wrote = false;
	const store = await updateAuthProfileStoreWithLock({
		agentDir: targets.agentDir,
		updater: (freshStore) => {
			const existing = freshStore.profiles[profileId];
			if (!ctx.overwrite && existing) {
				if ((credential.kind === "oauth" ? findMatchingOAuthProfile(freshStore, oauthCredential) : findMatchingApiKeyProfile(freshStore, credential.provider, credential.key)) === profileId) return false;
				conflicted = true;
				return false;
			}
			freshStore.profiles[profileId] = credential.kind === "oauth" ? {
				...oauthCredential,
				displayName: CODEX_IMPORT_DISPLAY_NAME
			} : {
				...buildApiKeyCredential(credential.provider, credential.key),
				displayName: CODEX_IMPORT_DISPLAY_NAME
			};
			wrote = true;
			return true;
		}
	});
	if (conflicted) return markMigrationItemConflict(item, CODEX_REASON_AUTH_PROFILE_EXISTS);
	if (!store?.profiles[profileId]) return markMigrationItemError(item, CODEX_REASON_AUTH_PROFILE_WRITE_FAILED);
	const configResult = shouldReturnAuthConfigPatch(ctx) ? "unavailable" : credential.kind === "oauth" ? await applyOAuthConfig(ctx, credential, profileId) : await applyApiKeyConfig(ctx, credential, profileId);
	if (configResult === "conflict") return markMigrationItemConflict(item, CODEX_REASON_AUTH_PROFILE_EXISTS);
	return {
		...item,
		status: "migrated",
		details: {
			...item.details,
			wroteAuthProfile: wrote,
			configUpdated: configResult === "configured",
			...shouldReturnAuthConfigPatch(ctx) ? { configPatchReturned: true } : {}
		}
	};
}
async function buildCodexAuthConfigPatchItems(params) {
	const { ctx, item, source } = params;
	if (item.status !== "migrated" || !shouldReturnAuthConfigPatch(ctx)) return [];
	const profileId = typeof item.details?.profileId === "string" ? item.details.profileId : "";
	const provider = typeof item.details?.provider === "string" ? item.details.provider : "";
	const sourceProfileId = typeof item.details?.sourceProfileId === "string" ? item.details.sourceProfileId : void 0;
	if (!profileId || !provider) return [];
	const credential = (await readCodexAuthCredentials(source)).find((candidate) => candidate.provider === provider);
	if (!credential) return [];
	if (credential.kind === "oauth" && sourceProfileId && credential.profileId !== sourceProfileId) return [];
	const next = credential.kind === "oauth" ? applyOAuthConfigToConfig(ctx.config, credential, profileId) : applyApiKeyConfigToConfig(ctx.config, credential, profileId);
	const items = [];
	if (next.auth) items.push(createMigrationItem({
		id: `${item.id}:config:auth`,
		kind: "config",
		action: "merge",
		status: "migrated",
		target: "auth",
		message: "Configure imported Codex auth profile.",
		details: {
			path: ["auth"],
			value: next.auth
		}
	}));
	if (next.agents?.defaults) items.push(createMigrationItem({
		id: `${item.id}:config:agents-defaults`,
		kind: "config",
		action: "merge",
		status: "migrated",
		target: "agents.defaults",
		message: "Configure imported Codex models.",
		details: {
			path: ["agents", "defaults"],
			value: next.agents.defaults
		}
	}));
	return items;
}
//#endregion
//#region extensions/codex/src/migration/source.ts
const SKILL_FILENAME = "SKILL.md";
const MAX_SCAN_DEPTH = 6;
const MAX_DISCOVERED_DIRS = 2e3;
function defaultCodexHome() {
	return resolveHomePath(process.env.CODEX_HOME?.trim() || "~/.codex");
}
function personalAgentsSkillsDir() {
	return path.join(resolveUserHomeDir(), ".agents", "skills");
}
async function safeReadDir(dir) {
	return await fs.readdir(dir, { withFileTypes: true }).catch(() => []);
}
async function discoverSkillDirs(params) {
	if (!params.root || !await isDirectory(params.root)) return [];
	const discovered = [];
	async function visit(dir, depth) {
		if (discovered.length >= MAX_DISCOVERED_DIRS || depth > MAX_SCAN_DEPTH) return;
		const name = path.basename(dir);
		if (params.excludeSystem && depth === 1 && name === ".system") return;
		if (await exists(path.join(dir, SKILL_FILENAME))) {
			discovered.push({
				name,
				source: dir,
				sourceLabel: params.sourceLabel
			});
			return;
		}
		for (const entry of await safeReadDir(dir)) {
			if (!entry.isDirectory()) continue;
			await visit(path.join(dir, entry.name), depth + 1);
		}
	}
	await visit(params.root, 0);
	return discovered;
}
async function discoverPluginDirs(codexHome) {
	const root = path.join(codexHome, "plugins", "cache");
	if (!await isDirectory(root)) return [];
	const discovered = /* @__PURE__ */ new Map();
	async function visit(dir, depth) {
		if (discovered.size >= MAX_DISCOVERED_DIRS || depth > MAX_SCAN_DEPTH) return;
		const manifestPath = path.join(dir, ".codex-plugin", "plugin.json");
		if (await exists(manifestPath)) {
			const manifest = await readJsonObject(manifestPath);
			const name = (typeof manifest.name === "string" ? manifest.name.trim() : "") || path.basename(dir);
			discovered.set(dir, {
				name,
				source: dir,
				manifestPath,
				sourceKind: "cache",
				migratable: false,
				message: "Cached Codex plugin bundle found. Review manually unless the plugin is also installed in the source Codex app-server inventory"
			});
			return;
		}
		for (const entry of await safeReadDir(dir)) {
			if (!entry.isDirectory()) continue;
			await visit(path.join(dir, entry.name), depth + 1);
		}
	}
	await visit(root, 0);
	return [...discovered.values()].toSorted((a, b) => a.source.localeCompare(b.source));
}
async function discoverInstalledCuratedPlugins(codexHome, options = {}) {
	const requestOptions = { startOptions: sourceCodexAppServerStartOptions(codexHome) };
	try {
		const marketplace = (await requestSourceCodexAppServerJson(requestOptions, {
			method: "plugin/list",
			requestParams: { cwds: [] }
		})).marketplaces.find((entry) => entry.name === CODEX_PLUGINS_MARKETPLACE_NAME);
		if (!marketplace) return {
			plugins: [],
			error: `Codex marketplace ${CODEX_PLUGINS_MARKETPLACE_NAME} was not found in source plugin inventory.`
		};
		const plugins = marketplace.plugins.filter((plugin) => plugin.installed).map((plugin) => buildInstalledPluginSource(plugin)).filter((plugin) => plugin !== void 0);
		return { plugins: (options.evaluatePluginMigrationEligibility === true ? await withPluginMigrationEligibility({
			plugins,
			marketplace: marketplaceRef(marketplace),
			requestOptions,
			verifyPluginApps: options.verifyPluginApps === true
		}) : plugins).toSorted((a, b) => (a.pluginName ?? a.name).localeCompare(b.pluginName ?? b.name)) };
	} catch (error) {
		return {
			plugins: [],
			error: error instanceof Error ? error.message : String(error)
		};
	}
}
function sourceCodexAppServerStartOptions(codexHome) {
	return {
		transport: "stdio",
		command: "codex",
		commandSource: "managed",
		args: [
			"app-server",
			"--listen",
			"stdio://"
		],
		headers: {},
		env: {
			CODEX_HOME: codexHome,
			HOME: path.dirname(codexHome)
		}
	};
}
async function requestSourceCodexAppServerJson(options, params) {
	return await requestCodexAppServerJson({
		method: params.method,
		requestParams: params.requestParams,
		timeoutMs: 6e4,
		startOptions: options.startOptions,
		authProfileId: null,
		isolated: true
	});
}
function buildInstalledPluginSource(plugin) {
	const pluginName = pluginNameFromSummary(plugin);
	if (!pluginName) return;
	return {
		name: plugin.name,
		pluginName,
		marketplaceName: CODEX_PLUGINS_MARKETPLACE_NAME,
		source: `${CODEX_PLUGINS_MARKETPLACE_NAME}/${pluginName}`,
		sourceKind: "app-server",
		migratable: true,
		installed: plugin.installed,
		enabled: plugin.enabled
	};
}
function marketplaceRef(marketplace) {
	return {
		name: CODEX_PLUGINS_MARKETPLACE_NAME,
		...marketplace.path ? { path: marketplace.path } : {},
		...!marketplace.path ? { remoteMarketplaceName: marketplace.name } : {}
	};
}
async function withPluginMigrationEligibility(params) {
	const pending = [];
	const evaluated = [];
	for (const plugin of params.plugins) {
		if (plugin.enabled !== true) {
			evaluated.push({
				...plugin,
				migratable: false,
				migrationBlock: { code: "plugin_disabled" },
				message: `Codex plugin "${plugin.pluginName ?? plugin.name}" is installed in Codex but disabled; enable it in Codex before migrating it to OpenClaw.`
			});
			continue;
		}
		const detail = await readPluginDetail(params.requestOptions, params.marketplace, plugin);
		if (!detail.ok) {
			evaluated.push({
				...plugin,
				migratable: false,
				migrationBlock: {
					code: "plugin_read_unavailable",
					error: detail.error
				},
				message: `Codex plugin "${plugin.pluginName ?? plugin.name}" detail could not be read: ${detail.error}`
			});
			continue;
		}
		if (detail.detail.apps.length === 0) {
			evaluated.push({
				...plugin,
				migratable: true
			});
			continue;
		}
		const apps = detail.detail.apps.map(sourcePluginAppFact).toSorted((left, right) => left.id.localeCompare(right.id));
		pending.push({
			plugin,
			apps
		});
	}
	if (pending.length === 0) return evaluated;
	let sourceAccount;
	try {
		sourceAccount = await readSourceCodexAccount(params.requestOptions);
	} catch (error) {
		if (!params.verifyPluginApps) {
			const message = error instanceof Error ? error.message : String(error);
			for (const { plugin, apps } of pending) evaluated.push({
				...plugin,
				migratable: false,
				migrationBlock: {
					code: "codex_account_unavailable",
					apps,
					error: message
				},
				message: `Codex plugin "${plugin.pluginName ?? plugin.name}" owns apps, but the source Codex app-server account could not be read: ${message}`
			});
			return evaluated;
		}
	}
	if (sourceAccount && sourceAccount !== "chatgpt") {
		for (const { plugin, apps } of pending) evaluated.push({
			...plugin,
			migratable: false,
			migrationBlock: {
				code: "codex_subscription_required",
				apps
			},
			message: codexSubscriptionRequiredMessage(plugin)
		});
		return evaluated;
	}
	if (!params.verifyPluginApps) {
		for (const { plugin, apps } of pending) evaluated.push({
			...plugin,
			apps,
			migratable: true
		});
		return evaluated;
	}
	const snapshot = await refreshSourceAppInventory(params.requestOptions).catch((error) => {
		const message = error instanceof Error ? error.message : String(error);
		for (const { plugin, apps } of pending) evaluated.push({
			...plugin,
			migratable: false,
			migrationBlock: {
				code: "app_inventory_unavailable",
				apps,
				error: message
			},
			message: `Codex plugin "${plugin.pluginName ?? plugin.name}" owns apps, but source app inventory could not be read: ${message}`
		});
	});
	if (!snapshot) return evaluated;
	const appInfoById = new Map(snapshot.apps.map((app) => [app.id, app]));
	for (const { plugin, apps: declaredApps } of pending) {
		const apps = declaredApps.map((app) => sourcePluginAppFactWithInventory(app, appInfoById.get(app.id))).toSorted((left, right) => left.id.localeCompare(right.id));
		const blockCode = migrationBlockCodeForApps(apps);
		if (!blockCode) {
			evaluated.push({
				...plugin,
				apps,
				migratable: true
			});
			continue;
		}
		evaluated.push({
			...plugin,
			migratable: false,
			migrationBlock: {
				code: blockCode,
				apps
			},
			message: appInventoryBlockMessage(plugin, apps, blockCode)
		});
	}
	return evaluated;
}
async function readSourceCodexAccount(options) {
	const response = await requestSourceCodexAppServerJson(options, {
		method: "account/read",
		requestParams: { refreshToken: false }
	});
	if (!response.account || typeof response.account !== "object" || Array.isArray(response.account)) return "missing";
	return response.account.type === "chatgpt" ? "chatgpt" : "non_chatgpt";
}
async function readPluginDetail(options, marketplace, plugin) {
	try {
		return {
			ok: true,
			detail: (await requestSourceCodexAppServerJson(options, {
				method: "plugin/read",
				requestParams: pluginReadParams(marketplace, plugin.pluginName ?? plugin.name)
			})).plugin
		};
	} catch (error) {
		return {
			ok: false,
			error: error instanceof Error ? error.message : String(error)
		};
	}
}
async function refreshSourceAppInventory(options) {
	const key = buildCodexPluginAppCacheKey({ appServer: { start: options.startOptions } });
	const request = async (method, requestParams) => await requestSourceCodexAppServerJson(options, {
		method,
		requestParams
	});
	return await defaultCodexAppInventoryCache.refreshNow({
		key,
		request,
		forceRefetch: true
	});
}
function sourcePluginAppFact(app) {
	return {
		id: app.id,
		name: app.name,
		needsAuth: app.needsAuth
	};
}
function sourcePluginAppFactWithInventory(app, info) {
	if (!info) return app;
	return {
		...app,
		isAccessible: info.isAccessible,
		isEnabled: info.isEnabled
	};
}
function migrationBlockCodeForApps(apps) {
	if (apps.some((app) => app.isAccessible === false)) return "app_inaccessible";
	if (apps.some((app) => app.isEnabled === false)) return "app_disabled";
	if (apps.some((app) => app.isAccessible === void 0 || app.isEnabled === void 0)) return "app_missing";
}
function appInventoryBlockMessage(plugin, apps, code) {
	const status = code === "app_inaccessible" ? "inaccessible" : code === "app_disabled" ? "disabled" : "missing";
	const blocking = apps.find((app) => code === "app_inaccessible" ? app.isAccessible === false : code === "app_disabled" ? app.isEnabled === false : app.isAccessible === void 0 || app.isEnabled === void 0) ?? apps[0];
	const appLabel = blocking ? ` app "${blocking.name}"` : " an owned app";
	return `Codex plugin "${plugin.pluginName ?? plugin.name}" owns${appLabel} but the source app inventory reports it is ${status}; authenticate or enable the app in Codex before migrating it to OpenClaw.`;
}
function codexPluginMigrationSubscriptionWarning() {
	return "Codex app-backed plugin migration requires the Codex app-server source account to be logged in with a ChatGPT subscription account. Log in to the Codex app with subscription auth; OpenClaw auth or API-key auth does not satisfy Codex app connector access.";
}
function codexSubscriptionRequiredMessage(plugin) {
	return `Codex plugin "${plugin.pluginName ?? plugin.name}" owns apps, but ${codexPluginMigrationSubscriptionWarning()}`;
}
function pluginNameFromSummary(summary) {
	const candidates = [summary.id, summary.name];
	for (const candidate of candidates) {
		const trimmed = candidate.trim();
		if (!trimmed) continue;
		const normalized = ((trimmed.endsWith(`@openai-curated`) ? trimmed.slice(0, -`@${CODEX_PLUGINS_MARKETPLACE_NAME}`.length) : trimmed).split("/").at(-1)?.trim())?.toLowerCase().replaceAll(/\s+/gu, "-");
		if (normalized) return normalized;
	}
}
async function discoverCodexSource(inputOrOptions) {
	const options = typeof inputOrOptions === "string" || inputOrOptions === void 0 ? { input: inputOrOptions } : inputOrOptions;
	const codexHome = resolveHomePath(options.input?.trim() || defaultCodexHome());
	const codexSkillsDir = path.join(codexHome, "skills");
	const agentsSkillsDir = personalAgentsSkillsDir();
	const configPath = path.join(codexHome, "config.toml");
	const authPath = path.join(codexHome, "auth.json");
	const modelsCachePath = path.join(codexHome, "models_cache.json");
	const hooksPath = path.join(codexHome, "hooks", "hooks.json");
	const codexSkills = await discoverSkillDirs({
		root: codexSkillsDir,
		sourceLabel: "Codex skill",
		excludeSystem: true
	});
	const personalAgentSkills = await discoverSkillDirs({
		root: agentsSkillsDir,
		sourceLabel: "personal AgentSkill"
	});
	const sourcePluginDiscovery = await discoverInstalledCuratedPlugins(codexHome, options);
	const sourcePluginNames = new Set(sourcePluginDiscovery.plugins.flatMap((plugin) => plugin.pluginName ? [plugin.pluginName] : []));
	const cachedPlugins = (await discoverPluginDirs(codexHome)).filter((plugin) => {
		const normalizedName = sanitizePluginName(plugin.name);
		return !sourcePluginNames.has(normalizedName);
	});
	const plugins = [...sourcePluginDiscovery.plugins, ...cachedPlugins].toSorted((a, b) => a.source.localeCompare(b.source));
	const archivePaths = [];
	if (await exists(configPath)) archivePaths.push({
		id: "archive:config.toml",
		path: configPath,
		relativePath: "config.toml",
		message: "Codex config is archived for manual review; it is not activated automatically"
	});
	if (await exists(hooksPath)) archivePaths.push({
		id: "archive:hooks/hooks.json",
		path: hooksPath,
		relativePath: "hooks/hooks.json",
		message: "Codex native hooks are archived for manual review because they can execute commands"
	});
	const skills = [...codexSkills, ...personalAgentSkills].toSorted((a, b) => a.source.localeCompare(b.source));
	const hasAuth = await exists(authPath);
	const high = Boolean(codexSkills.length || plugins.length || archivePaths.length || hasAuth);
	const medium = personalAgentSkills.length > 0;
	return {
		root: codexHome,
		confidence: high ? "high" : medium ? "medium" : "low",
		codexHome,
		...await isDirectory(codexSkillsDir) ? { codexSkillsDir } : {},
		...await isDirectory(agentsSkillsDir) ? { personalAgentsSkillsDir: agentsSkillsDir } : {},
		...await exists(configPath) ? { configPath } : {},
		...hasAuth ? { authPath } : {},
		...await exists(modelsCachePath) ? { modelsCachePath } : {},
		...await exists(hooksPath) ? { hooksPath } : {},
		skills,
		plugins,
		...sourcePluginDiscovery.error ? { pluginDiscoveryError: sourcePluginDiscovery.error } : {},
		archivePaths
	};
}
function hasCodexSource(source) {
	return source.confidence !== "low";
}
function sanitizePluginName(value) {
	return value.trim().toLowerCase().replaceAll(/\s+/gu, "-");
}
//#endregion
//#region extensions/codex/src/migration/targets.ts
function resolveCodexMigrationTargets(ctx) {
	const cfg = ctx.config;
	const agentId = resolveDefaultAgentId(cfg);
	const workspaceDir = resolveAgentWorkspaceDir(cfg, agentId);
	const configuredAgentDir = resolveAgentConfig(cfg, agentId)?.agentDir?.trim();
	return {
		workspaceDir,
		agentDir: ctx.runtime?.agent?.resolveAgentDir(cfg, agentId) ?? (configuredAgentDir ? resolveHomePath(configuredAgentDir) : void 0) ?? path.join(ctx.stateDir, "agents", agentId, "agent")
	};
}
//#endregion
//#region extensions/codex/src/migration/plan.ts
const CODEX_PLUGIN_CONFIG_ITEM_ID = "config:codex-plugins";
const CODEX_PLUGIN_CONFIG_PATH = [
	"plugins",
	"entries",
	"codex"
];
const CODEX_PLUGIN_ENABLED_PATH = [
	"plugins",
	"entries",
	"codex",
	"enabled"
];
const CODEX_PLUGIN_NATIVE_CONFIG_PATH = [
	"plugins",
	"entries",
	"codex",
	"config",
	"codexPlugins"
];
const MIGRATION_REASON_PLUGIN_EXISTS = "plugin exists";
const CODEX_PLUGIN_SOURCE_APP_VERIFICATION_UNVERIFIED = "not_run";
function uniqueSkillName(skill, counts) {
	const base = sanitizeName(skill.name) || "codex-skill";
	if ((counts.get(base) ?? 0) <= 1) return base;
	return sanitizeName([
		"codex",
		sanitizeName(path.basename(path.dirname(skill.source))),
		base
	].filter(Boolean).join("-")) || base;
}
async function buildSkillItems(params) {
	const baseCounts = /* @__PURE__ */ new Map();
	for (const skill of params.skills) {
		const base = sanitizeName(skill.name) || "codex-skill";
		baseCounts.set(base, (baseCounts.get(base) ?? 0) + 1);
	}
	const resolvedCounts = /* @__PURE__ */ new Map();
	const planned = params.skills.map((skill) => {
		const name = uniqueSkillName(skill, baseCounts);
		resolvedCounts.set(name, (resolvedCounts.get(name) ?? 0) + 1);
		return {
			skill,
			name,
			target: path.join(params.workspaceDir, "skills", name)
		};
	});
	const items = [];
	for (const item of planned) {
		const collides = (resolvedCounts.get(item.name) ?? 0) > 1;
		const targetExists = await exists(item.target);
		items.push(createMigrationItem({
			id: `skill:${item.name}`,
			kind: "skill",
			action: "copy",
			source: item.skill.source,
			target: item.target,
			status: collides ? "conflict" : targetExists && !params.overwrite ? "conflict" : "planned",
			reason: collides ? `multiple Codex skills normalize to "${item.name}"` : targetExists && !params.overwrite ? MIGRATION_REASON_TARGET_EXISTS : void 0,
			message: `Copy ${item.skill.sourceLabel} into this OpenClaw agent workspace.`,
			details: {
				skillName: item.name,
				sourceLabel: item.skill.sourceLabel
			}
		}));
	}
	return items;
}
function uniquePluginConfigKey(plugin, counts, usedCounts) {
	const base = sanitizeName(plugin.pluginName ?? plugin.name) || "codex-plugin";
	if ((counts.get(base) ?? 0) <= 1) return base;
	const next = (usedCounts.get(base) ?? 0) + 1;
	usedCounts.set(base, next);
	return sanitizeName(`${base}-${next}`) || base;
}
function readExistingCodexPluginEntries(config) {
	const entries = readMigrationConfigPath(config, [...CODEX_PLUGIN_NATIVE_CONFIG_PATH, "plugins"]);
	return isRecord(entries) ? entries : {};
}
function hasExistingCodexPluginEntry(existingEntries, configKey, pluginName, nextEntry) {
	const existingEntry = existingEntries[configKey];
	if (existingEntry !== void 0) return !isLegacyDestructivePolicyRepair(existingEntry, nextEntry);
	return Object.values(existingEntries).some((entry) => {
		if (!isRecord(entry)) return false;
		return entry.pluginName === pluginName;
	});
}
function isLegacyDestructivePolicyRepair(existing, nextEntry) {
	const existingEntry = isRecord(existing) ? existing : void 0;
	if (existingEntry?.allow_destructive_actions !== "on-request" || nextEntry.allow_destructive_actions !== "auto") return false;
	const normalizedExisting = {
		...existingEntry,
		allow_destructive_actions: "auto"
	};
	const normalizedEntries = Object.entries(normalizedExisting);
	return normalizedEntries.length === Object.keys(nextEntry).length && normalizedEntries.every(([key, value]) => nextEntry[key] === value);
}
function isLegacyDestructivePolicyConfigEntryRepair(existing, pluginName) {
	const existingEntry = isRecord(existing) ? existing : void 0;
	return existingEntry?.allow_destructive_actions === "on-request" && existingEntry.pluginName === pluginName;
}
function buildPluginItems(ctx, plugins) {
	const baseCounts = /* @__PURE__ */ new Map();
	for (const plugin of plugins.filter((entry) => entry.migratable)) {
		const base = sanitizeName(plugin.pluginName ?? plugin.name) || "codex-plugin";
		baseCounts.set(base, (baseCounts.get(base) ?? 0) + 1);
	}
	const existingPluginEntries = readExistingCodexPluginEntries(ctx.config);
	const usedCounts = /* @__PURE__ */ new Map();
	let manualIndex = 0;
	const items = [];
	for (const plugin of plugins) {
		if (plugin.migratable && plugin.marketplaceName === "openai-curated" && plugin.pluginName) {
			const configKey = uniquePluginConfigKey(plugin, baseCounts, usedCounts);
			const plannedEntry = {
				enabled: true,
				marketplaceName: CODEX_PLUGINS_MARKETPLACE_NAME,
				pluginName: plugin.pluginName,
				...isLegacyDestructivePolicyConfigEntryRepair(existingPluginEntries[configKey], plugin.pluginName) ? { allow_destructive_actions: "auto" } : {}
			};
			const conflict = !ctx.overwrite && hasExistingCodexPluginEntry(existingPluginEntries, configKey, plugin.pluginName, plannedEntry);
			items.push(createMigrationItem({
				id: `plugin:${configKey}`,
				kind: "plugin",
				action: "install",
				status: conflict ? "conflict" : "planned",
				reason: conflict ? MIGRATION_REASON_PLUGIN_EXISTS : void 0,
				source: plugin.source,
				target: `plugins.entries.codex.config.codexPlugins.plugins.${configKey}`,
				message: `Install Codex plugin "${plugin.pluginName}" in the OpenClaw-managed Codex app-server runtime.`,
				details: {
					configKey,
					marketplaceName: CODEX_PLUGINS_MARKETPLACE_NAME,
					pluginName: plugin.pluginName,
					sourceInstalled: plugin.installed === true,
					sourceEnabled: plugin.enabled === true,
					...plannedEntry.allow_destructive_actions === "auto" ? { allowDestructiveActions: "auto" } : {},
					...plugin.apps && plugin.apps.length > 0 && !shouldVerifyPluginApps(ctx) ? { sourceAppVerification: CODEX_PLUGIN_SOURCE_APP_VERIFICATION_UNVERIFIED } : {}
				}
			}));
			continue;
		}
		manualIndex += 1;
		if (plugin.migrationBlock && plugin.pluginName) {
			const details = {
				pluginName: plugin.pluginName,
				marketplaceName: CODEX_PLUGINS_MARKETPLACE_NAME,
				...plugin.migrationBlock.apps ? { apps: plugin.migrationBlock.apps } : {},
				...plugin.migrationBlock.error ? { error: plugin.migrationBlock.error } : {}
			};
			items.push(createMigrationItem({
				id: `plugin:${sanitizeName(plugin.name) || sanitizeName(path.basename(plugin.source))}:${manualIndex}`,
				kind: "manual",
				action: "manual",
				source: plugin.source,
				status: "skipped",
				reason: plugin.migrationBlock.code,
				message: plugin.message ?? `Codex native plugin "${plugin.name}" was found but not activated automatically.`,
				details: { ...details }
			}));
			continue;
		}
		items.push(createMigrationManualItem({
			id: `plugin:${sanitizeName(plugin.name) || sanitizeName(path.basename(plugin.source))}:${manualIndex}`,
			source: plugin.source,
			message: plugin.message ?? `Codex native plugin "${plugin.name}" was found but not activated automatically.`,
			recommendation: "Review the plugin bundle first, then install trusted compatible plugins with openclaw plugins install <path>."
		}));
	}
	return items;
}
function shouldVerifyPluginApps(ctx) {
	return ctx.providerOptions?.verifyPluginApps === true;
}
function readCodexPluginMigrationConfigEntry(item, enabled) {
	const configKey = item.details?.configKey;
	const marketplaceName = item.details?.marketplaceName;
	const pluginName = item.details?.pluginName;
	if (item.kind !== "plugin" || item.action !== "install" || typeof configKey !== "string" || marketplaceName !== "openai-curated" || typeof pluginName !== "string") return;
	return {
		configKey,
		pluginName,
		enabled,
		...item.details?.allowDestructiveActions === "auto" ? { allowDestructiveActions: "auto" } : {}
	};
}
function readExistingAllowDestructiveActions(config) {
	return normalizeExistingAllowDestructiveActions(readMigrationConfigPath(config, [...CODEX_PLUGIN_NATIVE_CONFIG_PATH, "allow_destructive_actions"]));
}
function normalizeExistingAllowDestructiveActions(value) {
	return value === "auto" || value === "on-request" ? "auto" : asBoolean(value);
}
function readExistingPluginPolicyRepairs(config) {
	if (config === void 0) return {};
	return Object.fromEntries(Object.entries(readExistingCodexPluginEntries(config)).flatMap(([configKey, entry]) => {
		const pluginEntry = isRecord(entry) ? entry : void 0;
		if (pluginEntry?.allow_destructive_actions !== "on-request") return [];
		return [[configKey, {
			...pluginEntry,
			allow_destructive_actions: "auto"
		}]];
	}));
}
function buildCodexPluginsConfigValue(entries, params = {}) {
	const plugins = {
		...readExistingPluginPolicyRepairs(params.config),
		...Object.fromEntries(entries.toSorted((a, b) => a.configKey.localeCompare(b.configKey)).map((entry) => [entry.configKey, {
			enabled: entry.enabled,
			marketplaceName: CODEX_PLUGINS_MARKETPLACE_NAME,
			pluginName: entry.pluginName,
			...entry.allowDestructiveActions ? { allow_destructive_actions: entry.allowDestructiveActions } : {}
		}]))
	};
	return {
		enabled: true,
		config: { codexPlugins: {
			enabled: true,
			allow_destructive_actions: params.config === void 0 ? true : readExistingAllowDestructiveActions(params.config) ?? true,
			plugins
		} }
	};
}
function hasCodexPluginConfigConflict(config, value) {
	const enabled = readMigrationConfigPath(config, CODEX_PLUGIN_ENABLED_PATH);
	if (enabled !== void 0 && enabled !== true) return true;
	const nativeConfig = value.config?.codexPlugins;
	if (!isRecord(nativeConfig)) return hasMigrationConfigPatchConflict(config, CODEX_PLUGIN_NATIVE_CONFIG_PATH, nativeConfig);
	const existingNativeConfig = readMigrationConfigPath(config, CODEX_PLUGIN_NATIVE_CONFIG_PATH);
	if (existingNativeConfig === void 0) return false;
	if (!isRecord(existingNativeConfig)) return true;
	if (existingNativeConfig.enabled !== void 0 && existingNativeConfig.enabled !== true) return true;
	const allowDestructiveActions = nativeConfig.allow_destructive_actions;
	const existingAllowDestructiveActions = normalizeExistingAllowDestructiveActions(existingNativeConfig.allow_destructive_actions);
	if (existingNativeConfig.allow_destructive_actions !== void 0 && existingAllowDestructiveActions !== allowDestructiveActions) return true;
	const plugins = nativeConfig.plugins;
	if (!isRecord(plugins)) return false;
	return Object.entries(plugins).some(([configKey, plugin]) => {
		if (!isRecord(plugin)) return existingNativeConfig[configKey] !== void 0;
		return hasExistingCodexPluginEntry(readExistingCodexPluginEntries(config), configKey, typeof plugin.pluginName === "string" ? plugin.pluginName : configKey, plugin);
	});
}
function buildPluginConfigItem(ctx, pluginItems) {
	const entries = pluginItems.filter((item) => item.status === "planned").map((item) => readCodexPluginMigrationConfigEntry(item, true)).filter((entry) => entry !== void 0);
	if (entries.length === 0) return;
	const value = buildCodexPluginsConfigValue(entries, { config: ctx.config });
	const conflict = !ctx.overwrite && hasCodexPluginConfigConflict(ctx.config, value);
	return createMigrationItem({
		id: CODEX_PLUGIN_CONFIG_ITEM_ID,
		kind: "config",
		action: "merge",
		target: "plugins.entries.codex.config.codexPlugins",
		status: conflict ? "conflict" : "planned",
		reason: conflict ? MIGRATION_REASON_TARGET_EXISTS : void 0,
		message: "Enable OpenClaw's Codex plugin integration and record migrated source-installed curated plugins.",
		details: {
			path: [...CODEX_PLUGIN_CONFIG_PATH],
			value
		}
	});
}
async function buildCodexMigrationPlan(ctx) {
	const targets = resolveCodexMigrationTargets(ctx);
	const source = await discoverCodexSource({
		input: ctx.source,
		evaluatePluginMigrationEligibility: true,
		verifyPluginApps: shouldVerifyPluginApps(ctx)
	});
	if (!hasCodexSource(source)) throw new Error(`Codex state was not found at ${source.root}. Pass --from <path> if it lives elsewhere.`);
	const items = [];
	items.push(...await buildCodexAuthItems({
		ctx,
		source,
		targets
	}));
	items.push(...await buildSkillItems({
		skills: source.skills,
		workspaceDir: targets.workspaceDir,
		overwrite: ctx.overwrite
	}));
	const pluginItems = buildPluginItems(ctx, source.plugins);
	items.push(...pluginItems);
	const pluginConfigItem = buildPluginConfigItem(ctx, pluginItems);
	if (pluginConfigItem) items.push(pluginConfigItem);
	for (const archivePath of source.archivePaths) items.push(createMigrationItem({
		id: archivePath.id,
		kind: "archive",
		action: "archive",
		source: archivePath.path,
		message: archivePath.message ?? "Archived in the migration report for manual review; not imported into live config.",
		details: { archiveRelativePath: archivePath.relativePath }
	}));
	const warnings = [
		...!ctx.includeSecrets && items.some((item) => item.kind === "auth") ? ["Auth credentials were detected but skipped. Re-run interactively or pass --include-secrets to import supported credentials."] : [],
		...items.some((item) => item.status === "conflict") ? ["Conflicts were found. Re-run with --overwrite to replace conflicting migration targets after item-level backups."] : [],
		...source.pluginDiscoveryError ? [`Codex app-server plugin inventory discovery failed: ${source.pluginDiscoveryError}. Cached plugin bundles, if any, are advisory only.`] : [],
		...source.plugins.some((plugin) => plugin.migrationBlock?.code === "codex_subscription_required") ? [codexPluginMigrationSubscriptionWarning()] : []
	];
	return {
		providerId: "codex",
		source: source.root,
		target: targets.workspaceDir,
		summary: summarizeMigrationItems(items),
		items,
		warnings,
		nextSteps: ["Run openclaw doctor after applying the migration.", "Review skipped or auth-required Codex plugin/config/hook items before exposing them in OpenClaw sessions."],
		metadata: {
			agentDir: targets.agentDir,
			codexHome: source.codexHome,
			codexSkillsDir: source.codexSkillsDir,
			personalAgentsSkillsDir: source.personalAgentsSkillsDir
		}
	};
}
//#endregion
//#region extensions/codex/src/migration/apply.ts
const CODEX_PLUGIN_AUTH_REQUIRED_REASON = "auth_required";
const CODEX_PLUGIN_NOT_SELECTED_REASON = "not selected for migration";
const CODEX_CONFIG_PATCH_MODE_RETURN = "return";
const CODEX_PLUGIN_LOAD_WARNING = "Some Codex plugins could not be migrated. Run `openclaw migrate codex` after onboarding.";
const TARGET_CODEX_MARKETPLACE_DISCOVERY_POLL_MS = 250;
const TARGET_CODEX_MARKETPLACE_DISCOVERY_TIMEOUT_MS = 3e4;
const TARGET_CODEX_MARKETPLACE_DISCOVERY_TIMEOUT_ENV = "OPENCLAW_CODEX_MIGRATION_PLUGIN_LIST_TIMEOUT_MS";
var CodexPluginConfigConflictError = class extends Error {
	constructor(reason) {
		super(reason);
		this.reason = reason;
		this.name = "CodexPluginConfigConflictError";
	}
};
function shouldReturnCodexPluginConfigPatch(ctx) {
	return ctx.providerOptions?.configPatchMode === CODEX_CONFIG_PATCH_MODE_RETURN;
}
function prepareTargetCodexAppServer(ctx) {
	const appServer = resolveTargetCodexAppServer(ctx);
	const targets = resolveCodexMigrationTargets(ctx);
	let warmedClient;
	const ready = getLeasedSharedCodexAppServerClient({
		startOptions: appServer.start,
		timeoutMs: 6e4,
		agentDir: targets.agentDir,
		config: ctx.config
	}).then((client) => {
		warmedClient = client;
	}, () => void 0);
	return { async dispose() {
		await ready;
		if (warmedClient) releaseLeasedSharedCodexAppServerClient(warmedClient);
		await clearSharedCodexAppServerClientIfCurrentAndWait(warmedClient, {
			exitTimeoutMs: 2e3,
			forceKillDelayMs: 250
		});
	} };
}
async function applyCodexMigrationPlan(params) {
	const plan = params.plan ?? await buildCodexMigrationPlan(params.ctx);
	const reportDir = params.ctx.reportDir ?? path.join(params.ctx.stateDir, "migration", "codex");
	const items = [];
	const targets = resolveCodexMigrationTargets(params.ctx);
	const codexHome = typeof plan.metadata?.codexHome === "string" && plan.metadata.codexHome.trim() ? plan.metadata.codexHome : plan.source;
	const authSource = {
		root: plan.source,
		confidence: "high",
		codexHome,
		authPath: path.join(codexHome, "auth.json"),
		modelsCachePath: path.join(codexHome, "models_cache.json"),
		skills: [],
		plugins: [],
		archivePaths: []
	};
	const runtime = withCachedMigrationConfigRuntime(params.ctx.runtime ?? params.runtime, params.ctx.config);
	const applyCtx = {
		...params.ctx,
		runtime
	};
	for (const item of plan.items) {
		if (item.status !== "planned") {
			items.push(item);
			continue;
		}
		if (item.id === "config:codex-plugins") items.push(await applyCodexPluginConfigItem(applyCtx, item, items));
		else if (item.kind === "auth") {
			const authItem = await applyCodexAuthItem({
				ctx: applyCtx,
				item,
				source: authSource,
				targets
			});
			items.push(authItem);
			items.push(...await buildCodexAuthConfigPatchItems({
				ctx: applyCtx,
				item: authItem,
				source: authSource
			}));
		} else if (item.kind === "plugin" && item.action === "install") items.push(await applyCodexPluginInstallItem(applyCtx, item));
		else if (item.kind === "manual") items.push(applyMigrationManualItem(item));
		else if (item.action === "archive") items.push(await archiveMigrationItem(item, reportDir));
		else items.push(await copyMigrationFileItem(item, reportDir, { overwrite: params.ctx.overwrite }));
	}
	const result = {
		...plan,
		items,
		summary: summarizeMigrationItems(items),
		backupPath: params.ctx.backupPath,
		reportDir
	};
	if (items.some(isCodexPluginLoadWarningItem)) {
		result.warnings = uniqueStrings([...result.warnings ?? [], CODEX_PLUGIN_LOAD_WARNING]);
		result.nextSteps = uniqueStrings([CODEX_PLUGIN_LOAD_WARNING, ...result.nextSteps ?? []]);
	}
	await writeMigrationReport(result, { title: "Codex Migration Report" });
	return result;
}
async function applyCodexPluginInstallItem(ctx, item) {
	const policy = readCodexPluginPolicy(item);
	if (!policy) return {
		...markMigrationItemError(item, "invalid Codex plugin migration item"),
		details: {
			...item.details,
			code: "invalid_plugin_item"
		}
	};
	try {
		const appCacheKey = await buildTargetCodexPluginAppCacheKey(ctx);
		const appServer = resolveTargetCodexAppServer(ctx);
		const result = await ensureCodexPluginActivation({
			identity: policy,
			installEvenIfActive: true,
			request: async (method, requestParams) => await requestTargetCodexAppServerJson({
				method,
				requestParams,
				timeoutMs: 6e4,
				startOptions: appServer.start,
				agentDir: resolveCodexMigrationTargets(ctx).agentDir,
				config: ctx.config,
				isolated: false
			}),
			appCache: defaultCodexAppInventoryCache,
			appCacheKey
		});
		const baseDetails = {
			...item.details,
			code: result.reason,
			activationReason: result.reason,
			...codexPluginActivationReportState(result),
			installAttempted: result.installAttempted,
			diagnostics: result.diagnostics.map((diagnostic) => diagnostic.message)
		};
		if (result.ok) return {
			...item,
			status: "migrated",
			...result.reason === "already_active" ? { reason: "already active" } : {},
			details: baseDetails
		};
		if (result.reason === CODEX_PLUGIN_AUTH_REQUIRED_REASON) return {
			...item,
			status: "skipped",
			reason: CODEX_PLUGIN_AUTH_REQUIRED_REASON,
			details: {
				...baseDetails,
				appsNeedingAuth: sanitizeAppsNeedingAuth(result.installResponse?.appsNeedingAuth ?? [])
			}
		};
		if (result.reason === "plugin_missing" || result.reason === "marketplace_missing") return {
			...item,
			status: "warning",
			reason: result.reason,
			message: `Codex plugin "${policy.pluginName}" could not be migrated automatically`,
			details: {
				...baseDetails,
				warningReason: CODEX_PLUGIN_LOAD_WARNING
			}
		};
		return {
			...item,
			status: "error",
			reason: result.reason,
			details: baseDetails
		};
	} catch (error) {
		if (isCodexPluginInventoryLoadError(error)) return {
			...item,
			status: "warning",
			reason: "plugin_inventory_unavailable",
			message: `Codex plugin "${policy.pluginName}" could not be migrated automatically`,
			details: {
				...item.details,
				code: "plugin_inventory_unavailable",
				warningReason: CODEX_PLUGIN_LOAD_WARNING,
				diagnostic: formatCodexMigrationError(error)
			}
		};
		return {
			...item,
			status: "error",
			reason: formatCodexMigrationError(error),
			details: {
				...item.details,
				code: "plugin_install_failed"
			}
		};
	}
}
function isCodexPluginInventoryLoadError(error) {
	return formatCodexMigrationError(error).includes("codex app-server plugin/list timed out");
}
function formatCodexMigrationError(error) {
	return error instanceof Error ? error.message : String(error);
}
function resolveTargetCodexAppServer(ctx) {
	return resolveCodexAppServerRuntimeOptions({ pluginConfig: readCodexPluginConfig(ctx.config) });
}
async function requestTargetCodexAppServerJson(params) {
	if (params.method !== "plugin/list") return await requestCodexAppServerJson(params);
	const deadline = Date.now() + params.timeoutMs;
	const discoveryTimeoutMs = targetCodexMarketplaceDiscoveryTimeoutMs();
	const discoveryDeadline = Math.min(deadline, Date.now() + discoveryTimeoutMs);
	let lastResponse;
	let attempt = 0;
	do {
		attempt += 1;
		const remainingMs = Math.max(1, discoveryDeadline - Date.now());
		lastResponse = await requestCodexAppServerJson({
			...params,
			timeoutMs: remainingMs
		});
		if (hasOpenAiCuratedMarketplace(lastResponse)) return lastResponse;
		if (Date.now() >= discoveryDeadline) return lastResponse;
		await sleep(Math.min(TARGET_CODEX_MARKETPLACE_DISCOVERY_POLL_MS, discoveryDeadline - Date.now()));
	} while (Date.now() < discoveryDeadline);
	return lastResponse;
}
function hasOpenAiCuratedMarketplace(response) {
	if (!response || typeof response !== "object" || !("marketplaces" in response)) return false;
	const marketplaces = response.marketplaces;
	return Array.isArray(marketplaces) && marketplaces.some((marketplace) => marketplace && typeof marketplace === "object" && marketplace.name === "openai-curated");
}
function targetCodexMarketplaceDiscoveryTimeoutMs(env = process.env) {
	const configured = parseStrictNonNegativeInteger(env[TARGET_CODEX_MARKETPLACE_DISCOVERY_TIMEOUT_ENV]);
	if (configured !== void 0) return configured;
	return TARGET_CODEX_MARKETPLACE_DISCOVERY_TIMEOUT_MS;
}
function isCodexPluginLoadWarningItem(item) {
	return item.kind === "plugin" && item.action === "install" && item.status === "warning" && item.details?.warningReason === CODEX_PLUGIN_LOAD_WARNING;
}
async function sleep(ms) {
	await new Promise((resolve) => {
		setTimeout(resolve, ms);
	});
}
async function buildTargetCodexPluginAppCacheKey(ctx) {
	const targets = resolveCodexMigrationTargets(ctx);
	const appServer = resolveTargetCodexAppServer(ctx);
	const authProfileId = resolveCodexAppServerAuthProfileIdForAgent({
		agentDir: targets.agentDir,
		config: ctx.config
	});
	const accountId = await resolveCodexAppServerAuthAccountCacheKey({
		authProfileId,
		agentDir: targets.agentDir,
		config: ctx.config
	});
	const envApiKeyFingerprint = authProfileId ? void 0 : resolveCodexAppServerFallbackApiKeyCacheKey({ startOptions: appServer.start });
	return buildCodexPluginAppCacheKey({
		appServer,
		agentDir: targets.agentDir,
		authProfileId,
		accountId,
		envApiKeyFingerprint
	});
}
async function applyCodexPluginConfigItem(ctx, item, appliedItems) {
	const entries = appliedItems.map(readAppliedPluginConfigEntry).filter((entry) => entry !== void 0);
	if (entries.length === 0) return markMigrationItemSkipped(item, "no selected Codex plugins");
	const returnPatch = shouldReturnCodexPluginConfigPatch(ctx);
	const configApi = ctx.runtime?.config;
	const currentConfig = returnPatch ? ctx.config : configApi?.current?.();
	if (!currentConfig) return markMigrationItemError(item, "config runtime unavailable");
	const value = buildCodexPluginsConfigValue(entries, { config: currentConfig });
	if (!ctx.overwrite && hasCodexPluginConfigConflict(currentConfig, value)) return markMigrationItemConflict(item, MIGRATION_REASON_TARGET_EXISTS);
	const migratedItem = {
		...item,
		status: "migrated",
		details: {
			...item.details,
			path: [...CODEX_PLUGIN_CONFIG_PATH],
			value
		}
	};
	if (returnPatch) return migratedItem;
	if (!configApi?.mutateConfigFile) return markMigrationItemError(item, "config runtime unavailable");
	try {
		await configApi.mutateConfigFile({
			base: "runtime",
			afterWrite: { mode: "auto" },
			mutate(draft) {
				if (!ctx.overwrite && hasCodexPluginConfigConflict(draft, value)) throw new CodexPluginConfigConflictError(MIGRATION_REASON_TARGET_EXISTS);
				writeMigrationConfigPath(draft, CODEX_PLUGIN_CONFIG_PATH, value);
			}
		});
		return migratedItem;
	} catch (error) {
		if (error instanceof CodexPluginConfigConflictError) return markMigrationItemConflict(item, error.reason);
		return markMigrationItemError(item, error instanceof Error ? error.message : String(error));
	}
}
function readAppliedPluginConfigEntry(item) {
	if (item.status === "migrated") return readCodexPluginMigrationConfigEntry(item, true);
	if (item.status === "skipped" && item.reason !== CODEX_PLUGIN_NOT_SELECTED_REASON && item.reason === CODEX_PLUGIN_AUTH_REQUIRED_REASON) return readCodexPluginMigrationConfigEntry(item, false);
}
function readCodexPluginPolicy(item) {
	const configKey = item.details?.configKey;
	const marketplaceName = item.details?.marketplaceName;
	const pluginName = item.details?.pluginName;
	if (typeof configKey !== "string" || marketplaceName !== "openai-curated" || typeof pluginName !== "string") return;
	return {
		configKey,
		marketplaceName: CODEX_PLUGINS_MARKETPLACE_NAME,
		pluginName,
		enabled: true,
		allowDestructiveActions: true,
		destructiveApprovalMode: "allow"
	};
}
function codexPluginActivationReportState(result) {
	switch (result.reason) {
		case "already_active":
		case "installed": return {
			installed: true,
			enabled: true
		};
		case "auth_required": return {
			installed: true,
			enabled: false
		};
		case "disabled":
		case "marketplace_missing":
		case "plugin_missing": return {
			installed: false,
			enabled: false
		};
		case "refresh_failed": return {
			installed: true,
			enabled: false
		};
	}
	return result.reason;
}
function sanitizeAppsNeedingAuth(apps) {
	return apps.map((app) => ({
		id: app.id,
		name: app.name,
		needsAuth: app.needsAuth
	}));
}
//#endregion
//#region extensions/codex/src/migration/provider.ts
function buildCodexMigrationProvider(params = {}) {
	return {
		id: "codex",
		label: "Codex",
		description: "Inventory and promote Codex CLI skills while keeping Codex native plugins and hooks explicit.",
		async detect(ctx) {
			const source = await discoverCodexSource({ input: ctx.source });
			const found = hasCodexSource(source);
			return {
				found,
				source: source.root,
				label: "Codex",
				confidence: found ? source.confidence : "low",
				message: found ? "Codex state found." : "Codex state not found."
			};
		},
		plan: buildCodexMigrationPlan,
		prepareApply(ctx) {
			return prepareTargetCodexAppServer(ctx);
		},
		async apply(ctx, plan) {
			return await applyCodexMigrationPlan({
				ctx,
				plan,
				runtime: params.runtime
			});
		}
	};
}
//#endregion
//#region extensions/codex/src/web-search-provider.ts
let codexWebSearchRuntimePromise;
function loadCodexWebSearchRuntime() {
	codexWebSearchRuntimePromise ??= import("../../web-search-provider.runtime-BGkar-nd.js");
	return codexWebSearchRuntimePromise;
}
const CodexWebSearchSchema = {
	type: "object",
	properties: { query: {
		type: "string",
		description: "Search query. Include the desired region, time range, and constraints."
	} },
	required: ["query"],
	additionalProperties: false
};
function createCodexWebSearchProvider(options = {}) {
	return {
		...createCodexWebSearchProviderBase(),
		createTool: (ctx) => {
			const nativeConfig = ctx.searchConfig?.openaiCodex;
			if (nativeConfig && typeof nativeConfig === "object" && !Array.isArray(nativeConfig) && nativeConfig.enabled === false) return null;
			return {
				description: "Search the current web through Codex hosted search and return a grounded answer with source URLs.",
				parameters: CodexWebSearchSchema,
				execute: async (args, executionContext) => {
					const { executeCodexWebSearchProviderTool } = await loadCodexWebSearchRuntime();
					return await executeCodexWebSearchProviderTool(ctx, args, executionContext, {
						pluginConfig: options.resolvePluginConfig?.() ?? resolvePluginConfigObject(ctx.config, "codex"),
						clientFactory: options.clientFactory
					});
				}
			};
		}
	};
}
//#endregion
//#region extensions/codex/index.ts
var codex_default = definePluginEntry({
	id: "codex",
	name: "Codex",
	description: "Codex app-server harness and Codex-managed GPT model catalog.",
	register(api) {
		const resolveCurrentConfig = () => api.runtime.config?.current ? api.runtime.config.current() : void 0;
		const resolveCurrentPluginConfig = () => resolveLivePluginConfigObject(resolveCurrentConfig, "codex", api.pluginConfig) ?? api.pluginConfig;
		api.registerAgentHarness(createCodexAppServerAgentHarness({ resolvePluginConfig: resolveCurrentPluginConfig }));
		api.registerProvider(buildCodexProvider({ pluginConfig: api.pluginConfig }));
		api.registerMediaUnderstandingProvider(buildCodexMediaUnderstandingProvider({ pluginConfig: api.pluginConfig }));
		api.registerWebSearchProvider(createCodexWebSearchProvider({ resolvePluginConfig: resolveCurrentPluginConfig }));
		api.registerMigrationProvider(buildCodexMigrationProvider({ runtime: api.runtime }));
		for (const command of createCodexCliSessionNodeHostCommands()) api.registerNodeHostCommand(command);
		for (const policy of createCodexCliSessionNodeInvokePolicies()) api.registerNodeInvokePolicy(policy);
		api.registerCommand(createCodexCommand({
			pluginConfig: api.pluginConfig,
			deps: {
				listCodexCliSessionsOnNode: (params) => listCodexCliSessionsOnNode({
					runtime: api.runtime,
					...params
				}),
				resolveCodexCliSessionForBindingOnNode: (params) => resolveCodexCliSessionForBindingOnNode({
					runtime: api.runtime,
					...params
				}),
				codexPluginsManagementIo: {
					readConfig: () => {
						const plugins = (api.runtime.config?.current?.() ?? {}).plugins;
						if (!plugins || typeof plugins !== "object") return Promise.resolve({});
						const entries = plugins.entries;
						if (!entries || typeof entries !== "object") return Promise.resolve({});
						const codexEntry = entries.codex;
						if (!codexEntry || typeof codexEntry !== "object") return Promise.resolve({});
						const config = codexEntry.config;
						if (!config || typeof config !== "object") return Promise.resolve({});
						const codexPlugins = config.codexPlugins;
						if (!codexPlugins || typeof codexPlugins !== "object") return Promise.resolve({});
						const declared = codexPlugins.plugins;
						if (!declared || typeof declared !== "object") return Promise.resolve({ enabled: codexPlugins.enabled === true });
						return Promise.resolve({
							enabled: codexPlugins.enabled === true,
							plugins: declared
						});
					},
					mutate: async (update) => {
						await mutateConfigFile({ mutate: (draft) => {
							const root = draft;
							root.plugins = root.plugins ?? {};
							const pluginsBlock = root.plugins;
							pluginsBlock.entries = pluginsBlock.entries ?? {};
							const entries = pluginsBlock.entries;
							entries.codex = entries.codex ?? {};
							const codexEntry = entries.codex;
							codexEntry.config = codexEntry.config ?? {};
							const config = codexEntry.config;
							config.codexPlugins = config.codexPlugins ?? {};
							const codexPlugins = config.codexPlugins;
							codexPlugins.plugins = codexPlugins.plugins ?? {};
							update(codexPlugins);
						} });
					}
				}
			}
		}));
		api.on("inbound_claim", (event, ctx) => handleCodexConversationInboundClaim(event, ctx, {
			pluginConfig: resolveCurrentPluginConfig(),
			config: resolveCurrentConfig(),
			resumeCodexCliSessionOnNode: (params) => resumeCodexCliSessionOnNode({
				runtime: api.runtime,
				...params
			})
		}));
		api.onConversationBindingResolved?.(handleCodexConversationBindingResolved);
	}
});
//#endregion
export { codex_default as default };
