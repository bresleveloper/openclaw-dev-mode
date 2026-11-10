import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { w as parseStrictPositiveInteger } from "./number-coercion-CkhMiRw8.mjs";
import { r as normalizeProviderId } from "./provider-id-D1VImdKk.mjs";
import { a as resolveAgentDir, f as resolveAgentWorkspaceDir } from "./agent-scope-config-fjA2T9Gz.mjs";
import { t as resolveDefaultAgentWorkspaceDir } from "./workspace-default-path-BccyWLRI.mjs";
import { t as warnPluginSdkDeprecation } from "./sdk-deprecation-DjTmOhOX.mjs";
import { h as resolveSessionAgentId } from "./agent-scope-DXrnO3F4.mjs";
import { i as buildModelAliasIndex, o as dedupeModelCatalogEntries, p as resolveBareModelDefaultProvider, y as resolveModelRefFromString } from "./model-selection-shared-CVU_V2PQ.mjs";
import { a as resolveModelCatalogIdentityKey, r as openAIModelCatalogRoutePolicy } from "./openai-model-routes-BJEokkWC.mjs";
import { t as resolveDefaultModelForAgent } from "./model-selection-config-CrboVKXT.mjs";
import { a as listOpenAIAuthProfileProvidersForAgentRuntime } from "./openai-routing-Bm7d8DH8.mjs";
import { t as getChannelPlugin } from "./registry-B91r5qN6.mjs";
import "./plugins-CCVkYF8m.mjs";
import { f as formatProviderLoginCommand } from "./oauth-refresh-failure-H1_-S915.mjs";
import { n as createModelVisibilityPolicy } from "./model-visibility-policy-pIK04Peo.mjs";
import { t as resolveAgentHarnessPolicy } from "./policy-BESW9cGp.mjs";
import "./model-selection-DdQ-ffuG.mjs";
import { r as listCliRuntimeModelBackendBindings } from "./cli-backends-BzVT3JSM.mjs";
import { o as isRetiredModelPickerProvider } from "./model-runtime-aliases-DJRpB3Nd.mjs";
import { s as getPreparedModelRuntimeAuthStore } from "./prepared-model-runtime-auth-xGBK6WuU.mjs";
import { t as PreparedModelRuntimeOwnerNotPublishedError } from "./prepared-model-runtime-admission-errors-DFzPwru3.mjs";
import "./workspace-3xrXOvoY.mjs";
import { r as PreparedModelRuntimePublicationSupersededError } from "./prepared-model-runtime.errors-DCd9wajc.mjs";
import { c as loadPublishedPreparedModelCatalogOwnerSnapshot } from "./prepared-model-catalog-B9Dr8wIV.mjs";
import { n as commandReply, r as defineAuthorizedTextCommand } from "./command-gates-Dcr0LjaJ.mjs";
import { n as resolveAgentRuntimeLabel } from "./agent-runtime-label-X2Hryd-W.mjs";
import { i as normalizeRuntimeChoiceId, o as resolveRuntimeNormalization } from "./model-runtime-normalization-B2xB-s-G.mjs";
import { n as prepareModelCatalogDecisions, r as resolveCatalogDecisionRuntime, t as createModelCatalogDecisions } from "./model-catalog-decisions-B-_jc7Z2.mjs";
import { n as resolveLogicalModelCatalogEntryState, r as resolveLogicalVisibleModelCatalog } from "./model-catalog-visibility-Ck3zj3mW.mjs";
import { o as resolveProviderChannelLoginChoice } from "./provider-login-options-C1Hm1UhP.mjs";
import { n as resolveModelAuthLabelAsync, t as resolveModelAuthLabel } from "./model-auth-label-Ds3jL8Jm.mjs";
//#region src/shared/model-runtime-route.ts
/** Presentation only: a provider name alone does not identify Anthropic's execution route. */
function resolveModelRuntimeRoute(provider, runtimeId) {
	if (runtimeId === "claude-cli" || provider === "claude-cli" && !runtimeId) return "claudeCli";
	if (provider === "anthropic") {
		if (runtimeId === "openclaw") return "anthropicApi";
		if (!runtimeId) return "anthropicConfigured";
	}
}
//#endregion
//#region src/auto-reply/reply/commands-models-menu.ts
const CUSTOM_MODEL_SETUP_GUIDANCE = "Set up this connection with the custom-provider guide: https://docs.openclaw.ai/concepts/model-providers/custom-providers";
const CLAUDE_CLI_SETUP_GUIDANCE = "If Claude Code is signed out, run claude auth login on the Gateway host, or choose another model.";
const MODEL_PROVIDER_ROUTE_DETAILS = {
	claudeCli: "Claude CLI runs through Claude Code using its native login or a selected saved account. An explicitly selected API-key account has separate API billing; CLI does not mean free or subscription-only.",
	anthropicConfigured: "Anthropic models can use the API or Claude CLI. Check each model's route label and selected account: API-key usage is billed separately from a Claude subscription."
};
function buildModelsMenu(data) {
	const modelNames = new Map(data.modelNames);
	const byProvider = /* @__PURE__ */ new Map();
	for (const [id, models] of data.byProvider) {
		const notices = /* @__PURE__ */ new Set();
		const providerRoute = resolveModelRuntimeRoute(id);
		if (providerRoute === "claudeCli" || providerRoute === "anthropicConfigured") notices.add(MODEL_PROVIDER_ROUTE_DETAILS[providerRoute]);
		let available = 0;
		const loginSupported = data.loginProviders.has(id);
		const loginCommand = formatProviderLoginCommand(id);
		const pending = data.pendingProviders?.includes(id) === true;
		for (const model of models) {
			const key = `${id}/${model}`;
			const state = data.modelAvailability.get(key);
			const route = resolveModelRuntimeRoute(id, state.runtimeId);
			const routeLabel = route === "claudeCli" ? "Claude CLI" : route === "anthropicApi" ? "API" : "";
			if (routeLabel) modelNames.set(key, `${routeLabel} · ${data.modelNames.get(key) ?? model}`);
			if (state.availability === true) {
				available += 1;
				continue;
			}
			let label;
			let recovery;
			if (state.runtimeAuth?.source === "native" && state.availability === void 0) {
				label = pending ? "Checking native agent" : "Connection not confirmed";
				recovery = pending ? "Run /models again when discovery finishes." : "Check the native app on the Gateway host, then run /models again.";
			} else switch (state.unavailableReason) {
				case "missing-auth":
					label = "Sign-in needed";
					recovery = route === "claudeCli" ? CLAUDE_CLI_SETUP_GUIDANCE : loginSupported ? `Connect with ${loginCommand}.` : CUSTOM_MODEL_SETUP_GUIDANCE;
					break;
				case "auth-failed":
					label = "Sign-in failed";
					recovery = loginSupported ? `Sign in again with ${loginCommand}.` : CUSTOM_MODEL_SETUP_GUIDANCE;
					break;
				case "cooldown":
					label = "Temporarily unavailable";
					recovery = "Try again later or choose another model.";
					break;
				default:
					label = state.availability === false ? "Unavailable" : "Connection not confirmed";
					recovery = state.availability === false ? "Run /models again or choose another model." : loginSupported ? `Connect with ${loginCommand}, or choose another model.` : CUSTOM_MODEL_SETUP_GUIDANCE;
			}
			modelNames.set(key, `${label} — ${modelNames.get(key) ?? model}`);
			notices.add(`${id}: ${label}. ${recovery}`);
		}
		byProvider.set(id, {
			available,
			notice: [...notices].join("\n")
		});
	}
	return {
		modelNames,
		byProvider
	};
}
//#endregion
//#region src/auto-reply/reply/commands-models-catalog.ts
/** Undefined is unknown; an empty list is an authoritative refusal. */
function getModelsRuntimeChoices(data, provider, model) {
	if (data.isCurrent?.() === false) return;
	return model ? data.runtimeChoicesByModel?.get(`${normalizeProviderId(provider)}/${model}`) : data.runtimeChoicesByProvider?.get(normalizeProviderId(provider));
}
function buildPreparedModelsProviderData(cfg, agentId, options = {}) {
	return loadModelsProviderData(cfg, agentId, options);
}
async function loadModelsProviderData(config, agentId, options, agentDir) {
	const owner = await loadPublishedPreparedModelCatalogOwnerSnapshot({
		config,
		...agentId ? { agentId } : {},
		...agentDir ? { agentDir } : {},
		...options.workspaceDir ? { workspaceDir: options.workspaceDir } : {},
		readOnly: true
	});
	owner.loadFullModelCatalog?.().catch(() => void 0);
	const cfg = owner.config;
	const runtimeNormalization = resolveRuntimeNormalization(cfg);
	const resolvedDefault = resolveDefaultModelForAgent({
		cfg,
		agentId,
		...runtimeNormalization
	});
	const workspaceDir = options.workspaceDir ?? (agentId ? resolveAgentWorkspaceDir(cfg, agentId) : void 0) ?? resolveDefaultAgentWorkspaceDir();
	const cliRuntimeProviders = new Set(listCliRuntimeModelBackendBindings().map((binding) => normalizeProviderId(binding.runtime)));
	const snapshot = owner.modelCatalog;
	const authStore = getPreparedModelRuntimeAuthStore(owner);
	const catalog = snapshot.entries;
	const visibilityPolicy = createModelVisibilityPolicy({
		cfg,
		catalog,
		defaultProvider: resolvedDefault.provider,
		defaultModel: resolvedDefault,
		agentId,
		...runtimeNormalization
	});
	if (!authStore) throw new Error("Model catalog owner omitted its auth store");
	const decisionParams = {
		cfg,
		agentId: owner.agentId ?? agentId ?? "main",
		agentDir: owner.agentDir,
		workspaceDir,
		snapshot,
		metadataSnapshot: owner.metadataSnapshot,
		preparedAuthStore: authStore,
		preparedRuntimeAuthModes: owner.authModes,
		pluginRegistry: owner.pluginRegistry,
		observationConfig: owner.observationConfig,
		isCurrent: owner.isCurrent,
		preferredProfileId: options.sessionEntry?.authProfileOverride,
		pinnedProfileId: options.sessionEntry?.authProfileOverrideSource === "user" ? options.sessionEntry.authProfileOverride : void 0,
		profileProvider: options.sessionEntry?.providerOverride ?? options.sessionEntry?.modelProvider,
		runtimeOverride: options.sessionEntry?.agentRuntimeOverride
	};
	const decisions = await prepareModelCatalogDecisions(decisionParams);
	const defaultDecisions = decisionParams.runtimeOverride && resolveModelRuntimeRoute(resolvedDefault.provider) ? createModelCatalogDecisions({
		...decisionParams,
		preparedPersonalCatalog: decisions.preparedPersonalCatalog,
		runtimeOverride: void 0
	}) : decisions;
	const decisionsForEntry = (entry) => normalizeProviderId(entry.provider) === resolvedDefault.provider && entry.id === resolvedDefault.model ? defaultDecisions : decisions;
	const evaluateEntry = (entry, variants) => {
		const selection = decisionsForEntry(entry);
		return selection.evaluateNative(entry, selection.evaluateEntry(entry, variants));
	};
	const incompatibleModelKeys = /* @__PURE__ */ new Set();
	const modelAvailability = /* @__PURE__ */ new Map();
	const recordModelAvailability = (entry, evaluation, provider = entry.provider) => {
		modelAvailability.set(`${normalizeProviderId(provider)}/${entry.id}`, {
			availability: evaluation.availability,
			unavailableReason: evaluation.unavailableReason,
			runtimeAuth: evaluation.runtimeAuth,
			runtimeId: resolveModelRuntimeRoute(provider) ? resolveCatalogDecisionRuntime({
				cfg,
				agentId: owner.agentId ?? agentId ?? "main",
				entry,
				evaluation,
				pluginRegistry: owner.pluginRegistry
			})?.id : void 0
		});
	};
	const hasAuth = options.view === "all" ? async () => true : async (provider, ref) => {
		const entry = catalog.find((row) => row.provider === provider && row.id === ref?.modelId);
		if (!entry) return false;
		return evaluateEntry(entry).availability === true;
	};
	const visibleCatalog = await resolveLogicalVisibleModelCatalog({
		cfg,
		metadataSnapshot: owner.metadataSnapshot,
		catalog,
		defaultProvider: resolvedDefault.provider,
		defaultModel: resolvedDefault,
		selectedModel: resolvedDefault,
		agentId,
		workspaceDir,
		view: options.view,
		policy: visibilityPolicy,
		routePolicy: openAIModelCatalogRoutePolicy,
		routeVariants: snapshot.routeVariants,
		evaluateEntry: async (entry, routeVariants) => {
			const evaluation = evaluateEntry(entry, routeVariants);
			recordModelAvailability(entry, evaluation);
			if (evaluation.routeResolution?.kind === "incompatible") incompatibleModelKeys.add(resolveModelCatalogIdentityKey(entry));
			return resolveLogicalModelCatalogEntryState({
				evaluation,
				authBacked: options.view === "all" || evaluation.availability === true,
				routePolicy: openAIModelCatalogRoutePolicy
			});
		}
	});
	const aliasIndex = buildModelAliasIndex({
		cfg,
		defaultProvider: resolvedDefault.provider,
		agentId,
		...runtimeNormalization
	});
	const restrictToProviderWildcards = options.view !== "all" && visibilityPolicy.hasProviderWildcards;
	const useUnfilteredCliCatalog = options.view === "all" || visibilityPolicy.allowAny || visibilityPolicy.allowConfigPath === "agents.defaults.models";
	const byProvider = /* @__PURE__ */ new Map();
	const add = (p, m) => {
		const key = normalizeProviderId(p);
		if (isRetiredModelPickerProvider(key)) return;
		if (restrictToProviderWildcards && !(useUnfilteredCliCatalog && cliRuntimeProviders.has(key)) && !visibilityPolicy.allows({
			provider: key,
			model: m
		})) return;
		const set = byProvider.get(key) ?? /* @__PURE__ */ new Set();
		set.add(m);
		byProvider.set(key, set);
	};
	const addRawModelRef = (raw) => {
		const trimmed = normalizeOptionalString(raw);
		if (!trimmed) return;
		const defaultProvider = !trimmed.includes("/") ? resolveBareModelDefaultProvider({
			cfg,
			catalog,
			model: trimmed,
			defaultProvider: resolvedDefault.provider,
			agentId,
			manifestPlugins: runtimeNormalization.manifestPlugins
		}) : resolvedDefault.provider;
		const resolved = resolveModelRefFromString({
			cfg,
			agentId,
			raw: trimmed,
			defaultProvider,
			aliasIndex,
			...runtimeNormalization
		});
		if (!resolved) return;
		if (incompatibleModelKeys.has(resolveModelCatalogIdentityKey({
			provider: resolved.ref.provider,
			id: resolved.ref.model
		}))) return;
		add(resolved.ref.provider, resolved.ref.model);
	};
	for (const entry of visibleCatalog) {
		if (incompatibleModelKeys.has(resolveModelCatalogIdentityKey(entry))) continue;
		add(entry.provider, entry.id);
	}
	for (const entry of catalog) if (useUnfilteredCliCatalog && cliRuntimeProviders.has(normalizeProviderId(entry.provider)) && await hasAuth(entry.provider, {
		modelId: entry.id,
		api: entry.api,
		baseUrl: entry.baseUrl
	})) add(entry.provider, entry.id);
	for (const raw of visibilityPolicy.exactModelRefs) addRawModelRef(raw);
	if (!incompatibleModelKeys.has(resolveModelCatalogIdentityKey({
		provider: resolvedDefault.provider,
		id: resolvedDefault.model
	}))) add(resolvedDefault.provider, resolvedDefault.model);
	for (const modelConfig of [cfg.agents?.defaults?.model, cfg.agents?.defaults?.imageModel]) if (typeof modelConfig === "string") addRawModelRef(modelConfig);
	else if (modelConfig && typeof modelConfig === "object") {
		addRawModelRef(modelConfig.primary);
		for (const fallback of modelConfig.fallbacks ?? []) addRawModelRef(fallback);
	}
	const pendingProviders = decisions.snapshot.pendingProviders?.filter((provider) => !isRetiredModelPickerProvider(provider) && (options.view === "all" || visibilityPolicy.allowAny || [...visibilityPolicy.allowedKeys].some((key) => key.startsWith(`${provider}/`))));
	for (const provider of pendingProviders ?? []) if (!byProvider.has(provider)) byProvider.set(provider, /* @__PURE__ */ new Set());
	const providers = [...byProvider.keys()].toSorted();
	const loginProviders = new Set(providers.filter((provider) => resolveProviderChannelLoginChoice(provider, {
		config: cfg,
		workspaceDir,
		metadataSnapshot: owner.metadataSnapshot
	}).status !== "unsupported"));
	const modelNames = /* @__PURE__ */ new Map();
	for (const entry of [...catalog, ...visibleCatalog]) if (entry.name && entry.name !== entry.id) modelNames.set(`${normalizeProviderId(entry.provider)}/${entry.id}`, entry.name);
	const selectionCatalog = [...visibleCatalog, ...catalog];
	const runtimeChoicesByProvider = /* @__PURE__ */ new Map();
	const runtimeChoicesByModel = /* @__PURE__ */ new Map();
	for (const [provider, models] of byProvider) {
		const providerChoices = /* @__PURE__ */ new Map();
		for (const model of models) {
			const entry = selectionCatalog.find((row) => normalizeProviderId(row.provider) === provider && row.id === model);
			const authEntry = entry ?? {
				provider,
				id: model,
				name: model
			};
			const variants = snapshot.routeVariants.filter((row) => resolveModelCatalogIdentityKey(row) === resolveModelCatalogIdentityKey(authEntry));
			if (!modelAvailability.has(`${provider}/${model}`)) recordModelAvailability(authEntry, evaluateEntry(authEntry, variants.length ? variants : [authEntry]), provider);
			if (!entry) continue;
			const runtimes = decisionsForEntry(entry).runtimeChoices(entry, variants.length ? variants : [entry]);
			if (!runtimes) continue;
			const choices = runtimes.map((runtime) => {
				const id = normalizeRuntimeChoiceId(runtime);
				const label = resolveAgentRuntimeLabel({
					config: cfg,
					resolvedHarness: id
				});
				return {
					id,
					label,
					description: id === "openclaw" ? "Use OpenClaw's built-in agent and tools." : `Use ${label} to run this model.`
				};
			});
			runtimeChoicesByModel.set(`${provider}/${model}`, choices);
			for (const choice of choices) providerChoices.set(choice.id, choice);
		}
		runtimeChoicesByProvider.set(provider, [...providerChoices.values()]);
	}
	return {
		byProvider,
		pendingProviders,
		providers,
		resolvedDefault,
		modelNames,
		modelMenu: buildModelsMenu({
			byProvider,
			modelNames,
			modelAvailability,
			loginProviders,
			pendingProviders
		}),
		refreshWarning: snapshot.refreshFailed ? "Some models could not be refreshed. You can still choose from the available models." : void 0,
		modelCatalog: dedupeModelCatalogEntries(selectionCatalog),
		runtimeChoicesByProvider,
		runtimeChoicesByModel,
		isCurrent: decisions.isCurrent
	};
}
//#endregion
//#region src/auto-reply/reply/commands-models.ts
const PAGE_SIZE_DEFAULT = 20;
const PAGE_SIZE_MAX = 100;
const MODELS_ADD_DEPRECATED_TEXT = "⚠️ /models add is deprecated. Use /models to browse providers and /model to switch models.";
const MODEL_PICKER_CHANGED_MESSAGE = "Available models changed. Open /models and choose again.";
function parseListArgs(tokens) {
	const provider = tokens[0];
	let page = 1;
	let pageSize = PAGE_SIZE_DEFAULT;
	let all = false;
	for (const [index, token] of tokens.entries()) {
		const lower = token.toLowerCase();
		if (index > 0 && (lower === "all" || lower === "--all")) {
			all = true;
			continue;
		}
		const isPageSize = lower.startsWith("limit=") || lower.startsWith("size=");
		const value = parseStrictPositiveInteger(isPageSize || lower.startsWith("page=") ? lower.slice(lower.indexOf("=") + 1) : lower);
		if (value !== void 0) {
			if (isPageSize) pageSize = Math.min(PAGE_SIZE_MAX, value);
			else if (index > 0) page = value;
		}
	}
	return {
		action: "list",
		provider: provider ? normalizeProviderId(provider) : void 0,
		page,
		pageSize,
		all
	};
}
function parseModelsArgs(raw) {
	const trimmed = raw.trim();
	if (!trimmed) return { action: "providers" };
	const tokens = trimmed.split(/\s+/g);
	switch (tokens[0]?.toLowerCase()) {
		case "providers": return { action: "providers" };
		case "list": return parseListArgs(tokens.slice(1));
		case "add": return { action: "add" };
		default: return parseListArgs(tokens);
	}
}
function resolveProviderLabelParams(params) {
	const harnessPolicy = resolveAgentHarnessPolicy({
		config: params.cfg,
		provider: params.provider,
		agentId: params.agentId
	});
	const acceptedProviderIds = listOpenAIAuthProfileProvidersForAgentRuntime({
		provider: params.provider,
		harnessRuntime: harnessPolicy.runtime,
		config: params.cfg
	});
	return {
		provider: params.provider,
		acceptedProviderIds,
		cfg: params.cfg,
		sessionEntry: params.sessionEntry,
		agentDir: params.agentDir,
		workspaceDir: params.workspaceDir
	};
}
function formatProviderLabel(provider, authLabel) {
	if (!authLabel || authLabel === "unknown") return provider;
	return `${provider} · 🔑 ${authLabel}`;
}
async function resolveProviderLabelAsync(params) {
	return formatProviderLabel(params.provider, await resolveModelAuthLabelAsync(resolveProviderLabelParams(params)));
}
/** @deprecated Use formatModelsAvailableHeaderAsync. Supported through 2026-12-31. */
function formatModelsAvailableHeader(params) {
	warnPluginSdkDeprecation({
		family: "auth-profiles",
		method: "formatModelsAvailableHeader",
		replacement: "formatModelsAvailableHeaderAsync"
	});
	return formatModelsHeader(params, formatProviderLabel(params.provider, resolveModelAuthLabel(resolveProviderLabelParams(params))));
}
async function formatModelsAvailableHeaderAsync(params) {
	return formatModelsHeader(params, await resolveProviderLabelAsync(params));
}
function formatModelsHeader(params, providerLabel) {
	return [`Models (${providerLabel}) — ${params.availability && params.availability.available !== params.total ? `${params.availability.available} of ${params.total}` : String(params.total)} available`, params.availability?.notice].filter(Boolean).join("\n\n");
}
async function resolveModelsCommandReply(params) {
	const body = params.commandBodyNormalized.trim();
	if (!body.startsWith("/models")) return null;
	const parsed = parseModelsArgs(body.replace(/^\/models\b/i, "").trim());
	let data;
	try {
		data = await loadModelsProviderData(params.cfg, params.agentId, {
			...parsed.action === "list" && parsed.all ? { view: "all" } : {},
			workspaceDir: params.workspaceDir,
			sessionEntry: params.sessionEntry
		}, params.agentDir);
	} catch (error) {
		if (error instanceof PreparedModelRuntimeOwnerNotPublishedError) return { text: "Model catalog is not ready. Retry after Gateway startup or refresh finishes." };
		if (error instanceof PreparedModelRuntimePublicationSupersededError) return { text: MODEL_PICKER_CHANGED_MESSAGE };
		throw error;
	}
	const reply = await buildModelsCommandReply(params, parsed, data);
	return {
		...reply,
		text: [data.refreshWarning, reply.text].filter(Boolean).join("\n\n")
	};
}
async function buildModelsCommandReply(params, parsed, data) {
	const { byProvider, providers } = data;
	const availability = parsed.action === "list" && parsed.provider ? data.modelMenu?.byProvider.get(parsed.provider) : void 0;
	const modelNames = data.modelMenu?.modelNames ?? data.modelNames;
	const notice = parsed.action === "list" && parsed.provider ? availability?.notice : [...data.modelMenu?.byProvider.values() ?? []].map((provider) => provider.notice).filter(Boolean).join("\n");
	const checking = data.pendingProviders?.filter((provider) => parsed.action !== "list" || !parsed.provider || parsed.provider === provider).map((provider) => `${provider}: checking models…`).join("\n");
	const withAvailability = (text) => [
		text,
		notice,
		checking
	].filter(Boolean).join("\n\n");
	const commandPlugin = params.surface ? getChannelPlugin(params.surface) : null;
	const providerInfos = providers.map((provider) => ({
		id: provider,
		count: byProvider.get(provider)?.size ?? 0
	}));
	const providerMenuReply = (preferMenu) => {
		const channelData = (preferMenu ? commandPlugin?.commands?.buildModelsMenuChannelData?.({ providers: providerInfos }) : void 0) ?? commandPlugin?.commands?.buildModelsProviderChannelData?.({ providers: providerInfos });
		if (channelData) return {
			text: withAvailability("Select a provider:"),
			channelData
		};
		return { text: withAvailability([
			"Providers:",
			...providers.map((provider) => `- ${provider} (${byProvider.get(provider)?.size ?? 0})`),
			"",
			"Use: /models <provider>",
			"Switch: /model <provider/model>"
		].join("\n")) };
	};
	if (parsed.action === "providers") return providerMenuReply(true);
	if (parsed.action === "add") return { text: MODELS_ADD_DEPRECATED_TEXT };
	const { provider, page, pageSize, all } = parsed;
	if (!provider) return providerMenuReply(false);
	const providerModels = byProvider.get(provider);
	if (!providerModels) return { text: [
		`Unknown provider: ${provider}`,
		"",
		"Available providers:",
		...providers.map((entry) => `- ${entry}`),
		"",
		"Use: /models <provider>"
	].join("\n") };
	const models = [...providerModels];
	const total = models.length;
	if (total === 0) {
		if (checking) return { text: checking };
		return { text: [
			`Models (${await resolveProviderLabelAsync({
				...params,
				provider
			})}) — none`,
			"",
			"Browse: /models",
			"Switch: /model <provider/model>"
		].join("\n") };
	}
	const interactivePageSize = 8;
	const interactiveTotalPages = Math.max(1, Math.ceil(total / interactivePageSize));
	const interactivePage = Math.max(1, Math.min(page, interactiveTotalPages));
	const interactiveChannelData = commandPlugin?.commands?.buildModelsListChannelData?.({
		provider,
		models: models.toSorted(),
		currentModel: params.currentModel,
		currentPage: interactivePage,
		totalPages: interactiveTotalPages,
		pageSize: interactivePageSize,
		modelNames
	});
	if (interactiveChannelData) return {
		text: await formatModelsAvailableHeaderAsync({
			...params,
			provider,
			total,
			availability
		}),
		channelData: interactiveChannelData
	};
	const currentIndex = models.findIndex((model) => params.currentModel === `${provider}/${model}`);
	if (currentIndex > 0) models.unshift(...models.splice(currentIndex, 1));
	const effectivePageSize = all ? total : pageSize;
	const pageCount = Math.ceil(total / effectivePageSize);
	const safePage = all ? 1 : Math.max(1, Math.min(page, pageCount));
	if (!all && page !== safePage) return { text: [
		`Page out of range: ${page} (valid: 1-${pageCount})`,
		"",
		`Try: /models list ${provider} ${safePage}`,
		`All: /models list ${provider} all`
	].join("\n") };
	const startIndex = (safePage - 1) * effectivePageSize;
	const endIndexExclusive = Math.min(total, startIndex + effectivePageSize);
	const pageModels = models.slice(startIndex, endIndexExclusive);
	const lines = [`Models (${await resolveProviderLabelAsync({
		...params,
		provider
	})}) — showing ${startIndex + 1}-${endIndexExclusive} of ${total} (page ${safePage}/${pageCount})`];
	for (const id of pageModels) {
		const key = `${provider}/${id}`;
		const label = modelNames.get(key);
		lines.push(`- ${key}${label && label !== data.modelNames.get(key) ? ` (${label})` : ""}`);
	}
	lines.push("", "Switch: /model <provider/model>");
	if (!all && safePage < pageCount) lines.push(`More: /models list ${provider} ${safePage + 1}`);
	if (!all) lines.push(`All: /models list ${provider} all`);
	return { text: withAvailability(lines.join("\n")) };
}
const handleModelsCommand = defineAuthorizedTextCommand({
	label: "/models",
	match: (body) => body.trim().startsWith("/models") ? body.trim() : null
}, async (params, commandBodyNormalized) => {
	if (parseModelsArgs(commandBodyNormalized.replace(/^\/models\b/i, "").trim()).action === "add") return commandReply(MODELS_ADD_DEPRECATED_TEXT);
	const modelsAgentId = params.sessionKey ? resolveSessionAgentId({
		sessionKey: params.sessionKey,
		config: params.cfg
	}) : params.agentId ?? "main";
	const currentAgentId = params.agentId ?? "main";
	const modelsAgentDir = modelsAgentId === currentAgentId && params.agentDir ? params.agentDir : resolveAgentDir(params.cfg, modelsAgentId);
	const targetSessionEntry = params.sessionStore?.[params.sessionKey] ?? params.sessionEntry;
	const reply = await resolveModelsCommandReply({
		cfg: params.cfg,
		commandBodyNormalized,
		surface: params.ctx.Surface,
		currentModel: params.model ? `${params.provider}/${params.model}` : void 0,
		agentId: modelsAgentId,
		agentDir: modelsAgentDir,
		workspaceDir: targetSessionEntry?.spawnedWorkspaceDir ?? (modelsAgentId === currentAgentId ? params.workspaceDir : void 0),
		sessionEntry: targetSessionEntry
	});
	return reply ? commandReply(reply) : null;
});
//#endregion
export { resolveModelsCommandReply as a, handleModelsCommand as i, formatModelsAvailableHeader as n, buildPreparedModelsProviderData as o, formatModelsAvailableHeaderAsync as r, getModelsRuntimeChoices as s, MODEL_PICKER_CHANGED_MESSAGE as t };
