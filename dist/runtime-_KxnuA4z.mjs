import { E as resolveStateDir } from "./paths-DehQwyE0.mjs";
import { t as createSubsystemLogger } from "./subsystem-DleLyu58.mjs";
import { t as normalizeExactAllowedHost } from "./exact-hostname-B5MIU7_E.mjs";
import { a as containsSecretSentinel, c as resolveSecretSentinel, i as SECRET_SENTINEL_SUFFIX, n as SECRET_SENTINEL_PATTERN, o as looksLikeSecretSentinel, r as SECRET_SENTINEL_PREFIX } from "./sentinel-C86v7W15.mjs";
import { i as publishSecretEgressProxy, t as clearSecretEgressProxy } from "./registry-DGG6-ieI.mjs";
import { n as ensureSecretEgressProxyCa, r as generateLocalProxyLeaf } from "./ca-C84Szl1v.mjs";
import fs from "node:fs";
import { URL } from "node:url";
import path from "node:path";
import net from "node:net";
import { PassThrough, Transform, Writable } from "node:stream";
import { X509Certificate, randomBytes, timingSafeEqual } from "node:crypto";
import { ServerResponse, createServer as createServer$1 } from "node:http";
import { Agent, request as request$1 } from "node:https";
import { createServer as createServer$3, rootCertificates } from "node:tls";
//#region src/secrets/egress-proxy/certificates.ts
const LEAF_RENEWAL_MARGIN_MS = 36e5;
const CA_WARNING_MARGIN_MS = 6048e5;
const CERTIFICATE_RETRY_MESSAGE = "Secret egress proxy could not prepare a TLS certificate. Check Gateway logs, OpenSSL availability, and the system clock, then retry the request.";
const CA_RESTART_MESSAGE = "Secret egress proxy CA is expired or not yet valid. Check the system clock, then restart the Gateway to create a new process trust chain.";
var SecretEgressCertificateError = class extends Error {};
function readValidity(pem) {
	const certificate = new X509Certificate(pem);
	return {
		notBefore: certificate.validFromDate.getTime(),
		notAfter: certificate.validToDate.getTime()
	};
}
function validAt(validity, now) {
	return validity.notBefore <= now && now < validity.notAfter;
}
/** Owns one process trust chain and the certificate work using its private key. */
async function createSecretEgressCertificates(certDir) {
	const ca = await ensureSecretEgressProxyCa(certDir);
	const caPem = fs.readFileSync(ca.certPath, "utf8");
	const caValidity = readValidity(caPem);
	const caExpiresAt = new Date(caValidity.notAfter).toISOString();
	const preparations = /* @__PURE__ */ new Set();
	let failedCertificates = 0;
	const assertCaValid = () => {
		if (!validAt(caValidity, Date.now())) throw new SecretEgressCertificateError(CA_RESTART_MESSAGE);
	};
	return {
		caCertPath: ca.certPath,
		caPem,
		getStatus: () => {
			const now = Date.now();
			const message = !validAt(caValidity, now) ? CA_RESTART_MESSAGE : failedCertificates > 0 ? CERTIFICATE_RETRY_MESSAGE : caValidity.notAfter - now <= CA_WARNING_MARGIN_MS ? "Secret egress proxy CA expires within seven days. Restart the Gateway before expiry to create a new process trust chain." : void 0;
			return {
				state: message ? "degraded" : "ready",
				caExpiresAt,
				failedCertificates,
				...message ? { message } : {}
			};
		},
		createContext: (params) => {
			let ready;
			let preparation;
			let failed = false;
			const setFailed = (value) => {
				failedCertificates += Number(value) - Number(failed);
				failed = value;
			};
			return {
				get: async () => {
					if (!params.isActive()) return;
					assertCaValid();
					if (preparation) return preparation;
					const now = Date.now();
					if (ready && validAt(ready.validity, now) && ready.validity.notAfter - now > LEAF_RENEWAL_MARGIN_MS) return ready.server;
					const pending = generateLocalProxyLeaf({
						certDir,
						ca,
						hostname: params.hostname
					}).then((leaf) => {
						if (!params.isActive()) return;
						assertCaValid();
						const validity = readValidity(leaf.cert);
						if (!validAt(validity, Date.now())) throw new SecretEgressCertificateError(CERTIFICATE_RETRY_MESSAGE);
						if (ready) {
							ready.server.setSecureContext(leaf);
							ready.validity = validity;
						} else ready = {
							server: params.createServer(leaf),
							validity
						};
						setFailed(false);
						return ready.server;
					}).catch(() => {
						if (!params.isActive()) return;
						setFailed(true);
						assertCaValid();
						throw new SecretEgressCertificateError(CERTIFICATE_RETRY_MESSAGE);
					});
					preparation = pending;
					preparations.add(pending);
					try {
						return await pending;
					} finally {
						preparation = void 0;
						preparations.delete(pending);
					}
				},
				close: () => {
					setFailed(false);
					ready?.server.close();
				}
			};
		},
		waitForPreparations: () => Promise.allSettled(preparations)
	};
}
//#endregion
//#region src/secrets/egress-proxy/stream-substitution.ts
const SENTINEL_PREFIX_BYTES = Buffer.from(SECRET_SENTINEL_PREFIX);
const SENTINEL_SUFFIX_BYTES = Buffer.from(SECRET_SENTINEL_SUFFIX);
var SecretEgressSubstitutionError = class extends Error {
	constructor(reason, details) {
		super(details ? `Secret "${details.secretName}" is not allowed for host "${details.host}". Run: openclaw secrets store set ${details.secretName} --allow-host ${details.host}` : "Secret egress proxy refused an unresolved secret sentinel");
		this.reason = reason;
		this.details = details;
		this.name = "SecretEgressSubstitutionError";
	}
};
function processPendingBuffer(params) {
	let pending = params.buffer;
	for (;;) {
		const prefixIndex = pending.indexOf(SENTINEL_PREFIX_BYTES);
		if (prefixIndex === -1) {
			const carryBytes = params.flush ? 0 : Math.min(pending.length, SENTINEL_PREFIX_BYTES.length - 1);
			const emitBytes = pending.length - carryBytes;
			if (emitBytes > 0) params.push(pending.subarray(0, emitBytes));
			return carryBytes > 0 ? pending.subarray(emitBytes) : Buffer.alloc(0);
		}
		if (prefixIndex > 0) {
			params.push(pending.subarray(0, prefixIndex));
			pending = pending.subarray(prefixIndex);
		}
		const suffixIndex = pending.indexOf(SENTINEL_SUFFIX_BYTES, SENTINEL_PREFIX_BYTES.length);
		if (suffixIndex === -1) {
			if (params.flush || pending.length > 87445) throw new SecretEgressSubstitutionError("unresolved-sentinel");
			return pending;
		}
		const sentinelEnd = suffixIndex + SENTINEL_SUFFIX_BYTES.length;
		if (sentinelEnd > 87445) throw new SecretEgressSubstitutionError("unresolved-sentinel");
		const sentinel = pending.subarray(0, sentinelEnd).toString("ascii");
		const resolved = looksLikeSecretSentinel(sentinel) ? params.resolveSentinel(sentinel) : void 0;
		if (resolved === void 0) throw new SecretEgressSubstitutionError("unresolved-sentinel");
		if (Buffer.byteLength(resolved, "utf8") > sentinelEnd) throw new SecretEgressSubstitutionError("unresolved-sentinel");
		params.push(Buffer.from(resolved, "utf8"));
		params.onSubstitution();
		pending = pending.subarray(sentinelEnd);
	}
}
/** Reuses the binary scanner in place; nonexpansion keeps writes behind unread input. */
function substituteSecretEgressBody(buffer, params) {
	let length = 0;
	processPendingBuffer({
		...params,
		buffer,
		flush: true,
		push: (chunk) => {
			chunk.copy(buffer, length);
			length += chunk.length;
		}
	});
	return buffer.subarray(0, length);
}
/** Rewrites process-local sentinels across arbitrary request-body chunk boundaries. */
function createSecretEgressBodyTransform(params) {
	let pending = Buffer.alloc(0);
	return new Transform({
		transform(chunk, _encoding, callback) {
			try {
				const input = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
				pending = processPendingBuffer({
					buffer: pending.length > 0 ? Buffer.concat([pending, input]) : input,
					flush: false,
					onSubstitution: params.onSubstitution,
					resolveSentinel: params.resolveSentinel,
					push: (output) => this.push(output)
				});
				callback();
			} catch (error) {
				callback(error);
			}
		},
		destroy(error, callback) {
			pending = Buffer.alloc(0);
			callback(error);
		},
		flush(callback) {
			try {
				pending = processPendingBuffer({
					buffer: pending,
					flush: true,
					onSubstitution: params.onSubstitution,
					resolveSentinel: params.resolveSentinel,
					push: (output) => this.push(output)
				});
				callback();
			} catch (error) {
				callback(error);
			}
		}
	});
}
//#endregion
//#region src/secrets/egress-proxy/proxy-forward.ts
const REFUSAL_BODY = "Secret egress proxy refused the request.\n";
const UPSTREAM_ERROR_BODY = "Secret egress proxy could not reach the upstream host.\n";
const MAX_BUFFERED_REQUEST_BODY_BYTES = 104857600;
const BUFFERED_REQUEST_WRITE_BYTES = 65536;
const MAX_BUFFERED_UPGRADE_BYTES = 65536;
function sendHttpRefusal(res, status = 502, body = REFUSAL_BODY) {
	if (res.destroyed || res.writableEnded) return;
	if (res.headersSent) {
		res.destroy();
		return;
	}
	res.writeHead(status, {
		Connection: "close",
		"Content-Length": Buffer.byteLength(body),
		"Content-Type": "text/plain; charset=utf-8"
	});
	res.end(body);
}
function handleUpgradeRequest(handler, request, head) {
	const response = new ServerResponse(request);
	try {
		response.assignSocket(request.socket);
	} catch {
		request.socket.destroy();
		return;
	}
	const stream = new PassThrough({ highWaterMark: MAX_BUFFERED_UPGRADE_BYTES });
	let buffering = true;
	const stopBuffering = () => {
		if (!buffering) return;
		buffering = false;
		request.socket.pause();
		request.socket.off("data", onData);
		request.socket.off("end", onEnd);
	};
	const onData = (chunk) => {
		if (!stream.write(chunk)) {
			stopBuffering();
			response.destroy();
			request.socket.destroy();
		}
	};
	const onEnd = () => stream.end();
	request.socket.on("data", onData);
	request.socket.once("end", onEnd);
	request.socket.once("close", () => {
		stopBuffering();
		stream.destroy();
		if (!response.writableEnded) response.destroy();
	});
	response.once("finish", () => {
		if (response.socket) {
			stream.destroy();
			response.socket.end();
		}
	});
	if (head.length > 0) onData(head);
	if (request.socket.destroyed) return;
	handler(request, response, {
		stream,
		stopBuffering
	});
}
function sendSecretEgressRequest(forward, body, releaseBody) {
	const { target, headers, host } = forward;
	let { substituted } = forward;
	delete headers["content-length"];
	delete headers["transfer-encoding"];
	if (body !== void 0) {
		headers["content-length"] = String(body.length);
		delete headers.expect;
		delete headers.trailer;
	}
	let refused = false;
	let upgraded = false;
	const upstream = forward.ownResource(request$1({
		hostname: target.hostname,
		port: target.port || 443,
		path: `${target.pathname}${target.search}`,
		method: forward.request.method,
		headers,
		agent: forward.upstreamTlsAgent
	}, (upstreamResponse) => {
		forward.ownResource(upstreamResponse);
		if (refused || !forward.isActive()) {
			upstreamResponse.destroy();
			return;
		}
		upstreamResponse.once("error", () => forward.response.destroy());
		forward.response.writeHead(upstreamResponse.statusCode ?? 502, upstreamResponse.headers);
		upstreamResponse.pipe(forward.response);
	}));
	const bodyTransform = forward.ownResource(createSecretEgressBodyTransform({
		onSubstitution: () => {
			substituted = true;
		},
		resolveSentinel: forward.resolveSentinel
	}));
	forward.request.once("error", () => forward.response.destroy());
	const onResponseClose = () => {
		refused = true;
		forward.request.unpipe(bodyTransform);
		bodyTransform.destroy();
		upstream.destroy();
	};
	forward.response.once("close", onResponseClose);
	if (forward.upgrade) forward.request.socket.once("end", () => {
		if (!upgraded) forward.response.destroy();
	});
	upstream.once("close", () => releaseBody?.());
	upstream.once("finish", () => {
		releaseBody?.();
		if (!refused && forward.isActive()) forward.audit({
			kind: "forwarded",
			host,
			substituted
		});
	});
	bodyTransform.once("error", (error) => {
		if (refused || !forward.isActive()) return;
		refused = true;
		forward.request.unpipe(bodyTransform);
		forward.request.resume();
		upstream.destroy();
		const reason = error instanceof SecretEgressSubstitutionError ? error.reason : "unresolved-sentinel";
		forward.audit({
			kind: "refused",
			host,
			substituted,
			reason
		});
		sendHttpRefusal(forward.response, 502, error instanceof SecretEgressSubstitutionError ? `${error.message}\n` : REFUSAL_BODY);
	});
	upstream.once("error", () => {
		if (refused || !forward.isActive()) return;
		refused = true;
		forward.audit({
			kind: "refused",
			host,
			substituted,
			reason: "upstream-error"
		});
		sendHttpRefusal(forward.response, 502, UPSTREAM_ERROR_BODY);
	});
	upstream.once("upgrade", (response, upstreamSocket, head) => {
		forward.ownResource(upstreamSocket);
		if (refused || !forward.isActive()) {
			upstreamSocket.destroy();
			return;
		}
		if (!forward.upgrade || response.statusCode !== 101 || response.headers.upgrade?.toLowerCase() !== "websocket") {
			refused = true;
			forward.audit({
				kind: "refused",
				host,
				substituted,
				reason: "upstream-error"
			});
			upstreamSocket.destroy();
			sendHttpRefusal(forward.response);
			return;
		}
		const clientSocket = forward.ownResource(forward.request.socket);
		forward.response.off("close", onResponseClose);
		upgraded = true;
		forward.response.writeHead(101, response.headers);
		forward.response.end();
		forward.response.detachSocket(clientSocket);
		forward.releaseResponse();
		bodyTransform.destroy();
		clientSocket.once("close", () => upstreamSocket.destroy());
		upstreamSocket.once("close", () => clientSocket.destroy());
		if (head.length > 0) clientSocket.write(head);
		const bufferedClientFrames = forward.upgrade.stream;
		forward.upgrade.stopBuffering();
		bufferedClientFrames.once("end", () => {
			if (!clientSocket.destroyed && !upstreamSocket.destroyed) clientSocket.pipe(upstreamSocket);
		});
		bufferedClientFrames.pipe(upstreamSocket, { end: false });
		bufferedClientFrames.end();
		upstreamSocket.pipe(clientSocket);
	});
	if (forward.upgrade) upstream.end();
	else if (body !== void 0) {
		bodyTransform.destroy();
		const bufferedBody = body;
		let offset = 0;
		let scheduled;
		const writeBody = () => {
			scheduled = void 0;
			if (refused || !forward.isActive() || upstream.destroyed) {
				upstream.destroy();
				return;
			}
			if (offset === bufferedBody.length) {
				upstream.off("close", stopSending);
				upstream.end();
				return;
			}
			const chunk = bufferedBody.subarray(offset, offset + BUFFERED_REQUEST_WRITE_BYTES);
			offset += chunk.length;
			if (upstream.write(chunk)) scheduled = setImmediate(writeBody);
			else upstream.once("drain", writeBody);
		};
		const stopSending = () => {
			if (scheduled) clearImmediate(scheduled);
			upstream.off("drain", writeBody);
		};
		upstream.once("close", stopSending);
		writeBody();
	} else forward.request.pipe(bodyTransform).pipe(upstream);
	return upstream;
}
/** One proxy owns admission across all registrations, including bodies still being sent. */
function createSecretEgressBodyBudget() {
	let bytes = 0;
	let count = 0;
	return (length) => {
		const weight = length + 262144;
		if (count >= 64 || bytes + weight > 134217728) return;
		bytes += weight;
		count++;
		let released = false;
		return () => {
			if (!released) {
				released = true;
				bytes -= weight;
				count--;
			}
		};
	};
}
function allocateBufferedRequestBody(length) {
	if (!Number.isSafeInteger(length) || length < 0 || length > MAX_BUFFERED_REQUEST_BODY_BYTES) throw new RangeError("Invalid buffered request body length");
	return Buffer.allocUnsafeSlow(length);
}
/** Collect original bytes, then authorize/substitute synchronously at the send boundary. */
function forwardSecretEgressRequest(forward) {
	const length = Number(forward.request.headers["content-length"]);
	const buffered = !forward.upgrade && forward.request.headers["content-length"] !== void 0 && forward.request.headers["transfer-encoding"] === void 0 && Number.isSafeInteger(length) && length >= 0 && length <= MAX_BUFFERED_REQUEST_BODY_BYTES;
	let body;
	let collector;
	let upstream;
	const releaseBudget = buffered ? forward.acquireBody(length) : void 0;
	let refused = false;
	let substituted = false;
	const release = () => {
		body = void 0;
		clearTimeout(timer);
		releaseBudget?.();
	};
	const refuse = (reason, status = 502, message = REFUSAL_BODY) => {
		if (refused) return;
		refused = true;
		if (collector) {
			forward.request.unpipe(collector);
			collector.destroy();
		}
		forward.request.resume();
		if (upstream) upstream.destroy();
		else release();
		forward.response.once("close", () => forward.request.destroy());
		forward.audit({
			kind: "refused",
			host: forward.host,
			substituted,
			reason
		});
		sendHttpRefusal(forward.response, status, message);
	};
	const timer = releaseBudget ? setTimeout(() => refuse("request-timeout", 504, "Secret egress proxy upload timed out.\n"), 3e5) : void 0;
	timer?.unref();
	const send = () => {
		if (refused || !forward.isActive() || forward.response.destroyed) {
			release();
			return;
		}
		try {
			const prepared = forward.prepareRequest();
			substituted = prepared.substituted;
			const output = body === void 0 ? void 0 : substituteSecretEgressBody(body, {
				resolveSentinel: forward.resolveSentinel,
				onSubstitution: () => {
					substituted = true;
				}
			});
			upstream = sendSecretEgressRequest({
				...forward,
				...prepared,
				substituted,
				isActive: () => !refused && forward.isActive()
			}, output, release);
			body = void 0;
		} catch (error) {
			refuse(error instanceof SecretEgressSubstitutionError ? error.reason : "upstream-error", error instanceof SecretEgressSubstitutionError && error.reason === "host-not-allowed" ? 403 : 502, error instanceof SecretEgressSubstitutionError ? error.message + "\n" : REFUSAL_BODY);
		}
	};
	if (!buffered) {
		send();
		return;
	}
	forward.request.once("error", () => forward.response.destroy());
	forward.response.once("close", () => {
		refused = true;
		if (collector) {
			forward.request.unpipe(collector);
			collector.destroy();
		}
		if (upstream) upstream.destroy();
		else release();
	});
	if (!releaseBudget) {
		refuse("upload-capacity", 503, "Secret egress proxy upload capacity is busy. Retry the request.\n");
		return;
	}
	try {
		body = allocateBufferedRequestBody(length);
		let received = 0;
		collector = forward.ownResource(new Writable({ write(chunk, _encoding, callback) {
			if (!body || received + chunk.length > length) {
				callback(/* @__PURE__ */ new Error("Invalid request body length"));
				return;
			}
			chunk.copy(body, received);
			received += chunk.length;
			callback();
		} }));
		collector.once("error", () => refuse("upstream-error"));
		collector.once("finish", () => {
			if (received !== length) refuse("upstream-error");
			else send();
		});
		forward.request.pipe(collector);
	} catch {
		refuse("upstream-error");
	}
}
//#endregion
//#region src/secrets/egress-proxy/proxy-server.ts
const PROXY_AUTH_USERNAME = "openclaw";
const PROXY_AUTH_REALM = "OpenClaw secret egress";
function parseConnectTarget(rawTarget) {
	const raw = rawTarget?.trim();
	if (!raw || /[\r\n]/u.test(raw)) throw new Error("Invalid CONNECT target");
	const target = new URL(`https://${raw}`);
	if (target.pathname !== "/" || target.search || target.hash || target.username || target.password) throw new Error("Invalid CONNECT target");
	const port = target.port ? Number(target.port) : 443;
	if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error("Invalid CONNECT target port");
	return {
		hostname: normalizeExactAllowedHost(target.hostname),
		port
	};
}
function parseProxyToken(token) {
	if (!/^[A-Za-z0-9_-]{43}$/u.test(token)) return;
	const bytes = Buffer.from(token, "base64url");
	return bytes.length === 32 && bytes.toString("base64url") === token ? bytes : void 0;
}
function parseBasicProxyPassword(header) {
	if (typeof header !== "string") return;
	const match = /^Basic\s+([A-Za-z0-9+/]+={0,2})$/iu.exec(header.trim());
	if (!match?.[1]) return;
	let decoded;
	try {
		decoded = Buffer.from(match[1], "base64").toString("utf8");
	} catch {
		return;
	}
	const colon = decoded.indexOf(":");
	if (colon === -1 || decoded.slice(0, colon) !== PROXY_AUTH_USERNAME) return;
	return decoded.slice(colon + 1);
}
function sendProxyAuthRequired(socket) {
	socket.end(`HTTP/1.1 407 Proxy Authentication Required\r\nProxy-Authenticate: Basic realm="${PROXY_AUTH_REALM}"\r\nConnection: close\r\nContent-Length: ${Buffer.byteLength(REFUSAL_BODY)}\r\nContent-Type: text/plain; charset=utf-8\r\n\r\n${REFUSAL_BODY}`);
}
function resolveRegisteredSentinel(params) {
	if (!params.registered.isActive()) return;
	const binding = params.registered.sentinelBindings.get(params.sentinel);
	if (!binding) return;
	if (!binding.allowedHosts.has(params.host)) throw new SecretEgressSubstitutionError("destination-not-allowed", {
		host: params.host,
		secretName: binding.name
	});
	return resolveSecretSentinel(params.sentinel);
}
function swapRequestText(params) {
	if (!containsSecretSentinel(params.value)) return {
		value: params.value,
		substituted: false
	};
	let substituted = false;
	const swapped = params.value.replace(new RegExp(SECRET_SENTINEL_PATTERN.source, "g"), (sentinel) => {
		const resolved = resolveRegisteredSentinel({
			sentinel,
			host: params.host,
			registered: params.registered
		});
		if (resolved === void 0) return sentinel;
		substituted = true;
		return params.urlMode ? encodeURIComponent(resolved) : resolved;
	});
	if (containsSecretSentinel(swapped)) throw new SecretEgressSubstitutionError("unresolved-sentinel");
	return {
		value: swapped,
		substituted
	};
}
function swapRequestHeaders(params) {
	const output = {};
	let substituted = false;
	for (const [name, rawValue] of Object.entries(params.headers)) {
		const lowerName = name.toLowerCase();
		if (lowerName === "proxy-authorization" || lowerName === "proxy-connection") continue;
		if (Array.isArray(rawValue)) {
			output[name] = rawValue.map((value) => {
				const swapped = swapRequestText({
					value,
					urlMode: false,
					host: params.host,
					registered: params.registered
				});
				substituted ||= swapped.substituted;
				return swapped.value;
			});
			continue;
		}
		if (rawValue !== void 0) {
			const swapped = swapRequestText({
				value: rawValue,
				urlMode: false,
				host: params.host,
				registered: params.registered
			});
			substituted ||= swapped.substituted;
			output[name] = swapped.value;
		}
	}
	return {
		headers: output,
		substituted
	};
}
/** Starts one authenticated, loopback-only substitution proxy. */
async function startSecretEgressProxyServer(params) {
	const certificates = await createSecretEgressCertificates(params.caDir);
	const { caPem } = certificates;
	const trustBundlePath = path.join(params.caDir, "trust-bundle.pem");
	fs.writeFileSync(trustBundlePath, `${rootCertificates.join("\n")}\n${caPem}`, { mode: 420 });
	const upstreamTlsAgent = new Agent({ ca: [...rootCertificates, caPem] });
	const bypassHosts = new Set((params.bypassHosts ?? []).map(normalizeExactAllowedHost));
	const allowedHosts = params.allowedHosts === void 0 ? void 0 : new Set(params.allowedHosts.map(normalizeExactAllowedHost));
	const registrations = /* @__PURE__ */ new Set();
	const acquireBody = createSecretEgressBodyBudget();
	const sockets = /* @__PURE__ */ new Set();
	let stopped = false;
	let stopPromise;
	const ownResource = (registered, resource) => {
		if (!registered.resources.has(resource)) {
			registered.resources.add(resource);
			resource.once("close", () => registered.resources.delete(resource));
			resource.on("error", () => resource.destroy());
		}
		if (!registered.isActive()) resource.destroy();
		return resource;
	};
	const revokeRegistration = (registered) => {
		registrations.delete(registered);
		registered.sentinelBindings.clear();
		for (const resource of registered.resources) resource.destroy();
		registered.resources.clear();
		for (const server of registered.tlsServers.values()) server.close();
		registered.tlsServers.clear();
	};
	const audit = (event) => params.onAudit(event);
	const hostAllowed = (host, registered) => {
		if (allowedHosts === void 0 || allowedHosts.has(host) || bypassHosts.has(host)) return true;
		for (const binding of registered.sentinelBindings.values()) if (binding.allowedHosts.has(host)) return true;
		return false;
	};
	const hostNotAllowedBody = (host) => `Host "${host}" is not in the secret egress proxy traffic allowlist. Add it to secrets.egressProxy.allowedHosts or bind a store secret to it with: openclaw secrets store set <NAME> --allow-host ${host}, then restart the Gateway.\n`;
	const authorize = (headers) => {
		const rawHeader = headers["proxy-authorization"];
		if (rawHeader === void 0) return "missing-proxy-auth";
		const password = parseBasicProxyPassword(rawHeader);
		if (!password) return "invalid-proxy-auth";
		const candidate = parseProxyToken(password);
		if (!candidate) return "invalid-proxy-auth";
		for (const registered of registrations.values()) if (timingSafeEqual(candidate, registered.token)) return registered;
		return "invalid-proxy-auth";
	};
	const parseRequestTarget = (request, response, base) => {
		try {
			const target = new URL(request.url ?? "/", base);
			return {
				target,
				host: normalizeExactAllowedHost(target.hostname)
			};
		} catch {
			audit({
				kind: "refused",
				host: "unknown",
				substituted: false,
				reason: "upstream-error"
			});
			sendHttpRefusal(response, 400);
			request.resume();
			return;
		}
	};
	const forwardRequest = (forward) => {
		ownResource(forward.registered, forward.request);
		ownResource(forward.registered, forward.response);
		if (forward.upgrade) ownResource(forward.registered, forward.upgrade.stream);
		if (!forward.registered.isActive()) return;
		if (forward.upgrade && (forward.request.method !== "GET" || forward.request.headers.upgrade?.toLowerCase() !== "websocket")) {
			sendHttpRefusal(forward.response, 400);
			return;
		}
		const { host } = forward;
		if (forward.target.protocol !== "https:") {
			audit({
				kind: "refused",
				host,
				substituted: false,
				reason: "non-https-request"
			});
			sendHttpRefusal(forward.response);
			forward.request.resume();
			return;
		}
		if (!hostAllowed(host, forward.registered)) {
			audit({
				kind: "refused",
				host,
				substituted: false,
				reason: "host-not-allowed"
			});
			sendHttpRefusal(forward.response, 403, hostNotAllowedBody(host));
			forward.request.resume();
			return;
		}
		forwardSecretEgressRequest({
			request: forward.request,
			response: forward.response,
			upgrade: forward.upgrade,
			host,
			acquireBody,
			prepareRequest: () => {
				if (!hostAllowed(host, forward.registered)) {
					const error = new SecretEgressSubstitutionError("host-not-allowed");
					error.message = hostNotAllowedBody(host).trimEnd();
					throw error;
				}
				const swappedUrl = swapRequestText({
					value: forward.target.toString(),
					urlMode: true,
					host,
					registered: forward.registered
				});
				const target = new URL(swappedUrl.value);
				const swappedHeaders = swapRequestHeaders({
					headers: forward.request.headers,
					host,
					registered: forward.registered
				});
				swappedHeaders.headers.host = target.host;
				return {
					target,
					headers: swappedHeaders.headers,
					substituted: swappedUrl.substituted || swappedHeaders.substituted
				};
			},
			upstreamTlsAgent,
			isActive: forward.registered.isActive,
			ownResource: (resource) => ownResource(forward.registered, resource),
			releaseResponse: () => {
				forward.registered.resources.delete(forward.response);
			},
			resolveSentinel: (sentinel) => resolveRegisteredSentinel({
				sentinel,
				host,
				registered: forward.registered
			}),
			audit
		});
	};
	const tlsServerFor = (target, registered) => {
		const key = `${target.hostname}:${target.port}`;
		let context = registered.tlsServers.get(key);
		if (!context) {
			context = certificates.createContext({
				hostname: target.hostname,
				isActive: registered.isActive,
				createServer: (leaf) => {
					const handleRequest = (request, response, upgrade) => {
						const parsed = parseRequestTarget(request, response, `https://${target.hostname}${target.port === 443 ? "" : `:${target.port}`}`);
						if (parsed) forwardRequest({
							request,
							response,
							...parsed,
							registered,
							upgrade
						});
					};
					const httpServer = createServer$1(handleRequest).on("upgrade", (request, _socket, head) => handleUpgradeRequest(handleRequest, request, head));
					const tlsServer = createServer$3(leaf).on("secureConnection", (socket) => {
						ownResource(registered, socket);
						httpServer.emit("connection", socket);
					});
					tlsServer.on("tlsClientError", (_error, socket) => socket.destroy());
					return {
						acceptConnection: (socket) => tlsServer.emit("connection", socket),
						close: () => {
							tlsServer.close();
							httpServer.close();
						},
						setSecureContext: (options) => tlsServer.setSecureContext(options)
					};
				}
			});
			registered.tlsServers.set(key, context);
		}
		return context.get();
	};
	const handleProxyRequest = (request, response, upgrade) => {
		const parsed = parseRequestTarget(request, response);
		if (!parsed) return;
		const { host } = parsed;
		const authorization = authorize(request.headers);
		if (typeof authorization === "string") {
			audit({
				kind: "refused",
				host,
				substituted: false,
				reason: authorization
			});
			response.writeHead(407, {
				"Proxy-Authenticate": `Basic realm="${PROXY_AUTH_REALM}"`,
				Connection: "close",
				"Content-Length": Buffer.byteLength(REFUSAL_BODY),
				"Content-Type": "text/plain; charset=utf-8"
			});
			response.end(REFUSAL_BODY);
			request.resume();
			return;
		}
		forwardRequest({
			request,
			response,
			...parsed,
			registered: authorization,
			upgrade
		});
	};
	const proxy = createServer$1(handleProxyRequest).on("upgrade", (request, _socket, head) => handleUpgradeRequest(handleProxyRequest, request, head));
	proxy.on("connection", (socket) => {
		sockets.add(socket);
		socket.once("close", () => sockets.delete(socket));
		socket.on("error", () => {
			socket.destroy();
		});
	});
	proxy.on("connect", (request, clientSocket, head) => {
		(async () => {
			let target;
			try {
				target = parseConnectTarget(request.url);
			} catch {
				audit({
					kind: "refused",
					host: "unknown",
					substituted: false,
					reason: "upstream-error"
				});
				clientSocket.end("HTTP/1.1 400 Bad Request\r\nConnection: close\r\n\r\n");
				return;
			}
			const authorization = authorize(request.headers);
			if (typeof authorization === "string") {
				audit({
					kind: "refused",
					host: target.hostname,
					substituted: false,
					reason: authorization
				});
				sendProxyAuthRequired(clientSocket);
				return;
			}
			ownResource(authorization, clientSocket);
			if (bypassHosts.has(target.hostname)) {
				const upstream = ownResource(authorization, net.connect(target.port, target.hostname, () => {
					if (!authorization.isActive() || clientSocket.destroyed) {
						upstream.destroy();
						return;
					}
					clientSocket.write("HTTP/1.1 200 Connection Established\r\n\r\n");
					if (head.length > 0) upstream.write(head);
					clientSocket.pipe(upstream).pipe(clientSocket);
					audit({
						kind: "forwarded",
						host: target.hostname,
						substituted: false,
						reason: "bypass"
					});
				}));
				clientSocket.once("close", () => upstream.destroy());
				upstream.once("close", () => clientSocket.destroy());
				upstream.once("error", () => clientSocket.destroy());
				return;
			}
			if (!hostAllowed(target.hostname, authorization)) {
				const body = hostNotAllowedBody(target.hostname);
				audit({
					kind: "refused",
					host: target.hostname,
					substituted: false,
					reason: "host-not-allowed"
				});
				clientSocket.end(`HTTP/1.1 403 Forbidden\r\nConnection: close\r\nContent-Length: ${Buffer.byteLength(body)}\r\nContent-Type: text/plain; charset=utf-8\r\n\r\n${body}`);
				return;
			}
			try {
				const tlsServer = await tlsServerFor(target, authorization);
				if (!tlsServer || !authorization.isActive() || clientSocket.destroyed) {
					clientSocket.destroy();
					return;
				}
				clientSocket.write("HTTP/1.1 200 Connection Established\r\n\r\n");
				if (head.length > 0) clientSocket.unshift(head);
				tlsServer.acceptConnection(clientSocket);
			} catch (error) {
				if (!authorization.isActive() || clientSocket.destroyed) return;
				audit({
					kind: "refused",
					host: target.hostname,
					substituted: false,
					reason: "certificate-error"
				});
				const body = `${error instanceof SecretEgressCertificateError ? error.message : "Secret egress TLS certificate unavailable. Check Gateway logs, then retry."}\n`;
				clientSocket.end(`HTTP/1.1 502 Bad Gateway\r\nConnection: close\r\nContent-Type: text/plain; charset=utf-8\r\nContent-Length: ${Buffer.byteLength(body)}\r\n\r\n${body}`);
			}
		})();
	});
	await new Promise((resolve, reject) => {
		proxy.once("error", reject);
		proxy.listen(0, "127.0.0.1", () => {
			proxy.off("error", reject);
			resolve();
		});
	});
	const address = proxy.address();
	if (!address || typeof address === "string") throw new Error("Secret egress proxy failed to bind loopback");
	const proxyOrigin = `http://127.0.0.1:${address.port}`;
	return {
		caCertPath: certificates.caCertPath,
		proxyOrigin,
		getCertificateStatus: certificates.getStatus,
		registerProcess: (bindings = []) => {
			if (stopped) throw new Error("Secret egress proxy has stopped");
			const registered = {
				sentinelBindings: new Map(bindings.map((binding) => [binding.sentinel, {
					allowedHosts: new Set(binding.allowedHosts.map(normalizeExactAllowedHost)),
					name: binding.name
				}])),
				token: randomBytes(32),
				isActive: () => !stopped && registrations.has(registered),
				resources: /* @__PURE__ */ new Set(),
				tlsServers: /* @__PURE__ */ new Map()
			};
			registrations.add(registered);
			const token = registered.token.toString("base64url");
			const proxyUrl = `http://${PROXY_AUTH_USERNAME}:${token}@127.0.0.1:${address.port}`;
			return {
				env: {
					HTTPS_PROXY: proxyUrl,
					HTTP_PROXY: proxyUrl,
					NODE_USE_ENV_PROXY: "1",
					NODE_EXTRA_CA_CERTS: trustBundlePath,
					SSL_CERT_FILE: trustBundlePath,
					CURL_CA_BUNDLE: trustBundlePath,
					REQUESTS_CA_BUNDLE: trustBundlePath,
					GIT_SSL_CAINFO: trustBundlePath
				},
				revoke: () => revokeRegistration(registered)
			};
		},
		stop: () => {
			if (stopPromise) return stopPromise;
			stopped = true;
			for (const registered of registrations.values()) revokeRegistration(registered);
			upstreamTlsAgent.destroy();
			for (const socket of sockets) socket.destroy();
			sockets.clear();
			stopPromise = Promise.all([new Promise((resolve) => {
				proxy.close(() => resolve());
			}), certificates.waitForPreparations()]).then(() => {});
			return stopPromise;
		}
	};
}
//#endregion
//#region src/secrets/egress-proxy/runtime.ts
const log = createSubsystemLogger("secrets/egress-proxy");
const SECRET_EGRESS_PROXY_DIR_MODE = 448;
function removeProxyDirBestEffort(proxyDir) {
	try {
		fs.rmSync(proxyDir, {
			recursive: true,
			force: true
		});
		fs.rmdirSync(path.dirname(proxyDir));
	} catch {}
}
function removeStaleProxyDirs(parentDir) {
	for (const entry of fs.readdirSync(parentDir, { withFileTypes: true })) if (entry.isDirectory() && entry.name.startsWith("gateway-")) fs.rmSync(path.join(parentDir, entry.name), {
		recursive: true,
		force: true
	});
}
/** Starts the process-local proxy and registers it as the current Gateway owner. */
async function startGatewaySecretEgressProxy(params) {
	const parentDir = path.join(resolveStateDir(), "secret-egress-proxy");
	fs.mkdirSync(parentDir, {
		recursive: true,
		mode: SECRET_EGRESS_PROXY_DIR_MODE
	});
	fs.chmodSync(parentDir, SECRET_EGRESS_PROXY_DIR_MODE);
	removeStaleProxyDirs(parentDir);
	const proxyDir = fs.mkdtempSync(path.join(parentDir, "gateway-"));
	fs.chmodSync(proxyDir, SECRET_EGRESS_PROXY_DIR_MODE);
	let proxy;
	try {
		proxy = await startSecretEgressProxyServer({
			caDir: proxyDir,
			...params.allowedHosts !== void 0 ? { allowedHosts: params.allowedHosts } : {},
			...params.bypassHosts ? { bypassHosts: params.bypassHosts } : {},
			onAudit: (event) => {
				if (event.reason === "certificate-error") log.warn("secret egress TLS certificate unavailable; check OpenSSL and the system clock, then retry", event);
				else log.info("secret egress request", event);
			}
		});
		const ownedProxy = proxy;
		const cleanupOnProcessExit = () => removeProxyDirBestEffort(proxyDir);
		process.once("exit", cleanupOnProcessExit);
		const handle = {
			...ownedProxy,
			stop: async () => {
				clearSecretEgressProxy(handle);
				process.off("exit", cleanupOnProcessExit);
				try {
					await ownedProxy.stop();
				} finally {
					removeProxyDirBestEffort(proxyDir);
				}
			}
		};
		publishSecretEgressProxy(handle);
		return handle;
	} catch (error) {
		await proxy?.stop().catch(() => void 0);
		removeProxyDirBestEffort(proxyDir);
		throw error;
	}
}
//#endregion
export { startGatewaySecretEgressProxy };
