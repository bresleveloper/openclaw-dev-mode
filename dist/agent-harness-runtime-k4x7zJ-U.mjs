import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import "./utils-aKqR_F_U.mjs";
import "./session-key-CBvmC8zz.mjs";
import { i as getPluginValueInstance } from "./plugin-instance-scope-C9hxyH_A.mjs";
import { y as redactToolDetail } from "./redact-B5EGyLvV.mjs";
import "./errors-DnjwnOju.mjs";
import { t as createSubsystemLogger } from "./subsystem-DleLyu58.mjs";
import "./version-BkM1aB4w.mjs";
import "./internal-runtime-context-BH-o1oq1.mjs";
import { o as expandToolGroups } from "./tool-policy-shared-auQCQEhM.mjs";
import { r as createToolPolicyMatcher } from "./tool-policy-match-Bv2XOvEF.mjs";
import "./agent-scope-CTuYDtny.mjs";
import { d as resolveExecModePolicy } from "./exec-approvals-core-BZ3ECkXD.mjs";
import "./run-cleanup-timeout-BlChlpzQ.mjs";
import "./agent-events-BOSJcayE.mjs";
import { i as shouldLoadRequesterScopedMcpHarnessRuntime } from "./agent-bundle-mcp-runtime-shared-BFBNCZj0.mjs";
import "./provider-request-config-DOrVD029.mjs";
import { q as listCodexAppServerExtensionFactories } from "./loader-runtime-load-XbrcYJWd.mjs";
import { p as joinPresentTextSegments } from "./hooks-DuXrq03h.mjs";
import "./registry-Bqh30cGD.mjs";
import { t as getGlobalHookRunner } from "./hook-runner-global-DlvY8FQy.mjs";
import "./reply-payload-B2ZQhznY.mjs";
import "./agent-tools.before-tool-call-C2rI0w1x.mjs";
import "./registry-aYyey5ds.mjs";
import "./model-auth-CCIBdEPk.mjs";
import { C as minSecurity, S as maxAsk } from "./exec-approvals-authorization.kernel-DYisNIDQ.mjs";
import "./date-time-CaOYkXPL.mjs";
import "./usage-XXLoqJQC.mjs";
import { c as normalizeAgentRunAttemptTerminal, l as projectAgentRunAttemptTerminal, s as mergeAgentRunAttemptTerminal, u as setAgentRunAttemptTerminalFailure } from "./agent-run-terminal-outcome-Dto4EMdr.mjs";
import "./run-termination-Cd1iJzC7.mjs";
import "./diagnostic-CT1lx7JC.mjs";
import "./tool-metadata-DpaqT_qU.mjs";
import "./agent-tool-metadata-COcr-3AD.mjs";
import { y as queueEmbeddedAgentMessageWithOutcome } from "./runs-Cjzxx3Pg.mjs";
import "./active-run-projections-BHX_SDCX.mjs";
import "./user-turn-transcript.metadata-BY4PdwgQ.mjs";
import "./tool-result-error-CWadvCKd.mjs";
import "./gateway-fiwofDIl.mjs";
import "./embedded-agent-messaging-Beh3oN8O.mjs";
import "./hook-helpers-BzSlbw21.mjs";
import "./gateway-question-D_lf0vLm.mjs";
import "./ask-user-tool-normalization-2WsyzPxb.mjs";
import { r as inferToolMetaFromArgsCore } from "./tool-display-DjrvDE8J.mjs";
import "./tool-meta-Cg9Nif2y.mjs";
import "./in-process-gateway-DZ9VbywH.mjs";
import "./agent-scope-runtime-OY7yRyJL.mjs";
import "./context-engine-lifecycle-CFdTrVHv.mjs";
import "./prepare-auth-CvmQc1W2.mjs";
import "./agent-tools.ring-zero-context-DcmTQndF.mjs";
import { n as buildCurrentInboundPrompt } from "./runtime-context-prompt-Jr1ZDwll.mjs";
import "./tool-schema-projection-D9z9oa3w.mjs";
import "./tool-replay-safety-v7miLTIv.mjs";
import "./logger-Cp6WXSpQ.mjs";
import "./bootstrap-files-BL4PdvwV.mjs";
import "./nodes-utils-CWXEO3Tj.mjs";
import "./fs-paths-DFN3paLR.mjs";
import "./sandbox-BnX1IPPh.mjs";
import "./settled-turn-finalization-result-DlRV2dc9.mjs";
import { y as wrapPluginSystemContextSection } from "./context-engine-maintenance-5FlnjD_8.mjs";
import "./tools-BDXkXw9E.mjs";
import "./attempt-tool-construction-plan-DN-5OrUy.mjs";
import "./agent-activity-events-DJmgjmUx.mjs";
import "./embedded-agent-tool-results-Cn4G9Xfj.mjs";
import "./embedded-agent-messaging-extraction-CLhoQbEq.mjs";
import "./embedded-agent-message-delivery-BkG-vmHL.mjs";
import "./heartbeat-tool-response-C3vGkDX4.mjs";
import "./embedded-agent-message-tool-source-reply-B-f_7Ier.mjs";
import { s as buildAgentHookContext } from "./lifecycle-hook-helpers-DTTv5bkq.mjs";
import "./attempt-thread-helpers-4QItXoFy.mjs";
import "./transcript-visibility-Cb9_qxek.mjs";
import { n as prepareWatchedSessionsPrompt, t as buildWatchedSessionsPromptLines } from "./watched-sessions-prompt-aVa7LVfx.mjs";
import "./tool-result-middleware-1OL8k_gS.mjs";
import "./result-fallback-classifier-BENPsKcd.mjs";
import "./build-C0I3JfiP.mjs";
import "./execution-auth-binding-DkIxPe6Z.mjs";
import "./native-hook-relay-DXjzBmPM.mjs";
import { a as isStructuredInputRecord, i as compileStructuredInputUrl, n as compileStructuredInputForm, o as snapshotStructuredInput, r as compileStructuredInputQuestions, t as runStructuredInput } from "./structured-input-execution-CIk4B6TX.mjs";
//#region src/plugin-sdk/session-write-lock-runtime.ts
const DEFAULT_SESSION_WRITE_LOCK_ACQUIRE_TIMEOUT_MS = 6e4;
const DEFAULT_SESSION_WRITE_LOCK_STALE_MS = 18e5;
const DEFAULT_SESSION_WRITE_LOCK_MAX_HOLD_MS = 3e5;
/**
* @deprecated Session write leases were removed. This compatibility stub is scheduled for
* removal in the 2026.10 release train; use the session lane and durable writer claim/fence.
*/
function resolveSessionWriteLockAcquireTimeoutMs(_config, _env) {
	return DEFAULT_SESSION_WRITE_LOCK_ACQUIRE_TIMEOUT_MS;
}
/**
* @deprecated Session write leases were removed. This compatibility stub is scheduled for
* removal in the 2026.10 release train; use the session lane and durable writer claim/fence.
*/
function resolveSessionWriteLockOptions(_config, _params = {}) {
	return {
		timeoutMs: DEFAULT_SESSION_WRITE_LOCK_ACQUIRE_TIMEOUT_MS,
		staleMs: DEFAULT_SESSION_WRITE_LOCK_STALE_MS,
		maxHoldMs: DEFAULT_SESSION_WRITE_LOCK_MAX_HOLD_MS
	};
}
/**
* @deprecated Session write leases were removed. This no-op compatibility stub is scheduled
* for removal in the 2026.10 release train; use the session lane and durable writer claim/fence.
*/
async function acquireSessionWriteLock(_params) {
	return {
		assertOwned: () => void 0,
		release: async () => void 0
	};
}
//#endregion
//#region src/agents/harness/prompt-compaction-hook-helpers.ts
/**
* Agent harness prompt and compaction hook helpers.
*
* Harness runtimes use this to run plugin hooks around prompt construction and
* compaction while keeping hook failures non-fatal.
*/
const log$1 = createSubsystemLogger("agents/harness");
/** Runs before-prompt hooks and returns the adjusted prompt fields. */
async function resolveAgentHarnessBeforePromptBuildResult(params) {
	const inputPrompt = buildCurrentInboundPrompt({
		context: params.currentInboundContext,
		prompt: params.prompt
	});
	const hookRunner = getGlobalHookRunner();
	const hasHeartbeatContribution = params.ctx.trigger === "heartbeat" && Boolean(hookRunner?.hasHooks("heartbeat_prompt_contribution"));
	const hasPromptBuildHooks = Boolean(hookRunner?.hasHooks("before_prompt_build"));
	if (!hasHeartbeatContribution && !hasPromptBuildHooks) return {
		prompt: inputPrompt,
		developerInstructions: resolveDeveloperInstructions(params.developerInstructions),
		promptInputRange: {
			start: 0,
			end: inputPrompt.length
		}
	};
	const hookCtx = buildAgentHookContext(params.ctx);
	const promptEvent = {
		prompt: inputPrompt,
		...typeof params.currentUserMessage === "string" ? { currentUserMessage: params.currentUserMessage } : {},
		...typeof params.currentUserMessageId === "string" ? { currentUserMessageId: params.currentUserMessageId } : {},
		messages: params.messages
	};
	const heartbeatResult = hasHeartbeatContribution && hookRunner ? await hookRunner.runHeartbeatPromptContribution({
		sessionKey: params.ctx.sessionKey,
		agentId: params.ctx.agentId,
		heartbeatName: "heartbeat"
	}, hookCtx).catch((error) => {
		log$1.warn(`heartbeat_prompt_contribution hook failed: ${String(error)}`);
	}) : void 0;
	const promptBuildResult = hookRunner && hasPromptBuildHooks ? await hookRunner.runBeforePromptBuild(promptEvent, hookCtx).catch((error) => {
		log$1.warn(`before_prompt_build hook failed: ${String(error)}`);
	}) : void 0;
	const developerInstructions = resolveDeveloperInstructions(params.developerInstructions, promptBuildResult?.toolsAllow);
	const toolAuthority = params.toolAuthority;
	const toolAuthorityFingerprint = toolAuthority?.fingerprint?.trim();
	const authorizedPromptBuildResult = hookRunner && toolAuthorityFingerprint && toolAuthority ? await hookRunner.runAuthorizedPromptBuild(promptEvent, hookCtx, {
		toolAuthorityFingerprint,
		activeToolNames: toolAuthority.activeToolNames(),
		assertHostActive: toolAuthority.assertActive
	}).catch((error) => {
		log$1.warn(`authorized before_prompt_build hook failed: ${String(error)}`);
	}) : void 0;
	const systemPrompt = resolvePromptBuildSystemPrompt({
		developerInstructions,
		promptBuildResult
	});
	const promptPrefix = joinPresentTextSegments([
		heartbeatResult?.prependContext,
		promptBuildResult?.prependContext,
		authorizedPromptBuildResult?.prependContext
	]);
	const promptSuffix = joinPresentTextSegments([
		heartbeatResult?.appendContext,
		promptBuildResult?.appendContext,
		authorizedPromptBuildResult?.appendContext
	]);
	const prompt = joinPresentTextSegments([
		promptPrefix,
		inputPrompt,
		promptSuffix
	]) ?? inputPrompt;
	const promptInputStart = inputPrompt.length === 0 ? promptPrefix?.length ?? 0 : promptPrefix ? promptPrefix.length + 2 : 0;
	return {
		prompt,
		...promptBuildResult?.toolsAllow !== void 0 ? { toolsAllow: promptBuildResult.toolsAllow } : {},
		developerInstructions: joinPresentTextSegments([
			wrapPluginSystemContextSection(promptBuildResult?.prependSystemContext),
			systemPrompt,
			wrapPluginSystemContextSection(promptBuildResult?.appendSystemContext)
		]) ?? systemPrompt,
		promptInputRange: {
			start: promptInputStart,
			end: promptInputStart + inputPrompt.length
		}
	};
}
function resolveDeveloperInstructions(instructions, toolsAllow) {
	return typeof instructions === "string" ? instructions : instructions.build({ toolsAllow }) ?? "";
}
function resolvePromptBuildSystemPrompt(params) {
	if (typeof params.promptBuildResult?.systemPrompt === "string") return params.promptBuildResult.systemPrompt;
	return params.developerInstructions;
}
/** Runs best-effort before-compaction hooks for a harness session. */
async function runAgentHarnessBeforeCompactionHook(params) {
	const hookRunner = getGlobalHookRunner();
	if (!hookRunner?.hasHooks("before_compaction")) return;
	try {
		await hookRunner.runBeforeCompaction({
			messageCount: params.messages?.length ?? -1,
			...params.messages ? { messages: params.messages } : {},
			sessionFile: params.sessionFile
		}, buildAgentHookContext(params.ctx));
	} catch (error) {
		log$1.warn(`before_compaction hook failed: ${String(error)}`);
	}
}
/** Runs best-effort after-compaction hooks for a harness session. */
async function runAgentHarnessAfterCompactionHook(params) {
	const hookRunner = getGlobalHookRunner();
	if (!hookRunner?.hasHooks("after_compaction")) return;
	try {
		await hookRunner.runAfterCompaction({
			messageCount: params.messages?.length ?? -1,
			compactedCount: params.compactedCount,
			sessionFile: params.sessionFile
		}, buildAgentHookContext(params.ctx));
	} catch (error) {
		log$1.warn(`after_compaction hook failed: ${String(error)}`);
	}
}
//#endregion
//#region src/agents/harness/codex-app-server-extensions.ts
/**
* Codex app-server extension runner.
*
* Harness integration uses this to let registered extensions observe and adjust
* tool results before they are returned to the agent runtime.
*/
const log = createSubsystemLogger("agents/harness");
/** Creates a runner that applies registered Codex app-server tool-result extensions. */
function createCodexAppServerToolResultExtensionRunner(ctx, factories = listCodexAppServerExtensionFactories()) {
	const handlers = [];
	const initPromise = (async () => {
		for (const factory of factories) {
			const instance = getPluginValueInstance(factory);
			await factory({ on(event, handler) {
				if (event === "tool_result") {
					if (instance) instance.run(() => handlers.push(instance.wrap(handler)));
					else handlers.push(handler);
				}
			} });
		}
	})();
	return { async applyToolResultExtensions(event) {
		await initPromise;
		let current = event.result;
		for (const handler of handlers) try {
			const next = await handler({
				...event,
				result: current
			}, ctx);
			if (next?.result) current = next.result;
		} catch (error) {
			const detail = error instanceof Error ? error.message : String(error);
			log.warn(`[codex] tool_result extension failed for ${event.toolName}: ${detail}`);
		}
		return current;
	} };
}
//#endregion
//#region src/plugin-sdk/agent-harness-runtime.ts
/** Default truncation limit for user-facing tool progress output. */
const TOOL_PROGRESS_OUTPUT_MAX_CHARS = 8e3;
/** Core exec mode algebra for plugin-owned policy adapters. */
const execPolicy = Object.freeze({
	resolveExecModePolicy,
	minSecurity,
	maxAsk
});
/**
* Renders the Watched Sessions prompt block for plugin-owned harness prompts.
* Harness runtimes that assemble their own instruction layers (e.g. Codex)
* must surface the same watched-session facts as the embedded prompt, or the
* model keeps refusing cross-session questions on those runtimes (openclaw#114797).
*/
function buildWatchedSessionsHarnessContext(params) {
	const lines = buildWatchedSessionsPromptLines(prepareWatchedSessionsPrompt({
		enabled: true,
		...params
	}));
	return lines.length > 0 ? lines.join("\n").trimEnd() : void 0;
}
const agentHarnessAttemptTerminal = {
	merge: mergeAgentRunAttemptTerminal,
	normalize: normalizeAgentRunAttemptTerminal,
	project: projectAgentRunAttemptTerminal,
	setFailure: setAgentRunAttemptTerminalFailure
};
/** Bounded structured-input compilation and execution for native agent harnesses. */
const agentHarnessStructuredInput = Object.freeze({
	compileForm: compileStructuredInputForm,
	compileQuestions: compileStructuredInputQuestions,
	compileUrl: compileStructuredInputUrl,
	isRecord: isStructuredInputRecord,
	run: runStructuredInput,
	snapshot: snapshotStructuredInput
});
/**
* @deprecated Active-run queueing is an internal runtime concern. This legacy
* boolean API only reports immediate queue eligibility and cannot observe async
* runtime rejection; runtime-owned delivery paths should use acceptance-aware
* steering instead of public SDK queueing.
*/
function queueAgentHarnessMessage(sessionId, text, options) {
	return queueEmbeddedAgentMessageWithOutcome(sessionId, text, options).queued;
}
/** Detect prompt image references and load them through the same limits used by embedded runs. */
async function detectAndLoadAgentHarnessPromptImages(params) {
	const [{ resolveImageSanitizationLimits }, { detectAndLoadPromptImages }, { MAX_IMAGE_BYTES }] = await Promise.all([
		import("./image-sanitization-DmakoKjg.mjs"),
		import("./images-BlSlPWqL.mjs"),
		import("./media-core/constants.js")
	]);
	return detectAndLoadPromptImages({
		prompt: params.prompt,
		workspaceDir: params.workspaceDir,
		agentWorkspaceDir: params.agentWorkspaceDir,
		model: params.model,
		existingImages: params.existingImages,
		imageOrder: params.imageOrder,
		media: params.media,
		userTurnTranscriptRecorder: params.userTurnTranscriptRecorder,
		maxBytes: MAX_IMAGE_BYTES,
		maxDimensionPx: resolveImageSanitizationLimits(params.config).maxDimensionPx,
		workspaceOnly: params.workspaceOnly,
		localRoots: params.localRoots,
		sandbox: params.sandbox
	});
}
/** Load Codex bundle MCP thread config without forcing the heavy config module into SDK imports. */
async function loadCodexBundleMcpThreadConfig(params) {
	const { loadCodexBundleMcpThreadConfigCore: load } = await import("./codex-mcp-config-Bo1_cZt1.mjs");
	return load(params);
}
/** Lazily load the strict MCP proxy client with core-owned framing, startup, and shutdown. */
const mcpStdioRuntime = Object.freeze({ async load() {
	const { createMcpStdioClient } = await import("./mcp-stdio-client-CWJll6qe.mjs");
	return { createMcpStdioClient };
} });
/**
* Materialize an MCP App view for a tool executed by a harness-native MCP client.
* The harness supplies a runtime adapter so the view keeps using that exact connection.
*/
async function prepareHarnessNativeMcpAppPreview(params) {
	if (params.runtime.mcpAppsEnabled !== true) return;
	const { buildMcpAppCanvasPayload, fetchMcpAppView } = await import("./mcp-ui-resource-TbOQ0nOl.mjs");
	const view = await fetchMcpAppView({
		runtime: params.runtime,
		agentId: params.agentId,
		serverName: params.serverName,
		toolName: params.toolName,
		uiResourceUri: params.uiResourceUri,
		toolCallId: params.toolCallId,
		toolInput: params.toolInput,
		toolResult: params.toolResult,
		allowedAppToolNames: params.allowedAppToolNames
	});
	if (!view) return;
	return { mcpAppPreview: buildMcpAppCanvasPayload({
		...view,
		...params.runtime.sessionKey ? { originSessionKey: params.runtime.sessionKey } : {},
		...params.resultMetaState ? { resultMetaState: params.resultMetaState } : {}
	}) };
}
/**
* Materialize requester-scoped MCP tools for a harness run (dynamic tools, not
* harness-native MCP config). Lazy-loaded so harness plugins avoid the MCP manager graph.
*/
async function materializeRequesterScopedMcpToolsForHarnessRun(params) {
	if (!shouldLoadRequesterScopedMcpHarnessRuntime(params)) return;
	const { materializeRequesterScopedMcpToolsForHarnessRunCore: materialize } = await import("./agent-bundle-mcp-harness-BfuWUFt8.mjs");
	return materialize(params);
}
/** Infer compact display metadata for one tool invocation from its name and arguments. */
function inferToolMetaFromArgs(toolName, args, options) {
	return inferToolMetaFromArgsCore(toolName, args, options);
}
/**
* Prepare verbose tool output for user-facing progress messages.
*/
function formatToolProgressOutput(output, options) {
	const trimmed = output.replace(/\r\n/g, "\n").replace(/\r/g, "\n").trim();
	if (!trimmed) return;
	const redacted = redactToolDetail(trimmed);
	const maxChars = options?.maxChars ?? 8e3;
	if (redacted.length <= maxChars) return redacted;
	return `${truncateUtf16Safe(redacted, maxChars)}\n...(truncated)...`;
}
/**
* Classify terminal harness turns that completed without assistant output that
* should advance fallback. Deliberate silent replies such as NO_REPLY count as
* intentional output, while whitespace-only text remains fallback-eligible.
* This is intentionally SDK-level so plugin harness adapters such as Codex
* preserve the same OpenClaw-owned fallback signals as the built-in OpenClaw path
* without re-implementing terminal-result policy.
*/
function classifyAgentHarnessTerminalOutcome(params) {
	if (!params.turnCompleted || params.promptError !== void 0 && params.promptError !== null || hasVisibleAssistantText(params.assistantTexts)) return;
	if (params.planText?.trim()) return "planning-only";
	if (params.reasoningText?.trim()) return "reasoning-only";
	return "empty";
}
function hasVisibleAssistantText(assistantTexts) {
	return assistantTexts.some((text) => text.trim().length > 0);
}
const toolPolicy = Object.freeze({
	createToolPolicyMatcher,
	expandToolGroups
});
//#endregion
export { resolveSessionWriteLockOptions as S, resolveAgentHarnessBeforePromptBuildResult as _, classifyAgentHarnessTerminalOutcome as a, acquireSessionWriteLock as b, formatToolProgressOutput as c, materializeRequesterScopedMcpToolsForHarnessRun as d, mcpStdioRuntime as f, createCodexAppServerToolResultExtensionRunner as g, toolPolicy as h, buildWatchedSessionsHarnessContext as i, inferToolMetaFromArgs as l, queueAgentHarnessMessage as m, agentHarnessAttemptTerminal as n, detectAndLoadAgentHarnessPromptImages as o, prepareHarnessNativeMcpAppPreview as p, agentHarnessStructuredInput as r, execPolicy as s, TOOL_PROGRESS_OUTPUT_MAX_CHARS as t, loadCodexBundleMcpThreadConfig as u, runAgentHarnessAfterCompactionHook as v, resolveSessionWriteLockAcquireTimeoutMs as x, runAgentHarnessBeforeCompactionHook as y };
