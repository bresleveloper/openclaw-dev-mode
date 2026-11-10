import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import "./session-key-CSDERtm3.mjs";
import { n as normalizeAccountId } from "./account-id-ifCOO7_9.mjs";
import { n as normalizeMessageChannel } from "./message-channel-core-BBQx3_oI.mjs";
import { t as isDeliverableMessageChannel } from "./message-channel-normalize-CsnAJK7x.mjs";
import "./message-channel-DmAdWHmL.mjs";
//#region src/cli/message-secret-scope.ts
function resolveScopedChannelCandidate(value) {
	if (typeof value !== "string") return;
	const normalized = normalizeMessageChannel(value);
	if (!normalized || !isDeliverableMessageChannel(normalized)) return;
	return normalized;
}
function resolveChannelFromTargetValue(target) {
	const trimmed = normalizeOptionalString(target);
	if (!trimmed) return;
	const separator = trimmed.indexOf(":");
	if (separator <= 0) return;
	return resolveScopedChannelCandidate(trimmed.slice(0, separator));
}
function resolveChannelFromTargets(targets) {
	if (!Array.isArray(targets)) return;
	const channels = new Set(targets.map(resolveChannelFromTargetValue).filter((channel) => channel !== void 0));
	return channels.size === 1 ? [...channels][0] : void 0;
}
function resolveScopedAccountId(value) {
	const trimmed = normalizeOptionalString(value);
	if (!trimmed) return;
	return normalizeAccountId(trimmed);
}
function resolveMessageSecretScope(params) {
	const channel = resolveScopedChannelCandidate(params.channel) ?? resolveChannelFromTargetValue(params.target) ?? resolveChannelFromTargets(params.targets) ?? resolveScopedChannelCandidate(params.fallbackChannel);
	const accountId = resolveScopedAccountId(params.accountId) ?? resolveScopedAccountId(params.fallbackAccountId ?? void 0);
	return {
		...channel ? { channel } : {},
		...accountId ? { accountId } : {}
	};
}
//#endregion
export { resolveMessageSecretScope as t };
