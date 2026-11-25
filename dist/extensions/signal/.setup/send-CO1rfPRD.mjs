import { o as __exportAll } from "./doctor-contract-api-TiY2vogm.mjs";
import { i as resolveSignalAccount } from "./accounts-CUmmZ1Pr.mjs";
import { d as normalizeSignalMessagingTarget } from "./identity-B6ABNWe_.mjs";
import { S as resolveSignalRpcContext, g as registerSignalReplyContext, k as markdownToSignalText, w as signalRpcRequest } from "./channel-BIbSVvro.mjs";
import { o as isSignalQuoteMetadataRejection } from "./client-CCkdkM_-.mjs";
import { createMessageReceiptFromOutboundResults } from "openclaw/plugin-sdk/channel-outbound";
import { resolveMarkdownTableMode } from "openclaw/plugin-sdk/markdown-table-runtime";
import { asPositiveSafeInteger, normalizeLowercaseStringOrEmpty, normalizeOptionalString } from "openclaw/plugin-sdk/string-coerce-runtime";
import { kindFromMime, resolveOutboundAttachmentFromUrl } from "openclaw/plugin-sdk/media-runtime";
import { requireRuntimeConfig } from "openclaw/plugin-sdk/plugin-config-runtime";
// extensions/signal/src/send.ts
var send_exports = /* @__PURE__ */ __exportAll({
	sendMessageSignal: () => sendMessageSignal,
	sendReadReceiptSignal: () => sendReadReceiptSignal,
	sendTypingSignal: () => sendTypingSignal
});
function assertSignalRecipientDelivery(result, target) {
	if (!Array.isArray(result?.results)) return;
	const failures = [];
	let hasSuccessfulRecipient = false;
	for (const entry of result.results) {
		if (!entry || typeof entry !== "object" || Array.isArray(entry)) continue;
		const record = entry;
		const type = normalizeOptionalString(record.type);
		if (type && normalizeLowercaseStringOrEmpty(type) !== "success" || record.success === false) {
			failures.push(type ?? normalizeOptionalString(record.error) ?? normalizeOptionalString(record.message) ?? "recipient delivery failed");
			continue;
		}
		if (normalizeLowercaseStringOrEmpty(type) === "success" || record.success === true) hasSuccessfulRecipient = true;
	}
	if (failures.length === 0 || target.type === "group" && hasSuccessfulRecipient) return;
	throw new Error(`Signal send failed for ${failures.length} recipient${failures.length === 1 ? "" : "s"}: ${[...new Set(failures)].join(", ")}`);
}
function resolveSignalRpcAccountInfo(opts) {
	const cfg = requireRuntimeConfig(opts.cfg, "Signal RPC account resolution");
	return resolveSignalAccount({
		cfg,
		accountId: opts.accountId
	});
}
function parseTarget(raw) {
	const value = normalizeSignalMessagingTarget(raw);
	if (!value) throw new Error("Signal recipient is required");
	if (value.startsWith("group:")) return {
		type: "group",
		groupId: value.slice(6)
	};
	if (value.startsWith("username:")) return {
		type: "username",
		username: value.slice(9)
	};
	return {
		type: "recipient",
		recipient: value
	};
}
function buildTargetParams(target) {
	if (target.type === "recipient") return { recipient: [target.recipient] };
	if (target.type === "group") return { groupId: target.groupId };
	return { username: [target.username] };
}
function resolveSignalMediaSendTimeoutMs(maxBytes) {
	return 3e4 + Math.ceil(maxBytes / 262144) * 1e3;
}
async function sendMessageSignal(to, text, opts) {
	const cfg = requireRuntimeConfig(opts.cfg, "Signal send");
	const accountInfo = resolveSignalAccount({
		cfg,
		accountId: opts.accountId
	});
	const { baseUrl, account } = resolveSignalRpcContext(opts, accountInfo);
	const target = parseTarget(to);
	const targetAuthor = normalizeOptionalString(account);
	const targetAuthorUuid = normalizeOptionalString(accountInfo.config.accountUuid);
	let message = text;
	let outboundMedia;
	let textStyles = [];
	const textMode = opts.textMode ?? "markdown";
	const maxBytes = opts.maxBytes ?? (accountInfo.config.mediaMaxMb ?? cfg.agents?.defaults?.mediaMaxMb ?? 8) * 1024 * 1024;
	let attachments;
	if (opts.mediaUrl?.trim()) {
		const resolved = await resolveOutboundAttachmentFromUrl(opts.mediaUrl.trim(), maxBytes, {
			mediaAccess: opts.mediaAccess,
			localRoots: opts.mediaLocalRoots,
			readFile: opts.mediaReadFile
		});
		attachments = [resolved.path];
		outboundMedia = {
			contentType: resolved.contentType,
			kind: kindFromMime(resolved.contentType ?? void 0) ?? "unknown"
		};
	}
	if (message.trim()) {
		if (textMode === "plain") textStyles = opts.textStyles ?? [];
		else {
			const tableMode = resolveMarkdownTableMode({
				cfg,
				channel: "signal",
				accountId: accountInfo.accountId
			});
			const formatted = markdownToSignalText(message, { tableMode });
			message = formatted.text;
			textStyles = formatted.styles;
		}
	}
	if (!message.trim() && (!attachments || attachments.length === 0)) throw new Error("Signal send requires text or media");
	const params = { message };
	if (textStyles.length > 0) params["text-style"] = textStyles.map((style) => `${style.start}:${style.length}:${style.style}`);
	if (account) params.account = account;
	if (attachments && attachments.length > 0) params.attachments = attachments;
	Object.assign(params, buildTargetParams(target));
	const rawReplyToId = normalizeOptionalString(opts.replyToId);
	const quoteTimestamp = rawReplyToId && /^\d+$/.test(rawReplyToId) ? asPositiveSafeInteger(Number(rawReplyToId)) : void 0;
	const quoteAuthor = normalizeOptionalString(opts.replyToAuthor);
	const quote = quoteTimestamp !== void 0 && quoteAuthor ? {
		replyToId: String(quoteTimestamp),
		params: {
			quoteTimestamp,
			quoteAuthor,
			quoteMessage: opts.replyToBody ?? ""
		}
	} : void 0;
	const sendOpts = {
		baseUrl,
		timeoutMs: opts.timeoutMs ?? (attachments?.length ? resolveSignalMediaSendTimeoutMs(maxBytes) : void 0),
		transportKind: opts.transportKind ?? accountInfo.transport.kind,
		maxAttachmentBytes: maxBytes,
		assertDirectAdapterHandoff: opts.assertDirectAdapterHandoff
	};
	let nativeReplyStatus;
	let result;
	try {
		result = await signalRpcRequest("send", quote ? {
			...params,
			...quote.params
		} : params, sendOpts);
		nativeReplyStatus = quote ? "sent" : void 0;
	} catch (error) {
		if (!quote || !isSignalQuoteMetadataRejection(error)) throw error;
		result = await signalRpcRequest("send", params, sendOpts);
		nativeReplyStatus = "fallback";
	}
	assertSignalRecipientDelivery(result, target);
	const timestamp = result?.timestamp;
	const messageId = timestamp ? String(timestamp) : "unknown";
	const replyAuthor = targetAuthor ?? targetAuthorUuid;
	if (timestamp && replyAuthor) await registerSignalReplyContext({
		accountId: accountInfo.accountId,
		to,
		replyToId: messageId,
		author: replyAuthor,
		body: message,
		media: outboundMedia ? [outboundMedia] : void 0,
		sourceTimestamp: timestamp
	});
	const receiptMessageId = messageId.trim();
	return {
		messageId,
		timestamp,
		receipt: createMessageReceiptFromOutboundResults({
			results: receiptMessageId && receiptMessageId !== "unknown" ? [{
				channel: "signal",
				messageId: receiptMessageId,
				...timestamp != null ? { timestamp } : {},
				...target.type === "group" ? { chatId: target.groupId } : { toJid: target.type === "recipient" ? target.recipient : target.username },
				meta: {
					targetType: target.type,
					...quote ? {
						replyToId: quote.replyToId,
						nativeReplyStatus: nativeReplyStatus ?? "sent"
					} : {}
				}
			}] : [],
			kind: attachments && attachments.length > 0 ? "media" : "text",
			...quote ? { replyToId: quote.replyToId } : {}
		})
	};
}
async function sendTypingSignal(to, opts) {
	const accountInfo = resolveSignalRpcAccountInfo(opts);
	const { baseUrl, account } = resolveSignalRpcContext(opts, accountInfo);
	const target = parseTarget(to);
	if (target.type === "username") return false;
	const params = buildTargetParams(target);
	if (account) params.account = account;
	if (opts.stop) params.stop = true;
	await signalRpcRequest("sendTyping", params, {
		baseUrl,
		timeoutMs: opts.timeoutMs,
		transportKind: opts.transportKind ?? accountInfo.transport.kind
	});
	return true;
}
async function sendReadReceiptSignal(to, targetTimestamp, opts) {
	if (!Number.isFinite(targetTimestamp) || targetTimestamp <= 0) return false;
	const accountInfo = resolveSignalRpcAccountInfo(opts);
	const { baseUrl, account } = resolveSignalRpcContext(opts, accountInfo);
	const target = parseTarget(to);
	if (target.type !== "recipient") return false;
	const params = {
		...buildTargetParams(target),
		targetTimestamp,
		type: opts.type ?? "read"
	};
	if (account) params.account = account;
	await signalRpcRequest("sendReceipt", params, {
		baseUrl,
		timeoutMs: opts.timeoutMs,
		transportKind: opts.transportKind ?? accountInfo.transport.kind
	});
	return true;
}
export { send_exports as i, sendReadReceiptSignal as n, sendTypingSignal as r, sendMessageSignal as t };
