import { a as asOptionalRecord, c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { i as getGatewayPluginMetadataSnapshot } from "./current-plugin-metadata-state-CfLPTM0e.mjs";
import "./model-ref-shared-KBg0y299.mjs";
import { t as modelKey } from "./model-key-5zORvMDY.mjs";
import { i as buildModelAliasIndex, v as resolveModelRefFromString, y as readUtilityModelSetting } from "./model-selection-shared-DKlQ1p0S.mjs";
import { t as resolveDefaultModelForAgent } from "./model-selection-config-CsO-mXVD.mjs";
import { a as hasGatewayClientCap, t as GATEWAY_CLIENT_CAPS } from "./client-info-C8RatpKO.mjs";
import { n as readOperatorModelPolicyMembership, r as resolveOperatorModelDefault, t as prepareOperatorModelPolicy } from "./operator-model-policy-q5o4hsUa.mjs";
import { d as resolveOperatorRolePolicy } from "./operator-role-policy-BqPaarjx.mjs";
import { c as isTranscriptOnlyOpenClawAssistantModel } from "./transcript-only-openclaw-assistant-CzjHCvH2.mjs";
import { n as isSyntheticGatewayCaller } from "./gateway-personal-caller-CPQUGI4q.mjs";
import { t as getSessionDefaults } from "./session-utils-model-JtZ-2MzK.mjs";
import { n as createModelVisibilityPolicy } from "./model-visibility-policy-Dq4ZIwNP.mjs";
import { t as SerializedJsonArray } from "./serialized-json-B87207AB.mjs";
import { isDeepStrictEqual } from "node:util";
//#region src/gateway/session-fast-mode-presentation.ts
/** Released native decoders accept only booleans and "auto". Never rewrite stored selection. */
function prepareSessionFastModePresentation(client) {
	const supportsUltrafast = !client || isSyntheticGatewayCaller(client) || hasGatewayClientCap(client.connect.caps, GATEWAY_CLIENT_CAPS.ULTRAFAST);
	return (mode) => mode === "ultrafast" && !supportsUltrafast ? true : mode;
}
/** Creation replay retains the canonical result and presents its entry at delivery time. */
function projectSessionFastModeEntryResult(payload, client) {
	if (prepareSessionFastModePresentation(client)("ultrafast") !== true || !isRecord(payload) || !isRecord(payload.entry) || payload.entry.fastMode !== "ultrafast") return payload;
	return {
		...payload,
		entry: {
			...payload.entry,
			fastMode: true
		}
	};
}
/** Catalog caches stay canonical; each recipient decodes only its negotiated speed values. */
function projectModelFastModeCatalog(payload, client) {
	if (prepareSessionFastModePresentation(client)("ultrafast") !== true) return payload;
	const project = (models) => models.map((model) => ({
		...model,
		...model.effectiveFastMode === "ultrafast" ? { effectiveFastMode: true } : {},
		...model.runtimeChoices ? { runtimeChoices: model.runtimeChoices.map((choice) => choice.effectiveFastMode === "ultrafast" ? {
			...choice,
			effectiveFastMode: true
		} : choice) } : {}
	}));
	return {
		...payload,
		...payload.models ? { models: project(payload.models) } : {},
		...payload.decisionModels ? { decisionModels: project(payload.decisionModels) } : {}
	};
}
//#endregion
//#region src/gateway/operator-model-presentation.ts
/** Inventory/auth changes do not retire choices; changed selection authority does. */
function modelSelectionPoliciesMatch(previous, next) {
	if ((previous.models?.mode ?? "merge") !== (next.models?.mode ?? "merge") || !isDeepStrictEqual(previous.gateway?.roles, next.gateway?.roles)) return false;
	const manifestPlugins = getGatewayPluginMetadataSnapshot() ?? [];
	for (const role of Object.values(next.gateway?.roles?.definitions ?? {})) {
		const before = prepareOperatorModelPolicy({
			cfg: previous,
			policy: role.modelPolicy,
			manifestPlugins
		});
		const after = prepareOperatorModelPolicy({
			cfg: next,
			policy: role.modelPolicy,
			manifestPlugins
		});
		if (readOperatorModelPolicyMembership(before) !== readOperatorModelPolicyMembership(after)) return false;
	}
	const agentIds = /* @__PURE__ */ new Set([
		void 0,
		...Object.keys(previous.agents?.entries ?? {}),
		...Object.keys(next.agents?.entries ?? {})
	]);
	for (const agentId of agentIds) {
		const policy = (cfg) => {
			const model = resolveDefaultModelForAgent({
				cfg,
				agentId
			});
			return createModelVisibilityPolicy({
				cfg,
				agentId,
				catalog: [],
				defaultProvider: model.provider,
				defaultModel: model,
				manifestPlugins
			});
		};
		const before = policy(previous);
		const after = policy(next);
		if (before.allowAny !== after.allowAny || !before.allowAny && !isDeepStrictEqual(before.allowedKeys, after.allowedKeys)) return false;
	}
	return true;
}
/** History and startup share a final projection without changing any persisted session facts. */
function projectOperatorModelRead(scope, input) {
	const result = input.metadata ? {
		...input,
		metadata: projectModelFastModeCatalog(input.metadata, scope.client)
	} : input;
	const cfg = scope.context.getRuntimeConfig();
	const presentation = prepareOperatorModelPresentation({
		cfg,
		policyConfig: scope.context.getCommittedRuntimeConfig?.() ?? cfg,
		client: scope.client
	});
	if (!presentation) return result;
	const policy = result.defaults || result.metadata ? presentation.forAgent(scope.agentId, scope.catalog) : void 0;
	return {
		...result,
		...result.defaults && policy ? { defaults: policy.defaults(result.defaults) } : {},
		...result.metadata && policy ? { metadata: policy.metadata(result.metadata) } : {},
		...result.sessionInfo ? { sessionInfo: presentation.session(result.sessionInfo) } : {},
		...result.messages ? { messages: (result.messages instanceof SerializedJsonArray ? result.messages.materialize() : result.messages).map(result.kind === "delta" ? presentation.deltaMessage : presentation.message) } : {},
		...Object.hasOwn(result, "message") ? { message: presentation.message(result.message) } : {}
	};
}
/** Build after read preparation; responses consume current role and prepared metadata together. */
function prepareOperatorModelPresentation(params) {
	const { cfg, policyConfig, client } = params;
	const modelPolicy = resolveOperatorRolePolicy(client, policyConfig)?.modelPolicy;
	if (!modelPolicy) return;
	const metadataSnapshot = params.metadataSnapshot ?? getGatewayPluginMetadataSnapshot();
	const manifestPlugins = metadataSnapshot ?? [];
	const policy = prepareOperatorModelPolicy({
		cfg: policyConfig,
		policy: modelPolicy,
		manifestPlugins
	});
	if (!policy) return;
	const filterModels = (models) => models.filter((model) => policy.allows({
		provider: model.provider,
		model: model.id
	}));
	const hidden = (provider, model) => (provider != null || model != null) && (typeof provider !== "string" || typeof model !== "string" || !policy.allows({
		provider,
		model
	}));
	const projectSession = (row) => {
		const hideModel = hidden(row.modelProvider, row.model);
		const hideActiveModel = hidden(row.activeModelProvider, row.activeModel);
		const budget = asOptionalRecord(row.contextBudgetStatus);
		const hideBudget = budget && hidden(budget.provider, budget.model);
		if (!hideModel && !hideActiveModel && !hideBudget) return row;
		const projected = { ...row };
		for (const field of ["modelProvider", "model"]) if (hideModel && projected[field] != null) delete projected[field];
		for (const field of ["activeModelProvider", "activeModel"]) if (hideActiveModel && projected[field] != null) delete projected[field];
		if (hideBudget) delete projected.contextBudgetStatus;
		return projected;
	};
	const projectMessage = (value) => {
		const message = asOptionalRecord(value);
		if (!message || message.role !== "assistant" || isTranscriptOnlyOpenClawAssistantModel(message.provider, message.model) || !hidden(message.provider, message.model)) return value;
		const projected = { ...message };
		for (const field of ["provider", "model"]) if (projected[field] != null) delete projected[field];
		return projected;
	};
	return {
		session: projectSession,
		message: projectMessage,
		deltaMessage(value) {
			const envelope = asOptionalRecord(value);
			if (!envelope) return value;
			const session = asOptionalRecord(envelope.session);
			return {
				...projectSession(envelope),
				...session ? { session: projectSession(session) } : {},
				...Object.hasOwn(envelope, "message") ? { message: projectMessage(envelope.message) } : {}
			};
		},
		forAgent(agentId, catalog = []) {
			const normalization = {
				cfg,
				agentId,
				manifestPlugins,
				allowManifestNormalization: true,
				allowPluginNormalization: false
			};
			const configuredDefault = resolveDefaultModelForAgent(normalization);
			const selection = {
				...normalization,
				defaultProvider: configuredDefault.provider
			};
			let aliasIndex;
			const allowedReference = (raw) => {
				const ref = resolveModelRefFromString({
					...selection,
					raw,
					aliasIndex: aliasIndex ??= buildModelAliasIndex(selection)
				})?.ref;
				return ref && policy.allows(ref) ? ref : void 0;
			};
			let manualPolicy;
			const defaultModel = resolveOperatorModelDefault({
				...normalization,
				policy,
				model: configuredDefault,
				allows: (ref) => (manualPolicy ??= createModelVisibilityPolicy({
					...normalization,
					catalog,
					defaultProvider: configuredDefault.provider,
					defaultModel: configuredDefault
				})).allows(ref)
			});
			const modelSelectionPolicy = {
				restricted: true,
				defaultModel: defaultModel ? modelKey(defaultModel.provider, defaultModel.model) : null
			};
			const projectDefaults = (defaults) => {
				if (!defaultModel) return {
					model: null,
					modelProvider: null,
					contextTokens: null,
					...defaults.modelSelectionTarget ? { modelSelectionTarget: defaults.modelSelectionTarget } : {}
				};
				if (defaultModel.provider === defaults.modelProvider && defaultModel.model === defaults.model) return defaults;
				return {
					...getSessionDefaults(cfg, catalog, {
						agentId,
						modelRef: defaultModel,
						metadataSnapshot,
						allowPluginNormalization: false,
						providerPolicySource: "active"
					}),
					...defaults.modelSelectionTarget ? { modelSelectionTarget: defaults.modelSelectionTarget } : {}
				};
			};
			return {
				catalog(result) {
					const models = filterModels(result.models);
					const decisionModels = result.decisionModels && filterModels(result.decisionModels);
					const utilityModel = result.defaultModels?.automaticUtilityModel ? allowedReference(result.defaultModels.automaticUtilityModel) : void 0;
					const utilitySetting = result.defaultModels?.utilityRuntime ? readUtilityModelSetting(cfg) : void 0;
					const utilityRuntimeVisible = utilitySetting?.kind === "auto" ? utilityModel !== void 0 : utilitySetting?.kind === "explicit" && allowedReference(utilitySetting.modelRef) !== void 0;
					const visibleProviders = new Set(models.map(({ provider }) => provider));
					for (const model of decisionModels ?? []) visibleProviders.add(model.provider);
					if (defaultModel) visibleProviders.add(defaultModel.provider);
					if (utilityModel) visibleProviders.add(utilityModel.provider);
					const disclosedProfileId = result.accountSelection?.kind === "automatic" ? void 0 : result.accountSelection?.authProfileId;
					const providerOutcomes = (result.providerOutcomes ?? []).filter(({ provider, profileId }) => visibleProviders.has(provider) && (!profileId || profileId === disclosedProfileId));
					return {
						...result,
						models,
						modelSelectionPolicy,
						pendingProviders: (result.pendingProviders ?? []).filter((provider) => visibleProviders.has(provider)),
						providerOutcomes,
						refreshFailed: result.refreshFailed === true && providerOutcomes.some(({ status }) => status !== "ready"),
						...decisionModels ? { decisionModels } : {},
						...result.defaultModels ? { defaultModels: {
							automaticUtilityModel: utilityModel ? result.defaultModels.automaticUtilityModel : null,
							...utilityRuntimeVisible && result.defaultModels.utilityRuntime ? { utilityRuntime: result.defaultModels.utilityRuntime } : {}
						} } : {}
					};
				},
				metadata(result) {
					return {
						...result,
						...result.models ? { models: filterModels(result.models) } : {},
						modelSelectionPolicy
					};
				},
				defaults: projectDefaults,
				agent(row) {
					const { model: _model, utilityModel, agentRuntime: _runtime, thinkingLevels: _levels, thinkingOptions: _options, thinkingDefault: _thinking, ...identity } = row;
					const defaults = projectDefaults({
						model: null,
						modelProvider: null,
						contextTokens: null
					});
					return {
						...identity,
						model: {
							...modelSelectionPolicy.defaultModel ? { primary: modelSelectionPolicy.defaultModel } : {},
							...row.model?.fallbacks ? { fallbacks: row.model.fallbacks.filter((ref) => allowedReference(ref)) } : {}
						},
						...utilityModel && allowedReference(utilityModel) ? { utilityModel } : {},
						agentRuntime: defaults.agentRuntime,
						thinkingLevels: defaults.thinkingLevels,
						thinkingOptions: defaults.thinkingOptions,
						thinkingDefault: defaults.thinkingDefault
					};
				}
			};
		}
	};
}
//#endregion
export { projectModelFastModeCatalog as a, prepareSessionFastModePresentation as i, prepareOperatorModelPresentation as n, projectSessionFastModeEntryResult as o, projectOperatorModelRead as r, modelSelectionPoliciesMatch as t };
