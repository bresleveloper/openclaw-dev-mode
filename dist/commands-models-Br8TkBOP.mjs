import { w as parseStrictPositiveInteger } from "./number-coercion-CLj0HTDM.mjs";
import { l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.mjs";
import { r as normalizeProviderId } from "./provider-id-DCtsDflE.mjs";
import { a as resolveAgentDir, l as resolveAgentWorkspaceDir } from "./agent-scope-config-IQKOEtZ4.mjs";
import { n as resolveDefaultAgentWorkspaceDir } from "./workspace-default-hMJcajDi.mjs";
import { i as buildModelAliasIndex, o as dedupeModelCatalogEntries, p as resolveBareModelDefaultProvider, v as resolveModelRefFromString } from "./model-selection-shared-0uvJbX1M.mjs";
import { _ as resolveSessionAgentId } from "./agent-scope-CTuYDtny.mjs";
import { d as resolveModelCatalogIdentityKey, l as openAIModelCatalogRoutePolicy } from "./model-catalog-lookup-C3iQmurZ.mjs";
import { t as resolveDefaultModelForAgent } from "./model-selection-config-DZ4sk4C2.mjs";
import { a as listOpenAIAuthProfileProvidersForAgentRuntime } from "./openai-routing-BspGC-O6.mjs";
import { f as formatProviderLoginCommand } from "./oauth-refresh-failure-CVji5U1C.mjs";
import { t as resolveAgentHarnessPolicy } from "./policy-DYrfsfP0.mjs";
import { o as getPreparedModelRuntimeAuthStore } from "./prepared-model-runtime-auth-Bd3e65L_.mjs";
import "./model-selection-CaFyCMqp.mjs";
import { n as listCliRuntimeModelBackendBindings } from "./cli-backends-SxX34tmf.mjs";
import { o as isRetiredModelPickerProvider } from "./model-runtime-aliases-CJA2j26Y.mjs";
import "./workspace-mlzi3k1x.mjs";
import { n as PreparedModelRuntimePublicationSupersededError, t as PreparedModelRuntimeOwnerNotPublishedError } from "./prepared-model-runtime.errors-18hyOf9a.mjs";
import { c as loadPublishedPreparedModelCatalogOwnerSnapshot } from "./prepared-model-catalog-C3E7Txvc.mjs";
import { t as getChannelPlugin } from "./registry-D3wOWFDo.mjs";
import "./plugins-BEpDh--e.mjs";
import { s as rejectUnauthorizedCommand } from "./command-gates-DqpLd5XK.mjs";
import { n as createModelVisibilityPolicy } from "./model-visibility-policy-Doz1rFpm.mjs";
import { t as resolveAgentRuntimeLabel } from "./agent-runtime-label-DB2U4nbv.mjs";
import { i as normalizeRuntimeChoiceId, s as resolveRuntimeNormalization } from "./model-runtime-normalization-CU45Yi4U.mjs";
import { n as resolveCatalogDecisionRuntime, t as createModelCatalogDecisions } from "./model-catalog-decisions-CsGXi9Al.mjs";
import { n as resolveLogicalModelCatalogEntryState, r as resolveLogicalVisibleModelCatalog } from "./model-catalog-visibility-ruAALrZv.mjs";
import { a as resolveProviderChannelLoginChoice } from "./provider-login-options-DbA7M9R5.mjs";
import { t as resolveModelAuthLabel } from "./model-auth-label-Dyu0dIF3.mjs";
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
					recovery = loginSupported ? `Connect with ${loginCommand}.` : CUSTOM_MODEL_SETUP_GUIDANCE;
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
function isModelsBrowseVisibleProvider(provider) {
	return !isRetiredModelPickerProvider(provider);
}
function buildRuntimeChoice(params) {
	const id = normalizeRuntimeChoiceId(params.runtime);
	const label = resolveAgentRuntimeLabel({
		config: params.cfg,
		resolvedHarness: id
	});
	return {
		id,
		label,
		description: id === "openclaw" ? "Use OpenClaw's built-in agent and tools." : `Use ${label} to run this model.`
	};
}
/** Undefined is unknown; an empty list is an authoritative refusal. */
function getModelsRuntimeChoices(data, provider, model) {
	if (data.isCurrent?.() === false) return;
	return model ? data.runtimeChoicesByModel?.get(`${normalizeProviderId(provider)}/${model}`) : data.runtimeChoicesByProvider?.get(normalizeProviderId(provider));
}
function buildPreparedModelsProviderData(cfg, agentId, options = {}) {
	return loadModelsProviderData(cfg, agentId, options);
}
async function loadModelsProviderData(cfg, agentId, options, agentDir) {
	const published = await loadPublishedPreparedModelCatalogOwnerSnapshot({
		config: cfg,
		...agentId ? { agentId } : {},
		...agentDir ? { agentDir } : {},
		...options.workspaceDir ? { workspaceDir: options.workspaceDir } : {},
		readOnly: false
	});
	return projectPreparedModelsProviderData(published.config, agentId, options, published);
}
async function projectPreparedModelsProviderData(cfg, agentId, options, owner) {
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
	const decisions = createModelCatalogDecisions(decisionParams);
	const defaultDecisions = decisionParams.runtimeOverride && resolveModelRuntimeRoute(resolvedDefault.provider) ? createModelCatalogDecisions({
		...decisionParams,
		runtimeOverride: void 0
	}) : decisions;
	const decisionsForEntry = (entry) => normalizeProviderId(entry.provider) === resolvedDefault.provider && entry.id === resolvedDefault.model ? defaultDecisions : decisions;
	const incompatibleModelKeys = /* @__PURE__ */ new Set();
	const modelAvailability = /* @__PURE__ */ new Map();
	const hasAuth = options.view === "all" ? async () => true : async (provider, ref) => {
		const entry = catalog.find((row) => row.provider === provider && row.id === ref?.modelId);
		if (!entry) return false;
		const selectionDecisions = decisionsForEntry(entry);
		return selectionDecisions.evaluateNative(entry, await selectionDecisions.evaluateEntry(entry)).availability === true;
	};
	const visibleCatalog = await resolveLogicalVisibleModelCatalog({
		cfg,
		metadataSnapshot: owner.metadataSnapshot,
		catalog,
		defaultProvider: resolvedDefault.provider,
		defaultModel: resolvedDefault,
		agentId,
		workspaceDir,
		view: options.view,
		policy: visibilityPolicy,
		routePolicy: openAIModelCatalogRoutePolicy,
		routeVariants: snapshot.routeVariants,
		evaluateEntry: async (entry, routeVariants) => {
			const selectionDecisions = decisionsForEntry(entry);
			const evaluation = selectionDecisions.evaluateNative(entry, await selectionDecisions.evaluateEntry(entry, routeVariants));
			modelAvailability.set(`${normalizeProviderId(entry.provider)}/${entry.id}`, {
				availability: evaluation.availability,
				unavailableReason: evaluation.unavailableReason,
				runtimeAuth: evaluation.runtimeAuth,
				runtimeId: resolveModelRuntimeRoute(entry.provider) ? resolveCatalogDecisionRuntime({
					cfg,
					agentId: owner.agentId ?? agentId ?? "main",
					entry,
					evaluation,
					pluginRegistry: owner.pluginRegistry
				})?.id : void 0
			});
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
		if (!isModelsBrowseVisibleProvider(key)) return;
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
	const addModelConfigEntries = () => {
		const modelConfig = cfg.agents?.defaults?.model;
		if (typeof modelConfig === "string") addRawModelRef(modelConfig);
		else if (modelConfig && typeof modelConfig === "object") {
			addRawModelRef(modelConfig.primary);
			for (const fallback of modelConfig.fallbacks ?? []) addRawModelRef(fallback);
		}
		const imageConfig = cfg.agents?.defaults?.imageModel;
		if (typeof imageConfig === "string") addRawModelRef(imageConfig);
		else if (imageConfig && typeof imageConfig === "object") {
			addRawModelRef(imageConfig.primary);
			for (const fallback of imageConfig.fallbacks ?? []) addRawModelRef(fallback);
		}
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
	addModelConfigEntries();
	const pendingProviders = decisions.snapshot.pendingProviders?.filter((provider) => isModelsBrowseVisibleProvider(provider) && (options.view === "all" || visibilityPolicy.allowAny || [...visibilityPolicy.allowedKeys].some((key) => key.startsWith(`${provider}/`))));
	for (const provider of pendingProviders ?? []) if (!byProvider.has(provider)) byProvider.set(provider, /* @__PURE__ */ new Set());
	const providers = [...byProvider.keys()].toSorted();
	const loginProviders = new Set(providers.filter((provider) => resolveProviderChannelLoginChoice(provider, {
		config: cfg,
		workspaceDir,
		metadataSnapshot: owner.metadataSnapshot
	}).status !== "unsupported"));
	const modelNames = /* @__PURE__ */ new Map();
	for (const entry of [...catalog, ...visibleCatalog]) if (entry.name && entry.name !== entry.id) modelNames.set(`${normalizeProviderId(entry.provider)}/${entry.id}`, entry.name);
	const runtimeChoicesByProvider = /* @__PURE__ */ new Map();
	const runtimeChoicesByModel = /* @__PURE__ */ new Map();
	for (const [provider, models] of byProvider) {
		const providerChoices = /* @__PURE__ */ new Map();
		for (const model of models) {
			const entry = [...visibleCatalog, ...catalog].find((row) => normalizeProviderId(row.provider) === provider && row.id === model);
			const authEntry = entry ?? {
				provider,
				id: model,
				name: model
			};
			const selectionDecisions = decisionsForEntry(authEntry);
			const variants = snapshot.routeVariants.filter((row) => resolveModelCatalogIdentityKey(row) === resolveModelCatalogIdentityKey(authEntry));
			if (!modelAvailability.has(`${provider}/${model}`)) {
				const evaluation = selectionDecisions.evaluateNative(authEntry, await selectionDecisions.evaluateEntry(authEntry, variants.length ? variants : [authEntry]));
				modelAvailability.set(`${provider}/${model}`, {
					availability: evaluation.availability,
					unavailableReason: evaluation.unavailableReason,
					runtimeAuth: evaluation.runtimeAuth,
					runtimeId: resolveModelRuntimeRoute(provider) ? resolveCatalogDecisionRuntime({
						cfg,
						agentId: owner.agentId ?? agentId ?? "main",
						entry: authEntry,
						evaluation,
						pluginRegistry: owner.pluginRegistry
					})?.id : void 0
				});
			}
			if (!entry) continue;
			const runtimes = await selectionDecisions.runtimeChoices(entry, variants.length ? variants : [entry]);
			if (!runtimes) continue;
			const choices = runtimes.map((runtime) => buildRuntimeChoice({
				cfg,
				runtime
			}));
			runtimeChoicesByModel.set(`${provider}/${model}`, choices);
			for (const choice of choices) providerChoices.set(choice.id, choice);
		}
		runtimeChoicesByProvider.set(provider, [...providerChoices.values()]);
	}
	if (!owner.isCurrent()) throw new PreparedModelRuntimePublicationSupersededError("model browse owner was superseded");
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
		modelCatalog: dedupeModelCatalogEntries([...visibleCatalog, ...catalog]),
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
function formatProviderLine(params) {
	return `- ${params.provider} (${params.count})`;
}
function parseListArgs(tokens) {
	const provider = normalizeOptionalString(tokens[0]);
	let page = 1;
	let all = false;
	for (const token of tokens.slice(1)) {
		const lower = normalizeLowercaseStringOrEmpty(token);
		if (lower === "all" || lower === "--all") {
			all = true;
			continue;
		}
		if (lower.startsWith("page=")) {
			const value = parseStrictPositiveInteger(lower.slice(5));
			if (value !== void 0) page = value;
			continue;
		}
		const pageToken = parseStrictPositiveInteger(lower);
		if (pageToken !== void 0) page = pageToken;
	}
	let pageSize = PAGE_SIZE_DEFAULT;
	for (const token of tokens) {
		const lower = normalizeLowercaseStringOrEmpty(token);
		if (lower.startsWith("limit=") || lower.startsWith("size=")) {
			const rawValue = lower.slice(lower.indexOf("=") + 1);
			const value = parseStrictPositiveInteger(rawValue);
			if (value !== void 0) pageSize = Math.min(PAGE_SIZE_MAX, value);
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
	const tokens = trimmed.split(/\s+/g).filter(Boolean);
	switch (normalizeLowercaseStringOrEmpty(tokens[0])) {
		case "providers": return { action: "providers" };
		case "list": return parseListArgs(tokens.slice(1));
		case "add": return {
			action: "add",
			provider: normalizeOptionalString(tokens[1]),
			modelId: normalizeOptionalString(tokens.slice(2).join(" "))
		};
		default: return parseListArgs(tokens);
	}
}
function resolveProviderLabel(params) {
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
	const authLabel = resolveModelAuthLabel({
		provider: params.provider,
		acceptedProviderIds,
		cfg: params.cfg,
		sessionEntry: params.sessionEntry,
		agentDir: params.agentDir,
		workspaceDir: params.workspaceDir
	});
	if (!authLabel || authLabel === "unknown") return params.provider;
	return `${params.provider} · 🔑 ${authLabel}`;
}
function formatModelsAvailableHeader(params) {
	return [`Models (${resolveProviderLabel({
		provider: params.provider,
		cfg: params.cfg,
		agentId: params.agentId,
		agentDir: params.agentDir,
		workspaceDir: params.workspaceDir,
		sessionEntry: params.sessionEntry
	})}) — ${params.availability && params.availability.available !== params.total ? `${params.availability.available} of ${params.total}` : String(params.total)} available`, params.availability?.notice].filter(Boolean).join("\n\n");
}
function buildModelsMenuText(params) {
	return [
		"Providers:",
		...params.providers.map((provider) => formatProviderLine({
			provider,
			count: params.byProvider.get(provider)?.size ?? 0
		})),
		"",
		"Use: /models <provider>",
		"Switch: /model <provider/model>"
	].join("\n");
}
function buildProviderInfos(params) {
	return params.providers.map((provider) => ({
		id: provider,
		count: params.byProvider.get(provider)?.size ?? 0
	}));
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
	const reply = buildModelsCommandReply(params, parsed, data);
	return {
		...reply,
		text: [data.refreshWarning, reply.text].filter(Boolean).join("\n\n")
	};
}
function buildModelsCommandReply(params, parsed, data) {
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
	const providerInfos = buildProviderInfos({
		providers,
		byProvider
	});
	if (parsed.action === "providers") {
		const channelData = commandPlugin?.commands?.buildModelsMenuChannelData?.({ providers: providerInfos }) ?? commandPlugin?.commands?.buildModelsProviderChannelData?.({ providers: providerInfos });
		if (channelData) return {
			text: withAvailability("Select a provider:"),
			channelData
		};
		return { text: withAvailability(buildModelsMenuText({
			providers,
			byProvider
		})) };
	}
	if (parsed.action === "add") return { text: MODELS_ADD_DEPRECATED_TEXT };
	const { provider, page, pageSize, all } = parsed;
	if (!provider) {
		const channelData = commandPlugin?.commands?.buildModelsProviderChannelData?.({ providers: providerInfos });
		if (channelData) return {
			text: withAvailability("Select a provider:"),
			channelData
		};
		return { text: withAvailability(buildModelsMenuText({
			providers,
			byProvider
		})) };
	}
	if (!byProvider.has(provider)) return { text: [
		`Unknown provider: ${provider}`,
		"",
		"Available providers:",
		...providers.map((entry) => `- ${entry}`),
		"",
		"Use: /models <provider>"
	].join("\n") };
	const models = [...byProvider.get(provider) ?? /* @__PURE__ */ new Set()].toSorted();
	const total = models.length;
	if (total === 0) {
		if (checking) return { text: checking };
		return { text: [
			`Models (${resolveProviderLabel({
				provider,
				cfg: params.cfg,
				agentId: params.agentId,
				agentDir: params.agentDir,
				workspaceDir: params.workspaceDir,
				sessionEntry: params.sessionEntry
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
		models,
		currentModel: params.currentModel,
		currentPage: interactivePage,
		totalPages: interactiveTotalPages,
		pageSize: interactivePageSize,
		modelNames
	});
	if (interactiveChannelData) return {
		text: formatModelsAvailableHeader({
			provider,
			total,
			cfg: params.cfg,
			agentId: params.agentId,
			agentDir: params.agentDir,
			workspaceDir: params.workspaceDir,
			sessionEntry: params.sessionEntry,
			availability
		}),
		channelData: interactiveChannelData
	};
	const effectivePageSize = all ? total : pageSize;
	const pageCount = effectivePageSize > 0 ? Math.ceil(total / effectivePageSize) : 1;
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
	const lines = [`Models (${resolveProviderLabel({
		provider,
		cfg: params.cfg,
		agentId: params.agentId,
		agentDir: params.agentDir,
		workspaceDir: params.workspaceDir,
		sessionEntry: params.sessionEntry
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
const handleModelsCommand = async (params, allowTextCommands) => {
	if (!allowTextCommands) return null;
	const commandBodyNormalized = params.command.commandBodyNormalized.trim();
	if (!commandBodyNormalized.startsWith("/models")) return null;
	const parsed = parseModelsArgs(commandBodyNormalized.replace(/^\/models\b/i, "").trim());
	const unauthorized = rejectUnauthorizedCommand(params, "/models");
	if (unauthorized) return unauthorized;
	if (parsed.action === "add") return {
		shouldContinue: false,
		reply: { text: MODELS_ADD_DEPRECATED_TEXT }
	};
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
	if (!reply) return null;
	return {
		reply,
		shouldContinue: false
	};
};
//#endregion
export { buildPreparedModelsProviderData as a, resolveModelsCommandReply as i, formatModelsAvailableHeader as n, getModelsRuntimeChoices as o, handleModelsCommand as r, MODEL_PICKER_CHANGED_MESSAGE as t };
