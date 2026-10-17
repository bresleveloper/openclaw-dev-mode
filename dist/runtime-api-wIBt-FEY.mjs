import { l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
import { m as clampTimerTimeoutMs } from "./number-coercion-CuVhdCBs.mjs";
import { t as asNonArrayRecord } from "./record-coerce-TIsquoVR.mjs";
import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { _ as redactSensitiveText } from "./redact-DJ8j6ADa.mjs";
import { t as mergeDeep } from "./deep-merge-B-AVx-Uc.mjs";
import "./utils-DgZn2dLu.mjs";
import { t as formatErrorMessage } from "./errors-O33D01XW.mjs";
import { t as isVerbose } from "./global-state-BAD7XgmL.mjs";
import { t as _usingCtx } from "./usingCtx-DwOBYOJf.mjs";
import { r as createRuntimeConfigReader } from "./runtime-snapshot-DYptB0Cf.mjs";
import { i as getLegacyPluginSdkResourceHost } from "./legacy-sdk-resource-host-DC4n8Jcn.mjs";
import { n as normalizeMessageChannel } from "./message-channel-core-CqBAHB04.mjs";
import { r as assertSecretOwnerAvailable } from "./runtime-degraded-state-oevwKU3u.mjs";
import { i as logVerbose } from "./globals-BXbZ1A_g.mjs";
import { o as hasReplyPayloadContent } from "./payload-DfZ7JVGs.mjs";
import { c as getReplyPayloadMetadata, x as markReplyPayloadAsTtsSupplement } from "./reply-payload-NzglYOOT.mjs";
import { t as readTtsPrefs } from "./tts-config-CxmNZyL1.mjs";
import { i as normalizeCapabilityProviderId } from "./provider-registry-shared-Cov0065J.mjs";
import { a as resolvePluginCapabilityProviders, d as resolveVoiceModelRefs, f as resolveVoiceProviderCandidates, i as resolvePluginCapabilityProvider, l as resolvePrimaryVoiceProviderCandidate, p as voiceProviderSupportsModel, u as resolveSupportedVoiceModelRefs } from "./capability-provider-runtime-BUYIpbkx.mjs";
import { n as privateFileStoreSync } from "./private-file-store-DM0i141q.mjs";
import { t as transcodeAudioBuffer } from "./media-services-BkfwjOhK.mjs";
import { t as getChannelPlugin } from "./registry-DOE8N7Jo.mjs";
import { a as resolveSendableOutboundReplyParts } from "./reply-payload-parts-BtASEhL4.mjs";
import { t as resolveChannelTtsVoiceDelivery } from "./tts-capabilities-DX-nZPrc.mjs";
import { a as getSpeechProvider, c as compareSpeechProviderOrder, i as canonicalizeSpeechProviderId, l as createSpeechProviderRegistry, n as parseTtsDirectives, r as resolveTtsDirectiveFacts, s as listSpeechProviders } from "./directives-C6jXm9yj.mjs";
import { _ as resolveTtsPrefsPath, d as normalizeTtsPersonaId, f as resolveModelOverridePolicy, h as resolveTtsPersonaFromPrefs, i as getTtsMaxLength, m as resolveTtsConfig, n as asProviderConfig, o as isSummarizationEnabled, u as normalizeConfiguredSpeechProviderId, v as resolveTtsRuntimeConfig, x as withSpeakerSelectionCompat, y as resolveTtsSettingsSnapshot } from "./tts-settings-BjvUxLqs.mjs";
import { n as finishCapabilityOperation, t as acquirePluginCapabilityProviders } from "./capability-provider-acquisition-Bu9o_rUB.mjs";
import { r as countMarkdownFencedCodeChars } from "./ir-DVQ4VPle.mjs";
import { t as summarizeText } from "./tts-core-BvDoZE6y.mjs";
import { t as stripMarkdown } from "./strip-markdown-CRKxg_-Y.mjs";
import { t as createLegacyPluginSdkProviderProjection } from "./legacy-sdk-provider-projection-BsT-Rpn5.mjs";
import path from "node:path";
import { AsyncLocalStorage } from "node:async_hooks";
//#region src/tts/tts-provider-resolution.ts
const defaultProviderRegistry = {
	canonicalizeSpeechProviderId,
	getSpeechProvider,
	listSpeechProviders
};
function resolveProviderRuntimeConfig(cfg, registry) {
	return registry.runtimeConfig ?? resolveTtsRuntimeConfig(cfg);
}
function resolvePositiveTimeoutMs(timeoutMs) {
	return typeof timeoutMs === "number" && Number.isFinite(timeoutMs) && timeoutMs > 0 ? clampTimerTimeoutMs(timeoutMs) : void 0;
}
function resolveSpeechProviderTimeoutMs(params) {
	if (params.timeoutMs !== void 0) return resolvePositiveTimeoutMs(params.timeoutMs) ?? params.config.timeoutMs;
	if (params.config.timeoutMsSource !== "default") return resolvePositiveTimeoutMs(params.config.timeoutMs) ?? 3e4;
	return resolvePositiveTimeoutMs(params.provider.defaultTimeoutMs) ?? params.config.timeoutMs;
}
function sortSpeechProvidersForAutoSelection(cfg, providers, registry = defaultProviderRegistry) {
	return (providers ?? registry.listSpeechProviders(cfg)).toSorted(compareSpeechProviderOrder);
}
function canonicalizeSpeechProviderIdFromInventory(providerId, cfg, providers) {
	const normalized = normalizeCapabilityProviderId(providerId);
	if (!normalized) return;
	if (!providers) return canonicalizeSpeechProviderId(providerId, cfg);
	return providers.find((provider) => normalizeCapabilityProviderId(provider.id) === normalized || provider.aliases?.some((alias) => normalizeCapabilityProviderId(alias) === normalized))?.id ?? canonicalizeSpeechProviderId(providerId, cfg) ?? normalized;
}
function resolveConfiguredSpeechVoiceModelRefs(cfg, providers, registry = defaultProviderRegistry) {
	const effectiveCfg = cfg ? resolveProviderRuntimeConfig(cfg, registry) : void 0;
	return resolveSupportedVoiceModelRefs({
		config: effectiveCfg?.agents?.defaults?.voiceModel,
		providers: sortSpeechProvidersForAutoSelection(effectiveCfg, providers, registry)
	});
}
function applyVoiceModelToSpeechProviderConfig(params) {
	const registry = params.registry ?? defaultProviderRegistry;
	const provider = params.provider ?? registry.getSpeechProvider(params.providerId, params.cfg);
	const voiceModel = params.voiceModel ? voiceProviderSupportsModel(provider, params.voiceModel.model) ? params.voiceModel : void 0 : resolveSupportedVoiceModelRefs({
		config: params.cfg?.agents?.defaults?.voiceModel,
		providers: provider ? [provider] : [],
		providerId: params.providerId
	})[0];
	if (!voiceModel) return params.providerConfig;
	if (normalizeOptionalString(params.providerConfig.model) || normalizeOptionalString(params.providerConfig.modelId)) return params.providerConfig;
	return {
		...params.providerConfig,
		model: voiceModel.model,
		modelId: voiceModel.model
	};
}
function resolvePersonaProviderConfig(persona, providerId) {
	if (!persona?.providers) return;
	const normalized = normalizeConfiguredSpeechProviderId(providerId) ?? providerId;
	if (Object.hasOwn(persona.providers, normalized)) return persona.providers[normalized];
	if (Object.hasOwn(persona.providers, providerId)) return persona.providers[providerId];
}
function mergeProviderConfigWithPersona(params) {
	if (!params.persona) return {
		providerConfig: params.providerConfig,
		personaBinding: "none"
	};
	const personaProviderConfig = resolvePersonaProviderConfig(params.persona, params.providerId);
	if (!personaProviderConfig) return {
		providerConfig: params.providerConfig,
		personaBinding: "missing"
	};
	return {
		providerConfig: {
			...params.providerConfig,
			...personaProviderConfig
		},
		personaProviderConfig,
		personaBinding: "applied"
	};
}
function resolveRawProviderConfig(raw, providerId) {
	if (!raw) return {};
	const direct = asNonArrayRecord(raw.providers)[providerId] ?? raw[providerId];
	return asProviderConfig(direct);
}
function resolveLazyProviderConfig(config, providerId, cfg, voiceModel, provider, registry = defaultProviderRegistry) {
	const canonical = normalizeConfiguredSpeechProviderId(providerId) ?? normalizeLowercaseStringOrEmpty(providerId);
	const existing = voiceModel ? void 0 : config.providerConfigs[canonical];
	const effectiveCfg = cfg ? resolveProviderRuntimeConfig(cfg, registry) : config.sourceConfig;
	if (existing && !effectiveCfg) return existing;
	const rawConfig = resolveRawProviderConfig(config.rawConfig, canonical);
	const rawBaseConfig = config.rawConfig;
	const rawProviders = asNonArrayRecord(config.rawConfig?.providers);
	const resolvedProvider = provider ?? registry.getSpeechProvider(canonical, effectiveCfg);
	let hasRawProviderConfig = Object.hasOwn(rawProviders, canonical) || (rawBaseConfig ? Object.hasOwn(rawBaseConfig, canonical) : false);
	let rawProviderConfig = rawProviders[canonical] ?? rawBaseConfig?.[canonical];
	if (!hasRawProviderConfig) for (const alias of resolvedProvider?.aliases ?? []) {
		const normalizedAlias = normalizeCapabilityProviderId(alias);
		if (!normalizedAlias) continue;
		if (Object.hasOwn(rawProviders, normalizedAlias)) {
			hasRawProviderConfig = true;
			rawProviderConfig = rawProviders[normalizedAlias];
			break;
		}
		if (rawBaseConfig && Object.hasOwn(rawBaseConfig, normalizedAlias)) {
			hasRawProviderConfig = true;
			rawProviderConfig = rawBaseConfig[normalizedAlias];
			break;
		}
	}
	const compatRawProviderConfig = applyVoiceModelToSpeechProviderConfig({
		cfg: effectiveCfg,
		providerId: canonical,
		providerConfig: asProviderConfig(rawProviderConfig),
		provider: resolvedProvider,
		voiceModel,
		registry
	});
	const shouldInjectCanonicalProviderConfig = hasRawProviderConfig || Boolean(voiceModel) || Object.keys(rawProviders).length === 0;
	const rawConfigForProvider = {
		...rawBaseConfig,
		providers: shouldInjectCanonicalProviderConfig ? {
			...rawProviders,
			[canonical]: compatRawProviderConfig
		} : rawProviders,
		...shouldInjectCanonicalProviderConfig ? { [canonical]: compatRawProviderConfig } : {}
	};
	const next = withSpeakerSelectionCompat(effectiveCfg && resolvedProvider?.resolveConfig ? resolvedProvider.resolveConfig({
		cfg: effectiveCfg,
		rawConfig: rawConfigForProvider,
		timeoutMs: resolveSpeechProviderTimeoutMs({
			config,
			provider: resolvedProvider
		})
	}) : applyVoiceModelToSpeechProviderConfig({
		cfg: effectiveCfg,
		providerId: canonical,
		providerConfig: rawConfig,
		provider: resolvedProvider,
		voiceModel,
		registry
	}));
	if (!voiceModel) config.providerConfigs[canonical] = next;
	return next;
}
function getResolvedSpeechProviderConfig(config, providerId, cfg) {
	return resolveSpeechProviderConfig(config, providerId, cfg, defaultProviderRegistry);
}
function resolveSpeechProviderConfig(config, providerId, cfg, registry, voiceModel) {
	const effectiveCfg = cfg ? resolveProviderRuntimeConfig(cfg, registry) : config.sourceConfig;
	return resolveLazyProviderConfig(config, registry.canonicalizeSpeechProviderId(providerId, effectiveCfg) ?? normalizeConfiguredSpeechProviderId(providerId) ?? normalizeLowercaseStringOrEmpty(providerId), effectiveCfg, voiceModel, void 0, registry);
}
function getResolvedSpeechProviderConfigForVoiceModel(params) {
	return resolveSpeechProviderConfig(params.config, params.providerId, params.cfg, params.registry ?? defaultProviderRegistry, params.voiceModel);
}
function resolveTtsProvider(config, prefsPath, registry = defaultProviderRegistry, prefs = readTtsPrefs(prefsPath)) {
	const prefsProvider = registry.canonicalizeSpeechProviderId(prefs.tts?.provider) ?? normalizeConfiguredSpeechProviderId(prefs.tts?.provider);
	if (prefsProvider) return prefsProvider;
	const activePersona = resolveTtsPersonaFromPrefs(config, prefs);
	const personaProvider = registry.canonicalizeSpeechProviderId(activePersona?.provider, config.sourceConfig) ?? normalizeConfiguredSpeechProviderId(activePersona?.provider);
	if (personaProvider && registry.getSpeechProvider(personaProvider, config.sourceConfig)) return personaProvider;
	if (config.providerSource === "config") return normalizeConfiguredSpeechProviderId(config.provider) ?? config.provider;
	const configuredVoiceProvider = resolveConfiguredSpeechVoiceModelRefs(config.sourceConfig, void 0, registry)[0]?.provider;
	if (configuredVoiceProvider && registry.getSpeechProvider(configuredVoiceProvider, config.sourceConfig)) return configuredVoiceProvider;
	const effectiveCfg = config.sourceConfig;
	for (const provider of sortSpeechProvidersForAutoSelection(effectiveCfg, void 0, registry)) if (isSpeechProviderConfigured(config, provider.id, effectiveCfg, registry)) return provider.id;
	return config.provider;
}
function resolvePreparedTtsProvider(params) {
	const effectiveCfg = params.config.sourceConfig;
	if (params.preference?.source === "prefs") return canonicalizeSpeechProviderIdFromInventory(params.preference.provider, effectiveCfg, params.providers) ?? params.preference.provider;
	if (params.preference?.source === "persona") {
		const preferredProvider = params.preference.provider;
		const personaProvider = params.providers.find((provider) => normalizeCapabilityProviderId(provider.id) === normalizeCapabilityProviderId(preferredProvider) || provider.aliases?.some((alias) => normalizeCapabilityProviderId(alias) === normalizeCapabilityProviderId(preferredProvider))) ?? getSpeechProvider(preferredProvider, effectiveCfg);
		if (personaProvider) return personaProvider.id;
	}
	if (params.preference?.source === "config") return normalizeConfiguredSpeechProviderId(params.preference.provider) ?? params.preference.provider;
	const configuredVoiceProvider = resolveConfiguredSpeechVoiceModelRefs(effectiveCfg, params.providers)[0]?.provider;
	if (configuredVoiceProvider) return configuredVoiceProvider;
	for (const provider of sortSpeechProvidersForAutoSelection(effectiveCfg, params.providers)) if (params.configuredByProvider.get(provider.id) === true) return provider.id;
	return params.config.provider;
}
function resolveTtsProviderOrder(primary, cfg, providers) {
	const effectiveCfg = cfg ? resolveTtsRuntimeConfig(cfg) : void 0;
	const normalizedPrimary = canonicalizeSpeechProviderIdFromInventory(primary, effectiveCfg, providers) ?? primary;
	const ordered = /* @__PURE__ */ new Set([normalizedPrimary]);
	for (const ref of resolveVoiceModelRefs(effectiveCfg?.agents?.defaults?.voiceModel)) {
		const provider = canonicalizeSpeechProviderIdFromInventory(ref.provider, effectiveCfg, providers) ?? ref.provider;
		if (provider !== normalizedPrimary) ordered.add(provider);
	}
	for (const provider of sortSpeechProvidersForAutoSelection(effectiveCfg, providers)) {
		const normalized = provider.id;
		if (normalized !== normalizedPrimary) ordered.add(normalized);
	}
	return [...ordered];
}
function resolveTtsProviderCandidates(primary, cfg, registry = defaultProviderRegistry) {
	const effectiveCfg = cfg ? resolveProviderRuntimeConfig(cfg, registry) : void 0;
	const normalizedPrimary = registry.canonicalizeSpeechProviderId(primary, effectiveCfg) ?? primary;
	return resolveVoiceProviderCandidates({
		primaryProvider: normalizedPrimary,
		providers: sortSpeechProvidersForAutoSelection(effectiveCfg, void 0, registry),
		voiceModelConfig: effectiveCfg?.agents?.defaults?.voiceModel
	});
}
function resolvePrimaryTtsProviderCandidate(primary, cfg, registry = defaultProviderRegistry) {
	const effectiveCfg = cfg ? resolveProviderRuntimeConfig(cfg, registry) : void 0;
	return resolvePrimaryVoiceProviderCandidate({
		primaryProvider: registry.canonicalizeSpeechProviderId(primary, effectiveCfg) ?? primary,
		providers: sortSpeechProvidersForAutoSelection(effectiveCfg, void 0, registry),
		voiceModelConfig: effectiveCfg?.agents?.defaults?.voiceModel
	});
}
function isTtsProviderConfigured(config, provider, cfg) {
	return isSpeechProviderConfigured(config, provider, cfg, defaultProviderRegistry);
}
function isSpeechProviderConfigured(config, provider, cfg, registry) {
	try {
		const effectiveCfg = cfg ? resolveProviderRuntimeConfig(cfg, registry) : config.sourceConfig;
		const resolvedProvider = typeof provider === "string" ? registry.getSpeechProvider(provider, effectiveCfg) : provider;
		if (!resolvedProvider) return false;
		return resolvedProvider.isConfigured({
			cfg: effectiveCfg,
			providerConfig: typeof provider === "string" ? resolveSpeechProviderConfig(config, resolvedProvider.id, effectiveCfg, registry) : resolveLazyProviderConfig(config, resolvedProvider.id, effectiveCfg, void 0, resolvedProvider, registry),
			timeoutMs: resolveSpeechProviderTimeoutMs({
				config,
				provider: resolvedProvider
			})
		}) ?? false;
	} catch {
		return false;
	}
}
//#endregion
//#region src/tts/tts-synthesis-support.ts
function isTtsTimeoutError(err) {
	if (!(err instanceof Error)) return false;
	return err.name === "AbortError" || err.name === "TimeoutError" || /\btimed out\b/iu.test(err.message);
}
function formatTtsProviderError(provider, err) {
	const error = err instanceof Error ? err : new Error(String(err));
	if (isTtsTimeoutError(error)) return `${provider}: request timed out`;
	return `${provider}: ${redactSensitiveText(error.message)}`;
}
function sanitizeTtsErrorForLog(err) {
	const raw = formatErrorMessage(err);
	return redactSensitiveText(raw).replace(/\r/g, "\\r").replace(/\n/g, "\\n").replace(/\t/g, "\\t");
}
/** Projection diagnostics remain primary when releasing an already-created synthesis also fails. */
async function throwTtsProjectionError(error, cleanup) {
	const [result] = await Promise.allSettled([Promise.resolve().then(cleanup)]);
	if (result.status === "rejected") throw new AggregateError([error, result.reason], formatErrorMessage(error), { cause: error });
	throw error;
}
function resolveReadySpeechProvider(params) {
	const resolvedProvider = params.providerRegistry.getSpeechProvider(params.provider, params.cfg);
	if (!resolvedProvider) return {
		kind: "skip",
		reasonCode: "no_provider_registered",
		message: `${params.provider}: no provider registered`
	};
	const merged = mergeProviderConfigWithPersona({
		providerConfig: getResolvedSpeechProviderConfigForVoiceModel({
			config: params.config,
			providerId: resolvedProvider.id,
			cfg: params.cfg,
			voiceModel: params.voiceModel,
			registry: params.providerRegistry
		}),
		persona: params.persona,
		providerId: resolvedProvider.id
	});
	if (params.persona?.fallbackPolicy === "fail" && merged.personaBinding === "missing") return {
		kind: "skip",
		reasonCode: "not_configured",
		message: `${params.provider}: persona ${params.persona.id} has no provider binding`,
		personaBinding: "missing"
	};
	if (!resolvedProvider.isConfigured({
		cfg: params.cfg,
		providerConfig: merged.providerConfig,
		timeoutMs: resolveSpeechProviderTimeoutMs({
			config: params.config,
			provider: resolvedProvider
		})
	})) return {
		kind: "skip",
		reasonCode: "not_configured",
		message: `${params.provider}: not configured`
	};
	if (params.requireTelephony && !resolvedProvider.synthesizeTelephony) return {
		kind: "skip",
		reasonCode: "unsupported_for_telephony",
		message: `${params.provider}: unsupported for telephony`
	};
	return {
		kind: "ready",
		provider: resolvedProvider,
		providerConfig: merged.providerConfig,
		personaProviderConfig: merged.personaProviderConfig,
		synthesisPersona: params.persona?.fallbackPolicy === "provider-defaults" && merged.personaBinding === "missing" ? void 0 : params.persona,
		personaBinding: merged.personaBinding
	};
}
async function prepareSpeechSynthesis({ provider, ...request }) {
	if (!provider.prepareSynthesis) return {
		text: request.text,
		providerConfig: request.providerConfig,
		providerOverrides: request.providerOverrides
	};
	const prepared = await provider.prepareSynthesis({ ...request });
	return {
		text: prepared?.text ?? request.text,
		providerConfig: prepared?.providerConfig ? {
			...request.providerConfig,
			...prepared.providerConfig
		} : request.providerConfig,
		providerOverrides: prepared?.providerOverrides ? {
			...request.providerOverrides,
			...prepared.providerOverrides
		} : request.providerOverrides
	};
}
/** Keeps catalog and direct lookup selections in one explicit speech request owner. */
async function acquireTtsRequest(params) {
	const cfg = resolveTtsRuntimeConfig(params.cfg);
	const config = resolveTtsConfig(cfg, {
		agentId: params.agentId,
		channelId: params.channelId,
		accountId: params.accountId
	});
	const prefsPath = params.prefsPath ?? resolveTtsPrefsPath(config);
	if (params.text.length > config.maxTextLength) return { error: `Text too long (${params.text.length} chars, max ${config.maxTextLength})` };
	const readRuntimeConfig = createRuntimeConfigReader(cfg);
	const prefs = readTtsPrefs(prefsPath);
	const persona = resolveTtsPersonaFromPrefs(config, prefs);
	const queries = await acquirePluginCapabilityProviders({
		key: "speechProviders",
		cfg
	});
	try {
		return {
			setup: await queries.run(async () => {
				const catalog = queries.providers;
				const defaultLookups = /* @__PURE__ */ new Map();
				let defaultCatalog = [];
				const preferred = normalizeCapabilityProviderId(prefs.tts?.provider);
				if (preferred) {
					const provider = await queries.resolveProvider({ providerId: preferred });
					defaultLookups.set(preferred, provider);
					if (!provider) defaultCatalog = await queries.resolveProviders({});
				}
				const defaults = createSpeechProviderRegistry({
					getProvider: (providerId) => defaultLookups.get(providerId),
					listProviders: () => defaultCatalog
				});
				const preferredProvider = defaults.canonicalizeSpeechProviderId(prefs.tts?.provider) ?? normalizeConfiguredSpeechProviderId(prefs.tts?.provider);
				const overrideProvider = normalizeCapabilityProviderId(params.providerOverride);
				const requestedInputs = [
					overrideProvider,
					!overrideProvider ? preferredProvider : void 0,
					!preferredProvider ? persona?.provider : void 0,
					!overrideProvider && !preferredProvider ? config.provider : void 0,
					...catalog.map((provider) => provider.id)
				];
				const prepareView = async (queryConfig, providers) => {
					const lookups = /* @__PURE__ */ new Map();
					const requested = new Set([...requestedInputs, ...providers.map((provider) => provider.id)].flatMap((id) => {
						const normalized = normalizeCapabilityProviderId(id);
						return normalized ? [normalized] : [];
					}));
					for (const providerId of requested) {
						const provider = await queries.resolveProvider({
							providerId,
							cfg: queryConfig
						});
						lookups.set(providerId, provider);
						const canonical = normalizeCapabilityProviderId(provider?.id);
						if (canonical) requested.add(canonical);
					}
					return createSpeechProviderRegistry({
						getProvider: (providerId) => lookups.get(providerId),
						listProviders: () => providers
					});
				};
				const prepareProviderRegistry = async () => {
					const inputView = await prepareView(cfg, await queries.resolveProviders({ cfg }));
					const runtimeConfig = readRuntimeConfig();
					const runtimeView = runtimeConfig === cfg ? inputView : await prepareView(runtimeConfig, await queries.resolveProviders({ cfg: runtimeConfig }));
					const selectRegistry = (queryConfig) => {
						if (queryConfig === void 0) return defaults;
						return queryConfig === cfg ? inputView : runtimeView;
					};
					return {
						runtimeConfig,
						getSpeechProvider: (id, queryConfig) => selectRegistry(queryConfig).getSpeechProvider(id),
						canonicalizeSpeechProviderId: (id, queryConfig) => selectRegistry(queryConfig).canonicalizeSpeechProviderId(id),
						listSpeechProviders: (queryConfig) => selectRegistry(queryConfig).listSpeechProviders()
					};
				};
				const providerRegistry = await prepareProviderRegistry();
				const userProvider = resolveTtsProvider(config, prefsPath, providerRegistry, prefs);
				const provider = providerRegistry.canonicalizeSpeechProviderId(params.providerOverride, cfg) ?? userProvider;
				return {
					cfg,
					config,
					persona,
					providers: params.disableFallback ? [resolvePrimaryTtsProviderCandidate(provider, cfg, providerRegistry)] : resolveTtsProviderCandidates(provider, cfg, providerRegistry),
					prepareProviderRegistry
				};
			}),
			run: queries.run,
			release: queries.release
		};
	} catch (error) {
		return await finishCapabilityOperation({
			ok: false,
			error
		}, queries.release);
	}
}
/** Finite speech calls finish their work before returning a materialized result. */
async function withOwnedTtsRequest(params, run) {
	const acquired = await acquireTtsRequest(params);
	if ("error" in acquired) return await run(acquired);
	let outcome;
	try {
		outcome = {
			ok: true,
			value: await acquired.run(() => run(acquired.setup))
		};
	} catch (error) {
		outcome = {
			ok: false,
			error
		};
	}
	return await finishCapabilityOperation(outcome, acquired.release);
}
async function executeTtsProviderAttempts(params) {
	const { cfg, config, persona, providers } = params;
	const errors = [];
	const attemptedProviders = [];
	const attempts = [];
	const primaryProvider = providers[0]?.provider;
	const recordSkipped = (provider, skipped, binding) => {
		errors.push(skipped.message);
		attempts.push({
			provider,
			outcome: "skipped",
			reasonCode: skipped.reasonCode,
			persona: persona?.id,
			...binding,
			error: skipped.message
		});
		logVerbose(`${params.logLabel}: provider ${provider} skipped (${skipped.message})`);
	};
	logVerbose(`${params.logLabel}: starting with provider ${primaryProvider}, fallbacks: ${providers.slice(1).map((entry) => entry.provider).join(", ") || "none"}`);
	for (const { provider, voiceModel } of providers) {
		attemptedProviders.push(provider);
		const providerStart = Date.now();
		try {
			const providerRegistry = await params.prepareProviderRegistry();
			const resolvedProvider = resolveReadySpeechProvider({
				provider,
				cfg,
				config,
				persona,
				voiceModel,
				requireTelephony: params.requireTelephony,
				providerRegistry
			});
			if (resolvedProvider.kind === "skip") {
				recordSkipped(provider, resolvedProvider, resolvedProvider.personaBinding ? { personaBinding: resolvedProvider.personaBinding } : {});
				continue;
			}
			const operation = params.selectOperation({
				provider,
				resolvedProvider
			});
			if (operation.kind === "skip") {
				recordSkipped(provider, operation, { personaBinding: resolvedProvider.personaBinding });
				continue;
			}
			const timeoutMs = resolveSpeechProviderTimeoutMs({
				timeoutMs: params.timeoutMs ?? voiceModel?.timeoutMs,
				config,
				provider: resolvedProvider.provider
			});
			const prepared = await prepareSpeechSynthesis({
				provider: resolvedProvider.provider,
				text: params.synthesisText,
				cfg,
				providerConfig: resolvedProvider.providerConfig,
				providerOverrides: params.providerOverrides?.[resolvedProvider.provider.id],
				persona: resolvedProvider.synthesisPersona,
				personaProviderConfig: resolvedProvider.personaProviderConfig,
				target: params.target,
				timeoutMs
			});
			const synthesis = await operation.synthesize({
				text: prepared.text,
				cfg,
				providerConfig: prepared.providerConfig,
				target: params.target,
				providerOverrides: prepared.providerOverrides,
				timeoutMs
			});
			try {
				const latencyMs = Date.now() - providerStart;
				attempts.push({
					provider,
					outcome: "success",
					reasonCode: "success",
					persona: persona?.id,
					personaBinding: resolvedProvider.personaBinding,
					latencyMs
				});
				return params.buildSuccess({
					synthesis,
					latencyMs,
					provider,
					providerModel: resolveTtsResultDetail(prepared, ["modelId", "model"]),
					providerVoice: resolveTtsResultDetail(prepared, [
						"speakerVoiceId",
						"speakerVoice",
						"voiceId",
						"voiceName",
						"voice"
					]),
					persona: persona?.id,
					fallbackFrom: provider !== primaryProvider ? primaryProvider : void 0,
					attemptedProviders,
					attempts
				});
			} catch (error) {
				return await throwTtsProjectionError(error, () => operation.cleanupFailedProjection?.(synthesis));
			}
		} catch (err) {
			const errorMsg = formatTtsProviderError(provider, err);
			const latencyMs = Date.now() - providerStart;
			errors.push(errorMsg);
			attempts.push({
				provider,
				outcome: "failed",
				reasonCode: isTtsTimeoutError(err) ? "timeout" : "provider_error",
				latencyMs,
				persona: persona?.id,
				personaBinding: resolvePersonaBinding(persona, provider),
				error: errorMsg
			});
			const rawError = sanitizeTtsErrorForLog(err);
			if (provider === primaryProvider) {
				const hasFallbacks = providers.length > 1;
				logVerbose(`${params.logLabel}: primary provider ${provider} failed (${rawError})${hasFallbacks ? "; trying fallback providers." : "; no fallback providers configured."}`);
			} else logVerbose(`${params.logLabel}: ${provider} failed (${rawError}); trying next provider.`);
		}
	}
	return {
		success: false,
		error: `TTS conversion failed: ${errors.join("; ") || "no providers available"}`,
		attemptedProviders,
		attempts,
		persona: persona?.id
	};
}
function resolveTtsResultDetail(prepared, keys) {
	for (const config of [prepared.providerOverrides, prepared.providerConfig]) for (const key of keys) {
		const value = normalizeOptionalString(config?.[key]);
		if (value !== void 0) return value;
	}
}
function resolvePersonaBinding(persona, provider) {
	return resolvePersonaProviderConfig(persona, provider) != null ? "applied" : persona ? "missing" : "none";
}
//#endregion
//#region src/tts/runtime-availability.ts
/** Host-owned availability guard shared by every speech runtime entrypoint. */
let assertRuntimeAvailable;
/** Installs the process-lifecycle availability guard owned by the OpenClaw host. */
function setSpeechRuntimeAvailabilityGuard(guard) {
	assertRuntimeAvailable = guard;
}
/** Throws the host's typed unavailable error when speech is configured cold. */
function assertSpeechRuntimeAvailable() {
	assertRuntimeAvailable?.();
}
/** Returns false only when the installed host guard rejects speech execution. */
function isSpeechRuntimeAvailable() {
	try {
		assertSpeechRuntimeAvailable();
		return true;
	} catch {
		return false;
	}
}
//#endregion
//#region src/tts/speech-text.ts
const CODE_HEAVY_SPOKEN_FALLBACK = "I've put the detailed response on screen.";
const CODE_HEAVY_FENCED_CHAR_RATIO = .5;
function isCodeHeavySpeechText(text) {
	const trimmed = text.trim();
	if (!trimmed) return false;
	return countMarkdownFencedCodeChars(trimmed) / trimmed.length >= CODE_HEAVY_FENCED_CHAR_RATIO;
}
function normalizeSpeechText(text) {
	const trimmed = text.trim();
	if (!trimmed) return "";
	return stripMarkdown(trimmed, {
		linkStyle: "label",
		mode: "speech"
	}).trim();
}
//#endregion
//#region src/tts/tts-synthesis.ts
function supportsNativeVoiceNoteTts(channel) {
	return resolveChannelTtsVoiceDelivery(channel) !== void 0;
}
function supportsTranscodedVoiceNoteTts(channel) {
	const delivery = resolveChannelTtsVoiceDelivery(channel);
	return delivery?.synthesisTarget === "voice-note" && delivery.transcodesAudio === true;
}
function resolveTtsSynthesisTarget(channel) {
	return resolveChannelTtsVoiceDelivery(channel)?.synthesisTarget ?? "audio-file";
}
function supportsAudioFileVoiceMemoOutput(params) {
	const formats = new Set(params.audioFileFormats?.map((format) => format.trim().toLowerCase()));
	if (formats.size === 0) return false;
	const extension = params.fileExtension?.trim().toLowerCase();
	if (extension && formats.has(extension.replace(/^\./, ""))) return true;
	const outputFormat = params.outputFormat?.trim().toLowerCase();
	return outputFormat ? formats.has(outputFormat) : false;
}
function shouldDeliverTtsAsVoice(params) {
	const delivery = resolveChannelTtsVoiceDelivery(params.channel);
	if (!delivery) return false;
	if (delivery.synthesisTarget === "audio-file") return params.target === "audio-file" && supportsAudioFileVoiceMemoOutput({
		fileExtension: params.fileExtension,
		outputFormat: params.outputFormat,
		audioFileFormats: delivery.audioFileFormats
	});
	if (params.target !== "voice-note") return false;
	return params.voiceCompatible === true || delivery.transcodesAudio === true;
}
async function textToSpeechCore(params, persistTtsAudio) {
	const synthesis = await synthesizeSpeech(params);
	if (!synthesis.success || !synthesis.audioBuffer || !synthesis.fileExtension) return {
		success: false,
		error: synthesis.error ?? "TTS conversion failed",
		persona: synthesis.persona,
		attemptedProviders: synthesis.attemptedProviders,
		attempts: synthesis.attempts
	};
	const transcoded = await maybePreTranscodeForVoiceDelivery({
		channel: params.channel,
		target: synthesis.target,
		audioBuffer: synthesis.audioBuffer,
		fileExtension: synthesis.fileExtension,
		outputFormat: synthesis.outputFormat
	});
	const audioBuffer = transcoded ? transcoded.audioBuffer : synthesis.audioBuffer;
	const fileExtension = transcoded ? transcoded.fileExtension : synthesis.fileExtension;
	const outputFormat = transcoded ? transcoded.outputFormat : synthesis.outputFormat;
	const metadata = {
		latencyMs: synthesis.latencyMs,
		provider: synthesis.provider,
		persona: synthesis.persona,
		fallbackFrom: synthesis.fallbackFrom,
		attemptedProviders: synthesis.attemptedProviders,
		attempts: synthesis.attempts
	};
	let audioPath;
	try {
		audioPath = await persistTtsAudio({
			audioBuffer,
			cfg: params.cfg,
			fileExtension,
			outputFormat
		});
	} catch (err) {
		logVerbose(`TTS: audio persistence failed: ${sanitizeTtsErrorForLog(err)}`);
		return {
			success: false,
			error: "TTS audio persistence failed",
			...metadata
		};
	}
	return {
		success: true,
		audioPath,
		...metadata,
		outputFormat,
		voiceCompatible: synthesis.voiceCompatible,
		audioAsVoice: shouldDeliverTtsAsVoice({
			channel: params.channel,
			target: synthesis.target,
			voiceCompatible: synthesis.voiceCompatible,
			fileExtension,
			outputFormat
		}),
		target: synthesis.target
	};
}
async function maybePreTranscodeForVoiceDelivery(params) {
	if (params.target !== "audio-file") return;
	const preferred = resolveChannelTtsVoiceDelivery(params.channel)?.preferAudioFileFormat?.trim().toLowerCase();
	if (!preferred) return;
	const sourceExt = params.fileExtension.trim().toLowerCase().replace(/^\./, "");
	if (sourceExt === preferred) return;
	const outcome = await transcodeAudioBuffer({
		audioBuffer: params.audioBuffer,
		sourceExtension: sourceExt,
		targetExtension: preferred
	});
	if (!outcome.ok) {
		if (outcome.reason === "transcoder-failed") logVerbose(`TTS: pre-transcode ${sourceExt}->${preferred} for channel=${params.channel ?? "?"} failed: ${outcome.detail ?? "unknown"}`);
		return;
	}
	return {
		audioBuffer: outcome.buffer,
		fileExtension: `.${preferred}`,
		outputFormat: preferred
	};
}
async function synthesizeSpeech(params) {
	assertSpeechRuntimeAvailable();
	return synthesizeSpeechInternal(params);
}
/** Host-only Talk synthesis retains its own capability boundary instead of bypassing public TTS. */
async function synthesizeTalkSpeech(params) {
	assertSecretOwnerAvailable("capability", "talk:speech");
	return synthesizeSpeechInternal(params);
}
async function synthesizeSpeechInternal(params) {
	return await withOwnedTtsRequest({
		text: params.text,
		cfg: params.cfg,
		prefsPath: params.prefsPath,
		providerOverride: params.overrides?.provider,
		disableFallback: params.disableFallback,
		agentId: params.agentId,
		channelId: params.channel,
		accountId: params.accountId
	}, async (setup) => {
		if ("error" in setup) return {
			success: false,
			error: setup.error
		};
		const target = resolveTtsSynthesisTarget(params.channel);
		return await executeTtsProviderAttempts({
			...setup,
			synthesisText: normalizeSpeechText(params.text),
			providerOverrides: params.overrides?.providerOverrides,
			timeoutMs: params.timeoutMs,
			target,
			logLabel: "TTS",
			selectOperation: ({ resolvedProvider }) => ({
				kind: "ready",
				synthesize: (request) => resolvedProvider.provider.synthesize(request)
			}),
			buildSuccess: ({ synthesis, ...metadata }) => ({
				success: true,
				...metadata,
				audioBuffer: synthesis.audioBuffer,
				outputFormat: synthesis.outputFormat,
				voiceCompatible: synthesis.voiceCompatible,
				fileExtension: synthesis.fileExtension,
				target
			})
		});
	});
}
//#endregion
//#region src/tts/tts-settings-writes.ts
function updateTtsPrefs(prefsPath, update) {
	const prefs = readTtsPrefs(prefsPath);
	update(prefs);
	privateFileStoreSync(path.dirname(prefsPath)).writeText(path.basename(prefsPath), JSON.stringify(prefs, null, 2));
}
function setTtsAutoMode(prefsPath, mode) {
	updateTtsPrefs(prefsPath, (prefs) => {
		const next = { ...prefs.tts };
		delete next.enabled;
		next.auto = mode;
		prefs.tts = next;
	});
}
function setTtsEnabled(prefsPath, enabled) {
	setTtsAutoMode(prefsPath, enabled ? "always" : "off");
}
function setTtsPersona(prefsPath, persona) {
	updateTtsPrefs(prefsPath, (prefs) => {
		const next = { ...prefs.tts };
		next.persona = normalizeTtsPersonaId(persona) ?? null;
		prefs.tts = next;
	});
}
function setTtsProvider(prefsPath, provider) {
	updateTtsPrefs(prefsPath, (prefs) => {
		prefs.tts = {
			...prefs.tts,
			provider: canonicalizeSpeechProviderId(provider) ?? provider
		};
	});
}
function setTtsMaxLength(prefsPath, maxLength) {
	updateTtsPrefs(prefsPath, (prefs) => {
		prefs.tts = {
			...prefs.tts,
			maxLength
		};
	});
}
function setSummarizationEnabled(prefsPath, enabled) {
	updateTtsPrefs(prefsPath, (prefs) => {
		prefs.tts = {
			...prefs.tts,
			summarize: enabled
		};
	});
}
//#endregion
//#region src/tts/tts-payload.ts
let lastTtsAttempt;
function getLastTtsAttempt() {
	return lastTtsAttempt;
}
function setLastTtsAttempt(entry) {
	lastTtsAttempt = entry;
}
async function listSpeechVoices(params) {
	assertSpeechRuntimeAvailable();
	const cfg = params.cfg ? resolveTtsRuntimeConfig(params.cfg) : void 0;
	const provider = canonicalizeSpeechProviderId(params.provider, cfg);
	if (!provider) throw new Error("speech provider id is required");
	const config = params.config ?? (cfg ? resolveTtsConfig(cfg) : void 0);
	if (!config) throw new Error(`speech provider ${provider} requires cfg or resolved config`);
	const resolvedProvider = getSpeechProvider(provider, cfg);
	if (!resolvedProvider) throw new Error(`speech provider ${provider} is not registered`);
	if (!resolvedProvider.listVoices) throw new Error(`speech provider ${provider} does not support voice listing`);
	const timeoutMs = resolveSpeechProviderTimeoutMs({
		config,
		provider: resolvedProvider
	});
	return await resolvedProvider.listVoices({
		cfg,
		providerConfig: getResolvedSpeechProviderConfig(config, resolvedProvider.id, cfg),
		apiKey: params.apiKey,
		baseUrl: params.baseUrl,
		timeoutMs
	});
}
function hasLegacyFinalMediaDirective(text) {
	return /(?:^|\n)\s*MEDIA\s*:/i.test(text);
}
function applyExplicitSpeechVisibleFallback(payload, channel, explicitText = getReplyPayloadMetadata(payload)?.tts?.text?.trim()) {
	const channelId = explicitText && payload.channelData ? normalizeMessageChannel(channel) : null;
	const hasChannelData = channelId ? getChannelPlugin(channelId)?.messaging?.hasStructuredReplyPayload?.({ payload }) : void 0;
	if (!explicitText || hasReplyPayloadContent(payload, { hasChannelData })) return payload;
	return {
		...payload,
		text: explicitText
	};
}
async function maybeApplyTtsToPayloadCore(params, persistTtsAudio) {
	if (!isSpeechRuntimeAvailable()) return applyExplicitSpeechVisibleFallback(params.payload, params.channel);
	if (params.payload.isCompactionNotice) return params.payload;
	const cfg = resolveTtsRuntimeConfig(params.cfg);
	const { autoMode, config, prefsPath } = resolveTtsSettingsSnapshot({
		cfg,
		sessionAuto: params.ttsAuto,
		agentId: params.agentId,
		channelId: params.channel,
		accountId: params.accountId
	});
	const ttsMetadata = getReplyPayloadMetadata(params.payload);
	const explicitTts = ttsMetadata?.ttsExplicit === true;
	if (!explicitTts && (autoMode === "off" || ttsMetadata?.commandReply)) return params.payload;
	const activeProvider = resolveTtsProvider(config, prefsPath);
	const reply = resolveSendableOutboundReplyParts(params.payload);
	const text = reply.text;
	const directiveOptions = {
		cfg,
		providerConfigs: config.providerConfigs,
		preferredProviderId: activeProvider
	};
	const directives = ttsMetadata?.tts ? {
		cleanedText: text,
		...resolveTtsDirectiveFacts(ttsMetadata.tts, config.modelOverrides, directiveOptions)
	} : parseTtsDirectives(text, config.modelOverrides, directiveOptions);
	if (directives.warnings.length > 0) logVerbose(`TTS: ignored directive overrides (${directives.warnings.join("; ")})`);
	if (isVerbose()) {
		const effectiveProvider = directives.overrides?.provider ? canonicalizeSpeechProviderId(directives.overrides.provider, cfg) ?? activeProvider : activeProvider;
		logVerbose(`TTS: auto mode enabled (${autoMode}), channel=${params.channel}, selected provider=${effectiveProvider}, config.provider=${config.provider}, config.providerSource=${config.providerSource}`);
	}
	const visibleText = directives.cleanedText.trim();
	const explicitTtsText = directives.ttsText?.trim() || "";
	const ttsText = explicitTtsText || visibleText;
	const nextPayload = visibleText === text.trim() ? params.payload : {
		...params.payload,
		text: visibleText.length > 0 ? visibleText : void 0
	};
	if (!explicitTts && autoMode === "tagged" && !directives.hasDirective) return nextPayload;
	if (!explicitTts && autoMode === "inbound" && params.inboundAudio !== true) return nextPayload;
	if ((config.mode ?? "final") === "final" && params.kind && params.kind !== "final") return nextPayload;
	if (!ttsText) return nextPayload;
	if (reply.hasMedia || hasLegacyFinalMediaDirective(text)) return nextPayload;
	if (!explicitTtsText && ttsText.length < 10) return nextPayload;
	const maxLength = getTtsMaxLength(prefsPath);
	let textForAudio = ttsText;
	let wasSummarized = false;
	if (!explicitTtsText && isCodeHeavySpeechText(textForAudio)) return nextPayload;
	if (textForAudio.length > maxLength) {
		if (!isSummarizationEnabled(prefsPath)) {
			logVerbose(`TTS: truncating long text (${textForAudio.length} > ${maxLength}), summarization disabled.`);
			textForAudio = `${truncateUtf16Safe(textForAudio, maxLength - 3)}...`;
		} else try {
			textForAudio = (await summarizeText({
				text: textForAudio,
				targetLength: maxLength,
				cfg,
				config,
				timeoutMs: config.timeoutMs,
				agentId: params.agentId
			})).summary;
			wasSummarized = true;
			if (textForAudio.length > config.maxTextLength) {
				logVerbose(`TTS: summary exceeded hard limit (${textForAudio.length} > ${config.maxTextLength}); truncating.`);
				textForAudio = `${truncateUtf16Safe(textForAudio, config.maxTextLength - 3)}...`;
			}
		} catch (err) {
			logVerbose(`TTS: summarization failed, truncating instead: ${err.message}`);
			textForAudio = `${truncateUtf16Safe(textForAudio, maxLength - 3)}...`;
		}
	}
	const normalizedTextForAudio = normalizeSpeechText(textForAudio);
	if (!normalizedTextForAudio) return nextPayload;
	if (!explicitTtsText && normalizedTextForAudio.length < 10) return nextPayload;
	const ttsStart = Date.now();
	const result = await textToSpeechCore({
		text: textForAudio,
		cfg,
		prefsPath,
		channel: params.channel,
		overrides: directives.overrides,
		agentId: params.agentId,
		accountId: params.accountId
	}, persistTtsAudio);
	const succeeded = result.success && Boolean(result.audioPath);
	lastTtsAttempt = {
		timestamp: Date.now(),
		success: succeeded,
		textLength: text.length,
		summarized: wasSummarized,
		persona: result.persona,
		attemptedProviders: result.attemptedProviders,
		attempts: result.attempts,
		...succeeded ? {
			provider: result.provider,
			fallbackFrom: result.fallbackFrom,
			latencyMs: result.latencyMs
		} : { error: result.error }
	};
	if (result.success && result.audioPath) {
		const payloadWithAudio = {
			...nextPayload,
			mediaUrl: result.audioPath,
			audioAsVoice: result.audioAsVoice || params.payload.audioAsVoice,
			spokenText: textForAudio,
			trustedLocalMedia: true
		};
		return nextPayload.text?.trim() ? markReplyPayloadAsTtsSupplement(payloadWithAudio) : payloadWithAudio;
	}
	const latency = Date.now() - ttsStart;
	logVerbose(`TTS: conversion failed after ${latency}ms (${result.error ?? "unknown"}).`);
	return applyExplicitSpeechVisibleFallback(nextPayload, params.channel, explicitTtsText);
}
//#endregion
//#region src/tts/tts-request.ts
/** Merge a surface TTS override and resolve its inline synthesis directives. */
async function prepareTtsRequest(params) {
	const host = getLegacyPluginSdkResourceHost();
	return await host.track(() => {
		try {
			var _usingCtx$1 = _usingCtx();
			const projection = _usingCtx$1.u(createLegacyPluginSdkProviderProjection());
			const retain = (registry) => {
				const project = projection.select(registry);
				projection.adopt();
				return project;
			};
			const registry = createSpeechProviderRegistry({
				getProvider: (providerId, cfg) => resolvePluginCapabilityProvider({
					key: "speechProviders",
					providerId,
					cfg
				}, retain),
				listProviders: (cfg) => resolvePluginCapabilityProviders({
					key: "speechProviders",
					cfg
				}, retain)
			});
			const cfg = params.override ? {
				...params.cfg,
				tts: mergeDeep(params.cfg.tts ?? {}, params.override)
			} : params.cfg;
			const config = resolveTtsConfig(cfg);
			const directives = parseTtsDirectives(params.text, config.modelOverrides, {
				cfg,
				get providers() {
					return registry.listSpeechProviders(cfg);
				},
				providerConfigs: config.providerConfigs,
				preferredProviderId: resolveTtsProvider(config, resolveTtsPrefsPath(config), registry)
			});
			host.assertOpen();
			return {
				cfg,
				directives
			};
		} catch (_) {
			_usingCtx$1.e = _;
		} finally {
			_usingCtx$1.d();
		}
	});
}
function resolveExplicitTtsOverrides(params) {
	const cfg = resolveTtsRuntimeConfig(params.cfg);
	const providerInput = params.provider?.trim();
	const modelId = params.modelId?.trim();
	const voiceId = params.voiceId?.trim();
	const config = resolveTtsConfig(cfg, {
		agentId: params.agentId,
		channelId: params.channelId,
		accountId: params.accountId
	});
	const prefsPath = params.prefsPath ?? resolveTtsPrefsPath(config);
	const selectedProvider = canonicalizeSpeechProviderId(providerInput, cfg) ?? (modelId || voiceId ? resolveTtsProvider(config, prefsPath) : void 0);
	if (providerInput && !selectedProvider) throw new Error(`Unknown TTS provider "${providerInput}".`);
	if (!modelId && !voiceId) return selectedProvider ? { provider: selectedProvider } : {};
	if (!selectedProvider) throw new Error("TTS model or voice overrides require a resolved provider.");
	const provider = getSpeechProvider(selectedProvider, cfg);
	if (!provider) throw new Error(`speech provider ${selectedProvider} is not registered`);
	if (!provider.resolveTalkOverrides) throw new Error(`TTS provider "${selectedProvider}" does not support model or voice overrides.`);
	const providerOverrides = provider.resolveTalkOverrides({
		talkProviderConfig: {},
		params: {
			...voiceId ? { voiceId } : {},
			...modelId ? { modelId } : {}
		}
	});
	if (!providerOverrides || Object.keys(providerOverrides).length === 0) throw new Error(`TTS provider "${selectedProvider}" ignored the requested model or voice overrides.`);
	return {
		provider: selectedProvider,
		providerOverrides: { [provider.id]: providerOverrides }
	};
}
//#endregion
//#region src/tts/tts-streaming-resources.ts
async function captureSpeechProviderStream(synthesis, owner) {
	const captured = AsyncLocalStorage.snapshot();
	const invoke = (operation) => captured(() => owner.run(operation));
	let source;
	let providerRelease;
	let reader;
	let closed;
	const releaseReader = (active) => {
		if (reader === active) {
			reader = void 0;
			active.releaseLock();
		}
	};
	let completion;
	const close = (reason) => completion ??= Promise.resolve().then(async () => {
		const active = reader;
		const cancellation = invoke(() => active ? active.cancel(reason) : source?.cancel(reason));
		const cleanup = invoke(() => providerRelease?.());
		if (active) releaseReader(active);
		const [canceled, cleaned] = await Promise.allSettled([cancellation, cleanup]);
		if (cleaned.status === "rejected") throw cleaned.reason;
		return canceled;
	});
	try {
		const [releaseField, streamField] = await Promise.allSettled([invoke(() => {
			providerRelease = synthesis.release;
		}), invoke(() => {
			source = synthesis.audioStream;
		})]);
		const failures = [streamField, releaseField].flatMap((field) => field.status === "rejected" ? [field.reason] : []);
		if (failures.length > 0) throw failures.length === 1 ? failures[0] : new AggregateError(failures, formatErrorMessage(failures[0]), { cause: failures[0] });
		reader = source?.getReader();
		closed = reader?.closed.then(() => ({
			ok: true,
			value: void 0
		}), (error) => ({
			ok: false,
			error
		}));
	} catch (error) {
		return await throwTtsProjectionError(error, async () => {
			await close(error);
		});
	}
	return {
		available: Boolean(source),
		requiresRelease: Boolean(providerRelease),
		closed,
		close,
		async read() {
			const active = reader;
			if (!active) return {
				done: true,
				value: void 0
			};
			try {
				const chunk = await invoke(() => active.read());
				if (chunk.done) {
					releaseReader(active);
					source = void 0;
				}
				return chunk;
			} catch (error) {
				releaseReader(active);
				source = void 0;
				throw error;
			}
		}
	};
}
function ownSpeechStream(transport, owner) {
	let activePull;
	const waitForPulls = async () => {
		while (activePull) {
			const pending = activePull;
			await pending;
			if (activePull === pending) activePull = void 0;
		}
	};
	let completion;
	const finish = (reason) => completion ??= Promise.resolve().then(async () => {
		const [closing, pulling] = await Promise.allSettled([transport.close(reason), waitForPulls()]);
		let outcome;
		if (closing.status === "rejected") outcome = {
			ok: false,
			error: pulling.status === "rejected" ? new AggregateError([closing.reason, pulling.reason], formatErrorMessage(closing.reason), { cause: closing.reason }) : closing.reason
		};
		else if (pulling.status === "rejected") outcome = {
			ok: false,
			error: pulling.reason
		};
		else outcome = {
			ok: true,
			value: closing.value
		};
		return await finishCapabilityOperation(outcome, owner.release);
	});
	let terminal = false;
	let output;
	const audioStream = transport.available ? new ReadableStream({
		start(controller) {
			output = controller;
		},
		pull(controller) {
			const pending = (async () => {
				try {
					const chunk = await transport.read();
					if (terminal) return;
					if (chunk.done) {
						if (transport.requiresRelease) {
							terminal = true;
							controller.close();
						}
					} else controller.enqueue(chunk.value);
				} catch (error) {
					if (!terminal && transport.requiresRelease) {
						terminal = true;
						controller.error(error);
					}
				}
			})();
			activePull = pending;
			return pending;
		},
		async cancel(reason) {
			terminal = true;
			const canceled = await finish(reason);
			if (canceled.status === "rejected") throw canceled.reason;
		}
	}, { highWaterMark: 0 }) : void 0;
	if (!transport.requiresRelease) transport.closed?.then(async (ending) => {
		if (terminal) return;
		try {
			await finish(ending.ok ? void 0 : ending.error);
		} catch (error) {
			if (ending.ok && !terminal) {
				terminal = true;
				output?.error(error);
			}
		}
		if (!terminal) {
			terminal = true;
			if (ending.ok) output?.close();
			else output?.error(ending.error);
		}
	});
	return {
		audioStream,
		async release() {
			if (!terminal) {
				terminal = true;
				output?.close();
			}
			await finish(/* @__PURE__ */ new Error("TTS stream released"));
		}
	};
}
//#endregion
//#region src/tts/tts-streaming.ts
async function streamSpeech(params) {
	assertSpeechRuntimeAvailable();
	const acquired = await acquireTtsRequest({
		text: params.text,
		cfg: params.cfg,
		prefsPath: params.prefsPath,
		providerOverride: params.overrides?.provider,
		disableFallback: params.disableFallback,
		agentId: params.agentId,
		channelId: params.channel,
		accountId: params.accountId
	});
	if ("error" in acquired) return {
		success: false,
		error: acquired.error
	};
	let outcome;
	try {
		const result = await acquired.run(() => {
			const target = resolveTtsSynthesisTarget(params.channel);
			return executeTtsProviderAttempts({
				...acquired.setup,
				synthesisText: normalizeSpeechText(params.text),
				providerOverrides: params.overrides?.providerOverrides,
				timeoutMs: params.timeoutMs,
				target,
				logLabel: "TTS stream",
				selectOperation: ({ provider, resolvedProvider }) => {
					if (!resolvedProvider.provider.streamSynthesize) return {
						kind: "skip",
						reasonCode: "unsupported_for_streaming",
						message: `${provider} does not support streaming TTS`
					};
					return {
						kind: "ready",
						synthesize: async (request) => {
							const synthesis = await resolvedProvider.provider.streamSynthesize(request);
							return {
								providerResult: synthesis,
								transport: await captureSpeechProviderStream(synthesis, acquired)
							};
						},
						cleanupFailedProjection: async ({ transport }) => {
							await transport.close();
						}
					};
				},
				buildSuccess: ({ synthesis: { providerResult, transport }, ...metadata }) => ({
					success: true,
					...metadata,
					transport,
					outputFormat: providerResult.outputFormat,
					voiceCompatible: providerResult.voiceCompatible,
					fileExtension: providerResult.fileExtension,
					target
				})
			});
		});
		if (result.success) {
			const { transport, ...metadata } = result;
			return {
				...metadata,
				...ownSpeechStream(transport, acquired)
			};
		}
		outcome = {
			ok: true,
			value: result
		};
	} catch (error) {
		outcome = {
			ok: false,
			error
		};
	}
	return await finishCapabilityOperation(outcome, acquired.release);
}
async function textToSpeechStream(params) {
	const synthesis = await streamSpeech(params);
	if (!synthesis.success || !synthesis.audioStream || !synthesis.fileExtension) {
		await synthesis.release?.();
		return {
			success: false,
			error: synthesis.error ?? "Streaming TTS conversion failed",
			persona: synthesis.persona,
			attemptedProviders: synthesis.attemptedProviders,
			attempts: synthesis.attempts
		};
	}
	return synthesis;
}
//#endregion
//#region src/tts/tts-telephony.ts
async function textToSpeechTelephony(params) {
	assertSpeechRuntimeAvailable();
	return await withOwnedTtsRequest({
		text: params.text,
		cfg: params.cfg,
		prefsPath: params.prefsPath,
		providerOverride: params.overrides?.provider
	}, async (setup) => {
		if ("error" in setup) return {
			success: false,
			error: setup.error
		};
		return await executeTtsProviderAttempts({
			...setup,
			synthesisText: params.text,
			providerOverrides: params.overrides?.providerOverrides,
			timeoutMs: params.timeoutMs,
			target: "telephony",
			logLabel: "TTS telephony",
			requireTelephony: true,
			selectOperation: ({ resolvedProvider }) => {
				const synthesizeTelephony = resolvedProvider.provider.synthesizeTelephony;
				return {
					kind: "ready",
					synthesize: ({ text, cfg: runtimeCfg, providerConfig, providerOverrides, timeoutMs }) => synthesizeTelephony({
						text,
						cfg: runtimeCfg,
						providerConfig,
						providerOverrides,
						timeoutMs
					})
				};
			},
			buildSuccess: ({ synthesis, ...metadata }) => ({
				success: true,
				...metadata,
				audioBuffer: synthesis.audioBuffer,
				outputFormat: synthesis.outputFormat,
				sampleRate: synthesis.sampleRate
			})
		});
	});
}
//#endregion
//#region src/tts/runtime-api.ts
function getTtsProvider(config, prefsPath) {
	return resolveTtsProvider(config, prefsPath);
}
const testApi = {
	parseTtsDirectives,
	resolveModelOverridePolicy,
	supportsNativeVoiceNoteTts,
	supportsTranscodedVoiceNoteTts,
	resolveTtsSynthesisTarget,
	shouldDeliverTtsAsVoice,
	summarizeText,
	getResolvedSpeechProviderConfig,
	formatTtsProviderError,
	sanitizeTtsErrorForLog
};
//#endregion
export { setSpeechRuntimeAvailabilityGuard as C, resolveTtsProviderOrder as D, resolvePreparedTtsProvider as E, isCodeHeavySpeechText as S, isTtsProviderConfigured as T, setTtsProvider as _, textToSpeechStream as a, textToSpeechCore as b, getLastTtsAttempt as c, setLastTtsAttempt as d, setSummarizationEnabled as f, setTtsPersona as g, setTtsMaxLength as h, streamSpeech as i, listSpeechVoices as l, setTtsEnabled as m, testApi as n, prepareTtsRequest as o, setTtsAutoMode as p, textToSpeechTelephony as r, resolveExplicitTtsOverrides as s, getTtsProvider as t, maybeApplyTtsToPayloadCore as u, synthesizeSpeech as v, getResolvedSpeechProviderConfig as w, CODE_HEAVY_SPOKEN_FALLBACK as x, synthesizeTalkSpeech as y };
