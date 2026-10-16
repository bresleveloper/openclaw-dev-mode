import { a as asOptionalRecord, c as isRecord, t as asNonArrayRecord } from "./record-coerce-TIsquoVR.mjs";
import { t as isPromiseLike } from "./promise-like-D7-l5Fsp.mjs";
import "./agent-tool-result-middleware-DD8TzvvP.mjs";
import { et as consumeAdjustedParamsForToolCall, f as runWithToolExecutionValidation, tt as consumePreExecutionBlockedToolCall } from "./agent-tools.before-tool-call-C25aU-xP.mjs";
import { o as normalizeHeartbeatToolResponse } from "./heartbeat-tool-response-BAjLTEaX.mjs";
import { c as resolveToolResultFailureKind, n as isToolResultError, u as consumeToolExecutionNotStarted } from "./tool-result-error-DGhCl3TG.mjs";
import "./async-work-resources-Dpudqxo5.mjs";
import "./accepted-session-spawn-DpD0J38H.mjs";
import "./embedded-agent-tool-results-C0yTOgai.mjs";
import { c as filterToolResultMediaUrls, s as extractToolResultMediaArtifact } from "./embedded-agent-messaging-extraction-CyEUq6D4.mjs";
import { t as createAgentHarnessToolSurfaceRuntimeCore } from "./tool-surface-bridge-D5MCjK3o.mjs";
//#region src/agents/harness/tool-result-facts.ts
function recordAgentHarnessToolResultTelemetry(params) {
	if (!params.isError && params.toolName === "cron" && isCronAddAction(params.args)) params.telemetry.successfulCronAdds = (params.telemetry.successfulCronAdds ?? 0) + 1;
	if (!params.isError && params.toolName === "heartbeat_respond") {
		const response = normalizeHeartbeatToolResponse(params.result?.details);
		if (response) params.telemetry.heartbeatToolResponse = response;
	}
	if (!params.isError && params.result && !params.signal.aborted) {
		const media = recordAgentHarnessToolResultMedia({
			facts: params.telemetry,
			toolName: params.toolName,
			result: params.result,
			mediaTrustResult: params.coreTtsToolResult ?? params.mediaTrustResult,
			trustedLocalMediaToolNames: params.trustedLocalMediaToolNames
		});
		if (media) {
			const autoDeliveryMediaUrls = new Set(params.telemetry.toolAutoDeliveryMediaUrls);
			const rawAutoDeliveryMediaUrls = new Set(params.autoDeliveryTtsMediaUrls);
			let retainsCoreTtsMedia = false;
			for (const mediaUrl of media.mediaUrls) if (rawAutoDeliveryMediaUrls.has(mediaUrl)) {
				autoDeliveryMediaUrls.add(mediaUrl);
				retainsCoreTtsMedia = true;
			} else autoDeliveryMediaUrls.delete(mediaUrl);
			params.telemetry.toolAutoDeliveryMediaUrls = [...autoDeliveryMediaUrls];
			if (retainsCoreTtsMedia && params.coreTtsToolResult && !params.telemetry.coreTtsToolResults.includes(params.coreTtsToolResult)) params.telemetry.coreTtsToolResults.push(params.coreTtsToolResult);
		}
	}
	if (!params.messagingDelivered) return;
	if (asOptionalRecord(asOptionalRecord(params.mediaTrustResult)?.details)?.sourceReplySink === "internal-ui") {
		const sourceReplyPayload = params.extractSourceReplyPayload(params.result);
		const record = recordAgentHarnessMessagingDelivery({
			facts: params.telemetry,
			sourceReplyPayload,
			sourceReplyFinal: params.sourceReplyFinal
		});
		if (record && params.mediaDeliveryConfirmed) params.telemetry.confirmedMediaDeliveries.push({
			kind: "sourceReply",
			sourceUrls: params.resolveMessagingMediaSourceUrls(params.collectMessagingMediaUrls(record))
		});
		return record;
	}
	const mediaUrls = params.mediaDeliveryConfirmed ? params.collectMessagingMediaUrls(params.args) : [];
	const record = recordAgentHarnessMessagingDelivery({
		facts: params.telemetry,
		text: readFirstString(params.args, [
			"text",
			"message",
			"body",
			"content"
		]),
		mediaUrls,
		target: params.messagingTarget ?? {
			tool: params.toolName,
			provider: readFirstString(params.args, ["provider", "channel"]) ?? params.toolName,
			accountId: readFirstString(params.args, ["accountId", "account_id"]),
			to: readFirstString(params.args, [
				"to",
				"target",
				"recipient"
			]),
			threadId: readFirstString(params.args, [
				"threadId",
				"thread_id",
				"messageThreadId"
			])
		},
		sourceReplyFinal: params.sourceReplyFinal
	});
	if (mediaUrls.length > 0) params.telemetry.confirmedMediaDeliveries.push({
		kind: "outbound",
		target: record,
		sourceUrls: params.resolveMessagingMediaSourceUrls(mediaUrls)
	});
	return record;
}
/** Presentation can add a failure, but cannot erase a failure from execution. */
function resolveAgentHarnessToolResultPresentation(params) {
	const presentationFailureKind = resolveToolResultFailureKind(params.result);
	const failureKind = params.executionFailureKind ?? presentationFailureKind;
	return {
		result: params.executionFailureKind && params.executionFailureKind !== presentationFailureKind ? {
			...params.result,
			details: {
				...isRecord(params.result.details) ? params.result.details : {},
				status: params.executionFailureKind
			}
		} : params.result,
		isError: params.executionIsError || isToolResultError(params.result),
		failureKind
	};
}
function recordAgentHarnessMessagingDelivery(params) {
	const { facts, sourceReplyPayload, target, text, mediaUrls = [], sourceReplyFinal } = params;
	facts.didSendViaMessagingTool = true;
	const finality = sourceReplyFinal !== void 0 ? { sourceReplyFinal } : {};
	if (sourceReplyPayload) {
		const record = {
			...sourceReplyPayload,
			...finality
		};
		facts.messagingToolSourceReplyPayloads.push(record);
		return record;
	}
	if (text) facts.messagingToolSentTexts.push(text);
	facts.messagingToolSentMediaUrls.push(...mediaUrls);
	if (!target) return;
	const record = {
		...target,
		...text ? { text } : {},
		...mediaUrls.length ? { mediaUrls } : {},
		...finality
	};
	facts.messagingToolSentTargets.push(record);
	return record;
}
/** Result presentation supplies artifacts; the concrete tool supplies path trust. */
function recordAgentHarnessToolResultMedia(params) {
	const media = extractToolResultMediaArtifact(params.result);
	if (!media) return;
	const mediaUrls = filterToolResultMediaUrls(params.toolName, media.mediaUrls, params.mediaTrustResult ?? params.result, params.trustedLocalMediaToolNames);
	const seen = new Set(params.facts.toolMediaUrls);
	for (const url of mediaUrls) if (!seen.has(url)) {
		seen.add(url);
		params.facts.toolMediaUrls.push(url);
	}
	if (media.audioAsVoice) params.facts.toolAudioAsVoice = true;
	return {
		...media,
		mediaUrls
	};
}
function readFirstString(record, keys) {
	for (const key of keys) {
		const value = record[key];
		if (typeof value === "string" && value.trim()) return value.trim();
		if (typeof value === "number" && Number.isFinite(value)) return String(value);
	}
}
function isCronAddAction(args) {
	const action = args.action;
	return typeof action === "string" && action.trim().toLowerCase() === "add";
}
//#endregion
//#region src/agents/harness/tool-execution.ts
/** Retains the exact execution promise, including failure, for each native call tuple. */
function createAgentHarnessToolExecutionRegistry(correlationKey) {
	const executions = /* @__PURE__ */ new Map();
	const keyFor = (call) => JSON.stringify(correlationKey(call));
	return {
		get(call) {
			return executions.get(keyFor(call));
		},
		claim(call, start) {
			const existing = executions.get(keyFor(call));
			if (existing) return { execution: existing };
			const execution = start();
			executions.set(keyFor(call), execution);
			return { execution };
		}
	};
}
/** Records the tool boundary independently of backend result presentation. */
function createAgentHarnessToolExecutionBoundaryRegistry() {
	const states = /* @__PURE__ */ new Map();
	return {
		consume(toolCallId) {
			const state = states.get(toolCallId);
			states.delete(toolCallId);
			if (state) state.consumed = true;
			return state?.snapshot;
		},
		begin(params) {
			let executedArguments = structuredClone(params.arguments);
			let didDispatchExecution = false;
			let didStartExecution = false;
			let executionPrevented = false;
			const state = {
				consumed: false,
				retainAfterCompletion: params.retainAfterCompletion === true
			};
			states.set(params.toolCallId, state);
			const consumeBlocked = () => {
				executionPrevented = executionPrevented || consumePreExecutionBlockedToolCall(params.toolCallId, params.runId);
			};
			return {
				get executedArguments() {
					return executedArguments;
				},
				get didStartExecution() {
					return didStartExecution;
				},
				get executionPrevented() {
					return executionPrevented;
				},
				get executionStarted() {
					return didStartExecution && !executionPrevented;
				},
				setArguments(args) {
					executedArguments = structuredClone(args);
				},
				markDispatched() {
					didDispatchExecution = true;
				},
				capture(options) {
					executionPrevented ||= options?.noStart === true;
					didStartExecution ||= didDispatchExecution;
					consumeBlocked();
					const adjustedArguments = consumeAdjustedParamsForToolCall(params.toolCallId, params.runId);
					if (isRecord(adjustedArguments)) executedArguments = adjustedArguments;
					if (!state.consumed) state.snapshot = {
						executedArguments: structuredClone(executedArguments),
						executionStarted: didStartExecution && !executionPrevented
					};
				},
				consumeBlocked,
				dispose() {
					if (states.get(params.toolCallId) === state && (state.consumed || !state.retainAfterCompletion)) states.delete(params.toolCallId);
					consumeAdjustedParamsForToolCall(params.toolCallId, params.runId);
				}
			};
		}
	};
}
//#endregion
//#region src/agents/harness/tool-invocation.ts
/** Owns host execution and presentation; adapters retain their native terminal owner. */
async function runAgentHarnessToolInvocation(params) {
	const startedAt = params.startedAt ?? Date.now();
	const initialArguments = params.initialArguments ?? asNonArrayRecord(params.call.arguments);
	const boundary = params.boundaries.begin({
		toolCallId: params.call.toolCallId,
		runId: params.runId,
		arguments: initialArguments,
		retainAfterCompletion: params.retainExecutionSnapshot
	});
	let rawResult;
	try {
		const tool = params.tool;
		if (!tool) throw new Error(params.unavailableToolMessage ?? `OpenClaw tool is unavailable: ${params.call.toolName}`);
		const prepare = tool.prepareArguments;
		const toolArgs = prepare ? Reflect.apply(prepare, tool, [params.call.arguments]) : params.call.arguments;
		let preparedArgs = toolArgs;
		if (params.prepareArguments) {
			const prepared = params.prepareArguments(toolArgs, Boolean(prepare));
			preparedArgs = isPromiseLike(prepared) ? await prepared : prepared;
		}
		boundary.setArguments(isRecord(preparedArgs) ? preparedArgs : initialArguments);
		const beforeExecuteResult = params.beforeExecute?.();
		if (beforeExecuteResult) await beforeExecuteResult;
		params.assertCurrent?.();
		boundary.markDispatched();
		const shouldValidateArguments = params.shouldValidateArguments?.() ?? true;
		const invokeTool = () => tool.execute(params.call.toolCallId, preparedArgs, params.signal);
		rawResult = await (params.validateArguments && shouldValidateArguments ? runWithToolExecutionValidation(params.call.toolCallId, params.validateArguments, invokeTool) : invokeTool());
		boundary.capture();
		const executedArguments = boundary.executedArguments;
		const rawIsError = isToolResultError(rawResult);
		params.beforeSnapshotResult?.({
			boundary,
			startedAt,
			executedArguments,
			rawResult,
			rawIsError
		});
		const rawFailureKind = resolveToolResultFailureKind(rawResult);
		const rawResultSnapshot = params.snapshotResult ? params.snapshotResult(rawResult) : rawResult;
		const execution = {
			boundary,
			startedAt,
			executedArguments,
			rawResult,
			rawResultSnapshot,
			rawIsError,
			rawFailureKind
		};
		params.onExecutionResult?.(execution);
		const result = await params.applyMiddleware({
			threadId: params.call.threadId,
			turnId: params.call.turnId,
			toolCallId: params.call.toolCallId,
			toolName: params.call.toolName,
			args: structuredClone(execution.executedArguments),
			cwd: params.call.cwd,
			isError: execution.rawIsError,
			result: rawResult
		});
		const presentation = resolveAgentHarnessToolResultPresentation({
			result,
			executionIsError: execution.rawIsError,
			executionFailureKind: execution.rawFailureKind
		});
		const response = params.onResult({
			...execution,
			result,
			observerResult: presentation.result,
			isError: presentation.isError,
			failureKind: presentation.failureKind
		});
		return isPromiseLike(response) ? await response : response;
	} catch (error) {
		boundary.capture({ noStart: consumeToolExecutionNotStarted(error) });
		const response = params.onError({
			error,
			boundary,
			startedAt,
			executedArguments: boundary.executedArguments,
			rawResult
		});
		return isPromiseLike(response) ? await response : response;
	} finally {
		boundary.dispose();
	}
}
//#endregion
//#region src/plugin-sdk/agent-harness-tool-runtime.ts
function createAgentHarnessToolSurfaceRuntime(params) {
	const runtime = createAgentHarnessToolSurfaceRuntimeCore(params);
	const catalog = runtime;
	return {
		codeModeControlsEnabled: runtime.codeModeControlsEnabled,
		config: runtime.config,
		includeToolSearchControls: runtime.includeToolSearchControls,
		runtimeToolAllowlist: runtime.runtimeToolAllowlist,
		toolSearchCatalogExecutor: catalog.toolSearchCatalogExecutor,
		toolSearchCatalogRef: catalog.toolSearchCatalogRef,
		toolSearchControlsEnabled: runtime.toolSearchControlsEnabled,
		cleanup: runtime.cleanup,
		compactTools: (tools, { hookContext, localModelLeanApplied } = {}) => {
			const { tools: compacted, promptToolPolicy } = runtime.compactTools(tools, {
				hookContext,
				localModelLeanApplied
			});
			return {
				tools: compacted,
				promptToolPolicy
			};
		}
	};
}
//#endregion
export { recordAgentHarnessMessagingDelivery as a, createAgentHarnessToolExecutionRegistry as i, runAgentHarnessToolInvocation as n, recordAgentHarnessToolResultMedia as o, createAgentHarnessToolExecutionBoundaryRegistry as r, recordAgentHarnessToolResultTelemetry as s, createAgentHarnessToolSurfaceRuntime as t };
