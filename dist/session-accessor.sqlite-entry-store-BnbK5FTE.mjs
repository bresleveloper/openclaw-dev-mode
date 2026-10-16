import { c as normalizeOptionalLowercaseString, l as normalizeOptionalString, s as normalizeNullableString } from "./string-coerce-1VuiLaaR.mjs";
import { s as asFiniteNumber } from "./number-coercion-CuVhdCBs.mjs";
import { t as createDeferredCore } from "./deferred-D0La5CRk.mjs";
import { a as resolveGlobalSingleton, r as resolveGlobalMap } from "./global-singleton-0m-JziJW.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { n as safeParseJsonRecord } from "./json-coercion-pfKbZnCJ.mjs";
import { y as uniqueStrings } from "./string-normalization-CECOqf64.mjs";
import { a as getNodeSqliteKysely, c as prepareSqliteQuerySync, i as executeSqliteQueryTakeFirstSync, n as createSqliteQueryCache, o as iterateSqliteQuerySync, r as executeSqliteQuerySync, u as sqliteStringSet } from "./kysely-sync-K7ftY-g4.mjs";
import { n as getAdmittedSqliteSchemaFacts } from "./sqlite-schema-facts-CG0Tk84j.mjs";
import { n as assertExistingDatabaseIdentity } from "./sqlite-worker-identity-KSR14F6C.mjs";
import { r as getChildLogger } from "./logger-Mnn26Jj7.mjs";
import { a as createSqliteLifecycleAggregateError } from "./sqlite-lifecycle-errors-DuOygjcn.mjs";
import { i as tableExists } from "./openclaw-state-db-schema-helpers-BlZefrPy.mjs";
import { c as resolveOpenClawStateSqlitePath, r as resolveDatabasePath } from "./openclaw-state-db.paths-DfifnSGp.mjs";
import { v as registerOpenClawStateDatabaseLifecycleListener } from "./openclaw-state-db-cache-BKCnj4of.mjs";
import { M as ensureSessionPendingInputsSchema, j as ensureSessionInputCompletionsSchema } from "./openclaw-agent-db-validation-cache-_HDeZNQr.mjs";
import { i as ensureOpenClawAgentProgressCardSchemaInTransaction } from "./openclaw-agent-progress-card-schema-CFYelX0N.mjs";
import { n as createSqliteWorkerOperationAdmission } from "./sqlite-worker-operation-admission-cNGSH5v0.mjs";
import { r as cloneEnvWithPlatformSemantics } from "./config-env-vars-DjPHKieF.mjs";
import { t as executeExistingOpenClawStateRead } from "./openclaw-state-db-readonly-CC57AD_q.mjs";
import { r as captureOpenClawStateWorkerContext } from "./openclaw-state-worker-context-DRG_I6tz.mjs";
import { r as isIncognitoSessionKey } from "./session-key-CmZ4o9-l.mjs";
import { M as parseAgentSessionKey } from "./session-key-C09ow4h0.mjs";
import { r as normalizeOptionalAccountId } from "./account-id-DbRsdayc.mjs";
import { l as resolveSessionStorePathCore } from "./paths-dpReqUI8.mjs";
import { a as runOpenClawStateWorkerOperation, n as executeOpenClawStateWorker } from "./openclaw-state-worker-store-DCVYVtaO.mjs";
import { n as getPluginRegistryState } from "./runtime-state-Cd-Ga9cg.mjs";
import { a as getPluginRuntimeGatewayRequestScope, c as withPluginRuntimeGatewayRequestScope } from "./gateway-request-scope-BSmCVVpP.mjs";
import { n as sessionChanges } from "./session-row-changes-BcJIdta8.mjs";
import { a as capturePluginLifecycleAuthority } from "./registry-lifecycle-Dekhrk9Y.mjs";
import { t as getPluginRuntimeGenerationRegistry } from "./generation-state-C1yPL1Zl.mjs";
import { t as normalizeAnyChannelId } from "./registry-normalize-BvpWSO2L.mjs";
import "./generation-scope-BNE7YdYW.mjs";
import { r as isInternalNonDeliveryChannel } from "./message-channel-constants-B3vfipkP.mjs";
import { n as normalizeMessageChannel } from "./message-channel-core-CqBAHB04.mjs";
import "./message-channel-j-k-Nup3.mjs";
import { t as normalizeChatType } from "./chat-type-D-T98NfH.mjs";
import { t as hasValidSessionEntryIdentity } from "./session-entry-json-CtwFM7Hi.mjs";
import { n as normalizeConversationPeerId, t as buildConversationRef } from "./conversation-ref-BU3wU9j-.mjs";
import { y as ensureSessionParticipantsSchema } from "./openclaw-agent-db-schema-helpers-BxlojGn2.mjs";
import { c as deferOpenClawAgentPostCommitPublication } from "./openclaw-agent-db-lifecycle-BJiYtXuW.mjs";
import { s as openOpenClawAgentDatabase, u as runOpenClawAgentWriteTransaction } from "./openclaw-agent-db-DBug3LUA.mjs";
import { a as writeSessionEntrySnapshots, i as splitSessionEntrySnapshots } from "./session-entry-snapshots-DO3oGsuC.mjs";
import { n as assertSessionEntryCurrentAdmission } from "./session-entry-current-admission-Cvdu1qxp.mjs";
import { a as mergeDeliveryContext, c as normalizeSessionDeliveryState, n as deliveryContextKey, s as normalizeDeliveryContext, t as deliveryContextFromChannelRoute } from "./delivery-context.shared-PF5njaoI.mjs";
import { n as supportsOpenClawAgentDatabaseExecution, t as captureOpenClawAgentDatabaseExecution } from "./openclaw-agent-execution-CaPKglUL.mjs";
import { i as sessionDeliveryRoute, n as sessionDeliveryChannel, r as sessionDeliveryOrigin, t as deliveryContextFromSession } from "./delivery-context.read-CR06zOJ4.mjs";
import { a as normalizeStoreSessionKey, o as resolveDeliveryProvenCanonicalSessionKey } from "./store-entry-Bb_svqyv.mjs";
import { i as toDatabaseOptions, t as getSessionKysely } from "./session-accessor.sqlite-scope-helpers-DOK3pvYX.mjs";
import { p as runExclusiveSqliteSessionWrite } from "./session-accessor.sqlite-scope-CdpbxR_m.mjs";
import { t as hasSqliteSessionOwnerColumns } from "./session-accessor.sqlite-owner-projection-EwCluh1i.mjs";
import { l as mergeParticipantAggregate } from "./internal-session-key-CPayZwJR.mjs";
import { a as stripRuntimeOnlySessionSkillsFields, d as normalizeSessionConversationLink, i as projectCanonicalSessionEntryShape } from "./store-entry-shape-BzuAi3ao.mjs";
import { n as normalizeStatus, r as parseSessionEntryJson } from "./session-accessor.sqlite-status-zTXzk4Sy.mjs";
import { C as advanceSessionEntryMaintenanceAgeFact, I as sessionSharingEntriesEqual, c as trackSessionEntryCacheWrite, r as publishSessionEntryCacheInvalidation } from "./session-accessor.sqlite-entry-cache-nS4OEr3G.mjs";
import { g as canonicalSessionKeyMigrationRequiredError, n as assertCanonicalSessionKeyWrite, t as assertCanonicalSessionEntryLineageWrite } from "./session-canonical-key-D1TSJMmX.mjs";
import { a as readExactSessionEntryRow, d as readSessionEntryTargetRow, l as readSessionEntryRow, u as readSessionEntryRowScan } from "./session-accessor.sqlite-entry-read-CWTZjXLR.mjs";
import { o as preserveCreationStamp } from "./session-entry-provenance-Bfs2J1E7.mjs";
import "./session-accessor.sqlite-entry-inventory-DQ3Ihq0l.mjs";
import { a as retainLegacyAcpMigrationSourcesForEntry, o as hasLegacyAcpMigrationProvenanceColumn, t as copyLegacyAcpMigrationSourcesForRepair } from "./session-accessor.sqlite-acp-provenance-tjrzB-wk.mjs";
import { t as normalizeInternalTurnContext } from "./internal-turn-source-BUiNIWiw.mjs";
import { t as resolveConversationLabel } from "./conversation-label-CEU3TqmF.mjs";
import { a as serializeStoredConversationRouteContext, i as refreshStoredConversationRouteContext, n as parseConversationRouteContext, t as conversationRouteContextFromMsgContext } from "./conversation-route-context-ulGSQNwr.mjs";
import { n as getLoadedChannelPlugin } from "./registry-DOE8N7Jo.mjs";
import { r as resolveGroupSessionKey, t as buildGroupDisplayName } from "./group-DiW6xNkZ.mjs";
import "./plugins-Z9_SzFi0.mjs";
import { g as runExclusiveSessionLifecycleMutation, p as isCompetingSessionWorkAdmissionActive } from "./session-lifecycle-admission-GoxISURZ.mjs";
import { n as preparePersonalGitHubSessionReceiptDeletion } from "./github-personal-publication-lifecycle-BnuNz0yU.mjs";
import { d as readSessionPendingInputByKey, i as deleteSessionPendingInputs, o as isFinalInputCompletion } from "./session-accessor.sqlite-pending-inputs-DtDOOibA.mjs";
import { r as collectSessionStateIdsForEntry } from "./session-accessor.sqlite-references-DaTkiOgv.mjs";
import { t as certifyCanonicalSessionValidationRow } from "./session-canonical-validation-RtyogOdc.mjs";
import path from "node:path";
import { AsyncLocalStorage } from "node:async_hooks";
import fs from "node:fs/promises";
import { isDeepStrictEqual } from "node:util";
import { createHash, randomUUID } from "node:crypto";
//#region src/config/sessions/metadata.ts
function hasExternalOriginChange(existing, next) {
	const nextProvider = next?.provider;
	return nextProvider != null && nextProvider !== "webchat" && !isInternalNonDeliveryChannel(nextProvider) && (!existing || existing.provider != null && nextProvider !== existing.provider || existing.surface != null && next?.surface != null && next.surface !== existing.surface || existing.accountId != null && next?.accountId != null && next.accountId !== existing.accountId);
}
const mergeSessionOrigin = (existing, next) => {
	if (!existing && !next) return;
	const merged = existing ? { ...existing } : {};
	if (existing != null && hasExternalOriginChange(existing, next)) {
		delete merged.nativeChannelId;
		delete merged.nativeDirectUserId;
		delete merged.avatar;
		delete merged.accountId;
		delete merged.threadId;
	}
	const mergeField = (field, value) => {
		if (value) merged[field] = value;
	};
	for (const field of [
		"label",
		"provider",
		"surface",
		"chatType",
		"from",
		"to",
		"nativeChannelId",
		"nativeDirectUserId",
		"avatar",
		"accountId"
	]) mergeField(field, next?.[field]);
	if (next?.threadId != null && next.threadId !== "") merged.threadId = next.threadId;
	return Object.keys(merged).length > 0 ? merged : void 0;
};
/** Derives session origin metadata from an inbound message context. */
function deriveSessionOrigin(ctx, opts) {
	if (opts?.skipSystemEventOrigin && ctx.InternalTurnSource !== void 0) return;
	const providerRaw = typeof ctx.OriginatingChannel === "string" && ctx.OriginatingChannel || ctx.Surface || ctx.Provider;
	return mergeSessionOrigin(void 0, {
		label: normalizeOptionalString(resolveConversationLabel(ctx)),
		provider: normalizeMessageChannel(providerRaw),
		surface: normalizeOptionalLowercaseString(ctx.Surface),
		chatType: normalizeChatType(ctx.ChatType) ?? void 0,
		from: normalizeOptionalString(ctx.From),
		to: normalizeOptionalString(typeof ctx.OriginatingTo === "string" ? ctx.OriginatingTo : ctx.To),
		nativeChannelId: normalizeOptionalString(ctx.NativeChannelId),
		nativeDirectUserId: normalizeOptionalString(ctx.NativeDirectUserId),
		avatar: normalizeOptionalString(ctx.ConversationAvatar),
		accountId: normalizeOptionalString(ctx.AccountId),
		threadId: ctx.MessageThreadId ?? void 0
	});
}
function deriveGroupSessionPatch(params) {
	const resolution = params.groupResolution ?? resolveGroupSessionKey(params.ctx);
	if (!resolution?.channel) return null;
	const channel = resolution.channel;
	const subject = normalizeOptionalString(params.ctx.GroupSubject);
	const topicName = normalizeOptionalString(params.ctx.TopicName);
	const space = params.ctx.GroupSpace?.trim();
	const explicitChannel = params.ctx.GroupChannel?.trim();
	const subjectLooksChannel = Boolean(subject?.startsWith("#"));
	const normalizedChannel = subjectLooksChannel && resolution.chatType !== "channel" ? normalizeAnyChannelId(channel) : null;
	const isChannelProvider = Boolean(normalizedChannel && getLoadedChannelPlugin(normalizedChannel)?.capabilities.chatTypes.includes("channel"));
	const nextGroupChannel = explicitChannel ?? (subjectLooksChannel && subject && (resolution.chatType === "channel" || isChannelProvider) ? subject : void 0);
	const nextSubject = nextGroupChannel ? void 0 : subject;
	const patch = {
		chatType: resolution.chatType ?? "group",
		groupId: resolution.id
	};
	if (nextSubject) {
		patch.subject = nextSubject;
		patch.groupChannel = void 0;
	}
	if (nextGroupChannel) {
		patch.groupChannel = nextGroupChannel;
		patch.subject = void 0;
	}
	if (space) patch.space = space;
	if (topicName) patch.topicName = topicName;
	const displayName = buildGroupDisplayName({
		provider: channel,
		subject: nextSubject ?? (nextGroupChannel ? void 0 : params.existing?.subject),
		topicName: topicName ?? params.existing?.topicName,
		groupChannel: nextGroupChannel ?? (nextSubject ? void 0 : params.existing?.groupChannel),
		space: space ?? params.existing?.space,
		id: resolution.id,
		key: params.sessionKey
	});
	if (displayName) patch.displayName = displayName;
	return patch;
}
function deriveSessionMetaPatch(params) {
	const groupPatch = deriveGroupSessionPatch(params);
	const origin = deriveSessionOrigin(params.ctx, { skipSystemEventOrigin: params.skipSystemEventOrigin });
	const conversationLink = !params.existing?.conversationLink && params.ctx.InternalTurnSource === void 0 ? normalizeSessionConversationLink(params.ctx.ConversationLink) : void 0;
	if (!groupPatch && !origin && !conversationLink) return null;
	const existingOrigin = sessionDeliveryOrigin(params.existing);
	const nextProvider = origin?.provider;
	const nextOwnsExternalRoute = Boolean(nextProvider && nextProvider !== "webchat" && !isInternalNonDeliveryChannel(nextProvider));
	const sourceChannel = normalizeMessageChannel(params.ctx.Provider ?? params.ctx.Surface ?? params.ctx.OriginatingChannel);
	const internalTurn = params.ctx.InternalTurnSource !== void 0 || sourceChannel === "webchat" || sourceChannel != null && isInternalNonDeliveryChannel(sourceChannel);
	if (existingOrigin && internalTurn) {
		const existingContext = normalizeDeliveryContext({
			channel: existingOrigin.provider,
			to: existingOrigin.to,
			accountId: existingOrigin.accountId,
			threadId: existingOrigin.threadId
		});
		const nextContext = mergeDeliveryContext({
			channel: nextProvider,
			to: origin?.to,
			accountId: origin?.accountId,
			threadId: origin?.threadId
		}, existingContext);
		if (!nextOwnsExternalRoute || existingContext && deliveryContextKey(nextContext) === deliveryContextKey(existingContext)) return null;
	}
	const patch = groupPatch ? { ...groupPatch } : {};
	if (conversationLink) patch.conversationLink = conversationLink;
	const mergedOrigin = mergeSessionOrigin(existingOrigin, origin);
	if (mergedOrigin) {
		if (!patch.chatType && mergedOrigin.chatType) patch.chatType = mergedOrigin.chatType;
		const existingRoute = sessionDeliveryRoute(params.existing);
		const existingRouteAccountId = existingRoute?.accountId ?? deliveryContextFromSession(params.existing)?.accountId;
		const freshRouteOwnsNextProvider = params.preserveExistingDeliveryRoute === true && nextProvider != null && existingRoute?.channel === nextProvider && (origin?.accountId == null || existingRouteAccountId === origin.accountId);
		const deliveryIdentityChanged = Boolean(nextProvider) && !freshRouteOwnsNextProvider && hasExternalOriginChange(existingOrigin, origin);
		patch.delivery = normalizeSessionDeliveryState({
			route: deliveryIdentityChanged ? void 0 : sessionDeliveryRoute(params.existing),
			context: deliveryIdentityChanged ? {
				channel: mergedOrigin.provider,
				to: mergedOrigin.to,
				accountId: mergedOrigin.accountId,
				threadId: mergedOrigin.threadId
			} : deliveryContextFromSession(params.existing),
			origin: mergedOrigin
		});
	}
	return Object.keys(patch).length > 0 ? patch : null;
}
function withoutThread(identity) {
	if (!identity || identity.threadId == null) return identity;
	const next = { ...identity };
	delete next.threadId;
	return next;
}
/**
* Derives the last-route/delivery patch for an inbound routing update. Route
* updates must not refresh activity timestamps; idle/daily reset evaluation
* relies on updatedAt from actual session turns (#49515). Shared by the file
* store and the SQLite accessor so both backends apply one routing policy.
*/
function deriveLastRoutePatch(params) {
	const { channel, to, accountId, threadId, ctx, existing } = params;
	const explicitContext = normalizeDeliveryContext(params.deliveryContext);
	const inlineContext = normalizeDeliveryContext({
		channel,
		to,
		accountId,
		threadId
	});
	const routeContext = deliveryContextFromChannelRoute(params.route);
	const mergedInput = mergeDeliveryContext(routeContext, mergeDeliveryContext(explicitContext, inlineContext));
	const explicitDeliveryContext = params.deliveryContext;
	const explicitThreadValue = (explicitDeliveryContext != null && Object.hasOwn(explicitDeliveryContext, "threadId") ? explicitDeliveryContext.threadId : void 0) ?? (threadId != null && threadId !== "" ? threadId : void 0);
	const clearThreadFromFallback = Boolean(routeContext?.channel || routeContext?.to || explicitContext?.channel || explicitContext?.to || inlineContext?.channel || inlineContext?.to) && explicitThreadValue == null;
	const fallbackContext = clearThreadFromFallback ? withoutThread(deliveryContextFromSession(existing)) : deliveryContextFromSession(existing);
	const existingOrigin = sessionDeliveryOrigin(existing);
	const fallbackOrigin = clearThreadFromFallback ? withoutThread(existingOrigin) : existingOrigin;
	const delivery = normalizeSessionDeliveryState({
		route: params.route,
		context: mergeDeliveryContext(mergedInput, fallbackContext),
		origin: fallbackOrigin
	});
	const nextEntry = existing ? {
		...existing,
		delivery
	} : { delivery };
	const metaPatch = ctx ? deriveSessionMetaPatch({
		ctx,
		sessionKey: params.sessionKey,
		existing: nextEntry,
		groupResolution: params.groupResolution,
		preserveExistingDeliveryRoute: routeContext != null
	}) : null;
	const basePatch = { delivery };
	return metaPatch ? {
		...basePatch,
		...metaPatch
	} : basePatch;
}
//#endregion
//#region src/config/sessions/conversation-identity.ts
function normalizeThreadId(value) {
	if (typeof value === "number" && Number.isFinite(value)) return String(value);
	return normalizeOptionalString(value);
}
function normalizeKind(value) {
	return normalizeChatType(typeof value === "string" ? value : void 0) ?? "direct";
}
function resolvePairedOriginPeerId(params) {
	if (params.kind !== "direct") return;
	const origin = sessionDeliveryOrigin(params.entry);
	const originFrom = normalizeOptionalString(origin?.from);
	const originTo = normalizeOptionalString(origin?.to);
	const originChannel = normalizeOptionalLowercaseString(origin?.provider);
	const deliveryChannel = normalizeOptionalLowercaseString(params.deliveryContext?.channel);
	if (!originFrom || originTo !== params.deliveryTarget || !originChannel || originChannel !== deliveryChannel || normalizeChatType(origin?.chatType) !== params.kind || (normalizeOptionalAccountId(origin?.accountId) ?? "default") !== (normalizeOptionalAccountId(params.deliveryContext?.accountId) ?? "default") || normalizeThreadId(origin?.threadId) !== normalizeThreadId(params.deliveryContext?.threadId)) return;
	return originFrom;
}
/** Builds one stable transport address from authoritative channel route facts. */
function buildConversationIdentity(params) {
	const channel = normalizeOptionalLowercaseString(params.channel);
	const rawPeerId = normalizeOptionalString(params.peerId);
	if (!channel || !rawPeerId) return null;
	const peerId = normalizeConversationPeerId(channel, rawPeerId);
	if (!peerId) return null;
	const deliveryTarget = normalizeOptionalString(params.deliveryTarget);
	if (!deliveryTarget) return null;
	const accountId = normalizeOptionalAccountId(params.accountId) ?? "default";
	const rawParent = normalizeOptionalString(params.parentConversationRef);
	const parentConversationRef = rawParent ? rawParent.startsWith("conv_") ? rawParent : buildConversationRef({
		channel,
		accountId,
		kind: params.kind,
		peerId: normalizeConversationPeerId(channel, rawParent)
	}) : void 0;
	const threadId = normalizeThreadId(params.threadId);
	const nativeChannelId = normalizeOptionalString(params.nativeChannelId);
	const nativeDirectUserId = normalizeOptionalString(params.nativeDirectUserId);
	const label = normalizeOptionalString(params.label);
	return {
		conversationRef: buildConversationRef({
			channel,
			accountId,
			kind: params.kind,
			peerId,
			parentConversationRef,
			threadId
		}),
		channel,
		accountId,
		kind: params.kind,
		peerId,
		deliveryTarget,
		...parentConversationRef ? { parentConversationRef } : {},
		...threadId ? { threadId } : {},
		...nativeChannelId ? { nativeChannelId } : {},
		...nativeDirectUserId ? { nativeDirectUserId } : {},
		...label ? { label } : {},
		...params.metadata ? { metadata: params.metadata } : {}
	};
}
/** Derives a transport address from the canonical route snapshot persisted on a session. */
function conversationIdentityFromSessionEntry(entry, routeContext) {
	const deliveryContext = deliveryContextFromSession(entry);
	const origin = sessionDeliveryOrigin(entry);
	const kind = normalizeKind(entry.chatType);
	const routeTarget = normalizeOptionalString(deliveryContext?.to);
	const deliveryTarget = routeTarget ?? (kind === "direct" ? normalizeOptionalString(origin?.from) : void 0);
	const routeOwnsTarget = Boolean(routeTarget);
	const channel = routeOwnsTarget ? deliveryContext?.channel : normalizeOptionalString(origin?.provider);
	const pairedOriginPeerId = routeTarget ? resolvePairedOriginPeerId({
		entry,
		deliveryContext,
		deliveryTarget: routeTarget,
		kind
	}) : void 0;
	return buildConversationIdentity({
		channel,
		accountId: routeOwnsTarget ? deliveryContext?.accountId : origin?.accountId,
		kind,
		peerId: routeContext?.peerId ?? pairedOriginPeerId ?? deliveryTarget,
		deliveryTarget,
		threadId: routeOwnsTarget ? deliveryContext?.threadId : origin?.threadId,
		nativeChannelId: origin?.nativeChannelId,
		nativeDirectUserId: origin?.nativeDirectUserId,
		label: entry.displayName ?? entry.label
	});
}
/** Derives the same stable address from live inbound channel facts. */
function conversationIdentityFromMsgContext(params) {
	normalizeInternalTurnContext(params.ctx);
	const route = deriveSessionOrigin(params.ctx);
	const explicitDeliveryContext = normalizeDeliveryContext(params.deliveryContext);
	const routeDeliveryContext = normalizeDeliveryContext({
		channel: route?.provider,
		to: route?.to,
		accountId: route?.accountId,
		threadId: route?.threadId
	});
	const deliveryContext = mergeDeliveryContext(explicitDeliveryContext, routeDeliveryContext);
	const groupResolution = params.groupResolution ?? resolveGroupSessionKey(params.ctx);
	const routeContext = conversationRouteContextFromMsgContext(params.ctx);
	const kind = groupResolution?.chatType ?? normalizeKind(params.ctx.ChatType);
	const directIngressTarget = kind === "direct" ? normalizeOptionalString(params.ctx.From) : void 0;
	const useDirectIngressTarget = Boolean(directIngressTarget && !explicitDeliveryContext?.to);
	const deliveryTarget = useDirectIngressTarget ? directIngressTarget : normalizeOptionalString(deliveryContext?.to) ?? normalizeOptionalString(params.ctx.OriginatingTo) ?? normalizeOptionalString(params.ctx.To);
	return buildConversationIdentity({
		channel: useDirectIngressTarget ? normalizeOptionalString(route?.provider) ?? normalizeOptionalString(params.ctx.OriginatingChannel) ?? normalizeOptionalString(params.ctx.Provider) : deliveryContext?.channel ?? groupResolution?.channel ?? normalizeOptionalString(route?.provider) ?? normalizeOptionalString(params.ctx.OriginatingChannel) ?? normalizeOptionalString(params.ctx.Provider),
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
//#region src/config/sessions/session-accessor.sqlite-conversation.ts
/** Shared-main DMs multiplex peers through one context; every other routed session has one primary. */
function prepareSessionConversation(params) {
	const routeContext = params.routeContext === null ? null : params.routeContext === void 0 ? void 0 : parseConversationRouteContext(params.routeContext);
	if (params.routeContext !== void 0 && params.routeContext !== null && !routeContext) throw new Error("Invalid conversation route context");
	const identity = conversationIdentityFromSessionEntry(params.entry, routeContext);
	if (!identity) return null;
	return {
		identity,
		role: params.sessionScope === "shared-main" && identity.kind === "direct" ? "participant" : "primary",
		...routeContext !== void 0 ? { routeContext } : {}
	};
}
/** Keeps a previously observed route peer when a generic session writer has no route facts. */
function preserveSessionConversationIdentity(params) {
	if (params.sessionIds.length === 0) return params.identity;
	const db = getSessionKysely(params.database.db);
	const row = executeSqliteQuerySync(params.database.db, db.selectFrom("session_conversations as sc").innerJoin("conversations as c", "c.conversation_id", "sc.conversation_id").select([
		"c.conversation_id",
		"c.channel",
		"c.account_id",
		"c.kind",
		"c.peer_id",
		"c.delivery_target",
		"c.parent_conversation_id",
		"c.thread_id",
		"c.native_channel_id",
		"c.native_direct_user_id",
		"c.label",
		"c.metadata_json"
	]).where("sc.session_id", "in", params.sessionIds).where("c.channel", "=", params.identity.channel).where("c.account_id", "=", params.identity.accountId).where("c.kind", "=", params.identity.kind).where("c.delivery_target", "=", params.identity.deliveryTarget).where("sc.role", "in", ["primary", "participant"]).where("c.thread_id", params.identity.threadId ? "=" : "is", params.identity.threadId ?? null).orderBy("sc.last_seen_at", "desc").limit(1)).rows[0];
	const metadata = row?.metadata_json ? safeParseJsonRecord(row.metadata_json) : void 0;
	return row ? {
		conversationRef: row.conversation_id,
		channel: row.channel,
		accountId: row.account_id,
		kind: params.identity.kind,
		peerId: row.peer_id,
		deliveryTarget: row.delivery_target,
		...row.parent_conversation_id ? { parentConversationRef: row.parent_conversation_id } : {},
		...row.thread_id ? { threadId: row.thread_id } : {},
		...row.native_channel_id ? { nativeChannelId: row.native_channel_id } : {},
		...row.native_direct_user_id ? { nativeDirectUserId: row.native_direct_user_id } : {},
		...params.identity.label ?? row.label ? { label: params.identity.label ?? row.label } : {},
		...metadata ? { metadata } : {}
	} : params.identity;
}
function prepareSessionConversationForWrite(params) {
	const conversation = prepareSessionConversation(params);
	if (!conversation || params.routeContext !== void 0) return conversation;
	conversation.identity = preserveSessionConversationIdentity({
		database: params.database,
		identity: conversation.identity,
		sessionIds: [params.entry.sessionId, params.previousEntry?.sessionId].filter((sessionId) => Boolean(sessionId))
	});
	return conversation;
}
/** Upserts the address before the session row so its primary-conversation FK is always valid. */
function upsertConversationIdentity(database, identity, updatedAt) {
	const db = getSessionKysely(database.db);
	const identityColumns = () => ({
		channel: identity.channel,
		account_id: identity.accountId,
		kind: identity.kind,
		peer_id: identity.peerId,
		delivery_target: identity.deliveryTarget,
		parent_conversation_id: identity.parentConversationRef ?? null,
		thread_id: identity.threadId ?? null,
		native_channel_id: identity.nativeChannelId ?? null,
		native_direct_user_id: identity.nativeDirectUserId ?? null,
		label: identity.label ?? null,
		metadata_json: identity.metadata ? JSON.stringify(identity.metadata) : null
	});
	executeSqliteQuerySync(database.db, db.insertInto("conversations").values({
		conversation_id: identity.conversationRef,
		...identityColumns(),
		created_at: updatedAt,
		updated_at: updatedAt
	}).onConflict((conflict) => conflict.column("conversation_id").doUpdateSet({
		...identityColumns(),
		updated_at: updatedAt
	})));
}
/** Links one external address to its local context without conflating the two identities. */
function linkSessionConversation(params) {
	const { database, sessionId, conversation, updatedAt } = params;
	const db = getSessionKysely(database.db);
	const readAssociation = (candidateSessionId) => executeSqliteQuerySync(database.db, db.selectFrom("session_conversations").select(["last_seen_at", "route_context_json"]).where("session_id", "=", candidateSessionId).where("conversation_id", "=", conversation.identity.conversationRef).orderBy("last_seen_at", "desc").limit(1)).rows[0];
	const existingAssociation = readAssociation(sessionId) ?? (params.previousSessionId && params.previousSessionId !== sessionId ? readAssociation(params.previousSessionId) : void 0);
	const routeContextJson = conversation.routeContext === void 0 ? existingAssociation ? refreshStoredConversationRouteContext(existingAssociation.route_context_json, existingAssociation.last_seen_at, updatedAt) : null : serializeStoredConversationRouteContext(conversation.routeContext, updatedAt);
	if (conversation.role === "primary") {
		const stalePrimaryRows = executeSqliteQuerySync(database.db, db.selectFrom("session_conversations").select([
			"conversation_id",
			"first_seen_at",
			"last_seen_at",
			"route_context_json"
		]).where("session_id", "=", sessionId).where("role", "=", "primary").where("conversation_id", "!=", conversation.identity.conversationRef)).rows;
		if (stalePrimaryRows.length > 0) {
			executeSqliteQuerySync(database.db, db.insertInto("session_conversations").values(stalePrimaryRows.map((row) => ({
				session_id: sessionId,
				conversation_id: row.conversation_id,
				role: "related",
				route_context_json: refreshStoredConversationRouteContext(row.route_context_json, row.last_seen_at, updatedAt),
				first_seen_at: row.first_seen_at,
				last_seen_at: updatedAt
			}))).onConflict((conflict) => conflict.columns([
				"session_id",
				"conversation_id",
				"role"
			]).doUpdateSet((eb) => ({
				route_context_json: eb.ref("excluded.route_context_json"),
				last_seen_at: updatedAt
			}))));
			executeSqliteQuerySync(database.db, db.deleteFrom("session_conversations").where("session_id", "=", sessionId).where("role", "=", "primary").where("conversation_id", "!=", conversation.identity.conversationRef));
		}
	}
	executeSqliteQuerySync(database.db, db.deleteFrom("session_conversations").where("session_id", "=", sessionId).where("conversation_id", "=", conversation.identity.conversationRef).where("role", "!=", conversation.role));
	executeSqliteQuerySync(database.db, db.insertInto("session_conversations").values({
		session_id: sessionId,
		conversation_id: conversation.identity.conversationRef,
		role: conversation.role,
		route_context_json: routeContextJson,
		first_seen_at: updatedAt,
		last_seen_at: updatedAt
	}).onConflict((conflict) => conflict.columns([
		"session_id",
		"conversation_id",
		"role"
	]).doUpdateSet({
		route_context_json: routeContextJson,
		last_seen_at: updatedAt
	})));
}
//#endregion
//#region src/agents/harness/native-session/deletion-participant.ts
const participants = resolveGlobalSingleton(Symbol.for("openclaw.nativeSessionDeletionParticipants"), () => /* @__PURE__ */ new WeakMap());
function bindNativeSessionDeletionParticipant(mutation, participant) {
	participants.set(mutation, participant);
	return mutation;
}
function getNativeSessionDeletionParticipant(mutation) {
	return participants.get(mutation);
}
/** Preserve the audited participant when a harness adds live authority and commit-only facts. */
function wrapNativeSessionDeletionMutation(mutation, hooks) {
	const wrapped = {
		commit() {
			hooks.assertCurrent();
			mutation.commit();
			hooks.committed();
		},
		rollback() {
			hooks.assertCurrent();
			mutation.rollback();
			hooks.rolledBack();
		}
	};
	const participant = participants.get(mutation);
	if (participant) {
		participant.retain(hooks);
		participants.set(wrapped, {
			...participant,
			assertCurrent() {
				participant.assertCurrent();
				hooks.assertCurrent();
			},
			settle(outcome, error) {
				participant.settle(outcome, error);
				if (outcome === "committed") hooks.committed();
				if (outcome === "rolled-back") hooks.rolledBack();
			},
			get unknown() {
				return participant.unknown;
			}
		});
	}
	return wrapped;
}
/** ACP has no reversible storage effect; its finalizer becomes eligible only after A COMMIT. */
function createNativeSessionCommitFinalizer(mutation) {
	const custody = /* @__PURE__ */ new Set();
	return bindNativeSessionDeletionParticipant(mutation, {
		assertCurrent() {},
		renewalPending: () => false,
		async joinRenewal() {},
		quiesce() {},
		retain: (owner) => {
			custody.add(owner);
		},
		unknown: false,
		settle(outcome) {
			this.unknown = outcome === "unknown";
			if (outcome === "committed") mutation.commit();
			if (outcome === "rolled-back") mutation.rollback();
		}
	});
}
function isNativeSessionDeletionUnresolved(mutation) {
	return participants.get(mutation)?.unknown === true;
}
//#endregion
//#region src/agents/harness/session-deletion.ts
/** Reuse the registered harness owner; deletion is not a second plugin registration surface. */
function captureAgentHarnessSessionDeletions() {
	return captureAgentHarnessSessionMutations("withSessionDeletion");
}
function captureAgentHarnessSessionContextResets() {
	return captureAgentHarnessSessionMutations("withSessionContextReset");
}
function captureAgentHarnessSessionMutations(hook) {
	const scopedRegistry = () => getPluginRuntimeGenerationRegistry() ?? getPluginRuntimeGatewayRequestScope()?.pluginRegistry;
	const scoped = scopedRegistry();
	const registry = scoped ?? getPluginRegistryState()?.activeRegistry;
	const owners = registry?.agentHarnesses.flatMap((registration) => {
		const prepare = registration.harness[hook];
		if (!prepare) return [];
		const record = registry.plugins.find((plugin) => plugin.id === registration.pluginId);
		return [{
			registration,
			prepare,
			current: record || registration.pluginId === "core" ? capturePluginLifecycleAuthority(registry, record, { scopedRuntime: scoped === registry }) : void 0
		}];
	}) ?? [];
	return owners.length === 0 ? void 0 : async (targets, run) => {
		const pending = targets.flatMap((target) => owners.filter(({ registration }) => hook === "withSessionContextReset" || !target.agentHarnessId || target.agentHarnessId === registration.harness.id).map((owner) => ({
			owner,
			target
		})));
		const prepared = /* @__PURE__ */ new Map();
		const prepareNext = async (index) => {
			const candidate = pending[index];
			if (!candidate) return await run(prepared);
			const { owner, target } = candidate;
			let active = true;
			const assertCurrent = () => {
				target.initialization?.assertRollbackCurrent();
				if (!active || !owner.current?.() || scoped && scopedRegistry() !== scoped || !registry?.agentHarnesses.includes(owner.registration) || owner.registration.harness[hook] !== owner.prepare) throw new Error(`Session mutation harness owner changed: ${owner.registration.harness.id}`);
			};
			try {
				assertCurrent();
				const result = await owner.prepare({
					...target,
					assertCurrent
				}, async (mutation) => {
					assertCurrent();
					const mutations = prepared.get(target.sessionKey) ?? [];
					mutations.push(Object.assign(wrapNativeSessionDeletionMutation(mutation, {
						assertCurrent,
						committed() {},
						rolledBack() {}
					}), { assertCurrent }));
					prepared.set(target.sessionKey, mutations);
					return await prepareNext(index + 1);
				});
				assertCurrent();
				return result;
			} finally {
				active = false;
			}
		};
		return await prepareNext(0);
	};
}
//#endregion
//#region src/sessions/session-initialization.ts
const { rollbackOwner, sources } = resolveGlobalSingleton(Symbol.for("openclaw.sessionInitialization"), () => ({
	rollbackOwner: new AsyncLocalStorage(),
	sources: new AsyncLocalStorage()
}));
/** The message-cut owner supplies its exact source incarnation, never plugin-provided fields. */
async function withSessionInitializationSource(source, run) {
	let active = true;
	try {
		const assertActive = (assert) => {
			if (!active) throw new Error("Session initialization source is closed");
			assert();
		};
		const current = Object.freeze({
			assertCurrent: () => assertActive(source.assertCurrent),
			assertRollbackCurrent: () => assertActive(source.assertRollbackCurrent)
		});
		return await sources.run(current, () => run(current.assertCurrent));
	} finally {
		active = false;
	}
}
function captureSessionInitializationOwner(harnessId) {
	const source = sources.getStore();
	const scopedRegistry = () => getPluginRuntimeGenerationRegistry() ?? getPluginRuntimeGatewayRequestScope()?.pluginRegistry;
	const scoped = scopedRegistry();
	const registry = scoped ?? getPluginRegistryState()?.activeRegistry;
	const registration = registry?.agentHarnesses.find((candidate) => candidate.harness.id === harnessId);
	const record = registry?.plugins.find((candidate) => candidate.id === registration?.pluginId);
	const registryCurrent = registry && capturePluginLifecycleAuthority(registry, record, { scopedRuntime: scoped === registry });
	const harness = registration?.harness;
	const deletion = harness?.withSessionDeletion;
	const assertRegistryCurrent = () => {
		if (registry && (!registryCurrent?.() || scoped && scopedRegistry() !== scoped || !scoped && getPluginRegistryState()?.activeRegistry !== registry || registration && (!registry.agentHarnesses.includes(registration) || registration.harness !== harness || harness?.withSessionDeletion !== deletion))) throw new Error("Session initialization registry owner changed");
	};
	return {
		assertCurrent() {
			source?.assertCurrent();
			assertRegistryCurrent();
		},
		assertRollbackCurrent() {
			source?.assertRollbackCurrent();
			assertRegistryCurrent();
		}
	};
}
function createSessionInitialization(target, assertOwner, preparation) {
	const registry = getPluginRuntimeGenerationRegistry() ?? getPluginRuntimeGatewayRequestScope()?.pluginRegistry ?? getPluginRegistryState()?.activeRegistry ?? void 0;
	let active = true;
	let deleted = false;
	const assertLive = (phase) => {
		if (!active) throw new Error("Session initialization is closed");
		assertOwner(phase, deleted);
	};
	const owner = {
		target,
		handle: Object.freeze({
			assertCurrent() {
				assertLive("forward");
				if (deleted || rollbackOwner.getStore() === owner) throw new Error("Session initialization is rolling back");
			},
			assertRollbackCurrent() {
				assertLive("rollback");
				if (rollbackOwner.getStore() !== owner) throw new Error("Session initialization rollback is not active");
			},
			prepareNativeToolPolicy: async (model) => {
				owner.handle.assertCurrent();
				const { provider, runtimeProvider = provider, id } = model;
				if ([
					provider,
					runtimeProvider,
					id
				].some((value) => typeof value !== "string" || !value.trim() || Buffer.byteLength(value) > 256)) throw new Error("Session policy preparation requires a bounded native model selection");
				const [{ resolvePluginHarnessToolPolicies }, { resolveSandboxRuntimeStatus }, { resolveWebSearchToolPolicy }] = await Promise.all([
					import("./execution-environment-DD6AWrhq.mjs"),
					import("./runtime-status-CTmqd-Rz.mjs"),
					import("./web-search-tool-policy-DJ68Fs06.mjs")
				]);
				owner.handle.assertCurrent();
				const child = {
					config: preparation.config,
					agentId: preparation.agentId,
					sessionKey: target.sessionKey,
					sessionId: target.sessionId
				};
				if (preparation.entry.execNode || resolveSandboxRuntimeStatus({
					cfg: child.config,
					agentId: child.agentId,
					sessionKey: child.sessionKey
				}).sandboxed) throw new Error("Session creation cannot prepare an execution environment; fork from the original source instead.");
				const result = withPluginRuntimeGatewayRequestScope({
					isWebchatConnect: () => false,
					pluginRegistry: registry
				}, () => {
					if (resolvePluginHarnessToolPolicies({
						...child,
						provider: runtimeProvider,
						modelId: id
					}).toolPolicyRestricted) throw new Error("The child's native tool policy requires run-owned preparation. Fork an original imported message instead.");
					return { webSearchAllowed: resolveWebSearchToolPolicy({
						...child,
						modelProvider: provider,
						modelId: id,
						webSearchEnabled: child.config.tools?.web?.search?.enabled
					}).persistentAllowed };
				});
				owner.handle.assertCurrent();
				return result;
			}
		}),
		committed: () => {
			deleted = true;
		}
	};
	return {
		handle: owner.handle,
		rollback: (run) => rollbackOwner.run(owner, run),
		close: () => {
			active = false;
		}
	};
}
function getSessionInitializationRollback(target) {
	const owner = rollbackOwner.getStore();
	if (!owner || owner.target.storePath !== target.storePath || owner.target.sessionKey !== target.sessionKey || owner.target.sessionId !== target.sessionId || owner.target.lifecycleRevision !== target.lifecycleRevision) return;
	owner.handle.assertRollbackCurrent();
	return owner.handle;
}
/** Called by the first deletion publication, only for a removal that crossed COMMIT. */
function commitSessionInitializationRollback(handle) {
	const owner = rollbackOwner.getStore();
	if (owner?.handle === handle) owner.committed();
}
//#endregion
//#region src/state/session-repository-workspaces.publication.ts
const stores = resolveGlobalMap(Symbol.for("openclaw.repositoryWorkspacePublications"), "close-and-restart");
registerOpenClawStateDatabaseLifecycleListener((event) => {
	if (event.kind !== "opened") {
		for (const [key, store] of stores) if (store.path === (event.identity?.canonicalPath ?? event.path)) stores.delete(key);
	}
});
function owner(admission) {
	admission.assertCurrent();
	let store = stores.get(admission.coordinationKey);
	if (!store) {
		store = {
			path: admission.identity.canonicalPath,
			rows: /* @__PURE__ */ new Map()
		};
		stores.set(admission.coordinationKey, store);
	}
	return store;
}
function rowFor(store, workspaceId) {
	let row = store.rows.get(workspaceId);
	if (!row) {
		row = {
			revision: {},
			value: void 0,
			pending: /* @__PURE__ */ new Set(),
			uncertain: false
		};
		store.rows.set(workspaceId, row);
	}
	return row;
}
function copy(workspace) {
	return workspace ? Object.freeze({ ...workspace }) : void 0;
}
/** Fence current-fact consumers before COMMIT and reopen them only after native settlement. */
function stageRepositoryWorkspacePublication(admission, result) {
	const store = owner(admission);
	const row = rowFor(store, result.workspaceId);
	const pending = createDeferredCore();
	const revision = {};
	row.revision = revision;
	row.pending.add(pending.promise);
	let settled = false;
	return { settle(committed, known) {
		if (settled) return;
		settled = true;
		if (stores.get(admission.coordinationKey) === store && row.revision === revision) {
			if (committed) {
				row.value = copy(result.workspace);
				if (!result.workspace) store.rows.delete(result.workspaceId);
			}
			row.uncertain = !known;
		}
		row.pending.delete(pending.promise);
		pending.resolve();
	} };
}
async function prepareRepositoryWorkspaceRead(admission, workspaceId, read) {
	const store = owner(admission);
	const row = rowFor(store, workspaceId);
	const assertSource = () => {
		admission.assertCurrent();
		if (stores.get(admission.coordinationKey) !== store) throw new Error("Repository workspace database owner changed");
	};
	for (;;) {
		if (row.pending.size) await Promise.all(row.pending);
		assertSource();
		const revision = row.revision;
		const workspace = await read();
		assertSource();
		if (revision !== row.revision || row.pending.size) continue;
		row.value = copy(workspace);
		row.uncertain = false;
		if (!workspace && store.rows.get(workspaceId) === row) store.rows.delete(workspaceId);
		return {
			workspace: row.value,
			assertSourceCurrent: assertSource,
			current() {
				assertSource();
				if (row.pending.size || row.uncertain) throw new Error("Repository workspace mutation has not settled; refresh this session");
				return row.value;
			}
		};
	}
}
//#endregion
//#region src/state/session-repository-workspaces.ts
function isWorkspace(value) {
	return isRecord(value) && [
		"workspaceId",
		"agentId",
		"sessionKey",
		"url",
		"branch"
	].every((key) => typeof value[key] === "string") && [
		"requestedRef",
		"baseCommit",
		"baseManifestHash",
		"checkpointRef",
		"manifestHash"
	].every((key) => value[key] === null || typeof value[key] === "string") && typeof value.runSetupScript === "boolean" && [
		"revision",
		"createdAtMs",
		"updatedAtMs"
	].every((key) => typeof value[key] === "number");
}
function isMutationResult(value) {
	return isRecord(value) && typeof value.workspaceId === "string" && typeof value.changed === "boolean" && (value.workspace === void 0 || isWorkspace(value.workspace)) && (value.owner === void 0 || isRecord(value.owner) && typeof value.owner.agentId === "string" && typeof value.owner.sessionKey === "string");
}
/** Deletion preparation must not reopen the shared database on the caller thread. */
async function findSessionRepositoryWorkspaces(owners, options) {
	const reply = await executeExistingOpenClawStateRead(options, {
		type: "sessionRepositoryWorkspaces.find",
		owners: owners.map(({ agentId, sessionKey }) => ({
			agentId,
			sessionKey
		}))
	});
	if (!reply) return [];
	if (!reply.ok || reply.type !== "sessionRepositoryWorkspaces.find") throw new Error("Unexpected session repository workspace lookup result");
	return reply.workspaces;
}
function createSessionRepositoryWorkspaceStore(options = {}) {
	const env = options.env && cloneEnvWithPlatformSemantics(options.env);
	const databasePath = resolveDatabasePath({
		path: options.path,
		env
	});
	const now = options.now;
	const context = () => captureOpenClawStateWorkerContext({
		path: databasePath,
		env
	});
	async function mutate(command, assertCurrent, control = {}) {
		const { afterCommit, sessionEntryCurrent } = control;
		const captured = context();
		let admission;
		let prepared;
		let publication;
		let publicationSettled;
		let granted = false;
		let cleanupSourceIdentity;
		let finalized = afterCommit === void 0;
		const check = () => {
			captured.admission.assertCurrent();
			assertCurrent();
		};
		try {
			return await runOpenClawStateWorkerOperation(captured, async (scope) => {
				let result;
				try {
					result = await scope.execute(command);
				} catch (error) {
					await publicationSettled;
					if (!prepared || !admission?.committed || !isDeepStrictEqual(admission.committed.facts, prepared)) throw error;
					result = prepared;
				}
				await publicationSettled;
				if (afterCommit) {
					if (!granted || !cleanupSourceIdentity || !prepared || !admission?.committed || !isDeepStrictEqual(admission.committed.facts, prepared)) throw new Error("Repository workspace cleanup has no committed source");
					assertExistingDatabaseIdentity(databasePath, cleanupSourceIdentity);
					await afterCommit();
					finalized = true;
				}
				return result;
			}, {
				assertCurrent: check,
				createAdmission: (operation) => {
					let stage = "transaction";
					admission = createSqliteWorkerOperationAdmission((request, grant) => {
						check();
						const admitted = assertSessionEntryCurrentAdmission(request, sessionEntryCurrent);
						if (admitted.stage === "transaction" && stage === "transaction") {
							stage = "commit";
							grant();
							return;
						}
						if (admitted.stage !== "commit" || stage !== "commit" || !isMutationResult(admitted.facts)) throw new Error("Repository workspace mutation has no admitted commit result");
						stage = "complete";
						prepared = admitted.facts;
						if (afterCommit) {
							const identity = captured.admission.identity;
							assertExistingDatabaseIdentity(databasePath, identity.key);
							cleanupSourceIdentity = identity.key;
						}
						publication = stageRepositoryWorkspacePublication(captured.admission, prepared);
						granted = grant();
					});
					const acceptedAdmission = admission;
					publicationSettled = operation.settled.then((settlement) => {
						let committed = false;
						let known = false;
						try {
							const receipt = acceptedAdmission.committed;
							if (receipt) {
								if (!prepared || !isDeepStrictEqual(receipt.facts, prepared)) throw new Error("Repository workspace commit result changed during settlement");
								committed = true;
							}
							known = !granted || committed || settlement.kind === "completed";
						} finally {
							publication?.settle(committed, known);
						}
						if (committed && prepared?.changed && prepared.owner) {
							try {
								captured.admission.assertCurrent();
							} catch {
								return;
							}
							sessionChanges.emit(prepared.owner);
						}
					});
					publicationSettled.catch(() => void 0);
					return {
						admission,
						nativeLocations: [databasePath]
					};
				}
			});
		} catch (error) {
			if (finalized && prepared && admission?.committed && isDeepStrictEqual(admission.committed.facts, prepared)) return prepared;
			throw error;
		} finally {
			await publicationSettled;
		}
	}
	const requireWorkspace = (result) => {
		if (!result.workspace) throw new Error("Repository workspace mutation returned no workspace");
		return result.workspace;
	};
	const artifactPath = (workspaceId) => {
		if (!/^[a-f0-9-]{36}$/u.test(workspaceId)) throw new Error("Repository workspace id is invalid");
		return path.join(path.dirname(databasePath), "repository-workspaces", `${workspaceId}.git`);
	};
	return {
		path: databasePath,
		artifactPath,
		get(workspaceId) {
			return executeOpenClawStateWorker(context(), {
				type: "repositoryWorkspaces.get",
				input: { workspaceId }
			});
		},
		find(owner) {
			return executeOpenClawStateWorker(context(), {
				type: "repositoryWorkspaces.find",
				input: {
					agentId: owner.agentId,
					sessionKey: owner.sessionKey
				}
			});
		},
		prepare(workspaceId) {
			const captured = context();
			return prepareRepositoryWorkspaceRead(captured.admission, workspaceId, () => executeOpenClawStateWorker(captured, {
				type: "repositoryWorkspaces.get",
				input: { workspaceId }
			}));
		},
		async create(input) {
			return requireWorkspace(await mutate({
				type: "repositoryWorkspaces.create",
				input: {
					agentId: input.agentId,
					sessionKey: input.sessionKey,
					url: input.url,
					requestedRef: input.requestedRef,
					runSetupScript: input.runSetupScript,
					branch: input.branch,
					nowMs: now?.()
				}
			}, input.assertCurrent));
		},
		async bindBase(input) {
			return requireWorkspace(await mutate({
				type: "repositoryWorkspaces.bindBase",
				input: {
					workspaceId: input.workspaceId,
					expectedRevision: input.expectedRevision,
					baseCommit: input.baseCommit,
					baseManifestHash: input.baseManifestHash,
					nowMs: now?.()
				}
			}, input.assertCurrent));
		},
		async acceptCheckpoint(input) {
			return requireWorkspace(await mutate({
				type: "repositoryWorkspaces.acceptCheckpoint",
				input: {
					workspaceId: input.workspaceId,
					expectedRevision: input.expectedRevision,
					checkpointRef: input.checkpointRef,
					manifestHash: input.manifestHash,
					nowMs: now?.()
				}
			}, input.assertCurrent));
		},
		async delete(input) {
			const root = artifactPath(input.workspaceId);
			await mutate({
				type: "repositoryWorkspaces.delete",
				input: {
					workspaceId: input.workspaceId,
					sessionEntryCurrentSource: input.sessionEntryCurrent?.source
				}
			}, input.assertCurrent, {
				sessionEntryCurrent: input.sessionEntryCurrent,
				afterCommit: () => fs.rm(root, {
					recursive: true,
					force: true
				})
			});
		}
	};
}
/** Resolve on use so loading admission code does not open shared state. */
function getSessionRepositoryWorkspaceStore() {
	return createSessionRepositoryWorkspaceStore();
}
//#endregion
//#region src/config/sessions/session-accessor.sqlite-deletion.ts
const deletions = new AsyncLocalStorage();
const workerParticipant = new AsyncLocalStorage();
/** The executing owner supplies the typed precommit participant at the existing deletion edge. */
function withSqliteSessionDeletionWorkerParticipant(commit, run) {
	return workerParticipant.run(commit, run);
}
const transactionMutations = new AsyncLocalStorage();
/** Worker commits cannot carry parent-thread native-owner rollback closures. */
function hasPreparedNativeSessionDeletion() {
	const prepared = deletions.getStore();
	return prepared !== void 0 && [...prepared.values()].some((entry) => entry.mutations.length > 0 || entry.target.initialization !== void 0);
}
/** Opaque SDK mutations keep their native transaction; only owner-minted participants qualify. */
function captureNativeSessionWorkerDeletion(entries) {
	const captured = entries.map(({ sessionKey, entry }) => ({
		sessionKey,
		entry,
		prepared: deletions.getStore()?.get(sessionKey)
	}));
	if (!captured.some(({ prepared }) => prepared?.mutations.length || prepared?.target.initialization)) return;
	const participants = [];
	for (const { sessionKey, entry, prepared } of captured) {
		if (!prepared) return;
		for (const mutation of prepared.mutations) {
			const participant = getNativeSessionDeletionParticipant(mutation);
			if (!participant) return;
			participants.push({
				sessionKey,
				entry,
				participant
			});
		}
	}
	return {
		participants,
		assertCurrent() {
			for (const { prepared } of captured) prepared?.assertIdle();
		},
		committed() {
			for (const { prepared } of captured) if (prepared?.target.initialization) commitSessionInitializationRollback(prepared.target.initialization);
		}
	};
}
/** Keep ordinary updates serialized; release the writer for preparation or source custody. */
async function runPreparedSqliteSessionWrite(initialScope, prepare, operation, withCommit, prepareScope, scheduling = "foreground") {
	let scope = initialScope;
	const prepareWrite = async () => {
		if (prepareScope) {
			const preparedScope = await prepareScope();
			if (preparedScope.path !== scope.path) throw new Error("Session write preparation changed its reserved database path");
			scope = preparedScope;
		}
		const write = await prepare(scope);
		return scheduling === "worker" || write.deletedEntries.length || write.beforeCommit || withCommit ? { write } : { result: await write.commit() };
	};
	const prepared = scheduling === "worker" ? await prepareWrite() : await runExclusiveSqliteSessionWrite(scope, prepareWrite, operation);
	if (!prepared.write) return {
		deletedEntries: 0,
		result: prepared.result,
		scope
	};
	const write = prepared.write;
	const commit = async (assertCurrent) => {
		await write.beforeCommit?.();
		const runCommit = async (assertSourceCurrent) => {
			const commitHeld = async () => {
				const assertHeld = () => {
					assertCurrent?.();
					assertSourceCurrent?.();
				};
				assertHeld();
				return await write.commit(assertHeld);
			};
			return scheduling === "worker" && !hasPreparedNativeSessionDeletion() ? await commitHeld() : await runExclusiveSqliteSessionWrite(scope, commitHeld, operation);
		};
		return withCommit ? await withCommit(runCommit) : await runCommit();
	};
	const result = write.deletedEntries.length || write.beforeCommit ? await withSqliteSessionDeletions(scope, write.deletedEntries, commit) : await commit();
	return {
		deletedEntries: write.deletedEntries.length,
		result,
		scope
	};
}
/** Prepare owner leases before entering a physical writer or changing any transcript state. */
async function withSqliteSessionDeletions(scope, entries, run, options = {}) {
	return withSqliteSessionMutations(scope, entries, run, options);
}
/** A context cut retires the native generation without deleting the session or its artifacts. */
async function withSqliteSessionContextReset(scope, entry, run) {
	return withSqliteSessionMutations(scope, [entry], run, { contextReset: true });
}
async function withSqliteSessionMutations(scope, entries, run, options) {
	const targets = [...new Map(entries.filter(({ entry }) => entry.sessionId).map(({ sessionKey, entry }) => [sessionKey, {
		agentId: parseAgentSessionKey(sessionKey)?.agentId ?? scope.agentId,
		sessionKey,
		sessionId: entry.sessionId,
		...entry.lifecycleRevision ? { lifecycleRevision: entry.lifecycleRevision } : {},
		...entry.agentHarnessId ? { agentHarnessId: entry.agentHarnessId } : {},
		...options.contextReset && entry.previousSessionId ? { previousSessionId: entry.previousSessionId } : {}
	}])).values()].toSorted((a, b) => a.sessionKey.localeCompare(b.sessionKey));
	const ownerStorePath = scope.ownerStorePath ?? resolveSessionStorePathCore(void 0, {
		agentId: scope.agentId,
		env: scope.env
	});
	if (!options.contextReset) for (const target of targets) target.initialization = getSessionInitializationRollback({
		...target,
		storePath: ownerStorePath
	});
	const assertTargetIdle = (target) => {
		if (isCompetingSessionWorkAdmissionActive(ownerStorePath, [target.sessionKey, target.sessionId])) throw new Error(`Cannot mutate session while competing work is in flight for ${target.sessionKey}; retry after the run completes`);
	};
	targets.forEach(assertTargetIdle);
	const prepare = options.contextReset ? captureAgentHarnessSessionContextResets() : captureAgentHarnessSessionDeletions();
	const repositories = options.contextReset ? void 0 : createSessionRepositoryWorkspaceStore({
		path: resolveOpenClawStateSqlitePath(scope.env),
		env: scope.env
	});
	const repositorySource = repositories ? captureOpenClawStateWorkerContext({
		path: repositories.path,
		env: scope.env
	}) : void 0;
	const databaseOptions = toDatabaseOptions(scope);
	const execution = repositories && supportsOpenClawAgentDatabaseExecution(databaseOptions) ? captureOpenClawAgentDatabaseExecution(databaseOptions) : void 0;
	try {
		const repositoryWorkspaces = repositories ? await findSessionRepositoryWorkspaces(targets, {
			path: repositories.path,
			env: scope.env
		}) : [];
		const invoke = async (prepared) => {
			const currentReads = /* @__PURE__ */ new Map();
			const assertCurrent = () => {
				if (repositoryWorkspaces.length > 0) {
					repositorySource?.admission.assertCurrent();
					execution?.assertCurrent();
				}
				for (const read of currentReads.values()) read.current.assertSourceCurrent();
				targets.forEach(assertTargetIdle);
				for (const mutations of prepared.values()) mutations.forEach((mutation) => mutation.assertCurrent());
			};
			assertCurrent();
			if (execution && repositoryWorkspaces.length > 0) {
				const [{ captureSessionEntryCurrentRead }, { withSessionEntryReadOnlyInWorker }] = await Promise.all([import("./session-entry-current-runtime-CqZhpmIA.mjs"), import("./session-entry-read-runtime-DvU9RDm9.mjs")]);
				assertCurrent();
				for (const workspace of repositoryWorkspaces) {
					const readScope = {
						agentId: workspace.agentId,
						defaultAgentId: databaseOptions.agentId,
						storePath: scope.ownerStorePath ?? scope.path ?? ownerStorePath,
						sessionKey: workspace.sessionKey,
						env: scope.env
					};
					const current = await withSessionEntryReadOnlyInWorker(readScope, assertCurrent, async (read, owner) => {
						if (!read.ok) throw read.error;
						const captured = captureSessionEntryCurrentRead(readScope, owner);
						execution.assertCurrent();
						if (captured.kind !== "file" || captured.source.agentId !== execution.agentId || !owner.scope) throw new Error("Repository cleanup lost its original file-backed session owner");
						assertExistingDatabaseIdentity(execution.path, `file:${captured.source.databaseIdentity}`, captured.source.databaseBirthtime);
						return {
							current: captured,
							scope: {
								...owner.scope,
								projection: "full"
							}
						};
					});
					currentReads.set(workspace.workspaceId, {
						current: current.current,
						readPresent: async (assertSourceCurrent) => await withSessionEntryReadOnlyInWorker(current.scope, assertSourceCurrent, async (read, owner) => {
							if (!read.ok) throw read.error;
							const refreshed = captureSessionEntryCurrentRead(current.scope, owner);
							const original = current.current.source;
							if (refreshed.kind !== "file" || refreshed.source.agentId !== original.agentId || refreshed.source.path !== original.path || refreshed.source.databaseIdentity !== original.databaseIdentity || refreshed.source.databaseBirthtime !== original.databaseBirthtime || refreshed.source.sessionKey !== original.sessionKey) throw new Error("Repository cleanup session source changed before deletion");
							assertSourceCurrent();
							return read.value !== void 0;
						})
					});
				}
			}
			const receiptDeletions = /* @__PURE__ */ new Map();
			for (const workspace of repositoryWorkspaces) {
				const target = targets.find((candidate) => candidate.sessionKey === workspace.sessionKey);
				if (!target) throw new Error("Repository workspace deletion omitted its session target");
				receiptDeletions.set(workspace.workspaceId, await preparePersonalGitHubSessionReceiptDeletion({
					agentId: workspace.agentId,
					env: scope.env,
					generations: [{
						sessionKey: workspace.sessionKey,
						sessionId: target.sessionId,
						lifecycleRevision: target.lifecycleRevision ?? null
					}],
					assertCurrent
				}));
			}
			return await deletions.run(new Map(targets.map((target) => [target.sessionKey, {
				target,
				mutations: prepared.get(target.sessionKey) ?? [],
				assertIdle: () => assertTargetIdle(target),
				contextReset: options.contextReset
			}])), async () => {
				let active = true;
				const assertActive = () => {
					if (!active) throw new Error("Session mutation preparation is no longer active");
					assertCurrent();
				};
				try {
					return await run(assertCurrent, (checkedEntries) => {
						assertActive();
						return captureSqliteSessionDeletionSettlement(checkedEntries, assertActive);
					});
				} finally {
					active = false;
					for (const workspace of repositoryWorkspaces) {
						const currentRead = currentReads.get(workspace.workspaceId);
						const assertSourceCurrent = () => {
							if (execution && !currentRead) throw new Error("Repository cleanup omitted its prepared session source");
							repositorySource?.admission.assertCurrent();
							execution?.assertCurrent();
							currentRead?.current.assertSourceCurrent();
						};
						const currentEntry = () => readSessionEntryRow(openOpenClawAgentDatabase(toDatabaseOptions(scope)), workspace.sessionKey);
						assertSourceCurrent();
						if (currentRead ? await currentRead.readPresent(assertSourceCurrent) : currentEntry() !== void 0) continue;
						const sessionEntryCurrent = currentRead ? {
							source: currentRead.current.source,
							assertCurrent: (entry) => {
								assertSourceCurrent();
								if (entry !== void 0) throw new Error("Repository workspace session changed before deletion");
							}
						} : void 0;
						const assertSessionAbsent = () => {
							assertSourceCurrent();
							if (!currentRead && currentEntry()) throw new Error("Repository workspace session changed before deletion");
						};
						await receiptDeletions.get(workspace.workspaceId)(assertSessionAbsent, sessionEntryCurrent);
						await repositories?.delete({
							workspaceId: workspace.workspaceId,
							sessionEntryCurrent,
							assertCurrent: assertSessionAbsent
						});
					}
				}
			});
		};
		return await runExclusiveSessionLifecycleMutation("delete-prepare", {
			scope: ownerStorePath,
			identities: [...targets.flatMap((target) => [target.sessionKey, target.sessionId]), ...options.additionalIdentities ?? []],
			run: async () => prepare ? await prepare(targets, invoke) : await invoke(/* @__PURE__ */ new Map())
		});
	} finally {
		await execution?.release();
	}
}
/** Called only at the synchronous SQL edge, after the operation revalidates its row snapshot. */
function commitSqliteSessionDeletion(sessionKey, entry) {
	const workerCommit = workerParticipant.getStore();
	if (workerCommit) {
		workerCommit(sessionKey, entry);
		return;
	}
	const prepared = deletions.getStore()?.get(sessionKey);
	if (!prepared) {
		if (captureAgentHarnessSessionDeletions()) throw new Error(`Session deletion requires prepared harness ownership: ${sessionKey}`);
		return;
	}
	if (prepared.target.sessionId !== entry.sessionId || prepared.target.lifecycleRevision !== entry.lifecycleRevision || prepared.contextReset && prepared.target.previousSessionId !== entry.previousSessionId) throw new Error(`Session changed before deletion: ${sessionKey}`);
	prepared.assertIdle();
	const transaction = transactionMutations.getStore();
	if (!transaction) throw new Error(`Session deletion requires its synchronous transaction: ${sessionKey}`);
	for (const mutation of prepared.mutations) {
		transaction.rollback.push(mutation);
		mutation.commit();
	}
	if (prepared.target.initialization) transaction.initializations.add(prepared.target.initialization);
}
/** Retain host companions while their checked deletion commits in the worker. */
function captureSqliteSessionDeletionSettlement(entries, assertCurrent) {
	const captured = structuredClone(entries);
	for (const { sessionKey } of captured) if (!deletions.getStore()?.has(sessionKey)) throw new Error(`Session mutation target was not prepared: ${sessionKey}`);
	const runInOwner = AsyncLocalStorage.snapshot();
	const rollback = [];
	const initializations = /* @__PURE__ */ new Set();
	let entered = false;
	let settled = false;
	return {
		beforeCommit() {
			assertCurrent();
			if (entered || settled) throw new Error("Session deletion companions already entered settlement");
			entered = true;
			runInOwner(() => transactionMutations.run({
				rollback,
				initializations
			}, () => {
				for (const { sessionKey, entry } of captured) commitSqliteSessionDeletion(sessionKey, entry);
			}));
		},
		settle(outcome) {
			if (settled) throw new Error("Session deletion companions already settled");
			settled = true;
			runInOwner(() => {
				if (outcome === "committed") initializations.forEach(commitSessionInitializationRollback);
				else if (outcome === "rolled-back") {
					const failures = rollbackSessionDeletionCompanions(rollback);
					if (failures.length > 0) throw createSqliteLifecycleAggregateError(failures, "Session deletion rollback failed", failures[0]);
				}
			});
		}
	};
}
function rollbackSessionDeletionCompanions(mutations) {
	const failures = [];
	for (const mutation of mutations.toReversed()) try {
		mutation.rollback();
	} catch (error) {
		failures.push(error);
	}
	return failures;
}
/** Roll back companion state only if SQLite failed before COMMIT, never after publication. */
function runSqliteSessionDeletionTransaction(operation, options, transactionOptions) {
	if (!deletions.getStore() || transactionMutations.getStore()) return runOpenClawAgentWriteTransaction(operation, options, transactionOptions);
	const rollback = [];
	const initializations = /* @__PURE__ */ new Set();
	let committed = false;
	try {
		return transactionMutations.run({
			rollback,
			initializations
		}, () => runOpenClawAgentWriteTransaction((database) => {
			deferOpenClawAgentPostCommitPublication(database, () => {
				committed = true;
				initializations.forEach(commitSessionInitializationRollback);
			});
			return operation(database);
		}, options, transactionOptions));
	} catch (error) {
		const failures = [error];
		if (!committed) failures.push(...rollbackSessionDeletionCompanions(rollback));
		if (failures.length > 1) throw createSqliteLifecycleAggregateError(failures, "Session deletion rollback failed", error);
		throw error;
	}
}
//#endregion
//#region src/config/sessions/session-accessor.sqlite-entry-write-queries.ts
function prepareSessionEntryWriteQueries(database) {
	const db = getSessionKysely(database);
	const window = (retainOwner) => prepareSqliteQuerySync(database, (parameter) => db.insertInto("session_windows").values({
		session_id: parameter((row) => row.session_id),
		session_key: parameter((row) => row.session_key),
		reason: parameter((row) => row.reason),
		created_at: parameter((row) => row.created_at),
		updated_at: parameter((row) => row.updated_at),
		session_entry_provenance: parameter((row) => row.session_entry_provenance),
		acp_owned: parameter((row) => row.acp_owned),
		plugin_owner_id: parameter((row) => row.plugin_owner_id),
		hook_external_content_source: parameter((row) => row.hook_external_content_source),
		previous_session_id: parameter((row) => row.previous_session_id),
		session_scope: parameter((row) => row.session_scope),
		started_at: parameter((row) => row.started_at),
		ended_at: parameter((row) => row.ended_at),
		status: parameter((row) => row.status),
		chat_type: parameter((row) => row.chat_type),
		channel: parameter((row) => row.channel),
		account_id: parameter((row) => row.account_id),
		model_provider: parameter((row) => row.model_provider),
		model: parameter((row) => row.model),
		agent_harness_id: parameter((row) => row.agent_harness_id),
		parent_session_key: parameter((row) => row.parent_session_key),
		spawned_by: parameter((row) => row.spawned_by),
		display_name: parameter((row) => row.display_name),
		primary_conversation_id: parameter((row) => row.primary_conversation_id),
		transcript_observed_at: parameter((row) => row.transcript_observed_at)
	}).onConflict((conflict) => conflict.column("session_id").doUpdateSet((eb) => ({
		...retainOwner ? {} : { session_key: eb.ref("excluded.session_key") },
		previous_session_id: eb.ref("excluded.previous_session_id"),
		reason: eb.ref("excluded.reason"),
		session_scope: eb.ref("excluded.session_scope"),
		transcript_observed_at: eb.ref("excluded.transcript_observed_at"),
		session_entry_provenance: eb.ref("excluded.session_entry_provenance"),
		acp_owned: eb.ref("excluded.acp_owned"),
		plugin_owner_id: eb.ref("excluded.plugin_owner_id"),
		hook_external_content_source: eb.ref("excluded.hook_external_content_source"),
		updated_at: eb.ref("excluded.updated_at"),
		started_at: eb.ref("excluded.started_at"),
		ended_at: eb.ref("excluded.ended_at"),
		status: eb.ref("excluded.status"),
		chat_type: eb.ref("excluded.chat_type"),
		channel: eb.ref("excluded.channel"),
		account_id: eb.ref("excluded.account_id"),
		primary_conversation_id: eb.ref("excluded.primary_conversation_id"),
		model_provider: eb.ref("excluded.model_provider"),
		model: eb.ref("excluded.model"),
		agent_harness_id: eb.ref("excluded.agent_harness_id"),
		parent_session_key: eb.ref("excluded.parent_session_key"),
		spawned_by: eb.ref("excluded.spawned_by"),
		display_name: eb.ref("excluded.display_name")
	}))));
	return {
		node: prepareSqliteQuerySync(database, (parameter) => db.insertInto("session_nodes").values({
			session_key: parameter((row) => row.session_key),
			current_session_id: parameter((row) => row.current_session_id),
			entry_json: parameter((row) => row.entry_json),
			entry_valid: parameter((row) => row.entry_valid),
			updated_at: parameter((row) => row.updated_at),
			status: parameter((row) => row.status),
			created_at: parameter((row) => row.created_at),
			created_via: parameter((row) => row.created_via),
			created_actor_type: parameter((row) => row.created_actor_type),
			created_actor_id: parameter((row) => row.created_actor_id),
			project_id: parameter((row) => row.project_id),
			parent_session_key: parameter((row) => row.parent_session_key),
			spawned_by: parameter((row) => row.spawned_by),
			fork_source_session_key: parameter((row) => row.fork_source_session_key),
			fork_source_session_id: parameter((row) => row.fork_source_session_id),
			fork_source_entry_id: parameter((row) => row.fork_source_entry_id),
			label: parameter((row) => row.label),
			display_name: parameter((row) => row.display_name),
			category: parameter((row) => row.category),
			icon: parameter((row) => row.icon),
			pinned_at: parameter((row) => row.pinned_at),
			archived_at: parameter((row) => row.archived_at),
			last_read_at: parameter((row) => row.last_read_at),
			last_interaction_at: parameter((row) => row.last_interaction_at),
			last_activity_at: parameter((row) => row.last_activity_at)
		}).onConflict((conflict) => conflict.column("session_key").doUpdateSet((eb) => ({
			current_session_id: eb.ref("excluded.current_session_id"),
			entry_json: eb.ref("excluded.entry_json"),
			entry_valid: eb.ref("excluded.entry_valid"),
			updated_at: eb.ref("excluded.updated_at"),
			status: eb.ref("excluded.status"),
			created_at: eb.ref("excluded.created_at"),
			created_via: eb.ref("excluded.created_via"),
			created_actor_type: eb.ref("excluded.created_actor_type"),
			created_actor_id: eb.ref("excluded.created_actor_id"),
			project_id: eb.ref("excluded.project_id"),
			parent_session_key: eb.ref("excluded.parent_session_key"),
			spawned_by: eb.ref("excluded.spawned_by"),
			fork_source_session_key: eb.ref("excluded.fork_source_session_key"),
			fork_source_session_id: eb.ref("excluded.fork_source_session_id"),
			fork_source_entry_id: eb.ref("excluded.fork_source_entry_id"),
			label: eb.ref("excluded.label"),
			display_name: eb.ref("excluded.display_name"),
			category: eb.ref("excluded.category"),
			icon: eb.ref("excluded.icon"),
			pinned_at: eb.ref("excluded.pinned_at"),
			archived_at: eb.ref("excluded.archived_at"),
			last_read_at: eb.ref("excluded.last_read_at"),
			last_interaction_at: eb.ref("excluded.last_interaction_at"),
			last_activity_at: eb.ref("excluded.last_activity_at")
		})))),
		markValid: prepareSqliteQuerySync(database, (parameter) => db.updateTable("session_nodes").set({ entry_valid: 1 }).where("session_key", "=", parameter((key) => key))),
		claimWindow: window(false),
		retainWindow: window(true)
	};
}
const getSessionEntryWriteQueries = createSqliteQueryCache(prepareSessionEntryWriteQueries);
//#endregion
//#region src/config/sessions/session-accessor.sqlite-pending-inputs-repair.ts
/** Canonical repair preserves accepted text without transferring its old execution authority. */
function copySessionPendingInputsForRepair(source, destination, sourceKeys, canonicalKey) {
	if (!sourceKeys.length || !tableExists(source.db, "session_pending_inputs")) return;
	const db = getSessionKysely(destination.db);
	if (source.db === destination.db) {
		executeSqliteQuerySync(destination.db, db.updateTable("session_pending_inputs").set((eb) => ({
			session_key: canonicalKey,
			state: eb.case().when("state", "=", "cancelled").then("cancelled").else("interrupted").end()
		})).where("session_key", "in", sourceKeys));
		return;
	}
	const rows = iterateSqliteQuerySync(source.db, getSessionKysely(source.db).selectFrom("session_pending_inputs").selectAll().where("session_key", "in", sourceKeys).orderBy("seq", "asc"));
	let initialized = false;
	for (const row of rows) {
		if (!initialized) {
			ensureSessionPendingInputsSchema(destination.db);
			initialized = true;
		}
		const existing = readSessionPendingInputByKey(destination, {
			sessionKey: canonicalKey,
			sessionId: row.session_id
		}, row.idempotency_key);
		if (existing) {
			if (existing.request_hash !== row.request_hash || existing.message_json !== row.message_json || existing.run_id !== row.run_id || existing.consumed_event_id != null && row.consumed_event_id != null && existing.consumed_event_id !== row.consumed_event_id) throw new Error("Canonical repair found conflicting accepted inputs");
			executeSqliteQuerySync(destination.db, db.updateTable("session_pending_inputs").set({
				consumed_event_id: existing.consumed_event_id ?? row.consumed_event_id ?? null,
				state: existing.state === "cancelled" || row.state === "cancelled" ? "cancelled" : "interrupted"
			}).where("input_id", "=", existing.input_id));
			continue;
		}
		const { seq: _seq, ...record } = row;
		executeSqliteQuerySync(destination.db, db.insertInto("session_pending_inputs").values({
			...record,
			session_key: canonicalKey,
			state: row.state === "cancelled" ? "cancelled" : "interrupted"
		}));
	}
}
/** Transfer terminal facts without transferring the old admission's execution authority. */
function copySessionInputCompletionsForRepair(source, destination, sourceKeys, canonicalKey) {
	if (!sourceKeys.length || !tableExists(source.db, "session_input_completions")) return;
	const db = getSessionKysely(destination.db);
	if (source.db === destination.db) {
		executeSqliteQuerySync(destination.db, db.updateTable("session_input_completions").set({ session_key: canonicalKey }).where("session_key", "in", sourceKeys));
		return;
	}
	const rows = iterateSqliteQuerySync(source.db, getSessionKysely(source.db).selectFrom("session_input_completions").selectAll().where("session_key", "in", sourceKeys));
	let initialized = false;
	for (const row of rows) {
		if (!initialized) {
			ensureSessionInputCompletionsSchema(destination.db);
			initialized = true;
		}
		const existing = executeSqliteQueryTakeFirstSync(destination.db, db.selectFrom("session_input_completions").selectAll().where("session_id", "=", row.session_id).where("idempotency_key", "=", row.idempotency_key));
		if (existing) {
			if (existing.session_key !== canonicalKey || existing.run_id !== row.run_id || existing.request_hash !== row.request_hash) throw new Error("Canonical repair found conflicting input completions");
			const existingOutcome = JSON.parse(existing.outcome_json);
			if (isFinalInputCompletion(existingOutcome)) continue;
			const outcome = JSON.parse(row.outcome_json);
			if (!isFinalInputCompletion(outcome) && existing.completed_at >= row.completed_at) continue;
		}
		const canonical = {
			...row,
			session_key: canonicalKey
		};
		executeSqliteQuerySync(destination.db, db.insertInto("session_input_completions").values(canonical).onConflict((conflict) => conflict.columns(["session_id", "idempotency_key"]).doUpdateSet(canonical)));
	}
}
function readSessionInputArtifactRows(database, sessionId) {
	const db = getSessionKysely(database.db);
	return {
		pendingInputs: tableExists(database.db, "session_pending_inputs") ? iterateSqliteQuerySync(database.db, db.selectFrom("session_pending_inputs").selectAll().where("session_id", "=", sessionId).orderBy("seq")) : [],
		inputCompletions: tableExists(database.db, "session_input_completions") ? iterateSqliteQuerySync(database.db, db.selectFrom("session_input_completions").selectAll().where("session_id", "=", sessionId).orderBy("idempotency_key")) : []
	};
}
//#endregion
//#region src/config/sessions/session-accessor.sqlite-node-artifacts.ts
/** Logical-node facts survive history cleanup and are fenced at final entry deletion. */
function readSessionNodeArtifactFingerprint(database, sessionKey) {
	const db = getSessionKysely(database.db);
	const present = readSessionNodeArtifactTables(database);
	const fingerprint = createHash("sha256");
	const inventories = {
		board_tabs: db.selectFrom("board_tabs").selectAll().where("session_key", "=", sessionKey).orderBy("tab_id"),
		heartbeat_outcomes: db.selectFrom("heartbeat_outcomes").selectAll().where("session_key", "=", sessionKey),
		session_members: db.selectFrom("session_members").selectAll().where("session_key", "=", sessionKey).orderBy("identity_id"),
		session_participants: db.selectFrom("session_participants").selectAll().where("session_key", "=", sessionKey).orderBy("identity_namespace").orderBy("actor_id"),
		session_progress_cards: db.selectFrom("session_progress_cards").selectAll().where("session_key", "=", sessionKey),
		session_suggestions: db.selectFrom("session_suggestions").selectAll().where("session_key", "=", sessionKey).orderBy("state").orderBy("created_at").orderBy("id"),
		session_reactions: db.selectFrom("session_reactions").selectAll().where("session_key", "=", sessionKey).orderBy("session_id").orderBy("message_id").orderBy("emoji").orderBy("identity_id")
	};
	for (const [table, query] of Object.entries(inventories)) {
		fingerprint.update(table).update("\n");
		if (present.has(table)) for (const row of iterateSqliteQuerySync(database.db, query)) fingerprint.update(JSON.stringify(row)).update("\n");
	}
	fingerprint.update("board_widgets\n");
	if (present.has("board_widgets")) for (const { html, ...metadata } of iterateSqliteQuerySync(database.db, db.selectFrom("board_widgets").selectAll().where("session_key", "=", sessionKey).orderBy("name"))) {
		fingerprint.update(JSON.stringify(metadata)).update("\n");
		fingerprint.update(html === null ? "null\n" : `bytes:${html.byteLength}\n`);
		if (html !== null) fingerprint.update(html).update("\n");
	}
	const provenance = hasLegacyAcpMigrationProvenanceColumn(database.db) ? executeSqliteQueryTakeFirstSync(database.db, db.selectFrom("session_nodes").select("legacy_acp_migration_json").where("session_key", "=", sessionKey))?.legacy_acp_migration_json : void 0;
	return fingerprint.update("legacy_acp_migration_json\n").update(JSON.stringify(provenance ?? null)).digest("hex");
}
function clearSessionCollaborationForKey(database, sessionKey, options = {}) {
	const presentTables = readSessionNodeArtifactTables(database);
	const db = getSessionKysely(database.db);
	const tables = options.clearSuggestions === false ? ["session_members"] : [
		"session_members",
		"session_suggestions",
		"session_reactions"
	];
	for (const table of tables) if (presentTables.has(table)) executeSqliteQuerySync(database.db, db.deleteFrom(table).where("session_key", "=", sessionKey));
}
/** Copy logical-session artifacts into their canonical node within one agent store or across two. */
function copySessionNodeArtifactsForRepair(source, destination, sourceKeys, canonicalKey, options = {}) {
	const keys = [...new Set(sourceKeys)];
	if (keys.length === 0) return;
	copySessionPendingInputsForRepair(source, destination, keys, canonicalKey);
	copySessionInputCompletionsForRepair(source, destination, keys, canonicalKey);
	copyLegacyAcpMigrationSourcesForRepair(source, destination, keys, canonicalKey);
	const sourceDb = getSessionKysely(source.db);
	const destinationDb = getSessionKysely(destination.db);
	const sourceKeyReferences = new Set(keys.flatMap((key) => [key, key.trim()]));
	const sourceTables = readSessionNodeArtifactTables(source);
	let destinationTables = readSessionNodeArtifactTables(destination);
	if (options.includeParticipants !== false && sourceTables.has("session_participants") && !destinationTables.has("session_participants")) {
		ensureSessionParticipantsSchema(destination.db);
		destinationTables = readSessionNodeArtifactTables(destination);
	}
	if (sourceTables.has("session_progress_cards")) {
		const progressCards = executeSqliteQuerySync(source.db, sourceDb.selectFrom("session_progress_cards").selectAll().where("session_key", "in", keys)).rows;
		if (progressCards.length > 0 && !destinationTables.has("session_progress_cards")) {
			ensureOpenClawAgentProgressCardSchemaInTransaction(destination.db);
			destinationTables = readSessionNodeArtifactTables(destination);
		}
		for (const progressCard of progressCards) {
			const canonicalProgressCard = {
				...progressCard,
				session_key: canonicalKey
			};
			executeSqliteQuerySync(destination.db, destinationDb.insertInto("session_progress_cards").values(canonicalProgressCard).onConflict((conflict) => conflict.column("session_key").doUpdateSet(canonicalProgressCard).where((eb) => eb.or([eb("revision", "<", progressCard.revision), eb.and([eb("revision", "=", progressCard.revision), eb("updated_at", "<", progressCard.updated_at)])]))));
		}
	}
	if (sourceTables.has("board_tabs") && sourceTables.has("board_widgets") && destinationTables.has("board_tabs") && destinationTables.has("board_widgets")) {
		for (const tab of executeSqliteQuerySync(source.db, sourceDb.selectFrom("board_tabs").selectAll().where("session_key", "in", keys)).rows) executeSqliteQuerySync(destination.db, destinationDb.insertInto("board_tabs").values({
			...tab,
			session_key: canonicalKey
		}).onConflict((conflict) => conflict.columns(["session_key", "tab_id"]).doUpdateSet({
			title: tab.title,
			position: tab.position,
			chat_dock: tab.chat_dock,
			created_by: tab.created_by,
			revision: tab.revision
		}).where("revision", "<", tab.revision)));
		for (const widget of executeSqliteQuerySync(source.db, sourceDb.selectFrom("board_widgets").selectAll().where("session_key", "in", keys)).rows) executeSqliteQuerySync(destination.db, destinationDb.insertInto("board_widgets").values({
			...widget,
			session_key: canonicalKey
		}).onConflict((conflict) => conflict.columns(["session_key", "name"]).doUpdateSet({
			...widget,
			session_key: canonicalKey
		}).where((eb) => eb.or([eb("revision", "<", widget.revision), eb.and([eb("revision", "=", widget.revision), eb("updated_at", "<", widget.updated_at)])]))));
	}
	if (options.includeMembers !== false && sourceTables.has("session_members") && destinationTables.has("session_members")) for (const member of executeSqliteQuerySync(source.db, sourceDb.selectFrom("session_members").selectAll().where("session_key", "in", keys)).rows) executeSqliteQuerySync(destination.db, destinationDb.insertInto("session_members").values({
		...member,
		session_key: canonicalKey
	}).onConflict((conflict) => conflict.columns(["session_key", "identity_id"]).doNothing()));
	if (sourceTables.has("session_suggestions") && destinationTables.has("session_suggestions")) {
		if (source.db === destination.db) executeSqliteQuerySync(destination.db, destinationDb.updateTable("session_suggestions").set({ session_key: canonicalKey }).where("session_key", "in", keys));
		else for (const suggestion of executeSqliteQuerySync(source.db, sourceDb.selectFrom("session_suggestions").selectAll().where("session_key", "in", keys)).rows) executeSqliteQuerySync(destination.db, destinationDb.insertInto("session_suggestions").values({
			...suggestion,
			session_key: canonicalKey
		}).onConflict((conflict) => conflict.column("id").doNothing()));
	}
	if (sourceTables.has("session_reactions") && destinationTables.has("session_reactions")) for (const reaction of executeSqliteQuerySync(source.db, sourceDb.selectFrom("session_reactions").selectAll().where("session_key", "in", keys)).rows) executeSqliteQuerySync(destination.db, destinationDb.insertInto("session_reactions").values({
		...reaction,
		session_key: canonicalKey
	}).onConflict((conflict) => conflict.columns([
		"session_key",
		"session_id",
		"message_id",
		"emoji",
		"identity_id"
	]).doNothing()));
	if (sourceTables.has("heartbeat_outcomes") && destinationTables.has("heartbeat_outcomes")) for (const heartbeat of executeSqliteQuerySync(source.db, sourceDb.selectFrom("heartbeat_outcomes").selectAll().where("session_key", "in", keys)).rows) {
		const canonicalHeartbeat = {
			...heartbeat,
			session_key: canonicalKey,
			run_session_key: sourceKeyReferences.has(heartbeat.run_session_key) ? canonicalKey : heartbeat.run_session_key
		};
		executeSqliteQuerySync(destination.db, destinationDb.insertInto("heartbeat_outcomes").values(canonicalHeartbeat).onConflict((conflict) => conflict.column("session_key").doUpdateSet(canonicalHeartbeat).where((eb) => eb.or([eb("updated_at", "<", heartbeat.updated_at), eb.and([eb("updated_at", "=", heartbeat.updated_at), eb("occurred_at", "<", heartbeat.occurred_at)])]))));
	}
	if (options.includeParticipants !== false && sourceTables.has("session_participants") && destinationTables.has("session_participants")) for (const participant of executeSqliteQuerySync(source.db, sourceDb.selectFrom("session_participants").selectAll().where("session_key", "in", keys)).rows) {
		if (source.db === destination.db && participant.session_key === canonicalKey) continue;
		const existing = executeSqliteQueryTakeFirstSync(destination.db, destinationDb.selectFrom("session_participants").select([
			"contribution_count",
			"first_prompted_at",
			"last_prompted_at"
		]).where("session_key", "=", canonicalKey).where("identity_namespace", "=", participant.identity_namespace).where("actor_id", "=", participant.actor_id));
		const aggregate = mergeParticipantAggregate(existing, participant, source.db === destination.db ? "sum" : "copy");
		executeSqliteQuerySync(destination.db, destinationDb.insertInto("session_participants").values({
			...participant,
			...aggregate,
			session_key: canonicalKey
		}).onConflict((conflict) => conflict.columns([
			"session_key",
			"identity_namespace",
			"actor_id"
		]).doUpdateSet(aggregate)));
	}
}
/** Membership is authorization state; canonical repair replaces it from the selected winner. */
function deleteSessionMembersForRepair(database, sessionKey) {
	if (!readSessionNodeArtifactTables(database).has("session_members")) return;
	const db = getSessionKysely(database.db);
	executeSqliteQuerySync(database.db, db.deleteFrom("session_members").where("session_key", "=", sessionKey));
}
function deleteSessionDeliveryArtifacts(database, sessionKey, additionalKeys = []) {
	const db = getSessionKysely(database.db);
	const trimmedKey = sessionKey.trim();
	const lookupKeys = uniqueStrings([
		sessionKey,
		trimmedKey,
		normalizeStoreSessionKey(trimmedKey),
		...additionalKeys
	]);
	let sessionKeys = lookupKeys;
	if (lookupKeys.some((key) => key !== sessionKey)) {
		const competingIdentities = new Set(executeSqliteQuerySync(database.db, db.selectFrom("session_nodes").select("session_key")).rows.flatMap((row) => row.session_key === sessionKey ? [] : [normalizeStoreSessionKey(row.session_key.trim())]));
		sessionKeys = lookupKeys.filter((key) => key === sessionKey || !competingIdentities.has(normalizeStoreSessionKey(key.trim())));
	}
	const cache = getNodeSqliteKysely(database.db);
	executeSqliteQuerySync(database.db, cache.deleteFrom("cache_entries").where("scope", "=", "conversation-progress").where("key", "in", db.selectFrom("conversation_deliveries").select("operation_id").where("source_session_key", "in", sessionKeys)));
	executeSqliteQuerySync(database.db, db.deleteFrom("conversation_deliveries").where("source_session_key", "in", sessionKeys));
}
function deleteSessionNodeArtifacts(database, sessionKey) {
	deleteSessionPendingInputs(database, sessionKey);
	const db = getSessionKysely(database.db);
	const presentTables = readSessionNodeArtifactTables(database);
	if (presentTables.has("board_tabs") && presentTables.has("board_widgets")) {
		executeSqliteQuerySync(database.db, db.deleteFrom("board_widgets").where("session_key", "=", sessionKey));
		executeSqliteQuerySync(database.db, db.deleteFrom("board_tabs").where("session_key", "=", sessionKey));
	}
	for (const table of [
		"heartbeat_outcomes",
		"session_participants",
		"session_progress_cards",
		"session_members",
		"session_suggestions",
		"session_reactions"
	]) {
		if (!presentTables.has(table)) continue;
		executeSqliteQuerySync(database.db, db.deleteFrom(table).where("session_key", "=", sessionKey));
	}
}
function readSessionNodeArtifactTables(database) {
	const schema = getAdmittedSqliteSchemaFacts(database.db);
	if (schema) return schema.tables;
	const db = getSessionKysely(database.db);
	return new Set(executeSqliteQuerySync(database.db, db.selectFrom("sqlite_schema").select("name").where("type", "=", "table").where("name", "in", [
		"board_tabs",
		"board_widgets",
		"heartbeat_outcomes",
		"session_members",
		"session_participants",
		"session_progress_cards",
		"session_suggestions",
		"session_reactions"
	])).rows.flatMap((row) => row.name ? [row.name] : []));
}
//#endregion
//#region src/config/sessions/session-accessor.sqlite-provenance.ts
function bindSessionEntryProvenance(entry) {
	const hookSource = entry.hookExternalContentSource;
	const persistedHookSource = hookSource === "email" ? "webhook" : hookSource;
	return {
		session_entry_provenance: 1,
		acp_owned: entry.acp ? 1 : 0,
		plugin_owner_id: typeof entry.pluginOwnerId === "string" && entry.pluginOwnerId.trim() ? entry.pluginOwnerId.trim() : null,
		hook_external_content_source: persistedHookSource === "gmail" || persistedHookSource === "webhook" ? persistedHookSource : null
	};
}
function prepareSessionEntryWindowRow(params) {
	const db = getNodeSqliteKysely(params.database.db);
	const existingRoot = executeSqliteQueryTakeFirstSync(params.database.db, db.selectFrom("session_windows").select([
		"session_entry_provenance",
		"acp_owned",
		"plugin_owner_id",
		"hook_external_content_source",
		"transcript_observed_at",
		"transcript_updated_at"
	]).where("session_id", "=", params.entry.sessionId));
	const boundSessionRow = {
		...params.boundSessionRow,
		transcript_observed_at: existingRoot?.transcript_updated_at ?? params.entry.updatedAt
	};
	if (existingRoot?.session_entry_provenance === 0 && (params.previousEntry?.sessionId === params.entry.sessionId || Boolean(executeSqliteQueryTakeFirstSync(params.database.db, db.selectFrom("transcript_events").select("seq").where("session_id", "=", params.entry.sessionId).limit(1))))) return {
		...boundSessionRow,
		session_entry_provenance: 0,
		acp_owned: 0,
		plugin_owner_id: null,
		hook_external_content_source: null
	};
	return existingRoot?.session_entry_provenance === 1 ? {
		...boundSessionRow,
		acp_owned: existingRoot.acp_owned === 1 ? 1 : boundSessionRow.acp_owned,
		plugin_owner_id: boundSessionRow.plugin_owner_id ?? existingRoot.plugin_owner_id,
		hook_external_content_source: boundSessionRow.hook_external_content_source ?? existingRoot.hook_external_content_source
	} : boundSessionRow;
}
//#endregion
//#region src/config/sessions/session-accessor.sqlite-normalize.ts
function createFallbackSessionEntry(patch) {
	const now = Date.now();
	return {
		sessionId: patch.sessionId ?? randomUUID(),
		updatedAt: patch.updatedAt ?? now,
		...patch
	};
}
function normalizeSessionRowChatType(value) {
	if (value === "direct" || value === "group" || value === "channel") return value;
	return null;
}
//#endregion
//#region src/config/sessions/session-accessor.sqlite-session-row.ts
function normalizeSessionEntryTimestamp(entry) {
	const hasLegacyDeliveryFields = [
		"route",
		"deliveryContext",
		"origin",
		"channel",
		"lastChannel",
		"lastTo",
		"lastAccountId",
		"lastThreadId"
	].some((key) => key in entry);
	const delivery = entry.delivery ?? (hasLegacyDeliveryFields ? void 0 : { kind: "none" });
	if (asFiniteNumber(entry.updatedAt) !== void 0) {
		if (entry.delivery === delivery) return entry;
		return delivery ? {
			...entry,
			delivery
		} : entry;
	}
	const updatedAt = asFiniteNumber(entry.sessionStartedAt) ?? Date.now();
	return delivery ? {
		...entry,
		delivery,
		updatedAt
	} : {
		...entry,
		updatedAt
	};
}
function bindSessionRoot(params) {
	const updatedAt = Number.isFinite(params.entry.updatedAt) ? params.entry.updatedAt : params.updatedAt;
	return {
		session_id: params.entry.sessionId,
		session_key: params.sessionKey,
		reason: null,
		created_at: resolveSqliteSessionCreatedAt(params.entry, updatedAt),
		updated_at: updatedAt,
		...bindSessionEntryProvenance(params.entry),
		...bindSessionWindowEntryProjection(params),
		primary_conversation_id: null
	};
}
function bindSessionWindowEntryProjection(params) {
	return {
		previous_session_id: normalizeNullableString(params.entry.previousSessionId),
		session_scope: resolveSqliteSessionScope(params.entry, params.sessionKey),
		started_at: finiteSqliteNumber(params.entry.startedAt),
		ended_at: finiteSqliteNumber(params.entry.endedAt),
		status: normalizeStatus(params.entry.status),
		chat_type: normalizeSessionRowChatType(params.entry.chatType),
		channel: normalizeNullableString(sessionDeliveryChannel(params.entry)),
		account_id: normalizeNullableString(deliveryContextFromSession(params.entry)?.accountId),
		model_provider: normalizeNullableString(params.entry.modelProvider),
		model: normalizeNullableString(params.entry.model),
		agent_harness_id: normalizeNullableString(params.entry.agentHarnessId),
		parent_session_key: normalizeNullableString(params.entry.parentSessionKey),
		spawned_by: normalizeNullableString(params.entry.spawnedBy),
		display_name: resolveSqliteSessionDisplayName(params.entry)
	};
}
/** Project canonical hot facts into the logical-node query columns. */
function bindSessionNode(params) {
	const actor = params.entry.createdActor;
	return {
		session_key: params.sessionKey,
		current_session_id: params.entry.sessionId,
		entry_json: params.entryJson,
		entry_valid: 1,
		updated_at: params.updatedAt,
		status: normalizeStatus(params.entry.status),
		created_at: finiteSqliteNumber(params.entry.createdAt),
		created_via: normalizeSqliteCreatedVia(params.entry.createdVia),
		created_actor_type: normalizeSqliteCreatedActorType(actor?.type),
		created_actor_id: normalizeNullableString(actor?.id),
		project_id: normalizeNullableString(params.entry.projectId),
		parent_session_key: normalizeNullableString(params.entry.parentSessionKey) ?? normalizeNullableString(params.entry.spawnedBy),
		spawned_by: normalizeNullableString(params.entry.spawnedBy),
		fork_source_session_key: normalizeNullableString(params.entry.forkSource?.sessionKey),
		fork_source_session_id: normalizeNullableString(params.entry.forkSource?.sessionId),
		fork_source_entry_id: normalizeNullableString(params.entry.forkSource?.entryId),
		label: normalizeNullableString(params.entry.label),
		display_name: normalizeNullableString(params.entry.displayName),
		category: normalizeNullableString(params.entry.category),
		icon: normalizeNullableString(params.entry.icon),
		pinned_at: finiteSqliteNumber(params.entry.pinnedAt),
		archived_at: finiteSqliteNumber(params.entry.archivedAt),
		last_read_at: finiteSqliteNumber(params.entry.lastReadAt),
		last_interaction_at: finiteSqliteNumber(params.entry.lastInteractionAt),
		last_activity_at: finiteSqliteNumber(params.entry.lastActivityAt)
	};
}
function normalizeSqliteCreatedVia(value) {
	return value === "operator" || value === "spawn" || value === "channel" || value === "cron" || value === "talk" || value === "run" || value === "plugin" || value === "internal" ? value : null;
}
function normalizeSqliteCreatedActorType(value) {
	return value === "human" || value === "agent" || value === "system" ? value : null;
}
function resolveSqliteSessionScope(entry, sessionKey) {
	const chatType = normalizeSessionRowChatType(entry.chatType);
	const normalizedKey = sessionKey.trim().toLowerCase();
	if (chatType === "direct" && (normalizedKey === "main" || normalizedKey.endsWith(":main"))) return "shared-main";
	if (chatType === "group" || chatType === "channel") return chatType;
	return "conversation";
}
function resolveSqliteSessionCreatedAt(entry, updatedAt) {
	for (const candidate of [
		entry.sessionStartedAt,
		entry.startedAt,
		entry.updatedAt,
		updatedAt
	]) if (typeof candidate === "number" && Number.isFinite(candidate) && candidate >= 0) return candidate;
	return updatedAt;
}
function finiteSqliteNumber(value) {
	return asFiniteNumber(value) ?? null;
}
function resolveSqliteSessionDisplayName(entry) {
	return normalizeNullableString(entry.displayName) ?? normalizeNullableString(entry.label) ?? normalizeNullableString(entry.subject) ?? normalizeNullableString(entry.groupId);
}
//#endregion
//#region src/config/sessions/session-public-share.ts
/** Publication is valid only for its exact current generation, including copied metadata. */
function resolveSessionPublicShare(entry) {
	const share = entry?.publicShare;
	if (!entry || entry.incognito === true || !isRecord(share) || share.sessionId !== entry.sessionId || typeof share.id !== "string" || !/^[a-f0-9]{48}$/.test(share.id) || !Number.isSafeInteger(share.createdAt) || share.createdAt < 0) return;
	return {
		id: share.id,
		sessionId: share.sessionId,
		createdAt: share.createdAt
	};
}
//#endregion
//#region src/config/sessions/session-accessor.sqlite-entry-store.ts
/** Exact reads already own nested values; retain them through identity publication. */
function readSessionIdentitySnapshot(database, sessionKeys) {
	const snapshot = /* @__PURE__ */ new Map();
	for (const sessionKey of uniqueStrings([...sessionKeys].map((key) => key.trim()))) {
		const row = readExactSessionEntryRow(database, sessionKey);
		if (row) snapshot.set(sessionKey, row.entry);
	}
	return snapshot;
}
function readSessionEntrySelectionSnapshot(database, sessionKey, exact) {
	const scanned = exact ? void 0 : readSessionEntryRowScan(database, sessionKey);
	const selected = exact ? readExactSessionEntryRow(database, sessionKey) : scanned?.selected;
	return selected ? [{
		entry: selected.entry,
		sessionKey: selected.row.session_key,
		persistedRows: {
			lookupKeys: scanned?.lookupKeys ?? [sessionKey.trim()],
			rows: (scanned?.rows ?? [selected.row]).map(retainSessionEntryRowFacts)
		}
	}] : [];
}
function retainSessionEntryRowFacts(row) {
	delete row.session_diff_baseline_json;
	delete row.skills_snapshot_json;
	delete row.system_prompt_report_json;
	return row;
}
/** Reuses preparation only when every persisted column still matches; otherwise hydrate. */
function readUnchangedLifecycleTargetSnapshot(database, prepared) {
	const persisted = prepared[0]?.persistedRows;
	if (!persisted || persisted.lookupKeys.length === 0) return;
	const rows = executeSqliteQuerySync(database.db, getSessionKysely(database.db).selectFrom("session_nodes").selectAll().where("session_key", "in", sqliteStringSet(persisted.lookupKeys)).orderBy("session_key", "asc")).rows;
	return isDeepStrictEqual(rows, persisted.rows, { skipPrototype: true }) ? prepared : void 0;
}
function resolveLifecyclePrimaryEntry(database, target, options = {}) {
	const row = readSessionEntryTargetRow(database, target, options);
	return row?.entry ? {
		entry: row.entry,
		sessionKey: row.row.session_key,
		persistedRows: {
			lookupKeys: target.storeKeys.map((key) => key.trim()),
			rows: [retainSessionEntryRowFacts(row.row)]
		}
	} : void 0;
}
function readLifecycleTargetSnapshot(database, target, options = {}) {
	const row = resolveLifecyclePrimaryEntry(database, normalizeLifecycleTarget(target), options);
	return row ? [row] : [];
}
function normalizeLifecycleTarget(target) {
	const canonicalKey = normalizeStoreSessionKey(target.canonicalKey);
	return {
		canonicalKey,
		storeKeys: uniqueStrings([canonicalKey, ...target.storeKeys.map(normalizeStoreSessionKey)])
	};
}
function deleteSessionEntryRows(database, sessionKey, options = {}) {
	const previousEntry = options.validatedEntry ?? readExactSessionEntryRow(database, sessionKey)?.entry;
	if (previousEntry) commitSqliteSessionDeletion(sessionKey, previousEntry);
	const db = getSessionKysely(database.db);
	const windows = executeSqliteQuerySync(database.db, db.selectFrom("session_windows").select("session_id").where("session_key", "=", sessionKey)).rows;
	const survivingNodes = windows.length > 0 ? executeSqliteQuerySync(database.db, db.selectFrom("session_nodes").select([
		"current_session_id",
		"entry_json",
		"session_key"
	]).where("session_key", "!=", sessionKey).orderBy("session_key", "asc")).rows : [];
	for (const window of windows) {
		const survivingNode = survivingNodes.find((node) => {
			if (node.current_session_id === window.session_id) return true;
			const entry = parseSessionEntryJson(node);
			return entry ? collectSessionStateIdsForEntry(entry).includes(window.session_id) : false;
		});
		if (survivingNode) executeSqliteQuerySync(database.db, db.updateTable("session_windows").set({ session_key: survivingNode.session_key }).where("session_id", "=", window.session_id));
	}
	const remainingWindow = options.deleteOwnedWindows ? void 0 : executeSqliteQueryTakeFirstSync(database.db, db.selectFrom("session_windows").select(["session_id", "updated_at"]).where("session_key", "=", sessionKey).orderBy("updated_at", "desc").orderBy("session_id", "asc").limit(1));
	if (options.deleteOwnedWindows) deleteSessionDeliveryArtifacts(database, sessionKey, options.deliveryCleanupKeys);
	if (options.deleteOwnedWindows || remainingWindow) deleteSessionNodeArtifacts(database, sessionKey);
	if (remainingWindow) clearSqliteSessionEntryPreservingWindows(database, {
		sessionId: remainingWindow.session_id,
		sessionKey,
		updatedAt: remainingWindow.updated_at
	});
	else executeSqliteQuerySync(database.db, db.deleteFrom("session_nodes").where("session_key", "=", sessionKey));
	publishSessionEntryCacheInvalidation(database, {
		sessionKey,
		facts: { kind: "removed" }
	});
}
/** Remove the logical entry while retaining its node-owned transcript windows. */
function clearSqliteSessionEntryPreservingWindows(database, params) {
	writeSessionEntrySnapshots(database, params.sessionKey, []);
	retainLegacyAcpMigrationSourcesForEntry(database.db, params.sessionKey, void 0);
	const db = getSessionKysely(database.db);
	const cleared = {
		current_session_id: params.sessionId,
		entry_json: "{}",
		entry_valid: -1,
		updated_at: params.updatedAt,
		status: null,
		created_at: null,
		created_via: null,
		created_actor_type: null,
		created_actor_id: null,
		project_id: null,
		parent_session_key: null,
		spawned_by: null,
		fork_source_session_key: null,
		fork_source_session_id: null,
		fork_source_entry_id: null,
		label: null,
		display_name: null,
		category: null,
		icon: null,
		pinned_at: null,
		archived_at: null,
		last_read_at: null,
		last_interaction_at: null,
		last_activity_at: null,
		...hasSqliteSessionOwnerColumns(database.db) ? {
			owner_actor_type: null,
			owner_actor_id: null,
			owner_assigned_by_type: null,
			owner_assigned_by_id: null,
			owner_assigned_at: null
		} : {}
	};
	executeSqliteQuerySync(database.db, db.insertInto("session_nodes").values({
		session_key: params.sessionKey,
		...cleared
	}).onConflict((conflict) => conflict.column("session_key").doUpdateSet(cleared)));
	executeSqliteQuerySync(database.db, db.updateTable("session_nodes").set({ entry_valid: -1 }).where("session_key", "=", params.sessionKey));
	certifyCanonicalSessionValidationRow(database, params.sessionKey);
}
function deleteLifecycleTargetRows(database, target) {
	for (const sessionKey of uniqueStrings([target.canonicalKey, ...target.storeKeys])) {
		const trimmed = sessionKey.trim();
		if (trimmed) deleteSessionEntryRows(database, trimmed);
	}
}
function deleteLegacySessionEntryRows(database, legacyKeys, sessionKey, options = {}) {
	if (legacyKeys.length === 0) return;
	const db = getSessionKysely(database.db);
	for (const legacyKey of legacyKeys) {
		if (legacyKey === sessionKey) continue;
		const previousEntry = options.validatedEntries?.get(legacyKey) ?? readExactSessionEntryRow(database, legacyKey)?.entry;
		if (previousEntry) commitSqliteSessionDeletion(legacyKey, previousEntry);
		rehomeSessionWindows(database, sessionKey, [legacyKey]);
		copySessionNodeArtifactsForRepair(database, database, [legacyKey], sessionKey, { includeMembers: options.rehomeMembers });
		executeSqliteQuerySync(database.db, db.deleteFrom("session_nodes").where("session_key", "=", legacyKey));
		publishSessionEntryCacheInvalidation(database, { sessionKey: legacyKey });
	}
	publishSessionEntryCacheInvalidation(database, { sessionKey });
}
/** Move retained generations to the canonical node before removing key aliases. */
function rehomeSessionWindows(database, canonicalKey, previousKeys) {
	const legacyKeys = uniqueStrings([...previousKeys].map((key) => key.trim())).filter((key) => key && key !== canonicalKey);
	if (legacyKeys.length === 0) return;
	const db = getSessionKysely(database.db);
	executeSqliteQuerySync(database.db, db.updateTable("session_windows").set({ session_key: canonicalKey }).where("session_key", "in", legacyKeys));
}
function writeSessionEntry(database, sessionKey, entry, options = {}) {
	if (!options.allowStoredAliases) {
		assertCanonicalSessionKeyWrite(sessionKey);
		assertCanonicalSessionEntryLineageWrite(entry);
		if (resolveDeliveryProvenCanonicalSessionKey(sessionKey, entry) !== sessionKey) throw canonicalSessionKeyMigrationRequiredError(`refusing non-canonical session key write ${sessionKey}`);
	}
	let normalizedEntry = normalizeSessionEntryTimestamp(entry);
	if (!hasValidSessionEntryIdentity(normalizedEntry)) throw new Error("Refusing invalid SQLite session entry identity");
	const canonicalPreviousEntry = options.canonicalPreviousEntry !== void 0 ? options.canonicalPreviousEntry ?? void 0 : options.allowStoredAliases && options.previousEntry !== void 0 ? options.previousEntry ?? void 0 : readExactSessionEntryRow(database, sessionKey)?.entry;
	if (!options.providerReviewMutation && !options.allowStoredAliases) normalizedEntry = {
		...normalizedEntry,
		providerReview: canonicalPreviousEntry?.sessionId === normalizedEntry.sessionId && canonicalPreviousEntry.lifecycleRevision === normalizedEntry.lifecycleRevision ? canonicalPreviousEntry.providerReview : void 0
	};
	if (normalizedEntry.providerReview?.sessionId !== normalizedEntry.sessionId) delete normalizedEntry.providerReview;
	if (canonicalPreviousEntry?.sandbox === "required") {
		if (normalizedEntry.sandbox !== "required" || normalizedEntry.createdVia !== canonicalPreviousEntry.createdVia || normalizedEntry.createdAt !== canonicalPreviousEntry.createdAt || !isDeepStrictEqual(normalizedEntry.createdActor, canonicalPreviousEntry.createdActor)) getChildLogger({ subsystem: "session-sqlite" }).warn("blocked role-required session creation provenance downgrade", {
			agentId: database.agentId,
			sessionKey
		});
	}
	if (!options.allowStoredAliases || canonicalPreviousEntry?.sandbox === "required") normalizedEntry = preserveCreationStamp(normalizedEntry, canonicalPreviousEntry);
	if (isIncognitoSessionKey(sessionKey) && normalizedEntry.createdAt === void 0) normalizedEntry = {
		...normalizedEntry,
		createdAt: canonicalPreviousEntry?.updatedAt ?? Date.now()
	};
	const involvement = options.profileInvolvement ?? canonicalPreviousEntry?.profileInvolvement ?? (entry.profileInvolvement?.key === sessionKey || options.allowStoredAliases ? entry.profileInvolvement : void 0);
	if (involvement) normalizedEntry = {
		...normalizedEntry,
		profileInvolvement: {
			...involvement,
			key: sessionKey
		}
	};
	else if (normalizedEntry.profileInvolvement) {
		const { profileInvolvement: _sourceInvolvement, ...forkEntry } = normalizedEntry;
		normalizedEntry = forkEntry;
	}
	const previousEntry = options.previousEntry === void 0 ? canonicalPreviousEntry : options.previousEntry ?? void 0;
	if (options.consumePendingReset !== true && previousEntry?.updatedAt === 0 && previousEntry.sessionId === normalizedEntry.sessionId && previousEntry.lifecycleRevision === normalizedEntry.lifecycleRevision) normalizedEntry.updatedAt = 0;
	const updatedAt = normalizedEntry.updatedAt;
	if (!Object.hasOwn(normalizedEntry, "publicShare") && canonicalPreviousEntry?.sessionId === normalizedEntry.sessionId) normalizedEntry.publicShare = resolveSessionPublicShare(canonicalPreviousEntry);
	if (normalizedEntry.incognito === true || normalizedEntry.publicShare?.sessionId !== normalizedEntry.sessionId) delete normalizedEntry.publicShare;
	if (previousEntry && previousEntry.sessionId !== normalizedEntry.sessionId) delete normalizedEntry.visibility;
	if (canonicalPreviousEntry && canonicalPreviousEntry.sessionId !== normalizedEntry.sessionId) clearSessionCollaborationForKey(database, sessionKey, { clearSuggestions: options.preserveNodeSuggestions !== true });
	const boundSessionRoot = bindSessionRoot({
		entry: normalizedEntry,
		sessionKey,
		updatedAt
	});
	const conversation = prepareSessionConversationForWrite({
		database,
		entry: normalizedEntry,
		previousEntry,
		...options.routeContext !== void 0 ? { routeContext: options.routeContext } : {},
		sessionScope: boundSessionRoot.session_scope
	});
	if (conversation) upsertConversationIdentity(database, conversation.identity, updatedAt);
	const sessionRow = prepareSessionEntryWindowRow({
		boundSessionRow: {
			...boundSessionRoot,
			primary_conversation_id: conversation?.role === "primary" ? conversation.identity.conversationRef : null
		},
		database,
		entry: normalizedEntry,
		previousEntry
	});
	const canonicalEntry = stripRuntimeOnlySessionSkillsFields(projectCanonicalSessionEntryShape({ ...normalizedEntry }));
	const persisted = splitSessionEntrySnapshots(canonicalEntry, { previousEntry: canonicalPreviousEntry });
	const sessionNode = bindSessionNode({
		entry: canonicalEntry,
		entryJson: persisted.entryJson,
		sessionKey,
		updatedAt
	});
	const queries = getSessionEntryWriteQueries(database.db);
	const writeGeneration = trackSessionEntryCacheWrite(database, () => {
		queries.node(sessionNode);
		if (persisted.snapshotsChanged) writeSessionEntrySnapshots(database, sessionKey, persisted.snapshots);
		queries.markValid(sessionKey);
	});
	advanceSessionEntryMaintenanceAgeFact(database.db, {
		sessionKey,
		entry: normalizedEntry,
		previousEntry: canonicalPreviousEntry
	});
	if (canonicalPreviousEntry && (canonicalPreviousEntry.sessionId !== normalizedEntry.sessionId || canonicalPreviousEntry.lifecycleRevision !== normalizedEntry.lifecycleRevision)) retainLegacyAcpMigrationSourcesForEntry(database.db, sessionKey, normalizedEntry);
	(canonicalPreviousEntry?.sessionId === normalizedEntry.sessionId ? queries.retainWindow : queries.claimWindow)(sessionRow);
	if (conversation) linkSessionConversation({
		database,
		...previousEntry?.sessionId ? { previousSessionId: previousEntry.sessionId } : {},
		sessionId: sessionRow.session_id,
		conversation,
		updatedAt
	});
	if (!options.allowStoredAliases) certifyCanonicalSessionValidationRow(database, sessionKey);
	publishSessionEntryCacheInvalidation(database, {
		sessionKey,
		entry: normalizedEntry,
		sharingUnchanged: !options.allowStoredAliases && sessionSharingEntriesEqual(canonicalPreviousEntry, {
			...normalizedEntry,
			owner: canonicalPreviousEntry?.owner
		}),
		entryJson: persisted.entryJson,
		sideMetadata: structuredClone({
			owner: canonicalPreviousEntry?.owner,
			participants: canonicalPreviousEntry?.participants,
			participantCount: canonicalPreviousEntry?.participantCount
		}),
		previousEntry: canonicalPreviousEntry,
		...!options.allowStoredAliases ? { facts: {
			kind: "entry",
			previousSessionId: canonicalPreviousEntry?.sessionId,
			sessionId: normalizedEntry.sessionId,
			category: normalizedEntry.category?.trim() || null,
			clearMembers: canonicalPreviousEntry !== void 0 && canonicalPreviousEntry.sessionId !== normalizedEntry.sessionId
		} } : {}
	}, writeGeneration);
	return normalizedEntry;
}
//#endregion
export { captureSessionInitializationOwner as A, deriveLastRoutePatch as B, runPreparedSqliteSessionWrite as C, withSqliteSessionDeletions as D, withSqliteSessionDeletionWorkerParticipant as E, isNativeSessionDeletionUnresolved as F, deriveSessionOrigin as H, wrapNativeSessionDeletionMutation as I, upsertConversationIdentity as L, withSessionInitializationSource as M, bindNativeSessionDeletionParticipant as N, findSessionRepositoryWorkspaces as O, createNativeSessionCommitFinalizer as P, buildConversationIdentity as R, hasPreparedNativeSessionDeletion as S, withSqliteSessionContextReset as T, deriveSessionMetaPatch as V, deleteSessionMembersForRepair as _, readLifecycleTargetSnapshot as a, captureNativeSessionWorkerDeletion as b, readUnchangedLifecycleTargetSnapshot as c, writeSessionEntry as d, resolveSessionPublicShare as f, deleteSessionDeliveryArtifacts as g, copySessionNodeArtifactsForRepair as h, normalizeLifecycleTarget as i, createSessionInitialization as j, getSessionRepositoryWorkspaceStore as k, rehomeSessionWindows as l, createFallbackSessionEntry as m, deleteLifecycleTargetRows as n, readSessionEntrySelectionSnapshot as o, bindSessionWindowEntryProjection as p, deleteSessionEntryRows as r, readSessionIdentitySnapshot as s, deleteLegacySessionEntryRows as t, resolveLifecyclePrimaryEntry as u, readSessionNodeArtifactFingerprint as v, runSqliteSessionDeletionTransaction as w, commitSqliteSessionDeletion as x, readSessionInputArtifactRows as y, conversationIdentityFromMsgContext as z };
