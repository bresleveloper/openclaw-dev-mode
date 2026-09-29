import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { t as pruneMapToMaxSize } from "./map-size-CNcWiFKu.mjs";
import { r as PAIRING_SCOPE, t as ADMIN_SCOPE, u as WRITE_SCOPE } from "./operator-scopes-D-CL26h0.mjs";
import { n as GATEWAY_CLIENT_IDS, r as GATEWAY_CLIENT_MODES } from "./client-info-B_ICKCYw.mjs";
import { a as isLoopbackAddress, n as hasForwardedRequestHeaders, x as resolveRequestClientIpFromHeaders } from "./net-DU4aWKLv.mjs";
import { f as buildRateLimitIdentityKey, l as AUTH_RATE_LIMIT_SCOPE_WATCH_CHALLENGE, o as AUTH_RATE_LIMIT_SCOPE_NODE_PAIRING } from "./auth-rate-limit-DuWYneOU.mjs";
import { o as readPreparedGatewayIngressAttribution } from "./ingress-attribution-C5e071om.mjs";
import { n as withSerializedRateLimitAttempt } from "./rate-limit-attempt-serialization-Bc5jN4Z8.mjs";
import { n as deriveDeviceIdFromPublicKey, o as normalizeDevicePublicKeyBase64Url } from "./device-identity-B_zMrBd6.mjs";
import "./version-CwNT1gaY.mjs";
import { _h as formatValidationErrors, ot as validateConnectParams } from "./src-BRUl7oDv.mjs";
import "./method-scopes-C7g7eSZh.mjs";
import { d as isVoiceNodePairingSetupBootstrapProfile, u as isNodePairingSetupBootstrapProfile } from "./device-bootstrap-profile-CLBYuPAv.mjs";
import { o as resolveNodePairingState } from "./device-pairing-identity-BnU9nqx2.mjs";
import { t as getPairedDevice, u as requestDevicePairing } from "./device-pairing-DbLfxuuq.mjs";
import { f as requestNodePairing, n as beginNodePairingConnect, o as recordPairedNodeConnection, r as finalizeNodePairingCleanupClaim, s as recordPairedNodeDisconnection, t as approveNodePairing, u as releaseNodePairingCleanupClaim } from "./device-pairing-node-DvH1kI0G.mjs";
import { t as resolveEffectiveComputerUseDescriptor } from "./node-computer-use-descriptor-D_tS4bop.mjs";
import { t as approveBootstrapDevicePairing } from "./device-pairing-approval-6orhFPdN.mjs";
import { d as redeemDeviceBootstrapTokenProfile, f as restoreGenericDeviceBootstrapToken, m as verifyDeviceBootstrapToken, o as getBoundDeviceBootstrapProfile } from "./device-bootstrap-BtrqJlcg.mjs";
import { i as verifyDeviceToken } from "./device-pairing-tokens-ET3TWOUZ.mjs";
import { a as readJsonBodyOrError, c as sendJson, d as sendRateLimited, f as sendUnauthorized, l as sendMethodNotAllowed, s as sendInvalidRequest } from "./http-common-Ckbyca3h.mjs";
import { t as captureAuthenticatedNodePairingState } from "./device-pairing-node-state-BxpHZHxS.mjs";
import { a as consumeSetupHandoff, i as confirmSetupHandoffDelivery, l as resolveDeviceSignaturePayloadVersion, n as broadcastSetupHandoffCompletion, o as resolveConnectAuthDecision, r as broadcastSetupHandoffDeliveryUncertain, t as reconcileNodePairingOnConnect } from "./node-connect-reconcile-CsfPzhmA.mjs";
import { randomBytes, randomUUID } from "node:crypto";
//#region src/gateway/watch-node-http.ts
const BASE_PATH = "/api/nodes/watch";
const CONNECT_PATH = `${BASE_PATH}/connect`;
const CHALLENGE_PATH = `${BASE_PATH}/challenge`;
const DISCONNECT_PATH = `${BASE_PATH}/disconnect`;
const POLL_PATH = `${BASE_PATH}/poll`;
const RESULT_PATH = `${BASE_PATH}/result`;
const CHALLENGE_TTL_MS = 6e4;
const SIGNATURE_SKEW_MS = 12e4;
const POLL_TIMEOUT_MS = 2e4;
const SESSION_IDLE_MS = 75e3;
const MAX_BODY_BYTES = 65536;
const MAX_QUEUED_EVENT_BYTES = 65536;
const MAX_QUEUED_BYTES = 524288;
const MAX_QUEUED_EVENTS = 32;
const MAX_PENDING_CHALLENGES_PER_CLIENT = 8;
const WATCH_CAPS = /* @__PURE__ */ new Set();
const WATCH_COMMANDS = /* @__PURE__ */ new Set([
	"device.info",
	"device.status",
	"system.notify"
]);
const WATCH_PERMISSIONS = /* @__PURE__ */ new Set(["notifications"]);
var WatchNodePairingRateLimitError = class extends Error {
	constructor(retryAfterMs) {
		super("watch node pairing rate limited");
		this.retryAfterMs = retryAfterMs;
	}
};
function normalizePath(req) {
	try {
		return new URL(req.url ?? "/", "http://localhost").pathname;
	} catch {
		return null;
	}
}
function readBearerToken(req) {
	const header = req.headers.authorization?.trim() ?? "";
	return /^Bearer\s+(.+)$/i.exec(header)?.[1]?.trim() || null;
}
function resolveWatchClientAddress(req, config) {
	const attribution = readPreparedGatewayIngressAttribution(req);
	if (attribution && attribution.kind !== "unattributable-proxy") return {
		clientIp: attribution.clientIp,
		rateLimitKey: attribution.rateLimit.subject.key
	};
	const trustedProxies = config.gateway?.trustedProxies ?? [];
	const clientIp = resolveRequestClientIpFromHeaders(req, trustedProxies, config.gateway?.allowRealIpFallback === true);
	if (hasForwardedRequestHeaders(req) && isLoopbackAddress(clientIp)) return { rateLimitKey: buildRateLimitIdentityKey("watch-proxy", req.socket.remoteAddress ?? "unknown") };
	return {
		...clientIp ? { clientIp } : {},
		rateLimitKey: clientIp ?? buildRateLimitIdentityKey("watch-client", "unknown")
	};
}
function trackResponseLifecycle(res) {
	let aborted = false;
	let settled = false;
	let resolveCompleted = () => void 0;
	const completed = new Promise((resolve) => {
		resolveCompleted = resolve;
	});
	const settle = (value) => {
		if (settled) return;
		settled = true;
		res.off("finish", onFinish);
		res.off("close", onClose);
		resolveCompleted(value);
	};
	const onFinish = () => settle(true);
	const onClose = () => {
		aborted = !res.writableFinished;
		settle(!aborted);
	};
	res.once("finish", onFinish);
	res.once("close", onClose);
	return {
		completed,
		isAborted: () => aborted
	};
}
function hasOnlyBoundedWatchSurface(connect) {
	const caps = Array.isArray(connect.caps) ? connect.caps : [];
	const commands = Array.isArray(connect.commands) ? connect.commands : [];
	const permissionEntries = Object.entries(connect.permissions ?? {});
	return caps.every((cap) => WATCH_CAPS.has(cap)) && commands.length > 0 && commands.every((command) => WATCH_COMMANDS.has(command)) && permissionEntries.every(([permission]) => WATCH_PERMISSIONS.has(permission));
}
function isCanonicalWatchNode(connect) {
	const platform = connect.client.platform.trim().toLowerCase();
	const family = connect.client.deviceFamily?.trim().toLowerCase();
	return connect.minProtocol <= 4 && connect.maxProtocol >= 4 && connect.role === "node" && (connect.scopes?.length ?? 0) === 0 && connect.client.id === GATEWAY_CLIENT_IDS.WATCHOS_APP && connect.client.mode === GATEWAY_CLIENT_MODES.NODE && platform.startsWith("watchos") && family === "apple watch" && hasOnlyBoundedWatchSurface(connect);
}
function createChallengeStore() {
	const challenges = /* @__PURE__ */ new Map();
	const pruneExpired = (current) => {
		for (const [nonce, challenge] of challenges) if (challenge.expiresAtMs <= current) challenges.delete(nonce);
	};
	return {
		issue: (clientKey, current) => {
			pruneExpired(current);
			const clientNonces = [...challenges.entries()].filter(([, challenge]) => challenge.clientKey === clientKey);
			while (clientNonces.length >= MAX_PENDING_CHALLENGES_PER_CLIENT) {
				const oldest = clientNonces.shift();
				if (oldest) challenges.delete(oldest[0]);
			}
			pruneMapToMaxSize(challenges, 4095);
			const nonce = randomBytes(24).toString("base64url");
			const expiresAtMs = current + CHALLENGE_TTL_MS;
			challenges.set(nonce, {
				clientKey,
				expiresAtMs
			});
			return {
				nonce,
				ts: current,
				expiresAtMs
			};
		},
		consume: (nonce, clientKey, current) => {
			const challenge = challenges.get(nonce);
			challenges.delete(nonce);
			return Boolean(challenge && challenge.clientKey === clientKey && challenge.expiresAtMs > current);
		},
		clear: () => challenges.clear()
	};
}
function broadcastPairingSuperseded(broadcast, result, now) {
	for (const superseded of result.created ? result.superseded ?? [] : []) broadcast("node.pair.resolved", {
		requestId: superseded.requestId,
		nodeId: superseded.nodeId,
		decision: "rejected",
		ts: now
	}, { dropIfSlow: true });
}
/** Create the first-party watchOS node HTTP transport for one Gateway process. */
function createWatchNodeHttpRuntime(options) {
	const now = options.now ?? Date.now;
	const challenges = createChallengeStore();
	const sessionsByToken = /* @__PURE__ */ new Map();
	const sessionsByNodeId = /* @__PURE__ */ new Map();
	let closed = false;
	const closeSession = (session, reason) => {
		if (sessionsByToken.get(session.token) !== session) return;
		sessionsByToken.delete(session.token);
		if (sessionsByNodeId.get(session.nodeId) === session) sessionsByNodeId.delete(session.nodeId);
		clearTimeout(session.expiresTimer);
		if (session.waiter) {
			clearTimeout(session.waiter.timer);
			if (!session.waiter.res.writableEnded) sendJson(session.waiter.res, 401, {
				ok: false,
				reason
			});
			session.waiter = void 0;
		}
		const nodeSession = options.nodeRegistry.get(session.nodeId);
		const disconnectHistory = nodeSession?.connId === session.connId && nodeSession.pairingGeneration ? {
			nodeId: nodeSession.nodeId,
			connectedAtMs: nodeSession.connectedAtMs,
			pairingGeneration: nodeSession.pairingGeneration
		} : void 0;
		const disconnectedNodeId = options.nodeRegistry.unregister(session.connId);
		if (disconnectedNodeId) {
			const disconnectedAtMs = now();
			try {
				options.onNodeDisconnected?.(disconnectedNodeId, reason);
			} catch (error) {
				options.onError?.("watch node disconnect cleanup failed", error);
			}
			if (disconnectHistory && disconnectHistory.nodeId === disconnectedNodeId) recordPairedNodeDisconnection({
				nodeId: disconnectHistory.nodeId,
				connectedAtMs: disconnectHistory.connectedAtMs,
				disconnectedAtMs,
				expectedPairingGeneration: {
					nodeId: disconnectHistory.nodeId,
					key: disconnectHistory.pairingGeneration
				},
				baseDir: options.pairingBaseDir
			}).catch((error) => options.onError?.("watch node disconnect persistence failed", error));
		}
	};
	const armExpiry = (session) => {
		clearTimeout(session.expiresTimer);
		session.expiresTimer = setTimeout(() => closeSession(session, "session expired"), SESSION_IDLE_MS);
		session.expiresTimer.unref?.();
	};
	const touchSession = (session) => {
		session.lastSeenAtMs = now();
		armExpiry(session);
	};
	const sendQueuedEvent = (res, queued) => {
		if (res.destroyed || res.socket?.destroyed || res.writableEnded) return false;
		try {
			res.statusCode = 200;
			res.setHeader("Content-Type", "application/json; charset=utf-8");
			res.end(`{"ok":true,"event":${queued.json}}`);
			return true;
		} catch {
			return false;
		}
	};
	const enqueue = (session, queued) => {
		if (sessionsByToken.get(session.token) !== session || session.invalidatedReason) return false;
		if (!queued || queued.byteLength > MAX_QUEUED_EVENT_BYTES) {
			closeSession(session, "event payload too large");
			return false;
		}
		if (session.waiter) {
			const waiter = session.waiter;
			session.waiter = void 0;
			clearTimeout(waiter.timer);
			if (!sendQueuedEvent(waiter.res, queued)) {
				closeSession(session, "event delivery failed");
				return false;
			}
			return true;
		}
		if (session.queue.length >= MAX_QUEUED_EVENTS || session.queuedBytes + queued.byteLength > MAX_QUEUED_BYTES) {
			closeSession(session, "event queue overflow");
			return false;
		}
		session.queue.push(queued);
		session.queuedBytes += queued.byteLength;
		return true;
	};
	const serializeEvent = (event, payload) => {
		try {
			const json = JSON.stringify({
				event,
				...payload === void 0 ? {} : { payload }
			});
			return {
				json,
				byteLength: Buffer.byteLength(json)
			};
		} catch {
			return null;
		}
	};
	const serializeRawEvent = (event, payloadJSON) => {
		const eventJSON = JSON.stringify(event);
		if (!payloadJSON) {
			const json = `{"event":${eventJSON}}`;
			return {
				json,
				byteLength: Buffer.byteLength(json)
			};
		}
		const prefix = `{"event":${eventJSON},"payload":`;
		const byteLength = Buffer.byteLength(prefix) + Buffer.byteLength(payloadJSON.json) + Buffer.byteLength("}");
		if (byteLength > MAX_QUEUED_EVENT_BYTES) return null;
		return {
			json: `${prefix}${payloadJSON.json}}`,
			byteLength
		};
	};
	const createTransport = (session) => ({
		send: (event, payload) => enqueue(session, serializeEvent(event, payload)),
		sendRaw: (event, payloadJSON) => enqueue(session, serializeRawEvent(event, payloadJSON)),
		checkConnectivity: async () => {
			if (session.invalidatedReason) return {
				ok: false,
				error: {
					code: "NOT_CONNECTED",
					message: session.invalidatedReason
				}
			};
			return now() - session.lastSeenAtMs < SESSION_IDLE_MS ? { ok: true } : {
				ok: false,
				error: {
					code: "NOT_CONNECTED",
					message: "watch node poll expired"
				}
			};
		}
	});
	const getSession = async (req, res) => {
		const token = readBearerToken(req);
		const session = token ? sessionsByToken.get(token) : void 0;
		if (!session) {
			sendUnauthorized(res);
			return null;
		}
		if (session.invalidatedReason) {
			closeSession(session, session.invalidatedReason);
			sendUnauthorized(res);
			return null;
		}
		if (!await options.nodeRegistry.isConnectionCurrentPairingState(session.connId)) {
			closeSession(session, "node pairing changed");
			sendUnauthorized(res);
			return null;
		}
		return session;
	};
	const withCurrentSession = async (req, res, operation) => {
		const session = await getSession(req, res);
		if (!session) return;
		if (session.invalidatedReason || sessionsByToken.get(session.token) !== session || options.nodeRegistry.get(session.nodeId)?.connId !== session.connId) {
			closeSession(session, session.invalidatedReason ?? "node connection changed");
			sendUnauthorized(res);
			return;
		}
		touchSession(session);
		operation(session);
	};
	const handleChallenge = (req, res) => {
		if ((req.method ?? "GET").toUpperCase() !== "GET") {
			sendMethodNotAllowed(res, "GET");
			return;
		}
		const { rateLimitKey: clientKey } = resolveWatchClientAddress(req, options.getConfig());
		const rateLimit = options.rateLimiter?.check(clientKey, AUTH_RATE_LIMIT_SCOPE_WATCH_CHALLENGE);
		if (rateLimit && !rateLimit.allowed) {
			sendRateLimited(res, rateLimit.retryAfterMs);
			return;
		}
		options.rateLimiter?.recordFailure(clientKey, AUTH_RATE_LIMIT_SCOPE_WATCH_CHALLENGE);
		const challenge = challenges.issue(clientKey, now());
		res.setHeader("Cache-Control", "no-store");
		sendJson(res, 200, {
			ok: true,
			...challenge
		});
	};
	const handleConnect = async (req, res) => {
		if ((req.method ?? "").toUpperCase() !== "POST") {
			sendMethodNotAllowed(res);
			return;
		}
		const responseLifecycle = trackResponseLifecycle(res);
		const body = await readJsonBodyOrError(req, res, MAX_BODY_BYTES);
		if (body === void 0) return;
		if (!validateConnectParams(body)) {
			sendInvalidRequest(res, `invalid connect params: ${formatValidationErrors(validateConnectParams.errors)}`);
			return;
		}
		const connect = body;
		if (!isCanonicalWatchNode(connect)) {
			sendInvalidRequest(res, "unsupported watch node identity or capability surface");
			return;
		}
		const auth = connect.auth;
		const bootstrapToken = auth?.bootstrapToken?.trim() || null;
		const deviceToken = auth?.deviceToken?.trim() || null;
		const expectedAuthField = bootstrapToken ? "bootstrapToken" : deviceToken ? "deviceToken" : null;
		const authFields = Object.keys(auth ?? {});
		if (!expectedAuthField || authFields.length !== 1 || authFields[0] !== expectedAuthField || !connect.device) {
			sendUnauthorized(res);
			return;
		}
		const current = now();
		const { clientIp, rateLimitKey: clientKey } = resolveWatchClientAddress(req, options.getConfig());
		if (!challenges.consume(connect.device.nonce, clientKey, current) || Math.abs(current - connect.device.signedAt) > SIGNATURE_SKEW_MS) {
			sendUnauthorized(res);
			return;
		}
		const publicKey = normalizeDevicePublicKeyBase64Url(connect.device.publicKey);
		const derivedDeviceId = publicKey ? deriveDeviceIdFromPublicKey(publicKey) : null;
		if (!publicKey || !derivedDeviceId || derivedDeviceId !== connect.device.id) {
			sendUnauthorized(res);
			return;
		}
		if (!resolveDeviceSignaturePayloadVersion({
			device: {
				...connect.device,
				publicKey
			},
			connectParams: connect,
			role: "node",
			scopes: [],
			signedAtMs: connect.device.signedAt,
			nonce: connect.device.nonce
		})) {
			sendUnauthorized(res);
			return;
		}
		const authDecision = await resolveConnectAuthDecision({
			state: {
				authResult: {
					ok: false,
					reason: "token_mismatch"
				},
				authOk: false,
				authMethod: "token",
				sharedAuthOk: false,
				pendingSharedAuthFailure: false,
				...bootstrapToken ? { bootstrapTokenCandidate: bootstrapToken } : {},
				...deviceToken ? {
					deviceTokenCandidate: deviceToken,
					deviceTokenCandidateSource: "explicit-device-token"
				} : {}
			},
			hasDeviceIdentity: true,
			deviceId: derivedDeviceId,
			publicKey,
			role: "node",
			scopes: [],
			rateLimiter: options.rateLimiter,
			clientIp: clientKey,
			verifyBootstrapToken: async (params) => await verifyDeviceBootstrapToken({
				...params,
				baseDir: options.pairingBaseDir
			}),
			verifyDeviceToken: async (params) => await verifyDeviceToken({
				...params,
				baseDir: options.pairingBaseDir
			})
		});
		if (!authDecision.authOk) {
			if (authDecision.authResult.rateLimited) sendRateLimited(res, authDecision.authResult.retryAfterMs ?? 0);
			else sendUnauthorized(res);
			return;
		}
		let issuedDeviceToken = deviceToken;
		const bootstrapDeviceTokens = [];
		let setupBootstrapAccepted = false;
		if (bootstrapToken) {
			const existing = await getPairedDevice(derivedDeviceId, options.pairingBaseDir);
			if (existing && existing.publicKey !== publicKey) {
				sendUnauthorized(res);
				return;
			}
			const profile = await getBoundDeviceBootstrapProfile({
				token: bootstrapToken,
				deviceId: derivedDeviceId,
				publicKey,
				baseDir: options.pairingBaseDir
			});
			const voiceProfile = isVoiceNodePairingSetupBootstrapProfile(profile ?? void 0);
			if (!profile || !isNodePairingSetupBootstrapProfile(profile) && !voiceProfile) {
				sendUnauthorized(res);
				return;
			}
			const pairing = await requestDevicePairing({
				deviceId: derivedDeviceId,
				publicKey,
				displayName: connect.client.displayName,
				platform: connect.client.platform,
				deviceFamily: connect.client.deviceFamily,
				clientId: connect.client.id,
				clientMode: connect.client.mode,
				role: "node",
				roles: profile.roles,
				scopes: profile.scopes,
				remoteIp: clientIp,
				silent: true
			}, options.pairingBaseDir);
			const approved = await approveBootstrapDevicePairing(pairing.request.requestId, profile, { onTokensReplaced: options.onDeviceTokensReplaced }, options.pairingBaseDir);
			if (approved?.status !== "approved") {
				sendUnauthorized(res);
				return;
			}
			issuedDeviceToken = approved.device.tokens?.node?.token ?? null;
			if (voiceProfile) {
				const operatorToken = approved.device.tokens?.operator;
				if (!operatorToken) {
					sendUnauthorized(res);
					return;
				}
				bootstrapDeviceTokens.push({
					deviceToken: operatorToken.token,
					role: operatorToken.role,
					scopes: operatorToken.scopes,
					issuedAtMs: operatorToken.rotatedAtMs ?? operatorToken.createdAtMs
				});
			}
			options.broadcast("device.pair.resolved", {
				requestId: pairing.request.requestId,
				deviceId: derivedDeviceId,
				decision: "approved",
				ts: current
			}, { dropIfSlow: true });
			setupBootstrapAccepted = Boolean(issuedDeviceToken);
		} else if (deviceToken) {
			if ((await getPairedDevice(derivedDeviceId, options.pairingBaseDir))?.publicKey !== publicKey) {
				sendUnauthorized(res);
				return;
			}
		}
		if (!issuedDeviceToken) {
			sendUnauthorized(res);
			return;
		}
		const nodeSnapshot = await beginNodePairingConnect(derivedDeviceId, options.pairingBaseDir);
		let cleanupClaim = nodeSnapshot.cleanupClaim;
		try {
			let reconciliation;
			try {
				reconciliation = await reconcileNodePairingOnConnect({
					cfg: options.getConfig(),
					connectParams: connect,
					pairedNode: nodeSnapshot.pairedNode,
					reportedClientIp: clientIp,
					requestPairing: async (input) => {
						if (nodeSnapshot.pairedNode && options.nodeReapprovalCoordinator) return await options.nodeReapprovalCoordinator.request({
							input,
							cleanupClaim,
							baseDir: options.pairingBaseDir
						});
						if (!options.rateLimiter) return await requestNodePairing(input, options.pairingBaseDir);
						return await withSerializedRateLimitAttempt({
							ip: clientKey,
							scope: AUTH_RATE_LIMIT_SCOPE_NODE_PAIRING,
							run: async () => {
								const rateCheck = options.rateLimiter?.check(clientKey, AUTH_RATE_LIMIT_SCOPE_NODE_PAIRING);
								if (rateCheck && !rateCheck.allowed) throw new WatchNodePairingRateLimitError(rateCheck.retryAfterMs);
								const result = await requestNodePairing(input, options.pairingBaseDir);
								options.rateLimiter?.recordFailure(clientKey, AUTH_RATE_LIMIT_SCOPE_NODE_PAIRING);
								return result;
							}
						});
					}
				});
			} catch (error) {
				if (error instanceof WatchNodePairingRateLimitError) {
					sendRateLimited(res, error.retryAfterMs);
					return;
				}
				throw error;
			}
			if (reconciliation.pendingPairing) broadcastPairingSuperseded(options.broadcast, reconciliation.pendingPairing, current);
			if (setupBootstrapAccepted && !nodeSnapshot.pairedNode && reconciliation.pendingPairing && hasOnlyBoundedWatchSurface(connect)) {
				const approved = await approveNodePairing(reconciliation.pendingPairing.request.requestId, { callerScopes: [
					ADMIN_SCOPE,
					PAIRING_SCOPE,
					WRITE_SCOPE
				] }, options.pairingBaseDir);
				if (approved && "node" in approved) {
					options.broadcast("node.pair.resolved", {
						requestId: reconciliation.pendingPairing.request.requestId,
						nodeId: derivedDeviceId,
						decision: "approved",
						ts: current
					}, { dropIfSlow: true });
					reconciliation = {
						...reconciliation,
						effectiveCaps: reconciliation.declaredCaps,
						effectiveCommands: reconciliation.declaredCommands,
						effectivePermissions: reconciliation.declaredPermissions,
						pendingPairing: void 0,
						shouldClearPendingPairings: true
					};
				}
			}
			if (reconciliation.pendingPairing?.created) options.broadcast("node.pair.requested", reconciliation.pendingPairing.request, { dropIfSlow: true });
			if (closed || responseLifecycle.isAborted()) return;
			if (bootstrapToken) {
				if (!(await redeemDeviceBootstrapTokenProfile({
					token: bootstrapToken,
					role: "node",
					scopes: [],
					baseDir: options.pairingBaseDir
				})).recorded) {
					sendUnauthorized(res);
					return;
				}
			}
			if (!(await verifyDeviceToken({
				deviceId: derivedDeviceId,
				token: issuedDeviceToken,
				role: "node",
				scopes: [],
				baseDir: options.pairingBaseDir
			})).ok) {
				sendUnauthorized(res);
				return;
			}
			const nodePairingState = await captureAuthenticatedNodePairingState({
				nodeId: derivedDeviceId,
				publicKey,
				token: issuedDeviceToken,
				baseDir: options.pairingBaseDir
			});
			const nodePairingGeneration = nodePairingState?.generation;
			if (!nodePairingState || !nodePairingGeneration) {
				sendUnauthorized(res);
				return;
			}
			let bootstrapHandoff;
			let handoffResponseCompleted = false;
			const restoreUndeliveredGenericHandoff = async () => {
				if (!bootstrapHandoff || bootstrapHandoff.completion || handoffResponseCompleted) return;
				try {
					await restoreGenericDeviceBootstrapToken({
						record: bootstrapHandoff.record,
						baseDir: options.pairingBaseDir
					});
				} catch (error) {
					options.onError?.("watch node generic bootstrap restore failed", error);
				}
			};
			if (bootstrapToken) {
				const consumed = await consumeSetupHandoff({
					token: bootstrapToken,
					deviceId: derivedDeviceId,
					pairedDeviceMatches: (device) => {
						const currentNodePairing = resolveNodePairingState(device);
						return currentNodePairing?.identity.key === nodePairingState.identity.key && currentNodePairing.generation?.key === nodePairingGeneration.key && bootstrapDeviceTokens.every((grant) => {
							const currentToken = device?.tokens?.[grant.role];
							return currentToken?.token === grant.deviceToken && !currentToken.revokedAtMs;
						});
					},
					baseDir: options.pairingBaseDir,
					ts: now()
				});
				if (!consumed) {
					sendUnauthorized(res);
					return;
				}
				bootstrapHandoff = consumed;
			}
			if (closed || responseLifecycle.isAborted()) {
				await restoreUndeliveredGenericHandoff();
				return;
			}
			const registeredConnect = connect;
			registeredConnect.sessionCapsCeiling = connect.caps ?? [];
			registeredConnect.sessionCommandsCeiling = connect.commands ?? [];
			registeredConnect.declaredCaps = reconciliation.declaredCaps;
			registeredConnect.declaredCommands = reconciliation.declaredCommands;
			registeredConnect.withheldCommands = reconciliation.withheldCommands;
			registeredConnect.declaredComputerUse = reconciliation.declaredComputerUse;
			registeredConnect.declaredPermissions = reconciliation.declaredPermissions;
			registeredConnect.caps = reconciliation.effectiveCaps;
			registeredConnect.commands = reconciliation.effectiveCommands;
			registeredConnect.computerUse = resolveEffectiveComputerUseDescriptor({
				commands: reconciliation.effectiveCommands,
				declared: reconciliation.declaredComputerUse
			});
			registeredConnect.permissions = reconciliation.effectivePermissions;
			let session;
			try {
				const previous = sessionsByNodeId.get(derivedDeviceId);
				const connId = randomUUID();
				session = {
					token: randomBytes(32).toString("base64url"),
					nodeId: derivedDeviceId,
					connId,
					lastSeenAtMs: now(),
					queue: [],
					queuedBytes: 0
				};
				const client = {
					socket: void 0,
					connect: registeredConnect,
					connId,
					isDeviceTokenAuth: true,
					usesSharedGatewayAuth: false,
					clientIp
				};
				const nodeSession = options.nodeRegistry.registerTransport(client, {
					remoteIp: clientIp,
					pairingIdentity: nodePairingState.identity.key,
					pairingGeneration: nodePairingGeneration.key,
					approvedSurface: nodePairingState.approvedSurface
				}, createTransport(session));
				sessionsByToken.set(session.token, session);
				sessionsByNodeId.set(session.nodeId, session);
				armExpiry(session);
				if (previous) closeSession(previous, "replaced by a newer watch session");
				options.onNodeConnected?.(nodeSession);
				sendJson(res, 200, {
					ok: true,
					sessionToken: session.token,
					deviceToken: issuedDeviceToken,
					...bootstrapDeviceTokens.length > 0 ? { deviceTokens: bootstrapDeviceTokens } : {},
					nodeId: session.nodeId,
					protocol: 4,
					pollTimeoutMs: POLL_TIMEOUT_MS
				});
				handoffResponseCompleted = await responseLifecycle.completed;
				if (!handoffResponseCompleted) {
					if (bootstrapHandoff) {
						if (bootstrapHandoff.completion) try {
							broadcastSetupHandoffDeliveryUncertain({
								handoff: bootstrapHandoff,
								broadcast: options.broadcast
							});
						} catch (error) {
							options.onError?.("watch node setup delivery-uncertain broadcast failed", error);
						}
						else await restoreUndeliveredGenericHandoff();
					}
					closeSession(session, "connect response aborted");
					return;
				}
				if (bootstrapHandoff) try {
					const confirmedHandoff = await confirmSetupHandoffDelivery({
						handoff: bootstrapHandoff,
						baseDir: options.pairingBaseDir
					});
					if (confirmedHandoff) broadcastSetupHandoffCompletion({
						handoff: confirmedHandoff,
						broadcast: options.broadcast
					});
					else broadcastSetupHandoffDeliveryUncertain({
						handoff: bootstrapHandoff,
						broadcast: options.broadcast
					});
				} catch (error) {
					options.onError?.("watch node setup completion confirmation failed", error);
					try {
						broadcastSetupHandoffDeliveryUncertain({
							handoff: bootstrapHandoff,
							broadcast: options.broadcast
						});
					} catch {}
				}
				options.rateLimiter?.reset(clientKey, AUTH_RATE_LIMIT_SCOPE_WATCH_CHALLENGE);
				if (reconciliation.shouldClearPendingPairings && cleanupClaim) {
					const claim = cleanupClaim;
					cleanupClaim = void 0;
					try {
						const resolvedPairings = options.nodeReapprovalCoordinator ? await options.nodeReapprovalCoordinator.finalizeCleanup(claim) : await finalizeNodePairingCleanupClaim(claim);
						const resolvedAt = now();
						for (const resolved of resolvedPairings) options.broadcast("node.pair.resolved", {
							requestId: resolved.requestId,
							nodeId: resolved.nodeId,
							decision: "rejected",
							ts: resolvedAt
						}, { dropIfSlow: true });
					} catch (error) {
						options.onError?.("watch node pending-pairing cleanup failed", error);
					}
				}
				recordPairedNodeConnection(session.nodeId, nodeSession.connectedAtMs, options.pairingBaseDir, nodePairingGeneration).catch((error) => options.onError?.("watch node last-connect metadata update failed", error));
			} catch (error) {
				if (session) closeSession(session, "connect failed");
				await restoreUndeliveredGenericHandoff();
				throw error;
			}
		} finally {
			if (cleanupClaim) await releaseNodePairingCleanupClaim(cleanupClaim);
		}
	};
	const handlePoll = async (req, res) => {
		if ((req.method ?? "").toUpperCase() !== "POST") {
			sendMethodNotAllowed(res);
			return;
		}
		await withCurrentSession(req, res, (session) => {
			const queued = session.queue.shift();
			if (queued) {
				session.queuedBytes -= queued.byteLength;
				if (!sendQueuedEvent(res, queued)) closeSession(session, "event delivery failed");
				return;
			}
			if (session.waiter) {
				clearTimeout(session.waiter.timer);
				sendJson(session.waiter.res, 409, {
					ok: false,
					reason: "superseded poll"
				});
			}
			const timer = setTimeout(() => {
				if (session.waiter?.res !== res) return;
				session.waiter = void 0;
				if (!res.writableEnded) sendJson(res, 200, {
					ok: true,
					event: null
				});
			}, POLL_TIMEOUT_MS);
			timer.unref?.();
			session.waiter = {
				res,
				timer
			};
			res.once("close", () => {
				if (!res.writableEnded && session.waiter?.res === res) {
					clearTimeout(session.waiter.timer);
					session.waiter = void 0;
					closeSession(session, "poll connection closed");
				}
			});
		});
	};
	const handleDisconnect = async (req, res) => {
		if ((req.method ?? "").toUpperCase() !== "POST") {
			sendMethodNotAllowed(res);
			return;
		}
		await withCurrentSession(req, res, (session) => {
			closeSession(session, "watch disconnected");
			sendJson(res, 200, { ok: true });
		});
	};
	const handleResult = async (req, res) => {
		if ((req.method ?? "").toUpperCase() !== "POST") {
			sendMethodNotAllowed(res);
			return;
		}
		if (!await getSession(req, res)) return;
		const body = await readJsonBodyOrError(req, res, MAX_BODY_BYTES);
		if (body === void 0) return;
		if (!isRecord(body) || typeof body.id !== "string" || typeof body.ok !== "boolean") {
			sendInvalidRequest(res, "invalid node invoke result");
			return;
		}
		const result = {
			id: body.id,
			ok: body.ok,
			payload: body.payload,
			payloadJSON: typeof body.payloadJSON === "string" ? body.payloadJSON : null,
			error: isRecord(body.error) ? {
				...typeof body.error.code === "string" ? { code: body.error.code } : {},
				...typeof body.error.message === "string" ? { message: body.error.message } : {}
			} : null
		};
		await withCurrentSession(req, res, (session) => {
			const accepted = options.nodeRegistry.handleInvokeResult({
				...result,
				nodeId: session.nodeId,
				connId: session.connId
			});
			sendJson(res, 200, accepted ? { ok: true } : {
				ok: true,
				ignored: true
			});
		});
	};
	const handleRequest = async (req, res) => {
		const path = normalizePath(req);
		if (!path?.startsWith(`${BASE_PATH}/`)) return false;
		if (closed) {
			sendJson(res, 503, {
				ok: false,
				error: "gateway shutting down"
			});
			return true;
		}
		res.setHeader("Cache-Control", "no-store");
		switch (path) {
			case CHALLENGE_PATH:
				handleChallenge(req, res);
				return true;
			case CONNECT_PATH:
				await handleConnect(req, res);
				return true;
			case DISCONNECT_PATH:
				await handleDisconnect(req, res);
				return true;
			case POLL_PATH:
				await handlePoll(req, res);
				return true;
			case RESULT_PATH:
				await handleResult(req, res);
				return true;
			default:
				sendJson(res, 404, {
					ok: false,
					error: "not found"
				});
				return true;
		}
	};
	return {
		handleRequest,
		invalidateSessionsForDevice: (deviceId, opts) => {
			if (opts?.role && opts.role !== "node") return;
			const session = sessionsByNodeId.get(deviceId);
			if (session) session.invalidatedReason = opts?.reason ?? "device-invalidated";
		},
		disconnectSessionsForDevice: (deviceId, opts) => {
			if (opts?.role && opts.role !== "node") return;
			const session = sessionsByNodeId.get(deviceId);
			if (session) closeSession(session, session.invalidatedReason ?? "device removed");
		},
		close: () => {
			closed = true;
			for (const session of sessionsByToken.values()) closeSession(session, "gateway shutting down");
			challenges.clear();
		}
	};
}
//#endregion
export { createWatchNodeHttpRuntime };
