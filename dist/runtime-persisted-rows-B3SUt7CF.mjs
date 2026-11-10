import { t as freezeJsonSnapshot } from "./immutable-data-DqJSDH8t.mjs";
import { D as readSqliteDatabaseScopedWriteTokenForPath } from "./sqlite-database-admission-CqdNF9iE.mjs";
import { s as matchesAgentDatabaseReadCandidatePath } from "./agent-database-readers-DSwi8tar.mjs";
import { s as buildPersistedAuthProfileState, t as buildPersistedAuthProfileSecretsStore } from "./persisted-DbIYEoQ3.mjs";
import { v as resolveAuthProfileDatabasePath } from "./sqlite-BlFpr2YD.mjs";
import { d as resolveSharedAuthStorePath } from "./path-resolve-21Orzn6B.mjs";
//#region src/agents/auth-profiles/mutation-lineage.ts
const persistedMutationRecords = /* @__PURE__ */ new Map();
let persistedMutationRevision = 0;
let evictedOwnerMutationFloor = 0;
const MAX_PERSISTED_MUTATION_OWNERS = 256;
const MAX_PERSISTED_MUTATION_PROFILES_PER_OWNER = 256;
function resolveRuntimeStoreKey(agentDir, env) {
	return agentDir ? resolveAuthProfileDatabasePath(agentDir) : resolveSharedAuthStorePath(env);
}
function maxMutationRevision(record) {
	return Math.max(record.credentialRevision, record.profileSetRevision, record.stateRevision, record.mutationFloor, ...record.profileRevisions.values());
}
function getOrCreatePersistedMutationRecord(ownerKey) {
	const existing = persistedMutationRecords.get(ownerKey);
	if (existing) {
		persistedMutationRecords.delete(ownerKey);
		persistedMutationRecords.set(ownerKey, existing);
		return existing;
	}
	const record = {
		credentialRevision: evictedOwnerMutationFloor,
		credentialRevisionKnown: evictedOwnerMutationFloor === 0,
		profileSetRevision: evictedOwnerMutationFloor,
		profileSetRevisionKnown: evictedOwnerMutationFloor === 0,
		stateRevision: evictedOwnerMutationFloor,
		stateRevisionKnown: evictedOwnerMutationFloor === 0,
		mutationFloor: evictedOwnerMutationFloor,
		profileRevisions: /* @__PURE__ */ new Map()
	};
	persistedMutationRecords.set(ownerKey, record);
	while (persistedMutationRecords.size > MAX_PERSISTED_MUTATION_OWNERS) {
		const [oldestOwnerKey, oldest] = persistedMutationRecords.entries().next().value;
		persistedMutationRecords.delete(oldestOwnerKey);
		evictedOwnerMutationFloor = Math.max(evictedOwnerMutationFloor, maxMutationRevision(oldest));
	}
	record.mutationFloor = Math.max(record.mutationFloor, evictedOwnerMutationFloor);
	return record;
}
function setProfileMutationRevision(record, profileId, revision) {
	record.profileRevisions.delete(profileId);
	record.profileRevisions.set(profileId, revision);
	while (record.profileRevisions.size > MAX_PERSISTED_MUTATION_PROFILES_PER_OWNER) {
		const [oldestProfileId, oldestRevision] = record.profileRevisions.entries().next().value;
		record.profileRevisions.delete(oldestProfileId);
		record.mutationFloor = Math.max(record.mutationFloor, oldestRevision);
	}
}
/** All persisted rows, including usage state, follow their exact owner's write generation. */
function getRuntimeAuthProfileStoreMutationRevisionAtDatabasePath(ownerKey, scope = "rows") {
	const record = persistedMutationRecords.get(ownerKey);
	if (record && scope === "credentials") return Math.max(record.credentialRevision, record.profileSetRevision, record.mutationFloor);
	return record ? maxMutationRevision(record) : evictedOwnerMutationFloor;
}
function recordRuntimeAuthProfileStorePersistedMutation(ownerKey, mutation) {
	persistedMutationRevision += 1;
	const record = getOrCreatePersistedMutationRecord(ownerKey);
	if (mutation.profileSetChanged) {
		record.profileSetRevision = persistedMutationRevision;
		record.profileSetRevisionKnown = true;
	}
	if (mutation.credentialsChanged) {
		record.credentialRevision = persistedMutationRevision;
		record.credentialRevisionKnown = true;
		for (const profileId of mutation.profileIds) setProfileMutationRevision(record, profileId, persistedMutationRevision);
	}
	if (mutation.stateChanged) {
		record.stateRevision = persistedMutationRevision;
		record.stateRevisionKnown = true;
	}
}
function readMutationTokens(requestedKey, options, read) {
	if (options?.includeMain && options.owner?.kind === "unresolved") return {
		revision: 0,
		known: false
	};
	const mainKey = !options?.includeMain ? requestedKey : options.owner?.kind === "resolved" ? options.owner.sharedDatabasePath : resolveRuntimeStoreKey(void 0);
	const tokens = (requestedKey === mainKey || options?.includeMain !== true ? [requestedKey] : [requestedKey, mainKey]).map((key) => {
		const record = persistedMutationRecords.get(key);
		return record ? read(record) : {
			revision: evictedOwnerMutationFloor,
			known: evictedOwnerMutationFloor === 0
		};
	});
	return {
		revision: Math.max(0, ...tokens.map((token) => token.revision)),
		known: tokens.every((token) => token.known)
	};
}
/** Bounded persisted credential lineage; unknown means its exact token was evicted. */
function getRuntimeAuthProfileStoreCredentialMutationToken(agentDir, profileId, options) {
	const requestedKey = options?.owner?.databasePath ?? resolveRuntimeStoreKey(agentDir);
	if (!profileId) {
		const record = persistedMutationRecords.get(requestedKey);
		return record ? {
			revision: record.credentialRevision,
			known: record.credentialRevisionKnown
		} : {
			revision: evictedOwnerMutationFloor,
			known: evictedOwnerMutationFloor === 0
		};
	}
	return readMutationTokens(requestedKey, options, (record) => {
		const revision = record.profileRevisions.get(profileId);
		return revision === void 0 ? {
			revision: record.mutationFloor,
			known: record.mutationFloor === 0
		} : {
			revision,
			known: true
		};
	});
}
/** Persisted token for profile-id additions and removals in one owner store. */
function getRuntimeAuthProfileStoreProfileSetMutationToken(agentDir, databasePath) {
	const ownerKey = databasePath ?? resolveRuntimeStoreKey(agentDir);
	const record = persistedMutationRecords.get(ownerKey);
	return record ? {
		revision: record.profileSetRevision,
		known: record.profileSetRevisionKnown
	} : {
		revision: evictedOwnerMutationFloor,
		known: evictedOwnerMutationFloor === 0
	};
}
/** Persisted mutation token for non-secret selection state in one owner store. */
function getRuntimeAuthProfileStoreStateMutationToken(agentDir, options) {
	return readMutationTokens(options?.owner?.databasePath ?? resolveRuntimeStoreKey(agentDir), options, (record) => ({
		revision: record.stateRevision,
		known: record.stateRevisionKnown
	}));
}
const testing = {
	MAX_PERSISTED_MUTATION_OWNERS,
	MAX_PERSISTED_MUTATION_PROFILES_PER_OWNER,
	getPersistedMutationRecordCounts() {
		return {
			owners: persistedMutationRecords.size,
			profiles: Math.max(0, ...Array.from(persistedMutationRecords.values(), (record) => record.profileRevisions.size))
		};
	},
	resetPersistedMutationLineage() {
		persistedMutationRecords.clear();
		persistedMutationRevision = 0;
		evictedOwnerMutationFloor = 0;
	}
};
if (process.env.VITEST || false) globalThis[Symbol.for("openclaw.runtimeAuthSnapshotsTestApi")] = testing;
//#endregion
//#region src/agents/auth-profiles/runtime-persisted-rows.ts
/** Persisted rows follow their source owner, independently of resolved snapshot publication. */
function createRuntimeAuthProfileRowsCache(revisionAtPath) {
	const entries = /* @__PURE__ */ new Map();
	const hasCurrentSource = (databasePath, entry) => revisionAtPath(databasePath) === entry.revision && (entry.writeToken === void 0 || readSqliteDatabaseScopedWriteTokenForPath(databasePath, "auth-profiles") === entry.writeToken);
	return {
		hasSource(databasePath) {
			const entry = entries.get(databasePath);
			return Boolean(entry && hasCurrentSource(databasePath, entry));
		},
		recordSource(databasePath, identity, store) {
			const source = store && structuredClone(store);
			entries.set(databasePath, {
				identity,
				writeToken: readSqliteDatabaseScopedWriteTokenForPath(databasePath, "auth-profiles"),
				revision: revisionAtPath(databasePath),
				rows: source ? freezeJsonSnapshot({
					store: {
						status: "readable",
						raw: buildPersistedAuthProfileSecretsStore(source)
					},
					state: {
						status: "readable",
						raw: buildPersistedAuthProfileState(source)
					},
					cacheable: true
				}) : void 0
			});
		},
		invalidateRows(databasePath) {
			for (const [pathname, entry] of entries) if (databasePath === void 0 || pathname === databasePath) entry.rows = void 0;
		},
		clear(databasePath) {
			if (databasePath === void 0) entries.clear();
			else entries.delete(databasePath);
		},
		retire(candidates, retainedPaths) {
			for (const databasePath of entries.keys()) if (!retainedPaths?.has(databasePath) && candidates.some((candidate) => matchesAgentDatabaseReadCandidatePath(candidate, databasePath))) entries.delete(databasePath);
		},
		publishSnapshots(databasePaths) {
			for (const databasePath of entries.keys()) if (!databasePaths.has(databasePath)) entries.delete(databasePath);
		},
		rebase(databasePath) {
			const entry = entries.get(databasePath);
			if (entry && (entry.writeToken === void 0 || readSqliteDatabaseScopedWriteTokenForPath(databasePath, "auth-profiles") === entry.writeToken)) entry.revision = revisionAtPath(databasePath);
		},
		prepare(databasePath, reader) {
			return {
				assertCurrent: reader.assertCurrent,
				async read() {
					reader.assertCurrent();
					const revision = revisionAtPath(databasePath);
					const entry = entries.get(databasePath);
					const writeToken = readSqliteDatabaseScopedWriteTokenForPath(databasePath, "auth-profiles");
					if (writeToken !== void 0 && entry?.identity === reader.identity && entry?.revision === revision && entry.writeToken === writeToken && entry.rows) return entry.rows;
					if (entry) entry.rows = void 0;
					const rows = await reader.read();
					reader.assertCurrent();
					if (rows.store.status !== "unreadable" && rows.state.status !== "unreadable" && revisionAtPath(databasePath) === revision && (writeToken === void 0 || readSqliteDatabaseScopedWriteTokenForPath(databasePath, "auth-profiles") === writeToken)) {
						freezeJsonSnapshot(rows);
						entries.set(databasePath, {
							identity: reader.identity,
							writeToken,
							revision,
							...writeToken !== void 0 ? { rows } : {}
						});
					}
					return rows;
				}
			};
		}
	};
}
const runtimeAuthProfileRowsCache = createRuntimeAuthProfileRowsCache((databasePath) => String(getRuntimeAuthProfileStoreMutationRevisionAtDatabasePath(databasePath)));
//#endregion
export { getRuntimeAuthProfileStoreStateMutationToken as a, getRuntimeAuthProfileStoreProfileSetMutationToken as i, getRuntimeAuthProfileStoreCredentialMutationToken as n, recordRuntimeAuthProfileStorePersistedMutation as o, getRuntimeAuthProfileStoreMutationRevisionAtDatabasePath as r, resolveRuntimeStoreKey as s, runtimeAuthProfileRowsCache as t };
