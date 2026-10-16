import { l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
import { a as asOptionalRecord, i as asOptionalObjectRecord } from "./record-coerce-TIsquoVR.mjs";
import { t as avoidTrailingHighSurrogateBreak } from "./utf16-slice-D_ngcYKd.mjs";
import { t as formatErrorMessage } from "./errors-O33D01XW.mjs";
import { Fn as object, Jn as string, Lt as boolean, Nt as array, Pn as number, or as union, sr as unknown } from "./schemas-BOYIvvln.mjs";
import { i as emitAgentEvent, p as onAgentEventForRun } from "./agent-events-GvNTkbe3.mjs";
import { r as getRuntimeConfig } from "./io.runtime-CPntde4x.mjs";
import "./io-CUI9EWW_.mjs";
import { i as logWarn } from "./logger-DskmrSVa.mjs";
import { g as retainGatewayRootWorkAdmissionContinuation } from "./gateway-work-admission-rc4ZgKq_.mjs";
import { n as authorizeGatewaySessionCreation } from "./operator-role-policy-BqPaarjx.mjs";
import { n as estimateBase64DecodedBytes } from "./base64-CU53EX1R.mjs";
import { f as toOpenAiChatCompletionsUsage } from "./usage-XmAH1cfG.mjs";
import { l as resolveAssistantResultText, s as createAssistantTextStream } from "./server-chat-state-BP63MB41.mjs";
import { o as extractImageContentFromSource } from "./input-files-WhF8P9vt.mjs";
import { _ as watchClientDisconnect, f as sendMissingScopeForbidden, g as setSseHeaders, i as parseGatewayJsonRequest, l as sendInvalidRequest, m as sendUnauthorized, s as retainGatewayHttpResponseWork, u as sendJson, v as writeDone } from "./http-common-DJ7rKVvj.mjs";
import { i as authorizeOpenAiCompatibleHttpModelOverride, l as resolveOpenAiCompatibleHttpSenderIsOwner, u as resolveSharedSecretHttpOperatorScopes } from "./http-auth-utils-Bk1YwS0V.mjs";
import { n as assertGatewayHttpRequestCurrent } from "./http-request-authority-DE-KFuCo.mjs";
import { d as resolveGatewayRequestContext, f as resolveOpenAiCompatModelOverride, o as isGatewayRequestContextError, r as authorizeOpenAiCompatibleHttpSession } from "./http-utils-yY7ta13a.mjs";
import { n as GATEWAY_UPLOADS_DISABLED_MESSAGE, r as areGatewayUploadsEnabled } from "./upload-policy-B7cW3IFl.mjs";
import { a as handleGatewayPostJsonEndpoint, i as validateOpenAiSamplingParams, n as resolveResponseFormat, r as resolveStopSequences } from "./openai-compat-errors-CKn0-_aK.mjs";
import { a as resolveOpenAiChatCompletionsLimits, c as resolveOpenAiCompatibleAgentError, d as rejectDisabledGatewayUpload, f as IMAGE_ONLY_USER_MESSAGE, i as resolveToolChoiceConstraintError, l as runOpenAiCompatibleAgentCommand, m as renderConversationToolCall, n as resolveChatToolChoice, p as buildAgentMessageFromConversationEntries, s as readOpenAiHttpRunTerminal, t as applyToolChoice, u as resolveAgentRunUsage } from "./openai-tool-choice-kLhp_Hzf.mjs";
import { randomUUID } from "node:crypto";
import { STREAM_ERROR_FALLBACK_TEXT } from "@openclaw/ai/internal/shared";
//#region src/gateway/openai-http.ts
const OpenAiChatCompletionRequestSchema = object({
	model: string().optional(),
	stream: boolean().nullish(),
	stream_options: object({ include_usage: boolean().optional() }).passthrough().nullish(),
	tools: array(unknown()).optional(),
	tool_choice: unknown().optional(),
	messages: array(unknown()).optional(),
	user: string().optional(),
	max_tokens: number().int().positive().nullish(),
	max_completion_tokens: number().int().positive().nullish(),
	temperature: number().nullish(),
	top_p: number().nullish(),
	response_format: unknown().optional(),
	frequency_penalty: number().nullish(),
	presence_penalty: number().nullish(),
	seed: number().nullish(),
	stop: union([string(), array(string())]).nullish()
});
function writeSse(res, data) {
	res.write(`data: ${JSON.stringify(data)}\n\n`);
}
function extractClientToolsFromChatRequest(tools) {
	const clientTools = [];
	for (const rawTool of tools ?? []) {
		const tool = asOptionalRecord(rawTool);
		if (!tool) throw new Error("each tool must be an object");
		if (tool.type !== "function") throw new Error("only function tools are supported");
		const functionValue = asOptionalRecord(tool.function);
		if (!functionValue) throw new Error("tool.function is required");
		const name = normalizeOptionalString(functionValue.name);
		if (!name) throw new Error("tool.function.name is required");
		const { description, strict } = functionValue;
		const parameters = asOptionalRecord(functionValue.parameters);
		clientTools.push({
			type: "function",
			function: {
				name,
				...typeof description === "string" ? { description } : {},
				...parameters ? { parameters } : {},
				...typeof strict === "boolean" ? { strict } : {}
			}
		});
	}
	return clientTools;
}
function writeChatCompletionChunk(res, identity, chunk) {
	writeSse(res, {
		id: identity.runId,
		object: "chat.completion.chunk",
		created: identity.created,
		model: identity.model,
		...chunk
	});
}
function writeChatCompletionChoice(res, identity, delta, finishReason = null) {
	writeChatCompletionChunk(res, identity, { choices: [{
		index: 0,
		delta,
		finish_reason: finishReason
	}] });
}
function writeAssistantToolCallsIncrementalChunks(res, params) {
	for (const [index, call] of params.toolCalls.entries()) {
		writeChatCompletionChoice(res, params, { tool_calls: [{
			index,
			id: call.id,
			type: "function",
			function: {
				name: call.name,
				arguments: ""
			}
		}] });
		let start = 0;
		do {
			const end = avoidTrailingHighSurrogateBreak(call.arguments, start, Math.min(start + 256, call.arguments.length));
			writeChatCompletionChoice(res, params, { tool_calls: [{
				index,
				function: { arguments: call.arguments.slice(start, end) }
			}] });
			start = end;
		} while (start < call.arguments.length);
	}
}
function extractTextContent(content) {
	if (typeof content === "string") return content;
	if (Array.isArray(content)) {
		const parts = content.map((part) => {
			const record = asOptionalObjectRecord(part);
			if (!record) return;
			const { type, text, input_text: inputText } = record;
			if ((type === "text" || type === "input_text") && typeof text === "string") return text;
			return typeof inputText === "string" ? inputText : void 0;
		});
		const text = parts.filter(Boolean).join("\n");
		return text.trim() || parts.every((part) => part !== void 0) ? text : void 0;
	}
}
function stringifyToolCallArguments(value) {
	if (typeof value === "string") return value;
	if (value == null) return "";
	try {
		const serialized = JSON.stringify(value);
		return typeof serialized === "string" ? serialized : "";
	} catch {
		return "";
	}
}
function extractAssistantToolCalls(value) {
	if (!Array.isArray(value)) return [];
	const calls = [];
	for (const rawCall of value) {
		const call = asOptionalRecord(rawCall);
		if (!call) continue;
		const id = normalizeOptionalString(call.id);
		const functionValue = asOptionalRecord(call.function);
		const name = normalizeOptionalString(functionValue?.name);
		if (!id || !name) continue;
		const argumentsValue = stringifyToolCallArguments(functionValue?.arguments);
		calls.push({
			id,
			name,
			arguments: argumentsValue
		});
	}
	return calls;
}
function resolveImageUrlPart(part) {
	const imageUrl = asOptionalObjectRecord(part)?.image_url;
	return normalizeOptionalString(typeof imageUrl === "string" ? imageUrl : asOptionalObjectRecord(imageUrl)?.url);
}
function extractImageUrls(content) {
	const urls = [];
	if (!Array.isArray(content)) return {
		kind: "valid",
		urls
	};
	for (const part of content) {
		if (asOptionalObjectRecord(part)?.type !== "image_url") continue;
		const url = resolveImageUrlPart(part);
		if (!url) return { kind: "invalid" };
		urls.push(url);
	}
	return {
		kind: "valid",
		urls
	};
}
function parseImageUrlToSource(url) {
	const dataUriMatch = /^data:([^,]*?),(.*)$/is.exec(url);
	if (dataUriMatch) {
		const metadata = normalizeOptionalString(dataUriMatch[1]) ?? "";
		const data = dataUriMatch[2] ?? "";
		const metadataParts = metadata.split(";").map((part) => normalizeOptionalString(part) ?? "").filter(Boolean);
		if (!metadataParts.some((part) => normalizeLowercaseStringOrEmpty(part) === "base64")) throw new Error("image_url data URI must be base64 encoded");
		if (!(normalizeOptionalString(data) ?? "")) throw new Error("image_url data URI is missing payload data");
		return {
			type: "base64",
			mediaType: metadataParts.find((part) => part.includes("/")),
			data
		};
	}
	return {
		type: "url",
		url
	};
}
function resolveActiveTurnContext(messages = []) {
	for (let i = messages.length - 1; i >= 0; i -= 1) {
		const msg = asOptionalObjectRecord(messages[i]);
		if (!msg) continue;
		const role = normalizeOptionalString(msg.role) ?? "";
		const normalizedRole = role === "function" ? "tool" : role;
		if (normalizedRole !== "user" && normalizedRole !== "tool") continue;
		const imageUrls = normalizedRole === "user" ? extractImageUrls(msg.content) : {
			kind: "valid",
			urls: []
		};
		return {
			activeUserMessageIndex: normalizedRole === "user" ? i : -1,
			imageUrls
		};
	}
	return {
		activeUserMessageIndex: -1,
		imageUrls: {
			kind: "valid",
			urls: []
		}
	};
}
async function resolveImagesForRequest(activeTurnContext, limits, signal, assertCurrent) {
	signal.throwIfAborted();
	if (activeTurnContext.imageUrls.kind === "invalid") throw new Error("image_url part is missing a valid URL");
	const urls = activeTurnContext.imageUrls.urls;
	if (urls.length === 0) return [];
	if (urls.length > limits.maxImageParts) throw new Error(`Too many image_url parts (${urls.length}; limit ${limits.maxImageParts})`);
	const images = [];
	let totalBytes = 0;
	for (const url of urls) {
		assertCurrent();
		const source = parseImageUrlToSource(url);
		if (source.type === "base64") {
			const sourceBytes = estimateBase64DecodedBytes(source.data);
			if (totalBytes + sourceBytes > limits.maxTotalImageBytes) throw new Error(`Total image payload too large (${totalBytes + sourceBytes}; limit ${limits.maxTotalImageBytes})`);
		}
		const image = await extractImageContentFromSource(source, limits.images, signal);
		totalBytes += estimateBase64DecodedBytes(image.data);
		if (totalBytes > limits.maxTotalImageBytes) throw new Error(`Total image payload too large (${totalBytes}; limit ${limits.maxTotalImageBytes})`);
		images.push(image);
	}
	return images;
}
function buildAgentPrompt(messages, activeTurnContext) {
	const hasActiveTurnImage = activeTurnContext.imageUrls.kind === "valid" && activeTurnContext.imageUrls.urls.length > 0;
	const systemParts = [];
	const conversationEntries = [];
	for (const [i, rawMessage] of (messages ?? []).entries()) {
		const msg = asOptionalObjectRecord(rawMessage);
		if (!msg) continue;
		const role = normalizeOptionalString(msg.role) ?? "";
		const content = (role === "function" && msg.content === null ? "" : extractTextContent(msg.content))?.trim();
		if (!role) continue;
		if (role === "system" || role === "developer") {
			if (content) systemParts.push(content);
			continue;
		}
		const normalizedRole = role === "function" ? "tool" : role;
		if (normalizedRole !== "user" && normalizedRole !== "assistant" && normalizedRole !== "tool") continue;
		const assistantToolCallsSummary = (normalizedRole === "assistant" ? extractAssistantToolCalls(msg.tool_calls) : []).map(renderConversationToolCall).join("\n");
		const messageContent = [normalizedRole === "user" && !content && hasActiveTurnImage && i === activeTurnContext.activeUserMessageIndex ? IMAGE_ONLY_USER_MESSAGE : content, assistantToolCallsSummary].filter((part) => Boolean(part)).join("\n");
		const name = normalizeOptionalString(msg.name) ?? "";
		const toolCallId = normalizeOptionalString(msg.tool_call_id) ?? "";
		const isToolResult = normalizedRole === "tool" && Boolean(role === "function" ? name : toolCallId) && content !== void 0 && (role !== "function" || typeof msg.content === "string" || msg.content === null);
		if (!messageContent && !isToolResult) continue;
		const sender = normalizedRole === "assistant" ? "Assistant" : normalizedRole === "user" ? "User" : toolCallId ? `Tool:${toolCallId}` : name ? `Tool:${name}` : "Tool";
		conversationEntries.push({
			role: normalizedRole,
			entry: {
				sender,
				body: messageContent
			},
			internalStreamError: normalizedRole === "assistant" && normalizeOptionalString(msg.stopReason) === "error" && messageContent.trim() === STREAM_ERROR_FALLBACK_TEXT
		});
	}
	return {
		message: buildAgentMessageFromConversationEntries(conversationEntries),
		extraSystemPrompt: systemParts.length > 0 ? systemParts.join("\n\n") : void 0
	};
}
function resolveChatCompletionUsage(result) {
	return toOpenAiChatCompletionsUsage(resolveAgentRunUsage(result));
}
async function handleOpenAiHttpRequest(req, res, opts) {
	const limits = resolveOpenAiChatCompletionsLimits(opts.config);
	const handled = await handleGatewayPostJsonEndpoint(req, res, {
		...opts,
		pathname: "/v1/chat/completions",
		requiredOperatorMethod: "chat.send",
		resolveOperatorScopes: resolveSharedSecretHttpOperatorScopes,
		maxBodyBytes: opts.maxBodyBytes ?? limits.maxBodyBytes
	});
	if (handled === false) return false;
	if (!handled) return true;
	const abortController = new AbortController();
	let onDisconnect = () => {};
	watchClientDisconnect(req, res, abortController, () => onDisconnect());
	const modelOverrideAuth = authorizeOpenAiCompatibleHttpModelOverride(req, handled.requestAuth);
	if (!modelOverrideAuth.allowed) {
		sendMissingScopeForbidden(res, modelOverrideAuth.missingScope);
		return true;
	}
	const senderIsOwner = resolveOpenAiCompatibleHttpSenderIsOwner(req, handled.requestAuth);
	const payload = parseGatewayJsonRequest(res, handled.body, OpenAiChatCompletionRequestSchema);
	if (!payload) return true;
	const hasMedia = (payload.messages ?? []).some((message) => {
		const content = asOptionalObjectRecord(message)?.content;
		return Array.isArray(content) && content.some((part) => {
			const type = asOptionalObjectRecord(part)?.type;
			return type === "image_url" || type === "file";
		});
	});
	if (rejectDisabledGatewayUpload(res, hasMedia)) return true;
	const stream = payload.stream === true;
	const streamIncludeUsage = stream && payload.stream_options?.include_usage === true;
	const model = payload.model ?? "openclaw";
	const user = payload.user;
	const maxTokens = payload.max_completion_tokens ?? payload.max_tokens ?? void 0;
	const temperature = payload.temperature ?? void 0;
	const topP = payload.top_p ?? void 0;
	const frequencyPenalty = payload.frequency_penalty ?? void 0;
	const presencePenalty = payload.presence_penalty ?? void 0;
	const seed = payload.seed ?? void 0;
	let responseFormat;
	try {
		responseFormat = resolveResponseFormat(payload.response_format);
	} catch (err) {
		sendInvalidRequest(res, `Invalid response_format: ${formatErrorMessage(err).trim()}`);
		return true;
	}
	let stop;
	try {
		stop = resolveStopSequences(payload.stop);
	} catch (err) {
		sendInvalidRequest(res, `Invalid stop: ${formatErrorMessage(err).trim()}`);
		return true;
	}
	const samplingError = validateOpenAiSamplingParams({
		temperature: payload.temperature,
		topP: payload.top_p,
		frequencyPenalty: payload.frequency_penalty,
		presencePenalty: payload.presence_penalty,
		seed: payload.seed
	});
	if (samplingError) {
		sendInvalidRequest(res, samplingError);
		return true;
	}
	const streamParams = maxTokens !== void 0 || temperature !== void 0 || topP !== void 0 || responseFormat !== void 0 || frequencyPenalty !== void 0 || presencePenalty !== void 0 || seed !== void 0 || stop !== void 0 ? {
		...maxTokens !== void 0 ? { maxTokens } : {},
		...temperature !== void 0 ? { temperature } : {},
		...topP !== void 0 ? { topP } : {},
		...responseFormat !== void 0 ? { responseFormat } : {},
		...frequencyPenalty !== void 0 ? { frequencyPenalty } : {},
		...presencePenalty !== void 0 ? { presencePenalty } : {},
		...seed !== void 0 ? { seed } : {},
		...stop !== void 0 ? { stop } : {}
	} : void 0;
	let agentId;
	let sessionKey;
	let messageChannel;
	try {
		({agentId, sessionKey, messageChannel} = resolveGatewayRequestContext({
			req,
			model,
			user,
			sessionPrefix: "openai",
			defaultMessageChannel: "webchat",
			useMessageChannelHeader: true
		}));
	} catch (err) {
		if (isGatewayRequestContextError(err)) {
			sendInvalidRequest(res, err.message);
			return true;
		}
		throw err;
	}
	const creationAuth = authorizeGatewaySessionCreation({
		cfg: getRuntimeConfig(),
		...handled.requestAuth.operatorRoleActor ? { actor: handled.requestAuth.operatorRoleActor } : { profileId: handled.requestAuth.authenticatedUserProfile?.profileId },
		agentId
	});
	if (creationAuth) {
		sendJson(res, 403, { error: {
			message: creationAuth.message,
			type: "forbidden"
		} });
		return true;
	}
	const sessionAuth = authorizeOpenAiCompatibleHttpSession({
		agentId,
		sessionKey,
		requestAuth: handled.requestAuth,
		senderIsOwner
	});
	if (!sessionAuth.allowed) {
		sendJson(res, 403, { error: {
			message: sessionAuth.message,
			type: "forbidden"
		} });
		return true;
	}
	const { modelOverride, errorMessage: modelError } = await resolveOpenAiCompatModelOverride({
		req,
		agentId,
		model
	});
	if (modelError) {
		sendInvalidRequest(res, modelError);
		return true;
	}
	const activeTurnContext = resolveActiveTurnContext(payload.messages);
	const prompt = buildAgentPrompt(payload.messages, activeTurnContext);
	let toolChoice;
	try {
		const parsedClientTools = extractClientToolsFromChatRequest(payload.tools);
		toolChoice = applyToolChoice(parsedClientTools, resolveChatToolChoice(payload.tool_choice));
	} catch (err) {
		sendInvalidRequest(res, `Invalid tools/tool_choice: ${formatErrorMessage(err).trim()}`);
		return true;
	}
	let images;
	try {
		assertGatewayHttpRequestCurrent(handled.requestAuth);
		images = await resolveImagesForRequest(activeTurnContext, limits, abortController.signal, () => {
			assertGatewayHttpRequestCurrent(handled.requestAuth);
			if (hasMedia && !areGatewayUploadsEnabled(getRuntimeConfig())) throw new Error(GATEWAY_UPLOADS_DISABLED_MESSAGE);
		});
	} catch (err) {
		if (abortController.signal.aborted) return true;
		if (handled.requestAuth.hasCurrentClientAuthority?.() === false) {
			sendUnauthorized(res);
			return true;
		}
		if (rejectDisabledGatewayUpload(res, hasMedia)) return true;
		logWarn(`openai-compat: invalid image_url content: ${String(err)}`);
		sendInvalidRequest(res, "Invalid image_url content in `messages`.");
		return true;
	}
	if (rejectDisabledGatewayUpload(res, hasMedia)) return true;
	if (!prompt.message && images.length === 0) {
		sendInvalidRequest(res, "Missing user message in `messages`.");
		return true;
	}
	const runId = `chatcmpl_${randomUUID()}`;
	const created = Math.floor(Date.now() / 1e3);
	const streamIdentity = {
		runId,
		model,
		created
	};
	const mergedExtraSystemPrompt = [prompt.extraSystemPrompt, toolChoice.extraSystemPrompt].filter((part) => Boolean(part)).join("\n\n");
	const runAgentCommand = () => runOpenAiCompatibleAgentCommand({
		message: prompt.message,
		extraSystemPrompt: mergedExtraSystemPrompt,
		images,
		clientTools: toolChoice.tools,
		modelOverride,
		sessionKey,
		runId,
		messageChannel,
		senderIsOwner,
		requestAuth: handled.requestAuth,
		operatorScopes: handled.operatorScopes,
		abortSignal: abortController.signal,
		hasCurrentClientAuthority: handled.requestAuth.hasCurrentClientAuthority,
		hasClientUploads: hasMedia,
		streamParams,
		resolveGatewayContext: opts.resolveGatewayContext
	});
	if (!stream) {
		try {
			const result = await runAgentCommand();
			if (abortController.signal.aborted) return true;
			const { runFailed, stopReason, pendingToolCalls } = readOpenAiHttpRunTerminal(result);
			if (runFailed) throw new Error("agent run failed");
			const usage = resolveChatCompletionUsage(result);
			const toolChoiceError = resolveToolChoiceConstraintError(toolChoice.constraint, pendingToolCalls);
			if (toolChoiceError) {
				sendJson(res, 502, { error: {
					message: toolChoiceError,
					type: "api_error"
				} });
				return true;
			}
			const toolCalls = stopReason === "tool_calls" && pendingToolCalls?.length ? pendingToolCalls : void 0;
			const content = resolveAssistantResultText(result) || (toolCalls ? "" : "No response from OpenClaw.");
			sendJson(res, 200, {
				id: runId,
				object: "chat.completion",
				created,
				model,
				choices: [{
					index: 0,
					message: {
						role: "assistant",
						content,
						...toolCalls ? { tool_calls: toolCalls.map((call) => ({
							id: call.id,
							type: "function",
							function: {
								name: call.name,
								arguments: call.arguments
							}
						})) } : {}
					},
					finish_reason: toolCalls ? "tool_calls" : stopReason === "length" ? "length" : "stop"
				}],
				usage
			});
		} catch (err) {
			if (abortController.signal.aborted) return true;
			logWarn(`openai-compat: chat completion failed: ${String(err)}`);
			const mapped = resolveOpenAiCompatibleAgentError(err);
			sendJson(res, mapped.status, { error: mapped.error });
		}
		return true;
	}
	setSseHeaders(res);
	const textStream = createAssistantTextStream(Boolean(toolChoice.constraint));
	let finalResultText;
	let finalFinishReason = "stop";
	let finalToolCalls;
	let finalUsage;
	let finalizeScheduled = false;
	let resultResolved = false;
	let closed = false;
	let observedTerminalLifecycle = false;
	let terminalStreamError;
	let terminalLifecyclePhase = "end";
	const requestFinalize = () => {
		if (closed || finalizeScheduled) return;
		if (!resultResolved) return;
		if (streamIncludeUsage && !finalUsage) return;
		finalizeScheduled = true;
		queueMicrotask(() => {
			if (closed) return;
			if (terminalStreamError) {
				finishStreamWithError(terminalStreamError);
				return;
			}
			const text = textStream.complete(finalResultText, finalToolCalls ? "" : "No response from OpenClaw.");
			if (!text.startsWith(textStream.streamedText)) {
				finishStreamWithError({
					message: "Assistant output cannot be represented as an append-only response stream.",
					type: "api_error"
				});
				return;
			}
			const content = text.slice(textStream.streamedText.length);
			if (content) writeChatCompletionChoice(res, streamIdentity, { content });
			if (finalToolCalls) writeAssistantToolCallsIncrementalChunks(res, {
				...streamIdentity,
				toolCalls: finalToolCalls
			});
			closed = true;
			unsubscribe();
			writeChatCompletionChoice(res, streamIdentity, {}, finalToolCalls ? "tool_calls" : finalFinishReason);
			if (streamIncludeUsage && finalUsage) writeChatCompletionChunk(res, streamIdentity, {
				choices: [],
				usage: finalUsage
			});
			writeDone(res);
			res.end();
		});
	};
	const unsubscribe = onAgentEventForRun(runId, (evt) => {
		if (closed) return;
		if (evt.stream === "assistant") {
			const { delta: content, replacement } = textStream.update(evt.data);
			if (replacement === "unrepresentable") {
				terminalStreamError ??= {
					message: "Assistant output cannot be represented as an append-only response stream.",
					type: "api_error"
				};
				return;
			}
			if (!content) return;
			writeChatCompletionChoice(res, streamIdentity, { content });
			return;
		}
		if (evt.stream === "lifecycle") {
			const phase = evt.data?.phase;
			if (phase === "start") observedTerminalLifecycle = false;
			if (phase === "end" || phase === "error") {
				observedTerminalLifecycle = true;
				if (phase === "error" && terminalLifecyclePhase !== "error") terminalStreamError ??= {
					message: normalizeOptionalString(evt.data?.error) ?? "Agent run failed",
					type: "api_error"
				};
				requestFinalize();
			}
		}
	});
	const finishStreamWithError = (error) => {
		if (closed) return;
		closed = true;
		unsubscribe();
		writeSse(res, { error });
		writeDone(res);
		res.end();
	};
	const releaseAgentRootWork = retainGatewayRootWorkAdmissionContinuation();
	const releaseStreamRootWork = retainGatewayHttpResponseWork(res);
	onDisconnect = () => {
		closed = true;
		unsubscribe();
		releaseStreamRootWork();
	};
	writeChatCompletionChoice(res, streamIdentity, { role: "assistant" });
	(async () => {
		try {
			const result = await runAgentCommand();
			resultResolved = true;
			if (closed) return;
			const { runFailed, stopReason, pendingToolCalls } = readOpenAiHttpRunTerminal(result);
			if (runFailed) {
				terminalLifecyclePhase = "error";
				finishStreamWithError({
					message: "internal error",
					type: "api_error"
				});
				return;
			}
			if (terminalStreamError) {
				finishStreamWithError(terminalStreamError);
				return;
			}
			finalUsage = resolveChatCompletionUsage(result);
			const toolChoiceError = resolveToolChoiceConstraintError(toolChoice.constraint, pendingToolCalls);
			if (toolChoiceError) {
				finishStreamWithError({
					message: toolChoiceError,
					type: "api_error"
				});
				return;
			}
			finalResultText = resolveAssistantResultText(result);
			finalFinishReason = stopReason === "length" ? "length" : "stop";
			finalToolCalls = stopReason === "tool_calls" && pendingToolCalls?.length ? pendingToolCalls : void 0;
			requestFinalize();
		} catch (err) {
			resultResolved = true;
			if (closed || abortController.signal.aborted) return;
			terminalLifecyclePhase = "error";
			logWarn(`openai-compat: streaming chat completion failed: ${String(err)}`);
			finishStreamWithError(resolveOpenAiCompatibleAgentError(err, terminalStreamError).error);
		} finally {
			releaseAgentRootWork?.();
			if (!observedTerminalLifecycle && (terminalLifecyclePhase === "error" || !closed)) emitAgentEvent({
				runId,
				stream: "lifecycle",
				data: { phase: terminalLifecyclePhase }
			});
		}
	})();
	return true;
}
//#endregion
export { handleOpenAiHttpRequest };
