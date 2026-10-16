import { t as getDiscordRuntime } from "./runtime-DgnVQ7zW.mjs";
import { logVerbose } from "openclaw/plugin-sdk/runtime-env";
import { normalizeLowercaseStringOrEmpty, normalizeOptionalString, normalizeOptionalStringifiedId } from "openclaw/plugin-sdk/string-coerce-runtime";
import { normalizeAccountId, resolveAgentIdFromSessionKey } from "openclaw/plugin-sdk/routing";
import { resolveNonNegativeIntegerOption, resolveOptionalIntegerOption } from "openclaw/plugin-sdk/number-runtime";
import { resolveGlobalSingleton } from "openclaw/plugin-sdk/global-singleton";
import { createPluginStateErrorReporter } from "openclaw/plugin-sdk/plugin-state-runtime";
import { recordOutboundMessageIdentity } from "openclaw/plugin-sdk/outbound-echo-runtime";
import { resolveThreadBindingExpiry } from "openclaw/plugin-sdk/thread-bindings-session-runtime";
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
		revision: 0,
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
		accountId: normalizeAccountId(params.accountId),
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
	const record = {
		accountId,
		channelId,
		threadId,
		targetKind,
		targetSessionKey,
		agentId,
		boundBy,
		boundAt,
		lastActivityAt
	};
	if (label !== void 0) record.label = label;
	if (webhookId !== void 0) record.webhookId = webhookId;
	if (webhookToken !== void 0) record.webhookToken = webhookToken;
	if (idleTimeoutMs !== void 0) record.idleTimeoutMs = idleTimeoutMs;
	if (maxAgeMs !== void 0) record.maxAgeMs = maxAgeMs;
	if (metadata !== void 0) record.metadata = metadata;
	return record;
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
	const idleTimeoutMs = resolveThreadBindingIdleTimeoutMs({
		record: params.record,
		defaultIdleTimeoutMs: params.defaultIdleTimeoutMs
	});
	return resolveTimestampExpiry(params.record.lastActivityAt, idleTimeoutMs);
}
function resolveThreadBindingMaxAgeExpiresAt(params) {
	const maxAgeMs = resolveThreadBindingMaxAgeMs({
		record: params.record,
		defaultMaxAgeMs: params.defaultMaxAgeMs
	});
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
	const key = toReusableWebhookKey({
		accountId: record.accountId,
		channelId: record.channelId
	});
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
	const bindingKey = toBindingRecordKey({
		accountId: record.accountId,
		threadId: record.threadId
	});
	const existing = BINDINGS_BY_THREAD_ID.get(bindingKey);
	if (existing) unlinkSessionBinding(existing.targetSessionKey, bindingKey);
	BINDINGS_BY_THREAD_ID.set(bindingKey, record);
	THREAD_BINDINGS_STATE.revision += 1;
	linkSessionBinding(record.targetSessionKey, bindingKey);
	rememberReusableWebhook(record);
}
function removeBindingRecord(bindingKeyRaw) {
	const key = bindingKeyRaw.trim();
	if (!key) return null;
	const existing = BINDINGS_BY_THREAD_ID.get(key);
	if (!existing) return null;
	BINDINGS_BY_THREAD_ID.delete(key);
	THREAD_BINDINGS_STATE.revision += 1;
	unlinkSessionBinding(existing.targetSessionKey, key);
	return existing;
}
function beginBindingsLoad() {
	THREAD_BINDINGS_STATE.loadedBindings = true;
	BINDINGS_BY_THREAD_ID.clear();
	THREAD_BINDINGS_STATE.revision += 1;
	BINDINGS_BY_SESSION_KEY.clear();
	REUSABLE_WEBHOOKS_BY_ACCOUNT_CHANNEL.clear();
	THREAD_BINDINGS_STATE.loadedPersistentBindings = false;
}
function restoreBindings(entries) {
	THREAD_BINDINGS_STATE.persistenceAvailable = true;
	THREAD_BINDINGS_STATE.loadedPersistentBindings = entries.length > 0;
	for (const entry of entries) {
		const normalized = normalizePersistedBinding(entry.key, entry.value);
		if (!normalized) continue;
		setBindingRecord(normalized);
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
		entries = await getDiscordRuntime().state.openKeyedStore({
			namespace: THREAD_BINDINGS_NAMESPACE,
			maxEntries: THREAD_BINDINGS_MAX_ENTRIES
		}).entries();
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
	const key = params.targetSessionKey.trim();
	if (!key) return [];
	const ids = BINDINGS_BY_SESSION_KEY.get(key);
	if (!ids) return [];
	const out = [];
	for (const bindingKey of ids.values()) {
		const record = BINDINGS_BY_THREAD_ID.get(bindingKey);
		if (!record) continue;
		if (params.accountId && record.accountId !== params.accountId) continue;
		if (params.targetKind && record.targetKind !== params.targetKind) continue;
		out.push(bindingKey);
	}
	return out;
}
//#endregion
//#region extensions/discord/src/monitor/thread-bindings.persistence.ts
function shouldPersistAnyBindingState() {
	for (const value of PERSIST_BY_ACCOUNT_ID.values()) if (value) return true;
	return false;
}
function shouldPersistBindingMutations() {
	if (shouldPersistAnyBindingState()) return true;
	return THREAD_BINDINGS_STATE.loadedPersistentBindings;
}
function snapshotThreadBindingJson(value) {
	const serialized = JSON.stringify(value);
	return serialized ? JSON.parse(serialized) : void 0;
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
	const revision = THREAD_BINDINGS_STATE.revision;
	let authorityRefused = false;
	let targetCommitted = false;
	let committedWrites = 0;
	const assertCurrent = () => {
		try {
			params.assertCurrent?.();
			if (THREAD_BINDINGS_STATE.revision !== revision || BINDINGS_BY_THREAD_ID.get(params.bindingKey) !== params.previous) throw new Error("Discord thread binding changed during persistence");
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
		const active = {
			targetKey: params.bindingKey,
			deletingTarget: params.next === null,
			nextRecord: params.next,
			writingKey: void 0,
			committedKeys: /* @__PURE__ */ new Set()
		};
		THREAD_BINDINGS_STATE.activePersistence = active;
		try {
			const store = getDiscordRuntime().state.openKeyedStore({
				namespace: THREAD_BINDINGS_NAMESPACE,
				maxEntries: THREAD_BINDINGS_MAX_ENTRIES
			});
			for (const [key, record] of records) {
				assertCurrent();
				const persisted = toPersistedBindingRecord(record);
				if (key === params.bindingKey) active.nextRecord = persisted;
				active.writingKey = key;
				await store.register(key, persisted, { assertCurrent });
				active.writingKey = void 0;
				active.committedKeys.add(key);
				committedWrites += 1;
				targetCommitted ||= key === params.bindingKey;
			}
			assertCurrent();
			const entries = await store.entries();
			assertCurrent();
			for (const entry of entries) if (!records.has(entry.key)) {
				active.writingKey = entry.key;
				await store.delete(entry.key, { assertCurrent });
				active.writingKey = void 0;
				active.committedKeys.add(entry.key);
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
		} finally {
			delete THREAD_BINDINGS_STATE.activePersistence;
		}
	}
	if (!targetCommitted) assertCurrent();
	if (BINDINGS_BY_THREAD_ID.get(params.bindingKey) !== params.previous) return;
	if (params.next) setBindingRecord(params.next);
	else removeBindingRecord(params.bindingKey);
}
function persistBindingsSync(update, removedKey) {
	const store = openThreadBindingsStore();
	const active = THREAD_BINDINGS_STATE.activePersistence;
	let updatedRecord;
	for (const [key, record] of BINDINGS_BY_THREAD_ID) if (key === update?.bindingKey || active?.targetKey === key && active.deletingTarget || active?.writingKey === key || active?.committedKeys.has(key)) {
		if (!store.update) throw new Error("Discord synchronous compatibility requires atomic state update");
		let next;
		store.update(key, (current) => {
			let base = record;
			if (active?.targetKey === key) {
				if (!current && active.deletingTarget) base = void 0;
				else if (current && active.nextRecord && (active.writingKey === key || active.committedKeys.has(key)) && JSON.stringify(toPersistedBindingRecord(current)) === JSON.stringify(toPersistedBindingRecord(active.nextRecord))) base = normalizePersistedBinding(key, current) ?? record;
			}
			if (key === update?.bindingKey) update.observe?.(current && normalizePersistedBinding(key, current) ? base : void 0);
			next = base ? key === update?.bindingKey ? update.transform(base) : base : void 0;
			return next ? toPersistedBindingRecord(next) : void 0;
		});
		if (key === update?.bindingKey) updatedRecord = next;
		if (next) {
			if (next !== record) setBindingRecord(next);
		} else if (!(active?.targetKey === key && active.deletingTarget)) removeBindingRecord(key);
	} else store.register(key, toPersistedBindingRecord(record));
	for (const entry of store.entries()) if (!BINDINGS_BY_THREAD_ID.has(entry.key)) {
		if (entry.key !== removedKey && active?.targetKey === entry.key && !active.deletingTarget) {
			const committed = normalizePersistedBinding(entry.key, entry.value);
			if (committed) {
				setBindingRecord(committed);
				continue;
			}
		}
		store.delete(entry.key);
	}
	THREAD_BINDINGS_STATE.loadedPersistentBindings = BINDINGS_BY_THREAD_ID.size > 0;
	THREAD_BINDINGS_STATE.lastPersistedAtMs = Date.now();
	return updatedRecord;
}
/** Public SDK compatibility only; bundled callers await worker mutations. */
function updateBindingRecordSync(params) {
	const record = BINDINGS_BY_THREAD_ID.get(params.bindingKey);
	if (!record) return null;
	const now = Date.now();
	const persist = params.persist && THREAD_BINDINGS_STATE.persistenceAvailable && (THREAD_BINDINGS_STATE.activePersistence || !params.minIntervalMs || now - THREAD_BINDINGS_STATE.lastPersistedAtMs >= params.minIntervalMs);
	let observed;
	if (persist) try {
		return persistBindingsSync({
			...params,
			observe: (current) => {
				observed = current;
			}
		}) ?? null;
	} catch {
		THREAD_BINDINGS_STATE.persistenceAvailable = false;
		logVerbose("discord thread binding persistence unavailable; keeping bindings in memory");
	}
	const current = BINDINGS_BY_THREAD_ID.get(params.bindingKey);
	if (current !== record) return current ?? null;
	if (THREAD_BINDINGS_STATE.activePersistence?.targetKey === params.bindingKey && !observed) {
		logVerbose("discord synchronous binding update skipped: pending target read unavailable");
		return null;
	}
	const next = params.transform(observed ?? record);
	setBindingRecord(next);
	return next;
}
/** Public SDK compatibility only; bundled callers await worker mutations. */
function removeBindingRecordSync(bindingKey) {
	const record = BINDINGS_BY_THREAD_ID.get(bindingKey);
	if (!record) return null;
	if (!shouldPersistBindingMutations() || !THREAD_BINDINGS_STATE.persistenceAvailable) return THREAD_BINDINGS_STATE.activePersistence?.targetKey === bindingKey ? null : removeBindingRecord(bindingKey);
	let removed = null;
	let observed = null;
	let replacement;
	try {
		const store = openThreadBindingsStore();
		if (!store.deleteIf) throw new Error("Discord synchronous compatibility requires atomic state deletion");
		const deleted = store.deleteIf(bindingKey, (current) => {
			const normalized = normalizePersistedBinding(bindingKey, current);
			observed = normalized;
			const pending = THREAD_BINDINGS_STATE.activePersistence;
			if (normalized && pending?.targetKey === bindingKey && pending.nextRecord && (pending.writingKey === bindingKey || pending.committedKeys.has(bindingKey)) && JSON.stringify(toPersistedBindingRecord(normalized)) === JSON.stringify(toPersistedBindingRecord(pending.nextRecord)) && (normalized.targetSessionKey !== record.targetSessionKey || normalized.targetKind !== record.targetKind)) {
				replacement = normalized;
				return false;
			}
			return true;
		});
		if (replacement) {
			setBindingRecord(replacement);
			return null;
		}
		const pending = THREAD_BINDINGS_STATE.activePersistence;
		if (!deleted && pending?.targetKey === bindingKey && pending.deletingTarget) return null;
		removed = removeBindingRecord(bindingKey);
		persistBindingsSync(void 0, bindingKey);
		return removed;
	} catch {
		THREAD_BINDINGS_STATE.persistenceAvailable = false;
		if (replacement) {
			setBindingRecord(replacement);
			return null;
		}
		if (THREAD_BINDINGS_STATE.activePersistence?.targetKey === bindingKey && !observed && !removed) {
			logVerbose("discord synchronous binding removal skipped: pending target read unavailable");
			return null;
		}
		return removed ?? removeBindingRecord(bindingKey);
	}
}
//#endregion
//#region extensions/discord/src/monitor/thread-bindings.session-shared.ts
function normalizeNonNegativeMs(raw) {
	if (!Number.isFinite(raw)) return 0;
	return Math.max(0, Math.floor(raw));
}
function resolveBindingIdsForTargetSession(params) {
	ensureBindingsLoaded();
	const targetSessionKey = params.targetSessionKey.trim();
	if (!targetSessionKey) return [];
	return resolveBindingIdsForSession({
		targetSessionKey,
		accountId: params.accountId ? normalizeAccountId(params.accountId) : void 0,
		targetKind: params.targetKind
	});
}
function mutateBindingsForTargetSession(params, update, onRemoved) {
	const accountId = params.accountId ? normalizeAccountId(params.accountId) : void 0;
	const admittedOwners = new Map([...MANAGERS_BY_ACCOUNT_ID].filter(([ownerAccountId]) => accountId === void 0 || ownerAccountId === accountId).map(([ownerAccountId, manager]) => [ownerAccountId, {
		manager,
		stopping: manager.isStopping()
	}]));
	return runThreadBindingAccountOperation([...admittedOwners.values()].map(({ manager }) => manager), () => runThreadBindingMutation(async () => {
		await ensureBindingsLoadedAsync();
		const ids = resolveBindingIdsForTargetSession(params);
		const owners = /* @__PURE__ */ new Map();
		for (const bindingKey of ids) {
			const existing = BINDINGS_BY_THREAD_ID.get(bindingKey);
			if (!existing) continue;
			const manager = MANAGERS_BY_ACCOUNT_ID.get(existing.accountId);
			const admitted = admittedOwners.get(existing.accountId);
			if (admitted?.stopping || !admitted && manager?.isStopping()) throw new Error("Discord thread binding manager is stopping");
			if (admitted?.manager !== manager) throw new Error("Discord thread binding manager changed");
			owners.set(existing.accountId, manager);
		}
		const now = Date.now();
		const updated = [];
		for (const bindingKey of ids) {
			const existing = BINDINGS_BY_THREAD_ID.get(bindingKey);
			if (!existing) continue;
			const manager = owners.get(existing.accountId);
			const assertCurrent = () => {
				if (MANAGERS_BY_ACCOUNT_ID.get(existing.accountId) !== manager) throw new Error("Discord thread binding manager changed");
			};
			const nextRecord = update(existing, now);
			await commitBindingRecord({
				bindingKey,
				previous: existing,
				next: nextRecord,
				persist: shouldPersistBindingMutations(),
				assertCurrent
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
async function setThreadBindingIdleTimeoutBySessionKeyAsync(input) {
	const params = { ...input };
	const idleTimeoutMs = normalizeNonNegativeMs(params.idleTimeoutMs);
	return mutateBindingsForTargetSession(params, (existing, now) => ({
		...existing,
		idleTimeoutMs,
		lastActivityAt: now
	}));
}
async function setThreadBindingMaxAgeBySessionKeyAsync(input) {
	const params = { ...input };
	const maxAgeMs = normalizeNonNegativeMs(params.maxAgeMs);
	return mutateBindingsForTargetSession(params, (existing, now) => ({
		...existing,
		maxAgeMs,
		boundAt: now,
		lastActivityAt: now
	}));
}
/** @deprecated Use the awaited lifecycle setter; retained for the generic SDK contract. */
function setThreadBindingIdleTimeoutBySessionKey(params) {
	const ids = resolveBindingIdsForTargetSession(params);
	const idleTimeoutMs = normalizeNonNegativeMs(params.idleTimeoutMs);
	return updateBindingsForTargetSessionSync(ids, (existing, now) => ({
		...existing,
		idleTimeoutMs,
		lastActivityAt: now
	}));
}
/** @deprecated Use the awaited lifecycle setter; retained for the generic SDK contract. */
function setThreadBindingMaxAgeBySessionKey(params) {
	const ids = resolveBindingIdsForTargetSession(params);
	const maxAgeMs = normalizeNonNegativeMs(params.maxAgeMs);
	return updateBindingsForTargetSessionSync(ids, (existing, now) => ({
		...existing,
		maxAgeMs,
		boundAt: now,
		lastActivityAt: now
	}));
}
//#endregion
export { resolveBindingRecordKey as A, getThreadBindingToken as C, rememberReusableWebhook as D, refreshUnboundThreadWebhookIdentity as E, resolveThreadBindingMaxAgeMs as F, shouldDefaultPersist as I, toBindingRecordKey as L, resolveThreadBindingIdleTimeoutMs as M, resolveThreadBindingInactivityExpiresAt as N, rememberThreadBindingToken as O, resolveThreadBindingMaxAgeExpiresAt as P, toReusableWebhookKey as R, forgetThreadBindingToken as S, normalizeThreadBindingDurationMs as T, MANAGERS_BY_ACCOUNT_ID as _, mutateBindingsForTargetSession as a, THREAD_BINDING_TOUCH_PERSIST_MIN_INTERVAL_MS as b, drainThreadBindingAccountOperations as c, runThreadBindingAccountOperation as d, runThreadBindingMutation as f, BINDINGS_BY_THREAD_ID as g, updateBindingRecordSync as h, setThreadBindingMaxAgeBySessionKeyAsync as i, resolvePreparedThreadBindingLifecycle as j, resolveBindingIdsForSession as k, drainThreadBindingMutations as l, snapshotThreadBindingJson as m, setThreadBindingIdleTimeoutBySessionKeyAsync as n, resolveBindingIdsForTargetSession as o, shouldPersistAnyBindingState as p, setThreadBindingMaxAgeBySessionKey as r, commitBindingRecord as s, setThreadBindingIdleTimeoutBySessionKey as t, removeBindingRecordSync as u, PERSIST_BY_ACCOUNT_ID as v, normalizeTargetKind as w, ensureBindingsLoadedAsync as x, REUSABLE_WEBHOOKS_BY_ACCOUNT_CHANNEL as y };
