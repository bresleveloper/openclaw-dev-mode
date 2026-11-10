import { i as isIncognitoSessionKey } from "./incognito-session-key-BWpn88lo.mjs";
import { _ as toAgentStoreSessionKey } from "./session-key-CSDERtm3.mjs";
import { t as memorySessionActorOwners } from "./session-actor-memory-owner-BSARM2d5.mjs";
import { n as captureSessionActorStorageOwner } from "./session-actor-storage-binding-oCtbPk00.mjs";
//#region src/gateway/session-sharing-incognito.ts
var SessionMutationFactsUnavailableError = class extends Error {
	constructor(options) {
		super("Session access facts are unavailable; retry after session storage is ready.", options);
		this.name = "SessionMutationFactsUnavailableError";
	}
};
/** Capture only existing memory state; the caller owns disclosure and effect authorization. */
function captureSessionSharingMemoryFacts(target, assertCurrent, allowMissing = true) {
	if (!isIncognitoSessionKey(target.sessionKey)) return;
	const authority = {
		assertCurrent,
		authorize: assertCurrent
	};
	const captured = captureSessionActorStorageOwner({
		agentId: target.agentId,
		sessionKey: target.sessionKey,
		storePath: target.resolved?.readSource?.path ?? target.resolved?.storePath ?? target.absentTarget?.storePath
	}, authority);
	if (!captured) throw new SessionMutationFactsUnavailableError();
	const { agentId, path } = captured;
	let owner = captured.owner;
	const canonicalKey = toAgentStoreSessionKey({
		agentId,
		requestKey: target.sessionKey
	});
	const location = {
		agentId,
		path
	};
	const readCurrent = () => {
		assertCurrent();
		captured.binding?.actor.assertReadable();
		owner ??= memorySessionActorOwners.read(location);
		const current = owner?.readSession(canonicalKey, captured.authority);
		if (!current?.entry) {
			if (!allowMissing) throw new SessionMutationFactsUnavailableError();
			return {
				target: null,
				members: [],
				membership: /* @__PURE__ */ new Set()
			};
		}
		return {
			sourcePath: path,
			sourceAgentId: agentId,
			target: {
				agentId,
				canonicalKey,
				storeKey: canonicalKey,
				storeKeys: [canonicalKey],
				storePath: path,
				readSource: void 0,
				entry: current.entry
			},
			members: current.members,
			membership: new Set(current.members.map((member) => member.identityId))
		};
	};
	return {
		location,
		assertCurrent: () => void readCurrent(),
		readCurrent
	};
}
/** Synchronous callers receive detached facts, never a retained authority or a new owner. */
function readSessionSharingMemoryFacts(target) {
	let active = true;
	try {
		const facts = captureSessionSharingMemoryFacts(target, () => {
			if (!active) throw new SessionMutationFactsUnavailableError();
		});
		return facts && {
			...facts.readCurrent(),
			location: facts.location
		};
	} finally {
		active = false;
	}
}
//#endregion
export { captureSessionSharingMemoryFacts as n, readSessionSharingMemoryFacts as r, SessionMutationFactsUnavailableError as t };
