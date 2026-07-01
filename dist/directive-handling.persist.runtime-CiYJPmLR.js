import { v as resolveSessionAgentId } from "./agent-scope-CDZXADgT.js";
import { a as resolveAgentDir, c as resolveDefaultAgentId } from "./agent-scope-config-C3ijpoNo.js";
import { c as resolveContextConfigProviderForRuntime } from "./openai-routing-DXJmS9CT.js";
import { n as resolveAgentHarnessPolicy } from "./harness-runtimes--3bc5qch.js";
import { n as isThinkingLevelSupported, o as resolveSupportedThinkingLevel } from "./thinking-DxaN427I.js";
import { T as replaceSessionEntry } from "./session-accessor-Dx6KDG0K.js";
import { i as modelKey, o as normalizeProviderId } from "./model-selection-normalize-Df7baLev.js";
import "./model-selection-i8V2iTdL.js";
import { a as enqueueSystemEvent } from "./system-events-DNR0hK3x.js";
import { o as resolveCliRuntimeModelBackendBinding } from "./cli-backends-DgIbZRGR.js";
import { t as triggerSessionPatchHook } from "./session-patch-hooks-D_uq0IS4.js";
import { t as applyModelOverrideToSessionEntry } from "./model-overrides-Dajvsx8b.js";
import { t as resolveModelSelectionFromDirective } from "./directive-handling.model-selection-JPcZ6ULi.js";
import { r as resolveContextTokens } from "./model-selection-D8vtZ-9a.js";
import { n as applyVerboseOverride, t as applyTraceOverride } from "./level-overrides-Dc5xNCLx.js";
import { n as enqueueModeSwitchEvents, t as canPersistSessionDirectiveDefaults } from "./directive-handling.shared-DnCv0lmi.js";
//#region src/auto-reply/reply/directive-handling.persist.ts
const MODEL_RUNTIME_CLEAR_VALUES = new Set(["auto", "default"]);
function resolveModelRuntimeOverride(params) {
	const rawRuntime = params.rawRuntime?.trim();
	if (!rawRuntime) return;
	const runtime = normalizeProviderId(rawRuntime);
	if (MODEL_RUNTIME_CLEAR_VALUES.has(runtime)) return { kind: "clear" };
	if (runtime === "openclaw") return {
		kind: "set",
		runtime: "openclaw"
	};
	if (normalizeProviderId(params.provider) === "openai" && runtime === "codex") return {
		kind: "set",
		runtime: "codex"
	};
	const provider = normalizeProviderId(params.provider);
	const backend = resolveCliRuntimeModelBackendBinding({
		config: params.cfg,
		provider,
		runtime
	});
	if (backend) return {
		kind: "set",
		runtime: backend.runtime
	};
	return {
		kind: "invalid",
		runtime: rawRuntime
	};
}
async function persistInlineDirectives(params) {
	const { directives, cfg, sessionEntry, sessionStore, sessionKey, storePath, elevatedEnabled, elevatedAllowed, defaultProvider, defaultModel, aliasIndex, allowedModelKeys, initialModelLabel, formatModelSwitchEvent, agentCfg } = params;
	let { provider, model } = params;
	let thinkingRemap;
	const allowInternalExecPersistence = canPersistSessionDirectiveDefaults({
		messageProvider: params.messageProvider,
		surface: params.surface,
		gatewayClientScopes: params.gatewayClientScopes,
		commandAuthorized: params.commandAuthorized,
		senderIsOwner: params.senderIsOwner
	});
	const allowInternalVerbosePersistence = canPersistSessionDirectiveDefaults({
		messageProvider: params.messageProvider,
		surface: params.surface,
		gatewayClientScopes: params.gatewayClientScopes,
		commandAuthorized: params.commandAuthorized,
		senderIsOwner: params.senderIsOwner
	});
	const thinkingCatalog = params.thinkingCatalog && params.thinkingCatalog.length > 0 ? params.thinkingCatalog : void 0;
	const delegatedTraceAllowed = (params.gatewayClientScopes ?? []).includes("operator.admin");
	const activeAgentId = sessionKey ? resolveSessionAgentId({
		sessionKey,
		config: cfg
	}) : resolveDefaultAgentId(cfg);
	const agentDir = resolveAgentDir(cfg, activeAgentId) ?? params.agentDir;
	if (sessionEntry && sessionStore && sessionKey) {
		const prevElevatedLevel = sessionEntry.elevatedLevel ?? agentCfg?.elevatedDefault ?? (elevatedAllowed ? "on" : "off");
		const prevReasoningLevel = sessionEntry.reasoningLevel ?? "off";
		let elevatedChanged = directives.hasElevatedDirective && directives.elevatedLevel !== void 0 && elevatedEnabled && elevatedAllowed;
		let reasoningChanged = directives.hasReasoningDirective && directives.reasoningLevel !== void 0;
		let updated = false;
		if (directives.clearThinkLevel) {
			if (sessionEntry.thinkingLevel) {
				delete sessionEntry.thinkingLevel;
				updated = true;
			}
		} else if (directives.hasThinkDirective && directives.thinkLevel) {
			sessionEntry.thinkingLevel = directives.thinkLevel;
			updated = true;
		}
		if (directives.clearFastMode) {
			if (sessionEntry.fastMode !== void 0) {
				delete sessionEntry.fastMode;
				updated = true;
			}
		}
		if (directives.hasVerboseDirective && directives.verboseLevel && allowInternalVerbosePersistence) {
			applyVerboseOverride(sessionEntry, directives.verboseLevel);
			updated = true;
		}
		if (directives.hasTraceDirective && directives.traceLevel && (params.senderIsOwner || delegatedTraceAllowed)) {
			applyTraceOverride(sessionEntry, directives.traceLevel);
			updated = true;
		}
		if (directives.hasReasoningDirective && directives.reasoningLevel) {
			if (directives.reasoningLevel === "off") sessionEntry.reasoningLevel = "off";
			else sessionEntry.reasoningLevel = directives.reasoningLevel;
			reasoningChanged = reasoningChanged || directives.reasoningLevel !== prevReasoningLevel && directives.reasoningLevel !== void 0;
			updated = true;
		}
		if (directives.hasElevatedDirective && directives.elevatedLevel && elevatedEnabled && elevatedAllowed) {
			sessionEntry.elevatedLevel = directives.elevatedLevel;
			elevatedChanged = elevatedChanged || directives.elevatedLevel !== prevElevatedLevel && directives.elevatedLevel !== void 0;
			updated = true;
		}
		if (directives.hasExecDirective && directives.hasExecOptions && allowInternalExecPersistence) {
			if (directives.execHost) {
				sessionEntry.execHost = directives.execHost;
				updated = true;
			}
			if (directives.execSecurity) {
				sessionEntry.execSecurity = directives.execSecurity;
				updated = true;
			}
			if (directives.execAsk) {
				sessionEntry.execAsk = directives.execAsk;
				updated = true;
			}
			if (directives.execNode) {
				sessionEntry.execNode = directives.execNode;
				updated = true;
			}
		}
		const modelDirective = directives.hasModelDirective && params.effectiveModelDirective ? params.effectiveModelDirective : void 0;
		let modelUpdated = false;
		if (modelDirective) {
			const modelResolution = resolveModelSelectionFromDirective({
				directives: {
					...directives,
					hasModelDirective: true,
					rawModelDirective: modelDirective
				},
				cfg,
				agentDir,
				defaultProvider,
				defaultModel,
				aliasIndex,
				allowedModelKeys,
				allowedModelCatalog: params.modelCatalog ?? [],
				provider
			});
			if (modelResolution.modelSelection) {
				const appliedModelOverride = applyModelOverrideToSessionEntry({
					entry: sessionEntry,
					selection: modelResolution.modelSelection,
					profileOverride: modelResolution.profileOverride,
					markLiveSwitchPending: params.markLiveSwitchPending
				});
				const runtimeOverride = resolveModelRuntimeOverride({
					rawRuntime: directives.rawModelRuntime,
					provider: modelResolution.modelSelection.provider,
					cfg
				});
				if (runtimeOverride?.kind === "clear") {
					if (sessionEntry.agentRuntimeOverride) {
						delete sessionEntry.agentRuntimeOverride;
						updated = true;
					}
				} else if (runtimeOverride?.kind === "set") {
					if (sessionEntry.agentRuntimeOverride) {
						delete sessionEntry.agentRuntimeOverride;
						updated = true;
					}
					enqueueSystemEvent(`Ignored session runtime ${runtimeOverride.runtime}; configure provider or model runtime policy instead.`, {
						sessionKey,
						contextKey: `model-runtime:${modelResolution.modelSelection.provider}:${runtimeOverride.runtime}:ignored-session-runtime`
					});
				} else if (runtimeOverride?.kind === "invalid") {
					if (sessionEntry.agentRuntimeOverride) {
						delete sessionEntry.agentRuntimeOverride;
						updated = true;
					}
					enqueueSystemEvent(`Ignored unsupported runtime ${runtimeOverride.runtime} for ${modelResolution.modelSelection.provider}.`, {
						sessionKey,
						contextKey: `model-runtime:${modelResolution.modelSelection.provider}:${runtimeOverride.runtime}`
					});
				}
				modelUpdated = appliedModelOverride.updated;
				provider = modelResolution.modelSelection.provider;
				model = modelResolution.modelSelection.model;
				const currentThinkingLevel = sessionEntry.thinkingLevel;
				if (currentThinkingLevel && !directives.hasThinkDirective && !isThinkingLevelSupported({
					provider,
					model,
					level: currentThinkingLevel,
					catalog: thinkingCatalog
				})) {
					const remappedThinkingLevel = resolveSupportedThinkingLevel({
						provider,
						model,
						level: currentThinkingLevel,
						catalog: thinkingCatalog
					});
					if (remappedThinkingLevel !== currentThinkingLevel) {
						sessionEntry.thinkingLevel = remappedThinkingLevel;
						thinkingRemap = {
							from: currentThinkingLevel,
							to: remappedThinkingLevel,
							provider,
							model
						};
						updated = true;
					}
				}
				const nextLabel = `${provider}/${model}`;
				if (nextLabel !== initialModelLabel) enqueueSystemEvent(formatModelSwitchEvent(nextLabel, modelResolution.modelSelection.alias), {
					sessionKey,
					contextKey: `model:${nextLabel}`
				});
				updated = updated || modelUpdated;
			}
		}
		if (directives.hasQueueDirective && directives.queueReset) {
			delete sessionEntry.queueMode;
			delete sessionEntry.queueDebounceMs;
			delete sessionEntry.queueCap;
			delete sessionEntry.queueDrop;
			updated = true;
		}
		if (updated) {
			sessionEntry.updatedAt = Date.now();
			sessionStore[sessionKey] = sessionEntry;
			if (storePath) await replaceSessionEntry({
				storePath,
				sessionKey
			}, sessionEntry);
			if (modelDirective && modelUpdated) triggerSessionPatchHook({
				cfg,
				sessionEntry,
				sessionKey,
				patch: {
					key: sessionKey,
					model: modelDirective
				}
			});
			enqueueModeSwitchEvents({
				enqueueSystemEvent,
				sessionEntry,
				sessionKey,
				elevatedChanged,
				reasoningChanged
			});
		}
	}
	const selectedCatalogEntry = params.modelCatalog?.find((entry) => modelKey(entry.provider, entry.id) === modelKey(provider, model));
	return {
		provider,
		model,
		thinkingRemap,
		contextTokens: resolveContextTokens({
			cfg,
			agentCfg,
			provider: resolveContextConfigProviderForRuntime({
				provider,
				runtimeId: resolveAgentHarnessPolicy({
					provider,
					modelId: model,
					config: cfg,
					agentId: activeAgentId,
					sessionKey
				}).runtime,
				config: cfg
			}),
			model,
			modelContextWindow: selectedCatalogEntry?.contextWindow,
			modelContextTokens: selectedCatalogEntry?.contextTokens
		})
	};
}
//#endregion
export { persistInlineDirectives };
