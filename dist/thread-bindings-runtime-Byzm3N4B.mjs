import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { a as resolveGlobalSingleton } from "./global-singleton-DrXvEBww.mjs";
import "./session-key-CSDERtm3.mjs";
import { n as normalizeAccountId } from "./account-id-ifCOO7_9.mjs";
import { t as warnPluginSdkDeprecation } from "./sdk-deprecation-DjTmOhOX.mjs";
import { h as resolveSessionAgentId } from "./agent-scope-DXrnO3F4.mjs";
import { g as currentConversationBindingPublication, m as SessionBindingError, n as applyCurrentConversationBindingBind, x as normalizeConversationRef } from "./current-conversation-bindings.kernel-CQnqjy0h.mjs";
import { C as touchCurrentConversationBindingRecordAsync, D as nativeSessionBindingListBySessions, E as nativeSessionBindingInspection, O as nativeSessionBindingSelection, S as resolveCurrentConversationBindingRecordAsync, T as expectedCurrentSessionBinding, _ as listCurrentConversationBindingRecordsBySession, b as removeCurrentConversationBindingsAsync, f as unregisterSessionBindingAdapter, g as inspectCurrentConversationBindingRecordAsync, h as inspectCurrentConversationBindingRecord, i as isSessionBindingAdapterCurrent, m as deleteCurrentConversationBindingRecordsBySession, p as bindCurrentConversationRecordAsync, u as registerSessionBindingAdapterV2, v as listCurrentConversationBindingRecordsBySessionsAsync, w as updateCurrentConversationBindingRecord, x as resolveCurrentConversationBindingRecord, y as readCurrentConversationBindingSelectionAsync } from "./session-binding-service-ByKk9LiJ.mjs";
import { a as resolveThreadBindingIdleTimeoutMsForChannel, s as resolveThreadBindingMaxAgeMsForChannel } from "./thread-bindings-policy-Hq7cocye.mjs";
import "./thread-bindings-messages-BiGDDOIC.mjs";
import { t as resolveThreadBindingConversationIdFromBindingId } from "./thread-binding-id-B9JLnrQ9.mjs";
import { n as projectThreadBindingRecord } from "./session-binding-adapter-DJi1Wjt6.mjs";
//#region src/infra/outbound/account-scoped-conversation-bindings.ts
function getState(stateKey) {
	return resolveGlobalSingleton(stateKey, () => ({ managersByAccountId: /* @__PURE__ */ new Map() }));
}
/** @deprecated Use createAccountScopedConversationBindingManagerV2; final compatibility day: 2026-12-31. */
function createAccountScopedConversationBindingManager(params) {
	const owner = createAccountBindingManager(params);
	if (owner.legacy) return owner.legacy;
	const { accountId, accountScope, conversationRef, asAccountBindingRecord, prepareBind } = owner.preparation;
	const legacy = {
		accountId,
		getByConversationId: (conversationId) => {
			warnPluginSdkDeprecation({
				family: "conversation-bindings",
				method: "AccountScopedConversationBindingManager.getByConversationId",
				replacement: "AccountScopedConversationBindingManagerV2.getByConversationIdAsync",
				compatibility: "Synchronous binding operations retain commit-before-return compatibility."
			});
			const record = resolveCurrentConversationBindingRecord(conversationRef(conversationId));
			return record ? asAccountBindingRecord(record) : void 0;
		},
		listBySessionKey: (targetSessionKey) => {
			warnPluginSdkDeprecation({
				family: "conversation-bindings",
				method: "AccountScopedConversationBindingManager.listBySessionKey",
				replacement: "AccountScopedConversationBindingManagerV2.listBySessionKeyAsync",
				compatibility: "Synchronous binding operations retain commit-before-return compatibility."
			});
			return listCurrentConversationBindingRecordsBySession(targetSessionKey, accountScope).map(asAccountBindingRecord);
		},
		bindConversation: (input) => {
			warnPluginSdkDeprecation({
				family: "conversation-bindings",
				method: "AccountScopedConversationBindingManager.bindConversation",
				replacement: "AccountScopedConversationBindingManagerV2.bindConversationAsync",
				compatibility: "Synchronous binding operations retain commit-before-return compatibility."
			});
			const prepared = prepareBind(input);
			const record = prepared ? updateCurrentConversationBindingRecord(prepared.record.conversation, (current) => applyCurrentConversationBindingBind(current, prepared, (requiresAgentId) => {
				if (requiresAgentId) prepared.assertAgentResolved?.();
			})).current : null;
			return record ? asAccountBindingRecord(record) : null;
		},
		touchConversation: (conversationId, at = Date.now()) => {
			warnPluginSdkDeprecation({
				family: "conversation-bindings",
				method: "AccountScopedConversationBindingManager.touchConversation",
				replacement: "AccountScopedConversationBindingManagerV2.touchConversationAsync",
				compatibility: "Synchronous binding operations retain commit-before-return compatibility."
			});
			return touchAccountBindingConversation(owner.preparation, conversationId, at);
		},
		unbindConversation: (conversationId) => {
			warnPluginSdkDeprecation({
				family: "conversation-bindings",
				method: "AccountScopedConversationBindingManager.unbindConversation",
				replacement: "AccountScopedConversationBindingManagerV2.unbindConversationAsync",
				compatibility: "Synchronous binding operations retain commit-before-return compatibility."
			});
			const { previous } = updateCurrentConversationBindingRecord(conversationRef(conversationId), () => null);
			return previous ? asAccountBindingRecord(previous) : null;
		},
		unbindBySessionKey: (targetSessionKey) => {
			warnPluginSdkDeprecation({
				family: "conversation-bindings",
				method: "AccountScopedConversationBindingManager.unbindBySessionKey",
				replacement: "AccountScopedConversationBindingManagerV2.unbindBySessionKeyAsync",
				compatibility: "Synchronous binding operations retain commit-before-return compatibility."
			});
			return deleteCurrentConversationBindingRecordsBySession(targetSessionKey, accountScope).map(asAccountBindingRecord);
		},
		stop: owner.manager.stop
	};
	owner.legacy = legacy;
	return legacy;
}
/** Creates the worker-owned manager and registers its required async adapter. */
function createAccountScopedConversationBindingManagerV2(params) {
	return createAccountBindingManager(params).manager;
}
function prepareAccountBindingManager(params) {
	const accountId = normalizeAccountId(params.accountId);
	const accountScope = {
		channel: params.channel,
		accountId
	};
	const policyScope = {
		cfg: params.cfg,
		...accountScope
	};
	const idleTimeoutMs = resolveThreadBindingIdleTimeoutMsForChannel(policyScope);
	const maxAgeMs = resolveThreadBindingMaxAgeMsForChannel(policyScope);
	const asSessionBindingRecord = (record, metadata) => {
		const idleExpiresAt = idleTimeoutMs > 0 ? record.lastActivityAt + idleTimeoutMs : void 0;
		const maxAgeExpiresAt = maxAgeMs > 0 ? record.boundAt + maxAgeMs : void 0;
		const expiresAt = idleExpiresAt != null && maxAgeExpiresAt != null ? Math.min(idleExpiresAt, maxAgeExpiresAt) : idleExpiresAt ?? maxAgeExpiresAt;
		return projectThreadBindingRecord(record, {
			conversation: {
				channel: params.channel,
				conversationId: record.conversationId
			},
			targetKind: params.toSessionBindingTargetKind(record.targetKind),
			lifecycle: {
				expiresAt,
				idleTimeoutMs,
				maxAgeMs
			},
			metadata: (lifecycleMetadata) => ({
				...metadata,
				...lifecycleMetadata
			})
		});
	};
	const conversationRef = (conversationId) => normalizeConversationRef({
		...accountScope,
		conversationId
	});
	const conversationIdFromBinding = (bindingId) => resolveThreadBindingConversationIdFromBindingId({
		accountId,
		bindingId
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
	const prepareBind = (input) => {
		const conversationId = input.conversationId.trim();
		const targetSessionKey = input.targetSessionKey.trim();
		if (!conversationId || !targetSessionKey) return null;
		const now = Date.now();
		let inferredAgentId;
		let assertAgentResolved;
		try {
			inferredAgentId = resolveSessionAgentId({
				config: params.cfg,
				sessionKey: targetSessionKey
			});
		} catch (error) {
			assertAgentResolved = () => {
				throw error;
			};
		}
		return {
			assertAgentResolved,
			record: asSessionBindingRecord({
				accountId,
				conversationId,
				targetKind: params.toStoredTargetKind(input.targetKind),
				targetSessionKey,
				agentId: normalizeOptionalString(input.metadata?.agentId),
				label: normalizeOptionalString(input.metadata?.label),
				boundBy: normalizeOptionalString(input.metadata?.boundBy),
				boundAt: now,
				lastActivityAt: now
			}, input.metadata),
			accountPolicy: { inferredAgentId }
		};
	};
	return {
		accountId,
		accountScope,
		idleTimeoutMs,
		maxAgeMs,
		asSessionBindingRecord,
		asAccountBindingRecord,
		conversationRef,
		conversationIdFromBinding,
		prepareBind
	};
}
function touchAccountBindingConversation(preparation, conversationId, at) {
	const { conversationRef, asAccountBindingRecord, asSessionBindingRecord } = preparation;
	const { current } = updateCurrentConversationBindingRecord(conversationRef(conversationId), (existing) => {
		if (!existing) return null;
		const updated = {
			...asAccountBindingRecord(existing),
			lastActivityAt: at
		};
		return asSessionBindingRecord(updated, existing.metadata);
	});
	return current ? asAccountBindingRecord(current) : null;
}
function createAccountBindingManager(params) {
	const accountId = normalizeAccountId(params.accountId);
	const state = getState(params.stateKey);
	const existingManager = state.managersByAccountId.get(accountId);
	if (existingManager) return existingManager;
	const preparation = prepareAccountBindingManager(params);
	const { accountScope, idleTimeoutMs, maxAgeMs, asAccountBindingRecord, conversationRef, conversationIdFromBinding, prepareBind } = preparation;
	const assertCurrent = () => {
		if (state.managersByAccountId.get(accountId)?.manager !== manager || !isSessionBindingAdapterCurrent(sessionBindingAdapter)) throw new SessionBindingError("BINDING_ADAPTER_UNAVAILABLE", "Account conversation binding manager is no longer active", {
			channel: params.channel,
			accountId
		});
	};
	const matchesAccount = (ref) => {
		const normalized = normalizeConversationRef(ref);
		return normalized.channel === params.channel && normalized.accountId === accountId;
	};
	const readAccountBindingAsync = async (ref, inspect) => {
		if (!matchesAccount(ref)) return null;
		if (inspect) assertCurrent();
		const record = inspect ? await inspectCurrentConversationBindingRecordAsync(conversationRef(ref.conversationId)) : await resolveCurrentConversationBindingRecordAsync(conversationRef(ref.conversationId), assertCurrent);
		assertCurrent();
		return record;
	};
	let publicationRevision = 0;
	const unsubscribePublication = currentConversationBindingPublication.subscribeFacts(() => {
		publicationRevision++;
	});
	const manager = {
		getByConversationIdAsync: async (conversationId) => {
			const record = await readAccountBindingAsync(conversationRef(conversationId), false);
			return record ? asAccountBindingRecord(record) : void 0;
		},
		listBySessionKeyAsync: async (targetSessionKey) => (await sessionBindingAdapter.listBySessionAsync(targetSessionKey)).map(asAccountBindingRecord),
		bindConversationAsync: async (input) => {
			const record = await sessionBindingAdapter.bind({
				...input,
				conversation: conversationRef(input.conversationId)
			});
			return record ? asAccountBindingRecord(record) : null;
		},
		touchConversationAsync: async (conversationId, at = Date.now()) => {
			const conversation = conversationRef(conversationId);
			const record = await touchCurrentConversationBindingRecordAsync({
				conversation,
				bindingId: `${accountId}:${conversation.conversationId}`,
				at,
				accountPolicy: {
					idleTimeoutMs,
					maxAgeMs,
					targetKinds: {
						subagent: params.toSessionBindingTargetKind(params.toStoredTargetKind("subagent")),
						session: params.toSessionBindingTargetKind(params.toStoredTargetKind("session"))
					}
				}
			}, assertCurrent);
			return record ? asAccountBindingRecord(record) : null;
		},
		unbindConversationAsync: async (conversationId) => {
			const [record] = await removeCurrentConversationBindingsAsync({ conversation: conversationRef(conversationId) }, assertCurrent);
			return record ? asAccountBindingRecord(record) : null;
		},
		unbindBySessionKeyAsync: async (targetSessionKey) => (await removeCurrentConversationBindingsAsync({
			targetSessionKey,
			scope: accountScope,
			genericOnly: false
		}, assertCurrent)).map(asAccountBindingRecord),
		accountId,
		stop: () => {
			unsubscribePublication();
			if (state.managersByAccountId.get(accountId)?.manager === manager) state.managersByAccountId.delete(accountId);
			unregisterSessionBindingAdapter({
				...accountScope,
				adapter: sessionBindingAdapter
			});
		}
	};
	const sessionBindingAdapter = {
		version: 2,
		inspectByConversationsAsync: async (refs) => {
			const revision = publicationRevision;
			const assertSnapshotCurrent = () => {
				assertCurrent();
				if (revision !== publicationRevision) throw new Error("Conversation binding publication changed during selection");
			};
			const conversations = refs.map((ref) => matchesAccount(ref) ? conversationRef(ref.conversationId) : null);
			const records = await readCurrentConversationBindingSelectionAsync(conversations.filter((ref) => ref !== null), assertSnapshotCurrent);
			let index = 0;
			return {
				bindings: conversations.map((ref) => ref ? records[index++] ?? null : null),
				assertCurrent: assertSnapshotCurrent
			};
		},
		assertCurrent,
		listBySessionAsync: async (targetSessionKey) => (await listCurrentConversationBindingRecordsBySessionsAsync([targetSessionKey], accountScope, assertCurrent))[0] ?? [],
		channel: params.channel,
		accountId,
		capabilities: { placements: ["current"] },
		/** @deprecated Use listBySessionAsync; final compatibility day: 2026-12-31. */
		listBySession: (targetSessionKey) => {
			warnPluginSdkDeprecation({
				family: "conversation-bindings",
				method: "SessionBindingAdapter.listBySession",
				replacement: "SessionBindingAdapterV2.listBySessionAsync"
			});
			return listCurrentConversationBindingRecordsBySession(targetSessionKey, accountScope);
		},
		/** @deprecated Use resolveByConversationAsync; final compatibility day: 2026-12-31. */
		resolveByConversation: (ref) => {
			warnPluginSdkDeprecation({
				family: "conversation-bindings",
				method: "SessionBindingAdapter.resolveByConversation",
				replacement: "SessionBindingAdapterV2.resolveByConversationAsync"
			});
			return ref.channel === params.channel ? resolveCurrentConversationBindingRecord(conversationRef(ref.conversationId)) : null;
		},
		/** @deprecated Use touchAsync; final compatibility day: 2026-12-31. */
		touch: (bindingId, at) => {
			warnPluginSdkDeprecation({
				family: "conversation-bindings",
				method: "SessionBindingAdapter.touch",
				replacement: "SessionBindingAdapterV2.touchAsync"
			});
			const conversationId = conversationIdFromBinding(bindingId);
			if (conversationId) touchAccountBindingConversation(preparation, conversationId, at ?? Date.now());
		},
		bind: async (input) => {
			if (input.conversation.channel !== params.channel || input.placement === "child") return null;
			const prepared = prepareBind({
				conversationId: input.conversation.conversationId,
				targetKind: input.targetKind,
				targetSessionKey: input.targetSessionKey,
				metadata: input.metadata
			});
			return prepared ? bindCurrentConversationRecordAsync({
				...prepared,
				expected: input[expectedCurrentSessionBinding]
			}, () => {
				assertCurrent();
				input.assertCurrent?.();
			}, prepared.assertAgentResolved) : null;
		},
		unbind: async (input) => {
			if (input.targetSessionKey?.trim()) return removeCurrentConversationBindingsAsync({
				targetSessionKey: input.targetSessionKey.trim(),
				scope: accountScope,
				genericOnly: false
			}, assertCurrent);
			const conversationId = conversationIdFromBinding(input.bindingId);
			return conversationId ? removeCurrentConversationBindingsAsync({
				conversation: conversationRef(conversationId),
				expected: input[expectedCurrentSessionBinding]
			}, assertCurrent) : [];
		},
		[nativeSessionBindingInspection]: {
			capture: (ref) => matchesAccount(ref) ? conversationRef(ref.conversationId) : null,
			assertCurrent
		},
		[nativeSessionBindingSelection]: async (refs) => {
			const conversations = refs.map((ref) => matchesAccount(ref) ? conversationRef(ref.conversationId) : null);
			assertCurrent();
			const records = await readCurrentConversationBindingSelectionAsync(conversations.filter((ref) => ref !== null), assertCurrent);
			assertCurrent();
			let index = 0;
			return conversations.map((ref) => ref ? records[index++] ?? null : null);
		},
		[nativeSessionBindingListBySessions]: (targetSessionKeys, context) => listCurrentConversationBindingRecordsBySessionsAsync(targetSessionKeys, accountScope, assertCurrent, context),
		/** @deprecated Use inspectByConversationAsync; final compatibility day: 2026-12-31. */
		inspectByConversation: (ref) => {
			warnPluginSdkDeprecation({
				family: "conversation-bindings",
				method: "SessionBindingAdapter.inspectByConversation",
				replacement: "SessionBindingAdapterV2.inspectByConversationAsync"
			});
			return ref.channel === params.channel ? inspectCurrentConversationBindingRecord(conversationRef(ref.conversationId)) : null;
		},
		inspectByConversationAsync: (ref) => readAccountBindingAsync(ref, true),
		resolveByConversationAsync: (ref) => readAccountBindingAsync(ref, false),
		touchAsync: async (bindingId, at) => {
			const conversationId = conversationIdFromBinding(bindingId);
			if (conversationId) await manager.touchConversationAsync(conversationId, at);
		}
	};
	registerSessionBindingAdapterV2(sessionBindingAdapter);
	const owner = {
		manager,
		preparation
	};
	state.managersByAccountId.set(accountId, owner);
	return owner;
}
/** Stops registered account-scoped adapters for one test key without clearing durable bindings. */
function resetAccountScopedConversationBindingsForTests(params) {
	const state = getState(params.stateKey);
	for (const { manager } of state.managersByAccountId.values()) manager.stop();
	state.managersByAccountId.clear();
}
//#endregion
export { createAccountScopedConversationBindingManagerV2 as n, resetAccountScopedConversationBindingsForTests as r, createAccountScopedConversationBindingManager as t };
