import { a as normalizeFastMode, c as normalizeOptionalLowercaseString } from "./string-coerce-1VuiLaaR.mjs";
import { a as asOptionalRecord } from "./record-coerce-TIsquoVR.mjs";
import { r as normalizeProviderId } from "./provider-id-D1VImdKk.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import { M as AGENT_MODEL_CONFIG_KEYS } from "./runtime-snapshot-BBYDJbw9.mjs";
import "./session-key-CSDERtm3.mjs";
import { t as dedupeByKey } from "./dedupe-by-key-DnqEVrst.mjs";
import { b as ensureRecord, d as parseCodexRouteModelRef, f as readAgentPrimaryModelRef, g as toCanonicalOpenAIModelRef, h as resolveRuntimeModelRef, i as isBlockedLegacyCodexModelRef, l as modelRefUsesCodexRuntime, m as resolveImplicitDefaultAgentModelRef, n as canonicalOpenAIModelUsesCodexRuntime, o as isOpenAICodexModelRef, p as readModelConfigPrimaryRef, t as agentUsesCodexRuntimeForCompaction, u as normalizeDefaultProviderModelRef } from "./codex-route-model-ref-2IYegA3O.mjs";
import { a as normalizeOptionalAgentRuntimeId } from "./agent-runtime-id-BZLMe-UU.mjs";
import { r as resolveModelRuntimePolicy } from "./model-runtime-policy-DSkspt0X.mjs";
import { i as resolveModelExtraParamSources, n as isAgentRuntimeModelParam } from "./model-extra-params-HwiZgNCH.mjs";
import { t as listMutableCodexRouteAgentEntries } from "./codex-route-agent-entries-FIsucmo1.mjs";
import { i as rewriteKnownModelRefs } from "./legacy-config-migrations.runtime.models.refs-Ceq33O_-.mjs";
import { r as collectBlockedLegacyOpenAICodexProviderPlan } from "./legacy-config-migrations.runtime.models-BnVO6DAX.mjs";
import { n as detectWindowsSpawnCommandInlineArgs } from "./windows-spawn-BwP7BByc.mjs";
import { t as migrateLegacyRuntimeModelRef } from "./legacy-runtime-model-providers-Dh0YuH6R.mjs";
import { a as collectCodexRuntimeModelPolicyRefs, c as collectStringModelConfigRef, d as recordCodexModelHit, f as rewriteModelConfigSlot, g as visitNonAgentModelSlots, h as visitChannelModelSlots, l as collectStringModelSlot, m as rewriteStringModelSlot, o as collectModelConfigRefs, p as rewriteModelsMap, s as collectModelConfigSlot, u as modelConfigContainsRef } from "./retired-model-ref-repair-7Iad1CLB.mjs";
import "./codex-route-session-repair-BeJO-EnL.mjs";
//#region src/commands/doctor/shared/codex-route-compaction-scan.ts
const UNSUPPORTED_CODEX_COMPACTION_KEYS = ["provider"];
const LOSSLESS_CONTEXT_ENGINE_ID = "lossless-claw";
function readCompactionSlot(params, key) {
	const local = asOptionalRecord(asOptionalRecord(params.agent)?.compaction)?.[key];
	const hasLocal = typeof local === "string" && local.trim();
	const localPath = `${params.path}.compaction`;
	return {
		key,
		value: hasLocal ? local : asOptionalRecord(params.inheritedCompaction)?.[key],
		path: `${hasLocal ? localPath : params.inheritedCompactionPath ?? localPath}.${key}`
	};
}
function collectUnsupportedCodexCompactionOverridesForAgent(params) {
	const agent = asOptionalRecord(params.agent);
	const compaction = asOptionalRecord(agent?.compaction);
	const inheritedCompaction = asOptionalRecord(params.inheritedCompaction);
	const providerValue = compaction?.provider ?? inheritedCompaction?.provider;
	if (normalizeOptionalLowercaseString(providerValue) === "lossless-claw") return [];
	return UNSUPPORTED_CODEX_COMPACTION_KEYS.map((key) => readCompactionSlot(params, key)).flatMap(({ key, path, value }) => typeof value === "string" && value.trim() ? [{
		path,
		key,
		value: value.trim()
	}] : []);
}
function collectLegacyLosslessCompactionForAgent(params) {
	const provider = readCompactionSlot(params, "provider");
	if (normalizeOptionalLowercaseString(provider.value) !== "lossless-claw") return [];
	const model = readCompactionSlot(params, "model");
	return [{
		providerPath: provider.path,
		providerValue: String(provider.value).trim(),
		...typeof model.value === "string" && model.value.trim() ? {
			modelPath: model.path,
			modelValue: model.value.trim()
		} : {}
	}];
}
function collectCompactionConfigs(params, collect) {
	const collectForAgent = (agentParams) => agentUsesCodexRuntimeForCompaction({
		...agentParams,
		agent: asOptionalRecord(agentParams.agent)
	}) ? collect(agentParams) : [];
	const defaults = params.cfg.agents?.defaults;
	const defaultModelRef = readAgentPrimaryModelRef(defaults);
	const defaultCompaction = asOptionalRecord(defaults?.compaction);
	const hits = collectForAgent({
		cfg: params.cfg,
		agent: defaults,
		path: "agents.defaults",
		env: params.env
	});
	for (const { agent: agentRecord, agentId: id, path } of listMutableCodexRouteAgentEntries(params.cfg)) hits.push(...collectForAgent({
		cfg: params.cfg,
		agent: agentRecord,
		path,
		agentId: id,
		inheritedModelRef: defaultModelRef,
		inheritedCompaction: defaultCompaction,
		inheritedCompactionPath: "agents.defaults.compaction",
		env: params.env
	}));
	return hits;
}
function collectLegacyLosslessCompactionConfigs(params) {
	return dedupeByKey(collectCompactionConfigs(params, collectLegacyLosslessCompactionForAgent), (hit) => `${hit.providerPath}\0${hit.providerValue}\0${hit.modelPath ?? ""}\0${hit.modelValue ?? ""}`);
}
function collectUnsupportedCodexCompactionOverrides(params) {
	return dedupeByKey(collectCompactionConfigs(params, collectUnsupportedCodexCompactionOverridesForAgent), (hit) => `${hit.path}\0${hit.key}\0${hit.value}`);
}
function getSharedDefaultCompactionOverrideConsumers(params) {
	const consumers = {
		model: false,
		provider: false
	};
	const defaults = params.cfg.agents?.defaults;
	const defaultCompaction = asOptionalRecord(defaults?.compaction);
	if (!defaultCompaction) return consumers;
	const hasDefaultModel = typeof defaultCompaction.model === "string" && defaultCompaction.model.trim();
	const hasDefaultProvider = typeof defaultCompaction.provider === "string" && defaultCompaction.provider.trim();
	if (!hasDefaultModel && !hasDefaultProvider) return consumers;
	const inheritedModelRef = readAgentPrimaryModelRef(defaults);
	if (!agentUsesCodexRuntimeForCompaction({
		cfg: params.cfg,
		agent: defaults,
		env: params.env
	})) return {
		model: Boolean(hasDefaultModel),
		provider: Boolean(hasDefaultProvider)
	};
	for (const { agent: agentRecord, agentId: id } of listMutableCodexRouteAgentEntries(params.cfg)) {
		const compaction = asOptionalRecord(agentRecord.compaction);
		const inheritsDefaultModel = Boolean(hasDefaultModel) && !(typeof compaction?.model === "string" && compaction.model.trim());
		const inheritsDefaultProvider = Boolean(hasDefaultProvider) && !(typeof compaction?.provider === "string" && compaction.provider.trim());
		if (!inheritsDefaultModel && !inheritsDefaultProvider) continue;
		if (!agentUsesCodexRuntimeForCompaction({
			cfg: params.cfg,
			agent: agentRecord,
			agentId: id,
			inheritedModelRef,
			env: params.env
		})) {
			consumers.model ||= inheritsDefaultModel;
			consumers.provider ||= inheritsDefaultProvider;
			if ((!hasDefaultModel || consumers.model) && (!hasDefaultProvider || consumers.provider)) break;
		}
	}
	return consumers;
}
function sharedDefaultLosslessCompactionHasNonCodexConsumer(params) {
	const defaults = params.cfg.agents?.defaults;
	const defaultCompaction = asOptionalRecord(defaults?.compaction);
	const hasDefaultLosslessProvider = normalizeOptionalLowercaseString(defaultCompaction?.provider) === LOSSLESS_CONTEXT_ENGINE_ID;
	const hasDefaultModel = typeof defaultCompaction?.model === "string" && defaultCompaction.model.trim();
	if (!hasDefaultLosslessProvider && !hasDefaultModel) return false;
	const consumers = getSharedDefaultCompactionOverrideConsumers(params);
	return hasDefaultLosslessProvider && consumers.provider || Boolean(hasDefaultModel) && consumers.model;
}
function legacyLosslessSummaryModels(hits) {
	const models = /* @__PURE__ */ new Set();
	for (const hit of hits) {
		if (!hit.modelValue) continue;
		models.add(toCanonicalOpenAIModelRef(hit.modelValue) ?? normalizeDefaultProviderModelRef(hit.modelValue));
	}
	return [...models];
}
function canAutoMigrateLegacyLosslessCompaction(params) {
	if (params.contextEngine && params.contextEngine !== "lossless-claw") return false;
	const models = legacyLosslessSummaryModels(params.hits);
	if (params.hits.some((hit) => !hit.modelValue) && (models.length > 0 || params.summaryModel)) return false;
	if (models.length === 0) return true;
	if (params.summaryModel) return models.every((model) => model === params.summaryModel);
	return models.length === 1;
}
function readLosslessSummaryModel(plugins) {
	const entries = asOptionalRecord(plugins?.entries);
	const entry = asOptionalRecord(entries?.[LOSSLESS_CONTEXT_ENGINE_ID]);
	const config = asOptionalRecord(entry?.config);
	return typeof config?.summaryModel === "string" && config.summaryModel.trim() ? config.summaryModel.trim() : void 0;
}
//#endregion
//#region src/commands/doctor/shared/codex-route-runtime-policy.ts
function agentExplicitlyReferencesCanonicalModel(agent, modelRef) {
	const record = asOptionalRecord(agent);
	if (!record) return false;
	for (const key of AGENT_MODEL_CONFIG_KEYS) if (modelConfigContainsRef(record[key], modelRef)) return true;
	if (modelConfigContainsRef(asOptionalRecord(record.heartbeat)?.model, modelRef)) return true;
	if (modelConfigContainsRef(asOptionalRecord(record.subagents)?.model, modelRef)) return true;
	const compaction = asOptionalRecord(record.compaction);
	return modelConfigContainsRef(compaction?.model, modelRef) || modelConfigContainsRef(asOptionalRecord(compaction?.memoryFlush)?.model, modelRef) || asOptionalRecord(record.models)?.[modelRef] !== void 0;
}
function resolveCurrentRuntimeIdForCanonicalModel(params) {
	const parsed = parseCodexRouteModelRef(params.modelRef);
	if (!parsed) return "auto";
	const configured = normalizeOptionalAgentRuntimeId(resolveModelRuntimePolicy({
		config: params.cfg,
		provider: parsed.provider,
		modelId: parsed.modelId,
		agentId: params.agentId
	}).policy?.id);
	if (configured) return configured;
	return canonicalOpenAIModelUsesCodexRuntime(params) ? "codex" : "auto";
}
function setModelRuntimePolicy(params) {
	const models = ensureRecord(params.agent, "models");
	const entry = ensureRecord(models, params.modelRef);
	const priorRuntime = asOptionalRecord(entry.agentRuntime);
	if (normalizeOptionalLowercaseString(priorRuntime?.id) === params.runtimeId) return;
	entry.agentRuntime = {
		...priorRuntime,
		id: params.runtimeId
	};
	params.changes.push(`Set ${params.agentPath}.models.${params.modelRef}.agentRuntime.id to "${params.runtimeId}" ${params.reason}.`);
}
function shieldExplicitListedAgentRefsFromDefaultPolicy(params) {
	for (const { agent, agentId, path } of listMutableCodexRouteAgentEntries(params.cfg)) {
		if (!agentExplicitlyReferencesCanonicalModel(agent, params.modelRef)) continue;
		const runtimeId = resolveCurrentRuntimeIdForCanonicalModel({
			...params,
			agentId
		});
		if (runtimeId === params.targetRuntimeId) continue;
		setModelRuntimePolicy({
			...params,
			agent,
			agentPath: path,
			runtimeId,
			reason: "so default runtime repair does not change explicit agent routing"
		});
	}
}
function legacyEntryExplicitNonDefaultRuntimeId(models, canonicalModelRef) {
	for (const ref of Object.keys(models)) {
		if (ref === canonicalModelRef || toCanonicalOpenAIModelRef(ref) !== canonicalModelRef) continue;
		const legacyEntry = asOptionalRecord(models[ref]);
		const id = normalizeOptionalLowercaseString(asOptionalRecord(legacyEntry?.agentRuntime)?.id);
		if (id && id !== "auto" && id !== "default") return id;
	}
}
function agentIdFromAgentPath(agentPath) {
	for (const prefix of ["agents.entries.", "agents.list."]) if (agentPath.startsWith(prefix)) return agentPath.slice(prefix.length);
}
function modelIdMatchesProviderModelEntry(params) {
	if (typeof params.entryId !== "string") return false;
	const entryId = params.entryId.trim();
	if (entryId === params.modelId) return true;
	const slash = entryId.indexOf("/");
	return slash > 0 && normalizeProviderId(entryId.slice(0, slash)) === normalizeProviderId(params.provider) && entryId.slice(slash + 1).trim() === params.modelId;
}
function providerModelExplicitNonDefaultRuntimeId(params) {
	const providers = asOptionalRecord(asOptionalRecord(params.cfg.models)?.providers);
	for (const [providerId, providerConfig] of Object.entries(providers ?? {})) {
		if (normalizeProviderId(providerId) !== normalizeProviderId(params.provider)) continue;
		const models = asOptionalRecord(providerConfig)?.models;
		if (!Array.isArray(models)) continue;
		for (const model of models) {
			const record = asOptionalRecord(model);
			if (!modelIdMatchesProviderModelEntry({
				entryId: record?.id,
				provider: params.provider,
				modelId: params.modelId
			})) continue;
			const runtimeId = normalizeOptionalAgentRuntimeId(asOptionalRecord(record?.agentRuntime)?.id);
			if (runtimeId && runtimeId !== "auto" && runtimeId !== "default" && runtimeId !== "codex") return runtimeId;
		}
	}
}
function agentModelMapExactRuntimeId(params) {
	const agentId = normalizeAgentId(params.agentId);
	const agent = agentId ? listMutableCodexRouteAgentEntries(params.cfg).find((entry) => entry.agentId === agentId)?.agent : void 0;
	const modelMaps = [asOptionalRecord(agent?.models), asOptionalRecord(params.cfg.agents?.defaults?.models)];
	for (const models of modelMaps) for (const [key, entry] of Object.entries(models ?? {})) {
		if (!modelIdMatchesProviderModelEntry({
			entryId: key,
			provider: params.provider,
			modelId: params.modelId
		})) continue;
		const runtimeId = normalizeOptionalAgentRuntimeId(asOptionalRecord(asOptionalRecord(entry)?.agentRuntime)?.id);
		if (runtimeId && runtimeId !== "auto" && runtimeId !== "default") return runtimeId;
	}
}
function preRepairLegacyModelPolicyExplicitNonDefaultRuntimePin(params) {
	if (!params.legacyModelRef || !isOpenAICodexModelRef(params.legacyModelRef)) return;
	const parsed = parseCodexRouteModelRef(params.legacyModelRef);
	if (!parsed) return;
	const resolved = resolveModelRuntimePolicy({
		config: params.cfg,
		provider: parsed.provider,
		modelId: parsed.modelId,
		agentId: params.agentId
	});
	const runtimeId = normalizeOptionalAgentRuntimeId(resolved.policy?.id);
	if (!runtimeId || runtimeId === "auto" || runtimeId === "default" || runtimeId === "codex") return;
	if (resolved.source === "model") {
		const providerModelRuntimeId = providerModelExplicitNonDefaultRuntimeId({
			cfg: params.cfg,
			provider: parsed.provider,
			modelId: parsed.modelId
		});
		const agentModelRuntimeId = agentModelMapExactRuntimeId({
			...params,
			...parsed
		});
		if (providerModelRuntimeId === runtimeId && !agentModelRuntimeId) return {
			runtimeId,
			source: "provider-model"
		};
	}
	return {
		runtimeId,
		source: resolved.source ?? "model"
	};
}
function ensureCodexRuntimePolicy(params) {
	const models = asOptionalRecord(params.agent.models);
	const entry = asOptionalRecord(models?.[params.modelRef]);
	const priorRuntime = asOptionalRecord(entry?.agentRuntime);
	const runtimeId = normalizeOptionalLowercaseString(priorRuntime?.id);
	const pinnedRuntimeId = runtimeId && runtimeId !== "auto" && runtimeId !== "default" ? runtimeId : void 0;
	const legacyModelRuntimeId = models ? legacyEntryExplicitNonDefaultRuntimeId(models, params.modelRef) : void 0;
	const preRepairRuntimePin = preRepairLegacyModelPolicyExplicitNonDefaultRuntimePin({
		cfg: params.preRepairCfg ?? params.cfg,
		legacyModelRef: params.legacyModelRef,
		agentId: params.agentId
	});
	const targetRuntimeId = pinnedRuntimeId ?? legacyModelRuntimeId ?? (preRepairRuntimePin?.source === "provider" || preRepairRuntimePin?.source === "provider-model" ? preRepairRuntimePin.runtimeId : void 0) ?? "codex";
	if (params.agentPath === "agents.defaults") shieldExplicitListedAgentRefsFromDefaultPolicy({
		...params,
		targetRuntimeId
	});
	if (pinnedRuntimeId || legacyModelRuntimeId || preRepairRuntimePin?.source === "model") return;
	setModelRuntimePolicy({
		...params,
		runtimeId: preRepairRuntimePin?.runtimeId ?? "codex",
		reason: preRepairRuntimePin ? "so legacy provider runtime pins survive Codex route repair" : "so repaired OpenAI refs keep Codex auth routing"
	});
}
function rewriteStringModelSlotIfCanonicalCodexRuntime(params) {
	if (typeof params.container?.[params.key] === "string") rewriteModelConfigSlotIfCanonicalCodexRuntime(params);
}
function rewriteModelConfigSlotIfCanonicalCodexRuntime(params) {
	const rewrite = (value, path, fallback = false) => {
		const canonicalModel = toCanonicalOpenAIModelRef(value.trim());
		if (!canonicalModel || fallback && isBlockedLegacyCodexModelRef({
			modelRef: value,
			blockedModelIdentities: params.blockedModelIdentities
		}) || !canonicalOpenAIModelUsesCodexRuntime({
			...params,
			modelRef: canonicalModel
		})) return value;
		return recordCodexModelHit({
			...params,
			path,
			model: value.trim()
		}) ?? value;
	};
	const { container, key, path } = params;
	const value = container?.[key];
	if (container && typeof value === "string") {
		container[key] = rewrite(value, path);
		return;
	}
	const record = asOptionalRecord(value);
	if (!record) return;
	if (typeof record.primary === "string") record.primary = rewrite(record.primary, `${path}.primary`);
	if (Array.isArray(record.fallbacks)) {
		for (const [index, entry] of record.fallbacks.entries()) if (typeof entry === "string") record.fallbacks[index] = rewrite(entry, `${path}.fallbacks.${index}`, true);
	}
}
//#endregion
//#region src/commands/doctor/shared/codex-route-config-repair.ts
function rewriteModelPolicyAllowRefs(params) {
	const modelPolicy = asOptionalRecord(params.agent.modelPolicy);
	if (!Array.isArray(modelPolicy?.allow)) return;
	modelPolicy.allow = modelPolicy.allow.map((entry, index) => {
		if (typeof entry !== "string") return entry;
		return recordCodexModelHit({
			hits: params.hits,
			path: `${params.path}.modelPolicy.allow.${index}`,
			model: entry.trim(),
			blockedModelIdentities: params.blockedModelIdentities
		}) ?? entry;
	});
}
function rewriteAgentModelRefs(params) {
	if (!params.agent) return;
	const context = {
		...params,
		agent: params.agent
	};
	for (const key of AGENT_MODEL_CONFIG_KEYS) {
		const start = params.hits.length;
		(key === "model" ? rewriteModelConfigSlot : rewriteModelConfigSlotIfCanonicalCodexRuntime)({
			...context,
			container: params.agent,
			key,
			path: `${params.path}.${key}`
		});
		if (key === "model") preserveCodexRuntimePolicyForHits(context, start);
	}
	rewriteStringModelSlotIfCanonicalCodexRuntime({
		...context,
		container: asOptionalRecord(params.agent.heartbeat),
		key: "model",
		path: `${params.path}.heartbeat.model`
	});
	rewriteModelConfigSlotIfCanonicalCodexRuntime({
		...context,
		container: asOptionalRecord(params.agent.subagents),
		key: "model",
		path: `${params.path}.subagents.model`
	});
	rewriteAgentCompactionRefs(context);
	const mediaModels = asOptionalRecord(params.agent.mediaModels);
	for (const key of [
		"image",
		"video",
		"music"
	]) rewriteModelConfigSlot({
		...context,
		container: mediaModels ?? {},
		key,
		path: `${params.path}.mediaModels.${key}`
	});
	const modelPolicyStart = params.hits.length;
	rewriteModelPolicyAllowRefs(context);
	preserveCodexRuntimePolicyForHits(context, modelPolicyStart);
	const modelsStart = params.hits.length;
	rewriteModelsMap({
		...context,
		models: asOptionalRecord(params.agent.models),
		path: `${params.path}.models`
	});
	preserveCodexRuntimePolicyForHits(context, modelsStart);
}
function rewriteConfigModelRefs(params) {
	const preserveSharedDefaultCompactionOverrides = getSharedDefaultCompactionOverrideConsumers(params);
	const nextConfig = structuredClone(params.cfg);
	const hits = [];
	const runtimePolicyChanges = [];
	const unsupportedCompactionChanges = maybeMigrateLegacyLosslessCompactionConfig({
		cfg: nextConfig,
		env: params.env
	});
	const preservedLegacyLosslessCompactionPaths = new Set(collectLegacyLosslessCompactionConfigs({
		cfg: nextConfig,
		env: params.env
	}).flatMap((hit) => hit.modelPath ? [hit.providerPath, hit.modelPath] : [hit.providerPath]));
	const rewrittenInheritedCompactionModels = /* @__PURE__ */ new Map();
	const context = {
		...params,
		cfg: nextConfig,
		preRepairCfg: params.cfg,
		hits,
		preserveUnsupportedCompactionPaths: preservedLegacyLosslessCompactionPaths,
		rewrittenInheritedCompactionModels,
		runtimePolicyChanges,
		unsupportedCompactionChanges
	};
	rewriteAgentModelRefs({
		...context,
		agent: asOptionalRecord(nextConfig.agents?.defaults),
		path: "agents.defaults",
		preserveUnsupportedCompactionOverrides: preserveSharedDefaultCompactionOverrides
	});
	const inheritedModelRef = readAgentPrimaryModelRef(nextConfig.agents?.defaults);
	const agents = listMutableCodexRouteAgentEntries(nextConfig);
	for (const { agent: agentRecord, agentId, path } of agents) rewriteAgentModelRefs({
		...context,
		agent: agentRecord,
		path,
		agentId,
		inheritedModelRef,
		inheritedCompaction: nextConfig.agents?.defaults?.compaction,
		inheritedCompactionPath: "agents.defaults.compaction"
	});
	visitNonAgentModelSlots(nextConfig, (slot) => {
		rewriteStringModelSlotIfCanonicalCodexRuntime({
			...params,
			cfg: nextConfig,
			hits,
			...slot
		});
	});
	return {
		cfg: hits.length > 0 || runtimePolicyChanges.length > 0 || unsupportedCompactionChanges.length > 0 ? nextConfig : params.cfg,
		changes: hits,
		runtimePolicyChanges,
		unsupportedCompactionChanges
	};
}
function rewriteAgentCompactionRefs(params) {
	const compaction = asOptionalRecord(params.agent.compaction);
	const inheritedCompaction = asOptionalRecord(params.inheritedCompaction);
	if (!agentUsesCodexRuntimeForCompaction(params)) rewriteStringModelSlotIfCanonicalCodexRuntime({
		...params,
		container: compaction,
		key: "model",
		path: `${params.path}.compaction.model`
	});
	else if (normalizeOptionalLowercaseString(compaction?.provider ?? inheritedCompaction?.provider) === "lossless-claw") rewriteLosslessCompactionModel(params, compaction, inheritedCompaction);
	else {
		removeUnsupportedCodexCompactionOverrides({
			agent: params.agent,
			compaction,
			path: params.path,
			preserve: params.preserveUnsupportedCompactionOverrides,
			preservePaths: params.preserveUnsupportedCompactionPaths,
			changes: params.unsupportedCompactionChanges
		});
		rewriteStringModelSlot({
			...params,
			container: compaction,
			key: "model",
			path: `${params.path}.compaction.model`
		});
	}
	rewriteStringModelSlotIfCanonicalCodexRuntime({
		...params,
		container: asOptionalRecord(compaction?.memoryFlush),
		key: "model",
		path: `${params.path}.compaction.memoryFlush.model`
	});
}
function rewriteLosslessCompactionModel(params, compaction, inheritedCompaction) {
	const start = params.hits.length;
	rewriteStringModelSlot({
		...params,
		container: compaction,
		key: "model",
		path: `${params.path}.compaction.model`
	});
	preserveCodexRuntimePolicyForHits(params, start);
	const localModel = typeof compaction?.model === "string" ? compaction.model.trim() : "";
	const inheritedModelPath = params.inheritedCompactionPath ? `${params.inheritedCompactionPath}.model` : void 0;
	if (localModel || !inheritedModelPath || !params.preserveUnsupportedCompactionPaths?.has(inheritedModelPath)) return;
	const inheritedStart = params.hits.length;
	rewriteStringModelSlot({
		...params,
		container: inheritedCompaction,
		key: "model",
		path: inheritedModelPath
	});
	const inheritedHit = params.hits[inheritedStart];
	const inheritedCanonicalModel = inheritedHit?.canonicalModel ?? params.rewrittenInheritedCompactionModels?.get(inheritedModelPath);
	if (inheritedHit) {
		params.rewrittenInheritedCompactionModels?.set(inheritedModelPath, inheritedHit.canonicalModel);
		preserveCodexRuntimePolicyForHits(params, inheritedStart);
	} else if (inheritedCanonicalModel) ensureCodexRuntimePolicy({
		...params,
		agentPath: params.path,
		modelRef: inheritedCanonicalModel,
		changes: params.runtimePolicyChanges
	});
}
function preserveCodexRuntimePolicyForHits(params, fromIndex) {
	for (const hit of params.hits.slice(fromIndex)) ensureCodexRuntimePolicy({
		...params,
		agentPath: params.path,
		modelRef: hit.canonicalModel,
		legacyModelRef: hit.model,
		changes: params.runtimePolicyChanges
	});
}
function removeUnsupportedCodexCompactionOverrides(params) {
	if (!params.compaction) return;
	if (normalizeOptionalLowercaseString(params.compaction.provider) === "lossless-claw") return;
	for (const key of UNSUPPORTED_CODEX_COMPACTION_KEYS) {
		const path = `${params.path}.compaction.${key}`;
		if (params.preservePaths?.has(path) || params.preserve?.[key]) continue;
		const value = params.compaction[key];
		if (typeof value !== "string" || !value.trim()) continue;
		delete params.compaction[key];
		params.changes.push(`Removed ${path}; Codex runtime uses native server-side compaction.`);
	}
	if (Object.keys(params.compaction).length === 0) delete params.agent.compaction;
}
function maybeMigrateLegacyLosslessCompactionConfig(params) {
	const root = params.cfg;
	const hits = collectLegacyLosslessCompactionConfigs(params);
	if (hits.length === 0) return [];
	const existingPlugins = asOptionalRecord(root.plugins);
	const existingSlots = asOptionalRecord(existingPlugins?.slots);
	const configuredContextEngine = typeof existingSlots?.contextEngine === "string" && existingSlots.contextEngine.trim() ? existingSlots.contextEngine.trim() : void 0;
	const existingSummaryModel = readLosslessSummaryModel(existingPlugins);
	const contextEngine = normalizeOptionalLowercaseString(configuredContextEngine);
	if (sharedDefaultLosslessCompactionHasNonCodexConsumer(params) || !canAutoMigrateLegacyLosslessCompaction({
		hits,
		contextEngine,
		summaryModel: existingSummaryModel
	})) return [];
	const plugins = ensureRecord(root, "plugins");
	const slots = ensureRecord(plugins, "slots");
	const entries = ensureRecord(plugins, "entries");
	const entry = ensureRecord(entries, LOSSLESS_CONTEXT_ENGINE_ID);
	const config = ensureRecord(entry, "config");
	const changes = [];
	if (slots.contextEngine !== "lossless-claw") {
		slots.contextEngine = LOSSLESS_CONTEXT_ENGINE_ID;
		changes.push(`Set plugins.slots.contextEngine to "${LOSSLESS_CONTEXT_ENGINE_ID}" for legacy Lossless compaction config.`);
	}
	if (entry.enabled !== true) {
		entry.enabled = true;
		changes.push(`Enabled plugins.entries.${LOSSLESS_CONTEXT_ENGINE_ID}.`);
	}
	let summaryModel = existingSummaryModel;
	const firstModel = legacyLosslessSummaryModels(hits)[0];
	if (!summaryModel && firstModel) {
		summaryModel = firstModel;
		config.summaryModel = summaryModel;
		changes.push(`Moved ${hits.find((hit) => hit.modelValue)?.modelPath ?? "legacy compaction model"} to plugins.entries.${LOSSLESS_CONTEXT_ENGINE_ID}.config.summaryModel.`);
	}
	ensureLosslessLlmPolicy({
		entry,
		summaryModel,
		changes
	});
	preserveMigratedLosslessCodexRuntimePolicy({
		...params,
		hits,
		summaryModel,
		changes
	});
	for (const hit of hits) for (const key of ["provider", "model"]) {
		const path = key === "provider" ? hit.providerPath : hit.modelPath;
		if (!path) continue;
		const owner = readCompactionOwnerForPath(params.cfg, readCompactionOwnerPathForKeyPath(path));
		const compaction = asOptionalRecord(owner?.compaction);
		const value = compaction?.[key];
		if (!owner || !compaction || typeof value !== "string" || !value.trim()) continue;
		delete compaction[key];
		changes.push(key === "provider" ? `Removed ${path}; Lossless now runs through plugins.slots.contextEngine.` : `Removed ${path} after migrating the Lossless summary model.`);
		if (Object.keys(compaction).length === 0) delete owner.compaction;
	}
	return changes;
}
function preserveMigratedLosslessCodexRuntimePolicy(params) {
	if (!params.summaryModel) return;
	const preservedOwners = /* @__PURE__ */ new Set();
	for (const hit of params.hits) {
		if (!hit.modelValue || !isOpenAICodexModelRef(hit.modelValue)) continue;
		if (toCanonicalOpenAIModelRef(hit.modelValue) !== params.summaryModel) continue;
		const ownerPath = readCompactionOwnerPathForKeyPath(hit.modelPath ?? hit.providerPath);
		if (preservedOwners.has(ownerPath)) continue;
		const owner = readCompactionOwnerForPath(params.cfg, ownerPath);
		if (!owner) continue;
		preservedOwners.add(ownerPath);
		ensureCodexRuntimePolicy({
			...params,
			agent: owner,
			agentPath: ownerPath,
			agentId: agentIdFromAgentPath(ownerPath),
			modelRef: params.summaryModel
		});
	}
}
function ensureLosslessLlmPolicy(params) {
	if (!params.summaryModel) return;
	const llm = ensureRecord(params.entry, "llm");
	if (llm.allowModelOverride !== true) {
		llm.allowModelOverride = true;
		params.changes.push(`Set plugins.entries.${LOSSLESS_CONTEXT_ENGINE_ID}.llm.allowModelOverride to true for Lossless summary model overrides.`);
	}
	const allowedModels = Array.isArray(llm.allowedModels) ? [...llm.allowedModels] : [];
	if (!allowedModels.includes(params.summaryModel)) {
		allowedModels.push(params.summaryModel);
		llm.allowedModels = allowedModels;
		params.changes.push(`Added ${params.summaryModel} to plugins.entries.${LOSSLESS_CONTEXT_ENGINE_ID}.llm.allowedModels.`);
	}
}
function readCompactionOwnerForPath(cfg, ownerPath) {
	if (ownerPath === "agents.defaults") return asOptionalRecord(cfg.agents?.defaults);
	if (!ownerPath.startsWith("agents.list.")) return readMutablePath(cfg, ownerPath);
	const label = ownerPath.slice(12);
	const agents = cfg.agents?.list ?? [];
	return asOptionalRecord(agents.find((agent) => agent.id === label)) ?? asOptionalRecord(Number.isInteger(Number(label)) ? agents[Number(label)] : void 0);
}
function readMutablePath(root, pathLabel) {
	let cursor = root;
	for (const part of pathLabel.split(".")) {
		const record = asOptionalRecord(cursor);
		if (!record) return;
		cursor = record[part];
	}
	return asOptionalRecord(cursor);
}
function readCompactionOwnerPathForKeyPath(path) {
	return path.replace(/\.(model|provider)$/, "").replace(/\.compaction$/, "");
}
//#endregion
//#region src/commands/doctor/shared/codex-route-config-scan.ts
function collectModelsMapRefs(params) {
	const record = asOptionalRecord(params.models);
	if (!record) return;
	for (const modelRef of Object.keys(record)) recordCodexModelHit({
		...params,
		path: `${params.path}.${modelRef}`,
		model: modelRef
	});
}
function collectModelPolicyAllowRefs(params) {
	const allow = asOptionalRecord(params.modelPolicy)?.allow;
	if (!Array.isArray(allow)) return;
	for (const [index, modelRef] of allow.entries()) collectStringModelSlot({
		...params,
		path: `${params.path}.allow.${index}`,
		value: modelRef
	});
}
function collectAgentModelRefs(params) {
	const agent = asOptionalRecord(params.agent);
	if (!agent) return;
	const collect = (key, value, stringOnly = false) => (stringOnly ? collectStringModelSlot : collectModelConfigSlot)({
		...params,
		path: `${params.path}.${key}`,
		value
	});
	for (const key of AGENT_MODEL_CONFIG_KEYS) collect(key, agent[key]);
	const mediaModels = asOptionalRecord(agent.mediaModels);
	for (const key of [
		"image",
		"video",
		"music"
	]) collect(`mediaModels.${key}`, mediaModels?.[key]);
	collect("heartbeat.model", asOptionalRecord(agent.heartbeat)?.model, true);
	collect("subagents.model", asOptionalRecord(agent.subagents)?.model);
	const compaction = asOptionalRecord(agent.compaction);
	collect("compaction.model", compaction?.model, true);
	collect("compaction.memoryFlush.model", asOptionalRecord(compaction?.memoryFlush)?.model, true);
	collectModelsMapRefs({
		...params,
		path: `${params.path}.models`,
		models: agent.models
	});
	collectModelPolicyAllowRefs({
		...params,
		path: `${params.path}.modelPolicy`,
		modelPolicy: agent.modelPolicy
	});
}
function collectConfigModelRefs(cfg, blockedModelIdentities) {
	const hits = [];
	const defaults = cfg.agents?.defaults;
	collectAgentModelRefs({
		hits,
		agent: defaults,
		path: "agents.defaults",
		blockedModelIdentities
	});
	const agents = listMutableCodexRouteAgentEntries(cfg);
	for (const { agent: agentRecord, path } of agents) collectAgentModelRefs({
		hits,
		agent: agentRecord,
		path,
		blockedModelIdentities
	});
	visitNonAgentModelSlots(cfg, ({ container, key, path }) => {
		collectStringModelSlot({
			hits,
			path,
			value: container[key],
			blockedModelIdentities
		});
	});
	return hits;
}
function collectDisabledCodexPluginRouteHits(cfg, env) {
	return isCodexPluginUnavailableByConfig(cfg) ? collectCodexRuntimeRouteHits(cfg, env) : [];
}
/** Find effective configured model routes that select the Codex runtime. */
function collectCodexRuntimeRouteHits(cfg, env) {
	const defaults = cfg.agents?.defaults;
	const defaultRefs = collectAgentRuntimeModelRefs({
		agent: defaults,
		path: "agents.defaults"
	});
	let implicitDefaultRef;
	if (cfg.agents && !hasAgentPrimaryModelConfig(defaults) && !defaultRefs.some((ref) => resolveRuntimeModelRef({
		cfg,
		modelRef: ref.modelRef
	}) === resolveImplicitDefaultAgentModelRef(cfg))) {
		implicitDefaultRef = {
			path: "agents.defaults.model",
			modelRef: resolveImplicitDefaultAgentModelRef(cfg)
		};
		defaultRefs.push(implicitDefaultRef);
	}
	const agents = listMutableCodexRouteAgentEntries(cfg);
	const inheritedDefaultAuxRefs = defaultRefs.filter((ref) => ref.path === "agents.defaults.heartbeat.model" || ref.path.startsWith("agents.defaults.subagents.model"));
	const inheritedDefaultModelPolicyRefs = defaultRefs.filter((ref) => ref.path.startsWith("agents.defaults.models."));
	const inheritedDefaultModelRefs = defaultRefs.filter((ref) => !inheritedDefaultAuxRefs.includes(ref) && !inheritedDefaultModelPolicyRefs.includes(ref));
	const channelRefs = collectChannelAgentRuntimeModelRefs(cfg);
	const candidateRefs = agents.length === 0 ? [...defaultRefs, ...channelRefs] : [];
	for (const { agent: agentRecord, agentId, path } of agents) {
		for (const ref of channelRefs) candidateRefs.push({
			path: ref.path,
			modelRef: ref.modelRef,
			agentId
		});
		const inheritedModelRefs = inheritedDefaultAuxRefs.filter((ref) => {
			if (ref.path === "agents.defaults.heartbeat.model") return !normalizeOptionalLowercaseString(asOptionalRecord(agentRecord.heartbeat)?.model);
			if (ref.path.startsWith("agents.defaults.subagents.model")) return !readModelConfigPrimaryRef(asOptionalRecord(agentRecord.subagents)?.model);
			return true;
		});
		inheritedModelRefs.push(...inheritedDefaultModelPolicyRefs);
		for (const ref of collectAgentRuntimeModelRefs({
			agent: agentRecord,
			path,
			fallbackModelRefs: inheritedDefaultModelRefs.map((inheritedRef) => inheritedRef === implicitDefaultRef ? Object.assign({}, inheritedRef, { modelRef: resolveImplicitDefaultAgentModelRef(cfg, agentId) }) : inheritedRef),
			inheritedModelRefs
		})) candidateRefs.push({
			...ref,
			agentId
		});
	}
	const hits = [];
	const seen = /* @__PURE__ */ new Set();
	for (const ref of candidateRefs) {
		const canonicalModel = resolveRuntimeModelRef({
			cfg,
			modelRef: ref.modelRef,
			agentId: ref.agentId
		});
		if (!modelRefUsesCodexRuntime({
			cfg,
			modelRef: ref.modelRef,
			agentId: ref.agentId,
			env
		})) continue;
		const key = `${ref.agentId ?? ""}\0${ref.path}\0${canonicalModel}`;
		if (seen.has(key)) continue;
		seen.add(key);
		hits.push({
			path: ref.path,
			modelRef: ref.modelRef,
			canonicalModel,
			...ref.agentId ? { agentId: ref.agentId } : {}
		});
	}
	return hits;
}
/** Find Codex-routed model refs that require the Codex plugin while it is disabled. */
function collectDisabledCodexPluginRouteIssues(cfg, env) {
	const repairBlocked = codexPluginRepairIsBlocked(cfg);
	return collectDisabledCodexPluginRouteHits(cfg, env).map((hit) => ({
		path: hit.path,
		modelRef: hit.modelRef,
		canonicalModel: hit.canonicalModel,
		repairBlocked
	}));
}
function enableCodexPluginForRequiredRoutes(params) {
	if (params.routeHits.length === 0 || codexPluginRepairIsBlocked(params.cfg)) return {
		cfg: params.cfg,
		changes: []
	};
	const cfg = structuredClone(params.cfg);
	const plugins = ensureRecord(cfg, "plugins");
	const entries = ensureRecord(plugins, "entries");
	const codexEntry = asOptionalRecord(entries.codex) ?? {};
	const changes = [];
	if (codexEntry.enabled !== true) {
		entries.codex = {
			...codexEntry,
			enabled: true
		};
		changes.push("Enabled plugins.entries.codex because configured agent routes use Codex runtime.");
	}
	if (Array.isArray(plugins.allow) && plugins.allow.length > 0 && !plugins.allow.some((id) => normalizeOptionalLowercaseString(id) === "codex")) {
		plugins.allow = [...plugins.allow, "codex"];
		changes.push("Added codex to plugins.allow because configured agent routes use Codex runtime.");
	}
	return {
		cfg,
		changes
	};
}
function codexPluginRepairIsBlocked(cfg) {
	return cfg.plugins?.enabled === false || pluginIdListIncludes(cfg.plugins?.deny, "codex") || asOptionalRecord(asOptionalRecord(cfg.plugins?.entries)?.codex)?.enabled === false;
}
function isCodexPluginUnavailableByConfig(cfg) {
	if (codexPluginRepairIsBlocked(cfg)) return true;
	const allow = cfg.plugins?.allow;
	return Array.isArray(allow) && allow.length > 0 && !pluginIdListIncludes(allow, "codex");
}
function pluginIdListIncludes(value, pluginId) {
	return Array.isArray(value) && value.some((entry) => normalizeOptionalLowercaseString(entry) === pluginId);
}
function collectAgentRuntimeModelRefs(params) {
	const refs = [];
	const agent = asOptionalRecord(params.agent);
	if (agent && Object.hasOwn(agent, "model")) collectModelConfigRefs({
		refs,
		path: `${params.path}.model`,
		value: agent.model
	});
	if (!hasAgentPrimaryModelConfig(agent) && params.fallbackModelRefs) refs.push(...params.fallbackModelRefs);
	collectStringModelConfigRef({
		refs,
		path: `${params.path}.heartbeat.model`,
		value: asOptionalRecord(agent?.heartbeat)?.model
	});
	collectModelConfigRefs({
		refs,
		path: `${params.path}.subagents.model`,
		value: asOptionalRecord(agent?.subagents)?.model
	});
	if (params.inheritedModelRefs) refs.push(...params.inheritedModelRefs);
	collectCodexRuntimeModelPolicyRefs({
		refs,
		path: `${params.path}.models`,
		models: agent?.models
	});
	return refs;
}
function hasAgentPrimaryModelConfig(agent) {
	const record = asOptionalRecord(agent);
	return Boolean(record && readModelConfigPrimaryRef(record.model));
}
function collectChannelAgentRuntimeModelRefs(cfg) {
	const refs = [];
	visitChannelModelSlots(cfg, ({ container, key, path }) => {
		collectStringModelConfigRef({
			refs,
			path,
			value: container[key]
		});
	});
	return refs;
}
//#endregion
//#region src/commands/doctor/shared/codex-route-warnings.ts
function resolveKnownModelRefMigrationTarget(cfg, ref) {
	const blockedModelIdentities = new Set(collectBlockedLegacyOpenAICodexProviderPlan(cfg).blockedModelIdentities);
	if (isBlockedLegacyCodexModelRef({
		modelRef: ref,
		blockedModelIdentities
	})) return;
	const providerRef = migrateLegacyRuntimeModelRef(ref)?.ref ?? toCanonicalOpenAIModelRef(ref) ?? ref;
	const migrated = rewriteKnownModelRefs(providerRef, "model", []).value;
	return typeof migrated === "string" && migrated !== ref ? migrated : void 0;
}
function formatUnsupportedCompactionWarning(params) {
	return [
		"- Codex runtime ignores compaction.provider; compaction.model still applies to OpenClaw host summaries.",
		...params.hits.map((hit) => `- ${hit.path}: ${hit.value} is ignored while this agent uses Codex runtime.`),
		params.fixHint
	].join("\n");
}
function formatLegacyLosslessCompactionWarning(params) {
	const configLines = [];
	const providerPaths = /* @__PURE__ */ new Set();
	for (const hit of params.hits) {
		if (!providerPaths.has(hit.providerPath)) {
			providerPaths.add(hit.providerPath);
			configLines.push(`- ${hit.providerPath}: ${hit.providerValue} should become plugins.slots.contextEngine: ${LOSSLESS_CONTEXT_ENGINE_ID}.`);
		}
		if (hit.modelPath && hit.modelValue) configLines.push(`- ${hit.modelPath}: ${hit.modelValue} should become plugins.entries.${LOSSLESS_CONTEXT_ENGINE_ID}.config.summaryModel.`);
	}
	return [
		"- Legacy Lossless compaction config should use the Lossless context-engine slot for Codex.",
		...configLines,
		params.canAutoFix ? "- Run `openclaw doctor --fix`: it migrates legacy Lossless compaction config to the Lossless context-engine slot." : "- Move the Lossless config manually; doctor will not overwrite an existing non-Lossless context-engine slot or collapse conflicting per-agent summary models."
	].join("\n");
}
function formatDisabledCodexPluginWarning(params) {
	const fixHint = params.repairBlocked ? "- Enable plugins.entries.codex and plugin loading, and remove `codex` from plugins.deny; or set the affected OpenAI models to an OpenClaw runtime policy." : "- Run `openclaw doctor --fix`: it enables plugins.entries.codex, or set the affected OpenAI models to an OpenClaw runtime policy.";
	return [
		"- Codex runtime is selected, but the Codex plugin is disabled.",
		...params.hits.map((hit) => `- ${hit.path}: ${hit.modelRef} resolves to ${hit.canonicalModel} with Codex runtime while the Codex plugin is disabled by config.`),
		fixHint
	].join("\n");
}
function readCodexPluginConfig(cfg) {
	const plugins = asOptionalRecord(cfg.plugins);
	const entries = asOptionalRecord(plugins?.entries);
	const codex = asOptionalRecord(entries?.codex);
	return asOptionalRecord(codex?.config);
}
function collectCodexAppServerCommandWarnings(cfg) {
	const config = readCodexPluginConfig(cfg);
	const appServer = asOptionalRecord(config?.appServer);
	if (typeof appServer?.command !== "string" || !appServer.command.trim()) return [];
	const command = appServer.command.trim();
	const inlineArgs = detectWindowsSpawnCommandInlineArgs(command);
	return [...inlineArgs ? [[
		"- Codex app-server command override includes inline arguments.",
		`- plugins.entries.codex.config.appServer.command: "${command}" starts with "${inlineArgs.executable}" and embeds "${inlineArgs.arguments}". The command field must be only the executable path.`,
		"- Remove the override to use managed Codex startup, or move script/options to plugins.entries.codex.config.appServer.args."
	].join("\n")] : [], [
		"- Custom Codex app-server command bypasses OpenClaw's managed exact-version binary.",
		"- plugins.entries.codex.config.appServer.command: Doctor did not execute, inspect, or rewrite this command.",
		"- Remove the override to use managed Codex startup, or verify the custom binary matches the Codex version bundled with this OpenClaw release."
	].join("\n")];
}
const FAST_MODE_PARAM_KEYS = ["fastMode", "fast_mode"];
const SERVICE_TIER_PARAM_KEYS = ["serviceTier", "service_tier"];
function ownValues(record, keys) {
	return keys.filter((key) => Object.hasOwn(record, key)).map((key) => record[key]);
}
function modelUsesCodexForEveryAgent(cfg, modelRef) {
	const parsed = parseCodexRouteModelRef(modelRef);
	if (!parsed || parsed.modelId === "*") return false;
	return listMutableCodexRouteAgentEntries(cfg).every(({ agentId }) => normalizeOptionalLowercaseString(resolveModelRuntimePolicy({
		config: cfg,
		provider: parsed.provider,
		modelId: parsed.modelId,
		agentId
	}).policy?.id) === "codex");
}
function collectCodexModelParamHits(cfg, env) {
	const hits = [];
	const seen = /* @__PURE__ */ new Set();
	const agentPaths = new Map(listMutableCodexRouteAgentEntries(cfg).map(({ agentId, path }) => [agentId, path]));
	for (const route of collectCodexRuntimeRouteHits(cfg, env)) {
		const parsed = parseCodexRouteModelRef(route.canonicalModel);
		if (!parsed || parsed.provider !== "openai") continue;
		const sources = resolveModelExtraParamSources({
			config: cfg,
			provider: parsed.provider,
			modelId: parsed.modelId,
			agentId: route.agentId
		});
		const modelParams = sources.modelParams;
		const fastModes = ownValues(modelParams ?? {}, FAST_MODE_PARAM_KEYS);
		const serviceTiers = ownValues(modelParams ?? {}, SERVICE_TIER_PARAM_KEYS);
		const canRemoveServiceTier = fastModes.length > 0 && fastModes.every((configured) => normalizeFastMode(configured) === true) && serviceTiers.length > 0 && serviceTiers.every((configured) => normalizeOptionalLowercaseString(configured) === "priority") && modelUsesCodexForEveryAgent(cfg, route.canonicalModel);
		const paramSources = [
			{
				params: sources.defaultParams,
				path: "agents.defaults.params",
				modelScoped: false
			},
			{
				params: modelParams,
				path: `agents.defaults.models.${route.canonicalModel}.params`,
				modelScoped: true
			},
			...route.agentId ? [{
				params: sources.agentParams,
				path: `${agentPaths.get(route.agentId) ?? `agents.entries.${route.agentId}`}.params`,
				modelScoped: false
			}] : []
		];
		for (const source of paramSources) for (const [key, paramValue] of Object.entries(source.params ?? {})) {
			if (source.modelScoped && isAgentRuntimeModelParam(key, paramValue)) continue;
			const path = `${source.path}.${key}`;
			if (seen.has(path)) continue;
			seen.add(path);
			hits.push({
				key,
				path,
				modelRef: route.canonicalModel,
				removable: source.modelScoped && canRemoveServiceTier && SERVICE_TIER_PARAM_KEYS.some((alias) => alias === key)
			});
		}
	}
	return hits;
}
function formatCodexModelParamWarning(hits) {
	const fixHint = hits.some((hit) => hit.removable) ? "- Run `openclaw doctor --fix` to remove only redundant priority service-tier params; remove any remaining params or set the affected route's agentRuntime.id to \"openclaw\"." : "- Remove these params or set the affected route's agentRuntime.id to \"openclaw\"; Doctor cannot migrate them without changing behavior.";
	return [
		"- Explicit native Codex model routes cannot reproduce authored request transport parameters.",
		...hits.map((hit) => `- ${hit.path}: ${hit.removable ? "redundant because this model's fastMode already selects native priority service tier" : `authored ${hit.key} cannot be migrated automatically`}.`),
		fixHint
	].join("\n");
}
function repairRedundantCodexServiceTiers(cfg, env) {
	const removable = collectCodexModelParamHits(cfg, env).filter((hit) => hit.removable);
	if (removable.length === 0) return {
		config: cfg,
		changes: []
	};
	const config = structuredClone(cfg);
	const models = asOptionalRecord(config.agents?.defaults?.models);
	const changes = [];
	for (const hit of removable) {
		const params = asOptionalRecord(asOptionalRecord(models?.[hit.modelRef])?.params);
		if (params) {
			delete params[hit.key];
			changes.push(`Removed redundant agents.defaults.models.${hit.modelRef}.params.${hit.key}; fastMode already selects native priority.`);
		}
	}
	return {
		config,
		changes
	};
}
/** Collect non-executing Codex runtime compatibility diagnostics for Doctor and lint. */
function collectCodexRuntimeCompatibilityWarnings(cfg, env) {
	const warnings = collectCodexAppServerCommandWarnings(cfg);
	const modelParamHits = collectCodexModelParamHits(cfg, env);
	if (modelParamHits.length > 0) warnings.push(formatCodexModelParamWarning(modelParamHits));
	return warnings;
}
function collectCodexComputerUseWarnings(cfg) {
	const config = readCodexPluginConfig(cfg);
	const computerUse = asOptionalRecord(config?.computerUse);
	if (!computerUse) return [];
	if (!(computerUse.enabled === true || computerUse.autoInstall === true || typeof computerUse.marketplaceSource === "string" || typeof computerUse.marketplacePath === "string" || typeof computerUse.marketplaceName === "string")) return [];
	const cadence = [
		30,
		60,
		120,
		240
	].find((minutes) => computerUse.healthCheckIntervalMinutes === minutes) ?? 60;
	return [[
		"- Codex Computer Use is enabled.",
		"- Doctor config review found Computer Use enabled; run `/codex computer-use status` to inspect installation, exposure, and the live `list_apps` check.",
		computerUse.healthCheckEnabled === true ? `- Periodic Computer Use health checks are enabled with a ${cadence}-minute cadence.` : "- Periodic Computer Use health checks are disabled by default; set `computerUse.healthCheckEnabled` to true to enable them.",
		computerUse.autoRepair === true ? "- Stale Computer Use MCP child repair is enabled and limited to SkyComputerUseClient children." : "- Stale Computer Use MCP child repair is disabled by default; set `computerUse.autoRepair` to true to repair before retrying a failed check."
	].join("\n")];
}
/** Collect doctor warnings for legacy Codex model refs and compaction overrides. */
function collectCodexRouteWarnings(params) {
	const env = params.env ?? process.env;
	const compactionContext = {
		cfg: params.cfg,
		env
	};
	const blockedProviderPlan = params.blockedProviderPlan ?? collectBlockedLegacyOpenAICodexProviderPlan(params.cfg);
	const blockedModelIdentities = new Set(blockedProviderPlan.blockedModelIdentities);
	const hits = collectConfigModelRefs(params.cfg, blockedModelIdentities);
	const disabledCodexPluginHits = collectDisabledCodexPluginRouteHits(params.cfg, env);
	const legacyLosslessCompactionConfigs = collectLegacyLosslessCompactionConfigs(compactionContext);
	const legacyLosslessCompactionPaths = new Set(legacyLosslessCompactionConfigs.flatMap((hit) => hit.modelPath ? [hit.providerPath, hit.modelPath] : [hit.providerPath]));
	const unsupportedCompactionOverrides = collectUnsupportedCodexCompactionOverrides(compactionContext).filter((hit) => !legacyLosslessCompactionPaths.has(hit.path));
	const sharedDefaultCompactionConsumers = getSharedDefaultCompactionOverrideConsumers(compactionContext);
	const sharedLosslessDefaultHasNonCodexConsumer = sharedDefaultLosslessCompactionHasNonCodexConsumer(compactionContext);
	const warnings = [
		...blockedProviderPlan.warning ? [blockedProviderPlan.warning] : [],
		...collectCodexRuntimeCompatibilityWarnings(params.cfg, env),
		...collectCodexComputerUseWarnings(params.cfg)
	];
	if (hits.length > 0) warnings.push([
		"- Legacy `codex/*` and `openai-codex/*` model refs should be rewritten to `openai/*`.",
		...hits.map((hit) => `- ${hit.path}: ${hit.model} should become ${hit.canonicalModel}.`),
		"- Run `openclaw doctor --fix`: it rewrites configured model refs and stale sessions to `openai/*`, and moves Codex intent to provider/model runtime policy."
	].join("\n"));
	if (legacyLosslessCompactionConfigs.length > 0) {
		const plugins = asOptionalRecord(params.cfg.plugins);
		const contextEngine = normalizeOptionalLowercaseString(asOptionalRecord(plugins?.slots)?.contextEngine);
		warnings.push(formatLegacyLosslessCompactionWarning({
			hits: legacyLosslessCompactionConfigs,
			canAutoFix: !sharedLosslessDefaultHasNonCodexConsumer && canAutoMigrateLegacyLosslessCompaction({
				hits: legacyLosslessCompactionConfigs,
				contextEngine,
				summaryModel: readLosslessSummaryModel(plugins)
			})
		}));
	}
	if (disabledCodexPluginHits.length > 0) warnings.push(formatDisabledCodexPluginWarning({
		hits: disabledCodexPluginHits,
		repairBlocked: codexPluginRepairIsBlocked(params.cfg)
	}));
	const preservedSharedDefaultHits = unsupportedCompactionOverrides.filter((hit) => hit.path.startsWith("agents.defaults.compaction.") && sharedDefaultCompactionConsumers[hit.key]);
	const fixableHits = unsupportedCompactionOverrides.filter((hit) => !hit.path.startsWith("agents.defaults.compaction.") || !sharedDefaultCompactionConsumers[hit.key]);
	if (preservedSharedDefaultHits.length > 0) warnings.push(formatUnsupportedCompactionWarning({
		hits: preservedSharedDefaultHits,
		fixHint: "- Move or remove shared `agents.defaults.compaction.provider` manually; doctor keeps shared defaults while non-Codex agents can inherit them."
	}));
	if (fixableHits.length > 0) warnings.push(formatUnsupportedCompactionWarning({
		hits: fixableHits,
		fixHint: "- Run `openclaw doctor --fix`: it removes unsupported Codex compaction overrides."
	}));
	return warnings;
}
/** Rewrite legacy Codex config routes to OpenAI refs and explicit runtime policy when allowed. */
function maybeRepairCodexRoutes(params) {
	const env = params.env ?? process.env;
	const blockedProviderPlan = params.blockedProviderPlan ?? collectBlockedLegacyOpenAICodexProviderPlan(params.cfg);
	const blockedModelIdentities = new Set(blockedProviderPlan.blockedModelIdentities);
	const hits = collectConfigModelRefs(params.cfg, blockedModelIdentities);
	const disabledCodexPluginHits = collectDisabledCodexPluginRouteHits(params.cfg, env);
	const compactionContext = {
		cfg: params.cfg,
		env
	};
	const unsupportedCompactionOverrides = collectUnsupportedCodexCompactionOverrides(compactionContext);
	const legacyLosslessCompactionConfigs = collectLegacyLosslessCompactionConfigs(compactionContext);
	const hasRemovableServiceTier = collectCodexModelParamHits(params.cfg, env).some((hit) => hit.removable);
	if (!params.shouldRepair || hits.length === 0 && disabledCodexPluginHits.length === 0 && unsupportedCompactionOverrides.length === 0 && legacyLosslessCompactionConfigs.length === 0 && !hasRemovableServiceTier && !blockedProviderPlan.warning) return {
		cfg: params.cfg,
		warnings: collectCodexRouteWarnings({
			cfg: params.cfg,
			env,
			blockedProviderPlan
		}),
		changes: []
	};
	const repaired = rewriteConfigModelRefs({
		cfg: params.cfg,
		env,
		blockedModelIdentities
	});
	const serviceTierRepair = repairRedundantCodexServiceTiers(repaired.cfg, env);
	const codexPluginRepair = enableCodexPluginForRequiredRoutes({
		cfg: serviceTierRepair.config,
		routeHits: collectDisabledCodexPluginRouteHits(serviceTierRepair.config, env)
	});
	const warnings = collectCodexRouteWarnings({
		cfg: codexPluginRepair.cfg,
		env,
		blockedProviderPlan
	});
	const routeChanges = repaired.changes.length > 0 ? [`Repaired Codex model routes:\n${repaired.changes.map((hit) => `- ${hit.path}: ${hit.model} -> ${hit.canonicalModel}.`).join("\n")}`] : [];
	return {
		cfg: codexPluginRepair.cfg,
		warnings,
		changes: [
			...routeChanges,
			...repaired.runtimePolicyChanges,
			...repaired.unsupportedCompactionChanges,
			...codexPluginRepair.changes,
			...serviceTierRepair.changes
		]
	};
}
//#endregion
export { collectDisabledCodexPluginRouteIssues as a, resolveKnownModelRefMigrationTarget as i, collectCodexRuntimeCompatibilityWarnings as n, maybeRepairCodexRoutes as r, collectCodexRouteWarnings as t };
