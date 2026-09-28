import { i as resolveLineAccount, n as normalizeAccountId, r as resolveDefaultLineAccountId, t as listLineAccountIds } from "./.setup/accounts-BBEFMYbY.mjs";
import { C as LineConfigSchema, S as LineChannelConfigSchema, _ as resolveLineGroupLookupIds, b as normalizeAllowFrom, d as createMediaPlayerCard, g as resolveLineGroupConfigEntry, h as resolveExactLineGroupConfigKey, l as createAppleTvRemoteCard, m as setLineRuntime, u as createDeviceControlCard, v as resolveLineGroupsConfig, y as firstDefined } from "./.setup/rich-messages-d8CmBVJj.mjs";
import { C as toFlexMessage, M as createAudioMessage, N as createImageMessage, P as createVideoMessage, a as probeLineBot, c as createAgendaCard, d as createActionCard, f as createImageCard, g as messageAction, h as datetimePickerAction, l as createEventCard, m as createListCard, o as resolveLineChannelAccessToken, p as createInfoCard, u as createReceiptCard, x as uriAction, y as postbackAction } from "./.setup/send-retry-DbfiHBPd.mjs";
import { a as resolveLineWebhookPath, i as parseLineWebhookBody, n as createLineNodeWebhookHandler, o as validateLineSignature, r as readLineWebhookRequestBody, s as downloadLineMedia, t as monitorLineProvider } from "./.setup/monitor-morJPcPd.mjs";
import { a as buildTemplateMessageFromPayload, c as createConfirmTemplate, i as stripMarkdown, l as createTemplateCarousel, n as hasMarkdownToConvert, o as createButtonTemplate, r as processLineMessage, s as createCarouselColumn, t as convertCodeBlockToFlexBubble } from "./.setup/markdown-to-line-CRfEHFs0.mjs";
import { _ as showLoadingAnimation, c as pushFlexMessage, d as pushMessageLine, f as pushMessagesLine, g as sendMessageLine, h as replyMessageLine, i as createTextMessageWithQuickReplies, l as pushImageMessage, m as pushTextMessageWithQuickReplies, n as createLocationMessage, o as getUserDisplayName, p as pushTemplateMessage, r as createQuickReplyItems, s as getUserProfile, t as createFlexMessage, u as pushLocationMessage } from "./.setup/send-BmsHY4WC.mjs";
import { buildChannelConfigSchema } from "openclaw/plugin-sdk/channel-config-schema";
import { buildComputedAccountStatusSnapshot, buildTokenChannelStatusSummary } from "openclaw/plugin-sdk/status-helpers";
import { formatErrorMessage } from "openclaw/plugin-sdk/error-runtime";
import { mimeTypeFromFilePath } from "openclaw/plugin-sdk/media-mime";
import { danger, logVerbose } from "openclaw/plugin-sdk/runtime-env";
import { messagingApi } from "@line/bot-sdk";
import { DEFAULT_ACCOUNT_ID, formatDocsLink, setSetupChannelEnabled, splitSetupEntries } from "openclaw/plugin-sdk/setup";
import { clearAccountEntryFields } from "openclaw/plugin-sdk/core";
import { bufferToBlobPart } from "openclaw/plugin-sdk/blob-runtime";
import { getAgentScopedMediaLocalRoots } from "openclaw/plugin-sdk/media-local-roots";
import { loadWebMediaRaw } from "openclaw/plugin-sdk/web-media";
//#region extensions/line/src/webhook.ts
const LINE_WEBHOOK_MAX_RAW_BODY_BYTES = 65536;
function readRawBody(req) {
	const rawBody = req.rawBody ?? (typeof req.body === "string" || Buffer.isBuffer(req.body) ? req.body : null);
	if (!rawBody) return null;
	return Buffer.isBuffer(rawBody) ? rawBody.toString("utf-8") : rawBody;
}
function parseWebhookBody(rawBody) {
	if (!rawBody) return null;
	return parseLineWebhookBody(rawBody);
}
function createLineWebhookMiddleware(options) {
	const { channelSecret, onEvents, runtime } = options;
	return async (req, res, _next) => {
		try {
			const signature = req.headers["x-line-signature"];
			if (!signature || typeof signature !== "string") {
				res.status(400).json({ error: "Missing X-Line-Signature header" });
				return;
			}
			const rawBody = readRawBody(req);
			if (!rawBody) {
				res.status(400).json({ error: "Missing raw request body for signature verification" });
				return;
			}
			if (Buffer.byteLength(rawBody, "utf-8") > LINE_WEBHOOK_MAX_RAW_BODY_BYTES) {
				res.status(413).json({ error: "Payload too large" });
				return;
			}
			if (!validateLineSignature(rawBody, signature, channelSecret)) {
				logVerbose("line: webhook signature validation failed");
				res.status(401).json({ error: "Invalid signature" });
				return;
			}
			const body = parseWebhookBody(rawBody);
			if (!body) {
				res.status(400).json({ error: "Invalid webhook payload" });
				return;
			}
			if (body.events && body.events.length > 0) {
				logVerbose(`line: received ${body.events.length} webhook events`);
				await onEvents(body);
			}
			res.status(200).json({ status: "ok" });
		} catch (err) {
			runtime?.error?.(danger(`line webhook error: ${formatErrorMessage(err)}`));
			if (!res.headersSent) res.status(500).json({ error: "Internal server error" });
		}
	};
}
function startLineWebhook(options) {
	const channelSecret = typeof options.channelSecret === "string" ? options.channelSecret.trim() : "";
	if (!channelSecret) throw new Error("LINE webhook mode requires a non-empty channel secret. Set channels.line.channelSecret in your config.");
	return {
		path: resolveLineWebhookPath(options.path),
		handler: createLineWebhookMiddleware({
			channelSecret,
			onEvents: options.onEvents,
			runtime: options.runtime
		})
	};
}
//#endregion
//#region extensions/line/src/rich-menu.ts
const graphemeSegmenter = new Intl.Segmenter(void 0, { granularity: "grapheme" });
function getClient(opts) {
	const account = resolveLineAccount({
		cfg: opts.cfg,
		accountId: opts.accountId
	});
	const token = resolveLineChannelAccessToken(opts.channelAccessToken, account);
	return new messagingApi.MessagingApiClient({ channelAccessToken: token });
}
function getBlobClient(opts) {
	const account = resolveLineAccount({
		cfg: opts.cfg,
		accountId: opts.accountId
	});
	const token = resolveLineChannelAccessToken(opts.channelAccessToken, account);
	return new messagingApi.MessagingApiBlobClient({ channelAccessToken: token });
}
function truncateGraphemes(input, maxLength) {
	let result = "";
	let count = 0;
	for (const { segment } of graphemeSegmenter.segment(input)) {
		if (count >= maxLength) break;
		result += segment;
		count += 1;
	}
	return result;
}
async function createRichMenu(menu, opts) {
	const client = getClient(opts);
	const richMenuRequest = {
		size: menu.size,
		selected: menu.selected ?? false,
		name: truncateGraphemes(menu.name, 300),
		chatBarText: truncateGraphemes(menu.chatBarText, 14),
		areas: menu.areas
	};
	const response = await client.createRichMenu(richMenuRequest);
	if (opts.verbose) logVerbose(`line: created rich menu ${response.richMenuId}`);
	return response.richMenuId;
}
async function uploadRichMenuImage(richMenuId, imagePath, opts) {
	const blobClient = getBlobClient(opts);
	const media = await loadWebMediaRaw(imagePath, { localRoots: opts.mediaLocalRoots ?? getAgentScopedMediaLocalRoots(opts.cfg) });
	const contentType = media.contentType === "image/png" || media.contentType === "image/jpeg" ? media.contentType : mimeTypeFromFilePath(imagePath) === "image/png" ? "image/png" : "image/jpeg";
	const blob = new Blob([bufferToBlobPart(media.buffer)], { type: contentType });
	await blobClient.setRichMenuImage(richMenuId, blob);
	if (opts.verbose) logVerbose(`line: uploaded image to rich menu ${richMenuId}`);
}
async function setDefaultRichMenu(richMenuId, opts) {
	await getClient(opts).setDefaultRichMenu(richMenuId);
	if (opts.verbose) logVerbose(`line: set default rich menu to ${richMenuId}`);
}
async function cancelDefaultRichMenu(opts) {
	await getClient(opts).cancelDefaultRichMenu();
	if (opts.verbose) logVerbose("line: cancelled default rich menu");
}
async function getDefaultRichMenuId(opts) {
	const client = getClient(opts);
	try {
		return (await client.getDefaultRichMenuId()).richMenuId ?? null;
	} catch {
		return null;
	}
}
async function getRichMenuIdOfUser(userId, opts) {
	const client = getClient(opts);
	try {
		return (await client.getRichMenuIdOfUser(userId)).richMenuId ?? null;
	} catch {
		return null;
	}
}
async function getRichMenuList(opts) {
	return (await getClient(opts).getRichMenuList()).richmenus ?? [];
}
async function getRichMenu(richMenuId, opts) {
	const client = getClient(opts);
	try {
		return await client.getRichMenu(richMenuId);
	} catch {
		return null;
	}
}
async function deleteRichMenu(richMenuId, opts) {
	await getClient(opts).deleteRichMenu(richMenuId);
	if (opts.verbose) logVerbose(`line: deleted rich menu ${richMenuId}`);
}
async function createRichMenuAlias(richMenuId, aliasId, opts) {
	await getClient(opts).createRichMenuAlias({
		richMenuId,
		richMenuAliasId: aliasId
	});
	if (opts.verbose) logVerbose(`line: created alias ${aliasId} for rich menu ${richMenuId}`);
}
async function deleteRichMenuAlias(aliasId, opts) {
	await getClient(opts).deleteRichMenuAlias(aliasId);
	if (opts.verbose) logVerbose(`line: deleted alias ${aliasId}`);
}
function createGridLayout(height, actions) {
	const colWidth = Math.floor(2500 / 3);
	const rowHeight = Math.floor(height / 2);
	return [
		{
			bounds: {
				x: 0,
				y: 0,
				width: colWidth,
				height: rowHeight
			},
			action: actions[0]
		},
		{
			bounds: {
				x: colWidth,
				y: 0,
				width: colWidth,
				height: rowHeight
			},
			action: actions[1]
		},
		{
			bounds: {
				x: colWidth * 2,
				y: 0,
				width: colWidth,
				height: rowHeight
			},
			action: actions[2]
		},
		{
			bounds: {
				x: 0,
				y: rowHeight,
				width: colWidth,
				height: rowHeight
			},
			action: actions[3]
		},
		{
			bounds: {
				x: colWidth,
				y: rowHeight,
				width: colWidth,
				height: rowHeight
			},
			action: actions[4]
		},
		{
			bounds: {
				x: colWidth * 2,
				y: rowHeight,
				width: colWidth,
				height: rowHeight
			},
			action: actions[5]
		}
	];
}
function createDefaultMenuConfig() {
	return {
		size: {
			width: 2500,
			height: 843
		},
		selected: false,
		name: "Default Menu",
		chatBarText: "Menu",
		areas: createGridLayout(843, [
			messageAction("Help", "/help"),
			messageAction("Status", "/status"),
			messageAction("Settings", "/settings"),
			messageAction("About", "/about"),
			messageAction("Feedback", "/feedback"),
			messageAction("Contact", "/contact")
		])
	};
}
//#endregion
export { DEFAULT_ACCOUNT_ID, LineChannelConfigSchema, LineConfigSchema, buildChannelConfigSchema, buildComputedAccountStatusSnapshot, buildTemplateMessageFromPayload, buildTokenChannelStatusSummary, cancelDefaultRichMenu, clearAccountEntryFields, convertCodeBlockToFlexBubble, createActionCard, createAgendaCard, createAppleTvRemoteCard, createAudioMessage, createButtonTemplate, createCarouselColumn, createConfirmTemplate, createDefaultMenuConfig, createDeviceControlCard, createEventCard, createFlexMessage, createGridLayout, createImageCard, createImageMessage, createInfoCard, createLineNodeWebhookHandler, createLineWebhookMiddleware, createListCard, createLocationMessage, createMediaPlayerCard, createQuickReplyItems, createReceiptCard, createRichMenu, createRichMenuAlias, createTemplateCarousel, createTextMessageWithQuickReplies, createVideoMessage, datetimePickerAction, deleteRichMenu, deleteRichMenuAlias, downloadLineMedia, firstDefined, formatDocsLink, getDefaultRichMenuId, getRichMenu, getRichMenuIdOfUser, getRichMenuList, getUserDisplayName, getUserProfile, hasMarkdownToConvert, listLineAccountIds, messageAction, monitorLineProvider, normalizeAccountId, normalizeAllowFrom, parseLineWebhookBody, postbackAction, probeLineBot, processLineMessage, pushFlexMessage, pushImageMessage, pushLocationMessage, pushMessageLine, pushMessagesLine, pushTemplateMessage, pushTextMessageWithQuickReplies, readLineWebhookRequestBody, replyMessageLine, resolveDefaultLineAccountId, resolveExactLineGroupConfigKey, resolveLineAccount, resolveLineChannelAccessToken, resolveLineGroupConfigEntry, resolveLineGroupLookupIds, resolveLineGroupsConfig, sendMessageLine, setDefaultRichMenu, setLineRuntime, setSetupChannelEnabled, showLoadingAnimation, splitSetupEntries, startLineWebhook, stripMarkdown, toFlexMessage, uploadRichMenuImage, uriAction, validateLineSignature };
