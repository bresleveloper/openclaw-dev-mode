import { c as normalizeOptionalLowercaseString, l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
import { D as resolveExpiresAtMsFromDurationMs, o as asDateTimestampMs } from "./number-coercion-CuVhdCBs.mjs";
import { r as resolveGlobalMap } from "./global-singleton-0m-JziJW.mjs";
import { b as uniqueValues } from "./string-normalization-CECOqf64.mjs";
import { a as getNodeSqliteKysely, r as executeSqliteQuerySync } from "./kysely-sync-K7ftY-g4.mjs";
import { f as withExistingOpenClawStateDatabaseReadOnly, t as executeExistingOpenClawStateRead } from "./openclaw-state-db-readonly-CC57AD_q.mjs";
import { r as captureOpenClawStateWorkerContext } from "./openclaw-state-worker-context-DRG_I6tz.mjs";
import { l as runOpenClawStateWriteTransaction, r as openOpenClawStateDatabase } from "./openclaw-state-db-D1jWDzK3.mjs";
import { n as createSqliteWorkerWriteAdmission } from "./sqlite-worker-store-CsIRv3py.mjs";
import { a as runOpenClawStateWorkerOperation } from "./openclaw-state-worker-store-DCVYVtaO.mjs";
import { a as getActivePluginChannelRegistrySnapshotFromState, i as getActivePluginChannelRegistryFromState } from "./registry-lookup-CszP7Fcb.mjs";
import "./registry-B3Y-vjit.mjs";
import { t as normalizeAnyChannelId } from "./registry-normalize-BvpWSO2L.mjs";
import { i as getLoadedChannelPluginForRead } from "./registry-loaded-BugfxX6l.mjs";
import "./message-channel-constants-B3vfipkP.mjs";
import { f as stringifyRouteThreadId } from "./channel-route-BIxMkFzo.mjs";
import { i as stripTargetTopicSuffix, n as stripOutboundTargetKindPrefix, r as stripTargetProviderPrefix, t as resolveTargetPrefixedChannel } from "./channel-target-prefix-DIR59G50.mjs";
import { a as normalizeConversationTargetRef, i as normalizeConversationRef, n as buildChannelAccountKey, r as captureConversationRef, s as withSessionBindingInspectionConversation } from "./current-conversation-binding-row-BCcBsEeZ.mjs";
import { t as loadOptionalBundledChannelPublicArtifact } from "./optional-public-artifact-zmJDgaMd.mjs";
import { a as inspectCurrentConversationBindingRecordInDatabase, c as pruneCurrentConversationBindingListInTransaction, f as updateCurrentConversationBindingRecordInDatabase, i as deleteCurrentConversationBindingRow, l as readCurrentConversationBindingListInDatabase, n as bindingRowsToRecords, o as isBindingExpired, r as buildBindingId, s as listCurrentConversationBindingRowsBySession, t as CURRENT_BINDINGS_ID_PREFIX, u as readCurrentConversationBindingResolutionInDatabase } from "./current-conversation-bindings.kernel-DgNBja26.mjs";
//#region src/infra/outbound/conversation-id.ts
function resolveExplicitConversationTargetId(target) {
	for (const prefix of [
		"channel:",
		"conversation:",
		"group:",
		"room:",
		"dm:"
	]) if (normalizeLowercaseStringOrEmpty(target).startsWith(prefix)) return normalizeOptionalString(target.slice(prefix.length));
}
/**
* Chooses the best conversation id from an explicit thread id or outbound targets.
*/
function resolveConversationIdFromTargets(params) {
	const threadId = stringifyRouteThreadId(params.threadId);
	if (threadId) return threadId;
	for (const rawTarget of params.targets) {
		const target = normalizeOptionalString(rawTarget);
		if (!target) continue;
		const explicitConversationId = resolveExplicitConversationTargetId(target);
		if (explicitConversationId) return explicitConversationId;
		if (target.includes(":") && explicitConversationId === void 0) continue;
		const mentionMatch = target.match(/^<#(\d+)>$/);
		if (mentionMatch?.[1]) return mentionMatch[1];
		if (/^\d{6,}$/.test(target)) return target;
	}
}
//#endregion
//#region src/channels/plugins/thread-binding-api.ts
function loadBundledChannelThreadBindingApi(channelId) {
	return loadOptionalBundledChannelPublicArtifact({
		channelId,
		artifactBasename: "thread-binding-api.js"
	});
}
function normalizeThreadBindingPlacement(value) {
	const normalized = normalizeOptionalString(typeof value === "string" ? value : void 0);
	return normalized === "current" || normalized === "child" ? normalized : void 0;
}
/**
* Resolves the default top-level thread-binding placement for a bundled channel.
*/
function resolveBundledChannelThreadBindingDefaultPlacement(channelId) {
	return normalizeThreadBindingPlacement(loadBundledChannelThreadBindingApi(channelId)?.defaultTopLevelPlacement);
}
/**
* Resolves inbound conversation refs from a bundled channel thread-binding artifact.
*/
function resolveBundledChannelThreadBindingInboundConversation(params) {
	const api = loadBundledChannelThreadBindingApi(params.channelId);
	if (typeof api?.resolveInboundConversation !== "function") return;
	return api.resolveInboundConversation({
		from: params.from,
		to: params.to,
		conversationId: params.conversationId,
		threadId: params.threadId,
		threadParentId: params.threadParentId,
		isGroup: params.isGroup
	});
}
//#endregion
//#region src/channels/conversation-resolution.ts
/**
* Canonical conversation resolution for command and inbound channel flows.
* This module turns channel targets, thread ids, aliases, and plugin hooks into stable binding ids.
*/
const CANONICAL_TARGET_PREFIXES = ["user:", "spaces/"];
function resolveChannelId(raw) {
	const normalizedRaw = normalizeOptionalString(raw);
	if (!normalizedRaw) return null;
	return normalizeAnyChannelId(normalizedRaw) ?? normalizeOptionalLowercaseString(normalizedRaw) ?? null;
}
function normalizeResolutionTarget(params, conversation) {
	const conversationId = normalizeOptionalString(conversation?.conversationId);
	if (!conversationId) return null;
	const parentConversationId = normalizeOptionalString(conversation?.parentConversationId);
	const defaultParentToSelf = params.plugin?.bindings?.selfParentConversationByDefault === true && !params.threadId && !parentConversationId;
	const normalized = normalizeConversationTargetRef({
		conversationId,
		parentConversationId: defaultParentToSelf ? conversationId : parentConversationId
	});
	const normalizedParentConversationId = defaultParentToSelf ? normalized.conversationId : normalized.parentConversationId;
	return {
		channel: params.channel,
		accountId: params.accountId,
		conversationId: normalized.conversationId,
		...normalizedParentConversationId ? { parentConversationId: normalizedParentConversationId } : {},
		...params.threadId ? { threadId: params.threadId } : {}
	};
}
function resolveBindingAccountId(params) {
	return normalizeOptionalString(params.rawAccountId) || normalizeOptionalString(params.plugin?.config.defaultAccountId?.(params.cfg)) || "default";
}
function resolveFallbackConversationTargetId(params) {
	const { allowNumericTopicShorthand = false } = params;
	const target = normalizeOptionalString(params.rawTarget);
	if (!target) return;
	const withoutKind = stripOutboundTargetKindPrefix(target);
	const withoutTopic = params.preserveExplicitTopicSuffix && /:topic:/iu.test(withoutKind) ? withoutKind : stripTargetTopicSuffix(withoutKind, { allowNumericShorthand: allowNumericTopicShorthand });
	return resolveConversationIdFromTargets({ targets: [withoutTopic] }) ?? (withoutTopic !== target ? withoutTopic : void 0) ?? resolveConversationIdFromTargets({ targets: [target] });
}
function resolveChannelTargetId(params) {
	const target = normalizeOptionalString(params.target);
	if (!target) return;
	const messaging = params.plugin?.messaging;
	const lower = normalizeLowercaseStringOrEmpty(target);
	const channelPrefix = `${params.channel}:`;
	if (lower.startsWith(channelPrefix)) return resolveChannelTargetId({
		...params,
		target: target.slice(channelPrefix.length)
	});
	if (CANONICAL_TARGET_PREFIXES.some((prefix) => lower.startsWith(prefix))) return target;
	const prefixedChannel = resolveTargetPrefixedChannel(target);
	if (!prefixedChannel || prefixedChannel !== params.channel) {
		const explicitConversationId = resolveFallbackConversationTargetId({
			rawTarget: target,
			allowNumericTopicShorthand: messaging?.numericTopicShorthand === true,
			preserveExplicitTopicSuffix: params.preserveExplicitTopicSuffix
		});
		if (explicitConversationId) return explicitConversationId;
	}
	const normalizedTarget = normalizeOptionalString(messaging?.normalizeTarget?.(target));
	if (normalizedTarget) {
		const withoutProvider = stripTargetProviderPrefix(normalizedTarget, params.channel);
		return resolveFallbackConversationTargetId({
			rawTarget: withoutProvider,
			allowNumericTopicShorthand: messaging?.numericTopicShorthand === true,
			preserveExplicitTopicSuffix: params.preserveExplicitTopicSuffix
		}) || withoutProvider || normalizedTarget;
	}
	return target;
}
/**
* Resolves whether top-level bindings default to the current conversation or a child thread.
*/
function resolveChannelDefaultBindingPlacement(rawChannel) {
	const channel = resolveChannelId(rawChannel);
	if (!channel) return;
	return getLoadedChannelPluginForRead(channel)?.conversationBindings?.defaultTopLevelPlacement ?? resolveBundledChannelThreadBindingDefaultPlacement(channel);
}
/**
* Placement for a binding created by an agent-spawned worker. Only "child" (a new thread)
* is admissible: "current" would hand the user's conversation to the worker.
*/
function resolveSpawnThreadBindingPlacement(rawChannel, supportedPlacements) {
	return resolveChannelDefaultBindingPlacement(rawChannel) ?? (supportedPlacements.includes("child") ? "child" : "current");
}
/** Explicit spawn discovery is separate from automatic command placement. */
function supportsThreadBindingSpawn(rawChannel) {
	return resolveChannelDefaultBindingPlacement(rawChannel) === "child";
}
/**
* Resolves command context into a canonical channel/account/conversation tuple.
*/
function resolveCommandConversationResolution(params) {
	const channel = resolveChannelId(params.channel);
	if (!channel) return null;
	const plugin = params.plugin ?? getLoadedChannelPluginForRead(channel);
	const accountId = resolveBindingAccountId({
		rawAccountId: params.accountId,
		plugin,
		cfg: params.cfg
	});
	const threadId = stringifyRouteThreadId(params.threadId);
	const resolutionScope = {
		channel,
		accountId,
		threadId,
		plugin
	};
	const from = normalizeOptionalString(params.from);
	const chatType = normalizeOptionalString(params.chatType);
	const commandParams = {
		accountId,
		threadId,
		threadParentId: normalizeOptionalString(params.threadParentId),
		senderId: normalizeOptionalString(params.senderId),
		sessionKey: normalizeOptionalString(params.sessionKey),
		parentSessionKey: normalizeOptionalString(params.parentSessionKey),
		from,
		chatType,
		originatingTo: params.originatingTo ?? void 0,
		commandTo: params.commandTo ?? void 0,
		fallbackTo: params.fallbackTo ?? void 0
	};
	const resolvedByProvider = plugin?.bindings?.resolveCommandConversation?.(commandParams);
	const providerResolution = normalizeResolutionTarget(resolutionScope, resolvedByProvider);
	if (providerResolution) return providerResolution;
	const to = normalizeOptionalString(params.originatingTo) ?? normalizeOptionalString(params.fallbackTo);
	const nativeChannelId = normalizeOptionalString(params.nativeChannelId);
	const focusedBinding = plugin?.threading?.resolveFocusedBinding?.({
		cfg: params.cfg,
		accountId,
		context: {
			...to ? { To: to } : {},
			...from ? { From: from } : {},
			...chatType ? { ChatType: chatType } : {},
			...threadId ? { MessageThreadId: threadId } : {},
			...nativeChannelId ? { NativeChannelId: nativeChannelId } : {}
		}
	});
	const focusedResolution = normalizeResolutionTarget(resolutionScope, focusedBinding);
	if (focusedResolution) return focusedResolution;
	const resolveTarget = (target) => resolveChannelTargetId({
		channel,
		plugin,
		target
	});
	const baseConversationId = resolveTarget(params.originatingTo) ?? resolveTarget(params.commandTo) ?? resolveTarget(params.fallbackTo);
	const parentConversationId = resolveTarget(params.threadParentId) ?? (threadId && baseConversationId && baseConversationId !== threadId ? baseConversationId : void 0);
	const conversationId = threadId || baseConversationId;
	if (!conversationId) return null;
	return normalizeResolutionTarget(resolutionScope, {
		conversationId,
		parentConversationId
	});
}
/**
* Resolves inbound message context into the canonical binding conversation tuple.
*/
function resolveInboundConversationResolution(params) {
	const channel = resolveChannelId(params.channel);
	if (!channel) return null;
	const plugin = getLoadedChannelPluginForRead(channel);
	const accountId = resolveBindingAccountId({
		rawAccountId: params.accountId,
		plugin,
		cfg: params.cfg
	});
	const threadId = stringifyRouteThreadId(params.threadId);
	const resolutionScope = {
		channel,
		accountId,
		threadId,
		plugin
	};
	const resolverParams = {
		from: normalizeOptionalString(params.from),
		to: normalizeOptionalString(params.to),
		conversationId: normalizeOptionalString(params.conversationId) ?? normalizeOptionalString(params.groupId) ?? normalizeOptionalString(params.to),
		threadId,
		threadParentId: stringifyRouteThreadId(params.threadParentId),
		isGroup: params.isGroup ?? true
	};
	const providerConversation = plugin?.messaging?.resolveInboundConversation?.(resolverParams);
	const providerResolution = normalizeResolutionTarget(resolutionScope, providerConversation);
	if (providerResolution || providerConversation === null) return providerResolution;
	const artifactConversation = resolveBundledChannelThreadBindingInboundConversation({
		channelId: channel,
		...resolverParams
	});
	const artifactResolution = normalizeResolutionTarget(resolutionScope, artifactConversation);
	if (artifactResolution || artifactConversation === null) return artifactResolution;
	const resolveTarget = (target) => resolveChannelTargetId({
		channel,
		plugin,
		target,
		preserveExplicitTopicSuffix: threadId == null
	});
	const parentConversationId = resolveTarget(params.threadParentId == null ? void 0 : String(params.threadParentId)) ?? resolveTarget(params.to) ?? resolveTarget(params.conversationId) ?? resolveTarget(params.groupId);
	const genericConversationId = threadId ?? resolveTarget(params.conversationId) ?? resolveTarget(params.groupId) ?? parentConversationId;
	if (!genericConversationId) return null;
	return normalizeResolutionTarget(resolutionScope, {
		conversationId: genericConversationId,
		parentConversationId: threadId != null ? parentConversationId : void 0
	});
}
//#endregion
//#region src/acp/conversation-id.ts
function normalizeConversationText(value) {
	if (typeof value === "string") return value.trim();
	if (typeof value === "number" || typeof value === "bigint" || typeof value === "boolean") return `${value}`.trim();
	return "";
}
//#endregion
//#region src/infra/outbound/session-binding-errors.ts
var SessionBindingError = class extends Error {
	constructor(code, message, details) {
		super(message);
		this.code = code;
		this.details = details;
		this.name = "SessionBindingError";
	}
};
function isSessionBindingError(error) {
	return error instanceof SessionBindingError;
}
//#endregion
//#region src/infra/outbound/current-conversation-bindings.ts
/** Updates one binding from its currently committed row in one synchronous transaction. */
function updateCurrentConversationBindingRecord(ref, update) {
	const conversation = normalizeConversationRef(ref);
	return runOpenClawStateWriteTransaction(({ db }) => updateCurrentConversationBindingRecordInDatabase(db, conversation, update));
}
/** Selects the current row without pruning expiry or rewriting legacy keys. */
function inspectCurrentConversationBindingRecord(ref) {
	const conversation = normalizeConversationRef(ref);
	return withExistingOpenClawStateDatabaseReadOnly(({ db }) => inspectCurrentConversationBindingRecordInDatabase(db, conversation)) ?? null;
}
/** Reads the latest durable binding and prunes only the exact expired conversation row. */
function resolveCurrentConversationBindingRecord(ref) {
	const { db } = openOpenClawStateDatabase();
	const conversation = normalizeConversationRef(ref);
	const result = readCurrentConversationBindingResolutionInDatabase(db, conversation);
	return result.repair ? updateCurrentConversationBindingRecord(conversation, (current) => current).current : result.record;
}
/** Lists latest durable bindings using the exact target key and optional account scope. */
function listCurrentConversationBindingRecordsBySession(targetSessionKey, scope) {
	const { db } = openOpenClawStateDatabase();
	const prepared = readCurrentConversationBindingListInDatabase(db, targetSessionKey, scope);
	return prepared.requiresPrune ? runOpenClawStateWriteTransaction(({ db: transactionDb }) => pruneCurrentConversationBindingListInTransaction(transactionDb, targetSessionKey, scope)) : prepared.records;
}
/** Awaited listing retains the existing create-on-first-use and expiry-prune behavior. */
async function listCurrentConversationBindingRecordsBySessionAsync(targetSessionKey, scope, assertCurrent) {
	const capturedScope = scope ? {
		channel: scope.channel,
		accountId: scope.accountId
	} : void 0;
	const context = captureOpenClawStateWorkerContext();
	const records = await runOpenClawStateWorkerOperation(context, (worker) => worker.execute({
		type: "conversationBindings.listBySession",
		input: {
			targetSessionKey,
			...capturedScope ? { scope: capturedScope } : {}
		}
	}), {
		assertCurrent,
		createAdmission: createSqliteWorkerWriteAdmission(() => {
			context.admission.assertCurrent();
			assertCurrent?.();
		}, [context.admission.databasePath])
	});
	context.admission.assertCurrent();
	assertCurrent?.();
	return records;
}
/** Deletes exact account-owned or generic session rows without disturbing sibling owners. */
function deleteCurrentConversationBindingRecordsBySession(targetSessionKey, scope, genericOnly = !scope) {
	return runOpenClawStateWriteTransaction(({ db }) => {
		const rows = listCurrentConversationBindingRowsBySession(db, targetSessionKey, scope, genericOnly);
		const removed = [];
		for (const row of rows) {
			const record = bindingRowsToRecords([row])[0];
			if (genericOnly && !record?.bindingId.startsWith("generic:")) continue;
			deleteCurrentConversationBindingRow(db, row.binding_key);
			if (record && !isBindingExpired(record)) removed.push(record);
		}
		return removed;
	});
}
function resolveChannelConversationBindingSupport(params) {
	const normalized = normalizeAnyChannelId(params.channel) ?? normalizeOptionalLowercaseString(normalizeConversationText(params.channel));
	if (!normalized) return;
	const matchesPluginId = (plugin) => plugin.id === normalized || (plugin.meta?.aliases ?? []).some((alias) => normalizeOptionalLowercaseString(alias) === normalized);
	return ((getActivePluginChannelRegistryFromState()?.channels ?? []).find((entry) => matchesPluginId(entry.plugin))?.plugin)?.conversationBindings;
}
function resolveChannelSupportsCurrentConversationBinding(params) {
	const bindingSupport = resolveChannelConversationBindingSupport(params);
	if (bindingSupport?.supportsCurrentConversationBinding !== true || bindingSupport.bindingStore === "adapter" || typeof bindingSupport.createManager === "function") return false;
	return bindingSupport.isCurrentConversationBindingSupported?.({ accountId: params.accountId }) ?? true;
}
/** True when an active channel lifecycle owns bindings through a registered adapter. */
function requiresRegisteredSessionBindingAdapter(params) {
	const support = resolveChannelConversationBindingSupport(params);
	return support?.bindingStore === "adapter" || typeof support?.createManager === "function";
}
function supportsGenericCurrentConversationBinding(ref) {
	const normalized = normalizeConversationRef({
		...ref,
		conversationId: "capability-check"
	});
	if (normalized.channel === "webchat") return true;
	return resolveChannelSupportsCurrentConversationBinding({
		channel: normalized.channel,
		accountId: normalized.accountId
	});
}
function bindingRefFromId(bindingId, scope) {
	if (!bindingId.startsWith("generic:")) return null;
	const [channel, accountId, parentConversationId, conversationId] = bindingId.slice(CURRENT_BINDINGS_ID_PREFIX.length).split("␟");
	if (!channel || !accountId || !conversationId) return null;
	if (scope && buildChannelAccountKey({
		channel,
		accountId
	}) !== buildChannelAccountKey(scope)) return null;
	return {
		channel,
		accountId,
		conversationId,
		...parentConversationId ? { parentConversationId } : {}
	};
}
/** Reports generic current-conversation binding support for plugin-owned channels. */
function getGenericCurrentConversationBindingCapabilities(params) {
	if (!supportsGenericCurrentConversationBinding(params)) return null;
	return {
		adapterAvailable: true,
		bindSupported: true,
		unbindSupported: true,
		placements: ["current"]
	};
}
/** Stores or replaces the current-conversation binding for a normalized conversation ref. */
async function bindGenericCurrentConversation(input) {
	const assertCurrent = input.assertCurrent;
	const conversation = normalizeConversationRef(input.conversation);
	const targetSessionKey = input.targetSessionKey.trim();
	if (!conversation.channel || !conversation.conversationId || !targetSessionKey || !supportsGenericCurrentConversationBinding(conversation)) return null;
	const rawNow = Date.now();
	const now = asDateTimestampMs(rawNow);
	if (now === void 0) return null;
	const ttlMs = typeof input.ttlMs === "number" && Number.isFinite(input.ttlMs) ? Math.max(0, Math.floor(input.ttlMs)) : void 0;
	const expiresAt = ttlMs === void 0 ? void 0 : ttlMs === 0 ? now : resolveExpiresAtMsFromDurationMs(ttlMs, { nowMs: rawNow });
	if (ttlMs !== void 0 && expiresAt === void 0) return null;
	return updateCurrentConversationBindingRecord(conversation, (existing) => {
		assertCurrent?.();
		return {
			bindingId: buildBindingId(conversation),
			targetSessionKey,
			targetKind: input.targetKind,
			conversation,
			status: "active",
			boundAt: now,
			...expiresAt !== void 0 ? { expiresAt } : {},
			metadata: {
				...existing?.targetSessionKey === targetSessionKey && existing.targetKind === input.targetKind ? existing.metadata : void 0,
				...input.metadata,
				lastActivityAt: now
			}
		};
	}).current;
}
/** Inspects generic ownership without extending activity or cleaning stored rows. */
function inspectGenericCurrentConversationBinding(ref) {
	if (!supportsGenericCurrentConversationBinding(ref)) return null;
	const record = inspectCurrentConversationBindingRecord(ref);
	return record?.bindingId.startsWith("generic:") ? record : null;
}
/** Resolves a current-conversation binding and prunes it if its TTL has expired. */
function resolveGenericCurrentConversationBinding(ref) {
	if (!supportsGenericCurrentConversationBinding(ref)) return null;
	const record = resolveCurrentConversationBindingRecord(ref);
	return record?.bindingId.startsWith("generic:") ? record : null;
}
/** Lists non-expired current-conversation bindings owned by one target session. */
function listGenericCurrentConversationBindingsBySession(targetSessionKey) {
	return listCurrentConversationBindingRecordsBySession(targetSessionKey).filter((record) => record.bindingId.startsWith("generic:") && supportsGenericCurrentConversationBinding(record.conversation));
}
/** Persists last-activity metadata for an existing generic current-conversation binding. */
function touchGenericCurrentConversationBinding(bindingId, at = Date.now(), scope) {
	const conversation = bindingRefFromId(bindingId, scope);
	if (!conversation || !supportsGenericCurrentConversationBinding(conversation)) return;
	updateCurrentConversationBindingRecord(conversation, (current) => current?.bindingId === bindingId ? {
		...current,
		metadata: {
			...current.metadata,
			lastActivityAt: at
		}
	} : current);
}
function unbindCurrentConversationBindingById(bindingId, scope) {
	const conversation = bindingRefFromId(bindingId, scope);
	if (!conversation || !supportsGenericCurrentConversationBinding(conversation)) return [];
	const { previous, current } = updateCurrentConversationBindingRecord(conversation, (latest) => latest?.bindingId === bindingId ? null : latest);
	return previous && !current ? [previous] : [];
}
/** Removes generic current-conversation bindings by binding id or target session key. */
async function unbindGenericCurrentConversationBindings(input) {
	const normalizedBindingId = input.bindingId?.trim();
	if (normalizedBindingId?.startsWith("generic:")) return unbindCurrentConversationBindingById(normalizedBindingId, input.scope);
	const normalizedTargetSessionKey = input.targetSessionKey?.trim();
	return normalizedTargetSessionKey ? deleteCurrentConversationBindingRecordsBySession(normalizedTargetSessionKey, input.scope, true) : [];
}
/** Reads committed state without creating the store, pruning expiry, or repairing rows. */
async function inspectCurrentConversationBindingRecordAsync(ref) {
	const conversation = captureConversationRef(ref);
	const result = await executeExistingOpenClawStateRead({}, {
		type: "conversationBindings.inspect",
		conversation
	});
	if (!result) return null;
	if (!result.ok || result.type !== "conversationBindings.inspect") throw new Error("Unexpected current conversation binding inspection result");
	return result.record;
}
async function resolveCurrentConversationBindingRecordAsync(ref, assertCurrent) {
	const conversation = captureConversationRef(ref);
	const context = captureOpenClawStateWorkerContext();
	const result = await runOpenClawStateWorkerOperation(context, (scope) => scope.execute({
		type: "conversationBindings.resolve",
		input: conversation
	}), {
		assertCurrent,
		createAdmission: createSqliteWorkerWriteAdmission(() => {
			context.admission.assertCurrent();
			assertCurrent?.();
		}, [context.admission.databasePath])
	});
	context.admission.assertCurrent();
	assertCurrent?.();
	return result;
}
/** Reads one live ordered selection without repairing rows or inheriting discovery snapshots. */
async function readCurrentConversationBindingSelectionAsync(refs, assertCurrent) {
	const conversations = refs.map(captureConversationRef);
	const context = captureOpenClawStateWorkerContext();
	const result = await runOpenClawStateWorkerOperation(context, (scope) => scope.execute({
		type: "conversationBindings.readSelection",
		input: conversations
	}), {
		assertCurrent,
		existingOnly: true
	});
	context.admission.assertCurrent();
	assertCurrent?.();
	return result ?? conversations.map(() => null);
}
/** Domain input only crosses IPC; read/modify/write predicates execute in one worker transaction. */
async function touchCurrentConversationBindingRecordAsync(input, assertCurrent) {
	const captured = {
		conversation: captureConversationRef(input.conversation),
		bindingId: input.bindingId,
		at: input.at,
		...input.accountPolicy ? { accountPolicy: {
			idleTimeoutMs: input.accountPolicy.idleTimeoutMs,
			maxAgeMs: input.accountPolicy.maxAgeMs,
			targetKinds: {
				subagent: input.accountPolicy.targetKinds.subagent,
				session: input.accountPolicy.targetKinds.session
			}
		} } : {}
	};
	const context = captureOpenClawStateWorkerContext();
	return runOpenClawStateWorkerOperation(context, (scope) => scope.execute({
		type: "conversationBindings.touch",
		input: captured
	}), {
		assertCurrent,
		createAdmission: createSqliteWorkerWriteAdmission(() => {
			context.admission.assertCurrent();
			assertCurrent?.();
		}, [context.admission.databasePath])
	});
}
/** Eligibility callbacks run before IPC; native grants only revalidate recorded ownership. */
function captureGenericBindingSupport(ref) {
	const registry = getActivePluginChannelRegistrySnapshotFromState();
	const support = resolveChannelConversationBindingSupport(ref);
	const supportsCurrentConversationBinding = support?.supportsCurrentConversationBinding;
	const bindingStore = support?.bindingStore;
	const createManager = support?.createManager;
	const eligibility = support?.isCurrentConversationBindingSupported;
	const supported = supportsGenericCurrentConversationBinding(ref);
	const assertCurrent = () => {
		if (ref.channel === "webchat") return;
		if (getActivePluginChannelRegistrySnapshotFromState() !== registry || resolveChannelConversationBindingSupport(ref) !== support || support?.supportsCurrentConversationBinding !== supportsCurrentConversationBinding || support?.bindingStore !== bindingStore || support?.createManager !== createManager || support?.isCurrentConversationBindingSupported !== eligibility) throw new SessionBindingError("BINDING_ADAPTER_UNAVAILABLE", "Generic conversation binding owner is no longer available", {
			channel: ref.channel,
			accountId: ref.accountId
		});
	};
	assertCurrent();
	return {
		supported,
		assertCurrent
	};
}
async function inspectGenericCurrentConversationBindingAsync(ref, options) {
	const conversation = captureConversationRef(ref);
	const captured = captureGenericBindingSupport(conversation);
	if (!captured.supported) return null;
	options?.assertCurrent?.();
	const record = await inspectCurrentConversationBindingRecordAsync(conversation);
	options?.assertCurrent?.();
	captured.assertCurrent();
	return record?.bindingId.startsWith("generic:") ? record : null;
}
async function resolveGenericCurrentConversationBindingAsync(ref, options) {
	const conversation = captureConversationRef(ref);
	const captured = captureGenericBindingSupport(conversation);
	if (!captured.supported) return null;
	const record = await resolveCurrentConversationBindingRecordAsync(conversation, () => {
		options?.assertCurrent?.();
		captured.assertCurrent();
	});
	return record?.bindingId.startsWith("generic:") ? record : null;
}
async function readGenericCurrentConversationBindingSelectionAsync(refs, options) {
	const conversations = refs.map(captureConversationRef);
	const captured = conversations.map(captureGenericBindingSupport);
	const assertCurrent = () => {
		options?.assertCurrent?.();
		for (const support of captured) support.assertCurrent();
	};
	const eligible = conversations.filter((_, index) => captured[index]?.supported);
	assertCurrent();
	const records = await readCurrentConversationBindingSelectionAsync(eligible, assertCurrent);
	assertCurrent();
	let index = 0;
	return captured.map((support) => {
		const record = support.supported ? records[index++] : null;
		return record?.bindingId.startsWith("generic:") ? record : null;
	});
}
/** Plugin eligibility is evaluated only after native listing has settled. */
async function listGenericCurrentConversationBindingsBySessionAsync(targetSessionKey, options) {
	const registry = getActivePluginChannelRegistrySnapshotFromState();
	const assertCurrent = () => {
		options?.assertCurrent?.();
		if (getActivePluginChannelRegistrySnapshotFromState() !== registry) throw new SessionBindingError("BINDING_ADAPTER_UNAVAILABLE", "Generic conversation binding owners changed during destination listing");
	};
	assertCurrent();
	const records = await listCurrentConversationBindingRecordsBySessionAsync(targetSessionKey, void 0, assertCurrent);
	assertCurrent();
	const supports = [];
	const selected = records.filter((record) => {
		if (!record.bindingId.startsWith("generic:")) return false;
		const support = captureGenericBindingSupport(record.conversation);
		supports.push(support);
		assertCurrent();
		return support.supported;
	});
	assertCurrent();
	for (const support of supports) support.assertCurrent();
	return selected;
}
async function touchGenericCurrentConversationBindingAsync(bindingId, at = Date.now(), scope, options) {
	const ref = bindingRefFromId(bindingId, scope);
	if (!ref) return;
	const conversation = captureConversationRef(ref);
	const captured = captureGenericBindingSupport(conversation);
	if (!captured.supported) return;
	await touchCurrentConversationBindingRecordAsync({
		conversation,
		bindingId,
		at
	}, () => {
		options?.assertCurrent?.(conversation);
		captured.assertCurrent();
	});
}
const testing$1 = { clearPersistedCurrentConversationBindingsForTests() {
	runOpenClawStateWriteTransaction(({ db }) => {
		const bindingDb = getNodeSqliteKysely(db);
		executeSqliteQuerySync(db, bindingDb.deleteFrom("current_conversation_bindings"));
	});
} };
//#endregion
//#region src/infra/outbound/session-binding-native-selection.ts
/** Private core capability; kept outside the public adapter contract and SDK. */
const nativeSessionBindingSelection = Symbol.for("openclaw.sessionBinding.nativeSelection");
/** Core-owned SQLite adapters enumerate through their original worker; SDK adapters keep their contract. */
const nativeSessionBindingListBySession = Symbol.for("openclaw.sessionBinding.nativeListBySession");
//#endregion
//#region src/infra/outbound/session-binding-service.ts
function normalizePlacement(raw) {
	return raw === "current" || raw === "child" ? raw : void 0;
}
function resolveAdapterPlacements(adapter) {
	const placements = adapter.capabilities?.placements?.filter((value) => normalizePlacement(value) !== void 0);
	return placements?.length ? uniqueValues(placements) : ["current", "child"];
}
function resolveAdapterCapabilities(adapter) {
	if (!adapter) return {
		adapterAvailable: false,
		bindSupported: false,
		unbindSupported: false,
		placements: []
	};
	const bindSupported = adapter.capabilities?.bindSupported ?? Boolean(adapter.bind);
	return {
		adapterAvailable: true,
		bindSupported,
		unbindSupported: adapter.capabilities?.unbindSupported ?? Boolean(adapter.unbind),
		placements: bindSupported ? resolveAdapterPlacements(adapter) : []
	};
}
const ADAPTERS_BY_CHANNEL_ACCOUNT = resolveGlobalMap(Symbol.for("openclaw.sessionBinding.adapters"));
function registerSessionBindingAdapter(adapter) {
	const normalizedAdapter = {
		...adapter,
		...normalizeConversationRef({
			channel: adapter.channel,
			accountId: adapter.accountId,
			conversationId: "unused"
		})
	};
	const key = buildChannelAccountKey(normalizedAdapter);
	const existing = ADAPTERS_BY_CHANNEL_ACCOUNT.get(key);
	const registrations = existing ? [...existing] : [];
	registrations.push({
		adapter,
		normalizedAdapter
	});
	ADAPTERS_BY_CHANNEL_ACCOUNT.set(key, registrations);
}
function unregisterSessionBindingAdapter(params) {
	const key = buildChannelAccountKey(params);
	const registrations = ADAPTERS_BY_CHANNEL_ACCOUNT.get(key);
	if (!registrations || registrations.length === 0) return;
	const nextRegistrations = [...registrations];
	if (params.adapter) {
		const registrationIndex = nextRegistrations.findLastIndex((registration) => registration.adapter === params.adapter);
		if (registrationIndex < 0) return;
		nextRegistrations.splice(registrationIndex, 1);
	} else nextRegistrations.pop();
	if (nextRegistrations.length === 0) {
		ADAPTERS_BY_CHANNEL_ACCOUNT.delete(key);
		return;
	}
	ADAPTERS_BY_CHANNEL_ACCOUNT.set(key, nextRegistrations);
}
function resolveAdapterForChannelAccount(params) {
	return ADAPTERS_BY_CHANNEL_ACCOUNT.get(buildChannelAccountKey(params))?.at(-1)?.normalizedAdapter ?? null;
}
/** Revalidates the exact registration, including its original adapter's retained callbacks. */
function isSessionBindingAdapterCurrent(adapter) {
	const registration = ADAPTERS_BY_CHANNEL_ACCOUNT.get(buildChannelAccountKey(adapter))?.at(-1);
	return registration?.adapter === adapter || registration?.normalizedAdapter === adapter;
}
function assertAdapterSelectionCurrent(ref, adapter) {
	if (resolveAdapterForChannelAccount(ref) !== adapter || !adapter && requiresRegisteredSessionBindingAdapter(ref)) throw new SessionBindingError("BINDING_ADAPTER_UNAVAILABLE", `Session binding owner changed for ${ref.channel}:${ref.accountId}`, {
		channel: ref.channel,
		accountId: ref.accountId
	});
}
/**
* Workers spawned before child-only placement could bind the conversation a user was
* talking in. Those persisted bindings stay invisible, so the conversation routes to its
* normal agent; untouched, they expire through their owner's idle/max-age lifecycle.
*/
function routableBinding(record) {
	if (record?.metadata?.boundBy !== "system") return record;
	const adapter = resolveAdapterForChannelAccount(record.conversation);
	const placements = adapter ? resolveAdapterCapabilities(adapter).placements : [];
	return resolveSpawnThreadBindingPlacement(record.conversation.channel, placements) === "child" ? record : null;
}
function getActiveRegisteredAdapters(scope) {
	if (scope) {
		const adapter = resolveAdapterForChannelAccount(scope);
		return adapter ? [adapter] : [];
	}
	return [...ADAPTERS_BY_CHANNEL_ACCOUNT.values()].map((registrations) => registrations.at(-1)?.normalizedAdapter ?? null).filter((adapter) => Boolean(adapter));
}
function dedupeBindings(records) {
	const byId = /* @__PURE__ */ new Map();
	for (const record of records) {
		if (!record?.bindingId) continue;
		byId.set(JSON.stringify([buildChannelAccountKey(record.conversation), record.bindingId]), record);
	}
	return [...byId.values()];
}
/** Internal destination enumeration; the shipped synchronous SDK service remains unchanged. */
async function listSessionBindingsBySessionAsync(targetSessionKey) {
	const key = targetSessionKey.trim();
	if (!key) return [];
	const adapters = getActiveRegisteredAdapters();
	const registry = getActivePluginChannelRegistrySnapshotFromState();
	const assertCurrent = () => {
		const current = getActiveRegisteredAdapters();
		if (getActivePluginChannelRegistrySnapshotFromState() !== registry || current.length !== adapters.length || current.some((adapter, index) => adapter !== adapters[index])) throw new SessionBindingError("BINDING_ADAPTER_UNAVAILABLE", "Session binding owners changed during destination listing");
	};
	const prepared = /* @__PURE__ */ new Map();
	for (const adapter of adapters) {
		const nativeList = adapter[nativeSessionBindingListBySession];
		if (!nativeList) continue;
		assertCurrent();
		prepared.set(adapter, await nativeList.call(adapter, key));
		assertCurrent();
	}
	const generic = await listGenericCurrentConversationBindingsBySessionAsync(key, { assertCurrent });
	assertCurrent();
	const results = [];
	for (const adapter of adapters) {
		const entries = prepared.get(adapter) ?? adapter.listBySession(key);
		assertCurrent();
		results.push(...entries);
	}
	results.push(...generic);
	return dedupeBindings(results).filter((record) => routableBinding(record));
}
function inspectSessionBindingByConversation(ref) {
	const normalized = captureConversationRef(ref);
	if (!normalized.channel || !normalized.conversationId) return {
		status: "available",
		binding: null
	};
	const adapter = resolveAdapterForChannelAccount(normalized);
	if (adapter) return availableBindingInspection(normalized, adapter.inspectByConversation ? adapter.inspectByConversation(normalized) : adapter.resolveByConversation(normalized));
	if (requiresRegisteredSessionBindingAdapter(normalized)) return withSessionBindingInspectionConversation({ status: "unavailable" }, normalized);
	return availableBindingInspection(normalized, inspectGenericCurrentConversationBinding(normalized));
}
function availableBindingInspection(conversation, binding) {
	return withSessionBindingInspectionConversation({
		status: "available",
		binding: routableBinding(binding)
	}, conversation);
}
/** Awaits worker-backed ownership inspection; legacy external adapters retain their sync reader. */
async function inspectSessionBindingByConversationAsync(ref) {
	const normalized = captureConversationRef(ref);
	if (!normalized.channel || !normalized.conversationId) return {
		status: "available",
		binding: null
	};
	const adapter = resolveAdapterForChannelAccount(normalized);
	if (!adapter && requiresRegisteredSessionBindingAdapter(normalized)) return withSessionBindingInspectionConversation({ status: "unavailable" }, normalized);
	const binding = adapter ? adapter.inspectByConversationAsync ? await adapter.inspectByConversationAsync(normalized) : adapter.inspectByConversation ? adapter.inspectByConversation(normalized) : adapter.resolveByConversation(normalized) : await inspectGenericCurrentConversationBindingAsync(normalized);
	if (resolveAdapterForChannelAccount(normalized) !== adapter || !adapter && requiresRegisteredSessionBindingAdapter(normalized)) return withSessionBindingInspectionConversation({ status: "unavailable" }, normalized);
	return availableBindingInspection(normalized, binding);
}
/** Legacy adapters retain their synchronous owner view after asynchronous preparation. */
async function readLegacyAdapterSelection(adapter, conversations, assertCurrent) {
	const prepare = adapter.inspectByConversationAsync ?? (adapter.inspectByConversation ? void 0 : adapter.resolveByConversationAsync);
	if (prepare) for (const conversation of conversations) {
		await prepare.call(adapter, { ...conversation });
		assertCurrent();
	}
	const inspect = adapter.inspectByConversation ?? adapter.resolveByConversation;
	const records = conversations.map((conversation) => inspect.call(adapter, { ...conversation }));
	assertCurrent();
	return records;
}
/** Internal admission read; public scalar SDK APIs keep their existing contracts. */
async function readSessionBindingSelectionCurrent(refs) {
	const conversations = refs.map(captureConversationRef);
	const first = conversations[0];
	if (!first) return [];
	const adapter = resolveAdapterForChannelAccount(first);
	const assertCurrent = () => {
		for (const conversation of conversations) assertAdapterSelectionCurrent(conversation, adapter);
	};
	assertCurrent();
	const nativeRead = adapter?.[nativeSessionBindingSelection];
	const records = !adapter ? await readGenericCurrentConversationBindingSelectionAsync(conversations, { assertCurrent }) : nativeRead ? await nativeRead.call(adapter, conversations) : await readLegacyAdapterSelection(adapter, conversations, assertCurrent);
	assertCurrent();
	if (records.length !== conversations.length) throw new Error("Session binding owner returned an incomplete conversation selection");
	return records.map(routableBinding);
}
function createDefaultSessionBindingService() {
	return {
		inspectByConversationAsync: inspectSessionBindingByConversationAsync,
		bind: async (input) => {
			const assertCurrent = input.assertCurrent;
			const normalizedConversation = normalizeConversationRef(input.conversation);
			const scope = {
				channel: normalizedConversation.channel,
				accountId: normalizedConversation.accountId
			};
			const adapter = resolveAdapterForChannelAccount(normalizedConversation);
			const genericCapabilities = adapter ? null : getGenericCurrentConversationBindingCapabilities(normalizedConversation);
			if (!adapter && !genericCapabilities?.bindSupported) throw new SessionBindingError("BINDING_ADAPTER_UNAVAILABLE", `Session binding adapter unavailable for ${normalizedConversation.channel}:${normalizedConversation.accountId}`, scope);
			if (adapter && !adapter.bind) throw new SessionBindingError("BINDING_CAPABILITY_UNSUPPORTED", `Session binding adapter does not support binding for ${normalizedConversation.channel}:${normalizedConversation.accountId}`, scope);
			const placement = normalizePlacement(input.placement) ?? (normalizedConversation.conversationId ? "current" : "child");
			if (!(adapter ? resolveAdapterPlacements(adapter) : genericCapabilities.placements).includes(placement)) throw new SessionBindingError("BINDING_CAPABILITY_UNSUPPORTED", `Session binding placement "${placement}" is not supported for ${normalizedConversation.channel}:${normalizedConversation.accountId}`, {
				...scope,
				placement
			});
			const bindInput = {
				...input,
				conversation: normalizedConversation,
				placement
			};
			assertCurrent?.();
			const bound = adapter ? await adapter.bind(bindInput) : await bindGenericCurrentConversation(bindInput);
			if (!bound) throw new SessionBindingError("BINDING_CREATE_FAILED", "Session binding adapter failed to bind target conversation", {
				...scope,
				placement
			});
			return bound;
		},
		getCapabilities: (params) => {
			const adapter = resolveAdapterForChannelAccount(params);
			if (!adapter) return getGenericCurrentConversationBindingCapabilities(params) ?? resolveAdapterCapabilities(null);
			return resolveAdapterCapabilities(adapter);
		},
		listBySession: (targetSessionKey) => {
			const key = targetSessionKey.trim();
			if (!key) return [];
			const results = [];
			for (const adapter of getActiveRegisteredAdapters()) results.push(...adapter.listBySession(key));
			results.push(...listGenericCurrentConversationBindingsBySession(key));
			return dedupeBindings(results).filter((record) => routableBinding(record));
		},
		resolveByConversation: (ref) => {
			const normalized = normalizeConversationRef(ref);
			if (!normalized.channel || !normalized.conversationId) return null;
			const adapter = resolveAdapterForChannelAccount(normalized);
			return routableBinding(adapter ? adapter.resolveByConversation(normalized) : resolveGenericCurrentConversationBinding(normalized));
		},
		resolveByConversationAsync: async (ref) => {
			const normalized = captureConversationRef(ref);
			if (!normalized.channel || !normalized.conversationId) return null;
			const adapter = resolveAdapterForChannelAccount(normalized);
			assertAdapterSelectionCurrent(normalized, adapter);
			const binding = adapter ? adapter.resolveByConversationAsync ? await adapter.resolveByConversationAsync(normalized) : adapter.resolveByConversation(normalized) : await resolveGenericCurrentConversationBindingAsync(normalized, { assertCurrent: () => assertAdapterSelectionCurrent(normalized, null) });
			assertAdapterSelectionCurrent(normalized, adapter);
			return routableBinding(binding);
		},
		touch: (bindingId, at, scope) => {
			const normalizedBindingId = bindingId.trim();
			if (!normalizedBindingId) return;
			const adapters = getActiveRegisteredAdapters(scope);
			for (const adapter of adapters) adapter.touch?.(normalizedBindingId, at);
			if (!scope || adapters.length === 0) touchGenericCurrentConversationBinding(normalizedBindingId, at, scope);
		},
		touchAsync: async (bindingId, at, scope) => {
			const normalizedBindingId = bindingId.trim();
			if (!normalizedBindingId) return;
			const ownerScope = scope ? {
				channel: scope.channel,
				accountId: scope.accountId
			} : void 0;
			const adapters = getActiveRegisteredAdapters(ownerScope);
			for (const adapter of adapters) {
				if (!isSessionBindingAdapterCurrent(adapter)) continue;
				if (adapter.touchAsync) await adapter.touchAsync(normalizedBindingId, at);
				else adapter.touch?.(normalizedBindingId, at);
			}
			if (!ownerScope || adapters.length === 0) await touchGenericCurrentConversationBindingAsync(normalizedBindingId, at, ownerScope, { assertCurrent: (ref) => assertAdapterSelectionCurrent(ref, null) });
		},
		unbind: async (input) => {
			const removed = [];
			const adapters = getActiveRegisteredAdapters(input.scope);
			for (const adapter of adapters) {
				if (!adapter.unbind) continue;
				removed.push(...await adapter.unbind(input));
			}
			if (!input.scope || adapters.length === 0) removed.push(...await unbindGenericCurrentConversationBindings(input));
			return dedupeBindings(removed);
		}
	};
}
const DEFAULT_SESSION_BINDING_SERVICE = createDefaultSessionBindingService();
function getSessionBindingService() {
	return DEFAULT_SESSION_BINDING_SERVICE;
}
const testing = {
	resetSessionBindingAdaptersForTests() {
		ADAPTERS_BY_CHANNEL_ACCOUNT.clear();
		testing$1.clearPersistedCurrentConversationBindingsForTests();
	},
	getRegisteredAdapterKeys() {
		return [...ADAPTERS_BY_CHANNEL_ACCOUNT.keys()];
	}
};
//#endregion
export { normalizeConversationText as C, resolveSpawnThreadBindingPlacement as D, resolveInboundConversationResolution as E, supportsThreadBindingSpawn as O, isSessionBindingError as S, resolveCommandConversationResolution as T, resolveCurrentConversationBindingRecord as _, readSessionBindingSelectionCurrent as a, updateCurrentConversationBindingRecord as b, unregisterSessionBindingAdapter as c, deleteCurrentConversationBindingRecordsBySession as d, inspectCurrentConversationBindingRecord as f, readCurrentConversationBindingSelectionAsync as g, listCurrentConversationBindingRecordsBySessionAsync as h, listSessionBindingsBySessionAsync as i, resolveConversationIdFromTargets as k, nativeSessionBindingListBySession as l, listCurrentConversationBindingRecordsBySession as m, inspectSessionBindingByConversation as n, registerSessionBindingAdapter as o, inspectCurrentConversationBindingRecordAsync as p, isSessionBindingAdapterCurrent as r, testing as s, getSessionBindingService as t, nativeSessionBindingSelection as u, resolveCurrentConversationBindingRecordAsync as v, resolveChannelDefaultBindingPlacement as w, SessionBindingError as x, touchCurrentConversationBindingRecordAsync as y };
