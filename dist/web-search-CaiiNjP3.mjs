import { i as parseConcreteConfigPathTokens } from "./dot-path-BSC76DAI.mjs";
import { p as resolveSecretInputRef } from "./types.secrets-B5xWSzLp.mjs";
import { u as getRuntimeConfigSourceSnapshot } from "./runtime-snapshot-DbgWcCyV.mjs";
import { t as findModelCatalogEntry } from "./model-catalog-lookup-C3iQmurZ.mjs";
import { t as resolveDefaultModelForAgent } from "./model-selection-config-DZ4sk4C2.mjs";
import { t as ErrorCodes } from "./gateway-error-details-D85F07e9.mjs";
import { ch as validateWebSearchStatusParams, lh as validateWebSearchTestParams } from "./src-BRUl7oDv.mjs";
import { f as errorShape } from "./error-codes-DvB36bCj.mjs";
import { r as assertSecretOwnerAvailable } from "./runtime-degraded-state-DVMYGogL.mjs";
import "./persisted-B486xwB_.mjs";
import { o as getPreparedRuntimeAuthProfileStoreSnapshot } from "./store-CTvq6MSF.mjs";
import "./model-selection-CaFyCMqp.mjs";
import { t as BUILTIN_AGENT_HARNESS_METADATA } from "./builtin-openclaw-metadata-zVszIwdU.mjs";
import { a as hasAuthProfileForProvider } from "./model-config.helpers-qc7Dcjci.mjs";
import { a as resolveWebSearchProviderId, n as isWebSearchProviderConfigured, o as runWebSearch, r as listConfiguredWebSearchProviders } from "./runtime-CldNr-kn.mjs";
import { t as resolveWebSearchToolPolicy } from "./web-search-tool-policy-BzVITC2P.mjs";
import { t as resolveNativeWebSearchRoute } from "./native-web-search-Bn1invbi.mjs";
import { t as runtimeWebSecretOwnerId } from "./runtime-web-secret-owner-CrfKjyQg.mjs";
import { n as normalizeWebSearchOutput, r as unwrapWebSearchOutputText } from "./web-search-output-CTDJQUNM.mjs";
import { n as readPreparedCatalog } from "./server-model-catalog-auth-d5Ty5VGR.mjs";
import { n as resolveCatalogDecisionRuntime, t as createModelCatalogDecisions } from "./model-catalog-decisions-CsGXi9Al.mjs";
import { s as resolveManagedPluginMetadata, u as resolvePluginCredentialDescriptors } from "./management-service-BPiOYlEh.mjs";
import { a as listSearchProviderOptions } from "./search-setup-BzS9ZHJw.mjs";
import { t as assertValidParams } from "./validation-CFv_zneu.mjs";
import { n as resolveModelAuthAgentScope, t as modelAuthAgentScopeError } from "./model-auth-agent-scope-EqqePUcC.mjs";
import { r as resolveAuthenticatedProfileId } from "./users-profile-access-YpysuaBj.mjs";
//#region src/gateway/server-methods/web-search-status.ts
function credentialSource(provider, config, authStore) {
	if (provider.requiresCredential === false) return "none";
	const value = provider.getConfiguredCredentialValue?.(config);
	if (resolveSecretInputRef({ value }).ref) return "secretRef";
	if (typeof value === "string" && value.trim()) return "config";
	if (provider.envVars.some((name) => Boolean(process.env[name]?.trim()))) return "env";
	const fallback = provider.getConfiguredCredentialFallback?.(config)?.value;
	if (resolveSecretInputRef({ value: fallback }).ref) return "secretRef";
	if (typeof fallback === "string" && fallback.trim()) return "config";
	return provider.authProviderId && hasAuthProfileForProvider({
		provider: provider.authProviderId,
		authStore
	}) ? "auth-profile" : "missing";
}
async function prepareWebSearchStatus(context, request, requesterProfileId) {
	const config = context.getRuntimeConfig();
	const scope = resolveModelAuthAgentScope(config, request.agentId);
	if (!scope.ok) return { error: modelAuthAgentScopeError(scope) };
	const authStore = getPreparedRuntimeAuthProfileStoreSnapshot(scope.agentDir) ?? {
		version: 1,
		profiles: {}
	};
	const defaultModel = resolveDefaultModelForAgent({
		cfg: config,
		agentId: scope.agentId
	});
	const modelRef = {
		provider: request.modelProvider?.trim() || defaultModel.provider,
		model: request.modelId?.trim() || defaultModel.model
	};
	const metadata = resolveManagedPluginMetadata(config, process.env);
	const sourceConfig = getRuntimeConfigSourceSnapshot() ?? config;
	const available = listConfiguredWebSearchProviders({ config });
	const availableIds = new Set(available.map((entry) => entry.id));
	const providers = [...new Map([...listSearchProviderOptions(config), ...available].map((entry) => [entry.id, entry])).values()].toSorted((a, b) => a.label.localeCompare(b.label)).map((entry) => {
		const manifest = metadata.byPluginId.get(entry.pluginId);
		const credential = manifest && entry.credentialPath ? resolvePluginCredentialDescriptors(manifest).find((field) => JSON.stringify(field.path) === JSON.stringify(parseConcreteConfigPathTokens(entry.credentialPath))) : void 0;
		return {
			id: entry.id,
			pluginId: entry.pluginId,
			label: entry.label,
			hint: entry.hint,
			configured: isWebSearchProviderConfigured({
				provider: entry,
				config,
				agentDir: scope.agentDir,
				authStore
			}),
			installed: Boolean(manifest),
			available: availableIds.has(entry.id),
			requiresCredential: entry.requiresCredential !== false,
			credentialSource: credentialSource(entry, sourceConfig, authStore),
			configPath: entry.configPath === null ? [] : [
				"plugins",
				"entries",
				entry.pluginId,
				"config",
				...entry.configPath ?? ["webSearch"]
			],
			credentialPath: entry.credentialPath || void 0,
			credential,
			docsUrl: entry.docsUrl || void 0,
			signupUrl: entry.signupUrl || void 0
		};
	});
	const enabled = config.tools?.web?.search?.enabled !== false;
	const provider = config.tools?.web?.search?.provider?.trim() || null;
	const selectedId = resolveWebSearchProviderId({
		config,
		agentDir: scope.agentDir,
		providers: available,
		authStore
	});
	const selected = providers.find((entry) => entry.id === selectedId && entry.available);
	const status = {
		enabled,
		provider,
		agentId: scope.agentId,
		model: {
			provider: modelRef.provider,
			id: modelRef.model,
			runtime: "unknown",
			runtimeLabel: "Not resolved"
		},
		providers,
		route: {
			kind: "unavailable",
			label: "Search unavailable",
			testable: false
		}
	};
	const policy = resolveWebSearchToolPolicy({
		config,
		agentId: scope.agentId,
		modelProvider: modelRef.provider,
		modelId: modelRef.model
	});
	if (!enabled || !policy.allowed) {
		status.route = {
			kind: "disabled",
			label: "Search disabled",
			testable: false,
			reason: !enabled ? "Web search is disabled in Settings." : "The agent's tool policy does not allow web search."
		};
		return {
			status,
			config,
			agentDir: scope.agentDir
		};
	}
	if (provider && selected) status.testProvider = {
		id: selected.id,
		label: selected.label
	};
	const catalog = await readPreparedCatalog(context, scope.agentId);
	if (catalog) {
		const entry = findModelCatalogEntry(catalog.entries, {
			provider: modelRef.provider,
			modelId: modelRef.model
		});
		if (entry) {
			const decisions = createModelCatalogDecisions({
				cfg: config,
				agentId: scope.agentId,
				agentDir: scope.agentDir,
				workspaceDir: catalog.workspaceDir,
				snapshot: catalog,
				metadataSnapshot: catalog.metadataSnapshot,
				preparedAuthStore: catalog.authStore,
				preparedRuntimeAuthModes: catalog.authModes,
				preparedRuntimeAuthMaterializations: catalog.authMaterializations,
				requesterProfileId,
				pluginRegistry: catalog.pluginRegistry,
				isCurrent: catalog.isCurrent,
				observationConfig: catalog.observationConfig
			});
			const variants = catalog.routeVariants.filter((row) => row.provider === entry.provider && row.id === entry.id);
			const host = await decisions.evaluateEntry(entry, variants);
			const evaluation = decisions.evaluateNative(entry, host);
			if (!catalog.isCurrent()) throw new Error("Model catalog changed during search status projection.");
			const runtime = resolveCatalogDecisionRuntime({
				cfg: config,
				agentId: scope.agentId,
				entry,
				evaluation,
				pluginRegistry: catalog.pluginRegistry
			});
			status.model.runtime = runtime?.id ?? "openclaw";
			status.model.runtimeLabel = status.model.runtime === BUILTIN_AGENT_HARNESS_METADATA.id ? BUILTIN_AGENT_HARNESS_METADATA.label : catalog.pluginRegistry?.agentHarnesses.find(({ harness }) => harness.id === status.model.runtime)?.harness.label ?? "External agent runtime";
			const native = resolveNativeWebSearchRoute({
				config,
				agentId: scope.agentId,
				agentDir: scope.agentDir,
				modelProvider: modelRef.provider,
				modelId: modelRef.model,
				authStore: catalog.authStore,
				modelApi: evaluation.selectedRoute?.api ?? entry.api,
				modelBaseUrl: evaluation.selectedRoute?.baseUrl ?? entry.baseUrl
			});
			if (status.model.runtime === "openclaw" && native.kind === "native") {
				status.route = {
					kind: "native",
					provider: native.provider,
					label: "Native web search",
					testable: false,
					reason: "Search runs inside the selected model's response. Test it by asking this model to search in a chat."
				};
				return {
					status,
					config,
					agentDir: scope.agentDir
				};
			}
			if (status.model.runtime !== "openclaw") {
				status.route = {
					kind: "external",
					provider: status.model.runtime,
					label: `${status.model.runtimeLabel} controls search`,
					testable: false,
					reason: "The selected harness determines native search availability when the turn starts. A configured OpenClaw provider does not prove which tool that harness will use. Test search in a chat with this model."
				};
				return {
					status,
					config,
					agentDir: scope.agentDir
				};
			}
		}
	}
	if (status.model.runtime === "unknown") {
		status.route = {
			kind: "unavailable",
			label: "Model search route is not ready",
			testable: false,
			reason: "The selected model is not in the prepared model catalog. Refresh Models, then try again. An explicitly configured search provider can still be tested separately."
		};
		return {
			status,
			config,
			agentDir: scope.agentDir
		};
	}
	status.route = selected ? {
		kind: "managed",
		provider: selected.id,
		label: selected.label,
		testable: true,
		...selected.configured ? {} : { reason: "Provider credentials are missing or unresolved. Configure them before testing." }
	} : {
		kind: "unavailable",
		label: "No search provider available",
		testable: false,
		reason: provider ? "The selected search provider is unavailable. Enable or install its plugin and configure its credentials." : "Choose a search provider, or select a model with native search."
	};
	return {
		status,
		config,
		agentDir: scope.agentDir
	};
}
//#endregion
//#region src/gateway/server-methods/web-search.ts
function hasSearchAuthority(options, required) {
	const { client, signal, hasCurrentClientAuthority } = options;
	return Boolean(client && !client.invalidated && !client.connectionSignal?.aborted && (client.connect.scopes?.includes("operator.admin") || required === "read" && client.connect.scopes?.includes("operator.read")) && !signal?.aborted && (!hasCurrentClientAuthority || hasCurrentClientAuthority()));
}
function searchTestError(error) {
	const message = error instanceof Error ? error.message : String(error);
	if (/401|403|auth|credential|api.?key|secret/i.test(message)) return "The search provider could not authenticate. Check its credentials and account access.";
	if (/429|rate.?limit|quota|billing|credit/i.test(message)) return "The search provider rejected the request because of an account or rate limit. Check its usage and billing.";
	if (/abort|timeout|timed out/i.test(message)) return "The search request was cancelled or timed out. Check connectivity and try again.";
	return "The search provider could not complete the request. Check its endpoint, connectivity, and provider status.";
}
const webSearchHandlers = {
	"webSearch.status": async (options) => {
		const { params, respond, context } = options;
		if (!assertValidParams(params, validateWebSearchStatusParams, "webSearch.status", respond)) return;
		if (Boolean(params.modelProvider) !== Boolean(params.modelId)) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "modelProvider and modelId must be supplied together."));
			return;
		}
		if (!hasSearchAuthority(options, "read")) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "Current read access is required to inspect search settings."));
			return;
		}
		const requesterProfileId = resolveAuthenticatedProfileId(options.client);
		try {
			const prepared = await prepareWebSearchStatus(context, params, requesterProfileId);
			if (prepared.error) respond(false, void 0, prepared.error);
			else if (!hasSearchAuthority(options, "read") || resolveAuthenticatedProfileId(options.client) !== requesterProfileId || context.getRuntimeConfig() !== prepared.config) respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, "Search settings changed. Refresh and try again."));
			else respond(true, prepared.status, void 0);
		} catch {
			respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, "Search settings are not ready. Refresh and try again."));
		}
	},
	"webSearch.test": async (options) => {
		const { params, respond, context } = options;
		if (!assertValidParams(params, validateWebSearchTestParams, "webSearch.test", respond)) return;
		const query = params.query.trim();
		if (!query || Boolean(params.modelProvider) !== Boolean(params.modelId)) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "Provide a search query and both model selection fields, or neither."));
			return;
		}
		if (!hasSearchAuthority(options, "admin")) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "Current administrator access is required to test search."));
			return;
		}
		const requesterProfileId = resolveAuthenticatedProfileId(options.client);
		try {
			const prepared = await prepareWebSearchStatus(context, params, requesterProfileId);
			if (prepared.error) {
				respond(false, void 0, prepared.error);
				return;
			}
			const { status, config, agentDir } = prepared;
			const hasCurrentAuthority = () => hasSearchAuthority(options, "admin") && resolveAuthenticatedProfileId(options.client) === requesterProfileId && context.getRuntimeConfig() === config;
			if (!hasCurrentAuthority()) {
				respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, "Search settings or access changed. Refresh and try again."));
				return;
			}
			const explicitProvider = params.providerId?.trim();
			const provider = explicitProvider ?? status.route.provider;
			if (!(explicitProvider ? explicitProvider === status.testProvider?.id : status.route.kind === "managed" && status.route.testable) || !provider) {
				respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, status.route.reason ?? "Choose an available search provider before testing."));
				return;
			}
			const startedAt = Date.now();
			let result;
			try {
				assertSecretOwnerAvailable("capability", runtimeWebSecretOwnerId("search", provider));
				const signal = AbortSignal.any([
					...options.signal ? [options.signal] : [],
					...options.client?.connectionSignal ? [options.client.connectionSignal] : [],
					AbortSignal.timeout((config.tools?.web?.search?.timeoutSeconds ?? 30) * 1e3)
				]);
				const executed = await runWebSearch({
					config: {
						...config,
						tools: {
							...config.tools,
							web: {
								...config.tools?.web,
								search: {
									...config.tools?.web?.search,
									cacheTtlMinutes: 0
								}
							}
						}
					},
					preferInputConfig: true,
					agentDir,
					providerId: provider,
					args: {
						query,
						count: 5
					},
					signal,
					assertCurrent: () => {
						if (!hasCurrentAuthority()) throw new Error("Search settings or access changed during the test.");
						assertSecretOwnerAvailable("capability", runtimeWebSecretOwnerId("search", provider));
					}
				});
				const normalized = normalizeWebSearchOutput({
					...executed,
					query
				});
				const latencyMs = Date.now() - startedAt;
				if (normalized.kind === "results") result = {
					provider: executed.provider,
					latencyMs,
					status: "ok",
					results: normalized.results.map((row) => ({
						title: unwrapWebSearchOutputText(row.title),
						url: row.url,
						...row.snippet ? { snippet: unwrapWebSearchOutputText(row.snippet) } : {}
					})),
					cached: normalized.cached === true
				};
				else if (normalized.kind === "answer") result = {
					provider: executed.provider,
					latencyMs,
					status: "ok",
					content: unwrapWebSearchOutputText(normalized.content),
					citations: normalized.citations?.map((row) => ({
						url: row.url,
						...row.title ? { title: unwrapWebSearchOutputText(row.title) } : {}
					})),
					cached: normalized.cached === true
				};
				else result = {
					provider,
					latencyMs,
					status: "error",
					error: normalized.kind === "error" ? searchTestError(normalized.message) : "The provider returned a response without supported search results or an answer."
				};
			} catch (error) {
				result = {
					provider,
					latencyMs: Date.now() - startedAt,
					status: "error",
					error: searchTestError(error)
				};
			}
			if (!hasCurrentAuthority()) {
				respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, "Search settings or access changed during the test. Refresh and try again."));
				return;
			}
			respond(true, result, void 0);
		} catch {
			respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, "Search settings are not ready. Refresh and try again."));
		}
	}
};
//#endregion
export { webSearchHandlers };
