import { n as isSlackPluginAccountConfigured } from "./account-configured-sUohAxZr.mjs";
import { c as resolveSlackAccountAllowFrom, d as resolveSlackOperationToken, f as resolveSlackReplyToMode, i as listSlackAccountIds, n as hasImplicitDefaultSlackAccount, o as resolveDefaultSlackAccountId, s as resolveSlackAccount } from "./accounts-CDgkV7Cm.mjs";
import { a as parseSlackTarget, i as normalizeSlackMessagingTarget, n as formatSlackTarget, o as resolveSlackChannelId, r as looksLikeSlackTargetId, t as canonicalizeSlackApiTargetId } from "./target-parsing-FFE26kOV.mjs";
import { t as slackContextTargetsMatch } from "./targets-C6LZQL1Q.mjs";
import { A as countSlackTextUtf8Bytes, At as getSlackInstallationKind, Ct as resolveTurnSourceSlackOriginTarget, Dt as getSlackApprovalApproversForTeam, E as SLACK_EDIT_TEXT_MAX_BYTES, Et as slackTargetsMatch, Ft as isSlackExecApprovalClientEnabled, Lt as resolveSlackExecApprovalTarget, Nt as getSlackExecApprovalApprovers, Ot as isSlackPluginApprovalAuthorizedSender, Pt as isSlackExecApprovalAuthorizedSender, Rt as shouldSuppressLocalSlackExecApprovalPrompt, St as resolveSlackFallbackOriginTarget, Tt as shouldHandleSlackPluginViaForwardingSession, Vt as resolveSlackAutoThreadId, Y as normalizeSlackOutboundText, _t as isSlackPluginApprovalRequest, a as resolveSlackGroupRequireMention, at as renderSlackMessagePresentationFallbackText, bt as resolveSessionSlackOriginTarget, c as qualifySlackRoutePeerId, d as resolveSlackConversationBindingRoute, dt as SLACK_PRESENTATION_CAPABILITIES, f as assertSlackDetachedTargetAllowed, gt as isSlackAnyNativeApprovalClientEnabled, jt as isSlackWorkspaceInstallation, k as SLACK_TEXT_LIMIT, kt as resolveSlackApprovalTeamId, n as setSlackSessionStatus, o as resolveSlackGroupToolPolicy, s as qualifySlackConversationId, u as normalizeSlackRouteBindingConfig, vt as normalizeSlackForwardTarget, wt as shouldHandleSlackNativeApprovalRequest, xt as resolveSlackApproverDmTargets, yt as normalizeSlackOriginTarget, zt as resolvePluginApprovalSlackApprovers } from "./session-status-D46GHwOV.mjs";
import { _ as getSlackWriteClient, c as collectSlackCursorPages, o as formatSlackError, u as createSlackLookupClient } from "./probe-BVlJ3dp0.mjs";
import { c as resolveSlackReplyDeliveryMessages, f as buildSlackPresentationBlocks, o as resolveSlackReplyBlockResolution, p as canRenderSlackPresentation, r as normalizeSlackReplyPayload, s as resolveSlackReplyBlocks } from "./reply-blocks-CKnO4BSG.mjs";
import { n as resolveSlackReplyThreadTs, r as resolveSlackThreadTsValue, t as normalizeSlackThreadTsCandidate } from "./thread-ts-Cvt7WD6B.mjs";
import { n as extractSlackToolSend, t as describeSlackMessageTool } from "./message-tool-api-CcjLPN3v.mjs";
import { n as resolveSlackChannelType, r as resolveSlackConversationInfo } from "./channel-type-B9zYYzBU.mjs";
import { t as getOptionalSlackRuntime } from "./runtime-JSVZSWAj.mjs";
import { n as slackPluginBase, r as slackSecurityAdapter, t as slackConfigAdapter } from "./shared-VtmYNj-v.mjs";
import { i as SLACK_CHANNEL } from "./channel.setup-BYIlwbQ7.mjs";
import { DEFAULT_ACCOUNT_ID, normalizeAccountId } from "openclaw/plugin-sdk/account-id";
import { normalizeAccountId as normalizeAccountId$1 } from "openclaw/plugin-sdk/account-resolution";
import { normalizeLowercaseStringOrEmpty, normalizeOptionalLowercaseString, normalizeOptionalString } from "openclaw/plugin-sdk/string-coerce-runtime";
import { adaptScopedAccountAccessor } from "openclaw/plugin-sdk/channel-config-helpers";
import { buildOutboundBaseSessionKey, normalizeMessageChannel, resolveAccountEntry, resolveAgentRoute } from "openclaw/plugin-sdk/routing";
import { buildLegacyDmAccountAllowlistAdapter, createAccountScopedAllowlistNameResolver, createFlatAllowlistOverrideResolver } from "openclaw/plugin-sdk/allowlist-config-edit";
import { buildThreadAwareOutboundSessionRoute, createChatChannelPlugin } from "openclaw/plugin-sdk/channel-core";
import { createChannelMessageAdapterFromOutbound, createRuntimeOutboundDelegates } from "openclaw/plugin-sdk/channel-outbound";
import { createPairingPrefixStripper } from "openclaw/plugin-sdk/channel-pairing";
import { PAIRING_APPROVED_MESSAGE, projectCredentialSnapshotFields, resolveConfiguredFromRequiredCredentialStatuses } from "openclaw/plugin-sdk/channel-status";
import { createChannelDirectoryAdapter, createRuntimeDirectoryLiveAdapter } from "openclaw/plugin-sdk/directory-runtime";
import { createLazyRuntimeMethodBinder, createLazyRuntimeModule } from "openclaw/plugin-sdk/lazy-runtime";
import { logVerbose } from "openclaw/plugin-sdk/runtime-env";
import { createComputedAccountStatusAdapter, createDefaultChannelRuntimeState } from "openclaw/plugin-sdk/status-helpers";
import { sanitizeAssistantVisibleText } from "openclaw/plugin-sdk/text-chunking";
import { escapeRegExp } from "openclaw/plugin-sdk/text-utility-runtime";
import { createApproverRestrictedNativeApprovalCapability } from "openclaw/plugin-sdk/approval-delivery-runtime";
import { createLazyChannelApprovalNativeRuntimeAdapter } from "openclaw/plugin-sdk/approval-handler-adapter-runtime";
import { createChannelNativeOriginTargetResolver, createNativeApprovalForwardingFallbackSuppressor } from "openclaw/plugin-sdk/approval-native-runtime";
import { readBooleanParam } from "openclaw/plugin-sdk/boolean-param";
import { resolveReactionMessageId } from "openclaw/plugin-sdk/channel-actions";
import { normalizeLegacyInteractiveReply, normalizeMessagePresentation } from "openclaw/plugin-sdk/interactive-runtime";
import { resolveMarkdownTableMode } from "openclaw/plugin-sdk/markdown-table-runtime";
import { readPositiveIntegerParam as readPositiveIntegerParam$1, readStringParam as readStringParam$1 } from "openclaw/plugin-sdk/param-readers";
//#region extensions/slack/src/approval-native.ts
function resolveSlackNativeSuppressionAccountId({ target, request }) {
	return normalizeOptionalString(target.accountId) ?? normalizeOptionalString(request.request.turnSourceAccountId);
}
function shouldConsiderSlackNativeForwardingSuppression(input) {
	if ((normalizeMessageChannel(input.target.channel) ?? input.target.channel) !== "slack") return false;
	if (input.approvalKind === "plugin") return true;
	return normalizeMessageChannel(input.request.request.turnSourceChannel) === "slack";
}
const resolveSlackOriginTarget = createChannelNativeOriginTargetResolver({
	channel: "slack",
	shouldHandleRequest: shouldHandleSlackNativeApprovalRequest,
	resolveTurnSourceTarget: resolveTurnSourceSlackOriginTarget,
	resolveSessionTarget: resolveSessionSlackOriginTarget,
	normalizeTargetForMatch: normalizeSlackOriginTarget,
	targetsMatch: slackTargetsMatch,
	resolveFallbackTarget: resolveSlackFallbackOriginTarget
});
const shouldSuppressSlackForwardingFallback = createNativeApprovalForwardingFallbackSuppressor({
	channel: "slack",
	normalizeForwardTarget: normalizeSlackForwardTarget,
	resolveAccountId: resolveSlackNativeSuppressionAccountId,
	isSessionRouteEligible: shouldHandleSlackNativeApprovalRequest,
	isExplicitTargetEligible: shouldHandleSlackNativeApprovalRequest,
	resolveOriginTarget: resolveSlackOriginTarget,
	resolveApproverDmTargets: resolveSlackApproverDmTargets,
	targetsMatch: slackTargetsMatch
});
const baseSlackApprovalCapability = createApproverRestrictedNativeApprovalCapability({
	channel: "slack",
	channelLabel: "Slack",
	describeExecApprovalSetup: ({ accountId }) => {
		const prefix = accountId && accountId !== "default" ? `channels.slack.accounts.${accountId}` : "channels.slack";
		return `Approve it from the Web UI for now. Slack supports native exec approvals for this account. Configure \`${prefix}.execApprovals.approvers\` or \`commands.ownerAllowFrom\`; set \`${prefix}.execApprovals.enabled\` to \`auto\` or \`true\`. Unset or \`false\` disables native exec approval delivery.`;
	},
	describePluginApprovalSetup: () => "Check `approvals.plugin.slack` for a reviewer in the bot's workspace and confirm the Slack bot is connected, or connect an approval-capable Gateway client. Then retry the request.",
	listAccountIds: listSlackAccountIds,
	hasApprovers: ({ cfg, accountId }) => getSlackExecApprovalApprovers({
		cfg,
		accountId
	}).length > 0,
	isExecAuthorizedSender: isSlackExecApprovalAuthorizedSender,
	isPluginAuthorizedSender: (params) => isSlackPluginApprovalAuthorizedSender(params) && (!params.request || resolvePluginApprovalSlackApprovers(params.cfg, params.request) === void 0 || shouldHandleSlackNativeApprovalRequest({
		cfg: params.cfg,
		accountId: params.accountId,
		approvalKind: "plugin",
		request: params.request
	})),
	isNativeDeliveryEnabled: isSlackExecApprovalClientEnabled,
	resolveNativeDeliveryMode: resolveSlackExecApprovalTarget,
	requireMatchingTurnSourceChannel: true,
	resolveSuppressionAccountId: resolveSlackNativeSuppressionAccountId,
	resolveOriginTarget: resolveSlackOriginTarget,
	resolveApproverDmTargets: resolveSlackApproverDmTargets,
	notifyOriginWhenDmOnly: true,
	nativeRuntime: createLazyChannelApprovalNativeRuntimeAdapter({
		capabilityBoundary: true,
		eventKinds: [
			"exec",
			"plugin",
			"system-agent"
		],
		isConfigured: isSlackAnyNativeApprovalClientEnabled,
		shouldHandle: shouldHandleSlackNativeApprovalRequest,
		load: async () => (await import("./approval-handler.runtime-BcE_shWc.mjs")).slackApprovalNativeRuntime
	})
});
const baseSlackNativeAdapter = baseSlackApprovalCapability.native;
const slackApprovalCapability = {
	...baseSlackApprovalCapability,
	supportsScopedPluginApprovalApprovers: true,
	resolveReviewerSenderId: ({ senderId, spaceId }) => {
		try {
			const parsed = senderId ? parseSlackTarget(senderId, { defaultKind: "user" }) : void 0;
			return parsed?.kind === "user" && spaceId ? formatSlackTarget({
				kind: "user",
				id: parsed.id,
				teamId: spaceId
			}) : senderId ?? void 0;
		} catch {
			return senderId ?? void 0;
		}
	},
	getActionAvailabilityState: (params) => params.approvalKind === "plugin" && params.cfg.approvals?.plugin?.slack && (!params.request || !isSlackPluginApprovalRequest(params.request) || resolvePluginApprovalSlackApprovers(params.cfg, params.request) !== void 0) ? { kind: params.request && !shouldHandleSlackNativeApprovalRequest({
		...params,
		approvalKind: "plugin",
		request: params.request
	}) ? "disabled" : "enabled" } : baseSlackApprovalCapability.getActionAvailabilityState?.(params) ?? { kind: "disabled" },
	delivery: {
		...baseSlackApprovalCapability.delivery,
		shouldBlockForwardingFallback: (input) => shouldConsiderSlackNativeForwardingSuppression(input) && input.approvalKind === "plugin" && isSlackPluginApprovalRequest(input.request) && resolvePluginApprovalSlackApprovers(input.cfg, input.request) !== void 0,
		shouldSuppressForwardingFallback: (input) => {
			if (!shouldConsiderSlackNativeForwardingSuppression(input)) return false;
			if (input.approvalKind === "plugin" && !isSlackPluginApprovalRequest(input.request)) return true;
			const canHandleNative = shouldHandleSlackNativeApprovalRequest({
				cfg: input.cfg,
				accountId: resolveSlackNativeSuppressionAccountId(input),
				approvalKind: input.approvalKind,
				request: input.request
			});
			if (!canHandleNative || input.approvalKind !== "plugin") return canHandleNative;
			return shouldSuppressSlackForwardingFallback(input);
		}
	},
	native: baseSlackNativeAdapter ? {
		...baseSlackNativeAdapter,
		describeDeliveryCapabilities: (params) => {
			const capabilities = baseSlackNativeAdapter.describeDeliveryCapabilities(params);
			const request = params.request;
			const approvalKind = params.approvalKind;
			const described = {
				...capabilities,
				enabled: shouldHandleSlackNativeApprovalRequest({
					cfg: params.cfg,
					accountId: params.accountId,
					approvalKind,
					request
				})
			};
			if (approvalKind !== "plugin" || !isSlackPluginApprovalRequest(request)) return described;
			if (resolvePluginApprovalSlackApprovers(params.cfg, request) !== void 0) return {
				...described,
				preferredSurface: "approver-dm",
				supportsApproverDmSurface: true
			};
			if (!shouldHandleSlackPluginViaForwardingSession({
				cfg: params.cfg,
				accountId: params.accountId,
				request
			})) return described;
			return {
				...described,
				preferredSurface: "origin",
				supportsApproverDmSurface: getSlackApprovalApproversForTeam({
					cfg: params.cfg,
					accountId: params.accountId,
					teamId: resolveSlackApprovalTeamId({
						cfg: params.cfg,
						accountId: params.accountId,
						request
					}),
					request
				}).length > 0
			};
		}
	} : void 0
};
//#endregion
//#region extensions/slack/src/message-action-dispatch.ts
const SLACK_MESSAGE_ACTIONS = /* @__PURE__ */ new Map([
	["reactions", "reactions"],
	["delete", "deleteMessage"],
	["pin", "pinMessage"],
	["unpin", "unpinMessage"],
	["list-pins", "listPins"]
]);
function readSlackForceDocument(params) {
	return readBooleanParam(params, "forceDocument") ?? readBooleanParam(params, "asDocument") ?? false;
}
function resolveSlackPresentationText(content, presentation) {
	return presentation?.blocks.some((block) => block.type === "chart" || block.type === "table") ? renderSlackMessagePresentationFallbackText({
		text: content,
		presentation
	}) : content ?? "";
}
function renderSlackActionPresentation(presentation) {
	if (!presentation) return { usesPresentationTextFallback: false };
	const renderedBlocks = !presentation.blocks.some((block) => (block.type === "text" || block.type === "context") && block.text.trim().length > 3e3) && canRenderSlackPresentation(presentation) ? buildSlackPresentationBlocks(presentation) : void 0;
	const usesPresentationTextFallback = !renderedBlocks || renderedBlocks.length > 50;
	const blocks = usesPresentationTextFallback ? void 0 : renderedBlocks;
	return {
		...blocks?.length ? { blocks } : {},
		usesPresentationTextFallback
	};
}
/** Translate generic channel action requests into Slack-specific tool invocations and payload shapes. */
async function handleSlackMessageAction(params) {
	const { providerId, ctx, invoke } = params;
	const { action, cfg, params: actionParams } = ctx;
	const accountId = ctx.accountId ?? void 0;
	const invokeSlackAction = (request, toolContext = ctx.toolContext) => invoke({
		...request,
		accountId
	}, cfg, toolContext);
	const resolveChannelId = () => {
		const raw = readStringParam$1(actionParams, "channelId") ?? readStringParam$1(actionParams, "to", { required: true });
		const target = parseSlackTarget(raw, { defaultKind: "channel" });
		const channelId = resolveSlackChannelId(raw);
		return formatSlackTarget({
			teamId: target?.teamId,
			kind: "channel",
			id: channelId
		});
	};
	if (action === "conversation-open") return await invokeSlackAction({
		action: "openConversation",
		userIds: actionParams.userIds,
		teamId: readStringParam$1(actionParams, "teamId")
	});
	if (action === "send") {
		const to = readStringParam$1(actionParams, "to", { required: true });
		const content = readStringParam$1(actionParams, "message", {
			required: false,
			allowEmpty: true
		});
		const mediaUrl = readStringParam$1(actionParams, "media", { trim: false });
		const presentation = normalizeMessagePresentation(actionParams.presentation);
		const interactive = normalizeLegacyInteractiveReply(actionParams.interactive);
		const hasStructuredContent = Boolean(presentation || interactive?.blocks.length);
		const resolution = resolveSlackReplyBlockResolution({
			text: content,
			presentation,
			interactive
		}, { materializeAuthoredText: hasStructuredContent });
		const preparedMessages = resolution.segments.length > 0 ? resolveSlackReplyDeliveryMessages({
			authoredTextPlacement: resolution.authoredTextPlacement,
			segments: resolution.segments,
			text: content
		}) : [];
		if (!content && preparedMessages.length === 0 && !mediaUrl) throw new Error("Slack send requires message, blocks, or media.");
		const replyBroadcast = readBooleanParam(actionParams, "replyBroadcast");
		if (replyBroadcast && mediaUrl) throw new Error("Slack replyBroadcast is only supported for text or block thread replies.");
		const threadId = readStringParam$1(actionParams, "threadId");
		const replyTo = readStringParam$1(actionParams, "replyTo");
		const topLevel = readBooleanParam(actionParams, "topLevel") === true || actionParams.threadId === null;
		const toolContext = preparedMessages.length > 0 ? {
			...ctx.toolContext,
			preparedMessages
		} : ctx.toolContext;
		return await invokeSlackAction({
			action: "sendMessage",
			to,
			content: content ?? "",
			mediaUrl: mediaUrl ?? void 0,
			...readSlackForceDocument(actionParams) ? { forceDocument: true } : {},
			threadTs: resolveSlackThreadTsValue({
				replyToId: replyTo,
				threadId
			}),
			...topLevel ? { topLevel: true } : {},
			...replyBroadcast ? { replyBroadcast } : {}
		}, toolContext);
	}
	if (action === "react") {
		const messageIdRaw = resolveReactionMessageId({
			args: actionParams,
			toolContext: ctx.toolContext
		});
		if (messageIdRaw == null) throw new Error("messageId required. Provide messageId explicitly or react to the current inbound message.");
		const messageId = String(messageIdRaw);
		const emoji = readStringParam$1(actionParams, "emoji", { allowEmpty: true });
		const remove = typeof actionParams.remove === "boolean" ? actionParams.remove : void 0;
		return await invokeSlackAction({
			action: "react",
			channelId: resolveChannelId(),
			messageId,
			emoji,
			remove
		});
	}
	const messageAction = SLACK_MESSAGE_ACTIONS.get(action);
	if (messageAction) {
		const messageId = action === "list-pins" ? void 0 : readStringParam$1(actionParams, "messageId", { required: true });
		return await invokeSlackAction({
			action: messageAction,
			channelId: resolveChannelId(),
			messageId,
			...action === "reactions" ? { limit: actionParams.limit } : {}
		});
	}
	if (action === "read") return await invokeSlackAction({
		action: "readMessages",
		channelId: resolveChannelId(),
		limit: actionParams.limit,
		before: readStringParam$1(actionParams, "before"),
		after: readStringParam$1(actionParams, "after"),
		messageId: readStringParam$1(actionParams, "messageId"),
		threadId: readStringParam$1(actionParams, "threadId")
	});
	if (action === "edit") {
		const messageId = readStringParam$1(actionParams, "messageId", { required: true });
		const content = readStringParam$1(actionParams, "message", { allowEmpty: true });
		const presentation = normalizeMessagePresentation(actionParams.presentation);
		const renderedPresentation = renderSlackActionPresentation(presentation);
		const blocks = renderedPresentation.blocks;
		const accessibleContent = renderedPresentation.usesPresentationTextFallback ? renderSlackMessagePresentationFallbackText({
			text: content,
			presentation
		}) : resolveSlackPresentationText(content, presentation);
		const tableMode = resolveMarkdownTableMode({
			cfg,
			channel: "slack",
			accountId: accountId ?? resolveDefaultSlackAccountId(cfg)
		});
		if (!blocks && countSlackTextUtf8Bytes(normalizeSlackOutboundText(accessibleContent, { tableMode })) > 4e3) {
			const editSubject = renderedPresentation.usesPresentationTextFallback ? "Slack presentation fallback" : "Slack edit";
			throw new Error(`${editSubject} exceeds the ${String(SLACK_EDIT_TEXT_MAX_BYTES)}-byte edit limit. Send a new message instead.`);
		}
		if (!accessibleContent && !blocks) throw new Error("Slack edit requires message or blocks.");
		return await invokeSlackAction({
			action: "editMessage",
			channelId: resolveChannelId(),
			messageId,
			content: accessibleContent,
			blocks
		});
	}
	if (action === "member-info") {
		const requesterAccountId = ctx.requesterAccountId ? normalizeAccountId$1(ctx.requesterAccountId) : void 0;
		const targetAccountId = normalizeAccountId$1(accountId ?? resolveDefaultSlackAccountId(cfg));
		const requesterUserId = normalizeOptionalLowercaseString(ctx.toolContext?.currentChannelProvider) === "slack" && requesterAccountId !== void 0 && requesterAccountId === targetAccountId ? normalizeOptionalString(ctx.requesterSenderId) : void 0;
		const userId = readStringParam$1(actionParams, "userId") ?? requesterUserId;
		if (!userId) throw new Error("member-info requires a userId outside a current Slack conversation.");
		return await invokeSlackAction({
			action: "memberInfo",
			userId
		});
	}
	if (action === "emoji-list") return await invokeSlackAction({
		action: "emojiList",
		limit: readPositiveIntegerParam$1(actionParams, "limit", { message: "limit must be a positive integer." })
	});
	if (action === "download-file") {
		const fileIdParam = readStringParam$1(actionParams, "fileId");
		const messageIdParam = readStringParam$1(actionParams, "messageId") ?? readStringParam$1(actionParams, "message_id");
		if (!fileIdParam && messageIdParam) throw new Error("download-file requires fileId (the Slack file id, for example F0B0LTT8M36 from event.files[].id), not messageId. Did you mean to pass fileId? messageId is the Slack message timestamp and is used by react / reactions / edit / delete / pin / unpin actions, not download-file.");
		const fileId = readStringParam$1(actionParams, "fileId", { required: true });
		const channelId = readStringParam$1(actionParams, "channelId") ?? readStringParam$1(actionParams, "to");
		const threadId = readStringParam$1(actionParams, "threadId") ?? readStringParam$1(actionParams, "replyTo");
		return await invokeSlackAction({
			action: "downloadFile",
			fileId,
			channelId: channelId ?? void 0,
			threadId: threadId ?? void 0
		});
	}
	if (action === "upload-file") {
		if (readBooleanParam(actionParams, "replyBroadcast")) throw new Error("Slack replyBroadcast is only supported for text or block thread replies.");
		const to = readStringParam$1(actionParams, "to") ?? resolveChannelId();
		const filePath = readStringParam$1(actionParams, "filePath", { trim: false }) ?? readStringParam$1(actionParams, "path", { trim: false }) ?? readStringParam$1(actionParams, "media", { trim: false });
		if (!filePath) throw new Error("upload-file requires filePath, path, or media");
		const threadId = readStringParam$1(actionParams, "threadId") ?? readStringParam$1(actionParams, "replyTo");
		const topLevel = readBooleanParam(actionParams, "topLevel") === true || actionParams.threadId === null;
		return await invokeSlackAction({
			action: "uploadFile",
			to,
			filePath,
			initialComment: readStringParam$1(actionParams, "initialComment", { allowEmpty: true }) ?? readStringParam$1(actionParams, "message", { allowEmpty: true }) ?? readStringParam$1(actionParams, "caption", { allowEmpty: true }) ?? "",
			filename: readStringParam$1(actionParams, "filename"),
			title: readStringParam$1(actionParams, "title"),
			threadTs: threadId ?? void 0,
			...readSlackForceDocument(actionParams) ? { forceDocument: true } : {},
			...topLevel ? { topLevel: true } : {}
		});
	}
	throw new Error(`Action ${action} is not supported for provider ${providerId}.`);
}
//#endregion
//#region extensions/slack/src/channel-actions.ts
const SLACK_TOOL_DELIVERY_ACTIONS = /* @__PURE__ */ new Set([
	"deleteMessage",
	"editMessage",
	"pinMessage",
	"react",
	"sendMessage",
	"unpinMessage",
	"uploadFile"
]);
const loadSlackActionRuntime$1 = createLazyRuntimeModule(() => import("./action-runtime.runtime-CdWL2mLC.mjs"));
function resolveSlackActionContext(ctx, toolContext) {
	if (!toolContext && !ctx.mediaAccess && !ctx.mediaLocalRoots && !ctx.mediaReadFile && !ctx.conversationReadOrigin && !ctx.requesterAccountId && !ctx.requesterSenderId && !ctx.assertDirectAdapterHandoff) return;
	return {
		...toolContext,
		mediaAccess: ctx.mediaAccess,
		mediaLocalRoots: ctx.mediaLocalRoots,
		mediaReadFile: ctx.mediaReadFile,
		conversationReadOrigin: ctx.conversationReadOrigin,
		requesterAccountId: ctx.requesterAccountId ?? void 0,
		requesterSenderId: ctx.requesterSenderId ?? void 0,
		assertDirectAdapterHandoff: ctx.assertDirectAdapterHandoff
	};
}
function createSlackActions(providerId, options) {
	return {
		providerOwnedReadGates: true,
		readAuthorityActions: [
			"read",
			"reactions",
			"list-pins",
			"member-info",
			"emoji-list",
			"download-file"
		],
		describeMessageTool: describeSlackMessageTool,
		extractToolSend: ({ args }) => extractSlackToolSend(args),
		isToolDeliveryAction: ({ args }) => typeof args.action === "string" && SLACK_TOOL_DELIVERY_ACTIONS.has(args.action),
		prepareSendPayload: ({ ctx, to, payload }) => ctx.action === "send" && !shouldUseWorkspaceAwareSlackActionSend(to, ctx.toolContext) ? payload : null,
		handleAction: async (ctx) => {
			return await handleSlackMessageAction({
				providerId,
				ctx,
				invoke: async (action, cfg, toolContext) => {
					const actionContext = resolveSlackActionContext(ctx, toolContext);
					return await (options?.invoke ? options.invoke(action, cfg, actionContext) : (await loadSlackActionRuntime$1()).handleSlackAction(action, cfg, actionContext));
				}
			});
		}
	};
}
function shouldUseWorkspaceAwareSlackActionSend(rawTarget, context) {
	const target = parseSlackTarget(rawTarget, { defaultKind: "channel" });
	if (!target || target.teamId) return false;
	for (const rawCurrentTarget of [context?.currentChannelId, context?.currentMessagingTarget]) {
		if (!rawCurrentTarget) continue;
		const currentTarget = parseSlackTarget(rawCurrentTarget);
		if (currentTarget?.teamId && currentTarget.kind === target.kind && currentTarget.id.toLowerCase() === target.id.toLowerCase()) return true;
	}
	return false;
}
//#endregion
//#region extensions/slack/src/conversation-route-owner.ts
function inspectSlackConversationRouteOwner(params) {
	const accountId = normalizeAccountId(params.accountId);
	const accountConfig = resolveAccountEntry(params.cfg.channels?.slack?.accounts, accountId);
	if (params.cfg.channels?.slack?.enabled === false || accountConfig?.enabled === false || !accountConfig && (accountId !== DEFAULT_ACCOUNT_ID || !hasImplicitDefaultSlackAccount(params.cfg))) return null;
	const installationKind = getSlackInstallationKind(accountId);
	const direct = params.conversation.kind === "direct";
	const target = parseSlackTarget(params.conversation.peerId, { defaultKind: direct ? "user" : "channel" });
	if (!target || target.kind !== (direct ? "user" : "channel")) return null;
	const targetIsEnterprise = Boolean(target.teamId);
	if (!targetIsEnterprise && (installationKind === "degraded" || !installationKind)) return { kind: "unavailable" };
	if (targetIsEnterprise && installationKind === "workspace") return null;
	const contextTeamId = params.conversation.context?.teamId?.trim();
	if (contextTeamId && target.teamId && contextTeamId.toLowerCase() !== target.teamId.toLowerCase()) return null;
	const teamId = contextTeamId ?? target.teamId;
	if (!direct && params.conversation.nativeChannelId && params.conversation.nativeChannelId.toLowerCase() !== target.id.toLowerCase()) return null;
	const enterpriseRoute = installationKind === "enterprise" || targetIsEnterprise;
	if (enterpriseRoute && !teamId) return null;
	const enterpriseScope = enterpriseRoute && teamId ? { teamId } : void 0;
	const route = ({ boundAgentId, bindingOwnerAvailable }) => resolveAgentRoute({
		cfg: boundAgentId || !bindingOwnerAvailable ? { session: params.cfg.session } : normalizeSlackRouteBindingConfig(params.cfg),
		defaultAgentId: boundAgentId,
		channel: "slack",
		accountId,
		teamId,
		peer: {
			kind: params.conversation.kind,
			id: qualifySlackRoutePeerId({
				id: target.id,
				kind: direct ? "user" : "channel",
				eventScope: enterpriseScope
			})
		}
	});
	const baseConversationId = qualifySlackConversationId(direct ? `user:${target.id}` : target.id, enterpriseScope);
	const bindingRoute = resolveSlackConversationBindingRoute({
		cfg: params.cfg,
		resolveRoute: route,
		accountId,
		baseConversationId,
		runtimeBindingThreadId: params.conversation.threadId,
		bindingsEnabled: !enterpriseRoute,
		touchBinding: false
	});
	if (!bindingRoute.runtimeRoute.bindingOwnerAvailable) return { kind: "unavailable" };
	if (bindingRoute.runtimeRoute.pluginId) return {
		kind: "plugin",
		pluginId: bindingRoute.runtimeRoute.pluginId,
		fallbackAgentId: bindingRoute.route.agentId
	};
	return {
		kind: "agent",
		agentId: bindingRoute.runtimeRoute.boundAgentId ?? bindingRoute.configuredRoute?.boundAgentId ?? bindingRoute.route.agentId
	};
}
//#endregion
//#region extensions/slack/src/enterprise-user-route.ts
/** Resolve a workspace for a detached Enterprise DM without opening a conversation. */
async function resolveSlackEnterpriseUserTeamId(params) {
	const account = resolveSlackAccount(params);
	if (getSlackInstallationKind(account.accountId) !== "enterprise") return;
	const token = resolveSlackOperationToken(account, "write");
	if (!token) throw new Error("unsupported_enterprise_slack_delivery: missing Slack sending token");
	const client = createSlackLookupClient(token);
	const response = await client.users.info({ user: params.userId });
	const user = response.user;
	if (!response.ok || !user || user.deleted || user.id !== params.userId && user.enterprise_user?.id !== params.userId) throw new Error("unsupported_enterprise_slack_delivery: could not verify Slack recipient");
	const memberTeamIds = new Set(user.enterprise_user?.teams ?? []);
	const teamId = (await collectSlackCursorPages({
		fetchPage: (cursor) => client.auth.teams.list({
			limit: 1e3,
			cursor
		}),
		collectPageItems: (page) => {
			if (!page.ok) throw new Error("unsupported_enterprise_slack_delivery: could not verify Slack workspaces");
			return (page.teams ?? []).flatMap((team) => team.id && /^T[A-Z0-9]+$/.test(team.id) ? [team.id] : []);
		}
	})).filter((id) => memberTeamIds.has(id)).toSorted()[0];
	if (!teamId) throw new Error("unsupported_enterprise_slack_delivery: recipient shares no verified installed workspace");
	return teamId;
}
//#endregion
//#region extensions/slack/src/threading-tool-context.ts
function buildSlackThreadingToolContext(params) {
	const account = resolveSlackAccount({
		cfg: params.cfg,
		accountId: params.accountId
	});
	const configuredReplyToMode = params.context.ReplyToMode ?? resolveSlackReplyToMode(account, params.context.ChatType);
	const messageThreadTs = normalizeSlackThreadTsCandidate(params.context.MessageThreadId);
	const transportThreadTs = normalizeSlackThreadTsCandidate(params.context.TransportThreadId);
	const replyToThreadTs = normalizeSlackThreadTsCandidate(params.context.ReplyToId);
	const currentMessageTs = normalizeSlackThreadTsCandidate(params.context.CurrentMessageId);
	const currentThreadTs = messageThreadTs ?? transportThreadTs ?? replyToThreadTs ?? currentMessageTs;
	const hasExplicitThreadTarget = messageThreadTs != null || transportThreadTs != null || replyToThreadTs != null && currentMessageTs != null && replyToThreadTs !== currentMessageTs;
	const effectiveReplyToMode = hasExplicitThreadTarget ? "all" : configuredReplyToMode;
	const currentMessagingTarget = normalizeOptionalString(params.context.To);
	const parsedMessagingTarget = currentMessagingTarget ? parseSlackTarget(currentMessagingTarget) : void 0;
	const nativeChannelId = normalizeOptionalString(params.context.NativeChannelId);
	return {
		currentChannelId: parsedMessagingTarget?.teamId && nativeChannelId ? formatSlackTarget({
			teamId: parsedMessagingTarget.teamId,
			kind: "channel",
			id: nativeChannelId
		}) : parsedMessagingTarget?.teamId ? currentMessagingTarget : parsedMessagingTarget?.kind === "channel" ? parsedMessagingTarget.id : nativeChannelId ?? currentMessagingTarget,
		currentMessagingTarget,
		currentThreadTs,
		replyToMode: effectiveReplyToMode,
		hasRepliedRef: params.hasRepliedRef,
		sameChannelThreadRequired: hasExplicitThreadTarget
	};
}
//#endregion
//#region extensions/slack/src/channel.ts
const loadExtensionSharedSdk = createLazyRuntimeModule(() => import("openclaw/plugin-sdk/extension-shared"));
const loadTargetResolverRuntimeSdk = createLazyRuntimeModule(() => import("openclaw/plugin-sdk/target-resolver-runtime"));
const loadSlackScopesModule = createLazyRuntimeModule(() => import("./scopes-DrDbyUH2.mjs"));
const loadSlackOutboundAdapterModule = createLazyRuntimeModule(() => import("./outbound-adapter-BZFkK-mw.mjs"));
const bindSlackOutbound = createLazyRuntimeMethodBinder(loadSlackOutboundAdapterModule);
async function resolveSlackHandleAction() {
	return getOptionalSlackRuntime()?.channel?.slack?.handleSlackAction ?? (await loadSlackActionRuntime()).handleSlackAction;
}
const loadSlackDirectoryConfigModule = createLazyRuntimeModule(() => import("./directory-config-B_by7zrc.mjs").then((n) => n.t));
const loadSlackResolveChannelsModule = createLazyRuntimeModule(() => import("./resolve-channels-HR0TgArR.mjs").then((n) => n.n));
const loadSlackResolveUsersModule = createLazyRuntimeModule(() => import("./resolve-users-BNYBhF0q.mjs").then((n) => n.n));
const loadSlackActionRuntime = createLazyRuntimeModule(() => import("./action-runtime.runtime-CdWL2mLC.mjs"));
const loadSlackSendRuntime = createLazyRuntimeModule(() => import("./send-CgPI3Zj8.mjs").then((n) => n.n));
const loadSlackProbeModule = createLazyRuntimeModule(() => import("./probe-BVlJ3dp0.mjs").then((n) => n.n));
const loadSlackMonitorModule = createLazyRuntimeModule(() => import("./monitor-BuYBDmm7.mjs").then((n) => n.t));
const loadSlackDirectoryLiveModule = createLazyRuntimeModule(() => import("./directory-live-C48wazJt.mjs").then((n) => n.t));
async function setSlackHeartbeatThreadStatus(params) {
	const threadTs = resolveSlackThreadTsValue({ threadId: params.threadId });
	const target = parseSlackTarget(params.to, { defaultKind: "channel" });
	if (!threadTs || !target) return;
	const account = resolveSlackAccount({
		cfg: params.cfg,
		accountId: params.accountId
	});
	assertSlackDetachedTargetAllowed(account.accountId, target.teamId);
	const botToken = normalizeOptionalString(account.botToken);
	if (!botToken) return;
	try {
		const client = getSlackWriteClient(botToken, { teamId: target.teamId });
		const apiTargetId = canonicalizeSlackApiTargetId(target.kind, target.id, params.to);
		const channelId = target.kind === "channel" ? apiTargetId : await (await loadSlackSendRuntime()).resolveSlackDmChannelId({
			client,
			userId: apiTargetId,
			accountId: account.accountId,
			token: botToken
		});
		await setSlackSessionStatus({
			client,
			token: botToken,
			channelId,
			threadTs,
			status: params.status
		});
	} catch (error) {
		logVerbose(`slack heartbeat status update failed: ${formatSlackError(error)}`);
	}
}
function resolveSlackRouteTarget(raw) {
	const target = parseSlackTarget(raw, { defaultKind: "channel" });
	if (!target) return null;
	return {
		to: target.teamId ? target.normalized : target.id,
		chatType: target.kind === "user" ? "direct" : "channel"
	};
}
function normalizeSlackAcpConversationId(raw) {
	const trimmed = normalizeOptionalString(raw);
	if (!trimmed) return null;
	const parsed = parseSlackTarget(trimmed, { defaultKind: "channel" });
	const conversationId = normalizeLowercaseStringOrEmpty(parsed?.id ?? trimmed.replace(/^slack:/i, "").replace(/^(?:channel|group|direct|user):/i, ""));
	return conversationId ? { conversationId } : null;
}
function matchSlackAcpConversation(params) {
	const bindingConversationId = normalizeSlackAcpConversationId(params.bindingConversationId)?.conversationId;
	const conversationId = normalizeSlackAcpConversationId(params.conversationId)?.conversationId;
	const parentConversationId = normalizeSlackAcpConversationId(params.parentConversationId)?.conversationId;
	if (!bindingConversationId || !conversationId) return null;
	if (bindingConversationId === conversationId) return {
		conversationId,
		matchPriority: 2
	};
	if (parentConversationId && parentConversationId !== conversationId && bindingConversationId === parentConversationId) return {
		conversationId: parentConversationId,
		matchPriority: 1
	};
	return null;
}
async function resolveSlackOutboundSessionRoute(params) {
	const parsed = parseSlackTarget(params.target, { defaultKind: "channel" });
	if (!parsed) return null;
	const apiTargetId = canonicalizeSlackApiTargetId(parsed.kind, parsed.id, params.target);
	const isDm = parsed.kind === "user";
	if (params.deliveryPurpose === "heartbeat-owner" && isDm && !parsed.teamId && /^[UW][A-Z0-9]{8,}$/.test(apiTargetId)) {
		const teamId = await resolveSlackEnterpriseUserTeamId({
			cfg: params.cfg,
			accountId: params.accountId,
			userId: apiTargetId
		});
		if (teamId) {
			parsed.teamId = teamId;
			parsed.id = apiTargetId;
		}
	}
	let peerKind = isDm ? "direct" : "channel";
	let peerId = formatSlackTarget(parsed);
	let recipientSessionExact = isDm ? /^[UW][A-Z0-9]{8,}$/i.test(parsed.id) : /^C[A-Z0-9]{8,}$/i.test(parsed.id);
	if (!isDm && /^D/i.test(parsed.id)) {
		const conversation = await resolveSlackConversationInfo({
			cfg: params.cfg,
			accountId: params.accountId,
			channelId: apiTargetId,
			teamId: parsed.teamId
		});
		if (conversation.type !== "dm" || !conversation.user) return null;
		peerKind = "direct";
		peerId = formatSlackTarget({
			teamId: parsed.teamId,
			kind: "user",
			id: conversation.user
		});
		recipientSessionExact = true;
	} else if (!isDm && /^G/i.test(parsed.id)) {
		const channelType = await resolveSlackChannelType({
			cfg: params.cfg,
			accountId: params.accountId,
			channelId: apiTargetId,
			teamId: parsed.teamId
		});
		if (channelType === "group") peerKind = "group";
		if (channelType === "dm") peerKind = "direct";
		recipientSessionExact = channelType !== "unknown";
	}
	const peer = {
		kind: peerKind,
		id: peerId
	};
	const unpartitionedBaseSessionKey = buildOutboundBaseSessionKey({
		channel: "slack",
		cfg: params.cfg,
		agentId: params.agentId,
		accountId: params.accountId,
		peer
	});
	const baseSessionKey = parsed.teamId && peerKind === "direct" && (params.cfg.session?.dmScope ?? "main") === "main" ? `${unpartitionedBaseSessionKey}:account:${encodeURIComponent(resolveSlackAccount({
		cfg: params.cfg,
		accountId: params.accountId
	}).accountId).toLowerCase()}:team:${encodeURIComponent(parsed.teamId).toLowerCase()}` : unpartitionedBaseSessionKey;
	return buildThreadAwareOutboundSessionRoute({
		route: {
			sessionKey: baseSessionKey,
			baseSessionKey,
			recipientSessionExact,
			peer,
			chatType: peerKind === "direct" ? "direct" : "channel",
			from: peerKind === "direct" ? `slack:${peerId}` : peerKind === "group" ? `slack:group:${peerId}` : `slack:channel:${peerId}`,
			to: parsed.teamId ? peerId : peerKind === "direct" ? `user:${peerId}` : `channel:${peerId}`
		},
		replyToId: params.replyToId,
		threadId: params.threadId,
		currentSessionKey: params.currentSessionKey,
		canRecoverCurrentThread: () => peerKind !== "direct" || (params.cfg.session?.dmScope ?? "main") !== "main"
	});
}
function formatSlackScopeDiagnostic(params) {
	const source = params.result.source ? ` (${params.result.source})` : "";
	const label = params.tokenType === "user" ? "User scopes" : "Bot scopes";
	if (params.result.ok && params.result.scopes?.length) return { text: `${label}${source}: ${params.result.scopes.join(", ")}` };
	return {
		text: `${label}: ${params.result.error ?? "scope lookup failed"}`,
		tone: "error"
	};
}
const resolveSlackAllowlistGroupOverrides = createFlatAllowlistOverrideResolver({
	resolveRecord: (account) => account.channels,
	label: (key) => key,
	resolveEntries: (value) => value?.users
});
const resolveSlackAllowlistNames = createAccountScopedAllowlistNameResolver({
	resolveAccount: resolveSlackAccount,
	resolveToken: (account) => normalizeOptionalString(account.userToken) ?? normalizeOptionalString(account.botToken),
	resolveNames: async ({ token, entries }) => (await loadSlackResolveUsersModule()).resolveSlackUserAllowlist({
		token,
		entries
	})
});
const slackChannelOutbound = {
	deliveryMode: "direct",
	chunker: null,
	textChunkLimit: SLACK_TEXT_LIMIT,
	normalizePayload: ({ payload }) => normalizeSlackReplyPayload(payload),
	sanitizeText: ({ text }) => sanitizeAssistantVisibleText(text),
	deliveryCapabilities: { durableFinal: {
		text: true,
		media: true,
		payload: true,
		replyTo: true,
		thread: true,
		messageSendingHooks: true
	} },
	shouldTreatDeliveredTextAsVisible: ({ kind, text }) => kind === "block" && typeof text === "string" && text.trim().length > 0,
	preferFinalAssistantVisibleText: true,
	shouldSuppressLocalPayloadPrompt: shouldSuppressLocalSlackExecApprovalPrompt,
	afterDeliverPayload: bindSlackOutbound(({ slackOutbound }) => slackOutbound.afterDeliverPayload),
	presentationCapabilities: SLACK_PRESENTATION_CAPABILITIES,
	...createRuntimeOutboundDelegates({
		getRuntime: loadSlackOutboundAdapterModule,
		renderPresentation: {
			resolve: ({ slackOutbound }) => slackOutbound.renderPresentation,
			unavailableMessage: "Slack outbound presentation rendering is unavailable"
		}
	}),
	sendPayload: bindSlackOutbound(({ slackOutbound }) => slackOutbound.sendPayload),
	sendText: bindSlackOutbound(({ slackOutbound }) => slackOutbound.sendText),
	sendMedia: bindSlackOutbound(({ slackOutbound }) => slackOutbound.sendMedia)
};
const slackMessageAdapterBase = createChannelMessageAdapterFromOutbound({
	id: "slack",
	outbound: slackChannelOutbound,
	live: {
		capabilities: {
			draftPreview: true,
			previewFinalization: true,
			progressUpdates: true,
			nativeStreaming: true
		},
		finalizer: { capabilities: {
			finalEdit: true,
			normalFallback: true,
			discardPending: true
		} }
	}
});
const slackMessageAdapter = {
	...slackMessageAdapterBase,
	durableFinal: {
		capabilities: {
			...slackMessageAdapterBase.durableFinal?.capabilities,
			reconcileUnknownSend: true
		},
		admitDeferredDelivery: ({ cfg, accountId, to }) => {
			const account = resolveSlackAccount({
				cfg,
				accountId
			});
			const target = parseSlackTarget(to, { defaultKind: "channel" });
			try {
				assertSlackDetachedTargetAllowed(account.accountId, target?.teamId);
				return { status: "allowed" };
			} catch (error) {
				return {
					status: "permanent_rejection",
					reason: error instanceof Error ? error.message : String(error)
				};
			}
		},
		reconcileUnknownSendKinds: { text: true },
		reconcileUnknownSend: async (ctx) => await (await loadSlackSendRuntime()).reconcileSlackUnknownSend(ctx)
	}
};
const slackPlugin = createChatChannelPlugin({
	base: {
		...slackPluginBase,
		allowlist: {
			...buildLegacyDmAccountAllowlistAdapter({
				channelId: "slack",
				resolveAccount: resolveSlackAccount,
				normalize: ({ cfg, accountId, values }) => slackConfigAdapter.formatAllowFrom({
					cfg,
					accountId,
					allowFrom: values
				}),
				resolveDmAllowFrom: (account, { cfg }) => resolveSlackAccountAllowFrom({
					cfg,
					accountId: account.accountId
				}),
				resolveGroupPolicy: (account) => account.groupPolicy,
				resolveGroupOverrides: resolveSlackAllowlistGroupOverrides
			}),
			resolveNames: resolveSlackAllowlistNames
		},
		approvalCapability: slackApprovalCapability,
		groups: {
			resolveRequireMention: resolveSlackGroupRequireMention,
			resolveToolPolicy: resolveSlackGroupToolPolicy
		},
		bindings: {
			compileConfiguredBinding: ({ conversationId }) => normalizeSlackAcpConversationId(conversationId),
			matchInboundConversation: ({ compiledBinding, conversationId, parentConversationId }) => matchSlackAcpConversation({
				bindingConversationId: compiledBinding.conversationId,
				conversationId,
				parentConversationId
			})
		},
		conversationBindings: { isCurrentConversationBindingSupported: ({ accountId }) => isSlackWorkspaceInstallation(accountId) },
		messaging: {
			resolveConversationRouteOwner: inspectSlackConversationRouteOwner,
			targetPrefixes: ["slack"],
			directTargetStyle: "user-prefixed",
			targetIdComparison: "lowercase",
			normalizeTarget: normalizeSlackMessagingTarget,
			resolveDeliveryTarget: ({ conversationId, parentConversationId }) => {
				const parent = parentConversationId?.trim();
				const child = conversationId.trim();
				return parent && parent !== child ? {
					to: normalizeSlackMessagingTarget(parent),
					threadId: child
				} : { to: normalizeSlackMessagingTarget(child) };
			},
			resolveSessionTarget: ({ id }) => {
				return normalizeSlackMessagingTarget(`channel:${id}`);
			},
			inferTargetChatType: ({ to }) => resolveSlackRouteTarget(to)?.chatType,
			resolveOutboundSessionRoute: resolveSlackOutboundSessionRoute,
			hasStructuredReplyPayload: ({ payload }) => {
				try {
					return Boolean(resolveSlackReplyBlocks(payload)?.length);
				} catch {
					return false;
				}
			},
			targetResolver: {
				looksLikeId: looksLikeSlackTargetId,
				hint: "<channelId|user:ID|channel:ID>",
				resolveTarget: async ({ input }) => {
					const parsed = resolveSlackRouteTarget(input);
					if (!parsed) return null;
					return {
						to: parsed.to,
						kind: parsed.chatType === "direct" ? "user" : "group",
						source: "normalized"
					};
				}
			}
		},
		directory: createChannelDirectoryAdapter({
			listPeers: async (params) => (await loadSlackDirectoryConfigModule()).listSlackDirectoryPeersFromConfig(params),
			listGroups: async (params) => (await loadSlackDirectoryConfigModule()).listSlackDirectoryGroupsFromConfig(params),
			...createRuntimeDirectoryLiveAdapter({
				getRuntime: loadSlackDirectoryLiveModule,
				self: (runtime) => runtime.getSlackDirectorySelfLive,
				listPeersLive: (runtime) => runtime.listSlackDirectoryPeersLive,
				listGroupsLive: (runtime) => runtime.listSlackDirectoryGroupsLive
			})
		}),
		resolver: { resolveTargets: async ({ cfg, accountId, inputs, kind }) => {
			const toResolvedTarget = (entry, note) => ({
				input: entry.input,
				resolved: entry.resolved,
				id: entry.id,
				name: entry.name,
				note
			});
			const account = resolveSlackAccount({
				cfg,
				accountId
			});
			const { resolveTargetsWithOptionalToken } = await loadTargetResolverRuntimeSdk();
			if (kind === "group") return resolveTargetsWithOptionalToken({
				token: normalizeOptionalString(account.userToken) ?? normalizeOptionalString(account.botToken),
				inputs,
				missingTokenNote: "missing Slack token",
				resolveWithToken: async ({ token, inputs: inputsValue }) => (await loadSlackResolveChannelsModule()).resolveSlackChannelAllowlist({
					token,
					entries: inputsValue
				}),
				mapResolved: (entry) => toResolvedTarget(entry, entry.archived ? "archived" : void 0)
			});
			return resolveTargetsWithOptionalToken({
				token: normalizeOptionalString(account.userToken) ?? normalizeOptionalString(account.botToken),
				inputs,
				missingTokenNote: "missing Slack token",
				resolveWithToken: async ({ token, inputs: inputsLocal }) => (await loadSlackResolveUsersModule()).resolveSlackUserAllowlist({
					token,
					entries: inputsLocal
				}),
				mapResolved: (entry) => toResolvedTarget(entry, entry.note)
			});
		} },
		actions: createSlackActions(SLACK_CHANNEL, { invoke: async (action, cfg, toolContext) => await (await resolveSlackHandleAction())(action, cfg, toolContext) }),
		message: slackMessageAdapter,
		heartbeat: {
			sendTyping: (params) => setSlackHeartbeatThreadStatus({
				...params,
				status: "processing"
			}),
			clearTyping: (params) => setSlackHeartbeatThreadStatus({
				...params,
				status: "active"
			})
		},
		status: createComputedAccountStatusAdapter({
			defaultRuntime: createDefaultChannelRuntimeState(DEFAULT_ACCOUNT_ID),
			buildChannelSummary: async ({ snapshot }) => {
				const { buildPassiveProbedChannelStatusSummary } = await loadExtensionSharedSdk();
				return buildPassiveProbedChannelStatusSummary(snapshot, snapshot.identity === "user" ? {
					postAs: "user",
					userTokenSource: snapshot.userTokenSource ?? "none",
					...snapshot.mode === "http" ? { signingSecretSource: snapshot.signingSecretSource ?? "none" } : { appTokenSource: snapshot.appTokenSource ?? "none" }
				} : {
					botTokenSource: snapshot.botTokenSource ?? "none",
					appTokenSource: snapshot.appTokenSource ?? "none"
				});
			},
			probeAccount: async ({ account, timeoutMs }) => {
				const token = account.identity === "user" ? account.userToken?.trim() : account.botToken?.trim();
				if (!token) return {
					ok: false,
					error: account.identity === "user" ? "missing user token" : "missing token"
				};
				return await (await loadSlackProbeModule()).probeSlack(token, timeoutMs, {
					accountId: account.accountId,
					...account.identity === "user" ? { identity: "user" } : {}
				});
			},
			formatCapabilitiesProbe: ({ probe }) => {
				const slackProbe = probe;
				const lines = [];
				if (slackProbe?.warning) lines.push({
					text: `Warning: ${slackProbe.warning}`,
					tone: "warn"
				});
				if (slackProbe?.bot?.name) lines.push({ text: `Bot: @${slackProbe.bot.name}` });
				if (slackProbe?.user?.id || slackProbe?.user?.name) {
					const name = slackProbe.user.name ? `@${slackProbe.user.name}` : "unknown";
					const id = slackProbe.user.id ? ` (${slackProbe.user.id})` : "";
					lines.push({ text: `User identity: ${name}${id}` });
				}
				if (slackProbe?.team?.name || slackProbe?.team?.id) {
					const id = slackProbe.team?.id ? ` (${slackProbe.team.id})` : "";
					lines.push({ text: `Team: ${slackProbe.team?.name ?? "unknown"}${id}` });
				}
				return lines;
			},
			buildCapabilitiesDiagnostics: async ({ account, timeoutMs }) => {
				const lines = [];
				const details = {};
				const userToken = account.userToken?.trim();
				const { fetchSlackScopes } = await loadSlackScopesModule();
				const tokenTypes = account.identity === "user" ? ["user"] : userToken ? ["bot", "user"] : ["bot"];
				for (const tokenType of tokenTypes) {
					const token = tokenType === "user" ? userToken : account.botToken?.trim();
					const result = token ? await fetchSlackScopes(token, timeoutMs) : {
						ok: false,
						error: `Slack ${tokenType} token missing.`
					};
					lines.push(formatSlackScopeDiagnostic({
						tokenType,
						result
					}));
					details[`${tokenType}Scopes`] = result;
				}
				return {
					lines,
					details
				};
			},
			resolveAccountSnapshot: ({ account }) => {
				const mode = account.config.mode ?? "socket";
				const identity = account.config.postAs ?? "bot";
				const configured = (mode === "http" || mode === "socket" ? resolveConfiguredFromRequiredCredentialStatuses(account, [identity === "user" ? "userTokenStatus" : "botTokenStatus", mode === "http" ? "signingSecretStatus" : "appTokenStatus"]) : void 0) ?? isSlackPluginAccountConfigured(account);
				return {
					accountId: account.accountId,
					name: account.name,
					enabled: account.enabled,
					configured,
					extra: {
						...projectCredentialSnapshotFields(account),
						...identity === "user" ? {
							identity,
							mode,
							userTokenSource: account.userTokenSource
						} : {}
					}
				};
			}
		}),
		gateway: {
			apiVersion: 2,
			startAccount: async (ctx) => {
				const account = ctx.account;
				const botToken = account.botToken?.trim();
				const appToken = account.appToken?.trim();
				ctx.log?.info(`[${account.accountId}] starting provider`);
				return (await loadSlackMonitorModule()).monitorSlackProvider({
					scheduler: ctx.scheduler,
					botToken: botToken ?? "",
					appToken: appToken ?? "",
					accountId: account.accountId,
					config: ctx.cfg,
					runtime: ctx.runtime,
					channelRuntime: ctx.channelRuntime,
					abortSignal: ctx.abortSignal,
					mediaMaxMb: account.config.mediaMaxMb,
					slashCommand: account.config.slashCommand,
					setStatus: ctx.setStatus,
					getStatus: ctx.getStatus
				});
			}
		},
		mentions: { stripPatterns: ({ ctx }) => {
			const preparedPatterns = ctx.ChannelContext?.chat?.mentionStripPatterns;
			return [...Array.isArray(preparedPatterns) ? preparedPatterns.flatMap((pattern) => typeof pattern === "string" ? [escapeRegExp(pattern)] : []) : [], "<@[^>\\s]+>"];
		} }
	},
	pairing: {
		idLabel: "slackUserId",
		normalizeAllowEntry: createPairingPrefixStripper(/^(slack|user):/i),
		resolveApprovalStoreEntry: ({ id, meta }) => {
			const senderId = meta?.senderId ?? id;
			return formatSlackTarget({
				teamId: meta?.teamId,
				kind: "user",
				id: senderId
			});
		},
		notifyApproval: async ({ cfg, id, accountId, meta }) => {
			const account = resolveSlackAccount({
				cfg,
				accountId: accountId ?? resolveDefaultSlackAccountId(cfg)
			});
			const { sendMessageSlack } = await loadSlackSendRuntime();
			const token = resolveSlackOperationToken(account, "write");
			const senderId = meta?.senderId ?? id;
			await sendMessageSlack(formatSlackTarget({
				teamId: meta?.teamId,
				kind: "user",
				id: senderId,
				explicitKind: true
			}), PAIRING_APPROVED_MESSAGE, {
				cfg,
				accountId: account.accountId,
				...token ? { token } : {}
			});
		}
	},
	security: slackSecurityAdapter,
	threading: {
		threadAddressing: "message",
		matchesToolContextTarget: ({ target, toolContext }) => slackContextTargetsMatch(target, toolContext),
		scopedAccountReplyToMode: {
			resolveAccount: adaptScopedAccountAccessor(resolveSlackAccount),
			resolveReplyToMode: resolveSlackReplyToMode
		},
		allowExplicitReplyTagsWhenOff: false,
		buildToolContext: buildSlackThreadingToolContext,
		resolveAutoThreadId: ({ to, toolContext, replyToId }) => normalizeSlackThreadTsCandidate(replyToId) ? void 0 : normalizeSlackThreadTsCandidate(resolveSlackAutoThreadId({
			to,
			toolContext
		})),
		resolveReplyTransport: ({ threadId, replyToId, replyToIsExplicit, replyToCurrent, replyDelivery }) => {
			const resolvedReplyToId = resolveSlackReplyThreadTs({
				replyToId: normalizeSlackThreadTsCandidate(replyToId),
				threadId: normalizeSlackThreadTsCandidate(threadId),
				replyToMode: replyDelivery?.replyToMode,
				replyToIsExplicit,
				replyToCurrent
			});
			return {
				replyToId: replyDelivery?.replyToMode === "off" && !resolvedReplyToId ? null : resolvedReplyToId,
				threadId: null
			};
		}
	},
	outbound: slackChannelOutbound
});
//#endregion
export { buildSlackThreadingToolContext as n, slackPlugin as t };
