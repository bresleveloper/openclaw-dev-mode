import { a as resolveGlobalSingleton } from "./global-singleton-DrXvEBww.mjs";
import { o as resolveExplicitIncognitoAgentSqliteTarget } from "./openclaw-agent-db.paths-BGqL4GOe.mjs";
import { i as isIncognitoSessionKey } from "./incognito-session-key-BWpn88lo.mjs";
import "./session-key-CSDERtm3.mjs";
import { i as sameSessionTranscriptTargetBinding } from "./transcript-target-binding-uO0pz59U.mjs";
import { t as memorySessionActorOwners } from "./session-actor-memory-owner-BSARM2d5.mjs";
import { r as resolveSqliteSessionKey } from "./session-accessor.sqlite-scope-helpers-XTtpZpWK.mjs";
import { n as captureSessionActorStorageOwner, o as runWithSessionActorStorage, r as getSessionActorStorageBinding, t as acquireSessionActorStorage } from "./session-actor-storage-binding-oCtbPk00.mjs";
import { r as IncognitoSessionSyncAccessError } from "./incognito-session-error-Dsi9IsoJ.mjs";
import { t as warnSessionPersistenceDeprecation } from "./session-persistence-deprecation-BRA1CvXF.mjs";
import { i as captureOwnedTranscriptWriteAssertion, s as getOwnedSessionTranscriptActor } from "./transcript-write-context-C02sC3zd.mjs";
import { AsyncLocalStorage } from "node:async_hooks";
//#region src/agents/sessions/session-manager-incognito-scope.ts
const managerBindings = resolveGlobalSingleton(Symbol.for("openclaw.sessionManagerMemoryBindings"), () => /* @__PURE__ */ new WeakMap());
const activeMemoryBindings = new AsyncLocalStorage();
/** Accepted nested writes borrow the phase handle while the outer operation drains. */
function withSessionManagerMemoryBinding(manager, binding, operation) {
	const active = new Map(activeMemoryBindings.getStore());
	active.set(manager, binding);
	return activeMemoryBindings.run(active, () => runWithSessionActorStorage({
		actor: binding.actor,
		authority: binding.authority,
		agentId: binding.database.agentId,
		path: binding.database.path
	}, operation));
}
function selectedActor(target) {
	const injected = getSessionActorStorageBinding(target);
	if (injected) return injected;
	if (!isIncognitoSessionKey(target.sessionKey) && !resolveExplicitIncognitoAgentSqliteTarget(target.storePath, { agentId: target.agentId })) return;
	const owned = getOwnedSessionTranscriptActor(target);
	if (owned?.actor.target.database.kind !== "memory" || !owned.actor.storage) return;
	return {
		actor: owned.actor,
		agentId: owned.database.agentId,
		path: owned.database.path,
		authority: {
			assertCurrent: captureOwnedTranscriptWriteAssertion(target),
			authorize() {}
		}
	};
}
function retainAcquisition(binding, selected) {
	const storage = selected.actor.storage;
	const sessionKey = selected.actor.target.sessionKey;
	const assertCurrent = () => binding.authority.assertCurrent();
	return {
		...binding,
		acquire: (_create, lifetime) => storage.acquire(sessionKey, lifetime ?? {
			assertCurrent,
			assertReadable: assertCurrent
		})
	};
}
function captureSessionManagerIncognitoBinding(target, manager, retarget = false) {
	if (!target) return;
	const retained = manager ? activeMemoryBindings.getStore()?.get(manager) ?? managerBindings.get(manager) : void 0;
	if (retained && !retarget) {
		if (!sameSessionTranscriptTargetBinding(retained.target, target)) throw new Error("Session manager target differs from its selected memory actor");
		return retained;
	}
	const selected = selectedActor(target);
	const authority = selected?.authority ?? {
		assertCurrent: captureOwnedTranscriptWriteAssertion(target),
		authorize() {}
	};
	if (selected) return retainAcquisition({
		kind: "memory",
		authority,
		target,
		database: {
			agentId: selected.agentId,
			path: selected.path,
			env: target.env
		}
	}, selected);
	const captured = captureSessionActorStorageOwner(target, authority);
	if (!captured) return;
	const { agentId, path } = captured;
	const sessionKey = resolveSqliteSessionKey(target.sessionKey, agentId);
	let owner = captured.owner;
	const assertCurrent = authority.assertCurrent;
	const lifetime = {
		assertCurrent,
		assertReadable: assertCurrent
	};
	return {
		kind: "memory",
		authority,
		target,
		database: {
			agentId,
			path,
			env: target.env
		},
		async acquire(create, acquiredLifetime = lifetime) {
			owner ??= memorySessionActorOwners.read({
				agentId,
				path
			});
			if (owner) return create ? owner.acquire({
				database: owner.identity,
				sessionKey
			}, acquiredLifetime) : owner.acquireExisting(sessionKey, acquiredLifetime);
			if (!create) return;
			return (await acquireSessionActorStorage(target, {
				lifetime: acquiredLifetime,
				authority,
				create: true
			}))?.actor;
		}
	};
}
/** Managers retain owner acquisition, never an unreleased actor handle. */
function installSessionManagerIncognitoBinding(manager, binding) {
	if (binding) {
		const { kind, authority, database, target, acquire } = binding;
		managerBindings.set(manager, {
			kind,
			authority,
			database,
			target,
			acquire
		});
	} else managerBindings.delete(manager);
}
async function withSessionManagerMemoryActor(binding, create, operation) {
	const borrowed = selectedActor(binding.target);
	const actor = borrowed?.actor ?? await binding.acquire(create);
	if (!actor) return operation(void 0);
	const selected = {
		...retainAcquisition(binding, { actor }),
		authority: borrowed?.authority ?? binding.authority,
		actor,
		storage: actor.storage
	};
	try {
		return await operation(selected);
	} finally {
		if (!borrowed) await actor.release();
	}
}
/** Refuse synchronous incognito persistence before local mutation or SQLite access. */
function prepareSessionManagerSync(method, target, manager, replacement = `${method}Async`) {
	const qualified = `SessionManager.${method}`;
	if (manager && managerBindings.has(manager) || captureSessionManagerIncognitoBinding(target, manager)) throw new IncognitoSessionSyncAccessError(qualified, replacement);
	warnSessionPersistenceDeprecation(qualified, replacement);
}
//#endregion
export { withSessionManagerMemoryBinding as a, withSessionManagerMemoryActor as i, installSessionManagerIncognitoBinding as n, prepareSessionManagerSync as r, captureSessionManagerIncognitoBinding as t };
