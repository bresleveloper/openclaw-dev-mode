import { r as isSlackPluginAccountConfigured } from "./account-configured-35y0-Hso.mjs";
import { a as mergeSlackAccountConfig, c as resolveSlackAccountAllowFrom, d as resolveSlackMarkdownOptions, f as resolveSlackOperationToken, i as listSlackAccountIds, l as resolveSlackAccountDmPolicy, n as hasImplicitDefaultSlackAccount, o as resolveDefaultSlackAccountId, p as resolveSlackReplyToMode, s as resolveSlackAccount } from "./accounts-EaPP0fFY.mjs";
import { t as inspectSlackAccount } from "./account-inspect-DgQgj0wk.mjs";
import { a as parseSlackTarget, i as normalizeSlackMessagingTarget, n as formatSlackTarget, o as resolveSlackChannelId, r as looksLikeSlackTargetId, t as canonicalizeSlackApiTargetId } from "./target-parsing-DwYAP3ts.mjs";
import { t as slackContextTargetsMatch } from "./targets-eeOxA_b_.mjs";
import { $t as isSlackExecApprovalAuthorizedSender, At as isSlackPluginApprovalRequest, Bt as getSlackApprovalApproversForTeam, Dt as normalizeSlackOutboundText, Ft as resolveSlackFallbackOriginTarget, Ht as resolveSlackApprovalTeamId, It as resolveTurnSourceSlackOriginTarget, L as countSlackTextUtf8Bytes, Lt as shouldHandleSlackNativeApprovalRequest, Mt as normalizeSlackOriginTarget, Nt as resolveSessionSlackOriginTarget, Pt as resolveSlackApproverDmTargets, Qt as getSlackExecApprovalApprovers, Rt as shouldHandleSlackPluginViaForwardingSession, S as resolveSlackConversationBindingRoute, T as assertSlackDetachedTargetAllowed, Vt as isSlackPluginApprovalAuthorizedSender, Xt as getSlackInstallationKind, _t as SLACK_PRESENTATION_CAPABILITIES, bt as renderSlackMessagePresentationFallbackText, c as slackIngressIdentity, en as isSlackExecApprovalClientEnabled, f as resolveSlackGroupRequireMention, g as formatSlackError, i as setSlackSessionStatus, in as resolvePluginApprovalSlackApprovers, jt as normalizeSlackForwardTarget, kt as isSlackAnyNativeApprovalClientEnabled, nn as resolveSlackExecApprovalTarget, on as resolveSlackAutoThreadId, p as resolveSlackGroupToolPolicy, rn as shouldSuppressLocalSlackExecApprovalPrompt, s as normalizeSlackStableEntry, t as probeSlack, v as qualifySlackConversationId, w as slackConversationBindings, wt as SLACK_TEXT_LIMIT, x as normalizeSlackRouteBindingConfig, xt as SLACK_EDIT_TEXT_MAX_BYTES, y as qualifySlackRoutePeerId, zt as slackTargetsMatch } from "./probe-BHqvMbno.mjs";
import { n as resolveSlackReplyThreadTs, r as resolveSlackThreadTsValue, t as normalizeSlackThreadTsCandidate } from "./thread-ts-47Au2-Yn.mjs";
import { n as extractSlackToolSend, t as describeSlackMessageTool } from "./message-tool-api-B38BpEaE.mjs";
import { a as resolveSlackReplyBlockResolution, o as resolveSlackReplyBlocks, r as normalizeSlackReplyPayload, s as resolveSlackReplyDeliveryMessages } from "./reply-blocks-CFy-O-2B.mjs";
import { r as createSlackLookupClient, t as collectSlackCursorPages, u as getSlackWriteClient } from "./cursor-pages-jVn3Vkfi.mjs";
import { n as resolveSlackChannelType, r as resolveSlackConversationInfo } from "./channel-type-ZG0ErPTI.mjs";
import { n as SLACK_CHANNEL_META } from "./channel-meta-C5vsCo3a.mjs";
import { i as SLACK_CHANNEL, r as slackBaseConfigAdapter, t as slackSetupPlugin } from "./channel.setup-DNnvYUKL.mjs";
import { n as normalizeCompatibilityConfig, r as runtime_doctor_migrations_exports, t as legacyConfigRules } from "./doctor-contract-BB2KJ9Ni.mjs";
import { n as collectRuntimeConfigAssignments, r as secretTargetRegistryEntries } from "./secret-contract-CqVqR7MP.mjs";
import { normalizeAccountId } from "openclaw/plugin-sdk/account-resolution";
import { normalizeLowercaseStringOrEmpty, normalizeOptionalLowercaseString, normalizeOptionalString } from "openclaw/plugin-sdk/string-coerce-runtime";
import { adaptScopedAccountAccessor, createScopedDmSecurityResolver } from "openclaw/plugin-sdk/channel-config-helpers";
import { buildOutboundBaseSessionKey, normalizeMessageChannel, resolveAccountEntry, resolveAgentRoute } from "openclaw/plugin-sdk/routing";
import { DEFAULT_ACCOUNT_ID as DEFAULT_ACCOUNT_ID$1, normalizeAccountId as normalizeAccountId$2 } from "openclaw/plugin-sdk/account-id";
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
import { createApproverRestrictedNativeApprovalCapabilityAsync } from "openclaw/plugin-sdk/approval-delivery-runtime";
import { createLazyChannelApprovalNativeRuntimeAdapterAsync } from "openclaw/plugin-sdk/approval-handler-adapter-runtime";
import { createChannelNativeOriginTargetResolverAsync, createNativeApprovalForwardingFallbackSuppressorAsync } from "openclaw/plugin-sdk/approval-native-runtime";
import { readBooleanParam } from "openclaw/plugin-sdk/boolean-param";
import { resolveReactionMessageId } from "openclaw/plugin-sdk/channel-actions";
import { normalizeLegacyInteractiveReply, normalizeMessagePresentation } from "openclaw/plugin-sdk/interactive-runtime";
import { readPositiveIntegerParam as readPositiveIntegerParam$1, readStringParam as readStringParam$1 } from "openclaw/plugin-sdk/param-readers";
import { escapeRegExp } from "openclaw/plugin-sdk/text-utility-runtime";
import { buildMutableAllowEntryDetector, collectStandardAllowlistLists, createConditionalWarningCollector, createDangerousNameMatchingMutableAllowlistWarningCollector, createOpenProviderConfiguredRouteWarningCollector } from "openclaw/plugin-sdk/channel-policy";
import { identityEntryAuthenticationClassifier } from "openclaw/plugin-sdk/channel-ingress-runtime";
import { describeAccountSnapshot } from "openclaw/plugin-sdk/account-helpers";
// extensions/slack/src/approval-native.ts
function resolveSlackNativeSuppressionAccountId({ target, request }) {
	return normalizeOptionalString(target.accountId) ?? normalizeOptionalString(request.request.turnSourceAccountId);
}
function shouldConsiderSlackNativeForwardingSuppression(input) {
	if ((normalizeMessageChannel(input.target.channel) ?? input.target.channel) !== "slack") return false;
	if (input.approvalKind === "plugin") return true;
	return normalizeMessageChannel(input.request.request.turnSourceChannel) === "slack";
}
const resolveSlackOriginTarget = createChannelNativeOriginTargetResolverAsync({
	channel: "slack",
	shouldHandleRequest: shouldHandleSlackNativeApprovalRequest,
	resolveTurnSourceTarget: resolveTurnSourceSlackOriginTarget,
	resolveSessionTarget: resolveSessionSlackOriginTarget,
	normalizeTargetForMatch: normalizeSlackOriginTarget,
	targetsMatch: slackTargetsMatch,
	resolveFallbackTarget: resolveSlackFallbackOriginTarget
});
const shouldSuppressSlackForwardingFallback = createNativeApprovalForwardingFallbackSuppressorAsync({
	channel: "slack",
	normalizeForwardTarget: normalizeSlackForwardTarget,
	resolveAccountId: resolveSlackNativeSuppressionAccountId,
	isSessionRouteEligible: shouldHandleSlackNativeApprovalRequest,
	isExplicitTargetEligible: shouldHandleSlackNativeApprovalRequest,
	resolveOriginTarget: resolveSlackOriginTarget,
	resolveApproverDmTargets: resolveSlackApproverDmTargets,
	targetsMatch: slackTargetsMatch
});
const baseSlackApprovalCapability = createApproverRestrictedNativeApprovalCapabilityAsync({
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
	isPluginAuthorizedSender: async (params) => isSlackPluginApprovalAuthorizedSender(params) && (!params.request || resolvePluginApprovalSlackApprovers(params.cfg, params.request) === void 0 || await shouldHandleSlackNativeApprovalRequest({
		cfg: params.cfg,
		accountId: params.accountId,
		approvalKind: "plugin",
		request: params.request
	})),
	isNativeDeliveryEnabled: async (params) => isSlackExecApprovalClientEnabled(params),
	resolveNativeDeliveryMode: resolveSlackExecApprovalTarget,
	requireMatchingTurnSourceChannel: true,
	resolveSuppressionAccountId: resolveSlackNativeSuppressionAccountId,
	resolveOriginTarget: resolveSlackOriginTarget,
	resolveApproverDmTargets: resolveSlackApproverDmTargets,
	notifyOriginWhenDmOnly: true,
	nativeRuntimeAsync: createLazyChannelApprovalNativeRuntimeAdapterAsync({
		capabilityBoundary: true,
		eventKinds: [
			"exec",
			"plugin",
			"system-agent"
		],
		isConfigured: isSlackAnyNativeApprovalClientEnabled,
		shouldHandle: shouldHandleSlackNativeApprovalRequest,
		load: async () => (await import("./approval-handler.runtime-C2C-jNxi.mjs")).slackApprovalNativeRuntime
	})
});
const baseSlackNativeAdapter = baseSlackApprovalCapability.nativeAsync;
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
	getActionAvailabilityStateAsync: async (params) => params.approvalKind === "plugin" && params.cfg.approvals?.plugin?.slack && (!params.request || !isSlackPluginApprovalRequest(params.request) || resolvePluginApprovalSlackApprovers(params.cfg, params.request) !== void 0) ? { kind: params.request && !await shouldHandleSlackNativeApprovalRequest({
		...params,
		approvalKind: "plugin",
		request: params.request
	}) ? "disabled" : "enabled" } : baseSlackApprovalCapability.getActionAvailabilityState?.(params) ?? { kind: "disabled" },
	delivery: {
		...baseSlackApprovalCapability.delivery,
		shouldBlockForwardingFallback: (input) => shouldConsiderSlackNativeForwardingSuppression(input) && input.approvalKind === "plugin" && isSlackPluginApprovalRequest(input.request) && resolvePluginApprovalSlackApprovers(input.cfg, input.request) !== void 0,
		shouldSuppressForwardingFallbackAsync: async (input) => {
			if (!shouldConsiderSlackNativeForwardingSuppression(input)) return false;
			if (input.approvalKind === "plugin" && !isSlackPluginApprovalRequest(input.request)) return true;
			const canHandleNative = await shouldHandleSlackNativeApprovalRequest({
				cfg: input.cfg,
				accountId: resolveSlackNativeSuppressionAccountId(input),
				approvalKind: input.approvalKind,
				request: input.request
			});
			if (!canHandleNative || input.approvalKind !== "plugin") return canHandleNative;
			return shouldSuppressSlackForwardingFallback(input);
		}
	},
	nativeAsync: baseSlackNativeAdapter ? {
		...baseSlackNativeAdapter,
		describeDeliveryCapabilities: async (params) => {
			const capabilities = await baseSlackNativeAdapter.describeDeliveryCapabilities(params);
			const { request, approvalKind } = params;
			const described = {
				...capabilities,
				enabled: await shouldHandleSlackNativeApprovalRequest(params)
			};
			if (approvalKind !== "plugin" || !isSlackPluginApprovalRequest(request)) return described;
			if (resolvePluginApprovalSlackApprovers(params.cfg, request) !== void 0) return {
				...described,
				preferredSurface: "approver-dm",
				supportsApproverDmSurface: true
			};
			if (!await shouldHandleSlackPluginViaForwardingSession(params)) return described;
			return {
				...described,
				preferredSurface: "origin",
				supportsApproverDmSurface: getSlackApprovalApproversForTeam({
					...params,
					teamId: resolveSlackApprovalTeamId(params),
					request
				}).length > 0
			};
		}
	} : void 0
};
// extensions/slack/src/channel-actions.ts
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
function renderSlackActionPresentation(content, presentation, markdownOptions) {
	const renderedContent = normalizeSlackOutboundText(content ?? "", markdownOptions);
	if (!presentation) return {
		text: renderedContent,
		usesPresentationTextFallback: false
	};
	const resolution = resolveSlackReplyBlockResolution({
		text: content,
		presentation
	}, markdownOptions);
	const segment = resolution.segments.length === 1 ? resolution.segments[0] : void 0;
	const usesPresentationTextFallback = segment?.kind !== "blocks" || presentation.blocks.some((block) => (block.type === "text" || block.type === "context") && block.text.trim().length > 3e3);
	const blocks = !usesPresentationTextFallback && segment?.kind === "blocks" ? segment.blocks : void 0;
	return {
		...blocks?.length ? { blocks } : {},
		text: usesPresentationTextFallback || presentation.blocks.some((block) => block.type === "chart" || block.type === "table") ? renderSlackMessagePresentationFallbackText({
			text: resolution.authoredTextPlacement === "blocks" ? void 0 : renderedContent,
			presentation
		}) : renderedContent,
		usesPresentationTextFallback
	};
}
const SLACK_TOOL_DELIVERY_ACTIONS = /* @__PURE__ */ new Set([
	"deleteMessage",
	"editMessage",
	"pinMessage",
	"react",
	"sendMessage",
	"unpinMessage",
	"uploadFile"
]);
const loadSlackActionRuntime = createLazyRuntimeModule(() => import("./action-runtime.runtime-me4Yd3j7.mjs"));
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
		prepareSendPayload: ({ ctx, to, payload }) => {
			if (ctx.action !== "send") return null;
			if (readBooleanParam(ctx.params, "replyBroadcast") === true) return null;
			return shouldUseWorkspaceAwareSlackActionSend(to, ctx.toolContext) ? null : payload;
		},
		handleAction: async (ctx) => {
			const { action, cfg, params: actionParams } = ctx;
			const accountId = ctx.accountId ?? void 0;
			const invokeSlackAction = async (request, toolContext = ctx.toolContext) => {
				const requestAction = {
					...request,
					accountId
				};
				const actionContext = resolveSlackActionContext(ctx, toolContext);
				return await (options?.invoke ? options.invoke(requestAction, cfg, actionContext) : (await loadSlackActionRuntime()).handleSlackAction(requestAction, cfg, actionContext));
			};
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
			if (action === "channel-create") return await invokeSlackAction({
				action: "createChannel",
				name: readStringParam$1(actionParams, "name", { required: true }),
				teamId: readStringParam$1(actionParams, "teamId")
			});
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
				}, {
					...resolveSlackMarkdownOptions({
						cfg,
						accountId
					}),
					materializeAuthoredText: hasStructuredContent
				});
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
					mediaUrl,
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
					...action === "reactions" || action === "list-pins" ? { limit: actionParams.limit } : {}
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
				const { blocks, text: accessibleContent, usesPresentationTextFallback } = renderSlackActionPresentation(readStringParam$1(actionParams, "message", { allowEmpty: true }), normalizeMessagePresentation(actionParams.presentation), resolveSlackMarkdownOptions({
					cfg,
					accountId
				}));
				if (!blocks && countSlackTextUtf8Bytes(accessibleContent) > 4e3) throw new Error(`${usesPresentationTextFallback ? "Slack presentation fallback" : "Slack edit"} exceeds the ${String(SLACK_EDIT_TEXT_MAX_BYTES)}-byte edit limit. Send a new message instead.`);
				if (!accessibleContent && !blocks) throw new Error("Slack edit requires message or blocks.");
				return await invokeSlackAction({
					action: "editMessage",
					channelId: resolveChannelId(),
					messageId,
					content: accessibleContent,
					blocks
				}, {
					...ctx.toolContext,
					preparedEditText: accessibleContent
				});
			}
			if (action === "member-info") {
				const requesterAccountId = ctx.requesterAccountId ? normalizeAccountId(ctx.requesterAccountId) : void 0;
				const targetAccountId = normalizeAccountId(accountId ?? resolveDefaultSlackAccountId(cfg));
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
				return await invokeSlackAction({
					action: "downloadFile",
					fileId: fileIdParam ?? readStringParam$1(actionParams, "fileId", { required: true }),
					channelId: readStringParam$1(actionParams, "channelId") ?? readStringParam$1(actionParams, "to"),
					threadId: readStringParam$1(actionParams, "threadId") ?? readStringParam$1(actionParams, "replyTo")
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
					threadTs: threadId,
					...readSlackForceDocument(actionParams) ? { forceDocument: true } : {},
					...topLevel ? { topLevel: true } : {}
				});
			}
			throw new Error(`Action ${action} is not supported for provider ${providerId}.`);
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
// extensions/slack/src/conversation-route-owner.ts
function prepareSlackConversationRouteOwner(params) {
	const accountId = normalizeAccountId$2(params.accountId);
	const accountConfig = resolveAccountEntry(params.cfg.channels?.slack?.accounts, accountId);
	if (params.cfg.channels?.slack?.enabled === false || accountConfig?.enabled === false || !accountConfig && (accountId !== DEFAULT_ACCOUNT_ID$1 || !hasImplicitDefaultSlackAccount(params.cfg))) return {
		kind: "terminal",
		owner: null
	};
	const installationKind = getSlackInstallationKind(accountId);
	const direct = params.conversation.kind === "direct";
	const target = parseSlackTarget(params.conversation.peerId, { defaultKind: direct ? "user" : "channel" });
	if (!target || target.kind !== (direct ? "user" : "channel")) return {
		kind: "terminal",
		owner: null
	};
	const targetIsEnterprise = Boolean(target.teamId);
	if (!targetIsEnterprise && (installationKind === "degraded" || !installationKind)) return {
		kind: "terminal",
		owner: { kind: "unavailable" }
	};
	if (targetIsEnterprise && installationKind === "workspace") return {
		kind: "terminal",
		owner: null
	};
	const contextTeamId = params.conversation.context?.teamId?.trim();
	if (contextTeamId && target.teamId && contextTeamId.toLowerCase() !== target.teamId.toLowerCase()) return {
		kind: "terminal",
		owner: null
	};
	const teamId = contextTeamId ?? target.teamId;
	if (!direct && params.conversation.nativeChannelId && params.conversation.nativeChannelId.toLowerCase() !== target.id.toLowerCase()) return {
		kind: "terminal",
		owner: null
	};
	const enterpriseRoute = installationKind === "enterprise" || targetIsEnterprise;
	if (enterpriseRoute && !teamId) return {
		kind: "terminal",
		owner: null
	};
	const enterpriseScope = enterpriseRoute && teamId ? { teamId } : void 0;
	const resolveRoute = ({ boundAgentId, bindingOwnerAvailable }) => resolveAgentRoute({
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
	const route = {
		cfg: params.cfg,
		resolveRoute,
		accountId,
		baseConversationId,
		runtimeBindingThreadId: params.conversation.threadId,
		bindingsEnabled: !enterpriseRoute,
		touchBinding: false
	};
	return {
		kind: "prepared",
		route,
		resolve(inspections) {
			const bindingRoute = resolveSlackConversationBindingRoute({
				...route,
				inspections
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
	};
}
const slackConversationRouteOwners = { prepareConversationRouteOwnersAsync: async (inputs, inspectBindings) => {
	const prepared = inputs.map(prepareSlackConversationRouteOwner);
	const inspect = await inspectBindings(prepared.flatMap((item) => item.kind === "prepared" && item.route.bindingsEnabled ? [{
		channel: "slack",
		accountId: item.route.accountId,
		conversationId: item.route.baseConversationId
	}, ...item.route.runtimeBindingThreadId ? [{
		channel: "slack",
		accountId: item.route.accountId,
		conversationId: item.route.runtimeBindingThreadId,
		parentConversationId: item.route.baseConversationId
	}] : []] : []));
	let index = 0;
	const nextInspection = () => {
		const position = index++;
		return () => {
			const inspection = inspect()[position];
			if (!inspection) throw new Error("Slack binding owner returned an incomplete selection");
			return inspection;
		};
	};
	return prepared.map((item) => {
		if (item.kind === "terminal") return () => item.owner;
		const base = item.route.bindingsEnabled ? nextInspection() : () => ({
			status: "available",
			binding: null
		});
		const thread = item.route.bindingsEnabled && item.route.runtimeBindingThreadId ? nextInspection() : base;
		return () => item.resolve({
			base: base(),
			thread: thread()
		});
	});
} };
// extensions/slack/src/enterprise-user-route.ts
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
// extensions/slack/src/mention-adapter.ts
/** The retained ID/name form is for model input; these ranges only describe display. */
function readSlackDisplayMentions(text) {
	return Array.from(text.matchAll(/<@([UW][A-Z0-9]+)>(?: \(([^\r\n)]{1,256})\))?/gu)).flatMap((match) => {
		const userId = match[1];
		const senderId = userId ? normalizeSlackStableEntry(userId) : null;
		return senderId ? [{
			start: match.index,
			end: match.index + match[0].length,
			senderId,
			...match[2]?.trim() ? { fallbackLabel: match[2].trim() } : {}
		}] : [];
	});
}
const slackMentionAdapter = {
	readDisplayMentions: readSlackDisplayMentions,
	stripPatterns: ({ ctx }) => {
		const preparedPatterns = ctx.ChannelContext?.chat?.mentionStripPatterns;
		return [...Array.isArray(preparedPatterns) ? preparedPatterns.flatMap((pattern) => typeof pattern === "string" ? [escapeRegExp(pattern)] : []) : [], "<@[^>\\s]+>"];
	}
};
// extensions/slack/src/security.ts
const resolveSlackDmPolicy = createScopedDmSecurityResolver({
	channelKey: "slack",
	resolvePolicy: (account) => account.config.dmPolicy,
	resolveAllowFrom: (account) => account.config.allowFrom,
	resolveAccess: ({ cfg, account }) => ({
		dmPolicy: resolveSlackAccountDmPolicy({
			cfg,
			accountId: account.accountId
		}),
		allowFrom: resolveSlackAccountAllowFrom({
			cfg,
			accountId: account.accountId
		})
	}),
	policyPathSuffix: "dmPolicy",
	classifyEntryAuthentication: identityEntryAuthenticationClassifier(slackIngressIdentity),
	normalizeEntry: (raw) => raw.trim().replace(/^(slack|user):/i, "").trim()
});
const collectSlackSecurityWarnings = createOpenProviderConfiguredRouteWarningCollector({
	providerConfigPresent: (cfg) => cfg.channels?.slack !== void 0,
	resolveGroupPolicy: (account) => account.config.groupPolicy,
	resolveRouteAllowlistConfigured: (account) => Boolean(account.config.channels) && Object.keys(account.config.channels ?? {}).length > 0,
	configureRouteAllowlist: {
		surface: "Slack channels",
		openScope: "any channel not explicitly denied",
		groupPolicyPath: "channels.slack.groupPolicy",
		routeAllowlistPath: "channels.slack.channels"
	},
	missingRouteAllowlist: {
		surface: "Slack channels",
		openBehavior: "with no channel allowlist; any channel can trigger (mention-gated)",
		remediation: "Set channels.slack.groupPolicy=\"allowlist\" and configure channels.slack.channels"
	}
});
const collectSlackSecurityFindings = createConditionalWarningCollector.findings({
	collectWarnings: collectSlackSecurityWarnings,
	checkId: "channels.slack.groups.open",
	severity: "warn",
	title: "Slack security warning"
});
const loadSlackSecurityAuditModule = createLazyRuntimeModule(() => import("./security-audit-C3hXCfDt.mjs").then((n) => n.n));
const slackSecurityAdapter = {
	resolveDmPolicy: resolveSlackDmPolicy,
	collectWarnings: collectSlackSecurityFindings,
	collectAuditFindings: async (params) => {
		const { collectSlackSecurityAuditFindings } = await loadSlackSecurityAuditModule();
		return await collectSlackSecurityAuditFindings(params);
	}
};
// extensions/slack/src/doctor.ts
const isSlackMutableUnqualifiedAllowEntry = buildMutableAllowEntryDetector({ stableIdPattern: /^(?:(?:(?:[sS][lL][aA][cC][kK]|[uU][sS][eE][rR]):)?(?:[UWBCGDT][A-Z0-9]{2,}|[A-Za-z0-9]{8,})|<@[A-Za-z0-9]{8,}>)$/ });
const collectSlackMutableAllowlistWarnings = createDangerousNameMatchingMutableAllowlistWarningCollector({
	channel: "slack",
	detector: (entry) => {
		if (/^team:/i.test(entry)) try {
			const target = parseSlackTarget(entry);
			if (target?.kind === "user" && target.teamId) return false;
		} catch {}
		return isSlackMutableUnqualifiedAllowEntry(entry);
	},
	collectLists: (scope) => collectStandardAllowlistLists(scope, {
		includeGroupAllowFrom: false,
		includeDm: true,
		includeGroups: true,
		groupsKey: "channels",
		groupField: "users"
	})
});
const SLACK_CANONICAL_CHANNEL_ID_RE = /^(?:channel:)?[CG][A-Z0-9]{8,}$/;
const SLACK_LOWERCASE_CHANNEL_ID_RE = /^(?:channel:)?[cg][0-9][a-z0-9]{7,}$/;
const SLACK_CANONICAL_DM_ID_RE = /^(?:channel:)?D[A-Z0-9]{8,}$/;
const SLACK_PREFIXED_LOWERCASE_DM_ID_RE = /^channel:d[a-z0-9]{8,}$/;
const SLACK_AMBIGUOUS_LOWERCASE_DM_ID_RE = /^d[a-z0-9]{8,}$/;
const SLACK_AMBIGUOUS_LOWERCASE_CHANNEL_ID_RE = /^(?:channel:)?[cgd][a-z][a-z0-9]{7,}$/;
const SLACK_CHANNEL_NAME_RE = /^[\p{L}\p{M}\p{N}_-]{1,80}$/u;
const SLACK_CHANNEL_NAME_ALPHANUMERIC_RE = /[\p{L}\p{N}]/u;
function looksLikeSlackChannelId(channelKey) {
	const workspaceChannelId = parseWorkspaceQualifiedChannelId(channelKey);
	return workspaceChannelId !== void 0 && /^[CG]/i.test(workspaceChannelId) || SLACK_CANONICAL_CHANNEL_ID_RE.test(channelKey) || SLACK_LOWERCASE_CHANNEL_ID_RE.test(channelKey);
}
function looksLikeSlackDmId(channelKey) {
	const workspaceChannelId = parseWorkspaceQualifiedChannelId(channelKey);
	return workspaceChannelId !== void 0 && /^D/i.test(workspaceChannelId) || SLACK_CANONICAL_DM_ID_RE.test(channelKey) || SLACK_PREFIXED_LOWERCASE_DM_ID_RE.test(channelKey);
}
function parseWorkspaceQualifiedChannelId(channelKey) {
	if (!/^team:/i.test(channelKey)) return;
	try {
		const target = parseSlackTarget(channelKey);
		return target?.kind === "channel" && target.teamId ? target.id : void 0;
	} catch {
		return;
	}
}
function looksLikeSlackChannelNameKey(channelKey) {
	const name = channelKey.startsWith("#") ? channelKey.slice(1) : channelKey;
	return name === name.toLowerCase() && SLACK_CHANNEL_NAME_RE.test(name) && SLACK_CHANNEL_NAME_ALPHANUMERIC_RE.test(name);
}
function collectSlackNameKeyedChannelWarnings({ cfg }) {
	const warnings = /* @__PURE__ */ new Set();
	const slackCfg = (0, runtime_doctor_migrations_exports.asObjectRecord)((0, runtime_doctor_migrations_exports.asObjectRecord)(cfg.channels)?.slack);
	const providerChannels = (0, runtime_doctor_migrations_exports.asObjectRecord)(slackCfg?.channels);
	const accounts = (0, runtime_doctor_migrations_exports.asObjectRecord)(slackCfg?.accounts);
	for (const accountId of listSlackAccountIds(cfg)) {
		const account = (0, runtime_doctor_migrations_exports.asObjectRecord)(mergeSlackAccountConfig(cfg, accountId));
		if (!account || slackCfg?.enabled === false || account.enabled === false) continue;
		const effectiveGroupPolicy = (typeof account.groupPolicy === "string" ? account.groupPolicy : void 0) ?? "allowlist";
		const rawAccount = (0, runtime_doctor_migrations_exports.asObjectRecord)(accounts?.[accountId]);
		const accountPrefix = rawAccount ? `channels.slack.accounts.${accountId}` : "channels.slack";
		const accountChannels = (0, runtime_doctor_migrations_exports.asObjectRecord)(rawAccount?.channels);
		const channels = accountChannels ?? providerChannels;
		if (!channels) continue;
		const channelsPrefix = accountChannels ? `channels.slack.accounts.${accountId}` : "channels.slack";
		const fallbackDescription = Object.hasOwn(channels, "*") ? `${channelsPrefix}.channels."*" applies instead and this entry's overrides are ignored` : effectiveGroupPolicy === "open" ? "this entry's overrides are ignored and the channel remains allowed by groupPolicy: \"open\"" : "messages from the channel are dropped";
		for (const channelKey of Object.keys(channels)) {
			if (channelKey === "*") continue;
			if (looksLikeSlackDmId(channelKey)) {
				warnings.add(`${channelsPrefix}.channels."${channelKey}" is a Slack DM conversation ID, but ${channelsPrefix}.channels only configures channel and group rooms. Configure DM access with ${accountPrefix}.dmPolicy and ${accountPrefix}.allowFrom instead.`);
				continue;
			}
			if (SLACK_AMBIGUOUS_LOWERCASE_DM_ID_RE.test(channelKey)) {
				if (account.dangerouslyAllowNameMatching === true && looksLikeSlackChannelNameKey(channelKey)) continue;
				warnings.add(`${channelsPrefix}.channels."${channelKey}" is ambiguous: it may be a lowercase Slack DM conversation ID or a channel name. Configure DMs with ${accountPrefix}.dmPolicy and ${accountPrefix}.allowFrom; otherwise re-key the room with its stable C/G ID.`);
				continue;
			}
			if (effectiveGroupPolicy === "disabled") continue;
			const channelConfig = (0, runtime_doctor_migrations_exports.asObjectRecord)(channels[channelKey]);
			if (effectiveGroupPolicy === "open" && Object.keys(channelConfig ?? {}).length === 0) continue;
			if (looksLikeSlackChannelId(channelKey)) continue;
			if (account.dangerouslyAllowNameMatching === true && looksLikeSlackChannelNameKey(channelKey)) continue;
			if (SLACK_AMBIGUOUS_LOWERCASE_CHANNEL_ID_RE.test(channelKey)) {
				warnings.add(`${channelsPrefix}.channels."${channelKey}" is ambiguous: it may be a lowercase Slack channel ID or a channel name. If it is a channel name, inbound routing will not match it and ${fallbackDescription}. Re-key it with the channel's stable ID (e.g. C0123ABCD, from the channel's About details or conversations.info).`);
				continue;
			}
			warnings.add(`${channelsPrefix}.channels."${channelKey}" is keyed by a channel name or unsupported ID form, not a routable Slack channel ID; under groupPolicy: "${effectiveGroupPolicy}" inbound routing does not match this entry, so ${fallbackDescription}. Re-key it with the channel's ID (e.g. C0123ABCD, from the channel's About details or conversations.info).`);
		}
	}
	return [...warnings];
}
async function collectSlackUserIdentityWarnings(params) {
	const warnings = [];
	for (const accountId of listSlackAccountIds(params.cfg)) {
		const account = inspectSlackAccount({
			cfg: params.cfg,
			accountId,
			envBotToken: params.env?.SLACK_BOT_TOKEN,
			envAppToken: params.env?.SLACK_APP_TOKEN,
			envUserToken: params.env?.SLACK_USER_TOKEN
		});
		if (!account.enabled || account.identity !== "user") continue;
		const path = accountId === "default" ? "channels.slack" : `channels.slack.accounts.${accountId}`;
		const mode = account.mode ?? "socket";
		if (mode === "socket" && account.appTokenStatus === "missing") warnings.push(`- ${path}: identity "user" in Socket Mode requires appToken for companion-app events.`);
		else if (mode === "http" && account.signingSecretStatus === "missing") warnings.push(`- ${path}: identity "user" in HTTP mode requires signingSecret for companion-app events.`);
		if (!account.userToken) {
			warnings.push(account.userTokenStatus === "configured_unavailable" ? `- ${path}: userToken is configured but unavailable; Slack auth.test validation was skipped.` : `- ${path}: identity "user" requires userToken for the authorizing human.`);
			continue;
		}
		const probe = await probeSlack(account.userToken, 2500, {
			accountId,
			identity: "user"
		});
		if (!probe.ok) {
			warnings.push(`- ${path}: userToken auth.test failed: ${probe.error ?? "unknown error"}.`);
			continue;
		}
		const userId = probe.user?.id?.trim();
		const userName = probe.user?.name?.trim();
		if (!userId) {
			warnings.push(`- ${path}: userToken auth.test succeeded but returned no human user_id.`);
			continue;
		}
		warnings.push(`- ${path}: user identity authenticated as ${userName ? `@${userName} ` : ""}(${userId}).`);
	}
	return warnings;
}
const slackDoctor = {
	dmAllowFromMode: "topOnly",
	groupModel: "route",
	groupAllowFromFallbackToAllowFrom: false,
	warnOnEmptyGroupSenderAllowlist: false,
	legacyConfigRules,
	normalizeCompatibilityConfig,
	collectPreviewWarnings: collectSlackUserIdentityWarnings,
	collectMutableAllowlistWarnings: ({ cfg }) => [...collectSlackMutableAllowlistWarnings({ cfg }), ...collectSlackNameKeyedChannelWarnings({ cfg })]
};
// extensions/slack/src/shared.ts
const slackConfigAdapter = {
	...slackBaseConfigAdapter,
	inspectAccount: adaptScopedAccountAccessor(inspectSlackAccount)
};
const slackPluginBase = {
	...slackSetupPlugin,
	meta: {
		...SLACK_CHANNEL_META,
		preferSessionLookupForAnnounceTarget: true
	},
	doctor: slackDoctor,
	agentPrompt: {
		questionInputMode: "buttons",
		customInlineButtonHint: true,
		inboundFormattingHints: () => ({
			text_markup: "markdown",
			rules: [
				"Write replies in standard Markdown; OpenClaw converts them to Slack mrkdwn.",
				"Bold uses **double asterisks**; *single asterisks* or _underscores_ produce italics.",
				"Links use [label](url). Keep Slack mentions as <@USER_ID>.",
				"Use presentation table blocks for tabular data; Markdown pipe tables are not auto-promoted.",
				"Only raw Block Kit or presentation text fields use Slack mrkdwn directly: *bold*, _italic_, ~strike~, and <url|label> links. Avoid Markdown headings or pipe tables in those fields."
			]
		}),
		messageToolHints: () => [
			"- Use `presentation` buttons/selects for discrete choices or parameter picks instead of asking the user to type one.",
			"- For line, bar, area, or pie data, use a `presentation` chart block; Slack renders it as a native chart and retains a text data summary for accessibility.",
			"- For row-and-column data, use an explicit `presentation` table block; Slack renders it as a native table and retains a linear text summary for accessibility. Markdown pipe tables are not auto-promoted.",
			"- Slack plain text sends: write standard Markdown; OpenClaw converts it to Slack mrkdwn, including `**bold**`, headings, lists, and `[label](url)` links.",
			"- When mentioning Slack users, use the stable `<@USER_ID>` token from Slack context instead of plain `@name` text so Slack notifies and links the user.",
			"- Slack Block Kit or presentation text fields are sent as Slack mrkdwn directly; use `*bold*`, `_italic_`, `~strike~`, `<url|label>` links, and avoid Markdown headings or pipe tables there."
		]
	},
	config: {
		...slackSetupPlugin.config,
		...slackConfigAdapter,
		isConfigured: isSlackPluginAccountConfigured,
		describeAccount: (account) => describeAccountSnapshot({
			account,
			configured: isSlackPluginAccountConfigured(account),
			extra: {
				botTokenSource: account.botTokenSource,
				appTokenSource: account.appTokenSource
			}
		})
	},
	secrets: {
		secretTargetRegistryEntries,
		collectRuntimeConfigAssignments
	}
};
// extensions/slack/src/threading-tool-context.ts
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
// extensions/slack/src/channel.ts
const loadExtensionSharedSdk = createLazyRuntimeModule(() => import("openclaw/plugin-sdk/extension-shared"));
const loadTargetResolverRuntimeSdk = createLazyRuntimeModule(() => import("openclaw/plugin-sdk/target-resolver-runtime"));
const loadSlackScopesModule = createLazyRuntimeModule(() => import("./scopes-DKl6yqIv.mjs"));
const loadSlackOutboundAdapterModule = createLazyRuntimeModule(() => import("./outbound-adapter-1JpFMcJD.mjs"));
const bindSlackOutbound = createLazyRuntimeMethodBinder(loadSlackOutboundAdapterModule);
const loadSlackDirectoryConfigModule = createLazyRuntimeModule(() => import("./directory-config-CGvKYg9F.mjs").then((n) => n.t));
const loadSlackResolveChannelsModule = createLazyRuntimeModule(() => import("./resolve-channels-CF2JME9q.mjs").then((n) => n.n));
const loadSlackResolveUsersModule = createLazyRuntimeModule(() => import("./resolve-users-DDcCAjH1.mjs").then((n) => n.n));
const loadSlackSendRuntime = createLazyRuntimeModule(() => import("./send-kGJWQtLk.mjs").then((n) => n.n));
const loadSlackProbeModule = createLazyRuntimeModule(() => import("./probe-BHqvMbno.mjs").then((n) => n.n));
const loadSlackMonitorModule = createLazyRuntimeModule(() => import("./monitor-MmW89Bu-.mjs").then((n) => n.t));
const loadSlackDirectoryLiveModule = createLazyRuntimeModule(() => import("./directory-live-DNdw97LA.mjs").then((n) => n.t));
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
			matchInboundConversation: ({ compiledBinding, conversationId: rawConversationId, parentConversationId: rawParentConversationId }) => {
				const bindingConversationId = normalizeSlackAcpConversationId(compiledBinding.conversationId)?.conversationId;
				const conversationId = normalizeSlackAcpConversationId(rawConversationId)?.conversationId;
				const parentConversationId = normalizeSlackAcpConversationId(rawParentConversationId)?.conversationId;
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
		},
		conversationBindings: slackConversationBindings,
		messaging: {
			...slackConversationRouteOwners,
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
			resolveOutboundSessionRoute: async (params) => {
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
			},
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
			return resolveTargetsWithOptionalToken({
				token: normalizeOptionalString(account.userToken) ?? normalizeOptionalString(account.botToken),
				inputs,
				missingTokenNote: "missing Slack token",
				resolveWithToken: async ({ token, inputs: entries }) => {
					if (kind === "group") return (await (await loadSlackResolveChannelsModule()).resolveSlackChannelAllowlist({
						token,
						entries
					})).map((entry) => toResolvedTarget(entry, entry.archived ? "archived" : void 0));
					return (await (await loadSlackResolveUsersModule()).resolveSlackUserAllowlist({
						token,
						entries
					})).map((entry) => toResolvedTarget(entry, entry.note));
				},
				mapResolved: (entry) => entry
			});
		} },
		actions: createSlackActions(SLACK_CHANNEL),
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
			defaultRuntime: createDefaultChannelRuntimeState(DEFAULT_ACCOUNT_ID$1),
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
			formatCapabilitiesProbe: ({ probe: slackProbe }) => {
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
					const source = result.source ? ` (${result.source})` : "";
					const label = tokenType === "user" ? "User scopes" : "Bot scopes";
					lines.push(result.ok && result.scopes?.length ? { text: `${label}${source}: ${result.scopes.join(", ")}` } : {
						text: `${label}: ${result.error ?? "scope lookup failed"}`,
						tone: "error"
					});
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
					setStatus: ctx.setStatus
				});
			}
		},
		mentions: slackMentionAdapter
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
export { buildSlackThreadingToolContext as n, slackPlugin as t };
