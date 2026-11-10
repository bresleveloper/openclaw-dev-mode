import { At as _undefined, Et as _enum, Fn as object, Jn as string, Lt as boolean, Pn as number, Yt as discriminatedUnion, xn as literal } from "./schemas-BOYIvvln.mjs";
//#region src/proxy-capture/cli-contract.ts
const text = string();
const event = object({
	sessionId: text.min(1),
	ts: number().finite(),
	sourceScope: literal("openclaw"),
	sourceProcess: text,
	protocol: _enum([
		"http",
		"https",
		"sse",
		"ws",
		"wss",
		"connect"
	]),
	direction: _enum([
		"outbound",
		"inbound",
		"local"
	]),
	kind: _enum([
		"connect",
		"tls-handshake",
		"request",
		"response",
		"ws-open",
		"ws-frame",
		"ws-close",
		"error",
		"retry-link"
	]),
	flowId: text,
	method: text.optional(),
	host: text.optional(),
	path: text.optional(),
	status: number().optional(),
	closeCode: number().optional(),
	contentType: text.optional(),
	headersJson: text.optional(),
	dataText: text.optional(),
	dataBlobId: text.optional(),
	dataSha256: text.optional(),
	errorText: text.optional(),
	metaJson: text.optional()
}).strict();
const debugProxyCaptureWriteCommandSchema = discriminatedUnion("type", [
	object({
		type: literal("capture.upsertSession"),
		input: object({
			id: text.min(1),
			startedAt: number().finite(),
			endedAt: number().finite().optional(),
			mode: text,
			sourceScope: literal("openclaw"),
			sourceProcess: text,
			proxyUrl: text.optional()
		}).strict()
	}).strict(),
	object({
		type: literal("capture.endSession"),
		input: object({
			sessionId: text.min(1),
			endedAt: number().finite()
		}).strict()
	}).strict(),
	object({
		type: literal("capture.recordEvent"),
		input: event
	}).strict(),
	object({
		type: literal("capture.recordEventWithPayload"),
		input: object({
			event,
			payload: object({
				data: text.nullable().optional(),
				base64: boolean().optional(),
				contentType: text.optional(),
				previewLimit: number().int().nonnegative().optional()
			}).strict().transform(({ data, base64, ...rest }) => ({
				...rest,
				data: base64 && data != null ? Buffer.from(data, "base64") : data
			}))
		}).strict()
	}).strict()
]);
const debugProxyCliCommandSchema = discriminatedUnion("type", [
	...debugProxyCaptureWriteCommandSchema.options,
	object({
		type: literal("capture.listSessions"),
		input: object({ limit: number().int().positive().optional() }).strict()
	}).strict(),
	object({
		type: literal("capture.readBlob"),
		input: object({ blobId: text.min(1) }).strict()
	}).strict(),
	object({
		type: literal("capture.queryPreset"),
		input: object({
			preset: _enum([
				"double-sends",
				"retry-storms",
				"cache-busting",
				"ws-duplicate-frames",
				"missing-ack",
				"error-bursts"
			]),
			sessionId: text.optional()
		}).strict()
	}).strict(),
	object({
		type: literal("capture.purgeAll"),
		input: _undefined().optional()
	}).strict()
]);
function encodeDebugProxyPayload(payload) {
	return {
		...payload,
		...Buffer.isBuffer(payload.data) ? {
			data: payload.data.toString("base64"),
			base64: true
		} : {}
	};
}
//#endregion
export { debugProxyCliCommandSchema as n, encodeDebugProxyPayload as r, debugProxyCaptureWriteCommandSchema as t };
