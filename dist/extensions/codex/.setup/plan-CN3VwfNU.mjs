import { c as CODEX_PLUGINS_MARKETPLACE_NAME } from "./plugin-inventory-BoRei8Z4.mjs";
import "./config-BoTP_mrL.mjs";
import { c as sanitizeName, i as hasCodexSource, n as defaultCodexHome, o as exists, r as discoverCodexSource, s as readJsonObject, t as codexPluginMigrationSubscriptionWarning } from "./source-CUzJq5WN.mjs";
import { asBoolean, asOptionalRecord, isRecord, normalizeOptionalString } from "openclaw/plugin-sdk/string-coerce-runtime";
import { createHash } from "node:crypto";
import { runCommandBuffered } from "openclaw/plugin-sdk/process-runtime";
import path from "node:path";
import fs from "node:fs/promises";
import { canonicalPathFromExistingAncestor, isPathInside } from "openclaw/plugin-sdk/file-access-runtime";
import { readSecretFile } from "openclaw/plugin-sdk/secret-file";
import { fileURLToPath } from "node:url";
import { loadAuthProfileStoreWithoutExternalProfiles } from "openclaw/plugin-sdk/agent-runtime";
import { applyAuthProfileConfig, buildApiKeyCredential, buildOauthProviderAuthResult, buildOpenAICodexCredentialExtra, hasUsableOAuthCredential, resolveOpenAICodexAuthIdentity, resolveOpenAICodexImportProfileName, updateAuthProfileStoreWithLock } from "openclaw/plugin-sdk/provider-auth";
import { extractErrorCode } from "openclaw/plugin-sdk/security-runtime";
import { MIGRATION_REASON_TARGET_EXISTS, createMigrationItem, createMigrationManualItem, hasMigrationConfigPatchConflict, markMigrationItemConflict, markMigrationItemError, markMigrationItemSkipped, mergeMigrationConfigValue, readMigrationConfigPath, resolveMigrationConfigRuntime, summarizeMigrationItems } from "openclaw/plugin-sdk/migration";
import { resolvePlannedMigrationTargets } from "openclaw/plugin-sdk/migration-runtime";
import { decodeOpenAICodexJwtPayload } from "openclaw/plugin-sdk/provider-oauth-runtime";
//#region extensions/codex/src/migration/auth-profile-target.ts
const OPENAI_PROVIDER_ID$1 = "openai";
const LEGACY_CODEX_PROFILE_ID = "openai:default";
function findMatchingOAuthProfile(store, credential) {
	const subject = oauthSubject(credential);
	if (!subject) return;
	for (const [profileId, existing] of Object.entries(store.profiles)) {
		if (existing.type !== "oauth" || existing.provider !== credential.provider) continue;
		const previous = oauthSubject(existing);
		if (previous?.accountId === subject.accountId && previous.userId === subject.userId) return profileId;
	}
}
function oauthSubject(credential) {
	const claims = decodeOpenAICodexJwtPayload(credential.access)?.["https://api.openai.com/auth"];
	if (!isRecord(claims)) return;
	const accountId = normalizeOptionalString(claims.chatgpt_account_id);
	const userId = normalizeOptionalString(claims.chatgpt_user_id) ?? normalizeOptionalString(claims.user_id);
	return accountId && userId ? {
		accountId,
		userId
	} : void 0;
}
function findMatchingApiKeyProfile(store, provider, key) {
	for (const [profileId, existing] of Object.entries(store.profiles)) if (existing.type === "api_key" && existing.provider === provider && existing.key === key) return profileId;
}
function itemProfileTarget(credential, store, ctx, source) {
	if (credential.kind === "oauth") {
		const profile = credential.result.profiles[0];
		const matched = profile?.credential.type === "oauth" ? findMatchingOAuthProfile(store, profile.credential) : void 0;
		if (matched) return {
			profileId: matched,
			matchedExisting: true
		};
		const legacyProfile = ctx.config.auth?.profiles?.[LEGACY_CODEX_PROFILE_ID];
		return {
			profileId: legacyProfile?.provider === OPENAI_PROVIDER_ID$1 && legacyProfile.mode === "oauth" && source.codexHome === defaultCodexHome() && profile?.credential.type === "oauth" && oauthSubject(profile.credential) !== void 0 && !Object.entries(store.profiles).some(([id, existing]) => id !== "openai:default" && existing.type === "oauth" && existing.provider === OPENAI_PROVIDER_ID$1) ? LEGACY_CODEX_PROFILE_ID : credential.profileId,
			matchedExisting: false
		};
	}
	const matched = findMatchingApiKeyProfile(store, credential.provider, credential.key);
	return {
		profileId: matched ?? credential.profileId,
		matchedExisting: Boolean(matched)
	};
}
//#endregion
//#region extensions/codex/src/migration/cli-credentials.ts
/** Explicit migration reads the storage selected by the native credential owner. */
async function readAuthFile(home) {
	try {
		return asOptionalRecord(JSON.parse(await readSecretFile(path.join(home, "auth.json"), "Codex auth")));
	} catch {
		return;
	}
}
async function readDirectKeyring(home, signal) {
	const account = `cli|${createHash("sha256").update(home).digest("hex").slice(0, 16)}`;
	const result = await runCommandBuffered([
		"security",
		"find-generic-password",
		"-s",
		"Codex Auth",
		"-a",
		account,
		"-w"
	], {
		timeoutMs: 6e4,
		maxCombinedOutputBytes: 16384,
		signal
	});
	if (result.termination !== "exit" || result.code !== 0) return;
	try {
		return asOptionalRecord(JSON.parse(result.stdout.toString("utf8")));
	} catch {
		return;
	}
}
async function readCodexCliCredentialsAsync(options) {
	options.signal?.throwIfAborted();
	if (!options.allowKeychainPrompt) return;
	const home = await fs.realpath(options.codexHome).catch(() => path.resolve(options.codexHome));
	const { CodexAppServerClient } = await import("./client-Cs08OXVQ.mjs").then((n) => n.n);
	const { resolveManagedCodexPackageEntrypoint, resolveManagedCodexNativeCommand } = await import("./managed-binary-BnshlFag.mjs").then((n) => n.n);
	const launcher = resolveManagedCodexPackageEntrypoint(path.dirname(fileURLToPath(import.meta.url)));
	const command = launcher ? resolveManagedCodexNativeCommand(launcher) : void 0;
	if (!command) return;
	const signal = AbortSignal.any([AbortSignal.timeout(process.platform === "darwin" ? 6e4 : 5e3), ...options.signal ? [options.signal] : []]);
	const client = await CodexAppServerClient.start({
		transport: "stdio",
		command,
		commandSource: "resolved-managed",
		args: ["app-server"],
		cwd: home,
		homeScope: "user",
		env: { CODEX_HOME: home },
		clearEnv: [
			"OPENAI_API_KEY",
			"CODEX_API_KEY",
			"CODEX_ACCESS_TOKEN"
		]
	}, () => signal.throwIfAborted()).catch(() => {
		options.signal?.throwIfAborted();
	});
	if (!client) return;
	const abort = () => client.close();
	signal.addEventListener("abort", abort, { once: true });
	let credential;
	try {
		credential = await readNativeCredential(client, home, options, signal);
	} catch {}
	signal.removeEventListener("abort", abort);
	const closed = await client.closeAndWait({
		forceKillDelayMs: 6e3,
		exitTimeoutMs: 7e3
	});
	if (!closed.exited || closed.cleanup !== "closed") throw new Error("The Codex credential reader could not stop. No credential was imported.", { cause: options.signal?.reason });
	options.signal?.throwIfAborted();
	return credential;
}
async function readNativeCredential(client, home, options, signal) {
	signal.throwIfAborted();
	await client.initialize();
	if (client.getRuntimeIdentity()?.codexHome !== home) return;
	const revision = client.getModelCatalogRevision();
	const configured = await client.request("config/read", {
		includeLayers: false,
		cwd: home
	}, { signal });
	const mode = (await client.request("configRequirements/read", {}, { signal })).requirements?.cli_auth_credentials_store ?? configured.config.cli_auth_credentials_store ?? "file";
	let record;
	if (mode === "file") record = await readAuthFile(home);
	else if ((mode === "keyring" || mode === "auto") && process.platform === "darwin") {
		let cursor;
		let encrypted;
		do {
			const features = await client.request("experimentalFeature/list", {
				limit: 100,
				cursor
			}, { signal });
			const storage = features.data.find((feature) => feature.name === "secret_auth_storage");
			if (storage) {
				encrypted = storage.enabled;
				break;
			}
			cursor = features.nextCursor ?? void 0;
		} while (cursor);
		if (encrypted !== false) return;
		record = await readDirectKeyring(home, signal);
	}
	signal.throwIfAborted();
	if (!record) return;
	const oauth = options.credentialKind === "api_key" ? void 0 : parseOAuthCredential(record);
	let apiKey = options.credentialKind === "oauth" ? void 0 : parseApiKeyCredential(record);
	if (apiKey) {
		const account = await client.request("account/read", { refreshToken: false }, { signal }).catch(() => void 0);
		if (account?.account?.type !== "apiKey" || !account.requiresOpenaiAuth) apiKey = void 0;
	}
	signal.throwIfAborted();
	return !client.getCloseError() && client.getModelCatalogRevision() === revision ? {
		...oauth ? { oauth } : {},
		...apiKey ? { apiKey } : {}
	} : void 0;
}
function jwtExpiry(token) {
	try {
		const exp = asOptionalRecord(JSON.parse(Buffer.from(token.split(".")[1] ?? "", "base64url").toString("utf8")))?.exp;
		return typeof exp === "number" && Number.isFinite(exp) && exp > 0 ? exp * 1e3 : void 0;
	} catch {
		return;
	}
}
function parseOAuthCredential(data) {
	const mode = typeof data.auth_mode === "string" ? data.auth_mode.toLowerCase() : void 0;
	if (mode !== void 0 && mode !== "chatgpt" && mode !== "chatgptauthtokens") return;
	const tokens = asOptionalRecord(data.tokens);
	if (typeof tokens?.access_token !== "string" || !tokens.access_token || typeof tokens.refresh_token !== "string" || !tokens.refresh_token) return;
	const lastRefresh = typeof data.last_refresh === "string" ? Date.parse(data.last_refresh) : NaN;
	return {
		type: "oauth",
		provider: "openai",
		access: tokens.access_token,
		refresh: tokens.refresh_token,
		expires: jwtExpiry(tokens.access_token) ?? (Number.isFinite(lastRefresh) ? lastRefresh : Date.now()) + 36e5,
		...typeof tokens.account_id === "string" ? { accountId: tokens.account_id } : {},
		...typeof tokens.id_token === "string" ? { idToken: tokens.id_token } : {}
	};
}
function parseApiKeyCredential(data) {
	const mode = typeof data.auth_mode === "string" ? data.auth_mode.toLowerCase() : void 0;
	if (mode !== void 0 && mode !== "apikey" && mode !== "api_key") return;
	const key = typeof data.OPENAI_API_KEY === "string" ? data.OPENAI_API_KEY.trim() : "";
	return key ? {
		type: "api_key",
		provider: "openai",
		key
	} : void 0;
}
//#endregion
//#region extensions/codex/src/migration/auth.ts
const OPENAI_PROVIDER_ID = "openai";
const OPENAI_OAUTH_ITEM_ID = "auth:openai";
const OPENAI_API_KEY_ITEM_ID = "auth:openai:api-key";
const OPENAI_CODEX_DEFAULT_MODEL = "openai/gpt-6-astra";
const CODEX_IMPORT_DISPLAY_NAME = "Codex import";
const CODEX_REASON_AUTH_NOT_SELECTED = "auth credential migration not selected";
const CODEX_REASON_AUTH_PROFILE_EXISTS = "auth profile exists";
const CODEX_REASON_AUTH_PROFILE_UNUSABLE = "existing OAuth profile requires sign-in";
const CODEX_REASON_AUTH_PROFILE_WRITE_FAILED = "failed to write auth profile";
const CODEX_REASON_AUTH_NO_LONGER_PRESENT = "auth credential no longer present";
const CODEX_REASON_MISSING_AUTH_METADATA = "missing auth metadata";
const CODEX_REASON_AUTH_STORAGE_NOT_IMPORTABLE = "credential storage is not importable";
var CodexAuthConfigConflict = class extends Error {};
function authItemId(credential) {
	return credential.kind === "oauth" ? OPENAI_OAUTH_ITEM_ID : OPENAI_API_KEY_ITEM_ID;
}
function sourceCredentialFingerprint(credential) {
	const profile = credential.kind === "oauth" ? credential.result.profiles[0]?.credential : void 0;
	const source = credential.kind === "api_key" ? credential.key : profile?.type === "oauth" ? [
		profile.access,
		profile.refresh,
		profile.accountId,
		profile.idToken
	] : void 0;
	return createHash("sha256").update(JSON.stringify([credential.kind, source])).digest("hex");
}
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
async function buildCodexOAuthCredential(source, credential, includeConfigPatch) {
	const identity = resolveOpenAICodexAuthIdentity({
		access: credential.access,
		accountId: credential.accountId
	});
	const configPatch = includeConfigPatch ? { agents: { defaults: { models: Object.fromEntries((await readModelRefs(source)).map((modelRef) => [modelRef, {}])) } } } : {};
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
		result
	} : null;
}
async function readCodexAuthCredentials(source, options) {
	const credentials = await readCodexCliCredentialsAsync({
		codexHome: source.codexHome,
		credentialKind: options.credentialKind,
		allowKeychainPrompt: options.allowKeychainPrompt,
		...options.signal ? { signal: options.signal } : {}
	});
	return [credentials?.oauth ? await buildCodexOAuthCredential(source, credentials.oauth, options.includeConfigPatch) : null, credentials?.apiKey ? {
		kind: "api_key",
		provider: OPENAI_PROVIDER_ID,
		profileId: "openai:codex-import",
		key: credentials.apiKey.key
	} : null].filter((entry) => entry !== null);
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
		config = resolveMigrationConfigRuntime(ctx)?.current?.() ?? config;
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
function applyOAuthConfigToConfig(cfg, credential, profileId) {
	let next = mergeMigrationConfigValue(cfg, credential.result.configPatch);
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
function resolveCodexConfigPatchMode(ctx) {
	const mode = ctx.providerOptions?.configPatchMode;
	return mode === "none" || mode === "return" ? mode : "apply";
}
function allowCodexKeychainPrompt(ctx) {
	const explicit = ctx.providerOptions?.allowKeychainPrompt;
	return typeof explicit === "boolean" ? explicit : ctx.includeSecrets === true;
}
function resolveRequestedCredentialKind(ctx) {
	const kind = ctx.providerOptions?.credentialKind;
	return kind === "oauth" || kind === "api_key" ? kind : void 0;
}
function authProfileConfigForCredential(credential, profileId) {
	if (credential.kind === "api_key") return {
		profileId,
		provider: credential.provider,
		mode: "api_key",
		displayName: CODEX_IMPORT_DISPLAY_NAME
	};
	const profile = credential.result.profiles[0];
	if (!profile || profile.credential.type !== "oauth") return null;
	return {
		profileId,
		provider: profile.credential.provider,
		mode: "oauth",
		...profile.credential.email ? { email: profile.credential.email } : {},
		...profile.credential.displayName ? { displayName: profile.credential.displayName } : {}
	};
}
async function applyCodexAuthProfileConfig(ctx, profile, applyConfig) {
	const configApi = resolveMigrationConfigRuntime(ctx);
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
async function applyCodexAuthConfig(ctx, credential, profileId) {
	const profile = authProfileConfigForCredential(credential, profileId);
	if (!profile) return "unavailable";
	return applyCodexAuthProfileConfig(ctx, profile, (config) => applyCredentialConfig(config, credential, profileId));
}
function applyCredentialConfig(config, credential, profileId) {
	return credential.kind === "oauth" ? applyOAuthConfigToConfig(config, credential, profileId) : applyApiKeyConfigToConfig(config, credential, profileId);
}
async function buildCodexAuthItems(params) {
	const configPatchMode = resolveCodexConfigPatchMode(params.ctx);
	const allowKeychainPrompt = allowCodexKeychainPrompt(params.ctx);
	const credentials = await readCodexAuthCredentials(params.source, {
		credentialKind: resolveRequestedCredentialKind(params.ctx),
		includeConfigPatch: configPatchMode !== "none",
		allowKeychainPrompt,
		signal: params.ctx.signal
	});
	if (credentials.length === 0) {
		const requestedKind = resolveRequestedCredentialKind(params.ctx);
		if (!requestedKind && allowKeychainPrompt) return [];
		return (requestedKind ? [requestedKind] : ["oauth", "api_key"]).map((credentialKind) => createMigrationItem({
			id: credentialKind === "api_key" ? OPENAI_API_KEY_ITEM_ID : OPENAI_OAUTH_ITEM_ID,
			kind: "auth",
			action: "skip",
			source: params.source.codexHome,
			status: "skipped",
			sensitive: true,
			reason: allowKeychainPrompt ? CODEX_REASON_AUTH_STORAGE_NOT_IMPORTABLE : void 0,
			message: allowKeychainPrompt ? "No supported Codex credential could be imported. Continue with sign-in to connect OpenClaw." : "Codex credentials have not been inspected. Confirm credential import to check the current Codex sign-in.",
			details: {
				provider: OPENAI_PROVIDER_ID,
				credentialKind,
				credentialImportUnavailable: true
			}
		}));
	}
	const store = loadAuthProfileStoreWithoutExternalProfiles(params.targets.agentDir);
	const skipped = !params.ctx.includeSecrets;
	return credentials.map((credential) => {
		const { profileId, matchedExisting } = itemProfileTarget(credential, store, params.ctx, params.source);
		const existing = store.profiles[profileId];
		const configProfile = authProfileConfigForCredential(credential, profileId);
		const configConflict = configProfile ? hasAuthProfileConfigConflict(params.ctx.config, configProfile, Boolean(params.ctx.overwrite)) : false;
		const conflict = (existing && !matchedExisting && !params.ctx.overwrite || configConflict) && !skipped;
		const unavailable = !skipped && !conflict && !params.ctx.overwrite && existing?.type === "oauth" && !hasUsableOAuthCredential(existing);
		return createMigrationItem({
			id: authItemId(credential),
			kind: "auth",
			action: skipped || unavailable ? "skip" : "create",
			source: params.source.codexHome,
			target: `${params.targets.agentDir}/openclaw-agent.sqlite#auth_profile_store:${profileId}`,
			status: skipped || unavailable ? "skipped" : conflict ? "conflict" : "planned",
			sensitive: true,
			reason: skipped ? CODEX_REASON_AUTH_NOT_SELECTED : conflict ? CODEX_REASON_AUTH_PROFILE_EXISTS : unavailable ? CODEX_REASON_AUTH_PROFILE_UNUSABLE : void 0,
			message: unavailable ? "The existing OpenAI sign-in needs to be renewed. Continue with sign-in." : credential.kind === "oauth" ? configPatchMode === "none" ? "Import Codex OAuth credentials." : "Import Codex OAuth credentials and configure OpenAI Codex models." : "Import Codex OpenAI API key.",
			details: {
				provider: credential.provider,
				profileId,
				sourceProfileId: credential.profileId,
				sourceCredentialFingerprint: sourceCredentialFingerprint(credential),
				sourceKind: "codex-native-selected-storage",
				...profileId === "openai:default" && !matchedExisting ? { legacyNativeHome: params.source.codexHome } : {},
				credentialKind: credential.kind,
				credentialImportUnavailable: unavailable
			}
		});
	});
}
function createCodexAuthItemApplier(params) {
	const { items, ...context } = params;
	const selectedKinds = new Set(items.filter((item) => item.kind === "auth" && item.status === "planned").map((item) => item.details?.credentialKind));
	const selectedKind = selectedKinds.size === 1 ? selectedKinds.values().next().value : void 0;
	let snapshot;
	const readCredentials = () => snapshot ??= readCodexAuthCredentials(context.source, {
		credentialKind: selectedKind === "oauth" || selectedKind === "api_key" ? selectedKind : void 0,
		includeConfigPatch: resolveCodexConfigPatchMode(context.ctx) !== "none",
		allowKeychainPrompt: allowCodexKeychainPrompt(context.ctx),
		signal: context.ctx.signal
	});
	return (item) => applyCodexAuthItem({
		...context,
		item,
		readCredentials
	});
}
async function applyCodexAuthItem(params) {
	const { ctx, item, source, targets } = params;
	if (item.status !== "planned") return [item];
	const profileId = typeof item.details?.profileId === "string" ? item.details.profileId : "";
	const provider = typeof item.details?.provider === "string" ? item.details.provider : "";
	const sourceProfileId = typeof item.details?.sourceProfileId === "string" ? item.details.sourceProfileId : void 0;
	const credentialKind = item.details?.credentialKind;
	if (!profileId || !provider || credentialKind !== "oauth" && credentialKind !== "api_key") return [markMigrationItemError(item, CODEX_REASON_MISSING_AUTH_METADATA)];
	const configPatchMode = resolveCodexConfigPatchMode(ctx);
	ctx.signal?.throwIfAborted();
	const credentials = await params.readCredentials();
	ctx.signal?.throwIfAborted();
	const credential = credentials.find((candidate) => candidate.provider === provider && candidate.kind === credentialKind && (!sourceProfileId || candidate.profileId === sourceProfileId));
	if (!credential) return [markMigrationItemSkipped(item, CODEX_REASON_AUTH_NO_LONGER_PRESENT)];
	if (item.details?.sourceCredentialFingerprint !== sourceCredentialFingerprint(credential)) return [markMigrationItemSkipped(item, CODEX_REASON_AUTH_NO_LONGER_PRESENT)];
	if (item.details?.legacyNativeHome !== void 0 && (item.details.legacyNativeHome !== source.codexHome || source.codexHome !== defaultCodexHome())) return [markMigrationItemSkipped(item, CODEX_REASON_AUTH_NO_LONGER_PRESENT)];
	ctx.signal?.throwIfAborted();
	const oauthProfile = credential.kind === "oauth" ? credential.result.profiles[0] : void 0;
	const oauthCredential = oauthProfile?.credential.type === "oauth" ? oauthProfile.credential : void 0;
	if (credential.kind === "oauth" && !oauthCredential) return [markMigrationItemError(item, CODEX_REASON_MISSING_AUTH_METADATA)];
	const configProfile = authProfileConfigForCredential(credential, profileId);
	if (!configProfile) return [markMigrationItemError(item, CODEX_REASON_MISSING_AUTH_METADATA)];
	if (hasCurrentAuthProfileConfigConflict(ctx, configProfile)) return [markMigrationItemConflict(item, CODEX_REASON_AUTH_PROFILE_EXISTS)];
	let conflicted = false;
	let unusable = false;
	let wrote = false;
	const store = await updateAuthProfileStoreWithLock({
		agentDir: targets.agentDir,
		stateDir: ctx.stateDir,
		updater: (freshStore) => {
			ctx.signal?.throwIfAborted();
			const effectiveStore = loadAuthProfileStoreWithoutExternalProfiles(targets.agentDir);
			if (item.details?.legacyNativeHome !== void 0 && itemProfileTarget(credential, effectiveStore, ctx, source).profileId !== profileId) {
				conflicted = true;
				return false;
			}
			const existing = effectiveStore.profiles[profileId];
			if (!ctx.overwrite && existing) {
				if ((credential.kind === "oauth" ? findMatchingOAuthProfile(effectiveStore, oauthCredential) : findMatchingApiKeyProfile(effectiveStore, credential.provider, credential.key)) === profileId) {
					unusable = existing.type === "oauth" && !hasUsableOAuthCredential(existing);
					return false;
				}
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
	if (conflicted) return [markMigrationItemConflict(item, CODEX_REASON_AUTH_PROFILE_EXISTS)];
	if (unusable) return [markMigrationItemSkipped(item, CODEX_REASON_AUTH_PROFILE_UNUSABLE)];
	if (!store || !loadAuthProfileStoreWithoutExternalProfiles(targets.agentDir).profiles[profileId]) return [markMigrationItemError(item, CODEX_REASON_AUTH_PROFILE_WRITE_FAILED)];
	const configResult = configPatchMode !== "apply" ? "unavailable" : await applyCodexAuthConfig(ctx, credential, profileId);
	if (configResult === "conflict") return [markMigrationItemConflict(item, CODEX_REASON_AUTH_PROFILE_EXISTS)];
	const migratedItem = {
		...item,
		status: "migrated",
		details: {
			...item.details,
			wroteAuthProfile: wrote,
			configUpdated: configResult === "configured",
			...configPatchMode === "return" ? { configPatchReturned: true } : {}
		}
	};
	return [migratedItem, ...configPatchMode === "return" ? buildCodexAuthConfigPatchItems(ctx, migratedItem, credential, profileId) : []];
}
function buildCodexAuthConfigPatchItems(ctx, item, credential, profileId) {
	const next = applyCredentialConfig(ctx.config, credential, profileId);
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
const MIGRATION_REASON_TARGET_NOT_REGULAR = "target is not a regular file";
async function lstatIfExists(filePath) {
	try {
		return await fs.lstat(filePath);
	} catch (error) {
		const code = extractErrorCode(error);
		if (code === "ENOENT" || code === "ENOTDIR") return;
		throw error;
	}
}
async function buildCodexMemoryItems(params) {
	const items = [];
	for (const memory of params.memoryFiles) {
		const target = path.join(params.workspaceDir, "memory", "imports", "codex", path.basename(memory.path));
		const targetStat = await lstatIfExists(target);
		const targetNotRegular = targetStat !== void 0 && !targetStat.isFile();
		if (!targetNotRegular) {
			const [source, workspace, destination] = await Promise.all([
				fs.realpath(path.dirname(memory.path)),
				canonicalPathFromExistingAncestor(params.workspaceDir),
				canonicalPathFromExistingAncestor(target)
			]);
			if (!isPathInside(workspace, destination)) throw new Error("Codex memory import destination must stay in the selected workspace.");
			if (isPathInside(source, destination) || isPathInside(destination, source)) throw new Error("Codex memory source and OpenClaw import destination must be separate paths.");
		}
		const targetConflict = targetStat !== void 0 && !params.overwrite;
		items.push(createMigrationItem({
			id: memory.id,
			kind: "memory",
			action: "copy",
			source: memory.path,
			target,
			status: targetNotRegular || targetConflict ? "conflict" : "planned",
			reason: targetNotRegular ? MIGRATION_REASON_TARGET_NOT_REGULAR : targetConflict ? MIGRATION_REASON_TARGET_EXISTS : void 0,
			message: "Copy consolidated Codex memory into the OpenClaw memory index.",
			details: {
				sourceType: "codex-memory",
				sourceLabel: memory.label,
				collectionId: "codex",
				collectionLabel: "Codex",
				relativePath: path.basename(memory.path)
			}
		}));
	}
	return items;
}
function uniqueSkillName(skill, counts) {
	const base = sanitizeName(skill.name) || "codex-skill";
	if ((counts.get(base) ?? 0) <= 1) return base;
	const parent = sanitizeName(path.basename(path.dirname(skill.source)));
	return sanitizeName([
		"codex",
		parent,
		base
	].filter(Boolean).join("-")) || base;
}
async function buildCodexSkillItems(params) {
	const counts = /* @__PURE__ */ new Map();
	for (const skill of params.skills) {
		const base = sanitizeName(skill.name) || "codex-skill";
		counts.set(base, (counts.get(base) ?? 0) + 1);
	}
	const planned = params.skills.map((skill) => {
		const name = uniqueSkillName(skill, counts);
		return {
			skill,
			name,
			target: path.join(params.workspaceDir, "skills", name)
		};
	});
	const resolvedCounts = planned.reduce((resolved, item) => {
		resolved.set(item.name, (resolved.get(item.name) ?? 0) + 1);
		return resolved;
	}, /* @__PURE__ */ new Map());
	return await Promise.all(planned.map(async (item) => {
		const collision = (resolvedCounts.get(item.name) ?? 0) > 1;
		const targetExists = await exists(item.target);
		const conflict = collision || targetExists && !params.overwrite;
		return createMigrationItem({
			id: `skill:${item.name}`,
			kind: "skill",
			action: "copy",
			source: item.skill.source,
			target: item.target,
			status: conflict ? "conflict" : "planned",
			reason: collision ? `multiple Codex skills normalize to "${item.name}"` : conflict ? MIGRATION_REASON_TARGET_EXISTS : void 0,
			message: `Copy ${item.skill.sourceLabel} into this OpenClaw agent workspace.`,
			details: {
				skillName: item.name,
				sourceLabel: item.skill.sourceLabel
			}
		});
	}));
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
function readExistingPluginAllowDestructiveActions(existing, pluginName) {
	const existingEntry = isRecord(existing) ? existing : void 0;
	if (existingEntry?.pluginName !== pluginName) return;
	const normalized = normalizeExistingAllowDestructiveActions(existingEntry.allow_destructive_actions);
	return normalized === "auto" || normalized === "ask" ? normalized : void 0;
}
function buildPluginItems(ctx, plugins) {
	const existingPluginEntries = readExistingCodexPluginEntries(ctx.config);
	let manualIndex = 0;
	const items = [];
	for (const plugin of plugins) {
		if (plugin.migratable && plugin.marketplaceName === "openai-curated" && plugin.pluginName) {
			const configKey = plugin.pluginName;
			const plannedEntry = {
				enabled: true,
				marketplaceName: CODEX_PLUGINS_MARKETPLACE_NAME,
				pluginName: plugin.pluginName,
				...(() => {
					const allowDestructiveActions = readExistingPluginAllowDestructiveActions(existingPluginEntries[configKey], plugin.pluginName);
					return allowDestructiveActions ? { allow_destructive_actions: allowDestructiveActions } : {};
				})()
			};
			const conflict = !ctx.overwrite && hasExistingCodexPluginEntry(existingPluginEntries, configKey, plugin.pluginName, plannedEntry);
			items.push(createMigrationItem({
				id: `plugin:${configKey}`,
				kind: "plugin",
				action: "install",
				status: conflict ? "conflict" : "planned",
				reason: conflict ? MIGRATION_REASON_PLUGIN_EXISTS : void 0,
				applyPhase: "after-promotion",
				source: plugin.source,
				target: `plugins.entries.codex.config.codexPlugins.plugins.${configKey}`,
				message: `Install Codex plugin "${plugin.pluginName}" in the OpenClaw-managed Codex app-server runtime.`,
				details: {
					configKey,
					marketplaceName: CODEX_PLUGINS_MARKETPLACE_NAME,
					pluginName: plugin.pluginName,
					sourceInstalled: plugin.installed === true,
					sourceEnabled: plugin.enabled === true,
					...plannedEntry.allow_destructive_actions === "auto" || plannedEntry.allow_destructive_actions === "ask" ? { allowDestructiveActions: plannedEntry.allow_destructive_actions } : {},
					...plugin.apps && plugin.apps.length > 0 && !shouldVerifyPluginApps(ctx) ? { sourceAppVerification: CODEX_PLUGIN_SOURCE_APP_VERIFICATION_UNVERIFIED } : {}
				}
			}));
			continue;
		}
		manualIndex += 1;
		if (plugin.migrationBlock && plugin.pluginName) {
			items.push(createMigrationItem({
				id: `plugin:${sanitizeName(plugin.name) || sanitizeName(path.basename(plugin.source))}:${manualIndex}`,
				kind: "manual",
				action: "manual",
				source: plugin.source,
				status: "skipped",
				reason: plugin.migrationBlock.code,
				message: plugin.message ?? `Codex native plugin "${plugin.name}" was found but not activated automatically.`,
				details: {
					pluginName: plugin.pluginName,
					marketplaceName: CODEX_PLUGINS_MARKETPLACE_NAME,
					...plugin.migrationBlock.apps ? { apps: plugin.migrationBlock.apps } : {},
					...plugin.migrationBlock.error ? { error: plugin.migrationBlock.error } : {}
				}
			}));
			continue;
		}
		items.push(createMigrationManualItem({
			id: `plugin:${sanitizeName(plugin.name) || sanitizeName(path.basename(plugin.source))}:${manualIndex}`,
			source: plugin.source,
			message: plugin.message ?? `Codex native plugin "${plugin.name}" was found but not activated automatically.`,
			recommendation: "Review the plugin bundle first, then install trusted compatible plugins with openclaw plugins install <path> --force."
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
	const allowDestructiveActions = item.details?.allowDestructiveActions;
	return {
		configKey,
		pluginName,
		enabled,
		...allowDestructiveActions === "auto" || allowDestructiveActions === "ask" ? { allowDestructiveActions } : {}
	};
}
function readExistingAllowDestructiveActions(config) {
	return normalizeExistingAllowDestructiveActions(readMigrationConfigPath(config, [...CODEX_PLUGIN_NATIVE_CONFIG_PATH, "allow_destructive_actions"]));
}
function normalizeExistingAllowDestructiveActions(value) {
	if (value === "auto" || value === "on-request") return "auto";
	if (value === "ask") return "ask";
	return asBoolean(value);
}
function readExistingPluginPolicyRepairs(config) {
	return Object.fromEntries(Object.entries(readExistingCodexPluginEntries(config)).flatMap(([configKey, entry]) => {
		const pluginEntry = isRecord(entry) ? entry : void 0;
		if (pluginEntry?.allow_destructive_actions !== "on-request") return [];
		return [[configKey, {
			...pluginEntry,
			allow_destructive_actions: "auto"
		}]];
	}));
}
function buildCodexPluginsConfigValue(entries, config) {
	const plugins = {
		...readExistingPluginPolicyRepairs(config),
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
			allow_destructive_actions: readExistingAllowDestructiveActions(config) ?? true,
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
	const value = buildCodexPluginsConfigValue(entries, ctx.config);
	const conflict = !ctx.overwrite && hasCodexPluginConfigConflict(ctx.config, value);
	return createMigrationItem({
		id: CODEX_PLUGIN_CONFIG_ITEM_ID,
		kind: "config",
		action: "merge",
		target: "plugins.entries.codex.config.codexPlugins",
		status: conflict ? "conflict" : "planned",
		reason: conflict ? MIGRATION_REASON_TARGET_EXISTS : void 0,
		applyPhase: "after-promotion",
		message: "Enable OpenClaw's Codex plugin integration and record migrated source-installed curated plugins.",
		details: {
			path: [...CODEX_PLUGIN_CONFIG_PATH],
			value
		}
	});
}
async function buildCodexMigrationPlan(ctx) {
	const targets = resolvePlannedMigrationTargets(ctx);
	const memoryOnly = ctx.itemKinds !== void 0 && ctx.itemKinds.length > 0 && ctx.itemKinds.every((kind) => kind === "memory");
	const authOnly = ctx.itemKinds !== void 0 && ctx.itemKinds.length > 0 && ctx.itemKinds.every((kind) => kind === "auth");
	const source = await discoverCodexSource({
		input: ctx.source,
		memoryOnly,
		authOnly,
		evaluatePluginMigrationEligibility: !memoryOnly && !authOnly,
		verifyPluginApps: shouldVerifyPluginApps(ctx)
	});
	if (!hasCodexSource(source) && !authOnly) throw new Error(`Codex state was not found at ${source.root}. Pass --from <path> if it lives elsewhere.`);
	const items = [];
	if (!authOnly) items.push(...await buildCodexMemoryItems({
		memoryFiles: source.memoryFiles,
		workspaceDir: targets.workspaceDir,
		overwrite: ctx.overwrite
	}));
	if (!memoryOnly) items.push(...await buildCodexAuthItems({
		ctx,
		source,
		targets
	}));
	if (!memoryOnly && !authOnly) {
		items.push(...await buildCodexSkillItems({
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
	}
	const warnings = [
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
		nextSteps: memoryOnly ? [] : ["Run openclaw doctor after applying the migration.", "Review skipped or auth-required Codex plugin/config/hook items before exposing them in OpenClaw sessions."],
		metadata: {
			agentDir: targets.agentDir,
			codexHome: source.codexHome,
			codexSkillsDir: source.codexSkillsDir,
			personalAgentsSkillsDir: source.personalAgentsSkillsDir
		}
	};
}
//#endregion
export { CODEX_PLUGIN_CONFIG_ITEM_ID, CODEX_PLUGIN_CONFIG_PATH, buildCodexMigrationPlan, buildCodexPluginsConfigValue, hasCodexPluginConfigConflict, resolveCodexConfigPatchMode as n, readCodexPluginMigrationConfigEntry, createCodexAuthItemApplier as t };
