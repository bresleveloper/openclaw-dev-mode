import { l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.mjs";
import { t as createLazyImportLoader } from "./lazy-promise-DGqyc4Y4.mjs";
import { n as isVitestRuntimeEnv } from "./test-runtime-env-mVzBKwSd.mjs";
import "./env-C4a8LL2I.mjs";
import { l as resolveSessionStorePathCore } from "./paths-CcMbq5NY.mjs";
import { t as applyMergePatch } from "./merge-patch-C1--BlNd.mjs";
import "./message-channel-constants-Cd7Eq8Zi.mjs";
import "./message-channel-DDcHHhpX.mjs";
import { t as normalizeChatType } from "./chat-type-Dbv0JQHI.mjs";
import { n as isResetAuthorizedForContext } from "./command-auth-2PSSAYYJ.mjs";
import { a as hasStagedMediaFacts } from "./media-facts-BEHTU0wM.mjs";
import { n as buildSessionCreationStamp } from "./session-entry-provenance-C-JyMH54.mjs";
import { t as DEFAULT_RESET_TRIGGERS } from "./types-ByCc34Vn.mjs";
import { D as sessionEntryForkedFromParent } from "./session-accessor.sqlite-entry-BB2Zsfho.mjs";
import "./session-accessor-l-4ZHvKn.mjs";
import { r as loadReplySessionInitializationSnapshot } from "./session-accessor.reset-0gTJAhVB.mjs";
import { i as ModelSelectionLockedError, r as MODEL_SELECTION_LOCKED_RESET_MESSAGE, s as isModelSelectionLocked } from "./model-overrides-FXSJttoI.mjs";
import "./history-BQl9FdG2.mjs";
import { l as resolveCommandTurnTargetSessionKey } from "./command-turn-context-a363iy71.mjs";
import { r as normalizeCommandBody } from "./commands-registry-normalize-DJeLLZwD.mjs";
import { c as isRestartRecoveryTombstone, n as SessionRestartRecoveryTombstoneError } from "./lifecycle-WWQJH57y.mjs";
import { n as resolveSessionKey } from "./session-key-BiOR3qX7.mjs";
import { r as resolveSessionParentSessionKey } from "./session-conversation-Bpasei-d.mjs";
import "./commands-registry-Dw3-bHwm.mjs";
import { a as stripMentions } from "./mentions-BKW6zinj.mjs";
import { n as buildMainSessionRecoveryClearPatch } from "./main-session-recovery-clear-H7IP1700.mjs";
import { i as resolveParentForkDecision, n as forkSessionFromParent } from "./session-fork-BqsWLXeV.mjs";
import { t as parseSoftResetCommand } from "./commands-reset-mode-YSRuCbGF.mjs";
import { r as isFormattedGoalContinuationPrompt } from "./commands-goal-CKSk_N65.mjs";
import { a as createReplySessionEntryHandle } from "./get-reply.types-DbkNd-4v.mjs";
import { n as hasInboundMedia } from "./inbound-media-CetKPfK2.mjs";
import { t as resolveResetPreservedSelection } from "./reset-preserved-selection-B5B9whCR.mjs";
import { AsyncLocalStorage } from "node:async_hooks";
import crypto from "node:crypto";
//#region src/auto-reply/reply/session-parent-fork-prepare.ts
function canReplaceRestartTombstoneFromParent(params) {
	return params.hasParentForkSource && isRestartRecoveryTombstone(params.entry) && !isModelSelectionLocked(params.entry) && !sessionEntryForkedFromParent(params.entry) && params.hasPluginOwnedBinding !== true && params.entry?.pluginOwnerId === void 0 && params.inboundAccessAuthorized === true && params.inboundEventKind !== "room_event" && params.actorType === "human" && (params.nativeCommandTarget === void 0 || params.nativeCommandTarget === params.sessionKey);
}
function restartTombstoneParentReplacementError(sessionKey) {
	return new SessionRestartRecoveryTombstoneError(`Session "${sessionKey}" ended during restart recovery. Use /new or /reset to start a replacement session.`);
}
async function prepareReplySessionParentFork(params) {
	if (!params.parentSessionKey || params.parentSessionKey === params.sessionKey || params.alreadyForked) return params.sessionEntry;
	const parentEntry = params.readEntry(params.parentSessionKey);
	if (!parentEntry?.sessionId) {
		if (params.requireParentForkReplacement === true) throw restartTombstoneParentReplacementError(params.sessionKey);
		return params.sessionEntry;
	}
	const decision = await resolveParentForkDecision({
		parentEntry,
		agentId: params.agentId,
		storePath: params.storePath
	});
	if (decision.status === "skip") {
		params.warn(`skipping parent fork (parent too large): parentKey=${params.parentSessionKey} → sessionKey=${params.sessionKey} parentTokens=${decision.parentTokens} maxTokens=${decision.maxTokens}`);
		return {
			...params.sessionEntry,
			forkedFromParent: true
		};
	}
	const fork = await forkSessionFromParent({
		parentEntry,
		agentId: params.agentId,
		parentSessionKey: params.parentSessionKey,
		sessionKey: params.sessionKey,
		storePath: params.storePath
	});
	if (!fork) {
		if (params.requireParentForkReplacement === true) throw restartTombstoneParentReplacementError(params.sessionKey);
		return params.sessionEntry;
	}
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
function skipWhitespace(source, start) {
	let cursor = start;
	while (/\s/.test(source[cursor] ?? "")) cursor += 1;
	return cursor;
}
function skipHorizontalWhitespace(source, start) {
	let cursor = start;
	while (source[cursor] === " " || source[cursor] === "	") cursor += 1;
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
	].some((candidate) => typeof candidate === "string" && normalizeLowercaseStringOrEmpty(candidate) === normalizedPrefix);
}
function resolveExplicitMessageStart(source, ctx) {
	let cursor = skipWhitespace(source, 0);
	if (startsWithHistoryMarker(source, cursor)) return;
	while (source[cursor] === "[") {
		const lineEnd = source.indexOf("\n", cursor);
		const envelopeEnd = source.indexOf("]", cursor + 1);
		if (envelopeEnd === -1 || lineEnd !== -1 && envelopeEnd > lineEnd) break;
		if (startsWithHistoryMarker(source, cursor)) return;
		cursor = skipHorizontalWhitespace(source, envelopeEnd + 1);
	}
	const lineEnd = source.indexOf("\n", cursor);
	const effectiveLineEnd = lineEnd === -1 ? source.length : lineEnd;
	const senderPrefixEnd = source.indexOf(":", cursor);
	if (senderPrefixEnd !== -1 && senderPrefixEnd < effectiveLineEnd) {
		const senderPrefix = source.slice(cursor, senderPrefixEnd).trim();
		if (senderPrefix && senderPrefix.length <= 120 && matchesKnownSenderPrefix(senderPrefix, ctx)) cursor = skipHorizontalWhitespace(source, senderPrefixEnd + 1);
	}
	return cursor;
}
function stripLeadingMention(params) {
	const triggerLower = normalizeLowercaseStringOrEmpty(params.trigger);
	if (normalizeLowercaseStringOrEmpty(params.source.slice(params.start, params.start + params.trigger.length)) === triggerLower) return params.start;
	if (!params.isGroup) return;
	let triggerStart = -1;
	for (let index = params.start; index < params.source.length; index += 1) if (normalizeLowercaseStringOrEmpty(params.source.slice(index, index + params.trigger.length)) === triggerLower) {
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
	if (params.source === "") return;
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
		while (params.source[payloadStart] !== void 0 && params.source[payloadStart] !== ":" && !/\s/.test(params.source[payloadStart] ?? "")) payloadStart += 1;
		const suffix = params.source.slice(suffixStart, payloadStart);
		if (!suffix || !isRecognizedCommandSuffix({
			suffix,
			ctx: params.ctx,
			cfg: params.cfg,
			agentId: params.agentId,
			isGroup: params.isGroup
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
function isTranscriptOnlyCommand(ctx, commandText) {
	return typeof ctx.Transcript === "string" && commandText === ctx.Transcript.replace(/\\n/g, " ").trim();
}
function resolveSessionResetCommand(params) {
	const triggerBodyNormalized = resolveCommandTextForSession(params);
	const normalizedResetBody = normalizeCommandBody(triggerBodyNormalized, { botUsername: params.ctx.BotUsername });
	const softResetMatched = parseSoftResetCommand(normalizedResetBody).matched;
	const result = {
		normalizedResetBody,
		softResetMatched,
		triggerBodyNormalized
	};
	if (!params.resetAuthorized || softResetMatched || isTranscriptOnlyCommand(params.ctx, params.commandText)) return result;
	const normalizedResetBodyLower = normalizeLowercaseStringOrEmpty(normalizedResetBody);
	for (const trigger of params.resetTriggers) {
		const triggerLower = normalizeLowercaseStringOrEmpty(trigger);
		if (!triggerLower || ![triggerLower, normalizeLowercaseStringOrEmpty(normalizeCommandBody(trigger))].some((candidate) => normalizedResetBodyLower === candidate || normalizedResetBodyLower.startsWith(candidate) && /\s/.test(normalizedResetBodyLower.charAt(candidate.length)))) continue;
		const payload = resolveAnchoredResetPayload({
			source: params.rawText,
			trigger,
			commandText: params.commandText,
			ctx: params.ctx,
			cfg: params.cfg,
			agentId: params.agentId,
			isGroup: params.isGroup
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
function resolveAuthorizedSessionResetCommand(params) {
	const resetAuthorized = isResetAuthorizedForContext(params);
	return {
		resetAuthorized,
		resetCommand: resolveSessionResetCommand({
			commandText: params.ctx.commandText ?? "",
			rawText: params.ctx.rawText ?? "",
			resetTriggers: params.cfg.session?.resetTriggers?.length ? params.cfg.session.resetTriggers : DEFAULT_RESET_TRIGGERS,
			ctx: params.ctx,
			cfg: params.cfg,
			agentId: params.agentId,
			isGroup: params.isGroup,
			resetAuthorized
		})
	};
}
//#endregion
//#region src/auto-reply/reply/prepared-reply-dispatch-context.ts
const preparedReplyDispatchRuntime = new AsyncLocalStorage();
/** Keeps the configured Gateway generation request-scoped without widening the public resolver. */
function runWithPreparedReplyDispatchRuntime(runtime, run) {
	return preparedReplyDispatchRuntime.run(runtime, run);
}
function bindPreparedReplyDispatchRuntime(runtime, run) {
	return (...args) => runWithPreparedReplyDispatchRuntime(runtime, () => run(...args));
}
function getPreparedReplyDispatchRuntime() {
	return preparedReplyDispatchRuntime.getStore();
}
//#endregion
//#region src/auto-reply/reply/stage-remote-inbound-media.ts
/** Shared guard for staging remote inbound media into the local cache. */
const stageSandboxMediaRuntimeLoader = createLazyImportLoader(() => import("./stage-sandbox-media.runtime.js"));
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
function resolveFastSessionKey(params) {
	const { ctx } = params;
	const nativeCommandTarget = resolveCommandTurnTargetSessionKey(ctx) ?? "";
	if (nativeCommandTarget) return nativeCommandTarget;
	return resolveSessionKey(params.sessionScope, ctx, params.mainKey, params.agentId);
}
function withFullRuntimeReplyConfig(config) {
	return markReplyConfigRuntimeMode(config, "full");
}
function resolveGetReplyConfig(params) {
	const { configOverride } = params;
	if (configOverride == null) return params.getRuntimeConfig();
	if (params.isFastTestEnv && !isCompleteReplyConfig(configOverride) && !isSlowReplyTestAllowed()) throw new Error("Fast reply tests must pass with withFastReplyConfig()/markCompleteReplyConfig(); set OPENCLAW_ALLOW_SLOW_REPLY_TESTS=1 to opt out.");
	if (params.isFastTestEnv && isCompleteReplyConfig(configOverride)) return configOverride;
	if (isCompleteReplyConfig(configOverride)) return configOverride;
	return applyMergePatch(params.getRuntimeConfig(), configOverride);
}
function shouldUseReplyFastTestBootstrap(params) {
	return params.isFastTestEnv && isCompleteReplyConfig(params.configOverride) && !usesFullReplyRuntime(params.configOverride);
}
function shouldUseReplyFastTestRuntime(params) {
	return params.isFastTestEnv && isCompleteReplyConfig(params.cfg) && !usesFullReplyRuntime(params.cfg);
}
function initFastReplySessionState(params) {
	const { ctx, cfg, agentId, commandAuthorized } = params;
	const sessionScope = cfg.session?.scope ?? "per-sender";
	const sessionKey = resolveFastSessionKey({
		ctx,
		sessionScope,
		mainKey: cfg.session?.mainKey,
		agentId
	});
	const storePath = resolveSessionStorePathCore(cfg.session?.store, { agentId });
	const relatedSessionKeys = [
		ctx.ParentSessionKey,
		ctx.ModelParentSessionKey,
		ctx.CommandTargetSessionKey,
		resolveSessionParentSessionKey(sessionKey)
	].filter((key) => typeof key === "string");
	const snapshot = loadReplySessionInitializationSnapshot({
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
	const commandSource = ctx.commandText ?? "";
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
	const bodyStripped = resetTriggered ? resetCommand.payload ?? "" : ctx.agentText ?? "";
	const now = Date.now();
	const resetPreservedSelection = resetTriggered ? resolveResetPreservedSelection({ entry: existingEntry }) : {};
	const sessionEntry = {
		...!resetTriggered ? existingEntry : void 0,
		sessionId,
		...!existingEntry && ctx.SessionCreation ? buildSessionCreationStamp(ctx.SessionCreation) : {},
		...resetTriggered && existingEntry ? {
			previousSessionId: existingEntry.sessionId,
			spawnedBy: existingEntry.spawnedBy,
			spawnedWorkspaceDir: existingEntry.spawnedWorkspaceDir,
			spawnedCwd: existingEntry.spawnedCwd,
			parentSessionKey: existingEntry.parentSessionKey,
			parentSessionId: existingEntry.parentSessionId,
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
		...normalizeOptionalString(ctx.Provider) ? { channel: normalizeOptionalString(ctx.Provider) } : {},
		...normalizeOptionalString(ctx.GroupSubject) ? { subject: normalizeOptionalString(ctx.GroupSubject) } : {},
		...normalizeOptionalString(ctx.GroupChannel) ? { groupChannel: normalizeOptionalString(ctx.GroupChannel) } : {},
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
			commandText: ctx.commandText ?? "",
			agentText: bodyStripped,
			rawText: ctx.rawText ?? "",
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
export { shouldUseReplyFastTestRuntime as a, bindPreparedReplyDispatchRuntime as c, canReplaceRestartTombstoneFromParent as d, prepareReplySessionParentFork as f, shouldUseReplyFastTestBootstrap as i, getPreparedReplyDispatchRuntime as l, initFastReplySessionState as n, withFullRuntimeReplyConfig as o, resolveGetReplyConfig as r, stageRemoteInboundMediaIfNeeded as s, resolveRunTypingPolicy as t, resolveAuthorizedSessionResetCommand as u };
