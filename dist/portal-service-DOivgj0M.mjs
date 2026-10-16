import { h as sleep } from "./utils-DgZn2dLu.mjs";
import { r as sha256HexPrefixCore } from "./node-crypto-BG4u3UnX.mjs";
import "./crypto-digest-y6oZN-_F.mjs";
import { n as enqueueKeyedTask } from "./keyed-async-queue-CTreGrmR.mjs";
import { n as isValidPortalIngressDomain, r as portalIngressConflictsWithOrigin } from "./zod-schema.gateway-CHIeMx7g.mjs";
import { n as GatewayLockError } from "./gateway-lock-B6mKYs2x.mjs";
import { t as safeEqualSecret } from "./secret-equal-DRsL8lKD.mjs";
import { t as resolveAdvertisedLanHostCore } from "./advertised-lan-host-V7bMngZk.mjs";
import { t as createLoopbackConnectOptions } from "./loopback-connect-VxGMocyw.mjs";
import { n as claimTailscaleServePort } from "./tailscale-CHbn3zco.mjs";
import { t as getTailscalePublishedOrigin } from "./tailscale-published-origin-BvNdSLZR.mjs";
import net, { isIP } from "node:net";
import { X509Certificate, randomBytes } from "node:crypto";
import { createServer as createServer$1, request } from "node:http";
import { createServer as createServer$2 } from "node:https";
//#region src/gateway/server/http-listen.ts
const EADDRINUSE_MAX_RETRIES = 20;
const EADDRINUSE_RETRY_INTERVAL_MS = 500;
async function closeServerQuietly(httpServer) {
	await new Promise((resolve) => {
		try {
			httpServer.close(() => resolve());
		} catch {
			resolve();
		}
	});
}
/** Listen on the configured gateway host/port, retrying transient EADDRINUSE windows. */
async function listenGatewayHttpServer(params) {
	const { httpServer, bindHost, port, retryEaddrinuse = true, serviceName = "gateway", endpointScheme = "ws" } = params;
	const maxRetries = retryEaddrinuse ? EADDRINUSE_MAX_RETRIES : 0;
	for (let attempt = 0; attempt <= maxRetries; attempt++) try {
		await new Promise((resolve, reject) => {
			const onError = (err) => {
				httpServer.off("listening", onListening);
				reject(err);
			};
			const onListening = () => {
				httpServer.off("error", onError);
				resolve();
			};
			httpServer.once("error", onError);
			httpServer.once("listening", onListening);
			try {
				httpServer.listen(port, bindHost);
			} catch (error) {
				httpServer.off("error", onError);
				httpServer.off("listening", onListening);
				throw error;
			}
		});
		return;
	} catch (err) {
		const code = err.code;
		if (code === "EADDRINUSE" && attempt < maxRetries) {
			await closeServerQuietly(httpServer);
			await sleep(EADDRINUSE_RETRY_INTERVAL_MS);
			continue;
		}
		if (code === "EADDRINUSE") throw new GatewayLockError(`another ${serviceName} instance is already listening on ${endpointScheme}://${bindHost}:${port}`, err);
		throw new GatewayLockError(`failed to bind ${serviceName} socket on ${endpointScheme}://${bindHost}:${port}: ${String(err)}`, err);
	}
}
//#endregion
//#region src/gateway/portals/portal-http-proxy.ts
const PORTAL_AUTH_NAME = "openclaw_portal";
function portalAuthCookieName(listenPort) {
	return `${PORTAL_AUTH_NAME}_${listenPort}`;
}
const PORTAL_COOKIE_PREFIX = "oc_portal_";
const PORTAL_REFERRER_POLICY = "no-referrer";
const MAX_WEBSOCKET_RESPONSE_HEADER_BYTES = 65536;
const HOP_BY_HOP_HEADERS = /* @__PURE__ */ new Set([
	"connection",
	"keep-alive",
	"proxy-authenticate",
	"proxy-authorization",
	"proxy-connection",
	"te",
	"trailer",
	"transfer-encoding",
	"upgrade"
]);
function tokensEqual(candidate, expected) {
	return Boolean(candidate) && safeEqualSecret(candidate, expected);
}
function readPortalCookie(cookieHeader, listenPort) {
	const authCookieName = portalAuthCookieName(listenPort);
	for (const segment of cookieHeader?.split(";") ?? []) {
		const separator = segment.indexOf("=");
		if (separator < 0 || segment.slice(0, separator).trim() !== authCookieName) continue;
		return segment.slice(separator + 1).trim();
	}
}
function portalCookiePrefix(cookieNamespace) {
	return `${PORTAL_COOKIE_PREFIX}${cookieNamespace}_`;
}
function readTargetCookies(cookieHeader, cookieNamespace) {
	const prefix = portalCookiePrefix(cookieNamespace);
	return (cookieHeader?.split(";") ?? []).flatMap((segment) => {
		const separator = segment.indexOf("=");
		if (separator <= 0) return [];
		const name = segment.slice(0, separator).trim();
		if (!name.startsWith(prefix) || name.length === prefix.length) return [];
		return [`${name.slice(prefix.length)}=${segment.slice(separator + 1).trim()}`];
	}).join("; ") || void 0;
}
function rewriteTargetCookie(cookie, target) {
	const [cookiePair, ...attributes] = cookie.split(";");
	const separator = cookiePair?.indexOf("=") ?? -1;
	if (!cookiePair || separator <= 0) return;
	const name = cookiePair.slice(0, separator).trim();
	if (!name) return;
	const retainedAttributes = attributes.filter((attribute) => !/^\s*domain\s*=/iu.test(attribute));
	if (target.partitionedCookies) {
		if (!retainedAttributes.some((attribute) => /^\s*samesite\s*=/iu.test(attribute))) retainedAttributes.push(" SameSite=None");
		for (const attribute of ["Secure", "Partitioned"]) if (!retainedAttributes.some((value) => value.trim().toLowerCase() === attribute.toLowerCase())) retainedAttributes.push(` ${attribute}`);
	}
	const suffix = retainedAttributes.length > 0 ? `;${retainedAttributes.join(";")}` : "";
	return `${portalCookiePrefix(target.cookieNamespace)}${name}=${cookiePair.slice(separator + 1)}${suffix}`;
}
function parsePortalUrl(req) {
	try {
		return new URL(req.url ?? "/", "http://openclaw.invalid");
	} catch {
		return;
	}
}
function authorizePortalRequest(req, target) {
	const url = parsePortalUrl(req);
	const setCookie = tokensEqual(url?.searchParams.get(PORTAL_AUTH_NAME) ?? void 0, target.token);
	if (!setCookie && !tokensEqual(readPortalCookie(req.headers.cookie, target.listenPort), target.token)) return { kind: "unauthorized" };
	url?.searchParams.delete(PORTAL_AUTH_NAME);
	return {
		kind: "authorized",
		requestPath: `${url?.pathname ?? "/"}${url?.search ?? ""}`,
		setCookie
	};
}
function portalCookie(target, tls) {
	const sameSite = target.partitionedCookies ? "None; Partitioned" : "Lax";
	return `${portalAuthCookieName(target.listenPort)}=${target.token}; HttpOnly; SameSite=${sameSite}; Path=/${tls ? "; Secure" : ""}`;
}
function setProxyResponseHeader(res, name, value, target) {
	if (name !== "set-cookie") {
		res.setHeader(name, value);
		return;
	}
	const existing = res.getHeader("Set-Cookie");
	const existingCookies = existing === void 0 ? [] : Array.isArray(existing) ? existing : [existing];
	const rewrittenCookies = (Array.isArray(value) ? value : [String(value)]).flatMap((cookie) => {
		const rewritten = rewriteTargetCookie(cookie, target);
		return rewritten ? [rewritten] : [];
	});
	const cookies = [...existingCookies.map(String), ...rewrittenCookies];
	if (cookies.length > 0) res.setHeader("Set-Cookie", cookies);
}
function htmlResponse(res, statusCode, html, headOnly) {
	res.statusCode = statusCode;
	res.setHeader("Content-Type", "text/html; charset=utf-8");
	res.setHeader("Cache-Control", "no-store");
	res.setHeader("X-Content-Type-Options", "nosniff");
	res.setHeader("Referrer-Policy", PORTAL_REFERRER_POLICY);
	res.setHeader("Content-Length", String(Buffer.byteLength(html)));
	res.end(headOnly ? void 0 : html);
}
function respondPortalUnauthorized(req, res) {
	htmlResponse(res, 401, "<!doctype html><meta charset=utf-8><title>Private portal</title><p>This portal is private. Open it from the OpenClaw Control UI.</p>", req.method === "HEAD");
}
function portalWaitingHtml(targetPort) {
	return `<!doctype html><meta charset=utf-8><meta http-equiv="refresh" content="2"><title>Waiting for app</title><p>Waiting for the app on port ${targetPort}…</p>`;
}
function respondPortalWaiting(req, res, targetPort) {
	htmlResponse(res, 502, portalWaitingHtml(targetPort), req.method === "HEAD");
}
async function connectPortalTarget(target) {
	if (target.kind === "worker") return await target.connect();
	return net.connect(createLoopbackConnectOptions(target.port));
}
function connectionHeaderTokens(headers) {
	const value = headers.connection;
	const joined = Array.isArray(value) ? value.join(",") : value;
	return new Set((joined ?? "").split(",").map((token) => token.trim().toLowerCase()).filter(Boolean));
}
function proxyHeaders(headers, cookieNamespace) {
	const result = {};
	const connectionTokens = connectionHeaderTokens(headers);
	for (const [name, value] of Object.entries(headers)) {
		const normalized = name.toLowerCase();
		if (value === void 0 || HOP_BY_HOP_HEADERS.has(normalized) || connectionTokens.has(normalized)) continue;
		if (cookieNamespace !== void 0 && (normalized === "forwarded" || normalized === "x-real-ip" || normalized.startsWith("x-forwarded-") || normalized.startsWith("tailscale-") || normalized.startsWith("cf-access-"))) continue;
		if (normalized === "cookie" && cookieNamespace !== void 0) {
			const cookie = readTargetCookies(Array.isArray(value) ? value.join("; ") : value, cookieNamespace);
			if (cookie) result.cookie = cookie;
			continue;
		}
		if (normalized === "referer" && String(value).includes(`${PORTAL_AUTH_NAME}=`)) continue;
		result[normalized] = value;
	}
	return result;
}
function targetRequestHeaders(req, target, tls) {
	const headers = proxyHeaders(req.headers, target.cookieNamespace);
	const publicUrl = target.publicOrigin ? new URL(target.publicOrigin) : void 0;
	headers.host = `localhost:${target.target.kind === "local" ? target.target.port : target.target.remotePort}`;
	headers["x-forwarded-for"] = req.socket.remoteAddress ?? "";
	headers["x-forwarded-proto"] = tls ? "https" : "http";
	const publicHost = publicUrl?.host ?? req.headers.host;
	if (publicHost) headers["x-forwarded-host"] = publicHost;
	return headers;
}
function portalRedirect(location, req, target, tls) {
	if (!/^https?:\/\//iu.test(location) && !location.startsWith("//")) return location;
	const origin = target.publicOrigin ?? `${tls ? "https" : "http"}://${req.headers.host}`;
	try {
		const destination = new URL(location, origin);
		const targetPort = target.target.kind === "local" ? target.target.port : target.target.remotePort;
		const port = Number(destination.port || (destination.protocol === "https:" ? 443 : 80));
		if (![
			"localhost",
			"127.0.0.1",
			"[::1]"
		].includes(destination.hostname) || port !== targetPort || destination.username || destination.password) return location;
		const published = new URL(origin);
		destination.protocol = published.protocol;
		destination.host = published.host;
		destination.port = published.port;
		return destination.href;
	} catch {
		return location;
	}
}
/** Proxies one authorized portal request to its local or worker target. */
function handlePortalProxyRequest(params) {
	const { req, res, target, tls } = params;
	const authorization = authorizePortalRequest(req, target);
	if (authorization.kind === "unauthorized") {
		respondPortalUnauthorized(req, res);
		return;
	}
	if (authorization.setCookie) res.setHeader("Set-Cookie", portalCookie(target, tls));
	const headers = targetRequestHeaders(req, target, tls);
	const targetPort = target.target.kind === "local" ? target.target.port : target.target.remotePort;
	connectPortalTarget(target.target).then((targetSocket) => {
		if (req.aborted || res.destroyed) {
			targetSocket.destroy();
			return;
		}
		const proxyReq = request({
			hostname: "localhost",
			createConnection: () => targetSocket,
			port: targetPort,
			method: req.method,
			path: authorization.requestPath,
			headers
		});
		proxyReq.once("response", (proxyRes) => {
			for (const [name, value] of Object.entries(proxyHeaders(proxyRes.headers))) if (value !== void 0) {
				const forwarded = name === "location" && typeof value === "string" ? portalRedirect(value, req, target, tls) : value;
				setProxyResponseHeader(res, name, forwarded, target);
			}
			res.setHeader("Referrer-Policy", PORTAL_REFERRER_POLICY);
			res.statusCode = proxyRes.statusCode ?? 502;
			proxyRes.once("error", () => res.destroy());
			res.flushHeaders();
			proxyRes.pipe(res);
		});
		proxyReq.once("error", () => {
			if (!res.headersSent) respondPortalWaiting(req, res, targetPort);
			else res.destroy();
		});
		proxyReq.once("close", () => {
			if (target.target.kind === "worker" && !res.headersSent && !res.writableEnded) respondPortalWaiting(req, res, targetPort);
		});
		res.once("close", () => proxyReq.destroy());
		req.pipe(proxyReq);
	}, () => {
		if (!res.headersSent && !res.writableEnded && !res.destroyed) respondPortalWaiting(req, res, targetPort);
	});
}
function websocketHeaders(req, target, tls, requestPath) {
	const lines = [`${req.method ?? "GET"} ${requestPath} HTTP/1.1`];
	const headers = targetRequestHeaders(req, target, tls);
	headers.connection = "Upgrade";
	headers.upgrade = req.headers.upgrade;
	for (const [name, value] of Object.entries(headers)) {
		if (value === void 0) continue;
		for (const item of Array.isArray(value) ? value : [value]) lines.push(`${name}: ${item}`);
	}
	lines.push("", "");
	return lines.join("\r\n");
}
function rejectPortalUpgrade(socket) {
	socket.end("HTTP/1.1 401 Unauthorized\r\nContent-Type: text/plain; charset=utf-8\r\nContent-Length: 12\r\nConnection: close\r\n\r\nUnauthorized");
}
function respondUpgradeWaiting(socket, targetPort) {
	const html = portalWaitingHtml(targetPort);
	socket.end(`HTTP/1.1 502 Bad Gateway\r
Content-Type: text/html; charset=utf-8\r
Cache-Control: no-store\r\nReferrer-Policy: ${PORTAL_REFERRER_POLICY}\r\nContent-Length: ${Buffer.byteLength(html)}\r\nConnection: close\r\n\r\n${html}`);
}
function forwardWebSocketResponse(targetSocket, browserSocket, target, onResponse) {
	let pending = Buffer.alloc(0);
	const onData = (chunk) => {
		pending = Buffer.concat([pending, chunk]);
		const headerEnd = pending.indexOf("\r\n\r\n");
		if (headerEnd < 0) {
			if (pending.length > MAX_WEBSOCKET_RESPONSE_HEADER_BYTES) {
				targetSocket.destroy();
				browserSocket.destroy();
			}
			return;
		}
		targetSocket.off("data", onData);
		const rewrittenLines = pending.subarray(0, headerEnd).toString("latin1").split("\r\n").flatMap((line) => {
			const separator = line.indexOf(":");
			if (separator <= 0 || line.slice(0, separator).trim().toLowerCase() !== "set-cookie") return [line];
			const rewritten = rewriteTargetCookie(line.slice(separator + 1).trimStart(), target);
			return rewritten ? [`${line.slice(0, separator)}: ${rewritten}`] : [];
		});
		onResponse();
		browserSocket.write(`${rewrittenLines.join("\r\n")}\r\n\r\n`);
		const remainder = pending.subarray(headerEnd + 4);
		if (remainder.length > 0) browserSocket.write(remainder);
		targetSocket.pipe(browserSocket);
	};
	targetSocket.on("data", onData);
}
/** Splices an authorized portal WebSocket upgrade into its local or worker target. */
function handlePortalProxyUpgrade(params) {
	const { req, socket, head, target, upgradedSockets, tls } = params;
	socket.once("error", () => socket.destroy());
	const authorization = authorizePortalRequest(req, target);
	if (authorization.kind !== "authorized") {
		rejectPortalUpgrade(socket);
		return;
	}
	const targetPort = target.target.kind === "local" ? target.target.port : target.target.remotePort;
	upgradedSockets.add(socket);
	socket.once("close", () => upgradedSockets.delete(socket));
	let responseStarted = false;
	const closeUpgrade = () => {
		if (target.target.kind === "worker" && !responseStarted && !socket.destroyed) {
			if (!socket.writableEnded) respondUpgradeWaiting(socket, targetPort);
			return;
		}
		socket.destroy();
	};
	connectPortalTarget(target.target).then((targetSocket) => {
		if (socket.destroyed) {
			targetSocket.destroy();
			return;
		}
		upgradedSockets.add(targetSocket);
		socket.once("close", () => targetSocket.destroy());
		targetSocket.once("close", () => {
			upgradedSockets.delete(targetSocket);
			closeUpgrade();
		});
		targetSocket.once("end", closeUpgrade);
		targetSocket.once("error", closeUpgrade);
		const spliceUpgrade = () => {
			forwardWebSocketResponse(targetSocket, socket, target, () => {
				responseStarted = true;
			});
			targetSocket.write(websocketHeaders(req, target, tls, authorization.requestPath));
			if (head.length > 0) targetSocket.write(head);
			socket.pipe(targetSocket);
		};
		if (target.target.kind === "worker") spliceUpgrade();
		else targetSocket.once("connect", spliceUpgrade);
	}, closeUpgrade);
}
//#endregion
//#region src/gateway/portals/portal-ingress.ts
/** Dedicated loopback ingress; registry lookup remains owned by the portal service. */
function createPortalIngress(params) {
	const server = createServer$1(params.request);
	server.on("upgrade", params.upgrade);
	let startup;
	let closed = false;
	return {
		start: () => {
			if (closed) return Promise.reject(/* @__PURE__ */ new Error("Portal ingress is closed"));
			if (!startup) {
				params.httpServers.push(server);
				startup = (async () => {
					try {
						await listenGatewayHttpServer({
							httpServer: server,
							bindHost: "127.0.0.1",
							port: params.port,
							retryEaddrinuse: false,
							serviceName: "portal ingress",
							endpointScheme: "http"
						});
						const address = server.address();
						if (!address || typeof address === "string") throw new Error("Portal ingress did not resolve its listener port");
						return address.port;
					} catch (error) {
						const index = params.httpServers.indexOf(server);
						if (index >= 0) params.httpServers.splice(index, 1);
						throw error;
					}
				})();
			}
			return startup;
		},
		close: async () => {
			closed = true;
			await startup?.catch(() => void 0);
			const index = params.httpServers.indexOf(server);
			if (index >= 0) params.httpServers.splice(index, 1);
			if (server.listening) await new Promise((resolve) => {
				server.close(() => resolve());
				server.closeAllConnections();
			});
		}
	};
}
/** Match only a single DNS hostname authority; forwarded headers never select a portal. */
function portalIngressHostname(host) {
	if (!host || !/^[a-z0-9.-]+(?::443)?$/iu.test(host)) return;
	return host.toLowerCase().replace(/:443$/u, "");
}
//#endregion
//#region src/gateway/portals/portal-tls-hostname.ts
/** Select a certificate-valid direct hostname without changing the listener or client URL. */
function resolvePortalTlsHostname(tlsOptions, gatewayOrigins, fallbackHost) {
	const material = Array.isArray(tlsOptions.cert) ? tlsOptions.cert[0] : tlsOptions.cert;
	if (!material) return fallbackHost;
	const certificate = new X509Certificate(material);
	const candidates = [];
	for (const origin of gatewayOrigins) try {
		candidates.push(new URL(origin).hostname.replace(/^\[|\]$/gu, ""));
	} catch {}
	candidates.push(fallbackHost.replace(/^\[|\]$/gu, ""));
	for (const match of (certificate.subjectAltName ?? "").matchAll(/(?:^|, )DNS:([a-z0-9.-]+)(?=, |$)/giu)) if (match[1]) candidates.push(match[1]);
	for (const candidate of candidates) if (isIP(candidate) ? certificate.checkIP(candidate) : certificate.checkHost(candidate, { subject: "never" })) return candidate.includes(":") ? `[${candidate}]` : candidate;
	return fallbackHost;
}
//#endregion
//#region src/gateway/portals/portal-service.ts
const PORTAL_PORT_ALLOCATION_ATTEMPTS = 10;
/** Callers retain admission and resource authority; the portal owner settles target custody. */
function createPortalOperations(service, owner, onChanged) {
	const list = () => {
		owner?.assertCurrent();
		const portals = owner ? service.listWorkerPortals(owner.environmentId, owner.ownerEpoch, owner.resourceOwnerKey) : service.list();
		owner?.assertCurrent();
		return { portals };
	};
	return {
		list,
		async close(id) {
			if (owner && !list().portals.some((portal) => portal.id === id)) throw new Error(owner.ownershipError);
			await service.close(id, owner?.assertCurrent.bind(owner));
			onChanged?.();
			owner?.assertCurrent();
			return { closed: true };
		},
		async open(request) {
			owner?.assertCurrent();
			const connection = await owner?.prepareTarget(request.port);
			try {
				owner?.assertCurrent();
				connection?.assertCurrent?.();
				connection?.ownerSignal?.throwIfAborted();
			} catch (error) {
				await connection?.close();
				throw error;
			}
			const opened = await service.open({
				targetPort: request.port,
				...owner && connection ? {
					target: {
						kind: "worker",
						environmentId: owner.environmentId,
						ownerEpoch: owner.ownerEpoch,
						remotePort: request.port,
						connect: connection.connect
					},
					assertCurrent: owner.assertCurrent.bind(owner),
					onClose: connection.close,
					resourceOwnerKey: owner.resourceOwnerKey,
					ownerSignal: connection.ownerSignal,
					origin: connection.origin
				} : {},
				...request.title !== void 0 ? { title: request.title } : {},
				...request.description !== void 0 ? { description: request.description } : {},
				...request.path !== void 0 ? { path: request.path } : {}
			});
			onChanged?.();
			owner?.assertCurrent();
			return opened;
		}
	};
}
function redactPortalSummary(summary) {
	const { tokenQuery: _tokenQuery, url: _url, ...redacted } = summary;
	return redacted;
}
function removeServers(shared, owned) {
	for (const server of owned) {
		const index = shared.indexOf(server);
		if (index >= 0) shared.splice(index, 1);
	}
}
async function closeServers(servers) {
	await Promise.all(servers.map((server) => new Promise((resolve) => {
		if (!server.listening) {
			resolve();
			return;
		}
		server.close(() => resolve());
		server.closeAllConnections();
	})));
}
async function formatPortalHost(host) {
	const openableHost = (host === "0.0.0.0" || host === "::" ? await resolveAdvertisedLanHostCore().catch(() => null) : null) ?? (host === "0.0.0.0" ? "127.0.0.1" : host === "::" ? "::1" : host);
	return openableHost.includes(":") ? `[${openableHost}]` : openableHost;
}
function createPortalProxyHandlers(resolveRuntime, tls) {
	return {
		request: (req, res) => {
			const runtime = resolveRuntime(req);
			if (!runtime) {
				res.writeHead(404);
				res.end("Unknown portal");
				return;
			}
			runtime.responses.add(res);
			res.once("close", () => runtime.responses.delete(res));
			handlePortalProxyRequest({
				req,
				res,
				target: runtime.portal,
				tls
			});
		},
		upgrade: (req, socket, head) => {
			const runtime = resolveRuntime(req);
			if (!runtime) {
				socket.destroy();
				return;
			}
			handlePortalProxyUpgrade({
				req,
				socket,
				head,
				target: runtime.portal,
				upgradedSockets: runtime.upgradedSockets,
				tls
			});
		}
	};
}
/** Creates the gateway-lifetime registry and per-portal transport listeners. */
function createGatewayPortalService(params) {
	const entries = /* @__PURE__ */ new Map();
	const operations = /* @__PURE__ */ new Map();
	let closed = false;
	const isAvailable = (runtime) => !closed && !runtime.revoked && !runtime.ingressSignal?.aborted && (!runtime.claim || runtime.claim.isActive());
	const ingressDomain = params.ingress?.domain.toLowerCase();
	if (ingressDomain && (!isValidPortalIngressDomain(ingressDomain) || params.gatewayOrigins?.some((origin) => portalIngressConflictsWithOrigin(ingressDomain, origin)))) throw new Error("Portal ingress must use a valid separate DNS domain from the Gateway and Control UI");
	const lookupIngress = (host) => {
		const hostname = portalIngressHostname(host);
		if (!hostname || closed) return;
		for (const runtime of entries.values()) if (isAvailable(runtime) && runtime.portal.publicOrigin === `https://${hostname}`) return runtime;
	};
	const ingress = params.ingress ? createPortalIngress({
		port: params.ingress.port,
		httpServers: params.httpServers,
		...createPortalProxyHandlers((req) => lookupIngress(req.headers.host), true)
	}) : void 0;
	const summarize = (portal) => {
		const tokenQuery = `openclaw_portal=${portal.token}`;
		const publicUrl = `${portal.publicOrigin}${portal.path ?? "/"}`;
		const openableUrl = new URL(publicUrl);
		openableUrl.searchParams.set("openclaw_portal", portal.token);
		return {
			id: portal.id,
			title: portal.title,
			port: portal.target.kind === "local" ? portal.target.port : portal.target.remotePort,
			listenPort: portal.listenPort,
			tokenQuery,
			url: openableUrl.toString(),
			publicUrl,
			...portal.path ? { path: portal.path } : {},
			...portal.description ? { description: portal.description } : {},
			...portal.origin ? { origin: portal.origin } : {},
			createdAtMs: portal.createdAtMs
		};
	};
	const serialize = (id, operation) => enqueueKeyedTask({
		tails: operations,
		key: id,
		task: operation
	});
	const closeEntry = async (id) => {
		const runtime = entries.get(id);
		if (!runtime) return;
		entries.delete(id);
		removeServers(params.httpServers, runtime.servers);
		for (const socket of runtime.upgradedSockets) socket.destroy();
		runtime.upgradedSockets.clear();
		for (const response of runtime.responses) response.destroy();
		runtime.responses.clear();
		runtime.detachOwner?.();
		const failure = (await Promise.allSettled([
			closeServers(runtime.servers),
			Promise.resolve().then(() => runtime.claim?.stop()),
			Promise.resolve().then(() => runtime.onClose?.())
		])).find((result) => result.status === "rejected");
		if (failure?.status === "rejected") throw failure.reason;
	};
	const summarizeEntries = (selected) => Array.from(selected).filter(isAvailable).map(({ portal }) => summarize(portal)).toSorted((left, right) => left.createdAtMs - right.createdAtMs || left.id.localeCompare(right.id));
	return {
		startIngress: async () => {
			await ingress?.start();
		},
		open: async (input) => {
			const target = input.target ?? {
				kind: "local",
				port: input.targetPort
			};
			const targetPort = target.kind === "local" ? target.port : target.remotePort;
			const resourceOwnerSuffix = input.resourceOwnerKey === void 0 ? "" : `-owner-${sha256HexPrefixCore(input.resourceOwnerKey, 32)}`;
			const id = target.kind === "local" ? `p${targetPort}` : `p${targetPort}${resourceOwnerSuffix}-worker-${sha256HexPrefixCore(target.environmentId, 32)}-${target.ownerEpoch}`;
			return await serialize(id, async () => {
				let releaseTarget = input.onClose;
				try {
					if (closed) throw new Error("portals unavailable");
					input.assertCurrent?.();
					input.ownerSignal?.throwIfAborted();
					let existing = entries.get(id);
					if (existing && !isAvailable(existing)) {
						await closeEntry(id);
						input.assertCurrent?.();
						input.ownerSignal?.throwIfAborted();
						if (closed) throw new Error("portals unavailable");
						existing = void 0;
					}
					if (existing) {
						existing.portal.title = input.title?.trim() || existing.portal.title;
						for (const key of [
							"description",
							"path",
							"origin"
						]) if (input[key] !== void 0) existing.portal[key] = input[key];
						return summarize(existing.portal);
					}
					if (params.httpBindHosts.length === 0) throw new Error("Gateway listener must start before opening a portal");
					const managed = !ingress && params.managedTailscale ? getTailscalePublishedOrigin() : void 0;
					if (!ingress && params.managedTailscale && (!managed || managed.signal.aborted)) throw new Error("Private portal ingress unavailable: the managed Tailscale route is not active");
					const gatewayPublication = getTailscalePublishedOrigin();
					if (ingressDomain && gatewayPublication && portalIngressConflictsWithOrigin(ingressDomain, gatewayPublication.origin)) throw new Error("Portal ingress domain conflicts with the managed Gateway hostname");
					const bindHosts = managed ? ["127.0.0.1"] : params.httpBindHosts;
					const tlsOptions = managed ? void 0 : params.tlsOptions;
					const portal = {
						id,
						...input.resourceOwnerKey !== void 0 ? { resourceOwnerKey: input.resourceOwnerKey } : {},
						title: input.title?.trim() || `Port ${targetPort}`,
						...input.description ? { description: input.description } : {},
						...input.path ? { path: input.path } : {},
						...input.origin ? { origin: input.origin } : {},
						target,
						token: randomBytes(32).toString("hex"),
						cookieNamespace: randomBytes(16).toString("hex"),
						listenPort: 0,
						createdAtMs: Date.now(),
						publicOrigin: "",
						partitionedCookies: Boolean(ingress || managed || tlsOptions)
					};
					const upgradedSockets = /* @__PURE__ */ new Set();
					const responses = /* @__PURE__ */ new Set();
					const { request, upgrade } = createPortalProxyHandlers(() => {
						const runtime = entries.get(id);
						return runtime?.portal === portal && isAvailable(runtime) ? runtime : void 0;
					}, Boolean(managed || tlsOptions));
					const servers = ingress ? [] : bindHosts.map(() => tlsOptions ? createServer$2(tlsOptions, request) : createServer$1(request));
					for (const server of servers) server.on("upgrade", upgrade);
					params.httpServers.push(...servers);
					let claim;
					try {
						if (ingress) {
							portal.listenPort = await ingress.start();
							if (target.kind === "local" && portal.listenPort === targetPort) throw new Error("Portal target port must differ from the portal ingress listener");
							portal.publicOrigin = `https://${randomBytes(16).toString("hex")}.${ingressDomain}`;
						} else {
							const primaryServer = servers[0];
							const primaryHost = bindHosts[0];
							if (!primaryServer || !primaryHost) throw new Error("Missing primary portal HTTP server");
							for (let attempt = 0; attempt < PORTAL_PORT_ALLOCATION_ATTEMPTS; attempt += 1) {
								await listenGatewayHttpServer({
									httpServer: primaryServer,
									bindHost: primaryHost,
									port: 0,
									retryEaddrinuse: false,
									serviceName: "portal",
									endpointScheme: tlsOptions ? "https" : "http"
								});
								const address = primaryServer.address();
								if (!address || typeof address === "string") throw new Error("Portal listener failed to resolve its port");
								if (target.kind === "worker" || address.port !== targetPort) {
									portal.listenPort = address.port;
									break;
								}
								await closeServers([primaryServer]);
							}
							if (portal.listenPort === 0) throw new Error(`Portal listener repeatedly allocated target port ${targetPort}`);
							for (const [index, host] of bindHosts.entries()) {
								if (index === 0) continue;
								const server = servers[index];
								if (!server) throw new Error(`Missing portal HTTP server for bind host ${host}`);
								await listenGatewayHttpServer({
									httpServer: server,
									bindHost: host,
									port: portal.listenPort,
									retryEaddrinuse: false,
									serviceName: "portal",
									endpointScheme: tlsOptions ? "https" : "http"
								});
							}
							if (managed) {
								const httpsPort = portal.listenPort;
								const gatewayUrl = new URL(managed.origin);
								if (httpsPort === Number(gatewayUrl.port || 443)) throw new Error("Portal HTTPS port conflicts with the Gateway origin");
								const assertServeCurrent = () => {
									input.assertCurrent?.();
									if (closed || managed.signal.aborted) throw new Error("Private portal ingress closed during startup");
								};
								assertServeCurrent();
								claim = await claimTailscaleServePort(portal.listenPort, httpsPort, assertServeCurrent);
								if (!claim.isActive() || managed.signal.aborted) throw new Error("Private portal ingress lost during startup");
								gatewayUrl.port = String(httpsPort);
								if (params.gatewayOrigins?.includes(gatewayUrl.origin)) throw new Error("Portal HTTPS origin conflicts with the Control UI");
								portal.publicOrigin = gatewayUrl.origin;
							} else {
								const bindHostname = await formatPortalHost(primaryHost);
								const hostname = tlsOptions ? resolvePortalTlsHostname(tlsOptions, params.gatewayOrigins ?? [], bindHostname) : bindHostname;
								portal.publicOrigin = `${tlsOptions ? "https" : "http"}://${hostname}:${portal.listenPort}`;
							}
						}
						if (closed) throw new Error("portals unavailable");
						input.assertCurrent?.();
						input.ownerSignal?.throwIfAborted();
						if (managed && (managed.signal.aborted || !claim?.isActive())) throw new Error("Private portal ingress lost before publication");
					} catch (error) {
						removeServers(params.httpServers, servers);
						for (const socket of upgradedSockets) socket.destroy();
						await Promise.all([closeServers(servers), claim?.stop()]);
						throw error;
					}
					const runtime = {
						portal,
						servers,
						upgradedSockets,
						...input.onClose ? { onClose: input.onClose } : {},
						claim,
						responses,
						ingressSignal: managed?.signal
					};
					entries.set(id, runtime);
					const ownerSignals = [input.ownerSignal, managed?.signal].filter((signal) => signal !== void 0);
					if (claim || ownerSignals.length) {
						const retire = () => {
							if (entries.get(id) === runtime) {
								runtime.revoked = true;
								serialize(id, async () => {
									if (entries.get(id) === runtime) await closeEntry(id);
								}).catch(() => void 0);
							}
						};
						for (const signal of ownerSignals) signal.addEventListener("abort", retire, { once: true });
						runtime.detachOwner = () => {
							for (const signal of ownerSignals) signal.removeEventListener("abort", retire);
						};
						if (claim) claim.exited.then(retire, retire);
					}
					releaseTarget = void 0;
					return summarize(portal);
				} finally {
					await releaseTarget?.();
				}
			});
		},
		list: () => summarizeEntries(entries.values()),
		listWorkerPortals: (environmentId, ownerEpoch, resourceOwnerKey) => summarizeEntries([...entries.values()].filter(({ portal }) => portal.target.kind === "worker" && portal.target.environmentId === environmentId && portal.target.ownerEpoch === ownerEpoch && (resourceOwnerKey === void 0 || portal.resourceOwnerKey === resourceOwnerKey))),
		close: async (id, assertCurrent) => {
			await serialize(id, () => {
				assertCurrent?.();
				return closeEntry(id);
			});
		},
		closeWorkerPortals: async (environmentId, ownerEpoch) => {
			const environmentSuffix = `-worker-${sha256HexPrefixCore(environmentId, 32)}-`;
			const ids = [.../* @__PURE__ */ new Set([...entries.keys(), ...operations.keys()])].filter((id) => {
				const separator = id.indexOf(environmentSuffix);
				return separator >= 0 && (ownerEpoch === void 0 || id.slice(separator + environmentSuffix.length) === String(ownerEpoch));
			});
			await Promise.all(ids.map((id) => serialize(id, () => closeEntry(id))));
		},
		closeAll: async () => {
			closed = true;
			const ids = /* @__PURE__ */ new Set([...entries.keys(), ...operations.keys()]);
			try {
				await Promise.all([...ids].map((id) => serialize(id, () => closeEntry(id))));
			} finally {
				await ingress?.close();
			}
		}
	};
}
//#endregion
export { listenGatewayHttpServer as i, createPortalOperations as n, redactPortalSummary as r, createGatewayPortalService as t };
