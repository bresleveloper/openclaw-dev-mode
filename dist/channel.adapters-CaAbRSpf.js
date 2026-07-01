import { c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
import { t as sanitizeAssistantVisibleText } from "./assistant-visible-text-C9MYLVs-.js";
import { n as resolveChannelGroupRequireMention } from "./group-policy-BM2LYNY0.js";
import { i as createLazyRuntimeNamedExport } from "./lazy-runtime-D-7_JraP.js";
import { i as readRemoteMediaBuffer } from "./fetch-UNNW3Fm6.js";
import { t as sanitizeForPlainText } from "./sanitize-text-CgqkwvRH.js";
import { t as createMessageReceiptFromOutboundResults } from "./receipt-BDn00i4I.js";
import { t as adaptScopedAccountAccessor } from "./channel-config-helpers-CMg35hQR.js";
import { n as missingTargetError } from "./target-errors-B0SYsRYn.js";
import { a as resolveChannelMediaMaxBytes } from "./media-runtime-BGWQwoXi.js";
import "./string-coerce-runtime-BiZzULo_.js";
import { t as chunkTextForOutbound } from "./text-chunking-nijjGL3g.js";
import { _ as createAllowlistProviderOpenWarningCollector, m as composeAccountWarningCollectors } from "./channel-policy-VIimbh8Q.js";
import { t as createChannelDirectoryAdapter } from "./directory-runtime-0snnWeh8.js";
import { f as listResolvedDirectoryGroupEntriesFromMapKeys, p as listResolvedDirectoryUserEntriesFromAllowFrom } from "./directory-config-helpers-BvNam8sN.js";
import { T as defineChannelMessageAdapter } from "./channel-outbound-BNKGCEf1.js";
import { n as loadOutboundMediaFromUrl } from "./outbound-media-BtSFem1l.js";
import { t as PAIRING_APPROVED_MESSAGE } from "./pairing-message-DNhqI-OE.js";
import { i as resolveGoogleChatAccount } from "./accounts-DwCzvEYh.js";
import { T as shouldSuppressGoogleChatManualExecApprovalFollowupPayload, i as resolveGoogleChatOutboundSpace, n as isGoogleChatUserTarget, r as normalizeGoogleChatTarget } from "./targets-Ck49h45L.js";
import "./runtime-api-D0rLJOb0.js";
import { r as formatGoogleChatAllowFromEntry } from "./channel-base-BSEw7taH.js";
//#region extensions/googlechat/src/group-policy.ts
function resolveGoogleChatGroupRequireMention(params) {
	return resolveChannelGroupRequireMention({
		cfg: params.cfg,
		channel: "googlechat",
		groupId: params.groupId,
		accountId: params.accountId
	});
}
//#endregion
//#region extensions/googlechat/src/channel.adapters.ts
const loadGoogleChatChannelRuntime = createLazyRuntimeNamedExport(() => import("./channel.runtime-9HpZAxLL.js"), "googleChatChannelRuntime");
function createGoogleChatSendReceipt(params) {
	const messageId = params.messageId?.trim();
	return createMessageReceiptFromOutboundResults({
		results: messageId ? [{
			channel: "googlechat",
			messageId,
			chatId: params.chatId,
			conversationId: params.chatId
		}] : [],
		threadId: params.chatId,
		kind: params.kind
	});
}
const collectGoogleChatSecurityWarnings = composeAccountWarningCollectors(createAllowlistProviderOpenWarningCollector({
	providerConfigPresent: (cfg) => cfg.channels?.googlechat !== void 0,
	resolveGroupPolicy: (account) => account.config.groupPolicy,
	buildOpenWarning: {
		surface: "Google Chat spaces",
		openBehavior: "allows any space to trigger (mention-gated)",
		remediation: "Set channels.googlechat.groupPolicy=\"allowlist\" and configure channels.googlechat.groups"
	}
}), (account) => account.config.dm?.policy === "open" && "- Google Chat DMs are open to anyone. Set channels.googlechat.dm.policy=\"pairing\" or \"allowlist\".");
const googlechatGroupsAdapter = { resolveRequireMention: resolveGoogleChatGroupRequireMention };
const googlechatDirectoryAdapter = createChannelDirectoryAdapter({
	listPeers: async (params) => listResolvedDirectoryUserEntriesFromAllowFrom({
		...params,
		resolveAccount: adaptScopedAccountAccessor(resolveGoogleChatAccount),
		resolveAllowFrom: (account) => account.config.dm?.allowFrom,
		normalizeId: (entry) => normalizeGoogleChatTarget(entry) ?? entry
	}),
	listGroups: async (params) => listResolvedDirectoryGroupEntriesFromMapKeys({
		...params,
		resolveAccount: adaptScopedAccountAccessor(resolveGoogleChatAccount),
		resolveGroups: (account) => account.config.groups
	})
});
const googlechatSecurityAdapter = {
	dm: {
		channelKey: "googlechat",
		resolvePolicy: (account) => account.config.dm?.policy,
		resolveAllowFrom: (account) => account.config.dm?.allowFrom,
		allowFromPathSuffix: "dm.",
		normalizeEntry: (raw) => formatGoogleChatAllowFromEntry(raw)
	},
	collectWarnings: collectGoogleChatSecurityWarnings
};
const googlechatThreadingAdapter = {
	scopedAccountReplyToMode: {
		resolveAccount: (cfg, accountId) => resolveGoogleChatAccount({
			cfg,
			accountId
		}),
		resolveReplyToMode: (account, _chatType) => account.config.replyToMode,
		fallback: "off"
	},
	buildToolContext: ({ cfg, accountId, context, hasRepliedRef }) => {
		const currentChannelId = normalizeGoogleChatTarget(context.To);
		const replyToId = normalizeOptionalString(context.ReplyToIdFull) ?? normalizeOptionalString(context.ReplyToId);
		return {
			currentChannelId,
			currentMessageId: replyToId,
			currentThreadTs: replyToId,
			replyToMode: resolveGoogleChatAccount({
				cfg,
				accountId
			}).config.replyToMode,
			hasRepliedRef
		};
	}
};
const googlechatPairingTextAdapter = {
	idLabel: "googlechatUserId",
	message: PAIRING_APPROVED_MESSAGE,
	normalizeAllowEntry: (entry) => formatGoogleChatAllowFromEntry(entry),
	notify: async ({ cfg, id, message, accountId }) => {
		const account = resolveGoogleChatAccount({
			cfg,
			accountId
		});
		if (account.credentialSource === "none") return;
		const user = normalizeGoogleChatTarget(id) ?? id;
		const space = await resolveGoogleChatOutboundSpace({
			account,
			target: isGoogleChatUserTarget(user) ? user : `users/${user}`
		});
		const { sendGoogleChatMessage } = await loadGoogleChatChannelRuntime();
		await sendGoogleChatMessage({
			account,
			space,
			text: message
		});
	}
};
const googlechatOutboundAdapter = {
	base: {
		deliveryMode: "direct",
		chunker: chunkTextForOutbound,
		chunkerMode: "markdown",
		textChunkLimit: 4e3,
		sanitizeText: ({ text }) => sanitizeForPlainText(sanitizeAssistantVisibleText(text)),
		normalizePayload: ({ payload }) => shouldSuppressGoogleChatManualExecApprovalFollowupPayload(payload) ? null : payload,
		resolveTarget: ({ to }) => {
			const trimmed = normalizeOptionalString(to) ?? "";
			if (trimmed) {
				const normalized = normalizeGoogleChatTarget(trimmed);
				if (!normalized) return {
					ok: false,
					error: missingTargetError("Google Chat", "<spaces/{space}|users/{user}>")
				};
				return {
					ok: true,
					to: normalized
				};
			}
			return {
				ok: false,
				error: missingTargetError("Google Chat", "<spaces/{space}|users/{user}>")
			};
		}
	},
	attachedResults: {
		channel: "googlechat",
		sendText: async ({ cfg, to, text, accountId, replyToId, threadId }) => {
			const account = resolveGoogleChatAccount({
				cfg,
				accountId
			});
			const space = await resolveGoogleChatOutboundSpace({
				account,
				target: to
			});
			const thread = typeof threadId === "number" ? String(threadId) : threadId ?? replyToId ?? void 0;
			const { sendGoogleChatMessage } = await loadGoogleChatChannelRuntime();
			const messageId = (await sendGoogleChatMessage({
				account,
				space,
				text,
				thread
			}))?.messageName ?? "";
			return {
				messageId,
				chatId: space,
				receipt: createGoogleChatSendReceipt({
					messageId,
					chatId: space,
					kind: "text"
				})
			};
		},
		sendMedia: async ({ cfg, to, text, mediaUrl, mediaAccess, mediaLocalRoots, mediaReadFile, accountId, replyToId, threadId }) => {
			if (!mediaUrl) throw new Error("Google Chat mediaUrl is required.");
			const account = resolveGoogleChatAccount({
				cfg,
				accountId
			});
			const space = await resolveGoogleChatOutboundSpace({
				account,
				target: to
			});
			const thread = typeof threadId === "number" ? String(threadId) : threadId ?? replyToId ?? void 0;
			const effectiveMaxBytes = resolveChannelMediaMaxBytes({
				cfg,
				resolveChannelLimitMb: ({ cfg: cfgLocal, accountId: accountIdLocal }) => (cfgLocal.channels?.googlechat)?.accounts?.[accountIdLocal]?.mediaMaxMb ?? (cfgLocal.channels?.googlechat)?.mediaMaxMb,
				accountId
			}) ?? (account.config.mediaMaxMb ?? 20) * 1024 * 1024;
			const loaded = /^https?:\/\//i.test(mediaUrl) ? await readRemoteMediaBuffer({
				url: mediaUrl,
				maxBytes: effectiveMaxBytes
			}) : await loadOutboundMediaFromUrl(mediaUrl, {
				maxBytes: effectiveMaxBytes,
				mediaAccess,
				mediaLocalRoots,
				mediaReadFile
			});
			const { sendGoogleChatMessage, uploadGoogleChatAttachment } = await loadGoogleChatChannelRuntime();
			const upload = await uploadGoogleChatAttachment({
				account,
				space,
				filename: loaded.fileName ?? "attachment",
				buffer: loaded.buffer,
				contentType: loaded.contentType
			});
			const messageId = (await sendGoogleChatMessage({
				account,
				space,
				text,
				thread,
				attachments: upload.attachmentUploadToken ? [{
					attachmentUploadToken: upload.attachmentUploadToken,
					contentName: loaded.fileName
				}] : void 0
			}))?.messageName ?? "";
			return {
				messageId,
				chatId: space,
				receipt: createGoogleChatSendReceipt({
					messageId,
					chatId: space,
					kind: "media"
				})
			};
		}
	}
};
const googlechatMessageAdapter = defineChannelMessageAdapter({
	id: "googlechat",
	durableFinal: { capabilities: {
		text: true,
		media: true,
		thread: true,
		messageSendingHooks: true
	} },
	send: {
		text: googlechatOutboundAdapter.attachedResults.sendText,
		media: googlechatOutboundAdapter.attachedResults.sendMedia
	}
});
//#endregion
export { googlechatPairingTextAdapter as a, googlechatOutboundAdapter as i, googlechatGroupsAdapter as n, googlechatSecurityAdapter as o, googlechatMessageAdapter as r, googlechatThreadingAdapter as s, googlechatDirectoryAdapter as t };
