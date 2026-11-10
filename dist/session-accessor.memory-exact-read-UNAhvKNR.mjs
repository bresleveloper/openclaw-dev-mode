import { r as getAsyncWorkSignal } from "./async-work-scope-BH2yUdBz.mjs";
import { t as attachSessionEntrySnapshots } from "./session-entry-snapshot-values-CSxUX6LQ.mjs";
import { t as isInternalSessionEffectsKey } from "./internal-session-key-B6hhdgLR.mjs";
import { r as resolveSqliteSessionKey } from "./session-accessor.sqlite-scope-helpers-XTtpZpWK.mjs";
import { a as readCapturedSessionActorEntry, n as captureSessionActorStorageOwner } from "./session-actor-storage-binding-oCtbPk00.mjs";
import path from "node:path";
//#region src/config/sessions/session-accessor.memory-exact-read.ts
/** An exact reader borrows the selected owner; absence never opens or acquires a backend. */
function captureMemoryExactSessionReader(scope, assertCallerCurrent) {
	const signal = getAsyncWorkSignal();
	const assertCurrent = () => {
		signal?.throwIfAborted();
		assertCallerCurrent?.();
	};
	const captured = captureSessionActorStorageOwner(scope, {
		assertCurrent,
		authorize: assertCurrent
	});
	if (!captured) return;
	const { owner, authority, agentId } = captured;
	const binding = captured.binding?.agentId === agentId && captured.binding.path === captured.path ? captured.binding : void 0;
	const identity = owner?.identity ?? (binding?.agentId === agentId && binding.path === captured.path ? binding.actor.target.database : void 0);
	const source = identity?.kind === "memory" ? {
		agentId,
		path: captured.path,
		databaseIdentity: identity.incarnation
	} : void 0;
	const entries = (projection) => {
		if (owner) return owner.listSessionEntries(authority, projection);
		return binding?.actor.storage?.readCurrent({
			type: "session.entries.read",
			input: { projection }
		}, authority) ?? [];
	};
	return {
		source,
		agentId,
		path: captured.path,
		read(sessionKey, projection) {
			const entry = readCapturedSessionActorEntry(captured, resolveSqliteSessionKey(sessionKey, agentId));
			return entry && attachSessionEntrySnapshots(entry, {}, projection);
		},
		readById(sessionId, projection, orderBy) {
			const selected = owner ? owner.readSessionById(sessionId, authority, {
				currentOnly: true,
				orderBy
			}) : binding?.actor.storage?.readCurrent({
				type: "session.entry.readById",
				input: {
					sessionId,
					currentOnly: true
				}
			}, authority);
			return selected && {
				sessionKey: selected.sessionKey,
				entry: attachSessionEntrySnapshots(selected.entry, {}, projection)
			};
		},
		entries,
		children(parentSessionKeys, projection) {
			const parents = new Set(parentSessionKeys.map((key) => resolveSqliteSessionKey(key, agentId)));
			return entries(projection).filter(({ sessionKey, entry }) => !isInternalSessionEffectsKey(sessionKey) && !parents.has(sessionKey) && (parents.has(entry.parentSessionKey ?? "") || parents.has(entry.spawnedBy ?? ""))).toSorted((left, right) => left.sessionKey < right.sessionKey ? -1 : left.sessionKey > right.sessionKey ? 1 : 0);
		},
		facts(sessionKey) {
			if (owner) {
				const state = owner.readSession(sessionKey, authority);
				return {
					members: state?.members ?? [],
					participants: state?.participants ?? []
				};
			}
			if (binding?.actor.target.sessionKey !== sessionKey) return {
				members: [],
				participants: []
			};
			return {
				members: binding.actor.storage?.readCurrent({
					type: "session.members.read",
					input: {}
				}, authority).members ?? [],
				participants: binding.actor.storage?.readCurrent({
					type: "session.participants.read",
					input: {}
				}, authority) ?? []
			};
		},
		assertCurrent() {
			owner?.assertCurrent();
			if (!owner && binding) binding.actor.assertReadable();
			authority.assertCurrent();
		}
	};
}
function assertMemoryExactReadSource(expected, actual) {
	if (expected && (!actual || expected.agentId !== actual.agentId || path.resolve(expected.path) !== path.resolve(actual.path) || expected.databaseIdentity !== actual.databaseIdentity)) throw new Error("Captured session database changed before read");
}
//#endregion
export { captureMemoryExactSessionReader as n, assertMemoryExactReadSource as t };
