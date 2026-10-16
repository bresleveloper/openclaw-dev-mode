import { l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
import { p as shortenHomePath } from "./utils-DgZn2dLu.mjs";
import { r as normalizeProviderId } from "./provider-id-D1VImdKk.mjs";
import { a as resolveAgentDir } from "./agent-scope-config-CDYpzA0r.mjs";
import { r as resolveCollapsedSessionAuthPinSource } from "./auth-profile-override-provenance-Jztnei-C.mjs";
import "./agent-scope-CG17uXFn.mjs";
import { t as modelKey } from "./model-key-5zORvMDY.mjs";
import { o as dedupeModelCatalogEntries, r as buildConfiguredModelCatalog } from "./model-selection-shared-BZeDVoch.mjs";
import { b as resolveAuthStorePathForDisplay } from "./profiles-bOpxmzRV.mjs";
import { c as resolveSystemEventQueueKey } from "./system-event-ownership-BkQcgSZJ.mjs";
import { i as enqueueSystemEvent } from "./system-events-BD0JkU8V.mjs";
import { a as readSessionInputProfileId } from "./host-context-builder-7xIt8ezS.mjs";
import { c as resolveSupportedThinkingLevel, n as formatThinkingLevels, r as isThinkingLevelSupported } from "./thinking-DK1cFezU.mjs";
import "./model-selection-C1qxt1eY.mjs";
import "./auth-profiles-DqHEfJ-y.mjs";
import { t as resolveConfiguredModelEntries } from "./configured-model-entries-CmPcCOdA.mjs";
import { s as resolveEffectiveAgentRuntime } from "./thinking-runtime-BwS3HC5I.mjs";
import { n as emitSessionLifecycleEvent } from "./session-lifecycle-events-qdejgRzS.mjs";
import { t as getChannelPlugin } from "./registry-DOE8N7Jo.mjs";
import "./plugins-Z9_SzFi0.mjs";
import { s as isModelSelectionLocked, t as MODEL_SELECTION_LOCKED_MESSAGE } from "./model-overrides-uZFvcSRc.mjs";
import { a as formatFastModeCurrentStatus, c as formatFastModeValue, i as formatFastModeConfirmation, r as formatFastModeCommandOptions } from "./fast-mode-smSVCJXN.mjs";
import { n as resolveSandboxRuntimeStatus } from "./runtime-status-Dk4uhhe-.mjs";
import { f as renderExecTargetLabel } from "./bash-tools.exec-runtime-DHVZ1MQF.mjs";
import { r as resolveExecDefaults } from "./exec-defaults-B7HapOub.mjs";
import { t as resolveFastModeState } from "./fast-mode-CdiysUl0.mjs";
import { r as resolveSelectedAndActiveModel, t as readSessionFallbackModel } from "./session-fallback-model-rr3iaOIv.mjs";
import { t as resolveQueueSettingsCore } from "./settings-DJWifhdm.mjs";
import { l as refreshQueuedFollowupSession } from "./state-C3aKakvf.mjs";
import { n as createModelVisibilityPolicy, t as RUNTIME_MODEL_VISIBILITY_NORMALIZATION } from "./model-visibility-policy-C9Xz8Ynt.mjs";
import "./queue-CuG9CD9y.mjs";
import { t as triggerSessionPatchHook } from "./session-patch-hooks-Cq2jdhep.mjs";
import { t as applyModelOverrideWithAuthProfileCompatibility } from "./auth-profile-preservation-C7x4I4Ip.mjs";
import { r as prefixSystemMessage } from "./system-message-C34aMvlW.mjs";
import "./sandbox-DXRpw1Ja.mjs";
import { t as persistStickyModelSelectionBestEffort } from "./sticky-model-selection-DhufpkOc.mjs";
import { a as formatElevatedEvent, c as formatReasoningEvent, d as withOptions, f as resolveModelSelectionFromDirective, i as canPersistSessionDirectiveDefaults, l as persistSessionDirectiveSnapshot, m as resolveInvalidExecDirectiveMessage, n as acknowledgeIgnoredSessionDirective, o as formatElevatedUnavailableText, p as maybeHandleUnexpectedDirectiveArguments, r as applySessionDirectiveFields, s as formatModelSelectionScopeAck, t as DIRECTIVE_ACK_MESSAGES, u as resolveDirectiveTouchedSessionFields } from "./directive-handling.shared-Blfa8dj2.mjs";
import { t as applyModelRuntimeDirective } from "./directive-handling.model-runtime-BwbBgcYH.mjs";
import { a as prepareModelSelectionRuntime, t as findSelectedCatalogEntry } from "./model-runtime-normalization-CtuiQyDR.mjs";
import { t as resolveRuntimePolicySessionKey } from "./runtime-policy-session-key-DOzvFOPh.mjs";
import { i as resolveModelsCommandReply } from "./commands-models-CAT-ayCd.mjs";
//#region src/auto-reply/reply/directive-handling.model.ts
function buildModelPickerCatalog(params) {
	const configured = resolveConfiguredModelEntries({
		...params,
		...RUNTIME_MODEL_VISIBILITY_NORMALIZATION
	});
	const catalog = dedupeModelCatalogEntries([...params.allowedModelCatalog.flatMap((entry) => {
		const id = normalizeOptionalString(entry.id);
		const provider = normalizeProviderId(entry.provider);
		return id && provider ? [{
			provider,
			id,
			name: entry.name ?? id
		}] : [];
	}), ...configured.entries.map(({ ref }) => ({
		provider: ref.provider,
		id: ref.model,
		name: ref.model
	}))]);
	return createModelVisibilityPolicy({
		cfg: params.cfg,
		agentId: params.agentId,
		defaultProvider: params.defaultProvider,
		defaultModel: configured.defaultRef,
		catalog,
		...RUNTIME_MODEL_VISIBILITY_NORMALIZATION
	}).allowedCatalog;
}
function filterMissingAuthNestedProviderDuplicates(params) {
	const configuredKeys = new Set(buildConfiguredModelCatalog({ cfg: params.cfg }).map((entry) => modelKey(entry.provider, entry.id)));
	const wrapperKeys = /* @__PURE__ */ new Set();
	for (const entry of params.entries) {
		const id = normalizeOptionalString(entry.id) ?? "";
		const slash = id.indexOf("/");
		if (slash <= 0) continue;
		const nestedProvider = normalizeProviderId(id.slice(0, slash));
		const nestedModel = normalizeOptionalString(id.slice(slash + 1)) ?? "";
		const wrapperProvider = normalizeProviderId(entry.provider);
		if (!nestedProvider || !nestedModel || nestedProvider === wrapperProvider) continue;
		wrapperKeys.add(modelKey(nestedProvider, nestedModel));
	}
	if (wrapperKeys.size === 0) return params.entries;
	return params.entries.filter((entry) => {
		const provider = normalizeProviderId(entry.provider);
		const id = normalizeOptionalString(entry.id) ?? "";
		const key = modelKey(provider, id);
		if (configuredKeys.has(key)) return true;
		return params.authByProvider.get(provider) !== "missing" || !wrapperKeys.has(key);
	});
}
async function maybeHandleModelDirectiveInfo(params) {
	if (!params.directives.hasModelDirective) return;
	const rawDirective = normalizeOptionalString(params.directives.rawModelDirective);
	const directive = rawDirective ? normalizeLowercaseStringOrEmpty(rawDirective) : void 0;
	const isLiteralModelDirective = params.directives.modelDirectiveSource !== "alias";
	const wantsStatus = isLiteralModelDirective && directive === "status";
	const wantsSummary = isLiteralModelDirective && !rawDirective;
	const wantsLegacyList = isLiteralModelDirective && directive === "list";
	if (!wantsSummary && !wantsStatus && !wantsLegacyList) return;
	if (params.directives.rawModelProfile) return {
		text: "Auth profile override requires a model selection.",
		isError: true
	};
	if (params.directives.rawModelRuntime) return {
		text: "Runtime override requires a model selection.",
		isError: true
	};
	if (params.directives.modelScope) return {
		text: `${params.directives.modelScope === "session" ? "Session-only" : params.directives.modelScope === "agent" ? "Agent" : "Global"} scope requires a model selection.`,
		isError: true
	};
	if (wantsLegacyList) return await resolveModelsCommandReply({
		cfg: params.cfg,
		commandBodyNormalized: "/models",
		surface: params.surface,
		currentModel: `${params.provider}/${params.model}`,
		agentId: params.activeAgentId,
		agentDir: params.agentDir,
		workspaceDir: params.workspaceDir,
		sessionEntry: params.sessionEntry
	}) ?? { text: "No models available." };
	const modelParams = {
		selectedProvider: params.provider,
		selectedModel: params.model,
		sessionEntry: params.sessionEntry
	};
	const completedModel = readSessionFallbackModel({
		...modelParams,
		config: params.cfg,
		sessionScope: {
			agentId: params.activeAgentId,
			sessionKey: params.sessionKey,
			storePath: params.storePath
		}
	});
	const modelRefs = resolveSelectedAndActiveModel({
		...modelParams,
		sessionEntry: completedModel ?? params.sessionEntry
	});
	if (wantsSummary) {
		const current = modelRefs.selected.label;
		const thinkingRuntime = resolveEffectiveAgentRuntime({
			cfg: params.cfg,
			provider: params.provider,
			modelId: params.model,
			agentId: params.activeAgentId,
			sessionKey: params.runtimePolicySessionKey,
			sessionEntry: params.sessionEntry
		});
		const thinkingLine = `Think: ${resolveSupportedThinkingLevel({
			provider: params.provider,
			model: params.model,
			level: params.currentThinkLevel,
			catalog: params.thinkingCatalog,
			agentRuntime: thinkingRuntime
		})} (change with /think <level>)`;
		const activeRuntimeLine = modelRefs.activeDiffers ? `Active: ${modelRefs.active.label} (runtime)` : null;
		const channelData = (params.surface ? getChannelPlugin(params.surface) : null)?.commands?.buildModelBrowseChannelData?.();
		const instructions = channelData ? [
			"Tap below to select a model, or use:",
			"/model <provider/model> -s for this session only",
			"/model <provider/model> -a to update this agent's default",
			"/model <provider/model> -g to update the global default",
			"/model <provider/model> --runtime <runtime> -s to switch harnesses",
			"/model status for details"
		] : [
			"Session: /model <provider/model> -s",
			"Agent default: /model <provider/model> -a",
			"Global default: /model <provider/model> -g",
			"Runtime: /model <provider/model> --runtime <runtime> -s",
			"Browse: /models (providers) or /models <provider> (models)",
			"More: /model status"
		];
		return {
			text: [
				`Current: ${current}${modelRefs.activeDiffers ? " (selected)" : ""}`,
				activeRuntimeLine,
				thinkingLine,
				"",
				...instructions
			].filter(Boolean).join("\n"),
			...channelData ? { channelData } : {}
		};
	}
	const pickerCatalog = buildModelPickerCatalog({
		cfg: params.cfg,
		defaultProvider: params.defaultProvider,
		defaultModel: params.defaultModel,
		agentId: params.activeAgentId,
		aliasIndex: params.aliasIndex,
		allowedModelCatalog: params.allowedModelCatalog
	});
	if (pickerCatalog.length === 0) return { text: "No models available." };
	const { loadPreparedModelCatalogView } = await import("./model-catalog-view-EdyDl6O5.mjs");
	const prepared = await loadPreparedModelCatalogView({
		kind: "status",
		config: params.cfg,
		agentId: params.activeAgentId,
		agentDir: params.agentDir,
		workspaceDir: params.workspaceDir,
		entries: pickerCatalog,
		sessionEntry: params.sessionEntry
	});
	const authByProvider = prepared.providerAuthLabels;
	const current = modelRefs.selected.label;
	const defaultLabel = `${params.defaultProvider}/${params.defaultModel}`;
	const lines = [
		`Current: ${current}${modelRefs.activeDiffers ? " (selected)" : ""}`,
		modelRefs.activeDiffers ? `Active: ${modelRefs.active.label} (runtime)` : null,
		`Default: ${defaultLabel}`,
		`Agent: ${params.activeAgentId}`,
		`Auth store: ${shortenHomePath(resolveAuthStorePathForDisplay(params.agentDir))}`
	].filter((line) => Boolean(line));
	if (params.resetModelOverride) lines.push(`(previous selection reset to default)`);
	const statusCatalog = filterMissingAuthNestedProviderDuplicates({
		cfg: params.cfg,
		entries: pickerCatalog,
		authByProvider
	});
	const byProvider = /* @__PURE__ */ new Map();
	for (const entry of statusCatalog) {
		const provider = normalizeProviderId(entry.provider);
		const models = byProvider.get(provider) ?? [];
		models.push(entry);
		byProvider.set(provider, models);
	}
	for (const [provider, models] of byProvider) {
		const authLabel = authByProvider.get(provider) ?? "missing";
		const endpoint = prepared.providerEndpoints.get(provider);
		const endpointSuffix = endpoint?.endpoint ? ` endpoint: ${endpoint?.endpoint}` : " endpoint: default";
		const apiSuffix = endpoint?.api ? ` api: ${endpoint?.api}` : "";
		lines.push("");
		lines.push(`[${provider}]${endpointSuffix}${apiSuffix} auth: ${authLabel}`);
		for (const entry of models) {
			const label = `${provider}/${entry.id}`;
			const aliases = params.aliasIndex.byKey.get(label);
			const aliasSuffix = aliases && aliases.length > 0 ? ` (${aliases.join(", ")})` : "";
			lines.push(`  • ${label}${aliasSuffix}`);
		}
	}
	return { text: lines.join("\n") };
}
//#endregion
//#region src/auto-reply/reply/directive-handling.queue-validation.ts
/** Validates `/queue` directives and returns immediate status/error replies. */
function maybeHandleQueueDirective(params) {
	const { directives } = params;
	if (!directives.hasQueueDirective) return;
	if (!directives.queueMode && !directives.queueReset && !directives.hasQueueOptions && directives.rawQueueMode === void 0 && directives.rawDebounce === void 0 && directives.rawCap === void 0 && directives.rawDrop === void 0) {
		const settings = resolveQueueSettingsCore({
			cfg: params.cfg,
			channel: params.channel,
			sessionEntry: params.sessionEntry
		});
		const debounceLabel = typeof settings.debounceMs === "number" ? `${settings.debounceMs}ms` : "default";
		const capLabel = typeof settings.cap === "number" ? String(settings.cap) : "default";
		const dropLabel = settings.dropPolicy ?? "default";
		return { text: withOptions(`Current queue settings: mode=${settings.mode}, debounce=${debounceLabel}, cap=${capLabel}, drop=${dropLabel}.`, "modes steer, followup, collect, interrupt; debounce:<ms|s|m>, cap:<n>, drop:old|new|summarize") };
	}
	const errors = [];
	if (!directives.queueMode && !directives.queueReset && directives.rawQueueMode) errors.push(`Unrecognized queue mode "${directives.rawQueueMode}". Valid modes: steer, followup, collect, interrupt.`);
	if (directives.rawDebounce !== void 0 && typeof directives.debounceMs !== "number") errors.push(`Invalid debounce "${directives.rawDebounce ?? ""}". Use ms/s/m (e.g. debounce:1500ms, debounce:2s).`);
	if (directives.rawCap !== void 0 && typeof directives.cap !== "number") errors.push(`Invalid cap "${directives.rawCap ?? ""}". Use a positive integer (e.g. cap:10).`);
	if (directives.rawDrop !== void 0 && !directives.dropPolicy) errors.push(`Invalid drop policy "${directives.rawDrop ?? ""}". Use drop:old, drop:new, or drop:summarize.`);
	return errors.length ? { text: errors.join(" ") } : void 0;
}
//#endregion
//#region src/auto-reply/reply/directive-runtime-context.ts
function resolveDirectiveRuntimeContext(params) {
	const activeAgentId = params.agentId;
	const agentDir = resolveAgentDir(params.cfg, activeAgentId);
	const runtimePolicySessionKey = resolveRuntimePolicySessionKey({
		agentId: activeAgentId,
		cfg: params.cfg,
		ctx: params.ctx,
		sessionKey: params.sessionKey
	});
	return {
		activeAgentId,
		agentDir,
		runtimePolicySessionKey,
		runtimeIsSandboxed: resolveSandboxRuntimeStatus({
			cfg: params.cfg,
			agentId: activeAgentId,
			sessionKey: params.sessionKey,
			classificationSessionKey: runtimePolicySessionKey
		}).sandboxed
	};
}
//#endregion
//#region src/auto-reply/reply/directive-handling.impl.ts
const ELEVATED_RUNTIME_HINT = prefixSystemMessage("Runtime is direct; sandboxing does not apply.");
async function handleDirectiveOnly(params) {
	const { directives, sessionEntry, sessionStore, sessionKey, storePath, elevatedEnabled, elevatedAllowed, defaultProvider, defaultModel, aliasIndex, allowedModelKeys, allowedModelCatalog, resetModelOverride, provider, model, formatModelSwitchEvent, currentThinkLevel, currentFastMode, currentVerboseLevel, currentReasoningLevel, currentElevatedLevel } = params;
	const allowPrivilegedPersistence = canPersistSessionDirectiveDefaults(params);
	const rejectModelTransaction = (errorText) => {
		params.onRejection?.();
		if (params.persistenceState) params.persistenceState.outcome = {
			kind: "rejected",
			errorText
		};
		return {
			text: errorText,
			isError: true
		};
	};
	const acknowledgeIgnoredDirective = (reply, ignoredDirective) => acknowledgeIgnoredSessionDirective({
		reply,
		directives,
		ignoredDirective,
		persistenceState: params.persistenceState,
		applyRemainingDirectives: (remainingDirectives) => handleDirectiveOnly({
			...params,
			directives: remainingDirectives
		})
	});
	const delegatedTraceAllowed = (params.gatewayClientScopes ?? []).includes("operator.admin");
	if (directives.hasTraceDirective && !params.senderIsOwner && !delegatedTraceAllowed) return acknowledgeIgnoredDirective({ text: "❌ /trace is restricted to owners and gateway clients with operator.admin scope." }, "hasTraceDirective");
	const { activeAgentId, agentDir, runtimePolicySessionKey, runtimeIsSandboxed } = resolveDirectiveRuntimeContext(params);
	const shouldHintDirectRuntime = directives.hasElevatedDirective && !runtimeIsSandboxed;
	let thinkingCatalog = params.thinkingCatalog?.length ? params.thinkingCatalog : allowedModelCatalog.length > 0 ? allowedModelCatalog : void 0;
	const modelInfo = await maybeHandleModelDirectiveInfo({
		directives,
		cfg: params.cfg,
		agentDir,
		activeAgentId,
		provider,
		model,
		defaultProvider,
		defaultModel,
		aliasIndex,
		allowedModelCatalog,
		currentThinkLevel: currentThinkLevel ?? "off",
		thinkingCatalog,
		runtimePolicySessionKey,
		sessionKey,
		storePath,
		resetModelOverride,
		workspaceDir: params.workspaceDir,
		surface: params.surface,
		sessionEntry
	});
	if (modelInfo) return acknowledgeIgnoredDirective(modelInfo, "hasModelDirective");
	const modelResolution = resolveModelSelectionFromDirective({
		directives,
		cfg: params.cfg,
		agentDir,
		defaultProvider,
		defaultModel,
		aliasIndex,
		allowedModelKeys,
		agentId: activeAgentId,
		modelPolicy: params.modelPolicy,
		operatorAuthority: params.operatorAuthority,
		requesterProfileId: params.ctx ? readSessionInputProfileId(params.ctx) : void 0
	});
	if (modelResolution.errorText) return rejectModelTransaction(modelResolution.errorText);
	const { modelSelection, profileOverride } = modelResolution;
	if (modelSelection && isModelSelectionLocked(sessionEntry)) return rejectModelTransaction(MODEL_SELECTION_LOCKED_MESSAGE);
	const resolvedProvider = modelSelection?.provider ?? provider;
	const resolvedModel = modelSelection?.model ?? model;
	const preparedModel = modelSelection ? await prepareModelSelectionRuntime({
		cfg: params.cfg,
		agentId: activeAgentId,
		workspaceDir: params.workspaceDir,
		provider: resolvedProvider,
		model: resolvedModel,
		catalog: thinkingCatalog ?? [],
		rawRuntime: directives.rawModelRuntime,
		sessionEntry,
		profileOverride
	}) : void 0;
	if (preparedModel?.status === "rejected") return rejectModelTransaction(preparedModel.message);
	thinkingCatalog = preparedModel?.catalog ?? thinkingCatalog;
	const modelRuntimeResolution = preparedModel?.runtime ?? { kind: "unchanged" };
	const validateSelection = () => modelResolution.validateModelSelection?.() ?? preparedModel?.validateRuntimeSelection?.();
	const prospectiveSessionEntry = { ...sessionEntry };
	applyModelRuntimeDirective(prospectiveSessionEntry, modelRuntimeResolution);
	const selectedCatalogEntry = findSelectedCatalogEntry({
		catalog: thinkingCatalog,
		provider: resolvedProvider,
		model: resolvedModel
	});
	const resolveThinkingRuntime = (entry) => resolveEffectiveAgentRuntime({
		cfg: params.cfg,
		provider: resolvedProvider,
		modelId: resolvedModel,
		modelApi: selectedCatalogEntry?.api,
		modelBaseUrl: selectedCatalogEntry?.baseUrl,
		agentId: activeAgentId,
		sessionKey: runtimePolicySessionKey,
		sessionEntry: entry
	});
	const thinkingRuntime = resolveThinkingRuntime(prospectiveSessionEntry);
	const thinkingPolicy = {
		provider: resolvedProvider,
		model: resolvedModel,
		catalog: thinkingCatalog,
		agentRuntime: thinkingRuntime
	};
	const fastModeState = resolveFastModeState({
		cfg: params.cfg,
		provider: resolvedProvider,
		model: resolvedModel,
		agentId: activeAgentId,
		sessionEntry: directives.clearFastMode ? void 0 : sessionEntry
	});
	const effectiveFastMode = directives.fastMode ?? (directives.clearFastMode ? fastModeState.mode : currentFastMode) ?? fastModeState.mode;
	if (directives.hasThinkDirective && !directives.thinkLevel && !directives.clearThinkLevel) {
		if (!directives.rawThinkLevel) {
			const level = resolveSupportedThinkingLevel({
				...thinkingPolicy,
				level: currentThinkLevel ?? "off"
			});
			return acknowledgeIgnoredDirective({ text: withOptions(`Current thinking level: ${level}.`, `default, ${formatThinkingLevels(resolvedProvider, resolvedModel, ", ", thinkingCatalog, thinkingRuntime)}`) }, "hasThinkDirective");
		}
		return acknowledgeIgnoredDirective({ text: `Unrecognized thinking level "${directives.rawThinkLevel}". Valid levels: default, ${formatThinkingLevels(resolvedProvider, resolvedModel, ", ", thinkingCatalog, thinkingRuntime)}.` }, "hasThinkDirective");
	}
	if (directives.hasVerboseDirective && !directives.verboseLevel) return acknowledgeIgnoredDirective({ text: directives.rawVerboseLevel ? `Unrecognized verbose level "${directives.rawVerboseLevel}". Valid levels: off, on, full.` : withOptions(`Current verbose level: ${currentVerboseLevel ?? "off"}.`, "on, full, off") }, "hasVerboseDirective");
	if (directives.hasTraceDirective && !directives.traceLevel) return acknowledgeIgnoredDirective({ text: directives.rawTraceLevel ? `Unrecognized trace level "${directives.rawTraceLevel}". Valid levels: off, on, raw.` : withOptions(`Current trace level: ${sessionEntry.traceLevel ?? "off"}.`, "on, off, raw") }, "hasTraceDirective");
	if (directives.hasFastDirective && directives.fastMode === void 0 && !directives.clearFastMode) {
		const isFastStatus = normalizeLowercaseStringOrEmpty(directives.rawFastMode) === "status";
		if (!directives.rawFastMode || isFastStatus) {
			const statusText = formatFastModeCurrentStatus({
				mode: effectiveFastMode,
				source: fastModeState.source,
				fastAutoOnSeconds: fastModeState.fastAutoOnSeconds
			});
			return acknowledgeIgnoredDirective({ text: isFastStatus ? statusText : withOptions(statusText, formatFastModeCommandOptions({ fastAutoOnSeconds: fastModeState.fastAutoOnSeconds })) }, "hasFastDirective");
		}
		return acknowledgeIgnoredDirective({ text: `Unrecognized fast mode "${directives.rawFastMode}". Valid levels: on, off, ultrafast, auto, default, status.` }, "hasFastDirective");
	}
	if (directives.hasReasoningDirective && !directives.reasoningLevel) return acknowledgeIgnoredDirective({ text: directives.rawReasoningLevel ? `Unrecognized reasoning level "${directives.rawReasoningLevel}". Valid levels: on, off, stream.` : withOptions(`Current reasoning level: ${currentReasoningLevel ?? "off"}.`, "on, off, stream") }, "hasReasoningDirective");
	if (directives.hasElevatedDirective) {
		if (!directives.elevatedLevel && directives.rawElevatedLevel) return acknowledgeIgnoredDirective({ text: `Unrecognized elevated level "${directives.rawElevatedLevel}". Valid levels: off, on, ask, full.` }, "hasElevatedDirective");
		if (!elevatedEnabled || !elevatedAllowed) return acknowledgeIgnoredDirective({ text: formatElevatedUnavailableText({
			runtimeSandboxed: runtimeIsSandboxed,
			failures: params.elevatedFailures,
			sessionKey: params.sessionKey
		}) }, "hasElevatedDirective");
		if (!directives.elevatedLevel) return acknowledgeIgnoredDirective({ text: [withOptions(`Current elevated level: ${currentElevatedLevel ?? "off"}.`, "on, off, ask, full"), shouldHintDirectRuntime ? ELEVATED_RUNTIME_HINT : null].filter(Boolean).join("\n") }, "hasElevatedDirective");
	}
	if (directives.hasExecDirective) {
		const invalidExecMessage = resolveInvalidExecDirectiveMessage(directives);
		if (invalidExecMessage) return acknowledgeIgnoredDirective({ text: invalidExecMessage }, "hasExecDirective");
		const unexpectedExecArguments = maybeHandleUnexpectedDirectiveArguments(directives);
		if (unexpectedExecArguments) {
			params.onRejection?.();
			return unexpectedExecArguments;
		}
		if (!directives.hasExecOptions) {
			const execDefaults = resolveExecDefaults({
				cfg: params.cfg,
				sessionEntry,
				agentId: activeAgentId,
				sandboxAvailable: runtimeIsSandboxed
			});
			const nodeLabel = execDefaults.node ? `node=${execDefaults.node}` : "node=(unset)";
			return acknowledgeIgnoredDirective({ text: withOptions(`Current exec defaults: host=${renderExecTargetLabel(execDefaults.host)}, effective=${execDefaults.effectiveHost}, security=${execDefaults.security}, ask=${execDefaults.ask}, ${nodeLabel}.`, "host=auto|sandbox|gateway|node, security=deny|allowlist|full, ask=off|on-miss|always, node=<id>") }, "hasExecDirective");
		}
	}
	const queueAck = maybeHandleQueueDirective({
		directives,
		cfg: params.cfg,
		channel: provider,
		sessionEntry
	});
	if (queueAck) return acknowledgeIgnoredDirective(queueAck, "hasQueueDirective");
	const unexpectedArguments = maybeHandleUnexpectedDirectiveArguments(directives);
	if (unexpectedArguments) {
		params.onRejection?.();
		return unexpectedArguments;
	}
	if (directives.hasThinkDirective && directives.thinkLevel && !isThinkingLevelSupported({
		...thinkingPolicy,
		level: directives.thinkLevel
	})) return rejectModelTransaction(`Thinking level "${directives.thinkLevel}" is not supported for ${resolvedProvider}/${resolvedModel}. Use one of: ${formatThinkingLevels(resolvedProvider, resolvedModel, ", ", thinkingCatalog, thinkingRuntime)}.`);
	const nextThinkLevel = sessionEntry.thinkingLevel;
	const remappedUnsupportedThinkLevel = nextThinkLevel && (params.persistenceState ? modelSelection : !directives.hasThinkDirective) ? resolveSupportedThinkingLevel({
		...thinkingPolicy,
		level: nextThinkLevel
	}) : void 0;
	const shouldRemapUnsupportedThinkLevel = Boolean(remappedUnsupportedThinkLevel) && remappedUnsupportedThinkLevel !== nextThinkLevel;
	const prevReasoningLevel = currentReasoningLevel ?? sessionEntry.reasoningLevel ?? "off";
	const elevatedChanged = directives.hasElevatedDirective && directives.elevatedLevel !== void 0 && directives.elevatedLevel !== (currentElevatedLevel ?? sessionEntry.elevatedLevel ?? "off") && elevatedEnabled && elevatedAllowed;
	let modelSelectionUpdated = false;
	let configuredDefaultUpdate;
	const touchedSessionFields = resolveDirectiveTouchedSessionFields({
		directives,
		allowPrivilegedPersistence,
		directiveOnly: !params.persistenceState
	});
	if (shouldRemapUnsupportedThinkLevel && !touchedSessionFields.includes("thinkingLevel")) touchedSessionFields.push("thinkingLevel");
	const fastModeChanged = directives.hasFastDirective && directives.fastMode !== void 0 && directives.fastMode !== currentFastMode || directives.clearFastMode && currentFastMode !== fastModeState.mode;
	const reasoningChanged = directives.hasReasoningDirective && directives.reasoningLevel !== void 0 && directives.reasoningLevel !== prevReasoningLevel;
	if (touchedSessionFields.length > 0) {
		const authProfileError = validateSelection();
		if (authProfileError) return rejectModelTransaction(authProfileError);
		const initialSessionEntry = { ...sessionEntry };
		const directiveFieldsUpdated = !params.persistenceState && applySessionDirectiveFields({
			directives,
			sessionEntry,
			allowPrivilegedPersistence,
			allowElevatedPersistence: elevatedEnabled && elevatedAllowed
		});
		if (shouldRemapUnsupportedThinkLevel && remappedUnsupportedThinkLevel) sessionEntry.thinkingLevel = remappedUnsupportedThinkLevel;
		if (modelSelection) {
			const applied = applyModelOverrideWithAuthProfileCompatibility({
				cfg: params.cfg,
				agentDir,
				entry: sessionEntry,
				currentProvider: provider,
				selection: modelSelection,
				explicitDefaultSelection: modelSelection.isDefault,
				profileOverride,
				markLiveSwitchPending: true
			});
			const appliedRuntime = applyModelRuntimeDirective(sessionEntry, modelRuntimeResolution);
			modelSelectionUpdated = applied.updated || appliedRuntime.updated;
		}
		sessionEntry.updatedAt = Date.now();
		sessionStore[sessionKey] = sessionEntry;
		if (storePath) {
			const persistence = await persistSessionDirectiveSnapshot({
				storePath,
				sessionKey,
				initialEntry: initialSessionEntry,
				sessionEntry,
				sessionStore,
				hasModelSelection: Boolean(modelSelection),
				reassertLiveModelSwitchPending: modelSelectionUpdated && sessionEntry.liveModelSwitchPending === true,
				touchedFields: touchedSessionFields,
				validateCommit: validateSelection
			});
			if (persistence.status !== "applied") return rejectModelTransaction(persistence.status === "commit-rejected" ? persistence.error : persistence.status === "model-selection-locked" ? MODEL_SELECTION_LOCKED_MESSAGE : modelSelection ? "Model change was not applied because the session changed. Retry." : "Session settings were not applied because the session changed. Retry.");
		}
		if (modelSelection && params.canPersistStickyModelSelection === true && params.stickyModelSelectionTarget) {
			const modelError = modelResolution.validateModelSelection?.();
			if (modelError) return rejectModelTransaction(modelError);
			configuredDefaultUpdate = persistStickyModelSelectionBestEffort({
				agentId: activeAgentId,
				model: `${modelSelection.provider}/${modelSelection.model}`,
				target: params.stickyModelSelectionTarget
			});
		}
		if (sessionKey && (directiveFieldsUpdated || shouldRemapUnsupportedThinkLevel || modelSelectionUpdated)) emitSessionLifecycleEvent({
			sessionKey,
			agentId: activeAgentId,
			reason: "patch",
			...modelSelectionUpdated ? { catalogChanged: true } : {}
		});
		if (modelSelection && modelSelectionUpdated && sessionKey) {
			triggerSessionPatchHook({
				cfg: params.cfg,
				sessionEntry,
				sessionKey,
				patch: {
					key: sessionKey,
					model: directives.rawModelDirective ?? `${modelSelection.provider}/${modelSelection.model}`
				}
			});
			refreshQueuedFollowupSession({
				key: sessionKey,
				nextProvider: modelSelection.provider,
				nextModel: modelSelection.model,
				nextRouteResolution: "resolved",
				nextModelOverrideSource: modelSelection.isDefault ? void 0 : "user",
				nextAuthProfileId: sessionEntry.authProfileOverride,
				nextAuthProfileIdSource: resolveCollapsedSessionAuthPinSource(sessionEntry),
				nextThinking: {
					level: sessionEntry.thinkingLevel,
					catalog: thinkingCatalog,
					agentRuntime: resolveThinkingRuntime(sessionEntry)
				}
			});
		}
	}
	if (modelSelection) {
		const nextLabel = `${modelSelection.provider}/${modelSelection.model}`;
		if (nextLabel !== params.initialModelLabel) enqueueSystemEvent(formatModelSwitchEvent(nextLabel, modelSelection.alias), {
			sessionKey: resolveSystemEventQueueKey(sessionKey, activeAgentId),
			contextKey: `model:${nextLabel}`
		});
	}
	if (!params.persistenceState) {
		const eventSessionKey = resolveSystemEventQueueKey(sessionKey, activeAgentId);
		if (elevatedChanged) enqueueSystemEvent(formatElevatedEvent(sessionEntry.elevatedLevel), {
			sessionKey: eventSessionKey,
			contextKey: "mode:elevated"
		});
		if (reasoningChanged) enqueueSystemEvent(formatReasoningEvent(sessionEntry.reasoningLevel), {
			sessionKey: eventSessionKey,
			contextKey: "mode:reasoning"
		});
	}
	if (params.persistenceState) params.persistenceState.outcome = {
		kind: "applied",
		provider: resolvedProvider,
		model: resolvedModel,
		modelCatalog: thinkingCatalog
	};
	const parts = [];
	if (directives.clearThinkLevel) parts.push("Thinking level reset to default.");
	else if (directives.hasThinkDirective && directives.thinkLevel) parts.push(directives.thinkLevel === "off" ? "Thinking disabled." : `Thinking level set to ${directives.thinkLevel}.`);
	if (directives.clearFastMode) parts.push(prefixSystemMessage("Fast mode reset to default."));
	else if (directives.hasFastDirective && directives.fastMode !== void 0) parts.push(prefixSystemMessage(formatFastModeConfirmation(directives.fastMode)));
	if (directives.hasVerboseDirective && directives.verboseLevel) {
		const message = allowPrivilegedPersistence ? DIRECTIVE_ACK_MESSAGES.verbose[directives.verboseLevel] : "Verbose logging set for the current reply only.";
		parts.push(prefixSystemMessage(message));
	}
	if (directives.hasTraceDirective && directives.traceLevel) parts.push(prefixSystemMessage(DIRECTIVE_ACK_MESSAGES.trace[directives.traceLevel]));
	if (directives.hasVerboseDirective && directives.verboseLevel && !allowPrivilegedPersistence) parts.push(prefixSystemMessage("Verbose defaults require operator.admin for gateway callers; skipped persistence."));
	if (directives.hasReasoningDirective && directives.reasoningLevel) parts.push(prefixSystemMessage(DIRECTIVE_ACK_MESSAGES.reasoning[directives.reasoningLevel]));
	if (directives.hasElevatedDirective && directives.elevatedLevel) {
		parts.push(prefixSystemMessage(DIRECTIVE_ACK_MESSAGES.elevated[directives.elevatedLevel]));
		if (shouldHintDirectRuntime) parts.push(ELEVATED_RUNTIME_HINT);
	}
	if (directives.hasExecDirective && directives.hasExecOptions) for (const [label, options] of [[allowPrivilegedPersistence && "Exec defaults set", {
		host: directives.execHost,
		node: directives.execNode
	}], ["Exec policy for this run only", {
		security: directives.execSecurity,
		ask: directives.execAsk
	}]]) {
		const execParts = Object.entries(options).filter(([, value]) => Boolean(value)).map(([key, value]) => `${key}=${value}`);
		if (execParts.length > 0) {
			const message = label ? `${label} (${execParts.join(", ")}).` : "Exec defaults require operator.admin for gateway callers; skipped persistence.";
			parts.push(prefixSystemMessage(message));
		}
	}
	if (modelSelection) {
		const label = `${modelSelection.provider}/${modelSelection.model}`;
		const labelWithAlias = modelSelection.alias ? `${modelSelection.alias} (${label})` : label;
		parts.push(formatModelSelectionScopeAck({
			isDefault: modelSelection.isDefault,
			label: labelWithAlias,
			configuredDefaultUpdate,
			...params.stickyModelSelectionTarget ? { stickyModelSelectionTarget: params.stickyModelSelectionTarget } : {}
		}));
		if (profileOverride) parts.push(`Auth profile set to ${profileOverride}.`);
		if (modelRuntimeResolution.kind === "clear") parts.push("Runtime reset to configured policy.");
		else if (modelRuntimeResolution.kind === "set") parts.push(`Runtime set to ${modelRuntimeResolution.runtime} for this session.`);
	}
	if (shouldRemapUnsupportedThinkLevel && remappedUnsupportedThinkLevel) parts.push(`Thinking level set to ${remappedUnsupportedThinkLevel} (${nextThinkLevel} not supported for ${resolvedProvider}/${resolvedModel}).`);
	if (directives.hasQueueDirective && directives.queueMode) parts.push(prefixSystemMessage(`Queue mode set to ${directives.queueMode}.`));
	else if (directives.hasQueueDirective && directives.queueReset) parts.push(prefixSystemMessage("Queue mode reset to default."));
	if (directives.hasQueueDirective && typeof directives.debounceMs === "number") parts.push(prefixSystemMessage(`Queue debounce set to ${directives.debounceMs}ms.`));
	if (directives.hasQueueDirective && typeof directives.cap === "number") parts.push(prefixSystemMessage(`Queue cap set to ${directives.cap}.`));
	if (directives.hasQueueDirective && directives.dropPolicy) parts.push(prefixSystemMessage(`Queue drop set to ${directives.dropPolicy}.`));
	if (fastModeChanged && !params.persistenceState) {
		const nextFastMode = directives.clearFastMode ? fastModeState.mode : sessionEntry.fastMode;
		enqueueSystemEvent(formatFastModeConfirmation(nextFastMode), {
			sessionKey: resolveSystemEventQueueKey(sessionKey, activeAgentId),
			contextKey: `fast:${formatFastModeValue(nextFastMode)}`
		});
	}
	const ack = parts.join(" ").trim();
	return !ack && directives.hasStatusDirective ? void 0 : { text: ack || "OK." };
}
//#endregion
export { handleDirectiveOnly };
