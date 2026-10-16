import { i as resolveSignalAccount } from "./accounts-DMtj2E-4.mjs";
import { r as normalizeSignalReactionRecipient } from "./normalize-D7kSomXt.mjs";
import { n as signalRpcRequest } from "./client-adapter-c_O1ouxZ.mjs";
import { t as resolveSignalRpcContext } from "./rpc-context-BAXcX7dI.mjs";
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
async function sendReactionSignal(recipient, targetTimestamp, emoji, opts) {
	return await sendReactionSignalCore({
		recipient,
		targetTimestamp,
		emoji,
		remove: false,
		opts
	});
}
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
