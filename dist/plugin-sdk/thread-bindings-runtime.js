import { i as resolveGlobalSingleton } from "../global-singleton-Dc_stLtU.mjs";
import { l as normalizeOptionalString } from "../string-coerce-CIXf7egm.mjs";
import "../session-key-CBvmC8zz.mjs";
import { n as normalizeAccountId } from "../account-id-B1bfbA5J.mjs";
import { _ as resolveSessionAgentId } from "../agent-scope-CTuYDtny.mjs";
import { r as normalizeConversationRef } from "../current-conversation-binding-row-De9sUoDf.mjs";
import { _ as updateCurrentConversationBindingRecord, a as registerSessionBindingAdapter, c as nativeSessionBindingSelection, d as inspectCurrentConversationBindingRecordAsync, f as listCurrentConversationBindingRecordsBySession, g as touchCurrentConversationBindingRecordAsync, h as resolveCurrentConversationBindingRecordAsync, l as deleteCurrentConversationBindingRecordsBySession, m as resolveCurrentConversationBindingRecord, p as readCurrentConversationBindingSelectionAsync, r as isSessionBindingAdapterCurrent, s as unregisterSessionBindingAdapter, u as inspectCurrentConversationBindingRecord, v as SessionBindingError } from "../session-binding-service-n2QTfkUE.mjs";
import { t as isPluginOwnedBindingMetadata } from "../conversation-binding-metadata-CFOhDjMh.mjs";
import { n as resolveThreadBindingLifecycle } from "../thread-binding-lifecycle-Cj9qM4Hm.mjs";
import { a as resolveThreadBindingIdleTimeoutMsForChannel, s as resolveThreadBindingMaxAgeMsForChannel } from "../thread-bindings-policy-BbWqcnDl.mjs";
import { n as resolveThreadBindingFarewellText } from "../thread-bindings-messages-Br2Pei4z.mjs";
import { t as resolveThreadBindingConversationIdFromBindingId } from "../thread-binding-id-BkjTVQEq.mjs";
//#region src/infra/outbound/account-scoped-conversation-bindings.ts
function getState(stateKey) {
	return resolveGlobalSingleton(stateKey, () => ({ managersByAccountId: /* @__PURE__ */ new Map() }));
}
function resolveBindingKey(accountId, conversationId) {
	return `${accountId}:${conversationId}`;
}
function toSessionBindingRecord(params) {
	const idleExpiresAt = params.idleTimeoutMs > 0 ? params.record.lastActivityAt + params.idleTimeoutMs : void 0;
	const maxAgeExpiresAt = params.maxAgeMs > 0 ? params.record.boundAt + params.maxAgeMs : void 0;
	const expiresAt = idleExpiresAt != null && maxAgeExpiresAt != null ? Math.min(idleExpiresAt, maxAgeExpiresAt) : idleExpiresAt ?? maxAgeExpiresAt;
	return {
		bindingId: resolveBindingKey(params.record.accountId, params.record.conversationId),
		targetSessionKey: params.record.targetSessionKey,
		targetKind: params.toSessionBindingTargetKind(params.record.targetKind),
		conversation: {
			channel: params.channel,
			accountId: params.record.accountId,
			conversationId: params.record.conversationId
		},
		status: "active",
		boundAt: params.record.boundAt,
		expiresAt,
		metadata: {
			...params.metadata,
			agentId: params.record.agentId,
			label: params.record.label,
			boundBy: params.record.boundBy,
			lastActivityAt: params.record.lastActivityAt,
			idleTimeoutMs: params.idleTimeoutMs,
			maxAgeMs: params.maxAgeMs
		}
	};
}
/** Creates a channel/account binding manager and registers it as a session-binding adapter. */
function createAccountScopedConversationBindingManager(params) {
	const accountId = normalizeAccountId(params.accountId);
	const state = getState(params.stateKey);
	const existingManager = state.managersByAccountId.get(accountId);
	if (existingManager) return existingManager;
	const idleTimeoutMs = resolveThreadBindingIdleTimeoutMsForChannel({
		cfg: params.cfg,
		channel: params.channel,
		accountId
	});
	const maxAgeMs = resolveThreadBindingMaxAgeMsForChannel({
		cfg: params.cfg,
		channel: params.channel,
		accountId
	});
	const asSessionBindingRecord = (record, metadata) => toSessionBindingRecord({
		channel: params.channel,
		record,
		idleTimeoutMs,
		maxAgeMs,
		toSessionBindingTargetKind: params.toSessionBindingTargetKind,
		metadata
	});
	const conversationRef = (conversationId) => normalizeConversationRef({
		channel: params.channel,
		accountId,
		conversationId
	});
	const asAccountBindingRecord = (record) => {
		const metadata = record.metadata;
		return {
			accountId,
			conversationId: record.conversation.conversationId,
			targetKind: params.toStoredTargetKind(record.targetKind),
			targetSessionKey: record.targetSessionKey,
			agentId: typeof metadata?.agentId === "string" ? metadata.agentId : void 0,
			label: typeof metadata?.label === "string" ? metadata.label : void 0,
			boundBy: typeof metadata?.boundBy === "string" ? metadata.boundBy : void 0,
			boundAt: record.boundAt,
			lastActivityAt: typeof metadata?.lastActivityAt === "number" ? metadata.lastActivityAt : record.boundAt
		};
	};
	const bindConversationRecord = (input) => {
		const normalizedConversationId = input.conversationId.trim();
		const normalizedTargetSessionKey = input.targetSessionKey.trim();
		if (!normalizedConversationId || !normalizedTargetSessionKey) return null;
		const now = Date.now();
		const { current } = updateCurrentConversationBindingRecord(conversationRef(normalizedConversationId), (existing) => {
			const previous = existing?.targetSessionKey === normalizedTargetSessionKey && existing.targetKind === input.targetKind ? existing : void 0;
			const existingLocal = previous ? asAccountBindingRecord(previous) : void 0;
			const metadata = {
				...previous?.metadata,
				...input.metadata
			};
			const record = {
				accountId,
				conversationId: normalizedConversationId,
				targetKind: params.toStoredTargetKind(input.targetKind),
				targetSessionKey: normalizedTargetSessionKey,
				agentId: normalizeOptionalString(input.metadata?.agentId) ?? existingLocal?.agentId ?? (isPluginOwnedBindingMetadata(metadata) ? void 0 : resolveSessionAgentId({
					config: params.cfg,
					sessionKey: normalizedTargetSessionKey
				})),
				label: normalizeOptionalString(input.metadata?.label) ?? existingLocal?.label,
				boundBy: normalizeOptionalString(input.metadata?.boundBy) ?? existingLocal?.boundBy,
				boundAt: now,
				lastActivityAt: now
			};
			return asSessionBindingRecord(record, metadata);
		});
		return current;
	};
	const assertCurrent = () => {
		if (state.managersByAccountId.get(accountId) !== manager || !isSessionBindingAdapterCurrent(sessionBindingAdapter)) throw new SessionBindingError("BINDING_ADAPTER_UNAVAILABLE", "Account conversation binding manager is no longer active", {
			channel: params.channel,
			accountId
		});
	};
	const matchesAccount = (ref) => {
		const normalized = normalizeConversationRef(ref);
		return normalized.channel === params.channel && normalized.accountId === accountId;
	};
	const prepareTouch = (conversationId, bindingId, at = Date.now()) => ({
		conversation: conversationRef(conversationId),
		bindingId,
		at,
		accountPolicy: {
			idleTimeoutMs,
			maxAgeMs,
			targetKinds: {
				subagent: params.toSessionBindingTargetKind(params.toStoredTargetKind("subagent")),
				session: params.toSessionBindingTargetKind(params.toStoredTargetKind("session"))
			}
		}
	});
	const accountScope = {
		channel: params.channel,
		accountId
	};
	const manager = {
		accountId,
		getByConversationId: (conversationId) => {
			const record = resolveCurrentConversationBindingRecord(conversationRef(conversationId));
			return record ? asAccountBindingRecord(record) : void 0;
		},
		listBySessionKey: (targetSessionKey) => listCurrentConversationBindingRecordsBySession(targetSessionKey, accountScope).map(asAccountBindingRecord),
		bindConversation: (input) => {
			const record = bindConversationRecord(input);
			return record ? asAccountBindingRecord(record) : null;
		},
		touchConversation: (conversationId, at = Date.now()) => {
			const { current } = updateCurrentConversationBindingRecord(conversationRef(conversationId), (existing) => {
				if (!existing) return null;
				const updated = {
					...asAccountBindingRecord(existing),
					lastActivityAt: at
				};
				return asSessionBindingRecord(updated, existing.metadata);
			});
			return current ? asAccountBindingRecord(current) : null;
		},
		unbindConversation: (conversationId) => {
			const { previous } = updateCurrentConversationBindingRecord(conversationRef(conversationId), () => null);
			return previous ? asAccountBindingRecord(previous) : null;
		},
		unbindBySessionKey: (targetSessionKey) => deleteCurrentConversationBindingRecordsBySession(targetSessionKey, accountScope).map(asAccountBindingRecord),
		stop: () => {
			if (state.managersByAccountId.get(accountId) === manager) state.managersByAccountId.delete(accountId);
			unregisterSessionBindingAdapter({
				channel: params.channel,
				accountId,
				adapter: sessionBindingAdapter
			});
		}
	};
	const sessionBindingAdapter = {
		channel: params.channel,
		accountId,
		capabilities: { placements: ["current"] },
		[nativeSessionBindingSelection]: async (refs) => {
			const conversations = refs.map((ref) => matchesAccount(ref) ? conversationRef(ref.conversationId) : null);
			assertCurrent();
			const records = await readCurrentConversationBindingSelectionAsync(conversations.filter((ref) => ref !== null), assertCurrent);
			assertCurrent();
			let index = 0;
			return conversations.map((ref) => ref ? records[index++] ?? null : null);
		},
		bind: async (input) => {
			if (input.conversation.channel !== params.channel || input.placement === "child") return null;
			return bindConversationRecord({
				conversationId: input.conversation.conversationId,
				targetKind: input.targetKind,
				targetSessionKey: input.targetSessionKey,
				metadata: input.metadata
			});
		},
		listBySession: (targetSessionKey) => listCurrentConversationBindingRecordsBySession(targetSessionKey, accountScope),
		resolveByConversation: (ref) => {
			if (ref.channel !== params.channel) return null;
			return resolveCurrentConversationBindingRecord(conversationRef(ref.conversationId));
		},
		inspectByConversation: (ref) => ref.channel === params.channel ? inspectCurrentConversationBindingRecord(conversationRef(ref.conversationId)) : null,
		inspectByConversationAsync: async (ref) => {
			if (!matchesAccount(ref)) return null;
			assertCurrent();
			const record = await inspectCurrentConversationBindingRecordAsync(conversationRef(ref.conversationId));
			assertCurrent();
			return record;
		},
		resolveByConversationAsync: async (ref) => {
			if (!matchesAccount(ref)) return null;
			const record = await resolveCurrentConversationBindingRecordAsync(conversationRef(ref.conversationId), assertCurrent);
			assertCurrent();
			return record;
		},
		touchAsync: async (bindingId, at) => {
			const conversationId = resolveThreadBindingConversationIdFromBindingId({
				accountId,
				bindingId
			});
			if (conversationId) await touchCurrentConversationBindingRecordAsync(prepareTouch(conversationId, bindingId, at), assertCurrent);
		},
		touch: (bindingId, at) => {
			const conversationId = resolveThreadBindingConversationIdFromBindingId({
				accountId,
				bindingId
			});
			if (conversationId) manager.touchConversation(conversationId, at);
		},
		unbind: async (input) => {
			if (input.targetSessionKey?.trim()) return deleteCurrentConversationBindingRecordsBySession(input.targetSessionKey.trim(), accountScope);
			const conversationId = resolveThreadBindingConversationIdFromBindingId({
				accountId,
				bindingId: input.bindingId
			});
			if (!conversationId) return [];
			const { previous } = updateCurrentConversationBindingRecord(conversationRef(conversationId), () => null);
			return previous ? [previous] : [];
		}
	};
	registerSessionBindingAdapter(sessionBindingAdapter);
	state.managersByAccountId.set(accountId, manager);
	return manager;
}
/** Stops registered account-scoped adapters for one test key without clearing durable bindings. */
function resetAccountScopedConversationBindingsForTests(params) {
	const state = getState(params.stateKey);
	for (const manager of state.managersByAccountId.values()) manager.stop();
	state.managersByAccountId.clear();
}
//#endregion
export { createAccountScopedConversationBindingManager, registerSessionBindingAdapter, resetAccountScopedConversationBindingsForTests, resolveThreadBindingConversationIdFromBindingId, resolveThreadBindingFarewellText, resolveThreadBindingIdleTimeoutMsForChannel, resolveThreadBindingLifecycle, resolveThreadBindingMaxAgeMsForChannel, unregisterSessionBindingAdapter };
