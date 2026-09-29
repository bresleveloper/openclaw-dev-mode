import { d as asPositiveSafeInteger } from "./number-coercion-CLj0HTDM.mjs";
import { l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.mjs";
import { t as avoidTrailingHighSurrogateBreak } from "./utf16-slice-D_ngcYKd.mjs";
import { Fn as object, Jn as string, Lt as boolean, Nt as array, Pn as number, or as union, sr as unknown } from "./schemas-BOYIvvln.mjs";
import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { r as getRuntimeConfig } from "./io.runtime-BN-rPaec.mjs";
import "./io-DuIKUcsW.mjs";
import { i as logWarn } from "./logger-BHMMVs5C.mjs";
import { g as retainGatewayRootWorkAdmissionContinuation } from "./gateway-work-admission-CHv_0noy.mjs";
import { i as emitAgentEvent, p as onAgentEventForRun } from "./agent-events-BOSJcayE.mjs";
import { n as authorizeGatewaySessionCreation } from "./operator-role-policy-BNrKHiJ3.mjs";
import { n as estimateBase64DecodedBytes } from "./base64-B5EyWEOm.mjs";
import { f as toOpenAiChatCompletionsUsage } from "./usage-XXLoqJQC.mjs";
import { c as normalizeMimeList, n as DEFAULT_INPUT_IMAGE_MIMES, o as extractImageContentFromSource, r as DEFAULT_INPUT_TIMEOUT_MS, t as DEFAULT_INPUT_IMAGE_MAX_BYTES } from "./input-files-CJ_O6M0_.mjs";
import { r as isClientToolNameConflictError } from "./agent-tool-definition-adapter-CN0S9YZi.mjs";
import { i as authorizeOpenAiCompatibleHttpModelOverride, l as resolveOpenAiCompatibleHttpSenderIsOwner, p as assertGatewayHttpRequestCurrent, u as resolveSharedSecretHttpOperatorScopes } from "./http-auth-utils-BJQtuB_7.mjs";
import { c as sendJson, f as sendUnauthorized, g as writeDone, h as watchClientDisconnect, i as parseGatewayJsonRequest, m as setSseHeaders, s as sendInvalidRequest, u as sendMissingScopeForbidden } from "./http-common-Ckbyca3h.mjs";
import { a as isGatewaySessionKeyOverrideError, c as isUnknownGatewayAgentError, d as resolveGatewayRequestContext, f as resolveOpenAiCompatModelOverride, i as isAgentSelectionRequiredError, o as isInvalidGatewayModelError, r as authorizeOpenAiCompatibleHttpSession } from "./http-utils-BihU3mvk.mjs";
import { t as handleGatewayPostJsonEndpoint } from "./http-endpoint-helpers-D_zB1Wtg.mjs";
import { a as resolveAssistantTextInput, i as resolveAssistantTextCompletion, n as mergePendingAssistantText, o as resolveAssistantTextStreamDelta, r as resolveAssistantResultText, t as mergeAssistantText } from "./agent-event-assistant-text-DvsC02YI.mjs";
import { a as resolveUnsatisfiedToolChoiceMessage, c as resolveOpenAiCompatError, d as normalizeInputHostnameAllowlist, f as IMAGE_ONLY_USER_MESSAGE, l as validateOpenAiSamplingParams, m as renderConversationToolCall, n as isToolChoiceConstraintSatisfied, o as readOpenAiHttpRunTerminal, p as buildAgentMessageFromConversationEntries, r as resolveChatToolChoice, s as runOpenAiCompatibleAgentCommand, t as applyToolChoice, u as resolveAgentRunUsage } from "./openai-tool-choice-C_LFEz7J.mjs";
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
const DEFAULT_OPENAI_CHAT_COMPLETIONS_BODY_BYTES = 20971520;
const DEFAULT_OPENAI_MAX_IMAGE_PARTS = 8;
const DEFAULT_OPENAI_MAX_TOTAL_IMAGE_BYTES = 20971520;
const DEFAULT_OPENAI_IMAGE_LIMITS = {
	allowUrl: false,
	allowedMimes: new Set(DEFAULT_INPUT_IMAGE_MIMES),
	maxBytes: DEFAULT_INPUT_IMAGE_MAX_BYTES,
	maxRedirects: 3,
	timeoutMs: DEFAULT_INPUT_TIMEOUT_MS
};
function resolveOpenAiChatCompletionsLimits(config) {
	const imageConfig = config?.images;
	return {
		maxBodyBytes: DEFAULT_OPENAI_CHAT_COMPLETIONS_BODY_BYTES,
		maxImageParts: DEFAULT_OPENAI_MAX_IMAGE_PARTS,
		maxTotalImageBytes: DEFAULT_OPENAI_MAX_TOTAL_IMAGE_BYTES,
		images: {
			allowUrl: imageConfig?.allowUrl ?? DEFAULT_OPENAI_IMAGE_LIMITS.allowUrl,
			urlAllowlist: normalizeInputHostnameAllowlist(imageConfig?.urlAllowlist),
			allowedMimes: normalizeMimeList(imageConfig?.allowedMimes, DEFAULT_INPUT_IMAGE_MIMES),
			maxBytes: imageConfig?.maxBytes ?? 10485760,
			maxRedirects: imageConfig?.maxRedirects ?? 3,
			timeoutMs: imageConfig?.timeoutMs ?? 1e4
		}
	};
}
function writeSse(res, data) {
	res.write(`data: ${JSON.stringify(data)}\n\n`);
}
function extractClientToolsFromChatRequest(tools) {
	if (tools == null) return [];
	if (!Array.isArray(tools)) throw new Error("tools must be an array");
	const clientTools = [];
	for (const tool of tools) {
		if (!tool || typeof tool !== "object" || Array.isArray(tool)) throw new Error("each tool must be an object");
		if (tool.type !== "function") throw new Error("only function tools are supported");
		const functionValue = tool.function;
		if (!functionValue || typeof functionValue !== "object" || Array.isArray(functionValue)) throw new Error("tool.function is required");
		const rawName = functionValue.name;
		const name = typeof rawName === "string" ? rawName.trim() : "";
		if (!name) throw new Error("tool.function.name is required");
		const description = functionValue.description;
		const parameters = functionValue.parameters;
		const strict = functionValue.strict;
		clientTools.push({
			type: "function",
			function: {
				name,
				...typeof description === "string" ? { description } : {},
				...parameters && typeof parameters === "object" && !Array.isArray(parameters) ? { parameters } : {},
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
function writeAssistantRoleChunk(res, params) {
	writeChatCompletionChunk(res, params, { choices: [{
		index: 0,
		delta: { role: "assistant" },
		finish_reason: null
	}] });
}
function writeAssistantContentChunk(res, params) {
	writeChatCompletionChunk(res, params, { choices: [{
		index: 0,
		delta: { content: params.content },
		finish_reason: null
	}] });
}
function writeAssistantFinishChunk(res, params) {
	writeChatCompletionChunk(res, params, { choices: [{
		index: 0,
		delta: {},
		finish_reason: params.finishReason
	}] });
}
function writeAssistantToolCallsIncrementalChunks(res, params) {
	for (const [index, call] of params.toolCalls.entries()) {
		writeChatCompletionChunk(res, params, { choices: [{
			index: 0,
			delta: { tool_calls: [{
				index,
				id: call.id,
				type: "function",
				function: {
					name: call.name,
					arguments: ""
				}
			}] },
			finish_reason: null
		}] });
		let start = 0;
		do {
			const end = avoidTrailingHighSurrogateBreak(call.arguments, start, Math.min(start + 256, call.arguments.length));
			writeChatCompletionChunk(res, params, { choices: [{
				index: 0,
				delta: { tool_calls: [{
					index,
					function: { arguments: call.arguments.slice(start, end) }
				}] },
				finish_reason: null
			}] });
			start = end;
		} while (start < call.arguments.length);
	}
}
function writeUsageChunk(res, params) {
	writeChatCompletionChunk(res, params, {
		choices: [],
		usage: params.usage
	});
}
function asMessages(val) {
	return Array.isArray(val) ? val : [];
}
function extractTextContent(content) {
	if (typeof content === "string") return content;
	if (Array.isArray(content)) {
		const parts = content.map((part) => {
			if (!part || typeof part !== "object") return;
			const type = part.type;
			const text = part.text;
			const inputText = part.input_text;
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
		if (!rawCall || typeof rawCall !== "object" || Array.isArray(rawCall)) continue;
		const id = normalizeOptionalString(rawCall.id) ?? "";
		const functionValue = rawCall.function;
		if (!functionValue || typeof functionValue !== "object" || Array.isArray(functionValue)) continue;
		const name = normalizeOptionalString(functionValue.name) ?? "";
		if (!id || !name) continue;
		const argumentsValue = stringifyToolCallArguments(functionValue.arguments);
		calls.push({
			id,
			name,
			arguments: argumentsValue
		});
	}
	return calls;
}
function resolveImageUrlPart(part) {
	if (!part || typeof part !== "object") return;
	const imageUrl = part.image_url;
	if (typeof imageUrl === "string") {
		const trimmed = imageUrl.trim();
		return trimmed.length > 0 ? trimmed : void 0;
	}
	if (!imageUrl || typeof imageUrl !== "object") return;
	const rawUrl = imageUrl.url;
	if (typeof rawUrl !== "string") return;
	const trimmed = rawUrl.trim();
	return trimmed.length > 0 ? trimmed : void 0;
}
function extractImageUrls(content) {
	const urls = [];
	if (!Array.isArray(content)) return {
		kind: "valid",
		urls
	};
	for (const part of content) {
		if (!part || typeof part !== "object") continue;
		if (part.type !== "image_url") continue;
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
function resolveActiveTurnContext(messagesUnknown) {
	const messages = asMessages(messagesUnknown);
	for (let i = messages.length - 1; i >= 0; i -= 1) {
		const msg = messages[i];
		if (!msg || typeof msg !== "object") continue;
		const role = normalizeOptionalString(msg.role) ?? "";
		const normalizedRole = role === "function" ? "tool" : role;
		if (normalizedRole !== "user" && normalizedRole !== "tool") continue;
		const imageUrls = normalizedRole === "user" ? extractImageUrls(msg.content) : {
			kind: "valid",
			urls: []
		};
		return {
			activeTurnIndex: i,
			activeUserMessageIndex: normalizedRole === "user" ? i : -1,
			imageUrls
		};
	}
	return {
		activeTurnIndex: -1,
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
function buildAgentPrompt(messagesUnknown, activeTurnContext) {
	const messages = asMessages(messagesUnknown);
	const hasActiveTurnImage = activeTurnContext.imageUrls.kind === "valid" && activeTurnContext.imageUrls.urls.length > 0;
	const systemParts = [];
	const conversationEntries = [];
	for (const [i, msg] of messages.entries()) {
		if (!msg || typeof msg !== "object") continue;
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
function resolveIncludeUsageForStreaming(payload) {
	const streamOptions = payload.stream_options;
	if (!streamOptions || typeof streamOptions !== "object" || Array.isArray(streamOptions)) return false;
	return streamOptions.include_usage === true;
}
function resolveResponseFormat(value) {
	if (value == null) return;
	if (typeof value !== "object" || Array.isArray(value)) throw new Error("response_format must be an object");
	const obj = value;
	const type = obj.type;
	if (type !== "text" && type !== "json_object" && type !== "json_schema") throw new Error("response_format.type must be text, json_object, or json_schema");
	return obj;
}
function resolveStopSequences(value) {
	if (value == null) return;
	const list = typeof value === "string" ? [value] : value;
	if (!Array.isArray(list)) throw new Error("stop must be a string or array of strings");
	if (list.length > 4) throw new Error("stop supports at most 4 sequences");
	const sequences = [];
	for (const item of list) {
		if (typeof item !== "string" || item.length === 0) throw new Error("stop entries must be non-empty strings");
		sequences.push(item);
	}
	return sequences.length > 0 ? sequences : void 0;
}
function resolveChatCompletionTokenCap(value, field) {
	if (value == null) return;
	const maxTokens = asPositiveSafeInteger(value);
	if (maxTokens === void 0) throw new Error(`${field} must be a positive safe integer`);
	return maxTokens;
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
	const stream = payload.stream === true;
	const streamIncludeUsage = stream && resolveIncludeUsageForStreaming(payload);
	const model = typeof payload.model === "string" ? payload.model : "openclaw";
	const user = typeof payload.user === "string" ? payload.user : void 0;
	let maxTokens;
	try {
		const maxCompletionTokens = resolveChatCompletionTokenCap(payload.max_completion_tokens, "max_completion_tokens");
		const legacyMaxTokens = resolveChatCompletionTokenCap(payload.max_tokens, "max_tokens");
		maxTokens = maxCompletionTokens ?? legacyMaxTokens;
	} catch (err) {
		sendInvalidRequest(res, formatErrorMessage(err).trim());
		return true;
	}
	const temperature = typeof payload.temperature === "number" ? payload.temperature : void 0;
	const topP = typeof payload.top_p === "number" ? payload.top_p : void 0;
	const frequencyPenalty = typeof payload.frequency_penalty === "number" ? payload.frequency_penalty : void 0;
	const presencePenalty = typeof payload.presence_penalty === "number" ? payload.presence_penalty : void 0;
	const seed = typeof payload.seed === "number" ? payload.seed : void 0;
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
		if (isAgentSelectionRequiredError(err) || isUnknownGatewayAgentError(err) || isInvalidGatewayModelError(err) || isGatewaySessionKeyOverrideError(err)) {
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
	let resolvedClientTools;
	let toolChoicePrompt;
	let toolChoiceConstraint;
	try {
		const parsedClientTools = extractClientToolsFromChatRequest(payload.tools);
		const toolChoiceResult = applyToolChoice(parsedClientTools, resolveChatToolChoice(payload.tool_choice));
		resolvedClientTools = toolChoiceResult.tools;
		toolChoicePrompt = toolChoiceResult.extraSystemPrompt;
		toolChoiceConstraint = toolChoiceResult.constraint;
	} catch (err) {
		sendInvalidRequest(res, `Invalid tools/tool_choice: ${formatErrorMessage(err).trim()}`);
		return true;
	}
	let images;
	try {
		assertGatewayHttpRequestCurrent(handled.requestAuth);
		images = await resolveImagesForRequest(activeTurnContext, limits, abortController.signal, () => assertGatewayHttpRequestCurrent(handled.requestAuth));
	} catch (err) {
		if (abortController.signal.aborted) return true;
		if (handled.requestAuth.hasCurrentClientAuthority?.() === false) {
			sendUnauthorized(res);
			return true;
		}
		logWarn(`openai-compat: invalid image_url content: ${String(err)}`);
		sendInvalidRequest(res, "Invalid image_url content in `messages`.");
		return true;
	}
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
	const mergedExtraSystemPrompt = [prompt.extraSystemPrompt, toolChoicePrompt].filter((part) => Boolean(part)).join("\n\n");
	const runAgentCommand = () => runOpenAiCompatibleAgentCommand({
		message: prompt.message,
		extraSystemPrompt: mergedExtraSystemPrompt,
		images,
		clientTools: resolvedClientTools,
		modelOverride,
		sessionKey,
		runId,
		messageChannel,
		senderIsOwner,
		requestAuth: handled.requestAuth,
		operatorScopes: handled.operatorScopes,
		abortSignal: abortController.signal,
		hasCurrentClientAuthority: handled.requestAuth.hasCurrentClientAuthority,
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
			if (toolChoiceConstraint && !isToolChoiceConstraintSatisfied({
				constraint: toolChoiceConstraint,
				pendingToolCalls
			})) {
				sendJson(res, 502, { error: {
					message: resolveUnsatisfiedToolChoiceMessage(toolChoiceConstraint),
					type: "api_error"
				} });
				return true;
			}
			if (stopReason === "tool_calls" && pendingToolCalls && pendingToolCalls.length > 0) {
				const commentary = resolveAssistantResultText(result) ?? "";
				sendJson(res, 200, {
					id: runId,
					object: "chat.completion",
					created,
					model,
					choices: [{
						index: 0,
						message: {
							role: "assistant",
							content: commentary,
							tool_calls: pendingToolCalls.map((call) => ({
								id: call.id,
								type: "function",
								function: {
									name: call.name,
									arguments: call.arguments
								}
							}))
						},
						finish_reason: "tool_calls"
					}],
					usage
				});
				return true;
			}
			const content = resolveAssistantResultText(result) || "No response from OpenClaw.";
			sendJson(res, 200, {
				id: runId,
				object: "chat.completion",
				created,
				model,
				choices: [{
					index: 0,
					message: {
						role: "assistant",
						content
					},
					finish_reason: stopReason === "length" ? "length" : "stop"
				}],
				usage
			});
		} catch (err) {
			if (abortController.signal.aborted) return true;
			logWarn(`openai-compat: chat completion failed: ${String(err)}`);
			if (isClientToolNameConflictError(err)) {
				sendInvalidRequest(res, "invalid tool configuration");
				return true;
			}
			const mapped = resolveOpenAiCompatError(err);
			if (mapped) {
				sendJson(res, mapped.status, { error: mapped.error });
				return true;
			}
			sendJson(res, 500, { error: {
				message: "internal error",
				type: "api_error"
			} });
		}
		return true;
	}
	setSseHeaders(res);
	let wroteStopChunk = false;
	let assistantText = { text: "" };
	let streamedAssistantText = assistantText;
	let pendingAssistantText;
	let finalResultText;
	let finalFinishReason = "stop";
	let finalToolCalls;
	let finalUsage;
	let finalizeRequested = false;
	let finalizeScheduled = false;
	let resultResolved = false;
	let closed = false;
	let observedTerminalLifecycle = false;
	let terminalStreamError;
	let terminalLifecyclePhase = "end";
	const maybeFinalize = () => {
		if (closed || finalizeScheduled || !finalizeRequested) return;
		if (!resultResolved) return;
		if (streamIncludeUsage && !finalUsage) return;
		finalizeScheduled = true;
		queueMicrotask(() => {
			if (closed) return;
			if (terminalStreamError) {
				finishStreamWithError(terminalStreamError);
				return;
			}
			const text = resolveAssistantTextCompletion({
				assistantText,
				pending: pendingAssistantText,
				resultText: finalResultText,
				streamedText: streamedAssistantText.text,
				fallbackText: finalToolCalls ? "" : "No response from OpenClaw."
			});
			if (!text.startsWith(streamedAssistantText.text)) {
				finishStreamWithError({
					message: "Assistant output cannot be represented as an append-only response stream.",
					type: "api_error"
				});
				return;
			}
			const content = text.slice(streamedAssistantText.text.length);
			if (content) writeAssistantContentChunk(res, {
				...streamIdentity,
				content
			});
			if (finalToolCalls) writeAssistantToolCallsIncrementalChunks(res, {
				...streamIdentity,
				toolCalls: finalToolCalls
			});
			closed = true;
			unsubscribe();
			if (!wroteStopChunk) {
				writeAssistantFinishChunk(res, {
					...streamIdentity,
					finishReason: finalToolCalls ? "tool_calls" : finalFinishReason
				});
				wroteStopChunk = true;
			}
			if (streamIncludeUsage && finalUsage) writeUsageChunk(res, {
				...streamIdentity,
				usage: finalUsage
			});
			writeDone(res);
			res.end();
		});
	};
	const requestFinalize = () => {
		finalizeRequested = true;
		maybeFinalize();
	};
	const unsubscribe = onAgentEventForRun(runId, (evt) => {
		if (evt.runId !== runId) return;
		if (closed) return;
		if (evt.stream === "assistant") {
			const input = resolveAssistantTextInput(evt.data);
			if (!input) return;
			if (input.replaceable || pendingAssistantText) {
				pendingAssistantText = mergePendingAssistantText(pendingAssistantText ?? assistantText, input);
				return;
			}
			const previous = assistantText;
			const merged = mergeAssistantText(previous, input, "append-only");
			assistantText = merged;
			if (toolChoiceConstraint) return;
			const content = resolveAssistantTextStreamDelta(previous, merged, streamedAssistantText);
			if (content === void 0) {
				terminalStreamError ??= {
					message: "Assistant output cannot be represented as an append-only response stream.",
					type: "api_error"
				};
				return;
			}
			streamedAssistantText = assistantText;
			if (!content) return;
			writeAssistantContentChunk(res, {
				...streamIdentity,
				content
			});
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
	const releaseResponseRootWork = retainGatewayRootWorkAdmissionContinuation();
	const releaseStreamRootWork = () => {
		res.off("finish", releaseStreamRootWork);
		res.off("close", releaseStreamRootWork);
		releaseResponseRootWork?.();
	};
	res.once("finish", releaseStreamRootWork);
	res.once("close", releaseStreamRootWork);
	onDisconnect = () => {
		closed = true;
		unsubscribe();
		releaseStreamRootWork();
	};
	writeAssistantRoleChunk(res, streamIdentity);
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
			if (toolChoiceConstraint && !isToolChoiceConstraintSatisfied({
				constraint: toolChoiceConstraint,
				pendingToolCalls
			})) {
				finishStreamWithError({
					message: resolveUnsatisfiedToolChoiceMessage(toolChoiceConstraint),
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
			if (isClientToolNameConflictError(err)) {
				finishStreamWithError({
					message: "invalid tool configuration",
					type: "invalid_request_error"
				});
				return;
			}
			const mapped = resolveOpenAiCompatError(err);
			if (mapped) {
				finishStreamWithError(mapped.error);
				return;
			}
			if (terminalStreamError) {
				finishStreamWithError(terminalStreamError);
				return;
			}
			finishStreamWithError({
				message: "internal error",
				type: "api_error"
			});
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
