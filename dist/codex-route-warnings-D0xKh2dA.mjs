import { a as asOptionalRecord, c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { a as normalizeFastMode, c as normalizeOptionalLowercaseString, l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { n as normalizeAgentId } from "./agent-id-GA8mwdTG.mjs";
import { r as normalizeProviderId } from "./provider-id-DCtsDflE.mjs";
import { a as resolveAgentDir } from "./agent-scope-config-IQKOEtZ4.mjs";
import "./session-key-CBvmC8zz.mjs";
import { t as AGENT_MODEL_CONFIG_KEYS } from "./configured-model-refs-ngXQhRsV.mjs";
import { a as rewriteKnownModelRefs, n as collectBlockedLegacyOpenAICodexProviderPlan } from "./legacy-config-migrations.runtime.models-BvDaSkAf.mjs";
import { _ as resolveLegacyRuntimeModelProviderAlias, h as migrateLegacyRuntimeModelRef } from "./legacy-2ovrASa7.mjs";
import { t as splitTrailingAuthProfile } from "./model-ref-profile-BIKs-96s.mjs";
import { S as isLegacyCodexProviderId, _ as resolveImplicitDefaultAgentModelRef, a as isBlockedLegacyCodexModelRef, b as toCanonicalOpenAIModelRef, c as isProviderlessModelRef, d as normalizeDefaultProviderModelRef, f as normalizeRuntimeString, g as readModelConfigPrimaryRef, h as readLegacyDefaultsRuntime, i as isBlockedLegacyCodexModelPair, m as readAgentPrimaryModelRef, n as asAgentRuntimePolicyConfig, o as isOpenAICodexAuthProfileRef, p as parseCodexRouteModelRef, r as canonicalOpenAIModelUsesCodexRuntime, s as isOpenAICodexModelRef, t as agentUsesCodexRuntimeForCompaction, u as modelRefUsesCodexRuntime, v as resolveRuntime, x as toOpenAIModelId, y as resolveRuntimeModelRef } from "./codex-route-model-ref-CXtvdgWA.mjs";
import { o as resolveAgentEffectiveModelPrimary } from "./agent-scope-CTuYDtny.mjs";
import { r as resolveModelRuntimePolicy } from "./model-runtime-policy-IbIjya7U.mjs";
import { n as isAgentRuntimeModelParam, r as resolveModelExtraParamSources } from "./model-extra-params-BJQs6MZV.mjs";
import { t as listMutableCodexRouteAgentEntries } from "./codex-route-agent-entries-BohvVKP0.mjs";
import { n as detectWindowsSpawnCommandInlineArgs } from "./windows-spawn-CR3vyrK9.mjs";
import { a as loadPersistedAuthProfileStore, s as loadPersistedSharedAuthProfileStore, u as parseLegacyCredentialEntry } from "./persisted-B486xwB_.mjs";
import { t as loadJsonFileThroughSymlink } from "./json-file-BY7NXKEu.mjs";
import { n as hasMatchingOAuthIdentity, t as areOAuthCredentialsEquivalent } from "./oauth-shared-CVbJLd-k.mjs";
import { n as getCliSessionBinding } from "./cli-session-binding-BhV_HbVa.mjs";
import { c as isValidAgentHarnessSessionStoreEntry } from "./agent-harness-session-key-CQ6tTBOH.mjs";
import { a as resolveAllAgentSessionStoreTargetsSync, s as resolveConfiguredAgentDatabaseTargets } from "./targets-Dmb8-YXN.mjs";
import { n as createRetainedAgentDatabaseMatcher } from "./agent-deletion-discovery-CV9Iu45w.mjs";
import { B as scanDoctorSessionEntriesStrict, I as iterateDoctorSessionKeyBatches, V as scanDoctorSessionEntriesTolerant } from "./session-accessor-C05KQ5A3.mjs";
import { y as applySessionEntryReplacements } from "./session-accessor.reset-b9w8ccQ2.mjs";
import { a as applyModelOverrideToSessionEntry, s as isModelSelectionLocked } from "./model-overrides-FXSJttoI.mjs";
import { i as updateLegacySessionStore, t as loadLegacySessionStore } from "./state-migrations.legacy-session-store-8RtPEokS.mjs";
import { n as resolveLegacyAuthProfilesPath } from "./doctor-auth-legacy-paths-C7z3rdwq.mjs";
import { a as collectCodexRuntimeModelPolicyRefs, c as collectStringModelConfigRef, d as recordCodexModelHit, f as rewriteModelConfigSlot, l as collectStringModelSlot, m as rewriteStringModelSlot, o as collectModelConfigRefs, p as rewriteModelsMap, s as collectModelConfigSlot, t as createRetiredModelRefRepairResolver, u as modelConfigContainsRef } from "./retired-model-ref-repair-YjdurxhR.mjs";
import fs from "node:fs";
//#region src/commands/doctor/shared/codex-route-compaction-scan.ts
const COMPACTION_OVERRIDE_KEYS = ["model", "provider"];
const LOSSLESS_CONTEXT_ENGINE_ID = "lossless-claw";
function collectUnsupportedCodexCompactionOverridesForAgent(params) {
	const agent = asOptionalRecord(params.agent);
	const compaction = asOptionalRecord(agent?.compaction);
	const inheritedCompaction = asOptionalRecord(params.inheritedCompaction);
	if (!agentUsesCodexRuntimeForCompaction({
		cfg: params.cfg,
		agent,
		agentId: params.agentId,
		currentRuntime: params.currentRuntime,
		inheritedModelRef: params.inheritedModelRef,
		env: params.env
	})) return [];
	const providerValue = compaction?.provider ?? inheritedCompaction?.provider;
	if (normalizeOptionalLowercaseString(providerValue) === "lossless-claw") return [];
	return COMPACTION_OVERRIDE_KEYS.map((key) => {
		const localValue = compaction?.[key];
		const hasLocalValue = typeof localValue === "string" && localValue.trim();
		return {
			key,
			value: hasLocalValue ? localValue : inheritedCompaction?.[key],
			path: hasLocalValue ? `${params.path}.compaction.${key}` : params.inheritedCompactionPath ? `${params.inheritedCompactionPath}.${key}` : `${params.path}.compaction.${key}`
		};
	}).flatMap(({ key, path, value }) => typeof value === "string" && value.trim() ? [{
		path,
		key,
		value: value.trim()
	}] : []);
}
function collectLegacyLosslessCompactionForAgent(params) {
	const agent = asOptionalRecord(params.agent);
	const compaction = asOptionalRecord(agent?.compaction);
	const inheritedCompaction = asOptionalRecord(params.inheritedCompaction);
	if (!agentUsesCodexRuntimeForCompaction({
		cfg: params.cfg,
		agent,
		agentId: params.agentId,
		currentRuntime: params.currentRuntime,
		inheritedModelRef: params.inheritedModelRef,
		env: params.env
	})) return [];
	const localProvider = compaction?.provider;
	const hasLocalProvider = typeof localProvider === "string" && localProvider.trim();
	const providerValue = hasLocalProvider ? localProvider : inheritedCompaction?.provider;
	if (normalizeOptionalLowercaseString(providerValue) !== "lossless-claw") return [];
	const compactionPath = hasLocalProvider ? `${params.path}.compaction` : params.inheritedCompactionPath ?? `${params.path}.compaction`;
	const localModel = compaction?.model;
	const hasLocalModel = typeof localModel === "string" && localModel.trim();
	const inheritedModel = inheritedCompaction?.model;
	const modelValue = hasLocalModel ? localModel : inheritedModel;
	const modelCompactionPath = hasLocalModel ? `${params.path}.compaction` : params.inheritedCompactionPath ?? compactionPath;
	return [{
		path: params.path,
		compactionPath,
		providerPath: `${compactionPath}.provider`,
		providerValue: String(providerValue).trim(),
		...typeof modelValue === "string" && modelValue.trim() ? {
			modelPath: `${modelCompactionPath}.model`,
			modelValue: modelValue.trim()
		} : {}
	}];
}
function collectCompactionConfigs(params, collectForAgent) {
	const defaults = params.cfg.agents?.defaults;
	const defaultsRuntime = params.ignoreLegacyAgentRuntimePins ? void 0 : readLegacyDefaultsRuntime(defaults);
	const defaultModelRef = readAgentPrimaryModelRef(defaults);
	const defaultCompaction = asOptionalRecord(defaults?.compaction);
	const hits = collectForAgent({
		cfg: params.cfg,
		agent: defaults,
		path: "agents.defaults",
		currentRuntime: resolveRuntime({ defaultsRuntime }),
		env: params.env
	});
	for (const { agent: agentRecord, agentId: id, path } of listMutableCodexRouteAgentEntries(params.cfg)) hits.push(...collectForAgent({
		cfg: params.cfg,
		agent: agentRecord,
		path,
		agentId: id,
		currentRuntime: resolveRuntime({
			agentRuntime: params.ignoreLegacyAgentRuntimePins ? void 0 : asAgentRuntimePolicyConfig(agentRecord.agentRuntime),
			defaultsRuntime
		}),
		inheritedModelRef: defaultModelRef,
		inheritedCompaction: defaultCompaction,
		inheritedCompactionPath: "agents.defaults.compaction",
		env: params.env
	}));
	return hits;
}
function collectLegacyLosslessCompactionConfigs(params) {
	return dedupeLegacyLosslessCompactionConfigs(collectCompactionConfigs(params, collectLegacyLosslessCompactionForAgent));
}
function collectUnsupportedCodexCompactionOverrides(params) {
	return dedupeUnsupportedCompactionOverrides(collectCompactionConfigs(params, collectUnsupportedCodexCompactionOverridesForAgent));
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
	const defaultsRuntime = readLegacyDefaultsRuntime(defaults);
	const inheritedModelRef = readAgentPrimaryModelRef(defaults);
	if (!agentUsesCodexRuntimeForCompaction({
		cfg: params.cfg,
		agent: defaults,
		currentRuntime: resolveRuntime({ defaultsRuntime: params.ignoreLegacyAgentRuntimePins ? void 0 : defaultsRuntime }),
		env: params.env
	})) {
		consumers.model ||= Boolean(hasDefaultModel);
		consumers.provider ||= Boolean(hasDefaultProvider);
		if ((!hasDefaultModel || consumers.model) && (!hasDefaultProvider || consumers.provider)) return consumers;
	}
	for (const { agent: agentRecord, agentId: id } of listMutableCodexRouteAgentEntries(params.cfg)) {
		const compaction = asOptionalRecord(agentRecord.compaction);
		const inheritsDefaultModel = Boolean(hasDefaultModel) && !(typeof compaction?.model === "string" && compaction.model.trim());
		const inheritsDefaultProvider = Boolean(hasDefaultProvider) && !(typeof compaction?.provider === "string" && compaction.provider.trim());
		if (!inheritsDefaultModel && !inheritsDefaultProvider) continue;
		if (!agentUsesCodexRuntimeForCompaction({
			cfg: params.cfg,
			agent: agentRecord,
			agentId: id,
			currentRuntime: resolveRuntime({
				agentRuntime: params.ignoreLegacyAgentRuntimePins ? void 0 : asAgentRuntimePolicyConfig(agentRecord.agentRuntime),
				defaultsRuntime: params.ignoreLegacyAgentRuntimePins ? void 0 : defaultsRuntime
			}),
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
	const defaultsRuntime = params.ignoreLegacyAgentRuntimePins ? void 0 : readLegacyDefaultsRuntime(defaults);
	if (!agentUsesCodexRuntimeForCompaction({
		cfg: params.cfg,
		agent: defaults,
		currentRuntime: resolveRuntime({ defaultsRuntime }),
		env: params.env
	})) return true;
	const inheritedModelRef = readAgentPrimaryModelRef(defaults);
	for (const { agent: agentRecord, agentId: id } of listMutableCodexRouteAgentEntries(params.cfg)) {
		const compaction = asOptionalRecord(agentRecord.compaction);
		const inheritsDefaultProvider = hasDefaultLosslessProvider && !(typeof compaction?.provider === "string" && compaction.provider.trim());
		const inheritsDefaultModel = Boolean(hasDefaultModel) && !(typeof compaction?.model === "string" && compaction.model.trim());
		if (!inheritsDefaultProvider && !inheritsDefaultModel) continue;
		if (!agentUsesCodexRuntimeForCompaction({
			cfg: params.cfg,
			agent: agentRecord,
			agentId: id,
			env: params.env,
			currentRuntime: resolveRuntime({
				agentRuntime: params.ignoreLegacyAgentRuntimePins ? void 0 : asAgentRuntimePolicyConfig(agentRecord.agentRuntime),
				defaultsRuntime
			}),
			inheritedModelRef
		})) return true;
	}
	return false;
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
function dedupeLegacyLosslessCompactionConfigs(hits) {
	const seen = /* @__PURE__ */ new Set();
	return hits.filter((hit) => {
		const key = `${hit.compactionPath}\0${hit.providerValue}\0${hit.modelPath ?? ""}\0${hit.modelValue ?? ""}`;
		if (seen.has(key)) return false;
		seen.add(key);
		return true;
	});
}
function dedupeUnsupportedCompactionOverrides(hits) {
	const seen = /* @__PURE__ */ new Set();
	return hits.filter((hit) => {
		const key = `${hit.path}\0${hit.key}\0${hit.value}`;
		if (seen.has(key)) return false;
		seen.add(key);
		return true;
	});
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
	const configured = normalizeRuntimeString(resolveModelRuntimePolicy({
		config: params.cfg,
		provider: parsed.provider,
		modelId: parsed.modelId,
		agentId: params.agentId
	}).policy?.id);
	if (configured) return configured;
	return canonicalOpenAIModelUsesCodexRuntime({
		cfg: params.cfg,
		modelRef: params.modelRef,
		agentId: params.agentId,
		env: params.env
	}) ? "codex" : "auto";
}
function setModelRuntimePolicy(params) {
	const models = asOptionalRecord(params.agent.models) ?? {};
	if (params.agent.models !== models) params.agent.models = models;
	const entry = asOptionalRecord(models[params.modelRef]) ?? {};
	if (models[params.modelRef] !== entry) models[params.modelRef] = entry;
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
			cfg: params.cfg,
			modelRef: params.modelRef,
			agentId,
			env: params.env
		});
		if (runtimeId === params.targetRuntimeId) continue;
		setModelRuntimePolicy({
			agent,
			agentPath: path,
			modelRef: params.modelRef,
			runtimeId,
			changes: params.changes,
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
	if (slash <= 0) return false;
	return normalizeProviderId(entryId.slice(0, slash)) === normalizeProviderId(params.provider) && entryId.slice(slash + 1).trim() === params.modelId;
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
			const runtimeId = normalizeRuntimeString(asOptionalRecord(record?.agentRuntime)?.id);
			if (runtimeId && runtimeId !== "auto" && runtimeId !== "default" && runtimeId !== "codex") return runtimeId;
		}
	}
}
function agentModelMapExactRuntimeIdForLegacyRef(params) {
	const parsed = parseCodexRouteModelRef(params.legacyModelRef);
	if (!parsed) return;
	const agentId = normalizeAgentId(params.agentId);
	const agent = agentId ? listMutableCodexRouteAgentEntries(params.cfg).find((entry) => entry.agentId === agentId)?.agent : void 0;
	const modelMaps = [asOptionalRecord(agent?.models), asOptionalRecord(params.cfg.agents?.defaults?.models)];
	for (const models of modelMaps) for (const [key, entry] of Object.entries(models ?? {})) {
		if (!modelIdMatchesProviderModelEntry({
			entryId: key,
			provider: parsed.provider,
			modelId: parsed.modelId
		})) continue;
		const runtimeId = normalizeRuntimeString(asOptionalRecord(asOptionalRecord(entry)?.agentRuntime)?.id);
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
	const runtimeId = normalizeRuntimeString(resolved.policy?.id);
	if (!runtimeId || runtimeId === "auto" || runtimeId === "default" || runtimeId === "codex") return;
	if (resolved.source === "model") {
		const providerModelRuntimeId = providerModelExplicitNonDefaultRuntimeId({
			cfg: params.cfg,
			provider: parsed.provider,
			modelId: parsed.modelId
		});
		const agentModelRuntimeId = agentModelMapExactRuntimeIdForLegacyRef({
			cfg: params.cfg,
			legacyModelRef: params.legacyModelRef,
			agentId: params.agentId
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
	if (params.isDefaults) shieldExplicitListedAgentRefsFromDefaultPolicy({
		cfg: params.cfg,
		modelRef: params.modelRef,
		targetRuntimeId,
		changes: params.changes,
		env: params.env
	});
	if (pinnedRuntimeId || legacyModelRuntimeId) return;
	if (preRepairRuntimePin) {
		if (preRepairRuntimePin.source === "provider" || preRepairRuntimePin.source === "provider-model") setModelRuntimePolicy({
			agent: params.agent,
			agentPath: params.agentPath,
			modelRef: params.modelRef,
			runtimeId: preRepairRuntimePin.runtimeId,
			changes: params.changes,
			reason: "so legacy provider runtime pins survive Codex route repair"
		});
		return;
	}
	setModelRuntimePolicy({
		agent: params.agent,
		agentPath: params.agentPath,
		modelRef: params.modelRef,
		runtimeId: "codex",
		changes: params.changes,
		reason: "so repaired OpenAI refs keep Codex auth routing"
	});
}
function rewriteStringModelSlotIfCanonicalCodexRuntime(params) {
	const value = params.container?.[params.key];
	if (typeof value !== "string") return;
	const canonicalModel = toCanonicalOpenAIModelRef(value.trim());
	if (!canonicalModel || !canonicalOpenAIModelUsesCodexRuntime({
		cfg: params.cfg,
		modelRef: canonicalModel,
		agentId: params.agentId,
		env: params.env
	})) return;
	rewriteStringModelSlot({
		hits: params.hits,
		container: params.container,
		key: params.key,
		path: params.path,
		blockedModelIdentities: params.blockedModelIdentities
	});
}
function rewriteModelConfigSlotIfCanonicalCodexRuntime(params) {
	const value = params.container?.[params.key];
	if (typeof value === "string") {
		rewriteStringModelSlotIfCanonicalCodexRuntime(params);
		return;
	}
	const record = asOptionalRecord(value);
	if (!record) return;
	rewriteStringModelSlotIfCanonicalCodexRuntime({
		...params,
		container: record,
		key: "primary",
		path: `${params.path}.primary`
	});
	const fallbacks = Array.isArray(record.fallbacks) ? record.fallbacks : void 0;
	if (!fallbacks) return;
	for (const [index, entry] of fallbacks.entries()) {
		if (typeof entry !== "string") continue;
		const canonicalModel = toCanonicalOpenAIModelRef(entry.trim());
		if (!canonicalModel || isBlockedLegacyCodexModelRef({
			modelRef: entry,
			blockedModelIdentities: params.blockedModelIdentities
		}) || !canonicalOpenAIModelUsesCodexRuntime({
			cfg: params.cfg,
			modelRef: canonicalModel,
			agentId: params.agentId,
			env: params.env
		})) continue;
		fallbacks[index] = canonicalModel;
		params.hits.push({
			path: `${params.path}.fallbacks.${index}`,
			model: entry.trim(),
			canonicalModel
		});
	}
}
function clearConfigLegacyAgentRuntimePolicies(cfg) {
	const changes = [];
	clearLegacyAgentRuntimePolicy(asOptionalRecord(cfg.agents?.defaults), "agents.defaults", changes);
	for (const { agent, path } of listMutableCodexRouteAgentEntries(cfg)) clearLegacyAgentRuntimePolicy(agent, path, changes);
	return changes;
}
function clearLegacyAgentRuntimePolicy(container, pathLabel, changes) {
	if (!container) return;
	if (asOptionalRecord(container.embeddedHarness)) {
		delete container.embeddedHarness;
		changes.push(`Removed ${pathLabel}.embeddedHarness; runtime is now provider/model scoped.`);
	}
	if (asOptionalRecord(container.agentRuntime)) {
		delete container.agentRuntime;
		changes.push(`Removed ${pathLabel}.agentRuntime; runtime is now provider/model scoped.`);
	}
}
//#endregion
//#region src/commands/doctor/shared/codex-route-compaction-repair.ts
function rewriteAgentCompactionRefs(params) {
	const compaction = asOptionalRecord(params.agent.compaction);
	const inheritedCompaction = asOptionalRecord(params.inheritedCompaction);
	if (!agentUsesCodexRuntimeForCompaction({
		cfg: params.cfg,
		agent: params.agent,
		agentId: params.agentId,
		currentRuntime: params.currentRuntime,
		inheritedModelRef: params.inheritedModelRef,
		env: params.env
	})) {
		rewriteStringModelSlotIfCanonicalCodexRuntime({
			cfg: params.cfg,
			agentId: params.agentId,
			hits: params.hits,
			container: compaction,
			key: "model",
			path: `${params.path}.compaction.model`,
			blockedModelIdentities: params.blockedModelIdentities,
			env: params.env
		});
		rewriteCompactionMemoryFlushModel(params, compaction);
		return;
	}
	const effectiveProvider = compaction?.provider ?? inheritedCompaction?.provider;
	if (normalizeOptionalLowercaseString(effectiveProvider) === "lossless-claw") rewriteLosslessCompactionModel(params, compaction, inheritedCompaction);
	else {
		removeUnsupportedCodexCompactionOverrides({
			agent: params.agent,
			compaction,
			path: params.path,
			preserve: params.preserveUnsupportedCompactionOverrides,
			preservePaths: params.preserveUnsupportedCompactionPaths,
			changes: params.unsupportedCompactionChanges
		});
		if (params.preserveUnsupportedCompactionOverrides?.model) rewriteStringModelSlot({
			hits: params.hits,
			container: compaction,
			key: "model",
			path: `${params.path}.compaction.model`,
			blockedModelIdentities: params.blockedModelIdentities
		});
	}
	rewriteCompactionMemoryFlushModel(params, compaction);
}
function rewriteLosslessCompactionModel(params, compaction, inheritedCompaction) {
	const start = params.hits.length;
	rewriteStringModelSlot({
		hits: params.hits,
		container: compaction,
		key: "model",
		path: `${params.path}.compaction.model`,
		blockedModelIdentities: params.blockedModelIdentities
	});
	preserveCodexRuntimePolicyForHits(params, start);
	const localModel = typeof compaction?.model === "string" ? compaction.model.trim() : "";
	const inheritedModelPath = params.inheritedCompactionPath ? `${params.inheritedCompactionPath}.model` : void 0;
	if (localModel || !inheritedModelPath || !params.preserveUnsupportedCompactionPaths?.has(inheritedModelPath)) return;
	const inheritedStart = params.hits.length;
	rewriteStringModelSlot({
		hits: params.hits,
		container: inheritedCompaction,
		key: "model",
		path: inheritedModelPath,
		blockedModelIdentities: params.blockedModelIdentities
	});
	const inheritedHit = params.hits[inheritedStart];
	const inheritedCanonicalModel = inheritedHit?.canonicalModel ?? params.rewrittenInheritedCompactionModels?.get(inheritedModelPath);
	if (inheritedHit) {
		params.rewrittenInheritedCompactionModels?.set(inheritedModelPath, inheritedHit.canonicalModel);
		preserveCodexRuntimePolicyForHits(params, inheritedStart);
	} else if (inheritedCanonicalModel) ensureCodexRuntimePolicy({
		cfg: params.cfg,
		agent: params.agent,
		agentPath: params.path,
		agentId: params.agentId,
		modelRef: inheritedCanonicalModel,
		isDefaults: params.path === "agents.defaults",
		preRepairCfg: params.preRepairCfg,
		changes: params.runtimePolicyChanges,
		env: params.env
	});
}
function preserveCodexRuntimePolicyForHits(params, fromIndex) {
	for (const hit of params.hits.slice(fromIndex)) ensureCodexRuntimePolicy({
		cfg: params.cfg,
		agent: params.agent,
		agentPath: params.path,
		agentId: params.agentId,
		modelRef: hit.canonicalModel,
		legacyModelRef: hit.model,
		isDefaults: params.path === "agents.defaults",
		preRepairCfg: params.preRepairCfg,
		changes: params.runtimePolicyChanges,
		env: params.env
	});
}
function rewriteCompactionMemoryFlushModel(params, compaction) {
	rewriteStringModelSlotIfCanonicalCodexRuntime({
		cfg: params.cfg,
		agentId: params.agentId,
		hits: params.hits,
		container: asOptionalRecord(compaction?.memoryFlush),
		key: "model",
		path: `${params.path}.compaction.memoryFlush.model`,
		blockedModelIdentities: params.blockedModelIdentities,
		env: params.env
	});
}
function removeUnsupportedCodexCompactionOverrides(params) {
	if (!params.compaction) return;
	if (normalizeOptionalLowercaseString(params.compaction.provider) === "lossless-claw") return;
	for (const key of COMPACTION_OVERRIDE_KEYS) {
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
	const plugins = ensureMutablePath(root, ["plugins"]);
	const slots = ensureMutablePath(plugins, ["slots"]);
	const entries = ensureMutablePath(plugins, ["entries"]);
	const entry = asOptionalRecord(entries["lossless-claw"]) ?? {};
	if (entries["lossless-claw"] !== entry) entries[LOSSLESS_CONTEXT_ENGINE_ID] = entry;
	const config = ensureMutablePath(entry, ["config"]);
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
		cfg: params.cfg,
		hits,
		summaryModel,
		changes,
		env: params.env
	});
	for (const hit of hits) {
		removeMigratedLosslessCompactionKey({
			cfg: params.cfg,
			path: hit.providerPath,
			key: "provider",
			changes,
			changeMessage: `Removed ${hit.providerPath}; Lossless now runs through plugins.slots.contextEngine.`
		});
		if (hit.modelPath) removeMigratedLosslessCompactionKey({
			cfg: params.cfg,
			path: hit.modelPath,
			key: "model",
			changes,
			changeMessage: `Removed ${hit.modelPath} after migrating the Lossless summary model.`
		});
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
			cfg: params.cfg,
			agent: owner,
			agentPath: ownerPath,
			agentId: agentIdFromAgentPath(ownerPath),
			modelRef: params.summaryModel,
			isDefaults: ownerPath === "agents.defaults",
			changes: params.changes,
			env: params.env
		});
	}
}
function ensureLosslessLlmPolicy(params) {
	if (!params.summaryModel) return;
	const llm = ensureMutablePath(params.entry, ["llm"]);
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
function removeMigratedLosslessCompactionKey(params) {
	const owner = readCompactionOwnerForPath(params.cfg, readCompactionOwnerPathForKeyPath(params.path));
	const compaction = asOptionalRecord(owner?.compaction);
	if (!owner || !compaction) return;
	const value = compaction[params.key];
	if (typeof value !== "string" || !value.trim()) return;
	delete compaction[params.key];
	params.changes.push(params.changeMessage);
	if (Object.keys(compaction).length === 0) delete owner.compaction;
}
function readCompactionOwnerForPath(cfg, ownerPath) {
	if (ownerPath === "agents.defaults") return asOptionalRecord(cfg.agents?.defaults);
	if (!ownerPath.startsWith("agents.list.")) return readMutablePath(cfg, ownerPath);
	const label = ownerPath.slice(12);
	const agents = Array.isArray(cfg.agents?.list) ? cfg.agents.list : [];
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
function ensureMutablePath(root, path) {
	let cursor = root;
	for (const part of path) {
		const next = asOptionalRecord(cursor[part]) ?? {};
		if (cursor[part] !== next) cursor[part] = next;
		cursor = next;
	}
	return cursor;
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
	const preserveCodexRuntimePolicyForNewHits = (fromIndex) => {
		for (const hit of params.hits.slice(fromIndex)) ensureCodexRuntimePolicy({
			cfg: params.cfg,
			agent: params.agent,
			agentPath: params.path,
			agentId: params.agentId,
			modelRef: hit.canonicalModel,
			legacyModelRef: hit.model,
			isDefaults: params.path === "agents.defaults",
			preRepairCfg: params.preRepairCfg,
			changes: params.runtimePolicyChanges,
			env: params.env
		});
	};
	for (const key of AGENT_MODEL_CONFIG_KEYS) {
		const start = params.hits.length;
		if (key === "model") {
			rewriteModelConfigSlot({
				hits: params.hits,
				container: params.agent,
				key,
				path: `${params.path}.${key}`,
				runtime: params.currentRuntime,
				blockedModelIdentities: params.blockedModelIdentities
			});
			preserveCodexRuntimePolicyForNewHits(start);
		} else rewriteModelConfigSlotIfCanonicalCodexRuntime({
			cfg: params.cfg,
			agentId: params.agentId,
			hits: params.hits,
			container: params.agent,
			key,
			path: `${params.path}.${key}`,
			blockedModelIdentities: params.blockedModelIdentities,
			env: params.env
		});
	}
	rewriteStringModelSlotIfCanonicalCodexRuntime({
		cfg: params.cfg,
		agentId: params.agentId,
		hits: params.hits,
		container: asOptionalRecord(params.agent.heartbeat),
		key: "model",
		path: `${params.path}.heartbeat.model`,
		blockedModelIdentities: params.blockedModelIdentities,
		env: params.env
	});
	rewriteModelConfigSlotIfCanonicalCodexRuntime({
		cfg: params.cfg,
		agentId: params.agentId,
		hits: params.hits,
		container: asOptionalRecord(params.agent.subagents),
		key: "model",
		path: `${params.path}.subagents.model`,
		blockedModelIdentities: params.blockedModelIdentities,
		env: params.env
	});
	rewriteAgentCompactionRefs({
		cfg: params.cfg,
		preRepairCfg: params.preRepairCfg,
		hits: params.hits,
		agent: params.agent,
		path: params.path,
		agentId: params.agentId,
		currentRuntime: params.currentRuntime,
		inheritedModelRef: params.inheritedModelRef,
		inheritedCompaction: params.inheritedCompaction,
		inheritedCompactionPath: params.inheritedCompactionPath,
		preserveUnsupportedCompactionOverrides: params.preserveUnsupportedCompactionOverrides,
		preserveUnsupportedCompactionPaths: params.preserveUnsupportedCompactionPaths,
		rewrittenInheritedCompactionModels: params.rewrittenInheritedCompactionModels,
		runtimePolicyChanges: params.runtimePolicyChanges,
		unsupportedCompactionChanges: params.unsupportedCompactionChanges,
		blockedModelIdentities: params.blockedModelIdentities,
		env: params.env
	});
	const mediaModels = asOptionalRecord(params.agent.mediaModels);
	for (const key of [
		"image",
		"video",
		"music"
	]) rewriteModelConfigSlot({
		hits: params.hits,
		container: mediaModels ?? {},
		key,
		path: `${params.path}.mediaModels.${key}`,
		blockedModelIdentities: params.blockedModelIdentities
	});
	const modelPolicyStart = params.hits.length;
	rewriteModelPolicyAllowRefs({
		hits: params.hits,
		agent: params.agent,
		path: params.path,
		blockedModelIdentities: params.blockedModelIdentities
	});
	preserveCodexRuntimePolicyForNewHits(modelPolicyStart);
	if (params.rewriteModelsMap) {
		const start = params.hits.length;
		rewriteModelsMap({
			hits: params.hits,
			models: asOptionalRecord(params.agent.models),
			path: `${params.path}.models`,
			blockedModelIdentities: params.blockedModelIdentities
		});
		preserveCodexRuntimePolicyForNewHits(start);
	}
}
function rewriteConfigModelRefsWithCompactionPolicy(params) {
	const nextConfig = structuredClone(params.cfg);
	const hits = [];
	const runtimePolicyChanges = [];
	const unsupportedCompactionChanges = [];
	const ignoreLegacyAgentRuntimePins = params.ignoreLegacyAgentRuntimePins ?? configRepairWouldClearLegacyRuntimePins({
		cfg: nextConfig,
		blockedModelIdentities: params.blockedModelIdentities,
		env: params.env
	});
	unsupportedCompactionChanges.push(...maybeMigrateLegacyLosslessCompactionConfig({
		cfg: nextConfig,
		ignoreLegacyAgentRuntimePins,
		env: params.env
	}));
	const preservedLegacyLosslessCompactionPaths = new Set(collectLegacyLosslessCompactionConfigs({
		cfg: nextConfig,
		ignoreLegacyAgentRuntimePins,
		env: params.env
	}).flatMap((hit) => hit.modelPath ? [hit.providerPath, hit.modelPath] : [hit.providerPath]));
	const defaultsRuntime = ignoreLegacyAgentRuntimePins ? void 0 : readLegacyDefaultsRuntime(nextConfig.agents?.defaults);
	const rewrittenInheritedCompactionModels = /* @__PURE__ */ new Map();
	rewriteAgentModelRefs({
		cfg: nextConfig,
		preRepairCfg: params.cfg,
		hits,
		agent: asOptionalRecord(nextConfig.agents?.defaults),
		path: "agents.defaults",
		currentRuntime: resolveRuntime({ defaultsRuntime }),
		rewriteModelsMap: true,
		preserveUnsupportedCompactionOverrides: params.preserveSharedDefaultCompactionOverrides,
		preserveUnsupportedCompactionPaths: preservedLegacyLosslessCompactionPaths,
		rewrittenInheritedCompactionModels,
		runtimePolicyChanges,
		unsupportedCompactionChanges,
		blockedModelIdentities: params.blockedModelIdentities,
		env: params.env
	});
	const inheritedModelRef = readAgentPrimaryModelRef(nextConfig.agents?.defaults);
	const agents = listMutableCodexRouteAgentEntries(nextConfig);
	for (const { agent: agentRecord, agentId, path } of agents) rewriteAgentModelRefs({
		cfg: nextConfig,
		preRepairCfg: params.cfg,
		hits,
		agent: agentRecord,
		path,
		agentId,
		currentRuntime: resolveRuntime({
			agentRuntime: ignoreLegacyAgentRuntimePins ? void 0 : asAgentRuntimePolicyConfig(agentRecord.agentRuntime),
			defaultsRuntime
		}),
		inheritedModelRef,
		inheritedCompaction: nextConfig.agents?.defaults?.compaction,
		inheritedCompactionPath: "agents.defaults.compaction",
		rewriteModelsMap: true,
		preserveUnsupportedCompactionPaths: preservedLegacyLosslessCompactionPaths,
		rewrittenInheritedCompactionModels,
		runtimePolicyChanges,
		unsupportedCompactionChanges,
		blockedModelIdentities: params.blockedModelIdentities,
		env: params.env
	});
	rewriteNonAgentModelRefs({
		cfg: nextConfig,
		hits,
		blockedModelIdentities: params.blockedModelIdentities,
		env: params.env
	});
	const runtimePinChanges = !params.blockedModelIdentities?.size && hits.some((hit) => !isCompactionOnlyRouteHit(hit)) ? clearConfigLegacyAgentRuntimePolicies(nextConfig) : [];
	return {
		cfg: hits.length > 0 || runtimePolicyChanges.length > 0 || runtimePinChanges.length > 0 || unsupportedCompactionChanges.length > 0 ? nextConfig : params.cfg,
		changes: hits,
		runtimePinChanges,
		runtimePolicyChanges,
		unsupportedCompactionChanges
	};
}
function rewriteNonAgentModelRefs(params) {
	const channelsModelByChannel = asOptionalRecord(params.cfg.channels?.modelByChannel);
	for (const [channelId, channelMap] of Object.entries(channelsModelByChannel ?? {})) {
		const targets = asOptionalRecord(channelMap);
		if (!targets) continue;
		for (const targetId of Object.keys(targets)) rewriteStringModelSlotIfCanonicalCodexRuntime({
			cfg: params.cfg,
			hits: params.hits,
			container: targets,
			key: targetId,
			path: `channels.modelByChannel.${channelId}.${targetId}`,
			blockedModelIdentities: params.blockedModelIdentities,
			env: params.env
		});
	}
	for (const [index, mapping] of (params.cfg.hooks?.mappings ?? []).entries()) rewriteStringModelSlotIfCanonicalCodexRuntime({
		cfg: params.cfg,
		hits: params.hits,
		container: mapping,
		key: "model",
		path: `hooks.mappings.${index}.model`,
		blockedModelIdentities: params.blockedModelIdentities,
		env: params.env
	});
	rewriteStringModelSlotIfCanonicalCodexRuntime({
		cfg: params.cfg,
		hits: params.hits,
		container: asOptionalRecord(params.cfg.hooks?.gmail),
		key: "model",
		path: "hooks.gmail.model",
		blockedModelIdentities: params.blockedModelIdentities,
		env: params.env
	});
	rewriteStringModelSlotIfCanonicalCodexRuntime({
		cfg: params.cfg,
		hits: params.hits,
		container: asOptionalRecord(params.cfg.tts),
		key: "summaryModel",
		path: "tts.summaryModel",
		blockedModelIdentities: params.blockedModelIdentities,
		env: params.env
	});
	rewriteStringModelSlotIfCanonicalCodexRuntime({
		cfg: params.cfg,
		hits: params.hits,
		container: asOptionalRecord(asOptionalRecord(params.cfg.channels?.discord)?.voice),
		key: "model",
		path: "channels.discord.voice.model",
		blockedModelIdentities: params.blockedModelIdentities,
		env: params.env
	});
}
function configRepairWouldClearLegacyRuntimePins(params) {
	return rewriteConfigModelRefsWithCompactionPolicy({
		cfg: params.cfg,
		preserveSharedDefaultCompactionOverrides: {
			model: true,
			provider: true
		},
		ignoreLegacyAgentRuntimePins: false,
		blockedModelIdentities: params.blockedModelIdentities,
		env: params.env
	}).runtimePinChanges.length > 0;
}
function rewriteConfigModelRefs(params) {
	const preserveSharedDefaultCompactionOverrides = getSharedDefaultCompactionOverrideConsumers({
		cfg: params.cfg,
		ignoreLegacyAgentRuntimePins: configRepairWouldClearLegacyRuntimePins(params),
		env: params.env
	});
	return rewriteConfigModelRefsWithCompactionPolicy({
		cfg: params.cfg,
		preserveSharedDefaultCompactionOverrides,
		blockedModelIdentities: params.blockedModelIdentities,
		env: params.env
	});
}
function isCompactionOnlyRouteHit(hit) {
	return hit.path.startsWith("agents.") && (hit.path.endsWith(".compaction.model") || hit.path.endsWith(".compaction.memoryFlush.model"));
}
//#endregion
//#region src/commands/doctor/shared/codex-route-config-scan.ts
function collectModelsMapRefs(params) {
	const record = asOptionalRecord(params.models);
	if (!record) return;
	for (const modelRef of Object.keys(record)) {
		if (!isOpenAICodexModelRef(modelRef)) continue;
		recordCodexModelHit({
			hits: params.hits,
			path: `${params.path}.${modelRef}`,
			model: modelRef,
			blockedModelIdentities: params.blockedModelIdentities
		});
	}
}
function collectModelPolicyAllowRefs(params) {
	const allow = asOptionalRecord(params.modelPolicy)?.allow;
	if (!Array.isArray(allow)) return;
	for (const [index, modelRef] of allow.entries()) collectStringModelSlot({
		hits: params.hits,
		path: `${params.path}.allow.${index}`,
		value: modelRef,
		blockedModelIdentities: params.blockedModelIdentities
	});
}
function collectAgentModelRefs(params) {
	const agent = asOptionalRecord(params.agent);
	if (!agent) return;
	for (const key of AGENT_MODEL_CONFIG_KEYS) collectModelConfigSlot({
		hits: params.hits,
		path: `${params.path}.${key}`,
		value: agent[key],
		runtime: key === "model" ? params.runtime : void 0,
		blockedModelIdentities: params.blockedModelIdentities
	});
	const mediaModels = asOptionalRecord(agent.mediaModels);
	for (const key of [
		"image",
		"video",
		"music"
	]) collectModelConfigSlot({
		hits: params.hits,
		path: `${params.path}.mediaModels.${key}`,
		value: mediaModels?.[key],
		blockedModelIdentities: params.blockedModelIdentities
	});
	collectStringModelSlot({
		hits: params.hits,
		path: `${params.path}.heartbeat.model`,
		value: asOptionalRecord(agent.heartbeat)?.model,
		blockedModelIdentities: params.blockedModelIdentities
	});
	collectModelConfigSlot({
		hits: params.hits,
		path: `${params.path}.subagents.model`,
		value: asOptionalRecord(agent.subagents)?.model,
		blockedModelIdentities: params.blockedModelIdentities
	});
	const compaction = asOptionalRecord(agent.compaction);
	collectStringModelSlot({
		hits: params.hits,
		path: `${params.path}.compaction.model`,
		value: compaction?.model,
		blockedModelIdentities: params.blockedModelIdentities
	});
	collectStringModelSlot({
		hits: params.hits,
		path: `${params.path}.compaction.memoryFlush.model`,
		value: asOptionalRecord(compaction?.memoryFlush)?.model,
		blockedModelIdentities: params.blockedModelIdentities
	});
	collectModelsMapRefs({
		hits: params.hits,
		path: `${params.path}.models`,
		models: agent.models,
		blockedModelIdentities: params.blockedModelIdentities
	});
	collectModelPolicyAllowRefs({
		hits: params.hits,
		path: `${params.path}.modelPolicy`,
		modelPolicy: agent.modelPolicy,
		blockedModelIdentities: params.blockedModelIdentities
	});
}
function collectConfigModelRefs(cfg, blockedModelIdentities) {
	const hits = [];
	const defaults = cfg.agents?.defaults;
	const defaultsRuntime = readLegacyDefaultsRuntime(defaults);
	collectAgentModelRefs({
		hits,
		agent: defaults,
		path: "agents.defaults",
		runtime: resolveRuntime({ defaultsRuntime }),
		blockedModelIdentities
	});
	const agents = listMutableCodexRouteAgentEntries(cfg);
	for (const { agent: agentRecord, path } of agents) collectAgentModelRefs({
		hits,
		agent: agentRecord,
		path,
		runtime: resolveRuntime({
			agentRuntime: asAgentRuntimePolicyConfig(agentRecord.agentRuntime),
			defaultsRuntime
		}),
		blockedModelIdentities
	});
	const channelsModelByChannel = asOptionalRecord(cfg.channels?.modelByChannel);
	for (const [channelId, channelMap] of Object.entries(channelsModelByChannel ?? {})) {
		const targets = asOptionalRecord(channelMap);
		if (!targets) continue;
		for (const [targetId, model] of Object.entries(targets)) collectStringModelSlot({
			hits,
			path: `channels.modelByChannel.${channelId}.${targetId}`,
			value: model,
			blockedModelIdentities
		});
	}
	for (const [index, mapping] of (cfg.hooks?.mappings ?? []).entries()) collectStringModelSlot({
		hits,
		path: `hooks.mappings.${index}.model`,
		value: mapping.model,
		blockedModelIdentities
	});
	collectStringModelSlot({
		hits,
		path: "hooks.gmail.model",
		value: cfg.hooks?.gmail?.model,
		blockedModelIdentities
	});
	collectStringModelSlot({
		hits,
		path: "tts.summaryModel",
		value: cfg.tts?.summaryModel,
		blockedModelIdentities
	});
	collectStringModelSlot({
		hits,
		path: "channels.discord.voice.model",
		value: asOptionalRecord(asOptionalRecord(cfg.channels?.discord)?.voice)?.model,
		blockedModelIdentities
	});
	return hits;
}
function collectDisabledCodexPluginRouteHits(cfg, env) {
	if (!isCodexPluginUnavailableByConfig(cfg)) return [];
	return collectCodexRuntimeRouteHits(cfg, env);
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
	const plugins = asOptionalRecord(cfg.plugins) ?? {};
	if (cfg.plugins !== plugins) cfg.plugins = plugins;
	const entries = asOptionalRecord(plugins.entries) ?? {};
	if (plugins.entries !== entries) plugins.entries = entries;
	const codexEntry = asOptionalRecord(entries.codex) ?? {};
	const changes = [];
	if (codexEntry.enabled !== true) {
		entries.codex = {
			...codexEntry,
			enabled: true
		};
		changes.push("Enabled plugins.entries.codex because configured agent routes use Codex runtime.");
	} else if (entries.codex !== codexEntry) entries.codex = codexEntry;
	if (Array.isArray(plugins.allow) && plugins.allow.length > 0 && !plugins.allow.some((id) => normalizeOptionalLowercaseString(id) === "codex")) {
		plugins.allow = [...plugins.allow, "codex"];
		changes.push("Added codex to plugins.allow because configured agent routes use Codex runtime.");
	}
	return {
		cfg,
		changes
	};
}
function codexPluginIsBlockedOutsideEntry(cfg) {
	return cfg.plugins?.enabled === false || pluginIdListIncludes(cfg.plugins?.deny, "codex");
}
function codexPluginRepairIsBlocked(cfg) {
	return codexPluginIsBlockedOutsideEntry(cfg) || asOptionalRecord(asOptionalRecord(cfg.plugins?.entries)?.codex)?.enabled === false;
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
	const channelsModelByChannel = asOptionalRecord(cfg.channels?.modelByChannel);
	for (const [channelId, channelMapValue] of Object.entries(channelsModelByChannel ?? {})) {
		const channelMap = asOptionalRecord(channelMapValue);
		if (!channelMap) continue;
		for (const [targetId, modelRef] of Object.entries(channelMap)) collectStringModelConfigRef({
			refs,
			path: `channels.modelByChannel.${channelId}.${targetId}`,
			value: modelRef
		});
	}
	return refs;
}
//#endregion
//#region src/commands/doctor/shared/retired-session-model-repair.ts
/** Session selection owns invalidation of context/fallback metadata and profile preservation. */
function repairRetiredSessionModelRef(entry, agentId, resolve, defaultModelRef, warnings) {
	if (!entry.modelOverride || isModelSelectionLocked(entry)) return false;
	const decision = resolve({
		modelRef: entry.providerOverride ? `${entry.providerOverride}/${entry.modelOverride}` : entry.modelOverride,
		agentId,
		authProfileId: entry.authProfileOverride,
		authProfileSource: entry.authProfileOverrideSource
	});
	if (decision.kind === "unchanged") return false;
	const replacement = splitTrailingAuthProfile(decision.kind === "replace" ? decision.modelRef : defaultModelRef ?? "").model;
	if (decision.kind === "clear" && replacement === decision.modelRef && entry.authProfileOverride && (entry.authProfileOverrideSource === "user" || entry.authProfileOverrideSource === "user-link")) {
		const warning = `Retained retired ${decision.modelRef} for agent "${agentId}": clearing this session override would still select it with the same pinned account. Choose a supported default or an allowed model override, then rerun openclaw doctor --fix.`;
		if (!warnings.includes(warning)) warnings.push(warning);
		return false;
	}
	const slash = replacement.indexOf("/");
	return applyModelOverrideToSessionEntry({
		entry,
		selection: {
			provider: replacement.slice(0, slash),
			model: replacement.slice(slash + 1),
			isDefault: decision.kind === "clear"
		},
		preserveAuthProfileOverride: decision.kind === "replace" || replacement.slice(0, slash) === decision.provider,
		selectionSource: entry.modelOverrideSource === "auto" ? "auto" : "user"
	}).updated;
}
//#endregion
//#region src/commands/doctor/shared/codex-route-session-repair.ts
function rewriteSessionModelPair(params) {
	const provider = normalizeOptionalLowercaseString(params.entry[params.providerKey]);
	const model = typeof params.entry[params.modelKey] === "string" ? params.entry[params.modelKey] : void 0;
	const legacyProviderModelRef = sessionProviderAllowsScopedModelRef(provider) && isOpenAICodexModelRef(model) ? model : void 0;
	if (isBlockedLegacyCodexModelPair({
		providerId: provider,
		modelId: model,
		blockedModelIdentities: params.blockedModelIdentities
	}) || (legacyProviderModelRef ? isBlockedLegacyCodexModelRef({
		modelRef: legacyProviderModelRef,
		blockedModelIdentities: params.blockedModelIdentities
	}) : false)) return { changed: false };
	if (isLegacyCodexProviderId(provider)) {
		params.entry[params.providerKey] = "openai";
		if (model) {
			const modelId = toOpenAIModelId(model);
			if (modelId) params.entry[params.modelKey] = modelId;
		}
		return {
			changed: true,
			runtime: "codex"
		};
	}
	const canonicalModel = legacyProviderModelRef && toCanonicalOpenAIModelRef(legacyProviderModelRef);
	if (canonicalModel) {
		params.entry[params.modelKey] = canonicalModel;
		return {
			changed: true,
			runtime: "codex"
		};
	}
	const scopedRuntimeRef = model && (!provider || ["claude-cli", "google-gemini-cli"].includes(provider)) ? migrateLegacyRuntimeModelRef(model) : null;
	const rawRef = scopedRuntimeRef ? model : provider && model ? `${provider}/${model}` : model;
	const migrated = scopedRuntimeRef ?? (rawRef ? migrateLegacyRuntimeModelRef(rawRef) : null);
	if (!migrated || rawRef && isBlockedLegacyCodexModelRef({
		modelRef: rawRef,
		blockedModelIdentities: params.blockedModelIdentities
	})) return { changed: false };
	let changed = false;
	if (params.entry[params.providerKey] !== migrated.provider) {
		params.entry[params.providerKey] = migrated.provider;
		changed = true;
	}
	if (params.entry[params.modelKey] !== migrated.model) {
		params.entry[params.modelKey] = migrated.model;
		changed = true;
	}
	return {
		changed,
		runtime: migrated.runtime
	};
}
function isCodexSessionRoute(entry) {
	return isLegacyCodexProviderId(entry.modelProvider) || isLegacyCodexProviderId(entry.providerOverride) || sessionProviderAllowsScopedModelRef(normalizeOptionalLowercaseString(entry.modelProvider)) && isOpenAICodexModelRef(entry.model) || sessionProviderAllowsScopedModelRef(normalizeOptionalLowercaseString(entry.providerOverride)) && isOpenAICodexModelRef(entry.modelOverride) || normalizeRuntimeString(entry.agentRuntimeOverride) === "codex";
}
function normalizeCodexSessionHarness(entry, legacyCodexHarness, wasCodexRoute) {
	if (!legacyCodexHarness && !wasCodexRoute && !isCodexSessionRoute(entry)) return false;
	let changed = false;
	if (normalizeRuntimeString(entry.agentHarnessId) === "codex-cli" || legacyCodexHarness && entry.agentHarnessId === void 0) {
		entry.agentHarnessId = "codex";
		changed = true;
	}
	if (normalizeRuntimeString(entry.agentRuntimeOverride) === "codex-cli") {
		entry.agentRuntimeOverride = "codex";
		changed = true;
	}
	return changed;
}
function sessionProviderAllowsScopedModelRef(provider) {
	return !provider || isLegacyCodexProviderId(provider);
}
function clearStaleCodexFallbackNotice(entry, blockedModelIdentities) {
	const endpoints = [entry.fallbackNotice?.selectedModel, entry.fallbackNotice?.activeModel];
	if (endpoints.some((modelRef) => isOpenAICodexModelRef(modelRef) && isBlockedLegacyCodexModelRef({
		modelRef,
		blockedModelIdentities
	})) || !endpoints.some(isOpenAICodexModelRef)) return false;
	delete entry.fallbackNotice;
	return true;
}
function clearRepairedCodexSessionHarness(entry) {
	const harnessId = entry.agentHarnessId;
	if (harnessId === void 0 || normalizeRuntimeString(harnessId) === "openclaw") return false;
	delete entry.agentHarnessId;
	return true;
}
function repairProviderlessCodexSessionOverride(entry, blockedModelIdentities) {
	if (!isProviderlessModelRef(entry.modelOverride) || !isOpenAICodexAuthProfileRef(entry.authProfileOverride) || entry.authProfileOverrideSource !== "auto" || entry.modelOverrideSource !== "auto" || normalizeOptionalLowercaseString(entry.providerOverride)) return false;
	const authProvider = normalizeOptionalLowercaseString(entry.authProfileOverride)?.split(":", 1)[0];
	if (isBlockedLegacyCodexModelPair({
		providerId: authProvider,
		modelId: entry.modelOverride,
		blockedModelIdentities
	})) return false;
	entry.providerOverride = "openai";
	entry.modelOverrideRouteResolution = "resolved";
	if (entry.model !== void 0 || entry.modelProvider !== void 0) {
		delete entry.model;
		delete entry.modelProvider;
	}
	if (entry.contextTokens !== void 0 || entry.contextTokensSource !== void 0) {
		delete entry.contextTokens;
		delete entry.contextTokensSource;
	}
	if (entry.contextBudgetStatus !== void 0) delete entry.contextBudgetStatus;
	return true;
}
function migrateLegacyClaudeSessionField(entry, sessionKey, warnings) {
	if (entry.claudeCliSessionId === void 0) return false;
	if (!getCliSessionBinding(entry, "claude-cli")) {
		const sessionId = normalizeOptionalString(entry.claudeCliSessionId);
		const hasUnboundMetadata = Object.entries(entry.cliSessionBindings?.["claude-cli"] ?? {}).some(([key, value]) => key !== "sessionId" && value !== void 0);
		if (!sessionId || hasUnboundMetadata) {
			const warning = `Session ${sessionKey}: legacy Claude CLI binding needs manual reconciliation; legacy binding state was preserved.`;
			if (warnings && !warnings.includes(warning)) warnings.push(warning);
			return false;
		}
		entry.cliSessionBindings = {
			...entry.cliSessionBindings,
			"claude-cli": { sessionId }
		};
	}
	delete entry.claudeCliSessionId;
	return true;
}
function repairSessionAuthProfileReferences(entry, profileIdMap) {
	let changed = false;
	const replacement = typeof entry.authProfileOverride === "string" ? profileIdMap?.get(entry.authProfileOverride.trim()) : void 0;
	if (replacement !== void 0 && replacement !== entry.authProfileOverride) {
		entry.authProfileOverride = replacement;
		changed = true;
	}
	const fallback = entry.modelFallback;
	const previousReplacement = typeof fallback?.prevAuthProfileOverride === "string" ? profileIdMap?.get(fallback.prevAuthProfileOverride.trim()) : void 0;
	if (fallback && previousReplacement !== void 0 && previousReplacement !== fallback.prevAuthProfileOverride) {
		fallback.prevAuthProfileOverride = previousReplacement;
		changed = true;
	}
	return changed;
}
/** Complete account renames or repair legacy session bindings and model routes. */
function repairCodexSessionStoreRoutes(params) {
	const now = params.now ?? Date.now();
	const sessionKeys = [];
	for (const [sessionKey, entry] of Object.entries(params.store)) {
		if (!entry) continue;
		if (params.authProfileOnly) {
			if (!isValidAgentHarnessSessionStoreEntry(sessionKey, entry) && repairSessionAuthProfileReferences(entry, params.authProfileIdMap)) {
				entry.updatedAt = now;
				sessionKeys.push(sessionKey);
			}
			continue;
		}
		const changedCliBinding = migrateLegacyClaudeSessionField(entry, sessionKey, params.warnings);
		if (isValidAgentHarnessSessionStoreEntry(sessionKey, entry)) {
			if (changedCliBinding) sessionKeys.push(sessionKey);
			continue;
		}
		const legacyCodexHarness = normalizeRuntimeString(entry.agentHarnessId) === "codex-cli";
		const wasCodexRoute = isCodexSessionRoute(entry);
		const hasSelectedOverride = Boolean(entry.modelOverride?.trim());
		const runtimeWasExplicit = entry.agentRuntimeOverride !== void 0 && normalizeRuntimeString(entry.agentRuntimeOverride) !== "auto";
		const runtimeModelRoute = rewriteSessionModelPair({
			entry,
			providerKey: "modelProvider",
			modelKey: "model",
			blockedModelIdentities: params.blockedModelIdentities
		});
		const overrideModelRoute = rewriteSessionModelPair({
			entry,
			providerKey: "providerOverride",
			modelKey: "modelOverride",
			blockedModelIdentities: params.blockedModelIdentities
		});
		if (overrideModelRoute.changed) entry.modelOverrideRouteResolution = "resolved";
		const changedProviderlessOverride = repairProviderlessCodexSessionOverride(entry, params.blockedModelIdentities);
		const changedModelRoute = runtimeModelRoute.changed || overrideModelRoute.changed || changedProviderlessOverride;
		const changedFallbackNotice = clearStaleCodexFallbackNotice(entry, params.blockedModelIdentities);
		const selectedRuntime = changedProviderlessOverride ? "codex" : hasSelectedOverride ? overrideModelRoute.runtime : runtimeModelRoute.runtime;
		const changedRuntimePins = !runtimeWasExplicit && selectedRuntime !== void 0 && entry.agentRuntimeOverride !== selectedRuntime;
		if (changedRuntimePins) entry.agentRuntimeOverride = selectedRuntime;
		const changedCodexRuntimeHarness = selectedRuntime === "codex" ? clearRepairedCodexSessionHarness(entry) : false;
		const changedCodexHarness = normalizeCodexSessionHarness(entry, legacyCodexHarness, wasCodexRoute);
		const changedAuthProfile = repairSessionAuthProfileReferences(entry, params.authProfileIdMap);
		const changedRetiredModel = params.retirement ? repairRetiredSessionModelRef(entry, params.retirement.agentId, params.retirement.resolve, params.retirement.defaultModelRef, params.retirement.warnings) : false;
		if (!changedModelRoute && !changedFallbackNotice && !changedRuntimePins && !changedCodexRuntimeHarness && !changedCodexHarness && !changedAuthProfile && !changedRetiredModel && !changedCliBinding) continue;
		entry.updatedAt = now;
		sessionKeys.push(sessionKey);
	}
	return {
		changed: sessionKeys.length > 0,
		sessionKeys
	};
}
if (process.env.VITEST || false) globalThis[Symbol.for("openclaw.codexRouteSessionRepairTestApi")] = { repairCodexSessionStoreRoutes };
function scanCodexSessionStoreRoutes(store, blockedModelIdentities, authProfileIdMap, retirement, warnings, authProfileOnly = false) {
	return repairCodexSessionStoreRoutes({
		store: structuredClone(store),
		blockedModelIdentities,
		authProfileIdMap,
		authProfileOnly,
		retirement,
		warnings
	}).sessionKeys;
}
function resolveVerifiedSessionAuthProfileIdMap(params) {
	if (!params.authProfileIdMap || params.authProfileIdMap.size === 0) return params.authProfileIdMap;
	const agentDir = resolveAgentDir(params.cfg, params.agentId, params.env);
	const localProfiles = loadPersistedAuthProfileStore(agentDir)?.profiles ?? {};
	const mainProfiles = loadPersistedSharedAuthProfileStore(params.env)?.profiles ?? {};
	const localLegacyAuthPath = resolveLegacyAuthProfilesPath(agentDir);
	const localLegacySourceExists = fs.existsSync(localLegacyAuthPath);
	const localLegacySource = localLegacySourceExists ? loadJsonFileThroughSymlink(localLegacyAuthPath) : null;
	const localLegacyProfiles = isRecord(localLegacySource) && isRecord(localLegacySource.profiles) ? localLegacySource.profiles : void 0;
	return new Map([...params.authProfileIdMap].filter(([legacyProfileId, canonicalProfileId]) => {
		const separator = legacyProfileId.indexOf(":");
		if (separator < 0) return false;
		const legacyProvider = legacyProfileId.slice(0, separator);
		const provider = isLegacyCodexProviderId(legacyProvider) || legacyProfileId === "openai:codex-cli" ? "openai" : resolveLegacyRuntimeModelProviderAlias(legacyProvider)?.provider;
		if (!provider) return false;
		const localCredential = localProfiles[canonicalProfileId];
		if (localCredential) return normalizeOptionalLowercaseString(localCredential.provider) === provider;
		const inheritedCredential = mainProfiles[canonicalProfileId];
		if (localLegacySourceExists) {
			if (!localLegacyProfiles) return false;
			const legacyCredential = localLegacyProfiles[legacyProfileId];
			if (legacyCredential !== void 0) {
				if (!isRecord(legacyCredential)) return false;
				const canonicalLegacyCredential = parseLegacyCredentialEntry({
					...legacyCredential,
					provider
				}, provider);
				return canonicalLegacyCredential?.type === "oauth" && inheritedCredential?.type === "oauth" && inheritedCredential.provider === provider && (hasMatchingOAuthIdentity(canonicalLegacyCredential, inheritedCredential) || areOAuthCredentialsEquivalent(canonicalLegacyCredential, inheritedCredential));
			}
		}
		return normalizeOptionalLowercaseString(inheritedCredential?.provider) === provider;
	}));
}
/** Scan or repair all configured agent session stores that still contain legacy Codex routes. */
async function maybeRepairCodexSessionRoutes(params) {
	const env = params.env ?? process.env;
	const authProfileOnly = !params.shouldRepair && params.authProfileOnly === true;
	const shouldRepair = params.shouldRepair || authProfileOnly;
	const warnings = [];
	const isRetained = createRetainedAgentDatabaseMatcher(env, () => resolveConfiguredAgentDatabaseTargets(params.cfg, { env }));
	const sessionTargets = resolveAllAgentSessionStoreTargetsSync(params.cfg, { env }).filter((target) => !isRetained(target.storePath, target.agentId));
	const resolveRetired = authProfileOnly ? void 0 : createRetiredModelRefRepairResolver({
		cfg: params.cfg,
		checkModelPolicy: true,
		retiredModelRefConfig: params.retiredModelRefConfig,
		env,
		warnings,
		agentIds: [...new Set(sessionTargets.map((target) => target.agentId))]
	});
	const targets = sessionTargets.flatMap((target) => {
		const defaultModelRef = resolveRetired ? resolveAgentEffectiveModelPrimary(params.cfg, target.agentId) : void 0;
		const retirement = resolveRetired ? {
			agentId: target.agentId,
			resolve: resolveRetired,
			warnings,
			defaultModelRef: defaultModelRef ? resolveRuntimeModelRef({
				cfg: params.cfg,
				modelRef: defaultModelRef,
				agentId: target.agentId
			}) : void 0
		} : void 0;
		const sessionScope = {
			storePath: target.storePath,
			agentId: target.agentId,
			env
		};
		const authProfileIdMap = resolveVerifiedSessionAuthProfileIdMap({
			agentId: target.agentId,
			cfg: params.cfg,
			env,
			authProfileIdMap: params.authProfileIdMap
		});
		if (authProfileOnly && !authProfileIdMap?.size) return [];
		const staleSqliteSessionKeys = [];
		const scanEntry = ({ entry, sessionKey }) => {
			if (scanCodexSessionStoreRoutes({ [sessionKey]: entry }, params.blockedModelIdentities, authProfileIdMap, retirement, warnings, authProfileOnly).length > 0) staleSqliteSessionKeys.push(sessionKey);
		};
		const sqliteEntryCount = shouldRepair ? scanDoctorSessionEntriesStrict(sessionScope, scanEntry) : scanDoctorSessionEntriesTolerant(sessionScope, scanEntry);
		const hasLegacyStore = !target.storePath.endsWith(".sqlite") && fs.existsSync(target.storePath);
		return sqliteEntryCount > 0 || hasLegacyStore ? [{
			...target,
			staleSqliteSessionKeys,
			hasLegacyStore,
			authProfileIdMap,
			retirement
		}] : [];
	});
	if (!shouldRepair) {
		const stale = targets.flatMap((target) => {
			const sessionKeys = new Set(target.staleSqliteSessionKeys);
			if (target.hasLegacyStore) for (const sessionKey of scanCodexSessionStoreRoutes(loadLegacySessionStore(target.storePath), params.blockedModelIdentities, target.authProfileIdMap, target.retirement, warnings, authProfileOnly)) sessionKeys.add(sessionKey);
			return Array.from(sessionKeys, (sessionKey) => `${target.agentId}:${sessionKey}`);
		});
		return {
			scannedStores: targets.length,
			repairedStores: 0,
			repairedSessions: 0,
			warnings: [...warnings, ...stale.length > 0 ? [[
				"- Legacy session bindings or retired session model route state detected.",
				`- Affected sessions: ${stale.length}.`,
				"- Run `openclaw doctor --fix` to migrate legacy bindings and stale session model/provider pins across all agent session stores."
			].join("\n")] : []],
			changes: []
		};
	}
	let repairedStores = 0;
	let repairedSessions = 0;
	for (const target of targets) {
		const repairedSessionKeys = /* @__PURE__ */ new Set();
		const { staleSqliteSessionKeys } = target;
		for (const sessionKeys of iterateDoctorSessionKeyBatches(staleSqliteSessionKeys)) {
			const result = await applySessionEntryReplacements({
				agentId: target.agentId,
				storePath: target.storePath,
				sessionKeys,
				skipMaintenance: true,
				update: (entries) => {
					const store = Object.fromEntries(entries.map(({ sessionKey, entry }) => [sessionKey, entry]));
					const repair = repairCodexSessionStoreRoutes({
						store,
						blockedModelIdentities: params.blockedModelIdentities,
						authProfileIdMap: target.authProfileIdMap,
						authProfileOnly,
						retirement: target.retirement,
						warnings
					});
					return {
						result: repair,
						replacements: repair.sessionKeys.map((sessionKey) => ({
							sessionKey,
							entry: store[sessionKey]
						}))
					};
				}
			});
			for (const sessionKey of result.sessionKeys) repairedSessionKeys.add(sessionKey);
		}
		if (target.hasLegacyStore) {
			if (scanCodexSessionStoreRoutes(loadLegacySessionStore(target.storePath), params.blockedModelIdentities, target.authProfileIdMap, target.retirement, warnings, authProfileOnly).length > 0) {
				const result = await updateLegacySessionStore(target.storePath, (store) => repairCodexSessionStoreRoutes({
					store,
					blockedModelIdentities: params.blockedModelIdentities,
					authProfileIdMap: target.authProfileIdMap,
					authProfileOnly,
					retirement: target.retirement,
					warnings
				}), { skipMaintenance: true });
				for (const sessionKey of result.sessionKeys) repairedSessionKeys.add(sessionKey);
			}
		}
		if (repairedSessionKeys.size > 0) {
			repairedStores += 1;
			repairedSessions += repairedSessionKeys.size;
		}
	}
	const repairedScope = `${repairedSessions} session${repairedSessions === 1 ? "" : "s"} across ${repairedStores} store${repairedStores === 1 ? "" : "s"}`;
	return {
		scannedStores: targets.length,
		repairedStores,
		repairedSessions,
		warnings,
		changes: repairedSessions > 0 ? [authProfileOnly ? `Updated auth-profile references in ${repairedScope}.` : `Repaired legacy bindings or retired model routes in ${repairedScope} while preserving auth-profile pins.`] : []
	};
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
function formatCodexRouteChange(hit) {
	return `${hit.path}: ${hit.model} -> ${hit.canonicalModel}.`;
}
function formatUnsupportedCompactionWarning(params) {
	return [
		"- Codex runtime uses native server-side compaction and ignores OpenClaw compaction summarizer overrides.",
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
function collectCodexAppServerCommandWarnings(cfg) {
	const plugins = asOptionalRecord(cfg.plugins);
	const entries = asOptionalRecord(plugins?.entries);
	const codex = asOptionalRecord(entries?.codex);
	const config = asOptionalRecord(codex?.config);
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
	const plugins = asOptionalRecord(cfg.plugins);
	const entries = asOptionalRecord(plugins?.entries);
	const codex = asOptionalRecord(entries?.codex);
	const config = asOptionalRecord(codex?.config);
	const computerUse = asOptionalRecord(config?.computerUse);
	if (!computerUse) return [];
	if (!(computerUse.enabled === true || computerUse.autoInstall === true || typeof computerUse.marketplaceSource === "string" || typeof computerUse.marketplacePath === "string" || typeof computerUse.marketplaceName === "string")) return [];
	const cadence = computerUse.healthCheckIntervalMinutes === 30 || computerUse.healthCheckIntervalMinutes === 60 || computerUse.healthCheckIntervalMinutes === 120 || computerUse.healthCheckIntervalMinutes === 240 ? computerUse.healthCheckIntervalMinutes : 60;
	return [[
		"- Codex Computer Use is enabled.",
		"- Doctor config review found Computer Use enabled; run `/codex computer-use status` to inspect installation, exposure, and the live `list_apps` probe.",
		computerUse.healthCheckEnabled === true ? `- Periodic Computer Use health checks are enabled with a ${cadence}-minute cadence.` : "- Periodic Computer Use health checks are disabled by default; set `computerUse.healthCheckEnabled` to true to enable them.",
		computerUse.autoRepair === true ? "- Stale Computer Use MCP child repair is enabled and limited to SkyComputerUseClient children." : "- Stale Computer Use MCP child repair is disabled by default; set `computerUse.autoRepair` to true to repair before retrying a failed probe."
	].join("\n")];
}
/** Collect doctor warnings for legacy Codex model refs, runtime pins, and compaction overrides. */
function collectCodexRouteWarnings(params) {
	const env = params.env ?? process.env;
	const blockedProviderPlan = params.blockedProviderPlan ?? collectBlockedLegacyOpenAICodexProviderPlan(params.cfg);
	const blockedModelIdentities = new Set(blockedProviderPlan.blockedModelIdentities);
	const hits = collectConfigModelRefs(params.cfg, blockedModelIdentities);
	const disabledCodexPluginHits = collectDisabledCodexPluginRouteHits(params.cfg, env);
	const ignoreLegacyAgentRuntimePins = configRepairWouldClearLegacyRuntimePins({
		cfg: params.cfg,
		blockedModelIdentities,
		env
	});
	const legacyLosslessCompactionConfigs = collectLegacyLosslessCompactionConfigs({
		cfg: params.cfg,
		ignoreLegacyAgentRuntimePins,
		env
	});
	const legacyLosslessCompactionPaths = new Set(legacyLosslessCompactionConfigs.flatMap((hit) => hit.modelPath ? [hit.providerPath, hit.modelPath] : [hit.providerPath]));
	const unsupportedCompactionOverrides = collectUnsupportedCodexCompactionOverrides({
		cfg: params.cfg,
		ignoreLegacyAgentRuntimePins,
		env
	}).filter((hit) => !legacyLosslessCompactionPaths.has(hit.path));
	const sharedDefaultCompactionConsumers = getSharedDefaultCompactionOverrideConsumers({
		cfg: params.cfg,
		ignoreLegacyAgentRuntimePins,
		env
	});
	const sharedLosslessDefaultHasNonCodexConsumer = sharedDefaultLosslessCompactionHasNonCodexConsumer({
		cfg: params.cfg,
		ignoreLegacyAgentRuntimePins,
		env
	});
	const warnings = [
		...blockedProviderPlan.warning ? [blockedProviderPlan.warning] : [],
		...collectCodexRuntimeCompatibilityWarnings(params.cfg, env),
		...collectCodexComputerUseWarnings(params.cfg)
	];
	if (hits.length > 0) warnings.push([
		"- Legacy `codex/*` and `openai-codex/*` model refs should be rewritten to `openai/*`.",
		...hits.map((hit) => `- ${hit.path}: ${hit.model} should become ${hit.canonicalModel}${hit.runtime ? `; current runtime is "${hit.runtime}"` : ""}.`),
		"- Run `openclaw doctor --fix`: it rewrites configured model refs and stale sessions to `openai/*`, moves Codex intent to provider/model runtime policy, and clears old whole-agent runtime pins."
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
		fixHint: "- Move or remove shared `agents.defaults.compaction.model/provider` settings manually; doctor keeps shared defaults while non-Codex agents can inherit them."
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
	const ignoreLegacyAgentRuntimePins = configRepairWouldClearLegacyRuntimePins({
		cfg: params.cfg,
		blockedModelIdentities,
		env
	});
	const unsupportedCompactionOverrides = collectUnsupportedCodexCompactionOverrides({
		cfg: params.cfg,
		ignoreLegacyAgentRuntimePins,
		env
	});
	const legacyLosslessCompactionConfigs = collectLegacyLosslessCompactionConfigs({
		cfg: params.cfg,
		ignoreLegacyAgentRuntimePins,
		env
	});
	const hasRemovableServiceTier = collectCodexModelParamHits(params.cfg, env).some((hit) => hit.removable);
	if (hits.length === 0 && disabledCodexPluginHits.length === 0 && unsupportedCompactionOverrides.length === 0 && legacyLosslessCompactionConfigs.length === 0 && !hasRemovableServiceTier && !blockedProviderPlan.warning) return {
		cfg: params.cfg,
		warnings: collectCodexRouteWarnings({
			cfg: params.cfg,
			env,
			blockedProviderPlan
		}),
		changes: []
	};
	if (!params.shouldRepair) return {
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
	const routeChanges = repaired.changes.length > 0 ? [`Repaired Codex model routes:\n${repaired.changes.map((hit) => `- ${formatCodexRouteChange(hit)}`).join("\n")}`] : [];
	return {
		cfg: codexPluginRepair.cfg,
		warnings,
		changes: [
			...routeChanges,
			...repaired.runtimePolicyChanges,
			...repaired.runtimePinChanges,
			...repaired.unsupportedCompactionChanges,
			...codexPluginRepair.changes,
			...serviceTierRepair.changes
		]
	};
}
//#endregion
export { maybeRepairCodexSessionRoutes as a, resolveKnownModelRefMigrationTarget as i, collectCodexRuntimeCompatibilityWarnings as n, collectDisabledCodexPluginRouteIssues as o, maybeRepairCodexRoutes as r, collectCodexRouteWarnings as t };
