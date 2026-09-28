import { s as asFiniteNumber } from "./number-coercion-CLj0HTDM.mjs";
import { i as resolveGlobalSingleton } from "./global-singleton-Dc_stLtU.mjs";
import "./src-CZ2wJvNB.mjs";
import { a as asOptionalRecord, c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { t as stableStringify } from "./stable-stringify-CkQ0IEj1.mjs";
import { c as normalizeOptionalLowercaseString, l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { y as uniqueStrings } from "./string-normalization-_gRhJUDw.mjs";
import { r as getPluginRegistryState } from "./runtime-state-C5tDvNBc.mjs";
import { i as getPluginRuntimeGatewayRequestScope, s as withPluginRuntimeGatewayRequestScope } from "./gateway-request-scope-BLBH-Gpf.mjs";
import { Fn as object, Jn as string, Nt as array, Pn as number } from "./schemas-BOYIvvln.mjs";
import { A as parseAgentSessionKey } from "./session-key-CBvmC8zz.mjs";
import { r as normalizeOptionalAccountId } from "./account-id-B1bfbA5J.mjs";
import { r as getChildLogger } from "./logger--ALOusOG.mjs";
import { a as iterateSqliteQuerySync, i as getNodeSqliteKysely, l as sqliteStringSet, n as executeSqliteQuerySync, o as prepareSqliteQueryIterator, r as executeSqliteQueryTakeFirstSync, s as prepareSqliteQuerySync, u as sql } from "./kysely-sync-Bn6Qrpbz.mjs";
import { i as stageSqliteTransactionState, t as deferSqlitePostCommitPublication } from "./sqlite-post-commit-DJbkHzN8.mjs";
import { n as createSqliteLifecycleAggregateError } from "./sqlite-coordinator-z2lO0ops.mjs";
import { i as tableHasColumn, r as tableExists, t as ensureColumn } from "./openclaw-state-db-schema-helpers-Cck9Qf-B.mjs";
import { s as resolveOpenClawStateSqlitePath } from "./openclaw-state-db.paths-DYMh54HD.mjs";
import { t as getPluginRuntimeGenerationRegistry } from "./generation-state-Mkqqbxs_.mjs";
import "./generation-scope-DkeaMJw8.mjs";
import { l as resolveSessionStorePathCore } from "./paths-CcMbq5NY.mjs";
import { t as sessionChanges } from "./session-row-changes-xuu0eHng.mjs";
import { E as ensureSessionRepositoryWorkspaceSchema, c as runOpenClawStateWriteTransaction, r as openOpenClawStateDatabase } from "./openclaw-state-db-BFK9cMiV.mjs";
import { i as recordLegacyMigrationReceipt, r as readLegacyMigrationReceiptFromDatabase, s as resolveLegacyMigrationSourceKey } from "./state-migrations.receipts-D6lbWbKJ.mjs";
import { r as isInternalNonDeliveryChannel } from "./message-channel-constants-Cd7Eq8Zi.mjs";
import { n as normalizeMessageChannel } from "./message-channel-core-CxyiAx1U.mjs";
import { a as mergeDeliveryContext, c as normalizeSessionDeliveryState, s as normalizeDeliveryContext, t as deliveryContextFromChannelRoute } from "./delivery-context.shared-CW8dxG7X.mjs";
import "./message-channel-DDcHHhpX.mjs";
import { h as registerAgentEventLifecycleRotationHandler, u as isAgentEventLifecycleGenerationCurrent } from "./agent-events-BOSJcayE.mjs";
import { i as capturePluginLifecycleAuthority } from "./registry-lifecycle-xdpzLZzd.mjs";
import { C as LEGACY_ACP_MIGRATION_COLUMN_DEFINITION, h as ensureSessionPendingInputsSchema, m as ensureSessionInputCompletionsSchema, v as hasSessionPendingInputsSchema } from "./openclaw-agent-db-identity-DLTnzTd_.mjs";
import { i as ensureOpenClawAgentProgressCardSchemaInTransaction } from "./openclaw-agent-progress-card-schema-P92mHByB.mjs";
import { t as normalizeChatType } from "./chat-type-Dbv0JQHI.mjs";
import { n as normalizeConversationPeerId, r as hasValidSessionEntryIdentity, t as buildConversationRef } from "./conversation-ref-8kIjGCCc.mjs";
import { g as ensureSessionParticipantsSchema } from "./openclaw-agent-db-schema-helpers-D9qnl2Yp.mjs";
import { a as deferOpenClawAgentPostCommitPublication, f as runOpenClawAgentWriteTransaction, l as openOpenClawAgentDatabase } from "./openclaw-agent-db-CaQAStOA.mjs";
import { n as withOpenClawAgentDatabaseReadOnly } from "./openclaw-agent-db-readonly-IBx2zWDG.mjs";
import { i as sessionDeliveryRoute, n as sessionDeliveryChannel, r as sessionDeliveryOrigin, t as deliveryContextFromSession } from "./delivery-context.read-CR06zOJ4.mjs";
import { a as normalizeStoreSessionKey, o as resolveDeliveryProvenCanonicalSessionKey } from "./store-entry-DuM7NmYY.mjs";
import { a as getSessionKysely, g as toDatabaseOptions, h as runExclusiveSqliteSessionWrite, o as normalizeSqliteSessionKey, u as resolveSqliteScope, v as withSqliteSessionDatabase } from "./session-accessor.sqlite-scope-DHC66DLY.mjs";
import { c as readSessionEntryRow, g as mergeParticipantAggregate, l as readSessionEntryRowScan, o as readExactSessionEntryRow, s as readExactSessionEntryRowValidated } from "./session-accessor.sqlite-entry-read-yAa3_SVY.mjs";
import { c as hasSqliteSessionOwnerColumns, n as normalizeStatus, r as parseSessionEntryJson, s as sessionEntryMetadataJson } from "./session-accessor.sqlite-status-DxkjEBwE.mjs";
import { n as projectCanonicalSessionEntryShape, r as stripRuntimeOnlySessionSkillsFields } from "./store-entry-shape-CWorLqwJ.mjs";
import { c as hasCanonicalSessionValidationProjection, h as canonicalSessionKeyMigrationRequiredError, i as assertCanonicalSqliteSessionKeysCurrent, r as assertCanonicalSessionKeyWriteMatchesDatabase, t as assertCanonicalSessionEntryLineageWrite } from "./session-canonical-key-BBylVEaq.mjs";
import { a as publishSessionEntryCacheInvalidation, p as trackSessionEntryCacheWrite } from "./session-accessor.sqlite-entry-cache-CtMz7hDz.mjs";
import { a as preserveCreationStamp } from "./session-entry-provenance-C-JyMH54.mjs";
import "./session-accessor.sqlite-entry-inventory-BGtMQ0LB.mjs";
import { t as normalizeInternalTurnContext } from "./internal-turn-source-moohSd1t.mjs";
import { t as resolveConversationLabel } from "./conversation-label-BwwCUvEq.mjs";
import { i as normalizeChannelId, n as getLoadedChannelPlugin } from "./registry-D3wOWFDo.mjs";
import { r as resolveGroupSessionKey, t as buildGroupDisplayName } from "./group-B8HN3m8j.mjs";
import "./plugins-BEpDh--e.mjs";
import { g as runExclusiveSessionLifecycleMutation, p as isCompetingSessionWorkAdmissionActive } from "./session-lifecycle-admission-Pys9TN37.mjs";
import { a as getSessionMaintenanceActivityAt, p as shouldPreserveMaintenanceEntry } from "./store-maintenance-C5xEVYop.mjs";
import { i as classifyAgentRunTerminalOutcome } from "./agent-run-terminal-outcome-CgoAW2Q7.mjs";
import { t as SessionPendingInputCustodyError } from "./session-pending-input-custody-error-fcZzzQWk.mjs";
import { r as collectSessionStateIdsForEntry } from "./session-accessor.sqlite-references-BKdpL7km.mjs";
import { t as certifyCanonicalSessionValidationRow } from "./session-canonical-validation-DxuYA6hL.mjs";
import { c as readTranscriptMutationStateInTransaction } from "./session-accessor.sqlite-transcript-state-BGrlGphn.mjs";
import { isDeepStrictEqual } from "node:util";
import path from "node:path";
import { AsyncLocalStorage } from "node:async_hooks";
import fs from "node:fs/promises";
import { createHash, randomUUID } from "node:crypto";
//#region src/config/sessions/session-accessor.sqlite-entry-equality.ts
var SqliteSessionMutationConflictError = class extends Error {
	constructor(operationLabel) {
		super(`SQLite session state changed while preparing ${operationLabel}`);
		this.name = "SqliteSessionMutationConflictError";
	}
};
function sqliteSessionEntriesEqual(left, right) {
	if (!left || !right) return left === right;
	const { participants: _leftParticipants, participantCount: _leftParticipantCount, ...leftEntry } = left;
	const { participants: _rightParticipants, participantCount: _rightParticipantCount, ...rightEntry } = right;
	return JSON.stringify(leftEntry) === JSON.stringify(rightEntry);
}
function sqliteLifecycleTargetSnapshotsEqual(left, right) {
	return left.length === right.length && left.every((row, index) => row.sessionKey === right[index]?.sessionKey && sqliteSessionEntriesEqual(row.entry, right[index]?.entry));
}
function assertLifecycleTargetSnapshotUnchanged(expected, current, operationLabel) {
	if (!sqliteLifecycleTargetSnapshotsEqual(expected, current)) throw new SqliteSessionMutationConflictError(operationLabel);
}
//#endregion
//#region src/infra/legacy-acp-migration-source.ts
const RECEIPT_KIND = "deferred-plugin-acp-metadata";
const legacyAcpMigrationSourceSchema = object({
	sourcePath: string(),
	sourceSessionKey: string(),
	sessionId: string().optional(),
	lifecycleRevision: string().optional(),
	sourceSha256: string().regex(/^[0-9a-f]{64}$/),
	sourceSizeBytes: number().int().nonnegative()
});
function sourceBinding(source) {
	return {
		sessionKey: source.sourceSessionKey.trim(),
		sessionBinding: source.lifecycleRevision ?? source.sessionId ?? null
	};
}
function legacyAcpMigrationSourceKey(source) {
	return resolveLegacyMigrationSourceKey(RECEIPT_KIND, source.sourcePath, stableStringify(sourceBinding(source)));
}
function prepareLegacyAcpMigrationSource(params) {
	const serialized = stableStringify({
		...sourceBinding(params),
		meta: params.meta
	});
	return {
		sourcePath: path.resolve(params.sourcePath),
		sourceSessionKey: params.sourceSessionKey.trim(),
		...params.sessionId !== void 0 ? { sessionId: params.sessionId } : {},
		...params.lifecycleRevision !== void 0 ? { lifecycleRevision: params.lifecycleRevision } : {},
		sourceSha256: createHash("sha256").update(serialized).digest("hex"),
		sourceSizeBytes: Buffer.byteLength(serialized)
	};
}
function legacyAcpMigrationBindingMatches(source, entry) {
	return entry !== void 0 && entry.lifecycleRevision === source.lifecycleRevision && (source.lifecycleRevision !== void 0 || entry.sessionId === source.sessionId);
}
function hasLegacyAcpMigrationCompletion(database, source) {
	const receipt = readLegacyMigrationReceiptFromDatabase(database, legacyAcpMigrationSourceKey(source));
	if (!receipt) return false;
	if (receipt.sourceSha256 !== source.sourceSha256) throw new Error(`Retained ACP metadata changed after import in ${source.sourcePath}; resolve the source conflict before rerunning Doctor. Canonical metadata was not replayed.`);
	return true;
}
/** Canonical supersession and legacy import consume the same source component. */
function recordLegacyAcpMigrationCompletion(database, source, now) {
	if (hasLegacyAcpMigrationCompletion(database, source)) return;
	const sourceKey = legacyAcpMigrationSourceKey(source);
	recordLegacyMigrationReceipt(database, {
		sourceKey,
		migrationKind: RECEIPT_KIND,
		sourcePath: source.sourcePath,
		targetTable: "acp_sessions",
		sourceSha256: source.sourceSha256,
		sourceSizeBytes: source.sourceSizeBytes,
		sourceRecordCount: 1,
		runId: sourceKey,
		reportJson: "{}",
		now
	});
}
//#endregion
//#region src/state/openclaw-agent-legacy-acp-schema.ts
const provenanceSchemas = /* @__PURE__ */ new WeakSet();
function hasLegacyAcpMigrationProvenanceColumn(database) {
	if (provenanceSchemas.has(database)) return true;
	const { columnName, tableName } = LEGACY_ACP_MIGRATION_COLUMN_DEFINITION;
	const exists = tableHasColumn(database, tableName, columnName);
	if (exists && !database.isTransaction) provenanceSchemas.add(database);
	return exists;
}
function ensureLegacyAcpMigrationProvenanceColumn(database) {
	if (provenanceSchemas.has(database)) return;
	const { columnName, dataType, tableName } = LEGACY_ACP_MIGRATION_COLUMN_DEFINITION;
	if (!hasLegacyAcpMigrationProvenanceColumn(database) && !ensureColumn(database, tableName, `${columnName} ${dataType}`)) return;
	const rememberSchema = () => provenanceSchemas.add(database);
	if (database.isTransaction) deferSqlitePostCommitPublication(database, rememberSchema);
	else rememberSchema();
}
//#endregion
//#region src/config/sessions/session-accessor.sqlite-acp-provenance.ts
const sourcesSchema = array(legacyAcpMigrationSourceSchema);
function readSources(database, sessionKey) {
	if (!hasLegacyAcpMigrationProvenanceColumn(database)) return [];
	const row = executeSqliteQueryTakeFirstSync(database, getSessionKysely(database).selectFrom("session_nodes").select("legacy_acp_migration_json").where("session_key", "=", sessionKey));
	return row?.legacy_acp_migration_json ? sourcesSchema.parse(JSON.parse(row.legacy_acp_migration_json)) : [];
}
function readLegacyAcpMigrationContext(scope) {
	const resolved = resolveSqliteScope(scope);
	const result = withOpenClawAgentDatabaseReadOnly((database) => {
		const selected = readExactSessionEntryRowValidated(database, resolved.sessionKey);
		return {
			entry: selected?.entry,
			sources: selected?.row.legacy_acp_migration_json ? sourcesSchema.parse(JSON.parse(selected.row.legacy_acp_migration_json)) : []
		};
	}, toDatabaseOptions(resolved));
	return result.found ? result.value : {
		entry: void 0,
		sources: []
	};
}
function writeSources(database, sessionKey, sources) {
	ensureLegacyAcpMigrationProvenanceColumn(database);
	executeSqliteQuerySync(database, getSessionKysely(database).updateTable("session_nodes").set({ legacy_acp_migration_json: sources.length ? JSON.stringify(sources) : null }).where("session_key", "=", sessionKey));
}
/** Repair retries may carry the same source again, but cannot restamp its consumed identity. */
function recordLegacyAcpMigrationSources(database, sessionKey, sources) {
	if (!sources.length) return;
	const merged = new Map(readSources(database, sessionKey).map((source) => [legacyAcpMigrationSourceKey(source), source]));
	for (const source of sources) {
		const key = legacyAcpMigrationSourceKey(source);
		const existing = merged.get(key);
		if (existing && existing.sourceSha256 !== source.sourceSha256) throw new Error("Retained ACP source provenance changed during session import.");
		if (!existing) merged.set(key, source);
	}
	writeSources(database, sessionKey, [...merged.values()]);
}
function retainLegacyAcpMigrationSourcesForEntry(database, sessionKey, entry) {
	const sources = readSources(database, sessionKey);
	const retained = sources.filter((source) => legacyAcpMigrationBindingMatches(source, entry));
	if (retained.length !== sources.length) writeSources(database, sessionKey, retained);
}
function copyLegacyAcpMigrationSourcesForRepair(source, destination, sourceKeys, canonicalKey) {
	recordLegacyAcpMigrationSources(destination.db, canonicalKey, sourceKeys.flatMap((key) => readSources(source.db, key)));
}
//#endregion
//#region src/config/sessions/conversation-route-context.ts
const MAX_ROUTE_CONTEXT_ID_LENGTH = 512;
const MAX_ROUTE_CONTEXT_ROLE_IDS = 256;
const MAX_STORED_ROUTE_CONTEXT_LENGTH = 14e4;
function normalizeBoundedId(value) {
	const normalized = normalizeOptionalString(value);
	return normalized && normalized.length <= MAX_ROUTE_CONTEXT_ID_LENGTH ? normalized : void 0;
}
function normalizeRoleIds(value) {
	if (value === void 0) return { valid: true };
	if (!Array.isArray(value) || value.length > MAX_ROUTE_CONTEXT_ROLE_IDS) return { valid: false };
	const roleIds = [];
	for (const item of value) {
		const roleId = normalizeBoundedId(item);
		if (!roleId) return { valid: false };
		roleIds.push(roleId);
	}
	const unique = [...new Set(roleIds)].toSorted();
	return unique.length > 0 ? {
		valid: true,
		value: unique
	} : { valid: true };
}
/** Parses the closed, bounded route facts used to replay configured routing precedence. */
function parseConversationRouteContext(value) {
	if (!isRecord(value)) return;
	const guildId = normalizeBoundedId(value.guildId);
	const peerId = normalizeBoundedId(value.peerId);
	const teamId = normalizeBoundedId(value.teamId);
	const parentPeerId = normalizeBoundedId(value.parentPeerId);
	const memberRoleIds = normalizeRoleIds(value.memberRoleIds);
	if (value.peerId !== void 0 && !peerId || value.guildId !== void 0 && !guildId || value.teamId !== void 0 && !teamId || value.parentPeerId !== void 0 && !parentPeerId || !memberRoleIds.valid) return;
	if (!peerId && !guildId && !teamId && !parentPeerId && !memberRoleIds.value) return;
	return {
		...peerId ? { peerId } : {},
		...guildId ? { guildId } : {},
		...teamId ? { teamId } : {},
		...parentPeerId ? { parentPeerId } : {},
		...memberRoleIds.value ? { memberRoleIds: memberRoleIds.value } : {}
	};
}
/** Captures only authoritative inbound facts needed to replay configured route precedence. */
function conversationRouteContextFromMsgContext(ctx) {
	const channel = normalizeOptionalLowercaseString(ctx.OriginatingChannel ?? ctx.Provider);
	const spaceId = normalizeBoundedId(ctx.GroupSpace);
	const parentPeerId = normalizeBoundedId(ctx.ThreadParentId);
	return parseConversationRouteContext({
		...ctx.ConversationRoutePeerId !== void 0 ? { peerId: ctx.ConversationRoutePeerId } : {},
		...channel === "discord" && spaceId ? { guildId: spaceId } : {},
		...(channel === "slack" || channel === "mattermost" || channel === "msteams") && spaceId ? { teamId: spaceId } : {},
		...parentPeerId ? { parentPeerId } : {},
		...ctx.MemberRoleIds !== void 0 ? { memberRoleIds: ctx.MemberRoleIds } : {}
	});
}
function serializeStoredConversationRouteContext(context, observedAt) {
	const canonical = context === null ? null : parseConversationRouteContext(context);
	if (context !== null && !canonical) throw new Error("Invalid conversation route context");
	return JSON.stringify({
		version: 1,
		writeId: randomUUID(),
		observedAt,
		context: canonical ?? null
	});
}
function parseStoredConversationRouteContext(value, expectedObservedAt) {
	if (!value || value.length > MAX_STORED_ROUTE_CONTEXT_LENGTH) return;
	let parsed;
	try {
		parsed = JSON.parse(value);
	} catch {
		return;
	}
	if (!isRecord(parsed) || parsed.version !== 1 || typeof parsed.writeId !== "string" || parsed.writeId.length === 0 || typeof parsed.observedAt !== "number" || parsed.observedAt !== expectedObservedAt) return;
	const context = parseConversationRouteContext(parsed.context);
	if (parsed.context !== null && !context) return;
	return context ? { context } : {};
}
function refreshStoredConversationRouteContext(value, previousObservedAt, observedAt) {
	const stored = parseStoredConversationRouteContext(value, previousObservedAt);
	return stored ? serializeStoredConversationRouteContext(stored.context ?? null, observedAt) : null;
}
//#endregion
//#region src/config/sessions/metadata.ts
const mergeSessionOrigin = (existing, next) => {
	if (!existing && !next) return;
	const merged = existing ? { ...existing } : {};
	const nextProvider = next?.provider;
	const nextIsDeliverableChannel = nextProvider != null && nextProvider !== "webchat" && !isInternalNonDeliveryChannel(nextProvider);
	if (existing != null && nextIsDeliverableChannel && (existing.provider != null && nextProvider !== existing.provider || existing.surface != null && next?.surface != null && next.surface !== existing.surface || existing.accountId != null && next?.accountId != null && next.accountId !== existing.accountId)) {
		delete merged.nativeChannelId;
		delete merged.nativeDirectUserId;
		delete merged.avatar;
		delete merged.accountId;
		delete merged.threadId;
	}
	if (next?.label) merged.label = next.label;
	if (next?.provider) merged.provider = next.provider;
	if (next?.surface) merged.surface = next.surface;
	if (next?.chatType) merged.chatType = next.chatType;
	if (next?.from) merged.from = next.from;
	if (next?.to) merged.to = next.to;
	if (next?.nativeChannelId) merged.nativeChannelId = next.nativeChannelId;
	if (next?.nativeDirectUserId) merged.nativeDirectUserId = next.nativeDirectUserId;
	if (next?.avatar) merged.avatar = next.avatar;
	if (next?.accountId) merged.accountId = next.accountId;
	if (next?.threadId != null && next.threadId !== "") merged.threadId = next.threadId;
	return Object.keys(merged).length > 0 ? merged : void 0;
};
/** Derives session origin metadata from an inbound message context. */
function deriveSessionOrigin(ctx, opts) {
	if (opts?.skipSystemEventOrigin && ctx.InternalTurnSource !== void 0) return;
	const label = normalizeOptionalString(resolveConversationLabel(ctx));
	const providerRaw = typeof ctx.OriginatingChannel === "string" && ctx.OriginatingChannel || ctx.Surface || ctx.Provider;
	const provider = normalizeMessageChannel(providerRaw);
	const surface = normalizeOptionalLowercaseString(ctx.Surface);
	const chatType = normalizeChatType(ctx.ChatType) ?? void 0;
	const from = normalizeOptionalString(ctx.From);
	const to = normalizeOptionalString(typeof ctx.OriginatingTo === "string" ? ctx.OriginatingTo : ctx.To);
	const nativeChannelId = normalizeOptionalString(ctx.NativeChannelId);
	const nativeDirectUserId = normalizeOptionalString(ctx.NativeDirectUserId);
	const avatar = normalizeOptionalString(ctx.ConversationAvatar);
	const accountId = normalizeOptionalString(ctx.AccountId);
	const threadId = ctx.MessageThreadId ?? void 0;
	const origin = {};
	if (label) origin.label = label;
	if (provider) origin.provider = provider;
	if (surface) origin.surface = surface;
	if (chatType) origin.chatType = chatType;
	if (from) origin.from = from;
	if (to) origin.to = to;
	if (nativeChannelId) origin.nativeChannelId = nativeChannelId;
	if (nativeDirectUserId) origin.nativeDirectUserId = nativeDirectUserId;
	if (avatar) origin.avatar = avatar;
	if (accountId) origin.accountId = accountId;
	if (threadId != null && threadId !== "") origin.threadId = threadId;
	return Object.keys(origin).length > 0 ? origin : void 0;
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
	const normalizedChannel = subjectLooksChannel && resolution.chatType !== "channel" ? normalizeChannelId(channel) : null;
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
	if (!groupPatch && !origin) return null;
	const patch = groupPatch ? { ...groupPatch } : {};
	const existingOrigin = sessionDeliveryOrigin(params.existing);
	const mergedOrigin = mergeSessionOrigin(existingOrigin, origin);
	if (mergedOrigin) {
		if (!patch.chatType && mergedOrigin.chatType) patch.chatType = mergedOrigin.chatType;
		const nextProvider = origin?.provider;
		const nextOwnsExternalRoute = Boolean(nextProvider && nextProvider !== "webchat" && !isInternalNonDeliveryChannel(nextProvider));
		const existingRoute = sessionDeliveryRoute(params.existing);
		const existingRouteAccountId = existingRoute?.accountId ?? deliveryContextFromSession(params.existing)?.accountId;
		const freshRouteOwnsNextProvider = params.preserveExistingDeliveryRoute === true && nextProvider != null && existingRoute?.channel === nextProvider && (origin?.accountId == null || existingRouteAccountId === origin.accountId);
		const deliveryIdentityChanged = nextOwnsExternalRoute && !freshRouteOwnsNextProvider && (!existingOrigin || existingOrigin.provider != null && nextProvider !== existingOrigin.provider || existingOrigin.surface != null && origin?.surface != null && origin.surface !== existingOrigin.surface || existingOrigin.accountId != null && origin?.accountId != null && origin.accountId !== existingOrigin.accountId);
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
	const merged = mergeDeliveryContext(mergedInput, fallbackContext);
	const delivery = normalizeSessionDeliveryState({
		route: params.route,
		context: {
			channel: merged?.channel,
			to: merged?.to,
			accountId: merged?.accountId,
			threadId: merged?.threadId
		},
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
	const normalized = normalizeChatType(typeof value === "string" ? value : void 0);
	if (normalized === "channel") return "channel";
	if (normalized === "group") return "group";
	return "direct";
}
function resolvePairedOriginPeerId(params) {
	if (params.kind !== "direct") return;
	const origin = sessionDeliveryOrigin(params.entry);
	const originFrom = normalizeOptionalString(origin?.from);
	const originTo = normalizeOptionalString(origin?.to);
	const originChannel = normalizeOptionalString(origin?.provider)?.toLowerCase();
	const deliveryChannel = normalizeOptionalString(params.deliveryContext?.channel)?.toLowerCase();
	if (!originFrom || originTo !== params.deliveryTarget || !originChannel || originChannel !== deliveryChannel || normalizeChatType(origin?.chatType) !== params.kind || (normalizeOptionalAccountId(origin?.accountId) ?? "default") !== (normalizeOptionalAccountId(params.deliveryContext?.accountId) ?? "default") || normalizeThreadId(origin?.threadId) !== normalizeThreadId(params.deliveryContext?.threadId)) return;
	return originFrom;
}
/** Builds one stable transport address from authoritative channel route facts. */
function buildConversationIdentity(params) {
	const channel = normalizeOptionalString(params.channel)?.toLowerCase();
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
		...normalizeOptionalString(params.nativeChannelId) ? { nativeChannelId: normalizeOptionalString(params.nativeChannelId) } : {},
		...normalizeOptionalString(params.nativeDirectUserId) ? { nativeDirectUserId: normalizeOptionalString(params.nativeDirectUserId) } : {},
		...normalizeOptionalString(params.label) ? { label: normalizeOptionalString(params.label) } : {},
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
	let metadata;
	if (row?.metadata_json) try {
		const parsed = JSON.parse(row.metadata_json);
		metadata = isRecord(parsed) ? parsed : void 0;
	} catch {
		metadata = void 0;
	}
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
	executeSqliteQuerySync(database.db, db.insertInto("conversations").values({
		conversation_id: identity.conversationRef,
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
		metadata_json: identity.metadata ? JSON.stringify(identity.metadata) : null,
		created_at: updatedAt,
		updated_at: updatedAt
	}).onConflict((conflict) => conflict.column("conversation_id").doUpdateSet({
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
		metadata_json: identity.metadata ? JSON.stringify(identity.metadata) : null,
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
					mutations.push({
						assertCurrent,
						commit: () => {
							assertCurrent();
							mutation.commit();
						},
						rollback: () => {
							assertCurrent();
							mutation.rollback();
						}
					});
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
					import("./execution-environment-NLLvUIRi.mjs"),
					import("./runtime-status-DblvLQHs.mjs"),
					import("./web-search-tool-policy-CAgXWubv.mjs")
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
//#region src/state/github-personal-publication-lifecycle.ts
/** Permanent session deletion owns all retained receipts, including pre-reset incarnations. */
function deletePersonalGitHubSessionReceipts(params) {
	const database = openOpenClawStateDatabase({ env: params.env });
	const existing = ["github_personal_publication_requests", "github_repository_publication_requests"].filter((table) => tableExists(database.db, table));
	if (existing.length === 0 || params.sessionKeys.length === 0) return;
	runOpenClawStateWriteTransaction(({ db }) => {
		if (existing.includes("github_personal_publication_requests") && tableExists(db, "github_publication_session_lifecycles")) {
			const query = getNodeSqliteKysely(db);
			executeSqliteQuerySync(db, query.deleteFrom("github_publication_session_lifecycles").where("publication_kind", "=", "personal").where("request_id", "in", query.selectFrom("github_personal_publication_requests").select("request_id").where("agent_id", "=", params.agentId).where("session_key", "in", params.sessionKeys)));
		}
		for (const table of existing) executeSqliteQuerySync(db, getNodeSqliteKysely(db).deleteFrom(table).where("agent_id", "=", params.agentId).where("session_key", "in", params.sessionKeys));
	}, { database }, { operationLabel: "github-personal-publication.session-delete" });
}
//#endregion
//#region src/state/session-repository-workspaces.ts
const table = "session_repository_workspaces";
const ensured = /* @__PURE__ */ new WeakSet();
const query = (db) => getNodeSqliteKysely(db);
const manifestPattern = /^sha256:[a-f0-9]{64}$/u;
const resultRefPattern = /^refs\/openclaw\/worker-results\/[A-Za-z0-9-]+$/u;
function bounded(value, field, limit) {
	const result = value.trim();
	if (!result || result.length > limit || /\p{Cc}/u.test(result)) throw new Error(`Repository workspace ${field} is invalid`);
	return result;
}
function project(row) {
	return {
		workspaceId: row.workspace_id,
		agentId: row.agent_id,
		sessionKey: row.session_key,
		url: row.url,
		requestedRef: row.requested_ref,
		runSetupScript: row.run_setup_script === 1,
		baseCommit: row.base_commit,
		baseManifestHash: row.base_manifest_hash,
		branch: row.branch,
		checkpointRef: row.checkpoint_ref,
		manifestHash: row.manifest_hash,
		revision: row.revision,
		createdAtMs: row.created_at_ms,
		updatedAtMs: row.updated_at_ms
	};
}
function readWorkspace(db, workspaceId) {
	if (!tableExists(db, table)) return;
	const row = executeSqliteQueryTakeFirstSync(db, query(db).selectFrom(table).selectAll().where("workspace_id", "=", workspaceId));
	return row ? project(row) : void 0;
}
function findWorkspace(db, owner) {
	if (!tableExists(db, table)) return;
	const row = executeSqliteQueryTakeFirstSync(db, query(db).selectFrom(table).selectAll().where("agent_id", "=", owner.agentId).where("session_key", "=", owner.sessionKey));
	return row ? project(row) : void 0;
}
function createSessionRepositoryWorkspaceStore(options = {}) {
	const databasePath = options.database?.path ?? path.resolve(resolveOpenClawStateSqlitePath());
	const now = options.now ?? Date.now;
	const read = () => openOpenClawStateDatabase({ path: databasePath }).db;
	const write = (operation) => runOpenClawStateWriteTransaction(({ db }) => operation(db), { path: databasePath });
	const ensure = () => {
		const db = read();
		if (!ensured.has(db)) {
			write(ensureSessionRepositoryWorkspaceSchema);
			if (!db.isTransaction) ensured.add(db);
		}
	};
	const get = (workspaceId) => readWorkspace(read(), workspaceId);
	const find = (owner) => findWorkspace(read(), owner);
	const mutate = (input, values) => write((db) => {
		const current = readWorkspace(db, input.workspaceId);
		if (!current || current.revision !== input.expectedRevision) throw new Error("Repository workspace revision changed");
		if (!Number.isSafeInteger(current.revision + 1)) throw new Error("Repository workspace revision is exhausted");
		const patch = values(current);
		input.assertCurrent();
		const updated = executeSqliteQueryTakeFirstSync(db, query(db).updateTable(table).set({
			...patch,
			revision: current.revision + 1,
			updated_at_ms: now()
		}).where("workspace_id", "=", input.workspaceId).where("revision", "=", input.expectedRevision).returningAll());
		if (!updated) throw new Error("Repository workspace revision changed");
		sessionChanges.emit({
			agentId: updated.agent_id,
			sessionKey: updated.session_key
		}, db);
		return project(updated);
	});
	const artifactPath = (workspaceId) => {
		if (!/^[a-f0-9-]{36}$/u.test(workspaceId)) throw new Error("Repository workspace id is invalid");
		return path.join(path.dirname(databasePath), "repository-workspaces", `${workspaceId}.git`);
	};
	return {
		path: databasePath,
		artifactPath,
		get,
		find,
		create(input) {
			const agentId = bounded(input.agentId, "agent id", 128);
			const sessionKey = bounded(input.sessionKey, "session key", 1024);
			const url = bounded(input.url, "URL", 4096);
			const requestedRef = input.requestedRef === void 0 ? null : bounded(input.requestedRef, "ref", 1024);
			const branch = input.branch === void 0 ? void 0 : bounded(input.branch, "branch", 256);
			input.assertCurrent();
			ensure();
			return write((db) => {
				input.assertCurrent();
				const existing = findWorkspace(db, {
					agentId,
					sessionKey
				});
				if (existing) {
					if (existing.url !== url || existing.requestedRef !== requestedRef || branch !== void 0 && existing.branch !== branch) throw new Error("Session already owns a different repository workspace");
					return existing;
				}
				const workspaceId = randomUUID();
				const timestamp = now();
				const inserted = executeSqliteQueryTakeFirstSync(db, query(db).insertInto(table).values({
					workspace_id: workspaceId,
					agent_id: agentId,
					session_key: sessionKey,
					url,
					requested_ref: requestedRef,
					run_setup_script: input.runSetupScript ? 1 : 0,
					base_commit: null,
					base_manifest_hash: null,
					branch: branch ?? `openclaw/${workspaceId}`,
					checkpoint_ref: null,
					manifest_hash: null,
					revision: 0,
					created_at_ms: timestamp,
					updated_at_ms: timestamp
				}).returningAll());
				if (!inserted) throw new Error("Repository workspace creation failed");
				sessionChanges.emit({
					agentId: inserted.agent_id,
					sessionKey: inserted.session_key
				}, db);
				return project(inserted);
			});
		},
		bindBase(input) {
			if (!/^[a-f0-9]{40}(?:[a-f0-9]{24})?$/u.test(input.baseCommit) || input.baseManifestHash !== void 0 && !manifestPattern.test(input.baseManifestHash)) throw new Error("Repository workspace base is invalid");
			return mutate(input, (current) => {
				if (current.baseCommit !== null && current.baseCommit !== input.baseCommit || current.baseManifestHash !== null && input.baseManifestHash !== void 0 && current.baseManifestHash !== input.baseManifestHash) throw new Error("Repository workspace base changed");
				return {
					base_commit: input.baseCommit,
					...input.baseManifestHash ? { base_manifest_hash: input.baseManifestHash } : {}
				};
			});
		},
		acceptCheckpoint(input) {
			if (!resultRefPattern.test(input.checkpointRef) || !manifestPattern.test(input.manifestHash)) throw new Error("Repository workspace checkpoint is invalid");
			return mutate(input, (current) => {
				if (!current.baseCommit || !current.baseManifestHash) throw new Error("Repository workspace base has not been captured");
				return {
					checkpoint_ref: input.checkpointRef,
					manifest_hash: input.manifestHash
				};
			});
		},
		async delete(input) {
			const root = artifactPath(input.workspaceId);
			write((db) => {
				input.assertCurrent();
				if (tableExists(db, table)) {
					const deleted = executeSqliteQueryTakeFirstSync(db, query(db).deleteFrom(table).where("workspace_id", "=", input.workspaceId).returning(["agent_id", "session_key"]));
					if (deleted) sessionChanges.emit({
						agentId: deleted.agent_id,
						sessionKey: deleted.session_key
					}, db);
				}
			});
			await fs.rm(root, {
				recursive: true,
				force: true
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
const transactionMutations = new AsyncLocalStorage();
/** Worker commits cannot carry parent-thread native-owner rollback closures. */
function hasPreparedNativeSessionDeletion() {
	const prepared = deletions.getStore();
	return prepared !== void 0 && [...prepared.values()].some((entry) => entry.mutations.length > 0 || entry.target.initialization !== void 0);
}
/** Keep ordinary updates serialized; release the writer for preparation or source custody. */
async function runPreparedSqliteSessionWrite(scope, prepare, operation, withCommit) {
	const prepared = await runExclusiveSqliteSessionWrite(scope, async () => {
		const write = await prepare();
		return write.deletedEntries.length || write.beforeCommit || withCommit ? { write } : { result: await write.commit() };
	}, operation);
	if (!prepared.write) return {
		deletedEntries: 0,
		result: prepared.result
	};
	const write = prepared.write;
	const commit = async (assertCurrent) => {
		await write.beforeCommit?.();
		const runCommit = async (assertSourceCurrent) => await runExclusiveSqliteSessionWrite(scope, async () => {
			return await withSqliteSessionDatabase(toDatabaseOptions(scope), () => write.commit(assertSourceCurrent), assertCurrent);
		}, operation);
		return withCommit ? await withCommit(runCommit) : await runCommit();
	};
	const result = write.deletedEntries.length || write.beforeCommit ? await withSqliteSessionDeletions(scope, write.deletedEntries, commit) : await commit();
	return {
		deletedEntries: write.deletedEntries.length,
		result
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
	const repositories = options.contextReset ? void 0 : createSessionRepositoryWorkspaceStore({ database: openOpenClawStateDatabase({ env: scope.env }) });
	const repositoryWorkspaces = (options.contextReset ? [] : targets).flatMap((target) => {
		const workspace = repositories?.find(target);
		return workspace ? [workspace] : [];
	});
	const invoke = async (prepared) => {
		const assertCurrent = () => {
			targets.forEach(assertTargetIdle);
			for (const mutations of prepared.values()) mutations.forEach((mutation) => mutation.assertCurrent());
		};
		assertCurrent();
		return await deletions.run(new Map(targets.map((target) => [target.sessionKey, {
			target,
			mutations: prepared.get(target.sessionKey) ?? [],
			assertIdle: () => assertTargetIdle(target),
			contextReset: options.contextReset
		}])), async () => {
			try {
				return await run(assertCurrent);
			} finally {
				for (const workspace of repositoryWorkspaces) {
					const currentEntry = () => readSessionEntryRow(openOpenClawAgentDatabase(toDatabaseOptions(scope)), workspace.sessionKey);
					if (currentEntry()) continue;
					deletePersonalGitHubSessionReceipts({
						agentId: workspace.agentId,
						env: scope.env,
						sessionKeys: [workspace.sessionKey]
					});
					await repositories?.delete({
						workspaceId: workspace.workspaceId,
						assertCurrent: () => {
							if (currentEntry()) throw new Error("Repository workspace session changed before deletion");
						}
					});
				}
			}
		});
	};
	return await runExclusiveSessionLifecycleMutation({
		scope: ownerStorePath,
		identities: [...targets.flatMap((target) => [target.sessionKey, target.sessionId]), ...options.additionalIdentities ?? []],
		run: async () => prepare ? await prepare(targets, invoke) : await invoke(/* @__PURE__ */ new Map())
	});
}
/** Called only at the synchronous SQL edge, after the operation revalidates its row snapshot. */
function commitSqliteSessionDeletion(sessionKey, entry) {
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
		if (!committed) for (const mutation of rollback.toReversed()) try {
			mutation.rollback();
		} catch (rollbackError) {
			failures.push(rollbackError);
		}
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
const sessionEntryWriteQueries = /* @__PURE__ */ new WeakMap();
function getSessionEntryWriteQueries(database) {
	let queries = sessionEntryWriteQueries.get(database);
	if (!queries) {
		queries = prepareSessionEntryWriteQueries(database);
		sessionEntryWriteQueries.set(database, queries);
	}
	return queries;
}
//#endregion
//#region src/config/sessions/session-accessor.sqlite-maintenance-age-queries.ts
const readersByDatabase = /* @__PURE__ */ new WeakMap();
function createAgeReaders(database) {
	const db = getNodeSqliteKysely(database);
	const projection = db.selectFrom("session_nodes").select([
		"session_key",
		"updated_at",
		"archived_at",
		"last_activity_at",
		"last_interaction_at"
	]).select((eb) => eb.case().when(eb.fn("json_valid", ["entry_json"]), "=", 1).then(eb.cast(eb.fn("json_extract", [eb.ref("entry_json"), eb.val("$.sessionStartedAt")]), "integer")).else(null).end().as("session_started_at"));
	const ordered = db.selectFrom(projection.modifyEnd(sql`INDEXED BY idx_agent_session_nodes_updated_at`).as("age_rows")).where("archived_at", "is", null).orderBy("updated_at", "asc").orderBy("session_key", "desc");
	const dashboards = db.withRecursive("age_namespaces", (query) => query.selectFrom("session_nodes").select((eb) => eb.fn.min("session_key").as("first_key")).where("session_key", ">=", "agent:").where("session_key", "<", "agent;").unionAll(query.selectFrom("age_namespaces").select((eb) => eb.selectFrom("session_nodes").select((inner) => inner.fn.min("session_key").as("first_key")).where("session_key", ">", sql`CASE
                    WHEN instr(substr(${eb.ref("age_namespaces.first_key")}, 7), ':') > 0
                    THEN substr(${eb.ref("age_namespaces.first_key")}, 1, 5 + instr(substr(${eb.ref("age_namespaces.first_key")}, 7), ':')) || ';'
                    ELSE ${eb.ref("age_namespaces.first_key")}
                  END`).where("session_key", "<", "agent;").as("first_key")).where("first_key", "is not", null))).selectFrom("age_namespaces").crossJoin(projection.as("age_rows")).where("age_rows.session_key", ">=", sql`substr(first_key, 1, 6 + instr(substr(first_key, 7), ':')) || 'dashboard:'`).where("age_rows.session_key", "<", sql`substr(first_key, 1, 6 + instr(substr(first_key, 7), ':')) || 'dashboard;'`).where("archived_at", "is", null).selectAll("age_rows");
	const uncertified = db.selectFrom("session_canonical_validation_pending as pending").crossJoin(projection.as("age_rows")).whereRef("pending.session_key", "=", "age_rows.session_key").where("archived_at", "is", null).selectAll("age_rows");
	return {
		after: prepareSqliteQueryIterator(database, (parameter) => ordered.select(["session_key", "updated_at"]).where("updated_at", ">", parameter((minimum) => minimum))),
		activity: prepareSqliteQueryIterator(database, () => ordered.selectAll("age_rows")),
		dashboards: prepareSqliteQueryIterator(database, () => dashboards),
		uncertified: prepareSqliteQueryIterator(database, () => uncertified)
	};
}
function readSessionMaintenanceAgeQueries(database) {
	let readers = readersByDatabase.get(database);
	if (!readers) {
		readers = createAgeReaders(database);
		readersByDatabase.set(database, readers);
	}
	return readers;
}
//#endregion
//#region src/config/sessions/session-accessor.sqlite-maintenance-age.ts
const SESSION_ENTRY_MAINTENANCE_INTERVAL_MS = 18e5;
const ageFacts = /* @__PURE__ */ new WeakMap();
function stageSessionEntryMaintenanceAgeFact(db, fact) {
	if (stageSqliteTransactionState(db, {
		stage: () => ageFacts.set(db, { fact }),
		rollback: () => ageFacts.delete(db),
		commit: () => {}
	})) return;
	if (!db.isTransaction) ageFacts.set(db, { fact });
}
function invalidateSessionEntryMaintenanceAgeFact(db) {
	ageFacts.delete(db);
}
function readSessionEntryMaintenanceAgeFact(db, maintenance) {
	const fact = ageFacts.get(db)?.fact;
	if (!fact) return;
	const now = Date.now();
	if (agePolicy(fact.maintenance) !== agePolicy(maintenance) || now >= fact.recheckAt || fact.recheckAt > now + 18e5) {
		invalidateSessionEntryMaintenanceAgeFact(db);
		return;
	}
	return fact;
}
/** Capture identity stays local; only its scalar fact crosses the Worker boundary. */
function captureSessionEntryMaintenanceAgeFact(db, maintenance) {
	readSessionEntryMaintenanceAgeFact(db, maintenance);
	let capture = ageFacts.get(db);
	if (!capture) {
		capture = {};
		ageFacts.set(db, capture);
	}
	return capture;
}
function isSessionEntryMaintenanceAgeCaptureCurrent(db, capture) {
	return ageFacts.get(db) === capture;
}
function adoptSessionEntryMaintenanceAgeFact(db, capture, fact) {
	if (isSessionEntryMaintenanceAgeCaptureCurrent(db, capture)) capture.fact = fact;
}
function isDashboardKey(key) {
	return parseAgentSessionKey(key)?.rest.startsWith("dashboard:") === true;
}
/** Tracked writes can only bring the conservative age boundary forward. */
function advanceSessionEntryMaintenanceAgeFact(db, update) {
	const fact = ageFacts.get(db)?.fact;
	if (!fact) {
		invalidateSessionEntryMaintenanceAgeFact(db);
		return;
	}
	if (update.entry.archivedAt !== void 0) return;
	const { entry, previousEntry } = update;
	if (previousEntry && (previousEntry.archivedAt !== void 0 || entry.updatedAt < previousEntry.updatedAt || getSessionMaintenanceActivityAt(entry) < getSessionMaintenanceActivityAt(previousEntry))) {
		invalidateSessionEntryMaintenanceAgeFact(db);
		return;
	}
	const at = nextEntryAgeAt(update.sessionKey, entry, fact.maintenance, previousEntry ? Date.now() : -Infinity);
	if (!previousEntry || at < fact.next.at) stageSessionEntryMaintenanceAgeFact(db, {
		...fact,
		next: { at: Math.min(at, fact.next.at) }
	});
}
function agePolicy(maintenance) {
	return JSON.stringify([
		maintenance.pruneAfterMs,
		maintenance.archiveDashboardAfterMs,
		maintenance.preserveRecentMs
	]);
}
function nextEntryAgeAt(key, entry, maintenance, now) {
	if (shouldPreserveMaintenanceEntry({
		key,
		entry: void 0
	})) return Infinity;
	const activityAt = getSessionMaintenanceActivityAt(entry);
	let next = Infinity;
	for (const [timestamp, age] of [
		[entry?.updatedAt ?? 0, maintenance.pruneAfterMs],
		[activityAt, isDashboardKey(key) ? maintenance.archiveDashboardAfterMs : null],
		[activityAt, maintenance.preserveRecentMs]
	]) if (timestamp != null && age != null && age > 0) {
		const at = timestamp + age + 1;
		if (at > now) next = Math.min(next, at);
	}
	return next;
}
function nextAgeAt(timestamp, age, plannedAt) {
	const at = age != null && age > 0 ? timestamp + age + 1 : Infinity;
	return at > plannedAt ? at : Infinity;
}
function readActivityAt(row) {
	return getSessionMaintenanceActivityAt({
		updatedAt: row.updated_at,
		lastActivityAt: row.last_activity_at ?? void 0,
		lastInteractionAt: row.last_interaction_at ?? void 0,
		sessionStartedAt: row.session_started_at ?? void 0
	});
}
/** The caller's transaction keeps these indexed probes in one snapshot. */
function recordSessionEntryMaintenanceAgeFact(database, maintenance, plannedAt) {
	const next = { at: Infinity };
	const fact = {
		maintenance,
		next,
		recheckAt: plannedAt + SESSION_ENTRY_MAINTENANCE_INTERVAL_MS
	};
	const queries = readSessionMaintenanceAgeQueries(database.db);
	if (maintenance.pruneAfterMs > 0) {
		for (const row of queries.after(plannedAt - maintenance.pruneAfterMs - 1)) if (!shouldPreserveMaintenanceEntry({
			key: row.session_key,
			entry: void 0
		})) {
			next.at = row.updated_at + maintenance.pruneAfterMs + 1;
			break;
		}
	}
	const dashboardRows = hasCanonicalSessionValidationProjection(database) ? [queries.dashboards(void 0), queries.uncertified(void 0)] : [queries.activity(void 0)];
	for (const rows of dashboardRows) for (const row of rows) {
		if (!isDashboardKey(row.session_key) || shouldPreserveMaintenanceEntry({
			key: row.session_key,
			entry: void 0
		})) continue;
		next.at = Math.min(next.at, nextAgeAt(readActivityAt(row), maintenance.archiveDashboardAfterMs, plannedAt));
	}
	const recentAge = maintenance.preserveRecentMs;
	if (recentAge != null && recentAge > 0) for (const row of queries.activity(void 0)) {
		if (row.updated_at + recentAge + 1 >= next.at) break;
		if (!shouldPreserveMaintenanceEntry({
			key: row.session_key,
			entry: void 0
		})) next.at = Math.min(next.at, nextAgeAt(readActivityAt(row), recentAge, plannedAt));
	}
	stageSessionEntryMaintenanceAgeFact(database.db, fact);
}
/** The kick uses the same periodic deadline as inline maintenance callers. */
function readSessionEntryMaintenanceNextAgeAt(database, maintenance) {
	if (maintenance.mode !== "enforce") return;
	const fact = readSessionEntryMaintenanceAgeFact(database.db, maintenance);
	return fact ? Math.min(fact.next.at, fact.recheckAt) : Date.now();
}
//#endregion
//#region src/config/sessions/session-accessor.sqlite-pending-inputs.ts
const owners = resolveGlobalSingleton(Symbol.for("openclaw.sessionPendingInputOwners"), () => ({
	live: /* @__PURE__ */ new Map(),
	current: new AsyncLocalStorage(),
	relocation: new AsyncLocalStorage(),
	transactionRelocations: /* @__PURE__ */ new WeakMap()
}));
const recoveredDedupeOwners = resolveGlobalSingleton(Symbol.for("openclaw.sessionPendingInputDedupeRecoveries"), () => /* @__PURE__ */ new WeakSet());
registerAgentEventLifecycleRotationHandler("session-pending-inputs", () => {
	const failures = [];
	for (const owner of owners.live.values()) try {
		owner.finish("interrupted");
	} catch (error) {
		failures.push(error);
	}
	if (failures.length) throw new AggregateError(failures, "Failed to record interrupted pending inputs");
});
function registerSessionPendingInputOwner(owner) {
	if (owners.live.has(owner.inputId)) throw new Error("Pending input already has a live owner");
	owners.live.set(owner.inputId, owner);
}
function releaseSessionPendingInputOwner(owner) {
	if (owners.live.get(owner.inputId) === owner) owners.live.delete(owner.inputId);
}
function assertPendingInputOwnerCurrent(owner) {
	if (owner.sources) {
		for (const source of owner.sources) assertPendingInputOwnerCurrent(source);
		return;
	}
	if (owners.live.get(owner.inputId) !== owner || !isAgentEventLifecycleGenerationCurrent(owner.lifecycleGeneration)) throw new SessionPendingInputCustodyError("Pending input ownership ended; submit a new turn to continue");
	owner.assertCurrent();
}
function runWithSessionPendingInput(owner, run) {
	assertPendingInputOwnerCurrent(owner);
	return owners.current.run(owner, run);
}
/** Persistence alone may mirror a closed turn; the append owner proves exact committed bytes. */
function runWithSessionPendingInputPersistence(owner, persist) {
	return owners.current.run(owner, persist);
}
/** A transcript rewrite may move only the exact current user owned by the live admitted turn. */
function withSessionPendingInputRelocation(sourceInputId, message, append) {
	const owner = owners.current.getStore();
	const record = asOptionalRecord(message);
	const ownsSource = owner?.transcriptInputId === sourceInputId;
	const claimsOwner = record?.role === "user" && record.idempotencyKey === owner?.idempotencyKey;
	if (!owner || !ownsSource && !claimsOwner) return append();
	assertPendingInputOwnerCurrent(owner);
	if (JSON.stringify(message) !== owner.messageJson) throw new Error("Pending input relocation does not match its admitted transcript entry");
	return owners.relocation.run({
		owner,
		sourceInputId
	}, append);
}
/** Registration owns disposition; execution and promotion check the private operational predicates. */
function readSessionPendingInputOwnerIds(database, rows) {
	const candidates = rows.filter((row) => {
		const owner = owners.live.get(row.input_id);
		return owner?.databasePath === database.path && owner.sessionId === row.session_id && owner.sessionKey === row.session_key && owner.lifecycleGeneration === row.lifecycle_generation && isAgentEventLifecycleGenerationCurrent(owner.lifecycleGeneration);
	});
	if (!candidates.length) return /* @__PURE__ */ new Set();
	const sessions = executeSqliteQuerySync(database.db, getSessionKysely(database.db).selectFrom("session_nodes").select(["session_key", "current_session_id"]).where("session_key", "in", [...new Set(candidates.map((row) => row.session_key))])).rows;
	const current = new Map(sessions.map((row) => [row.session_key, row.current_session_id]));
	return new Set(candidates.filter((row) => current.get(row.session_key) === row.session_id).map((row) => row.input_id));
}
function parseSessionPendingInputMessage(messageJson) {
	const value = JSON.parse(messageJson);
	if (asOptionalRecord(value)?.role !== "user") throw new Error("Pending input has an invalid persisted user message");
	return value;
}
function isFinalInputCompletion(outcome) {
	return outcome.reason === "completed" || outcome.reason === "cancelled" && outcome.stopReason !== "restart";
}
function readSessionInputCompletion(database, scope) {
	const row = executeSqliteQueryTakeFirstSync(database.db, getSessionKysely(database.db).selectFrom("session_input_completions").selectAll().where("session_key", "=", scope.sessionKey).where("session_id", "=", scope.sessionId).where("idempotency_key", "=", scope.idempotencyKey));
	if (!row) return;
	const outcome = JSON.parse(row.outcome_json);
	return {
		...row,
		outcome
	};
}
/** The caller holds the write transaction and has revalidated the exact live admission owner. */
function writeSessionInputCompletion(database, scope, outcome) {
	const retained = readSessionInputCompletion(database, scope);
	if (retained && isFinalInputCompletion(retained.outcome)) return retained.outcome;
	const succeeded = classifyAgentRunTerminalOutcome(outcome) === "success";
	executeSqliteQuerySync(database.db, getSessionKysely(database.db).insertInto("session_input_completions").values({
		session_key: scope.sessionKey,
		session_id: scope.sessionId,
		idempotency_key: scope.idempotencyKey,
		run_id: scope.runId,
		request_hash: scope.requestHash,
		outcome_json: JSON.stringify(outcome),
		succeeded: succeeded ? 1 : 0,
		completed_at: Date.now()
	}).onConflict((conflict) => conflict.columns(["session_id", "idempotency_key"]).doUpdateSet({
		outcome_json: JSON.stringify(outcome),
		succeeded: succeeded ? 1 : 0,
		completed_at: Date.now()
	}).where("session_input_completions.succeeded", "=", 0)));
	if (isFinalInputCompletion(outcome)) executeSqliteQuerySync(database.db, getSessionKysely(database.db).deleteFrom("session_pending_inputs").where("session_key", "=", scope.sessionKey).where("session_id", "=", scope.sessionId).where("idempotency_key", "=", scope.idempotencyKey).where("run_id", "=", scope.runId).where("request_hash", "=", scope.requestHash).where("lifecycle_generation", "=", scope.lifecycleGeneration));
	return outcome;
}
function projectSessionPendingInput(row) {
	if (row.state !== "queued" && row.state !== "interrupted" && row.state !== "cancelled") throw new Error("Pending input has an invalid disposition");
	return {
		id: row.input_id,
		runId: row.run_id,
		message: parseSessionPendingInputMessage(row.message_json),
		acceptedAt: row.accepted_at,
		state: row.state
	};
}
/** Only a current recovered source can supersede its previous request receipt, once. */
function claimCurrentSessionPendingInputDedupeRecovery(database, scope, runId) {
	const owner = owners.current.getStore();
	if (!owner || owner.sources || owner.restartRecovered !== true || recoveredDedupeOwners.has(owner) || owner.databasePath !== database.path || owner.sessionId !== scope.sessionId || owner.sessionKey !== scope.sessionKey || owner.idempotencyKey !== `${runId}:user`) return false;
	assertPendingInputOwnerCurrent(owner);
	const row = readSessionPendingInputByKey(database, scope, owner.idempotencyKey);
	const current = Boolean(row && row.input_id === owner.inputId && row.run_id === runId && row.message_json === owner.messageJson && row.state === "queued" && row.consumed_event_id == null && readSessionPendingInputOwnerIds(database, [row]).has(owner.inputId));
	if (current) recoveredDedupeOwners.add(owner);
	return current;
}
/** Query only the exact physical transcript; copied keys cannot adopt another generation. */
function readSessionPendingInputByKey(database, scope, idempotencyKey) {
	if (!hasSessionPendingInputsSchema(database.db)) return;
	return executeSqliteQueryTakeFirstSync(database.db, getSessionKysely(database.db).selectFrom("session_pending_inputs").selectAll().where("session_id", "=", scope.sessionId).where("session_key", "=", scope.sessionKey).where("idempotency_key", "=", idempotencyKey));
}
/** The private call-path owner, not a copied id or durable row, permits promotion. */
function resolveSessionPendingInputAppend(database, scope, message) {
	const record = asOptionalRecord(message);
	if (record?.role !== "user" || typeof record.idempotencyKey !== "string") return;
	const idempotencyKey = record.idempotencyKey.trim();
	const row = readSessionPendingInputByKey(database, scope, idempotencyKey);
	const owner = owners.current.getStore();
	const ownsInput = owner?.idempotencyKey === idempotencyKey && owner.databasePath === database.path && owner.sessionId === scope.sessionId && owner.sessionKey === scope.sessionKey;
	if (!row && !ownsInput) return;
	if (!owner || !ownsInput || row && (row.input_id !== owner.inputId || row.consumed_event_id != null || row.state !== "queued" || row.lifecycle_generation !== owner.lifecycleGeneration)) throw new SessionPendingInputCustodyError("Pending input cannot be appended outside its admitted turn");
	const relocation = owners.relocation.getStore();
	const transcriptInputId = owners.transactionRelocations.get(database.db)?.get(owner) ?? owner.transcriptInputId;
	if (relocation?.owner === owner && relocation.sourceInputId !== transcriptInputId) throw new Error("Pending input relocation does not match its admitted transcript entry");
	const stageRelocation = relocation?.owner === owner ? (destinationInputId) => {
		let staged = owners.transactionRelocations.get(database.db);
		const hadPrevious = staged?.has(owner) ?? false;
		const previous = staged?.get(owner);
		if (!stageSqliteTransactionState(database.db, {
			stage: () => {
				staged ??= /* @__PURE__ */ new Map();
				owners.transactionRelocations.set(database.db, staged);
				staged.set(owner, destinationInputId);
			},
			rollback: () => {
				if (hadPrevious && previous !== void 0) staged?.set(owner, previous);
				else staged?.delete(owner);
				if (staged?.size === 0) owners.transactionRelocations.delete(database.db);
			},
			commit: () => {
				owner.transcriptInputId = destinationInputId;
				if (staged?.get(owner) === destinationInputId) staged.delete(owner);
				if (staged?.size === 0) owners.transactionRelocations.delete(database.db);
			}
		})) throw new Error("Pending input relocation requires a transcript write transaction");
	} : void 0;
	if (owner.sources) {
		const acceptedByKey = new Map(executeSqliteQuerySync(database.db, getSessionKysely(database.db).selectFrom("session_pending_inputs").selectAll().where("session_id", "=", scope.sessionId).where("session_key", "=", scope.sessionKey).where("idempotency_key", "in", owner.sources.map((source) => source.idempotencyKey))).rows.map((sourceRow) => [sourceRow.idempotency_key, sourceRow]));
		const sources = owner.sources.map((source) => {
			const accepted = acceptedByKey.get(source.idempotencyKey);
			if (!accepted || accepted.input_id !== source.inputId || accepted.lifecycle_generation !== source.lifecycleGeneration || accepted.message_json !== source.messageJson) throw new SessionPendingInputCustodyError("Collected input custody changed before transcript promotion");
			return accepted;
		});
		const alreadyPromoted = sources.every((source) => source.consumed_event_id === owner.inputId);
		if (!alreadyPromoted) {
			if (sources.some((source) => source.consumed_event_id != null || source.state !== "queued")) throw new SessionPendingInputCustodyError("Collected input custody ended before transcript promotion");
			assertPendingInputOwnerCurrent(owner);
		}
		return {
			inputId: transcriptInputId,
			message: parseSessionPendingInputMessage(owner.messageJson),
			alreadyPromoted,
			sourceInputIds: sources.map((source) => source.input_id),
			...alreadyPromoted && stageRelocation ? { stageRelocation } : {}
		};
	}
	if (row) assertPendingInputOwnerCurrent(owner);
	return {
		inputId: transcriptInputId,
		message: parseSessionPendingInputMessage(row?.message_json ?? owner.messageJson),
		alreadyPromoted: !row,
		...!row && stageRelocation ? { stageRelocation } : {}
	};
}
function consumeSessionPendingInput(database, pending) {
	if (pending.alreadyPromoted) return;
	const owner = owners.current.getStore();
	const inputIds = new Set(pending.sourceInputIds ?? [pending.inputId]);
	const consumedOwners = (owner?.sources ?? (owner ? [owner] : [])).filter((candidate) => owners.live.get(candidate.inputId) === candidate && candidate.databasePath === database.path && inputIds.has(candidate.inputId));
	if (pending.sourceInputIds) {
		if (executeSqliteQuerySync(database.db, getSessionKysely(database.db).updateTable("session_pending_inputs").set({ consumed_event_id: pending.inputId }).where("input_id", "in", [...pending.sourceInputIds]).where("state", "=", "queued").where("consumed_event_id", "is", null)).numAffectedRows !== BigInt(pending.sourceInputIds.length)) throw new SessionPendingInputCustodyError("Collected input custody changed during transcript promotion");
	} else if (executeSqliteQuerySync(database.db, getSessionKysely(database.db).deleteFrom("session_pending_inputs").where("input_id", "=", pending.inputId).where("state", "=", "queued")).numAffectedRows !== 1n) return;
	stageSqliteTransactionState(database.db, {
		stage: () => {},
		rollback: () => {},
		commit: () => {
			for (const consumedOwner of consumedOwners) consumedOwner.consumed = true;
		}
	});
}
/** Logical deletion also clears custody when transcript windows are retained. */
function deleteSessionPendingInputs(database, sessionKey) {
	if (hasSessionPendingInputsSchema(database.db)) executeSqliteQuerySync(database.db, getSessionKysely(database.db).deleteFrom("session_pending_inputs").where("session_key", "=", sessionKey));
}
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
			if (isFinalInputCompletion(JSON.parse(existing.outcome_json))) continue;
			if (!isFinalInputCompletion(JSON.parse(row.outcome_json)) && existing.completed_at >= row.completed_at) continue;
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
		session_suggestions: db.selectFrom("session_suggestions").selectAll().where("session_key", "=", sessionKey).orderBy("state").orderBy("created_at").orderBy("id")
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
	if (presentTables.has("session_members")) executeSqliteQuerySync(database.db, db.deleteFrom("session_members").where("session_key", "=", sessionKey));
	if (options.clearSuggestions !== false && presentTables.has("session_suggestions")) executeSqliteQuerySync(database.db, db.deleteFrom("session_suggestions").where("session_key", "=", sessionKey));
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
		"session_suggestions"
	]) {
		if (!presentTables.has(table)) continue;
		executeSqliteQuerySync(database.db, db.deleteFrom(table).where("session_key", "=", sessionKey));
	}
}
function readSessionNodeArtifactTables(database) {
	const db = getSessionKysely(database.db);
	return new Set(executeSqliteQuerySync(database.db, db.selectFrom("sqlite_schema").select("name").where("type", "=", "table").where("name", "in", [
		"board_tabs",
		"board_widgets",
		"heartbeat_outcomes",
		"session_members",
		"session_participants",
		"session_progress_cards",
		"session_suggestions"
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
function resolveSessionEntryProvenanceRow(params) {
	const db = getNodeSqliteKysely(params.database.db);
	const existingRoot = executeSqliteQueryTakeFirstSync(params.database.db, db.selectFrom("session_windows").select([
		"session_entry_provenance",
		"acp_owned",
		"plugin_owner_id",
		"hook_external_content_source"
	]).where("session_id", "=", params.entry.sessionId));
	if (existingRoot?.session_entry_provenance === 0 && (params.previousEntry?.sessionId === params.entry.sessionId || Boolean(executeSqliteQueryTakeFirstSync(params.database.db, db.selectFrom("transcript_events").select("seq").where("session_id", "=", params.entry.sessionId).limit(1))))) return {
		...params.boundSessionRow,
		session_entry_provenance: 0,
		acp_owned: 0,
		plugin_owner_id: null,
		hook_external_content_source: null
	};
	return existingRoot?.session_entry_provenance === 1 ? {
		...params.boundSessionRow,
		acp_owned: existingRoot.acp_owned === 1 ? 1 : params.boundSessionRow.acp_owned,
		plugin_owner_id: params.boundSessionRow.plugin_owner_id ?? existingRoot.plugin_owner_id,
		hook_external_content_source: params.boundSessionRow.hook_external_content_source ?? existingRoot.hook_external_content_source
	} : params.boundSessionRow;
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
function normalizeText(value) {
	return typeof value === "string" && value.trim() ? value.trim() : null;
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
	if (typeof entry.updatedAt === "number" && Number.isFinite(entry.updatedAt)) {
		if (entry.delivery === delivery) return entry;
		return delivery ? {
			...entry,
			delivery
		} : entry;
	}
	const updatedAt = typeof entry.sessionStartedAt === "number" && Number.isFinite(entry.sessionStartedAt) ? entry.sessionStartedAt : Date.now();
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
		previous_session_id: normalizeText(params.entry.previousSessionId),
		session_scope: resolveSqliteSessionScope(params.entry, params.sessionKey),
		started_at: finiteSqliteNumber(params.entry.startedAt),
		ended_at: finiteSqliteNumber(params.entry.endedAt),
		status: normalizeStatus(params.entry.status),
		chat_type: normalizeSessionRowChatType(params.entry.chatType),
		channel: resolveSqliteSessionChannel(params.entry),
		account_id: resolveSqliteSessionAccountId(params.entry),
		model_provider: normalizeText(params.entry.modelProvider),
		model: normalizeText(params.entry.model),
		agent_harness_id: normalizeText(params.entry.agentHarnessId),
		parent_session_key: normalizeText(params.entry.parentSessionKey),
		spawned_by: normalizeText(params.entry.spawnedBy),
		display_name: resolveSqliteSessionDisplayName(params.entry)
	};
}
/** Project the canonical entry blob into the logical-node query columns. */
function bindSessionNode(params) {
	const canonicalEntry = projectCanonicalSessionEntryShape({ ...params.entry });
	const actor = params.entry.createdActor;
	return {
		session_key: params.sessionKey,
		current_session_id: params.entry.sessionId,
		entry_json: JSON.stringify(stripRuntimeOnlySessionSkillsFields(canonicalEntry)),
		entry_valid: 1,
		updated_at: params.updatedAt,
		status: normalizeStatus(params.entry.status),
		created_at: finiteSqliteNumber(params.entry.createdAt),
		created_via: normalizeSqliteCreatedVia(params.entry.createdVia),
		created_actor_type: normalizeSqliteCreatedActorType(actor?.type),
		created_actor_id: normalizeText(actor?.id),
		project_id: normalizeText(params.entry.projectId),
		parent_session_key: normalizeText(params.entry.parentSessionKey) ?? normalizeText(params.entry.spawnedBy),
		spawned_by: normalizeText(params.entry.spawnedBy),
		fork_source_session_key: normalizeText(params.entry.forkSource?.sessionKey),
		fork_source_session_id: normalizeText(params.entry.forkSource?.sessionId),
		fork_source_entry_id: normalizeText(params.entry.forkSource?.entryId),
		label: normalizeText(params.entry.label),
		display_name: normalizeText(params.entry.displayName),
		category: normalizeText(params.entry.category),
		icon: normalizeText(canonicalEntry.icon),
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
function resolveSqliteSessionChannel(entry) {
	return normalizeText(sessionDeliveryChannel(entry));
}
function resolveSqliteSessionAccountId(entry) {
	return normalizeText(deliveryContextFromSession(entry)?.accountId);
}
function resolveSqliteSessionDisplayName(entry) {
	return normalizeText(entry.displayName) ?? normalizeText(entry.label) ?? normalizeText(entry.subject) ?? normalizeText(entry.groupId);
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
	if (exact) {
		const selected = readExactSessionEntryRow(database, sessionKey);
		return selected ? [{
			entry: selected.entry,
			sessionKey: selected.row.session_key,
			persistedRows: {
				lookupKeys: [sessionKey.trim()],
				rows: [selected.row]
			}
		}] : [];
	}
	const scanned = readSessionEntryRowScan(database, sessionKey);
	return scanned?.selected ? [{
		entry: scanned.selected.entry,
		sessionKey: scanned.selected.row.session_key,
		persistedRows: {
			lookupKeys: scanned.lookupKeys,
			rows: scanned.rows
		}
	}] : [];
}
/** Reuses preparation only when every persisted column still matches; otherwise hydrate. */
function readUnchangedLifecycleTargetSnapshot(database, prepared) {
	const persisted = prepared[0]?.persistedRows;
	if (!persisted || persisted.lookupKeys.length === 0) return;
	const rows = executeSqliteQuerySync(database.db, getSessionKysely(database.db).selectFrom("session_nodes").selectAll().where("session_key", "in", sqliteStringSet(persisted.lookupKeys)).orderBy("session_key", "asc")).rows;
	return isDeepStrictEqual(rows, persisted.rows) ? prepared : void 0;
}
function resolveLifecyclePrimaryEntry(database, target, options = {}) {
	const rows = target.storeKeys.flatMap((key) => {
		const sessionKey = key.trim();
		const row = readExactSessionEntryRow(database, sessionKey);
		return row ? [{
			sessionKey,
			entry: row.entry,
			rawRow: row.row
		}] : [];
	});
	if (rows.length > 1) throw canonicalSessionKeyMigrationRequiredError(`duplicate rows resolve to canonical session key ${target.canonicalKey}`);
	const [row] = rows;
	if (row && row.sessionKey !== target.canonicalKey && options.allowCanonicalMove !== true) throw canonicalSessionKeyMigrationRequiredError(`non-canonical persisted row resolves to session key ${target.canonicalKey}`);
	return row ? {
		entry: row.entry,
		sessionKey: row.sessionKey,
		persistedRows: {
			lookupKeys: target.storeKeys.map((key) => key.trim()),
			rows: [row.rawRow]
		}
	} : void 0;
}
function readLifecycleTargetSnapshot(database, target, options = {}) {
	assertCanonicalSqliteSessionKeysCurrent(database);
	const row = resolveLifecyclePrimaryEntry(database, normalizeLifecycleTarget(target), options);
	return row ? [row] : [];
}
function normalizeLifecycleTarget(target) {
	const canonicalKey = normalizeSqliteSessionKey(target.canonicalKey);
	return {
		canonicalKey,
		storeKeys: uniqueStrings([canonicalKey, ...target.storeKeys.map(normalizeSqliteSessionKey)])
	};
}
function deleteSessionEntryRows(database, sessionKey, options = {}) {
	const previousEntry = options.validatedEntry ?? readExactSessionEntryRow(database, sessionKey)?.entry;
	if (previousEntry) commitSqliteSessionDeletion(sessionKey, previousEntry);
	const db = getSessionKysely(database.db);
	const windows = executeSqliteQuerySync(database.db, db.selectFrom("session_windows").select("session_id").where("session_key", "=", sessionKey)).rows;
	const survivingNodes = windows.length > 0 ? executeSqliteQuerySync(database.db, db.selectFrom("session_nodes").select([
		"current_session_id",
		sessionEntryMetadataJson,
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
	if (options.deleteOwnedWindows) {
		deleteSessionDeliveryArtifacts(database, sessionKey, options.deliveryCleanupKeys);
		deleteSessionNodeArtifacts(database, sessionKey);
		executeSqliteQuerySync(database.db, db.deleteFrom("session_nodes").where("session_key", "=", sessionKey));
		publishSessionEntryCacheInvalidation(database, {
			sessionKey,
			facts: { kind: "removed" }
		});
		return;
	}
	const remainingWindow = executeSqliteQueryTakeFirstSync(database.db, db.selectFrom("session_windows").select(["session_id", "updated_at"]).where("session_key", "=", sessionKey).orderBy("updated_at", "desc").orderBy("session_id", "asc").limit(1));
	if (remainingWindow) {
		deleteSessionNodeArtifacts(database, sessionKey);
		clearSqliteSessionEntryPreservingWindows(database, {
			sessionId: remainingWindow.session_id,
			sessionKey,
			updatedAt: remainingWindow.updated_at
		});
		publishSessionEntryCacheInvalidation(database, {
			sessionKey,
			facts: { kind: "removed" }
		});
		return;
	}
	executeSqliteQuerySync(database.db, db.deleteFrom("session_nodes").where("session_key", "=", sessionKey));
	publishSessionEntryCacheInvalidation(database, {
		sessionKey,
		facts: { kind: "removed" }
	});
}
/** Remove the logical entry while retaining its node-owned transcript windows. */
function clearSqliteSessionEntryPreservingWindows(database, params) {
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
function sqliteLifecycleTargetMatchesExpectedEntry(database, target, expectedEntry) {
	const current = resolveLifecyclePrimaryEntry(database, target)?.entry;
	if (!current || !expectedEntry) return current === expectedEntry;
	return sqliteSessionEntriesEqual(current, expectedEntry);
}
function assertLifecycleTargetUnchanged(database, target, expectedEntry, operation) {
	if (sqliteLifecycleTargetMatchesExpectedEntry(database, target, expectedEntry)) return;
	throw new Error(`SQLite session entry changed before ${operation} lifecycle mutation`);
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
		assertCanonicalSessionKeyWriteMatchesDatabase(database, sessionKey);
		assertCanonicalSessionEntryLineageWrite(database, entry);
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
	const transcriptObservedAt = readTranscriptMutationStateInTransaction(database, normalizedEntry.sessionId).updatedAt ?? updatedAt;
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
	const sessionRow = resolveSessionEntryProvenanceRow({
		boundSessionRow: {
			...boundSessionRoot,
			primary_conversation_id: conversation?.role === "primary" ? conversation.identity.conversationRef : null,
			transcript_observed_at: transcriptObservedAt
		},
		database,
		entry: normalizedEntry,
		previousEntry
	});
	const sessionNode = bindSessionNode({
		entry: normalizedEntry,
		sessionKey,
		updatedAt
	});
	const queries = getSessionEntryWriteQueries(database.db);
	const writeGeneration = trackSessionEntryCacheWrite(database, () => {
		queries.node(sessionNode);
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
export { captureSessionInitializationOwner as $, releaseSessionPendingInputOwner as A, isSessionEntryMaintenanceAgeCaptureCurrent as B, isFinalInputCompletion as C, readSessionPendingInputByKey as D, readSessionInputCompletion as E, writeSessionInputCompletion as F, commitSqliteSessionDeletion as G, readSessionEntryMaintenanceNextAgeAt as H, SESSION_ENTRY_MAINTENANCE_INTERVAL_MS as I, runSqliteSessionDeletionTransaction as J, hasPreparedNativeSessionDeletion as K, adoptSessionEntryMaintenanceAgeFact as L, runWithSessionPendingInput as M, runWithSessionPendingInputPersistence as N, readSessionPendingInputOwnerIds as O, withSessionPendingInputRelocation as P, deletePersonalGitHubSessionReceipts as Q, captureSessionEntryMaintenanceAgeFact as R, consumeSessionPendingInput as S, projectSessionPendingInput as T, recordSessionEntryMaintenanceAgeFact as U, readSessionEntryMaintenanceAgeFact as V, stageSessionEntryMaintenanceAgeFact as W, withSqliteSessionDeletions as X, withSqliteSessionContextReset as Y, getSessionRepositoryWorkspaceStore as Z, deleteSessionDeliveryArtifacts as _, recordLegacyAcpMigrationCompletion as _t, normalizeLifecycleTarget as a, deriveLastRoutePatch as at, readSessionInputArtifactRows as b, sqliteSessionEntriesEqual as bt, readSessionIdentitySnapshot as c, conversationRouteContextFromMsgContext as ct, resolveLifecyclePrimaryEntry as d, readLegacyAcpMigrationContext as dt, createSessionInitialization as et, writeSessionEntry as f, recordLegacyAcpMigrationSources as ft, copySessionNodeArtifactsForRepair as g, prepareLegacyAcpMigrationSource as gt, createFallbackSessionEntry as h, legacyAcpMigrationSourceKey as ht, deleteSessionEntryRows as i, conversationIdentityFromMsgContext as it, resolveSessionPendingInputAppend as j, registerSessionPendingInputOwner as k, readUnchangedLifecycleTargetSnapshot as l, parseConversationRouteContext as lt, bindSessionWindowEntryProjection as m, legacyAcpMigrationBindingMatches as mt, deleteLegacySessionEntryRows as n, upsertConversationIdentity as nt, readLifecycleTargetSnapshot as o, deriveSessionMetaPatch as ot, resolveSessionPublicShare as p, hasLegacyAcpMigrationCompletion as pt, runPreparedSqliteSessionWrite as q, deleteLifecycleTargetRows as r, buildConversationIdentity as rt, readSessionEntrySelectionSnapshot as s, deriveSessionOrigin as st, assertLifecycleTargetUnchanged as t, withSessionInitializationSource as tt, rehomeSessionWindows as u, parseStoredConversationRouteContext as ut, deleteSessionMembersForRepair as v, assertLifecycleTargetSnapshotUnchanged as vt, parseSessionPendingInputMessage as w, claimCurrentSessionPendingInputDedupeRecovery as x, readSessionNodeArtifactFingerprint as y, sqliteLifecycleTargetSnapshotsEqual as yt, invalidateSessionEntryMaintenanceAgeFact as z };
