import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { A as parseAgentSessionKey } from "./session-key-CBvmC8zz.mjs";
import { a as normalizeOptionalAgentRuntimeId } from "./agent-runtime-id-9mBje111.mjs";
//#region src/sessions/agent-harness-session-key.ts
const AGENT_HARNESS_SESSION_KEY_PREFIX = "harness:";
const AGENT_HARNESS_SESSION_KEY_RESERVED_MESSAGE = "Session key namespace is reserved for agent harness-owned sessions.";
const AGENT_HARNESS_SESSION_ID_LOCKED_MESSAGE = "Agent harness-owned session identity is locked and cannot be replaced or shared.";
const AGENT_HARNESS_MODEL_RUN_FORBIDDEN_MESSAGE = "Agent harness-owned sessions cannot be used for one-shot model runs.";
const MODEL_SELECTION_LOCK_REMOVAL_MESSAGE = "Model-selection-locked sessions cannot be removed, unlocked, or reassigned.";
function resolveAgentHarnessSessionKeyRest(sessionKey) {
	const trimmed = sessionKey.trim().toLowerCase();
	return parseAgentSessionKey(trimmed)?.rest ?? trimmed;
}
function resolveAgentHarnessSessionKeyOwner(sessionKey) {
	const rest = resolveAgentHarnessSessionKeyRest(sessionKey);
	if (!rest.startsWith(AGENT_HARNESS_SESSION_KEY_PREFIX)) return;
	const ownerSegment = rest.slice(8).split(":", 1)[0];
	return normalizeOptionalAgentRuntimeId(ownerSegment);
}
/** Agent harnesses own this namespace; public session APIs must not create rows in it. */
function isAgentHarnessSessionKey(sessionKey) {
	return resolveAgentHarnessSessionKeyRest(sessionKey).startsWith(AGENT_HARNESS_SESSION_KEY_PREFIX);
}
function resolveMissingAgentHarnessSessionError(sessionKey, entry) {
	return entry === void 0 && isAgentHarnessSessionKey(sessionKey) ? AGENT_HARNESS_SESSION_KEY_RESERVED_MESSAGE : void 0;
}
/** Missing reserved keys fail closed; pre-feature unlocked collisions stay ordinary. */
function resolveAgentHarnessSessionContextError(sessionKey, entry) {
	if (!isAgentHarnessSessionKey(sessionKey)) return;
	return entry ? resolveAgentHarnessSessionStoreEntryError(sessionKey, entry) : AGENT_HARNESS_SESSION_KEY_RESERVED_MESSAGE;
}
/** Trusted creation must bind the namespace owner to the persisted harness owner. */
function isAgentHarnessSessionKeyOwnedBy(sessionKey, agentHarnessId) {
	const normalizedHarnessId = normalizeOptionalAgentRuntimeId(agentHarnessId);
	return Boolean(normalizedHarnessId && normalizedHarnessId === resolveAgentHarnessSessionKeyOwner(sessionKey));
}
/** A trusted plugin owner outranks the harness observed during its last turn. */
function resolveSessionPinnedHarnessId(entry) {
	return entry?.modelSelectionLocked === true && !normalizeOptionalString(entry.pluginOwnerId) ? normalizeOptionalAgentRuntimeId(entry.agentHarnessId) : void 0;
}
function sessionLockOwnerMatches(previous, next) {
	const previousPluginOwner = normalizeOptionalString(previous.pluginOwnerId);
	const nextPluginOwner = normalizeOptionalString(next.pluginOwnerId);
	if (previousPluginOwner || nextPluginOwner) return previousPluginOwner === nextPluginOwner;
	const previousOwner = normalizeOptionalString(previous.agentHarnessId)?.toLowerCase();
	const nextOwner = normalizeOptionalString(next.agentHarnessId)?.toLowerCase();
	return previousOwner === nextOwner && normalizeOptionalAgentRuntimeId(previousOwner) === normalizeOptionalAgentRuntimeId(nextOwner);
}
function hasEquivalentRelocatedLockedEntry(params) {
	if (isAgentHarnessSessionKey(params.previousKey)) return false;
	const sessionId = normalizeOptionalString(params.previousEntry.sessionId);
	if (!sessionId) return false;
	return Object.entries(params.store).some(([sessionKey, entry]) => sessionKey !== params.previousKey && entry.modelSelectionLocked === true && entry.sessionId === sessionId && sessionLockOwnerMatches(params.previousEntry, entry));
}
/** Preserves durable harness ownership across whole-store compatibility projections. */
function resolveAgentHarnessSessionStoreTransitionError(params) {
	for (const [sessionKey, previousEntry] of params.before ?? []) {
		const nextEntry = params.store[sessionKey];
		if (nextEntry?.modelSelectionLocked === true && sessionLockOwnerMatches(previousEntry, nextEntry)) {
			if (nextEntry.sessionId !== previousEntry.sessionId) return AGENT_HARNESS_SESSION_ID_LOCKED_MESSAGE;
			continue;
		}
		const allowedRemoval = params.allowedRemovals?.get(sessionKey);
		if (nextEntry === void 0 && allowedRemoval !== void 0 && JSON.stringify(previousEntry) === JSON.stringify(allowedRemoval)) continue;
		if (nextEntry === void 0 && hasEquivalentRelocatedLockedEntry({
			previousKey: sessionKey,
			previousEntry,
			store: params.store
		})) continue;
		return MODEL_SELECTION_LOCK_REMOVAL_MESSAGE;
	}
}
/** True when a reserved-looking row carries the durable harness lock added with this feature. */
function isAgentHarnessSessionStoreEntryProtected(sessionKey, entry) {
	return isAgentHarnessSessionKey(sessionKey) && entry.modelSelectionLocked === true;
}
/** Validates durable harness locks and prevents transcript identity aliases. */
function resolveAgentHarnessSessionStoreError(store) {
	const lockedSessionIds = /* @__PURE__ */ new Map();
	for (const [sessionKey, entry] of Object.entries(store)) {
		const entryError = resolveAgentHarnessSessionStoreEntryError(sessionKey, entry);
		if (entryError) return entryError;
		if (!isValidAgentHarnessSessionStoreEntry(sessionKey, entry)) continue;
		const sessionId = normalizeOptionalString(entry.sessionId);
		if (!sessionId || lockedSessionIds.has(sessionId)) return AGENT_HARNESS_SESSION_ID_LOCKED_MESSAGE;
		lockedSessionIds.set(sessionId, sessionKey);
	}
	for (const [sessionKey, entry] of Object.entries(store)) {
		const sessionId = normalizeOptionalString(entry.sessionId);
		const lockedOwner = sessionId ? lockedSessionIds.get(sessionId) : void 0;
		if (lockedOwner && lockedOwner !== sessionKey) return AGENT_HARNESS_SESSION_ID_LOCKED_MESSAGE;
	}
}
/** Rejects caller-selected transcript identities that would rotate a durable harness lock. */
function resolveAgentHarnessSessionIdMismatchError(entry, requestedSessionId) {
	if (!entry || !resolveSessionPinnedHarnessId(entry)) return;
	const requested = normalizeOptionalString(requestedSessionId);
	if (!requested) return;
	return requested === normalizeOptionalString(entry.sessionId) ? void 0 : AGENT_HARNESS_SESSION_ID_LOCKED_MESSAGE;
}
/** Locked rows require durable identity; reserved rows must also match the key owner. */
function resolveAgentHarnessSessionStoreEntryError(sessionKey, entry) {
	if (entry.modelSelectionLocked !== true) return;
	const reservedKey = isAgentHarnessSessionKey(sessionKey);
	if (normalizeOptionalString(entry.pluginOwnerId)) return reservedKey ? AGENT_HARNESS_SESSION_KEY_RESERVED_MESSAGE : void 0;
	const rawHarnessId = normalizeOptionalString(entry.agentHarnessId)?.toLowerCase();
	const hasCanonicalHarnessOwner = Boolean(rawHarnessId) && rawHarnessId === normalizeOptionalAgentRuntimeId(rawHarnessId);
	if (!normalizeOptionalString(entry.sessionId) && (reservedKey || entry.agentHarnessId !== void 0)) return AGENT_HARNESS_SESSION_ID_LOCKED_MESSAGE;
	if (reservedKey) return hasCanonicalHarnessOwner && isAgentHarnessSessionKeyOwnedBy(sessionKey, entry.agentHarnessId) ? void 0 : AGENT_HARNESS_SESSION_KEY_RESERVED_MESSAGE;
	if (entry.agentHarnessId === void 0) return;
	if (!hasCanonicalHarnessOwner) return AGENT_HARNESS_SESSION_ID_LOCKED_MESSAGE;
}
/** True for any valid durable harness lock, including supported ordinary-key rows. */
function isValidAgentHarnessSessionStoreEntry(sessionKey, entry) {
	return entry.modelSelectionLocked === true && (isAgentHarnessSessionKey(sessionKey) || resolveSessionPinnedHarnessId(entry) !== void 0) && resolveAgentHarnessSessionStoreEntryError(sessionKey, entry) === void 0;
}
//#endregion
export { isAgentHarnessSessionKey as a, isValidAgentHarnessSessionStoreEntry as c, resolveAgentHarnessSessionStoreEntryError as d, resolveAgentHarnessSessionStoreError as f, resolveSessionPinnedHarnessId as h, MODEL_SELECTION_LOCK_REMOVAL_MESSAGE as i, resolveAgentHarnessSessionContextError as l, resolveMissingAgentHarnessSessionError as m, AGENT_HARNESS_SESSION_ID_LOCKED_MESSAGE as n, isAgentHarnessSessionKeyOwnedBy as o, resolveAgentHarnessSessionStoreTransitionError as p, AGENT_HARNESS_SESSION_KEY_RESERVED_MESSAGE as r, isAgentHarnessSessionStoreEntryProtected as s, AGENT_HARNESS_MODEL_RUN_FORBIDDEN_MESSAGE as t, resolveAgentHarnessSessionIdMismatchError as u };
