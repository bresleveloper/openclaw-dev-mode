import { i as verifyTelnyxWebhook, t as createCarrierApi } from "./carrier-api-C8icuJ0G.mjs";
import crypto from "node:crypto";
//#region extensions/voice-call/src/providers/telnyx.ts
const HANGUP_REASONS = /* @__PURE__ */ new Map([
	["normal_clearing", "completed"],
	["normal_unspecified", "completed"],
	["originator_cancel", "hangup-bot"],
	["call_rejected", "busy"],
	["user_busy", "busy"],
	["no_answer", "no-answer"],
	["no_user_response", "no-answer"],
	["destination_out_of_order", "failed"],
	["network_out_of_order", "failed"],
	["service_unavailable", "failed"],
	["recovery_on_timer_expire", "failed"],
	["machine_detected", "voicemail"],
	["fax_detected", "voicemail"],
	["user_hangup", "hangup-user"],
	["subscriber_absent", "hangup-user"]
]);
function normalizeTelnyxDirection(direction) {
	if (direction === "incoming" || direction === "inbound") return "inbound";
	if (direction === "outgoing" || direction === "outbound") return "outbound";
}
function normalizeBase64ForCompare(value) {
	return value.replace(/=+$/u, "").replace(/-/gu, "+").replace(/_/gu, "/");
}
function decodeClientStateBase64(value) {
	const buffer = Buffer.from(value, "base64");
	if (normalizeBase64ForCompare(buffer.toString("base64")) !== normalizeBase64ForCompare(value)) return null;
	return buffer.toString("utf8");
}
var TelnyxProvider = class {
	constructor(config, options = {}) {
		this.name = "telnyx";
		if (!config.apiKey) throw new Error("Telnyx API key is required");
		if (!config.connectionId) throw new Error("Telnyx connection ID is required");
		this.connectionId = config.connectionId;
		this.publicKey = config.publicKey;
		this.options = options;
		this.api = createCarrierApi("Telnyx", "https://api.telnyx.com/v2", `Bearer ${config.apiKey}`, { statusContentType: "application/json" });
	}
	verifyWebhook(ctx) {
		return verifyTelnyxWebhook(ctx, this.publicKey, { skipVerification: this.options.skipVerification });
	}
	parseWebhookEvent(ctx, options) {
		try {
			const data = JSON.parse(ctx.rawBody).data;
			if (!data || !data.event_type) return {
				events: [],
				statusCode: 200
			};
			const event = this.normalizeEvent(data, options?.verifiedRequestKey);
			return {
				events: event ? [event] : [],
				statusCode: 200
			};
		} catch {
			return {
				events: [],
				statusCode: 400
			};
		}
	}
	normalizeEvent(data, dedupeKey) {
		let callId = "";
		if (data.payload?.client_state) callId = decodeClientStateBase64(data.payload.client_state) ?? data.payload.client_state;
		if (!callId) callId = data.payload?.call_control_id || "";
		const baseEvent = {
			id: data.id || crypto.randomUUID(),
			dedupeKey,
			callId,
			providerCallId: data.payload?.call_control_id,
			timestamp: Date.now(),
			direction: normalizeTelnyxDirection(data.payload?.direction),
			from: data.payload?.from,
			to: data.payload?.to
		};
		switch (data.event_type) {
			case "call.initiated":
			case "call.ringing":
			case "call.answered": return {
				...baseEvent,
				type: data.event_type
			};
			case "call.bridged": return {
				...baseEvent,
				type: "call.active"
			};
			case "call.speak.started": return {
				...baseEvent,
				type: "call.speaking",
				text: data.payload?.text || ""
			};
			case "call.transcription": {
				const transcript = data.payload?.transcription_data?.transcript ?? data.payload?.transcription ?? "";
				if (!transcript.trim()) return null;
				return {
					...baseEvent,
					type: "call.speech",
					transcript,
					isFinal: data.payload?.transcription_data?.is_final ?? data.payload?.is_final ?? true,
					confidence: data.payload?.transcription_data?.confidence ?? data.payload?.confidence
				};
			}
			case "call.hangup": return {
				...baseEvent,
				type: "call.ended",
				reason: this.mapHangupCause(data.payload?.hangup_cause)
			};
			case "call.dtmf.received": return {
				...baseEvent,
				type: "call.dtmf",
				digits: data.payload?.digit || ""
			};
			default: return null;
		}
	}
	mapHangupCause(cause) {
		const reason = cause && HANGUP_REASONS.get(cause);
		if (reason) return reason;
		if (cause) console.warn(`[telnyx] Unknown hangup cause: ${cause}`);
		return "completed";
	}
	async initiateCall(input) {
		const body = {
			connection_id: this.connectionId,
			to: input.to,
			from: input.from,
			webhook_url: input.webhookUrl,
			webhook_url_method: "POST",
			client_state: Buffer.from(input.callId).toString("base64"),
			timeout_secs: 30,
			...buildTelnyxStreamingFields(input.streamUrl, input.streamAuthToken)
		};
		return {
			providerCallId: (await this.api.request("/calls", body)).data.call_control_id,
			status: "initiated"
		};
	}
	async hangupCall(input) {
		await this.api.request(`/calls/${input.providerCallId}/actions/hangup`, { command_id: crypto.randomUUID() }, { allowNotFound: true });
	}
	async answerCall(input) {
		const body = {
			command_id: `openclaw-answer-${input.callId}`,
			...buildTelnyxStreamingFields(input.streamUrl, input.streamAuthToken)
		};
		await this.api.request(`/calls/${input.providerCallId}/actions/answer`, body);
	}
	async playTts(input) {
		await this.api.request(`/calls/${input.providerCallId}/actions/speak`, {
			command_id: crypto.randomUUID(),
			payload: input.text,
			voice: input.voice || "female",
			language: input.locale || "en-US"
		});
	}
	async startListening(input) {
		await this.api.request(`/calls/${input.providerCallId}/actions/transcription_start`, {
			command_id: crypto.randomUUID(),
			language: input.language || "en"
		});
	}
	async stopListening(input) {
		await this.api.request(`/calls/${input.providerCallId}/actions/transcription_stop`, { command_id: crypto.randomUUID() }, { allowNotFound: true });
	}
	async getCallStatus(input) {
		return this.api.getCallStatus(`/calls/${input.providerCallId}`, (data) => {
			const status = data.data?.state ?? "unknown";
			const isAlive = data.data?.is_alive;
			return isAlive === void 0 ? {
				status,
				isTerminal: false,
				isUnknown: true
			} : {
				status,
				isTerminal: !isAlive
			};
		});
	}
};
function buildTelnyxStreamingFields(streamUrl, streamAuthToken) {
	if (!streamUrl) return {};
	return {
		stream_url: streamUrl,
		stream_track: "inbound_track",
		stream_codec: "PCMU",
		stream_bidirectional_mode: "rtp",
		stream_bidirectional_codec: "PCMU",
		stream_bidirectional_sampling_rate: 8e3,
		stream_bidirectional_target_legs: "self",
		...streamAuthToken ? { stream_auth_token: streamAuthToken } : {}
	};
}
//#endregion
export { TelnyxProvider };
