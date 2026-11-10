import { c as getHeader } from "./runtime-entry-Cy51Uayg.mjs";
import { t as escapeXml } from "./voice-mapping-1lzFmzOF.mjs";
import { n as reconstructWebhookUrl, r as verifyPlivoWebhook, t as createCarrierApi } from "./carrier-api-C8icuJ0G.mjs";
import { normalizeLowercaseStringOrEmpty, normalizeOptionalString } from "openclaw/plugin-sdk/string-coerce-runtime";
import crypto from "node:crypto";
//#region extensions/voice-call/src/providers/plivo.ts
function createPlivoRequestDedupeKey(ctx) {
	const nonceV3 = getHeader(ctx.headers, "x-plivo-signature-v3-nonce");
	if (nonceV3) return `plivo:v3:${nonceV3}`;
	const nonceV2 = getHeader(ctx.headers, "x-plivo-signature-v2-nonce");
	if (nonceV2) return `plivo:v2:${nonceV2}`;
	return `plivo:fallback:${crypto.createHash("sha256").update(ctx.rawBody).digest("hex")}`;
}
var PlivoProvider = class PlivoProvider {
	/**
	* Release all process-local metadata owned by one Plivo call.
	* Terminal webhooks can be replayed, so this must stay idempotent.
	*/
	releaseCallState(params) {
		if (params.callId) {
			this.callIdToWebhookUrl.delete(params.callId);
			this.pendingSpeakByCallId.delete(params.callId);
			this.pendingListenByCallId.delete(params.callId);
		}
		const callUuid = params.callUuid || (params.providerCallId ? this.requestUuidToCallUuid.get(params.providerCallId) ?? params.providerCallId : void 0);
		if (params.providerCallId) {
			this.requestUuidToCallUuid.delete(params.providerCallId);
			this.callUuidToWebhookUrl.delete(params.providerCallId);
		}
		if (!callUuid) return;
		this.callUuidToWebhookUrl.delete(callUuid);
		for (const [requestUuid, mappedCallUuid] of this.requestUuidToCallUuid) if (mappedCallUuid === callUuid) this.requestUuidToCallUuid.delete(requestUuid);
	}
	constructor(config, options = {}) {
		this.name = "plivo";
		this.requestUuidToCallUuid = /* @__PURE__ */ new Map();
		this.callIdToWebhookUrl = /* @__PURE__ */ new Map();
		this.callUuidToWebhookUrl = /* @__PURE__ */ new Map();
		this.pendingSpeakByCallId = /* @__PURE__ */ new Map();
		this.pendingListenByCallId = /* @__PURE__ */ new Map();
		if (!config.authId) throw new Error("Plivo Auth ID is required");
		if (!config.authToken) throw new Error("Plivo Auth Token is required");
		this.authToken = config.authToken;
		this.options = options;
		this.api = createCarrierApi("Plivo", `https://api.plivo.com/v1/Account/${config.authId}`, `Basic ${Buffer.from(`${config.authId}:${config.authToken}`).toString("base64")}`);
	}
	verifyWebhook(ctx) {
		const result = verifyPlivoWebhook(ctx, this.authToken, {
			publicUrl: this.options.publicUrl,
			skipVerification: this.options.skipVerification,
			allowedHosts: this.options.webhookSecurity?.allowedHosts,
			trustForwardingHeaders: this.options.webhookSecurity?.trustForwardingHeaders,
			trustedProxyIPs: this.options.webhookSecurity?.trustedProxyIPs,
			remoteIP: ctx.remoteAddress
		});
		if (!result.ok) console.warn(`[plivo] Webhook verification failed: ${result.reason}`);
		return {
			ok: result.ok,
			reason: result.reason,
			isReplay: result.isReplay,
			verifiedRequestKey: result.verifiedRequestKey,
			releaseReplay: result.releaseReplay
		};
	}
	parseWebhookEvent(ctx, options) {
		const flow = normalizeOptionalString(ctx.query?.flow) ?? "";
		const parsed = new URLSearchParams(ctx.rawBody);
		const callUuid = parsed.get("CallUUID") || void 0;
		if (callUuid) {
			const webhookBase = this.baseWebhookUrlFromCtx(ctx);
			if (webhookBase) this.callUuidToWebhookUrl.set(callUuid, webhookBase);
		}
		const callId = normalizeOptionalString(ctx.query?.callId);
		let event = null;
		let providerResponseBody;
		if (flow === "xml-speak" || flow === "xml-listen") {
			const speaks = flow === "xml-speak";
			const pendingSpeak = speaks && callId ? this.pendingSpeakByCallId.get(callId) : void 0;
			const pendingListen = !speaks && callId ? this.pendingListenByCallId.get(callId) : void 0;
			const language = speaks ? pendingSpeak?.locale : pendingListen?.language;
			if (callId) (speaks ? this.pendingSpeakByCallId : this.pendingListenByCallId).delete(callId);
			const actionUrl = !speaks || pendingSpeak?.listenAfterPlayback && callId ? this.buildActionUrl(ctx, callId) : null;
			providerResponseBody = actionUrl && callId ? PlivoProvider.xmlGetInputSpeech({
				text: pendingSpeak?.text,
				language,
				actionUrl
			}) : pendingSpeak ? PlivoProvider.xmlKeepAlive(`  <Speak language="${escapeXml(language || "en-US")}">${escapeXml(pendingSpeak.text)}</Speak>\n`) : PlivoProvider.xmlKeepAlive();
		} else {
			const dedupeKey = options?.verifiedRequestKey ?? createPlivoRequestDedupeKey(ctx);
			event = this.normalizeEvent(parsed, callId, dedupeKey);
			providerResponseBody = flow === "answer" || flow === "getinput" ? PlivoProvider.xmlKeepAlive() : "<?xml version=\"1.0\" encoding=\"UTF-8\"?><Response></Response>";
		}
		return {
			events: event ? [event] : [],
			providerResponseBody,
			providerResponseHeaders: { "Content-Type": "text/xml" },
			statusCode: 200
		};
	}
	normalizeEvent(params, callIdOverride, dedupeKey) {
		const callUuid = params.get("CallUUID") || "";
		const requestUuid = params.get("RequestUUID") || "";
		if (requestUuid && callUuid) this.requestUuidToCallUuid.set(requestUuid, callUuid);
		const direction = params.get("Direction");
		const callStatus = params.get("CallStatus");
		const baseEvent = {
			id: crypto.randomUUID(),
			dedupeKey,
			callId: callIdOverride || callUuid || requestUuid,
			providerCallId: callUuid || requestUuid || void 0,
			timestamp: Date.now(),
			direction: direction === "inbound" ? "inbound" : direction === "outbound" ? "outbound" : void 0,
			from: params.get("From") || void 0,
			to: params.get("To") || void 0
		};
		const digits = params.get("Digits");
		if (digits) return {
			...baseEvent,
			type: "call.dtmf",
			digits
		};
		const transcript = PlivoProvider.extractTranscript(params);
		if (transcript) return {
			...baseEvent,
			type: "call.speech",
			transcript,
			isFinal: true
		};
		if (callStatus === "ringing") return {
			...baseEvent,
			type: "call.ringing"
		};
		if (callStatus === "in-progress") return {
			...baseEvent,
			type: "call.answered"
		};
		if (callStatus === "completed" || callStatus === "busy" || callStatus === "no-answer" || callStatus === "failed") {
			const event = {
				...baseEvent,
				type: "call.ended",
				reason: callStatus
			};
			this.releaseCallState({
				callId: baseEvent.callId || void 0,
				providerCallId: callUuid || requestUuid || void 0,
				callUuid: callUuid || void 0
			});
			return event;
		}
		if (params.get("Event") === "StartApp" && callUuid) return {
			...baseEvent,
			type: "call.answered"
		};
		return null;
	}
	async initiateCall(input) {
		const webhookUrl = new URL(input.webhookUrl);
		webhookUrl.searchParams.set("provider", "plivo");
		webhookUrl.searchParams.set("callId", input.callId);
		const answerUrl = new URL(webhookUrl);
		answerUrl.searchParams.set("flow", "answer");
		const hangupUrl = new URL(webhookUrl);
		hangupUrl.searchParams.set("flow", "hangup");
		this.callIdToWebhookUrl.set(input.callId, input.webhookUrl);
		const result = await this.api.request("/Call/", {
			from: PlivoProvider.normalizeNumber(input.from),
			to: PlivoProvider.normalizeNumber(input.to),
			answer_url: answerUrl.toString(),
			answer_method: "POST",
			hangup_url: hangupUrl.toString(),
			hangup_method: "POST",
			hangup_on_ring: this.options.ringTimeoutSec ?? 30
		});
		const requestUuid = Array.isArray(result.request_uuid) ? result.request_uuid[0] : result.request_uuid;
		if (!requestUuid) throw new Error("Plivo call create returned no request_uuid");
		return {
			providerCallId: requestUuid,
			status: "initiated"
		};
	}
	async hangupCall(input) {
		const callUuid = this.requestUuidToCallUuid.get(input.providerCallId);
		await this.api.request(`/Call/${callUuid || input.providerCallId}/`, void 0, {
			method: "DELETE",
			allowNotFound: true
		});
		if (!callUuid) await this.api.request(`/Request/${input.providerCallId}/`, void 0, {
			method: "DELETE",
			allowNotFound: true
		});
		this.releaseCallState({
			callId: input.callId,
			providerCallId: input.providerCallId,
			callUuid
		});
	}
	resolveCallContext(input, operation) {
		const callUuid = this.requestUuidToCallUuid.get(input.providerCallId) ?? input.providerCallId;
		const webhookBase = this.callUuidToWebhookUrl.get(callUuid) || this.callIdToWebhookUrl.get(input.callId);
		if (!webhookBase) throw new Error("Missing webhook URL for this call (provider state missing)");
		if (!callUuid) throw new Error(`Missing Plivo CallUUID for ${operation}`);
		return {
			callUuid,
			webhookBase,
			callId: input.callId
		};
	}
	async transferCallLeg(params) {
		const transferUrl = new URL(params.webhookBase);
		transferUrl.searchParams.set("provider", "plivo");
		transferUrl.searchParams.set("flow", params.flow);
		transferUrl.searchParams.set("callId", params.callId);
		await this.api.request(`/Call/${params.callUuid}/`, {
			legs: "aleg",
			aleg_url: transferUrl.toString(),
			aleg_method: "POST"
		});
	}
	async playTts(input) {
		const context = this.resolveCallContext(input, "playTts");
		this.pendingSpeakByCallId.set(input.callId, {
			text: input.text,
			locale: input.locale,
			listenAfterPlayback: input.listenAfterPlayback
		});
		await this.transferCallLeg({
			...context,
			flow: "xml-speak"
		});
	}
	async startListening(input) {
		const context = this.resolveCallContext(input, "startListening");
		this.pendingListenByCallId.set(input.callId, { language: input.language });
		await this.transferCallLeg({
			...context,
			flow: "xml-listen"
		});
	}
	async stopListening(_input) {}
	async getCallStatus(input) {
		const terminalStatuses = /* @__PURE__ */ new Set([
			"completed",
			"busy",
			"failed",
			"timeout",
			"no-answer",
			"cancel",
			"machine",
			"hangup"
		]);
		return this.api.getCallStatus(`/Call/${input.providerCallId}/`, (data) => {
			const status = data.call_status ?? "unknown";
			return {
				status,
				isTerminal: terminalStatuses.has(status)
			};
		});
	}
	static normalizeNumber(numberOrSip) {
		const trimmed = numberOrSip.trim();
		if (normalizeLowercaseStringOrEmpty(trimmed).startsWith("sip:")) return trimmed;
		return trimmed.replace(/[^\d+]/g, "");
	}
	static xmlKeepAlive(content = "") {
		return `<?xml version="1.0" encoding="UTF-8"?>
<Response>
${content}  <Wait length="300" />
</Response>`;
	}
	static xmlGetInputSpeech(params) {
		const language = params.language || "en-US";
		const prompt = params.text === void 0 ? "" : `    <Speak language="${escapeXml(language)}">${escapeXml(params.text)}</Speak>\n`;
		return PlivoProvider.xmlKeepAlive(`  <GetInput inputType="speech" method="POST" action="${escapeXml(params.actionUrl)}" language="${escapeXml(language)}" executionTimeout="30" speechEndTimeout="2" redirect="false">
${prompt}  </GetInput>
`);
	}
	buildActionUrl(ctx, callId) {
		const base = this.baseWebhookUrlFromCtx(ctx);
		if (!base) return null;
		const u = new URL(base);
		u.searchParams.set("provider", "plivo");
		u.searchParams.set("flow", "getinput");
		if (callId) u.searchParams.set("callId", callId);
		return u.toString();
	}
	baseWebhookUrlFromCtx(ctx) {
		try {
			const u = new URL(this.options.publicUrl || reconstructWebhookUrl(ctx, {
				allowedHosts: this.options.webhookSecurity?.allowedHosts,
				trustForwardingHeaders: this.options.webhookSecurity?.trustForwardingHeaders,
				trustedProxyIPs: this.options.webhookSecurity?.trustedProxyIPs,
				remoteIP: ctx.remoteAddress
			}));
			return `${u.origin}${u.pathname}`;
		} catch {
			return null;
		}
	}
	static extractTranscript(params) {
		for (const key of [
			"Speech",
			"Transcription",
			"TranscriptionText",
			"SpeechResult",
			"RecognizedSpeech",
			"Text"
		]) {
			const value = params.get(key)?.trim();
			if (value) return value;
		}
		return null;
	}
};
//#endregion
export { PlivoProvider };
