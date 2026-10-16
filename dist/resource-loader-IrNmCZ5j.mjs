import { r as __exportAll } from "./rolldown-runtime-Dr7-SnC6.mjs";
import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { C as parseStrictNonNegativeInteger, j as resolveIntegerOption, v as parseDateFirstTimestampMs } from "./number-coercion-CuVhdCBs.mjs";
import { t as coerceErrorMessage } from "./error-coercion-CvJK4lmH.mjs";
import { t as createDeferredCore } from "./deferred-D0La5CRk.mjs";
import { n as estimateStringChars } from "./cjk-chars-6ld30jSx.mjs";
import { t as truncateCodePoints } from "./code-points-5tfEHPUH.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { n as sliceUtf16Safe, r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { k as walkDirectorySync } from "./fs-safe-BUXBSN-4.mjs";
import { r as createInvalidConfigError, s as isInvalidConfigError } from "./io.invalid-config-BzeD3bi5.mjs";
import { H as copyPreparedModelVisibleToolText, o as prepareModelVisibleToolTextBlock } from "./redact-DJ8j6ADa.mjs";
import { t as mergeDeep } from "./deep-merge-B-AVx-Uc.mjs";
import { h as sleep } from "./utils-DgZn2dLu.mjs";
import { r as isPathInside } from "./path-guards-CH7noY0Z.mjs";
import { s as isDefaultStateDir } from "./paths-DGIwWbpu.mjs";
import { n as registerListener, t as notifyListeners } from "./listeners-BogSNJ-R.mjs";
import { t as createSubsystemLogger } from "./subsystem-I-uqdx4f.mjs";
import { t as createWindowsOutputDecoder } from "./windows-encoding-DWwh5Rcp.mjs";
import { o as createCommandTerminationController, u as releaseChildProcessOutputAfterExit } from "./exec-DJvyCA0D.mjs";
import { c as waitForCommandSpawn, o as spawnCommand } from "./exec-spawn-IxJJNQFo.mjs";
import { t as freezeJsonSnapshot } from "./immutable-data-MyNs7ITg.mjs";
import { n as MODEL_CATALOG_THINKING_LEVELS } from "./model-catalog-types-BUOf2O4u.mjs";
import "./defaults-Jag53zwP.mjs";
import { l as acquireFileLockSyncWithRetry } from "./update-managed-service-handoff-database-BzJlW6Xp.mjs";
import { a as installOpenClawInternalCorePackageNativeResolver } from "./plugin-module-loader-cache-CUtYxPiw.mjs";
import { n as buildPluginLoaderJitiOptions, t as buildPluginLoaderAliasMap } from "./sdk-alias-A9rXLURS.mjs";
import { n as parseGitUrl } from "./cloud-worker-project-profiles-DJ5jtY5M.mjs";
import { u as llm_exports } from "./llm--QylqK5V.mjs";
import { a as bashExecutionToText, i as COMPACTION_SUMMARY_SUFFIX, m as orderSystemUpdateMessages, n as BRANCH_SUMMARY_SUFFIX, o as convertToLlm, p as isOpenClawSystemUpdateMessage, r as COMPACTION_SUMMARY_PREFIX, t as BRANCH_SUMMARY_PREFIX } from "./messages-CeqAykcC.mjs";
import { f as resolvePendingRuntimeContextReplay } from "./internal-runtime-context-CAWYwg4i.mjs";
import { t as OAuthProviderConfiguredUnavailableError } from "./provider-runtime.errors-fEbkV7W9.mjs";
import "./transcript-payload-Yc_w8Yx5.mjs";
import { n as resolveJsonSaveTarget } from "./json-file-5C1aYJVp.mjs";
import { i as sameSessionTranscriptTargetBinding } from "./transcript-target-binding-WjVavOYj.mjs";
import { f as withSessionMetadataPublication, i as captureOwnedTranscriptWriteAssertion, p as withSessionTranscriptWriteAssertion } from "./transcript-write-context-m7NE2aEm.mjs";
import { t as warnSessionPersistenceDeprecation } from "./session-persistence-deprecation-H2dQRi8K.mjs";
import { a as FILE_AUTH_STORAGE_BACKEND_DEPRECATION_CODE, i as AuthStorage, n as getModelRegistryRuntime, o as FileAuthStorageBackend, r as AUTH_STORAGE_CREATE_DEPRECATION_CODE, s as InMemoryAuthStorageBackend, t as ModelRegistry } from "./model-registry-BpwFZKI0.mjs";
import { t as getAgentDir } from "./config-DlosXlEc.mjs";
import { n as createStreamingBinaryOutputSanitizer } from "./shell-utils-WeFwTUA7.mjs";
import { s as getStreamLlmRuntime } from "./model-runtime-binding-DgnrsJj9.mjs";
import { l as extractFrontmatterBlock } from "./frontmatter-ByhFzIgC.mjs";
import { n as attachRuntimePromptMediaFacts } from "./media-facts-CJdQ4R61.mjs";
import { t as buildSessionContext } from "./session-DitLEF2L.mjs";
import { N as InvalidSummaryOutputError, a as calculateContextTokens, c as estimateContextTokens, d as findTurnStartIndex, g as shouldCompact, h as prepareCompaction$1, l as estimateTokens, m as getLastAssistantUsage, n as IMAGE_BLOCK_TOKENS, o as capCompactionSummary, p as generateSummary$1, r as MAX_COMPACTION_SUMMARY_CHARS, s as compact$1, t as DEFAULT_COMPACTION_SETTINGS, u as findCutPoint, w as serializeConversation } from "./compaction-BR_rsQOI.mjs";
import { t as SAFETY_MARGIN } from "./compaction-planning-UE4SWl9c.mjs";
import { T as takeCodeModeResponseSource, w as prepareCodeModeSourceAppend } from "./session-accessor.sqlite-transcript-store-CV2CGkbJ.mjs";
import { l as makeZeroUsageSnapshot } from "./usage-XmAH1cfG.mjs";
import { t as applyAssistantDeliveryDirectives } from "./transcript-assistant-delivery-Dcmz1NrH.mjs";
import { a as migrateSessionEntries, c as normalizeLoadedFileEntry, d as generateSessionEntryId, l as parseSessionEntries, n as getLatestCompactionEntry, t as buildSessionContext$1 } from "./session-manager-codec-Dl5j6GJ-.mjs";
import { n as createMessageInjectionAuthority } from "./message-injection-authority-CJuS3j6I.mjs";
import { l as copyInternalToolResultState } from "./internal-hooks-Cr0v44EY.mjs";
import { t as classifyRateLimitWindow } from "./retry-evidence-KUnZJ93Z.mjs";
import { t as isRetryableAssistantError } from "./retry-DDdVO2q-.mjs";
import { n as isToolResultError } from "./tool-result-error-DGhCl3TG.mjs";
import { r as isLocalPath, t as canonicalizePath } from "./paths-DqLuHi-X.mjs";
import { o as mergePreparedUserTurnMessageForRuntime } from "./user-turn-transcript.message-D6tiOY3Z.mjs";
import { t as parseSkillFrontmatter } from "./frontmatter-CrckYGsg.mjs";
import { n as createSyntheticSourceInfo, t as createSourceInfo } from "./source-info-CcFiWAof.mjs";
import { t as materializeSkill } from "./skill-materializer-D1ia28Bp.mjs";
import { B as loadThemeFromPath, C as addIgnoreRules, E as createEditToolDefinition, F as wrapToolDefinition, I as OutputAccumulator, M as createBashTool, N as createBashToolDefinition, O as withFileMutationQueue, P as createToolDefinitionFromAgentTool, R as createLocalBashOperations, T as createEditTool, _ as createLsToolDefinition, a as createCodingTools, b as createFindTool, c as createTool, d as createWriteToolDefinition, f as createReadTool, g as createLsTool, i as createCodingToolDefinitions, l as createToolDefinition, n as createAllToolDefinitions, o as createReadOnlyToolDefinitions, p as createReadToolDefinition, r as createAllTools, s as createReadOnlyTools, t as allToolNames, u as createWriteTool, v as createGrepTool, w as normalizeNativePathSeparators, x as createFindToolDefinition, y as createGrepToolDefinition, z as interactiveAgentTheme } from "./tools-B_TYwbID.mjs";
import { a as truncateLine, i as truncateHead, n as DEFAULT_MAX_LINES, o as truncateTail, r as formatSize, t as DEFAULT_MAX_BYTES } from "./truncate-bkaAonci.mjs";
import { a as getExamplesPath, i as getDocsPath, n as CONFIG_DIR_NAME, o as getReadmePath, r as PACKAGE_MANIFEST_VERSION, s as isBunBinary } from "./tools-manager-kW72Lcdy.mjs";
import { i as wrapUntrustedPromptDataBlock } from "./sanitize-for-prompt-bzCyHFCH.mjs";
import { t as formatSkillsForPromptBounded } from "./skill-prompt-limits-DaXIzKaL.mjs";
import { d as shouldRetainSteeringRuntimeContext, n as attachSteeringRuntimeContext, o as getSteeringRuntimeContext } from "./runtime-context-prompt-CKrto4c6.mjs";
import { a as collectEntriesForBranchSummaryFromBranches, c as parseCommandArgs, l as substituteArgs, n as agent_core_exports, o as generateBranchSummary$1, r as openClawAgentCoreRuntime, s as prepareBranchEntries } from "./agent-core-4FCJFpuN.mjs";
import { r as stripStaleThinkingSignaturesForCompactionReplay } from "./thinking-signatures-Oj5tPFAb.mjs";
import { n as readRuntimePromptImageFactIndexes } from "./runtime-prompt-image-provenance-DfZxZge1.mjs";
import "./messages-Lka8u-U2.mjs";
import { n as SessionMetadataCommittedError, t as SessionManager } from "./session-manager-B2n0aSnK.mjs";
import { n as withSessionManagerWrite, r as withSessionManagerWriteAssertion } from "./session-manager-write-admission-B0F76kpn.mjs";
import { t as buildPromisedWorkPromptSection } from "./promised-work-prompt-DrQLJOu5.mjs";
import { createRequire } from "node:module";
import * as fs$1 from "node:fs";
import { chmodSync, existsSync, globSync, lstatSync, mkdirSync, readFileSync, readdirSync, realpathSync, statSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import * as path$1 from "node:path";
import { basename, dirname, isAbsolute, join, relative, resolve } from "node:path";
import * as os$1 from "node:os";
import { homedir } from "node:os";
import { createHash } from "node:crypto";
import chalk from "chalk";
import { EventEmitter } from "node:events";
import { replaceFileAtomicSync } from "@openclaw/fs-safe/atomic";
import * as bundledTypeboxGuard from "typebox/guard";
import * as bundledTypeboxSchema from "typebox/schema";
import * as bundledTypeboxFormat from "typebox/format";
import * as bundledTypebox from "typebox";
import * as bundledTypeboxCompile from "typebox/compile";
import * as bundledTypeboxValue from "typebox/value";
import { parse as parse$1 } from "yaml";
import { minimatch } from "minimatch";
import { isCompactionReplayCheckpoint } from "@openclaw/ai/transports";
import { clampThinkingLevel, cleanupSessionResources, getSupportedThinkingLevels, isContextOverflow, modelsAreEqual } from "@openclaw/ai/internal/runtime";
import { isResponsesOutputLimitToolCallError } from "@openclaw/ai/diagnostics";
import * as bundledTypeboxError from "typebox/error";
import * as bundledTypeboxSystem from "typebox/system";
import * as bundledTypeboxType from "typebox/type";
const TOOL_RESULT_CHARS_PER_TOKEN = 2;
const JSON_PAYLOAD_CHARS_PER_TOKEN = 3;
const MESSAGE_BOUNDARY_OVERHEAD_TOKENS = 12;
const CONTENT_BLOCK_OVERHEAD_TOKENS = 6;
function estimateStringTokenPressure(text, charsPerToken = 4, mode = "general") {
	const estimatedTokens = Math.ceil(estimateStringChars(text) / charsPerToken);
	return mode === "tool-result" ? Math.max(Math.ceil(text.length / TOOL_RESULT_CHARS_PER_TOKEN), estimatedTokens) : estimatedTokens;
}
function estimateJsonPayloadTokenPressure(value, charsPerToken = JSON_PAYLOAD_CHARS_PER_TOKEN, mode = "general") {
	try {
		const serialized = JSON.stringify(value);
		return typeof serialized === "string" ? estimateStringTokenPressure(serialized, charsPerToken, mode) : 1;
	} catch {
		return 256;
	}
}
/** Count model-facing definitions; runtime output schemas and metadata never reach the provider. */
function estimateToolSchemaTokens(tools) {
	return tools?.length ? estimateJsonPayloadTokenPressure(tools.map(({ name, description, parameters }) => ({
		name,
		description,
		parameters
	}))) : 0;
}
function estimateIdentifierTokenPressure(value, charsPerToken = JSON_PAYLOAD_CHARS_PER_TOKEN) {
	if (value == null) return 0;
	if (typeof value === "string" || typeof value === "number" || typeof value === "boolean" || typeof value === "bigint") return estimateStringTokenPressure(String(value), charsPerToken);
	return estimateJsonPayloadTokenPressure(value, charsPerToken);
}
function estimateContentBlockTokenPressure(block, charsPerToken = 4, mode = "general") {
	if (typeof block === "string") return estimateStringTokenPressure(block, charsPerToken, mode);
	if (!isRecord(block)) return estimateJsonPayloadTokenPressure(block, charsPerToken, mode);
	const type = block.type;
	const text = type === "text" ? block.text : type === "thinking" ? block.thinking : void 0;
	if (typeof text === "string") return CONTENT_BLOCK_OVERHEAD_TOKENS + estimateStringTokenPressure(text, charsPerToken, mode);
	if (type === "image") return IMAGE_BLOCK_TOKENS;
	return CONTENT_BLOCK_OVERHEAD_TOKENS + estimateJsonPayloadTokenPressure(block, charsPerToken, mode);
}
function estimateAssistantToolCallTokenPressure(block) {
	const args = block.arguments ?? block.input ?? block.args ?? {};
	return CONTENT_BLOCK_OVERHEAD_TOKENS + estimateIdentifierTokenPressure(block.name, JSON_PAYLOAD_CHARS_PER_TOKEN) + estimateJsonPayloadTokenPressure(args, JSON_PAYLOAD_CHARS_PER_TOKEN);
}
function estimateContentTokenPressure(content, mode = "general") {
	if (typeof content === "string") return estimateStringTokenPressure(content, 4, mode);
	if (Array.isArray(content)) return content.reduce((sum, block) => sum + estimateContentBlockTokenPressure(block, 4, mode), 0);
	if (content !== void 0) return estimateJsonPayloadTokenPressure(content, mode === "tool-result" ? 4 : JSON_PAYLOAD_CHARS_PER_TOKEN, mode);
	return 0;
}
function estimateMessageTokenPressure(message) {
	if ("excludeFromContext" in message && message.excludeFromContext === true) return 0;
	const legacy = isRecord(message) ? message : {};
	let tokens = MESSAGE_BOUNDARY_OVERHEAD_TOKENS;
	if (message.role === "toolResult" || legacy.role === "tool" || legacy.type === "toolResult") {
		const content = message.role === "toolResult" ? message.content : legacy.content;
		const toolName = message.role === "toolResult" ? message.toolName : legacy.toolName;
		tokens += estimateContentTokenPressure(content, "tool-result");
		tokens += estimateIdentifierTokenPressure(toolName ?? legacy.tool_name);
		return tokens;
	}
	if (message.role === "bashExecution") {
		tokens += estimateStringTokenPressure(bashExecutionToText(message));
		return tokens;
	}
	if (message.role === "branchSummary" || message.role === "compactionSummary") {
		const [prefix, suffix] = message.role === "branchSummary" ? [BRANCH_SUMMARY_PREFIX, BRANCH_SUMMARY_SUFFIX] : [COMPACTION_SUMMARY_PREFIX, COMPACTION_SUMMARY_SUFFIX];
		return tokens + estimateStringTokenPressure(prefix + message.summary + suffix);
	}
	if (message.role === "assistant") {
		if (Array.isArray(message.content)) for (const block of message.content) {
			if (isRecord(block)) {
				const blockType = block.type;
				if (blockType === "toolCall" || blockType === "tool_use") {
					tokens += estimateAssistantToolCallTokenPressure(block);
					continue;
				}
			}
			tokens += estimateContentBlockTokenPressure(block);
		}
		else tokens += estimateContentTokenPressure(message.content);
		const toolCalls = legacy.toolCalls ?? legacy.tool_calls;
		if (Array.isArray(toolCalls)) for (const toolCall of toolCalls) tokens += isRecord(toolCall) ? estimateAssistantToolCallTokenPressure(toolCall) : estimateJsonPayloadTokenPressure(toolCall);
		return tokens;
	}
	tokens += estimateContentTokenPressure(legacy.content);
	return tokens;
}
/**
* Estimates the prompt pressure at the LLM boundary from transcript messages,
* optional system prompt, and current prompt text. The result intentionally
* includes a safety margin because this path runs before provider tokenization.
*/
function estimateRenderedPromptTokens(params) {
	return (typeof params.systemPrompt === "string" && params.systemPrompt.trim().length > 0 ? MESSAGE_BOUNDARY_OVERHEAD_TOKENS + estimateStringTokenPressure(params.systemPrompt) : 0) + MESSAGE_BOUNDARY_OVERHEAD_TOKENS + estimateStringTokenPressure(params.prompt);
}
/** Prepare fixed request costs before estimating its pending input or replacement history. */
function createFreshLlmBoundaryTokenEstimator(params) {
	const toolTokens = estimateToolSchemaTokens(params.tools);
	const fixedPromptTokens = estimateRenderedPromptTokens({
		systemPrompt: params.systemPrompt,
		prompt: ""
	});
	return (request) => Math.ceil((fixedPromptTokens + estimateStringTokenPressure(request.prompt) + toolTokens + (request.imageCount ?? 0) * IMAGE_BLOCK_TOKENS + request.messages.reduce((total, message) => total + estimateMessageTokenPressure(message), 0)) * SAFETY_MARGIN);
}
//#endregion
//#region src/agents/agent-hooks/compaction-instructions.ts
const DEFAULT_COMPACTION_INSTRUCTIONS = "Write the summary body in the primary language used in the conversation.\nFocus on factual content: what was discussed, decisions made, and current state.\nKeep the required summary structure and section headers unchanged.\nDo not translate or alter code, file paths, identifiers, or error messages.";
const MAX_INSTRUCTION_LENGTH = 800;
/** Blank overrides fall through to runtime configuration, then the language-preserving default. */
function resolveCompactionInstructions(eventInstructions, runtimeInstructions) {
	const resolved = normalizeOptionalString(eventInstructions) ?? normalizeOptionalString(runtimeInstructions) ?? DEFAULT_COMPACTION_INSTRUCTIONS;
	return truncateCodePoints(resolved, MAX_INSTRUCTION_LENGTH);
}
//#endregion
//#region src/agents/compaction-usage.ts
function stripStaleAssistantUsageBeforeLatestCompaction(messages, options = {}) {
	const latestCompactionSummaryIndex = messages.findLastIndex((entry) => entry?.role === "compactionSummary");
	const hasCompactionSummary = latestCompactionSummaryIndex !== -1;
	if (!hasCompactionSummary && options.whenMissingCompactionSummary !== "zeroAssistantUsage") return messages;
	const latestCompactionTimestamp = parseDateFirstTimestampMs(messages[latestCompactionSummaryIndex]?.timestamp);
	let out = messages;
	for (let i = 0; i < messages.length; i += 1) {
		const candidate = messages[i];
		if (candidate?.role !== "assistant" || !candidate.usage || typeof candidate.usage !== "object") continue;
		const messageTimestamp = parseDateFirstTimestampMs(candidate.timestamp);
		if (!(!hasCompactionSummary || (latestCompactionTimestamp !== void 0 && messageTimestamp !== void 0 ? messageTimestamp <= latestCompactionTimestamp : i < latestCompactionSummaryIndex))) continue;
		if (out === messages && !options.mutate) out = [...messages];
		out[i] = {
			...candidate,
			usage: makeZeroUsageSnapshot()
		};
	}
	return out;
}
//#endregion
//#region src/agents/compaction-replay.ts
/** Keep every transcript rebuild safe for the next provider request. */
function sanitizeCompactionReplayMessages(messages) {
	return stripStaleThinkingSignaturesForCompactionReplay(stripStaleAssistantUsageBeforeLatestCompaction(messages));
}
//#endregion
//#region src/sessions/user-turn-transcript-runtime-context.ts
const RUNTIME_USER_TURN_TRANSCRIPT_CONTEXT = Symbol.for("openclaw.runtimeUserTurnTranscriptContext");
const RUNTIME_USER_TURN_TRANSCRIPT_RECORDER = Symbol.for("openclaw.runtimeUserTurnTranscriptRecorder");
/** Carries transcript-only fields with a queued runtime message without exposing them to the model. */
function attachRuntimeUserTurnTranscriptContext(runtimeMessage, context) {
	Object.defineProperty(runtimeMessage, RUNTIME_USER_TURN_TRANSCRIPT_CONTEXT, {
		configurable: true,
		value: context
	});
	return runtimeMessage;
}
/** Consumes the transient queued-turn context before the message is serialized. */
function takeRuntimeUserTurnTranscriptContext(runtimeMessage) {
	const context = Reflect.get(runtimeMessage, RUNTIME_USER_TURN_TRANSCRIPT_CONTEXT);
	if (context) Reflect.deleteProperty(runtimeMessage, RUNTIME_USER_TURN_TRANSCRIPT_CONTEXT);
	return context;
}
/** Keeps the queued recorder attached to the exact final message until persistence succeeds. */
function attachRuntimeUserTurnTranscriptRecorder(runtimeMessage, recorder) {
	Object.defineProperty(runtimeMessage, RUNTIME_USER_TURN_TRANSCRIPT_RECORDER, {
		configurable: true,
		value: recorder
	});
	return runtimeMessage;
}
function readRuntimeUserTurnTranscriptRecorder(runtimeMessage) {
	return Reflect.get(runtimeMessage, RUNTIME_USER_TURN_TRANSCRIPT_RECORDER);
}
/** A steered message retains its own live custody while another turn owns the runtime. */
function withRuntimeUserTurnTranscriptRecorder(runtimeMessage, append) {
	const recorder = readRuntimeUserTurnTranscriptRecorder(runtimeMessage);
	const assertCommit = recorder?.assertOriginalInputCommit;
	const beforeFreshMessageCommit = assertCommit ? createMessageInjectionAuthority(() => {
		assertCommit();
		return true;
	}) : void 0;
	const persist = () => append(beforeFreshMessageCommit);
	return recorder?.withPendingInput ? recorder.withPendingInput(persist) : persist();
}
function takeRuntimeUserTurnTranscriptRecorder(runtimeMessage) {
	const recorder = readRuntimeUserTurnTranscriptRecorder(runtimeMessage);
	if (recorder) Reflect.deleteProperty(runtimeMessage, RUNTIME_USER_TURN_TRANSCRIPT_RECORDER);
	return recorder;
}
//#endregion
//#region src/agents/utils/frontmatter.ts
/**
* YAML frontmatter parsing helpers.
*
* Agent docs/tools use this to split optional Markdown frontmatter from the
* body while preserving normal content when no complete frontmatter fence exists.
*/
const normalizeNewlines = (value) => value.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
/** Parses optional YAML frontmatter from Markdown-like content. */
const parsePromptFrontmatter = (content) => {
	const normalized = normalizeNewlines(content);
	const extracted = extractFrontmatterBlock(normalized);
	if (!extracted) return {
		frontmatter: {},
		body: normalized
	};
	return {
		frontmatter: parse$1(extracted.block) ?? {},
		body: extracted.body.trim()
	};
};
/** Removes YAML frontmatter from content when a complete frontmatter block exists. */
const stripFrontmatter = (content) => parsePromptFrontmatter(content).body;
//#endregion
//#region src/agents/sessions/agent-session-transcript.ts
/** Persist completed model messages through their existing custody owner. */
async function persistAgentSessionMessage(manager, message, options) {
	applyAssistantDeliveryDirectives(message);
	const appendOptions = { invalidateSerializedPrefixCache: options.invalidateSerializedPrefixCache };
	prepareCodeModeSourceAppend(appendOptions, message, options.sourceAppend);
	return await manager.appendMessageAsync(message, appendOptions);
}
//#endregion
//#region src/agents/sessions/agent-session-utils.ts
function unwrapCoreResult(result) {
	if (result.ok) return result.value;
	throw result.error;
}
function normalizeBranchSummaryResult(result) {
	if (result.ok) return result.value;
	if (result.error.code === "aborted") return {
		aborted: true,
		error: result.error.message
	};
	return { error: result.error.message };
}
function hasPersistedAssistantContent(content) {
	return (typeof content === "string" || Array.isArray(content)) && content.length > 0;
}
function extractTextContent(content) {
	if (typeof content === "string") return content;
	if (!Array.isArray(content)) return "";
	let text = "";
	for (const block of content) {
		if (!block || typeof block !== "object") continue;
		const candidate = block;
		if (candidate.type === "text" && typeof candidate.text === "string") text += candidate.text;
	}
	return text;
}
function replaceAgentMessageInPlace(target, replacement) {
	if (target === replacement) return;
	for (const key of Object.keys(target)) Reflect.deleteProperty(target, key);
	Object.assign(target, replacement);
}
function estimateMessagesFromContent(messages) {
	return messages.reduce((total, message) => total + estimateTokens(message), 0);
}
//#endregion
//#region src/agents/sessions/auth-guidance.ts
/**
* Shared user-facing auth guidance for session/model selection failures.
*
* Uses docs paths instead of provider-specific instructions so guidance stays correct across OAuth/API-key providers.
*/
const UNKNOWN_PROVIDER = "unknown";
/** Returns the standard provider login help block. */
function getProviderLoginHelp() {
	return [
		"Use /login to log into a provider via OAuth or API key. See:",
		`  ${join(getDocsPath(), "providers.md")}`,
		`  ${join(getDocsPath(), "models.md")}`
	].join("\n");
}
/** Formats the message shown before a model is selected. */
function formatNoModelSelectedMessage() {
	return `No model selected.\n\n${getProviderLoginHelp()}\n\nThen use /model to select a model.`;
}
/** Formats the missing API key guidance for a provider or unknown selected model. */
function formatNoApiKeyFoundMessage(provider) {
	return `No API key found for ${provider === UNKNOWN_PROVIDER ? "the selected model" : provider}.\n\n${getProviderLoginHelp()}`;
}
//#endregion
//#region src/agents/sessions/event-bus.ts
/**
* Tiny event bus abstraction for session UI/runtime notifications.
*
* Isolates handler failures so one bad subscriber cannot break later listeners.
*/
/** Creates an in-process event bus with unsubscribe and clear support. */
function createEventBus() {
	const emitter = new EventEmitter();
	return {
		emit: (channel, data) => {
			emitter.emit(channel, data);
		},
		on: (channel, handler) => {
			const safeHandler = (data) => {
				try {
					handler(data);
				} catch (err) {
					console.error(`Event handler error (${channel}):`, err);
				}
			};
			emitter.on(channel, safeHandler);
			return () => emitter.off(channel, safeHandler);
		},
		clear: () => {
			emitter.removeAllListeners();
		}
	};
}
//#endregion
//#region src/agents/sessions/exec.ts
const DEFAULT_OUTPUT_LIMIT_CHARS = 16777216;
const FORCE_KILL_GRACE_MS = 5e3;
function decodeCapturedOutput(decoder, chunk) {
	return Buffer.isBuffer(chunk) ? decoder.decode(chunk) : `${decoder.flush()}${chunk}`;
}
function clampMaxOutputChars(value) {
	if (typeof value !== "number" || !Number.isFinite(value) || value <= 0) return DEFAULT_OUTPUT_LIMIT_CHARS;
	return Math.max(1, Math.floor(value));
}
function appendCapturedOutput(current, chunk, maxOutputChars, truncateTail) {
	const text = String(chunk);
	const combined = `${current.text}${text}`;
	const overflowChars = Math.max(0, combined.length - maxOutputChars);
	if (overflowChars === 0) return {
		text: combined,
		truncatedChars: current.truncatedChars
	};
	const nextText = truncateTail ? sliceUtf16Safe(combined, overflowChars) : sliceUtf16Safe(combined, 0, maxOutputChars);
	return {
		text: nextText,
		truncatedChars: current.truncatedChars + combined.length - nextText.length
	};
}
/**
* Execute a shell command and return stdout/stderr/code.
* Supports timeout and abort signal.
*/
async function execCommand(command, args, cwd, options) {
	const cancelController = new AbortController();
	const startupCanceled = createDeferredCore();
	let waitingForSpawn = true;
	let acceptingOutput = true;
	let killed = false;
	let terminationStarted = false;
	let timeoutId;
	let terminationController;
	const killProcess = () => {
		killed = true;
		if (terminationController) {
			if (!terminationStarted) {
				terminationStarted = true;
				if (!terminationController.terminate()) cancelController.abort();
			}
		} else cancelController.abort();
		if (waitingForSpawn) startupCanceled.resolve({
			stdout: "",
			stderr: "",
			code: 1,
			killed: true
		});
	};
	try {
		const proc = spawnCommand([command, ...args], {
			buffer: false,
			cancelSignal: cancelController.signal,
			cwd,
			detached: process.platform !== "win32",
			forceKillAfterDelay: FORCE_KILL_GRACE_MS,
			reject: false,
			stdio: [
				"ignore",
				"pipe",
				"pipe"
			]
		});
		options?.signal?.addEventListener("abort", killProcess, { once: true });
		if (options?.timeout && options.timeout > 0) timeoutId = setTimeout(killProcess, options.timeout);
		const completion = (async () => {
			if (proc.pid === void 0) await waitForCommandSpawn(proc);
			waitingForSpawn = false;
			return new Promise((resolve) => {
				const releaseOutput = releaseChildProcessOutputAfterExit(proc.nodeChildProcess);
				let childExited = false;
				proc.nodeChildProcess.once("exit", () => {
					childExited = true;
				});
				let commandSettled = false;
				const termination = createCommandTerminationController({
					child: proc.nodeChildProcess,
					cancelController,
					processTree: { mode: "graceful" },
					killGraceMs: FORCE_KILL_GRACE_MS,
					isChildExited: () => childExited,
					isCommandSettled: () => commandSettled
				});
				terminationController = termination;
				const captures = {
					stdout: {
						text: "",
						truncatedChars: 0
					},
					stderr: {
						text: "",
						truncatedChars: 0
					}
				};
				const decoders = {
					stdout: createWindowsOutputDecoder({ preserveUtf8Bom: true }),
					stderr: createWindowsOutputDecoder({ preserveUtf8Bom: true })
				};
				let settled = false;
				const maxOutputChars = clampMaxOutputChars(options?.maxOutputChars);
				const truncateOutput = options?.maxOutputChars !== void 0;
				let outputLimitExceeded;
				const markOutputLimitExceeded = (stream) => {
					if (!truncateOutput && !outputLimitExceeded) {
						outputLimitExceeded = stream;
						killProcess();
					}
				};
				const finish = async (code) => {
					if (settled) return;
					settled = true;
					commandSettled = true;
					if (timeoutId) clearTimeout(timeoutId);
					if (options?.signal) options.signal.removeEventListener("abort", killProcess);
					await termination.settle();
					for (const stream of ["stdout", "stderr"]) {
						const before = captures[stream].truncatedChars;
						captures[stream] = appendCapturedOutput(captures[stream], decoders[stream].flush(), maxOutputChars, truncateOutput);
						if (!truncateOutput && captures[stream].truncatedChars > before && !outputLimitExceeded) outputLimitExceeded = stream;
					}
					if (outputLimitExceeded) captures.stderr = appendCapturedOutput(captures.stderr, `${captures.stderr.text ? "\n" : ""}exec ${outputLimitExceeded} exceeded output limit ${maxOutputChars} chars`, maxOutputChars, true);
					resolve({
						stdout: captures.stdout.text,
						stderr: captures.stderr.text,
						stdoutTruncatedChars: captures.stdout.truncatedChars || void 0,
						stderrTruncatedChars: captures.stderr.truncatedChars || void 0,
						outputLimitExceeded,
						code: outputLimitExceeded ? 1 : code,
						killed
					});
				};
				const ignoreOutputStreamError = () => {};
				for (const stream of ["stdout", "stderr"]) {
					proc[stream]?.on("error", ignoreOutputStreamError);
					proc[stream]?.on("data", (data) => {
						if (!acceptingOutput) return;
						const before = captures[stream].truncatedChars;
						captures[stream] = appendCapturedOutput(captures[stream], decodeCapturedOutput(decoders[stream], data), maxOutputChars, truncateOutput);
						if (captures[stream].truncatedChars > before) markOutputLimitExceeded(stream);
					});
				}
				if (killed) killProcess();
				proc.then((result) => finish(result.exitCode ?? (result.failed ? 1 : 0))).catch(() => finish(1)).finally(releaseOutput);
			});
		})();
		if (options?.signal?.aborted) killProcess();
		return await Promise.race([completion, startupCanceled.promise]);
	} finally {
		acceptingOutput = false;
		clearTimeout(timeoutId);
		options?.signal?.removeEventListener("abort", killProcess);
	}
}
//#endregion
//#region src/agents/sessions/bash-executor.ts
/**
* Execute a bash command using custom BashOperations.
* Used for remote execution (SSH, containers, etc.).
*/
async function executeBashWithOperations(command, cwd, operations, options) {
	const output = new OutputAccumulator({
		tempFilePrefix: "openclaw-bash",
		createTextTransform: () => {
			const sanitizeOutput = createStreamingBinaryOutputSanitizer();
			return (text) => sanitizeOutput(text).replace(/\r/g, "");
		}
	});
	const onData = (data, stream) => {
		const text = output.append(data, stream);
		options?.onChunk?.(text);
	};
	const finalizeOutput = async () => {
		const finalText = output.finish();
		const snapshot = output.snapshot({ persistIfTruncated: true });
		try {
			if (finalText) options?.onChunk?.(finalText);
			return snapshot;
		} finally {
			await output.closeTempFile();
		}
	};
	const buildResult = async (exitCode, cancelled) => {
		const snapshot = await finalizeOutput();
		return {
			output: snapshot.content,
			exitCode: cancelled ? void 0 : exitCode,
			cancelled,
			truncated: snapshot.truncation.truncated,
			fullOutputPath: snapshot.fullOutputPath
		};
	};
	let result;
	try {
		result = await operations.exec(command, cwd, {
			onData,
			signal: options?.signal
		});
	} catch (err) {
		if (options?.signal?.aborted) return await buildResult(void 0, true);
		await finalizeOutput();
		throw err;
	}
	const cancelled = options?.signal?.aborted ?? false;
	return await buildResult(result.exitCode ?? void 0, cancelled);
}
//#endregion
//#region src/agents/sessions/compaction/runtime.ts
/** Adds a private usage sink without changing public summary result shapes. */
function createCompactionRuntime(usageSink) {
	return usageSink ? {
		...openClawAgentCoreRuntime,
		internalUsageSink: usageSink
	} : openClawAgentCoreRuntime;
}
//#endregion
//#region src/agents/sessions/compaction/branch-summarization.ts
/** Collects entries that differ between two session branches for summarization. */
function collectEntriesForBranchSummary(session, oldLeafId, targetId) {
	if (!oldLeafId) return {
		entries: [],
		commonAncestorId: null
	};
	const oldBranch = session.getBranch(oldLeafId);
	const targetPath = session.getBranch(targetId);
	return collectEntriesForBranchSummaryFromBranches(oldBranch, targetPath);
}
/** Generates a human-readable branch summary through the shared agent-core runtime. */
async function generateBranchSummary(entries, options) {
	const { usageSink, ...summaryOptions } = options;
	return normalizeBranchSummaryResult(await generateBranchSummary$1(entries, {
		runtime: createCompactionRuntime(usageSink),
		...summaryOptions
	}));
}
//#endregion
//#region src/agents/sessions/compaction/compaction.ts
/** Prepares session entries for compaction using the shared agent-core planner. */
function prepareCompaction(pathEntries, settings) {
	return unwrapCoreResult(prepareCompaction$1(pathEntries, settings));
}
/** Generates a compaction summary through the shared agent-core runtime. */
async function generateSummary(currentMessages, model, reserveTokens, apiKey, headers, signal, customInstructions, previousSummary, thinkingLevel, streamFn, usageSink, summaryPrompt) {
	return unwrapCoreResult(await generateSummary$1(currentMessages, model, reserveTokens, apiKey, headers, signal, customInstructions, previousSummary, thinkingLevel, streamFn, createCompactionRuntime(usageSink), summaryPrompt));
}
/** Runs full compaction through agent-core and returns the compacted conversation result. */
async function compact(preparation, model, apiKey, headers, customInstructions, signal, thinkingLevel, streamFn, usageSink) {
	return unwrapCoreResult(await compact$1(preparation, model, apiKey, headers, customInstructions, signal, thinkingLevel, streamFn, createCompactionRuntime(usageSink)));
}
//#endregion
//#region src/agents/sessions/defaults.ts
/** Default thinking level for sessions that do not specify a model-specific override. */
const DEFAULT_THINKING_LEVEL = "medium";
//#endregion
//#region src/agents/sessions/model-resolver.ts
function isValidThinkingLevel(level) {
	return MODEL_CATALOG_THINKING_LEVELS.some((candidate) => candidate === level);
}
function splitModelPatternSuffix(pattern) {
	const index = pattern.lastIndexOf(":");
	return index === -1 ? void 0 : [pattern.slice(0, index), pattern.slice(index + 1)];
}
function scopeModelsToProvider(provider, availableModels) {
	const exact = availableModels.filter((model) => model.provider === provider);
	return exact.length ? exact : availableModels.filter((model) => model.provider.toLowerCase() === provider.toLowerCase());
}
function collectQualifiedModelScopes(modelReference, availableModels) {
	const canonicalScopes = [];
	const qualifiedScopes = [];
	for (let slashIndex = modelReference.indexOf("/"); slashIndex !== -1; slashIndex = modelReference.indexOf("/", slashIndex + 1)) {
		const provider = modelReference.slice(0, slashIndex);
		const modelId = modelReference.slice(slashIndex + 1);
		const models = scopeModelsToProvider(provider, availableModels);
		if (models.length) canonicalScopes.push([modelId, models]);
		const trimmedModels = provider === provider.trim() ? models : scopeModelsToProvider(provider.trim(), availableModels);
		if (trimmedModels.length) qualifiedScopes.push([modelId.trim(), trimmedModels]);
	}
	return [canonicalScopes, qualifiedScopes];
}
function collectModelReferenceMatches(modelReference, availableModels, qualifiedOnly = false) {
	const trimmedReference = modelReference.trim();
	if (!trimmedReference) return [];
	const groups = collectQualifiedModelScopes(trimmedReference, availableModels);
	if (!qualifiedOnly) groups.push([[trimmedReference, availableModels]]);
	for (const scopes of groups) {
		const matchedScopes = scopes.map(([id, models]) => [id, models.filter((model) => model.id.toLowerCase() === id.toLowerCase())]).filter(([, models]) => models.length);
		const folded = matchedScopes.flatMap(([, models]) => models);
		const canonical = folded.filter((model) => `${model.provider}/${model.id}` === trimmedReference);
		const matches = canonical.length ? canonical : matchedScopes.length > 1 ? folded : matchedScopes.flatMap(([id, models]) => {
			const exact = models.filter((model) => model.id === id);
			return exact.length ? exact : models;
		});
		if (matches.length > 0) return matches.filter((model, index) => matches.findIndex((candidate) => modelsAreEqual(candidate, model)) === index);
	}
	return [];
}
function ambiguousModelReference(pattern) {
	return `Model "${pattern}" is ambiguous. Use exact provider and model IDs, specifying the provider separately if needed.`;
}
function collectModelPatternMatches(pattern, availableModels, deferRawIds = false) {
	const parts = splitModelPatternSuffix(pattern);
	const suffix = parts && isValidThinkingLevel(parts[1]) ? parts : void 0;
	const matches = collectModelReferenceMatches(pattern, availableModels, deferRawIds && !suffix);
	return matches.length || !suffix ? matches : collectModelPatternMatches(suffix[0], availableModels, deferRawIds);
}
/**
* Match a bare id or provider/model reference, preferring exact model-id casing.
* Case-insensitive matches remain available only when unambiguous.
*/
function findExactModelReferenceMatch(modelReference, availableModels) {
	const matches = collectModelReferenceMatches(modelReference, availableModels);
	return matches.length === 1 ? matches[0] : void 0;
}
function matchPartialModelPattern(modelPattern, availableModels) {
	const normalizedPattern = modelPattern.toLowerCase();
	const matched = availableModels.filter((model) => model.id.toLowerCase().includes(normalizedPattern) || model.name?.toLowerCase().includes(normalizedPattern)).toSorted((a, b) => Number(/-\d{8}$/.test(a.id)) - Number(/-\d{8}$/.test(b.id)) || b.id.localeCompare(a.id, void 0, { numeric: true }))[0];
	return matched && availableModels.find((model) => modelsAreEqual(model, matched));
}
function buildFallbackModel(provider, modelId, availableModels) {
	const baseModel = availableModels.find((model) => model.provider === provider);
	return baseModel ? {
		...baseModel,
		id: modelId,
		name: modelId
	} : void 0;
}
function selectAvailableFallbackModel(availableModels) {
	return availableModels.find((model) => model.provider === "openai" && model.id === "gpt-6-astra") ?? availableModels[0];
}
/**
* Parse a pattern to extract model and thinking level.
* Handles models with colons in their IDs (e.g., OpenRouter's :exacto suffix).
*
* Algorithm:
* 1. Try to match full pattern as a model
* 2. If found, leave the thinking level unspecified
* 3. If not found and has colons, split on last colon:
*    - If suffix is valid thinking level, use it and recurse on prefix
*    - If suffix is invalid, warn and leave the thinking level unspecified
*
* @internal Shared with the session extension SDK
*/
function parseModelPattern(pattern, availableModels, options) {
	const exactMatches = collectModelReferenceMatches(pattern, availableModels);
	if (exactMatches.length > 1) return {
		model: void 0,
		thinkingLevel: void 0,
		warning: ambiguousModelReference(pattern)
	};
	const model = exactMatches[0] ?? matchPartialModelPattern(pattern, availableModels);
	if (model) return {
		model,
		thinkingLevel: void 0,
		warning: void 0
	};
	const parts = splitModelPatternSuffix(pattern);
	if (!parts) return {
		model: void 0,
		thinkingLevel: void 0,
		warning: void 0
	};
	const [prefix, suffix] = parts;
	const validThinkingLevel = isValidThinkingLevel(suffix);
	if (!validThinkingLevel && options?.allowInvalidThinkingLevelFallback === false) return {
		model: void 0,
		thinkingLevel: void 0,
		warning: void 0
	};
	const result = parseModelPattern(prefix, availableModels, options);
	if (!result.model) return result;
	return {
		model: result.model,
		thinkingLevel: validThinkingLevel && !result.warning ? suffix : void 0,
		warning: validThinkingLevel ? result.warning : `Invalid thinking level "${suffix}" in pattern "${pattern}". Using default instead.`
	};
}
/**
* Resolve model patterns to actual Model objects with optional thinking levels
* Format: "pattern:level" where :level is optional
* For each pattern, finds all matching models and picks the best version:
* 1. Prefer alias (e.g., claude-sonnet-4-5) over dated versions (claude-sonnet-4-5-20250929)
* 2. If no alias, pick the latest dated version
*
* Supports models with colons in their IDs (e.g., OpenRouter's model:exacto).
* The algorithm tries to match the full pattern first, then progressively
* strips colon-suffixes to find a match.
*/
async function resolveModelScope(patterns, modelRegistry) {
	const availableModels = modelRegistry.getAvailable();
	const scopedModels = [];
	for (const pattern of patterns) {
		let matches;
		if (pattern.includes("*") || pattern.includes("?") || pattern.includes("[")) {
			const suffix = splitModelPatternSuffix(pattern);
			let globPattern = pattern;
			let thinkingLevel;
			if (suffix && isValidThinkingLevel(suffix[1])) {
				thinkingLevel = suffix[1];
				globPattern = suffix[0];
			}
			matches = availableModels.filter((m) => {
				const fullId = `${m.provider}/${m.id}`;
				return minimatch(fullId, globPattern, { nocase: true }) || minimatch(m.id, globPattern, { nocase: true });
			}).map((model) => ({
				model,
				thinkingLevel
			}));
		} else {
			const { model, thinkingLevel, warning } = parseModelPattern(pattern, availableModels);
			if (warning) console.warn(chalk.yellow(`Warning: ${warning}`));
			matches = model ? [{
				model,
				thinkingLevel
			}] : [];
		}
		if (matches.length === 0) console.warn(chalk.yellow(`Warning: No models match pattern "${pattern}"`));
		for (const match of matches) if (!scopedModels.some((scoped) => modelsAreEqual(scoped.model, match.model))) scopedModels.push(match);
	}
	return scopedModels;
}
/**
* Resolve a single model from CLI flags.
*
* Supports:
* - --provider <provider> --model <pattern>
* - --model <provider>/<pattern>
* - Fuzzy matching (same rules as model scoping: exact id, then partial id/name)
*
* Note: This does not apply the thinking level by itself, but it may *parse* and
* return a thinking level from "<pattern>:<thinking>" so the caller can apply it.
*/
function resolveCliModel(options) {
	const { cliProvider, cliModel, cliThinking, modelRegistry } = options;
	if (!cliModel) return {
		model: void 0,
		warning: void 0,
		error: void 0
	};
	const availableModels = modelRegistry.getAll();
	if (availableModels.length === 0) return {
		model: void 0,
		warning: void 0,
		error: "No models available. Check your installation or add models to models.json."
	};
	let scopeGroups;
	if (cliProvider) {
		const models = scopeModelsToProvider(cliProvider, availableModels);
		if (!models.length) return {
			model: void 0,
			warning: void 0,
			error: `Unknown provider "${cliProvider}". Use --list-models to see available providers/models.`
		};
		const prefix = `${cliProvider}/`;
		scopeGroups = [[[cliModel.toLowerCase().startsWith(prefix.toLowerCase()) ? cliModel.slice(prefix.length) : cliModel, models]]];
	} else scopeGroups = collectQualifiedModelScopes(cliModel.trim(), availableModels);
	const parse = (pattern, models) => parseModelPattern(pattern, models, { allowInvalidThinkingLevelFallback: false });
	const canonicalMatches = cliProvider ? [] : collectModelPatternMatches(cliModel, availableModels, true);
	let parsed = canonicalMatches.length ? parse(cliModel, canonicalMatches) : void 0;
	for (const scopes of scopeGroups) {
		if (parsed) break;
		const matches = scopes.map(([scopePattern, models]) => {
			const candidates = models.some((entry) => entry.provider !== models[0]?.provider) ? collectModelPatternMatches(scopePattern, models) : models;
			return parse(scopePattern, candidates);
		}).filter((result) => result.model || result.warning);
		parsed = matches.find((result) => result.warning) ?? (matches.length > 1 ? {
			model: void 0,
			warning: ambiguousModelReference(cliModel)
		} : matches[0]);
	}
	parsed ??= cliProvider ? void 0 : parse(cliModel, availableModels);
	if (parsed?.model || parsed?.warning) return {
		model: parsed.model,
		thinkingLevel: parsed.thinkingLevel,
		warning: parsed.model ? parsed.warning : void 0,
		error: parsed.model ? void 0 : parsed.warning
	};
	const fallbackScopes = scopeGroups.find((scopes) => scopes.length) ?? [];
	const providers = new Set(fallbackScopes.flatMap(([, models]) => models.map((entry) => entry.provider)));
	if (providers.size > 1) return {
		model: void 0,
		warning: void 0,
		error: ambiguousModelReference(cliModel)
	};
	const [provider] = providers;
	const pattern = fallbackScopes[0]?.[0] ?? cliModel;
	if (provider) {
		let fallbackPattern = pattern;
		let fallbackThinking;
		const suffix = splitModelPatternSuffix(pattern);
		if (!cliThinking && suffix && isValidThinkingLevel(suffix[1])) {
			fallbackPattern = suffix[0];
			fallbackThinking = suffix[1];
		}
		const fallbackModel = buildFallbackModel(provider, fallbackPattern, availableModels);
		if (fallbackModel) {
			const requestedThinking = cliThinking ?? fallbackThinking;
			return {
				model: requestedThinking && requestedThinking !== "off" ? {
					...fallbackModel,
					reasoning: true
				} : fallbackModel,
				thinkingLevel: requestedThinking,
				warning: `Model "${fallbackPattern}" not found for provider "${provider}". Using custom model id.`,
				error: void 0
			};
		}
	}
	return {
		model: void 0,
		thinkingLevel: void 0,
		warning: void 0,
		error: `Model "${provider ? `${provider}/${pattern}` : cliModel}" not found. Use --list-models to see available models.`
	};
}
/**
* Find the initial model to use based on priority:
* 1. CLI args (provider + model)
* 2. First model from scoped models (if not continuing/resuming)
* 3. Restored from session (if continuing/resuming)
* 4. Saved default from settings
* 5. First available model with valid API key
*/
async function findInitialModel(options) {
	const { cliProvider, cliModel, scopedModels, isContinuing, defaultProvider, defaultModelId, defaultThinkingLevel, modelRegistry } = options;
	if (cliProvider && cliModel) {
		const resolved = resolveCliModel({
			cliProvider,
			cliModel,
			modelRegistry
		});
		if (resolved.error) {
			console.error(chalk.red(resolved.error));
			process.exit(1);
		}
		if (resolved.model) return {
			model: resolved.model,
			thinkingLevel: resolved.thinkingLevel ?? "medium",
			fallbackMessage: void 0
		};
	}
	const scopedModel = scopedModels[0];
	if (scopedModel && !isContinuing) return {
		model: scopedModel.model,
		thinkingLevel: scopedModel.thinkingLevel ?? defaultThinkingLevel ?? "medium",
		fallbackMessage: void 0
	};
	if (defaultProvider && defaultModelId) {
		const found = modelRegistry.find(defaultProvider, defaultModelId);
		if (found && modelRegistry.hasConfiguredAuth(found)) return {
			model: found,
			thinkingLevel: defaultThinkingLevel || "medium",
			fallbackMessage: void 0
		};
	}
	return {
		model: selectAvailableFallbackModel(modelRegistry.getAvailable()),
		thinkingLevel: DEFAULT_THINKING_LEVEL,
		fallbackMessage: void 0
	};
}
/**
* Restore model from session, with fallback to available models
*/
async function restoreModelFromSession(savedProvider, savedModelId, currentModel, shouldPrintMessages, modelRegistry) {
	const restoredModel = modelRegistry.find(savedProvider, savedModelId);
	if (restoredModel && modelRegistry.hasConfiguredAuth(restoredModel)) {
		if (shouldPrintMessages) console.log(chalk.dim(`Restored model: ${savedProvider}/${savedModelId}`));
		return {
			model: restoredModel,
			fallbackMessage: void 0
		};
	}
	const reason = !restoredModel ? "model no longer exists" : "no auth configured";
	if (shouldPrintMessages) console.error(chalk.yellow(`Warning: Could not restore model ${savedProvider}/${savedModelId} (${reason}).`));
	const fallbackModel = currentModel ?? selectAvailableFallbackModel(modelRegistry.getAvailable());
	if (!fallbackModel) return {
		model: void 0,
		fallbackMessage: void 0
	};
	if (shouldPrintMessages) console.log(chalk.dim(`Falling back to: ${fallbackModel.provider}/${fallbackModel.id}`));
	return {
		model: fallbackModel,
		fallbackMessage: `Could not restore model ${savedProvider}/${savedModelId} (${reason}). Using ${fallbackModel.provider}/${fallbackModel.id}.`
	};
}
//#endregion
//#region src/agents/sessions/package-manager.ts
function resourcePrecedenceRank(m) {
	if (m.origin === "package") return 4;
	return (m.scope === "project" ? 0 : 2) + (m.source === "local" ? 0 : 1);
}
const RESOURCE_TYPES = [
	"extensions",
	"skills",
	"prompts",
	"themes"
];
const FILE_PATTERNS = {
	extensions: /\.(ts|js)$/,
	skills: /\.md$/,
	prompts: /\.md$/,
	themes: /\.json$/
};
function getHomeDir() {
	return process.env.HOME || homedir();
}
function getAgentResourceTempDir(agentDir) {
	const tempDir = join(agentDir, "tmp", "resources");
	mkdirSync(tempDir, {
		recursive: true,
		mode: 448
	});
	chmodSync(tempDir, 448);
	return tempDir;
}
function isOverridePattern(s) {
	return s.startsWith("!") || s.startsWith("+") || s.startsWith("-");
}
function hasGlobPattern(s) {
	return s.includes("*") || s.includes("?");
}
function splitPatterns(entries) {
	const plain = [];
	const patterns = [];
	for (const entry of entries) if (isOverridePattern(entry) || hasGlobPattern(entry)) patterns.push(entry);
	else plain.push(entry);
	return {
		plain,
		patterns
	};
}
function collectDirectoryEntries(dir, root, ignoreMatcher, options = {}) {
	if (!existsSync(dir)) return {
		entries: [],
		ignoreMatcher
	};
	const entries = [];
	const ig = addIgnoreRules(dir, root, ignoreMatcher);
	try {
		for (const entry of readdirSync(dir, { withFileTypes: true })) {
			if (entry.name.startsWith(".") || entry.name === "node_modules") continue;
			const fullPath = join(dir, entry.name);
			if (options.requireWithinRoot && !isRealPathWithinRoot(root, fullPath)) continue;
			let isDirectory = entry.isDirectory();
			let isFile = entry.isFile();
			if (entry.isSymbolicLink()) try {
				const stats = statSync(fullPath);
				isDirectory = stats.isDirectory();
				isFile = stats.isFile();
			} catch {
				continue;
			}
			const relativePath = normalizeNativePathSeparators(relative(root, fullPath));
			if (ig.ignores(isDirectory ? `${relativePath}/` : relativePath)) continue;
			entries.push({
				name: entry.name,
				fullPath,
				isDirectory,
				isFile
			});
		}
	} catch {}
	return {
		entries,
		ignoreMatcher: ig
	};
}
function collectFiles(dir, filePattern, ignoreMatcher, rootDir) {
	const files = [];
	const root = rootDir ?? dir;
	const directory = collectDirectoryEntries(dir, root, ignoreMatcher);
	for (const entry of directory.entries) if (entry.isDirectory) files.push(...collectFiles(entry.fullPath, filePattern, directory.ignoreMatcher, root));
	else if (entry.isFile && filePattern.test(entry.name)) files.push(entry.fullPath);
	return files;
}
function collectSkillEntries(dir, mode, ignoreMatcher, rootDir) {
	const entries = [];
	const root = rootDir ?? dir;
	const directory = collectDirectoryEntries(dir, root, ignoreMatcher, { requireWithinRoot: true });
	const skill = directory.entries.find((entry) => entry.name === "SKILL.md" && entry.isFile);
	if (skill) return [skill.fullPath];
	for (const entry of directory.entries) {
		if (mode === "openclaw" && dir === root && entry.isFile && entry.name.endsWith(".md")) {
			entries.push(entry.fullPath);
			continue;
		}
		if (!entry.isDirectory) continue;
		entries.push(...collectSkillEntries(entry.fullPath, mode, directory.ignoreMatcher, root));
	}
	return entries;
}
function collectAncestorAgentsSkillDirs(startDir) {
	const skillDirs = [];
	let dir = resolve(startDir);
	while (true) {
		skillDirs.push(join(dir, ".agents", "skills"));
		if (existsSync(join(dir, ".git"))) break;
		const parent = dirname(dir);
		if (parent === dir) break;
		dir = parent;
	}
	return skillDirs;
}
function collectTopLevelAutoResourceEntries(dir, resourceType) {
	const entries = [];
	const directory = collectDirectoryEntries(dir, dir, void 0, { requireWithinRoot: true });
	for (const entry of directory.entries) if (entry.isFile && FILE_PATTERNS[resourceType].test(entry.name)) entries.push(entry.fullPath);
	return entries;
}
function readResourceManifestFile(packageJsonPath) {
	try {
		const content = readFileSync(packageJsonPath, "utf-8");
		return JSON.parse(content).openclaw ?? null;
	} catch {
		return null;
	}
}
function resolveExtensionEntries(dir, rootDir = dir) {
	const packageJsonPath = join(dir, "package.json");
	if (existsSync(packageJsonPath)) {
		const manifest = readResourceManifestFile(packageJsonPath);
		if (manifest?.extensions?.length) {
			const entries = [];
			for (const extPath of manifest.extensions) {
				const resolvedExtPath = resolve(dir, extPath);
				if (existsSync(resolvedExtPath) && isRealPathWithinRoot(rootDir, resolvedExtPath)) entries.push(resolvedExtPath);
			}
			if (entries.length > 0) return entries;
		}
	}
	for (const filename of ["index.ts", "index.js"]) {
		const path = join(dir, filename);
		if (existsSync(path) && isRealPathWithinRoot(rootDir, path)) return [path];
	}
	return null;
}
function collectAutoExtensionEntries(dir) {
	const entries = [];
	const rootEntries = resolveExtensionEntries(dir);
	if (rootEntries) return rootEntries;
	const directory = collectDirectoryEntries(dir, dir, void 0, { requireWithinRoot: true });
	for (const entry of directory.entries) if (entry.isFile && (entry.name.endsWith(".ts") || entry.name.endsWith(".js"))) entries.push(entry.fullPath);
	else if (entry.isDirectory) {
		const resolvedEntries = resolveExtensionEntries(entry.fullPath, dir);
		if (resolvedEntries) entries.push(...resolvedEntries);
	}
	return entries;
}
/**
* Collect resource files from a directory based on resource type.
* Extensions use smart discovery (index.ts in subdirs), others use recursive collection.
*/
function collectResourceFiles(dir, resourceType) {
	if (resourceType === "skills") return collectSkillEntries(dir, "openclaw");
	if (resourceType === "extensions") return collectAutoExtensionEntries(dir);
	return collectFiles(dir, FILE_PATTERNS[resourceType]);
}
const AUTO_RESOURCE_COLLECTORS = {
	extensions: collectAutoExtensionEntries,
	skills: (dir) => collectSkillEntries(dir, "openclaw"),
	prompts: (dir) => collectTopLevelAutoResourceEntries(dir, "prompts"),
	themes: (dir) => collectTopLevelAutoResourceEntries(dir, "themes")
};
function resolveRealPathIfPossible(path) {
	try {
		return realpathSync.native(path);
	} catch {
		return resolve(path);
	}
}
function isRealPathWithinRoot(root, candidate) {
	return isPathInside(resolveRealPathIfPossible(resolve(root)), resolveRealPathIfPossible(candidate));
}
function getMatchCandidates(filePath, baseDir, includeNames) {
	const name = basename(filePath);
	const candidates = [normalizeNativePathSeparators(relative(baseDir, filePath)), normalizeNativePathSeparators(filePath)];
	if (includeNames) candidates.push(name);
	if (name === "SKILL.md") {
		const parentDir = dirname(filePath);
		candidates.push(normalizeNativePathSeparators(relative(baseDir, parentDir)), normalizeNativePathSeparators(parentDir));
		if (includeNames) candidates.push(basename(parentDir));
	}
	return candidates;
}
function matchesAnyPattern(filePath, patterns, baseDir) {
	const candidates = getMatchCandidates(filePath, baseDir, true);
	return patterns.some((pattern) => minimatch.match(candidates, normalizeNativePathSeparators(pattern)).length > 0);
}
function normalizeExactPattern(pattern) {
	const normalized = pattern.startsWith("./") || pattern.startsWith(".\\") ? pattern.slice(2) : pattern;
	return normalizeNativePathSeparators(normalized);
}
function matchesAnyExactPattern(filePath, patterns, baseDir) {
	const candidates = new Set(getMatchCandidates(filePath, baseDir, false));
	return patterns.some((pattern) => candidates.has(normalizeExactPattern(pattern)));
}
function isEnabledByOverrides(filePath, patterns, baseDir) {
	return applyPatterns([filePath], patterns.filter(isOverridePattern), baseDir).has(filePath);
}
/**
* Apply patterns to paths and return a Set of enabled paths.
* Pattern types:
* - Plain patterns: include matching paths
* - `!pattern`: exclude matching paths
* - `+path`: force-include exact path (overrides exclusions)
* - `-path`: force-exclude exact path (overrides force-includes)
*/
function applyPatterns(allPaths, patterns, baseDir) {
	const includes = [];
	const excludes = [];
	const forceIncludes = [];
	const forceExcludes = [];
	for (const p of patterns) if (p.startsWith("+")) forceIncludes.push(p.slice(1));
	else if (p.startsWith("-")) forceExcludes.push(p.slice(1));
	else if (p.startsWith("!")) excludes.push(p.slice(1));
	else includes.push(p);
	let result;
	if (includes.length === 0) result = [...allPaths];
	else result = allPaths.filter((filePath) => matchesAnyPattern(filePath, includes, baseDir));
	if (excludes.length > 0) result = result.filter((filePath) => !matchesAnyPattern(filePath, excludes, baseDir));
	if (forceIncludes.length > 0) {
		for (const filePath of allPaths) if (!result.includes(filePath) && matchesAnyExactPattern(filePath, forceIncludes, baseDir)) result.push(filePath);
	}
	if (forceExcludes.length > 0) result = result.filter((filePath) => !matchesAnyExactPattern(filePath, forceExcludes, baseDir));
	return new Set(result);
}
function getPackageFilter(pkg) {
	if (typeof pkg === "string") return;
	return RESOURCE_TYPES.some((resourceType) => pkg[resourceType] !== void 0) ? pkg : void 0;
}
var DefaultPackageManager = class {
	constructor(options) {
		this.cwd = options.cwd;
		this.agentDir = options.agentDir;
		this.settingsManager = options.settingsManager;
	}
	async resolve(onMissing) {
		const accumulator = this.createAccumulator();
		const globalSettings = this.settingsManager.getGlobalSettings();
		const projectSettings = this.settingsManager.getProjectSettings();
		const allPackages = [];
		for (const pkg of projectSettings.packages ?? []) allPackages.push({
			pkg,
			scope: "project"
		});
		for (const pkg of globalSettings.packages ?? []) allPackages.push({
			pkg,
			scope: "user"
		});
		const packageSources = this.dedupePackages(allPackages);
		await this.resolvePackageSources(packageSources, accumulator, onMissing);
		const globalBaseDir = this.agentDir;
		const projectBaseDir = join(this.cwd, CONFIG_DIR_NAME);
		const localScopes = [{
			scope: "project",
			settings: projectSettings,
			baseDir: projectBaseDir
		}, {
			scope: "user",
			settings: globalSettings,
			baseDir: globalBaseDir
		}];
		for (const resourceType of RESOURCE_TYPES) for (const { scope, settings, baseDir } of localScopes) this.resolveLocalEntries(settings[resourceType] ?? [], resourceType, accumulator[resourceType], {
			source: "local",
			scope,
			origin: "top-level"
		}, baseDir);
		this.addAutoDiscoveredResources(accumulator, globalSettings, projectSettings, globalBaseDir, projectBaseDir);
		return this.toResolvedPaths(accumulator);
	}
	async resolveExtensionSources(sources, options) {
		const accumulator = this.createAccumulator();
		const scope = options?.temporary ? "temporary" : options?.local ? "project" : "user";
		const packageSources = sources.map((pkg) => ({
			pkg,
			scope
		}));
		await this.resolvePackageSources(packageSources, accumulator);
		return this.toResolvedPaths(accumulator);
	}
	async resolvePackageSources(sources, accumulator, onMissing) {
		for (const { pkg, scope } of sources) {
			const sourceStr = typeof pkg === "string" ? pkg : pkg.source;
			const filter = getPackageFilter(pkg);
			const parsed = this.parseSource(sourceStr);
			const metadata = {
				source: sourceStr,
				scope,
				origin: "package"
			};
			const target = this.resolvePackageTarget(parsed, scope);
			if (!target) continue;
			if (target.kind === "missing") {
				if (onMissing && await onMissing(sourceStr) === "error") throw new Error(`Missing source: ${sourceStr}`);
				continue;
			}
			metadata.baseDir = target.baseDir;
			if (target.kind === "file" || !this.collectPackageResources(target.path, accumulator, filter, metadata) && parsed.type === "local") this.addResource(accumulator.extensions, target.path, metadata, this.isExtensionEnabled(target.path, filter?.extensions, target.baseDir));
		}
	}
	resolvePackageTarget(source, scope) {
		if (source.type === "npm") {
			const path = this.getNpmInstallPath(source, scope);
			return !existsSync(path) || source.pinned && !this.installedNpmMatchesPinnedVersion(source, path) ? { kind: "missing" } : {
				kind: "directory",
				path,
				baseDir: path
			};
		}
		if (source.type === "git") {
			const path = this.getGitInstallPath(source, scope);
			return existsSync(path) ? {
				kind: "directory",
				path,
				baseDir: path
			} : { kind: "missing" };
		}
		const path = this.resolvePathFromBase(source.path, this.getBaseDirForScope(scope));
		if (!existsSync(path)) return { kind: "missing" };
		try {
			const stats = statSync(path);
			if (stats.isFile()) return {
				kind: "file",
				path,
				baseDir: dirname(path)
			};
			if (stats.isDirectory()) return {
				kind: "directory",
				path,
				baseDir: path
			};
		} catch {}
	}
	isExtensionEnabled(path, patterns, baseDir) {
		if (patterns === void 0) return true;
		return patterns.length > 0 && applyPatterns([path], patterns, baseDir).has(path);
	}
	parseSource(source) {
		if (source.startsWith("npm:")) {
			const spec = source.slice(4).trim();
			const { name, version } = this.parseNpmSpec(spec);
			return {
				type: "npm",
				spec,
				name,
				pinned: Boolean(version)
			};
		}
		if (isLocalPath(source)) return {
			type: "local",
			path: source
		};
		return parseGitUrl(source) ?? {
			type: "local",
			path: source
		};
	}
	installedNpmMatchesPinnedVersion(source, installedPath) {
		const packageJsonPath = join(installedPath, "package.json");
		if (!existsSync(packageJsonPath)) return false;
		try {
			const content = readFileSync(packageJsonPath, "utf-8");
			const pkg = JSON.parse(content);
			const { version } = this.parseNpmSpec(source.spec);
			return Boolean(pkg.version) && (!version || pkg.version === version);
		} catch {
			return false;
		}
	}
	/** Ignore versions and normalize git transports when deduplicating scoped packages. */
	getPackageIdentity(source, scope) {
		const parsed = this.parseSource(source);
		if (parsed.type === "npm") return `npm:${parsed.name}`;
		if (parsed.type === "git") return `git:${parsed.host}/${parsed.path}`;
		return `local:${this.resolvePathFromBase(parsed.path, this.getBaseDirForScope(scope))}`;
	}
	dedupePackages(packages) {
		const seen = /* @__PURE__ */ new Set();
		return packages.filter((entry) => {
			const sourceStr = typeof entry.pkg === "string" ? entry.pkg : entry.pkg.source;
			const identity = this.getPackageIdentity(sourceStr, entry.scope);
			if (seen.has(identity)) return false;
			seen.add(identity);
			return true;
		});
	}
	parseNpmSpec(spec) {
		const match = spec.match(/^(@?[^@]+(?:\/[^@]+)?)(?:@(.+))?$/);
		if (!match) return { name: spec };
		return {
			name: match[1] ?? spec,
			version: match[2]
		};
	}
	getNpmInstallPath(source, scope) {
		if (scope === "temporary") return join(this.getTemporaryDir("npm"), "node_modules", source.name);
		return join(this.getBaseDirForScope(scope), "npm", "node_modules", source.name);
	}
	getGitInstallPath(source, scope) {
		if (scope === "temporary") return this.getTemporaryDir(`git-${source.host}`, source.path);
		return join(this.getBaseDirForScope(scope), "git", source.host, source.path);
	}
	getTemporaryDir(prefix, suffix) {
		const hash = createHash("sha256").update(`${prefix}-${suffix ?? ""}`).digest("hex").slice(0, 8);
		return join(getAgentResourceTempDir(this.agentDir), prefix, hash, suffix ?? "");
	}
	getBaseDirForScope(scope) {
		if (scope === "project") return join(this.cwd, CONFIG_DIR_NAME);
		if (scope === "user") return this.agentDir;
		return this.cwd;
	}
	resolvePathFromBase(input, baseDir) {
		const trimmed = input.trim();
		if (trimmed === "~") return getHomeDir();
		if (trimmed.startsWith("~/")) return join(getHomeDir(), trimmed.slice(2));
		if (trimmed.startsWith("~")) return join(getHomeDir(), trimmed.slice(1));
		return resolve(baseDir, trimmed);
	}
	collectPackageResources(packageRoot, accumulator, filter, metadata) {
		const manifest = readResourceManifestFile(join(packageRoot, "package.json"));
		const hasPackageLayout = manifest !== null || RESOURCE_TYPES.some((type) => existsSync(join(packageRoot, type)));
		for (const resourceType of RESOURCE_TYPES) {
			const patterns = filter?.[resourceType];
			const entries = manifest?.[resourceType];
			const useManifest = patterns !== void 0 ? Boolean(entries?.length) : manifest !== null && (!filter || entries !== void 0);
			let allFiles;
			if (useManifest) {
				const files = this.collectFilesFromManifestEntries(entries ?? [], packageRoot, resourceType);
				const enabled = applyPatterns(files, (entries ?? []).filter(isOverridePattern), packageRoot);
				allFiles = patterns === void 0 ? files.filter((file) => enabled.has(file)) : [...enabled];
			} else allFiles = this.collectConventionResourceFiles(packageRoot, resourceType);
			const enabledByUser = patterns === void 0 ? void 0 : patterns.length > 0 ? applyPatterns(allFiles, patterns, packageRoot) : /* @__PURE__ */ new Set();
			for (const path of allFiles) this.addResource(accumulator[resourceType], path, metadata, enabledByUser?.has(path) ?? true);
		}
		return hasPackageLayout;
	}
	collectConventionResourceFiles(packageRoot, resourceType) {
		const conventionDir = join(packageRoot, resourceType);
		if (!existsSync(conventionDir)) return [];
		return this.filterManifestResourcePaths(collectResourceFiles(conventionDir, resourceType), packageRoot);
	}
	collectFilesFromManifestEntries(entries, root, resourceType) {
		const resolved = entries.filter((entry) => !isOverridePattern(entry)).flatMap((entry) => {
			if (!hasGlobPattern(entry)) return [resolve(root, entry)];
			return globSync(entry, { cwd: root }).map((match) => resolve(root, match));
		});
		return this.collectFilesFromPaths(this.filterManifestResourcePaths(resolved, root), resourceType);
	}
	filterManifestResourcePaths(paths, root) {
		const resolvedRoot = resolve(root);
		const realRoot = resolveRealPathIfPossible(resolvedRoot);
		return paths.filter((path) => {
			const resolvedPath = resolve(path);
			if (!isPathInside(resolvedRoot, resolvedPath)) return false;
			return isPathInside(realRoot, resolveRealPathIfPossible(resolvedPath));
		});
	}
	resolveLocalEntries(entries, resourceType, target, metadata, baseDir) {
		if (entries.length === 0) return;
		const { plain, patterns } = splitPatterns(entries);
		const resolvedPlain = plain.map((p) => this.resolvePathFromBase(p, baseDir));
		const allFiles = this.collectFilesFromPaths(resolvedPlain, resourceType);
		const enabledPaths = applyPatterns(allFiles, patterns, baseDir);
		for (const f of allFiles) this.addResource(target, f, metadata, enabledPaths.has(f));
	}
	addAutoDiscoveredResources(accumulator, globalSettings, projectSettings, globalBaseDir, projectBaseDir) {
		const userAgentsSkillsDir = join(getHomeDir(), ".agents", "skills");
		const projectAgentsSkillDirs = collectAncestorAgentsSkillDirs(this.cwd).filter((dir) => resolve(dir) !== resolve(userAgentsSkillsDir));
		const addScopeResources = (options) => {
			const metadata = {
				source: "auto",
				scope: options.scope,
				origin: "top-level",
				baseDir: options.baseDir
			};
			const addResources = (resourceType, paths, resourceMetadata = metadata, patternBaseDir = options.baseDir) => {
				for (const path of paths) this.addResource(accumulator[resourceType], path, resourceMetadata, isEnabledByOverrides(path, options.settings[resourceType] ?? [], patternBaseDir));
			};
			for (const resourceType of RESOURCE_TYPES) {
				addResources(resourceType, AUTO_RESOURCE_COLLECTORS[resourceType](join(options.baseDir, resourceType)));
				if (resourceType !== "skills") continue;
				for (const skillsDir of options.agentsSkillDirs) {
					const agentsBaseDir = dirname(skillsDir);
					addResources("skills", collectSkillEntries(skillsDir, "agents"), {
						...metadata,
						baseDir: agentsBaseDir
					}, agentsBaseDir);
				}
			}
		};
		addScopeResources({
			scope: "project",
			settings: projectSettings,
			baseDir: projectBaseDir,
			agentsSkillDirs: projectAgentsSkillDirs
		});
		addScopeResources({
			scope: "user",
			settings: globalSettings,
			baseDir: globalBaseDir,
			agentsSkillDirs: isDefaultStateDir() ? [userAgentsSkillsDir] : []
		});
	}
	collectFilesFromPaths(paths, resourceType) {
		const files = [];
		for (const p of paths) {
			if (!existsSync(p)) continue;
			try {
				const stats = statSync(p);
				if (stats.isFile()) files.push(p);
				else if (stats.isDirectory()) files.push(...collectResourceFiles(p, resourceType));
			} catch {}
		}
		return files;
	}
	addResource(map, path, metadata, enabled) {
		if (!map.has(path)) map.set(path, {
			metadata,
			enabled
		});
	}
	createAccumulator() {
		return {
			extensions: /* @__PURE__ */ new Map(),
			skills: /* @__PURE__ */ new Map(),
			prompts: /* @__PURE__ */ new Map(),
			themes: /* @__PURE__ */ new Map()
		};
	}
	toResolvedPaths(accumulator) {
		const mapToResolved = (entries) => {
			const resolved = Array.from(entries.entries()).map(([path, { metadata, enabled }]) => ({
				path,
				enabled,
				metadata
			}));
			resolved.sort((a, b) => resourcePrecedenceRank(a.metadata) - resourcePrecedenceRank(b.metadata));
			const seen = /* @__PURE__ */ new Set();
			return resolved.filter((entry) => {
				const canonicalPath = canonicalizePath(entry.path);
				if (seen.has(canonicalPath)) return false;
				seen.add(canonicalPath);
				return true;
			});
		};
		return {
			extensions: mapToResolved(accumulator.extensions),
			skills: mapToResolved(accumulator.skills),
			prompts: mapToResolved(accumulator.prompts),
			themes: mapToResolved(accumulator.themes)
		};
	}
};
//#endregion
//#region src/agents/sessions/http-dispatcher.ts
const DEFAULT_HTTP_IDLE_TIMEOUT_MS = 3e5;
/** Parses idle timeout values, using `0` for the explicit disabled sentinel. */
function parseHttpIdleTimeoutMs(value) {
	if (typeof value === "string") {
		const trimmed = value.trim();
		if (trimmed.toLowerCase() === "disabled") return 0;
		if (trimmed.length === 0) return;
		return parseStrictNonNegativeInteger(trimmed);
	}
	if (typeof value !== "number" || !Number.isFinite(value) || value < 0) return;
	return Math.floor(value);
}
//#endregion
//#region src/agents/sessions/settings-storage.ts
const SETTINGS_SCOPES = ["global", "project"];
function replaceSettingsFile(path, content) {
	const savePath = resolveJsonSaveTarget(path);
	const saveDir = realpathSync(dirname(savePath));
	const canonicalSavePath = join(saveDir, basename(savePath));
	replaceFileAtomicSync({
		filePath: canonicalSavePath,
		content,
		dirMode: statSync(saveDir).mode & 4095,
		mode: 438 & ~process.umask(),
		preserveExistingMode: true,
		tempPrefix: basename(canonicalSavePath)
	});
}
var FileSettingsStorage = class {
	constructor(cwd, agentDir) {
		this.paths = {
			global: join(agentDir, "settings.json"),
			project: join(cwd, CONFIG_DIR_NAME, "settings.json")
		};
	}
	readSettingsScope(scope) {
		const path = this.paths[scope];
		if (!lstatSync(`${path}.lock`, { throwIfNoEntry: false }) && !lstatSync(`${path}.lock.reclaim`, { throwIfNoEntry: false }) && !existsSync(path)) return;
		let content;
		this.withLock(scope, (current) => {
			content = current;
		});
		return content;
	}
	withLock(scope, fn) {
		const path = this.paths[scope];
		const release = acquireFileLockSyncWithRetry(path);
		try {
			const next = fn(existsSync(path) ? readFileSync(path, "utf-8") : void 0);
			if (next !== void 0) replaceSettingsFile(path, next);
		} finally {
			release();
		}
	}
};
var InMemorySettingsStorage = class {
	constructor() {
		this.values = {
			global: void 0,
			project: void 0
		};
	}
	withLock(scope, fn) {
		const next = fn(this.values[scope]);
		if (next !== void 0) this.values[scope] = next;
	}
};
//#endregion
//#region src/agents/sessions/settings-manager.ts
/**
* Session settings manager.
*
* Loads and persists user/session defaults for models, transports, retry policy, UI, packages, and telemetry.
*/
/** Deep merge settings: project/overrides take precedence, nested objects merge recursively */
function deepMergeSettings(base, overrides) {
	return mergeDeep(base, overrides);
}
function requireSupportedSettings(value, scope) {
	if (!isRecord(value)) throw new TypeError("Session settings must be an object");
	const retired = [];
	if (Object.hasOwn(value, "queueMode")) retired.push("queueMode: use steeringMode");
	if (Object.hasOwn(value, "websockets")) retired.push("websockets: use transport (true becomes \"websocket\", false becomes \"sse\")");
	if (isRecord(value.skills)) retired.push("skills: use its customDirectories array (or []), and move skills.enableSkillCommands to top-level enableSkillCommands if present");
	if (isRecord(value.retry) && Object.hasOwn(value.retry, "maxDelayMs")) retired.push("retry.maxDelayMs: use retry.provider.maxRetryDelayMs");
	if (retired.length > 0) throw createInvalidConfigError(`${scope} session settings.json`, `Retired session settings: ${retired.join("; ")}. Preserve the original file and replace the retired forms while retaining existing canonical values before retrying. For a staged upgrade, OpenClaw 2026.9.7 retains the former settings reader. See https://docs.openclaw.ai/gateway/doctor/config-migrations#session-settings.`, { recovery: "manual" });
	return value;
}
var SettingsManager = class SettingsManager {
	constructor(storage, scopes) {
		this.storage = storage;
		this.scopes = scopes;
		this.settings = {};
		this.runtimeOverrides = {};
		this.writeQueue = Promise.resolve();
		this.errors = SETTINGS_SCOPES.flatMap((scope) => {
			const error = scopes[scope].loadError;
			return error ? [{
				scope,
				error
			}] : [];
		});
		this.recomputeSettings();
	}
	/** Create a SettingsManager that loads from files */
	static create(cwd, agentDir = getAgentDir()) {
		return SettingsManager.fromStorage(new FileSettingsStorage(cwd, agentDir));
	}
	/** Create a SettingsManager from an arbitrary storage backend */
	static fromStorage(storage) {
		return new SettingsManager(storage, {
			global: SettingsManager.loadScope(storage, "global"),
			project: SettingsManager.loadScope(storage, "project")
		});
	}
	/** Create an in-memory SettingsManager (no file I/O) */
	static inMemory(settings = {}) {
		const storage = new InMemorySettingsStorage();
		const initialSettings = requireSupportedSettings(structuredClone(settings), "global");
		storage.withLock("global", () => JSON.stringify(initialSettings, null, 2));
		return SettingsManager.fromStorage(storage);
	}
	static loadScope(storage, scope) {
		let content;
		try {
			if (storage.readSettingsScope) content = storage.readSettingsScope(scope);
			else storage.withLock(scope, (current) => {
				content = current;
			});
			const settings = content ? requireSupportedSettings(JSON.parse(content), scope) : {};
			return SettingsManager.createScopeState(settings);
		} catch (error) {
			if (isInvalidConfigError(error)) throw error;
			return SettingsManager.createScopeState({}, error);
		}
	}
	static createScopeState(settings, loadError = null) {
		return {
			settings,
			modified: /* @__PURE__ */ new Map(),
			loadError
		};
	}
	getGlobalSettings() {
		return structuredClone(this.scopes.global.settings);
	}
	getProjectSettings() {
		return structuredClone(this.scopes.project.settings);
	}
	recomputeSettings() {
		this.settings = deepMergeSettings(deepMergeSettings(this.scopes.global.settings, this.scopes.project.settings), this.runtimeOverrides);
	}
	async reload() {
		await this.writeQueue;
		for (const scope of SETTINGS_SCOPES) {
			const state = this.scopes[scope];
			const loaded = SettingsManager.loadScope(this.storage, scope);
			if (loaded.loadError) {
				state.loadError = loaded.loadError;
				this.recordError(scope, loaded.loadError);
			} else {
				state.settings = loaded.settings;
				state.loadError = null;
			}
			state.modified.clear();
		}
		this.recomputeSettings();
	}
	/** Apply non-persisted overrides on top of global/project settings. */
	applyOverrides(overrides) {
		this.runtimeOverrides = deepMergeSettings(this.runtimeOverrides, overrides);
		this.recomputeSettings();
	}
	markModified(scope, field, nestedKey) {
		const state = this.scopes[scope];
		const existing = state.modified.get(field);
		if (!nestedKey || existing === null) {
			state.modified.set(field, null);
			return;
		}
		const nestedFields = existing ?? /* @__PURE__ */ new Set();
		nestedFields.add(nestedKey);
		state.modified.set(field, nestedFields);
	}
	recordError(scope, error) {
		const normalizedError = error instanceof Error ? error : new Error(String(error));
		this.errors.push({
			scope,
			error: normalizedError
		});
	}
	persistScopedSettings(scope, snapshotSettings, modified) {
		this.storage.withLock(scope, (current) => {
			const currentFileSettings = current ? requireSupportedSettings(JSON.parse(current), scope) : {};
			const mergedSettings = { ...currentFileSettings };
			for (const [field, nestedModified] of modified) {
				const value = snapshotSettings[field];
				if (nestedModified && typeof value === "object" && value !== null) {
					const baseNested = currentFileSettings[field] ?? {};
					const inMemoryNested = value;
					const mergedNested = { ...baseNested };
					for (const nestedKey of nestedModified) mergedNested[nestedKey] = inMemoryNested[nestedKey];
					mergedSettings[field] = mergedNested;
				} else mergedSettings[field] = value;
			}
			return JSON.stringify(mergedSettings, null, 2);
		});
	}
	save(scope) {
		this.recomputeSettings();
		const state = this.scopes[scope];
		if (state.loadError) return;
		const snapshotSettings = structuredClone(state.settings);
		const modified = new Map([...state.modified].map(([field, nested]) => [field, nested && new Set(nested)]));
		this.writeQueue = this.writeQueue.then(() => {
			this.persistScopedSettings(scope, snapshotSettings, modified);
			state.modified.clear();
		}).catch((error) => {
			this.recordError(scope, error);
		});
	}
	setScopedSetting(scope, field, value) {
		this.scopes[scope].settings[field] = scope === "project" ? structuredClone(value) : value;
		this.markModified(scope, field);
		this.save(scope);
	}
	setGlobalNestedSetting(field, nestedField, value) {
		const current = this.scopes.global.settings[field];
		const nested = isRecord(current) ? { ...current } : {};
		nested[nestedField] = value;
		this.scopes.global.settings[field] = nested;
		this.markModified("global", field, nestedField);
		this.save("global");
	}
	async flush() {
		await this.writeQueue;
	}
	drainErrors() {
		const drained = this.errors;
		this.errors = [];
		return drained;
	}
	getLastChangelogVersion() {
		return this.settings.lastChangelogVersion;
	}
	setLastChangelogVersion(version) {
		this.setScopedSetting("global", "lastChangelogVersion", version);
	}
	getSessionDir() {
		const sessionDir = this.settings.sessionDir;
		if (!sessionDir) return sessionDir;
		return sessionDir === "~" ? homedir() : sessionDir.startsWith("~/") ? join(homedir(), sessionDir.slice(2)) : sessionDir;
	}
	getDefaultProvider() {
		return this.settings.defaultProvider;
	}
	getDefaultModel() {
		return this.settings.defaultModel;
	}
	setDefaultProvider(provider) {
		this.setScopedSetting("global", "defaultProvider", provider);
	}
	setDefaultModel(modelId) {
		this.setScopedSetting("global", "defaultModel", modelId);
	}
	setDefaultModelAndProvider(provider, modelId) {
		this.scopes.global.settings.defaultProvider = provider;
		this.scopes.global.settings.defaultModel = modelId;
		this.markModified("global", "defaultProvider");
		this.markModified("global", "defaultModel");
		this.save("global");
	}
	getSteeringMode() {
		return this.settings.steeringMode || "one-at-a-time";
	}
	setSteeringMode(mode) {
		this.setScopedSetting("global", "steeringMode", mode);
	}
	getFollowUpMode() {
		return this.settings.followUpMode || "one-at-a-time";
	}
	setFollowUpMode(mode) {
		this.setScopedSetting("global", "followUpMode", mode);
	}
	getTheme() {
		return this.settings.theme;
	}
	setTheme(theme) {
		this.setScopedSetting("global", "theme", theme);
	}
	getDefaultThinkingLevel() {
		return this.settings.defaultThinkingLevel;
	}
	setDefaultThinkingLevel(level) {
		this.setScopedSetting("global", "defaultThinkingLevel", level);
	}
	getTransport() {
		return this.settings.transport ?? "auto";
	}
	setTransport(transport) {
		this.setScopedSetting("global", "transport", transport);
	}
	getCompactionEnabled() {
		return this.settings.compaction?.enabled ?? true;
	}
	setCompactionEnabled(enabled) {
		this.setGlobalNestedSetting("compaction", "enabled", enabled);
	}
	getCompactionReserveTokens() {
		return this.settings.compaction?.reserveTokens ?? 16384;
	}
	getCompactionKeepRecentTokens() {
		return this.settings.compaction?.keepRecentTokens ?? 2e4;
	}
	getCompactionSettings() {
		return {
			enabled: this.getCompactionEnabled(),
			reserveTokens: this.getCompactionReserveTokens(),
			keepRecentTokens: this.getCompactionKeepRecentTokens()
		};
	}
	getBranchSummarySettings() {
		return {
			reserveTokens: this.settings.branchSummary?.reserveTokens ?? 16384,
			skipPrompt: this.settings.branchSummary?.skipPrompt ?? false
		};
	}
	getBranchSummarySkipPrompt() {
		return this.settings.branchSummary?.skipPrompt ?? false;
	}
	getRetryEnabled() {
		return this.settings.retry?.enabled ?? true;
	}
	setRetryEnabled(enabled) {
		this.setGlobalNestedSetting("retry", "enabled", enabled);
	}
	getRetrySettings() {
		return {
			enabled: this.getRetryEnabled(),
			maxRetries: this.settings.retry?.maxRetries ?? 3,
			baseDelayMs: this.settings.retry?.baseDelayMs ?? 2e3
		};
	}
	getHttpIdleTimeoutMs() {
		const value = this.settings.httpIdleTimeoutMs;
		const timeoutMs = parseHttpIdleTimeoutMs(value);
		if (timeoutMs !== void 0) return timeoutMs;
		if (value !== void 0) throw new Error(`Invalid httpIdleTimeoutMs setting: ${String(value)}`);
		return DEFAULT_HTTP_IDLE_TIMEOUT_MS;
	}
	setHttpIdleTimeoutMs(timeoutMs) {
		if (!Number.isFinite(timeoutMs) || timeoutMs < 0) throw new Error(`Invalid httpIdleTimeoutMs setting: ${String(timeoutMs)}`);
		this.setScopedSetting("global", "httpIdleTimeoutMs", Math.floor(timeoutMs));
	}
	getProviderRetrySettings() {
		return {
			timeoutMs: this.settings.retry?.provider?.timeoutMs,
			maxRetries: this.settings.retry?.provider?.maxRetries,
			maxRetryDelayMs: this.settings.retry?.provider?.maxRetryDelayMs ?? 6e4
		};
	}
	getHideThinkingBlock() {
		return this.settings.hideThinkingBlock ?? false;
	}
	setHideThinkingBlock(hide) {
		this.setScopedSetting("global", "hideThinkingBlock", hide);
	}
	getShellPath() {
		return this.settings.shellPath;
	}
	setShellPath(path) {
		this.setScopedSetting("global", "shellPath", path);
	}
	getQuietStartup() {
		return this.settings.quietStartup ?? false;
	}
	setQuietStartup(quiet) {
		this.setScopedSetting("global", "quietStartup", quiet);
	}
	getShellCommandPrefix() {
		return this.settings.shellCommandPrefix;
	}
	setShellCommandPrefix(prefix) {
		this.setScopedSetting("global", "shellCommandPrefix", prefix);
	}
	getNpmCommand() {
		return this.settings.npmCommand ? [...this.settings.npmCommand] : void 0;
	}
	setNpmCommand(command) {
		this.setScopedSetting("global", "npmCommand", command ? [...command] : void 0);
	}
	getCollapseChangelog() {
		return this.settings.collapseChangelog ?? false;
	}
	setCollapseChangelog(collapse) {
		this.setScopedSetting("global", "collapseChangelog", collapse);
	}
	getEnableInstallTelemetry() {
		return this.settings.enableInstallTelemetry ?? true;
	}
	setEnableInstallTelemetry(enabled) {
		this.setScopedSetting("global", "enableInstallTelemetry", enabled);
	}
	getPackages() {
		return [...this.settings.packages ?? []];
	}
	setPackages(packages) {
		this.setScopedSetting("global", "packages", packages);
	}
	setProjectPackages(packages) {
		this.setScopedSetting("project", "packages", packages);
	}
	getExtensionPaths() {
		return [...this.settings.extensions ?? []];
	}
	setExtensionPaths(paths) {
		this.setScopedSetting("global", "extensions", paths);
	}
	setProjectExtensionPaths(paths) {
		this.setScopedSetting("project", "extensions", paths);
	}
	getSkillPaths() {
		return [...this.settings.skills ?? []];
	}
	setSkillPaths(paths) {
		this.setScopedSetting("global", "skills", paths);
	}
	setProjectSkillPaths(paths) {
		this.setScopedSetting("project", "skills", paths);
	}
	getPromptTemplatePaths() {
		return [...this.settings.prompts ?? []];
	}
	setPromptTemplatePaths(paths) {
		this.setScopedSetting("global", "prompts", paths);
	}
	setProjectPromptTemplatePaths(paths) {
		this.setScopedSetting("project", "prompts", paths);
	}
	getThemePaths() {
		return [...this.settings.themes ?? []];
	}
	setThemePaths(paths) {
		this.setScopedSetting("global", "themes", paths);
	}
	setProjectThemePaths(paths) {
		this.setScopedSetting("project", "themes", paths);
	}
	getEnableSkillCommands() {
		return this.settings.enableSkillCommands ?? true;
	}
	setEnableSkillCommands(enabled) {
		this.setScopedSetting("global", "enableSkillCommands", enabled);
	}
	getThinkingBudgets() {
		return this.settings.thinkingBudgets;
	}
	getShowImages() {
		return this.settings.terminal?.showImages ?? true;
	}
	setShowImages(show) {
		this.setGlobalNestedSetting("terminal", "showImages", show);
	}
	getImageWidthCells() {
		return resolveIntegerOption(this.settings.terminal?.imageWidthCells, 60, { min: 1 });
	}
	setImageWidthCells(width) {
		this.setGlobalNestedSetting("terminal", "imageWidthCells", Math.max(1, Math.floor(width)));
	}
	getClearOnShrink() {
		return this.settings.terminal?.clearOnShrink ?? false;
	}
	setClearOnShrink(enabled) {
		this.setGlobalNestedSetting("terminal", "clearOnShrink", enabled);
	}
	getShowTerminalProgress() {
		return this.settings.terminal?.showTerminalProgress ?? false;
	}
	setShowTerminalProgress(enabled) {
		this.setGlobalNestedSetting("terminal", "showTerminalProgress", enabled);
	}
	getImageAutoResize() {
		return this.settings.images?.autoResize ?? true;
	}
	setImageAutoResize(enabled) {
		this.setGlobalNestedSetting("images", "autoResize", enabled);
	}
	getBlockImages() {
		return this.settings.images?.blockImages ?? false;
	}
	setBlockImages(blocked) {
		this.setGlobalNestedSetting("images", "blockImages", blocked);
	}
	getEnabledModels() {
		return this.settings.enabledModels;
	}
	setEnabledModels(patterns) {
		this.setScopedSetting("global", "enabledModels", patterns);
	}
	getDoubleEscapeAction() {
		return this.settings.doubleEscapeAction ?? "tree";
	}
	setDoubleEscapeAction(action) {
		this.setScopedSetting("global", "doubleEscapeAction", action);
	}
	getTreeFilterMode() {
		const mode = this.settings.treeFilterMode;
		return mode && [
			"default",
			"no-tools",
			"user-only",
			"labeled-only",
			"all"
		].includes(mode) ? mode : "default";
	}
	setTreeFilterMode(mode) {
		this.setScopedSetting("global", "treeFilterMode", mode);
	}
	getShowHardwareCursor() {
		return this.settings.showHardwareCursor ?? false;
	}
	setShowHardwareCursor(enabled) {
		this.setScopedSetting("global", "showHardwareCursor", enabled);
	}
	getEditorPaddingX() {
		return this.settings.editorPaddingX ?? 0;
	}
	setEditorPaddingX(padding) {
		this.setScopedSetting("global", "editorPaddingX", Math.max(0, Math.min(3, Math.floor(padding))));
	}
	getAutocompleteMaxVisible() {
		return this.settings.autocompleteMaxVisible ?? 5;
	}
	setAutocompleteMaxVisible(maxVisible) {
		this.setScopedSetting("global", "autocompleteMaxVisible", Math.max(3, Math.min(20, Math.floor(maxVisible))));
	}
	getCodeBlockIndent() {
		return this.settings.markdown?.codeBlockIndent ?? "  ";
	}
	getWarnings() {
		return { ...this.settings.warnings };
	}
	setWarnings(warnings) {
		this.setScopedSetting("global", "warnings", { ...warnings });
	}
};
//#endregion
//#region src/agents/sessions/extensions/types.ts
/**
* Preserve parameter inference for standalone tool definitions.
*
* Use this when assigning a tool to a variable or passing it through arrays such
* as `customTools`, where contextual typing would otherwise widen params to
* `unknown`.
*/
function defineTool(tool) {
	return tool;
}
function isBashToolResult(e) {
	return e.toolName === "bash";
}
function isReadToolResult(e) {
	return e.toolName === "read";
}
function isEditToolResult(e) {
	return e.toolName === "edit";
}
function isWriteToolResult(e) {
	return e.toolName === "write";
}
function isGrepToolResult(e) {
	return e.toolName === "grep";
}
function isFindToolResult(e) {
	return e.toolName === "find";
}
function isLsToolResult(e) {
	return e.toolName === "ls";
}
function isToolCallEventType(toolName, event) {
	return event.toolName === toolName;
}
//#endregion
//#region src/agents/sessions/extensions/wrapper.ts
/**
* Wrap a RegisteredTool into an AgentTool.
* Uses the runner's createContext() for consistent context across tools and event handlers.
*/
function wrapRegisteredTool(registeredTool, runner) {
	return wrapToolDefinition(registeredTool.definition, () => runner.createContext());
}
/**
* Wrap all registered tools into AgentTools.
* Uses the runner's createContext() for consistent context across tools and event handlers.
*/
function wrapRegisteredTools(registeredTools, runner) {
	return registeredTools.map((tool) => wrapRegisteredTool(tool, runner));
}
//#endregion
//#region src/agents/sessions/extension-sdk.ts
var extension_sdk_exports = /* @__PURE__ */ __exportAll({
	AUTH_STORAGE_CREATE_DEPRECATION_CODE: () => AUTH_STORAGE_CREATE_DEPRECATION_CODE,
	AuthStorage: () => AuthStorage,
	CURRENT_SESSION_VERSION: () => 4,
	DEFAULT_COMPACTION_SETTINGS: () => DEFAULT_COMPACTION_SETTINGS,
	DEFAULT_MAX_BYTES: () => DEFAULT_MAX_BYTES,
	DEFAULT_MAX_LINES: () => DEFAULT_MAX_LINES,
	DefaultPackageManager: () => DefaultPackageManager,
	FILE_AUTH_STORAGE_BACKEND_DEPRECATION_CODE: () => FILE_AUTH_STORAGE_BACKEND_DEPRECATION_CODE,
	FileAuthStorageBackend: () => FileAuthStorageBackend,
	FileSettingsStorage: () => FileSettingsStorage,
	InMemoryAuthStorageBackend: () => InMemoryAuthStorageBackend,
	InMemorySettingsStorage: () => InMemorySettingsStorage,
	ModelRegistry: () => ModelRegistry,
	OAuthProviderConfiguredUnavailableError: () => OAuthProviderConfiguredUnavailableError,
	SessionManager: () => SessionManager,
	SettingsManager: () => SettingsManager,
	VERSION: () => PACKAGE_MANIFEST_VERSION,
	allToolNames: () => allToolNames,
	buildSessionContext: () => buildSessionContext$1,
	calculateContextTokens: () => calculateContextTokens,
	collectEntriesForBranchSummary: () => collectEntriesForBranchSummary,
	compact: () => compact,
	convertToLlm: () => convertToLlm,
	createAllToolDefinitions: () => createAllToolDefinitions,
	createAllTools: () => createAllTools,
	createBashTool: () => createBashTool,
	createBashToolDefinition: () => createBashToolDefinition,
	createCodingToolDefinitions: () => createCodingToolDefinitions,
	createCodingTools: () => createCodingTools,
	createEditTool: () => createEditTool,
	createEditToolDefinition: () => createEditToolDefinition,
	createEventBus: () => createEventBus,
	createFindTool: () => createFindTool,
	createFindToolDefinition: () => createFindToolDefinition,
	createGrepTool: () => createGrepTool,
	createGrepToolDefinition: () => createGrepToolDefinition,
	createLocalBashOperations: () => createLocalBashOperations,
	createLsTool: () => createLsTool,
	createLsToolDefinition: () => createLsToolDefinition,
	createReadOnlyToolDefinitions: () => createReadOnlyToolDefinitions,
	createReadOnlyTools: () => createReadOnlyTools,
	createReadTool: () => createReadTool,
	createReadToolDefinition: () => createReadToolDefinition,
	createSourceInfo: () => createSourceInfo,
	createSyntheticSourceInfo: () => createSyntheticSourceInfo,
	createTool: () => createTool,
	createToolDefinition: () => createToolDefinition,
	createWriteTool: () => createWriteTool,
	createWriteToolDefinition: () => createWriteToolDefinition,
	defineTool: () => defineTool,
	estimateContextTokens: () => estimateContextTokens,
	estimateTokens: () => estimateTokens,
	executeBashWithOperations: () => executeBashWithOperations,
	findCutPoint: () => findCutPoint,
	findExactModelReferenceMatch: () => findExactModelReferenceMatch,
	findInitialModel: () => findInitialModel,
	findTurnStartIndex: () => findTurnStartIndex,
	formatSize: () => formatSize,
	generateBranchSummary: () => generateBranchSummary,
	generateSummary: () => generateSummary,
	getAgentDir: () => getAgentDir,
	getLastAssistantUsage: () => getLastAssistantUsage,
	getLatestCompactionEntry: () => getLatestCompactionEntry,
	isBashToolResult: () => isBashToolResult,
	isEditToolResult: () => isEditToolResult,
	isFindToolResult: () => isFindToolResult,
	isGrepToolResult: () => isGrepToolResult,
	isLsToolResult: () => isLsToolResult,
	isReadToolResult: () => isReadToolResult,
	isToolCallEventType: () => isToolCallEventType,
	isWriteToolResult: () => isWriteToolResult,
	migrateSessionEntries: () => migrateSessionEntries,
	normalizeLoadedFileEntry: () => normalizeLoadedFileEntry,
	parseModelPattern: () => parseModelPattern,
	parseSessionEntries: () => parseSessionEntries,
	prepareBranchEntries: () => prepareBranchEntries,
	prepareCompaction: () => prepareCompaction,
	resolveCliModel: () => resolveCliModel,
	resolveModelScope: () => resolveModelScope,
	restoreModelFromSession: () => restoreModelFromSession,
	serializeConversation: () => serializeConversation,
	shouldCompact: () => shouldCompact,
	truncateHead: () => truncateHead,
	truncateLine: () => truncateLine,
	truncateTail: () => truncateTail,
	withFileMutationQueue: () => withFileMutationQueue,
	wrapRegisteredTool: () => wrapRegisteredTool,
	wrapRegisteredTools: () => wrapRegisteredTools
});
//#endregion
//#region src/agents/sessions/extensions/loader.ts
/** Canonical host modules shared by source extensions and compiled binaries. */
const VIRTUAL_MODULES = {
	typebox: bundledTypebox,
	"typebox/compile": bundledTypeboxCompile,
	"typebox/error": bundledTypeboxError,
	"typebox/format": bundledTypeboxFormat,
	"typebox/guard": bundledTypeboxGuard,
	"typebox/schema": bundledTypeboxSchema,
	"typebox/system": bundledTypeboxSystem,
	"typebox/type": bundledTypeboxType,
	"typebox/value": bundledTypeboxValue,
	"@sinclair/typebox": bundledTypebox,
	"@sinclair/typebox/compile": bundledTypeboxCompile,
	"@sinclair/typebox/format": bundledTypeboxFormat,
	"@sinclair/typebox/value": bundledTypeboxValue,
	"openclaw/plugin-sdk/agent-core": agent_core_exports,
	"@openclaw/plugin-sdk/agent-core": agent_core_exports,
	"openclaw/plugin-sdk/llm": llm_exports,
	"@openclaw/plugin-sdk/llm": llm_exports,
	"openclaw/plugin-sdk/agent-sessions": extension_sdk_exports,
	"@openclaw/plugin-sdk/agent-sessions": extension_sdk_exports
};
const require = createRequire(import.meta.url);
let createJitiLoaderFactory;
let nativeExtensionLoadCounter = 0;
let extensionCacheCwd;
let extensionCacheGeneration = 0;
const extensionFactoryCache = /* @__PURE__ */ new Map();
const EXTENSION_LOADER_ALIAS_IMPORT_PATTERN = /(?:@openclaw\/plugin-sdk|openclaw\/plugin-sdk|@sinclair\/typebox|typebox)(?:\/[A-Za-z0-9_-]+)?/u;
const RELATIVE_EXTENSION_IMPORT_PATTERN = /(?:import\s*(?:[^'"]*?\s*from\s*)?["']\.{1,2}\/|export\s*(?:[^'"]*?\s*from\s*)["']\.{1,2}\/|import\s*\(\s*["']\.{1,2}\/|require\s*\(\s*["']\.{1,2}\/)/u;
async function loadCreateJitiLoaderFactory() {
	if (createJitiLoaderFactory) return createJitiLoaderFactory;
	const loaded = await import("jiti/static");
	if (typeof loaded.createJiti !== "function") throw new Error("jiti/static module did not export createJiti");
	createJitiLoaderFactory = loaded.createJiti;
	return createJitiLoaderFactory;
}
const UNICODE_SPACES = /[\u00A0\u2000-\u200A\u202F\u205F\u3000]/g;
function expandPath(p) {
	const normalized = p.replace(UNICODE_SPACES, " ");
	if (normalized.startsWith("~/")) return path$1.join(os$1.homedir(), normalized.slice(2));
	if (normalized.startsWith("~")) return path$1.join(os$1.homedir(), normalized.slice(1));
	return normalized;
}
function resolvePath(extPath, cwd) {
	const expanded = expandPath(extPath);
	if (path$1.isAbsolute(expanded)) return expanded;
	return path$1.resolve(cwd, expanded);
}
function clearExtensionCache() {
	extensionFactoryCache.clear();
	extensionCacheCwd = void 0;
	extensionCacheGeneration++;
}
function useExtensionCacheCwd(cwd) {
	const resolvedCwd = path$1.resolve(expandPath(cwd));
	if (extensionCacheCwd !== void 0 && extensionCacheCwd !== resolvedCwd) clearExtensionCache();
	extensionCacheCwd = resolvedCwd;
	return {
		cwd: resolvedCwd,
		generation: extensionCacheGeneration
	};
}
function isCurrentCacheScope(scope) {
	return scope !== void 0 && extensionCacheCwd === scope.cwd && extensionCacheGeneration === scope.generation;
}
/**
* Create a runtime with throwing stubs for action methods.
* Runner.bindCore() replaces these with real implementations.
*/
function createExtensionRuntime() {
	const notInitialized = () => {
		throw new Error("Extension runtime not initialized. Action methods cannot be called during extension loading.");
	};
	let staleMessage;
	const assertActive = () => {
		if (staleMessage) throw new Error(staleMessage);
	};
	const runtime = {
		sendMessage: notInitialized,
		sendUserMessage: notInitialized,
		appendEntry: notInitialized,
		appendEntryAsync: notInitialized,
		setSessionName: notInitialized,
		setSessionNameAsync: notInitialized,
		getSessionName: notInitialized,
		setLabel: notInitialized,
		setLabelAsync: notInitialized,
		getActiveTools: notInitialized,
		getAllTools: notInitialized,
		setActiveTools: notInitialized,
		refreshTools: () => {},
		getCommands: notInitialized,
		setModel: () => Promise.reject(/* @__PURE__ */ new Error("Extension runtime not initialized")),
		getThinkingLevel: notInitialized,
		setThinkingLevel: notInitialized,
		flagValues: /* @__PURE__ */ new Map(),
		pendingProviderRegistrations: [],
		assertActive,
		invalidate: (message) => {
			staleMessage ??= message ?? "This extension ctx is stale after session replacement or reload. Do not use a captured api or command ctx after ctx.newSession(), ctx.fork(), ctx.switchSession(), or ctx.reload(). For newSession, fork, and switchSession, move post-replacement work into withSession and use the ctx passed to withSession. For reload, do not use the old ctx after await ctx.reload().";
		},
		registerProvider: (name, config, extensionPath = "<unknown>") => {
			runtime.pendingProviderRegistrations.push({
				name,
				config,
				extensionPath
			});
		},
		unregisterProvider: (name) => {
			runtime.pendingProviderRegistrations = runtime.pendingProviderRegistrations.filter((r) => r.name !== name);
		}
	};
	return runtime;
}
/**
* Create the ExtensionAPI for an extension.
* Registration methods write to the extension object.
* Action methods delegate to the shared runtime.
*/
function createExtensionAPI(extension, runtime, cwd, eventBus) {
	const activeRuntime = () => {
		runtime.assertActive();
		return runtime;
	};
	return {
		on(event, handler) {
			runtime.assertActive();
			const list = extension.handlers.get(event) ?? [];
			list.push(handler);
			extension.handlers.set(event, list);
		},
		registerTool(tool) {
			runtime.assertActive();
			extension.tools.set(tool.name, {
				definition: tool,
				sourceInfo: extension.sourceInfo
			});
			runtime.refreshTools();
		},
		registerCommand(name, options) {
			runtime.assertActive();
			extension.commands.set(name, {
				name,
				sourceInfo: extension.sourceInfo,
				...options
			});
		},
		registerShortcut(shortcut, options) {
			runtime.assertActive();
			extension.shortcuts.set(shortcut, {
				shortcut,
				extensionPath: extension.path,
				...options
			});
		},
		registerFlag(name, options) {
			runtime.assertActive();
			extension.flags.set(name, {
				name,
				extensionPath: extension.path,
				...options
			});
			if (options.default !== void 0 && !runtime.flagValues.has(name)) runtime.flagValues.set(name, options.default);
		},
		registerMessageRenderer(customType, renderer) {
			runtime.assertActive();
			extension.messageRenderers.set(customType, renderer);
		},
		getFlag(name) {
			runtime.assertActive();
			if (!extension.flags.has(name)) return;
			return runtime.flagValues.get(name);
		},
		sendMessage: (message, options) => {
			activeRuntime().sendMessage(message, options);
		},
		sendUserMessage: (content, options) => {
			activeRuntime().sendUserMessage(content, options);
		},
		appendEntry: (customType, data) => {
			warnSessionPersistenceDeprecation("ExtensionAPI.appendEntry", "appendEntryAsync");
			activeRuntime().appendEntry(customType, data);
		},
		appendEntryAsync: async (customType, data) => {
			const owner = activeRuntime();
			if (!owner.appendEntryAsync) throw new Error("Extension host must bind worker persistence with bindCoreAsync");
			const id = await owner.appendEntryAsync(customType, data);
			owner.assertActive();
			return id;
		},
		setSessionName: (name) => {
			warnSessionPersistenceDeprecation("ExtensionAPI.setSessionName", "setSessionNameAsync");
			activeRuntime().setSessionName(name);
		},
		setSessionNameAsync: async (name) => {
			const owner = activeRuntime();
			if (!owner.setSessionNameAsync) throw new Error("Extension host must bind worker persistence with bindCoreAsync");
			await owner.setSessionNameAsync(name);
			owner.assertActive();
		},
		getSessionName: () => activeRuntime().getSessionName(),
		setLabel: (entryId, label) => {
			warnSessionPersistenceDeprecation("ExtensionAPI.setLabel", "setLabelAsync");
			activeRuntime().setLabel(entryId, label);
		},
		setLabelAsync: async (entryId, label) => {
			const owner = activeRuntime();
			if (!owner.setLabelAsync) throw new Error("Extension host must bind worker persistence with bindCoreAsync");
			await owner.setLabelAsync(entryId, label);
			owner.assertActive();
		},
		exec(command, args, options) {
			runtime.assertActive();
			return execCommand(command, args, options?.cwd ?? cwd, options);
		},
		getActiveTools: () => activeRuntime().getActiveTools(),
		getAllTools: () => activeRuntime().getAllTools(),
		setActiveTools: (toolNames) => {
			activeRuntime().setActiveTools(toolNames);
		},
		getCommands: () => activeRuntime().getCommands(),
		setModel: (model) => activeRuntime().setModel(model),
		getThinkingLevel: () => activeRuntime().getThinkingLevel(),
		setThinkingLevel: (level) => activeRuntime().setThinkingLevel(level),
		registerProvider: (name, config) => {
			activeRuntime().registerProvider(name, config, extension.path);
		},
		unregisterProvider: (name) => {
			activeRuntime().unregisterProvider(name, extension.path);
		},
		events: eventBus
	};
}
function resolveExtensionFactory(module) {
	const candidate = typeof module === "object" && module !== null && "default" in module ? module.default : module;
	if (typeof candidate === "function") return candidate;
	const nestedCandidate = typeof candidate === "object" && candidate !== null && "default" in candidate ? candidate.default : void 0;
	return typeof nestedCandidate === "function" ? nestedCandidate : void 0;
}
function isJavaScriptExtensionPath(extensionPath) {
	const extension = path$1.extname(extensionPath).toLowerCase();
	return extension === ".cjs" || extension === ".mjs";
}
function extensionSourceNeedsJitiAliasResolution(extensionPath) {
	try {
		const source = fs$1.readFileSync(extensionPath, "utf8");
		return EXTENSION_LOADER_ALIAS_IMPORT_PATTERN.test(source) || RELATIVE_EXTENSION_IMPORT_PATTERN.test(source);
	} catch {
		return true;
	}
}
function shouldLoadExtensionWithNativeImport(extensionPath) {
	return !isBunBinary && isJavaScriptExtensionPath(extensionPath) && !extensionSourceNeedsJitiAliasResolution(extensionPath);
}
async function loadNativeExtensionModule(extensionPath) {
	const url = pathToFileURL(extensionPath);
	url.searchParams.set("v", String(++nativeExtensionLoadCounter));
	try {
		const cachedPath = require.resolve(extensionPath);
		delete require.cache[cachedPath];
	} catch {}
	return resolveExtensionFactory(await import(url.href));
}
async function loadExtensionSourceTransformModule(extensionPath, context) {
	if (!context.sourceTransformLoader) {
		installOpenClawInternalCorePackageNativeResolver({ moduleUrl: import.meta.url });
		const createJitiLoader = await loadCreateJitiLoaderFactory();
		const aliases = isBunBinary ? {} : buildPluginLoaderAliasMap(fileURLToPath(import.meta.url), process.argv[1], import.meta.url);
		context.sourceTransformLoader = createJitiLoader(import.meta.url, {
			...buildPluginLoaderJitiOptions(aliases),
			virtualModules: VIRTUAL_MODULES,
			tryNative: false,
			moduleCache: false
		});
	}
	return resolveExtensionFactory(await context.sourceTransformLoader.import(extensionPath, { default: true }));
}
async function loadExtensionModule(extensionPath, context) {
	if (isCurrentCacheScope(context.cacheScope)) {
		const cachedFactory = extensionFactoryCache.get(extensionPath);
		if (cachedFactory) return cachedFactory;
	}
	const factory = shouldLoadExtensionWithNativeImport(extensionPath) ? await loadNativeExtensionModule(extensionPath) : await loadExtensionSourceTransformModule(extensionPath, context);
	if (factory && isCurrentCacheScope(context.cacheScope)) extensionFactoryCache.set(extensionPath, factory);
	return factory;
}
function createExtension(extensionPath, resolvedPath) {
	const source = extensionPath.startsWith("<") && extensionPath.endsWith(">") ? extensionPath.slice(1, -1).split(":")[0] || "temporary" : "local";
	const baseDir = extensionPath.startsWith("<") ? void 0 : path$1.dirname(resolvedPath);
	return {
		path: extensionPath,
		resolvedPath,
		sourceInfo: createSyntheticSourceInfo(extensionPath, {
			source,
			baseDir
		}),
		handlers: /* @__PURE__ */ new Map(),
		tools: /* @__PURE__ */ new Map(),
		messageRenderers: /* @__PURE__ */ new Map(),
		commands: /* @__PURE__ */ new Map(),
		flags: /* @__PURE__ */ new Map(),
		shortcuts: /* @__PURE__ */ new Map()
	};
}
async function loadExtensionFromFactory(factory, cwd, eventBus, runtime, extensionPath = "<inline>") {
	const extension = createExtension(extensionPath, extensionPath);
	await factory(createExtensionAPI(extension, runtime, cwd, eventBus));
	return extension;
}
async function loadExtensionsCached(paths, cwd, eventBus) {
	const extensions = [];
	const errors = [];
	const resolvedEventBus = eventBus ?? createEventBus();
	const runtime = createExtensionRuntime();
	const cacheScope = useExtensionCacheCwd(cwd);
	const resolvedCwd = cacheScope.cwd;
	const context = { cacheScope };
	for (const extPath of paths) {
		const resolvedPath = resolvePath(extPath, resolvedCwd);
		try {
			const factory = await loadExtensionModule(resolvedPath, context);
			if (!factory) {
				errors.push({
					path: extPath,
					error: `Extension does not export a valid factory function: ${extPath}`
				});
				continue;
			}
			const extension = createExtension(extPath, resolvedPath);
			await factory(createExtensionAPI(extension, runtime, resolvedCwd, resolvedEventBus));
			extensions.push(extension);
		} catch (err) {
			const message = err instanceof Error ? err.message : String(err);
			errors.push({
				path: extPath,
				error: `Failed to load extension: ${message}`
			});
		}
	}
	return {
		extensions,
		errors,
		runtime
	};
}
//#endregion
//#region src/agents/sessions/extensions/handler-error.ts
/** A missing committed view is a runtime fault; ordinary extension faults remain isolated. */
function reportExtensionHandlerError(error, extensionPath, event, report) {
	if (error instanceof SessionMetadataCommittedError) throw error;
	report({
		extensionPath,
		event,
		error: coerceErrorMessage(error),
		stack: error instanceof Error ? error.stack : void 0
	});
}
//#endregion
//#region src/agents/sessions/extensions/metadata-actions.ts
function bindPersistenceScope(manager, runtime) {
	return (action) => {
		runtime.assertActive();
		const target = manager.getSessionTarget();
		const assertCurrent = () => {
			runtime.assertActive();
			const current = manager.getSessionTarget();
			if (!sameSessionTranscriptTargetBinding(target, current)) throw new Error("Extension session manager changed before metadata persistence");
		};
		return withSessionManagerWriteAssertion(manager, assertCurrent, () => target ? withSessionTranscriptWriteAssertion(target, assertCurrent, action) : action());
	};
}
/** Retain the bound runtime and manager through queued metadata transaction/commit grants. */
function bindExtensionMetadataActions(manager, runtime, actions) {
	const run = bindPersistenceScope(manager, runtime);
	runtime.setModel = (model) => run(() => actions.setModel(model));
	runtime.setThinkingLevel = (level) => run(() => actions.setThinkingLevel(level));
}
/** Bind awaited writes to the same runtime and transcript target through worker commit. */
function bindExtensionPersistenceActions(manager, runtime, actions) {
	const run = bindPersistenceScope(manager, runtime);
	runtime.appendEntryAsync = (customType, data) => run(() => actions.appendEntryAsync(customType, data));
	runtime.setSessionNameAsync = (name) => run(() => actions.setSessionNameAsync(name));
	runtime.setLabelAsync = (entryId, label) => run(() => actions.setLabelAsync(entryId, label));
}
//#endregion
//#region src/agents/sessions/extensions/provider-actions.ts
function bindExtensionProviderActions(runtime, modelRegistry, emitError, providerActions) {
	const registerProvider = (name, config) => {
		if (providerActions?.registerProvider) providerActions.registerProvider(name, config);
		else modelRegistry.registerProvider(name, config);
	};
	for (const { name, config, extensionPath } of runtime.pendingProviderRegistrations) try {
		registerProvider(name, config);
	} catch (err) {
		emitError({
			extensionPath,
			event: "register_provider",
			error: coerceErrorMessage(err),
			stack: err instanceof Error ? err.stack : void 0
		});
	}
	runtime.pendingProviderRegistrations = [];
	runtime.registerProvider = registerProvider;
	runtime.unregisterProvider = (name) => {
		if (providerActions?.unregisterProvider) {
			providerActions.unregisterProvider(name);
			return;
		}
		modelRegistry.unregisterProvider(name);
	};
}
//#endregion
//#region src/agents/sessions/extensions/runner.ts
const RESERVED_KEYBINDINGS_FOR_EXTENSION_CONFLICTS = [
	"app.interrupt",
	"app.clear",
	"app.exit",
	"app.suspend",
	"app.thinking.cycle",
	"app.model.cycleForward",
	"app.model.cycleBackward",
	"app.model.select",
	"app.tools.expand",
	"app.thinking.toggle",
	"app.editor.external",
	"app.message.followUp",
	"tui.input.submit",
	"tui.select.confirm",
	"tui.select.cancel",
	"tui.input.copy",
	"tui.editor.deleteToLineEnd"
];
const buildBuiltinKeybindings = (resolvedKeybindings) => {
	const builtinKeybindings = {};
	for (const [keybinding, keys] of Object.entries(resolvedKeybindings)) {
		if (keys === void 0) continue;
		const keyList = Array.isArray(keys) ? keys : [keys];
		const restrictOverride = RESERVED_KEYBINDINGS_FOR_EXTENSION_CONFLICTS.includes(keybinding);
		for (const key of keyList) {
			const normalizedKey = key.toLowerCase();
			if (builtinKeybindings[normalizedKey]?.restrictOverride && !restrictOverride) continue;
			builtinKeybindings[normalizedKey] = {
				keybinding,
				restrictOverride
			};
		}
	}
	return builtinKeybindings;
};
/**
* Helper function to emit session_shutdown event to extensions.
* Returns true if the event was emitted, false if there were no handlers.
*/
async function emitSessionShutdownEvent(extensionRunner, event) {
	if (extensionRunner.hasHandlers("session_shutdown")) {
		await extensionRunner.emit(event);
		return true;
	}
	return false;
}
const noOpUIContext = {
	select: async () => void 0,
	confirm: async () => false,
	input: async () => void 0,
	notify: () => {},
	onTerminalInput: () => () => {},
	setStatus: () => {},
	setWorkingMessage: () => {},
	setWorkingVisible: () => {},
	setWorkingIndicator: () => {},
	setHiddenThinkingLabel: () => {},
	setWidget: () => {},
	setFooter: () => {},
	setHeader: () => {},
	setTitle: () => {},
	custom: async () => void 0,
	pasteToEditor: () => {},
	setEditorText: () => {},
	getEditorText: () => "",
	editor: async () => void 0,
	addAutocompleteProvider: () => {},
	setEditorComponent: () => {},
	getEditorComponent: () => void 0,
	get theme() {
		return interactiveAgentTheme;
	},
	getAllThemes: () => [],
	getTheme: () => void 0,
	setTheme: () => ({
		success: false,
		error: "UI not available"
	}),
	getToolsExpanded: () => false,
	setToolsExpanded: () => {}
};
var ExtensionRunner = class {
	constructor(extensions, runtime, cwd, sessionManager, modelRegistry) {
		this.extensions = extensions;
		this.runtime = runtime;
		this.cwd = cwd;
		this.sessionManager = sessionManager;
		this.modelRegistry = modelRegistry;
		this.errorListeners = /* @__PURE__ */ new Set();
		this.getModel = () => void 0;
		this.isIdleFn = () => true;
		this.getSignalFn = () => void 0;
		this.waitForIdleFn = async () => {};
		this.abortFn = () => {};
		this.hasPendingMessagesFn = () => false;
		this.getContextUsageFn = () => void 0;
		this.compactFn = () => {};
		this.getSystemPromptFn = () => "";
		this.newSessionHandler = async () => ({ cancelled: false });
		this.forkHandler = async () => ({ cancelled: false });
		this.navigateTreeHandler = async () => ({ cancelled: false });
		this.switchSessionHandler = async () => ({ cancelled: false });
		this.reloadHandler = async () => {};
		this.shutdownHandler = () => {};
		this.shortcutDiagnostics = [];
		this.commandDiagnostics = [];
		this.uiContext = noOpUIContext;
	}
	/** Bind host actions with worker-backed persistence; legacy bindCore remains source-compatible. */
	bindCoreAsync(actions, contextActions, providerActions) {
		this.bindCore(actions, contextActions, providerActions);
		bindExtensionPersistenceActions(this.sessionManager, this.runtime, actions);
	}
	bindCore(actions, contextActions, providerActions) {
		this.runtime.sendMessage = actions.sendMessage;
		this.runtime.sendUserMessage = actions.sendUserMessage;
		this.runtime.appendEntry = actions.appendEntry;
		this.runtime.setSessionName = actions.setSessionName;
		this.runtime.getSessionName = actions.getSessionName;
		this.runtime.setLabel = actions.setLabel;
		this.runtime.getActiveTools = actions.getActiveTools;
		this.runtime.getAllTools = actions.getAllTools;
		this.runtime.setActiveTools = actions.setActiveTools;
		this.runtime.refreshTools = actions.refreshTools;
		this.runtime.getCommands = actions.getCommands;
		bindExtensionMetadataActions(this.sessionManager, this.runtime, actions);
		this.runtime.getThinkingLevel = actions.getThinkingLevel;
		this.getModel = contextActions.getModel;
		this.isIdleFn = contextActions.isIdle;
		this.getSignalFn = contextActions.getSignal;
		this.abortFn = contextActions.abort;
		this.hasPendingMessagesFn = contextActions.hasPendingMessages;
		this.shutdownHandler = contextActions.shutdown;
		this.getContextUsageFn = contextActions.getContextUsage;
		this.compactFn = contextActions.compact;
		this.getSystemPromptFn = contextActions.getSystemPrompt;
		bindExtensionProviderActions(this.runtime, this.modelRegistry, (error) => this.emitError(error), providerActions);
	}
	bindCommandContext(actions) {
		if (actions) {
			this.waitForIdleFn = actions.waitForIdle;
			this.newSessionHandler = actions.newSession;
			this.forkHandler = actions.fork;
			this.navigateTreeHandler = actions.navigateTree;
			this.switchSessionHandler = actions.switchSession;
			this.reloadHandler = actions.reload;
			return;
		}
		this.waitForIdleFn = async () => {};
		this.newSessionHandler = async () => ({ cancelled: false });
		this.forkHandler = async () => ({ cancelled: false });
		this.navigateTreeHandler = async () => ({ cancelled: false });
		this.switchSessionHandler = async () => ({ cancelled: false });
		this.reloadHandler = async () => {};
	}
	setUIContext(uiContext) {
		this.uiContext = uiContext ?? noOpUIContext;
	}
	getUIContext() {
		return this.uiContext;
	}
	hasUI() {
		return this.uiContext !== noOpUIContext;
	}
	getExtensionPaths() {
		return this.extensions.map((e) => e.path);
	}
	/** Get all registered tools from all extensions (first registration per name wins). */
	getAllRegisteredTools() {
		const toolsByName = /* @__PURE__ */ new Map();
		for (const ext of this.extensions) for (const tool of ext.tools.values()) if (!toolsByName.has(tool.definition.name)) toolsByName.set(tool.definition.name, tool);
		return Array.from(toolsByName.values());
	}
	/** Get a tool definition by name. Returns undefined if not found. */
	getToolDefinition(toolName) {
		for (const ext of this.extensions) {
			const tool = ext.tools.get(toolName);
			if (tool) return tool.definition;
		}
	}
	getFlags() {
		const allFlags = /* @__PURE__ */ new Map();
		for (const ext of this.extensions) for (const [name, flag] of ext.flags) if (!allFlags.has(name)) allFlags.set(name, flag);
		return allFlags;
	}
	setFlagValue(name, value) {
		this.runtime.flagValues.set(name, value);
	}
	getFlagValues() {
		return new Map(this.runtime.flagValues);
	}
	getShortcuts(resolvedKeybindings) {
		this.shortcutDiagnostics = [];
		const builtinKeybindings = buildBuiltinKeybindings(resolvedKeybindings);
		const extensionShortcuts = /* @__PURE__ */ new Map();
		const addDiagnostic = (message, extensionPath) => {
			this.shortcutDiagnostics.push({
				type: "warning",
				message,
				path: extensionPath
			});
			if (!this.hasUI()) console.warn(message);
		};
		for (const ext of this.extensions) for (const [key, shortcut] of ext.shortcuts) {
			const normalizedKey = key.toLowerCase();
			const builtInKeybinding = builtinKeybindings[normalizedKey];
			if (builtInKeybinding?.restrictOverride === true) {
				addDiagnostic(`Extension shortcut '${key}' from ${shortcut.extensionPath} conflicts with built-in shortcut. Skipping.`, shortcut.extensionPath);
				continue;
			}
			if (builtInKeybinding?.restrictOverride === false) addDiagnostic(`Extension shortcut conflict: '${key}' is built-in shortcut for ${builtInKeybinding.keybinding} and ${shortcut.extensionPath}. Using ${shortcut.extensionPath}.`, shortcut.extensionPath);
			const existingExtensionShortcut = extensionShortcuts.get(normalizedKey);
			if (existingExtensionShortcut) addDiagnostic(`Extension shortcut conflict: '${key}' registered by both ${existingExtensionShortcut.extensionPath} and ${shortcut.extensionPath}. Using ${shortcut.extensionPath}.`, shortcut.extensionPath);
			extensionShortcuts.set(normalizedKey, shortcut);
		}
		return extensionShortcuts;
	}
	getShortcutDiagnostics() {
		return this.shortcutDiagnostics;
	}
	invalidate(message = "This extension ctx is stale after session replacement or reload. Do not use a captured api or command ctx after ctx.newSession(), ctx.fork(), ctx.switchSession(), or ctx.reload(). For newSession, fork, and switchSession, move post-replacement work into withSession and use the ctx passed to withSession. For reload, do not use the old ctx after await ctx.reload().") {
		if (!this.staleMessage) {
			this.staleMessage = message;
			this.runtime.invalidate(message);
		}
	}
	requireActive() {
		if (this.staleMessage) throw new Error(this.staleMessage);
		this.runtime.assertActive();
		return this;
	}
	onError(listener) {
		return registerListener(this.errorListeners, listener);
	}
	emitError(error) {
		for (const listener of this.errorListeners) listener(error);
	}
	hasHandlers(eventType) {
		return this.extensions.some((ext) => (ext.handlers.get(eventType)?.length ?? 0) > 0);
	}
	getMessageRenderer(customType) {
		for (const ext of this.extensions) {
			const renderer = ext.messageRenderers.get(customType);
			if (renderer) return renderer;
		}
	}
	resolveRegisteredCommands() {
		const commands = [];
		const counts = /* @__PURE__ */ new Map();
		for (const ext of this.extensions) for (const command of ext.commands.values()) {
			commands.push(command);
			counts.set(command.name, (counts.get(command.name) ?? 0) + 1);
		}
		const seen = /* @__PURE__ */ new Map();
		const takenInvocationNames = /* @__PURE__ */ new Set();
		return commands.map((command) => {
			const occurrence = (seen.get(command.name) ?? 0) + 1;
			seen.set(command.name, occurrence);
			let invocationName = (counts.get(command.name) ?? 0) > 1 ? `${command.name}:${occurrence}` : command.name;
			if (takenInvocationNames.has(invocationName)) {
				let suffix = occurrence;
				do {
					suffix++;
					invocationName = `${command.name}:${suffix}`;
				} while (takenInvocationNames.has(invocationName));
			}
			takenInvocationNames.add(invocationName);
			return Object.assign({}, command, { invocationName });
		});
	}
	getRegisteredCommands() {
		this.commandDiagnostics = [];
		return this.resolveRegisteredCommands();
	}
	getCommandDiagnostics() {
		return this.commandDiagnostics;
	}
	getCommand(name) {
		return this.resolveRegisteredCommands().find((command) => command.invocationName === name);
	}
	/**
	* Request a graceful shutdown. Called by extension tools and event handlers.
	* The actual shutdown behavior is provided by the mode via bindExtensions().
	*/
	shutdown() {
		this.shutdownHandler();
	}
	/**
	* Create an ExtensionContext for use in event handlers and tool execution.
	* Context values are resolved at call time, so changes via bindCore/bindUI are reflected.
	*/
	createContext() {
		const requireActiveRunner = () => this.requireActive();
		const getModel = this.getModel;
		return {
			get ui() {
				return requireActiveRunner().uiContext;
			},
			get hasUI() {
				return requireActiveRunner().hasUI();
			},
			get cwd() {
				return requireActiveRunner().cwd;
			},
			get sessionManager() {
				return requireActiveRunner().sessionManager;
			},
			get modelRegistry() {
				return requireActiveRunner().modelRegistry;
			},
			get model() {
				requireActiveRunner();
				return getModel();
			},
			isIdle: () => requireActiveRunner().isIdleFn(),
			get signal() {
				return requireActiveRunner().getSignalFn();
			},
			abort: () => requireActiveRunner().abortFn(),
			hasPendingMessages: () => requireActiveRunner().hasPendingMessagesFn(),
			shutdown: () => requireActiveRunner().shutdownHandler(),
			getContextUsage: () => requireActiveRunner().getContextUsageFn(),
			compact: (options) => requireActiveRunner().compactFn(options),
			getSystemPrompt: () => requireActiveRunner().getSystemPromptFn()
		};
	}
	createCommandContext() {
		return Object.assign(this.createContext(), {
			waitForIdle: () => this.requireActive().waitForIdleFn(),
			newSession: (options) => this.requireActive().newSessionHandler(options),
			fork: (entryId, options) => this.requireActive().forkHandler(entryId, options),
			navigateTree: (targetId, options) => this.requireActive().navigateTreeHandler(targetId, options),
			switchSession: (sessionPath, options) => this.requireActive().switchSessionHandler(sessionPath, options),
			reload: () => this.requireActive().reloadHandler()
		});
	}
	isSessionBeforeEvent(event) {
		return event.type === "session_before_switch" || event.type === "session_before_fork" || event.type === "session_before_compact" || event.type === "session_before_tree";
	}
	async dispatchHandlers(eventType, invoke, ctx) {
		let handlerContext = ctx;
		for (const ext of this.extensions) for (const handler of ext.handlers.get(eventType) ?? []) {
			handlerContext ??= this.createContext();
			try {
				const result = await invoke(handler, handlerContext, ext.path);
				if (result !== void 0) return result;
			} catch (err) {
				reportExtensionHandlerError(err, ext.path, eventType, (error) => this.emitError(error));
			}
		}
	}
	async emit(event) {
		let result;
		return await this.dispatchHandlers(event.type, async (handler, ctx) => {
			const handlerResult = await handler(event, ctx);
			if (this.isSessionBeforeEvent(event) && handlerResult) {
				result = handlerResult;
				if (result.cancel) return result;
			}
		}) ?? result;
	}
	async emitMessageEnd(event) {
		let currentMessage = event.message;
		let modified = false;
		await this.dispatchHandlers("message_end", async (handler, ctx, extensionPath) => {
			const handlerResult = await handler({
				...event,
				message: currentMessage
			}, ctx);
			if (handlerResult?.message) {
				if (handlerResult.message.role !== currentMessage.role) this.emitError({
					extensionPath,
					event: "message_end",
					error: "message_end handlers must return a message with the same role"
				});
				else {
					currentMessage = handlerResult.message;
					modified = true;
				}
			}
		});
		return modified ? currentMessage : void 0;
	}
	async emitToolResult(event) {
		const currentEvent = { ...event };
		let modified = false;
		await this.dispatchHandlers("tool_result", async (handler, ctx) => {
			const handlerResult = await handler(currentEvent, ctx);
			if (handlerResult?.content !== void 0) {
				currentEvent.content = handlerResult.content;
				modified = true;
			}
			if (handlerResult?.details !== void 0) {
				currentEvent.details = handlerResult.details;
				modified = true;
			}
			if (handlerResult?.isError !== void 0 || isToolResultError(handlerResult)) {
				currentEvent.isError = handlerResult?.isError ?? true;
				modified = true;
			}
			if (handlerResult?.terminate !== void 0) {
				currentEvent.terminate = handlerResult.terminate;
				modified = true;
			}
		});
		if (!modified) return;
		return {
			content: currentEvent.content,
			details: currentEvent.details,
			isError: currentEvent.isError,
			terminate: currentEvent.terminate
		};
	}
	async emitToolCall(event) {
		let ctx;
		let result;
		for (const ext of this.extensions) for (const handler of ext.handlers.get("tool_call") ?? []) {
			ctx ??= this.createContext();
			const handlerResult = await handler(event, ctx);
			if (handlerResult) {
				result = handlerResult;
				if (result.block) return result;
			}
		}
		return result;
	}
	async emitUserBash(event) {
		return await this.dispatchHandlers("user_bash", async (handler, ctx) => {
			const handlerResult = await handler(event, ctx);
			return handlerResult ? handlerResult : void 0;
		});
	}
	async emitContext(messages) {
		if (!this.hasHandlers("context")) return messages;
		let currentMessages = structuredClone(messages);
		await this.dispatchHandlers("context", async (handler, ctx) => {
			const handlerResult = await handler({
				type: "context",
				messages: currentMessages
			}, ctx);
			if (handlerResult?.messages) currentMessages = handlerResult.messages;
		});
		return currentMessages;
	}
	async emitBeforeProviderRequest(payload) {
		let currentPayload = payload;
		await this.dispatchHandlers("before_provider_request", async (handler, ctx) => {
			const handlerResult = await handler({
				type: "before_provider_request",
				payload: currentPayload
			}, ctx);
			if (handlerResult !== void 0) currentPayload = handlerResult;
		});
		return currentPayload;
	}
	async emitBeforeAgentStart(prompt, images, systemPrompt, systemPromptOptions) {
		let currentSystemPrompt = systemPrompt;
		const ctx = this.createContext();
		ctx.getSystemPrompt = () => {
			this.requireActive();
			return currentSystemPrompt;
		};
		const messages = [];
		let systemPromptModified = false;
		await this.dispatchHandlers("before_agent_start", async (handler, handlerCtx) => {
			const handlerResult = await handler({
				type: "before_agent_start",
				prompt,
				images,
				systemPrompt: currentSystemPrompt,
				systemPromptOptions
			}, handlerCtx);
			if (handlerResult?.message) messages.push(handlerResult.message);
			if (handlerResult?.systemPrompt !== void 0) {
				currentSystemPrompt = handlerResult.systemPrompt;
				systemPromptModified = true;
			}
		}, ctx);
		if (messages.length > 0 || systemPromptModified) return {
			messages: messages.length > 0 ? messages : void 0,
			systemPrompt: systemPromptModified ? currentSystemPrompt : void 0
		};
	}
	async emitResourcesDiscover(cwd, reason) {
		const paths = {
			skillPaths: [],
			promptPaths: [],
			themePaths: []
		};
		await this.dispatchHandlers("resources_discover", async (handler, ctx, extensionPath) => {
			const result = await handler({
				type: "resources_discover",
				cwd,
				reason
			}, ctx);
			for (const key of [
				"skillPaths",
				"promptPaths",
				"themePaths"
			]) {
				const discovered = result?.[key];
				if (discovered?.length) paths[key].push(...discovered.map((path) => ({
					path,
					extensionPath
				})));
			}
		});
		return paths;
	}
	/** Emit input event. Transforms chain, "handled" short-circuits. */
	async emitInput(text, images, source) {
		let currentText = text;
		let currentImages = images;
		const handled = await this.dispatchHandlers("input", async (handler, ctx) => {
			const result = await handler({
				type: "input",
				text: currentText,
				images: currentImages,
				source
			}, ctx);
			if (result?.action === "handled") return result;
			if (result?.action === "transform") {
				currentText = result.text;
				currentImages = result.images ?? currentImages;
			}
		});
		if (handled) return handled;
		return currentText !== text || currentImages !== images ? {
			action: "transform",
			text: currentText,
			images: currentImages
		} : { action: "continue" };
	}
};
//#endregion
//#region src/agents/sessions/queued-user-message-retirement.ts
const queuedUserMessageRetirements = /* @__PURE__ */ new WeakMap();
/** Binds one runtime message to the exact display entry created for it. */
function registerQueuedUserMessageRetirement(message, retire) {
	queuedUserMessageRetirements.set(message, retire);
}
/** Consumes the display retirement owned by this exact runtime message. */
function retireQueuedUserMessage(message) {
	const retire = queuedUserMessageRetirements.get(message);
	if (!retire) return false;
	queuedUserMessageRetirements.delete(message);
	return retire();
}
//#endregion
//#region src/agents/agent-hooks/session-manager-runtime-registry.ts
/** Creates a WeakMap-backed runtime registry keyed by SessionManager object identity. */
function createSessionManagerRuntimeRegistry() {
	const registry = /* @__PURE__ */ new WeakMap();
	return {
		set: (sessionManager, value) => {
			if (!sessionManager || typeof sessionManager !== "object") return;
			if (value === null) registry.delete(sessionManager);
			else registry.set(sessionManager, value);
		},
		get: (sessionManager) => {
			return sessionManager && typeof sessionManager === "object" ? registry.get(sessionManager) ?? null : null;
		}
	};
}
//#endregion
//#region src/agents/sessions/session-tool-result-redaction.ts
const preparers = createSessionManagerRuntimeRegistry();
const unchangedToolResult = () => false;
/** Bind the guard's policy without extending the public SessionManager contract. */
function setSessionToolResultPreparer(sessionManager, preparation) {
	preparers.set(sessionManager, preparation);
}
function createSessionToolResultPreparer(sessionManager, event) {
	if (event.type !== "message_end" || event.message.role !== "toolResult") return unchangedToolResult;
	let sources;
	return () => {
		if (event.message.role !== "toolResult") return false;
		const message = event.message;
		const preparation = preparers.get(sessionManager);
		const prepare = preparation?.prepareText ?? prepareModelVisibleToolTextBlock;
		const fullContent = message.content.map((block) => {
			if (block.type !== "text") return block;
			const previous = sources?.get(block);
			if (!previous || previous.text !== block.text) return prepare(block);
			const source = {
				...block,
				text: previous.source.text
			};
			copyPreparedModelVisibleToolText(previous.source, source);
			return prepare(source);
		});
		const full = {
			...message,
			content: fullContent
		};
		const capped = preparation?.cap(full) ?? full;
		let nextSources;
		const content = capped === full ? fullContent : capped.content.map((block, index) => {
			if (block.type !== "text") return block;
			const prepared = prepare(block);
			const source = fullContent[index];
			if (source?.type === "text" && source.text !== prepared.text) (nextSources ??= /* @__PURE__ */ new Map()).set(prepared, {
				source,
				text: prepared.text
			});
			return prepared;
		});
		sources = nextSources;
		const changed = content.some((block, index) => {
			const previous = message.content[index];
			return block.type === "text" && previous?.type === "text" && block.text !== previous.text;
		});
		if (content.some((block, index) => block !== message.content[index])) {
			if (Object.isFrozen(message)) event.message = copyInternalToolResultState(message, freezeJsonSnapshot({
				...message,
				content
			}));
			else message.content = content;
		}
		return changed;
	};
}
//#endregion
//#region src/agents/sessions/steering-message-identity.ts
const STEERING_MESSAGE_IDENTITY = Symbol.for("openclaw.steeringMessageIdentity");
const steeringMessagePersistenceFailureListeners = /* @__PURE__ */ new Map();
function setSteeringMessageIdentity(message, identity) {
	if (identity) Object.defineProperty(message, STEERING_MESSAGE_IDENTITY, {
		configurable: true,
		value: identity
	});
}
function getSteeringMessageIdentity(message) {
	return message && typeof message === "object" ? message[STEERING_MESSAGE_IDENTITY] : void 0;
}
/** Keeps persistence failures private to the exact in-flight steering identity. */
function subscribeSteeringMessagePersistenceFailure(identity, listener) {
	const listeners = steeringMessagePersistenceFailureListeners.get(identity) ?? /* @__PURE__ */ new Set();
	listeners.add(listener);
	steeringMessagePersistenceFailureListeners.set(identity, listeners);
	return () => {
		listeners.delete(listener);
		if (listeners.size === 0 && steeringMessagePersistenceFailureListeners.get(identity) === listeners) steeringMessagePersistenceFailureListeners.delete(identity);
	};
}
/** Rejects a queued receipt before a failed append can strand or acknowledge its source. */
function reportSteeringMessagePersistenceFailure(message, error) {
	const identity = getSteeringMessageIdentity(message);
	if (identity) steeringMessagePersistenceFailureListeners.get(identity)?.forEach((listener) => listener(error));
}
//#endregion
//#region src/shared/tilde-path.ts
/**
* Expands a leading `~` against the OS home dir, keeping relative inputs
* relative so callers can resolve them against their own base dir. Unlike
* `resolveHomeRelativePath`, `~name` is treated as `<home>/name` (shipped
* loader behavior for prompt/skill path lists).
*/
function expandTildePath(input) {
	const trimmed = input.trim();
	if (trimmed === "~") return homedir();
	if (trimmed.startsWith("~/")) return join(homedir(), trimmed.slice(2));
	if (trimmed.startsWith("~")) return join(homedir(), trimmed.slice(1));
	return trimmed;
}
//#endregion
//#region src/skills/loading/session.ts
const MAX_NAME_LENGTH = 64;
const MAX_DESCRIPTION_LENGTH = 1024;
function validateSkillMetadata(name, description) {
	const errors = [];
	if (!description || description.trim() === "") errors.push("description is required");
	else if (description.length > MAX_DESCRIPTION_LENGTH) errors.push(`description exceeds ${MAX_DESCRIPTION_LENGTH} characters (${description.length})`);
	if (name.length > MAX_NAME_LENGTH) errors.push(`name exceeds ${MAX_NAME_LENGTH} characters (${name.length})`);
	if (!/^[a-z0-9-]+$/.test(name)) errors.push(`name contains invalid characters (must be lowercase a-z, 0-9, hyphens only)`);
	if (name.startsWith("-") || name.endsWith("-")) errors.push(`name must not start or end with a hyphen`);
	if (name.includes("--")) errors.push(`name must not contain consecutive hyphens`);
	return errors;
}
function resolveSkillEntryType(dir, entry) {
	if (!entry.isSymbolicLink()) return entry;
	try {
		return statSync(join(dir, entry.name));
	} catch {
		return;
	}
}
function loadSkillsFromDirInternal(dir, source, includeRootFiles, ignoreMatcher, rootDir) {
	const skills = [];
	const diagnostics = [];
	if (!existsSync(dir)) return {
		skills,
		diagnostics
	};
	const root = rootDir ?? dir;
	const ig = addIgnoreRules(dir, root, ignoreMatcher);
	try {
		const entries = readdirSync(dir, { withFileTypes: true });
		const skillFile = entries.find((entry) => entry.name === "SKILL.md");
		if (skillFile && resolveSkillEntryType(dir, skillFile)?.isFile()) {
			const fullPath = join(dir, skillFile.name);
			const relPath = normalizeNativePathSeparators(relative(root, fullPath));
			if (!ig.ignores(relPath)) return loadSkillFromFile(fullPath, source);
		}
		for (const entry of entries) {
			if (entry.name.startsWith(".")) continue;
			if (entry.name === "node_modules") continue;
			const fullPath = join(dir, entry.name);
			const entryType = resolveSkillEntryType(dir, entry);
			if (!entryType) continue;
			const isDirectory = entryType.isDirectory();
			const relPath = normalizeNativePathSeparators(relative(root, fullPath));
			const ignorePath = isDirectory ? `${relPath}/` : relPath;
			if (ig.ignores(ignorePath)) continue;
			if (!isDirectory && (!entryType.isFile() || !includeRootFiles || !entry.name.endsWith(".md"))) continue;
			const result = isDirectory ? loadSkillsFromDirInternal(fullPath, source, false, ig, root) : loadSkillFromFile(fullPath, source);
			skills.push(...result.skills);
			diagnostics.push(...result.diagnostics);
		}
	} catch (error) {
		const message = error instanceof Error ? error.message : "failed to scan skill directory";
		diagnostics.push({
			type: "warning",
			message,
			path: dir
		});
	}
	return {
		skills,
		diagnostics
	};
}
function loadSkillFromFile(filePath, source) {
	const diagnostics = [];
	try {
		const rawContent = readFileSync(filePath, "utf-8");
		const frontmatter = parseSkillFrontmatter(rawContent);
		const skillDir = dirname(filePath);
		const name = frontmatter.name || basename(skillDir);
		for (const error of validateSkillMetadata(name, frontmatter.description)) diagnostics.push({
			type: "warning",
			message: error,
			path: filePath
		});
		if (!frontmatter.description || frontmatter.description.trim() === "") return {
			skills: [],
			diagnostics
		};
		return {
			skills: [materializeSkill({
				content: rawContent,
				frontmatter,
				name,
				description: frontmatter.description,
				filePath,
				baseDir: skillDir,
				source,
				sourceOptions: source === "user" || source === "project" ? {
					source: "local",
					scope: source
				} : { source: source === "path" ? "local" : source }
			})],
			diagnostics
		};
	} catch (error) {
		const message = error instanceof Error ? error.message : "failed to parse skill file";
		diagnostics.push({
			type: "warning",
			message,
			path: filePath
		});
		return {
			skills: [],
			diagnostics
		};
	}
}
/** Agent Skills catalog: https://agentskills.io/integrate-skills */
function formatSkillsForPrompt(skills) {
	return formatSkillsForPromptBounded({ skills: skills.filter((s) => !s.disableModelInvocation) });
}
function resolveSkillPath(p, cwd) {
	const normalized = expandTildePath(p);
	return isAbsolute(normalized) ? normalized : resolve(cwd, normalized);
}
function loadSkills(options) {
	const { cwd, agentDir, skillPaths, includeDefaults } = options;
	const resolvedAgentDir = agentDir ?? getAgentDir();
	const skillMap = /* @__PURE__ */ new Map();
	const realPathSet = /* @__PURE__ */ new Set();
	const allDiagnostics = [];
	const collisionDiagnostics = [];
	function addSkills(result) {
		allDiagnostics.push(...result.diagnostics);
		for (const skill of result.skills) {
			const realPath = canonicalizePath(skill.filePath);
			if (realPathSet.has(realPath)) continue;
			const existing = skillMap.get(skill.name);
			if (existing) collisionDiagnostics.push({
				type: "collision",
				message: `name "${skill.name}" collision`,
				path: skill.filePath,
				collision: {
					resourceType: "skill",
					name: skill.name,
					winnerPath: existing.filePath,
					loserPath: skill.filePath
				}
			});
			else {
				skillMap.set(skill.name, skill);
				realPathSet.add(realPath);
			}
		}
	}
	if (includeDefaults) {
		addSkills(loadSkillsFromDirInternal(join(resolvedAgentDir, "skills"), "user", true));
		addSkills(loadSkillsFromDirInternal(resolve(cwd, CONFIG_DIR_NAME, "skills"), "project", true));
	}
	const userSkillsDir = join(resolvedAgentDir, "skills");
	const projectSkillsDir = resolve(cwd, CONFIG_DIR_NAME, "skills");
	const getSource = (resolvedPath) => {
		if (!includeDefaults) {
			if (isPathInside(userSkillsDir, resolvedPath)) return "user";
			if (isPathInside(projectSkillsDir, resolvedPath)) return "project";
		}
		return "path";
	};
	for (const rawPath of skillPaths) {
		const resolvedPath = resolveSkillPath(rawPath, cwd);
		if (!existsSync(resolvedPath)) {
			allDiagnostics.push({
				type: "warning",
				message: "skill path does not exist",
				path: resolvedPath
			});
			continue;
		}
		try {
			const stats = statSync(resolvedPath);
			const source = getSource(resolvedPath);
			if (stats.isDirectory()) addSkills(loadSkillsFromDirInternal(resolvedPath, source, true));
			else if (stats.isFile() && resolvedPath.endsWith(".md")) addSkills(loadSkillFromFile(resolvedPath, source));
			else allDiagnostics.push({
				type: "warning",
				message: "skill path is not a markdown file",
				path: resolvedPath
			});
		} catch (error) {
			const message = error instanceof Error ? error.message : "failed to read skill path";
			allDiagnostics.push({
				type: "warning",
				message,
				path: resolvedPath
			});
		}
	}
	return {
		skills: Array.from(skillMap.values()),
		diagnostics: [...allDiagnostics, ...collisionDiagnostics]
	};
}
//#endregion
//#region src/agents/sessions/system-prompt.ts
/** Build the system prompt with tools, guidelines, and context */
function buildSystemPrompt(options) {
	const { customPrompt, selectedTools, toolSnippets, promptGuidelines, appendSystemPrompt, cwd, contextFiles: providedContextFiles, skills: providedSkills } = options;
	const promptCwd = cwd.replace(/\\/g, "/");
	const now = /* @__PURE__ */ new Date();
	const date = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
	const appendSection = appendSystemPrompt ? `\n\n${appendSystemPrompt}` : "";
	const contextFiles = providedContextFiles ?? [];
	const skills = providedSkills ?? [];
	let prompt = customPrompt;
	let hasRead = false;
	if (!prompt) {
		const readmePath = getReadmePath();
		const docsPath = getDocsPath();
		const examplesPath = getExamplesPath();
		const tools = selectedTools || [
			"read",
			"bash",
			"edit",
			"write"
		];
		const visibleTools = tools.filter((name) => Boolean(toolSnippets?.[name]));
		const toolsList = visibleTools.length > 0 ? visibleTools.map((name) => `- ${name}: ${toolSnippets[name]}`).join("\n") : "(none)";
		const guidelines = /* @__PURE__ */ new Set();
		const hasBash = tools.includes("bash");
		const hasGrep = tools.includes("grep");
		const hasFind = tools.includes("find");
		const hasLs = tools.includes("ls");
		hasRead = tools.includes("read");
		if (hasBash && !hasGrep && !hasFind && !hasLs) guidelines.add("Use bash for file operations like ls, rg, find");
		else if (hasBash && (hasGrep || hasFind || hasLs)) guidelines.add("Prefer grep/find/ls tools over bash for file exploration (faster, respects .gitignore)");
		for (const guideline of promptGuidelines ?? []) {
			const normalized = guideline.trim();
			if (normalized.length > 0) guidelines.add(normalized);
		}
		guidelines.add("Be concise in your responses");
		guidelines.add("Show file paths clearly when working with files");
		prompt = `You are an expert coding assistant operating inside OpenClaw's embedded coding agent harness. You help users by reading files, executing commands, editing code, and writing new files.

Available tools:
${toolsList}

In addition to the tools above, you may have access to other custom tools depending on the project.

Guidelines:
${Array.from(guidelines, (guideline) => `- ${guideline}`).join("\n")}

${buildPromisedWorkPromptSection().join("\n")}

Embedded agent documentation (read only when the user asks about the embedded agent SDK, extensions, themes, skills, or TUI):
- Main documentation: ${readmePath}
- Additional docs: ${docsPath}
- Examples: ${examplesPath} (extensions, custom tools, SDK)
- When reading embedded agent docs or examples, resolve docs/... under Additional docs and examples/... under Examples, not the current working directory
- When asked about: extensions (docs/extensions.md, examples/extensions/), themes (docs/themes.md), skills (docs/skills.md), prompt templates (docs/prompt-templates.md), TUI components (docs/tui.md), keybindings (docs/keybindings.md), SDK integrations (docs/sdk.md), custom providers (docs/custom-provider.md), adding models (docs/models.md), runtime packages (docs/packages.md)
- When working on embedded agent topics, read the docs and examples, and follow .md cross-references before implementing
- Always read embedded agent .md files completely and follow links to related docs (e.g., tui.md for TUI API details)`;
	}
	if (appendSection) prompt += appendSection;
	if (contextFiles.length > 0) {
		prompt += "\n\n<project_context>\n\n";
		prompt += "Project-specific instructions and guidelines:\n\n";
		for (const { path: filePath, content } of contextFiles) prompt += `<project_instructions path="${filePath}">\n${content}\n</project_instructions>\n\n`;
		prompt += "</project_context>\n";
	}
	if (customPrompt) hasRead = !selectedTools || selectedTools.includes("read");
	if (hasRead && skills.length > 0) prompt += formatSkillsForPrompt(skills);
	prompt += `\nCurrent date: ${date}`;
	prompt += `\nCurrent working directory: ${promptCwd}`;
	return prompt;
}
//#endregion
//#region src/agents/sessions/agent-session-base.ts
const log = createSubsystemLogger("agents/session");
var AgentSessionBase = class {
	constructor(config) {
		this.eventListeners = [];
		this.steeringMessages = [];
		this.followUpMessages = [];
		this.pendingNextTurnMessages = [];
		this.compactionAbortController = void 0;
		this.autoCompactionAbortController = void 0;
		this.overflowRecoveryAttempts = 0;
		this.branchSummaryAbortController = void 0;
		this.extensionModifiedToolResultIds = /* @__PURE__ */ new Set();
		this.retryAbortController = void 0;
		this.retryCount = 0;
		this.turnIndex = 0;
		this.baseToolDefinitions = /* @__PURE__ */ new Map();
		this.toolRegistry = /* @__PURE__ */ new Map();
		this.toolDefinitions = /* @__PURE__ */ new Map();
		this.toolPromptSnippets = /* @__PURE__ */ new Map();
		this.toolPromptGuidelines = /* @__PURE__ */ new Map();
		this.baseSystemPrompt = "";
		this.lastAssistantMessage = void 0;
		this.lastRunEndedForTurnHandoff = false;
		this.handleAgentEvent = async (event, signal) => {
			const prepareToolResult = createSessionToolResultPreparer(this.sessionManager, event);
			if (event.type === "agent_end") {
				const reason = signal?.reason;
				this.lastRunEndedForTurnHandoff = signal?.aborted === true && typeof reason === "object" && reason !== null && reason.turnHandoff === true;
			}
			if (this.eventMayWriteSession(event)) {
				await this.runWithSessionWriteSettlement(async () => await this.handleAgentEventUnlocked(event, prepareToolResult));
				prepareToolResult();
				return;
			}
			await this.handleAgentEventUnlocked(event, prepareToolResult);
		};
		this.agent = config.agent;
		this.sessionManager = config.sessionManager;
		this.settingsManager = config.settingsManager;
		this.sessionResourceLoader = config.resourceLoader;
		this.customTools = config.customTools ?? [];
		this.cwd = config.cwd;
		this.sessionModelRegistry = config.modelRegistry;
		this.extensionRunnerRef = config.extensionRunnerRef;
		this.initialActiveToolNames = config.initialActiveToolNames;
		this.allowedToolNames = config.allowedToolNames ? new Set(config.allowedToolNames) : void 0;
		this.disableBuiltInTools = config.disableBuiltInTools === true;
		this.baseToolsOverride = config.baseToolsOverride;
		this.sessionStartEvent = config.sessionStartEvent ?? {
			type: "session_start",
			reason: "startup"
		};
		this.withExternalSessionWriteSettlement = config.withSessionWriteSettlement;
		this.contextOverflowRecoveryOwner = config.contextOverflowRecoveryOwner ?? "session";
		this.resolveCompactionThinkingLevel = config.resolveCompactionThinkingLevel;
		this.cleanupProviderSessionResourcesOnDispose = config.cleanupProviderSessionResourcesOnDispose ?? true;
	}
	/** Model registry for API key resolution and model discovery */
	get modelRegistry() {
		return this.sessionModelRegistry;
	}
	async getRequiredRequestAuth(model) {
		const result = await this.sessionModelRegistry.getApiKeyAndHeaders(model);
		if (!result.ok) {
			if (result.error.startsWith("No API key found")) throw new Error(formatNoApiKeyFoundMessage(model.provider));
			throw new Error(result.error);
		}
		if (result.apiKey) return {
			apiKey: result.apiKey,
			headers: result.headers
		};
		if (this.sessionModelRegistry.isUsingOAuth(model)) throw new Error(`Authentication failed for "${model.provider}". Credentials may have expired or network is unavailable. Run '/login ${model.provider}' to re-authenticate.`);
		throw new Error(formatNoApiKeyFoundMessage(model.provider));
	}
	async getCompactionRequestAuth(model) {
		if (getStreamLlmRuntime(this.agent.streamFn) === getModelRegistryRuntime(this.sessionModelRegistry).llmRuntime) return this.getRequiredRequestAuth(model);
		const result = await this.sessionModelRegistry.getApiKeyAndHeaders(model);
		return result.ok ? {
			apiKey: result.apiKey,
			headers: result.headers
		} : {};
	}
	async runWithSessionWriteSettlement(run) {
		return this.withExternalSessionWriteSettlement ? await this.withExternalSessionWriteSettlement(run) : await run();
	}
	eventMayWriteSession(event) {
		return event.type === "message_end" || this.currentExtensionRunner.hasHandlers(event.type);
	}
	/**
	* Hooks resolve the current extension runner at execution time so reloads
	* need no reinstall. Wrappers only adapt registered tools to extension context.
	*/
	installAgentToolHooks() {
		this.agent.beforeToolCall = async ({ toolCall, args }) => {
			const runner = this.currentExtensionRunner;
			return await this.runWithSessionWriteSettlement(async () => {
				if (!runner.hasHandlers("tool_call")) return;
				try {
					return await runner.emitToolCall({
						type: "tool_call",
						toolName: toolCall.name,
						toolCallId: toolCall.id,
						input: args
					});
				} catch (err) {
					if (err instanceof Error) throw err;
					throw new Error(`Extension failed, blocking execution: ${String(err)}`, { cause: err });
				}
			});
		};
		this.agent.afterToolCall = async ({ toolCall, args, result, isError }) => {
			const resultIsError = isError || isToolResultError(result);
			const runner = this.currentExtensionRunner;
			if (!runner.hasHandlers("tool_result")) return { isError: resultIsError };
			const hookResult = await this.runWithSessionWriteSettlement(async () => await runner.emitToolResult({
				type: "tool_result",
				toolName: toolCall.name,
				toolCallId: toolCall.id,
				input: args,
				content: result.content,
				details: result.details,
				isError: resultIsError,
				...result.terminate !== void 0 ? { terminate: result.terminate } : {}
			}));
			if (hookResult) this.extensionModifiedToolResultIds.add(toolCall.id);
			return {
				...hookResult,
				isError: hookResult?.isError ?? resultIsError
			};
		};
		this.agent.afterToolOutcome = async ({ executionStarted, result, isError }) => executionStarted ? void 0 : { isError: isError || isToolResultError(result) };
	}
	/** Copy-on-write listener registration keeps dispatch stable without per-event snapshots. */
	emit(event) {
		for (const l of this.eventListeners) l(event);
	}
	/** Terminal listeners form a barrier before retry, compaction, or queue draining. */
	async emitTerminal(event) {
		const listeners = this.eventListeners;
		for (const listener of listeners) try {
			await listener(event);
		} catch (error) {
			log.warn(`agent_end listener failed: ${String(error)}`);
		}
	}
	emitQueueUpdate() {
		this.emit({
			type: "queue_update",
			steering: this.steeringMessages.map((entry) => entry.text),
			followUp: this.followUpMessages.map((entry) => entry.text)
		});
	}
	trackQueuedUserMessage(message, owner, text) {
		const queue = owner === "steering" ? this.steeringMessages : this.followUpMessages;
		const entry = { text };
		queue.push(entry);
		registerQueuedUserMessageRetirement(message, () => {
			if (queue !== this.steeringMessages && queue !== this.followUpMessages) return false;
			const queueIndex = queue.indexOf(entry);
			if (queueIndex === -1) return false;
			queue.splice(queueIndex, 1);
			this.emitQueueUpdate();
			return true;
		});
		this.emitQueueUpdate();
	}
	async handleAgentEventUnlocked(event, prepareToolResult) {
		if (event.type === "agent_start") this.lastAssistantEntryId = void 0;
		if (event.type === "message_start" && event.message.role === "user") {
			this.overflowRecoveryAttempts = 0;
			retireQueuedUserMessage(event.message);
		}
		const sourceSlots = event.type === "message_end" ? takeCodeModeResponseSource(event.message) : void 0;
		let messageChanged = false;
		if (event.type !== "message_update" || this.currentExtensionRunner.hasHandlers(event.type)) messageChanged = await this.emitExtensionEvent(event);
		messageChanged = prepareToolResult() || messageChanged;
		const publishAfterPersistence = event.type === "message_end" && event.message.role === "user";
		if (event.type === "agent_end") await this.emitTerminal({
			...event,
			willRetry: this.willRetryAfterAgentEnd(event),
			...this.lastAssistantEntryId ? { assistantEntryId: this.lastAssistantEntryId } : {}
		});
		else if (!publishAfterPersistence) this.emit(event);
		messageChanged = prepareToolResult() || messageChanged;
		if (event.type === "message_end") {
			if (event.message.role === "custom") {
				const message = event.message;
				await this.sessionManager.appendCustomMessageEntryAsync(message.customType, message.content, message.display, message.details);
			} else if (event.message.role === "user" || event.message.role === "assistant" || event.message.role === "toolResult") {
				const toolResultChangedByExtension = event.message.role === "toolResult" && this.extensionModifiedToolResultIds.delete(event.message.toolCallId);
				try {
					const retainedSteeringContext = event.message.role === "user" && shouldRetainSteeringRuntimeContext(this) ? getSteeringRuntimeContext(event.message) : void 0;
					if (retainedSteeringContext) await this.sessionManager.appendCustomMessageEntryAsync(retainedSteeringContext.customType, retainedSteeringContext.content, retainedSteeringContext.display, retainedSteeringContext.details);
					const entryId = await persistAgentSessionMessage(this.sessionManager, event.message, {
						invalidateSerializedPrefixCache: messageChanged || toolResultChangedByExtension,
						sourceAppend: sourceSlots
					});
					if (event.message.role === "assistant") this.lastAssistantEntryId = entryId;
				} catch (error) {
					if (event.message.role === "user") reportSteeringMessagePersistenceFailure(event.message, error);
					throw error;
				}
				if (event.message.role === "user") this.emit(event);
			}
			if (event.message.role === "assistant") this.lastAssistantMessage = event.message;
		}
		if (event.type === "turn_end" && event.message.role === "assistant") {
			const assistantMsg = event.message;
			if (assistantMsg.stopReason !== "error" && assistantMsg.stopReason !== "length") this.overflowRecoveryAttempts = 0;
			if (assistantMsg.stopReason !== "error" && this.retryCount > 0) {
				this.emit({
					type: "auto_retry_end",
					success: assistantMsg.stopReason !== "aborted",
					attempt: this.retryCount,
					...assistantMsg.stopReason === "aborted" ? { finalError: assistantMsg.errorMessage } : {}
				});
				this.retryCount = 0;
			}
		}
	}
	willRetryAfterAgentEnd(event) {
		const settings = this.settingsManager.getRetrySettings();
		if (!settings.enabled || this.retryCount >= settings.maxRetries) return false;
		const lastAssistant = event.messages.findLast((message) => message.role === "assistant");
		return lastAssistant !== void 0 && this.isRetryableError(lastAssistant);
	}
	/** Find the last assistant message in agent state (including aborted ones) */
	findLastAssistantMessage() {
		return this.agent.state.messages.findLast((message) => message.role === "assistant");
	}
	async emitExtensionEvent(event) {
		if (event.type === "agent_start") {
			this.turnIndex = 0;
			await this.currentExtensionRunner.emit({ type: "agent_start" });
		} else if (event.type === "agent_end") await this.currentExtensionRunner.emit({
			type: "agent_end",
			messages: event.messages
		});
		else if (event.type === "turn_start") await this.currentExtensionRunner.emit({
			type: "turn_start",
			turnIndex: this.turnIndex,
			timestamp: Date.now()
		});
		else if (event.type === "turn_end") {
			await this.currentExtensionRunner.emit({
				type: "turn_end",
				turnIndex: this.turnIndex,
				message: event.message,
				toolResults: event.toolResults
			});
			this.turnIndex++;
		} else if (event.type === "message_start") await this.currentExtensionRunner.emit({
			type: "message_start",
			message: event.message
		});
		else if (event.type === "message_update") await this.currentExtensionRunner.emit({
			type: "message_update",
			message: event.message,
			assistantMessageEvent: event.assistantMessageEvent
		});
		else if (event.type === "message_end") {
			const replacement = await this.currentExtensionRunner.emitMessageEnd({
				type: "message_end",
				message: event.message
			});
			if (replacement) {
				replaceAgentMessageInPlace(event.message, replacement);
				return true;
			}
		} else if (event.type === "tool_execution_start") await this.currentExtensionRunner.emit({
			type: "tool_execution_start",
			toolCallId: event.toolCallId,
			toolName: event.toolName,
			args: event.args
		});
		else if (event.type === "tool_execution_update") await this.currentExtensionRunner.emit({
			type: "tool_execution_update",
			toolCallId: event.toolCallId,
			toolName: event.toolName,
			args: event.args,
			partialResult: event.partialResult
		});
		else if (event.type === "tool_execution_end") await this.currentExtensionRunner.emit({
			type: "tool_execution_end",
			toolCallId: event.toolCallId,
			toolName: event.toolName,
			result: event.result,
			isError: event.isError
		});
		return false;
	}
	/**
	* Subscribe to agent events.
	* Session persistence is handled internally (saves messages on message_end).
	* Multiple listeners can be added. Returns unsubscribe function for this listener.
	*/
	subscribe(listener) {
		this.eventListeners = [...this.eventListeners, listener];
		return () => {
			const index = this.eventListeners.indexOf(listener);
			if (index !== -1) this.eventListeners = this.eventListeners.toSpliced(index, 1);
		};
	}
	/**
	* Temporarily disconnect from agent events.
	* User listeners are preserved and will receive events again after resubscribe().
	* Used internally during operations that need to pause event processing.
	*/
	disconnectFromAgent() {
		if (this.unsubscribeAgent) {
			this.unsubscribeAgent();
			this.unsubscribeAgent = void 0;
		}
	}
	/**
	* Reconnect to agent events after disconnectFromAgent().
	* Preserves all existing listeners.
	*/
	reconnectToAgent() {
		if (this.unsubscribeAgent) return;
		this.unsubscribeAgent = this.agent.subscribe(this.handleAgentEvent);
	}
	/**
	* Remove all listeners and disconnect from agent.
	* Call this when completely done with the session.
	*/
	dispose() {
		notifyListeners([
			() => this.abortRetry(),
			() => this.abortCompaction(),
			() => this.abortBranchSummary(),
			() => this.agent.abort()
		], void 0);
		this.currentExtensionRunner.invalidate();
		this.disconnectFromAgent();
		this.eventListeners = [];
		if (this.cleanupProviderSessionResourcesOnDispose) cleanupSessionResources(this.sessionId);
	}
	/** Full agent state */
	get state() {
		return this.agent.state;
	}
	/** Current model (may be undefined if not yet selected) */
	get model() {
		return this.agent.state.model;
	}
	/** Current thinking level */
	get thinkingLevel() {
		return this.agent.state.thinkingLevel;
	}
	/** Whether agent is currently streaming a response */
	get isStreaming() {
		return this.agent.state.isStreaming;
	}
	/** Current effective system prompt (includes any per-turn extension modifications) */
	get systemPrompt() {
		return this.agent.state.systemPrompt;
	}
	/** Current retry attempt (0 if not retrying) */
	get retryAttempt() {
		return this.retryCount;
	}
	/** Names of the tools currently set on the agent. */
	getActiveToolNames() {
		return this.agent.state.tools.map((t) => t.name);
	}
	/** All configured tools with their schema and source metadata. */
	getAllTools() {
		return Array.from(this.toolDefinitions.values()).map(({ definition, sourceInfo }) => ({
			name: definition.name,
			description: definition.description,
			parameters: definition.parameters,
			sourceInfo
		}));
	}
	getToolDefinition(name) {
		return this.toolDefinitions.get(name)?.definition;
	}
	/**
	* Set active tools by name.
	* Only tools in the registry can be enabled. Unknown tool names are ignored.
	* Also rebuilds the system prompt to reflect the new tool set.
	* Changes take effect on the next agent turn.
	*/
	setActiveToolsByName(toolNames) {
		const tools = [];
		const validToolNames = [];
		for (const name of toolNames) {
			const tool = this.toolRegistry.get(name);
			if (tool) {
				tools.push(tool);
				validToolNames.push(name);
			}
		}
		this.agent.state.tools = tools;
		this.baseSystemPrompt = this.rebuildSystemPrompt(validToolNames);
		this.agent.state.systemPrompt = this.systemPromptOverride ?? this.baseSystemPrompt;
	}
	/** Set an exact base prompt owned by the current runtime. */
	setBaseSystemPrompt(systemPrompt) {
		const { validToolNames, toolSnippets, promptGuidelines } = this.collectActiveToolPromptMetadata(this.getActiveToolNames());
		this.exactBaseSystemPrompt = systemPrompt;
		this.baseSystemPrompt = systemPrompt;
		this.baseSystemPromptOptions = {
			cwd: this.cwd,
			selectedTools: validToolNames,
			toolSnippets,
			promptGuidelines,
			customPrompt: systemPrompt
		};
		this.agent.state.systemPrompt = systemPrompt;
	}
	/** Whether compaction or branch summarization is currently running */
	get isCompacting() {
		return this.autoCompactionAbortController !== void 0 || this.compactionAbortController !== void 0 || this.branchSummaryAbortController !== void 0;
	}
	/** All messages including custom types like BashExecutionMessage */
	get messages() {
		return this.agent.state.messages;
	}
	/** Current steering mode */
	get steeringMode() {
		return this.agent.steeringMode;
	}
	/** Current follow-up mode */
	get followUpMode() {
		return this.agent.followUpMode;
	}
	/** Current persisted transcript target, or undefined for in-memory sessions. */
	get sessionTarget() {
		return this.sessionManager.getSessionTarget();
	}
	/** Current persisted session key, or undefined for in-memory sessions. */
	get sessionKey() {
		return this.sessionTarget?.sessionKey;
	}
	/** @deprecated Compatibility token; returns the session key, not a file path. */
	get sessionFile() {
		return this.sessionKey;
	}
	/** Current session ID */
	get sessionId() {
		return this.sessionManager.getSessionId();
	}
	/** Current session display name, if set */
	get sessionName() {
		return this.sessionManager.getSessionName();
	}
	/** File-based prompt templates */
	get promptTemplates() {
		return this.sessionResourceLoader.getPrompts().prompts;
	}
	normalizePromptSnippet(text) {
		if (!text) return;
		const oneLine = text.replace(/[\r\n]+/g, " ").replace(/\s+/g, " ").trim();
		return oneLine.length > 0 ? oneLine : void 0;
	}
	normalizePromptGuidelines(guidelines) {
		return [...new Set(guidelines?.map((guideline) => guideline.trim()).filter(Boolean))];
	}
	collectActiveToolPromptMetadata(toolNames) {
		const validToolNames = toolNames.filter((name) => this.toolRegistry.has(name));
		const toolSnippets = {};
		const promptGuidelines = [];
		for (const name of validToolNames) {
			const snippet = this.toolPromptSnippets.get(name);
			if (snippet) toolSnippets[name] = snippet;
			const toolGuidelines = this.toolPromptGuidelines.get(name);
			if (toolGuidelines) promptGuidelines.push(...toolGuidelines);
		}
		return {
			validToolNames,
			toolSnippets,
			promptGuidelines
		};
	}
	rebuildSystemPrompt(toolNames) {
		const { validToolNames, toolSnippets, promptGuidelines } = this.collectActiveToolPromptMetadata(toolNames);
		if (this.exactBaseSystemPrompt !== void 0) {
			this.baseSystemPromptOptions = {
				...this.baseSystemPromptOptions,
				cwd: this.cwd,
				customPrompt: this.exactBaseSystemPrompt,
				selectedTools: validToolNames,
				toolSnippets,
				promptGuidelines
			};
			return this.exactBaseSystemPrompt;
		}
		const loaderSystemPrompt = this.sessionResourceLoader.getSystemPrompt();
		const loaderAppendSystemPrompt = this.sessionResourceLoader.getAppendSystemPrompt();
		const appendSystemPrompt = loaderAppendSystemPrompt.length > 0 ? loaderAppendSystemPrompt.join("\n\n") : void 0;
		const loadedSkills = this.sessionResourceLoader.getSkills().skills;
		const loadedContextFiles = this.sessionResourceLoader.getAgentsFiles().agentsFiles;
		this.baseSystemPromptOptions = {
			cwd: this.cwd,
			skills: loadedSkills,
			contextFiles: loadedContextFiles,
			customPrompt: loaderSystemPrompt,
			appendSystemPrompt,
			selectedTools: validToolNames,
			toolSnippets,
			promptGuidelines
		};
		return buildSystemPrompt(this.baseSystemPromptOptions);
	}
};
//#endregion
//#region src/agents/sessions/compaction/request-budget.ts
const promptRequestBudgets = /* @__PURE__ */ new WeakMap();
/** Bind prepared foreground facts to the exact owned prompt invocation, outside public options. */
function attachPromptCompactionRequestBudget(options, budget) {
	if (budget) promptRequestBudgets.set(options, budget);
}
function takePromptCompactionRequestBudget(options) {
	if (!options) return;
	const budget = promptRequestBudgets.get(options);
	promptRequestBudgets.delete(options);
	return budget;
}
function createCompactionRequestBudget(params) {
	const estimateTokens = createFreshLlmBoundaryTokenEstimator(params);
	const fixedTokens = estimateTokens({
		messages: [],
		prompt: ""
	});
	const pendingUserTokens = (params.pendingPrompt ?? "") === "" && (params.pendingImageCount ?? 0) === 0 ? 0 : estimateTokens({
		messages: [],
		prompt: params.pendingPrompt ?? "",
		imageCount: params.pendingImageCount
	}) - fixedTokens;
	const pendingQueuedContextTokens = estimateCompactionHistoryTokens(params.pendingQueuedContextMessages ?? []);
	const additionalContextTokens = estimateCompactionHistoryTokens(params.pendingContextMessages ?? []) + pendingQueuedContextTokens;
	let additiveTokens = 0;
	if (params.pendingAdditivePrompt) {
		const estimateAdditiveTokens = createFreshLlmBoundaryTokenEstimator({});
		additiveTokens = estimateAdditiveTokens({
			messages: [],
			prompt: params.pendingAdditivePrompt
		}) - estimateAdditiveTokens({
			messages: [],
			prompt: ""
		});
	}
	return {
		contextWindow: params.contextWindow,
		reserveTokens: params.reserveTokens,
		fixedTokens,
		pendingUserIdempotencyKey: params.pendingUserIdempotencyKey,
		pendingTokens: pendingUserTokens + additionalContextTokens,
		pendingQueuedContextTokens,
		...additionalContextTokens || additiveTokens ? { pendingUserTokens: Math.max(0, pendingUserTokens - additiveTokens) } : {}
	};
}
/** Reconcile only queued context; prepared user, image, and transient costs stay owned upstream. */
function withCompactionQueuedContext(budget, messages) {
	const pendingQueuedContextTokens = estimateCompactionHistoryTokens(messages);
	const previousQueuedTokens = budget.pendingQueuedContextTokens ?? 0;
	if (pendingQueuedContextTokens === previousQueuedTokens) return budget;
	return {
		...budget,
		pendingTokens: budget.pendingTokens - previousQueuedTokens + pendingQueuedContextTokens,
		pendingQueuedContextTokens,
		pendingUserTokens: budget.pendingUserTokens ?? budget.pendingTokens - previousQueuedTokens
	};
}
function estimateCompactionHistoryTokens(messages, budget) {
	const pending = budget?.pendingTokens && budget.pendingUserIdempotencyKey ? messages.findLast((message) => message.role === "user" && "idempotencyKey" in message && message.idempotencyKey === budget.pendingUserIdempotencyKey) : void 0;
	const overlap = pending ? Math.min(estimateCompactionHistoryTokens([pending]), budget?.pendingUserTokens ?? budget?.pendingTokens ?? 0) : 0;
	const estimateTokens = createFreshLlmBoundaryTokenEstimator({});
	return estimateTokens({
		messages,
		prompt: ""
	}) - estimateTokens({
		messages: [],
		prompt: ""
	}) - overlap;
}
function estimateCompactedRequestTokens(messages, budget) {
	return budget.fixedTokens + budget.pendingTokens + estimateCompactionHistoryTokens(messages, budget);
}
function resolveCompactionRetentionBudget(budget, messages) {
	const preferredTokens = budget.contextWindow - budget.reserveTokens - budget.fixedTokens - budget.pendingTokens;
	return {
		maxTokens: preferredTokens <= 0 ? estimateCompactionHistoryTokens(messages, budget) - 1 : preferredTokens,
		reserveTokens: estimateCompactionHistoryTokens([{
			role: "compactionSummary",
			summary: "x".repeat(MAX_COMPACTION_SUMMARY_CHARS),
			tokensBefore: 0,
			timestamp: 0
		}])
	};
}
//#endregion
//#region src/agents/sessions/prompt-templates.ts
function loadTemplateFromFile(filePath, sourceInfo) {
	try {
		const rawContent = readFileSync(filePath, "utf-8");
		const { frontmatter, body } = parsePromptFrontmatter(rawContent);
		const name = basename(filePath).replace(/\.md$/, "");
		let description = frontmatter.description || "";
		if (!description) {
			const firstLine = body.split("\n").find((line) => line.trim());
			if (firstLine) description = truncateUtf16Safe(firstLine, 60) + (firstLine.length > 60 ? "..." : "");
		}
		return {
			name,
			description,
			...frontmatter["argument-hint"] && { argumentHint: frontmatter["argument-hint"] },
			content: body,
			sourceInfo,
			filePath
		};
	} catch {
		return null;
	}
}
/**
* Scan a directory for .md files (non-recursive) and load them as prompt templates.
*/
function loadTemplatesFromDir(dir, getSourceInfo) {
	const templates = [];
	try {
		const { entries } = walkDirectorySync(dir, {
			maxDepth: 1,
			symlinks: "follow",
			include: (entry) => entry.kind === "file" && entry.name.endsWith(".md")
		});
		for (const entry of entries) {
			const fullPath = join(dir, entry.name);
			const template = loadTemplateFromFile(fullPath, getSourceInfo(fullPath));
			if (template) templates.push(template);
		}
	} catch {
		return templates;
	}
	return templates;
}
function resolvePromptPath(p, cwd) {
	const normalized = expandTildePath(p);
	return isAbsolute(normalized) ? normalized : resolve(cwd, normalized);
}
/**
* Load all prompt templates from:
* 1. Global: agentDir/prompts/
* 2. Project: cwd/{CONFIG_DIR_NAME}/prompts/
* 3. Explicit prompt paths
*/
function loadPromptTemplates({ cwd, agentDir, promptPaths, includeDefaults }) {
	const templates = [];
	const globalPromptsDir = agentDir ? join(agentDir, "prompts") : agentDir;
	const projectPromptsDir = resolve(cwd, CONFIG_DIR_NAME, "prompts");
	const getSourceInfo = (resolvedPath) => {
		if (isPathInside(globalPromptsDir, resolvedPath)) return createSyntheticSourceInfo(resolvedPath, {
			source: "local",
			scope: "user",
			baseDir: globalPromptsDir
		});
		if (isPathInside(projectPromptsDir, resolvedPath)) return createSyntheticSourceInfo(resolvedPath, {
			source: "local",
			scope: "project",
			baseDir: projectPromptsDir
		});
		return createSyntheticSourceInfo(resolvedPath, {
			source: "local",
			baseDir: statSync(resolvedPath).isDirectory() ? resolvedPath : dirname(resolvedPath)
		});
	};
	if (includeDefaults) {
		templates.push(...loadTemplatesFromDir(globalPromptsDir, getSourceInfo));
		templates.push(...loadTemplatesFromDir(projectPromptsDir, getSourceInfo));
	}
	for (const rawPath of promptPaths) {
		const resolvedPath = resolvePromptPath(rawPath, cwd);
		if (!existsSync(resolvedPath)) continue;
		try {
			const stats = statSync(resolvedPath);
			if (stats.isDirectory()) templates.push(...loadTemplatesFromDir(resolvedPath, getSourceInfo));
			else if (stats.isFile() && resolvedPath.endsWith(".md")) {
				const template = loadTemplateFromFile(resolvedPath, getSourceInfo(resolvedPath));
				if (template) templates.push(template);
			}
		} catch {}
	}
	return templates;
}
/**
* Expand a prompt template if it matches a template name.
* Returns the expanded content or the original text if not a template.
*/
function expandPromptTemplate(text, templates) {
	const match = text.match(/^\/([^\s]+)(?:\s+([\s\S]*))?$/);
	if (!match) return text;
	const templateName = match[1];
	const argsString = match[2] ?? "";
	const template = templates.find((t) => t.name === templateName);
	if (template) {
		const args = parseCommandArgs(argsString);
		return substituteArgs(template.content, args);
	}
	return text;
}
//#endregion
//#region src/agents/sessions/agent-session-prompting.ts
/** @internal Host preparation runs after SDK prompt hooks and owns its run cancellation. */
const agentSessionSetPromptPreparation = Symbol.for("openclaw.agent-session.set-prompt-preparation");
/** @internal Queue prompt-owned context with cleanup for preflight exits. */
const agentSessionQueuePromptContext = Symbol.for("openclaw.agent-session.queue-prompt-context");
var AgentSessionPrompting = class extends AgentSessionBase {
	constructor(..._args) {
		super(..._args);
		this.logicalPromptActive = false;
	}
	[agentSessionQueuePromptContext](message, options) {
		if (options?.delivery === "current-request") return this.persistCustomMessage(message);
		if (this.logicalPromptActive && isOpenClawSystemUpdateMessage(message)) {
			this.agent.steer(message);
			return () => {
				this.agent.cancelSteeringMessage((pending) => pending === message);
			};
		}
		if (isOpenClawSystemUpdateMessage(message)) this.pendingNextTurnMessages.push(message);
		else this.pendingNextTurnMessages.unshift(message);
		return () => {
			this.pendingNextTurnMessages = this.pendingNextTurnMessages.filter((pending) => pending !== message);
		};
	}
	[agentSessionSetPromptPreparation](prepare) {
		this.promptPreparation = prepare;
	}
	dispose() {
		this.promptPreparation = void 0;
		super.dispose();
	}
	async runAgentPrompt(messages) {
		if (this.logicalPromptActive) throw new Error("Agent is already processing a prompt. Use steer() or followUp() to queue messages, or wait for completion.");
		this.logicalPromptActive = true;
		let endedForTurnHandoff = false;
		try {
			await this.runPreparedAgentLoop(() => this.agent.prompt(messages));
			while (true) {
				const action = await this.handlePostAgentRun();
				if (action !== "continue") {
					endedForTurnHandoff = action === "handoff";
					break;
				}
				await this.runPreparedAgentLoop(() => this.agent.continue());
			}
		} finally {
			this.systemPromptOverride = void 0;
			this.logicalPromptActive = false;
			endedForTurnHandoff ||= this.lastRunEndedForTurnHandoff;
			this.lastRunEndedForTurnHandoff = false;
			if (endedForTurnHandoff) this.emit({ type: "agent_handoff" });
			else {
				this.emit({ type: "agent_settled" });
				await this.currentExtensionRunner.emit({ type: "agent_settled" });
			}
		}
	}
	async runPreparedAgentLoop(run) {
		const prepare = this.promptPreparation;
		if (prepare) {
			const admit = await prepare();
			if (prepare !== this.promptPreparation) throw new Error("Session prompt preparation is stale after replacement or disposal.");
			admit?.();
		}
		return run();
	}
	async handlePostAgentRun() {
		const msg = this.lastAssistantMessage;
		this.lastAssistantMessage = void 0;
		const endedForTurnHandoff = this.lastRunEndedForTurnHandoff;
		this.lastRunEndedForTurnHandoff = false;
		if (endedForTurnHandoff) return "handoff";
		if (!msg || msg.stopReason === "aborted") return "settled";
		if (this.isRetryableError(msg) && await this.prepareRetry(msg)) return "continue";
		if (msg.stopReason === "error" && this.retryCount > 0) {
			this.emit({
				type: "auto_retry_end",
				success: false,
				attempt: this.retryCount,
				finalError: msg.errorMessage
			});
			this.retryCount = 0;
		}
		if (await this.checkCompaction(msg)) return "continue";
		return msg.stopReason !== "error" && this.agent.hasQueuedMessages() ? "continue" : "settled";
	}
	createUserMessage(text, images, preparedMessage) {
		const imageFactIndexes = readRuntimePromptImageFactIndexes(images);
		const message = {
			role: "user",
			content: [{
				type: "text",
				text
			}, ...images ?? []],
			timestamp: Date.now(),
			...imageFactIndexes ? { __openclaw: { mediaImageBlockFactIndexes: imageFactIndexes } } : {}
		};
		return Object.assign(message, mergePreparedUserTurnMessageForRuntime({
			runtimeMessage: message,
			preparedMessage
		}), { content: message.content });
	}
	/**
	* Send a prompt to the agent.
	* - Handles extension commands immediately, even during streaming
	* - Expands file-based prompt templates by default
	* - During streaming, queues via steer() or followUp() based on streamingBehavior option
	* - Validates model and API key before sending (when not streaming)
	* @throws Error if streaming and no streamingBehavior specified
	* @throws Error if no model selected or no API key available (when not streaming)
	*/
	async prompt(text, options) {
		const preparedCompactionBudget = takePromptCompactionRequestBudget(options);
		const expandPromptTemplates = options?.expandPromptTemplates ?? true;
		const preflightResult = options?.preflightResult;
		let messages;
		try {
			if (expandPromptTemplates && text.startsWith("/")) {
				if (await this.tryExecuteExtensionCommand(text)) {
					preflightResult?.(true);
					return;
				}
			}
			let currentText = text;
			let currentImages = options?.images;
			if (this.currentExtensionRunner.hasHandlers("input")) {
				const inputResult = await this.currentExtensionRunner.emitInput(currentText, currentImages, options?.source ?? "interactive");
				if (inputResult.action === "handled") {
					preflightResult?.(true);
					return;
				}
				if (inputResult.action === "transform") {
					currentText = inputResult.text;
					currentImages = inputResult.images ?? currentImages;
				}
			}
			const expandedText = expandPromptTemplates ? this.expandPrompt(currentText) : currentText;
			if (this.isStreaming || this.logicalPromptActive) {
				if (!options?.streamingBehavior) throw new Error("Agent is already processing. Specify streamingBehavior ('steer' or 'followUp') to queue the message.");
				if (options.streamingBehavior === "followUp") await this.queueFollowUp(expandedText, currentImages);
				else await this.queueSteer(expandedText, currentImages);
				preflightResult?.(true);
				return;
			}
			if (!this.model) throw new Error(formatNoModelSelectedMessage());
			if (!this.sessionModelRegistry.hasConfiguredAuth(this.model)) {
				if (this.sessionModelRegistry.isUsingOAuth(this.model)) throw new Error(`Authentication failed for "${this.model.provider}". Credentials may have expired or network is unavailable. Run '/login ${this.model.provider}' to re-authenticate.`);
				throw new Error(formatNoApiKeyFoundMessage(this.model.provider));
			}
			const persistedUserIdempotencyKey = options?.persistedUserIdempotencyKey;
			const contextWindow = this.model.contextWindow;
			const lastAssistant = this.findLastAssistantMessage();
			if (lastAssistant) {
				const pendingQueuedContextMessages = resolvePendingRuntimeContextReplay({
					messages: this.agent.state.messages,
					pendingContextMessages: this.pendingNextTurnMessages,
					persistedUserIdempotencyKey
				}).pendingContextMessages;
				await this.checkCompaction(lastAssistant, false, preparedCompactionBudget ? withCompactionQueuedContext(preparedCompactionBudget, pendingQueuedContextMessages) : typeof contextWindow === "number" && Number.isFinite(contextWindow) && contextWindow > 0 ? createCompactionRequestBudget({
					contextWindow,
					reserveTokens: this.settingsManager.getCompactionSettings().reserveTokens,
					systemPrompt: this.agent.state.systemPrompt,
					tools: this.agent.state.tools,
					pendingPrompt: expandedText,
					pendingImageCount: currentImages?.length,
					pendingQueuedContextMessages,
					pendingUserIdempotencyKey: persistedUserIdempotencyKey
				}) : void 0);
			}
			const { persistedUserIndex, replayPersistedCarrier, pendingContextMessages } = resolvePendingRuntimeContextReplay({
				messages: this.agent.state.messages,
				pendingContextMessages: this.pendingNextTurnMessages,
				persistedUserIdempotencyKey
			});
			const replayPersistedTurn = persistedUserIndex >= 0;
			const persistedUser = this.agent.state.messages[persistedUserIndex];
			if (!replayPersistedCarrier && persistedUser?.role === "user") {
				const runtimeUser = this.createUserMessage(expandedText, currentImages, persistedUser);
				this.agent.state.messages = this.agent.state.messages.with(persistedUserIndex, runtimeUser);
			}
			messages = [];
			if (!replayPersistedTurn) messages.push({
				...this.createUserMessage(expandedText, currentImages),
				...persistedUserIdempotencyKey ? { idempotencyKey: persistedUserIdempotencyKey } : {}
			});
			messages.push(...pendingContextMessages);
			this.pendingNextTurnMessages = [];
			const result = await this.currentExtensionRunner.emitBeforeAgentStart(expandedText, currentImages, this.baseSystemPrompt, this.baseSystemPromptOptions);
			if (result?.messages) for (const msg of result.messages) messages.push({
				role: "custom",
				customType: msg.customType,
				content: msg.content,
				display: msg.display,
				details: msg.details,
				timestamp: Date.now()
			});
			this.systemPromptOverride = result?.systemPrompt;
			this.agent.state.systemPrompt = this.systemPromptOverride !== void 0 ? this.systemPromptOverride : this.baseSystemPrompt;
		} catch (error) {
			preflightResult?.(false);
			throw error;
		}
		preflightResult?.(true);
		await this.runAgentPrompt(orderSystemUpdateMessages(messages));
	}
	/**
	* Try to execute an extension command. Returns true if command was found and executed.
	*/
	async tryExecuteExtensionCommand(text) {
		const spaceIndex = text.indexOf(" ");
		const commandName = spaceIndex === -1 ? text.slice(1) : text.slice(1, spaceIndex);
		const args = spaceIndex === -1 ? "" : text.slice(spaceIndex + 1);
		const command = this.currentExtensionRunner.getCommand(commandName);
		if (!command) return false;
		const ctx = this.currentExtensionRunner.createCommandContext();
		try {
			await command.handler(args, ctx);
		} catch (err) {
			this.currentExtensionRunner.emitError({
				extensionPath: `command:${commandName}`,
				event: "command",
				error: err instanceof Error ? err.message : String(err)
			});
		}
		return true;
	}
	/**
	* Expand skill commands (/skill:name args) to their full content.
	* Returns the expanded text, or the original text if not a skill command or skill not found.
	* Emits errors via extension runner if file read fails.
	*/
	expandSkillCommand(text) {
		if (!text.startsWith("/skill:")) return text;
		const spaceIndex = text.indexOf(" ");
		const skillName = spaceIndex === -1 ? text.slice(7) : text.slice(7, spaceIndex);
		const args = spaceIndex === -1 ? "" : text.slice(spaceIndex + 1).trim();
		const skill = this.sessionResourceLoader.getSkills().skills.find((s) => s.name === skillName);
		if (!skill) return text;
		try {
			const content = readFileSync(skill.filePath, "utf-8");
			const body = stripFrontmatter(content).trim();
			const skillBlock = `<skill name="${skill.name}" location="${skill.filePath}">\nReferences are relative to ${skill.baseDir}.\n\n${body}\n</skill>`;
			return args ? `${skillBlock}\n\n${args}` : skillBlock;
		} catch (err) {
			this.currentExtensionRunner.emitError({
				extensionPath: skill.filePath,
				event: "skill_expansion",
				error: err instanceof Error ? err.message : String(err)
			});
			return text;
		}
	}
	expandPrompt(text) {
		return expandPromptTemplate(this.expandSkillCommand(text), [...this.promptTemplates]);
	}
	/**
	* Queue a steering message while the agent is running.
	* Delivered before the next unstarted tool launch or model call. Running tools
	* continue; suppressed calls receive paired synthetic results.
	* Expands skill commands and prompt templates. Errors on extension commands.
	* @param images Optional image attachments to include with the message
	* @param userTurnTranscriptRecorder Prepared channel fields for transcript-only persistence
	* @param currentInboundContext This turn's runtime facts, separate from its command and transcript
	* @throws Error if text is an extension command
	*/
	async steer(text, images, userTurnTranscriptRecorder, media, imageOrder, queueIdentity, canInject, currentInboundContext) {
		if (text.startsWith("/")) this.throwIfExtensionCommand(text);
		const expandedText = this.expandPrompt(text);
		const preparedMessage = await userTurnTranscriptRecorder?.resolveMessage();
		if (canInject && !canInject()) throw new Error("active session is finalizing");
		await this.queueSteer(expandedText, images, preparedMessage && userTurnTranscriptRecorder ? {
			message: preparedMessage,
			recorder: userTurnTranscriptRecorder
		} : void 0, media, imageOrder, queueIdentity, currentInboundContext);
	}
	/**
	* Queue a follow-up message to be processed after the agent finishes.
	* Delivered only when agent has no more tool calls or steering messages.
	* Expands skill commands and prompt templates. Errors on extension commands.
	* @param images Optional image attachments to include with the message
	* @throws Error if text is an extension command
	*/
	async followUp(text, images) {
		if (text.startsWith("/")) this.throwIfExtensionCommand(text);
		await this.queueFollowUp(this.expandPrompt(text), images);
	}
	/** Queue pre-expanded steering input without an extension-command check. */
	async queueSteer(text, images, transcriptContext, media, imageOrder, queueIdentity, currentInboundContext) {
		const runtimeMessage = this.createUserMessage(text, images, transcriptContext?.message);
		const promptMessage = media?.length ? attachRuntimePromptMediaFacts(runtimeMessage, media, imageOrder) : runtimeMessage;
		attachSteeringRuntimeContext(promptMessage, currentInboundContext);
		setSteeringMessageIdentity(promptMessage, queueIdentity);
		this.trackQueuedUserMessage(promptMessage, "steering", text);
		this.agent.steer(transcriptContext ? attachRuntimeUserTurnTranscriptContext(promptMessage, transcriptContext) : promptMessage);
	}
	/** Queue pre-expanded follow-up input without an extension-command check. */
	async queueFollowUp(text, images) {
		const message = this.createUserMessage(text, images);
		this.trackQueuedUserMessage(message, "followUp", text);
		this.agent.followUp(message);
	}
	throwIfExtensionCommand(text) {
		const spaceIndex = text.indexOf(" ");
		const commandName = spaceIndex === -1 ? text.slice(1) : text.slice(1, spaceIndex);
		if (this.currentExtensionRunner.getCommand(commandName)) throw new Error(`Extension command "/${commandName}" cannot be queued. Use prompt() or execute the command when not streaming.`);
	}
	/**
	* Send a custom message to the session. Creates a CustomMessageEntry.
	*
	* Handles three cases:
	* - Streaming: queues message, processed when loop pulls from queue
	* - Not streaming + triggerTurn: appends to state/session, starts new turn
	* - Not streaming + no trigger: appends to state/session, no turn
	*
	* @param message Custom message with customType, content, display, details
	* @param options.triggerTurn If true and not streaming, triggers a new LLM turn
	* @param options.deliverAs Delivery mode: "steer", "followUp", or "nextTurn"
	*/
	async sendCustomMessage(message, options) {
		const appMessage = {
			role: "custom",
			customType: message.customType,
			content: message.content,
			display: message.display,
			details: message.details,
			timestamp: Date.now()
		};
		if (options?.deliverAs === "nextTurn") this.pendingNextTurnMessages.push(appMessage);
		else if (this.isStreaming) {
			if (options?.deliverAs === "followUp") this.agent.followUp(appMessage);
			else this.agent.steer(appMessage);
		} else if (options?.triggerTurn) await this.runAgentPrompt(appMessage);
		else await this.persistCustomMessage(appMessage);
	}
	async persistCustomMessage(message) {
		await withSessionManagerWrite(this.sessionManager, async () => {
			await this.sessionManager.appendCustomMessageEntryAsync(message.customType, message.content, message.display, message.details);
			this.agent.state.messages.push(message);
		});
		this.emit({
			type: "message_start",
			message
		});
		this.emit({
			type: "message_end",
			message
		});
	}
	/**
	* Send a user message to the agent. Always triggers a turn.
	* When the agent is streaming, use deliverAs to specify how to queue the message.
	*
	* @param content User message content (string or content array)
	* @param options.deliverAs Delivery mode when streaming: "steer" or "followUp"
	*/
	async sendUserMessage(content, options) {
		let text;
		let images;
		if (typeof content === "string") text = content;
		else {
			const textParts = [];
			images = [];
			for (const part of content) if (part.type === "text") textParts.push(part.text);
			else images.push(part);
			text = textParts.join("\n");
			if (images.length === 0) images = void 0;
		}
		await this.prompt(text, {
			expandPromptTemplates: false,
			streamingBehavior: options?.deliverAs,
			images,
			source: "extension"
		});
	}
	/**
	* Clear all queued messages and return them.
	* Useful for restoring to editor when user aborts.
	* @returns Object with steering and followUp arrays
	*/
	clearQueue() {
		const steering = this.steeringMessages.map((entry) => entry.text);
		const followUp = this.followUpMessages.map((entry) => entry.text);
		this.steeringMessages = [];
		this.followUpMessages = [];
		this.agent.clearAllQueues();
		this.emitQueueUpdate();
		return {
			steering,
			followUp
		};
	}
	/** Number of pending messages (includes both steering and follow-up) */
	get pendingMessageCount() {
		return this.steeringMessages.length + this.followUpMessages.length;
	}
	/** Get pending steering messages (read-only) */
	getSteeringMessages() {
		return this.steeringMessages.map((entry) => entry.text);
	}
	/** Get pending follow-up messages (read-only) */
	getFollowUpMessages() {
		return this.followUpMessages.map((entry) => entry.text);
	}
	get resourceLoader() {
		return this.sessionResourceLoader;
	}
	/** Abort the current run; yield callers pass a turnHandoff reason to skip interruption guidance. */
	async abort(reason) {
		this.abortRetry();
		this.agent.abort(reason);
		await this.agent.waitForIdle();
	}
};
//#endregion
//#region src/agents/sessions/agent-session-models.ts
const THINKING_LEVELS = [
	"off",
	"minimal",
	"low",
	"medium",
	"high"
];
var AgentSessionModels = class extends AgentSessionPrompting {
	async emitModelSelect(nextModel, previousModel, runner, isCurrent) {
		if (!isCurrent() || modelsAreEqual(previousModel, nextModel)) return;
		await runner.emit({
			type: "model_select",
			model: nextModel,
			previousModel,
			source: "set"
		});
	}
	/** Set the model after validating its current auth at write admission. */
	async setModel(model) {
		const owner = this.captureMetadataOwner();
		const { previousModel, thinkingSelection: committedThinkingSelection, commit: committedMetadata } = await owner.run(() => withSessionManagerWrite(owner.manager, async () => {
			owner.assertCurrent();
			if (!this.sessionModelRegistry.hasConfiguredAuth(model)) throw new Error(`No API key for ${model.provider}/${model.id}`);
			const previous = this.model;
			const thinkingSelection = this.planThinkingLevel(this.getThinkingLevelForModelSwitch(), model);
			const publication = {};
			await withSessionMetadataPublication(owner.manager, {
				type: "model_change",
				provider: model.provider,
				modelId: model.id
			}, (commit) => {
				publication.commit = commit;
				this.agent.state.model = model;
				this.settingsManager.setDefaultModelAndProvider(model.provider, model.id);
			}, () => owner.manager.appendModelChange(model.provider, model.id));
			if (thinkingSelection) try {
				owner.assertCurrent();
				publication.commit = await this.appendThinkingSelection(owner, thinkingSelection) ?? publication.commit;
			} catch (cause) {
				this.failAfterMetadataCommit(cause, publication.commit);
			}
			return {
				previousModel: previous,
				thinkingSelection: thinkingSelection?.event,
				commit: publication.commit
			};
		}));
		try {
			const thinking = this.emitThinkingLevelSelect(committedThinkingSelection, owner.runner, owner.isCurrent);
			const selected = this.emitModelSelect(model, previousModel, owner.runner, owner.isCurrent);
			const failures = (await Promise.allSettled([thinking, selected])).flatMap((result) => result.status === "rejected" ? [result.reason] : []);
			if (failures.length === 1) throw failures[0];
			if (failures.length > 1) throw new AggregateError(failures, "Session metadata notifications failed", { cause: failures[0] });
		} catch (cause) {
			this.failAfterMetadataCommit(cause, committedMetadata);
		}
	}
	/**
	* Set thinking level.
	* Clamps to model capabilities based on available thinking levels.
	* Saves to session and settings only if the level actually changes.
	*/
	async setThinkingLevel(level) {
		const owner = this.captureMetadataOwner();
		const committedSelection = await owner.run(() => withSessionManagerWrite(owner.manager, async () => {
			owner.assertCurrent();
			const selection = this.planThinkingLevel(level, this.model);
			if (!selection) return;
			const commit = await this.appendThinkingSelection(owner, selection);
			return {
				event: selection.event,
				commit
			};
		}));
		try {
			await this.emitThinkingLevelSelect(committedSelection?.event, owner.runner, owner.isCurrent);
		} catch (cause) {
			this.failAfterMetadataCommit(cause, committedSelection?.commit);
		}
	}
	planThinkingLevel(level, model) {
		const effectiveLevel = (model ? getSupportedThinkingLevels(model) : THINKING_LEVELS).includes(level) ? level : model ? clampThinkingLevel(model, level) : "off";
		const previousLevel = this.agent.state.thinkingLevel;
		if (effectiveLevel === previousLevel) return;
		return {
			event: {
				type: "thinking_level_select",
				level: effectiveLevel,
				previousLevel
			},
			saveDefault: Boolean(model?.reasoning) || effectiveLevel !== "off"
		};
	}
	async appendThinkingSelection(owner, selection) {
		const publication = {};
		await withSessionMetadataPublication(owner.manager, {
			type: "thinking_level_change",
			thinkingLevel: selection.event.level
		}, (commit) => {
			publication.commit = commit;
			this.agent.state.thinkingLevel = selection.event.level;
			if (selection.saveDefault) this.settingsManager.setDefaultThinkingLevel(selection.event.level);
		}, () => owner.manager.appendThinkingLevelChange(selection.event.level));
		return publication.commit;
	}
	emitThinkingLevelSelect(event, runner, isCurrent) {
		if (event && isCurrent()) {
			this.emit({
				type: "thinking_level_changed",
				level: event.level
			});
			if (isCurrent()) return runner.emit(event);
		}
		return Promise.resolve();
	}
	failAfterMetadataCommit(cause, commit) {
		if (cause instanceof SessionMetadataCommittedError || !commit) throw cause;
		throw new SessionMetadataCommittedError(commit.entry, commit.version, cause, commit.target);
	}
	captureMetadataOwner() {
		const manager = this.sessionManager;
		const target = manager.getSessionTarget();
		const sessionId = manager.getSessionId();
		const runner = this.currentExtensionRunner;
		const assertAmbient = target ? captureOwnedTranscriptWriteAssertion(target) : void 0;
		const isBound = () => {
			const current = manager.getSessionTarget();
			return manager.getSessionId() === sessionId && sameSessionTranscriptTargetBinding(target, current);
		};
		const assertCurrent = () => {
			if (!isBound()) throw new Error("Session manager identity changed before transcript write admission");
			if (this.currentExtensionRunner !== runner || runner.createContext().sessionManager !== manager) throw new Error("Session metadata source changed before publication");
			assertAmbient?.();
		};
		return {
			manager,
			runner,
			assertCurrent,
			isCurrent: () => {
				try {
					assertCurrent();
					return true;
				} catch {
					return false;
				}
			},
			run: (operation) => target ? withSessionTranscriptWriteAssertion(target, assertCurrent, operation) : operation()
		};
	}
	supportsThinking() {
		return Boolean(this.model?.reasoning);
	}
	getThinkingLevelForModelSwitch() {
		if (!this.supportsThinking()) return this.settingsManager.getDefaultThinkingLevel() ?? "medium";
		return this.thinkingLevel;
	}
	/** Update steering mode and persist it to settings. */
	setSteeringMode(mode) {
		this.agent.steeringMode = mode;
		this.settingsManager.setSteeringMode(mode);
	}
	/** Update follow-up mode and persist it to settings. */
	setFollowUpMode(mode) {
		this.agent.followUpMode = mode;
		this.settingsManager.setFollowUpMode(mode);
	}
};
//#endregion
//#region src/agents/sessions/agent-session-inspection.ts
var AgentSessionInspection = class extends AgentSessionModels {
	/** @deprecated Use setSessionNameAsync; removed at the next Plugin SDK major. */
	setSessionName(name) {
		warnSessionPersistenceDeprecation("AgentSession.setSessionName", "setSessionNameAsync");
		this.sessionManager.appendSessionInfo(name);
		this.emit({
			type: "session_info_changed",
			name: this.sessionManager.getSessionName()
		});
	}
	/** Persist the display name before publishing its changed event. */
	async setSessionNameAsync(name) {
		const manager = this.sessionManager;
		const target = manager.getSessionTarget();
		const sessionId = manager.getSessionId();
		const assertCurrent = target ? captureOwnedTranscriptWriteAssertion(target) : void 0;
		await manager.appendSessionInfoAsync(name);
		assertCurrent?.();
		if (this.sessionManager !== manager || manager.getSessionId() !== sessionId || !sameSessionTranscriptTargetBinding(target, manager.getSessionTarget())) throw new Error("Session changed before publishing its display name");
		this.emit({
			type: "session_info_changed",
			name: manager.getSessionName()
		});
	}
	getContextUsage() {
		const model = this.model;
		if (!model) return;
		const contextWindow = model.contextWindow ?? 0;
		if (contextWindow <= 0) return;
		const branchEntries = this.sessionManager.getBranch();
		const latestCompaction = getLatestCompactionEntry(branchEntries);
		const providerCheckpointIndex = branchEntries.findLastIndex((entry) => entry.type === "message" && entry.message.role === "assistant" && isCompactionReplayCheckpoint(entry.message.providerReplay));
		const clientCompactionIndex = latestCompaction ? branchEntries.lastIndexOf(latestCompaction) : -1;
		const compactionIndex = Math.max(clientCompactionIndex, providerCheckpointIndex);
		const providerCheckpoint = providerCheckpointIndex > clientCompactionIndex;
		let estimateFromContent = false;
		if (compactionIndex >= 0) {
			let hasPostCompactionUsage = false;
			for (let index = branchEntries.length - 1; index > compactionIndex; index -= 1) {
				const entry = branchEntries[index];
				if (entry.type === "message" && entry.message.role === "assistant") {
					const assistant = entry.message;
					if (assistant.stopReason !== "aborted" && assistant.stopReason !== "error") {
						if (providerCheckpoint && assistant.usage.contextUsage?.state !== "available") continue;
						if (assistant.usage.contextUsage?.state === "unavailable") {
							estimateFromContent = true;
							continue;
						}
						if (calculateContextTokens(assistant.usage) > 0) {
							hasPostCompactionUsage = true;
							estimateFromContent = false;
							break;
						}
					}
				}
			}
			if (!hasPostCompactionUsage && (providerCheckpoint || !estimateFromContent)) return {
				tokens: null,
				contextWindow,
				percent: null
			};
		}
		const tokens = estimateFromContent ? estimateMessagesFromContent(this.messages) : estimateContextTokens(this.messages).tokens;
		return {
			tokens,
			contextWindow,
			percent: tokens / contextWindow * 100
		};
	}
	/**
	* Get text content of last assistant message.
	* Useful for /copy command.
	* @returns Text content, or undefined if no assistant message exists
	*/
	getLastAssistantText() {
		const message = this.messages.findLast((entry) => entry.role === "assistant" && (entry.stopReason !== "aborted" || hasPersistedAssistantContent(entry.content)));
		return message ? extractTextContent(message.content).trim() || void 0 : void 0;
	}
};
//#endregion
//#region src/agents/sessions/manual-compaction-preflight.ts
/** Plans manual compaction without aborting or otherwise mutating the active session. */
function preflightManualSessionCompaction(pathEntries, settings) {
	const initial = prepareCompaction$1(pathEntries, settings);
	if (!initial.ok) throw initial.error;
	let preparation = initial.value;
	if (!preparation) {
		const smallest = prepareCompaction$1(pathEntries, {
			...settings,
			keepRecentTokens: 0
		});
		if (!smallest.ok) throw smallest.error;
		preparation = smallest.value;
	}
	if (preparation) return {
		compactable: true,
		preparation
	};
	return {
		compactable: false,
		reason: pathEntries.at(-1)?.type === "compaction" ? "Already compacted" : "Nothing to compact (session too small)"
	};
}
//#endregion
//#region src/agents/sessions/session-model-usage.ts
const sinkBySessionManager = createSessionManagerRuntimeRegistry();
/** Records one auxiliary model completion at the session that owns the request. */
function recordSessionModelUsage(sessionManager, usage) {
	sinkBySessionManager.get(sessionManager)?.(usage);
}
/** Sets the active accounting owner for auxiliary model usage. */
function setSessionModelUsageSink(sessionManager, sink) {
	sinkBySessionManager.set(sessionManager, sink);
}
//#endregion
//#region src/agents/sessions/agent-session-compaction.ts
function compactionErrorMessage(error, fallback) {
	const message = error instanceof Error ? error.message : String(error);
	return message.trim() ? message : fallback;
}
/** @internal */
const agentSessionAutomaticCompaction = Symbol.for("openclaw.agent-session.automatic-compaction");
/** Installs a synchronous callback for model-context replacement during compaction. */
const agentSessionSetContextReplacementHook = Symbol.for("openclaw.agent-session.set-context-replacement-hook");
var AgentSessionCompaction = class extends AgentSessionInspection {
	[agentSessionSetContextReplacementHook](callback, assertActive) {
		this.onContextReplaced = callback;
		this.assertContextReplacementActive = assertActive;
	}
	/**
	* Manually compact the session context.
	* Aborts current agent operation first.
	* @param customInstructions Optional instructions for the compaction summary
	*/
	async compact(customInstructions) {
		return await this.runWithSessionWriteSettlement(async () => {
			const outcome = await this.compactWithSessionWriteSettlement(customInstructions, "none");
			if (outcome.status === "skipped") throw new Error(outcome.reason);
			return outcome.result;
		});
	}
	async [agentSessionAutomaticCompaction](customInstructions, requestState, summaryOutputPolicy = "retry-invalid-once", constraints) {
		return await this.runWithSessionWriteSettlement(() => this.compactWithSessionWriteSettlement(customInstructions, summaryOutputPolicy, requestState, constraints));
	}
	async compactWithSessionWriteSettlement(customInstructions, summaryOutputPolicy = "none", requestState, constraints) {
		this.disconnectFromAgent();
		await this.abort();
		const abortController = new AbortController();
		this.compactionAbortController = abortController;
		const itemId = generateSessionEntryId();
		this.emit({
			type: "compaction_start",
			reason: "manual",
			itemId
		});
		try {
			const settings = this.settingsManager.getCompactionSettings();
			let outcome;
			try {
				outcome = await this.runCompactionWork({
					itemId,
					customInstructions,
					mode: "manual",
					summaryOutputPolicy,
					requestState,
					...constraints,
					settings,
					signal: abortController.signal
				});
			} catch (error) {
				const message = compactionErrorMessage(error, "Compaction failed");
				const aborted = abortController.signal.aborted || error instanceof Error && error.name === "AbortError";
				this.emit({
					type: "compaction_end",
					reason: "manual",
					itemId,
					outcome: aborted ? { status: "aborted" } : {
						status: "failed",
						reason: `Compaction failed: ${message}`
					}
				});
				throw error;
			}
			if (outcome.status === "skipped") {
				this.emit({
					type: "compaction_end",
					reason: "manual",
					itemId,
					outcome
				});
				return outcome;
			}
			if (outcome.status === "aborted") {
				this.emit({
					type: "compaction_end",
					reason: "manual",
					itemId,
					outcome
				});
				throw new Error("Compaction cancelled");
			}
			this.emit({
				type: "compaction_end",
				reason: "manual",
				itemId,
				outcome: {
					status: "completed",
					tokensBefore: outcome.result.tokensBefore,
					tokensAfter: outcome.tokensAfter,
					willRetry: false
				}
			});
			return outcome;
		} finally {
			if (this.compactionAbortController === abortController) this.compactionAbortController = void 0;
			this.reconnectToAgent();
		}
	}
	/** Cancel in-progress compaction (manual or auto). */
	abortCompaction() {
		this.compactionAbortController?.abort();
		this.autoCompactionAbortController?.abort();
	}
	/** Cancel in-progress branch summarization. */
	abortBranchSummary() {
		this.branchSummaryAbortController?.abort();
	}
	async runCompactionWork(options) {
		const isManual = options.mode === "manual";
		const assertContextReplacementActive = this.assertContextReplacementActive;
		const onContextReplaced = this.onContextReplaced;
		if (!this.model) {
			if (isManual) throw new Error(formatNoModelSelectedMessage());
			return {
				status: "skipped",
				reason: formatNoModelSelectedMessage()
			};
		}
		const model = this.model;
		const compactionThinkingLevel = this.resolveCompactionThinkingLevel?.(model, this.thinkingLevel) ?? this.thinkingLevel;
		let auth;
		try {
			auth = await this.getCompactionRequestAuth(model);
		} catch (error) {
			if (isManual) throw error;
			return {
				status: "skipped",
				reason: compactionErrorMessage(error, "Compaction authentication failed")
			};
		}
		const pathEntries = this.sessionManager.getBranch();
		const requestBudget = options.requestBudget;
		const pendingUserIdempotencyKey = requestBudget?.pendingTokens ? requestBudget.pendingUserIdempotencyKey : void 0;
		const pendingEntryIndex = options.pendingUserEntryId || pendingUserIdempotencyKey ? pathEntries.findLastIndex((entry) => entry.type === "message" && entry.message.role === "user" && (options.pendingUserEntryId ? entry.id === options.pendingUserEntryId : "idempotencyKey" in entry.message && entry.message.idempotencyKey === pendingUserIdempotencyKey)) : -1;
		if (options.pendingUserEntryId && pendingEntryIndex < 0) throw new Error("Compaction cannot find the admitted pending user request.");
		const retention = requestBudget ? resolveCompactionRetentionBudget(requestBudget, buildSessionContext(pathEntries).messages) : void 0;
		const requestTokenLimit = requestBudget && retention ? requestBudget.fixedTokens + requestBudget.pendingTokens + retention.maxTokens : void 0;
		let preparation;
		if (isManual && !options.requestState && !requestBudget && pendingEntryIndex < 0) {
			const manualPreflight = preflightManualSessionCompaction(pathEntries, options.settings);
			if (!manualPreflight.compactable) throw new Error(manualPreflight.reason);
			preparation = manualPreflight.preparation;
		} else preparation = unwrapCoreResult(prepareCompaction$1(pathEntries, options.settings, options.requestState, requestBudget || pendingEntryIndex >= 0 ? {
			preserveFromEntryId: pathEntries[pendingEntryIndex]?.id,
			...requestBudget && retention ? { budget: {
				...retention,
				estimateTokens: (message) => estimateCompactionHistoryTokens([message], requestBudget)
			} } : {}
		} : void 0));
		if (!preparation) return {
			status: "skipped",
			reason: "Nothing to compact (session too small)"
		};
		const projectReplacement = (result, summary) => buildSessionContext([...pathEntries, {
			...result,
			type: "compaction",
			id: options.itemId,
			parentId: pathEntries.at(-1)?.id ?? null,
			timestamp: (/* @__PURE__ */ new Date()).toISOString(),
			summary
		}]).messages;
		if (requestBudget && requestTokenLimit !== void 0) {
			const remaining = requestTokenLimit - estimateCompactedRequestTokens(projectReplacement(preparation, ""), requestBudget);
			preparation.summaryTokenBudget = Math.floor(remaining / SAFETY_MARGIN) - 1;
		}
		let compactionResult;
		let fromExtension = false;
		if (this.currentExtensionRunner.hasHandlers("session_before_compact")) {
			const extensionResult = await this.currentExtensionRunner.emit({
				type: "session_before_compact",
				preparation,
				branchEntries: pathEntries,
				customInstructions: options.customInstructions,
				signal: options.signal,
				thinkingLevel: compactionThinkingLevel,
				streamFn: this.agent.streamFn
			});
			if (extensionResult?.cancel) return { status: "aborted" };
			if (extensionResult?.compaction) {
				compactionResult = extensionResult.compaction;
				fromExtension = true;
			}
		}
		if (!compactionResult) {
			const focus = normalizeOptionalString(options.customInstructions);
			const boundedFocus = focus ? resolveCompactionInstructions(focus, void 0) : void 0;
			const coreInstructions = [boundedFocus ? wrapUntrustedPromptDataBlock({
				label: "Compaction focus",
				text: boundedFocus
			}) : "", preparation.latestUnresolvedUserRequest ? ["The run owner will resume this request after compaction. Preserve it as current work.", wrapUntrustedPromptDataBlock({
				label: "Latest unresolved user request",
				text: preparation.latestUnresolvedUserRequest
			})].join("\n") : ""].filter(Boolean).join("\n\n");
			const runCoreCompaction = () => compact$1(preparation, model, auth.apiKey, auth.headers, coreInstructions || void 0, options.signal, compactionThinkingLevel, this.agent.streamFn, createCompactionRuntime((usage) => recordSessionModelUsage(this.sessionManager, usage)));
			let result = await runCoreCompaction();
			if (options.signal.aborted) return { status: "aborted" };
			if (options.summaryOutputPolicy === "retry-invalid-once" && !result.ok && result.error instanceof InvalidSummaryOutputError) {
				result = await runCoreCompaction();
				if (options.signal.aborted) return { status: "aborted" };
			}
			compactionResult = unwrapCoreResult(result);
		}
		if (options.signal.aborted) return { status: "aborted" };
		const completedCompaction = {
			...compactionResult,
			summary: capCompactionSummary(compactionResult.summary)
		};
		const { firstKeptEntryId } = completedCompaction;
		const firstKeptIndex = pathEntries.findIndex((entry) => entry.id === firstKeptEntryId);
		if (pendingEntryIndex >= 0 && (firstKeptIndex < 0 || firstKeptIndex > pendingEntryIndex)) throw new Error("Compaction must retain the unprocessed pending user request.");
		if (requestBudget && requestTokenLimit !== void 0 && estimateCompactedRequestTokens(projectReplacement(completedCompaction, completedCompaction.summary), requestBudget) > requestTokenLimit) throw new Error("The finalized compaction exceeds the foreground request budget. Reduce the request or select a larger context window.");
		const committed = await withSessionManagerWrite(this.sessionManager, async () => {
			const currentController = isManual ? this.compactionAbortController : this.autoCompactionAbortController;
			if (options.signal.aborted || currentController?.signal !== options.signal || this.assertContextReplacementActive !== assertContextReplacementActive || this.onContextReplaced !== onContextReplaced) return;
			assertContextReplacementActive?.();
			const replacementMessages = sanitizeCompactionReplayMessages(projectReplacement(completedCompaction, completedCompaction.summary));
			const tokensAfter = requestBudget ? estimateCompactedRequestTokens(replacementMessages, {
				...requestBudget,
				pendingTokens: 0
			}) : estimateContextTokens(replacementMessages).tokens;
			const assertCommitCurrent = () => {
				options.signal.throwIfAborted();
				if ((isManual ? this.compactionAbortController : this.autoCompactionAbortController)?.signal !== options.signal || this.assertContextReplacementActive !== assertContextReplacementActive || this.onContextReplaced !== onContextReplaced) throw new Error("Compaction context changed before transcript commit");
				assertContextReplacementActive?.();
			};
			const append = () => this.sessionManager.appendCompactionAsync(completedCompaction.summary, completedCompaction.firstKeptEntryId, completedCompaction.tokensBefore, completedCompaction.details, fromExtension, { itemId: options.itemId }, tokensAfter);
			const target = this.sessionManager.getSessionTarget();
			const entryId = await (target ? withSessionTranscriptWriteAssertion(target, assertCommitCurrent, append) : append());
			const sessionContext = this.sessionManager.buildSessionContext();
			this.agent.state.messages = sanitizeCompactionReplayMessages(sessionContext.messages);
			onContextReplaced?.(tokensAfter, completedCompaction.tokensBefore);
			return {
				entryId,
				tokensAfter
			};
		});
		if (committed === void 0) return { status: "aborted" };
		const { entryId: compactionEntryId, tokensAfter } = committed;
		const savedCompactionEntry = this.sessionManager.getEntry(compactionEntryId);
		if (this.currentExtensionRunner && savedCompactionEntry?.type === "compaction") await this.currentExtensionRunner.emit({
			type: "session_compact",
			compactionEntry: savedCompactionEntry,
			fromExtension
		});
		return {
			status: "completed",
			result: completedCompaction,
			tokensAfter
		};
	}
	/**
	* Check if compaction is needed and run it.
	* Called after agent_end and before prompt submission.
	*
	* Two cases:
	* 1. Overflow: LLM returned context overflow error, remove error message from agent state, compact, auto-retry
	* 2. Threshold: Context over threshold, compact, NO auto-retry (user continues manually)
	*
	* @param assistantMessage The assistant message to check
	* @param skipAbortedCheck If false, include aborted messages (for pre-prompt check). Default: true
	*/
	async checkCompaction(assistantMessage, skipAbortedCheck = true, requestBudget) {
		const settings = this.settingsManager.getCompactionSettings();
		if (!settings.enabled) return false;
		if (skipAbortedCheck && assistantMessage.stopReason === "aborted") return false;
		const contextWindow = this.model?.contextWindow ?? 0;
		const sameModel = this.model && assistantMessage.provider === this.model.provider && assistantMessage.model === this.model.id;
		const compactionEntry = getLatestCompactionEntry(this.sessionManager.getBranch());
		if (compactionEntry !== null && assistantMessage.timestamp <= new Date(compactionEntry.timestamp).getTime()) return false;
		if (sameModel && (assistantMessage.stopReason === "error" || assistantMessage.stopReason === "length") && isContextOverflow(assistantMessage, contextWindow)) {
			if (this.contextOverflowRecoveryOwner === "caller") return false;
			if (this.overflowRecoveryAttempts >= 3) {
				this.emit({
					type: "compaction_end",
					reason: "overflow",
					outcome: {
						status: "failed",
						reason: `Context overflow recovery failed after 3 compact-and-retry attempts. Try reducing context or switching to a larger-context model.`
					}
				});
				return false;
			}
			this.overflowRecoveryAttempts += 1;
			const messages = this.agent.state.messages;
			if (messages.at(-1)?.role === "assistant") this.agent.state.messages = messages.slice(0, -1);
			return await this.runAutoCompaction("overflow", true, requestBudget);
		}
		let contextTokens;
		if (assistantMessage.stopReason === "error") {
			const messages = this.agent.state.messages;
			const estimate = estimateContextTokens(messages);
			if (estimate.lastUsageIndex === null) return false;
			contextTokens = estimate.tokens;
		} else if (assistantMessage.usage.contextUsage?.state === "unavailable") {
			const estimatedContextTokens = this.getContextUsage()?.tokens;
			if (estimatedContextTokens == null) return false;
			contextTokens = estimatedContextTokens;
		} else contextTokens = calculateContextTokens(assistantMessage.usage);
		if (shouldCompact(contextTokens, contextWindow, settings)) return await this.runAutoCompaction("threshold", false, requestBudget);
		return false;
	}
	async runAutoCompaction(reason, willRetry, requestBudget) {
		const settings = this.settingsManager.getCompactionSettings();
		const contextWindow = this.model?.contextWindow;
		const itemId = generateSessionEntryId();
		this.emit({
			type: "compaction_start",
			reason,
			itemId
		});
		const abortController = new AbortController();
		this.autoCompactionAbortController = abortController;
		try {
			const outcome = await this.runCompactionWork({
				itemId,
				mode: "auto",
				requestBudget: requestBudget ?? (typeof contextWindow === "number" && Number.isFinite(contextWindow) && contextWindow > 0 ? createCompactionRequestBudget({
					contextWindow,
					reserveTokens: settings.reserveTokens,
					systemPrompt: this.agent.state.systemPrompt,
					tools: this.agent.state.tools
				}) : void 0),
				...willRetry ? { requestState: "unresolved" } : {},
				summaryOutputPolicy: "retry-invalid-once",
				settings,
				signal: abortController.signal
			});
			if (outcome.status !== "completed") {
				this.emit({
					type: "compaction_end",
					reason,
					itemId,
					outcome
				});
				return false;
			}
			this.emit({
				type: "compaction_end",
				reason,
				itemId,
				outcome: {
					status: "completed",
					tokensBefore: outcome.result.tokensBefore,
					tokensAfter: outcome.tokensAfter,
					willRetry
				}
			});
			if (willRetry) {
				const messages = this.agent.state.messages;
				const lastMsg = messages[messages.length - 1];
				if (lastMsg?.role === "assistant" && (lastMsg.stopReason === "error" || lastMsg.stopReason === "length")) this.agent.state.messages = messages.slice(0, -1);
				return true;
			}
			return this.agent.hasQueuedMessages();
		} catch (error) {
			if (abortController.signal.aborted) {
				this.emit({
					type: "compaction_end",
					reason,
					itemId,
					outcome: { status: "aborted" }
				});
				return false;
			}
			const errorMessage = compactionErrorMessage(error, "compaction failed");
			this.emit({
				type: "compaction_end",
				reason,
				itemId,
				outcome: {
					status: "failed",
					reason: reason === "overflow" ? `Context overflow recovery failed: ${errorMessage}` : `Auto-compaction failed: ${errorMessage}`
				}
			});
			return false;
		} finally {
			if (this.autoCompactionAbortController === abortController) this.autoCompactionAbortController = void 0;
		}
	}
	/** Whether auto-compaction is enabled */
	get autoCompactionEnabled() {
		return this.settingsManager.getCompactionEnabled();
	}
};
//#endregion
//#region src/agents/sessions/agent-session-extensions.ts
var AgentSessionExtensions = class extends AgentSessionCompaction {
	async bindExtensions(bindings) {
		if (bindings.uiContext !== void 0) this.extensionUIContext = bindings.uiContext;
		if (bindings.commandContextActions !== void 0) this.extensionCommandContextActions = bindings.commandContextActions;
		if (bindings.abortHandler !== void 0) this.extensionAbortHandler = bindings.abortHandler;
		if (bindings.shutdownHandler !== void 0) this.extensionShutdownHandler = bindings.shutdownHandler;
		if (bindings.onError !== void 0) this.extensionErrorListener = bindings.onError;
		this.applyExtensionBindings(this.currentExtensionRunner);
		await this.currentExtensionRunner.emit(this.sessionStartEvent);
		await this.extendResourcesFromExtensions(this.sessionStartEvent.reason === "reload" ? "reload" : "startup");
	}
	async extendResourcesFromExtensions(reason) {
		if (!this.currentExtensionRunner.hasHandlers("resources_discover")) return;
		const { skillPaths, promptPaths, themePaths } = await this.currentExtensionRunner.emitResourcesDiscover(this.cwd, reason);
		if (skillPaths.length === 0 && promptPaths.length === 0 && themePaths.length === 0) return;
		const extensionPaths = {
			skillPaths: this.buildExtensionResourcePaths(skillPaths),
			promptPaths: this.buildExtensionResourcePaths(promptPaths),
			themePaths: this.buildExtensionResourcePaths(themePaths)
		};
		this.sessionResourceLoader.extendResources(extensionPaths);
		this.baseSystemPrompt = this.rebuildSystemPrompt(this.getActiveToolNames());
		this.agent.state.systemPrompt = this.baseSystemPrompt;
	}
	buildExtensionResourcePaths(entries) {
		return entries.map((entry) => {
			const synthetic = entry.extensionPath.startsWith("<");
			return {
				path: entry.path,
				metadata: {
					source: `extension:${synthetic ? entry.extensionPath.replace(/[<>]/g, "") : basename(entry.extensionPath).replace(/\.(ts|js)$/, "")}`,
					scope: "temporary",
					origin: "top-level",
					baseDir: synthetic ? void 0 : dirname(entry.extensionPath)
				}
			};
		});
	}
	applyExtensionBindings(runner) {
		runner.setUIContext(this.extensionUIContext);
		runner.bindCommandContext(this.extensionCommandContextActions);
		this.extensionErrorUnsubscriber?.();
		this.extensionErrorUnsubscriber = this.extensionErrorListener ? runner.onError(this.extensionErrorListener) : void 0;
	}
	refreshCurrentModelFromRegistry() {
		const currentModel = this.model;
		if (!currentModel) return;
		const refreshedModel = this.sessionModelRegistry.find(currentModel.provider, currentModel.id);
		if (!refreshedModel || refreshedModel === currentModel) return;
		this.agent.state.model = refreshedModel;
	}
	bindExtensionCore(runner) {
		const getCommands = () => {
			const extensionCommands = runner.getRegisteredCommands().map((command) => ({
				name: command.invocationName,
				description: command.description,
				source: "extension",
				sourceInfo: command.sourceInfo
			}));
			const templates = this.promptTemplates.map((template) => ({
				name: template.name,
				description: template.description,
				source: "prompt",
				sourceInfo: template.sourceInfo
			}));
			const skills = this.sessionResourceLoader.getSkills().skills.map((skill) => ({
				name: `skill:${skill.name}`,
				description: skill.description,
				source: "skill",
				sourceInfo: skill.sourceInfo
			}));
			return [
				...extensionCommands,
				...templates,
				...skills
			];
		};
		runner.bindCoreAsync({
			sendMessage: (message, options) => {
				this.sendCustomMessage(message, options).catch((err) => {
					runner.emitError({
						extensionPath: "<runtime>",
						event: "send_message",
						error: err instanceof Error ? err.message : String(err)
					});
				});
			},
			sendUserMessage: (content, options) => {
				this.sendUserMessage(content, options).catch((err) => {
					runner.emitError({
						extensionPath: "<runtime>",
						event: "send_user_message",
						error: err instanceof Error ? err.message : String(err)
					});
				});
			},
			appendEntry: (customType, data) => {
				this.sessionManager.appendCustomEntry(customType, data);
			},
			appendEntryAsync: (customType, data) => this.sessionManager.appendCustomEntryAsync(customType, data),
			setSessionName: (name) => {
				this.setSessionName(name);
			},
			setSessionNameAsync: (name) => this.setSessionNameAsync(name),
			getSessionName: () => {
				return this.sessionManager.getSessionName();
			},
			setLabel: (entryId, label) => {
				this.sessionManager.appendLabelChange(entryId, label);
			},
			setLabelAsync: async (entryId, label) => {
				await this.sessionManager.appendLabelChangeAsync(entryId, label);
			},
			getActiveTools: () => this.getActiveToolNames(),
			getAllTools: () => this.getAllTools(),
			setActiveTools: (toolNames) => this.setActiveToolsByName(toolNames),
			refreshTools: () => this.refreshToolRegistry(),
			getCommands,
			setModel: async (model) => {
				if (!this.sessionModelRegistry.hasConfiguredAuth(model)) return false;
				await this.setModel(model);
				return true;
			},
			getThinkingLevel: () => this.thinkingLevel,
			setThinkingLevel: (level) => this.setThinkingLevel(level)
		}, {
			getModel: () => this.model,
			isIdle: () => !this.isStreaming,
			getSignal: () => this.agent.signal,
			abort: () => {
				if (this.extensionAbortHandler) {
					this.extensionAbortHandler();
					return;
				}
				this.abort();
			},
			hasPendingMessages: () => this.pendingMessageCount > 0,
			shutdown: () => {
				this.extensionShutdownHandler?.();
			},
			getContextUsage: () => this.getContextUsage(),
			compact: (options) => {
				(async () => {
					try {
						const result = await this.compact(options?.customInstructions);
						options?.onComplete?.(result);
					} catch (error) {
						const err = error instanceof Error ? error : new Error(String(error));
						options?.onError?.(err);
					}
				})();
			},
			getSystemPrompt: () => this.systemPrompt
		}, {
			registerProvider: (name, config) => {
				this.sessionModelRegistry.registerProvider(name, config);
				this.refreshCurrentModelFromRegistry();
			},
			unregisterProvider: (name) => {
				this.sessionModelRegistry.unregisterProvider(name);
				this.refreshCurrentModelFromRegistry();
			}
		});
	}
	/** Replace a runtime-owned tool surface without restarting its active agent loop. */
	replaceCustomTools(customTools, activeToolNames) {
		this.customTools = customTools;
		this.allowedToolNames = new Set(activeToolNames);
		this.refreshToolRegistry({ activeToolNames });
	}
	refreshToolRegistry(options) {
		const previousRegistryNames = new Set(this.toolRegistry.keys());
		const previousActiveToolNames = this.getActiveToolNames();
		const allowedToolNames = this.allowedToolNames;
		const isDisabledBuiltInToolName = (name) => this.disableBuiltInTools && this.baseToolDefinitions.has(name);
		const isAllowedTool = (name) => !isDisabledBuiltInToolName(name) && (!allowedToolNames || allowedToolNames.has(name));
		const allCustomTools = [...this.currentExtensionRunner.getAllRegisteredTools(), ...this.customTools.map((definition) => ({
			definition,
			sourceInfo: createSyntheticSourceInfo(`<sdk:${definition.name}>`, { source: "sdk" })
		}))].filter((tool) => isAllowedTool(tool.definition.name));
		const builtInTools = Array.from(this.baseToolDefinitions.entries()).map(([name, definition]) => [name, {
			definition,
			sourceInfo: createSyntheticSourceInfo(`<builtin:${name}>`, { source: "builtin" })
		}]);
		const definitionRegistry = new Map(builtInTools.filter(([name]) => isAllowedTool(name)));
		for (const tool of allCustomTools) definitionRegistry.set(tool.definition.name, {
			definition: tool.definition,
			sourceInfo: tool.sourceInfo
		});
		this.toolDefinitions = definitionRegistry;
		this.toolPromptSnippets = /* @__PURE__ */ new Map();
		this.toolPromptGuidelines = /* @__PURE__ */ new Map();
		for (const { definition } of definitionRegistry.values()) {
			const snippet = this.normalizePromptSnippet(definition.promptSnippet);
			if (snippet) this.toolPromptSnippets.set(definition.name, snippet);
			const guidelines = this.normalizePromptGuidelines(definition.promptGuidelines);
			if (guidelines.length > 0) this.toolPromptGuidelines.set(definition.name, guidelines);
		}
		const runner = this.currentExtensionRunner;
		const wrappedExtensionTools = wrapRegisteredTools(allCustomTools, runner);
		const wrappedBuiltInTools = wrapRegisteredTools(builtInTools.map(([, tool]) => tool).filter((tool) => isAllowedTool(tool.definition.name)), runner);
		this.toolRegistry = new Map([...wrappedBuiltInTools, ...wrappedExtensionTools].map((tool) => [tool.name, tool]));
		const nextActiveToolNames = (options?.activeToolNames ?? previousActiveToolNames).filter((name) => isAllowedTool(name));
		if (allowedToolNames) {
			for (const toolName of this.toolRegistry.keys()) if (allowedToolNames.has(toolName)) nextActiveToolNames.push(toolName);
		} else if (options?.includeAllExtensionTools) for (const tool of wrappedExtensionTools) nextActiveToolNames.push(tool.name);
		else if (!options?.activeToolNames) {
			for (const toolName of this.toolRegistry.keys()) if (!previousRegistryNames.has(toolName)) nextActiveToolNames.push(toolName);
		}
		this.setActiveToolsByName([...new Set(nextActiveToolNames)]);
	}
	buildRuntime(options) {
		const autoResizeImages = this.settingsManager.getImageAutoResize();
		const shellCommandPrefix = this.settingsManager.getShellCommandPrefix();
		const shellPath = this.settingsManager.getShellPath();
		const baseToolDefinitions = this.baseToolsOverride ? Object.fromEntries(Object.entries(this.baseToolsOverride).map(([name, tool]) => [name, createToolDefinitionFromAgentTool(tool)])) : createAllToolDefinitions(this.cwd, {
			read: { autoResizeImages },
			bash: {
				commandPrefix: shellCommandPrefix,
				shellPath
			}
		});
		this.baseToolDefinitions = new Map(Object.entries(baseToolDefinitions).map(([name, tool]) => [name, tool]));
		const extensionsResult = this.sessionResourceLoader.getExtensions();
		if (options.flagValues) for (const [name, value] of options.flagValues) extensionsResult.runtime.flagValues.set(name, value);
		this.currentExtensionRunner = new ExtensionRunner(extensionsResult.extensions, extensionsResult.runtime, this.cwd, this.sessionManager, this.sessionModelRegistry);
		if (this.extensionRunnerRef) this.extensionRunnerRef.current = this.currentExtensionRunner;
		this.bindExtensionCore(this.currentExtensionRunner);
		this.applyExtensionBindings(this.currentExtensionRunner);
		const defaultActiveToolNames = this.baseToolsOverride ? Object.keys(this.baseToolsOverride) : [
			"read",
			"bash",
			"edit",
			"write"
		];
		const baseActiveToolNames = options.activeToolNames ?? defaultActiveToolNames;
		this.refreshToolRegistry({
			activeToolNames: baseActiveToolNames,
			includeAllExtensionTools: options.includeAllExtensionTools
		});
	}
	async reload() {
		const previousFlagValues = this.currentExtensionRunner.getFlagValues();
		await emitSessionShutdownEvent(this.currentExtensionRunner, {
			type: "session_shutdown",
			reason: "reload"
		});
		await this.settingsManager.reload();
		this.agent.steeringMode = this.settingsManager.getSteeringMode();
		this.agent.followUpMode = this.settingsManager.getFollowUpMode();
		await this.sessionResourceLoader.reload();
		this.sessionModelRegistry.refresh();
		this.buildRuntime({
			activeToolNames: this.getActiveToolNames(),
			flagValues: previousFlagValues,
			includeAllExtensionTools: true
		});
		if (this.extensionUIContext || this.extensionCommandContextActions || this.extensionShutdownHandler || this.extensionErrorListener) {
			await this.currentExtensionRunner.emit({
				type: "session_start",
				reason: "reload"
			});
			await this.extendResourcesFromExtensions("reload");
		}
	}
};
//#endregion
//#region src/agents/sessions/agent-session-execution.ts
var AgentSessionExecution = class extends AgentSessionExtensions {
	/**
	* Check if an error is retryable (overloaded, rate limit, server errors).
	* Context overflow errors are NOT retryable (handled by compaction instead).
	*/
	isRetryableError(message) {
		if (message.stopReason !== "error" || !message.errorMessage) return false;
		const contextWindow = this.model?.contextWindow ?? 0;
		if (isContextOverflow(message, contextWindow)) return false;
		return isResponsesOutputLimitToolCallError(message) || isRetryableAssistantError(message);
	}
	/**
	* Prepare a retryable error for continuation with exponential backoff.
	* @returns true if the caller should continue the agent, false otherwise
	*/
	async prepareRetry(message) {
		const settings = this.settingsManager.getRetrySettings();
		if (!settings.enabled) return false;
		this.retryCount++;
		if (this.retryCount > settings.maxRetries) {
			this.retryCount--;
			return false;
		}
		const backoffDelayMs = settings.baseDelayMs * 2 ** (this.retryCount - 1);
		const rateLimitWindow = classifyRateLimitWindow(message.errorMessage);
		const retryAfterDelayMs = rateLimitWindow.kind === "short" && rateLimitWindow.retryAfterSeconds !== void 0 ? Math.ceil(rateLimitWindow.retryAfterSeconds * 1e3) : 0;
		const delayMs = Math.max(backoffDelayMs, retryAfterDelayMs);
		this.emit({
			type: "auto_retry_start",
			attempt: this.retryCount,
			maxAttempts: settings.maxRetries,
			delayMs,
			errorMessage: message.errorMessage || "Unknown error"
		});
		const messages = this.agent.state.messages;
		const failedIndex = messages.findLastIndex((candidate) => candidate === message);
		if (failedIndex >= 0) this.agent.state.messages = messages.toSpliced(failedIndex, 1);
		this.retryAbortController = new AbortController();
		try {
			await sleep(delayMs, this.retryAbortController.signal);
		} catch {
			const attempt = this.retryCount;
			this.retryCount = 0;
			this.emit({
				type: "auto_retry_end",
				success: false,
				attempt,
				finalError: "Retry cancelled"
			});
			return false;
		} finally {
			this.retryAbortController = void 0;
		}
		return true;
	}
	/** Cancel an in-progress retry. */
	abortRetry() {
		this.retryAbortController?.abort();
	}
};
//#endregion
//#region src/agents/sessions/agent-session-tree.ts
var AgentSessionTree = class extends AgentSessionExecution {
	/**
	* Navigate to a different node in the session tree.
	* Unlike fork() which creates a new session file, this stays in the same file.
	*
	* @param targetId The entry ID to navigate to
	* @param options.summarize Whether user wants to summarize abandoned branch
	* @param options.customInstructions Custom instructions for summarizer
	* @param options.replaceInstructions If true, customInstructions replaces the default prompt
	* @param options.label Label to attach to the branch summary entry
	* @returns Result with editorText (if user message) and cancelled status
	*/
	async navigateTree(targetId, options = {}) {
		const oldLeafId = this.sessionManager.getLeafId();
		if (targetId === oldLeafId) return { cancelled: false };
		if (options.summarize && !this.model) throw new Error("No model available for summarization");
		const targetEntry = this.sessionManager.getEntry(targetId);
		if (!targetEntry) throw new Error(`Entry ${targetId} not found`);
		const { entries: entriesToSummarize, commonAncestorId } = oldLeafId ? collectEntriesForBranchSummaryFromBranches(this.sessionManager.getBranch(oldLeafId), this.sessionManager.getBranch(targetId)) : {
			entries: [],
			commonAncestorId: null
		};
		let customInstructions = options.customInstructions;
		let replaceInstructions = options.replaceInstructions;
		let label = options.label;
		const preparation = {
			targetId,
			oldLeafId,
			commonAncestorId,
			entriesToSummarize,
			userWantsSummary: options.summarize ?? false,
			customInstructions,
			replaceInstructions,
			label
		};
		const abortController = new AbortController();
		this.branchSummaryAbortController = abortController;
		try {
			let extensionSummary;
			let fromExtension = false;
			if (this.currentExtensionRunner.hasHandlers("session_before_tree")) {
				const result = await this.currentExtensionRunner.emit({
					type: "session_before_tree",
					preparation,
					signal: abortController.signal
				});
				if (result?.cancel) return { cancelled: true };
				if (result?.summary && options.summarize) {
					extensionSummary = result.summary;
					fromExtension = true;
				}
				if (result?.customInstructions !== void 0) customInstructions = result.customInstructions;
				if (result?.replaceInstructions !== void 0) replaceInstructions = result.replaceInstructions;
				if (result?.label !== void 0) label = result.label;
			}
			let summaryText;
			let summaryDetails;
			if (options.summarize && entriesToSummarize.length > 0 && !extensionSummary) {
				const model = this.model;
				const { apiKey, headers } = await this.getRequiredRequestAuth(model);
				const branchSummarySettings = this.settingsManager.getBranchSummarySettings();
				const result = normalizeBranchSummaryResult(await generateBranchSummary$1(entriesToSummarize, {
					model,
					apiKey,
					headers,
					signal: abortController.signal,
					customInstructions,
					replaceInstructions,
					reserveTokens: branchSummarySettings.reserveTokens,
					streamFn: this.agent.streamFn,
					runtime: createCompactionRuntime((usage) => recordSessionModelUsage(this.sessionManager, usage))
				}));
				if (result.aborted) return {
					cancelled: true,
					aborted: true
				};
				if (result.error) throw new Error(result.error);
				summaryText = result.summary;
				summaryDetails = {
					readFiles: result.readFiles || [],
					modifiedFiles: result.modifiedFiles || []
				};
			} else if (extensionSummary) {
				summaryText = extensionSummary.summary;
				summaryDetails = extensionSummary.details;
			}
			let newLeafId;
			let editorText;
			if (targetEntry.type === "message" && targetEntry.message.role === "user") {
				newLeafId = targetEntry.parentId;
				editorText = extractTextContent(targetEntry.message.content);
			} else if (targetEntry.type === "custom_message") {
				newLeafId = targetEntry.parentId;
				editorText = extractTextContent(targetEntry.content);
			} else newLeafId = targetId;
			const navigation = await withSessionManagerWrite(this.sessionManager, async () => {
				if (abortController.signal.aborted || this.branchSummaryAbortController !== abortController) return {
					cancelled: true,
					aborted: true
				};
				const mutate = async () => {
					let summaryEntry;
					if (summaryText) {
						const summaryId = await this.sessionManager.branchWithSummaryAsync(newLeafId, summaryText, summaryDetails, fromExtension);
						summaryEntry = this.sessionManager.getEntry(summaryId);
						if (label) await this.sessionManager.appendLabelChangeAsync(summaryId, label);
					} else if (newLeafId === null) await this.sessionManager.resetLeafAsync();
					else await this.sessionManager.branchAsync(newLeafId);
					if (label && !summaryText) await this.sessionManager.appendLabelChangeAsync(targetId, label);
					const sessionContext = this.sessionManager.buildSessionContext();
					this.agent.state.messages = sanitizeCompactionReplayMessages(sessionContext.messages);
					return {
						cancelled: false,
						summaryEntry
					};
				};
				const target = this.sessionManager.getSessionTarget();
				return target ? await withSessionTranscriptWriteAssertion(target, () => {
					abortController.signal.throwIfAborted();
					if (this.branchSummaryAbortController !== abortController) throw new Error("Session tree navigation changed before transcript commit");
				}, mutate) : await mutate();
			});
			if (navigation.cancelled) return navigation;
			const { summaryEntry } = navigation;
			await this.currentExtensionRunner.emit({
				type: "session_tree",
				newLeafId: this.sessionManager.getLeafId(),
				oldLeafId,
				summaryEntry,
				fromExtension: summaryText ? fromExtension : void 0
			});
			return {
				editorText,
				cancelled: false,
				summaryEntry
			};
		} finally {
			if (this.branchSummaryAbortController === abortController) this.branchSummaryAbortController = void 0;
		}
	}
	/**
	* Get the extension runner (for setting UI context and error handlers).
	*/
	get extensionRunner() {
		return this.currentExtensionRunner;
	}
};
//#endregion
//#region src/agents/sessions/agent-session.ts
/**
* Core abstraction for agent lifecycle and session management.
*
* Shared by interactive, print, and RPC modes. Mode-specific I/O stays above
* this class while the feature layers below own session behavior.
*/
var AgentSession = class extends AgentSessionTree {
	constructor(config) {
		super(config);
		this.unsubscribeAgent = this.agent.subscribe(this.handleAgentEvent);
		this.installAgentToolHooks();
		this.buildRuntime({
			activeToolNames: this.initialActiveToolNames,
			includeAllExtensionTools: true
		});
	}
};
//#endregion
//#region src/agents/sessions/resource-loader.ts
var DefaultResourceLoader = class {
	constructor(options) {
		this.skills = [];
		this.skillDiagnostics = [];
		this.prompts = [];
		this.promptDiagnostics = [];
		this.themes = [];
		this.themeDiagnostics = [];
		this.agentsFiles = [];
		this.appendSystemPrompt = [];
		this.lastSkillPaths = [];
		this.extensionSkillSourceInfos = /* @__PURE__ */ new Map();
		this.extensionPromptSourceInfos = /* @__PURE__ */ new Map();
		this.extensionThemeSourceInfos = /* @__PURE__ */ new Map();
		this.lastPromptPaths = [];
		this.lastThemePaths = [];
		this.loaded = false;
		this.cwd = options.cwd;
		this.agentDir = options.agentDir;
		this.settingsManager = options.settingsManager ?? SettingsManager.create(this.cwd, this.agentDir);
		this.eventBus = createEventBus();
		this.extensionFactories = options.extensionFactories ?? [];
		this.agentsFilesOverride = options.agentsFilesOverride;
		this.appendSystemPromptTransform = options.appendSystemPromptTransform;
		this.extensionsResult = {
			extensions: [],
			errors: [],
			runtime: createExtensionRuntime()
		};
	}
	getExtensions() {
		return this.extensionsResult;
	}
	getSkills() {
		return {
			skills: this.skills,
			diagnostics: this.skillDiagnostics
		};
	}
	getPrompts() {
		return {
			prompts: this.prompts,
			diagnostics: this.promptDiagnostics
		};
	}
	getThemes() {
		return {
			themes: this.themes,
			diagnostics: this.themeDiagnostics
		};
	}
	getAgentsFiles() {
		return { agentsFiles: this.agentsFiles };
	}
	getSystemPrompt() {}
	getAppendSystemPrompt() {
		return this.appendSystemPrompt;
	}
	extendResources(paths) {
		const skillPaths = this.registerExtensionPaths(paths.skillPaths, this.extensionSkillSourceInfos);
		const promptPaths = this.registerExtensionPaths(paths.promptPaths, this.extensionPromptSourceInfos);
		const themePaths = this.registerExtensionPaths(paths.themePaths, this.extensionThemeSourceInfos);
		if (skillPaths.length > 0) {
			this.lastSkillPaths = this.mergePaths(this.lastSkillPaths, skillPaths);
			this.updateSkillsFromPaths(this.lastSkillPaths);
		}
		if (promptPaths.length > 0) {
			this.lastPromptPaths = this.mergePaths(this.lastPromptPaths, promptPaths);
			this.updatePromptsFromPaths(this.lastPromptPaths);
		}
		if (themePaths.length > 0) {
			this.lastThemePaths = this.mergePaths(this.lastThemePaths, themePaths);
			this.updateThemesFromPaths(this.lastThemePaths);
		}
	}
	async reload() {
		if (this.loaded) clearExtensionCache();
		await this.settingsManager.reload();
		this.extensionSkillSourceInfos = /* @__PURE__ */ new Map();
		this.extensionPromptSourceInfos = /* @__PURE__ */ new Map();
		this.extensionThemeSourceInfos = /* @__PURE__ */ new Map();
		const extensionsResult = await loadExtensionsCached([], this.cwd, this.eventBus);
		const inlineExtensions = await this.loadExtensionFactories(extensionsResult.runtime);
		extensionsResult.extensions.push(...inlineExtensions.extensions);
		extensionsResult.errors.push(...inlineExtensions.errors);
		const conflicts = this.detectExtensionConflicts(extensionsResult.extensions);
		for (const conflict of conflicts) extensionsResult.errors.push({
			path: conflict.path,
			error: conflict.message
		});
		this.extensionsResult = extensionsResult;
		this.applyExtensionSourceInfo(this.extensionsResult.extensions);
		this.lastSkillPaths = [];
		this.lastPromptPaths = [];
		this.lastThemePaths = [];
		this.updateSkillsFromPaths([]);
		this.updatePromptsFromPaths([]);
		this.updateThemesFromPaths([]);
		this.agentsFiles = this.agentsFilesOverride?.({ agentsFiles: [] }).agentsFiles ?? [];
		this.appendSystemPrompt = this.appendSystemPromptTransform?.([]) ?? [];
		this.loaded = true;
	}
	registerExtensionPaths(entries, sourceInfos) {
		return (entries ?? []).map((entry) => {
			const path = this.resolveResourcePath(entry.path);
			sourceInfos.set(path, createSourceInfo(path, entry.metadata));
			return path;
		});
	}
	updateSkillsFromPaths(skillPaths) {
		const skillsResult = loadSkills({
			cwd: this.cwd,
			agentDir: this.agentDir,
			skillPaths,
			includeDefaults: false
		});
		this.skills = skillsResult.skills.map((skill) => ({
			...skill,
			sourceInfo: this.resolveSourceInfoForPath(skill.filePath, this.extensionSkillSourceInfos, skill.sourceInfo)
		}));
		this.skillDiagnostics = skillsResult.diagnostics;
	}
	updatePromptsFromPaths(promptPaths) {
		const allPrompts = loadPromptTemplates({
			cwd: this.cwd,
			agentDir: this.agentDir,
			promptPaths,
			includeDefaults: false
		});
		const { resources, diagnostics } = this.dedupeResources(allPrompts, "prompt", (prompt) => prompt.name, (prompt) => prompt.filePath);
		this.prompts = resources.map((prompt) => Object.assign({}, prompt, { sourceInfo: this.resolveSourceInfoForPath(prompt.filePath, this.extensionPromptSourceInfos, prompt.sourceInfo) }));
		this.promptDiagnostics = diagnostics;
	}
	updateThemesFromPaths(themePaths) {
		const loaded = this.loadThemes(themePaths);
		const deduped = this.dedupeResources(loaded.themes, "theme", (theme) => theme.name ?? "unnamed", (theme) => theme.sourcePath);
		this.themes = deduped.resources.map((theme) => {
			const sourcePath = theme.sourcePath;
			theme.sourceInfo = sourcePath ? this.resolveSourceInfoForPath(sourcePath, this.extensionThemeSourceInfos, theme.sourceInfo) : theme.sourceInfo;
			return theme;
		});
		this.themeDiagnostics = [...loaded.diagnostics, ...deduped.diagnostics];
	}
	applyExtensionSourceInfo(extensions) {
		for (const extension of extensions) {
			extension.sourceInfo = this.resolveSourceInfoForPath(extension.path);
			for (const command of extension.commands.values()) command.sourceInfo = extension.sourceInfo;
			for (const tool of extension.tools.values()) tool.sourceInfo = extension.sourceInfo;
		}
	}
	resolveSourceInfoForPath(resourcePath, extraSourceInfos, existing) {
		if (!resourcePath) return existing ?? this.getDefaultSourceInfoForPath(resourcePath);
		if (resourcePath.startsWith("<")) return this.getDefaultSourceInfoForPath(resourcePath);
		const normalizedResourcePath = resolve(resourcePath);
		if (extraSourceInfos) for (const [sourcePath, sourceInfo] of extraSourceInfos.entries()) {
			const normalizedSourcePath = resolve(sourcePath);
			if (isPathInside(normalizedSourcePath, normalizedResourcePath)) return {
				...sourceInfo,
				path: resourcePath
			};
		}
		return existing ?? this.getDefaultSourceInfoForPath(resourcePath);
	}
	getDefaultSourceInfoForPath(filePath) {
		if (filePath.startsWith("<") && filePath.endsWith(">")) return {
			path: filePath,
			source: filePath.slice(1, -1).split(":")[0] || "temporary",
			scope: "temporary",
			origin: "top-level"
		};
		const normalizedPath = resolve(filePath);
		for (const [baseDir, scope] of [[this.agentDir, "user"], [join(this.cwd, CONFIG_DIR_NAME), "project"]]) for (const resource of [
			"skills",
			"prompts",
			"themes",
			"extensions"
		]) {
			const root = join(baseDir, resource);
			if (isPathInside(root, normalizedPath)) return {
				path: filePath,
				source: "local",
				scope,
				origin: "top-level",
				baseDir: root
			};
		}
		return {
			path: filePath,
			source: "local",
			scope: "temporary",
			origin: "top-level",
			baseDir: statSync(normalizedPath).isDirectory() ? normalizedPath : resolve(normalizedPath, "..")
		};
	}
	mergePaths(primary, additional) {
		const merged = [];
		const seen = /* @__PURE__ */ new Set();
		for (const p of [...primary, ...additional]) {
			const resolved = this.resolveResourcePath(p);
			const canonicalPath = canonicalizePath(resolved);
			if (seen.has(canonicalPath)) continue;
			seen.add(canonicalPath);
			merged.push(resolved);
		}
		return merged;
	}
	resolveResourcePath(p) {
		return resolve(this.cwd, expandTildePath(p));
	}
	loadThemes(paths) {
		const themes = [];
		const diagnostics = [];
		for (const p of paths) {
			const resolved = resolve(this.cwd, p);
			if (!existsSync(resolved)) {
				diagnostics.push({
					type: "warning",
					message: "theme path does not exist",
					path: resolved
				});
				continue;
			}
			try {
				const stats = statSync(resolved);
				if (stats.isDirectory()) this.loadThemesFromDir(resolved, themes, diagnostics);
				else if (stats.isFile() && resolved.endsWith(".json")) this.loadThemeFromFile(resolved, themes, diagnostics);
				else diagnostics.push({
					type: "warning",
					message: "theme path is not a json file",
					path: resolved
				});
			} catch (error) {
				const message = error instanceof Error ? error.message : "failed to read theme path";
				diagnostics.push({
					type: "warning",
					message,
					path: resolved
				});
			}
		}
		return {
			themes,
			diagnostics
		};
	}
	loadThemesFromDir(dir, themes, diagnostics) {
		if (!existsSync(dir)) return;
		try {
			const { entries, failedDirs } = walkDirectorySync(dir, {
				maxDepth: 1,
				symlinks: "follow",
				include: (entry) => entry.kind === "file" && entry.name.endsWith(".json")
			});
			const failure = failedDirs[0];
			if (failure) throw failure.error;
			for (const entry of entries) this.loadThemeFromFile(join(dir, entry.name), themes, diagnostics);
		} catch (error) {
			const message = error instanceof Error ? error.message : "failed to read theme directory";
			diagnostics.push({
				type: "warning",
				message,
				path: dir
			});
		}
	}
	loadThemeFromFile(filePath, themes, diagnostics) {
		try {
			themes.push(loadThemeFromPath(filePath));
		} catch (error) {
			const message = error instanceof Error ? error.message : "failed to load theme";
			diagnostics.push({
				type: "warning",
				message,
				path: filePath
			});
		}
	}
	async loadExtensionFactories(runtime) {
		const extensions = [];
		const errors = [];
		for (const [index, factory] of this.extensionFactories.entries()) {
			const extensionPath = `<inline:${index + 1}>`;
			try {
				const extension = await loadExtensionFromFactory(factory, this.cwd, this.eventBus, runtime, extensionPath);
				extensions.push(extension);
			} catch (error) {
				const message = error instanceof Error ? error.message : "failed to load extension";
				errors.push({
					path: extensionPath,
					error: message
				});
			}
		}
		return {
			extensions,
			errors
		};
	}
	dedupeResources(resources, resourceType, getName, getPath) {
		const seen = /* @__PURE__ */ new Map();
		const diagnostics = [];
		for (const resource of resources) {
			const name = getName(resource);
			const existing = seen.get(name);
			if (existing) {
				const path = getPath(resource);
				diagnostics.push({
					type: "collision",
					message: `name "${resourceType === "prompt" ? "/" : ""}${name}" collision`,
					path,
					collision: {
						resourceType,
						name,
						winnerPath: getPath(existing) ?? "<builtin>",
						loserPath: path ?? "<builtin>"
					}
				});
			} else seen.set(name, resource);
		}
		return {
			resources: Array.from(seen.values()),
			diagnostics
		};
	}
	detectExtensionConflicts(extensions) {
		const conflicts = [];
		const owners = {
			tools: /* @__PURE__ */ new Map(),
			flags: /* @__PURE__ */ new Map()
		};
		for (const ext of extensions) for (const kind of ["tools", "flags"]) for (const name of ext[kind].keys()) {
			const existingOwner = owners[kind].get(name);
			if (existingOwner && existingOwner !== ext.path) {
				const label = kind === "tools" ? `Tool "${name}"` : `Flag "--${name}"`;
				conflicts.push({
					path: ext.path,
					message: `${label} conflicts with ${existingOwner}`
				});
			} else owners[kind].set(name, ext.path);
		}
		return conflicts;
	}
};
//#endregion
export { resolveModelScope as A, takeRuntimeUserTurnTranscriptContext as B, wrapRegisteredTools as C, findInitialModel as D, findExactModelReferenceMatch as E, collectEntriesForBranchSummary as F, resolveCompactionInstructions as G, withRuntimeUserTurnTranscriptRecorder as H, generateBranchSummary as I, estimateRenderedPromptTokens as J, estimateJsonPayloadTokenPressure as K, executeBashWithOperations as L, compact as M, generateSummary as N, parseModelPattern as O, prepareCompaction as P, createEventBus as R, loadExtensionFromFactory as S, DefaultPackageManager as T, sanitizeCompactionReplayMessages as U, takeRuntimeUserTurnTranscriptRecorder as V, stripStaleAssistantUsageBeforeLatestCompaction as W, estimateToolSchemaTokens as X, estimateStringTokenPressure as Y, setSessionToolResultPreparer as _, recordSessionModelUsage as a, ExtensionRunner as b, agentSessionQueuePromptContext as c, createCompactionRequestBudget as d, estimateCompactedRequestTokens as f, subscribeSteeringMessagePersistenceFailure as g, getSteeringMessageIdentity as h, agentSessionSetContextReplacementHook as i, restoreModelFromSession as j, resolveCliModel as k, agentSessionSetPromptPreparation as l, loadSkills as m, AgentSession as n, setSessionModelUsageSink as o, formatSkillsForPrompt as p, estimateMessageTokenPressure as q, agentSessionAutomaticCompaction as r, preflightManualSessionCompaction as s, DefaultResourceLoader as t, attachPromptCompactionRequestBudget as u, createSessionManagerRuntimeRegistry as v, SettingsManager as w, createExtensionRuntime as x, retireQueuedUserMessage as y, attachRuntimeUserTurnTranscriptRecorder as z };
