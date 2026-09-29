import { l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty, s as normalizeNullableString } from "./string-coerce-CIXf7egm.mjs";
import { y as uniqueStrings } from "./string-normalization-_gRhJUDw.mjs";
import { i as createLazyRuntimeNamedExport, r as createLazyRuntimeModule } from "./lazy-runtime-BPNHa36e.mjs";
import { n as ok } from "./result-BQGgYouL.mjs";
import { n as findNormalizedProviderValue } from "./provider-id-DCtsDflE.mjs";
import { o as resolveAgentModelFallbackValues, s as resolveAgentModelPrimaryValue } from "./model-input-DKxKaZGG.mjs";
import { c as inferUniqueProviderFromConfiguredModels, i as buildModelAliasIndex, v as resolveModelRefFromString } from "./model-selection-shared-0uvJbX1M.mjs";
import { t as resolveDefaultModelForAgent } from "./model-selection-config-DZ4sk4C2.mjs";
import { i as logVerbose, o as shouldLogVerbose } from "./globals-QODkv80i.mjs";
import { i as logWarn } from "./logger-BHMMVs5C.mjs";
import { B as isProviderAuthError } from "./loader-runtime-load-XbrcYJWd.mjs";
import "./model-selection-CaFyCMqp.mjs";
import { t as matchesMediaEntryCapability } from "./entry-capabilities-DIuRkXhI.mjs";
import { n as normalizeMediaProviderId, t as normalizeMediaExecutionProviderId } from "./provider-id-DSbuCFIb.mjs";
import { o as resolveModelEntries, s as resolveScopeDecision } from "./resolve-P9fG0vPg.mjs";
import { r as classifyMediaReferenceSource } from "./media-reference-CtGDBk0x.mjs";
import { n as resolveDefaultMediaModelFromRegistry, r as providerSupportsCapability, t as resolveAutoMediaKeyProvidersFromRegistry } from "./provider-registry-metadata-DJ4b90EB.mjs";
import { i as selectAttachments, r as isMediaUnderstandingSkipError } from "./attachments-89SLAze5.mjs";
import { n as isMinimaxVlmProvider, t as isMinimaxVlmModel } from "./minimax-vlm-BRM4679h.mjs";
import { n as inspectLocalAudioSelection } from "./local-audio-BUgxXnl2.mjs";
import { n as resolveOpenAiAudioAuthModelApi } from "./openai-audio-api-CZK5TvIV.mjs";
import { n as buildMediaUnderstandingRegistry, r as getMediaUnderstandingProvider } from "./image-compression-policy-SmOjiyMB.mjs";
import { a as runCliEntry, o as runProviderEntry, r as formatDecisionSummary, t as buildModelDecision } from "./runner.entries-D7UkHpdI.mjs";
import "./runner.attachments-rd3GUHfO.mjs";
//#region src/media-understanding/runner.ts
const loadHasAvailableAuthForProvider = createLazyRuntimeNamedExport(() => import("./model-auth-B4xo6b1W.mjs"), "hasAvailableAuthForProvider");
const loadPreparedModelCatalogApi = createLazyRuntimeModule(async () => ({
	...await import("./model-catalog-DfiQYriw.mjs"),
	...await import("./prepared-model-catalog-CFgw7dXn.mjs")
}));
function resolveLiteralProviderApiKey(cfg, providerId) {
	return normalizeNullableString(findNormalizedProviderValue(cfg?.models?.providers, providerId)?.apiKey);
}
async function hasProviderAuthAvailable(params) {
	if (resolveLiteralProviderApiKey(params.cfg, params.provider)) return true;
	return await (await loadHasAvailableAuthForProvider())({
		...params,
		modelApi: resolveOpenAiAudioAuthModelApi({
			capability: params.capability,
			providerId: params.provider
		})
	});
}
function resolveConfiguredKeyProviderOrder(params) {
	const configuredProviders = Object.keys(params.cfg.models?.providers ?? {}).map((providerId) => normalizeMediaExecutionProviderId(providerId)).filter(Boolean);
	const supportedProviders = uniqueStrings(configuredProviders).filter((providerId) => providerSupportsCapability(params.providerRegistry.get(normalizeMediaProviderId(providerId)), params.capability));
	return uniqueStrings([...supportedProviders, ...params.fallbackProviders]);
}
function resolveConfiguredImageModelId(params) {
	if (isMinimaxVlmProvider(params.providerId)) return;
	return resolveConfiguredImageModel(params)?.id?.trim() || void 0;
}
function resolveConfiguredImageModel(params) {
	return findNormalizedProviderValue(params.cfg.models?.providers, params.providerId)?.models?.find((entry) => {
		const id = entry?.id?.trim();
		return Boolean(id) && entry?.input?.includes("image");
	});
}
function resolveCatalogImageModelId(params) {
	const matches = params.catalog.filter((entry) => normalizeMediaProviderId(entry.provider) === normalizeMediaProviderId(params.providerId) && params.modelSupportsVision(entry));
	if (matches.length === 0) return;
	const autoEntry = matches.find((entry) => normalizeLowercaseStringOrEmpty(entry.id) === "auto");
	return normalizeOptionalString((autoEntry ?? matches[0])?.id);
}
async function explicitImageModelVisionStatus(params) {
	if (isMinimaxVlmProvider(params.providerId) && !isMinimaxVlmModel(params.providerId, params.model)) return "unsupported";
	const configured = resolveConfiguredImageModel(params);
	if (configured?.id?.trim() === params.model && configured.input?.includes("image")) return "supported";
	const { findModelInCatalog, readPreparedModelCatalog, modelSupportsVision } = await loadPreparedModelCatalogApi();
	const entry = findModelInCatalog(await readPreparedModelCatalog({
		config: params.cfg,
		...params.agentId ? { agentId: params.agentId } : {},
		...params.agentDir ? { agentDir: params.agentDir } : {},
		...params.workspaceDir ? { workspaceDir: params.workspaceDir } : {}
	}), params.providerId, params.model);
	if (!entry) return "unknown";
	return modelSupportsVision(entry) ? "supported" : "unsupported";
}
async function resolveAutoImageModelId(params) {
	const explicit = normalizeOptionalString(params.explicitModel);
	if (explicit) {
		if (await explicitImageModelVisionStatus({
			cfg: params.cfg,
			agentId: params.agentId,
			providerId: params.providerId,
			model: explicit,
			agentDir: params.agentDir,
			workspaceDir: params.workspaceDir
		}) !== "unsupported") return explicit;
	}
	if (isMinimaxVlmProvider(params.providerId)) return "MiniMax-VL-01";
	const configuredModel = resolveConfiguredImageModelId(params);
	if (configuredModel) return configuredModel;
	const defaultModel = resolveDefaultMediaModelFromRegistry({
		providerId: params.providerId,
		capability: "image",
		providerRegistry: params.providerRegistry
	});
	if (defaultModel) return defaultModel;
	const { resolveDefaultMediaModel } = await import("./defaults-UOO4ry_m.mjs");
	const bundledDefaultModel = resolveDefaultMediaModel({
		cfg: params.cfg,
		providerId: params.providerId,
		capability: "image",
		workspaceDir: params.workspaceDir
	});
	if (bundledDefaultModel) return bundledDefaultModel;
	const { readPreparedModelCatalog, modelSupportsVision } = await loadPreparedModelCatalogApi();
	const catalog = await readPreparedModelCatalog({
		config: params.cfg,
		...params.agentId ? { agentId: params.agentId } : {},
		...params.agentDir ? { agentDir: params.agentDir } : {},
		...params.workspaceDir ? { workspaceDir: params.workspaceDir } : {}
	});
	return resolveCatalogImageModelId({
		providerId: params.providerId,
		catalog,
		modelSupportsVision
	});
}
function buildProviderRegistry(overrides, cfg) {
	return buildMediaUnderstandingRegistry(overrides, cfg);
}
async function resolveKeyEntry(params) {
	const { cfg, providerRegistry, capability } = params;
	const checkProvider = (providerId, model) => resolveAutoProviderModelEntry(params, providerId, () => model);
	const activeProvider = params.activeModel?.provider?.trim();
	if (activeProvider) {
		const activeEntry = await checkProvider(activeProvider, params.activeModel?.model);
		if (activeEntry) return activeEntry;
	}
	for (const providerId of resolveConfiguredKeyProviderOrder({
		cfg,
		providerRegistry,
		capability,
		fallbackProviders: resolveAutoMediaKeyProvidersFromRegistry({
			capability,
			providerRegistry
		})
	})) {
		const entry = await checkProvider(providerId, void 0);
		if (entry) return entry;
	}
	return null;
}
function resolveImageModelFromAgentDefaults(params) {
	const refs = [];
	const primary = resolveAgentModelPrimaryValue(params.cfg.agents?.defaults?.imageModel);
	if (primary?.trim()) refs.push(primary.trim());
	for (const fb of resolveAgentModelFallbackValues(params.cfg.agents?.defaults?.imageModel)) if (fb?.trim()) refs.push(fb.trim());
	if (refs.length === 0) return [];
	const defaultProvider = resolveDefaultModelForAgent({
		cfg: params.cfg,
		agentId: params.agentId
	}).provider;
	const entries = [];
	for (const ref of refs) {
		const effectiveDefaultProvider = ref.includes("/") ? defaultProvider : inferUniqueProviderFromConfiguredModels({
			cfg: params.cfg,
			model: ref,
			agentId: params.agentId
		}) ?? defaultProvider;
		const aliasIndex = buildModelAliasIndex({
			cfg: params.cfg,
			defaultProvider: effectiveDefaultProvider,
			agentId: params.agentId
		});
		const resolved = resolveModelRefFromString({
			cfg: params.cfg,
			agentId: params.agentId,
			raw: ref,
			defaultProvider: effectiveDefaultProvider,
			aliasIndex
		});
		if (!resolved) continue;
		entries.push({
			type: "provider",
			provider: resolved.ref.provider,
			model: resolved.ref.model
		});
	}
	return entries;
}
function hasExplicitImageUnderstandingConfig(params) {
	return (params.cfg.tools?.media?.models ?? []).some((entry) => matchesMediaEntryCapability({
		entry,
		capability: "image",
		providerRegistry: params.providerRegistry
	}));
}
function isMinimaxNativeVisionModel(params) {
	return isMinimaxVlmProvider(params.provider) && /^MiniMax-M3(\b|[-.])/i.test(params.model?.trim() ?? "");
}
async function activeModelSupportsNativeVision(params) {
	const activeProvider = params.activeModel?.provider?.trim();
	if (!activeProvider) return false;
	if (isMinimaxVlmProvider(activeProvider) && !isMinimaxNativeVisionModel({
		provider: activeProvider,
		model: params.activeModel?.model
	})) return false;
	const { findModelInCatalog, readPreparedModelCatalog, modelSupportsVision } = await loadPreparedModelCatalogApi();
	return modelSupportsVision(findModelInCatalog(await readPreparedModelCatalog({
		config: params.cfg,
		...params.agentId ? { agentId: params.agentId } : {},
		...params.agentDir ? { agentDir: params.agentDir } : {},
		...params.workspaceDir ? { workspaceDir: params.workspaceDir } : {}
	}), activeProvider, params.activeModel?.model ?? ""));
}
async function* resolveAutoAudioEntries(params) {
	const activeProvider = normalizeMediaExecutionProviderId(params.activeModel?.provider?.trim() ?? "");
	const providers = uniqueStrings([...activeProvider ? [activeProvider] : [], ...resolveConfiguredKeyProviderOrder({
		...params,
		fallbackProviders: resolveAutoMediaKeyProvidersFromRegistry(params)
	})]);
	for (const providerId of providers) {
		const entry = await resolveAutoProviderModelEntry(params, providerId, () => void 0);
		if (entry) yield { entry };
	}
	const localAudio = await inspectLocalAudioSelection();
	for (const entry of localAudio.entries) yield { entry };
}
async function resolveAutoEntries(params) {
	if (params.capability === "image" && !params.nativeVisionActive) {
		const imageModelEntries = resolveImageModelFromAgentDefaults({
			cfg: params.cfg,
			agentId: params.agentId
		});
		if (imageModelEntries.length > 0) return imageModelEntries.map((entry) => ({ entry }));
	}
	const activeEntry = await resolveActiveModelEntry(params);
	if (activeEntry) return [{ entry: activeEntry }];
	const keys = await resolveKeyEntry(params);
	if (keys) return [{ entry: keys }];
	return [];
}
async function resolveAutoImageModel(params) {
	const providerRegistry = buildProviderRegistry(void 0, params.cfg);
	const entries = await resolveAutoEntries({
		...params,
		providerRegistry,
		capability: "image",
		nativeVisionActive: false
	});
	for (const { entry } of entries) {
		if (entry.type === "cli") continue;
		const provider = entry.provider;
		const model = entry.model?.trim();
		if (provider && model) return {
			provider,
			model
		};
	}
	return null;
}
async function resolveActiveModelEntry(params) {
	const activeProviderRaw = params.activeModel?.provider?.trim();
	if (!activeProviderRaw) return null;
	const providerId = normalizeMediaExecutionProviderId(activeProviderRaw);
	if (!providerId) return null;
	return await resolveAutoProviderModelEntry(params, providerId, () => params.activeModel?.model);
}
async function resolveAutoProviderModelEntry(params, providerId, readModel) {
	const provider = getMediaUnderstandingProvider(providerId, params.providerRegistry);
	if (!providerSupportsCapability(provider, params.capability)) return null;
	if (!(params.capability === "audio" && provider?.transcribeAudioWithContext) && !await hasProviderAuthAvailable({
		capability: params.capability,
		provider: providerId,
		cfg: params.cfg,
		agentDir: params.agentDir,
		workspaceDir: params.workspaceDir
	})) return null;
	let model;
	if (params.capability === "image") model = await resolveAutoImageModelId({
		cfg: params.cfg,
		agentId: params.agentId,
		providerId,
		providerRegistry: params.providerRegistry,
		explicitModel: readModel(),
		agentDir: params.agentDir,
		workspaceDir: params.workspaceDir
	});
	else if (params.capability === "audio") model = resolveDefaultMediaModelFromRegistry({
		providerId,
		capability: "audio",
		providerRegistry: params.providerRegistry
	});
	else model = readModel() ?? resolveDefaultMediaModelFromRegistry({
		providerId,
		capability: "video",
		providerRegistry: params.providerRegistry
	});
	if (params.capability === "image" && !model) return null;
	return {
		type: "provider",
		provider: providerId,
		model
	};
}
async function runAttachmentEntries(params) {
	const { entries, capability } = params;
	const attachmentIndex = params.attachment.index;
	const attempts = [];
	let processing = "omitted";
	for await (const candidate of entries) {
		const { entry } = candidate;
		const entryType = entry.type ?? (entry.command ? "cli" : "provider");
		try {
			const attempt = entryType === "cli" ? ok(await runCliEntry({
				...params,
				entry
			})) : await runProviderEntry({
				...params,
				entry,
				attachmentIndex,
				secretOwnerId: candidate.secretOwnerId
			});
			if (!attempt.ok) {
				if (!(params.automaticAudio && isProviderAuthError(attempt.error, "missing-provider-auth"))) attempts.push(buildModelDecision({
					entry,
					entryType,
					outcome: "failed",
					reason: String(attempt.error)
				}));
				continue;
			}
			const result = attempt.value;
			processing = "completed";
			if (result?.text) {
				const decision = buildModelDecision({
					entry,
					entryType,
					outcome: "success"
				});
				if (result.provider) decision.provider = result.provider;
				decision.model = result.model;
				if (result.requestedBackend) decision.requestedBackend = result.requestedBackend;
				if (result.observedBackend) decision.observedBackend = result.observedBackend;
				attempts.push(decision);
				return {
					output: result,
					attempts,
					processing
				};
			}
			attempts.push(buildModelDecision({
				entry,
				entryType,
				outcome: "skipped",
				reason: "empty output"
			}));
		} catch (err) {
			if (isMediaUnderstandingSkipError(err)) {
				attempts.push(buildModelDecision({
					entry,
					entryType,
					outcome: "skipped",
					reason: `${err.reason}: ${err.message}`
				}));
				if (shouldLogVerbose()) logVerbose(`Skipping ${capability} model due to ${err.reason}: ${err.message}`);
			} else {
				attempts.push(buildModelDecision({
					entry,
					entryType,
					outcome: "failed",
					reason: String(err)
				}));
				if (shouldLogVerbose()) logVerbose(`${capability} understanding failed: ${String(err)}`);
			}
		}
		if (params.automaticAudio && entryType === "provider") break;
	}
	return {
		output: null,
		attempts,
		processing
	};
}
function hasFailedMediaAttempt(attachments) {
	return attachments.some((attachment) => attachment.attempts.some((attempt) => attempt.outcome === "failed"));
}
function createAttachmentDispositions(indexes, disposition) {
	return Object.fromEntries(indexes.map((index) => [index, disposition]));
}
async function runCapability(params) {
	const { capability, cfg, ctx } = params;
	const config = params.config ?? cfg.tools?.media?.[capability] ?? {};
	const selection = selectAttachments({
		capability,
		attachments: params.media,
		policy: config.attachments
	});
	const selectedAttachmentIndexes = selection.selected.map((attachment) => attachment.index);
	const attachmentProcessing = Object.fromEntries([...selectedAttachmentIndexes, ...selection.droppedAttachmentIndexes].map((index) => [index, "omitted"]));
	const activeProvider = params.activeModel?.provider?.trim();
	let nativeVisionProbe;
	const resolveNativeVisionFlag = () => {
		nativeVisionProbe ??= activeModelSupportsNativeVision({
			cfg,
			agentId: params.agentId,
			activeModel: params.activeModel,
			agentDir: params.agentDir,
			workspaceDir: params.workspaceDir
		}).catch((err) => {
			if (shouldLogVerbose()) logVerbose(`native vision support probe failed: ${String(err)}`);
		});
		return nativeVisionProbe;
	};
	const buildDispositions = (selectedDisposition, droppedDisposition = selectedDisposition) => ({
		...createAttachmentDispositions(selectedAttachmentIndexes, selectedDisposition),
		...createAttachmentDispositions(selection.droppedAttachmentIndexes, droppedDisposition)
	});
	const rendersMarker = (dispositions) => Object.values(dispositions).some((d) => d.kind !== "handled" && d.kind !== "handed-to-native-vision");
	const buildDecision = async (outcome, attachments, attachmentDispositions) => {
		const nativeVisionActive = capability === "image" && (nativeVisionProbe !== void 0 || rendersMarker(attachmentDispositions)) ? await resolveNativeVisionFlag() : void 0;
		return {
			capability,
			outcome,
			attachments,
			attachmentDispositions,
			attachmentProcessing,
			...nativeVisionActive !== void 0 ? { nativeVisionActive } : {}
		};
	};
	if (config?.enabled === false) return {
		outputs: [],
		decision: await buildDecision("disabled", [], buildDispositions({ kind: "capability-disabled" }))
	};
	if (selection.selected.length === 0) return {
		outputs: [],
		decision: await buildDecision("no-attachment", [], {})
	};
	if (resolveScopeDecision({
		scope: config?.scope,
		ctx
	}) === "deny") {
		if (shouldLogVerbose()) logVerbose(`${capability} understanding disabled by scope policy.`);
		return {
			outputs: [],
			decision: await buildDecision("scope-deny", selection.selected.map((item) => ({
				attachmentIndex: item.index,
				attempts: []
			})), buildDispositions({ kind: "scope-denied" }))
		};
	}
	if (capability === "image" && activeProvider && !hasExplicitImageUnderstandingConfig({
		cfg,
		providerRegistry: params.providerRegistry
	}) && await resolveNativeVisionFlag() === true) {
		if (shouldLogVerbose()) logVerbose("Skipping image understanding: primary model supports vision natively");
		const attempt = {
			type: "provider",
			provider: activeProvider,
			model: params.activeModel?.model?.trim() || void 0,
			outcome: "skipped",
			reason: "primary model supports vision natively"
		};
		const nativeDeliverable = (item) => Boolean(item.path) || Boolean(item.url) && classifyMediaReferenceSource(item.url ?? "").isMediaStoreUrl;
		const attachmentDispositions = buildDispositions({ kind: "handed-to-native-vision" }, { kind: "not-selected" });
		for (const item of params.media) if (attachmentDispositions[item.index] && !nativeDeliverable(item)) attachmentDispositions[item.index] = {
			kind: "failed",
			reason: "remote-url image is not natively deliverable"
		};
		return {
			outputs: [],
			decision: await buildDecision("skipped", selection.selected.map((item) => nativeDeliverable(item) ? {
				attachmentIndex: item.index,
				attempts: [attempt],
				chosen: attempt
			} : {
				attachmentIndex: item.index,
				attempts: []
			}), attachmentDispositions)
		};
	}
	const entries = resolveModelEntries({
		cfg,
		capability,
		config,
		providerRegistry: params.providerRegistry
	});
	const automaticAudio = capability === "audio" && entries.length === 0;
	let resolvedEntries = entries;
	if (!automaticAudio && resolvedEntries.length === 0) resolvedEntries = await resolveAutoEntries({
		cfg,
		agentId: params.agentId,
		agentDir: params.agentDir,
		workspaceDir: params.workspaceDir,
		providerRegistry: params.providerRegistry,
		capability,
		activeModel: params.activeModel,
		config,
		nativeVisionActive: capability === "image" && await resolveNativeVisionFlag() === true
	});
	if (!automaticAudio && resolvedEntries.length === 0) return {
		outputs: [],
		decision: await buildDecision("skipped", selection.selected.map((item) => ({
			attachmentIndex: item.index,
			attempts: []
		})), buildDispositions({ kind: "no-model" }, { kind: "not-selected" }))
	};
	const outputs = [];
	const attachmentDecisions = [];
	const attachmentDispositions = buildDispositions({ kind: "failed" }, { kind: "not-selected" });
	for (const attachment of selection.selected) {
		const { output, attempts, processing } = await runAttachmentEntries({
			capability,
			cfg,
			ctx,
			attachment,
			agentId: params.agentId,
			agentDir: params.agentDir,
			workspaceDir: params.workspaceDir,
			providerRegistry: params.providerRegistry,
			cache: params.attachments,
			entries: automaticAudio ? resolveAutoAudioEntries({
				cfg,
				agentId: params.agentId,
				agentDir: params.agentDir,
				workspaceDir: params.workspaceDir,
				providerRegistry: params.providerRegistry,
				capability,
				activeModel: params.activeModel,
				nativeVisionActive: false
			}) : resolvedEntries,
			automaticAudio,
			config,
			request: params.request
		});
		if (output) outputs.push(output);
		attachmentProcessing[attachment.index] = processing;
		attachmentDispositions[attachment.index] = output ? { kind: "handled" } : attempts.length > 0 ? { kind: "failed" } : { kind: "no-model" };
		attachmentDecisions.push({
			attachmentIndex: attachment.index,
			attempts,
			chosen: attempts.find((attempt) => attempt.outcome === "success")
		});
	}
	const decision = await buildDecision(outputs.length > 0 ? "success" : hasFailedMediaAttempt(attachmentDecisions) ? "failed" : "skipped", attachmentDecisions, attachmentDispositions);
	if (decision.outcome === "failed") logWarn(`media-understanding: ${formatDecisionSummary(decision)}`);
	else if (shouldLogVerbose()) logVerbose(`Media understanding ${formatDecisionSummary(decision)}`);
	return {
		outputs,
		decision
	};
}
//#endregion
export { resolveAutoImageModel as n, runCapability as r, buildProviderRegistry as t };
