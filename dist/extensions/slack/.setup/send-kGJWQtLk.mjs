import { t as __exportAll } from "./rolldown-runtime-nwUcYXjP.mjs";
import { f as resolveSlackOperationToken, s as resolveSlackAccount } from "./accounts-EaPP0fFY.mjs";
import { a as parseSlackTarget, t as canonicalizeSlackApiTargetId } from "./target-parsing-DwYAP3ts.mjs";
import { A as createSlackNativeDataBaseTextConsumer, Ct as SLACK_MESSAGE_TEXT_RECOMMENDED_LIMIT, Et as markdownToSlackMrkdwnChunks, F as renderSlackNativeDataPlainTextBlock, I as stripSlackNativeDataBlocks, M as isSlackInvalidBlocksError, R as truncateSlackText, St as SLACK_MESSAGE_TEXT_HARD_LIMIT, T as assertSlackDetachedTargetAllowed, Tt as chunkSlackMrkdwnText, V as SLACK_QUESTION_FINALIZATION_BLOCKS, Z as resolveSlackQuestionActionIds, _ as getSlackWebApiErrorData, ct as buildSlackCompleteBlocksFallbackText, g as formatSlackError, h as enrichSlackWebApiError, j as hasSlackNativeDataBlock, k as buildSlackNativeDataAccessibilityText, lt as renderSlackBlockFallbackText, ot as validateSlackBlocksArray, wt as SLACK_TEXT_LIMIT, xt as SLACK_EDIT_TEXT_MAX_BYTES, z as truncateSlackTextByUtf8Bytes } from "./probe-BHqvMbno.mjs";
import { r as resolveSlackThreadTsValue, t as normalizeSlackThreadTsCandidate } from "./thread-ts-47Au2-Yn.mjs";
import { c as createSlackWriteClient, d as getOrCreateWeakOwnerMap, i as createSlackReadClient, m as writeLruMapEntry, o as createSlackTokenCacheKey, u as getSlackWriteClient } from "./cursor-pages-jVn3Vkfi.mjs";
import { t as buildSlackLiteralText } from "./literal-text-DdCRYzYh.mjs";
import { t as getOptionalSlackRuntime } from "./runtime-C6HKn7Av.mjs";
import { asOptionalObjectRecord, asOptionalRecord, isRecord, normalizeLowercaseStringOrEmpty, normalizeOptionalString, normalizeTrimmedStringList } from "openclaw/plugin-sdk/string-coerce-runtime";
import { resolveMarkdownTableMode } from "openclaw/plugin-sdk/markdown-table-runtime";
import { createMessageReceiptFromOutboundResults } from "openclaw/plugin-sdk/channel-outbound";
import { logVerbose, sleepWithAbort } from "openclaw/plugin-sdk/runtime-env";
import { chunkTextForOutbound } from "openclaw/plugin-sdk/text-chunking";
import { resolveGlobalSingleton } from "openclaw/plugin-sdk/global-singleton";
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
// extensions/slack/src/native-data-fallback.ts
const SLACK_SECTION_PLAIN_TEXT_MAX = 3e3;
const SLACK_EMPTY_BLOCK_FALLBACK = "Shared a Block Kit message";
function chunkSlackTextAtHardLimit(text, limit = SLACK_MESSAGE_TEXT_HARD_LIMIT) {
	if (!text) return [];
	return chunkTextForOutbound(text, Math.max(1, Math.floor(limit)), { preserveWhitespace: true });
}
function buildOrderedBlockMessages(params) {
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
	const append = (block, entryText = "", continuesText = false) => {
		let nextText = entryText ? `${text}${text && entryText && !continuesText ? "\n\n" : ""}${entryText}` : text;
		if (blocks.length >= 50 || nextText.length > params.textLimit) {
			flush();
			nextText = entryText;
		}
		blocks.push(block);
		text = nextText;
	};
	const appendPlainText = (value) => {
		chunkSlackTextAtHardLimit(value, Math.min(params.textLimit, SLACK_SECTION_PLAIN_TEXT_MAX)).forEach((chunk, index) => {
			append({
				type: "section",
				text: {
					type: "plain_text",
					text: chunk
				}
			}, chunk, index > 0);
		});
	};
	const consumeFromBase = createSlackNativeDataBaseTextConsumer(params.baseText);
	appendPlainText(params.baseText);
	for (const block of params.blocks) {
		if (hasSlackNativeDataBlock([block])) {
			const nativeText = renderSlackNativeDataPlainTextBlock(block)?.trim() || "Slack could not render this chart or table data.";
			if (!consumeFromBase(nativeText)) appendPlainText(nativeText);
			continue;
		}
		append(block, truncateSlackText(renderSlackBlockFallbackText(block, {
			nativeDataFormat: "plain",
			includeSelectOptions: true
		}) ?? "", SLACK_MESSAGE_TEXT_HARD_LIMIT));
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
	})) : buildOrderedBlockMessages({
		baseText,
		blocks: params.blocks,
		textLimit
	});
	return {
		accessibilityText: truncateSlackText(accessibilityText, SLACK_MESSAGE_TEXT_HARD_LIMIT),
		fallbackMessages,
		skipOriginalBlocks: accessibilityText.length > SLACK_MESSAGE_TEXT_HARD_LIMIT
	};
}
// extensions/slack/src/post-message-identity.ts
function buildSlackMessageIdentityPayload(identity) {
	return {
		...identity?.username ? { username: identity.username } : {},
		...identity?.iconUrl ? { icon_url: identity.iconUrl } : identity?.iconEmoji ? { icon_emoji: identity.iconEmoji } : {}
	};
}
function hasSlackMessageIdentity(identity) {
	return Boolean(identity?.username || identity?.iconUrl || identity?.iconEmoji);
}
// extensions/slack/src/client-delivery.ts
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
function hasSlackDnsRequestSignal(err) {
	let current = asOptionalObjectRecord(err);
	const seen = /* @__PURE__ */ new Set();
	for (let depth = 0; current && depth < 6; depth += 1) {
		if (seen.has(current)) return false;
		seen.add(current);
		const rawCode = current.code;
		const code = typeof rawCode === "string" ? rawCode.toUpperCase() : void 0;
		if (code && SLACK_DNS_RETRY_CODES.has(code)) return true;
		const message = current instanceof Error ? current.message : "";
		if (/\b(EAI_AGAIN|ENOTFOUND|UND_ERR_DNS_RESOLVE_FAILED)\b/i.test(message)) return true;
		current = asOptionalObjectRecord(current.original ?? current.cause);
	}
	return false;
}
function resolveSlackUploadTimeoutLogUrl(url) {
	return URL.parse(url)?.origin;
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
	const parsed = URL.parse(value);
	if (parsed && (parsed.protocol === "http:" || parsed.protocol === "https:")) return parsed;
	throw new Error(`${label} must use a valid HTTP or HTTPS URL`);
}
function normalizeSlackHostname(hostname) {
	return hostname.trim().toLowerCase().replace(/\.$/, "");
}
function resolveSlackUploadPolicy(url, source) {
	if (url.protocol !== "https:" || source === "api" && url.port) return;
	const hostname = normalizeSlackHostname(url.hostname);
	const [commercial, government] = source === "api" ? [SLACK_COMMERCIAL_API_HOSTNAME, SLACK_GOV_API_HOSTNAME] : [SLACK_COMMERCIAL_UPLOAD_HOSTNAME, SLACK_GOV_UPLOAD_HOSTNAME];
	if (hostname === commercial) return SLACK_COMMERCIAL_UPLOAD_SSRF_POLICY;
	if (hostname === government) return SLACK_GOV_UPLOAD_SSRF_POLICY;
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
	const officialApiPolicy = resolveSlackUploadPolicy(apiUrl, "api");
	if (officialApiPolicy) return {
		requireHttps: true,
		policy: officialApiPolicy
	};
	const uploadUrl = parseSlackUploadHttpUrl(params.uploadUrl, "Slack external upload URL");
	const slackOwnedUploadPolicy = resolveSlackUploadPolicy(uploadUrl, "upload");
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
function classifySlackCustomIdentityError(err) {
	const data = getSlackWebApiErrorData(err);
	const code = normalizeLowercaseStringOrEmpty(data?.error);
	if (code === "invalid_arguments" || code === "invalid_arg_name") return "argument";
	if (code !== "missing_scope") return;
	if (normalizeLowercaseStringOrEmpty(data?.needed).includes("chat:write.customize")) return "scope";
	return [...normalizeTrimmedStringList(data?.response_metadata?.scopes), ...normalizeTrimmedStringList(data?.response_metadata?.acceptedScopes)].map((scope) => normalizeLowercaseStringOrEmpty(scope)).includes("chat:write.customize") ? "scope" : void 0;
}
async function postSlackMessageBestEffort(params) {
	const threadPayload = params.replyBroadcast && params.threadTs ? {
		thread_ts: params.threadTs,
		reply_broadcast: true
	} : params.threadTs ? { thread_ts: params.threadTs } : {};
	const basePayload = {
		channel: params.channelId,
		text: params.text,
		...params.blocks?.length ? { blocks: params.blocks } : {},
		...params.metadata ? { metadata: params.metadata } : {},
		...params.mrkdwn !== void 0 ? { mrkdwn: params.mrkdwn } : {},
		...threadPayload,
		unfurl_links: params.unfurl?.unfurlLinks ?? false,
		...params.unfurl?.unfurlMedia !== void 0 ? { unfurl_media: params.unfurl.unfurlMedia } : {},
		...params.literalText ? buildSlackLiteralText(params.text) : {}
	};
	const postChatMessage = params.client.chat.postMessage.bind(params.client.chat);
	const post = async (payload, identity) => ({
		response: await withSlackDnsRequestRetry("chat.postMessage", () => postChatMessage(payload)).catch(rethrowSlackPermanentOutboundApiRejection),
		identity
	});
	const identity = params.identity;
	const posted = await (async () => {
		try {
			if (!identity) return await post(basePayload);
			return await post({
				...basePayload,
				...buildSlackMessageIdentityPayload(identity)
			}, identity);
		} catch (err) {
			if (!identity || !hasSlackMessageIdentity(identity)) throw err;
			const rejection = classifySlackCustomIdentityError(err);
			if (!rejection) throw err;
			if (rejection === "argument" && identity.username && (identity.iconUrl || identity.iconEmoji)) {
				logVerbose("slack send: custom icon rejected, retrying with username only");
				try {
					return await post({
						...basePayload,
						username: identity.username
					}, { username: identity.username });
				} catch (retryError) {
					if (!classifySlackCustomIdentityError(retryError)) throw retryError;
				}
			}
			logVerbose("slack send: custom identity rejected, retrying without custom identity");
			return post(basePayload);
		}
	})();
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
// extensions/slack/src/sent-thread-cache.ts
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
		openStore: (options) => getOptionalSlackRuntime()?.state.openKeyedStoreV2(options),
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
	writeLruMapEntry(threadFailureNotices, key, fingerprint, MAX_FAILURE_NOTICES);
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
// extensions/slack/src/slack-dm-channel-cache.ts
const SLACK_DM_CHANNEL_CACHE_MAX = 1024;
const slackDmChannelCaches = /* @__PURE__ */ new WeakMap();
function createSlackDmCacheKey(params) {
	return `${params.accountId ?? "default"}:${createSlackTokenCacheKey(params.token)}:${params.recipientId}`;
}
function readCachedSlackDmChannelId(params) {
	return slackDmChannelCaches.get(params.cacheOwner)?.get(createSlackDmCacheKey(params));
}
function cacheSlackDmChannelId(params, channelId) {
	const cache = getOrCreateWeakOwnerMap(slackDmChannelCaches, params.cacheOwner);
	const key = createSlackDmCacheKey(params);
	writeLruMapEntry(cache, key, channelId, SLACK_DM_CHANNEL_CACHE_MAX);
}
// extensions/slack/src/send.ts
var send_exports = /* @__PURE__ */ __exportAll({
	reconcileSlackUnknownSend: () => reconcileSlackUnknownSend,
	resolveSlackDmChannelId: () => resolveSlackDmChannelId,
	sendMessageSlack: () => sendMessageSlack,
	setSlackDefaultSendIdentity: () => setSlackDefaultSendIdentity,
	updateMessageSlack: () => updateMessageSlack
});
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
function normalizeSlackSendIdentity(identity) {
	const username = normalizeOptionalString(identity?.username);
	const iconUrl = normalizeOptionalString(identity?.iconUrl);
	const iconEmoji = normalizeOptionalString(identity?.iconEmoji);
	const normalized = {
		...username ? { username } : {},
		...iconUrl ? { iconUrl } : {},
		...iconEmoji ? { iconEmoji } : {}
	};
	return hasSlackMessageIdentity(normalized) ? normalized : void 0;
}
function setSlackDefaultSendIdentity(accountId, identity) {
	const normalizedAccountId = normalizeOptionalString(accountId);
	if (!normalizedAccountId) return;
	const normalizedIdentity = normalizeSlackSendIdentity(identity);
	if (normalizedIdentity) slackDefaultSendIdentities.set(normalizedAccountId, normalizedIdentity);
	else slackDefaultSendIdentities.delete(normalizedAccountId);
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
	const { client } = resolveSlackDelivery({
		account: resolveSlackAccount({
			cfg,
			accountId: params.accountId
		}),
		eventScope: params.eventScope,
		opts: {
			cfg,
			token: params.token
		},
		recipient: {
			kind: "channel",
			id: params.channelId,
			teamId: params.teamId
		}
	});
	await client.chat.update({
		channel: params.channelId,
		ts: params.messageTs,
		text: truncateSlackTextByUtf8Bytes(params.text, SLACK_EDIT_TEXT_MAX_BYTES),
		blocks: validateSlackBlocksArray(params.blocks)
	});
}
function createSlackSendReceipt(params) {
	const platformMessageIds = params.platformMessageIds.map((messageId) => messageId.trim()).filter((messageId) => messageId && messageId !== "unknown");
	return createMessageReceiptFromOutboundResults({
		results: platformMessageIds.map((messageId) => params.channelId ? {
			channel: "slack",
			messageId,
			channelId: params.channelId
		} : {
			channel: "slack",
			messageId
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
function createSlackSendResult(messageId, channelId, kind, threadTs) {
	return {
		messageId,
		channelId,
		threadTs,
		receipt: createSlackSendReceipt({
			platformMessageIds: [messageId],
			channelId,
			kind,
			threadTs
		})
	};
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
function resolveSlackDelivery(params) {
	if (params.eventScope) {
		if (!params.eventScope.writeClient) throw new Error("missing_enterprise_slack_write_client");
		return {
			client: params.eventScope.writeClient,
			credential: SLACK_ENTERPRISE_LISTENER_QUEUE_CREDENTIAL,
			identity: normalizeSlackSendIdentity(params.opts.identity),
			recipient: params.recipient,
			teamId: params.eventScope.teamId,
			unfurl: { unfurlMedia: params.account.config.unfurlMedia },
			upload: {
				client: params.eventScope.client,
				auditContext: "slack-enterprise-immediate-upload"
			}
		};
	}
	assertSlackDetachedTargetAllowed(params.account.accountId, params.recipient.teamId);
	const credential = resolveToken({
		explicit: params.opts.token,
		accountId: params.account.accountId,
		fallbackToken: resolveSlackOperationToken(params.account, "write"),
		fallbackSource: params.account.identity === "user" ? params.account.userTokenSource : params.account.botTokenSource
	});
	const cachedClient = params.recipient.teamId ? getSlackWriteClient(credential, { teamId: params.recipient.teamId }) : params.opts.client ?? getSlackWriteClient(credential);
	const client = params.opts.assertDirectAdapterHandoff ? createSlackWriteClient(credential, { teamId: params.recipient.teamId }, params.opts.assertDirectAdapterHandoff) : cachedClient;
	return {
		client,
		...client !== cachedClient ? { dmCacheOwner: cachedClient } : {},
		credential,
		identity: normalizeSlackSendIdentity(params.opts.identity) ?? slackDefaultSendIdentities.get(params.account.accountId),
		recipient: params.recipient,
		teamId: params.recipient.teamId,
		unfurl: params.recipient.teamId ? { unfurlMedia: params.account.config.unfurlMedia } : {
			unfurlLinks: params.account.config.unfurlLinks,
			unfurlMedia: params.account.config.unfurlMedia
		}
	};
}
async function resolveChannelId(client, recipient, params) {
	if (recipient.kind !== "user") return recipient.id;
	const cacheParams = {
		cacheOwner: params.dmCacheOwner ?? client,
		accountId: params.accountId,
		token: params.token,
		recipientId: recipient.id
	};
	const cachedChannelId = readCachedSlackDmChannelId(cacheParams);
	if (cachedChannelId) return cachedChannelId;
	const channelId = (await withSlackDnsRequestRetry("conversations.open", () => client.conversations.open({ users: recipient.id })).catch(rethrowSlackPermanentOutboundApiRejection)).channel?.id;
	if (!channelId) throw new Error("Failed to open Slack DM channel");
	cacheSlackDmChannelId(cacheParams, channelId);
	return channelId;
}
async function resolveSlackDmChannelId(params) {
	return await resolveChannelId(params.client, {
		kind: "user",
		id: params.userId
	}, {
		accountId: params.accountId,
		token: params.token
	});
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
function unresolvedSlackDelivery(error, retryable) {
	return {
		status: "unresolved",
		error,
		retryable
	};
}
const SLACK_RECONCILIATION_EVIDENCE_RANK = {
	none: 0,
	partial: 1,
	conflict: 2,
	complete: 3
};
async function scanSlackConversationForDelivery(params) {
	const lookupThreadTs = params.threadTs;
	let cursor;
	let expectedPartCount;
	const deliveryParts = /* @__PURE__ */ new Map();
	for (let page = 0; page < SLACK_RECONCILE_MAX_PAGES; page += 1) {
		const query = {
			channel: params.channelId,
			oldest: params.oldest,
			latest: params.latest,
			include_all_metadata: true,
			limit: SLACK_RECONCILE_LIMIT,
			...cursor ? { cursor } : {}
		};
		const response = lookupThreadTs ? await withSlackDnsRequestRetry("conversations.replies", () => params.client.conversations.replies({
			...query,
			ts: lookupThreadTs
		})) : await withSlackDnsRequestRetry("conversations.history", () => params.client.conversations.history(query));
		const matches = [];
		for (const message of asSlackConversationMessages(response)) {
			const marker = asOptionalRecord(asOptionalRecord(message.metadata)?.event_payload);
			if (!marker || marker[SLACK_DELIVERY_METADATA_KEY] !== params.deliveryId) continue;
			const partIndex = marker[SLACK_DELIVERY_METADATA_PART_INDEX_KEY];
			const partCount = marker[SLACK_DELIVERY_METADATA_PART_COUNT_KEY];
			if (typeof partIndex !== "number" || !Number.isInteger(partIndex) || typeof partCount !== "number" || !Number.isInteger(partCount) || partIndex < 0 || partCount <= 0 || partIndex >= partCount) continue;
			const expectedSignature = createSlackDeliveryMetadataSignature({
				queueId: params.queueId,
				channelId: params.channelId,
				threadTs: lookupThreadTs,
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
		for (const match of matches) {
			expectedPartCount ??= match.partCount;
			const existing = deliveryParts.get(match.partIndex);
			if (expectedPartCount !== match.partCount || existing && existing.messageId !== match.messageId) return {
				reconciliation: unresolvedSlackDelivery("Slack history contains conflicting durable delivery markers", false),
				evidence: "conflict"
			};
			deliveryParts.set(match.partIndex, match);
		}
		if (expectedPartCount !== void 0 && deliveryParts.size === expectedPartCount) {
			const completeParts = [...deliveryParts.values()].toSorted((a, b) => a.partIndex - b.partIndex);
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
				reconciliation: unresolvedSlackDelivery(deliveryParts.size > 0 ? "Slack history contains an incomplete durable delivery marker set" : "Slack history contains no exact durable delivery marker", params.retryCount < 2),
				evidence: deliveryParts.size > 0 ? "partial" : "none"
			};
		}
		cursor = nextCursor;
	}
	return {
		reconciliation: unresolvedSlackDelivery("Slack unknown-send reconciliation exceeded its history page budget", params.retryCount < 2),
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
	if (!deliveryId) return unresolvedSlackDelivery("Slack unknown-send reconciliation requires a durable delivery id", false);
	const recipient = parseRecipient(ctx.to);
	try {
		assertSlackDetachedTargetAllowed(account.accountId, recipient.teamId);
	} catch (error) {
		return unresolvedSlackDelivery(error instanceof Error ? error.message : String(error), false);
	}
	const readToken = resolveSlackOperationToken(account, "read");
	if (!readToken) return unresolvedSlackDelivery(`Slack read token missing for account "${account.accountId}"`, false);
	const userRecipient = recipient.kind === "user";
	const writeToken = resolveSlackOperationToken(account, "write");
	if (userRecipient && !writeToken) return unresolvedSlackDelivery(`Slack write token missing for direct-message reconciliation on account "${account.accountId}"`, false);
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
		const channelId = await resolveChannelId(channelClient, recipient, {
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
		return unresolvedSlackDelivery(readSlackRequestErrorMessage(enrichSlackWebApiError(err)), ctx.retryCount < 3);
	}
}
async function sendMessageSlack(to, message, options) {
	const normalizedMessage = normalizeOptionalString(message) ?? "";
	const trimmedMessage = (options.textIsSlackPlainText || options.literalText) && normalizedMessage ? message : normalizedMessage;
	const cfg = requireRuntimeConfig(options.cfg, "Slack send");
	const account = resolveSlackAccount({
		cfg,
		accountId: options.accountId
	});
	const eventScope = options.eventScope;
	if (eventScope && (!/^T[A-Z0-9]+$/i.test(eventScope.teamId) || !eventScope.client)) throw new Error("invalid_enterprise_slack_listener_scope");
	const parsedRecipient = eventScope ? parseEnterpriseEventRecipient(to) : parseRecipient(to);
	const blocks = options.blocks == null ? void 0 : validateSlackBlocksArray(options.blocks);
	if (!normalizedMessage && !options.mediaUrl && !blocks) throw new Error("Slack send requires text, blocks, or media");
	const opts = { ...options };
	const delivery = resolveSlackDelivery({
		account,
		eventScope,
		opts,
		recipient: parsedRecipient
	});
	const workspaceScope = delivery.teamId ? `:${delivery.teamId}` : "";
	const queueKey = `${account.accountId}:${createSlackTokenCacheKey(delivery.credential)}${workspaceScope}:${delivery.recipient.kind}:${delivery.recipient.id}:${options.threadTs ?? ""}`;
	const sent = await slackSendQueue.enqueue(queueKey, async () => {
		try {
			const { client, identity, recipient, unfurl } = delivery;
			if (opts.replyBroadcast && opts.mediaUrl) throw new Error("Slack replyBroadcast is only supported for text or block thread replies.");
			const directUserPostChannelId = !opts.deliveryQueueId && recipient.kind === "user" && !opts.mediaUrl && !opts.threadTs ? recipient.id : void 0;
			const channelId = directUserPostChannelId ? directUserPostChannelId : await resolveChannelId(client, recipient, {
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
						[SLACK_QUESTION_FINALIZATION_BLOCKS]: deliveredBlocks
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
			const textChunkLimit = Math.min(opts.textLimit ?? resolveTextChunkLimit(cfg, "slack", account.accountId, { fallbackLimit: 8e3 }), SLACK_TEXT_LIMIT);
			const usesOrderedBlockAccessibility = Boolean(blocks && (hasNativeData || opts.authoredTextPlacement !== void 0));
			const orderedBlockDeliveryPlan = blocks && usesOrderedBlockAccessibility ? buildSlackNativeDataDeliveryPlan({
				baseText: nativeDataFallbackBase,
				blocks,
				textLimit: textChunkLimit
			}) : void 0;
			let pendingBlockFallback = orderedBlockDeliveryPlan?.skipOriginalBlocks ? orderedBlockDeliveryPlan : void 0;
			let lastMessageId = "";
			let deliveredChannelId = channelId;
			let canonicalDeliveredThreadTs;
			let sendIdentity = identity;
			const postPart = async (part) => {
				const posted = await postSlackMessageBestEffort({
					client,
					channelId,
					threadTs: opts.threadTs,
					identity: sendIdentity,
					unfurl,
					...part,
					...opts.literalText ? { literalText: true } : {}
				});
				const { response } = posted;
				sendIdentity = posted.identity;
				lastMessageId = response.ts;
				deliveredChannelId = (typeof response.channel === "string" ? normalizeOptionalString(response.channel) : null) ?? deliveredChannelId;
				const responseThreadTs = resolvePostedMessageThreadTs(response);
				canonicalDeliveredThreadTs ??= responseThreadTs;
				return await reportDelivery(createSlackSendResult(response.ts, deliveredChannelId, part.blocks ? "card" : "text", responseThreadTs ?? normalizeSlackThreadTsCandidate(opts.threadTs)), part.blocks);
			};
			if (blocks && opts.mediaUrl) throw new Error("Slack send does not support blocks with mediaUrl");
			if (blocks) {
				if (pendingBlockFallback) logVerbose("slack send: native data accessibility exceeds hard limit, using text fallback");
				else {
					let accessibilityText = orderedBlockDeliveryPlan?.accessibilityText;
					if (accessibilityText === void 0) {
						const fallback = buildSlackCompleteBlocksFallbackText(blocks);
						accessibilityText = truncateSlackText(trimmedMessage ? [trimmedMessage, ...fallback.includes(trimmedMessage) ? [] : [fallback]].join("\n\n") : fallback, SLACK_TEXT_LIMIT);
					}
					const initialBlockMetadata = withSlackDeliveryMetadata(opts.metadata, {
						queueId: opts.deliveryQueueId,
						channelId,
						threadTs: opts.threadTs,
						partIndex: 0,
						partCount: 1
					});
					await dispatchOnce();
					try {
						return await postPart({
							text: accessibilityText,
							replyBroadcast: opts.replyBroadcast,
							blocks,
							metadata: initialBlockMetadata,
							...usesOrderedBlockAccessibility ? { mrkdwn: false } : {}
						});
					} catch (error) {
						if (!hasNativeData || !isSlackInvalidBlocksError(error)) throw error;
						logVerbose("slack send: native data rejected, delivering complete text fallback");
						pendingBlockFallback = orderedBlockDeliveryPlan;
					}
				}
			}
			let messages;
			if (pendingBlockFallback) messages = pendingBlockFallback.fallbackMessages;
			else {
				let resolvedChunks;
				if (opts.textIsSlackPlainText || opts.literalText) resolvedChunks = trimmedMessage ? chunkTextForOutbound(trimmedMessage, textChunkLimit, { preserveWhitespace: true }) : [];
				else if (opts.textIsSlackMrkdwn) resolvedChunks = resolveTextChunksWithFallback(trimmedMessage, chunkSlackMrkdwnText(trimmedMessage, textChunkLimit));
				else {
					const tableMode = resolveMarkdownTableMode({
						cfg,
						channel: "slack",
						...account.accountId ? { accountId: account.accountId } : {}
					});
					const chunkMode = resolveChunkMode(cfg, "slack", account.accountId);
					const chunks = (chunkMode === "newline" ? chunkMarkdownTextWithMode(trimmedMessage, textChunkLimit, chunkMode) : [trimmedMessage]).flatMap((markdown) => markdownToSlackMrkdwnChunks(markdown, textChunkLimit, { tableMode }));
					resolvedChunks = resolveTextChunksWithFallback(trimmedMessage, chunks);
				}
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
					await reportDelivery(createSlackSendResult(lastMessageId, channelId, "media", normalizeSlackThreadTsCandidate(opts.threadTs)));
					chunksToPost = rest;
				} else chunksToPost = resolvedChunks.length ? resolvedChunks : [""];
				messages = chunksToPost.map((text) => opts.textIsSlackPlainText ? {
					text,
					mrkdwn: false
				} : { text });
			}
			let questionDelivery;
			for (const [partIndex, part] of messages.entries()) {
				const carriesPrimaryMessageOptions = partIndex === 0 && !opts.mediaUrl;
				const baseMetadata = carriesPrimaryMessageOptions ? opts.metadata : void 0;
				const metadata = opts.mediaUrl ? baseMetadata : withSlackDeliveryMetadata(baseMetadata, {
					queueId: opts.deliveryQueueId,
					channelId,
					threadTs: opts.threadTs,
					partIndex,
					partCount: messages.length
				});
				if (partIndex === 0 && !opts.mediaUrl) await dispatchOnce();
				const partDelivery = await postPart({
					...part,
					replyBroadcast: carriesPrimaryMessageOptions ? opts.replyBroadcast : void 0,
					metadata
				});
				if (pendingBlockFallback && partDelivery.meta?.slackQuestionActionIds.length) questionDelivery = partDelivery;
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
		} catch (err) {
			throw enrichSlackWebApiError(err);
		}
	});
	const threadTs = sent.threadTs ?? normalizeSlackThreadTsCandidate(opts.threadTs);
	if (threadTs && sent.channelId && account.accountId) recordSlackThreadParticipation(account.accountId, sent.channelId, threadTs, { teamId: delivery.teamId });
	return sent;
}
export { clearSlackThreadFailureNotice as a, hasSlackThreadParticipation as c, recordSlackThreadParticipation as d, requireSlackPostMessageTimestamp as f, chunkSlackTextAtHardLimit as g, buildSlackNativeDataDeliveryPlan as h, updateMessageSlack as i, hasSlackThreadParticipationWithPersistence as l, hasSlackMessageIdentity as m, send_exports as n, clearSlackThreadParticipationCache as o, buildSlackMessageIdentityPayload as p, setSlackDefaultSendIdentity as r, hasSlackThreadFailureNotice as s, sendMessageSlack as t, recordSlackThreadFailureNotice as u };
