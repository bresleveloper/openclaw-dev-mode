import { c as normalizeOptionalLowercaseString, l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { n as normalizeAccountId } from "./account-id-B1bfbA5J.mjs";
import { a as isInternalMessageChannel } from "./message-channel-DDcHHhpX.mjs";
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
export { setChannelSourceTurnSameThreadRequired as a, setChannelSourceTurnId as i, readChannelSourceTurnId as n, shouldMintChannelSourceTurnId as o, readChannelSourceTurnSameThreadRequired as r, buildChannelSourceTurnId as t };
