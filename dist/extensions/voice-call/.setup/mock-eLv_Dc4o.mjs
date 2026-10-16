import { n as reserveWebhookReplay, t as createWebhookReplayCache } from "./webhook-replay-B7RJNWNG.mjs";
import { normalizeLowercaseStringOrEmpty } from "openclaw/plugin-sdk/string-coerce-runtime";
import crypto from "node:crypto";
//#region extensions/voice-call/src/providers/mock.ts
/**
* Mock voice call provider for local testing.
*
* Events are driven via webhook POST with JSON body:
* - { events: NormalizedEvent[] } for bulk events
* - { event: NormalizedEvent } for single event
*/
var MockProvider = class {
	constructor() {
		this.name = "mock";
		this.replayCache = createWebhookReplayCache();
	}
	verifyWebhook(ctx) {
		const requestMaterial = `${ctx.method}\n${ctx.url}\n${ctx.rawBody}`;
		const key = `mock:${crypto.createHash("sha256").update(requestMaterial).digest("hex")}`;
		return {
			ok: true,
			...reserveWebhookReplay(this.replayCache, key)
		};
	}
	parseWebhookEvent(ctx, _options) {
		try {
			const payload = JSON.parse(ctx.rawBody);
			const events = [];
			const candidates = Array.isArray(payload.events) ? payload.events : payload.event ? [payload.event] : [];
			for (const evt of candidates) {
				const normalized = this.normalizeEvent(evt);
				if (normalized) events.push(normalized);
			}
			return {
				events,
				statusCode: 200
			};
		} catch {
			return {
				events: [],
				statusCode: 400
			};
		}
	}
	normalizeEvent(evt) {
		if (!evt.type || !evt.callId) return null;
		const base = {
			id: evt.id ?? crypto.randomUUID(),
			callId: evt.callId,
			providerCallId: evt.providerCallId,
			timestamp: evt.timestamp ?? Date.now()
		};
		switch (evt.type) {
			case "call.initiated":
			case "call.ringing":
			case "call.answered":
			case "call.active": return {
				...base,
				type: evt.type
			};
			case "call.speaking": return {
				...base,
				type: evt.type,
				text: evt.text ?? ""
			};
			case "call.assistant-speech": return {
				...base,
				type: evt.type,
				transcript: evt.transcript ?? ""
			};
			case "call.speech": {
				const transcript = evt.transcript ?? "";
				if (!transcript.trim()) return null;
				return {
					...base,
					type: evt.type,
					transcript,
					isFinal: evt.isFinal ?? true,
					confidence: evt.confidence
				};
			}
			case "call.silence": return {
				...base,
				type: evt.type,
				durationMs: evt.durationMs ?? 0
			};
			case "call.dtmf": return {
				...base,
				type: evt.type,
				digits: evt.digits ?? ""
			};
			case "call.ended": return {
				...base,
				type: evt.type,
				reason: evt.reason ?? "completed"
			};
			case "call.error": return {
				...base,
				type: evt.type,
				error: evt.error ?? "unknown error",
				retryable: evt.retryable
			};
			default: return null;
		}
	}
	async initiateCall(input) {
		return {
			providerCallId: `mock-${input.callId}`,
			status: "initiated"
		};
	}
	async hangupCall(_input) {}
	async playTts(_input) {}
	async sendDtmf(_input) {}
	async startListening(_input) {}
	async stopListening(_input) {}
	async getCallStatus(input) {
		const id = normalizeLowercaseStringOrEmpty(input.providerCallId);
		if (id.includes("stale") || id.includes("ended") || id.includes("completed")) return {
			status: "completed",
			isTerminal: true
		};
		return {
			status: "in-progress",
			isTerminal: false
		};
	}
};
//#endregion
export { MockProvider };
