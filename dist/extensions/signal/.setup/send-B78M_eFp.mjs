import { i as resolveSignalAccount } from "./accounts-BV6tDOTc.mjs";
import { n as normalizeSignalMessagingTarget } from "./normalize-l_b99hap.mjs";
import { d as markdownToSignalText, n as registerSignalReplyContext } from "./transport-detection-CoiRl7Gx.mjs";
import { n as signalRpcRequest } from "./client-adapter-dvFa47YL.mjs";
import { t as resolveSignalRpcContext } from "./rpc-context-CwwADZ1b.mjs";
import { createMessageReceiptFromOutboundResults } from "openclaw/plugin-sdk/channel-outbound";
import { resolveMarkdownTableMode } from "openclaw/plugin-sdk/markdown-table-runtime";
import { normalizeLowercaseStringOrEmpty, normalizeOptionalString } from "openclaw/plugin-sdk/string-coerce-runtime";
import { kindFromMime, resolveOutboundAttachmentFromUrl } from "openclaw/plugin-sdk/media-runtime";
import { requireRuntimeConfig } from "openclaw/plugin-sdk/plugin-config-runtime";
//#region extensions/signal/src/send.ts
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
async function resolveSignalRpcAccountInfo(opts) {
	if (!opts.cfg) throw new Error("Signal RPC account resolution requires a resolved runtime config. Load and resolve config at the command or gateway boundary, then pass cfg through the runtime path.");
	const cfg = requireRuntimeConfig(opts.cfg, "Signal RPC account resolution");
	return resolveSignalAccount({
		cfg,
		accountId: opts.accountId
	});
}
function parseTarget(raw) {
	const value = normalizeSignalMessagingTarget(raw);
	if (!value) throw new Error("Signal recipient is required");
	const normalized = normalizeLowercaseStringOrEmpty(value);
	if (normalized.startsWith("group:")) return {
		type: "group",
		groupId: value.slice(6).trim()
	};
	if (normalized.startsWith("username:")) return {
		type: "username",
		username: value.slice(9).trim()
	};
	return {
		type: "recipient",
		recipient: value
	};
}
function buildTargetParams(target, allow) {
	if (target.type === "recipient") {
		if (!allow.recipient) return null;
		return { recipient: [target.recipient] };
	}
	if (target.type === "group") {
		if (!allow.group) return null;
		return { groupId: target.groupId };
	}
	if (target.type === "username") {
		if (!allow.username) return null;
		return { username: [target.username] };
	}
	return null;
}
function createSignalSendReceipt(params) {
	const messageId = params.messageId.trim();
	const results = messageId && messageId !== "unknown" ? [{
		channel: "signal",
		messageId,
		meta: {
			targetType: params.target.type,
			...params.replyToId ? {
				replyToId: params.replyToId,
				nativeReplyStatus: params.nativeReplyStatus ?? "sent"
			} : {}
		}
	}] : [];
	if (results[0]) {
		if (params.timestamp != null) results[0].timestamp = params.timestamp;
		if (params.target.type === "group") results[0].chatId = params.target.groupId;
		else if (params.target.type === "recipient") results[0].toJid = params.target.recipient;
		else results[0].toJid = params.target.username;
	}
	return createMessageReceiptFromOutboundResults({
		results,
		kind: params.kind,
		...params.replyToId ? { replyToId: params.replyToId } : {}
	});
}
function parseSignalReplyTimestamp(raw) {
	const value = normalizeOptionalString(raw);
	if (!value || !/^\d+$/.test(value)) return;
	const timestamp = Number(value);
	if (!Number.isSafeInteger(timestamp) || timestamp <= 0) return;
	return timestamp;
}
function resolveSignalQuoteParams(opts) {
	const timestamp = parseSignalReplyTimestamp(opts.replyToId);
	const author = normalizeOptionalString(opts.replyToAuthor);
	if (timestamp === void 0 || !author) return;
	return {
		replyToId: String(timestamp),
		params: {
			quoteTimestamp: timestamp,
			quoteAuthor: author,
			quoteMessage: opts.replyToBody ?? ""
		}
	};
}
function isSignalQuoteMetadataRejection(error) {
	const message = error instanceof Error ? error.message : String(error);
	const normalized = normalizeLowercaseStringOrEmpty(message);
	const rpcCode = /^signal rpc (-?\d+):/u.exec(normalized)?.[1];
	if (rpcCode !== void 0) {
		if (rpcCode !== "-32602") return false;
	} else {
		const restStatusText = /^signal rest (\d{3}):/u.exec(normalized)?.[1];
		if (!restStatusText) return false;
		const restStatus = Number(restStatusText);
		if (restStatus < 400 || restStatus >= 500 || restStatus === 408 || restStatus === 429) return false;
	}
	if (!normalized.includes("quote")) return false;
	return normalized.includes("reject") || normalized.includes("invalid") || normalized.includes("unrecognized") || normalized.includes("unsupported") || normalized.includes("not found") || normalized.includes("no such") || normalized.includes("unknown");
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
	let message = text ?? "";
	let outboundMedia;
	let textStyles = [];
	const textMode = opts.textMode ?? "markdown";
	const maxBytes = (() => {
		if (typeof opts.maxBytes === "number") return opts.maxBytes;
		if (typeof accountInfo.config.mediaMaxMb === "number") return accountInfo.config.mediaMaxMb * 1024 * 1024;
		if (typeof cfg.agents?.defaults?.mediaMaxMb === "number") return cfg.agents.defaults.mediaMaxMb * 1024 * 1024;
		return 8388608;
	})();
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
	const targetParams = buildTargetParams(target, {
		recipient: true,
		group: true,
		username: true
	});
	if (!targetParams) throw new Error("Signal recipient is required");
	Object.assign(params, targetParams);
	const quote = resolveSignalQuoteParams(opts);
	const sendOpts = {
		baseUrl,
		timeoutMs: opts.timeoutMs,
		transportKind: opts.transportKind ?? accountInfo.transport.kind,
		maxAttachmentBytes: maxBytes,
		assertDirectAdapterHandoff: opts.assertDirectAdapterHandoff
	};
	let nativeReplyStatus;
	let result;
	if (quote) try {
		result = await signalRpcRequest("send", {
			...params,
			...quote.params
		}, sendOpts);
		nativeReplyStatus = "sent";
	} catch (error) {
		if (!isSignalQuoteMetadataRejection(error)) throw error;
		result = await signalRpcRequest("send", params, sendOpts);
		nativeReplyStatus = "fallback";
	}
	else result = await signalRpcRequest("send", params, sendOpts);
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
	return {
		messageId,
		timestamp,
		receipt: createSignalSendReceipt({
			messageId,
			target,
			kind: attachments && attachments.length > 0 ? "media" : "text",
			...quote ? {
				replyToId: quote.replyToId,
				nativeReplyStatus
			} : {},
			...timestamp != null ? { timestamp } : {}
		})
	};
}
async function sendTypingSignal(to, opts) {
	const accountInfo = await resolveSignalRpcAccountInfo(opts);
	const { baseUrl, account } = resolveSignalRpcContext(opts, accountInfo);
	const targetParams = buildTargetParams(parseTarget(to), {
		recipient: true,
		group: true
	});
	if (!targetParams) return false;
	const params = { ...targetParams };
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
	const accountInfo = await resolveSignalRpcAccountInfo(opts);
	const { baseUrl, account } = resolveSignalRpcContext(opts, accountInfo);
	const targetParams = buildTargetParams(parseTarget(to), { recipient: true });
	if (!targetParams) return false;
	const params = {
		...targetParams,
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
//#endregion
export { sendReadReceiptSignal as n, sendTypingSignal as r, sendMessageSignal as t };
