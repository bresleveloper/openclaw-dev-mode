import { j as resolveIntegerOption } from "./number-coercion-CLj0HTDM.mjs";
import { Et as _enum, Fn as object, Jn as string, Lt as boolean, Nt as array, Pn as number, Un as record, Yt as discriminatedUnion, or as union, sr as unknown, xn as literal } from "./schemas-BOYIvvln.mjs";
import { t as pruneMapToMaxSize } from "./map-size-CNcWiFKu.mjs";
import { r as getRuntimeConfig } from "./io.runtime-BN-rPaec.mjs";
import "./io-DuIKUcsW.mjs";
import { i as logWarn } from "./logger-BHMMVs5C.mjs";
import { g as retainGatewayRootWorkAdmissionContinuation } from "./gateway-work-admission-CHv_0noy.mjs";
import { i as emitAgentEvent, p as onAgentEventForRun } from "./agent-events-BOSJcayE.mjs";
import { n as authorizeGatewaySessionCreation } from "./operator-role-policy-BNrKHiJ3.mjs";
import { a as wrapExternalContent } from "./external-content-CLufk6dK.mjs";
import { p as toOpenAiResponsesUsage } from "./usage-XXLoqJQC.mjs";
import { a as extractFileContentFromSource, c as normalizeMimeList, l as resolveInputFileLimits, n as DEFAULT_INPUT_IMAGE_MIMES, o as extractImageContentFromSource } from "./input-files-CJ_O6M0_.mjs";
import { t as renderFileContextBlock } from "./file-context-DFxrXkdd.mjs";
import { r as isClientToolNameConflictError } from "./agent-tool-definition-adapter-CN0S9YZi.mjs";
import { i as authorizeOpenAiCompatibleHttpModelOverride, l as resolveOpenAiCompatibleHttpSenderIsOwner, p as assertGatewayHttpRequestCurrent, u as resolveSharedSecretHttpOperatorScopes } from "./http-auth-utils-BJQtuB_7.mjs";
import { n as getHeader, t as getBearerToken } from "./http-header-value-Be14tJQx.mjs";
import { c as sendJson, f as sendUnauthorized, g as writeDone, h as watchClientDisconnect, i as parseGatewayJsonRequest, m as setSseHeaders, s as sendInvalidRequest, u as sendMissingScopeForbidden } from "./http-common-Ckbyca3h.mjs";
import { a as isGatewaySessionKeyOverrideError, c as isUnknownGatewayAgentError, d as resolveGatewayRequestContext, f as resolveOpenAiCompatModelOverride, i as isAgentSelectionRequiredError, l as resolveAgentIdForRequest, o as isInvalidGatewayModelError, r as authorizeOpenAiCompatibleHttpSession } from "./http-utils-BihU3mvk.mjs";
import { t as handleGatewayPostJsonEndpoint } from "./http-endpoint-helpers-D_zB1Wtg.mjs";
import { a as resolveAssistantTextInput, i as resolveAssistantTextCompletion, n as mergePendingAssistantText, o as resolveAssistantTextStreamDelta, r as resolveAssistantResultText, t as mergeAssistantText } from "./agent-event-assistant-text-DvsC02YI.mjs";
import { a as resolveUnsatisfiedToolChoiceMessage, c as resolveOpenAiCompatError, d as normalizeInputHostnameAllowlist, f as IMAGE_ONLY_USER_MESSAGE, i as resolveResponsesToolChoice, m as renderConversationToolCall, n as isToolChoiceConstraintSatisfied, o as readOpenAiHttpRunTerminal, p as buildAgentMessageFromConversationEntries, s as runOpenAiCompatibleAgentCommand, t as applyToolChoice, u as resolveAgentRunUsage } from "./openai-tool-choice-C_LFEz7J.mjs";
import { createHash, randomUUID } from "node:crypto";
//#region src/gateway/open-responses.schema.ts
/**
* OpenResponses API Zod Schemas
*
* Zod schemas for the OpenResponses `/v1/responses` endpoint.
* This module is isolated from gateway imports to enable future codegen and prevent drift.
*
* @see https://www.open-responses.com/
*/
const InputTextContentPartSchema = object({
	type: literal("input_text"),
	text: string()
}).strict();
const OutputTextContentPartSchema = object({
	type: literal("output_text"),
	text: string()
}).strict();
const InputImageSourceSchema = discriminatedUnion("type", [object({
	type: literal("url"),
	url: string().url()
}), object({
	type: literal("base64"),
	media_type: _enum([
		"image/jpeg",
		"image/png",
		"image/gif",
		"image/webp",
		"image/heic",
		"image/heif"
	]),
	data: string().min(1)
})]);
const InputImageContentPartSchema = object({
	type: literal("input_image"),
	source: InputImageSourceSchema
}).strict();
const InputFileSourceSchema = discriminatedUnion("type", [object({
	type: literal("url"),
	url: string().url()
}), object({
	type: literal("base64"),
	media_type: string().min(1),
	data: string().min(1),
	filename: string().optional()
})]);
const InputFileContentPartSchema = object({
	type: literal("input_file"),
	source: InputFileSourceSchema
}).strict();
const ContentPartSchema = discriminatedUnion("type", [
	InputTextContentPartSchema,
	OutputTextContentPartSchema,
	InputImageContentPartSchema,
	InputFileContentPartSchema
]);
const MessageItemRoleSchema = _enum([
	"system",
	"developer",
	"user",
	"assistant"
]);
const AssistantPhaseSchema = _enum(["commentary", "final_answer"]);
const ItemStatusSchema = _enum([
	"in_progress",
	"completed",
	"incomplete"
]);
const MessageItemSchema = object({
	type: literal("message"),
	id: string().optional(),
	role: MessageItemRoleSchema,
	content: union([string(), array(ContentPartSchema)]),
	phase: AssistantPhaseSchema.optional(),
	status: ItemStatusSchema.optional()
}).strict().refine((value) => value.phase === void 0 || value.role === "assistant", {
	path: ["phase"],
	message: "`phase` is only valid on assistant messages."
});
const FunctionCallItemSchema = object({
	type: literal("function_call"),
	id: string().optional(),
	call_id: string().optional(),
	name: string(),
	arguments: string(),
	status: ItemStatusSchema.optional()
}).strict();
const FunctionCallOutputItemSchema = object({
	type: literal("function_call_output"),
	call_id: string(),
	output: string()
}).strict();
const ReasoningItemSchema = object({
	type: literal("reasoning"),
	content: string().optional(),
	encrypted_content: string().optional(),
	summary: string().optional()
}).strict();
const ItemReferenceItemSchema = object({
	type: literal("item_reference"),
	id: string()
}).strict();
const ItemParamSchema = discriminatedUnion("type", [
	MessageItemSchema,
	FunctionCallItemSchema,
	FunctionCallOutputItemSchema,
	ReasoningItemSchema,
	ItemReferenceItemSchema
]);
const ToolDefinitionSchema = object({
	type: literal("function"),
	name: string().min(1, "Tool name cannot be empty"),
	description: string().optional(),
	parameters: record(string(), unknown()).optional(),
	strict: boolean().optional()
}).strict();
const ToolChoiceSchema = union([
	literal("auto"),
	literal("none"),
	literal("required"),
	object({
		type: literal("function"),
		name: string().min(1)
	}).strict(),
	object({
		type: literal("function"),
		function: object({ name: string().min(1) })
	}).strict()
]);
const CreateResponseBodySchema = object({
	model: string(),
	input: union([string(), array(ItemParamSchema)]),
	instructions: string().optional(),
	tools: array(ToolDefinitionSchema).optional(),
	tool_choice: ToolChoiceSchema.optional(),
	text: object({ format: object({ type: literal("text") }).strict() }).strict().optional(),
	stream: boolean().optional(),
	max_output_tokens: number().int().positive().optional(),
	max_tool_calls: number().int().positive().optional(),
	user: string().optional(),
	temperature: number().min(0).max(2).optional(),
	top_p: number().min(0).max(1).optional(),
	metadata: record(string(), string()).optional(),
	store: boolean().optional(),
	previous_response_id: string().optional(),
	reasoning: object({
		effort: _enum([
			"low",
			"medium",
			"high"
		]).optional(),
		summary: _enum([
			"auto",
			"concise",
			"detailed"
		]).optional()
	}).optional(),
	truncation: _enum(["auto", "disabled"]).optional()
}).strict();
//#endregion
//#region src/gateway/openresponses-file-content.ts
/** Wraps untrusted file content for OpenResponses input blocks. */
function wrapUntrustedFileContent(content) {
	return wrapExternalContent(content, {
		source: "unknown",
		includeWarning: false
	});
}
//#endregion
//#region src/gateway/openresponses-prompt.ts
const FILE_ONLY_USER_MESSAGE = "User sent file(s) with no text.";
function extractTextContent(content) {
	if (typeof content === "string") return content;
	return content.map((part) => {
		if (part.type === "input_text") return part.text;
		if (part.type === "output_text") return part.text;
		return "";
	}).filter(Boolean).join("\n");
}
function hasImageContent(content) {
	return typeof content !== "string" && content.some((part) => part.type === "input_image");
}
function hasFileContent(content) {
	return typeof content !== "string" && content.some((part) => part.type === "input_file");
}
function placeholderForActiveTurn(content) {
	if (hasImageContent(content)) return IMAGE_ONLY_USER_MESSAGE;
	if (hasFileContent(content)) return FILE_ONLY_USER_MESSAGE;
	return "";
}
/** A tool result starts its own turn and cannot inherit an earlier user's media. */
function resolveActiveUserMessage(input) {
	for (let i = input.length - 1; i >= 0; i -= 1) {
		const item = input[i];
		if (item?.type === "function_call_output") return;
		if (item?.type === "message" && item.role === "user") return item;
	}
}
/** Build the user message and optional system prompt from Responses API input. */
function buildAgentPrompt(input) {
	if (typeof input === "string") return { message: input };
	const systemParts = [];
	const conversationEntries = [];
	const activeUserMessage = resolveActiveUserMessage(input);
	for (const item of input) if (item.type === "message") {
		const body = extractTextContent(item.content).trim() || (item === activeUserMessage ? placeholderForActiveTurn(item.content) : "");
		if (!body) continue;
		if (item.role === "system" || item.role === "developer") {
			systemParts.push(body);
			continue;
		}
		const normalizedRole = item.role === "assistant" ? "assistant" : "user";
		const sender = normalizedRole === "assistant" ? "Assistant" : "User";
		conversationEntries.push({
			role: normalizedRole,
			entry: {
				sender,
				body
			}
		});
	} else if (item.type === "function_call") conversationEntries.push({
		role: "assistant",
		entry: {
			sender: "Assistant",
			body: renderConversationToolCall({
				...item,
				id: item.call_id ?? item.id
			})
		}
	});
	else if (item.type === "function_call_output") conversationEntries.push({
		role: "tool",
		entry: {
			sender: `Tool:${item.call_id}`,
			body: item.output
		}
	});
	return {
		message: buildAgentMessageFromConversationEntries(conversationEntries),
		extraSystemPrompt: systemParts.length > 0 ? systemParts.join("\n\n") : void 0,
		activeUserMessage
	};
}
//#endregion
//#region src/gateway/openresponses-shape.ts
/** Creates an assistant output message item for OpenResponses-compatible responses. */
function createAssistantOutputItem(params) {
	return {
		type: "message",
		id: params.id,
		role: "assistant",
		content: [{
			type: "output_text",
			text: params.text
		}],
		...params.phase ? { phase: params.phase } : {},
		status: params.status
	};
}
/** Creates a function-call output item for OpenResponses-compatible responses. */
function createFunctionCallOutputItem(params) {
	return {
		type: "function_call",
		id: params.id,
		call_id: params.callId,
		name: params.name,
		arguments: params.arguments,
		status: params.status
	};
}
//#endregion
//#region src/gateway/openresponses-http.ts
/**
* OpenResponses HTTP Handler
*
* Implements the OpenResponses `/v1/responses` endpoint for OpenClaw Gateway.
*
* @see https://www.open-responses.com/
*/
const DEFAULT_BODY_BYTES = 20971520;
const DEFAULT_MAX_URL_PARTS = 8;
const RESPONSE_SESSION_TTL_MS = 18e5;
const MAX_RESPONSE_SESSION_ENTRIES = 500;
const responseSessionMap = /* @__PURE__ */ new Map();
function normalizeResponseSessionScope(scope) {
	const authSubject = scope.authSubject.trim();
	const requestedSessionKey = scope.requestedSessionKey?.trim();
	return {
		authSubject,
		agentId: scope.agentId,
		requestedSessionKey: requestedSessionKey || void 0
	};
}
function resolveResponseSessionAuthSubject(params) {
	if (params.requestAuth.authMethod === "trusted-proxy") return `trusted-proxy:${params.requestAuth.user}`;
	const bearer = getBearerToken(params.req);
	if (bearer) return `bearer:${createHash("sha256").update(bearer).digest("hex")}`;
	return `gateway-auth:${params.auth.mode}`;
}
function createResponseSessionScope(params) {
	return normalizeResponseSessionScope({
		authSubject: resolveResponseSessionAuthSubject(params),
		agentId: params.agentId,
		requestedSessionKey: getHeader(params.req, "x-openclaw-session-key")
	});
}
function matchesResponseSessionScope(entry, scope) {
	return entry.authSubject === scope.authSubject && entry.agentId === scope.agentId && entry.requestedSessionKey === scope.requestedSessionKey;
}
function pruneExpiredResponseSessions(now) {
	while (responseSessionMap.size > 0) {
		const oldest = responseSessionMap.entries().next().value;
		if (!oldest) return;
		const [oldestKey, oldestValue] = oldest;
		if (now - oldestValue.ts <= RESPONSE_SESSION_TTL_MS) return;
		responseSessionMap.delete(oldestKey);
	}
}
function storeResponseSession(responseId, sessionKey, scope, now = Date.now()) {
	responseSessionMap.delete(responseId);
	responseSessionMap.set(responseId, {
		...scope,
		sessionKey,
		ts: now
	});
	pruneExpiredResponseSessions(now);
	pruneMapToMaxSize(responseSessionMap, MAX_RESPONSE_SESSION_ENTRIES);
}
function lookupResponseSession(responseId, scope, now = Date.now()) {
	if (!responseId) return;
	const entry = responseSessionMap.get(responseId);
	if (!entry) return;
	if (now - entry.ts > RESPONSE_SESSION_TTL_MS) {
		responseSessionMap.delete(responseId);
		return;
	}
	if (!matchesResponseSessionScope(entry, scope)) return;
	return entry.sessionKey;
}
const testing = {
	resetResponseSessionState() {
		responseSessionMap.clear();
	},
	wrapUntrustedFileContent,
	storeResponseSessionAt(responseId, sessionKey, now, scope = {
		authSubject: "test",
		agentId: "main"
	}) {
		storeResponseSession(responseId, sessionKey, normalizeResponseSessionScope(scope), now);
	},
	lookupResponseSessionAt(responseId, now, scope = {
		authSubject: "test",
		agentId: "main"
	}) {
		return lookupResponseSession(responseId, normalizeResponseSessionScope(scope), now);
	},
	getResponseSessionIds() {
		return [...responseSessionMap.keys()];
	},
	resolveResponsesLimits
};
function writeSseEvent(res, event) {
	res.write(`event: ${event.type}\ndata: ${JSON.stringify(event)}\n\n`);
}
function resolveResponsesLimits(config) {
	const files = config?.files;
	const images = config?.images;
	const fileLimits = resolveInputFileLimits(files);
	return {
		maxBodyBytes: DEFAULT_BODY_BYTES,
		maxUrlParts: resolveIntegerOption(config?.maxUrlParts, DEFAULT_MAX_URL_PARTS, { min: 0 }),
		files: {
			...fileLimits,
			urlAllowlist: normalizeInputHostnameAllowlist(files?.urlAllowlist)
		},
		images: {
			allowUrl: images?.allowUrl ?? true,
			urlAllowlist: normalizeInputHostnameAllowlist(images?.urlAllowlist),
			allowedMimes: normalizeMimeList(images?.allowedMimes, DEFAULT_INPUT_IMAGE_MIMES),
			maxBytes: images?.maxBytes ?? 10485760,
			maxRedirects: images?.maxRedirects ?? 3,
			timeoutMs: images?.timeoutMs ?? 1e4
		}
	};
}
function extractClientTools(body) {
	return (body.tools ?? []).map((tool) => ({
		type: "function",
		function: {
			name: tool.name,
			description: tool.description,
			parameters: tool.parameters,
			strict: tool.strict
		}
	}));
}
function createEmptyUsage() {
	return toOpenAiResponsesUsage(void 0);
}
function extractUsageFromResult(result) {
	return toOpenAiResponsesUsage(resolveAgentRunUsage(result));
}
function createResponseResource(params) {
	return {
		id: params.id,
		object: "response",
		created_at: params.createdAt,
		status: params.status,
		model: params.model,
		output: params.output,
		usage: params.usage ?? createEmptyUsage(),
		error: params.error,
		...params.status === "incomplete" ? { incomplete_details: { reason: "max_output_tokens" } } : {}
	};
}
async function handleOpenResponsesHttpRequest(req, res, opts) {
	const limits = resolveResponsesLimits(opts.config);
	const maxBodyBytes = opts.maxBodyBytes ?? Math.max(limits.maxBodyBytes, limits.files.maxBytes * 2, limits.images.maxBytes * 2);
	const handled = await handleGatewayPostJsonEndpoint(req, res, {
		...opts,
		pathname: "/v1/responses",
		requiredOperatorMethod: "chat.send",
		resolveOperatorScopes: resolveSharedSecretHttpOperatorScopes,
		maxBodyBytes
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
	const payload = parseGatewayJsonRequest(res, handled.body, CreateResponseBodySchema);
	if (!payload) return true;
	const stream = Boolean(payload.stream);
	const model = payload.model;
	const user = payload.user;
	let agentId;
	try {
		agentId = resolveAgentIdForRequest({
			req,
			model
		});
	} catch (err) {
		if (isAgentSelectionRequiredError(err) || isInvalidGatewayModelError(err) || isUnknownGatewayAgentError(err)) {
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
	const { modelOverride, errorMessage: modelError } = await resolveOpenAiCompatModelOverride({
		req,
		agentId,
		model
	});
	if (modelError) {
		sendInvalidRequest(res, modelError);
		return true;
	}
	const prompt = buildAgentPrompt(payload.input);
	let images = [];
	const fileContexts = [];
	let urlParts = 0;
	const markUrlPart = () => {
		urlParts += 1;
		if (urlParts > limits.maxUrlParts) throw new Error(`Too many URL-based input sources: ${urlParts} (limit: ${limits.maxUrlParts})`);
	};
	try {
		abortController.signal.throwIfAborted();
		if (Array.isArray(payload.input)) {
			for (const item of payload.input) if (item.type === "message" && typeof item.content !== "string") for (const part of item.content) {
				if (part.type !== "input_image" && part.type !== "input_file") continue;
				assertGatewayHttpRequestCurrent(handled.requestAuth);
				if (part.source.type === "url") markUrlPart();
				if (item !== prompt.activeUserMessage) continue;
				if (part.type === "input_image") {
					const source = part.source;
					const imageSource = source.type === "url" ? {
						type: "url",
						url: source.url
					} : {
						type: "base64",
						data: source.data,
						mediaType: source.media_type
					};
					const image = await extractImageContentFromSource(imageSource, limits.images, abortController.signal);
					images.push(image);
					continue;
				}
				const source = part.source;
				const file = await extractFileContentFromSource({
					source: source.type === "url" ? {
						type: "url",
						url: source.url
					} : {
						type: "base64",
						data: source.data,
						mediaType: source.media_type,
						filename: source.filename
					},
					limits: limits.files,
					signal: abortController.signal
				});
				const rawText = file.text;
				if (rawText?.trim()) fileContexts.push(renderFileContextBlock({
					filename: file.filename,
					content: wrapUntrustedFileContent(rawText)
				}));
				else if (file.images && file.images.length > 0) fileContexts.push(renderFileContextBlock({
					filename: file.filename,
					content: "[PDF content rendered to images]",
					surroundContentWithNewlines: false
				}));
				else fileContexts.push(renderFileContextBlock({
					filename: file.filename,
					content: "[No extractable text]",
					surroundContentWithNewlines: false
				}));
				if (file.images && file.images.length > 0) images = images.concat(file.images);
			}
		}
	} catch (err) {
		if (abortController.signal.aborted) return true;
		if (handled.requestAuth.hasCurrentClientAuthority?.() === false) {
			sendUnauthorized(res);
			return true;
		}
		logWarn(`openresponses: request parsing failed: ${String(err)}`);
		sendInvalidRequest(res, "invalid request");
		return true;
	}
	const clientTools = extractClientTools(payload);
	let toolChoicePrompt;
	let toolChoiceConstraint;
	let resolvedClientTools = clientTools;
	try {
		const toolChoiceResult = applyToolChoice(clientTools, resolveResponsesToolChoice(payload.tool_choice));
		resolvedClientTools = toolChoiceResult.tools;
		toolChoicePrompt = toolChoiceResult.extraSystemPrompt;
		toolChoiceConstraint = toolChoiceResult.constraint;
	} catch (err) {
		logWarn(`openresponses: tool configuration failed: ${String(err)}`);
		sendInvalidRequest(res, "invalid tool configuration");
		return true;
	}
	let resolved;
	try {
		resolved = resolveGatewayRequestContext({
			req,
			model,
			user,
			sessionPrefix: "openresponses",
			defaultMessageChannel: "webchat",
			useMessageChannelHeader: true
		});
	} catch (err) {
		if (isAgentSelectionRequiredError(err) || isUnknownGatewayAgentError(err) || isInvalidGatewayModelError(err) || isGatewaySessionKeyOverrideError(err)) {
			sendInvalidRequest(res, err.message);
			return true;
		}
		throw err;
	}
	const responseSessionScope = createResponseSessionScope({
		req,
		auth: opts.auth,
		requestAuth: handled.requestAuth,
		agentId: resolved.agentId
	});
	const sessionKey = lookupResponseSession(payload.previous_response_id, responseSessionScope) ?? resolved.sessionKey;
	const messageChannel = resolved.messageChannel;
	const sessionAuth = authorizeOpenAiCompatibleHttpSession({
		agentId: resolved.agentId,
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
	const fileContext = fileContexts.length > 0 ? fileContexts.join("\n\n") : void 0;
	const toolChoiceContext = toolChoicePrompt?.trim();
	const extraSystemPrompt = [
		payload.instructions,
		prompt.extraSystemPrompt,
		toolChoiceContext,
		fileContext
	].filter(Boolean).join("\n\n");
	if (!prompt.message) {
		sendInvalidRequest(res, "Missing user message in `input`.");
		return true;
	}
	const responseId = `resp_${randomUUID()}`;
	const responseIdentity = {
		id: responseId,
		createdAt: Math.floor(Date.now() / 1e3)
	};
	const createFailedResponse = (error, usage) => createResponseResource({
		...responseIdentity,
		model,
		status: "failed",
		output: [],
		error,
		usage
	});
	const rememberResponseSession = () => storeResponseSession(responseId, sessionKey, responseSessionScope);
	const outputItemId = `msg_${randomUUID()}`;
	const streamMaxTokens = typeof payload.max_output_tokens === "number" ? payload.max_output_tokens : void 0;
	const streamTemperature = typeof payload.temperature === "number" ? payload.temperature : void 0;
	const streamTopP = typeof payload.top_p === "number" ? payload.top_p : void 0;
	const streamParams = streamMaxTokens !== void 0 || streamTemperature !== void 0 || streamTopP !== void 0 ? {
		...streamMaxTokens !== void 0 ? { maxTokens: streamMaxTokens } : {},
		...streamTemperature !== void 0 ? { temperature: streamTemperature } : {},
		...streamTopP !== void 0 ? { topP: streamTopP } : {}
	} : void 0;
	const runAgentCommand = () => runOpenAiCompatibleAgentCommand({
		message: prompt.message,
		images,
		clientTools: resolvedClientTools,
		extraSystemPrompt,
		modelOverride,
		streamParams,
		sessionKey,
		runId: responseId,
		messageChannel,
		senderIsOwner,
		requestAuth: handled.requestAuth,
		operatorScopes: handled.operatorScopes,
		resolveGatewayContext: opts.resolveGatewayContext,
		abortSignal: abortController.signal,
		hasCurrentClientAuthority: handled.requestAuth.hasCurrentClientAuthority
	});
	if (!stream) {
		try {
			const result = await runAgentCommand();
			if (abortController.signal.aborted) return true;
			const { runFailed, stopReason, pendingToolCalls } = readOpenAiHttpRunTerminal(result);
			if (runFailed) throw new Error("agent run failed");
			const assistantText = resolveAssistantResultText(result);
			const usage = extractUsageFromResult(result);
			if (toolChoiceConstraint && !isToolChoiceConstraintSatisfied({
				constraint: toolChoiceConstraint,
				pendingToolCalls
			})) {
				const failed = createFailedResponse({
					code: "api_error",
					message: resolveUnsatisfiedToolChoiceMessage(toolChoiceConstraint)
				}, usage);
				rememberResponseSession();
				sendJson(res, 502, failed);
				return true;
			}
			if (stopReason === "tool_calls" && pendingToolCalls && pendingToolCalls.length > 0) {
				const output = [];
				if (assistantText) output.push(createAssistantOutputItem({
					id: outputItemId,
					text: assistantText,
					phase: "commentary",
					status: "completed"
				}));
				for (const functionCall of pendingToolCalls) output.push(createFunctionCallOutputItem({
					id: `call_${randomUUID()}`,
					callId: functionCall.id,
					name: functionCall.name,
					arguments: functionCall.arguments
				}));
				const response = createResponseResource({
					...responseIdentity,
					model,
					status: "completed",
					output,
					usage
				});
				rememberResponseSession();
				sendJson(res, 200, response);
				return true;
			}
			const status = stopReason === "length" ? "incomplete" : "completed";
			const response = createResponseResource({
				...responseIdentity,
				model,
				status,
				output: [createAssistantOutputItem({
					id: outputItemId,
					text: assistantText || "No response from OpenClaw.",
					phase: "final_answer",
					status
				})],
				usage
			});
			rememberResponseSession();
			sendJson(res, 200, response);
		} catch (err) {
			if (abortController.signal.aborted) return true;
			logWarn(`openresponses: non-stream response failed: ${String(err)}`);
			if (isClientToolNameConflictError(err)) {
				const response = createFailedResponse({
					code: "invalid_request_error",
					message: "invalid tool configuration"
				});
				sendJson(res, 400, response);
				return true;
			}
			const mapped = resolveOpenAiCompatError(err);
			if (mapped) {
				const mappedResponse = createFailedResponse({
					code: mapped.error.type,
					message: mapped.error.message
				});
				rememberResponseSession();
				sendJson(res, mapped.status, mappedResponse);
				return true;
			}
			rememberResponseSession();
			sendJson(res, 500, createFailedResponse({
				code: "api_error",
				message: "internal error"
			}));
		}
		return true;
	}
	setSseHeaders(res);
	let assistantText = { text: "" };
	let streamedAssistantText = assistantText;
	let pendingAssistantText;
	let finalResultText;
	let finalToolCalls;
	let unrepresentableAssistantReplacement = false;
	let closed = false;
	let unsubscribe = () => {};
	let finalUsage;
	let finalOutputStatus = "completed";
	let finalizeRequested = null;
	let finalizeScheduled = false;
	let terminalLifecyclePhase = "end";
	const maybeFinalize = () => {
		if (closed || finalizeScheduled) return;
		if (!finalizeRequested) return;
		if (!finalUsage) return;
		finalizeScheduled = true;
		setImmediate(() => {
			if (closed || !finalizeRequested || !finalUsage) return;
			if (unrepresentableAssistantReplacement) {
				finalizeUnrepresentableAssistantReplacement();
				return;
			}
			const usage = finalUsage;
			const status = finalizeRequested.status === "failed" ? "failed" : finalOutputStatus;
			const finalText = resolveAssistantTextCompletion({
				assistantText,
				pending: pendingAssistantText,
				resultText: finalResultText,
				streamedText: streamedAssistantText.text,
				fallbackText: finalToolCalls ? "" : "No response from OpenClaw."
			});
			if (!finalText.startsWith(streamedAssistantText.text)) {
				finalizeUnrepresentableAssistantReplacement();
				return;
			}
			const delta = finalText.slice(streamedAssistantText.text.length);
			if (delta) writeSseEvent(res, {
				type: "response.output_text.delta",
				item_id: outputItemId,
				output_index: 0,
				content_index: 0,
				delta
			});
			closed = true;
			unsubscribe();
			writeSseEvent(res, {
				type: "response.output_text.done",
				item_id: outputItemId,
				output_index: 0,
				content_index: 0,
				text: finalText
			});
			writeSseEvent(res, {
				type: "response.content_part.done",
				item_id: outputItemId,
				output_index: 0,
				content_index: 0,
				part: {
					type: "output_text",
					text: finalText
				}
			});
			const completedItem = createAssistantOutputItem({
				id: outputItemId,
				text: finalText,
				phase: finalizeRequested.status === "completed" && !finalToolCalls ? "final_answer" : "commentary",
				status: status === "incomplete" ? "incomplete" : "completed"
			});
			writeSseEvent(res, {
				type: "response.output_item.done",
				output_index: 0,
				item: completedItem
			});
			const output = [completedItem];
			for (const functionCall of finalToolCalls ?? []) {
				const item = createFunctionCallOutputItem({
					id: `call_${randomUUID()}`,
					callId: functionCall.id,
					name: functionCall.name,
					arguments: functionCall.arguments
				});
				const outputIndex = output.length;
				writeSseEvent(res, {
					type: "response.output_item.added",
					output_index: outputIndex,
					item
				});
				const completedCall = {
					...item,
					status: "completed"
				};
				writeSseEvent(res, {
					type: "response.output_item.done",
					output_index: outputIndex,
					item: completedCall
				});
				output.push(completedCall);
			}
			const finalResponse = createResponseResource({
				...responseIdentity,
				model,
				status,
				output,
				usage,
				...finalizeRequested.status === "failed" ? { error: {
					code: "server_error",
					message: finalizeRequested.errorMessage || "Agent run failed"
				} } : {}
			});
			rememberResponseSession();
			writeSseEvent(res, {
				type: `response.${status}`,
				response: finalResponse
			});
			writeDone(res);
			res.end();
		});
	};
	const requestFinalize = (status, errorMessage) => {
		if (finalizeRequested) return;
		finalizeRequested = {
			status,
			errorMessage
		};
		maybeFinalize();
	};
	const finalizeFailedResponse = (response) => {
		if (closed) return;
		closed = true;
		unsubscribe();
		writeSseEvent(res, {
			type: "response.failed",
			response
		});
		writeDone(res);
		res.end();
	};
	const finalizeUnrepresentableAssistantReplacement = () => {
		const usage = finalUsage;
		if (!usage) return;
		rememberResponseSession();
		finalizeFailedResponse(createFailedResponse({
			code: "server_error",
			message: "Assistant output cannot be represented as an append-only response stream."
		}, usage));
	};
	const initialResponse = createResponseResource({
		...responseIdentity,
		model,
		status: "in_progress",
		output: []
	});
	writeSseEvent(res, {
		type: "response.created",
		response: initialResponse
	});
	writeSseEvent(res, {
		type: "response.in_progress",
		response: initialResponse
	});
	writeSseEvent(res, {
		type: "response.output_item.added",
		output_index: 0,
		item: {
			...createAssistantOutputItem({
				id: outputItemId,
				text: "",
				status: "in_progress"
			}),
			content: []
		}
	});
	writeSseEvent(res, {
		type: "response.content_part.added",
		item_id: outputItemId,
		output_index: 0,
		content_index: 0,
		part: {
			type: "output_text",
			text: ""
		}
	});
	unsubscribe = onAgentEventForRun(responseId, (evt) => {
		if (evt.runId !== responseId) return;
		if (closed) return;
		if (evt.stream === "assistant") {
			const input = resolveAssistantTextInput(evt.data);
			if (!input) return;
			if (input.replaceable || pendingAssistantText) {
				pendingAssistantText = mergePendingAssistantText(pendingAssistantText ?? assistantText, input);
				if (!input.replaceable && input.replace && input.text !== void 0 && pendingAssistantText.text.startsWith(streamedAssistantText.text)) unrepresentableAssistantReplacement = false;
				return;
			}
			const previous = assistantText;
			const merged = mergeAssistantText(previous, input, "append-only");
			assistantText = merged;
			if (toolChoiceConstraint) return;
			const content = resolveAssistantTextStreamDelta(previous, merged, streamedAssistantText);
			if (content === void 0) {
				unrepresentableAssistantReplacement = true;
				return;
			}
			if (input.replace && input.text !== void 0) unrepresentableAssistantReplacement = false;
			streamedAssistantText = assistantText;
			if (!content) return;
			writeSseEvent(res, {
				type: "response.output_text.delta",
				item_id: outputItemId,
				output_index: 0,
				content_index: 0,
				delta: content
			});
			return;
		}
		if (evt.stream === "lifecycle") {
			const phase = evt.data?.phase;
			if (phase === "end" || phase === "error") {
				const finalStatus = phase === "error" ? "failed" : "completed";
				const errorMessage = phase === "error" && typeof evt.data?.error === "string" ? evt.data.error.trim() : void 0;
				requestFinalize(finalStatus, errorMessage);
			}
		}
	});
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
	(async () => {
		try {
			const result = await runAgentCommand();
			if (closed) return;
			const { runFailed, stopReason, pendingToolCalls } = readOpenAiHttpRunTerminal(result);
			if (runFailed) {
				terminalLifecyclePhase = "error";
				rememberResponseSession();
				finalizeFailedResponse(createFailedResponse({
					code: "api_error",
					message: "internal error"
				}, extractUsageFromResult(result)));
				return;
			}
			finalUsage = extractUsageFromResult(result);
			const resultPayloadText = resolveAssistantResultText(result);
			if (!closed && toolChoiceConstraint && !isToolChoiceConstraintSatisfied({
				constraint: toolChoiceConstraint,
				pendingToolCalls
			})) {
				const failed = createFailedResponse({
					code: "api_error",
					message: resolveUnsatisfiedToolChoiceMessage(toolChoiceConstraint)
				}, finalUsage ?? createEmptyUsage());
				rememberResponseSession();
				finalizeFailedResponse(failed);
				return;
			}
			finalResultText = resultPayloadText;
			finalOutputStatus = stopReason === "length" ? "incomplete" : "completed";
			finalToolCalls = stopReason === "tool_calls" && pendingToolCalls?.length ? pendingToolCalls : void 0;
			maybeFinalize();
		} catch (err) {
			if (closed || abortController.signal.aborted) return;
			terminalLifecyclePhase = "error";
			logWarn(`openresponses: streaming response failed: ${String(err)}`);
			finalUsage = finalUsage ?? createEmptyUsage();
			if (isClientToolNameConflictError(err)) {
				finalizeFailedResponse(createFailedResponse({
					code: "invalid_request_error",
					message: "invalid tool configuration"
				}, finalUsage));
				return;
			}
			const mapped = resolveOpenAiCompatError(err);
			if (mapped) {
				const mappedResponse = createFailedResponse({
					code: mapped.error.type,
					message: mapped.error.message
				}, finalUsage);
				rememberResponseSession();
				finalizeFailedResponse(mappedResponse);
				return;
			}
			rememberResponseSession();
			finalizeFailedResponse(createFailedResponse({
				code: "api_error",
				message: "internal error"
			}, finalUsage));
		} finally {
			releaseAgentRootWork?.();
			if (finalizeRequested === null && (terminalLifecyclePhase === "error" || !closed)) emitAgentEvent({
				runId: responseId,
				stream: "lifecycle",
				data: { phase: terminalLifecyclePhase }
			});
		}
	})();
	return true;
}
//#endregion
export { buildAgentPrompt, handleOpenResponsesHttpRequest, testing };
