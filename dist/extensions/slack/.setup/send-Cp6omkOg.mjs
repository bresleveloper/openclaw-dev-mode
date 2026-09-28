import { o as resolveSlackAccount, u as resolveSlackOperationToken } from "./accounts-BBHvg0pY.mjs";
import { D as SLACK_MESSAGE_TEXT_HARD_LIMIT, E as SLACK_EDIT_TEXT_MAX_BYTES, J as markdownToSlackMrkdwnChunks, K as resolveSlackQuestionActionIds, M as truncateSlackTextByUtf8Bytes, O as SLACK_MESSAGE_TEXT_RECOMMENDED_LIMIT, R as SLACK_QUESTION_FINALIZATION_BLOCKS, S as stripSlackNativeDataBlocks, T as renderSlackBlockFallbackText, _ as createSlackNativeDataBaseTextConsumer, f as assertSlackDetachedTargetAllowed, g as buildSlackNativeDataAccessibilityText, h as appendSlackNativeDataPlainTextFallback, j as truncateSlackText, k as SLACK_TEXT_LIMIT, lt as validateSlackBlocksArray, q as chunkSlackMrkdwnText, v as hasSlackNativeDataBlock, w as buildSlackCompleteBlocksFallbackText, y as isSlackInvalidBlocksError } from "./session-status-Cf7AvWOt.mjs";
import { a as parseSlackTarget, t as canonicalizeSlackApiTargetId } from "./target-parsing-DEsPjngB.mjs";
import { f as createSlackTokenCacheKey, g as getSlackWriteClient, m as createSlackWriteClient, o as formatSlackError, u as createSlackReadClient } from "./probe-DiYIMPJo.mjs";
import { r as resolveSlackThreadTsValue, t as normalizeSlackThreadTsCandidate } from "./thread-ts-CukseRVL.mjs";
import { t as getOptionalSlackRuntime } from "./runtime-JSVZSWAj.mjs";
import { isRecord, normalizeLowercaseStringOrEmpty, normalizeOptionalString, normalizeTrimmedStringList } from "openclaw/plugin-sdk/string-coerce-runtime";
import { createMessageReceiptFromOutboundResults } from "openclaw/plugin-sdk/channel-outbound";
import { logVerbose, sleepWithAbort } from "openclaw/plugin-sdk/runtime-env";
import { chunkTextForOutbound } from "openclaw/plugin-sdk/text-chunking";
import { resolveGlobalSingleton } from "openclaw/plugin-sdk/global-singleton";
import { resolveMarkdownTableMode } from "openclaw/plugin-sdk/markdown-table-runtime";
import { resolveTextChunksWithFallback } from "openclaw/plugin-sdk/reply-payload";
import { createHash, createHmac } from "node:crypto";
import { withTrustedEnvProxyGuardedFetchMode } from "openclaw/plugin-sdk/fetch-runtime";
import { retryAsync } from "openclaw/plugin-sdk/retry-runtime";
import { requireRuntimeConfig } from "openclaw/plugin-sdk/plugin-config-runtime";
import { PlatformMessageNotDispatchedError, extractErrorCode, readErrorName } from "openclaw/plugin-sdk/error-runtime";
import { KeyedAsyncQueue } from "openclaw/plugin-sdk/keyed-async-queue";
import { chunkMarkdownTextWithMode, resolveChunkMode, resolveTextChunkLimit } from "openclaw/plugin-sdk/reply-chunking";
import { safeEqualSecret } from "openclaw/plugin-sdk/security-runtime";
import { bufferToBlobPart } from "openclaw/plugin-sdk/blob-runtime";
import { buildTimeoutAbortSignal } from "openclaw/plugin-sdk/extension-shared";
import { extensionForMime } from "openclaw/plugin-sdk/media-mime";
import { loadOutboundMediaFromUrl } from "openclaw/plugin-sdk/outbound-media";
import { fetchWithSsrFGuard } from "openclaw/plugin-sdk/ssrf-runtime";
import { createPersistentDedupeCache } from "openclaw/plugin-sdk/dedupe-runtime";
import { createPluginStateErrorReporter } from "openclaw/plugin-sdk/plugin-state-runtime";
//#region extensions/slack/src/native-data-fallback.ts
const SLACK_SECTION_PLAIN_TEXT_MAX = 3e3;
const SLACK_EMPTY_BLOCK_FALLBACK = "Shared a Block Kit message";
function chunkSlackTextAtHardLimit(text, limit = SLACK_MESSAGE_TEXT_HARD_LIMIT) {
	if (!text) return [];
	return chunkTextForOutbound(text, Math.max(1, Math.floor(limit)), { preserveWhitespace: true });
}
function buildPlainTextBlocks(text, textLimit) {
	return chunkSlackTextAtHardLimit(text, Math.min(textLimit, SLACK_SECTION_PLAIN_TEXT_MAX)).map((chunk, index) => {
		const fallbackBlock = {
			block: {
				type: "section",
				text: {
					type: "plain_text",
					text: chunk
				}
			},
			text: chunk
		};
		if (index > 0) fallbackBlock.continuesText = true;
		return fallbackBlock;
	});
}
function renderNativeDataPlainText(block) {
	return appendSlackNativeDataPlainTextFallback("", [block]).trim() || "Slack could not render this chart or table data.";
}
function buildOrderedFallbackBlocks(params) {
	const entries = [];
	const consumeFromBase = createSlackNativeDataBaseTextConsumer(params.baseText);
	if (params.baseText) entries.push(...buildPlainTextBlocks(params.baseText, params.textLimit));
	for (const block of params.blocks) {
		if (hasSlackNativeDataBlock([block])) {
			const nativeText = renderNativeDataPlainText(block);
			if (!consumeFromBase(nativeText)) entries.push(...buildPlainTextBlocks(nativeText, params.textLimit));
			continue;
		}
		const text = truncateSlackText(renderSlackBlockFallbackText(block, {
			nativeDataFormat: "plain",
			includeSelectOptions: true
		}) ?? "", SLACK_MESSAGE_TEXT_HARD_LIMIT);
		entries.push({
			block,
			...text ? { text } : {}
		});
	}
	return entries;
}
function buildOrderedBlockMessages(entries, textLimit) {
	const messages = [];
	let blocks = [];
	let text = "";
	const flush = () => {
		if (blocks.length === 0) return;
		messages.push({
			text: text || SLACK_EMPTY_BLOCK_FALLBACK,
			blocks,
			mrkdwn: false
		});
		blocks = [];
		text = "";
	};
	for (const entry of entries) {
		const separator = text && entry.text && !entry.continuesText ? "\n\n" : "";
		const nextText = entry.text ? `${text}${separator}${entry.text}` : text;
		if (blocks.length >= 50 || nextText.length > textLimit) flush();
		const freshSeparator = text && entry.text && !entry.continuesText ? "\n\n" : "";
		const freshText = entry.text ? `${text}${freshSeparator}${entry.text}` : text;
		blocks.push(entry.block);
		text = freshText;
	}
	flush();
	return messages;
}
/** Build one complete, ordered retry plan after Slack rejects native data blocks. */
function buildSlackNativeDataDeliveryPlan(params) {
	const baseText = params.baseText?.trim() ?? "";
	const textLimit = Math.min(SLACK_MESSAGE_TEXT_RECOMMENDED_LIMIT, SLACK_MESSAGE_TEXT_HARD_LIMIT, Math.max(1, Math.floor(params.textLimit ?? 4e4)));
	const hasNativeData = hasSlackNativeDataBlock(params.blocks);
	const accessibilityText = buildSlackNativeDataAccessibilityText(baseText, params.blocks) || (hasNativeData ? "Slack could not render this chart or table data." : SLACK_EMPTY_BLOCK_FALLBACK);
	const fallbackMessages = stripSlackNativeDataBlocks(params.blocks).length === 0 ? chunkSlackTextAtHardLimit(accessibilityText, textLimit).map((text) => ({
		text,
		mrkdwn: false
	})) : buildOrderedBlockMessages(buildOrderedFallbackBlocks({
		baseText,
		blocks: params.blocks,
		textLimit
	}), textLimit);
	return {
		accessibilityText: truncateSlackText(accessibilityText, SLACK_MESSAGE_TEXT_HARD_LIMIT),
		fallbackMessages,
		skipOriginalBlocks: accessibilityText.length > SLACK_MESSAGE_TEXT_HARD_LIMIT
	};
}
//#endregion
//#region extensions/slack/src/post-message-identity.ts
function getSlackWebApiErrorData$1(err) {
	if (!(err instanceof Error)) return;
	const data = err.data;
	return data && typeof data === "object" ? data : void 0;
}
function isSlackCustomizeScopeError(err) {
	const data = getSlackWebApiErrorData$1(err);
	if (normalizeLowercaseStringOrEmpty(normalizeOptionalString(data?.error)) !== "missing_scope") return false;
	if (normalizeLowercaseStringOrEmpty(normalizeOptionalString(data?.needed)).includes("chat:write.customize")) return true;
	return [...normalizeTrimmedStringList(data?.response_metadata?.scopes), ...normalizeTrimmedStringList(data?.response_metadata?.acceptedScopes)].map((scope) => normalizeLowercaseStringOrEmpty(scope)).includes("chat:write.customize");
}
function isSlackCustomIdentityRejectedError(err) {
	if (isSlackCustomizeScopeError(err)) return true;
	const data = getSlackWebApiErrorData$1(err);
	const code = normalizeLowercaseStringOrEmpty(normalizeOptionalString(data?.error));
	return code === "invalid_arguments" || code === "invalid_arg_name";
}
function hasCustomIdentity$1(identity) {
	return Boolean(identity?.username || identity?.iconUrl || identity?.iconEmoji);
}
/** Post with the requested identity, degrading only on Slack identity-specific errors. */
async function postSlackMessageWithIdentityFallback(params) {
	const { basePayload, identity, post } = params;
	try {
		if (!identity) return await post(basePayload);
		if (identity?.iconUrl) return await post({
			...basePayload,
			...identity.username ? { username: identity.username } : {},
			icon_url: identity.iconUrl
		}, identity);
		if (identity?.iconEmoji) return await post({
			...basePayload,
			...identity.username ? { username: identity.username } : {},
			icon_emoji: identity.iconEmoji
		}, identity);
		return await post({
			...basePayload,
			...identity?.username ? { username: identity.username } : {}
		}, identity);
	} catch (err) {
		if (!identity || !hasCustomIdentity$1(identity) || !isSlackCustomIdentityRejectedError(err)) throw err;
		if (!isSlackCustomizeScopeError(err) && identity.username && (identity.iconUrl || identity.iconEmoji)) {
			logVerbose("slack send: custom icon rejected, retrying with username only");
			try {
				return await post({
					...basePayload,
					username: identity.username
				}, { username: identity.username });
			} catch (retryError) {
				if (!isSlackCustomIdentityRejectedError(retryError)) throw retryError;
			}
		}
		logVerbose("slack send: custom identity rejected, retrying without custom identity");
		return post(basePayload);
	}
}
//#endregion
//#region extensions/slack/src/post-message-payload.ts
function buildSlackUnfurlPayload(options) {
	return {
		unfurl_links: options?.unfurlLinks ?? false,
		...typeof options?.unfurlMedia === "boolean" ? { unfurl_media: options.unfurlMedia } : {}
	};
}
function buildSlackPostMessagePayload(params) {
	const threadPayload = params.replyBroadcast && params.threadTs ? {
		thread_ts: params.threadTs,
		reply_broadcast: true
	} : params.threadTs ? { thread_ts: params.threadTs } : {};
	const unfurlPayload = buildSlackUnfurlPayload(params.unfurl);
	if (params.blocks?.length) return {
		channel: params.channelId,
		text: params.text,
		blocks: params.blocks,
		...params.metadata ? { metadata: params.metadata } : {},
		...typeof params.mrkdwn === "boolean" ? { mrkdwn: params.mrkdwn } : {},
		...threadPayload,
		...unfurlPayload
	};
	return {
		channel: params.channelId,
		text: params.text,
		...params.metadata ? { metadata: params.metadata } : {},
		...typeof params.mrkdwn === "boolean" ? { mrkdwn: params.mrkdwn } : {},
		...threadPayload,
		...unfurlPayload
	};
}
//#endregion
//#region extensions/slack/src/client-delivery.ts
const SLACK_COMMERCIAL_API_HOSTNAME = "slack.com";
const SLACK_COMMERCIAL_UPLOAD_HOSTNAME = "files.slack.com";
const SLACK_GOV_API_HOSTNAME = "slack-gov.com";
const SLACK_GOV_UPLOAD_HOSTNAME = "files.slack-gov.com";
const SLACK_COMMERCIAL_UPLOAD_SSRF_POLICY = {
	hostnameAllowlist: [SLACK_COMMERCIAL_UPLOAD_HOSTNAME],
	allowRfc2544BenchmarkRange: true
};
const SLACK_GOV_UPLOAD_SSRF_POLICY = {
	hostnameAllowlist: [SLACK_GOV_UPLOAD_HOSTNAME],
	allowRfc2544BenchmarkRange: true
};
const SLACK_UPLOAD_POST_TIMEOUT_MS = 12e4;
const SLACK_DNS_RETRY_CODES = /* @__PURE__ */ new Set([
	"EAI_AGAIN",
	"ENOTFOUND",
	"UND_ERR_DNS_RESOLVE_FAILED"
]);
const SLACK_DNS_RETRY_ATTEMPTS = 2;
const SLACK_DNS_RETRY_BASE_DELAY_MS = 250;
function rethrowSlackPermanentOutboundApiRejection(err) {
	const rawData = isRecord(err) && err.code === "slack_webapi_platform_error" ? err.data : void 0;
	const data = isRecord(rawData) ? rawData : void 0;
	const code = data?.error;
	if (data?.ok === false && (code === "messages_tab_disabled" || code === "account_inactive")) throw new PlatformMessageNotDispatchedError(`Slack outbound delivery rejected: ${code}`, {
		cause: err,
		retryable: false
	});
	throw err;
}
function readSlackRequestErrorCode(value) {
	if (!value || typeof value !== "object") return;
	const code = value.code;
	return typeof code === "string" ? code.toUpperCase() : void 0;
}
function readSlackRequestErrorMessage$1(value) {
	if (value instanceof Error) return value.message;
	return typeof value === "string" ? value : "";
}
function hasSlackDnsRequestSignal(err) {
	let current = err;
	const seen = /* @__PURE__ */ new Set();
	for (let depth = 0; current && typeof current === "object" && depth < 6; depth += 1) {
		if (seen.has(current)) return false;
		seen.add(current);
		const code = readSlackRequestErrorCode(current);
		if (code && SLACK_DNS_RETRY_CODES.has(code)) return true;
		const message = readSlackRequestErrorMessage$1(current);
		if (/\b(EAI_AGAIN|ENOTFOUND|UND_ERR_DNS_RESOLVE_FAILED)\b/i.test(message)) return true;
		current = current.original ?? current.cause;
	}
	return false;
}
function resolveSlackUploadTimeoutLogUrl(url) {
	try {
		return new URL(url).origin;
	} catch {
		return;
	}
}
function buildSlackUploadFailureCause(error) {
	const httpStatus = error instanceof Error ? /^Failed to upload file: HTTP (\d{3})$/u.exec(error.message)?.[1] : void 0;
	const cause = /* @__PURE__ */ new Error(httpStatus ? `Slack external upload returned HTTP ${httpStatus}` : "Slack external upload transfer failed");
	cause.name = readErrorName(error) || cause.name;
	const code = extractErrorCode(error) ?? (httpStatus ? `HTTP_${httpStatus}` : void 0);
	if (code) cause.code = code;
	return cause;
}
function parseSlackUploadHttpUrl(value, label) {
	try {
		const parsed = new URL(value);
		if (parsed.protocol === "http:" || parsed.protocol === "https:") return parsed;
	} catch {}
	throw new Error(`${label} must use a valid HTTP or HTTPS URL`);
}
function normalizeSlackHostname(hostname) {
	return hostname.trim().toLowerCase().replace(/\.$/, "");
}
function resolveSlackOwnedUploadPolicy(url) {
	if (url.protocol !== "https:") return;
	switch (normalizeSlackHostname(url.hostname)) {
		case SLACK_COMMERCIAL_UPLOAD_HOSTNAME: return SLACK_COMMERCIAL_UPLOAD_SSRF_POLICY;
		case SLACK_GOV_UPLOAD_HOSTNAME: return SLACK_GOV_UPLOAD_SSRF_POLICY;
		default: return;
	}
}
function resolveOfficialSlackApiUploadPolicy(url) {
	if (url.protocol !== "https:" || url.port) return;
	switch (normalizeSlackHostname(url.hostname)) {
		case SLACK_COMMERCIAL_API_HOSTNAME: return SLACK_COMMERCIAL_UPLOAD_SSRF_POLICY;
		case SLACK_GOV_API_HOSTNAME: return SLACK_GOV_UPLOAD_SSRF_POLICY;
		default: return;
	}
}
function normalizeSlackOrigin(url) {
	const port = url.port ? `:${url.port}` : "";
	return `${url.protocol}//${normalizeSlackHostname(url.hostname)}${port}`;
}
function resolveSlackUploadTransportPolicy(params) {
	if (!params.slackApiUrl) return {
		requireHttps: true,
		policy: SLACK_COMMERCIAL_UPLOAD_SSRF_POLICY
	};
	const apiUrl = parseSlackUploadHttpUrl(params.slackApiUrl, "Configured Slack API URL");
	const officialApiPolicy = resolveOfficialSlackApiUploadPolicy(apiUrl);
	if (officialApiPolicy) return {
		requireHttps: true,
		policy: officialApiPolicy
	};
	const uploadUrl = parseSlackUploadHttpUrl(params.uploadUrl, "Slack external upload URL");
	const slackOwnedUploadPolicy = resolveSlackOwnedUploadPolicy(uploadUrl);
	if (slackOwnedUploadPolicy) return {
		requireHttps: true,
		policy: slackOwnedUploadPolicy
	};
	if (normalizeSlackOrigin(uploadUrl) !== normalizeSlackOrigin(apiUrl)) throw new Error("Slack external upload URL must match the configured Slack API origin");
	return {
		requireHttps: apiUrl.protocol === "https:",
		policy: {
			hostnameAllowlist: [uploadUrl.hostname],
			allowedOrigins: [uploadUrl.origin],
			allowRfc2544BenchmarkRange: true
		}
	};
}
async function withSlackDnsRequestRetry(operation, fn) {
	return await retryAsync(fn, {
		attempts: 3,
		minDelayMs: 0,
		shouldRetry: hasSlackDnsRequestSignal,
		delayMs: ({ attempt }) => SLACK_DNS_RETRY_BASE_DELAY_MS * Math.max(1, attempt),
		onRetry: ({ attempt }) => {
			logVerbose(`slack send: retrying ${operation} after transient DNS request error (${attempt}/${SLACK_DNS_RETRY_ATTEMPTS})`);
		},
		sleep: (delayMs) => sleepWithAbort(delayMs)
	});
}
function requireSlackPostMessageTimestamp(response) {
	if (response.ok === false) throw new Error(`Slack chat.postMessage failed: ${formatSlackError(response.error, "unknown error")}`);
	const timestamp = response.ts?.trim();
	if (!timestamp) throw new Error("Slack chat.postMessage returned no message timestamp");
	return timestamp;
}
async function postSlackMessageBestEffort(params) {
	const basePayload = buildSlackPostMessagePayload(params);
	const postChatMessage = params.client.chat.postMessage.bind(params.client.chat);
	const post = async (payload, identity) => ({
		response: await withSlackDnsRequestRetry("chat.postMessage", () => postChatMessage(payload)).catch(rethrowSlackPermanentOutboundApiRejection),
		identity
	});
	const posted = await postSlackMessageWithIdentityFallback({
		basePayload,
		identity: params.identity,
		post
	});
	const timestamp = requireSlackPostMessageTimestamp(posted.response);
	return {
		...posted,
		response: {
			...posted.response,
			ts: timestamp
		}
	};
}
async function uploadSlackFile(params) {
	const { buffer, contentType, fileName } = await loadOutboundMediaFromUrl(params.mediaUrl, {
		maxBytes: params.maxBytes,
		mediaAccess: params.mediaAccess,
		mediaLocalRoots: params.mediaLocalRoots,
		mediaReadFile: params.mediaReadFile,
		...params.optimizeImages !== void 0 ? { optimizeImages: params.optimizeImages } : {}
	});
	const uploadFileName = params.uploadFileName ?? fileName ?? `upload${extensionForMime(contentType) ?? ""}`;
	const uploadTitle = params.uploadTitle ?? uploadFileName;
	const uploadUrlResp = await withSlackDnsRequestRetry("files.getUploadURLExternal", () => params.client.files.getUploadURLExternal({
		filename: uploadFileName,
		length: buffer.length
	})).catch(rethrowSlackPermanentOutboundApiRejection);
	if (!uploadUrlResp.ok || !uploadUrlResp.upload_url || !uploadUrlResp.file_id) throw new Error(`Failed to get upload URL: ${uploadUrlResp.error ?? "unknown error"}`);
	const uploadFileId = uploadUrlResp.file_id;
	const uploadTransport = resolveSlackUploadTransportPolicy({
		uploadUrl: uploadUrlResp.upload_url,
		slackApiUrl: params.client.slackApiUrl
	});
	const { signal: uploadTimeoutSignal, cleanup: cleanupUploadTimeout } = buildTimeoutAbortSignal({
		timeoutMs: SLACK_UPLOAD_POST_TIMEOUT_MS,
		operation: "slack-upload-file",
		url: resolveSlackUploadTimeoutLogUrl(uploadUrlResp.upload_url)
	});
	try {
		const { response: uploadResp, release } = await fetchWithSsrFGuard(withTrustedEnvProxyGuardedFetchMode({
			url: uploadUrlResp.upload_url,
			init: {
				method: "POST",
				...contentType ? { headers: { "Content-Type": contentType } } : {},
				body: new Blob([bufferToBlobPart(buffer)])
			},
			timeoutMs: SLACK_UPLOAD_POST_TIMEOUT_MS,
			signal: uploadTimeoutSignal,
			beforeRequest: params.assertDirectAdapterHandoff,
			requireHttps: uploadTransport.requireHttps,
			policy: uploadTransport.policy,
			capture: false,
			auditContext: params.auditContext ?? "slack-upload-file"
		}));
		try {
			if (uploadResp.status !== 200) throw new Error(`Failed to upload file: HTTP ${uploadResp.status}`);
		} finally {
			await uploadResp.body?.cancel().catch(() => void 0);
			await release();
		}
	} catch (error) {
		const outcome = uploadTimeoutSignal?.aborted ? "timed out" : "failed";
		throw new PlatformMessageNotDispatchedError(`Slack external upload ${outcome} before completion dispatch`, { cause: buildSlackUploadFailureCause(error) });
	} finally {
		cleanupUploadTimeout();
	}
	await params.onPlatformSendDispatch?.();
	const completionClient = params.completionClient ?? params.client;
	const completeResp = await withSlackDnsRequestRetry("files.completeUploadExternal", () => completionClient.files.completeUploadExternal({
		files: [{
			id: uploadFileId,
			title: uploadTitle
		}],
		channel_id: params.channelId,
		...params.caption ? { initial_comment: params.caption } : {},
		...params.threadTs ? { thread_ts: params.threadTs } : {}
	}));
	if (!completeResp.ok) throw new Error(`Failed to complete upload: ${completeResp.error ?? "unknown error"}`);
	return uploadFileId;
}
//#endregion
//#region extensions/slack/src/sent-thread-cache.ts
/**
* Cache of Slack threads the bot has participated in.
* Used to auto-respond in threads without requiring @mention after the first reply.
*/
const MAX_ENTRIES = 5e3;
const PERSISTENT_MAX_ENTRIES = 1e3;
const MAX_FAILURE_NOTICES = 1e3;
const PERSISTENT_NAMESPACE = "slack.thread-participation";
/**
* Keep Slack thread participation shared across bundled chunks so thread
* auto-reply gating does not diverge between prepare/dispatch call paths.
*/
const SLACK_THREAD_PARTICIPATION_KEY = Symbol.for("openclaw.slackThreadParticipation");
const SLACK_THREAD_FAILURE_NOTICES_KEY = Symbol.for("openclaw.slackThreadFailureNotices");
const threadParticipation = createPersistentDedupeCache({
	globalKey: SLACK_THREAD_PARTICIPATION_KEY,
	ttlMs: 0,
	maxSize: MAX_ENTRIES,
	persistent: {
		namespace: PERSISTENT_NAMESPACE,
		maxEntries: PERSISTENT_MAX_ENTRIES,
		openStore: (options) => getOptionalSlackRuntime()?.state.openKeyedStore(options),
		logError: createPluginStateErrorReporter(getOptionalSlackRuntime, "slack", "thread-participation-state", "Slack persistent thread participation state failed")
	}
});
const threadFailureNotices = resolveGlobalSingleton(SLACK_THREAD_FAILURE_NOTICES_KEY, () => /* @__PURE__ */ new Map(), (notices) => notices.clear());
function makeKey(accountId, channelId, threadTs, teamId) {
	return `${accountId}:${teamId ? `${teamId}:` : ""}${channelId}:${threadTs}`;
}
function recordSlackThreadParticipation(accountId, channelId, threadTs, opts) {
	if (!accountId || !channelId || !threadTs) return;
	threadParticipation.register(makeKey(accountId, channelId, threadTs, opts?.teamId), {
		...opts?.agentId ? { agentId: opts.agentId } : {},
		repliedAt: Date.now()
	});
}
function hasSlackThreadParticipation(accountId, channelId, threadTs, teamId) {
	if (!accountId || !channelId || !threadTs) return false;
	return threadParticipation.peek(makeKey(accountId, channelId, threadTs, teamId));
}
async function hasSlackThreadParticipationWithPersistence(params) {
	if (!params.accountId || !params.channelId || !params.threadTs) return false;
	return await threadParticipation.lookup(makeKey(params.accountId, params.channelId, params.threadTs, params.teamId));
}
function makeFailureNoticeKey(params) {
	const scope = params.threadTs ? `thread:${params.threadTs}` : "channel";
	return makeKey(params.accountId, params.channelId, scope, params.teamId);
}
/** Returns whether this failure was already delivered in the thread or channel. */
function hasSlackThreadFailureNotice(params) {
	const { accountId, channelId, failureText } = params;
	const fingerprint = failureText.trim().replace(/\s+/gu, " ");
	if (!accountId || !channelId || !fingerprint) return false;
	return threadFailureNotices.get(makeFailureNoticeKey(params)) === fingerprint;
}
/** Records a failure after it was delivered in the thread or channel. */
function recordSlackThreadFailureNotice(params) {
	const { accountId, channelId, failureText } = params;
	const fingerprint = failureText.trim().replace(/\s+/gu, " ");
	if (!accountId || !channelId || !fingerprint) return false;
	const key = makeFailureNoticeKey(params);
	if (threadFailureNotices.get(key) === fingerprint) return false;
	threadFailureNotices.delete(key);
	threadFailureNotices.set(key, fingerprint);
	if (threadFailureNotices.size > MAX_FAILURE_NOTICES) {
		const oldestKey = threadFailureNotices.keys().next().value;
		if (oldestKey !== void 0) threadFailureNotices.delete(oldestKey);
	}
	return true;
}
/** Clears a thread or channel outage notice after a healthy model turn completes. */
function clearSlackThreadFailureNotice(params) {
	const { accountId, channelId } = params;
	if (!accountId || !channelId) return;
	threadFailureNotices.delete(makeFailureNoticeKey(params));
}
function clearSlackThreadParticipationCache() {
	threadParticipation.clearForTest();
	threadFailureNotices.clear();
}
//#endregion
//#region extensions/slack/src/slack-dm-channel-cache.ts
const SLACK_DM_CHANNEL_CACHE_MAX = 1024;
const slackDmChannelCaches = /* @__PURE__ */ new WeakMap();
function createSlackDmCacheKey(params) {
	return `${params.accountId ?? "default"}:${createSlackTokenCacheKey(params.token)}:${params.recipientId}`;
}
function getSlackDmChannelCache(client) {
	const existing = slackDmChannelCaches.get(client);
	if (existing) return existing;
	const cache = /* @__PURE__ */ new Map();
	slackDmChannelCaches.set(client, cache);
	return cache;
}
function readCachedSlackDmChannelId(params) {
	return getSlackDmChannelCache(params.cacheOwner).get(createSlackDmCacheKey(params));
}
function cacheSlackDmChannelId(params, channelId) {
	const cache = getSlackDmChannelCache(params.cacheOwner);
	const key = createSlackDmCacheKey(params);
	if (cache.has(key)) cache.delete(key);
	else if (cache.size >= SLACK_DM_CHANNEL_CACHE_MAX) {
		const oldest = cache.keys().next().value;
		if (oldest) cache.delete(oldest);
	}
	cache.set(key, channelId);
}
//#endregion
//#region extensions/slack/src/send.ts
const SLACK_DELIVERY_METADATA_EVENT = "openclaw_delivery";
const SLACK_DELIVERY_METADATA_KEY = "openclaw_delivery_id";
const SLACK_DELIVERY_METADATA_PART_INDEX_KEY = "openclaw_delivery_part_index";
const SLACK_DELIVERY_METADATA_PART_COUNT_KEY = "openclaw_delivery_part_count";
const SLACK_DELIVERY_METADATA_SIGNATURE_KEY = "openclaw_delivery_signature";
const SLACK_RECONCILE_LOOKBACK_MS = 3e4;
const SLACK_RECONCILE_CLOCK_SKEW_MS = 3e5;
const SLACK_RECONCILE_LIMIT = 100;
const SLACK_RECONCILE_MAX_PAGES = 10;
const SLACK_ENTERPRISE_LISTENER_QUEUE_CREDENTIAL = "listener-scoped-enterprise";
const slackSendQueue = new KeyedAsyncQueue();
const slackDefaultSendIdentities = /* @__PURE__ */ new Map();
function hasCustomIdentity(identity) {
	return Boolean(identity?.username || identity?.iconUrl || identity?.iconEmoji);
}
function normalizeSlackSendIdentity(identity) {
	const username = normalizeOptionalString(identity?.username);
	const iconUrl = normalizeOptionalString(identity?.iconUrl);
	const iconEmoji = normalizeOptionalString(identity?.iconEmoji);
	const normalized = {
		...username ? { username } : {},
		...iconUrl ? { iconUrl } : {},
		...iconEmoji ? { iconEmoji } : {}
	};
	return hasCustomIdentity(normalized) ? normalized : void 0;
}
function setSlackDefaultSendIdentity(accountId, identity) {
	const normalizedAccountId = normalizeOptionalString(accountId);
	if (!normalizedAccountId) return;
	const normalizedIdentity = normalizeSlackSendIdentity(identity);
	if (normalizedIdentity) slackDefaultSendIdentities.set(normalizedAccountId, normalizedIdentity);
	else slackDefaultSendIdentities.delete(normalizedAccountId);
}
function getSlackDefaultSendIdentity(accountId) {
	const normalizedAccountId = normalizeOptionalString(accountId);
	return normalizedAccountId ? slackDefaultSendIdentities.get(normalizedAccountId) : void 0;
}
function resolveSlackSendIdentity(params) {
	return normalizeSlackSendIdentity(params.explicit) ?? getSlackDefaultSendIdentity(params.accountId);
}
function getSlackWebApiErrorData(err) {
	if (!(err instanceof Error)) return;
	const data = err.data;
	if (!data || typeof data !== "object") return;
	return data;
}
function formatSlackWebApiErrorMessage(err) {
	if (!(err instanceof Error)) return;
	const data = getSlackWebApiErrorData(err);
	const code = normalizeOptionalString(data?.error);
	if (!code) return;
	const details = [];
	const needed = normalizeOptionalString(data?.needed);
	if (needed) details.push(`needed: ${needed}`);
	const scopes = normalizeTrimmedStringList(data?.response_metadata?.scopes);
	if (scopes.length) details.push(`granted: ${scopes.join(", ")}`);
	const acceptedScopes = normalizeTrimmedStringList(data?.response_metadata?.acceptedScopes);
	if (acceptedScopes.length) details.push(`accepted: ${acceptedScopes.join(", ")}`);
	return `${err.message || `An API error occurred: ${code}`}${details.length ? ` (${details.join("; ")})` : ""}`;
}
function enrichSlackWebApiError(err) {
	const message = formatSlackWebApiErrorMessage(err);
	if (!message || !(err instanceof Error) || message === err.message) return err;
	return new Error(message);
}
function readSlackRequestErrorMessage(value) {
	if (value instanceof Error) return value.message;
	return typeof value === "string" ? value : "";
}
function resolvePostedMessageThreadTs(response) {
	const threadTs = response.message?.thread_ts;
	return typeof threadTs === "string" ? normalizeSlackThreadTsCandidate(threadTs) : void 0;
}
async function updateMessageSlack(params) {
	const cfg = requireRuntimeConfig(params.cfg, "Slack update");
	const account = resolveSlackAccount({
		cfg,
		accountId: params.accountId
	});
	assertSlackDetachedTargetAllowed(account.accountId, params.teamId);
	const token = resolveToken({
		accountId: account.accountId,
		fallbackToken: account.botToken,
		fallbackSource: account.botTokenSource
	});
	await getSlackWriteClient(token, { teamId: params.teamId }).chat.update({
		channel: params.channelId,
		ts: params.messageTs,
		text: truncateSlackTextByUtf8Bytes(params.text, SLACK_EDIT_TEXT_MAX_BYTES),
		blocks: validateSlackBlocksArray(params.blocks)
	});
}
function createSlackSendReceipt(params) {
	const platformMessageIds = params.platformMessageIds.map((messageId) => messageId.trim()).filter((messageId) => messageId && messageId !== "unknown");
	return createMessageReceiptFromOutboundResults({
		results: platformMessageIds.map((messageId) => {
			const result = {
				channel: "slack",
				messageId
			};
			if (params.channelId) result.channelId = params.channelId;
			return result;
		}),
		kind: params.kind,
		threadId: params.threadTs
	});
}
function createSlackSendReceiptFromResults(results, threadTs) {
	const receipt = createMessageReceiptFromOutboundResults({
		results,
		threadId: threadTs
	});
	const thread = threadTs ? { threadId: threadTs } : {};
	for (const [index, part] of receipt.parts.entries()) Object.assign(part, {
		index,
		...thread
	});
	return Object.assign(receipt, thread);
}
function resolveToken(params) {
	const explicit = normalizeOptionalString(params.explicit);
	if (explicit) return explicit;
	const fallback = normalizeOptionalString(params.fallbackToken);
	if (!fallback) {
		logVerbose(`slack send: missing write token for account=${params.accountId} explicit=${Boolean(params.explicit)} source=${params.fallbackSource ?? "unknown"}`);
		throw new Error(`Slack write token missing for account "${params.accountId}".`);
	}
	return fallback;
}
function parseRecipient(raw) {
	const target = parseSlackTarget(raw);
	if (!target) throw new Error("Recipient is required for Slack sends");
	return {
		kind: target.kind,
		id: canonicalizeSlackApiTargetId(target.kind, target.id, raw),
		teamId: target.teamId
	};
}
function parseEnterpriseEventRecipient(raw) {
	const match = /^(?:channel:)?([CDG][A-Z0-9]+)$/i.exec(raw.trim());
	if (!match?.[1]) throw new Error("unsupported_enterprise_slack_delivery_target");
	return {
		kind: "channel",
		id: canonicalizeSlackApiTargetId("channel", match[1])
	};
}
function resolveSlackSendEventScope(params) {
	const scope = params.opts.eventScope;
	if (!scope) return;
	if (!/^T[A-Z0-9]+$/i.test(scope.teamId) || !scope.client) throw new Error("invalid_enterprise_slack_listener_scope");
	return scope;
}
function resolveSlackDelivery(params) {
	if (params.eventScope) {
		if (!params.eventScope.writeClient) throw new Error("missing_enterprise_slack_write_client");
		return Object.freeze({
			client: params.eventScope.writeClient,
			credential: SLACK_ENTERPRISE_LISTENER_QUEUE_CREDENTIAL,
			identity: normalizeSlackSendIdentity(params.opts.identity),
			recipient: params.recipient,
			teamId: params.eventScope.teamId,
			unfurl: { unfurlMedia: params.account.config.unfurlMedia },
			upload: Object.freeze({
				client: params.eventScope.client,
				auditContext: "slack-enterprise-immediate-upload"
			})
		});
	}
	const credential = resolveToken({
		explicit: params.opts.token,
		accountId: params.account.accountId,
		fallbackToken: resolveSlackOperationToken(params.account, "write"),
		fallbackSource: params.account.identity === "user" ? params.account.userTokenSource : params.account.botTokenSource
	});
	const cachedClient = params.recipient.teamId ? getSlackWriteClient(credential, { teamId: params.recipient.teamId }) : params.opts.client ?? getSlackWriteClient(credential);
	const client = params.opts.assertDirectAdapterHandoff ? createSlackWriteClient(credential, { teamId: params.recipient.teamId }, params.opts.assertDirectAdapterHandoff) : cachedClient;
	return Object.freeze({
		client,
		...client !== cachedClient ? { dmCacheOwner: cachedClient } : {},
		credential,
		identity: resolveSlackSendIdentity({
			accountId: params.account.accountId,
			explicit: params.opts.identity
		}),
		recipient: params.recipient,
		teamId: params.recipient.teamId,
		unfurl: params.recipient.teamId ? { unfurlMedia: params.account.config.unfurlMedia } : {
			unfurlLinks: params.account.config.unfurlLinks,
			unfurlMedia: params.account.config.unfurlMedia
		}
	});
}
function createSlackSendQueueKey(params) {
	const recipientKey = `${params.recipient.kind}:${params.recipient.id}`;
	const workspaceScope = params.teamId ? `:${params.teamId}` : "";
	return `${params.accountId}:${createSlackTokenCacheKey(params.token)}${workspaceScope}:${recipientKey}:${params.threadTs ?? ""}`;
}
async function runQueuedSlackSend(key, task) {
	return await slackSendQueue.enqueue(key, task);
}
function isSlackUserRecipient(recipient) {
	return recipient.kind === "user";
}
function resolveDirectUserPostChannelId(params) {
	if (!isSlackUserRecipient(params.recipient) || params.hasMedia || params.threadTs) return;
	return params.recipient.id;
}
function resolvePostedMessageChannelId(response, fallback) {
	return (typeof response.channel === "string" ? normalizeOptionalString(response.channel) : null) ?? fallback;
}
async function resolveChannelId(client, recipient, params) {
	if (!isSlackUserRecipient(recipient)) return { channelId: recipient.id };
	const cacheParams = {
		cacheOwner: params.dmCacheOwner ?? client,
		accountId: params.accountId,
		token: params.token,
		recipientId: recipient.id
	};
	const cachedChannelId = readCachedSlackDmChannelId(cacheParams);
	if (cachedChannelId) return {
		channelId: cachedChannelId,
		isDm: true,
		cacheHit: true
	};
	const channelId = (await withSlackDnsRequestRetry("conversations.open", () => client.conversations.open({ users: recipient.id })).catch(rethrowSlackPermanentOutboundApiRejection)).channel?.id;
	if (!channelId) throw new Error("Failed to open Slack DM channel");
	cacheSlackDmChannelId(cacheParams, channelId);
	return {
		channelId,
		isDm: true,
		cacheHit: false
	};
}
function resolveSlackTextChunkLimit(params) {
	const configuredLimit = params.textLimit ?? resolveTextChunkLimit(params.cfg, "slack", params.accountId, { fallbackLimit: 8e3 });
	return Math.min(configuredLimit, SLACK_TEXT_LIMIT);
}
function resolveSlackTextChunks(params) {
	const text = params.preservePlainText ? params.text : params.text.trim();
	const chunkLimit = resolveSlackTextChunkLimit(params);
	if (params.preservePlainText) return text ? chunkTextForOutbound(text, chunkLimit, { preserveWhitespace: true }) : [];
	if (params.textIsSlackMrkdwn) return resolveTextChunksWithFallback(text, chunkSlackMrkdwnText(text, chunkLimit));
	const tableMode = resolveMarkdownTableMode({
		cfg: params.cfg,
		channel: "slack",
		...params.accountId ? { accountId: params.accountId } : {}
	});
	const chunkMode = resolveChunkMode(params.cfg, "slack", params.accountId);
	const chunks = (chunkMode === "newline" ? chunkMarkdownTextWithMode(text, chunkLimit, chunkMode) : [text]).flatMap((markdown) => markdownToSlackMrkdwnChunks(markdown, chunkLimit, { tableMode }));
	return resolveTextChunksWithFallback(text, chunks);
}
async function resolveSlackDmChannelId(params) {
	return (await resolveChannelId(params.client, {
		kind: "user",
		id: params.userId
	}, {
		accountId: params.accountId,
		token: params.token
	})).channelId;
}
function createSlackDeliveryMetadataId(queueId) {
	const normalized = normalizeOptionalString(queueId);
	if (!normalized) return;
	return createHash("sha256").update(normalized).digest("base64url");
}
function createSlackDeliveryMetadataSignature(params) {
	return createHmac("sha256", params.queueId).update(JSON.stringify([
		SLACK_DELIVERY_METADATA_EVENT,
		params.channelId,
		params.threadTs ?? "",
		params.partIndex,
		params.partCount
	])).digest("base64url");
}
function withSlackDeliveryMetadata(metadata, params) {
	const queueId = normalizeOptionalString(params.queueId);
	const deliveryId = createSlackDeliveryMetadataId(queueId);
	if (!queueId || !deliveryId) return metadata;
	const marker = {
		[SLACK_DELIVERY_METADATA_KEY]: deliveryId,
		[SLACK_DELIVERY_METADATA_PART_INDEX_KEY]: params.partIndex,
		[SLACK_DELIVERY_METADATA_PART_COUNT_KEY]: params.partCount,
		[SLACK_DELIVERY_METADATA_SIGNATURE_KEY]: createSlackDeliveryMetadataSignature({
			queueId,
			channelId: params.channelId,
			threadTs: params.threadTs,
			partIndex: params.partIndex,
			partCount: params.partCount
		})
	};
	if (!metadata) return {
		event_type: SLACK_DELIVERY_METADATA_EVENT,
		event_payload: marker
	};
	return {
		...metadata,
		event_payload: {
			...metadata.event_payload,
			...marker
		}
	};
}
function formatSlackTimestampFromMs(ms) {
	return (Math.max(0, ms) / 1e3).toFixed(6);
}
function asSlackConversationMessages(response) {
	return Array.isArray(response.messages) ? response.messages.filter((message) => typeof message === "object" && message !== null && !Array.isArray(message)) : [];
}
const SLACK_RECONCILIATION_EVIDENCE_RANK = {
	none: 0,
	partial: 1,
	conflict: 2,
	complete: 3
};
function findSlackConversationDeliveryParts(params) {
	const matches = [];
	for (const message of params.messages) {
		if (!message.metadata || typeof message.metadata !== "object" || Array.isArray(message.metadata)) continue;
		const eventPayload = message.metadata.event_payload;
		if (!eventPayload || typeof eventPayload !== "object" || Array.isArray(eventPayload)) continue;
		const marker = eventPayload;
		if (marker[SLACK_DELIVERY_METADATA_KEY] !== params.deliveryId) continue;
		const partIndex = marker[SLACK_DELIVERY_METADATA_PART_INDEX_KEY];
		const partCount = marker[SLACK_DELIVERY_METADATA_PART_COUNT_KEY];
		if (typeof partIndex !== "number" || !Number.isInteger(partIndex) || typeof partCount !== "number" || !Number.isInteger(partCount) || partIndex < 0 || partCount <= 0 || partIndex >= partCount) continue;
		const expectedSignature = createSlackDeliveryMetadataSignature({
			queueId: params.queueId,
			channelId: params.channelId,
			threadTs: params.threadTs,
			partIndex,
			partCount
		});
		const actualSignature = marker[SLACK_DELIVERY_METADATA_SIGNATURE_KEY];
		if (typeof actualSignature !== "string" || !safeEqualSecret(actualSignature, expectedSignature)) continue;
		const messageId = typeof message.ts === "string" ? normalizeSlackThreadTsCandidate(message.ts) : void 0;
		if (!messageId) continue;
		const threadTs = typeof message.thread_ts === "string" ? normalizeSlackThreadTsCandidate(message.thread_ts) : void 0;
		matches.push({
			messageId,
			partIndex,
			partCount,
			...threadTs ? { threadTs } : {}
		});
	}
	return matches;
}
async function scanSlackConversationForDelivery(params) {
	const threadTs = params.threadTs;
	let cursor;
	let expectedPartCount;
	const deliveryParts = /* @__PURE__ */ new Map();
	for (let page = 0; page < SLACK_RECONCILE_MAX_PAGES; page += 1) {
		const response = threadTs ? await withSlackDnsRequestRetry("conversations.replies", () => params.client.conversations.replies({
			channel: params.channelId,
			ts: threadTs,
			oldest: params.oldest,
			latest: params.latest,
			include_all_metadata: true,
			limit: SLACK_RECONCILE_LIMIT,
			...cursor ? { cursor } : {}
		})) : await withSlackDnsRequestRetry("conversations.history", () => params.client.conversations.history({
			channel: params.channelId,
			oldest: params.oldest,
			latest: params.latest,
			include_all_metadata: true,
			limit: SLACK_RECONCILE_LIMIT,
			...cursor ? { cursor } : {}
		}));
		const matches = findSlackConversationDeliveryParts({
			messages: asSlackConversationMessages(response),
			queueId: params.queueId,
			deliveryId: params.deliveryId,
			channelId: params.channelId,
			...threadTs ? { threadTs } : {}
		});
		for (const match of matches) {
			expectedPartCount ??= match.partCount;
			const existing = deliveryParts.get(match.partIndex);
			if (expectedPartCount !== match.partCount || existing && existing.messageId !== match.messageId) return {
				reconciliation: {
					status: "unresolved",
					error: "Slack history contains conflicting durable delivery markers",
					retryable: false
				},
				evidence: "conflict"
			};
			deliveryParts.set(match.partIndex, match);
		}
		if (expectedPartCount !== void 0 && deliveryParts.size === expectedPartCount) {
			const orderedParts = Array.from({ length: expectedPartCount }, (_, index) => deliveryParts.get(index));
			if (orderedParts.some((part) => !part)) return {
				reconciliation: {
					status: "unresolved",
					error: "Slack history contains an invalid durable delivery marker set",
					retryable: false
				},
				evidence: "conflict"
			};
			const completeParts = orderedParts;
			const reconciledThreadTs = completeParts[0]?.threadTs ?? params.threadTs;
			const platformMessageIds = completeParts.map((part) => part.messageId);
			return {
				reconciliation: {
					status: "sent",
					messageId: platformMessageIds[0],
					receipt: createSlackSendReceipt({
						platformMessageIds,
						channelId: params.channelId,
						kind: "text",
						...reconciledThreadTs ? { threadTs: reconciledThreadTs } : {}
					})
				},
				evidence: "complete"
			};
		}
		const nextCursor = normalizeOptionalString(response.response_metadata?.next_cursor);
		if (!nextCursor) {
			if (response.has_more === true) break;
			return {
				reconciliation: {
					status: "unresolved",
					error: deliveryParts.size > 0 ? "Slack history contains an incomplete durable delivery marker set" : "Slack history contains no exact durable delivery marker",
					retryable: params.retryCount < 2
				},
				evidence: deliveryParts.size > 0 ? "partial" : "none"
			};
		}
		cursor = nextCursor;
	}
	return {
		reconciliation: {
			status: "unresolved",
			error: "Slack unknown-send reconciliation exceeded its history page budget",
			retryable: params.retryCount < 2
		},
		evidence: deliveryParts.size > 0 ? "partial" : "none"
	};
}
async function reconcileSlackUnknownSend(ctx) {
	const cfg = requireRuntimeConfig(ctx.cfg, "Slack delivery reconciliation");
	const account = resolveSlackAccount({
		cfg,
		accountId: ctx.accountId ?? void 0
	});
	const deliveryId = createSlackDeliveryMetadataId(ctx.queueId);
	if (!deliveryId) return {
		status: "unresolved",
		error: "Slack unknown-send reconciliation requires a durable delivery id",
		retryable: false
	};
	const recipient = parseRecipient(ctx.to);
	try {
		assertSlackDetachedTargetAllowed(account.accountId, recipient.teamId);
	} catch (error) {
		return {
			status: "unresolved",
			error: error instanceof Error ? error.message : String(error),
			retryable: false
		};
	}
	const readToken = resolveSlackOperationToken(account, "read");
	if (!readToken) return {
		status: "unresolved",
		error: `Slack read token missing for account "${account.accountId}"`,
		retryable: false
	};
	const userRecipient = isSlackUserRecipient(recipient);
	const writeToken = resolveSlackOperationToken(account, "write");
	if (userRecipient && !writeToken) return {
		status: "unresolved",
		error: `Slack write token missing for direct-message reconciliation on account "${account.accountId}"`,
		retryable: false
	};
	const readClient = createSlackReadClient(readToken, { teamId: recipient.teamId });
	const writeClient = writeToken ? getSlackWriteClient(writeToken, { teamId: recipient.teamId }) : void 0;
	const payloadReplyToId = ctx.payloads[0]?.replyToId;
	const effectiveReplyToId = Object.hasOwn(ctx, "effectiveReplyToId") ? normalizeOptionalString(ctx.effectiveReplyToId) : payloadReplyToId != null ? normalizeOptionalString(payloadReplyToId) : ctx.replyToMode === "off" ? void 0 : normalizeOptionalString(ctx.replyToId);
	const threadTs = resolveSlackThreadTsValue({
		replyToId: effectiveReplyToId,
		threadId: ctx.threadId
	});
	const searchStartedAt = ctx.platformSendStartedAt ?? ctx.enqueuedAt;
	const oldest = formatSlackTimestampFromMs(searchStartedAt - SLACK_RECONCILE_LOOKBACK_MS - SLACK_RECONCILE_CLOCK_SKEW_MS);
	const latest = formatSlackTimestampFromMs(searchStartedAt + SLACK_RECONCILE_CLOCK_SKEW_MS);
	try {
		const channelClient = userRecipient ? writeClient : readClient;
		const channelToken = userRecipient ? writeToken : readToken;
		if (!channelClient || !channelToken) throw new Error(`Slack channel resolution token missing for account "${account.accountId}"`);
		const { channelId } = await resolveChannelId(channelClient, recipient, {
			accountId: account.accountId,
			token: channelToken
		});
		const lookupClients = [readClient, ...writeClient && writeClient !== readClient && writeToken !== readToken ? [writeClient] : []];
		let lookupError;
		let bestUnresolvedScan;
		for (const lookupClient of lookupClients) try {
			const scan = await scanSlackConversationForDelivery({
				client: lookupClient,
				channelId,
				...threadTs ? { threadTs } : {},
				oldest,
				latest,
				queueId: ctx.queueId,
				deliveryId,
				retryCount: ctx.retryCount
			});
			if (scan.reconciliation.status === "sent") return scan.reconciliation;
			if (!bestUnresolvedScan || SLACK_RECONCILIATION_EVIDENCE_RANK[scan.evidence] > SLACK_RECONCILIATION_EVIDENCE_RANK[bestUnresolvedScan.evidence]) bestUnresolvedScan = scan;
		} catch (err) {
			lookupError = err;
		}
		if (bestUnresolvedScan) return bestUnresolvedScan.reconciliation;
		throw lookupError;
	} catch (err) {
		return {
			status: "unresolved",
			error: readSlackRequestErrorMessage(enrichSlackWebApiError(err)),
			retryable: ctx.retryCount < 3
		};
	}
}
async function sendMessageSlack(to, message, opts) {
	const normalizedMessage = normalizeOptionalString(message) ?? "";
	const trimmedMessage = opts.textIsSlackPlainText && normalizedMessage ? message : normalizedMessage;
	const cfg = requireRuntimeConfig(opts.cfg, "Slack send");
	const account = resolveSlackAccount({
		cfg,
		accountId: opts.accountId
	});
	const eventScope = resolveSlackSendEventScope({ opts });
	const recipient = eventScope ? parseEnterpriseEventRecipient(to) : parseRecipient(to);
	if (!eventScope) assertSlackDetachedTargetAllowed(account.accountId, recipient.teamId);
	const blocks = opts.blocks == null ? void 0 : validateSlackBlocksArray(opts.blocks);
	if (!normalizedMessage && !opts.mediaUrl && !blocks) throw new Error("Slack send requires text, blocks, or media");
	const queuedOpts = Object.freeze({ ...opts });
	const delivery = resolveSlackDelivery({
		account,
		eventScope,
		opts: queuedOpts,
		recipient
	});
	const result = await runQueuedSlackSend(createSlackSendQueueKey({
		accountId: account.accountId,
		token: delivery.credential,
		recipient: delivery.recipient,
		threadTs: opts.threadTs,
		teamId: delivery.teamId
	}), () => sendMessageSlackQueued({
		trimmedMessage,
		opts: queuedOpts,
		cfg,
		account,
		blocks,
		delivery
	}));
	const threadTs = result.threadTs ?? normalizeSlackThreadTsCandidate(queuedOpts.threadTs);
	if (threadTs && result.channelId && account.accountId) recordSlackThreadParticipation(account.accountId, result.channelId, threadTs, { teamId: delivery.teamId });
	return result;
}
async function sendMessageSlackQueued(params) {
	try {
		return await sendMessageSlackQueuedInner(params);
	} catch (err) {
		throw enrichSlackWebApiError(err);
	}
}
async function sendMessageSlackQueuedInner(params) {
	const { opts, cfg, account, blocks, trimmedMessage, delivery } = params;
	const { client, identity, recipient, unfurl } = delivery;
	if (opts.replyBroadcast && opts.mediaUrl) throw new Error("Slack replyBroadcast is only supported for text or block thread replies.");
	const directUserPostChannelId = opts.deliveryQueueId ? void 0 : resolveDirectUserPostChannelId({
		recipient,
		hasMedia: Boolean(opts.mediaUrl),
		...opts.threadTs ? { threadTs: opts.threadTs } : {}
	});
	const { channelId } = directUserPostChannelId ? { channelId: directUserPostChannelId } : await resolveChannelId(client, recipient, {
		accountId: account.accountId,
		token: delivery.credential,
		...delivery.dmCacheOwner ? { dmCacheOwner: delivery.dmCacheOwner } : {}
	});
	const deliveredResults = [];
	const reportDelivery = async (result, deliveredBlocks) => {
		const slackQuestionActionIds = resolveSlackQuestionActionIds(deliveredBlocks);
		const deliveryResult = slackQuestionActionIds.length ? {
			...result,
			meta: {
				...result.meta,
				slackQuestionActionIds,
				[SLACK_QUESTION_FINALIZATION_BLOCKS]: deliveredBlocks.filter((block) => block.type !== "actions")
			}
		} : result;
		deliveredResults.push(deliveryResult);
		await opts.onDeliveryResult?.(deliveryResult);
		return deliveryResult;
	};
	let didDispatch = false;
	const dispatchOnce = async () => {
		if (didDispatch) return;
		didDispatch = true;
		await opts.onPlatformSendDispatch?.();
	};
	const explicitNativeDataFallbackBase = Object.hasOwn(opts, "nativeDataFallbackBaseText") ? opts.nativeDataFallbackBaseText?.trim() ?? "" : void 0;
	const authoredTextPlacement = opts.authoredTextPlacement ?? "outside-blocks";
	const nativeDataFallbackBase = blocks && authoredTextPlacement === "outside-blocks" ? explicitNativeDataFallbackBase ?? trimmedMessage : "";
	const hasNativeData = Boolean(blocks && hasSlackNativeDataBlock(blocks));
	const textChunkLimit = resolveSlackTextChunkLimit({
		cfg,
		accountId: account.accountId,
		...opts.textLimit !== void 0 ? { textLimit: opts.textLimit } : {}
	});
	const usesOrderedBlockAccessibility = Boolean(blocks && (hasNativeData || opts.authoredTextPlacement !== void 0));
	const orderedBlockDeliveryPlan = blocks && usesOrderedBlockAccessibility ? buildSlackNativeDataDeliveryPlan({
		baseText: nativeDataFallbackBase,
		blocks,
		textLimit: textChunkLimit
	}) : void 0;
	const orderedBlockAccessibilityText = blocks && usesOrderedBlockAccessibility ? orderedBlockDeliveryPlan?.accessibilityText ?? (buildSlackNativeDataAccessibilityText(nativeDataFallbackBase, blocks) || "Slack could not render this Block Kit message.") : void 0;
	const completeBlockFallbackText = blocks ? buildSlackCompleteBlocksFallbackText(blocks) : "";
	const rawBlockAccessibilityText = trimmedMessage ? [trimmedMessage, ...completeBlockFallbackText.includes(trimmedMessage) ? [] : [completeBlockFallbackText]].join("\n\n") : completeBlockFallbackText;
	const blockAccessibilityText = blocks ? orderedBlockAccessibilityText ?? rawBlockAccessibilityText : void 0;
	let pendingBlockFallback = (hasNativeData || opts.authoredTextPlacement !== void 0) && orderedBlockDeliveryPlan?.skipOriginalBlocks ? orderedBlockDeliveryPlan : void 0;
	let lastMessageId = "";
	let deliveredChannelId = channelId;
	let canonicalDeliveredThreadTs;
	let sendIdentity = identity;
	if (blocks && opts.mediaUrl) throw new Error("Slack send does not support blocks with mediaUrl");
	if (blocks) {
		if (pendingBlockFallback) logVerbose("slack send: native data accessibility exceeds hard limit, using text fallback");
		else {
			const accessibilityText = hasNativeData ? blockAccessibilityText ?? "Slack could not render this Block Kit message." : usesOrderedBlockAccessibility ? blockAccessibilityText ?? "Slack could not render this Block Kit message." : truncateSlackText(blockAccessibilityText ?? "", SLACK_TEXT_LIMIT);
			const initialBlockMetadata = withSlackDeliveryMetadata(opts.metadata, {
				queueId: opts.deliveryQueueId,
				channelId,
				threadTs: opts.threadTs,
				partIndex: 0,
				partCount: 1
			});
			await dispatchOnce();
			try {
				const { response } = await postSlackMessageBestEffort({
					client,
					channelId,
					text: accessibilityText,
					threadTs: opts.threadTs,
					replyBroadcast: opts.replyBroadcast,
					identity,
					blocks,
					metadata: initialBlockMetadata,
					...usesOrderedBlockAccessibility ? { mrkdwn: false } : {},
					unfurl
				});
				const messageId = response.ts;
				deliveredChannelId = resolvePostedMessageChannelId(response, channelId);
				const deliveredThreadTs = resolvePostedMessageThreadTs(response) ?? normalizeSlackThreadTsCandidate(opts.threadTs);
				return await reportDelivery({
					messageId,
					channelId: deliveredChannelId,
					threadTs: deliveredThreadTs,
					receipt: createSlackSendReceipt({
						platformMessageIds: [messageId],
						channelId: deliveredChannelId,
						kind: "card",
						threadTs: deliveredThreadTs
					})
				}, blocks);
			} catch (error) {
				if (!hasNativeData || !isSlackInvalidBlocksError(error)) throw error;
				logVerbose("slack send: native data rejected, delivering complete text fallback");
				pendingBlockFallback = orderedBlockDeliveryPlan;
			}
		}
		if (pendingBlockFallback) {
			const fallbackMessages = pendingBlockFallback.fallbackMessages;
			let questionDelivery;
			for (const [partIndex, fallback] of fallbackMessages.entries()) {
				const metadata = withSlackDeliveryMetadata(partIndex === 0 ? opts.metadata : void 0, {
					queueId: opts.deliveryQueueId,
					channelId,
					threadTs: opts.threadTs,
					partIndex,
					partCount: fallbackMessages.length
				});
				if (partIndex === 0) await dispatchOnce();
				const posted = await postSlackMessageBestEffort({
					client,
					channelId,
					text: fallback.text,
					threadTs: opts.threadTs,
					replyBroadcast: partIndex === 0 ? opts.replyBroadcast : void 0,
					identity: sendIdentity,
					...fallback.blocks ? { blocks: fallback.blocks } : {},
					metadata,
					mrkdwn: false,
					unfurl
				});
				const response = posted.response;
				sendIdentity = posted.identity;
				lastMessageId = response.ts;
				deliveredChannelId = resolvePostedMessageChannelId(response, deliveredChannelId);
				canonicalDeliveredThreadTs ??= resolvePostedMessageThreadTs(response);
				const deliveredThreadTs = resolvePostedMessageThreadTs(response) ?? normalizeSlackThreadTsCandidate(opts.threadTs);
				const fallbackDelivery = await reportDelivery({
					messageId: response.ts,
					channelId: deliveredChannelId,
					threadTs: deliveredThreadTs,
					receipt: createSlackSendReceipt({
						platformMessageIds: [response.ts],
						channelId: deliveredChannelId,
						kind: fallback.blocks ? "card" : "text",
						threadTs: deliveredThreadTs
					})
				}, fallback.blocks);
				if (fallbackDelivery.meta?.slackQuestionActionIds.length) questionDelivery = fallbackDelivery;
			}
			const deliveredThreadTs = canonicalDeliveredThreadTs ?? normalizeSlackThreadTsCandidate(opts.threadTs);
			return {
				messageId: lastMessageId,
				channelId: deliveredChannelId,
				threadTs: deliveredThreadTs,
				...questionDelivery?.meta ? { meta: {
					...questionDelivery.meta,
					slackQuestionMessageId: questionDelivery.messageId
				} } : {},
				receipt: createSlackSendReceiptFromResults(deliveredResults, deliveredThreadTs)
			};
		}
	}
	const resolvedChunks = resolveSlackTextChunks({
		cfg,
		accountId: account.accountId,
		text: trimmedMessage,
		textLimit: textChunkLimit,
		...opts.textIsSlackMrkdwn ? { textIsSlackMrkdwn: true } : {},
		...opts.textIsSlackPlainText ? { preservePlainText: true } : {}
	});
	const mediaMaxBytes = opts.mediaMaxBytes ?? (typeof account.config.mediaMaxMb === "number" ? account.config.mediaMaxMb * 1024 * 1024 : void 0);
	let chunksToPost;
	if (opts.mediaUrl) {
		const [firstChunk, ...rest] = resolvedChunks;
		lastMessageId = await uploadSlackFile({
			client: delivery.upload?.client ?? client,
			completionClient: client,
			channelId,
			mediaUrl: opts.mediaUrl,
			mediaAccess: opts.mediaAccess,
			uploadFileName: opts.uploadFileName,
			uploadTitle: opts.uploadTitle,
			mediaLocalRoots: opts.mediaLocalRoots,
			mediaReadFile: opts.mediaReadFile,
			caption: firstChunk,
			threadTs: opts.threadTs,
			maxBytes: mediaMaxBytes,
			...opts.forceDocument ? { optimizeImages: false } : {},
			onPlatformSendDispatch: dispatchOnce,
			assertDirectAdapterHandoff: opts.assertDirectAdapterHandoff,
			...delivery.upload ? { auditContext: delivery.upload.auditContext } : {}
		});
		await reportDelivery({
			messageId: lastMessageId,
			channelId,
			threadTs: normalizeSlackThreadTsCandidate(opts.threadTs),
			receipt: createSlackSendReceipt({
				platformMessageIds: [lastMessageId],
				channelId,
				kind: "media",
				threadTs: normalizeSlackThreadTsCandidate(opts.threadTs)
			})
		});
		chunksToPost = rest;
	} else chunksToPost = resolvedChunks.length ? resolvedChunks : [""];
	for (const [partIndex, chunk] of chunksToPost.entries()) {
		const carriesPrimaryMessageOptions = partIndex === 0 && !opts.mediaUrl;
		const baseMetadata = carriesPrimaryMessageOptions ? opts.metadata : void 0;
		const metadata = opts.mediaUrl ? baseMetadata : withSlackDeliveryMetadata(baseMetadata, {
			queueId: opts.deliveryQueueId,
			channelId,
			threadTs: opts.threadTs,
			partIndex,
			partCount: chunksToPost.length
		});
		if (partIndex === 0 && !opts.mediaUrl) await dispatchOnce();
		const posted = await postSlackMessageBestEffort({
			client,
			channelId,
			text: chunk,
			threadTs: opts.threadTs,
			replyBroadcast: carriesPrimaryMessageOptions ? opts.replyBroadcast : void 0,
			identity: sendIdentity,
			metadata,
			...opts.textIsSlackPlainText ? { mrkdwn: false } : {},
			unfurl
		});
		const response = posted.response;
		sendIdentity = posted.identity;
		lastMessageId = response.ts;
		deliveredChannelId = resolvePostedMessageChannelId(response, deliveredChannelId);
		canonicalDeliveredThreadTs ??= resolvePostedMessageThreadTs(response);
		await reportDelivery({
			messageId: response.ts,
			channelId: deliveredChannelId,
			threadTs: resolvePostedMessageThreadTs(response) ?? normalizeSlackThreadTsCandidate(opts.threadTs),
			receipt: createSlackSendReceipt({
				platformMessageIds: [response.ts],
				channelId: deliveredChannelId,
				kind: "text",
				threadTs: resolvePostedMessageThreadTs(response) ?? normalizeSlackThreadTsCandidate(opts.threadTs)
			})
		});
	}
	const deliveredThreadTs = canonicalDeliveredThreadTs ?? normalizeSlackThreadTsCandidate(opts.threadTs);
	return {
		messageId: lastMessageId,
		channelId: deliveredChannelId,
		threadTs: deliveredThreadTs,
		receipt: createSlackSendReceiptFromResults(deliveredResults, deliveredThreadTs)
	};
}
//#endregion
export { updateMessageSlack as a, hasSlackThreadFailureNotice as c, recordSlackThreadFailureNotice as d, recordSlackThreadParticipation as f, chunkSlackTextAtHardLimit as h, setSlackDefaultSendIdentity as i, hasSlackThreadParticipation as l, buildSlackNativeDataDeliveryPlan as m, resolveSlackDmChannelId as n, clearSlackThreadFailureNotice as o, requireSlackPostMessageTimestamp as p, sendMessageSlack as r, clearSlackThreadParticipationCache as s, reconcileSlackUnknownSend as t, hasSlackThreadParticipationWithPersistence as u };
