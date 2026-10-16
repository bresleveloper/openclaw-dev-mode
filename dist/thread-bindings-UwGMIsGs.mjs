import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { a as resolveGlobalSingleton } from "./global-singleton-0m-JziJW.mjs";
import { t as formatErrorMessage } from "./errors-O33D01XW.mjs";
import { b as isAcpSessionKey } from "./session-key-C09ow4h0.mjs";
import { n as normalizeAccountId } from "./account-id-DbRsdayc.mjs";
import { r as runQueuedStoreWrite } from "./store-writer-queue-Cq6rziq_.mjs";
import { i as logVerbose } from "./globals-BXbZ1A_g.mjs";
import "./error-runtime-BmospGvZ.mjs";
import "./string-coerce-runtime-50qKeWeL.mjs";
import "./sqlite-runtime-Ch9K5Xik.mjs";
import { t as readAcpSessionEntry } from "./session-meta-C2UXd_yK.mjs";
import { c as unregisterSessionBindingAdapter, o as registerSessionBindingAdapter } from "./session-binding-service-DzGpg6K8.mjs";
import "./runtime-env-BjPzo7IN.mjs";
import "./routing-CEr1aXk1.mjs";
import { t as resolveTelegramToken } from "./token-BRhOkLLB.mjs";
import { n as resolveThreadBindingLifecycle } from "./thread-binding-lifecycle-Cj9qM4Hm.mjs";
import { r as resolveThreadBindingEffectiveExpiresAt } from "./thread-bindings-policy-DE7-D4c0.mjs";
import { t as formatThreadBindingDurationLabel } from "./thread-bindings-messages-BhQOhR26.mjs";
import "./conversation-runtime-De-TwUwt.mjs";
import { t as resolveThreadBindingConversationIdFromBindingId } from "./thread-binding-id-Dh5zJVo6.mjs";
import "./acp-runtime-BO6hSDW4.mjs";
import "./global-singleton-yHEs_vfD.mjs";
import { n as getTelegramRuntime } from "./runtime-Cw8emHLA.mjs";
import { t as loadTelegramSendModule } from "./send-runtime-CECbxi5D.mjs";
import { createHash } from "node:crypto";
//#region extensions/telegram/src/thread-bindings-store.ts
const TELEGRAM_THREAD_BINDINGS_NAMESPACE = "telegram.thread-bindings";
const TELEGRAM_THREAD_BINDINGS_MAX_ENTRIES = 5e3;
function resolveStoredBindingKey(params) {
	return createHash("sha256").update(`${params.accountId}\0${params.conversationId}`, "utf8").digest("hex").slice(0, 32);
}
function normalizeMetadataForStore(metadata) {
	if (!metadata) return;
	const serialized = JSON.stringify(metadata);
	if (!serialized) return;
	const parsed = JSON.parse(serialized);
	return Object.keys(parsed).length > 0 ? parsed : void 0;
}
function sanitizeStoredBinding(accountId, entry) {
	const conversationId = normalizeOptionalString(entry?.conversationId);
	const targetSessionKey = normalizeOptionalString(entry?.targetSessionKey) ?? "";
	const targetKind = entry?.targetKind === "subagent" ? "subagent" : "acp";
	if (!conversationId || !targetSessionKey) return null;
	const boundAt = typeof entry?.boundAt === "number" && Number.isFinite(entry.boundAt) ? Math.floor(entry.boundAt) : Date.now();
	const record = {
		accountId,
		conversationId,
		targetSessionKey,
		targetKind,
		boundAt,
		lastActivityAt: typeof entry?.lastActivityAt === "number" && Number.isFinite(entry.lastActivityAt) ? Math.floor(entry.lastActivityAt) : boundAt
	};
	if (typeof entry?.idleTimeoutMs === "number" && Number.isFinite(entry.idleTimeoutMs)) record.idleTimeoutMs = Math.max(0, Math.floor(entry.idleTimeoutMs));
	if (typeof entry?.maxAgeMs === "number" && Number.isFinite(entry.maxAgeMs)) record.maxAgeMs = Math.max(0, Math.floor(entry.maxAgeMs));
	if (typeof entry?.agentId === "string" && entry.agentId.trim()) record.agentId = entry.agentId.trim();
	if (typeof entry?.label === "string" && entry.label.trim()) record.label = entry.label.trim();
	if (typeof entry?.boundBy === "string" && entry.boundBy.trim()) record.boundBy = entry.boundBy.trim();
	const metadata = normalizeMetadataForStore(entry?.metadata && typeof entry.metadata === "object" ? { ...entry.metadata } : void 0);
	if (metadata) record.metadata = metadata;
	return record;
}
//#endregion
//#region extensions/telegram/src/thread-bindings-persistence.ts
function openThreadBindingStore() {
	return getTelegramRuntime().state.openKeyedStore({
		namespace: TELEGRAM_THREAD_BINDINGS_NAMESPACE,
		maxEntries: TELEGRAM_THREAD_BINDINGS_MAX_ENTRIES
	});
}
async function loadBindingsFromStore(accountId) {
	let store;
	try {
		store = openThreadBindingStore();
	} catch (err) {
		logVerbose(`telegram thread bindings store open failed (${accountId}): ${String(err)}`);
		return [];
	}
	let entries;
	try {
		entries = await store.entries();
	} catch (err) {
		logVerbose(`telegram thread bindings store read failed (${accountId}): ${String(err)}`);
		return [];
	}
	const bindings = [];
	for (const entry of entries) {
		if (entry.value.accountId !== accountId) continue;
		const sanitized = sanitizeStoredBinding(accountId, entry.value);
		if (sanitized) {
			bindings.push(sanitized);
			continue;
		}
		try {
			await store.delete(entry.key);
		} catch (err) {
			logVerbose(`telegram thread bindings invalid row cleanup failed (${accountId}): ${String(err)}`);
		}
	}
	return bindings;
}
async function persistBindingMutation(params) {
	if (!params.persist) return false;
	try {
		const store = openThreadBindingStore();
		const key = resolveStoredBindingKey(params.binding);
		if (params.remove) {
			await store.delete(key, { assertCurrent: params.assertCurrent });
			return true;
		}
		const stored = sanitizeStoredBinding(params.accountId, params.binding);
		if (stored) {
			await store.register(key, stored, { assertCurrent: params.assertCurrent });
			return true;
		}
	} catch (err) {
		params.assertCurrent?.();
		if (params.throwOnError) throw err;
		logVerbose(`telegram thread bindings persist failed (${params.accountId}, ${params.reason}): ${String(err)}`);
	}
	return false;
}
/** Native compatibility for the published synchronous SDK, retained until its next major. */
function updateStoredBindingSync(params) {
	const fallback = () => params.update(params.binding) ?? params.binding;
	if (!params.persist) return fallback();
	let observed;
	try {
		const store = getTelegramRuntime().state.openSyncKeyedStore({
			namespace: TELEGRAM_THREAD_BINDINGS_NAMESPACE,
			maxEntries: TELEGRAM_THREAD_BINDINGS_MAX_ENTRIES
		});
		if (!store.update) throw new Error("Synchronous binding compatibility requires atomic plugin-state updates");
		let next = null;
		store.update(resolveStoredBindingKey(params.binding), (current) => {
			const canonical = current ? sanitizeStoredBinding(params.binding.accountId, current) : null;
			observed = params.pendingValueJson === null && !canonical ? null : canonical && JSON.stringify(canonical) === params.pendingValueJson ? canonical : params.binding;
			if (!observed) return;
			const updated = params.update(observed);
			next = updated ? sanitizeStoredBinding(params.binding.accountId, updated) : observed;
			return updated ? next ?? void 0 : void 0;
		});
		return next;
	} catch (err) {
		logVerbose(`telegram thread bindings compatibility persist failed (${params.binding.accountId}): ${String(err)}`);
		if (observed !== void 0) return observed ? params.update(observed) ?? observed : null;
		return params.pendingValueJson === void 0 ? fallback() : void 0;
	}
}
//#endregion
//#region extensions/telegram/src/thread-bindings-session.ts
function resolveBindingKey(params) {
	return `${params.accountId}:${params.conversationId}`;
}
function toSessionBindingRecord(record, defaults) {
	return {
		bindingId: resolveBindingKey({
			accountId: record.accountId,
			conversationId: record.conversationId
		}),
		targetSessionKey: record.targetSessionKey,
		targetKind: record.targetKind === "subagent" ? "subagent" : "session",
		conversation: {
			channel: "telegram",
			accountId: record.accountId,
			conversationId: record.conversationId
		},
		status: "active",
		boundAt: record.boundAt,
		expiresAt: resolveThreadBindingEffectiveExpiresAt({
			record,
			defaultIdleTimeoutMs: defaults.idleTimeoutMs,
			defaultMaxAgeMs: defaults.maxAgeMs
		}),
		metadata: {
			agentId: record.agentId,
			label: record.label,
			boundBy: record.boundBy,
			lastActivityAt: record.lastActivityAt,
			idleTimeoutMs: typeof record.idleTimeoutMs === "number" ? Math.max(0, Math.floor(record.idleTimeoutMs)) : defaults.idleTimeoutMs,
			maxAgeMs: typeof record.maxAgeMs === "number" ? Math.max(0, Math.floor(record.maxAgeMs)) : defaults.maxAgeMs,
			...record.metadata
		}
	};
}
function fromSessionBindingInput(params) {
	const now = Date.now();
	const metadata = params.input.metadata ?? {};
	const existing = params.existing;
	const targetKind = params.input.targetKind === "subagent" ? "subagent" : "acp";
	const previous = existing?.targetSessionKey === params.input.targetSessionKey && existing.targetKind === targetKind ? existing : void 0;
	const record = {
		accountId: params.accountId,
		conversationId: params.input.conversationId,
		targetKind,
		targetSessionKey: params.input.targetSessionKey,
		agentId: normalizeOptionalString(metadata.agentId) ?? previous?.agentId,
		label: normalizeOptionalString(metadata.label) ?? previous?.label,
		boundBy: normalizeOptionalString(metadata.boundBy) ?? previous?.boundBy,
		boundAt: now,
		lastActivityAt: now,
		metadata: {
			...previous?.metadata,
			...metadata
		}
	};
	if (typeof metadata.idleTimeoutMs === "number" && Number.isFinite(metadata.idleTimeoutMs)) record.idleTimeoutMs = Math.max(0, Math.floor(metadata.idleTimeoutMs));
	else if (typeof existing?.idleTimeoutMs === "number") record.idleTimeoutMs = existing.idleTimeoutMs;
	if (typeof metadata.maxAgeMs === "number" && Number.isFinite(metadata.maxAgeMs)) record.maxAgeMs = Math.max(0, Math.floor(metadata.maxAgeMs));
	else if (typeof existing?.maxAgeMs === "number") record.maxAgeMs = existing.maxAgeMs;
	return record;
}
function summarizeLifecycleForLog(record, defaults) {
	const idleTimeoutMs = typeof record.idleTimeoutMs === "number" ? record.idleTimeoutMs : defaults.idleTimeoutMs;
	const maxAgeMs = typeof record.maxAgeMs === "number" ? record.maxAgeMs : defaults.maxAgeMs;
	return `idle=${formatThreadBindingDurationLabel(Math.max(0, Math.floor(idleTimeoutMs)))} maxAge=${formatThreadBindingDurationLabel(Math.max(0, Math.floor(maxAgeMs)))}`;
}
function normalizeDurationMs(raw, fallback) {
	if (typeof raw !== "number" || !Number.isFinite(raw)) return fallback;
	return Math.max(0, Math.floor(raw));
}
function normalizeTimestampMs(raw) {
	if (typeof raw !== "number" || !Number.isFinite(raw)) return Date.now();
	return Math.max(0, Math.floor(raw));
}
//#endregion
//#region extensions/telegram/src/thread-bindings-state.ts
/**
* Keep Telegram thread binding state shared across bundled chunks so routing,
* binding lookups, and binding mutations all observe the same live registry.
*/
const TELEGRAM_THREAD_BINDINGS_STATE_KEY = Symbol.for("openclaw.telegramThreadBindingsState");
let threadBindingsState;
function getThreadBindingsState() {
	if (threadBindingsState) return threadBindingsState;
	const state = resolveGlobalSingleton(TELEGRAM_THREAD_BINDINGS_STATE_KEY, () => ({
		managersByAccountId: /* @__PURE__ */ new Map(),
		bindingsByAccountConversation: /* @__PURE__ */ new Map()
	}));
	return threadBindingsState = Object.assign(state, {
		queues: state.queues ?? /* @__PURE__ */ new Map(),
		pendingMutations: state.pendingMutations ?? /* @__PURE__ */ new WeakMap()
	});
}
function finishBindingMutationScope(manager) {
	getThreadBindingsState().pendingMutations.delete(manager);
}
function pendingBindingValue(manager, conversationId) {
	return getThreadBindingsState().pendingMutations.get(manager)?.get(conversationId)?.preparedValueJson;
}
function listBindingsForAccount(accountId) {
	return [...getThreadBindingsState().bindingsByAccountConversation.values()].filter((entry) => entry.accountId === accountId);
}
function captureBindingMutation(manager, conversationId) {
	const state = getThreadBindingsState();
	const key = resolveBindingKey({
		accountId: manager.accountId,
		conversationId
	});
	const previous = state.bindingsByAccountConversation.get(key);
	const pending = state.pendingMutations.get(manager) ?? /* @__PURE__ */ new Map();
	const receipt = {};
	pending.set(conversationId, receipt);
	state.pendingMutations.set(manager, pending);
	const isCurrent = () => state.managersByAccountId.get(manager.accountId) === manager && state.bindingsByAccountConversation.get(key) === previous;
	const assertCurrent = () => {
		if (!isCurrent()) throw new Error(`Telegram thread binding changed before persistence (${manager.accountId}:${conversationId})`);
	};
	return {
		previous,
		assertCurrent,
		prepare(record) {
			receipt.preparedValueJson = record ? JSON.stringify(sanitizeStoredBinding(manager.accountId, record)) : null;
		},
		publish(record, committed) {
			try {
				if (!isCurrent()) {
					if (!committed) assertCurrent();
					return;
				}
				if (record) state.bindingsByAccountConversation.set(key, record);
				else state.bindingsByAccountConversation.delete(key);
			} finally {
				pending.delete(conversationId);
			}
		},
		async commit(binding, options) {
			const next = options.remove ? null : binding;
			this.prepare(next);
			const committed = await persistBindingMutation({
				...options,
				accountId: manager.accountId,
				persist: manager.shouldPersistMutations(),
				binding,
				assertCurrent
			});
			this.publish(next, committed);
		}
	};
}
//#endregion
//#region extensions/telegram/src/thread-bindings-reconcile.ts
async function reconcileTelegramAcpBindingsOnStartup(params) {
	const { accountId, persist } = params;
	const acpSessionKeys = /* @__PURE__ */ new Set();
	for (const binding of getThreadBindingsState().bindingsByAccountConversation.values()) {
		if (binding.targetKind !== "acp" || !isAcpSessionKey(binding.targetSessionKey)) continue;
		acpSessionKeys.add(binding.targetSessionKey);
	}
	const staleSessionKeys = /* @__PURE__ */ new Set();
	for (const targetSessionKey of acpSessionKeys) {
		const sessionEntry = readAcpSessionEntry({ sessionKey: targetSessionKey });
		if (!sessionEntry || sessionEntry.storeReadFailed) continue;
		if (!sessionEntry.entry || sessionEntry.entry.status === "failed" || sessionEntry.entry.status === "killed" || sessionEntry.entry.status === "timeout" || sessionEntry.acp?.state === "error") staleSessionKeys.add(targetSessionKey);
	}
	for (const sessionKey of staleSessionKeys) {
		const bindingsToRemove = listBindingsForAccount(accountId).filter((b) => b.targetSessionKey === sessionKey);
		for (const binding of bindingsToRemove) {
			getThreadBindingsState().bindingsByAccountConversation.delete(resolveBindingKey({
				accountId,
				conversationId: binding.conversationId
			}));
			await persistBindingMutation({
				accountId,
				persist,
				binding,
				remove: true,
				reason: "cleanup-stale"
			});
		}
		if (bindingsToRemove.length > 0) logVerbose(`telegram thread binding: cleaned up ${bindingsToRemove.length} stale binding(s) for session ${sessionKey}`);
	}
}
//#endregion
//#region extensions/telegram/src/thread-bindings.ts
const DEFAULT_THREAD_BINDING_IDLE_TIMEOUT_MS = 864e5;
const DEFAULT_THREAD_BINDING_MAX_AGE_MS = 0;
const THREAD_BINDINGS_SWEEP_INTERVAL_MS = 6e4;
async function createTelegramThreadBindingManager(params) {
	const accountId = normalizeAccountId(params.accountId);
	const prepared = { ...params };
	return await queueBindingWork(accountId, () => initializeThreadBindingManager(prepared, accountId));
}
function queueBindingWork(accountId, fn) {
	return runQueuedStoreWrite({
		queues: getThreadBindingsState().queues,
		storePath: accountId,
		label: "telegram thread bindings",
		fn
	});
}
async function initializeThreadBindingManager(params, accountId) {
	const existing = getThreadBindingsState().managersByAccountId.get(accountId);
	if (existing) return existing;
	const persist = params.persist ?? true;
	const idleTimeoutMs = normalizeDurationMs(params.idleTimeoutMs, DEFAULT_THREAD_BINDING_IDLE_TIMEOUT_MS);
	const maxAgeMs = normalizeDurationMs(params.maxAgeMs, DEFAULT_THREAD_BINDING_MAX_AGE_MS);
	const loaded = await loadBindingsFromStore(accountId);
	for (const entry of loaded) {
		const key = resolveBindingKey({
			accountId,
			conversationId: entry.conversationId
		});
		getThreadBindingsState().bindingsByAccountConversation.set(key, {
			...entry,
			accountId
		});
	}
	await reconcileTelegramAcpBindingsOnStartup({
		accountId,
		persist
	});
	let sweepTimer = null;
	let stopping;
	const assertManagerCurrent = () => {
		if (getThreadBindingsState().managersByAccountId.get(accountId) !== manager) throw new Error(`Telegram thread binding manager retired (${accountId})`);
	};
	const mutate = (fn) => {
		if (stopping) return Promise.reject(/* @__PURE__ */ new Error(`Telegram thread binding manager stopping (${accountId})`));
		return queueBindingWork(accountId, async () => {
			assertManagerCurrent();
			try {
				return await fn();
			} finally {
				finishBindingMutationScope(manager);
			}
		});
	};
	const manager = {
		accountId,
		shouldPersistMutations: () => persist,
		getIdleTimeoutMs: () => idleTimeoutMs,
		getMaxAgeMs: () => maxAgeMs,
		getByConversationId: (conversationIdRaw) => {
			const conversationId = normalizeOptionalString(conversationIdRaw);
			if (!conversationId) return;
			return getThreadBindingsState().bindingsByAccountConversation.get(resolveBindingKey({
				accountId,
				conversationId
			}));
		},
		listBySessionKey: (targetSessionKeyRaw) => {
			const targetSessionKey = targetSessionKeyRaw.trim();
			if (!targetSessionKey) return [];
			return listBindingsForAccount(accountId).filter((entry) => entry.targetSessionKey === targetSessionKey);
		},
		listBindings: () => listBindingsForAccount(accountId),
		touchConversation: (conversationIdRaw, at) => {
			const activityAt = at ?? Date.now();
			return mutate(async () => {
				const conversationId = normalizeOptionalString(conversationIdRaw);
				if (!conversationId) return null;
				const mutation = captureBindingMutation(manager, conversationId);
				const existingLocal = mutation.previous;
				if (!existingLocal) return null;
				const requestedActivityAt = normalizeTimestampMs(activityAt);
				const nextRecord = {
					...existingLocal,
					lastActivityAt: at === void 0 ? Math.max(existingLocal.lastActivityAt, requestedActivityAt) : requestedActivityAt
				};
				await mutation.commit(nextRecord, { reason: "touch" });
				return nextRecord;
			});
		},
		unbindConversation: ({ conversationId: conversationIdRaw, throwOnPersistError }) => mutate(async () => {
			const conversationId = normalizeOptionalString(conversationIdRaw);
			if (!conversationId) return null;
			const mutation = captureBindingMutation(manager, conversationId);
			const removed = mutation.previous ?? null;
			if (!removed) return null;
			await mutation.commit(removed, {
				remove: true,
				reason: "unbind-conversation",
				throwOnError: throwOnPersistError
			});
			return removed;
		}),
		unbindBySessionKey: ({ targetSessionKey: targetSessionKeyRaw, throwOnPersistError }) => mutate(async () => {
			const targetSessionKey = targetSessionKeyRaw.trim();
			if (!targetSessionKey) return [];
			const removed = [];
			for (const entry of listBindingsForAccount(accountId)) {
				if (entry.targetSessionKey !== targetSessionKey) continue;
				const mutation = captureBindingMutation(manager, entry.conversationId);
				const current = mutation.previous;
				if (!current || current.targetSessionKey !== targetSessionKey) continue;
				await mutation.commit(current, {
					remove: true,
					reason: "unbind-session",
					throwOnError: throwOnPersistError
				});
				removed.push(current);
			}
			return removed;
		}),
		updateBySessionKey: (targetSessionKey, update) => mutate(() => updateTelegramBindingsBySessionKey({
			manager,
			targetSessionKey,
			update
		})),
		updateConversationSync: (conversationIdRaw, update) => {
			if (stopping) return null;
			assertManagerCurrent();
			const binding = manager.getByConversationId(conversationIdRaw);
			if (!binding) return null;
			const next = updateStoredBindingSync({
				binding,
				persist,
				update,
				pendingValueJson: pendingBindingValue(manager, binding.conversationId)
			});
			if (next === void 0) return null;
			const key = resolveBindingKey(binding);
			if (next) getThreadBindingsState().bindingsByAccountConversation.set(key, next);
			else getThreadBindingsState().bindingsByAccountConversation.delete(key);
			return next;
		},
		stop: () => {
			if (stopping) return stopping;
			if (sweepTimer) {
				clearInterval(sweepTimer);
				sweepTimer = null;
			}
			stopping = queueBindingWork(accountId, async () => {
				unregisterSessionBindingAdapter({
					channel: "telegram",
					accountId,
					adapter: sessionBindingAdapter
				});
				const state = getThreadBindingsState();
				if (state.managersByAccountId.get(accountId) === manager) {
					state.managersByAccountId.delete(accountId);
					for (const binding of listBindingsForAccount(accountId)) state.bindingsByAccountConversation.delete(resolveBindingKey({
						accountId,
						conversationId: binding.conversationId
					}));
				}
			});
			return stopping;
		}
	};
	const projectSessionBinding = (record) => toSessionBindingRecord(record, {
		idleTimeoutMs,
		maxAgeMs
	});
	const sessionBindingAdapter = {
		channel: "telegram",
		accountId,
		capabilities: { placements: ["current", "child"] },
		bind: (input) => {
			const prepared = {
				...input,
				conversation: { ...input.conversation },
				metadata: normalizeMetadataForStore(input.metadata) ?? {}
			};
			return mutate(async () => {
				const assertCurrent = prepared.assertCurrent;
				if (prepared.conversation.channel !== "telegram") return null;
				const targetSessionKey = prepared.targetSessionKey.trim();
				const targetKind = prepared.targetKind;
				if (!targetSessionKey) return null;
				const placement = prepared.placement === "child" ? "child" : "current";
				const metadata = { ...prepared.metadata };
				let conversationId;
				let nativeTopicCreated = false;
				if (placement === "child") {
					const rawConversationId = prepared.conversation.conversationId?.trim() ?? "";
					const chatId = (prepared.conversation.parentConversationId?.trim() ?? "") || rawConversationId;
					if (!chatId) {
						logVerbose(`telegram: child bind failed: could not resolve group chat ID from conversationId=${rawConversationId}`);
						return null;
					}
					if (!chatId.startsWith("-")) {
						logVerbose(`telegram: child bind failed: conversationId "${chatId}" looks like a bare topic ID, not a group chat ID (expected to start with "-"). Provide a full chatId:topic:topicId conversationId or set parentConversationId to the group chat ID.`);
						return null;
					}
					const threadName = (normalizeOptionalString(metadata.threadName) ?? "") || (normalizeOptionalString(metadata.label) ?? "") || `Agent: ${targetSessionKey.split(":").pop()}`;
					try {
						const tokenResolution = resolveTelegramToken(params.cfg, { accountId });
						if (!tokenResolution.token) return null;
						const { createForumTopicTelegram } = await loadTelegramSendModule();
						const result = await createForumTopicTelegram(chatId, threadName, {
							cfg: params.cfg,
							token: tokenResolution.token,
							accountId,
							...assertCurrent ? { assertPlatformSendAuthorized: assertCurrent } : {}
						});
						conversationId = `${result.chatId}:topic:${result.topicId}`;
						nativeTopicCreated = true;
					} catch (err) {
						logVerbose(`telegram: child thread-binding failed for ${chatId}: ${formatErrorMessage(err)}`);
						return null;
					}
				} else conversationId = normalizeOptionalString(prepared.conversation.conversationId);
				if (!conversationId) return null;
				const mutation = captureBindingMutation(manager, conversationId);
				const record = fromSessionBindingInput({
					accountId,
					existing: mutation.previous,
					input: {
						targetSessionKey,
						targetKind,
						conversationId,
						metadata
					}
				});
				if (!nativeTopicCreated) assertCurrent?.();
				mutation.prepare(record);
				const committed = manager.shouldPersistMutations() && await persistBindingMutation({
					accountId,
					persist: true,
					binding: record,
					reason: "bind",
					throwOnError: true,
					assertCurrent: () => {
						mutation.assertCurrent();
						if (!nativeTopicCreated) assertCurrent?.();
					}
				});
				mutation.publish(record, committed);
				logVerbose(`telegram: bound conversation ${conversationId} -> ${targetSessionKey} (${summarizeLifecycleForLog(record, {
					idleTimeoutMs,
					maxAgeMs
				})})`);
				return projectSessionBinding(record);
			});
		},
		listBySession: (targetSessionKey) => manager.listBySessionKey(targetSessionKey).map(projectSessionBinding),
		resolveByConversation: (ref) => {
			if (ref.channel !== "telegram") return null;
			const conversationId = normalizeOptionalString(ref.conversationId);
			if (!conversationId) return null;
			const record = manager.getByConversationId(conversationId);
			return record ? projectSessionBinding(record) : null;
		},
		touch: (bindingId, at) => {
			const conversationId = resolveThreadBindingConversationIdFromBindingId({
				accountId,
				bindingId
			});
			if (conversationId) {
				const lastActivityAt = normalizeTimestampMs(at ?? Date.now());
				manager.updateConversationSync(conversationId, (current) => ({
					...current,
					lastActivityAt
				}));
			}
		},
		touchAsync: async (bindingId, at) => {
			const conversationId = resolveThreadBindingConversationIdFromBindingId({
				accountId,
				bindingId
			});
			if (!conversationId) return;
			await manager.touchConversation(conversationId, at);
		},
		unbind: async (input) => {
			if (input.targetSessionKey?.trim()) return (await manager.unbindBySessionKey({
				targetSessionKey: input.targetSessionKey,
				reason: input.reason,
				sendFarewell: false,
				throwOnPersistError: true
			})).map(projectSessionBinding);
			const conversationId = resolveThreadBindingConversationIdFromBindingId({
				accountId,
				bindingId: input.bindingId
			});
			if (!conversationId) return [];
			const removed = await manager.unbindConversation({
				conversationId,
				reason: input.reason,
				sendFarewell: false,
				throwOnPersistError: true
			});
			return removed ? [projectSessionBinding(removed)] : [];
		}
	};
	registerSessionBindingAdapter(sessionBindingAdapter);
	if (params.enableSweeper !== false) {
		let sweeping = false;
		sweepTimer = setInterval(() => {
			if (sweeping) return;
			sweeping = true;
			mutate(async () => {
				const now = Date.now();
				for (const candidate of listBindingsForAccount(accountId)) {
					const mutation = captureBindingMutation(manager, candidate.conversationId);
					const record = mutation.previous;
					if (!record) continue;
					const { expiresAt, reason } = resolveThreadBindingLifecycle({
						record,
						defaultIdleTimeoutMs: idleTimeoutMs,
						defaultMaxAgeMs: maxAgeMs
					});
					if (expiresAt === void 0 || now < expiresAt) continue;
					await mutation.commit(record, {
						remove: true,
						reason: reason ?? "expired"
					});
				}
			}).catch((error) => {
				logVerbose(`telegram thread bindings sweep failed (${accountId}): ${String(error)}`);
			}).finally(() => {
				sweeping = false;
			});
		}, THREAD_BINDINGS_SWEEP_INTERVAL_MS);
		sweepTimer.unref?.();
	}
	getThreadBindingsState().managersByAccountId.set(accountId, manager);
	return manager;
}
function getTelegramThreadBindingManager(accountId) {
	return getThreadBindingsState().managersByAccountId.get(normalizeAccountId(accountId)) ?? null;
}
async function updateTelegramBindingsBySessionKey(params) {
	const targetSessionKey = params.targetSessionKey.trim();
	if (!targetSessionKey) return [];
	const now = Date.now();
	const updated = [];
	for (const entry of params.manager.listBySessionKey(targetSessionKey)) {
		const mutation = captureBindingMutation(params.manager, entry.conversationId);
		const current = mutation.previous;
		if (!current || current.targetSessionKey !== targetSessionKey) continue;
		const next = params.update(current, now);
		await mutation.commit(next, { reason: "session-lifecycle-update" });
		updated.push(next);
	}
	return updated;
}
async function setTelegramThreadBindingIdleTimeoutBySessionKeyAsync(params) {
	const manager = getTelegramThreadBindingManager(params.accountId);
	if (!manager) return [];
	const idleTimeoutMs = normalizeDurationMs(params.idleTimeoutMs, 0);
	return manager.updateBySessionKey(params.targetSessionKey, (entry, now) => ({
		...entry,
		idleTimeoutMs,
		lastActivityAt: now
	}));
}
async function setTelegramThreadBindingMaxAgeBySessionKeyAsync(params) {
	const manager = getTelegramThreadBindingManager(params.accountId);
	if (!manager) return [];
	const maxAgeMs = normalizeDurationMs(params.maxAgeMs, 0);
	return manager.updateBySessionKey(params.targetSessionKey, (entry, now) => ({
		...entry,
		maxAgeMs,
		lastActivityAt: now
	}));
}
function updateTelegramBindingsSynchronously(params) {
	const manager = getTelegramThreadBindingManager(params.accountId);
	if (!manager) return [];
	const targetSessionKey = params.targetSessionKey.trim();
	const now = Date.now();
	const updated = [];
	for (const entry of manager.listBySessionKey(targetSessionKey)) {
		const next = manager.updateConversationSync(entry.conversationId, (current) => current.targetSessionKey === targetSessionKey ? params.update(current, now) : void 0);
		if (next?.targetSessionKey === targetSessionKey) updated.push(next);
	}
	return updated;
}
/** @deprecated Use the Async counterpart. Retained through the next Plugin SDK major. */
function setTelegramThreadBindingIdleTimeoutBySessionKey(params) {
	const idleTimeoutMs = normalizeDurationMs(params.idleTimeoutMs, 0);
	return updateTelegramBindingsSynchronously({
		...params,
		update: (entry, now) => ({
			...entry,
			idleTimeoutMs,
			lastActivityAt: now
		})
	});
}
/** @deprecated Use the Async counterpart. Retained through the next Plugin SDK major. */
function setTelegramThreadBindingMaxAgeBySessionKey(params) {
	const maxAgeMs = normalizeDurationMs(params.maxAgeMs, 0);
	return updateTelegramBindingsSynchronously({
		...params,
		update: (entry, now) => ({
			...entry,
			maxAgeMs,
			lastActivityAt: now
		})
	});
}
//#endregion
export { setTelegramThreadBindingMaxAgeBySessionKey as a, setTelegramThreadBindingIdleTimeoutBySessionKeyAsync as i, getTelegramThreadBindingManager as n, setTelegramThreadBindingMaxAgeBySessionKeyAsync as o, setTelegramThreadBindingIdleTimeoutBySessionKey as r, createTelegramThreadBindingManager as t };
