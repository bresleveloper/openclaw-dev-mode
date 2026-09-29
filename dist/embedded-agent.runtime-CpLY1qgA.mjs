import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { i as loadBundledPluginPublicSurfaceModuleSyncCore } from "./facade-loader-BWw5NpKt.mjs";
import { u as SESSIONS_SEND_RESULT_GUIDANCE } from "./tool-description-presets-CT4WhVkI.mjs";
import { $ as WorkerComputerParamsSchema, F as WorkerPortalParamsSchema, _ as WORKER_SESSION_TOOL_MAX_TEXT_LENGTH } from "./worker-admission-BB3C4gz4.mjs";
import { t as truncateUtf8Prefix } from "./utf8-truncate-_hf7tp13.mjs";
import { t as WORKER_INFERENCE_MAX_CONTEXT_MESSAGES } from "./worker-inference-m2fwUhbe.mjs";
import { i as AuthStorage, t as ModelRegistry } from "./model-registry-DrVlc5_5.mjs";
import { t as DEFAULT_AGENTS_FILENAME } from "./workspace-bootstrap-policy-DSEIbIS8.mjs";
import { s as loadWorkspaceBootstrapFiles } from "./workspace-mlzi3k1x.mjs";
import { l as resolveAssistantMessagePhase } from "./chat-message-content-D14VlZZc.mjs";
import { c as normalizeAgentRunAttemptTerminal, l as projectAgentRunAttemptTerminal, s as mergeAgentRunAttemptTerminal } from "./agent-run-terminal-outcome-Dto4EMdr.mjs";
import { c as wrapToolWithGatewayCallerIdentity } from "./gateway-caller-context-DvDb9xl2.mjs";
import { n as projectEffectiveExecPolicy, r as resolveSessionPermissionCoreToolPolicy } from "./session-permission-exec-mode-Bn0mEuts.mjs";
import { n as recordModelFallbackStop } from "./model-fallback-stop-B0RY23Zf.mjs";
import { s as hasModelFallbackStop } from "./failover-error-C3SnWYBJ.mjs";
import { n as buildBootstrapContextForFiles } from "./bootstrap-files-BL4PdvwV.mjs";
import { t as createComputerTool } from "./computer-tool-eUElmgWU.mjs";
import { w as SettingsManager } from "./resource-loader-Bla9QJ3Z.mjs";
import { i as guardSessionManager, n as createAgentSession, t as createEmbeddedAgentResourceLoader } from "./resource-loader-CXxmUiSB.mjs";
import { t as SessionManager } from "./session-manager-ezhBV3sx.mjs";
import { n as wrapToolWithAbortSignal } from "./agent-tools.abort-g8BtZl1O.mjs";
import { t as redactAgentDiagnosticPayload } from "./diagnostic-redaction-DpEbBPqt.mjs";
import { a as toToolDefinitions } from "./agent-tool-definition-adapter-CN0S9YZi.mjs";
import { i as finalizeAgentTools, n as isApplyPatchAllowedForModel, t as createCoreCodingTools } from "./core-coding-tools-Ci3Jp9Dg.mjs";
import { t as resolveToolLoopDetectionConfig } from "./tool-loop-detection-config-CHx7Z_89.mjs";
import { n as PortalOutputSchema, r as PortalToolSchema, t as PORTAL_TOOL_DESCRIPTION } from "./portal-tool-contract-B1EX82ns.mjs";
import { t as SkillLibraryWorkshopSchema } from "./worker-skill-workshop-CtIZXAKM.mjs";
import { t as createLibrarySkillWorkshopDescriptor } from "./skill-workshop-tool-library-BZvijf5h.mjs";
import { n as createNativeModelOwnedRuntimeModel } from "./setup-C903Y5Pd.mjs";
import { t as materializeSkillResources } from "./resources-CKVlyZhk.mjs";
import { i as WORKER_TOOL_NAMES, n as WORKER_REQUIRED_LOCAL_TOOL_NAMES, r as WORKER_SESSION_TOOL_NAMES, t as WORKER_LOCAL_TOOL_NAMES } from "./tool-authority-Duog_7TW.mjs";
import { i as isWorkerTranscriptMessageFrameSafe, n as cloneImageContent, o as toWorkerTranscriptMessage, r as cloneTextContent, t as WORKER_PROVIDER_REPLAY_LOCAL_RETRY_MESSAGE } from "./transcript-message-D33QMqiJ.mjs";
import { n as windowWorkerReplayMessages } from "./replay-message-window-Bl3QzLEm.mjs";
import { execFile } from "node:child_process";
import { Type } from "typebox";
import { Value } from "typebox/value";
//#region src/worker/browser-runtime.ts
/** Core-private adapter for the bundled Browser plugin's attached worker runtime. */
const WORKER_BROWSER_LAUNCH_TIMEOUT_MS = 3e4;
const WORKER_BROWSER_LAUNCH_OUTPUT_LIMIT_BYTES = 65536;
function runWorkerBrowserLauncher(descriptor) {
	return new Promise((resolve, reject) => {
		execFile(descriptor.launcherPath, descriptor.launcherArgs ?? [], {
			timeout: WORKER_BROWSER_LAUNCH_TIMEOUT_MS,
			maxBuffer: WORKER_BROWSER_LAUNCH_OUTPUT_LIMIT_BYTES,
			windowsHide: true,
			shell: false
		}, (error) => {
			if (error) {
				reject(new Error(`Worker Browser launcher failed: ${error.message}`, { cause: error }));
				return;
			}
			resolve();
		});
	});
}
/** Materialize the exact bundled Browser runtime; no descriptor-controlled plugin path is used. */
async function createWorkerBrowserToolRuntime(params) {
	return await (params.runtime ?? loadBundledPluginPublicSurfaceModuleSyncCore({
		dirName: "browser",
		artifactBasename: "runtime-api.js",
		trackedPluginId: "browser"
	})).createAttachedBrowserToolRuntime({
		cdpUrl: params.descriptor.cdpUrl,
		ensureAttachTarget: async () => await runWorkerBrowserLauncher(params.descriptor),
		agentSessionKey: params.sessionKey,
		agentDir: params.stateDir,
		workspaceDir: params.workspaceDir
	});
}
//#endregion
//#region src/worker/computer-runtime.ts
function createWorkerComputerTool(params) {
	let closing;
	const close = (request) => closing ??= Promise.resolve().then(() => params.requestComputer(request));
	const transport = {
		computerUse: params.descriptor.computerUse,
		resolveNode: async (query, signal) => {
			signal?.throwIfAborted();
			if (query !== void 0 && query !== params.descriptor.nodeId) throw new Error("Computer input is bound to this session's desktop.");
			return params.descriptor;
		},
		invoke: async ({ nodeId, command, commandParams, timeoutMs, idempotencyKey, signal }) => {
			signal?.throwIfAborted();
			if (nodeId !== params.descriptor.nodeId) throw new Error("Computer input is bound to this session's desktop.");
			const isClose = command === "computer.act" && commandParams.action === "__close_execution";
			if (closing && !isClose) throw new Error("Computer execution is closed.");
			const request = {
				command,
				paramsJson: JSON.stringify(commandParams),
				...timeoutMs === void 0 ? {} : { timeoutMs },
				...idempotencyKey === void 0 ? {} : { idempotencyKey }
			};
			if (!Value.Check(WorkerComputerParamsSchema, request)) throw new Error("Computer request exceeds the worker protocol limits.");
			const abort = () => {
				close({
					command: "computer.act",
					paramsJson: JSON.stringify({
						action: "__close_execution",
						executionId: commandParams.executionId,
						reason: "Worker computer invocation aborted"
					})
				}).catch(() => {});
			};
			signal?.addEventListener("abort", abort, { once: true });
			try {
				const response = await (isClose ? close(request) : params.requestComputer(request).catch((error) => {
					abort();
					throw error;
				}));
				signal?.throwIfAborted();
				if (!response.ok) throw new Error(response.error.message);
				return JSON.parse(response.payload.resultJson);
			} finally {
				signal?.removeEventListener("abort", abort);
			}
		}
	};
	return createComputerTool({
		transport,
		contextEpoch: params.contextEpoch,
		idempotencyScope: params.runId,
		registerRunCleanup: params.registerRunCleanup
	});
}
//#endregion
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
	} else if (event.kind === "lifecycle" && event.payload.phase === "error") bounded = {
		kind: "lifecycle",
		payload: {
			...event.payload,
			error: truncateLiveText(event.payload.error)
		}
	};
	else throw new Error(`worker live ${event.kind} event exceeds the protocol payload limit`);
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
	const emitAssistantSnapshot = (message) => {
		const { text, phase } = readAssistantSnapshot(message);
		if (text === streamedText && phase === streamedPhase) return;
		const previousText = streamedPhase === "commentary" && phase !== "commentary" ? "" : streamedText;
		const replace = !text.startsWith(previousText);
		enqueueLive({
			kind: "assistant",
			payload: {
				text,
				delta: replace ? text : text.slice(previousText.length),
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
			emitAssistantSnapshot(event.message);
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
	if (message.role === "user") return {
		kind: "complete",
		message: {
			role: "user",
			content: typeof message.content === "string" ? message.content : message.content.map((part) => part.type === "text" ? cloneTextContent(part) : cloneImageContent(part)),
			timestamp: message.timestamp,
			...message.runtimeContextCarrier ? { runtimeContextCarrier: true } : {}
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
function createWorkerTranscriptRuntime(client) {
	const pendingTranscriptMessages = [];
	const onMessagePersisted = (message) => {
		const projected = toWorkerTranscriptMessage(message, "transcript");
		if (!projected) return;
		if (projected.kind === "provider-replay-unavailable") throw new Error(`Worker transcript cannot persist authoritative provider replay: ${projected.details.reason}.`);
		if (!isWorkerTranscriptMessageFrameSafe(projected.message)) throw new Error("Worker transcript message exceeds the protocol payload limit.");
		pendingTranscriptMessages.push(projected.message);
	};
	const flushTranscript = async () => {
		while (pendingTranscriptMessages.length > 0) {
			const batch = pendingTranscriptMessages.slice(0, 64);
			await client.commit(batch);
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
//#region src/worker/worker-session-tools.ts
function parseToolResult(frame) {
	if (!frame.ok) throw new Error(frame.error.message);
	let parsed;
	try {
		parsed = JSON.parse(frame.payload.resultJson);
	} catch (error) {
		throw new Error("Gateway returned an invalid worker session tool result", { cause: error });
	}
	if (!parsed || typeof parsed !== "object" || !Array.isArray(parsed.content)) throw new Error("Gateway returned an invalid worker session tool result");
	return parsed;
}
function createWorkerSessionTools(client, skillAuthoring) {
	const workshop = skillAuthoring ? {
		...createLibrarySkillWorkshopDescriptor(skillAuthoring.multipleProfiles),
		parameters: SkillLibraryWorkshopSchema,
		execute: async (toolCallId, raw) => {
			if (!Value.Check(SkillLibraryWorkshopSchema, raw) || !client.requestSkillWorkshop) throw new Error("Worker Workshop transport is unavailable or arguments are invalid.");
			return parseToolResult(await client.requestSkillWorkshop({
				toolCallId,
				arguments: raw
			}));
		}
	} : void 0;
	return [
		...workshop ? [workshop] : [],
		{
			label: "Sessions",
			name: "sessions_spawn",
			description: "Spawn a visible cloud child session in a fresh managed worktree. The child inherits the current cloud placement profile and attenuated tool policy.",
			parameters: Type.Object({
				task: Type.String({
					minLength: 1,
					maxLength: WORKER_SESSION_TOOL_MAX_TEXT_LENGTH
				}),
				label: Type.Optional(Type.String({
					minLength: 1,
					maxLength: 256
				})),
				agentId: Type.Optional(Type.String({
					minLength: 1,
					maxLength: 256
				})),
				model: Type.Optional(Type.String({
					minLength: 1,
					maxLength: 256
				})),
				runTimeoutSeconds: Type.Optional(Type.Integer({
					minimum: 0,
					maximum: 86400
				}))
			}),
			execute: async (toolCallId, raw) => {
				const params = raw;
				return parseToolResult(await client.requestSessionsSpawn({
					toolCallId,
					...params
				}));
			}
		},
		{
			label: "Session Send",
			name: "sessions_send",
			description: `Send a message to an authorized parent, child, or sibling session on this Gateway, whether it runs on the Gateway, a paired device, or a cloud worker. Cross-tree and stale-incarnation targets are denied by the Gateway. ${SESSIONS_SEND_RESULT_GUIDANCE} Status "no_reply" is terminal; do not wait for another result.`,
			parameters: Type.Object({
				sessionKey: Type.String({
					minLength: 1,
					maxLength: 1024
				}),
				message: Type.String({
					minLength: 1,
					maxLength: WORKER_SESSION_TOOL_MAX_TEXT_LENGTH
				}),
				timeoutSeconds: Type.Optional(Type.Integer({
					minimum: 0,
					maximum: 86400
				}))
			}),
			execute: async (toolCallId, raw) => {
				const params = raw;
				return parseToolResult(await client.requestSessionsSend({
					toolCallId,
					...params
				}));
			}
		},
		{
			label: "Portal",
			name: "portal",
			description: PORTAL_TOOL_DESCRIPTION,
			parameters: PortalToolSchema,
			outputSchema: PortalOutputSchema,
			execute: async (toolCallId, raw) => {
				if (!Value.Check(PortalToolSchema, raw)) throw new Error("Invalid portal tool arguments");
				const params = {
					toolCallId,
					...raw
				};
				if (!Value.Check(WorkerPortalParamsSchema, params)) throw new Error("Portal tool arguments exceed the worker protocol limits");
				return parseToolResult(await client.requestPortal(params));
			}
		}
	];
}
//#endregion
//#region src/worker/embedded-agent.runtime.ts
function toWorkerAgentError(value, fallback) {
	return value instanceof Error ? value : new Error(fallback, { cause: value });
}
const WORKER_TOOL_CONFIG = { plugins: { enabled: false } };
async function runWorkerEmbeddedTurn(params) {
	const resources = params.skillResources ? await materializeSkillResources(params.skillResources, () => params.signal?.throwIfAborted()) : void 0;
	try {
		await runWorkerEmbeddedTurnWithResources({
			...params,
			prompt: resources ? typeof params.prompt === "string" ? resources.rewriteReferences(params.prompt) : params.prompt.map((part) => part.type === "text" ? {
				...part,
				text: resources.rewriteReferences(part.text)
			} : part) : params.prompt,
			systemPrompt: [params.systemPrompt, resources?.snapshot.prompt].filter(Boolean).join("\n\n") || void 0
		}, resources?.snapshot);
	} finally {
		await resources?.cleanup();
	}
}
async function runWorkerEmbeddedTurnWithResources(params, skillsSnapshot) {
	if (params.allowedToolNames.includes("skill_workshop") !== Boolean(params.skillAuthoring)) throw new Error("Worker Workshop capability and tool authority must agree.");
	if (params.allowedToolNames.includes("browser") !== (params.browser !== void 0)) throw new Error("Worker Browser authority and launch descriptor must be provided together.");
	if (params.allowedToolNames.includes("computer") !== (params.computer !== void 0)) throw new Error("Worker computer authority and launch descriptor must be provided together.");
	if (params.operationalRunInstance.runId !== params.runId) throw new Error("worker operational run instance disagrees with the admitted turn");
	const model = createNativeModelOwnedRuntimeModel({
		provider: params.modelRef.provider,
		modelId: params.modelRef.model
	});
	const authStorage = AuthStorage.inMemory({});
	const modelRegistry = ModelRegistry.inMemory(authStorage);
	const settingsManager = SettingsManager.inMemory({
		compaction: { enabled: false },
		retry: { enabled: false }
	});
	const bootstrapFiles = await loadWorkspaceBootstrapFiles(params.cwd, [DEFAULT_AGENTS_FILENAME]);
	const contextFiles = buildBootstrapContextForFiles(bootstrapFiles, {});
	const resourceLoader = createEmbeddedAgentResourceLoader({
		cwd: params.cwd,
		agentDir: params.stateDir,
		settingsManager,
		appendSystemPromptTransform: () => params.systemPrompt === void 0 ? [] : [params.systemPrompt],
		agentsFilesOverride: () => ({ agentsFiles: contextFiles })
	});
	await resourceLoader.reload();
	const baseSessionManager = SessionManager.inMemory(params.cwd);
	for (const message of params.initialMessages ?? []) baseSessionManager.appendMessage(structuredClone(message));
	const transcriptRuntime = createWorkerTranscriptRuntime(params.transcript);
	const sessionManager = guardSessionManager(baseSessionManager, {
		suppressNextUserMessagePersistence: params.suppressPromptTranscript,
		onMessagePersisted: transcriptRuntime.onMessagePersisted
	});
	const execUnavailable = params.execAuthority === void 0 || params.execAuthority.host === "sandbox" || params.execAuthority.host === "node";
	const allowedToolNameSet = new Set(params.allowedToolNames);
	if (execUnavailable) {
		allowedToolNameSet.delete("exec");
		allowedToolNameSet.delete("process");
	}
	const permissionToolPolicy = params.permissionMode ? resolveSessionPermissionCoreToolPolicy({ mode: params.permissionMode }) : void 0;
	const omittedToolNames = permissionToolPolicy?.readOnly ? /* @__PURE__ */ new Set([
		"write",
		"edit",
		"apply_patch"
	]) : void 0;
	const activeToolNames = WORKER_TOOL_NAMES.filter((name) => allowedToolNameSet.has(name) && !omittedToolNames?.has(name));
	const localToolNameSet = new Set(WORKER_LOCAL_TOOL_NAMES);
	const headlessApprovalText = params.permissionMode ? `Exec denied (approval_required) in worker ${params.permissionMode} permission mode. Run this command locally for interactive approval, or ask an administrator to clear the session permission mode.` : void 0;
	const execAuthority = params.execAuthority ?? {
		host: "gateway",
		security: "deny",
		ask: "off"
	};
	const { security: execSecurity, ask: execAsk, mode: execMode } = projectEffectiveExecPolicy({
		base: execAuthority,
		overrides: execAuthority,
		permissionPolicy: params.permissionMode ? { mode: params.permissionMode } : void 0
	});
	const coreTools = createCoreCodingTools({
		skillsSnapshot,
		codingRoot: params.cwd,
		containmentRoot: params.workerContainmentRoot,
		includeBaseCodingTools: true,
		shellTools: execUnavailable ? "patch-only" : "full",
		workspaceOnly: permissionToolPolicy?.workspaceOnly ?? false,
		readOnly: permissionToolPolicy?.readOnly ?? false,
		modelContextWindowTokens: model.contextWindow,
		imageSanitization: {},
		applyPatchEnabled: permissionToolPolicy?.readOnly !== true && isApplyPatchAllowedForModel({
			modelProvider: params.modelRef.provider,
			modelId: params.modelRef.model
		}),
		applyPatchWorkspaceOnly: permissionToolPolicy?.applyPatchWorkspaceOnly ?? true,
		applyPatchContainmentSource: permissionToolPolicy ? "session" : "worker",
		execDefaults: {
			bypassHostApprovalFloors: permissionToolPolicy?.bypassHostApprovalFloors && execSecurity === "full",
			safeBins: execAuthority.safeBins ?? [],
			host: execAuthority.host,
			node: execAuthority.host === "node" ? execAuthority.node : void 0,
			security: execSecurity,
			ask: execAsk,
			...execMode ? { mode: execMode } : {},
			nonInteractiveApproval: Boolean(permissionToolPolicy && permissionToolPolicy.execMode !== "full"),
			approvalFollowupText: headlessApprovalText,
			config: WORKER_TOOL_CONFIG,
			...params.github ? { preparedRunEnvironment: params.github } : {},
			commandHighlighting: false,
			agentId: params.agentId,
			allowBackground: true,
			scopeKey: params.sessionKey,
			sessionKey: params.sessionKey,
			runId: params.runId,
			notifySessionKey: params.sessionKey,
			sessionId: params.sessionId,
			eventRouting: { preserveSessionKey: false }
		},
		processDefaults: { scopeKey: params.sessionKey }
	});
	const browserRuntime = params.browser ? await createWorkerBrowserToolRuntime({
		descriptor: params.browser,
		sessionKey: params.sessionKey,
		stateDir: params.stateDir,
		workspaceDir: params.cwd,
		...params.browserRuntime ? { runtime: params.browserRuntime } : {}
	}) : void 0;
	const turnLifetime = new AbortController();
	const toolSignal = params.signal ? AbortSignal.any([params.signal, turnLifetime.signal]) : turnLifetime.signal;
	let computerCleanup;
	async function disposeTools(failure) {
		turnLifetime.abort();
		const cleanup = computerCleanup;
		computerCleanup = void 0;
		const failures = failure ? [failure] : [];
		for (const dispose of [() => cleanup?.("Worker turn finished"), () => browserRuntime?.dispose()]) try {
			await dispose();
		} catch (error) {
			const cleanupFailure = toWorkerAgentError(error, "Worker tool cleanup failed.");
			recordModelFallbackStop(cleanupFailure);
			failures.push(cleanupFailure);
		}
		return failures.length > 1 ? new AggregateError(failures, "Worker turn failed") : failures[0];
	}
	const { session } = await (async () => {
		try {
			const computerTool = params.computer ? createWorkerComputerTool({
				...params.computer,
				runId: params.runId,
				registerRunCleanup: (cleanup) => {
					computerCleanup = cleanup;
				}
			}) : void 0;
			const localTools = finalizeAgentTools({
				tools: [
					...coreTools,
					...browserRuntime ? [browserRuntime.tool] : [],
					...computerTool ? [computerTool] : []
				],
				modelProvider: params.modelRef.provider,
				modelId: params.modelRef.model,
				hookContext: {
					agentId: params.agentId,
					config: WORKER_TOOL_CONFIG,
					cwd: params.cwd,
					workspaceDir: params.cwd,
					sessionKey: params.sessionKey,
					sessionId: params.sessionId,
					runId: params.runId,
					requester: { senderIsOwner: true },
					loopDetection: resolveToolLoopDetectionConfig({
						cfg: WORKER_TOOL_CONFIG,
						agentId: params.agentId
					})
				},
				abortSignal: toolSignal
			}).filter((tool) => localToolNameSet.has(tool.name)).map((tool) => wrapToolWithGatewayCallerIdentity(tool, {
				agentId: params.agentId,
				sessionKey: params.sessionKey,
				operationalRunInstance: params.operationalRunInstance,
				signedAgentRuntimeIdentityToken: params.agentRuntimeIdentityToken
			}));
			const discoveredToolNames = new Set(localTools.map((tool) => tool.name));
			for (const toolName of WORKER_REQUIRED_LOCAL_TOOL_NAMES) {
				if (omittedToolNames?.has(toolName) || execUnavailable && (toolName === "exec" || toolName === "process")) continue;
				if (!discoveredToolNames.has(toolName)) throw new Error(`Worker coding tool unavailable: ${toolName}`);
			}
			if (WORKER_SESSION_TOOL_NAMES.filter((name) => allowedToolNameSet.has(name)).length > 0 && !params.sessions) throw new Error("Worker session tool client unavailable");
			const sessionTools = params.sessions ? createWorkerSessionTools(params.sessions, params.skillAuthoring).filter((tool) => allowedToolNameSet.has(tool.name)) : [];
			return await createAgentSession({
				cwd: params.cwd,
				agentDir: params.stateDir,
				authStorage,
				modelRegistry,
				model,
				thinkingLevel: "medium",
				tools: [...activeToolNames],
				customTools: toToolDefinitions([...localTools.filter((tool) => allowedToolNameSet.has(tool.name)), ...sessionTools.map((tool) => wrapToolWithAbortSignal(tool, toolSignal))]),
				noTools: "all",
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
	session.setActiveToolsByName([...activeToolNames]);
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
		await session.agent.prompt({
			role: "user",
			content: typeof params.prompt === "string" ? [{
				type: "text",
				text: params.prompt
			}] : params.prompt,
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
	let finalTranscriptFailure;
	try {
		runFailure = await disposeTools(runFailure);
		if (runFailure) liveRuntime.enqueueRunFailure({
			aborted: params.signal?.aborted === true,
			error: runFailure
		});
		try {
			await transcriptRuntime.withSessionWriteSettlement(() => void 0);
		} catch (error) {
			finalTranscriptFailure = toWorkerAgentError(error, "Worker transcript flush failed.");
		}
		if (finalTranscriptFailure === void 0) await liveRuntime.emitTerminal();
	} finally {
		turnLifetime.abort();
		params.signal?.removeEventListener("abort", abortTurn);
		unsubscribe();
		session.dispose();
	}
	if (runFailure !== void 0) throw runFailure;
	if (finalTranscriptFailure !== void 0) throw finalTranscriptFailure;
}
//#endregion
export { runWorkerEmbeddedTurn };
