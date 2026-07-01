import { c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
import { a as isSubagentSessionKey, i as isCronSessionKey } from "./session-key-utils-C7uT9A4s.js";
import { m as drainPluginNextTurnInjectionContext } from "./registry-yozg2pVI.js";
import { I as buildPluginAgentTurnPrepareContext } from "./runtime-wIYJz8NY.js";
import { c as joinPresentTextSegments } from "./hook-runner-global-D4fQSLSV.js";
import { n as derivePromptTokens } from "./usage-C67Kbb7n.js";
import { i as buildActiveMusicGenerationTaskPromptContextForSession, l as buildActiveImageGenerationTaskPromptContextForSession, n as buildActiveVideoGenerationTaskPromptContextForSession } from "./openclaw-tools-CUg87Oi7.js";
import { t as log } from "./logger-DibNup0x.js";
import { n as normalizeStructuredPromptSection } from "./prompt-cache-stability-l46Vk4aJ.js";
import { r as prependSystemPromptAdditionAfterCacheBoundary } from "./system-prompt-cache-boundary-ewprF4Mn.js";
import { n as resolveProcessToolScopeKey } from "./agent-tools-CeeIc_fl.js";
import { l as resolveEffectiveToolFsWorkspaceOnly } from "./local-roots-ChiBnsqP.js";
import { r as listActiveProcessSessionReferences, t as buildEmbeddedCompactionRuntimeContext } from "./compaction-runtime-context-DiDns5g3.js";
import { t as resolveHeartbeatPromptForSystemPrompt } from "./heartbeat-system-prompt-QFOE5bY3.js";
import { t as resolveBoundAgentIdForSession } from "./session-agent-binding-UGXPya5P.js";
//#region src/agents/embedded-agent-runner/context-engine-capabilities.ts
/**
* Builds host capabilities passed into context-engine runtime calls.
*/
/**
* Build host-owned capabilities that are bound to one context-engine runtime call.
*/
function resolveContextEngineCapabilities(params) {
	const sessionKey = normalizeOptionalString(params.sessionKey);
	const agentId = resolveBoundAgentIdForSession({
		config: params.config,
		sessionKey,
		agentId: params.agentId
	});
	const contextEnginePluginId = normalizeOptionalString(params.contextEnginePluginId);
	return { llm: { complete: async (request) => {
		const { createRuntimeLlm } = await import("./runtime-llm.runtime.js");
		return await createRuntimeLlm({
			getConfig: () => params.config,
			authority: {
				caller: {
					kind: "context-engine",
					id: params.purpose
				},
				requiresBoundAgent: true,
				...sessionKey ? { sessionKey } : {},
				...agentId ? { agentId } : {},
				...params.authProfileId ? { preferredProfile: params.authProfileId } : {},
				...contextEnginePluginId ? { pluginIdForPolicy: contextEnginePluginId } : {},
				allowAgentIdOverride: false,
				allowModelOverride: false,
				allowComplete: true
			}
		}).complete(request);
	} } };
}
//#endregion
//#region src/agents/hook-system-context-boundary.ts
/**
* Wraps plugin-provided system context in stable prompt-cache boundaries.
*/
const HOOK_SYSTEM_CONTEXT_HEADER = "OpenClaw plugin-injected system context. This block is not workspace file content.";
/** Normalizes and fences plugin-injected system context before it enters prompts. */
function wrapPluginSystemContextSection(value) {
	if (typeof value !== "string") return;
	const normalized = normalizeStructuredPromptSection(value);
	if (!normalized) return;
	return `---\n\n${HOOK_SYSTEM_CONTEXT_HEADER}\n\n${normalized}\n\n---`;
}
//#endregion
//#region src/agents/embedded-agent-runner/run/trigger-policy.ts
const DEFAULT_EMBEDDED_RUN_TRIGGER_POLICY = { injectHeartbeatPrompt: false };
const EMBEDDED_RUN_TRIGGER_POLICY = { heartbeat: { injectHeartbeatPrompt: true } };
/**
* Decides whether a run trigger should add the heartbeat-specific prompt
* instruction. Unknown or omitted triggers fall back to the user-prompt shape
* so non-heartbeat runs do not get scheduler wording.
*/
function shouldInjectHeartbeatPromptForTrigger(trigger) {
	return (trigger ? EMBEDDED_RUN_TRIGGER_POLICY[trigger] : void 0)?.injectHeartbeatPrompt ?? DEFAULT_EMBEDDED_RUN_TRIGGER_POLICY.injectHeartbeatPrompt;
}
//#endregion
//#region src/agents/embedded-agent-runner/run/attempt.prompt-helpers.ts
const PROMPT_BUILD_DRAIN_CACHE_MAX = 256;
const promptBuildDrainCache = /* @__PURE__ */ new Map();
function rememberDrainedInjections(runId, injections) {
	if (promptBuildDrainCache.has(runId)) promptBuildDrainCache.delete(runId);
	else if (promptBuildDrainCache.size >= PROMPT_BUILD_DRAIN_CACHE_MAX) {
		const oldest = promptBuildDrainCache.keys().next().value;
		if (oldest !== void 0) promptBuildDrainCache.delete(oldest);
	}
	promptBuildDrainCache.set(runId, injections);
}
/**
* Releases the per-run drained-injection cache. Call when a run terminates so
* the cap stays headroom for active runs.
*/
function forgetPromptBuildDrainCacheForRun(runId) {
	if (runId) promptBuildDrainCache.delete(runId);
}
/**
* Resolves prompt-build hook contributions for one attempt. Next-turn
* injections are drained once per run and cached for retries so destructive
* session-store reads do not lose plugin context after a failed first attempt.
*/
async function resolvePromptBuildHookResult(params) {
	const runId = params.hookCtx.runId;
	const cachedInjections = runId ? promptBuildDrainCache.get(runId) : void 0;
	const queuedContext = cachedInjections ? {
		queuedInjections: cachedInjections,
		...buildPluginAgentTurnPrepareContext({ queuedInjections: cachedInjections })
	} : await drainPluginNextTurnInjectionContext({
		cfg: params.config,
		sessionKey: params.hookCtx.sessionKey
	});
	if (runId && !cachedInjections) rememberDrainedInjections(runId, queuedContext.queuedInjections);
	const turnPrepareResult = params.hookRunner?.runAgentTurnPrepare && params.hookRunner.hasHooks("agent_turn_prepare") ? await params.hookRunner.runAgentTurnPrepare({
		prompt: params.prompt,
		messages: params.messages,
		queuedInjections: queuedContext.queuedInjections
	}, params.hookCtx).catch((hookErr) => {
		log.warn(`agent_turn_prepare hook failed: ${String(hookErr)}`);
	}) : void 0;
	const heartbeatContribution = params.hookCtx.trigger === "heartbeat" && params.hookRunner?.runHeartbeatPromptContribution && params.hookRunner.hasHooks("heartbeat_prompt_contribution") ? await params.hookRunner.runHeartbeatPromptContribution({
		sessionKey: params.hookCtx.sessionKey,
		agentId: params.hookCtx.agentId,
		heartbeatName: "heartbeat"
	}, params.hookCtx).catch((hookErr) => {
		log.warn(`heartbeat_prompt_contribution hook failed: ${String(hookErr)}`);
	}) : void 0;
	const promptBuildResult = params.hookRunner?.hasHooks("before_prompt_build") ? await params.hookRunner.runBeforePromptBuild({
		prompt: params.prompt,
		messages: params.messages
	}, params.hookCtx).catch((hookErr) => {
		log.warn(`before_prompt_build hook failed: ${String(hookErr)}`);
	}) : void 0;
	const beforeAgentStartResult = params.beforeAgentStartResult ?? (params.hookRunner?.hasHooks("before_agent_start") ? await params.hookRunner.runBeforeAgentStart({
		prompt: params.prompt,
		messages: params.messages
	}, params.hookCtx).catch((hookErr) => {
		log.warn(`deprecated before_agent_start hook failed during prompt build: ${String(hookErr)}`);
	}) : void 0);
	return {
		systemPrompt: promptBuildResult?.systemPrompt ?? beforeAgentStartResult?.systemPrompt,
		prependContext: joinPresentTextSegments([
			queuedContext.prependContext,
			turnPrepareResult?.prependContext,
			heartbeatContribution?.prependContext,
			promptBuildResult?.prependContext,
			beforeAgentStartResult?.prependContext
		]),
		appendContext: joinPresentTextSegments([
			queuedContext.appendContext,
			turnPrepareResult?.appendContext,
			heartbeatContribution?.appendContext,
			promptBuildResult?.appendContext,
			beforeAgentStartResult?.appendContext
		]),
		prependSystemContext: joinPresentTextSegments([wrapPluginSystemContextSection(promptBuildResult?.prependSystemContext), wrapPluginSystemContextSection(beforeAgentStartResult?.prependSystemContext)]),
		appendSystemContext: joinPresentTextSegments([wrapPluginSystemContextSection(promptBuildResult?.appendSystemContext), wrapPluginSystemContextSection(beforeAgentStartResult?.appendSystemContext)])
	};
}
function resolvePromptModeForSession(sessionKey) {
	if (!sessionKey) return "full";
	return isSubagentSessionKey(sessionKey) || isCronSessionKey(sessionKey) ? "minimal" : "full";
}
/**
* Determines whether the default agent's heartbeat run should include the
* heartbeat prompt contribution. Non-default agents and non-heartbeat triggers
* keep their normal prompt shape.
*/
function shouldInjectHeartbeatPrompt(params) {
	return params.isDefaultAgent && shouldInjectHeartbeatPromptForTrigger(params.trigger) && Boolean(resolveHeartbeatPromptForSystemPrompt({
		config: params.config,
		agentId: params.agentId,
		defaultAgentId: params.defaultAgentId
	}));
}
/** User-visible runs warn when transcript repair had to merge an orphaned user turn. */
function shouldWarnOnOrphanedUserRepair(trigger) {
	return trigger === "user" || trigger === "manual";
}
/**
* Distinguishes a truly empty prompt/history from a blank follow-up in a visible
* conversation. This lets callers skip model submission while reporting the
* reason accurately.
*/
function resolvePromptSubmissionSkipReason(params) {
	if (params.prompt.trim().length > 0 || params.imageCount > 0) return null;
	return params.messages.some(hasVisiblePromptHistory) ? "blank_user_prompt" : "empty_prompt_history_images";
}
function hasVisiblePromptHistory(message) {
	if (!message || typeof message !== "object") return false;
	const record = message;
	if (record.role !== "user" && record.role !== "assistant") return false;
	return hasNonEmptyContent(record.content);
}
function hasNonEmptyContent(content) {
	if (typeof content === "string") return content.trim().length > 0;
	if (Array.isArray(content)) return content.some(hasNonEmptyContent);
	if (!content || typeof content !== "object") return false;
	const record = content;
	return hasNonEmptyContent(record.text) || hasNonEmptyContent(record.content);
}
const QUEUED_USER_MESSAGE_MARKER = "[Queued user message that arrived while the previous turn was still active]";
const MAX_STRUCTURED_MEDIA_REF_CHARS = 300;
const MAX_STRUCTURED_JSON_STRING_CHARS = 300;
const MAX_STRUCTURED_JSON_DEPTH = 4;
const MAX_STRUCTURED_JSON_ARRAY_ITEMS = 16;
const MAX_STRUCTURED_JSON_OBJECT_KEYS = 32;
function summarizeStructuredMediaRef(label, value) {
	if (typeof value !== "string") return;
	const trimmed = value.trim();
	if (!trimmed) return;
	const dataUriMatch = trimmed.match(/^data:([^;,]+)?(?:;[^,]*)?,/i);
	if (dataUriMatch) return `[${label}] inline data URI (${dataUriMatch[1]?.trim() || "unknown"}, ${trimmed.length} chars)`;
	if (trimmed.length > MAX_STRUCTURED_MEDIA_REF_CHARS) return `[${label}] ${trimmed.slice(0, MAX_STRUCTURED_MEDIA_REF_CHARS)}... (${trimmed.length} chars)`;
	return `[${label}] ${trimmed}`;
}
function summarizeStructuredJsonString(value) {
	const mediaSummary = summarizeStructuredMediaRef("value", value);
	if (mediaSummary?.includes("inline data URI")) return mediaSummary;
	const trimmed = value.trim();
	if (trimmed.length > MAX_STRUCTURED_JSON_STRING_CHARS) return `${trimmed.slice(0, MAX_STRUCTURED_JSON_STRING_CHARS)}... (${trimmed.length} chars)`;
	return value;
}
function sanitizeStructuredJsonValue(value, depth = 0, seen = /* @__PURE__ */ new WeakSet()) {
	if (typeof value === "string") return summarizeStructuredJsonString(value);
	if (!value || typeof value !== "object") return value;
	if (seen.has(value)) return "[circular]";
	if (depth >= MAX_STRUCTURED_JSON_DEPTH) return "[max depth]";
	seen.add(value);
	if (Array.isArray(value)) {
		const limited = value.slice(0, MAX_STRUCTURED_JSON_ARRAY_ITEMS).map((item) => sanitizeStructuredJsonValue(item, depth + 1, seen));
		if (value.length > MAX_STRUCTURED_JSON_ARRAY_ITEMS) limited.push(`[${value.length - MAX_STRUCTURED_JSON_ARRAY_ITEMS} more items]`);
		seen.delete(value);
		return limited;
	}
	const output = {};
	let copied = 0;
	let skipped = 0;
	for (const key in value) {
		if (!Object.hasOwn(value, key)) continue;
		if (copied >= MAX_STRUCTURED_JSON_OBJECT_KEYS) {
			skipped += 1;
			continue;
		}
		output[key] = sanitizeStructuredJsonValue(value[key], depth + 1, seen);
		copied += 1;
	}
	if (skipped > 0) output["__truncated"] = `${skipped} more keys`;
	seen.delete(value);
	return output;
}
function stringifyStructuredJsonFallback(part) {
	try {
		const serialized = JSON.stringify(sanitizeStructuredJsonValue(part));
		if (!serialized || serialized === "{}") return;
		const withoutInlineData = serialized.replace(/data:[^"'\\\s]+/gi, (match) => `[inline data URI: ${match.length} chars]`);
		return withoutInlineData.length > 1e3 ? `${withoutInlineData.slice(0, 1e3)}... (${withoutInlineData.length} chars)` : withoutInlineData;
	} catch {
		return;
	}
}
function stringifyStructuredContentPart(part) {
	if (!part || typeof part !== "object") return;
	const record = part;
	if (record.type === "text") return (typeof record.text === "string" ? record.text.trim() : "") || void 0;
	if (record.type === "image_url") {
		const imageUrl = record.image_url;
		return summarizeStructuredMediaRef("image_url", typeof imageUrl === "string" ? imageUrl : imageUrl && typeof imageUrl === "object" ? imageUrl.url : void 0);
	}
	if (record.type === "image" || record.type === "input_image") return summarizeStructuredMediaRef(record.type, record.url) ?? summarizeStructuredMediaRef(record.type, record.source);
	if (typeof record.type === "string") {
		const typedRef = summarizeStructuredMediaRef(record.type, record.audio_url) ?? summarizeStructuredMediaRef(record.type, record.media_url) ?? summarizeStructuredMediaRef(record.type, record.url) ?? summarizeStructuredMediaRef(record.type, record.source);
		if (typedRef) return typedRef;
	}
	return stringifyStructuredJsonFallback(part);
}
function extractUserMessagePromptText(content) {
	if (typeof content === "string") return content.trim() || void 0;
	if (!Array.isArray(content)) return;
	return content.flatMap((part) => {
		const textLocal = stringifyStructuredContentPart(part);
		return textLocal ? [textLocal] : [];
	}).join("\n").trim() || void 0;
}
function promptAlreadyIncludesQueuedUserMessage(prompt, orphanText) {
	const normalizedPrompt = prompt.replace(/\r\n/g, "\n");
	const normalizedOrphanText = orphanText.replace(/\r\n/g, "\n").trim();
	if (!normalizedOrphanText) return false;
	const queuedBlockPrefix = `${QUEUED_USER_MESSAGE_MARKER}\n${normalizedOrphanText}`;
	return normalizedPrompt === queuedBlockPrefix || normalizedPrompt.startsWith(`${queuedBlockPrefix}\n`) || normalizedPrompt.includes(`\n${queuedBlockPrefix}\n`) || `\n${normalizedPrompt}\n`.includes(`\n${normalizedOrphanText}\n`);
}
/**
* Merges a trailing user message that was queued in transcript history but not
* present in the active prompt. The leaf is removed whether merged or already
* present so the transcript cannot submit the same user turn twice.
*/
function mergeOrphanedTrailingUserPrompt(params) {
	const orphanText = extractUserMessagePromptText(params.leafMessage.content);
	if (!orphanText) return {
		prompt: params.prompt,
		merged: false,
		removeLeaf: true
	};
	if (promptAlreadyIncludesQueuedUserMessage(params.prompt, orphanText)) return {
		prompt: params.prompt,
		merged: false,
		removeLeaf: true
	};
	return {
		prompt: [
			QUEUED_USER_MESSAGE_MARKER,
			orphanText,
			"",
			params.prompt
		].join("\n"),
		merged: true,
		removeLeaf: true
	};
}
function resolveAttemptFsWorkspaceOnly(params) {
	return resolveEffectiveToolFsWorkspaceOnly({
		cfg: params.config,
		agentId: params.sessionAgentId
	});
}
function prependSystemPromptAddition(params) {
	return prependSystemPromptAdditionAfterCacheBoundary(params);
}
function resolveAttemptMediaTaskSystemPromptAddition(params) {
	if (params.trigger !== "user" && params.trigger !== "manual") return;
	return joinPresentTextSegments([
		buildActiveImageGenerationTaskPromptContextForSession(params.sessionKey),
		buildActiveVideoGenerationTaskPromptContextForSession(params.sessionKey),
		buildActiveMusicGenerationTaskPromptContextForSession(params.sessionKey)
	]);
}
/** Build runtime context passed into context-engine afterTurn hooks. */
function buildAfterTurnRuntimeContext(params) {
	return {
		...buildEmbeddedCompactionRuntimeContext({
			sessionKey: params.attempt.sessionKey,
			messageChannel: params.attempt.messageChannel,
			messageProvider: params.attempt.messageProvider,
			agentAccountId: params.attempt.agentAccountId,
			currentChannelId: params.attempt.currentChannelId,
			currentThreadTs: params.attempt.currentThreadTs,
			currentMessageId: params.attempt.currentMessageId,
			authProfileId: params.attempt.authProfileId,
			workspaceDir: params.workspaceDir,
			cwd: params.cwd,
			agentDir: params.agentDir,
			config: params.attempt.config,
			skillsSnapshot: params.attempt.skillsSnapshot,
			senderId: params.attempt.senderId,
			provider: params.attempt.provider,
			modelId: params.attempt.modelId,
			harnessRuntime: params.attempt.agentHarnessId,
			thinkLevel: params.attempt.thinkLevel,
			reasoningLevel: params.attempt.reasoningLevel,
			bashElevated: params.attempt.bashElevated,
			extraSystemPrompt: params.attempt.extraSystemPrompt,
			ownerNumbers: params.attempt.ownerNumbers,
			activeProcessSessions: listActiveProcessSessionReferences({ scopeKey: resolveProcessToolScopeKey({
				sessionKey: params.attempt.sandboxSessionKey?.trim() || params.attempt.sessionKey,
				sessionId: params.attempt.sessionId,
				agentId: params.activeAgentId
			}) })
		}),
		...resolveContextEngineCapabilities({
			config: params.attempt.config,
			sessionKey: params.attempt.sessionKey,
			agentId: params.activeAgentId,
			authProfileId: params.attempt.authProfileId,
			contextEnginePluginId: params.contextEnginePluginId,
			purpose: "context-engine.after-turn"
		}),
		...typeof params.tokenBudget === "number" && Number.isFinite(params.tokenBudget) && params.tokenBudget > 0 ? { tokenBudget: Math.floor(params.tokenBudget) } : {},
		...typeof params.currentTokenCount === "number" && Number.isFinite(params.currentTokenCount) && params.currentTokenCount > 0 ? { currentTokenCount: Math.floor(params.currentTokenCount) } : {},
		...params.promptCache ? { promptCache: params.promptCache } : {}
	};
}
function buildAfterTurnRuntimeContextFromUsage(params) {
	return buildAfterTurnRuntimeContext({
		...params,
		currentTokenCount: derivePromptTokens(params.lastCallUsage)
	});
}
//#endregion
export { prependSystemPromptAddition as a, resolvePromptBuildHookResult as c, shouldInjectHeartbeatPrompt as d, shouldWarnOnOrphanedUserRepair as f, mergeOrphanedTrailingUserPrompt as i, resolvePromptModeForSession as l, resolveContextEngineCapabilities as m, buildAfterTurnRuntimeContextFromUsage as n, resolveAttemptFsWorkspaceOnly as o, wrapPluginSystemContextSection as p, forgetPromptBuildDrainCacheForRun as r, resolveAttemptMediaTaskSystemPromptAddition as s, buildAfterTurnRuntimeContext as t, resolvePromptSubmissionSkipReason as u };
