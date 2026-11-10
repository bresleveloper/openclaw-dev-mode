import { n as captureSessionTranscriptTargetBinding } from "./transcript-target-binding-uO0pz59U.mjs";
import { n as captureSessionActorStorageOwner } from "./session-actor-storage-binding-oCtbPk00.mjs";
import { n as resolveSessionTranscriptReadFence } from "./session-transcript-read-fence-CgUG4J4j.mjs";
//#region src/config/sessions/session-actor-transcript-read.ts
/** Capture the selected memory namespace; borrowed sibling handles never create a backend. */
function captureSessionActorTranscriptRead(scope, signal) {
	const namespace = captureSessionActorStorageOwner(scope, {
		assertCurrent: () => signal?.throwIfAborted(),
		authorize: () => signal?.throwIfAborted()
	});
	if (!namespace) return;
	const selected = namespace.binding;
	const sameOwner = selected && namespace.agentId === selected.agentId && namespace.path === selected.path;
	const stored = sameOwner ? selected.actor.storage.readCurrent({
		type: "session.entry.readById",
		input: { sessionId: scope.sessionId }
	}, selected.authority) : namespace.owner?.readSessionById(scope.sessionId, namespace.authority);
	const sessionKey = stored?.sessionKey ?? scope.sessionKey ?? "";
	const direct = sameOwner && sessionKey === selected.actor.target.sessionKey;
	const target = captureSessionTranscriptTargetBinding({
		agentId: namespace.agentId,
		sessionKey,
		sessionId: scope.sessionId,
		storePath: sameOwner ? selected.path : namespace.path,
		env: scope.env
	});
	const receipt = resolveSessionTranscriptReadFence(target);
	const admission = receipt && structuredClone(receipt);
	const assertOwnerCurrent = namespace.owner?.captureSessionReadGuard(sessionKey);
	const authority = {
		...namespace.authority,
		assertCurrent: () => {
			signal?.throwIfAborted();
			assertOwnerCurrent?.();
			selected?.actor.assertReadable();
			namespace.authority.assertCurrent();
		}
	};
	return {
		target,
		missing: !stored,
		currentEntry() {
			authority.assertCurrent();
			return sameOwner ? selected.actor.storage.readCurrent({
				type: "session.entry.read",
				input: { sessionKey }
			}, selected.authority) : namespace.owner?.readSession(sessionKey, namespace.authority)?.entry;
		},
		assertCurrent: authority.assertCurrent,
		async read(type, input) {
			authority.assertCurrent();
			if (!stored) throw new Error("Session transcript window is unavailable");
			let actor;
			try {
				actor = direct ? selected.actor : sameOwner ? await selected.actor.storage.acquire(sessionKey) : await namespace.owner?.acquireExisting(sessionKey, {
					assertCurrent: authority.assertCurrent,
					assertReadable: authority.assertCurrent
				});
				if (!actor) throw new Error("Session transcript window is unavailable");
				return await actor.storage.read({
					type,
					input: {
						admission,
						...input,
						sessionId: target.sessionId
					}
				}, authority);
			} finally {
				if (actor && !direct) await actor.release();
			}
		}
	};
}
//#endregion
export { captureSessionActorTranscriptRead as t };
