import { t as getMatrixRuntime } from "./runtime-Ck8TjD7L.mjs";
import { a as listBindingsForAccount, c as setBindingRecord, d as setMatrixThreadBindingManagerEntry, m as toSessionBindingRecord, o as removeBindingRecord, r as getMatrixThreadBindingManagerEntry, s as resolveBindingKey, t as deleteMatrixThreadBindingManagerEntry } from "./thread-bindings-shared-DEAGGuDA.mjs";
import { r as assertMatrixSupportedStateFile } from "./retired-state-BsxdpJNk.mjs";
import { n as resolveMatrixSqliteStateKey, t as resolveMatrixSqliteStateEnv } from "./sqlite-state-D6Zpz1q1.mjs";
import { a as resolveMatrixStateFilePath, t as claimCurrentTokenStorageState } from "./storage-CCarF_gm.mjs";
import { r as sendMessageMatrix } from "./send-COg4UAcR.mjs";
import { asOptionalObjectRecord, normalizeOptionalString } from "openclaw/plugin-sdk/string-coerce-runtime";
import path from "node:path";
import { resolveOptionalIntegerOption } from "openclaw/plugin-sdk/number-runtime";
import { isPluginOwnedSessionBindingRecord } from "openclaw/plugin-sdk/conversation-binding-runtime";
import { registerSessionBindingAdapterV2, resolveThreadBindingFarewellText, resolveThreadBindingLifecycle, resolveThreadBindingTargetKind, unregisterSessionBindingAdapter, warnPluginSdkDeprecation } from "openclaw/plugin-sdk/thread-bindings-session-runtime";
import { sha256Hex } from "openclaw/plugin-sdk/node-crypto-runtime";
import { hasSqliteWorkerOutcomeUnknown } from "openclaw/plugin-sdk/sqlite-runtime";
import { resolveSessionAgentIdStrict } from "openclaw/plugin-sdk/agent-scope-runtime";
import { resolveAgentIdFromSessionKey } from "openclaw/plugin-sdk/session-key-runtime";
// extensions/matrix/src/matrix/thread-bindings-session-adapter.ts
function sameBindingIncarnation(a, b) {
	return resolveBindingKey(a) === resolveBindingKey(b) && a.boundAt === b.boundAt && a.targetSessionKey === b.targetSessionKey && a.targetKind === b.targetKind;
}
function buildMatrixBindingIntroText(params) {
	const introText = normalizeOptionalString(params.introText);
	if (introText) return introText;
	const label = normalizeOptionalString(params.metadata?.label);
	const agentId = normalizeOptionalString(params.metadata?.agentId) || (isPluginOwnedSessionBindingRecord(params) ? void 0 : resolveAgentIdFromSessionKey(params.targetSessionKey));
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
function createMatrixSessionBindingAdapter(params, { manager, defaults, committedBindings, assertManagerCurrent, assertAcceptingMutation, mutateBindings }) {
	const { removeBindingsAsync, touchBindingAsync } = manager;
	const sendFarewellMessage = async (record, reason) => {
		const roomId = record.parentConversationId ?? record.conversationId;
		const idleTimeoutMs = typeof record.idleTimeoutMs === "number" ? record.idleTimeoutMs : defaults.idleTimeoutMs;
		const maxAgeMs = typeof record.maxAgeMs === "number" ? record.maxAgeMs : defaults.maxAgeMs;
		const farewellText = resolveThreadBindingFarewellText({
			reason,
			idleTimeoutMs,
			maxAgeMs
		});
		await sendBindingMessage({
			cfg: params.cfg,
			client: params.client,
			accountId: params.accountId,
			roomId,
			threadId: record.parentConversationId && record.parentConversationId !== record.conversationId ? record.conversationId : void 0,
			text: farewellText
		}).catch(() => {});
	};
	const unbindRecords = async (records, reason, onRemoved) => {
		const removed = await removeBindingsAsync(records);
		if (removed.length === 0) return [];
		removed.forEach((record) => onRemoved?.(record));
		await Promise.all(removed.map((record) => sendFarewellMessage(record, typeof reason === "function" ? reason(record) : reason)));
		return removed.map((record) => toSessionBindingRecord(record, defaults));
	};
	const getCommittedBinding = (ref) => {
		assertManagerCurrent();
		return [...committedBindings.values()].find((record) => record.conversationId === ref.conversationId.trim() && (!ref.parentConversationId || record.parentConversationId === ref.parentConversationId.trim()));
	};
	const projectCommittedBinding = (record) => {
		const observed = manager.getByConversation(record);
		return toSessionBindingRecord(observed && sameBindingIncarnation(record, observed) ? {
			...record,
			lastActivityAt: Math.max(record.lastActivityAt, observed.lastActivityAt)
		} : record, defaults);
	};
	return {
		sessionBindingAdapter: {
			version: 2,
			assertCurrent: assertManagerCurrent,
			channel: "matrix",
			accountId: params.accountId,
			capabilities: {
				placements: ["current", "child"],
				bindSupported: true,
				unbindSupported: true
			},
			bind: async (input) => {
				assertAcceptingMutation();
				input.assertCurrent?.();
				const conversationId = input.conversation.conversationId.trim();
				const parentConversationId = normalizeOptionalString(input.conversation.parentConversationId);
				const targetSessionKey = input.targetSessionKey.trim();
				if (!conversationId || !targetSessionKey) return null;
				const existing = input.placement !== "child" ? manager.getByConversation({
					conversationId,
					parentConversationId
				}) : void 0;
				const previous = existing?.targetSessionKey === targetSessionKey && existing.targetKind === "subagent" === (input.targetKind === "subagent") ? existing : void 0;
				const metadata = {
					...previous ? {
						agentId: previous.agentId,
						label: previous.label,
						boundBy: previous.boundBy,
						...previous.metadata
					} : void 0,
					...input.metadata
				};
				const targetKind = await resolveThreadBindingTargetKind({
					cfg: params.cfg,
					targetSessionKey,
					targetKind: input.targetKind,
					metadata,
					agentId: normalizeOptionalString(metadata.agentId),
					channel: "Matrix",
					assertCurrent: () => {
						assertManagerCurrent();
						input.assertCurrent?.();
					}
				});
				assertAcceptingMutation();
				input.assertCurrent?.();
				let boundConversationId = conversationId;
				let boundParentConversationId = parentConversationId;
				const introText = buildMatrixBindingIntroText({
					metadata,
					targetSessionKey,
					introText: input.metadata?.introText
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
					assertManagerCurrent();
					if (!rootEventId) return null;
					boundConversationId = rootEventId;
					boundParentConversationId = roomId;
				}
				const now = Date.now();
				const record = {
					accountId: params.accountId,
					conversationId: boundConversationId,
					...boundParentConversationId ? { parentConversationId: boundParentConversationId } : {},
					targetKind,
					targetSessionKey,
					agentId: normalizeOptionalString(metadata.agentId) ?? (isPluginOwnedSessionBindingRecord({ metadata }) ? void 0 : resolveSessionAgentIdStrict({
						config: params.cfg,
						sessionKey: targetSessionKey
					})),
					label: normalizeOptionalString(metadata.label) || void 0,
					boundBy: normalizeOptionalString(metadata.boundBy) || "system",
					boundAt: now,
					lastActivityAt: now,
					idleTimeoutMs: defaults.idleTimeoutMs,
					maxAgeMs: defaults.maxAgeMs,
					metadata
				};
				await mutateBindings((current) => [...current.filter((entry) => resolveBindingKey(entry) !== resolveBindingKey(record)), record], input.placement !== "child" ? input.assertCurrent : void 0);
				assertManagerCurrent();
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
			listBySessionAsync: async (targetSessionKey) => {
				assertManagerCurrent();
				return [...committedBindings.values()].filter((record) => record.targetSessionKey === targetSessionKey.trim()).map(projectCommittedBinding);
			},
			resolveByConversationAsync: async (ref) => {
				const record = getCommittedBinding(ref);
				return record ? projectCommittedBinding(record) : null;
			},
			inspectByConversationAsync: async (ref) => {
				const record = getCommittedBinding(ref);
				return record ? projectCommittedBinding(record) : null;
			},
			inspectByConversationsAsync: async (refs) => {
				const records = refs.map(getCommittedBinding);
				return {
					bindings: records.map((record) => record ? projectCommittedBinding(record) : null),
					assertCurrent: () => {
						assertManagerCurrent();
						if (refs.some((ref, index) => getCommittedBinding(ref) !== records[index])) throw new Error("Matrix thread binding selection changed");
					}
				};
			},
			touchAsync: touchBindingAsync,
			listBySession: (targetSessionKey) => manager.listBySessionKey(targetSessionKey).map((record) => toSessionBindingRecord(record, defaults)),
			resolveByConversation: (ref) => {
				const record = manager.getByConversation(ref);
				return record ? toSessionBindingRecord(record, defaults) : null;
			},
			touch: (bindingId, at) => {
				manager.touchBinding(bindingId, at);
			},
			unbind: async (input) => {
				assertManagerCurrent();
				return unbindRecords(listBindingsForAccount(params.accountId).filter((record) => {
					if (input.bindingId?.trim()) return resolveBindingKey(record) === input.bindingId.trim();
					if (input.targetSessionKey?.trim()) return record.targetSessionKey === input.targetSessionKey.trim();
					return false;
				}), input.reason);
			}
		},
		unbindRecords
	};
}
// extensions/matrix/src/matrix/thread-bindings.ts
const THREAD_BINDINGS_NAMESPACE = "thread-bindings";
const THREAD_BINDINGS_MAX_ENTRIES = 1e4;
const THREAD_BINDINGS_SWEEP_INTERVAL_MS = 6e4;
const TOUCH_PERSIST_DELAY_MS = 3e4;
function createThreadBindingStore(params) {
	return params.runtime.state.openKeyedStoreV2({
		namespace: THREAD_BINDINGS_NAMESPACE,
		maxEntries: THREAD_BINDINGS_MAX_ENTRIES,
		env: resolveMatrixSqliteStateEnv(params)
	}, params.assertCurrent ? { assertCurrent: params.assertCurrent } : void 0);
}
function buildThreadBindingStoreKey(record) {
	const digest = sha256Hex(`${record.accountId}\0${record.parentConversationId ?? ""}\0${record.conversationId}`);
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
		targetKind: record.targetKind === "subagent" || record.targetKind === "session" ? record.targetKind : "acp",
		targetSessionKey,
		agentId: normalizeOptionalString(record.agentId) || void 0,
		label: normalizeOptionalString(record.label) || void 0,
		boundBy: normalizeOptionalString(record.boundBy) || void 0,
		boundAt,
		lastActivityAt: Math.max(lastActivityAt, boundAt),
		idleTimeoutMs: resolveOptionalIntegerOption(record.idleTimeoutMs, { min: 0 }),
		maxAgeMs: resolveOptionalIntegerOption(record.maxAgeMs, { min: 0 }),
		metadata: asOptionalObjectRecord(record.metadata)
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
	for (const record of params.bindings) {
		const key = buildThreadBindingStoreKey(record);
		await store.register(key, toPluginJsonValue(record));
	}
	return params.bindings;
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
	const runtime = getMatrixRuntime();
	const loaded = await loadBindingsFromPluginState({
		runtime,
		accountId: params.accountId,
		env: params.env,
		stateDir: sqliteStateDir
	});
	for (const record of loaded) setBindingRecord(record);
	const committedBindings = new Map(loaded.map((record) => [resolveBindingKey(record), record]));
	let persistQueue = Promise.resolve();
	const publishCommittedBindings = (committed, before) => {
		const previousByKey = new Map(before.map((record) => [resolveBindingKey(record), record]));
		const currentByKey = new Map(listBindingsForAccount(params.accountId).map((record) => [resolveBindingKey(record), record]));
		committedBindings.clear();
		for (const record of committed) {
			const key = resolveBindingKey(record);
			committedBindings.set(key, record);
			if (currentByKey.get(key) === previousByKey.get(key)) setBindingRecord(record);
		}
		for (const record of before) {
			const key = resolveBindingKey(record);
			if (!committedBindings.has(key) && currentByKey.get(key) === record) removeBindingRecord(record);
		}
	};
	const persistSnapshot = async (bindings, before, assertCurrent) => {
		try {
			const committed = await persistBindingsSnapshot({
				runtime,
				accountId: params.accountId,
				bindings,
				env: params.env,
				stateDir: sqliteStateDir,
				assertCurrent
			});
			assertCurrent();
			return committed;
		} catch (error) {
			if (hasSqliteWorkerOutcomeUnknown(error)) {
				stopping = true;
				throw new Error("Matrix thread binding persistence has an unknown outcome; restart the account", { cause: error });
			}
			try {
				const committed = await loadBindingsFromPluginState({
					runtime,
					accountId: params.accountId,
					env: params.env,
					stateDir: sqliteStateDir,
					assertCurrent: assertManagerCurrent
				});
				assertManagerCurrent();
				publishCommittedBindings(committed, before);
			} catch (reconciliationError) {
				stopping = true;
				throw new AggregateError([error, reconciliationError], "Matrix thread binding persistence could not be reconciled; restart the account", { cause: reconciliationError });
			}
			throw error;
		}
	};
	const enqueuePersist = () => {
		const next = persistQueue.catch(() => {}).then(async () => {
			assertManagerCurrent();
			const snapshot = listBindingsForAccount(params.accountId);
			const committed = await persistSnapshot(snapshot, snapshot, assertManagerCurrent);
			publishCommittedBindings(committed, snapshot);
			await claimCurrentTokenStorageState({ rootDir: sqliteStateDir });
		});
		persistQueue = next;
		return next;
	};
	const persist = async () => await enqueuePersist();
	const persistSafely = (reason) => {
		enqueuePersist().catch((err) => {
			params.logVerboseMessage?.(`matrix: failed persisting thread bindings account=${params.accountId} action=${reason}: ${String(err)}`);
		});
	};
	const defaults = {
		idleTimeoutMs: params.idleTimeoutMs,
		maxAgeMs: params.maxAgeMs
	};
	let persistTimer = null;
	let touchPersistPending = false;
	const schedulePersist = (delayMs) => {
		touchPersistPending = true;
		if (persistTimer || stopPromise) return;
		persistTimer = setTimeout(() => {
			persistTimer = null;
			touchPersistPending = false;
			persistSafely("delayed-touch");
		}, delayMs);
		persistTimer.unref?.();
	};
	const updateBindingsBySessionKey = (input) => {
		const method = input.field === "idleTimeoutMs" ? "setIdleTimeoutBySessionKey" : "setMaxAgeBySessionKey";
		warnPluginSdkDeprecation({
			pluginId: "matrix",
			family: "conversation-bindings",
			method: `MatrixThreadBindingManager.${method}`,
			replacement: `await ${method}Async()`,
			compatibility: "Legacy methods return cached results synchronously and defer persistence."
		});
		const targetSessionKey = input.targetSessionKey.trim();
		if (!targetSessionKey) return [];
		const now = Date.now();
		const nextBindings = listBindingsForAccount(params.accountId).filter((entry) => entry.targetSessionKey === targetSessionKey).map((entry) => Object.assign({}, entry, {
			[input.field]: Math.max(0, Math.floor(input.value)),
			lastActivityAt: now
		}));
		if (nextBindings.length === 0) return [];
		for (const entry of nextBindings) setBindingRecord(entry);
		persistSafely(input.persistReason);
		return nextBindings;
	};
	let stopping = false;
	let stopPromise;
	const assertManagerCurrent = () => {
		if (stopping || getMatrixThreadBindingManagerEntry(params.accountId)?.manager !== manager) throw new Error("Matrix thread binding manager was retired");
	};
	const assertAcceptingMutation = () => {
		assertManagerCurrent();
		if (stopPromise) throw new Error("Matrix thread binding manager is stopping");
	};
	const mutateBindings = (prepare, assertInputCurrent) => {
		assertAcceptingMutation();
		const operation = persistQueue.catch(() => {}).then(async () => {
			assertManagerCurrent();
			const before = listBindingsForAccount(params.accountId);
			const next = prepare(before);
			if (!next) return before;
			const beforeByKey = new Map(before.map((record) => [resolveBindingKey(record), record]));
			const assertCurrent = () => {
				assertManagerCurrent();
				assertInputCurrent?.();
				const current = listBindingsForAccount(params.accountId);
				if (current.length !== before.length || current.some((record) => beforeByKey.get(resolveBindingKey(record)) !== record)) throw new Error("Matrix thread bindings changed before persistence completed");
			};
			const committed = await persistSnapshot(next, before, assertCurrent);
			publishCommittedBindings(committed, before);
			await claimCurrentTokenStorageState({ rootDir: sqliteStateDir });
			return committed;
		});
		persistQueue = operation.then(() => {});
		persistQueue.catch(() => {});
		return operation;
	};
	const removeBindingsAsync = async (records) => {
		const requested = new Map(records.map((record) => [resolveBindingKey(record), record]));
		let removed = [];
		await mutateBindings((current) => {
			removed = current.filter((record) => {
				const expected = requested.get(resolveBindingKey(record));
				return expected && sameBindingIncarnation(record, expected);
			});
			const removedKeys = new Set(removed.map(resolveBindingKey));
			return removed.length ? current.filter((record) => !removedKeys.has(resolveBindingKey(record))) : null;
		});
		return removed;
	};
	const touchBinding = (bindingId, at) => {
		warnPluginSdkDeprecation({
			pluginId: "matrix",
			family: "conversation-bindings",
			method: "MatrixThreadBindingManager.touchBinding",
			replacement: "await touchBindingAsync()",
			compatibility: "Legacy methods return cached results synchronously and defer persistence."
		});
		assertAcceptingMutation();
		const record = listBindingsForAccount(params.accountId).find((entry) => resolveBindingKey(entry) === bindingId.trim());
		if (!record) return null;
		const nextRecord = {
			...record,
			lastActivityAt: typeof at === "number" && Number.isFinite(at) ? Math.max(record.lastActivityAt, Math.floor(at)) : Date.now()
		};
		setBindingRecord(nextRecord);
		schedulePersist(TOUCH_PERSIST_DELAY_MS);
		return nextRecord;
	};
	const touchBindingAsync = (bindingId, at) => {
		assertAcceptingMutation();
		const expected = listBindingsForAccount(params.accountId).find((entry) => resolveBindingKey(entry) === bindingId.trim());
		if (!expected) return Promise.resolve();
		const requestedAt = typeof at === "number" && Number.isFinite(at) ? Math.floor(at) : Date.now();
		const next = persistQueue.catch(() => {}).then(async () => {
			assertManagerCurrent();
			const previous = listBindingsForAccount(params.accountId).find((entry) => resolveBindingKey(entry) === bindingId.trim());
			if (!previous || !sameBindingIncarnation(previous, expected)) return;
			const current = {
				...previous,
				lastActivityAt: Math.max(previous.lastActivityAt, requestedAt)
			};
			setBindingRecord(current);
			const committed = committedBindings.get(resolveBindingKey(current));
			if (committed && sameBindingIncarnation(committed, current) && current.lastActivityAt - committed.lastActivityAt < TOUCH_PERSIST_DELAY_MS) {
				if (current.lastActivityAt > committed.lastActivityAt) schedulePersist(TOUCH_PERSIST_DELAY_MS);
				return;
			}
			const assertCurrent = () => {
				assertManagerCurrent();
				if (!listBindingsForAccount(params.accountId).includes(current)) throw new Error("Matrix thread binding changed while recording activity");
			};
			await createThreadBindingStore({
				runtime,
				env: params.env,
				stateDir: sqliteStateDir,
				assertCurrent
			}).register(buildThreadBindingStoreKey(current), toPluginJsonValue(current));
			assertCurrent();
			committedBindings.set(resolveBindingKey(current), current);
		});
		persistQueue = next;
		return next;
	};
	const updateBindingsBySessionKeyAsync = async (input) => {
		const targetSessionKey = input.targetSessionKey.trim();
		const value = Math.max(0, Math.floor(input.value));
		const now = Date.now();
		return (await mutateBindings((current) => {
			if (!targetSessionKey || !current.some((record) => record.targetSessionKey === targetSessionKey)) return null;
			return current.map((record) => record.targetSessionKey === targetSessionKey ? {
				...record,
				[input.field]: value,
				lastActivityAt: now
			} : record);
		})).filter((record) => record.targetSessionKey === targetSessionKey);
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
		touchBinding,
		touchBindingAsync,
		removeBindingsAsync,
		setIdleTimeoutBySessionKey: ({ targetSessionKey, idleTimeoutMs }) => updateBindingsBySessionKey({
			targetSessionKey,
			field: "idleTimeoutMs",
			value: idleTimeoutMs,
			persistReason: "idle-timeout-update"
		}),
		setMaxAgeBySessionKey: ({ targetSessionKey, maxAgeMs }) => updateBindingsBySessionKey({
			targetSessionKey,
			field: "maxAgeMs",
			value: maxAgeMs,
			persistReason: "max-age-update"
		}),
		setIdleTimeoutBySessionKeyAsync: ({ targetSessionKey, idleTimeoutMs }) => updateBindingsBySessionKeyAsync({
			targetSessionKey,
			field: "idleTimeoutMs",
			value: idleTimeoutMs,
			persistReason: "idle-timeout-update"
		}),
		setMaxAgeBySessionKeyAsync: ({ targetSessionKey, maxAgeMs }) => updateBindingsBySessionKeyAsync({
			targetSessionKey,
			field: "maxAgeMs",
			value: maxAgeMs,
			persistReason: "max-age-update"
		}),
		stop: () => {
			if (stopPromise) return stopPromise;
			if (sweepTimer) clearInterval(sweepTimer);
			if (persistTimer) {
				clearTimeout(persistTimer);
				persistTimer = null;
			}
			stopPromise = (async () => {
				try {
					await persistQueue;
					if (touchPersistPending) {
						touchPersistPending = false;
						await enqueuePersist();
					}
				} finally {
					stopping = true;
					unregisterSessionBindingAdapter({
						channel: "matrix",
						accountId: params.accountId,
						adapter: sessionBindingAdapter
					});
					if (getMatrixThreadBindingManagerEntry(params.accountId)?.manager === manager) {
						deleteMatrixThreadBindingManagerEntry(params.accountId);
						for (const record of listBindingsForAccount(params.accountId)) removeBindingRecord(record);
					}
				}
			})();
			return stopPromise;
		}
	};
	let sweepTimer = null;
	const { sessionBindingAdapter, unbindRecords } = createMatrixSessionBindingAdapter(params, {
		manager,
		defaults,
		committedBindings,
		assertManagerCurrent,
		assertAcceptingMutation,
		mutateBindings
	});
	registerSessionBindingAdapterV2(sessionBindingAdapter);
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
			unbindRecords(expired.map(({ record }) => record), (record) => reasonByBindingKey.get(resolveBindingKey(record)), (record) => {
				const reason = reasonByBindingKey.get(resolveBindingKey(record));
				params.logVerboseMessage?.(`matrix: auto-unbinding ${record.conversationId} due to ${reason}`);
			}).catch((err) => {
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
export { createMatrixThreadBindingManager as t };
