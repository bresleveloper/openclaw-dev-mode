import { o as dedupeModelCatalogEntries, r as buildConfiguredModelCatalog } from "./model-selection-shared-CKMggJal.js";
import { n as createProviderAuthChecker } from "./model-provider-auth-BQ-E242H.js";
import { n as createModelVisibilityPolicy, t as RUNTIME_MODEL_VISIBILITY_NORMALIZATION } from "./model-visibility-policy-DBLJaeyE.js";
//#region src/agents/model-catalog-visibility.ts
const OPENAI_PROVIDER_ID = "openai";
const OPENAI_CODEX_RESPONSES_API = "openai-chatgpt-responses";
const OPENAI_CODEX_ROUTABLE_MODEL_IDS = new Set([
	"gpt-5.5",
	"gpt-5.5-pro",
	"gpt-5.4",
	"gpt-5.4-codex",
	"gpt-5.4-pro",
	"gpt-5.4-mini"
]);
function isPromiseLike(value) {
	return typeof value === "object" && value !== null && typeof value.then === "function";
}
function isCodexRoutableOpenAIPlatformCatalogEntry(entry) {
	return entry.provider.trim().toLowerCase() === OPENAI_PROVIDER_ID && entry.api !== void 0 && entry.api !== OPENAI_CODEX_RESPONSES_API && OPENAI_CODEX_ROUTABLE_MODEL_IDS.has(entry.id.trim().toLowerCase());
}
async function resolveProviderAuthCheck(providerAuthChecker, provider, modelApi) {
	const result = modelApi === void 0 ? providerAuthChecker(provider) : providerAuthChecker(provider, modelApi);
	return isPromiseLike(result) ? await result : result;
}
async function modelCatalogEntryHasProviderAuth(providerAuthChecker, entry) {
	if (await resolveProviderAuthCheck(providerAuthChecker, entry.provider, entry.api)) return true;
	return isCodexRoutableOpenAIPlatformCatalogEntry(entry) ? await resolveProviderAuthCheck(providerAuthChecker, entry.provider, OPENAI_CODEX_RESPONSES_API) : false;
}
function sortModelCatalogEntries(entries) {
	return entries.toSorted((a, b) => a.provider.localeCompare(b.provider) || a.id.localeCompare(b.id));
}
/**
* Resolve catalog entries visible for one view, honoring explicit visibility
* policy, configured models, and providers with usable auth.
*/
async function resolveVisibleModelCatalog(params) {
	if (params.view === "all") return params.catalog;
	const buildDefaultVisibleCatalog = async () => {
		const configuredCatalog = sortModelCatalogEntries(buildConfiguredModelCatalog({ cfg: params.cfg }));
		const hasAuth = params.providerAuthChecker ?? createProviderAuthChecker({
			cfg: params.cfg,
			workspaceDir: params.workspaceDir,
			agentDir: params.agentDir,
			agentId: params.agentId,
			env: params.env,
			allowPluginSyntheticAuth: params.runtimeAuthDiscovery,
			discoverExternalCliAuth: params.runtimeAuthDiscovery
		});
		const authBackedCatalog = [];
		for (const entry of params.catalog) if (await modelCatalogEntryHasProviderAuth(hasAuth, entry)) authBackedCatalog.push(entry);
		return sortModelCatalogEntries(dedupeModelCatalogEntries([...configuredCatalog, ...authBackedCatalog]));
	};
	const policy = createModelVisibilityPolicy({
		cfg: params.cfg,
		catalog: params.catalog,
		defaultProvider: params.defaultProvider,
		defaultModel: params.defaultModel,
		agentId: params.agentId,
		...RUNTIME_MODEL_VISIBILITY_NORMALIZATION
	});
	const defaultVisibleCatalog = policy.allowAny || policy.hasProviderWildcards ? await buildDefaultVisibleCatalog() : [];
	return sortModelCatalogEntries(dedupeModelCatalogEntries(policy.visibleCatalog({
		catalog: params.catalog,
		defaultVisibleCatalog,
		view: params.view
	})));
}
//#endregion
export { resolveVisibleModelCatalog as n, isCodexRoutableOpenAIPlatformCatalogEntry as t };
