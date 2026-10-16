import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
import { D as resolveExpiresAtMsFromDurationMs, g as isFutureDateTimestampMs } from "./number-coercion-CuVhdCBs.mjs";
import { r as resolveGlobalMap } from "./global-singleton-0m-JziJW.mjs";
import { t as pruneMapToMaxSize } from "./map-size-BlrH_CnE.mjs";
import { n as normalizeAccountId } from "./account-id-DbRsdayc.mjs";
//#region src/channels/message/outbound-echo-state.ts
const outboundMessageIdentities = resolveGlobalMap(Symbol.for("openclaw.outboundMessageIdentities"));
//#endregion
//#region src/channels/message/outbound-echo.ts
const OUTBOUND_ECHO_WINDOW_MS = 3e4;
function resolveIdentityKeys(identity) {
	const channel = normalizeLowercaseStringOrEmpty(identity.channel);
	const conversationId = identity.conversationId.trim();
	if (!channel || !conversationId) return [];
	const scope = [
		channel,
		normalizeAccountId(identity.accountId),
		conversationId
	];
	const keys = [];
	const messageId = identity.messageId?.trim();
	if (messageId) keys.push(JSON.stringify([
		...scope,
		"message",
		messageId
	]));
	const sourceId = identity.sourceId?.trim();
	if (sourceId) keys.push(JSON.stringify([
		...scope,
		"source",
		sourceId
	]));
	return keys;
}
function pruneExpiredEntries(nowMs) {
	for (const [key, expiresAt] of outboundMessageIdentities) {
		if (isFutureDateTimestampMs(expiresAt, { nowMs })) return;
		outboundMessageIdentities.delete(key);
	}
}
/** Records a platform message id emitted by a channel's own outbound send path. */
function recordOutboundMessageIdentity(identity) {
	const keys = resolveIdentityKeys(identity);
	if (keys.length === 0) return;
	const nowMs = Date.now();
	const expiresAt = resolveExpiresAtMsFromDurationMs(OUTBOUND_ECHO_WINDOW_MS, { nowMs });
	if (expiresAt === void 0) {
		for (const key of keys) outboundMessageIdentities.delete(key);
		return;
	}
	pruneExpiredEntries(nowMs);
	for (const key of keys) {
		outboundMessageIdentities.delete(key);
		pruneMapToMaxSize(outboundMessageIdentities, 9999);
		outboundMessageIdentities.set(key, expiresAt);
	}
}
/** Returns whether an inbound platform message matches a recently emitted outbound id. */
function isRecentOutboundMessageIdentity(identity) {
	for (const key of resolveIdentityKeys(identity)) {
		const expiresAt = outboundMessageIdentities.get(key);
		if (expiresAt === void 0) continue;
		if (!isFutureDateTimestampMs(expiresAt)) {
			outboundMessageIdentities.delete(key);
			continue;
		}
		return true;
	}
	return false;
}
//#endregion
export { recordOutboundMessageIdentity as n, isRecentOutboundMessageIdentity as t };
