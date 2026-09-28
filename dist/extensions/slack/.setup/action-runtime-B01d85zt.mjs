import { Mt as SLACK_PRIVATE_ACTION_DELIVERY_RESULT, Nt as resolveSlackAutoThreadId, ct as parseSlackBlocksInput, f as assertSlackDetachedTargetAllowed, r as buildSlackChannelIdCandidates, v as hasSlackNativeDataBlock, xt as getSlackInstallationKind } from "./session-status-Cf7AvWOt.mjs";
import { a as parseSlackTarget, n as formatSlackTarget, o as resolveSlackChannelId } from "./target-parsing-DEsPjngB.mjs";
import { t as slackContextTargetsMatch } from "./targets-Cku2KCvg.mjs";
import { n as resolveSlackChannelConfig, t as isSlackChannelAllowedByPolicy } from "./policy-BApW53pI.mjs";
import { t as mergeSlackSendResults } from "./send-results-eeOu_HYm.mjs";
import { normalizeAccountId } from "openclaw/plugin-sdk/account-resolution";
import { normalizeOptionalLowercaseString } from "openclaw/plugin-sdk/string-coerce-runtime";
import { createLazyRuntimeMethodBinder, createLazyRuntimeModule } from "openclaw/plugin-sdk/lazy-runtime";
import { isSingleUseReplyToMode } from "openclaw/plugin-sdk/reply-reference";
import { readBooleanParam } from "openclaw/plugin-sdk/boolean-param";
import { createActionGate, imageResultFromFile, jsonResult, readPositiveIntegerParam, readReactionParams, readStringParam, withNormalizedTimestamp } from "openclaw/plugin-sdk/channel-actions";
import { resolveOpenProviderRuntimeGroupPolicy } from "openclaw/plugin-sdk/runtime-group-policy";
//#region extensions/slack/src/action-runtime.ts
const messagingActions = /* @__PURE__ */ new Set([
	"openConversation",
	"sendMessage",
	"uploadFile",
	"editMessage",
	"deleteMessage",
	"readMessages",
	"downloadFile"
]);
const reactionsActions = /* @__PURE__ */ new Set(["react", "reactions"]);
const pinActions = /* @__PURE__ */ new Set([
	"pinMessage",
	"unpinMessage",
	"listPins"
]);
const SLACK_REACTION_RESULT_LIMIT = 100;
const loadSlackActionsRuntime = createLazyRuntimeModule(() => import("./actions-DKCtBgCI.mjs").then((n) => n.t));
const bindSlackAction = createLazyRuntimeMethodBinder(loadSlackActionsRuntime);
const loadSlackAccountsRuntime = createLazyRuntimeModule(() => import("./accounts.runtime-DN-PPocC.mjs"));
const loadSlackChannelTypeRuntime = createLazyRuntimeModule(() => import("./channel-type-Dxk8VJUb.mjs").then((n) => n.t));
const bindSlackChannelType = createLazyRuntimeMethodBinder(loadSlackChannelTypeRuntime);
const slackActionRuntime = {
	deleteSlackMessage: bindSlackAction((runtime) => runtime.deleteSlackMessage),
	downloadSlackFile: bindSlackAction((runtime) => runtime.downloadSlackFile),
	editSlackMessage: bindSlackAction((runtime) => runtime.editSlackMessage),
	getSlackMemberInfo: bindSlackAction((runtime) => runtime.getSlackMemberInfo),
	listSlackEmojis: bindSlackAction((runtime) => runtime.listSlackEmojis),
	listSlackPins: bindSlackAction((runtime) => runtime.listSlackPins),
	listSlackReactions: bindSlackAction((runtime) => runtime.listSlackReactions),
	openSlackConversation: bindSlackAction((runtime) => runtime.openSlackConversation),
	parseSlackBlocksInput,
	pinSlackMessage: bindSlackAction((runtime) => runtime.pinSlackMessage),
	reactSlackMessage: bindSlackAction((runtime) => runtime.reactSlackMessage),
	readSlackMessages: bindSlackAction((runtime) => runtime.readSlackMessages),
	removeOwnSlackReactions: bindSlackAction((runtime) => runtime.removeOwnSlackReactions),
	removeSlackReaction: bindSlackAction((runtime) => runtime.removeSlackReaction),
	resolveSlackConversationName: bindSlackAction((runtime) => runtime.resolveSlackConversationName),
	resolveSlackConversationInfo: bindSlackChannelType((runtime) => runtime.resolveSlackConversationInfo),
	resolveSlackChannelType: async (params) => (await loadSlackChannelTypeRuntime()).resolveSlackChannelType(params),
	sendSlackMessage: bindSlackAction((runtime) => runtime.sendSlackMessage),
	unpinSlackMessage: bindSlackAction((runtime) => runtime.unpinSlackMessage)
};
function resolveThreadTsFromContext(explicitThreadTs, targetChannel, context, opts) {
	if (explicitThreadTs) return explicitThreadTs;
	if (opts?.suppressImplicitThread) return;
	const threadTs = resolveSlackAutoThreadId({
		to: targetChannel,
		toolContext: context
	});
	if (isSingleUseReplyToMode(context?.replyToMode ?? "off") && !context?.hasRepliedRef) return;
	return threadTs;
}
function readSlackBlocksParam(params) {
	return slackActionRuntime.parseSlackBlocksInput(params.blocks);
}
function isImageContentType(value) {
	return value?.trim().toLowerCase().startsWith("image/") === true;
}
function hasPotentialSlackNamedPolicy(params) {
	if (params.allowNameMatching !== true) return false;
	return Object.entries(params.channels ?? {}).some(([key, entry]) => {
		if (entry == null || key === "*") return false;
		const named = !/^(?:channel:)?[CDG][A-Z0-9]+$/i.test(key);
		const entryAllows = entry.enabled !== false;
		return named && (params.decision === "allow" ? entryAllows : !entryAllows);
	});
}
function resolveSlackDmReadAllowed(account) {
	const dmPolicy = account.config.dmPolicy ?? "pairing";
	return account.config.dm?.enabled !== false && dmPolicy !== "disabled";
}
function normalizeConfiguredSlackDmUserId(value) {
	const target = parseSlackTarget(String(value), { defaultKind: "user" });
	if (target?.kind !== "user") return;
	const userId = target.id.trim().toLowerCase();
	return /^[uw][a-z0-9]+$/i.test(userId) ? userId : void 0;
}
async function isSlackDmTargetConfigured(params) {
	const defaultTo = params.account.config.defaultTo?.trim();
	if (defaultTo && slackContextTargetsMatch(params.channelId, { currentChannelId: defaultTo })) return true;
	const userId = normalizeConfiguredSlackDmUserId(params.userId);
	if (!userId) return false;
	const { resolveSlackAccountAllowFrom } = await loadSlackAccountsRuntime();
	return [
		...resolveSlackAccountAllowFrom({
			cfg: params.cfg,
			accountId: params.account.accountId
		}) ?? [],
		...Object.keys(params.account.config.dms ?? {}),
		...defaultTo ? [defaultTo] : []
	].some((entry) => normalizeConfiguredSlackDmUserId(entry) === userId);
}
function isCurrentSlackReadTarget(params) {
	const requesterAccountId = params.context?.requesterAccountId?.trim();
	return Boolean(normalizeOptionalLowercaseString(params.context?.currentChannelProvider) === "slack" && requesterAccountId && normalizeAccountId(requesterAccountId) === normalizeAccountId(params.account.accountId) && params.context && slackContextTargetsMatch(params.target, params.context));
}
function assertSlackMemberInfoAllowed(params) {
	if (params.context?.conversationReadOrigin === "direct-operator") return;
	const requesterAccountId = params.context?.requesterAccountId?.trim();
	const requesterSenderId = normalizeOptionalLowercaseString(params.context?.requesterSenderId);
	if (normalizeOptionalLowercaseString(params.context?.currentChannelProvider) !== "slack" || !requesterAccountId || normalizeAccountId(requesterAccountId) !== normalizeAccountId(params.account.accountId) || !requesterSenderId || requesterSenderId !== normalizeOptionalLowercaseString(params.userId)) throw new Error("Delegated Slack member info is limited to the current requester.");
}
function resolveSlackChannelReadPolicy(params) {
	const channels = params.account.config.channels;
	const channelKeys = Object.keys(channels ?? {});
	const channelConfig = resolveSlackChannelConfig({
		teamId: params.teamId,
		allowUnscoped: getSlackInstallationKind(params.account.accountId) !== "enterprise",
		channelId: params.channelId,
		channelName: params.channelName,
		channels,
		channelKeys,
		allowNameMatching: params.account.config.dangerouslyAllowNameMatching,
		defaultRequireMention: params.account.config.requireMention
	});
	const channelAllowed = channelConfig?.allowed !== false;
	const channelExplicitlyDisabled = !channelAllowed && channelConfig?.matchSource === "direct";
	const channelWildcardDisabled = !channelAllowed && channelConfig?.matchSource === "wildcard";
	const { groupPolicy } = resolveOpenProviderRuntimeGroupPolicy({
		providerConfigPresent: params.cfg.channels?.slack !== void 0,
		groupPolicy: params.account.config.groupPolicy,
		defaultGroupPolicy: params.cfg.channels?.defaults?.groupPolicy
	});
	const delegatedChannelAllowed = isSlackChannelAllowedByPolicy({
		groupPolicy,
		channelAllowlistConfigured: channelKeys.length > 0,
		channelAllowed
	}) && !(!channelAllowed && (groupPolicy !== "open" || channelConfig?.matchSource));
	const directChannelAllowed = groupPolicy !== "disabled" && !channelExplicitlyDisabled && !channelWildcardDisabled;
	const baseChannelAllowed = params.conversationReadOrigin === "direct-operator" || params.currentConversation ? directChannelAllowed : delegatedChannelAllowed;
	const allowNameMatching = params.account.config.dangerouslyAllowNameMatching;
	const shouldResolveName = !params.metadataResolved && !params.channelName && (baseChannelAllowed && channelConfig?.matchSource !== "direct" && hasPotentialSlackNamedPolicy({
		channels,
		allowNameMatching,
		decision: "deny"
	}) || !baseChannelAllowed && groupPolicy !== "disabled" && !channelExplicitlyDisabled && hasPotentialSlackNamedPolicy({
		channels,
		allowNameMatching,
		decision: "allow"
	}));
	return {
		channelAllowed: baseChannelAllowed,
		channelExplicitlyDisabled,
		groupDmAllowed: params.account.config.dm?.enabled !== false && params.account.config.dm?.groupEnabled === true && (params.currentConversation || isSlackGroupDmTargetConfigured(params.account, params.channelId, params.teamId)),
		shouldResolveName
	};
}
async function assertSlackReadTargetAllowed(params) {
	const deny = () => {
		throw new Error("Slack read target channel is not allowed.");
	};
	const currentConversation = isCurrentSlackReadTarget({
		account: params.account,
		target: formatSlackTarget({
			teamId: params.teamId,
			kind: "channel",
			id: params.channelId
		}),
		context: params.context
	});
	const directOperator = params.conversationReadOrigin === "direct-operator";
	if (/^D/i.test(params.channelId)) {
		if (!resolveSlackDmReadAllowed(params.account)) deny();
		if (directOperator || currentConversation) return;
		const info = await slackActionRuntime.resolveSlackConversationInfo({
			cfg: params.cfg,
			accountId: params.account.accountId,
			channelId: params.channelId,
			teamId: params.teamId,
			operation: "read",
			assertDirectAdapterHandoff: params.context?.assertDirectAdapterHandoff
		});
		if (info.type !== "dm" || !await isSlackDmTargetConfigured({
			...params,
			userId: info.user
		})) deny();
		return;
	}
	const preliminary = resolveSlackChannelReadPolicy({
		...params,
		currentConversation
	});
	if (preliminary.channelExplicitlyDisabled) deny();
	if (!(preliminary.shouldResolveName || preliminary.channelAllowed !== preliminary.groupDmAllowed)) {
		if (!preliminary.channelAllowed) deny();
		return;
	}
	const info = await slackActionRuntime.resolveSlackConversationInfo({
		cfg: params.cfg,
		accountId: params.account.accountId,
		channelId: params.channelId,
		teamId: params.teamId,
		operation: "read",
		...preliminary.shouldResolveName ? { requireFreshName: true } : {},
		assertDirectAdapterHandoff: params.context?.assertDirectAdapterHandoff
	});
	if (preliminary.shouldResolveName && (info.type === "channel" || info.type === "unknown") && !info.name) deny();
	const resolved = resolveSlackChannelReadPolicy({
		...params,
		channelName: info.name,
		metadataResolved: true,
		currentConversation
	});
	if (resolved.channelExplicitlyDisabled) deny();
	if (info.type === "dm") {
		if (!resolveSlackDmReadAllowed(params.account) || !directOperator && !currentConversation && !await isSlackDmTargetConfigured({
			...params,
			userId: info.user
		})) deny();
		return;
	}
	if (!(info.type === "channel" ? resolved.channelAllowed : info.type === "group" ? resolved.groupDmAllowed : resolved.channelAllowed && resolved.groupDmAllowed)) deny();
}
function isSlackGroupDmTargetConfigured(account, channelId, teamId) {
	const entries = account.config.dm?.groupChannels ?? [];
	if (entries.length === 0) return true;
	const candidates = new Set(buildSlackChannelIdCandidates(channelId, teamId, { allowUnscoped: getSlackInstallationKind(account.accountId) !== "enterprise" }).map((candidate) => candidate.toLowerCase()));
	const target = channelId.trim().toLowerCase();
	return entries.some((entry) => {
		const candidate = String(entry).trim().toLowerCase();
		return candidate === "*" || candidates.has(candidate) || candidate === target || candidate === `slack:${target}` || candidate === `channel:${target}` || candidate === `group:${target}` || candidate === `mpim:${target}`;
	});
}
function resolveTrustedCurrentSlackTeamId(params) {
	const requesterAccountId = params.context?.requesterAccountId?.trim();
	if (normalizeOptionalLowercaseString(params.context?.currentChannelProvider) !== "slack" || !requesterAccountId || normalizeAccountId(requesterAccountId) !== normalizeAccountId(params.account.accountId)) return;
	const matchingTeams = /* @__PURE__ */ new Map();
	for (const raw of [params.context?.currentChannelId, params.context?.currentMessagingTarget]) {
		if (!raw) continue;
		const current = parseSlackTarget(raw);
		if (current?.teamId && (!params.target || current.kind === params.target.kind && current.id.toLowerCase() === params.target.id.toLowerCase())) matchingTeams.set(current.teamId.toLowerCase(), current.teamId);
	}
	return matchingTeams.size === 1 ? matchingTeams.values().next().value : void 0;
}
function resolveSlackActionTarget(account, raw, context) {
	const parsed = parseSlackTarget(raw, { defaultKind: "channel" });
	if (!parsed) throw new Error("Slack target is required.");
	const teamId = parsed.teamId ?? resolveTrustedCurrentSlackTeamId({
		account,
		target: parsed,
		context
	});
	assertSlackDetachedTargetAllowed(account.accountId, teamId);
	return {
		routingTarget: teamId ? formatSlackTarget({
			teamId,
			kind: parsed.kind,
			id: parsed.id
		}) : raw,
		teamId
	};
}
function resolveSlackActionChannelTarget(account, raw, context) {
	const resolved = resolveSlackActionTarget(account, raw, context);
	return {
		channelId: resolveSlackChannelId(raw),
		teamId: resolved.teamId
	};
}
async function handleSlackAction(params, cfg, context) {
	const action = readStringParam(params, "action", { required: true });
	const accountId = readStringParam(params, "accountId");
	const { resolveSlackAccount, resolveSlackOperationToken } = await loadSlackAccountsRuntime();
	const account = resolveSlackAccount({
		cfg,
		accountId
	});
	const resolveChannelTarget = () => resolveSlackActionChannelTarget(account, readStringParam(params, "channelId", { required: true }), context);
	const actionConfig = account.actions ?? cfg.channels?.slack?.actions;
	const isActionEnabled = createActionGate(actionConfig);
	const botToken = account.botToken?.trim();
	const buildActionOpts = (operation, teamId) => {
		const token = resolveSlackOperationToken(account, operation);
		if (!token && account.identity === "user") throw new Error(`Slack operation token missing for account "${account.accountId}".`);
		const tokenOverride = token && token !== botToken ? token : void 0;
		return {
			cfg,
			...accountId ? { accountId } : {},
			...tokenOverride ? { token: tokenOverride } : {},
			teamId,
			assertDirectAdapterHandoff: context?.assertDirectAdapterHandoff
		};
	};
	const assertReadTargetAllowed = async (target) => {
		await assertSlackReadTargetAllowed({
			account,
			cfg,
			channelId: target.channelId,
			teamId: target.teamId,
			conversationReadOrigin: context?.conversationReadOrigin,
			context
		});
	};
	if (reactionsActions.has(action)) {
		if (!isActionEnabled("reactions")) throw new Error("Slack reactions are disabled.");
		const target = resolveChannelTarget();
		const { channelId } = target;
		const readOpts = buildActionOpts("read", target.teamId);
		const writeOpts = buildActionOpts("write", target.teamId);
		const messageId = readStringParam(params, "messageId", { required: true });
		if (action === "react") {
			const { emoji, remove, isEmpty } = readReactionParams(params, { removeErrorMessage: "Emoji is required to remove a Slack reaction." });
			await assertReadTargetAllowed(target);
			if (remove) {
				await slackActionRuntime.removeSlackReaction(channelId, messageId, emoji, writeOpts);
				return jsonResult({
					ok: true,
					removed: emoji
				});
			}
			if (isEmpty) {
				const removed = await slackActionRuntime.removeOwnSlackReactions(channelId, messageId, writeOpts);
				return jsonResult({
					ok: true,
					removed
				});
			}
			await slackActionRuntime.reactSlackMessage(channelId, messageId, emoji, writeOpts);
			return jsonResult({
				ok: true,
				added: emoji
			});
		}
		await assertReadTargetAllowed(target);
		const limit = Math.min(readPositiveIntegerParam(params, "limit", { message: "limit must be a positive integer." }) ?? SLACK_REACTION_RESULT_LIMIT, SLACK_REACTION_RESULT_LIMIT);
		const reactions = await slackActionRuntime.listSlackReactions(channelId, messageId, readOpts);
		return jsonResult({
			ok: true,
			reactions: reactions?.map((reaction) => reaction.users ? Object.assign({}, reaction, { users: reaction.users.slice(0, limit) }) : reaction)
		});
	}
	if (messagingActions.has(action)) {
		if (!isActionEnabled("messages")) throw new Error("Slack messages are disabled.");
		const sentResults = [];
		const sendSlackMessage = async (target, content, options) => {
			const replyReference = context?.hasRepliedRef && slackContextTargetsMatch(target, context) ? context.hasRepliedRef : void 0;
			const result = await slackActionRuntime.sendSlackMessage(target, content, {
				...options,
				...replyReference ? { [SLACK_PRIVATE_ACTION_DELIVERY_RESULT]: () => {
					replyReference.value = true;
				} } : {}
			});
			if (replyReference) replyReference.value = true;
			sentResults.push(result);
			return result;
		};
		switch (action) {
			case "openConversation": {
				const teamId = readStringParam(params, "teamId") ?? resolveTrustedCurrentSlackTeamId({
					account,
					context
				});
				assertSlackDetachedTargetAllowed(account.accountId, teamId);
				const result = await slackActionRuntime.openSlackConversation(params.userIds, buildActionOpts("write", teamId));
				return jsonResult({
					ok: true,
					...result
				});
			}
			case "sendMessage": {
				const destination = resolveSlackActionTarget(account, readStringParam(params, "to", { required: true }), context).routingTarget;
				const content = readStringParam(params, "content", { allowEmpty: true });
				const mediaUrl = readStringParam(params, "mediaUrl");
				const blocks = readSlackBlocksParam(params);
				const replyBroadcast = readBooleanParam(params, "replyBroadcast");
				const textIsSlackMrkdwn = readBooleanParam(params, "textIsSlackMrkdwn");
				const textIsSlackPlainText = readBooleanParam(params, "textIsSlackPlainText");
				const forceDocument = readBooleanParam(params, "forceDocument") === true;
				const preparedMessages = context?.preparedMessages;
				const authoredTextPlacement = readStringParam(params, "authoredTextPlacement");
				if (authoredTextPlacement && authoredTextPlacement !== "none" && authoredTextPlacement !== "blocks" && authoredTextPlacement !== "outside-blocks") throw new Error("Slack authoredTextPlacement is invalid.");
				const nativeDataFallbackBaseText = readStringParam(params, "nativeDataFallbackBaseText", { allowEmpty: true });
				if (!content && !mediaUrl && !blocks && !preparedMessages?.length) throw new Error("Slack sendMessage requires content, blocks, or mediaUrl.");
				if (replyBroadcast && mediaUrl) throw new Error("Slack replyBroadcast is only supported for text or block thread replies.");
				const threadTs = resolveThreadTsFromContext(readStringParam(params, "threadTs"), destination, context, { suppressImplicitThread: params.topLevel === true || params.threadTs === null });
				const baseSendOpts = {
					...buildActionOpts("write"),
					mediaAccess: context?.mediaAccess,
					mediaLocalRoots: context?.mediaLocalRoots,
					mediaReadFile: context?.mediaReadFile,
					threadTs: threadTs ?? void 0,
					...forceDocument ? { forceDocument: true } : {}
				};
				const sendOpts = {
					...baseSendOpts,
					...replyBroadcast ? { replyBroadcast } : {},
					...textIsSlackMrkdwn ? { textIsSlackMrkdwn: true } : {},
					...textIsSlackPlainText ? { textIsSlackPlainText: true } : {},
					...authoredTextPlacement ? { authoredTextPlacement } : {},
					...nativeDataFallbackBaseText !== void 0 ? { nativeDataFallbackBaseText } : {}
				};
				const sendContentAndBlocks = async () => {
					const shouldSplitLongContent = content && content.length > 8e3 && !hasSlackNativeDataBlock(blocks);
					if (content && shouldSplitLongContent) {
						const { replyBroadcast: _replyBroadcast, ...blockSendOpts } = sendOpts;
						await sendSlackMessage(destination, "", {
							...blockSendOpts,
							blocks
						});
						return await sendSlackMessage(destination, content, sendOpts);
					}
					return await sendSlackMessage(destination, content ?? "", {
						...sendOpts,
						blocks
					});
				};
				if (mediaUrl && (preparedMessages?.length || blocks)) await sendSlackMessage(destination, "", {
					...preparedMessages?.length ? baseSendOpts : sendOpts,
					mediaUrl
				});
				if (preparedMessages?.length) for (const [index, message] of preparedMessages.entries()) await sendSlackMessage(destination, message.text, {
					...baseSendOpts,
					...index === 0 && replyBroadcast ? { replyBroadcast: true } : {},
					...message.blocks ? { blocks: message.blocks } : {},
					...message.authoredTextPlacement ? { authoredTextPlacement: message.authoredTextPlacement } : {},
					...Object.hasOwn(message, "nativeDataFallbackBaseText") ? { nativeDataFallbackBaseText: message.nativeDataFallbackBaseText } : {},
					...message.textIsSlackPlainText ? { textIsSlackPlainText: true } : {}
				});
				else if (blocks) await sendContentAndBlocks();
				else await sendSlackMessage(destination, content ?? "", {
					...sendOpts,
					mediaUrl: mediaUrl ?? void 0,
					blocks
				});
				return jsonResult({
					ok: true,
					result: mergeSlackSendResults(sentResults)
				});
			}
			case "uploadFile": {
				const destination = resolveSlackActionTarget(account, readStringParam(params, "to", { required: true }), context).routingTarget;
				const filePath = readStringParam(params, "filePath", {
					required: true,
					trim: false
				});
				const initialComment = readStringParam(params, "initialComment", { allowEmpty: true });
				const filename = readStringParam(params, "filename");
				const title = readStringParam(params, "title");
				const forceDocument = readBooleanParam(params, "forceDocument") === true;
				if (readBooleanParam(params, "replyBroadcast")) throw new Error("Slack replyBroadcast is only supported for text or block thread replies.");
				const threadTs = resolveThreadTsFromContext(readStringParam(params, "threadTs"), destination, context, { suppressImplicitThread: params.topLevel === true || params.threadTs === null });
				const result = await sendSlackMessage(destination, initialComment ?? "", {
					...buildActionOpts("write"),
					mediaUrl: filePath,
					mediaAccess: context?.mediaAccess,
					mediaLocalRoots: context?.mediaLocalRoots,
					mediaReadFile: context?.mediaReadFile,
					threadTs: threadTs ?? void 0,
					...forceDocument ? { forceDocument: true } : {},
					...filename ? { uploadFileName: filename } : {},
					...title ? { uploadTitle: title } : {}
				});
				return jsonResult({
					ok: true,
					result
				});
			}
			case "editMessage": {
				const target = resolveChannelTarget();
				const { channelId } = target;
				const messageId = readStringParam(params, "messageId", { required: true });
				const content = readStringParam(params, "content", { allowEmpty: true });
				const blocks = readSlackBlocksParam(params);
				if (!content && !blocks) throw new Error("Slack editMessage requires content or blocks.");
				await assertReadTargetAllowed(target);
				const writeOpts = buildActionOpts("write", target.teamId);
				await slackActionRuntime.editSlackMessage(channelId, messageId, content ?? "", {
					...writeOpts,
					blocks
				});
				return jsonResult({ ok: true });
			}
			case "deleteMessage": {
				const target = resolveChannelTarget();
				const { channelId } = target;
				const messageId = readStringParam(params, "messageId", { required: true });
				await assertReadTargetAllowed(target);
				const writeOpts = buildActionOpts("write", target.teamId);
				await slackActionRuntime.deleteSlackMessage(channelId, messageId, writeOpts);
				return jsonResult({ ok: true });
			}
			case "readMessages": {
				const target = resolveChannelTarget();
				const { channelId } = target;
				await assertReadTargetAllowed(target);
				const readOpts = buildActionOpts("read", target.teamId);
				const limit = readPositiveIntegerParam(params, "limit", { message: "limit must be a positive integer." });
				const before = readStringParam(params, "before");
				const after = readStringParam(params, "after");
				const threadId = readStringParam(params, "threadId");
				const messageId = readStringParam(params, "messageId");
				const result = await slackActionRuntime.readSlackMessages(channelId, {
					...readOpts,
					limit,
					before: before ?? void 0,
					after: after ?? void 0,
					threadId: threadId ?? void 0,
					messageId: messageId ?? void 0
				});
				const messages = result.messages.map((message) => withNormalizedTimestamp(message, message.ts));
				return jsonResult({
					ok: true,
					channelId,
					...threadId ? { threadId } : {},
					messages,
					hasMore: result.hasMore
				});
			}
			case "downloadFile": {
				const fileId = readStringParam(params, "fileId", { required: true });
				const channelTarget = readStringParam(params, "channelId") ?? readStringParam(params, "to") ?? context?.currentChannelId;
				if (!channelTarget) throw new Error("Slack file download requires channelId or to so the read target can be authorized.");
				const target = resolveSlackActionChannelTarget(account, channelTarget, context);
				const { channelId } = target;
				await assertReadTargetAllowed(target);
				const threadId = readStringParam(params, "threadId") ?? readStringParam(params, "replyTo");
				const maxBytes = account.config?.mediaMaxMb ? account.config.mediaMaxMb * 1024 * 1024 : 20971520;
				const readToken = resolveSlackOperationToken(account, "read");
				const readOpts = buildActionOpts("read", target.teamId);
				const downloaded = await slackActionRuntime.downloadSlackFile(fileId, {
					...readOpts,
					...readToken && !readOpts.token ? { token: readToken } : {},
					maxBytes,
					channelId,
					threadId: threadId ?? void 0
				});
				if (!downloaded) return jsonResult({
					ok: false,
					error: "File could not be downloaded. Confirm the fileId came from the requested Slack channel or explicit thread and that the file is accessible and within the size limit."
				});
				if (!isImageContentType(downloaded.contentType)) return jsonResult({
					ok: true,
					fileId,
					path: downloaded.path,
					contentType: downloaded.contentType,
					placeholder: downloaded.placeholder,
					media: {
						mediaUrl: downloaded.path,
						outbound: false,
						...downloaded.contentType ? { contentType: downloaded.contentType } : {}
					}
				});
				return await imageResultFromFile({
					label: "slack-file",
					path: downloaded.path,
					extraText: downloaded.placeholder,
					details: {
						fileId,
						path: downloaded.path,
						...downloaded.contentType ? { contentType: downloaded.contentType } : {},
						media: { outbound: false }
					},
					imageSanitization: { maxDimensionPx: cfg.agents?.defaults?.imageMaxDimensionPx }
				});
			}
		}
	}
	if (pinActions.has(action)) {
		if (!isActionEnabled("pins")) throw new Error("Slack pins are disabled.");
		const target = resolveChannelTarget();
		const { channelId } = target;
		const readOpts = buildActionOpts("read", target.teamId);
		const writeOpts = buildActionOpts("write", target.teamId);
		if (action === "pinMessage") {
			const messageId = readStringParam(params, "messageId", { required: true });
			await assertReadTargetAllowed(target);
			await slackActionRuntime.pinSlackMessage(channelId, messageId, writeOpts);
			return jsonResult({ ok: true });
		}
		if (action === "unpinMessage") {
			const messageId = readStringParam(params, "messageId", { required: true });
			await assertReadTargetAllowed(target);
			await slackActionRuntime.unpinSlackMessage(channelId, messageId, writeOpts);
			return jsonResult({ ok: true });
		}
		await assertReadTargetAllowed(target);
		const normalizedPins = (await slackActionRuntime.listSlackPins(channelId, readOpts)).map((pin) => {
			const message = pin.message ? withNormalizedTimestamp(pin.message, pin.message.ts) : pin.message;
			return message ? Object.assign({}, pin, { message }) : pin;
		});
		return jsonResult({
			ok: true,
			pins: normalizedPins
		});
	}
	if (action === "memberInfo") {
		if (!isActionEnabled("memberInfo")) throw new Error("Slack member info is disabled.");
		const userId = readStringParam(params, "userId", { required: true });
		assertSlackMemberInfoAllowed({
			account,
			context,
			userId
		});
		const teamId = resolveTrustedCurrentSlackTeamId({
			account,
			context
		});
		assertSlackDetachedTargetAllowed(account.accountId, teamId);
		const info = await slackActionRuntime.getSlackMemberInfo(userId, buildActionOpts("read", teamId));
		return jsonResult({
			ok: true,
			info
		});
	}
	if (action === "emojiList") {
		if (!isActionEnabled("emojiList")) throw new Error("Slack emoji list is disabled.");
		const limit = Math.min(readPositiveIntegerParam(params, "limit", { message: "limit must be a positive integer." }) ?? SLACK_REACTION_RESULT_LIMIT, SLACK_REACTION_RESULT_LIMIT);
		const teamId = resolveTrustedCurrentSlackTeamId({
			account,
			context
		});
		assertSlackDetachedTargetAllowed(account.accountId, teamId);
		const result = await slackActionRuntime.listSlackEmojis(buildActionOpts("read", teamId));
		const emojis = Object.entries(result.emoji ?? {}).toSorted(([left], [right]) => left.localeCompare(right)).slice(0, limit).map(([name, value]) => value.startsWith("alias:") ? {
			name,
			identifier: name,
			aliasOf: value.slice(6)
		} : {
			name,
			identifier: name
		});
		return jsonResult({
			ok: true,
			emojis
		});
	}
	throw new Error(`Unknown action: ${action}`);
}
//#endregion
export { slackActionRuntime as n, handleSlackAction as t };
