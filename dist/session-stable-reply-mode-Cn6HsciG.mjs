import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { d as resolveToolProfilePolicy } from "./tool-policy-shared-auQCQEhM.mjs";
import { o as isToolAllowedByPolicies } from "./tool-policy-match-Bv2XOvEF.mjs";
import { l as mergeAlsoAllowPolicy } from "./tool-policy-YDdaK0oX.mjs";
import { l as resolveSessionStorePathCore } from "./paths-CcMbq5NY.mjs";
import { i as buildModelAliasIndex, v as resolveModelRefFromString } from "./model-selection-shared-0uvJbX1M.mjs";
import { _ as resolveSessionAgentId } from "./agent-scope-CTuYDtny.mjs";
import { t as resolveDefaultModelForAgent } from "./model-selection-config-DZ4sk4C2.mjs";
import { u as normalizeVerboseLevel } from "./thinking.shared-BKzBCWpI.mjs";
import { i as logVerbose } from "./globals-QODkv80i.mjs";
import "./message-channel-constants-Cd7Eq8Zi.mjs";
import "./message-channel-DDcHHhpX.mjs";
import { t as normalizeChatType } from "./chat-type-Dbv0JQHI.mjs";
import "./thinking-B1p5pEC8.mjs";
import "./model-selection-CFnUi6iD.mjs";
import { h as resolveSessionPinnedHarnessId } from "./agent-harness-session-key-CQ6tTBOH.mjs";
import { i as resolveSessionRuntimeOverrideForProvider } from "./session-runtime-compat-CJOaEEoJ.mjs";
import { n as sessionDeliveryChannel, r as sessionDeliveryOrigin, t as deliveryContextFromSession } from "./delivery-context.read-CR06zOJ4.mjs";
import { r as resolveGroupSessionKey } from "./group-B8HN3m8j.mjs";
import { l as loadSessionEntryReadOnly } from "./session-accessor.sqlite-entry-BTkJgNr-.mjs";
import "./session-accessor-C05KQ5A3.mjs";
import { i as resolveSourceReplyDeliveryMode } from "./source-reply-delivery-mode-Byvky-I7.mjs";
import { a as isNativeCommandTurn, c as resolveCommandTurnContext } from "./command-turn-context-a363iy71.mjs";
import { s as resolveSubagentCapabilityStore, t as isSubagentEnvelopeSession } from "./subagent-capabilities-D-LyBU4l.mjs";
import { a as resolveSubagentToolPolicyForSession, i as resolveInheritedToolPolicyForSession, n as resolveEffectiveToolPolicy, r as resolveGroupToolPolicy } from "./agent-tools.policy-L6QuLbuq.mjs";
import "./internal-hooks-CUWGd3wf.mjs";
import { n as resolveAgentHarnessDeliveryDefaults } from "./selection-decision-DjjfZ9uz.mjs";
import { t as resolveChannelModelOverride } from "./model-overrides-DscrM38h.mjs";
import { n as resolveStoredModelOverride } from "./stored-model-overrides-Covy02dM.mjs";
import { t as resolveOriginMessageProvider } from "./origin-routing-jrHjZJWx.mjs";
//#region src/auto-reply/reply/dispatch-from-config.runtime.ts
/** Runtime-only dispatch dependencies shared by config-driven reply delivery. */
/** Runtime-only dispatch dependencies shared by config-driven reply delivery. */
function loadSessionStoreEntry(params) {
	return loadSessionEntryReadOnly(params);
}
//#endregion
//#region src/auto-reply/reply/dispatch-from-config.harness-defaults.ts
function createShouldEmitVerboseProgress(params) {
	let runVerbosity;
	const resolveCurrentExplicitLevel = () => {
		if (params.sessionKey && params.storePath) try {
			const entry = loadSessionStoreEntry({
				...params.agentId ? { agentId: params.agentId } : {},
				storePath: params.storePath,
				sessionKey: params.sessionKey,
				readConsistency: "latest",
				clone: false
			});
			return normalizeVerboseLevel(entry?.verboseLevel ?? "");
		} catch {}
		return normalizeVerboseLevel(params.initialExplicitLevel ?? "");
	};
	const resolveLevel = () => runVerbosity?.verboseLevelOverride ?? resolveCurrentExplicitLevel() ?? runVerbosity?.resolvedVerboseLevel ?? normalizeVerboseLevel(params.fallbackLevel) ?? "off";
	return {
		noteRunVerbosity: (settings) => {
			runVerbosity = settings;
		},
		shouldEmit: () => resolveLevel() !== "off",
		shouldEmitFull: () => resolveLevel() === "full"
	};
}
function resolveHarnessDefaultChannel(params) {
	const originatingChannel = typeof params.ctx.OriginatingChannel === "string" ? params.ctx.OriginatingChannel : void 0;
	return sessionDeliveryChannel(params.entry) ?? originatingChannel ?? params.ctx.Provider ?? params.ctx.Surface;
}
function resolveHarnessDefaultParentSessionKey(params) {
	return params.entry?.parentSessionKey ?? params.ctx.ModelParentSessionKey ?? params.ctx.ParentSessionKey;
}
function resolveTurnModelOverride(replyOptions) {
	if (replyOptions?.isHeartbeat !== true) return;
	return normalizeOptionalString(replyOptions.heartbeatModelOverride);
}
function resolveChannelModelCandidate(params) {
	if (!params.cfg.channels?.modelByChannel) return;
	const channel = resolveHarnessDefaultChannel({
		ctx: params.ctx,
		entry: params.entry
	});
	const channelModelOverride = resolveChannelModelOverride({
		cfg: params.cfg,
		channel,
		groupId: params.entry?.groupId,
		groupChatType: params.entry?.chatType ?? params.ctx.ChatType,
		groupChannel: params.entry?.groupChannel ?? params.ctx.GroupChannel,
		groupSubject: params.entry?.subject ?? params.ctx.GroupSubject,
		parentSessionKey: params.parentSessionKey,
		directUserIds: [
			sessionDeliveryOrigin(params.entry)?.nativeDirectUserId,
			sessionDeliveryOrigin(params.entry)?.from,
			sessionDeliveryOrigin(params.entry)?.to,
			params.ctx.OriginatingTo,
			params.ctx.From,
			params.ctx.SenderId
		]
	});
	if (!channelModelOverride) return;
	return resolveModelRefFromString({
		raw: channelModelOverride.model,
		defaultProvider: params.defaultProvider,
		aliasIndex: params.aliasIndex
	})?.ref;
}
function resolveStoredModelCandidate(params) {
	const storedModelRef = resolveStoredModelOverride({
		loadSessionEntry: (sessionKey) => {
			const agentId = resolveSessionAgentId({
				sessionKey,
				config: params.cfg,
				fallbackAgentId: params.sessionAgentId
			});
			return loadSessionStoreEntry({
				agentId,
				storePath: resolveSessionStorePathCore(params.cfg.session?.store, { agentId }),
				sessionKey,
				readConsistency: "latest",
				clone: false
			});
		},
		sessionEntry: params.entry,
		sessionStore: params.sessionStore,
		sessionKey: params.sessionKey,
		parentSessionKey: params.parentSessionKey,
		defaultProvider: params.defaultProvider
	});
	if (!storedModelRef) return;
	return {
		provider: storedModelRef.provider ?? params.defaultProvider,
		model: storedModelRef.model
	};
}
function resolveModelOverrideCandidate(params) {
	if (!params.modelOverride) return;
	return resolveModelRefFromString({
		raw: params.modelOverride,
		defaultProvider: params.defaultProvider,
		aliasIndex: params.aliasIndex
	})?.ref;
}
/**
* Resolves the configured visible-replies mode plus the guarded harness
* default. One owner for dispatch and synthetic-turn binding facts: both must
* derive the same session-stable delivery mode or CLI session bindings
* ping-pong across turn kinds (#121485).
*/
function resolveVisibleRepliesPolicy(params) {
	const configuredVisibleReplies = params.chatType === "group" || params.chatType === "channel" ? params.cfg.messages?.groupChat?.visibleReplies ?? params.cfg.messages?.visibleReplies : params.cfg.messages?.visibleReplies;
	return {
		configuredVisibleReplies,
		harnessDefaultVisibleReplies: configuredVisibleReplies === void 0 && params.chatType !== "group" && params.chatType !== "channel" ? resolveHarnessSourceVisibleRepliesDefault({
			cfg: params.cfg,
			ctx: params.ctx,
			entry: params.entry,
			sessionAgentId: params.sessionAgentId,
			sessionKey: params.sessionKey,
			sessionStore: params.sessionStore,
			turnModelOverride: params.turnModelOverride
		}) : void 0
	};
}
function resolveHarnessSourceVisibleRepliesDefault(params) {
	if (isNativeCommandTurn(resolveCommandTurnContext(params.ctx))) return;
	try {
		const defaultModelRef = resolveDefaultModelForAgent({
			cfg: params.cfg,
			agentId: params.sessionAgentId
		});
		const aliasIndex = buildModelAliasIndex({
			cfg: params.cfg,
			agentId: params.sessionAgentId,
			defaultProvider: defaultModelRef.provider
		});
		const parentSessionKey = resolveHarnessDefaultParentSessionKey(params);
		const channelModelCandidate = resolveChannelModelCandidate({
			aliasIndex,
			cfg: params.cfg,
			ctx: params.ctx,
			defaultProvider: defaultModelRef.provider,
			entry: params.entry,
			parentSessionKey
		});
		const storedModelCandidate = resolveStoredModelCandidate({
			cfg: params.cfg,
			defaultProvider: defaultModelRef.provider,
			entry: params.entry,
			parentSessionKey,
			sessionAgentId: params.sessionAgentId,
			sessionKey: params.sessionKey,
			sessionStore: params.sessionStore
		});
		const turnModelCandidate = resolveModelOverrideCandidate({
			aliasIndex,
			defaultProvider: defaultModelRef.provider,
			modelOverride: params.turnModelOverride
		});
		const resolveCandidateDefault = (candidate) => {
			const agentHarnessRuntimeOverride = resolveSessionRuntimeOverrideForProvider({
				provider: candidate.provider,
				entry: params.entry,
				cfg: params.cfg
			});
			const defaults = resolveAgentHarnessDeliveryDefaults({
				provider: candidate.provider,
				modelId: candidate.model,
				config: params.cfg,
				agentId: params.sessionAgentId,
				sessionKey: params.sessionKey,
				agentHarnessId: resolveSessionPinnedHarnessId(params.entry),
				agentHarnessRuntimeOverride
			});
			return defaults?.visibleReplies ?? defaults?.sourceVisibleReplies;
		};
		const selectedModelCandidate = turnModelCandidate ?? storedModelCandidate ?? channelModelCandidate;
		if (selectedModelCandidate) return resolveCandidateDefault(selectedModelCandidate);
		const sourceProvider = normalizeOptionalString(sessionDeliveryOrigin(params.entry)?.provider ?? params.ctx.Provider ?? params.ctx.Surface);
		if (sourceProvider) {
			const sourceDefault = resolveCandidateDefault({ provider: sourceProvider });
			if (sourceDefault) return sourceDefault;
		}
		return resolveCandidateDefault(defaultModelRef);
	} catch (error) {
		logVerbose(`dispatch-from-config: could not resolve harness visible-reply defaults: ${formatErrorMessage(error)}`);
		return;
	}
}
//#endregion
//#region src/auto-reply/reply/session-stable-reply-mode.ts
/**
* Resolves the session's stable source-reply mode the way dispatch does, from
* a synthetic turn's restored context plus persisted session facts. Synthetic
* turns keep their effective delivery mode, but CLI session reuse belongs to
* the session's normal source-reply policy — every turn kind must derive the
* same messageToolPolicyHash, or chat and heartbeat turns ping-pong the CLI
* binding on each transition (#121485).
*/
function resolveSessionStableReplyMode(params) {
	const { cfg, ctx, sessionEntry } = params;
	const chatType = normalizeChatType(ctx.ChatType) ?? normalizeChatType(sessionEntry.chatType) ?? void 0;
	const stableReplyContext = {
		CommandAuthorized: false,
		ChatType: chatType,
		Provider: normalizeOptionalString(ctx.Provider) ?? sessionDeliveryOrigin(sessionEntry)?.provider ?? "webchat",
		Surface: normalizeOptionalString(ctx.Surface) ?? sessionDeliveryChannel(sessionEntry),
		ExplicitDeliverRoute: ctx.ExplicitDeliverRoute
	};
	const { harnessDefaultVisibleReplies } = resolveVisibleRepliesPolicy({
		cfg,
		chatType,
		ctx,
		entry: sessionEntry,
		sessionAgentId: params.sessionAgentId,
		sessionKey: params.sessionKey,
		sessionStore: params.sessionStore,
		turnModelOverride: params.turnModelOverride
	});
	const candidateMode = resolveSourceReplyDeliveryMode({
		cfg,
		ctx: stableReplyContext,
		defaultVisibleReplies: harnessDefaultVisibleReplies
	});
	if (candidateMode !== "message_tool_only") return candidateMode;
	return resolveStableMessageToolAvailability(params) ? candidateMode : "automatic";
}
/**
* Sender-independent message-tool availability for the session-stable mode.
* One owner for dispatch's stable-mode downgrade and synthetic-turn binding
* facts: sender-scoped denials apply to the sender's turn, never to the
* session policy every turn kind must hash identically (#121485).
*/
function resolveStableMessageToolAvailability(params) {
	const { cfg, ctx, sessionEntry } = params;
	const { globalPolicy, globalProviderPolicy, agentPolicy, agentProviderPolicy, profile, providerProfile, profileAlsoAllow, providerProfileAlsoAllow } = resolveEffectiveToolPolicy({
		config: cfg,
		sessionKey: params.sessionKey,
		agentId: params.sessionAgentId
	});
	const profilePolicy = mergeAlsoAllowPolicy(resolveToolProfilePolicy(profile), [...profileAlsoAllow ?? [], "message"]);
	const providerProfilePolicy = mergeAlsoAllowPolicy(resolveToolProfilePolicy(providerProfile), [...providerProfileAlsoAllow ?? [], "message"]);
	const groupPolicy = resolveGroupToolPolicy({
		config: cfg,
		sessionKey: params.sessionKey,
		messageProvider: resolveOriginMessageProvider({
			originatingChannel: ctx.OriginatingChannel ?? (sessionEntry ? sessionDeliveryChannel(sessionEntry) : void 0),
			provider: normalizeOptionalString(ctx.Provider ?? ctx.Surface) ?? (sessionEntry ? sessionDeliveryOrigin(sessionEntry)?.provider : void 0)
		}),
		groupId: resolveGroupSessionKey(ctx)?.id ?? sessionEntry?.groupId,
		groupChannel: normalizeOptionalString(ctx.GroupChannel) ?? normalizeOptionalString(ctx.GroupSubject) ?? normalizeOptionalString(sessionEntry?.groupChannel) ?? normalizeOptionalString(sessionEntry?.subject),
		groupSpace: normalizeOptionalString(ctx.GroupSpace),
		accountId: ctx.AccountId ?? (sessionEntry ? deliveryContextFromSession(sessionEntry)?.accountId : void 0)
	});
	const subagentStore = resolveSubagentCapabilityStore(params.sessionKey, { cfg });
	const subagentPolicy = params.sessionKey && isSubagentEnvelopeSession(params.sessionKey, {
		cfg,
		store: subagentStore
	}) ? resolveSubagentToolPolicyForSession(cfg, params.sessionKey, { store: subagentStore }) : void 0;
	const inheritedToolPolicy = resolveInheritedToolPolicyForSession(cfg, params.sessionKey, { store: subagentStore });
	return isToolAllowedByPolicies("message", [
		profilePolicy,
		providerProfilePolicy,
		globalProviderPolicy,
		agentProviderPolicy,
		globalPolicy,
		agentPolicy,
		groupPolicy,
		subagentPolicy,
		inheritedToolPolicy
	]);
}
//#endregion
export { resolveVisibleRepliesPolicy as a, resolveTurnModelOverride as i, resolveStableMessageToolAvailability as n, loadSessionStoreEntry as o, createShouldEmitVerboseProgress as r, resolveSessionStableReplyMode as t };
