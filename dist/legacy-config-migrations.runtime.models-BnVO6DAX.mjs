import { c as normalizeOptionalLowercaseString } from "./string-coerce-1VuiLaaR.mjs";
import { c as isRecord, r as asNullableRecord } from "./record-coerce-TIsquoVR.mjs";
import { r as normalizeProviderId } from "./provider-id-D1VImdKk.mjs";
import { F as listModelRefsFromConfigValue } from "./runtime-snapshot-BBYDJbw9.mjs";
import { i as materializeModelPolicyAllowlist, r as hasModelPolicyAllowlistMigrationMarker, t as computeModelPolicyAllowlist } from "./model-policy-allowlist-migration-BErDvsnV.mjs";
import { n as materializeUtilityModelSeparation } from "./utility-model-separation-migration-CmYYNsY8.mjs";
import { t as splitTrailingAuthProfile } from "./model-ref-profile-BNjB2hED.mjs";
import { b as ensureRecord, c as legacyCodexProviderIdentityKey } from "./codex-route-model-ref-2IYegA3O.mjs";
import { a as visitAgentEntries, i as visitAgentConfigScopes, r as someAgentEntry } from "./legacy-config-record-shared-CG6CyklH.mjs";
import { n as containsAuthoredInclude } from "./include-migration-ownership-KfGWiqXu.mjs";
import { r as isModelThinkingFormat } from "./model-config-vocabulary-Cb5jWCSz.mjs";
import "./types.models-BqvzicE8.mjs";
import { a as normalizeOptionalAgentRuntimeId } from "./agent-runtime-id-BZLMe-UU.mjs";
import { a as migrateModelCompatCatalogOwnership, c as staleModelContextWindows, i as invalidModelThinkingFormats, n as hasInvalidThinkingFormat, r as hasStaleContextWindowValue, t as MODEL_COMPAT_CATALOG_RULES } from "./legacy-config-migrations.runtime.models.catalog-B5nuEm7q.mjs";
import { t as isLegacyCodexProviderId } from "./legacy-codex-provider-D4kqIThM.mjs";
import { i as rewriteKnownModelRefs, n as hasOwnDefinedProperty, o as scanKnownModelRefs, s as setRecordEntry, t as MODEL_REF_CANONICALIZATION_MESSAGE } from "./legacy-config-migrations.runtime.models.refs-Ceq33O_-.mjs";
import { isDeepStrictEqual } from "node:util";
//#region src/commands/doctor/shared/legacy-models-add-metadata.ts
const LEGACY_MODELS_ADD_CODEX_MODEL_IDS = /* @__PURE__ */ new Set(["gpt-5.5", "gpt-5.5-pro"]);
/** Return true when a model entry matches the legacy Codex `/models add` default shape. */
function isLegacyModelsAddCodexMetadataModel(params) {
	const model = params.model;
	const provider = normalizeProviderId(params.provider);
	if (provider !== "codex" && provider !== "openai-codex" || !model) return false;
	const id = model.id?.trim().toLowerCase();
	if (!id || !LEGACY_MODELS_ADD_CODEX_MODEL_IDS.has(id)) return false;
	return model.api === "openai-chatgpt-responses" && model.reasoning === true && Array.isArray(model.input) && model.input.length === 2 && model.input[0] === "text" && model.input[1] === "image" && model.cost?.input === 5 && model.cost.output === 30 && model.cost.cacheRead === .5 && model.cost.cacheWrite === 0 && model.contextWindow === 4e5 && model.contextTokens === 272e3 && model.maxTokens === 128e3;
}
//#endregion
//#region src/commands/doctor/shared/legacy-config-migrations.runtime.models.codex.ts
const OPENAI_PROVIDER_ID = "openai";
const MODEL_UNSCOPED_PROVIDER_DEFAULT_KEYS = [
	"apiKey",
	"auth",
	"request",
	"timeoutSeconds",
	"region",
	"injectNumCtxForOpenAICompat",
	"localService",
	"headers",
	"authHeader"
];
const CANONICAL_PROVIDER_MODEL_LEAK_KEYS = [
	"apiKey",
	"auth",
	"contextWindow",
	"contextTokens",
	"maxTokens",
	"timeoutSeconds",
	"region",
	"injectNumCtxForOpenAICompat",
	"params",
	"agentRuntime",
	"localService",
	"headers",
	"authHeader",
	"request"
];
function hasCanonicalOpenAIProvider(providers) {
	return Object.keys(providers).some((providerId) => normalizeProviderId(providerId) === OPENAI_PROVIDER_ID);
}
function collectModelMergeBlockers(params) {
	const blockers = [];
	for (const key of MODEL_UNSCOPED_PROVIDER_DEFAULT_KEYS) if (hasOwnDefinedProperty(params.legacy, key)) blockers.push(`models.providers.${params.legacyProviderId}.${key}`);
	for (const key of CANONICAL_PROVIDER_MODEL_LEAK_KEYS) if (hasOwnDefinedProperty(params.canonical, key)) blockers.push(`models.providers.${OPENAI_PROVIDER_ID}.${key}`);
	return blockers;
}
function getCanonicalOpenAIProviderEntry(providers) {
	const key = Object.keys(providers).find((k) => normalizeProviderId(k) === OPENAI_PROVIDER_ID);
	const value = key ? asNullableRecord(providers[key]) : void 0;
	return key && value ? {
		key,
		value
	} : void 0;
}
function getMergeableLegacyOpenAIModels(params) {
	const legacyModels = Array.isArray(params.legacy.models) ? params.legacy.models : [];
	const canonicalModels = Array.isArray(params.canonical.models) ? params.canonical.models : [];
	const canonicalModelIds = /* @__PURE__ */ new Set();
	const canonicalModelNames = /* @__PURE__ */ new Set();
	for (const m of canonicalModels) {
		const mr = asNullableRecord(m);
		if (typeof mr?.id === "string" && mr.id) canonicalModelIds.add(mr.id);
		if (typeof mr?.name === "string" && mr.name) canonicalModelNames.add(mr.name);
	}
	return legacyModels.filter((m) => {
		const mr = asNullableRecord(m);
		if (!mr) return false;
		const id = typeof mr.id === "string" ? mr.id : void 0;
		const name = typeof mr.name === "string" ? mr.name : void 0;
		if (!id && !name) return false;
		return id ? !canonicalModelIds.has(id) : name ? !canonicalModelNames.has(name) : false;
	});
}
function collectLegacyModelPolicyWildcardPaths(raw) {
	const pathsByProvider = /* @__PURE__ */ new Map();
	visitAgentConfigScopes(asNullableRecord(raw) ?? {}, (agent, path) => {
		const allow = asNullableRecord(agent.modelPolicy)?.allow;
		if (!Array.isArray(allow)) return;
		for (const [index, entry] of allow.entries()) {
			if (typeof entry !== "string" || !entry.trim().endsWith("/*")) continue;
			const provider = normalizeProviderId(entry.trim().slice(0, -2));
			if (!isLegacyCodexProviderId(provider)) continue;
			const paths = pathsByProvider.get(provider) ?? [];
			paths.push(`${path}.modelPolicy.allow.${index}`);
			pathsByProvider.set(provider, paths);
		}
	});
	return pathsByProvider;
}
function hasAutoFixableLegacyOpenAICodexProvider(providersValue, root) {
	const providers = asNullableRecord(providersValue);
	if (!providers) return false;
	const wildcardPaths = collectLegacyModelPolicyWildcardPaths(root);
	const canonicalEntry = getCanonicalOpenAIProviderEntry(providers);
	for (const [providerId, providerValue] of Object.entries(providers)) {
		const provider = asNullableRecord(providerValue);
		if (!provider || !isLegacyCodexProviderId(providerId)) continue;
		if (wildcardPaths.has(normalizeProviderId(providerId))) continue;
		if (!canonicalEntry) return true;
		const { modelCollisions, mergeBlockers } = inspectLegacyOpenAIProviderMerge(canonicalEntry.value, provider, providerId);
		if (modelCollisions.length === 0 && mergeBlockers.length === 0) return true;
	}
	return false;
}
/** Compute the provider-merge blockers once so every doctor state repair shares the decision. */
function collectBlockedLegacyOpenAICodexProviderPlan(raw) {
	const models = asNullableRecord(asNullableRecord(raw)?.models);
	const providers = asNullableRecord(models?.providers);
	const canonicalEntry = providers ? getCanonicalOpenAIProviderEntry(providers) : void 0;
	const blockedModelIdentities = /* @__PURE__ */ new Set();
	const warningLines = [];
	for (const [providerId, paths] of collectLegacyModelPolicyWildcardPaths(raw)) {
		const identity = legacyCodexProviderIdentityKey(providerId);
		if (identity) blockedModelIdentities.add(identity);
		warningLines.push(`- ${paths.join(", ")} cannot migrate automatically because ${providerId}/* would become openai/* and authorize unrelated OpenAI models.`);
	}
	if (!providers || !canonicalEntry) return buildBlockedLegacyOpenAICodexProviderPlan(blockedModelIdentities, warningLines);
	for (const [providerId, providerValue] of Object.entries(providers)) {
		const provider = asNullableRecord(providerValue);
		if (!provider || !isLegacyCodexProviderId(providerId)) continue;
		const { modelCollisions, mergeBlockers } = inspectLegacyOpenAIProviderMerge(canonicalEntry.value, provider, providerId);
		if (modelCollisions.length === 0 && mergeBlockers.length === 0) continue;
		const identity = legacyCodexProviderIdentityKey(providerId);
		if (identity) blockedModelIdentities.add(identity);
		warningLines.push(modelCollisions.length > 0 ? `- models.providers.${providerId} cannot be merged automatically into models.providers.${canonicalEntry.key} because colliding model definitions differ for: ${modelCollisions.join(", ")}.` : `- models.providers.${providerId} cannot be merged automatically into models.providers.${canonicalEntry.key} because provider-level defaults cannot be represented safely on merged models: ${mergeBlockers.join(", ")}.`);
	}
	return buildBlockedLegacyOpenAICodexProviderPlan(blockedModelIdentities, warningLines);
}
function buildBlockedLegacyOpenAICodexProviderPlan(blockedModelIdentities, warningLines) {
	return {
		blockedModelIdentities: [...blockedModelIdentities],
		...warningLines.length > 0 ? { warning: [
			"Legacy Codex provider routes require manual reconciliation before matching refs can migrate.",
			...warningLines,
			"- Doctor retained matching legacy refs in config, sessions, and cron. These refs will not execute until reconciled: fix the model route/auth metadata, remove the legacy provider entry, then rerun `openclaw doctor --fix`."
		].join("\n") } : {}
	};
}
function resolveMovedCodexModelRuntime(params) {
	if (normalizeProviderId(params.legacyProviderId) !== "codex") return;
	const modelRuntime = asNullableRecord(params.model.agentRuntime);
	const modelRuntimeId = normalizeOptionalAgentRuntimeId(modelRuntime?.id);
	if (modelRuntimeId && modelRuntimeId !== "auto") return;
	if (modelRuntimeId === "auto") return {
		...modelRuntime,
		id: "codex"
	};
	const providerRuntime = asNullableRecord(params.legacyProvider.agentRuntime);
	const providerRuntimeId = normalizeOptionalAgentRuntimeId(providerRuntime?.id);
	return providerRuntimeId && providerRuntimeId !== "auto" ? providerRuntime ?? void 0 : {
		...providerRuntime,
		id: "codex"
	};
}
function buildMergedLegacyOpenAIModel(model, legacyProvider, legacyProviderId) {
	const modelRecord = asNullableRecord(model);
	if (!modelRecord) return model;
	const patch = {};
	const legacyBaseUrl = typeof legacyProvider.baseUrl === "string" ? legacyProvider.baseUrl : void 0;
	const legacyApi = typeof legacyProvider.api === "string" ? legacyProvider.api : void 0;
	const legacyParams = asNullableRecord(legacyProvider.params);
	const legacyAgentRuntime = asNullableRecord(legacyProvider.agentRuntime);
	const movedCodexRuntime = resolveMovedCodexModelRuntime({
		legacyProviderId,
		legacyProvider,
		model: modelRecord
	});
	if (legacyBaseUrl && !modelRecord.baseUrl) patch.baseUrl = legacyBaseUrl;
	if (legacyApi && !modelRecord.api) patch.api = legacyApi;
	for (const key of [
		"contextWindow",
		"contextTokens",
		"maxTokens"
	]) if (typeof legacyProvider[key] === "number" && modelRecord[key] === void 0) patch[key] = legacyProvider[key];
	if (legacyParams) {
		const modelParams = asNullableRecord(modelRecord.params);
		if (modelParams) patch.params = {
			...legacyParams,
			...modelParams
		};
		else if (modelRecord.params === void 0) patch.params = legacyParams;
	}
	if (movedCodexRuntime) patch.agentRuntime = movedCodexRuntime;
	else if (legacyAgentRuntime && modelRecord.agentRuntime === void 0) patch.agentRuntime = legacyAgentRuntime;
	if (modelRecord.metadataSource === void 0 && isLegacyModelsAddCodexMetadataModel({
		provider: legacyProviderId,
		model: modelRecord
	})) patch.metadataSource = "models-add";
	return Object.keys(patch).length > 0 ? Object.assign({}, modelRecord, patch) : model;
}
function collectNonEquivalentLegacyOpenAIModelCollisions(params) {
	const canonicalModels = Array.isArray(params.canonical.models) ? params.canonical.models : [];
	const legacyModels = Array.isArray(params.legacy.models) ? params.legacy.models : [];
	const conflicts = /* @__PURE__ */ new Set();
	for (const legacyModel of legacyModels) {
		const legacyRecord = asNullableRecord(legacyModel);
		const legacyId = typeof legacyRecord?.id === "string" ? legacyRecord.id : void 0;
		const legacyName = typeof legacyRecord?.name === "string" ? legacyRecord.name : void 0;
		if (!legacyRecord || !legacyId && !legacyName) continue;
		const collisions = canonicalModels.filter((canonicalModel) => {
			const canonicalRecord = asNullableRecord(canonicalModel);
			return legacyId ? canonicalRecord?.id === legacyId : canonicalRecord?.name === legacyName;
		});
		if (collisions.length === 0) continue;
		const legacyEffective = buildMergedLegacyOpenAIModel(legacyModel, params.legacy, params.legacyProviderId);
		if (!collisions.every((canonicalModel) => {
			const canonicalEffective = buildMergedLegacyOpenAIModel(canonicalModel, params.canonical, OPENAI_PROVIDER_ID);
			if (!isDeepStrictEqual(canonicalEffective, legacyEffective)) return false;
			return MODEL_UNSCOPED_PROVIDER_DEFAULT_KEYS.every((key) => isDeepStrictEqual(params.canonical[key], params.legacy[key]));
		})) conflicts.add(legacyId ?? legacyName ?? "unknown");
	}
	return [...conflicts];
}
function inspectLegacyOpenAIProviderMerge(canonical, legacy, legacyProviderId) {
	const params = {
		canonical,
		legacy,
		legacyProviderId
	};
	const modelCollisions = collectNonEquivalentLegacyOpenAIModelCollisions(params);
	const modelsToMerge = getMergeableLegacyOpenAIModels(params);
	return {
		modelCollisions,
		modelsToMerge,
		mergeBlockers: modelCollisions.length === 0 && modelsToMerge.length > 0 ? collectModelMergeBlockers(params) : []
	};
}
function prepareLegacyCodexProviderForCanonicalMove(providerId, provider) {
	if (normalizeProviderId(providerId) !== "codex" || !Array.isArray(provider.models)) return provider;
	return {
		...provider,
		models: provider.models.map((model) => {
			const record = asNullableRecord(model);
			if (!record) return model;
			const agentRuntime = resolveMovedCodexModelRuntime({
				legacyProviderId: providerId,
				legacyProvider: provider,
				model: record
			});
			return agentRuntime ? {
				...record,
				agentRuntime
			} : model;
		})
	};
}
function migrateLegacyOpenAICodexProvider(raw, changes) {
	const models = asNullableRecord(raw.models);
	const providers = asNullableRecord(models?.providers);
	if (!models || !providers) return;
	const wildcardPaths = collectLegacyModelPolicyWildcardPaths(raw);
	for (const [providerId, providerValue] of Object.entries({ ...providers })) {
		const provider = asNullableRecord(providers[providerId]) ?? asNullableRecord(providerValue);
		if (!provider || !isLegacyCodexProviderId(providerId)) continue;
		if (wildcardPaths.has(normalizeProviderId(providerId))) continue;
		if (!hasCanonicalOpenAIProvider(providers)) {
			providers[OPENAI_PROVIDER_ID] = prepareLegacyCodexProviderForCanonicalMove(providerId, provider);
			changes.push(`Moved models.providers.${providerId} → models.providers.${OPENAI_PROVIDER_ID}.`);
		} else {
			const canonicalEntry = getCanonicalOpenAIProviderEntry(providers);
			const canonicalKey = canonicalEntry?.key ?? OPENAI_PROVIDER_ID;
			const canonical = canonicalEntry?.value ?? {};
			const canonicalModels = Array.isArray(canonical.models) ? canonical.models : [];
			const { modelCollisions, modelsToMerge, mergeBlockers } = inspectLegacyOpenAIProviderMerge(canonical, provider, providerId);
			if (modelCollisions.length > 0 || mergeBlockers.length > 0) continue;
			const stamped = modelsToMerge.map((m) => buildMergedLegacyOpenAIModel(m, provider, providerId));
			if (stamped.length > 0) {
				providers[canonicalKey] = {
					...canonical,
					models: [...canonicalModels, ...stamped]
				};
				const mergedIds = stamped.map((m) => {
					const mr = asNullableRecord(m);
					return typeof mr?.id === "string" && mr.id ? mr.id : typeof mr?.name === "string" && mr.name ? mr.name : "unknown";
				}).join(", ");
				changes.push(`Merged ${stamped.length} model(s) from models.providers.${providerId} into models.providers.${OPENAI_PROVIDER_ID}: ${mergedIds}.`);
			} else changes.push(`Removed models.providers.${providerId} because models.providers.${OPENAI_PROVIDER_ID} already exists.`);
		}
		delete providers[providerId];
	}
}
const MODEL_REF_CANONICALIZATION_RULES = [
	"agents",
	"plugins",
	"messages",
	"tools",
	"hooks",
	"channels",
	"models"
].map((section) => ({
	path: [section],
	message: MODEL_REF_CANONICALIZATION_MESSAGE,
	match: (value) => scanKnownModelRefs(value)
}));
//#endregion
//#region src/commands/doctor/shared/legacy-config-migrations.runtime.models.vllm.ts
const QWEN_THINKING_FORMAT_KEYS = ["qwenThinkingFormat", "qwen_thinking_format"];
function normalizeLegacyVllmQwenThinkingFormat(value) {
	if (typeof value !== "string") return;
	switch (value.trim().toLowerCase().replace(/[_\s]+/g, "-")) {
		case "chat-template":
		case "chat-template-argument":
		case "chat-template-arguments":
		case "chat-template-kwarg":
		case "chat-template-kwargs":
		case "qwen-chat-template": return "qwen-chat-template";
		case "enable-thinking":
		case "qwen":
		case "request-body":
		case "top-level": return "qwen";
		default: return;
	}
}
function getLegacyVllmQwenThinkingFormat(params) {
	for (const key of QWEN_THINKING_FORMAT_KEYS) if (Object.hasOwn(params, key)) return {
		key,
		value: params[key],
		compat: normalizeLegacyVllmQwenThinkingFormat(params[key])
	};
}
function parseVllmAgentModelKey(key) {
	const trimmed = splitTrailingAuthProfile(key).model.trim();
	const slashIndex = trimmed.indexOf("/");
	if (slashIndex <= 0) return;
	const providerId = trimmed.slice(0, slashIndex);
	if (normalizeProviderId(providerId) !== "vllm") return;
	const modelId = trimmed.slice(slashIndex + 1).trim();
	return modelId && modelId !== "*" ? modelId : void 0;
}
function hasLegacyVllmQwenThinkingFormat(defaultModels) {
	return Object.entries(asNullableRecord(defaultModels) ?? {}).some(([key, entry]) => parseVllmAgentModelKey(key) && hasLegacyVllmQwenThinkingParams(asNullableRecord(entry)?.params));
}
function hasLegacyVllmQwenThinkingModelParams(models) {
	if (!Array.isArray(models)) return false;
	return models.some((model) => hasLegacyVllmQwenThinkingParams(asNullableRecord(model)?.params));
}
function hasLegacyVllmQwenThinkingParams(params) {
	const record = asNullableRecord(params);
	return Boolean(record && getLegacyVllmQwenThinkingFormat(record));
}
function resolveVllmModelTargets(raw, modelIds, includeExisting = false) {
	let provider = findVllmProvider(asNullableRecord(asNullableRecord(raw.models)?.providers));
	if (modelIds?.length) {
		const modelsRoot = getOrCreateRecord(raw, "models");
		const providers = modelsRoot ? getOrCreateRecord(modelsRoot, "providers") : void 0;
		const key = Object.keys(providers ?? {}).find((id) => normalizeProviderId(id) === "vllm");
		if (providers && !key) provider = getOrCreateRecord(providers, "vllm");
		if (provider && provider.models === void 0) provider.models = [];
	}
	const models = provider?.models;
	if (!Array.isArray(models)) return [];
	const rows = models.flatMap((model, index) => {
		const record = asNullableRecord(model);
		return record ? [{
			model: record,
			index
		}] : [];
	});
	if (!modelIds) return rows;
	const targets = includeExisting ? [...rows] : [];
	for (const id of modelIds) {
		let target = rows.find(({ model }) => model.id === id || model.id === `vllm/${id}`);
		if (!target) {
			target = {
				model: {
					id,
					name: id
				},
				index: models.length
			};
			models.push(target.model);
			rows.push(target);
		}
		targets.push(target);
	}
	const seen = /* @__PURE__ */ new Set();
	return targets.filter(({ model }) => {
		if (seen.has(model)) return false;
		seen.add(model);
		return true;
	});
}
function collectVllmAgentModelIds(agent) {
	return [...listModelRefsFromConfigValue(agent?.model), ...Object.keys(asNullableRecord(agent?.models) ?? {})].flatMap((ref) => {
		const modelId = parseVllmAgentModelKey(ref);
		return modelId ? [modelId] : [];
	});
}
function getOrCreateRecord(root, key) {
	if (root[key] === void 0) {
		const next = {};
		root[key] = next;
		return next;
	}
	return asNullableRecord(root[key]) ?? void 0;
}
function findVllmProvider(providers) {
	if (!providers) return;
	const key = Object.keys(providers).find((entry) => normalizeProviderId(entry) === "vllm");
	return key ? asNullableRecord(providers[key]) ?? void 0 : void 0;
}
function hasLegacyVllmQwenThinkingNormalizedProvider(providers) {
	const providersRecord = asNullableRecord(providers);
	if (!providersRecord || asNullableRecord(providersRecord.vllm)) return false;
	const vllmProvider = findVllmProvider(providersRecord);
	return hasLegacyVllmQwenThinkingParams(vllmProvider?.params) || hasLegacyVllmQwenThinkingModelParams(vllmProvider?.models);
}
function migrateVllmQwenThinkingParams(raw, changes) {
	const migrate = (owner, sourcePath, resolveTargets) => {
		const params = asNullableRecord(owner?.params);
		const format = params ? getLegacyVllmQwenThinkingFormat(params) : void 0;
		if (!owner || !params || !format) return;
		const targets = resolveTargets(format);
		if (!targets) return;
		for (const key of QWEN_THINKING_FORMAT_KEYS) delete params[key];
		if (targets.length === 0) changes.push(`Removed ${sourcePath}.${format.key}; no concrete vLLM model row or agent model ref exists, so configure models.providers.vllm.models[].compat.thinkingFormat on each Qwen model that needs it.`);
		for (const { model, index } of targets) {
			if (!format.compat) {
				changes.push(`Removed ${sourcePath}.${format.key} (unrecognized value ${JSON.stringify(format.value)}; configure models.providers.vllm.models[].compat.thinkingFormat if needed).`);
				continue;
			}
			if (model.reasoning === void 0) model.reasoning = true;
			const compat = ensureRecord(model, "compat");
			const current = compat.thinkingFormat;
			if (typeof current === "string" && isModelThinkingFormat(current)) changes.push(`Removed ${sourcePath}.${format.key}; models.providers.vllm.models[${index}].compat.thinkingFormat is already ${JSON.stringify(current)}.`);
			else {
				compat.thinkingFormat = format.compat;
				changes.push(`Moved ${sourcePath}.${format.key} to models.providers.vllm.models[${index}].compat.thinkingFormat (${JSON.stringify(format.compat)}).`);
			}
		}
		if (Object.keys(params).length === 0) delete owner.params;
	};
	const defaults = asNullableRecord(asNullableRecord(raw.agents)?.defaults);
	for (const [key, entry] of Object.entries(asNullableRecord(defaults?.models) ?? {})) {
		const id = parseVllmAgentModelKey(key);
		if (id) migrate(asNullableRecord(entry), `agents.defaults.models.${JSON.stringify(key)}.params`, (format) => {
			const targets = format.compat ? resolveVllmModelTargets(raw, [id]) : [{
				model: {},
				index: -1
			}];
			return targets.length > 0 ? targets : void 0;
		});
	}
	for (const target of resolveVllmModelTargets(raw)) migrate(target.model, `models.providers.vllm.models[${target.index}].params`, () => [target]);
	const defaultIds = collectVllmAgentModelIds(defaults);
	const agents = [];
	visitAgentEntries(raw, (agent, path) => agents.push({
		agent,
		path
	}));
	migrate(findVllmProvider(asNullableRecord(asNullableRecord(raw.models)?.providers)), "models.providers.vllm.params", () => resolveVllmModelTargets(raw, [...defaultIds, ...agents.flatMap(({ agent }) => collectVllmAgentModelIds(agent))], true));
	const selectedTargets = (ids) => resolveVllmModelTargets(raw, ids.length ? ids : void 0);
	migrate(defaults, "agents.defaults.params", () => selectedTargets(defaultIds));
	for (const { agent, path } of agents) migrate(agent, `${path}.params`, () => {
		const ids = collectVllmAgentModelIds(agent);
		return selectedTargets(ids.length ? ids : defaultIds);
	});
}
const LEGACY_VLLM_QWEN_THINKING_FORMAT_RULES = [
	{
		path: [
			"agents",
			"defaults",
			"models"
		],
		message: "agents.defaults.models.<vllm-model>.params.qwenThinkingFormat is legacy; run \"openclaw doctor --fix\" to move it to models.providers.vllm.models[].compat.thinkingFormat.",
		match: hasLegacyVllmQwenThinkingFormat
	},
	{
		path: [
			"models",
			"providers",
			"vllm",
			"params"
		],
		message: "models.providers.vllm.params.qwenThinkingFormat is legacy; run \"openclaw doctor --fix\" to move it to models.providers.vllm.models[].compat.thinkingFormat.",
		match: hasLegacyVllmQwenThinkingParams
	},
	{
		path: [
			"models",
			"providers",
			"vllm",
			"models"
		],
		message: "models.providers.vllm.models[*].params.qwenThinkingFormat is legacy; run \"openclaw doctor --fix\" to move it to models.providers.vllm.models[].compat.thinkingFormat.",
		match: hasLegacyVllmQwenThinkingModelParams
	},
	{
		path: ["models", "providers"],
		message: "models.providers.<vllm>.params.qwenThinkingFormat is legacy; run \"openclaw doctor --fix\" to move it to models.providers.<vllm>.models[].compat.thinkingFormat.",
		match: hasLegacyVllmQwenThinkingNormalizedProvider
	},
	{
		path: [
			"agents",
			"defaults",
			"params"
		],
		message: "agents.defaults.params.qwenThinkingFormat is legacy; run \"openclaw doctor --fix\" to move it to models.providers.vllm.models[].compat.thinkingFormat.",
		match: hasLegacyVllmQwenThinkingParams
	},
	{
		path: ["agents"],
		message: "agents.entries.*.params.qwenThinkingFormat is legacy; run \"openclaw doctor --fix\" to move it to models.providers.vllm.models[].compat.thinkingFormat.",
		match: (value) => someAgentEntry(value, (agent) => hasLegacyVllmQwenThinkingParams(agent.params))
	}
];
const INVALID_THINKING_FORMAT_RULE = {
	path: ["models", "providers"],
	message: "models.providers.<id>.models[*].compat.thinkingFormat has an unrecognized value; run \"openclaw doctor --fix\" to remove it and restore the runtime default.",
	match: hasInvalidThinkingFormat
};
const STALE_CONTEXT_WINDOW_RULE = {
	path: ["models", "providers"],
	message: "models.providers.<id>.models[*].contextWindow has a stale catalog value; run \"openclaw doctor --fix\" to repair it.",
	match: hasStaleContextWindowValue
};
//#endregion
//#region src/commands/doctor/shared/legacy-runtime-model-policy.ts
function collectLegacyDefaultModelAllowRefs(raw) {
	const defaults = asNullableRecord(asNullableRecord(raw.agents)?.defaults);
	return computeModelPolicyAllowlist({
		root: raw,
		defaults
	});
}
function migrateExplicitDefaultModelAllowPolicy(raw, changes) {
	if (hasModelPolicyAllowlistMigrationMarker(raw)) return;
	const defaults = asNullableRecord(asNullableRecord(raw.agents)?.defaults);
	const defaultModelPolicy = asNullableRecord(defaults?.modelPolicy);
	if (!(Boolean(asNullableRecord(defaults?.models)) && !(defaultModelPolicy && Object.hasOwn(defaultModelPolicy, "allow")))) return;
	const migrated = materializeModelPolicyAllowlist(raw);
	if (migrated.kind === "deferred") return;
	Object.assign(raw, migrated.config);
	changes.push(migrated.config.agents?.defaults?.modelPolicy?.allow ? "Copied the legacy default model map to agents.defaults.modelPolicy.allow." : "Recorded the legacy default model map as unrestricted without creating modelPolicy.allow.");
}
/** Add runtime policy unless the model entry already selects an explicit non-auto runtime. */
function modelEntryWithRuntimePolicy(entry, runtime) {
	const next = isRecord(entry) ? { ...entry } : {};
	const currentRuntime = isRecord(next.agentRuntime) ? next.agentRuntime : void 0;
	const currentRuntimeId = normalizeOptionalLowercaseString(currentRuntime?.id);
	if (currentRuntimeId && currentRuntimeId !== "auto") return {
		changed: false,
		entry: next
	};
	next.agentRuntime = {
		...currentRuntime,
		id: runtime
	};
	return {
		changed: true,
		entry: next
	};
}
//#endregion
//#region src/commands/doctor/shared/legacy-config-migrations.runtime.models.ts
const LEGACY_CONFIG_MIGRATIONS_RUNTIME_MODELS = [
	{
		id: "defaultModel->agents.defaults.model",
		legacyRules: [{
			path: ["defaultModel"],
			message: "defaultModel moved to agents.defaults.model. Run \"openclaw doctor --fix\"."
		}],
		apply: (raw, changes) => {
			if (!Object.hasOwn(raw, "defaultModel")) return;
			const legacyDefaultModel = raw.defaultModel;
			if (asNullableRecord(asNullableRecord(raw.agents)?.defaults)?.model === void 0 && typeof legacyDefaultModel === "string") {
				const defaults = ensureRecord(ensureRecord(raw, "agents"), "defaults");
				defaults.model = legacyDefaultModel;
				changes.push("Moved defaultModel → agents.defaults.model.");
			} else changes.push("Removed defaultModel (agents.defaults.model already set or value invalid).");
			delete raw.defaultModel;
		}
	},
	{
		id: "runtime.utility-model-separation",
		legacyRules: [{
			path: ["agents"],
			message: "Legacy implicit primary model selection needs preservation before separating utility models. Run \"openclaw doctor --fix\"; dynamic catalog IDs need an explicit primary model.",
			match: (_value, root) => materializeUtilityModelSeparation(structuredClone(root)).changes.length > 0
		}],
		apply: (raw, changes, context) => {
			if (context && containsAuthoredInclude(context.authoredRaw)) return;
			const migrated = materializeUtilityModelSeparation(raw, context?.authoredRaw ?? raw);
			if (migrated.changes.length === 0) return;
			Object.assign(raw, migrated.config);
			changes.push(...migrated.changes);
		}
	},
	{
		id: "models.pricing-retired",
		legacyRules: [{
			path: ["models", "pricing"],
			message: "models.pricing is retired because pricing ships with the hosted catalog; run \"openclaw doctor --fix\" to remove it."
		}],
		apply: (raw, changes) => {
			const models = asNullableRecord(raw.models);
			if (!models || !Object.hasOwn(models, "pricing")) return;
			delete models.pricing;
			changes.push("Removed models.pricing (pricing now ships with the hosted model catalog).");
		}
	},
	{
		id: "models.providers.*.models.*.compat->provider-catalog",
		legacyRules: MODEL_COMPAT_CATALOG_RULES,
		apply: migrateModelCompatCatalogOwnership
	},
	{
		id: "models.providers.codex-routes->models.providers.openai",
		legacyRules: [{
			path: ["models", "providers"],
			message: "models.providers.codex and models.providers.openai-codex are legacy; run \"openclaw doctor --fix\" to move them to models.providers.openai.",
			match: (value, root) => hasAutoFixableLegacyOpenAICodexProvider(value, root)
		}],
		apply: migrateLegacyOpenAICodexProvider
	},
	{
		id: "models.canonical-model-refs",
		legacyRules: MODEL_REF_CANONICALIZATION_RULES,
		apply: (raw, changes) => {
			const rewritten = rewriteKnownModelRefs(raw, "config", changes);
			const rewrittenRecord = asNullableRecord(rewritten.value);
			if (!rewritten.changed || !rewrittenRecord) return;
			for (const key of Object.keys(raw)) delete raw[key];
			for (const [key, value] of Object.entries(rewrittenRecord)) setRecordEntry(raw, key, value);
		}
	},
	{
		id: "agents.defaults.models->agents.defaults.modelPolicy.allow",
		legacyRules: [{
			path: [
				"agents",
				"defaults",
				"models"
			],
			message: "Legacy agents.defaults.models restricts model overrides; run \"openclaw doctor --fix\" to migrate valid refs to agents.defaults.modelPolicy.allow.",
			match: (_value, root) => collectLegacyDefaultModelAllowRefs(root) !== null
		}, {
			path: [
				"agents",
				"defaults",
				"models"
			],
			message: "Legacy model restriction retained: some keys need explicit provider/model refs. Set agents.defaults.modelPolicy.allow to the intended restriction; until then, editing agents.defaults.models still changes the restriction.",
			match: (_value, root) => materializeModelPolicyAllowlist(root).kind === "deferred"
		}],
		apply: migrateExplicitDefaultModelAllowPolicy
	},
	{
		id: "agents.defaults.models.vllm.params.qwenThinkingFormat->models.providers.vllm.models.compat.thinkingFormat",
		legacyRules: LEGACY_VLLM_QWEN_THINKING_FORMAT_RULES,
		apply: migrateVllmQwenThinkingParams
	},
	{
		id: "models.providers.*.models.*.compat.thinkingFormat-invalid",
		legacyRules: [INVALID_THINKING_FORMAT_RULE],
		apply: (raw, changes) => {
			for (const { providerId, modelIndex, compat, thinkingFormat } of invalidModelThinkingFormats(asNullableRecord(raw.models)?.providers)) {
				delete compat.thinkingFormat;
				changes.push(`Removed models.providers.${providerId}.models.${modelIndex}.compat.thinkingFormat (unrecognized value ${JSON.stringify(thinkingFormat)}; runtime default applies).`);
			}
		}
	},
	{
		id: "models.providers.*.models.*.contextWindow-stale",
		legacyRules: [STALE_CONTEXT_WINDOW_RULE],
		apply: (raw, changes) => {
			for (const { providerId, modelIndex, model, modelId, contextWindow, fix } of staleModelContextWindows(asNullableRecord(raw.models)?.providers)) {
				model.contextWindow = fix.correct;
				changes.push(`Repaired models.providers.${providerId}.models[${modelIndex}].${modelId}.contextWindow (${contextWindow} → ${fix.correct} to match catalog default).`);
			}
		}
	}
];
//#endregion
export { isLegacyModelsAddCodexMetadataModel as i, modelEntryWithRuntimePolicy as n, collectBlockedLegacyOpenAICodexProviderPlan as r, LEGACY_CONFIG_MIGRATIONS_RUNTIME_MODELS as t };
