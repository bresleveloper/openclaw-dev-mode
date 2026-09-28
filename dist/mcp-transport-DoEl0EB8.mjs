import { p as clampPositiveTimerTimeoutMs } from "./number-coercion-CLj0HTDM.mjs";
import { u as toErrorObject } from "./error-coercion-C787aVxk.mjs";
import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import "./errors-DnjwnOju.mjs";
import { r as normalizeJsonSchemaForTypeBox } from "./json-schema-Cq3X13VY.mjs";
import { n as findJsonSchemaShapeError } from "./json-schema-defaults-D_MUXIFC.mjs";
import { n as truncateUtf8Suffix } from "./utf8-truncate-_hf7tp13.mjs";
import { t as logDebug } from "./logger-BHMMVs5C.mjs";
import { n as resolveMcpTransportConfig } from "./mcp-transport-config-ByV7kR1W.mjs";
import { a as OpenClawStdioClientTransport, o as OpenClawSSEClientTransport, s as OpenClawStreamableHTTPClientTransport } from "./mcp-client-lifecycle-CNB8cS4y.mjs";
import { t as boundedJsonUtf8Bytes } from "./json-utf8-bytes-fm9i4b7G.mjs";
import { n as withSameOriginMcpHttpHeaders, r as withoutMcpAuthorizationHeader, t as buildMcpHttpFetch } from "./mcp-http-fetch-CXlFHx86.mjs";
import { i as withMcpAuthProfileBearer, n as resolveMcpAuthProfileId } from "./mcp-auth-profile-BKId7Bvr.mjs";
import { n as operatorMcpOAuthIdentity, r as requesterMcpOAuthIdentity } from "./mcp-oauth-identity-BzvKk5cf.mjs";
import { d as resolveMcpOAuthAccessToken, u as recordMcpOAuthAuthorizationRequired } from "./mcp-oauth-BoX-GO68.mjs";
import { StringDecoder } from "node:string_decoder";
import { Compile } from "typebox/compile";
import { ErrorCode, McpError } from "@modelcontextprotocol/sdk/types.js";
import { AjvJsonSchemaValidator } from "@modelcontextprotocol/sdk/validation/ajv-provider.js";
import { extractWWWAuthenticateParams } from "@modelcontextprotocol/sdk/client/auth.js";
//#region src/agents/mcp-json-schema-validator.ts
const DRAFT_2020_12_SCHEMA = "https://json-schema.org/draft/2020-12/schema";
function isDraft202012Schema(schema) {
	return schema.$schema === DRAFT_2020_12_SCHEMA;
}
function formatTypeBoxErrors(errors) {
	return errors.map((error) => {
		const message = error.message?.trim() || "schema validation failed";
		return error.instancePath ? `${error.instancePath} ${message}` : message;
	}).join(", ") || "schema validation failed";
}
/** MCP SDK validator with draft-2020-12 support for external tool schemas. */
function createMcpJsonSchemaValidator() {
	const defaultValidator = new AjvJsonSchemaValidator();
	return { getValidator(schema) {
		if (!isDraft202012Schema(schema)) return defaultValidator.getValidator(schema);
		let validator;
		try {
			const schemaError = findJsonSchemaShapeError(schema);
			if (schemaError) throw new Error(schemaError);
			validator = Compile(normalizeJsonSchemaForTypeBox(schema, { format: "annotation" }));
		} catch (error) {
			const setupError = toErrorObject(error, "schema setup failed");
			throw new Error(`Invalid MCP draft-2020-12 JSON Schema: ${setupError.message}`, { cause: error });
		}
		return (input) => {
			if (validator.Check(input)) return {
				valid: true,
				data: input,
				errorMessage: void 0
			};
			return {
				valid: false,
				data: void 0,
				errorMessage: formatTypeBoxErrors([...validator.Errors(input)])
			};
		};
	} };
}
//#endregion
//#region src/agents/mcp-metadata.ts
const MCP_METADATA_TEXT_LIMIT = 1200;
const MCP_APPS_CLIENT_EXTENSION = "io.modelcontextprotocol/ui";
const MCP_APP_RESOURCE_MIME_TYPE = "text/html;profile=mcp-app";
function buildMcpClientCapabilities(mcpAppsEnabled) {
	return mcpAppsEnabled ? { extensions: { [MCP_APPS_CLIENT_EXTENSION]: { mimeTypes: [MCP_APP_RESOURCE_MIME_TYPE] } } } : {};
}
function normalizeToolUiVisibility(value) {
	if (!Array.isArray(value)) return;
	const normalized = value.filter((entry) => entry === "app" || entry === "model");
	return [...new Set(normalized)].toSorted();
}
function summarizeServerCapabilities(capabilities) {
	return {
		resources: capabilities?.resources ? { listChanged: capabilities.resources.listChanged === true } : void 0,
		prompts: capabilities?.prompts ? { listChanged: capabilities.prompts.listChanged === true } : void 0,
		tools: capabilities?.tools ? { listChanged: capabilities.tools.listChanged === true } : void 0
	};
}
/** Scrubs untrusted MCP metadata before exposing it to a model. */
function sanitizeMcpMetadataText(value) {
	const normalized = normalizeOptionalString(value);
	if (!normalized) return;
	const scrubbed = normalized.replace(/ignore\s+(?:all\s+)?(?:previous|prior|above)\s+instructions/gi, "[redacted MCP metadata instruction]").replace(/disregard\s+(?:all\s+)?(?:previous|prior|above)\s+instructions/gi, "[redacted MCP metadata instruction]").replace(/system\s+prompt/gi, "system prompt");
	return scrubbed.length > MCP_METADATA_TEXT_LIMIT ? `${truncateUtf16Safe(scrubbed, MCP_METADATA_TEXT_LIMIT)}...` : scrubbed;
}
//#endregion
//#region src/agents/mcp-pagination.ts
/** Shared bounded pagination for MCP list operations. */
function positiveInteger(value, label) {
	if (!Number.isSafeInteger(value) || value <= 0) throw new Error(`${label} must be a positive safe integer`);
	return value;
}
function abortError(signal, label) {
	return signal.reason instanceof Error ? signal.reason : /* @__PURE__ */ new Error(`${label} aborted`);
}
async function collectMcpPaginatedItems(params) {
	const timeoutMs = clampPositiveTimerTimeoutMs(params.timeoutMs);
	if (timeoutMs === void 0) throw new Error(`${params.label} requires a positive timeout`);
	const maxPages = positiveInteger(params.maxPages, `${params.label} maxPages`);
	const maxItems = positiveInteger(params.maxItems, `${params.label} maxItems`);
	const maxBytes = positiveInteger(params.maxBytes, `${params.label} maxBytes`);
	const deadlineController = new AbortController();
	const signal = params.signal ? AbortSignal.any([params.signal, deadlineController.signal]) : deadlineController.signal;
	if (signal.aborted) throw abortError(signal, params.label);
	const deadlineAtMs = performance.now() + timeoutMs;
	const timeoutError = /* @__PURE__ */ new Error(`${params.label} timed out after ${timeoutMs}ms`);
	const deadlineTimer = setTimeout(() => deadlineController.abort(timeoutError), timeoutMs);
	deadlineTimer.unref?.();
	const assertActive = () => {
		if (signal.aborted) throw abortError(signal, params.label);
		if (performance.now() >= deadlineAtMs) {
			deadlineController.abort(timeoutError);
			throw timeoutError;
		}
	};
	let onAbort;
	const aborted = new Promise((_resolve, reject) => {
		onAbort = () => reject(abortError(signal, params.label));
		signal.addEventListener("abort", onAbort, { once: true });
	});
	const items = [];
	const seenCursors = /* @__PURE__ */ new Set();
	let collectedBytes = 0;
	let cursor;
	try {
		for (let pageNumber = 0; pageNumber < maxPages; pageNumber += 1) {
			assertActive();
			const page = await Promise.race([params.loadPage({
				cursor,
				requestTimeoutMs: timeoutMs,
				signal
			}), aborted]);
			assertActive();
			const measured = boundedJsonUtf8Bytes(page.serializedValue ?? {
				items: page.items,
				nextCursor: page.nextCursor
			}, maxBytes - collectedBytes);
			if (!measured.complete || collectedBytes + measured.bytes > maxBytes) throw new Error(`${params.label} exceeded ${maxBytes} bytes`);
			collectedBytes += measured.bytes;
			for (const item of page.items) {
				const mapped = params.mapItem ? params.mapItem(item) : item;
				if (mapped === void 0) continue;
				if (items.length >= maxItems) throw new Error(`${params.label} exceeded ${maxItems} ${params.itemLabel}`);
				items.push(mapped);
			}
			const nextCursor = page.nextCursor;
			assertActive();
			if (nextCursor === void 0) return items;
			if (seenCursors.has(nextCursor)) throw new Error(`${params.label} returned a repeated pagination cursor`);
			seenCursors.add(nextCursor);
			cursor = nextCursor;
		}
		throw new Error(`${params.label} exceeded ${maxPages} pages`);
	} finally {
		clearTimeout(deadlineTimer);
		if (onAbort) signal.removeEventListener("abort", onAbort);
	}
}
//#endregion
//#region src/agents/mcp-tool-metadata.ts
/** Canonicalizes one server catalog before policy, publication, and call metadata diverge. */
function normalizeMcpToolCatalog(tools, schemaValidator, classify = () => "include") {
	const canonicalNames = tools.map((tool) => tool.name.trim());
	const nameCounts = /* @__PURE__ */ new Map();
	for (const toolName of canonicalNames) if (toolName) nameCounts.set(toolName, (nameCounts.get(toolName) ?? 0) + 1);
	const included = [];
	const deniedTools = [];
	const excludedTools = [];
	const resultValidators = /* @__PURE__ */ new Map();
	for (const [index, sourceTool] of tools.entries()) {
		const toolName = canonicalNames[index] ?? "";
		if (!toolName) continue;
		const tool = {
			...sourceTool,
			name: toolName
		};
		if (nameCounts.get(toolName) !== 1 || sourceTool.execution?.taskSupport === "required") {
			excludedTools.push(tool);
			continue;
		}
		const disposition = classify(toolName);
		if (disposition === "exclude") {
			excludedTools.push({
				...sourceTool,
				name: toolName
			});
			continue;
		}
		if (disposition === "include") {
			included.push(tool);
			if (tool.outputSchema) {
				const validator = schemaValidator.getValidator(tool.outputSchema);
				resultValidators.set(toolName, (result) => {
					if (result.structuredContent === void 0 && result.isError !== true) throw new McpError(ErrorCode.InvalidRequest, `Tool ${toolName} has an output schema but did not return structured content`);
					if (result.structuredContent === void 0) return;
					const validation = validator(result.structuredContent);
					if (!validation.valid) throw new McpError(ErrorCode.InvalidParams, `Structured content does not match the tool's output schema: ${validation.errorMessage}`);
				});
			}
		} else deniedTools.push(tool);
	}
	return {
		tools: included,
		excludedTools,
		metadata: { validatorForCall(toolName) {
			return resultValidators.get(toolName);
		} },
		deniedTools
	};
}
//#endregion
//#region src/agents/mcp-oauth-fetch.ts
function withBearerHeader(init, accessToken) {
	const headers = new Headers(init.headers);
	headers.set("authorization", `Bearer ${accessToken}`);
	return {
		...init,
		headers
	};
}
async function toFetchInit(request) {
	const body = request.body ? await request.arrayBuffer() : void 0;
	return {
		method: request.method,
		headers: request.headers,
		body,
		cache: request.cache,
		credentials: request.credentials,
		integrity: request.integrity,
		keepalive: request.keepalive,
		mode: request.mode,
		redirect: request.redirect,
		referrer: request.referrer,
		referrerPolicy: request.referrerPolicy,
		signal: request.signal
	};
}
/**
* Own native OAuth retries above the MCP SDK transport. The SDK otherwise runs
* refresh outside OpenClaw's cross-process OAuth lease on every 401/403.
*/
function withMcpOAuthBearer(params) {
	const resourceOrigin = new URL(params.identity.serverUrl).origin;
	return async (input, init) => {
		const source = input instanceof Request ? input.clone() : input;
		const request = new Request(source, init);
		const requestUrl = request.url;
		if (new URL(requestUrl).origin !== resourceOrigin) return await params.fetchFn(requestUrl, await toFetchInit(request));
		const accessToken = await resolveMcpOAuthAccessToken({
			identity: params.identity,
			config: params.config,
			fetchFn: params.authFetchFn,
			acceptUnknownExpiry: true,
			allowMissingToken: true,
			signal: request.signal
		});
		const fetchInit = await toFetchInit(request);
		const firstInit = accessToken ? withBearerHeader(fetchInit, accessToken) : fetchInit;
		const response = await params.fetchFn(requestUrl, firstInit);
		const challenge = extractWWWAuthenticateParams(response);
		const insufficientScope = response.status === 403 && challenge.error === "insufficient_scope";
		if (!(response.status === 401 || insufficientScope)) return response;
		await response.body?.cancel().catch(() => void 0);
		const nextAccessToken = await resolveMcpOAuthAccessToken({
			identity: params.identity,
			config: params.config,
			fetchFn: params.authFetchFn,
			acceptUnknownExpiry: true,
			authorizationChallenge: true,
			interactiveAuthorizationRequired: insufficientScope,
			rejectedAccessToken: accessToken,
			resourceMetadataUrl: challenge.resourceMetadataUrl,
			signal: request.signal,
			scope: challenge.scope
		});
		const retryInit = withBearerHeader(fetchInit, nextAccessToken);
		const retryResponse = await params.fetchFn(requestUrl, retryInit);
		const retryChallenge = extractWWWAuthenticateParams(retryResponse);
		const retryInsufficientScope = retryResponse.status === 403 && retryChallenge.error === "insufficient_scope";
		if (retryResponse.status === 401 || retryInsufficientScope) {
			const rejectedAccessToken = nextAccessToken;
			await recordMcpOAuthAuthorizationRequired({
				identity: params.identity,
				rejectedAccessToken,
				resourceMetadataUrl: retryChallenge.resourceMetadataUrl ?? challenge.resourceMetadataUrl,
				scope: retryChallenge.scope ?? challenge.scope,
				signal: request.signal
			});
		}
		return retryResponse;
	};
}
//#endregion
//#region src/agents/mcp-transport.ts
/**
* MCP client transport factory.
*
* This module turns normalized MCP server config into stdio, SSE, or
* streamable-HTTP SDK transports with OpenClaw auth, redirect, and logging rules.
*/
const MAX_MCP_STDERR_LINE_BYTES = 8192;
function attachStderrLogging(serverName, transport) {
	const stderr = transport.stderr;
	if (!stderr) return;
	const decoder = new StringDecoder("utf8");
	let pending = "";
	let truncated = false;
	let progressTimer;
	const emit = (text) => {
		const tail = truncateUtf8Suffix(text, MAX_MCP_STDERR_LINE_BYTES);
		const message = `${truncated || tail !== text ? "[stderr line truncated] " : ""}${tail}`.trim();
		truncated = false;
		if (message) logDebug(`bundle-mcp:${serverName}: ${message}`);
	};
	const flushProgress = () => {
		progressTimer = void 0;
		const text = pending;
		pending = "";
		emit(text);
	};
	const onData = (chunk) => {
		const decoded = decoder.write(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
		const lines = (pending + decoded).split(/[\r\n]/);
		pending = lines.pop() ?? "";
		for (const line of lines) emit(line);
		const tail = truncateUtf8Suffix(pending, MAX_MCP_STDERR_LINE_BYTES);
		truncated ||= tail !== pending;
		pending = tail;
		if (pending && !progressTimer) {
			progressTimer = setTimeout(flushProgress, 250);
			progressTimer.unref();
		} else if (!pending) {
			clearTimeout(progressTimer);
			progressTimer = void 0;
		}
	};
	const finalize = () => {
		stderr.off("data", onData);
		stderr.off("end", finalize);
		stderr.off("close", finalize);
		clearTimeout(progressTimer);
		pending += decoder.end();
		flushProgress();
	};
	stderr.on("data", onData);
	stderr.on("end", finalize);
	stderr.on("close", finalize);
	return finalize;
}
function buildSseEventSourceFetch(headers, baseFetch) {
	return (url, init) => {
		const mergedHeaders = {};
		for (const [key, value] of new Headers(init?.headers)) mergedHeaders[key.toLowerCase()] = value;
		for (const [key, value] of Object.entries(headers)) mergedHeaders[key.toLowerCase()] = value;
		return baseFetch(url, {
			...init,
			headers: mergedHeaders
		});
	};
}
/** Resolves a configured MCP server into a live SDK transport instance. */
function resolveMcpTransport(serverName, rawServer, options) {
	const resolved = resolveMcpTransportConfig(serverName, rawServer);
	if (!resolved) return null;
	if (resolved.kind === "stdio") {
		const transport = new OpenClawStdioClientTransport({
			command: resolved.command,
			args: resolved.args,
			env: resolved.env,
			cwd: resolved.cwd,
			prepareDataDir: options?.prepareDataDir,
			stderr: "pipe"
		});
		return {
			transport,
			description: resolved.description,
			transportType: "stdio",
			connectionTimeoutMs: resolved.connectionTimeoutMs,
			requestTimeoutMs: resolved.requestTimeoutMs,
			supportsParallelToolCalls: resolved.supportsParallelToolCalls,
			detachStderr: attachStderrLogging(serverName, transport)
		};
	}
	const authProfileId = resolveMcpAuthProfileId(rawServer);
	const requesterScope = options?.requesterScope;
	let oauthIdentity;
	if (resolved.oauth?.identity === "per-requester") {
		if (!requesterScope) return null;
		oauthIdentity = requesterMcpOAuthIdentity(serverName, resolved.url, requesterScope);
	} else oauthIdentity = operatorMcpOAuthIdentity(serverName, resolved.url);
	const baseFetch = buildMcpHttpFetch({
		sslVerify: resolved.sslVerify,
		clientCert: resolved.clientCert,
		clientKey: resolved.clientKey,
		resourceUrl: resolved.url
	});
	const headers = resolved.auth === "oauth" || authProfileId ? withoutMcpAuthorizationHeader(resolved.headers) : resolved.headers;
	const resourceFetch = withSameOriginMcpHttpHeaders({
		fetchFn: baseFetch,
		headers,
		resourceUrl: resolved.url
	});
	const httpFetch = authProfileId ? withMcpAuthProfileBearer({
		fetchFn: baseFetch,
		serverName,
		resourceUrl: resolved.url,
		headers,
		authProfileId,
		cfg: options?.cfg,
		agentDir: options?.agentDir
	}) : resolved.auth === "oauth" ? withMcpOAuthBearer({
		fetchFn: resourceFetch,
		authFetchFn: resourceFetch,
		identity: oauthIdentity,
		config: resolved.oauth
	}) : baseFetch;
	if (resolved.transportType === "streamable-http") return {
		transport: new OpenClawStreamableHTTPClientTransport(new URL(resolved.url), {
			requestInit: resolved.auth === "oauth" || !headers ? void 0 : { headers },
			fetch: httpFetch
		}),
		description: resolved.description,
		transportType: "streamable-http",
		connectionTimeoutMs: resolved.connectionTimeoutMs,
		requestTimeoutMs: resolved.requestTimeoutMs,
		supportsParallelToolCalls: resolved.supportsParallelToolCalls
	};
	const sseHeaders = { ...headers };
	const hasHeaders = Object.keys(sseHeaders).length > 0;
	return {
		transport: new OpenClawSSEClientTransport(new URL(resolved.url), {
			requestInit: resolved.auth === "oauth" || !hasHeaders ? void 0 : { headers: sseHeaders },
			fetch: httpFetch,
			eventSourceInit: { fetch: buildSseEventSourceFetch(resolved.auth === "oauth" ? {} : sseHeaders, httpFetch) }
		}),
		description: resolved.description,
		transportType: "sse",
		connectionTimeoutMs: resolved.connectionTimeoutMs,
		requestTimeoutMs: resolved.requestTimeoutMs,
		supportsParallelToolCalls: resolved.supportsParallelToolCalls
	};
}
//#endregion
export { normalizeToolUiVisibility as a, createMcpJsonSchemaValidator as c, buildMcpClientCapabilities as i, normalizeMcpToolCatalog as n, sanitizeMcpMetadataText as o, collectMcpPaginatedItems as r, summarizeServerCapabilities as s, resolveMcpTransport as t };
