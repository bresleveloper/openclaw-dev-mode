import { i as asOptionalObjectRecord } from "./record-coerce-DItp3I4t.mjs";
import { Et as _enum, Fn as object, Jn as string, Nt as array, Pn as number, xn as literal } from "./schemas-BOYIvvln.mjs";
import "./string-coerce-runtime-C_MKhRVt.mjs";
import { r as isOpenAIGptLiveApiModel } from "./realtime-quicksilver-0VQEPDSP.mjs";
//#region extensions/openai/realtime-quicksilver-events.ts
const eventEnvelopeSchema = object({ type: string() }).passthrough();
const sessionStartedSchema = object({
	type: literal("session.started"),
	session: object({ expires_at: number().optional() }).passthrough()
}).passthrough();
const transcriptAddedSchema = object({ item: object({ text: string() }).passthrough() }).passthrough();
const outputAudioDeltaSchema = object({
	type: literal("output_audio.delta"),
	audio: string()
}).passthrough();
const turnDoneSchema = object({ turn: object({
	role: _enum(["user", "assistant"]),
	transcript: string()
}).passthrough() }).passthrough();
const delegationSchema = object({
	type: literal("delegation.created"),
	item: object({
		type: string(),
		target: string(),
		id: string().optional(),
		content: array(object({
			type: string(),
			text: string().optional()
		}).passthrough()).optional()
	}).passthrough()
}).passthrough();
const liveTranscriptSchema = object({
	delta: string(),
	start_ms: number(),
	end_ms: number()
});
const liveDelegationSchema = object({
	delegation: object({
		id: string().min(1),
		type: literal("delegation"),
		target: literal("client")
	}),
	offset_ms: number()
});
const liveAudioSchema = object({ delta: string() });
const liveClosedSchema = object({ reason: _enum([
	"close_requested",
	"expired",
	"content",
	"remote_hangup",
	"connection_lost"
]) });
function readQuicksilverErrorMessage(value) {
	if (typeof value === "string" && value.trim()) return value.trim();
	const record = asOptionalObjectRecord(value);
	if (record) {
		if (typeof record.message === "string" && record.message.trim()) return record.message.trim();
		const error = record.error;
		if (error && typeof error === "object") {
			const nestedMessage = asOptionalObjectRecord(error)?.message;
			if (typeof nestedMessage === "string" && nestedMessage.trim()) return nestedMessage.trim();
		}
		if (typeof error === "string" && error.trim()) return error.trim();
		try {
			const serialized = JSON.stringify(error ?? value);
			if (serialized && serialized !== "{}") return serialized;
		} catch {}
	}
	return "GPT-Live sideband error";
}
function isFatalQuicksilverAuthError(value) {
	const record = asOptionalObjectRecord(value);
	if (!record) return false;
	const error = asOptionalObjectRecord(record.error);
	const status = record.status ?? error?.status;
	if (status === 401 || status === "401") return true;
	const code = typeof (record.code ?? error?.code) === "string" ? String(record.code ?? error?.code).toLowerCase() : "";
	return [
		"authentication_error",
		"invalid_api_key",
		"invalid_token",
		"token_expired"
	].includes(code);
}
function parseOpenAIQuicksilverEvent(payload, model) {
	let decoded;
	try {
		decoded = JSON.parse(payload);
	} catch {
		return null;
	}
	const envelope = eventEnvelopeSchema.safeParse(decoded);
	if (!envelope.success) return null;
	const eventType = envelope.data.type;
	if (model && isOpenAIGptLiveApiModel(model)) {
		if (eventType === "session.input_transcript.delta" || eventType === "session.output_transcript.delta") {
			const transcript = liveTranscriptSchema.safeParse(decoded);
			return transcript.success ? {
				kind: "transcript-delta",
				role: eventType === "session.input_transcript.delta" ? "user" : "assistant",
				text: transcript.data.delta
			} : {
				kind: "ignored",
				eventType
			};
		}
		if (eventType === "session.output_audio.delta") {
			const audio = liveAudioSchema.safeParse(decoded);
			return audio.success ? {
				kind: "audio",
				data: audio.data.delta
			} : {
				kind: "ignored",
				eventType
			};
		}
		if (eventType === "session.delegation.created") {
			const delegation = liveDelegationSchema.safeParse(decoded);
			return delegation.success ? {
				kind: "delegation",
				id: delegation.data.delegation.id
			} : {
				kind: "ignored",
				eventType
			};
		}
		if (eventType === "session.closed") {
			const closed = liveClosedSchema.safeParse(decoded);
			return closed.success ? {
				kind: "session-closed",
				reason: closed.data.reason
			} : {
				kind: "ignored",
				eventType
			};
		}
		if (![
			"session.started",
			"session.updated",
			"error"
		].includes(eventType)) return {
			kind: "unknown",
			eventType
		};
	}
	if (eventType === "session.started") {
		const started = sessionStartedSchema.safeParse(decoded);
		if (!started.success) return {
			kind: "ignored",
			eventType
		};
		const expiresAt = started.data.session.expires_at;
		return {
			kind: "session-started",
			...expiresAt !== void 0 ? { expiresAt } : {}
		};
	}
	if (eventType === "input_transcript.added" || eventType === "output_transcript.added") {
		const transcript = transcriptAddedSchema.safeParse(decoded);
		return transcript.success ? {
			kind: "transcript-delta",
			role: eventType === "input_transcript.added" ? "user" : "assistant",
			text: transcript.data.item.text
		} : {
			kind: "ignored",
			eventType
		};
	}
	if (eventType === "turn.done") {
		const turn = turnDoneSchema.safeParse(decoded);
		return turn.success ? {
			kind: "transcript-done",
			role: turn.data.turn.role,
			text: turn.data.turn.transcript
		} : {
			kind: "ignored",
			eventType
		};
	}
	if (eventType === "output_audio.delta") {
		const audio = outputAudioDeltaSchema.safeParse(decoded);
		return audio.success ? {
			kind: "audio",
			data: audio.data.audio
		} : {
			kind: "ignored",
			eventType
		};
	}
	if (eventType === "output_audio_buffer.cleared") return { kind: "audio-cleared" };
	if (eventType === "session.updated") return {
		kind: "ignored",
		eventType
	};
	if (eventType === "delegation.created") {
		const delegation = delegationSchema.safeParse(decoded);
		if (!delegation.success) return {
			kind: "ignored",
			eventType
		};
		const { item } = delegation.data;
		if (item.type !== "delegation" || item.target !== "client" || !item.id) return {
			kind: "ignored",
			eventType
		};
		return {
			kind: "delegation",
			id: item.id,
			prompt: (item.content ?? []).filter((part) => part.type === "input_text").map((part) => part.text ?? "").join("")
		};
	}
	if (eventType === "error") return {
		kind: "error",
		message: readQuicksilverErrorMessage(decoded),
		fatalAuth: isFatalQuicksilverAuthError(decoded)
	};
	return {
		kind: "unknown",
		eventType
	};
}
//#endregion
export { parseOpenAIQuicksilverEvent as t };
