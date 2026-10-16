import { i as asOptionalObjectRecord } from "./record-coerce-TIsquoVR.mjs";
import { Et as _enum, Fn as object, Jn as string, Nt as array, Pn as number, xn as literal } from "./schemas-BOYIvvln.mjs";
import "./string-coerce-runtime-50qKeWeL.mjs";
import { r as isOpenAIGptLiveApiModel } from "./realtime-quicksilver-HjMjNxOa.mjs";
//#region extensions/openai/realtime-quicksilver-events.ts
const eventEnvelopeSchema = object({ type: string() });
const sessionStartedSchema = object({ session: object({ expires_at: number().optional() }) }).transform(({ session }) => ({
	kind: "session-started",
	...session.expires_at !== void 0 ? { expiresAt: session.expires_at } : {}
}));
const transcriptAddedSchema = object({ item: object({ text: string() }) });
const liveTranscriptSchema = object({
	delta: string(),
	start_ms: number(),
	end_ms: number()
});
const framelessSchemas = /* @__PURE__ */ new Map([
	["input_transcript.added", transcriptAddedSchema.transform(({ item }) => ({
		kind: "transcript-delta",
		role: "user",
		text: item.text
	}))],
	["output_transcript.added", transcriptAddedSchema.transform(({ item }) => ({
		kind: "transcript-delta",
		role: "assistant",
		text: item.text
	}))],
	["turn.done", object({ turn: object({
		role: _enum(["user", "assistant"]),
		transcript: string()
	}) }).transform(({ turn }) => ({
		kind: "transcript-done",
		role: turn.role,
		text: turn.transcript
	}))],
	["output_audio.delta", object({ audio: string() }).transform(({ audio }) => ({
		kind: "audio",
		data: audio
	}))],
	["output_audio_buffer.cleared", object({}).transform(() => ({ kind: "audio-cleared" }))],
	["delegation.created", object({ item: object({
		type: literal("delegation"),
		target: literal("client"),
		id: string().min(1),
		content: array(object({
			type: string(),
			text: string().optional()
		})).optional()
	}) }).transform(({ item }) => ({
		kind: "delegation",
		id: item.id,
		prompt: (item.content ?? []).filter((part) => part.type === "input_text").map((part) => part.text ?? "").join("")
	}))]
]);
const liveSchemas = /* @__PURE__ */ new Map([
	["session.input_transcript.delta", liveTranscriptSchema.transform(({ delta }) => ({
		kind: "transcript-delta",
		role: "user",
		text: delta
	}))],
	["session.output_transcript.delta", liveTranscriptSchema.transform(({ delta }) => ({
		kind: "transcript-delta",
		role: "assistant",
		text: delta
	}))],
	["session.output_audio.delta", object({ delta: string() }).transform(({ delta }) => ({
		kind: "audio",
		data: delta
	}))],
	["session.delegation.created", object({
		delegation: object({
			id: string().min(1),
			type: literal("delegation"),
			target: literal("client")
		}),
		offset_ms: number()
	}).transform(({ delegation }) => ({
		kind: "delegation",
		id: delegation.id
	}))],
	["session.closed", object({ reason: _enum([
		"close_requested",
		"expired",
		"content",
		"remote_hangup",
		"connection_lost"
	]) }).transform(({ reason }) => ({
		kind: "session-closed",
		reason
	}))]
]);
function isFatalQuicksilverAuthError(value) {
	const record = asOptionalObjectRecord(value);
	if (!record) return false;
	const error = asOptionalObjectRecord(record.error);
	const status = record.status ?? error?.status;
	if (status === 401 || status === "401") return true;
	const code = record.code ?? error?.code;
	return typeof code === "string" && [
		"authentication_error",
		"invalid_api_key",
		"invalid_token",
		"token_expired"
	].includes(code.toLowerCase());
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
	if (eventType === "error") return {
		kind: "error",
		fatalAuth: isFatalQuicksilverAuthError(decoded)
	};
	if (eventType === "session.updated") return {
		kind: "ignored",
		eventType
	};
	const schema = eventType === "session.started" ? sessionStartedSchema : (isOpenAIGptLiveApiModel(model) ? liveSchemas : framelessSchemas).get(eventType);
	if (!schema) return {
		kind: "unknown",
		eventType
	};
	const parsed = schema.safeParse(decoded);
	return parsed.success ? parsed.data : {
		kind: "ignored",
		eventType
	};
}
//#endregion
export { parseOpenAIQuicksilverEvent as t };
