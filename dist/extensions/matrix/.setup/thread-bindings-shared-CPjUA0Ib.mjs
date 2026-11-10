import { projectThreadBindingRecord, resolveThreadBindingLifecycle, warnPluginSdkDeprecation } from "openclaw/plugin-sdk/thread-bindings-session-runtime";
//#region extensions/matrix/src/matrix/thread-bindings-shared.ts
const MANAGERS_BY_ACCOUNT_ID = /* @__PURE__ */ new Map();
const BINDINGS_BY_ACCOUNT_CONVERSATION = /* @__PURE__ */ new Map();
function resolveBindingKey(params) {
	return `${params.accountId}:${params.parentConversationId?.trim() || "-"}:${params.conversationId}`;
}
function toSessionBindingRecord(record, defaults) {
	const lifecycle = resolveThreadBindingLifecycle({
		record,
		defaultIdleTimeoutMs: defaults.idleTimeoutMs,
		defaultMaxAgeMs: defaults.maxAgeMs
	});
	const idleTimeoutMs = typeof record.idleTimeoutMs === "number" ? record.idleTimeoutMs : defaults.idleTimeoutMs;
	const maxAgeMs = typeof record.maxAgeMs === "number" ? record.maxAgeMs : defaults.maxAgeMs;
	return projectThreadBindingRecord(record, {
		conversation: {
			channel: "matrix",
			conversationId: record.conversationId,
			parentConversationId: record.parentConversationId
		},
		bindingId: resolveBindingKey(record),
		targetKind: record.targetKind === "subagent" ? "subagent" : "session",
		lifecycle: {
			...lifecycle,
			idleTimeoutMs,
			maxAgeMs
		}
	});
}
function setBindingRecord(record) {
	BINDINGS_BY_ACCOUNT_CONVERSATION.set(resolveBindingKey(record), record);
}
function removeBindingRecord(record) {
	const key = resolveBindingKey(record);
	const removed = BINDINGS_BY_ACCOUNT_CONVERSATION.get(key) ?? null;
	if (removed) BINDINGS_BY_ACCOUNT_CONVERSATION.delete(key);
	return removed;
}
function listBindingsForAccount(accountId) {
	return [...BINDINGS_BY_ACCOUNT_CONVERSATION.values()].filter((entry) => entry.accountId === accountId);
}
function listAllBindings() {
	return [...BINDINGS_BY_ACCOUNT_CONVERSATION.values()];
}
function getMatrixThreadBindingManagerEntry(accountId) {
	return MANAGERS_BY_ACCOUNT_ID.get(accountId) ?? null;
}
function setMatrixThreadBindingManagerEntry(accountId, entry) {
	MANAGERS_BY_ACCOUNT_ID.set(accountId, entry);
}
function deleteMatrixThreadBindingManagerEntry(accountId) {
	MANAGERS_BY_ACCOUNT_ID.delete(accountId);
}
function getMatrixThreadBindingManager(accountId) {
	return MANAGERS_BY_ACCOUNT_ID.get(accountId)?.manager ?? null;
}
function createMatrixThreadBindingTimeoutSetter(method, update) {
	return (params) => {
		warnPluginSdkDeprecation({
			pluginId: "matrix",
			family: "conversation-bindings",
			method,
			replacement: `await ${method}Async()`,
			compatibility: "Legacy methods return cached results synchronously and defer persistence."
		});
		const manager = MANAGERS_BY_ACCOUNT_ID.get(params.accountId)?.manager;
		if (!manager) return [];
		return update(manager, params).map((record) => toSessionBindingRecord(record, {
			idleTimeoutMs: manager.getIdleTimeoutMs(),
			maxAgeMs: manager.getMaxAgeMs()
		}));
	};
}
/** @deprecated Use setMatrixThreadBindingIdleTimeoutBySessionKeyAsync. Final compatibility day: 2026-12-31. */
const setMatrixThreadBindingIdleTimeoutBySessionKey = createMatrixThreadBindingTimeoutSetter("setMatrixThreadBindingIdleTimeoutBySessionKey", (manager, params) => manager.setIdleTimeoutBySessionKey(params));
/** @deprecated Use setMatrixThreadBindingMaxAgeBySessionKeyAsync. Final compatibility day: 2026-12-31. */
const setMatrixThreadBindingMaxAgeBySessionKey = createMatrixThreadBindingTimeoutSetter("setMatrixThreadBindingMaxAgeBySessionKey", (manager, params) => manager.setMaxAgeBySessionKey(params));
function createMatrixThreadBindingAsyncTimeoutSetter(update) {
	return async (params) => {
		const manager = MANAGERS_BY_ACCOUNT_ID.get(params.accountId)?.manager;
		if (!manager) return [];
		return (await update(manager, params)).map((record) => toSessionBindingRecord(record, {
			idleTimeoutMs: manager.getIdleTimeoutMs(),
			maxAgeMs: manager.getMaxAgeMs()
		}));
	};
}
const setMatrixThreadBindingIdleTimeoutBySessionKeyAsync = createMatrixThreadBindingAsyncTimeoutSetter((manager, params) => manager.setIdleTimeoutBySessionKeyAsync(params));
const setMatrixThreadBindingMaxAgeBySessionKeyAsync = createMatrixThreadBindingAsyncTimeoutSetter((manager, params) => manager.setMaxAgeBySessionKeyAsync(params));
//#endregion
export { listBindingsForAccount as a, setBindingRecord as c, setMatrixThreadBindingManagerEntry as d, setMatrixThreadBindingMaxAgeBySessionKey as f, listAllBindings as i, setMatrixThreadBindingIdleTimeoutBySessionKey as l, toSessionBindingRecord as m, getMatrixThreadBindingManager as n, removeBindingRecord as o, setMatrixThreadBindingMaxAgeBySessionKeyAsync as p, getMatrixThreadBindingManagerEntry as r, resolveBindingKey as s, deleteMatrixThreadBindingManagerEntry as t, setMatrixThreadBindingIdleTimeoutBySessionKeyAsync as u };
