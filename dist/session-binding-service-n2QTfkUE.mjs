import { D as resolveExpiresAtMsFromDurationMs, o as asDateTimestampMs } from "./number-coercion-CLj0HTDM.mjs";
import { n as resolveGlobalMap } from "./global-singleton-Dc_stLtU.mjs";
import { c as normalizeOptionalLowercaseString } from "./string-coerce-CIXf7egm.mjs";
import { b as uniqueValues } from "./string-normalization-_gRhJUDw.mjs";
import { i as getNodeSqliteKysely, n as executeSqliteQuerySync } from "./kysely-sync-Bn6Qrpbz.mjs";
import { t as executeExistingOpenClawStateRead, u as withExistingOpenClawStateDatabaseReadOnly } from "./openclaw-state-db-readonly-CbuLJI4_.mjs";
import { t as captureOpenClawStateWorkerContext } from "./openclaw-state-worker-context-Dn3_Z_Oi.mjs";
import { c as runOpenClawStateWriteTransaction, r as openOpenClawStateDatabase } from "./openclaw-state-db-BFK9cMiV.mjs";
import { n as createSqliteWorkerWriteAdmission } from "./sqlite-worker-store-H5HXDD9v.mjs";
import { i as runOpenClawStateWorkerOperation } from "./openclaw-state-worker-store-YAl4mP45.mjs";
import "./message-channel-constants-Cd7Eq8Zi.mjs";
import { a as getActivePluginChannelRegistrySnapshotFromState, i as getActivePluginChannelRegistryFromState } from "./registry-lookup-CHpIYnmq.mjs";
import { t as normalizeAnyChannelId } from "./registry-normalize-X0yNhfFZ.mjs";
import "./registry-BKdVEB34.mjs";
import { n as buildChannelAccountKey, o as withSessionBindingInspectionConversation, r as normalizeConversationRef } from "./current-conversation-binding-row-De9sUoDf.mjs";
import { a as inspectCurrentConversationBindingRecordInDatabase, c as readCurrentConversationBindingResolutionInDatabase, i as deleteCurrentConversationBindingRow, n as bindingRowsToRecords, o as isBindingExpired, r as buildBindingId, s as listCurrentConversationBindingRowsBySession, t as CURRENT_BINDINGS_ID_PREFIX, u as updateCurrentConversationBindingRecordInDatabase } from "./current-conversation-bindings.kernel-BU4rifLo.mjs";
//#region src/acp/conversation-id.ts
/** Normalizes ACP conversation identifiers from loose metadata values. */
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
	const rows = listCurrentConversationBindingRowsBySession(db, targetSessionKey, scope);
	const records = bindingRowsToRecords(rows);
	if (!records.some((record) => isBindingExpired(record))) return records;
	return runOpenClawStateWriteTransaction(({ db: transactionDb }) => {
		const latestRows = listCurrentConversationBindingRowsBySession(transactionDb, targetSessionKey, scope);
		const active = [];
		for (const row of latestRows) {
			const record = bindingRowsToRecords([row])[0];
			if (!record || isBindingExpired(record)) deleteCurrentConversationBindingRow(transactionDb, row.binding_key);
			else active.push(record);
		}
		return active;
	});
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
/** Async transport carries only the canonical conversation identity, not caller context. */
function captureCurrentConversationRef(ref) {
	const { channel, accountId, conversationId, parentConversationId } = ref;
	return normalizeConversationRef({
		channel,
		accountId,
		conversationId,
		...parentConversationId !== void 0 ? { parentConversationId } : {}
	});
}
/** Reads committed state without creating the store, pruning expiry, or repairing rows. */
async function inspectCurrentConversationBindingRecordAsync(ref) {
	const conversation = captureCurrentConversationRef(ref);
	const result = await executeExistingOpenClawStateRead({}, {
		type: "conversationBindings.inspect",
		conversation
	});
	if (!result) return null;
	if (!result.ok || result.type !== "conversationBindings.inspect") throw new Error("Unexpected current conversation binding inspection result");
	return result.record;
}
async function resolveCurrentConversationBindingRecordAsync(ref, assertCurrent) {
	const conversation = captureCurrentConversationRef(ref);
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
	const conversations = refs.map(captureCurrentConversationRef);
	const context = captureOpenClawStateWorkerContext();
	const result = await runOpenClawStateWorkerOperation(context, (scope) => scope.execute({
		type: "conversationBindings.readSelection",
		input: conversations
	}), {
		assertCurrent,
		existingOnly: true,
		requireStateLifecycle: true
	});
	context.admission.assertCurrent();
	assertCurrent?.();
	return result ?? conversations.map(() => null);
}
/** Domain input only crosses IPC; read/modify/write predicates execute in one worker transaction. */
async function touchCurrentConversationBindingRecordAsync(input, assertCurrent) {
	const captured = {
		conversation: captureCurrentConversationRef(input.conversation),
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
	const conversation = captureCurrentConversationRef(ref);
	const captured = captureGenericBindingSupport(conversation);
	if (!captured.supported) return null;
	options?.assertCurrent?.();
	const record = await inspectCurrentConversationBindingRecordAsync(conversation);
	options?.assertCurrent?.();
	captured.assertCurrent();
	return record?.bindingId.startsWith("generic:") ? record : null;
}
async function resolveGenericCurrentConversationBindingAsync(ref, options) {
	const conversation = captureCurrentConversationRef(ref);
	const captured = captureGenericBindingSupport(conversation);
	if (!captured.supported) return null;
	const record = await resolveCurrentConversationBindingRecordAsync(conversation, () => {
		options?.assertCurrent?.();
		captured.assertCurrent();
	});
	return record?.bindingId.startsWith("generic:") ? record : null;
}
async function readGenericCurrentConversationBindingSelectionAsync(refs, options) {
	const conversations = refs.map(captureCurrentConversationRef);
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
async function touchGenericCurrentConversationBindingAsync(bindingId, at = Date.now(), scope, options) {
	const ref = bindingRefFromId(bindingId, scope);
	if (!ref) return;
	const conversation = captureCurrentConversationRef(ref);
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
//#endregion
//#region src/infra/outbound/session-binding-service.ts
function normalizePlacement(raw) {
	return raw === "current" || raw === "child" ? raw : void 0;
}
function inferDefaultPlacement(ref) {
	return ref.conversationId ? "current" : "child";
}
function resolveAdapterPlacements(adapter) {
	const placements = (adapter.capabilities?.placements?.map((value) => normalizePlacement(value)))?.filter((value) => Boolean(value));
	if (placements && placements.length > 0) return uniqueValues(placements);
	return ["current", "child"];
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
function captureConversationRef(ref) {
	return normalizeConversationRef({
		channel: ref.channel,
		accountId: ref.accountId,
		conversationId: ref.conversationId,
		...ref.parentConversationId !== void 0 ? { parentConversationId: ref.parentConversationId } : {}
	});
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
		binding
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
	return records;
}
function createDefaultSessionBindingService() {
	return {
		inspectByConversationAsync: inspectSessionBindingByConversationAsync,
		bind: async (input) => {
			const assertCurrent = input.assertCurrent;
			const normalizedConversation = normalizeConversationRef(input.conversation);
			const adapter = resolveAdapterForChannelAccount(normalizedConversation);
			const genericCapabilities = adapter ? null : getGenericCurrentConversationBindingCapabilities(normalizedConversation);
			if (!adapter && !genericCapabilities?.bindSupported) throw new SessionBindingError("BINDING_ADAPTER_UNAVAILABLE", `Session binding adapter unavailable for ${normalizedConversation.channel}:${normalizedConversation.accountId}`, {
				channel: normalizedConversation.channel,
				accountId: normalizedConversation.accountId
			});
			if (adapter && !adapter.bind) throw new SessionBindingError("BINDING_CAPABILITY_UNSUPPORTED", `Session binding adapter does not support binding for ${normalizedConversation.channel}:${normalizedConversation.accountId}`, {
				channel: normalizedConversation.channel,
				accountId: normalizedConversation.accountId
			});
			const placement = normalizePlacement(input.placement) ?? inferDefaultPlacement(normalizedConversation);
			if (!(adapter ? resolveAdapterPlacements(adapter) : genericCapabilities.placements).includes(placement)) throw new SessionBindingError("BINDING_CAPABILITY_UNSUPPORTED", `Session binding placement "${placement}" is not supported for ${normalizedConversation.channel}:${normalizedConversation.accountId}`, {
				channel: normalizedConversation.channel,
				accountId: normalizedConversation.accountId,
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
				channel: normalizedConversation.channel,
				accountId: normalizedConversation.accountId,
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
			for (const adapter of getActiveRegisteredAdapters()) {
				const entries = adapter.listBySession(key);
				if (entries.length > 0) results.push(...entries);
			}
			results.push(...listGenericCurrentConversationBindingsBySession(key));
			return dedupeBindings(results);
		},
		resolveByConversation: (ref) => {
			const normalized = normalizeConversationRef(ref);
			if (!normalized.channel || !normalized.conversationId) return null;
			const adapter = resolveAdapterForChannelAccount(normalized);
			if (!adapter) return resolveGenericCurrentConversationBinding(normalized);
			return adapter.resolveByConversation(normalized);
		},
		resolveByConversationAsync: async (ref) => {
			const normalized = captureConversationRef(ref);
			if (!normalized.channel || !normalized.conversationId) return null;
			const adapter = resolveAdapterForChannelAccount(normalized);
			assertAdapterSelectionCurrent(normalized, adapter);
			const binding = adapter ? adapter.resolveByConversationAsync ? await adapter.resolveByConversationAsync(normalized) : adapter.resolveByConversation(normalized) : await resolveGenericCurrentConversationBindingAsync(normalized, { assertCurrent: () => assertAdapterSelectionCurrent(normalized, null) });
			assertAdapterSelectionCurrent(normalized, adapter);
			return binding;
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
				const entries = await adapter.unbind(input);
				if (entries.length > 0) removed.push(...entries);
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
export { updateCurrentConversationBindingRecord as _, registerSessionBindingAdapter as a, normalizeConversationText as b, nativeSessionBindingSelection as c, inspectCurrentConversationBindingRecordAsync as d, listCurrentConversationBindingRecordsBySession as f, touchCurrentConversationBindingRecordAsync as g, resolveCurrentConversationBindingRecordAsync as h, readSessionBindingSelectionCurrent as i, deleteCurrentConversationBindingRecordsBySession as l, resolveCurrentConversationBindingRecord as m, inspectSessionBindingByConversation as n, testing as o, readCurrentConversationBindingSelectionAsync as p, isSessionBindingAdapterCurrent as r, unregisterSessionBindingAdapter as s, getSessionBindingService as t, inspectCurrentConversationBindingRecord as u, SessionBindingError as v, isSessionBindingError as y };
