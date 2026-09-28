import { l as resolveFaceTimeConfig, n as ensureCaptureBinary, r as ensureHelperArtifacts, s as installFaceTimeDriver, t as runFaceTimeSetup, u as validateFaceTimeConfig } from "./.setup/setup-DUgC9yE7.mjs";
import { formatErrorMessage } from "openclaw/plugin-sdk/error-runtime";
import { REALTIME_VOICE_AGENT_CONSULT_SENDER_AUTH_VERSION, REALTIME_VOICE_AGENT_CONSULT_TOOL_NAME, REALTIME_VOICE_AUDIO_FORMAT_PCM16_24KHZ, buildRealtimeVoiceAgentCancelProviderResult, buildRealtimeVoiceAgentConsultPolicyInstructions, buildRealtimeVoiceAgentConsultWorkingResponse, consultRealtimeVoiceAgent, createRealtimeVoiceBridgeSession, createTalkSessionController, getRealtimeVoiceProvider, recordRealtimeVoiceTranscript, recordTalkObservabilityEvent, resolveConfiguredRealtimeVoiceProvider, resolveRealtimeVoiceAgentConsultTools, resolveRealtimeVoiceAgentConsultToolsAllow } from "openclaw/plugin-sdk/realtime-voice";
import { asBoolean, asRecord, normalizeOptionalString } from "openclaw/plugin-sdk/string-coerce-runtime";
import { resolve } from "node:path";
import { constants, existsSync } from "node:fs";
import { access } from "node:fs/promises";
import { createHmac, randomUUID, timingSafeEqual } from "node:crypto";
import { createDeferred } from "openclaw/plugin-sdk/extension-shared";
import net from "node:net";
import { sleepWithAbort } from "openclaw/plugin-sdk/runtime-env";
import { spawn } from "node:child_process";
import { resolveDefaultAgentId } from "openclaw/plugin-sdk/agent-runtime";
import { parseAgentSessionKey, resolveAgentIdFromSessionKey } from "openclaw/plugin-sdk/routing";
import { resolveConfiguredSecretInputString } from "openclaw/plugin-sdk/secret-input-runtime";
import { resolveRealtimeBootstrapContextInstructions } from "openclaw/plugin-sdk/realtime-bootstrap-context";
//#region extensions/facetime/src/call-events.ts
const TU_CALL_STATUS = {
	outgoingCreated: 0,
	active: 1,
	outgoingRinging: 3,
	incomingRinging: 4
};
function readFiniteNumber(value) {
	const number = typeof value === "number" ? value : typeof value === "string" ? Number(value) : NaN;
	return Number.isFinite(number) ? number : void 0;
}
function normalizeCallTransport(value) {
	const transport = asRecord(value);
	const base = {
		classifierVersion: "tu-provider-v1",
		service: readFiniteNumber(transport.service),
		faceTimeTransportType: readFiniteNumber(transport.facetime_transport_type ?? transport.faceTimeTransportType),
		providerClassified: asBoolean(transport.provider_classified ?? transport.providerClassified),
		providerIsFaceTime: asBoolean(transport.provider_is_facetime ?? transport.providerIsFaceTime),
		providerIsTelephony: asBoolean(transport.provider_is_telephony ?? transport.providerIsTelephony),
		isUsingBaseband: asBoolean(transport.is_using_baseband ?? transport.isUsingBaseband),
		isWifiCall: asBoolean(transport.is_wifi_call ?? transport.isWifiCall),
		isVoip: asBoolean(transport.is_voip ?? transport.isVoip),
		isEmergency: asBoolean(transport.is_emergency ?? transport.isEmergency)
	};
	if (transport.kind === "facetime" && (transport.classifier_version === "tu-provider-v1" || transport.classifierVersion === "tu-provider-v1") && (base.service === 2 || base.service === 3) && base.providerClassified === true && base.providerIsFaceTime === true && base.providerIsTelephony === false && base.isUsingBaseband === false && base.isWifiCall === false && base.isVoip === true && base.isEmergency === false) return {
		kind: "facetime",
		classifierVersion: base.classifierVersion,
		service: base.service,
		...base.faceTimeTransportType !== void 0 ? { faceTimeTransportType: base.faceTimeTransportType } : {},
		providerClassified: true,
		providerIsFaceTime: true,
		providerIsTelephony: false,
		isUsingBaseband: false,
		isWifiCall: false,
		isVoip: true,
		isEmergency: false
	};
	return {
		kind: transport.kind === "cellular" ? "cellular" : "unknown",
		classifierVersion: base.classifierVersion,
		...base.service !== void 0 ? { service: base.service } : {},
		...base.faceTimeTransportType !== void 0 ? { faceTimeTransportType: base.faceTimeTransportType } : {},
		...base.providerClassified !== void 0 ? { providerClassified: base.providerClassified } : {},
		...base.providerIsFaceTime !== void 0 ? { providerIsFaceTime: base.providerIsFaceTime } : {},
		...base.providerIsTelephony !== void 0 ? { providerIsTelephony: base.providerIsTelephony } : {},
		...base.isUsingBaseband !== void 0 ? { isUsingBaseband: base.isUsingBaseband } : {},
		...base.isWifiCall !== void 0 ? { isWifiCall: base.isWifiCall } : {},
		...base.isVoip !== void 0 ? { isVoip: base.isVoip } : {},
		...base.isEmergency !== void 0 ? { isEmergency: base.isEmergency } : {}
	};
}
const handleValueKeys = /* @__PURE__ */ new Set([
	"address",
	"email",
	"emailAddress",
	"handle",
	"normalizedValue",
	"phoneNumber",
	"unformattedPhoneNumber",
	"value"
]);
function collectHandleCandidates(value, candidates = [], seen = /* @__PURE__ */ new Set()) {
	const direct = normalizeOptionalString(value);
	if (direct) {
		candidates.push(direct);
		return candidates;
	}
	if (!value || typeof value !== "object" || seen.has(value)) return candidates;
	seen.add(value);
	const record = asRecord(value);
	for (const [key, nested] of Object.entries(record)) if (handleValueKeys.has(key)) collectHandleCandidates(nested, candidates, seen);
	else if (nested && typeof nested === "object") collectHandleCandidates(nested, candidates, seen);
	return candidates;
}
function normalizeFaceTimeHandleCandidates(value) {
	return [...new Set(collectHandleCandidates(value).map((candidate) => candidate.trim()))];
}
function normalizeFaceTimeHandle(value) {
	return normalizeFaceTimeHandleCandidates(value)[0];
}
function canonicalizeFaceTimeHandle(value) {
	const stripped = value.trim().toLowerCase().replace(/^mailto:/, "").replace(/^tel:/, "").replace(/^facetime-audio:/, "").replace(/^facetime:/, "");
	return stripped.includes("@") ? stripped : stripped.replace(/[^\d+]/g, "");
}
function normalizeFaceTimeCallEvent(value) {
	const record = asRecord(value);
	if (record.event !== "ft-call-status-changed") return;
	const data = asRecord(record.data);
	const callUUID = normalizeOptionalString(data.call_uuid);
	const proxyIdentifier = normalizeOptionalString(data.proxy_identifier);
	const conversationUUID = normalizeOptionalString(data.conversation_uuid);
	const conversationGroupUUID = normalizeOptionalString(data.conversation_group_uuid);
	const conversationAVMode = typeof data.conversation_av_mode === "number" ? data.conversation_av_mode : typeof data.conversation_av_mode === "string" ? Number(data.conversation_av_mode) : void 0;
	const conversationResolvedAVMode = typeof data.conversation_resolved_audio_video_mode === "number" ? data.conversation_resolved_audio_video_mode : typeof data.conversation_resolved_audio_video_mode === "string" ? Number(data.conversation_resolved_audio_video_mode) : void 0;
	const status = typeof data.call_status === "number" ? data.call_status : typeof data.call_status === "string" ? Number(data.call_status) : void 0;
	if (!callUUID || !Number.isInteger(status)) return;
	return {
		event: "ft-call-status-changed",
		data: {
			...data,
			call_uuid: callUUID,
			proxy_identifier: proxyIdentifier,
			call_status: status,
			conversation_uuid: conversationUUID,
			conversation_group_uuid: conversationGroupUUID,
			conversation_audio_enabled: data.conversation_audio_enabled === true,
			conversation_video_enabled: data.conversation_video_enabled === true,
			conversation_av_mode: Number.isInteger(conversationAVMode) ? conversationAVMode : void 0,
			conversation_resolved_audio_video_mode: Number.isInteger(conversationResolvedAVMode) ? conversationResolvedAVMode : void 0,
			is_outgoing: data.is_outgoing === true,
			has_ended: data.has_ended === true,
			is_sending_audio: data.is_sending_audio === true,
			is_sending_transmission: data.is_sending_transmission === true,
			is_sending_video: data.is_sending_video === true,
			is_uplink_muted: data.is_uplink_muted === true,
			local_meter_level: readFiniteNumber(data.local_meter_level),
			remote_meter_level: readFiniteNumber(data.remote_meter_level),
			transport: normalizeCallTransport(data.transport)
		}
	};
}
function resolveAuthorizedFaceTimeOwner(params) {
	if (!isVerifiedFaceTimeTransport(params.event)) return;
	const ownerHandles = new Set(params.ownerHandles.map(canonicalizeFaceTimeHandle).filter(Boolean));
	const senderId = normalizeFaceTimeHandleCandidates(params.event.data.handle).map(canonicalizeFaceTimeHandle).find((candidate) => ownerHandles.has(candidate));
	if (!senderId) return;
	return {
		senderId,
		senderIsOwner: true
	};
}
function isVerifiedFaceTimeTransport(event) {
	return isVerifiedFaceTimeTransportEvidence(event.data.transport);
}
function isVerifiedFaceTimeTransportEvidence(value) {
	return normalizeCallTransport(value).kind === "facetime";
}
function isAuthorizedFaceTimeHandle(params) {
	const canonicalHandle = canonicalizeFaceTimeHandle(params.handle);
	return canonicalHandle.length > 0 && params.ownerHandles.some((entry) => canonicalizeFaceTimeHandle(entry) === canonicalHandle);
}
function isIncomingRingingCall(event) {
	return event.data.call_status === TU_CALL_STATUS.incomingRinging && event.data.is_outgoing !== true;
}
function isActiveCall(event) {
	return event.data.call_status === TU_CALL_STATUS.active;
}
function isOutgoingRingingCall(event) {
	return (event.data.call_status === TU_CALL_STATUS.outgoingCreated || event.data.call_status === TU_CALL_STATUS.outgoingRinging) && event.data.is_outgoing === true;
}
function isEndedCall(event) {
	return event.data.has_ended === true;
}
function isUnknownCallStatus(event) {
	return !isIncomingRingingCall(event) && !isOutgoingRingingCall(event) && !isActiveCall(event) && !isEndedCall(event);
}
//#endregion
//#region extensions/facetime/src/call-lifecycle.ts
function normalizeCallIdentity(value) {
	return value.trim().toLowerCase();
}
var FaceTimeCallInstance = class {
	#carrierClosure;
	#commandTail;
	constructor(canonicalId, phase) {
		this.canonicalId = canonicalId;
		this.lifecycleAbort = new AbortController();
		this.aliases = /* @__PURE__ */ new Set();
		this.generation = 1;
		this.modelMediaMode = "starting";
		this.#carrierClosure = createDeferred();
		this.carrierClosure = this.#carrierClosure.promise;
		this.#commandTail = Promise.resolve();
		this.phase = phase;
		this.carrierMode = phase === "ringing" ? "ringing" : "muted";
		this.aliases.add(normalizeCallIdentity(canonicalId));
	}
	get identity() {
		return {
			canonical: this.canonicalId,
			aliases: this.aliases
		};
	}
	captureGeneration() {
		return this.generation;
	}
	assertCurrent(generation, allowClosing = false) {
		const phaseAllowed = allowClosing ? this.phase !== "closed" && this.carrierMode !== "closed" : this.phase !== "closing" && this.phase !== "closed";
		if (generation !== this.generation || !phaseAllowed || !allowClosing && this.lifecycleAbort.signal.aborted) throw new Error("FaceTime call lifecycle changed during carrier command");
	}
	async runCarrierCommand(params) {
		const previous = this.#commandTail;
		let release = () => {};
		this.#commandTail = new Promise((resolve) => {
			release = resolve;
		});
		await previous;
		try {
			this.assertCurrent(params.generation, params.allowClosing);
			const result = await params.action();
			this.assertCurrent(params.generation, params.allowClosing);
			return result;
		} finally {
			release();
		}
	}
	beginAnswering() {
		if (this.phase !== "ringing") throw new Error(`cannot answer FaceTime call in ${this.phase} phase`);
		this.phase = "answering";
		this.carrierMode = "muted";
		return this.generation;
	}
	markCarrierActive(generation) {
		this.assertCurrent(generation);
		this.phase = "active";
		this.carrierMode = "active";
	}
	markModelReady(generation) {
		this.assertCurrent(generation);
		this.modelMediaMode = "ready";
	}
	markModelActive(generation) {
		this.assertCurrent(generation);
		this.modelMediaMode = "active";
	}
	suspendModelMedia() {
		if (this.modelMediaMode !== "closed") this.modelMediaMode = "suspended";
	}
	beginClosing() {
		if (this.phase === "closed") return this.generation;
		if (this.phase !== "closing") {
			this.generation += 1;
			this.phase = "closing";
			this.carrierMode = "closing";
			this.suspendModelMedia();
			this.lifecycleAbort.abort(/* @__PURE__ */ new Error("FaceTime call is closing"));
		}
		return this.generation;
	}
	markCarrierClosed() {
		this.beginClosing();
		this.carrierMode = "closed";
		this.#carrierClosure.resolve(void 0);
	}
	markClosed() {
		this.phase = "closed";
		this.carrierMode = "closed";
		this.modelMediaMode = "closed";
	}
};
var FaceTimeCallRegistry = class {
	#active;
	#aliases = /* @__PURE__ */ new Map();
	get active() {
		return this.#active;
	}
	get size() {
		return this.#active && this.#active.phase !== "closed" ? 1 : 0;
	}
	values() {
		return (this.#active && this.#active.phase !== "closed" ? [this.#active] : [])[Symbol.iterator]();
	}
	get(identity) {
		return this.resolve(identity);
	}
	has(identity) {
		return this.resolve(identity) !== void 0;
	}
	create(call) {
		if (this.#active && this.#active.phase !== "closed") throw new Error("another FaceTime call lifecycle is already active");
		this.#active = call;
		for (const alias of call.aliases) this.#aliases.set(alias, call);
	}
	resolve(identity) {
		return this.#aliases.get(normalizeCallIdentity(identity));
	}
	retainAlias(call, identity) {
		if (this.#active !== call || call.phase === "closed") throw new Error("cannot retain an alias for an inactive FaceTime call");
		const alias = normalizeCallIdentity(identity);
		const existing = this.#aliases.get(alias);
		if (existing && existing !== call) throw new Error("FaceTime call alias already belongs to another lifecycle");
		call.aliases.add(alias);
		this.#aliases.set(alias, call);
	}
	close(call) {
		if (this.#active !== call) return;
		call.markClosed();
		for (const alias of call.aliases) if (this.#aliases.get(alias) === call) this.#aliases.delete(alias);
		this.#active = void 0;
	}
};
//#endregion
//#region extensions/facetime/helper-endpoint.json
var host = "127.0.0.1";
var basePort = 45670;
var maxPort = 65535;
//#endregion
//#region extensions/facetime/src/helper-endpoint.ts
function resolveFaceTimeHelperEndpoint(uid = typeof process.getuid === "function" ? process.getuid() : 501) {
	if (host !== "127.0.0.1" || !Number.isSafeInteger(basePort) || !Number.isSafeInteger(maxPort) || basePort < 1024 || maxPort > 65535 || basePort > maxPort || !Number.isSafeInteger(uid)) throw new Error("Invalid FaceTime loopback helper endpoint contract");
	return {
		host,
		port: Math.min(Math.max(basePort + uid - 501, basePort), maxPort)
	};
}
//#endregion
//#region extensions/facetime/src/helper-results.ts
var FaceTimeHelperActionError = class extends Error {
	constructor(message) {
		super(message);
		this.name = "FaceTimeHelperActionError";
	}
};
var FaceTimeHelperAmbiguousError = class extends Error {
	constructor(message, result = {}) {
		super(message);
		this.result = result;
		this.name = "FaceTimeHelperAmbiguousError";
	}
};
var FaceTimeHelperUnavailableError = class extends Error {
	constructor(message) {
		super(message);
		this.name = "FaceTimeHelperUnavailableError";
	}
};
function readHelperResults(result) {
	return Array.isArray(result.helperResults) ? result.helperResults.filter((entry) => Boolean(entry && typeof entry === "object")) : [result];
}
function requireCompleteTopology(result) {
	const results = readHelperResults(result);
	if (result.topologyComplete !== true || typeof result.helpersContacted !== "number" || results.length !== result.helpersContacted) throw new FaceTimeHelperAmbiguousError("FaceTime helper topology was incomplete", result);
	return results;
}
function projectFaceTimeNativeAction(action, result) {
	const present = requireCompleteTopology(result).filter((entry) => entry.outcome !== "absent");
	if (present.length === 0) throw new FaceTimeHelperAmbiguousError(`FaceTime ${action} carrier owner is missing`, result);
	if (action === "unmute" && present.every((observed) => observed.muted === false && observed.is_uplink_muted === false && typeof observed.conversation_audio_error !== "string")) return { status: "media-active" };
	if (action === "answer" && present.every((observed) => observed.outcome === "answered-muted" && observed.muted === true && observed.is_uplink_muted === true)) return { status: "answered-muted" };
	if (action === "safe-mute" && present.every((observed) => observed.downlink_muted === true && observed.muted === true && observed.is_uplink_muted === true)) return { status: "safe-muted" };
	if (action === "activate" && present.every((observed) => observed.muted === false && observed.is_uplink_muted === false && observed.is_sending_audio === true && observed.is_sending_transmission === true && typeof observed.conversation_audio_error !== "string")) return { status: "media-active" };
	if (action === "terminate" && present.every((observed) => observed.outcome === "termination-requested")) return { status: "termination-requested" };
	throw new FaceTimeHelperActionError(`FaceTime ${action} postcondition was not observed`);
}
function projectCompleteFaceTimeAbsence(result) {
	if (!requireCompleteTopology(result).every((entry) => entry.outcome === "absent" && entry.found === false)) throw new FaceTimeHelperAmbiguousError("FaceTime carrier is still present", result);
	if (typeof result.topologyGeneration !== "number") throw new FaceTimeHelperAmbiguousError("FaceTime topology generation is missing", result);
	return {
		status: "absent",
		topologyGeneration: result.topologyGeneration
	};
}
//#endregion
//#region extensions/facetime/src/helper-rpc.ts
const FACETIME_DIAL_HELPER_BUNDLES = /* @__PURE__ */ new Set(["com.apple.FaceTime", "com.apple.FaceTime.FTConversationService"]);
const FACETIME_HELPER_BUNDLES = /* @__PURE__ */ new Set([
	...FACETIME_DIAL_HELPER_BUNDLES,
	"com.apple.mobilephone",
	"com.apple.TelephonyUtilities"
]);
const MAX_FRAME_BYTES = 65536;
const MAX_CONNECTIONS = 8;
const MAX_PENDING_ACTIONS = 32;
const AUTH_DEADLINE_MS = 3e3;
function helperHmac(ipcKey, message) {
	return createHmac("sha256", ipcKey).update(message).digest("hex");
}
function secureStringsEqual(first, second) {
	const firstBuffer = Buffer.from(first);
	const secondBuffer = Buffer.from(second);
	return firstBuffer.length > 0 && firstBuffer.length === secondBuffer.length && timingSafeEqual(firstBuffer, secondBuffer);
}
function hasExactKeys(record, keys) {
	const actual = Object.keys(record).toSorted();
	const expected = [...keys].toSorted();
	return actual.length === expected.length && actual.every((key, index) => key === expected[index]);
}
var FaceTimeHelperSocketServer = class {
	#server;
	#sockets = /* @__PURE__ */ new Set();
	#socketPeers = /* @__PURE__ */ new Map();
	#pendingHandshakes = /* @__PURE__ */ new Map();
	#socketAuthSessions = /* @__PURE__ */ new Map();
	#authDeadlineTimers = /* @__PURE__ */ new Map();
	#pending = /* @__PURE__ */ new Map();
	#logger;
	#started = false;
	#connectionGeneration = 0;
	constructor(params) {
		this.params = params;
		this.#logger = params.logger;
		this.#server = net.createServer((socket) => this.#handleSocket(socket));
	}
	async start() {
		if (this.#started) return;
		await new Promise((resolve, reject) => {
			const onError = (error) => {
				this.#server.off("listening", onListening);
				reject(error);
			};
			const onListening = () => {
				this.#server.off("error", onError);
				this.#started = true;
				resolve();
			};
			this.#server.once("error", onError);
			this.#server.once("listening", onListening);
			this.#server.listen(this.params.port, this.params.host);
		});
	}
	async stop() {
		for (const pending of this.#pending.values()) {
			clearTimeout(pending.timeout);
			pending.reject(/* @__PURE__ */ new Error("helper socket server stopped"));
		}
		this.#pending.clear();
		for (const socket of this.#sockets) socket.destroy();
		this.#sockets.clear();
		for (const deadline of this.#authDeadlineTimers.values()) clearTimeout(deadline);
		this.#authDeadlineTimers.clear();
		if (!this.#started) return;
		await new Promise((resolve) => {
			this.#server.close(() => resolve());
		});
		this.#started = false;
	}
	async answerCall(callUUID) {
		return await this.#sendActionToAll("answer-call", { callUUID });
	}
	async startCall(request, dialID, requestedAt) {
		return await this.#sendAction("start-call", {
			...request,
			dialID,
			requestedAt
		});
	}
	async findOutgoingCall(handle, callUUID, dialID, proxyIdentifier, requestedAt, mode) {
		return await this.#sendActionToAll("find-outgoing-call", {
			handle,
			...callUUID ? { callUUID } : {},
			...dialID ? { dialID } : {},
			...proxyIdentifier ? { proxyIdentifier } : {},
			...requestedAt ? { requestedAt } : {},
			...mode ? { mode } : {}
		});
	}
	async cancelOutgoingCall(params) {
		return await this.#sendActionToAll("cancel-outgoing-call", params);
	}
	async leaveCall(callUUID) {
		return await this.#sendActionToAll("leave-call", { callUUID }, 750);
	}
	async safetyMute(callUUID) {
		return await this.#sendActionToAll("safety-mute", { callUUID }, 750);
	}
	async setMuted(callUUID, muted) {
		return await this.#sendActionToAll("set-muted", {
			callUUID,
			muted
		});
	}
	async startTransmission(callUUID) {
		return await this.#sendActionToAll("start-transmission", { callUUID });
	}
	async inspectCall(callUUIDs, requiredPeerProcessIds = []) {
		return await this.#sendActionToAll("inspect-call", { callUUIDs }, 750, requiredPeerProcessIds);
	}
	get connectedSockets() {
		return this.#socketPeers.size;
	}
	get connectedHelperBundles() {
		return [...new Set([...this.#socketPeers.values()].map((peer) => peer.bundleIdentifier))];
	}
	#handleSocket(socket) {
		if (this.#sockets.size >= MAX_CONNECTIONS) {
			socket.destroy();
			return;
		}
		this.#sockets.add(socket);
		socket.setEncoding("utf8");
		const authDeadline = setTimeout(() => {
			if (!this.#socketPeers.has(socket)) socket.destroy();
		}, AUTH_DEADLINE_MS);
		authDeadline.unref?.();
		this.#authDeadlineTimers.set(socket, authDeadline);
		let buffer = "";
		socket.on("data", (chunk) => {
			buffer += typeof chunk === "string" ? chunk : chunk.toString("utf8");
			while (true) {
				const newline = buffer.search(/\r?\n/);
				if (newline < 0) {
					if (Buffer.byteLength(buffer) > MAX_FRAME_BYTES) socket.destroy();
					break;
				}
				if (Buffer.byteLength(buffer.slice(0, newline)) > MAX_FRAME_BYTES) {
					socket.destroy();
					return;
				}
				const line = buffer.slice(0, newline).trim();
				buffer = buffer.slice(buffer[newline] === "\r" ? newline + 2 : newline + 1);
				if (line) this.#handleLine(socket, line);
			}
		});
		socket.on("error", (error) => {
			this.#logger.debug?.(`[facetime] helper socket error: ${formatErrorMessage(error)}`);
		});
		socket.on("close", () => {
			const disconnectedBundle = this.#socketPeers.get(socket)?.bundleIdentifier;
			if (disconnectedBundle) this.#connectionGeneration += 1;
			this.#sockets.delete(socket);
			this.#socketPeers.delete(socket);
			this.#pendingHandshakes.delete(socket);
			this.#socketAuthSessions.delete(socket);
			const deadline = this.#authDeadlineTimers.get(socket);
			if (deadline) {
				clearTimeout(deadline);
				this.#authDeadlineTimers.delete(socket);
			}
			if (disconnectedBundle) this.params.onDisconnect?.(disconnectedBundle);
		});
	}
	#handleLine(socket, line) {
		let parsed;
		try {
			parsed = JSON.parse(line);
		} catch (error) {
			this.#logger.debug?.(`[facetime] rejected invalid helper JSON: ${formatErrorMessage(error)}`);
			socket.destroy();
			return;
		}
		const record = asRecord(parsed);
		if (record.event === "client-hello") {
			this.#handleClientHello(socket, record);
			return;
		}
		if (record.event === "client-finish") {
			this.#handleClientFinish(socket, record);
			return;
		}
		const payload = this.#consumeHelperEnvelope(socket, record);
		if (!payload) {
			this.#logger.warn?.("[facetime] rejected unauthenticated or replayed helper message");
			socket.destroy();
			return;
		}
		if (!this.#socketPeers.has(socket)) {
			if (hasExactKeys(payload, ["event"]) && payload.event === "session-ready-ack") {
				this.#admitAuthenticatedHelper(socket);
				return;
			}
			socket.destroy();
			return;
		}
		const transactionId = typeof payload.transactionId === "string" ? payload.transactionId : "";
		if (transactionId && this.#pending.has(transactionId)) {
			const pending = this.#pending.get(transactionId);
			this.#pending.delete(transactionId);
			if (pending) {
				clearTimeout(pending.timeout);
				if (typeof payload.error === "string" && payload.error) pending.reject(payload.ambiguous === true ? new FaceTimeHelperAmbiguousError(payload.error, payload) : new FaceTimeHelperActionError(payload.error));
				else pending.resolve(payload);
			}
			return;
		}
		const peer = this.#socketPeers.get(socket);
		if (peer) this.params.onMessage(payload, peer);
	}
	#handleClientHello(socket, record) {
		if (this.#pendingHandshakes.has(socket) || this.#socketAuthSessions.has(socket) || !hasExactKeys(record, [
			"event",
			"bundle_identifier",
			"build_id",
			"process_id",
			"process_started_at_ms",
			"client_nonce",
			"proof"
		])) {
			socket.destroy();
			return;
		}
		const bundleIdentifier = typeof record.bundle_identifier === "string" ? record.bundle_identifier.trim() : "";
		const buildId = typeof record.build_id === "string" ? record.build_id.trim() : "";
		const processId = typeof record.process_id === "number" && Number.isSafeInteger(record.process_id) ? record.process_id : 0;
		const processStartedAtMs = typeof record.process_started_at_ms === "number" && Number.isSafeInteger(record.process_started_at_ms) ? record.process_started_at_ms : 0;
		const clientNonce = typeof record.client_nonce === "string" ? record.client_nonce : "";
		const proof = typeof record.proof === "string" ? record.proof : "";
		const expectedProof = helperHmac(this.params.ipcKey, `client-hello\n${bundleIdentifier}\n${buildId}\n${processId}\n${processStartedAtMs}\n${clientNonce}`);
		if (!FACETIME_HELPER_BUNDLES.has(bundleIdentifier) || processId <= 0 || processStartedAtMs <= 0 || clientNonce.length < 32 || !secureStringsEqual(proof, expectedProof)) {
			socket.destroy();
			return;
		}
		if (buildId !== this.params.buildId) {
			this.params.onStale?.(bundleIdentifier, processId);
			socket.destroy();
			return;
		}
		const serverNonce = randomUUID();
		const connectionEpoch = randomUUID();
		const context = `${bundleIdentifier}\n${buildId}\n${processId}\n${processStartedAtMs}\n${clientNonce}\n${serverNonce}\n${connectionEpoch}`;
		const handshake = {
			bundleIdentifier,
			processId,
			processStartedAtMs,
			clientNonce,
			serverNonce,
			connectionEpoch,
			connectionKey: helperHmac(this.params.ipcKey, `session\n${context}`)
		};
		this.#pendingHandshakes.set(socket, handshake);
		socket.write(`${JSON.stringify({
			event: "server-hello",
			client_nonce: clientNonce,
			server_nonce: serverNonce,
			connection_epoch: connectionEpoch,
			proof: helperHmac(this.params.ipcKey, `server-hello\n${context}`)
		})}\r\n`);
	}
	#handleClientFinish(socket, record) {
		const handshake = this.#pendingHandshakes.get(socket);
		if (!handshake || !hasExactKeys(record, [
			"event",
			"connection_epoch",
			"proof"
		]) || record.connection_epoch !== handshake.connectionEpoch || typeof record.proof !== "string" || !secureStringsEqual(record.proof, helperHmac(handshake.connectionKey, `client-finish\n${handshake.connectionEpoch}`))) {
			socket.destroy();
			return;
		}
		this.#pendingHandshakes.delete(socket);
		this.#socketAuthSessions.set(socket, {
			...handshake,
			incomingSequence: 0,
			outgoingSequence: 0
		});
		this.#writeServerPayload(socket, { event: "session-ready" });
	}
	#admitAuthenticatedHelper(socket) {
		const session = this.#socketAuthSessions.get(socket);
		if (!session) {
			socket.destroy();
			return;
		}
		this.#socketPeers.set(socket, {
			bundleIdentifier: session.bundleIdentifier,
			processId: session.processId,
			processStartedAtMs: session.processStartedAtMs,
			connectionGeneration: ++this.#connectionGeneration
		});
		const deadline = this.#authDeadlineTimers.get(socket);
		if (deadline) {
			clearTimeout(deadline);
			this.#authDeadlineTimers.delete(socket);
		}
		this.params.onConnect?.(session.bundleIdentifier);
	}
	#consumeHelperEnvelope(socket, record) {
		const session = this.#socketAuthSessions.get(socket);
		if (!session || !hasExactKeys(record, [
			"connection_epoch",
			"sequence",
			"direction",
			"payload_json",
			"auth"
		]) || record.connection_epoch !== session.connectionEpoch || record.direction !== "helper-to-server" || typeof record.sequence !== "number" || !Number.isSafeInteger(record.sequence) || record.sequence !== session.incomingSequence + 1 || typeof record.payload_json !== "string" || typeof record.auth !== "string") return;
		const expectedAuth = helperHmac(session.connectionKey, `message\nhelper-to-server\n${session.connectionEpoch}\n${record.sequence}\n${record.payload_json}`);
		if (!secureStringsEqual(record.auth, expectedAuth)) return;
		let payload;
		try {
			payload = JSON.parse(record.payload_json);
		} catch {
			return;
		}
		const payloadRecord = asRecord(payload);
		if (Object.keys(payloadRecord).length === 0) return;
		session.incomingSequence = record.sequence;
		return payloadRecord;
	}
	#writeServerPayload(socket, payload) {
		const session = this.#socketAuthSessions.get(socket);
		if (!session) throw new FaceTimeHelperUnavailableError("FaceTime helper socket is not authenticated");
		const payloadJson = JSON.stringify(payload);
		const sequence = session.outgoingSequence + 1;
		const envelope = JSON.stringify({
			connection_epoch: session.connectionEpoch,
			sequence,
			direction: "server-to-helper",
			payload_json: payloadJson,
			auth: helperHmac(session.connectionKey, `message\nserver-to-helper\n${session.connectionEpoch}\n${sequence}\n${payloadJson}`)
		});
		if (Buffer.byteLength(envelope) > MAX_FRAME_BYTES) throw new FaceTimeHelperActionError("FaceTime helper message exceeds the frame limit");
		session.outgoingSequence = sequence;
		socket.write(`${envelope}\r\n`);
		return envelope;
	}
	async #sendAction(action, data) {
		const socket = [...this.#sockets].find((candidate) => !candidate.destroyed && FACETIME_DIAL_HELPER_BUNDLES.has(this.#socketPeers.get(candidate)?.bundleIdentifier ?? ""));
		if (!socket) throw new FaceTimeHelperUnavailableError("Authenticated FaceTime dialing helper is not connected to the facetime event socket");
		return {
			...await this.#sendActionOnSocket(socket, action, data),
			helperBundleIdentifier: this.#socketPeers.get(socket)?.bundleIdentifier ?? "unknown",
			helperPeer: this.#socketPeers.get(socket)
		};
	}
	async #sendActionToAll(action, data, timeoutMs = 5e3, requiredPeerProcessIds = []) {
		const sockets = [...this.#sockets].filter((candidate) => !candidate.destroyed && FACETIME_HELPER_BUNDLES.has(this.#socketPeers.get(candidate)?.bundleIdentifier ?? ""));
		if (sockets.length === 0) throw new FaceTimeHelperUnavailableError("FaceTime helper is not connected to the facetime event socket");
		const peers = sockets.map((socket) => this.#socketPeers.get(socket));
		const results = await Promise.allSettled(sockets.map((socket) => this.#sendActionOnSocket(socket, action, data, timeoutMs)));
		const fulfilled = results.flatMap((result, index) => result.status === "fulfilled" && sockets[index] ? [{
			...result.value,
			helperBundleIdentifier: peers[index]?.bundleIdentifier ?? "unknown",
			helperPeer: peers[index]
		}] : []);
		if (fulfilled.length > 0) {
			const fulfilledProcessIds = new Set(fulfilled.flatMap((result) => {
				const peer = result.helperPeer;
				return peer && typeof peer === "object" && "processId" in peer ? [peer.processId] : [];
			}));
			return {
				helpersContacted: sockets.length,
				topologyGeneration: this.#connectionGeneration,
				topologyComplete: fulfilled.length === sockets.length && requiredPeerProcessIds.every((processId) => fulfilledProcessIds.has(processId)),
				helperResults: fulfilled,
				...fulfilled[fulfilled.length - 1]
			};
		}
		const firstRejected = results.find((result) => result.status === "rejected");
		throw firstRejected?.reason instanceof Error ? firstRejected.reason : /* @__PURE__ */ new Error(`FaceTime helper action failed: ${action}`);
	}
	async #sendActionOnSocket(socket, action, data, timeoutMs = 5e3) {
		if (this.#pending.size >= MAX_PENDING_ACTIONS) throw new FaceTimeHelperUnavailableError("FaceTime helper action queue is full");
		const transactionId = randomUUID();
		if (!this.#socketAuthSessions.has(socket)) throw new FaceTimeHelperUnavailableError("FaceTime helper socket is not authenticated");
		return await new Promise((resolve, reject) => {
			const timeout = setTimeout(() => {
				this.#pending.delete(transactionId);
				reject(/* @__PURE__ */ new Error(`FaceTime helper action timed out: ${action}`));
			}, timeoutMs);
			this.#pending.set(transactionId, {
				resolve,
				reject,
				timeout
			});
			try {
				this.#writeServerPayload(socket, {
					action,
					transactionId,
					data
				});
			} catch (error) {
				clearTimeout(timeout);
				this.#pending.delete(transactionId);
				reject(error instanceof Error ? error : new Error(String(error)));
			}
		});
	}
};
//#endregion
//#region extensions/facetime/src/helper-supervisor.ts
const TARGET_BUNDLES = {
	FaceTime: /* @__PURE__ */ new Set(["com.apple.FaceTime", "com.apple.FaceTime.FTConversationService"]),
	Phone: /* @__PURE__ */ new Set(["com.apple.mobilephone", "com.apple.TelephonyUtilities"])
};
const TARGET_APP_PATHS = {
	FaceTime: "/System/Applications/FaceTime.app",
	Phone: "/System/Applications/Phone.app"
};
const TARGET_EXECUTABLES = {
	FaceTime: "/System/Applications/FaceTime.app/Contents/MacOS/FaceTime",
	Phone: "/System/Applications/Phone.app/Contents/MacOS/Phone"
};
const FACETIME_HELPER_TARGETS = ["FaceTime", "Phone"];
const DEFAULT_RETRY_DELAYS_MS = [
	1e3,
	2e3,
	5e3,
	1e4,
	3e4,
	6e4
];
function targetForBundle(bundleIdentifier) {
	return FACETIME_HELPER_TARGETS.find((target) => TARGET_BUNDLES[target].has(bundleIdentifier));
}
var FaceTimeHelperSupervisor = class {
	#states;
	#timers = /* @__PURE__ */ new Map();
	#retryDelaysMs;
	#injectionChain = Promise.resolve();
	#started = false;
	#generation = 0;
	#abortController = new AbortController();
	constructor(params) {
		this.params = params;
		this.#retryDelaysMs = params.retryDelaysMs && params.retryDelaysMs.length > 0 ? params.retryDelaysMs : DEFAULT_RETRY_DELAYS_MS;
		const targetAvailable = params.targetAvailable ?? ((target) => existsSync(TARGET_APP_PATHS[target]));
		this.#states = new Map(FACETIME_HELPER_TARGETS.filter((target) => targetAvailable(target)).map((target) => [target, {
			target,
			connected: false,
			attempts: 0,
			injecting: false,
			queued: false,
			retryScheduled: false,
			stale: false
		}]));
	}
	start() {
		if (this.#started) return;
		this.#started = true;
		this.#generation += 1;
		this.#abortController = new AbortController();
		this.#refreshConnections();
		for (const target of this.#states.keys()) if (!this.#states.get(target)?.connected) this.#schedule(target, this.params.initialGraceMs ?? 6e3);
	}
	async stop() {
		this.#started = false;
		this.#generation += 1;
		this.#abortController.abort(/* @__PURE__ */ new Error("FaceTime helper supervisor stopped"));
		for (const timer of this.#timers.values()) clearTimeout(timer);
		this.#timers.clear();
		await this.#injectionChain;
	}
	connected(bundleIdentifier) {
		const target = targetForBundle(bundleIdentifier);
		if (!target) return;
		this.#refreshConnections();
		const state = this.#states.get(target);
		if (state) {
			state.connected = true;
			state.attempts = 0;
			state.stale = false;
			state.staleProcessId = void 0;
			state.lastError = void 0;
		}
		this.#cancelTimer(target);
	}
	disconnected(bundleIdentifier) {
		const target = targetForBundle(bundleIdentifier);
		if (!target) return;
		this.#refreshConnections();
		if (this.#started && !this.#states.get(target)?.connected) this.#schedule(target, this.#retryDelaysMs[0] ?? 1e3);
	}
	stale(bundleIdentifier, processId) {
		const target = targetForBundle(bundleIdentifier);
		const state = target ? this.#states.get(target) : void 0;
		if (!target || !state) return;
		const staleProcessId = processId > 0 ? processId : void 0;
		const wasStale = state.stale;
		if (state.stale && state.staleProcessId === staleProcessId) return;
		state.connected = false;
		state.stale = true;
		state.staleProcessId = staleProcessId;
		state.lastError = `Restart ${target} to load the updated OpenClaw helper`;
		if (!wasStale) this.params.logger.warn(`[facetime] ${state.lastError}`);
		if (processId > 0) this.#scheduleStaleProcessCheck(target, processId);
		else {
			this.#cancelTimer(target);
			this.#resolveLegacyStaleProcess(target);
		}
	}
	status() {
		this.#refreshConnections();
		return [...this.#states.values()].map((state) => Object.assign({}, state, { retryScheduled: this.#timers.has(state.target) }));
	}
	#refreshConnections() {
		const bundles = new Set(this.params.connectedBundles());
		for (const target of FACETIME_HELPER_TARGETS) {
			const acceptedBundles = TARGET_BUNDLES[target];
			const state = this.#states.get(target);
			if (state) state.connected = [...acceptedBundles].some((bundle) => bundles.has(bundle));
		}
	}
	#cancelTimer(target) {
		const timer = this.#timers.get(target);
		if (timer) {
			clearTimeout(timer);
			this.#timers.delete(target);
		}
	}
	#schedule(target, delayMs) {
		this.#cancelTimer(target);
		const timer = setTimeout(() => {
			this.#timers.delete(target);
			this.#enqueueInjection(target);
		}, delayMs);
		timer.unref?.();
		this.#timers.set(target, timer);
	}
	#scheduleStaleProcessCheck(target, processId) {
		this.#cancelTimer(target);
		const timer = setTimeout(() => {
			this.#timers.delete(target);
			if (!this.#started) return;
			const processAlive = this.params.processAlive ?? ((candidate) => {
				try {
					process.kill(candidate, 0);
					return true;
				} catch (error) {
					if (error && typeof error === "object" && "code" in error) return error.code !== "ESRCH";
					return true;
				}
			});
			const state = this.#states.get(target);
			if (!state?.stale || state.staleProcessId !== processId) return;
			if (processAlive(processId)) {
				this.#scheduleStaleProcessCheck(target, processId);
				return;
			}
			state.stale = false;
			state.staleProcessId = void 0;
			state.attempts = 0;
			state.lastError = void 0;
			this.#schedule(target, 0);
		}, 2e3);
		timer.unref?.();
		this.#timers.set(target, timer);
	}
	async #resolveLegacyStaleProcess(target) {
		const state = this.#states.get(target);
		if (!this.#started || !state?.stale || state.staleProcessId !== void 0) return;
		try {
			const result = await this.params.runCommandWithTimeout([
				"/usr/bin/pgrep",
				"-f",
				TARGET_EXECUTABLES[target]
			], { timeoutMs: 5e3 });
			const processId = Number.parseInt(result.stdout.trim().split(/\s+/u)[0] ?? "", 10);
			if (result.code === 0 && Number.isSafeInteger(processId) && processId > 0) {
				state.staleProcessId = processId;
				this.#scheduleStaleProcessCheck(target, processId);
				return;
			}
		} catch (error) {
			this.params.logger.debug?.(`[facetime] failed to resolve stale ${target} helper process: ${formatErrorMessage(error)}`);
		}
		if (this.#started && state.stale && state.staleProcessId === void 0) {
			state.stale = false;
			state.lastError = void 0;
			this.#schedule(target, 0);
		}
	}
	#enqueueInjection(target) {
		const state = this.#states.get(target);
		if (!state || state.queued || state.injecting) return;
		state.queued = true;
		const generation = this.#generation;
		const pending = this.#injectionChain.then(async () => {
			state.queued = false;
			if (this.#started && generation === this.#generation) await this.#inject(target, generation);
		});
		this.#injectionChain = pending.catch(() => void 0);
	}
	async #waitForAuthenticatedConnection(target, generation) {
		const deadline = Date.now() + (this.params.connectionGraceMs ?? 1e4);
		while (this.#started && generation === this.#generation && Date.now() < deadline) {
			this.#refreshConnections();
			const state = this.#states.get(target);
			if (!state || state.connected || state.stale) return;
			await sleepWithAbort(250, this.#abortController.signal).catch(() => void 0);
		}
		this.#refreshConnections();
	}
	async #inject(target, generation) {
		if (!this.#started || generation !== this.#generation) return;
		this.#refreshConnections();
		const state = this.#states.get(target);
		if (!state || state.connected || state.injecting || state.stale) return;
		state.injecting = true;
		state.attempts += 1;
		const script = resolve(this.params.pluginRoot, "scripts", "inject-helper.sh");
		try {
			const result = await this.params.runCommandWithTimeout([
				"/bin/bash",
				script,
				"--app",
				target
			], {
				timeoutMs: 12e4,
				signal: this.#abortController.signal,
				killProcessTree: true
			});
			if (!this.#started || generation !== this.#generation) return;
			if (result.code !== 0) throw new Error(result.stderr || result.stdout || `exit ${result.code}`);
			state.lastError = void 0;
			this.params.logger.info(`[facetime] injected helper into ${target}`);
			if (!state.connected && !state.stale) {
				await this.#waitForAuthenticatedConnection(target, generation);
				if (!state.connected && !state.stale) throw new Error(`${target} helper injection completed but no authenticated connection arrived`);
			}
		} catch (error) {
			if (this.#started && generation === this.#generation) {
				state.lastError = formatErrorMessage(error);
				this.params.logger.warn(`[facetime] ${target} helper injection failed: ${state.lastError}`);
			}
		} finally {
			state.injecting = false;
		}
		if (!this.#started || generation !== this.#generation) return;
		this.#refreshConnections();
		if (!state.connected && !state.stale) {
			const retryIndex = Math.min(state.attempts - 1, this.#retryDelaysMs.length - 1);
			this.#schedule(target, this.#retryDelaysMs[retryIndex] ?? 6e4);
		}
	}
};
//#endregion
//#region extensions/facetime/src/outbound-call.ts
function normalizeFaceTimeOutboundIdentityEvent(value) {
	if (!value || typeof value !== "object" || Array.isArray(value)) return;
	const record = asRecord(value);
	if (record.event !== "ft-outbound-call-identified") return;
	const data = asRecord(record.data);
	const dialID = normalizeOptionalString(data.dial_id);
	if (!dialID) return;
	const callUUID = normalizeOptionalString(data.call_uuid);
	const proxyIdentifier = normalizeOptionalString(data.proxy_identifier);
	if (!callUUID && !proxyIdentifier) return;
	return {
		event: "ft-outbound-call-identified",
		data: {
			dial_id: dialID,
			...callUUID ? { call_uuid: callUUID } : {},
			...proxyIdentifier ? { proxy_identifier: proxyIdentifier } : {}
		}
	};
}
function readHandle(value) {
	if (typeof value !== "string") throw new Error("handle must be a string");
	const handle = value.trim();
	if (!handle) throw new Error("handle is required");
	if (handle.length > 320) throw new Error("handle is too long");
	if (/^[a-z][a-z\d+.-]*:/iu.test(handle)) throw new Error("handle must not include a URL scheme");
	for (const character of handle) {
		const code = character.codePointAt(0) ?? 0;
		if (code <= 31 || code === 127 || "/?#\\".includes(character)) throw new Error("handle contains unsupported characters");
	}
	if (handle.includes("@")) {
		if (!/^[^@\s]+@[^@\s]+$/u.test(handle)) throw new Error("handle must be a valid FaceTime email address or phone number");
		return handle;
	}
	if (!/^[+\d\s().-]+$/u.test(handle) || !/\d/u.test(handle)) throw new Error("handle must be a valid FaceTime email address or phone number");
	return handle;
}
function readMode(value) {
	if (value === void 0) return "audio";
	if (value === "audio" || value === "video") return value;
	throw new Error("mode must be audio or video");
}
function resolveFaceTimeDialRequest(params) {
	const handle = readHandle(params.handle);
	if (!isAuthorizedFaceTimeHandle({
		handle,
		ownerHandles: params.ownerHandles
	})) throw new Error("outbound FaceTime handle is not an authorized owner handle");
	return {
		handle,
		mode: readMode(params.mode)
	};
}
function resolveFaceTimeDialResult(params) {
	if (params.helper.muted !== true || params.helper.is_uplink_muted !== true || !isVerifiedFaceTimeTransportEvidence(params.helper.transport)) throw new Error("FaceTime helper did not prove a safely muted FaceTime outbound carrier");
	const callUUID = normalizeOptionalString(params.helper.call_uuid);
	const proxyIdentifier = normalizeOptionalString(params.helper.proxy_identifier);
	return {
		...params.request,
		dialID: params.dialID,
		state: callUUID ? "ringing" : "pending",
		...callUUID ? { callUUID } : {},
		...proxyIdentifier ? { proxyIdentifier } : {},
		helper: params.helper
	};
}
function doesFaceTimeCallMatchPendingDial(params) {
	if (params.event.data.dial_id) return params.event.data.dial_id === params.pending.dialID;
	if (params.pending.callUUID) {
		const eventCallUUID = params.event.data.call_uuid;
		return typeof eventCallUUID === "string" && doesPendingFaceTimeDialHaveCallUUID(params.pending, eventCallUUID);
	}
	if (params.pending.proxyIdentifier) return params.event.data.proxy_identifier === params.pending.proxyIdentifier;
	return params.event.data.dial_id === params.pending.dialID;
}
function retainFaceTimeDialCallUUID(pending, callUUID) {
	if (!callUUID) return;
	pending.callUUIDAliases ??= /* @__PURE__ */ new Set();
	if (pending.callUUID) pending.callUUIDAliases.add(pending.callUUID);
	pending.callUUIDAliases.add(callUUID);
	pending.callUUID = callUUID;
}
function doesPendingFaceTimeDialHaveCallUUID(pending, callUUID) {
	return pending.callUUID === callUUID || pending.callUUIDAliases?.has(callUUID) === true;
}
//#endregion
//#region extensions/facetime/src/pending-dial-store.ts
const PENDING_DIAL_KEY = "active";
function decodePendingDial(value) {
	if (!value || value.version !== 1 || !Number.isSafeInteger(value.ownerEpoch) || value.ownerEpoch < 1 || typeof value.dialID !== "string" || typeof value.handle !== "string" || value.mode !== "audio" && value.mode !== "video" || value.delivery !== "in-flight" && value.delivery !== "accepted" && value.delivery !== "ambiguous" && value.delivery !== "cancelling" || typeof value.requestedAt !== "string") return;
	const { callUUIDAliases, ...stored } = value;
	return {
		...stored,
		...callUUIDAliases?.length ? { callUUIDAliases: new Set(callUUIDAliases) } : {}
	};
}
var PendingFaceTimeDialStore = class {
	#tail = Promise.resolve();
	#clearing = /* @__PURE__ */ new Map();
	constructor(store) {
		this.store = store;
	}
	#enqueue(operation) {
		const pending = this.#tail.then(operation);
		this.#tail = pending.then(() => void 0, () => void 0);
		return pending;
	}
	load() {
		return this.#enqueue(async () => decodePendingDial(await this.store.lookup(PENDING_DIAL_KEY)));
	}
	save(pending) {
		const clearing = this.#clearing.get(pending.dialID);
		if (clearing) return clearing.then(() => void 0);
		const { callUUIDAliases, ...stored } = pending;
		const snapshot = {
			...stored,
			...callUUIDAliases ? { callUUIDAliases: [...callUUIDAliases].toSorted() } : {}
		};
		return this.#enqueue(() => this.store.register(PENDING_DIAL_KEY, snapshot));
	}
	clear(expectedDialID) {
		const existing = this.#clearing.get(expectedDialID);
		if (existing) return existing;
		const clearing = this.#enqueue(async () => {
			const { observe, compareAndApply } = this.store;
			if (!observe || !compareAndApply) {
				if (!this.store.deleteIf) throw new Error("FaceTime pending dial cleanup requires atomic plugin-state deletion");
				return this.store.deleteIf(PENDING_DIAL_KEY, (current) => current.dialID === expectedDialID);
			}
			let observation = await observe(PENDING_DIAL_KEY);
			for (;;) {
				const result = await compareAndApply(PENDING_DIAL_KEY, observation.comparison, {
					operation: "delete",
					action: observation.value?.dialID === expectedDialID ? "delete" : "keep"
				});
				if (result.status !== "conflict") return result.status === "applied";
				observation = result.current;
			}
		}).finally(() => this.#clearing.delete(expectedDialID));
		this.#clearing.set(expectedDialID, clearing);
		return clearing;
	}
	isClearing(dialID) {
		return dialID !== void 0 && this.#clearing.has(dialID);
	}
	settle() {
		return this.#tail;
	}
};
//#endregion
//#region extensions/facetime/src/audio-pump.ts
const CAFFEINATE_COMMAND = "/usr/bin/caffeinate";
const CAPTURE_CLOSE_SAFE_FRAME = Buffer.from([
	4,
	0,
	0,
	0,
	4,
	0,
	0,
	0,
	0
]);
const FACETIME_AUDIO_SAMPLE_RATE_HZ = 24e3;
const OUTPUT_LATENCY_BUDGET_MS = 100;
const SOX_COREAUDIO_BUFFER_BYTES = 8192;
const SOX_COMMAND = [
	process.env.HOME ? `${process.env.HOME}/.homebrew/bin/sox` : void 0,
	"/opt/homebrew/bin/sox",
	"/usr/local/bin/sox"
].find((path) => Boolean(path && existsSync(path))) ?? "sox";
const FACETIME_FEED_DEVICE_NAME = "OpenClaw-Feed";
const FACETIME_MIC_DEVICE_NAME = "OpenClaw-Mic";
const MAX_PLAYBACK_BUFFERED_BYTES = 2097152;
function sanitizedAudioChildEnv(env = process.env) {
	return Object.fromEntries(Object.entries(env).filter(([key]) => !/(?:API_?KEY|AUTH|CREDENTIAL|PASSWORD|SECRET|TOKEN)/iu.test(key)));
}
var PlaybackClock = class {
	constructor() {
		this.generatedFrames = 0;
		this.playedFramesBeforeSegment = 0;
		this.playbackStartsAtMs = 0;
		this.playbackUntilMs = 0;
		this.retiredFrames = 0;
		this.items = [];
	}
	append(frames, itemId, nowMs = Date.now()) {
		if (nowMs >= this.playbackUntilMs) {
			this.playedFramesBeforeSegment = this.generatedFrames;
			this.playbackStartsAtMs = nowMs + OUTPUT_LATENCY_BUDGET_MS;
			this.playbackUntilMs = this.playbackStartsAtMs;
		}
		this.generatedFrames += frames;
		this.playbackUntilMs += frames / FACETIME_AUDIO_SAMPLE_RATE_HZ * 1e3;
		const previous = this.items.at(-1);
		if (previous && previous.itemId === itemId) previous.frames += frames;
		else this.items.push({
			itemId,
			frames
		});
	}
	playbackState() {
		let remaining = Math.max(0, this.playedFrames() - this.retiredFrames);
		const playedByItem = /* @__PURE__ */ new Map();
		for (const item of this.items) {
			const consumed = Math.min(remaining, item.frames);
			remaining -= consumed;
			if (item.itemId) playedByItem.set(item.itemId, (playedByItem.get(item.itemId) ?? 0) + consumed);
		}
		return Array.from(playedByItem, ([itemId, frames]) => ({
			itemId,
			audioEndMs: Math.floor(frames * 1e3 / FACETIME_AUDIO_SAMPLE_RATE_HZ)
		}));
	}
	retireItems() {
		this.items = [];
		this.retiredFrames = this.generatedFrames;
	}
	playedFrames(nowMs = Date.now()) {
		if (nowMs <= this.playbackStartsAtMs) return this.playedFramesBeforeSegment;
		const elapsedFrames = (nowMs - this.playbackStartsAtMs) / 1e3 * FACETIME_AUDIO_SAMPLE_RATE_HZ;
		return Math.min(this.generatedFrames, this.playedFramesBeforeSegment + elapsedFrames);
	}
	queuedFrames(nowMs = Date.now()) {
		return Math.max(0, this.generatedFrames - this.playedFrames(nowMs));
	}
	millisecondsUntilDrained(nowMs = Date.now()) {
		return Math.max(0, this.playbackUntilMs - nowMs);
	}
	reset() {
		this.generatedFrames = 0;
		this.playedFramesBeforeSegment = 0;
		this.playbackStartsAtMs = 0;
		this.playbackUntilMs = 0;
		this.retireItems();
	}
};
function buildSoxOutputArguments() {
	return [
		"-q",
		"--buffer",
		String(SOX_COREAUDIO_BUFFER_BYTES),
		"-t",
		"raw",
		"-r",
		String(FACETIME_AUDIO_SAMPLE_RATE_HZ),
		"-c",
		"1",
		"-e",
		"signed-integer",
		"-b",
		"16",
		"-L",
		"-",
		"-t",
		"coreaudio",
		FACETIME_FEED_DEVICE_NAME
	];
}
async function terminateProcess(proc, signal = "SIGTERM") {
	if (proc.killed && signal !== "SIGKILL") return;
	let exited = false;
	const exitedPromise = new Promise((resolve) => {
		proc.on("exit", () => {
			exited = true;
			resolve();
		});
	});
	try {
		proc.kill(signal);
	} catch {
		return;
	}
	await Promise.race([exitedPromise, new Promise((resolve) => {
		setTimeout(resolve, 500).unref?.();
	})]);
	if (!exited && signal !== "SIGKILL") {
		try {
			proc.kill("SIGKILL");
		} catch {
			return;
		}
		await Promise.race([exitedPromise, new Promise((resolve) => {
			setTimeout(resolve, 500).unref?.();
		})]);
	}
}
function startFaceTimeAudioPump(params) {
	const spawnFn = params.spawn ?? ((command, args, options) => spawn(command, args, options));
	const childEnv = sanitizedAudioChildEnv();
	const playbackClock = new PlaybackClock();
	let playbackGeneration = 1;
	let drainTimer;
	let outputProcess;
	const captureProcess = spawnFn(params.captureBinary, [], {
		env: childEnv,
		stdio: [
			"pipe",
			"pipe",
			"pipe"
		]
	});
	let stopped = false;
	let mediaSuspended = false;
	let captureSuppressionActive = false;
	let captureFailureReported = false;
	let captureReadySettled = false;
	let routeReadySettled = false;
	let routeReadyTimer;
	let captureStderr = "";
	let resolveCaptureReady = () => {};
	let rejectCaptureReady = (_error) => {};
	const captureReadyPromise = new Promise((resolve, reject) => {
		resolveCaptureReady = resolve;
		rejectCaptureReady = reject;
	});
	let resolveRouteReady = () => {};
	let rejectRouteReady = (_error) => {};
	const routeReadyPromise = new Promise((resolve, reject) => {
		resolveRouteReady = resolve;
		rejectRouteReady = reject;
	});
	captureReadyPromise.catch(() => {});
	routeReadyPromise.catch(() => {});
	const settleCaptureReady = (error) => {
		if (captureReadySettled) return;
		captureReadySettled = true;
		clearTimeout(captureReadyTimer);
		if (error) rejectCaptureReady(error);
		else resolveCaptureReady();
	};
	const settleRouteReady = (error) => {
		if (routeReadySettled) return;
		routeReadySettled = true;
		if (routeReadyTimer) {
			clearTimeout(routeReadyTimer);
			routeReadyTimer = void 0;
		}
		if (error) rejectRouteReady(error);
		else resolveRouteReady();
	};
	const reportFailure = (error, suppressionLost) => {
		if (stopped) return;
		if (suppressionLost) {
			captureSuppressionActive = false;
			params.onSuppressionLost?.(error);
		}
		settleCaptureReady(error);
		settleRouteReady(error);
		params.logger.warn(`[facetime] native audio bridge failed: ${formatErrorMessage(error)}`);
		Promise.resolve(params.onError?.(error)).then((safeToStop) => {
			if (safeToStop !== false) stop();
		});
	};
	const cancelDrainTimer = () => {
		if (drainTimer) {
			clearTimeout(drainTimer);
			drainTimer = void 0;
		}
	};
	const spawnOutput = () => {
		const proc = spawnFn(SOX_COMMAND, buildSoxOutputArguments(), {
			env: childEnv,
			stdio: [
				"pipe",
				"ignore",
				"pipe"
			]
		});
		proc.on("error", (error) => {
			if (!stopped && !mediaSuspended && proc === outputProcess) reportFailure(error, false);
		});
		proc.stdin?.on("error", (error) => {
			if (!stopped && !mediaSuspended && proc === outputProcess) reportFailure(error, false);
		});
		proc.on("exit", (code, signal) => {
			if (!stopped && !mediaSuspended && proc === outputProcess) reportFailure(/* @__PURE__ */ new Error(`SoX playback exited (${code ?? signal ?? "done"})`), false);
		});
		proc.stderr?.on("data", (chunk) => {
			if (proc === outputProcess) params.logger.debug?.(`[facetime] SoX playback: ${String(chunk).trim()}`);
		});
		return proc;
	};
	outputProcess = spawnOutput();
	const captureReadyTimer = setTimeout(() => {
		reportFailure(/* @__PURE__ */ new Error("FaceTime process tap was not ready within 10 seconds"), true);
	}, 1e4);
	captureReadyTimer.unref?.();
	const startRouteReadyTimer = () => {
		if (routeReadySettled || routeReadyTimer) return;
		routeReadyTimer = setTimeout(() => {
			reportFailure(/* @__PURE__ */ new Error("FaceTime input route was not verified within 15 seconds"), true);
		}, 15e3);
		routeReadyTimer.unref?.();
	};
	const clearPlayback = () => {
		if (stopped || mediaSuspended) return;
		const previous = outputProcess;
		outputProcess = spawnOutput();
		playbackGeneration += 1;
		cancelDrainTimer();
		playbackClock.reset();
		terminateProcess(previous, "SIGKILL");
	};
	const stop = async () => {
		if (stopped) return;
		mediaSuspended = true;
		captureSuppressionActive = false;
		settleCaptureReady(/* @__PURE__ */ new Error("FaceTime native audio bridge stopped before readiness"));
		settleRouteReady(/* @__PURE__ */ new Error("FaceTime input route stopped before verification"));
		cancelDrainTimer();
		playbackClock.reset();
		try {
			captureProcess.stdin?.write(CAPTURE_CLOSE_SAFE_FRAME);
			captureProcess.stdin?.end();
		} catch {}
		stopped = true;
		await Promise.all([
			terminateProcess(captureProcess),
			terminateProcess(outputProcess, "SIGKILL"),
			wakeProcess ? terminateProcess(wakeProcess) : Promise.resolve()
		]);
	};
	const wakeProcess = existsSync(CAFFEINATE_COMMAND) ? spawnFn(CAFFEINATE_COMMAND, [
		"-d",
		"-i",
		...captureProcess.pid ? ["-w", String(captureProcess.pid)] : []
	], {
		env: childEnv,
		stdio: [
			"ignore",
			"ignore",
			"pipe"
		]
	}) : void 0;
	wakeProcess?.on("error", () => void 0);
	captureProcess.on("error", (error) => reportFailure(error, true));
	captureProcess.stdin?.on("error", (error) => reportFailure(error, false));
	captureProcess.on("exit", (code, signal) => {
		if (!stopped) reportFailure(/* @__PURE__ */ new Error(`native audio bridge exited (${code ?? signal ?? "done"})`), true);
	});
	captureProcess.stderr?.on("data", (chunk) => {
		captureStderr = `${captureStderr}${String(chunk)}`.slice(-8192);
		for (const line of captureStderr.split(/\r?\n/u).slice(0, -1)) {
			if (line.includes("started FaceTime process tap")) {
				captureSuppressionActive = true;
				settleCaptureReady();
			}
			if (line.includes("verified OpenClaw-Mic input route")) settleRouteReady();
			const fatal = line.match(/facetime-audio-capture: fatal(?:-safety-retained)?:\s*(.*)$/u);
			if (!captureFailureReported && fatal) {
				captureFailureReported = true;
				const detail = fatal[1]?.trim();
				reportFailure(/* @__PURE__ */ new Error(detail ? `native FaceTime safety monitor reported a fatal error: ${detail}` : "native FaceTime safety monitor reported a fatal error"), false);
			}
		}
		captureStderr = captureStderr.split(/\r?\n/u).at(-1) ?? "";
	});
	captureProcess.stdout?.on("data", (chunk) => {
		if (!stopped && !mediaSuspended) {
			const audio = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
			if (audio.byteLength > 0) params.onInputAudio(audio);
		}
	});
	return {
		suppressionReady: async () => await captureReadyPromise,
		routeReady: async () => {
			startRouteReadyTimer();
			await routeReadyPromise;
		},
		processOutputSuppressed: () => captureSuppressionActive,
		writeOutputAudio(audio, metadata) {
			if (stopped || mediaSuspended || audio.byteLength === 0) return;
			if ((outputProcess.stdin?.writableLength ?? 0) + audio.byteLength > MAX_PLAYBACK_BUFFERED_BYTES) {
				reportFailure(/* @__PURE__ */ new Error("SoX playback queue exceeded 2 MiB"), false);
				return;
			}
			if (!outputProcess.stdin) {
				reportFailure(/* @__PURE__ */ new Error("SoX playback stdin is unavailable"), false);
				return;
			}
			try {
				cancelDrainTimer();
				outputProcess.stdin.write(audio);
				playbackClock.append(audio.byteLength / 2, metadata?.itemId);
			} catch (error) {
				reportFailure(error instanceof Error ? error : new Error(formatErrorMessage(error)), false);
			}
		},
		finishOutputAudio() {
			if (stopped || mediaSuspended) return;
			if (playbackClock.queuedFrames() <= 0) {
				playbackClock.retireItems();
				return;
			}
			cancelDrainTimer();
			const generation = playbackGeneration;
			const notifyWhenDrained = () => {
				if (stopped || mediaSuspended || generation !== playbackGeneration) return;
				const delayMs = Math.ceil(playbackClock.millisecondsUntilDrained());
				if (delayMs > 0) {
					drainTimer = setTimeout(notifyWhenDrained, Math.max(1, delayMs));
					drainTimer.unref?.();
					return;
				}
				drainTimer = void 0;
				playbackClock.retireItems();
				params.onPlaybackDrained?.({
					generation,
					playedFrames: Math.floor(playbackClock.playedFrames())
				});
			};
			notifyWhenDrained();
		},
		getPlaybackState: () => playbackClock.playbackState(),
		clearOutputAudio: clearPlayback,
		playedAudioFrames: () => Math.floor(playbackClock.playedFrames()),
		queuedAudioFrames: () => Math.ceil(playbackClock.queuedFrames()),
		async suspendMedia() {
			if (!stopped && !mediaSuspended) {
				mediaSuspended = true;
				cancelDrainTimer();
				playbackClock.reset();
				await terminateProcess(outputProcess, "SIGKILL");
			}
		},
		stop
	};
}
//#endregion
//#region extensions/facetime/src/talk-driver-config.ts
const CONSULT_SYSTEM_PROMPT = [
	"You are the configured OpenClaw agent receiving a delegated request from an authenticated owner in a private 1:1 FaceTime call.",
	"The authenticated caller is the configured owner/user described by this agent's workspace context, including USER.md. When asked who is speaking, identify them from that workspace context without asking them to reconfirm.",
	"Use the normal workspace, memory, tools, and approval policies for this agent.",
	"Prefer registered OpenClaw tools over exec.",
	"When a direct tool returns usable data that answers the caller, answer immediately from that result.",
	"Do not contact another agent or session merely to enrich or double-check a successful direct tool result unless the caller explicitly asks you to.",
	"Never claim completion unless the relevant tool result confirms it.",
	"Return a concise plain-text answer. The realtime voice provider speaks your answer; do not call tts or generate an audio attachment."
].join(" ");
const REALTIME_READY_TIMEOUT_MS = 15e3;
const MAX_TRANSCRIPT_ENTRY_CHARS = 2e3;
const MAX_TRANSCRIPT_CHARS = 12e3;
const AGENT_CONSULT_MESSAGE_PROVIDER = "voice";
const FACETIME_END_CALL_TOOL_NAME = "facetime_end_call";
const FACETIME_END_CALL_TOOL = {
	type: "function",
	name: FACETIME_END_CALL_TOOL_NAME,
	description: "Immediately end the current FaceTime call when the caller clearly asks to hang up, end, leave, or disconnect this call. Do not use this to cancel background work.",
	parameters: {
		type: "object",
		properties: {}
	}
};
function assertAuthenticatedSenderConsultSupport() {
	if (REALTIME_VOICE_AGENT_CONSULT_SENDER_AUTH_VERSION !== 1) throw new Error("OpenClaw host does not support authenticated sender identity for realtime agent consults; update OpenClaw before enabling FaceTime");
}
function agentIdFromSessionKey(sessionKey, config) {
	if (parseAgentSessionKey(sessionKey)) return resolveAgentIdFromSessionKey(sessionKey);
	return resolveAgentIdFromSessionKey(sessionKey, resolveDefaultAgentId(config));
}
function buildRealtimeInstructions(params) {
	const callControlInstructions = [
		"Call control:",
		`- When the caller asks you to hang up, end, leave, or disconnect the current FaceTime call, call ${FACETIME_END_CALL_TOOL_NAME} immediately.`,
		`- Never delegate a current-call hangup request to ${REALTIME_VOICE_AGENT_CONSULT_TOOL_NAME}, ask for confirmation, or say that you will check.`
	].join("\n");
	const proxyInstructions = params.toolPolicy === "none" ? void 0 : [
		"Mode: OpenClaw agent proxy.",
		"You are the realtime voice surface for the same configured OpenClaw agent the owner can message directly.",
		"The FaceTime caller is the authenticated owner/user described by the loaded workspace profile context. Recognize them from that context without asking them to reconfirm.",
		"Answer greetings, acknowledgements, and questions about your own identity or persona directly from the loaded realtime profile context.",
		"Do not mention a backend, supervisor, helper, or separate system. Present the result as your own work.",
		`Delegate actions, tool work, current facts, memory, workspace context not already loaded above, and user-specific context with ${REALTIME_VOICE_AGENT_CONSULT_TOOL_NAME}.`,
		"Do not block, refuse, or downscope at the voice layer. Delegate to OpenClaw and treat its result as authoritative.",
		"While waiting for a tool result, use at most one short natural backchannel such as \"one sec\"; do not repeat progress updates or treat it as the final answer.",
		"Never claim you retried or are retrying unless a new tool result explicitly confirms a new attempt.",
		buildRealtimeVoiceAgentConsultPolicyInstructions({
			toolPolicy: params.toolPolicy,
			consultPolicy: "substantive"
		})
	].filter(Boolean).join("\n");
	return [
		params.instructions?.trim(),
		params.bootstrapContext?.trim(),
		callControlInstructions,
		proxyInstructions
	].filter(Boolean).join("\n\n");
}
async function resolveFaceTimeRealtimeProvider(params) {
	const configuredProviderId = params.config.realtime.provider;
	const sourceProviders = params.config.realtime.providers;
	const selectedProviderIds = configuredProviderId ? /* @__PURE__ */ new Set([configuredProviderId, getRealtimeVoiceProvider(configuredProviderId, params.fullConfig)?.id]) : void 0;
	const selectedEntries = configuredProviderId ? Object.entries(sourceProviders).filter(([providerId]) => selectedProviderIds?.has(providerId)) : Object.entries(sourceProviders);
	const providers = Object.fromEntries(await Promise.all(selectedEntries.map(async ([providerId, providerConfig]) => {
		const resolved = await resolveConfiguredSecretInputString({
			config: params.fullConfig,
			env: process.env,
			value: providerConfig.apiKey,
			path: `plugins.entries.facetime.config.realtime.providers.${providerId}.apiKey`
		});
		if (resolved.value) return [providerId, {
			...providerConfig,
			apiKey: resolved.value
		}];
		if (resolved.unresolvedRefReason) {
			if (configuredProviderId) throw new Error(resolved.unresolvedRefReason);
			const { apiKey: _unresolvedApiKey, ...remainingConfig } = providerConfig;
			return [providerId, remainingConfig];
		}
		return [providerId, { ...providerConfig }];
	})));
	return resolveConfiguredRealtimeVoiceProvider({
		configuredProviderId,
		providerConfigs: providers,
		providerConfigOverrides: params.config.realtime.voice ? { voice: params.config.realtime.voice } : void 0,
		cfg: params.fullConfig,
		agentId: params.agentId,
		defaultModel: params.config.realtime.model,
		surface: "bridge",
		noRegisteredProviderMessage: "No realtime voice provider registered"
	});
}
//#endregion
//#region extensions/facetime/src/preflight.ts
function parseDefaultAudioDevices(raw) {
	const parsed = JSON.parse(raw);
	const record = asRecord(parsed);
	const input = asRecord(record.input);
	const output = asRecord(record.output);
	if (typeof input.isAggregate !== "boolean" || typeof input.name !== "string" || typeof input.uid !== "string" || typeof output.isAggregate !== "boolean" || typeof output.name !== "string" || typeof output.uid !== "string") throw new Error("invalid audio-device shape");
	return {
		input: {
			isAggregate: input.isAggregate,
			name: input.name,
			uid: input.uid
		},
		output: {
			isAggregate: output.isAggregate,
			name: output.name,
			uid: output.uid
		}
	};
}
function firstLine(value) {
	return typeof value === "string" ? value.trim().split(/\r?\n/u)[0] || void 0 : void 0;
}
function pushCheck(checks, check) {
	checks.push({
		required: true,
		...check
	});
}
function parseCoreAudioDevices(systemProfilerOutput) {
	try {
		const parsed = asRecord(JSON.parse(systemProfilerOutput));
		const devices = (Array.isArray(parsed.SPAudioDataType) ? parsed.SPAudioDataType : []).flatMap((entry) => {
			const record = asRecord(entry);
			const items = record["_items"];
			return Array.isArray(items) ? items : [record];
		}).flatMap((entry) => {
			const record = asRecord(entry);
			const name = record["_name"];
			return typeof name === "string" ? [{
				name,
				virtual: record.coreaudio_device_transport === "coreaudio_device_type_virtual"
			}] : [];
		});
		if (devices.length > 0) return devices;
	} catch {}
	const devices = [];
	for (const line of systemProfilerOutput.split(/\r?\n/u)) {
		const match = line.match(/^\s{8}(.+):\s*$/u);
		if (match?.[1]) devices.push({
			name: match[1].trim(),
			virtual: false
		});
	}
	return [...new Map(devices.map((device) => [device.name, device])).values()];
}
function findPhysicalOutputProblem(defaults, devices) {
	if (defaults.output.isAggregate) return `system output is aggregate device ${defaults.output.name}`;
	if (devices.some((device) => device.name === defaults.output.name && device.virtual) || /BlackHole|OpenClaw-(?:Feed|Mic)/iu.test(defaults.output.name)) return `system output is virtual device ${defaults.output.name}`;
}
async function checkCallApp(params) {
	for (const app of ["FaceTime", "Phone"]) if ((await params.runCommandWithTimeout([
		"/usr/bin/pgrep",
		"-x",
		app
	], { timeoutMs: 5e3 })).code === 0) {
		pushCheck(params.checks, {
			id: "call-app-running",
			label: "FaceTime or Phone process",
			ok: true,
			message: app
		});
		return;
	}
	pushCheck(params.checks, {
		id: "call-app-running",
		label: "FaceTime or Phone process",
		ok: false,
		message: "open FaceTime for video calls or Phone for FaceTime audio calls"
	});
}
async function runFaceTimePreflight(params) {
	const runCommandWithTimeout = params.runtime.system.runCommandWithTimeout;
	const checks = [];
	pushCheck(checks, {
		id: "helper-connected",
		label: "FaceTime helper socket",
		ok: params.helperConnected,
		message: params.helperConnected ? "helper connected" : "no authenticated helper connected on the local UID-derived endpoint"
	});
	const executable = await runCommandWithTimeout([
		"/bin/test",
		"-x",
		params.captureBinary
	], { timeoutMs: 5e3 });
	pushCheck(checks, {
		id: "capture-binary",
		label: "FaceTime process-tap capture helper",
		ok: executable.code === 0,
		message: executable.code === 0 ? params.captureBinary : "capture helper is missing; reinstall with brew install openclaw/tap/openclaw-facetime"
	});
	await checkCallApp({
		runCommandWithTimeout,
		checks
	});
	const profiler = await runCommandWithTimeout([
		"/usr/sbin/system_profiler",
		"SPAudioDataType",
		"-json"
	], { timeoutMs: 1e4 });
	const audioDevices = profiler.code === 0 ? parseCoreAudioDevices(profiler.stdout ?? "") : [];
	const deviceNames = new Set(audioDevices.map((device) => device.name));
	for (const [id, label, deviceName] of [[
		"paired-driver-mic",
		"OpenClaw microphone device",
		FACETIME_MIC_DEVICE_NAME
	], [
		"paired-driver-feed",
		"OpenClaw feed device",
		FACETIME_FEED_DEVICE_NAME
	]]) {
		const found = deviceNames.has(deviceName);
		pushCheck(checks, {
			id,
			label,
			ok: found,
			message: found ? deviceName : `missing ${deviceName}; run openclaw gateway call facetime.installDriver --json`
		});
	}
	let currentAudioDefaults;
	let currentAudioError;
	if (executable.code === 0) {
		const defaults = await runCommandWithTimeout([params.captureBinary, "--default-devices"], { timeoutMs: 5e3 });
		if (defaults.code === 0) try {
			currentAudioDefaults = parseDefaultAudioDevices(defaults.stdout ?? "");
			const problem = findPhysicalOutputProblem(currentAudioDefaults, audioDevices);
			pushCheck(checks, {
				id: "physical-output",
				label: "Physical call output",
				ok: !problem,
				message: problem ?? currentAudioDefaults.output.name
			});
		} catch (error) {
			currentAudioError = `invalid audio-device JSON: ${formatErrorMessage(error)}`;
		}
		else currentAudioError = firstLine(defaults.stderr) ?? firstLine(defaults.stdout);
		if (currentAudioError) pushCheck(checks, {
			id: "physical-output",
			label: "Physical call output",
			ok: false,
			message: currentAudioError
		});
		const capture = await runCommandWithTimeout([params.captureBinary, "--check"], { timeoutMs: 8e3 });
		pushCheck(checks, {
			id: "process-tap",
			label: "FaceTime app-audio process tap",
			ok: capture.code === 0,
			message: firstLine(capture.stderr) ?? firstLine(capture.stdout) ?? "grant Screen & System Audio Recording permission"
		});
	} else {
		pushCheck(checks, {
			id: "physical-output",
			label: "Physical call output",
			ok: false,
			message: "capture helper unavailable"
		});
		pushCheck(checks, {
			id: "process-tap",
			label: "FaceTime app-audio process tap",
			ok: false,
			message: "capture helper unavailable"
		});
	}
	let providerReady = false;
	let providerMessage;
	try {
		const resolved = await resolveFaceTimeRealtimeProvider({
			config: params.config,
			fullConfig: params.fullConfig,
			agentId: agentIdFromSessionKey(params.config.realtime.sessionKey, params.fullConfig)
		});
		providerReady = true;
		providerMessage = `${resolved.provider.id}:${normalizeOptionalString(resolved.providerConfig.model) ?? "provider default"}`;
	} catch (error) {
		providerMessage = formatErrorMessage(error);
	}
	pushCheck(checks, {
		id: "realtime-provider",
		label: "Realtime provider readiness",
		ok: providerReady,
		message: providerMessage
	});
	return {
		ok: checks.every((check) => check.ok || !check.required),
		helperConnected: params.helperConnected,
		currentAudioDefaults,
		currentAudioError,
		checks
	};
}
//#endregion
//#region extensions/facetime/src/runtime-carrier-process.ts
async function terminateExactCarrierProcesses(params) {
	params.assertCurrent();
	if (params.peers.size === 0) throw new Error("no authenticated carrier process identity is available for fail-closed shutdown");
	for (const peer of params.peers.values()) {
		const expected = peer.bundleIdentifier === "com.apple.FaceTime" ? "FaceTime" : peer.bundleIdentifier === "com.apple.FaceTime.FTConversationService" ? "FTConversationService" : peer.bundleIdentifier === "com.apple.mobilephone" ? "Phone" : peer.bundleIdentifier === "com.apple.TelephonyUtilities" ? "TelephonyUtilities" : "";
		const inspectExactProcess = async () => {
			const inspected = await params.runtime.system.runCommandWithTimeout([
				"/bin/ps",
				"-p",
				String(peer.processId),
				"-o",
				"comm="
			], { timeoutMs: 500 });
			params.assertCurrent();
			if (inspected.code === 1 && !inspected.stdout.trim() && !inspected.stderr.trim()) return false;
			const executable = inspected.stdout.trim();
			if (inspected.code !== 0 || !expected || executable !== expected && !executable.endsWith(`/${expected}`)) throw new Error("authenticated carrier process identity no longer matches its executable");
			const started = await params.runtime.system.runCommandWithTimeout([
				"/bin/ps",
				"-p",
				String(peer.processId),
				"-o",
				"lstart="
			], { timeoutMs: 500 });
			params.assertCurrent();
			if (started.code === 1 && !started.stdout.trim() && !started.stderr.trim()) return false;
			const observedStartedAt = Date.parse(started.stdout.trim());
			if (started.code !== 0 || !Number.isFinite(observedStartedAt) || observedStartedAt !== Math.floor(peer.processStartedAtMs / 1e3) * 1e3) throw new Error("authenticated carrier process identity no longer matches its executable");
			return true;
		};
		let alive = await inspectExactProcess();
		params.assertCurrent();
		for (const signal of ["-TERM", "-KILL"]) {
			if (!alive) break;
			await params.runtime.system.runCommandWithTimeout([
				"/bin/kill",
				signal,
				String(peer.processId)
			], { timeoutMs: 500 });
			params.assertCurrent();
			alive = await inspectExactProcess();
			params.assertCurrent();
		}
		if (alive) throw new Error("authenticated carrier process remains alive after force termination");
	}
}
//#endregion
//#region extensions/facetime/src/talk-consult-controller.ts
function createFaceTimeConsultController(params) {
	const pending = /* @__PURE__ */ new Map();
	let hangupRequested = false;
	const ownsConsult = (consult) => pending.get(consult.callId) === consult && consult.generation === params.getGeneration() && !params.isUnavailable();
	const failDelivery = async (event, error, reason) => {
		const normalized = error instanceof Error ? error : new Error(String(error));
		params.remember({
			type: "tool.error",
			turnId: event.turnId,
			callId: event.callId,
			payload: {
				name: event.name,
				error: formatErrorMessage(normalized)
			},
			final: true
		});
		try {
			await params.suspendMedia(reason);
			if (await params.reportFailure(normalized)) await params.close(reason);
		} catch (failure) {
			params.logger.warn?.(`[facetime] tool delivery recovery failed: ${formatErrorMessage(failure)}`);
		}
	};
	const abortConsult = (consult, reason) => {
		consult.abortController.abort(/* @__PURE__ */ new Error(`FaceTime agent consult ${reason}`));
		consult.runRegistration?.controller.abort(/* @__PURE__ */ new Error(`FaceTime agent consult run ${reason}`));
	};
	const abortForClose = () => {
		for (const consult of pending.values()) {
			consult.cancelRequested = true;
			pending.delete(consult.callId);
			abortConsult(consult, "closed or reset");
		}
	};
	const cancelPending = () => {
		for (const consult of pending.values()) {
			if (consult.cancelRequested) continue;
			consult.cancelRequested = true;
			abortConsult(consult, "superseded");
			if (consult.terminalSubmitted) continue;
			consult.terminalSubmitted = true;
			const result = buildRealtimeVoiceAgentCancelProviderResult("A new agent consult replaced this request before it completed.");
			(async () => {
				try {
					const bridge = params.getBridge();
					if (!bridge) throw new Error("Realtime bridge unavailable during agent consult cancellation");
					const options = bridge.bridge.supportsToolResultSuppression === false ? void 0 : { suppressResponse: true };
					await bridge.submitToolResult(consult.callId, result, options);
					if (!ownsConsult(consult)) return;
					pending.delete(consult.callId);
					params.remember({
						type: "tool.result",
						turnId: consult.turnId,
						callId: consult.callId,
						payload: {
							name: consult.name,
							result
						},
						final: true
					});
				} catch (error) {
					if (!ownsConsult(consult)) return;
					pending.delete(consult.callId);
					await failDelivery(consult, error, "consult-cancel-failed");
				}
			})();
		}
	};
	const submitHangupResult = async (event) => {
		const bridge = params.getBridge();
		const callId = event.callId || event.itemId;
		const turnId = params.ensureTurn();
		const result = {
			status: "ending",
			message: "The current FaceTime call is ending. Do not speak another response."
		};
		params.remember({
			type: "tool.call",
			turnId,
			itemId: event.itemId,
			callId,
			payload: {
				name: event.name,
				args: event.args
			}
		});
		try {
			const options = bridge?.bridge.supportsToolResultSuppression === false ? void 0 : { suppressResponse: true };
			await bridge?.submitToolResult(callId, result, options);
			params.remember({
				type: "tool.result",
				turnId,
				callId,
				payload: {
					name: event.name,
					result
				},
				final: true
			});
		} catch (error) {
			const message = formatErrorMessage(error);
			params.logger.debug?.(`[facetime] hangup tool result ignored: ${message}`);
			params.remember({
				type: "tool.error",
				turnId,
				callId,
				payload: {
					name: event.name,
					error: message
				},
				final: true
			});
		}
	};
	const submitToolError = async (event, error) => {
		const callId = event.callId || event.itemId;
		const generation = params.getGeneration();
		params.remember({
			type: "tool.error",
			callId,
			payload: {
				name: event.name,
				error
			},
			final: true
		});
		try {
			const bridge = params.getBridge();
			if (!bridge) throw new Error("Realtime bridge unavailable during tool error delivery");
			await bridge.submitToolResult(callId, { error });
		} catch (failure) {
			if (generation === params.getGeneration() && !params.isUnavailable()) await failDelivery({
				callId,
				name: event.name
			}, failure, "tool-error-delivery-failed");
		}
	};
	const handleToolCall = async (event) => {
		if (params.isUnavailable()) return;
		const callId = event.callId || event.itemId;
		if (event.name === "facetime_end_call") {
			const shouldRequestHangup = !hangupRequested;
			hangupRequested = true;
			await submitHangupResult(event);
			if (shouldRequestHangup) try {
				await params.onHangupRequested();
			} catch (error) {
				params.logger.warn?.(`[facetime] caller-requested hangup remains pending: ${formatErrorMessage(error)}`);
			}
			return;
		}
		if (event.name !== REALTIME_VOICE_AGENT_CONSULT_TOOL_NAME) {
			await submitToolError(event, `Tool "${event.name}" not available`);
			return;
		}
		cancelPending();
		const turnId = params.ensureTurn();
		const consult = {
			callId,
			turnId,
			name: event.name,
			cancelRequested: false,
			terminalSubmitted: false,
			generation: params.getGeneration(),
			abortController: new AbortController()
		};
		pending.set(callId, consult);
		params.remember({
			type: "tool.call",
			turnId,
			itemId: event.itemId,
			callId,
			payload: {
				name: event.name,
				args: event.args
			}
		});
		params.remember({
			type: "tool.progress",
			turnId,
			callId,
			payload: {
				name: event.name,
				status: "working"
			}
		});
		const bridge = params.getBridge();
		if (bridge?.bridge.supportsToolResultContinuation) {
			try {
				await bridge.submitToolResult(callId, buildRealtimeVoiceAgentConsultWorkingResponse("caller"), { willContinue: true });
			} catch (error) {
				if (ownsConsult(consult) && !consult.cancelRequested) {
					pending.delete(callId);
					await failDelivery(consult, error, "consult-working-delivery-failed");
				}
				return;
			}
			if (!ownsConsult(consult) || consult.cancelRequested) return;
		}
		const deliverResult = async (result, backendError) => {
			if (!ownsConsult(consult) || consult.cancelRequested) return;
			consult.terminalSubmitted = true;
			try {
				const currentBridge = params.getBridge();
				if (!currentBridge) throw new Error("Realtime bridge unavailable during agent consult delivery");
				await currentBridge.submitToolResult(callId, result);
			} catch (error) {
				if (ownsConsult(consult)) {
					pending.delete(callId);
					await failDelivery(consult, error, "consult-result-delivery-failed");
				}
				return;
			}
			if (!ownsConsult(consult)) return;
			pending.delete(callId);
			params.remember({
				type: backendError === void 0 ? "tool.result" : "tool.error",
				turnId,
				callId,
				payload: backendError === void 0 ? {
					name: event.name,
					result
				} : {
					name: event.name,
					error: backendError
				},
				final: true
			});
		};
		consultRealtimeVoiceAgent({
			cfg: params.fullConfig,
			agentRuntime: params.runtime.agent,
			logger: params.logger,
			agentId: params.consultAgentId,
			sessionKey: params.consultSessionKey,
			spawnedBy: params.requesterSessionKey,
			senderId: params.senderId,
			senderIsOwner: params.senderIsOwner,
			contextMode: "fork",
			messageProvider: AGENT_CONSULT_MESSAGE_PROVIDER,
			lane: `facetime:${params.normalizedCallUUID}`,
			runIdPrefix: `facetime:${params.normalizedCallUUID}`,
			args: event.args,
			transcript: params.transcript,
			surface: "a private FaceTime call",
			userLabel: "Caller",
			assistantLabel: "Assistant",
			questionSourceLabel: "caller",
			toolsAllow: resolveRealtimeVoiceAgentConsultToolsAllow(params.config.realtime.toolPolicy),
			extraSystemPrompt: CONSULT_SYSTEM_PROMPT,
			thinkLevel: "off",
			abortSignal: consult.abortController.signal,
			onRunStarted: ({ runId }) => {
				const registration = {
					runId,
					controller: new AbortController()
				};
				consult.runRegistration = registration;
				if (consult.cancelRequested || pending.get(consult.callId) !== consult) registration.controller.abort(/* @__PURE__ */ new Error("FaceTime agent consult was already cancelled"));
				return {
					abortSignal: registration.controller.signal,
					cleanup: () => {
						if (consult.runRegistration === registration) consult.runRegistration = void 0;
					}
				};
			}
		}).then((result) => deliverResult(result), async (error) => {
			if (!ownsConsult(consult) || consult.cancelRequested) return;
			const message = formatErrorMessage(error);
			params.logger.warn?.(`[facetime] agent consult failed: ${message}`);
			await deliverResult({ error: message }, message);
		});
	};
	return {
		abortForClose,
		handleToolCall
	};
}
//#endregion
//#region extensions/facetime/src/talk-initial-greeting.ts
const FACETIME_INITIAL_GREETING = "Greet the caller briefly, introduce yourself using your configured identity, and ask how you can help.";
const FACETIME_GREETING_MEDIA_SETTLE_MS = 100;
function createFaceTimeInitialGreeting(params) {
	let timer;
	let dismissed = false;
	const clear = () => {
		if (timer) {
			clearTimeout(timer);
			timer = void 0;
		}
	};
	return {
		instructions: FACETIME_INITIAL_GREETING,
		schedule() {
			if (dismissed || timer) return;
			timer = setTimeout(() => {
				timer = void 0;
				dismissed = true;
				params.speak(FACETIME_INITIAL_GREETING);
			}, params.delayMs ?? FACETIME_GREETING_MEDIA_SETTLE_MS);
			timer.unref?.();
		},
		cancel() {
			dismissed = true;
			clear();
		}
	};
}
//#endregion
//#region extensions/facetime/src/talk-driver.ts
async function startFaceTimeTalkDriver(params) {
	if (params.signal?.aborted) throw new Error("FaceTime talk startup aborted");
	assertAuthenticatedSenderConsultSupport();
	const consultAgentId = agentIdFromSessionKey(params.config.realtime.sessionKey, params.fullConfig);
	const normalizedCallUUID = params.callUUID.trim().toLowerCase();
	const consultSessionKey = `agent:${consultAgentId}:facetime:${normalizedCallUUID}`;
	const requesterSessionKey = params.config.realtime.sessionKey.startsWith("agent:") ? params.config.realtime.sessionKey : `agent:${consultAgentId}:${params.config.realtime.sessionKey}`;
	const talk = createTalkSessionController({
		sessionId: `facetime:${params.callUUID}`,
		mode: "realtime",
		transport: "gateway-relay",
		brain: "agent-consult",
		provider: params.config.realtime.provider,
		maxRecentEvents: 40,
		turnIdPrefix: `facetime:${params.callUUID}:turn`
	}, { onEvent: recordTalkObservabilityEvent });
	const transcript = [];
	const appendTranscript = (entry) => {
		recordRealtimeVoiceTranscript(transcript, entry.role, entry.text.slice(0, MAX_TRANSCRIPT_ENTRY_CHARS), 40);
		while (transcript.reduce((total, current) => total + current.text.length, 0) > MAX_TRANSCRIPT_CHARS) transcript.shift();
	};
	let stopped = false;
	let mediaSuspended = false;
	let bridge;
	let lastInputAudioStatusAt = 0;
	let callMediaTimestampMs = 0;
	let modelMediaGeneration = 1;
	let responseGeneration = 0;
	let response;
	const settledResponseIds = /* @__PURE__ */ new Set();
	let suppressNextUnkeyedLegacyTerminal = false;
	const consultRef = {};
	let failurePromise;
	let activated = false;
	let providerReady = false;
	const providerReadyDeferred = createDeferred();
	let providerConnectPromise;
	let audioReadyPromise;
	let interruptProviderConnect;
	let mediaSuspensionError;
	const mediaSuspendedDeferred = createDeferred();
	const mediaSuspendedPromise = mediaSuspendedDeferred.promise;
	mediaSuspendedPromise.catch(() => {});
	let suspendMediaPromise;
	let closePromise;
	let startupSettled = false;
	let startupFailure;
	const startupFailureDeferred = createDeferred();
	const startupFailurePromise = startupFailureDeferred.promise;
	startupFailurePromise.catch(() => {});
	const signalStartupFailure = (error) => {
		if (startupSettled || startupFailure) return;
		startupFailure = error;
		startupFailureDeferred.reject(error);
	};
	const initialGreeting = createFaceTimeInitialGreeting({ speak: (instructions) => {
		if (!stopped && !mediaSuspended && activated && providerReady) bridge?.triggerGreeting(instructions);
	} });
	const reportFailure = (error) => {
		if (failurePromise) return failurePromise;
		failurePromise = Promise.resolve(params.onFailure?.(error)).then((safeToClose) => {
			return safeToClose !== false;
		});
		return failurePromise;
	};
	const suspendMedia = async (reason = "suspended") => {
		if (suspendMediaPromise) return await suspendMediaPromise;
		mediaSuspended = true;
		activated = false;
		initialGreeting.cancel();
		providerReady = false;
		mediaSuspensionError ??= /* @__PURE__ */ new Error(`FaceTime model media suspended: ${reason}`);
		mediaSuspendedDeferred.reject(mediaSuspensionError);
		interruptProviderConnect?.();
		consultRef.current?.abortForClose();
		suspendMediaPromise = (async () => {
			try {
				await bridge?.close();
			} catch (error) {
				params.logger.debug?.(`[facetime] realtime bridge close ignored: ${formatErrorMessage(error)}`);
			}
			try {
				await pump?.suspendMedia();
			} catch (error) {
				params.logger.warn?.(`[facetime] native media suspension failed: ${formatErrorMessage(error)}`);
			}
			resetResponsePlayback();
			finishOutputAudio(reason);
		})();
		return await suspendMediaPromise;
	};
	const close = async (reason = "closed") => {
		if (closePromise) return await closePromise;
		closePromise = (async () => {
			const mediaStop = suspendMedia(reason);
			stopped = true;
			try {
				await mediaStop;
			} finally {
				try {
					await pump?.stop();
				} finally {
					remember({
						type: "session.closed",
						payload: { reason },
						final: true
					});
				}
			}
		})();
		return await closePromise;
	};
	const remember = (input) => talk.emit(input);
	const ensureTurn = () => {
		return talk.ensureTurn({ payload: { callUUID: params.callUUID } }).turnId;
	};
	const finishOutputAudio = (reason) => {
		talk.finishOutputAudio({ payload: { reason } });
	};
	const endTurn = (reason) => {
		return talk.endTurn({ payload: { reason } }).ok;
	};
	const playedCurrentResponseMs = () => response === void 0 ? 0 : Math.max(0, ((pump?.playedAudioFrames() ?? 0) - response.playbackStartFrame) / 24);
	const resetResponsePlayback = () => {
		response = void 0;
	};
	const finishDrainedResponse = () => {
		const current = response;
		if (!current || current.outcome?.status !== "completed") return;
		callMediaTimestampMs = Math.max(callMediaTimestampMs, current.startTimestampMs + playedCurrentResponseMs());
		bridge?.setMediaTimestamp(Math.floor(callMediaTimestampMs));
		rememberSettledResponse(current.id);
		resetResponsePlayback();
		finishOutputAudio("playback-drained");
		endTurn("completed");
	};
	const rememberSettledResponse = (responseId) => {
		if (!responseId) return;
		settledResponseIds.add(responseId);
		if (settledResponseIds.size > 64) {
			const oldest = settledResponseIds.values().next().value;
			if (oldest) settledResponseIds.delete(oldest);
		}
	};
	const startResponse = (responseId) => {
		if (response && responseId && response.id === responseId) return;
		if (response && responseId && !response.id) {
			response.id = responseId;
			return;
		}
		if (response) {
			pump?.clearOutputAudio();
			finishOutputAudio("response-superseded");
			endTurn("response-superseded");
		}
		response = {
			id: responseId,
			generation: ++responseGeneration,
			startTimestampMs: callMediaTimestampMs,
			playbackStartFrame: pump?.playedAudioFrames() ?? 0
		};
		bridge?.setMediaTimestamp(Math.floor(callMediaTimestampMs));
	};
	const finishResponseOutcome = (outcome, typed) => {
		if (outcome.responseId && settledResponseIds.has(outcome.responseId)) return;
		if (outcome.responseId && response?.id && outcome.responseId !== response.id) return;
		if (!response) startResponse(outcome.responseId);
		if (!response) return;
		response.outcome = outcome;
		if (!outcome.responseId && typed) suppressNextUnkeyedLegacyTerminal = true;
		if (outcome.status === "completed") {
			pump?.finishOutputAudio();
			if ((pump?.queuedAudioFrames() ?? 0) <= 0) finishDrainedResponse();
			return;
		}
		pump?.clearOutputAudio();
		if (outcome.status === "failed" || outcome.status === "incomplete") remember({
			type: "session.error",
			payload: outcome,
			final: true
		});
		rememberSettledResponse(outcome.responseId);
		finishOutputAudio(outcome.status);
		endTurn(outcome.status);
		resetResponsePlayback();
	};
	const resetProviderContinuity = () => {
		modelMediaGeneration += 1;
		consultRef.current?.abortForClose();
		pump?.clearOutputAudio();
		resetResponsePlayback();
		finishOutputAudio("continuity-reset");
		endTurn("continuity-reset");
	};
	const consultController = createFaceTimeConsultController({
		config: params.config,
		fullConfig: params.fullConfig,
		runtime: params.runtime,
		logger: params.logger,
		consultAgentId,
		consultSessionKey,
		requesterSessionKey,
		normalizedCallUUID,
		senderId: params.senderId,
		senderIsOwner: params.senderIsOwner,
		transcript,
		getBridge: () => bridge,
		getGeneration: () => modelMediaGeneration,
		isUnavailable: () => stopped || mediaSuspended,
		ensureTurn,
		remember,
		suspendMedia,
		reportFailure,
		close,
		onHangupRequested: params.onHangupRequested
	});
	consultRef.current = consultController;
	remember({
		type: "session.started",
		payload: { callUUID: params.callUUID }
	});
	const pump = startFaceTimeAudioPump({
		captureBinary: params.captureBinary,
		logger: params.logger,
		onInputAudio(audio) {
			if (stopped || mediaSuspended || !activated) return;
			callMediaTimestampMs += audio.byteLength / 2 / 24;
			if (!talk.outputAudioActive) bridge?.setMediaTimestamp(Math.floor(callMediaTimestampMs));
			const now = Date.now();
			if (now - lastInputAudioStatusAt >= 1e3) {
				lastInputAudioStatusAt = now;
				remember({
					type: "input.audio.delta",
					turnId: ensureTurn(),
					payload: { byteLength: audio.byteLength }
				});
			}
			bridge?.sendAudio(audio);
		},
		onSuppressionLost(error) {
			reportFailure(error);
		},
		async onError(error) {
			signalStartupFailure(error);
			remember({
				type: "session.error",
				payload: { message: formatErrorMessage(error) },
				final: true
			});
			await suspendMedia("audio-error");
			const safeToClose = await reportFailure(error);
			if (safeToClose) await close("audio-error");
			return safeToClose;
		},
		onPlaybackDrained() {
			finishDrainedResponse();
		}
	});
	const connectProvider = async () => {
		if (providerConnectPromise) return await providerConnectPromise;
		providerConnectPromise = (async () => {
			let removeAbortListener;
			let readinessTimer;
			const interrupted = new Promise((_resolve, reject) => {
				const interrupt = () => reject(/* @__PURE__ */ new Error("FaceTime talk startup aborted"));
				interruptProviderConnect = interrupt;
				params.signal?.addEventListener("abort", interrupt, { once: true });
				removeAbortListener = () => params.signal?.removeEventListener("abort", interrupt);
				if (params.signal?.aborted || stopped || mediaSuspended) interrupt();
			});
			const readinessTimedOut = new Promise((_resolve, reject) => {
				readinessTimer = setTimeout(() => {
					reject(/* @__PURE__ */ new Error("Realtime provider was not ready within 15 seconds"));
				}, REALTIME_READY_TIMEOUT_MS);
				readinessTimer.unref?.();
			});
			const prepareAndConnect = async () => {
				const providerResolution = resolveFaceTimeRealtimeProvider({
					config: params.config,
					fullConfig: params.fullConfig,
					agentId: consultAgentId
				});
				const bootstrapContextResolution = resolveRealtimeBootstrapContextInstructions({
					config: params.fullConfig,
					agentId: consultAgentId,
					sessionKey: requesterSessionKey,
					warn: (message) => params.logger.warn?.(`[facetime] realtime bootstrap context: ${message}`)
				}).catch((error) => {
					params.logger.warn?.(`[facetime] realtime bootstrap context unavailable: ${formatErrorMessage(error)}`);
				});
				const [resolved, bootstrapContext] = await Promise.all([providerResolution, bootstrapContextResolution]);
				if (params.signal?.aborted || stopped || mediaSuspended) throw new Error("FaceTime talk startup aborted");
				bridge = createRealtimeVoiceBridgeSession({
					provider: resolved.provider,
					capabilities: resolved.capabilities,
					cfg: params.fullConfig,
					agentId: consultAgentId,
					providerConfig: resolved.providerConfig,
					audioFormat: REALTIME_VOICE_AUDIO_FORMAT_PCM16_24KHZ,
					instructions: buildRealtimeInstructions({
						instructions: params.config.realtime.instructions,
						bootstrapContext,
						toolPolicy: params.config.realtime.toolPolicy
					}),
					autoRespondToAudio: true,
					triggerGreetingOnReady: false,
					initialGreetingInstructions: initialGreeting.instructions,
					markStrategy: "ack-immediately",
					tools: resolveRealtimeVoiceAgentConsultTools(params.config.realtime.toolPolicy, [FACETIME_END_CALL_TOOL]),
					audioSink: {
						isOpen: () => !stopped && !mediaSuspended,
						sendAudio(audio, metadata) {
							if (stopped || mediaSuspended) return;
							const turnId = ensureTurn();
							if (!response) startResponse();
							talk.startOutputAudio({
								turnId,
								payload: { callUUID: params.callUUID }
							});
							remember({
								type: "output.audio.delta",
								turnId,
								payload: { byteLength: audio.byteLength }
							});
							pump?.writeOutputAudio(audio, metadata);
						},
						getPlaybackState: () => pump.getPlaybackState(),
						clearAudio() {
							if (stopped || mediaSuspended) return;
							pump?.clearOutputAudio();
							resetResponsePlayback();
							finishOutputAudio("clear");
						}
					},
					onTranscript(role, text, final) {
						if (stopped || mediaSuspended) return;
						const turnId = ensureTurn();
						remember({
							type: role === "assistant" ? final ? "output.text.done" : "output.text.delta" : final ? "transcript.done" : "transcript.delta",
							turnId,
							payload: role === "assistant" ? { text } : {
								role,
								text
							},
							final
						});
						if (role === "user" && final) {
							if (text.trim()) initialGreeting.cancel();
							else initialGreeting.schedule();
							remember({
								type: "input.audio.committed",
								turnId,
								payload: { callUUID: params.callUUID },
								final: true
							});
						}
						if (final) appendTranscript({
							role,
							text
						});
					},
					onEvent(event) {
						if (stopped || mediaSuspended) return;
						if (!(event.direction === "client" && event.type === "input_audio_buffer.append")) remember({
							type: "health.changed",
							payload: {
								name: `${event.direction}:${event.type}`,
								message: event.detail
							}
						});
						if (event.type === "response.created") startResponse(event.responseId);
						else if (event.type === "session.continuity.reset") resetProviderContinuity();
						else if (event.type === "response.done") {
							if (!event.responseId && suppressNextUnkeyedLegacyTerminal) suppressNextUnkeyedLegacyTerminal = false;
							else finishResponseOutcome({
								status: "completed",
								...event.responseId ? { responseId: event.responseId } : {}
							}, false);
						} else if (event.type === "error") remember({
							type: "session.error",
							payload: { message: event.detail ?? "Realtime provider error" },
							final: true
						});
					},
					onResponseDone(outcome) {
						finishResponseOutcome(outcome, true);
					},
					onToolCall: consultController.handleToolCall,
					onReady() {
						if (!stopped && !mediaSuspended) {
							remember({
								type: "session.ready",
								payload: { callUUID: params.callUUID }
							});
							providerReadyDeferred.resolve();
						}
					},
					onError(error) {
						if (stopped || mediaSuspended) return;
						remember({
							type: "session.error",
							payload: { message: formatErrorMessage(error) },
							final: true
						});
						params.logger.warn(`[facetime] realtime bridge failed: ${formatErrorMessage(error)}`);
						if (!providerReady && !startupSettled) signalStartupFailure(error);
					},
					onClose(reason) {
						if (stopped || mediaSuspended) return;
						finishOutputAudio(reason);
						remember({
							type: "session.closed",
							payload: { reason },
							final: true
						});
						const error = /* @__PURE__ */ new Error(`Realtime bridge closed unexpectedly: ${reason}`);
						signalStartupFailure(error);
						(async () => {
							await suspendMedia("provider-closed");
							if (await reportFailure(error)) await close("provider-closed");
						})();
					}
				});
				await bridge.connect();
			};
			try {
				await Promise.race([
					Promise.all([prepareAndConnect(), providerReadyDeferred.promise]),
					startupFailurePromise,
					interrupted,
					readinessTimedOut
				]);
				if (startupFailure) throw startupFailure;
				if (params.signal?.aborted || stopped || mediaSuspended) throw new Error("FaceTime talk startup aborted");
				startupSettled = true;
				providerReady = true;
			} catch (error) {
				const normalized = error instanceof Error ? error : new Error(String(error));
				await suspendMedia(params.signal?.aborted || stopped ? "startup-aborted" : "connect-failed");
				if (stopped || await reportFailure(normalized)) await close(params.signal?.aborted || stopped ? "startup-aborted" : "connect-failed");
				throw normalized;
			} finally {
				if (readinessTimer) clearTimeout(readinessTimer);
				interruptProviderConnect = void 0;
				removeAbortListener?.();
			}
		})();
		return await providerConnectPromise;
	};
	const providerConnect = connectProvider();
	providerConnect.catch(() => {});
	try {
		await Promise.race([pump.suppressionReady(), startupFailurePromise]);
	} catch (error) {
		const normalized = error instanceof Error ? error : new Error(String(error));
		await suspendMedia("capture-start-failed");
		if (startupFailure === normalized ? await reportFailure(normalized) : true) await close("capture-start-failed");
		throw error;
	}
	return {
		callUUID: params.callUUID,
		get recentTalkEvents() {
			return talk.recentEvents;
		},
		async readyForAudio() {
			audioReadyPromise ??= providerConnect.then(async () => {
				await Promise.race([pump?.routeReady(), mediaSuspendedPromise]);
				if (mediaSuspended || stopped) throw mediaSuspensionError ?? /* @__PURE__ */ new Error("FaceTime model media is unavailable");
			});
			await audioReadyPromise;
		},
		processOutputSuppressed() {
			return pump?.processOutputSuppressed() ?? false;
		},
		realtimeActive() {
			return providerReady && !mediaSuspended && !stopped;
		},
		activate() {
			if (stopped || mediaSuspended || !providerReady || activated) return;
			activated = true;
			initialGreeting.schedule();
		},
		suspendMedia,
		close
	};
}
//#endregion
//#region extensions/facetime/src/runtime-call-control.ts
function createFaceTimeCallControl(params) {
	const runCarrierActionAcrossAliases = async (request) => {
		const candidates = [request.call.carrierCallUUID, ...[...request.call.carrierCallUUIDs].toReversed()].filter((candidate, index, all) => all.indexOf(candidate) === index);
		let lastAbsent;
		for (const candidate of candidates) {
			let result;
			try {
				result = await request.call.runCarrierCommand({
					generation: request.generation,
					allowClosing: true,
					action: async () => await request.run(candidate)
				});
			} catch (error) {
				if (!(error instanceof FaceTimeHelperAmbiguousError)) throw error;
				try {
					projectCompleteFaceTimeAbsence(error.result);
					lastAbsent = error;
				} catch {
					throw error;
				}
				continue;
			}
			try {
				projectFaceTimeNativeAction(request.action, result);
				request.call.promoteCarrierCallUUID(candidate);
				return result;
			} catch (error) {
				try {
					projectCompleteFaceTimeAbsence(result);
					lastAbsent = error instanceof FaceTimeHelperAmbiguousError ? error : new FaceTimeHelperAmbiguousError(`FaceTime ${request.action} carrier owner is missing`, result);
				} catch {
					throw error;
				}
			}
		}
		throw lastAbsent ?? /* @__PURE__ */ new Error(`FaceTime ${request.action} carrier owner is missing`);
	};
	const routeCallAudio = async (call) => {
		if (!call.audioReady) {
			const routing = call.audioRouting ?? (async () => {
				const assertCallOpen = () => {
					if (call.lifecycleAbort.signal.aborted || params.calls.get(call.callUUID) !== call) throw new Error("FaceTime call closed during audio routing");
				};
				assertCallOpen();
				await access(params.captureBinary, constants.X_OK);
				assertCallOpen();
				call.audioReady = true;
				call.audioTransport = {
					captureBinary: params.captureBinary,
					feedDevice: "OpenClaw-Feed",
					microphoneDevice: "OpenClaw-Mic",
					processInputVerified: false,
					processOutputSuppressed: false
				};
				call.lastRoutingError = void 0;
			})();
			call.audioRouting = routing;
			try {
				await routing;
			} catch (error) {
				call.audioReady = false;
				call.lastRoutingError = formatErrorMessage(error);
				throw error;
			} finally {
				if (call.audioRouting === routing) call.audioRouting = void 0;
			}
		}
		if (call.lifecycleAbort.signal.aborted) throw new Error("FaceTime call closed during audio routing");
	};
	const enableCallAudio = async (call) => {
		const generation = call.captureGeneration();
		const mutedResult = await call.runCarrierCommand({
			generation,
			action: async () => await params.helper.setMuted(call.carrierCallUUID, false)
		});
		call.lastHelperAction = mutedResult;
		params.retainHelperResultPeers(call, mutedResult);
		projectFaceTimeNativeAction("unmute", mutedResult);
		const transmissionResult = await call.runCarrierCommand({
			generation,
			action: async () => await params.helper.startTransmission(call.carrierCallUUID)
		});
		call.lastHelperAction = transmissionResult;
		params.retainHelperResultPeers(call, transmissionResult);
		projectFaceTimeNativeAction("activate", transmissionResult);
		call.markCarrierActive(generation);
		if (call.audioTransport) {
			call.audioTransport.processInputVerified = true;
			call.audioTransport.processOutputSuppressed = call.talk?.processOutputSuppressed() === true;
		}
	};
	const closeCall = async (call, reason) => {
		if (params.calls.active !== call) return;
		if (call.carrierHangupRetryTimer) {
			clearTimeout(call.carrierHangupRetryTimer);
			call.carrierHangupRetryTimer = void 0;
		}
		call.beginClosing();
		await call.audioRouting?.catch((error) => {
			params.logger.debug?.(`[facetime] audio routing cancellation for active call: ${formatErrorMessage(error)}`);
		});
		await call.talkStarting?.catch((error) => {
			params.logger.debug?.(`[facetime] talk startup cancellation for active call: ${formatErrorMessage(error)}`);
		});
		await call.talk?.close(reason).catch((error) => {
			params.logger.debug?.(`[facetime] talk close ignored for active call: ${formatErrorMessage(error)}`);
		});
		await call.talkActivation?.catch((error) => {
			params.logger.debug?.(`[facetime] talk activation cancellation for active call: ${formatErrorMessage(error)}`);
		});
		call.audioReady = false;
		call.audioTransport = void 0;
		params.calls.close(call);
		params.logger.info(`[facetime] call closed (${reason})`);
	};
	const attemptCarrierHangup = async (call, reason, options = {}) => {
		const closeLocal = options.closeLocal !== false;
		const scheduleRetry = options.scheduleRetry !== false;
		if (params.calls.active !== call) return true;
		if (call.carrierMode === "closed") {
			if (closeLocal) await closeCall(call, reason);
			return true;
		}
		const generation = call.beginClosing();
		call.carrierHangupPending = true;
		call.talk?.suspendMedia(reason).catch((error) => {
			params.logger.warn(`[facetime] local media suspension failed: ${formatErrorMessage(error)}`);
		});
		const attempt = call.carrierHangupAttempt ?? (async () => {
			const topologyVersion = params.getHelperTopologyVersion();
			const readCompleteAbsenceGeneration = (error) => {
				if (!(error instanceof FaceTimeHelperAmbiguousError)) return;
				try {
					return projectCompleteFaceTimeAbsence(error.result).topologyGeneration;
				} catch {
					return;
				}
			};
			try {
				const muted = await runCarrierActionAcrossAliases({
					call,
					generation,
					action: "safe-mute",
					run: async (callUUID) => await params.helper.safetyMute(callUUID)
				});
				params.retainHelperResultPeers(call, muted);
			} catch (error) {
				if (readCompleteAbsenceGeneration(error) === void 0) params.logger.warn(`[facetime] failed to confirm carrier safety mute: ${formatErrorMessage(error)}`);
			}
			try {
				const leave = await runCarrierActionAcrossAliases({
					call,
					generation,
					action: "terminate",
					run: async (callUUID) => await params.helper.leaveCall(callUUID)
				});
				params.retainHelperResultPeers(call, leave);
			} catch (error) {
				if (readCompleteAbsenceGeneration(error) === void 0) params.logger.warn(`[facetime] carrier termination request failed: ${formatErrorMessage(error)}`);
			}
			try {
				const inspect = async () => await call.runCarrierCommand({
					generation,
					allowClosing: true,
					action: async () => await params.helper.inspectCall([...call.carrierCallUUIDs], [...call.carrierPeers.keys()])
				});
				const first = projectCompleteFaceTimeAbsence(await inspect());
				await new Promise((resolve) => {
					setTimeout(resolve, 100).unref?.();
				});
				const second = projectCompleteFaceTimeAbsence(await inspect());
				return first.topologyGeneration === second.topologyGeneration && params.getHelperTopologyVersion() === topologyVersion;
			} catch {
				return false;
			}
		})();
		call.carrierHangupAttempt = attempt;
		let carrierClosed;
		try {
			carrierClosed = await attempt;
		} finally {
			if (call.carrierHangupAttempt === attempt) call.carrierHangupAttempt = void 0;
		}
		const currentCall = params.calls.active;
		if (currentCall !== call) return true;
		if (carrierClosed || currentCall.carrierMode === "closed") {
			call.markCarrierClosed();
			call.carrierHangupPending = false;
			if (closeLocal) await closeCall(call, reason);
			return true;
		}
		if (scheduleRetry && !call.carrierHangupRetryTimer) {
			call.carrierHangupRetryTimer = setTimeout(() => {
				call.carrierHangupRetryTimer = void 0;
				attemptCarrierHangup(call, reason);
			}, 1e3);
			call.carrierHangupRetryTimer.unref?.();
		}
		return false;
	};
	const waitForStartupCarrierHangup = async (call, reason) => {
		call.beginClosing();
		return await Promise.race([call.carrierClosure.then(() => true), (async () => {
			while (params.calls.active === call && call.phase === "closing" && call.carrierMode !== "closed") {
				if (await attemptCarrierHangup(call, reason, {
					closeLocal: false,
					scheduleRetry: false
				})) return true;
				await new Promise((resolve) => {
					setTimeout(resolve, 1e3).unref?.();
				});
			}
			return true;
		})()]);
	};
	const terminateCarrierProcesses = async (call) => {
		const generation = call.captureGeneration();
		await terminateExactCarrierProcesses({
			runtime: params.runtime,
			peers: call.carrierPeers,
			assertCurrent: () => call.assertCurrent(generation, true)
		});
		call.markCarrierClosed();
	};
	const stopCall = async (call) => {
		if (await attemptCarrierHangup(call, "runtime-stop", { scheduleRetry: false })) return;
		try {
			await terminateCarrierProcesses(call);
			await closeCall(call, "runtime-stop-carrier-terminated");
		} catch (error) {
			await call.talk?.suspendMedia("runtime-stop-carrier-unconfirmed");
			throw new Error(`FaceTime fail-closed carrier termination failed: ${formatErrorMessage(error)}; carrier closure remains unconfirmed`, { cause: error });
		}
	};
	const startCallTalk = async (call) => {
		if (call.talk) return;
		if (!call.talkStarting) {
			const callUUID = call.callUUID;
			call.talkStarting = (async () => {
				await routeCallAudio(call);
				const talk = await startFaceTimeTalkDriver({
					config: params.config,
					fullConfig: params.fullConfig,
					runtime: params.runtime,
					logger: params.logger,
					callUUID,
					senderId: call.senderId,
					senderIsOwner: call.senderIsOwner,
					captureBinary: params.captureBinary,
					signal: call.lifecycleAbort.signal,
					async onHangupRequested() {
						if (!await attemptCarrierHangup(call, "caller-requested-hangup")) throw new Error(`carrier hangup pending for ${call.callUUID}; retry scheduled`);
					},
					async onFailure(error) {
						const failureReason = `talk-failed: ${formatErrorMessage(error)}`;
						if (!call.talk) {
							const carrierClosed = await waitForStartupCarrierHangup(call, failureReason);
							if (carrierClosed) queueMicrotask(() => {
								closeCall(call, failureReason);
							});
							return carrierClosed;
						}
						const carrierClosed = await attemptCarrierHangup(call, failureReason, { closeLocal: false });
						if (carrierClosed) queueMicrotask(() => {
							closeCall(call, failureReason);
						});
						return carrierClosed;
					}
				});
				if (params.isStopping() || params.calls.active !== call) {
					await talk.close("call-ended-during-start");
					return;
				}
				call.talk = talk;
				if (call.audioTransport) call.audioTransport.processOutputSuppressed = true;
				params.logger.info("[facetime] realtime talk suppression ready");
			})();
		}
		const starting = call.talkStarting;
		try {
			await starting;
		} finally {
			if (call.talkStarting === starting) call.talkStarting = void 0;
		}
	};
	const activateCallTalk = async (call, options) => {
		const generation = call.captureGeneration();
		if (!call.talkActivation) call.talkActivation = (async () => {
			await call.talk?.readyForAudio();
			call.assertCurrent(generation);
			call.markModelReady(generation);
			if (options.unmute) await enableCallAudio(call);
			call.assertCurrent(generation);
			call.markModelActive(generation);
			call.talk?.activate();
		})();
		const activation = call.talkActivation;
		try {
			await activation;
			call.assertCurrent(generation);
			if (options.unmute && call.carrierMode !== "active") await enableCallAudio(call);
		} finally {
			if (call.talkActivation === activation) call.talkActivation = void 0;
		}
	};
	return {
		activateCallTalk,
		attemptCarrierHangup,
		closeCall,
		startCallTalk,
		stopCall
	};
}
//#endregion
//#region extensions/facetime/src/runtime-helper-results.ts
const OUTBOUND_DIAL_HELPER_BUNDLES = /* @__PURE__ */ new Set(["com.apple.FaceTime", "com.apple.FaceTime.FTConversationService"]);
function readHelperPeers(result) {
	const peers = [];
	for (const entry of readHelperResults(result)) {
		const peer = entry.helperPeer;
		if (peer && typeof peer === "object" && "processId" in peer && "bundleIdentifier" in peer && "connectionGeneration" in peer && "processStartedAtMs" in peer && typeof peer.processId === "number" && typeof peer.bundleIdentifier === "string" && typeof peer.connectionGeneration === "number" && typeof peer.processStartedAtMs === "number") peers.push({
			bundleIdentifier: peer.bundleIdentifier,
			processId: peer.processId,
			processStartedAtMs: peer.processStartedAtMs,
			connectionGeneration: peer.connectionGeneration
		});
	}
	return peers;
}
function retainHelperResultPeers(call, result) {
	for (const peer of readHelperPeers(result)) call.carrierPeers.set(peer.processId, peer);
}
function retainOutboundDialHelperPeers(peers, result) {
	for (const entry of readHelperResults(result)) {
		if (entry.found === false && entry.retained_outbound_dial !== true && entry.cancelled !== true) continue;
		for (const peer of readHelperPeers(entry)) if (OUTBOUND_DIAL_HELPER_BUNDLES.has(peer.bundleIdentifier)) peers.set(peer.processId, peer);
	}
}
function readOutboundCallUUID(result) {
	return readHelperResults(result).map((entry) => typeof entry.call_uuid === "string" && entry.call_uuid.trim() ? entry.call_uuid.trim() : void 0).find((value) => Boolean(value));
}
function readOutboundProxyIdentifier(result) {
	return readHelperResults(result).map((entry) => typeof entry.proxy_identifier === "string" && entry.proxy_identifier.trim() ? entry.proxy_identifier.trim() : void 0).find((value) => Boolean(value));
}
function hasDialHelperConfirmation(results) {
	return results.some((entry) => typeof entry.helperBundleIdentifier === "string" && OUTBOUND_DIAL_HELPER_BUNDLES.has(entry.helperBundleIdentifier));
}
function hasDefinitiveDialHelperAbsence(result, requiredPeerProcessIds) {
	const results = readHelperResults(result);
	const observedProcessIds = new Set(readHelperPeers(result).map((peer) => peer.processId));
	return result.topologyComplete === true && results.length === result.helpersContacted && hasDialHelperConfirmation(results) && results.every((entry) => entry.found === false && entry.retained_outbound_dial !== true) && [...requiredPeerProcessIds].every((processId) => observedProcessIds.has(processId));
}
async function reconcilePendingFaceTimeCarrier(params) {
	const { pending } = params;
	let previousAbsentTopology;
	let previousAbsenceCurrent;
	for (let attempt = 0; attempt < 12; attempt += 1) {
		if (!params.isCurrent()) return;
		const { ownerEpoch, delivery, callUUID, proxyIdentifier } = pending;
		const aliases = new Set(pending.callUUIDAliases);
		const isSnapshotCurrent = () => params.isCurrent() && pending.ownerEpoch === ownerEpoch && pending.delivery === delivery && pending.callUUID === callUUID && pending.proxyIdentifier === proxyIdentifier && (pending.callUUIDAliases?.size ?? 0) === aliases.size && [...aliases].every((alias) => pending.callUUIDAliases?.has(alias) === true);
		const result = await params.helper.findOutgoingCall(pending.handle, callUUID, pending.dialID, proxyIdentifier, pending.requestedAt, pending.mode);
		if (!params.isCurrent()) return;
		if (!isSnapshotCurrent()) {
			previousAbsentTopology = void 0;
			previousAbsenceCurrent = void 0;
			continue;
		}
		retainOutboundDialHelperPeers(params.peers, result);
		const reconciledCallUUID = readOutboundCallUUID(result);
		const reconciledProxyIdentifier = readOutboundProxyIdentifier(result);
		if (reconciledCallUUID || reconciledProxyIdentifier) {
			retainFaceTimeDialCallUUID(pending, reconciledCallUUID);
			if (reconciledProxyIdentifier) pending.proxyIdentifier = reconciledProxyIdentifier;
			await params.persist();
		}
		if (reconciledCallUUID || reconciledProxyIdentifier || readHelperResults(result).some((entry) => entry.found === true)) return;
		const topologyGeneration = typeof result.topologyGeneration === "number" ? result.topologyGeneration : void 0;
		const completeAbsence = hasDefinitiveDialHelperAbsence(result, params.peers.keys());
		if (completeAbsence && topologyGeneration !== void 0 && topologyGeneration === previousAbsentTopology && previousAbsenceCurrent?.()) {
			await params.clear();
			return;
		}
		previousAbsentTopology = completeAbsence ? topologyGeneration : void 0;
		previousAbsenceCurrent = completeAbsence ? isSnapshotCurrent : void 0;
		if (attempt + 1 < 12) await new Promise((resolve) => {
			setTimeout(resolve, 250);
		});
	}
}
//#endregion
//#region extensions/facetime/src/runtime-state.ts
var ActiveFaceTimeCall = class extends FaceTimeCallInstance {
	constructor(params) {
		super(params.callUUID, params.phase);
		this.retiredCarrierCallUUIDs = /* @__PURE__ */ new Set();
		this.carrierPeers = /* @__PURE__ */ new Map();
		this.senderIsOwner = true;
		this.audioReady = false;
		this.callUUID = params.callUUID;
		this.carrierCallUUID = params.callUUID;
		this.carrierCallUUIDs = /* @__PURE__ */ new Set([params.callUUID]);
		this.senderId = params.owner.senderId;
		this.handle = params.handle;
		if (params.peer) this.carrierPeers.set(params.peer.processId, params.peer);
	}
	promoteCarrierCallUUID(callUUID) {
		if (callUUID !== this.carrierCallUUID) {
			this.retiredCarrierCallUUIDs.add(this.carrierCallUUID);
			this.retiredCarrierCallUUIDs.delete(callUUID);
		}
		this.carrierCallUUIDs.add(callUUID);
		this.carrierCallUUID = callUUID;
	}
};
function readCallUUID(event) {
	return String(event.data.call_uuid);
}
function updateCallStatus(call, event) {
	call.callStatus = typeof event.data.call_status === "number" ? event.data.call_status : call.callStatus;
	call.isSendingAudio = typeof event.data.is_sending_audio === "boolean" ? event.data.is_sending_audio : call.isSendingAudio;
	call.isSendingTransmission = typeof event.data.is_sending_transmission === "boolean" ? event.data.is_sending_transmission : call.isSendingTransmission;
	call.isUplinkMuted = typeof event.data.is_uplink_muted === "boolean" ? event.data.is_uplink_muted : call.isUplinkMuted;
	call.isSendingVideo = typeof event.data.is_sending_video === "boolean" ? event.data.is_sending_video : call.isSendingVideo;
	call.conversationUUID = typeof event.data.conversation_uuid === "string" ? event.data.conversation_uuid : call.conversationUUID;
	call.conversationGroupUUID = typeof event.data.conversation_group_uuid === "string" ? event.data.conversation_group_uuid : call.conversationGroupUUID;
	call.conversationAudioEnabled = typeof event.data.conversation_audio_enabled === "boolean" ? event.data.conversation_audio_enabled : call.conversationAudioEnabled;
	call.conversationVideoEnabled = typeof event.data.conversation_video_enabled === "boolean" ? event.data.conversation_video_enabled : call.conversationVideoEnabled;
	call.conversationAVMode = typeof event.data.conversation_av_mode === "number" ? event.data.conversation_av_mode : call.conversationAVMode;
	call.conversationResolvedAudioVideoMode = typeof event.data.conversation_resolved_audio_video_mode === "number" ? event.data.conversation_resolved_audio_video_mode : call.conversationResolvedAudioVideoMode;
	call.localMeterLevel = typeof event.data.local_meter_level === "number" ? event.data.local_meter_level : call.localMeterLevel;
	call.remoteMeterLevel = typeof event.data.remote_meter_level === "number" ? event.data.remote_meter_level : call.remoteMeterLevel;
	if (typeof event.data.local_meter_level === "number") call.maxLocalMeterLevel = Math.max(call.maxLocalMeterLevel ?? 0, event.data.local_meter_level);
	if (typeof event.data.remote_meter_level === "number") call.maxRemoteMeterLevel = Math.max(call.maxRemoteMeterLevel ?? 0, event.data.remote_meter_level);
}
function createManagedCall(params) {
	return new ActiveFaceTimeCall(params);
}
//#endregion
//#region extensions/facetime/src/runtime-call-events.ts
function createFaceTimeCallEventHandler(params) {
	const eventIdentities = (event) => [
		event.data.call_uuid,
		event.data.dial_id,
		event.data.proxy_identifier,
		event.data.conversation_uuid
	].filter((identity) => typeof identity === "string" && identity.trim() !== "");
	const resolveEventCall = (event) => {
		for (const identity of eventIdentities(event)) {
			const call = params.calls.get(identity);
			if (call) return call;
		}
	};
	const canPromotePendingDial = (pending) => !params.isStopping() && params.getPendingDial() === pending && pending.delivery !== "cancelling";
	const authorizePendingDial = async (event, pending) => {
		retainFaceTimeDialCallUUID(pending, readCallUUID(event));
		await params.persistPendingDial();
		if (params.isStopping() || params.getPendingDial() !== pending) return;
		const owner = pending.delivery === "cancelling" ? void 0 : resolveAuthorizedFaceTimeOwner({
			event,
			ownerHandles: params.config.ownerHandles
		});
		if (owner) return owner;
		if (pending.delivery !== "cancelling") params.logger.warn("[facetime] cancelling correlated outbound call because its handle is no longer authorized; add it to ownerHandles before dialing again");
		try {
			await params.cancelPendingDial(pending);
		} catch (error) {
			params.logger.warn(`[facetime] outbound authorization cancellation remains pending: ${formatErrorMessage(error)}`);
		}
	};
	const retainAliases = (call, event) => {
		for (const alias of [
			event.data.call_uuid,
			event.data.dial_id,
			event.data.proxy_identifier,
			event.data.conversation_uuid,
			event.data.conversation_group_uuid
		]) if (typeof alias === "string" && alias.trim()) params.calls.retainAlias(call, alias);
		call.carrierCallUUIDs.add(String(event.data.call_uuid));
	};
	const retainPendingDial = (call, pending) => {
		params.calls.retainAlias(call, pending.dialID);
		if (pending.proxyIdentifier) params.calls.retainAlias(call, pending.proxyIdentifier);
		for (const alias of pending.callUUIDAliases ?? []) {
			params.calls.retainAlias(call, alias);
			call.carrierCallUUIDs.add(alias);
		}
		for (const carrierPeer of params.outboundCarrierPeers.values()) call.carrierPeers.set(carrierPeer.processId, carrierPeer);
	};
	const answerIncoming = async (event, owner, peer) => {
		const callUUID = readCallUUID(event);
		if (params.isDriverInstallPending()) {
			params.logger.warn("[facetime] ignored incoming call; audio driver installation is pending");
			return;
		}
		if (resolveEventCall(event)) return;
		if (params.calls.size > 0) {
			params.logger.warn("[facetime] ignored incoming call; another FaceTime bridge is active");
			return;
		}
		const call = createManagedCall({
			callUUID,
			phase: "ringing",
			owner,
			handle: normalizeFaceTimeHandle(event.data.handle),
			peer
		});
		updateCallStatus(call, event);
		params.calls.create(call);
		retainAliases(call, event);
		let answerAttempted = false;
		try {
			await params.callControl.startCallTalk(call);
			if (call.lifecycleAbort.signal.aborted || params.calls.active !== call || call.carrierHangupPending) throw new Error("FaceTime call closed before answer");
			const generation = call.beginAnswering();
			answerAttempted = true;
			const answerResult = await call.runCarrierCommand({
				generation,
				action: async () => await params.helper.answerCall(callUUID)
			});
			projectFaceTimeNativeAction("answer", answerResult);
			retainHelperResultPeers(call, answerResult);
			await params.callControl.activateCallTalk(call, { unmute: true });
			params.logger.info("[facetime] answered authorized FaceTime call");
		} catch (error) {
			params.logger.warn(`[facetime] failed to answer FaceTime call: ${formatErrorMessage(error)}`);
			if (answerAttempted) {
				await params.callControl.attemptCarrierHangup(call, "answer-failed");
				return;
			}
			await params.callControl.closeCall(call, "answer-failed").catch((closeError) => {
				params.logger.warn(`[facetime] answer failure cleanup failed: ${formatErrorMessage(closeError)}`);
			});
		}
	};
	const activate = async (event, owner, peer, pending) => {
		const callUUID = readCallUUID(event);
		if (params.isDriverInstallPending()) {
			params.logger.warn("[facetime] ignored active call; audio driver installation is pending");
			return;
		}
		let call = resolveEventCall(event);
		if (!call) {
			if (!owner) {
				params.logger.warn("[facetime] refused active call without authenticated owner");
				return;
			}
			if (params.calls.size > 0) {
				params.logger.warn("[facetime] ignored active call; another FaceTime bridge is active");
				return;
			}
			call = createManagedCall({
				callUUID,
				phase: "active",
				owner,
				handle: normalizeFaceTimeHandle(event.data.handle),
				peer
			});
			params.calls.create(call);
			retainAliases(call, event);
		}
		if (pending) retainPendingDial(call, pending);
		if (peer) call.carrierPeers.set(peer.processId, peer);
		call.promoteCarrierCallUUID(callUUID);
		updateCallStatus(call, event);
		try {
			await params.callControl.startCallTalk(call);
			await params.callControl.activateCallTalk(call, { unmute: true });
			params.logger.info("[facetime] realtime talk session active");
		} catch (error) {
			if (call.lifecycleAbort.signal.aborted || params.calls.active !== call) return;
			params.logger.warn(`[facetime] failed to start realtime talk: ${formatErrorMessage(error)}`);
			await params.callControl.attemptCarrierHangup(call, "talk-start-failed");
		}
	};
	const handleCallEvent = async (event, peer) => {
		if (params.isStopping()) return;
		const callUUID = readCallUUID(event);
		const existingCall = resolveEventCall(event);
		const pending = params.getPendingDial();
		if (existingCall) {
			if (peer) existingCall.carrierPeers.set(peer.processId, peer);
			updateCallStatus(existingCall, event);
			retainAliases(existingCall, event);
		}
		const verifiedTransport = isVerifiedFaceTimeTransport(event);
		if (existingCall && !verifiedTransport && !isEndedCall(event)) {
			params.logger.warn("[facetime] managed call transport lost FaceTime verification; closing fail-closed");
			await params.callControl.attemptCarrierHangup(existingCall, "transport-verification-lost");
			return;
		}
		if (pending && !existingCall && event.data.is_outgoing !== true && (isIncomingRingingCall(event) || isActiveCall(event))) {
			params.logger.info("[facetime] ignored incoming call; an outbound FaceTime call is pending");
			return;
		}
		if (isIncomingRingingCall(event)) {
			const owner = resolveAuthorizedFaceTimeOwner({
				event,
				ownerHandles: params.config.ownerHandles
			});
			if (owner) await answerIncoming(event, owner, peer);
			else params.logger.info("[facetime] ignored unauthorized incoming FaceTime call");
			return;
		}
		if (isOutgoingRingingCall(event)) {
			if (verifiedTransport && pending && doesFaceTimeCallMatchPendingDial({
				event,
				pending
			})) {
				const owner = await authorizePendingDial(event, pending);
				if (!owner || !canPromotePendingDial(pending)) return;
				let ringingCall = resolveEventCall(event);
				if (!ringingCall && params.calls.size === 0) {
					ringingCall = createManagedCall({
						callUUID,
						phase: "ringing",
						owner,
						handle: normalizeFaceTimeHandle(event.data.handle),
						peer
					});
					updateCallStatus(ringingCall, event);
					params.calls.create(ringingCall);
					retainAliases(ringingCall, event);
					retainPendingDial(ringingCall, pending);
				}
				if (ringingCall) try {
					const generation = ringingCall.captureGeneration();
					const muteResult = await ringingCall.runCarrierCommand({
						generation,
						action: async () => await params.helper.safetyMute(ringingCall.carrierCallUUID)
					});
					ringingCall.lastHelperAction = muteResult;
					retainHelperResultPeers(ringingCall, muteResult);
					projectFaceTimeNativeAction("safe-mute", muteResult);
				} catch (error) {
					params.logger.warn(`[facetime] outbound ringing safety mute failed: ${formatErrorMessage(error)}`);
					await params.callControl.attemptCarrierHangup(ringingCall, "outbound-ringing-safety-mute-failed");
				}
			}
			return;
		}
		if (isActiveCall(event)) {
			const authorizedPending = event.data.is_outgoing === true && verifiedTransport && pending && doesFaceTimeCallMatchPendingDial({
				event,
				pending
			}) ? pending : void 0;
			const owner = authorizedPending ? await authorizePendingDial(event, authorizedPending) : event.data.is_outgoing === true ? void 0 : resolveAuthorizedFaceTimeOwner({
				event,
				ownerHandles: params.config.ownerHandles
			});
			if (authorizedPending && (!owner || !canPromotePendingDial(authorizedPending))) return;
			const pendingCall = authorizedPending && params.calls.get(authorizedPending.dialID);
			if (pendingCall) params.calls.retainAlias(pendingCall, callUUID);
			if (!resolveEventCall(event) && !owner) {
				params.logger.info("[facetime] ignored unauthorized active FaceTime call");
				return;
			}
			await activate(event, owner, peer, authorizedPending);
			if (authorizedPending && canPromotePendingDial(authorizedPending) && params.calls.has(callUUID)) await params.clearPendingDial();
			return;
		}
		if (isEndedCall(event)) {
			const clearing = event.data.is_outgoing === true && pending && doesFaceTimeCallMatchPendingDial({
				event,
				pending
			}) ? params.clearPendingDial() : void 0;
			const endedCall = resolveEventCall(event);
			if (endedCall) {
				if (endedCall.retiredCarrierCallUUIDs.has(callUUID)) {
					params.logger.debug?.("[facetime] ignored ended event for a stale carrier alias while another carrier is current");
					await clearing;
					return;
				}
				endedCall.markCarrierClosed();
				await Promise.all([clearing, params.callControl.closeCall(endedCall, "native-ended")]);
			} else await clearing;
			return;
		}
		if (isUnknownCallStatus(event)) {
			const unknownCall = params.calls.get(callUUID);
			if (unknownCall) {
				params.logger.warn("[facetime] unknown native call status; closing carrier fail-closed");
				await params.callControl.attemptCarrierHangup(unknownCall, "unknown-native-status");
			}
		}
	};
	return { handleCallEvent };
}
//#endregion
//#region extensions/facetime/src/talk-events-summary.ts
function optionalNumber(value) {
	return typeof value === "number" && Number.isFinite(value) ? value : void 0;
}
function summarizeRecentTalkEvents(events, limit = 12) {
	return events.slice(-limit).map((event) => {
		const record = asRecord(event);
		const payload = asRecord(record.payload);
		return {
			type: normalizeOptionalString(record.type) ?? "unknown",
			turnId: normalizeOptionalString(record.turnId),
			callId: normalizeOptionalString(record.callId),
			final: typeof record.final === "boolean" ? record.final : void 0,
			byteLength: optionalNumber(payload.byteLength),
			name: normalizeOptionalString(payload.name),
			text: normalizeOptionalString(payload.text),
			message: normalizeOptionalString(payload.message)
		};
	});
}
//#endregion
//#region extensions/facetime/src/runtime-status.ts
function buildFaceTimeRuntimeStatus(params) {
	const calls = [...params.calls.values()];
	return {
		enabled: true,
		helperConnected: params.helperConnected,
		helperProtocol: {
			version: 1,
			authentication: "mutual-hmac-sha256-v1",
			eventIntegrity: "epoch-sequence-hmac-v1",
			statusClassifier: "explicit-ended-tu-call-status-v1",
			transportClassifier: "tu-provider-v1"
		},
		helperTargets: params.helperTargets,
		driverInstallPending: params.driverInstall.phase === "installing",
		driverInstall: params.driverInstall,
		processOutputSuppressed: calls.some((call) => call.talk?.processOutputSuppressed() === true),
		outboundCallPending: params.pendingDial ? {
			dialID: params.pendingDial.dialID,
			delivery: params.pendingDial.delivery,
			handle: params.pendingDial.handle,
			mode: params.pendingDial.mode,
			requestedAt: params.pendingDial.requestedAt,
			proxyIdentifier: params.pendingDial.proxyIdentifier
		} : void 0,
		calls: calls.map((call) => ({
			callUUID: call.callUUID,
			generation: call.generation,
			phase: call.phase,
			carrierMode: call.carrierMode,
			modelMediaMode: call.modelMediaMode,
			handle: call.handle,
			callStatus: call.callStatus,
			isSendingAudio: call.isSendingAudio,
			isSendingTransmission: call.isSendingTransmission,
			isUplinkMuted: call.isUplinkMuted,
			isSendingVideo: call.isSendingVideo,
			conversationUUID: call.conversationUUID,
			conversationGroupUUID: call.conversationGroupUUID,
			conversationAudioEnabled: call.conversationAudioEnabled,
			conversationVideoEnabled: call.conversationVideoEnabled,
			conversationAVMode: call.conversationAVMode,
			conversationResolvedAudioVideoMode: call.conversationResolvedAudioVideoMode,
			localMeterLevel: call.localMeterLevel,
			remoteMeterLevel: call.remoteMeterLevel,
			maxLocalMeterLevel: call.maxLocalMeterLevel,
			maxRemoteMeterLevel: call.maxRemoteMeterLevel,
			realtimeActive: call.talk?.realtimeActive() === true,
			audioReady: call.audioReady,
			audioTransport: call.audioTransport ? {
				...call.audioTransport,
				processOutputSuppressed: call.talk?.processOutputSuppressed() === true
			} : void 0,
			lastHelperAction: call.lastHelperAction,
			lastRoutingError: call.lastRoutingError,
			carrierHangupPending: call.carrierHangupPending,
			recentTalkEvents: call.talk ? summarizeRecentTalkEvents(call.talk.recentTalkEvents) : void 0
		}))
	};
}
//#endregion
//#region extensions/facetime/src/runtime.ts
const OUTBOUND_RECONCILE_DELAY_MS = 1e3;
async function createFaceTimeRuntime(params) {
	const config = resolveFaceTimeConfig(params.config);
	if (!config.enabled) throw new Error("facetime disabled in plugin config");
	const validation = validateFaceTimeConfig(config);
	if (!validation.valid) throw new Error(`Invalid facetime config: ${validation.errors.join("; ")}`);
	const calls = new FaceTimeCallRegistry();
	const pendingDialStore = new PendingFaceTimeDialStore(params.runtime.state.openKeyedStore({
		namespace: "pending-dial",
		maxEntries: 1,
		overflowPolicy: "reject-new"
	}));
	let outboundDialInFlight;
	let outboundDialDispatchPending = false;
	let outboundCallPending = await pendingDialStore.load();
	const outboundCarrierPeers = /* @__PURE__ */ new Map();
	if (outboundCallPending) {
		outboundCallPending.ownerEpoch += 1;
		await pendingDialStore.save(outboundCallPending);
	}
	let outboundReconcileTimer;
	let outboundReconcileInFlight;
	let driverInstall = { phase: "idle" };
	let driverInstallAbortController;
	let driverInstallTask;
	const isDriverInstallPending = () => driverInstall.phase === "installing";
	const captureBinary = await ensureCaptureBinary();
	const { buildId: helperBuildId, ipcKey: helperIpcKey } = await ensureHelperArtifacts({
		pluginRoot: params.pluginRoot,
		runCommandWithTimeout: params.runtime.system.runCommandWithTimeout
	});
	let stopping = false;
	let helperStopped = false;
	const helperRef = {};
	const helperSupervisor = new FaceTimeHelperSupervisor({
		pluginRoot: params.pluginRoot,
		logger: params.logger,
		runCommandWithTimeout: params.runtime.system.runCommandWithTimeout,
		connectedBundles: () => helperRef.current?.connectedHelperBundles ?? []
	});
	const pendingOperations = /* @__PURE__ */ new Set();
	const observePendingOperation = (operation) => {
		pendingOperations.add(operation);
		operation.then(() => pendingOperations.delete(operation), (error) => {
			pendingOperations.delete(operation);
			params.logger.warn(`[facetime] pending dial operation failed: ${formatErrorMessage(error)}`);
		});
		return operation;
	};
	let pendingClearSettlement = Promise.resolve();
	const clearOutboundCallPending = (expectedDialID = outboundCallPending?.dialID) => {
		if (outboundReconcileTimer) {
			clearTimeout(outboundReconcileTimer);
			outboundReconcileTimer = void 0;
		}
		const pending = outboundCallPending;
		const clearing = (async () => {
			if (expectedDialID) await pendingDialStore.clear(expectedDialID);
			if (outboundCallPending === pending) {
				outboundCallPending = void 0;
				outboundCarrierPeers.clear();
			}
		})();
		pendingClearSettlement = clearing.catch(() => void 0);
		return clearing;
	};
	const persistOutboundCallPending = () => outboundCallPending ? pendingDialStore.save(outboundCallPending) : Promise.resolve();
	const reconcilePendingOutboundCall = async () => {
		if (outboundDialDispatchPending) return;
		if (outboundReconcileInFlight) return await outboundReconcileInFlight;
		const pending = outboundCallPending;
		if (!pending) return;
		const reconciliation = (async () => {
			try {
				await reconcilePendingFaceTimeCarrier({
					helper,
					pending,
					isCurrent: () => outboundCallPending === pending && !pendingDialStore.isClearing(pending.dialID),
					peers: outboundCarrierPeers,
					persist: persistOutboundCallPending,
					clear: () => clearOutboundCallPending(pending.dialID)
				});
				if (outboundCallPending === pending && pending.delivery === "cancelling") await cancelPendingOutboundCall();
			} catch (error) {
				params.logger.debug?.(`[facetime] outbound dial reconciliation deferred: ${formatErrorMessage(error)}`);
			}
		})();
		outboundReconcileInFlight = reconciliation;
		try {
			await reconciliation;
		} finally {
			if (outboundReconcileInFlight === reconciliation) outboundReconcileInFlight = void 0;
		}
	};
	const scheduleOutboundReconciliation = () => {
		if (stopping || outboundReconcileTimer || !outboundCallPending || helper.connectedSockets === 0) return;
		const pending = outboundCallPending;
		outboundReconcileTimer = setTimeout(() => {
			outboundReconcileTimer = void 0;
			observePendingOperation(reconcilePendingOutboundCall().finally(() => {
				if (outboundCallPending === pending) scheduleOutboundReconciliation();
			}));
		}, OUTBOUND_RECONCILE_DELAY_MS);
		outboundReconcileTimer.unref?.();
	};
	const cancelPendingOutboundCall = async () => {
		const pending = outboundCallPending;
		if (!pending) return;
		const { handle, dialID } = pending;
		let { callUUID } = pending;
		pending.delivery = "cancelling";
		await persistOutboundCallPending();
		if (outboundCallPending !== pending || pendingDialStore.isClearing(pending.dialID)) return;
		const result = await helper.cancelOutgoingCall({
			dialID,
			handle,
			callUUID,
			proxyIdentifier: pending.proxyIdentifier,
			requestedAt: pending.requestedAt,
			mode: pending.mode
		}).finally(scheduleOutboundReconciliation);
		const helperResults = readHelperResults(result);
		const cancelled = helperResults.some((entry) => entry.cancelled === true);
		const helpersContacted = typeof result.helpersContacted === "number" ? result.helpersContacted : helperResults.length;
		const definitivelyAbsent = helperResults.length === helpersContacted && hasDialHelperConfirmation(helperResults) && helperResults.every((entry) => entry.found === false && entry.cancelled === false);
		if (!cancelled && !definitivelyAbsent) throw new Error("FaceTime helper could not confirm outbound call cancellation");
		const replyCallUUID = helperResults.map(readOutboundCallUUID).find((value) => Boolean(value));
		callUUID = replyCallUUID ?? callUUID;
		if (outboundCallPending === pending) {
			retainOutboundDialHelperPeers(outboundCarrierPeers, result);
			retainFaceTimeDialCallUUID(pending, replyCallUUID);
			await persistOutboundCallPending();
		}
		return {
			...callUUID ? { callUUID } : {},
			dialID,
			handle
		};
	};
	let helperTopologyVersion = 0;
	const helperEndpoint = resolveFaceTimeHelperEndpoint();
	const callEventRef = {};
	const helper = new FaceTimeHelperSocketServer({
		...helperEndpoint,
		logger: params.logger,
		ipcKey: helperIpcKey,
		buildId: helperBuildId,
		onMessage(message, peer) {
			if (helperStopped) return;
			const outboundIdentity = normalizeFaceTimeOutboundIdentityEvent(message);
			if (outboundIdentity && outboundCallPending?.dialID === outboundIdentity.data.dial_id) {
				if (OUTBOUND_DIAL_HELPER_BUNDLES.has(peer.bundleIdentifier)) outboundCarrierPeers.set(peer.processId, peer);
				retainFaceTimeDialCallUUID(outboundCallPending, outboundIdentity.data.call_uuid);
				if (outboundIdentity.data.proxy_identifier) outboundCallPending.proxyIdentifier = outboundIdentity.data.proxy_identifier;
				return observePendingOperation(persistOutboundCallPending());
			}
			const event = normalizeFaceTimeCallEvent(message);
			if (event) {
				const operation = callEventRef.current?.handleCallEvent(event, peer);
				if (operation) return observePendingOperation(operation);
			}
		},
		onConnect(bundleIdentifier) {
			helperTopologyVersion += 1;
			helperSupervisor?.connected(bundleIdentifier);
			for (const call of calls.values()) if (call.carrierHangupPending) attemptCarrierHangup(call, "helper-reconnected");
			if (!stopping) observePendingOperation(reconcilePendingOutboundCall().finally(scheduleOutboundReconciliation));
		},
		onDisconnect(bundleIdentifier) {
			helperTopologyVersion += 1;
			helperSupervisor?.disconnected(bundleIdentifier);
			if (stopping || calls.size === 0) return;
			params.logger.warn("[facetime] carrier helper disconnected during a call; retaining audio safety bridge");
			for (const call of calls.values()) attemptCarrierHangup(call, "helper-disconnected");
		},
		onStale(bundleIdentifier, processId) {
			helperSupervisor?.stale(bundleIdentifier, processId);
		}
	});
	helperRef.current = helper;
	const callControl = createFaceTimeCallControl({
		calls,
		helper,
		config,
		fullConfig: params.fullConfig,
		runtime: params.runtime,
		logger: params.logger,
		captureBinary,
		isStopping: () => stopping,
		getHelperTopologyVersion: () => helperTopologyVersion,
		retainHelperResultPeers
	});
	const { attemptCarrierHangup, stopCall } = callControl;
	callEventRef.current = createFaceTimeCallEventHandler({
		calls,
		helper,
		config,
		logger: params.logger,
		callControl,
		isStopping: () => stopping,
		isDriverInstallPending,
		getPendingDial: () => pendingDialStore.isClearing(outboundCallPending?.dialID) ? void 0 : outboundCallPending,
		clearPendingDial: () => clearOutboundCallPending(),
		persistPendingDial: persistOutboundCallPending,
		outboundCarrierPeers,
		cancelPendingDial: async (pending) => {
			if (outboundCallPending === pending) await cancelPendingOutboundCall();
		}
	});
	await helper.start();
	helperSupervisor.start();
	params.logger.info(`[facetime] listening for FaceTime helper events on ${helperEndpoint.host}:${helperEndpoint.port}`);
	const readStatus = async () => buildFaceTimeRuntimeStatus({
		calls,
		helperConnected: helper.connectedSockets > 0,
		helperTargets: helperSupervisor.status(),
		driverInstall,
		pendingDial: outboundCallPending
	});
	const runPreflight = async () => await runFaceTimePreflight({
		config,
		fullConfig: params.fullConfig,
		runtime: params.runtime,
		logger: params.logger,
		helperConnected: helper.connectedSockets > 0,
		captureBinary
	});
	return {
		config,
		async status() {
			return await readStatus();
		},
		async dial(dialParams) {
			if (stopping) throw new Error("cannot start an outbound FaceTime call while the plugin is stopping");
			if (isDriverInstallPending()) throw new Error("cannot start an outbound FaceTime call while audio driver installation is pending");
			if (calls.size > 0) throw new Error("cannot start an outbound FaceTime call while another call is active");
			if (outboundCallPending) throw new Error(`outbound FaceTime ${outboundCallPending.mode} call is already pending for ${outboundCallPending.handle}`);
			if (outboundDialInFlight) throw new Error("cannot start an outbound FaceTime call while another dial is in flight");
			const request = resolveFaceTimeDialRequest({
				handle: dialParams.handle,
				mode: dialParams.mode,
				ownerHandles: config.ownerHandles
			});
			const dialID = randomUUID();
			const requestedAt = (/* @__PURE__ */ new Date()).toISOString();
			const pending = {
				...request,
				version: 1,
				ownerEpoch: 1,
				dialID,
				delivery: "in-flight",
				requestedAt
			};
			outboundCallPending = pending;
			outboundDialDispatchPending = true;
			let helperStarted = false;
			const canDispatch = () => !stopping && outboundCallPending === pending && pending.delivery !== "cancelling" && !pendingDialStore.isClearing(pending.dialID);
			const dialPromise = (async () => {
				await persistOutboundCallPending();
				if (!canDispatch()) throw new Error("outbound FaceTime dial was cancelled before helper dispatch");
				outboundDialDispatchPending = false;
				helperStarted = true;
				const helperResult = await helper.startCall(request, dialID, requestedAt);
				retainOutboundDialHelperPeers(outboundCarrierPeers, helperResult);
				const result = resolveFaceTimeDialResult({
					dialID,
					request,
					helper: helperResult
				});
				const callUUID = result.callUUID;
				if (outboundCallPending === pending) {
					if (pending.delivery !== "cancelling") pending.delivery = "accepted";
					if (callUUID) retainFaceTimeDialCallUUID(outboundCallPending, callUUID);
					if (result.proxyIdentifier) outboundCallPending.proxyIdentifier = result.proxyIdentifier;
					await persistOutboundCallPending();
					scheduleOutboundReconciliation();
				}
				if (pending.delivery === "cancelling") throw new Error("outbound FaceTime dial was cancelled before helper acknowledgement");
				return result;
			})();
			outboundDialInFlight = dialPromise;
			try {
				return await dialPromise;
			} catch (error) {
				if (!helperStarted) throw error;
				if (error instanceof FaceTimeHelperUnavailableError) {
					if (outboundCallPending === pending && pending.delivery !== "cancelling") await clearOutboundCallPending();
				} else {
					if (outboundCallPending === pending) {
						if (pending.delivery !== "cancelling") pending.delivery = "ambiguous";
						if (error instanceof FaceTimeHelperAmbiguousError) {
							const callUUID = readOutboundCallUUID(error.result);
							const proxyIdentifier = readOutboundProxyIdentifier(error.result);
							if (callUUID) retainFaceTimeDialCallUUID(outboundCallPending, callUUID);
							if (proxyIdentifier) outboundCallPending.proxyIdentifier = proxyIdentifier;
						}
						await persistOutboundCallPending();
					}
					if (outboundDialInFlight === dialPromise) outboundDialInFlight = void 0;
					await reconcilePendingOutboundCall();
					scheduleOutboundReconciliation();
				}
				throw error;
			} finally {
				if (outboundDialInFlight === dialPromise) {
					outboundDialDispatchPending = false;
					outboundDialInFlight = void 0;
				}
			}
		},
		async hangup(hangupParams) {
			const requestedCallUUID = typeof hangupParams?.callUUID === "string" && hangupParams.callUUID.trim() ? hangupParams.callUUID.trim() : void 0;
			const findCall = () => requestedCallUUID ? calls.get(requestedCallUUID) : [...calls.values()].find((candidate) => candidate.talk) ?? [...calls.values()][0];
			let call = findCall();
			if (!call) {
				if (!requestedCallUUID || outboundCallPending && doesPendingFaceTimeDialHaveCallUUID(outboundCallPending, requestedCallUUID)) {
					const canceled = await cancelPendingOutboundCall();
					if (canceled) return {
						...canceled.callUUID ? { callUUID: canceled.callUUID } : {},
						dialID: canceled.dialID
					};
				}
				for (let attempt = 0; attempt < 12 && !call; attempt += 1) {
					call = findCall();
					if (!call && attempt + 1 < 12) await new Promise((resolve) => {
						setTimeout(resolve, 250);
					});
				}
			}
			if (!call) throw new Error("no active FaceTime call to hang up");
			if (outboundCallPending && calls.get(outboundCallPending.dialID) === call) {
				call.beginClosing();
				outboundCallPending.delivery = "cancelling";
				await persistOutboundCallPending();
				scheduleOutboundReconciliation();
			}
			if (!await attemptCarrierHangup(call, "operator-hangup")) throw new Error(`carrier hangup pending for ${call.callUUID}; retry scheduled`);
			return { callUUID: call.callUUID };
		},
		async setup() {
			const preflight = runPreflight();
			preflight.catch(() => void 0);
			const runtimeStatus = preflight.then(() => readStatus(), () => readStatus());
			return await runFaceTimeSetup({
				config,
				nativePackageReady: true,
				pluginRoot: params.pluginRoot,
				runCommandWithTimeout: params.runtime.system.runCommandWithTimeout,
				runtimeStatus,
				preflight
			});
		},
		async preflight() {
			return await runPreflight();
		},
		async installDriver() {
			if (stopping) throw new Error("cannot install the FaceTime audio driver while the plugin is stopping");
			if (isDriverInstallPending()) throw new Error("FaceTime audio driver installation is already pending");
			if (calls.size > 0 || outboundCallPending || outboundDialInFlight) throw new Error("Cannot install the FaceTime audio driver during an active or pending call");
			driverInstall = {
				phase: "installing",
				startedAt: (/* @__PURE__ */ new Date()).toISOString()
			};
			const installAbortController = new AbortController();
			driverInstallAbortController = installAbortController;
			driverInstallTask = installFaceTimeDriver({
				pluginRoot: params.pluginRoot,
				runCommandWithTimeout: params.runtime.system.runCommandWithTimeout,
				callActive: false,
				signal: installAbortController.signal
			}).then((result) => {
				driverInstall = {
					phase: "succeeded",
					startedAt: driverInstall.startedAt,
					finishedAt: (/* @__PURE__ */ new Date()).toISOString(),
					changed: result.changed
				};
				params.logger.info(`[facetime] audio driver installation ${result.changed ? "completed" : "already current"}`);
			}).catch((error) => {
				const message = formatErrorMessage(error);
				driverInstall = {
					phase: "failed",
					startedAt: driverInstall.startedAt,
					finishedAt: (/* @__PURE__ */ new Date()).toISOString(),
					error: message
				};
				params.logger.warn(`[facetime] audio driver installation failed: ${message}`);
			}).finally(() => {
				if (driverInstallAbortController === installAbortController) {
					driverInstallAbortController = void 0;
					driverInstallTask = void 0;
				}
			});
			return { started: true };
		},
		async stop() {
			stopping = true;
			if (outboundReconcileTimer) {
				clearTimeout(outboundReconcileTimer);
				outboundReconcileTimer = void 0;
			}
			driverInstallAbortController?.abort();
			await driverInstallTask;
			await pendingDialStore.settle();
			await pendingClearSettlement;
			let cleanupError;
			let pendingCleanupError;
			const shutdownPending = outboundCallPending;
			if (outboundCallPending || outboundDialInFlight) {
				try {
					await cancelPendingOutboundCall();
				} catch (error) {
					pendingCleanupError = /* @__PURE__ */ new Error(`outbound FaceTime dial cleanup failed: ${formatErrorMessage(error)}`);
				}
				await outboundDialInFlight?.catch(() => void 0);
				await reconcilePendingOutboundCall();
				if (!outboundCallPending) pendingCleanupError = void 0;
				if (outboundCallPending === shutdownPending && calls.size === 0 && shutdownPending) {
					const pendingEpoch = shutdownPending.ownerEpoch;
					try {
						await terminateExactCarrierProcesses({
							runtime: params.runtime,
							peers: outboundCarrierPeers,
							assertCurrent: () => {
								if (outboundCallPending !== shutdownPending || shutdownPending.ownerEpoch !== pendingEpoch) throw new Error("pending FaceTime dial changed during fail-closed shutdown");
							}
						});
						await clearOutboundCallPending(shutdownPending.dialID);
						pendingCleanupError = void 0;
					} catch (error) {
						pendingCleanupError ??= /* @__PURE__ */ new Error(`pending FaceTime carrier termination failed: ${formatErrorMessage(error)}`);
					}
				}
				cleanupError ??= pendingCleanupError;
			}
			for (const call of calls.values()) try {
				await stopCall(call);
			} catch (error) {
				cleanupError ??= error instanceof Error ? error : new Error(formatErrorMessage(error));
			}
			await helperSupervisor.stop();
			await helper.stop();
			helperStopped = true;
			if (!cleanupError) while (pendingOperations.size > 0) await Promise.allSettled(pendingOperations);
			await pendingDialStore.settle();
			if (cleanupError) throw cleanupError;
		}
	};
}
//#endregion
export { createFaceTimeRuntime };
