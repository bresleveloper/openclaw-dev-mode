import { Jn as string, Pn as number } from "./schemas-BOYIvvln.mjs";
import { t as WebSocket } from "./websocket-CGHaToS5.mjs";
import { n as rawDataToString } from "./ws-BdD3UP1C.mjs";
import "./webhook-ingress-w3p_4f6-.mjs";
import { _ as randomRelayNonce, f as parseStrictJsonObject, h as isCanonicalBase64UrlBytes, i as BROWSER_RELAY_EXTENSION_SUBPROTOCOL, m as createRelayProof, r as BROWSER_RELAY_CHALLENGE_TTL_MS, v as relayKeyIdFromHex, y as verifyRelayProof } from "./auth-v2-B-IXoFi_.mjs";
import { c as relayOwnerStatus, i as relayOwnerReply, l as relayOwnerStreamClosed, o as relayOwnerResource, r as relayOwnerFrame, s as relayOwnerRetired } from "./owner-protocol-Chu-AHTl.mjs";
import { once } from "node:events";
//#region extensions/browser/src/browser/extension-relay/owner-auth-client.ts
/** Never send a key or client proof until the configured listener proves its resource. */
async function authenticateRelayOwner(params) {
	const resource = relayOwnerResource(params.port, params.profile);
	const disconnected = new AbortController();
	const signal = AbortSignal.any([
		disconnected.signal,
		params.signal,
		AbortSignal.timeout(BROWSER_RELAY_CHALLENGE_TTL_MS)
	]);
	signal.throwIfAborted();
	const ws = new WebSocket(`ws://127.0.0.1:${params.port}${resource}`, BROWSER_RELAY_EXTENSION_SUBPROTOCOL, { maxPayload: 67108864 });
	ws.once("close", () => disconnected.abort(/* @__PURE__ */ new Error("Relay owner authentication connection closed")));
	const abort = () => ws.terminate();
	signal.addEventListener("abort", abort, { once: true });
	ws.on("error", () => {});
	const read = async () => {
		const [raw] = await once(ws, "message", { signal });
		const message = parseStrictJsonObject(rawDataToString(raw));
		if (!message) throw new Error("Invalid relay owner authentication frame");
		return message;
	};
	try {
		await once(ws, "open", { signal });
		const clientNonce = randomRelayNonce();
		const keyId = relayKeyIdFromHex(params.token);
		const challengeRead = read();
		ws.send(JSON.stringify({
			type: "auth.hello",
			v: 2,
			keyId,
			clientNonce
		}));
		const challenge = await challengeRead;
		const owner = typeof challenge.resource === "string" ? challenge.resource.slice(`${resource}&owner=`.length) : "";
		const now = Date.now();
		if (Object.keys(challenge).length !== 15 || challenge.type !== "auth.challenge" || challenge.v !== 2 || challenge.keyId !== keyId || challenge.clientNonce !== clientNonce || challenge.role !== "cdp" || challenge.transport !== "websocket" || challenge.method !== "GET" || challenge.flow !== "owner" || challenge.resource !== `${resource}&owner=${owner}` || !isCanonicalBase64UrlBytes(owner, 16) || !isCanonicalBase64UrlBytes(challenge.instanceId, 16) || !isCanonicalBase64UrlBytes(challenge.sessionId, 16) || !isCanonicalBase64UrlBytes(challenge.serverNonce, 32) || typeof challenge.issuedAtMs !== "number" || !Number.isSafeInteger(challenge.issuedAtMs) || typeof challenge.expiresAtMs !== "number" || !Number.isSafeInteger(challenge.expiresAtMs) || challenge.expiresAtMs <= now || challenge.issuedAtMs > now + 3e4 || challenge.expiresAtMs - challenge.issuedAtMs !== 1e4) throw new Error("Relay owner authentication binding mismatch");
		const fields = {
			keyId,
			clientNonce,
			instanceId: challenge.instanceId,
			sessionId: challenge.sessionId,
			serverNonce: challenge.serverNonce,
			issuedAtMs: challenge.issuedAtMs,
			expiresAtMs: challenge.expiresAtMs,
			role: "cdp",
			transport: "websocket",
			method: "GET",
			flow: "owner",
			resource: `${resource}&owner=${owner}`
		};
		if (!verifyRelayProof(params.token, "server", fields, challenge.serverProof)) throw new Error("Relay owner did not prove the configured key");
		const clientProof = createRelayProof(params.token, "client", fields);
		const acceptedRead = read();
		ws.send(JSON.stringify({
			type: "auth.response",
			v: 2,
			sessionId: fields.sessionId,
			clientProof
		}));
		const accepted = await acceptedRead;
		if (Object.keys(accepted).length !== 4 || accepted.type !== "auth.ok" || accepted.v !== 2 || accepted.sessionId !== fields.sessionId || !verifyRelayProof(params.token, "accept", fields, accepted.acceptProof, clientProof)) throw new Error("Relay owner acceptance proof failed");
		signal.throwIfAborted();
		return {
			ws,
			owner
		};
	} catch (error) {
		ws.terminate();
		throw error;
	} finally {
		signal.removeEventListener("abort", abort);
	}
}
//#endregion
//#region extensions/browser/src/browser/extension-relay/owner-client.ts
const nullableIdResult = string().nullable();
const streamIdResult = number().int().positive();
/** Client resources are leases on one socket and one proved listener lifetime. */
var RelayOwnerClient = class RelayOwnerClient {
	constructor(ws) {
		this.ws = ws;
		this.pending = /* @__PURE__ */ new Map();
		this.streams = /* @__PURE__ */ new Map();
		this.profileAdmission = () => {};
		this.sequence = 0;
		this.closed = false;
		this.retirementAcknowledged = false;
		ws.on("message", (raw) => {
			const parsed = parseStrictJsonObject(rawDataToString(raw));
			if (relayOwnerRetired.safeParse(parsed).success) {
				this.retirementAcknowledged = true;
				this.invalidate("Relay owner retired");
				return;
			}
			const reply = relayOwnerReply.safeParse(parsed);
			if (reply.success) {
				const pending = this.pending.get(reply.data.id);
				this.pending.delete(reply.data.id);
				if (reply.data.error) pending?.reject(new Error(reply.data.error));
				else pending?.resolve(reply.data.result);
				return;
			}
			const frame = relayOwnerFrame.safeParse(parsed);
			if (frame.success) {
				this.streams.get(frame.data.stream)?.onFrame?.(frame.data.frame);
				return;
			}
			const closed = relayOwnerStreamClosed.safeParse(parsed);
			if (closed.success) {
				this.streams.get(closed.data.stream)?.onClose?.();
				this.streams.delete(closed.data.stream);
				return;
			}
			ws.close(4003, "invalid relay owner response");
		});
		ws.once("close", () => this.invalidate("Relay owner connection lost"));
	}
	invalidate(message) {
		this.closed = true;
		for (const pending of this.pending.values()) pending.reject(new Error(message));
		this.pending.clear();
		for (const stream of this.streams.values()) stream.onClose?.();
		this.streams.clear();
	}
	static async connect(params) {
		const { ws } = await authenticateRelayOwner(params);
		return new RelayOwnerClient(ws);
	}
	adoptProfileLease(assertCurrent) {
		this.profileAdmission = assertCurrent;
	}
	get connected() {
		return !this.closed && !this.closing && this.ws.readyState === 1;
	}
	assertCurrent() {
		this.profileAdmission();
		if (this.closed || this.closing || this.ws.readyState !== 1) throw new Error("Relay owner lease is no longer current");
	}
	async request(op, fields = {}) {
		if (this.closed || this.ws.readyState !== 1 || this.pending.size >= 64) throw new Error("Relay owner connection unavailable");
		const id = ++this.sequence;
		let timer;
		try {
			return await new Promise((resolve, reject) => {
				this.pending.set(id, {
					resolve,
					reject
				});
				timer = setTimeout(() => {
					this.pending.delete(id);
					reject(/* @__PURE__ */ new Error("Relay owner response timed out"));
					this.ws.terminate();
				}, 15e3);
				timer.unref?.();
				this.ws.send(JSON.stringify({
					id,
					op,
					...fields
				}));
			});
		} finally {
			if (timer) clearTimeout(timer);
		}
	}
	async status(timeoutMs = 0) {
		this.assertCurrent();
		const status = relayOwnerStatus.parse(await this.request("ready", { timeoutMs }));
		this.assertCurrent();
		return status;
	}
	async capture(targetId, assertOperationCurrent = () => {}) {
		this.assertCurrent();
		assertOperationCurrent();
		const ref = nullableIdResult.parse(await this.request("capture", { targetId }));
		try {
			this.assertCurrent();
			assertOperationCurrent();
		} catch (error) {
			if (ref) await this.request("release", { ref });
			throw error;
		}
		let released = false;
		const assertReference = () => {
			this.assertCurrent();
			assertOperationCurrent();
			if (released || !ref) throw new Error("Relay operation target is unavailable");
		};
		return {
			resolve: async () => {
				assertReference();
				const target = nullableIdResult.parse(await this.request("resolve", { ref }));
				assertReference();
				return target ?? void 0;
			},
			openTransport: async () => {
				assertReference();
				const transport = await this.openTransport(ref ?? void 0);
				try {
					assertReference();
					const send = transport.send.bind(transport);
					transport.send = (message) => {
						assertReference();
						send(message);
					};
					return transport;
				} catch (error) {
					transport.close();
					throw error;
				}
			},
			release: async () => {
				if (released) return;
				released = true;
				if (ref) await this.request("release", { ref });
			}
		};
	}
	async openStream(op, ref) {
		this.assertCurrent();
		const id = streamIdResult.parse(await this.request(op, ref ? { ref } : {}));
		this.assertCurrent();
		let closed = false;
		let closing;
		const stream = {
			send: (frame) => {
				this.assertCurrent();
				if (closed) throw new Error("Relay stream closed");
				this.ws.send(JSON.stringify({
					stream: id,
					frame
				}));
			},
			close: () => {
				closed = true;
				return closing ??= this.request("stream.close", { stream: id }).then(() => {
					this.streams.delete(id);
					stream.onClose?.();
				});
			}
		};
		this.streams.set(id, stream);
		return stream;
	}
	async openTransport(ref) {
		const stream = await this.openStream("cdp.open", ref);
		const transport = {
			send: (message) => stream.send(JSON.stringify(message)),
			close: () => {
				stream.close().catch(() => this.ws.terminate());
			}
		};
		stream.onFrame = (raw) => {
			const frame = parseStrictJsonObject(raw);
			if (!frame) {
				this.ws.terminate();
				return;
			}
			transport.onmessage?.(frame);
		};
		stream.onClose = () => transport.onclose?.("Relay CDP stream closed");
		return transport;
	}
	async prepareIngress(ws) {
		const stream = await this.openStream("ingress.open");
		const close = () => {
			stream.close().catch(() => this.ws.terminate());
		};
		ws.once("close", close);
		if (ws.readyState !== 1) {
			close();
			throw new Error("Gateway extension connection lost");
		}
		return () => {
			this.assertCurrent();
			stream.onFrame = (raw) => {
				if (ws.readyState === 1) ws.send(raw);
			};
			stream.onClose = () => ws.close(1011, "Relay ingress lease closed");
			ws.on("message", (raw) => {
				try {
					stream.send(rawDataToString(raw));
				} catch {
					ws.close(1011, "Relay ingress lease closed");
				}
			});
		};
	}
	close() {
		if (this.retirementAcknowledged) return Promise.resolve();
		return this.closing ??= this.request("close").then(() => {
			this.closed = true;
			this.ws.close();
		});
	}
};
//#endregion
export { RelayOwnerClient as t };
