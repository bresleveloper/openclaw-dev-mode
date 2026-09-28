import { s as readRequestBodyWithLimit } from "./http-body-Bl_jph25.mjs";
import { a as createDeferred } from "./extension-shared-N0S3ppSB.mjs";
import "./webhook-request-guards-CccCHICi.mjs";
import { i as isOpenAIGptLiveModel, n as OPENAI_QUICKSILVER_CAPABILITIES, r as isOpenAIGptLiveApiModel, s as resolveOpenAIQuicksilverVoice } from "./realtime-quicksilver-0VQEPDSP.mjs";
import { r as hangupOpenAILiveCall } from "./realtime-live-api-C4qRTnZ1.mjs";
import { o as retireOpenAIQuicksilverSessionWire } from "./realtime-quicksilver-protocol-nZFviYYI.mjs";
import { o as projectOpenAIQuicksilverErrorMessage } from "./realtime-quicksilver-redaction-Cfc2vSbu.mjs";
import { d as hangupOpenAIRealtimeCall, i as buildOpenAIQuicksilverSession, l as createOpenAIQuicksilverCall } from "./realtime-quicksilver-wire-CdGWbOsM.mjs";
import { t as OpenAIQuicksilverDelegationController } from "./realtime-quicksilver-delegation-controller-IGMwvj4X.mjs";
import { a as respondRealtimeOffer, i as rejectOversizedOffer, n as createResponseDeliveryWaiter, r as readOfferBearerToken, t as applyRealtimeOfferCorsHeaders } from "./realtime-quicksilver-offer-http-Cnsa-qWi.mjs";
import { n as reserveOpenAIQuicksilverSession, t as releaseOpenAIQuicksilverSession } from "./realtime-quicksilver-session-limit-D_5q6nOg.mjs";
import { t as connectOpenAIQuicksilverSideband } from "./realtime-quicksilver-sideband-Cr9HsKBe.mjs";
import { t as assertOpenAIRealtimeAudioOnlyOffer } from "./realtime-sdp-offer-DNU1ghm4.mjs";
import { t as createOpenAIRealtimeSessionLease } from "./realtime-session-retirement-8A89M5_X.mjs";
import { randomBytes, randomUUID } from "node:crypto";
import WebSocket$1 from "ws";
//#region extensions/openai/realtime-quicksilver-session.ts
const OPENAI_QUICKSILVER_OFFER_PATH = "/plugins/openai/realtime/calls";
const OPENAI_QUICKSILVER_PENDING_TTL_MS = 6e4;
const OPENAI_QUICKSILVER_SESSION_TTL_MS = 18e5;
const OPENAI_QUICKSILVER_MAX_SDP_BYTES = 262144;
const OPENAI_QUICKSILVER_UPSTREAM_TIMEOUT_MS = 3e4;
function createOpenAIQuicksilverBrowserSessionBroker(params, context) {
	const pendingOffers = /* @__PURE__ */ new Map();
	const inFlightOffers = /* @__PURE__ */ new Map();
	const reservations = /* @__PURE__ */ new Set();
	const shutdownController = new AbortController();
	const createSocket = params.webSocketFactory ?? ((url, options) => new WebSocket$1(url, options));
	let cleanedUp = false;
	let cleanupInFlight;
	const notifyCleanupComplete = () => {
		if (cleanedUp && reservations.size === 0 && pendingOffers.size === 0 && inFlightOffers.size === 0 && activeSessions.size === 0 && retiringSessions.size === 0) params.onCleanupComplete?.();
	};
	const releaseReservation = (token) => {
		reservations.delete(token);
		releaseOpenAIQuicksilverSession(token);
	};
	const expirePendingOffer = (token, offer) => {
		if (pendingOffers.get(token) !== offer) return;
		pendingOffers.delete(token);
		clearTimeout(offer.timer);
		releaseReservation(token);
		try {
			offer.request.gatewayControl?.onClose?.("completed");
		} catch {
			params.logger.warn("OpenAI realtime terminal callback failed");
		}
	};
	const activeSessionLease = createOpenAIRealtimeSessionLease({
		logger: params.logger,
		releaseReservation,
		onSettled: notifyCleanupComplete
	});
	const { activeSessions, retiringSessions } = activeSessionLease;
	const attachSidebandHandlers = (session) => {
		if (!session.socket) return;
		const socket = session.socket;
		socket.on("message", (data, isBinary) => {
			session.handleFrame?.(data, isBinary);
		});
		socket.on("error", () => {
			const transportError = new Error(projectOpenAIQuicksilverErrorMessage("transport"));
			params.logger.warn(transportError.message);
			activeSessionLease.close(session, "abort", transportError).catch(() => void 0);
		});
		socket.on("close", (code) => {
			const error = code === 1e3 ? void 0 : new Error(projectOpenAIQuicksilverErrorMessage("transport"));
			activeSessionLease.close(session, "abort", error).catch(() => void 0);
		});
	};
	const prunePendingOffers = () => {
		const now = Date.now();
		for (const [token, offer] of pendingOffers) if (offer.expiresAt <= now) expirePendingOffer(token, offer);
	};
	const broker = {
		capabilities: OPENAI_QUICKSILVER_CAPABILITIES,
		createBrowserSession: async (request, auth) => {
			if (cleanedUp || shutdownController.signal.aborted) throw new Error("OpenAI GPT-Live sessions are stopping; restart Gateway and try again");
			const model = request.model?.trim();
			if (!model) throw new Error("OpenAI realtime browser sessions require a model");
			const isGptLive = isOpenAIGptLiveModel(model);
			if (isGptLive && !request.runAgentConsult) throw new Error("OpenAI GPT-Live requires the Gateway agent-consult runtime");
			let nativeControl;
			if (isGptLive && request.clientControl?.owner === "gateway") {
				const control = request.gatewayControl;
				if (!control?.bindControl) throw new Error("Native realtime Gateway control requires the host control binding");
				nativeControl = {
					...control,
					bindControl: control.bindControl
				};
			}
			if (!isGptLive) {
				if (!request.gaSession) throw new Error("OpenAI GA realtime browser sessions require an initial session policy");
				if (request.gaSession.model !== model) throw new Error("OpenAI GA realtime session policy model must match the requested model");
			}
			prunePendingOffers();
			const voice = isGptLive ? resolveOpenAIQuicksilverVoice(model, request.voice) : request.voice;
			const token = randomBytes(32).toString("base64url");
			const expiresAt = Date.now() + OPENAI_QUICKSILVER_PENDING_TTL_MS;
			reserveOpenAIQuicksilverSession(token, {
				expiresAtMs: expiresAt,
				ownerConnId: request.clientControl?.owner === "gateway" ? request.ownerConnId : void 0
			});
			const offer = {
				auth,
				expiresAt,
				requestIds: {
					realtimeSessionId: randomUUID(),
					sessionId: randomUUID(),
					threadId: randomUUID()
				},
				request: {
					...request,
					model,
					voice
				},
				nativeControl,
				timer: setTimeout(() => expirePendingOffer(token, offer), OPENAI_QUICKSILVER_PENDING_TTL_MS)
			};
			offer.timer.unref?.();
			pendingOffers.set(token, offer);
			reservations.add(token);
			return {
				provider: "openai",
				transport: "webrtc",
				clientSecret: token,
				offerUrl: OPENAI_QUICKSILVER_OFFER_PATH,
				offerResponseMaxBytes: 262144,
				...request.gaSideband ? {} : {
					model,
					voice
				},
				expiresAt
			};
		},
		cancelBrowserSession: async (session) => {
			if (session.transport !== "webrtc") return;
			const pending = pendingOffers.get(session.clientSecret);
			if (pending) {
				pendingOffers.delete(session.clientSecret);
				clearTimeout(pending.timer);
			}
			const inFlight = inFlightOffers.get(session.clientSecret);
			inFlight?.controller.abort(/* @__PURE__ */ new Error("OpenAI realtime session canceled"));
			const active = activeSessions.get(session.clientSecret) ?? retiringSessions.get(session.clientSecret);
			if (active) await activeSessionLease.close(active, "detach");
			else if (inFlight) await inFlight.completed;
			else releaseReservation(session.clientSecret);
		}
	};
	const handleOffer = async (req, res) => {
		if (!applyRealtimeOfferCorsHeaders(req, res, params.getConfig())) {
			respondRealtimeOffer(res, 403, "Origin not allowed");
			return true;
		}
		if (req.method === "OPTIONS") {
			res.statusCode = 204;
			res.setHeader("cache-control", "no-store");
			res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
			res.setHeader("Access-Control-Allow-Headers", "Authorization, Content-Type");
			res.setHeader("Vary", "Origin, Access-Control-Request-Method, Access-Control-Request-Headers");
			if (req.headers["access-control-request-private-network"] === "true") res.setHeader("Access-Control-Allow-Private-Network", "true");
			res.setHeader("Access-Control-Max-Age", "600");
			res.end();
			return true;
		}
		if (req.method !== "POST") {
			respondRealtimeOffer(res, 405, "Method not allowed");
			return true;
		}
		if (req.headers["content-type"]?.split(";", 1)[0]?.trim().toLowerCase() !== "application/sdp") {
			respondRealtimeOffer(res, 415, "Expected application/sdp");
			return true;
		}
		prunePendingOffers();
		const token = readOfferBearerToken(req);
		const offer = token ? pendingOffers.get(token) : void 0;
		if (!token || !offer || offer.expiresAt <= Date.now()) {
			respondRealtimeOffer(res, 401, "Invalid or expired realtime session token");
			return true;
		}
		reserveOpenAIQuicksilverSession(token, { ownerConnId: offer.request.clientControl?.owner === "gateway" ? offer.request.ownerConnId : void 0 });
		pendingOffers.delete(token);
		clearTimeout(offer.timer);
		const requestController = new AbortController();
		let browserDisconnected = false;
		const completion = createDeferred();
		completion.promise.catch(() => void 0);
		inFlightOffers.set(token, {
			controller: requestController,
			completed: completion.promise
		});
		const abortFromBrowser = () => {
			browserDisconnected = true;
			requestController.abort(/* @__PURE__ */ new Error("Browser GPT-Live offer request closed"));
		};
		req.once("aborted", abortFromBrowser);
		res.once("close", abortFromBrowser);
		const detachBrowserAbort = () => {
			req.removeListener("aborted", abortFromBrowser);
			res.removeListener("close", abortFromBrowser);
		};
		const lifecycleSignal = AbortSignal.any([shutdownController.signal, requestController.signal]);
		let session;
		let responseDeliveryWaiter;
		let terminalReported = false;
		const reportTerminal = (error) => {
			if (terminalReported) return;
			terminalReported = true;
			try {
				try {
					if (error) offer.request.gatewayControl?.onError?.(error);
				} finally {
					offer.request.gatewayControl?.onClose?.(error ? "error" : "completed");
				}
			} catch {
				params.logger.warn("OpenAI realtime terminal callback failed");
			}
		};
		const deliverActiveAnswer = async (status, answerSdp) => {
			responseDeliveryWaiter = createResponseDeliveryWaiter(res, detachBrowserAbort);
			respondRealtimeOffer(res, status, answerSdp, "application/sdp");
			const delivered = await responseDeliveryWaiter.result;
			responseDeliveryWaiter = void 0;
			return delivered;
		};
		try {
			const offerStartedAt = Date.now();
			const sdp = await readRequestBodyWithLimit(req, {
				maxBytes: OPENAI_QUICKSILVER_MAX_SDP_BYTES,
				timeoutMs: 15e3,
				destroyOnLimit: false
			});
			try {
				if (!sdp.trim()) throw new Error("SDP offer is required");
				if (offer.request.clientControl?.owner === "gateway") assertOpenAIRealtimeAudioOnlyOffer(sdp);
			} catch (error) {
				const failure = error instanceof Error ? error : /* @__PURE__ */ new Error("Invalid SDP offer");
				reportTerminal(failure);
				respondRealtimeOffer(res, 400, failure.message);
				return true;
			}
			const upstreamSignal = AbortSignal.any([lifecycleSignal, AbortSignal.timeout(OPENAI_QUICKSILVER_UPSTREAM_TIMEOUT_MS)]);
			const sessionConfig = isOpenAIGptLiveModel(offer.request.model) ? buildOpenAIQuicksilverSession({
				model: offer.request.model,
				hostControlsInput: Boolean(offer.nativeControl?.handleDelegationInput),
				instructions: offer.request.instructions,
				voice: offer.request.voice,
				initialItems: offer.request.initialItems
			}) : offer.request.gaSession;
			if (!sessionConfig) throw new Error("OpenAI GA realtime browser sessions require an initial session policy");
			const gaSideband = offer.request.gaSideband;
			const publicApi = isOpenAIGptLiveApiModel(offer.request.model);
			const adoptAllocatedCall = (callId) => {
				const hangup = publicApi ? hangupOpenAILiveCall : hangupOpenAIRealtimeCall;
				session = activeSessionLease.adopt(token, {
					...publicApi ? { retire: reportTerminal } : {},
					dispose: () => hangup({
						apiKey: offer.auth.token,
						callId,
						signal: AbortSignal.timeout(OPENAI_QUICKSILVER_UPSTREAM_TIMEOUT_MS),
						fetchImpl: params.fetchImpl
					}, context)
				});
				activeSessionLease.expireIn(session, OPENAI_QUICKSILVER_SESSION_TTL_MS);
			};
			if (gaSideband) {
				if (offer.auth.type !== "api-key") throw new Error("OpenAI Realtime Gateway control requires a Platform API key");
				const callStartedAt = Date.now();
				const call = await createOpenAIQuicksilverCall({
					auth: offer.auth,
					requestIds: offer.requestIds,
					sdp,
					session: sessionConfig,
					gaSideband: true,
					onCallAllocated: adoptAllocatedCall,
					signal: upstreamSignal,
					fetchImpl: params.fetchImpl
				}, context);
				const active = activeSessions.get(token);
				if (call.kind !== "ga-sideband" || !active) throw new Error("OpenAI Realtime call did not retain an active sideband session");
				const callCreatedAt = Date.now();
				lifecycleSignal.throwIfAborted();
				const bridge = gaSideband.createBridge({
					apiKey: offer.auth.token,
					callId: call.callId,
					onTerminal: () => {
						if (activeSessions.get(token) === active) activeSessionLease.close(active).catch(() => void 0);
					}
				});
				active.retire = () => bridge.close();
				if (activeSessions.get(token) !== active) {
					await bridge.close();
					throw new Error("OpenAI Realtime sideband stopped during construction");
				}
				lifecycleSignal.throwIfAborted();
				await bridge.connect();
				if (lifecycleSignal.aborted || activeSessions.get(token) !== active) throw lifecycleSignal.reason ?? /* @__PURE__ */ new Error("OpenAI Realtime sideband stopped during startup");
				const sidebandReadyAt = Date.now();
				const metrics = {
					callCreateMs: callCreatedAt - callStartedAt,
					sidebandReadyMs: sidebandReadyAt - callCreatedAt,
					totalOfferMs: sidebandReadyAt - offerStartedAt
				};
				params.logger.debug?.(`OpenAI Realtime sideband offer ready ${JSON.stringify(metrics)}`);
				await activeSessionLease.deliverAnswer(active, lifecycleSignal, () => deliverActiveAnswer(call.status, call.answerSdp));
				return true;
			}
			const call = await createOpenAIQuicksilverCall({
				auth: offer.auth,
				requestIds: offer.requestIds,
				sdp,
				session: sessionConfig,
				onCallAllocated: publicApi ? adoptAllocatedCall : void 0,
				signal: upstreamSignal,
				fetchImpl: params.fetchImpl
			}, context);
			if (call.kind === "ga-realtime") {
				respondRealtimeOffer(res, call.status, call.answerSdp, "application/sdp");
				return true;
			}
			const runAgentConsult = offer.request.runAgentConsult;
			if (!runAgentConsult) throw new Error("OpenAI GPT-Live requires the Gateway agent-consult runtime");
			const connected = await connectOpenAIQuicksilverSideband({
				auth: offer.auth,
				createSocket,
				requestIds: offer.requestIds,
				signal: lifecycleSignal,
				url: call.sidebandUrl
			}, context);
			if (lifecycleSignal.aborted) {
				connected.socket.close(1e3, "session stopped");
				throw lifecycleSignal.reason;
			}
			const abortController = new AbortController();
			let providerFinalized = false;
			const nativeControl = offer.nativeControl;
			const delegations = new OpenAIQuicksilverDelegationController({
				getSocket: () => connected.socket,
				logger: params.logger,
				model: offer.request.model,
				onError: (error) => offer.request.gatewayControl?.onError?.(error),
				onFatalError: (error) => {
					if (session) activeSessionLease.close(session, "abort", error).catch(() => void 0);
				},
				onSessionClosed: (reason) => {
					providerFinalized = true;
					if (session) {
						session.dispose = void 0;
						const error = reason === "content" || reason === "connection_lost" ? /* @__PURE__ */ new Error("GPT-Live session ended with a provider or connection failure") : void 0;
						activeSessionLease.close(session, "abort", error).catch(() => void 0);
					}
				},
				onTranscript: publicApi ? offer.request.gatewayControl?.onTranscript : nativeControl?.onTranscript,
				onSessionStarted: (expiresAt) => {
					if (session && expiresAt !== void 0) {
						const upstreamTtlMs = expiresAt * 1e3 - Date.now();
						activeSessionLease.expireIn(session, Math.min(OPENAI_QUICKSILVER_SESSION_TTL_MS, upstreamTtlMs));
					}
				},
				...nativeControl ? {
					handleDelegationInput: nativeControl.handleDelegationInput,
					onWireEventType: (type) => nativeControl.onEvent?.({
						direction: "server",
						type
					})
				} : {},
				runAgentConsult,
				signal: abortController.signal
			}, context.formatErrorMessage);
			const sessionWire = {
				detach: () => publicApi ? delegations.beginTranscriptDrain("detach") : delegations.detach(),
				retire: (error) => retireOpenAIQuicksilverSessionWire({
					model: offer.request.model,
					socket: connected.socket,
					delegations,
					controller: abortController,
					isFinalized: () => providerFinalized,
					reportTerminal,
					error
				}),
				handleFrame: (data, isBinary) => delegations.handleFrame(data, isBinary),
				socket: connected.socket
			};
			session = session ? Object.assign(session, sessionWire) : activeSessionLease.adopt(token, sessionWire);
			activeSessionLease.expireIn(session, OPENAI_QUICKSILVER_SESSION_TTL_MS);
			nativeControl?.bindControl({ sendUserMessage: (text) => delegations.sendSessionContext(text, "speakable") });
			attachSidebandHandlers(session);
			const terminalEvent = connected.detachBuffer();
			for (const frame of connected.bufferedFrames) session.handleFrame?.(frame.data, frame.isBinary);
			if (terminalEvent && activeSessions.get(token) === session) {
				if (terminalEvent.kind === "error") params.logger.warn(projectOpenAIQuicksilverErrorMessage("transport"));
				await activeSessionLease.close(session, "abort", new Error(projectOpenAIQuicksilverErrorMessage("transport")));
			}
			if (activeSessions.get(token) !== session) throw new Error("OpenAI GPT-Live sideband failed during startup");
			offer.request.gatewayControl?.onReady?.();
			if (lifecycleSignal.aborted || activeSessions.get(token) !== session) throw new Error("OpenAI GPT-Live session closed during readiness notification");
			await activeSessionLease.deliverAnswer(session, lifecycleSignal, () => deliverActiveAnswer(200, call.answerSdp));
			return true;
		} catch (error) {
			const publicSessionError = isOpenAIGptLiveModel(offer.request.model) || offer.request.gaSideband && session ? new Error(projectOpenAIQuicksilverErrorMessage("transport")) : error instanceof Error ? error : /* @__PURE__ */ new Error("OpenAI realtime session failed");
			if (offer.request.gaSideband || !session) reportTerminal(publicSessionError);
			if (session && activeSessions.get(token) === session) await activeSessionLease.close(session, "abort", publicSessionError).catch(() => void 0);
			if (browserDisconnected || res.headersSent) return true;
			if (await rejectOversizedOffer(req, res, error)) return true;
			respondRealtimeOffer(res, 502, publicSessionError.message);
			return true;
		} finally {
			responseDeliveryWaiter?.cancel();
			detachBrowserAbort();
			const [retirement] = await Promise.allSettled([session?.initialRetirement]);
			inFlightOffers.delete(token);
			if (!session) releaseReservation(token);
			if (retirement?.status === "rejected") completion.reject(retirement.reason);
			else completion.resolve();
			notifyCleanupComplete();
		}
	};
	const cleanup = () => {
		if (cleanupInFlight) return cleanupInFlight;
		cleanedUp = true;
		cleanupInFlight = Promise.resolve().then(async () => {
			const closingSessions = [...activeSessions.values(), ...retiringSessions.values()].map((session) => activeSessionLease.close(session));
			const failures = (await Promise.allSettled([...Array.from(inFlightOffers.values(), ({ completed }) => completed), ...closingSessions])).flatMap((result) => result.status === "rejected" ? [result.reason] : []);
			if (failures.length > 0 || retiringSessions.size > 0) throw new AggregateError(failures, "OpenAI realtime remote cleanup remains incomplete");
			notifyCleanupComplete();
		});
		shutdownController.abort(/* @__PURE__ */ new Error("OpenAI realtime broker stopped"));
		for (const [token, offer] of pendingOffers) expirePendingOffer(token, offer);
		for (const { controller } of inFlightOffers.values()) controller.abort(/* @__PURE__ */ new Error("OpenAI realtime broker stopped"));
		return cleanupInFlight.finally(() => {
			cleanupInFlight = void 0;
		});
	};
	return {
		broker,
		handler: handleOffer,
		cleanup,
		getSessionCounts: () => ({
			pending: pendingOffers.size,
			inFlight: inFlightOffers.size,
			active: activeSessions.size,
			reservations: reservations.size
		})
	};
}
//#endregion
export { createOpenAIQuicksilverBrowserSessionBroker as n, OPENAI_QUICKSILVER_OFFER_PATH as t };
