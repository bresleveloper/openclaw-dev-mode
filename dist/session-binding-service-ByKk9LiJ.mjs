import { c as normalizeOptionalLowercaseString, l as normalizeOptionalString, p as normalizeStringifiedOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { D as resolveExpiresAtMsFromDurationMs, o as asDateTimestampMs } from "./number-coercion-CkhMiRw8.mjs";
import { a as resolveGlobalSingleton, r as resolveGlobalMap } from "./global-singleton-DrXvEBww.mjs";
import { n as safeParseJsonRecord } from "./json-coercion-pfKbZnCJ.mjs";
import { b as uniqueValues } from "./string-normalization-D6DKCpwE.mjs";
import { i as executeSqliteQuerySync, o as getNodeSqliteKysely } from "./kysely-sync-9fPQaMlh.mjs";
import { r as captureOpenClawStateWorkerContext } from "./openclaw-state-worker-context-BDhKaXgP.mjs";
import { t as executeExistingOpenClawStateRead, u as withExistingOpenClawStateDatabaseReadOnly } from "./openclaw-state-db-readonly-DPndG9sn.mjs";
import { a as getActivePluginChannelRegistrySnapshotFromState, i as getActivePluginChannelRegistryFromState } from "./registry-lookup-88y6FuGR.mjs";
import "./registry-DqsL4UWB.mjs";
import { t as normalizeAnyChannelId } from "./registry-normalize-DKVgg-js.mjs";
import { i as getLoadedChannelPluginForRead } from "./registry-loaded-B-WQB-l0.mjs";
import { i as openOpenClawStateDatabase, u as runOpenClawStateWriteTransaction } from "./openclaw-state-db-BtDOU_3j.mjs";
import { n as createSqliteWorkerWriteAdmission } from "./sqlite-worker-store-Bzw_c0pA.mjs";
import { i as runOpenClawStateWorkerOperation } from "./openclaw-state-worker-store-C1iV_8xe.mjs";
import { t as warnPluginSdkDeprecation } from "./sdk-deprecation-DjTmOhOX.mjs";
import "./message-channel-constants-B3vfipkP.mjs";
import { d as stringifyRouteThreadId } from "./channel-route-2bD3dZs2.mjs";
import { i as stripTargetTopicSuffix, n as stripOutboundTargetKindPrefix, r as stripTargetProviderPrefix, t as resolveTargetPrefixedChannel } from "./channel-target-prefix-D9KEia-0.mjs";
import { S as normalizeConversationTargetRef, _ as withCurrentConversationBindingPublication, a as inspectCurrentConversationBindingRecordsInDatabase, b as captureConversationRef, c as readCurrentConversationBindingListInDatabase, f as removeCurrentConversationBindingsInDatabase, g as currentConversationBindingPublication, i as buildBindingId, m as SessionBindingError, o as isBindingExpired, p as updateCurrentConversationBindingRecordInDatabase, s as pruneCurrentConversationBindingListInTransaction, t as CURRENT_BINDINGS_ID_PREFIX, u as readCurrentConversationBindingResolutionInDatabase, w as withSessionBindingInspectionConversation, x as normalizeConversationRef, y as buildChannelAccountKey } from "./current-conversation-bindings.kernel-CQnqjy0h.mjs";
import { t as loadOptionalBundledChannelPublicArtifact } from "./optional-public-artifact-Sag1ZGk8.mjs";
//#region src/infra/outbound/conversation-id.ts
/**
* Chooses the best conversation id from an explicit thread id or outbound targets.
*/
function resolveConversationIdFromTargets(params) {
	const threadId = stringifyRouteThreadId(params.threadId);
	if (threadId) return threadId;
	for (const rawTarget of params.targets) {
		const target = normalizeOptionalString(rawTarget);
		if (!target) continue;
		const explicitConversationId = normalizeOptionalString(/^(?:channel|conversation|group|room|dm):(.*)$/is.exec(target)?.[1]);
		if (explicitConversationId) return explicitConversationId;
		if (target.includes(":")) continue;
		const numericIdMatch = /^(?:<#(\d+)>|(\d{6,}))$/.exec(target);
		if (numericIdMatch) return numericIdMatch[1] ?? numericIdMatch[2];
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
function resolveBundledChannelThreadBindingDefaultPlacement(channelId) {
	return normalizeThreadBindingPlacement(loadBundledChannelThreadBindingApi(channelId)?.defaultTopLevelPlacement);
}
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
	return normalizeAnyChannelId(raw) ?? normalizeOptionalLowercaseString(raw) ?? null;
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
function resolveConversationScope(channel, plugin, params) {
	const { accountId, cfg } = params;
	return {
		channel,
		accountId: normalizeOptionalString(accountId) || normalizeOptionalString(plugin?.config.defaultAccountId?.(cfg)) || "default",
		threadId: stringifyRouteThreadId(params.threadId),
		plugin
	};
}
function resolveFallbackConversationTargetId(params) {
	const target = params.rawTarget;
	const withoutKind = stripOutboundTargetKindPrefix(target);
	const withoutTopic = params.preserveExplicitTopicSuffix && /:topic:/iu.test(withoutKind) ? withoutKind : stripTargetTopicSuffix(withoutKind, { allowNumericShorthand: params.allowNumericTopicShorthand ?? false });
	return resolveConversationIdFromTargets({ targets: [withoutTopic] }) ?? (withoutTopic !== target ? withoutTopic : void 0);
}
function resolveChannelTargetId(params) {
	const target = normalizeOptionalString(params.target);
	if (!target) return;
	const messaging = params.plugin?.messaging;
	const lower = target.toLowerCase();
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
	const resolutionScope = resolveConversationScope(channel, plugin, params);
	const { accountId, threadId } = resolutionScope;
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
	const resolutionScope = resolveConversationScope(channel, plugin, params);
	const { threadId } = resolutionScope;
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
//#region src/infra/outbound/session-binding-native-selection.ts
/** Private core capability; kept outside the public adapter contract and SDK. */
const nativeSessionBindingSelection = Symbol.for("openclaw.sessionBinding.nativeSelection");
/** Core-owned SQLite adapters enumerate through their original worker; SDK adapters keep their contract. */
const nativeSessionBindingListBySessions = Symbol.for("openclaw.sessionBinding.nativeListBySessions");
/** The core adapter supplies its normalized store keys; the shared owner performs the one native selection. */
const nativeSessionBindingInspection = Symbol.for("openclaw.sessionBinding.nativeInspection");
/** Native mutation precondition; external adapter and released SDK shapes remain unchanged. */
const expectedCurrentSessionBinding = Symbol.for("openclaw.sessionBinding.expectedCurrent");
//#endregion
//#region src/infra/outbound/current-conversation-bindings.ts
const resolvedBindings = resolveGlobalSingleton(Symbol.for("openclaw.resolvedCurrentConversationBindings"), () => {
	const records = /* @__PURE__ */ new Map();
	currentConversationBindingPublication.subscribeFacts((change) => {
		if ("receipt" in change) {
			const identity = change.receipt.source.identity;
			if (typeof identity !== "string") {
				records.clear();
				return;
			}
			for (const [conversationKey, fact] of change.receipt.facts) {
				const key = `${identity}\u0000${CURRENT_BINDINGS_ID_PREFIX}${conversationKey}`;
				if (fact.kind === "postimage" || fact.kind === "absent") {
					if (records.has(key)) records.set(key, Promise.resolve(fact.kind === "postimage" ? structuredClone(fact.value) : null));
				} else if (fact.kind === "unknown") records.delete(key);
			}
		} else if (change.kind === "unknown" || change.kind === "settled" && change.outcome === "unknown") records.clear();
	});
	return records;
}, (records) => records.clear());
function bindingWriteOptions(context, assertCurrent, assertAgentResolved) {
	return {
		assertCurrent,
		createAdmission: withCurrentConversationBindingPublication(createSqliteWorkerWriteAdmission((request) => {
			context.admission.assertCurrent();
			assertCurrent?.();
			if (request.stage === "transaction" && request.facts === true) assertAgentResolved?.();
		}, [context.admission.databasePath]), () => context.admission.identity.key, () => (context.assertPublicationCurrent ?? (() => context.admission.assertCurrent()))())
	};
}
/** Updates one binding from its currently committed row in one synchronous transaction. */
function updateCurrentConversationBindingRecord(ref, update) {
	const conversation = normalizeConversationRef(ref);
	return runOpenClawStateWriteTransaction(({ db }) => updateCurrentConversationBindingRecordInDatabase(db, conversation, update));
}
/** Selects the current row without pruning expiry or rewriting legacy keys. */
function inspectCurrentConversationBindingRecord(ref) {
	return inspectCurrentConversationBindingRecords([ref])[0] ?? null;
}
function inspectCurrentConversationBindingRecords(refs) {
	const conversations = refs.map(captureConversationRef);
	return conversations.length ? withExistingOpenClawStateDatabaseReadOnly(({ db }) => inspectCurrentConversationBindingRecordsInDatabase(db, conversations)) ?? conversations.map(() => null) : [];
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
async function listCurrentConversationBindingRecordsBySessionsAsync(targetSessionKeys, scope, assertCurrent, context = captureOpenClawStateWorkerContext()) {
	const capturedScope = scope ? {
		channel: scope.channel,
		accountId: scope.accountId
	} : void 0;
	const keys = [...targetSessionKeys];
	const records = await runOpenClawStateWorkerOperation(context, (worker) => worker.execute({
		type: "conversationBindings.listBySessions",
		input: {
			targetSessionKeys: keys,
			...capturedScope ? { scope: capturedScope } : {}
		}
	}), bindingWriteOptions(context, assertCurrent));
	context.admission.assertCurrent();
	assertCurrent?.();
	return records;
}
/** Deletes exact account-owned or generic session rows without disturbing sibling owners. */
function deleteCurrentConversationBindingRecordsBySession(targetSessionKey, scope, genericOnly = !scope) {
	return runOpenClawStateWriteTransaction(({ db }) => removeCurrentConversationBindingsInDatabase(db, {
		targetSessionKey,
		scope,
		genericOnly
	}));
}
function resolveChannelConversationBindingSupport(params) {
	const normalized = normalizeAnyChannelId(params.channel) ?? normalizeStringifiedOptionalString(params.channel)?.toLowerCase();
	if (!normalized) return;
	const matchesPluginId = (plugin) => plugin.id === normalized || (plugin.meta?.aliases ?? []).some((alias) => normalizeOptionalLowercaseString(alias) === normalized);
	return ((getActivePluginChannelRegistryFromState()?.channels ?? []).find((entry) => matchesPluginId(entry.plugin))?.plugin)?.conversationBindings;
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
	const bindingSupport = resolveChannelConversationBindingSupport(normalized);
	return bindingSupport?.supportsCurrentConversationBinding === true && bindingSupport.bindingStore !== "adapter" && typeof bindingSupport.createManager !== "function" && (bindingSupport.isCurrentConversationBindingSupported?.({ accountId: normalized.accountId }) ?? true);
}
function bindingRefFromId(bindingId, scope) {
	if (!bindingId.startsWith("generic:")) return null;
	const [channel, accountId, parentConversationId, ...conversationParts] = bindingId.slice(CURRENT_BINDINGS_ID_PREFIX.length).split("␟");
	const conversationId = conversationParts.join("␟");
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
	if (!conversation.channel || !conversation.conversationId || !targetSessionKey) return null;
	const rawNow = Date.now();
	const now = asDateTimestampMs(rawNow);
	if (now === void 0) return null;
	const ttlMs = typeof input.ttlMs === "number" && Number.isFinite(input.ttlMs) ? Math.max(0, Math.floor(input.ttlMs)) : void 0;
	const expiresAt = ttlMs === void 0 ? void 0 : ttlMs === 0 ? now : resolveExpiresAtMsFromDurationMs(ttlMs, { nowMs: rawNow });
	if (ttlMs !== void 0 && expiresAt === void 0) return null;
	const captured = captureGenericBindingSupport(conversation);
	if (!captured.supported) return null;
	return bindCurrentConversationRecordAsync({
		expected: input[expectedCurrentSessionBinding],
		record: {
			bindingId: buildBindingId(conversation),
			targetSessionKey,
			targetKind: input.targetKind,
			conversation,
			status: "active",
			boundAt: now,
			...expiresAt !== void 0 ? { expiresAt } : {},
			metadata: {
				...input.metadata,
				lastActivityAt: now
			}
		}
	}, () => {
		assertCurrent?.();
		captured.assertCurrent();
	});
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
/** Removes generic bindings in the same worker that owns binding creation and refresh. */
async function unbindGenericCurrentConversationBindings(input) {
	const normalizedBindingId = input.bindingId?.trim();
	if (normalizedBindingId?.startsWith("generic:")) {
		const conversation = bindingRefFromId(normalizedBindingId, input.scope);
		if (!conversation) return [];
		const captured = captureGenericBindingSupport(conversation);
		return captured.supported ? removeCurrentConversationBindingsAsync({
			conversation,
			bindingId: normalizedBindingId,
			expected: input[expectedCurrentSessionBinding]
		}, captured.assertCurrent) : [];
	}
	const targetSessionKey = input.targetSessionKey?.trim();
	const registry = getActivePluginChannelRegistrySnapshotFromState();
	return targetSessionKey ? removeCurrentConversationBindingsAsync({
		targetSessionKey,
		scope: input.scope,
		genericOnly: true
	}, () => {
		if (getActivePluginChannelRegistrySnapshotFromState() !== registry) throw new SessionBindingError("BINDING_ADAPTER_UNAVAILABLE", "Generic conversation binding owners changed during removal");
	}) : [];
}
/** Captures persistence bytes before yielding; the worker merges against the committed row. */
function bindCurrentConversationRecordAsync(input, assertCurrent, assertAgentResolved) {
	const context = captureOpenClawStateWorkerContext();
	const captured = {
		metadataKeys: Object.keys(input.record.metadata ?? {}),
		record: {
			...input.record,
			conversation: captureConversationRef(input.record.conversation),
			metadata: input.record.metadata ? safeParseJsonRecord(JSON.stringify(input.record.metadata)) : void 0
		},
		...input.accountPolicy ? { accountPolicy: { ...input.accountPolicy } } : {},
		...input.expected !== void 0 ? { expected: input.expected === null ? null : structuredClone(input.expected) } : {}
	};
	return runOpenClawStateWorkerOperation(context, (worker) => worker.execute({
		type: "conversationBindings.bind",
		input: captured
	}), bindingWriteOptions(context, assertCurrent, assertAgentResolved));
}
function removeCurrentConversationBindingsAsync(input, assertCurrent) {
	const context = captureOpenClawStateWorkerContext();
	const captured = "conversation" in input ? {
		conversation: captureConversationRef(input.conversation),
		bindingId: input.bindingId,
		expected: input.expected === void 0 ? void 0 : structuredClone(input.expected)
	} : {
		...input,
		scope: input.scope ? { ...input.scope } : void 0
	};
	return runOpenClawStateWorkerOperation(context, (worker) => worker.execute({
		type: "conversationBindings.remove",
		input: captured
	}), bindingWriteOptions(context, assertCurrent));
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
	const key = `${context.admission.identity.key}\u0000${buildBindingId(conversation)}`;
	let pending = resolvedBindings.get(key);
	if (pending) {
		const record = await pending;
		if (record && isBindingExpired(record)) {
			resolvedBindings.delete(key);
			pending = void 0;
		}
	}
	if (!pending) {
		pending = runOpenClawStateWorkerOperation(context, (scope) => scope.execute({
			type: "conversationBindings.resolve",
			input: conversation
		}), bindingWriteOptions(context, assertCurrent));
		if (resolvedBindings.size >= 256) resolvedBindings.delete(resolvedBindings.keys().next().value);
		resolvedBindings.set(key, pending);
		pending.catch(() => {
			if (resolvedBindings.get(key) === pending) resolvedBindings.delete(key);
		});
	}
	const result = await pending;
	context.admission.assertCurrent();
	assertCurrent?.();
	return structuredClone(result);
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
	}), bindingWriteOptions(context, assertCurrent));
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
	return {
		supported,
		assertCurrent
	};
}
async function inspectGenericCurrentConversationBindingAsync(ref) {
	const conversation = captureConversationRef(ref);
	const captured = captureGenericBindingSupport(conversation);
	if (!captured.supported) return null;
	const record = await inspectCurrentConversationBindingRecordAsync(conversation);
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
	const records = await readCurrentConversationBindingSelectionAsync(conversations.filter((_, index) => captured[index]?.supported), assertCurrent);
	let index = 0;
	return captured.map((support) => {
		const record = support.supported ? records[index++] : null;
		return record?.bindingId.startsWith("generic:") ? record : null;
	});
}
/** Plugin eligibility is evaluated only after native listing has settled. */
async function listGenericCurrentConversationBindingsBySessionsAsync(targetSessionKeys, context) {
	return (await listCurrentConversationBindingRecordsBySessionsAsync(targetSessionKeys, void 0, void 0, context)).map((entries) => entries.filter((record) => {
		if (!record.bindingId.startsWith("generic:")) return false;
		return supportsGenericCurrentConversationBinding(record.conversation);
	}));
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
	resolvedBindings.clear();
} };
//#endregion
//#region src/infra/outbound/prepared-session-binding.ts
/** Prepared row facts serve synchronous effect grants; committed writes invalidate the selection. */
async function prepareSessionBindingSelection(refs, owner) {
	const conversations = refs.map(captureConversationRef);
	let changed = false;
	let active = true;
	const unsubscribe = currentConversationBindingPublication.subscribeFacts((change) => {
		if ("receipt" in change || change.kind === "pending" || change.kind === "unknown" || change.kind === "settled" && change.outcome === "unknown") changed = true;
	});
	const dispose = () => {
		active = false;
		unsubscribe();
	};
	const checks = [];
	const records = conversations.map(() => null);
	const native = [];
	const groups = /* @__PURE__ */ new Map();
	try {
		for (const [index, conversation] of conversations.entries()) {
			const adapter = owner.resolveAdapterForChannelAccount(conversation);
			checks.push(() => owner.assertAdapterSelectionCurrent(conversation, adapter));
			if (adapter?.[nativeSessionBindingInspection]) {
				const source = adapter[nativeSessionBindingInspection];
				const captured = source.capture(conversation);
				checks.push(() => source.assertCurrent());
				if (captured) native.push({
					index,
					conversation: captured
				});
			} else if (adapter) {
				const indexes = groups.get(adapter) ?? [];
				indexes.push(index);
				groups.set(adapter, indexes);
			} else if (!requiresRegisteredSessionBindingAdapter(conversation)) {
				const support = captureGenericBindingSupport(conversation);
				checks.push(support.assertCurrent);
				if (support.supported) native.push({
					index,
					conversation
				});
			}
		}
		if (native.length) {
			const context = captureOpenClawStateWorkerContext();
			checks.push(() => context.admission.assertCurrent());
		}
		const values = native.length ? await readCurrentConversationBindingSelectionAsync(native.map((item) => item.conversation)) : [];
		native.forEach((item, index) => {
			records[item.index] = values[index] ?? null;
		});
		for (const [adapter, indexes] of groups) {
			const selected = indexes.map((index) => conversations[index]);
			if (owner.isAsyncAdapter(adapter)) {
				const snapshot = await adapter.inspectByConversationsAsync(selected);
				if (snapshot.bindings.length !== selected.length) throw new Error("Session binding owner returned an incomplete conversation selection");
				checks.push(snapshot.assertCurrent);
				indexes.forEach((index, position) => {
					records[index] = snapshot.bindings[position] ?? null;
				});
			} else checks.push(() => {
				const inspect = adapter.inspectByConversation ?? adapter.resolveByConversation;
				indexes.forEach((index) => {
					records[index] = inspect.call(adapter, conversations[index]);
				});
			});
		}
		return {
			inspect() {
				if (!active) throw new Error("Conversation binding inspection is no longer active");
				if (changed) throw new Error("Conversation binding ownership changed. Retry the request.");
				for (const check of checks) check();
				return conversations.map((conversation, index) => {
					const adapter = owner.resolveAdapterForChannelAccount(conversation);
					if (!adapter && requiresRegisteredSessionBindingAdapter(conversation)) return withSessionBindingInspectionConversation({ status: "unavailable" }, conversation);
					const selected = records[index] ?? null;
					const record = !adapter && !selected?.bindingId.startsWith("generic:") ? null : selected;
					return owner.availableBindingInspection(conversation, record && !isBindingExpired(record) ? record : null);
				});
			},
			dispose
		};
	} catch (error) {
		dispose();
		throw error;
	}
}
//#endregion
//#region src/infra/outbound/session-binding-service.ts
function isAsyncAdapter(adapter) {
	return "version" in adapter && adapter.version === 2;
}
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
/** @deprecated Use registerSessionBindingAdapterV2; final compatibility day: 2026-12-31. */
function registerSessionBindingAdapter(adapter) {
	warnPluginSdkDeprecation({
		family: "conversation-bindings",
		method: "registerSessionBindingAdapter",
		replacement: "registerSessionBindingAdapterV2",
		compatibility: "Synchronous binding operations retain commit-before-return compatibility."
	});
	registerAdapter(adapter);
}
function registerAdapter(adapter) {
	const normalizedAdapter = {
		...adapter,
		...normalizeConversationRef({
			channel: adapter.channel,
			accountId: adapter.accountId,
			conversationId: "unused"
		})
	};
	const key = buildChannelAccountKey(normalizedAdapter);
	const registrations = ADAPTERS_BY_CHANNEL_ACCOUNT.get(key) ?? [];
	registrations.push({
		adapter,
		normalizedAdapter
	});
	ADAPTERS_BY_CHANNEL_ACCOUNT.set(key, registrations);
}
function registerSessionBindingAdapterV2(adapter) {
	registerAdapter(adapter);
}
function unregisterSessionBindingAdapter(params) {
	const key = buildChannelAccountKey(params);
	const registrations = ADAPTERS_BY_CHANNEL_ACCOUNT.get(key);
	if (!registrations?.length) return;
	const registrationIndex = params.adapter ? registrations.findLastIndex((registration) => registration.adapter === params.adapter) : registrations.length - 1;
	if (registrationIndex < 0) return;
	registrations.splice(registrationIndex, 1);
	if (registrations.length === 0) ADAPTERS_BY_CHANNEL_ACCOUNT.delete(key);
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
	if (adapter && isAsyncAdapter(adapter)) adapter.assertCurrent();
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
	return [...ADAPTERS_BY_CHANNEL_ACCOUNT.values()].flatMap((registrations) => registrations.at(-1)?.normalizedAdapter ?? []);
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
async function listSessionBindingsBySessionsAsync(targetSessionKeys) {
	const keys = uniqueValues(targetSessionKeys.map((key) => key.trim()).filter(Boolean));
	if (keys.length === 0) return /* @__PURE__ */ new Map();
	const context = captureOpenClawStateWorkerContext();
	const adapters = getActiveRegisteredAdapters();
	const prepared = /* @__PURE__ */ new Map();
	for (const adapter of adapters) {
		const nativeList = adapter[nativeSessionBindingListBySessions];
		if (!nativeList && !isAsyncAdapter(adapter)) continue;
		if (isAsyncAdapter(adapter)) adapter.assertCurrent();
		const records = nativeList ? await nativeList.call(adapter, keys, context) : isAsyncAdapter(adapter) ? await Promise.all(keys.map((key) => adapter.listBySessionAsync(key))) : [];
		if (isAsyncAdapter(adapter)) adapter.assertCurrent();
		if (records.length !== keys.length) throw new Error("Session binding owner returned an incomplete session listing");
		prepared.set(adapter, records);
	}
	const generic = await listGenericCurrentConversationBindingsBySessionsAsync(keys, context);
	return new Map(keys.map((key, index) => {
		const results = [];
		for (const adapter of adapters) {
			const entries = prepared.has(adapter) ? prepared.get(adapter)[index] : adapter.listBySession(key);
			results.push(...entries);
		}
		results.push(...generic[index] ?? []);
		return [key, dedupeBindings(results).filter((record) => routableBinding(record))];
	}));
}
async function listSessionBindingsBySessionAsync(targetSessionKey) {
	return (await listSessionBindingsBySessionsAsync([targetSessionKey])).get(targetSessionKey.trim()) ?? [];
}
/** @deprecated Use inspectSessionBindingByConversationAsync; final compatibility day: 2026-12-31. */
function inspectSessionBindingByConversation(ref) {
	warnPluginSdkDeprecation({
		family: "conversation-bindings",
		method: "inspectSessionBindingByConversation",
		replacement: "inspectSessionBindingByConversationAsync",
		compatibility: "Synchronous binding operations retain commit-before-return compatibility."
	});
	return inspectSessionBindingsByConversations([ref])[0];
}
/** One synchronous owner view per phase; no selection survives a wait or a later grant. */
function inspectSessionBindingsByConversations(refs) {
	const nativeRefs = [];
	const selections = refs.map((ref) => {
		const conversation = captureConversationRef(ref);
		if (!conversation.channel || !conversation.conversationId) return () => ({
			status: "available",
			binding: null
		});
		const adapter = resolveAdapterForChannelAccount(conversation);
		const native = adapter?.[nativeSessionBindingInspection];
		if (adapter && !native) {
			const record = (adapter.inspectByConversation || adapter.resolveByConversation).call(adapter, conversation);
			return () => {
				assertAdapterSelectionCurrent(conversation, adapter);
				return availableBindingInspection(conversation, record);
			};
		}
		if (!adapter && requiresRegisteredSessionBindingAdapter(conversation)) return () => withSessionBindingInspectionConversation({ status: "unavailable" }, conversation);
		const generic = adapter ? void 0 : captureGenericBindingSupport(conversation);
		native?.assertCurrent();
		const captured = native ? native.capture(conversation) : generic?.supported ? conversation : null;
		const index = captured ? nativeRefs.push(captured) - 1 : -1;
		return (records) => {
			assertAdapterSelectionCurrent(conversation, adapter);
			native?.assertCurrent();
			generic?.assertCurrent();
			const record = index >= 0 ? records[index] ?? null : null;
			return availableBindingInspection(conversation, !adapter && !record?.bindingId.startsWith("generic:") ? null : record);
		};
	});
	const records = inspectCurrentConversationBindingRecords(nativeRefs);
	return selections.map((select) => select(records));
}
/** Prepares worker-backed binding facts without transferring adapter-registry ownership. */
function prepareSessionBindingInspections(refs) {
	return prepareSessionBindingSelection(refs, {
		resolveAdapterForChannelAccount,
		assertAdapterSelectionCurrent,
		isAsyncAdapter,
		availableBindingInspection
	});
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
	if (adapter && isAsyncAdapter(adapter)) adapter.assertCurrent();
	let snapshot;
	const binding = adapter ? isAsyncAdapter(adapter) ? (snapshot = await adapter.inspectByConversationsAsync([normalized])).bindings[0] ?? null : adapter.inspectByConversationAsync ? await adapter.inspectByConversationAsync(normalized) : (adapter.inspectByConversation || adapter.resolveByConversation).call(adapter, normalized) : await inspectGenericCurrentConversationBindingAsync(normalized);
	if (resolveAdapterForChannelAccount(normalized) !== adapter || !adapter && requiresRegisteredSessionBindingAdapter(normalized)) return withSessionBindingInspectionConversation({ status: "unavailable" }, normalized);
	if (adapter && isAsyncAdapter(adapter)) adapter.assertCurrent();
	snapshot?.assertCurrent();
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
	let snapshot;
	const records = !adapter ? await readGenericCurrentConversationBindingSelectionAsync(conversations, { assertCurrent }) : nativeRead ? await nativeRead.call(adapter, conversations) : isAsyncAdapter(adapter) ? (snapshot = await adapter.inspectByConversationsAsync(conversations)).bindings : await readLegacyAdapterSelection(adapter, conversations, assertCurrent);
	assertCurrent();
	snapshot?.assertCurrent();
	if (records.length !== conversations.length) throw new Error("Session binding owner returned an incomplete conversation selection");
	return records.map(routableBinding);
}
const DEFAULT_SESSION_BINDING_SERVICE = {
	listBySessionAsync: listSessionBindingsBySessionAsync,
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
		if (adapter ? !adapter.bind : !genericCapabilities?.bindSupported) throw new SessionBindingError(adapter ? "BINDING_CAPABILITY_UNSUPPORTED" : "BINDING_ADAPTER_UNAVAILABLE", `Session binding adapter ${adapter ? "does not support binding" : "unavailable"} for ${normalizedConversation.channel}:${normalizedConversation.accountId}`, scope);
		const placement = normalizePlacement(input.placement) ?? (normalizedConversation.conversationId ? "current" : "child");
		if (!(adapter ? resolveAdapterPlacements(adapter) : genericCapabilities.placements).includes(placement)) throw new SessionBindingError("BINDING_CAPABILITY_UNSUPPORTED", `Session binding placement "${placement}" is not supported for ${normalizedConversation.channel}:${normalizedConversation.accountId}`, {
			...scope,
			placement
		});
		const assertBindingCurrent = () => {
			assertCurrent?.();
			assertAdapterSelectionCurrent(normalizedConversation, adapter);
		};
		const bindInput = {
			...input,
			conversation: normalizedConversation,
			placement,
			assertCurrent: assertBindingCurrent
		};
		assertBindingCurrent();
		const bound = adapter ? await adapter.bind(bindInput) : await bindGenericCurrentConversation(bindInput);
		if (!bound) throw new SessionBindingError("BINDING_CREATE_FAILED", "Session binding adapter failed to bind target conversation", {
			...scope,
			placement
		});
		return bound;
	},
	getCapabilities: (params) => {
		const adapter = resolveAdapterForChannelAccount(params);
		return adapter ? resolveAdapterCapabilities(adapter) : getGenericCurrentConversationBindingCapabilities(params) ?? resolveAdapterCapabilities(null);
	},
	/** @deprecated Use listBySessionAsync; final compatibility day: 2026-12-31. */
	listBySession: (targetSessionKey) => {
		warnPluginSdkDeprecation({
			family: "conversation-bindings",
			method: "SessionBindingService.listBySession",
			replacement: "SessionBindingService.listBySessionAsync",
			compatibility: "Synchronous binding operations retain commit-before-return compatibility."
		});
		const key = targetSessionKey.trim();
		if (!key) return [];
		const results = [];
		for (const adapter of getActiveRegisteredAdapters()) results.push(...adapter.listBySession(key));
		results.push(...listGenericCurrentConversationBindingsBySession(key));
		return dedupeBindings(results).filter((record) => routableBinding(record));
	},
	/** @deprecated Use resolveByConversationAsync; final compatibility day: 2026-12-31. */
	resolveByConversation: (ref) => {
		warnPluginSdkDeprecation({
			family: "conversation-bindings",
			method: "SessionBindingService.resolveByConversation",
			replacement: "SessionBindingService.resolveByConversationAsync",
			compatibility: "Synchronous binding operations retain commit-before-return compatibility."
		});
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
		const binding = adapter ? isAsyncAdapter(adapter) || adapter.resolveByConversationAsync ? await adapter.resolveByConversationAsync(normalized) : adapter.resolveByConversation(normalized) : await resolveGenericCurrentConversationBindingAsync(normalized, { assertCurrent: () => assertAdapterSelectionCurrent(normalized, null) });
		assertAdapterSelectionCurrent(normalized, adapter);
		return routableBinding(binding);
	},
	/** @deprecated Use touchAsync; final compatibility day: 2026-12-31. */
	touch: (bindingId, at, scope) => {
		warnPluginSdkDeprecation({
			family: "conversation-bindings",
			method: "SessionBindingService.touch",
			replacement: "SessionBindingService.touchAsync",
			compatibility: "Synchronous binding operations retain commit-before-return compatibility."
		});
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
			if (isAsyncAdapter(adapter) || adapter.touchAsync) await adapter.touchAsync(normalizedBindingId, at);
			else adapter.touch?.(normalizedBindingId, at);
		}
		if (!ownerScope || adapters.length === 0) await touchGenericCurrentConversationBindingAsync(normalizedBindingId, at, ownerScope, { assertCurrent: (ref) => assertAdapterSelectionCurrent(ref, null) });
	},
	unbind: async (input) => {
		const removed = [];
		const captured = {
			...input,
			scope: input.scope ? { ...input.scope } : void 0
		};
		const adapters = getActiveRegisteredAdapters(captured.scope);
		for (const adapter of adapters) {
			assertAdapterSelectionCurrent(adapter, adapter);
			if (adapter.unbind) removed.push(...await adapter.unbind(captured));
		}
		if (!captured.scope || adapters.length === 0) removed.push(...await unbindGenericCurrentConversationBindings(captured));
		return dedupeBindings(removed);
	}
};
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
export { resolveCommandConversationResolution as A, touchCurrentConversationBindingRecordAsync as C, nativeSessionBindingListBySessions as D, nativeSessionBindingInspection as E, resolveSpawnThreadBindingPlacement as M, supportsThreadBindingSpawn as N, nativeSessionBindingSelection as O, resolveConversationIdFromTargets as P, resolveCurrentConversationBindingRecordAsync as S, expectedCurrentSessionBinding as T, listCurrentConversationBindingRecordsBySession as _, listSessionBindingsBySessionAsync as a, removeCurrentConversationBindingsAsync as b, readSessionBindingSelectionCurrent as c, testing as d, unregisterSessionBindingAdapter as f, inspectCurrentConversationBindingRecordAsync as g, inspectCurrentConversationBindingRecord as h, isSessionBindingAdapterCurrent as i, resolveInboundConversationResolution as j, resolveChannelDefaultBindingPlacement as k, registerSessionBindingAdapter as l, deleteCurrentConversationBindingRecordsBySession as m, inspectSessionBindingByConversation as n, listSessionBindingsBySessionsAsync as o, bindCurrentConversationRecordAsync as p, inspectSessionBindingByConversationAsync as r, prepareSessionBindingInspections as s, getSessionBindingService as t, registerSessionBindingAdapterV2 as u, listCurrentConversationBindingRecordsBySessionsAsync as v, updateCurrentConversationBindingRecord as w, resolveCurrentConversationBindingRecord as x, readCurrentConversationBindingSelectionAsync as y };
