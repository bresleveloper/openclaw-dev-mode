import { i as resolveSignalAccount } from "./accounts-BV6tDOTc.mjs";
import { r as normalizeSignalReactionRecipient } from "./normalize-l_b99hap.mjs";
import { n as signalRpcRequest } from "./client-adapter-dvFa47YL.mjs";
import { t as resolveSignalRpcContext } from "./rpc-context-CwwADZ1b.mjs";
import { requireRuntimeConfig } from "openclaw/plugin-sdk/plugin-config-runtime";
//#region extensions/signal/src/send-reactions.ts
async function sendReactionSignalCore(params) {
	const cfg = requireRuntimeConfig(params.opts.cfg, "Signal reactions");
	const accountInfo = resolveSignalAccount({
		cfg,
		accountId: params.opts.accountId
	});
	const { baseUrl, account } = resolveSignalRpcContext(params.opts, accountInfo);
	const normalizedRecipient = normalizeSignalReactionRecipient(params.recipient);
	const groupId = params.opts.groupId?.trim();
	const operation = `Signal reaction${params.remove ? " removal" : ""}`;
	if (!normalizedRecipient && !groupId) throw new Error(`Recipient or groupId is required for ${operation}`);
	if (!Number.isFinite(params.targetTimestamp) || params.targetTimestamp <= 0) throw new Error(`Valid targetTimestamp is required for ${operation}`);
	const normalizedEmoji = params.emoji?.trim();
	if (!normalizedEmoji) throw new Error(`Emoji is required for ${operation}`);
	const targetAuthor = [
		params.opts.targetAuthor,
		params.opts.targetAuthorUuid,
		normalizedRecipient
	].map((candidate) => normalizeSignalReactionRecipient(candidate ?? "")).find(Boolean);
	if (groupId && !targetAuthor) throw new Error(`targetAuthor is required for group reaction${params.remove ? " removal" : "s"}`);
	const requestParams = {
		emoji: normalizedEmoji,
		targetTimestamp: params.targetTimestamp,
		...params.remove ? { remove: true } : {},
		...targetAuthor ? { targetAuthor } : {}
	};
	if (normalizedRecipient) requestParams.recipients = [normalizedRecipient];
	if (groupId) requestParams.groupIds = [groupId];
	if (account) requestParams.account = account;
	return {
		ok: true,
		timestamp: (await signalRpcRequest("sendReaction", requestParams, {
			baseUrl,
			timeoutMs: params.opts.timeoutMs,
			transportKind: params.opts.transportKind ?? accountInfo.transport.kind,
			assertDirectAdapterHandoff: params.opts.assertDirectAdapterHandoff
		}))?.timestamp
	};
}
/**
* Send a Signal reaction to a message
* @param recipient - UUID or E.164 phone number of the message author
* @param targetTimestamp - Message ID (timestamp) to react to
* @param emoji - Emoji to react with
* @param opts - Optional account/connection overrides
*/
async function sendReactionSignal(recipient, targetTimestamp, emoji, opts) {
	return await sendReactionSignalCore({
		recipient,
		targetTimestamp,
		emoji,
		remove: false,
		opts
	});
}
/**
* Remove a Signal reaction from a message
* @param recipient - UUID or E.164 phone number of the message author
* @param targetTimestamp - Message ID (timestamp) to remove reaction from
* @param emoji - Emoji to remove
* @param opts - Optional account/connection overrides
*/
async function removeReactionSignal(recipient, targetTimestamp, emoji, opts) {
	return await sendReactionSignalCore({
		recipient,
		targetTimestamp,
		emoji,
		remove: true,
		opts
	});
}
//#endregion
export { sendReactionSignal as n, removeReactionSignal as t };
