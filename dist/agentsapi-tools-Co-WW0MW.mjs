import { a as asOptionalRecord, c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { a as resolveAgentDir } from "./agent-scope-config-CDYpzA0r.mjs";
import { w as isSubagentSessionKey } from "./session-key-C09ow4h0.mjs";
import { n as validateJsonSchemaValue } from "./schema-validator-qnYkiHpy.mjs";
import { Q as finalizeToolTerminalPresentation, r as getBeforeToolCallFailureDisposition } from "./agent-tools.before-tool-call-CVkimGUL.mjs";
import { f as sliceToolResultTextToBudget, i as resolveLiveToolResultMaxChars, t as DEFAULT_MAX_LIVE_TOOL_RESULT_CHARS } from "./tool-result-limits-B-fhY8wF.mjs";
import "./string-coerce-runtime-50qKeWeL.mjs";
import "./text-utility-runtime-BDs7x8Fk.mjs";
import { i as getPluginToolSideEffectOwnerKey, r as getPluginToolMeta } from "./tool-metadata-DEC0Rqn3.mjs";
import { r as finalizeAgentToolAvailability } from "./agent-tool-availability-Bgm3tNkT.mjs";
import { n as textResult } from "./tool-results-BCM3fdVS.mjs";
import { n as isToolResultError, s as resolveToolExecutionErrorKind, t as formatToolExecutionErrorMessage } from "./tool-result-error-DGhCl3TG.mjs";
import { r as isReplaySafeToolCall } from "./tool-mutation-CDE0DtL7.mjs";
import { r as isMessagingTool } from "./embedded-agent-messaging-BeWrbIx3.mjs";
import { t as runAgentHarnessAfterToolCallHook } from "./hook-helpers-BXyGP6P6.mjs";
import { t as buildAgentHookContextChannelFields } from "./hook-agent-context-Bx9S6KFK.mjs";
import { i as projectRuntimeToolInputSchema } from "./tool-schema-projection-D9z9oa3w.mjs";
import { i as normalizeAcceptedSessionSpawnResult } from "./accepted-session-spawn-DpD0J38H.mjs";
import { t as log } from "./logger-BpegRAAz.mjs";
import { a as buildEmbeddedAttemptToolRunContext } from "./settled-turn-finalization-result-BC1GuVZk.mjs";
import { n as normalizeAgentRuntimeTools } from "./tools-Xj0amRUJ.mjs";
import { t as applyEmbeddedAttemptToolsAllow } from "./attempt-tool-construction-plan-7h3_PwTS.mjs";
import { d as sanitizeToolResult, i as extractToolErrorMessage, l as readAsyncStartedTaskIds, o as isAsyncStartedToolResult } from "./embedded-agent-tool-results-C0yTOgai.mjs";
import { a as collectMessagingMediaUrlsFromRecord, n as extractMessagingToolSendResult, r as extractMessagingToolSourceReplyPayload, t as extractMessagingToolSend } from "./embedded-agent-messaging-extraction-Cuu20DQX.mjs";
import { n as isDeliveredMessagingToolResult, t as isDeliveredMessageToolOnlySourceReplyResult } from "./embedded-agent-message-tool-source-reply-Dgs4P3v9.mjs";
import { t as createAgentToolResultMiddlewareRunner } from "./tool-result-middleware-CNpMp9Ga.mjs";
import "./json-schema-runtime-WxokAVVM.mjs";
import "./agent-harness-runtime-C7pYQoeO.mjs";
import { a as recordAgentHarnessMessagingDelivery, n as runAgentHarnessToolInvocation, o as recordAgentHarnessToolResultMedia, r as createAgentHarnessToolExecutionBoundaryRegistry } from "./agent-harness-tool-runtime-7tRfILdZ.mjs";
import { g as normalizeOpenAIStrictCompatSchema } from "./provider-tools-DajrfQK1.mjs";
import { c as recordAgentsApiToolTranscript } from "./agentsapi-transcript-DLQWS8fR.mjs";
//#region extensions/agentsapi/agentsapi-tools.ts
/** Gateway functions retain host authority; shell and file tools stay in the hosted VM. */
function buildAgentsApiToolSurface(params, signal, assertCurrent, registerCleanup) {
	assertCurrent();
	const agentId = params.agentId;
	if (!agentId) throw new Error("Agents API tool construction requires a resolved agent ID");
	const forceMessageTool = params.disableMessageTool !== true && (params.forceMessageTool === true || params.sourceReplyDeliveryMode === "message_tool_only");
	const runContext = buildEmbeddedAttemptToolRunContext({
		...params,
		forceMessageTool
	});
	const policySessionKey = params.sandboxSessionKey ?? params.sessionKey;
	const cwd = params.cwd ?? params.workspaceDir;
	const channelId = buildAgentHookContextChannelFields({
		...params,
		sessionKey: policySessionKey
	}).channelId;
	const createToolSurface = params.hostCapabilities.createToolSurface;
	if (!createToolSurface) throw new Error("Agents API tool construction requires a current host capability");
	const constructed = params.disableTools ? [] : createToolSurface({
		...runContext,
		agentId,
		policyAgentId: params.sandboxAgentId ?? agentId,
		sessionKey: policySessionKey,
		runSessionKey: params.sessionKey !== policySessionKey ? params.sessionKey : void 0,
		sessionId: params.sessionId,
		runId: params.runId,
		config: params.config,
		agentDir: params.agentDir ?? resolveAgentDir(params.config ?? {}, agentId),
		workspaceDir: params.workspaceDir,
		cwd,
		spawnWorkspaceDir: params.workspaceDir,
		preparedModelRuntime: params.preparedModelRuntime,
		skillsSnapshot: params.skillsSnapshot,
		authProfileStore: params.toolAuthProfileStore ?? params.authProfileStore,
		messageProvider: params.messageChannel ?? params.messageProvider,
		messageChannel: params.messageChannel,
		toolPolicyMessageProvider: params.messageProvider ?? params.messageChannel,
		channelContext: params.channelContext,
		hookChannelId: channelId,
		inboundEventKind: params.currentInboundEventKind,
		requireExplicitMessageTarget: params.requireExplicitMessageTarget ?? (params.sessionKey !== void 0 && isSubagentSessionKey(params.sessionKey)),
		disableMessageTool: params.disableMessageTool,
		forceMessageTool,
		...params.onToolResult ? { questionPrompt: {
			send: params.onToolResult,
			messageChannel: params.messageChannel
		} } : {},
		inputProvenance: params.inputProvenance,
		trustedInternalHandoff: params.trustedInternalHandoff,
		delegationCapability: params.delegationCapability,
		allowGatewaySubagentBinding: params.allowGatewaySubagentBinding,
		githubPublicationAvailable: params.githubPublicationAvailable,
		abortSignal: signal,
		onToolOutcome: params.onToolOutcome,
		isTurnTainted: params.isTurnTainted,
		allocateToolOutcomeOrdinal: params.allocateToolOutcomeOrdinal,
		registerRunCleanup: registerCleanup,
		oneShotCliRun: params.oneShotCliRun,
		modelProvider: params.model.provider,
		modelId: params.modelId,
		modelApi: params.model.api,
		modelCompat: params.model.compat,
		modelContextWindowTokens: params.contextTokenBudget ?? params.model.contextWindow,
		modelHasVision: false,
		includeToolSearchControls: false,
		toolConstructionPlan: {
			includeBaseCodingTools: false,
			includeShellTools: false,
			includeChannelTools: false,
			includeOpenClawTools: true,
			includePluginTools: true
		}
	}, { cwd });
	const tools = applyEmbeddedAttemptToolsAllow(constructed.filter((tool) => tool.name !== "web_search" && tool.name !== "image_generate" && tool.name !== "sessions_yield"), runContext.runtimeToolAllowlist, { toolMeta: getPluginToolMeta });
	const normalized = normalizeAgentRuntimeTools({
		tools,
		runtimePlan: params.runtimePlan,
		provider: params.provider,
		config: params.config,
		workspaceDir: params.workspaceDir,
		modelId: params.modelId,
		modelApi: params.model.api,
		model: params.model,
		allowProviderRuntimePluginLoad: false
	});
	finalizeAgentToolAvailability(normalized);
	const entries = normalized.toSorted((a, b) => a.name.localeCompare(b.name)).map((tool) => {
		const projection = projectRuntimeToolInputSchema(normalizeOpenAIStrictCompatSchema(tool.parameters) ?? tool.parameters, `${tool.name}.parameters`);
		if (projection.violations.length || !isRecord(projection.schema)) throw new Error(`Agents API tool has an unsupported input schema: ${tool.name}`);
		return {
			tool,
			schema: projection.schema,
			validationCacheKey: `agentsapi-tool-input:${tool.name}:${JSON.stringify(projection.schema)}`
		};
	});
	const toolMap = new Map(entries.map((entry) => [entry.tool.name, entry]));
	const declarations = entries.map(({ tool, schema }) => ({
		type: "function",
		name: tool.name,
		description: tool.description,
		parameters: schema
	}));
	const middleware = createAgentToolResultMiddlewareRunner({
		runtime: "agentsapi",
		agentId,
		sessionId: params.sessionId,
		sessionKey: params.sessionKey,
		runId: params.runId
	});
	const delivery = {
		didSendViaMessagingTool: false,
		messagingToolSentTexts: [],
		messagingToolSentMediaUrls: [],
		messagingToolSentTargets: [],
		messagingToolSourceReplyPayloads: [],
		toolMediaUrls: []
	};
	const toolMetas = [];
	const runtimeFacts = { acceptedSessionSpawns: [] };
	let lastToolError;
	const executionBoundaries = createAgentHarnessToolExecutionBoundaryRegistry();
	const contextTokens = params.contextTokenBudget ?? params.model.contextWindow;
	const maxChars = typeof contextTokens === "number" && Number.isFinite(contextTokens) && contextTokens > 0 ? resolveLiveToolResultMaxChars({ contextWindowTokens: contextTokens }) : DEFAULT_MAX_LIVE_TOOL_RESULT_CHARS;
	return {
		declarations,
		delivery,
		runtimeFacts,
		toolMetas,
		get lastToolError() {
			return lastToolError;
		},
		execute: async (call) => {
			assertCurrent();
			signal.throwIfAborted();
			const entry = toolMap.get(call.name);
			let startedAt;
			let executedArgs = isRecord(call.arguments) ? call.arguments : {};
			let executionBoundary;
			let terminalObserved = false;
			let resultObserved = false;
			let afterHookDispatched = false;
			let replaySafe = false;
			let asyncStarted = false;
			let asyncTaskIds = {};
			let sourceReplyDelivered = false;
			let terminate = false;
			const observeTerminal = (result, outcome, error) => {
				if (terminalObserved) return;
				terminalObserved = true;
				executionBoundary.capture();
				executedArgs = executionBoundary.executedArguments;
				const ownerKey = entry ? getPluginToolSideEffectOwnerKey(entry.tool) : void 0;
				const pluginMeta = entry ? getPluginToolMeta(entry.tool) : void 0;
				const resolution = params.observeToolTerminal?.({
					toolCallId: call.call_id,
					toolName: call.name,
					arguments: executedArgs,
					result,
					outcome,
					executionStarted: executionBoundary.executionStarted,
					replaySafe: !asyncStarted && (!pluginMeta || pluginMeta.replaySafe === true) && isReplaySafeToolCall(call.name, executedArgs),
					...ownerKey ? { ownerMutation: { ownerKey } } : {},
					...error ? { failure: { error } } : {}
				});
				if (resolution) {
					lastToolError = resolution.lastToolError;
					if (resolution.executedArguments) executedArgs = resolution.executedArguments;
					replaySafe = [
						"not_started",
						"read_completed",
						"failed_no_effect"
					].includes(resolution.effectReceipt.state);
				}
			};
			const finishPresentation = (result, isError) => {
				if (resultObserved) return;
				resultObserved = true;
				toolMetas.push({
					toolName: call.name,
					toolCallId: call.call_id,
					isError,
					replaySafe,
					...asyncStarted ? {
						asyncStarted: true,
						...asyncTaskIds
					} : {},
					...terminate ? { terminate: true } : {}
				});
				try {
					params.onAgentToolResult?.({
						toolName: call.name,
						result: sanitizeToolResult(result),
						isError
					});
				} catch (error) {
					log.warn(`Agents API tool result observer failed: ${formatToolExecutionErrorMessage(error, "Unknown error")}`);
				}
				try {
					finalizeToolTerminalPresentation({
						toolCallId: call.call_id,
						runId: params.runId,
						toolName: call.name,
						result,
						isError,
						observer: params.onToolOutcome
					});
				} catch (error) {
					log.warn(`Agents API tool presentation observer failed: ${formatToolExecutionErrorMessage(error, "Unknown error")}`);
				}
			};
			const dispatchAfterHook = (result, error) => {
				if (afterHookDispatched) return;
				afterHookDispatched = true;
				runAgentHarnessAfterToolCallHook({
					runId: params.runId,
					agentId,
					sessionId: params.sessionId,
					sessionKey: params.sessionKey,
					channelId,
					toolName: call.name,
					toolCallId: call.call_id,
					startArgs: executedArgs,
					...result !== void 0 ? { result } : {},
					...error ? { error } : {},
					startedAt
				}).catch((failure) => {
					log.warn(`Agents API after-tool hook failed: ${formatToolExecutionErrorMessage(failure, "Unknown error")}`);
				});
			};
			const messagingContext = {
				config: params.config,
				currentChannelId: params.currentChannelId,
				currentMessagingTarget: params.currentMessagingTarget,
				currentThreadId: params.currentThreadTs,
				currentMessageId: params.currentMessageId,
				replyToMode: params.replyToMode,
				hasRepliedRef: params.hasRepliedRef ? { value: params.hasRepliedRef.value } : void 0
			};
			const { transcriptResult, ...nativeResult } = await runAgentHarnessToolInvocation({
				tool: entry?.tool,
				unavailableToolMessage: `OpenClaw tool is not available for this turn: ${call.name}`,
				call: {
					toolCallId: call.call_id,
					toolName: call.name,
					arguments: call.arguments,
					turnId: call.turn_id,
					cwd
				},
				runId: params.runId,
				signal,
				boundaries: executionBoundaries,
				prepareArguments: (args) => {
					if (!isRecord(args)) throw new Error(`Arguments for OpenClaw tool ${call.name} must be an object`);
					return args;
				},
				assertCurrent: () => {
					assertCurrent();
					signal.throwIfAborted();
				},
				beforeExecute: async () => {
					await params.onToolStreamBoundary?.();
					assertCurrent();
					signal.throwIfAborted();
				},
				validateArguments: entry && getPluginToolMeta(entry.tool)?.mcp?.operation !== "tool" ? (value) => {
					assertCurrent();
					signal.throwIfAborted();
					const validation = validateJsonSchemaValue({
						schema: entry.schema,
						cacheKey: entry.validationCacheKey,
						value
					});
					if (!validation.ok) throw new Error(`Invalid arguments for OpenClaw tool ${call.name}: ${validation.errors.slice(0, 4).map((error) => error.text).join("; ")}`);
				} : void 0,
				applyMiddleware: (event) => middleware.applyToolResultMiddleware(event),
				onExecutionResult: entry ? (execution) => {
					executionBoundary = execution.boundary;
					startedAt = execution.startedAt;
					executedArgs = execution.executedArguments;
					const { rawResult: raw, rawIsError } = execution;
					const tool = entry.tool;
					asyncStarted = !rawIsError && isAsyncStartedToolResult(raw);
					asyncTaskIds = asyncStarted ? readAsyncStartedTaskIds(raw) : {};
					const acceptedSpawn = call.name === "sessions_spawn" && !rawIsError ? normalizeAcceptedSessionSpawnResult(raw) : null;
					if (acceptedSpawn) runtimeFacts.acceptedSessionSpawns?.push(acceptedSpawn);
					sourceReplyDelivered = call.name === "message" && asOptionalRecord(asOptionalRecord(raw.details)?.messageDelivery)?.sourceReplyDelivered === true;
					const sourceRouteDelivered = isDeliveredMessageToolOnlySourceReplyResult({
						sourceReplyDeliveryMode: params.sourceReplyDeliveryMode,
						toolName: call.name,
						args: executedArgs,
						result: raw,
						isError: rawIsError
					});
					terminate = sourceReplyDelivered || raw.terminate === true && !(sourceRouteDelivered && executedArgs.final === false);
					if (sourceReplyDelivered) delivery.sourceReplyDelivered = true;
					if (sourceRouteDelivered || sourceReplyDelivered) delivery.didDeliverSourceReplyViaMessageTool = true;
					recordDelivery(tool, executedArgs, raw, params, messagingContext, delivery, signal, sourceRouteDelivered ? executedArgs.final !== false : void 0);
					observeTerminal(raw, rawIsError ? "failure" : "success", rawIsError ? extractToolErrorMessage(raw) : void 0);
					execution.executedArguments = executedArgs;
				} : void 0,
				onResult: ({ result: presented, observerResult: observed, isError }) => {
					finishPresentation(observed, isError);
					assertCurrent();
					signal.throwIfAborted();
					dispatchAfterHook(presented);
					const text = serializeToolText(presented.content, maxChars);
					return {
						transcriptResult: observed,
						...isError ? {
							success: false,
							error: text
						} : {
							success: true,
							output: text
						}
					};
				},
				onError: ({ error, boundary, executedArguments, rawResult, startedAt: invocationStartedAt }) => {
					executionBoundary = boundary;
					executedArgs = executedArguments;
					startedAt = invocationStartedAt;
					const message = sanitizeToolResult(formatToolExecutionErrorMessage(error, "OpenClaw tool failed"));
					const disposition = getBeforeToolCallFailureDisposition(error) ?? (signal.aborted ? "cancelled" : resolveToolExecutionErrorKind(error));
					const failed = textResult(message, {
						status: disposition,
						error: message
					});
					observeTerminal(rawResult ?? error, "failure", message);
					finishPresentation(failed, true);
					signal.throwIfAborted();
					assertCurrent();
					dispatchAfterHook(void 0, message);
					return {
						transcriptResult: failed,
						success: false,
						error: sliceToolResultTextToBudget(message, maxChars)
					};
				}
			});
			await recordAgentsApiToolTranscript(params, call, transcriptResult, !nativeResult.success, assertCurrent);
			return {
				...nativeResult,
				...sourceReplyDelivered ? { sourceReplyDelivered: true } : {},
				...terminate ? { terminate: true } : {}
			};
		}
	};
}
function recordDelivery(tool, args, raw, params, messagingContext, delivery, signal, sourceReplyFinal) {
	if (isMessagingTool(tool.name) && isDeliveredMessagingToolResult({
		toolName: tool.name,
		args,
		result: raw
	})) {
		const payload = extractMessagingToolSourceReplyPayload(raw);
		if (payload) recordAgentHarnessMessagingDelivery({
			facts: delivery,
			sourceReplyPayload: payload,
			sourceReplyFinal: args.final !== false
		});
		else {
			const routedArgs = {
				provider: params.messageChannel ?? params.messageProvider,
				...args
			};
			const pending = extractMessagingToolSend(tool.name, routedArgs, messagingContext);
			const text = [
				"message",
				"text",
				"content",
				"body"
			].map((key) => args[key]).find((value) => typeof value === "string" && value.trim().length > 0);
			const mediaUrls = collectMessagingMediaUrlsFromRecord(args);
			recordAgentHarnessMessagingDelivery({
				facts: delivery,
				target: pending ? extractMessagingToolSendResult(pending, raw) : void 0,
				text,
				mediaUrls,
				sourceReplyFinal
			});
		}
	}
	if (signal.aborted || isToolResultError(raw)) return;
	const pluginMeta = getPluginToolMeta(tool);
	const trustedTools = pluginMeta ? new Set(pluginMeta.trustedLocalMedia === true ? [tool.name] : []) : void 0;
	const mediaToolName = pluginMeta && pluginMeta.trustedLocalMedia !== true ? void 0 : tool.name;
	const media = recordAgentHarnessToolResultMedia({
		facts: delivery,
		toolName: mediaToolName,
		result: raw,
		trustedLocalMediaToolNames: trustedTools
	});
	if (!media) return;
	if (media.trustedLocalMedia && (!pluginMeta || pluginMeta.trustedLocalMedia === true) && media.mediaUrls.length) delivery.toolTrustedLocalMedia = true;
}
function serializeToolText(content, maxChars) {
	let text = "";
	for (const block of content) {
		if (text.length >= maxChars) break;
		const next = block.type === "text" ? sanitizeToolResult(block.text) : "[Image result omitted from Agents API function output]";
		text += `${text ? "\n" : ""}${sliceToolResultTextToBudget(next, maxChars - text.length)}`;
	}
	return sliceToolResultTextToBudget(text || "Tool completed with no text output.", maxChars);
}
//#endregion
export { buildAgentsApiToolSurface as t };
