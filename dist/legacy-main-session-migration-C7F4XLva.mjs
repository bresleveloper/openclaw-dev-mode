import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { t as hasErrnoCode } from "./errno-CkbDOfLk.mjs";
import { n as normalizeAgentId } from "./agent-id-GA8mwdTG.mjs";
import { M as tryResolveSoleAgentId, O as listAgentIds } from "./agent-scope-config-IQKOEtZ4.mjs";
import { E as resolveStateDir } from "./paths-DehQwyE0.mjs";
import { i as normalizeMainKey } from "./session-key-CUi_tcgF.mjs";
import { A as parseAgentSessionKey } from "./session-key-CBvmC8zz.mjs";
import { n as resolveSessionStoreCompatibilityAgentId } from "./legacy.default-agent-owner-B5Sofm47.mjs";
import { i as getNodeSqliteKysely, l as sqliteStringSet, n as executeSqliteQuerySync, r as executeSqliteQueryTakeFirstSync } from "./kysely-sync-Bn6Qrpbz.mjs";
import { n as readSqliteDataVersion } from "./node-sqlite-BO6jRFcG.mjs";
import { i as runSqliteDeferredTransactionSync } from "./sqlite-transaction-DKSXLQhb.mjs";
import { u as withExistingOpenClawStateDatabaseReadOnly } from "./openclaw-state-db-readonly-CbuLJI4_.mjs";
import { l as resolveSessionStorePathCore, o as resolveSessionArtifactDirectory } from "./paths-CcMbq5NY.mjs";
import { c as runOpenClawStateWriteTransaction } from "./openclaw-state-db-BFK9cMiV.mjs";
import { i as readOpenClawAgentDatabaseIdentity, r as isOpenClawAgentDatabasePathCurrent } from "./openclaw-agent-db-identity-DLTnzTd_.mjs";
import { f as runOpenClawAgentWriteTransaction, s as getOpenClawAgentDatabaseIfOpen, t as borrowOpenClawAgentDatabase } from "./openclaw-agent-db-CaQAStOA.mjs";
import { n as openOpenClawAgentDatabaseReadOnly, t as hasOpenClawAgentReadOnlySchema } from "./openclaw-agent-db-readonly-open-_lavN1YB.mjs";
import { r as isSameOpenClawAgentDatabasePath } from "./openclaw-agent-db-registry-CCrn1pMl.mjs";
import { n as withOpenClawAgentDatabaseReadOnly } from "./openclaw-agent-db-readonly-IBx2zWDG.mjs";
import { s as resolveSqliteTargetFromSessionStorePath } from "./session-sqlite-target-Dcog4O-M.mjs";
import { a as normalizeStoreSessionKey } from "./store-entry-DuM7NmYY.mjs";
import { a as getSessionKysely, h as runExclusiveSqliteSessionWrite } from "./session-accessor.sqlite-scope-DHC66DLY.mjs";
import { o as readExactSessionEntryRow } from "./session-accessor.sqlite-entry-read-yAa3_SVY.mjs";
import { i as resolveAllAgentSessionStoreCandidateTargetsSync, r as resolveAgentSessionStoreTargetsSync } from "./targets-Dmb8-YXN.mjs";
import { J as runSqliteSessionDeletionTransaction, X as withSqliteSessionDeletions, f as writeSessionEntry, g as copySessionNodeArtifactsForRepair, n as deleteLegacySessionEntryRows, y as readSessionNodeArtifactFingerprint, z as invalidateSessionEntryMaintenanceAgeFact } from "./session-accessor.sqlite-entry-store-BUBLa7UE.mjs";
import { r as collectSessionStateIdsForEntry } from "./session-accessor.sqlite-references-BKdpL7km.mjs";
import { n as assertSessionTranscriptHot } from "./session-cold-storage-state-BcO2Rrog.mjs";
import { i as rehomeSqliteSessionGenerationWindow, n as readSqliteSessionGenerationClaim, r as readSqliteSessionGenerationWindows, t as copySqliteSessionGenerationRows } from "./session-accessor.sqlite-generation-copy-w-TFq5Qq.mjs";
import { i as readExactSessionEntryRowForCanonicalRepair } from "./session-accessor.sqlite-canonical-repair-S6cGla1Q.mjs";
import { r as deleteSessionEntryLifecycle } from "./session-accessor.sqlite-lifecycle-BcFZBpmo.mjs";
import { n as replaceSessionOwnerInTransaction } from "./session-accessor.sqlite-owner-BHSlwrCn.mjs";
import fs from "node:fs";
import { isDeepStrictEqual } from "node:util";
import path from "node:path";
import { createHash } from "node:crypto";
//#region src/config/sessions/legacy-main-session-migration-claims.ts
function projectEntryIdentity(entry) {
	const projected = { ...entry };
	delete projected.sessionFile;
	delete projected.transcriptPath;
	return projected;
}
function generationWindowIdentity(generation, canonicalKey) {
	const { updated_at: _updatedAt, transcript_updated_at: _transcriptUpdatedAt, transcript_observed_at: _transcriptObservedAt, ...identity } = rehomeSqliteSessionGenerationWindow(generation.window, canonicalKey, /* @__PURE__ */ new Set([normalizeStoreSessionKey(generation.window.session_key.trim())]));
	return identity;
}
function generationsMatch(left, right, canonicalKey) {
	return left.contentFingerprint === right.contentFingerprint && isDeepStrictEqual(generationWindowIdentity(left, canonicalKey), generationWindowIdentity(right, canonicalKey));
}
function claimsMatch(left, right) {
	const generations = new Map(right.generations.map((generation) => [generation.window.session_id, generation]));
	return isDeepStrictEqual(projectEntryIdentity(left.entry), projectEntryIdentity(right.entry)) && left.generations.every((generation) => {
		const other = generations.get(generation.window.session_id);
		return !other || generationsMatch(generation, other, left.canonicalKey);
	});
}
function claimUnchanged(current, expected) {
	return current.databaseIdentity === expected.databaseIdentity && current.nodeArtifactFingerprint === expected.nodeArtifactFingerprint && isDeepStrictEqual(projectEntryIdentity(current.entry), projectEntryIdentity(expected.entry)) && current.generations.length === expected.generations.length && current.generations.every((generation, index) => generation.fingerprint === expected.generations[index]?.fingerprint);
}
function claimFullyCopied(source, destination) {
	const sessionIds = new Set(destination.generations.map((generation) => generation.window.session_id));
	return claimsMatch(source, destination) && source.generations.every((generation) => sessionIds.has(generation.window.session_id));
}
function readClaim(database, store, key, canonicalKey) {
	return runSqliteDeferredTransactionSync(database.db, () => {
		const row = readExactSessionEntryRowForCanonicalRepair(database, key);
		if (!row) return;
		const windows = readSqliteSessionGenerationWindows(database, [key], collectSessionStateIdsForEntry(row.entry));
		return {
			canonicalKey,
			databaseIdentity: readOpenClawAgentDatabaseIdentity(database).identity,
			entry: row.entry,
			generations: windows.map((window) => readSqliteSessionGenerationClaim(database, window)),
			key,
			nodeArtifactFingerprint: readSessionNodeArtifactFingerprint(database, key),
			store
		};
	});
}
async function restoreColdSessionClaims(claims, env, beforePersistentApply) {
	for (const [index, claim] of claims.entries()) {
		const cold = withOpenClawAgentDatabaseReadOnly((database) => executeSqliteQuerySync(database.db, getSessionKysely(database.db).selectFrom("session_transcript_cold_archives").select("session_id").where("session_id", "in", sqliteStringSet(claim.generations.map((generation) => generation.window.session_id)))).rows, {
			agentId: claim.store.databaseAgentId,
			env,
			path: claim.store.path
		});
		if (!cold.found) throw new Error(`Legacy session store changed before history restoration: ${claim.key}`);
		if (cold.value.length === 0 && claim.generations.every((generation) => !generation.coldArchive)) continue;
		const { restoreSessionColdTranscript } = await import("./session-cold-storage-CDCnO_Bk.mjs");
		for (const generation of cold.value) await restoreSessionColdTranscript({
			agentId: claim.store.databaseAgentId,
			env,
			sessionId: generation.session_id,
			storePath: claim.store.path
		}, beforePersistentApply);
		const refreshed = withOpenClawAgentDatabaseReadOnly((database) => readClaim(database, claim.store, claim.key, claim.canonicalKey), {
			agentId: claim.store.databaseAgentId,
			env,
			path: claim.store.path
		});
		if (!refreshed.found || !refreshed.value) throw new Error(`Legacy session changed during history restoration: ${claim.key}`);
		claims[index] = refreshed.value;
	}
}
//#endregion
//#region src/config/sessions/legacy-main-session-key-scan.ts
function inspectSessionStorePath(pathname) {
	let entry;
	try {
		entry = fs.lstatSync(pathname);
	} catch (error) {
		if (hasErrnoCode(error, "ENOENT")) return "missing";
		throw error;
	}
	if (!(entry.isSymbolicLink() ? fs.statSync(pathname) : entry).isFile()) throw new Error(`session store is not a regular file: ${pathname}`);
	return "present";
}
/** Returns the stored `agent:<id>:` prefix when the key is owned by the legacy agent. */
function legacyAgentKeyPrefix(key, legacyAgentId) {
	const parsed = parseAgentSessionKey(key);
	if (!parsed || normalizeAgentId(parsed.agentId) !== legacyAgentId) return null;
	const prefix = `agent:${parsed.agentId}:`;
	return key.startsWith(prefix) ? prefix : null;
}
function canonicalKeyFor(key, legacyAgentId, ownerAgentId) {
	const prefix = legacyAgentKeyPrefix(key, legacyAgentId);
	return prefix ? `agent:${ownerAgentId}:${key.slice(prefix.length)}` : null;
}
function storeHasLegacyAgentSessionKey(params) {
	const result = withOpenClawAgentDatabaseReadOnly((database) => executeSqliteQuerySync(database.db, getSessionKysely(database.db).selectFrom("session_nodes").select("session_key")).rows.some((row) => legacyAgentKeyPrefix(row.session_key, params.legacyAgentId) !== null), {
		agentId: params.store.databaseAgentId,
		env: params.env,
		path: params.store.path
	});
	return result.found ? result.value : false;
}
function readClaimsFromStores(params) {
	const targets = /* @__PURE__ */ new Set();
	const candidates = /* @__PURE__ */ new Map();
	const readStore = (store, read) => {
		try {
			if (inspectSessionStorePath(store.path) === "missing") return;
			const result = withOpenClawAgentDatabaseReadOnly(read, {
				agentId: store.databaseAgentId,
				env: params.env,
				path: store.path
			});
			return result.found ? result.value : void 0;
		} catch (error) {
			params.onUnreadable(store, error);
			return;
		}
	};
	for (const store of params.stores) {
		const keys = readStore(store, (database) => executeSqliteQuerySync(database.db, getSessionKysely(database.db).selectFrom("session_nodes").select("session_key")).rows);
		if (keys) candidates.set(store, keys.map(({ session_key: key }) => {
			const canonicalKey = canonicalKeyFor(key, params.legacyAgentId, params.ownerAgentId);
			if (canonicalKey) targets.add(canonicalKey);
			return {
				key,
				canonicalKey: canonicalKey ?? key
			};
		}));
	}
	const canonical = [];
	const legacy = [];
	for (const [store, keys] of candidates) {
		const targeted = keys.filter(({ canonicalKey }) => targets.has(canonicalKey));
		if (targeted.length === 0) continue;
		const claims = readStore(store, (database) => targeted.flatMap(({ key, canonicalKey }) => {
			const claim = readClaim(database, store, key, canonicalKey);
			return claim ? [claim] : [];
		}));
		for (const claim of claims ?? []) (claim.key === claim.canonicalKey ? canonical : legacy).push(claim);
	}
	return {
		canonical,
		legacy
	};
}
//#endregion
//#region src/config/sessions/legacy-main-session-migration-operations.ts
function samePhysicalStore(left, right) {
	return isSameOpenClawAgentDatabasePath(left.path, right.path);
}
function freshestClaim(claims) {
	return claims.toSorted((left, right) => {
		return (right.entry.updatedAt ?? 0) - (left.entry.updatedAt ?? 0) || left.key.localeCompare(right.key) || left.store.path.localeCompare(right.store.path);
	})[0];
}
function warningForDivergence(kind, canonicalKey, claims) {
	return `session: ${kind} for ${canonicalKey}; preserved claims ${claims.map((claim) => `${claim.store.path}#${claim.key}`).join(", ")}. Run openclaw doctor --fix to quarantine the losing claims.`;
}
function writeMigratedSessionClaim(database, sessionKey, entry) {
	invalidateSessionEntryMaintenanceAgeFact(database.db);
	writeSessionEntry(database, sessionKey, entry, {
		allowStoredAliases: true,
		previousEntry: null
	});
	replaceSessionOwnerInTransaction(database, sessionKey, entry.owner);
}
function mutateLegacySessionClaims(params, commit) {
	const scope = {
		agentId: params.store.databaseAgentId,
		env: params.env,
		path: params.store.path,
		ownerStorePath: params.store.ownerStorePath
	};
	return withSqliteSessionDeletions(scope, params.claims.map(({ key: sessionKey, entry }) => ({
		sessionKey,
		entry
	})), async (assertCurrent) => runExclusiveSqliteSessionWrite(scope, async () => {
		assertCurrent();
		params.beforePersistentApply?.();
		return runSqliteSessionDeletionTransaction(commit, scope, { operationLabel: params.operationLabel });
	}, params.operationLabel));
}
function migrateClaimsInPlace(params) {
	return mutateLegacySessionClaims({
		...params,
		claims: params.aliases.filter((claim) => claim.key !== params.canonicalKey),
		operationLabel: "session-migration.legacy-main-in-place"
	}, (database) => {
		const currentAliases = params.aliases.map((claim) => readClaim(database, params.store, claim.key, params.canonicalKey));
		const currentCanonical = readClaim(database, params.store, params.canonicalKey, params.canonicalKey);
		if (currentAliases.some((claim, index) => !claim || !claimUnchanged(claim, params.aliases[index])) || (params.canonical ? !currentCanonical || !claimUnchanged(currentCanonical, params.canonical) : currentCanonical !== void 0)) return;
		if (!currentCanonical) writeMigratedSessionClaim(database, params.canonicalKey, params.winner.entry);
		deleteLegacySessionEntryRows(database, params.aliases.map((claim) => claim.key), params.canonicalKey, {
			rehomeMembers: true,
			validatedEntries: new Map(currentAliases.map((claim) => [claim.key, claim.entry]))
		});
		return readClaim(database, params.store, params.canonicalKey, params.canonicalKey);
	});
}
async function copyClaimCrossStore(params) {
	const destinationOptions = {
		agentId: params.destination.databaseAgentId,
		env: params.env,
		path: params.destination.path
	};
	return await runExclusiveSqliteSessionWrite(destinationOptions, async () => {
		params.beforePersistentApply?.();
		return runOpenClawAgentWriteTransaction((destinationDatabase) => {
			const current = readClaim(destinationDatabase, params.destination, params.canonicalKey, params.canonicalKey);
			if (params.expectedDestination && (!current || !claimUnchanged(current, params.expectedDestination)) || current && !claimsMatch(params.source, current)) return;
			const source = withOpenClawAgentDatabaseReadOnly((sourceDatabase) => runSqliteDeferredTransactionSync(sourceDatabase.db, () => {
				const fresh = readClaim(sourceDatabase, params.source.store, params.source.key, params.canonicalKey);
				if (!fresh || !claimUnchanged(fresh, params.source) || fresh.databaseIdentity === readOpenClawAgentDatabaseIdentity(destinationDatabase).identity) return;
				const destinationWindows = new Map(readSqliteSessionGenerationWindows(destinationDatabase, [], fresh.generations.map((generation) => generation.window.session_id)).map((window) => [window.session_id, window]));
				const currentGenerations = new Map(current?.generations.map((generation) => [generation.window.session_id, generation]));
				const missing = [];
				for (const generation of fresh.generations) {
					assertSessionTranscriptHot(sourceDatabase.db, generation.window.session_id);
					if (normalizeStoreSessionKey(generation.window.session_key.trim()) !== normalizeStoreSessionKey(params.source.key.trim())) return;
					const existing = destinationWindows.get(generation.window.session_id);
					if (!existing) missing.push(generation);
					else if (existing.session_key !== params.canonicalKey || !generationsMatch(generation, currentGenerations.get(existing.session_id) ?? readSqliteSessionGenerationClaim(destinationDatabase, existing), params.canonicalKey)) return;
				}
				if (!current) {
					if (readExactSessionEntryRow(destinationDatabase, params.canonicalKey)) return;
					writeMigratedSessionClaim(destinationDatabase, params.canonicalKey, fresh.entry);
				}
				const sourceDb = getSessionKysely(sourceDatabase.db);
				const destinationDb = getSessionKysely(destinationDatabase.db);
				const sourceKeys = /* @__PURE__ */ new Set([normalizeStoreSessionKey(params.source.key.trim())]);
				for (const generation of missing) {
					const window = generation.window;
					const links = executeSqliteQuerySync(sourceDatabase.db, sourceDb.selectFrom("session_conversations").selectAll().where("session_id", "=", window.session_id)).rows;
					const conversationIds = [...window.primary_conversation_id ? [window.primary_conversation_id] : [], ...links.map((link) => link.conversation_id)];
					for (const conversation of executeSqliteQuerySync(sourceDatabase.db, sourceDb.selectFrom("conversations").selectAll().where("conversation_id", "in", sqliteStringSet(conversationIds))).rows) executeSqliteQuerySync(destinationDatabase.db, destinationDb.insertInto("conversations").values(conversation).onConflict((conflict) => conflict.column("conversation_id").doNothing()));
					const mapped = rehomeSqliteSessionGenerationWindow(window, params.canonicalKey, sourceKeys);
					executeSqliteQuerySync(destinationDatabase.db, destinationDb.insertInto("session_windows").values(mapped).onConflict((conflict) => conflict.column("session_id").doUpdateSet(mapped)));
					copySqliteSessionGenerationRows({
						destination: destinationDatabase,
						source: sourceDatabase,
						sessionId: window.session_id,
						sourceWindowPresent: true
					});
					executeSqliteQuerySync(destinationDatabase.db, destinationDb.deleteFrom("session_conversations").where("session_id", "=", window.session_id));
					for (const link of links) executeSqliteQuerySync(destinationDatabase.db, destinationDb.insertInto("session_conversations").values(link));
				}
				copySessionNodeArtifactsForRepair(sourceDatabase, destinationDatabase, [fresh.key], params.canonicalKey, { includeMembers: false });
				return readClaim(destinationDatabase, params.destination, params.canonicalKey, params.canonicalKey);
			}), {
				agentId: params.source.store.databaseAgentId,
				env: params.env,
				path: params.source.store.path
			});
			return source.found ? source.value : void 0;
		}, destinationOptions);
	}, "session-migration.legacy-main-copy");
}
async function deleteExpectedClaim(claim, commitGuard) {
	return (await deleteSessionEntryLifecycle({
		commitGuard,
		agentId: claim.store.databaseAgentId,
		archiveTranscript: false,
		deleteTranscriptWithoutArchive: true,
		expectedEntry: claim.entry,
		expectedDatabaseIdentity: claim.databaseIdentity,
		expectedGenerations: claim.generations,
		expectedNodeArtifactFingerprint: claim.nodeArtifactFingerprint,
		requireWriteSuccess: true,
		storePath: claim.store.ownerStorePath,
		target: {
			canonicalKey: claim.key,
			storeKeys: [claim.key]
		}
	})).deleted;
}
async function deleteCopiedClaims(params) {
	const sources = params.aliases.filter((claim) => !samePhysicalStore(claim.store, params.destination));
	if (sources.length === 0) return;
	const options = {
		agentId: params.destination.databaseAgentId,
		env: params.env,
		path: params.destination.path
	};
	const changed = () => /* @__PURE__ */ new Error(`Canonical session changed before legacy cleanup: ${params.canonicalKey}`);
	const writer = getOpenClawAgentDatabaseIfOpen(options);
	if (!writer) throw changed();
	const destinationIdentity = readOpenClawAgentDatabaseIdentity(writer).identity;
	const retained = borrowOpenClawAgentDatabase(options);
	let reader;
	try {
		const opened = openOpenClawAgentDatabaseReadOnly(options);
		if (!opened.found) throw changed();
		reader = opened.database;
		const destinationReader = reader;
		const assertCurrent = () => {
			if (retained.db !== writer.db || sources.some((claim) => claim.databaseIdentity === destinationIdentity) || getOpenClawAgentDatabaseIfOpen(options) !== writer || !isOpenClawAgentDatabasePathCurrent(writer) || writer.db.isTransaction || !isOpenClawAgentDatabasePathCurrent(destinationReader) || readOpenClawAgentDatabaseIdentity(destinationReader).identity !== destinationIdentity) throw changed();
		};
		let verifiedVersion;
		const assertCopied = () => {
			params.beforePersistentApply?.();
			assertCurrent();
			const version = readSqliteDataVersion(destinationReader.db);
			if (version === verifiedVersion) return;
			if (!hasOpenClawAgentReadOnlySchema(destinationReader)) throw changed();
			const destination = readClaim(destinationReader, params.destination, params.canonicalKey, params.canonicalKey);
			if (!destination || !claimUnchanged(destination, params.receipt)) throw changed();
			assertCurrent();
			if (readSqliteDataVersion(destinationReader.db) !== version) throw changed();
			verifiedVersion = version;
		};
		assertCopied();
		for (const claim of sources) if (!await deleteExpectedClaim(claim, assertCopied)) return claim;
		return;
	} finally {
		try {
			reader?.close();
		} finally {
			retained.release();
		}
	}
}
function quarantineClaim(params) {
	return mutateLegacySessionClaims({
		beforePersistentApply: params.beforePersistentApply,
		store: params.claim.store,
		env: params.env,
		claims: [params.claim],
		operationLabel: "session-migration.legacy-main-quarantine"
	}, (database) => {
		const fresh = readClaim(database, params.claim.store, params.claim.key, params.claim.canonicalKey);
		if (!fresh || !claimUnchanged(fresh, params.claim)) return;
		let quarantineKey;
		for (let index = 1;; index += 1) {
			const candidate = `agent:${params.ownerAgentId}:legacy-main-conflict-${index}`;
			if (!readExactSessionEntryRow(database, candidate)) {
				quarantineKey = candidate;
				break;
			}
		}
		writeMigratedSessionClaim(database, quarantineKey, params.claim.entry);
		deleteLegacySessionEntryRows(database, [params.claim.key], quarantineKey, {
			rehomeMembers: true,
			validatedEntries: /* @__PURE__ */ new Map([[fresh.key, fresh.entry]])
		});
		return quarantineKey;
	});
}
async function processIdenticalClaims(params) {
	const winner = params.canonical ?? freshestClaim(params.aliases);
	const crossStore = params.aliases.some((claim) => !samePhysicalStore(claim.store, params.destination));
	if (params.mode !== "doctor-fix") return {
		kind: params.canonical ? "canonical-exists-identical" : crossStore ? "migrated-cross-store" : "migrated-in-place",
		canonicalKey: params.canonicalKey,
		paths: [...new Set(params.aliases.map((claim) => claim.store.path))],
		sourceKeys: params.aliases.map((claim) => claim.key)
	};
	let canonical = params.canonical;
	const destinationAliases = params.aliases.filter((claim) => samePhysicalStore(claim.store, params.destination));
	if (destinationAliases.length > 0) {
		canonical = await migrateClaimsInPlace({
			beforePersistentApply: params.beforePersistentApply,
			aliases: destinationAliases,
			...canonical ? { canonical } : {},
			canonicalKey: params.canonicalKey,
			env: params.env,
			store: params.destination,
			winner: canonical ?? freshestClaim(destinationAliases)
		});
		if (!canonical) return {
			kind: "divergent-aliases",
			canonicalKey: params.canonicalKey,
			detail: "source aliases changed during the in-place transaction"
		};
	}
	for (const sourceBefore of params.aliases) {
		if (samePhysicalStore(sourceBefore.store, params.destination)) continue;
		const copied = await copyClaimCrossStore({
			beforePersistentApply: params.beforePersistentApply,
			canonicalKey: params.canonicalKey,
			destination: params.destination,
			...canonical ? { expectedDestination: canonical } : {},
			env: params.env,
			source: sourceBefore
		});
		const sourceAfter = withOpenClawAgentDatabaseReadOnly((database) => readClaim(database, sourceBefore.store, sourceBefore.key, params.canonicalKey), {
			agentId: sourceBefore.store.databaseAgentId,
			env: params.env,
			path: sourceBefore.store.path
		});
		if (!copied || !claimFullyCopied(sourceBefore, copied) || !sourceAfter.found || !sourceAfter.value || !claimUnchanged(sourceAfter.value, sourceBefore)) return {
			kind: "divergent-canonical",
			canonicalKey: params.canonicalKey,
			detail: "source or imported canonical changed during cross-store copy verification"
		};
		canonical = copied;
	}
	if (!canonical || !claimsMatch(canonical, winner)) return {
		kind: "divergent-canonical",
		canonicalKey: params.canonicalKey,
		detail: "canonical content differs from the legacy claim"
	};
	const changedSource = await deleteCopiedClaims({
		...params,
		receipt: canonical
	});
	if (changedSource) return {
		kind: "divergent-canonical",
		canonicalKey: params.canonicalKey,
		detail: `source changed before expected-entry cleanup: ${changedSource.store.path}#${changedSource.key}`
	};
	return {
		kind: params.canonical ? "canonical-exists-identical" : crossStore ? "migrated-cross-store" : "migrated-in-place",
		canonicalKey: params.canonicalKey,
		paths: [...new Set(params.aliases.map((claim) => claim.store.path))],
		sourceKeys: params.aliases.map((claim) => claim.key)
	};
}
async function repairDivergentClaims(params) {
	const winner = params.destinationCanonical ?? freshestClaim(params.claims);
	if (!params.destinationCanonical) {
		const migrated = await processIdenticalClaims({
			beforePersistentApply: params.beforePersistentApply,
			aliases: [winner],
			canonicalKey: params.canonicalKey,
			destination: params.destination,
			env: params.env,
			mode: "doctor-fix"
		});
		if (migrated.kind === "divergent-aliases" || migrated.kind === "divergent-canonical") return {
			quarantinedKeys: [],
			resolved: false
		};
	}
	const canonicalResult = withOpenClawAgentDatabaseReadOnly((database) => readClaim(database, params.destination, params.canonicalKey, params.canonicalKey), {
		agentId: params.destination.databaseAgentId,
		env: params.env,
		path: params.destination.path
	});
	const canonical = canonicalResult.found ? canonicalResult.value : void 0;
	if (!canonical || !claimsMatch(canonical, winner)) return {
		quarantinedKeys: [],
		resolved: false
	};
	const remaining = params.claims.filter((claim) => claim !== winner && claim !== params.destinationCanonical);
	const identical = remaining.filter((claim) => claimsMatch(claim, canonical));
	if (identical.length > 0) {
		const migrated = await processIdenticalClaims({
			beforePersistentApply: params.beforePersistentApply,
			aliases: identical,
			canonical,
			canonicalKey: params.canonicalKey,
			destination: params.destination,
			env: params.env,
			mode: "doctor-fix"
		});
		if (migrated.kind === "divergent-aliases" || migrated.kind === "divergent-canonical") return {
			quarantinedKeys: [],
			resolved: false
		};
	}
	const quarantinedKeys = [];
	for (const claim of remaining) {
		if (identical.includes(claim)) continue;
		const quarantineKey = await quarantineClaim({
			beforePersistentApply: params.beforePersistentApply,
			claim,
			env: params.env,
			ownerAgentId: params.ownerAgentId
		});
		if (!quarantineKey) return {
			quarantinedKeys,
			resolved: false
		};
		quarantinedKeys.push(quarantineKey);
	}
	return {
		quarantinedKeys,
		resolved: true
	};
}
//#endregion
//#region src/config/sessions/legacy-main-session-migration.ts
const SOURCE_KEY = "legacy-main-session-keys";
const MIGRATION_KIND = "legacy-main-session-keys-v1";
const REPORT_VERSION = 1;
function resolveArmingDecision(cfg, legacyAgentId) {
	const roster = new Set(listAgentIds(cfg).map(normalizeAgentId));
	if (roster.has(legacyAgentId)) return {
		armed: false,
		reason: "legacy-agent-present"
	};
	const sole = tryResolveSoleAgentId(cfg);
	if (sole && roster.has(normalizeAgentId(sole))) return {
		armed: true,
		ownerAgentId: normalizeAgentId(sole)
	};
	const sessionStoreOwner = cfg.agents?.defaults?.sessionStore?.agentId?.trim();
	if (sessionStoreOwner) {
		const normalized = normalizeAgentId(sessionStoreOwner);
		if (roster.has(normalized)) return {
			armed: true,
			ownerAgentId: normalized
		};
	}
	return {
		armed: false,
		reason: "owner-unresolved"
	};
}
function addPhysicalStore(stores, candidate) {
	if (!stores.some((store) => samePhysicalStore(store, candidate))) stores.push(candidate);
}
function resolveMissingPhysicalPath(pathname) {
	let current = path.resolve(pathname);
	const suffix = [];
	while (true) try {
		return path.join(fs.realpathSync.native(current), ...suffix);
	} catch (error) {
		if (error.code !== "ENOENT") throw error;
		const parent = path.dirname(current);
		if (parent === current) return path.resolve(current, ...suffix);
		suffix.unshift(path.basename(current));
		current = parent;
	}
}
function resolvePhysicalPathIdentity(pathname) {
	try {
		const stat = fs.statSync(pathname, { bigint: true });
		if (!stat.isFile()) throw new Error(`session store is not a regular file: ${pathname}`);
		return `file:${stat.dev}:${stat.ino}`;
	} catch (error) {
		if (error.code !== "ENOENT") throw error;
		return `missing:${resolveMissingPhysicalPath(pathname)}`;
	}
}
function resolvePhysicalStores(params) {
	const logicalTargets = [
		...resolveAllAgentSessionStoreCandidateTargetsSync(params.cfg, { env: params.env }),
		...resolveAgentSessionStoreTargetsSync(params.cfg, params.legacyAgentId, { env: params.env }),
		{
			agentId: params.legacyAgentId,
			storePath: resolveSessionStorePathCore(params.cfg.session?.store, {
				agentId: params.legacyAgentId,
				env: params.env
			})
		}
	];
	if (params.ownerAgentId) logicalTargets.push({
		agentId: params.ownerAgentId,
		storePath: resolveSessionStorePathCore(params.cfg.session?.store, {
			agentId: params.ownerAgentId,
			env: params.env
		})
	});
	const defaultAgentId = params.ownerAgentId ?? resolveSessionStoreCompatibilityAgentId(params.cfg);
	const stores = [];
	const jsonPaths = /* @__PURE__ */ new Set();
	const unreadable = [];
	for (const target of logicalTargets) try {
		if (!target.storePath.endsWith(".sqlite") && inspectSessionStorePath(target.storePath) === "present") jsonPaths.add(path.resolve(target.storePath));
		const resolved = resolveSqliteTargetFromSessionStorePath(target.storePath, {
			agentId: target.agentId,
			defaultAgentId,
			env: params.env
		});
		const physical = {
			databaseAgentId: normalizeAgentId(resolved.agentId ?? target.agentId),
			ownerStorePath: target.storePath,
			path: resolved.path
		};
		resolvePhysicalPathIdentity(physical.path);
		addPhysicalStore(stores, physical);
	} catch (error) {
		if (params.mode === "doctor-fix") throw new Error(`cannot inspect legacy session store ${target.storePath}: ${String(error)}`, { cause: error });
		unreadable.push({
			kind: "store-unreadable",
			detail: String(error),
			paths: [target.storePath]
		});
	}
	return {
		jsonPaths: [...jsonPaths],
		stores,
		unreadable
	};
}
function resolveSourceLayout(resolved) {
	return [.../* @__PURE__ */ new Set([...resolved.stores.map((store) => `sqlite:${store.databaseAgentId}:${resolvePhysicalPathIdentity(store.path)}`), ...resolved.jsonPaths.map((pathname) => `json:${resolvePhysicalPathIdentity(pathname)}`)])].toSorted();
}
function readLedger(env) {
	return withExistingOpenClawStateDatabaseReadOnly(({ db }) => {
		const row = executeSqliteQueryTakeFirstSync(db, getNodeSqliteKysely(db).selectFrom("migration_sources").select(["report_json", "status"]).where("source_key", "=", SOURCE_KEY));
		if (!row) return;
		try {
			const parsed = JSON.parse(row.report_json);
			if (!isRecord(parsed) || parsed.version !== REPORT_VERSION || typeof parsed.legacyAgentId !== "string" || typeof parsed.mainKey !== "string" || typeof parsed.ownerAgentId !== "string" || !Array.isArray(parsed.outcomes) || !Array.isArray(parsed.sourceLayout) || parsed.sourceLayout.some((entry) => typeof entry !== "string") || parsed.status !== "complete") return;
			return {
				report: parsed,
				status: row.status
			};
		} catch {
			return;
		}
	}, { env }) ?? void 0;
}
function ledgerMatches(ledger, identity) {
	return ledger?.status === "completed" && ledger.report.version === REPORT_VERSION && ledger.report.status === "complete" && ledger.report.legacyAgentId === identity.legacyAgentId && ledger.report.ownerAgentId === identity.ownerAgentId && ledger.report.mainKey === identity.mainKey && ledger.report.sourceLayout.length === identity.sourceLayout.length && ledger.report.sourceLayout.every((entry, index) => entry === identity.sourceLayout[index]);
}
function writeLedger(params) {
	const report = {
		version: REPORT_VERSION,
		...params.identity,
		outcomes: params.outcomes,
		status: "complete"
	};
	const reportJson = JSON.stringify(report);
	const identityHash = createHash("sha256").update(JSON.stringify(params.identity)).digest("hex");
	const runId = `${SOURCE_KEY}:${identityHash.slice(0, 24)}`;
	params.beforePersistentApply?.();
	runOpenClawStateWriteTransaction(({ db }) => {
		const kysely = getNodeSqliteKysely(db);
		executeSqliteQuerySync(db, kysely.insertInto("migration_runs").values({
			id: runId,
			started_at: params.now,
			finished_at: params.now,
			status: "completed",
			report_json: reportJson
		}).onConflict((conflict) => conflict.column("id").doUpdateSet({
			finished_at: params.now,
			status: "completed",
			report_json: reportJson
		})));
		executeSqliteQuerySync(db, kysely.insertInto("migration_sources").values({
			source_key: SOURCE_KEY,
			migration_kind: MIGRATION_KIND,
			source_path: params.stateDir,
			target_table: "session_nodes",
			source_sha256: identityHash,
			source_size_bytes: null,
			source_record_count: params.outcomes.length,
			last_run_id: runId,
			status: "completed",
			imported_at: params.now,
			removed_source: 1,
			report_json: reportJson
		}).onConflict((conflict) => conflict.column("source_key").doUpdateSet({
			source_path: params.stateDir,
			source_sha256: identityHash,
			source_record_count: params.outcomes.length,
			last_run_id: runId,
			status: "completed",
			imported_at: params.now,
			removed_source: 1,
			report_json: reportJson
		})));
	}, { env: params.env }, { operationLabel: "session-migration.legacy-main-ledger" });
}
/** Migrates retired agent-owned session keys without adding runtime read aliases. */
async function migrateLegacyMainSessionKeysInternal(params) {
	const env = params.env ?? process.env;
	const legacyAgentId = normalizeAgentId(params.legacyAgentId ?? "main");
	const mainKey = normalizeMainKey(params.cfg.session?.mainKey);
	const arming = resolveArmingDecision(params.cfg, legacyAgentId);
	const base = {
		changes: [],
		legacyAgentId,
		mainKey,
		warnings: []
	};
	if (!arming.armed) {
		if (arming.reason === "owner-unresolved") {
			let rowsMayExist;
			try {
				const resolved = resolvePhysicalStores({
					cfg: params.cfg,
					env,
					legacyAgentId,
					mode: params.mode
				});
				rowsMayExist = resolved.unreadable.length > 0 || resolved.jsonPaths.length > 0 || resolved.stores.some((store) => inspectSessionStorePath(store.path) === "present" && storeHasLegacyAgentSessionKey({
					env,
					legacyAgentId,
					store
				}));
			} catch {
				rowsMayExist = true;
			}
			if (!rowsMayExist) return {
				...base,
				armed: false,
				complete: true,
				ledgerComplete: false,
				outcomes: [{
					kind: "no-legacy-rows",
					detail: "no configured owner"
				}]
			};
		}
		const unresolved = arming.reason === "owner-unresolved";
		return {
			...base,
			armed: false,
			complete: false,
			ledgerComplete: false,
			outcomes: [{
				kind: "not-armed",
				detail: arming.reason
			}],
			warnings: unresolved ? [`session: legacy ${legacyAgentId} rows have no unambiguous configured owner; preserve them and run openclaw doctor --fix after assigning agents.defaults.sessionStore.agentId`] : []
		};
	}
	const ownerAgentId = arming.ownerAgentId;
	const resolved = resolvePhysicalStores({
		cfg: params.cfg,
		env,
		legacyAgentId,
		mode: params.mode,
		ownerAgentId
	});
	const outcomes = [...resolved.jsonPaths.map((pathname) => ({
		kind: "legacy-json-store",
		paths: [pathname],
		detail: "Doctor must migrate JSON sessions to SQLite before legacy-main key migration"
	})), ...resolved.unreadable];
	const warnings = [...base.warnings];
	for (const unreadable of resolved.unreadable) warnings.push(`session: could not inspect ${unreadable.paths?.[0] ?? "session store"}: ${unreadable.detail ?? "unknown error"}; run openclaw doctor --fix`);
	for (const pathname of resolved.jsonPaths) warnings.push(`session: deferred legacy-main session migration for JSON store ${pathname}; run openclaw doctor --fix`);
	const identityBase = {
		legacyAgentId,
		mainKey,
		ownerAgentId
	};
	const identity = {
		...identityBase,
		sourceLayout: resolveSourceLayout(resolved)
	};
	let matchingCompletedLedger = false;
	if (params.mode !== "doctor-fix" && outcomes.length === 0) try {
		if (ledgerMatches(readLedger(env), identity)) {
			matchingCompletedLedger = true;
			if (!params.forceScan) return {
				...base,
				armed: true,
				complete: true,
				ledgerComplete: true,
				ownerAgentId,
				outcomes: [{
					kind: "no-legacy-rows",
					detail: "matching completed ledger"
				}]
			};
		}
	} catch (error) {
		return {
			...base,
			armed: true,
			complete: false,
			ledgerComplete: false,
			ownerAgentId,
			outcomes: [{
				kind: "store-unreadable",
				detail: String(error)
			}],
			warnings: [`session: could not read the legacy-main migration ledger: ${String(error)}; run openclaw doctor --fix`]
		};
	}
	const { legacy: allLegacy, canonical: allCanonical } = readClaimsFromStores({
		env,
		legacyAgentId,
		ownerAgentId,
		stores: resolved.stores,
		onUnreadable: (store, error) => {
			if (params.mode === "doctor-fix") throw new Error(`cannot read legacy session store ${store.path}: ${String(error)}`, { cause: error });
			outcomes.push({
				kind: "store-unreadable",
				detail: String(error),
				paths: [store.path]
			});
			warnings.push(`session: could not inspect ${store.path}: ${String(error)}; run openclaw doctor --fix`);
		}
	});
	if (params.mode === "detect" && allLegacy.length > 0) warnings.push(`session: ${allLegacy.length} retained legacy ${legacyAgentId} session claim(s) require Doctor repair; run openclaw doctor --fix`);
	const destinationLogical = resolveSessionStorePathCore(params.cfg.session?.store, {
		agentId: ownerAgentId,
		env
	});
	const destinationResolved = resolveSqliteTargetFromSessionStorePath(destinationLogical, {
		agentId: ownerAgentId,
		defaultAgentId: ownerAgentId,
		env
	});
	const destination = resolved.stores.find((store) => isSameOpenClawAgentDatabasePath(store.path, destinationResolved.path)) ?? {
		databaseAgentId: normalizeAgentId(destinationResolved.agentId ?? ownerAgentId),
		ownerStorePath: destinationLogical,
		path: destinationResolved.path
	};
	const destinationArchiveDirectory = params.mode !== "doctor-fix" ? void 0 : resolveMissingPhysicalPath(path.join(resolveSessionArtifactDirectory(destinationResolved.path), "cold"));
	const byCanonical = /* @__PURE__ */ new Map();
	for (const claim of allLegacy) {
		const claims = byCanonical.get(claim.canonicalKey) ?? [];
		claims.push(claim);
		byCanonical.set(claim.canonicalKey, claims);
	}
	for (const [canonicalKey, aliases] of byCanonical) {
		const canonicalClaims = allCanonical.filter((claim) => claim.key === canonicalKey);
		if (params.mode === "doctor-fix" && [...aliases, ...canonicalClaims].some((claim) => !samePhysicalStore(claim.store, destination) || resolveMissingPhysicalPath(path.join(resolveSessionArtifactDirectory(claim.store.path), "cold")) !== destinationArchiveDirectory)) {
			await restoreColdSessionClaims(aliases, env, params.beforePersistentApply);
			await restoreColdSessionClaims(canonicalClaims, env, params.beforePersistentApply);
		}
		const destinationCanonical = canonicalClaims.find((claim) => samePhysicalStore(claim.store, destination));
		const foreignCanonical = canonicalClaims.filter((claim) => !samePhysicalStore(claim.store, destination));
		const aliasesIdentical = aliases.every((claim) => claimsMatch(claim, aliases[0]));
		const canonicalMatches = destinationCanonical ? aliases.every((claim) => claimsMatch(claim, destinationCanonical)) : false;
		if (foreignCanonical.length > 0 || destinationCanonical && !canonicalMatches) {
			const divergentClaims = [...canonicalClaims, ...aliases];
			const outcome = {
				kind: "divergent-canonical",
				canonicalKey,
				paths: [...new Set(divergentClaims.map((claim) => claim.store.path))],
				sourceKeys: divergentClaims.map((claim) => claim.key)
			};
			if (params.mode === "doctor-fix") {
				const repaired = await repairDivergentClaims({
					beforePersistentApply: params.beforePersistentApply,
					canonicalKey,
					claims: divergentClaims,
					destination,
					...destinationCanonical ? { destinationCanonical } : {},
					env,
					ownerAgentId
				});
				outcome.quarantinedKeys = repaired.quarantinedKeys;
				if (repaired.resolved) outcome.resolved = true;
				else warnings.push(warningForDivergence("divergent-canonical", canonicalKey, divergentClaims));
			} else warnings.push(warningForDivergence("divergent-canonical", canonicalKey, divergentClaims));
			outcomes.push(outcome);
			continue;
		}
		if (!aliasesIdentical) {
			const outcome = {
				kind: "divergent-aliases",
				canonicalKey,
				paths: [...new Set(aliases.map((claim) => claim.store.path))],
				sourceKeys: aliases.map((claim) => claim.key)
			};
			if (params.mode === "doctor-fix") {
				const repaired = await repairDivergentClaims({
					beforePersistentApply: params.beforePersistentApply,
					canonicalKey,
					claims: aliases,
					destination,
					env,
					ownerAgentId
				});
				outcome.quarantinedKeys = repaired.quarantinedKeys;
				if (repaired.resolved) outcome.resolved = true;
				else warnings.push(warningForDivergence("divergent-aliases", canonicalKey, aliases));
			} else warnings.push(warningForDivergence("divergent-aliases", canonicalKey, aliases));
			outcomes.push(outcome);
			continue;
		}
		const outcome = await processIdenticalClaims({
			beforePersistentApply: params.beforePersistentApply,
			aliases,
			...destinationCanonical ? { canonical: destinationCanonical } : {},
			canonicalKey,
			destination,
			env,
			mode: params.mode
		});
		outcomes.push(outcome);
		if (outcome.kind === "divergent-aliases" || outcome.kind === "divergent-canonical") warnings.push(warningForDivergence(outcome.kind, canonicalKey, aliases));
	}
	if (allLegacy.length === 0 && outcomes.length === 0) outcomes.push({ kind: "no-legacy-rows" });
	const complete = !outcomes.some((outcome) => outcome.kind === "legacy-json-store" || outcome.kind === "store-unreadable" || (outcome.kind === "divergent-aliases" || outcome.kind === "divergent-canonical") && outcome.resolved !== true);
	const changes = params.mode !== "doctor-fix" ? [] : outcomes.flatMap((outcome) => outcome.kind === "migrated-in-place" || outcome.kind === "migrated-cross-store" || outcome.kind === "canonical-exists-identical" ? [`Migrated legacy ${legacyAgentId} session claim ${outcome.canonicalKey}.`] : outcome.quarantinedKeys?.length ? [`Quarantined ${outcome.quarantinedKeys.length} legacy ${legacyAgentId} session conflict(s).`] : []);
	if (complete && params.mode === "doctor-fix") writeLedger({
		beforePersistentApply: params.beforePersistentApply,
		env,
		identity: {
			...identityBase,
			sourceLayout: resolveSourceLayout(resolved)
		},
		now: params.now?.() ?? Date.now(),
		outcomes,
		stateDir: resolveStateDir(env)
	});
	return {
		armed: true,
		changes,
		complete,
		ledgerComplete: complete && (params.mode === "doctor-fix" || matchingCompletedLedger && allLegacy.length === 0),
		legacyAgentId,
		mainKey,
		outcomes,
		ownerAgentId,
		warnings
	};
}
async function migrateLegacyMainSessionKeys(params) {
	try {
		return await migrateLegacyMainSessionKeysInternal(params);
	} catch (error) {
		params.beforePersistentApply?.();
		if (params.mode === "doctor-fix") throw error;
		const legacyAgentId = normalizeAgentId(params.legacyAgentId ?? "main");
		const mainKey = normalizeMainKey(params.cfg.session?.mainKey);
		const arming = resolveArmingDecision(params.cfg, legacyAgentId);
		return {
			armed: arming.armed,
			changes: [],
			complete: false,
			ledgerComplete: false,
			legacyAgentId,
			mainKey,
			outcomes: [{
				kind: "store-unreadable",
				detail: String(error)
			}],
			...arming.armed ? { ownerAgentId: arming.ownerAgentId } : {},
			warnings: [`session: legacy-main session migration deferred: ${String(error)}; run openclaw doctor --fix`]
		};
	}
}
//#endregion
export { migrateLegacyMainSessionKeys as t };
