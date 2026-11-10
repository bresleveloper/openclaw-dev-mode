import { a as asOptionalRecord, c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { w as isSubagentSessionKey } from "./session-key-CSDERtm3.mjs";
import { a as resolveAgentDir } from "./agent-scope-config-fjA2T9Gz.mjs";
import { n as validateJsonSchemaValue } from "./schema-validator-B9g4ZpIt.mjs";
import { i as getPluginToolSideEffectOwnerKey, r as getPluginToolMeta } from "./tool-metadata-CaNEdKPR.mjs";
import { n as textResult } from "./tool-results-BCM3fdVS.mjs";
import { r as finalizeAgentToolAvailability } from "./agent-tool-availability-DZN62JsD.mjs";
import { T as finalizeToolTerminalPresentation, r as getBeforeToolCallFailureDisposition } from "./agent-tools.before-tool-call-CtP0G8Wg.mjs";
import { n as isToolResultError, s as resolveToolExecutionErrorKind, t as formatToolExecutionErrorMessage } from "./tool-result-error-IpvGgAny.mjs";
import { i as resolveStoredSessionPermissionPolicy } from "./tool-fs-policy-C65zBDHN.mjs";
import { f as sliceToolResultTextToBudget, i as resolveLiveToolResultMaxChars, t as DEFAULT_MAX_LIVE_TOOL_RESULT_CHARS } from "./tool-result-limits-tYfGdUlb.mjs";
import "./string-coerce-runtime-BbIJhy7G.mjs";
import "./text-utility-runtime-B9RB6Cg0.mjs";
import { n as isMessagingTool } from "./embedded-agent-messaging-BHfhPlTk.mjs";
import { r as isReplaySafeToolCall } from "./tool-mutation-BTW6eoAN.mjs";
import { t as runAgentHarnessAfterToolCallHook } from "./hook-helpers-C0CV-oid.mjs";
import { t as buildAgentHookContextChannelFields } from "./hook-agent-context-C9bjjC7S.mjs";
import { i as projectRuntimeToolInputSchema } from "./tool-schema-projection-CfXbgFr1.mjs";
import { i as normalizeAcceptedSessionSpawnResult } from "./accepted-session-spawn-Bo7jgCE_.mjs";
import { t as log } from "./logger-BpVUgEyL.mjs";
import { n as normalizeAgentRuntimeTools } from "./tools-D4qtvvFO.mjs";
import { t as applyEmbeddedAttemptToolsAllow } from "./attempt-tool-construction-plan-D12sns28.mjs";
import { t as buildEmbeddedAttemptToolRunContext } from "./attempt-tool-run-context-B4q5w5uB.mjs";
import { n as extractMessagingToolSendResult, r as extractMessagingToolSourceReplyPayload, t as extractMessagingToolSend } from "./embedded-agent-messaging-extraction-DjEst-db.mjs";
import { n as isDeliveredMessagingToolResult, t as isDeliveredMessageToolOnlySourceReplyResult } from "./embedded-agent-message-tool-source-reply-CiWOpEbo.mjs";
import { i as extractToolErrorMessage, l as readAsyncStartedTaskIds, o as isAsyncStartedToolResult, u as sanitizeToolResult } from "./embedded-agent-tool-results-0KH5a_sR.mjs";
import { t as collectMessagingMediaUrlsFromRecord } from "./embedded-agent-tool-media-BiXZn9vg.mjs";
import { t as createAgentToolResultMiddlewareRunner } from "./tool-result-middleware-CEf_c4e5.mjs";
import "./json-schema-runtime-DwjLDY1j.mjs";
import "./agent-harness-runtime-k_z2ig1L.mjs";
import "./agent-harness-attempt-runtime-D5l5bBQl.mjs";
import { i as createAgentHarnessToolExecutionBoundaryRegistry, o as recordAgentHarnessMessagingDelivery, r as runAgentHarnessToolInvocation, s as recordAgentHarnessToolResultMedia } from "./agent-harness-tool-runtime-C2ENQGUm.mjs";
import { g as normalizeOpenAIStrictCompatSchema } from "./provider-tools-DynDHTtQ.mjs";
import { u as recordAgentsApiToolTranscript } from "./agentsapi-transcript-D8MyqCGN.mjs";
//#region extensions/agentsapi/agentsapi-tools.ts
/** Gateway functions retain host authority; shell and file tools stay in the hosted VM. */
async function buildAgentsApiToolSurface(params, signal, assertCurrent, registerCleanup) {
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
	const createToolSurfaceAsync = params.hostCapabilities.createToolSurfaceAsync;
	if (!createToolSurfaceAsync) throw new Error("Agents API tool construction requires a current host capability");
	const constructed = params.disableTools ? [] : await createToolSurfaceAsync({
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
		sessionPermissionPolicy: resolveStoredSessionPermissionPolicy(params, params.workspaceDir),
		requireWorkspaceOnly: params.requireWorkspaceOnly,
		exec: {
			...params.execOverrides,
			config: params.config,
			elevated: params.bashElevated
		},
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
	assertCurrent();
	signal.throwIfAborted();
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
					const messageFinal = resolveMessageFinal(executedArgs, params);
					terminate = sourceReplyDelivered && messageFinal || raw.terminate === true && !(sourceRouteDelivered && !messageFinal);
					if (sourceReplyDelivered) delivery.sourceReplyDelivered = true;
					if (sourceRouteDelivered || sourceReplyDelivered) delivery.didDeliverSourceReplyViaMessageTool = true;
					recordDelivery(tool, executedArgs, raw, params, messagingContext, delivery, signal, sourceRouteDelivered ? messageFinal : void 0);
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
				...terminate ? { terminate: true } : {}
			};
		}
	};
}
/** Whether a delivered source send ends the turn; an omitted `final` takes the run's default. */
function resolveMessageFinal(args, params) {
	return args.final === void 0 ? params.messageToolFinalByDefault !== false : args.final !== false;
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
			sourceReplyFinal: resolveMessageFinal(args, params)
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
