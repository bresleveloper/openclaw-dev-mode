import { Et as _enum, Fn as object, Jn as string, Lt as boolean, Nt as array, Pn as number, Un as record, Yt as discriminatedUnion, or as union, sr as unknown, xn as literal } from "./schemas-BOYIvvln.mjs";
import { g as readRuntimeConfig } from "./runtime-snapshot-BBYDJbw9.mjs";
import { i as isIncognitoSessionKey } from "./incognito-session-key-BWpn88lo.mjs";
import { _ as toAgentStoreSessionKey } from "./session-key-CSDERtm3.mjs";
import "./io-DIF-KW3P.mjs";
import { n as getBearerToken, r as getHeader } from "./http-header-value-BM79-5V8.mjs";
import { p as toOpenAiResponsesUsage } from "./usage-BqbJmOEZ.mjs";
import { n as authorizeGatewaySessionCreation } from "./operator-role-policy-Coro3qc5.mjs";
import { i as logWarn } from "./logger-DHVmYOKs.mjs";
import { s as validateKey } from "./plugin-state-store.validation-CbLRb9U1.mjs";
import { t as createCorePluginStateKeyedStore } from "./plugin-state-store-DY4rDlss.mjs";
import { g as setSseHeaders, l as sendInvalidRequest, m as sendUnauthorized, u as sendJson } from "./http-common-DyL3AdjD.mjs";
import { n as assertGatewayHttpRequestCurrent } from "./http-request-authority-Dyt1S0uG.mjs";
import { a as renderFileContextBlock, n as renderFileAttachmentOutcome, r as resolveFileExtractionOutcome } from "./file-attachment-outcomes-CQgRPzch.mjs";
import { a as extractFileContentFromSource, o as extractImageContentFromSource } from "./input-files-BWC1h4-H.mjs";
import { r as isClientToolNameConflictError } from "./agent-tool-definition-adapter-Dgpfhmph.mjs";
import { f as resolveGatewayRequestContext, o as isGatewayAgentRequestError, p as resolveOpenAiCompatModelOverride, r as authorizeOpenAiCompatibleHttpSession, s as isGatewayRequestContextError, u as resolveAgentIdForRequest } from "./http-utils-C7PagBsR.mjs";
import { n as resolveOpenAiStreamParams } from "./openai-compat-errors-D9fEnx7w.mjs";
import { a as startOpenAiCompatibleStream, c as resolveResponsesToolChoice, d as resolveAgentRunUsage, f as rejectDisabledGatewayUpload, h as renderConversationToolCall, i as sendOpenAiCompatibleJsonResponse, l as readOpenAiHttpRunTerminal, m as buildAgentMessageFromConversationEntries, n as resolveResponsesLimits, o as applyToolChoice, p as IMAGE_ONLY_USER_MESSAGE, r as prepareOpenAiCompatibleHttpRequest, u as runOpenAiCompatibleAgentCommand } from "./openai-compatible-input-limits-C6iHjWxp.mjs";
import { randomUUID } from "node:crypto";
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
const FunctionToolDefinitionSchema = object({
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
	tools: array(FunctionToolDefinitionSchema).optional(),
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
//#region src/gateway/openresponses-prompt.ts
const FILE_ONLY_USER_MESSAGE = "User sent file(s) with no text.";
function extractTextContent(content) {
	if (typeof content === "string") return content;
	return content.map((part) => {
		if (part.type === "input_text" || part.type === "output_text") return part.text;
		return "";
	}).filter(Boolean).join("\n");
}
function placeholderForActiveTurn(content) {
	if (typeof content === "string") return "";
	if (content.some((part) => part.type === "input_image")) return IMAGE_ONLY_USER_MESSAGE;
	if (content.some((part) => part.type === "input_file")) return FILE_ONLY_USER_MESSAGE;
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
//#region src/gateway/openresponses-session-store.types.ts
function isIncognitoResponseSession(input) {
	return [input.sessionKey, input.requestedSessionKey].some((requestKey) => isIncognitoSessionKey(toAgentStoreSessionKey({
		agentId: input.agentId,
		requestKey
	})));
}
const RESPONSE_SESSION_RETENTION_MS = 2592e6;
const MAX_RESPONSE_SESSION_ENTRIES = 5e3;
//#endregion
//#region src/gateway/openresponses-session-store.ts
function openStore(env) {
	return createCorePluginStateKeyedStore({
		ownerId: "core:openresponses",
		namespace: "response-sessions",
		defaultTtlMs: RESPONSE_SESSION_RETENTION_MS,
		maxEntries: MAX_RESPONSE_SESSION_ENTRIES,
		overflowPolicy: "evict-oldest",
		env
	});
}
async function lookupResponseSession(input, env) {
	try {
		if (validateKey(input.responseId, "lookup") !== input.responseId) return;
	} catch {
		return;
	}
	const stored = await openStore(env).lookup(input.responseId);
	return stored?.authSubject === input.authSubject && stored.agentId === input.agentId && stored.requestedSessionKey === input.requestedSessionKey ? stored.sessionKey : void 0;
}
async function rememberResponseSession(input, assertCurrent, env) {
	if (isIncognitoResponseSession(input)) return;
	const { responseId, sessionKey, authSubject, agentId, requestedSessionKey } = input;
	await openStore(env).register(responseId, {
		sessionKey,
		authSubject,
		agentId,
		...requestedSessionKey === void 0 ? {} : { requestedSessionKey }
	}, { assertCurrent });
	assertCurrent();
}
//#endregion
//#region src/gateway/openresponses-shape.ts
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
function createResponseResource(params) {
	return {
		id: params.id,
		object: "response",
		created_at: params.createdAt,
		status: params.status,
		model: params.model,
		output: params.output,
		usage: params.usage,
		error: params.error,
		...params.status === "incomplete" ? { incomplete_details: { reason: "max_output_tokens" } } : {}
	};
}
//#endregion
//#region src/gateway/openresponses-http.ts
function resolveResponseSessionAuthSubject(params) {
	if (params.requestAuth.authMethod === "trusted-proxy") return `trusted-proxy:${params.requestAuth.user}`;
	const bearer = getBearerToken(params.req);
	if (bearer) {
		const projector = params.resolveGatewayContext?.()?.configRevisionProjector;
		if (!projector) throw new Error("OpenResponses bearer scope requires a current Gateway context.");
		return `bearer:${projector.hashResponseSessionBearer(bearer)}`;
	}
	return `gateway-auth:${params.auth.mode}`;
}
function writeSseEvent(res, event) {
	res.write(`event: ${event.type}\ndata: ${JSON.stringify(event)}\n\n`);
}
function extractUsageFromResult(result) {
	return toOpenAiResponsesUsage(resolveAgentRunUsage(result));
}
async function handleOpenResponsesHttpRequest(req, res, opts) {
	const limits = resolveResponsesLimits(opts.config);
	const maxBodyBytes = opts.maxBodyBytes ?? Math.max(limits.maxBodyBytes, limits.files.maxBytes * 2, limits.images.maxBytes * 2);
	const handled = await prepareOpenAiCompatibleHttpRequest(req, res, {
		...opts,
		pathname: "/v1/responses",
		maxBodyBytes,
		schema: CreateResponseBodySchema
	});
	if (!handled) return handled !== false;
	const { payload, abortController, senderIsOwner } = handled;
	const hasMedia = Array.isArray(payload.input) && payload.input.some((item) => item.type === "message" && Array.isArray(item.content) && item.content.some((part) => part.type === "input_image" || part.type === "input_file"));
	if (rejectDisabledGatewayUpload(res, hasMedia)) return true;
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
		if (isGatewayAgentRequestError(err)) {
			sendInvalidRequest(res, err.message);
			return true;
		}
		throw err;
	}
	const creationAuth = authorizeGatewaySessionCreation({
		cfg: readRuntimeConfig(),
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
				if (rejectDisabledGatewayUpload(res, hasMedia)) return true;
				if (part.source.type === "url") markUrlPart();
				if (item !== prompt.activeUserMessage) continue;
				const source = part.source;
				const inputSource = source.type === "url" ? source : {
					type: source.type,
					data: source.data,
					mediaType: source.media_type,
					filename: "filename" in source ? source.filename : void 0
				};
				if (part.type === "input_image") {
					const image = await extractImageContentFromSource(inputSource, limits.images, abortController.signal);
					images.push(image);
					continue;
				}
				const file = await extractFileContentFromSource({
					source: inputSource,
					limits: limits.files,
					signal: abortController.signal
				});
				const outcome = resolveFileExtractionOutcome(file);
				const content = renderFileAttachmentOutcome(outcome);
				if (content !== null) fileContexts.push(renderFileContextBlock({
					filename: file.filename,
					content,
					surroundContentWithNewlines: outcome.kind === "extracted"
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
		if (rejectDisabledGatewayUpload(res, hasMedia)) return true;
		logWarn(`openresponses: request parsing failed: ${String(err)}`);
		sendInvalidRequest(res, "invalid request");
		return true;
	}
	if (rejectDisabledGatewayUpload(res, hasMedia)) return true;
	const clientTools = (payload.tools ?? []).map((tool) => ({
		type: "function",
		function: {
			name: tool.name,
			description: tool.description,
			parameters: tool.parameters,
			strict: tool.strict
		}
	}));
	let toolChoice;
	try {
		toolChoice = applyToolChoice(clientTools, resolveResponsesToolChoice(payload.tool_choice));
	} catch (err) {
		logWarn(`openresponses: tool configuration failed: ${String(err)}`);
		sendInvalidRequest(res, "invalid tool configuration");
		return true;
	}
	let resolved;
	try {
		resolved = await resolveGatewayRequestContext({
			req,
			model,
			user,
			sessionPrefix: "openresponses"
		});
	} catch (err) {
		if (isGatewayRequestContextError(err)) {
			sendInvalidRequest(res, err.message);
			return true;
		}
		throw err;
	}
	const responseSessionScope = {
		authSubject: resolveResponseSessionAuthSubject({
			req,
			auth: opts.auth,
			requestAuth: handled.requestAuth,
			resolveGatewayContext: opts.resolveGatewayContext
		}).trim(),
		agentId: resolved.agentId,
		requestedSessionKey: getHeader(req, "x-openclaw-session-key")?.trim() || void 0
	};
	const previousSessionKey = payload.previous_response_id ? await lookupResponseSession({
		...responseSessionScope,
		responseId: payload.previous_response_id
	}) : void 0;
	if (handled.requestAuth.hasCurrentClientAuthority?.() === false) {
		sendUnauthorized(res);
		return true;
	}
	if (payload.previous_response_id !== void 0 && !previousSessionKey) {
		sendInvalidRequest(res, "Cannot resolve previous_response_id. Retry with full input context and omit previous_response_id.");
		return true;
	}
	const sessionKey = previousSessionKey ?? resolved.sessionKey;
	const messageChannel = resolved.messageChannel;
	const sessionAuth = await authorizeOpenAiCompatibleHttpSession({
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
	const toolChoiceContext = toolChoice.extraSystemPrompt?.trim();
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
	const rememberSession = () => rememberResponseSession({
		...responseSessionScope,
		responseId,
		sessionKey
	}, () => assertGatewayHttpRequestCurrent(handled.requestAuth));
	const rememberSessionAfterFailure = async () => {
		try {
			await rememberSession();
		} catch (persistenceError) {
			logWarn(`openresponses: continuity persistence failed after run error: ${String(persistenceError)}`);
		}
	};
	const outputItemId = `msg_${randomUUID()}`;
	const streamParams = resolveOpenAiStreamParams({
		maxTokens: payload.max_output_tokens,
		temperature: payload.temperature,
		topP: payload.top_p
	});
	const runAgentCommand = async () => {
		let result;
		try {
			result = await runOpenAiCompatibleAgentCommand({
				message: prompt.message,
				images,
				clientTools: toolChoice.tools,
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
				hasCurrentClientAuthority: handled.requestAuth.hasCurrentClientAuthority,
				hasClientUploads: hasMedia
			});
		} catch (error) {
			if (!abortController.signal.aborted && !isClientToolNameConflictError(error)) await rememberSessionAfterFailure();
			throw error;
		}
		if (abortController.signal.aborted) return result;
		if (readOpenAiHttpRunTerminal(result).runFailed) await rememberSessionAfterFailure();
		else await rememberSession();
		return result;
	};
	if (!stream) return sendOpenAiCompatibleJsonResponse({
		res,
		signal: abortController.signal,
		constraint: toolChoice.constraint,
		run: runAgentCommand,
		failureLabel: "openresponses: non-stream response failed",
		complete: ({ result, stopReason, toolCalls, text: assistantText, toolChoiceError }) => {
			const usage = extractUsageFromResult(result);
			if (toolChoiceError) {
				const failed = createFailedResponse({
					code: "api_error",
					message: toolChoiceError
				}, usage);
				sendJson(res, 502, failed);
				return;
			}
			const status = stopReason === "length" ? "incomplete" : "completed";
			const output = [];
			if (assistantText || !toolCalls) output.push(createAssistantOutputItem({
				id: outputItemId,
				text: assistantText || "No response from OpenClaw.",
				phase: toolCalls ? "commentary" : "final_answer",
				status
			}));
			for (const functionCall of toolCalls ?? []) output.push(createFunctionCallOutputItem({
				id: `call_${randomUUID()}`,
				callId: functionCall.id,
				name: functionCall.name,
				arguments: functionCall.arguments
			}));
			const response = createResponseResource({
				...responseIdentity,
				model,
				status,
				output,
				usage
			});
			sendJson(res, 200, response);
		},
		fail: (mapped) => sendJson(res, mapped.status, createFailedResponse({
			code: mapped.error.type,
			message: mapped.error.message
		}))
	});
	setSseHeaders(res);
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
	startOpenAiCompatibleStream({
		protocol: "responses",
		res,
		runId: responseId,
		signal: abortController.signal,
		constraint: toolChoice.constraint,
		run: runAgentCommand,
		writeDelta: (delta) => writeSseEvent(res, {
			type: "response.output_text.delta",
			item_id: outputItemId,
			output_index: 0,
			content_index: 0,
			delta
		}),
		complete: ({ result, text: finalText, delta, toolCalls: finalToolCalls, stopReason, lifecycleError }) => {
			const usage = extractUsageFromResult(result);
			const status = lifecycleError ? "failed" : stopReason === "length" ? "incomplete" : "completed";
			if (delta) writeSseEvent(res, {
				type: "response.output_text.delta",
				item_id: outputItemId,
				output_index: 0,
				content_index: 0,
				delta
			});
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
				phase: !lifecycleError && !finalToolCalls ? "final_answer" : "commentary",
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
				...lifecycleError ? { error: {
					code: "server_error",
					message: lifecycleError
				} } : {}
			});
			writeSseEvent(res, {
				type: `response.${status}`,
				response: finalResponse
			});
		},
		fail: (error, result) => writeSseEvent(res, {
			type: "response.failed",
			response: createFailedResponse({
				code: error.type,
				message: error.message
			}, result === void 0 ? void 0 : extractUsageFromResult(result))
		})
	});
	return true;
}
//#endregion
export { handleOpenResponsesHttpRequest };
