import { A as normalizeSessionKeyPreservingOpaquePeerIds } from "./session-key-C09ow4h0.mjs";
import { a as normalizeOptionalAgentRuntimeId } from "./agent-runtime-id-BZLMe-UU.mjs";
import { t as normalizeSessionEntrySlotKey } from "./session-entry-slot-keys-sCRI4mq1.mjs";
//#region src/config/sessions/plugin-host-cleanup.ts
function collectPromotedSessionEntrySlotKeys(entry, pluginId, sessionEntrySlotKeys) {
	const slotKeys = /* @__PURE__ */ new Set();
	const storedSlotKeys = entry.pluginExtensionSlotKeys;
	const records = pluginId === void 0 ? Object.values(storedSlotKeys ?? {}) : storedSlotKeys?.[pluginId] ? [storedSlotKeys[pluginId]] : [];
	for (const record of records) for (const slotKey of Object.values(record)) {
		const normalized = normalizeSessionEntrySlotKey(slotKey);
		if (normalized.ok) slotKeys.add(normalized.key);
	}
	for (const slotKey of sessionEntrySlotKeys ?? []) slotKeys.add(slotKey);
	return slotKeys;
}
function clearPromotedSessionEntrySlots(entry, pluginId, sessionEntrySlotKeys, options = {}) {
	const slotKeys = options.includeStoredSlotKeys === false && sessionEntrySlotKeys ? new Set(sessionEntrySlotKeys) : collectPromotedSessionEntrySlotKeys(entry, pluginId, sessionEntrySlotKeys);
	for (const slotKey of slotKeys) Reflect.deleteProperty(entry, slotKey);
	if (!options.pruneSlotOwnership || !entry.pluginExtensionSlotKeys) return;
	for (const [ownerPluginId, record] of Object.entries(entry.pluginExtensionSlotKeys)) {
		if (pluginId && ownerPluginId !== pluginId) continue;
		for (const [namespace, slotKey] of Object.entries(record)) {
			const normalized = normalizeSessionEntrySlotKey(slotKey);
			if (normalized.ok && slotKeys.has(normalized.key)) delete record[namespace];
		}
		if (Object.keys(record).length === 0) delete entry.pluginExtensionSlotKeys[ownerPluginId];
	}
	if (Object.keys(entry.pluginExtensionSlotKeys).length === 0) delete entry.pluginExtensionSlotKeys;
}
/** Clears plugin-owned extension state from one session entry. */
function clearPluginOwnedSessionState(entry, pluginId, sessionEntrySlotKeys) {
	clearPromotedSessionEntrySlots(entry, pluginId, sessionEntrySlotKeys);
	for (const field of [
		"pluginExtensions",
		"pluginExtensionSlotKeys",
		"pluginNextTurnInjections"
	]) {
		const state = entry[field];
		if (!pluginId) delete entry[field];
		else if (state) {
			delete state[pluginId];
			if (Object.keys(state).length === 0) delete entry[field];
		}
	}
}
function hasPromotedSessionEntrySlot(entry, pluginId, sessionEntrySlotKeys) {
	const slotKeys = collectPromotedSessionEntrySlotKeys(entry, pluginId, sessionEntrySlotKeys);
	for (const slotKey of slotKeys) if (Object.hasOwn(entry, slotKey)) return true;
	return false;
}
function matchesPluginHostCleanupSession(entryKey, entry, sessionKey) {
	const normalizedSessionKey = normalizeSessionKeyPreservingOpaquePeerIds(sessionKey);
	if (!normalizedSessionKey) return true;
	return normalizeSessionKeyPreservingOpaquePeerIds(entryKey) === normalizedSessionKey || entry.sessionId.trim().toLowerCase() === sessionKey?.trim().toLowerCase();
}
function shouldSkipPluginHostCleanupStore(params) {
	if (!params.pluginId && !params.sessionKey) return true;
	return params.mode === "promoted-slots" && (params.sessionEntrySlotKeys?.size ?? 0) === 0;
}
function hasPluginHostCleanupTarget(entry, params) {
	return hasPromotedSessionEntrySlot(entry, params.pluginId, params.sessionEntrySlotKeys) || params.mode === "plugin-owned-state" && [
		entry.pluginExtensions,
		entry.pluginExtensionSlotKeys,
		entry.pluginNextTurnInjections
	].some((state) => Boolean(params.pluginId ? state?.[params.pluginId] : state));
}
function isLockedHarnessSessionOwnedByPlugin(entry, preserveLockedHarnessIds) {
	if (entry.modelSelectionLocked !== true || !preserveLockedHarnessIds?.size) return false;
	const harnessId = normalizeOptionalAgentRuntimeId(entry.agentHarnessId);
	return harnessId !== void 0 && preserveLockedHarnessIds.has(harnessId);
}
function clearPluginHostCleanupTarget(entry, params) {
	if (params.mode === "promoted-slots") {
		clearPromotedSessionEntrySlots(entry, params.pluginId, params.sessionEntrySlotKeys, {
			includeStoredSlotKeys: false,
			pruneSlotOwnership: true
		});
		return;
	}
	clearPluginOwnedSessionState(entry, params.pluginId, params.sessionEntrySlotKeys);
}
//#endregion
export { matchesPluginHostCleanupSession as a, isLockedHarnessSessionOwnedByPlugin as i, clearPluginOwnedSessionState as n, shouldSkipPluginHostCleanupStore as o, hasPluginHostCleanupTarget as r, clearPluginHostCleanupTarget as t };
