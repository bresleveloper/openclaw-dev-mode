import { a as resolveGlobalSingleton } from "./global-singleton-DrXvEBww.mjs";
import { o as resolveUserPath } from "./home-dir-CtsdYvX3.mjs";
import "./src-Djeo9OvP.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { t as safeParseJson } from "./json-coercion-pfKbZnCJ.mjs";
import { n as resolvePathViaExistingAncestorSync, t as resolveIdentityPathViaExistingAncestorSync } from "./boundary-path-CAv_plX7.mjs";
import { t as hasErrnoCode } from "./errno-FR4CRyya.mjs";
import "./utils-gjJ-tD2q.mjs";
import { r as resolveStateDir } from "./state-dir-C8s3cOPX.mjs";
import { T as resolveOAuthDir } from "./paths-orClZ-2Z.mjs";
import { n as registerListener } from "./listeners-BogSNJ-R.mjs";
import { r as cloneEnvWithPlatformSemantics } from "./config-env-vars-BHneg24Q.mjs";
import { n as assertDatabasePathIdentity, o as inspectDatabasePathIdentitySync } from "./sqlite-worker-identity-DLqVBf5J.mjs";
import { c as resolveOpenClawStateSqlitePath } from "./openclaw-state-db.paths-D3nUb_uk.mjs";
import { r as sha256HexPrefixCore } from "./node-crypto-BG4u3UnX.mjs";
import "./crypto-digest-y6oZN-_F.mjs";
import { i as sqlPublicationAnchor, r as isPostgresSqlConnection } from "./sql-connection-DmQzXTVz.mjs";
import { i as executeWithCachedStatement } from "./kysely-sync-cache-state-Dc7tna9E.mjs";
import { s as stageSqliteTransactionState } from "./sqlite-post-commit-22SfWsLt.mjs";
import { r as openNodeSqliteDatabase } from "./node-sqlite-CYaq-2Hb.mjs";
import { a as executeSqliteQueryTakeFirstSync, i as executeSqliteQuerySync, o as getNodeSqliteKysely } from "./kysely-sync-9fPQaMlh.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import { m as openClawStateDatabaseCache } from "./openclaw-state-db-cache-R1v7ogY0.mjs";
import { a as tableExists } from "./openclaw-state-db-schema-helpers-C7eId980.mjs";
import { r as readExistingAgentSchemaMeta } from "./openclaw-agent-db-metadata-90thy9YD.mjs";
import { i as prepareSqliteReadOnlyLocationSync } from "./sqlite-snapshot-source-DQdkM3YQ.mjs";
import { i as createSqliteWorkerOperationAdmission, o as observeSqliteWorkerCommittedFacts } from "./sqlite-worker-operation-admission-puNZKEvP.mjs";
import { a as resolveSqliteDatabaseFilePaths } from "./sqlite-files-N5UzY_DG.mjs";
import { a as readTrackedStateDatabaseIdentity } from "./openclaw-state-db-handle-B6qa1Bui.mjs";
import { r as captureOpenClawStateWorkerContext } from "./openclaw-state-worker-context-BDhKaXgP.mjs";
import { s as withExistingOpenClawStateDatabaseArtifactPreservingReadOnly, u as withExistingOpenClawStateDatabaseReadOnly } from "./openclaw-state-db-readonly-DPndG9sn.mjs";
import { t as readConfigMachineState } from "./config-machine-state-DdwUh_Ff.mjs";
import "./session-key-CSDERtm3.mjs";
import { M as resolveRegisteredAgentIdForDir } from "./agent-scope-config-fjA2T9Gz.mjs";
import { n as authProfileSourceExists } from "./file-state-CTXmtyL_.mjs";
import { U as reportCommittedInlineAuthFailure, c as withAuthProfileCredentialWrite, u as withAuthProfileCredentialOwner } from "./user-model-account-authority-DFFjC5J5.mjs";
import { c as readAuthProfileAuthorizationLifetimes, o as prepareAuthProfileAuthorizationWrite, s as readAuthProfileAuthorizationLifetime } from "./authorization-lifetime-CLdd1God.mjs";
import { i as isPendingOAuthRefreshFence, r as isOAuthRefreshFence } from "./oauth-refresh-marker-Dio1lCzm.mjs";
import { i as openOpenClawStateDatabase, u as runOpenClawStateWriteTransaction } from "./openclaw-state-db-BtDOU_3j.mjs";
import { t as cache } from "./openclaw-agent-db-lifecycle-Dodvmz4L.mjs";
import "./openclaw-agent-db-schema-helpers-DZw0ltGv.mjs";
import { r as assertExistingAgentSchemaOwner } from "./openclaw-agent-db-schema-read-CX4aGKRI.mjs";
import { c as runOpenClawAgentWriteTransaction } from "./openclaw-agent-db-_fC-kf1x.mjs";
import { t as AuthProfileAuthorizationError } from "./authorization-contract-BOF8YHOo.mjs";
import { a as parseSharedAuthStoreOwnership, d as resolveSharedAuthStorePath, f as resolveSharedMainAuthAgentDir, i as noteCommittedSharedAuthStoreOwnership, l as resolveSharedAuthStoreOwnership, n as getPreparedSharedAuthStoreOwnership, u as resolveSharedAuthStoreOwnershipAsync } from "./path-resolve-21Orzn6B.mjs";
import { c as readAuthProfileJsonCellText, i as SHARED_AUTH_STORE_STATE_KEY, n as AUTH_PROFILE_PRIMARY_ROW_KEY, o as inspectAgentAuthProfileJsonCellReadOnly, r as SHARED_AUTH_CELL_KEYS, s as inspectAuthProfileJsonCell, t as AGENT_AUTH_CELLS } from "./sqlite-json-Dyr7VLoH.mjs";
import { i as isMissingDatabasePath, t as acquireAuthProfileReadDatabase } from "./sqlite-read-pool-DiFi5Ms3.mjs";
import { i as runOpenClawStateWorkerOperation } from "./openclaw-state-worker-store-C1iV_8xe.mjs";
import { a as writeConfigMachineState } from "./config-machine-state-write-CmW-lLFq.mjs";
import fs from "node:fs";
import path from "node:path";
import { isDeepStrictEqual } from "node:util";
//#region src/agents/auth-profiles/authorization-observation.ts
function projectAuthProfileAuthorization(raw, profileId) {
	const incarnation = readAuthProfileAuthorizationLifetime(raw, profileId);
	const credential = isRecord(raw) && isRecord(raw.profiles) && Object.hasOwn(raw.profiles, profileId) ? raw.profiles[profileId] : void 0;
	if (!isRecord(credential)) return {
		incarnation,
		status: "absent"
	};
	if (isRecord(credential.setup) && credential.setup.replacement === true) return {
		incarnation,
		status: "retired"
	};
	if (credential.type === "oauth" && typeof credential.access === "string" && typeof credential.refresh === "string" && typeof credential.expires === "number") {
		const marker = {
			type: "oauth",
			access: credential.access,
			refresh: credential.refresh,
			expires: credential.expires
		};
		return {
			incarnation,
			status: isPendingOAuthRefreshFence(marker) ? "pending" : isOAuthRefreshFence(marker) ? "retired" : "ready",
			...!credential.refresh ? { expires: credential.expires } : {}
		};
	}
	if (credential.type === "api_key" && (credential.key || credential.keyRef)) return {
		incarnation,
		status: "ready"
	};
	if (credential.type === "token" && (credential.token || credential.tokenRef)) return {
		incarnation,
		status: "ready",
		...typeof credential.expires === "number" ? { expires: credential.expires } : {}
	};
	return {
		incarnation,
		status: "retired"
	};
}
const publications = /* @__PURE__ */ new Map();
function publication(databasePath) {
	let owner = publications.get(databasePath);
	if (!owner) {
		owner = {
			profiles: /* @__PURE__ */ new Map(),
			pending: 0,
			uncertain: false
		};
		publications.set(databasePath, owner);
	}
	return owner;
}
function prune(databasePath, owner) {
	if (!owner.profiles.size && !owner.pending && !owner.uncertain) publications.delete(databasePath);
}
function publishAuthProfileAuthorization(inputPath, raw) {
	const databasePath = resolvePathViaExistingAncestorSync(inputPath);
	const owner = publications.get(databasePath);
	if (!owner) return;
	for (const [profileId, observation] of owner.profiles) {
		const fact = projectAuthProfileAuthorization(raw, profileId);
		if (!isDeepStrictEqual(observation.fact, fact)) {
			observation.fact = fact;
			observation.revision = {};
		}
	}
}
/** Fence before native COMMIT admission; unknown settlement is never repaired by a plain read. */
function fenceAuthProfileAuthorizationWrite(inputPath) {
	const databasePath = resolvePathViaExistingAncestorSync(inputPath);
	const owner = publication(databasePath);
	owner.pending++;
	for (const observation of owner.profiles.values()) observation.revision = {};
	let settled = false;
	return (known, raw) => {
		if (settled) return;
		settled = true;
		owner.uncertain ||= !known;
		if (known && raw !== void 0) publishAuthProfileAuthorization(databasePath, raw);
		owner.pending--;
		for (const observation of owner.profiles.values()) observation.revision = {};
		prune(databasePath, owner);
	};
}
function retainAuthProfileAuthorizationObservation(inputPath, profileId) {
	const databasePath = resolvePathViaExistingAncestorSync(inputPath);
	const owner = publication(databasePath);
	let observation = owner.profiles.get(profileId);
	if (!observation) {
		observation = {
			revision: {},
			references: 0
		};
		owner.profiles.set(profileId, observation);
	}
	const retained = observation;
	retained.references++;
	let disposed = false;
	const assertSettled = () => {
		if (disposed) throw new AuthProfileAuthorizationError("retired");
		if (owner.pending || owner.uncertain) throw new AuthProfileAuthorizationError("unavailable");
	};
	return {
		readFact() {
			assertSettled();
			return retained.fact;
		},
		prepareRead() {
			assertSettled();
			const revision = retained.revision;
			return (raw) => {
				assertSettled();
				if (retained.revision !== revision) throw new AuthProfileAuthorizationError("unavailable");
				const fact = projectAuthProfileAuthorization(raw, profileId);
				retained.fact = fact;
				return fact;
			};
		},
		dispose() {
			if (disposed) return;
			disposed = true;
			if (--retained.references === 0) owner.profiles.delete(profileId);
			prune(databasePath, owner);
		}
	};
}
//#endregion
//#region src/agents/auth-profiles/path-resolve.native.ts
/** Doctor, offline CLI and the deprecated synchronous auth SDK prepare their native owner. */
function prepareSharedAuthStoreOwnershipForNative(env = process.env) {
	const cached = getPreparedSharedAuthStoreOwnership(env);
	if (cached) return cached;
	const ownership = parseSharedAuthStoreOwnership(readConfigMachineState(SHARED_AUTH_STORE_STATE_KEY, { env }));
	noteCommittedSharedAuthStoreOwnership(ownership, env);
	return ownership;
}
function resolveNativeSharedAuthStorePath(env = process.env) {
	prepareSharedAuthStoreOwnershipForNative(env);
	return resolveSharedAuthStorePath(env);
}
//#endregion
//#region src/agents/auth-profiles/legacy-source-files.ts
function resolveLegacyOAuthPath(env = process.env) {
	return path.join(resolveOAuthDir(env), "oauth.json");
}
function resolveLegacySourceAgentDir(agentDir, env = process.env) {
	return agentDir ? resolveUserPath(agentDir) : resolveSharedMainAuthAgentDir(env);
}
/** Capture the fixed legacy candidates before the producer's environment can change. */
function resolveLegacyAuthProfileSourceCandidates(params) {
	const agentDir = resolveLegacySourceAgentDir(params.agentDir, params.env);
	const candidates = [
		{
			kind: "auth-profiles",
			path: path.join(agentDir, "auth-profiles.json")
		},
		{
			kind: "auth-state",
			path: path.join(agentDir, "auth-state.json")
		},
		{
			kind: "legacy-auth",
			path: path.join(agentDir, "auth.json")
		}
	];
	const sharedMainDir = resolveSharedMainAuthAgentDir(params.env);
	if (path.resolve(agentDir) === path.resolve(sharedMainDir)) candidates.push({
		kind: "legacy-oauth",
		path: resolveLegacyOAuthPath(params.env)
	});
	return candidates;
}
/** Detect retired files by name; only migration diagnostics may inspect provider metadata. */
function listLegacyAuthProfileSources(params) {
	return resolveLegacyAuthProfileSourceCandidates(params).filter((candidate) => authProfileSourceExists(candidate.path));
}
function listLegacyAuthProfileArchives(params) {
	const candidates = /* @__PURE__ */ new Map();
	for (const agentDir of params.agentDirs) {
		candidates.set(path.join(agentDir, "auth-profiles.json"), "auth-profiles");
		candidates.set(path.join(agentDir, "auth-state.json"), "auth-state");
		candidates.set(path.join(agentDir, "auth.json"), "legacy-auth");
	}
	candidates.set(resolveLegacyOAuthPath(params.env), "legacy-oauth");
	const archives = [];
	for (const [sourcePath, kind] of candidates) {
		const directory = path.dirname(sourcePath);
		const baseName = path.basename(sourcePath);
		const migratedPrefix = `${baseName}.migrated-`;
		const priorImportPrefix = `${baseName}.sqlite-import.`;
		let entries;
		try {
			entries = fs.readdirSync(directory);
		} catch {
			continue;
		}
		for (const entry of entries) if (entry.startsWith(migratedPrefix) || entry.startsWith(priorImportPrefix) && entry.endsWith(".bak")) archives.push({
			kind,
			path: path.join(directory, entry)
		});
	}
	return archives;
}
//#endregion
//#region src/agents/auth-profiles/shared-store-bootstrap.ts
const PRIMARY_ROW_KEY = "primary";
const SHARED_AUTH_STORE_MIGRATION_KIND = "shared-auth-store-state-db";
const inspectedLegacySharedAuthOwnerships = /* @__PURE__ */ new WeakSet();
function hasInspectedLegacySharedAuthOwnership(ownership) {
	return inspectedLegacySharedAuthOwnerships.has(ownership);
}
function noteInspectedLegacySharedAuthOwnership(ownership) {
	inspectedLegacySharedAuthOwnerships.add(ownership);
}
const freshSharedAuthStoreHandoffs = /* @__PURE__ */ new Set();
/** Runtime views follow only this producer's proven empty-store relocation. */
function registerFreshSharedAuthStoreHandoff(handoff) {
	return registerListener(freshSharedAuthStoreHandoffs, handoff);
}
var SharedAuthStoreSourceInspectionError = class extends Error {
	constructor(sourcePath, operation, cause) {
		const detail = cause instanceof Error ? cause.message : String(cause);
		super(`Cannot ${operation} legacy shared auth database ${sourcePath}: ${detail}`, { cause });
		this.code = "SHARED_AUTH_STORE_SOURCE_UNREADABLE";
		this.action = "openclaw doctor --fix";
		this.name = "SharedAuthStoreSourceInspectionError";
		this.sourcePath = sourcePath;
	}
};
function inspectSharedAuthLegacySourceFile(sourcePath) {
	let entry;
	try {
		entry = fs.lstatSync(sourcePath);
	} catch (error) {
		if (hasErrnoCode(error, "ENOENT")) return { status: "missing" };
		throw new SharedAuthStoreSourceInspectionError(sourcePath, "inspect", error);
	}
	let target = entry;
	if (entry.isSymbolicLink()) try {
		target = fs.statSync(sourcePath);
	} catch (error) {
		throw new SharedAuthStoreSourceInspectionError(sourcePath, "resolve", error);
	}
	if (!target.isFile()) throw new SharedAuthStoreSourceInspectionError(sourcePath, "open", /* @__PURE__ */ new Error("path is not a regular file"));
	return {
		status: "present",
		size: target.size
	};
}
function readSharedAuthLegacyRowsFromDatabase(database) {
	const db = getNodeSqliteKysely(database);
	const tables = executeWithCachedStatement(database, "SELECT name FROM sqlite_master WHERE type = 'table' AND name IN (?, ?)", ["auth_profile_store", "auth_profile_state"], (statement) => statement.all("auth_profile_store", "auth_profile_state"));
	const hasStore = tables.some((row) => row.name === "auth_profile_store");
	const hasState = tables.some((row) => row.name === "auth_profile_state");
	const store = db.selectFrom("auth_profile_store").select(["store_json as json", "updated_at"]).select((expression) => expression.val("store").as("kind")).where("store_key", "=", PRIMARY_ROW_KEY);
	const state = db.selectFrom("auth_profile_state").select(["state_json as json", "updated_at"]).select((expression) => expression.val("state").as("kind")).where("state_key", "=", PRIMARY_ROW_KEY);
	const query = hasStore ? hasState ? store.unionAll(state) : store : hasState ? state : void 0;
	const rows = query ? executeSqliteQuerySync(database, query).rows : [];
	const storeRow = rows.find((row) => row.kind === "store");
	const stateRow = rows.find((row) => row.kind === "state");
	return {
		store: storeRow ? {
			store_json: storeRow.json,
			updated_at: storeRow.updated_at
		} : null,
		state: stateRow ? {
			state_json: stateRow.json,
			updated_at: stateRow.updated_at
		} : null
	};
}
function inspectSharedAuthLegacyRowsReadOnly(sourcePath, behavior = {}) {
	if (inspectSharedAuthLegacySourceFile(sourcePath).status === "missing") return {
		store: null,
		state: null
	};
	let prepared;
	try {
		prepared = behavior.artifactPreservingReadOnly ? prepareSqliteReadOnlyLocationSync(sourcePath) : void 0;
	} catch (error) {
		throw new SharedAuthStoreSourceInspectionError(sourcePath, "open", error);
	}
	try {
		let database;
		try {
			database = openNodeSqliteDatabase(prepared?.location ?? sourcePath, { readOnly: true });
		} catch (error) {
			throw new SharedAuthStoreSourceInspectionError(sourcePath, "open", error);
		}
		try {
			return readSharedAuthLegacyRowsFromDatabase(database);
		} catch (error) {
			throw new SharedAuthStoreSourceInspectionError(sourcePath, "read", error);
		} finally {
			database.close();
		}
	} finally {
		prepared?.cleanup();
	}
}
function hasPendingSharedAuthCleanup(env, sourcePath, behavior = {}) {
	return (behavior.artifactPreservingReadOnly ? withExistingOpenClawStateDatabaseArtifactPreservingReadOnly : withExistingOpenClawStateDatabaseReadOnly)(({ db: database }) => {
		if (behavior.artifactPreservingReadOnly && !tableExists(database, "migration_sources")) return false;
		return hasPendingSharedAuthCleanupInDatabase(database, sourcePath);
	}, { env }) ?? false;
}
function hasPendingSharedAuthCleanupInDatabase(database, sourcePath) {
	const db = getNodeSqliteKysely(database);
	return Boolean(executeSqliteQueryTakeFirstSync(database, db.selectFrom("migration_sources").select("source_key").where("migration_kind", "=", SHARED_AUTH_STORE_MIGRATION_KIND).where("source_path", "=", sourcePath).where("removed_source", "=", 0).limit(1)));
}
function publishFreshSharedAuthStoreHandoff(sourcePath, env, sourceStillCurrent = true) {
	noteCommittedSharedAuthStoreOwnership({ location: "state-db" }, env);
	const handoff = {
		previousSharedDatabasePath: sourcePath,
		sharedDatabasePath: resolveSharedAuthStorePath(env),
		env,
		sourceStillCurrent
	};
	for (const publish of freshSharedAuthStoreHandoffs) publish(handoff);
}
function initializeFreshSharedAuthStore(env) {
	const ownership = prepareSharedAuthStoreOwnershipForNative(env);
	if (ownership.location === "state-db" || inspectedLegacySharedAuthOwnerships.has(ownership)) return;
	const sourcePath = path.join(resolveSharedMainAuthAgentDir(env), "openclaw-agent.sqlite");
	try {
		if (listLegacyAuthProfileSources({ env }).length > 0) {
			inspectedLegacySharedAuthOwnerships.add(ownership);
			return;
		}
		const rows = inspectSharedAuthLegacyRowsReadOnly(sourcePath);
		if (rows.store || rows.state || hasPendingSharedAuthCleanup(env, sourcePath)) {
			inspectedLegacySharedAuthOwnerships.add(ownership);
			return;
		}
	} catch {
		inspectedLegacySharedAuthOwnerships.add(ownership);
		return;
	}
	writeConfigMachineState(SHARED_AUTH_STORE_STATE_KEY, { location: "state-db" }, { env });
	publishFreshSharedAuthStoreHandoff(sourcePath, env);
}
function isSharedAuthProfileWrite(params) {
	return params.agentDir === void 0 || params.allowExplicitMain && path.resolve(resolveUserPath(params.agentDir, params.env)) === path.resolve(resolveSharedMainAuthAgentDir(params.env));
}
function prepareFreshSharedAuthStoreWrite(params) {
	const isSharedWrite = isSharedAuthProfileWrite(params);
	if (isSharedWrite) initializeFreshSharedAuthStore(params.env);
	return isSharedWrite;
}
//#endregion
//#region src/agents/auth-profiles/store-update-commit.ts
const pending = resolveGlobalSingleton(Symbol.for("openclaw.authProfilePendingCommits"), () => /* @__PURE__ */ new Map());
function watchAuthProfileNativeCommits(databasePath) {
	const key = resolveIdentityPathViaExistingAncestorSync(databasePath);
	const watches = pending.get(key) ?? /* @__PURE__ */ new Set();
	const watch = { revision: 0 };
	watches.add(watch);
	pending.set(key, watches);
	return {
		capture() {
			const revision = watch.revision;
			return () => watch.revision === revision;
		},
		dispose() {
			watches.delete(watch);
			if (watches.size === 0) pending.delete(key);
		}
	};
}
/** Native COMMIT can overtake a worker result before its host publication runs. */
function recordAuthProfileNativeCommit(database) {
	if (pending.size === 0) return;
	const location = isPostgresSqlConnection(database) ? readTrackedStateDatabaseIdentity(sqlPublicationAnchor(database))?.canonicalPath : database.location();
	if (!location) return;
	const key = resolveIdentityPathViaExistingAncestorSync(location);
	const commit = () => {
		for (const watch of pending.get(key) ?? []) watch.revision += 1;
	};
	if (!database.isTransaction) commit();
	else if (!stageSqliteTransactionState(database, {
		stage() {},
		commit,
		rollback() {}
	})) throw new Error("Auth profile write requires a managed commit owner");
}
//#endregion
//#region src/agents/auth-profiles/shared-store-bootstrap-async.ts
/** Prepare ownership on the existing actor while the caller retains its accepted write. */
async function prepareFreshSharedAuthStoreWriteAsync(params) {
	const sharedWrite = isSharedAuthProfileWrite(params);
	const previous = getPreparedSharedAuthStoreOwnership(params.env);
	let retainedOwnership = previous;
	if (previous && (!sharedWrite || previous.location === "state-db" || hasInspectedLegacySharedAuthOwnership(previous))) {
		params.assertCurrent?.();
		return sharedWrite;
	}
	const context = captureOpenClawStateWorkerContext({ env: params.env });
	if (!sharedWrite) {
		await resolveSharedAuthStoreOwnershipAsync(context);
		params.assertCurrent?.();
		return false;
	}
	const sourcePath = path.join(resolveSharedMainAuthAgentDir(params.env), "openclaw-agent.sqlite");
	let sourceIdentity;
	try {
		sourceIdentity = inspectDatabasePathIdentitySync(sourcePath);
	} catch {}
	const legacySourcePaths = resolveLegacyAuthProfileSourceCandidates({ env: params.env }).map(({ path: source }) => source);
	const legacySourcesPresent = legacySourcePaths.map((source) => fs.existsSync(source));
	const commits = watchAuthProfileNativeCommits(sourcePath);
	const unchanged = commits.capture();
	const assertBinding = () => {
		const currentOwnership = getPreparedSharedAuthStoreOwnership(params.env);
		retainedOwnership ??= currentOwnership;
		if (currentOwnership !== retainedOwnership) throw new Error("Shared auth source changed during bootstrap");
	};
	const assertSource = () => {
		if (!unchanged()) throw new Error("Shared auth source changed during bootstrap");
		if (sourceIdentity) assertDatabasePathIdentity(sourcePath, sourceIdentity);
		if (legacySourcePaths.some((source, index) => fs.existsSync(source) !== legacySourcesPresent[index])) throw new Error("Legacy auth source changed during bootstrap");
	};
	const assertCurrent = () => {
		context.admission.assertCurrent();
		context.maintenanceScope?.assertAdmission();
		params.assertCurrent?.();
		assertBinding();
	};
	try {
		let acknowledged;
		const result = await runOpenClawStateWorkerOperation(context, (scope) => scope.execute({
			type: "authProfiles.bootstrap",
			input: {
				sourcePath,
				sourceIdentity,
				legacySourcePaths
			}
		}), {
			assertCurrent,
			createAdmission: () => {
				const admission = createSqliteWorkerOperationAdmission((request, grant) => {
					assertCurrent();
					if (request.stage === "transaction" || request.stage === "commit") assertSource();
					if (!grant()) throw new Error("Shared auth bootstrap authority expired");
				});
				observeSqliteWorkerCommittedFacts(admission, ({ facts }) => {
					if (!isRecord(facts) || typeof facts.relocated !== "boolean") throw new Error("Shared auth bootstrap returned an invalid commit receipt");
					acknowledged = {
						ownership: parseSharedAuthStoreOwnership(facts.ownership),
						relocated: facts.relocated
					};
				});
				return {
					nativeLocations: [context.admission.databasePath, sourcePath],
					admission
				};
			}
		}).catch((error) => {
			if (!acknowledged) throw error;
			reportCommittedInlineAuthFailure("Shared auth bootstrap committed before settlement failed", error);
			return acknowledged;
		});
		if (result.relocated) {
			(context.assertPublicationCurrent ?? context.admission.assertCurrent)();
			assertBinding();
			let sourceFailure;
			try {
				assertSource();
			} catch (error) {
				sourceFailure = { error };
			}
			publishFreshSharedAuthStoreHandoff(sourcePath, params.env, !sourceFailure);
			if (sourceFailure) throw sourceFailure.error;
			params.assertCurrent?.();
		} else {
			assertCurrent();
			if (result.ownership.location === "legacy-main") assertSource();
			const ownership = retainedOwnership?.location === result.ownership.location ? retainedOwnership : result.ownership;
			noteCommittedSharedAuthStoreOwnership(ownership, params.env);
			noteInspectedLegacySharedAuthOwnership(ownership);
		}
		return true;
	} finally {
		commits.dispose();
	}
}
//#endregion
//#region src/agents/auth-profiles/sqlite-json-write.ts
/** Write one canonical auth cell on the caller's admitted transaction connection. */
function writeAuthProfileJsonCell(database, target, kind, payload) {
	recordAuthProfileNativeCommit(database);
	const value = JSON.stringify(payload);
	const now = Date.now();
	const query = kind === "shared-state" ? getNodeSqliteKysely(database).insertInto("config_machine_state").values({
		state_key: SHARED_AUTH_CELL_KEYS[target],
		value_json: value,
		updated_at_ms: now
	}).onConflict((conflict) => conflict.column("state_key").doUpdateSet({
		value_json: value,
		updated_at_ms: now
	})) : target === "store" ? getNodeSqliteKysely(database).insertInto("auth_profile_store").values({
		store_key: AUTH_PROFILE_PRIMARY_ROW_KEY,
		store_json: value,
		updated_at: now
	}).onConflict((conflict) => conflict.column("store_key").doUpdateSet({
		store_json: value,
		updated_at: now
	})) : getNodeSqliteKysely(database).insertInto("auth_profile_state").values({
		state_key: AUTH_PROFILE_PRIMARY_ROW_KEY,
		state_json: value,
		updated_at: now
	}).onConflict((conflict) => conflict.column("state_key").doUpdateSet({
		state_json: value,
		updated_at: now
	}));
	const write = () => executeSqliteQuerySync(database, query);
	if (target === "store") withAuthProfileCredentialWrite(database, payload, write);
	else write();
}
function deleteAuthProfileJsonCell(database, target, kind) {
	recordAuthProfileNativeCommit(database);
	const cell = AGENT_AUTH_CELLS[target];
	const query = kind === "shared-state" ? getNodeSqliteKysely(database).deleteFrom("config_machine_state").where("state_key", "=", SHARED_AUTH_CELL_KEYS[target]) : getNodeSqliteKysely(database).deleteFrom(cell.table).where(cell.key, "=", AUTH_PROFILE_PRIMARY_ROW_KEY);
	const write = () => executeSqliteQuerySync(database, query);
	if (target === "store") withAuthProfileCredentialWrite(database, void 0, write);
	else write();
}
//#endregion
//#region src/agents/auth-profiles/sqlite.ts
/**
* SQLite persistence adapter for auth profile secrets and runtime state.
* The public helpers expose raw JSON payloads so normalization stays in the
* store/state layers that own compatibility rules.
*/
function resolveAuthProfileStoreOwner(database, env = process.env) {
	const prepared = authProfileTransactions.get(database);
	if (prepared) return prepared;
	if (!("agentId" in database)) return {
		databasePath: database.path,
		sharedDatabasePath: database.path,
		location: "state-db"
	};
	return {
		...prepareAuthProfileSharedOwner(env),
		databasePath: database.path
	};
}
function prepareAuthProfileSharedOwner(env) {
	prepareSharedAuthStoreOwnershipForNative(env);
	const preparedEnv = cloneEnvWithPlatformSemantics(env);
	preparedEnv.OPENCLAW_STATE_DIR = resolveStateDir(preparedEnv);
	return {
		env: preparedEnv,
		sharedDatabasePath: resolveSharedAuthStorePath(preparedEnv),
		location: resolveSharedAuthStoreOwnership(preparedEnv).location
	};
}
const authProfileTransactions = /* @__PURE__ */ new WeakMap();
function inferAgentIdFromDir(agentDir) {
	const normalized = path.normalize(agentDir);
	if (path.basename(normalized) === "agent") {
		const parent = path.basename(path.dirname(normalized));
		if (parent) return parent;
	}
	return `custom-${sha256HexPrefixCore(normalized, 12)}`;
}
function resolveAuthProfileDatabaseOptions(agentDir, env = process.env) {
	if (!agentDir) prepareSharedAuthStoreOwnershipForNative(env);
	const pathname = agentDir ? resolveAuthProfileDatabasePath(agentDir) : resolveSharedAuthStorePath(env);
	if (!agentDir && resolveSharedAuthStoreOwnership(env).location === "state-db") return {
		kind: "shared-state",
		path: pathname,
		env
	};
	const dir = path.dirname(pathname);
	return {
		kind: "agent",
		agentId: resolveRegisteredAgentIdForDir(dir) ?? inferAgentIdFromDir(dir),
		path: pathname,
		env
	};
}
/** Filename-only consumers do not need reverse agent ownership discovery. */
function resolveAuthProfileDatabasePath(agentDir) {
	return agentDir ? path.join(resolveUserPath(agentDir), "openclaw-agent.sqlite") : resolveSharedAuthStorePath();
}
/** Resolves the durable agent owner expected for an auth-profile database. */
function resolveAuthProfileDatabaseOwnerId(agentDir) {
	const target = resolveAuthProfileDatabaseOptions(agentDir);
	if (target.kind !== "agent") throw new Error("agent auth database unexpectedly resolved to shared state");
	return target.agentId;
}
/** Resolves the SQLite database and sidecar paths used by auth profiles. */
function resolveAuthProfileDatabaseFilePaths(agentDir) {
	return resolveSqliteDatabaseFilePaths(resolveAuthProfileDatabasePath(agentDir));
}
function parseJsonCell(raw) {
	if (!raw) return null;
	return safeParseJson(raw) ?? null;
}
function resolveAuthProfileDatabaseKind(agentDir, database) {
	if (database && "agentId" in database) return "agent";
	if (database && "path" in database) return "shared-state";
	return resolveAuthProfileDatabaseOptions(agentDir).kind;
}
/** Validate selected-agent ownership without requiring a current session schema. */
function assertAuthProfileStoreAgentOwner(agentDir, agentId) {
	const pathname = resolveAuthProfileDatabasePath(agentDir);
	const acquired = acquireAuthProfileReadDatabase(pathname);
	if (acquired.status === "missing") return;
	if (acquired.status === "unreadable") throw new Error(`Unable to read agent auth database ${pathname}.`);
	assertExistingAgentSchemaOwner(readExistingAgentSchemaMeta(acquired.db), normalizeAgentId(agentId), pathname);
}
function inspectAuthProfileJsonCellReadOnly(databaseTarget, target) {
	if (databaseTarget.kind === "shared-state") try {
		return withExistingOpenClawStateDatabaseReadOnly(({ db }) => inspectAuthProfileJsonCell(db, target, "shared-state"), {
			path: databaseTarget.path,
			...databaseTarget.env ? { env: databaseTarget.env } : {}
		}) ?? {
			status: "missing",
			reason: "database"
		};
	} catch {
		return isMissingDatabasePath(databaseTarget.path) ? {
			status: "missing",
			reason: "database"
		} : { status: "unreadable" };
	}
	return inspectAgentAuthProfileJsonCellReadOnly(databaseTarget.path, target);
}
/** Doctor retains opaque rotation-state bytes while repairing independently readable credentials. */
function readAuthProfileStateJsonTextReadOnly(target) {
	if (target.kind === "shared-state") return withExistingOpenClawStateDatabaseReadOnly(({ db }) => readAuthProfileJsonCellText(db, "state", "shared-state"), {
		path: target.path,
		...target.env ? { env: target.env } : {}
	});
	const acquired = acquireAuthProfileReadDatabase(target.path);
	if (acquired.status !== "readable") throw new Error("Auth profile rotation-state source is unavailable; retry Doctor.");
	return readAuthProfileJsonCellText(acquired.db, "state", "agent");
}
function inspectPersistedAuthProfileCell(target, agentDir, database) {
	if (database) return inspectAuthProfileJsonCell(database.db, target, resolveAuthProfileDatabaseKind(agentDir, database));
	return inspectAuthProfileJsonCellReadOnly(resolveAuthProfileDatabaseOptions(agentDir), target);
}
/** Distinguishes an absent auth row from a present store that could not be read. */
function inspectPersistedAuthProfileStoreRaw(agentDir, database) {
	return inspectPersistedAuthProfileCell("store", agentDir, database);
}
/** Distinguishes an absent auth-state row from state that could not be read. */
function inspectPersistedAuthProfileStateRaw(agentDir, database) {
	return inspectPersistedAuthProfileCell("state", agentDir, database);
}
/** Inspect the shared store for an explicit state root without projecting it to an agent dir. */
function inspectPersistedSharedAuthProfileStoreRaw(env) {
	return inspectAuthProfileJsonCellReadOnly(resolveAuthProfileDatabaseOptions(void 0, env), "store");
}
/** Inspect shared runtime state for an explicit state root. */
function inspectPersistedSharedAuthProfileStateRaw(env) {
	return inspectAuthProfileJsonCellReadOnly(resolveAuthProfileDatabaseOptions(void 0, env), "state");
}
function readPersistedAuthProfileCell(target, agentDir, database) {
	if (database) return parseJsonCell(readAuthProfileJsonCellText(database.db, target, resolveAuthProfileDatabaseKind(agentDir, database)));
	const result = inspectPersistedAuthProfileCell(target, agentDir);
	return result.status === "readable" ? result.raw : null;
}
/** Reads the raw persisted secrets-store payload without coercing the schema. */
function readPersistedAuthProfileStoreRaw(agentDir, database) {
	return readPersistedAuthProfileCell("store", agentDir, database);
}
/** Reads the raw persisted runtime-state payload without coercing the schema. */
function readPersistedAuthProfileStateRaw(agentDir, database) {
	return readPersistedAuthProfileCell("state", agentDir, database);
}
/** Read the shared credential row for an explicit state root. */
function readPersistedSharedAuthProfileStoreRaw(env) {
	const result = inspectPersistedSharedAuthProfileStoreRaw(env);
	return result.status === "readable" ? result.raw : null;
}
/** Read the shared runtime-state row for an explicit state root. */
function readPersistedSharedAuthProfileStateRaw(env) {
	const result = inspectPersistedSharedAuthProfileStateRaw(env);
	return result.status === "readable" ? result.raw : null;
}
/** Writes the raw persisted secrets-store payload inside the auth database. */
function writePersistedAuthProfileStoreRaw(payload, agentDir, database) {
	mutateAuthProfileCell("store", payload, agentDir, database);
}
/** Deletes the persisted secrets-store row while leaving runtime state intact. */
function deletePersistedAuthProfileStoreRaw(agentDir, database) {
	mutateAuthProfileCell("store", void 0, agentDir, database, true);
}
/** Writes or deletes the persisted runtime-state payload. */
function writePersistedAuthProfileStateRaw(payload, agentDir, database) {
	mutateAuthProfileCell("state", payload, agentDir, database, !payload);
}
function mutateAuthProfileCell(target, payload, agentDir, database, deleteRow = false) {
	const kind = resolveAuthProfileDatabaseKind(agentDir, database);
	const write = (owner) => {
		let next = payload;
		let remove = deleteRow;
		if (target === "store") {
			const previous = inspectAuthProfileJsonCell(owner.db, target, kind);
			if (previous.status === "unreadable") throw new Error("Auth profile credential store is unreadable");
			const raw = previous.status === "readable" ? previous.raw : void 0;
			if (remove && Object.keys(readAuthProfileAuthorizationLifetimes(raw)).length) {
				next = {
					version: 1,
					profiles: {}
				};
				remove = false;
			}
			if (!remove) next = prepareAuthProfileAuthorizationWrite(raw, next);
		}
		let settleAuthorization;
		const fenceAuthorization = () => {
			settleAuthorization ??= fenceAuthProfileAuthorizationWrite(owner.path);
		};
		if (target === "store" && !owner.db.isTransaction) fenceAuthorization();
		try {
			if (remove) deleteAuthProfileJsonCell(owner.db, target, kind);
			else writeAuthProfileJsonCell(owner.db, target, kind, next);
			if (target === "store") {
				const publish = () => {
					publishAuthProfileAuthorization(owner.path, remove ? void 0 : next);
					settleAuthorization?.(true);
				};
				if (!stageSqliteTransactionState(owner.db, {
					stage() {},
					prepareCommit: fenceAuthorization,
					commit: publish,
					rollback: () => settleAuthorization?.(true),
					invalidate() {
						fenceAuthorization();
						settleAuthorization?.(false);
					}
				})) publish();
			}
		} catch (error) {
			settleAuthorization?.(false);
			throw error;
		}
	};
	if (database) write(database);
	else runAuthProfileWriteTransaction(agentDir, write);
}
function prepareAuthProfileWriteEnvironment(options) {
	const env = cloneEnvWithPlatformSemantics(options.env ?? process.env);
	if (!options.env && options.stateDir) {
		env.OPENCLAW_STATE_DIR = options.stateDir;
		env.OPENCLAW_AGENT_DIR = void 0;
	}
	env.OPENCLAW_STATE_DIR = resolveStateDir(env);
	options.assertEnvironment?.(env);
	return env;
}
/** Released synchronous SDK writes and Doctor one-shots retain their native preparation. */
function prepareAuthProfileWriteTransaction(agentDir, options, env = prepareAuthProfileWriteEnvironment(options)) {
	return {
		databaseTarget: resolveAuthProfileDatabaseOptions(prepareFreshSharedAuthStoreWrite({
			agentDir,
			allowExplicitMain: options.sharedStoreWrite === true,
			env
		}) ? void 0 : agentDir, env),
		sharedOwner: prepareAuthProfileSharedOwner(env)
	};
}
async function prepareAuthProfileWriteTransactionAsync(agentDir, options, assertCurrent) {
	const env = prepareAuthProfileWriteEnvironment(options);
	const capturedAgentDir = agentDir ? resolveUserPath(agentDir, env) : void 0;
	const sharedStoreWrite = await prepareFreshSharedAuthStoreWriteAsync({
		agentDir: capturedAgentDir,
		allowExplicitMain: options.sharedStoreWrite === true,
		env,
		assertCurrent
	});
	options.assertEnvironment?.(env);
	assertCurrent?.();
	return {
		databaseTarget: resolveAuthProfileDatabaseOptions(sharedStoreWrite ? void 0 : capturedAgentDir, env),
		sharedOwner: prepareAuthProfileSharedOwner(env)
	};
}
/** An open connection can retain custody beyond the preceding SDK call. */
function getCachedAuthProfileWriteConnection(agentDir, options, env) {
	if (options.existingDatabaseTarget) return cache.databases.get(path.resolve(options.existingDatabaseTarget.path))?.db;
	if (agentDir === void 0 || isSharedAuthProfileWrite({
		agentDir,
		allowExplicitMain: options.sharedStoreWrite === true,
		env
	})) {
		const ownership = getPreparedSharedAuthStoreOwnership(env);
		if (!ownership || ownership.location === "state-db") return openClawStateDatabaseCache.peekOpenClawStateDatabaseConnection(resolveOpenClawStateSqlitePath(env));
		return cache.databases.get(path.resolve(resolveSharedMainAuthAgentDir(env), "openclaw-agent.sqlite"))?.db;
	}
	return cache.databases.get(path.resolve(resolveAuthProfileDatabasePath(agentDir)))?.db;
}
/** Runs an auth-profile database write transaction for store/state updates. */
function runAuthProfileWriteTransaction(agentDir, operation, options = {}) {
	const existing = options.existingDatabaseTarget;
	const env = existing?.env ?? prepareAuthProfileWriteEnvironment(options);
	const cachedDatabase = getCachedAuthProfileWriteConnection(agentDir, options, env);
	return withAuthProfileCredentialOwner(resolveOpenClawStateSqlitePath(env), (retain) => {
		const { databaseTarget, sharedOwner } = existing ? {
			databaseTarget: existing,
			sharedOwner: prepareAuthProfileSharedOwner(env)
		} : prepareAuthProfileWriteTransaction(agentDir, options, env);
		const run = (database) => {
			retain?.(database.db);
			const previous = authProfileTransactions.get(database);
			const owner = previous ?? {
				...sharedOwner,
				databasePath: database.path
			};
			authProfileTransactions.set(database, owner);
			try {
				return operation(database, owner);
			} finally {
				if (!previous) authProfileTransactions.delete(database);
			}
		};
		if (databaseTarget.kind === "agent") return runOpenClawAgentWriteTransaction(run, databaseTarget, {
			operationLabel: "auth-profiles.write",
			...existing ? { repairAdmission: {
				expectedIdentity: existing.identity,
				assertCurrent: existing.assertCurrent
			} } : {}
		});
		const database = openOpenClawStateDatabase({
			env,
			path: databaseTarget.path
		});
		return runOpenClawStateWriteTransaction(run, {
			env,
			database
		});
	}, cachedDatabase);
}
//#endregion
export { inspectSharedAuthLegacyRowsReadOnly as A, resolveNativeSharedAuthStorePath as B, deleteAuthProfileJsonCell as C, SharedAuthStoreSourceInspectionError as D, SHARED_AUTH_STORE_MIGRATION_KIND as E, listLegacyAuthProfileArchives as F, retainAuthProfileAuthorizationObservation as H, listLegacyAuthProfileSources as I, resolveLegacyAuthProfileSourceCandidates as L, isSharedAuthProfileWrite as M, readSharedAuthLegacyRowsFromDatabase as N, hasPendingSharedAuthCleanup as O, registerFreshSharedAuthStoreHandoff as P, resolveLegacyOAuthPath as R, writePersistedAuthProfileStoreRaw as S, watchAuthProfileNativeCommits as T, fenceAuthProfileAuthorizationWrite as V, resolveAuthProfileDatabaseOwnerId as _, inspectPersistedAuthProfileStoreRaw as a, runAuthProfileWriteTransaction as b, prepareAuthProfileWriteEnvironment as c, readAuthProfileStateJsonTextReadOnly as d, readPersistedAuthProfileStateRaw as f, resolveAuthProfileDatabaseFilePaths as g, readPersistedSharedAuthProfileStoreRaw as h, inspectPersistedAuthProfileStateRaw as i, inspectSharedAuthLegacySourceFile as j, hasPendingSharedAuthCleanupInDatabase as k, prepareAuthProfileWriteTransaction as l, readPersistedSharedAuthProfileStateRaw as m, deletePersistedAuthProfileStoreRaw as n, inspectPersistedSharedAuthProfileStateRaw as o, readPersistedAuthProfileStoreRaw as p, inspectAuthProfileJsonCellReadOnly as r, inspectPersistedSharedAuthProfileStoreRaw as s, assertAuthProfileStoreAgentOwner as t, prepareAuthProfileWriteTransactionAsync as u, resolveAuthProfileDatabasePath as v, writeAuthProfileJsonCell as w, writePersistedAuthProfileStateRaw as x, resolveAuthProfileStoreOwner as y, prepareSharedAuthStoreOwnershipForNative as z };
