import { n as requireSupportedTwilioApiHostname, r as resolveTwilioApiBaseUrl } from "./twilio-region-wBOx-8sz.mjs";
import { a as normalizeProviderStatus, g as generateDtmfRedirectTwiml, i as mapProviderStatusToEndReason, r as isProviderStatusTerminal, s as getHeader } from "./runtime-entry-CbSKxSKk.mjs";
import { n as mapVoiceToPolly, t as escapeXml } from "./voice-mapping-B_iAUkER.mjs";
import { n as readProviderCallStatus, o as verifyTwilioWebhook, t as guardedJsonApiRequest } from "./guarded-json-api-x55yqHvW.mjs";
import { asNullableObjectRecord, normalizeOptionalString } from "openclaw/plugin-sdk/string-coerce-runtime";
import { sleepWithAbort } from "openclaw/plugin-sdk/runtime-env";
import crypto from "node:crypto";
import { safeParseJson } from "openclaw/plugin-sdk/text-utility-runtime";
import { safeEqualSecret } from "openclaw/plugin-sdk/security-runtime";
import { retryAsync } from "openclaw/plugin-sdk/retry-runtime";
//#region extensions/voice-call/src/providers/twilio/api.ts
var TwilioApiError = class extends Error {
	constructor(httpStatus, responseText) {
		const parsed = asNullableObjectRecord(safeParseJson(responseText));
		const detail = typeof parsed?.message === "string" ? parsed.message : responseText;
		super(`Twilio API error: ${httpStatus} ${detail}`);
		this.name = "TwilioApiError";
		this.httpStatus = httpStatus;
		this.responseText = responseText;
		this.twilioCode = typeof parsed?.code === "number" ? parsed.code : void 0;
	}
};
/** POST a form-encoded Twilio REST API request through the SSRF guard. */
async function twilioApiRequest(params) {
	const bodyParams = params.body instanceof URLSearchParams ? params.body : Object.entries(params.body).reduce((acc, [key, value]) => {
		if (Array.isArray(value)) for (const entry of value) acc.append(key, entry);
		else if (typeof value === "string") acc.append(key, value);
		return acc;
	}, new URLSearchParams());
	return guardedJsonApiRequest({
		url: `${params.baseUrl}${params.endpoint}`,
		method: "POST",
		headers: {
			Authorization: `Basic ${Buffer.from(`${params.accountSid}:${params.authToken}`).toString("base64")}`,
			"Content-Type": "application/x-www-form-urlencoded"
		},
		body: bodyParams,
		allowNotFound: params.allowNotFound,
		allowedHostnames: [requireSupportedTwilioApiHostname(params.baseUrl)],
		auditContext: "voice-call.twilio.api",
		errorPrefix: "Twilio API error",
		malformedJsonMessage: "Twilio API returned malformed JSON.",
		createError: (status, text) => new TwilioApiError(status, text)
	});
}
//#endregion
//#region extensions/voice-call/src/providers/twilio.ts
const TWILIO_CALL_NOT_IN_PROGRESS_CODE = 21220;
const TWILIO_CALL_UPDATE_RETRY_DELAYS_MS = [250, 750];
function createTwilioRequestDedupeKey(ctx, verifiedRequestKey) {
	if (verifiedRequestKey) return verifiedRequestKey;
	const signature = getHeader(ctx.headers, "x-twilio-signature") ?? "";
	const params = new URLSearchParams(ctx.rawBody);
	const callSid = params.get("CallSid") ?? "";
	const callStatus = params.get("CallStatus") ?? "";
	const direction = params.get("Direction") ?? "";
	const callId = normalizeOptionalString(ctx.query?.callId) ?? "";
	const flow = normalizeOptionalString(ctx.query?.flow) ?? "";
	const turnToken = normalizeOptionalString(ctx.query?.turnToken) ?? "";
	return `twilio:fallback:${crypto.createHash("sha256").update(`${signature}\n${callSid}\n${callStatus}\n${direction}\n${callId}\n${flow}\n${turnToken}\n${ctx.rawBody}`).digest("hex")}`;
}
var TwilioProvider = class TwilioProvider {
	/**
	* Release all process-local metadata owned by one Twilio call.
	* Terminal webhooks can be replayed, so this must stay idempotent.
	*/
	releaseCallState(providerCallId, callId) {
		const webhookUrl = this.callWebhookUrls.get(providerCallId);
		let resolvedCallId = callId;
		if (!resolvedCallId && webhookUrl) try {
			resolvedCallId = new URL(webhookUrl).searchParams.get("callId") || void 0;
		} catch {}
		if (resolvedCallId) this.twimlStorage.delete(resolvedCallId);
		this.callWebhookUrls.delete(providerCallId);
		this.callStreamMap.delete(providerCallId);
		this.streamAuthTokens.delete(providerCallId);
	}
	constructor(config, options = {}) {
		this.name = "twilio";
		this.callWebhookUrls = /* @__PURE__ */ new Map();
		this.currentPublicUrl = null;
		this.ttsProvider = null;
		this.mediaStreamHandler = null;
		this.playbackMarkSequence = 0;
		this.callStreamMap = /* @__PURE__ */ new Map();
		this.streamAuthTokens = /* @__PURE__ */ new Map();
		this.twimlStorage = /* @__PURE__ */ new Map();
		if (!config.accountSid) throw new Error("Twilio Account SID is required");
		if (!config.authToken) throw new Error("Twilio Auth Token is required");
		this.accountSid = config.accountSid;
		this.authToken = config.authToken;
		this.baseUrl = resolveTwilioApiBaseUrl({
			accountSid: this.accountSid,
			region: config.region
		});
		this.options = options;
		if (options.publicUrl) this.currentPublicUrl = options.publicUrl;
	}
	setPublicUrl(url) {
		this.currentPublicUrl = url;
	}
	setTTSProvider(provider) {
		this.ttsProvider = provider;
	}
	setMediaStreamHandler(handler) {
		this.mediaStreamHandler = handler;
	}
	registerCallStream(callSid, streamSid) {
		this.callStreamMap.set(callSid, streamSid);
	}
	hasRegisteredStream(callSid, streamSid) {
		const current = this.callStreamMap.get(callSid);
		return current !== void 0 && (streamSid === void 0 || current === streamSid);
	}
	unregisterCallStream(callSid, streamSid) {
		const currentStreamSid = this.callStreamMap.get(callSid);
		if (streamSid && currentStreamSid !== streamSid) return;
		this.callStreamMap.delete(callSid);
	}
	isConversationStreamConnectEnabled() {
		return Boolean(this.mediaStreamHandler && this.getStreamUrl());
	}
	isValidStreamToken(callSid, token) {
		const expected = this.streamAuthTokens.get(callSid);
		if (!expected || !token) return false;
		return safeEqualSecret(expected, token);
	}
	/** Interrupt active playback and queued TTS on barge-in. */
	clearTtsQueue(callSid, reason = "unspecified") {
		const streamSid = this.callStreamMap.get(callSid);
		if (!streamSid || !this.mediaStreamHandler) return;
		this.mediaStreamHandler.clearTtsQueue(streamSid, reason);
	}
	async apiRequest(endpoint, params, options) {
		return await twilioApiRequest({
			baseUrl: this.baseUrl,
			accountSid: this.accountSid,
			authToken: this.authToken,
			endpoint,
			body: params,
			allowNotFound: options?.allowNotFound
		});
	}
	async updateLiveCallTwiml(providerCallId, twiml, operation) {
		await retryAsync(() => this.apiRequest(`/Calls/${providerCallId}.json`, { Twiml: twiml }), {
			attempts: TWILIO_CALL_UPDATE_RETRY_DELAYS_MS.length + 1,
			minDelayMs: 0,
			shouldRetry: (err) => err instanceof TwilioApiError && err.twilioCode === TWILIO_CALL_NOT_IN_PROGRESS_CODE,
			delayMs: ({ attempt }) => TWILIO_CALL_UPDATE_RETRY_DELAYS_MS[attempt - 1] ?? 0,
			onRetry: ({ delayMs }) => {
				console.warn(`[voice-call] Twilio ${operation} update hit call state race (21220); retrying in ${delayMs}ms`);
			},
			sleep: (delayMs) => sleepWithAbort(delayMs)
		});
	}
	verifyWebhook(ctx) {
		const result = verifyTwilioWebhook(ctx, this.authToken, {
			publicUrl: this.currentPublicUrl || void 0,
			allowNgrokFreeTierLoopbackBypass: this.options.allowNgrokFreeTierLoopbackBypass ?? false,
			skipVerification: this.options.skipVerification,
			allowedHosts: this.options.webhookSecurity?.allowedHosts,
			trustForwardingHeaders: this.options.webhookSecurity?.trustForwardingHeaders,
			trustedProxyIPs: this.options.webhookSecurity?.trustedProxyIPs,
			remoteIP: ctx.remoteAddress
		});
		if (!result.ok) console.warn(`[twilio] Webhook verification failed: ${result.reason}`);
		return {
			ok: result.ok,
			reason: result.reason,
			isReplay: result.isReplay,
			verifiedRequestKey: result.verifiedRequestKey,
			releaseReplay: result.releaseReplay
		};
	}
	parseWebhookEvent(ctx, options) {
		try {
			const params = new URLSearchParams(ctx.rawBody);
			const callIdFromQuery = normalizeOptionalString(ctx.query?.callId);
			const turnTokenFromQuery = normalizeOptionalString(ctx.query?.turnToken);
			const dedupeKey = createTwilioRequestDedupeKey(ctx, options?.verifiedRequestKey);
			const event = this.normalizeEvent(params, {
				callIdOverride: callIdFromQuery,
				dedupeKey,
				turnToken: turnTokenFromQuery
			});
			if (event?.direction === "inbound" && event.type !== "call.ended" && event.providerCallId && this.currentPublicUrl && !this.callWebhookUrls.has(event.providerCallId)) this.callWebhookUrls.set(event.providerCallId, this.currentPublicUrl);
			return {
				events: event ? [event] : [],
				providerResponseBody: this.generateTwimlResponse(ctx),
				providerResponseHeaders: { "Content-Type": "application/xml" },
				statusCode: 200
			};
		} catch {
			return {
				events: [],
				statusCode: 400
			};
		}
	}
	static parseDirection(direction) {
		if (direction === "inbound") return "inbound";
		if (direction === "outbound-api" || direction === "outbound-dial") return "outbound";
	}
	static parseConfidence(value) {
		const trimmed = value?.trim();
		if (!trimmed || !/^\d+(?:\.\d+)?$/.test(trimmed)) return .9;
		return Number(trimmed);
	}
	normalizeEvent(params, options) {
		const callSid = params.get("CallSid") || "";
		const callIdOverride = options?.callIdOverride;
		const baseEvent = {
			id: crypto.randomUUID(),
			dedupeKey: options?.dedupeKey,
			callId: callIdOverride || callSid,
			providerCallId: callSid,
			timestamp: Date.now(),
			turnToken: options?.turnToken,
			direction: TwilioProvider.parseDirection(params.get("Direction")),
			from: params.get("From") || void 0,
			to: params.get("To") || void 0
		};
		const speechResult = params.get("SpeechResult");
		if (speechResult?.trim()) return {
			...baseEvent,
			type: "call.speech",
			transcript: speechResult,
			isFinal: true,
			confidence: TwilioProvider.parseConfidence(params.get("Confidence"))
		};
		const digits = params.get("Digits");
		if (digits) return {
			...baseEvent,
			type: "call.dtmf",
			digits
		};
		const callStatus = normalizeProviderStatus(params.get("CallStatus"));
		if (callStatus === "initiated") return {
			...baseEvent,
			type: "call.initiated"
		};
		if (callStatus === "ringing") return {
			...baseEvent,
			type: "call.ringing"
		};
		if (callStatus === "in-progress") return {
			...baseEvent,
			type: "call.answered"
		};
		const endReason = mapProviderStatusToEndReason(callStatus);
		if (endReason) {
			const event = {
				...baseEvent,
				type: "call.ended",
				reason: endReason
			};
			this.releaseCallState(callSid, callIdOverride);
			return event;
		}
		return null;
	}
	static {
		this.EMPTY_TWIML = "<?xml version=\"1.0\" encoding=\"UTF-8\"?><Response></Response>";
	}
	static {
		this.PAUSE_TWIML = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Pause length="30"/>
</Response>`;
	}
	static {
		this.QUEUE_TWIML = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="alice">Please hold while we connect you.</Say>
  <Enqueue waitUrl="/voice/hold-music">hold-queue</Enqueue>
</Response>`;
	}
	generateTwimlResponse(ctx) {
		const params = new URLSearchParams(ctx.rawBody);
		const isStatusCallback = normalizeOptionalString(ctx.query?.type) === "status";
		const callId = normalizeOptionalString(ctx.query?.callId);
		const callStatus = params.get("CallStatus");
		const direction = params.get("Direction");
		const callSid = params.get("CallSid") || void 0;
		const storedTwiml = callId ? this.twimlStorage.get(callId) : void 0;
		const streamUrl = callSid ? this.getStreamUrl() : null;
		if (callId && !isStatusCallback && storedTwiml) {
			this.twimlStorage.delete(callId);
			return storedTwiml;
		}
		if (isStatusCallback) return TwilioProvider.EMPTY_TWIML;
		if (direction === "inbound") {
			if (this.callStreamMap.size > 0) return TwilioProvider.QUEUE_TWIML;
		} else if (!(callId && direction?.startsWith("outbound")) && callStatus !== "in-progress") return TwilioProvider.EMPTY_TWIML;
		if (!streamUrl || !callSid) return TwilioProvider.PAUSE_TWIML;
		const url = new URL(streamUrl);
		url.searchParams.set("token", this.getStreamAuthToken(callSid));
		return this.getStreamConnectXml(url.toString());
	}
	consumeInitialTwiML(ctx) {
		const params = new URLSearchParams(ctx.rawBody);
		const isStatusCallback = normalizeOptionalString(ctx.query?.type) === "status";
		const callId = normalizeOptionalString(ctx.query?.callId);
		const callSid = params.get("CallSid") || void 0;
		if (!callId || isStatusCallback) return null;
		const storedTwiml = this.twimlStorage.get(callId);
		if (!storedTwiml) return null;
		this.twimlStorage.delete(callId);
		console.log(`[voice-call] Twilio initial TwiML consumed for call ${callId} (kind=pre-connect, callSid=${callSid ?? "unknown"})`);
		return storedTwiml;
	}
	getStreamUrl() {
		if (!this.currentPublicUrl || !this.options.streamPath) return null;
		return `${new URL(this.currentPublicUrl).origin.replace(/^https:\/\//, "wss://").replace(/^http:\/\//, "ws://")}${this.options.streamPath.startsWith("/") ? this.options.streamPath : `/${this.options.streamPath}`}`;
	}
	getStreamAuthToken(callSid) {
		const existing = this.streamAuthTokens.get(callSid);
		if (existing) return existing;
		const token = crypto.randomBytes(16).toString("base64url");
		this.streamAuthTokens.set(callSid, token);
		return token;
	}
	getStreamConnectXml(streamUrl) {
		const parsed = new URL(streamUrl);
		const token = parsed.searchParams.get("token");
		parsed.searchParams.delete("token");
		const cleanUrl = parsed.toString();
		const paramXml = token ? `\n      <Parameter name="token" value="${escapeXml(token)}" />` : "";
		return `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Connect>
    <Stream url="${escapeXml(cleanUrl)}">${paramXml}
    </Stream>
  </Connect>
</Response>`;
	}
	/**
	* Initiate an outbound call via Twilio API.
	* If preConnectTwiml is provided, the first webhook request receives that
	* TwiML before normal dynamic TwiML resumes.
	*/
	async initiateCall(input) {
		const url = new URL(input.webhookUrl);
		url.searchParams.set("callId", input.callId);
		const statusUrl = new URL(input.webhookUrl);
		statusUrl.searchParams.set("callId", input.callId);
		statusUrl.searchParams.set("type", "status");
		if (!input.inlineTwiml && input.preConnectTwiml) {
			this.twimlStorage.set(input.callId, input.preConnectTwiml);
			console.log(`[voice-call] Stored Twilio initial TwiML for call ${input.callId} (kind=pre-connect)`);
		}
		const params = {
			To: input.to,
			From: input.from,
			StatusCallback: statusUrl.toString(),
			StatusCallbackEvent: [
				"initiated",
				"ringing",
				"answered",
				"completed"
			],
			Timeout: "30"
		};
		if (input.inlineTwiml) {
			params.Twiml = input.inlineTwiml;
			console.log(`[voice-call] Sending direct Twilio initial TwiML for call ${input.callId} (kind=notify)`);
		} else params.Url = url.toString();
		const result = await this.apiRequest("/Calls.json", params);
		this.callWebhookUrls.set(result.sid, url.toString());
		return {
			providerCallId: result.sid,
			status: result.status === "queued" ? "queued" : "initiated"
		};
	}
	async hangupCall(input) {
		await this.apiRequest(`/Calls/${input.providerCallId}.json`, { Status: "completed" }, { allowNotFound: true });
		this.releaseCallState(input.providerCallId, input.callId);
	}
	/**
	* Play TTS audio via Twilio.
	*
	* Two modes:
	* 1. Core TTS + Media Streams: when an active stream exists, stream playback is required.
	*    If telephony TTS is unavailable in that state, playback fails rather than mixing paths.
	* 2. TwiML <Say>: fallback only when there is no active stream for the call.
	*/
	async playTts(input) {
		const streamSid = this.callStreamMap.get(input.providerCallId);
		if (streamSid) {
			if (!this.ttsProvider || !this.mediaStreamHandler) throw new Error("Telephony TTS unavailable while media stream is active; refusing TwiML fallback");
			try {
				await this.playTtsViaStream(input.text, streamSid);
				return;
			} catch (err) {
				console.warn(`[voice-call] Telephony TTS failed:`, err instanceof Error ? err.message : err);
				throw err instanceof Error ? err : new Error(String(err));
			}
		}
		const webhookUrl = this.requireCallWebhookUrl(input.providerCallId);
		console.warn("[voice-call] Using TwiML <Say> fallback - telephony TTS not configured or media stream not active");
		const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="${mapVoiceToPolly(input.voice)}" language="${input.locale || "en-US"}">${escapeXml(input.text)}</Say>
  <Gather input="speech" speechTimeout="auto" action="${escapeXml(webhookUrl)}" method="POST">
    <Say>.</Say>
  </Gather>
</Response>`;
		await this.updateLiveCallTwiml(input.providerCallId, twiml, "playTts");
	}
	async sendDtmf(input) {
		await this.updateLiveCallTwiml(input.providerCallId, generateDtmfRedirectTwiml(input.digits, this.requireCallWebhookUrl(input.providerCallId)), "sendDtmf");
	}
	/**
	* Play TTS via core TTS and Twilio Media Streams.
	* Generates audio with core TTS, converts to mu-law, and streams via WebSocket.
	* Uses a queue to serialize playback and prevent overlapping audio.
	*/
	async playTtsViaStream(text, streamSid) {
		if (!this.ttsProvider || !this.mediaStreamHandler) throw new Error("TTS provider and media stream handler required");
		const CHUNK_SIZE = 160;
		const CHUNK_DELAY_MS = 20;
		const SILENCE_CHUNK = Buffer.alloc(CHUNK_SIZE, 255);
		const handler = this.mediaStreamHandler;
		const ttsProvider = this.ttsProvider;
		await handler.queueTts(streamSid, async (signal) => {
			const sendKeepAlive = () => {
				handler.sendAudio(streamSid, SILENCE_CHUNK);
			};
			sendKeepAlive();
			const keepAlive = setInterval(() => {
				if (!signal.aborted) sendKeepAlive();
			}, CHUNK_DELAY_MS);
			let muLawAudio;
			let synthTimeout = null;
			let removeAbortListener = () => {};
			const synthTimeoutMs = ttsProvider.synthesisTimeoutMs;
			try {
				const synthPromise = ttsProvider.synthesizeForTelephony(text);
				const timeoutPromise = new Promise((_, reject) => {
					synthTimeout = setTimeout(() => {
						reject(/* @__PURE__ */ new Error(`Telephony TTS synthesis timed out after ${synthTimeoutMs}ms`));
					}, synthTimeoutMs);
				});
				const abortPromise = new Promise((_, reject) => {
					const onAbort = () => {
						reject(signal.reason instanceof Error ? signal.reason : /* @__PURE__ */ new Error("Telephony TTS synthesis aborted"));
					};
					signal.addEventListener("abort", onAbort, { once: true });
					removeAbortListener = () => signal.removeEventListener("abort", onAbort);
					if (signal.aborted) onAbort();
				});
				muLawAudio = await Promise.race([
					synthPromise,
					timeoutPromise,
					abortPromise
				]);
			} finally {
				if (synthTimeout) clearTimeout(synthTimeout);
				clearInterval(keepAlive);
				removeAbortListener();
			}
			if (muLawAudio.length === 0) throw new Error("Telephony TTS produced no audio");
			let chunkAttempts = 0;
			let nextChunkDueAt = Date.now() + CHUNK_DELAY_MS;
			for (let offset = 0; offset < muLawAudio.length; offset += CHUNK_SIZE) {
				if (signal.aborted) break;
				chunkAttempts += 1;
				if (!handler.sendAudio(streamSid, muLawAudio.subarray(offset, offset + CHUNK_SIZE))) {
					handler.clearAudio(streamSid);
					throw new Error(`Telephony stream playback failed: audio chunk ${chunkAttempts} not delivered`);
				}
				const waitMs = nextChunkDueAt - Date.now();
				if (waitMs > 0) try {
					await sleepWithAbort(Math.ceil(waitMs), signal);
				} catch (error) {
					if (!signal.aborted) throw error;
					break;
				}
				nextChunkDueAt += CHUNK_DELAY_MS;
				if (signal.aborted) break;
			}
			if (signal.aborted) return;
			const markName = `tts-${Date.now()}-${++this.playbackMarkSequence}`;
			await handler.sendMarkAndWait(streamSid, markName, muLawAudio.length / 8, signal);
		});
	}
	async startListening(input) {
		const actionUrl = new URL(this.requireCallWebhookUrl(input.providerCallId));
		if (input.turnToken) actionUrl.searchParams.set("turnToken", input.turnToken);
		const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Gather input="speech" speechTimeout="auto" language="${input.language || "en-US"}" action="${escapeXml(actionUrl.toString())}" method="POST">
  </Gather>
</Response>`;
		await this.updateLiveCallTwiml(input.providerCallId, twiml, "startListening");
	}
	requireCallWebhookUrl(providerCallId) {
		const webhookUrl = this.callWebhookUrls.get(providerCallId);
		if (!webhookUrl) throw new Error("Missing webhook URL for this call (provider state not initialized)");
		return webhookUrl;
	}
	async stopListening(_input) {}
	async getCallStatus(input) {
		return readProviderCallStatus(() => guardedJsonApiRequest({
			url: `${this.baseUrl}/Calls/${input.providerCallId}.json`,
			method: "GET",
			headers: { Authorization: `Basic ${Buffer.from(`${this.accountSid}:${this.authToken}`).toString("base64")}` },
			allowNotFound: true,
			allowedHostnames: [new URL(this.baseUrl).hostname],
			auditContext: "twilio-get-call-status",
			errorPrefix: "Twilio get call status error"
		}), (data) => {
			const status = normalizeProviderStatus(data.status);
			return {
				status,
				isTerminal: isProviderStatusTerminal(status)
			};
		});
	}
};
//#endregion
export { TwilioProvider };
