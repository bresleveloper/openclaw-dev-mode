import { l as isSecretRef } from "./types.secrets-OocW4TQ1.js";
import { i as normalizeProviderId } from "./provider-id-Dq06Bcx6.js";
import { o as resolveAgentEffectiveModelPrimary } from "./agent-scope-B2Pk_xhT.js";
import { a as resolveAgentDir, c as resolveDefaultAgentId, o as resolveAgentWorkspaceDir } from "./agent-scope-config-BxAUeF6t.js";
import { n as resolveDefaultAgentWorkspaceDir } from "./workspace-default-ClCi3unQ.js";
import { r as DEFAULT_PROVIDER } from "./defaults-mDjiWzE5.js";
import { u as loadAuthProfileStoreWithoutExternalProfiles } from "./store-9jfx-1KO.js";
import "./auth-profiles-aoLBSIs2.js";
import { i as resolveAuthProfileOrder } from "./order-DjOYyPH4.js";
import { l as hasRuntimeAvailableProviderAuth } from "./model-auth-Cg-0So6j.js";
import "./workspace-BJm9kqLw.js";
import { a as resolveCliRuntimeExecutionProvider } from "./model-runtime-aliases-B1-PRucg.js";
import { t as loadModelCatalogForBrowse } from "./model-catalog-browse-f3Uh9aye.js";
import { n as resolveVisibleModelCatalog, t as isCodexRoutableOpenAIPlatformCatalogEntry } from "./model-catalog-visibility-DTioZkXT.js";
//#region src/gateway/server-methods/models-list-result.ts
let loggedSlowModelsListCatalog = false;
const OAUTH_REFRESH_MARGIN_MS = 300 * 1e3;
const OPENAI_CODEX_RESPONSES_API = "openai-chatgpt-responses";
function resolveModelsListView(params) {
	return typeof params.view === "string" ? params.view : "default";
}
function omitRuntimeModelParams(entry) {
	const { params: _params, ...rest } = entry;
	return rest;
}
function createInFlightProviderAuthChecker(providerAuthChecker) {
	const pending = /* @__PURE__ */ new Map();
	return (provider, modelApi) => {
		const key = `${normalizeProviderId(provider)}\0${modelApi ?? ""}`;
		const cached = pending.get(key);
		if (cached) return cached;
		const next = Promise.resolve(providerAuthChecker(provider, modelApi));
		pending.set(key, next);
		return next;
	};
}
function hasLiteralSecret(value) {
	return typeof value === "string" && value.trim().length > 0;
}
function hasAvailableEnvSecretRef(value) {
	return isSecretRef(value) && value.source === "env" && hasLiteralSecret(process.env[value.id]);
}
function hasSecretRef(value) {
	return isSecretRef(value);
}
function profileModeAllowedForModel(provider, modelApi, mode) {
	return normalizeProviderId(provider) !== "openai" || modelApi === void 0 || modelApi === "openai-chatgpt-responses" || mode === "api_key";
}
function profileHasReadOnlyAvailableAuth(params) {
	if (!profileModeAllowedForModel(params.provider, params.modelApi, params.credential.type)) return false;
	if (params.credential.type === "api_key") {
		if (hasLiteralSecret(params.credential.key) || hasAvailableEnvSecretRef(params.credential.keyRef)) return true;
		return hasSecretRef(params.credential.keyRef) ? void 0 : false;
	}
	if (params.credential.type === "token") {
		if (hasLiteralSecret(params.credential.token) || hasAvailableEnvSecretRef(params.credential.tokenRef)) return params.credential.expires === void 0 || params.credential.expires > params.now;
		return hasSecretRef(params.credential.tokenRef) ? void 0 : false;
	}
	return hasLiteralSecret(params.credential.access) && params.credential.expires > params.now + OAUTH_REFRESH_MARGIN_MS;
}
function hasReadOnlyAvailableProfileAuth(params) {
	const now = Date.now();
	let sawUnknown = false;
	for (const profileId of resolveAuthProfileOrder({
		cfg: params.cfg,
		store: params.store,
		provider: params.provider
	})) {
		const credential = params.store.profiles[profileId];
		if (!credential) continue;
		const available = profileHasReadOnlyAvailableAuth({
			credential,
			provider: params.provider,
			modelApi: params.modelApi,
			now
		});
		if (available === true) return true;
		if (available === void 0) sawUnknown = true;
	}
	return sawUnknown ? void 0 : false;
}
function createModelsListProviderAuthChecker(params) {
	const store = loadAuthProfileStoreWithoutExternalProfiles(resolveAgentDir(params.cfg, params.agentId), { allowKeychainPrompt: false });
	return createInFlightProviderAuthChecker((provider, modelApi) => hasRuntimeAvailableProviderAuth({
		provider,
		modelApi,
		cfg: params.cfg,
		workspaceDir: params.workspaceDir,
		allowPluginSyntheticAuth: false
	}) || hasReadOnlyAvailableProfileAuth({
		provider,
		modelApi,
		cfg: params.cfg,
		store
	}));
}
async function resolveModelsListEntryAvailability(providerAuthChecker, entry, cfg, agentId) {
	const primary = await providerAuthChecker(entry.provider, entry.api);
	if (primary === true) return primary;
	let available = primary;
	const runtimeProvider = resolveCliRuntimeExecutionProvider({
		provider: entry.provider,
		cfg,
		agentId,
		modelId: entry.id
	});
	if (runtimeProvider && normalizeProviderId(runtimeProvider) !== normalizeProviderId(entry.provider)) {
		const runtimeAvailable = await providerAuthChecker(runtimeProvider);
		if (runtimeAvailable === true) return true;
		if (available === false && runtimeAvailable === void 0) available = void 0;
	}
	if (!isCodexRoutableOpenAIPlatformCatalogEntry(entry)) return available;
	return await providerAuthChecker(entry.provider, OPENAI_CODEX_RESPONSES_API) ?? available;
}
async function buildPublicModelsListEntry(params) {
	const publicEntry = omitRuntimeModelParams(params.entry);
	if (!params.providerAuthChecker) return publicEntry;
	const available = await resolveModelsListEntryAvailability(params.providerAuthChecker, params.entry, params.cfg, params.agentId);
	return {
		...publicEntry,
		available: available ?? false
	};
}
async function buildPublicModelsListEntries(params) {
	const providerAuthChecker = createModelsListProviderAuthChecker(params);
	return await Promise.all(params.catalog.map((entry) => buildPublicModelsListEntry({
		entry,
		cfg: params.cfg,
		agentId: params.agentId,
		providerAuthChecker
	})));
}
async function buildModelsListResult(params) {
	const cfg = params.context.getRuntimeConfig();
	const agentId = params.agentId ?? resolveDefaultAgentId(cfg);
	const workspaceDir = resolveAgentWorkspaceDir(cfg, agentId) ?? resolveDefaultAgentWorkspaceDir();
	const view = resolveModelsListView(params.params);
	const catalog = await loadModelCatalogForBrowse({
		cfg,
		view,
		loadCatalog: async (loadParams) => {
			const readOnlyLoad = loadParams.readOnly ?? true;
			if (params.preloadedCatalog && readOnlyLoad) return params.preloadedCatalog;
			return await params.context.loadGatewayModelCatalog(loadParams);
		},
		onTimeout: (timeoutMs) => {
			if (loggedSlowModelsListCatalog) return;
			loggedSlowModelsListCatalog = true;
			params.context.logGateway.debug(`models.list continuing without model catalog after ${timeoutMs}ms`);
		}
	});
	if (view === "all") return { models: await buildPublicModelsListEntries({
		catalog,
		cfg,
		agentId,
		workspaceDir
	}) };
	return { models: await buildPublicModelsListEntries({
		catalog: await resolveVisibleModelCatalog({
			cfg,
			catalog,
			defaultProvider: DEFAULT_PROVIDER,
			defaultModel: resolveAgentEffectiveModelPrimary(cfg, agentId),
			agentId,
			workspaceDir,
			view,
			runtimeAuthDiscovery: false
		}),
		cfg,
		agentId,
		workspaceDir
	}) };
}
//#endregion
export { buildModelsListResult as t };
