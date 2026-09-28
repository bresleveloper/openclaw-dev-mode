import { t as __exportAll } from "./rolldown-runtime-D7D4PA-g.mjs";
import { a as resolveDefaultSlackAccountId, o as resolveSlackAccount, p as resolveSlackBotToken } from "./accounts-BBHvg0pY.mjs";
import { A as countSlackTextUtf8Bytes, C as buildSlackBlocksFallbackText, E as SLACK_EDIT_TEXT_MAX_BYTES, M as truncateSlackTextByUtf8Bytes, Mt as SLACK_PRIVATE_ACTION_DELIVERY_RESULT, S as stripSlackNativeDataBlocks, T as renderSlackBlockFallbackText, Y as normalizeSlackOutboundText, f as assertSlackDetachedTargetAllowed, h as appendSlackNativeDataPlainTextFallback, lt as validateSlackBlocksArray, m as appendSlackNativeDataFallbackText, ot as escapeSlackMrkdwn, v as hasSlackNativeDataBlock, w as buildSlackCompleteBlocksFallbackText, y as isSlackInvalidBlocksError } from "./session-status-Cf7AvWOt.mjs";
import { n as formatSlackTarget } from "./target-parsing-DEsPjngB.mjs";
import { g as getSlackWriteClient, l as createSlackLookupClient, m as createSlackWriteClient } from "./probe-DiYIMPJo.mjs";
import { m as buildSlackNativeDataDeliveryPlan, r as sendMessageSlack } from "./send-Cp6omkOg.mjs";
import { normalizeAccountId } from "openclaw/plugin-sdk/account-resolution";
import { normalizeLowercaseStringOrEmpty, normalizeOptionalLowercaseString, normalizeOptionalString } from "openclaw/plugin-sdk/string-coerce-runtime";
import { createSubsystemLogger, logVerbose, logVerbose as logVerbose$1 } from "openclaw/plugin-sdk/runtime-env";
import { resolveMarkdownTableMode } from "openclaw/plugin-sdk/markdown-table-runtime";
import { captureChannelReadAuthority as captureChannelReadAuthority$1 } from "openclaw/plugin-sdk/fetch-runtime";
import { fetchWithRuntimeDispatcher as fetchWithRuntimeDispatcher$1 } from "openclaw/plugin-sdk/runtime-fetch";
import { redactToolPayloadText } from "openclaw/plugin-sdk/logging-core";
import { z } from "zod";
import { requireRuntimeConfig } from "openclaw/plugin-sdk/plugin-config-runtime";
import fs from "node:fs/promises";
import { runTasksWithConcurrency } from "openclaw/plugin-sdk/concurrency-runtime";
import { formatErrorMessage, toErrorObject } from "openclaw/plugin-sdk/error-runtime";
import { normalizeHostname } from "openclaw/plugin-sdk/host-runtime";
import { resolveRequestUrl } from "openclaw/plugin-sdk/request-url";
import { saveRemoteMedia, unlinkIfExists } from "openclaw/plugin-sdk/media-runtime";
//#region extensions/slack/src/conversation-open.ts
function parseSlackConversationOpenInput(userIds, teamId) {
	const users = z.array(z.string().trim().regex(/^[UW][A-Z0-9]+$/)).min(1).max(8).parse(userIds);
	if (new Set(users).size !== users.length) throw new Error("Slack conversation-open requires distinct userIds.");
	return {
		users,
		teamId: teamId === void 0 ? void 0 : z.string().trim().regex(/^T[A-Z0-9]+$/i).parse(teamId)
	};
}
async function openSlackConversationWithClient(client, input) {
	const channelId = (await client.conversations.open({ users: input.users.join(",") })).channel?.id?.trim();
	if (!channelId || !/^[CDG][A-Z0-9]+$/i.test(channelId)) throw new Error("Slack conversations.open did not return a valid conversation ID.");
	return {
		channelId,
		target: formatSlackTarget({
			teamId: input.teamId,
			kind: "channel",
			id: channelId,
			explicitKind: true
		})
	};
}
//#endregion
//#region extensions/slack/src/edit-text.ts
function buildSlackEditTextPayload(content, blocks) {
	const trimmedContent = content.trim();
	const blockText = blocks?.length ? buildSlackCompleteBlocksFallbackText(blocks).trim() : "";
	if (trimmedContent && !blockText) return trimmedContent;
	if (trimmedContent) {
		const nativePlainText = blocks?.length ? appendSlackNativeDataPlainTextFallback("", blocks).trim() : "";
		const fallbackText = Boolean(blockText && trimmedContent.includes(blockText)) || Boolean(nativePlainText && trimmedContent.includes(nativePlainText)) ? trimmedContent : blockText && !blockText.includes(trimmedContent) ? `${trimmedContent}\n\n${blockText}` : blockText || trimmedContent;
		return truncateSlackTextByUtf8Bytes(fallbackText, SLACK_EDIT_TEXT_MAX_BYTES);
	}
	if (blockText) return truncateSlackTextByUtf8Bytes(blockText, SLACK_EDIT_TEXT_MAX_BYTES);
	return " ";
}
//#endregion
//#region extensions/slack/src/monitor/block-text.ts
function readSlackBlockType(block) {
	return block && typeof block === "object" && !Array.isArray(block) ? block.type : void 0;
}
function hasSlackTableBlock(blocks) {
	return blocks?.some((block) => readSlackBlockType(block) === "table") ?? false;
}
function hasSlackMessageTableBlock(message) {
	return hasSlackTableBlock(message.blocks) || message.attachments?.some((attachment) => !isSlackUnfurlAttachment(attachment) && hasSlackTableBlock(attachment.blocks)) === true;
}
function isSlackUnfurlAttachment(attachment) {
	return attachment.is_msg_unfurl === true || attachment.is_app_unfurl === true || typeof attachment.app_unfurl_url === "string" && attachment.app_unfurl_url.trim().length > 0;
}
function resolveSlackBlocksText(blocks) {
	if (!blocks?.length) return;
	const parts = [];
	let hasRichText = false;
	let hasNativeData = false;
	for (const block of blocks) {
		const blockType = readSlackBlockType(block);
		hasRichText ||= blockType === "rich_text";
		hasNativeData ||= blockType === "data_visualization" || blockType === "data_table" || blockType === "table";
		const text = renderSlackBlockFallbackText(block, {
			nativeDataFormat: "plain",
			nativeReferenceFormat: "plain"
		});
		if (text) parts.push(text);
	}
	return parts.length > 0 ? {
		text: parts.join("\n"),
		hasRichText,
		hasNativeData
	} : void 0;
}
function appendDistinctSlackText(base, addition) {
	if (!base) return addition;
	const comparableBase = `\n${base.replace(/\r\n?/g, "\n")}\n`;
	const comparableAddition = `\n${addition.replace(/\r\n?/g, "\n")}\n`;
	if (comparableBase.includes(comparableAddition)) return base;
	return `${base}\n${addition}`;
}
function resolveSlackAttachmentTableTexts(attachments) {
	const seen = /* @__PURE__ */ new Set();
	const texts = [];
	for (const attachment of attachments ?? []) {
		if (isSlackUnfurlAttachment(attachment)) continue;
		for (const block of attachment.blocks ?? []) {
			if (readSlackBlockType(block) !== "table") continue;
			const text = renderSlackBlockFallbackText(block, { nativeDataFormat: "plain" });
			if (!text || seen.has(text)) continue;
			seen.add(text);
			texts.push(text);
		}
	}
	return texts;
}
/** Resolve agent-visible Slack text while admitting only native tables from attachments. */
function resolveSlackMessageText(message, options = {}) {
	let resolved = chooseSlackPrimaryText({
		messageText: options.preserveMessageTextWhitespace ? typeof message.text === "string" && message.text.trim().length > 0 ? message.text : void 0 : normalizeOptionalString(message.text),
		blocksText: resolveSlackBlocksText(message.blocks)
	});
	for (const tableText of resolveSlackAttachmentTableTexts(message.attachments)) resolved = appendDistinctSlackText(resolved, tableText);
	return resolved;
}
function chooseSlackPrimaryText(params) {
	const { messageText, blocksText } = params;
	if (!blocksText) return messageText;
	if (!messageText) return blocksText.text;
	if (blocksText.hasNativeData) {
		const comparableMessageText = messageText.replace(/\s+/g, " ").trim();
		const comparableBlocksText = blocksText.text.replace(/\s+/g, " ").trim();
		if (comparableMessageText.includes(comparableBlocksText)) return messageText;
		return comparableBlocksText.startsWith(comparableMessageText) ? blocksText.text : `${messageText}\n${blocksText.text}`;
	}
	if (blocksText.hasRichText && blocksText.text.length > messageText.length) return blocksText.text;
	return blocksText.text.length > messageText.length && blocksText.text.startsWith(messageText) ? blocksText.text : messageText;
}
//#endregion
//#region extensions/slack/src/file-reference.ts
function formatSlackFileReference(file) {
	const name = normalizeOptionalString(file?.name) ?? "file";
	const mimetype = normalizeOptionalString(file?.mimetype);
	const size = file?.size;
	const fileId = normalizeOptionalString(file?.id);
	const metadata = [
		mimetype,
		typeof size === "number" && Number.isSafeInteger(size) && size >= 0 ? `${size} bytes` : void 0,
		fileId ? `fileId: ${fileId}` : void 0
	].filter((value) => value !== void 0);
	return metadata.length > 0 ? `${name} (${metadata.join(", ")})` : name;
}
function formatSlackFileReferenceList(files) {
	if (!files?.length) return "file";
	return files.map((file) => formatSlackFileReference(file)).join(", ");
}
//#endregion
//#region extensions/slack/src/monitor/media.runtime.ts
const slackMediaLog = createSubsystemLogger("gateway/channels/slack").child("media");
//#endregion
//#region extensions/slack/src/monitor/slack-client-kind.ts
/** Detects the isolated GovSlack API plane without consulting mutable config. */
function isGovSlackClient(client) {
	if (!client?.slackApiUrl) return false;
	try {
		const apiUrl = new URL(client.slackApiUrl);
		return apiUrl.protocol === "https:" && !apiUrl.port && normalizeHostname(apiUrl.hostname) === "slack-gov.com";
	} catch {
		return false;
	}
}
//#endregion
//#region extensions/slack/src/monitor/media.ts
var media_exports = /* @__PURE__ */ __exportAll({
	SLACK_MEDIA_READ_IDLE_TIMEOUT_MS: () => SLACK_MEDIA_READ_IDLE_TIMEOUT_MS,
	resolveSlackAttachmentContent: () => resolveSlackAttachmentContent,
	resolveSlackMedia: () => resolveSlackMedia
});
function isSlackHostname(hostname, govSlack) {
	const normalized = normalizeHostname(hostname);
	if (!normalized) return false;
	if (govSlack) return normalized === "files.slack-gov.com";
	return [
		"slack.com",
		"slack-edge.com",
		"slack-files.com"
	].some((suffix) => normalized === suffix || normalized.endsWith(`.${suffix}`));
}
function assertSlackFileUrl(rawUrl, govSlack) {
	let parsed;
	try {
		parsed = new URL(rawUrl);
	} catch {
		throw new Error(`Invalid Slack file URL: ${rawUrl}`);
	}
	if (parsed.protocol !== "https:") throw new Error(`Refusing Slack file URL with non-HTTPS protocol: ${parsed.protocol}`);
	if (!isSlackHostname(parsed.hostname, govSlack)) throw new Error(`Refusing to send Slack token to non-Slack host "${parsed.hostname}" (url: ${rawUrl})`);
	return parsed;
}
function createSlackAuthHeaders(token) {
	return { Authorization: `Bearer ${token}` };
}
function captureSlackMediaReadGuard(params) {
	const inherited = captureChannelReadAuthority$1();
	const { assertCurrent, abortSignal } = params;
	if (!assertCurrent && !abortSignal) return inherited;
	return () => {
		inherited?.();
		abortSignal?.throwIfAborted();
		assertCurrent?.();
	};
}
function createSlackMediaRequest(url, token, govSlack) {
	return {
		url: assertSlackFileUrl(url, govSlack).href,
		requestInit: { headers: createSlackAuthHeaders(token) }
	};
}
function createSlackMediaFetch(govSlack, assertReadAuthority = captureChannelReadAuthority$1()) {
	return async (input, init) => {
		const url = resolveRequestUrl(input);
		if (!url) throw new Error("Unsupported fetch input: expected string, URL, or Request");
		const parsed = assertSlackFileUrl(url, govSlack);
		const fetchImpl = "dispatcher" in (init ?? {}) ? fetchWithRuntimeDispatcher$1 : globalThis.fetch;
		assertReadAuthority?.();
		return fetchImpl(parsed.href, {
			...init,
			redirect: "manual"
		});
	};
}
const SLACK_MEDIA_SSRF_POLICY = {
	allowedHostnames: [
		"*.slack.com",
		"*.slack-edge.com",
		"*.slack-files.com"
	],
	hostnameAllowlist: [
		"*.slack.com",
		"*.slack-edge.com",
		"*.slack-files.com"
	],
	allowRfc2544BenchmarkRange: true
};
const SLACK_GOV_MEDIA_SSRF_POLICY = {
	hostnameAllowlist: ["files.slack-gov.com"],
	allowRfc2544BenchmarkRange: true
};
const SLACK_MEDIA_READ_IDLE_TIMEOUT_MS = 6e4;
const SLACK_MEDIA_TOTAL_TIMEOUT_MS = 12e4;
async function saveSlackMedia(params) {
	const timeoutAbortController = params.totalTimeoutMs ? new AbortController() : void 0;
	const abortSignals = [
		params.abortSignal,
		params.options.requestInit?.signal ?? void 0,
		timeoutAbortController?.signal
	].filter((signal) => Boolean(signal));
	const signal = abortSignals.length > 1 ? AbortSignal.any(abortSignals) : abortSignals[0];
	let timedOut = false;
	let timeoutHandle = null;
	const savePromise = saveRemoteMedia({
		...params.options,
		readIdleTimeoutMs: params.readIdleTimeoutMs ?? 6e4,
		...signal ? { requestInit: {
			...params.options.requestInit,
			signal
		} } : {}
	}).catch((error) => {
		if (timedOut) return new Promise(() => {});
		throw error;
	});
	try {
		if (!params.totalTimeoutMs) return await savePromise;
		const timeoutPromise = new Promise((_, reject) => {
			timeoutHandle = setTimeout(() => {
				timedOut = true;
				timeoutAbortController?.abort();
				reject(/* @__PURE__ */ new Error(`slack media download timed out after ${params.totalTimeoutMs}ms`));
			}, params.totalTimeoutMs);
			timeoutHandle.unref?.();
		});
		return await Promise.race([savePromise, timeoutPromise]);
	} finally {
		if (timeoutHandle) clearTimeout(timeoutHandle);
	}
}
/**
* Slack voice messages (audio clips, huddle recordings) carry a `subtype` of
* `"slack_audio"` but are served with a `video/*` MIME type (e.g. `video/mp4`,
* `video/webm`).  Override the primary type to `audio/` so the
* media-understanding pipeline routes them to transcription.
*/
function resolveSlackMediaMimetype(file, fetchedContentType) {
	const mime = fetchedContentType ?? file.mimetype;
	if (file.subtype === "slack_audio" && mime?.startsWith("video/")) return mime.replace("video/", "audio/");
	return mime;
}
function looksLikeHtmlBuffer(buffer) {
	const head = normalizeLowercaseStringOrEmpty(buffer.subarray(0, 512).toString("utf-8").replace(/^\s+/, ""));
	return head.startsWith("<!doctype html") || head.startsWith("<html");
}
async function looksLikeHtmlFile(filePath) {
	const handle = await fs.open(filePath, "r").catch(() => null);
	if (!handle) return false;
	try {
		const buffer = Buffer.alloc(512);
		const { bytesRead } = await handle.read(buffer, 0, buffer.byteLength, 0);
		return looksLikeHtmlBuffer(buffer.subarray(0, bytesRead));
	} finally {
		await handle.close().catch(() => void 0);
	}
}
const MAX_SLACK_MEDIA_CONCURRENCY = 3;
const MAX_SLACK_FORWARDED_ATTACHMENTS = 8;
const SLACK_MEDIA_LIMIT_REASON = `omitted: 8-file limit`;
function formatSlackMediaFailure(error) {
	return redactToolPayloadText(formatErrorMessage(error)).replace(/\s+/g, " ").slice(0, 200);
}
async function fetchFreshSlackFileUrl(params) {
	if (!params.file.id || !params.client) return null;
	const assertCurrent = captureSlackMediaReadGuard(params);
	try {
		assertCurrent?.();
		const info = await params.client.files.info({ file: params.file.id });
		assertCurrent?.();
		const freshFile = info.file;
		if (freshFile && params.isRefreshedFileAllowed?.(freshFile) === false) {
			logVerbose$1(`slack: refreshed file metadata rejected for file id=${params.file.id}`);
			return null;
		}
		const freshUrl = freshFile?.url_private_download ?? freshFile?.url_private;
		if (freshUrl) {
			logVerbose$1(`slack: refreshed file URL via files.info for file id=${params.file.id}`);
			return freshUrl;
		}
		logVerbose$1(`slack: files.info returned no private URL for file id=${params.file.id}`);
		return null;
	} catch (error) {
		assertCurrent?.();
		logVerbose$1(`slack: files.info failed for file id=${params.file.id}: ${formatErrorMessage(error)}`);
		return null;
	}
}
async function downloadSlackMediaFile(params) {
	const assertReadAuthority = captureSlackMediaReadGuard(params);
	assertReadAuthority?.();
	const { url: slackUrl, requestInit } = createSlackMediaRequest(params.url, params.token, params.govSlack);
	const saved = await saveSlackMedia({
		options: {
			url: slackUrl,
			fetchImpl: createSlackMediaFetch(params.govSlack, assertReadAuthority),
			beforeRequest: assertReadAuthority,
			assertCurrent: params.assertCurrent,
			requestInit,
			filePathHint: params.file.name,
			fallbackContentType: resolveSlackMediaMimetype(params.file, params.file.mimetype),
			maxBytes: params.maxBytes,
			ssrfPolicy: params.govSlack ? SLACK_GOV_MEDIA_SSRF_POLICY : SLACK_MEDIA_SSRF_POLICY
		},
		readIdleTimeoutMs: params.readIdleTimeoutMs,
		totalTimeoutMs: params.totalTimeoutMs ?? SLACK_MEDIA_TOTAL_TIMEOUT_MS,
		abortSignal: params.abortSignal
	});
	const fileMime = normalizeOptionalLowercaseString(params.file.mimetype);
	const fileName = normalizeLowercaseStringOrEmpty(params.file.name);
	if (!(fileMime === "text/html" || fileName.endsWith(".html") || fileName.endsWith(".htm"))) {
		if (normalizeOptionalLowercaseString(saved.contentType?.split(";")[0]) === "text/html" || await looksLikeHtmlFile(saved.path)) {
			await unlinkIfExists(saved.path);
			throw new Error("blocked: unexpected HTML content");
		}
	}
	const effectiveMime = resolveSlackMediaMimetype(params.file, saved.contentType);
	const label = saved.fileName ?? params.file.name;
	const contentType = effectiveMime ?? saved.contentType;
	return {
		path: saved.path,
		...contentType ? { contentType } : {},
		...label ? { fileName: label } : {},
		placeholder: `[Slack file: ${formatSlackFileReference({
			...params.file,
			name: label
		})}]`
	};
}
function isForwardedSlackAttachment(attachment) {
	return attachment.is_share === true;
}
function resolveForwardedAttachmentImageUrl(attachment, govSlack) {
	const rawUrl = attachment.image_url?.trim();
	if (!rawUrl) return null;
	try {
		const parsed = new URL(rawUrl);
		if (parsed.protocol !== "https:" || !isSlackHostname(parsed.hostname, govSlack)) return null;
		return parsed.toString();
	} catch {
		return null;
	}
}
/**
* Downloads all files attached to a Slack message and returns them as an array.
* Returns `null` when no files could be downloaded.
*/
async function resolveSlackMedia(params) {
	const assertCurrent = captureSlackMediaReadGuard(params);
	const govSlack = isGovSlackClient(params.client);
	const files = params.files ?? [];
	const limitedFiles = files.length > 8 ? files.slice(0, 8) : files;
	for (const file of files.slice(8)) params.unavailableFiles?.set(file, SLACK_MEDIA_LIMIT_REASON);
	const refreshFileUrl = (file) => fetchFreshSlackFileUrl({
		file,
		client: params.client,
		isRefreshedFileAllowed: params.isRefreshedFileAllowed,
		assertCurrent: params.assertCurrent,
		abortSignal: params.abortSignal
	});
	const { results, hasError, firstError } = await runTasksWithConcurrency({
		tasks: limitedFiles.map((file) => async () => {
			assertCurrent?.();
			const preloaded = params.preloadedMedia?.get(file);
			if (preloaded) return preloaded;
			const eventUrl = file.url_private_download ?? file.url_private;
			let url = eventUrl ?? await refreshFileUrl(file);
			let reason = "no private download URL";
			for (let attempt = 0; url && attempt < 2; attempt += 1) {
				try {
					return await downloadSlackMediaFile({
						...params,
						file,
						url,
						govSlack
					});
				} catch (error) {
					reason = formatSlackMediaFailure(error);
				}
				assertCurrent?.();
				url = attempt === 0 && eventUrl ? await refreshFileUrl(file) : null;
			}
			params.unavailableFiles?.set(file, reason);
			slackMediaLog.warn(`slack: file ${formatSlackFileReference(file)} unavailable (${reason})`);
			return null;
		}),
		limit: MAX_SLACK_MEDIA_CONCURRENCY,
		errorMode: "stop"
	});
	if (hasError) throw toErrorObject(firstError, "Slack media read failed");
	const resolved = results.filter((result) => result !== null);
	return resolved.length > 0 ? resolved : null;
}
/** Extracts text and media from forwarded-message attachments. Returns null when empty. */
async function resolveSlackAttachmentContent(params) {
	const forwardedAttachments = (params.attachments ?? []).filter((attachment) => isForwardedSlackAttachment(attachment)).slice(0, MAX_SLACK_FORWARDED_ATTACHMENTS);
	const candidates = [...params.files ?? [], ...forwardedAttachments.flatMap((attachment) => attachment.files ?? [])];
	if (forwardedAttachments.length === 0 && candidates.length === 0) return null;
	const fileIds = /* @__PURE__ */ new Set();
	const allFiles = candidates.filter((file) => {
		const fileId = normalizeOptionalString(file.id);
		if (!fileId) return true;
		if (fileIds.has(fileId)) return false;
		fileIds.add(fileId);
		return true;
	}).map((file, index) => {
		if (index >= 8) return file;
		const fileId = normalizeOptionalString(file.id);
		const preloaded = fileId && candidates.find((candidate) => normalizeOptionalString(candidate.id) === fileId && params.preloadedMedia?.has(candidate));
		if (preloaded) return preloaded;
		if (!fileId || file.url_private_download || file.url_private) return file;
		const downloadable = candidates.find((candidate) => normalizeOptionalString(candidate.id) === fileId && (candidate.url_private_download || candidate.url_private));
		return downloadable ? Object.assign({}, file, downloadable) : file;
	});
	const pendingFiles = new Map(allFiles.slice(0, 8).map((file) => [normalizeOptionalString(file.id) ?? file, file]));
	const unavailableFileReasons = /* @__PURE__ */ new Map();
	const resolveFiles = (files) => resolveSlackMedia({
		...params,
		unavailableFiles: unavailableFileReasons,
		files: files?.flatMap((file) => {
			const key = normalizeOptionalString(file.id) ?? file;
			const selected = pendingFiles.get(key);
			pendingFiles.delete(key);
			return selected ? [selected] : [];
		})
	});
	const textBlocks = [];
	let unavailableMediaCount = 0;
	const govSlack = isGovSlackClient(params.client);
	const { results, hasError, firstError } = await runTasksWithConcurrency({
		tasks: [() => resolveFiles(params.files), async () => {
			const attachmentMedia = [];
			for (const att of forwardedAttachments) {
				const text = att.text?.trim() || att.fallback?.trim();
				if (text) {
					const author = att.author_name;
					const heading = author ? `[Forwarded message from ${author}]` : "[Forwarded message]";
					textBlocks.push(`${heading}\n${text}`);
				}
				const imageUrl = resolveForwardedAttachmentImageUrl(att, govSlack);
				if (imageUrl) try {
					const { url: slackUrl, requestInit } = createSlackMediaRequest(imageUrl, params.token, govSlack);
					const assertReadAuthority = captureSlackMediaReadGuard(params);
					const saved = await saveSlackMedia({
						options: {
							url: slackUrl,
							fetchImpl: createSlackMediaFetch(govSlack, assertReadAuthority),
							beforeRequest: assertReadAuthority,
							assertCurrent: params.assertCurrent,
							requestInit,
							maxBytes: params.maxBytes,
							ssrfPolicy: govSlack ? SLACK_GOV_MEDIA_SSRF_POLICY : SLACK_MEDIA_SSRF_POLICY
						},
						readIdleTimeoutMs: params.readIdleTimeoutMs,
						totalTimeoutMs: params.totalTimeoutMs ?? SLACK_MEDIA_TOTAL_TIMEOUT_MS,
						abortSignal: params.abortSignal
					});
					const label = saved.fileName ?? "forwarded image";
					attachmentMedia.push({
						path: saved.path,
						contentType: saved.contentType,
						...saved.fileName ? { fileName: saved.fileName } : {},
						placeholder: `[Forwarded image: ${label}]`
					});
				} catch (error) {
					unavailableMediaCount += 1;
					slackMediaLog.warn(`slack: forwarded image unavailable (${formatSlackMediaFailure(error)})`);
				}
				attachmentMedia.push(...await resolveFiles(att.files) ?? []);
			}
			return attachmentMedia;
		}],
		limit: 2,
		errorMode: "stop"
	});
	if (hasError) throw toErrorObject(firstError, "Slack attachment read failed");
	const allMedia = results.flatMap((media) => media ?? []);
	const unavailableFiles = allFiles.flatMap((file, index) => {
		const reason = index >= 8 ? SLACK_MEDIA_LIMIT_REASON : unavailableFileReasons.get(file);
		return reason ? [{
			...file,
			reason
		}] : [];
	});
	unavailableMediaCount += unavailableFiles.length;
	const combinedText = textBlocks.join("\n\n");
	if (!combinedText && allMedia.length === 0 && allFiles.length === 0 && unavailableMediaCount === 0) return null;
	return {
		text: combinedText,
		media: allMedia,
		unavailableMediaCount,
		...unavailableFiles.length > 0 ? { files: unavailableFiles } : {}
	};
}
//#endregion
//#region extensions/slack/src/actions.ts
var actions_exports = /* @__PURE__ */ __exportAll({
	deleteSlackMessage: () => deleteSlackMessage,
	downloadSlackFile: () => downloadSlackFile,
	editSlackMessage: () => editSlackMessage,
	editSlackRenderedMessage: () => editSlackRenderedMessage,
	getSlackMemberInfo: () => getSlackMemberInfo,
	listSlackEmojis: () => listSlackEmojis,
	listSlackPins: () => listSlackPins,
	listSlackReactions: () => listSlackReactions,
	openSlackConversation: () => openSlackConversation,
	pinSlackMessage: () => pinSlackMessage,
	reactSlackMessage: () => reactSlackMessage,
	readSlackMessages: () => readSlackMessages,
	removeOwnSlackReactions: () => removeOwnSlackReactions,
	removeSlackReaction: () => removeSlackReaction,
	resolveSlackConversationName: () => resolveSlackConversationName,
	sendSlackMessage: () => sendSlackMessage,
	unpinSlackMessage: () => unpinSlackMessage
});
function renderSlackReadMessageText(message) {
	if (!hasSlackMessageTableBlock(message)) return message;
	const text = resolveSlackMessageText(message, { preserveMessageTextWhitespace: true });
	return text && text !== message.text ? {
		...message,
		text
	} : message;
}
function resolveToken(explicit, accountId, cfg) {
	if (explicit?.trim()) {
		const token = resolveSlackBotToken(explicit);
		if (token) return token;
	}
	if (!cfg) throw new Error("Slack actions requires a resolved runtime config. Load and resolve config at the command or gateway boundary, then pass cfg through the runtime path.");
	const resolvedCfg = requireRuntimeConfig(cfg, "Slack actions");
	const account = resolveSlackAccount({
		cfg: resolvedCfg,
		accountId
	});
	const token = resolveSlackBotToken(account.botToken ?? void 0);
	if (!token) {
		logVerbose(`slack actions: missing bot token for account=${account.accountId} explicit=${Boolean(explicit)} source=${account.botTokenSource ?? "unknown"}`);
		throw new Error("SLACK_BOT_TOKEN or channels.slack.botToken is required for Slack actions");
	}
	return token;
}
const SLACK_EMOJI_SKIN_TONE_MODIFIER_RE = /[\u{1F3FB}-\u{1F3FF}]/u;
const SLACK_EMOJI_VARIATION_SELECTOR_RE = /[\uFE0E\uFE0F]/g;
const SLACK_EMOJI_SKIN_TONE_BY_MODIFIER = /* @__PURE__ */ new Map([
	["🏻", 2],
	["🏼", 3],
	["🏽", 4],
	["🏾", 5],
	["🏿", 6]
]);
const SLACK_EMOJI_SHORTNAME_BY_GLYPH = /* @__PURE__ */ new Map([
	["✅", "white_check_mark"],
	["❌", "x"],
	["👍", "thumbsup"],
	["👎", "thumbsdown"],
	["🎉", "tada"],
	["❤", "heart"],
	["😄", "smile"],
	["😂", "joy"],
	["🚀", "rocket"],
	["👀", "eyes"],
	["🙏", "pray"],
	["🔥", "fire"],
	["💯", "100"],
	["⚠", "warning"],
	["➕", "heavy_plus_sign"],
	["➖", "heavy_minus_sign"],
	["🤔", "thinking_face"],
	["👨‍💻", "male-technologist"],
	["👨💻", "male-technologist"],
	["👩‍💻", "female-technologist"],
	["⚡", "zap"],
	["🌐", "globe_with_meridians"],
	["😱", "scream"],
	["🥱", "yawning_face"],
	["😨", "fearful"],
	["⏳", "hourglass_flowing_sand"],
	["✍", "writing_hand"],
	["🗜", "compression"],
	["🧠", "brain"],
	["🛠", "hammer_and_wrench"],
	["💻", "computer"]
]);
function normalizeSlackEmojiName(raw) {
	const trimmed = raw.trim();
	if (!trimmed) throw new Error("Emoji is required for Slack reactions");
	const withoutColons = trimmed.replace(/^:+|:+$/g, "");
	const modifier = withoutColons.match(SLACK_EMOJI_SKIN_TONE_MODIFIER_RE)?.[0];
	const glyphKey = withoutColons.replace(SLACK_EMOJI_SKIN_TONE_MODIFIER_RE, "").replace(SLACK_EMOJI_VARIATION_SELECTOR_RE, "");
	const shortname = SLACK_EMOJI_SHORTNAME_BY_GLYPH.get(glyphKey);
	const skinTone = modifier ? SLACK_EMOJI_SKIN_TONE_BY_MODIFIER.get(modifier) : void 0;
	if (!shortname || !skinTone) return shortname ?? withoutColons;
	return `${shortname}::skin-tone-${skinTone}`;
}
const SLACK_TIMESTAMP_RE = /^\d+(?:\.\d+)?$/;
const ISO_8601_TIMESTAMP_SCHEMA = z.iso.datetime({ offset: true });
function formatEpochSeconds(milliseconds) {
	const seconds = milliseconds / 1e3;
	if (Number.isInteger(seconds)) return String(seconds);
	return seconds.toFixed(3).replace(/0+$/, "").replace(/\.$/, "");
}
function normalizeSlackReadTimestamp(raw, field) {
	const trimmed = raw?.trim();
	if (!trimmed) return;
	if (SLACK_TIMESTAMP_RE.test(trimmed)) return trimmed;
	if (!ISO_8601_TIMESTAMP_SCHEMA.safeParse(trimmed).success) throw new Error(`Invalid Slack read ${field} timestamp "${trimmed}": expected a Slack timestamp or ISO-8601 date string`);
	const parsed = Date.parse(trimmed);
	if (!Number.isFinite(parsed)) throw new Error(`Invalid Slack read ${field} timestamp "${trimmed}": expected a Slack timestamp or ISO-8601 date string`);
	return formatEpochSeconds(parsed);
}
function hasSlackPlatformError(err, code) {
	if (!err || typeof err !== "object") return false;
	const data = err.data;
	if (!data || typeof data !== "object") return false;
	return data.error === code;
}
async function getClient(opts = {}, mode = "read") {
	if (opts.client && !opts.assertDirectAdapterHandoff) return opts.client;
	const accountId = opts.cfg ? resolveSlackAccount({
		cfg: requireRuntimeConfig(opts.cfg, "Slack actions"),
		accountId: opts.accountId
	}).accountId : normalizeAccountId(opts.accountId);
	assertSlackDetachedTargetAllowed(accountId, opts.teamId);
	const token = resolveToken(opts.token, opts.accountId, opts.cfg);
	if (mode === "write") {
		if (opts.assertDirectAdapterHandoff) return createSlackWriteClient(token, { teamId: opts.teamId }, opts.assertDirectAdapterHandoff);
		return getSlackWriteClient(token, { teamId: opts.teamId });
	}
	return opts.assertDirectAdapterHandoff ? createSlackLookupClient(token, { teamId: opts.teamId }, opts.assertDirectAdapterHandoff) : createSlackLookupClient(token, { teamId: opts.teamId });
}
async function resolveBotUserId(client) {
	const auth = await client.auth.test();
	if (!auth?.user_id) throw new Error("Failed to resolve Slack bot user id");
	return auth.user_id;
}
async function reactSlackMessage(channelId, messageId, emoji, opts = {}) {
	const client = await getClient(opts, "write");
	try {
		await client.reactions.add({
			channel: channelId,
			timestamp: messageId,
			name: normalizeSlackEmojiName(emoji)
		});
	} catch (err) {
		if (hasSlackPlatformError(err, "already_reacted")) return;
		throw err;
	}
}
async function removeSlackReaction(channelId, messageId, emoji, opts = {}) {
	const client = await getClient(opts, "write");
	try {
		await client.reactions.remove({
			channel: channelId,
			timestamp: messageId,
			name: normalizeSlackEmojiName(emoji)
		});
	} catch (err) {
		if (hasSlackPlatformError(err, "no_reaction")) return;
		throw err;
	}
}
async function removeOwnSlackReactions(channelId, messageId, opts = {}) {
	const client = await getClient(opts, "write");
	const userId = await resolveBotUserId(client);
	const reactions = await listSlackReactions(channelId, messageId, { client });
	const toRemove = /* @__PURE__ */ new Set();
	for (const reaction of reactions ?? []) {
		const name = reaction?.name;
		if (!name) continue;
		if ((reaction?.users ?? []).includes(userId)) toRemove.add(name);
	}
	if (toRemove.size === 0) return [];
	await Promise.all(Array.from(toRemove, (name) => removeSlackReaction(channelId, messageId, name, { client })));
	return Array.from(toRemove);
}
async function listSlackReactions(channelId, messageId, opts = {}) {
	return (await (await getClient(opts)).reactions.get({
		channel: channelId,
		timestamp: messageId,
		full: true
	})).message?.reactions ?? [];
}
async function sendSlackMessage(to, content, opts) {
	const onDeliveryResult = Object.getOwnPropertyDescriptor(opts, SLACK_PRIVATE_ACTION_DELIVERY_RESULT)?.value;
	return await sendMessageSlack(to, content, {
		accountId: opts.accountId,
		cfg: opts.cfg,
		token: opts.token,
		mediaUrl: opts.mediaUrl,
		...opts.forceDocument ? { forceDocument: true } : {},
		mediaAccess: opts.mediaAccess,
		mediaLocalRoots: opts.mediaLocalRoots,
		mediaReadFile: opts.mediaReadFile,
		client: opts.client,
		assertDirectAdapterHandoff: opts.assertDirectAdapterHandoff,
		threadTs: opts.threadTs,
		replyBroadcast: opts.replyBroadcast,
		...opts.textIsSlackMrkdwn ? { textIsSlackMrkdwn: true } : {},
		...opts.textIsSlackPlainText ? { textIsSlackPlainText: true } : {},
		...opts.authoredTextPlacement ? { authoredTextPlacement: opts.authoredTextPlacement } : {},
		...Object.hasOwn(opts, "nativeDataFallbackBaseText") ? { nativeDataFallbackBaseText: opts.nativeDataFallbackBaseText } : {},
		...opts.uploadFileName ? { uploadFileName: opts.uploadFileName } : {},
		...opts.uploadTitle ? { uploadTitle: opts.uploadTitle } : {},
		...typeof onDeliveryResult === "function" ? { onDeliveryResult } : {},
		blocks: opts.blocks
	});
}
async function editSlackMessage(channelId, messageId, content, opts = {}) {
	const accountId = opts.accountId ?? (opts.cfg ? resolveDefaultSlackAccountId(opts.cfg) : void 0);
	const tableMode = resolveMarkdownTableMode({
		cfg: opts.cfg,
		channel: "slack",
		accountId
	});
	await editSlackRenderedMessage(channelId, messageId, normalizeSlackOutboundText(content, { tableMode }), opts);
}
async function editSlackRenderedMessage(channelId, messageId, content, opts = {}) {
	const client = await getClient(opts, "write");
	const blocks = opts.blocks == null ? void 0 : validateSlackBlocksArray(opts.blocks);
	const editText = buildSlackEditTextPayload(content, blocks);
	const hasNativeData = hasSlackNativeDataBlock(blocks);
	const nativeFallbackText = hasNativeData ? appendSlackNativeDataFallbackText(editText, blocks) : editText;
	if (hasNativeData && countSlackTextUtf8Bytes(nativeFallbackText) > 4e3) throw new Error(`Slack native chart or table fallback exceeds the ${String(SLACK_EDIT_TEXT_MAX_BYTES)}-byte edit limit. Send a new message instead.`);
	const update = {
		channel: channelId,
		ts: messageId,
		text: countSlackTextUtf8Bytes(nativeFallbackText) <= 4e3 ? nativeFallbackText : truncateSlackTextByUtf8Bytes(nativeFallbackText, SLACK_EDIT_TEXT_MAX_BYTES),
		...blocks ? { blocks } : {}
	};
	try {
		await client.chat.update(update);
	} catch (error) {
		if (!hasSlackNativeDataBlock(blocks) || !isSlackInvalidBlocksError(error)) throw error;
		logVerbose("slack edit: native data block rejected, retrying with text fallback");
		const survivorBlocks = stripSlackNativeDataBlocks(blocks);
		const survivorText = buildSlackBlocksFallbackText(survivorBlocks) ?? "";
		const authoredEditText = content.trim();
		const baseText = authoredEditText && !survivorText.includes(authoredEditText) ? authoredEditText : "";
		const fallbackPlan = buildSlackNativeDataDeliveryPlan({
			baseText,
			blocks: blocks ?? []
		});
		if (fallbackPlan.fallbackMessages.length !== 1) throw new Error("Slack native chart or table edit fallback requires multiple messages. Send a new message instead.", { cause: error });
		const fallback = fallbackPlan.fallbackMessages[0];
		if (!fallback || countSlackTextUtf8Bytes(fallback.text) > 4e3) throw new Error(`Slack native chart or table fallback exceeds the ${String(SLACK_EDIT_TEXT_MAX_BYTES)}-byte edit limit. Send a new message instead.`, { cause: error });
		const fallbackText = fallback.blocks ? escapeSlackMrkdwn(fallback.text) : truncateSlackTextByUtf8Bytes(appendSlackNativeDataFallbackText(editText, blocks), SLACK_EDIT_TEXT_MAX_BYTES);
		if (countSlackTextUtf8Bytes(fallbackText) > 4e3) throw new Error(`Slack native chart or table fallback exceeds the ${String(SLACK_EDIT_TEXT_MAX_BYTES)}-byte edit limit. Send a new message instead.`, { cause: error });
		await client.chat.update({
			channel: channelId,
			ts: messageId,
			text: fallbackText,
			...fallback.blocks ? { blocks: fallback.blocks } : {}
		});
	}
}
async function deleteSlackMessage(channelId, messageId, opts = {}) {
	await (await getClient(opts, "write")).chat.delete({
		channel: channelId,
		ts: messageId
	});
}
async function openSlackConversation(userIds, opts = {}) {
	const input = parseSlackConversationOpenInput(userIds, opts.teamId);
	return await openSlackConversationWithClient(await getClient({
		...opts,
		teamId: input.teamId
	}, "write"), input);
}
async function resolveSlackConversationName(channelId, opts = {}) {
	return (await (await getClient(opts, "read")).conversations.info({ channel: channelId })).channel?.name?.trim() || void 0;
}
async function readSlackMessages(channelId, opts = {}) {
	const exactMessageId = opts.messageId?.trim();
	const readLimit = exactMessageId ? 1 : opts.limit;
	const exactBounds = exactMessageId ? {
		inclusive: true,
		latest: exactMessageId,
		oldest: exactMessageId
	} : {
		latest: normalizeSlackReadTimestamp(opts.before, "before"),
		oldest: normalizeSlackReadTimestamp(opts.after, "after")
	};
	const client = await getClient(opts);
	if (opts.threadId) {
		const oldest = exactMessageId ? exactMessageId : exactBounds.oldest && Number(exactBounds.oldest) > Number(opts.threadId) ? exactBounds.oldest : opts.threadId;
		const result = await client.conversations.replies({
			channel: channelId,
			ts: opts.threadId,
			limit: readLimit,
			...exactBounds,
			oldest
		});
		return {
			messages: (result.messages ?? []).filter((message) => {
				if (exactMessageId) return message.ts === exactMessageId;
				return message.ts !== opts.threadId;
			}).map(renderSlackReadMessageText),
			hasMore: exactMessageId ? false : Boolean(result.has_more)
		};
	}
	const result = await client.conversations.history({
		channel: channelId,
		limit: readLimit,
		...exactBounds
	});
	return {
		messages: (result.messages ?? []).filter((message) => !exactMessageId || message.ts === exactMessageId).map(renderSlackReadMessageText),
		hasMore: exactMessageId ? false : Boolean(result.has_more)
	};
}
async function getSlackMemberInfo(userId, opts = {}) {
	return await (await getClient(opts)).users.info({ user: userId });
}
async function listSlackEmojis(opts = {}) {
	return await (await getClient(opts)).emoji.list();
}
async function pinSlackMessage(channelId, messageId, opts = {}) {
	await (await getClient(opts, "write")).pins.add({
		channel: channelId,
		timestamp: messageId
	});
}
async function unpinSlackMessage(channelId, messageId, opts = {}) {
	await (await getClient(opts, "write")).pins.remove({
		channel: channelId,
		timestamp: messageId
	});
}
async function listSlackPins(channelId, opts = {}) {
	return (await (await getClient(opts)).pins.list({ channel: channelId })).items ?? [];
}
function collectSlackDirectShareChannelIds(file) {
	const ids = /* @__PURE__ */ new Set();
	for (const group of [
		file.channels,
		file.groups,
		file.ims
	]) {
		if (!Array.isArray(group)) continue;
		for (const entry of group) {
			if (typeof entry !== "string") continue;
			const normalized = normalizeOptionalString(entry);
			if (normalized) ids.add(normalized);
		}
	}
	return ids;
}
function collectSlackShareMaps(file) {
	if (!file.shares || typeof file.shares !== "object" || Array.isArray(file.shares)) return [];
	const shares = file.shares;
	return [shares.public, shares.private].filter((value) => Boolean(value) && typeof value === "object" && !Array.isArray(value));
}
function collectSlackShares(file) {
	const shares = [];
	for (const shareMap of collectSlackShareMaps(file)) for (const [rawChannelId, rawEntries] of Object.entries(shareMap)) {
		const channelId = normalizeOptionalString(rawChannelId);
		if (!channelId || !Array.isArray(rawEntries)) continue;
		for (const rawEntry of rawEntries) {
			if (!rawEntry || typeof rawEntry !== "object" || Array.isArray(rawEntry)) continue;
			const entry = rawEntry;
			const ts = typeof entry.ts === "string" ? normalizeOptionalString(entry.ts) : void 0;
			const threadTs = typeof entry.thread_ts === "string" ? normalizeOptionalString(entry.thread_ts) : void 0;
			if (ts || threadTs) shares.push({
				channelId,
				ts,
				threadTs
			});
		}
	}
	return shares;
}
function lacksSlackScopeProof(params) {
	const channelId = normalizeOptionalString(params.channelId);
	if (!channelId) return true;
	const threadId = normalizeOptionalString(params.threadId);
	const directIds = collectSlackDirectShareChannelIds(params.file);
	const shares = collectSlackShares(params.file);
	if (!(directIds.has(channelId) || shares.some((entry) => entry.channelId === channelId))) return true;
	if (!threadId) return false;
	return !shares.some((entry) => entry.channelId === channelId && (entry.threadTs === threadId || entry.ts === threadId));
}
/**
* Downloads a Slack file by ID and saves it to the local media store.
* Fetches a fresh download URL via files.info to avoid using stale private URLs.
* Returns null when the file cannot be found or downloaded.
*/
async function downloadSlackFile(fileId, opts) {
	const token = resolveToken(opts.token, opts.accountId, opts.cfg);
	const client = await getClient(opts);
	const isFileAllowed = (file) => !lacksSlackScopeProof({
		file,
		channelId: opts.channelId,
		threadId: opts.threadId
	});
	const file = (await client.files.info({ file: fileId })).file;
	if (!file?.url_private_download && !file?.url_private) return null;
	if (!isFileAllowed(file)) return null;
	return (await resolveSlackMedia({
		files: [{
			id: file.id,
			name: file.name,
			mimetype: file.mimetype,
			url_private: file.url_private,
			url_private_download: file.url_private_download
		}],
		client,
		isRefreshedFileAllowed: isFileAllowed,
		token,
		maxBytes: opts.maxBytes
	}))?.[0] ?? null;
}
//#endregion
export { hasSlackMessageTableBlock as C, resolveSlackMessageText as D, resolveSlackBlocksText as E, buildSlackEditTextPayload as O, formatSlackFileReferenceList as S, isSlackUnfurlAttachment as T, media_exports as _, editSlackRenderedMessage as a, saveRemoteMedia as b, listSlackPins as c, reactSlackMessage as d, readSlackMessages as f, unpinSlackMessage as g, sendSlackMessage as h, editSlackMessage as i, listSlackReactions as l, removeSlackReaction as m, deleteSlackMessage as n, getSlackMemberInfo as o, removeOwnSlackReactions as p, downloadSlackFile as r, listSlackEmojis as s, actions_exports as t, pinSlackMessage as u, logVerbose$1 as v, hasSlackTableBlock as w, formatSlackFileReference as x, isGovSlackClient as y };
