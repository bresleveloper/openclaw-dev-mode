import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
import { r as createLazyRuntimeModule } from "./lazy-runtime-CJrzFzqU.mjs";
import { t as isDeliverableMessageChannel } from "./message-channel-normalize-CsnAJK7x.mjs";
import "./message-channel-DmAdWHmL.mjs";
import { i as logVerbose, o as shouldLogVerbose } from "./globals-XVSoVbNQ.mjs";
import { createHash } from "node:crypto";
//#region src/media-understanding/echo-transcript.ts
const loadMessageRuntime = createLazyRuntimeModule(() => import("./runtime-Csbs5mx8.mjs"));
/** Default operator-visible transcript echo format for preflight audio transcription. */
const DEFAULT_ECHO_TRANSCRIPT_FORMAT = "📝 \"{transcript}\"";
const TELEGRAM_TRANSCRIPT_ECHO_INTENT_PREFIX = "transcript-echo:v1:";
const TELEGRAM_TRANSCRIPT_ECHO_COMPLETION_RETENTION = {
	idPrefix: TELEGRAM_TRANSCRIPT_ECHO_INTENT_PREFIX,
	maxAgeMs: 864e5,
	maxEntries: 2e3
};
function buildTelegramTranscriptEchoIntentId(params) {
	const accountId = params.accountId?.trim();
	const chatId = params.to.trim().replace(/^telegram:/iu, "").replace(/^(?:group|user):/iu, "").replace(/:(?:direct-)?topic:[^:]+$/iu, "").trim().toLowerCase();
	const messageSid = params.messageSid?.trim();
	if (!accountId || !chatId || /\s/u.test(chatId) || !messageSid) return;
	const identity = JSON.stringify([
		accountId,
		chatId,
		messageSid
	]);
	const digest = createHash("sha256").update(identity).digest("hex");
	return `${TELEGRAM_TRANSCRIPT_ECHO_INTENT_PREFIX}${digest}`;
}
function formatEchoTranscript(transcript, format) {
	return format.replace("{transcript}", () => transcript);
}
/** Sends a transcript echo back to the originating deliverable chat. */
async function sendTranscriptEcho(params) {
	const { ctx, cfg, transcript } = params;
	const channel = ctx.Provider ?? ctx.Surface ?? "";
	const to = ctx.OriginatingTo ?? ctx.From ?? "";
	if (!channel || !to) {
		if (shouldLogVerbose()) logVerbose("media: echo-transcript skipped (no channel/to resolved from ctx)");
		return;
	}
	const normalizedChannel = normalizeLowercaseStringOrEmpty(channel);
	if (!isDeliverableMessageChannel(normalizedChannel)) {
		if (shouldLogVerbose()) logVerbose(`media: echo-transcript skipped (channel "${normalizedChannel}" is not deliverable)`);
		return;
	}
	const text = formatEchoTranscript(transcript, params.format ?? "📝 \"{transcript}\"");
	const deliveryIntentId = normalizedChannel === "telegram" ? buildTelegramTranscriptEchoIntentId({
		accountId: ctx.AccountId,
		to,
		messageSid: ctx.MessageSid
	}) : void 0;
	try {
		const { sendDurableMessageBatchCore } = await loadMessageRuntime();
		const send = await sendDurableMessageBatchCore({
			cfg,
			channel: normalizedChannel,
			to,
			accountId: ctx.AccountId ?? void 0,
			threadId: ctx.MessageThreadId ?? void 0,
			payloads: [{ text }],
			bestEffort: !deliveryIntentId,
			durability: deliveryIntentId ? "required" : "best_effort",
			...deliveryIntentId ? {
				deliveryIntentId,
				completionRetention: TELEGRAM_TRANSCRIPT_ECHO_COMPLETION_RETENTION
			} : {}
		});
		if (send.status === "failed") throw send.error;
		if ((params.logSuccess ?? true) && shouldLogVerbose()) logVerbose(`media: echo-transcript sent to ${normalizedChannel}/${to}`);
	} catch (err) {
		const prefix = params.failureLogPrefix ?? "media: echo-transcript delivery failed";
		logVerbose(`${prefix}: ${String(err)}`);
	}
}
//#endregion
export { sendTranscriptEcho as n, DEFAULT_ECHO_TRANSCRIPT_FORMAT as t };
