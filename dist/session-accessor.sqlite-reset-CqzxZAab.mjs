import { r as executeSqliteQuerySync } from "./kysely-sync-K7ftY-g4.mjs";
import { r as runSqliteDeferredTransactionSync } from "./sqlite-transaction-DsZ3X6nD.mjs";
import { _ as isOpenClawAgentDatabasePathCurrent, v as readOpenClawAgentDatabaseIdentity } from "./openclaw-agent-db-validation-cache-_HDeZNQr.mjs";
import { M as parseAgentSessionKey } from "./session-key-C09ow4h0.mjs";
import { o as resolveSessionArtifactDirectory } from "./paths-dpReqUI8.mjs";
import { n as withOpenClawAgentDatabaseReadOnly, t as retainOpenClawAgentDatabaseReadOnly } from "./openclaw-agent-db-readonly-C4wDuLrp.mjs";
import { i as toDatabaseOptions, t as getSessionKysely } from "./session-accessor.sqlite-scope-helpers-DOK3pvYX.mjs";
import { n as captureLifecycleDatabaseScope, o as resolveSqliteReadScope, p as runExclusiveSqliteSessionWrite } from "./session-accessor.sqlite-scope-CdpbxR_m.mjs";
import { a as deleteSessionTranscriptIndexInTransaction } from "./session-transcript-index-FbEuN6S5.mjs";
import { r as parseSessionEntryJson } from "./session-accessor.sqlite-status-zTXzk4Sy.mjs";
import { D as withSqliteSessionDeletions, r as deleteSessionEntryRows, w as runSqliteSessionDeletionTransaction } from "./session-accessor.sqlite-entry-store-BnbK5FTE.mjs";
import { n as hashSessionArchiveBytes } from "./session-accessor.sqlite-archive-artifact-kIblIqSS.mjs";
import { t as readSessionStateDeleteSnapshot } from "./session-accessor.sqlite-delete-snapshot-BD2fHbEP.mjs";
import { i as runExclusiveSqliteTranscriptArchiveWorker } from "./session-accessor.sqlite-archive-bhCzy9TC.mjs";
import { i as publishCommittedSessionEntryRemoval } from "./session-accessor.sqlite-identity-DY_MUUYo.mjs";
import { a as readSessionTranscriptArchiveResetInventory, t as deleteAllSessionTranscriptArchivesInTransaction } from "./session-accessor.sqlite-archive-store-kernel-GFHc9mfV.mjs";
import { t as collectAdmissionProtectedSessionIds } from "./session-history-eviction-Cj2-Mfrh.mjs";
import { n as resolveSessionColdArchivePath } from "./session-cold-storage-codec-PYYgyI9l.mjs";
import fs from "node:fs";
import path from "node:path";
import { isDeepStrictEqual } from "node:util";
//#region src/config/sessions/session-accessor.sqlite-reset.ts
function readResetInventory(database) {
	const db = getSessionKysely(database.db);
	return {
		nodes: executeSqliteQuerySync(database.db, db.selectFrom("session_nodes").selectAll().orderBy("session_key")).rows,
		transcripts: executeSqliteQuerySync(database.db, db.selectFrom("session_windows").select("session_id").orderBy("session_id")).rows.map(({ session_id }) => ({
			sessionId: session_id,
			snapshot: readSessionStateDeleteSnapshot(database.db, session_id)
		})),
		cold: executeSqliteQuerySync(database.db, db.selectFrom("session_transcript_cold_archives").select([
			"session_id",
			"generation",
			"archive_name",
			"archive_sha256",
			"storage"
		]).orderBy("session_id")).rows,
		archives: readSessionTranscriptArchiveResetInventory(database)
	};
}
function listResetArtifacts(databasePath, inventory) {
	const directory = resolveSessionArtifactDirectory(databasePath);
	return [...(inventory?.archives ?? []).map(({ archive_name, archive_sha256 }) => {
		if (path.basename(archive_name) !== archive_name || archive_name === "." || archive_name === "..") throw new Error(`Invalid session archive name: ${archive_name}`);
		return {
			path: path.join(directory, archive_name),
			sha256: archive_sha256
		};
	}), ...(inventory?.cold ?? []).filter(({ storage }) => storage === "file").map(({ archive_name, archive_sha256 }) => ({
		path: resolveSessionColdArchivePath(databasePath, archive_name),
		sha256: archive_sha256
	}))].toSorted((a, b) => a.path.localeCompare(b.path)).flatMap(({ path: artifactPath, sha256 }) => {
		const artifact = fs.lstatSync(artifactPath, { throwIfNoEntry: false });
		if (!artifact) return [];
		if (!artifact.isFile()) throw new Error(`Session reset requires an ordinary archive file: ${artifactPath}`);
		const parent = fs.lstatSync(path.dirname(artifactPath));
		if (!parent.isDirectory()) throw new Error(`Session reset requires an ordinary archive directory: ${artifactPath}`);
		if (hashSessionArchiveBytes(fs.readFileSync(artifactPath)) !== sha256) throw new Error(`Session archive ownership could not be verified; reset refused: ${artifactPath}`);
		return [{
			path: artifactPath,
			sha256,
			dev: artifact.dev,
			ino: artifact.ino,
			size: artifact.size,
			mtimeMs: artifact.mtimeMs,
			parentDev: parent.dev,
			parentIno: parent.ino
		}];
	});
}
/** Offline reset preview never creates or opens the agent database writable. */
function previewSessionStoreReset(scope) {
	const resolved = captureLifecycleDatabaseScope(resolveSqliteReadScope(scope));
	const opened = withOpenClawAgentDatabaseReadOnly((database) => runSqliteDeferredTransactionSync(database.db, () => readResetInventory(database)), toDatabaseOptions(resolved));
	const inventory = opened.found ? opened.value : void 0;
	return {
		databasePath: resolved.path,
		sessionKeys: inventory?.nodes.map((node) => node.session_key) ?? [],
		transcriptCount: inventory?.transcripts.length ?? 0,
		archiveCount: (inventory?.archives.length ?? 0) + (inventory?.cold.length ?? 0),
		artifactPaths: listResetArtifacts(resolved.path, inventory).map((artifact) => artifact.path)
	};
}
/** Offline full-history reset preserves auth, memory, and other agent database owners. */
async function resetSessionStore(scope) {
	const resolved = captureLifecycleDatabaseScope(resolveSqliteReadScope(scope));
	const options = toDatabaseOptions(resolved);
	const retained = retainOpenClawAgentDatabaseReadOnly(options);
	if (!retained.found) return;
	try {
		const inventory = runSqliteDeferredTransactionSync(retained.database.db, () => readResetInventory(retained.database));
		const artifacts = listResetArtifacts(resolved.path, inventory);
		const assertCurrent = () => {
			retained.claim.assertCurrent();
			if (!isOpenClawAgentDatabasePathCurrent(retained.database)) throw new Error("Session reset database was replaced");
		};
		const removeArtifacts = () => {
			for (const [index, artifact] of artifacts.entries()) try {
				assertCurrent();
				const current = fs.lstatSync(artifact.path, { throwIfNoEntry: false });
				if (!current) continue;
				const parent = fs.lstatSync(path.dirname(artifact.path));
				if (!current.isFile() || !parent.isDirectory() || parent.dev !== artifact.parentDev || parent.ino !== artifact.parentIno || current.dev !== artifact.dev || current.ino !== artifact.ino || current.size !== artifact.size || current.mtimeMs !== artifact.mtimeMs || hashSessionArchiveBytes(fs.readFileSync(artifact.path)) !== artifact.sha256) throw new Error(`Session archive changed during reset: ${artifact.path}`);
				fs.unlinkSync(artifact.path);
			} catch (cause) {
				throw new Error(`Session history was reset, but archive cleanup is incomplete. Remaining paths: ${artifacts.slice(index).map((item) => item.path).join(", ")}`, { cause });
			}
		};
		const entries = inventory.nodes.flatMap((row) => {
			const entry = parseSessionEntryJson(row);
			return entry ? [{
				sessionKey: row.session_key,
				entry
			}] : [];
		});
		const identity = readOpenClawAgentDatabaseIdentity(retained.database).identity;
		await withSqliteSessionDeletions(resolved, entries, (assertDeletionCurrent) => runExclusiveSqliteTranscriptArchiveWorker(() => runExclusiveSqliteSessionWrite(resolved, async () => {
			assertCurrent();
			assertDeletionCurrent();
			if (!isDeepStrictEqual(listResetArtifacts(resolved.path, inventory), artifacts)) throw new Error("Session archives changed during reset; retry after other work stops");
			runSqliteSessionDeletionTransaction((database) => {
				assertCurrent();
				assertDeletionCurrent();
				if (readOpenClawAgentDatabaseIdentity(database).identity !== identity || !isDeepStrictEqual(readResetInventory(database), inventory)) throw new Error("Session history changed during reset; retry after other work stops");
				if (collectAdmissionProtectedSessionIds({
					database,
					storePath: scope.storePath
				}).size > 0) throw new Error("Cannot reset session history while session work is in flight");
				for (const { sessionId } of inventory.transcripts) deleteSessionTranscriptIndexInTransaction(database.db, sessionId);
				for (const row of inventory.nodes) deleteSessionEntryRows(database, row.session_key, { deleteOwnedWindows: true });
				deleteAllSessionTranscriptArchivesInTransaction(database);
			}, options);
			for (const { sessionKey, entry } of entries) publishCommittedSessionEntryRemoval(parseAgentSessionKey(sessionKey)?.agentId ?? resolved.agentId, identity, entry.sessionId, [sessionKey]);
			removeArtifacts();
		}, "session.agent-purge.commit")), { additionalIdentities: [...inventory.nodes.map((row) => row.session_key), ...inventory.transcripts.map(({ sessionId }) => sessionId)] });
	} finally {
		retained.claim.release();
	}
}
//#endregion
export { previewSessionStoreReset, resetSessionStore };
