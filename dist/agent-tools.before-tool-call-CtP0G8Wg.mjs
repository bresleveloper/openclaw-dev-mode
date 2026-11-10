import { a as addTimerTimeoutGraceMs } from "./number-coercion-CkhMiRw8.mjs";
import { t as pruneMapToMaxSize } from "./map-size-BlrH_CnE.mjs";
import { a as resolveGlobalSingleton } from "./global-singleton-DrXvEBww.mjs";
import { t as createDeferredCore } from "./deferred-D0La5CRk.mjs";
import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { t as isPlainObject } from "./plain-object-BFvGATnd.mjs";
import "./utils-gjJ-tD2q.mjs";
import { t as formatErrorMessage } from "./errors-DPfGDWk1.mjs";
import { n as registerListener, t as notifyListeners } from "./listeners-BogSNJ-R.mjs";
import { F as createDiagnosticToolExecutionLiveness, I as markToolExecutionLivenessDiagnosticEvent, O as freezeDiagnosticTraceContext, c as emitTrustedDiagnosticEventWithPrivateData, l as emitTrustedSecurityEvent, s as emitTrustedDiagnosticEvent, u as emitTrustedSkillUsedDiagnosticEvent, w as createChildDiagnosticTraceContext } from "./diagnostic-events-C91J-XX8.mjs";
import { t as createSubsystemLogger } from "./subsystem-mStysHHC.mjs";
import { a as createLazyRuntimeSurface } from "./lazy-runtime-CJrzFzqU.mjs";
import { g as readRuntimeConfig } from "./runtime-snapshot-BBYDJbw9.mjs";
import { l as getActivePluginRegistry } from "./runtime-DkPagH0y.mjs";
import { c as normalizeToolPolicyName } from "./tool-policy-shared-PsZCKeeN.mjs";
import "./tool-policy-14GRhbFd.mjs";
import { p as resolveAgentRunAbortLifecycleFields } from "./run-termination-Dwf1ksjA.mjs";
import { a as getCodeModeExecBeforeHookMetadataForToolKind, i as getCodeModeExecBeforeHookMetadata, l as normalizeCodeModeExecBeforeHookParams, o as isCodeModeControlTool, u as reconcileCodeModeExecBeforeHookParams } from "./code-mode-control-tools-ktsLOa_a.mjs";
import { d as withGatewayToolApprovalOwner, o as getGatewayToolCallerIdentity } from "./gateway-caller-context-Be176_GV.mjs";
import { r as getPluginToolMeta } from "./tool-metadata-CaNEdKPR.mjs";
import { _ as getBeforeToolCallDiagnosticOptions, a as copyBeforeToolCallWrapperMetadata, b as getBeforeToolCallSourceTool, c as getToolTerminalPresentation, g as clearBeforeToolCallWrappedMarker, h as bindBeforeToolCallMetadata, p as getChannelAgentToolMeta, v as getBeforeToolCallExecutionWrappers, y as getBeforeToolCallHookContext } from "./agent-tool-metadata-Dj6F-G24.mjs";
import { a as attachInternalToolExecutionPreparer, n as appendToolLoopWarning } from "./internal-hooks-CSjTREUl.mjs";
import { r as markToolExecutionNotStarted } from "./tool-effect-receipt-BHVAm8DM.mjs";
import { g as registerActiveEmbeddedRunHumanInputWaitForRun } from "./run-state-DZ4Vfz1J.mjs";
import "./config-B3oiWDlr.mjs";
import { a as createPluginToolMatcherScope, c as pluginToolMatcherCoversTool, s as normalizePluginToolMatcher } from "./hook-types-N0LQ0G64.mjs";
import { c as getGlobalHookRunnerRegistry, n as getGlobalHookRunner } from "./hook-runner-global-yjqy4fXI.mjs";
import { s as cloneHookIsolationValue } from "./hooks-CU2qx9-T.mjs";
import { r as getPluginSessionExtensionState } from "./host-hook-state-CBArMttW.mjs";
import { c as runWithBoundAgentToolSourceExecutionScope, i as copyAgentToolSourceExecutionGuard, n as captureAgentToolExecutionBudget } from "./agent-tool-source-execution-guard-iFSXyZre.mjs";
import { c as resolveToolResultFailureKind, i as protectNetworkToolExecutionError, r as isTrustedToolExecutionPreflightError, s as resolveToolExecutionErrorKind, t as formatToolExecutionErrorMessage } from "./tool-result-error-IpvGgAny.mjs";
import { t as isEmbeddedMode } from "./embedded-mode--Mk71zY-.mjs";
import { t as captureDiagnosticToolProgress } from "./diagnostic-run-activity-CaoGYSHp.mjs";
import { n as resolveDiagnosticModelContentCapturePolicy, t as cloneDiagnosticContentValue } from "./diagnostic-llm-content-P2SGagoP.mjs";
import { t as GatewayClientRequestError } from "./request-error-CnPCYq3A.mjs";
import { r as resolveSkillFileHost } from "./skill-file-host-d_CtoZp0.mjs";
import { n as resolveSkillReadPath, t as isWorkspaceSkillReadPath } from "./workspace-skill-read-path-Jvbv8xxW.mjs";
import { n as resolveSkillTelemetrySource, r as resolveSkillTelemetrySourceValue } from "./source-DbWOnpPI.mjs";
import { t as canonicalizePath } from "./paths-C-gBEpJw.mjs";
import "./client-CkNBSciY.mjs";
import { i as diagnosticHttpStatusCode, t as diagnosticErrorCategory } from "./diagnostic-error-metadata-Dt79CD6m.mjs";
import { n as recordGenericToolActionDecision, r as runWithGenericToolActionDecision, s as normalizeFileToolPathParam } from "./agent-tools.before-tool-call.decision-DlE5PesW.mjs";
import { t as sanitizeApprovalScope } from "./approval-scope-DTzlGETe.mjs";
import { n as MAX_PLUGIN_APPROVAL_TIMEOUT_MS, t as DEFAULT_PLUGIN_APPROVAL_TIMEOUT_MS } from "./plugin-approvals-CNVcvn9G.mjs";
import { t as resolveCanonicalPluginApprovalRequestAllowedDecisions } from "./plugin-approval-canonical-decisions-Dx5Fhv49.mjs";
import { i as resolveApprovalInitiatingSurfaceStateAsync, n as describeNativePluginApprovalClientSetup } from "./exec-approval-surface-DTl_IXDb.mjs";
import { t as callGatewayTool } from "./gateway-BC8tozR0.mjs";
import { n as extractResolvedApplyPatchTargetPaths } from "./apply-patch-paths-gKkcG5qn.mjs";
import { n as hashToolCall } from "./tool-loop-detection-Du9se3pv.mjs";
import { t as buildToolMutationState } from "./tool-mutation-BTW6eoAN.mjs";
import { randomUUID } from "node:crypto";
import os from "node:os";
import path from "node:path";
import { AsyncLocalStorage } from "node:async_hooks";
import { isDeepStrictEqual } from "node:util";
//#region src/plugins/hook-before-tool-call-result.ts
const PluginApprovalResolutions = {
	ALLOW_ONCE: "allow-once",
	ALLOW_ALWAYS: "allow-always",
	DENY: "deny",
	TIMEOUT: "timeout",
	CANCELLED: "cancelled"
};
//#endregion
//#region src/agents/agent-tools.before-tool-call.state.ts
/**
* Shared before_tool_call state for adjusted tool params.
* The adapter and wrapper both consult this map so later execution can use the
* normalized payload selected by hook processing.
*/
const adjustedParamsByToolCallId = /* @__PURE__ */ new Map();
const preExecutionBlockedToolCallIds = /* @__PURE__ */ new Set();
const structuredReplaySafeToolCallIds = /* @__PURE__ */ new Set();
const trackedToolCallIds = /* @__PURE__ */ new Map();
const batchAdmittedToolCallIds = /* @__PURE__ */ new Set();
function buildAdjustedParamsKey(params) {
	if (params.runId && params.runId.trim()) return `${params.runId}:${params.toolCallId}`;
	return params.toolCallId;
}
/** Consume and remove hook-adjusted params for a completed tool call. */
function consumeAdjustedParamsForToolCall(toolCallId, runId) {
	const key = buildAdjustedParamsKey({
		runId,
		toolCallId
	});
	const params = adjustedParamsByToolCallId.get(key);
	adjustedParamsByToolCallId.delete(key);
	return params;
}
/** Snapshot hook-adjusted params without consuming later outcome bookkeeping. */
function peekAdjustedParamsForToolCall(toolCallId, runId) {
	const key = buildAdjustedParamsKey({
		runId,
		toolCallId
	});
	const params = adjustedParamsByToolCallId.get(key);
	return params === void 0 ? void 0 : structuredClone(params);
}
/** Consume whether policy prevented the target tool from starting. */
function consumePreExecutionBlockedToolCall(toolCallId, runId) {
	return preExecutionBlockedToolCallIds.delete(buildAdjustedParamsKey({
		runId,
		toolCallId
	}));
}
/** Snapshot whether policy prevented execution without stealing cleanup from the tool owner. */
function peekPreExecutionBlockedToolCall(toolCallId, runId) {
	return preExecutionBlockedToolCallIds.has(buildAdjustedParamsKey({
		runId,
		toolCallId
	}));
}
/** Record active wrapper ownership so a racing timeout can inspect the boundary. */
function recordToolExecutionTracked(toolCallId, runId) {
	const key = buildAdjustedParamsKey({
		runId,
		toolCallId
	});
	if (!trackedToolCallIds.has(key)) trackedToolCallIds.set(key, false);
}
function recordToolExecutionStarted(toolCallId, runId) {
	trackedToolCallIds.set(buildAdjustedParamsKey({
		runId,
		toolCallId
	}), true);
}
/** Release execution-boundary evidence when the wrapped invocation settles. */
function clearTrackedToolExecution(toolCallId, runId) {
	trackedToolCallIds.delete(buildAdjustedParamsKey({
		runId,
		toolCallId
	}));
}
/**
* Consume exact in-flight execution state. Undefined means the wrapper already
* settled or the producer does not participate in OpenClaw boundary tracking.
*/
function consumeTrackedToolExecutionStarted(toolCallId, runId) {
	const key = buildAdjustedParamsKey({
		runId,
		toolCallId
	});
	const started = trackedToolCallIds.get(key);
	trackedToolCallIds.delete(key);
	return started;
}
function recordStructuredReplaySafeToolCall(toolCallId, runId) {
	structuredReplaySafeToolCallIds.add(buildAdjustedParamsKey({
		runId,
		toolCallId
	}));
}
function consumeStructuredReplaySafeToolCall(toolCallId, runId) {
	return structuredReplaySafeToolCallIds.delete(buildAdjustedParamsKey({
		runId,
		toolCallId
	}));
}
/** Mark a call whose loop policy was already admitted with its whole assistant batch. */
function recordBatchAdmittedToolCall(toolCallId, runId) {
	batchAdmittedToolCallIds.add(buildAdjustedParamsKey({
		runId,
		toolCallId
	}));
}
/** Consume whole-batch loop admission while leaving the remaining tool policies intact. */
function consumeBatchAdmittedToolCall(toolCallId, runId) {
	return batchAdmittedToolCallIds.delete(buildAdjustedParamsKey({
		runId,
		toolCallId
	}));
}
/** Release exact batch-admission markers for prepared calls suppressed by steering. */
function releaseBatchAdmittedToolCalls(toolCallIds, runId) {
	for (const toolCallId of toolCallIds) batchAdmittedToolCallIds.delete(buildAdjustedParamsKey({
		runId,
		toolCallId
	}));
}
/** Remove unused batch-admission markers when their embedded run ends. */
function clearBatchAdmittedToolCallsForRun(runId) {
	const prefix = `${runId}:`;
	for (const key of batchAdmittedToolCallIds) if (key.startsWith(prefix)) batchAdmittedToolCallIds.delete(key);
}
//#endregion
//#region src/skills/runtime/run-usage.ts
const MAX_TRACKED_SKILL_USAGE_RUNS = 1024;
const skillUsageByRun = /* @__PURE__ */ new Map();
/** Records the skills the foreground run demonstrably invoked or read. */
function recordRunSkillUsage(params) {
	const runId = params.runId;
	if (!runId) return;
	const usage = skillUsageByRun.get(runId) ?? /* @__PURE__ */ new Map();
	const record = {
		name: params.name,
		source: params.source,
		activation: params.activation,
		...params.skillFile ? { skillFile: params.skillFile } : {}
	};
	usage.set(`${record.source}\u0000${record.name}\u0000${record.activation}`, record);
	skillUsageByRun.set(runId, usage);
	pruneMapToMaxSize(skillUsageByRun, MAX_TRACKED_SKILL_USAGE_RUNS);
}
/** Transfers one completed run's usage receipt to its terminal side effects. */
function consumeRunSkillUsage(runId) {
	if (!runId) return [];
	const usage = skillUsageByRun.get(runId);
	skillUsageByRun.delete(runId);
	return usage ? [...usage.values()] : [];
}
//#endregion
//#region src/agents/agent-tools.before-tool-call.diagnostics.ts
/**
* Diagnostics, skill telemetry, terminal presentation, and loop outcomes for
* before_tool_call execution.
*/
const beforeToolCallLog = createSubsystemLogger("agents/tools");
function startToolExecutionLiveness(event, emitDiagnostics, signal) {
	const liveness = createDiagnosticToolExecutionLiveness(signal);
	if (emitDiagnostics) emitTrustedDiagnosticEvent(markToolExecutionLivenessDiagnosticEvent({
		type: "tool.execution.started",
		...event
	}, liveness.view));
	return liveness;
}
const log$1 = beforeToolCallLog;
const MAX_PENDING_TERMINAL_PRESENTATIONS = 1024;
const LOOP_WARNING_BUCKET_SIZE = 10;
const MAX_LOOP_WARNING_KEYS = 256;
const MAX_TERMINAL_PRESENTATION_CHARS = 2e3;
const pendingTerminalPresentationByToolCall = /* @__PURE__ */ new Map();
function prepareToolTerminalPresentation({ ctx, tool, toolParams, toolCallId, toolCallOrdinal }) {
	const toolName = tool.name;
	const observer = toolCallId ? ctx?.onToolOutcome : void 0;
	const formatter = getToolTerminalPresentation(getBeforeToolCallSourceTool(tool) ?? tool);
	if (!formatter && !observer) return;
	let project;
	if (formatter) {
		const formatterParams = observer ? structuredClone(toolParams) : toolParams;
		project = (result) => {
			try {
				const text = formatter(formatterParams, result)?.text.trim();
				return text ? truncateUtf16Safe(text, MAX_TERMINAL_PRESENTATION_CHARS) : void 0;
			} catch (err) {
				log$1.warn(`terminal tool presentation failed: tool=${toolName || "tool"} error=${String(err)}`);
				return;
			}
		};
	}
	return {
		observer,
		toolName,
		project,
		toolCallOrdinal
	};
}
function rememberPendingTerminalPresentation(prepared, runId, toolCallId) {
	if (!prepared?.observer || !toolCallId) return;
	const key = buildAdjustedParamsKey({
		runId,
		toolCallId
	});
	pendingTerminalPresentationByToolCall.set(key, prepared);
	pruneMapToMaxSize(pendingTerminalPresentationByToolCall, MAX_PENDING_TERMINAL_PRESENTATIONS);
}
/** Finalizes a trusted terminal summary after harness result middleware. */
function finalizeToolTerminalPresentation(params) {
	const key = buildAdjustedParamsKey({
		runId: params.runId,
		toolCallId: params.toolCallId
	});
	const pending = pendingTerminalPresentationByToolCall.get(key);
	pendingTerminalPresentationByToolCall.delete(key);
	const observer = pending?.observer ?? params.observer;
	if (!observer) return;
	const toolCallOrdinal = pending?.toolCallOrdinal ?? params.toolCallOrdinal;
	observer({
		toolName: pending?.toolName || params.toolName || "tool",
		argsHash: "",
		resultHash: "",
		...toolCallOrdinal !== void 0 ? { toolCallOrdinal } : {},
		terminalPresentation: params.isError ? void 0 : pending?.project?.(params.result),
		presentationOnly: true
	});
}
const loadBeforeToolCallRuntime = createLazyRuntimeSurface(() => import("./agent-tools.before-tool-call.runtime.js"), ({ beforeToolCallRuntime }) => beforeToolCallRuntime);
function unwrapErrorCause(err) {
	try {
		if (!(err instanceof Error)) return err;
		const cause = Object.getOwnPropertyDescriptor(err, "cause");
		if (cause && "value" in cause && cause.value !== void 0) return cause.value;
	} catch {
		return err;
	}
	return err;
}
function resolveToolErrorDiagnostic(err, signal, errorCategory) {
	const cause = unwrapErrorCause(err);
	const errorCode = diagnosticHttpStatusCode(cause);
	const abortFields = resolveAgentRunAbortLifecycleFields(signal);
	const terminalReason = !abortFields.aborted ? resolveToolExecutionErrorKind(cause) : abortFields.stopReason === "timeout" ? "timed_out" : "cancelled";
	return {
		errorCategory: terminalReason === "cancelled" ? "aborted" : errorCategory ?? diagnosticErrorCategory(cause),
		terminalReason,
		...errorCode ? { errorCode } : {}
	};
}
function resolveToolResultTerminalDiagnostic(result, durationMs) {
	const failureKind = resolveToolResultFailureKind(result);
	if (!failureKind) return {
		type: "tool.execution.completed",
		durationMs
	};
	if (failureKind === "blocked") return {
		type: "tool.execution.blocked",
		deniedReason: "tool_result_blocked",
		reason: "tool_result_blocked"
	};
	return {
		type: "tool.execution.error",
		durationMs,
		errorCategory: "tool_result_error",
		terminalReason: failureKind
	};
}
function resolveToolDiagnosticIdentity(tool) {
	const pluginMeta = getPluginToolMeta(tool);
	if (pluginMeta) return pluginMeta.pluginId === "bundle-mcp" ? {
		toolSource: "mcp",
		toolOwner: pluginMeta.pluginId
	} : {
		toolSource: "plugin",
		toolOwner: pluginMeta.pluginId
	};
	const channelMeta = getChannelAgentToolMeta(tool);
	if (channelMeta) return {
		toolSource: "channel",
		toolOwner: channelMeta.channelId
	};
	return { toolSource: "core" };
}
function canonicalSkillFile(value) {
	const skillFile = value?.trim();
	return skillFile && path.isAbsolute(skillFile) ? canonicalizePath(path.resolve(skillFile)) : void 0;
}
function resolvedSkillUsageMatch(params) {
	const skillFile = canonicalSkillFile(params.skill.filePath);
	return {
		skillName: params.skill.name.trim(),
		skillSource: resolveSkillTelemetrySource(params.skill),
		activation: params.activation,
		...skillFile ? { skillFile } : {}
	};
}
function findResolvedSkillUsageMatch(params) {
	const skillName = params.skillName.trim();
	const candidates = (params.snapshot?.resolvedSkills ?? []).filter((skill) => skill.name.trim() === skillName);
	const skill = candidates.find((candidate) => resolveSkillTelemetrySource(candidate) === params.skillSource) ?? (candidates.length === 1 ? candidates[0] : void 0);
	return skill ? resolvedSkillUsageMatch({
		activation: params.activation,
		skill
	}) : void 0;
}
function resolveRelativeToolPath(candidate, ctx) {
	const trimmed = candidate.trim();
	if (!trimmed) return;
	if (trimmed.startsWith("node://") || isWorkspaceSkillReadPath(trimmed)) return trimmed;
	if (trimmed === "~") return os.homedir();
	if (trimmed.startsWith("~/")) return path.resolve(os.homedir(), trimmed.slice(2));
	if (path.isAbsolute(trimmed)) return path.resolve(trimmed);
	const base = ctx?.workspaceDir ?? ctx?.cwd;
	return base ? path.resolve(base, trimmed) : void 0;
}
function readToolPathCandidate(params, ctx) {
	return isPlainObject(params) && typeof params.path === "string" ? resolveRelativeToolPath(normalizeFileToolPathParam(params.path), ctx) : void 0;
}
function findSkillInstructionMatch(snapshot, candidate) {
	const skill = snapshot.resolvedSkills?.findLast((entry) => {
		if (typeof entry.name !== "string" || !entry.name.trim()) return false;
		const filePath = typeof entry.filePath === "string" ? entry.filePath.trim() : "";
		const baseDir = typeof entry.baseDir === "string" ? entry.baseDir.trim() : "";
		if (filePath && resolveSkillReadPath(entry) === candidate) return true;
		if (resolveSkillFileHost(entry) === "workspace") return false;
		return filePath && (filePath.startsWith("node://") ? filePath === candidate : path.isAbsolute(filePath) && path.resolve(filePath) === candidate) || baseDir && path.isAbsolute(baseDir) && path.resolve(baseDir, "SKILL.md") === candidate;
	});
	return skill ? resolvedSkillUsageMatch({
		activation: "read",
		skill
	}) : void 0;
}
function findSkillUsageMatch(params) {
	const command = params.ctx?.skillCommand;
	if (command) {
		const commandToolName = normalizeToolPolicyName(command.toolName ?? params.toolName);
		if (!commandToolName || commandToolName === params.toolName) {
			const skillSource = resolveSkillTelemetrySourceValue(command.skillSource);
			const snapshotMatch = findResolvedSkillUsageMatch({
				activation: "command",
				skillName: command.skillName,
				skillSource,
				snapshot: params.ctx?.skillsSnapshot
			});
			const skillFile = canonicalSkillFile(command.skillFile) ?? snapshotMatch?.skillFile;
			return {
				skillName: command.skillName,
				skillSource,
				activation: "command",
				...skillFile ? { skillFile } : {}
			};
		}
	}
	if (params.toolName === "skills_read") {
		const name = isPlainObject(params.toolParams) ? params.toolParams.name : void 0;
		if (typeof name !== "string") return;
		const snapshot = params.ctx?.skillsSnapshot;
		const skill = (snapshot?.discoverySkills ?? snapshot?.resolvedSkills)?.find((entry) => entry.name === name.trim() && !entry.disableModelInvocation);
		if (!skill) return;
		const usage = params.ctx?.skillUsagePaths?.find((entry) => entry.skillName === skill.name && entry.readPath === skill.filePath);
		return usage ? {
			skillFile: usage.skillFile,
			skillName: usage.skillName,
			skillSource: usage.skillSource,
			activation: "read"
		} : resolvedSkillUsageMatch({
			activation: "read",
			skill
		});
	}
	if (params.toolName !== "read") return;
	const candidate = readToolPathCandidate(params.toolParams, params.ctx);
	if (!candidate) return;
	if (params.ctx?.skillsSnapshot?.resolvedSkills?.length) return findSkillInstructionMatch(params.ctx.skillsSnapshot, candidate);
	const match = params.ctx?.skillUsagePaths?.findLast((entry) => path.resolve(entry.readPath) === candidate);
	return match ? {
		skillFile: match.skillFile,
		skillName: match.skillName,
		skillSource: match.skillSource,
		activation: "read"
	} : void 0;
}
/**
* Records one demonstrated skill use: this run's usage receipt (review trigger) and the
* trusted skill.used event (skill_usage rows, unused-skill archive clock).
*/
function recordSkillUsed(params) {
	recordRunSkillUsage({
		runId: params.ctx?.runId,
		name: params.match.skillName,
		source: params.match.skillSource,
		activation: params.match.activation,
		...params.match.skillFile ? { skillFile: params.match.skillFile } : {}
	});
	const trace = params.ctx?.trace ? freezeDiagnosticTraceContext(createChildDiagnosticTraceContext(params.ctx.trace)) : void 0;
	emitTrustedSkillUsedDiagnosticEvent({
		type: "skill.used",
		...params.ctx?.runId && { runId: params.ctx.runId },
		...params.ctx?.sessionKey && { sessionKey: params.ctx.sessionKey },
		...params.ctx?.sessionId && { sessionId: params.ctx.sessionId },
		...params.ctx?.agentId && { agentId: params.ctx.agentId },
		...trace && { trace },
		skillName: params.match.skillName,
		skillSource: params.match.skillSource,
		activation: params.match.activation,
		toolName: params.toolName,
		...params.toolCallId && { toolCallId: params.toolCallId }
	}, params.match.skillFile ? { skillUsage: { skillFile: params.match.skillFile } } : void 0);
}
function emitToolBlockedSecurityEvent(params) {
	const policyId = params.deniedReason === "tool-loop" ? "tool-loop-detection" : params.deniedReason === "plugin-approval" ? "plugin-tool-approval" : "plugin-before-tool-call";
	emitTrustedSecurityEvent({
		category: "tool",
		action: "tool.execution.blocked",
		outcome: "denied",
		severity: "medium",
		reason: params.deniedReason,
		...params.trace ? { trace: params.trace } : {},
		actor: { kind: "agent" },
		target: {
			kind: "tool",
			name: params.toolName,
			...params.toolIdentity.toolOwner ? { owner: params.toolIdentity.toolOwner } : {}
		},
		policy: {
			id: policyId,
			decision: "deny",
			reason: params.deniedReason
		},
		control: {
			id: policyId === "plugin-before-tool-call" ? "before-tool-call" : policyId,
			family: policyId === "tool-loop-detection" ? "authorization" : "approval"
		},
		attributes: {
			tool_source: params.toolIdentity.toolSource,
			...params.paramsSummary ? { params_kind: params.paramsSummary.kind } : {}
		}
	});
}
function buildToolContentPrivateData(policy, args) {
	if (!policy.toolInputs && !policy.toolOutputs) return;
	const toolContent = {};
	if (policy.toolInputs) toolContent.toolInput = cloneDiagnosticContentValue(args.input);
	if (args.includeOutput && policy.toolOutputs) toolContent.toolOutput = cloneDiagnosticContentValue(args.output);
	return Object.keys(toolContent).length > 0 ? { toolContent } : void 0;
}
function summarizeToolParams(params) {
	if (params === null) return { kind: "null" };
	if (params === void 0) return { kind: "undefined" };
	if (Array.isArray(params)) return {
		kind: "array",
		length: params.length
	};
	if (typeof params === "object") return { kind: "object" };
	if (typeof params === "string") return {
		kind: "string",
		length: params.length
	};
	if (typeof params === "number") return { kind: "number" };
	if (typeof params === "boolean") return { kind: "boolean" };
	return { kind: "other" };
}
function shouldEmitLoopWarning(state, warningKey, count) {
	if (!state.toolLoopWarningBuckets) state.toolLoopWarningBuckets = /* @__PURE__ */ new Map();
	const bucket = Math.floor(count / LOOP_WARNING_BUCKET_SIZE);
	if (bucket <= (state.toolLoopWarningBuckets.get(warningKey) ?? 0)) return false;
	state.toolLoopWarningBuckets.set(warningKey, bucket);
	pruneMapToMaxSize(state.toolLoopWarningBuckets, MAX_LOOP_WARNING_KEYS);
	return true;
}
/** Reconcile loop liveness with the final post-policy arguments before execution. */
async function reconcileLoopCallExecutionParams(args) {
	if (!args.ctx?.sessionKey && !args.ctx?.sessionId || args.ctx.loopDetection?.enabled !== true) return;
	try {
		const { getDiagnosticSessionState, markDiagnosticArgumentChurnObservation, reconcileToolCallExecutionParams, resolveToolLoopWarningThreshold } = await loadBeforeToolCallRuntime();
		const churn = reconcileToolCallExecutionParams(getDiagnosticSessionState({
			sessionKey: args.ctx.sessionKey,
			sessionId: args.ctx.sessionId
		}), {
			toolName: args.toolName,
			toolParams: args.toolParams,
			toolCallId: args.toolCallId,
			runId: args.ctx.runId,
			warningThreshold: resolveToolLoopWarningThreshold()
		});
		markDiagnosticArgumentChurnObservation({
			sessionKey: args.ctx.sessionKey,
			sessionId: args.ctx.sessionId,
			runId: args.ctx.runId,
			active: churn.active
		});
	} catch (err) {
		log$1.warn(`tool loop execution-param reconciliation failed: tool=${args.toolName} error=${String(err)}`);
	}
}
async function recordLoopOutcome(args) {
	if (!args.ctx?.sessionKey && !args.ctx?.sessionId) return;
	let recordedOutcome;
	try {
		const { getArgumentChurnNoProgressStreak, getDiagnosticSessionState, markDiagnosticArgumentChurnObservation, recordToolCallOutcome } = await loadBeforeToolCallRuntime();
		const sessionState = getDiagnosticSessionState({
			sessionKey: args.ctx.sessionKey,
			sessionId: args.ctx.sessionId
		});
		const record = recordToolCallOutcome(sessionState, {
			toolName: args.toolName,
			toolParams: args.toolParams,
			toolCallId: args.toolCallId,
			result: args.result,
			error: args.error,
			...args.ctx.runId && { runId: args.ctx.runId }
		});
		const churnContinues = record !== void 0 && getArgumentChurnNoProgressStreak((sessionState.toolCallHistory ?? []).filter((call) => call.runId === record.runId), record.toolName, record.argsHash).count > 0;
		markDiagnosticArgumentChurnObservation({
			sessionKey: args.ctx.sessionKey,
			sessionId: args.ctx.sessionId,
			runId: args.ctx.runId,
			active: churnContinues,
			existingOnly: true
		});
		if (record?.resultHash && args.ctx.onToolOutcome) recordedOutcome = {
			toolName: record.toolName,
			argsHash: record.argsHash,
			resultHash: record.resultHash,
			...args.resultContentSource ? { resultContentSource: args.resultContentSource } : {},
			...args.toolCallOrdinal !== void 0 ? { toolCallOrdinal: args.toolCallOrdinal } : {},
			...args.terminalPresentation ? { terminalPresentation: args.terminalPresentation } : {}
		};
	} catch (err) {
		log$1.warn(`tool loop outcome tracking failed: tool=${args.toolName} error=${String(err)}`);
	}
	if (recordedOutcome) args.ctx.onToolOutcome?.(recordedOutcome);
}
//#endregion
//#region src/infra/embedded-plugin-approval-broker.ts
let activeBroker = null;
var EmbeddedPluginApprovalBroker = class {
	constructor() {
		this.pending = /* @__PURE__ */ new Map();
		this.listeners = /* @__PURE__ */ new Set();
	}
	subscribe(listener) {
		return registerListener(this.listeners, listener);
	}
	listPending() {
		return [...this.pending.values()].map((entry) => entry.record);
	}
	async request(params) {
		if (params.signal?.aborted) throw params.signal.reason ?? /* @__PURE__ */ new Error("approval request aborted");
		const id = `plugin:${randomUUID()}`;
		const createdAtMs = Date.now();
		const record = {
			approvalKind: "plugin",
			id,
			request: params.request,
			createdAtMs,
			expiresAtMs: createdAtMs + params.timeoutMs
		};
		const { promise: decision, resolve, reject } = createDeferredCore();
		const timer = setTimeout(() => {
			const entry = this.pending.get(id);
			if (!entry) return;
			this.pending.delete(id);
			entry.resolve(null);
			notifyListeners(this.listeners, {
				event: "plugin.approval.removed",
				payload: { id }
			});
		}, params.timeoutMs);
		timer.unref?.();
		this.pending.set(id, {
			record,
			timer,
			resolve,
			reject
		});
		const abort = () => {
			const entry = this.pending.get(id);
			if (!entry) return;
			clearTimeout(entry.timer);
			this.pending.delete(id);
			entry.reject(params.signal?.reason ?? /* @__PURE__ */ new Error("approval request aborted"));
			notifyListeners(this.listeners, {
				event: "plugin.approval.removed",
				payload: { id }
			});
		};
		params.signal?.addEventListener("abort", abort, { once: true });
		notifyListeners(this.listeners, {
			event: "plugin.approval.requested",
			payload: record
		});
		try {
			return {
				id,
				decision: await decision
			};
		} finally {
			params.signal?.removeEventListener("abort", abort);
		}
	}
	resolve(id, decision) {
		const entry = this.pending.get(id);
		if (!entry || !resolveCanonicalPluginApprovalRequestAllowedDecisions(entry.record.request).includes(decision)) return false;
		clearTimeout(entry.timer);
		this.pending.delete(id);
		entry.resolve(decision);
		notifyListeners(this.listeners, {
			event: "plugin.approval.resolved",
			payload: {
				id,
				decision,
				resolvedBy: "tui:embedded",
				ts: Date.now(),
				request: entry.record.request
			}
		});
		return true;
	}
	stop(reason = /* @__PURE__ */ new Error("embedded plugin approval broker stopped")) {
		for (const [id, entry] of this.pending) {
			clearTimeout(entry.timer);
			entry.reject(reason);
			notifyListeners(this.listeners, {
				event: "plugin.approval.removed",
				payload: { id }
			});
		}
		this.pending.clear();
		this.listeners.clear();
	}
};
function setEmbeddedPluginApprovalBroker(broker) {
	activeBroker = broker;
}
function clearEmbeddedPluginApprovalBroker(broker) {
	if (activeBroker === broker) activeBroker = null;
}
function getEmbeddedPluginApprovalBroker() {
	return activeBroker;
}
//#endregion
//#region src/agents/agent-tools.before-tool-call.approval.ts
/**
* Approval transport for before_tool_call policy decisions.
* Owns request/wait routing, embedded approval bridging, deferred approvals,
* timeout classification, and owner-provided approval outcomes.
*/
const log = createSubsystemLogger("agents/tools");
function pluginApprovalFailure(params, reason, disposition, deniedReason = "plugin-approval") {
	return {
		blocked: true,
		kind: "failure",
		disposition,
		deniedReason,
		reason,
		params
	};
}
function pluginApprovalDeniedOutcome(baseParams) {
	return pluginApprovalFailure(baseParams, [
		"Denied by user. The tool call did not run.",
		"This denial is final: the approval request is closed. Do not mention /approve or any other approval command to the user.",
		"Do not run the tool call again or ask the user to approve it again.",
		"If the user still wants the action, explain that a new tool call will trigger a fresh approval request."
	].join("\n"), "blocked");
}
function resolvePluginToolApprovalTimeoutMs(approval) {
	if (typeof approval.timeoutMs !== "number" || !Number.isFinite(approval.timeoutMs) || approval.timeoutMs <= 0) return DEFAULT_PLUGIN_APPROVAL_TIMEOUT_MS;
	return Math.min(Math.floor(approval.timeoutMs), MAX_PLUGIN_APPROVAL_TIMEOUT_MS);
}
function mergeParamsWithApprovalOverrides(originalParams, approvalParams) {
	if (!isPlainObject(approvalParams)) return originalParams;
	if (!isPlainObject(originalParams)) return approvalParams;
	return Object.defineProperties({}, {
		...Object.getOwnPropertyDescriptors(originalParams),
		...Object.getOwnPropertyDescriptors(approvalParams)
	});
}
function notifyPluginApprovalResolution(approval, resolution) {
	const onResolution = approval.onResolution;
	if (typeof onResolution !== "function") return;
	try {
		Promise.resolve(onResolution(resolution)).catch((err) => {
			log.warn(`plugin onResolution callback failed: ${String(err)}`);
		});
	} catch (err) {
		log.warn(`plugin onResolution callback failed: ${String(err)}`);
	}
}
function resolvePermittedPluginApprovalResolution(decision, allowedDecisions) {
	if ((decision === PluginApprovalResolutions.ALLOW_ONCE || decision === PluginApprovalResolutions.ALLOW_ALWAYS || decision === PluginApprovalResolutions.DENY) && allowedDecisions.includes(decision)) return decision;
	return PluginApprovalResolutions.TIMEOUT;
}
async function buildPluginApprovalFailureReason(params) {
	const turnSourceChannel = params.ctx?.turnSourceChannel;
	if (!turnSourceChannel?.trim()) return params.fallbackReason;
	const nativePluginSurface = await resolveApprovalInitiatingSurfaceStateAsync({
		channel: turnSourceChannel,
		accountId: params.ctx?.turnSourceAccountId,
		cfg: params.ctx?.config,
		approvalKind: "plugin"
	});
	const setupText = describeNativePluginApprovalClientSetup({
		channel: nativePluginSurface.channel,
		channelLabel: nativePluginSurface.channelLabel,
		accountId: nativePluginSurface.accountId
	});
	if (!setupText) return params.fallbackReason;
	if (params.noRoute) return `${params.fallbackReason}\n\n${setupText}`;
	if ((nativePluginSurface.kind === "disabled" ? nativePluginSurface : await resolveApprovalInitiatingSurfaceStateAsync({
		channel: turnSourceChannel,
		accountId: params.ctx?.turnSourceAccountId,
		cfg: params.ctx?.config,
		approvalKind: "exec"
	})).kind !== "disabled") return params.fallbackReason;
	return `${params.fallbackReason}\n\n${setupText}`;
}
async function resolveUnavailablePluginApprovalSurfaceReason(ctx) {
	const trigger = ctx?.trigger?.trim();
	if (!trigger) return;
	const initiatingSurface = await resolveApprovalInitiatingSurfaceStateAsync({
		channel: ctx?.turnSourceChannel,
		accountId: ctx?.turnSourceAccountId,
		cfg: ctx?.config,
		approvalKind: "plugin"
	});
	if (trigger !== "user") return `Plugin approval unavailable: ${trigger} runs have no approval-capable initiating surface.`;
	if (!ctx?.turnSourceChannel?.trim() && !ctx?.approvalReviewerDeviceId?.trim()) return "Plugin approval unavailable: non-interactive CLI runs have no approval-capable initiating surface.";
	if (initiatingSurface.kind === "disabled") return `Plugin approval unavailable: the ${initiatingSurface.channelLabel} initiating surface is disabled.`;
	if (initiatingSurface.kind === "unsupported") return `Plugin approval unavailable: the ${initiatingSurface.channelLabel} initiating surface does not support approvals.`;
}
/**
* A pending plugin approval is the owning run's human-input wait, like an agent
* question: stuck-session recovery must not abort the turn while the approver
* can still answer. The approval's own timeout plus the gateway grace bounds it.
*/
async function requestPluginToolApproval(params) {
	const deadlineAtMs = Date.now() + (addTimerTimeoutGraceMs(resolvePluginToolApprovalTimeoutMs(params.approval), 1e4) ?? 13e4);
	let pending = true;
	let resolved = false;
	const release = params.ctx?.runId ? registerActiveEmbeddedRunHumanInputWaitForRun(params.ctx.runId, () => pending && params.signal?.aborted !== true && Date.now() < deadlineAtMs) : void 0;
	try {
		return await requestPluginToolApprovalDecision(params, () => {
			resolved = true;
		});
	} finally {
		pending = false;
		release?.(resolved);
	}
}
async function requestPluginToolApprovalDecision(params, markHumanDecision) {
	const approval = params.approval;
	const policySubject = params.ctx?.toolOwnerPluginId ? {
		pluginKey: params.ctx.toolOwnerPluginId,
		tool: params.toolName
	} : void 0;
	const timeoutMs = resolvePluginToolApprovalTimeoutMs(approval);
	const gatewayTimeoutMs = addTimerTimeoutGraceMs(timeoutMs, 1e4) ?? 13e4;
	const allowedDecisions = resolveCanonicalPluginApprovalRequestAllowedDecisions(approval);
	const resolveDecision = (decision) => {
		const resolution = resolvePermittedPluginApprovalResolution(decision, allowedDecisions);
		notifyPluginApprovalResolution(approval, resolution);
		if (resolution === PluginApprovalResolutions.ALLOW_ONCE || resolution === PluginApprovalResolutions.ALLOW_ALWAYS || resolution === PluginApprovalResolutions.DENY) markHumanDecision();
		if (resolution === PluginApprovalResolutions.ALLOW_ONCE || resolution === PluginApprovalResolutions.ALLOW_ALWAYS) return {
			blocked: false,
			params: mergeParamsWithApprovalOverrides(params.baseParams, params.overrideParams),
			approvalResolution: resolution
		};
		return resolution === PluginApprovalResolutions.DENY ? pluginApprovalDeniedOutcome(params.baseParams) : void 0;
	};
	let gatewayApprovalPhase = "none";
	try {
		const requestIdentity = {
			toolName: params.toolName,
			toolCallId: params.toolCallId,
			...policySubject ? { policySubject } : {},
			agentId: params.ctx?.agentId,
			sessionKey: params.ctx?.sessionKey,
			turnSourceChannel: params.ctx?.turnSourceChannel,
			turnSourceTo: params.ctx?.turnSourceTo,
			turnSourceAccountId: params.ctx?.turnSourceAccountId,
			turnSourceThreadId: params.ctx?.turnSourceThreadId
		};
		const embeddedApprovalBroker = isEmbeddedMode() ? getEmbeddedPluginApprovalBroker() : null;
		if (embeddedApprovalBroker) {
			const outcome = resolveDecision((await embeddedApprovalBroker.request({
				request: {
					pluginId: approval.pluginId,
					title: approval.title,
					description: approval.description,
					...approval.scope ? { scope: sanitizeApprovalScope(approval.scope) } : {},
					severity: approval.severity,
					allowedDecisions: approval.allowedDecisions,
					...requestIdentity
				},
				timeoutMs,
				signal: params.signal
			})).decision);
			if (outcome) return outcome;
			return approval.timeoutReason ? {
				blocked: true,
				kind: "veto",
				deniedReason: "plugin-approval",
				reason: approval.timeoutReason,
				params: params.baseParams
			} : pluginApprovalFailure(params.baseParams, "Approval timed out", "timed_out");
		}
		const unavailableSurfaceReason = await resolveUnavailablePluginApprovalSurfaceReason(params.ctx);
		if (unavailableSurfaceReason) {
			notifyPluginApprovalResolution(approval, PluginApprovalResolutions.CANCELLED);
			return pluginApprovalFailure(params.baseParams, unavailableSurfaceReason, "failed", "plugin-approval-unavailable");
		}
		gatewayApprovalPhase = "request";
		const requestResult = await withGatewayToolApprovalOwner(approval.pluginId, async () => await callGatewayTool("plugin.approval.request", { timeoutMs: gatewayTimeoutMs }, {
			title: approval.title,
			description: approval.description,
			...approval.scope ? { scope: approval.scope } : {},
			severity: approval.severity,
			allowedDecisions: approval.allowedDecisions,
			...requestIdentity,
			...params.ctx?.approvalReviewerDeviceId ? { approvalReviewerDeviceIds: [params.ctx.approvalReviewerDeviceId] } : {},
			timeoutMs,
			twoPhase: true
		}, {
			expectFinal: false,
			signal: params.signal
		}));
		gatewayApprovalPhase = "none";
		const id = requestResult?.id;
		if (!id) {
			notifyPluginApprovalResolution(approval, PluginApprovalResolutions.CANCELLED);
			return pluginApprovalFailure(params.baseParams, approval.description || "Plugin approval request failed", "failed");
		}
		const hasImmediateDecision = Object.hasOwn(requestResult ?? {}, "decision");
		let decision;
		if (hasImmediateDecision) {
			decision = requestResult?.decision;
			if (decision === null) {
				notifyPluginApprovalResolution(approval, PluginApprovalResolutions.CANCELLED);
				return pluginApprovalFailure(params.baseParams, await buildPluginApprovalFailureReason({
					fallbackReason: "Plugin approval unavailable (no approval route)",
					ctx: params.ctx,
					noRoute: true
				}), "failed");
			}
		} else {
			gatewayApprovalPhase = "wait";
			const waitResult = await callGatewayTool("plugin.approval.waitDecision", { timeoutMs: gatewayTimeoutMs }, { id }, { signal: params.signal });
			decision = waitResult?.id === id ? waitResult.decision : void 0;
		}
		const outcome = resolveDecision(decision);
		if (outcome) return outcome;
		const fallbackTimeoutReason = approval.timeoutReason ?? "Approval timed out";
		const timeoutReason = requestResult?.deliveryRoute === "turn-source" ? await buildPluginApprovalFailureReason({
			fallbackReason: fallbackTimeoutReason,
			ctx: params.ctx
		}) : fallbackTimeoutReason;
		return {
			blocked: true,
			kind: approval.timeoutReason ? "veto" : "failure",
			disposition: "timed_out",
			deniedReason: "plugin-approval",
			reason: timeoutReason,
			params: params.baseParams
		};
	} catch (err) {
		notifyPluginApprovalResolution(approval, PluginApprovalResolutions.CANCELLED);
		const signal = params.signal;
		if (signal?.aborted === true && (err === signal.reason || err instanceof Error && (err.name === "AbortError" || "cause" in err && err.cause === signal.reason))) {
			log.warn(`plugin approval wait cancelled by run abort: ${String(err)}`);
			return pluginApprovalFailure(params.baseParams, "Approval cancelled (run aborted)", resolveToolErrorDiagnostic(err, signal).terminalReason);
		}
		const invalidRequest = err instanceof GatewayClientRequestError && err.gatewayCode === "INVALID_REQUEST";
		const reason = invalidRequest && gatewayApprovalPhase === "request" ? `Plugin approval request rejected: ${formatErrorMessage(err)}` : invalidRequest && gatewayApprovalPhase === "wait" ? `Plugin approval no longer available: ${formatErrorMessage(err)}` : "Plugin approval required (gateway unavailable)";
		log.warn(`plugin approval gateway request failed; blocking tool call: ${String(err)}`);
		return pluginApprovalFailure(params.baseParams, reason, resolveToolErrorDiagnostic(err, signal).terminalReason);
	}
}
/** Resolve a deferred plugin approval request at the later execution boundary. */
async function requestDeferredPluginToolApproval(params) {
	const deferred = params.deferredApproval;
	return requestPluginToolApproval({
		approval: deferred.approval,
		toolName: deferred.toolName,
		...deferred.toolCallId ? { toolCallId: deferred.toolCallId } : {},
		...deferred.ctx ? { ctx: deferred.ctx } : {},
		signal: params.signal,
		baseParams: deferred.baseParams,
		overrideParams: deferred.overrideParams
	});
}
function cancelDeferredPluginToolApproval(deferredApproval) {
	notifyPluginApprovalResolution(deferredApproval.approval, PluginApprovalResolutions.CANCELLED);
}
async function resolveBeforeToolCallApprovalOutcome(params) {
	const approval = params.result?.requireApproval;
	if (!approval) return;
	const baseParamsSnapshot = cloneHookIsolationValue("before_tool_call", params.baseParams);
	const overrideParamsSnapshot = params.result?.params === void 0 ? void 0 : cloneHookIsolationValue("before_tool_call", params.result.params);
	const createDeferredApproval = () => ({
		approval,
		toolName: params.toolName,
		...params.toolCallId ? { toolCallId: params.toolCallId } : {},
		...params.ctx ? { ctx: params.ctx } : {},
		baseParams: baseParamsSnapshot,
		overrideParams: overrideParamsSnapshot
	});
	if (params.approvalMode === "defer") return {
		blocked: false,
		params: cloneHookIsolationValue("before_tool_call", baseParamsSnapshot),
		deferredApproval: createDeferredApproval()
	};
	if (params.approvalMode === "report") {
		notifyPluginApprovalResolution(approval, PluginApprovalResolutions.CANCELLED);
		return pluginApprovalFailure(baseParamsSnapshot, approval.description || approval.title || "Plugin approval required", "blocked");
	}
	if (params.approvalMode === "deny") {
		notifyPluginApprovalResolution(approval, PluginApprovalResolutions.DENY);
		return {
			blocked: true,
			kind: "veto",
			deniedReason: "plugin-approval",
			reason: "approval_required",
			params: baseParamsSnapshot
		};
	}
	return await requestPluginToolApproval({
		...createDeferredApproval(),
		signal: params.signal
	});
}
//#endregion
//#region src/plugins/host-tool-param-parsers.ts
/**
* Derive host-owned metadata for a tool call. Returns an empty object when no
* parser is registered for the tool, which lets callers spread the result
* unconditionally without a nullability check.
*/
async function deriveToolParams(toolName, params, options) {
	if (toolName !== "apply_patch") return {};
	const paths = await extractResolvedApplyPatchTargetPaths(params, options);
	return paths.length > 0 ? { derivedPaths: Object.freeze([...paths]) } : {};
}
//#endregion
//#region src/plugins/trusted-tool-policy.ts
/** True when the supplied or active plugin registry has trusted tool policies. */
function hasTrustedToolPolicies(registry = getActivePluginRegistry()) {
	return copyTrustedPolicyRegistrations(registry).length > 0;
}
function unreadableTrustedPolicyRegistration() {
	return {
		pluginId: "unknown-plugin",
		source: "runtime",
		get policy() {
			throw new Error("trusted policy registration is unreadable");
		}
	};
}
function copyTrustedPolicyRegistrations(registry) {
	try {
		const policies = registry?.trustedToolPolicies;
		if (!policies) return [];
		return Array.isArray(policies) ? policies.map((policy) => policy) : [unreadableTrustedPolicyRegistration()];
	} catch {
		return [unreadableTrustedPolicyRegistration()];
	}
}
function readTrustedPolicyPluginString(registration, key) {
	try {
		const value = registration[key];
		return typeof value === "string" && value.trim() ? value.trim() : void 0;
	} catch {
		return;
	}
}
function trustedPolicyDiagnosticPluginId(registration) {
	return readTrustedPolicyPluginString(registration, "pluginId") ?? "unknown-plugin";
}
function readTrustedPolicy(registration) {
	try {
		const policy = registration.policy;
		return policy && typeof policy.evaluate === "function" ? policy : void 0;
	} catch {
		return;
	}
}
function readTrustedPolicyMatcher(policy) {
	try {
		return normalizePluginToolMatcher(policy.matcher);
	} catch {
		return null;
	}
}
function getTrustedToolPolicyMatcherScope(registry = getActivePluginRegistry()) {
	return createPluginToolMatcherScope(copyTrustedPolicyRegistrations(registry).map((registration) => {
		const policy = readTrustedPolicy(registration);
		if (!policy) return;
		return readTrustedPolicyMatcher(policy) ?? void 0;
	}));
}
function readTrustedPolicyId(registration) {
	const fallback = trustedPolicyDiagnosticPluginId(registration);
	const policy = readTrustedPolicy(registration);
	if (!policy) return fallback;
	try {
		const id = policy.id;
		return typeof id === "string" && id.trim() ? id.trim() : fallback;
	} catch {
		return fallback;
	}
}
function trustedPolicyDefaultBlockReason(registration) {
	return `blocked by ${readTrustedPolicyId(registration)}`;
}
function trustedPolicyFailureResult(registration, detail) {
	return {
		block: true,
		blockReason: `${trustedPolicyDefaultBlockReason(registration)}: ${detail}`
	};
}
/** Lists trusted tool policies for status and diagnostics. */
function getTrustedToolPolicyDiagnosticEntries(registry = getActivePluginRegistry()) {
	return copyTrustedPolicyRegistrations(registry).map((registration) => {
		const entry = {
			id: readTrustedPolicyId(registration),
			pluginId: trustedPolicyDiagnosticPluginId(registration)
		};
		const pluginName = readTrustedPolicyPluginString(registration, "pluginName");
		if (pluginName) entry.pluginName = pluginName;
		return entry;
	});
}
function normalizeDerivedEventFields(value) {
	return Array.isArray(value?.derivedPaths) ? { derivedPaths: Object.freeze([...value.derivedPaths]) } : {};
}
function normalizeToolIdentity(value) {
	return {
		...value?.toolKind && { toolKind: value.toolKind },
		...value?.toolInputKind && { toolInputKind: value.toolInputKind }
	};
}
/** Runs trusted tool policies before a tool call and returns the first terminal decision. */
async function runTrustedToolPolicies(event, ctx, options) {
	const policies = copyTrustedPolicyRegistrations(options?.registry ?? getActivePluginRegistry());
	let adjustedParams = event.params;
	let hasAdjustedParams = false;
	let approval;
	const sessionExtensionStateCache = /* @__PURE__ */ new Map();
	let resolvedSessionConfig = options?.config;
	let didResolveSessionConfig = Boolean(options?.config);
	const resolveSessionConfig = () => {
		if (!didResolveSessionConfig) {
			didResolveSessionConfig = true;
			try {
				resolvedSessionConfig = readRuntimeConfig();
			} catch {
				resolvedSessionConfig = void 0;
			}
		}
		return resolvedSessionConfig;
	};
	const { derivedPaths, toolKind, toolInputKind, ...eventWithoutDerivedPaths } = event;
	const { toolKind: ctxToolKind, toolInputKind: ctxToolInputKind, ...ctxWithoutToolIdentity } = ctx;
	let currentDerivedEvent = normalizeDerivedEventFields({ derivedPaths });
	let currentEventToolIdentity = normalizeToolIdentity({
		toolKind,
		toolInputKind
	});
	let currentContextToolIdentity = normalizeToolIdentity({
		toolKind: ctxToolKind,
		toolInputKind: ctxToolInputKind
	});
	const buildEvent = (params) => ({
		...eventWithoutDerivedPaths,
		params,
		...currentEventToolIdentity,
		...currentDerivedEvent
	});
	for (const registration of policies) {
		const pluginId = readTrustedPolicyPluginString(registration, "pluginId");
		if (!pluginId) return trustedPolicyFailureResult(registration, "policy owner is unreadable");
		const policyCtx = {
			...ctxWithoutToolIdentity,
			...currentContextToolIdentity,
			getSessionExtension: (namespace) => {
				const normalizedNamespace = namespace.trim();
				const pluginState = sessionExtensionStateCache.get(pluginId);
				if (!normalizedNamespace || !pluginState) return;
				return pluginState[normalizedNamespace];
			}
		};
		const policy = readTrustedPolicy(registration);
		if (!policy) return trustedPolicyFailureResult(registration, "policy is unreadable");
		const matcher = readTrustedPolicyMatcher(policy);
		if (matcher === null) return trustedPolicyFailureResult(registration, "policy matcher is unreadable");
		if (!pluginToolMatcherCoversTool(matcher, event.toolName)) continue;
		let decision;
		try {
			if (!sessionExtensionStateCache.has(pluginId)) {
				const config = ctx.sessionKey ? resolveSessionConfig() : void 0;
				sessionExtensionStateCache.set(pluginId, config ? await getPluginSessionExtensionState({
					cfg: config,
					pluginId,
					sessionKey: ctx.sessionKey,
					agentId: ctx.agentId
				}) : void 0);
			}
			decision = await policy.evaluate(buildEvent(adjustedParams), policyCtx);
		} catch {
			return trustedPolicyFailureResult(registration, "policy evaluation failed");
		}
		if (!decision) continue;
		try {
			if ("allow" in decision && decision.allow === false) return {
				block: true,
				blockReason: decision.reason ?? trustedPolicyDefaultBlockReason(registration)
			};
			if ("block" in decision && decision.block === true) return {
				...decision,
				blockReason: decision.blockReason ?? trustedPolicyDefaultBlockReason(registration)
			};
			if ("params" in decision && isPlainObject(decision.params)) {
				const normalized = options?.normalizeEvent?.(buildEvent(decision.params), policyCtx);
				adjustedParams = normalized?.params ?? decision.params;
				if (normalized?.event) currentEventToolIdentity = normalizeToolIdentity(normalized.event);
				if (normalized?.ctx) currentContextToolIdentity = normalizeToolIdentity(normalized.ctx);
				else if (normalized?.event) currentContextToolIdentity = normalizeToolIdentity(normalized.event);
				hasAdjustedParams = true;
				currentDerivedEvent = normalizeDerivedEventFields(await options?.deriveEvent?.(adjustedParams));
			}
			if ("requireApproval" in decision && decision.requireApproval && !approval) approval = decision.requireApproval;
		} catch {
			ctx.abortSignal?.throwIfAborted();
			return trustedPolicyFailureResult(registration, "policy decision is unreadable");
		}
	}
	if (!hasAdjustedParams && !approval) return;
	return {
		...hasAdjustedParams ? { params: adjustedParams } : {},
		...approval ? { requireApproval: approval } : {}
	};
}
//#endregion
//#region src/agents/tool-loop-admission.ts
async function evaluateToolLoopCall(call, ctx, stateOverride) {
	if (!ctx.sessionKey || ctx.loopDetection?.enabled !== true) return;
	const toolName = normalizeToolPolicyName(call.toolName || "tool");
	const { getDiagnosticSessionState, logToolLoopAction, detectToolCallLoop } = await loadBeforeToolCallRuntime();
	const sessionState = getDiagnosticSessionState({
		sessionKey: ctx.sessionKey,
		sessionId: ctx.sessionId
	});
	const result = detectToolCallLoop(stateOverride ?? sessionState, toolName, call.params, ctx.runId ? { runId: ctx.runId } : void 0);
	if (!result.stuck) return;
	const diagnostic = {
		sessionKey: ctx.sessionKey,
		sessionId: ctx.sessionId,
		...ctx.agentId ? { agentId: ctx.agentId } : {},
		toolName,
		level: result.level,
		detector: result.detector,
		count: result.count,
		message: result.message,
		pairedToolName: result.pairedToolName
	};
	if (result.level === "critical") {
		beforeToolCallLog.error(`Blocking ${toolName} due to critical loop: ${result.message}`);
		logToolLoopAction({
			...diagnostic,
			action: "block"
		});
		return {
			kind: "critical-tool-loop",
			toolCallId: call.toolCallId ?? "",
			toolName,
			actionKey: hashToolCall(toolName, call.params),
			detector: result.detector,
			count: result.count,
			reason: result.message
		};
	}
	const baseWarningKey = result.warningKey ?? `${result.detector}:${toolName}`;
	if (shouldEmitLoopWarning(sessionState, ctx.runId ? `${ctx.runId}:${baseWarningKey}` : baseWarningKey, result.count)) {
		beforeToolCallLog.warn(`Loop warning for ${toolName}: ${result.message}`);
		logToolLoopAction({
			...diagnostic,
			action: "warn"
		});
		return {
			kind: "tool-loop-warning",
			toolCallId: call.toolCallId ?? "",
			count: result.count
		};
	}
}
async function recordToolLoopCall(call, ctx) {
	if (!ctx.sessionKey || ctx.loopDetection?.enabled !== true) return;
	const { getDiagnosticSessionState, recordToolCall } = await loadBeforeToolCallRuntime();
	recordToolCall(getDiagnosticSessionState({
		sessionKey: ctx.sessionKey,
		sessionId: ctx.sessionId
	}), normalizeToolPolicyName(call.toolName || "tool"), call.params, call.toolCallId, ctx.runId ? { runId: ctx.runId } : void 0);
}
/** Preserve the existing single-call admission path for harnesses without batch control. */
async function admitSingleToolCallLoop(call, ctx) {
	const intervention = await evaluateToolLoopCall(call, ctx);
	if (intervention?.kind !== "critical-tool-loop") await recordToolLoopCall(call, ctx);
	return intervention;
}
/**
* Admit an assistant tool batch atomically. Successful prepared calls reserve
* exact markers here; calls rejected by argument validation never reach the
* wrapper and reserve none. Agent-core commits both in assistant order at the
* final launch boundary, and a released call is dropped. A later veto still
* records only denial evidence.
*/
async function admitToolCallBatch(calls, ctx) {
	if (!ctx.sessionKey || ctx.loopDetection?.enabled !== true) return {};
	const { getDiagnosticSessionState, markDiagnosticArgumentChurnObservation, reconcileToolCallExecutionParams, recordToolCall, recordToolCallOutcome, resolveToolLoopWarningThreshold } = await loadBeforeToolCallRuntime();
	const warningThreshold = resolveToolLoopWarningThreshold();
	const sessionState = getDiagnosticSessionState({
		sessionKey: ctx.sessionKey,
		sessionId: ctx.sessionId
	});
	const projectedState = {
		...sessionState,
		toolCallHistory: [...sessionState.toolCallHistory ?? []]
	};
	const recordLoopVeto = (state, call) => {
		recordToolCall(state, normalizeToolPolicyName(call.toolCall.name || "tool"), call.args, call.toolCall.id, ctx.runId ? { runId: ctx.runId } : void 0);
		const projectedCall = state.toolCallHistory?.at(-1);
		if (projectedCall) projectedCall.outcomeKind = "tool-loop-veto";
	};
	const projectLoopVeto = (call) => {
		const scratchState = {
			...sessionState,
			toolCallHistory: []
		};
		recordLoopVeto(scratchState, call);
		const projectedCall = scratchState.toolCallHistory?.at(-1);
		if (projectedCall) projectedState.toolCallHistory?.push(projectedCall);
	};
	const warnings = [];
	for (const call of calls) {
		const intervention = await evaluateToolLoopCall({
			toolName: normalizeToolPolicyName(call.toolCall.name || "tool"),
			params: call.args,
			toolCallId: call.toolCall.id
		}, ctx, projectedState);
		if (intervention?.kind === "critical-tool-loop") {
			for (const rejectedCall of calls) if (hashToolCall(normalizeToolPolicyName(rejectedCall.toolCall.name || "tool"), rejectedCall.args) === intervention.actionKey) recordLoopVeto(sessionState, rejectedCall);
			return { intervention };
		}
		if (intervention) warnings.push(intervention);
		projectLoopVeto(call);
	}
	for (const call of calls) if (!call.validationFailure) recordBatchAdmittedToolCall(call.toolCall.id, ctx.runId);
	const admittedById = new Map(calls.map((call) => [call.toolCall.id, {
		toolName: normalizeToolPolicyName(call.toolCall.name || "tool"),
		validationFailure: call.validationFailure
	}]));
	const committedIds = /* @__PURE__ */ new Set();
	const commitReadyCall = (readyCall) => {
		const admitted = admittedById.get(readyCall.toolCallId);
		if (!admitted || committedIds.has(readyCall.toolCallId)) return;
		recordToolCall(sessionState, admitted.toolName, readyCall.args, readyCall.toolCallId, ctx.runId ? { runId: ctx.runId } : void 0);
		if (admitted.validationFailure) {
			committedIds.add(readyCall.toolCallId);
			const record = recordToolCallOutcome(sessionState, {
				toolName: admitted.toolName,
				toolParams: readyCall.args,
				toolCallId: readyCall.toolCallId,
				result: admitted.validationFailure,
				runId: ctx.runId
			});
			if (record) record.outcomeKind = "argument-validation";
			return;
		}
		const churn = reconcileToolCallExecutionParams(sessionState, {
			toolName: admitted.toolName,
			toolParams: readyCall.args,
			toolCallId: readyCall.toolCallId,
			runId: ctx.runId,
			warningThreshold
		});
		markDiagnosticArgumentChurnObservation({
			sessionKey: ctx.sessionKey,
			sessionId: ctx.sessionId,
			runId: ctx.runId,
			active: churn.active
		});
		committedIds.add(readyCall.toolCallId);
	};
	return {
		warnings,
		commitReadyCalls(readyCalls) {
			if (readyCalls.length === 1 && readyCalls[0]) {
				commitReadyCall(readyCalls[0]);
				return;
			}
			const readyById = new Map(readyCalls.map((call) => [call.toolCallId, call]));
			for (const call of calls) {
				const readyCall = readyById.get(call.toolCall.id);
				if (readyCall) commitReadyCall(readyCall);
			}
		},
		releaseSkippedCalls(toolCallIds) {
			for (const toolCallId of toolCallIds) admittedById.delete(toolCallId);
			releaseBatchAdmittedToolCalls(toolCallIds, ctx.runId);
		}
	};
}
//#endregion
//#region src/agents/agent-tools.before-tool-call.policy.ts
/**
* Ordered before_tool_call policy chain.
*
* Ordering is behavior: loop admission, owner probes,
* trusted policies, approvals, normal hooks, and final owner approval must
* remain in this sequence.
*/
const BEFORE_TOOL_CALL_HOOK_FAILURE_REASON = "Tool call blocked because before_tool_call hook failed";
/** Keep receipt routing private without widening observable hook outcomes. */
function markPrivateDecision(outcome, marker) {
	Object.defineProperty(outcome, marker, { value: true });
}
function getBeforeToolCallPolicyDiagnosticState() {
	const policyRegistry = getGlobalHookRunnerRegistry() ?? void 0;
	return {
		hasBeforeToolCallHook: getGlobalHookRunner()?.hasHooks("before_tool_call") === true,
		trustedToolPolicies: getTrustedToolPolicyDiagnosticEntries(policyRegistry)
	};
}
function hasBeforeToolCallPolicy() {
	const state = getBeforeToolCallPolicyDiagnosticState();
	return state.hasBeforeToolCallHook || state.trustedToolPolicies.length > 0;
}
async function runBeforeToolCallHook(args) {
	const toolName = normalizeToolPolicyName(args.toolName || "tool");
	const params = args.params;
	let loopWarning;
	const withLoopWarning = (outcome) => {
		if (!outcome.blocked && loopWarning) outcome.loopWarning = loopWarning;
		return outcome;
	};
	let releaseArgumentChurnPolicyWait;
	if (args.ctx?.awaitSessionDiffBaseline) {
		await args.ctx.awaitSessionDiffBaseline();
		args.signal?.throwIfAborted();
	}
	try {
		if (args.ctx?.sessionKey) {
			if (args.ctx.loopDetection?.enabled === true) {
				const { markDiagnosticArgumentChurnObservation } = await loadBeforeToolCallRuntime();
				const policyWaitToken = Symbol("before-tool-call-policy-wait");
				const policyWaitRef = {
					sessionKey: args.ctx.sessionKey,
					sessionId: args.ctx.sessionId,
					runId: args.ctx.runId,
					policyWaitToken
				};
				markDiagnosticArgumentChurnObservation({
					...policyWaitRef,
					policyWait: "enter"
				});
				releaseArgumentChurnPolicyWait = () => markDiagnosticArgumentChurnObservation({
					...policyWaitRef,
					policyWait: "exit"
				});
			}
			if (!(args.toolCallId !== void 0 && consumeBatchAdmittedToolCall(args.toolCallId, args.ctx.runId))) {
				const intervention = await admitSingleToolCallLoop({
					toolName,
					params,
					toolCallId: args.toolCallId
				}, args.ctx);
				if (intervention?.kind === "critical-tool-loop") {
					const outcome = {
						blocked: true,
						kind: "veto",
						deniedReason: "tool-loop",
						reason: intervention.reason,
						params
					};
					markPrivateDecision(outcome, "genericDecision");
					return outcome;
				}
				loopWarning = intervention;
			}
		}
		const hookRunner = getGlobalHookRunner();
		const hasBeforeToolCallHooks = hookRunner?.hasHooks("before_tool_call") === true;
		const policyRegistry = getGlobalHookRunnerRegistry() ?? void 0;
		const shouldRunTrustedPolicies = hasTrustedToolPolicies(policyRegistry);
		const normalizedParams = isPlainObject(params) ? params : {};
		if (!shouldRunTrustedPolicies && !hasBeforeToolCallHooks) return withLoopWarning({
			blocked: false,
			params
		});
		const deriveOptions = args.ctx?.cwd || args.ctx?.sandbox ? {
			...args.ctx.cwd ? { cwd: args.ctx.cwd } : {},
			...args.ctx.sandbox ? { sandbox: args.ctx.sandbox } : {},
			...args.signal ? { signal: args.signal } : {}
		} : void 0;
		const derivedToolParams = await deriveToolParams(toolName, normalizedParams, deriveOptions);
		const deriveToolEventParams = async (candidateParams) => {
			const derived = await deriveToolParams(toolName, candidateParams, deriveOptions);
			return derived.derivedPaths ? { derivedPaths: derived.derivedPaths } : {};
		};
		const toolIdentity = {
			...args.toolKind && { toolKind: args.toolKind },
			...args.toolInputKind && { toolInputKind: args.toolInputKind }
		};
		const buildToolContext = (identity) => ({
			toolName,
			...identity,
			...args.ctx?.agentId && { agentId: args.ctx.agentId },
			...args.ctx?.sessionKey && { sessionKey: args.ctx.sessionKey },
			...args.ctx?.sessionId && { sessionId: args.ctx.sessionId },
			...args.ctx?.runId && { runId: args.ctx.runId },
			...args.signal ? { abortSignal: args.signal } : {},
			...args.ctx?.trace && { trace: freezeDiagnosticTraceContext(args.ctx.trace) },
			...args.toolCallId && { toolCallId: args.toolCallId },
			...args.ctx?.channelId && { channelId: args.ctx.channelId },
			...args.ctx?.requester ? { requester: args.ctx.requester } : {}
		});
		const toolContext = buildToolContext(toolIdentity);
		let trustedPolicyParams = normalizedParams;
		const trustedPolicyResult = shouldRunTrustedPolicies ? await runTrustedToolPolicies({
			toolName,
			params: normalizedParams,
			...toolIdentity,
			...args.ctx?.runId && { runId: args.ctx.runId },
			...args.toolCallId && { toolCallId: args.toolCallId },
			...derivedToolParams.derivedPaths ? { derivedPaths: derivedToolParams.derivedPaths } : {}
		}, toolContext, {
			...policyRegistry ? { registry: policyRegistry } : {},
			...args.ctx?.config ? { config: args.ctx.config } : {},
			deriveEvent: deriveToolEventParams,
			normalizeEvent(eventValue) {
				const normalizedEventParams = reconcileCodeModeExecBeforeHookParams({
					owner: { toolKind: eventValue.toolKind },
					originalParams: trustedPolicyParams,
					hookParams: trustedPolicyParams,
					adjustedParams: eventValue.params
				});
				if (!isPlainObject(normalizedEventParams)) return;
				trustedPolicyParams = normalizedEventParams;
				const normalizedEventIdentity = getCodeModeExecBeforeHookMetadataForToolKind({
					toolKind: eventValue.toolKind,
					params: normalizedEventParams
				});
				return {
					params: normalizedEventParams,
					...normalizedEventIdentity ? {
						event: normalizedEventIdentity,
						ctx: normalizedEventIdentity
					} : {}
				};
			}
		}) : void 0;
		if (trustedPolicyResult?.block) {
			const outcome = {
				blocked: true,
				kind: "veto",
				deniedReason: "plugin-before-tool-call",
				reason: trustedPolicyResult.blockReason || "Tool call blocked by trusted plugin policy",
				params
			};
			markPrivateDecision(outcome, "genericDecision");
			return outcome;
		}
		let trustedApprovalParams;
		let trustedApprovalResolution;
		let trustedApprovalGranted = false;
		if (trustedPolicyResult?.requireApproval) {
			const approvalOutcome = await resolveBeforeToolCallApprovalOutcome({
				result: trustedPolicyResult,
				approvalMode: args.approvalMode,
				toolName,
				...args.toolCallId ? { toolCallId: args.toolCallId } : {},
				...args.ctx ? { ctx: args.ctx } : {},
				signal: args.signal,
				baseParams: params
			});
			if (approvalOutcome) {
				if (approvalOutcome.blocked) return approvalOutcome;
				if (approvalOutcome.deferredApproval) return withLoopWarning(approvalOutcome);
				trustedApprovalParams = approvalOutcome.params;
				trustedApprovalResolution = approvalOutcome.approvalResolution;
				trustedApprovalGranted = true;
			}
		}
		const policyAdjustedParams = trustedApprovalParams ?? trustedPolicyResult?.params ?? params;
		const trustedApprovalBoundary = trustedApprovalGranted;
		const policyAdjustedToolIdentity = getCodeModeExecBeforeHookMetadataForToolKind({
			toolKind: args.toolKind,
			params: policyAdjustedParams
		}) ?? toolIdentity;
		const policyAdjustedToolContext = buildToolContext(policyAdjustedToolIdentity);
		const policyAdjustedDerivedToolParams = trustedPolicyResult?.params && isPlainObject(policyAdjustedParams) ? await deriveToolParams(toolName, policyAdjustedParams, deriveOptions) : derivedToolParams;
		const approvedParamsSnapshot = trustedApprovalBoundary && hasBeforeToolCallHooks ? cloneHookIsolationValue("before_tool_call", policyAdjustedParams) : void 0;
		let finalParams = approvedParamsSnapshot ?? policyAdjustedParams;
		let finalApprovalResolution = trustedApprovalResolution;
		let ownerDecisionMarked = false;
		if (hasBeforeToolCallHooks) {
			const hookParamsValue = trustedApprovalBoundary ? cloneHookIsolationValue("before_tool_call", approvedParamsSnapshot) : policyAdjustedParams;
			const hookEventParams = isPlainObject(hookParamsValue) ? hookParamsValue : {};
			const callerIdentity = getGatewayToolCallerIdentity();
			const receipt = callerIdentity?.executionIdentityToken && callerIdentity.receiptAuthority ? {
				token: callerIdentity.executionIdentityToken,
				assertAuthority: callerIdentity.receiptAuthority,
				markOwnerDecision: () => {
					ownerDecisionMarked = true;
				}
			} : void 0;
			const hookResult = await hookRunner.runBeforeToolCall({
				toolName,
				params: hookEventParams,
				...policyAdjustedToolIdentity,
				...args.ctx?.runId && { runId: args.ctx.runId },
				...args.toolCallId && { toolCallId: args.toolCallId },
				...policyAdjustedDerivedToolParams.derivedPaths ? { derivedPaths: policyAdjustedDerivedToolParams.derivedPaths } : {}
			}, policyAdjustedToolContext, receipt);
			if (hookResult?.block) return {
				blocked: true,
				kind: "veto",
				deniedReason: "plugin-before-tool-call",
				reason: hookResult.blockReason || "Tool call blocked by plugin hook",
				params: policyAdjustedParams
			};
			const rawHookCandidateParams = hookResult?.params === void 0 ? isPlainObject(hookParamsValue) ? hookEventParams : approvedParamsSnapshot : mergeParamsWithApprovalOverrides(hookEventParams, hookResult.params);
			const hookCandidateParams = hookResult?.params === void 0 ? rawHookCandidateParams : reconcileCodeModeExecBeforeHookParams({
				owner: { toolKind: args.toolKind },
				originalParams: hookEventParams,
				hookParams: hookEventParams,
				adjustedParams: rawHookCandidateParams
			});
			if (hookResult?.requireApproval) {
				const approvalOutcome = await resolveBeforeToolCallApprovalOutcome({
					result: trustedApprovalBoundary ? {
						...hookResult,
						params: void 0
					} : hookResult,
					approvalMode: args.approvalMode,
					toolName,
					...args.toolCallId ? { toolCallId: args.toolCallId } : {},
					...args.ctx ? { ctx: args.ctx } : {},
					signal: args.signal,
					baseParams: trustedApprovalBoundary ? hookCandidateParams : policyAdjustedParams
				});
				if (approvalOutcome) {
					if (approvalOutcome.blocked) return approvalOutcome;
					if (approvalOutcome.deferredApproval) return withLoopWarning(approvalOutcome);
					finalParams = approvalOutcome.params;
					finalApprovalResolution = approvalOutcome.approvalResolution ?? finalApprovalResolution;
				}
			} else if (trustedApprovalBoundary && !isDeepStrictEqual(approvedParamsSnapshot, hookCandidateParams)) return {
				blocked: true,
				kind: "failure",
				disposition: "blocked",
				deniedReason: "plugin-approval",
				reason: "Tool call parameters changed after trusted approval",
				params: approvedParamsSnapshot
			};
			if (!trustedApprovalBoundary && hookResult?.params) finalParams = reconcileCodeModeExecBeforeHookParams({
				owner: { toolKind: args.toolKind },
				originalParams: policyAdjustedParams,
				hookParams: policyAdjustedParams,
				adjustedParams: mergeParamsWithApprovalOverrides(finalParams, hookResult.params)
			});
		}
		const allowed = {
			blocked: false,
			params: finalParams
		};
		if (ownerDecisionMarked || finalApprovalResolution) markPrivateDecision(allowed, "ownerDecision");
		if (finalApprovalResolution) allowed.approvalResolution = finalApprovalResolution;
		return withLoopWarning(allowed);
	} catch (err) {
		const toolCallId = args.toolCallId ? ` toolCallId=${args.toolCallId}` : "";
		const cause = unwrapErrorCause(err);
		beforeToolCallLog.error(`before_tool_call hook failed: tool=${toolName}${toolCallId} error=${String(cause)}`);
		return {
			blocked: true,
			kind: "failure",
			deniedReason: "plugin-before-tool-call",
			disposition: resolveToolErrorDiagnostic(cause, args.signal).terminalReason,
			reason: BEFORE_TOOL_CALL_HOOK_FAILURE_REASON,
			params
		};
	} finally {
		try {
			releaseArgumentChurnPolicyWait?.();
		} catch (err) {
			beforeToolCallLog.warn(`before_tool_call policy-wait release failed: tool=${toolName} error=${String(err)}`);
		}
	}
}
//#endregion
//#region src/agents/agent-tools.execution-preparer.ts
const INTERNAL_EXECUTION_CONTROL = Symbol("openclawInternalExecutionControl");
function createControl() {
	const ready = createDeferredCore();
	const decision = createDeferredCore();
	return {
		[INTERNAL_EXECUTION_CONTROL]: true,
		ready: ready.promise,
		pause: (args) => {
			ready.resolve(args);
			return decision.promise;
		},
		launch: (start) => decision.resolve({
			launch: true,
			start
		}),
		dispose: () => decision.resolve({ launch: false })
	};
}
function readInternalExecutionControl(value) {
	return value && typeof value === "object" && value[INTERNAL_EXECUTION_CONTROL] === true ? value : void 0;
}
function createInternalExecutionPreparer(startExecution) {
	return async (params) => {
		const control = createControl();
		const execution = startExecution(params, control);
		const settled = await Promise.race([control.ready.then((args) => ({
			kind: "ready",
			args
		})), execution.then((result) => ({
			kind: "result",
			result
		}), (error) => ({
			kind: "error",
			error
		}))]);
		if (settled.kind !== "ready") return {
			kind: "immediate",
			outcome: settled.kind === "result" ? {
				kind: "result",
				result: settled.result,
				isError: false
			} : {
				kind: "error",
				error: settled.error
			},
			dispose() {}
		};
		let disposed = false;
		return {
			kind: "ready",
			args: settled.args,
			execute(start) {
				if (!disposed) control.launch(start);
				return execution;
			},
			dispose() {
				if (!disposed) {
					disposed = true;
					control.dispose();
					execution.catch(() => void 0);
				}
			}
		};
	};
}
//#endregion
//#region src/agents/agent-tools.execution-validation.ts
const executionValidators = resolveGlobalSingleton(Symbol.for("openclaw.toolExecutionValidationContext"), () => new AsyncLocalStorage());
/** Keep per-call validation inside the policy wrapper's final execution boundary. */
async function runWithToolExecutionValidation(toolCallId, validator, execute) {
	return await executionValidators.run({
		toolCallId,
		validate: validator
	}, execute);
}
/** Validate hook-adjusted arguments without leaking a validator into concurrent calls. */
async function validateToolExecutionParams(toolCallId, params) {
	const scopedValidator = executionValidators.getStore();
	if (scopedValidator?.toolCallId === toolCallId) await scopedValidator.validate(params);
}
//#endregion
//#region src/agents/plugin-runtime-refresh.ts
const refreshScope = resolveGlobalSingleton(Symbol.for("openclaw.agentPluginRuntimeRefresh"), () => new AsyncLocalStorage());
/** Captured host control survives plugin callbacks without becoming run authority. */
function captureAgentPluginRuntimeRefresh() {
	const owner = refreshScope.getStore();
	return {
		bindConsumer: (isCurrent) => {
			if (owner?.active) owner.consumer = isCurrent;
		},
		request: () => {
			if (!owner?.active || owner.consumer?.() !== true) return false;
			owner.requested = true;
			return true;
		},
		isRequested: () => owner?.active === true && owner.requested,
		isPending: () => owner?.active === true && owner.requested && owner.holds === 0,
		hold: () => {
			if (!owner?.active) return () => {};
			owner.holds += 1;
			let released = false;
			return () => {
				if (!released) {
					released = true;
					owner.holds -= 1;
				}
			};
		},
		assertActive: () => {
			if (owner && !owner.active) throw new Error("Plugin runtime changed. Continue with the refreshed tool catalog.");
		},
		assertCurrent: () => {
			if (owner && (!owner.active || owner.requested)) throw new Error("Plugin runtime changed. Continue with the refreshed tool catalog; do not repeat completed actions.");
		}
	};
}
/** One visible run owns refresh requests across all of its prepared runtime generations. */
function createAgentPluginRuntimeRefresh() {
	let owner;
	const close = () => {
		if (owner) {
			owner.active = false;
			owner.consumer = void 0;
			owner.requested = false;
		}
	};
	return {
		run: (run) => {
			close();
			owner = {
				active: true,
				holds: 0,
				requested: false
			};
			return refreshScope.run(owner, run);
		},
		close
	};
}
//#endregion
//#region src/agents/agent-tools.before-tool-call.wrapper.ts
/**
* Wrapped before_tool_call execution boundary.
* Owns tool preparation/finalization, adjusted-param replay state, terminal
* results, diagnostics around execution, and wrapper metadata.
*/
const MAX_TRACKED_ADJUSTED_PARAMS = 1024;
const INTERNAL_DISPOSED_RESULT = {
	content: [],
	details: {
		status: "skipped",
		deniedReason: "internal-dispose"
	}
};
/** Run tool-owned preparation while retaining the exact prepared object. */
async function prepareBeforeToolCallExecutionParams(params) {
	const prepare = params.tool.prepareBeforeToolCallParams;
	if (prepare && params.ctx?.awaitSessionDiffBaseline) {
		await params.ctx.awaitSessionDiffBaseline();
		params.signal?.throwIfAborted();
	}
	return prepare ? await prepare(params.params, {
		...params.toolCallId ? { toolCallId: params.toolCallId } : {},
		...params.ctx ? { hookContext: params.ctx } : {},
		...params.signal ? { signal: params.signal } : {}
	}) : params.params;
}
/** Reconcile hook rewrites and restore tool-owned state before execution. */
function finalizeBeforeToolCallExecutionParams(params) {
	const reconciledParams = reconcileCodeModeExecBeforeHookParams({
		owner: { tool: params.tool },
		originalParams: params.preparedParams,
		hookParams: params.hookParams,
		adjustedParams: params.adjustedParams
	});
	const finalize = params.tool.finalizeBeforeToolCallParams;
	if (!finalize) return reconciledParams;
	if (params.finalizerMode === "adapter") return finalize(reconciledParams, params.preparedParams);
	return finalize.call(params.tool, reconciledParams, params.preparedParams) ?? reconciledParams;
}
var BeforeToolCallFailureError = class extends Error {
	constructor(message, disposition, cause) {
		super(message, cause === void 0 ? void 0 : { cause });
		this.disposition = disposition;
		this.name = "BeforeToolCallFailureError";
	}
};
function tagBeforeToolCallFailure(error, signal, stage) {
	try {
		if (error instanceof BeforeToolCallFailureError) return error;
	} catch {}
	const message = formatToolExecutionErrorMessage(error, "before_tool_call failed");
	const disposition = resolveToolErrorDiagnostic(error, signal).terminalReason;
	const tagged = new BeforeToolCallFailureError(message, disposition, error);
	if (stage === "tool_preparation" && isTrustedToolExecutionPreflightError(error)) markToolExecutionNotStarted(tagged);
	return tagged;
}
function getBeforeToolCallFailureDisposition(error) {
	try {
		return error instanceof BeforeToolCallFailureError ? error.disposition : void 0;
	} catch {
		return;
	}
}
/** Remember hook-adjusted params for later adapter-side execution. */
function recordAdjustedParamsForToolCall(toolCallId, params, runId) {
	if (!toolCallId) return;
	let snapshot;
	try {
		snapshot = structuredClone(params);
	} catch {
		return;
	}
	adjustedParamsByToolCallId.set(buildAdjustedParamsKey({
		runId,
		toolCallId
	}), snapshot);
	pruneMapToMaxSize(adjustedParamsByToolCallId, MAX_TRACKED_ADJUSTED_PARAMS);
}
/** Record that one concrete core-owned tool call may use structured replay classification. */
function recordStructuredReplayTrustForToolCall(toolCallId, tool, runId) {
	if (!toolCallId || getPluginToolMeta(tool) || getChannelAgentToolMeta(tool)) return;
	recordStructuredReplaySafeToolCall(toolCallId, runId);
	pruneTrackedToolCallIds(structuredReplaySafeToolCallIds);
}
const preExecutionBlockedToolResults = /* @__PURE__ */ new WeakSet();
function isPreExecutionBlockedToolResult(result) {
	return result !== null && typeof result === "object" && preExecutionBlockedToolResults.has(result);
}
function buildBlockedToolResult(params) {
	recordPreExecutionBlockedToolCall(params.toolCallId, params.runId);
	const result = {
		content: [{
			type: "text",
			text: params.reason
		}],
		details: {
			status: "blocked",
			deniedReason: params.deniedReason ?? "plugin-before-tool-call",
			reason: params.reason
		}
	};
	preExecutionBlockedToolResults.add(result);
	return result;
}
function wrapToolWithBeforeToolCallHook(tool, ctx, options = {}) {
	const execute = tool.execute;
	const refresh = captureAgentPluginRuntimeRefresh();
	const assertAgentPluginRuntimeCurrent = isCodeModeControlTool(tool) && tool.name === "wait" ? refresh.assertActive : refresh.assertCurrent;
	if (!execute) return tool;
	const toolName = tool.name || "tool";
	const toolOwnerPluginId = getPluginToolMeta(tool)?.pluginId;
	const admitExecution = captureAgentToolExecutionBudget();
	const diagnosticIdentity = resolveToolDiagnosticIdentity(tool);
	const hookOptions = {
		...options,
		emitDiagnostics: options.emitDiagnostics !== false
	};
	const toolContentPolicy = resolveDiagnosticModelContentCapturePolicy(ctx?.config);
	const wrappedTool = {
		...tool,
		execute: async (toolCallId, params, signal, onUpdate, ...executionArgs) => {
			assertAgentPluginRuntimeCurrent();
			const prepareControl = readInternalExecutionControl(executionArgs.at(-1));
			if (prepareControl) executionArgs.pop();
			const toolCallOrdinal = ctx?.allocateToolOutcomeOrdinal?.(toolCallId);
			const preExecutionStartedAt = Date.now();
			const normalizedToolName = normalizeToolPolicyName(toolName || "tool");
			const trace = hookOptions.emitDiagnostics && ctx?.trace ? freezeDiagnosticTraceContext(createChildDiagnosticTraceContext(ctx.trace)) : void 0;
			const buildEventBase = (toolParams) => ({
				...ctx?.runId && { runId: ctx.runId },
				...ctx?.sessionKey && { sessionKey: ctx.sessionKey },
				...ctx?.sessionId && { sessionId: ctx.sessionId },
				...ctx?.agentId && { agentId: ctx.agentId },
				...trace && { trace },
				toolName: normalizedToolName,
				...diagnosticIdentity,
				...toolCallId && { toolCallId },
				paramsSummary: summarizeToolParams(toolParams),
				mutatingAction: buildToolMutationState(normalizedToolName, toolParams).mutatingAction
			});
			const recordPreExecutionError = (error, toolParams, errorCategory) => {
				recordPreExecutionBlockedToolCall(toolCallId, ctx?.runId);
				if (!hookOptions.emitDiagnostics) return;
				emitTrustedDiagnosticEvent({
					type: "tool.execution.error",
					...buildEventBase(toolParams),
					durationMs: Date.now() - preExecutionStartedAt,
					...resolveToolErrorDiagnostic(error, signal, errorCategory)
				});
			};
			const recordPreExecutionDisposition = (toolParams, disposition, errorCategory, deniedReason) => {
				recordPreExecutionBlockedToolCall(toolCallId, ctx?.runId);
				if (!hookOptions.emitDiagnostics) return;
				const eventBase = buildEventBase(toolParams);
				if (disposition === "blocked") {
					const reason = deniedReason ?? "plugin-before-tool-call";
					emitTrustedDiagnosticEvent({
						type: "tool.execution.blocked",
						...eventBase,
						deniedReason: reason,
						reason
					});
					return;
				}
				emitTrustedDiagnosticEvent({
					type: "tool.execution.error",
					...eventBase,
					durationMs: Date.now() - preExecutionStartedAt,
					errorCategory: disposition === "cancelled" ? "aborted" : errorCategory,
					terminalReason: disposition
				});
			};
			const blockToolCall = async (blockedCall) => {
				if (blockedCall.genericDecision) recordGenericToolActionDecision(tool, toolCallId, "denied");
				const eventBase = buildEventBase(blockedCall.toolParams);
				if (hookOptions.emitDiagnostics) {
					emitTrustedDiagnosticEvent({
						type: "tool.execution.blocked",
						...eventBase,
						reason: blockedCall.reason,
						deniedReason: blockedCall.deniedReason
					});
					emitToolBlockedSecurityEvent({
						ctx,
						deniedReason: blockedCall.deniedReason,
						toolIdentity: diagnosticIdentity,
						toolName: normalizedToolName,
						trace,
						paramsSummary: eventBase.paramsSummary
					});
				}
				const blockedResult = buildBlockedToolResult({
					reason: blockedCall.reason,
					deniedReason: blockedCall.deniedReason,
					toolCallId,
					runId: ctx?.runId
				});
				await recordLoopOutcome({
					ctx,
					toolName: normalizedToolName,
					toolParams: blockedCall.toolParams,
					toolCallId,
					result: blockedResult,
					toolCallOrdinal
				});
				return blockedResult;
			};
			let preparedParams;
			try {
				preparedParams = await prepareBeforeToolCallExecutionParams({
					tool,
					params,
					toolCallId,
					ctx,
					signal
				});
			} catch (error) {
				recordPreExecutionError(error, params, "tool_preparation");
				throw tagBeforeToolCallFailure(error, signal, "tool_preparation");
			}
			const hookParams = normalizeCodeModeExecBeforeHookParams({
				tool,
				params: preparedParams
			});
			const hookMetadata = getCodeModeExecBeforeHookMetadata({
				tool,
				params: preparedParams
			});
			let outcome;
			try {
				outcome = await runBeforeToolCallHook({
					toolName,
					params: hookParams,
					...hookMetadata,
					toolCallId,
					ctx: ctx ? {
						...ctx,
						toolOwnerPluginId
					} : toolOwnerPluginId ? { toolOwnerPluginId } : void 0,
					signal,
					approvalMode: hookOptions.approvalMode
				});
			} catch (error) {
				recordPreExecutionError(error, hookParams, "before_tool_call");
				throw tagBeforeToolCallFailure(error, signal, "before_tool_call");
			}
			if (outcome.blocked) {
				if (outcome.kind !== "veto") {
					recordPreExecutionDisposition(outcome.params ?? hookParams, outcome.disposition, outcome.deniedReason === "plugin-approval" ? "plugin_approval" : "before_tool_call", outcome.deniedReason);
					throw new BeforeToolCallFailureError(outcome.reason, outcome.disposition);
				}
				return await blockToolCall({
					reason: outcome.reason,
					deniedReason: outcome.deniedReason ?? "plugin-before-tool-call",
					toolParams: outcome.params ?? hookParams,
					genericDecision: outcome.genericDecision
				});
			}
			let executeParams;
			try {
				signal?.throwIfAborted();
				executeParams = finalizeBeforeToolCallExecutionParams({
					tool,
					preparedParams,
					hookParams,
					adjustedParams: outcome.params,
					finalizerMode: "wrapped"
				});
				await validateToolExecutionParams(toolCallId, executeParams);
				await reconcileLoopCallExecutionParams({
					ctx,
					toolName: normalizedToolName,
					toolParams: executeParams,
					toolCallId
				});
			} catch (error) {
				recordPreExecutionError(error, outcome.params ?? hookParams, "tool_preparation");
				throw tagBeforeToolCallFailure(error, signal, "tool_preparation");
			}
			let onImplementationStart;
			if (prepareControl) {
				const decision = await prepareControl.pause(executeParams);
				if (!decision.launch) {
					recordGenericToolActionDecision(tool, toolCallId, "suppressed");
					return INTERNAL_DISPOSED_RESULT;
				}
				onImplementationStart = decision.start;
			}
			const eventBase = buildEventBase(executeParams);
			const recordProgress = captureDiagnosticToolProgress(eventBase);
			recordToolExecutionStarted(toolCallId, ctx?.runId);
			const liveness = startToolExecutionLiveness(eventBase, hookOptions.emitDiagnostics, signal);
			const startedAt = Date.now();
			try {
				let result;
				try {
					const args = [
						toolCallId,
						executeParams,
						signal,
						onUpdate,
						...executionArgs
					];
					const invoke = () => runWithBoundAgentToolSourceExecutionScope(tool, () => {
						signal?.throwIfAborted();
						assertAgentPluginRuntimeCurrent();
						admitExecution?.();
						onImplementationStart?.();
						recordAdjustedParamsForToolCall(toolCallId, executeParams, ctx?.runId);
						return liveness.run(() => execute(...args));
					});
					result = outcome.ownerDecision ? await invoke() : await runWithGenericToolActionDecision(tool, toolCallId, invoke);
				} catch (error) {
					throw hookOptions.protectNetworkErrors !== false && tool.resultContentSource === "network" && getBeforeToolCallFailureDisposition(error) === void 0 ? protectNetworkToolExecutionError(error, "Tool execution failed.", signal) : error;
				}
				const durationMs = Date.now() - startedAt;
				const preparedTerminalPresentation = prepareToolTerminalPresentation({
					ctx,
					tool,
					toolParams: executeParams,
					toolCallId,
					toolCallOrdinal
				});
				await recordLoopOutcome({
					ctx,
					toolName: normalizedToolName,
					toolParams: executeParams,
					toolCallId,
					result,
					resultContentSource: tool.resultContentSource,
					toolCallOrdinal,
					terminalPresentation: preparedTerminalPresentation?.project?.(result)
				});
				if (!signal?.aborted) rememberPendingTerminalPresentation(preparedTerminalPresentation, ctx?.runId, toolCallId);
				const terminalDiagnostic = resolveToolResultTerminalDiagnostic(result, durationMs);
				if (terminalDiagnostic.type === "tool.execution.completed" && !signal?.aborted) recordProgress?.();
				const skillMatch = findSkillUsageMatch({
					toolName: normalizedToolName,
					toolParams: executeParams,
					ctx
				});
				if (skillMatch && terminalDiagnostic.type === "tool.execution.completed") recordSkillUsed({
					ctx,
					match: skillMatch,
					toolName: normalizedToolName,
					toolCallId
				});
				if (hookOptions.emitDiagnostics) emitTrustedDiagnosticEventWithPrivateData({
					...eventBase,
					...terminalDiagnostic
				}, buildToolContentPrivateData(toolContentPolicy, {
					input: executeParams,
					output: result,
					includeOutput: true
				}));
				return outcome.loopWarning ? appendToolLoopWarning(result, outcome.loopWarning) : result;
			} catch (err) {
				if (hookOptions.emitDiagnostics) emitTrustedDiagnosticEventWithPrivateData({
					type: "tool.execution.error",
					...eventBase,
					durationMs: Date.now() - startedAt,
					...resolveToolErrorDiagnostic(err, signal)
				}, buildToolContentPrivateData(toolContentPolicy, {
					input: executeParams,
					includeOutput: false
				}));
				await recordLoopOutcome({
					ctx,
					toolName: normalizedToolName,
					toolParams: executeParams,
					toolCallId,
					error: err,
					resultContentSource: isTrustedToolExecutionPreflightError(err) || signal?.aborted && err === signal.reason ? void 0 : tool.resultContentSource,
					toolCallOrdinal
				});
				throw err;
			} finally {
				liveness.close();
			}
		}
	};
	const executeWithHooks = wrappedTool.execute;
	const prepareExecution = createInternalExecutionPreparer(async (params, control) => {
		recordToolExecutionTracked(params.toolCallId, ctx?.runId);
		try {
			return await Reflect.apply(executeWithHooks, wrappedTool, [
				params.toolCallId,
				params.args,
				params.signal,
				params.onUpdate,
				...params.executionArgs ?? [],
				control
			]);
		} finally {
			clearTrackedToolExecution(params.toolCallId, ctx?.runId);
		}
	});
	attachInternalToolExecutionPreparer(wrappedTool, prepareExecution);
	wrappedTool.execute = async (toolCallId, params, signal, onUpdate, ...executionArgs) => {
		const prepared = await prepareExecution({
			toolCallId,
			args: params,
			signal,
			onUpdate,
			executionArgs
		});
		try {
			if (prepared.kind === "immediate") {
				if (prepared.outcome.kind === "error") throw prepared.outcome.error;
				return prepared.outcome.result;
			}
			return await prepared.execute();
		} finally {
			prepared.dispose();
		}
	};
	copyBeforeToolCallWrapperMetadata(tool, wrappedTool);
	bindBeforeToolCallMetadata(wrappedTool, {
		options: hookOptions,
		sourceTool: tool,
		hookContext: ctx
	});
	return wrappedTool;
}
/** Rebuild a before_tool_call wrapper while preserving the original source tool. */
function rewrapToolWithBeforeToolCallHook(tool, ctx, options = {}) {
	const preservedContext = getBeforeToolCallHookContext(tool);
	const sourceTool = getBeforeToolCallSourceTool(tool) ?? tool;
	const wrapperOptions = {
		...getBeforeToolCallDiagnosticOptions(tool),
		...options
	};
	if (sourceTool === tool) return wrapToolWithBeforeToolCallHook(tool, ctx ?? preservedContext, wrapperOptions);
	const rewrapSource = {
		...tool,
		execute: sourceTool.execute
	};
	clearBeforeToolCallWrappedMarker(rewrapSource);
	copyBeforeToolCallWrapperMetadata(tool, rewrapSource);
	copyAgentToolSourceExecutionGuard(sourceTool, rewrapSource);
	copyAgentToolSourceExecutionGuard(tool, rewrapSource);
	let rebuilt = wrapToolWithBeforeToolCallHook(rewrapSource, ctx ?? preservedContext, wrapperOptions);
	for (const wrapExecution of getBeforeToolCallExecutionWrappers(tool)) rebuilt = wrapExecution(rebuilt);
	return rebuilt;
}
function recordPreExecutionBlockedToolCall(toolCallId, runId) {
	if (!toolCallId) return;
	preExecutionBlockedToolCallIds.add(buildAdjustedParamsKey({
		runId,
		toolCallId
	}));
	pruneTrackedToolCallIds(preExecutionBlockedToolCallIds);
}
function pruneTrackedToolCallIds(ids) {
	while (ids.size > MAX_TRACKED_ADJUSTED_PARAMS) {
		const oldest = ids.values().next().value;
		if (!oldest) break;
		ids.delete(oldest);
	}
}
//#endregion
export { consumePreExecutionBlockedToolCall as A, clearEmbeddedPluginApprovalBroker as C, consumeRunSkillUsage as D, recordSkillUsed as E, PluginApprovalResolutions as F, consumeTrackedToolExecutionStarted as M, peekAdjustedParamsForToolCall as N, clearBatchAdmittedToolCallsForRun as O, peekPreExecutionBlockedToolCall as P, EmbeddedPluginApprovalBroker as S, finalizeToolTerminalPresentation as T, runBeforeToolCallHook as _, prepareBeforeToolCallExecutionParams as a, cancelDeferredPluginToolApproval as b, rewrapToolWithBeforeToolCallHook as c, createAgentPluginRuntimeRefresh as d, runWithToolExecutionValidation as f, hasBeforeToolCallPolicy as g, getBeforeToolCallPolicyDiagnosticState as h, isPreExecutionBlockedToolResult as i, consumeStructuredReplaySafeToolCall as j, consumeAdjustedParamsForToolCall as k, wrapToolWithBeforeToolCallHook as l, readInternalExecutionControl as m, finalizeBeforeToolCallExecutionParams as n, recordAdjustedParamsForToolCall as o, createInternalExecutionPreparer as p, getBeforeToolCallFailureDisposition as r, recordStructuredReplayTrustForToolCall as s, buildBlockedToolResult as t, captureAgentPluginRuntimeRefresh as u, admitToolCallBatch as v, setEmbeddedPluginApprovalBroker as w, requestDeferredPluginToolApproval as x, getTrustedToolPolicyMatcherScope as y };
