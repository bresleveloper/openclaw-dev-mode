import { c as normalizeOptionalLowercaseString, l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
import { p as shortenHomePath } from "./utils-gjJ-tD2q.mjs";
import { r as normalizeProviderId } from "./provider-id-D1VImdKk.mjs";
import { o as MODEL_SELECTION_LOCKED_MESSAGE } from "./openclaw-state-worker-error-B93Lf_P2.mjs";
import { a as resolveAgentDir } from "./agent-scope-config-fjA2T9Gz.mjs";
import { r as resolveCollapsedSessionAuthPinSource } from "./auth-profile-override-provenance-Jztnei-C.mjs";
import "./agent-scope-DXrnO3F4.mjs";
import { t as modelKey } from "./model-key-5zORvMDY.mjs";
import { o as dedupeModelCatalogEntries, r as buildConfiguredModelCatalog } from "./model-selection-shared-CVU_V2PQ.mjs";
import { t as getChannelPlugin } from "./registry-B91r5qN6.mjs";
import { c as resolveSystemEventQueueKey } from "./system-event-ownership-DAgHWXZ1.mjs";
import { s as enqueueSystemEvent } from "./system-events-Bf4ozS7L.mjs";
import "./plugins-CCVkYF8m.mjs";
import { n as emitSessionLifecycleEvent } from "./session-lifecycle-events-76OxWRqj.mjs";
import { a as isModelSelectionLocked } from "./model-overrides-CgHG3YVT.mjs";
import { n as createModelVisibilityPolicy, t as RUNTIME_MODEL_VISIBILITY_NORMALIZATION } from "./model-visibility-policy-pIK04Peo.mjs";
import "./model-selection-DdQ-ffuG.mjs";
import { c as resolveSupportedThinkingLevel, n as formatThinkingLevels, r as isThinkingLevelSupported } from "./thinking-BCNoGfZ5.mjs";
import { o as resolveEffectiveAgentRuntime } from "./thinking-runtime-DuxsJR5q.mjs";
import { d as readSessionInputProfileId } from "./host-context-builder-2jolfam-.mjs";
import { v as prepareAuthProfileProvider } from "./store-runtime-CwqGD12G.mjs";
import { a as formatFastModeCurrentStatus, c as formatFastModeValue, i as formatFastModeConfirmation, r as formatFastModeCommandOptions } from "./fast-mode-smSVCJXN.mjs";
import { t as resolveFastModeState } from "./fast-mode-DezNRstT.mjs";
import { i as resolveSelectedAndActiveModel, n as readSessionFallbackModelAsync } from "./session-fallback-model-079vSBeH.mjs";
import { n as resolveQueueSettingsCore } from "./settings-B2OKXilH.mjs";
import { u as refreshQueuedFollowupSession } from "./state-DNPW_vEt.mjs";
import { u as renderExecTargetLabel } from "./bash-tools.exec-runtime-BPbW16Jz.mjs";
import { i as resolveSandboxRuntimeStatusAsync } from "./runtime-status-DWm-5zUj.mjs";
import { i as resolveExecDefaultsAsync } from "./exec-defaults-DrIV-0KT.mjs";
import { l as resolveAuthStorePathForDisplayAsync } from "./oauth-refresh-fence-eL04wGfj.mjs";
import { n as resolveConfiguredModelEntries } from "./configured-model-entries-BnlVcGcZ.mjs";
import { t as persistStickyModelSelectionBestEffort } from "./sticky-model-selection-BU6sDfPI.mjs";
import "./queue-Cz-W2oxX.mjs";
import { t as triggerSessionPatchHook } from "./session-patch-hooks-Bgv6_R3W.mjs";
import { t as applyModelOverrideWithAuthProfileCompatibility } from "./auth-profile-preservation-UYIf2L8-.mjs";
import { r as prefixSystemMessage } from "./system-message-C34aMvlW.mjs";
import "./sandbox-4O9XYRNc.mjs";
import { a as formatElevatedEvent, c as formatReasoningEvent, d as withOptions, f as resolveModelSelectionFromDirective, i as canPersistSessionDirectiveDefaults, l as persistSessionDirectiveSnapshot, m as resolveInvalidExecDirectiveMessage, n as acknowledgeIgnoredSessionDirective, o as formatElevatedUnavailableText, p as maybeHandleUnexpectedDirectiveArguments, r as applySessionDirectiveFields, s as formatModelSelectionScopeAck, t as DIRECTIVE_ACK_MESSAGES, u as resolveDirectiveTouchedSessionFields } from "./directive-handling.shared-_RzPOUR_.mjs";
import { t as applyModelRuntimeDirective } from "./directive-handling.model-runtime-8QOLmJ6L.mjs";
import { a as prepareModelSelectionRuntime, t as findSelectedCatalogEntry } from "./model-runtime-normalization-B2xB-s-G.mjs";
import { t as resolveRuntimePolicySessionKey } from "./runtime-policy-session-key-BGyWa30_.mjs";
import { a as resolveModelsCommandReply } from "./commands-models-DzIQgypm.mjs";
//#region src/auto-reply/reply/directive-handling.model.ts
async function maybeHandleModelDirectiveInfo(params) {
	if (!params.directives.hasModelDirective) return;
	const directive = normalizeOptionalLowercaseString(params.directives.rawModelDirective);
	const isLiteralModelDirective = params.directives.modelDirectiveSource !== "alias";
	const wantsStatus = isLiteralModelDirective && directive === "status";
	const wantsSummary = isLiteralModelDirective && !directive;
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
	const completedModel = await readSessionFallbackModelAsync({
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
	const lines = [`Current: ${modelRefs.selected.label}${modelRefs.activeDiffers ? " (selected)" : ""}`, modelRefs.activeDiffers ? `Active: ${modelRefs.active.label} (runtime)` : null].filter((line) => Boolean(line));
	if (wantsSummary) {
		const thinkingRuntime = resolveEffectiveAgentRuntime({
			cfg: params.cfg,
			provider: params.provider,
			modelId: params.model,
			agentId: params.activeAgentId,
			sessionKey: params.runtimePolicySessionKey,
			sessionEntry: params.sessionEntry
		});
		const effectiveThinkLevel = resolveSupportedThinkingLevel({
			provider: params.provider,
			model: params.model,
			level: params.currentThinkLevel,
			catalog: params.thinkingCatalog,
			agentRuntime: thinkingRuntime
		});
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
				...lines,
				`Think: ${effectiveThinkLevel} (change with /think <level>)`,
				...instructions
			].join("\n"),
			...channelData ? { channelData } : {}
		};
	}
	const configured = resolveConfiguredModelEntries({
		cfg: params.cfg,
		defaultProvider: params.defaultProvider,
		defaultModel: params.defaultModel,
		agentId: params.activeAgentId,
		aliasIndex: params.aliasIndex,
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
	const pickerCatalog = createModelVisibilityPolicy({
		cfg: params.cfg,
		agentId: params.activeAgentId,
		defaultProvider: params.defaultProvider,
		defaultModel: configured.defaultRef,
		catalog,
		...RUNTIME_MODEL_VISIBILITY_NORMALIZATION
	}).allowedCatalog;
	if (pickerCatalog.length === 0) return { text: "No models available." };
	const { loadPreparedModelCatalogView } = await import("./model-catalog-view-DkfCA_bv.mjs");
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
	lines.push(`Default: ${params.defaultProvider}/${params.defaultModel}`, `Agent: ${params.activeAgentId}`, `Auth store: ${shortenHomePath(await resolveAuthStorePathForDisplayAsync(params.agentDir))}`);
	if (params.resetModelOverride) lines.push(`(previous selection reset to default)`);
	const configuredKeys = new Set(buildConfiguredModelCatalog({ cfg: params.cfg }).map((entry) => modelKey(entry.provider, entry.id)));
	const wrapperKeys = new Set(pickerCatalog.flatMap((entry) => {
		const id = normalizeOptionalString(entry.id) ?? "";
		const slash = id.indexOf("/");
		if (slash <= 0) return [];
		const nestedProvider = normalizeProviderId(id.slice(0, slash));
		const nestedModel = normalizeOptionalString(id.slice(slash + 1));
		return nestedProvider && nestedModel && nestedProvider !== normalizeProviderId(entry.provider) ? [modelKey(nestedProvider, nestedModel)] : [];
	}));
	const byProvider = /* @__PURE__ */ new Map();
	for (const entry of pickerCatalog) {
		const provider = normalizeProviderId(entry.provider);
		if (wrapperKeys.size > 0) {
			const key = modelKey(provider, normalizeOptionalString(entry.id) ?? "");
			if (!configuredKeys.has(key) && authByProvider.get(provider) === "missing" && wrapperKeys.has(key)) continue;
		}
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
		return { text: withOptions(`Current queue settings: mode=${settings.mode}, debounce=${debounceLabel}, cap=${capLabel}, drop=${settings.dropPolicy ?? "default"}.`, "modes steer, followup, collect, interrupt; debounce:<ms|s|m>, cap:<n>, drop:old|new|summarize") };
	}
	const errors = [
		!directives.queueMode && !directives.queueReset && directives.rawQueueMode ? `Unrecognized queue mode "${directives.rawQueueMode}". Valid modes: steer, followup, collect, interrupt.` : void 0,
		directives.rawDebounce !== void 0 && typeof directives.debounceMs !== "number" ? `Invalid debounce "${directives.rawDebounce ?? ""}". Use ms/s/m (e.g. debounce:1500ms, debounce:2s).` : void 0,
		directives.rawCap !== void 0 && typeof directives.cap !== "number" ? `Invalid cap "${directives.rawCap ?? ""}". Use a positive integer (e.g. cap:10).` : void 0,
		directives.rawDrop !== void 0 && !directives.dropPolicy ? `Invalid drop policy "${directives.rawDrop ?? ""}". Use drop:old, drop:new, or drop:summarize.` : void 0
	].filter(Boolean);
	return errors.length ? { text: errors.join(" ") } : void 0;
}
//#endregion
//#region src/auto-reply/reply/directive-handling.impl.ts
const LEVEL_QUERY_OPTIONS = {
	Verbose: ["off, on, full", "on, full, off"],
	Trace: ["off, on, raw", "on, off, raw"],
	Reasoning: ["on, off, stream", "on, off, stream"]
};
const ELEVATED_RUNTIME_HINT = prefixSystemMessage("Runtime is direct; sandboxing does not apply.");
async function handleDirectiveOnly(params) {
	const { directives, sessionEntry, sessionStore, sessionKey, storePath, elevatedEnabled, elevatedAllowed, defaultProvider, defaultModel, aliasIndex, allowedModelKeys, allowedModelCatalog, provider, model, formatModelSwitchEvent, currentThinkLevel, currentFastMode, currentVerboseLevel, currentReasoningLevel, currentElevatedLevel } = params;
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
		reply: typeof reply === "string" ? { text: reply } : reply,
		directives,
		ignoredDirective,
		persistenceState: params.persistenceState,
		applyRemainingDirectives: (remainingDirectives) => handleDirectiveOnly({
			...params,
			directives: remainingDirectives
		})
	});
	const acknowledgeLevel = (name, currentLevel) => {
		const [validLevels, options] = LEVEL_QUERY_OPTIONS[name];
		const rawLevel = directives[`raw${name}Level`];
		return acknowledgeIgnoredDirective(rawLevel ? `Unrecognized ${name.toLowerCase()} level "${rawLevel}". Valid levels: ${validLevels}.` : withOptions(`Current ${name.toLowerCase()} level: ${currentLevel ?? "off"}.`, options), `has${name}Directive`);
	};
	const delegatedTraceAllowed = (params.gatewayClientScopes ?? []).includes("operator.admin");
	if (directives.hasTraceDirective && !params.senderIsOwner && !delegatedTraceAllowed) return acknowledgeIgnoredDirective("❌ /trace is restricted to owners and gateway clients with operator.admin scope.", "hasTraceDirective");
	const activeAgentId = params.agentId;
	const agentDir = resolveAgentDir(params.cfg, activeAgentId);
	const runtimePolicySessionKey = resolveRuntimePolicySessionKey(params);
	const runtimeIsSandboxed = (await resolveSandboxRuntimeStatusAsync({
		cfg: params.cfg,
		agentId: activeAgentId,
		sessionKey,
		classificationSessionKey: runtimePolicySessionKey,
		...runtimePolicySessionKey === sessionKey ? { preparedSessionEntry: params.sessionEntry ?? null } : {}
	})).sandboxed;
	const shouldHintDirectRuntime = directives.hasElevatedDirective && !runtimeIsSandboxed;
	let thinkingCatalog = params.thinkingCatalog?.length ? params.thinkingCatalog : allowedModelCatalog.length > 0 ? allowedModelCatalog : void 0;
	const modelInfo = await maybeHandleModelDirectiveInfo({
		...params,
		agentDir,
		activeAgentId,
		currentThinkLevel: currentThinkLevel ?? "off",
		thinkingCatalog,
		runtimePolicySessionKey
	});
	if (modelInfo) return acknowledgeIgnoredDirective(modelInfo, "hasModelDirective");
	const modelResolution = await resolveModelSelectionFromDirective({
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
			return acknowledgeIgnoredDirective(withOptions(`Current thinking level: ${level}.`, `default, ${formatThinkingLevels(resolvedProvider, resolvedModel, ", ", thinkingCatalog, thinkingRuntime)}`), "hasThinkDirective");
		}
		return acknowledgeIgnoredDirective(`Unrecognized thinking level "${directives.rawThinkLevel}". Valid levels: default, ${formatThinkingLevels(resolvedProvider, resolvedModel, ", ", thinkingCatalog, thinkingRuntime)}.`, "hasThinkDirective");
	}
	if (directives.hasVerboseDirective && !directives.verboseLevel) return acknowledgeLevel("Verbose", currentVerboseLevel);
	if (directives.hasTraceDirective && !directives.traceLevel) return acknowledgeLevel("Trace", sessionEntry.traceLevel);
	if (directives.hasFastDirective && directives.fastMode === void 0 && !directives.clearFastMode) {
		const isFastStatus = normalizeLowercaseStringOrEmpty(directives.rawFastMode) === "status";
		if (!directives.rawFastMode || isFastStatus) {
			const statusText = formatFastModeCurrentStatus({
				mode: effectiveFastMode,
				source: fastModeState.source,
				fastAutoOnSeconds: fastModeState.fastAutoOnSeconds
			});
			return acknowledgeIgnoredDirective(isFastStatus ? statusText : withOptions(statusText, formatFastModeCommandOptions({ fastAutoOnSeconds: fastModeState.fastAutoOnSeconds })), "hasFastDirective");
		}
		return acknowledgeIgnoredDirective(`Unrecognized fast mode "${directives.rawFastMode}". Valid levels: on, off, ultrafast, auto, default, status.`, "hasFastDirective");
	}
	if (directives.hasReasoningDirective && !directives.reasoningLevel) return acknowledgeLevel("Reasoning", currentReasoningLevel);
	if (directives.hasElevatedDirective) {
		if (!directives.elevatedLevel && directives.rawElevatedLevel) return acknowledgeIgnoredDirective(`Unrecognized elevated level "${directives.rawElevatedLevel}". Valid levels: off, on, ask, full.`, "hasElevatedDirective");
		if (!elevatedEnabled || !elevatedAllowed) return acknowledgeIgnoredDirective(formatElevatedUnavailableText({
			runtimeSandboxed: runtimeIsSandboxed,
			failures: params.elevatedFailures,
			sessionKey: params.sessionKey
		}), "hasElevatedDirective");
		if (!directives.elevatedLevel) return acknowledgeIgnoredDirective([withOptions(`Current elevated level: ${currentElevatedLevel ?? "off"}.`, "on, off, ask, full"), shouldHintDirectRuntime ? ELEVATED_RUNTIME_HINT : null].filter(Boolean).join("\n"), "hasElevatedDirective");
	}
	if (directives.hasExecDirective) {
		const invalidExecMessage = resolveInvalidExecDirectiveMessage(directives);
		if (invalidExecMessage) return acknowledgeIgnoredDirective(invalidExecMessage, "hasExecDirective");
		const unexpectedExecArguments = maybeHandleUnexpectedDirectiveArguments(directives);
		if (unexpectedExecArguments) {
			params.onRejection?.();
			return unexpectedExecArguments;
		}
		if (!directives.hasExecOptions) {
			const execDefaults = await resolveExecDefaultsAsync({
				cfg: params.cfg,
				sessionEntry,
				agentId: activeAgentId,
				sandboxAvailable: runtimeIsSandboxed
			});
			const nodeLabel = execDefaults.node ? `node=${execDefaults.node}` : "node=(unset)";
			return acknowledgeIgnoredDirective(withOptions(`Current exec defaults: host=${renderExecTargetLabel(execDefaults.host)}, effective=${execDefaults.effectiveHost}, security=${execDefaults.security}, ask=${execDefaults.ask}, ${nodeLabel}.`, "host=auto|sandbox|gateway|node, security=deny|allowlist|full, ask=off|on-miss|always, node=<id>"), "hasExecDirective");
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
	const prevReasoningLevel = currentReasoningLevel ?? sessionEntry.reasoningLevel ?? "off";
	const elevatedChanged = directives.hasElevatedDirective && directives.elevatedLevel !== void 0 && directives.elevatedLevel !== (currentElevatedLevel ?? sessionEntry.elevatedLevel ?? "off") && elevatedEnabled && elevatedAllowed;
	let modelSelectionUpdated = false;
	let configuredDefaultUpdate;
	const touchedSessionFields = resolveDirectiveTouchedSessionFields({
		directives,
		allowPrivilegedPersistence,
		directiveOnly: !params.persistenceState
	});
	const fastModeChanged = directives.hasFastDirective && directives.fastMode !== void 0 && directives.fastMode !== currentFastMode || directives.clearFastMode && currentFastMode !== fastModeState.mode;
	const reasoningChanged = directives.hasReasoningDirective && directives.reasoningLevel !== void 0 && directives.reasoningLevel !== prevReasoningLevel;
	if (touchedSessionFields.length > 0) {
		const pinnedProfile = modelSelection && !profileOverride && sessionEntry.authProfileOverride?.trim();
		const recordedProvider = pinnedProfile ? await prepareAuthProfileProvider({
			agentDir,
			profileId: pinnedProfile
		}) : void 0;
		const authProfileError = validateSelection();
		if (authProfileError) return rejectModelTransaction(authProfileError);
		const initialSessionEntry = { ...sessionEntry };
		const directiveFieldsUpdated = !params.persistenceState && applySessionDirectiveFields({
			directives,
			sessionEntry,
			allowPrivilegedPersistence,
			allowElevatedPersistence: elevatedEnabled && elevatedAllowed
		});
		if (modelSelection) {
			const applied = applyModelOverrideWithAuthProfileCompatibility({
				cfg: params.cfg,
				agentDir,
				entry: sessionEntry,
				currentProvider: provider,
				selection: modelSelection,
				explicitDefaultSelection: modelSelection.isDefault,
				profileOverride,
				recordedProvider,
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
				commitGuard: modelResolution.modelSelectionSource,
				validateCommit: preparedModel?.validateRuntimeSelection
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
		if (sessionKey && (directiveFieldsUpdated || modelSelectionUpdated)) emitSessionLifecycleEvent({
			sessionKey,
			agentId: activeAgentId,
			reason: "patch",
			...modelSelectionUpdated ? { catalogChanged: true } : {}
		});
		if (modelSelection && modelSelectionUpdated && sessionKey) triggerSessionPatchHook({
			cfg: params.cfg,
			sessionEntry,
			sessionKey,
			patch: {
				key: sessionKey,
				model: directives.rawModelDirective ?? `${modelSelection.provider}/${modelSelection.model}`
			}
		});
		if (sessionKey && (modelSelection && modelSelectionUpdated || touchedSessionFields.includes("thinkingLevel"))) refreshQueuedFollowupSession({
			key: sessionKey,
			...modelSelection && modelSelectionUpdated ? {
				nextProvider: modelSelection.provider,
				nextModel: modelSelection.model,
				nextRouteResolution: "resolved",
				nextModelOverrideSource: modelSelection.isDefault ? void 0 : "user",
				nextAuthProfileId: sessionEntry.authProfileOverride,
				nextAuthProfileIdSource: resolveCollapsedSessionAuthPinSource(sessionEntry)
			} : {},
			nextThinking: {
				level: sessionEntry.thinkingLevel,
				catalog: thinkingCatalog,
				agentRuntime: resolveThinkingRuntime(sessionEntry)
			}
		});
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
		for (const [changed, mode, format] of [[
			elevatedChanged,
			"elevated",
			() => formatElevatedEvent(sessionEntry.elevatedLevel)
		], [
			reasoningChanged,
			"reasoning",
			() => formatReasoningEvent(sessionEntry.reasoningLevel)
		]]) if (changed) enqueueSystemEvent(format(), {
			sessionKey: eventSessionKey,
			contextKey: `mode:${mode}`
		});
	}
	if (params.persistenceState) params.persistenceState.outcome = {
		kind: "applied",
		provider: resolvedProvider,
		model: resolvedModel,
		modelCatalog: thinkingCatalog
	};
	const parts = [];
	const addSystemAck = (message) => parts.push(prefixSystemMessage(message));
	if (directives.clearThinkLevel) parts.push("Thinking level reset to default.");
	else if (directives.hasThinkDirective && directives.thinkLevel) parts.push(directives.thinkLevel === "off" ? "Thinking disabled." : `Thinking level set to ${directives.thinkLevel}.`);
	if (directives.clearFastMode) addSystemAck("Fast mode reset to default.");
	else if (directives.hasFastDirective && directives.fastMode !== void 0) addSystemAck(formatFastModeConfirmation(directives.fastMode));
	if (directives.hasVerboseDirective && directives.verboseLevel) addSystemAck(allowPrivilegedPersistence ? DIRECTIVE_ACK_MESSAGES.verbose[directives.verboseLevel] : "Verbose logging set for the current reply only.");
	if (directives.hasTraceDirective && directives.traceLevel) addSystemAck(DIRECTIVE_ACK_MESSAGES.trace[directives.traceLevel]);
	if (directives.hasVerboseDirective && directives.verboseLevel && !allowPrivilegedPersistence) addSystemAck("Verbose defaults require operator.admin for gateway callers; skipped persistence.");
	if (directives.hasReasoningDirective && directives.reasoningLevel) addSystemAck(DIRECTIVE_ACK_MESSAGES.reasoning[directives.reasoningLevel]);
	if (directives.hasElevatedDirective && directives.elevatedLevel) {
		addSystemAck(DIRECTIVE_ACK_MESSAGES.elevated[directives.elevatedLevel]);
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
		if (execParts.length > 0) addSystemAck(label ? `${label} (${execParts.join(", ")}).` : "Exec defaults require operator.admin for gateway callers; skipped persistence.");
	}
	if (modelSelection) {
		parts.push(formatModelSelectionScopeAck({
			selection: modelSelection,
			configuredDefaultUpdate,
			...params.stickyModelSelectionTarget ? { stickyModelSelectionTarget: params.stickyModelSelectionTarget } : {}
		}));
		if (profileOverride) parts.push(`Auth profile set to ${profileOverride}.`);
		if (modelRuntimeResolution.kind === "clear") parts.push("Runtime reset to configured policy.");
		else if (modelRuntimeResolution.kind === "set") parts.push(`Runtime set to ${modelRuntimeResolution.runtime} for this session.`);
	}
	if (directives.hasQueueDirective && directives.queueMode) addSystemAck(`Queue mode set to ${directives.queueMode}.`);
	else if (directives.hasQueueDirective && directives.queueReset) addSystemAck("Queue mode reset to default.");
	if (directives.hasQueueDirective && typeof directives.debounceMs === "number") addSystemAck(`Queue debounce set to ${directives.debounceMs}ms.`);
	if (directives.hasQueueDirective && typeof directives.cap === "number") addSystemAck(`Queue cap set to ${directives.cap}.`);
	if (directives.hasQueueDirective && directives.dropPolicy) addSystemAck(`Queue drop set to ${directives.dropPolicy}.`);
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
