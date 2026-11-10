import { t as getDiscordRuntime } from "./runtime-DgnVQ7zW.mjs";
import { logVerbose } from "openclaw/plugin-sdk/runtime-env";
import { normalizeAccountId, resolveAgentIdFromSessionKey } from "openclaw/plugin-sdk/routing";
import { asOptionalObjectRecord, normalizeLowercaseStringOrEmpty, normalizeOptionalString, normalizeOptionalStringifiedId } from "openclaw/plugin-sdk/string-coerce-runtime";
import { resolveNonNegativeIntegerOption, resolveOptionalIntegerOption } from "openclaw/plugin-sdk/number-runtime";
import { resolveGlobalSingleton } from "openclaw/plugin-sdk/global-singleton";
import { createPluginStateErrorReporter } from "openclaw/plugin-sdk/plugin-state-runtime";
import { resolveThreadBindingExpiry, warnPluginSdkDeprecation } from "openclaw/plugin-sdk/thread-bindings-session-runtime";
import { recordOutboundMessageIdentity } from "openclaw/plugin-sdk/outbound-echo-runtime";
//#region extensions/discord/src/monitor/thread-bindings.state.ts
const THREAD_BINDINGS_STATE_KEY = Symbol.for("openclaw.discordThreadBindingsState");
function createThreadBindingsGlobalState() {
	return {
		managersByAccountId: /* @__PURE__ */ new Map(),
		bindingsByThreadId: /* @__PURE__ */ new Map(),
		bindingsBySessionKey: /* @__PURE__ */ new Map(),
		tokensByAccountId: /* @__PURE__ */ new Map(),
		reusableWebhooksByAccountChannel: /* @__PURE__ */ new Map(),
		persistByAccountId: /* @__PURE__ */ new Map(),
		loadedBindings: false,
		loadedPersistentBindings: false,
		persistenceAvailable: true,
		lastPersistedAtMs: 0,
		mutationTail: Promise.resolve(),
		accountOperationTails: /* @__PURE__ */ new WeakMap()
	};
}
const THREAD_BINDINGS_STATE = resolveGlobalSingleton(THREAD_BINDINGS_STATE_KEY, createThreadBindingsGlobalState);
THREAD_BINDINGS_STATE.accountOperationTails ??= /* @__PURE__ */ new WeakMap();
const MANAGERS_BY_ACCOUNT_ID = THREAD_BINDINGS_STATE.managersByAccountId;
const BINDINGS_BY_THREAD_ID = THREAD_BINDINGS_STATE.bindingsByThreadId;
const BINDINGS_BY_SESSION_KEY = THREAD_BINDINGS_STATE.bindingsBySessionKey;
const TOKENS_BY_ACCOUNT_ID = THREAD_BINDINGS_STATE.tokensByAccountId;
const REUSABLE_WEBHOOKS_BY_ACCOUNT_CHANNEL = THREAD_BINDINGS_STATE.reusableWebhooksByAccountChannel;
const PERSIST_BY_ACCOUNT_ID = THREAD_BINDINGS_STATE.persistByAccountId;
const THREAD_BINDING_TOUCH_PERSIST_MIN_INTERVAL_MS = 15e3;
const THREAD_BINDINGS_NAMESPACE = "thread-bindings";
const THREAD_BINDINGS_MAX_ENTRIES = 1e4;
function rememberThreadBindingToken(params) {
	const normalizedAccountId = normalizeAccountId(params.accountId);
	const token = params.token?.trim();
	if (!token) return;
	TOKENS_BY_ACCOUNT_ID.set(normalizedAccountId, token);
}
function forgetThreadBindingToken(accountId) {
	TOKENS_BY_ACCOUNT_ID.delete(normalizeAccountId(accountId));
}
function getThreadBindingToken(accountId) {
	return TOKENS_BY_ACCOUNT_ID.get(normalizeAccountId(accountId));
}
function shouldDefaultPersist() {
	return !(process.env.VITEST || false);
}
function openThreadBindingsStore() {
	return getDiscordRuntime().state.openSyncKeyedStore({
		namespace: THREAD_BINDINGS_NAMESPACE,
		maxEntries: THREAD_BINDINGS_MAX_ENTRIES
	});
}
function openThreadBindingsStoreAsync() {
	return getDiscordRuntime().state.openKeyedStoreV2({
		namespace: THREAD_BINDINGS_NAMESPACE,
		maxEntries: THREAD_BINDINGS_MAX_ENTRIES
	});
}
function normalizeTargetKind(raw, targetSessionKey) {
	if (raw === "subagent" || raw === "acp") return raw;
	return targetSessionKey.includes(":subagent:") ? "subagent" : "acp";
}
function toBindingRecordKey(params) {
	return `${normalizeAccountId(params.accountId)}:${params.threadId.trim()}`;
}
function resolveBindingRecordKey(params) {
	const threadId = normalizeOptionalStringifiedId(params.threadId);
	if (!threadId) return;
	return toBindingRecordKey({
		accountId: params.accountId,
		threadId
	});
}
function normalizePersistedBinding(threadIdKey, raw) {
	if (!raw || typeof raw !== "object") return null;
	const value = raw;
	const threadId = normalizeOptionalStringifiedId(value.threadId ?? threadIdKey);
	const channelId = normalizeOptionalString(value.channelId) ?? "";
	const targetSessionKey = normalizeOptionalString(value.targetSessionKey) ?? "";
	if (!threadId || !channelId || !targetSessionKey) return null;
	const accountId = normalizeAccountId(value.accountId);
	const targetKind = normalizeTargetKind(value.targetKind, targetSessionKey);
	const agentId = (normalizeOptionalString(value.agentId) ?? "") || resolveAgentIdFromSessionKey(targetSessionKey);
	const label = normalizeOptionalString(value.label);
	const webhookId = normalizeOptionalString(value.webhookId);
	const webhookToken = normalizeOptionalString(value.webhookToken);
	const boundBy = normalizeOptionalString(value.boundBy) ?? "system";
	const boundAt = resolveOptionalIntegerOption(value.boundAt) ?? Date.now();
	const lastActivityAt = resolveOptionalIntegerOption(value.lastActivityAt, { min: 0 }) ?? boundAt;
	const idleTimeoutMs = resolveOptionalIntegerOption(value.idleTimeoutMs, { min: 0 });
	const maxAgeMs = resolveOptionalIntegerOption(value.maxAgeMs, { min: 0 });
	const metadata = value.metadata && typeof value.metadata === "object" ? { ...value.metadata } : void 0;
	return {
		accountId,
		channelId,
		threadId,
		targetKind,
		targetSessionKey,
		agentId,
		boundBy,
		boundAt,
		lastActivityAt,
		...label !== void 0 ? { label } : {},
		...webhookId !== void 0 ? { webhookId } : {},
		...webhookToken !== void 0 ? { webhookToken } : {},
		...idleTimeoutMs !== void 0 ? { idleTimeoutMs } : {},
		...maxAgeMs !== void 0 ? { maxAgeMs } : {},
		...metadata !== void 0 ? { metadata } : {}
	};
}
function normalizeThreadBindingDurationMs(raw, defaultsTo) {
	const durationMs = resolveOptionalIntegerOption(raw);
	return durationMs !== void 0 && durationMs >= 0 ? durationMs : defaultsTo;
}
function resolveThreadBindingIdleTimeoutMs(params) {
	return resolveNonNegativeIntegerOption(params.record.idleTimeoutMs, params.defaultIdleTimeoutMs);
}
function resolveThreadBindingMaxAgeMs(params) {
	return resolveNonNegativeIntegerOption(params.record.maxAgeMs, params.defaultMaxAgeMs);
}
function resolveTimestampExpiry(timestamp, durationMs) {
	if (durationMs <= 0) return;
	const at = Math.floor(timestamp);
	return Number.isFinite(at) && at > 0 ? at + durationMs : void 0;
}
function resolvePreparedThreadBindingLifecycle(params) {
	const idleTimeoutMs = resolveThreadBindingIdleTimeoutMs({
		record: params.record,
		defaultIdleTimeoutMs: params.idleTimeoutMs
	});
	const maxAgeMs = resolveThreadBindingMaxAgeMs({
		record: params.record,
		defaultMaxAgeMs: params.maxAgeMs
	});
	return {
		idleTimeoutMs,
		maxAgeMs,
		...resolveThreadBindingExpiry({
			inactivityExpiresAt: resolveTimestampExpiry(params.record.lastActivityAt, idleTimeoutMs),
			maxAgeExpiresAt: resolveTimestampExpiry(params.record.boundAt, maxAgeMs)
		})
	};
}
function resolveThreadBindingInactivityExpiresAt(params) {
	const idleTimeoutMs = resolveThreadBindingIdleTimeoutMs(params);
	return resolveTimestampExpiry(params.record.lastActivityAt, idleTimeoutMs);
}
function resolveThreadBindingMaxAgeExpiresAt(params) {
	const maxAgeMs = resolveThreadBindingMaxAgeMs(params);
	return resolveTimestampExpiry(params.record.boundAt, maxAgeMs);
}
function linkSessionBinding(targetSessionKey, bindingKey) {
	const key = targetSessionKey.trim();
	if (!key) return;
	const threads = BINDINGS_BY_SESSION_KEY.get(key) ?? /* @__PURE__ */ new Set();
	threads.add(bindingKey);
	BINDINGS_BY_SESSION_KEY.set(key, threads);
}
function unlinkSessionBinding(targetSessionKey, bindingKey) {
	const key = targetSessionKey.trim();
	if (!key) return;
	const threads = BINDINGS_BY_SESSION_KEY.get(key);
	if (!threads) return;
	threads.delete(bindingKey);
	if (threads.size === 0) BINDINGS_BY_SESSION_KEY.delete(key);
}
function toReusableWebhookKey(params) {
	return `${normalizeLowercaseStringOrEmpty(params.accountId)}:${params.channelId.trim()}`;
}
function rememberReusableWebhook(record) {
	const webhookId = record.webhookId?.trim();
	const webhookToken = record.webhookToken?.trim();
	if (!webhookId || !webhookToken) return;
	const key = toReusableWebhookKey(record);
	REUSABLE_WEBHOOKS_BY_ACCOUNT_CHANNEL.set(key, {
		webhookId,
		webhookToken
	});
}
function refreshUnboundThreadWebhookIdentity(record) {
	const sourceId = record.webhookId?.trim();
	if (!sourceId) return;
	recordOutboundMessageIdentity({
		channel: "discord",
		accountId: record.accountId,
		conversationId: record.threadId,
		sourceId
	});
}
function setBindingRecord(record) {
	const bindingKey = toBindingRecordKey(record);
	const existing = BINDINGS_BY_THREAD_ID.get(bindingKey);
	if (existing) unlinkSessionBinding(existing.targetSessionKey, bindingKey);
	BINDINGS_BY_THREAD_ID.set(bindingKey, record);
	linkSessionBinding(record.targetSessionKey, bindingKey);
	rememberReusableWebhook(record);
}
function removeBindingRecord(bindingKeyRaw) {
	const key = bindingKeyRaw.trim();
	if (!key) return null;
	const existing = BINDINGS_BY_THREAD_ID.get(key);
	if (!existing) return null;
	BINDINGS_BY_THREAD_ID.delete(key);
	unlinkSessionBinding(existing.targetSessionKey, key);
	return existing;
}
function beginBindingsLoad() {
	THREAD_BINDINGS_STATE.loadedBindings = true;
	BINDINGS_BY_THREAD_ID.clear();
	BINDINGS_BY_SESSION_KEY.clear();
	REUSABLE_WEBHOOKS_BY_ACCOUNT_CHANNEL.clear();
	THREAD_BINDINGS_STATE.loadedPersistentBindings = false;
}
function restoreBindings(entries) {
	THREAD_BINDINGS_STATE.persistenceAvailable = true;
	THREAD_BINDINGS_STATE.loadedPersistentBindings = entries.length > 0;
	for (const entry of entries) {
		const normalized = normalizePersistedBinding(entry.key, entry.value);
		if (normalized) setBindingRecord(normalized);
	}
}
function ensureBindingsLoaded() {
	if (THREAD_BINDINGS_STATE.loadedBindings) return;
	beginBindingsLoad();
	let entries;
	try {
		entries = openThreadBindingsStore().entries();
	} catch {
		THREAD_BINDINGS_STATE.persistenceAvailable = false;
		return;
	}
	restoreBindings(entries);
}
async function loadBindingsAsync() {
	let entries;
	try {
		entries = await openThreadBindingsStoreAsync().entries();
	} catch {
		if (!THREAD_BINDINGS_STATE.loadedBindings) {
			beginBindingsLoad();
			THREAD_BINDINGS_STATE.persistenceAvailable = false;
			logVerbose("discord thread binding persistence unavailable; keeping bindings in memory");
		}
		return;
	}
	if (THREAD_BINDINGS_STATE.loadedBindings) return;
	beginBindingsLoad();
	restoreBindings(entries);
}
async function ensureBindingsLoadedAsync() {
	if (THREAD_BINDINGS_STATE.loadedBindings) return;
	const loading = THREAD_BINDINGS_STATE.loadingBindings ??= loadBindingsAsync();
	try {
		await loading;
	} finally {
		if (THREAD_BINDINGS_STATE.loadingBindings === loading) delete THREAD_BINDINGS_STATE.loadingBindings;
	}
}
function resolveBindingIdsForSession(params) {
	const out = [];
	for (const bindingKey of BINDINGS_BY_SESSION_KEY.get(params.targetSessionKey.trim()) ?? []) {
		const record = BINDINGS_BY_THREAD_ID.get(bindingKey);
		if (record && (!params.accountId || record.accountId === params.accountId) && (!params.targetKind || record.targetKind === params.targetKind)) out.push(bindingKey);
	}
	return out;
}
//#endregion
//#region extensions/discord/src/monitor/thread-bindings.persistence.ts
function shouldPersistAnyBindingState() {
	return [...PERSIST_BY_ACCOUNT_ID.values()].some(Boolean);
}
function shouldPersistBindingMutations() {
	return shouldPersistAnyBindingState() || THREAD_BINDINGS_STATE.loadedPersistentBindings;
}
function snapshotThreadBindingJson(value) {
	const serialized = JSON.stringify(value);
	return serialized ? JSON.parse(serialized) : void 0;
}
function snapshotThreadBindingMetadata(input) {
	return asOptionalObjectRecord(snapshotThreadBindingJson(input.metadata ? { ...input.metadata } : void 0));
}
function toPersistedBindingRecord(record) {
	return normalizePersistedBinding(record.threadId, snapshotThreadBindingJson(record)) ?? { ...record };
}
function runThreadBindingAccountOperation(managers, operation) {
	if (managers.length === 0) return operation();
	const tails = THREAD_BINDINGS_STATE.accountOperationTails;
	const predecessors = managers.map((manager) => tails.get(manager) ?? Promise.resolve());
	const result = Promise.all(predecessors).then(operation);
	const settled = result.then(() => {}, () => {});
	for (const manager of managers) tails.set(manager, settled);
	settled.then(() => {
		for (const manager of managers) if (tails.get(manager) === settled) tails.delete(manager);
	});
	return result;
}
function drainThreadBindingAccountOperations(manager) {
	return THREAD_BINDINGS_STATE.accountOperationTails.get(manager) ?? Promise.resolve();
}
function runThreadBindingMutation(operation) {
	const result = THREAD_BINDINGS_STATE.mutationTail.then(operation);
	THREAD_BINDINGS_STATE.mutationTail = result.then(() => {}, () => {});
	return result;
}
function drainThreadBindingMutations() {
	return THREAD_BINDINGS_STATE.mutationTail;
}
async function commitBindingRecord(params) {
	let authorityRefused = false;
	let targetCommitted = false;
	let committedWrites = 0;
	const assertCurrent = () => {
		try {
			params.assertCurrent?.();
		} catch (error) {
			authorityRefused = true;
			throw error;
		}
	};
	assertCurrent();
	const now = Date.now();
	if (params.persist && THREAD_BINDINGS_STATE.persistenceAvailable && !(params.minIntervalMs && THREAD_BINDINGS_STATE.lastPersistedAtMs > 0 && now - THREAD_BINDINGS_STATE.lastPersistedAtMs < params.minIntervalMs)) {
		const records = new Map(BINDINGS_BY_THREAD_ID);
		if (params.next) records.set(params.bindingKey, params.next);
		else records.delete(params.bindingKey);
		try {
			const store = openThreadBindingsStoreAsync();
			for (const [key, record] of records) {
				assertCurrent();
				const persisted = toPersistedBindingRecord(record);
				await store.register(key, persisted, { assertCurrent });
				committedWrites += 1;
				targetCommitted ||= key === params.bindingKey;
			}
			assertCurrent();
			const entries = await store.entries();
			assertCurrent();
			for (const entry of entries) if (!records.has(entry.key)) {
				await store.delete(entry.key, { assertCurrent });
				committedWrites += 1;
				targetCommitted ||= entry.key === params.bindingKey;
			}
			if (!params.next) targetCommitted = true;
			assertCurrent();
			THREAD_BINDINGS_STATE.loadedPersistentBindings = records.size > 0;
			THREAD_BINDINGS_STATE.lastPersistedAtMs = now;
		} catch (error) {
			let failure = error;
			if (!authorityRefused) try {
				assertCurrent();
			} catch (interruption) {
				failure = interruption;
			}
			if (authorityRefused) {
				createPluginStateErrorReporter(getDiscordRuntime, "discord", "thread-bindings", "Discord thread binding save interrupted; acknowledged writes were retained.", () => ({
					committedWrites,
					targetCommitted
				}))(failure);
				if (!targetCommitted) {
					if (committedWrites === 0) throw failure;
					throw new Error(`Discord thread binding changed during persistence after ${committedWrites} acknowledged writes`, { cause: error });
				}
			} else {
				THREAD_BINDINGS_STATE.persistenceAvailable = false;
				logVerbose("discord thread binding persistence unavailable; keeping bindings in memory");
			}
		}
	}
	if (!targetCommitted) assertCurrent();
	if (BINDINGS_BY_THREAD_ID.get(params.bindingKey) !== params.previous) return;
	if (params.next) setBindingRecord(params.next);
	else removeBindingRecord(params.bindingKey);
}
function persistBindingsSync(update) {
	const store = openThreadBindingsStore();
	let updatedRecord;
	for (const [key, record] of BINDINGS_BY_THREAD_ID) if (key === update?.bindingKey) {
		if (!store.update) throw new Error("Discord synchronous compatibility requires atomic state update");
		const next = update.transform(record);
		store.update(key, () => toPersistedBindingRecord(next));
		updatedRecord = next;
		if (next !== record) setBindingRecord(next);
	} else store.register(key, toPersistedBindingRecord(record));
	for (const entry of store.entries()) if (!BINDINGS_BY_THREAD_ID.has(entry.key)) store.delete(entry.key);
	THREAD_BINDINGS_STATE.loadedPersistentBindings = BINDINGS_BY_THREAD_ID.size > 0;
	THREAD_BINDINGS_STATE.lastPersistedAtMs = Date.now();
	return updatedRecord;
}
/** Public SDK compatibility only; bundled callers await worker mutations. */
function updateBindingRecordSync(params) {
	const record = BINDINGS_BY_THREAD_ID.get(params.bindingKey);
	if (!record) return null;
	const now = Date.now();
	if (params.persist && THREAD_BINDINGS_STATE.persistenceAvailable && (!params.minIntervalMs || now - THREAD_BINDINGS_STATE.lastPersistedAtMs >= params.minIntervalMs)) try {
		return persistBindingsSync(params) ?? null;
	} catch {
		THREAD_BINDINGS_STATE.persistenceAvailable = false;
		logVerbose("discord thread binding persistence unavailable; keeping bindings in memory");
	}
	const current = BINDINGS_BY_THREAD_ID.get(params.bindingKey);
	if (current !== record) return current ?? null;
	const next = params.transform(record);
	setBindingRecord(next);
	return next;
}
/** Public SDK compatibility only; bundled callers await worker mutations. */
function removeBindingRecordSync(bindingKey) {
	if (!BINDINGS_BY_THREAD_ID.get(bindingKey)) return null;
	if (!shouldPersistBindingMutations() || !THREAD_BINDINGS_STATE.persistenceAvailable) return removeBindingRecord(bindingKey);
	let removed = null;
	try {
		openThreadBindingsStore().delete(bindingKey);
		removed = removeBindingRecord(bindingKey);
		persistBindingsSync();
		return removed;
	} catch {
		THREAD_BINDINGS_STATE.persistenceAvailable = false;
		return removed ?? removeBindingRecord(bindingKey);
	}
}
//#endregion
//#region extensions/discord/src/monitor/thread-bindings.session-shared.ts
function resolveBindingIdsForTargetSession(params) {
	return resolveBindingIdsForSession({
		...params,
		accountId: params.accountId ? normalizeAccountId(params.accountId) : void 0
	});
}
function mutateBindingsForTargetSession(params, update, onRemoved) {
	const accountId = params.accountId ? normalizeAccountId(params.accountId) : void 0;
	const managers = [];
	const stoppingAtAdmission = /* @__PURE__ */ new Map();
	for (const [ownerAccountId, manager] of MANAGERS_BY_ACCOUNT_ID) if (accountId === void 0 || ownerAccountId === accountId) {
		managers.push(manager);
		stoppingAtAdmission.set(ownerAccountId, manager.isStopping());
	}
	return runThreadBindingAccountOperation(managers, () => runThreadBindingMutation(async () => {
		await ensureBindingsLoadedAsync();
		const ids = resolveBindingIdsForTargetSession(params);
		for (const bindingKey of ids) {
			const existing = BINDINGS_BY_THREAD_ID.get(bindingKey);
			if (!existing) continue;
			const manager = MANAGERS_BY_ACCOUNT_ID.get(existing.accountId);
			if (stoppingAtAdmission.get(existing.accountId) ?? manager?.isStopping()) throw new Error("Discord thread binding manager is stopping");
		}
		const now = Date.now();
		const updated = [];
		for (const bindingKey of ids) {
			const existing = BINDINGS_BY_THREAD_ID.get(bindingKey);
			if (!existing) continue;
			const manager = MANAGERS_BY_ACCOUNT_ID.get(existing.accountId);
			const nextRecord = update(existing, now);
			await commitBindingRecord({
				bindingKey,
				previous: existing,
				next: nextRecord,
				persist: shouldPersistBindingMutations()
			});
			if (!nextRecord) onRemoved?.(existing, manager);
			updated.push(nextRecord ?? existing);
		}
		return updated;
	}));
}
/** @deprecated Generic SDK synchronous lifecycle compatibility. */
function updateBindingsForTargetSessionSync(ids, update) {
	const now = Date.now();
	const updated = [];
	for (const bindingKey of ids) {
		const existing = BINDINGS_BY_THREAD_ID.get(bindingKey);
		if (!existing) continue;
		if (MANAGERS_BY_ACCOUNT_ID.get(existing.accountId)?.isStopping()) throw new Error("Discord thread binding manager is stopping");
		const next = updateBindingRecordSync({
			bindingKey,
			transform: (record) => record.targetSessionKey === existing.targetSessionKey ? update(record, now) : record,
			persist: shouldPersistBindingMutations()
		});
		if (next?.targetSessionKey === existing.targetSessionKey) updated.push(next);
	}
	return updated;
}
//#endregion
//#region extensions/discord/src/monitor/thread-bindings.session-updates.ts
function createDurationUpdate(field, raw) {
	const duration = resolveNonNegativeIntegerOption(raw, 0);
	return (existing, now) => ({
		...existing,
		[field]: duration,
		...field === "maxAgeMs" ? { boundAt: now } : {},
		lastActivityAt: now
	});
}
function createDurationSetters(field) {
	return {
		setAsync: async (input) => {
			const params = { ...input };
			return mutateBindingsForTargetSession(params, createDurationUpdate(field, params[field]));
		},
		set: (params) => {
			const method = field === "idleTimeoutMs" ? "setThreadBindingIdleTimeoutBySessionKey" : "setThreadBindingMaxAgeBySessionKey";
			warnPluginSdkDeprecation({
				family: "conversation-bindings",
				method,
				replacement: `${method}Async`
			});
			ensureBindingsLoaded();
			return updateBindingsForTargetSessionSync(resolveBindingIdsForTargetSession(params), createDurationUpdate(field, params[field]));
		}
	};
}
const idleSetters = createDurationSetters("idleTimeoutMs");
const maxAgeSetters = createDurationSetters("maxAgeMs");
const setThreadBindingIdleTimeoutBySessionKeyAsync = idleSetters.setAsync;
const setThreadBindingMaxAgeBySessionKeyAsync = maxAgeSetters.setAsync;
/** @deprecated Use setThreadBindingIdleTimeoutBySessionKeyAsync; compatible through 2026-12-31, removed in the first January 2027 stable. */
const setThreadBindingIdleTimeoutBySessionKey = idleSetters.set;
/** @deprecated Use setThreadBindingMaxAgeBySessionKeyAsync; compatible through 2026-12-31, removed in the first January 2027 stable. */
const setThreadBindingMaxAgeBySessionKey = maxAgeSetters.set;
//#endregion
export { resolveBindingIdsForSession as A, forgetThreadBindingToken as C, refreshUnboundThreadWebhookIdentity as D, normalizeThreadBindingDurationMs as E, resolveThreadBindingMaxAgeExpiresAt as F, resolveThreadBindingMaxAgeMs as I, shouldDefaultPersist as L, resolvePreparedThreadBindingLifecycle as M, resolveThreadBindingIdleTimeoutMs as N, rememberReusableWebhook as O, resolveThreadBindingInactivityExpiresAt as P, toBindingRecordKey as R, ensureBindingsLoadedAsync as S, normalizeTargetKind as T, MANAGERS_BY_ACCOUNT_ID as _, mutateBindingsForTargetSession as a, THREAD_BINDING_TOUCH_PERSIST_MIN_INTERVAL_MS as b, drainThreadBindingAccountOperations as c, runThreadBindingAccountOperation as d, runThreadBindingMutation as f, BINDINGS_BY_THREAD_ID as g, updateBindingRecordSync as h, setThreadBindingMaxAgeBySessionKeyAsync as i, resolveBindingRecordKey as j, rememberThreadBindingToken as k, drainThreadBindingMutations as l, snapshotThreadBindingMetadata as m, setThreadBindingIdleTimeoutBySessionKeyAsync as n, resolveBindingIdsForTargetSession as o, shouldPersistAnyBindingState as p, setThreadBindingMaxAgeBySessionKey as r, commitBindingRecord as s, setThreadBindingIdleTimeoutBySessionKey as t, removeBindingRecordSync as u, PERSIST_BY_ACCOUNT_ID as v, getThreadBindingToken as w, ensureBindingsLoaded as x, REUSABLE_WEBHOOKS_BY_ACCOUNT_CHANNEL as y, toReusableWebhookKey as z };
