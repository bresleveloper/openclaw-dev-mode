import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { t as safeEqualSecret } from "./secret-equal-DRsL8lKD.mjs";
import { s as runWithSessionMcpRequestSignal } from "./mcp-app-model-context-nV9u20zq.mjs";
import { s as peekSessionMcpRuntime } from "./agent-bundle-mcp-manager-api-BwOPQ1t_.mjs";
import { a as classifyMcpAppStandalonePath, n as MCP_APP_STANDALONE_VIEW_PATH, t as MCP_APP_STANDALONE_PATH } from "./gateway-http-route-contracts-jBtizxKU.mjs";
import { c as resolveMcpAppSandboxPort, i as getMcpAppViewLease, s as buildMcpAppSandboxPath } from "./mcp-ui-resource-CANSsmIF.mjs";
import { a as readJsonBodyOrError, b as respondPlainText, c as sendJson, h as watchClientDisconnect } from "./http-common-oJ4rIoMl.mjs";
import { i as requireMcpAppInteraction, n as executeMcpAppOperation, r as parseMcpAppOperation, s as withMcpAppActiveView } from "./mcp-app-operations-DX7Pd6pB.mjs";
import { createHash, createHmac, randomBytes } from "node:crypto";
//#region src/gateway/mcp-app-standalone-host.ts
function runStandaloneMcpAppHost(config) {
	const browser = globalThis;
	const host = browser.document.getElementById("host");
	const ticket = browser.location.hash.startsWith("#") ? browser.location.hash.slice(1) : "";
	let frame;
	let payload;
	let initializeAccepted = false;
	let initialized = false;
	let requestId = 0;
	let sandboxOrigin;
	let teardownId;
	let phase = "active";
	const pending = /* @__PURE__ */ new Map();
	const asStandaloneRecord = (value) => value && typeof value === "object" && !Array.isArray(value) ? value : void 0;
	const errorMessage = (error, timeoutMessage) => asStandaloneRecord(error)?.name === "TimeoutError" ? timeoutMessage : error instanceof Error ? error.message : String(error);
	const fail = (message) => {
		if (phase === "suspended" || phase === "closed") return;
		removeFrame();
		host?.replaceChildren(Object.assign(browser.document.createElement("p"), {
			className: "error",
			textContent: message
		}));
	};
	const post = (message) => {
		if (sandboxOrigin) frame?.contentWindow?.postMessage(message, sandboxOrigin);
	};
	const notify = (method, params = {}) => post({
		jsonrpc: "2.0",
		method,
		params
	});
	const respond = (id, result) => post({
		jsonrpc: "2.0",
		id,
		result
	});
	const reject = (id, code, message) => post({
		jsonrpc: "2.0",
		id,
		error: {
			code,
			message
		}
	});
	const retireOperations = () => {
		for (const [id, controller] of pending) {
			pending.delete(id);
			controller.abort();
		}
	};
	const removeFrame = () => {
		phase = "closed";
		retireOperations();
		frame?.remove();
		frame = void 0;
		sandboxOrigin = void 0;
		teardownId = void 0;
	};
	const resolveSandboxUrl = (view) => {
		const base = view.sandboxOrigin ? new URL(view.sandboxOrigin) : new URL(browser.location.origin);
		if (!view.sandboxOrigin) base.port = String(view.sandboxPort);
		base.pathname = "/";
		base.search = "";
		base.hash = "";
		const resolved = new URL(view.sandboxUrl, base);
		if (!["http:", "https:"].includes(resolved.protocol) || resolved.origin !== base.origin || resolved.origin === browser.location.origin || resolved.pathname !== "/mcp-app-sandbox") throw new Error("MCP App sandbox URL is invalid");
		return resolved;
	};
	const request = async (method, params, signal) => {
		const response = await fetch(config.viewPath, {
			method: "POST",
			headers: {
				Authorization: `MCP-App ${ticket}`,
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				method,
				params
			}),
			cache: "no-store",
			credentials: "omit",
			signal
		});
		const body = await response.json().catch(() => void 0);
		signal.throwIfAborted();
		if (response.status === 401) {
			fail("MCP App ticket was rejected");
			throw new Error("MCP App ticket was rejected");
		}
		if (!response.ok || body?.ok !== true) throw new Error(body?.error || "MCP App operation was rejected");
		return body.result;
	};
	const operations = /* @__PURE__ */ new Set();
	const installOperations = (view) => {
		if (view.serverTools === true) {
			operations.add("tools/call");
			operations.add("tools/list");
		}
		if (view.serverResources === true) {
			operations.add("resources/list");
			operations.add("resources/templates/list");
			operations.add("resources/read");
		}
	};
	const deliverInitialState = () => {
		if (initialized || !payload) return;
		initialized = true;
		notify("ui/notifications/tool-input", { arguments: asStandaloneRecord(payload.toolInput) ?? {} });
		notify("ui/notifications/tool-result", payload.toolResult);
	};
	const isValidInitialize = (params) => {
		const record = asStandaloneRecord(params);
		const appInfo = asStandaloneRecord(record?.appInfo);
		return typeof record?.protocolVersion === "string" && typeof appInfo?.name === "string" && typeof appInfo?.version === "string" && asStandaloneRecord(record?.appCapabilities) !== void 0;
	};
	browser.addEventListener("message", (event) => {
		const message = asStandaloneRecord(event.data);
		if (event.source !== frame?.contentWindow || event.origin !== sandboxOrigin || message?.jsonrpc !== "2.0" || message.id !== void 0 && typeof message.id !== "string" && !(typeof message.id === "number" && Number.isInteger(message.id))) return;
		if (message.method === "notifications/cancelled") {
			const id = asStandaloneRecord(message.params)?.requestId;
			if (message.id === void 0 && (typeof id === "string" || typeof id === "number")) {
				const controller = pending.get(id);
				pending.delete(id);
				controller?.abort();
			}
			return;
		}
		if (typeof message.method === "string" && message.id !== void 0 && pending.has(message.id)) return;
		if (message.method === "ui/notifications/sandbox-proxy-ready") {
			if (payload) notify("ui/notifications/sandbox-resource-ready", {
				html: payload.html,
				csp: payload.csp
			});
			return;
		}
		if (message.method === "ping" && message.id !== void 0) {
			respond(message.id, {});
			return;
		}
		if (message.method === "ui/initialize" && message.id !== void 0) {
			if (!payload || !isValidInitialize(message.params)) {
				reject(message.id, -32602, "Invalid MCP App initialization");
				return;
			}
			initializeAccepted = true;
			respond(message.id, {
				protocolVersion: config.protocolVersion,
				hostInfo: {
					name: "OpenClaw standalone host",
					version: "1.0.0"
				},
				hostCapabilities: {
					sandbox: { csp: payload.csp ?? {} },
					...payload.serverTools === true ? { serverTools: {} } : {},
					...payload.serverResources === true ? { serverResources: {} } : {}
				},
				hostContext: {
					theme: browser.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light",
					displayMode: "inline",
					availableDisplayModes: ["inline"],
					containerDimensions: {
						width: Math.max(1, browser.innerWidth),
						height: 600
					},
					locale: browser.navigator.language,
					timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
					platform: "web"
				}
			});
			return;
		}
		if (message.method === "ui/notifications/initialized") {
			if (!initializeAccepted) return;
			deliverInitialState();
			return;
		}
		if (message.method === "ui/notifications/size-changed") {
			const height = asStandaloneRecord(message.params)?.height;
			if (frame && typeof height === "number" && Number.isFinite(height)) frame.style.height = `${Math.min(1200, Math.max(160, Math.round(height)))}px`;
			return;
		}
		if (message.method === "ui/notifications/request-teardown") {
			if (phase !== "active") return;
			phase = "tearing-down";
			const id = ++requestId;
			teardownId = id;
			post({
				jsonrpc: "2.0",
				id,
				method: "ui/resource-teardown",
				params: {}
			});
			setTimeout(() => {
				if (teardownId === id) removeFrame();
			}, 1e3);
			return;
		}
		if (teardownId !== void 0 && message.id === teardownId && message.method === void 0) {
			removeFrame();
			return;
		}
		if (phase === "suspended" || phase === "closed" || message.id === void 0 || typeof message.method !== "string") return;
		if (!operations.has(message.method)) {
			reject(message.id, -32601, `Method not available in standalone host: ${message.method}`);
			return;
		}
		if (!initialized) {
			reject(message.id, -32002, "MCP App initialization is incomplete");
			return;
		}
		const id = message.id;
		const controller = new AbortController();
		pending.set(id, controller);
		request(message.method, message.params ?? {}, controller.signal).then((result) => {
			if (pending.get(id) === controller) respond(id, result);
		}).catch((error) => {
			if (pending.get(id) === controller) reject(id, -32e3, errorMessage(error, "MCP App operation timed out; try again"));
		}).finally(() => {
			if (pending.get(id) === controller) pending.delete(id);
		});
	});
	browser.addEventListener("pagehide", (event) => {
		if (phase === "tearing-down") phase = "closed";
		else if (phase === "active") phase = event.persisted ? "suspended" : "closed";
		retireOperations();
		if (frame?.contentWindow) post({
			jsonrpc: "2.0",
			id: ++requestId,
			method: "ui/resource-teardown",
			params: {}
		});
	});
	browser.addEventListener("pageshow", (event) => {
		if (event.persisted && phase === "suspended") {
			removeFrame();
			browser.location.reload();
		}
	});
	if (!ticket) {
		fail("MCP App ticket is missing");
		return;
	}
	fetch(config.viewPath, {
		headers: { Authorization: `MCP-App ${ticket}` },
		cache: "no-store",
		credentials: "omit",
		signal: AbortSignal.timeout(config.initialLoadTimeoutMs)
	}).then(async (response) => {
		if (!response.ok) throw new Error("MCP App ticket was rejected");
		const view = await response.json();
		if (phase !== "active") return;
		payload = view;
		installOperations(payload);
		const sandboxUrl = resolveSandboxUrl(payload);
		sandboxOrigin = sandboxUrl.origin;
		frame = browser.document.createElement("iframe");
		frame.title = "MCP App";
		frame.referrerPolicy = "origin";
		frame.setAttribute("sandbox", "allow-scripts allow-same-origin allow-forms");
		frame.src = sandboxUrl.href;
		host?.replaceChildren(frame);
	}).catch((error) => fail(errorMessage(error, "MCP App view timed out; reload to try again")));
}
//#endregion
//#region src/gateway/mcp-app-standalone.ts
const MCP_APP_STANDALONE_TICKET_SCOPE = "mcp-app-standalone-view";
const MCP_APP_STANDALONE_INITIAL_LOAD_TIMEOUT_MS = 3e4;
const MCP_APP_STANDALONE_TICKET_TTL_MS = 12e4;
const MCP_APP_STANDALONE_TICKET_MIN_REMAINING_MS = 15e3;
const MCP_APP_STANDALONE_TICKET_MAX_ENTRIES = 256;
const MCP_APP_STABLE_PROTOCOL_VERSION = "2026-01-26";
const MCP_APP_OPERATION_MAX_BODY_BYTES = 262144;
const ticketSecret = randomBytes(32);
const ticketBindings = /* @__PURE__ */ new Map();
const mcpAppStandaloneTesting = { clearTickets: () => ticketBindings.clear() };
function pruneTicketBindings(nowMs) {
	for (const [nonce, binding] of ticketBindings) if (binding.expiresAtMs <= nowMs) ticketBindings.delete(nonce);
}
function signTicket(nonce, expiresAtMs, secret) {
	return createHmac("sha256", secret).update(`${MCP_APP_STANDALONE_TICKET_SCOPE}\0${nonce}\0${expiresAtMs}`).digest("base64url");
}
function formatTicket(binding, secret) {
	return `v1.${binding.nonce}.${binding.expiresAtMs}.${signTicket(binding.nonce, binding.expiresAtMs, secret)}`;
}
function createMcpAppStandaloneTicket(params) {
	const nowMs = params.nowMs ?? Date.now();
	if (!Number.isSafeInteger(nowMs) || params.view.expiresAtMs <= nowMs) return;
	const expiresAtMs = Math.min(params.view.expiresAtMs, nowMs + MCP_APP_STANDALONE_TICKET_TTL_MS);
	pruneTicketBindings(nowMs);
	let reusable;
	for (const binding of ticketBindings.values()) if (binding.sessionKey === params.sessionKey && binding.sessionId === params.view.sessionId && binding.viewId === params.view.viewId && binding.toolOperationsAuthorized === params.toolOperationsAuthorized) {
		if (binding.expiresAtMs > params.view.expiresAtMs) {
			ticketBindings.delete(binding.nonce);
			continue;
		}
		if (!reusable || binding.expiresAtMs > reusable.expiresAtMs) reusable = binding;
	}
	if (reusable && (reusable.expiresAtMs >= expiresAtMs || reusable.expiresAtMs - nowMs >= MCP_APP_STANDALONE_TICKET_MIN_REMAINING_MS)) {
		const ticket = formatTicket(reusable, params.secret ?? ticketSecret);
		return {
			ticket,
			url: `${MCP_APP_STANDALONE_PATH}#${ticket}`,
			expiresAtMs: reusable.expiresAtMs
		};
	}
	if (ticketBindings.size >= MCP_APP_STANDALONE_TICKET_MAX_ENTRIES) return;
	const nonce = randomBytes(24).toString("base64url");
	const binding = {
		nonce,
		sessionKey: params.sessionKey,
		sessionId: params.view.sessionId,
		viewId: params.view.viewId,
		toolOperationsAuthorized: params.toolOperationsAuthorized,
		expiresAtMs
	};
	ticketBindings.set(nonce, binding);
	const ticket = formatTicket(binding, params.secret ?? ticketSecret);
	return {
		ticket,
		url: `${MCP_APP_STANDALONE_PATH}#${ticket}`,
		expiresAtMs
	};
}
function verifyMcpAppStandaloneTicket(value, expected = {}) {
	const nowMs = expected.nowMs ?? Date.now();
	if (!Number.isSafeInteger(nowMs)) return;
	const parts = value.split(".");
	if (parts.length !== 4 || parts[0] !== "v1") return;
	const [, nonce, rawExpiresAtMs, signature] = parts;
	if (!nonce || nonce.length !== 32 || !rawExpiresAtMs || !signature) return;
	const expiresAtMs = Number(rawExpiresAtMs);
	if (!Number.isSafeInteger(expiresAtMs) || expiresAtMs <= nowMs) return;
	const expectedSignature = signTicket(nonce, expiresAtMs, expected.secret ?? ticketSecret);
	if (!safeEqualSecret(signature, expectedSignature)) return;
	const binding = ticketBindings.get(nonce);
	if (!binding || binding.expiresAtMs !== expiresAtMs || expected.sessionKey !== void 0 && binding.sessionKey !== expected.sessionKey || expected.sessionId !== void 0 && binding.sessionId !== expected.sessionId || expected.viewId !== void 0 && binding.viewId !== expected.viewId) return;
	return binding;
}
function resolveTicketActiveView(value, nowMs, secret) {
	const binding = verifyMcpAppStandaloneTicket(value, {
		nowMs,
		secret
	});
	if (!binding) return;
	const runtime = peekSessionMcpRuntime({ sessionKey: binding.sessionKey });
	if (!runtime || runtime.mcpAppsEnabled !== true || runtime.sessionId !== binding.sessionId) return;
	const view = getMcpAppViewLease(binding.viewId, runtime);
	if (!view || view.viewId !== binding.viewId || view.sessionId !== binding.sessionId || view.expiresAtMs <= nowMs || binding.expiresAtMs > view.expiresAtMs) return;
	return {
		runtime,
		view,
		toolOperationsAuthorized: binding.toolOperationsAuthorized
	};
}
function ticketFromRequest(req) {
	const authorization = req.headers.authorization;
	if (!authorization?.startsWith("MCP-App ")) return;
	return authorization.slice(8).trim() || void 0;
}
function supportsStandaloneToolOperations(active) {
	return active.toolOperationsAuthorized && active.view.allowedAppToolNames !== void 0 && active.view.readOnly !== true;
}
async function supportsStandaloneResourceOperations(view) {
	try {
		await requireMcpAppInteraction(view);
		return true;
	} catch {
		return false;
	}
}
function sendJsonRepresentation(req, res, statusCode, body) {
	const serialized = JSON.stringify(body);
	res.statusCode = statusCode;
	res.setHeader("Content-Type", "application/json; charset=utf-8");
	res.setHeader("Content-Length", String(Buffer.byteLength(serialized)));
	res.end(req.method === "HEAD" ? void 0 : serialized);
}
function standaloneHostHtml() {
	const serializedConfig = JSON.stringify({
		protocolVersion: MCP_APP_STABLE_PROTOCOL_VERSION,
		viewPath: MCP_APP_STANDALONE_VIEW_PATH,
		initialLoadTimeoutMs: MCP_APP_STANDALONE_INITIAL_LOAD_TIMEOUT_MS
	});
	const escapedSource = `;(() => { const __name = (target) => target; (${runStandaloneMcpAppHost.toString()})(${serializedConfig}); })();`.replaceAll("<\/script", "<\\/script");
	return {
		html: `<!doctype html>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<title>OpenClaw MCP App</title>
<style>html,body{height:100%;margin:0;background:#fff;color:#111;font:14px system-ui,sans-serif}main{height:100%}iframe{display:block;width:100%;height:600px;border:0}.error{padding:16px;color:#b91c1c}</style>
<main id="host" aria-live="polite"></main>
<script>${escapedSource}<\/script>`,
		scriptHash: createHash("sha256").update(escapedSource).digest("base64")
	};
}
function resolveShellSandboxOrigin(params) {
	if (params.sandboxOrigin) return new URL(params.sandboxOrigin).origin;
	const protocol = "encrypted" in params.req.socket && params.req.socket.encrypted ? "https:" : "http:";
	const base = new URL(`${protocol}//${params.req.headers.host ?? "localhost"}`);
	base.port = String(params.sandboxPort);
	return base.origin;
}
async function handleMcpAppStandaloneHttpRequest(req, res, options = {}) {
	let url;
	try {
		url = new URL(req.url ?? "/", "http://localhost");
	} catch {
		return false;
	}
	const route = classifyMcpAppStandalonePath(url.pathname);
	if (route === "namespace" || route === "outside") return false;
	if (req.method !== "GET" && req.method !== "HEAD" && !(url.pathname === MCP_APP_STANDALONE_VIEW_PATH && req.method === "POST")) {
		respondPlainText(res, 404, "Not Found");
		return true;
	}
	const gatewayPort = options.gatewayPort ?? req.socket.localPort;
	if (!gatewayPort) {
		respondPlainText(res, 503, "MCP App host unavailable");
		return true;
	}
	let sandboxPort;
	try {
		sandboxPort = resolveMcpAppSandboxPort(gatewayPort, options.sandboxPort);
	} catch {
		respondPlainText(res, 503, "MCP App host unavailable");
		return true;
	}
	res.setHeader("Cache-Control", "no-store");
	res.setHeader("Referrer-Policy", "no-referrer");
	res.setHeader("X-Content-Type-Options", "nosniff");
	if (route === "shell") {
		const frameOrigin = resolveShellSandboxOrigin({
			req,
			sandboxOrigin: options.sandboxOrigin,
			sandboxPort
		});
		const shell = standaloneHostHtml();
		res.statusCode = 200;
		res.setHeader("Content-Type", "text/html; charset=utf-8");
		res.setHeader("Content-Length", String(Buffer.byteLength(shell.html)));
		res.setHeader("Content-Security-Policy", `default-src 'none'; script-src 'sha256-${shell.scriptHash}'; style-src 'unsafe-inline'; connect-src 'self'; frame-src ${frameOrigin}; base-uri 'none'; form-action 'none'; object-src 'none'`);
		res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
		res.end(req.method === "HEAD" ? void 0 : shell.html);
		return true;
	}
	res.setHeader("Vary", "Authorization");
	const ticket = ticketFromRequest(req);
	const now = options.now ?? (() => options.nowMs ?? Date.now());
	const nowMs = now();
	const secret = options.ticketSecret ?? ticketSecret;
	const active = ticket ? resolveTicketActiveView(ticket, nowMs, secret) : void 0;
	if (!active) {
		res.setHeader("WWW-Authenticate", "MCP-App");
		respondPlainText(res, 401, "Unauthorized");
		return true;
	}
	if (req.method === "POST") {
		const controller = new AbortController();
		const stopWatching = watchClientDisconnect(req, res, controller);
		try {
			await runWithSessionMcpRequestSignal(controller.signal, async () => {
				controller.signal.throwIfAborted();
				const body = await readJsonBodyOrError(req, res, MCP_APP_OPERATION_MAX_BODY_BYTES);
				controller.signal.throwIfAborted();
				if (body === void 0) return;
				const operation = parseMcpAppOperation(body);
				if (!operation) {
					sendJson(res, 400, {
						ok: false,
						error: "Invalid MCP App operation"
					});
					return;
				}
				const current = ticket ? resolveTicketActiveView(ticket, now(), secret) : void 0;
				if (!current) {
					res.setHeader("WWW-Authenticate", "MCP-App");
					sendJson(res, 401, {
						ok: false,
						error: "Unauthorized"
					});
					return;
				}
				if ((operation.method === "tools/call" || operation.method === "tools/list") && !supportsStandaloneToolOperations(current)) {
					sendJson(res, 403, {
						ok: false,
						error: "MCP App tool bridge is unavailable"
					});
					return;
				}
				const result = await executeMcpAppOperation(current, operation);
				controller.signal.throwIfAborted();
				sendJson(res, 200, {
					ok: true,
					result
				});
			});
		} catch (error) {
			if (!controller.signal.aborted && !res.destroyed) sendJson(res, 403, {
				ok: false,
				error: formatErrorMessage(error)
			});
		} finally {
			stopWatching();
		}
		return true;
	}
	try {
		return await withMcpAppActiveView(active, "read", async () => {
			const { runtime, view } = active;
			const serverResources = runtime.readResource !== void 0 && await supportsStandaloneResourceOperations(view);
			sendJsonRepresentation(req, res, 200, {
				sandboxUrl: buildMcpAppSandboxPath(view.csp),
				sandboxPort,
				...options.sandboxOrigin ? { sandboxOrigin: new URL(options.sandboxOrigin).origin } : {},
				html: view.html,
				...view.csp ? { csp: view.csp } : {},
				toolInput: view.toolInput,
				toolResult: view.toolResult,
				serverTools: supportsStandaloneToolOperations(active),
				serverResources
			});
			return true;
		});
	} catch (error) {
		sendJsonRepresentation(req, res, 429, {
			ok: false,
			error: formatErrorMessage(error)
		});
		return true;
	}
}
//#endregion
export { verifyMcpAppStandaloneTicket as i, handleMcpAppStandaloneHttpRequest as n, mcpAppStandaloneTesting as r, createMcpAppStandaloneTicket as t };
