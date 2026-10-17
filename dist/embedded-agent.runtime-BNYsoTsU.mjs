import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { t as formatErrorMessage } from "./errors-O33D01XW.mjs";
import { t as truncateUtf8Prefix } from "./utf8-truncate-_hf7tp13.mjs";
import { i as createNativeModelOwnedRuntimeModel } from "./defaults-Jag53zwP.mjs";
import { f as hasRuntimeContextMarker, g as readRuntimeContextMetadata, p as isRuntimeContextMessage } from "./types-CQc6JNG4.mjs";
import { l as wrapToolWithBeforeToolCallHook } from "./agent-tools.before-tool-call-CVkimGUL.mjs";
import { t as WORKER_INFERENCE_MAX_CONTEXT_MESSAGES } from "./worker-inference-B7U4TRc2.mjs";
import "./worker-admission-CNeLWzVQ.mjs";
import { i as AuthStorage, t as ModelRegistry } from "./model-registry-DKSOyLSb.mjs";
import { l as resolveAssistantMessagePhase } from "./chat-message-content-C-d0FKNG.mjs";
import { a as setPluginToolMeta } from "./tool-metadata-DEC0Rqn3.mjs";
import { h as bindBeforeToolCallMetadata, i as copyAgentToolMetadata } from "./agent-tool-metadata-BiQWQ4ti.mjs";
import { h as wrapToolWithGatewayCallerIdentity } from "./gateway-caller-context-DWr-fdGt.mjs";
import { t as parseReplyDirectives } from "./reply-directives-Ciui4dZv.mjs";
import { n as recordModelFallbackStop } from "./model-fallback-stop-BXDxJQSp.mjs";
import { s as hasModelFallbackStop } from "./failover-error-BZ8WG_0i.mjs";
import { r as buildBootstrapContextForFiles } from "./bootstrap-DROECufe.mjs";
import { c as normalizeAgentRunAttemptTerminal, l as projectAgentRunAttemptTerminal, s as mergeAgentRunAttemptTerminal } from "./agent-run-terminal-outcome-BTCs8JFs.mjs";
import { m as wrapToolWithAbortSignal } from "./tool-contract-error-BBuaWRXF.mjs";
import { i as projectMemoryFlushTools } from "./core-coding-tools-LRIc9YxG.mjs";
import { t as DefaultResourceLoader, w as SettingsManager } from "./resource-loader-Cj2qTSi1.mjs";
import { r as guardSessionManager, t as createAgentSession } from "./sdk-Gm0i9GqF.mjs";
import { t as SessionManager } from "./session-manager-fHN-UyrU.mjs";
import { t as createAgentHarnessToolSurfaceRuntimeCore } from "./tool-surface-bridge-hvIVz7EU.mjs";
import { s as disposeAllCodeModeRuns } from "./code-mode-state-De9n3gQ9.mjs";
import { t as redactAgentDiagnosticPayload } from "./diagnostic-redaction-Dc_sTF-6.mjs";
import { a as toToolDefinitions } from "./agent-tool-definition-adapter-v71e4SNl.mjs";
import { t as materializeSkillResources } from "./resources-DtTD25Od.mjs";
import { i as toWorkerTranscriptMessage, n as isWorkerTranscriptMessageFrameSafe, o as projectWorkerTextOrImageContent, t as WORKER_PROVIDER_REPLAY_LOCAL_RETRY_MESSAGE } from "./transcript-message-Dz1c-AeG.mjs";
import { a as createWorkerPlacementTools, i as WORKER_TOOL_CONFIG, r as createWorkerBrowserToolRuntime, t as createWorkerComputerTool } from "./computer-runtime-TxTpOBcN.mjs";
import { n as windowWorkerReplayMessages } from "./replay-message-window-CB5m9HXa.mjs";
//#region src/worker/embedded-agent-live.runtime.ts
const MAX_LIVE_EVENT_BYTES = 32768;
const MAX_LIVE_PREVIEW_BYTES = 4096;
function liveEventBytes(event) {
	try {
		return Buffer.byteLength(JSON.stringify(event), "utf8");
	} catch {
		return Number.POSITIVE_INFINITY;
	}
}
function truncateLiveText(value) {
	if (value.length <= MAX_LIVE_PREVIEW_BYTES && Buffer.byteLength(value, "utf8") <= MAX_LIVE_PREVIEW_BYTES) return value;
	const suffix = "…";
	return `${truncateUtf8Prefix(value, MAX_LIVE_PREVIEW_BYTES - Buffer.byteLength(suffix, "utf8"))}${suffix}`;
}
function boundLiveValue(value) {
	try {
		const serialized = JSON.stringify(value);
		if (serialized === void 0) return null;
		if (Buffer.byteLength(serialized, "utf8") <= MAX_LIVE_PREVIEW_BYTES) return value;
		return {
			truncated: true,
			preview: truncateLiveText(serialized)
		};
	} catch {
		return {
			truncated: true,
			preview: "[unserializable live payload]"
		};
	}
}
function redactLiveText(value) {
	const redacted = redactAgentDiagnosticPayload(value);
	return truncateLiveText(typeof redacted === "string" ? redacted : "[unreadable diagnostic text]");
}
function boundLiveEvent(event) {
	if (!((event.kind === "assistant" || event.kind === "thinking") && event.payload.text.length > MAX_LIVE_EVENT_BYTES) && liveEventBytes(event) <= MAX_LIVE_EVENT_BYTES) return event;
	let bounded;
	if (event.kind === "assistant") {
		const text = truncateLiveText(event.payload.text);
		bounded = {
			kind: "assistant",
			payload: {
				...event.payload,
				text,
				delta: text,
				replace: true
			}
		};
	} else if (event.kind === "thinking") bounded = {
		kind: "thinking",
		payload: {
			text: truncateLiveText(event.payload.text),
			delta: truncateLiveText(event.payload.delta)
		}
	};
	else if (event.kind === "tool") {
		if (event.payload.phase === "start") bounded = {
			kind: "tool",
			payload: {
				...event.payload,
				args: boundLiveValue(event.payload.args)
			}
		};
		else if (event.payload.phase === "update") bounded = {
			kind: "tool",
			payload: {
				...event.payload,
				partialResult: boundLiveValue(event.payload.partialResult)
			}
		};
		else bounded = {
			kind: "tool",
			payload: {
				...event.payload,
				result: boundLiveValue(event.payload.result)
			}
		};
	} else throw new Error(`worker live ${event.kind} event exceeds the protocol payload limit`);
	if (liveEventBytes(bounded) > MAX_LIVE_EVENT_BYTES) throw new Error(`worker live ${event.kind} event cannot fit the protocol payload limit`);
	return bounded;
}
function readAssistantSnapshot(message) {
	if (message.role !== "assistant") return { text: "" };
	const blocks = message.content.flatMap((part) => part.type === "text" ? [{
		text: part.text,
		phase: resolveAssistantMessagePhase({
			...message,
			content: [part]
		})
	}] : []);
	const firstPhase = blocks[0]?.phase;
	const phase = blocks.every((block) => block.phase === firstPhase) ? firstPhase : void 0;
	return {
		text: blocks.filter((block) => phase === "commentary" || block.phase !== "commentary").map((block) => block.text).join(""),
		phase
	};
}
function readAssistantThinking(message) {
	if (message.role !== "assistant") return "";
	return message.content.filter((part) => part.type === "thinking").map((part) => part.thinking).join("");
}
function createWorkerLiveRuntime(client) {
	let previewEnabled = true;
	const enqueueLive = (event) => {
		if (previewEnabled) previewEnabled = client.enqueuePreview(boundLiveEvent(event));
	};
	const startedAt = Date.now();
	let terminalLiveEvent;
	let terminalOutcome = { kind: "ok" };
	let replayInvalid = false;
	const enqueueTerminal = (input) => {
		terminalOutcome = mergeAgentRunAttemptTerminal(terminalOutcome, normalizeAgentRunAttemptTerminal({
			aborted: input.aborted,
			promptError: input.error
		}));
		const terminal = projectAgentRunAttemptTerminal(terminalOutcome);
		const stopReason = terminal.aborted ? "aborted" : terminal.failed ? "error" : input.stopReason;
		terminalLiveEvent = {
			kind: "lifecycle",
			payload: {
				phase: "finishing",
				startedAt,
				endedAt: Date.now(),
				...stopReason ? { stopReason } : {},
				...terminal.aborted ? { aborted: true } : {},
				...replayInvalid ? { replayInvalid: true } : {},
				...!terminal.aborted && typeof terminal.promptError === "string" ? { error: redactLiveText(terminal.promptError) } : {}
			}
		};
	};
	let streamedText = "";
	let streamedPhase;
	let assistantMessageIndex = 0;
	let streamedThinking = "";
	const emitAssistantSnapshot = (message, complete = false) => {
		const { text, phase } = readAssistantSnapshot(message);
		const mediaUrls = complete ? parseReplyDirectives(text).mediaUrls : void 0;
		if (text === streamedText && phase === streamedPhase && !mediaUrls?.length) return;
		const previousText = streamedPhase === "commentary" && phase !== "commentary" ? "" : streamedText;
		const replace = !text.startsWith(previousText);
		enqueueLive({
			kind: "assistant",
			payload: {
				text,
				delta: replace ? text : text.slice(previousText.length),
				...mediaUrls?.length ? { mediaUrls } : {},
				...replace ? { replace: true } : {},
				...phase ? { phase } : {},
				itemId: `assistant-${assistantMessageIndex}`
			}
		});
		streamedText = text;
		streamedPhase = phase;
	};
	const handleSessionEvent = (event) => {
		if (!previewEnabled && event.type !== "agent_end") return;
		if (event.type === "agent_start") {
			enqueueLive({
				kind: "lifecycle",
				payload: {
					phase: "start",
					startedAt
				}
			});
			return;
		}
		if (event.type === "message_start" && event.message.role === "assistant") {
			assistantMessageIndex += 1;
			streamedText = "";
			streamedPhase = void 0;
			streamedThinking = "";
			return;
		}
		if (event.type === "message_update") {
			if (event.assistantMessageEvent.type === "text_delta" || event.assistantMessageEvent.type === "text_end") emitAssistantSnapshot(event.message);
			else if (event.assistantMessageEvent.type === "thinking_delta") {
				streamedThinking = readAssistantThinking(event.message);
				enqueueLive({
					kind: "thinking",
					payload: {
						text: streamedThinking,
						delta: event.assistantMessageEvent.delta
					}
				});
			}
			return;
		}
		if (event.type === "message_end" && event.message.role === "assistant") {
			emitAssistantSnapshot(event.message, true);
			const finalThinking = readAssistantThinking(event.message);
			if (finalThinking !== streamedThinking) enqueueLive({
				kind: "thinking",
				payload: {
					text: finalThinking,
					delta: finalThinking
				}
			});
			return;
		}
		if (event.type === "tool_execution_start" || event.type === "tool_execution_update" || event.type === "tool_execution_end") {
			const tool = {
				name: event.toolName,
				toolCallId: event.toolCallId
			};
			enqueueLive({
				kind: "tool",
				payload: {
					...event.type === "tool_execution_start" ? {
						phase: "start",
						...tool,
						args: redactAgentDiagnosticPayload(event.args)
					} : event.type === "tool_execution_update" ? {
						phase: "update",
						...tool,
						partialResult: redactAgentDiagnosticPayload(event.partialResult)
					} : {
						phase: "result",
						...tool,
						isError: event.isError,
						result: redactAgentDiagnosticPayload(event.result)
					},
					...event.hideFromChannelProgress ? { hideFromChannelProgress: true } : {}
				}
			});
			return;
		}
		if (event.type === "agent_end") {
			const lastAssistant = event.messages.findLast((message) => message.role === "assistant");
			enqueueTerminal({
				stopReason: lastAssistant?.stopReason,
				aborted: lastAssistant?.stopReason === "aborted",
				...lastAssistant?.stopReason === "error" ? { error: lastAssistant.errorMessage ?? "Worker inference failed." } : {}
			});
		}
	};
	const enqueueRunFailure = (failure) => {
		replayInvalid ||= hasModelFallbackStop(failure.error);
		enqueueTerminal({
			aborted: failure.aborted,
			error: formatErrorMessage(failure.error)
		});
	};
	const emitTerminal = async () => {
		if (!terminalLiveEvent) return;
		await client.emitTerminal(boundLiveEvent(terminalLiveEvent));
	};
	return {
		handleSessionEvent,
		enqueueRunFailure,
		emitTerminal
	};
}
//#endregion
//#region src/worker/embedded-agent-transcript.runtime.ts
function toWorkerInferenceMessage(message) {
	if (hasRuntimeContextMarker(message) && !isRuntimeContextMessage(message)) throw new Error("Cloud worker cannot preserve runtime context with media. Stop or reclaim the cloud worker, then retry locally.");
	if (isRuntimeContextMessage(message)) return {
		kind: "complete",
		message: {
			role: "user",
			content: message.content,
			timestamp: message.timestamp,
			runtimeContext: readRuntimeContextMetadata(message)
		}
	};
	if (message.role === "user") return {
		kind: "complete",
		message: {
			role: "user",
			content: typeof message.content === "string" ? message.content : message.content.map(projectWorkerTextOrImageContent),
			timestamp: message.timestamp
		}
	};
	const projected = toWorkerTranscriptMessage(message, "inference");
	if (!projected) throw new Error(`Unsupported inference message role: ${message.role}`);
	return projected;
}
function toWorkerInferenceContext(context) {
	const windowed = windowWorkerReplayMessages(context.messages, WORKER_INFERENCE_MAX_CONTEXT_MESSAGES);
	if (windowed.kind === "provider-replay-unavailable") return windowed;
	const messages = [];
	for (const message of windowed.messages) {
		const projected = toWorkerInferenceMessage(message);
		if (projected.kind === "provider-replay-unavailable") return projected;
		messages.push(projected.message);
	}
	return {
		kind: "complete",
		context: {
			...context.systemPrompt === void 0 ? {} : { systemPrompt: context.systemPrompt },
			messages,
			...context.tools ? { tools: context.tools.map((tool) => ({
				name: tool.name,
				description: tool.description,
				parameters: structuredClone(tool.parameters)
			})) } : {}
		}
	};
}
function createWorkerTranscriptRuntime(client, signal) {
	const pendingTranscriptMessages = [];
	let failedCommit;
	const onMessagePersisted = (message) => {
		const projected = toWorkerTranscriptMessage(message, "transcript");
		if (!projected) return;
		if (projected.kind === "provider-replay-unavailable") throw new Error(`Worker transcript cannot persist authoritative provider replay: ${projected.details.reason}.`);
		if (!isWorkerTranscriptMessageFrameSafe(projected.message)) throw new Error("Worker transcript message exceeds the protocol payload limit.");
		pendingTranscriptMessages.push(projected.message);
	};
	const flushTranscript = async () => {
		while (pendingTranscriptMessages.length > 0) {
			if (signal?.aborted) {
				if (failedCommit) throw failedCommit.error;
				return;
			}
			const batch = pendingTranscriptMessages.slice(0, 64);
			try {
				await client.commit(batch);
			} catch (error) {
				failedCommit = { error };
				throw error;
			}
			failedCommit = void 0;
			pendingTranscriptMessages.splice(0, batch.length);
		}
	};
	let sessionWriteQueue = Promise.resolve();
	const withSessionWriteSettlement = (operation) => {
		const result = sessionWriteQueue.then(async () => {
			const value = await operation();
			await flushTranscript();
			return value;
		});
		sessionWriteQueue = result.then(() => void 0, () => void 0);
		return result;
	};
	return {
		onMessagePersisted,
		withSessionWriteSettlement
	};
}
//#endregion
//#region src/worker/worker-gateway-tools.ts
function createWorkerGatewayToolProxies(surface, client) {
	const tools = [];
	for (const entry of surface.tools) {
		if (entry.execution !== "gateway") continue;
		const tool = {
			...entry.definition,
			execute: async (toolCallId, args, signal, onUpdate) => {
				signal?.throwIfAborted();
				if (!isRecord(args)) throw new Error("Gateway tool arguments must be an object.");
				const seconds = entry.timeout?.argument ? args[entry.timeout.argument] : void 0;
				const timeoutMs = entry.timeout ? Math.max(entry.timeout.minimumMs ?? 0, (typeof seconds === "number" ? seconds : entry.timeout.defaultSeconds ?? 0) * 1e3 + (entry.timeout.paddingMs ?? 0)) : void 0;
				const invocation = {
					generation: surface.generation,
					toolCallId
				};
				const cancel = () => {
					client.cancelGatewayTool(invocation).catch(() => {});
				};
				signal?.addEventListener("abort", cancel, { once: true });
				try {
					const response = await client.invokeGatewayTool({
						...invocation,
						toolId: entry.id,
						arguments: args
					}, {
						replay: entry.replay,
						timeoutMs,
						signal,
						onUpdate: onUpdate ? (result) => onUpdate({
							...result,
							details: result.details
						}) : void 0
					});
					signal?.throwIfAborted();
					if (!response.ok) throw new Error(response.error.message);
					return {
						...response.payload,
						details: response.payload.details
					};
				} finally {
					signal?.removeEventListener("abort", cancel);
				}
			}
		};
		if (entry.plugin) setPluginToolMeta(tool, entry.plugin);
		bindBeforeToolCallMetadata(tool, {
			sourceTool: { ...tool },
			options: { emitDiagnostics: false }
		});
		tools.push(tool);
	}
	return tools;
}
//#endregion
//#region src/worker/embedded-agent.runtime.ts
function toWorkerAgentError(value, fallback) {
	return value instanceof Error ? value : new Error(fallback, { cause: value });
}
async function runWorkerEmbeddedTurn(params) {
	const resources = params.skillResources ? await materializeSkillResources(params.skillResources, () => params.signal?.throwIfAborted(), {
		sessionId: params.sessionId,
		workspaceDir: params.cwd
	}) : void 0;
	try {
		if (params.allowedToolNames.includes("browser") !== (params.browser !== void 0)) throw new Error("Worker Browser authority and launch descriptor must be provided together.");
		if (params.allowedToolNames.includes("computer") !== (params.computer !== void 0)) throw new Error("Worker computer authority and launch descriptor must be provided together.");
		if (params.operationalRunInstance.runId !== params.runId) throw new Error("worker operational run instance disagrees with the admitted turn");
		const toolSurface = params.toolSurface;
		const model = createNativeModelOwnedRuntimeModel({
			provider: params.modelRef.provider,
			modelId: params.modelRef.model
		});
		model.contextWindow = toolSurface.policy.modelContextWindowTokens ?? model.contextWindow;
		if (toolSurface.policy.modelHasVision !== void 0) model.input = toolSurface.policy.modelHasVision ? ["text", "image"] : ["text"];
		const authStorage = AuthStorage.inMemory({});
		const modelRegistry = ModelRegistry.inMemory(authStorage);
		const settingsManager = SettingsManager.inMemory({
			compaction: { enabled: false },
			retry: { enabled: false }
		});
		const contextFiles = buildBootstrapContextForFiles(params.bootstrapFiles, {});
		let toolSchemaDirectoryPrompt;
		const resourceLoader = new DefaultResourceLoader({
			cwd: params.cwd,
			agentDir: params.stateDir,
			settingsManager,
			appendSystemPromptTransform: () => [
				params.systemPrompt,
				resources?.snapshot.prompt,
				toolSchemaDirectoryPrompt
			].filter((prompt) => Boolean(prompt)),
			agentsFilesOverride: () => ({ agentsFiles: contextFiles })
		});
		const baseSessionManager = SessionManager.inMemory(params.cwd);
		for (const message of params.initialMessages ?? []) await baseSessionManager.appendMessageAsync(structuredClone(message));
		const transcriptRuntime = createWorkerTranscriptRuntime(params.transcript, params.signal);
		const sessionManager = guardSessionManager(baseSessionManager, {
			suppressNextUserMessagePersistence: params.suppressPromptTranscript,
			onMessagePersisted: transcriptRuntime.onMessagePersisted
		});
		const allowedToolNameSet = new Set(params.allowedToolNames);
		for (const entry of toolSurface.tools) if (entry.execution === "placement" && !allowedToolNameSet.has(entry.definition.name)) throw new Error(`Worker tool surface exceeds launch authority: ${entry.definition.name}`);
		const activeToolNames = new Set(toolSurface.tools.map(({ definition }) => definition.name));
		const coreTools = projectMemoryFlushTools(createWorkerPlacementTools({
			...params,
			policy: toolSurface.policy,
			containmentRoot: params.workerContainmentRoot,
			skillsSnapshot: resources?.snapshot
		}), toolSurface.policy.memoryFlushWritePath ? {
			root: params.workerContainmentRoot,
			relativePath: toolSurface.policy.memoryFlushWritePath
		} : void 0);
		const browserRuntime = params.browser && activeToolNames.has("browser") ? await createWorkerBrowserToolRuntime({
			descriptor: params.browser,
			sessionKey: params.sessionKey,
			stateDir: params.stateDir,
			workspaceDir: params.cwd,
			...params.browserRuntime ? { runtime: params.browserRuntime } : {}
		}) : void 0;
		const turnLifetime = new AbortController();
		const toolSignal = params.signal ? AbortSignal.any([params.signal, turnLifetime.signal]) : turnLifetime.signal;
		let computerCleanup;
		let toolSurfaceRuntime;
		async function disposeTools(failure) {
			turnLifetime.abort();
			const cleanup = computerCleanup;
			computerCleanup = void 0;
			const failures = failure ? [failure] : [];
			const disposals = await Promise.allSettled([
				() => toolSurfaceRuntime?.cleanup(),
				() => cleanup?.("Worker turn finished"),
				() => browserRuntime?.dispose(),
				disposeAllCodeModeRuns
			].map(async (dispose) => await dispose()));
			for (const disposal of disposals) if (disposal.status === "rejected") {
				const cleanupFailure = toWorkerAgentError(disposal.reason, "Worker tool cleanup failed.");
				recordModelFallbackStop(cleanupFailure);
				failures.push(cleanupFailure);
			}
			return failures.length > 1 ? new AggregateError(failures, "Worker turn failed") : failures[0];
		}
		const { session } = await (async () => {
			try {
				const computerTool = params.computer && activeToolNames.has("computer") ? createWorkerComputerTool({
					...params.computer,
					runId: params.runId,
					registerRunCleanup: (cleanup) => {
						computerCleanup = cleanup;
					}
				}) : void 0;
				const localTools = new Map([
					...coreTools,
					...browserRuntime ? [browserRuntime.tool] : [],
					...computerTool ? [computerTool] : []
				].map((tool) => [tool.name, tool]));
				const gatewayTools = new Map(createWorkerGatewayToolProxies(toolSurface, params.gatewayTools).map((tool) => [tool.name, tool]));
				const tools = toolSurface.tools.map((entry) => {
					if (entry.execution === "gateway") return wrapToolWithAbortSignal(gatewayTools.get(entry.definition.name), toolSignal);
					const source = localTools.get(entry.definition.name);
					if (!source) throw new Error(`Worker placement tool unavailable: ${entry.definition.name}`);
					const tool = copyAgentToolMetadata(source, {
						...source,
						...entry.definition
					});
					if (entry.plugin) setPluginToolMeta(tool, entry.plugin);
					return wrapToolWithGatewayCallerIdentity(wrapToolWithAbortSignal(wrapToolWithBeforeToolCallHook(tool, {
						agentId: params.agentId,
						config: WORKER_TOOL_CONFIG,
						cwd: params.cwd,
						workspaceDir: params.cwd,
						sessionKey: params.sessionKey,
						sessionId: params.sessionId,
						runId: params.runId,
						requester: { senderIsOwner: true }
					}), toolSignal), {
						agentId: params.agentId,
						sessionKey: params.sessionKey,
						operationalRunInstance: params.operationalRunInstance,
						signedAgentRuntimeIdentityToken: params.agentRuntimeIdentityToken
					});
				});
				toolSurfaceRuntime = createAgentHarnessToolSurfaceRuntimeCore({
					agentId: params.agentId,
					sessionId: params.sessionId,
					sessionKey: params.sessionKey,
					runId: params.runId,
					abortSignal: toolSignal,
					presentation: toolSurface.presentation,
					supportsDeferredToolCalls: false,
					modelToolsEnabled: tools.length > 0,
					model
				});
				const projected = toolSurfaceRuntime.compactTools(tools, { prepared: {
					abortSignal: toolSignal,
					preserveToolNames: []
				} }).promptToolPolicy.apply();
				toolSchemaDirectoryPrompt = projected.toolSchemaDirectoryPrompt;
				await resourceLoader.reload();
				return await createAgentSession({
					cwd: params.cwd,
					agentDir: params.stateDir,
					authStorage,
					modelRegistry,
					model,
					thinkingLevel: "medium",
					tools: projected.tools.map((tool) => tool.name),
					customTools: toToolDefinitions(projected.tools),
					sessionManager,
					settingsManager,
					resourceLoader,
					withSessionWriteSettlement: transcriptRuntime.withSessionWriteSettlement
				});
			} catch (error) {
				throw await disposeTools(toWorkerAgentError(error, "Worker agent setup failed."));
			}
		})();
		session.agent.sessionId = params.sessionId;
		session.agent.streamFn = (_model, context, options) => {
			const projected = toWorkerInferenceContext(context);
			if (projected.kind === "provider-replay-unavailable") throw new Error(`${WORKER_PROVIDER_REPLAY_LOCAL_RETRY_MESSAGE} (${projected.details.reason})`);
			return params.inference.stream({
				modelRef: params.modelRef,
				context: projected.context,
				options: structuredClone(params.inferenceOptions ?? {}),
				...options?.signal ? { signal: options.signal } : {}
			});
		};
		const liveRuntime = createWorkerLiveRuntime(params.live);
		const unsubscribe = session.subscribe(liveRuntime.handleSessionEvent);
		const abortTurn = () => session.agent.abort();
		params.signal?.addEventListener("abort", abortTurn, { once: true });
		let runFailure;
		try {
			if (params.signal?.aborted) throw toWorkerAgentError(params.signal.reason, "Worker agent turn aborted.");
			const content = typeof params.prompt === "string" ? [{
				type: "text",
				text: params.prompt
			}] : [...params.prompt];
			if (resources) {
				for (const [index, part] of content.entries()) if (part.type === "text") content[index] = {
					...part,
					text: resources.rewriteReferences(part.text)
				};
			}
			await session.agent.prompt({
				role: "user",
				content,
				timestamp: Date.now()
			});
			await session.agent.waitForIdle();
			if (params.signal?.aborted) throw toWorkerAgentError(params.signal.reason, "Worker agent turn aborted.");
			const terminalAssistant = session.agent.state.messages.toReversed().find((message) => message.role === "assistant");
			if (terminalAssistant?.stopReason === "error") throw new Error(terminalAssistant.errorMessage ?? "Worker inference failed.");
			if (terminalAssistant?.stopReason === "aborted") throw new Error(terminalAssistant.errorMessage ?? "Worker inference was aborted.");
		} catch (error) {
			runFailure = params.signal?.aborted ? toWorkerAgentError(params.signal.reason, "Worker agent turn aborted.") : toWorkerAgentError(error, "Worker agent turn failed.");
		}
		try {
			const [cleanupFailure, transcriptFailure] = await Promise.all([disposeTools(runFailure), transcriptRuntime.withSessionWriteSettlement(() => void 0).catch((error) => toWorkerAgentError(error, "Worker transcript flush failed."))]);
			runFailure = cleanupFailure;
			if (runFailure) liveRuntime.enqueueRunFailure({
				aborted: params.signal?.aborted === true,
				error: runFailure
			});
			if (transcriptFailure) throw runFailure ?? transcriptFailure;
			await liveRuntime.emitTerminal();
		} finally {
			turnLifetime.abort();
			params.signal?.removeEventListener("abort", abortTurn);
			unsubscribe();
			session.dispose();
		}
		if (runFailure !== void 0) throw runFailure;
	} finally {
		await resources?.cleanup();
	}
}
//#endregion
export { runWorkerEmbeddedTurn };
