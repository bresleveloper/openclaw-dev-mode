import { a as resolveGlobalSingleton } from "./global-singleton-DrXvEBww.mjs";
import { o as resolveExplicitIncognitoAgentSqliteTarget, s as resolveIncognitoOpenClawAgentSqlitePath } from "./openclaw-agent-db.paths-BGqL4GOe.mjs";
import { i as isIncognitoSessionKey } from "./incognito-session-key-BWpn88lo.mjs";
import { l as resolveAgentIdFromSessionKey } from "./session-key-CSDERtm3.mjs";
import { n as readMemorySessionActorOwner, t as memorySessionActorOwners } from "./session-actor-memory-owner-BSARM2d5.mjs";
import { r as resolveSqliteSessionKey } from "./session-accessor.sqlite-scope-helpers-XTtpZpWK.mjs";
import path from "node:path";
import { AsyncLocalStorage } from "node:async_hooks";
//#region src/config/sessions/session-actor-storage-binding.ts
function isMemoryBinding(binding) {
	return binding.actor.target.database.kind === "memory" && binding.actor.storage !== void 0;
}
const currentBinding = resolveGlobalSingleton(Symbol.for("openclaw.sessionActorStorageBinding"), () => new AsyncLocalStorage());
function runWithSessionActorStorage(binding, run) {
	if (!isMemoryBinding(binding)) throw new Error("Session storage binding requires a memory actor");
	return currentBinding.run(binding, run);
}
/** Borrow the selected actor for an exact logical session, never a native fallback. */
function getSessionActorStorageBinding(scope) {
	const binding = scope.sessionActor ?? currentBinding.getStore();
	if (!binding) return;
	const sessionKey = scope.sessionKey ? resolveSqliteSessionKey(scope.sessionKey, binding.agentId) : void 0;
	if (sessionKey && sessionKey !== binding.actor.target.sessionKey) {
		if (scope.sessionActor || isIncognitoSessionKey(sessionKey)) throw new Error("Session storage binding belongs to another session");
		return;
	}
	const explicit = resolveExplicitIncognitoAgentSqliteTarget(scope.storePath, { agentId: scope.agentId });
	if (scope.storePath && !explicit && !isIncognitoSessionKey(scope.sessionKey)) return;
	if (scope.agentId && scope.agentId !== binding.agentId || explicit && explicit.path !== path.resolve(binding.path)) throw new Error("Session storage binding belongs to another owner");
	if (!isMemoryBinding(binding)) throw new Error("Session storage binding requires a memory actor");
	return binding;
}
function captureSessionActorStorageOwner(scope, authority) {
	const selected = scope.sessionActor ?? currentBinding.getStore();
	const explicit = resolveExplicitIncognitoAgentSqliteTarget(scope.storePath, { agentId: scope.agentId });
	if (scope.storePath && !explicit && !isIncognitoSessionKey(scope.sessionKey)) return;
	if (!selected && (!authority || !isIncognitoSessionKey(scope.sessionKey) && !explicit)) return;
	if (scope.sessionKey && !isIncognitoSessionKey(scope.sessionKey) && !explicit) return;
	const agentId = scope.agentId ?? explicit?.agentId ?? (scope.sessionKey ? resolveAgentIdFromSessionKey(scope.sessionKey) : selected?.agentId);
	if (!agentId) return;
	const root = selected && path.resolve(selected.path, "../../../..");
	const requestedPath = explicit?.path ?? (selected?.agentId === agentId && !scope.env ? selected.path : void 0) ?? resolveIncognitoOpenClawAgentSqlitePath({
		agentId,
		env: scope.env ?? (root ? { OPENCLAW_STATE_DIR: root } : void 0)
	});
	if (root && path.resolve(requestedPath, "../../../..") !== root) throw new Error("Session storage owner belongs to another state root");
	const caller = selected?.authority ?? authority;
	const currentAuthority = authority && selected ? {
		authorize: (...args) => caller.authorize(...args),
		assertCurrent() {
			caller.assertCurrent();
			authority.assertCurrent();
		}
	} : caller;
	return {
		owner: (selected?.agentId === agentId && selected.path === requestedPath ? readMemorySessionActorOwner(selected.actor) : void 0) ?? memorySessionActorOwners.read({
			agentId,
			path: requestedPath
		}),
		binding: selected,
		authority: currentAuthority,
		agentId,
		path: requestedPath
	};
}
/** Read the captured namespace, including directly constructed selected owners. */
function readCapturedSessionActorEntry(captured, sessionKey) {
	if (captured.owner) return captured.owner.readSession(sessionKey, captured.authority)?.entry;
	const selected = captured.binding;
	if (!selected || selected.agentId !== captured.agentId || path.resolve(selected.path) !== path.resolve(captured.path)) return;
	return selected.actor.storage?.readCurrent({
		type: "session.entry.read",
		input: { sessionKey }
	}, captured.authority);
}
/** Enumerate the already-selected memory namespace without opening another backend. */
function readCapturedSessionActorEntries(captured, projection) {
	if (captured.owner) return captured.owner.listSessionEntries(captured.authority, projection);
	const selected = captured.binding;
	if (!selected || selected.agentId !== captured.agentId || path.resolve(selected.path) !== path.resolve(captured.path)) return [];
	return selected.actor.storage?.readCurrent({
		type: "session.entries.read",
		input: { projection }
	}, captured.authority) ?? [];
}
/** Select once at the root; the returned handle owns its release. */
async function acquireSessionActorStorage(scope, options) {
	options.lifetime.assertAdmission?.();
	options.lifetime.assertCurrent();
	const captured = captureSessionActorStorageOwner(scope, options.authority);
	if (!captured) return;
	const selected = captured.binding;
	const selectedOwner = selected && selected.agentId === captured.agentId && selected.path === captured.path;
	const owner = captured.owner ?? (options.create && !selectedOwner ? memorySessionActorOwners.get(captured) : void 0);
	let sessionKey = scope.sessionKey ? resolveSqliteSessionKey(scope.sessionKey, captured.agentId) : void 0;
	if (!sessionKey && scope.sessionId) sessionKey = owner?.readSessionById(scope.sessionId, captured.authority)?.sessionKey ?? (selectedOwner ? selected.actor.storage?.readCurrent({
		type: "session.entry.readById",
		input: { sessionId: scope.sessionId }
	}, captured.authority)?.sessionKey : void 0);
	if (!sessionKey) return;
	let actor;
	if (owner) {
		if (selected && selected.agentId === captured.agentId && selected.path === captured.path) selected.actor.assertReadable();
		actor = options.create ? await owner.acquire({
			database: owner.identity,
			sessionKey
		}, options.lifetime) : await owner.acquireExisting(sessionKey, options.lifetime);
	} else if (selected && selected.agentId === captured.agentId && selected.path === captured.path) {
		const storage = selected.actor.storage;
		if (!storage) throw new Error("Selected memory actor has no storage capability");
		if (options.create || storage.readCurrent({
			type: "session.entry.read",
			input: { sessionKey }
		}, captured.authority)) actor = await storage.acquire(sessionKey, options.lifetime);
	}
	if (!actor) return;
	const binding = {
		actor,
		authority: captured.authority,
		agentId: captured.agentId,
		path: captured.path
	};
	if (!isMemoryBinding(binding)) {
		await actor.release();
		throw new Error("Memory acquisition selected another backend");
	}
	return binding;
}
/** Async roots retain exactly one handle and bind descendants until all accepted work settles. */
async function withSessionActorStorage(scope, options, consume) {
	const binding = await acquireSessionActorStorage(scope, options);
	if (!binding) return;
	try {
		return await runWithSessionActorStorage(binding, () => consume(binding));
	} finally {
		await binding.actor.release();
	}
}
//#endregion
export { readCapturedSessionActorEntry as a, readCapturedSessionActorEntries as i, captureSessionActorStorageOwner as n, runWithSessionActorStorage as o, getSessionActorStorageBinding as r, withSessionActorStorage as s, acquireSessionActorStorage as t };
