import { t as getZaloRuntime } from "./runtime-DPa2Wy0g.mjs";
import { r as ZaloApiError } from "./channel.runtime-Bv-4xN53.mjs";
import { DEFAULT_INGRESS_ADOPTION_STALL_MS, DEFAULT_INGRESS_RETRY_MAX_ATTEMPTS, bindIngressLifecycleToReplyOptions, createChannelIngressError, createChannelIngressMonitor } from "openclaw/plugin-sdk/channel-outbound";
import { asOptionalObjectRecord, normalizeNullableString } from "openclaw/plugin-sdk/string-coerce-runtime";
import { z } from "zod";
import { runDetachedWebhookWork } from "openclaw/plugin-sdk/webhook-request-guards";
import { collectErrorGraphCandidates, formatErrorMessage } from "openclaw/plugin-sdk/error-runtime";
// extensions/zalo/src/message-schema.ts
const nonEmptyWebhookStringSchema = z.string().transform((value) => normalizeNullableString(value)).pipe(z.string());
const optionalWebhookStringSchema = z.string().optional().catch(void 0);
const webhookEnvelopeSchema = z.looseObject({
	ok: z.unknown().optional(),
	result: z.looseObject({}).optional().catch(void 0)
}).transform((envelope) => envelope.ok === true && envelope.result ? envelope.result : envelope);
const webhookAdmissionSchema = z.looseObject({ message: z.looseObject({
	message_id: nonEmptyWebhookStringSchema,
	chat: z.looseObject({ id: nonEmptyWebhookStringSchema })
}) });
const webhookSenderSchema = z.object({
	id: nonEmptyWebhookStringSchema,
	name: optionalWebhookStringSchema,
	display_name: optionalWebhookStringSchema,
	avatar: optionalWebhookStringSchema,
	is_bot: z.boolean().optional().catch(void 0)
});
const webhookChatSchema = z.object({
	id: nonEmptyWebhookStringSchema,
	chat_type: z.enum(["PRIVATE", "GROUP"])
});
const webhookMessageSchema = z.object({
	message_id: nonEmptyWebhookStringSchema,
	from: webhookSenderSchema,
	chat: webhookChatSchema,
	date: z.number().finite(),
	text: optionalWebhookStringSchema,
	photo_url: optionalWebhookStringSchema,
	caption: optionalWebhookStringSchema,
	sticker: optionalWebhookStringSchema,
	message_type: optionalWebhookStringSchema
});
const webhookUpdateSchema = z.object({
	event_name: z.enum([
		"message.text.received",
		"message.image.received",
		"message.sticker.received",
		"message.unsupported.received"
	]),
	message: webhookMessageSchema
}).superRefine((update, context) => {
	if (update.event_name === "message.text.received" && update.message.text === void 0) context.addIssue({
		code: "custom",
		path: ["message", "text"],
		message: "text event requires message.text"
	});
});
// extensions/zalo/src/webhook-spool.ts
const ZALO_WEBHOOK_SPOOL_VERSION = 1;
const ZALO_WEBHOOK_DRAIN_INTERVAL_MS = 500;
const ZALO_WEBHOOK_MAX_CONCURRENT_DELIVERIES = 8;
const ZaloWebhookPayloadError = createChannelIngressError("ZaloWebhookPayloadError");
function parseRawRecord(rawEvent) {
	let parsed;
	try {
		parsed = JSON.parse(rawEvent);
	} catch (error) {
		throw new ZaloWebhookPayloadError("Zalo webhook body contains invalid JSON.", { cause: error });
	}
	const envelope = webhookEnvelopeSchema.safeParse(parsed);
	if (!envelope.success) throw new ZaloWebhookPayloadError("Zalo webhook body must be a JSON object.");
	return envelope.data;
}
function inspectZaloWebhookEvent(rawEvent) {
	const update = parseRawRecord(rawEvent);
	const admission = webhookAdmissionSchema.safeParse(update);
	if (!admission.success) {
		if (admission.error.issues.some((issue) => issue.path[0] === "message" && (issue.path.length === 1 || issue.path[1] === "message_id"))) throw new ZaloWebhookPayloadError("Zalo webhook message is missing message.message_id.");
		if (admission.error.issues.some((issue) => issue.path[0] === "message" && issue.path[1] === "chat")) throw new ZaloWebhookPayloadError("Zalo webhook message is missing message.chat.id.");
		throw new ZaloWebhookPayloadError("Zalo webhook message is missing message.message_id.");
	}
	return {
		eventId: admission.data.message.message_id,
		laneKey: `chat:${admission.data.message.chat.id}`,
		update
	};
}
function parseClaimedUpdate(rawEvent) {
	const parsed = webhookUpdateSchema.safeParse(parseRawRecord(rawEvent));
	if (!parsed.success) {
		const paths = parsed.error.issues.map((issue) => issue.path.join("."));
		if (paths.some((path) => path === "event_name")) throw new ZaloWebhookPayloadError("Zalo webhook event_name is unsupported.");
		if (paths.some((path) => path === "message.from" || path.startsWith("message.from.id"))) throw new ZaloWebhookPayloadError("Zalo webhook message is missing message.from.id.");
		if (paths.some((path) => path === "message.chat" || path.startsWith("message.chat.id"))) throw new ZaloWebhookPayloadError("Zalo webhook message is missing message.chat.id.");
		if (paths.some((path) => path.startsWith("message.chat.chat_type"))) throw new ZaloWebhookPayloadError("Zalo webhook message has an invalid chat type.");
		if (paths.some((path) => path.startsWith("message.date"))) throw new ZaloWebhookPayloadError("Zalo webhook message has an invalid date.");
		if (paths.some((path) => path.startsWith("message.text"))) throw new ZaloWebhookPayloadError("Zalo text event is missing message.text.");
		throw new ZaloWebhookPayloadError("Zalo webhook event_name is unsupported.");
	}
	return parsed.data;
}
function isZaloAuthenticationFailure(error) {
	for (const current of collectErrorGraphCandidates(error, (candidate) => [candidate.cause])) {
		const candidate = asOptionalObjectRecord(current);
		if (!candidate) continue;
		if (candidate instanceof ZaloApiError && (candidate.errorCode === 401 || candidate.errorCode === 403) || candidate.status === 401 || candidate.status === 403 || candidate.statusCode === 401 || candidate.statusCode === 403) return true;
	}
	return false;
}
function createZaloWebhookIngress(options) {
	const queue = getZaloRuntime().state.openChannelIngressQueue({ accountId: options.accountId });
	const monitor = createChannelIngressMonitor({
		queue,
		inspect: (rawEvent) => inspectZaloWebhookEvent(rawEvent),
		payload: {
			storage: "raw-event",
			version: ZALO_WEBHOOK_SPOOL_VERSION,
			serialize: (rawEvent) => rawEvent,
			deserialize: (rawEvent) => rawEvent,
			createClaimError: (kind) => new ZaloWebhookPayloadError(kind === "invalid-version" ? "Zalo webhook spool payload is invalid." : "Zalo webhook identity changed after durable admission.")
		},
		deliver: async (rawEvent, lifecycle) => {
			const update = parseClaimedUpdate(rawEvent);
			await options.deliver(update, bindIngressLifecycleToReplyOptions(lifecycle).turnAdoptionLifecycle);
		},
		pollIntervalMs: ZALO_WEBHOOK_DRAIN_INTERVAL_MS,
		retention: { failedMaxEntries: 5e3 },
		waitForDeliveryIdleBeforeRepump: false,
		runPumpTask: runDetachedWebhookWork,
		deferredClaims: "wait-on-stop",
		drain: {
			adoptionStallTimeoutMs: DEFAULT_INGRESS_ADOPTION_STALL_MS,
			startLimit: ZALO_WEBHOOK_MAX_CONCURRENT_DELIVERIES,
			retryPolicy: {
				maxAttempts: DEFAULT_INGRESS_RETRY_MAX_ATTEMPTS,
				deadLetterMinAgeMs: 0
			},
			resolveNonRetryableFailure: (error) => {
				if (error instanceof ZaloWebhookPayloadError) return {
					reason: "invalid-event",
					message: error.message
				};
				if (isZaloAuthenticationFailure(error)) return {
					reason: "authentication-failed",
					message: formatErrorMessage(error)
				};
				return null;
			},
			onLog: (message) => options.runtime.error?.(`zalo ingress: ${message}`)
		},
		createStoppedError: () => /* @__PURE__ */ new Error("Zalo ingress stopped."),
		onError: (error) => options.runtime.error?.(`zalo ingress drain failed: ${formatErrorMessage(error)}`)
	});
	return {
		accept: async (rawEvent) => {
			await monitor.admit(rawEvent);
		},
		start: monitor.start,
		stop: monitor.stop
	};
}
const zaloWebhookIngressRuntime = { createZaloWebhookIngress };
export { ZaloWebhookPayloadError, zaloWebhookIngressRuntime };
