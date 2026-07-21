import { c as normalizeOptionalString, s as normalizeOptionalLowercaseString } from "./string-coerce-DW4mBlAt.js";
import { t as createLazyImportLoader } from "./lazy-promise-10KxeiYV.js";
import { t as applyMergePatch } from "./merge-patch-PFdHlc8i.js";
import { a as normalizeAnyChannelId } from "./registry-BUWrOy2m.js";
import { P as resolveSessionStoreEntry, S as loadSessionStore } from "./store-Cvp82S16.js";
import "./message-channel-constants-BXOA4cxJ.js";
import { d as resolveStorePath, s as resolveSessionTranscriptPath } from "./paths-C2C4lJH6.js";
import { t as normalizeChatType } from "./chat-type-BARlA53h.js";
import "./message-channel-CB9y2CYk.js";
import { c as resolveCommandTurnTargetSessionKey } from "./command-turn-context-DXqYoJ8B.js";
import { r as normalizeCommandBody } from "./commands-registry-normalize-fZe-I4O7.js";
import { n as resolveSessionKey } from "./session-key-D932f4xQ.js";
import "./commands-registry-B7Y472iL.js";
import { i as isFormattedGoalContinuationPrompt } from "./commands-goal-q-tfEwnt.js";
import { t as parseSoftResetCommand } from "./commands-reset-mode-CyVYz7U7.js";
import { o as stripMentions, s as stripStructuralPrefixes } from "./mentions-BJW-vfhG.js";
import { n as hasInboundMedia } from "./inbound-media-BABB4m9T.js";
import crypto from "node:crypto";
//#region src/auto-reply/reply/session-entry-handle.ts
function createReplySessionEntryHandle(params) {
	const entries = params.sessionStore ?? { [params.sessionKey]: params.sessionEntry };
	let currentEntry = params.sessionEntry;
	entries[params.sessionKey] = currentEntry;
	return {
		get: (sessionKey) => entries[sessionKey],
		getCurrent: () => currentEntry,
		patchCurrent: (patch) => {
			currentEntry = {
				...currentEntry,
				...patch
			};
			entries[params.sessionKey] = currentEntry;
			return currentEntry;
		},
		replaceCurrent: (entry) => {
			currentEntry = entry;
			entries[params.sessionKey] = entry;
		},
		set: (sessionKey, entry) => {
			entries[sessionKey] = entry;
			if (sessionKey === params.sessionKey) currentEntry = entry;
		},
		toCompatSessionStore: () => entries
	};
}
//#endregion
//#region src/auto-reply/reply/get-reply-fast-path.ts
const COMPLETE_REPLY_CONFIG_SYMBOL = Symbol.for("openclaw.reply.complete-config");
const FULL_REPLY_RUNTIME_SYMBOL = Symbol.for("openclaw.reply.full-runtime");
function isSlowReplyTestAllowed(env = process.env) {
	return env.OPENCLAW_ALLOW_SLOW_REPLY_TESTS === "1" || env.OPENCLAW_STRICT_FAST_REPLY_CONFIG === "0";
}
function resolveFastSessionKey(params) {
	const { ctx } = params;
	const nativeCommandTarget = resolveCommandTurnTargetSessionKey(ctx) ?? "";
	if (nativeCommandTarget) return nativeCommandTarget;
	return resolveSessionKey(params.sessionScope, ctx, params.mainKey);
}
function markReplyConfigRuntimeMode(config, runtimeMode = "fast") {
	Object.defineProperty(config, FULL_REPLY_RUNTIME_SYMBOL, {
		value: runtimeMode === "full" ? true : void 0,
		configurable: true,
		enumerable: false
	});
}
function markCompleteReplyConfig(config, options) {
	Object.defineProperty(config, COMPLETE_REPLY_CONFIG_SYMBOL, {
		value: true,
		configurable: true,
		enumerable: false
	});
	markReplyConfigRuntimeMode(config, options?.runtimeMode ?? "fast");
	return config;
}
function withFullRuntimeReplyConfig(config) {
	return markCompleteReplyConfig(config, { runtimeMode: "full" });
}
function isCompleteReplyConfig(config) {
	return Boolean(config && typeof config === "object" && config[COMPLETE_REPLY_CONFIG_SYMBOL] === true);
}
function usesFullReplyRuntime(config) {
	return Boolean(config && typeof config === "object" && config[FULL_REPLY_RUNTIME_SYMBOL] === true);
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
function shouldUseReplyFastDirectiveExecution(params) {
	if (!params.isFastTestBootstrap || params.isGroup || params.isHeartbeat || params.resetTriggered) return false;
	return !params.triggerBodyNormalized.includes("/");
}
function buildFastReplyCommandContext(params) {
	const { ctx, cfg, agentId, sessionKey, isGroup, triggerBodyNormalized, commandAuthorized } = params;
	const originatingChannel = normalizeOptionalLowercaseString(ctx.OriginatingChannel);
	const surface = normalizeOptionalLowercaseString(ctx.Surface ?? ctx.Provider) ?? "";
	const channel = originatingChannel ?? normalizeOptionalLowercaseString(ctx.Provider ?? surface) ?? "";
	const from = normalizeOptionalString(ctx.From ?? ctx.SenderId);
	const to = normalizeOptionalString(ctx.To ?? ctx.OriginatingTo);
	return {
		surface,
		channel,
		channelId: normalizeAnyChannelId(channel) ?? normalizeAnyChannelId(surface) ?? void 0,
		accountId: normalizeOptionalString(ctx.AccountId),
		ownerList: [],
		senderIsOwner: false,
		isAuthorizedSender: commandAuthorized,
		senderId: from,
		abortKey: sessionKey ?? from ?? to,
		rawBodyNormalized: triggerBodyNormalized,
		commandBodyNormalized: normalizeCommandBody(isGroup ? stripMentions(triggerBodyNormalized, ctx, cfg, agentId) : triggerBodyNormalized, { botUsername: ctx.BotUsername }),
		from,
		to
	};
}
function shouldHandleFastReplyTextCommands(params) {
	return params.commandSource === "native" || params.cfg.commands?.text !== false;
}
function initFastReplySessionState(params) {
	const { ctx, cfg, agentId, commandAuthorized } = params;
	const sessionScope = cfg.session?.scope ?? "per-sender";
	const sessionKey = resolveFastSessionKey({
		ctx,
		sessionScope,
		mainKey: cfg.session?.mainKey
	});
	const storePath = resolveStorePath(cfg.session?.store, { agentId });
	const sessionStore = loadSessionStore(storePath, {
		skipCache: true,
		clone: false
	});
	const existingEntry = resolveSessionStoreEntry({
		store: sessionStore,
		sessionKey
	}).existing;
	const commandSource = ctx.BodyForCommands ?? ctx.CommandBody ?? ctx.RawBody ?? ctx.Body ?? "";
	const triggerBodyNormalized = isFormattedGoalContinuationPrompt(commandSource) ? commandSource.trim() : stripStructuralPrefixes(commandSource).trim();
	const normalizedChatType = normalizeChatType(ctx.ChatType);
	const isGroup = normalizedChatType != null && normalizedChatType !== "direct";
	const normalizedResetBody = normalizeCommandBody(isGroup ? stripMentions(triggerBodyNormalized, ctx, cfg, agentId) : triggerBodyNormalized, { botUsername: ctx.BotUsername });
	const softReset = parseSoftResetCommand(normalizedResetBody);
	const resetMatch = normalizedResetBody.match(/^\/(new|reset)(?:\s|$)/i);
	const resetTriggered = Boolean(resetMatch) && !softReset.matched;
	const previousSessionEntry = resetTriggered && existingEntry ? { ...existingEntry } : void 0;
	const sessionId = !resetTriggered && existingEntry ? existingEntry.sessionId : crypto.randomUUID();
	const bodyStripped = resetTriggered ? normalizedResetBody.slice(resetMatch?.[0].length ?? 0).trimStart() : ctx.BodyForAgent ?? ctx.Body ?? "";
	const now = Date.now();
	const sessionFile = !resetTriggered && existingEntry?.sessionFile ? existingEntry.sessionFile : resolveSessionTranscriptPath(sessionId, agentId);
	const sessionEntry = {
		...!resetTriggered ? existingEntry : void 0,
		sessionId,
		sessionFile,
		updatedAt: now,
		sessionStartedAt: resetTriggered ? now : existingEntry?.sessionStartedAt ?? now,
		lastInteractionAt: now,
		thinkingLevel: resetTriggered ? existingEntry?.thinkingLevel : existingEntry?.thinkingLevel,
		verboseLevel: resetTriggered ? existingEntry?.verboseLevel : existingEntry?.verboseLevel,
		reasoningLevel: resetTriggered ? existingEntry?.reasoningLevel : existingEntry?.reasoningLevel,
		ttsAuto: resetTriggered ? existingEntry?.ttsAuto : existingEntry?.ttsAuto,
		responseUsage: existingEntry?.responseUsage,
		modelOverride: resetTriggered ? existingEntry?.modelOverride : existingEntry?.modelOverride,
		providerOverride: resetTriggered ? existingEntry?.providerOverride : existingEntry?.providerOverride,
		authProfileOverride: resetTriggered ? existingEntry?.authProfileOverride : existingEntry?.authProfileOverride,
		authProfileOverrideSource: resetTriggered ? existingEntry?.authProfileOverrideSource : existingEntry?.authProfileOverrideSource,
		authProfileOverrideCompactionCount: resetTriggered ? existingEntry?.authProfileOverrideCompactionCount : existingEntry?.authProfileOverrideCompactionCount,
		...normalizedChatType ? { chatType: normalizedChatType } : {},
		...normalizeOptionalString(ctx.Provider) ? { channel: normalizeOptionalString(ctx.Provider) } : {},
		...normalizeOptionalString(ctx.GroupSubject) ? { subject: normalizeOptionalString(ctx.GroupSubject) } : {},
		...normalizeOptionalString(ctx.GroupChannel) ? { groupChannel: normalizeOptionalString(ctx.GroupChannel) } : {}
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
//#region src/auto-reply/reply/stage-remote-inbound-media.ts
/** Shared guard for staging remote inbound media into the local cache. */
const stageSandboxMediaRuntimeLoader = createLazyImportLoader(() => import("./stage-sandbox-media.runtime.js"));
/**
* Stage remote (SCP) inbound media before downstream consumers read the media
* paths off ctx, then mark MediaStaged so the single-stage contract holds for
* later staging sites. Both the dispatch plugin-claim path and get-reply's
* media-understanding path rely on this rewrite to expose the local cache path
* instead of the unreachable remote host path; returns whether staging ran.
*/
async function stageRemoteInboundMediaIfNeeded(params) {
	if (!params.sessionKey || params.ctx.MediaStaged || !normalizeOptionalString(params.ctx.MediaRemoteHost) || !hasInboundMedia(params.ctx)) return false;
	const { stageSandboxMedia } = await stageSandboxMediaRuntimeLoader.load();
	if ((await stageSandboxMedia({
		ctx: params.ctx,
		sessionCtx: params.ctx,
		cfg: params.cfg,
		sessionKey: params.sessionKey,
		workspaceDir: params.workspaceDir,
		remoteMediaMode: params.remoteMediaMode
	})).staged.size === 0) return false;
	params.ctx.MediaStaged = true;
	return true;
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
export { resolveGetReplyConfig as a, shouldUseReplyFastTestBootstrap as c, createReplySessionEntryHandle as d, initFastReplySessionState as i, shouldUseReplyFastTestRuntime as l, stageRemoteInboundMediaIfNeeded as n, shouldHandleFastReplyTextCommands as o, buildFastReplyCommandContext as r, shouldUseReplyFastDirectiveExecution as s, resolveRunTypingPolicy as t, withFullRuntimeReplyConfig as u };
