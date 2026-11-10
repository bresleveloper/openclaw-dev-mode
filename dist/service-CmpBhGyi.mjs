import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { t as containsAsciiControlCharacter } from "./string-normalization-D6DKCpwE.mjs";
import "./string-coerce-runtime-BbIJhy7G.mjs";
import { t as GatewayControlUiIngressError } from "./gateway-ingress.types-Bor6uDqj.mjs";
import { t as WebSocket } from "./websocket-runtime-jKgLhX3s.mjs";
import { a as createPairingCode, c as relayResponseError, i as codeHash, l as safeError, n as RelayError, r as capResult, s as readGrantCreation } from "./protocol-BGPlkY3T.mjs";
import { n as ownsGrant } from "./caller-DU1i5s6-.mjs";
import { randomBytes, randomUUID } from "node:crypto";
//#region extensions/mcp-relay/src/consent.ts
var RelayConsent = class {
	#options;
	constructor(options) {
		this.#options = options;
	}
	async validateAuthority(authority, assertCurrent) {
		assertCurrent();
		const config = this.#options.config();
		if (authority.principal.kind === "owner" && (config.gateway?.roles || config.gateway?.auth?.mode === "trusted-proxy")) throw new RelayError("unavailable", "This Gateway requires a person-bound grant. Sign in and pair again from the Connected apps tab.");
		await (await this.#options.controlUiIngress.bindPrincipal({
			audienceId: `consent:${randomUUID()}`,
			principal: authority.principal,
			operatorScopeCeiling: authority.ceiling,
			signal: this.#options.scheduler.signal,
			assertCurrent
		})).close();
		assertCurrent();
	}
	async describe(requestId, assertCurrent) {
		assertCurrent();
		const result = await this.#options.request("authorize.describe", { requestId });
		assertCurrent();
		if (!isRecord(result) || result.kind !== "oauth" && result.kind !== "link" || typeof result.clientName !== "string" || !result.clientName || result.clientName.length > 2e3 || typeof result.redirectHost !== "string" || !result.redirectHost || result.redirectHost.length > 2e3 || typeof result.expiresAt !== "number" || !Number.isSafeInteger(result.expiresAt) || result.expiresAt <= this.#options.scheduler.now()) throw new RelayError("not_found", "This connection request is invalid or expired. Start connecting again.");
		return {
			kind: result.kind,
			clientName: result.clientName,
			redirectHost: result.redirectHost,
			expiresAt: result.expiresAt,
			relayUrl: this.#options.relayUrl
		};
	}
	#continueUrl(requestId) {
		const url = new URL("/oauth/continue", this.#options.relayUrl);
		url.searchParams.set("request", requestId);
		return url.href;
	}
	async approve(requestId, authority, assertCurrent) {
		const details = await this.describe(requestId, assertCurrent);
		await this.validateAuthority(authority, assertCurrent);
		const grantId = `gr_${randomBytes(32).toString("base64url")}`;
		const assertApprovalCurrent = () => {
			assertCurrent();
			this.#options.requireReady();
			if (this.#options.scheduler.now() >= details.expiresAt) throw new RelayError("not_found", "This connection request expired. Start connecting again.");
		};
		assertApprovalCurrent();
		await this.#options.state.approveGrant({
			grantId,
			clientId: requestId,
			clientName: details.clientName,
			createdAt: this.#options.scheduler.now(),
			...authority
		}, assertApprovalCurrent);
		try {
			assertApprovalCurrent();
			await this.#options.request("authorize.approve", {
				requestId,
				grantId,
				principal: authority.principal.kind,
				principalLabel: authority.principalLabel ?? (authority.principal.kind === "owner" ? "Gateway owner" : "Gateway user"),
				ceiling: authority.ceiling
			});
			assertApprovalCurrent();
			this.#options.state.assertGrantCurrent(grantId);
		} catch (error) {
			await this.#options.revoke(grantId);
			throw error;
		}
		return { continueUrl: this.#continueUrl(requestId) };
	}
	async deny(requestId, assertCurrent) {
		await this.describe(requestId, assertCurrent);
		assertCurrent();
		await this.#options.request("authorize.deny", { requestId });
		assertCurrent();
		return { continueUrl: this.#continueUrl(requestId) };
	}
};
//#endregion
//#region extensions/mcp-relay/src/grant-bindings.ts
function isRetiredBindingError(error) {
	return error instanceof GatewayControlUiIngressError && (error.code === "closed" || error.code === "forbidden" || error.code === "unsupported-auth");
}
/** The relay connection owns one principal resolution shared by each grant's UI and RPC. */
var GrantBindings = class {
	#bindings = /* @__PURE__ */ new Map();
	constructor(factory, state, signal) {
		this.factory = factory;
		this.state = state;
		this.signal = signal;
	}
	async get(grantId) {
		this.signal.throwIfAborted();
		const grant = this.state.getGrant(grantId);
		if (!grant) throw new RelayError("grant_revoked", "This app was disconnected. Connect it again from Connected apps.");
		const existing = this.#bindings.get(grantId);
		if (existing) return existing;
		const pending = this.factory.bindPrincipal({
			audienceId: grantId,
			principal: grant.principal,
			operatorScopeCeiling: grant.ceiling,
			signal: this.signal,
			assertCurrent: () => {
				this.signal.throwIfAborted();
				this.state.assertGrantCurrent(grantId);
			}
		});
		this.#bindings.set(grantId, pending);
		pending.catch(() => {
			if (this.#bindings.get(grantId) === pending) this.#bindings.delete(grantId);
		});
		return pending;
	}
	async revoke(grantId) {
		const pending = this.#bindings.get(grantId);
		this.#bindings.delete(grantId);
		await pending?.then((binding) => binding.close(), () => void 0);
	}
	async close() {
		await Promise.all(Array.from(this.#bindings.keys(), (id) => this.revoke(id)));
	}
};
//#endregion
//#region extensions/mcp-relay/src/ui-tunnel-protocol.ts
const UI_CHUNK_BYTES = 524288;
var UiTunnelError = class extends Error {
	constructor(code, message) {
		super(message);
		this.code = code;
	}
};
function uiError(error) {
	if (error instanceof UiTunnelError) return error;
	if (error instanceof RelayError && error.code === "grant_revoked") return {
		code: "grant_revoked",
		message: error.message
	};
	if (error instanceof GatewayControlUiIngressError) return {
		code: error.code === "invalid-options" ? "invalid" : error.code === "limit-exceeded" ? "limit_exceeded" : error.code === "forbidden" ? "forbidden" : "unavailable",
		message: error.message
	};
	return {
		code: "unavailable",
		message: "The Control UI connection failed. Open OpenClaw from ChatGPT again."
	};
}
function invalid(message = "Invalid Control UI tunnel frame.") {
	throw new UiTunnelError("invalid", message);
}
function exactHttpsOrigin(value) {
	if (typeof value !== "string") return invalid("Supply an exact HTTPS origin.");
	let origin;
	try {
		origin = new URL(value);
	} catch {
		return invalid("Supply an exact HTTPS origin.");
	}
	if (origin.protocol !== "https:" || origin.origin !== value || origin.username || origin.password) return invalid("Supply an exact HTTPS origin.");
	return value;
}
function localPath(value) {
	if (typeof value !== "string" || !value.startsWith("/") || value.startsWith("//") || /[\\\r\n#]/.test(value)) return invalid("Supply an absolute local path and query.");
	return value;
}
function chunkBytes(value) {
	if (typeof value !== "string" || value.length > Math.ceil(524288 / 3) * 4) return invalid("Supply a base64 chunk of at most 512 KiB.");
	const bytes = Buffer.from(value, "base64");
	if (bytes.length > 524288 || bytes.toString("base64") !== value) return invalid("Supply a canonical base64 chunk of at most 512 KiB.");
	return bytes;
}
function moreFlag(value) {
	if (typeof value !== "boolean") return invalid("Supply the chunk's more flag.");
	return value;
}
const HOP = /* @__PURE__ */ new Set([
	"connection",
	"upgrade",
	"keep-alive",
	"te",
	"trailer",
	"transfer-encoding",
	"proxy-authenticate",
	"proxy-authorization"
]);
function tunnelHeaders(rawHeaders, direction) {
	if (!Array.isArray(rawHeaders)) return invalid("Supply a list of header pairs.");
	const headers = [];
	const nominated = /* @__PURE__ */ new Set();
	for (const pair of rawHeaders) {
		if (!Array.isArray(pair) || pair.length !== 2 || typeof pair[0] !== "string" || typeof pair[1] !== "string" || !/^[!#$%&'*+.^_`|~0-9A-Za-z-]+$/.test(pair[0]) || /[\r\n\0]/.test(pair[1])) return invalid("Supply valid HTTP header pairs.");
		const name = pair[0].toLowerCase();
		if (name === "connection") for (const token of pair[1].split(",")) nominated.add(token.trim().toLowerCase());
		headers.push([name, pair[1]]);
	}
	const filtered = [];
	for (const [name, value] of headers) {
		if (HOP.has(name) || nominated.has(name) || name === "content-length") continue;
		if (direction === "request") {
			if ([
				"host",
				"forwarded",
				"x-real-ip",
				"true-client-ip",
				"cdn-loop"
			].includes(name) || /^(proxy-|x-forwarded-|cf-|x-relay-)/.test(name)) continue;
			if (name === "cookie") {
				const cookies = value.split(";").map((cookie) => cookie.trim()).filter((cookie) => cookie.split("=", 1)[0]?.trim() !== "__Host-oc_ui").join("; ");
				if (cookies) filtered.push([name, cookies]);
				continue;
			}
		} else if ([
			"set-cookie",
			"service-worker-allowed",
			"clear-site-data",
			"referrer-policy",
			"origin-agent-cluster"
		].includes(name)) continue;
		filtered.push([name, value]);
	}
	if (direction === "response") filtered.push(["referrer-policy", "no-referrer"], ["origin-agent-cluster", "?1"]);
	return filtered;
}
function tunnelCookies(cookies) {
	return cookies.map(({ name, value, path, maxAgeSeconds }) => {
		if (name === "__Host-oc_ui" || !/^[!#$%&'*+.^_`|~0-9A-Za-z-]+$/.test(name) || !/^[\x21\x23-\x2B\x2D-\x3A\x3C-\x5B\x5D-\x7E]*$/.test(value) || !path.startsWith("/") || path.startsWith("//") || /[;\\ ]/.test(path) || containsAsciiControlCharacter(path) || !Number.isSafeInteger(maxAgeSeconds) || maxAgeSeconds < 0) throw new UiTunnelError("invalid", "The Gateway returned an invalid Control UI read cookie.");
		return {
			name,
			value,
			path,
			maxAgeSeconds
		};
	});
}
function* textFrames(sid, text) {
	if (/[\uD800-\uDFFF]/u.test(text)) invalid("WebSocket text must contain complete Unicode characters.");
	let offset = 0;
	do {
		let end = Math.min(text.length, offset + UI_CHUNK_BYTES);
		const fit = () => {
			if (end < text.length && /[\uD800-\uDBFF]/.test(text[end - 1] ?? "")) end--;
			return {
				type: "ui.ws.msg",
				sid,
				text: text.slice(offset, end),
				more: end < text.length
			};
		};
		let frame = fit();
		while (Buffer.byteLength(frame.text) > 524288 || Buffer.byteLength(JSON.stringify(frame)) > 1048576) {
			end = offset + Math.floor((end - offset) / 2);
			frame = fit();
		}
		yield frame;
		offset = end;
	} while (offset < text.length);
}
function closeInfo(frame) {
	const { code, reason } = frame;
	if (typeof code !== "number" || !Number.isInteger(code) || !(code >= 1e3 && code <= 1014 && ![
		1004,
		1005,
		1006
	].includes(code) || code >= 3e3 && code <= 4999) || typeof reason !== "string" || /[\uD800-\uDFFF]/u.test(reason) || Buffer.byteLength(reason) > 123) return invalid("Supply a valid WebSocket close code and reason.");
	return {
		code,
		reason
	};
}
function readUiFrameAncestors(ui) {
	if (ui === void 0) return;
	if (!isRecord(ui) || !Array.isArray(ui.frameAncestors) || !ui.frameAncestors.every((value) => typeof value === "string" && value.length > 0) || ui.frameAncestors.length > 16 || ui.frameAncestors.join(" ").length > 4096) throw new RelayError("invalid_params", "Invalid UI capability");
	return ui.frameAncestors;
}
//#endregion
//#region extensions/mcp-relay/src/ui-tunnel-body.ts
var UiRequestBody = class {
	#controller;
	#receivedBytes = 0;
	#ended = false;
	#hasBody = false;
	constructor() {
		let controller;
		this.stream = new ReadableStream({
			start: (value) => {
				controller = value;
			},
			cancel: () => {
				this.#ended = true;
			}
		});
		this.#controller = controller;
	}
	get hasBody() {
		return this.#hasBody;
	}
	push(bytes, more) {
		if (this.#ended) throw new UiTunnelError("invalid", "The HTTP request body is already complete.");
		this.#receivedBytes += bytes.byteLength;
		if (this.#receivedBytes > 104857600) throw new UiTunnelError("limit_exceeded", "HTTP request bodies must not exceed 100 MiB.");
		this.#hasBody ||= bytes.byteLength > 0 || more;
		if (bytes.byteLength) this.#controller.enqueue(bytes);
		if (!more) {
			this.#ended = true;
			this.#controller.close();
		}
	}
	discard(error) {
		if (!this.#ended) {
			this.#ended = true;
			this.#controller.error(error);
		}
	}
};
//#endregion
//#region extensions/mcp-relay/src/ui-tunnel.ts
var UiTunnel = class {
	#options;
	#grants = /* @__PURE__ */ new Map();
	#streams = /* @__PURE__ */ new Map();
	#stopping;
	constructor(options) {
		this.#options = options;
		options.scheduler.signal.addEventListener("abort", () => void this.close(), { once: true });
	}
	receive(frame) {
		if (this.#stopping || this.#options.scheduler.signal.aborted) return;
		const sid = frame.sid;
		if (typeof sid !== "string" || !/^[A-Za-z0-9_-]{8,64}$/.test(sid)) {
			this.#options.closeRelay();
			return;
		}
		try {
			if (frame.type === "ui.http" || frame.type === "ui.ws.open") {
				if (this.#streams.has(sid)) invalid("The Control UI stream ID is already in use.");
				const kind = frame.type === "ui.http" ? "http" : "ws";
				const grant = this.#grant(frame);
				if (kind === "http") this.#http(sid, grant, frame);
				else this.#webSocket(sid, grant, frame);
				return;
			}
			const stream = this.#streams.get(sid);
			if (!stream) {
				if (frame.type !== "ui.cancel" && frame.type !== "ui.ws.close") invalid("Unknown Control UI stream.");
				return;
			}
			this.#assert(stream);
			switch (frame.type) {
				case "ui.http.body":
					if (stream.kind !== "http") invalid();
					stream.input.push(chunkBytes(frame.b64), moreFlag(frame.more));
					break;
				case "ui.cancel":
					if (stream.kind !== "http") invalid();
					this.#finish(stream);
					break;
				case "ui.ws.msg":
					if (stream.kind !== "ws" || !stream.socket) invalid("The Control UI socket is not open.");
					this.#message(stream, frame);
					break;
				case "ui.ws.close": {
					if (stream.kind !== "ws") invalid();
					const { code, reason } = closeInfo(frame);
					stream.socket?.close(code, reason);
					this.#finish(stream);
					break;
				}
				default: invalid();
			}
		} catch (error) {
			this.#fail(sid, error);
		}
	}
	revoke(grantId) {
		this.retire(grantId, new UiTunnelError("grant_revoked", "This connection was revoked. Pair OpenClaw again to reconnect."));
	}
	retire(grantId, error) {
		const grant = this.#grants.get(grantId);
		if (grant) this.#retire(grant, error);
	}
	close() {
		this.#stopping ??= Promise.resolve().then(async () => {
			for (const stream of this.#streams.values()) this.#finish(stream);
			await Promise.all(Array.from(this.#grants.values(), (grant) => this.#retire(grant)));
		});
		return this.#stopping;
	}
	#assert(stream) {
		if (this.#stopping || this.#options.scheduler.signal.aborted || this.#grants.get(stream.grant.id) !== stream.grant || this.#streams.get(stream.sid) !== stream) throw new UiTunnelError("unavailable", "The Control UI stream has closed.");
		this.#options.assertGrantCurrent(stream.grant.id);
	}
	#grant(frame) {
		if (typeof frame.grantId !== "string" || !frame.grantId || frame.grantId.length > 200) invalid("Supply a valid grant ID.");
		this.#options.assertGrantCurrent(frame.grantId);
		const publicOrigin = exactHttpsOrigin(frame.publicOrigin);
		const sandboxOrigin = exactHttpsOrigin(frame.sandboxOrigin);
		if (publicOrigin === sandboxOrigin) invalid("Control UI and sandbox origins must be distinct.");
		const existing = this.#grants.get(frame.grantId);
		if (existing?.publicOrigin === publicOrigin && existing.sandboxOrigin === sandboxOrigin) return existing;
		if (existing) this.#retire(existing, new UiTunnelError("unavailable", "The relay changed the Control UI origins. Open OpenClaw from ChatGPT again."));
		const grant = {
			id: frame.grantId,
			publicOrigin,
			sandboxOrigin,
			handle: this.#options.open(frame.grantId, {
				publicOrigin,
				sandboxOrigin,
				frameAncestors: this.#options.frameAncestors
			})
		};
		this.#grants.set(grant.id, grant);
		grant.handle.catch((error) => {
			if (this.#grants.get(grant.id) === grant) {
				this.#grants.delete(grant.id);
				if (isRetiredBindingError(error)) this.#options.retireBinding?.(grant.id);
			}
		});
		return grant;
	}
	async #retire(grant, error) {
		if (this.#grants.get(grant.id) === grant) this.#grants.delete(grant.id);
		for (const stream of this.#streams.values()) if (stream.grant === grant) {
			if (error) this.#fail(stream.sid, error);
			else this.#finish(stream);
		}
		await grant.handle.then((handle) => handle.close(), () => void 0);
	}
	#fail(sid, error) {
		let cause = error;
		const stream = this.#streams.get(sid);
		if (stream && this.#grants.get(stream.grant.id) === stream.grant && isRetiredBindingError(error)) {
			this.#options.retireBinding?.(stream.grant.id);
			this.#retire(stream.grant, error);
			return;
		}
		if (stream) try {
			this.#options.assertGrantCurrent(stream.grant.id);
		} catch (authorityError) {
			cause = authorityError;
		}
		const failure = uiError(cause);
		if (stream) this.#finish(stream, failure.code === "forbidden" || failure.code === "grant_revoked" ? 1008 : 1011);
		if (!this.#stopping && !this.#options.scheduler.signal.aborted) try {
			this.#options.send({
				type: "ui.error",
				sid,
				code: failure.code,
				message: failure.message
			});
		} catch {
			this.#options.closeRelay();
		}
	}
	#finish(stream, code = 1e3) {
		if (this.#streams.get(stream.sid) !== stream) return;
		this.#streams.delete(stream.sid);
		stream.abort.abort();
		if (stream.kind === "http") {
			stream.input.discard(/* @__PURE__ */ new Error("Control UI request closed"));
			stream.reader?.cancel().catch(() => void 0);
		} else {
			stream.socket?.close(code, code === 1e3 ? "" : "Control UI tunnel closed");
			stream.partial = void 0;
		}
	}
	#run(stream, run) {
		run().catch((error) => {
			if (this.#streams.get(stream.sid) === stream) this.#fail(stream.sid, error);
		});
	}
	#http(sid, grant, frame) {
		if (frame.surface !== "control-ui" && frame.surface !== "sandbox") invalid("Supply a valid Control UI surface.");
		if (typeof frame.method !== "string" || !/^[A-Z]+$/.test(frame.method)) invalid("Supply an HTTP method.");
		const surface = frame.surface;
		const method = frame.method;
		const pathAndQuery = localPath(frame.path);
		const headers = tunnelHeaders(frame.headers, "request");
		const stream = {
			kind: "http",
			sid,
			grant,
			abort: new AbortController(),
			input: new UiRequestBody()
		};
		this.#streams.set(sid, stream);
		stream.input.push(chunkBytes(frame.b64), moreFlag(frame.more));
		this.#run(stream, async () => {
			const handle = await grant.handle;
			this.#assert(stream);
			const { response, pluginReadCookies } = await handle.request({
				surface,
				method,
				pathAndQuery,
				headers,
				...stream.input.hasBody ? { body: stream.input.stream } : {},
				signal: stream.abort.signal
			});
			stream.reader = response.body?.getReader();
			this.#assert(stream);
			this.#options.send({
				type: "ui.http.head",
				sid,
				status: response.status,
				headers: tunnelHeaders(Array.from(response.headers), "response"),
				cookies: tunnelCookies(pluginReadCookies)
			});
			if (stream.reader) for (;;) {
				const { done, value } = await stream.reader.read();
				this.#assert(stream);
				if (done) break;
				for (let offset = 0; offset < value.byteLength; offset += UI_CHUNK_BYTES) this.#options.send({
					type: "ui.http.body",
					sid,
					b64: Buffer.from(value.subarray(offset, offset + UI_CHUNK_BYTES)).toString("base64"),
					more: true
				});
			}
			this.#assert(stream);
			this.#options.send({
				type: "ui.http.body",
				sid,
				b64: "",
				more: false
			});
			this.#finish(stream);
		});
	}
	#webSocket(sid, grant, frame) {
		const pathAndQuery = localPath(frame.path);
		if (frame.origin === grant.sandboxOrigin) throw new UiTunnelError("forbidden", "Sandbox WebSockets are not supported by this Gateway.");
		if (frame.origin !== grant.publicOrigin) throw new UiTunnelError("forbidden", "WebSocket Origin does not match the Control UI origin.");
		if (!Array.isArray(frame.protocols) || frame.protocols.some((value) => typeof value !== "string" || !/^[!#$%&'*+.^_`|~0-9A-Za-z-]+$/.test(value))) invalid("Supply valid WebSocket protocols.");
		const protocols = frame.protocols;
		const origin = frame.origin;
		const stream = {
			kind: "ws",
			sid,
			grant,
			abort: new AbortController(),
			sending: Promise.resolve()
		};
		this.#streams.set(sid, stream);
		this.#run(stream, async () => {
			const handle = await grant.handle;
			this.#assert(stream);
			const { socket, protocol } = await handle.openWebSocket({
				pathAndQuery,
				origin,
				protocols,
				signal: stream.abort.signal
			});
			stream.socket = socket;
			this.#assert(stream);
			if (protocol && !protocols.includes(protocol)) throw new UiTunnelError("invalid", "The Gateway selected an unoffered WebSocket protocol.");
			this.#options.send({
				type: "ui.ws.opened",
				sid,
				...protocol ? { protocol } : {}
			});
			const drain = async () => {
				for await (const message of socket.messages) {
					this.#assert(stream);
					if (message.kind === "text") for (const chunk of textFrames(sid, message.text)) this.#options.send(chunk);
					else for (let offset = 0; offset < Math.max(1, message.bytes.byteLength); offset += UI_CHUNK_BYTES) this.#options.send({
						type: "ui.ws.msg",
						sid,
						b64: Buffer.from(message.bytes.subarray(offset, offset + UI_CHUNK_BYTES)).toString("base64"),
						more: offset + UI_CHUNK_BYTES < message.bytes.byteLength
					});
				}
			};
			const [, closed] = await Promise.all([drain(), socket.closed]);
			this.#assert(stream);
			this.#options.send({
				type: "ui.ws.close",
				sid,
				code: closed.code,
				reason: closed.reason
			});
			this.#finish(stream);
		});
	}
	#message(stream, frame) {
		const more = moreFlag(frame.more);
		const text = typeof frame.text === "string";
		if (text === (typeof frame.b64 === "string")) invalid("Supply either text or base64 WebSocket data.");
		let bytes;
		if (text) {
			if (typeof frame.text !== "string" || /[\uD800-\uDFFF]/u.test(frame.text) || Buffer.byteLength(frame.text) > 524288) invalid("Supply a complete Unicode text chunk of at most 512 KiB.");
			bytes = Buffer.from(frame.text);
		} else bytes = chunkBytes(frame.b64);
		const kind = text ? "text" : "binary";
		if (stream.partial && stream.partial.kind !== kind) invalid("WebSocket fragments must use the same data type.");
		const length = (stream.partial?.length ?? 0) + bytes.byteLength;
		const maxBytes = 26214400;
		if (length > maxBytes) throw new UiTunnelError("limit_exceeded", "WebSocket messages must not exceed 25 MiB.");
		const partial = stream.partial ?? {
			kind,
			bytes,
			length
		};
		if (stream.partial) {
			if (length > partial.bytes.byteLength) {
				const grown = Buffer.allocUnsafe(Math.min(maxBytes, Math.max(length, partial.bytes.byteLength * 2)));
				partial.bytes.copy(grown, 0, 0, partial.length);
				partial.bytes = grown;
			}
			bytes.copy(partial.bytes, partial.length);
			partial.length = length;
		}
		stream.partial = partial;
		if (more) return;
		stream.partial = void 0;
		const complete = partial.bytes.subarray(0, partial.length);
		const message = kind === "text" ? {
			kind,
			text: complete.toString("utf8")
		} : {
			kind,
			bytes: complete
		};
		stream.sending = stream.sending.then(async () => {
			this.#assert(stream);
			await stream.socket?.send(message);
		});
		this.#run(stream, () => stream.sending);
	}
};
//#endregion
//#region extensions/mcp-relay/src/service.ts
var RelayService = class {
	#options;
	#ingress;
	#pending = /* @__PURE__ */ new Map();
	#socket;
	#connection;
	#ready = false;
	#attempt = 0;
	#ui;
	#bindings;
	constructor(options) {
		this.#options = options;
		if (!options.controlUiIngress) throw new RelayError("unavailable", "Update OpenClaw to enable principal-bound MCP and Control UI access.");
		this.#ingress = options.controlUiIngress;
		this.consent = new RelayConsent({
			relayUrl: options.relayUrl,
			request: (operation, params) => this.#request(operation, params),
			revoke: (grantId) => this.revoke(grantId),
			state: options.state,
			scheduler: options.scheduler,
			controlUiIngress: this.#ingress,
			config: options.config,
			requireReady: () => this.#requireReady()
		});
	}
	start() {
		this.#options.scheduler.schedule({
			id: "connect",
			delayMs: 0,
			run: () => this.#connect()
		});
	}
	async stop() {
		this.#ready = false;
		this.#rejectPending();
		const closing = this.#closeUi();
		this.#options.scheduler.beginClose();
		this.#socket?.terminate();
		this.#socket = void 0;
		await closing;
		await this.#options.scheduler.stop();
	}
	async status() {
		const grants = await this.#options.state.grants();
		return {
			connected: this.#ready,
			gatewayId: this.#options.identity.gatewayId,
			relayUrl: this.#options.relayUrl,
			grantsCount: grants.length,
			ui: this.#uiStatus()
		};
	}
	#uiStatus() {
		const config = this.#options.config();
		if (!this.#ui) return {
			available: false,
			reason: "Update the MCP relay to support the Control UI tunnel, then reconnect."
		};
		const path = config.gateway?.controlUi?.basePath?.trim().replace(/^\/+|\/+$/gu, "");
		return {
			available: true,
			basePath: path ? `/${path}` : "/"
		};
	}
	async #closeUi() {
		const bindings = this.#bindings;
		const ui = this.#ui;
		this.#bindings = void 0;
		this.#ui = void 0;
		await Promise.allSettled([bindings?.close(), ui?.close()]);
	}
	async grants(caller) {
		const grants = await this.#options.state.grants();
		return {
			grants: caller && !caller.canAdmin ? grants.filter((grant) => ownsGrant(caller, grant)) : grants,
			...caller ? {
				caller,
				relayUrl: this.#options.relayUrl
			} : {}
		};
	}
	async pair(assertCommandCurrent, authority) {
		assertCommandCurrent?.();
		this.#requireReady();
		const selected = authority ?? {
			principal: { kind: "owner" },
			ceiling: ["operator.read", "operator.write"]
		};
		await this.consent.validateAuthority(selected, assertCommandCurrent ?? (() => this.#options.scheduler.signal.throwIfAborted()));
		const code = createPairingCode();
		const expiresAt = this.#options.scheduler.now() + 6e5;
		const hash = codeHash(code);
		await this.#options.state.issue(hash, expiresAt, this.#options.scheduler.now(), assertCommandCurrent, selected);
		assertCommandCurrent?.();
		this.#requireReady();
		await this.#request("pair.offer", {
			codeHash: hash,
			expiresAt,
			principal: selected.principal.kind,
			...selected.principalLabel ? { principalLabel: selected.principalLabel } : {},
			ceiling: selected.ceiling
		});
		assertCommandCurrent?.();
		this.#requireReady();
		return {
			code,
			expiresAt,
			mcpUrl: new URL("/mcp", this.#options.relayUrl).href
		};
	}
	async revoke(grantId, assertCommandCurrent) {
		assertCommandCurrent?.();
		if (!await this.#options.state.revoke(grantId, assertCommandCurrent)) throw new RelayError("not_found", "Grant not found. Run openclaw mcp-relay grants and use a listed grant ID.");
		this.#ui?.revoke(grantId);
		await this.#bindings?.revoke(grantId);
		if (!this.#ready) return {
			revoked: true,
			relayNotified: false
		};
		try {
			await this.#request("grant.revoke", { grantId });
			return {
				revoked: true,
				relayNotified: true
			};
		} catch {
			return {
				revoked: true,
				relayNotified: false
			};
		}
	}
	#requireReady() {
		if (!this.#ready || !this.#socket) throw new RelayError("unavailable", "The relay is disconnected. Check openclaw mcp-relay status, then try again.");
	}
	#connect() {
		const { relayUrl, identity, scheduler, socketFactory } = this.#options;
		const url = new URL("/v1/gateway/connect", relayUrl);
		url.protocol = url.protocol === "https:" ? "wss:" : "ws:";
		url.searchParams.set("key", identity.publicKey);
		const connection = scheduler.scope();
		this.#connection = connection;
		let socket;
		try {
			socket = (socketFactory ?? ((address) => new WebSocket(address, {
				maxPayload: 1048576,
				followRedirects: false
			})))(url.href);
		} catch {
			connection.stop();
			this.#retry(0);
			return;
		}
		this.#socket = socket;
		const bindings = new GrantBindings(this.#ingress, this.#options.state, connection.signal);
		this.#bindings = bindings;
		let helloSent = false;
		const current = () => !scheduler.signal.aborted && !connection.signal.aborted && this.#socket === socket;
		const assertConnectionCurrent = () => {
			if (!current()) throw new RelayError("unavailable", "The relay disconnected. Check openclaw mcp-relay status and try again.");
		};
		const sendControlFrame = (frame) => {
			try {
				this.#send(socket, frame);
			} catch {
				socket.terminate();
			}
		};
		const armPongDeadline = () => connection.schedule({
			id: "pong-deadline",
			delayMs: 6e4,
			run: () => {
				if (current()) {
					socket.close(1001, "Relay keepalive timed out");
					socket.terminate();
				}
			}
		});
		connection.schedule({
			id: "handshake",
			delayMs: 1e4,
			run: () => {
				if (current() && !this.#ready) {
					socket.close(4400, "Handshake timed out");
					socket.terminate();
				}
			}
		});
		socket.on("error", () => {
			if (current()) socket.terminate();
		});
		socket.on("close", (code) => {
			if (this.#socket !== socket) return;
			this.#ready = false;
			this.#socket = void 0;
			this.#rejectPending();
			this.#closeUi();
			connection.stop();
			this.#connection = void 0;
			if (!scheduler.signal.aborted) this.#retry(code);
		});
		socket.on("message", (data, binary) => {
			if (!current()) return;
			const bytes = Array.isArray(data) ? Buffer.concat(data) : Buffer.isBuffer(data) ? data : Buffer.from(data);
			if (binary) {
				socket.close(4400, "Text frames required");
				return;
			}
			let frame;
			try {
				frame = JSON.parse(bytes.toString("utf8"));
			} catch {
				socket.close(4400, "Invalid JSON");
				return;
			}
			if (!isRecord(frame)) {
				socket.close(4400, "Invalid frame");
				return;
			}
			if (!this.#ready) {
				if (frame.type === "challenge" && !helloSent && frame.protocol === 1 && frame.relay === new URL(relayUrl).host && typeof frame.nonce === "string" && /^[A-Za-z0-9_-]{43}$/.test(frame.nonce) && Buffer.from(frame.nonce, "base64url").length === 32 && Buffer.from(frame.nonce, "base64url").toString("base64url") === frame.nonce) {
					helloSent = true;
					sendControlFrame({
						type: "hello",
						protocol: 1,
						signature: identity.signChallenge(frame.nonce, frame.relay),
						gateway: this.#options.gateway
					});
				} else if (frame.type === "ready" && helloSent && frame.gatewayId === identity.gatewayId) {
					let frameAncestors;
					try {
						frameAncestors = readUiFrameAncestors(frame.ui);
					} catch {
						socket.close(4400, "Invalid UI capability");
						return;
					}
					if (frameAncestors) this.#ui = new UiTunnel({
						open: async (grantId, presentation) => (await bindings.get(grantId)).openControlUi(presentation),
						frameAncestors,
						retireBinding: (grantId) => void bindings.revoke(grantId),
						scheduler: connection,
						assertGrantCurrent: (grantId) => {
							assertConnectionCurrent();
							this.#options.state.assertGrantCurrent(grantId);
						},
						send: (outgoing) => {
							assertConnectionCurrent();
							this.#send(socket, outgoing);
						},
						closeRelay: () => socket.terminate()
					});
					this.#ready = true;
					this.#attempt = 0;
					armPongDeadline();
					connection.schedule({
						id: "ping",
						delayMs: 3e4,
						everyMs: 3e4,
						run: () => {
							if (current()) sendControlFrame({ type: "ping" });
						}
					});
				} else socket.close(4400, "Invalid handshake");
				return;
			}
			if (frame.type === "pong") {
				armPongDeadline();
				return;
			}
			if (typeof frame.type === "string" && frame.type.startsWith("ui.")) {
				const uiStatus = this.#uiStatus();
				if (this.#ui && uiStatus.available) this.#ui.receive(frame);
				else if (typeof frame.sid === "string" && /^[A-Za-z0-9_-]{8,64}$/.test(frame.sid)) sendControlFrame({
					type: "ui.error",
					sid: frame.sid,
					code: "unavailable",
					message: uiStatus.reason
				});
				else socket.close(4400, "Invalid UI frame");
				return;
			}
			if (frame.type === "res" && typeof frame.id === "string") {
				const pending = this.#pending.get(frame.id);
				if (!pending) return;
				this.#pending.delete(frame.id);
				pending.cancel();
				if (frame.ok === true && isRecord(frame.result)) pending.resolve(frame.result);
				else pending.reject(relayResponseError(frame.error));
				return;
			}
			if (frame.type !== "req" || typeof frame.id !== "string" || frame.id.length > 128 || !frame.id) {
				socket.close(4400, "Invalid request");
				return;
			}
			const id = frame.id;
			const grantId = frame.op !== "grant.create" && frame.op !== "grant.revoked" && typeof frame.grantId === "string" ? frame.grantId : void 0;
			(async () => {
				let response;
				try {
					response = {
						ok: true,
						result: capResult(await this.#handle(frame, assertConnectionCurrent, bindings))
					};
				} catch (error) {
					response = {
						ok: false,
						error: safeError(error)
					};
				}
				if (!current()) return;
				try {
					if (grantId !== void 0) this.#options.state.assertGrantCurrent(grantId);
				} catch (error) {
					response = {
						ok: false,
						error: safeError(error)
					};
				}
				this.#send(socket, {
					type: "res",
					id,
					...response
				});
			})().catch(() => socket.terminate());
		});
	}
	#retry(closeCode) {
		const base = closeCode === 4401 ? 6e4 : Math.min(6e4, 1e3 * 2 ** Math.min(this.#attempt++, 6));
		const delayMs = Math.min(6e4, Math.round(base * (.8 + (this.#options.random ?? Math.random)() * .4)));
		this.#options.scheduler.schedule({
			id: "connect",
			delayMs,
			run: () => this.#connect()
		});
	}
	#send(socket, frame) {
		const text = JSON.stringify(frame);
		if (socket.bufferedAmount + Buffer.byteLength(text) > 33554432) throw new UiTunnelError("limit_exceeded", "The relay send queue exceeded 32 MiB.");
		socket.send(text);
	}
	#request(op, params) {
		this.#requireReady();
		const socket = this.#socket;
		if (!socket || !this.#connection) throw new RelayError("unavailable", "Reconnect the MCP relay and try again.");
		const id = randomUUID();
		const connection = this.#connection;
		return new Promise((resolve, reject) => {
			const timer = connection.schedule({
				id: `timeout:${id}`,
				delayMs: 15e3,
				run: () => {
					this.#pending.delete(id);
					reject(new RelayError("timeout", "The relay did not respond. Check openclaw mcp-relay status before trying again."));
				}
			});
			this.#pending.set(id, {
				resolve,
				reject,
				cancel: timer.cancel
			});
			try {
				this.#send(socket, {
					type: "req",
					id,
					op,
					params
				});
			} catch (error) {
				timer.cancel();
				this.#pending.delete(id);
				throw error;
			}
		});
	}
	#rejectPending() {
		for (const pending of this.#pending.values()) {
			pending.cancel();
			pending.reject(new RelayError("unavailable", "The relay disconnected. Check openclaw mcp-relay status and try again."));
		}
		this.#pending.clear();
	}
	async #handle(frame, assertConnectionCurrent, bindings) {
		const { op, params } = frame;
		const { state, scheduler } = this.#options;
		if (typeof op !== "string") throw new RelayError("invalid_params", "Supply a valid operation name.");
		if (op !== "grant.create" && op !== "grant.revoked") {
			const { grantId } = frame;
			assertConnectionCurrent();
			if (typeof grantId !== "string" || !await state.authorize(grantId, scheduler.now())) throw new RelayError("grant_revoked", "This connection was revoked. Run openclaw mcp-relay pair and connect again.");
			const assertAuthority = () => {
				assertConnectionCurrent();
				state.assertGrantCurrent(grantId);
			};
			const binding = await bindings.get(grantId);
			const result = await this.#options.operations(op, params, assertAuthority, async (...args) => {
				try {
					return await binding.request(...args);
				} catch (error) {
					if (isRetiredBindingError(error)) {
						this.#ui?.retire(grantId, error);
						await bindings.revoke(grantId);
					}
					throw error;
				}
			});
			return op === "status" && isRecord(result) ? {
				...result,
				ui: this.#uiStatus()
			} : result;
		}
		if (!isRecord(params) || typeof params.grantId !== "string" || !params.grantId || params.grantId.length > 200) throw new RelayError("invalid_params", "Supply a valid grantId and retry the request.");
		if (op === "grant.revoked") {
			if (params.reason !== "client_revoked" && params.reason !== "refresh_reuse" || Object.keys(params).some((key) => !["grantId", "reason"].includes(key))) throw new RelayError("invalid_params", "Supply a valid revocation reason.");
			await state.revoke(params.grantId);
			this.#ui?.revoke(params.grantId);
			await bindings.revoke(params.grantId);
			return {};
		}
		if (!await state.createGrant({
			grantId: params.grantId,
			...readGrantCreation(params)
		}, scheduler.now())) throw new RelayError("not_found", "That pairing code is unknown, expired, or already used. Run openclaw mcp-relay pair again.");
		return {};
	}
};
//#endregion
export { RelayService };
