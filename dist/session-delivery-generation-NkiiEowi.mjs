import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { f as readDatabasePathIdentitySync } from "./sqlite-worker-identity-DLqVBf5J.mjs";
import { d as readSqliteNativeMutationRevision, f as registerSqliteSchemaMutationListener, y as hasPendingSqliteNativeExecution } from "./sqlite-schema-facts-C8u_9Af1.mjs";
import { s as registerOpenClawAgentDatabaseReadCandidateResource } from "./openclaw-agent-db-resources-DIwq7LM6.mjs";
import { a as sessionChanges, n as isSessionStoreTopologyChange } from "./session-row-changes-vFaNnKNM.mjs";
import { o as composeSessionSourceAssertion } from "./session-source-authority-fdILH-PW.mjs";
import { S as isCronSessionKey, x as isCronRunSessionKey } from "./session-key-CSDERtm3.mjs";
import { i as getOpenClawAgentDatabaseIfOpen } from "./openclaw-agent-db-_fC-kf1x.mjs";
import { t as assertSessionEntryCreationPublication } from "./session-accessor.sqlite-entry-cache-publication-BpzZnZxY.mjs";
import { A as projectSessionSharingEntry, _ as retainPreparedSessionGenerationFacts, f as readSessionEntryCreatedEntry, t as isPreparedSessionSharingChange } from "./session-accessor.sqlite-entry-cache-publication-state-4Z0giEC3.mjs";
import { n as captureSessionActorStorageOwner } from "./session-actor-storage-binding-oCtbPk00.mjs";
import { t as captureSessionStoreReadCandidates } from "./session-store-target-inventory-BkD5HoDI.mjs";
import { c as withSessionEntriesFromStoresInWorker } from "./session-entry-read-runtime-CgqUrGct.mjs";
import "./session-accessor.sqlite-entry-cache-BGcjBaH_.mjs";
import { d as readSessionEntryGenerationInDatabase } from "./session-accessor.sqlite-entry-read-CLHpEbhT.mjs";
import { y as isSessionLifecycleMutationActive } from "./session-lifecycle-admission-BihxXo5j.mjs";
import { n as captureSessionEntrySourceAssertion } from "./session-entry-source-authority-CY_NaTk4.mjs";
import path from "node:path";
import { isDeepStrictEqual } from "node:util";
//#region src/config/sessions/session-delivery-generation-errors.ts
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
//#endregion
//#region src/config/sessions/session-delivery-generation-memory.ts
/** Actor close owns revocation; every transport effect still reads current owner-held policy. */
async function prepareMemorySessionGeneration(source, input, onRevoked) {
	const selected = source.binding;
	const bound = selected?.agentId === source.agentId && selected.path === source.path && selected.actor.target.sessionKey === input.sessionKey ? selected.actor : void 0;
	const actor = bound ?? await source.owner?.acquireExisting(input.sessionKey, {
		assertCurrent: () => source.authority.assertCurrent(),
		assertReadable: () => source.authority.assertCurrent()
	});
	const releaseActor = () => {
		if (!bound) actor?.release();
	};
	const readEntry = () => {
		try {
			return actor?.snapshot(source.authority)?.entry;
		} catch (cause) {
			throw new SessionDeliveryGenerationUnavailableError({ cause });
		}
	};
	let initial;
	try {
		initial = readEntry();
		if ((initial?.sessionId ?? null) !== input.sessionId) throw new SessionDeliveryGenerationRevokedError();
	} catch (error) {
		releaseActor();
		throw error;
	}
	let active = true;
	let creationBound = false;
	let creationAdopted = false;
	let publishCreated;
	const readCurrent = () => {
		try {
			if (!active) throw new SessionDeliveryGenerationUnavailableError();
			const entry = readEntry();
			if (entry && creationBound && !creationAdopted) {
				creationAdopted = true;
				publishCreated?.(entry);
			}
			return entry;
		} catch (error) {
			onRevoked?.(error);
			throw error;
		}
	};
	const assertCurrent = () => {
		readCurrent();
	};
	return {
		assertCurrent,
		assertDeliveryCurrent() {
			if (isSessionLifecycleMutationActive(source.path, [input.sessionKey, input.sessionId ?? void 0])) throw new SessionDeliveryGenerationUnavailableError();
			assertCurrent();
		},
		readSessionSettings() {
			const entry = readCurrent();
			return {
				permissionMode: entry?.permissionMode,
				toolOverrides: entry?.toolOverrides
			};
		},
		prepareRead: () => void 0,
		release() {
			active = false;
			releaseActor();
		},
		bindCreation(operation, publishBinding) {
			if (initial || creationBound) throw new Error("Session creation admission changed; retry against the current session");
			const identity = actor?.target.database;
			if (identity?.kind !== "memory") throw new SessionDeliveryGenerationUnavailableError();
			assertSessionEntryCreationPublication(operation, {
				agentId: source.agentId,
				sessionKey: input.sessionKey,
				paths: /* @__PURE__ */ new Set([source.path]),
				databaseIdentity: identity.incarnation
			});
			creationBound = true;
			publishCreated = publishBinding;
			return assertCurrent;
		},
		isCreationAdopted() {
			readCurrent();
			return creationAdopted;
		}
	};
}
//#endregion
//#region src/config/sessions/session-delivery-generation.ts
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
	const memory = captureSessionActorStorageOwner({
		agentId: input.agentId,
		storePath: input.storePath,
		sessionKey: input.sessionKey,
		env: input.env
	}, {
		assertCurrent() {},
		authorize() {}
	});
	if (memory) return prepareMemorySessionGeneration(memory, input, onRevoked);
	const generation = { ...input };
	const releases = [];
	const paths = /* @__PURE__ */ new Set([path.resolve(generation.storePath)]);
	let active = true;
	let invalidated = false;
	let revoked = false;
	let publications = 0;
	let creation;
	let creationAdopted = false;
	let publishCreatedBinding;
	let databaseIdentity;
	let retained;
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
	const checkEntry = (entry, committed = true) => {
		if (entry === void 0) throw new SessionDeliveryGenerationUnavailableError();
		if ((entry?.sessionId ?? null) !== generation.sessionId || (entry?.lifecycleRevision ?? null) !== generation.lifecycleRevision) {
			if (!committed) throw new SessionDeliveryGenerationUnavailableError();
			revoked = true;
			throw new SessionDeliveryGenerationRevokedError();
		}
		return entry;
	};
	const changed = (change) => {
		if ("all" in change) {
			if (isSessionStoreTopologyChange(change)) return;
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
		if (change.scope === "automation" || change.scope === "acp" || change.sessionKey !== generation.sessionKey || change.agentId && change.agentId !== generation.agentId || !change.storePath || !paths.has(path.resolve(change.storePath))) return;
		publications += 1;
		if (!change.factsInvalidated && [
			"unchanged",
			"participants",
			"category",
			"member"
		].includes(change.facts?.kind ?? "")) return;
		if (creation && !creationAdopted) {
			const created = readSessionEntryCreatedEntry(change, creation);
			if (created && retained?.adoptCreatedEntry(created)) {
				generation.sessionId = created.sessionId;
				generation.lifecycleRevision = created.lifecycleRevision ?? null;
				creationAdopted = true;
				publishCreatedBinding?.({
					sessionId: created.sessionId,
					lifecycleRevision: created.lifecycleRevision
				});
			} else revoked = true;
		}
		if (!isPreparedSessionSharingChange(change)) invalidated = true;
	};
	releases.push(sessionChanges.subscribeFacts(changed));
	try {
		let workerSource;
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
		let assertNativeCurrent = () => {};
		while (!retained) {
			assertActive();
			const before = publications;
			retained = await withSessionEntriesFromStoresInWorker([{
				...generation,
				sessionKeys: [generation.sessionKey],
				projection: "sharing",
				includeAuthorization: true
			}], ([read]) => {
				assertActive();
				if (before !== publications) return;
				const entry = read.result.entries.find((row) => row.sessionKey === generation.sessionKey)?.entry;
				checkEntry(entry ?? null);
				const sharing = read.result.sharing;
				if (sharing) {
					const identity = readDatabasePathIdentitySync(sharing.source.path);
					const workerIdentity = read.result.databaseIdentity;
					if (!workerIdentity?.incarnation || workerIdentity.filename !== sharing.source.path || "file:" + workerIdentity.identity !== sharing.databaseIdentity || identity.key !== sharing.databaseIdentity || identity.birthtime === void 0 || identity.birthtime !== workerIdentity.birthtime) throw new SessionDeliveryGenerationUnavailableError();
					source = {
						path: sharing.source.path,
						identity: sharing.databaseIdentity
					};
				} else {
					const pathname = path.resolve(read.database.path);
					const original = originalSources.get(pathname);
					if (generation.sessionId !== null || !original?.key.startsWith("path:") || readDatabasePathIdentitySync(pathname).key !== original.key) throw new SessionDeliveryGenerationUnavailableError();
					source = {
						path: pathname,
						identity: original.key
					};
				}
				paths.add(path.resolve(source.path));
				databaseIdentity = source.identity;
				const prepared = retainPreparedSessionGenerationFacts({
					databaseIdentity: source.identity,
					sessionKey: generation.sessionKey,
					entry: entry ? projectSessionSharingEntry(entry) : void 0
				});
				releases.push(prepared.release);
				const nativeOptions = {
					...read.database,
					path: source.path
				};
				let native = getOpenClawAgentDatabaseIfOpen(nativeOptions);
				let nativeRevision = native && readSqliteNativeMutationRevision(native.db);
				const schemaChanged = () => {
					invalidated = true;
				};
				if (native) releases.push(registerSqliteSchemaMutationListener(native.db, schemaChanged));
				assertNativeCurrent = (current) => {
					const opened = getOpenClawAgentDatabaseIfOpen(nativeOptions);
					if (!native && opened) {
						native = opened;
						nativeRevision = void 0;
						releases.push(registerSqliteSchemaMutationListener(native.db, schemaChanged));
					} else if (opened !== native) {
						invalidated = true;
						throw new SessionDeliveryGenerationUnavailableError();
					}
					if (!native) return;
					if (hasPendingSqliteNativeExecution(native.db)) throw new SessionDeliveryGenerationUnavailableError();
					const revision = readSqliteNativeMutationRevision(native.db);
					if (revision === void 0) throw new SessionDeliveryGenerationUnavailableError();
					if (revision === nativeRevision) return;
					const committed = !native.db.isTransaction;
					try {
						const observed = checkEntry(readSessionEntryGenerationInDatabase(native, generation.sessionKey) ?? null, committed);
						if (observed?.permissionMode !== current?.permissionMode || !isDeepStrictEqual(observed?.toolOverrides, current?.toolOverrides) || readSqliteNativeMutationRevision(native.db) !== revision) throw new SessionDeliveryGenerationUnavailableError();
						assertActive();
						nativeRevision = revision;
					} catch (error) {
						if (committed) invalidated = true;
						throw error;
					}
				};
				return prepared;
			});
		}
		const assertSourceCurrent = () => {
			assertActive();
			if (!source || readDatabasePathIdentitySync(source.path).key !== source.identity) throw new SessionDeliveryGenerationUnavailableError();
		};
		const readCurrent = () => {
			assertSourceCurrent();
			const entry = checkEntry(retained?.readCurrent());
			assertNativeCurrent(entry);
			return entry;
		};
		const prepareRead = () => {
			assertSourceCurrent();
			return retained?.prepareRead()?.then(assertSourceCurrent);
		};
		if (generation.sessionId !== null && source) workerSource = captureSessionEntrySourceAssertion({
			scope: {
				...generation,
				storePath: source.path
			},
			expected: {
				sessionId: generation.sessionId,
				lifecycleRevision: generation.lifecycleRevision ?? void 0
			},
			fields: ["sessionId", "lifecycleRevision"],
			assertCurrent: () => readCurrent(),
			assertHostCurrent: assertSourceCurrent,
			refuse: () => {
				revoked = true;
				throw new SessionDeliveryGenerationRevokedError();
			}
		});
		const assertCurrent = (delivery = false) => {
			try {
				assertActive();
				if (delivery && [...paths].some((scope) => isSessionLifecycleMutationActive(scope, generation.sessionId ? [generation.sessionKey, generation.sessionId] : [generation.sessionKey]))) throw new SessionDeliveryGenerationUnavailableError();
				return readCurrent();
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
			assertCurrent: workerSource ? composeSessionSourceAssertion([workerSource], (assertSource) => {
				try {
					assertActive();
					assertSource();
				} catch (error) {
					const failure = isSessionDeliveryGenerationRevokedError(error) || isSessionDeliveryGenerationUnavailableError(error) ? error : new SessionDeliveryGenerationUnavailableError({ cause: error });
					onRevoked?.(failure);
					throw failure;
				}
			}) : assertCurrent,
			assertDeliveryCurrent: () => assertCurrent(true),
			readSessionSettings: () => {
				const current = assertCurrent();
				const entry = retained ? checkEntry(retained.readSessionSettings()) : current;
				return {
					permissionMode: entry?.permissionMode,
					toolOverrides: entry?.toolOverrides
				};
			},
			prepareRead,
			release,
			bindCreation: (operation, publishBinding) => {
				assertCurrent();
				if (creation) throw new Error("Session creation admission changed; retry against the current session");
				if (generation.sessionId !== null || !retained || !databaseIdentity) throw new SessionDeliveryGenerationUnavailableError();
				const target = {
					agentId: generation.agentId,
					sessionKey: generation.sessionKey,
					paths,
					databaseIdentity
				};
				assertSessionEntryCreationPublication(operation, target);
				creation = operation;
				publishCreatedBinding = publishBinding;
				return () => {
					if (creationAdopted) {
						assertCurrent();
						return;
					}
					assertActive();
					assertSessionEntryCreationPublication(operation, target);
				};
			},
			isCreationAdopted: () => creationAdopted
		};
	} catch (error) {
		release();
		if (isSessionDeliveryGenerationRevokedError(error) || isSessionDeliveryGenerationUnavailableError(error)) throw error;
		throw new SessionDeliveryGenerationUnavailableError({ cause: error });
	}
}
/** Session lifecycle owners compose these facts with their own admitted mutation authority. */
async function prepareSessionGenerationFacts(input) {
	const { assertCurrent, prepareRead, readSessionSettings, release, bindCreation, isCreationAdopted } = await prepareSessionGenerationLease(input);
	return {
		assertCurrent,
		prepareRead,
		readSessionSettings,
		release,
		bindCreation,
		isCreationAdopted
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
export { isSessionDeliveryGenerationRevokedError as i, prepareSessionDeliveryGeneration as n, prepareSessionGenerationFacts as r, prepareCronRootSessionGeneration as t };
