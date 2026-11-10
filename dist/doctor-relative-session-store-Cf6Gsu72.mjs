import { i as resolveRequiredHomeDir } from "./home-dir-CtsdYvX3.mjs";
import { t as formatErrorMessage } from "./errors-DPfGDWk1.mjs";
import { f as readDatabasePathIdentitySync } from "./sqlite-worker-identity-DLqVBf5J.mjs";
import { c as resolveOpenClawStateSqlitePath } from "./openclaw-state-db.paths-D3nUb_uk.mjs";
import { l as getOpenClawDatabaseMaintenanceScope } from "./openclaw-state-db-async-lifecycle-CtHZ7B35.mjs";
import { n as sha256Hex } from "./node-crypto-BG4u3UnX.mjs";
import { a as executeSqliteQueryTakeFirstSync, i as executeSqliteQuerySync, o as getNodeSqliteKysely } from "./kysely-sync-9fPQaMlh.mjs";
import { a as isSameOpenClawAgentDatabasePath } from "./openclaw-agent-db.paths-BGqL4GOe.mjs";
import { n as hasOrphanedSqliteSidecars } from "./sqlite-files-N5UzY_DG.mjs";
import { i as resolveUpdateRehearsalRoot, r as isUpdateRehearsalReadOnlyPath } from "./update-rehearsal-paths-CRhoE25Z.mjs";
import { t as readConfigMachineState } from "./config-machine-state-DdwUh_Ff.mjs";
import { M as parseAgentSessionKey } from "./session-key-CSDERtm3.mjs";
import { i as listAgentIds } from "./agent-roster-gkYP38su.mjs";
import { a as resolveUnsuffixedSqliteTargetFromSessionStorePath } from "./session-sqlite-target-paths-DufdR-Na.mjs";
import { c as resolveSessionStorePathCore } from "./paths-YgcBNLgG.mjs";
import { s as listOpenClawRegisteredAgentDatabases } from "./openclaw-agent-db-registry-listing-DCh0nEqi.mjs";
import { n as unregisterOpenClawAgentDatabase } from "./openclaw-agent-db-registry-DuEPPF6m.mjs";
import { a as writeConfigMachineState } from "./config-machine-state-write-CmW-lLFq.mjs";
import { n as resolveSessionStoreCompatibilityAgentId } from "./legacy.default-agent-owner-Blrs2q29.mjs";
import { t as DoctorMaintenanceRefusalError } from "./update-doctor-result-oZ38327j.mjs";
import { o as resolveSqliteTargetFromSessionStorePath } from "./session-sqlite-target-DJQA0Ssz.mjs";
import { t as getSessionKysely } from "./session-accessor.sqlite-scope-helpers-XTtpZpWK.mjs";
import "./session-accessor.sqlite-scope-9ysL95gx.mjs";
import "./targets-DJGC6v85.mjs";
import { n as withOpenClawAgentDatabaseReadOnly } from "./openclaw-agent-db-readonly-DYvA41kd.mjs";
import { m as resolveSqliteCanonicalRepairLookupKeys, p as readSessionDeliveryRepairInventory } from "./session-accessor.sqlite-canonical-repair-DvHsP9JX.mjs";
import { a as readSessionTranscriptArchiveResetInventory } from "./session-accessor.sqlite-archive-store-kernel-D7Zd_1OC.mjs";
import { n as resolveRelativeSessionStoreMigrationTargets } from "./doctor-relative-session-store-paths-B9HJIscj.mjs";
import { n as listSessionMembersInDatabase } from "./session-sharing-store.kernel-DHH7VvHM.mjs";
import { a as readClaim, r as claimsMatch, s as restoreColdSessionClaims, t as claimFullyCopied } from "./legacy-main-session-migration-claims-BdO-kk9b.mjs";
import { t as copySessionClaimForRepair } from "./session-claim-repair-copy-Bv77NT1I.mjs";
import { n as backupDoctorSqliteDatabases } from "./doctor-migration-backup-CaaJT0rP.mjs";
import fs from "node:fs";
import path from "node:path";
//#region src/commands/doctor-relative-session-store-preservation.ts
/** A retired store must have no independent owner still settling work against it. */
function readRelativeStorePreservationState(database, keys, refuse) {
	const pending = getNodeSqliteKysely(database.db);
	if (executeSqliteQueryTakeFirstSync(database.db, pending.selectFrom("context_engine_turn_outbox").select("advancement_key").limit(1))) refuse("pending context-engine advancements need to drain through their original Gateway before recovery");
	const goalOperation = executeSqliteQueryTakeFirstSync(database.db, pending.selectFrom("session_goal_operations").select("expires_at").where("expires_at", ">", Date.now()).orderBy("expires_at", "desc").limit(1));
	if (goalOperation) refuse(`goal-operation receipts prevent delayed goal recreation until ${new Date(goalOperation.expires_at).toISOString()}; retain the old store until that time before retrying`);
	if (readSessionTranscriptArchiveResetInventory(database).length > 0) refuse("retained transcript archives require explicit recovery from the original store; automatic archive relocation is unsupported");
	const inventory = readSessionDeliveryRepairInventory(database);
	if (inventory.deliveries.some((row) => [
		"created",
		"queued",
		"unknown"
	].includes(row.status))) refuse("pending conversation deliveries must settle through their original Gateway and queue before recovery");
	const knownKeys = new Set(keys.flatMap((key) => resolveSqliteCanonicalRepairLookupKeys(key, [key])));
	if (inventory.deliveries.some((row) => row.source_session_key === null || !knownKeys.has(row.source_session_key))) refuse("delivery receipts without a retained session require explicit recovery from the original store");
	const operations = new Set(inventory.deliveries.map((row) => row.operation_id));
	if (inventory.progress.some((row) => !operations.has(row.key))) refuse("conversation progress without its delivery receipt requires explicit recovery from the original store");
	return inventory;
}
//#endregion
//#region src/commands/doctor-relative-session-store.ts
function refuse(message) {
	throw new DoctorMaintenanceRefusalError(`Cannot merge the old relative session.store: ${message}. Original stores and existing backups are retained. Resolve the reported conflict before retrying Doctor or the update.`, {
		kind: "data-at-risk",
		reason: "incomplete-migration"
	});
}
function discoverStoreMoves(cfg, env, priorRegistry) {
	const store = cfg.session?.store;
	if (!store || store.startsWith("~") || path.isAbsolute(store)) return [];
	const registered = [...new Map([...priorRegistry, ...listOpenClawRegisteredAgentDatabases({
		env,
		includeIncompatibleSchemaVersions: true
	})].map((row) => [`${row.agentId}\n${row.path}`, row])).values()];
	const legacyTargets = resolveRelativeSessionStoreMigrationTargets(cfg, env, registered);
	const defaultAgentId = resolveSessionStoreCompatibilityAgentId(cfg);
	const rehearsal = resolveUpdateRehearsalRoot(env);
	const moves = /* @__PURE__ */ new Map();
	for (const agentId of listAgentIds(cfg)) {
		const expanded = store.replaceAll("{agentId}", agentId);
		const canonicalStore = resolveSessionStorePathCore(store, {
			agentId,
			env
		});
		const canonicalPath = resolveUnsuffixedSqliteTargetFromSessionStorePath(canonicalStore).path;
		if (isUpdateRehearsalReadOnlyPath(canonicalPath, env)) refuse(`the new destination ${canonicalPath} is outside the copied update state; run openclaw doctor --fix against the original state directory outside the update rehearsal first`);
		const canonical = resolveSqliteTargetFromSessionStorePath(canonicalStore, {
			agentId,
			defaultAgentId,
			env,
			registeredDatabases: registered
		});
		const candidates = [];
		if (!rehearsal) for (const base of /* @__PURE__ */ new Set([process.cwd(), resolveRequiredHomeDir(env)])) candidates.push({
			storePath: path.resolve(base, expanded),
			owner: agentId
		});
		candidates.push(...legacyTargets.filter((target) => target.configuredAgentId === agentId).map((target) => ({
			storePath: target.storePath,
			path: target.path,
			owner: target.agentId
		})));
		for (const candidate of candidates) {
			if (candidate.storePath === canonicalStore || candidate.path === canonical.path) continue;
			const unsuffixed = resolveUnsuffixedSqliteTargetFromSessionStorePath(candidate.storePath);
			if (isUpdateRehearsalReadOnlyPath(candidate.path ?? unsuffixed.path, env)) refuse(`the recorded source ${candidate.path ?? unsuffixed.path} was not copied for rehearsal; run openclaw doctor --fix against the original state directory outside the update rehearsal first`);
			const source = candidate.path ? {
				path: candidate.path,
				agentId: candidate.owner
			} : resolveSqliteTargetFromSessionStorePath(candidate.storePath, {
				agentId,
				defaultAgentId,
				env,
				registeredDatabases: registered
			});
			const sourceExists = fs.existsSync(source.path);
			if (!sourceExists && hasOrphanedSqliteSidecars(source.path)) refuse(`SQLite sidecars at ${source.path} need their matching main database restored`);
			if (!sourceExists && !fs.existsSync(candidate.storePath)) continue;
			if (isSameOpenClawAgentDatabasePath(source.path, canonical.path)) continue;
			const identity = sourceExists ? readDatabasePathIdentitySync(source.path) : void 0;
			const owner = source.agentId ?? candidate.owner;
			const key = `${identity?.key ?? source.path}\n${canonical.path}`;
			if (!moves.has(key)) moves.set(key, {
				source: {
					path: identity?.canonicalPath ?? source.path,
					ownerStorePath: source.path,
					databaseAgentId: owner
				},
				destination: {
					path: canonical.path,
					ownerStorePath: canonical.path,
					databaseAgentId: canonical.agentId ?? owner
				},
				aliases: registered.filter((row) => row.agentId === owner && !isUpdateRehearsalReadOnlyPath(row.path, env) && isSameOpenClawAgentDatabasePath(row.path, source.path)).map((row) => row.path),
				legacyStorePath: candidate.storePath
			});
		}
	}
	return [...moves.values()];
}
function readStoreSnapshot(store, env, retiring = false) {
	const result = withOpenClawAgentDatabaseReadOnly((database) => {
		const claims = executeSqliteQuerySync(database.db, getSessionKysely(database.db).selectFrom("session_nodes").select("session_key").orderBy("session_key")).rows.map(({ session_key: key }) => {
			const claim = readClaim(database, store, key, key);
			if (!claim) refuse(`source session ${key} could not be read from ${store.path}`);
			return claim;
		});
		return {
			claims,
			memberIds: new Map(claims.map((claim) => [claim.key, listSessionMembersInDatabase(database, claim.key).map((member) => member.identityId)])),
			deliveryInventory: retiring ? readRelativeStorePreservationState(database, claims.map((claim) => claim.key), (message) => refuse(`${store.path}: ${message}`)) : void 0
		};
	}, {
		agentId: store.databaseAgentId,
		path: store.path,
		env
	});
	return result.found ? result.value : {
		claims: [],
		memberIds: /* @__PURE__ */ new Map(),
		deliveryInventory: void 0
	};
}
function sourceFingerprint(store, snapshot) {
	return sha256Hex(JSON.stringify([
		readDatabasePathIdentitySync(store.path),
		snapshot.claims.map((claim) => [
			claim.key,
			claim.entry,
			claim.nodeArtifactFingerprint,
			claim.generations.map((generation) => generation.fingerprint)
		]),
		snapshot.deliveryInventory
	]));
}
/** Offline repair retires the old selector only after backed-up, verified same-owner copies. */
async function repairRelativeSessionStores(params) {
	const changes = [];
	const warnings = [];
	let moves;
	try {
		moves = discoverStoreMoves(params.cfg, params.env, params.registeredDatabases ?? []);
	} catch (error) {
		if (error instanceof DoctorMaintenanceRefusalError) throw error;
		refuse(`store discovery failed: ${formatErrorMessage(error)}`);
	}
	if (moves.length === 0) return {
		changes,
		warnings
	};
	const maintenance = getOpenClawDatabaseMaintenanceScope();
	if (!maintenance?.ownsSchemaMaintenance) refuse("repair requires Doctor maintenance ownership");
	const authority = { assertCurrent: () => maintenance.assertAdmission() };
	for (const { source, destination, aliases, legacyStorePath } of moves) try {
		authority.assertCurrent();
		const receiptKey = `sessions.relative-store.v1.${sha256Hex(JSON.stringify([source.path, destination.path]))}`;
		const completed = readConfigMachineState(receiptKey, { env: params.env });
		let claims;
		let fingerprint;
		if (completed === void 0) {
			const paths = [
				source.path,
				destination.path,
				resolveOpenClawStateSqlitePath(params.env)
			].filter((pathname) => fs.existsSync(pathname));
			const backup = await backupDoctorSqliteDatabases({
				env: params.env,
				pendingDatabasePaths: paths,
				databasePaths: paths,
				authority,
				requireSnapshots: true
			});
			changes.push(...backup.changes);
			warnings.push(...backup.warnings);
			if (!legacyStorePath.endsWith(".sqlite") && fs.existsSync(legacyStorePath)) {
				const { runDoctorSessionSqlite } = await import("./doctor-session-sqlite-BC9pty20.mjs");
				const { countBlockingSessionSqliteIssues } = await import("./doctor-session-sqlite-types-CXQfxbTB.mjs");
				if ((await runDoctorSessionSqlite({
					cfg: params.cfg,
					env: params.env,
					mode: "import",
					agent: source.databaseAgentId,
					store: legacyStorePath
				}, authority)).targets.some((target) => countBlockingSessionSqliteIssues(target) > 0)) refuse(`legacy JSON at ${legacyStorePath} has unresolved Doctor import issues`);
			}
			if (!fs.existsSync(source.path)) {
				authority.assertCurrent();
				for (const pathname of /* @__PURE__ */ new Set([source.path, ...aliases])) unregisterOpenClawAgentDatabase({
					agentId: source.databaseAgentId,
					path: pathname,
					env: params.env
				});
				continue;
			}
			const sourceSnapshot = readStoreSnapshot(source, params.env, true);
			claims = sourceSnapshot.claims;
			await restoreColdSessionClaims(claims, params.env, authority.assertCurrent);
			fingerprint = sourceFingerprint(source, {
				...sourceSnapshot,
				claims
			});
			const destinationSnapshot = readStoreSnapshot(destination, params.env);
			const destinationClaims = new Map(destinationSnapshot.claims.map((claim) => [claim.key, claim]));
			const prepareCanonical = async (key) => {
				const canonical = destinationClaims.get(key);
				if (!canonical) return;
				const restored = [canonical];
				await restoreColdSessionClaims(restored, params.env, authority.assertCurrent);
				destinationClaims.set(key, restored[0]);
				return restored[0];
			};
			for (const sourceClaim of claims) {
				authority.assertCurrent();
				let key = sourceClaim.key;
				let canonical = await prepareCanonical(key);
				const memberIds = sourceSnapshot.memberIds.get(sourceClaim.key);
				const sameMembers = (candidateKey) => JSON.stringify(memberIds) === JSON.stringify(destinationSnapshot.memberIds.get(candidateKey) ?? []);
				if (canonical && (!claimsMatch(sourceClaim, canonical) || !sameMembers(key))) {
					key = `agent:${parseAgentSessionKey(sourceClaim.key)?.agentId ?? source.databaseAgentId}:relative-store-recovery-${sha256Hex(`${source.path}\n${sourceClaim.key}`).slice(0, 24)}`;
					canonical = await prepareCanonical(key);
					if (canonical && !sameMembers(key)) refuse(`recovered session ${key} already has different sharing permissions`);
				}
				const copySource = {
					...sourceClaim,
					canonicalKey: key
				};
				const copied = await copySessionClaimForRepair({
					source: copySource,
					destination,
					canonicalKey: key,
					...canonical ? { expectedDestination: canonical } : {},
					mode: "store-relocation",
					env: params.env,
					beforePersistentApply: authority.assertCurrent
				});
				if (!copied || !claimFullyCopied(copySource, copied)) refuse(`conflicting session generations or sharing in ${source.path} and ${destination.path}; preserve the originals and their pre-migration backups for recovery`);
				destinationClaims.set(key, copied);
				destinationSnapshot.memberIds.set(key, memberIds);
			}
			authority.assertCurrent();
			const verifiedSource = readStoreSnapshot(source, params.env, true);
			claims = verifiedSource.claims;
			if (sourceFingerprint(source, verifiedSource) !== fingerprint) refuse(`source ${source.path} changed during the copy`);
			writeConfigMachineState(receiptKey, fingerprint, { env: params.env });
			changes.push(`Merged ${claims.length} session(s) from ${source.path} into ${destination.path}; retained the original store and its pre-migration backup for recovery.`);
		} else {
			const retiredSource = readStoreSnapshot(source, params.env, true);
			claims = retiredSource.claims;
			fingerprint = sourceFingerprint(source, retiredSource);
			if (completed !== fingerprint || !legacyStorePath.endsWith(".sqlite") && fs.existsSync(legacyStorePath)) refuse(`the retired source ${source.path} changed; preserve it for explicit recovery without replaying deleted conversations`);
		}
		authority.assertCurrent();
		for (const pathname of /* @__PURE__ */ new Set([source.path, ...aliases])) unregisterOpenClawAgentDatabase({
			agentId: source.databaseAgentId,
			path: pathname,
			env: params.env
		});
	} catch (error) {
		if (error instanceof DoctorMaintenanceRefusalError) throw error;
		refuse(`${source.path}: ${formatErrorMessage(error)}`);
	}
	return {
		changes,
		warnings
	};
}
//#endregion
export { repairRelativeSessionStores };
