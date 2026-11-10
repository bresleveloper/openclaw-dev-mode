import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { j as resolveIntegerOption } from "./number-coercion-CkhMiRw8.mjs";
import { a as asOptionalRecord } from "./record-coerce-TIsquoVR.mjs";
import { s as normalizeOptionalTrimmedStringList } from "./string-normalization-D6DKCpwE.mjs";
import { r as defaultRuntime } from "./runtime-BazLsT0s.mjs";
import { t as isAbortError } from "./abort-signal-C9DFO3n5.mjs";
import { f as bindGatewayContextResolver } from "./gateway-request-scope-1BXD1G3l.mjs";
import { g as readRuntimeConfig } from "./runtime-snapshot-BBYDJbw9.mjs";
import { a as emitAgentEvent, h as onAgentEventForRun } from "./agent-events-Bf3Js0D3.mjs";
import { y as retainGatewayRootWorkAdmissionContinuation } from "./gateway-work-admission-FWbk4b3p.mjs";
import "./io-DIF-KW3P.mjs";
import { o as isFailoverError, s as isSignalTimeoutReason } from "./error-Bcp4ZyOv.mjs";
import { o as hasNonzeroUsage, u as normalizeUsage } from "./usage-BqbJmOEZ.mjs";
import { u as resolveGatewayOperatorRoleActor } from "./operator-role-policy-Coro3qc5.mjs";
import { t as ToolAuthorizationError } from "./tool-input-error-mjW74R8m.mjs";
import { o as buildHistoryContext } from "./history-C_lABG5e.mjs";
import { s as extractTextFromChatContent } from "./user-facing-text-BNFEPbYx.mjs";
import { i as logWarn } from "./logger-DHVmYOKs.mjs";
import { r as captureGatewayOperatorRunAuthority } from "./operator-run-authority-BcrXDfhQ.mjs";
import { t as createDefaultDeps } from "./deps-CHvP-bJh.mjs";
import { l as resolveAssistantResultText, s as createAssistantTextStream } from "./server-chat-state-BW_LW3dq.mjs";
import { _ as watchClientDisconnect, f as sendMissingScopeForbidden, i as parseGatewayJsonRequest, s as retainGatewayHttpResponseWork, u as sendJson, v as writeDone } from "./http-common-DyL3AdjD.mjs";
import { n as readAgentRunTerminalOutcome } from "./agent-run-terminal-outcome-BOQC0T2X.mjs";
import { c as normalizeMimeList, l as resolveInputFileLimits, n as DEFAULT_INPUT_IMAGE_MIMES } from "./input-files-BWC1h4-H.mjs";
import { t as createSyntheticPluginRuntimeClient } from "./server-plugin-runtime-client-DChyaoc_.mjs";
import { r as isClientToolNameConflictError } from "./agent-tool-definition-adapter-Dgpfhmph.mjs";
import { n as agentCommandFromGatewayIngress } from "./agent-command-TuJMy8YP.mjs";
import "./agent-BnqYTRnx.mjs";
import { i as authorizeOpenAiCompatibleHttpModelOverride, l as resolveOpenAiCompatibleHttpSenderIsOwner } from "./http-auth-utils-DvoR_YDD.mjs";
import "./http-utils-C7PagBsR.mjs";
import { n as GATEWAY_UPLOADS_DISABLED_MESSAGE, r as areGatewayUploadsEnabled, t as GATEWAY_UPLOADS_DISABLED_CODE } from "./upload-policy-Bd2Za3Ho.mjs";
import { o as handleGatewayPostJsonEndpoint, t as resolveOpenAiCompatError } from "./openai-compat-errors-D9fEnx7w.mjs";
import { STREAM_ERROR_FALLBACK_TEXT } from "@openclaw/ai/internal/shared";
//#region src/gateway/agent-prompt.ts
function renderConversationToolCall(call) {
	return `tool_call id=${call.id ?? ""} name=${call.name} arguments=${call.arguments}`;
}
const IMAGE_ONLY_USER_MESSAGE = "User sent image(s) with no text.";
/** Normalize content-array bodies and omit provenance-marked stream-error placeholders. */
function toPromptBody(entry) {
	const raw = entry.entry.body;
	const body = typeof raw === "string" ? raw : extractTextFromChatContent(raw) ?? "";
	return entry.role === "assistant" && entry.internalStreamError === true && body.trim() === STREAM_ERROR_FALLBACK_TEXT ? null : body;
}
function buildAgentMessageFromConversationEntries(entries) {
	let currentIndex = entries.findLastIndex((entry) => entry?.role === "user" || entry?.role === "tool");
	if (currentIndex < 0) currentIndex = entries.length - 1;
	const currentConversationEntry = entries[currentIndex];
	const currentEntry = currentConversationEntry?.entry;
	if (!currentConversationEntry || !currentEntry) return "";
	const historyLines = [];
	for (let index = 0; index < currentIndex; index += 1) {
		const entry = entries[index];
		const body = toPromptBody(entry);
		if (body !== null) historyLines.push(`${entry.entry.sender}: ${body}`);
	}
	const currentBody = toPromptBody(currentConversationEntry);
	if (currentBody === null) return "";
	if (historyLines.length === 0 && currentConversationEntry.role !== "tool") return currentBody;
	return buildHistoryContext({
		historyText: historyLines.join("\n"),
		currentMessage: `${currentEntry.sender}: ${currentBody}`
	});
}
//#endregion
//#region src/gateway/http-upload-policy.ts
/** Recheck the current client-upload policy before HTTP media preparation and dispatch. */
function rejectDisabledGatewayUpload(res, hasMedia) {
	if (!hasMedia || areGatewayUploadsEnabled(readRuntimeConfig())) return false;
	sendJson(res, 403, { error: {
		message: GATEWAY_UPLOADS_DISABLED_MESSAGE,
		type: "forbidden",
		code: GATEWAY_UPLOADS_DISABLED_CODE
	} });
	return true;
}
//#endregion
//#region src/gateway/openai-agent-run-usage.ts
/** An explicit aggregate report owns completeness; legacy counters may use the last call. */
function resolveAgentRunUsage(result) {
	const agentMeta = result?.meta?.agentMeta;
	const aggregate = normalizeUsage(agentMeta?.usage);
	if (aggregate?.usageReport || hasNonzeroUsage(aggregate)) return aggregate;
	const lastCall = normalizeUsage(agentMeta?.lastCallUsage);
	if (hasNonzeroUsage(lastCall)) return lastCall;
	return aggregate ?? lastCall;
}
//#endregion
//#region src/gateway/openai-compatible-agent-run.ts
function isGatewayRunCancellation(error) {
	if (!error || typeof error !== "object" || isFailoverError(error) || !isAbortError(error)) return false;
	return !isSignalTimeoutReason("cause" in error ? error.cause : void 0);
}
function resolveOpenAiCompatibleAgentError(error, fallback) {
	if (isClientToolNameConflictError(error)) return {
		status: 400,
		error: {
			message: "invalid tool configuration",
			type: "invalid_request_error"
		}
	};
	if (isGatewayRunCancellation(error)) return {
		status: 500,
		error: {
			message: "agent run was cancelled",
			type: "api_error"
		}
	};
	return resolveOpenAiCompatError(error) ?? {
		status: 500,
		error: fallback ?? {
			message: "internal error",
			type: "api_error"
		}
	};
}
function readOpenAiHttpRunTerminal(result) {
	const meta = asOptionalRecord(asOptionalRecord(result)?.meta);
	const stopReasonRaw = meta?.stopReason;
	const stopReason = typeof stopReasonRaw === "string" ? stopReasonRaw : void 0;
	const pendingRaw = meta?.pendingToolCalls;
	const pendingToolCalls = Array.isArray(pendingRaw) ? pendingRaw.flatMap((call) => {
		const record = asOptionalRecord(call);
		const id = typeof record?.id === "string" ? record.id.trim() : "";
		const name = typeof record?.name === "string" ? record.name.trim() : "";
		const argsValue = record?.arguments;
		const argumentsValue = typeof argsValue === "string" ? argsValue : argsValue == null ? "" : JSON.stringify(argsValue);
		return id && name ? [{
			id,
			name,
			arguments: argumentsValue
		}] : [];
	}) : void 0;
	return {
		runFailed: readAgentRunTerminalOutcome(result) === "failed",
		stopReason,
		pendingToolCalls
	};
}
async function runOpenAiCompatibleAgentCommand(params) {
	params.abortSignal?.throwIfAborted();
	let admitted = false;
	const assertSourceCurrent = () => {
		if (!admitted && params.hasClientUploads && !areGatewayUploadsEnabled(readRuntimeConfig())) throw new ToolAuthorizationError(GATEWAY_UPLOADS_DISABLED_MESSAGE);
		if (!admitted && params.hasCurrentClientAuthority?.() === false) throw new ToolAuthorizationError("Gateway requester authority changed");
	};
	assertSourceCurrent();
	const client = createSyntheticPluginRuntimeClient({
		authenticatedUserProfile: params.requestAuth.authenticatedUserProfile,
		operatorRoleActor: params.requestAuth.operatorRoleActor,
		scopes: [...params.operatorScopes]
	});
	const operator = resolveGatewayOperatorRoleActor(client)?.kind === "operator";
	const gatewayContext = operator ? params.resolveGatewayContext?.() : void 0;
	if (operator && !gatewayContext) throw new Error("OpenAI-compatible operator execution requires a current Gateway context.");
	const captured = gatewayContext ? await captureGatewayOperatorRunAuthority({
		client,
		context: {
			getRuntimeConfig: gatewayContext.getRuntimeConfig,
			getCommittedRuntimeConfig: gatewayContext.getCommittedRuntimeConfig,
			resolveGatewayContext: params.resolveGatewayContext
		},
		sourceAuthority: params.requestAuth.operatorAccessAuthority
	}) : void 0;
	try {
		assertSourceCurrent();
		captured?.authority.assertCurrent();
		const sourceSignal = captured?.authority.signal;
		const abortSignal = params.abortSignal && sourceSignal ? AbortSignal.any([params.abortSignal, sourceSignal]) : params.abortSignal ?? sourceSignal;
		abortSignal?.throwIfAborted();
		const result = await agentCommandFromGatewayIngress({
			message: params.message,
			images: params.images?.length ? params.images : void 0,
			clientTools: params.clientTools?.length ? params.clientTools : void 0,
			extraSystemPrompt: params.extraSystemPrompt || void 0,
			model: params.modelOverride,
			streamParams: params.streamParams,
			sessionKey: params.sessionKey,
			runId: params.runId,
			deliver: false,
			messageChannel: params.messageChannel,
			senderIsOwner: params.senderIsOwner,
			bestEffortDeliver: false,
			allowModelOverride: params.modelOverride !== void 0,
			abortSignal,
			operatorAuthority: captured?.authority,
			assertSourceCurrent,
			onAdmittedRunContext: (context) => {
				assertSourceCurrent();
				bindGatewayContextResolver(context, params.resolveGatewayContext);
				admitted = true;
			}
		}, defaultRuntime, createDefaultDeps(), {});
		captured?.authority.assertCurrent();
		return result;
	} finally {
		captured?.release();
	}
}
//#endregion
//#region src/gateway/openai-tool-choice.ts
function resolveChatToolChoice(toolChoice) {
	if (toolChoice == null || toolChoice === "auto") return;
	if (toolChoice === "none") return "none";
	if (toolChoice === "required") return { type: "required" };
	const choice = asOptionalRecord(toolChoice);
	if (!choice) throw new Error("tool_choice must be a string or object");
	const choiceType = choice.type;
	if (choiceType === "function") {
		const targetName = normalizeOptionalString(asOptionalRecord(choice.function)?.name);
		if (!targetName) throw new Error("tool_choice.function.name is required");
		return {
			type: "function",
			name: targetName
		};
	}
	if (typeof choiceType !== "string") throw new Error("unsupported tool_choice type");
	throw new Error(`tool_choice ${choiceType} is not supported`);
}
function resolveResponsesToolChoice(toolChoice) {
	if (!toolChoice) return;
	if (toolChoice === "none") return "none";
	if (toolChoice === "required") return { type: "required" };
	if (typeof toolChoice === "object" && toolChoice.type === "function") {
		const targetName = ("name" in toolChoice ? toolChoice.name : toolChoice.function.name).trim();
		if (!targetName) throw new Error("tool_choice.name is required");
		return {
			type: "function",
			name: targetName
		};
	}
}
function applyToolChoice(tools, choice) {
	if (!choice) return { tools };
	if (choice === "none") return { tools: [] };
	const selectedTools = choice.type === "function" ? tools.filter((tool) => tool.function.name === choice.name) : tools;
	if (selectedTools.length === 0) throw new Error(choice.type === "function" ? `tool_choice requested unknown tool: ${choice.name}` : "tool_choice=required but no tools were provided");
	return {
		tools: selectedTools,
		extraSystemPrompt: choice.type === "function" ? `You must call the ${choice.name} tool before responding.` : "You must call one of the available tools before responding.",
		constraint: choice
	};
}
function resolveToolChoiceConstraintError(constraint, pendingToolCalls) {
	if (!constraint || pendingToolCalls?.length && (constraint.type === "required" || pendingToolCalls.some((call) => call.name === constraint.name))) return;
	return constraint.type === "function" ? `tool_choice required a ${constraint.name} tool call, but the agent did not produce one` : "tool_choice=required was not satisfied by the agent response";
}
//#endregion
//#region src/gateway/openai-compatible-http.ts
const REPLACEMENT_ERROR = "Assistant output cannot be represented as an append-only response stream.";
async function prepareOpenAiCompatibleHttpRequest(req, res, opts) {
	const handled = await handleGatewayPostJsonEndpoint(req, res, {
		...opts,
		requiredOperatorMethod: "chat.send"
	});
	if (!handled) return handled;
	const client = { abortController: new AbortController() };
	watchClientDisconnect(req, res, client.abortController);
	const modelAuth = authorizeOpenAiCompatibleHttpModelOverride(req, handled.requestAuth);
	if (!modelAuth.allowed) {
		sendMissingScopeForbidden(res, modelAuth.missingScope);
		return;
	}
	const senderIsOwner = resolveOpenAiCompatibleHttpSenderIsOwner(req, handled.requestAuth);
	const payload = parseGatewayJsonRequest(res, handled.body, opts.schema);
	return payload ? Object.assign(client, handled, {
		payload,
		senderIsOwner
	}) : void 0;
}
async function sendOpenAiCompatibleJsonResponse(params) {
	try {
		const result = await params.run();
		if (params.signal.aborted) return true;
		const { runFailed, stopReason, pendingToolCalls } = readOpenAiHttpRunTerminal(result);
		if (runFailed) throw new Error("agent run failed");
		params.complete({
			result,
			stopReason,
			toolCalls: stopReason === "tool_calls" && pendingToolCalls?.length ? pendingToolCalls : void 0,
			text: resolveAssistantResultText(result) ?? "",
			toolChoiceError: resolveToolChoiceConstraintError(params.constraint, pendingToolCalls)
		});
	} catch (error) {
		if (!params.signal.aborted) {
			logWarn(`${params.failureLabel}: ${String(error)}`);
			const mapped = resolveOpenAiCompatibleAgentError(error);
			if (params.fail) params.fail(mapped);
			else sendJson(params.res, mapped.status, { error: mapped.error });
		}
	}
	return true;
}
/** Own run settlement and text delivery; adapters only encode their wire protocol. */
function startOpenAiCompatibleStream(params) {
	if (params.signal.aborted) return;
	const { res, runId } = params;
	const chat = params.protocol === "chat";
	const textStream = createAssistantTextStream(Boolean(params.constraint));
	let closed = false;
	let finalizeScheduled = false;
	let observedTerminal = false;
	let terminalPhase = "end";
	let responseTerminal;
	let streamError;
	let unrepresentableReplacement = false;
	let settled;
	const close = () => {
		closed = true;
		unsubscribe();
		params.signal.removeEventListener("abort", onAbort);
	};
	const finish = () => {
		writeDone(res);
		res.end();
	};
	const fail = (error, result) => {
		if (closed) return;
		close();
		params.fail(error, result);
		finish();
	};
	const requestFinalize = () => {
		if (closed || finalizeScheduled || !settled || !chat && !responseTerminal) return;
		finalizeScheduled = true;
		(chat ? queueMicrotask : setImmediate)(() => {
			if (closed || !settled) return;
			if (streamError || unrepresentableReplacement) {
				fail(streamError ?? {
					message: REPLACEMENT_ERROR,
					type: "server_error"
				}, settled.result);
				return;
			}
			const text = textStream.complete(resolveAssistantResultText(settled.result), settled.toolCalls ? "" : "No response from OpenClaw.");
			if (!text.startsWith(textStream.streamedText)) {
				fail({
					message: REPLACEMENT_ERROR,
					type: chat ? "api_error" : "server_error"
				}, settled.result);
				return;
			}
			close();
			params.complete({
				...settled,
				text,
				delta: text.slice(textStream.streamedText.length),
				lifecycleError: responseTerminal?.phase === "error" ? responseTerminal.error || "Agent run failed" : void 0
			});
			finish();
		});
	};
	const unsubscribe = onAgentEventForRun(runId, (evt) => {
		if (closed) return;
		if (evt.stream === "assistant") {
			const { delta, replacement } = textStream.update(evt.data);
			if (chat && replacement === "unrepresentable") {
				streamError ??= {
					message: REPLACEMENT_ERROR,
					type: "api_error"
				};
				return;
			}
			if (!chat && replacement) unrepresentableReplacement = replacement === "unrepresentable";
			if (delta) params.writeDelta(delta);
		} else if (evt.stream === "lifecycle") {
			const phase = evt.data?.phase;
			if (chat && phase === "start") observedTerminal = false;
			if (phase === "end" || phase === "error") {
				observedTerminal = true;
				responseTerminal ??= {
					phase,
					error: normalizeOptionalString(evt.data?.error)
				};
				if (chat && phase === "error" && terminalPhase !== "error") streamError ??= {
					message: normalizeOptionalString(evt.data?.error) ?? "Agent run failed",
					type: "api_error"
				};
				requestFinalize();
			}
		}
	});
	const releaseAgent = retainGatewayRootWorkAdmissionContinuation();
	const releaseStream = retainGatewayHttpResponseWork(res);
	const onAbort = () => {
		close();
		releaseStream();
	};
	params.signal.addEventListener("abort", onAbort, { once: true });
	(async () => {
		try {
			const result = await params.run();
			if (closed) return;
			const { runFailed, stopReason, pendingToolCalls } = readOpenAiHttpRunTerminal(result);
			if (runFailed) {
				terminalPhase = "error";
				fail({
					message: "internal error",
					type: "api_error"
				}, result);
				return;
			}
			if (chat && streamError) {
				fail(streamError);
				return;
			}
			const toolError = resolveToolChoiceConstraintError(params.constraint, pendingToolCalls);
			if (toolError) {
				fail({
					message: toolError,
					type: "api_error"
				}, result);
				return;
			}
			settled = {
				result,
				stopReason,
				toolCalls: stopReason === "tool_calls" && pendingToolCalls?.length ? pendingToolCalls : void 0
			};
			requestFinalize();
		} catch (error) {
			if (closed) return;
			terminalPhase = "error";
			logWarn(`${chat ? "openai-compat: streaming chat completion" : "openresponses: streaming response"} failed: ${String(error)}`);
			fail(resolveOpenAiCompatibleAgentError(error, chat ? streamError : void 0).error);
		} finally {
			releaseAgent?.();
			if (!observedTerminal && (terminalPhase === "error" || !closed)) emitAgentEvent({
				runId,
				stream: "lifecycle",
				data: { phase: terminalPhase }
			});
		}
	})();
}
//#endregion
//#region src/gateway/openai-compatible-input-limits.ts
const DEFAULT_OPENAI_CHAT_COMPLETIONS_BODY_BYTES = 20971520;
const DEFAULT_OPENAI_MAX_IMAGE_PARTS = 8;
const DEFAULT_OPENAI_MAX_TOTAL_IMAGE_BYTES = 20971520;
function resolveImageLimits(config, allowUrl) {
	return {
		allowUrl: config?.allowUrl ?? allowUrl,
		urlAllowlist: normalizeOptionalTrimmedStringList(config?.urlAllowlist),
		allowedMimes: normalizeMimeList(config?.allowedMimes, DEFAULT_INPUT_IMAGE_MIMES),
		maxBytes: config?.maxBytes ?? 10485760,
		maxRedirects: config?.maxRedirects ?? 3,
		timeoutMs: config?.timeoutMs ?? 1e4
	};
}
function resolveOpenAiChatCompletionsLimits(config) {
	return {
		maxBodyBytes: DEFAULT_OPENAI_CHAT_COMPLETIONS_BODY_BYTES,
		maxImageParts: DEFAULT_OPENAI_MAX_IMAGE_PARTS,
		maxTotalImageBytes: DEFAULT_OPENAI_MAX_TOTAL_IMAGE_BYTES,
		images: resolveImageLimits(config?.images, false)
	};
}
const DEFAULT_BODY_BYTES = 20971520;
const DEFAULT_MAX_URL_PARTS = 8;
function resolveResponsesLimits(config) {
	const files = config?.files;
	const fileLimits = resolveInputFileLimits(files);
	return {
		maxBodyBytes: DEFAULT_BODY_BYTES,
		maxUrlParts: resolveIntegerOption(config?.maxUrlParts, DEFAULT_MAX_URL_PARTS, { min: 0 }),
		files: {
			...fileLimits,
			urlAllowlist: normalizeOptionalTrimmedStringList(files?.urlAllowlist)
		},
		images: resolveImageLimits(config?.images, true)
	};
}
//#endregion
export { startOpenAiCompatibleStream as a, resolveResponsesToolChoice as c, resolveAgentRunUsage as d, rejectDisabledGatewayUpload as f, renderConversationToolCall as h, sendOpenAiCompatibleJsonResponse as i, readOpenAiHttpRunTerminal as l, buildAgentMessageFromConversationEntries as m, resolveResponsesLimits as n, applyToolChoice as o, IMAGE_ONLY_USER_MESSAGE as p, prepareOpenAiCompatibleHttpRequest as r, resolveChatToolChoice as s, resolveOpenAiChatCompletionsLimits as t, runOpenAiCompatibleAgentCommand as u };
