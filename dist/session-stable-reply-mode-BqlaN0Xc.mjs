import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { t as formatErrorMessage } from "./errors-DPfGDWk1.mjs";
import { a as sessionChanges } from "./session-row-changes-vFaNnKNM.mjs";
import { d as resolvePluginMetadataSnapshotAsync } from "./plugin-metadata-snapshot-DET-4y9k.mjs";
import { c as resolveSessionStorePathCore } from "./paths-YgcBNLgG.mjs";
import { t as normalizeChatType } from "./chat-type-qwvaeaJu.mjs";
import { h as resolveSessionAgentId } from "./agent-scope-DXrnO3F4.mjs";
import { s as resolveCoreToolProfilePolicy } from "./tool-catalog-DGlfxTaj.mjs";
import { o as isToolAllowedByPolicies } from "./tool-policy-match--5jlhAPZ.mjs";
import { l as mergeAlsoAllowPolicy } from "./tool-policy-14GRhbFd.mjs";
import { i as buildModelAliasIndex, y as resolveModelRefFromString } from "./model-selection-shared-CVU_V2PQ.mjs";
import { t as resolveDefaultModelForAgent } from "./model-selection-config-CrboVKXT.mjs";
import { f as normalizeVerboseLevel } from "./thinking.shared-Be8dhC75.mjs";
import "./message-channel-constants-B3vfipkP.mjs";
import "./message-channel-DmAdWHmL.mjs";
import { t as resolveGroupSessionKey } from "./group-qLatmSbQ.mjs";
import { n as sessionDeliveryChannel, r as sessionDeliveryOrigin, t as deliveryContextFromSession } from "./delivery-context.read-CR06zOJ4.mjs";
import { r as resolveSqliteSessionKey } from "./session-accessor.sqlite-scope-helpers-XTtpZpWK.mjs";
import { l as readPreparedSessionEntryChange } from "./session-accessor.sqlite-entry-cache-publication-state-4Z0giEC3.mjs";
import { g as sessionChangeAffectsStoredRow, h as prepareSessionRowPublicationScope } from "./session-actor-replica-D_j2y4I5.mjs";
import { i as readSessionEntryReadOnlyInWorker } from "./session-entry-read-runtime-CgqUrGct.mjs";
import { R as withPreparedSessionCapabilityRead } from "./session-accessor.sqlite-entry-store-B3Lv6xes.mjs";
import { h as resolveSessionPinnedHarnessId } from "./agent-harness-session-key-zbrcLVpT.mjs";
import "./model-selection-DdQ-ffuG.mjs";
import "./thinking-BCNoGfZ5.mjs";
import { i as resolveSessionRuntimeOverrideForProvider } from "./session-runtime-compat-BQN27lQg.mjs";
import { r as resolveStoredModelOverrideAsync } from "./stored-model-overrides-RKQxlZXm.mjs";
import { i as logVerbose } from "./globals-XVSoVbNQ.mjs";
import { a as isNativeCommandTurn, c as resolveCommandTurnContext } from "./command-turn-context-TJGbDzsZ.mjs";
import { s as resolveSubagentCapabilityStore, t as isSubagentEnvelopeSession } from "./subagent-capabilities-l3WVTf-e.mjs";
import { a as resolveSubagentToolPolicyForSession, i as resolveInheritedToolPolicyForSession, n as resolveEffectiveToolPolicy, r as resolveGroupToolPolicy } from "./agent-tools.policy-t04F-r_I.mjs";
import { n as resolveAgentHarnessDeliveryDefaults } from "./selection-decision-CRh-vMBN.mjs";
import { t as resolveChannelModelOverride } from "./model-overrides-DCHjkmdI.mjs";
import { i as resolveSourceReplyDeliveryMode } from "./source-reply-delivery-mode-CrUQzco9.mjs";
import { t as resolveOriginMessageProvider } from "./origin-routing-BwhrEsoP.mjs";
//#region src/auto-reply/reply/dispatch-from-config.harness-defaults.ts
function createShouldEmitVerboseProgress(params) {
	let runVerbosity;
	let explicitLevel = normalizeVerboseLevel(params.initialExplicitLevel ?? "");
	let release = () => {};
	if (params.agentId && params.storePath && params.sessionKey) {
		const sessionKey = resolveSqliteSessionKey(params.sessionKey, params.agentId);
		const scope = {
			...prepareSessionRowPublicationScope([params.storePath]),
			agentId: params.agentId,
			sessionKeys: [sessionKey]
		};
		release = sessionChanges.subscribeFacts((change) => {
			if (!sessionChangeAffectsStoredRow(change, scope)) return;
			const committed = readPreparedSessionEntryChange(change, sessionKey);
			if (committed?.entry) explicitLevel = normalizeVerboseLevel(committed.entry.verboseLevel ?? "");
			else if ("facts" in change && change.facts?.kind === "removed") explicitLevel = void 0;
		});
	}
	const resolveLevel = () => runVerbosity?.verboseLevelOverride ?? explicitLevel ?? runVerbosity?.resolvedVerboseLevel ?? normalizeVerboseLevel(params.fallbackLevel) ?? "off";
	const shouldEmitAsync = async (full) => {
		params.assertCurrent?.();
		const level = resolveLevel();
		return full ? level === "full" : level !== "off";
	};
	return {
		release,
		noteRunVerbosity: (settings) => {
			runVerbosity = settings;
		},
		shouldEmit: () => resolveLevel() !== "off",
		shouldEmitFull: () => resolveLevel() === "full",
		shouldEmitAsync: () => shouldEmitAsync(false),
		shouldEmitFullAsync: () => shouldEmitAsync(true)
	};
}
function resolveTurnModelOverride(replyOptions) {
	return replyOptions?.isHeartbeat === true ? normalizeOptionalString(replyOptions.heartbeatModelOverride) : void 0;
}
/**
* Resolves the configured visible-replies mode plus the guarded harness
* default. One owner for dispatch and synthetic-turn binding facts: both must
* derive the same session-stable delivery mode or CLI session bindings
* ping-pong across turn kinds (#121485).
*/
async function resolveVisibleRepliesPolicy(params) {
	const isGroup = params.chatType === "group" || params.chatType === "channel";
	const configuredVisibleReplies = isGroup ? params.cfg.messages?.groupChat?.visibleReplies ?? params.cfg.messages?.visibleReplies : params.cfg.messages?.visibleReplies;
	return {
		configuredVisibleReplies,
		harnessDefaultVisibleReplies: configuredVisibleReplies === void 0 && !isGroup ? await resolveHarnessSourceVisibleRepliesDefault(params) : void 0
	};
}
async function resolveHarnessSourceVisibleRepliesDefault(params) {
	if (isNativeCommandTurn(resolveCommandTurnContext(params.ctx))) return;
	try {
		const allowPluginNormalization = params.cfg.plugins?.enabled !== false;
		const metadataSnapshot = allowPluginNormalization ? params.metadataSnapshot ?? await resolvePluginMetadataSnapshotAsync({
			config: params.cfg,
			allowWorkspaceScopedCurrent: true
		}) : null;
		const modelContext = {
			cfg: params.cfg,
			agentId: params.sessionAgentId,
			allowPluginNormalization,
			manifestPlugins: metadataSnapshot ?? []
		};
		const defaultModelRef = resolveDefaultModelForAgent(modelContext);
		const selectionContext = {
			...modelContext,
			defaultProvider: defaultModelRef.provider
		};
		const aliasIndex = buildModelAliasIndex(selectionContext);
		const resolveModelCandidate = (raw) => resolveModelRefFromString({
			...selectionContext,
			raw,
			aliasIndex
		})?.ref;
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
		const channelModelCandidate = channelModelOverride ? resolveModelCandidate(channelModelOverride.model) : void 0;
		const storedModelRef = await resolveStoredModelOverrideAsync({
			loadSessionEntry: (sessionKey) => {
				const agentId = resolveSessionAgentId({
					sessionKey,
					config: params.cfg,
					fallbackAgentId: params.sessionAgentId
				});
				const storePath = resolveSessionStorePathCore(params.cfg.session?.store, { agentId });
				return readSessionEntryReadOnlyInWorker({
					agentId,
					storePath,
					sessionKey,
					readConsistency: "latest"
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
		const turnModelCandidate = params.turnModelOverride ? resolveModelCandidate(params.turnModelOverride) : void 0;
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
async function resolveSessionStableReplyMode(params) {
	const { cfg, ctx, sessionEntry } = params;
	const chatType = normalizeChatType(ctx.ChatType) ?? normalizeChatType(sessionEntry?.chatType) ?? void 0;
	const stableReplyContext = {
		CommandAuthorized: false,
		ChatType: chatType,
		Provider: normalizeOptionalString(ctx.Provider) ?? sessionDeliveryOrigin(sessionEntry)?.provider ?? "webchat",
		Surface: normalizeOptionalString(ctx.Surface) ?? sessionDeliveryChannel(sessionEntry),
		ExplicitDeliverRoute: ctx.ExplicitDeliverRoute
	};
	const { harnessDefaultVisibleReplies } = await resolveVisibleRepliesPolicy({
		cfg,
		chatType,
		ctx,
		entry: sessionEntry,
		sessionAgentId: params.sessionAgentId,
		sessionKey: params.sessionKey,
		sessionStore: params.sessionStore,
		turnModelOverride: params.turnModelOverride,
		metadataSnapshot: params.metadataSnapshot
	});
	const candidateMode = resolveSourceReplyDeliveryMode({
		cfg,
		ctx: stableReplyContext,
		defaultVisibleReplies: harnessDefaultVisibleReplies
	});
	if (candidateMode !== "message_tool_only") return candidateMode;
	return await withPreparedSessionCapabilityRead(() => resolveStableMessageToolAvailability(params)) ? candidateMode : "automatic";
}
/** Shared by dispatch and synthetic turns; sender denials apply only to the individual turn. */
function resolveStableMessageToolAvailability(params) {
	const { cfg, ctx, sessionEntry } = params;
	const groupPolicy = resolveGroupToolPolicy({
		config: cfg,
		sessionKey: params.sessionKey,
		messageProvider: resolveOriginMessageProvider({
			originatingChannel: ctx.OriginatingChannel ?? sessionDeliveryChannel(sessionEntry),
			provider: normalizeOptionalString(ctx.Provider ?? ctx.Surface) ?? sessionDeliveryOrigin(sessionEntry)?.provider
		}),
		groupId: resolveGroupSessionKey(ctx)?.id ?? sessionEntry?.groupId,
		groupChannel: normalizeOptionalString(ctx.GroupChannel) ?? normalizeOptionalString(ctx.GroupSubject) ?? normalizeOptionalString(sessionEntry?.groupChannel) ?? normalizeOptionalString(sessionEntry?.subject),
		groupSpace: normalizeOptionalString(ctx.GroupSpace),
		accountId: ctx.AccountId ?? deliveryContextFromSession(sessionEntry)?.accountId
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
	const resolveProfile = (profileId, alsoAllow) => mergeAlsoAllowPolicy(resolveCoreToolProfilePolicy(profileId), [...alsoAllow ?? [], ...profileAlsoAllowed]);
	const profilePolicy = resolveProfile(profile, profileAlsoAllow);
	const providerProfilePolicy = resolveProfile(providerProfile, providerProfileAlsoAllow);
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
