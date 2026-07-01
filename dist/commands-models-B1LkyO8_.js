import { a as normalizeLowercaseStringOrEmpty, c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
import { b as parseStrictPositiveInteger } from "./number-coercion-CJQ8TR--.js";
import { v as resolveSessionAgentId } from "./agent-scope-CDZXADgT.js";
import { a as resolveAgentDir, o as resolveAgentWorkspaceDir } from "./agent-scope-config-C3ijpoNo.js";
import { n as resolveDefaultAgentWorkspaceDir } from "./workspace-default-DhGzPxbH.js";
import { r as getCurrentPluginMetadataSnapshot } from "./current-plugin-metadata-snapshot-BcIVzXmF.js";
import { i as listOpenAIAuthProfileProvidersForAgentRuntime } from "./openai-routing-DXJmS9CT.js";
import { n as resolveAgentHarnessPolicy } from "./harness-runtimes--3bc5qch.js";
import { t as getChannelPlugin } from "./registry-Ba1KQQW12.js";
import "./plugins-DnKj2WmH.js";
import { b as resolveModelRefFromString, g as resolveBareModelDefaultProvider, i as buildModelAliasIndex } from "./model-selection-shared-CKMggJal.js";
import { o as normalizeProviderId } from "./model-selection-normalize-Df7baLev.js";
import { c as resolveDefaultModelForAgent } from "./model-selection-i8V2iTdL.js";
import { n as loadModelCatalog } from "./model-catalog-DD_dq4PJ.js";
import "./workspace-DP5mE--D.js";
import { n as createProviderAuthChecker } from "./model-provider-auth-BQ-E242H.js";
import { n as listCliRuntimeModelBackendBindings } from "./cli-backends-DgIbZRGR.js";
import { n as createModelVisibilityPolicy, t as RUNTIME_MODEL_VISIBILITY_NORMALIZATION } from "./model-visibility-policy-DBLJaeyE.js";
import { r as rejectUnauthorizedCommand } from "./command-gates-CzSygNut.js";
import { t as resolveAgentRuntimeLabel } from "./agent-runtime-label-DcYHUvFG.js";
import { t as resolveModelAuthLabel } from "./model-auth-label-qSfKlpdI.js";
import { t as loadModelCatalogForBrowse } from "./model-catalog-browse-CdLtLCA0.js";
import { n as resolveVisibleModelCatalog } from "./model-catalog-visibility-Dx0bgFt9.js";
import { n as isRetiredModelPickerProvider } from "./model-picker-visibility-C1SFaex9.js";
//#region src/auto-reply/reply/commands-models.ts
const PAGE_SIZE_DEFAULT = 20;
const PAGE_SIZE_MAX = 100;
const MODELS_ADD_DEPRECATED_TEXT = "⚠️ /models add is deprecated. Use /models to browse providers and /model to switch models.";
function isModelsBrowseVisibleProvider(provider) {
	return !isRetiredModelPickerProvider(provider);
}
function usesUnfilteredCatalogModels(provider, cliRuntimeProviders) {
	return cliRuntimeProviders.has(normalizeProviderId(provider));
}
function normalizeRuntimeChoiceId(runtime) {
	const normalized = normalizeLowercaseStringOrEmpty(runtime);
	if (!normalized || normalized === "auto" || normalized === "default") return "openclaw";
	return normalized;
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
		description: id === "openclaw" ? "Use the built-in OpenClaw runtime." : params.cli ? `Run ${params.provider} models through ${label}.` : `Use the ${label} runtime selected by the effective harness policy.`
	};
}
function buildDefaultRuntimeChoice(params) {
	const harnessPolicy = resolveAgentHarnessPolicy({
		config: params.cfg,
		provider: params.provider,
		modelId: params.modelId,
		agentId: params.agentId
	});
	return buildRuntimeChoice({
		cfg: params.cfg,
		provider: params.provider,
		runtime: harnessPolicy.runtime
	});
}
function addRuntimeChoice(choices, choice) {
	if (!choices.some((existing) => existing.id === choice.id)) choices.push(choice);
	return choices;
}
async function buildModelsProviderData(cfg, agentId, options = {}) {
	const resolvedDefault = resolveDefaultModelForAgent({
		cfg,
		agentId
	});
	const workspaceDir = options.workspaceDir ?? (agentId ? resolveAgentWorkspaceDir(cfg, agentId) : void 0) ?? resolveDefaultAgentWorkspaceDir();
	const metadataSnapshot = getCurrentPluginMetadataSnapshot({
		config: cfg,
		workspaceDir,
		env: process.env,
		allowScopedSnapshot: true
	});
	const cliRuntimeProviders = new Set(listCliRuntimeModelBackendBindings().map((binding) => normalizeProviderId(binding.runtime)));
	const catalog = await loadModelCatalogForBrowse({
		cfg,
		view: options.view ?? "default",
		loadCatalog: ({ readOnly }) => loadModelCatalog({
			config: cfg,
			readOnly,
			metadataSnapshot
		})
	});
	const visibilityPolicy = createModelVisibilityPolicy({
		cfg,
		catalog,
		defaultProvider: resolvedDefault.provider,
		defaultModel: resolvedDefault.model,
		agentId,
		...RUNTIME_MODEL_VISIBILITY_NORMALIZATION
	});
	const hasAuth = options.view === "all" ? async () => true : createProviderAuthChecker({
		cfg,
		workspaceDir,
		agentId,
		allowPluginSyntheticAuth: false,
		discoverExternalCliAuth: false,
		allowPreparedRuntimeAuth: true
	});
	const visibleCatalog = await resolveVisibleModelCatalog({
		cfg,
		catalog,
		defaultProvider: resolvedDefault.provider,
		defaultModel: resolvedDefault.model,
		agentId,
		workspaceDir,
		view: options.view,
		runtimeAuthDiscovery: false,
		providerAuthChecker: hasAuth
	});
	const aliasIndex = buildModelAliasIndex({
		cfg,
		defaultProvider: resolvedDefault.provider
	});
	const restrictToProviderWildcards = options.view !== "all" && visibilityPolicy.hasProviderWildcards;
	const byProvider = /* @__PURE__ */ new Map();
	const add = (p, m) => {
		const key = normalizeProviderId(p);
		if (!isModelsBrowseVisibleProvider(key)) return;
		if (restrictToProviderWildcards && !usesUnfilteredCatalogModels(key, cliRuntimeProviders) && !visibilityPolicy.allows({
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
		const resolved = resolveModelRefFromString({
			raw: trimmed,
			defaultProvider: !trimmed.includes("/") ? resolveBareModelDefaultProvider({
				cfg,
				catalog,
				model: trimmed,
				defaultProvider: resolvedDefault.provider
			}) : resolvedDefault.provider,
			aliasIndex
		});
		if (!resolved) return;
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
	for (const entry of visibleCatalog) add(entry.provider, entry.id);
	for (const entry of catalog) if (usesUnfilteredCatalogModels(entry.provider, cliRuntimeProviders) && await hasAuth(entry.provider)) add(entry.provider, entry.id);
	for (const raw of visibilityPolicy.exactModelRefs) addRawModelRef(raw);
	add(resolvedDefault.provider, resolvedDefault.model);
	addModelConfigEntries();
	const providers = [...byProvider.keys()].toSorted();
	const modelNames = /* @__PURE__ */ new Map();
	for (const entry of [...catalog, ...visibleCatalog]) if (entry.name && entry.name !== entry.id) modelNames.set(`${normalizeProviderId(entry.provider)}/${entry.id}`, entry.name);
	const runtimeChoicesByProvider = /* @__PURE__ */ new Map();
	const runtimeBindings = [{
		provider: "openai",
		runtime: "codex",
		cli: false
	}, ...listCliRuntimeModelBackendBindings().map((binding) => ({
		provider: binding.provider,
		runtime: binding.runtime,
		cli: true
	}))];
	for (const binding of runtimeBindings) {
		const provider = normalizeProviderId(binding.provider);
		const defaultModelId = provider === normalizeProviderId(resolvedDefault.provider) ? resolvedDefault.model : void 0;
		const choices = runtimeChoicesByProvider.get(provider) ?? [buildDefaultRuntimeChoice({
			cfg,
			agentId,
			provider,
			modelId: defaultModelId
		})];
		addRuntimeChoice(choices, buildRuntimeChoice({
			cfg,
			provider,
			runtime: "openclaw"
		}));
		addRuntimeChoice(choices, buildRuntimeChoice({
			cfg,
			provider,
			runtime: binding.runtime,
			cli: binding.cli
		}));
		runtimeChoicesByProvider.set(provider, choices);
	}
	return {
		byProvider,
		providers,
		resolvedDefault,
		modelNames,
		runtimeChoicesByProvider
	};
}
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
			const value = parseStrictPositiveInteger(lower.slice(lower.indexOf("=") + 1));
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
	return `Models (${resolveProviderLabel({
		provider: params.provider,
		cfg: params.cfg,
		agentId: params.agentId,
		agentDir: params.agentDir,
		workspaceDir: params.workspaceDir,
		sessionEntry: params.sessionEntry
	})}) — ${params.total} available`;
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
	const { byProvider, providers, modelNames } = await buildModelsProviderData(params.cfg, params.agentId, {
		...parsed.action === "list" && parsed.all ? { view: "all" } : {},
		workspaceDir: params.workspaceDir
	});
	const commandPlugin = params.surface ? getChannelPlugin(params.surface) : null;
	const providerInfos = buildProviderInfos({
		providers,
		byProvider
	});
	if (parsed.action === "providers") {
		const channelData = commandPlugin?.commands?.buildModelsMenuChannelData?.({ providers: providerInfos }) ?? commandPlugin?.commands?.buildModelsProviderChannelData?.({ providers: providerInfos });
		if (channelData) return {
			text: "Select a provider:",
			channelData
		};
		return { text: buildModelsMenuText({
			providers,
			byProvider
		}) };
	}
	if (parsed.action === "add") return { text: MODELS_ADD_DEPRECATED_TEXT };
	const { provider, page, pageSize, all } = parsed;
	if (!provider) {
		const channelData = commandPlugin?.commands?.buildModelsProviderChannelData?.({ providers: providerInfos });
		if (channelData) return {
			text: "Select a provider:",
			channelData
		};
		return { text: buildModelsMenuText({
			providers,
			byProvider
		}) };
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
	if (total === 0) return { text: [
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
			sessionEntry: params.sessionEntry
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
	for (const id of pageModels) lines.push(`- ${provider}/${id}`);
	lines.push("", "Switch: /model <provider/model>");
	if (!all && safePage < pageCount) lines.push(`More: /models list ${provider} ${safePage + 1}`);
	if (!all) lines.push(`All: /models list ${provider} all`);
	return { text: lines.join("\n") };
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
export { resolveModelsCommandReply as i, formatModelsAvailableHeader as n, handleModelsCommand as r, buildModelsProviderData as t };
