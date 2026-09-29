import { a as asOptionalRecord } from "./record-coerce-DItp3I4t.mjs";
import { c as normalizeOptionalLowercaseString } from "./string-coerce-CIXf7egm.mjs";
import { r as normalizeProviderId } from "./provider-id-DCtsDflE.mjs";
import { O as listAgentIds, a as resolveAgentDir, l as resolveAgentWorkspaceDir } from "./agent-scope-config-IQKOEtZ4.mjs";
import { t as createInstalledPluginEnabledPredicate } from "./installed-plugin-index-D0kh4WcK.mjs";
import { l as normalizePluginsConfig } from "./config-state-BEAL5gWH.mjs";
import { a as visitModelSelectorRefs, i as listModelRefsFromConfigValue } from "./configured-model-refs-ngXQhRsV.mjs";
import { n as DEFAULT_MODEL, r as DEFAULT_PROVIDER } from "./defaults-BbU4k6fu.mjs";
import { t as splitTrailingAuthProfile } from "./model-ref-profile-BIKs-96s.mjs";
import { t as mergeAgentModelEntryForConfig } from "./model-input-DKxKaZGG.mjs";
import { a as resolveMergedModelProviderConfig, i as projectModelProviderConfig, r as findConfiguredProviderModel } from "./model-provider-config-BbSyhfVf.mjs";
import { a as isBlockedLegacyCodexModelRef, b as toCanonicalOpenAIModelRef, f as normalizeRuntimeString, g as readModelConfigPrimaryRef } from "./codex-route-model-ref-CXtvdgWA.mjs";
import { c as loadManifestMetadataSnapshot, n as isManifestPluginAvailableForControlPlane } from "./manifest-contract-eligibility-D2rgNcZS.mjs";
import { h as resolveConfiguredModelRef, i as buildModelAliasIndex, l as isModelKeyAllowedBySet, m as resolveConfiguredModelPolicyAllow, n as buildAllowedModelSet, v as resolveModelRefFromString } from "./model-selection-shared-0uvJbX1M.mjs";
import { u as resolveAgentModelFallbacksOverride } from "./agent-scope-CTuYDtny.mjs";
import { n as resolveProviderModelMaterializationAuthMode } from "./provider-model-route-auth-DkAaX3ui.mjs";
import { a as projectProviderModelRouteConfig, t as canonicalizeProviderModelId } from "./provider-model-route-D-_CCdkJ.mjs";
import { t as listMutableCodexRouteAgentEntries } from "./codex-route-agent-entries-BohvVKP0.mjs";
import { c as loadAuthProfileStoreForSecretsRuntime } from "./store-runtime-BcoYkagW.mjs";
import { l as resolvePluginModelCatalogOwnerPluginId } from "./plugin-model-catalog-DoLlP-mj.mjs";
import { t as buildManifestBuiltInModelSuppressionResolver } from "./manifest-model-suppression-CqAfy3ud.mjs";
import { t as createModelAuthAvailabilityResolver } from "./model-auth-availability-qRPXDgX6.mjs";
//#region src/commands/doctor/shared/codex-route-model-slots.ts
function recordCodexModelHit(params) {
	if (isBlockedLegacyCodexModelRef({
		modelRef: params.model,
		blockedModelIdentities: params.blockedModelIdentities
	})) return;
	const canonicalModel = toCanonicalOpenAIModelRef(params.model);
	if (!canonicalModel) return;
	params.hits.push({
		path: params.path,
		model: params.model,
		canonicalModel,
		...params.runtime ? { runtime: params.runtime } : {}
	});
	return canonicalModel;
}
function collectStringModelSlot(params) {
	if (typeof params.value !== "string") return;
	recordCodexModelHit({
		hits: params.hits,
		path: params.path,
		model: params.value.trim(),
		runtime: params.runtime,
		blockedModelIdentities: params.blockedModelIdentities
	});
}
function collectModelConfigSlot(params) {
	visitModelSelectorRefs(params.value, params.path, (path, value, role) => {
		collectStringModelSlot({
			...params,
			path,
			value,
			runtime: role === "primary" ? params.runtime : void 0
		});
	});
}
function modelConfigContainsRef(value, modelRef) {
	return listModelRefsFromConfigValue(value).some((ref) => ref.trim() === modelRef);
}
function collectModelConfigRefs(params) {
	visitModelSelectorRefs(params.value, params.path, (path, value) => collectStringModelConfigRef({
		...params,
		path,
		value
	}));
}
function collectStringModelConfigRef(params) {
	if (typeof params.value !== "string") return;
	const modelRef = params.value.trim();
	if (modelRef) params.refs.push({
		path: params.path,
		modelRef
	});
}
function collectCodexRuntimeModelPolicyRefs(params) {
	const record = asOptionalRecord(params.models);
	if (!record) return;
	for (const [modelRef, entry] of Object.entries(record)) {
		const trimmed = modelRef.trim();
		if (!trimmed) continue;
		if (normalizeRuntimeString(asOptionalRecord(asOptionalRecord(entry)?.agentRuntime)?.id) === "codex") params.refs.push({
			path: `${params.path}.${trimmed}`,
			modelRef: trimmed
		});
	}
}
function rewriteStringModelSlot(params) {
	if (typeof params.container?.[params.key] !== "string") return false;
	return rewriteModelReferenceSlot({
		...params,
		resolve: (model, path) => recordCodexModelHit({
			...params,
			model,
			path
		})
	});
}
/** Mutates model selectors; the return value reports only primary changes for runtime-policy callers. */
function rewriteModelReferenceSlot(params) {
	const { container, key, path, resolve } = params;
	if (!container) return false;
	const value = container[key];
	if (typeof value === "string") {
		const replacement = resolve(value.trim(), path, "primary");
		if (replacement === void 0 || replacement === value) return false;
		if (replacement === null) delete container[key];
		else container[key] = replacement;
		return true;
	}
	const record = asOptionalRecord(value);
	if (!record) return false;
	const primaryChanged = rewriteModelReferenceSlot({
		container: record,
		key: "primary",
		path: `${path}.primary`,
		resolve
	});
	if (Array.isArray(record.fallbacks)) record.fallbacks = record.fallbacks.flatMap((entry, index) => {
		if (typeof entry !== "string") return [entry];
		const replacement = resolve(entry.trim(), `${path}.fallbacks.${index}`, "fallback");
		return replacement === null ? [] : [replacement ?? entry];
	});
	return primaryChanged;
}
function rewriteModelConfigSlot(params) {
	return rewriteModelReferenceSlot({
		...params,
		resolve: (model, path, role) => recordCodexModelHit({
			...params,
			model,
			path,
			runtime: role === "primary" ? params.runtime : void 0
		})
	});
}
function rewriteModelsMap(params) {
	if (!params.models) return;
	for (const legacyRef of Object.keys(params.models)) {
		const canonicalModel = recordCodexModelHit({
			hits: params.hits,
			path: `${params.path}.${legacyRef}`,
			model: legacyRef,
			blockedModelIdentities: params.blockedModelIdentities
		});
		if (!canonicalModel) continue;
		const legacyEntry = params.models[legacyRef] ?? {};
		const canonicalEntry = params.models[canonicalModel];
		const legacyRecord = asOptionalRecord(legacyEntry);
		const canonicalRecord = asOptionalRecord(canonicalEntry);
		params.models[canonicalModel] = legacyRecord && canonicalRecord ? mergeCanonicalModelMapRecord({
			legacyRecord,
			canonicalRecord
		}) : canonicalEntry ?? legacyEntry;
		delete params.models[legacyRef];
	}
}
function mergeCanonicalModelMapRecord(params) {
	const merged = {
		...params.legacyRecord,
		...params.canonicalRecord
	};
	const legacyRuntime = asOptionalRecord(params.legacyRecord.agentRuntime);
	const canonicalRuntime = asOptionalRecord(params.canonicalRecord.agentRuntime);
	if (legacyRuntime && runtimePolicyHasExplicitNonDefaultPin(legacyRuntime) && !runtimePolicyHasExplicitNonDefaultPin(canonicalRuntime)) merged.agentRuntime = {
		...legacyRuntime,
		...canonicalRuntime,
		id: legacyRuntime.id
	};
	return merged;
}
function runtimePolicyHasExplicitNonDefaultPin(value) {
	const id = normalizeOptionalLowercaseString(asOptionalRecord(value)?.id);
	return Boolean(id && id !== "auto" && id !== "default");
}
//#endregion
//#region src/commands/doctor/shared/retired-model-ref-repair.ts
function repairModelRefAuthProfile(modelRef, profileIdMap) {
	const parsed = splitTrailingAuthProfile(modelRef);
	const profile = parsed.profile ? profileIdMap?.get(parsed.profile) : void 0;
	return profile && profile !== parsed.profile ? {
		kind: "replace",
		modelRef: `${parsed.model}@${profile}`,
		reason: "reference-preservation"
	} : { kind: "unchanged" };
}
/** Metadata and exact profile views stay scoped to Doctor's pre-transaction planning. */
function createRetiredModelRefRepairResolver(params) {
	const env = params.env ?? process.env;
	const agents = params.agentIds ?? listAgentIds(params.cfg);
	const normalizedPluginsConfig = normalizePluginsConfig(params.cfg.plugins);
	const warn = (message) => {
		if (params.warnings && !params.warnings.includes(message)) params.warnings.push(message);
	};
	const owners = new Map(agents.map((agentId) => {
		const agentDir = resolveAgentDir(params.cfg, agentId, env);
		const workspaceDir = resolveAgentWorkspaceDir(params.cfg, agentId);
		const metadataSnapshot = params.metadataSnapshot ?? loadManifestMetadataSnapshot({
			config: params.cfg,
			workspaceDir,
			env
		});
		const isInstalledPluginEnabled = createInstalledPluginEnabledPredicate(metadataSnapshot.index.plugins, params.cfg);
		const authViews = /* @__PURE__ */ new Map();
		const prepareModelResolver = (cfg) => {
			const modelOptions = {
				cfg,
				agentId,
				manifestPlugins: metadataSnapshot.plugins,
				allowManifestNormalization: false,
				allowPluginNormalization: false
			};
			const defaultRef = resolveConfiguredModelRef({
				...modelOptions,
				defaultProvider: DEFAULT_PROVIDER,
				defaultModel: DEFAULT_MODEL
			});
			const defaultProvider = defaultRef.provider;
			const aliasIndex = buildModelAliasIndex({
				...modelOptions,
				defaultProvider
			});
			return {
				defaultRef,
				resolve: (raw) => resolveModelRefFromString({
					...modelOptions,
					raw,
					defaultProvider,
					aliasIndex
				})?.ref
			};
		};
		const model = prepareModelResolver(params.retiredModelRefConfig ?? params.cfg);
		const currentModel = params.retiredModelRefConfig ? prepareModelResolver(params.cfg) : model;
		return [agentId, {
			nativeApiKeyRoute(provider) {
				const pluginId = resolvePluginModelCatalogOwnerPluginId({
					providerId: provider,
					pluginMetadataSnapshot: metadataSnapshot
				});
				const plugin = metadataSnapshot.plugins.find((candidate) => candidate.id === pluginId && isManifestPluginAvailableForControlPlane({
					snapshot: metadataSnapshot,
					plugin: candidate,
					config: params.cfg,
					normalizedConfig: normalizedPluginsConfig,
					isInstalledPluginEnabled
				}));
				const catalog = Object.entries(plugin?.modelCatalog?.providers ?? {}).find(([providerId]) => normalizeProviderId(providerId) === provider)?.[1];
				return catalog?.baseUrl ? {
					api: catalog.api,
					baseUrl: catalog.baseUrl
				} : void 0;
			},
			model: model.resolve,
			currentModel: currentModel.resolve,
			modelPolicy: params.checkModelPolicy ? buildAllowedModelSet({
				cfg: params.cfg,
				catalog: [],
				agentId,
				defaultProvider: currentModel.defaultRef.provider,
				defaultModel: currentModel.defaultRef,
				manifestPlugins: metadataSnapshot.plugins
			}) : void 0,
			auth(profileId) {
				let view = authViews.get(profileId);
				if (!view) {
					view = createModelAuthAvailabilityResolver({
						cfg: params.cfg,
						agentId,
						agentDir,
						workspaceDir,
						env,
						metadataSnapshot,
						authStore: loadAuthProfileStoreForSecretsRuntime(agentDir, {
							config: params.cfg,
							profileId
						})
					});
					authViews.set(profileId, view);
				}
				return view;
			},
			suppression(config = params.cfg) {
				return buildManifestBuiltInModelSuppressionResolver({
					config,
					workspaceDir,
					env,
					metadataSnapshot
				});
			}
		}];
	}));
	const resolveForOwner = (input, agentId) => {
		const parsed = splitTrailingAuthProfile(input.modelRef);
		const owner = owners.get(agentId);
		const model = owner?.model(parsed.model);
		if (!owner || !model) return { kind: "unchanged" };
		const provider = model.provider;
		const id = canonicalizeProviderModelId(provider, model.model);
		const canonical = `${provider}/${id}`;
		const validatePolicy = (repair) => {
			if (repair.kind !== "replace" || !owner.modelPolicy || owner.modelPolicy.allowAny) return repair;
			const replacement = splitTrailingAuthProfile(repair.modelRef).model;
			if (isModelKeyAllowedBySet(owner.modelPolicy.allowedKeys, replacement)) return repair;
			const policyPath = resolveConfiguredModelPolicyAllow({
				cfg: params.cfg,
				agentId
			}).repairConfigPath.replace("*", agentId);
			warn(`Retained model reference "${canonical}" for agent "${agentId}": "${replacement}" is not permitted. Allow "${replacement}" in ${policyPath} and rerun openclaw doctor --fix, or choose an allowed model override.`);
			return { kind: "unchanged" };
		};
		const current = owner.currentModel(parsed.model);
		const preserved = current?.provider === provider && canonicalizeProviderModelId(provider, current.model) === id ? { kind: "unchanged" } : {
			kind: "replace",
			modelRef: parsed.profile ? `${canonical}@${parsed.profile}` : canonical,
			reason: "reference-preservation"
		};
		if (!owner.suppression().hasRetirementCandidate({
			provider,
			id
		})) return validatePolicy(preserved);
		let rule = owner.suppression()({
			provider,
			id,
			unconditionalOnly: true
		});
		let retirementScope = rule?.retirement ? "provider" : "route";
		if (!rule?.retirement) {
			const pinnedProfileId = (input.authProfileSource === "user" || input.authProfileSource === "user-link" ? input.authProfileId : void 0) ?? parsed.profile;
			const preferredProfileId = pinnedProfileId ? void 0 : input.authProfileId;
			const auth = owner.auth(pinnedProfileId ?? preferredProfileId).evaluateRuntimeModelAuth(provider, {
				modelId: id,
				pinnedProfileId,
				preferredProfileId
			});
			const configured = auth.routeResolution === null && !auth.availabilityAuthoritative && (auth.selectedAuthMode !== void 0 || auth.availability === true) ? resolveMergedModelProviderConfig(params.cfg, provider) : void 0;
			const configuredModel = findConfiguredProviderModel(configured, provider, id, (modelId) => canonicalizeProviderModelId(provider, modelId));
			const configuredRoute = configured ? {
				api: configuredModel?.api ?? configured.api,
				baseUrl: configuredModel?.baseUrl ?? configured.baseUrl
			} : auth.routeResolution === null && !auth.availabilityAuthoritative && auth.availability === true && resolveProviderModelMaterializationAuthMode(auth.selectedAuthMode) === "api_key" ? owner.nativeApiKeyRoute(provider) : void 0;
			const baseUrl = auth.selectedRoute?.baseUrl ?? configuredRoute?.baseUrl;
			if (!baseUrl) {
				warn(`Retained ${canonical} for agent "${agentId}": its exact authentication route is unavailable. Restore that provider account and rerun openclaw doctor --fix, or choose a current model explicitly.`);
				return validatePolicy(preserved);
			}
			const routeConfig = auth.selectedRoute ? projectProviderModelRouteConfig({
				provider,
				config: params.cfg,
				route: auth.selectedRoute
			}) : projectModelProviderConfig(params.cfg, provider, {
				api: configuredRoute?.api,
				baseUrl
			});
			rule = owner.suppression(routeConfig)({
				provider,
				id,
				baseUrl
			});
			if (rule?.retirement) {
				const routes = auth.routeResolution?.kind === "routes" ? auth.routeResolution.routes : configuredRoute ? [configuredRoute] : [];
				const successor = rule.retirement.replacedBy;
				if (routes.length > 0 && routes.every((route) => {
					const retirement = owner.suppression(projectModelProviderConfig(params.cfg, provider, route))({
						provider,
						id,
						baseUrl: route.baseUrl
					})?.retirement;
					return retirement !== void 0 && retirement.replacedBy === successor;
				})) retirementScope = "owner";
			}
		}
		if (!rule?.retirement) return validatePolicy(preserved);
		const successor = rule.retirement.replacedBy;
		if (!successor) return {
			kind: "clear",
			provider,
			modelRef: canonical,
			retirementScope
		};
		const modelRef = `${provider}/${successor}`;
		return validatePolicy({
			kind: "replace",
			modelRef: parsed.profile ? `${modelRef}@${parsed.profile}` : modelRef,
			reason: "retirement",
			retirementScope
		});
	};
	return (input) => {
		const authRepair = repairModelRefAuthProfile(input.modelRef, params.authProfileIdMap);
		if (input.authProfileOnly) return authRepair;
		const mappedInput = authRepair.kind === "replace" ? {
			...input,
			modelRef: authRepair.modelRef
		} : input;
		if (input.agentId) {
			const decision = resolveForOwner(mappedInput, input.agentId);
			return decision.kind === "unchanged" ? authRepair : decision;
		}
		const decisions = agents.map((agentId) => resolveForOwner(mappedInput, agentId));
		const first = decisions[0];
		const consistent = first && decisions.every((decision) => decision.kind === first.kind && (decision.kind !== "replace" || first.kind === "replace" && decision.modelRef === first.modelRef));
		if (!consistent && decisions.some((decision) => decision.kind !== "unchanged")) warn(`Retained shared model reference "${input.modelRef}": agent authentication routes require different repairs. Choose a current model in each affected agent's model configuration.`);
		if (!consistent || first.kind === "unchanged") return authRepair;
		if (!("retirementScope" in first)) return first;
		const scopes = new Set(decisions.flatMap((decision) => "retirementScope" in decision ? [decision.retirementScope] : []));
		const retirementScope = scopes.has("route") ? "route" : scopes.has("owner") ? "owner" : "provider";
		return {
			...first,
			retirementScope
		};
	};
}
function createRetiredModelRefRewriter(params) {
	return (modelRef, path) => {
		const decision = params.resolve({
			modelRef,
			agentId: params.agentId,
			...params.authProfileOnly ? { authProfileOnly: true } : {}
		});
		if (decision.kind === "unchanged") return;
		if (decision.kind === "clear" && params.preservePrimaryWithoutSuccessor && (path === `${params.path}.model` || path === `${params.path}.model.primary`)) {
			params.warnings?.push(`Retained retired ${path} "${modelRef}": no provider successor is declared and this global default has no agent default to inherit. Choose a supported default with openclaw models set.`);
			return;
		}
		params.changes.push(decision.kind === "replace" ? decision.reason === "reference-preservation" ? `Preserved ${path} model "${modelRef}" as "${decision.modelRef}" after config repair.` : `Replaced retired ${path} "${modelRef}" with "${decision.modelRef}".` : `Removed retired ${path} "${modelRef}" so it inherits the configured default model.`);
		return decision.kind === "replace" ? decision.modelRef : null;
	};
}
function modelSettingsWithoutAlias(value) {
	const record = asOptionalRecord(value);
	if (!record) return value;
	const { alias: _alias, ...settings } = record;
	return settings;
}
/** Apply the same retirement decision to config selectors and cron payload selectors. */
function repairRetiredModelSlots(params) {
	const rewrite = createRetiredModelRefRewriter(params);
	const rewriteAuth = createRetiredModelRefRewriter({
		...params,
		authProfileOnly: true
	});
	const rewriteSlot = (container, key, path, authProfileOnly = false) => rewriteModelReferenceSlot({
		container: asOptionalRecord(container),
		key,
		path,
		resolve: authProfileOnly ? rewriteAuth : rewrite
	});
	for (const key of [
		"model",
		"utilityModel",
		"imageModel",
		"pdfModel"
	]) {
		rewriteSlot(params.owner, key, `${params.path}.${key}`);
		const selector = asOptionalRecord(params.owner[key]);
		if (selector && Object.keys(selector).length === 0) delete params.owner[key];
	}
	rewriteSlot(params.owner, "voiceModel", `${params.path}.voiceModel`, true);
	for (const capability of [
		"image",
		"video",
		"music"
	]) rewriteSlot(params.owner.mediaModels, capability, `${params.path}.mediaModels.${capability}`, true);
	rewriteSlot({ selector: params.owner }, "selector", params.path);
	for (const key of [
		"heartbeat",
		"subagents",
		"compaction"
	]) rewriteSlot(params.owner[key], "model", `${params.path}.${key}.model`);
	rewriteSlot(asOptionalRecord(params.owner.compaction)?.memoryFlush, "model", `${params.path}.compaction.memoryFlush.model`);
	rewriteSlot(asOptionalRecord(asOptionalRecord(params.owner.tools)?.exec)?.reviewer, "model", `${params.path}.tools.exec.reviewer.model`);
	rewriteSlot(params.owner.tts, "summaryModel", `${params.path}.tts.summaryModel`);
	let models = asOptionalRecord(params.owner.models);
	for (const [modelRef, inherited] of Object.entries(params.inheritedModels ?? {})) {
		const decision = params.resolve({
			modelRef,
			agentId: params.agentId
		});
		if (decision.kind !== "replace") continue;
		const retainAlias = decision.reason === "retirement" && decision.retirementScope === "route";
		const settings = [
			retainAlias ? modelSettingsWithoutAlias(inherited) : inherited,
			params.inheritedModels?.[decision.modelRef],
			retainAlias ? modelSettingsWithoutAlias(models?.[modelRef]) : models?.[modelRef],
			models?.[decision.modelRef]
		].filter((value) => value !== void 0).reduce(mergeAgentModelEntryForConfig, void 0);
		if (JSON.stringify(settings) === JSON.stringify(models?.[decision.modelRef])) continue;
		models ??= {};
		params.owner.models = models;
		models[decision.modelRef] = settings;
		params.changes.push(`Preserved inherited ${modelRef} settings in ${params.path}.models.${decision.modelRef}.`);
	}
	for (const modelRef of Object.keys(models ?? {})) {
		const decision = params.resolve({
			modelRef,
			agentId: params.agentId
		});
		if (decision.kind === "unchanged" || !models) continue;
		const replacement = decision.kind === "replace" ? decision.modelRef : params.inheritedModelRef;
		if (!replacement) continue;
		const retain = "retirementScope" in decision && decision.retirementScope === "route";
		if (retain && asOptionalRecord(models[modelRef])?.alias) params.warnings?.push(`Retained ${params.path}.models.${modelRef} alias: applicable authentication routes do not share a verified successor. Choose its model target explicitly.`);
		const existing = models[replacement];
		const source = retain ? modelSettingsWithoutAlias(models[modelRef]) : models[modelRef];
		const settings = decision.kind === "replace" ? existing === void 0 ? source : mergeAgentModelEntryForConfig(source, existing) : existing ?? {};
		if (retain && JSON.stringify(settings) === JSON.stringify(existing)) continue;
		models[replacement] = settings;
		if (!retain) delete models[modelRef];
		params.changes.push(retain ? `Preserved ${params.path}.models.${modelRef} for other authentication routes and added ${replacement}.` : `Moved retired ${params.path}.models.${modelRef} to ${replacement}.`);
	}
	const policy = asOptionalRecord(params.owner.modelPolicy);
	const allowed = policy?.allow ?? params.inheritedModelPolicy?.allow;
	if (Array.isArray(allowed)) {
		let changed = false;
		const rewritten = allowed.flatMap((value, index) => {
			if (typeof value !== "string") return [value];
			const decision = params.resolve({
				modelRef: value,
				agentId: params.agentId
			});
			if (decision.kind === "unchanged") return [value];
			const replacement = decision.kind === "replace" ? decision.modelRef : params.inheritedModelRef;
			if (!replacement || replacement === value) return [value];
			const retain = "retirementScope" in decision && decision.retirementScope === "route";
			if (retain && allowed.includes(replacement)) return [value];
			changed = true;
			params.changes.push(retain ? `Preserved ${params.path}.modelPolicy.allow.${index} "${value}" for other authentication routes and allowed "${replacement}".` : `Replaced retired ${params.path}.modelPolicy.allow.${index} "${value}" with "${replacement}".`);
			return retain ? [value, replacement] : [replacement];
		});
		if (changed) params.owner.modelPolicy = {
			...policy,
			allow: [...new Set(rewritten)]
		};
	}
}
function repairRetiredConfigModelRefs(cfg, resolve, warnings = []) {
	const config = structuredClone(cfg);
	const changes = [];
	const defaults = asOptionalRecord(config.agents?.defaults);
	if (defaults) repairRetiredModelSlots({
		owner: defaults,
		path: "agents.defaults",
		resolve,
		changes,
		warnings,
		preservePrimaryWithoutSuccessor: true
	});
	for (const { agent, agentId, path } of listMutableCodexRouteAgentEntries(config)) {
		const inheritedModelRef = readModelConfigPrimaryRef(defaults?.model);
		const repairInheritedPrimary = !readModelConfigPrimaryRef(agent.model) && inheritedModelRef && resolve({
			modelRef: inheritedModelRef,
			agentId
		}).kind === "replace";
		const inheritedFallbacks = resolveAgentModelFallbacksOverride(config, agentId) === void 0 ? asOptionalRecord(defaults?.model)?.fallbacks : void 0;
		const repairInheritedFallbacks = Array.isArray(inheritedFallbacks) && inheritedFallbacks.some((modelRef) => typeof modelRef === "string" && resolve({
			modelRef,
			agentId
		}).kind !== "unchanged");
		if (repairInheritedPrimary || repairInheritedFallbacks) {
			const ownModel = asOptionalRecord(agent.model);
			agent.model = typeof defaults?.model === "string" && !ownModel ? defaults.model : {
				...repairInheritedPrimary ? { primary: inheritedModelRef } : {},
				...Array.isArray(inheritedFallbacks) ? { fallbacks: [...inheritedFallbacks] } : {},
				...ownModel
			};
		}
		repairRetiredModelSlots({
			owner: agent,
			agentId,
			path,
			resolve,
			changes,
			warnings,
			inheritedModelRef,
			inheritedModels: asOptionalRecord(defaults?.models),
			inheritedModelPolicy: asOptionalRecord(defaults?.modelPolicy)
		});
	}
	const rewrite = createRetiredModelRefRewriter({
		path: "",
		resolve,
		changes,
		warnings
	});
	const rewriteAuth = createRetiredModelRefRewriter({
		path: "",
		resolve,
		changes,
		warnings,
		authProfileOnly: true
	});
	const rewriteSlot = (container, key, path, authProfileOnly = false) => rewriteModelReferenceSlot({
		container: asOptionalRecord(container),
		key,
		path,
		resolve: authProfileOnly ? rewriteAuth : rewrite
	});
	for (const capability of [
		"image",
		"audio",
		"video"
	]) rewriteSlot(config.tools?.media?.[capability], "preferredModel", `tools.media.${capability}.preferredModel`, true);
	rewriteSlot(config.tools?.exec?.reviewer, "model", "tools.exec.reviewer.model");
	rewriteSlot(config.tts, "summaryModel", "tts.summaryModel");
	rewriteSlot(config.hooks?.gmail, "model", "hooks.gmail.model");
	for (const [index, mapping] of (config.hooks?.mappings ?? []).entries()) rewriteSlot(mapping, "model", `hooks.mappings.${index}.model`);
	for (const [channel, targets] of Object.entries(config.channels?.modelByChannel ?? {})) for (const target of Object.keys(targets ?? {})) rewriteSlot(targets, target, `channels.modelByChannel.${channel}.${target}`);
	const discord = asOptionalRecord(config.channels?.discord);
	const rewriteVoice = (container, path) => {
		rewriteSlot(container, "model", `${path}.model`);
		rewriteSlot(asOptionalRecord(container)?.tts, "summaryModel", `${path}.tts.summaryModel`);
	};
	rewriteVoice(discord?.voice, "channels.discord.voice");
	for (const [account, settings] of Object.entries(asOptionalRecord(discord?.accounts) ?? {})) rewriteVoice(asOptionalRecord(settings)?.voice, `channels.discord.accounts.${account}.voice`);
	return {
		config: changes.length ? config : cfg,
		changes
	};
}
//#endregion
export { collectCodexRuntimeModelPolicyRefs as a, collectStringModelConfigRef as c, recordCodexModelHit as d, rewriteModelConfigSlot as f, repairRetiredModelSlots as i, collectStringModelSlot as l, rewriteStringModelSlot as m, repairModelRefAuthProfile as n, collectModelConfigRefs as o, rewriteModelsMap as p, repairRetiredConfigModelRefs as r, collectModelConfigSlot as s, createRetiredModelRefRepairResolver as t, modelConfigContainsRef as u };
