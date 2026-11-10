import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { t as hasErrnoCode } from "./errno-FR4CRyya.mjs";
import { r as resolveStateDir } from "./state-dir-C8s3cOPX.mjs";
import "./paths-orClZ-2Z.mjs";
import { n as sha256Hex } from "./node-crypto-BG4u3UnX.mjs";
import { A as readSqliteDatabaseWriteRevision } from "./sqlite-database-admission-CqdNF9iE.mjs";
import { i as executeSqliteQuerySync, o as getNodeSqliteKysely } from "./kysely-sync-9fPQaMlh.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import { a as isSameOpenClawAgentDatabasePath, n as createOpenClawAgentDatabasePathMatcher } from "./openclaw-agent-db.paths-BGqL4GOe.mjs";
import { t as executeExistingOpenClawStateRead } from "./openclaw-state-db-readonly-DPndG9sn.mjs";
import { a as normalizeMainKey } from "./incognito-session-key-BWpn88lo.mjs";
import { M as parseAgentSessionKey } from "./session-key-CSDERtm3.mjs";
import "./agent-scope-config-fjA2T9Gz.mjs";
import { i as listAgentIds, l as tryResolveSoleAgentId } from "./agent-roster-gkYP38su.mjs";
import { a as readOpenClawAgentDatabaseIdentity, i as isOpenClawAgentDatabasePathCurrent } from "./openclaw-agent-db-identity-CnM2kzVa.mjs";
import { a as resolveSessionArtifactDirectory, c as resolveSessionStorePathCore } from "./paths-YgcBNLgG.mjs";
import { u as runOpenClawStateWriteTransaction } from "./openclaw-state-db-BtDOU_3j.mjs";
import { n as openOpenClawAgentDatabaseReadOnly, t as hasOpenClawAgentReadOnlySchema } from "./openclaw-agent-db-readonly-open-DcexysGa.mjs";
import { i as getOpenClawAgentDatabaseIfOpen, t as borrowOpenClawAgentDatabase } from "./openclaw-agent-db-_fC-kf1x.mjs";
import { n as resolveSessionStoreCompatibilityAgentId } from "./legacy.default-agent-owner-Blrs2q29.mjs";
import { o as resolveSqliteTargetFromSessionStorePath } from "./session-sqlite-target-DJQA0Ssz.mjs";
import { t as getSessionKysely } from "./session-accessor.sqlite-scope-helpers-XTtpZpWK.mjs";
import { l as runExclusiveSqliteSessionWrite } from "./session-accessor.sqlite-scope-9ysL95gx.mjs";
import { i as resolveAllAgentSessionStoreCandidateTargetsSync, r as resolveAgentSessionStoreTargetsSync } from "./targets-DJGC6v85.mjs";
import { n as withOpenClawAgentDatabaseReadOnly } from "./openclaw-agent-db-readonly-DYvA41kd.mjs";
import { o as readExactSessionEntryRow } from "./session-accessor.sqlite-entry-read-CLHpEbhT.mjs";
import { S as runSqliteSessionDeletionTransaction, T as withSqliteSessionDeletions, t as deleteLegacySessionEntryRows } from "./session-accessor.sqlite-entry-store-B3Lv6xes.mjs";
import { r as withSessionRetirementReaders, t as captureSessionRetirementReader } from "./session-retirement-read-BHIK-Jwj.mjs";
import { n as deleteSessionEntryLifecycle } from "./session-accessor.sqlite-lifecycle-7VGnaDT3.mjs";
import { a as readClaim, n as claimUnchanged, r as claimsMatch, s as restoreColdSessionClaims, t as claimFullyCopied } from "./legacy-main-session-migration-claims-BdO-kk9b.mjs";
import { n as writeSessionClaimForRepair, t as copySessionClaimForRepair } from "./session-claim-repair-copy-Bv77NT1I.mjs";
import { t as selectSessionStoreMaintenanceTargets } from "./targets-maintenance-DiX9v50V.mjs";
import fs from "node:fs";
import path from "node:path";
import { resolvePathPrefixSync } from "@openclaw/fs-safe/advanced";
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
function resolveMissingPhysicalPath(pathname) {
	const prefix = resolvePathPrefixSync(path.resolve(pathname));
	return path.join(prefix.existingPath, ...prefix.unresolvedSegments);
}
function resolvePhysicalPathIdentity(pathname) {
	try {
		const stat = fs.statSync(pathname, { bigint: true });
		if (!stat.isFile()) throw new Error(`session store is not a regular file: ${pathname}`);
		return `file:${stat.dev}:${stat.ino}`;
	} catch (error) {
		if (!hasErrnoCode(error, "ENOENT")) throw error;
		return `missing:${resolveMissingPhysicalPath(pathname)}`;
	}
}
function resolveSourceLayout(resolved) {
	return [.../* @__PURE__ */ new Set([...resolved.stores.map((store) => `sqlite:${store.databaseAgentId}:${resolvePhysicalPathIdentity(store.path)}`), ...resolved.jsonPaths.map((pathname) => `json:${resolvePhysicalPathIdentity(pathname)}`)])].toSorted();
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
/** Doctor retains synchronous full custody claims for its cross-store transactions. */
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
/** Retain every selected store across discovery and comparison; neither phase may adopt a replacement. */
function prepareComparisonClaimsFromStores(params) {
	const readers = params.stores.map((input) => {
		const store = { ...input };
		try {
			inspectSessionStorePath(store.path);
			return {
				store,
				reader: captureSessionRetirementReader(store, params.env)
			};
		} catch (error) {
			return {
				store,
				error
			};
		}
	});
	const failed = /* @__PURE__ */ new Set();
	const assertCurrent = () => {
		for (const captured of readers) {
			if (failed.has(captured.store)) continue;
			if (!captured.reader) throw captured.error;
			captured.reader.assertCurrent();
		}
	};
	const read = async () => {
		const targets = /* @__PURE__ */ new Set();
		const candidates = [];
		failed.clear();
		const unreadable = (store, error) => {
			failed.add(store);
			params.onUnreadable(store, error);
		};
		for (const { store, reader, error: preparationError } of readers) {
			if (!reader) {
				unreadable(store, preparationError);
				continue;
			}
			try {
				const result = await reader.read({ operation: "keys" });
				if (result.operation !== "keys") throw new Error("Legacy key scan returned another retirement operation");
				const keys = result.keys.map((key) => {
					const canonicalKey = canonicalKeyFor(key, params.legacyAgentId, params.ownerAgentId);
					if (canonicalKey) targets.add(canonicalKey);
					return {
						key,
						canonicalKey: canonicalKey ?? key
					};
				});
				candidates.push({
					store,
					reader,
					keys
				});
			} catch (error) {
				unreadable(store, error);
			}
		}
		const claims = [];
		for (const { store, reader, keys } of candidates) {
			const targeted = keys.filter(({ canonicalKey }) => targets.has(canonicalKey));
			if (targeted.length === 0) continue;
			try {
				const result = await reader.read({
					operation: "comparison-claims",
					store,
					keys: targeted
				});
				if (result.operation !== "comparison-claims") throw new Error("Legacy claim scan returned another retirement operation");
				for (const claim of result.claims) claims.push({
					store,
					claim
				});
			} catch (error) {
				unreadable(store, error);
			}
		}
		for (const { store, reader } of readers) {
			if (!reader || failed.has(store)) continue;
			try {
				reader.assertCurrent();
			} catch (error) {
				unreadable(store, error);
			}
		}
		const canonical = [];
		const legacy = [];
		for (const { store, claim } of claims) if (!failed.has(store)) (claim.key === claim.canonicalKey ? canonical : legacy).push(claim);
		return {
			canonical,
			legacy
		};
	};
	return {
		assertCurrent,
		read: () => withSessionRetirementReaders(readers.flatMap(({ reader }) => reader ? [reader] : []), read)
	};
}
async function storesHaveLegacyAgentSessionKey(params) {
	const readers = params.stores.map((store) => {
		inspectSessionStorePath(store.path);
		return captureSessionRetirementReader(store, params.env);
	});
	return withSessionRetirementReaders(readers, async () => {
		for (const reader of readers) {
			const result = await reader.read({ operation: "keys" });
			if (result.operation !== "keys") throw new Error("Legacy key scan returned another retirement operation");
			if (result.keys.some((key) => legacyAgentKeyPrefix(key, params.legacyAgentId) !== null)) return true;
		}
		for (const reader of readers) reader.assertCurrent();
		return false;
	});
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
		if (!currentCanonical) writeSessionClaimForRepair(database, params.canonicalKey, params.winner.entry);
		deleteLegacySessionEntryRows(database, params.aliases.map((claim) => claim.key), params.canonicalKey, {
			rehomeMembers: true,
			validatedEntries: new Map(currentAliases.map((claim) => [claim.key, claim.entry]))
		});
		return readClaim(database, params.store, params.canonicalKey, params.canonicalKey);
	});
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
			const version = readSqliteDatabaseWriteRevision(destinationReader.db);
			if (version !== void 0 && version === verifiedVersion) return;
			if (!hasOpenClawAgentReadOnlySchema(destinationReader)) throw changed();
			const destination = readClaim(destinationReader, params.destination, params.canonicalKey, params.canonicalKey);
			if (!destination || !claimUnchanged(destination, params.receipt)) throw changed();
			assertCurrent();
			if (readSqliteDatabaseWriteRevision(destinationReader.db) !== version) throw changed();
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
		writeSessionClaimForRepair(database, quarantineKey, params.claim.entry);
		deleteLegacySessionEntryRows(database, [params.claim.key], quarantineKey, {
			rehomeMembers: true,
			validatedEntries: /* @__PURE__ */ new Map([[fresh.key, fresh.entry]])
		});
		return quarantineKey;
	});
}
async function processIdenticalClaims(params) {
	const completedOutcome = () => describeIdenticalClaims(params);
	if (params.mode !== "doctor-fix") return completedOutcome();
	const winner = params.canonical ?? freshestClaim(params.aliases);
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
		const copied = await copySessionClaimForRepair({
			mode: "legacy-main",
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
	return completedOutcome();
}
function describeIdenticalClaims(params) {
	return {
		kind: params.canonical ? "canonical-exists-identical" : params.aliases.some((claim) => !samePhysicalStore(claim.store, params.destination)) ? "migrated-cross-store" : "migrated-in-place",
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
	const stores = /* @__PURE__ */ new Map();
	const isSameDatabasePath = createOpenClawAgentDatabasePathMatcher();
	const physicalStoreKey = isSameDatabasePath.createIndex();
	const jsonPaths = /* @__PURE__ */ new Set();
	const unreadable = [];
	const warnings = [];
	const recordUnreadable = (storePath, error) => {
		if (params.mode === "doctor-fix") throw new Error(`cannot inspect legacy session store ${storePath}: ${String(error)}`, { cause: error });
		unreadable.push({
			kind: "store-unreadable",
			detail: String(error),
			paths: [storePath]
		});
	};
	const candidates = logicalTargets.flatMap((target) => {
		try {
			const resolved = resolveSqliteTargetFromSessionStorePath(target.storePath, {
				agentId: target.agentId,
				defaultAgentId,
				env: params.env,
				isSameDatabasePath
			});
			return [{
				target,
				resolved,
				sqlitePath: resolved.path
			}];
		} catch (error) {
			recordUnreadable(target.storePath, error);
			return [];
		}
	});
	for (const { target, resolved } of selectSessionStoreMaintenanceTargets(candidates, {
		...params,
		onExcluded: params.mode === "doctor-fix" ? (pathname) => warnings.push(`session: skipped legacy-main scan of held session store ${pathname}; preserved any legacy rows for explicit agent restoration`) : void 0
	})) try {
		if (!target.storePath.endsWith(".sqlite") && inspectSessionStorePath(target.storePath) === "present") jsonPaths.add(path.resolve(target.storePath));
		const physical = {
			databaseAgentId: normalizeAgentId(resolved.agentId ?? target.agentId),
			ownerStorePath: target.storePath,
			path: resolved.path
		};
		resolvePhysicalPathIdentity(physical.path);
		const key = physicalStoreKey(physical.path);
		if (!stores.has(key)) stores.set(key, physical);
	} catch (error) {
		recordUnreadable(target.storePath, error);
	}
	return {
		jsonPaths: [...jsonPaths],
		stores: [...stores.values()],
		unreadable,
		warnings: [...new Set(warnings)]
	};
}
async function readLedger(env) {
	const reply = await executeExistingOpenClawStateRead({ env }, {
		type: "legacySessionMigration.readLedger",
		input: void 0
	}, { current: true });
	if (reply && (!reply.ok || reply.type !== "legacySessionMigration.readLedger")) throw new Error("Unexpected legacy session migration ledger result");
	const row = reply?.row;
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
	const identityHash = sha256Hex(JSON.stringify(params.identity));
	const runId = `${SOURCE_KEY}:${identityHash.slice(0, 24)}`;
	params.beforePersistentApply?.();
	runOpenClawStateWriteTransaction(({ db }) => {
		const kysely = getNodeSqliteKysely(db);
		const completion = {
			finished_at: params.now,
			status: "completed",
			report_json: reportJson
		};
		executeSqliteQuerySync(db, kysely.insertInto("migration_runs").values({
			id: runId,
			started_at: params.now,
			...completion
		}).onConflict((conflict) => conflict.column("id").doUpdateSet(completion)));
		const sourceCompletion = {
			source_path: params.stateDir,
			source_sha256: identityHash,
			source_record_count: params.outcomes.length,
			last_run_id: runId,
			status: "completed",
			imported_at: params.now,
			removed_source: 1,
			report_json: reportJson
		};
		executeSqliteQuerySync(db, kysely.insertInto("migration_sources").values({
			source_key: SOURCE_KEY,
			migration_kind: MIGRATION_KIND,
			target_table: "session_nodes",
			source_size_bytes: null,
			...sourceCompletion
		}).onConflict((conflict) => conflict.column("source_key").doUpdateSet(sourceCompletion)));
	}, { env: params.env }, { operationLabel: "session-migration.legacy-main-ledger" });
}
function groupLegacyClaims(claims) {
	const grouped = /* @__PURE__ */ new Map();
	for (const claim of claims) {
		const group = grouped.get(claim.canonicalKey) ?? [];
		group.push(claim);
		grouped.set(claim.canonicalKey, group);
	}
	return grouped;
}
function compareClaimGroup(aliases, canonicalClaims, destination) {
	const destinationCanonical = canonicalClaims.find((claim) => samePhysicalStore(claim.store, destination));
	const foreignCanonical = canonicalClaims.some((claim) => !samePhysicalStore(claim.store, destination));
	const aliasesIdentical = aliases.every((claim) => claimsMatch(claim, aliases[0]));
	const canonicalMatches = destinationCanonical ? aliases.every((claim) => claimsMatch(claim, destinationCanonical)) : false;
	const divergence = foreignCanonical || destinationCanonical && !canonicalMatches ? "divergent-canonical" : !aliasesIdentical ? "divergent-aliases" : void 0;
	return {
		destinationCanonical,
		divergence,
		divergentClaims: divergence === "divergent-canonical" ? [...canonicalClaims, ...aliases] : aliases
	};
}
function describeDivergentClaims(kind, canonicalKey, claims) {
	return {
		kind,
		canonicalKey,
		paths: [...new Set(claims.map((claim) => claim.store.path))],
		sourceKeys: claims.map((claim) => claim.key)
	};
}
function isBlockingOutcome(outcome) {
	return outcome.kind === "legacy-json-store" || outcome.kind === "store-unreadable" || (outcome.kind === "divergent-aliases" || outcome.kind === "divergent-canonical") && outcome.resolved !== true;
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
				base.warnings = resolved.warnings;
				rowsMayExist = resolved.unreadable.length > 0 || resolved.jsonPaths.length > 0 || await storesHaveLegacyAgentSessionKey({
					env,
					legacyAgentId,
					stores: resolved.stores
				});
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
			warnings: unresolved ? [...base.warnings, `session: legacy ${legacyAgentId} rows have no unambiguous configured owner; preserve them and run openclaw doctor --fix after assigning agents.defaults.sessionStore.agentId`] : base.warnings
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
	const warnings = [...base.warnings, ...resolved.warnings];
	for (const unreadable of resolved.unreadable) warnings.push(`session: could not inspect ${unreadable.paths?.[0] ?? "session store"}: ${unreadable.detail ?? "unknown error"}; run openclaw doctor --fix`);
	for (const pathname of resolved.jsonPaths) warnings.push(`session: deferred legacy-main session migration for JSON store ${pathname}; run openclaw doctor --fix`);
	const scanParams = {
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
	};
	const comparisonScan = params.mode === "detect" ? prepareComparisonClaimsFromStores(scanParams) : void 0;
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
		const ledger = await readLedger(env);
		comparisonScan?.assertCurrent();
		if (ledgerMatches(ledger, identity)) {
			matchingCompletedLedger = true;
			if (!params.forceScan) return {
				...base,
				armed: true,
				complete: true,
				ledgerComplete: true,
				ownerAgentId,
				warnings,
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
	if (comparisonScan) {
		const { legacy, canonical } = await comparisonScan.read();
		comparisonScan.assertCurrent();
		if (legacy.length > 0) warnings.push(`session: ${legacy.length} retained legacy ${legacyAgentId} session claim(s) require Doctor repair; run openclaw doctor --fix`);
		for (const [canonicalKey, aliases] of groupLegacyClaims(legacy)) {
			const compared = compareClaimGroup(aliases, canonical.filter((claim) => claim.key === canonicalKey), destination);
			if (compared.divergence) {
				outcomes.push(describeDivergentClaims(compared.divergence, canonicalKey, compared.divergentClaims));
				warnings.push(warningForDivergence(compared.divergence, canonicalKey, compared.divergentClaims));
			} else outcomes.push(describeIdenticalClaims({
				aliases,
				canonical: compared.destinationCanonical,
				canonicalKey,
				destination
			}));
		}
		if (legacy.length === 0 && outcomes.length === 0) outcomes.push({ kind: "no-legacy-rows" });
		const complete = !outcomes.some(isBlockingOutcome);
		return {
			...base,
			armed: true,
			complete,
			ledgerComplete: complete && matchingCompletedLedger && legacy.length === 0,
			outcomes,
			ownerAgentId,
			warnings
		};
	}
	const { legacy: allLegacy, canonical: allCanonical } = readClaimsFromStores(scanParams);
	const destinationArchiveDirectory = params.mode !== "doctor-fix" ? void 0 : resolveMissingPhysicalPath(path.join(resolveSessionArtifactDirectory(destinationResolved.path), "cold"));
	for (const [canonicalKey, aliases] of groupLegacyClaims(allLegacy)) {
		const canonicalClaims = allCanonical.filter((claim) => claim.key === canonicalKey);
		if (params.mode === "doctor-fix" && [...aliases, ...canonicalClaims].some((claim) => !samePhysicalStore(claim.store, destination) || resolveMissingPhysicalPath(path.join(resolveSessionArtifactDirectory(claim.store.path), "cold")) !== destinationArchiveDirectory)) {
			await restoreColdSessionClaims(aliases, env, params.beforePersistentApply);
			await restoreColdSessionClaims(canonicalClaims, env, params.beforePersistentApply);
		}
		const { destinationCanonical, divergence, divergentClaims } = compareClaimGroup(aliases, canonicalClaims, destination);
		if (divergence) {
			const outcome = describeDivergentClaims(divergence, canonicalKey, divergentClaims);
			if (params.mode === "doctor-fix") {
				const repaired = await repairDivergentClaims({
					beforePersistentApply: params.beforePersistentApply,
					canonicalKey,
					claims: divergentClaims,
					destination,
					...divergence === "divergent-canonical" && destinationCanonical ? { destinationCanonical } : {},
					env,
					ownerAgentId
				});
				outcome.quarantinedKeys = repaired.quarantinedKeys;
				if (repaired.resolved) outcome.resolved = true;
			}
			if (!outcome.resolved) warnings.push(warningForDivergence(divergence, canonicalKey, divergentClaims));
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
	const complete = !outcomes.some(isBlockingOutcome);
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
