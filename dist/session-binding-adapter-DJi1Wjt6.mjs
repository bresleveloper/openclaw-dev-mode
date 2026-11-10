import { t as warnPluginSdkDeprecation } from "./sdk-deprecation-DjTmOhOX.mjs";
import { t as resolveThreadBindingConversationIdFromBindingId } from "./thread-binding-id-B9JLnrQ9.mjs";
//#region src/infra/outbound/session-binding-adapter.ts
/** Projects plugin-owned lifecycle facts without normalizing its identity or expiry policy. */
function projectThreadBindingRecord(record, params) {
	const { channel, ...conversation } = params.conversation;
	const metadata = {
		agentId: record.agentId,
		label: record.label,
		boundBy: record.boundBy,
		lastActivityAt: record.lastActivityAt,
		idleTimeoutMs: params.lifecycle.idleTimeoutMs,
		maxAgeMs: params.lifecycle.maxAgeMs
	};
	return {
		bindingId: params.bindingId ?? `${record.accountId}:${params.conversation.conversationId}`,
		targetSessionKey: record.targetSessionKey,
		targetKind: params.targetKind,
		conversation: {
			channel,
			accountId: record.accountId,
			...conversation
		},
		status: "active",
		boundAt: record.boundAt,
		expiresAt: params.lifecycle.expiresAt,
		metadata: params.metadata ? params.metadata(metadata) : metadata
	};
}
/** Internal synchronous projections still consumed by the core binding service. */
function createAccountScopedBindingAdapter(params) {
	const touchAsync = params.touchConversationAsync;
	const conversationIdFromBinding = (bindingId) => resolveThreadBindingConversationIdFromBindingId({
		accountId: params.accountId,
		bindingId
	});
	return {
		channel: params.channel,
		accountId: params.accountId,
		capabilities: params.capabilities,
		bind: params.bind,
		listBySession: (sessionKey) => {
			warnPluginSdkDeprecation({
				family: "conversation-bindings",
				method: "SessionBindingAdapter.listBySession",
				replacement: "SessionBindingAdapterV2.listBySessionAsync"
			});
			return params.listBySessionKey(sessionKey).map(params.project);
		},
		resolveByConversation: (ref) => {
			warnPluginSdkDeprecation({
				family: "conversation-bindings",
				method: "SessionBindingAdapter.resolveByConversation",
				replacement: "SessionBindingAdapterV2.resolveByConversationAsync"
			});
			const record = ref.channel === params.channel ? params.getByConversation(ref) : null;
			return record ? params.project(record) : null;
		},
		touch: (bindingId, at) => {
			warnPluginSdkDeprecation({
				family: "conversation-bindings",
				method: "SessionBindingAdapter.touch",
				replacement: "SessionBindingAdapterV2.touchAsync"
			});
			const conversationId = conversationIdFromBinding(bindingId);
			if (conversationId) params.touchConversation(conversationId, at);
		},
		...touchAsync ? { touchAsync: async (bindingId, at) => {
			const conversationId = conversationIdFromBinding(bindingId);
			if (conversationId) await touchAsync(conversationId, at);
		} } : {},
		unbind: async (input) => {
			if (input.targetSessionKey?.trim()) return (await params.unbindBySessionKey(input.targetSessionKey, input.reason)).map(params.project);
			const conversationId = conversationIdFromBinding(input.bindingId);
			const removed = conversationId ? await params.unbindConversation(conversationId, input.reason) : null;
			return removed ? [params.project(removed)] : [];
		}
	};
}
/** Keeps worker operations and legacy synchronous compatibility views on the same owner. */
function createAccountScopedBindingAdapterV2(params) {
	const project = async (ref, read) => {
		params.assertCurrent();
		const record = ref.channel === params.channel ? await read(ref) : null;
		params.assertCurrent();
		return record ? params.project(record) : null;
	};
	return {
		...createAccountScopedBindingAdapter(params),
		version: 2,
		inspectByConversationsAsync: async (refs) => {
			params.assertCurrent();
			const snapshot = params.inspectByConversations(refs);
			return {
				bindings: snapshot.records.map((record) => record ? params.project(record) : null),
				assertCurrent: () => {
					params.assertCurrent();
					snapshot.assertCurrent();
				}
			};
		},
		touchAsync: async (bindingId, at) => {
			params.assertCurrent();
			const conversationId = resolveThreadBindingConversationIdFromBindingId({
				accountId: params.accountId,
				bindingId
			});
			if (conversationId) await params.touchConversationAsync(conversationId, at);
			params.assertCurrent();
		},
		assertCurrent: params.assertCurrent,
		listBySessionAsync: async (sessionKey) => {
			params.assertCurrent();
			const records = await params.listBySessionKeyAsync(sessionKey);
			params.assertCurrent();
			return records.map(params.project);
		},
		resolveByConversationAsync: (ref) => project(ref, params.getByConversationAsync),
		inspectByConversationAsync: (ref) => project(ref, params.inspectByConversationAsync)
	};
}
//#endregion
export { projectThreadBindingRecord as n, createAccountScopedBindingAdapterV2 as t };
