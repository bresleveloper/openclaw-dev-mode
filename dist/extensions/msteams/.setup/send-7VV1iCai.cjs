const require_runtime = require("./runtime-gZTAuFux.cjs");
require("../runtime-api.cjs");
const require_resolve_allowlist = require("./resolve-allowlist-Ct9yxQUw.cjs");
const require_bot_framework_service_url = require("./bot-framework-service-url-BUhTe8F3.cjs");
const require_token_config = require("./token-config-DOt3XwVa.cjs");
const require_channel = require("./channel-BFhXodl2.cjs");
const require_channel_setup = require("./channel.setup-ss0TO-ap.cjs");
const require_conversation_store_state = require("./conversation-store-state-f7V8CVNy.cjs");
let openclaw_plugin_sdk_channel_outbound = require("openclaw/plugin-sdk/channel-outbound");
let openclaw_plugin_sdk_string_coerce_runtime = require("openclaw/plugin-sdk/string-coerce-runtime");
let openclaw_plugin_sdk_error_runtime = require("openclaw/plugin-sdk/error-runtime");
let openclaw_plugin_sdk_channel_inbound = require("openclaw/plugin-sdk/channel-inbound");
let openclaw_plugin_sdk_markdown_table_runtime = require("openclaw/plugin-sdk/markdown-table-runtime");
let openclaw_plugin_sdk_account_helpers = require("openclaw/plugin-sdk/account-helpers");
let openclaw_plugin_sdk_outbound_media = require("openclaw/plugin-sdk/outbound-media");
//#region extensions/msteams/src/send-context.ts
function resolveMSTeamsProactiveReplyTarget(params) {
	const threadRootId = params.ref.threadId ?? params.ref.activityId;
	if (params.conversationType !== "channel" || !threadRootId) return { replyStyle: "top-level" };
	const routeConfig = require_channel.resolveMSTeamsRouteConfig({
		cfg: params.cfg,
		teamId: params.ref.teamId,
		conversationId: params.conversationId,
		allowNameMatching: false
	});
	const { replyStyle } = require_channel.resolveMSTeamsReplyPolicy({
		isDirectMessage: false,
		globalConfig: params.cfg,
		teamConfig: routeConfig.teamConfig,
		channelConfig: routeConfig.channelConfig
	});
	return replyStyle === "thread" ? {
		replyStyle,
		threadActivityId: threadRootId
	} : { replyStyle };
}
/**
* Parse the target value into a conversation reference lookup key.
* Supported formats:
* - conversation:19:abc@thread.tacv2 → lookup by conversation ID
* - conversation:19:abc@thread.tacv2;messageid=root → lookup base ID, use root
* - user:aad-object-id → lookup by user AAD object ID
* - 19:abc@thread.tacv2 → direct conversation ID
*/
function parseRecipient(to) {
	const trimmed = to.trim();
	const finalize = (type, id) => {
		const normalized = id.trim();
		if (!normalized) throw new Error(`Invalid target value: missing ${type} id`);
		if (type === "conversation") {
			const threadId = require_resolve_allowlist.extractMSTeamsConversationMessageId(normalized);
			const normalizedConversationId = require_resolve_allowlist.normalizeMSTeamsConversationId(normalized);
			const slashIndex = normalizedConversationId.indexOf("/");
			const graphChannelId = slashIndex > 0 ? normalizedConversationId.slice(slashIndex + 1) : void 0;
			return {
				type,
				id: graphChannelId && (graphChannelId.startsWith("19:") || graphChannelId.includes("@thread")) ? graphChannelId : normalizedConversationId,
				...threadId ? { threadId } : {}
			};
		}
		return {
			type,
			id: normalized
		};
	};
	if (trimmed.startsWith("conversation:")) return finalize("conversation", trimmed.slice(13));
	if (trimmed.startsWith("user:")) return finalize("user", trimmed.slice(5));
	if (trimmed.startsWith("19:") || trimmed.includes("@thread")) return finalize("conversation", trimmed);
	return finalize("user", trimmed);
}
async function findConversationReference(recipient) {
	if (recipient.type === "conversation") {
		const ref = await recipient.store.get(recipient.id);
		return ref ? {
			conversationId: recipient.id,
			ref
		} : null;
	}
	const found = await recipient.store.findPreferredDmByUserId(recipient.id);
	return found ? {
		conversationId: found.conversationId,
		ref: found.reference
	} : null;
}
async function resolveMSTeamsSendContext(params) {
	const msteamsCfg = params.cfg.channels?.msteams;
	if (!msteamsCfg?.enabled) throw new Error("msteams provider is not enabled");
	const account = require_channel_setup.resolveMSTeamsAccount(params.cfg);
	if (account.tokenStatus === "configured_unavailable") throw new Error("msteams credential file is configured but unavailable");
	if (!account.configured) throw new Error("msteams credentials not configured");
	const creds = require_token_config.resolveMSTeamsCredentials(msteamsCfg);
	if (!creds) throw new Error("msteams credentials not configured");
	const store = require_conversation_store_state.createMSTeamsConversationStoreState();
	const recipient = parseRecipient(params.to);
	const found = await findConversationReference({
		...recipient,
		store
	});
	if (!found) throw new Error(`No conversation reference found for ${recipient.type}:${recipient.id}. The bot must receive a message from this conversation before it can send proactively.`);
	const conversationId = found.conversationId;
	const ref = recipient.threadId ? {
		...found.ref,
		threadId: recipient.threadId
	} : found.ref;
	const log = require_runtime.getMSTeamsRuntime().logging.getChildLogger({ name: "msteams:send" });
	if (ref.serviceUrl && !require_bot_framework_service_url.isAllowedBotFrameworkServiceUrl(ref.serviceUrl)) {
		try {
			await store.remove(conversationId);
		} catch (err) {
			log.warn?.("failed to remove blocked msteams conversation reference", {
				conversationId,
				error: require_channel_setup.formatUnknownError(err)
			});
		}
		throw new Error(`Stored Microsoft Teams conversation reference has blocked serviceUrl host: ${require_bot_framework_service_url.describeBotFrameworkServiceUrlHost(ref.serviceUrl)}. The bot must receive a new message from this conversation before it can send proactively.`);
	}
	const safeRef = ref.serviceUrl ? {
		...ref,
		serviceUrl: require_bot_framework_service_url.normalizeBotFrameworkServiceUrl(ref.serviceUrl)
	} : ref;
	if (recipient.type === "user") {
		const resolvedType = (0, openclaw_plugin_sdk_string_coerce_runtime.normalizeLowercaseStringOrEmpty)(safeRef.conversation?.conversationType ?? "");
		if (resolvedType && resolvedType !== "personal") throw new Error(`Conversation reference for user:${recipient.id} resolved to a ${resolvedType} conversation (${conversationId}) instead of a personal DM. The bot must receive a DM from this user before it can send proactively.`);
	}
	const sdkCloudOptions = require_resolve_allowlist.resolveMSTeamsSdkCloudOptions(msteamsCfg);
	const { app } = await require_resolve_allowlist.loadMSTeamsSdkWithAuth(creds, sdkCloudOptions);
	require_resolve_allowlist.validateMSTeamsProactiveServiceUrlBoundary({
		cloud: sdkCloudOptions.cloud,
		conversationId,
		storedServiceUrl: safeRef.serviceUrl,
		configuredServiceUrl: sdkCloudOptions.serviceUrl
	});
	const tokenProvider = require_resolve_allowlist.createMSTeamsTokenProvider(app);
	const storedConversationType = (0, openclaw_plugin_sdk_string_coerce_runtime.normalizeLowercaseStringOrEmpty)(safeRef.conversation?.conversationType ?? "");
	const conversationType = storedConversationType === "personal" || storedConversationType === "channel" ? storedConversationType : "groupChat";
	const replyTarget = recipient.threadId && conversationType === "channel" ? {
		replyStyle: "thread",
		threadActivityId: recipient.threadId
	} : resolveMSTeamsProactiveReplyTarget({
		cfg: msteamsCfg,
		conversationId,
		ref: safeRef,
		conversationType
	});
	const mediaMaxBytes = (0, openclaw_plugin_sdk_account_helpers.resolveChannelMediaMaxBytes)({
		cfg: params.cfg,
		resolveChannelLimitMb: ({ cfg }) => cfg.channels?.msteams?.mediaMaxMb
	});
	return {
		conversationId,
		ref: safeRef,
		app,
		log,
		conversationType,
		...replyTarget,
		sdkCloudOptions,
		tokenProvider,
		sharePointSiteId: msteamsCfg.sharePointSiteId,
		mediaMaxBytes
	};
}
//#endregion
//#region extensions/msteams/src/send.ts
function createMSTeamsSendError(errorPrefix, error) {
	if (error instanceof Error && (error instanceof openclaw_plugin_sdk_error_runtime.PlatformMessageNotDispatchedError || (0, openclaw_plugin_sdk_channel_inbound.isChannelPartialDeliveryError)(error))) return error;
	const classification = require_channel_setup.classifyMSTeamsSendError(error);
	const hint = require_channel_setup.formatMSTeamsSendErrorHint(classification);
	const status = classification.statusCode ? ` (HTTP ${classification.statusCode})` : "";
	return new Error(`${errorPrefix} failed${status}: ${require_channel_setup.formatUnknownError(error)}${hint ? ` (${hint})` : ""}`, { cause: error });
}
function createMSTeamsPartialSendError(error, receipt) {
	return (0, openclaw_plugin_sdk_channel_inbound.createChannelPartialDeliveryError)(error, {
		visibleReplySent: true,
		messageIds: receipt.platformMessageIds,
		receipt
	});
}
async function finishMSTeamsSend(result, settle) {
	try {
		await settle();
	} catch (error) {
		throw createMSTeamsPartialSendError(error, result.receipt);
	}
	return result;
}
function createMSTeamsSendReceipt(params) {
	const receipt = (0, openclaw_plugin_sdk_channel_outbound.createMessageReceiptFromOutboundResults)({
		kind: params.kind,
		results: params.platformMessageIds.map((messageId) => ({
			channel: "msteams",
			messageId,
			conversationId: params.conversationId
		}))
	});
	if (params.kinds) for (const [index, part] of receipt.parts.entries()) part.kind = params.kinds[index] ?? params.kind;
	return receipt;
}
function createMSTeamsSendResult(params) {
	const platformMessageIds = (params.platformMessageIds?.length ? [...params.platformMessageIds] : [params.messageId]).map((messageId) => messageId.trim()).filter((messageId) => messageId && messageId !== "unknown");
	return {
		messageId: params.messageId,
		conversationId: params.conversationId,
		receipt: createMSTeamsSendReceipt({
			conversationId: params.conversationId,
			platformMessageIds,
			kind: params.kind
		}),
		...params.pendingUploadId ? { pendingUploadId: params.pendingUploadId } : {}
	};
}
/** Proactive delivery requires a conversation reference captured from an earlier inbound turn. */
async function sendMessageMSTeams(params) {
	require_resolve_allowlist.assertMSTeamsSendHandoff(params);
	const { cfg, to, text, mediaUrl, filename, mediaAccess, mediaLocalRoots, mediaReadFile } = params;
	const tableMode = (0, openclaw_plugin_sdk_markdown_table_runtime.resolveMarkdownTableMode)({
		cfg,
		channel: "msteams"
	});
	const messageText = require_conversation_store_state.formatMSTeamsMarkdown(text ?? "", tableMode);
	const ctx = await resolveMSTeamsSendContext({
		cfg,
		to
	});
	const { conversationId, log, conversationType, tokenProvider, sharePointSiteId } = ctx;
	log.debug?.("sending proactive message", {
		conversationId,
		conversationType,
		textLength: messageText.length,
		hasMedia: Boolean(mediaUrl)
	});
	if (mediaUrl) {
		const mediaMaxBytes = ctx.mediaMaxBytes ?? 104857600;
		const media = await (0, openclaw_plugin_sdk_outbound_media.loadOutboundMediaFromUrl)(mediaUrl, {
			maxBytes: mediaMaxBytes,
			mediaAccess,
			mediaLocalRoots,
			mediaReadFile
		});
		const isLargeFile = media.buffer.length >= require_conversation_store_state.FILE_CONSENT_THRESHOLD_BYTES;
		const isImage = media.contentType?.startsWith("image/") ?? false;
		const fallbackFileName = await require_conversation_store_state.extractFilename(mediaUrl);
		const fileName = filename?.trim() || media.fileName || fallbackFileName;
		log.debug?.("processing media", {
			fileName,
			contentType: media.contentType,
			size: media.buffer.length,
			isLargeFile,
			isImage,
			conversationType
		});
		if (require_conversation_store_state.requiresFileConsent({
			conversationType,
			contentType: media.contentType,
			bufferSize: media.buffer.length
		})) {
			require_resolve_allowlist.assertMSTeamsSendHandoff(params);
			const { activity, uploadId } = await require_conversation_store_state.prepareFileConsentActivityFs({
				media: {
					buffer: media.buffer,
					filename: fileName,
					contentType: media.contentType
				},
				conversationId,
				description: messageText || void 0
			});
			log.debug?.("sending file consent card", {
				uploadId,
				fileName,
				size: media.buffer.length
			});
			const messageId = await sendProactiveActivity({
				ctx,
				activity,
				errorPrefix: "msteams consent card send",
				assertDirectAdapterHandoff: params.assertDirectAdapterHandoff,
				onPlatformSendDispatch: params.onPlatformSendDispatch
			});
			const result = createMSTeamsSendResult({
				messageId,
				conversationId,
				kind: "card",
				pendingUploadId: uploadId
			});
			return finishMSTeamsSend(result, async () => {
				require_conversation_store_state.setPendingUploadActivityId(uploadId, messageId);
				try {
					await params.onDeliveryResult?.(result);
				} finally {
					await require_conversation_store_state.setPendingUploadActivityIdFs(uploadId, messageId);
				}
				log.info("sent file consent card", {
					conversationId,
					messageId,
					uploadId
				});
			});
		}
		if (conversationType === "personal" || isImage && !sharePointSiteId) {
			const base64 = media.buffer.toString("base64");
			return sendTextWithMedia(ctx, messageText, `data:${media.contentType};base64,${base64}`, params);
		}
		try {
			const siteId = require_conversation_store_state.requireMSTeamsSharePointSiteId(sharePointSiteId);
			log.debug?.("uploading to SharePoint for native file card", {
				fileName,
				conversationType,
				siteId
			});
			const uploaded = await require_conversation_store_state.uploadAndShareSharePoint({
				assertDirectAdapterHandoff: params.assertDirectAdapterHandoff,
				buffer: media.buffer,
				filename: fileName,
				contentType: media.contentType,
				tokenProvider,
				siteId,
				chatId: conversationId,
				usePerUserSharing: conversationType === "groupChat"
			});
			log.debug?.("SharePoint upload complete", {
				itemId: uploaded.itemId,
				shareUrl: uploaded.shareUrl
			});
			const driveItem = await require_conversation_store_state.getDriveItemProperties({
				assertDirectAdapterHandoff: params.assertDirectAdapterHandoff,
				siteId,
				itemId: uploaded.itemId,
				tokenProvider
			});
			log.debug?.("driveItem properties retrieved", {
				eTag: driveItem.eTag,
				webDavUrl: driveItem.webDavUrl
			});
			const fileCardAttachment = require_conversation_store_state.buildTeamsFileInfoCard(driveItem);
			const messageId = await sendProactiveActivityRaw({
				ctx,
				activity: {
					...require_conversation_store_state.buildMSTeamsMessageActivity(messageText || void 0),
					attachments: [fileCardAttachment]
				},
				assertDirectAdapterHandoff: params.assertDirectAdapterHandoff,
				onPlatformSendDispatch: params.onPlatformSendDispatch
			});
			log.info("sent native file card", {
				conversationId,
				messageId,
				fileName: driveItem.name
			});
			const result = createMSTeamsSendResult({
				messageId,
				conversationId,
				kind: "media"
			});
			return await finishMSTeamsSend(result, async () => {
				await params.onDeliveryResult?.(result);
			});
		} catch (err) {
			throw createMSTeamsSendError("msteams file send", err);
		}
	}
	return sendTextWithMedia(ctx, messageText, void 0, params);
}
async function sendTextWithMedia(ctx, text, mediaUrl, options) {
	const { app, conversationId, ref, log, tokenProvider, sharePointSiteId, mediaMaxBytes, replyStyle } = ctx;
	const messages = text && mediaUrl ? [{ text }, { mediaUrl }] : [{
		text: text || void 0,
		mediaUrl
	}];
	let platformMessageIds;
	const acceptedIds = [];
	const acceptedKinds = [];
	try {
		platformMessageIds = await require_conversation_store_state.sendMSTeamsMessages({
			assertDirectAdapterHandoff: options.assertDirectAdapterHandoff,
			onPlatformSendDispatch: options.onPlatformSendDispatch,
			onMessageSent: async (messageId, messageIndex) => {
				const kind = messages[messageIndex]?.mediaUrl ? "media" : "text";
				acceptedIds.push(messageId);
				acceptedKinds.push(kind);
				await options.onDeliveryResult?.(createMSTeamsSendResult({
					conversationId,
					messageId,
					kind
				}));
			},
			replyStyle,
			app,
			conversationRef: ref,
			messages,
			retry: {},
			onRetry: (event) => {
				log.debug?.("retrying send", {
					conversationId,
					...event
				});
			},
			tokenProvider,
			sharePointSiteId,
			mediaMaxBytes,
			serviceUrlBoundary: ctx.sdkCloudOptions
		});
	} catch (err) {
		const error = createMSTeamsSendError("msteams send", err);
		if (acceptedIds.length > 0) throw createMSTeamsPartialSendError(error, createMSTeamsSendReceipt({
			conversationId,
			platformMessageIds: acceptedIds,
			kind: mediaUrl ? "media" : "text",
			kinds: acceptedKinds
		}));
		throw error;
	}
	const messageId = platformMessageIds[0] ?? "unknown";
	log.info("sent proactive message", {
		conversationId,
		messageId
	});
	return {
		messageId,
		conversationId,
		receipt: createMSTeamsSendReceipt({
			conversationId,
			platformMessageIds,
			kind: mediaUrl ? "media" : "text",
			...text && mediaUrl ? { kinds: ["text", "media"] } : {}
		})
	};
}
async function sendProactiveActivityRaw({ ctx, activity, assertDirectAdapterHandoff, onPlatformSendDispatch }) {
	const baseRef = require_conversation_store_state.buildConversationReference(ctx.ref);
	const response = await require_conversation_store_state.sendMSTeamsActivityWithReference(ctx.app, baseRef, activity, {
		assertDirectAdapterHandoff,
		onPlatformSendDispatch,
		...ctx.threadActivityId ? { threadActivityId: ctx.threadActivityId } : {},
		serviceUrlBoundary: ctx.sdkCloudOptions
	});
	return require_conversation_store_state.extractMessageId(response) ?? "unknown";
}
async function sendProactiveActivity(params) {
	try {
		return await sendProactiveActivityRaw(params);
	} catch (err) {
		throw createMSTeamsSendError(params.errorPrefix, err);
	}
}
async function sendPollMSTeams(params) {
	require_resolve_allowlist.assertMSTeamsSendHandoff(params);
	const { cfg, to, question, options, maxSelections } = params;
	const ctx = await resolveMSTeamsSendContext({
		cfg,
		to
	});
	const { conversationId, log } = ctx;
	const pollCard = require_conversation_store_state.buildMSTeamsPollCard({
		question,
		options,
		maxSelections
	});
	log.debug?.("sending poll", {
		conversationId,
		pollId: pollCard.pollId,
		optionCount: pollCard.options.length
	});
	const messageId = await sendProactiveActivity({
		ctx,
		activity: require_conversation_store_state.buildMSTeamsAdaptiveCardActivity(pollCard.card),
		errorPrefix: "msteams poll send",
		assertDirectAdapterHandoff: params.assertDirectAdapterHandoff,
		onPlatformSendDispatch: params.onPlatformSendDispatch
	});
	log.info("sent poll", {
		conversationId,
		pollId: pollCard.pollId,
		messageId
	});
	return {
		pollId: pollCard.pollId,
		messageId,
		conversationId
	};
}
async function sendAdaptiveCardMSTeams(params) {
	require_resolve_allowlist.assertMSTeamsSendHandoff(params);
	const { cfg, to, card } = params;
	const ctx = await resolveMSTeamsSendContext({
		cfg,
		to
	});
	const { conversationId, log } = ctx;
	log.debug?.("sending adaptive card", {
		conversationId,
		cardType: card.type,
		cardVersion: card.version
	});
	const messageId = await sendProactiveActivity({
		ctx,
		activity: require_conversation_store_state.buildMSTeamsAdaptiveCardActivity(card),
		errorPrefix: "msteams card send",
		assertDirectAdapterHandoff: params.assertDirectAdapterHandoff,
		onPlatformSendDispatch: params.onPlatformSendDispatch
	});
	log.info("sent adaptive card", {
		conversationId,
		messageId
	});
	const result = createMSTeamsSendResult({
		messageId,
		conversationId,
		kind: "card"
	});
	return finishMSTeamsSend(result, async () => {
		await params.onDeliveryResult?.(result);
	});
}
async function editMessageMSTeams(params) {
	return mutateMSTeamsMessageActivity({
		...params,
		activity: {
			...require_conversation_store_state.buildMSTeamsMessageActivity(require_conversation_store_state.formatMSTeamsMarkdown(params.text, (0, openclaw_plugin_sdk_markdown_table_runtime.resolveMarkdownTableMode)({
				cfg: params.cfg,
				channel: "msteams"
			}))),
			id: params.activityId
		}
	});
}
async function editAdaptiveCardMSTeams(params) {
	return mutateMSTeamsMessageActivity({
		...params,
		activity: {
			...require_conversation_store_state.buildMSTeamsAdaptiveCardActivity(params.card),
			id: params.activityId
		}
	});
}
async function deleteMessageMSTeams(params) {
	return mutateMSTeamsMessageActivity(params);
}
async function mutateMSTeamsMessageActivity(params) {
	const { cfg, to, activityId, activity } = params;
	const { app, conversationId, ref, log, sdkCloudOptions } = await resolveMSTeamsSendContext({
		cfg,
		to
	});
	const operation = activity ? "edit" : "delete";
	log.debug?.(`${activity ? "editing" : "deleting"} proactive message`, {
		conversationId,
		activityId
	});
	try {
		const baseRef = require_conversation_store_state.buildConversationReference(ref);
		const options = { serviceUrlBoundary: sdkCloudOptions };
		if (activity) await require_conversation_store_state.updateMSTeamsActivityWithReference(app, baseRef, activityId, activity, options);
		else await require_conversation_store_state.deleteMSTeamsActivityWithReference(app, baseRef, activityId, options);
	} catch (err) {
		throw createMSTeamsSendError(`msteams ${operation}`, err);
	}
	log.info(`${activity ? "edited" : "deleted"} proactive message`, {
		conversationId,
		activityId
	});
	return { conversationId };
}
//#endregion
Object.defineProperty(exports, "deleteMessageMSTeams", {
	enumerable: true,
	get: function() {
		return deleteMessageMSTeams;
	}
});
Object.defineProperty(exports, "editAdaptiveCardMSTeams", {
	enumerable: true,
	get: function() {
		return editAdaptiveCardMSTeams;
	}
});
Object.defineProperty(exports, "editMessageMSTeams", {
	enumerable: true,
	get: function() {
		return editMessageMSTeams;
	}
});
Object.defineProperty(exports, "sendAdaptiveCardMSTeams", {
	enumerable: true,
	get: function() {
		return sendAdaptiveCardMSTeams;
	}
});
Object.defineProperty(exports, "sendMessageMSTeams", {
	enumerable: true,
	get: function() {
		return sendMessageMSTeams;
	}
});
Object.defineProperty(exports, "sendPollMSTeams", {
	enumerable: true,
	get: function() {
		return sendPollMSTeams;
	}
});
