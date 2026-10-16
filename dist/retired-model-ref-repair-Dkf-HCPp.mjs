import { c as normalizeOptionalLowercaseString } from "./string-coerce-1VuiLaaR.mjs";
import { a as asOptionalRecord } from "./record-coerce-TIsquoVR.mjs";
import { r as normalizeProviderId } from "./provider-id-D1VImdKk.mjs";
import { a as resolveAgentDir, d as resolveAgentWorkspaceDir, v as resolveMutableAgentEntry } from "./agent-scope-config-CDYpzA0r.mjs";
import { i as listAgentIds } from "./agent-roster-BXD1uMJD.mjs";
import { t as createInstalledPluginEnabledPredicate } from "./installed-plugin-index-Zl-RSskC.mjs";
import { u as normalizePluginsConfig } from "./config-state-DY_WJYue.mjs";
import { t as mergeAgentModelEntryForConfig } from "./model-input-C9K4a_6k.mjs";
import { n as DEFAULT_MODEL, r as DEFAULT_PROVIDER } from "./defaults-Jag53zwP.mjs";
import { t as splitTrailingAuthProfile } from "./model-ref-profile-BNjB2hED.mjs";
import { u as resolveAgentModelFallbacksOverride } from "./agent-scope-CG17uXFn.mjs";
import { a as resolveMergedModelProviderConfig, i as projectModelProviderConfig, r as findConfiguredProviderModel } from "./model-provider-config-C5LPYz3z.mjs";
import { g as toCanonicalOpenAIModelRef, i as isBlockedLegacyCodexModelRef, p as readModelConfigPrimaryRef } from "./codex-route-model-ref-CA8y5Vff.mjs";
import { a as normalizeOptionalAgentRuntimeId } from "./agent-runtime-id-BZLMe-UU.mjs";
import { N as listModelRefsFromConfigValue, P as visitModelSelectorRefs } from "./runtime-snapshot-DYptB0Cf.mjs";
import { c as loadManifestMetadataSnapshot, n as isManifestPluginAvailableForControlPlane } from "./manifest-contract-eligibility-CJLBUUHI.mjs";
import { h as resolveConfiguredModelRef, i as buildModelAliasIndex, l as isModelKeyAllowedBySet, m as resolveConfiguredModelPolicyAllow, n as buildAllowedModelSet, v as resolveModelRefFromString } from "./model-selection-shared-BZeDVoch.mjs";
import { n as resolveProviderModelMaterializationAuthMode } from "./provider-model-route-auth-Cbwct-ZM.mjs";
import { a as projectProviderModelRouteConfig, t as canonicalizeProviderModelId } from "./provider-model-route-BpciAISP.mjs";
import { t as listMutableCodexRouteAgentEntries } from "./codex-route-agent-entries-B6LYojZK.mjs";
import { c as loadAuthProfileStoreForSecretsRuntime } from "./store-runtime-CzCCJ_Oe.mjs";
import { l as resolvePluginModelCatalogOwnerPluginId } from "./plugin-model-catalog-BkfUsFfG.mjs";
import { t as buildManifestBuiltInModelSuppressionResolver } from "./manifest-model-suppression-DKftbsu2.mjs";
import { t as createModelAuthAvailabilityResolver } from "./model-auth-availability-Cv_2tZ2X.mjs";
//#region src/commands/doctor/shared/codex-route-model-slots.ts
function visitChannelModelSlots(cfg, visit) {
	const modelByChannel = asOptionalRecord(cfg.channels?.modelByChannel);
	for (const [channelId, channelMap] of Object.entries(modelByChannel ?? {})) {
		const container = asOptionalRecord(channelMap);
		if (!container) continue;
		for (const key of Object.keys(container)) visit({
			container,
			key,
			path: `channels.modelByChannel.${channelId}.${key}`
		});
	}
}
function visitNonAgentModelSlots(cfg, visit) {
	visitChannelModelSlots(cfg, visit);
	for (const [index, mapping] of (cfg.hooks?.mappings ?? []).entries()) visit({
		container: mapping,
		key: "model",
		path: `hooks.mappings.${index}.model`
	});
	for (const [container, key, path] of [
		[
			asOptionalRecord(cfg.hooks?.gmail),
			"model",
			"hooks.gmail.model"
		],
		[
			asOptionalRecord(cfg.tts),
			"summaryModel",
			"tts.summaryModel"
		],
		[
			asOptionalRecord(asOptionalRecord(cfg.channels?.discord)?.voice),
			"model",
			"channels.discord.voice.model"
		]
	]) if (container) visit({
		container,
		key,
		path
	});
}
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
		canonicalModel
	});
	return canonicalModel;
}
function collectStringModelSlot(params) {
	if (typeof params.value !== "string") return;
	recordCodexModelHit({
		hits: params.hits,
		path: params.path,
		model: params.value.trim(),
		blockedModelIdentities: params.blockedModelIdentities
	});
}
function collectModelConfigSlot(params) {
	visitModelSelectorRefs(params.value, params.path, (path, value) => {
		collectStringModelSlot({
			...params,
			path,
			value
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
		if (normalizeOptionalAgentRuntimeId(asOptionalRecord(asOptionalRecord(entry)?.agentRuntime)?.id) === "codex") params.refs.push({
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
		resolve: (model, path) => recordCodexModelHit({
			...params,
			model,
			path
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
//#region src/commands/doctor/shared/retired-model-ref-settings.ts
function modelSettingsWithoutAlias(value) {
	const record = asOptionalRecord(value);
	if (!record) return value;
	const { alias: _alias, ...settings } = record;
	return settings;
}
function mergeRetiredModelSettings(params) {
	return [
		params.retainSource ? modelSettingsWithoutAlias(params.inheritedSource) : params.inheritedSource,
		params.inheritedSuccessor,
		params.retainSource ? modelSettingsWithoutAlias(params.source) : params.source,
		params.successor
	].filter((value) => value !== void 0).reduce(mergeAgentModelEntryForConfig, void 0);
}
/** Read-only auth evaluation must see the settings the repair will preserve. */
function projectRetiredModelSuccessorConfig(params) {
	const { cfg, agentId, sourceModelRef, successorModelRef } = params;
	const entry = resolveMutableAgentEntry(cfg, agentId);
	const inheritedModels = cfg.agents?.defaults?.models;
	const models = entry?.models;
	const retainSource = params.retirementScope === "route";
	let settings = models?.[successorModelRef];
	let matchedSource = false;
	for (const [modelRef, inherited] of Object.entries(inheritedModels ?? {})) {
		if (params.resolveModelRef(modelRef) !== sourceModelRef) continue;
		matchedSource = true;
		settings = mergeRetiredModelSettings({
			inheritedSource: inherited,
			inheritedSuccessor: inheritedModels?.[successorModelRef],
			source: models?.[modelRef],
			successor: settings,
			retainSource
		});
	}
	for (const [modelRef, source] of Object.entries(models ?? {})) {
		if (params.resolveModelRef(modelRef) !== sourceModelRef) continue;
		matchedSource = true;
		settings = mergeRetiredModelSettings({
			source,
			successor: settings,
			retainSource
		});
	}
	if (!matchedSource || settings === void 0) return cfg;
	if (!entry) return {
		...cfg,
		agents: {
			...cfg.agents,
			defaults: {
				...cfg.agents?.defaults,
				models: {
					...inheritedModels,
					[successorModelRef]: settings
				}
			}
		}
	};
	const projectedModels = {
		...models,
		[successorModelRef]: settings
	};
	const agents = { ...cfg.agents };
	if (agents.entries) {
		agents.entries = { ...agents.entries };
		for (const [id, candidate] of Object.entries(agents.entries)) if (candidate === entry) agents.entries[id] = {
			...candidate,
			models: projectedModels
		};
	} else if (agents.list) {
		agents.list = agents.list.slice();
		for (const [index, candidate] of agents.list.entries()) if (candidate === entry) agents.list[index] = {
			...candidate,
			models: projectedModels
		};
	}
	return {
		...cfg,
		agents
	};
}
//#endregion
//#region src/commands/doctor/shared/retired-model-ref-owner.ts
function createRetiredModelRefOwners(params) {
	const env = params.env ?? process.env;
	const agents = params.agentIds ?? listAgentIds(params.cfg);
	const normalizedPluginsConfig = normalizePluginsConfig(params.cfg.plugins);
	return new Map(agents.map((agentId) => {
		const agentDir = resolveAgentDir(params.cfg, agentId, env);
		const workspaceDir = resolveAgentWorkspaceDir(params.cfg, agentId);
		const metadataSnapshot = params.metadataSnapshot ?? loadManifestMetadataSnapshot({
			config: params.cfg,
			workspaceDir,
			env
		});
		const isInstalledPluginEnabled = createInstalledPluginEnabledPredicate(metadataSnapshot.index.plugins, params.cfg);
		const authViews = /* @__PURE__ */ new Map();
		const successorConfigs = /* @__PURE__ */ new Map();
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
			successorConfig(change) {
				const key = JSON.stringify(change);
				let config = successorConfigs.get(key);
				if (!config) {
					config = projectRetiredModelSuccessorConfig({
						cfg: params.cfg,
						agentId,
						...change,
						resolveModelRef: (raw) => {
							const ref = model.resolve(raw);
							return ref ? `${ref.provider}/${canonicalizeProviderModelId(ref.provider, ref.model)}` : void 0;
						}
					});
					successorConfigs.set(key, config);
				}
				return config;
			},
			auth(profileId, config = params.cfg) {
				let views = authViews.get(config);
				if (!views) {
					views = /* @__PURE__ */ new Map();
					authViews.set(config, views);
				}
				let view = views.get(profileId);
				if (!view) {
					view = createModelAuthAvailabilityResolver({
						cfg: config,
						agentId,
						agentDir,
						workspaceDir,
						env,
						metadataSnapshot,
						authStore: loadAuthProfileStoreForSecretsRuntime(agentDir, {
							config,
							profileId
						})
					});
					views.set(profileId, view);
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
}
//#endregion
//#region src/commands/doctor/shared/retired-model-successor-guard.ts
function resolveSuccessorModelRepair(params) {
	const { owner, provider, canonical, agentId } = params;
	const successor = params.retirement.replacedBy;
	if (!successor) return {
		kind: "clear",
		provider,
		modelRef: canonical,
		retirementScope: params.retirementScope
	};
	const successorId = canonicalizeProviderModelId(provider, successor);
	const successorConfig = owner.successorConfig({
		sourceModelRef: canonical,
		successorModelRef: `${provider}/${successor}`,
		retirementScope: params.retirementScope
	});
	const parsed = splitTrailingAuthProfile(params.modelRefInput);
	const pinnedProfileId = (params.authProfileSource === "user" || params.authProfileSource === "user-link" ? params.authProfileId : void 0) ?? parsed.profile;
	const preferredProfileId = pinnedProfileId ? void 0 : params.authProfileId;
	const support = owner.auth(pinnedProfileId ?? preferredProfileId, successorConfig).evaluateRuntimeModelAuth(provider, {
		modelId: successorId,
		pinnedProfileId,
		preferredProfileId
	});
	if (support.availability === false && (support.routeResolution?.kind === "incompatible" || support.availabilityAuthoritative && support.unavailableReason !== "cooldown")) {
		params.warn(`Retained ${canonical} for agent "${agentId}": successor "${provider}/${successor}" is not supported by this agent's authentication route. Choose a supported model explicitly and rerun openclaw doctor --fix.`);
		return params.validatePolicy(params.preserved);
	}
	const routeConfig = support.selectedRoute ? projectProviderModelRouteConfig({
		provider,
		config: successorConfig,
		route: support.selectedRoute
	}) : params.suppressionConfig;
	if ((routeConfig ? owner.suppression(routeConfig)({
		provider,
		id: successorId,
		baseUrl: support.selectedRoute?.baseUrl ?? params.suppressionBaseUrl
	}) : owner.suppression()({
		provider,
		id: successorId,
		unconditionalOnly: true
	}))?.retirement) {
		params.warn(`Retained ${canonical} for agent "${agentId}": successor "${provider}/${successor}" is retired. Choose a supported model explicitly and rerun openclaw doctor --fix.`);
		return params.validatePolicy(params.preserved);
	}
	const modelRef = `${provider}/${successor}`;
	return params.validatePolicy({
		kind: "replace",
		modelRef: parsed.profile ? `${modelRef}@${parsed.profile}` : modelRef,
		reason: "retirement",
		retirementScope: params.retirementScope
	});
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
	const warn = (message) => {
		if (params.warnings && !params.warnings.includes(message)) params.warnings.push(message);
	};
	const owners = createRetiredModelRefOwners(params);
	const agents = [...owners.keys()];
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
		let successorSuppressionConfig;
		let successorBaseUrl;
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
			successorSuppressionConfig = routeConfig;
			successorBaseUrl = baseUrl;
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
		return resolveSuccessorModelRepair({
			owner,
			provider,
			canonical,
			agentId,
			modelRefInput: input.modelRef,
			authProfileId: input.authProfileId,
			authProfileSource: input.authProfileSource,
			retirement: rule.retirement,
			retirementScope,
			suppressionConfig: successorSuppressionConfig,
			suppressionBaseUrl: successorBaseUrl,
			preserved,
			validatePolicy,
			warn
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
function createRetiredModelSlotRewriter(params) {
	const rewrite = createRetiredModelRefRewriter(params);
	const rewriteAuth = createRetiredModelRefRewriter({
		...params,
		authProfileOnly: true
	});
	return (container, key, path, authProfileOnly = false) => rewriteModelReferenceSlot({
		container: asOptionalRecord(container),
		key,
		path,
		resolve: authProfileOnly ? rewriteAuth : rewrite
	});
}
/** Apply the same retirement decision to config selectors and cron payload selectors. */
function repairRetiredModelSlots(params) {
	const rewriteSlot = createRetiredModelSlotRewriter(params);
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
		const settings = mergeRetiredModelSettings({
			inheritedSource: inherited,
			inheritedSuccessor: params.inheritedModels?.[decision.modelRef],
			source: models?.[modelRef],
			successor: models?.[decision.modelRef],
			retainSource: retainAlias
		});
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
	const rewriteSlot = createRetiredModelSlotRewriter({
		path: "",
		resolve,
		changes,
		warnings
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
export { collectCodexRuntimeModelPolicyRefs as a, collectStringModelConfigRef as c, recordCodexModelHit as d, rewriteModelConfigSlot as f, visitNonAgentModelSlots as g, visitChannelModelSlots as h, repairRetiredModelSlots as i, collectStringModelSlot as l, rewriteStringModelSlot as m, repairModelRefAuthProfile as n, collectModelConfigRefs as o, rewriteModelsMap as p, repairRetiredConfigModelRefs as r, collectModelConfigSlot as s, createRetiredModelRefRepairResolver as t, modelConfigContainsRef as u };
