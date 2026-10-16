import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { u as readDatabasePathIdentitySync } from "./sqlite-worker-identity-KSR14F6C.mjs";
import { a as registerOpenClawAgentDatabaseAsyncResource, o as registerOpenClawAgentDatabaseReadCandidateResource } from "./openclaw-agent-db-resources-x2MmUEok.mjs";
import { r as isIncognitoSessionKey } from "./session-key-CmZ4o9-l.mjs";
import { S as isCronSessionKey, x as isCronRunSessionKey } from "./session-key-C09ow4h0.mjs";
import { n as sessionChanges, t as isSessionStoreTopologyChange } from "./session-row-changes-BcJIdta8.mjs";
import { u as getOpenIncognitoAgentDatabase } from "./openclaw-agent-db-lifecycle-BJiYtXuW.mjs";
import { c as captureSessionStoreReadCandidate } from "./session-sqlite-target-Cnk9g9d0.mjs";
import { F as projectSessionSharingEntry, L as retainPreparedSessionGenerationFacts, N as readCommittedIncognitoSessionSharing, d as isPreparedSessionSharingChange } from "./session-accessor.sqlite-entry-cache-nS4OEr3G.mjs";
import { l as loadSessionEntryReadOnlyResultInScope } from "./session-accessor.sqlite-exact-read-JW6IveXD.mjs";
import { m as isSessionLifecycleMutationActive } from "./session-lifecycle-admission-GoxISURZ.mjs";
import "./session-accessor.sqlite-entry-AwYVLytL.mjs";
import { t as captureSessionStoreReadCandidates } from "./session-store-target-inventory-Dj6Sq0En.mjs";
import { l as withSessionEntriesFromStoresInWorker } from "./session-entry-read-runtime-qEzTuOKY.mjs";
import path from "node:path";
//#region src/config/sessions/session-delivery-generation.ts
var SessionDeliveryGenerationRevokedError = class extends Error {
	constructor() {
		super("The original session generation no longer accepts this delivery.");
		this.code = "SESSION_DELIVERY_GENERATION_REVOKED";
		this.name = "SessionDeliveryGenerationRevokedError";
	}
};
var SessionDeliveryGenerationUnavailableError = class extends Error {
	constructor(options) {
		super("Session delivery generation is unavailable; retry after session storage is ready.", options);
		this.code = "SESSION_DELIVERY_GENERATION_UNAVAILABLE";
		this.name = "SessionDeliveryGenerationUnavailableError";
	}
};
const isSessionDeliveryGenerationRevokedError = (error) => isRecord(error) && error.code === "SESSION_DELIVERY_GENERATION_REVOKED";
const isSessionDeliveryGenerationUnavailableError = (error) => isRecord(error) && error.code === "SESSION_DELIVERY_GENERATION_UNAVAILABLE";
function isSessionGenerationFacts(value) {
	return isRecord(value) && [
		value.agentId,
		value.storePath,
		value.sessionKey
	].every((field) => typeof field === "string" && field.length > 0 && field === field.trim()) && (value.sessionId === null || typeof value.sessionId === "string" && value.sessionId.length > 0 && value.sessionId === value.sessionId.trim()) && typeof value.storePath === "string" && path.isAbsolute(value.storePath) && (value.lifecycleRevision === null || typeof value.lifecycleRevision === "string" && value.lifecycleRevision.length > 0);
}
/** Prepare once per delivery attempt; committed entry publications keep final I/O checks live. */
async function prepareSessionGenerationLease(input, onRevoked) {
	if (!isSessionGenerationFacts(input)) throw new SessionDeliveryGenerationUnavailableError();
	const generation = { ...input };
	const releases = [];
	const paths = /* @__PURE__ */ new Set([path.resolve(generation.storePath)]);
	let active = true;
	let invalidated = false;
	let revoked = false;
	let publications = 0;
	let retained;
	let observeIncognito;
	const release = () => {
		if (!active) return;
		active = false;
		for (const stop of releases.splice(0).toReversed()) stop();
	};
	const revoke = () => {
		release();
		onRevoked?.(new SessionDeliveryGenerationUnavailableError());
	};
	const assertActive = () => {
		if (revoked) throw new SessionDeliveryGenerationRevokedError();
		if (!active || invalidated) throw new SessionDeliveryGenerationUnavailableError();
	};
	const checkEntry = (entry) => {
		if (entry === void 0) throw new SessionDeliveryGenerationUnavailableError();
		if ((entry?.sessionId ?? null) !== generation.sessionId || (entry?.lifecycleRevision ?? null) !== generation.lifecycleRevision) {
			revoked = true;
			throw new SessionDeliveryGenerationRevokedError();
		}
	};
	const changed = (change) => {
		if ("all" in change) {
			if (isSessionStoreTopologyChange(change)) {
				invalidated = true;
				return;
			}
			if (typeof change.scope === "object") {
				if (change.scope.agentId && change.scope.agentId !== generation.agentId) return;
				if (change.scope.storePath && !paths.has(path.resolve(change.scope.storePath))) return;
			} else if ([
				"profiles",
				"catalog",
				"acp",
				"agent-runs",
				"subagent-runs",
				"worker-placements",
				"worker-environments",
				"config",
				"config-presentation",
				"config-profiles"
			].includes(change.scope)) return;
			invalidated = true;
			return;
		}
		if (change.scope === "automation" || change.sessionKey !== generation.sessionKey || change.agentId && change.agentId !== generation.agentId || !change.storePath || !paths.has(path.resolve(change.storePath))) return;
		publications += 1;
		if (!change.factsInvalidated && [
			"unchanged",
			"participants",
			"category",
			"member"
		].includes(change.facts?.kind ?? "")) return;
		if (!isPreparedSessionSharingChange(change)) invalidated = true;
		else if (observeIncognito && change.facts?.kind === "removed") revoked = true;
		else if (observeIncognito) try {
			observeIncognito();
		} catch (error) {
			if (!isSessionDeliveryGenerationRevokedError(error)) invalidated = true;
		}
	};
	releases.push(sessionChanges.subscribeFacts(changed));
	try {
		let readCurrent;
		let prepareRead = () => {
			assertActive();
		};
		if (isIncognitoSessionKey(generation.sessionKey)) {
			const database = getOpenIncognitoAgentDatabase(generation.agentId, generation.storePath);
			if (!database && generation.sessionId !== null) throw new SessionDeliveryGenerationRevokedError();
			releases.push(registerOpenClawAgentDatabaseAsyncResource({
				agentId: generation.agentId,
				path: generation.storePath,
				revoke,
				close: async () => revoke()
			}));
			readCurrent = () => {
				if (getOpenIncognitoAgentDatabase(generation.agentId, generation.storePath) !== database) throw new SessionDeliveryGenerationUnavailableError();
				if (!database) {
					checkEntry(null);
					return;
				}
				const committed = readCommittedIncognitoSessionSharing(database.db, generation.sessionKey);
				if (committed === void 0 && generation.sessionId === null) {
					const read = loadSessionEntryReadOnlyResultInScope({
						agentId: generation.agentId,
						storePath: generation.storePath,
						sessionKey: generation.sessionKey
					});
					if (!read.ok) throw read.error;
					checkEntry(read.value ?? null);
				} else checkEntry(committed?.entry ?? (committed ? null : void 0));
			};
			observeIncognito = readCurrent;
		} else {
			const candidates = captureSessionStoreReadCandidates(generation.storePath);
			const originalSources = new Map(candidates.map((candidate) => [path.resolve(candidate.physicalPath), readDatabasePathIdentitySync(candidate.physicalPath)]));
			for (const candidate of candidates) {
				paths.add(path.resolve(candidate.path));
				paths.add(path.resolve(candidate.physicalPath));
				for (const pathname of /* @__PURE__ */ new Set([candidate.path, candidate.physicalPath])) releases.push(registerOpenClawAgentDatabaseReadCandidateResource({
					...candidate,
					path: pathname,
					revoke,
					close: async () => revoke()
				}));
			}
			let source;
			while (!retained) {
				assertActive();
				const before = publications;
				retained = await withSessionEntriesFromStoresInWorker([{
					...generation,
					sessionKeys: [generation.sessionKey],
					projection: "sharing"
				}], ([read]) => {
					assertActive();
					if (before !== publications) return;
					const entry = read.result.entries.find((row) => row.sessionKey === generation.sessionKey)?.entry;
					checkEntry(entry ?? null);
					const sharing = read.result.sharing;
					if (sharing) source = {
						path: sharing.source.path,
						identity: sharing.databaseIdentity
					};
					else {
						const pathname = path.resolve(read.database.path);
						const original = originalSources.get(pathname);
						if (generation.sessionId !== null || !original?.key.startsWith("path:") || readDatabasePathIdentitySync(pathname).key !== original.key) throw new SessionDeliveryGenerationUnavailableError();
						source = {
							path: pathname,
							identity: original.key
						};
					}
					paths.add(path.resolve(source.path));
					const prepared = retainPreparedSessionGenerationFacts({
						databaseIdentity: source.identity,
						sessionKey: generation.sessionKey,
						entry: entry ? projectSessionSharingEntry(entry) : void 0
					});
					releases.push(prepared.release);
					return prepared;
				});
			}
			const assertSourceCurrent = () => {
				assertActive();
				for (const candidate of candidates) if (captureSessionStoreReadCandidate(candidate.path, candidate.scope).physicalPath !== candidate.physicalPath) throw new SessionDeliveryGenerationUnavailableError();
				if (!source || readDatabasePathIdentitySync(source.path).key !== source.identity) throw new SessionDeliveryGenerationUnavailableError();
			};
			readCurrent = () => {
				assertSourceCurrent();
				checkEntry(retained?.readCurrent());
			};
			prepareRead = () => {
				assertSourceCurrent();
				return retained?.prepareRead()?.then(assertSourceCurrent);
			};
		}
		const assertCurrent = (delivery = false) => {
			try {
				assertActive();
				if (delivery && [...paths].some((scope) => isSessionLifecycleMutationActive(scope, generation.sessionId ? [generation.sessionKey, generation.sessionId] : [generation.sessionKey]))) throw new SessionDeliveryGenerationUnavailableError();
				readCurrent();
			} catch (error) {
				const failure = isSessionDeliveryGenerationRevokedError(error) || isSessionDeliveryGenerationUnavailableError(error) ? error : new SessionDeliveryGenerationUnavailableError({ cause: error });
				onRevoked?.(failure);
				throw failure;
			}
		};
		for (let pending = prepareRead(); pending; pending = prepareRead()) await pending;
		assertCurrent();
		if (onRevoked) {
			let checkedPublications = publications;
			releases.push(sessionChanges.subscribe(() => {
				if (checkedPublications === publications && !invalidated && !revoked) return;
				checkedPublications = publications;
				try {
					assertCurrent();
				} catch {}
			}));
		}
		return {
			assertCurrent,
			assertDeliveryCurrent: () => assertCurrent(true),
			prepareRead,
			release
		};
	} catch (error) {
		release();
		if (isSessionDeliveryGenerationRevokedError(error) || isSessionDeliveryGenerationUnavailableError(error)) throw error;
		throw new SessionDeliveryGenerationUnavailableError({ cause: error });
	}
}
/** Session lifecycle owners compose these facts with their own admitted mutation authority. */
async function prepareSessionGenerationFacts(input) {
	const { assertCurrent, prepareRead, release } = await prepareSessionGenerationLease(input);
	return {
		assertCurrent,
		prepareRead,
		release
	};
}
/** Stable cron roots retain their admitted run; exact-run keys already name one generation. */
async function prepareCronRootSessionGeneration(input, onRevoked) {
	if (!isCronSessionKey(input.sessionKey) || isCronRunSessionKey(input.sessionKey)) return;
	const { assertCurrent, release } = await prepareSessionGenerationLease({
		...input,
		lifecycleRevision: input.lifecycleRevision ?? null
	}, onRevoked);
	return {
		assertCurrent,
		release
	};
}
/** Delivery remains unavailable while any lifecycle mutation owns the session. */
async function prepareSessionDeliveryGeneration(input) {
	if (!isSessionGenerationFacts(input) || input.sessionId === null) throw new SessionDeliveryGenerationUnavailableError();
	const lease = await prepareSessionGenerationLease(input);
	try {
		lease.assertDeliveryCurrent();
		return {
			assertCurrent: lease.assertDeliveryCurrent,
			release: lease.release
		};
	} catch (error) {
		lease.release();
		throw error;
	}
}
//#endregion
export { prepareSessionGenerationFacts as i, prepareCronRootSessionGeneration as n, prepareSessionDeliveryGeneration as r, isSessionDeliveryGenerationRevokedError as t };
