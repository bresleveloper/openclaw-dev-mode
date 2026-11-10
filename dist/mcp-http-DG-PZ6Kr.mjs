import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { t as runInDetachedAsyncContext } from "./detached-async-context-D04NzekX.mjs";
import { o as runWithTrackedCancellation } from "./async-work-scope-BH2yUdBz.mjs";
import { n as isTruthyEnvValue } from "./env-DbG527wb.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { t as formatErrorMessage } from "./errors-DPfGDWk1.mjs";
import { c as withPluginRuntimeGatewayContextResolver, l as withPluginRuntimeGatewayRequestScope, o as getPluginRuntimeGatewayRequestScope } from "./gateway-request-scope-1BXD1G3l.mjs";
import { g as readRuntimeConfig } from "./runtime-snapshot-BBYDJbw9.mjs";
import { n as isAutomationsToolName } from "./automations-tool-name-DaxQ5QU2.mjs";
import "./io-DIF-KW3P.mjs";
import { n as normalizeMessageChannel } from "./message-channel-core-BBQx3_oI.mjs";
import { t as safeEqualSecret } from "./secret-equal-DRsL8lKD.mjs";
import { c as resolveAttachGrant, l as resolveMcpLoopbackClientGrant, p as revokeMcpLoopbackClientGrantsForRuntime, s as registerMcpLoopbackClientGrantRevocationListener, t as GatewayConnectionWork } from "./server-connection-work-CPT9-wld.mjs";
import { r as getHeader } from "./http-header-value-BM79-5V8.mjs";
import { a as isLoopbackAddress } from "./net-CjQwRK-V.mjs";
import "./message-channel-DmAdWHmL.mjs";
import { f as withGatewayToolCallerIdentity, r as createAdmittedGatewayToolCallerIdentity } from "./gateway-caller-context-Be176_GV.mjs";
import { t as acknowledgeInternalToolResult } from "./internal-hooks-CSjTREUl.mjs";
import { a as resolveMainSessionKey } from "./main-session-CHYPkxYr.mjs";
import { R as withPreparedSessionCapabilityRead } from "./session-accessor.sqlite-entry-store-B3Lv6xes.mjs";
import { n as readResolvedSessionEntryInWorker } from "./session-accessor.entry-read-runtime-BoYobsOQ.mjs";
import { a as isAgentHarnessSessionKey, r as AGENT_HARNESS_SESSION_KEY_RESERVED_MESSAGE, s as isAgentHarnessSessionStoreEntryProtected } from "./agent-harness-session-key-zbrcLVpT.mjs";
import "./session-accessor.entry-BLpjjUTc.mjs";
import "./sessions-CnzPI1yx.mjs";
import { t as checkBrowserOrigin } from "./origin-check-DI_7InMd.mjs";
import { f as sendHttpRequestRejection, i as isRequestBodyLimitError, l as createHttpRequestAbortSignal, o as readRequestBodyWithLimit } from "./http-body-DZQjJc2J.mjs";
import { i as logWarn, t as logDebug } from "./logger-DHVmYOKs.mjs";
import { E as withAgentQuestionAnswerAuthority } from "./host-private-capabilities-eTr803c9.mjs";
import { t as resolveToolLoopDetectionConfig } from "./tool-loop-detection-config-uCpxGkcu.mjs";
import { c as markMcpLoopbackRequestFinished, d as markMcpLoopbackToolCallStarted, f as recordMcpLoopbackToolCallResult, h as updateMcpLoopbackToolCallCapture, l as markMcpLoopbackRequestStarted, m as setActiveMcpLoopbackRuntime, n as clearActiveMcpLoopbackRuntimeByOwnerToken, o as getActiveMcpLoopbackRuntime, p as resolveMcpLoopbackYieldContext, s as markMcpLoopbackRequestClassified, u as markMcpLoopbackToolCallFinished } from "./mcp-http.loopback-runtime-DxTYlVrU.mjs";
import { i as jsonRpcError } from "./mcp-http.protocol-DlFNaqVL.mjs";
import crypto from "node:crypto";
import { createServer } from "node:http";
//#region src/agents/agent-bundle-mcp-instructions.ts
const serverInstructionsByTool = /* @__PURE__ */ new WeakMap();
/** Records the upstream server guidance that accompanies a bridged MCP tool. */
function setBundleMcpToolServerInstructions(tool, serverName, instructions) {
	if (instructions) serverInstructionsByTool.set(tool, {
		serverName,
		instructions
	});
}
/**
* Server instructions for the loopback initialize reply. A server contributes
* only while one of its tools is listed, so a fully denied server adds nothing;
* servers are ordered by name so the reply, and Claude's prompt, stay stable.
*/
function resolveBundleMcpServerInstructions(tools, listedToolNames) {
	const byServer = /* @__PURE__ */ new Map();
	for (const tool of tools ?? []) {
		const entry = serverInstructionsByTool.get(tool);
		if (entry && listedToolNames.has(tool.name)) byServer.set(entry.serverName, entry.instructions);
	}
	const parts = [...byServer.keys()].toSorted().map((serverName) => `## ${serverName}\n${byServer.get(serverName)}`);
	return parts.length > 0 ? parts.join("\n\n") : void 0;
}
//#endregion
//#region src/gateway/mcp-http.request.ts
const DEFAULT_MCP_BODY_TIMEOUT_MS = 3e4;
function readPositiveIntEnv(name, fallback) {
	const raw = process.env[name]?.trim();
	if (!raw) return fallback;
	const parsed = Number(raw);
	if (!/^\d+$/u.test(raw) || !Number.isSafeInteger(parsed) || parsed <= 0) throw new Error(`${name} must be a positive integer. Got: ${JSON.stringify(raw)}`);
	return parsed;
}
function logMcpLoopbackTraffic(step, details) {
	if (!isTruthyEnvValue(process.env.OPENCLAW_CLI_BACKEND_LOG_OUTPUT) && !isTruthyEnvValue(process.env.OPENCLAW_LIVE_CLI_BACKEND_DEBUG)) return;
	console.error(`[mcp-loopback] ${step} ${JSON.stringify(details)}`);
}
function resolveScopedSessionKey(cfg, rawSessionKey) {
	const trimmed = normalizeOptionalString(rawSessionKey);
	return !trimmed || trimmed === "main" ? resolveMainSessionKey(cfg) : trimmed;
}
function normalizeMcpInboundEventKind(value) {
	const trimmed = normalizeOptionalString(value);
	return trimmed === "room_event" || trimmed === "user_request" ? trimmed : void 0;
}
function normalizeMcpSourceReplyDeliveryMode(value) {
	const trimmed = normalizeOptionalString(value);
	return trimmed === "automatic" || trimmed === "message_tool_only" ? trimmed : void 0;
}
function normalizeMcpTaskSuggestionDeliveryMode(value) {
	return normalizeOptionalString(value) === "gateway" ? "gateway" : void 0;
}
function normalizeMcpBooleanHeader(value) {
	const trimmed = normalizeOptionalString(value);
	return trimmed ? isTruthyEnvValue(trimmed) : void 0;
}
function rejectsBrowserLoopbackRequest(req) {
	const origin = getHeader(req, "origin");
	if (!origin) return false;
	return !checkBrowserOrigin({
		requestHost: getHeader(req, "host"),
		origin,
		isLocalClient: isLoopbackAddress(req.socket?.remoteAddress)
	}).ok;
}
function resolveMcpSender(params) {
	const authHeader = getHeader(params.req, "authorization") ?? "";
	const ownerTokenMatched = safeEqualSecret(authHeader, `Bearer ${params.ownerToken}`);
	const nonOwnerTokenMatched = safeEqualSecret(authHeader, `Bearer ${params.nonOwnerToken}`);
	if (ownerTokenMatched || nonOwnerTokenMatched) return { senderIsOwner: ownerTokenMatched };
	const grantToken = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";
	const captureKey = normalizeOptionalString(getHeader(params.req, "x-openclaw-cli-capture-key"));
	const clientGrant = grantToken && captureKey ? resolveMcpLoopbackClientGrant({
		token: grantToken,
		runtimeOwnerToken: params.ownerToken,
		captureKey
	}) : void 0;
	if (clientGrant) return {
		senderIsOwner: clientGrant.context.senderIsOwner,
		boundClientGrant: clientGrant,
		boundGrantToken: grantToken
	};
	const grant = grantToken ? resolveAttachGrant(grantToken) : void 0;
	if (grant) return {
		senderIsOwner: false,
		boundSessionKey: grant.sessionKey,
		...grant.agentId ? { boundAgentId: grant.agentId } : {}
	};
}
function validateMcpLoopbackRequest(params) {
	const reply = (status, body) => {
		params.res.writeHead(status, { "Content-Type": "application/json" });
		params.res.end(JSON.stringify(body));
		return null;
	};
	const url = URL.parse(params.req.url ?? "/", `http://${params.req.headers.host ?? "localhost"}`);
	if (!url) {
		logMcpLoopbackTraffic("reject", {
			reason: "bad_request_url",
			method: params.req.method ?? ""
		});
		return reply(400, { error: "bad_request" });
	}
	if (params.req.method === "GET" && url.pathname.startsWith("/.well-known/")) {
		params.res.writeHead(404);
		params.res.end();
		return null;
	}
	if (url.pathname !== "/mcp") {
		logMcpLoopbackTraffic("reject", {
			reason: "not_found",
			method: params.req.method ?? "",
			path: url.pathname
		});
		return reply(404, { error: "not_found" });
	}
	if (params.req.method !== "GET" && params.req.method !== "DELETE" && params.req.method !== "POST") {
		logMcpLoopbackTraffic("reject", {
			reason: "method_not_allowed",
			method: params.req.method ?? "",
			path: url.pathname
		});
		params.res.writeHead(405, { Allow: "GET, POST, DELETE" });
		params.res.end();
		return null;
	}
	if (rejectsBrowserLoopbackRequest(params.req)) {
		if (params.req.method === "POST") logMcpLoopbackTraffic("reject", {
			reason: "forbidden_origin",
			method: params.req.method,
			origin: getHeader(params.req, "origin") ?? ""
		});
		return reply(403, { error: "forbidden" });
	}
	const sender = resolveMcpSender(params);
	if (!sender) {
		if (params.req.method === "POST") logMcpLoopbackTraffic("reject", {
			reason: "unauthorized",
			method: params.req.method,
			hasAuthorization: (getHeader(params.req, "authorization") ?? "").length > 0
		});
		return reply(401, { error: "unauthorized" });
	}
	if (params.req.method === "GET") {
		logMcpLoopbackTraffic("sse-open", {
			method: "GET",
			path: url.pathname
		});
		params.res.writeHead(200, {
			"Content-Type": "text/event-stream",
			"Cache-Control": "no-cache"
		});
		params.res.flushHeaders();
		params.res.write(":\n\n");
		params.onSseResponse?.(params.res);
		params.req.on("close", () => {
			if (!params.res.writableEnded) params.res.end();
		});
		return null;
	}
	if (params.req.method === "DELETE") {
		logMcpLoopbackTraffic("session-delete", {
			method: "DELETE",
			path: url.pathname
		});
		return reply(200, { ok: true });
	}
	const contentType = getHeader(params.req, "content-type") ?? "";
	if (contentType.slice(0, 16).toLowerCase() !== "application/json") {
		logMcpLoopbackTraffic("reject", {
			reason: "unsupported_media_type",
			method: params.req.method ?? "",
			contentType
		});
		return reply(415, { error: "unsupported_media_type" });
	}
	return sender;
}
function resolveMcpHttpBodyTimeoutMs() {
	return readPositiveIntEnv("OPENCLAW_MCP_LOOPBACK_BODY_TIMEOUT_MS", DEFAULT_MCP_BODY_TIMEOUT_MS);
}
function resolveMcpCliCaptureKey(req, auth) {
	if (auth.boundClientGrant || auth.boundSessionKey) return auth.boundClientGrant?.captureKey;
	return normalizeOptionalString(getHeader(req, "x-openclaw-cli-capture-key"));
}
function normalizeMcpClientCapsHeader(value) {
	const clientCaps = [...new Set((value ?? "").split(",").map((cap) => cap.trim()))].filter(Boolean);
	return clientCaps.length > 0 ? clientCaps : void 0;
}
function resolveMcpRequestContext(req, cfg, auth) {
	if (auth.boundClientGrant) return structuredClone(auth.boundClientGrant.context);
	if (auth.boundSessionKey) return {
		sessionKey: auth.boundSessionKey,
		agentId: auth.boundAgentId,
		sessionId: void 0,
		messageProvider: void 0,
		clientCaps: void 0,
		currentChannelId: void 0,
		currentThreadTs: void 0,
		currentMessageId: void 0,
		currentInboundAudio: void 0,
		accountId: void 0,
		inboundEventKind: void 0,
		sourceReplyDeliveryMode: void 0,
		taskSuggestionDeliveryMode: void 0,
		requireExplicitMessageTarget: void 0,
		senderIsOwner: auth.senderIsOwner
	};
	return {
		sessionKey: resolveScopedSessionKey(cfg, getHeader(req, "x-session-key")),
		sessionId: normalizeOptionalString(getHeader(req, "x-openclaw-session-id")),
		messageProvider: normalizeMessageChannel(getHeader(req, "x-openclaw-message-channel")) ?? void 0,
		clientCaps: normalizeMcpClientCapsHeader(getHeader(req, "x-openclaw-client-caps")),
		currentChannelId: normalizeOptionalString(getHeader(req, "x-openclaw-current-channel-id")),
		currentThreadTs: normalizeOptionalString(getHeader(req, "x-openclaw-current-thread-ts")),
		currentMessageId: normalizeOptionalString(getHeader(req, "x-openclaw-current-message-id")),
		currentInboundAudio: normalizeMcpBooleanHeader(getHeader(req, "x-openclaw-current-inbound-audio")),
		accountId: normalizeOptionalString(getHeader(req, "x-openclaw-account-id")),
		inboundEventKind: normalizeMcpInboundEventKind(getHeader(req, "x-openclaw-inbound-event-kind")),
		sourceReplyDeliveryMode: normalizeMcpSourceReplyDeliveryMode(getHeader(req, "x-openclaw-source-reply-delivery-mode")),
		taskSuggestionDeliveryMode: normalizeMcpTaskSuggestionDeliveryMode(getHeader(req, "x-openclaw-task-suggestion-delivery-mode")),
		requireExplicitMessageTarget: normalizeMcpBooleanHeader(getHeader(req, "x-openclaw-require-explicit-message-target")),
		senderIsOwner: auth.senderIsOwner
	};
}
//#endregion
//#region src/gateway/mcp-http.ts
const MAX_MCP_BODY_BYTES = 1048576;
const MCP_HTTP_KEEPALIVE_MS = 15e3;
function keepMcpResponseAlive(res, contentType, frame) {
	const timer = setInterval(() => {
		if (res.destroyed || res.writableEnded || res.writableNeedDrain) return;
		if (!res.headersSent) res.writeHead(200, { "Content-Type": contentType });
		res.write(frame);
	}, MCP_HTTP_KEEPALIVE_MS);
	timer.unref();
	const stop = () => {
		clearInterval(timer);
		res.off("close", stop);
		res.off("finish", stop);
	};
	res.once("close", stop);
	res.once("finish", stop);
	return stop;
}
let closeActiveMcpLoopbackServer;
let activeMcpLoopbackServerPromise = null;
function parseMcpJsonBody(body) {
	try {
		return JSON.parse(body);
	} catch (error) {
		throw Object.assign(/* @__PURE__ */ new Error("MCP JSON parse error"), {
			cause: error,
			code: "mcp_json_parse_error"
		});
	}
}
function readJsonRpcRequestId(message) {
	if (!isRecord(message)) return null;
	const id = message.id;
	return typeof id === "string" || typeof id === "number" || id === null ? id : void 0;
}
function isJsonRpcRequest(message) {
	return isRecord(message) && message.jsonrpc === "2.0" && typeof message.method === "string";
}
function shouldSendJsonRpcResponse(message) {
	return !isJsonRpcRequest(message) || Object.hasOwn(message, "id");
}
function collectJsonRpcResponses(messages, createResponse) {
	return messages.filter(shouldSendJsonRpcResponse).map(createResponse);
}
function jsonRpcInternalError(parsed) {
	const isBatch = Array.isArray(parsed);
	const responses = collectJsonRpcResponses(isBatch ? parsed : [parsed], (message) => jsonRpcError(readJsonRpcRequestId(message), -32603, "Internal error"));
	if (responses.length === 0) return null;
	return isBatch ? responses : responses[0];
}
/** Starts a new MCP loopback HTTP server and registers its bearer tokens. */
async function startMcpLoopbackServer(port, work) {
	const [{ handleMcpJsonRpc }, { McpLoopbackToolCache }, { assertCompletionGrantLineage, createCompletionGrantLineageAdmission }] = await Promise.all([
		import("./mcp-http.handlers-DK6gHod5.mjs"),
		import("./mcp-http.runtime.js"),
		import("./tool-resolution-completion-D6zUuanw.mjs")
	]);
	const ownerToken = crypto.randomBytes(32).toString("hex");
	const nonOwnerToken = crypto.randomBytes(32).toString("hex");
	const toolCache = new McpLoopbackToolCache();
	const activeSseResponses = /* @__PURE__ */ new Set();
	const trackSseResponse = (res) => {
		activeSseResponses.add(res);
		keepMcpResponseAlive(res, "text/event-stream", ":\n\n");
		const cleanup = () => {
			activeSseResponses.delete(res);
			res.off("close", cleanup);
			res.off("finish", cleanup);
		};
		res.once("close", cleanup);
		res.once("finish", cleanup);
	};
	const closeActiveSseResponses = () => {
		for (const res of activeSseResponses) if (!res.destroyed && !res.writableEnded) res.end();
	};
	const httpServer = createServer((req, res) => {
		res.setHeader("Connection", "close");
		const auth = validateMcpLoopbackRequest({
			req,
			res,
			ownerToken,
			nonOwnerToken,
			onSseResponse: trackSseResponse
		});
		if (!auth) return;
		const cliCaptureKey = resolveMcpCliCaptureKey(req, auth);
		const cliRequestCaptureHandle = markMcpLoopbackRequestStarted(cliCaptureKey);
		const requestAbort = createHttpRequestAbortSignal(req, res);
		work.track(async () => {
			let parsed;
			let stopKeepalive;
			let cliCaptureHandles = [];
			try {
				parsed = parseMcpJsonBody(await readRequestBodyWithLimit(req, {
					maxBytes: MAX_MCP_BODY_BYTES,
					timeoutMs: resolveMcpHttpBodyTimeoutMs(),
					destroyOnLimit: false
				}));
				if (Array.isArray(parsed) && parsed.length === 0) {
					markMcpLoopbackRequestClassified(cliRequestCaptureHandle);
					res.writeHead(200, { "Content-Type": "application/json" });
					res.end(JSON.stringify(jsonRpcError(null, -32600, "Invalid Request")));
					return;
				}
				const messages = Array.isArray(parsed) ? parsed : [parsed];
				cliCaptureHandles = messages.map((message) => {
					if (!cliRequestCaptureHandle || !isJsonRpcRequest(message) || message.method !== "tools/call") return;
					const admittedToolName = isRecord(message.params) && typeof message.params.name === "string" ? message.params.name : "";
					const toolArgs = isRecord(message.params) && isRecord(message.params.arguments) ? message.params.arguments : {};
					return markMcpLoopbackToolCallStarted({
						requestCaptureHandle: cliRequestCaptureHandle,
						toolName: admittedToolName,
						args: toolArgs
					});
				});
				markMcpLoopbackRequestClassified(cliRequestCaptureHandle);
				const { boundGrantToken, boundClientGrant } = auth;
				if (boundClientGrant && !boundClientGrant.isCurrent()) {
					res.writeHead(401, { "Content-Type": "application/json" });
					res.end(JSON.stringify({ error: "unauthorized" }));
					return;
				}
				const cfg = readRuntimeConfig();
				const requestContext = resolveMcpRequestContext(req, cfg, auth);
				await withPreparedSessionCapabilityRead(() => {
					assertCompletionGrantLineage({
						cfg,
						context: requestContext
					});
					return handlePreparedRequest();
				}, { retain: true });
				async function handlePreparedRequest() {
					const lineage = createCompletionGrantLineageAdmission({
						cfg,
						context: requestContext
					});
					const isGrantAndLineageCurrent = () => (boundClientGrant?.isCurrent() ?? true) && lineage.isCurrent();
					const authorizeToolCall = () => !work.isClosing && getActiveMcpLoopbackRuntime()?.ownerToken === ownerToken && isGrantAndLineageCurrent();
					const harnessEntry = isAgentHarnessSessionKey(requestContext.sessionKey) ? await readResolvedSessionEntryInWorker({
						cfg,
						sessionKey: requestContext.sessionKey
					}) : void 0;
					if (isAgentHarnessSessionKey(requestContext.sessionKey) && (!harnessEntry || isAgentHarnessSessionStoreEntryProtected(requestContext.sessionKey, harnessEntry))) {
						const errors = collectJsonRpcResponses(messages, (message) => jsonRpcError(readJsonRpcRequestId(message), -32600, AGENT_HARNESS_SESSION_KEY_RESERVED_MESSAGE));
						if (errors.length === 0) {
							res.writeHead(202);
							res.end();
							return;
						}
						const payload = JSON.stringify(Array.isArray(parsed) ? errors : errors[0]);
						res.writeHead(200, { "Content-Type": "application/json" });
						res.end(payload);
						return;
					}
					const yieldContext = resolveMcpLoopbackYieldContext(cliRequestCaptureHandle);
					let scopedTools;
					try {
						scopedTools = await withAgentQuestionAnswerAuthority(boundClientGrant?.questionAnswerAuthority, () => toolCache.resolve({
							context: requestContext,
							admittedRunContext: boundClientGrant?.admittedRunContext,
							sessionEventSourcePolicy: boundClientGrant?.sessionEventSourcePolicy,
							messageActionTurnCapability: boundClientGrant?.messageActionTurnCapability,
							cfg,
							signal: requestAbort.signal,
							authProfileStore: boundClientGrant?.toolAuth?.store,
							authProfileStoreAgentDir: boundClientGrant?.toolAuth?.agentDir || void 0,
							...boundGrantToken ? { grantToken: boundGrantToken } : {},
							isGrantCurrent: authorizeToolCall,
							yieldContextCacheKey: yieldContext?.cacheKey,
							onYield: yieldContext?.onYield,
							...boundClientGrant?.skillLibraryAuthoring ? { skillLibraryAuthoring: boundClientGrant.skillLibraryAuthoring } : {},
							...boundClientGrant?.bundledTools ? { bundledTools: boundClientGrant.bundledTools } : {}
						}));
					} catch (error) {
						requestAbort.signal.throwIfAborted();
						if (boundClientGrant && !boundClientGrant.isCurrent()) {
							res.writeHead(401, { "Content-Type": "application/json" });
							res.end(JSON.stringify({ error: "unauthorized" }));
							return;
						}
						throw error;
					}
					requestAbort.signal.throwIfAborted();
					if (boundClientGrant && !boundClientGrant.isCurrent()) {
						res.writeHead(401, { "Content-Type": "application/json" });
						res.end(JSON.stringify({ error: "unauthorized" }));
						return;
					}
					logMcpLoopbackTraffic("request", {
						batchSize: messages.length,
						methods: messages.map((message) => isJsonRpcRequest(message) ? message.method : void 0),
						sessionKey: requestContext.sessionKey,
						inboundEventKind: requestContext.inboundEventKind,
						senderIsOwner: requestContext.senderIsOwner,
						toolCount: scopedTools.toolSchema.length,
						cronVisible: scopedTools.toolSchema.some((tool) => isAutomationsToolName(tool.name))
					});
					if (messages.some(shouldSendJsonRpcResponse)) stopKeepalive = keepMcpResponseAlive(res, "application/json", "\n");
					const responses = [];
					const serverInstructions = resolveBundleMcpServerInstructions(boundClientGrant?.bundledTools, new Set(scopedTools.toolSchema.map((entry) => entry.name)));
					for (const [messageIndex, message] of messages.entries()) {
						if (!isJsonRpcRequest(message)) {
							responses.push(jsonRpcError(readJsonRpcRequestId(message), -32600, "Invalid Request"));
							continue;
						}
						if (message.method === "tools/call" && requestContext.nativeCronCreatorToolAllowlist === null) {
							if (shouldSendJsonRpcResponse(message)) responses.push(jsonRpcError(readJsonRpcRequestId(message), -32e3, "Native tool authority is not initialized. Retry after native startup, or start a fresh session; no tool action was taken."));
							continue;
						}
						const cliCaptureHandle = cliCaptureHandles[messageIndex];
						let response;
						try {
							const handleRequest = async (signal) => await handleMcpJsonRpc({
								message,
								tools: scopedTools.tools,
								toolSchema: scopedTools.toolSchema,
								...serverInstructions ? { serverInstructions } : {},
								hookContext: {
									agentId: scopedTools.agentId,
									config: cfg,
									...scopedTools.workspaceDir ? { workspaceDir: scopedTools.workspaceDir } : {},
									sessionKey: requestContext.sessionKey,
									sessionId: requestContext.sessionId,
									runId: requestContext.runId,
									approvalReviewerDeviceId: requestContext.approvalReviewerDeviceId,
									channelId: requestContext.currentChannelId,
									turnSourceChannel: requestContext.messageProvider,
									turnSourceTo: requestContext.currentChannelId,
									turnSourceAccountId: requestContext.accountId,
									turnSourceThreadId: requestContext.currentThreadTs,
									loopDetection: resolveToolLoopDetectionConfig({
										cfg,
										agentId: scopedTools.agentId
									})
								},
								signal,
								authorizeToolCall,
								onToolCallPrepared: cliCaptureHandle ? ({ toolName: preparedToolName, args }) => {
									updateMcpLoopbackToolCallCapture(cliCaptureHandle, {
										toolName: preparedToolName,
										args
									});
								} : void 0,
								onToolCallResult: cliCaptureHandle ? (result) => {
									recordMcpLoopbackToolCallResult({
										captureHandle: cliCaptureHandle,
										...result
									});
								} : void 0
							});
							const callerIdentity = boundClientGrant ? createAdmittedGatewayToolCallerIdentity({
								admittedRunContext: boundClientGrant.admittedRunContext,
								receiptAuthority: isGrantAndLineageCurrent,
								receiptAdmission: lineage.admission,
								cronAuthorityCheck: boundClientGrant.cronAuthorityCheck,
								mintCronRequesterGrant: boundClientGrant.mintCronRequesterGrant,
								agentId: scopedTools.agentId,
								sessionKey: requestContext.sessionKey,
								turnSourceChannel: requestContext.messageProvider,
								turnSourceLocal: !requestContext.messageProvider && requestContext.cronCreatorCallerOrigin?.kind === "local" ? true : void 0,
								turnSourceTo: requestContext.currentChannelId,
								turnSourceAccountId: requestContext.accountId,
								turnSourceThreadId: requestContext.currentThreadTs
							}) : void 0;
							if (callerIdentity && boundClientGrant?.personalToolParticipants) callerIdentity.personalToolParticipants = boundClientGrant.personalToolParticipants;
							const runRequestScope = boundClientGrant?.requestScope;
							const handleAsCaller = () => withGatewayToolCallerIdentity(callerIdentity, () => runWithTrackedCancellation(requestAbort.signal, handleRequest));
							response = await (runRequestScope ? withPluginRuntimeGatewayRequestScope(runRequestScope, handleAsCaller) : handleAsCaller());
						} finally {
							markMcpLoopbackToolCallFinished(cliCaptureHandle);
						}
						if (response !== null && shouldSendJsonRpcResponse(message)) {
							const responseToolName = message.method === "tools/call" && isRecord(message.params) ? message.params.name : void 0;
							const isError = isRecord(response) && isRecord(response.result) && response.result.isError === true;
							logMcpLoopbackTraffic("response", {
								method: message.method,
								toolName: typeof responseToolName === "string" ? responseToolName : void 0,
								isError
							});
							responses.push(response);
						}
					}
					if (responses.length === 0) {
						res.writeHead(202);
						res.end();
						return;
					}
					const payload = JSON.stringify(Array.isArray(parsed) ? responses : responses[0]);
					if (!res.headersSent) res.writeHead(200, { "Content-Type": "application/json" });
					res.end(payload, () => {
						if (res.writableFinished) responses.forEach(acknowledgeInternalToolResult);
					});
				}
			} catch (error) {
				const message = isRequestBodyLimitError(error) ? {
					PAYLOAD_TOO_LARGE: `Request body exceeds ${MAX_MCP_BODY_BYTES} bytes`,
					REQUEST_BODY_TIMEOUT: "Request body timed out",
					CONNECTION_CLOSED: "Request body connection closed"
				}[error.code] : formatErrorMessage(error);
				logWarn(`mcp-loopback: request handling failed: ${message}`);
				logMcpLoopbackTraffic("request-failed", { message });
				if (res.headersSent && !res.destroyed && !res.writableEnded) res.end(JSON.stringify(jsonRpcInternalError(parsed)));
				else if (!res.headersSent) {
					if (isRequestBodyLimitError(error, "PAYLOAD_TOO_LARGE") || isRequestBodyLimitError(error, "REQUEST_BODY_TIMEOUT")) {
						const tooLarge = error.code === "PAYLOAD_TOO_LARGE";
						sendHttpRequestRejection(req, res, tooLarge ? 413 : 408, JSON.stringify({ error: tooLarge ? "payload_too_large" : "request_body_timeout" }), "application/json");
					} else if (isRecord(error) && error.code === "mcp_json_parse_error") {
						res.writeHead(400, { "Content-Type": "application/json" });
						res.end(JSON.stringify(jsonRpcError(null, -32700, "Parse error")));
					} else {
						const internalError = jsonRpcInternalError(parsed);
						if (internalError === null) {
							res.writeHead(202);
							res.end();
						} else {
							res.writeHead(500, { "Content-Type": "application/json" });
							res.end(JSON.stringify(internalError));
						}
					}
				}
			} finally {
				stopKeepalive?.();
				requestAbort.cleanup();
				for (const captureHandle of cliCaptureHandles) markMcpLoopbackToolCallFinished(captureHandle);
				markMcpLoopbackRequestFinished(cliRequestCaptureHandle);
			}
		});
	});
	await new Promise((resolve, reject) => {
		httpServer.once("error", reject);
		httpServer.listen(port, "127.0.0.1", () => {
			httpServer.removeListener("error", reject);
			resolve();
		});
	});
	const address = httpServer.address();
	if (!address || typeof address === "string") throw new Error("mcp loopback did not bind to a TCP port");
	const unregisterGrantRevocation = registerMcpLoopbackClientGrantRevocationListener((event) => {
		if (event.runtimeOwnerToken === ownerToken) toolCache.evictGrant(event.token);
	});
	setActiveMcpLoopbackRuntime({
		port: address.port,
		ownerToken,
		nonOwnerToken
	});
	logDebug(`mcp loopback listening on 127.0.0.1:${address.port}`);
	let cleanupDone = false;
	const cleanup = () => {
		if (cleanupDone) return;
		cleanupDone = true;
		clearActiveMcpLoopbackRuntimeByOwnerToken(ownerToken);
		revokeMcpLoopbackClientGrantsForRuntime(ownerToken);
		unregisterGrantRevocation();
		toolCache.clear();
	};
	const close = async () => {
		cleanup();
		try {
			await new Promise((resolve, reject) => {
				httpServer.close((error) => error ? reject(error) : resolve());
				closeActiveSseResponses();
			});
		} finally {
			await work.drain();
		}
	};
	const handleUnexpectedClose = () => {
		cleanup();
		if (closeActiveMcpLoopbackServer === close) {
			closeActiveMcpLoopbackServer = void 0;
			logWarn("mcp-loopback: listener closed unexpectedly; the next run will restart it");
		}
		work.drain().catch((error) => {
			logWarn(`mcp-loopback: unexpected server close drain failed: ${String(error)}`);
		});
	};
	httpServer.once("close", handleUnexpectedClose);
	return close;
}
/** Waits for the process-owned MCP loopback server, starting one if needed. */
async function ensureMcpLoopbackServer(port = 0) {
	if (closeActiveMcpLoopbackServer) return;
	if (!activeMcpLoopbackServerPromise) {
		const work = new GatewayConnectionWork();
		const resolveGatewayContext = getPluginRuntimeGatewayRequestScope()?.resolveGatewayContext;
		activeMcpLoopbackServerPromise = runInDetachedAsyncContext(() => withPluginRuntimeGatewayContextResolver(resolveGatewayContext, () => work.run(() => startMcpLoopbackServer(port, work)), { inheritRequestScope: false })).then((close) => {
			closeActiveMcpLoopbackServer = close;
		}).catch(async (error) => {
			await work.drain();
			throw error;
		}).finally(() => {
			activeMcpLoopbackServerPromise = null;
		});
	}
	return activeMcpLoopbackServerPromise;
}
/** Closes the active MCP loopback server if one has been started. */
async function closeMcpLoopbackServer() {
	if (activeMcpLoopbackServerPromise) await activeMcpLoopbackServerPromise;
	const close = closeActiveMcpLoopbackServer;
	closeActiveMcpLoopbackServer = void 0;
	await close?.();
}
//#endregion
export { ensureMcpLoopbackServer as n, setBundleMcpToolServerInstructions as r, closeMcpLoopbackServer as t };
