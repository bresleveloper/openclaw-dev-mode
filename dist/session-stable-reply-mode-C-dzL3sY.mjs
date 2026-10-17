import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { t as formatErrorMessage } from "./errors-O33D01XW.mjs";
import { l as resolveSessionStorePathCore } from "./paths-dpReqUI8.mjs";
import { g as resolveSessionAgentId } from "./agent-scope-CG17uXFn.mjs";
import { s as resolveCoreToolProfilePolicy } from "./tool-catalog-DyHnjiiS.mjs";
import { o as isToolAllowedByPolicies } from "./tool-policy-match-Dn8gpf-E.mjs";
import { l as mergeAlsoAllowPolicy } from "./tool-policy-BKvvmcQR.mjs";
import { i as buildModelAliasIndex, v as resolveModelRefFromString } from "./model-selection-shared-DKlQ1p0S.mjs";
import { t as resolveDefaultModelForAgent } from "./model-selection-config-CsO-mXVD.mjs";
import { d as normalizeVerboseLevel } from "./thinking.shared-Jy32Vp-O.mjs";
import "./message-channel-constants-B3vfipkP.mjs";
import "./message-channel-j-k-Nup3.mjs";
import { t as normalizeChatType } from "./chat-type-D-T98NfH.mjs";
import { i as logVerbose } from "./globals-BXbZ1A_g.mjs";
import "./thinking-NbdrO8vA.mjs";
import "./model-selection-D3_rVb38.mjs";
import { h as resolveSessionPinnedHarnessId } from "./agent-harness-session-key-D8EQIzja.mjs";
import { i as resolveSessionRuntimeOverrideForProvider } from "./session-runtime-compat-rcNVygEk.mjs";
import { n as sessionDeliveryChannel, r as sessionDeliveryOrigin, t as deliveryContextFromSession } from "./delivery-context.read-CR06zOJ4.mjs";
import { r as resolveGroupSessionKey } from "./group-DiW6xNkZ.mjs";
import { o as loadSessionEntryReadOnly } from "./session-accessor.sqlite-entry-DjT1nXRD.mjs";
import "./session-accessor-CQ-g9yb2.mjs";
import { a as isNativeCommandTurn, c as resolveCommandTurnContext } from "./command-turn-context-B-DtktkV.mjs";
import { s as resolveSubagentCapabilityStore, t as isSubagentEnvelopeSession } from "./subagent-capabilities-wl-IV_LE.mjs";
import { a as resolveSubagentToolPolicyForSession, i as resolveInheritedToolPolicyForSession, n as resolveEffectiveToolPolicy, r as resolveGroupToolPolicy } from "./agent-tools.policy-XJMKA8K7.mjs";
import { n as resolveAgentHarnessDeliveryDefaults } from "./selection-decision-w89fCXgB.mjs";
import { t as resolveChannelModelOverride } from "./model-overrides-CitqsXzV.mjs";
import { n as resolveStoredModelOverride } from "./stored-model-overrides-C9b7mZbZ.mjs";
import { r as resolveSourceReplyDeliveryMode } from "./source-reply-delivery-mode-Cobau2H2.mjs";
import { t as resolveOriginMessageProvider } from "./origin-routing-yvWYa9hL.mjs";
//#region src/auto-reply/reply/dispatch-from-config.harness-defaults.ts
function createShouldEmitVerboseProgress(params) {
	let runVerbosity;
	const resolveCurrentExplicitLevel = () => {
		if (params.sessionKey && params.storePath) try {
			const entry = loadSessionEntryReadOnly({
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
function resolveTurnModelOverride(replyOptions) {
	if (replyOptions?.isHeartbeat !== true) return;
	return normalizeOptionalString(replyOptions.heartbeatModelOverride);
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
		const allowPluginNormalization = params.cfg.plugins?.enabled !== false;
		const defaultModelRef = resolveDefaultModelForAgent({
			cfg: params.cfg,
			agentId: params.sessionAgentId,
			allowPluginNormalization
		});
		const aliasIndex = buildModelAliasIndex({
			cfg: params.cfg,
			agentId: params.sessionAgentId,
			defaultProvider: defaultModelRef.provider,
			allowPluginNormalization
		});
		const parentSessionKey = params.entry?.parentSessionKey ?? params.ctx.ModelParentSessionKey ?? params.ctx.ParentSessionKey;
		const channelModelOverride = params.cfg.channels?.modelByChannel ? resolveChannelModelOverride({
			cfg: params.cfg,
			channel: sessionDeliveryChannel(params.entry) ?? params.ctx.OriginatingChannel ?? params.ctx.Provider ?? params.ctx.Surface,
			groupId: params.entry?.groupId,
			groupChatType: params.entry?.chatType ?? params.ctx.ChatType,
			groupChannel: params.entry?.groupChannel ?? params.ctx.GroupChannel,
			groupSubject: params.entry?.subject ?? params.ctx.GroupSubject,
			parentSessionKey,
			directUserIds: [
				sessionDeliveryOrigin(params.entry)?.nativeDirectUserId,
				sessionDeliveryOrigin(params.entry)?.from,
				sessionDeliveryOrigin(params.entry)?.to,
				params.ctx.OriginatingTo,
				params.ctx.From,
				params.ctx.SenderId
			]
		}) : void 0;
		const channelModelCandidate = channelModelOverride ? resolveModelRefFromString({
			raw: channelModelOverride.model,
			cfg: params.cfg,
			agentId: params.sessionAgentId,
			defaultProvider: defaultModelRef.provider,
			allowPluginNormalization,
			aliasIndex
		})?.ref : void 0;
		const storedModelRef = resolveStoredModelOverride({
			loadSessionEntry: (sessionKey) => {
				const agentId = resolveSessionAgentId({
					sessionKey,
					config: params.cfg,
					fallbackAgentId: params.sessionAgentId
				});
				const storePath = resolveSessionStorePathCore(params.cfg.session?.store, { agentId });
				return loadSessionEntryReadOnly({
					agentId,
					storePath,
					sessionKey,
					readConsistency: "latest",
					clone: false
				});
			},
			sessionEntry: params.entry,
			sessionStore: params.sessionStore,
			sessionKey: params.sessionKey,
			parentSessionKey,
			defaultProvider: defaultModelRef.provider
		});
		const storedModelCandidate = storedModelRef ? {
			provider: storedModelRef.provider ?? defaultModelRef.provider,
			model: storedModelRef.model
		} : void 0;
		const turnModelCandidate = params.turnModelOverride ? resolveModelRefFromString({
			raw: params.turnModelOverride,
			cfg: params.cfg,
			agentId: params.sessionAgentId,
			defaultProvider: defaultModelRef.provider,
			allowPluginNormalization,
			aliasIndex
		})?.ref : void 0;
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
/** Synthetic and chat turns must share messageToolPolicyHash to reuse CLI sessions (#121485). */
function resolveSessionStableReplyMode(params) {
	const { cfg, ctx, sessionEntry } = params;
	const chatType = normalizeChatType(ctx.ChatType) ?? normalizeChatType(sessionEntry?.chatType) ?? void 0;
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
/** Shared by dispatch and synthetic turns; sender denials apply only to the individual turn. */
function resolveStableMessageToolAvailability(params) {
	const { cfg, ctx, sessionEntry } = params;
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
	return resolveReplyMessageToolAvailability({
		...params,
		groupPolicy,
		prefersMessageToolDelivery: true
	});
}
/** Applies the same profile, account, group, and delegation layers to every reply turn. */
function resolveReplyMessageToolAvailability(params) {
	const { cfg, groupPolicy } = params;
	const { globalPolicy, globalProviderPolicy, agentPolicy, agentProviderPolicy, profile, providerProfile, profileAlsoAllow, providerProfileAlsoAllow } = resolveEffectiveToolPolicy({
		config: cfg,
		sessionKey: params.sessionKey,
		agentId: params.sessionAgentId
	});
	const profileAlsoAllowed = params.prefersMessageToolDelivery ? ["message"] : [];
	const profilePolicy = mergeAlsoAllowPolicy(resolveCoreToolProfilePolicy(profile), [...profileAlsoAllow ?? [], ...profileAlsoAllowed]);
	const providerProfilePolicy = mergeAlsoAllowPolicy(resolveCoreToolProfilePolicy(providerProfile), [...providerProfileAlsoAllow ?? [], ...profileAlsoAllowed]);
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
export { resolveTurnModelOverride as a, createShouldEmitVerboseProgress as i, resolveSessionStableReplyMode as n, resolveVisibleRepliesPolicy as o, resolveStableMessageToolAvailability as r, resolveReplyMessageToolAvailability as t };
