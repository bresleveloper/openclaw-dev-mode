import { c as normalizeOptionalLowercaseString, l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { n as normalizeAccountId } from "./account-id-DbRsdayc.mjs";
import { a as isInternalMessageChannel } from "./message-channel-j-k-Nup3.mjs";
import { createHash } from "node:crypto";
//#region src/auto-reply/reply/source-turn-id.ts
const CHANNEL_SOURCE_TURN_ID_PREFIX = "channel-user:v1:";
const CHANNEL_SOURCE_TURN_ID = Symbol.for("openclaw.channelSourceTurnId");
const CHANNEL_SOURCE_TURN_SAME_THREAD_REQUIRED = Symbol.for("openclaw.channelSourceTurnSameThreadRequired");
/**
* Internal-origin turns (gateway chat.send stamps the internal channel as the
* ingress provider) carry run ids, not provider message ids. Minting a channel
* source-turn id from them breaks the run-keyed user-turn admission guard;
* gateway turns own restart via fingerprint admission and client retries.
*/
function shouldMintChannelSourceTurnId(ingressProvider) {
	return !isInternalMessageChannel(ingressProvider);
}
/** Preserve the admitted input identity when a queued or recovered turn gets a new run ID. */
function resolveReplySourceTurnId(params) {
	const sourceTurnId = normalizeOptionalString(params.sourceTurnId);
	if (sourceTurnId) return sourceTurnId;
	const admissionRunId = normalizeOptionalString(params.admissionRunId);
	if (!admissionRunId || !isInternalMessageChannel(params.ingressProvider)) return;
	return params.entry?.restartRecoveryDeliveryRunId === admissionRunId ? normalizeOptionalString(params.entry.restartRecoveryDeliverySourceRunId) ?? admissionRunId : admissionRunId;
}
/**
* Identifies one inbound channel turn across shared sessions.
* Provider message ids are not globally unique, so route scope is mandatory.
*/
function buildChannelSourceTurnId(params) {
	const provider = normalizeOptionalLowercaseString(params.provider);
	const conversationId = normalizeOptionalString(params.conversationId);
	const messageId = normalizeOptionalString(typeof params.messageId === "number" ? String(params.messageId) : params.messageId);
	if (!provider || !conversationId || !messageId) return;
	const digest = createHash("sha256").update(JSON.stringify([
		provider,
		normalizeAccountId(params.accountId),
		conversationId,
		messageId
	])).digest("hex");
	return `${CHANNEL_SOURCE_TURN_ID_PREFIX}${digest}`;
}
/** Carries host-only source identity through internal context clones without public type drift. */
function setChannelSourceTurnId(context, sourceTurnId) {
	const scoped = context;
	if (sourceTurnId) scoped[CHANNEL_SOURCE_TURN_ID] = sourceTurnId;
	else delete scoped[CHANNEL_SOURCE_TURN_ID];
}
function readChannelSourceTurnId(context) {
	return context[CHANNEL_SOURCE_TURN_ID];
}
/** Carries the original channel adapter's narrowed message-action scope privately. */
function setChannelSourceTurnSameThreadRequired(context, sameThreadRequired) {
	const scoped = context;
	if (sameThreadRequired === true) scoped[CHANNEL_SOURCE_TURN_SAME_THREAD_REQUIRED] = true;
	else delete scoped[CHANNEL_SOURCE_TURN_SAME_THREAD_REQUIRED];
}
function readChannelSourceTurnSameThreadRequired(context) {
	return context[CHANNEL_SOURCE_TURN_SAME_THREAD_REQUIRED] === true;
}
//#endregion
export { setChannelSourceTurnId as a, resolveReplySourceTurnId as i, readChannelSourceTurnId as n, setChannelSourceTurnSameThreadRequired as o, readChannelSourceTurnSameThreadRequired as r, shouldMintChannelSourceTurnId as s, buildChannelSourceTurnId as t };
