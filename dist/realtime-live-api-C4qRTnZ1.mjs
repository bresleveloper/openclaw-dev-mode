import { Fn as object, Jn as string, xn as literal } from "./schemas-BOYIvvln.mjs";
//#region extensions/openai/realtime-live-api.ts
const OPENAI_LIVE_SESSIONS_URL = "https://api.openai.com/v1/live/sessions";
const LIVE_RESPONSE_MAX_BYTES = 524288;
const sessionIdentitySchema = object({ session: object({ id: string().min(1).max(512) }) });
const transportSchema = object({ transport: object({
	type: literal("webrtc"),
	sdp: string().min(1).max(262144)
}) });
async function createOpenAILiveCall(params, runtime) {
	const response = await (params.fetchImpl ?? fetch)(OPENAI_LIVE_SESSIONS_URL, {
		method: "POST",
		headers: {
			...runtime.resolveProviderRequestHeaders({
				provider: "openai",
				baseUrl: OPENAI_LIVE_SESSIONS_URL,
				capability: "audio",
				transport: "http",
				defaultHeaders: {}
			}),
			Authorization: `Bearer ${params.apiKey}`,
			"Content-Type": "application/json"
		},
		body: JSON.stringify({
			session: params.session,
			transport: {
				type: "webrtc",
				sdp: params.sdp
			}
		}),
		signal: params.signal
	});
	if (!response.ok) {
		await response.body?.cancel().catch(() => void 0);
		throw new Error(`GPT-Live session creation failed (${response.status}). Verify Platform model access.`);
	}
	const payload = await runtime.readProviderJsonResponse(response, "GPT-Live session", { maxBytes: LIVE_RESPONSE_MAX_BYTES });
	const identity = sessionIdentitySchema.safeParse(payload);
	if (!identity.success) throw new Error("GPT-Live session response has no valid session id");
	const callId = identity.data.session.id;
	params.onCallAllocated?.(callId);
	const transport = transportSchema.safeParse(payload);
	if (!transport.success || !transport.data.transport.sdp.trim()) throw new Error("GPT-Live session response has no valid WebRTC answer");
	return {
		kind: "gpt-live",
		status: response.status,
		answerSdp: transport.data.transport.sdp,
		callId,
		sidebandUrl: `wss://api.openai.com/v1/live/sessions/${encodeURIComponent(callId)}/attach`
	};
}
async function hangupOpenAILiveCall(params, runtime) {
	const url = `${OPENAI_LIVE_SESSIONS_URL}/${encodeURIComponent(params.callId)}/hangup`;
	const response = await (params.fetchImpl ?? fetch)(url, {
		method: "POST",
		headers: {
			...runtime.resolveProviderRequestHeaders({
				provider: "openai",
				baseUrl: url,
				capability: "audio",
				transport: "http",
				defaultHeaders: {}
			}),
			Authorization: `Bearer ${params.apiKey}`
		},
		signal: params.signal
	});
	await response.body?.cancel().catch(() => void 0);
	if (!response.ok && response.status !== 404) throw new Error(`GPT-Live session hangup failed (${response.status})`);
}
//#endregion
export { createOpenAILiveCall as n, hangupOpenAILiveCall as r, OPENAI_LIVE_SESSIONS_URL as t };
