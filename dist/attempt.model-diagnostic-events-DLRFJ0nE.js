import { a as normalizeLowercaseStringOrEmpty, c as normalizeOptionalString, n as localeLowercasePreservingWhitespace, s as normalizeOptionalLowercaseString } from "./string-coerce-DW4mBlAt.js";
import { d as redactToolPayloadTextWithConfig, o as redactSensitiveFieldValueWithConfig, r as isSensitiveFieldKey } from "./redact-CQ2tlRRk.js";
import { o as isRecord } from "./record-coerce-DHZ4bFlT.js";
import { D as resolveIntegerOption, M as resolveTimestampMsToIsoString, j as resolveTimerTimeoutMs, s as asFiniteNumber } from "./number-coercion-CJQ8TR--.js";
import { i as formatErrorMessage, t as collectErrorGraphCandidates } from "./errors-DCRXIYSQ.js";
import { n as isAbortError } from "./unhandled-rejections-QMGVkiWd.js";
import { _ as uniqueStrings } from "./string-normalization-CRyoFBPt.js";
import { r as openRootFile } from "./root-file-jRMCpJW4.js";
import "./number-coercion-EqFmHmOw.js";
import { C as freezeDiagnosticTraceContext, S as formatDiagnosticTraceparent, o as emitTrustedDiagnosticEvent, s as emitTrustedDiagnosticEventWithPrivateData, t as areDiagnosticsEnabledForProcess, y as createChildDiagnosticTraceContext } from "./diagnostic-events-CLCyIzm6.js";
import { t as createSubsystemLogger } from "./subsystem-yNfG7O3v.js";
import "./boundary-file-read-CBe_wA_B.js";
import { u as readRootJsonObjectSync } from "./json-files-2umMHm0W.js";
import { i as normalizeProviderId } from "./provider-id-Dq06Bcx6.js";
import { i as resolveEffectivePluginActivationState, r as normalizePluginsConfigWithResolver } from "./manifest-registry-DTwXFUt4.js";
import { r as getCurrentPluginMetadataSnapshot } from "./current-plugin-metadata-snapshot-BcIVzXmF.js";
import { i as loadPluginMetadataSnapshot, n as isPluginMetadataSnapshotCompatible } from "./plugin-metadata-snapshot-Dp5LgxH6.js";
import { t as applyMergePatch } from "./merge-patch-C_IYaUrT.js";
import { t as DEFAULT_CONTEXT_TOKENS } from "./defaults-mDjiWzE5.js";
import { r as createAssistantMessageEventStream } from "./event-stream-ReMmOTzX.js";
import { t as parseDurationMs } from "./parse-duration-Da6doDTX.js";
import { F as getCompactionProvider } from "./registry-yozg2pVI.js";
import { l as fireAndForgetBoundedHook, t as getGlobalHookRunner } from "./hook-runner-global-D4fQSLSV.js";
import { J as isCacheEnabled, Y as resolveCacheTtlMs, q as createExpiringMapCache } from "./store-DJ7wx5_V.js";
import { t as emitSessionTranscriptUpdate } from "./transcript-events-BFG5Kqze.js";
import "./version-Bsehiavt.js";
import { G as redactTranscriptMessage, U as isTranscriptOnlyOpenClawAssistantMessage$1, W as isTranscriptOnlyOpenClawAssistantModel } from "./session-accessor-Dx6KDG0K.js";
import { C as resolveProviderCacheTtlEligibility, W as validateProviderReplayTurnsWithPlugin, z as sanitizeProviderReplayHistoryWithPlugin } from "./provider-runtime-D4NEMgBr.js";
import { c as hasCopilotVisionInput, o as buildCopilotDynamicHeaders } from "./copilot-dynamic-headers-CF9zPORX.js";
import { f as stripRuntimeContextCustomMessages } from "./internal-runtime-context-BH_40W4f.js";
import { a as sanitizeToolCallIdsForCloudCodeAssist, n as extractToolResultId, t as extractToolCallsFromAssistant } from "./tool-call-id-DtofXoyE.js";
import { a as stripToolResultDetails, i as sanitizeToolUseResultPairing, n as repairToolUseResultPairing, r as sanitizeToolCallInputs, t as makeMissingToolResult } from "./session-transcript-repair-CzUOZPU5.js";
import { i as streamSimple, o as getApiProvider } from "./stream-Bs1DzXcN.js";
import { it as SettingsManager, s as DefaultResourceLoader } from "./sessions-DP0wANEo.js";
import { t as STREAM_ERROR_FALLBACK_TEXT } from "./stream-message-shared-CdbBqwfX.js";
import { n as SUMMARIZATION_OVERHEAD_TOKENS } from "./compaction-planning-ls7_woPy.js";
import { o as markDiagnosticRunProgress } from "./diagnostic-run-activity-dlxgTFfd.js";
import { i as isSilentReplyPayloadText, o as isSilentReplyText } from "./tokens-Zsy11rTo.js";
import { S as stripInternalMetadataForDisplay } from "./session-utils.fs-CuEupzWa.js";
import { a as makeZeroUsageSnapshot, o as normalizeUsage } from "./usage-C67Kbb7n.js";
import { i as jsonUtf8BytesOrInfinity, n as firstEnumerableOwnKeys, t as boundedJsonUtf8Bytes } from "./json-utf8-bytes-C14lActR.js";
import { i as hasInterSessionUserProvenance, n as annotateInterSessionPromptText, r as applyInputProvenanceToUserMessage, s as normalizeInputProvenance } from "./input-provenance-CQSqbDss.js";
import { t as estimateStringChars } from "./cjk-chars-BtjJDifS.js";
import { n as matchesAnyGlobPattern, t as compileGlobPatterns } from "./glob-pattern-CrqljM7B.js";
import { l as isTimeoutError } from "./failover-error-CZc6_Wx_.js";
import { i as diagnosticProviderRequestIdHash, n as diagnosticErrorFailureKind, t as diagnosticErrorCategory } from "./diagnostic-error-metadata-CkeS05A3.js";
import { t as cloneDiagnosticContentValue } from "./diagnostic-llm-content-DEyCVA3H.js";
import { I as peekAdjustedParamsForToolCall, i as finalizeToolTerminalPresentation } from "./agent-tools.before-tool-call-CP6dTokt.js";
import { i as getPluginToolMeta } from "./tools-DG6VDQeD.js";
import { r as resolveImageSanitizationLimits } from "./image-sanitization-CxLP0YN-.js";
import { d as stripHeartbeatToken } from "./heartbeat-DeLM8EWY.js";
import { h as isReasoningOnlyLengthAssistantTurn } from "./openai-transport-stream-CKFLti3C.js";
import { t as log$3 } from "./logger-DibNup0x.js";
import { c as isAnthropicModelRef, s as isAnthropicFamilyCacheTtlEligible } from "./proxy-KRYT2Ssd.js";
import { a as stripSystemPromptCacheBoundary } from "./system-prompt-cache-boundary-ewprF4Mn.js";
import { y as loadEmbeddedAgentMcpConfig } from "./agent-bundle-mcp-runtime-BkUYqKo5.js";
import { a as resolveEffectiveCompactionMode, r as applyAgentCompactionSettingsFromConfig } from "./agent-settings-CYvHv2Dg.js";
import { r as wrapUntrustedPromptDataBlock } from "./sanitize-for-prompt-ByaJGDhT.js";
import { p as mergePreparedUserTurnMessageForRuntime } from "./queue-DlJx-5Kf.js";
import { c as sanitizeSessionMessagesImages, d as normalizeOpenAIResponsesToolCallIds, l as downgradeOpenAIFunctionCallReasoningPairs, n as validateAnthropicTurns, r as validateGeminiTurns, u as downgradeOpenAIReasoningBlocks, x as sanitizeGoogleTurnOrdering } from "./embedded-agent-helpers-D_zioqUQ.js";
import { r as createBoundaryAwareStreamFnForModel } from "./provider-stream-BSVCqT_P.js";
import { n as createAnthropicVertexStreamFnForModel } from "./simple-completion-transport-830TQwEh.js";
import { t as collectTextContentBlocks } from "./content-blocks-DRK0dze4.js";
import { v as isToolResultError } from "./embedded-agent-message-tool-source-reply-Bv3rRzLe.js";
import { t as buildConfiguredAgentSystemPrompt } from "./system-prompt-config-B-qy6WRv.js";
import { d as truncateToolResultMessage, f as formatContextLimitTruncationNotice, o as resolveLiveToolResultMaxChars, t as DEFAULT_MAX_LIVE_TOOL_RESULT_CHARS } from "./tool-result-truncation-C_2NT8o3.js";
import { a as setRawSessionAppendMessage, c as readTranscriptFileState, i as getRawSessionAppendMessage, l as writeTranscriptFileAtomic, o as TranscriptFileState } from "./transcript-rewrite-CO2KuAHs.js";
import { r as recordPersistedRuntimeToolSchemaQuarantine, t as clearRecoveredPersistedRuntimeToolSchemaQuarantines } from "./tool-schema-quarantine-health-B4s8vKoC.js";
import { a as providerRequiresSignedThinking, o as resolveTranscriptPolicy, s as shouldAllowProviderOwnedThinkingReplay, t as createAgentToolResultMiddlewareRunner } from "./tool-result-middleware-DsdFDvXD.js";
import { o as isGooglePromptCacheEligible } from "./extra-params-s21PGVlz.js";
import { t as extractSections } from "./post-compaction-context-C8Cf0wsC.js";
import { i as computeAdaptiveChunkRatioWithWorker, n as summarizeInStages, r as buildHistoryPrunePlanWithWorker, t as resolveContextWindowTokens$1 } from "./compaction-Kq0fpmGC.js";
import { n as isQueryStopWordToken, t as extractKeywords } from "./query-expansion-D2CCUuHO.js";
import "./query-CYBly3Kw.js";
import { a as resolveContextWindowInfo } from "./context-window-guard-D9hRipzD.js";
import fs from "node:fs";
import path from "node:path";
import fs$1 from "node:fs/promises";
import { randomUUID } from "node:crypto";
import { Buffer as Buffer$1 } from "node:buffer";
//#region src/agents/agent-project-settings-snapshot.ts
/** Builds embedded-agent settings snapshots from global, bundle, and project settings. */
const log$2 = createSubsystemLogger("embedded-agent-settings");
const DEFAULT_EMBEDDED_AGENT_PROJECT_SETTINGS_POLICY = "sanitize";
const SANITIZED_PROJECT_AGENT_KEYS = ["shellPath", "shellCommandPrefix"];
function sanitizeAgentSettingsSnapshot(settings) {
	const sanitized = { ...settings };
	for (const key of SANITIZED_PROJECT_AGENT_KEYS) delete sanitized[key];
	return sanitized;
}
function sanitizeProjectSettings(settings) {
	return sanitizeAgentSettingsSnapshot(settings);
}
function canReuseUnscopedCurrentPluginMetadataSnapshot(config) {
	return normalizePluginsConfigWithResolver(config.plugins).loadPaths.length === 0;
}
function resolveUnscopedCurrentPluginMetadataSnapshot(params) {
	if (!canReuseUnscopedCurrentPluginMetadataSnapshot(params.config)) return;
	return getCurrentPluginMetadataSnapshot({
		env: params.env,
		workspaceDir: params.workspaceDir,
		allowWorkspaceScopedSnapshot: true,
		requireDefaultDiscoveryContext: true
	});
}
function loadBundleSettingsFile(params) {
	const absolutePath = path.join(params.rootDir, params.relativePath);
	const result = readRootJsonObjectSync({
		rootDir: params.rootDir,
		relativePath: params.relativePath,
		boundaryLabel: "plugin root",
		rejectHardlinks: true
	});
	if (!result.ok && result.reason === "open") {
		log$2.warn(`skipping unsafe bundle settings file: ${absolutePath}`);
		return null;
	}
	if (!result.ok) {
		log$2.warn(`${result.error}: ${absolutePath}`);
		return null;
	}
	return sanitizeAgentSettingsSnapshot(result.value);
}
/**
* Load and merge settings contributed by enabled bundle plugins for one
* embedded-agent workspace.
*/
function loadEnabledBundleAgentSettingsSnapshot(params) {
	const workspaceDir = params.cwd.trim();
	if (!workspaceDir) return {};
	const config = params.cfg ?? {};
	const env = params.env ?? process.env;
	const providedSnapshot = params.pluginMetadataSnapshot;
	const metadataSnapshot = providedSnapshot && isPluginMetadataSnapshotCompatible({
		snapshot: providedSnapshot,
		config,
		env,
		workspaceDir
	}) ? providedSnapshot : getCurrentPluginMetadataSnapshot({
		config,
		env,
		workspaceDir
	}) ?? resolveUnscopedCurrentPluginMetadataSnapshot({
		config,
		env,
		workspaceDir
	}) ?? loadPluginMetadataSnapshot({
		workspaceDir,
		config,
		env
	});
	const registry = metadataSnapshot.manifestRegistry;
	if (registry.plugins.length === 0) return {};
	const normalizedPlugins = normalizePluginsConfigWithResolver(config.plugins, metadataSnapshot.normalizePluginId);
	let snapshot = {};
	for (const record of registry.plugins) {
		const settingsFiles = record.settingsFiles ?? [];
		if (record.format !== "bundle" || settingsFiles.length === 0) continue;
		if (!resolveEffectivePluginActivationState({
			id: record.id,
			origin: record.origin,
			config: normalizedPlugins,
			rootConfig: config
		}).activated) continue;
		for (const relativePath of settingsFiles) {
			const bundleSettings = loadBundleSettingsFile({
				rootDir: record.rootDir,
				relativePath
			});
			if (!bundleSettings) continue;
			snapshot = applyMergePatch(snapshot, bundleSettings);
		}
	}
	const embeddedAgentMcp = loadEmbeddedAgentMcpConfig({
		workspaceDir,
		cfg: config,
		manifestRegistry: metadataSnapshot.manifestRegistry
	});
	for (const diagnostic of embeddedAgentMcp.diagnostics) log$2.warn(`bundle MCP skipped for ${diagnostic.pluginId}: ${diagnostic.message}`);
	if (Object.keys(embeddedAgentMcp.mcpServers).length > 0) snapshot = applyMergePatch(snapshot, { mcpServers: embeddedAgentMcp.mcpServers });
	return snapshot;
}
/** Resolves the configured project-settings trust policy for embedded agents. */
function resolveEmbeddedAgentProjectSettingsPolicy(cfg) {
	const raw = cfg?.agents?.defaults?.embeddedAgent?.projectSettingsPolicy;
	if (raw === "trusted" || raw === "sanitize" || raw === "ignore") return raw;
	return DEFAULT_EMBEDDED_AGENT_PROJECT_SETTINGS_POLICY;
}
/** Merges global, plugin, and project settings according to the selected trust policy. */
function buildEmbeddedAgentSettingsSnapshot(params) {
	const effectiveProjectSettings = params.policy === "ignore" ? {} : params.policy === "sanitize" ? sanitizeProjectSettings(params.projectSettings) : params.projectSettings;
	return applyMergePatch(applyMergePatch(params.globalSettings, sanitizeAgentSettingsSnapshot(params.pluginSettings ?? {})), effectiveProjectSettings);
}
//#endregion
//#region src/agents/agent-project-settings.ts
function createEmbeddedAgentSettingsManager(params) {
	const fileSettingsManager = SettingsManager.create(params.cwd, params.agentDir);
	const policy = resolveEmbeddedAgentProjectSettingsPolicy(params.cfg);
	const pluginSettings = loadEnabledBundleAgentSettingsSnapshot({
		cwd: params.cwd,
		cfg: params.cfg,
		pluginMetadataSnapshot: params.pluginMetadataSnapshot
	});
	const hasPluginSettings = Object.keys(pluginSettings).length > 0;
	if (policy === "trusted" && !hasPluginSettings) return fileSettingsManager;
	const settings = buildEmbeddedAgentSettingsSnapshot({
		globalSettings: fileSettingsManager.getGlobalSettings(),
		pluginSettings,
		projectSettings: fileSettingsManager.getProjectSettings(),
		policy
	});
	return SettingsManager.inMemory(settings);
}
function createRuntimeEmbeddedAgentSettingsManager(settingsManager) {
	return SettingsManager.inMemory(buildEmbeddedAgentSettingsSnapshot({
		globalSettings: settingsManager.getGlobalSettings(),
		pluginSettings: {},
		projectSettings: settingsManager.getProjectSettings(),
		policy: "trusted"
	}));
}
/** Creates the runtime SettingsManager with project/plugin settings and compaction overrides. */
function createPreparedEmbeddedAgentSettingsManager(params) {
	const settingsManager = createRuntimeEmbeddedAgentSettingsManager(createEmbeddedAgentSettingsManager(params));
	applyAgentCompactionSettingsFromConfig({
		settingsManager,
		cfg: params.cfg,
		contextTokenBudget: params.contextTokenBudget
	});
	settingsManager.setRetryEnabled(false);
	return settingsManager;
}
//#endregion
//#region src/agents/agent-hooks/session-manager-runtime-registry.ts
/** Creates a WeakMap-backed runtime registry keyed by SessionManager object identity. */
function createSessionManagerRuntimeRegistry() {
	const registry = /* @__PURE__ */ new WeakMap();
	const set = (sessionManager, value) => {
		if (!sessionManager || typeof sessionManager !== "object") return;
		const key = sessionManager;
		if (value === null) {
			registry.delete(key);
			return;
		}
		registry.set(key, value);
	};
	const get = (sessionManager) => {
		if (!sessionManager || typeof sessionManager !== "object") return null;
		return registry.get(sessionManager) ?? null;
	};
	return {
		set,
		get
	};
}
//#endregion
//#region src/agents/embedded-agent-runner/tool-send-receipts.ts
const registry$2 = createSessionManagerRuntimeRegistry();
function recordEmbeddedToolSendReceipt(sessionManager, toolCallId, toolSend) {
	const receipts = registry$2.get(sessionManager) ?? /* @__PURE__ */ new Map();
	receipts.set(toolCallId, { details: { toolSend } });
	registry$2.set(sessionManager, receipts);
}
function consumeEmbeddedToolSendReceipt(sessionManager, toolCallId) {
	const receipts = registry$2.get(sessionManager);
	const receipt = receipts?.get(toolCallId);
	if (!receipts || !receipt) return;
	receipts.delete(toolCallId);
	if (receipts.size === 0) registry$2.set(sessionManager, null);
	return receipt;
}
//#endregion
//#region src/agents/embedded-agent-runner/empty-assistant-turn.ts
/**
* Detects provider stop turns that contain no assistant-visible content.
*/
function readFiniteTokenCount(value) {
	return asFiniteNumber(value);
}
function isZero(value) {
	return value === 0;
}
function hasZeroTokenUsageSnapshot(usage) {
	if (!usage || typeof usage !== "object") return false;
	const typed = usage;
	const input = readFiniteTokenCount(typed.input);
	const output = readFiniteTokenCount(typed.output);
	const cacheRead = readFiniteTokenCount(typed.cacheRead);
	const cacheWrite = readFiniteTokenCount(typed.cacheWrite);
	const total = readFiniteTokenCount(typed.total ?? typed.totalTokens ?? typed.total_tokens);
	if (total !== void 0) return total === 0 && [
		input,
		output,
		cacheRead,
		cacheWrite
	].every((value) => value === void 0 || value === 0);
	const components = [
		input,
		output,
		cacheRead,
		cacheWrite
	].filter((value) => value !== void 0);
	return components.length > 0 && components.every(isZero);
}
function isZeroUsageEmptyStopAssistantTurn(message) {
	return Boolean(message && message.stopReason === "stop" && Array.isArray(message.content) && message.content.length === 0 && hasZeroTokenUsageSnapshot(message.usage));
}
//#endregion
//#region src/agents/embedded-agent-runner/thinking.ts
/**
* Sanitizes reasoning/thinking blocks for replay and recovery.
*/
const THINKING_BLOCK_ERROR_PATTERN = /(?:thinking|redacted_thinking).*?(?:cannot be modified|signature|invalid|missing|empty|blank)|(?:signature|invalid|missing|empty|blank).*?(?:thinking|redacted_thinking)/i;
const OMITTED_ASSISTANT_REASONING_TEXT = "[assistant reasoning omitted]";
function isAssistantMessageWithContent(message) {
	return Boolean(message) && typeof message === "object" && message.role === "assistant" && Array.isArray(message.content);
}
function isThinkingBlock(block) {
	return Boolean(block) && typeof block === "object" && (block.type === "thinking" || block.type === "redacted_thinking");
}
function isToolCallBlock(block) {
	if (!block || typeof block !== "object") return false;
	const type = block.type;
	return type === "toolCall" || type === "tool_use" || type === "function_call";
}
function hasAssistantToolCall(message) {
	return message.content.some((block) => isToolCallBlock(block));
}
function isToolResultMessage(message) {
	return Boolean(message) && typeof message === "object" && message.role === "toolResult";
}
function isSignedThinkingBlock(block) {
	if (!isThinkingBlock(block)) return false;
	const record = block;
	return record.type === "redacted_thinking" || record.signature != null || record.thinkingSignature != null || record.thought_signature != null;
}
function hasMeaningfulText$1(block) {
	if (!block || typeof block !== "object" || block.type !== "text") return false;
	return typeof block.text === "string" ? block.text.trim().length > 0 : false;
}
function buildOmittedAssistantReasoningContent() {
	return [{
		type: "text",
		text: OMITTED_ASSISTANT_REASONING_TEXT
	}];
}
function parseTimestampMs(value) {
	if (typeof value === "number" && Number.isFinite(value)) return value;
	if (typeof value === "string") {
		const parsed = Date.parse(value);
		if (Number.isFinite(parsed)) return parsed;
	}
	return null;
}
function stripSignatureFieldsFromThinkingBlock(block) {
	const record = block;
	const stripped = {};
	for (const key of Object.keys(record)) {
		if (key === "thinkingSignature" || key === "signature" || key === "thought_signature") continue;
		if (key === "data" && record.type === "redacted_thinking") continue;
		stripped[key] = record[key];
	}
	return stripped;
}
/**
* Strip all thinking signature fields from a single assistant message.
*
* Removes thinkingSignature / signature / thought_signature from thinking blocks and
* data from redacted_thinking blocks. Thinking text is preserved. If the message
* becomes thinking-only with no signatures, the downstream stripInvalidThinkingSignatures
* will convert those unsigned blocks to placeholder text.
*
* Returns the original reference when nothing was stripped.
*/
function stripThinkingSignaturesFromMessage(message) {
	if (!isAssistantMessageWithContent(message)) return message;
	let changed = false;
	const newContent = [];
	for (const block of message.content) {
		if (!isThinkingBlock(block)) {
			newContent.push(block);
			continue;
		}
		const record = block;
		if (!(record.thinkingSignature != null || record.signature != null || record.thought_signature != null || record.type === "redacted_thinking" && record.data != null)) {
			newContent.push(block);
			continue;
		}
		newContent.push(stripSignatureFieldsFromThinkingBlock(block));
		changed = true;
	}
	if (!changed) return message;
	return {
		...message,
		content: newContent
	};
}
/**
* Strip thinking signatures from assistant messages that predate the latest compaction.
*
* Pre-compaction thinking signatures are cryptographically bound to the original context
* prefix. After compaction the prefix changes (summarized content is replaced by the
* compaction summary) so those signatures are stale and Anthropic rejects them with
* "Invalid signature in thinking block". The existing stripInvalidThinkingSignatures only
* catches absent/blank signatures; this function catches contextually stale ones identified
* by timestamp comparison with the latest compaction summary.
*
* Only strips from assistant messages whose timestamp is strictly before the latest
* compaction summary timestamp. Messages at or after that timestamp may have been generated
* in the new context and retain their signatures. Messages with no parseable timestamp are
* left unchanged.
*
* Returns the original array reference when nothing was changed.
*/
function stripStaleThinkingSignaturesForCompactionReplay(messages) {
	let latestCompactionTimestamp = null;
	for (const message of messages) {
		if (message.role !== "compactionSummary") continue;
		const ts = parseTimestampMs(message.timestamp);
		if (ts !== null) latestCompactionTimestamp = latestCompactionTimestamp === null ? ts : Math.max(latestCompactionTimestamp, ts);
	}
	if (latestCompactionTimestamp === null) return messages;
	let touched = false;
	const out = [];
	for (const message of messages) {
		if (!isAssistantMessageWithContent(message)) {
			out.push(message);
			continue;
		}
		const ts = parseTimestampMs(message.timestamp);
		if (ts === null || ts >= latestCompactionTimestamp) {
			out.push(message);
			continue;
		}
		const stripped = stripThinkingSignaturesFromMessage(message);
		if (stripped !== message) touched = true;
		out.push(stripped);
	}
	return touched ? out : messages;
}
function hasReplayableThinkingSignature(block) {
	if (!isThinkingBlock(block)) return false;
	const record = block;
	return (block.type === "redacted_thinking" ? [
		record.data,
		record.signature,
		record.thinkingSignature,
		record.thought_signature
	] : [
		record.signature,
		record.thinkingSignature,
		record.thought_signature
	]).some((signature) => {
		return typeof signature === "string" && signature.trim().length > 0;
	});
}
/**
* Strip thinking blocks with clearly invalid replay signatures.
*
* Anthropic and Bedrock reject persisted thinking blocks when the signature is
* absent, empty, or blank. They are also the authority for opaque signature
* validity, so this intentionally avoids local length or shape heuristics.
*
* By default, the latest assistant turn is exempt: providers reject modified
* latest thinking blocks, so corrupted latest turns must flow through recovery
* rather than being rewritten before the request. Callers that append a new
* user turn before provider replay can disable that exemption because the
* stored assistant turn is no longer latest in the outbound request.
*/
function stripInvalidThinkingSignatures(messages, options = {}) {
	const preserveLatestAssistant = options.preserveLatestAssistant ?? true;
	let latestAssistantIndex = -1;
	if (preserveLatestAssistant) {
		for (let i = messages.length - 1; i >= 0; i -= 1) if (isAssistantMessageWithContent(messages[i])) {
			latestAssistantIndex = i;
			break;
		}
	}
	let touched = false;
	const out = [];
	for (let i = 0; i < messages.length; i += 1) {
		const message = messages[i];
		if (!isAssistantMessageWithContent(message)) {
			out.push(message);
			continue;
		}
		if (i === latestAssistantIndex) {
			out.push(message);
			continue;
		}
		const nextContent = [];
		let changed = false;
		for (const block of message.content) {
			if (!isThinkingBlock(block) || hasReplayableThinkingSignature(block)) {
				nextContent.push(block);
				continue;
			}
			changed = true;
			touched = true;
		}
		if (!changed) {
			out.push(message);
			continue;
		}
		out.push({
			...message,
			content: nextContent.length > 0 ? nextContent : buildOmittedAssistantReasoningContent()
		});
	}
	return touched ? out : messages;
}
/**
* Strip `type: "thinking"` and `type: "redacted_thinking"` content blocks from
* all assistant messages except the latest one.
*
* Thinking blocks in the latest assistant turn are preserved verbatim so
* providers that require replay signatures can continue the conversation.
*
* If a non-latest assistant message becomes empty after stripping, it is
* replaced with a synthetic non-empty text block to preserve turn structure
* through provider adapters that filter blank text blocks.
*
* Returns the original array reference when nothing was changed (callers can
* use reference equality to skip downstream work).
*/
function dropThinkingBlocks(messages) {
	let latestAssistantIndex = -1;
	for (let i = messages.length - 1; i >= 0; i -= 1) if (isAssistantMessageWithContent(messages[i])) {
		latestAssistantIndex = i;
		break;
	}
	let touched = false;
	const out = [];
	for (let i = 0; i < messages.length; i += 1) {
		const msg = messages[i];
		if (!isAssistantMessageWithContent(msg)) {
			out.push(msg);
			continue;
		}
		if (i === latestAssistantIndex) {
			out.push(msg);
			continue;
		}
		const nextContent = [];
		let changed = false;
		for (const block of msg.content) {
			if (isThinkingBlock(block)) {
				touched = true;
				changed = true;
				continue;
			}
			nextContent.push(block);
		}
		if (!changed) {
			out.push(msg);
			continue;
		}
		const content = nextContent.length > 0 ? nextContent : buildOmittedAssistantReasoningContent();
		out.push({
			...msg,
			content
		});
	}
	return touched ? out : messages;
}
function shouldPreserveCurrentToolTurnReasoning(messages, index, latestUserIndex) {
	const message = messages[index];
	if (index < latestUserIndex || !isAssistantMessageWithContent(message) || !hasAssistantToolCall(message)) return false;
	for (let i = index - 1; i >= 0; i -= 1) {
		const role = messages[i]?.role;
		if (role === "user") break;
		if (role === "assistant") return false;
	}
	for (let i = index + 1; i < messages.length; i += 1) {
		const next = messages[i];
		const role = next?.role;
		if (isToolResultMessage(next)) return true;
		if (role === "user") return false;
	}
	return false;
}
function shouldPreserveLatestAssistantThinking(messages) {
	let latestAssistantIndex = -1;
	for (let index = messages.length - 1; index >= 0; index -= 1) if (isAssistantMessageWithContent(messages[index])) {
		latestAssistantIndex = index;
		break;
	}
	if (latestAssistantIndex < 0) return false;
	if (latestAssistantIndex === messages.length - 1) return true;
	let latestUserIndex = -1;
	for (let index = messages.length - 1; index >= 0; index -= 1) if (messages[index]?.role === "user") {
		latestUserIndex = index;
		break;
	}
	return shouldPreserveCurrentToolTurnReasoning(messages, latestAssistantIndex, latestUserIndex);
}
function stripThinkingBlocksFromMessage(message) {
	if (!isAssistantMessageWithContent(message)) return message;
	const nextContent = message.content.filter((block) => !isThinkingBlock(block));
	if (nextContent.length === message.content.length) return message;
	return {
		...message,
		content: nextContent.length > 0 ? nextContent : buildOmittedAssistantReasoningContent()
	};
}
function stripAllThinkingBlocks(messages) {
	let touched = false;
	const out = [];
	for (const message of messages) {
		const stripped = stripThinkingBlocksFromMessage(message);
		if (stripped === message) {
			out.push(stripped);
			continue;
		}
		touched = true;
		out.push(stripped);
	}
	return touched ? out : messages;
}
function dropReasoningFromHistory(messages) {
	let latestUserIndex = -1;
	for (let index = messages.length - 1; index >= 0; index -= 1) if (messages[index]?.role === "user") {
		latestUserIndex = index;
		break;
	}
	let touched = false;
	const out = [];
	for (let index = 0; index < messages.length; index += 1) {
		const message = messages[index];
		if (!isAssistantMessageWithContent(message)) {
			out.push(message);
			continue;
		}
		if (shouldPreserveCurrentToolTurnReasoning(messages, index, latestUserIndex)) {
			out.push(message);
			continue;
		}
		const nextContent = message.content.filter((block) => !isThinkingBlock(block));
		if (nextContent.length === message.content.length) {
			out.push(message);
			continue;
		}
		touched = true;
		out.push({
			...message,
			content: nextContent.length > 0 ? nextContent : buildOmittedAssistantReasoningContent()
		});
	}
	return touched ? out : messages;
}
function assessLastAssistantMessage(message) {
	if (!isAssistantMessageWithContent(message)) return "valid";
	if (message.content.length === 0) return "incomplete-thinking";
	let hasSignedThinking = false;
	let hasUnsignedThinking = false;
	let hasNonThinkingContent = false;
	let hasEmptyTextBlock = false;
	for (const block of message.content) {
		if (!block || typeof block !== "object") return "incomplete-thinking";
		if (isThinkingBlock(block)) {
			if (isSignedThinkingBlock(block)) hasSignedThinking = true;
			else hasUnsignedThinking = true;
			continue;
		}
		hasNonThinkingContent = true;
		if (block.type === "text" && !hasMeaningfulText$1(block)) hasEmptyTextBlock = true;
	}
	if (hasUnsignedThinking) return "incomplete-thinking";
	if (hasSignedThinking && !hasNonThinkingContent) return "incomplete-text";
	if (hasSignedThinking && hasEmptyTextBlock) return "incomplete-text";
	return "valid";
}
function shouldRecoverAnthropicThinkingError(error, sessionMeta) {
	const candidates = collectErrorGraphCandidates(error, (current) => [
		current.cause,
		current.error,
		current.rawError,
		current.errorMessage,
		current.message
	]);
	for (const candidate of candidates) if (typeof candidate === "string" && shouldRecoverAnthropicThinkingErrorMessage(candidate, sessionMeta)) return true;
	return false;
}
function shouldRecoverAnthropicThinkingErrorMessage(message, sessionMeta) {
	if (!THINKING_BLOCK_ERROR_PATTERN.test(message)) return false;
	if (sessionMeta.recoveredAnthropicThinking) {
		log$3.warn(`[session-recovery] Anthropic thinking recovery already attempted: sessionId=${sessionMeta.id}`);
		return false;
	}
	return true;
}
function isAssistantMessageErrorEvent(event) {
	return Boolean(event) && typeof event === "object" && event.type === "error";
}
async function notifyRecoveredAnthropicThinking(sessionMeta, recovery) {
	try {
		await sessionMeta.onRecoveredAnthropicThinking?.(recovery);
	} catch (error) {
		log$3.warn(`[session-recovery] Anthropic thinking transcript repair hook failed: sessionId=${sessionMeta.id} error=${formatErrorMessage(error)}`);
	}
}
function isSuccessfulRecoveryRetryResult(message) {
	if (!message) return false;
	return message.stopReason !== "error" && message.stopReason !== "aborted";
}
function wrapRetryStreamWithRecoveryNotification(retryStream, notify) {
	if (retryStream instanceof Promise) return retryStream.then((resolved) => wrapRetryStreamWithRecoveryNotification(resolved, notify));
	const streamWithResult = retryStream;
	if (typeof streamWithResult.result !== "function") return retryStream;
	const result = streamWithResult.result.bind(streamWithResult);
	let notified = false;
	streamWithResult.result = async () => {
		const message = await result();
		if (!notified && isSuccessfulRecoveryRetryResult(message)) {
			notified = true;
			await notify();
		}
		return message;
	};
	return retryStream;
}
async function retryStreamWithoutThinking(outer, retry, notify) {
	const retryStream = retry();
	const resolvedRetry = retryStream instanceof Promise ? await retryStream : retryStream;
	for await (const chunk of resolvedRetry) outer.push(chunk);
	const result = await resolvedRetry.result?.();
	if (isSuccessfulRecoveryRetryResult(result)) await notify();
	return result;
}
async function pumpStreamWithRecovery(outer, stream, sessionMeta, retry, notify) {
	let yieldedOutput = false;
	try {
		const resolved = stream instanceof Promise ? await stream : stream;
		for await (const chunk of resolved) {
			if (isAssistantMessageErrorEvent(chunk)) {
				if (shouldRecoverAnthropicThinkingError(chunk.error, sessionMeta)) if (yieldedOutput) log$3.warn(`[session-recovery] Anthropic thinking error occurred after streaming began; skipping retry to avoid duplicate chunks: sessionId=${sessionMeta.id}`);
				else {
					sessionMeta.recoveredAnthropicThinking = true;
					log$3.warn(`[session-recovery] Anthropic thinking stream error; retrying once without thinking blocks: sessionId=${sessionMeta.id}`);
					return retryStreamWithoutThinking(outer, retry, notify);
				}
			} else yieldedOutput = true;
			outer.push(chunk);
		}
		return await resolved.result?.();
	} catch (error) {
		if (!shouldRecoverAnthropicThinkingError(error, sessionMeta)) throw error;
		if (yieldedOutput) {
			log$3.warn(`[session-recovery] Anthropic thinking error occurred after streaming began; skipping retry to avoid duplicate chunks: sessionId=${sessionMeta.id}`);
			throw error;
		}
		sessionMeta.recoveredAnthropicThinking = true;
		log$3.warn(`[session-recovery] Anthropic thinking error during stream; retrying once without thinking blocks: sessionId=${sessionMeta.id}`);
		return retryStreamWithoutThinking(outer, retry, notify);
	}
}
function wrapAnthropicStreamWithRecovery(innerStreamFn, sessionMeta) {
	return (model, context, options) => {
		const requestMeta = {
			id: sessionMeta.id,
			onRecoveredAnthropicThinking: sessionMeta.onRecoveredAnthropicThinking
		};
		const contextRecord = context;
		const originalMessages = Array.isArray(contextRecord.messages) ? contextRecord.messages : [];
		const retry = () => {
			const cleanedMessages = stripAllThinkingBlocks(originalMessages);
			return innerStreamFn(model, {
				...context,
				messages: cleanedMessages
			}, options);
		};
		const notify = () => notifyRecoveredAnthropicThinking(requestMeta, {
			originalMessages,
			cleanedMessages: stripAllThinkingBlocks(originalMessages)
		});
		const stream = innerStreamFn(model, context, options);
		if (stream instanceof Promise) return stream.catch((error) => {
			if (!shouldRecoverAnthropicThinkingError(error, requestMeta)) throw error;
			requestMeta.recoveredAnthropicThinking = true;
			log$3.warn(`[session-recovery] Anthropic thinking request rejected; retrying once without thinking blocks: sessionId=${requestMeta.id}`);
			return wrapRetryStreamWithRecoveryNotification(retry(), notify);
		});
		const outer = createAssistantMessageEventStream();
		const finalResultPromise = pumpStreamWithRecovery(outer, stream, requestMeta, retry, notify).finally(() => {
			outer.end();
		});
		outer.result = () => finalResultPromise;
		return outer;
	};
}
//#endregion
//#region src/agents/compaction-usage.ts
function parseCompactionUsageTimestamp(value) {
	if (typeof value === "number" && Number.isFinite(value)) return value;
	if (typeof value === "string") {
		const parsed = Date.parse(value);
		if (Number.isFinite(parsed)) return parsed;
	}
	return null;
}
function stripStaleAssistantUsageBeforeLatestCompaction(messages, options = {}) {
	let latestCompactionSummaryIndex = -1;
	let latestCompactionTimestamp = null;
	for (let i = 0; i < messages.length; i += 1) {
		const entry = messages[i];
		if (entry?.role !== "compactionSummary") continue;
		latestCompactionSummaryIndex = i;
		latestCompactionTimestamp = parseCompactionUsageTimestamp(entry.timestamp ?? null);
	}
	const hasCompactionSummary = latestCompactionSummaryIndex !== -1;
	if (!hasCompactionSummary && options.whenMissingCompactionSummary !== "zeroAssistantUsage") return messages;
	const out = options.mutate ? messages : [...messages];
	let touched = false;
	for (let i = 0; i < out.length; i += 1) {
		const candidate = out[i];
		if (!candidate || candidate.role !== "assistant") continue;
		if (!candidate.usage || typeof candidate.usage !== "object") continue;
		const messageTimestamp = parseCompactionUsageTimestamp(candidate.timestamp);
		const compactionTimestamp = latestCompactionTimestamp;
		const hasTimestampBoundary = hasCompactionSummary && compactionTimestamp !== null && messageTimestamp !== null;
		if (!!hasCompactionSummary && !(hasTimestampBoundary && messageTimestamp <= compactionTimestamp) && !(hasCompactionSummary && !hasTimestampBoundary && i < latestCompactionSummaryIndex)) continue;
		out[i] = {
			...candidate,
			usage: makeZeroUsageSnapshot()
		};
		touched = true;
	}
	return touched ? out : messages;
}
//#endregion
//#region src/agents/session-tool-result-state.ts
/** Tracks pending tool calls so sanitized transcript repair can flush in order. */
function createPendingToolCallState() {
	const pending = /* @__PURE__ */ new Map();
	return {
		size: () => pending.size,
		entries: () => pending.entries(),
		getToolName: (id) => pending.get(id),
		delete: (id) => {
			pending.delete(id);
		},
		clear: () => {
			pending.clear();
		},
		trackToolCalls: (calls) => {
			for (const call of calls) pending.set(call.id, call.name);
		},
		getPendingIds: () => Array.from(pending.keys()),
		shouldFlushForSanitizedDrop: () => pending.size > 0,
		shouldFlushBeforeNonToolResult: (nextRole, toolCallCount) => pending.size > 0 && (toolCallCount === 0 || nextRole !== "assistant"),
		shouldFlushBeforeNewToolCalls: (toolCallCount) => pending.size > 0 && toolCallCount > 0
	};
}
//#endregion
//#region src/agents/session-tool-result-guard.ts
/**
* Session transcript guard for tool-call/result consistency.
*
* Caps large tool results, repairs missing results, applies redaction, and emits transcript update events.
*/
/**
* Truncate oversized text content blocks in a tool result message.
* Returns the original message if under the limit, or a new message with
* truncated text blocks otherwise.
*/
function capToolResultSize(msg, maxChars) {
	if (msg.role !== "toolResult") return msg;
	return truncateToolResultMessage(msg, maxChars, {
		suffix: (truncatedChars) => formatContextLimitTruncationNotice(truncatedChars),
		minKeepChars: 2e3
	});
}
function resolveMaxToolResultChars(opts) {
	return resolveIntegerOption(opts?.maxToolResultChars, DEFAULT_MAX_LIVE_TOOL_RESULT_CHARS, { min: 1 });
}
function isUserAgentMessage(message) {
	return message.role === "user";
}
function isExpectedCompactionAppend(entryId, appendedText) {
	const lines = appendedText.trimEnd().split("\n").filter((line) => line.length > 0);
	if (lines.length !== 1) return false;
	try {
		const entry = JSON.parse(lines[0]);
		return entry.type === "compaction" && entry.id === entryId;
	} catch {
		return false;
	}
}
function resolveEntryTranscriptSeq(sessionManager, entryId, seqByEntryId) {
	if (!entryId) return 0;
	const cached = seqByEntryId.get(entryId);
	if (cached !== void 0) return cached;
	let seq = 0;
	for (const entry of sessionManager.getBranch(entryId)) {
		if (entry.type === "message" || entry.type === "compaction") seq += 1;
		seqByEntryId.set(entry.id, seq);
	}
	return seqByEntryId.get(entryId);
}
function resolveAppendedMessageSeq(params) {
	if (typeof params.entryId !== "string") return;
	const parentSeq = resolveEntryTranscriptSeq(params.sessionManager, params.parentEntryId, params.seqByEntryId);
	if (parentSeq === void 0) return;
	const messageSeq = parentSeq + 1;
	params.seqByEntryId.set(params.entryId, messageSeq);
	return messageSeq;
}
const MAX_PERSISTED_TOOL_RESULT_DETAILS_BYTES = 8192;
const MAX_PERSISTED_DETAIL_STRING_CHARS = 2e3;
const MAX_PERSISTED_DETAIL_SESSION_COUNT = 10;
const MAX_PERSISTED_DETAIL_FALLBACK_STRING_CHARS = 200;
const MAX_PERSISTED_DETAIL_REDACTION_LOOKAHEAD_CHARS = 1024;
const MAX_PERSISTED_DETAIL_BOUNDARY_OVERLAP_CHARS = 512;
const PERSISTED_DETAIL_REDACTION_BOUNDARY = "\0OPENCLAW_PERSISTED_DETAIL_BOUNDARY\0";
const PARTIAL_STRUCTURED_SECRET_VALUE_RE = /(?:["']?(?:api[-_]?key|apikey|token|secret|password|passwd|access[-_]?token|accesstoken|refresh[-_]?token|refreshtoken|auth[-_]?token|authtoken|client[-_]?secret|clientsecret|app[-_]?secret|appsecret|card[-_]?number|cardnumber|cvc|cvv)["']?\s*[:=]\s*["']?)(?!\*{3})(?=[^\s"',}\]]{8,})/i;
const PARTIAL_PRIVATE_KEY_BLOCK_RE = /-----BEGIN [A-Z0-9 ]*(?:PRIVATE KEY|OPENSSH PRIVATE KEY|RSA PRIVATE KEY|EC PRIVATE KEY|DSA PRIVATE KEY)-----/i;
function originalDetailsSizeFields(size) {
	return size.complete ? { originalDetailsBytes: size.bytes } : { originalDetailsBytesAtLeast: size.bytes };
}
function redactPersistedDetailString(value, maxChars = MAX_PERSISTED_DETAIL_STRING_CHARS, redactionConfig) {
	if (value.length <= maxChars) return redactToolPayloadTextWithConfig(value, redactionConfig);
	const redactedScan = redactToolPayloadTextWithConfig(`${value.slice(0, maxChars)}${PERSISTED_DETAIL_REDACTION_BOUNDARY}${value.slice(maxChars, maxChars + MAX_PERSISTED_DETAIL_REDACTION_LOOKAHEAD_CHARS)}`, redactionConfig);
	const boundaryIndex = redactedScan.indexOf(PERSISTED_DETAIL_REDACTION_BOUNDARY);
	const redactedPrefix = boundaryIndex >= 0 ? redactedScan.slice(0, boundaryIndex) : "[OpenClaw persisted detail redacted: boundary marker removed]";
	const safePrefixChars = Math.max(0, maxChars - Math.min(maxChars, MAX_PERSISTED_DETAIL_BOUNDARY_OVERLAP_CHARS));
	const initialPersistedPrefix = redactedPrefix.slice(0, safePrefixChars);
	const persistedPrefix = PARTIAL_STRUCTURED_SECRET_VALUE_RE.test(initialPersistedPrefix) || PARTIAL_PRIVATE_KEY_BLOCK_RE.test(initialPersistedPrefix) ? "[OpenClaw persisted detail redacted: partial secret span omitted]" : initialPersistedPrefix;
	return `${persistedPrefix}${persistedPrefix ? "\n" : ""}[OpenClaw persisted detail redacted: boundary overlap omitted]\n\n[OpenClaw persisted detail truncated: ${Math.max(0, value.length - maxChars)} original chars omitted]`;
}
function isSensitivePersistedDetailKey(key) {
	return Boolean(key && isSensitiveFieldKey(key));
}
function selectPersistedDetailRedactionKey(key, inheritedKey) {
	return isSensitivePersistedDetailKey(key) ? key : inheritedKey;
}
function redactedOriginalDetailKeys(src, redactionConfig) {
	return firstEnumerableOwnKeys(src, 40).map((key) => redactToolPayloadTextWithConfig(key, redactionConfig));
}
function redactPersistedDetailValue(value, depth = 0, redactionKey, redactionConfig) {
	if (typeof value === "string") return redactionKey ? redactSensitiveFieldValueWithConfig(redactionKey, value, redactionConfig) : redactToolPayloadTextWithConfig(value, redactionConfig);
	if (redactionKey && (typeof value === "number" || typeof value === "boolean" || typeof value === "bigint")) return redactSensitiveFieldValueWithConfig(redactionKey, String(value), redactionConfig);
	if (value === null || value === void 0 || typeof value !== "object") return value;
	if (depth >= 8) return "[OpenClaw persisted detail redacted: max depth exceeded]";
	if (Array.isArray(value)) {
		let changed = false;
		const next = value.map((item) => {
			const redacted = redactPersistedDetailValue(item, depth + 1, redactionKey, redactionConfig);
			changed ||= redacted !== item;
			return redacted;
		});
		return changed ? next : value;
	}
	const source = value;
	let changed = false;
	const next = {};
	for (const [key, field] of Object.entries(source)) {
		const redactedKey = redactToolPayloadTextWithConfig(key, redactionConfig);
		const redacted = redactPersistedDetailValue(field, depth + 1, selectPersistedDetailRedactionKey(key, redactionKey), redactionConfig);
		changed ||= redactedKey !== key || redacted !== field;
		next[redactedKey] = redacted;
	}
	return changed ? next : value;
}
function redactPersistedSummaryField(key, value, maxStringChars, redactionConfig) {
	if (typeof value === "string") return redactPersistedDetailString(value, maxStringChars, redactionConfig);
	return redactPersistedDetailValue(value, 0, selectPersistedDetailRedactionKey(key, void 0), redactionConfig);
}
function sanitizePersistedSessionDetail(value, redactionConfig) {
	if (!value || typeof value !== "object") return value;
	const src = value;
	const out = {};
	for (const key of [
		"sessionId",
		"status",
		"pid",
		"startedAt",
		"endedAt",
		"runtimeMs",
		"cwd",
		"name",
		"truncated",
		"exitCode",
		"exitSignal"
	]) {
		const field = src[key];
		if (field !== void 0) out[key] = redactPersistedSummaryField(key, field, 500, redactionConfig);
	}
	if (typeof src.command === "string") out.command = redactPersistedDetailString(src.command, 500, redactionConfig);
	return out;
}
function copyPersistedResultStateFields(out, src, maxStringChars, redactionConfig) {
	for (const key of [
		"disabled",
		"unavailable",
		"success"
	]) if (typeof src[key] === "boolean") out[key] = src[key];
	if (typeof src.error === "string" && src.error) out.error = redactPersistedDetailString(src.error, maxStringChars, redactionConfig);
	else if (src.error) out.error = true;
}
function buildPersistedDetailsFallback(src, originalSize, sanitizedBytes, redactionConfig) {
	const fallback = {
		persistedDetailsTruncated: true,
		finalDetailsTruncated: true,
		...originalDetailsSizeFields(originalSize)
	};
	if (sanitizedBytes !== void 0) fallback.sanitizedDetailsBytes = sanitizedBytes;
	if (src) {
		fallback.originalDetailKeys = redactedOriginalDetailKeys(src, redactionConfig);
		for (const key of [
			"status",
			"sessionId",
			"pid",
			"exitCode",
			"exitSignal",
			"truncated"
		]) {
			const field = src[key];
			if (field !== void 0) fallback[key] = redactPersistedSummaryField(key, field, MAX_PERSISTED_DETAIL_FALLBACK_STRING_CHARS, redactionConfig);
		}
		copyPersistedResultStateFields(fallback, src, MAX_PERSISTED_DETAIL_FALLBACK_STRING_CHARS, redactionConfig);
	}
	return fallback;
}
function enforcePersistedDetailsByteCap(value, src, originalSize, redactionConfig) {
	const sanitizedBytes = jsonUtf8BytesOrInfinity(value);
	if (sanitizedBytes <= MAX_PERSISTED_TOOL_RESULT_DETAILS_BYTES) return value;
	const fallback = buildPersistedDetailsFallback(src, originalSize, sanitizedBytes, redactionConfig);
	if (jsonUtf8BytesOrInfinity(fallback) <= MAX_PERSISTED_TOOL_RESULT_DETAILS_BYTES) return fallback;
	return {
		persistedDetailsTruncated: true,
		finalDetailsTruncated: true,
		...originalDetailsSizeFields(originalSize),
		sanitizedDetailsBytes: sanitizedBytes
	};
}
function enforceRedactedPersistedDetailsByteCap(redacted, originalDetails, originalSize, redactionConfig) {
	const redactedBytes = jsonUtf8BytesOrInfinity(redacted);
	if (redactedBytes <= MAX_PERSISTED_TOOL_RESULT_DETAILS_BYTES) return redacted;
	if (originalDetails && typeof originalDetails === "object" && !Array.isArray(originalDetails)) return buildPersistedDetailsFallback(originalDetails, originalSize, redactedBytes, redactionConfig);
	return {
		persistedDetailsTruncated: true,
		finalDetailsTruncated: true,
		...originalDetailsSizeFields(originalSize),
		sanitizedDetailsBytes: redactedBytes
	};
}
function sanitizeToolResultDetailsForPersistence(details, redactionConfig) {
	if (details === void 0 || details === null) return details;
	const originalSize = boundedJsonUtf8Bytes(details, MAX_PERSISTED_TOOL_RESULT_DETAILS_BYTES);
	if (originalSize.complete && originalSize.bytes <= MAX_PERSISTED_TOOL_RESULT_DETAILS_BYTES) return enforceRedactedPersistedDetailsByteCap(redactPersistedDetailValue(details, 0, void 0, redactionConfig), details, originalSize, redactionConfig);
	if (typeof details !== "object") return enforcePersistedDetailsByteCap({
		persistedDetailsTruncated: true,
		...originalDetailsSizeFields(originalSize),
		valueType: typeof details
	}, void 0, originalSize, redactionConfig);
	const src = details;
	const out = {
		persistedDetailsTruncated: true,
		...originalDetailsSizeFields(originalSize),
		originalDetailKeys: redactedOriginalDetailKeys(src, redactionConfig)
	};
	for (const key of [
		"status",
		"sessionId",
		"pid",
		"startedAt",
		"endedAt",
		"cwd",
		"name",
		"exitCode",
		"exitSignal",
		"retryInMs",
		"total",
		"totalLines",
		"totalChars",
		"truncated",
		"fullOutputPath",
		"truncation"
	]) {
		const field = src[key];
		if (field !== void 0) out[key] = redactPersistedSummaryField(key, field, MAX_PERSISTED_DETAIL_STRING_CHARS, redactionConfig);
	}
	copyPersistedResultStateFields(out, src, MAX_PERSISTED_DETAIL_STRING_CHARS, redactionConfig);
	if (typeof src.tail === "string") out.tail = redactPersistedDetailString(src.tail, MAX_PERSISTED_DETAIL_STRING_CHARS, redactionConfig);
	if (Array.isArray(src.sessions)) {
		out.sessions = src.sessions.slice(0, MAX_PERSISTED_DETAIL_SESSION_COUNT).map((session) => sanitizePersistedSessionDetail(session, redactionConfig));
		if (src.sessions.length > MAX_PERSISTED_DETAIL_SESSION_COUNT) out.sessionsTruncated = src.sessions.length - MAX_PERSISTED_DETAIL_SESSION_COUNT;
	}
	return enforcePersistedDetailsByteCap(out, src, originalSize, redactionConfig);
}
function capToolResultDetails(msg, redactionConfig) {
	if (msg.role !== "toolResult") return msg;
	const details = msg.details;
	const sanitizedDetails = sanitizeToolResultDetailsForPersistence(details, redactionConfig);
	if (sanitizedDetails === details) return msg;
	const next = { ...msg };
	next.details = sanitizedDetails;
	return next;
}
function capToolResultForPersistence(msg, maxChars, redactionConfig) {
	return capToolResultDetails(capToolResultSize(msg, maxChars), redactionConfig);
}
function normalizePersistedToolResultName(message, fallbackName) {
	if (message.role !== "toolResult") return message;
	const toolResult = message;
	const rawToolName = toolResult.toolName;
	const normalizedToolName = normalizeOptionalString(rawToolName);
	if (normalizedToolName) {
		if (rawToolName === normalizedToolName) return toolResult;
		return {
			...toolResult,
			toolName: normalizedToolName
		};
	}
	const normalizedFallback = normalizeOptionalString(fallbackName);
	if (normalizedFallback) return {
		...toolResult,
		toolName: normalizedFallback
	};
	if (typeof rawToolName === "string") return {
		...toolResult,
		toolName: "unknown"
	};
	return toolResult;
}
function isTranscriptOnlyOpenClawAssistantMessage(message) {
	if (!message || message.role !== "assistant") return false;
	return isTranscriptOnlyOpenClawAssistantModel(normalizeOptionalString(message.provider) ?? "", normalizeOptionalString(message.model) ?? "");
}
function installSessionToolResultGuard(sessionManager, opts) {
	const originalAppend = getRawSessionAppendMessage(sessionManager);
	setRawSessionAppendMessage(sessionManager, originalAppend);
	const pendingState = createPendingToolCallState();
	const persistMessage = (message) => {
		const transformer = opts?.transformMessageForPersistence;
		return transformer ? transformer(message) : message;
	};
	const persistToolResult = (message, meta) => {
		const transformer = opts?.transformToolResultForPersistence;
		return transformer ? transformer(message, meta) : message;
	};
	const allowSyntheticToolResults = opts?.allowSyntheticToolResults ?? true;
	const missingToolResultText = opts?.missingToolResultText;
	const beforeWrite = opts?.beforeMessageWriteHook;
	const toolResultTransformerMayMutate = opts?.transformToolResultForPersistence !== void 0;
	const redactionConfig = opts?.redactLoggingConfig;
	const maxToolResultChars = resolveMaxToolResultChars(opts);
	const transcriptSeqByEntryId = /* @__PURE__ */ new Map();
	let suppressNextUserMessagePersistence = opts?.suppressNextUserMessagePersistence === true;
	const getSessionFile = () => sessionManager.getSessionFile?.();
	const appendMessageAndCacheTranscriptSeq = (message, options) => {
		const parentEntryId = sessionManager.getLeafId();
		const entryId = originalAppend(message, options);
		opts?.onMessagePersisted?.(message);
		const sessionFile = getSessionFile();
		if (!sessionFile) return {
			entryId,
			sessionFile
		};
		return {
			entryId,
			sessionFile,
			messageSeq: resolveAppendedMessageSeq({
				sessionManager,
				entryId,
				parentEntryId,
				seqByEntryId: transcriptSeqByEntryId
			})
		};
	};
	const originalAppendCompaction = sessionManager.appendCompaction.bind(sessionManager);
	const guardedAppendCompaction = ((...args) => {
		const append = () => originalAppendCompaction(...args);
		return opts?.withCompactionPersistence ? opts.withCompactionPersistence(append, isExpectedCompactionAppend) : append();
	});
	/**
	* Run the before_message_write hook. Returns the (possibly modified) message,
	* or null if the message should be blocked.
	*/
	const applyBeforeWriteHook = (msg) => {
		if (!beforeWrite) return {
			message: msg,
			changed: false
		};
		const result = beforeWrite({ message: msg });
		if (result?.block) return null;
		if (result?.message) return {
			message: result.message,
			changed: true
		};
		return {
			message: msg,
			changed: false
		};
	};
	const flushPendingToolResults = () => {
		if (pendingState.size() === 0) return;
		if (allowSyntheticToolResults) for (const [id, name] of pendingState.entries()) {
			const synthetic = makeMissingToolResult({
				toolCallId: id,
				toolName: name,
				text: missingToolResultText
			});
			const persistedSynthetic = persistMessage(synthetic);
			const flushed = applyBeforeWriteHook(persistToolResult(persistedSynthetic, {
				toolCallId: id,
				toolName: name,
				isSynthetic: true
			}));
			if (flushed) appendMessageAndCacheTranscriptSeq(capToolResultForPersistence(flushed.message, maxToolResultChars, redactionConfig), { invalidateSerializedPrefixCache: persistedSynthetic !== synthetic || toolResultTransformerMayMutate || flushed.changed });
		}
		pendingState.clear();
	};
	const clearPendingToolResults = () => {
		pendingState.clear();
	};
	const guardedAppend = (message, callerOptions) => {
		const callerInvalidatesCache = callerOptions?.invalidateSerializedPrefixCache === true;
		let nextMessage = message;
		if (message.role === "assistant") {
			const sanitized = sanitizeToolCallInputs([message], { allowedToolNames: opts?.allowedToolNames });
			if (sanitized.length === 0) {
				if (pendingState.shouldFlushForSanitizedDrop()) flushPendingToolResults();
				return;
			}
			nextMessage = sanitized[0];
		}
		const nextRole = nextMessage.role;
		if (nextRole === "toolResult") {
			const id = extractToolResultId(nextMessage);
			const toolName = id ? pendingState.getToolName(id) : void 0;
			if (id) pendingState.delete(id);
			const normalizedToolResult = normalizePersistedToolResultName(nextMessage, toolName);
			const persistedToolResult = persistMessage(normalizedToolResult);
			const persisted = applyBeforeWriteHook(persistToolResult(capToolResultForPersistence(persistedToolResult, maxToolResultChars, redactionConfig), {
				toolCallId: id ?? void 0,
				toolName,
				isSynthetic: false
			}));
			if (!persisted) return;
			return appendMessageAndCacheTranscriptSeq(capToolResultForPersistence(persisted.message, maxToolResultChars, redactionConfig), { invalidateSerializedPrefixCache: callerInvalidatesCache || persistedToolResult !== normalizedToolResult || toolResultTransformerMayMutate || persisted.changed }).entryId;
		}
		const stopReason = nextMessage.stopReason;
		const toolCalls = nextRole === "assistant" && stopReason !== "aborted" && stopReason !== "error" ? extractToolCallsFromAssistant(nextMessage) : [];
		if (!(nextRole === "assistant" && toolCalls.length === 0 && isTranscriptOnlyOpenClawAssistantMessage(nextMessage)) && pendingState.shouldFlushBeforeNonToolResult(nextRole, toolCalls.length)) flushPendingToolResults();
		if (!allowSyntheticToolResults && pendingState.shouldFlushBeforeNewToolCalls(toolCalls.length)) flushPendingToolResults();
		const transformedMessage = persistMessage(nextMessage);
		const finalWrite = applyBeforeWriteHook(transformedMessage);
		if (!finalWrite) return;
		const finalMessage = finalWrite.message;
		const finalRole = finalMessage.role;
		if (finalRole === "assistant" && toolCalls.length === 0 && opts?.suppressTranscriptOnlyAssistantPersistence === true) return;
		if (finalRole === "assistant" && opts?.suppressAssistantErrorPersistence === true && finalMessage.stopReason === "error") return;
		if (isUserAgentMessage(finalMessage) && suppressNextUserMessagePersistence) {
			suppressNextUserMessagePersistence = false;
			return;
		}
		const { entryId: result, messageSeq, sessionFile } = appendMessageAndCacheTranscriptSeq(finalMessage, { invalidateSerializedPrefixCache: callerInvalidatesCache || transformedMessage !== nextMessage || finalWrite.changed });
		if (sessionFile) emitSessionTranscriptUpdate({
			sessionFile,
			sessionKey: opts?.sessionKey,
			...opts?.agentId ? { agentId: opts.agentId } : {},
			message: finalMessage,
			messageId: typeof result === "string" ? result : void 0,
			...messageSeq !== void 0 ? { messageSeq } : {}
		});
		if (toolCalls.length > 0) pendingState.trackToolCalls(toolCalls);
		if (isUserAgentMessage(finalMessage)) opts?.onUserMessagePersisted?.(finalMessage);
		if (finalRole === "assistant" && finalMessage.stopReason === "error") opts?.onAssistantErrorMessagePersisted?.(finalMessage);
		return result;
	};
	sessionManager.appendMessage = guardedAppend;
	sessionManager.appendCompaction = guardedAppendCompaction;
	return {
		flushPendingToolResults,
		clearPendingToolResults,
		getPendingIds: pendingState.getPendingIds
	};
}
//#endregion
//#region src/agents/session-tool-result-guard-wrapper.ts
/**
* Apply the tool-result guard to a SessionManager exactly once and expose
* a flush method on the instance for easy teardown handling.
*/
function guardSessionManager(sessionManager, opts) {
	if (typeof sessionManager.flushPendingToolResults === "function") return sessionManager;
	const hookRunner = getGlobalHookRunner();
	let pendingPreparedUserTurnMessage = opts?.preparedUserTurnMessage;
	const beforeMessageWrite = (event) => {
		let message = event.message;
		let changed = false;
		if (hookRunner?.hasHooks("before_message_write")) {
			const result = hookRunner.runBeforeMessageWrite(event, {
				agentId: opts?.agentId,
				sessionKey: opts?.sessionKey
			});
			if (result?.block) return result;
			if (result?.message) {
				message = result.message;
				changed = true;
			}
		}
		const redacted = redactTranscriptMessage(message, opts?.config);
		if (redacted !== message) {
			message = redacted;
			changed = true;
		}
		return changed ? { message } : void 0;
	};
	const transform = hookRunner?.hasHooks("tool_result_persist") ? (message, meta) => {
		return hookRunner.runToolResultPersist({
			toolName: meta.toolName,
			toolCallId: meta.toolCallId,
			message,
			isSynthetic: meta.isSynthetic
		}, {
			agentId: opts?.agentId,
			sessionKey: opts?.sessionKey,
			toolName: meta.toolName,
			toolCallId: meta.toolCallId
		})?.message ?? message;
	} : void 0;
	const guard = installSessionToolResultGuard(sessionManager, {
		sessionKey: opts?.sessionKey,
		agentId: opts?.agentId,
		transformMessageForPersistence: (message) => {
			const withProvenance = applyInputProvenanceToUserMessage(message, opts?.inputProvenance);
			const prepared = pendingPreparedUserTurnMessage;
			const merged = mergePreparedUserTurnMessageForRuntime({
				runtimeMessage: withProvenance,
				...prepared ? { preparedMessage: prepared } : {}
			});
			if (merged !== withProvenance) pendingPreparedUserTurnMessage = void 0;
			return merged;
		},
		transformToolResultForPersistence: transform,
		allowSyntheticToolResults: opts?.allowSyntheticToolResults,
		missingToolResultText: opts?.missingToolResultText,
		allowedToolNames: opts?.allowedToolNames,
		beforeMessageWriteHook: beforeMessageWrite,
		redactLoggingConfig: opts?.config?.logging,
		maxToolResultChars: typeof opts?.contextWindowTokens === "number" ? resolveLiveToolResultMaxChars({
			contextWindowTokens: opts.contextWindowTokens,
			cfg: opts.config,
			agentId: opts.agentId
		}) : void 0,
		suppressNextUserMessagePersistence: opts?.suppressNextUserMessagePersistence,
		suppressTranscriptOnlyAssistantPersistence: opts?.suppressTranscriptOnlyAssistantPersistence,
		suppressAssistantErrorPersistence: opts?.suppressAssistantErrorPersistence,
		onMessagePersisted: opts?.onMessagePersisted,
		withCompactionPersistence: opts?.withCompactionPersistence,
		onUserMessagePersisted: opts?.onUserMessagePersisted,
		onAssistantErrorMessagePersisted: opts?.onAssistantErrorMessagePersisted
	});
	sessionManager.flushPendingToolResults = guard.flushPendingToolResults;
	sessionManager.clearPendingToolResults = guard.clearPendingToolResults;
	return sessionManager;
}
//#endregion
//#region src/agents/tool-schema-quarantine.ts
/**
* Runtime tool-schema quarantine logging.
*
* Model providers can reject unsupported schema shapes, so runtime projection
* reports quarantined tools with trusted diagnostics before the model call.
*/
const log$1 = createSubsystemLogger("agents/tools");
function readDiagnosticPluginId(params) {
	try {
		const tool = params.tools[params.diagnostic.toolIndex];
		return tool ? getPluginToolMeta(tool)?.pluginId : void 0;
	} catch {
		return;
	}
}
function pluginOwner(pluginId) {
	return pluginId ? `plugin:${pluginId}` : void 0;
}
function toolQuarantineKey(params) {
	return JSON.stringify([params.owner ?? "", params.toolName]);
}
function readToolIdentity(tool) {
	try {
		if (typeof tool.name !== "string" || tool.name.length === 0) return;
		const owner = pluginOwner(getPluginToolMeta(tool)?.pluginId);
		return owner ? {
			owner,
			toolName: tool.name
		} : { toolName: tool.name };
	} catch {
		return;
	}
}
function listHealthyToolIdentities(params) {
	const failingKeys = new Set(params.diagnostics.map((diagnostic) => toolQuarantineKey({
		owner: pluginOwner(readDiagnosticPluginId({
			tools: params.tools,
			diagnostic
		})),
		toolName: diagnostic.toolName
	})));
	const healthy = [];
	for (const tool of params.tools) {
		const identity = readToolIdentity(tool);
		if (identity && !failingKeys.has(toolQuarantineKey(identity))) healthy.push(identity);
	}
	return healthy;
}
/** Emits diagnostics and logs for tools removed from runtime schema projection. */
function logRuntimeToolSchemaQuarantine(params) {
	clearRecoveredPersistedRuntimeToolSchemaQuarantines(() => listHealthyToolIdentities({
		diagnostics: params.diagnostics,
		tools: params.tools
	}));
	if (params.diagnostics.length === 0) return;
	const summary = params.diagnostics.map((diagnostic) => {
		const pluginId = readDiagnosticPluginId({
			tools: params.tools,
			diagnostic
		});
		const owner = pluginId ? ` plugin=${pluginId}` : "";
		emitTrustedDiagnosticEvent({
			type: "tool.execution.blocked",
			runId: params.runId,
			...params.sessionKey ? { sessionKey: params.sessionKey } : {},
			...params.sessionId ? { sessionId: params.sessionId } : {},
			toolName: diagnostic.toolName,
			toolSource: pluginId ? "plugin" : "core",
			...pluginId ? { toolOwner: pluginId } : {},
			deniedReason: "unsupported_tool_schema",
			reason: diagnostic.violations.join(", ")
		});
		try {
			const persistedOwner = pluginOwner(pluginId);
			recordPersistedRuntimeToolSchemaQuarantine({
				toolName: diagnostic.toolName,
				...persistedOwner ? { owner: persistedOwner } : {},
				reason: diagnostic.violations.join(", "),
				failedAt: /* @__PURE__ */ new Date()
			});
		} catch {}
		return `${diagnostic.toolName}${owner}: ${diagnostic.violations.join(", ")}`;
	}).join("; ");
	log$1.warn(`[tools] quarantined ${params.diagnostics.length} unsupported tool schema${params.diagnostics.length === 1 ? "" : "s"} before model runtime projection: ${summary}. Run openclaw doctor for details.`);
}
//#endregion
//#region src/agents/embedded-agent-runner/cache-ttl.ts
/**
* Resolves cache-TTL eligibility and session markers for prompt-cache retention.
*/
const CACHE_TTL_CUSTOM_TYPE = "openclaw.cache-ttl";
/** Returns whether this provider/model pair supports cache-TTL session markers. */
function isCacheTtlEligibleProvider(provider, modelId, modelApi) {
	const normalizedProvider = normalizeLowercaseStringOrEmpty(provider);
	const normalizedModelId = normalizeLowercaseStringOrEmpty(modelId);
	const pluginEligibility = resolveProviderCacheTtlEligibility({
		provider: normalizedProvider,
		context: {
			provider: normalizedProvider,
			modelId: normalizedModelId,
			modelApi
		}
	});
	if (pluginEligibility !== void 0) return pluginEligibility;
	return isAnthropicFamilyCacheTtlEligible({
		provider: normalizedProvider,
		modelId: normalizedModelId,
		modelApi
	}) || normalizedProvider === "kilocode" && isAnthropicModelRef(normalizedModelId) || isGooglePromptCacheEligible({
		modelApi,
		modelId: normalizedModelId
	});
}
function normalizeCacheTtlKey(value) {
	return normalizeOptionalLowercaseString(value);
}
function matchesCacheTtlContext(data, context) {
	if (!context) return true;
	const expectedProvider = normalizeCacheTtlKey(context.provider);
	if (expectedProvider && normalizeCacheTtlKey(data?.provider) !== expectedProvider) return false;
	const expectedModelId = normalizeCacheTtlKey(context.modelId);
	if (expectedModelId && normalizeCacheTtlKey(data?.modelId) !== expectedModelId) return false;
	return true;
}
/** Reads the most recent cache-TTL marker that matches the optional provider/model context. */
function readLastCacheTtlTimestamp(sessionManager, context) {
	const sm = sessionManager;
	if (!sm?.getEntries) return null;
	try {
		const entries = sm.getEntries();
		let last = null;
		for (let i = entries.length - 1; i >= 0; i--) {
			const entry = entries[i];
			if (entry?.type !== "custom" || entry?.customType !== CACHE_TTL_CUSTOM_TYPE) continue;
			const data = entry?.data;
			if (!matchesCacheTtlContext(data, context)) continue;
			const ts = typeof data?.timestamp === "number" ? data.timestamp : null;
			if (ts && Number.isFinite(ts)) {
				last = ts;
				break;
			}
		}
		return last;
	} catch {
		return null;
	}
}
//#endregion
//#region src/agents/embedded-agent-runner/compaction-duplicate-user-messages.ts
/**
* Removes short-window duplicate user turns from compaction summaries.
*/
const DEFAULT_DUPLICATE_USER_MESSAGE_WINDOW_MS = 6e4;
const MIN_DUPLICATE_USER_MESSAGE_CHARS = 24;
function normalizeUserMessageContent(content) {
	if (typeof content === "string") return content.replace(/\s+/g, " ").trim();
	if (!Array.isArray(content)) return;
	const textParts = [];
	for (const block of content) {
		if (!isRecord(block)) return;
		if (block.type === "image") return;
		if (block.type === "text" && typeof block.text === "string") textParts.push(block.text);
	}
	return textParts.join("\n").replace(/\s+/g, " ").trim();
}
function duplicateSignature(message) {
	if (!isRecord(message) || message.role !== "user" || typeof message.timestamp !== "number") return;
	const text = normalizeUserMessageContent(message.content);
	if (!text || text.length < MIN_DUPLICATE_USER_MESSAGE_CHARS) return;
	return {
		key: text.normalize("NFC").toLowerCase(),
		timestamp: message.timestamp
	};
}
/** Drop later duplicate user messages while preserving the first prompt. */
function dedupeDuplicateUserMessagesForCompaction(messages, options = {}) {
	const windowMs = options.windowMs ?? DEFAULT_DUPLICATE_USER_MESSAGE_WINDOW_MS;
	const lastSeenAtByKey = /* @__PURE__ */ new Map();
	let removed = 0;
	const result = [];
	for (const message of messages) {
		const signature = duplicateSignature(message);
		if (!signature) {
			result.push(message);
			continue;
		}
		const lastSeenAt = lastSeenAtByKey.get(signature.key);
		lastSeenAtByKey.set(signature.key, signature.timestamp);
		if (typeof lastSeenAt === "number" && signature.timestamp - lastSeenAt <= windowMs) {
			removed += 1;
			continue;
		}
		result.push(message);
	}
	return removed > 0 ? result : [...messages];
}
/** Collects session entry ids that should be skipped when building a compaction branch summary. */
function collectDuplicateUserMessageEntryIdsForCompaction(entries, options = {}) {
	const windowMs = options.windowMs ?? DEFAULT_DUPLICATE_USER_MESSAGE_WINDOW_MS;
	const lastSeenAtByKey = /* @__PURE__ */ new Map();
	const duplicateIds = /* @__PURE__ */ new Set();
	for (const entry of entries) {
		if (entry.type !== "message" || typeof entry.id !== "string") continue;
		const signature = duplicateSignature(isRecord(entry.message) ? entry.message : void 0);
		if (!signature) continue;
		const lastSeenAt = lastSeenAtByKey.get(signature.key);
		lastSeenAtByKey.set(signature.key, signature.timestamp);
		if (typeof lastSeenAt === "number" && signature.timestamp - lastSeenAt <= windowMs) duplicateIds.add(entry.id);
	}
	return duplicateIds;
}
//#endregion
//#region src/agents/embedded-agent-runner/compaction-successor-transcript.ts
/**
* Rotates compacted sessions into successor transcript files when configured.
*/
function shouldRotateCompactionTranscript(config) {
	return config?.agents?.defaults?.compaction?.truncateAfterCompaction === true;
}
async function rotateTranscriptAfterCompaction(params) {
	const sessionFile = params.sessionFile.trim();
	if (!sessionFile) return {
		rotated: false,
		reason: "missing session file"
	};
	const branch = params.sessionManager.getBranch();
	const latestCompactionIndex = findLatestCompactionIndex(branch);
	if (latestCompactionIndex < 0) return {
		rotated: false,
		reason: "no compaction entry"
	};
	const compaction = branch[latestCompactionIndex];
	const timestamp = resolveTimestampMsToIsoString(params.now?.().getTime());
	const sessionId = randomUUID();
	const successorFile = resolveSuccessorSessionFile({
		sessionFile,
		sessionId,
		timestamp
	});
	const successorEntries = buildSuccessorEntries({
		allEntries: params.sessionManager.getEntries(),
		branch,
		latestCompactionIndex
	});
	if (successorEntries.length === 0) return {
		rotated: false,
		reason: "empty successor transcript"
	};
	const header = buildSuccessorHeader({
		previousHeader: params.sessionManager.getHeader(),
		sessionId,
		timestamp,
		cwd: params.sessionManager.getCwd(),
		parentSession: sessionFile
	});
	await writeTranscriptFileAtomic(successorFile, [header, ...successorEntries]);
	new TranscriptFileState({
		header,
		entries: successorEntries
	}).buildSessionContext();
	return {
		rotated: true,
		sessionId,
		sessionFile: successorFile,
		compactionEntryId: compaction.id,
		leafId: successorEntries[successorEntries.length - 1]?.id,
		entriesWritten: successorEntries.length
	};
}
async function rotateTranscriptFileAfterCompaction(params) {
	return rotateTranscriptAfterCompaction({
		sessionManager: await readTranscriptFileState(params.sessionFile),
		sessionFile: params.sessionFile,
		...params.now ? { now: params.now } : {}
	});
}
function findLatestCompactionIndex(entries) {
	for (let index = entries.length - 1; index >= 0; index -= 1) if (entries[index]?.type === "compaction") return index;
	return -1;
}
function buildSuccessorEntries(params) {
	const { allEntries, branch, latestCompactionIndex } = params;
	const compaction = branch[latestCompactionIndex];
	const summarizedBranchIds = /* @__PURE__ */ new Set();
	const preCompactionKeptBranchIds = /* @__PURE__ */ new Set();
	let foundFirstKept = false;
	for (let index = 0; index < latestCompactionIndex; index += 1) {
		const entry = branch[index];
		if (!entry) continue;
		if (compaction.firstKeptEntryId && entry.id === compaction.firstKeptEntryId) foundFirstKept = true;
		if (foundFirstKept) preCompactionKeptBranchIds.add(entry.id);
		else summarizedBranchIds.add(entry.id);
	}
	const isHardenedBoundary = compaction.firstKeptEntryId === compaction.id;
	let preservedAssistantId;
	let preservedAssistantIndex = -1;
	let firstKeptIndex = -1;
	if (!isHardenedBoundary) for (let index = latestCompactionIndex - 1; index >= 0; index -= 1) {
		const entry = branch[index];
		if (entry && summarizedBranchIds.has(entry.id) && entry.type === "message" && entry.message.role === "assistant") {
			preservedAssistantId = entry.id;
			preservedAssistantIndex = index;
			break;
		}
	}
	if (compaction.firstKeptEntryId) firstKeptIndex = branch.findIndex((entry) => entry.id === compaction.firstKeptEntryId);
	const branchIndexById = new Map(branch.map((entry, index) => [entry.id, index]));
	const preservedPreCompactionIds = /* @__PURE__ */ new Set();
	if (preservedAssistantId) {
		preservedPreCompactionIds.add(preservedAssistantId);
		const assistant = branch[preservedAssistantIndex];
		if (assistant?.type === "message" && assistant.message.role === "assistant") {
			const toolCallIds = new Set(assistant.message.content.filter((block) => block.type === "toolCall").map((block) => block.id));
			for (let index = preservedAssistantIndex + 1; index >= 0 && index < firstKeptIndex; index += 1) {
				const entry = branch[index];
				if (entry?.type === "message" && entry.message.role === "toolResult") {
					if (toolCallIds.has(entry.message.toolCallId)) preservedPreCompactionIds.add(entry.id);
				}
			}
		}
	}
	const latestStateEntryIds = collectLatestStateEntryIds(branch.slice(0, latestCompactionIndex));
	const staleStateEntryIds = /* @__PURE__ */ new Set();
	for (const entry of branch.slice(0, latestCompactionIndex)) if (isDedupedStateEntry(entry) && !latestStateEntryIds.has(entry.id)) staleStateEntryIds.add(entry.id);
	const removedIds = /* @__PURE__ */ new Set();
	const keptPreCompactionEntries = branch.slice(0, latestCompactionIndex).filter((entry) => !summarizedBranchIds.has(entry.id));
	const postCompactionEntries = branch.slice(latestCompactionIndex + 1);
	const duplicateUserMessageIds = new Set([...collectDuplicateUserMessageEntryIdsForCompaction(keptPreCompactionEntries), ...collectDuplicateUserMessageEntryIdsForCompaction(postCompactionEntries)]);
	for (const entry of allEntries) {
		const branchIndex = branchIndexById.get(entry.id) ?? -1;
		const summarizedContextMarker = branchIndex > preservedAssistantIndex && branchIndex < firstKeptIndex && (entry.type === "custom_message" || entry.type === "branch_summary");
		if (summarizedBranchIds.has(entry.id) && entry.type === "message" && !preservedPreCompactionIds.has(entry.id) || summarizedBranchIds.has(entry.id) && summarizedContextMarker || staleStateEntryIds.has(entry.id) || duplicateUserMessageIds.has(entry.id)) removedIds.add(entry.id);
	}
	for (const entryId of preservedPreCompactionIds) preCompactionKeptBranchIds.add(entryId);
	for (const entry of allEntries) if (entry.type === "label" && removedIds.has(entry.targetId)) removedIds.add(entry.id);
	const entryById = /* @__PURE__ */ new Map();
	const originalIndexById = /* @__PURE__ */ new Map();
	for (let index = 0; index < allEntries.length; index += 1) {
		const entry = allEntries[index];
		entryById.set(entry.id, entry);
		originalIndexById.set(entry.id, index);
	}
	const activeBranchIds = /* @__PURE__ */ new Set();
	for (const entry of branch) activeBranchIds.add(entry.id);
	const keptEntries = [];
	for (const entry of allEntries) {
		if (removedIds.has(entry.id)) continue;
		let parentId = entry.parentId;
		while (parentId !== null && removedIds.has(parentId)) parentId = entryById.get(parentId)?.parentId ?? null;
		const reparented = parentId === entry.parentId ? entry : {
			...entry,
			parentId
		};
		let transformed = reparented;
		if (reparented.type === "message" && preCompactionKeptBranchIds.has(reparented.id)) transformed = {
			...reparented,
			message: stripThinkingSignaturesFromMessage(reparented.message)
		};
		if (reparented.type === "compaction" && reparented.id === compaction.id && preservedAssistantId && reparented.firstKeptEntryId !== reparented.id) transformed = {
			...reparented,
			firstKeptEntryId: preservedAssistantId
		};
		keptEntries.push(transformed);
	}
	return orderSuccessorEntries({
		entries: keptEntries,
		activeBranchIds,
		originalIndexById
	});
}
function collectLatestStateEntryIds(entries) {
	const latestByType = /* @__PURE__ */ new Map();
	for (const entry of entries) if (isDedupedStateEntry(entry)) latestByType.set(entry.type, entry);
	const ids = /* @__PURE__ */ new Set();
	for (const entry of latestByType.values()) ids.add(entry.id);
	return ids;
}
function isDedupedStateEntry(entry) {
	return entry.type === "model_change" || entry.type === "thinking_level_change" || entry.type === "session_info";
}
function orderSuccessorEntries(params) {
	const { entries, activeBranchIds, originalIndexById } = params;
	const entryIds = /* @__PURE__ */ new Set();
	for (const entry of entries) entryIds.add(entry.id);
	const childrenByParentId = /* @__PURE__ */ new Map();
	for (const entry of entries) {
		const parentId = entry.parentId !== null && entryIds.has(entry.parentId) ? entry.parentId : null;
		const children = childrenByParentId.get(parentId) ?? [];
		children.push(parentId === entry.parentId ? entry : {
			...entry,
			parentId
		});
		childrenByParentId.set(parentId, children);
	}
	const sortForActiveLeaf = (left, right) => {
		const leftActive = activeBranchIds.has(left.id);
		if (leftActive !== activeBranchIds.has(right.id)) return leftActive ? 1 : -1;
		return (originalIndexById.get(left.id) ?? 0) - (originalIndexById.get(right.id) ?? 0);
	};
	const ordered = [];
	const emittedIds = /* @__PURE__ */ new Set();
	const emitSubtree = (entry) => {
		if (emittedIds.has(entry.id)) return;
		emittedIds.add(entry.id);
		ordered.push(entry);
		for (const child of (childrenByParentId.get(entry.id) ?? []).toSorted(sortForActiveLeaf)) emitSubtree(child);
	};
	for (const root of (childrenByParentId.get(null) ?? []).toSorted(sortForActiveLeaf)) emitSubtree(root);
	for (const entry of entries.toSorted(sortForActiveLeaf)) emitSubtree(entry);
	return ordered;
}
function buildSuccessorHeader(params) {
	return {
		type: "session",
		version: 3,
		id: params.sessionId,
		timestamp: params.timestamp,
		cwd: params.previousHeader?.cwd || params.cwd,
		parentSession: params.parentSession
	};
}
function resolveSuccessorSessionFile(params) {
	const fileTimestamp = params.timestamp.replace(/[:.]/g, "-");
	return path.join(path.dirname(params.sessionFile), `${fileTimestamp}_${params.sessionId}.jsonl`);
}
//#endregion
//#region src/agents/agent-hooks/compaction-safeguard-runtime.ts
const registry$1 = createSessionManagerRuntimeRegistry();
const setCompactionSafeguardRuntime = registry$1.set;
const getCompactionSafeguardRuntime = registry$1.get;
/** Stores a human-readable compaction cancel reason on the session runtime state. */
function setCompactionSafeguardCancelReason(sessionManager, reason) {
	const current = getCompactionSafeguardRuntime(sessionManager);
	const trimmed = reason?.trim();
	if (!current) {
		if (!trimmed) return;
		setCompactionSafeguardRuntime(sessionManager, { cancelReason: trimmed });
		return;
	}
	const next = { ...current };
	if (trimmed) next.cancelReason = trimmed;
	else delete next.cancelReason;
	setCompactionSafeguardRuntime(sessionManager, next);
}
/** Reads and clears the pending compaction cancel reason for one session manager. */
function consumeCompactionSafeguardCancelReason(sessionManager) {
	const current = getCompactionSafeguardRuntime(sessionManager);
	const reason = current?.cancelReason?.trim();
	if (!reason) return null;
	const next = { ...current };
	delete next.cancelReason;
	setCompactionSafeguardRuntime(sessionManager, Object.keys(next).length > 0 ? next : null);
	return reason;
}
//#endregion
//#region src/agents/compaction-real-conversation.ts
/**
* Classifies transcript messages that contain real user-visible conversation
* for compaction and history pruning.
*/
const TOOL_RESULT_REAL_CONVERSATION_LOOKBACK = 20;
const NON_CONVERSATION_BLOCK_TYPES = new Set([
	"toolCall",
	"toolUse",
	"functionCall",
	"thinking",
	"reasoning"
]);
function hasMeaningfulText(text) {
	const trimmed = text.trim();
	if (!trimmed) return false;
	if (isSilentReplyText(trimmed)) return false;
	const heartbeat = stripHeartbeatToken(trimmed, { mode: "message" });
	if (heartbeat.didStrip) return heartbeat.text.trim().length > 0;
	return true;
}
/** Returns whether a message has content worth preserving as conversation. */
function hasMeaningfulConversationContent(message) {
	if (message.role === "custom") {
		const custom = message;
		return custom.display !== false && hasMeaningfulMessageContent(custom.content);
	}
	if (message.role === "bashExecution") {
		const bash = message;
		if (bash.excludeFromContext === true) return false;
		return hasMeaningfulText(`${typeof bash.command === "string" ? bash.command : ""}\n${typeof bash.output === "string" ? bash.output : ""}`);
	}
	if (message.role === "branchSummary") {
		const summary = message.summary;
		return typeof summary === "string" && hasMeaningfulText(summary);
	}
	const content = message.content;
	return hasMeaningfulMessageContent(content);
}
function hasMeaningfulMessageContent(content) {
	if (typeof content === "string") return hasMeaningfulText(content);
	if (!Array.isArray(content)) return false;
	let sawMeaningfulNonTextBlock = false;
	for (const block of content) {
		if (!block || typeof block !== "object") continue;
		const type = block.type;
		if (type !== "text") {
			if (typeof type === "string" && NON_CONVERSATION_BLOCK_TYPES.has(type)) continue;
			sawMeaningfulNonTextBlock = true;
			continue;
		}
		const text = block.text;
		if (typeof text !== "string") continue;
		if (hasMeaningfulText(text)) return true;
	}
	return sawMeaningfulNonTextBlock;
}
function isToolResultConversationAnchor(message) {
	const role = message.role;
	return (role === "user" || role === "custom" || role === "bashExecution" || role === "branchSummary") && hasMeaningfulConversationContent(message);
}
/** Returns whether a transcript message should count as real conversation. */
function isRealConversationMessage(message, messages, index) {
	if (message.role === "user" || message.role === "assistant" || message.role === "custom" || message.role === "bashExecution" || message.role === "branchSummary") return hasMeaningfulConversationContent(message);
	if (message.role !== "toolResult") return false;
	const start = Math.max(0, index - TOOL_RESULT_REAL_CONVERSATION_LOOKBACK);
	for (let i = index - 1; i >= start; i -= 1) {
		const candidate = messages[i];
		if (!candidate) continue;
		if (isToolResultConversationAnchor(candidate)) return true;
	}
	return false;
}
/**
* Upper bound on custom instruction length to prevent prompt bloat.
* ~800 chars ≈ ~200 tokens — keeps summarization quality stable.
*/
const MAX_INSTRUCTION_LENGTH = 800;
function truncateUnicodeSafe(s, maxCodePoints) {
	const chars = Array.from(s);
	if (chars.length <= maxCodePoints) return s;
	return chars.slice(0, maxCodePoints).join("");
}
function normalize$1(s) {
	if (s == null) return;
	const trimmed = s.trim();
	return trimmed.length > 0 ? trimmed : void 0;
}
/**
* Resolve compaction instructions with precedence:
*   event (SDK) → runtime (config) → DEFAULT constant.
*
* Each input is normalized first (trim + empty→undefined) so that blank
* strings don't short-circuit the fallback chain.
*/
function resolveCompactionInstructions(eventInstructions, runtimeInstructions) {
	return truncateUnicodeSafe(normalize$1(eventInstructions) ?? normalize$1(runtimeInstructions) ?? "Write the summary body in the primary language used in the conversation.\nFocus on factual content: what was discussed, decisions made, and current state.\nKeep the required summary structure and section headers unchanged.\nDo not translate or alter code, file paths, identifiers, or error messages.", MAX_INSTRUCTION_LENGTH);
}
/**
* Compose split-turn instructions by combining the SDK's turn-prefix
* instructions with the resolved compaction instructions.
*/
function composeSplitTurnInstructions(turnPrefixInstructions, resolvedInstructions) {
	return [
		turnPrefixInstructions,
		"Additional requirements:",
		resolvedInstructions
	].join("\n\n");
}
//#endregion
//#region src/agents/agent-hooks/compaction-safeguard-quality.ts
/** Quality contract, fallback, and audit helpers for compaction safeguard summaries. */
const MAX_EXTRACTED_IDENTIFIERS = 12;
const MAX_UNTRUSTED_INSTRUCTION_CHARS = 4e3;
const MAX_ASK_OVERLAP_TOKENS = 12;
const MIN_ASK_OVERLAP_TOKENS_FOR_DOUBLE_MATCH = 3;
const REQUIRED_SUMMARY_SECTIONS = [
	"## Decisions",
	"## Open TODOs",
	"## Constraints/Rules",
	"## Pending user asks",
	"## Exact identifiers"
];
const STRICT_EXACT_IDENTIFIERS_INSTRUCTION = "For ## Exact identifiers, preserve literal values exactly as seen (IDs, URLs, file paths, ports, hashes, dates, times).";
const POLICY_OFF_EXACT_IDENTIFIERS_INSTRUCTION = "For ## Exact identifiers, include identifiers only when needed for continuity; do not enforce literal-preservation rules.";
/** Wraps operator-provided compaction instruction text as untrusted prompt data. */
function wrapUntrustedInstructionBlock(label, text) {
	return wrapUntrustedPromptDataBlock({
		label,
		text,
		maxChars: MAX_UNTRUSTED_INSTRUCTION_CHARS
	});
}
function resolveExactIdentifierSectionInstruction(summarizationInstructions) {
	const policy = summarizationInstructions?.identifierPolicy ?? "strict";
	if (policy === "off") return POLICY_OFF_EXACT_IDENTIFIERS_INSTRUCTION;
	if (policy === "custom") {
		const custom = summarizationInstructions?.identifierInstructions?.trim();
		if (custom) {
			const customBlock = wrapUntrustedInstructionBlock("For ## Exact identifiers, apply this operator-defined policy text", custom);
			if (customBlock) return customBlock;
		}
	}
	return STRICT_EXACT_IDENTIFIERS_INSTRUCTION;
}
/** Build the required structured summary instructions for compaction. */
function buildCompactionStructureInstructions(customInstructions, summarizationInstructions) {
	const identifierSectionInstruction = resolveExactIdentifierSectionInstruction(summarizationInstructions);
	const sectionsTemplate = [
		"Produce a compact, factual summary with these exact section headings:",
		...REQUIRED_SUMMARY_SECTIONS,
		identifierSectionInstruction,
		"Do not omit unresolved asks from the user.",
		"When prior compaction summaries are present, re-distill them with new messages and remove stale duplicate detail."
	].join("\n");
	const custom = customInstructions?.trim();
	if (!custom) return sectionsTemplate;
	const customBlock = wrapUntrustedInstructionBlock("Additional context from /compact", custom);
	if (!customBlock) return sectionsTemplate;
	return `${sectionsTemplate}\n\n${customBlock}`;
}
function normalizedSummaryLines(summary) {
	return summary.split(/\r?\n/u).map((line) => line.trim()).filter((line) => line.length > 0);
}
function hasRequiredSummarySections(summary) {
	const lines = normalizedSummaryLines(summary);
	let cursor = 0;
	for (const heading of REQUIRED_SUMMARY_SECTIONS) {
		const index = lines.findIndex((line, lineIndex) => lineIndex >= cursor && line === heading);
		if (index < 0) return false;
		cursor = index + 1;
	}
	return true;
}
/** Return a structured fallback summary when model output is missing/invalid. */
function buildStructuredFallbackSummary(previousSummary, _summarizationInstructions) {
	const trimmedPreviousSummary = previousSummary?.trim() ?? "";
	if (trimmedPreviousSummary && hasRequiredSummarySections(trimmedPreviousSummary)) return trimmedPreviousSummary;
	return [
		"## Decisions",
		trimmedPreviousSummary || "No prior history.",
		"",
		"## Open TODOs",
		"None.",
		"",
		"## Constraints/Rules",
		"None.",
		"",
		"## Pending user asks",
		"None.",
		"",
		"## Exact identifiers",
		"None captured."
	].join("\n");
}
/** Append an already-formatted summary section without disturbing empty summaries. */
/** Appends a bounded post-compaction section to an existing summary. */
function appendSummarySection(summary, section) {
	if (!section) return summary;
	if (!summary.trim()) return section.trimStart();
	return `${summary}${section}`;
}
function sanitizeExtractedIdentifier(value) {
	return value.trim().replace(/^[("'`[{<]+/, "").replace(/[)\]"'`,;:.!?<>]+$/, "");
}
function isPureHexIdentifier(value) {
	return /^[A-Fa-f0-9]{8,}$/.test(value);
}
function normalizeOpaqueIdentifier(value) {
	return isPureHexIdentifier(value) ? value.toUpperCase() : value;
}
function summaryIncludesIdentifier(summary, identifier) {
	if (isPureHexIdentifier(identifier)) return summary.toUpperCase().includes(identifier.toUpperCase());
	return summary.includes(identifier);
}
/** Extracts likely exact identifiers that summaries should preserve literally. */
function extractOpaqueIdentifiers(text) {
	const matches = text.match(/([A-Fa-f0-9]{8,}|https?:\/\/\S+|\/[\w.-]{2,}(?:\/[\w.-]+)+|[A-Za-z]:\\[\w\\.-]+|[A-Za-z0-9._-]+\.[A-Za-z0-9._/-]+:\d{1,5}|\b\d{6,}\b)/g) ?? [];
	return Array.from(new Set(matches.map((value) => sanitizeExtractedIdentifier(value)).map((value) => normalizeOpaqueIdentifier(value)).filter((value) => value.length >= 4))).slice(0, MAX_EXTRACTED_IDENTIFIERS);
}
function tokenizeAskOverlapText(text) {
	const normalized = localeLowercasePreservingWhitespace(text.normalize("NFKC")).trim();
	if (!normalized) return [];
	const keywords = extractKeywords(normalized);
	if (keywords.length > 0) return keywords;
	return normalized.split(/[^\p{L}\p{N}]+/u).map((token) => token.trim()).filter((token) => token.length > 0);
}
function hasAskOverlap(summary, latestAsk) {
	if (!latestAsk) return true;
	const askTokens = uniqueStrings(tokenizeAskOverlapText(latestAsk)).slice(0, MAX_ASK_OVERLAP_TOKENS);
	if (askTokens.length === 0) return true;
	const meaningfulAskTokens = askTokens.filter((token) => {
		if (token.length <= 1) return false;
		if (isQueryStopWordToken(token)) return false;
		return true;
	});
	const tokensToCheck = meaningfulAskTokens.length > 0 ? meaningfulAskTokens : askTokens;
	if (tokensToCheck.length === 0) return true;
	const summaryTokens = new Set(tokenizeAskOverlapText(summary));
	let overlapCount = 0;
	for (const token of tokensToCheck) if (summaryTokens.has(token)) overlapCount += 1;
	const requiredMatches = tokensToCheck.length >= MIN_ASK_OVERLAP_TOKENS_FOR_DOUBLE_MATCH ? 2 : 1;
	return overlapCount >= requiredMatches;
}
/** Audit summary structure, exact identifier preservation, and latest-ask coverage. */
/** Audits a candidate summary for required sections, pending asks, and identifier preservation. */
function auditSummaryQuality(params) {
	const reasons = [];
	const lines = new Set(normalizedSummaryLines(params.summary));
	for (const section of REQUIRED_SUMMARY_SECTIONS) if (!lines.has(section)) reasons.push(`missing_section:${section}`);
	if ((params.identifierPolicy ?? "strict") === "strict") {
		const missingIdentifiers = params.identifiers.filter((identifier) => !summaryIncludesIdentifier(params.summary, identifier));
		if (missingIdentifiers.length > 0) reasons.push(`missing_identifiers:${missingIdentifiers.slice(0, 3).join(",")}`);
	}
	if (!hasAskOverlap(params.summary, params.latestAsk)) reasons.push("latest_user_ask_not_reflected");
	return {
		ok: reasons.length === 0,
		reasons
	};
}
//#endregion
//#region src/agents/agent-hooks/compaction-safeguard.ts
/** Extension that safeguards compaction with structured summaries and quality repair. */
const log = createSubsystemLogger("compaction-safeguard");
const missedModelWarningSessions = /* @__PURE__ */ new WeakSet();
const TURN_PREFIX_INSTRUCTIONS = "This summary covers the prefix of a split turn. Focus on the original request, early progress, and any details needed to understand the retained suffix.";
const MAX_TOOL_FAILURES = 8;
const MAX_TOOL_FAILURE_CHARS = 240;
const MAX_COMPACTION_SUMMARY_CHARS = 16e3;
const MAX_FILE_OPS_SECTION_CHARS = 2e3;
const MAX_FILE_OPS_LIST_CHARS = 900;
const SUMMARY_TRUNCATED_MARKER = "\n\n[Compaction summary truncated to fit budget]";
const DEFAULT_RECENT_TURNS_PRESERVE = 3;
const DEFAULT_QUALITY_GUARD_MAX_RETRIES = 1;
const MAX_RECENT_TURNS_PRESERVE = 12;
const MAX_QUALITY_GUARD_MAX_RETRIES = 3;
const MAX_RECENT_TURN_TEXT_CHARS = 600;
const PREVIOUS_SUMMARY_REDISTILL_PREFIX = "Previous compaction summary to re-distill with the current conversation. Prune stale, duplicate, or superseded details instead of preserving it verbatim.";
const compactionSafeguardDeps = { summarizeInStages };
function buildPreviousSummaryMessage(previousSummary) {
	return {
		role: "user",
		content: [{
			type: "text",
			text: `<previous-compaction-summary>\n${PREVIOUS_SUMMARY_REDISTILL_PREFIX}\n\n${previousSummary.trim()}\n</previous-compaction-summary>`
		}],
		timestamp: 0
	};
}
function prependPreviousSummaryForRedistill(params) {
	const previousSummary = params.previousSummary?.trim();
	if (!previousSummary) return params.messages;
	return [buildPreviousSummaryMessage(previousSummary), ...params.messages];
}
function coerceTimestamp(value) {
	if (typeof value === "number" && Number.isFinite(value)) return value;
	if (typeof value === "string") {
		const parsed = Date.parse(value);
		if (Number.isFinite(parsed)) return parsed;
	}
	return 0;
}
function sessionBranchEntryToMessage(entry) {
	if (entry.type === "message" && entry.message && typeof entry.message === "object") return entry.message;
	if (entry.type === "custom_message") return {
		role: "custom",
		customType: typeof entry.customType === "string" ? entry.customType : "custom",
		content: entry.content,
		display: entry.display !== false,
		details: entry.details,
		timestamp: coerceTimestamp(entry.timestamp)
	};
	if (entry.type === "branch_summary") return {
		role: "branchSummary",
		summary: typeof entry.summary === "string" ? entry.summary : "",
		fromId: typeof entry.fromId === "string" ? entry.fromId : "root",
		timestamp: coerceTimestamp(entry.timestamp)
	};
}
function collectSessionBranchMessages(sessionManager) {
	const getBranch = sessionManager?.getBranch;
	if (typeof getBranch !== "function") return [];
	let entries;
	try {
		entries = getBranch.call(sessionManager);
	} catch {
		return [];
	}
	if (!Array.isArray(entries)) return [];
	return entries.map((entry) => entry && typeof entry === "object" ? sessionBranchEntryToMessage(entry) : void 0).filter((message) => Boolean(message));
}
function containsRealConversation(messages) {
	return messages.some((message, index, allMessages) => isRealConversationMessage(message, allMessages, index));
}
/**
* Attempt provider-based summarization. Returns the summary string on success,
* or `undefined` when the caller should fall back to built-in LLM summarization.
* Rethrows abort/timeout errors so cancellation is always respected.
*/
async function tryProviderSummarize(provider, params) {
	try {
		const result = await provider.summarize(params);
		if (typeof result === "string" && result.trim()) return result;
		log.warn(`Compaction provider "${provider.id}" returned empty result, falling back to LLM.`);
		return;
	} catch (err) {
		if (isAbortError(err) || isTimeoutError(err)) throw err;
		log.warn(`Compaction provider "${provider.id}" failed, falling back to LLM: ${err instanceof Error ? err.message : String(err)}`);
		return;
	}
}
/**
* Summarize via the built-in LLM pipeline (summarizeInStages).
* Only called when no compaction provider is available or the provider failed.
*/
async function summarizeViaLLM(params) {
	const messages = prependPreviousSummaryForRedistill({
		messages: params.messages,
		previousSummary: params.previousSummary
	});
	return compactionSafeguardDeps.summarizeInStages({
		messages,
		model: params.model,
		apiKey: params.apiKey,
		headers: params.headers,
		signal: params.signal,
		reserveTokens: params.reserveTokens,
		maxChunkTokens: params.maxChunkTokens,
		contextWindow: params.contextWindow,
		customInstructions: params.customInstructions,
		summarizationInstructions: params.summarizationInstructions,
		previousSummary: void 0
	});
}
/**
* Build the reserved suffix that follows the summary body. Both the provider
* and LLM paths use this so diagnostic sections survive truncation.
*/
function assembleSuffix(parts) {
	let suffix = "";
	suffix = appendSummarySection(suffix, parts.splitTurnSection ?? "");
	suffix = appendSummarySection(suffix, parts.preservedTurnsSection ?? "");
	suffix = appendSummarySection(suffix, parts.toolFailureSection ?? "");
	suffix = appendSummarySection(suffix, parts.fileOpsSummary ?? "");
	suffix = appendSummarySection(suffix, parts.workspaceContext ?? "");
	if (suffix && !/^\s/.test(suffix)) suffix = `\n\n${suffix}`;
	return suffix;
}
/**
* Resolve model credentials. Returns auth details on success or a cancel reason on failure.
* Extracted to keep the main handler readable when model/auth is conditional.
*/
async function resolveModelAuth(ctx, model) {
	let requestAuth;
	try {
		const modelRegistry = ctx.modelRegistry;
		if (typeof modelRegistry.getApiKeyAndHeaders !== "function") throw new Error("model registry auth lookup unavailable");
		requestAuth = await modelRegistry.getApiKeyAndHeaders(model);
	} catch (err) {
		const error = formatErrorMessage(err);
		log.warn(`Compaction safeguard: request credentials unavailable; cancelling compaction. ${error}`);
		return {
			ok: false,
			reason: `Compaction safeguard could not resolve request credentials for ${model.provider}/${model.id}: ${error}`
		};
	}
	if (!requestAuth.ok) {
		log.warn(`Compaction safeguard: request credential resolution failed for ${model.provider}/${model.id}: ${requestAuth.error}`);
		return {
			ok: false,
			reason: `Compaction safeguard could not resolve request credentials for ${model.provider}/${model.id}: ${requestAuth.error}`
		};
	}
	if (!requestAuth.apiKey && !requestAuth.headers) {
		log.warn("Compaction safeguard: no request credentials available; cancelling compaction to preserve history.");
		return {
			ok: false,
			reason: `Compaction safeguard could not resolve request credentials for ${model.provider}/${model.id}.`
		};
	}
	return {
		ok: true,
		apiKey: requestAuth.apiKey,
		headers: requestAuth.headers
	};
}
function buildCompactionSummaryHeaders(params) {
	if (params.model.provider !== "github-copilot") return params.headers;
	const messages = params.messages;
	return {
		...buildCopilotDynamicHeaders({
			messages,
			hasImages: hasCopilotVisionInput(messages)
		}),
		...params.headers
	};
}
function clampNonNegativeInt(value, fallback) {
	return Math.max(0, Math.floor(typeof value === "number" && Number.isFinite(value) ? value : fallback));
}
function resolveRecentTurnsPreserve(value) {
	return Math.min(MAX_RECENT_TURNS_PRESERVE, clampNonNegativeInt(value, DEFAULT_RECENT_TURNS_PRESERVE));
}
function resolveQualityGuardMaxRetries(value) {
	return Math.min(MAX_QUALITY_GUARD_MAX_RETRIES, clampNonNegativeInt(value, DEFAULT_QUALITY_GUARD_MAX_RETRIES));
}
function normalizeFailureText(text) {
	return text.replace(/\s+/g, " ").trim();
}
function truncateFailureText(text, maxChars) {
	if (text.length <= maxChars) return text;
	return `${text.slice(0, Math.max(0, maxChars - 3))}...`;
}
function formatToolFailureMeta(details) {
	if (!details || typeof details !== "object") return;
	const record = details;
	const status = typeof record.status === "string" ? record.status : void 0;
	const exitCode = typeof record.exitCode === "number" && Number.isFinite(record.exitCode) ? record.exitCode : void 0;
	const parts = [];
	if (status) parts.push(`status=${status}`);
	if (exitCode !== void 0) parts.push(`exitCode=${exitCode}`);
	return parts.length > 0 ? parts.join(" ") : void 0;
}
function extractToolResultText(content) {
	return collectTextContentBlocks(content).join("\n");
}
function collectToolFailures(messages) {
	const failures = [];
	const seen = /* @__PURE__ */ new Set();
	for (const message of messages) {
		if (!message || typeof message !== "object") continue;
		if (message.role !== "toolResult") continue;
		const toolResult = message;
		if (toolResult.isError !== true) continue;
		const toolCallId = typeof toolResult.toolCallId === "string" ? toolResult.toolCallId : "";
		if (!toolCallId || seen.has(toolCallId)) continue;
		seen.add(toolCallId);
		const toolName = typeof toolResult.toolName === "string" && toolResult.toolName.trim() ? toolResult.toolName : "tool";
		const rawText = extractToolResultText(toolResult.content);
		const meta = formatToolFailureMeta(toolResult.details);
		const summary = truncateFailureText(normalizeFailureText(rawText) || (meta ? "failed" : "failed (no output)"), MAX_TOOL_FAILURE_CHARS);
		failures.push({
			toolCallId,
			toolName,
			summary,
			meta
		});
	}
	return failures;
}
function formatToolFailuresSection(failures) {
	if (failures.length === 0) return "";
	const lines = failures.slice(0, MAX_TOOL_FAILURES).map((failure) => {
		const meta = failure.meta ? ` (${failure.meta})` : "";
		return `- ${failure.toolName}${meta}: ${failure.summary}`;
	});
	if (failures.length > MAX_TOOL_FAILURES) lines.push(`- ...and ${failures.length - MAX_TOOL_FAILURES} more`);
	return `\n\n## Tool Failures\n${lines.join("\n")}`;
}
function computeFileLists(fileOps) {
	const modified = new Set([...fileOps.edited, ...fileOps.written]);
	return {
		readFiles: [...fileOps.read].filter((f) => !modified.has(f)).toSorted(),
		modifiedFiles: [...modified].toSorted()
	};
}
function formatFileOperations(readFiles, modifiedFiles) {
	function formatBoundedFileList(tag, files, maxChars) {
		if (files.length === 0 || maxChars <= 0) return "";
		const openTag = `<${tag}>\n`;
		const closeTag = `\n</${tag}>`;
		const lines = [];
		let usedChars = openTag.length + closeTag.length;
		for (let i = 0; i < files.length; i++) {
			const line = `${files[i]}\n`;
			const remaining = files.length - i - 1;
			const overflowLine = remaining > 0 ? `...and ${remaining} more\n` : "";
			if (usedChars + line.length + overflowLine.length > maxChars) {
				const overflow = `...and ${files.length - i} more\n`;
				if (usedChars + overflow.length <= maxChars) lines.push(overflow);
				break;
			}
			lines.push(line);
			usedChars += line.length;
		}
		return lines.length > 0 ? `${openTag}${lines.join("")}${closeTag}` : "";
	}
	const sections = [];
	const readSection = formatBoundedFileList("read-files", readFiles, MAX_FILE_OPS_LIST_CHARS);
	const modifiedSection = formatBoundedFileList("modified-files", modifiedFiles, MAX_FILE_OPS_LIST_CHARS);
	if (readSection) sections.push(readSection);
	if (modifiedSection) sections.push(modifiedSection);
	if (sections.length === 0) return "";
	return capCompactionSummary(`\n\n${sections.join("\n\n")}`, MAX_FILE_OPS_SECTION_CHARS);
}
function capCompactionSummary(summary, maxChars = MAX_COMPACTION_SUMMARY_CHARS) {
	if (maxChars <= 0 || summary.length <= maxChars) return summary;
	const marker = SUMMARY_TRUNCATED_MARKER;
	const budget = Math.max(0, maxChars - 46);
	if (budget <= 0) return summary.slice(0, maxChars);
	return `${summary.slice(0, budget)}${marker}`;
}
function capCompactionSummaryPreservingSuffix(summaryBody, suffix, maxChars = MAX_COMPACTION_SUMMARY_CHARS) {
	if (!suffix) return capCompactionSummary(summaryBody, maxChars);
	if (maxChars <= 0) return capCompactionSummary(`${summaryBody}${suffix}`, maxChars);
	if (suffix.length >= maxChars) return suffix.slice(-maxChars);
	return `${capCompactionSummary(summaryBody, Math.max(0, maxChars - suffix.length))}${suffix}`;
}
function resolveSummaryReserveTokens(requestedReserveTokens, model) {
	const requested = Math.max(1, Math.floor(requestedReserveTokens));
	const modelMaxTokens = model.maxTokens;
	if (typeof modelMaxTokens !== "number" || !Number.isFinite(modelMaxTokens) || modelMaxTokens <= 0) return requested;
	return Math.max(1, Math.min(requested, Math.floor(modelMaxTokens)));
}
function extractMessageText(message) {
	const content = message.content;
	if (typeof content === "string") return content.trim();
	if (!Array.isArray(content)) return "";
	const parts = [];
	for (const block of content) {
		if (!block || typeof block !== "object") continue;
		const text = block.text;
		if (typeof text === "string" && text.trim().length > 0) parts.push(text.trim());
	}
	return parts.join("\n").trim();
}
function formatNonTextPlaceholder(content) {
	if (content === null || content === void 0) return null;
	if (typeof content === "string") return null;
	if (!Array.isArray(content)) return "[non-text content]";
	const typeCounts = /* @__PURE__ */ new Map();
	for (const block of content) {
		if (!block || typeof block !== "object") continue;
		const typeRaw = block.type;
		const type = typeof typeRaw === "string" && typeRaw.trim().length > 0 ? typeRaw : "unknown";
		if (type === "text") continue;
		typeCounts.set(type, (typeCounts.get(type) ?? 0) + 1);
	}
	if (typeCounts.size === 0) return null;
	return `[non-text content: ${[...typeCounts.entries()].map(([type, count]) => count > 1 ? `${type} x${count}` : type).join(", ")}]`;
}
function splitPreservedRecentTurns(params) {
	const preserveTurns = Math.min(MAX_RECENT_TURNS_PRESERVE, clampNonNegativeInt(params.recentTurnsPreserve, 0));
	if (preserveTurns <= 0) return {
		summarizableMessages: params.messages,
		preservedMessages: []
	};
	const conversationIndexes = [];
	const userIndexes = [];
	for (let i = 0; i < params.messages.length; i += 1) {
		const role = params.messages[i].role;
		if (role === "user" || role === "assistant") {
			conversationIndexes.push(i);
			if (role === "user") userIndexes.push(i);
		}
	}
	if (conversationIndexes.length === 0) return {
		summarizableMessages: params.messages,
		preservedMessages: []
	};
	const preservedIndexSet = /* @__PURE__ */ new Set();
	if (userIndexes.length >= preserveTurns) {
		const boundaryStartIndex = userIndexes[userIndexes.length - preserveTurns] ?? -1;
		if (boundaryStartIndex >= 0) {
			for (const index of conversationIndexes) if (index >= boundaryStartIndex) preservedIndexSet.add(index);
		}
	} else {
		const fallbackMessageCount = preserveTurns * 2;
		for (const userIndex of userIndexes) preservedIndexSet.add(userIndex);
		for (let i = conversationIndexes.length - 1; i >= 0; i -= 1) {
			const index = conversationIndexes[i];
			if (index === void 0) continue;
			preservedIndexSet.add(index);
			if (preservedIndexSet.size >= fallbackMessageCount) break;
		}
	}
	if (preservedIndexSet.size === 0) return {
		summarizableMessages: params.messages,
		preservedMessages: []
	};
	const preservedToolCallIds = /* @__PURE__ */ new Set();
	for (let i = 0; i < params.messages.length; i += 1) {
		if (!preservedIndexSet.has(i)) continue;
		const message = params.messages[i];
		if (message.role !== "assistant") continue;
		const toolCalls = extractToolCallsFromAssistant(message);
		for (const toolCall of toolCalls) preservedToolCallIds.add(toolCall.id);
	}
	if (preservedToolCallIds.size > 0) {
		let preservedStartIndex = -1;
		for (let i = 0; i < params.messages.length; i += 1) if (preservedIndexSet.has(i)) {
			preservedStartIndex = i;
			break;
		}
		if (preservedStartIndex >= 0) for (let i = preservedStartIndex; i < params.messages.length; i += 1) {
			const message = params.messages[i];
			if (message.role !== "toolResult") continue;
			const toolResultId = extractToolResultId(message);
			if (toolResultId && preservedToolCallIds.has(toolResultId)) preservedIndexSet.add(i);
		}
	}
	return {
		summarizableMessages: repairToolUseResultPairing(params.messages.filter((_, idx) => !preservedIndexSet.has(idx))).messages,
		preservedMessages: params.messages.filter((_, idx) => preservedIndexSet.has(idx)).filter((msg) => {
			const role = msg.role;
			return role === "user" || role === "assistant" || role === "toolResult";
		})
	};
}
function formatContextMessages(messages) {
	return messages.map((message) => {
		let roleLabel;
		if (message.role === "assistant") roleLabel = "Assistant";
		else if (message.role === "user") roleLabel = "User";
		else if (message.role === "toolResult") {
			const toolName = message.toolName;
			roleLabel = `Tool result (${typeof toolName === "string" && toolName.trim() ? toolName : "tool"})`;
		} else return null;
		const text = extractMessageText(message);
		const nonTextPlaceholder = formatNonTextPlaceholder(message.content);
		const rendered = text && nonTextPlaceholder ? `${text}\n${nonTextPlaceholder}` : text || nonTextPlaceholder;
		if (!rendered) return null;
		const trimmed = rendered.length > MAX_RECENT_TURN_TEXT_CHARS ? `${rendered.slice(0, MAX_RECENT_TURN_TEXT_CHARS)}...` : rendered;
		return `- ${roleLabel}: ${trimmed}`;
	}).filter((line) => Boolean(line));
}
function formatPreservedTurnsSection(messages) {
	if (messages.length === 0) return "";
	const lines = formatContextMessages(messages);
	if (lines.length === 0) return "";
	return `\n\n## Recent turns preserved verbatim\n${lines.join("\n")}`;
}
function formatSplitTurnContextSection(messages) {
	if (messages.length === 0) return "";
	const lines = formatContextMessages(messages);
	if (lines.length === 0) return "";
	return `**Turn Context (split turn):**\n\n${lines.join("\n")}`;
}
function extractLatestUserAsk(messages) {
	for (let i = messages.length - 1; i >= 0; i -= 1) {
		const message = messages[i];
		if (message.role !== "user") continue;
		const text = extractMessageText(message);
		if (text) return text;
	}
	return null;
}
/**
* Read and format critical workspace context for compaction summary.
* Uses explicitly configured AGENTS.md section names only.
* The default "Session Startup" / "Red Lines" pair preserves the legacy
* "Every Session" / "Safety" fallback.
* Limited to 2000 chars to avoid bloating the summary.
*/
async function readWorkspaceContextForSummary(sectionNames, workspaceDir = process.cwd()) {
	const MAX_SUMMARY_CONTEXT_CHARS = 2e3;
	if (!Array.isArray(sectionNames) || sectionNames.length === 0) return "";
	const agentsPath = path.join(workspaceDir, "AGENTS.md");
	try {
		const opened = await openRootFile({
			absolutePath: agentsPath,
			rootPath: workspaceDir,
			boundaryLabel: "workspace root"
		});
		if (!opened.ok) return "";
		const content = (() => {
			try {
				return fs.readFileSync(opened.fd, "utf-8");
			} finally {
				fs.closeSync(opened.fd);
			}
		})();
		let sections = extractSections(content, sectionNames);
		if (sections.length === 0 && sectionNames.length === 2 && sectionNames.some((name) => name.trim().toLowerCase() === "session startup") && sectionNames.some((name) => name.trim().toLowerCase() === "red lines")) sections = extractSections(content, ["Every Session", "Safety"]);
		if (sections.length === 0) return "";
		const combined = sections.join("\n\n");
		return `\n\n<workspace-critical-rules>\n${combined.length > MAX_SUMMARY_CONTEXT_CHARS ? combined.slice(0, MAX_SUMMARY_CONTEXT_CHARS) + "\n...[truncated]..." : combined}\n</workspace-critical-rules>`;
	} catch {
		return "";
	}
}
/** Registers compaction hooks that summarize, preserve recent turns, and audit output quality. */
function compactionSafeguardExtension(api) {
	api.on("session_before_compact", async (event, ctx) => {
		const { preparation, customInstructions: eventInstructions, signal } = event;
		const rawTurnPrefixMessages = preparation.turnPrefixMessages ?? [];
		let baseMessagesToSummarize = stripRuntimeContextCustomMessages(preparation.messagesToSummarize);
		let baseTurnPrefixMessages = stripRuntimeContextCustomMessages(rawTurnPrefixMessages);
		let hasRealSummarizable = containsRealConversation(baseMessagesToSummarize);
		let hasRealTurnPrefix = containsRealConversation(baseTurnPrefixMessages);
		if (!hasRealSummarizable && !hasRealTurnPrefix) {
			const branchMessages = stripRuntimeContextCustomMessages(collectSessionBranchMessages(ctx.sessionManager));
			if (containsRealConversation(branchMessages)) {
				log.info("Compaction safeguard: using session branch messages after compaction preparation omitted real conversation content.");
				baseMessagesToSummarize = branchMessages;
				baseTurnPrefixMessages = [];
				hasRealSummarizable = true;
				hasRealTurnPrefix = false;
			}
		}
		setCompactionSafeguardCancelReason(ctx.sessionManager, void 0);
		if (!hasRealSummarizable && !hasRealTurnPrefix) {
			log.info("Compaction safeguard: no real conversation messages to summarize; writing compaction boundary to suppress re-trigger loop.");
			return { compaction: {
				summary: buildStructuredFallbackSummary(preparation.previousSummary),
				firstKeptEntryId: preparation.firstKeptEntryId,
				tokensBefore: preparation.tokensBefore
			} };
		}
		const { readFiles, modifiedFiles } = computeFileLists(preparation.fileOps);
		const fileOpsSummary = formatFileOperations(readFiles, modifiedFiles);
		const toolFailureSection = formatToolFailuresSection(collectToolFailures([...baseMessagesToSummarize, ...baseTurnPrefixMessages]));
		const runtime = getCompactionSafeguardRuntime(ctx.sessionManager);
		const customInstructions = resolveCompactionInstructions(eventInstructions, runtime?.customInstructions);
		const summarizationInstructions = {
			identifierPolicy: runtime?.identifierPolicy,
			identifierInstructions: runtime?.identifierInstructions
		};
		const identifierPolicy = runtime?.identifierPolicy ?? "strict";
		const providerId = runtime?.provider;
		const turnPrefixMessages = baseTurnPrefixMessages;
		const recentTurnsPreserve = resolveRecentTurnsPreserve(runtime?.recentTurnsPreserve);
		const { preservedMessages: providerPreservedMessages } = splitPreservedRecentTurns({
			messages: baseMessagesToSummarize,
			recentTurnsPreserve
		});
		const preservedTurnsSection = formatPreservedTurnsSection(providerPreservedMessages);
		const splitTurnSection = preparation.isSplitTurn ? formatSplitTurnContextSection(turnPrefixMessages) : "";
		const structuredInstructions = buildCompactionStructureInstructions(customInstructions, summarizationInstructions);
		if (providerId) {
			const compactionProvider = getCompactionProvider(providerId);
			if (compactionProvider) try {
				const providerResult = await tryProviderSummarize(compactionProvider, {
					messages: [...baseMessagesToSummarize, ...turnPrefixMessages],
					signal,
					customInstructions: structuredInstructions,
					summarizationInstructions,
					previousSummary: preparation.previousSummary
				});
				if (providerResult !== void 0) return { compaction: {
					summary: capCompactionSummaryPreservingSuffix(providerResult, assembleSuffix({
						splitTurnSection,
						preservedTurnsSection,
						toolFailureSection,
						fileOpsSummary,
						workspaceContext: await readWorkspaceContextForSummary(runtime?.postCompactionSections, runtime?.workspaceDir)
					})),
					firstKeptEntryId: preparation.firstKeptEntryId,
					tokensBefore: preparation.tokensBefore,
					details: {
						readFiles,
						modifiedFiles
					}
				} };
				log.info("Compaction provider did not produce a result; falling back to LLM path.");
			} catch (err) {
				if (isAbortError(err) || isTimeoutError(err)) throw err;
				log.warn(`Compaction provider path failed unexpectedly: ${err instanceof Error ? err.message : String(err)}`);
			}
			else log.warn(`Compaction provider "${providerId}" is configured but not registered. Falling back to LLM.`);
		}
		const model = ctx.model ?? runtime?.model;
		if (!model) {
			if (!ctx.model && !runtime?.model && !missedModelWarningSessions.has(ctx.sessionManager)) {
				missedModelWarningSessions.add(ctx.sessionManager);
				log.warn("[compaction-safeguard] Both ctx.model and runtime.model are undefined. Compaction summarization will not run. This indicates extensionRunner.initialize() was not called and model was not passed through runtime registry.");
			}
			setCompactionSafeguardCancelReason(ctx.sessionManager, "Compaction safeguard could not resolve a summarization model.");
			return { cancel: true };
		}
		const authResult = await resolveModelAuth(ctx, model);
		if (!authResult.ok) {
			setCompactionSafeguardCancelReason(ctx.sessionManager, authResult.reason);
			return { cancel: true };
		}
		const apiKey = authResult.apiKey ?? "";
		const authHeaders = authResult.headers;
		try {
			const modelContextWindow = resolveContextWindowTokens$1(model);
			const contextWindowTokens = runtime?.contextWindowTokens ?? modelContextWindow;
			let messagesToSummarize = baseMessagesToSummarize;
			const headers = buildCompactionSummaryHeaders({
				model,
				messages: messagesToSummarize,
				headers: authHeaders
			});
			const qualityGuardEnabled = runtime?.qualityGuardEnabled ?? false;
			const qualityGuardMaxRetries = resolveQualityGuardMaxRetries(runtime?.qualityGuardMaxRetries);
			const maxHistoryShare = runtime?.maxHistoryShare ?? .5;
			const tokensBefore = typeof preparation.tokensBefore === "number" && Number.isFinite(preparation.tokensBefore) ? preparation.tokensBefore : void 0;
			let droppedSummary;
			if (tokensBefore !== void 0) {
				const { newContentTokens, maxHistoryTokens, pruned } = await buildHistoryPrunePlanWithWorker({
					messagesToSummarize,
					turnPrefixMessages,
					tokensBefore,
					contextWindowTokens,
					maxHistoryShare,
					parts: 2,
					signal
				});
				if (newContentTokens > maxHistoryTokens && pruned) {
					if (pruned.droppedChunks > 0) {
						const newContentRatio = newContentTokens / contextWindowTokens * 100;
						log.warn(`Compaction safeguard: new content uses ${newContentRatio.toFixed(1)}% of context; dropped ${pruned.droppedChunks} older chunk(s) (${pruned.droppedMessages} messages) to fit history budget.`);
						messagesToSummarize = pruned.messages;
						if (pruned.droppedMessagesList.length > 0) try {
							const droppedChunkRatio = await computeAdaptiveChunkRatioWithWorker({
								messages: pruned.droppedMessagesList,
								contextWindow: contextWindowTokens,
								signal
							});
							const droppedMaxChunkTokens = Math.max(1, Math.floor(contextWindowTokens * droppedChunkRatio) - SUMMARIZATION_OVERHEAD_TOKENS);
							droppedSummary = await summarizeViaLLM({
								messages: pruned.droppedMessagesList,
								model,
								apiKey,
								headers,
								signal,
								reserveTokens: resolveSummaryReserveTokens(preparation.settings.reserveTokens, model),
								maxChunkTokens: droppedMaxChunkTokens,
								contextWindow: contextWindowTokens,
								customInstructions: structuredInstructions,
								summarizationInstructions,
								previousSummary: preparation.previousSummary
							});
						} catch (droppedError) {
							log.warn(`Compaction safeguard: failed to summarize dropped messages, continuing without: ${formatErrorMessage(droppedError)}`);
						}
					}
				}
			}
			const { summarizableMessages: summaryTargetMessages, preservedMessages: preservedRecentMessages } = splitPreservedRecentTurns({
				messages: messagesToSummarize,
				recentTurnsPreserve
			});
			messagesToSummarize = summaryTargetMessages;
			const preservedTurnsSectionLocal = formatPreservedTurnsSection(preservedRecentMessages);
			const latestUserAsk = extractLatestUserAsk([...messagesToSummarize, ...turnPrefixMessages]);
			const identifiers = extractOpaqueIdentifiers([...messagesToSummarize, ...turnPrefixMessages].slice(-10).map((message) => extractMessageText(message)).filter(Boolean).join("\n"));
			const adaptiveRatio = await computeAdaptiveChunkRatioWithWorker({
				messages: [...messagesToSummarize, ...turnPrefixMessages],
				contextWindow: contextWindowTokens,
				signal
			});
			const maxChunkTokens = Math.max(1, Math.floor(contextWindowTokens * adaptiveRatio) - SUMMARIZATION_OVERHEAD_TOKENS);
			const reserveTokens = resolveSummaryReserveTokens(preparation.settings.reserveTokens, model);
			const effectivePreviousSummary = droppedSummary ?? preparation.previousSummary;
			let summary = "";
			let lastHistorySummary = "";
			let lastSplitTurnSection = "";
			let currentInstructions = structuredInstructions;
			const totalAttempts = qualityGuardEnabled ? qualityGuardMaxRetries + 1 : 1;
			let lastSuccessfulSummary = null;
			for (let attempt = 0; attempt < totalAttempts; attempt += 1) {
				let summaryWithoutPreservedTurns = "";
				let summaryWithPreservedTurns = "";
				let splitTurnSectionLocal = "";
				let historySummary = "";
				try {
					historySummary = messagesToSummarize.length > 0 ? await summarizeViaLLM({
						messages: messagesToSummarize,
						model,
						apiKey,
						headers,
						signal,
						reserveTokens,
						maxChunkTokens,
						contextWindow: contextWindowTokens,
						customInstructions: currentInstructions,
						summarizationInstructions,
						previousSummary: effectivePreviousSummary
					}) : buildStructuredFallbackSummary(effectivePreviousSummary, summarizationInstructions);
					summaryWithoutPreservedTurns = historySummary;
					if (preparation.isSplitTurn && turnPrefixMessages.length > 0) {
						splitTurnSectionLocal = `**Turn Context (split turn):**\n\n${await summarizeViaLLM({
							messages: turnPrefixMessages,
							model,
							apiKey,
							headers,
							signal,
							reserveTokens,
							maxChunkTokens,
							contextWindow: contextWindowTokens,
							customInstructions: composeSplitTurnInstructions(TURN_PREFIX_INSTRUCTIONS, currentInstructions),
							summarizationInstructions,
							previousSummary: void 0
						})}`;
						summaryWithoutPreservedTurns = historySummary.trim() ? `${historySummary}\n\n---\n\n${splitTurnSectionLocal}` : splitTurnSectionLocal;
					}
					summaryWithPreservedTurns = appendSummarySection(summaryWithoutPreservedTurns, preservedTurnsSectionLocal);
				} catch (attemptError) {
					if (lastSuccessfulSummary && attempt > 0) {
						log.warn(`Compaction safeguard: quality retry failed on attempt ${attempt + 1}; keeping last successful summary: ${formatErrorMessage(attemptError)}`);
						summary = lastSuccessfulSummary;
						break;
					}
					throw attemptError;
				}
				lastSuccessfulSummary = summaryWithPreservedTurns;
				lastHistorySummary = historySummary;
				lastSplitTurnSection = splitTurnSectionLocal;
				const canRegenerate = messagesToSummarize.length > 0 || preparation.isSplitTurn && turnPrefixMessages.length > 0;
				if (!qualityGuardEnabled || !canRegenerate) {
					summary = summaryWithPreservedTurns;
					break;
				}
				const quality = auditSummaryQuality({
					summary: summaryWithoutPreservedTurns,
					identifiers,
					latestAsk: latestUserAsk,
					identifierPolicy
				});
				summary = summaryWithPreservedTurns;
				if (quality.ok || attempt >= totalAttempts - 1) break;
				const reasons = quality.reasons.join(", ");
				const qualityFeedbackInstruction = identifierPolicy === "strict" ? "Fix all issues and include every required section with exact identifiers preserved." : "Fix all issues and include every required section while following the configured identifier policy.";
				const qualityFeedbackReasons = wrapUntrustedInstructionBlock("Quality check feedback", `Previous summary failed quality checks (${reasons}).`);
				currentInstructions = qualityFeedbackReasons ? `${structuredInstructions}\n\n${qualityFeedbackInstruction}\n\n${qualityFeedbackReasons}` : `${structuredInstructions}\n\n${qualityFeedbackInstruction}`;
			}
			const workspaceContext = await readWorkspaceContextForSummary(runtime?.postCompactionSections, runtime?.workspaceDir);
			const suffix = assembleSuffix({
				splitTurnSection: lastSplitTurnSection,
				preservedTurnsSection: preservedTurnsSectionLocal,
				toolFailureSection,
				fileOpsSummary,
				workspaceContext
			});
			summary = capCompactionSummaryPreservingSuffix(lastHistorySummary || summary, suffix);
			return { compaction: {
				summary,
				firstKeptEntryId: preparation.firstKeptEntryId,
				tokensBefore: preparation.tokensBefore,
				details: {
					readFiles,
					modifiedFiles
				}
			} };
		} catch (error) {
			const message = formatErrorMessage(error);
			log.warn(`Compaction summarization failed; cancelling compaction to preserve history: ${message}`);
			setCompactionSafeguardCancelReason(ctx.sessionManager, `Compaction safeguard could not summarize the session: ${message}`);
			return { cancel: true };
		}
	});
}
//#endregion
//#region src/agents/agent-hooks/context-pruning/tools.ts
/** Tool-name matching helpers for context-pruning eligibility. */
function normalizeGlob(value) {
	return normalizeLowercaseStringOrEmpty(value ?? "");
}
/** Build a deny-first allowlist predicate for context-prunable tool names. */
function makeToolPrunablePredicate(match) {
	const deny = compileGlobPatterns({
		raw: match.deny,
		normalize: normalizeGlob
	});
	const allow = compileGlobPatterns({
		raw: match.allow,
		normalize: normalizeGlob
	});
	return (toolName) => {
		const normalized = normalizeGlob(toolName);
		if (matchesAnyGlobPattern(normalized, deny)) return false;
		if (allow.length === 0) return true;
		return matchesAnyGlobPattern(normalized, allow);
	};
}
//#endregion
//#region src/agents/agent-hooks/context-pruning/pruner.ts
const IMAGE_CHAR_ESTIMATE = 8e3;
const PRUNED_CONTEXT_IMAGE_MARKER = "[image removed during context pruning]";
function asText(text) {
	return {
		type: "text",
		text
	};
}
function serializeMalformedTextBlock(block) {
	try {
		const serialized = JSON.stringify(block);
		return typeof serialized === "string" ? serialized : "[malformed text block]";
	} catch {
		return "[malformed text block]";
	}
}
function coerceTextBlock(block) {
	if (!block || typeof block !== "object") return null;
	if (block.type !== "text") return null;
	const text = block.text;
	return typeof text === "string" ? text : serializeMalformedTextBlock(block);
}
function isImageBlock(block) {
	return Boolean(block) && typeof block === "object" && block.type === "image";
}
function collectTextSegments(content) {
	const parts = [];
	for (const block of content) {
		const text = coerceTextBlock(block);
		if (text !== null) parts.push(text);
	}
	return parts;
}
function collectPrunableToolResultSegments(content) {
	const parts = [];
	for (const block of content) {
		const text = coerceTextBlock(block);
		if (text !== null) {
			parts.push(text);
			continue;
		}
		if (isImageBlock(block)) parts.push(PRUNED_CONTEXT_IMAGE_MARKER);
	}
	return parts;
}
function estimateJoinedTextLength(parts) {
	if (parts.length === 0) return 0;
	let len = 0;
	for (const p of parts) len += p.length;
	len += Math.max(0, parts.length - 1);
	return len;
}
function takeHeadFromJoinedText(parts, maxChars) {
	if (maxChars <= 0 || parts.length === 0) return "";
	let remaining = maxChars;
	let out = "";
	for (let i = 0; i < parts.length && remaining > 0; i++) {
		if (i > 0) {
			out += "\n";
			remaining -= 1;
			if (remaining <= 0) break;
		}
		const p = parts[i];
		if (p.length <= remaining) {
			out += p;
			remaining -= p.length;
		} else {
			out += p.slice(0, remaining);
			remaining = 0;
		}
	}
	return out;
}
function takeTailFromJoinedText(parts, maxChars) {
	if (maxChars <= 0 || parts.length === 0) return "";
	let remaining = maxChars;
	const out = [];
	for (let i = parts.length - 1; i >= 0 && remaining > 0; i--) {
		const p = parts[i];
		if (p.length <= remaining) {
			out.push(p);
			remaining -= p.length;
		} else {
			out.push(p.slice(p.length - remaining));
			break;
		}
		if (remaining > 0 && i > 0) {
			out.push("\n");
			remaining -= 1;
		}
	}
	out.reverse();
	return out.join("");
}
function hasImageBlocks(content) {
	for (const block of content) if (isImageBlock(block)) return true;
	return false;
}
function estimateWeightedTextChars(text) {
	return estimateStringChars(text);
}
function estimateTextAndImageChars(content) {
	let chars = 0;
	for (const block of content) {
		const text = coerceTextBlock(block);
		if (text !== null) {
			chars += estimateWeightedTextChars(text);
			continue;
		}
		if (isImageBlock(block)) chars += IMAGE_CHAR_ESTIMATE;
	}
	return chars;
}
function estimateMessageChars(message) {
	if (message.role === "user") {
		const content = message.content;
		if (typeof content === "string") return estimateWeightedTextChars(content);
		return estimateTextAndImageChars(content);
	}
	if (message.role === "assistant") {
		let chars = 0;
		for (const b of message.content) {
			if (!b || typeof b !== "object") continue;
			if (b.type === "text" && typeof b.text === "string") chars += estimateWeightedTextChars(b.text);
			const blockType = b.type;
			if (blockType === "thinking" || blockType === "redacted_thinking") {
				const thinking = b.thinking;
				if (typeof thinking === "string") chars += estimateWeightedTextChars(thinking);
				const data = b.data;
				if (blockType === "redacted_thinking" && typeof data === "string") chars += estimateWeightedTextChars(data);
				const signature = b.thinkingSignature;
				if (typeof signature === "string") chars += estimateWeightedTextChars(signature);
			}
			if (b.type === "toolCall") try {
				chars += JSON.stringify(b.arguments ?? {}).length;
			} catch {
				chars += 128;
			}
		}
		return chars;
	}
	if (message.role === "toolResult") return estimateTextAndImageChars(message.content);
	return 256;
}
function estimateContextChars(messages) {
	return messages.reduce((sum, m) => sum + estimateMessageChars(m), 0);
}
function findAssistantCutoffIndex(messages, keepLastAssistants) {
	if (keepLastAssistants <= 0) return messages.length;
	let remaining = keepLastAssistants;
	for (let i = messages.length - 1; i >= 0; i--) {
		if (messages[i]?.role !== "assistant") continue;
		remaining--;
		if (remaining === 0) return i;
	}
	return null;
}
function findFirstUserIndex(messages) {
	for (let i = 0; i < messages.length; i++) if (messages[i]?.role === "user") return i;
	return null;
}
function softTrimToolResultMessage(params) {
	const { msg, settings } = params;
	const hasImages = hasImageBlocks(msg.content);
	const parts = hasImages ? collectPrunableToolResultSegments(msg.content) : collectTextSegments(msg.content);
	const rawLen = estimateJoinedTextLength(parts);
	if (rawLen <= settings.softTrim.maxChars) {
		if (!hasImages) return null;
		return {
			...msg,
			content: [asText(parts.join("\n"))]
		};
	}
	const headChars = Math.max(0, settings.softTrim.headChars);
	const tailChars = Math.max(0, settings.softTrim.tailChars);
	if (headChars + tailChars >= rawLen) {
		if (!hasImages) return null;
		return {
			...msg,
			content: [asText(parts.join("\n"))]
		};
	}
	const trimmed = `${takeHeadFromJoinedText(parts, headChars)}
...
${takeTailFromJoinedText(parts, tailChars)}`;
	const note = `

[Tool result trimmed: kept first ${headChars} chars and last ${tailChars} chars of ${rawLen} chars.]`;
	return {
		...msg,
		content: [asText(trimmed + note)]
	};
}
/** Returns a pruned message array when configured thresholds are exceeded, otherwise original. */
function pruneContextMessages(params) {
	const { messages, settings, ctx } = params;
	const contextWindowTokens = typeof params.contextWindowTokensOverride === "number" && Number.isFinite(params.contextWindowTokensOverride) && params.contextWindowTokensOverride > 0 ? params.contextWindowTokensOverride : ctx.model?.contextWindow;
	if (!contextWindowTokens || contextWindowTokens <= 0) return messages;
	const charWindow = contextWindowTokens * 4;
	if (charWindow <= 0) return messages;
	const cutoffIndex = findAssistantCutoffIndex(messages, settings.keepLastAssistants);
	if (cutoffIndex === null) return messages;
	const firstUserIndex = findFirstUserIndex(messages);
	const pruneStartIndex = firstUserIndex === null ? messages.length : firstUserIndex;
	const isToolPrunable = params.isToolPrunable ?? makeToolPrunablePredicate(settings.tools);
	let totalChars = estimateContextChars(params.dropThinkingBlocksForEstimate ? dropThinkingBlocks(messages) : messages);
	let ratio = totalChars / charWindow;
	if (ratio < settings.softTrimRatio) return messages;
	const prunableToolIndexes = [];
	let next = null;
	for (let i = pruneStartIndex; i < cutoffIndex; i++) {
		const msg = messages[i];
		if (!msg || msg.role !== "toolResult") continue;
		if (!isToolPrunable(msg.toolName)) continue;
		prunableToolIndexes.push(i);
		const updated = softTrimToolResultMessage({
			msg,
			settings
		});
		if (!updated) continue;
		const beforeChars = estimateMessageChars(msg);
		const afterChars = estimateMessageChars(updated);
		totalChars += afterChars - beforeChars;
		if (!next) next = messages.slice();
		next[i] = updated;
	}
	const outputAfterSoftTrim = next ?? messages;
	ratio = totalChars / charWindow;
	if (ratio < settings.hardClearRatio) return outputAfterSoftTrim;
	if (!settings.hardClear.enabled) return outputAfterSoftTrim;
	let prunableToolChars = 0;
	for (const i of prunableToolIndexes) {
		const msg = outputAfterSoftTrim[i];
		if (!msg || msg.role !== "toolResult") continue;
		prunableToolChars += estimateMessageChars(msg);
	}
	if (prunableToolChars < settings.minPrunableToolChars) return outputAfterSoftTrim;
	for (const i of prunableToolIndexes) {
		if (ratio < settings.hardClearRatio) break;
		const msg = (next ?? messages)[i];
		if (!msg || msg.role !== "toolResult") continue;
		const beforeChars = estimateMessageChars(msg);
		const cleared = {
			...msg,
			content: [asText(settings.hardClear.placeholder)]
		};
		if (!next) next = messages.slice();
		next[i] = cleared;
		const afterChars = estimateMessageChars(cleared);
		totalChars += afterChars - beforeChars;
		ratio = totalChars / charWindow;
	}
	return next ?? messages;
}
//#endregion
//#region src/agents/agent-hooks/context-pruning/runtime.ts
/** Session-manager scoped runtime state for context-pruning extension settings. */
const registry = createSessionManagerRuntimeRegistry();
const setContextPruningRuntime = registry.set;
const getContextPruningRuntime = registry.get;
//#endregion
//#region src/agents/agent-hooks/context-pruning/extension.ts
/** Registers the context-pruning hook for sessions with active pruning runtime settings. */
function contextPruningExtension(api) {
	api.on("context", (event, ctx) => {
		const runtime = getContextPruningRuntime(ctx.sessionManager);
		if (!runtime) return;
		if (runtime.settings.mode === "cache-ttl") {
			const ttlMs = runtime.settings.ttlMs;
			const lastTouch = runtime.lastCacheTouchAt ?? null;
			if (!lastTouch || ttlMs <= 0) return;
			if (ttlMs > 0 && Date.now() - lastTouch < ttlMs) return;
		}
		const next = pruneContextMessages({
			messages: event.messages,
			settings: runtime.settings,
			ctx,
			isToolPrunable: runtime.isToolPrunable,
			contextWindowTokensOverride: runtime.contextWindowTokens ?? void 0,
			dropThinkingBlocksForEstimate: runtime.dropThinkingBlocks
		});
		if (next === event.messages) return;
		if (runtime.settings.mode === "cache-ttl") runtime.lastCacheTouchAt = Date.now();
		return { messages: next };
	});
}
//#endregion
//#region src/agents/agent-hooks/context-pruning/settings.ts
/** Config normalization for cache-TTL based context pruning. */
const DEFAULT_CONTEXT_PRUNING_SETTINGS = {
	mode: "cache-ttl",
	ttlMs: 300 * 1e3,
	keepLastAssistants: 3,
	softTrimRatio: .3,
	hardClearRatio: .5,
	minPrunableToolChars: 5e4,
	tools: {},
	softTrim: {
		maxChars: 4e3,
		headChars: 1500,
		tailChars: 1500
	},
	hardClear: {
		enabled: true,
		placeholder: "[Old tool result content cleared]"
	}
};
/** Computes effective pruning settings, returning null when pruning is disabled or invalid. */
function computeEffectiveSettings(raw) {
	if (!raw || typeof raw !== "object") return null;
	const cfg = raw;
	if (cfg.mode !== "cache-ttl") return null;
	const s = structuredClone(DEFAULT_CONTEXT_PRUNING_SETTINGS);
	s.mode = cfg.mode;
	if (typeof cfg.ttl === "string") try {
		s.ttlMs = parseDurationMs(cfg.ttl, { defaultUnit: "m" });
	} catch {}
	if (typeof cfg.keepLastAssistants === "number" && Number.isFinite(cfg.keepLastAssistants)) s.keepLastAssistants = Math.max(0, Math.floor(cfg.keepLastAssistants));
	if (typeof cfg.softTrimRatio === "number" && Number.isFinite(cfg.softTrimRatio)) s.softTrimRatio = Math.min(1, Math.max(0, cfg.softTrimRatio));
	if (typeof cfg.hardClearRatio === "number" && Number.isFinite(cfg.hardClearRatio)) s.hardClearRatio = Math.min(1, Math.max(0, cfg.hardClearRatio));
	if (typeof cfg.minPrunableToolChars === "number" && Number.isFinite(cfg.minPrunableToolChars)) s.minPrunableToolChars = Math.max(0, Math.floor(cfg.minPrunableToolChars));
	if (cfg.tools) s.tools = cfg.tools;
	if (cfg.softTrim) {
		if (typeof cfg.softTrim.maxChars === "number" && Number.isFinite(cfg.softTrim.maxChars)) s.softTrim.maxChars = Math.max(0, Math.floor(cfg.softTrim.maxChars));
		if (typeof cfg.softTrim.headChars === "number" && Number.isFinite(cfg.softTrim.headChars)) s.softTrim.headChars = Math.max(0, Math.floor(cfg.softTrim.headChars));
		if (typeof cfg.softTrim.tailChars === "number" && Number.isFinite(cfg.softTrim.tailChars)) s.softTrim.tailChars = Math.max(0, Math.floor(cfg.softTrim.tailChars));
	}
	if (cfg.hardClear) {
		if (typeof cfg.hardClear.enabled === "boolean") s.hardClear.enabled = cfg.hardClear.enabled;
		if (typeof cfg.hardClear.placeholder === "string" && cfg.hardClear.placeholder.trim()) s.hardClear.placeholder = cfg.hardClear.placeholder.trim();
	}
	return s;
}
//#endregion
//#region src/agents/embedded-agent-runner/extensions.ts
/**
* Builds extension factories available to embedded-agent runtime sessions.
*/
function recordFromUnknown(value) {
	return value && typeof value === "object" && !Array.isArray(value) ? value : {};
}
function snapshotToolSendReceipt(details) {
	const toolSend = recordFromUnknown(details).toolSend;
	return toolSend && typeof toolSend === "object" && !Array.isArray(toolSend) ? { ...toolSend } : toolSend;
}
function buildAgentToolResultMiddlewareFactory(sessionManager, runId) {
	const runner = createAgentToolResultMiddlewareRunner({ runtime: "openclaw" });
	return (agent) => {
		agent.on("tool_result", async (rawEvent, ctx) => {
			const event = recordFromUnknown(rawEvent);
			if (!event.toolName) return;
			const eventToolCallId = typeof event.toolCallId === "string" && event.toolCallId.trim() ? event.toolCallId : void 0;
			const toolCallId = eventToolCallId ?? `openclaw-${randomUUID()}`;
			const current = {
				content: Array.isArray(event.content) ? event.content : [],
				details: event.details
			};
			const rawToolSend = snapshotToolSendReceipt(current.details);
			if (eventToolCallId && rawToolSend !== void 0) recordEmbeddedToolSendReceipt(sessionManager, eventToolCallId, rawToolSend);
			const inputHadErrorStatus = isToolResultError(current);
			const adjustedInput = eventToolCallId ? peekAdjustedParamsForToolCall(eventToolCallId, runId) : void 0;
			const result = await runner.applyToolResultMiddleware({
				threadId: event.threadId,
				turnId: event.turnId,
				toolCallId,
				toolName: event.toolName,
				args: recordFromUnknown(adjustedInput ?? event.input),
				cwd: ctx.cwd,
				isError: event.isError,
				result: current
			});
			const isError = event.isError === true || inputHadErrorStatus || isToolResultError(result);
			if (eventToolCallId) finalizeToolTerminalPresentation({
				toolCallId: eventToolCallId,
				runId,
				result,
				isError
			});
			return {
				content: result.content,
				details: result.details,
				...isError ? { isError: true } : {}
			};
		});
	};
}
function resolveContextWindowTokens(params) {
	return resolveContextWindowInfo({
		cfg: params.cfg,
		provider: params.provider,
		modelId: params.modelId,
		modelContextTokens: params.model?.contextTokens,
		modelContextWindow: params.model?.contextWindow,
		defaultTokens: DEFAULT_CONTEXT_TOKENS
	}).tokens;
}
function buildContextPruningFactory(params) {
	const raw = params.cfg?.agents?.defaults?.contextPruning;
	if (raw?.mode !== "cache-ttl") return;
	if (!isCacheTtlEligibleProvider(params.provider, params.modelId, params.model?.api)) return;
	const settings = computeEffectiveSettings(raw);
	if (!settings) return;
	const transcriptPolicy = resolveTranscriptPolicy({
		modelApi: params.model?.api,
		provider: params.provider,
		modelId: params.modelId
	});
	setContextPruningRuntime(params.sessionManager, {
		settings,
		contextWindowTokens: resolveContextWindowTokens(params),
		isToolPrunable: makeToolPrunablePredicate(settings.tools),
		dropThinkingBlocks: transcriptPolicy.dropThinkingBlocks,
		lastCacheTouchAt: readLastCacheTtlTimestamp(params.sessionManager, {
			provider: params.provider,
			modelId: params.modelId
		})
	});
	return contextPruningExtension;
}
function buildEmbeddedExtensionFactories(params) {
	const factories = [];
	if (resolveEffectiveCompactionMode(params.cfg) === "safeguard") {
		const compactionCfg = params.cfg?.agents?.defaults?.compaction;
		const qualityGuardCfg = compactionCfg?.qualityGuard;
		const contextWindowInfo = resolveContextWindowInfo({
			cfg: params.cfg,
			provider: params.provider,
			modelId: params.modelId,
			modelContextTokens: params.model?.contextTokens,
			modelContextWindow: params.model?.contextWindow,
			defaultTokens: DEFAULT_CONTEXT_TOKENS
		});
		setCompactionSafeguardRuntime(params.sessionManager, {
			maxHistoryShare: compactionCfg?.maxHistoryShare,
			contextWindowTokens: contextWindowInfo.tokens,
			identifierPolicy: compactionCfg?.identifierPolicy,
			identifierInstructions: compactionCfg?.identifierInstructions,
			customInstructions: compactionCfg?.customInstructions,
			qualityGuardEnabled: qualityGuardCfg?.enabled ?? true,
			qualityGuardMaxRetries: qualityGuardCfg?.maxRetries,
			model: params.model,
			recentTurnsPreserve: compactionCfg?.recentTurnsPreserve,
			workspaceDir: params.workspaceDir,
			postCompactionSections: compactionCfg?.postCompactionSections,
			provider: compactionCfg?.provider
		});
		factories.push(compactionSafeguardExtension);
	}
	const pruningFactory = buildContextPruningFactory(params);
	if (pruningFactory) factories.push(pruningFactory);
	factories.push(buildAgentToolResultMiddlewareFactory(params.sessionManager, params.runId));
	return factories;
}
//#endregion
//#region src/agents/embedded-agent-runner/history.ts
/**
* Limits embedded-agent history length from session-key policy.
*/
const THREAD_SUFFIX_REGEX = /^(.*)(?::(?:thread|topic):\d+)$/i;
function stripThreadSuffix(value) {
	return value.match(THREAD_SUFFIX_REGEX)?.[1] ?? value;
}
/**
* Limits conversation history to the last N user turns (and their associated
* assistant responses). This reduces token usage for long-running DM sessions.
*/
function limitHistoryTurns(messages, limit) {
	if (!limit || limit <= 0 || messages.length === 0) return messages;
	let userCount = 0;
	let lastUserIndex = messages.length;
	for (let i = messages.length - 1; i >= 0; i--) if (messages[i].role === "user") {
		userCount++;
		if (userCount > limit) return messages.slice(lastUserIndex);
		lastUserIndex = i;
	}
	return messages;
}
/**
* Extract provider + user ID from a session key and look up dmHistoryLimit.
* Supports per-DM overrides and provider defaults.
* For channel/group sessions, uses historyLimit from provider config.
*/
function getHistoryLimitFromSessionKey(sessionKey, config) {
	if (!sessionKey || !config) return;
	const parts = sessionKey.split(":").filter(Boolean);
	const providerParts = parts.length >= 3 && parts[0] === "agent" ? parts.slice(2) : parts;
	const provider = normalizeProviderId(providerParts[0] ?? "");
	if (!provider) return;
	const kind = normalizeOptionalLowercaseString(providerParts[1]);
	const userId = stripThreadSuffix(providerParts.slice(2).join(":"));
	const resolveProviderConfig = (cfg, providerId) => {
		const channels = cfg?.channels;
		if (!channels || typeof channels !== "object") return;
		for (const [configuredProviderId, value] of Object.entries(channels)) {
			if (normalizeProviderId(configuredProviderId) !== providerId) continue;
			if (!value || typeof value !== "object" || Array.isArray(value)) return;
			return value;
		}
	};
	const providerConfig = resolveProviderConfig(config, provider);
	if (!providerConfig) return;
	if (kind === "dm" || kind === "direct") {
		if (userId && providerConfig.dms?.[userId]?.historyLimit !== void 0) return providerConfig.dms[userId].historyLimit;
		return providerConfig.dmHistoryLimit;
	}
	if (kind === "channel" || kind === "group") return providerConfig.historyLimit;
}
//#endregion
//#region src/agents/embedded-agent-runner/message-action-discovery-input.ts
/**
* Normalizes channel/session/message context before message-action discovery.
*
* Discovery expects absent optional fields as `undefined`; preserving nulls would create
* different cache/input shapes for the same missing runtime fact.
*/
/** Collect the current sender/channel hints used to discover message actions. */
function buildEmbeddedMessageActionDiscoveryInput(params) {
	return {
		cfg: params.cfg,
		channel: params.channel,
		currentChannelId: params.currentChannelId ?? void 0,
		currentThreadTs: params.currentThreadTs ?? void 0,
		currentMessageId: params.currentMessageId ?? void 0,
		accountId: params.accountId ?? void 0,
		sessionKey: params.sessionKey ?? void 0,
		sessionId: params.sessionId ?? void 0,
		agentId: params.agentId ?? void 0,
		requesterSenderId: params.senderId ?? void 0,
		senderIsOwner: params.senderIsOwner ?? void 0
	};
}
//#endregion
//#region src/agents/embedded-agent-runner/replay-history.ts
/**
* Sanitizes and validates replayed session history before model calls.
*/
const MODEL_SNAPSHOT_CUSTOM_TYPE = "model-snapshot";
function createProviderReplayPluginParams(params) {
	const context = {
		config: params.config,
		workspaceDir: params.workspaceDir,
		env: params.env,
		provider: params.provider,
		modelId: params.modelId,
		modelApi: params.modelApi,
		model: params.model,
		sessionId: params.sessionId
	};
	return {
		provider: params.provider,
		config: params.config,
		workspaceDir: params.workspaceDir,
		env: params.env,
		context
	};
}
function annotateInterSessionUserMessages(messages) {
	let touched = false;
	const out = [];
	for (const msg of messages) {
		if (!hasInterSessionUserProvenance(msg)) {
			out.push(msg);
			continue;
		}
		const provenance = normalizeInputProvenance(msg.provenance);
		const user = msg;
		if (typeof user.content === "string") {
			const annotated = annotateInterSessionPromptText(user.content, provenance);
			if (annotated === user.content) {
				out.push(msg);
				continue;
			}
			touched = true;
			out.push({
				...msg,
				content: annotated
			});
			continue;
		}
		if (!Array.isArray(user.content)) {
			out.push(msg);
			continue;
		}
		const textIndex = user.content.findIndex((block) => block && typeof block === "object" && block.type === "text" && typeof block.text === "string");
		if (textIndex >= 0) {
			const existing = user.content[textIndex];
			const annotated = annotateInterSessionPromptText(existing.text, provenance);
			if (annotated === existing.text) {
				out.push(msg);
				continue;
			}
			const nextContent = [...user.content];
			nextContent[textIndex] = {
				...existing,
				text: annotated
			};
			touched = true;
			out.push({
				...msg,
				content: nextContent
			});
			continue;
		}
		touched = true;
		out.push({
			...msg,
			content: [{
				type: "text",
				text: annotateInterSessionPromptText("Inter-session content follows.", provenance)
			}, ...user.content]
		});
	}
	return touched ? out : messages;
}
function sanitizeUserReplayContent(message) {
	if (!message || message.role !== "user") return message;
	const replayContent = message.content;
	if (typeof replayContent === "string") return replayContent.trim() ? message : null;
	if (!Array.isArray(replayContent)) return message;
	let touched = false;
	const sanitizedContent = replayContent.filter((block) => {
		if (!block || typeof block !== "object") return true;
		if (block.type !== "text") return true;
		const text = block.text;
		if (typeof text !== "string" || text.trim().length > 0) return true;
		touched = true;
		return false;
	});
	if (sanitizedContent.length === 0) return null;
	return touched ? {
		...message,
		content: sanitizedContent
	} : message;
}
function normalizeAssistantReplayTextContent(message, replayContent) {
	const strippedText = stripInternalMetadataForDisplay(replayContent);
	const trimmed = strippedText.trim();
	if (!trimmed || isSilentReplyPayloadText(trimmed, "NO_REPLY")) return null;
	return {
		...message,
		content: [{
			type: "text",
			text: strippedText
		}]
	};
}
function normalizeAssistantReplayBlockContent(message, replayContent) {
	let touched = false;
	const sanitizedContent = [];
	for (const block of replayContent) {
		if (!block || typeof block !== "object") {
			sanitizedContent.push(block);
			continue;
		}
		const text = block.text;
		if (typeof text !== "string") {
			sanitizedContent.push(block);
			continue;
		}
		const strippedText = stripInternalMetadataForDisplay(text);
		if (strippedText === text) {
			if (!isSilentReplyPayloadText(text.trim(), "NO_REPLY")) sanitizedContent.push(block);
			else touched = true;
			continue;
		}
		touched = true;
		const trimmed = strippedText.trim();
		if (trimmed && !isSilentReplyPayloadText(trimmed, "NO_REPLY")) sanitizedContent.push({
			...block,
			text: strippedText
		});
	}
	if (!touched) return message;
	if (sanitizedContent.length === 0) return null;
	return {
		...message,
		content: sanitizedContent
	};
}
function normalizeAssistantReplayContent(messages) {
	let touched = false;
	const out = [];
	for (const message of messages) {
		if (message?.role === "user") {
			const sanitizedUserMessage = sanitizeUserReplayContent(message);
			if (sanitizedUserMessage) out.push(sanitizedUserMessage);
			if (sanitizedUserMessage !== message) touched = true;
			continue;
		}
		if (!message || message.role !== "assistant") {
			out.push(message);
			continue;
		}
		if (isTranscriptOnlyOpenClawAssistantMessage$1(message)) {
			touched = true;
			continue;
		}
		let assistantMessage = message;
		let replayContent = message.content;
		if (typeof replayContent === "string") {
			const normalized = normalizeAssistantReplayTextContent(message, replayContent);
			if (normalized) out.push(normalized);
			touched = true;
			continue;
		}
		if (!Array.isArray(replayContent)) {
			replayContent = replayContent != null && typeof replayContent === "object" ? [replayContent] : [];
			assistantMessage = {
				...message,
				content: replayContent
			};
			touched = true;
		}
		if (Array.isArray(replayContent)) {
			const normalized = normalizeAssistantReplayBlockContent(assistantMessage, replayContent);
			if (normalized !== assistantMessage) {
				touched = true;
				if (!normalized) continue;
				assistantMessage = normalized;
				replayContent = assistantMessage.content;
			}
		}
		if (isReasoningOnlyLengthAssistantTurn(assistantMessage)) {
			touched = true;
			continue;
		}
		if (Array.isArray(replayContent) && replayContent.length === 0) {
			if (assistantMessage.stopReason === "error" || isZeroUsageEmptyStopAssistantTurn(assistantMessage)) {
				out.push({
					...assistantMessage,
					content: [{
						type: "text",
						text: STREAM_ERROR_FALLBACK_TEXT
					}]
				});
				touched = true;
				continue;
			}
		}
		out.push(assistantMessage);
	}
	while (out.length > 0) {
		const last = out[out.length - 1];
		if (!isReplayDroppableTrailingAssistant(last)) break;
		out.pop();
		touched = true;
	}
	return touched ? out : messages;
}
function isReplayDroppableTrailingAssistant(message) {
	if (!message || message.role !== "assistant") return false;
	const content = message.content;
	if (!Array.isArray(content)) return false;
	if (content.length === 0) return message.stopReason === "error" || isZeroUsageEmptyStopAssistantTurn(message);
	if (!isStreamErrorSentinelContent(content)) return false;
	const stopReason = message.stopReason;
	if (stopReason === "error") return true;
	return isZeroUsageEmptyStopAssistantTurn({
		stopReason,
		usage: message.usage,
		content: []
	});
}
function isStreamErrorSentinelContent(content) {
	if (content.length !== 1) return false;
	const block = content[0];
	if (!block || typeof block !== "object") return false;
	const blockRecord = block;
	return blockRecord.type === "text" && blockRecord.text === "[assistant turn failed before producing content]";
}
function normalizeAssistantUsageSnapshot(usage) {
	const normalized = normalizeUsage(usage ?? void 0);
	if (!normalized) return makeZeroUsageSnapshot();
	const input = normalized.input ?? 0;
	const output = normalized.output ?? 0;
	const cacheRead = normalized.cacheRead ?? 0;
	const cacheWrite = normalized.cacheWrite ?? 0;
	const totalTokens = normalized.total ?? input + output + cacheRead + cacheWrite;
	const cost = normalizeAssistantUsageCost(usage);
	return {
		input,
		output,
		cacheRead,
		cacheWrite,
		totalTokens,
		...cost ? { cost } : {}
	};
}
function normalizeAssistantUsageCost(usage) {
	const base = makeZeroUsageSnapshot().cost;
	if (!usage || typeof usage !== "object") return;
	const rawCost = usage.cost;
	if (!rawCost || typeof rawCost !== "object") return;
	const cost = rawCost;
	const inputRaw = toFiniteCostNumber(cost.input);
	const outputRaw = toFiniteCostNumber(cost.output);
	const cacheReadRaw = toFiniteCostNumber(cost.cacheRead);
	const cacheWriteRaw = toFiniteCostNumber(cost.cacheWrite);
	const totalRaw = toFiniteCostNumber(cost.total);
	if (inputRaw === void 0 && outputRaw === void 0 && cacheReadRaw === void 0 && cacheWriteRaw === void 0 && totalRaw === void 0) return;
	const input = inputRaw ?? base.input;
	const output = outputRaw ?? base.output;
	const cacheRead = cacheReadRaw ?? base.cacheRead;
	const cacheWrite = cacheWriteRaw ?? base.cacheWrite;
	return {
		input,
		output,
		cacheRead,
		cacheWrite,
		total: totalRaw ?? input + output + cacheRead + cacheWrite
	};
}
function toFiniteCostNumber(value) {
	return typeof value === "number" && Number.isFinite(value) ? value : void 0;
}
function ensureAssistantUsageSnapshots(messages) {
	if (messages.length === 0) return messages;
	let touched = false;
	const out = [...messages];
	for (let i = 0; i < out.length; i += 1) {
		const message = out[i];
		if (!message || message.role !== "assistant") continue;
		const normalizedUsage = normalizeAssistantUsageSnapshot(message.usage);
		const usageCost = message.usage && typeof message.usage === "object" ? message.usage.cost : void 0;
		const normalizedCost = normalizedUsage.cost;
		if (message.usage && typeof message.usage === "object" && message.usage.input === normalizedUsage.input && message.usage.output === normalizedUsage.output && message.usage.cacheRead === normalizedUsage.cacheRead && message.usage.cacheWrite === normalizedUsage.cacheWrite && message.usage.totalTokens === normalizedUsage.totalTokens && (normalizedCost && usageCost && typeof usageCost === "object" && usageCost.input === normalizedCost.input && usageCost.output === normalizedCost.output && usageCost.cacheRead === normalizedCost.cacheRead && usageCost.cacheWrite === normalizedCost.cacheWrite && usageCost.total === normalizedCost.total || !normalizedCost && usageCost === void 0)) continue;
		out[i] = {
			...message,
			usage: normalizedUsage
		};
		touched = true;
	}
	return touched ? out : messages;
}
function createProviderReplaySessionState(sessionManager) {
	return {
		getCustomEntries() {
			try {
				const customEntries = [];
				for (const entry of sessionManager.getEntries()) {
					const candidate = entry;
					if (candidate?.type !== "custom" || typeof candidate.customType !== "string") continue;
					const customType = candidate.customType.trim();
					if (!customType) continue;
					customEntries.push({
						customType,
						data: candidate.data
					});
				}
				return customEntries;
			} catch {
				return [];
			}
		},
		appendCustomEntry(customType, data) {
			try {
				sessionManager.appendCustomEntry(customType, data);
			} catch {}
		}
	};
}
function readLastModelSnapshot(sessionManager) {
	try {
		const entries = sessionManager.getEntries();
		for (let i = entries.length - 1; i >= 0; i -= 1) {
			const entry = entries[i];
			if (entry?.type !== "custom" || entry?.customType !== MODEL_SNAPSHOT_CUSTOM_TYPE) continue;
			const data = entry?.data;
			if (data && typeof data === "object") return data;
		}
	} catch {
		return null;
	}
	return null;
}
function appendModelSnapshot(sessionManager, data) {
	try {
		sessionManager.appendCustomEntry(MODEL_SNAPSHOT_CUSTOM_TYPE, data);
	} catch {}
}
function isSameModelSnapshot(a, b) {
	const normalize = (value) => value ?? "";
	return normalize(a.provider) === normalize(b.provider) && normalize(a.modelApi) === normalize(b.modelApi) && normalize(a.modelId) === normalize(b.modelId);
}
function formatOpenAIResponsesReplayInvariantError(params) {
	const toolCallId = params.toolCallId ? ` toolCallId=${params.toolCallId}` : "";
	return /* @__PURE__ */ new Error(`invalid_replay_transcript: OpenAI Responses replay contains ${params.reason}${toolCallId} at message index ${params.messageIndex}`);
}
function assertOpenAIResponsesToolUseResultInvariant(messages) {
	const pending = /* @__PURE__ */ new Map();
	for (let i = 0; i < messages.length; i += 1) {
		const message = messages[i];
		const role = message?.role;
		if (pending.size > 0 && role !== "toolResult") {
			const [toolCallId, meta] = pending.entries().next().value;
			throw formatOpenAIResponsesReplayInvariantError({
				reason: "dangling_tool_call",
				toolCallId,
				messageIndex: meta.messageIndex
			});
		}
		if (!message || typeof message !== "object") continue;
		if (role === "toolResult") {
			const toolCallId = extractToolResultId(message);
			if (!toolCallId || !pending.has(toolCallId)) throw formatOpenAIResponsesReplayInvariantError({
				reason: "orphan_tool_result",
				...toolCallId ? { toolCallId } : {},
				messageIndex: i
			});
			pending.delete(toolCallId);
			continue;
		}
		if (role !== "assistant") continue;
		for (const toolCall of extractToolCallsFromAssistant(message)) pending.set(toolCall.id, { messageIndex: i });
	}
	if (pending.size > 0) {
		const [toolCallId, meta] = pending.entries().next().value;
		throw formatOpenAIResponsesReplayInvariantError({
			reason: "dangling_tool_call",
			toolCallId,
			messageIndex: meta.messageIndex
		});
	}
	return messages;
}
/**
* Applies the generic replay-history cleanup pipeline before provider-owned
* replay hooks run.
*/
async function sanitizeSessionHistory(params) {
	const policy = params.policy ?? resolveTranscriptPolicy({
		modelApi: params.modelApi,
		provider: params.provider,
		modelId: params.modelId,
		config: params.config,
		workspaceDir: params.workspaceDir,
		env: params.env,
		model: params.model
	});
	const withInterSessionMarkers = annotateInterSessionUserMessages(params.messages);
	const signedThinkingProvider = providerRequiresSignedThinking(params.provider);
	const allowProviderOwnedThinkingReplay = shouldAllowProviderOwnedThinkingReplay({
		modelApi: params.modelApi,
		provider: params.provider,
		policy
	});
	const isOpenAIResponsesApi = params.modelApi === "openai-responses" || params.modelApi === "openai-chatgpt-responses" || params.modelApi === "azure-openai-responses";
	const hasSnapshot = Boolean(params.provider || params.modelApi || params.modelId);
	const priorSnapshot = hasSnapshot ? readLastModelSnapshot(params.sessionManager) : null;
	const modelChanged = priorSnapshot ? !isSameModelSnapshot(priorSnapshot, {
		timestamp: 0,
		provider: params.provider,
		modelApi: params.modelApi,
		modelId: params.modelId
	}) : false;
	const sanitizedImages = await sanitizeSessionMessagesImages(normalizeAssistantReplayContent(withInterSessionMarkers), "session:history", {
		sanitizeMode: policy.sanitizeMode,
		sanitizeToolCallIds: policy.sanitizeToolCallIds && !allowProviderOwnedThinkingReplay && !isOpenAIResponsesApi,
		toolCallIdMode: policy.toolCallIdMode,
		duplicateToolCallIdStyle: policy.duplicateToolCallIdStyle,
		preserveNativeAnthropicToolUseIds: policy.preserveNativeAnthropicToolUseIds,
		preserveSignatures: policy.preserveSignatures,
		sanitizeThoughtSignatures: policy.sanitizeThoughtSignatures,
		...resolveImageSanitizationLimits(params.config)
	});
	const preserveLatestAssistantThinking = params.preserveLatestAssistantThinking ?? shouldPreserveLatestAssistantThinking(sanitizedImages);
	const compactionStaleStripped = signedThinkingProvider || policy.preserveSignatures ? stripStaleThinkingSignaturesForCompactionReplay(sanitizedImages) : sanitizedImages;
	const validatedThinkingSignatures = signedThinkingProvider || policy.preserveSignatures ? stripInvalidThinkingSignatures(compactionStaleStripped, { preserveLatestAssistant: preserveLatestAssistantThinking }) : compactionStaleStripped;
	const droppedReasoning = policy.dropReasoningFromHistory ? dropReasoningFromHistory(validatedThinkingSignatures) : validatedThinkingSignatures;
	const sanitizedToolCalls = sanitizeToolCallInputs(policy.dropThinkingBlocks ? dropThinkingBlocks(droppedReasoning) : droppedReasoning, {
		allowedToolNames: params.allowedToolNames,
		allowProviderOwnedThinkingReplay
	});
	const openAIRepairedToolCalls = isOpenAIResponsesApi && policy.repairToolUseResultPairing ? sanitizeToolUseResultPairing(sanitizedToolCalls, {
		erroredAssistantResultPolicy: "drop",
		missingToolResultText: "aborted"
	}) : sanitizedToolCalls;
	const openAISafeToolCalls = isOpenAIResponsesApi ? downgradeOpenAIFunctionCallReasoningPairs(normalizeOpenAIResponsesToolCallIds(downgradeOpenAIReasoningBlocks(openAIRepairedToolCalls, { dropReplayableReasoning: modelChanged }))) : sanitizedToolCalls;
	const sanitizedToolIds = policy.sanitizeToolCallIds && policy.toolCallIdMode ? sanitizeToolCallIdsForCloudCodeAssist(openAISafeToolCalls, policy.toolCallIdMode, {
		preserveNativeAnthropicToolUseIds: policy.preserveNativeAnthropicToolUseIds,
		duplicateToolCallIdStyle: policy.duplicateToolCallIdStyle,
		preserveReplaySafeThinkingToolCallIds: allowProviderOwnedThinkingReplay,
		allowedToolNames: params.allowedToolNames
	}) : openAISafeToolCalls;
	const sanitizedCompactionUsage = ensureAssistantUsageSnapshots(stripStaleAssistantUsageBeforeLatestCompaction(stripToolResultDetails(!isOpenAIResponsesApi && policy.repairToolUseResultPairing ? sanitizeToolUseResultPairing(sanitizedToolIds, { erroredAssistantResultPolicy: "drop" }) : sanitizedToolIds)));
	const provider = params.provider?.trim();
	let providerSanitized;
	if (provider && provider.length > 0) {
		const pluginParams = createProviderReplayPluginParams({
			...params,
			provider
		});
		providerSanitized = await sanitizeProviderReplayHistoryWithPlugin({
			...pluginParams,
			context: {
				...pluginParams.context,
				sessionId: params.sessionId ?? "",
				messages: sanitizedCompactionUsage,
				allowedToolNames: params.allowedToolNames,
				sessionState: createProviderReplaySessionState(params.sessionManager)
			}
		}) ?? void 0;
	}
	const sanitizedWithProvider = providerSanitized ?? sanitizedCompactionUsage;
	const responsesProviderRepaired = isOpenAIResponsesApi && policy.repairToolUseResultPairing ? sanitizeToolUseResultPairing(sanitizedWithProvider, {
		erroredAssistantResultPolicy: "drop",
		missingToolResultText: "aborted"
	}) : sanitizedWithProvider;
	const responsesInvariantChecked = isOpenAIResponsesApi ? assertOpenAIResponsesToolUseResultInvariant(responsesProviderRepaired) : responsesProviderRepaired;
	if (hasSnapshot && (!priorSnapshot || modelChanged)) appendModelSnapshot(params.sessionManager, {
		timestamp: Date.now(),
		provider: params.provider,
		modelApi: params.modelApi,
		modelId: params.modelId
	});
	if (!policy.applyGoogleTurnOrdering) return responsesInvariantChecked;
	const googleOrdered = sanitizeGoogleTurnOrdering(responsesInvariantChecked);
	return isOpenAIResponsesApi ? assertOpenAIResponsesToolUseResultInvariant(googleOrdered) : googleOrdered;
}
/**
* Runs provider-owned replay validation before falling back to the remaining
* generic validator pipeline.
*/
async function validateReplayTurns(params) {
	const policy = params.policy ?? resolveTranscriptPolicy({
		modelApi: params.modelApi,
		provider: params.provider,
		modelId: params.modelId,
		config: params.config,
		workspaceDir: params.workspaceDir,
		env: params.env,
		model: params.model
	});
	const provider = params.provider?.trim();
	if (provider) {
		const pluginParams = createProviderReplayPluginParams({
			...params,
			provider
		});
		const providerValidated = await validateProviderReplayTurnsWithPlugin({
			...pluginParams,
			context: {
				...pluginParams.context,
				messages: params.messages
			}
		});
		if (providerValidated) return providerValidated;
	}
	const validatedGemini = policy.validateGeminiTurns ? validateGeminiTurns(params.messages) : params.messages;
	return policy.validateAnthropicTurns ? validateAnthropicTurns(validatedGemini) : validatedGemini;
}
//#endregion
//#region src/agents/embedded-agent-runner/resource-loader.ts
/**
* Creates the resource loader used by embedded-agent sessions.
*/
/** Discovery options that keep embedded sessions isolated from ambient local resources. */
const EMBEDDED_AGENT_RESOURCE_LOADER_DISCOVERY_OPTIONS = {
	noExtensions: true,
	noSkills: true,
	noPromptTemplates: true,
	noThemes: true,
	noContextFiles: true
};
/** Creates the constrained resource loader used by embedded-agent session construction. */
function createEmbeddedAgentResourceLoader(options) {
	return new DefaultResourceLoader({
		...options,
		...EMBEDDED_AGENT_RESOURCE_LOADER_DISCOVERY_OPTIONS
	});
}
//#endregion
//#region src/agents/embedded-agent-runner/session-manager-cache.ts
/**
* Caches and prewarms session managers used by embedded-agent runs.
*/
const DEFAULT_SESSION_MANAGER_TTL_MS = 45e3;
const MIN_SESSION_MANAGER_CACHE_PRUNE_INTERVAL_MS = 1e3;
const MAX_SESSION_MANAGER_CACHE_PRUNE_INTERVAL_MS = 3e4;
function getSessionManagerTtl() {
	return resolveCacheTtlMs({
		envValue: process.env.OPENCLAW_SESSION_MANAGER_CACHE_TTL_MS,
		defaultTtlMs: DEFAULT_SESSION_MANAGER_TTL_MS
	});
}
function resolveSessionManagerCachePruneInterval(ttlMs) {
	return Math.min(Math.max(ttlMs, MIN_SESSION_MANAGER_CACHE_PRUNE_INTERVAL_MS), MAX_SESSION_MANAGER_CACHE_PRUNE_INTERVAL_MS);
}
function createSessionManagerCache(options) {
	const getTtlMs = () => typeof options?.ttlMs === "function" ? options.ttlMs() : options?.ttlMs ?? getSessionManagerTtl();
	const cache = createExpiringMapCache({
		ttlMs: getTtlMs,
		pruneIntervalMs: resolveSessionManagerCachePruneInterval,
		clock: options?.clock
	});
	const fsModule = options?.fsModule ?? fs$1;
	return {
		clear: () => {
			cache.clear();
		},
		isSessionManagerCached: (sessionFile) => cache.get(sessionFile) === true,
		keys: () => cache.keys(),
		prewarmSessionFile: async (sessionFile) => {
			if (!isCacheEnabled(getTtlMs())) return;
			if (cache.get(sessionFile) === true) return;
			try {
				const handle = await fsModule.open(sessionFile, "r");
				try {
					const buffer = Buffer$1.alloc(4096);
					await handle.read(buffer, 0, buffer.length, 0);
				} finally {
					await handle.close();
				}
				cache.set(sessionFile, true);
			} catch {}
		},
		trackSessionManagerAccess: (sessionFile) => {
			cache.set(sessionFile, true);
		}
	};
}
const sessionManagerCache = createSessionManagerCache();
function trackSessionManagerAccess(sessionFile) {
	sessionManagerCache.trackSessionManagerAccess(sessionFile);
}
async function prewarmSessionFile(sessionFile) {
	await sessionManagerCache.prewarmSessionFile(sessionFile);
}
//#endregion
//#region src/agents/embedded-agent-runner/stream-resolution.ts
/**
* Resolves provider stream functions and API keys for embedded agents.
*/
let embeddedAgentBaseStreamFnCache = /* @__PURE__ */ new WeakMap();
function resolveEmbeddedAgentBaseStreamFn(params) {
	const cached = embeddedAgentBaseStreamFnCache.get(params.session);
	if (cached !== void 0 || embeddedAgentBaseStreamFnCache.has(params.session)) return cached;
	const baseStreamFn = params.session.agent.streamFn;
	embeddedAgentBaseStreamFnCache.set(params.session, baseStreamFn);
	return baseStreamFn;
}
function isDefaultOpenClawStreamFnForModel(model, streamFn) {
	if (!streamFn || streamFn === streamSimple) return true;
	const api = typeof model.api === "string" ? model.api.trim() : "";
	if (!api) return false;
	const provider = getApiProvider(api);
	return streamFn === provider?.streamSimple || streamFn === provider?.stream;
}
function hasResolvedRuntimeApiKey(apiKey) {
	return typeof apiKey === "string" && apiKey.trim().length > 0;
}
function isOpenAICodexResponsesModel(model) {
	return model.provider === "openai" && model.api === "openai-chatgpt-responses";
}
function resolveOpenClawNativeCodexResponsesStreamFn(params) {
	if (!isOpenAICodexResponsesModel(params.model)) return;
	if (!isDefaultOpenClawStreamFnForModel(params.model, params.currentStreamFn)) return;
	return params.currentStreamFn ?? streamSimple;
}
function describeEmbeddedAgentStreamStrategy(params) {
	if (params.providerStreamFn) return "provider";
	if (params.model.provider === "anthropic-vertex") return "anthropic-vertex";
	if (resolveOpenClawNativeCodexResponsesStreamFn({
		model: params.model,
		currentStreamFn: params.currentStreamFn
	})) return "openclaw-native-codex-responses";
	if (isDefaultOpenClawStreamFnForModel(params.model, params.currentStreamFn)) return createBoundaryAwareStreamFnForModel(params.model) ? `boundary-aware:${params.model.api}` : "stream-simple";
	if (hasResolvedRuntimeApiKey(params.resolvedApiKey) && createBoundaryAwareStreamFnForModel(params.model)) return `boundary-aware:${params.model.api}`;
	return "session-custom";
}
async function resolveEmbeddedAgentApiKey(params) {
	const resolvedApiKey = params.resolvedApiKey?.trim();
	if (resolvedApiKey) return resolvedApiKey;
	return params.authStorage ? await params.authStorage.getApiKey(params.provider) : void 0;
}
function resolveEmbeddedAgentStreamFn(params) {
	if (params.providerStreamFn) return wrapEmbeddedAgentStreamFn(params.providerStreamFn, {
		runSignal: params.signal,
		resolvedApiKey: params.resolvedApiKey,
		authProfileId: params.authProfileId,
		authStorage: params.authStorage,
		providerId: params.model.provider,
		promptCacheKey: params.promptCacheKey,
		transformContext: (context) => context.systemPrompt ? {
			...context,
			systemPrompt: stripSystemPromptCacheBoundary(context.systemPrompt)
		} : context
	});
	const currentStreamFn = params.currentStreamFn ?? streamSimple;
	if (params.model.provider === "anthropic-vertex") return createAnthropicVertexStreamFnForModel(params.model);
	const openClawNativeCodexResponsesStreamFn = resolveOpenClawNativeCodexResponsesStreamFn({
		model: params.model,
		currentStreamFn: params.currentStreamFn
	});
	if (openClawNativeCodexResponsesStreamFn) return wrapEmbeddedAgentStreamFn(openClawNativeCodexResponsesStreamFn, {
		runSignal: params.signal,
		resolvedApiKey: params.resolvedApiKey,
		authProfileId: params.authProfileId,
		authStorage: params.authStorage,
		providerId: params.model.provider,
		sessionId: params.sessionId,
		promptCacheKey: params.promptCacheKey,
		transformContext: (context) => context.systemPrompt ? {
			...context,
			systemPrompt: stripSystemPromptCacheBoundary(context.systemPrompt)
		} : context
	});
	if (isDefaultOpenClawStreamFnForModel(params.model, params.currentStreamFn) || hasResolvedRuntimeApiKey(params.resolvedApiKey)) {
		const boundaryAwareStreamFn = createBoundaryAwareStreamFnForModel(params.model);
		if (boundaryAwareStreamFn) return wrapEmbeddedAgentStreamFn(boundaryAwareStreamFn, {
			runSignal: params.signal,
			resolvedApiKey: params.resolvedApiKey,
			authProfileId: params.authProfileId,
			authStorage: params.authStorage,
			providerId: params.model.provider,
			promptCacheKey: params.promptCacheKey
		});
	}
	const promptCacheKey = params.promptCacheKey?.trim();
	if (!promptCacheKey) return currentStreamFn;
	return wrapEmbeddedAgentStreamFn(currentStreamFn, {
		runSignal: params.signal,
		resolvedApiKey: void 0,
		authProfileId: void 0,
		authStorage: void 0,
		providerId: params.model.provider,
		promptCacheKey
	});
}
function wrapEmbeddedAgentStreamFn(inner, params) {
	const transformContext = params.transformContext ?? ((context) => context);
	const mergeRunSignal = (options) => {
		const embeddedOptions = options;
		const signal = embeddedOptions?.signal ?? params.runSignal;
		let merged = params.sessionId && !embeddedOptions?.sessionId ? {
			...embeddedOptions,
			sessionId: params.sessionId
		} : embeddedOptions;
		const promptCacheKey = params.promptCacheKey?.trim();
		if (promptCacheKey && !merged?.promptCacheKey) merged = {
			...merged,
			promptCacheKey
		};
		if (params.authProfileId && !merged?.authProfileId) merged = {
			...merged,
			authProfileId: params.authProfileId
		};
		return signal ? {
			...merged,
			signal
		} : merged;
	};
	if (!params.authStorage && !params.resolvedApiKey) return (m, context, options) => inner(m, transformContext(context), mergeRunSignal(options));
	const { authStorage, providerId, resolvedApiKey } = params;
	return async (m, context, options) => {
		const apiKey = await resolveEmbeddedAgentApiKey({
			provider: providerId,
			resolvedApiKey,
			authStorage
		});
		return inner(m, transformContext(context), {
			...mergeRunSignal(options),
			apiKey: apiKey ?? options?.apiKey
		});
	};
}
//#endregion
//#region src/agents/embedded-agent-runner/system-prompt.ts
function buildEmbeddedSystemPrompt(params) {
	return buildConfiguredAgentSystemPrompt({
		config: params.config,
		agentId: params.agentId ?? params.runtimeInfo.agentId,
		workspaceDir: params.workspaceDir,
		defaultThinkLevel: params.defaultThinkLevel,
		reasoningLevel: params.reasoningLevel,
		extraSystemPrompt: params.extraSystemPrompt,
		ownerNumbers: params.ownerNumbers,
		ownerDisplay: params.ownerDisplay,
		ownerDisplaySecret: params.ownerDisplaySecret,
		reasoningTagHint: params.reasoningTagHint,
		heartbeatPrompt: params.heartbeatPrompt,
		skillsPrompt: params.skillsPrompt,
		docsPath: params.docsPath,
		sourcePath: params.sourcePath,
		ttsHint: params.ttsHint,
		workspaceNotes: params.workspaceNotes,
		reactionGuidance: params.reactionGuidance,
		promptMode: params.promptMode,
		silentReplyPromptMode: params.silentReplyPromptMode,
		sourceReplyDeliveryMode: params.sourceReplyDeliveryMode,
		subagentDelegationMode: params.subagentDelegationMode,
		acpEnabled: params.acpEnabled,
		promptSurface: params.promptSurface,
		nativeCommandNames: params.nativeCommandNames,
		nativeCommandGuidanceLines: params.nativeCommandGuidanceLines,
		runtimeInfo: params.runtimeInfo,
		messageToolHints: params.messageToolHints,
		toolSchemaDirectoryPrompt: params.toolSchemaDirectoryPrompt,
		sandboxInfo: params.sandboxInfo,
		toolNames: params.tools.map((tool) => tool.name),
		capabilityToolNames: params.capabilityToolNames,
		modelAliasLines: params.modelAliasLines,
		userTimezone: params.userTimezone,
		userTime: params.userTime,
		userTimeFormat: params.userTimeFormat,
		contextFiles: params.contextFiles,
		bootstrapMode: params.bootstrapMode,
		bootstrapTruncationNotice: params.bootstrapTruncationNotice,
		includeMemorySection: params.includeMemorySection,
		memoryCitationsMode: params.memoryCitationsMode,
		promptContribution: params.promptContribution
	});
}
function applySystemPromptToSession(session, systemPrompt) {
	session.setBaseSystemPrompt(systemPrompt.trim());
}
//#endregion
//#region src/agents/embedded-agent-runner/tool-name-allowlist.ts
/**
* OpenClaw built-in tools that remain present in the embedded runtime even when
* OpenClaw routes execution through custom tool definitions.
*/
const AGENT_RESERVED_TOOL_NAMES = [
	"bash",
	"edit",
	"find",
	"grep",
	"ls",
	"read",
	"write"
];
function addName(names, value) {
	if (typeof value !== "string") return;
	const trimmed = value.trim();
	if (trimmed) names.add(trimmed);
}
function collectAllowedToolNames(params) {
	const names = /* @__PURE__ */ new Set();
	for (const tool of params.tools) addName(names, tool.name);
	for (const tool of params.clientTools ?? []) addName(names, tool.function?.name);
	return names;
}
/**
* Collect the exact tool names registered with the embedded agent for this session.
*/
function collectRegisteredToolNames(tools) {
	const names = /* @__PURE__ */ new Set();
	for (const tool of tools) addName(names, tool.name);
	return names;
}
function collectCoreBuiltinToolNames(tools, options) {
	const names = /* @__PURE__ */ new Set();
	for (const tool of tools) {
		if (options?.isPluginTool?.(tool)) continue;
		addName(names, tool.name);
	}
	return names;
}
function toSessionToolAllowlist(allowedToolNames) {
	return [...new Set(allowedToolNames)].toSorted((a, b) => a.localeCompare(b));
}
//#endregion
//#region src/agents/embedded-agent-runner/utils.ts
function normalizeContextTokenBudget(value) {
	return typeof value === "number" && Number.isFinite(value) && value > 0 ? Math.floor(value) : void 0;
}
function mapThinkingLevel(level) {
	if (!level) return "off";
	if (level === "adaptive") return "high";
	return level;
}
//#endregion
//#region src/agents/embedded-agent-runner/wait-for-idle-before-flush.ts
/**
* Waits for tool-result streams to become idle before flushing output.
*/
const DEFAULT_WAIT_FOR_IDLE_TIMEOUT_MS = 3e4;
async function waitForAgentIdleBestEffort(agent, timeoutMs) {
	const waitForIdle = agent?.waitForIdle;
	if (typeof waitForIdle !== "function") return false;
	const resolvedTimeoutMs = resolveTimerTimeoutMs(timeoutMs, DEFAULT_WAIT_FOR_IDLE_TIMEOUT_MS);
	const idleResolved = Symbol("idle");
	const idleTimedOut = Symbol("timeout");
	let timeoutHandle;
	try {
		return await Promise.race([waitForIdle.call(agent).then(() => idleResolved), new Promise((resolve) => {
			timeoutHandle = setTimeout(() => resolve(idleTimedOut), resolvedTimeoutMs);
			timeoutHandle.unref?.();
		})]) === idleTimedOut;
	} catch {
		return false;
	} finally {
		if (timeoutHandle) clearTimeout(timeoutHandle);
	}
}
async function flushPendingToolResultsAfterIdle(opts) {
	if (!(opts.timeoutMs !== void 0 && opts.timeoutMs <= 0)) await waitForAgentIdleBestEffort(opts.agent, opts.timeoutMs ?? DEFAULT_WAIT_FOR_IDLE_TIMEOUT_MS);
	opts.sessionManager?.flushPendingToolResults?.();
}
//#endregion
//#region src/agents/embedded-agent-runner/run/attempt.model-diagnostic-events.ts
/**
* Emits diagnostic model-call events around embedded-agent stream functions.
*/
const MODEL_CALL_STREAM_PROGRESS_INTERVAL_MS = 3e4;
const MODEL_CALL_STREAM_PROGRESS_REASON = "model_call:stream_progress";
const MODEL_CALL_STREAM_RETURN_TIMEOUT_MS = 1e3;
const TRACEPARENT_HEADER_NAME = "traceparent";
function utf8JsonByteLength(value) {
	try {
		return Buffer.byteLength(JSON.stringify(value), "utf8");
	} catch {
		return;
	}
}
function assignRequestPayloadBytes(state, payload) {
	const bytes = utf8JsonByteLength(payload);
	if (bytes !== void 0) state.requestPayloadBytes = bytes;
}
function utf8StringByteLength(value) {
	return Buffer.byteLength(value, "utf8");
}
function streamDeltaByteLength(chunk) {
	const type = chunk.type;
	if ((type === "text_delta" || type === "thinking_delta" || type === "toolcall_delta") && typeof chunk.delta === "string") return utf8StringByteLength(chunk.delta);
}
function responseStreamChunkByteLengthUnchecked(chunk) {
	if (!isRecord(chunk)) return utf8JsonByteLength(chunk);
	const deltaBytes = streamDeltaByteLength(chunk);
	if (deltaBytes !== void 0) return deltaBytes;
	if (!("partial" in chunk)) return utf8JsonByteLength(chunk);
	const { partial: _partial, ...snapshotlessChunk } = chunk;
	return utf8JsonByteLength(snapshotlessChunk);
}
function responseStreamChunkByteLength(chunk) {
	try {
		return responseStreamChunkByteLengthUnchecked(chunk);
	} catch {
		return;
	}
}
function streamContextModelContentFields(policy, streamContext) {
	if (!policy?.anyModelContent || !isRecord(streamContext)) return;
	const content = {
		...policy.inputMessages && Array.isArray(streamContext.messages) ? { inputMessages: cloneDiagnosticContentValue(streamContext.messages) } : {},
		...policy.systemPrompt && typeof streamContext.systemPrompt === "string" ? { systemPrompt: streamContext.systemPrompt } : {},
		...policy.toolDefinitions && Array.isArray(streamContext.tools) ? { toolDefinitions: cloneDiagnosticContentValue(streamContext.tools) } : {}
	};
	return Object.keys(content).length > 0 ? content : void 0;
}
function observeOutputMessageContent(state, chunk) {
	if (!state.contentCapture?.outputMessages || !isRecord(chunk)) return;
	const message = chunk.type === "done" ? chunk.message : chunk.type === "error" ? chunk.error : void 0;
	if (message !== void 0) state.outputMessages = [cloneDiagnosticContentValue(message)];
}
function observeResultMessageContent(state, startedAt, result) {
	state.timeToFirstByteMs ??= Math.max(0, Date.now() - startedAt);
	if (state.contentCapture?.outputMessages && state.outputMessages === void 0) state.outputMessages = [cloneDiagnosticContentValue(result)];
	if (state.responseStreamBytes === 0) {
		const bytes = utf8JsonByteLength(result);
		if (bytes !== void 0) state.responseStreamBytes = bytes;
	}
}
function observeResponseChunk(state, startedAt, chunk) {
	state.timeToFirstByteMs ??= Math.max(0, Date.now() - startedAt);
	observeOutputMessageContent(state, chunk);
	const bytes = responseStreamChunkByteLength(chunk);
	if (bytes !== void 0) state.responseStreamBytes += bytes;
}
function maybeEmitModelCallStreamProgress(eventBase, state) {
	if (!areDiagnosticsEnabledForProcess()) return;
	const now = Date.now();
	const progressFields = {
		runId: eventBase.runId,
		...eventBase.sessionKey ? { sessionKey: eventBase.sessionKey } : {},
		...eventBase.sessionId ? { sessionId: eventBase.sessionId } : {},
		reason: MODEL_CALL_STREAM_PROGRESS_REASON
	};
	markDiagnosticRunProgress(progressFields);
	if (state.lastStreamProgressAt !== void 0 && now - state.lastStreamProgressAt < MODEL_CALL_STREAM_PROGRESS_INTERVAL_MS) return;
	state.lastStreamProgressAt = now;
	emitTrustedDiagnosticEvent({
		type: "run.progress",
		...progressFields
	});
}
function modelCallSizeTimingFields(state) {
	return {
		...state.requestPayloadBytes !== void 0 ? { requestPayloadBytes: state.requestPayloadBytes } : {},
		...state.responseStreamBytes > 0 ? { responseStreamBytes: state.responseStreamBytes } : {},
		...state.timeToFirstByteMs !== void 0 ? { timeToFirstByteMs: state.timeToFirstByteMs } : {}
	};
}
function isPromiseLike(value) {
	if (value === null || typeof value !== "object" && typeof value !== "function") return false;
	try {
		return typeof value.then === "function";
	} catch {
		return false;
	}
}
function asyncIteratorFactory(value) {
	if (value === null || typeof value !== "object") return;
	try {
		const asyncIterator = value[Symbol.asyncIterator];
		if (typeof asyncIterator !== "function") return;
		return () => asyncIterator.call(value);
	} catch {
		return;
	}
}
function baseModelCallEvent(ctx, callId, trace) {
	return {
		runId: ctx.runId,
		callId,
		...ctx.sessionKey && { sessionKey: ctx.sessionKey },
		...ctx.sessionId && { sessionId: ctx.sessionId },
		provider: ctx.provider,
		model: ctx.model,
		...ctx.api && { api: ctx.api },
		...ctx.transport && { transport: ctx.transport },
		...ctx.contextTokenBudget ? { contextTokenBudget: ctx.contextTokenBudget } : {},
		...ctx.contextWindowSource ? { contextWindowSource: ctx.contextWindowSource } : {},
		...ctx.contextWindowReferenceTokens ? { contextWindowReferenceTokens: ctx.contextWindowReferenceTokens } : {},
		trace
	};
}
function modelContentPrivateData(modelContent) {
	return modelContent ? { modelContent } : void 0;
}
function modelCallCompletedContent(state) {
	if (!state.modelContent && !state.outputMessages) return;
	return {
		...state.modelContent,
		...state.outputMessages ? { outputMessages: state.outputMessages } : {}
	};
}
function modelCallErrorFields(err) {
	const upstreamRequestIdHash = diagnosticProviderRequestIdHash(err);
	const failureKind = diagnosticErrorFailureKind(err);
	return {
		errorCategory: diagnosticErrorCategory(err),
		...failureKind ? {
			failureKind,
			memory: processMemoryUsageSnapshot()
		} : {},
		...upstreamRequestIdHash ? { upstreamRequestIdHash } : {}
	};
}
function processMemoryUsageSnapshot() {
	try {
		const memory = process.memoryUsage();
		return {
			rssBytes: memory.rss,
			heapTotalBytes: memory.heapTotal,
			heapUsedBytes: memory.heapUsed,
			externalBytes: memory.external,
			arrayBuffersBytes: memory.arrayBuffers
		};
	} catch {
		return;
	}
}
function modelCallHookEventBase(eventBase) {
	return {
		runId: eventBase.runId,
		callId: eventBase.callId,
		...eventBase.sessionKey ? { sessionKey: eventBase.sessionKey } : {},
		...eventBase.sessionId ? { sessionId: eventBase.sessionId } : {},
		provider: eventBase.provider,
		model: eventBase.model,
		...eventBase.api ? { api: eventBase.api } : {},
		...eventBase.transport ? { transport: eventBase.transport } : {},
		...eventBase.contextTokenBudget ? { contextTokenBudget: eventBase.contextTokenBudget } : {},
		...eventBase.contextWindowSource ? { contextWindowSource: eventBase.contextWindowSource } : {},
		...eventBase.contextWindowReferenceTokens ? { contextWindowReferenceTokens: eventBase.contextWindowReferenceTokens } : {}
	};
}
function modelCallHookContext(eventBase) {
	return Object.freeze({
		runId: eventBase.runId,
		trace: eventBase.trace,
		...eventBase.sessionKey ? { sessionKey: eventBase.sessionKey } : {},
		...eventBase.sessionId ? { sessionId: eventBase.sessionId } : {},
		modelProviderId: eventBase.provider,
		modelId: eventBase.model,
		...eventBase.contextTokenBudget ? { contextTokenBudget: eventBase.contextTokenBudget } : {},
		...eventBase.contextWindowSource ? { contextWindowSource: eventBase.contextWindowSource } : {},
		...eventBase.contextWindowReferenceTokens ? { contextWindowReferenceTokens: eventBase.contextWindowReferenceTokens } : {}
	});
}
function dispatchModelCallStartedHook(eventBase) {
	const hookRunner = getGlobalHookRunner();
	if (!hookRunner?.hasHooks("model_call_started")) return;
	const event = Object.freeze(modelCallHookEventBase(eventBase));
	const hookCtx = modelCallHookContext(eventBase);
	fireAndForgetBoundedHook(() => hookRunner.runModelCallStarted(event, hookCtx), "model_call_started plugin hook failed");
}
function dispatchModelCallEndedHook(eventBase, fields) {
	const hookRunner = getGlobalHookRunner();
	if (!hookRunner?.hasHooks("model_call_ended")) return;
	const event = Object.freeze({
		...modelCallHookEventBase(eventBase),
		...fields
	});
	const hookCtx = modelCallHookContext(eventBase);
	fireAndForgetBoundedHook(() => hookRunner.runModelCallEnded(event, hookCtx), "model_call_ended plugin hook failed");
}
function emitModelCallStarted(eventBase, modelContent) {
	emitTrustedDiagnosticEventWithPrivateData({
		type: "model.call.started",
		...eventBase
	}, modelContentPrivateData(modelContent));
	dispatchModelCallStartedHook(eventBase);
}
function emitModelCallCompleted(eventBase, startedAt, state) {
	if (state.terminalEventEmitted) return;
	state.terminalEventEmitted = true;
	const durationMs = Date.now() - startedAt;
	const sizeTimingFields = modelCallSizeTimingFields(state);
	emitTrustedDiagnosticEventWithPrivateData({
		type: "model.call.completed",
		...eventBase,
		durationMs,
		...sizeTimingFields
	}, modelContentPrivateData(modelCallCompletedContent(state)));
	dispatchModelCallEndedHook(eventBase, {
		durationMs,
		outcome: "completed",
		...sizeTimingFields
	});
}
function emitModelCallError(eventBase, startedAt, state, fields) {
	if (state.terminalEventEmitted) return;
	state.terminalEventEmitted = true;
	const durationMs = Date.now() - startedAt;
	const sizeTimingFields = modelCallSizeTimingFields(state);
	emitTrustedDiagnosticEventWithPrivateData({
		type: "model.call.error",
		...eventBase,
		durationMs,
		...sizeTimingFields,
		...fields
	}, modelContentPrivateData(modelCallCompletedContent(state)));
	dispatchModelCallEndedHook(eventBase, {
		durationMs,
		outcome: "error",
		...sizeTimingFields,
		...fields
	});
}
function withDiagnosticTraceparentHeader(options, trace, state) {
	const traceparent = formatDiagnosticTraceparent(trace);
	const originalOnPayload = options?.onPayload;
	const onPayload = (payload, model) => {
		if (!originalOnPayload) {
			assignRequestPayloadBytes(state, payload);
			return;
		}
		const result = originalOnPayload(payload, model);
		if (isPromiseLike(result)) return result.then((replacement) => {
			assignRequestPayloadBytes(state, replacement ?? payload);
			return replacement;
		});
		assignRequestPayloadBytes(state, result ?? payload);
		return result;
	};
	if (!traceparent) return {
		...options,
		onPayload
	};
	const headers = {};
	for (const [key, value] of Object.entries(options?.headers ?? {})) {
		if (key.toLowerCase() === TRACEPARENT_HEADER_NAME) continue;
		headers[key] = value;
	}
	headers[TRACEPARENT_HEADER_NAME] = traceparent;
	return {
		...options,
		headers,
		onPayload
	};
}
async function safeReturnIterator(iterator) {
	let returnResult;
	try {
		returnResult = iterator.return?.();
	} catch {
		return;
	}
	if (!returnResult) return;
	let timeout;
	try {
		await Promise.race([Promise.resolve(returnResult).catch(() => void 0), new Promise((resolve) => {
			timeout = setTimeout(resolve, MODEL_CALL_STREAM_RETURN_TIMEOUT_MS);
			const unref = typeof timeout === "object" && timeout ? timeout.unref : void 0;
			if (unref) unref.call(timeout);
		})]);
	} finally {
		if (timeout) clearTimeout(timeout);
	}
}
async function* observeModelCallIterator(iterator, eventBase, startedAt, state) {
	let iteratorSettled = false;
	try {
		for (;;) {
			const next = await iterator.next();
			if (next.done) {
				iteratorSettled = true;
				break;
			}
			observeResponseChunk(state, startedAt, next.value);
			maybeEmitModelCallStreamProgress(eventBase, state);
			yield next.value;
		}
		emitModelCallCompleted(eventBase, startedAt, state);
	} catch (err) {
		iteratorSettled = true;
		emitModelCallError(eventBase, startedAt, state, modelCallErrorFields(err));
		throw err;
	} finally {
		if (!iteratorSettled) {
			await safeReturnIterator(iterator);
			emitModelCallCompleted(eventBase, startedAt, state);
		}
	}
}
function observeModelCallFinalResult(result, eventBase, startedAt, state) {
	observeResultMessageContent(state, startedAt, result);
	emitModelCallCompleted(eventBase, startedAt, state);
	return result;
}
function createObservedResultFunction(stream, eventBase, startedAt, state) {
	if (!isRecord(stream) || typeof stream.result !== "function") return;
	const resultFn = stream.result;
	return (...args) => {
		try {
			const result = resultFn.apply(stream, args);
			if (isPromiseLike(result)) return result.then((resolved) => observeModelCallFinalResult(resolved, eventBase, startedAt, state), (err) => {
				emitModelCallError(eventBase, startedAt, state, modelCallErrorFields(err));
				throw err;
			});
			return observeModelCallFinalResult(result, eventBase, startedAt, state);
		} catch (err) {
			emitModelCallError(eventBase, startedAt, state, modelCallErrorFields(err));
			throw err;
		}
	};
}
function observeModelCallStream(stream, createIterator, eventBase, startedAt, state) {
	const observedIterator = () => observeModelCallIterator(createIterator(), eventBase, startedAt, state)[Symbol.asyncIterator]();
	const observedResult = createObservedResultFunction(stream, eventBase, startedAt, state);
	let hasNonConfigurableIterator;
	try {
		hasNonConfigurableIterator = Object.getOwnPropertyDescriptor(stream, Symbol.asyncIterator)?.configurable === false;
	} catch {
		hasNonConfigurableIterator = true;
	}
	if (hasNonConfigurableIterator) return {
		[Symbol.asyncIterator]: observedIterator,
		...observedResult ? { result: observedResult } : {}
	};
	return new Proxy(stream, { get(target, property, receiver) {
		if (property === Symbol.asyncIterator) return observedIterator;
		if (property === "result" && observedResult) return observedResult;
		const value = Reflect.get(target, property, receiver);
		return typeof value === "function" ? value.bind(target) : value;
	} });
}
function observeModelCallResult(result, eventBase, startedAt, state) {
	const createIterator = asyncIteratorFactory(result);
	if (createIterator) return observeModelCallStream(result, createIterator, eventBase, startedAt, state);
	emitModelCallCompleted(eventBase, startedAt, state);
	return result;
}
/**
* Wraps a model stream function with diagnostic model-call lifecycle events,
* traceparent propagation, request/response byte accounting, optional captured
* model content, progress heartbeats, and plugin hook dispatch.
*/
function wrapStreamFnWithDiagnosticModelCallEvents(streamFn, ctx) {
	return ((model, streamContext, options) => {
		const callId = ctx.nextCallId();
		const trace = freezeDiagnosticTraceContext(createChildDiagnosticTraceContext(ctx.trace));
		const eventBase = baseModelCallEvent(ctx, callId, trace);
		const modelContent = streamContextModelContentFields(ctx.contentCapture, streamContext);
		emitModelCallStarted(eventBase, modelContent);
		ctx.onStarted?.();
		const startedAt = Date.now();
		const state = {
			responseStreamBytes: 0,
			modelContent,
			contentCapture: ctx.contentCapture
		};
		const propagatedOptions = withDiagnosticTraceparentHeader(options, trace, state);
		try {
			const result = streamFn(model, streamContext, propagatedOptions);
			if (isPromiseLike(result)) return result.then((resolved) => observeModelCallResult(resolved, eventBase, startedAt, state), (err) => {
				emitModelCallError(eventBase, startedAt, state, modelCallErrorFields(err));
				throw err;
			});
			return observeModelCallResult(result, eventBase, startedAt, state);
		} catch (err) {
			emitModelCallError(eventBase, startedAt, state, modelCallErrorFields(err));
			throw err;
		}
	});
}
//#endregion
export { rotateTranscriptAfterCompaction as A, dropReasoningFromHistory as B, getHistoryLimitFromSessionKey as C, isRealConversationMessage as D, hasMeaningfulConversationContent as E, readLastCacheTtlTimestamp as F, consumeEmbeddedToolSendReceipt as G, stripThinkingBlocksFromMessage as H, logRuntimeToolSchemaQuarantine as I, createPreparedEmbeddedAgentSettingsManager as K, guardSessionManager as L, shouldRotateCompactionTranscript as M, dedupeDuplicateUserMessagesForCompaction as N, consumeCompactionSafeguardCancelReason as O, isCacheTtlEligibleProvider as P, stripStaleAssistantUsageBeforeLatestCompaction as R, buildEmbeddedMessageActionDiscoveryInput as S, buildEmbeddedExtensionFactories as T, wrapAnthropicStreamWithRecovery as U, dropThinkingBlocks as V, isZeroUsageEmptyStopAssistantTurn as W, trackSessionManagerAccess as _, AGENT_RESERVED_TOOL_NAMES as a, sanitizeSessionHistory as b, collectRegisteredToolNames as c, buildEmbeddedSystemPrompt as d, describeEmbeddedAgentStreamStrategy as f, prewarmSessionFile as g, resolveEmbeddedAgentStreamFn as h, normalizeContextTokenBudget as i, rotateTranscriptFileAfterCompaction as j, setCompactionSafeguardCancelReason as k, toSessionToolAllowlist as l, resolveEmbeddedAgentBaseStreamFn as m, flushPendingToolResultsAfterIdle as n, collectAllowedToolNames as o, resolveEmbeddedAgentApiKey as p, mapThinkingLevel as r, collectCoreBuiltinToolNames as s, wrapStreamFnWithDiagnosticModelCallEvents as t, applySystemPromptToSession as u, createEmbeddedAgentResourceLoader as v, limitHistoryTurns as w, validateReplayTurns as x, normalizeAssistantReplayContent as y, assessLastAssistantMessage as z };
