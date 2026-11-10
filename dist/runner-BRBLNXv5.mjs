import { l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
import { y as uniqueStrings } from "./string-normalization-D6DKCpwE.mjs";
import { n as findNormalizedProviderValue } from "./provider-id-D1VImdKk.mjs";
import { n as ok } from "./result-BQGgYouL.mjs";
import { r as createLazyRuntimeModule } from "./lazy-runtime-CJrzFzqU.mjs";
import { o as resolveAgentModelFallbackValues, s as resolveAgentModelPrimaryValue } from "./model-input-CeM8o97s.mjs";
import { c as inferUniqueProviderFromConfiguredModels, i as buildModelAliasIndex, y as resolveModelRefFromString } from "./model-selection-shared-CVU_V2PQ.mjs";
import { t as resolveDefaultModelForAgent } from "./model-selection-config-CrboVKXT.mjs";
import "./model-selection-DdQ-ffuG.mjs";
import { i as logVerbose, o as shouldLogVerbose } from "./globals-XVSoVbNQ.mjs";
import { i as logWarn } from "./logger-DHVmYOKs.mjs";
import { k as isProviderAuthError } from "./model-auth-provider-config-C_EL9CxV.mjs";
import { n as resolveConfiguredMediaEntryCapabilities, t as matchesMediaEntryCapability } from "./entry-capabilities-uCzDotfm.mjs";
import { n as normalizeMediaProviderId, t as normalizeMediaExecutionProviderId } from "./provider-id-BZvihdyi.mjs";
import { o as resolveModelEntries, s as resolveScopeDecision } from "./resolve-t14Gdp_w.mjs";
import { n as classifyMediaReferenceSource } from "./media-reference-Dlq4zAi4.mjs";
import { n as resolveDefaultMediaModelFromRegistry, r as providerSupportsCapability, t as resolveAutoMediaKeyProvidersFromRegistry } from "./provider-registry-metadata-DGhKsOa4.mjs";
import { i as selectAttachments, r as isMediaUnderstandingSkipError } from "./attachments-BF8uPjs6.mjs";
import "./runner.attachments-DIrYURkS.mjs";
import { n as isMinimaxVlmProvider, t as isMinimaxVlmModel } from "./minimax-vlm-CskCPHOb.mjs";
import { n as inspectLocalAudioSelection } from "./local-audio-Bck3sHku.mjs";
import { n as getMediaUnderstandingProvider, t as buildMediaUnderstandingRegistry } from "./provider-registry-BXxQV3kt.mjs";
import { r as hasProviderAuthAvailable, t as assertMediaExecutionCurrent } from "./provider-execution-BP6sfFq6.mjs";
import { a as runCliEntry, o as runProviderEntry, r as formatDecisionSummary, t as buildModelDecision } from "./runner.entries-DJsrHoKQ.mjs";
//#region src/media-understanding/runner.ts
function resolveProviderRegistry(registry) {
	return typeof registry === "function" ? registry() : registry;
}
const loadPreparedModelCatalogApi = createLazyRuntimeModule(async () => ({
	...await import("./model-catalog-CA9i3mf_.mjs"),
	...await import("./prepared-model-catalog-CCWmZ0HZ.mjs")
}));
function resolveConfiguredKeyProviderOrder(params) {
	const configuredProviders = Object.keys(params.cfg.models?.providers ?? {}).map((providerId) => normalizeMediaExecutionProviderId(providerId)).filter(Boolean);
	const supportedProviders = uniqueStrings(configuredProviders).filter((providerId) => providerSupportsCapability(params.providerRegistry.get(normalizeMediaProviderId(providerId)), params.capability));
	return uniqueStrings([...supportedProviders, ...params.fallbackProviders]);
}
function resolveConfiguredImageModelId(params) {
	return findNormalizedProviderValue(params.cfg.models?.providers, params.providerId)?.models?.find((entry) => entry?.id?.trim() && entry.input?.includes("image"))?.id.trim();
}
function resolveCatalogImageModelId(params) {
	const matches = params.catalog.filter((entry) => normalizeMediaProviderId(entry.provider) === normalizeMediaProviderId(params.providerId) && params.modelSupportsVision(entry));
	if (matches.length === 0) return;
	const autoEntry = matches.find((entry) => normalizeLowercaseStringOrEmpty(entry.id) === "auto");
	return normalizeOptionalString((autoEntry ?? matches[0])?.id);
}
async function explicitImageModelVisionStatus(params) {
	if (isMinimaxVlmProvider(params.providerId) && !isMinimaxVlmModel(params.providerId, params.model)) return "unsupported";
	if (resolveConfiguredImageModelId(params) === params.model) return "supported";
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
	const { resolveDefaultMediaModel } = await import("./defaults-DdhFBSIQ.mjs");
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
async function resolveKeyEntry(params) {
	const { cfg, providerRegistry, capability } = params;
	const activeProvider = params.activeModel?.provider?.trim();
	if (activeProvider) {
		const model = params.activeModel?.model;
		const activeEntry = await resolveAutoProviderModelEntry(params, activeProvider, () => model);
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
		const entry = await resolveAutoProviderModelEntry(params, providerId, () => void 0);
		if (entry) return entry;
	}
	return null;
}
function resolveImageModelFromAgentDefaults(params) {
	const refs = [resolveAgentModelPrimaryValue(params.cfg.agents?.defaults?.imageModel), ...resolveAgentModelFallbackValues(params.cfg.agents?.defaults?.imageModel)].map((ref) => ref?.trim()).filter((ref) => Boolean(ref));
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
	return (params.cfg.tools?.media?.models ?? []).some((entry) => {
		const configured = resolveConfiguredMediaEntryCapabilities(entry);
		if (configured) return configured.includes("image");
		return matchesMediaEntryCapability({
			entry,
			capability: "image",
			providerRegistry: resolveProviderRegistry(params.providerRegistry)
		});
	});
}
async function activeModelSupportsNativeVision(params) {
	const activeProvider = params.activeModel?.provider?.trim();
	if (!activeProvider) return false;
	if (isMinimaxVlmProvider(activeProvider) && !/^MiniMax-M3(\b|[-.])/i.test(params.activeModel?.model?.trim() ?? "")) return false;
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
	const localAudio = await inspectLocalAudioSelection({ language: params.language });
	for (const entry of localAudio.entries) yield { entry };
}
async function resolveAutoEntries(params) {
	if (params.capability === "image" && !params.nativeVisionActive) {
		const imageModelEntries = resolveImageModelFromAgentDefaults(params);
		if (imageModelEntries.length > 0) return imageModelEntries.map((entry) => ({ entry }));
	}
	const prepared = {
		...params,
		providerRegistry: params.providerRegistry ?? buildMediaUnderstandingRegistry(void 0, params.cfg)
	};
	const activeProvider = normalizeMediaExecutionProviderId(prepared.activeModel?.provider ?? "");
	if (activeProvider) {
		const activeEntry = await resolveAutoProviderModelEntry(prepared, activeProvider, () => prepared.activeModel?.model);
		if (activeEntry) return [{ entry: activeEntry }];
	}
	const keys = await resolveKeyEntry(prepared);
	if (keys) return [{ entry: keys }];
	return [];
}
async function resolveAutoImageModel(params) {
	const entries = await resolveAutoEntries({
		...params,
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
async function resolveAutoProviderModelEntry(params, providerId, readModel) {
	const provider = getMediaUnderstandingProvider(providerId, params.providerRegistry);
	if (!providerSupportsCapability(provider, params.capability)) return null;
	if (!(params.capability === "audio" && provider?.transcribeAudioWithContext) && !await hasProviderAuthAvailable({
		...params,
		provider: providerId
	})) return null;
	let model;
	if (params.capability === "image") model = await resolveAutoImageModelId({
		...params,
		providerId,
		explicitModel: readModel()
	});
	else if (params.capability === "audio") model = resolveDefaultMediaModelFromRegistry({
		...params,
		providerId
	});
	else model = readModel() ?? resolveDefaultMediaModelFromRegistry({
		...params,
		providerId
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
			assertMediaExecutionCurrent(params.execution);
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
			assertMediaExecutionCurrent(params.execution);
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
		nativeVisionProbe ??= activeModelSupportsNativeVision(params).catch((err) => {
			if (shouldLogVerbose()) logVerbose(`native vision support check failed: ${String(err)}`);
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
	const providerRegistry = resolveProviderRegistry(params.providerRegistry);
	const entries = resolveModelEntries({
		cfg,
		capability,
		config,
		providerRegistry
	});
	const automaticAudio = capability === "audio" && entries.length === 0;
	let resolvedEntries = entries;
	if (!automaticAudio && resolvedEntries.length === 0) resolvedEntries = await resolveAutoEntries({
		...params,
		providerRegistry,
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
			...params,
			attachment,
			providerRegistry,
			cache: params.attachments,
			entries: automaticAudio ? resolveAutoAudioEntries({
				...params,
				providerRegistry,
				language: params.request?.language ?? config.language
			}) : resolvedEntries,
			automaticAudio,
			config
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
export { runCapability as n, resolveAutoImageModel as t };
