import { t as getMatrixRuntime } from "./runtime-1kn1P6io.mjs";
import { a as listBindingsForAccount, c as setBindingRecord, f as toMatrixBindingTargetKind, o as removeBindingRecord, p as toSessionBindingRecord, r as getMatrixThreadBindingManagerEntry, s as resolveBindingKey, t as deleteMatrixThreadBindingManagerEntry, u as setMatrixThreadBindingManagerEntry } from "./thread-bindings-shared-hxKkYC1W.mjs";
import { o as resolveMatrixSqliteStateEnv, r as assertMatrixSupportedStateFile, s as resolveMatrixSqliteStateKey } from "./retired-state-BXUQ2I-C.mjs";
import { a as resolveMatrixStateFilePath, t as claimCurrentTokenStorageState } from "./storage-D7agewjH.mjs";
import { r as sendMessageMatrix } from "./send-B1Y2L4wj.mjs";
import { normalizeOptionalString } from "openclaw/plugin-sdk/string-coerce-runtime";
import { createHash } from "node:crypto";
import path from "node:path";
import { resolveOptionalIntegerOption } from "openclaw/plugin-sdk/number-runtime";
import { registerSessionBindingAdapter, resolveThreadBindingFarewellText, resolveThreadBindingLifecycle, unregisterSessionBindingAdapter } from "openclaw/plugin-sdk/thread-bindings-session-runtime";
import { resolveSessionAgentIdStrict } from "openclaw/plugin-sdk/agent-scope-runtime";
import { resolveAgentIdFromSessionKey } from "openclaw/plugin-sdk/session-key-runtime";
//#region extensions/matrix/src/matrix/thread-bindings.ts
const THREAD_BINDINGS_NAMESPACE = "thread-bindings";
const THREAD_BINDINGS_MAX_ENTRIES = 1e4;
const THREAD_BINDINGS_SWEEP_INTERVAL_MS = 6e4;
const TOUCH_PERSIST_DELAY_MS = 3e4;
function createThreadBindingStore(params) {
	return getMatrixRuntime().state.openKeyedStore({
		namespace: THREAD_BINDINGS_NAMESPACE,
		maxEntries: THREAD_BINDINGS_MAX_ENTRIES,
		env: resolveMatrixSqliteStateEnv(params)
	});
}
function buildThreadBindingStoreKey(record) {
	const digest = createHash("sha256").update(record.accountId).update("\0").update(record.parentConversationId ?? "").update("\0").update(record.conversationId).digest("hex");
	return `${record.accountId}:${digest}`;
}
function normalizeBindingRecord(entry, accountId) {
	if (!entry || typeof entry !== "object" || Array.isArray(entry)) return null;
	const record = entry;
	if (record.accountId && record.accountId !== accountId) return null;
	const conversationId = normalizeOptionalString(record.conversationId);
	const parentConversationId = normalizeOptionalString(record.parentConversationId);
	const targetSessionKey = normalizeOptionalString(record.targetSessionKey) ?? "";
	if (!conversationId || !targetSessionKey) return null;
	const boundAt = resolveOptionalIntegerOption(record.boundAt) ?? Date.now();
	const lastActivityAt = resolveOptionalIntegerOption(record.lastActivityAt) ?? boundAt;
	return {
		accountId,
		conversationId,
		...parentConversationId ? { parentConversationId } : {},
		targetKind: record.targetKind === "subagent" ? "subagent" : "acp",
		targetSessionKey,
		agentId: normalizeOptionalString(record.agentId) || void 0,
		label: normalizeOptionalString(record.label) || void 0,
		boundBy: normalizeOptionalString(record.boundBy) || void 0,
		boundAt,
		lastActivityAt: Math.max(lastActivityAt, boundAt),
		idleTimeoutMs: resolveOptionalIntegerOption(record.idleTimeoutMs, { min: 0 }),
		maxAgeMs: resolveOptionalIntegerOption(record.maxAgeMs, { min: 0 })
	};
}
async function loadBindingsFromPluginState(params) {
	const store = createThreadBindingStore(params);
	const loaded = [];
	for (const entry of await store.entries()) {
		const record = normalizeBindingRecord(entry.value, params.accountId);
		if (record) loaded.push(record);
	}
	return loaded;
}
function toPluginJsonValue(value) {
	const serialized = JSON.stringify(value);
	return JSON.parse(serialized);
}
async function persistBindingsSnapshot(params) {
	const store = createThreadBindingStore(params);
	const liveKeys = new Set(params.bindings.map((record) => buildThreadBindingStoreKey(record)));
	for (const entry of await store.entries()) if (normalizeBindingRecord(entry.value, params.accountId) && !liveKeys.has(entry.key)) await store.delete(entry.key);
	for (const record of params.bindings) await store.register(buildThreadBindingStoreKey(record), toPluginJsonValue(record));
}
function buildMatrixBindingIntroText(params) {
	const introText = normalizeOptionalString(params.metadata?.introText);
	if (introText) return introText;
	const label = normalizeOptionalString(params.metadata?.label);
	const agentId = normalizeOptionalString(params.metadata?.agentId) || resolveAgentIdFromSessionKey(params.targetSessionKey);
	return `⚙️ ${label || agentId || "session"} session active. Messages here go directly to this session.`;
}
async function sendBindingMessage(params) {
	const trimmed = params.text.trim();
	if (!trimmed) return null;
	return (await sendMessageMatrix(`room:${params.roomId}`, trimmed, {
		cfg: params.cfg,
		client: params.client,
		accountId: params.accountId,
		...params.threadId ? { threadId: params.threadId } : {}
	})).messageId || null;
}
async function sendFarewellMessage(params) {
	const roomId = params.record.parentConversationId ?? params.record.conversationId;
	const idleTimeoutMs = typeof params.record.idleTimeoutMs === "number" ? params.record.idleTimeoutMs : params.defaultIdleTimeoutMs;
	const maxAgeMs = typeof params.record.maxAgeMs === "number" ? params.record.maxAgeMs : params.defaultMaxAgeMs;
	const farewellText = resolveThreadBindingFarewellText({
		reason: params.reason,
		idleTimeoutMs,
		maxAgeMs
	});
	await sendBindingMessage({
		cfg: params.cfg,
		client: params.client,
		accountId: params.accountId,
		roomId,
		threadId: params.record.parentConversationId && params.record.parentConversationId !== params.record.conversationId ? params.record.conversationId : void 0,
		text: farewellText
	}).catch(() => {});
}
async function createMatrixThreadBindingManager(params) {
	if (params.auth.accountId !== params.accountId) throw new Error(`Matrix thread binding account mismatch: requested ${params.accountId}, auth resolved ${params.auth.accountId}`);
	const legacyFilePath = await resolveMatrixStateFilePath({
		filename: "thread-bindings.json",
		auth: params.auth,
		accountId: params.accountId,
		env: params.env,
		stateDir: params.stateDir
	});
	await assertMatrixSupportedStateFile(legacyFilePath);
	const sqliteStateDir = path.dirname(legacyFilePath);
	const storageKey = resolveMatrixSqliteStateKey({
		env: params.env,
		stateDir: sqliteStateDir
	});
	const existingEntry = getMatrixThreadBindingManagerEntry(params.accountId);
	if (existingEntry) {
		if (existingEntry.storageKey === storageKey) return existingEntry.manager;
		await existingEntry.manager.stop();
	}
	const loaded = await loadBindingsFromPluginState({
		accountId: params.accountId,
		env: params.env,
		stateDir: sqliteStateDir
	});
	for (const record of loaded) setBindingRecord(record);
	let persistQueue = Promise.resolve();
	const enqueuePersist = (bindings) => {
		const snapshot = bindings ?? listBindingsForAccount(params.accountId);
		const next = persistQueue.catch(() => {}).then(async () => {
			await persistBindingsSnapshot({
				accountId: params.accountId,
				bindings: snapshot,
				env: params.env,
				stateDir: sqliteStateDir
			});
			await claimCurrentTokenStorageState({ rootDir: sqliteStateDir });
		});
		persistQueue = next;
		return next;
	};
	const persist = async () => await enqueuePersist();
	const persistSafely = (reason, bindings) => {
		enqueuePersist(bindings).catch((err) => {
			params.logVerboseMessage?.(`matrix: failed persisting thread bindings account=${params.accountId} action=${reason}: ${String(err)}`);
		});
	};
	const defaults = {
		idleTimeoutMs: params.idleTimeoutMs,
		maxAgeMs: params.maxAgeMs
	};
	let persistTimer = null;
	const schedulePersist = (delayMs) => {
		if (persistTimer) return;
		persistTimer = setTimeout(() => {
			persistTimer = null;
			persistSafely("delayed-touch");
		}, delayMs);
		persistTimer.unref?.();
	};
	const updateBindingsBySessionKey = (input) => {
		const targetSessionKey = input.targetSessionKey.trim();
		if (!targetSessionKey) return [];
		const now = Date.now();
		const nextBindings = listBindingsForAccount(params.accountId).filter((entry) => entry.targetSessionKey === targetSessionKey).map((entry) => input.update(entry, now));
		if (nextBindings.length === 0) return [];
		for (const entry of nextBindings) setBindingRecord(entry);
		persistSafely(input.persistReason);
		return nextBindings;
	};
	const manager = {
		accountId: params.accountId,
		getIdleTimeoutMs: () => defaults.idleTimeoutMs,
		getMaxAgeMs: () => defaults.maxAgeMs,
		persist,
		getByConversation: ({ conversationId, parentConversationId }) => listBindingsForAccount(params.accountId).find((entry) => {
			if (entry.conversationId !== conversationId.trim()) return false;
			if (!parentConversationId) return true;
			return (entry.parentConversationId ?? "") === parentConversationId.trim();
		}),
		listBySessionKey: (targetSessionKey) => listBindingsForAccount(params.accountId).filter((entry) => entry.targetSessionKey === targetSessionKey.trim()),
		listBindings: () => listBindingsForAccount(params.accountId),
		touchBinding: (bindingId, at) => {
			const record = listBindingsForAccount(params.accountId).find((entry) => resolveBindingKey(entry) === bindingId.trim());
			if (!record) return null;
			const nextRecord = {
				...record,
				lastActivityAt: typeof at === "number" && Number.isFinite(at) ? Math.max(record.lastActivityAt, Math.floor(at)) : Date.now()
			};
			setBindingRecord(nextRecord);
			schedulePersist(TOUCH_PERSIST_DELAY_MS);
			return nextRecord;
		},
		setIdleTimeoutBySessionKey: ({ targetSessionKey, idleTimeoutMs }) => {
			return updateBindingsBySessionKey({
				targetSessionKey,
				persistReason: "idle-timeout-update",
				update: (entry, now) => ({
					...entry,
					idleTimeoutMs: Math.max(0, Math.floor(idleTimeoutMs)),
					lastActivityAt: now
				})
			});
		},
		setMaxAgeBySessionKey: ({ targetSessionKey, maxAgeMs }) => {
			return updateBindingsBySessionKey({
				targetSessionKey,
				persistReason: "max-age-update",
				update: (entry, now) => ({
					...entry,
					maxAgeMs: Math.max(0, Math.floor(maxAgeMs)),
					lastActivityAt: now
				})
			});
		},
		stop: async () => {
			if (sweepTimer) clearInterval(sweepTimer);
			let finalPersist = persistQueue;
			if (persistTimer) {
				clearTimeout(persistTimer);
				persistTimer = null;
				finalPersist = enqueuePersist();
			}
			unregisterSessionBindingAdapter({
				channel: "matrix",
				accountId: params.accountId,
				adapter: sessionBindingAdapter
			});
			if (getMatrixThreadBindingManagerEntry(params.accountId)?.manager === manager) {
				deleteMatrixThreadBindingManagerEntry(params.accountId);
				for (const record of listBindingsForAccount(params.accountId)) removeBindingRecord(record);
			}
			await finalPersist;
		}
	};
	let sweepTimer = null;
	const removeRecords = (records) => {
		return records.map((record) => removeBindingRecord(record)).filter((record) => Boolean(record));
	};
	const sendFarewellMessages = async (removed, reason) => {
		await Promise.all(removed.map(async (record) => {
			await sendFarewellMessage({
				cfg: params.cfg,
				client: params.client,
				accountId: params.accountId,
				record,
				defaultIdleTimeoutMs: defaults.idleTimeoutMs,
				defaultMaxAgeMs: defaults.maxAgeMs,
				reason: typeof reason === "function" ? reason(record) : reason
			});
		}));
	};
	const unbindRecords = async (records, reason) => {
		const removed = removeRecords(records);
		if (removed.length === 0) return [];
		await persist();
		await sendFarewellMessages(removed, reason);
		return removed.map((record) => toSessionBindingRecord(record, defaults));
	};
	const sessionBindingAdapter = {
		channel: "matrix",
		accountId: params.accountId,
		capabilities: {
			placements: ["current", "child"],
			bindSupported: true,
			unbindSupported: true
		},
		bind: async (input) => {
			const conversationId = input.conversation.conversationId.trim();
			const parentConversationId = normalizeOptionalString(input.conversation.parentConversationId);
			const targetSessionKey = input.targetSessionKey.trim();
			if (!conversationId || !targetSessionKey) return null;
			let boundConversationId = conversationId;
			let boundParentConversationId = parentConversationId;
			const introText = buildMatrixBindingIntroText({
				metadata: input.metadata,
				targetSessionKey
			});
			if (input.placement === "child") {
				const roomId = parentConversationId || conversationId;
				const rootEventId = await sendBindingMessage({
					cfg: params.cfg,
					client: params.client,
					accountId: params.accountId,
					roomId,
					text: introText
				});
				if (!rootEventId) return null;
				boundConversationId = rootEventId;
				boundParentConversationId = roomId;
			}
			const now = Date.now();
			const record = {
				accountId: params.accountId,
				conversationId: boundConversationId,
				...boundParentConversationId ? { parentConversationId: boundParentConversationId } : {},
				targetKind: toMatrixBindingTargetKind(input.targetKind),
				targetSessionKey,
				agentId: normalizeOptionalString(input.metadata?.agentId) ?? resolveSessionAgentIdStrict({
					config: params.cfg,
					sessionKey: targetSessionKey
				}),
				label: normalizeOptionalString(input.metadata?.label) || void 0,
				boundBy: normalizeOptionalString(input.metadata?.boundBy) || "system",
				boundAt: now,
				lastActivityAt: now,
				idleTimeoutMs: defaults.idleTimeoutMs,
				maxAgeMs: defaults.maxAgeMs
			};
			setBindingRecord(record);
			await persist();
			if (input.placement === "current" && introText) {
				const roomId = boundParentConversationId || boundConversationId;
				const threadId = boundParentConversationId && boundParentConversationId !== boundConversationId ? boundConversationId : void 0;
				await sendBindingMessage({
					cfg: params.cfg,
					client: params.client,
					accountId: params.accountId,
					roomId,
					threadId,
					text: introText
				}).catch(() => {});
			}
			return toSessionBindingRecord(record, defaults);
		},
		listBySession: (targetSessionKey) => manager.listBySessionKey(targetSessionKey).map((record) => toSessionBindingRecord(record, defaults)),
		resolveByConversation: (ref) => {
			const record = manager.getByConversation(ref);
			return record ? toSessionBindingRecord(record, defaults) : null;
		},
		touch: (bindingId, at) => {
			manager.touchBinding(bindingId, at);
		},
		unbind: async (input) => {
			return await unbindRecords(listBindingsForAccount(params.accountId).filter((record) => {
				if (input.bindingId?.trim()) return resolveBindingKey(record) === input.bindingId.trim();
				if (input.targetSessionKey?.trim()) return record.targetSessionKey === input.targetSessionKey.trim();
				return false;
			}), input.reason);
		}
	};
	registerSessionBindingAdapter(sessionBindingAdapter);
	if (params.enableSweeper !== false) {
		sweepTimer = setInterval(() => {
			const now = Date.now();
			const expired = listBindingsForAccount(params.accountId).map((record) => ({
				record,
				lifecycle: resolveThreadBindingLifecycle({
					record,
					defaultIdleTimeoutMs: defaults.idleTimeoutMs,
					defaultMaxAgeMs: defaults.maxAgeMs
				})
			})).filter((entry) => typeof entry.lifecycle.expiresAt === "number" && entry.lifecycle.expiresAt <= now && Boolean(entry.lifecycle.reason));
			if (expired.length === 0) return;
			const reasonByBindingKey = new Map(expired.map(({ record, lifecycle }) => [resolveBindingKey(record), lifecycle.reason]));
			(async () => {
				const removed = removeRecords(expired.map(({ record }) => record));
				if (removed.length === 0) return;
				for (const record of removed) {
					const reason = reasonByBindingKey.get(resolveBindingKey(record));
					params.logVerboseMessage?.(`matrix: auto-unbinding ${record.conversationId} due to ${reason}`);
				}
				await persist();
				await sendFarewellMessages(removed, (record) => reasonByBindingKey.get(resolveBindingKey(record)));
			})().catch((err) => {
				params.logVerboseMessage?.(`matrix: failed auto-unbinding expired bindings account=${params.accountId}: ${String(err)}`);
			});
		}, THREAD_BINDINGS_SWEEP_INTERVAL_MS);
		sweepTimer.unref?.();
	}
	setMatrixThreadBindingManagerEntry(params.accountId, {
		storageKey,
		manager
	});
	return manager;
}
//#endregion
export { createMatrixThreadBindingManager as t };
