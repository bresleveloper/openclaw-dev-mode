import { l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
import { o as asDateTimestampMs } from "./number-coercion-CkhMiRw8.mjs";
import { c as isVitestRuntimeEnv } from "./env-DbG527wb.mjs";
import { s as ModelSelectionLockedError } from "./openclaw-state-worker-error-B93Lf_P2.mjs";
import { t as createLazyImportLoader } from "./lazy-promise-DGqyc4Y4.mjs";
import { c as resolveSessionStorePathCore } from "./paths-YgcBNLgG.mjs";
import { t as normalizeChatType } from "./chat-type-qwvaeaJu.mjs";
import "./message-channel-constants-B3vfipkP.mjs";
import { t as applyMergePatch } from "./merge-patch-D-eANYlX.mjs";
import "./message-channel-DmAdWHmL.mjs";
import { t as resolveGroupSessionKey } from "./group-qLatmSbQ.mjs";
import { nt as buildMainSessionRecoveryClearPatch } from "./session-actor-memory-owner-BSARM2d5.mjs";
import { r as isRestartRecoveryTombstone } from "./session-work-start-Sz_vqYld.mjs";
import { c as normalizeDeliveryContext, o as mergeDeliveryContext } from "./delivery-context.shared-I8-iaaj1.mjs";
import { t as conversationRouteContextFromMsgContext } from "./conversation-route-context-ulGSQNwr.mjs";
import { t as buildConversationIdentity } from "./conversation-identity-BApT92qN.mjs";
import { l as buildSessionCreationStamp, o as sessionEntryForkedFromParent } from "./session-entry-lineage-B7Mubzwj.mjs";
import { r as SessionRestartRecoveryTombstoneError } from "./work-start-error-BI-UhSB2.mjs";
import { t as DEFAULT_RESET_TRIGGERS } from "./types-BGDhC4_W.mjs";
import { a as isModelSelectionLocked, n as MODEL_SELECTION_LOCKED_RESET_MESSAGE } from "./model-overrides-CgHG3YVT.mjs";
import { o as hasStagedMediaFacts } from "./media-facts-BIPREXi-.mjs";
import "./history-C_lABG5e.mjs";
import "./session-accessor-Czw4l8kI.mjs";
import { t as normalizeInternalTurnContext } from "./internal-turn-source-sDcJfRAw.mjs";
import { t as resolveConversationLabel } from "./conversation-label-DSOtC5aa.mjs";
import { x as deriveSessionOrigin } from "./session-accessor.sqlite-entry-wJ2W65pX.mjs";
import { r as loadReplySessionInitializationSnapshot } from "./session-accessor.reset-D4vtFriK.mjs";
import "./lifecycle-CKc8qk3B.mjs";
import { n as resolveSessionKey } from "./session-key-Sn5H-nwW.mjs";
import { r as resolveSessionParentSessionKey } from "./session-conversation-DnUQmZJM.mjs";
import { n as isResetAuthorizedForContext } from "./command-auth-D8Y1MxJm.mjs";
import { n as hasInboundMedia } from "./inbound-media-D9dVgt41.mjs";
import { l as resolveCommandTurnTargetSessionKey } from "./command-turn-context-TJGbDzsZ.mjs";
import { n as normalizeCommandBody } from "./commands-registry-normalize-BI2t-DKf.mjs";
import "./commands-registry-CFDGAPH8.mjs";
import { a as stripMentions } from "./mentions-FwOIMA6L.mjs";
import { i as resolveParentForkDecision, n as forkSessionFromParent } from "./session-fork-CE3rQ2_3.mjs";
import { t as parseSoftResetCommand } from "./commands-reset-mode-BN9nm3QC.mjs";
import { r as isFormattedGoalContinuationPrompt } from "./commands-goal-NlIxYYQu.mjs";
import { t as resolveResetPreservedSelection } from "./reset-preserved-selection-BUsSR2xu.mjs";
import { n as createReplySessionEntryHandle } from "./session-entry-handle-CIZ4BgVt.mjs";
import crypto from "node:crypto";
import { AsyncLocalStorage } from "node:async_hooks";
//#region src/auto-reply/reply/session-parent-fork-prepare.ts
function canReplaceRestartTombstoneFromParent(params) {
	return params.hasParentForkSource && isRestartRecoveryTombstone(params.entry) && !isModelSelectionLocked(params.entry) && !sessionEntryForkedFromParent(params.entry) && params.hasPluginOwnedBinding !== true && params.entry?.pluginOwnerId === void 0 && params.inboundAccessAuthorized === true && params.inboundEventKind !== "room_event" && params.actorType === "human" && (params.nativeCommandTarget === void 0 || params.nativeCommandTarget === params.sessionKey);
}
async function prepareReplySessionParentFork(params) {
	if (!params.parentSessionKey || params.parentSessionKey === params.sessionKey || params.alreadyForked) return params.sessionEntry;
	const unresolvedParentFork = () => {
		if (params.requireParentForkReplacement === true) throw new SessionRestartRecoveryTombstoneError(`Session "${params.sessionKey}" ended during restart recovery. Use /new or /reset to start a replacement session.`);
		return params.sessionEntry;
	};
	const parentEntry = params.readEntry(params.parentSessionKey);
	if (!parentEntry?.sessionId) return unresolvedParentFork();
	const forkParams = {
		parentSessionKey: params.parentSessionKey,
		parentEntry,
		agentId: params.agentId,
		sessionKey: params.sessionKey,
		storePath: params.storePath
	};
	const decision = await resolveParentForkDecision(forkParams);
	if (decision.status === "skip") {
		params.warn(`skipping parent fork (parent too large): parentKey=${params.parentSessionKey} → sessionKey=${params.sessionKey} parentTokens=${decision.parentTokens} maxTokens=${decision.maxTokens}`);
		return {
			...params.sessionEntry,
			forkedFromParent: true
		};
	}
	const fork = await forkSessionFromParent(forkParams);
	if (!fork) return unresolvedParentFork();
	params.warn(`forking from parent session: parentKey=${params.parentSessionKey} → sessionKey=${params.sessionKey} parentTokens=${decision.parentTokens ?? "unknown"}`);
	return {
		...params.sessionEntry,
		...buildMainSessionRecoveryClearPatch(params.sessionEntry),
		sessionId: fork.sessionId,
		nativeRuntimeConsent: void 0,
		lifecycleRunId: void 0,
		lastRunId: void 0,
		forkSource: {
			sessionKey: params.parentSessionKey,
			sessionId: parentEntry.sessionId
		},
		forkedFromParent: true,
		totalTokens: void 0,
		totalTokensFresh: false,
		totalTokensVersion: void 0
	};
}
//#endregion
//#region src/auto-reply/reply/session-reset-command.ts
function skipWhitespace(source, start, whitespace = /\s/) {
	let cursor = start;
	while (whitespace.test(source[cursor] ?? "")) cursor += 1;
	return cursor;
}
function startsWithHistoryMarker(source, start) {
	return source.startsWith("[Chat messages since your last reply - for context]", start) || source.startsWith("[Recent chat messages - for context]", start) || source.startsWith("[Current message - respond to this]", start);
}
function matchesKnownSenderPrefix(prefix, ctx) {
	const normalizedPrefix = normalizeLowercaseStringOrEmpty(prefix);
	if (!normalizedPrefix) return false;
	const senderUsername = ctx.SenderUsername?.trim().replace(/^@/, "");
	return [
		ctx.SenderName,
		ctx.SenderTag,
		senderUsername,
		senderUsername ? `@${senderUsername}` : void 0,
		ctx.SenderName && senderUsername ? `${ctx.SenderName} (@${senderUsername})` : void 0
	].some((candidate) => normalizeLowercaseStringOrEmpty(candidate) === normalizedPrefix);
}
function resolveExplicitMessageStart(source, ctx) {
	let cursor = skipWhitespace(source, 0);
	if (startsWithHistoryMarker(source, cursor)) return;
	while (source[cursor] === "[") {
		const lineEnd = source.indexOf("\n", cursor);
		const envelopeEnd = source.indexOf("]", cursor + 1);
		if (envelopeEnd === -1 || lineEnd !== -1 && envelopeEnd > lineEnd) break;
		if (startsWithHistoryMarker(source, cursor)) return;
		cursor = skipWhitespace(source, envelopeEnd + 1, /[ \t]/);
	}
	const lineEnd = source.indexOf("\n", cursor);
	const effectiveLineEnd = lineEnd === -1 ? source.length : lineEnd;
	const senderPrefixEnd = source.indexOf(":", cursor);
	if (senderPrefixEnd !== -1 && senderPrefixEnd < effectiveLineEnd) {
		const senderPrefix = source.slice(cursor, senderPrefixEnd).trim();
		if (senderPrefix && senderPrefix.length <= 120 && matchesKnownSenderPrefix(senderPrefix, ctx)) cursor = skipWhitespace(source, senderPrefixEnd + 1, /[ \t]/);
	}
	return cursor;
}
function stripLeadingMention(params) {
	const triggerLower = normalizeLowercaseStringOrEmpty(params.trigger);
	const matchesTriggerAt = (index) => normalizeLowercaseStringOrEmpty(params.source.slice(index, index + params.trigger.length)) === triggerLower;
	if (matchesTriggerAt(params.start)) return params.start;
	if (!params.isGroup) return;
	let triggerStart = -1;
	for (let index = params.start; index < params.source.length; index += 1) if (matchesTriggerAt(index)) {
		triggerStart = index;
		break;
	}
	if (triggerStart === -1) return;
	const prefix = params.source.slice(params.start, triggerStart);
	if (prefix.includes("\n")) return;
	if (!stripMentions(prefix, params.ctx, params.cfg, params.agentId).trim()) return triggerStart;
	return params.ctx.WasMentioned === true && params.source.slice(triggerStart).trimEnd() === params.commandText.trim() ? triggerStart : void 0;
}
function isRecognizedCommandSuffix(params) {
	const botUsername = params.ctx.BotUsername?.trim().replace(/^@/, "");
	if (botUsername && normalizeLowercaseStringOrEmpty(params.suffix) === normalizeLowercaseStringOrEmpty(botUsername)) return true;
	if (!params.isGroup) return false;
	return !stripMentions(`@${params.suffix}`, params.ctx, params.cfg, params.agentId).trim();
}
function resolveAnchoredResetPayload(params) {
	const messageStart = resolveExplicitMessageStart(params.source, params.ctx);
	if (messageStart === void 0) return;
	const triggerStart = stripLeadingMention({
		...params,
		start: messageStart
	});
	if (triggerStart === void 0) return;
	let payloadStart = triggerStart + params.trigger.length;
	if (params.source[payloadStart] === "@") {
		const suffixStart = payloadStart + 1;
		payloadStart = suffixStart;
		while (/[^:\s]/.test(params.source[payloadStart] ?? "")) payloadStart += 1;
		const suffix = params.source.slice(suffixStart, payloadStart);
		if (!suffix || !isRecognizedCommandSuffix({
			...params,
			suffix
		})) return;
	}
	const delimiter = params.source[payloadStart];
	if (delimiter === void 0) return "";
	if (delimiter === ":") payloadStart += 1;
	else if (!/\s/.test(delimiter)) return;
	return params.source.slice(payloadStart).trimStart();
}
function resolveCommandTextForSession(params) {
	const messageStart = resolveExplicitMessageStart(params.commandText, params.ctx);
	const anchored = messageStart === void 0 ? params.commandText.trim() : params.commandText.slice(messageStart);
	return (params.isGroup ? stripMentions(anchored, params.ctx, params.cfg, params.agentId) : anchored).replace(/\\n/g, " ").trim();
}
function resolveSessionResetCommand(params) {
	const triggerBodyNormalized = resolveCommandTextForSession(params);
	const normalizedResetBody = normalizeCommandBody(triggerBodyNormalized, { botUsername: params.ctx.BotUsername });
	const softResetMatched = parseSoftResetCommand(normalizedResetBody).matched;
	const result = {
		softResetMatched,
		triggerBodyNormalized
	};
	if (!params.resetAuthorized || softResetMatched || typeof params.ctx.Transcript === "string" && params.commandText === params.ctx.Transcript.replace(/\\n/g, " ").trim()) return result;
	const normalizedResetBodyLower = normalizeLowercaseStringOrEmpty(normalizedResetBody);
	for (const trigger of params.resetTriggers) {
		const triggerLower = normalizeLowercaseStringOrEmpty(trigger);
		if (!triggerLower || ![triggerLower, normalizeLowercaseStringOrEmpty(normalizeCommandBody(trigger))].some((candidate) => normalizedResetBodyLower === candidate || normalizedResetBodyLower.startsWith(candidate) && /\s/.test(normalizedResetBodyLower.charAt(candidate.length)))) continue;
		const payload = resolveAnchoredResetPayload({
			...params,
			source: params.rawText,
			trigger
		});
		if (payload === void 0) continue;
		return {
			...result,
			matchedResetTriggerLower: triggerLower,
			payload
		};
	}
	return result;
}
async function resolveAuthorizedSessionResetCommand(params) {
	const resetAuthorized = await isResetAuthorizedForContext(params);
	return {
		resetAuthorized,
		resetCommand: resolveSessionResetCommand({
			...params,
			commandText: params.ctx.commandText ?? "",
			rawText: params.ctx.rawText ?? "",
			resetTriggers: params.cfg.session?.resetTriggers?.length ? params.cfg.session.resetTriggers : DEFAULT_RESET_TRIGGERS,
			resetAuthorized
		})
	};
}
//#endregion
//#region src/auto-reply/reply/prepared-reply-dispatch-context.ts
const preparedReplyDispatchRuntime = new AsyncLocalStorage();
/** Keeps the configured Gateway generation request-scoped without widening the public resolver. */
function bindPreparedReplyDispatchRuntime(runtime, run) {
	return (...args) => preparedReplyDispatchRuntime.run(runtime, () => run(...args));
}
function getPreparedReplyDispatchRuntime() {
	return preparedReplyDispatchRuntime.getStore();
}
//#endregion
//#region src/auto-reply/reply/stage-remote-inbound-media.ts
/** Shared guard for staging remote inbound media into the local cache. */
const stageSandboxMediaRuntimeLoader = createLazyImportLoader(() => import("./stage-sandbox-media-BIicrPLU.mjs"));
/**
* Stage remote (SCP) inbound media before downstream consumers read the media
* facts into the local cache. Staged facts carry their workspace so later
* staging sites preserve the single-stage contract. Both the dispatch plugin-claim path and get-reply's
* media-understanding path rely on this rewrite to expose the local cache path
* instead of the unreachable remote host path; returns whether staging ran.
*/
async function stageRemoteInboundMediaIfNeeded(params) {
	if (!params.sessionKey || hasStagedMediaFacts(params.ctx.media) || !normalizeOptionalString(params.ctx.MediaRemoteHost) || !hasInboundMedia(params.ctx)) return false;
	const { stageSandboxMedia } = await stageSandboxMediaRuntimeLoader.load();
	return (await stageSandboxMedia({
		...params,
		sessionCtx: params.ctx
	})).staged.size > 0;
}
//#endregion
//#region src/config/sessions/conversation-identity-inbound.ts
/** Derives the same stable address from live inbound channel facts. */
function conversationIdentityFromMsgContext(params) {
	normalizeInternalTurnContext(params.ctx);
	const route = deriveSessionOrigin(params.ctx);
	const explicitDeliveryContext = normalizeDeliveryContext(params.deliveryContext);
	const deliveryContext = mergeDeliveryContext(explicitDeliveryContext, {
		channel: route?.provider,
		to: route?.to,
		accountId: route?.accountId,
		threadId: route?.threadId
	});
	const pairedDeliveryContext = explicitDeliveryContext ?? (params.ctx.InternalTurnSource && params.ctx.OriginatingChannel && params.ctx.OriginatingTo ? deliveryContext : void 0);
	const groupResolution = params.groupResolution ?? resolveGroupSessionKey(params.ctx);
	const routeContext = conversationRouteContextFromMsgContext(params.ctx);
	const kind = groupResolution?.chatType ?? normalizeChatType(typeof params.ctx.ChatType === "string" ? params.ctx.ChatType : void 0) ?? "direct";
	const directIngressTarget = kind === "direct" ? normalizeOptionalString(params.ctx.From) : void 0;
	const useDirectIngressTarget = Boolean(directIngressTarget && !pairedDeliveryContext?.to);
	const deliveryTarget = useDirectIngressTarget ? directIngressTarget : normalizeOptionalString(deliveryContext?.to) ?? normalizeOptionalString(params.ctx.OriginatingTo) ?? normalizeOptionalString(params.ctx.To);
	const channel = useDirectIngressTarget ? normalizeOptionalString(route?.provider) ?? normalizeOptionalString(params.ctx.OriginatingChannel) ?? normalizeOptionalString(params.ctx.Provider) : deliveryContext?.channel ?? groupResolution?.channel ?? normalizeOptionalString(route?.provider) ?? normalizeOptionalString(params.ctx.OriginatingChannel) ?? normalizeOptionalString(params.ctx.Provider);
	return buildConversationIdentity({
		channel,
		accountId: useDirectIngressTarget ? route?.accountId ?? params.ctx.AccountId : deliveryContext?.accountId ?? route?.accountId ?? params.ctx.AccountId,
		kind,
		peerId: routeContext?.peerId ?? deliveryTarget,
		deliveryTarget,
		threadId: useDirectIngressTarget ? route?.threadId ?? params.ctx.MessageThreadId : deliveryContext?.threadId ?? params.ctx.MessageThreadId,
		nativeChannelId: params.ctx.NativeChannelId ?? route?.nativeChannelId,
		nativeDirectUserId: params.ctx.NativeDirectUserId ?? route?.nativeDirectUserId,
		label: normalizeOptionalString(resolveConversationLabel(params.ctx)) ?? route?.label
	});
}
//#endregion
//#region src/auto-reply/reply/message-timestamp.ts
const EPOCH_MILLISECONDS_THRESHOLD = 0xe8d4a51000;
function normalizeMessageTimestampMs(value) {
	if (typeof value !== "number" || !Number.isFinite(value) || value <= 0) return;
	return asDateTimestampMs(value < EPOCH_MILLISECONDS_THRESHOLD ? Math.trunc(value * 1e3) : value);
}
//#endregion
//#region src/auto-reply/reply/get-reply-conversation-type.ts
function resolveReplyPolicyConversationType(ctx, inboundSessionKey) {
	const sourceSessionKey = inboundSessionKey ?? ctx.SessionKey;
	const targetSessionKey = resolveCommandTurnTargetSessionKey(ctx);
	if (targetSessionKey && targetSessionKey !== sourceSessionKey) return;
	const chatType = normalizeChatType(ctx.ChatType);
	return chatType === "channel" ? "group" : chatType;
}
//#endregion
//#region src/auto-reply/reply/reply-config-runtime-mode.ts
const replyConfigRuntimeModes = /* @__PURE__ */ new WeakMap();
function markReplyConfigRuntimeMode(config, runtimeMode) {
	replyConfigRuntimeModes.set(config, runtimeMode);
	return config;
}
function isCompleteReplyConfig(config) {
	return Boolean(config && typeof config === "object" && replyConfigRuntimeModes.has(config));
}
function usesFullReplyRuntime(config) {
	if (!config || typeof config !== "object") return false;
	return replyConfigRuntimeModes.get(config) === "full";
}
//#endregion
//#region src/auto-reply/reply/get-reply-fast-path.ts
function isSlowReplyTestAllowed(env = process.env) {
	return isVitestRuntimeEnv(env) && env.OPENCLAW_ALLOW_SLOW_REPLY_TESTS === "1" || env.OPENCLAW_STRICT_FAST_REPLY_CONFIG === "0";
}
function withFullRuntimeReplyConfig(config) {
	return markReplyConfigRuntimeMode(config, "full");
}
function resolveGetReplyConfig(params) {
	const { configOverride } = params;
	if (configOverride == null) return params.getRuntimeConfig();
	if (isCompleteReplyConfig(configOverride)) return configOverride;
	if (params.isFastTestEnv && !isSlowReplyTestAllowed()) throw new Error("Fast reply tests must pass with withFastReplyConfig()/markCompleteReplyConfig(); set OPENCLAW_ALLOW_SLOW_REPLY_TESTS=1 to opt out.");
	return applyMergePatch(params.getRuntimeConfig(), configOverride);
}
function shouldUseReplyFastTestRuntime(params) {
	return params.isFastTestEnv && isCompleteReplyConfig(params.cfg) && !usesFullReplyRuntime(params.cfg);
}
async function initFastReplySessionState(params) {
	const { ctx, cfg, agentId, commandAuthorized } = params;
	const sessionScope = cfg.session?.scope ?? "per-sender";
	const sessionKey = resolveCommandTurnTargetSessionKey(ctx) || resolveSessionKey(sessionScope, ctx, cfg.session?.mainKey, agentId);
	const storePath = resolveSessionStorePathCore(cfg.session?.store, { agentId });
	const relatedSessionKeys = [
		ctx.ParentSessionKey,
		ctx.ModelParentSessionKey,
		ctx.CommandTargetSessionKey,
		resolveSessionParentSessionKey(sessionKey)
	].filter((key) => typeof key === "string");
	const snapshot = await loadReplySessionInitializationSnapshot({
		agentId,
		storePath,
		sessionKey,
		relatedSessionKeys
	});
	const existingEntry = snapshot.currentEntry;
	const sessionStore = {};
	for (const key of [...relatedSessionKeys, existingEntry?.parentSessionKey]) {
		const entry = key ? snapshot.readEntry(key) : void 0;
		if (key && entry) sessionStore[key] = entry;
	}
	const commandSource = ctx.commandText;
	const normalizedChatType = normalizeChatType(ctx.ChatType);
	const isGroup = normalizedChatType != null && normalizedChatType !== "direct";
	const resetCommand = resolveSessionResetCommand({
		commandText: commandSource,
		rawText: ctx.rawText,
		resetTriggers: cfg.session?.resetTriggers?.length ? cfg.session.resetTriggers : DEFAULT_RESET_TRIGGERS,
		ctx,
		cfg,
		agentId,
		isGroup,
		resetAuthorized: commandAuthorized
	});
	const triggerBodyNormalized = isFormattedGoalContinuationPrompt(commandSource) ? commandSource.trim() : resetCommand.triggerBodyNormalized;
	const resetTriggered = resetCommand.matchedResetTriggerLower !== void 0;
	if (resetTriggered && isModelSelectionLocked(existingEntry)) throw new ModelSelectionLockedError(MODEL_SELECTION_LOCKED_RESET_MESSAGE);
	const previousSessionEntry = resetTriggered && existingEntry ? { ...existingEntry } : void 0;
	const sessionId = !resetTriggered && existingEntry ? existingEntry.sessionId : crypto.randomUUID();
	const bodyStripped = resetTriggered ? resetCommand.payload ?? "" : ctx.agentText;
	const now = Date.now();
	const resetPreservedSelection = resetTriggered ? resolveResetPreservedSelection({ entry: existingEntry }) : {};
	const channel = normalizeOptionalString(ctx.Provider);
	const subject = normalizeOptionalString(ctx.GroupSubject);
	const groupChannel = normalizeOptionalString(ctx.GroupChannel);
	const sessionEntry = {
		...!resetTriggered ? existingEntry : void 0,
		sessionId,
		...!existingEntry && ctx.SessionCreation ? buildSessionCreationStamp(ctx.SessionCreation) : {},
		...resetTriggered && existingEntry ? {
			previousSessionId: existingEntry.sessionId,
			spawnedBy: existingEntry.spawnedBy,
			spawnedBySenderIsOwner: existingEntry.spawnedBySenderIsOwner,
			spawnedBySessionId: existingEntry.spawnedBySessionId,
			spawnedWorkspaceDir: existingEntry.spawnedWorkspaceDir,
			spawnedCwd: existingEntry.spawnedCwd,
			parentSessionKey: existingEntry.parentSessionKey,
			parentSessionId: existingEntry.parentSessionId,
			parentSessionLifecycleRevision: existingEntry.parentSessionLifecycleRevision,
			forkedFromParent: existingEntry.forkedFromParent,
			forkSource: existingEntry.forkSource,
			createdVia: existingEntry.createdVia,
			createdActor: existingEntry.createdActor,
			createdAt: existingEntry.createdAt,
			...existingEntry.sandbox === "required" ? { sandbox: "required" } : {},
			spawnDepth: existingEntry.spawnDepth,
			subagentRole: existingEntry.subagentRole,
			subagentControlScope: existingEntry.subagentControlScope
		} : {},
		...resetPreservedSelection,
		updatedAt: now,
		sessionStartedAt: resetTriggered ? now : existingEntry?.sessionStartedAt ?? now,
		lastInteractionAt: now,
		agentStatus: void 0,
		thinkingLevel: existingEntry?.thinkingLevel,
		verboseLevel: existingEntry?.verboseLevel,
		reasoningLevel: existingEntry?.reasoningLevel,
		ttsAuto: existingEntry?.ttsAuto,
		responseUsage: existingEntry?.responseUsage,
		...normalizedChatType ? { chatType: normalizedChatType } : {},
		...channel ? { channel } : {},
		...subject ? { subject } : {},
		...groupChannel ? { groupChannel } : {},
		topicName: normalizeOptionalString(ctx.TopicName) ?? existingEntry?.topicName
	};
	sessionStore[sessionKey] = sessionEntry;
	const sessionEntryHandle = createReplySessionEntryHandle({
		sessionEntry,
		sessionKey,
		sessionStore
	});
	return {
		sessionCtx: {
			...ctx,
			commandText: ctx.commandText,
			agentText: bodyStripped,
			rawText: ctx.rawText,
			SessionKey: sessionKey,
			CommandAuthorized: commandAuthorized,
			BodyStripped: bodyStripped,
			...normalizedChatType ? { ChatType: normalizedChatType } : {}
		},
		sessionEntry,
		initialSessionEntry: existingEntry ? { ...existingEntry } : void 0,
		sessionEntryHandle,
		sessionStore,
		sessionKey,
		sessionId,
		isNewSession: resetTriggered || !existingEntry,
		resetTriggered,
		systemSent: false,
		abortedLastRun: false,
		storePath,
		sessionScope,
		groupResolution: void 0,
		isGroup,
		bodyStripped,
		triggerBodyNormalized,
		previousSessionEntry
	};
}
//#endregion
//#region src/auto-reply/reply/typing-policy.ts
/** Resolves typing policy and suppresses typing for non-user-visible turns. */
function resolveRunTypingPolicy(params) {
	const typingPolicy = params.isHeartbeat ? "heartbeat" : params.originatingChannel === "webchat" ? "internal_webchat" : params.systemEvent ? "system_event" : params.requestedPolicy ?? "auto";
	return {
		typingPolicy,
		suppressTyping: params.suppressTyping === true || typingPolicy === "heartbeat" || typingPolicy === "system_event" || typingPolicy === "internal_webchat"
	};
}
//#endregion
export { withFullRuntimeReplyConfig as a, conversationIdentityFromMsgContext as c, getPreparedReplyDispatchRuntime as d, resolveAuthorizedSessionResetCommand as f, shouldUseReplyFastTestRuntime as i, stageRemoteInboundMediaIfNeeded as l, prepareReplySessionParentFork as m, initFastReplySessionState as n, resolveReplyPolicyConversationType as o, canReplaceRestartTombstoneFromParent as p, resolveGetReplyConfig as r, normalizeMessageTimestampMs as s, resolveRunTypingPolicy as t, bindPreparedReplyDispatchRuntime as u };
