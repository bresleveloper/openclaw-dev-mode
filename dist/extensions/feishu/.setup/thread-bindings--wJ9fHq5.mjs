import { resolveSessionAgentIdStrict } from "openclaw/plugin-sdk/agent-scope-runtime";
import { registerSessionBindingAdapter, resolveThreadBindingConversationIdFromBindingId, resolveThreadBindingIdleTimeoutMsForChannel, resolveThreadBindingMaxAgeMsForChannel, unregisterSessionBindingAdapter } from "openclaw/plugin-sdk/conversation-runtime";
import { isFutureDateTimestampMs } from "openclaw/plugin-sdk/number-runtime";
import { normalizeOptionalString } from "openclaw/plugin-sdk/string-coerce-runtime";
import { normalizeAccountId } from "openclaw/plugin-sdk/routing";
import { isPluginOwnedSessionBindingRecord } from "openclaw/plugin-sdk/conversation-binding-runtime";
import { resolveGlobalSingleton } from "openclaw/plugin-sdk/global-singleton";
//#region extensions/feishu/src/thread-bindings.ts
const FEISHU_THREAD_BINDINGS_STATE_KEY = Symbol.for("openclaw.feishuThreadBindingsState");
let state;
function getState() {
	return state ??= resolveGlobalSingleton(FEISHU_THREAD_BINDINGS_STATE_KEY, () => ({
		managersByAccountId: /* @__PURE__ */ new Map(),
		bindingsByAccountConversation: /* @__PURE__ */ new Map()
	}));
}
function resolveBindingKey(params) {
	return `${params.accountId}:${params.conversationId}`;
}
function toSessionBindingRecord(record, defaults) {
	const idleExpiresAt = defaults.idleTimeoutMs > 0 ? record.lastActivityAt + defaults.idleTimeoutMs : void 0;
	const maxAgeExpiresAt = defaults.maxAgeMs > 0 ? record.boundAt + defaults.maxAgeMs : void 0;
	const expiresAt = idleExpiresAt != null && maxAgeExpiresAt != null ? Math.min(idleExpiresAt, maxAgeExpiresAt) : idleExpiresAt ?? maxAgeExpiresAt;
	return {
		bindingId: resolveBindingKey(record),
		targetSessionKey: record.targetSessionKey,
		targetKind: record.targetKind === "subagent" ? "subagent" : "session",
		conversation: {
			channel: "feishu",
			accountId: record.accountId,
			conversationId: record.conversationId,
			parentConversationId: record.parentConversationId
		},
		status: "active",
		boundAt: record.boundAt,
		expiresAt,
		metadata: {
			...record.metadata,
			agentId: record.agentId,
			label: record.label,
			boundBy: record.boundBy,
			deliveryTo: record.deliveryTo,
			deliveryThreadId: record.deliveryThreadId,
			lastActivityAt: record.lastActivityAt,
			idleTimeoutMs: defaults.idleTimeoutMs,
			maxAgeMs: defaults.maxAgeMs
		}
	};
}
function createFeishuThreadBindingManager(params) {
	const accountId = normalizeAccountId(params.accountId);
	const { managersByAccountId, bindingsByAccountConversation } = getState();
	const bindingTimeouts = {
		idleTimeoutMs: resolveThreadBindingIdleTimeoutMsForChannel({
			cfg: params.cfg,
			channel: "feishu",
			accountId
		}),
		maxAgeMs: resolveThreadBindingMaxAgeMsForChannel({
			cfg: params.cfg,
			channel: "feishu",
			accountId
		})
	};
	const resolveActiveBinding = (record, now = Date.now()) => {
		if (!record) return;
		const { expiresAt } = toSessionBindingRecord(record, bindingTimeouts);
		if (expiresAt === void 0 || isFutureDateTimestampMs(expiresAt, { nowMs: now })) return record;
		bindingsByAccountConversation.delete(resolveBindingKey({
			accountId,
			conversationId: record.conversationId
		}));
	};
	const manager = {
		accountId,
		getByConversationId: (conversationId) => resolveActiveBinding(bindingsByAccountConversation.get(resolveBindingKey({
			accountId,
			conversationId
		}))),
		listBySessionKey: (targetSessionKey) => {
			const now = Date.now();
			return [...bindingsByAccountConversation.values()].filter((record) => record.accountId === accountId && record.targetSessionKey === targetSessionKey && resolveActiveBinding(record, now) !== void 0);
		},
		bindConversation: ({ conversationId, parentConversationId, targetKind, targetSessionKey, metadata }) => {
			const normalizedConversationId = conversationId.trim();
			const normalizedTargetSessionKey = targetSessionKey.trim();
			if (!normalizedConversationId || !normalizedTargetSessionKey) return null;
			const existingLocal = manager.getByConversationId(normalizedConversationId);
			const storedTargetKind = targetKind === "subagent" ? "subagent" : "acp";
			const previous = existingLocal?.targetSessionKey === normalizedTargetSessionKey && existingLocal.targetKind === storedTargetKind ? existingLocal : void 0;
			const targetMetadata = {
				...previous?.metadata,
				...metadata
			};
			const now = Date.now();
			const record = {
				accountId,
				conversationId: normalizedConversationId,
				parentConversationId: normalizeOptionalString(parentConversationId) ?? existingLocal?.parentConversationId,
				deliveryTo: normalizeOptionalString(metadata?.deliveryTo) ?? existingLocal?.deliveryTo,
				deliveryThreadId: normalizeOptionalString(metadata?.deliveryThreadId) ?? existingLocal?.deliveryThreadId,
				targetKind: storedTargetKind,
				targetSessionKey: normalizedTargetSessionKey,
				agentId: normalizeOptionalString(metadata?.agentId) ?? previous?.agentId ?? (isPluginOwnedSessionBindingRecord({ metadata: targetMetadata }) ? void 0 : resolveSessionAgentIdStrict({
					config: params.cfg,
					sessionKey: normalizedTargetSessionKey
				})),
				label: normalizeOptionalString(metadata?.label) ?? previous?.label,
				boundBy: normalizeOptionalString(metadata?.boundBy) ?? previous?.boundBy,
				boundAt: now,
				lastActivityAt: now,
				metadata: targetMetadata
			};
			bindingsByAccountConversation.set(resolveBindingKey(record), record);
			return record;
		},
		touchConversation: (conversationId, at = Date.now()) => {
			const key = resolveBindingKey({
				accountId,
				conversationId
			});
			const existingRecord = manager.getByConversationId(conversationId);
			if (!existingRecord) return null;
			const updated = {
				...existingRecord,
				lastActivityAt: at
			};
			bindingsByAccountConversation.set(key, updated);
			return updated;
		},
		unbindConversation: (conversationId) => {
			const key = resolveBindingKey({
				accountId,
				conversationId
			});
			const existingRecord = bindingsByAccountConversation.get(key);
			if (!existingRecord) return null;
			bindingsByAccountConversation.delete(key);
			return existingRecord;
		},
		unbindBySessionKey: (targetSessionKey) => {
			const removed = [];
			for (const record of bindingsByAccountConversation.values()) {
				if (record.accountId !== accountId || record.targetSessionKey !== targetSessionKey) continue;
				bindingsByAccountConversation.delete(resolveBindingKey(record));
				removed.push(record);
			}
			return removed;
		},
		stop: () => {
			if (managersByAccountId.get(accountId) === manager) {
				for (const key of bindingsByAccountConversation.keys()) if (key.startsWith(`${accountId}:`)) bindingsByAccountConversation.delete(key);
				managersByAccountId.delete(accountId);
			}
			unregisterSessionBindingAdapter({
				channel: "feishu",
				accountId,
				adapter: sessionBindingAdapter
			});
		}
	};
	const sessionBindingAdapter = {
		channel: "feishu",
		accountId,
		capabilities: { placements: ["current"] },
		bind: async (input) => {
			if (input.conversation.channel !== "feishu" || input.placement === "child") return null;
			const bound = manager.bindConversation({
				conversationId: input.conversation.conversationId,
				parentConversationId: input.conversation.parentConversationId,
				targetKind: input.targetKind,
				targetSessionKey: input.targetSessionKey,
				metadata: input.metadata
			});
			return bound ? toSessionBindingRecord(bound, bindingTimeouts) : null;
		},
		listBySession: (targetSessionKey) => manager.listBySessionKey(targetSessionKey).map((entry) => toSessionBindingRecord(entry, bindingTimeouts)),
		resolveByConversation: (ref) => {
			if (ref.channel !== "feishu") return null;
			const found = manager.getByConversationId(ref.conversationId);
			return found ? toSessionBindingRecord(found, bindingTimeouts) : null;
		},
		touch: (bindingId, at) => {
			const conversationId = resolveThreadBindingConversationIdFromBindingId({
				accountId,
				bindingId
			});
			if (conversationId) manager.touchConversation(conversationId, at);
		},
		unbind: async (input) => {
			if (input.targetSessionKey?.trim()) return manager.unbindBySessionKey(input.targetSessionKey.trim()).map((entry) => toSessionBindingRecord(entry, bindingTimeouts));
			const conversationId = resolveThreadBindingConversationIdFromBindingId({
				accountId,
				bindingId: input.bindingId
			});
			if (!conversationId) return [];
			const removed = manager.unbindConversation(conversationId);
			return removed ? [toSessionBindingRecord(removed, bindingTimeouts)] : [];
		}
	};
	registerSessionBindingAdapter(sessionBindingAdapter);
	managersByAccountId.set(accountId, manager);
	return manager;
}
function getFeishuThreadBindingManager(accountId) {
	return getState().managersByAccountId.get(normalizeAccountId(accountId)) ?? null;
}
//#endregion
export { getFeishuThreadBindingManager as n, createFeishuThreadBindingManager as t };
