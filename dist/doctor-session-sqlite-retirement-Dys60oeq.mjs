import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { c as readFileDescriptorBoundedSync } from "./boundary-file-read-CCth2Hwg.mjs";
import { r as resolveRealpathOrAbsolute } from "./boundary-path-CAv_plX7.mjs";
import { r as isPathInside } from "./path-guards-CH7noY0Z.mjs";
import { r as resolveStateDir } from "./state-dir-BHJORNly.mjs";
import "./paths-DGIwWbpu.mjs";
import { t as formatErrorMessage } from "./errors-O33D01XW.mjs";
import { i as executeSqliteQueryTakeFirstSync } from "./kysely-sync-K7ftY-g4.mjs";
import { a as resolveSqliteDatabaseFilePaths } from "./sqlite-files-BEC3zbaw.mjs";
import { l as syncDirectory, s as requireDirectorySync } from "./directory-durability-CqSvP1tc.mjs";
import { r as assertOpenClawStateWriteAllowedAtPath } from "./openclaw-state-ownership-BDcUGGMF.mjs";
import "./agent-scope-config-CDYpzA0r.mjs";
import { i as listAgentIds } from "./agent-roster-BXD1uMJD.mjs";
import { a as isPrimarySessionTranscriptFileName, i as isMigrationArchiveArtifactName, m as resolveTrajectoryPointerPath, p as resolveTrajectoryPath } from "./artifacts-BvSTVPj-.mjs";
import { l as resolveSessionStorePathCore } from "./paths-dpReqUI8.mjs";
import { w as resolveUnsuffixedSqliteTargetFromSessionStorePath } from "./openclaw-state-db-D1jWDzK3.mjs";
import { l as listUpdateRuns } from "./update-run-reader-B7x8dkVs.mjs";
import { k as migrateLegacySessionCreator } from "./openclaw-agent-db-schema-helpers-BxlojGn2.mjs";
import { d as inspectOpenClawAgentDatabaseOwner } from "./openclaw-agent-db-lifecycle-BJiYtXuW.mjs";
import "./openclaw-agent-db-DBug3LUA.mjs";
import { n as sessionEntrySnapshotColumns, t as attachSessionEntrySnapshots } from "./session-entry-snapshots-DO3oGsuC.mjs";
import { n as withOpenClawAgentDatabaseReadOnly } from "./openclaw-agent-db-readonly-C4wDuLrp.mjs";
import { a as normalizeStoreSessionKey } from "./store-entry-Bb_svqyv.mjs";
import { t as getSessionKysely } from "./session-accessor.sqlite-scope-helpers-DOK3pvYX.mjs";
import "./session-accessor.sqlite-scope-CdpbxR_m.mjs";
import { i as resolveAllAgentSessionStoreCandidateTargetsSync } from "./targets-BbcRkdUC.mjs";
import { r as collectSessionStateIdsForEntry } from "./session-accessor.sqlite-references-DaTkiOgv.mjs";
import { C as moveMigrationArtifact, E as statMigrationPath, S as isPendingMigrationArtifactClaim, T as sameMigrationArtifact, _ as sessionSqliteMigrationTargetKey, a as collectRecordedConsumedArchives, b as writeSessionSqliteMigrationManifest, d as listSessionSqliteMigrationManifestPaths, f as migrationMoveKey, g as resolveSessionSqliteMigrationRunsDir, i as canonicalMigrationFilePath, l as hasSymbolicLinkInDirectoryPath, n as assertSafeSessionSqliteMigrationDirectory, p as readSessionSqliteMigrationManifest, v as uniqueRestoreMoves, w as readMigrationArtifactIdentity } from "./session-sqlite-migration-manifest-CT3ckmkL.mjs";
import { t as isSessionSqliteMigrationWarning } from "./session-sqlite-migration-issues-CAeNjCyE.mjs";
import { c as listLegacySessionTranscriptFiles, d as shouldFilterLegacySessionRecordsByTarget, l as readLegacySessionStoreEntries, n as verifyTranscriptEvents, s as isLegacySessionRecordOwnedByTarget, t as verifyCanonicalSessionTranscriptSources, u as resolveLegacyTranscriptPaths } from "./session-sqlite-transcript-verification-9Tj6tF5J.mjs";
import { a as readLegacyPrimaryTranscriptIdentity, s as readOnlySqliteValidationSnapshot, t as countTranscriptEventsForPath } from "./session-sqlite-migration-readers-D3juTq9n.mjs";
import { n as normalizeLegacySessionEntryDelivery } from "./state-migrations.legacy-session-store-DYPAi0qW.mjs";
import { i as withDoctorSqliteMaintenanceLock, n as assertDoctorSqliteMaintenancePathsNotAliased } from "./doctor-sqlite-maintenance-lock-B-Ck8335.mjs";
import fs from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { setImmediate } from "node:timers/promises";
//#region src/commands/doctor-session-sqlite-recovery-inventory.ts
/** Read-only recovery inventory and dependency classification; never deletion authority. */
function resolveRecoveryArtifact(refs) {
	return refs.find((ref) => ref.move.artifact?.disposal.state === "pending-disposal")?.move.artifact ?? refs[0]?.move.artifact;
}
function collectRecoveryInventory(params) {
	const stateDir = canonicalMigrationFilePath(path.join(resolveStateDir(params.env), "anchor"));
	const root = path.dirname(stateDir);
	const stores = /* @__PURE__ */ new Set();
	const archiveDirs = /* @__PURE__ */ new Set();
	const agentIds = new Set(listAgentIds(params.cfg));
	const agentsRoot = path.join(root, "agents");
	if (statMigrationPath(agentsRoot)?.isDirectory() && !hasSymbolicLinkInDirectoryPath(agentsRoot)) {
		for (const item of fs.readdirSync(agentsRoot, { withFileTypes: true })) if (item.isDirectory()) {
			agentIds.add(item.name);
			stores.add(path.join(agentsRoot, item.name, "sessions", "sessions.json"));
		}
	}
	for (const agentId of agentIds) stores.add(canonicalMigrationFilePath(resolveSessionStorePathCore(params.cfg.session?.store, {
		agentId,
		env: params.env
	})));
	stores.add(path.join(root, "sessions", "sessions.json"));
	for (const store of stores) if (isPathInside(root, store)) archiveDirs.add(path.join(path.dirname(path.dirname(store)), "session-sqlite-import-archive"));
	const references = /* @__PURE__ */ new Map();
	const manifestPaths = [];
	const artifacts = [];
	let laterUpdateStartedAt = 0;
	const manifestsDir = resolveSessionSqliteMigrationRunsDir(params.env);
	if (hasSymbolicLinkInDirectoryPath(manifestsDir)) artifacts.push({
		path: manifestsDir,
		runs: [],
		bytes: 0,
		outcome: "blocked",
		reason: "manifest-directory-alias"
	});
	else {
		manifestPaths.push(...listSessionSqliteMigrationManifestPaths(params.env));
		for (const manifestPath of manifestPaths) {
			const stat = statMigrationPath(manifestPath);
			const manifest = stat?.isFile() && stat.nlink === 1 ? readSessionSqliteMigrationManifest(manifestPath) : void 0;
			if (!manifest) {
				artifacts.push({
					path: manifestPath,
					runs: [],
					bytes: stat?.size ?? 0,
					outcome: "blocked",
					reason: "unreadable-manifest"
				});
				continue;
			}
			const run = {
				manifest,
				manifestPath
			};
			const consumed = collectRecordedConsumedArchives(manifest);
			for (const target of manifest.targets) {
				const expected = resolveUnsuffixedSqliteTargetFromSessionStorePath(target.storePath);
				const trusted = isPathInside(root, target.sqlitePath) && isPathInside(root, target.storePath) && !hasSymbolicLinkInDirectoryPath(path.dirname(target.storePath)) && !hasSymbolicLinkInDirectoryPath(path.dirname(target.sqlitePath)) && (target.databaseIdentity || stores.has(target.storePath) && (expected.agentId ? target.sqlitePath === expected.path && target.agentId === expected.agentId : path.dirname(target.sqlitePath) === path.dirname(expected.path)));
				for (const move of uniqueRestoreMoves(target)) {
					const refs = references.get(move.archivePath) ?? [];
					refs.push({
						run,
						target,
						move,
						trusted: Boolean(trusted),
						consumedByRestore: consumed.has(move.archivePath)
					});
					references.set(move.archivePath, refs);
				}
			}
		}
	}
	if ([...references.values()].some((refs) => refs.some((ref) => ref.target.databaseIdentity))) try {
		laterUpdateStartedAt = Math.max(0, ...listUpdateRuns({ limit: 100 }, { env: params.env }).filter((run) => run.status === "succeeded" && run.finishedAtMs !== null).map((run) => run.createdAtMs));
	} catch {}
	for (const [archivePath, refs] of references) {
		const evidence = resolveRecoveryArtifact(refs);
		const stat = refs.every((ref) => ref.trusted) ? fs.lstatSync(archivePath, {
			bigint: true,
			throwIfNoEntry: false
		}) : void 0;
		const claim = refs.every((ref) => ref.trusted) && evidence?.disposal.state === "pending-disposal" ? fs.lstatSync(evidence.disposal.claimPath, {
			bigint: true,
			throwIfNoEntry: false
		}) : void 0;
		const current = stat ?? claim;
		const item = {
			path: archivePath,
			runs: [...new Set(refs.map((ref) => ref.run.manifest.runId))],
			bytes: current?.isFile() ? Number(current.size) : evidence?.identity.size ?? 0,
			outcome: "candidate",
			reason: "producer-verified-original",
			consequence: "Permanently loses rollback to this original, including pre-repair branches and metadata."
		};
		if (refs.some((ref) => !ref.trusted)) {
			item.outcome = "protected";
			item.reason = "unsupported-target-ownership";
		} else if (refs.every((ref) => ref.move.artifact?.disposal.state === "disposed")) {
			item.outcome = stat ? "protected" : "disposed";
			item.reason = stat ? "recreated-after-disposal" : "intentionally-disposed";
		} else if (refs.some((ref) => ref.consumedByRestore)) {
			item.outcome = "protected";
			item.reason = "archive-consumed-by-restore";
		} else if (hasSymbolicLinkInDirectoryPath(path.dirname(archivePath)) || stat && (!stat.isFile() || stat.nlink !== 1n && !isPendingMigrationArtifactClaim(archivePath, evidence))) {
			item.outcome = "blocked";
			item.reason = "artifact-alias-or-nonregular";
		} else if (refs.some(({ run, target }) => !run.manifest.completedAt || target.validationBeforeArchive !== "passed" || target.issues.some((issue) => !isSessionSqliteMigrationWarning(issue)))) {
			item.outcome = "protected";
			item.reason = "incomplete-recovery-operation";
		} else if (refs.some(({ move }) => move.artifact?.classification === "protected")) {
			item.outcome = "protected";
			item.reason = refs.find((ref) => ref.move.artifact?.classification === "protected").move.artifact.reason;
		} else if (refs.some(({ target, run }) => target.databaseIdentity && !(laterUpdateStartedAt > Date.parse(run.manifest.completedAt)))) {
			item.outcome = "protected";
			item.reason = "awaiting-later-completed-update";
		} else if (refs.some(({ move }) => !move.artifact)) {
			item.outcome = "verification-required";
			item.reason = "historical-manifest-without-import-proof";
		} else if (current && evidence && [
			"ino",
			"mtimeNs",
			"size"
		].some((key) => String(current[key]) !== String(evidence.identity[key]))) {
			item.outcome = "blocked";
			item.reason = "artifact-metadata-changed";
		} else if (refs.some(({ move }) => !sameMigrationArtifact(move.artifact.identity, evidence.identity))) {
			item.outcome = "blocked";
			item.reason = "conflicting-artifact-identities";
		} else if (refs.some(({ move }) => {
			const receipt = move.artifact?.disposal;
			return receipt?.state === "pending-disposal" && evidence?.disposal.state === "pending-disposal" && receipt.claimPath !== evidence.disposal.claimPath;
		})) {
			item.outcome = "blocked";
			item.reason = "conflicting-disposal-claims";
		} else if (!stat && !refs.every(({ move }) => move.artifact?.disposal.state === "pending-disposal" || move.artifact?.disposal.state === "disposed")) {
			item.outcome = "blocked";
			item.reason = "unexpectedly-missing-artifact";
		} else if (refs.some(({ move }) => move.artifact?.disposal.state === "pending-disposal")) item.reason = "resume-pending-disposal";
		artifacts.push(item);
	}
	const recoveryDirectories = /* @__PURE__ */ new Set([
		path.join(root, "state"),
		...[...stores].flatMap((store) => [path.dirname(store), path.dirname(resolveUnsuffixedSqliteTargetFromSessionStorePath(store).path)]),
		...[...references.values()].flatMap((refs) => refs.filter((ref) => ref.trusted).map((ref) => path.dirname(ref.target.sqlitePath)))
	]);
	for (const directory of recoveryDirectories) {
		if (!isPathInside(root, directory) || !statMigrationPath(directory)?.isDirectory() || hasSymbolicLinkInDirectoryPath(directory)) continue;
		for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
			if (!isMigrationArchiveArtifactName(entry.name) && !entry.name.includes(".pre-doctor-") && !/^.+\.pre-startup-migration-.+\.bak$/.test(entry.name)) continue;
			const filePath = path.join(directory, entry.name);
			if (references.has(filePath)) continue;
			artifacts.push({
				path: filePath,
				runs: [],
				bytes: entry.isFile() ? fs.lstatSync(filePath).size : 0,
				outcome: "protected",
				reason: "unmanifested-recovery-original"
			});
		}
	}
	for (const directory of archiveDirs) {
		if (!statMigrationPath(directory)?.isDirectory() || hasSymbolicLinkInDirectoryPath(directory)) continue;
		for (const item of fs.readdirSync(directory, { withFileTypes: true })) {
			const filePath = path.join(directory, item.name);
			if (references.has(filePath) || artifacts.some((artifact) => artifact.path === filePath)) continue;
			if ([...references.values()].some((refs) => refs.some(({ move }) => move.artifact?.disposal.state === "pending-disposal" && move.artifact.disposal.claimPath === filePath))) continue;
			artifacts.push({
				path: filePath,
				runs: [],
				bytes: item.isFile() ? fs.lstatSync(filePath).size : 0,
				outcome: "protected",
				reason: "unmanifested-artifact"
			});
		}
	}
	if (artifacts.some((item) => item.reason === "unreadable-manifest" || item.reason === "manifest-directory-alias")) {
		for (const item of artifacts) if (item.outcome === "candidate" || item.outcome === "verification-required") {
			item.outcome = "blocked";
			item.reason = "unreadable-recovery-dependencies";
		}
	}
	protectRecoveryDependencies(artifacts, references);
	return {
		references,
		manifestPaths,
		report: summarizeRecoveryCleanup(root, artifacts, "preview")
	};
}
function protectRecoveryDependencies(artifacts, refs, adoptions) {
	const active = (ref) => (!ref.consumedByRestore || statMigrationPath(ref.move.archivePath) !== void 0) && ref.move.artifact?.disposal.state !== "disposed";
	const bySource = /* @__PURE__ */ new Map();
	const dependents = /* @__PURE__ */ new Map();
	for (const [archive, references] of refs) for (const ref of references.filter(active)) {
		const paths = bySource.get(ref.move.sourcePath) ?? [];
		paths.push(archive);
		bySource.set(ref.move.sourcePath, paths);
	}
	const connect = (from, to) => {
		const paths = dependents.get(from) ?? /* @__PURE__ */ new Set();
		paths.add(to);
		dependents.set(from, paths);
	};
	const backupGroups = /* @__PURE__ */ new Map();
	for (const [archive, references] of refs) for (const ref of references.filter(active)) {
		if (ref.target.databaseIdentity) {
			const sibling = backupGroups.get(ref.run.manifestPath);
			if (sibling) {
				connect(archive, sibling);
				connect(sibling, archive);
			} else backupGroups.set(ref.run.manifestPath, archive);
		}
		const dependencies = (ref.move.artifact ?? adoptions?.get(ref))?.dependencies ?? (ref.move.kind === "legacy-store" ? uniqueRestoreMoves(ref.target).filter((move) => move.kind === "transcript").map((move) => move.sourcePath) : []);
		for (const source of dependencies) for (const dependency of bySource.get(source) ?? []) {
			connect(archive, dependency);
			if (ref.move.kind === "legacy-store") connect(dependency, archive);
		}
	}
	const byPath = new Map(artifacts.map((item) => [item.path, item]));
	const retained = artifacts.filter((item) => item.outcome !== "candidate" && item.outcome !== "verification-required" && item.outcome !== "disposed" && item.outcome !== "removed");
	for (const item of retained) for (const dependency of dependents.get(item.path) ?? []) {
		const candidate = byPath.get(dependency);
		if (candidate?.outcome !== "candidate" && candidate?.outcome !== "verification-required") continue;
		candidate.outcome = "protected";
		candidate.reason = "retained-recovery-dependency";
		retained.push(candidate);
	}
}
function summarizeRecoveryCleanup(stateDir, artifacts, status) {
	const totals = {
		candidateBytes: 0,
		verificationRequiredBytes: 0,
		protectedBytes: 0,
		blockedBytes: 0,
		removedBytes: 0,
		removedFiles: 0
	};
	for (const item of artifacts) {
		if (item.outcome === "candidate") totals.candidateBytes += item.bytes;
		if (item.outcome === "verification-required") totals.verificationRequiredBytes += item.bytes;
		if (item.outcome === "protected") totals.protectedBytes += item.bytes;
		if (item.outcome === "blocked" || item.outcome === "failed") totals.blockedBytes += item.bytes;
		if (item.removedBytes !== void 0) {
			totals.removedBytes += item.removedBytes;
			totals.removedFiles += 1;
		}
	}
	return {
		stateDir,
		artifacts,
		totals,
		status
	};
}
function inspectSessionSqliteRecovery(params) {
	return collectRecoveryInventory(params).report;
}
//#endregion
//#region src/commands/doctor-session-sqlite-discovery.ts
/** Historical discovery belongs to offline Doctor, never runtime path resolution. */
/** Retained manifests bind archive files to their original agent, path, and bytes. */
function collectHistoricalArchiveSources(params) {
	const result = /* @__PURE__ */ new Map();
	const inventory = collectRecoveryInventory(params);
	const claims = /* @__PURE__ */ new Map();
	for (const refs of inventory.references.values()) {
		if (refs.some((ref) => !ref.trusted || ref.consumedByRestore)) continue;
		const first = refs[0];
		if (!refs.every(({ target, move }) => target.agentId === first.target.agentId && target.storePath === first.target.storePath && target.sqlitePath === first.target.sqlitePath && move.sourcePath === first.move.sourcePath)) continue;
		if (first.move.kind !== "legacy-store" && (first.move.kind !== "unreferenced-jsonl" || !isPrimarySessionTranscriptFileName(path.basename(first.move.sourcePath)))) continue;
		if (!refs.every(({ move }) => move.artifact && (move.kind === "legacy-store" || move.artifact.classification === "protected") && sameMigrationArtifact(move.artifact.identity, first.move.artifact.identity))) continue;
		if (first.move.kind === "unreferenced-jsonl") {
			const identity = first.move.artifact.identity;
			const key = JSON.stringify([
				first.target.agentId,
				first.target.storePath,
				first.target.sqlitePath,
				first.move.sourcePath,
				identity.size,
				identity.sha256
			]);
			claims.set(key, [...claims.get(key) ?? [], refs]);
		}
		if (refs.some((ref) => ref.move.artifact?.disposal.state !== "retained")) continue;
		if (refs.some(({ target, move }) => move.artifact?.reason === "indexed-historical-primary" && target.completedMoves.some((completed) => completed.archivePath === move.archivePath))) continue;
		const sources = result.get(first.target.storePath) ?? {
			transcripts: [],
			stores: []
		};
		(first.move.kind === "legacy-store" ? sources.stores : sources.transcripts).push(first.move);
		result.set(first.target.storePath, sources);
	}
	if (inventory.report.artifacts.some((item) => ["unreadable-manifest", "manifest-directory-alias"].includes(item.reason))) claims.clear();
	return {
		sources: result,
		claims: [...claims.values()].filter((group) => group.length > 1),
		inventory
	};
}
/** Archived registries supply lineage only; never replay their entries over live SQLite state. */
function readArchivedSessionOwnership(target, stores, issues) {
	const records = [];
	let verified = true;
	for (const move of stores) {
		if (!fs.existsSync(move.archivePath)) continue;
		const ownershipIssues = [];
		try {
			const identity = readMigrationArtifactIdentity(move.archivePath);
			if (!sameMigrationArtifact(identity, move.artifact.identity, { ignoreDevice: true })) throw new Error("Archived session registry no longer matches its migration receipt (file metadata or contents changed).");
			records.push(...readLegacySessionRecords(target, ownershipIssues, { sourcePath: move.archivePath }));
			if (ownershipIssues.length || !sameMigrationArtifact(readMigrationArtifactIdentity(move.archivePath), identity)) throw new Error("Archived session registry changed during verification or contains invalid entries.");
		} catch (error) {
			verified = false;
			issues.push({
				code: "historical_transcript_deferred",
				message: `${move.archivePath}: ${formatErrorMessage(error)} Historical transcript import skipped for this store; originals retained. This archive warning does not indicate SQLite corruption. No action is needed if all expected conversations are present. If history is missing, preserve the archive and migration manifests and follow https://docs.openclaw.ai/cli/doctor/sqlite-maintenance#changed-archived-registry`
			});
		}
	}
	return verified ? records : void 0;
}
async function discoverLegacyHistoricalTranscripts(params) {
	const directory = path.dirname(canonicalMigrationFilePath(params.target.storePath));
	assertSafeSessionSqliteMigrationDirectory(directory);
	const sources = /* @__PURE__ */ new Map();
	const referenced = new Set(params.records.flatMap((record) => record.transcriptPath ? [canonicalMigrationFilePath(record.transcriptPath)] : []));
	for (const filename of listLegacySessionTranscriptFiles(directory)) if ((!params.verifiedSourcePaths || params.verifiedSourcePaths.has(filename)) && !referenced.has(canonicalMigrationFilePath(filename)) && !params.referencedPaths?.has(canonicalMigrationFilePath(filename))) sources.set(filename, {
		path: filename,
		originalPath: filename
	});
	const archivedReferences = new Set((params.ownershipRecords ?? []).flatMap((record) => record.transcriptDependencies.map(canonicalMigrationFilePath)));
	for (const move of params.archiveSources ?? []) {
		if (archivedReferences.has(canonicalMigrationFilePath(move.sourcePath))) continue;
		sources.set(move.archivePath, {
			path: move.archivePath,
			originalPath: move.sourcePath,
			archiveMove: move
		});
	}
	const owners = /* @__PURE__ */ new Map();
	try {
		for (const record of [...params.records, ...params.ownershipRecords ?? []]) for (const id of collectSessionStateIdsForEntry(record.entry)) {
			const keys = owners.get(id) ?? /* @__PURE__ */ new Set();
			keys.add(record.sessionKey);
			owners.set(id, keys);
		}
	} catch (error) {
		params.issues.push({
			code: "historical_transcript_deferred",
			message: `${params.target.storePath}: invalid legacy lineage; originals retained: ${String(error)}`
		});
		return [];
	}
	const retainedSharedAliasIds = new Set([...owners].filter(([, keys]) => keys.size > 1).map(([id]) => id));
	const discovered = [];
	const candidates = /* @__PURE__ */ new Map();
	for (const source of sources.values()) {
		await setImmediate();
		try {
			const identity = readMigrationArtifactIdentity(source.path);
			if (source.archiveMove && !sameMigrationArtifact(identity, source.archiveMove.artifact.identity, { ignoreDevice: true })) throw new Error("Archived original changed since migration; retained without importing");
			const primary = readLegacyPrimaryTranscriptIdentity(source.path, source.originalPath, source.archiveMove ? retainedSharedAliasIds : void 0);
			if (!primary) continue;
			if (!sameMigrationArtifact(identity, readMigrationArtifactIdentity(source.path))) throw new Error("Primary transcript changed during discovery");
			if (params.records.some((record) => record.entry.sessionId === primary.sessionId && record.transcriptPath && fs.existsSync(record.transcriptPath))) throw new Error("A registered primary already claims this identity; extra original retained");
			const existingOwner = params.snapshot.sessionKeysBySessionId.get(primary.sessionId);
			const lineage = owners.get(primary.sessionId);
			if (lineage && (lineage.size !== 1 || existingOwner && !lineage.has(existingOwner))) throw new Error("Conflicting logical owners; retained without importing");
			const owner = existingOwner ?? lineage?.values().next().value;
			const pathOwner = resolveUnsuffixedSqliteTargetFromSessionStorePath(params.target.storePath).agentId;
			if (!owner && pathOwner !== params.target.agentId) throw new Error("No unambiguous agent owner for unregistered history");
			const record = {
				sessionKey: owner ?? `agent:${params.target.agentId}:recovered:${primary.sessionId}`,
				entry: {
					sessionId: primary.sessionId,
					updatedAt: primary.updatedAt,
					archivedAt: primary.updatedAt || 1
				},
				transcriptPath: source.path,
				transcriptDependencies: [source.originalPath],
				historical: {
					originalPath: source.originalPath,
					identity,
					...source.archiveMove ? { archiveMove: source.archiveMove } : {}
				}
			};
			const records = candidates.get(primary.sessionId) ?? [];
			records.push(record);
			candidates.set(primary.sessionId, records);
		} catch (error) {
			params.issues.push({
				code: "historical_transcript_deferred",
				message: `${source.originalPath}: ${String(error)}`
			});
		}
	}
	for (const [sessionId, records] of candidates) {
		const first = records[0];
		const identicalArchives = records.every((record) => record.historical?.archiveMove && record.historical.originalPath === first.historical.originalPath && record.historical.identity.size === first.historical.identity.size && record.historical.identity.sha256 === first.historical.identity.sha256);
		if (records.length > 1 && !identicalArchives) params.issues.push({
			code: "historical_transcript_deferred",
			message: `${sessionId}: multiple primary files claim this identity; originals retained without importing`
		});
		else discovered.push(first);
	}
	return discovered;
}
function gatherLegacyArchiveCoverage(cfg, env, targets, knownTargets = resolveAllAgentSessionStoreCandidateTargetsSync(cfg, { env })) {
	const selectedStorePaths = /* @__PURE__ */ new Set();
	const referencedPaths = /* @__PURE__ */ new Set();
	const retainedPaths = /* @__PURE__ */ new Set();
	const incompleteDirectories = /* @__PURE__ */ new Set();
	const retainedDirectories = /* @__PURE__ */ new Set();
	const indexIdentities = /* @__PURE__ */ new Map();
	const targetsByStore = /* @__PURE__ */ new Map();
	for (const target of targets) {
		const storePath = canonicalMigrationFilePath(target.storePath);
		targetsByStore.set(storePath, [...targetsByStore.get(storePath) ?? [], target]);
	}
	const directories = new Set([...targetsByStore.keys()].map((store) => path.dirname(store)));
	const knownStores = new Map([...knownTargets, ...targets].map((target) => [canonicalMigrationFilePath(target.storePath), target]));
	for (const [storePath, target] of knownStores) {
		if (storePath.endsWith(".sqlite") || !directories.has(path.dirname(storePath)) || !fs.existsSync(storePath)) continue;
		const storeTargets = targetsByStore.get(storePath) ?? [];
		const issues = [];
		let records;
		try {
			assertSafeSessionSqliteMigrationDirectory(path.dirname(storePath));
			indexIdentities.set(storePath, readMigrationArtifactIdentity(storePath));
			records = readLegacySessionRecords(target, issues);
		} catch (error) {
			if (storeTargets.length > 0) throw error;
			incompleteDirectories.add(path.dirname(storePath));
			retainedDirectories.add(path.dirname(storePath));
			continue;
		}
		const keys = [...records.map((record) => record.sessionKey), ...issues.flatMap((issue) => issue.sessionKey ? [issue.sessionKey] : [])];
		const selected = storeTargets.length > 0 && issues.every(isSessionSqliteMigrationWarning) && keys.every((sessionKey) => storeTargets.some((candidate) => !shouldFilterLegacySessionRecordsByTarget(candidate) || isLegacySessionRecordOwnedByTarget(cfg, candidate, sessionKey)));
		if (issues.length > 0) {
			incompleteDirectories.add(path.dirname(storePath));
			if (!selected) retainedDirectories.add(path.dirname(storePath));
		}
		if (selected) selectedStorePaths.add(storePath);
		for (const record of records) {
			if (!record.transcriptPath) continue;
			for (const source of [
				record.transcriptPath,
				resolveTrajectoryPath(record.transcriptPath),
				resolveTrajectoryPointerPath(record.transcriptPath)
			]) {
				if (!source) continue;
				const canonical = canonicalMigrationFilePath(source);
				referencedPaths.add(canonical);
				if (!selected) retainedPaths.add(canonical);
			}
		}
	}
	for (const [storePath, storeTargets] of targetsByStore) if (!fs.existsSync(storePath) && storeTargets.every((target) => !shouldFilterLegacySessionRecordsByTarget(target))) selectedStorePaths.add(storePath);
	return {
		knownTargets,
		selectedStorePaths,
		referencedPaths,
		retainedPaths,
		incompleteDirectories,
		retainedDirectories,
		indexIdentities
	};
}
function readLegacySessionRecords(target, issues, options = {}) {
	return readLegacySessionStoreEntries(target, issues, options).entries.map(({ entry, sessionKey }) => {
		const { transcriptPath, transcriptDependencies } = resolveLegacyTranscriptPaths(target, entry, options.verifiedSourcePaths);
		return {
			entry: migrateLegacySessionCreator(normalizeLegacySessionEntryDelivery(entry)),
			sessionKey,
			transcriptPath,
			transcriptDependencies
		};
	});
}
function listUnreferencedJsonlFiles(storePath, referencedPaths) {
	const sessionsDir = path.dirname(storePath);
	let entries;
	try {
		entries = fs.readdirSync(sessionsDir);
	} catch {
		return [];
	}
	const referenced = new Set(referencedPaths.map((filePath) => resolveRealpathOrAbsolute(filePath)));
	return entries.filter((entry) => entry.endsWith(".jsonl")).map((entry) => path.join(sessionsDir, entry)).filter((filePath) => !referenced.has(resolveRealpathOrAbsolute(filePath))).toSorted((a, b) => a.localeCompare(b));
}
/** Complete indexless discovery before import, keeping current ownership authoritative. */
async function appendLegacyHistoricalTranscripts(params) {
	const { allRecords, retainedImport, sourceConflicts, issues } = params;
	const archiveSources = params.historicalArchives?.get(canonicalMigrationFilePath(params.target.storePath));
	const ownershipRecords = readArchivedSessionOwnership(params.target, retainedImport ? [] : archiveSources?.stores ?? [], issues);
	const snapshot = readOnlySqliteValidationSnapshot(params.target);
	if (snapshot.ok && ownershipRecords) {
		const discovered = await discoverLegacyHistoricalTranscripts({
			target: params.target,
			records: allRecords,
			ownershipRecords,
			referencedPaths: params.referencedPaths,
			archiveSources: !retainedImport ? archiveSources?.transcripts : [],
			verifiedSourcePaths: retainedImport ? new Set(retainedImport.sources.filter((source) => !sourceConflicts.has(source.path)).map((source) => source.path)) : void 0,
			snapshot: snapshot.snapshot,
			issues
		});
		for (const historical of discovered) {
			const registered = allRecords.find((record) => record.sessionKey === historical.sessionKey && record.entry.sessionId === historical.entry.sessionId && (!record.transcriptPath || !fs.existsSync(record.transcriptPath)));
			if (registered) {
				registered.transcriptPath = historical.transcriptPath;
				registered.transcriptDependencies.push(...historical.transcriptDependencies);
				registered.historical = historical.historical;
			} else allRecords.push(historical);
		}
	} else if (!snapshot.ok) issues.push({
		code: "sqlite_read_failed",
		message: String(snapshot.error)
	});
}
//#endregion
//#region src/commands/doctor-session-sqlite-migration-coalesce.ts
/** Manifest-owned redirection of verified redundant archive references. */
/** Replace retired duplicate references without removing any run's rollback coverage. */
function coalesceSessionSqliteArchiveReferences(replacements, runs) {
	const results = /* @__PURE__ */ new Map();
	const changed = /* @__PURE__ */ new Set();
	for (const run of runs) for (const target of run.manifest.targets) {
		const paths = new Set(uniqueRestoreMoves(target).map((move) => move.archivePath));
		const settled = [...replacements].filter(([original, survivor]) => paths.has(original) || paths.has(survivor.archivePath));
		if (settled.length === 0) continue;
		const key = sessionSqliteMigrationTargetKey(target);
		const result = results.get(key) ?? {
			target,
			archives: /* @__PURE__ */ new Set(),
			issues: [{
				code: "historical_duplicate_settled",
				message: ""
			}]
		};
		results.set(key, result);
		settled.forEach(([original]) => result.archives.add(original));
		target.issues.push(...result.issues);
		for (const list of ["plannedMoves", "completedMoves"]) {
			const moves = /* @__PURE__ */ new Map();
			for (const move of target[list]) {
				const survivor = replacements.get(move.archivePath);
				if (survivor && move.artifact?.disposal.state === "disposed") {
					move.archivePath = survivor.archivePath;
					move.artifact = {
						...move.artifact,
						identity: survivor.artifact.identity,
						disposal: { state: "retained" }
					};
				}
				const moveKey = migrationMoveKey(move);
				if (moves.get(moveKey)?.artifact?.reason !== "indexed-historical-primary") moves.set(moveKey, move);
			}
			target[list] = [...moves.values()];
		}
		changed.add(run);
	}
	for (const { archives, issues } of results.values()) issues[0].message = `Retired ${archives.size} byte-identical duplicate archive(s); rollback references now use the verified surviving originals.`;
	for (const run of changed) writeSessionSqliteMigrationManifest(run);
	return [...results.values()].map(({ target, issues }) => ({
		target,
		issues
	}));
}
//#endregion
//#region src/commands/doctor-session-sqlite-verification.ts
/** Offline destination ownership and conservative adoption of historical import evidence. */
/** Keep one owner proof per database; fence in-place writes and sidecar changes after awaits. */
function createRecoveryDestinationVerifier(stateDir) {
	const destinations = /* @__PURE__ */ new Map();
	return (refs) => {
		for (const { target } of refs) {
			const paths = resolveSqliteDatabaseFilePaths(target.sqlitePath);
			assertDoctorSqliteMaintenancePathsNotAliased("update recovery cleanup", paths, [stateDir]);
			const expected = destinations.get(target.sqlitePath);
			let agentId = expected?.agentId;
			if (!expected) {
				const owner = inspectOpenClawAgentDatabaseOwner(target.sqlitePath);
				agentId = owner.status === "owned" ? owner.agentId : void 0;
			}
			if (!target.databaseIdentity && agentId !== target.agentId) throw new Error("destination database ownership cannot be verified");
			const files = paths.map((file) => fs.lstatSync(file, {
				bigint: true,
				throwIfNoEntry: false
			}));
			if (!files[0]?.isFile() || target.databaseIdentity && (String(files[0]?.dev) !== target.databaseIdentity.dev || String(files[0]?.ino) !== target.databaseIdentity.ino) || files.some((file) => file && (!file.isFile() || file.nlink !== 1n)) || expected && files.some((file, index) => [
				"dev",
				"ino",
				"ctimeNs",
				"mtimeNs",
				"size"
			].some((key) => file?.[key] !== expected.files[index]?.[key]))) throw new Error("Recovery destination database changed; preview cleanup again.");
			if (!expected) destinations.set(target.sqlitePath, {
				agentId,
				files
			});
		}
	};
}
function verifyHistoricalMigrationArtifact(params) {
	const { target, move, env } = params;
	if (move.kind !== "legacy-store" && move.kind !== "transcript") return;
	const identity = readMigrationArtifactIdentity(move.archivePath);
	const indexMove = move.kind === "legacy-store" ? move : uniqueRestoreMoves(target).find((item) => item.kind === "legacy-store");
	if (!indexMove) return;
	readMigrationArtifactIdentity(indexMove.archivePath);
	const fd = fs.openSync(indexMove.archivePath, fs.constants.O_RDONLY | (fs.constants.O_NOFOLLOW ?? 0));
	let index;
	try {
		index = JSON.parse(readFileDescriptorBoundedSync(fd, fs.fstatSync(fd).size).toString("utf8"));
	} finally {
		fs.closeSync(fd);
	}
	if (!isRecord(index)) return;
	const entries = move.kind === "legacy-store" ? Object.entries(index) : move.sessionKey ? [[move.sessionKey, index[move.sessionKey]]] : [];
	if (move.kind === "transcript" && entries.length !== 1) return;
	const dependencies = new Set(move.kind === "legacy-store" ? uniqueRestoreMoves(target).filter((item) => item.kind === "transcript").map((item) => item.sourcePath) : []);
	const verified = withOpenClawAgentDatabaseReadOnly((database) => {
		const db = getSessionKysely(database.db);
		for (const [key, raw] of entries) {
			if (typeof key !== "string" || !isRecord(raw) || typeof raw.sessionId !== "string" || !raw.sessionId.trim() || typeof raw.updatedAt !== "number") return false;
			const sessionId = raw.sessionId;
			const row = executeSqliteQueryTakeFirstSync(database.db, db.selectFrom("session_nodes").select(["current_session_id", "entry_json"]).select(sessionEntrySnapshotColumns).where("session_key", "=", key));
			if (!row || row.current_session_id !== raw.sessionId) return false;
			const current = JSON.parse(row.entry_json);
			if (!isRecord(current)) return false;
			attachSessionEntrySnapshots(current, row);
			const entry = {
				...raw,
				sessionId,
				updatedAt: raw.updatedAt
			};
			const normalized = migrateLegacySessionCreator(normalizeLegacySessionEntryDelivery(entry));
			if (Object.entries(normalized).some(([field, value]) => field !== "sessionFile" && JSON.stringify(current[field]) !== JSON.stringify(value))) return false;
			if (move.kind !== "transcript") {
				for (const source of resolveLegacyTranscriptPaths(target, entry).transcriptDependencies) dependencies.add(canonicalMigrationFilePath(source));
				continue;
			}
			if (!verifyTranscriptEvents(database.db, {
				path: move.archivePath,
				originalPath: move.sourcePath,
				sessionId
			})) return false;
		}
		return true;
	}, {
		agentId: target.agentId,
		path: target.sqlitePath,
		env
	});
	if (!verified.found || !verified.value) return;
	return {
		identity,
		classification: "imported",
		reason: "verified-historical-import",
		dependencies: [...dependencies],
		disposal: { state: "retained" }
	};
}
function validateLegacySessionRecords(target, records, report, purpose, env) {
	if (report.issues.some((issue) => issue.code === "legacy_import_deferred" && !issue.sessionKey)) return false;
	if (purpose === "before-archive" && records.length === 0) return true;
	const issueCountBeforeValidation = report.issues.length;
	const validation = readOnlySqliteValidationSnapshot(target);
	if (!validation.ok) {
		report.issues.push({
			code: "sqlite_read_failed",
			message: `SQLite validation read failed: ${String(validation.error)}`
		});
		return false;
	}
	for (const record of records) validateLegacySessionRecord(record, report, validation.snapshot, purpose, env);
	return report.issues.length === issueCountBeforeValidation;
}
function validateLegacySessionRecord(record, report, snapshot, purpose, env) {
	const beforeArchive = purpose === "before-archive";
	const normalizedKey = beforeArchive ? record.sessionKey : normalizeStoreSessionKey(record.sessionKey);
	const sqliteSessionId = record.historical || record.preserveCurrentSession ? snapshot.sessionKeysBySessionId.get(record.entry.sessionId) === normalizedKey ? record.entry.sessionId : void 0 : snapshot.sessionIdsBySessionKey.get(normalizedKey);
	if (!sqliteSessionId) {
		report.issues.push({
			code: "sqlite_entry_missing",
			message: `SQLite entry is missing for ${normalizedKey}.`,
			sessionKey: record.sessionKey
		});
		return;
	}
	if (sqliteSessionId !== record.entry.sessionId) {
		report.issues.push({
			code: "sqlite_entry_mismatch",
			message: `SQLite sessionId ${sqliteSessionId} does not match ${record.entry.sessionId}.`,
			sessionKey: record.sessionKey
		});
		return;
	}
	if (beforeArchive && record.preserveCurrentSession && report.issues.some((issue) => issue.code === "legacy_import_deferred" && issue.sessionKey === record.sessionKey)) return;
	if (!beforeArchive) report.validatedEntries += 1;
	const result = countTranscriptEventsForPath(record.transcriptPath);
	if (result.status === "missing") {
		if (!beforeArchive) report.validatedTranscriptEvents += snapshot.transcriptEventCountsBySessionId.get(record.entry.sessionId) ?? 0;
		return;
	}
	if (result.status !== "ok") {
		if (!report.issues.some((issue) => issue.code === "transcript_malformed" && issue.sessionKey === record.sessionKey)) report.issues.push({
			code: "transcript_malformed",
			message: result.message,
			sessionKey: record.sessionKey
		});
		return;
	}
	const sqliteEvents = snapshot.transcriptEventCountsBySessionId.get(record.entry.sessionId) ?? 0;
	const expectedEvents = beforeArchive ? record.recovery?.sqliteEvents ?? record.recovery?.events ?? result.events : result.events;
	if (!(beforeArchive || !record.transcriptPath ? sqliteEvents >= expectedEvents : verifyCanonicalSessionTranscriptSources({
		target: report,
		mode: "contained",
		sources: [{
			path: record.transcriptPath,
			sessionId: record.entry.sessionId,
			originalPath: record.historical?.originalPath
		}],
		env
	}))) {
		report.issues.push({
			code: "sqlite_transcript_count_mismatch",
			message: beforeArchive ? `SQLite transcript has ${sqliteEvents} events; verified import expects ${expectedEvents}.` : `SQLite transcript has ${sqliteEvents} events; source has ${result.events}, but its events are not all present with matching content. Run openclaw doctor --session-sqlite recover to import a missing suffix or identify conflicting events.`,
			sessionKey: record.sessionKey
		});
		return;
	}
	if (!beforeArchive) report.validatedTranscriptEvents += sqliteEvents;
}
//#endregion
//#region src/commands/doctor-session-sqlite-retirement.ts
/** Retirement of producer-verified originals; never a suffix deletion policy. */
function assertRecoveryOriginal(archivePath, artifact) {
	const currentPath = statMigrationPath(archivePath) ? archivePath : artifact.disposal.state === "pending-disposal" ? artifact.disposal.claimPath : archivePath;
	if (!statMigrationPath(currentPath)) {
		if (artifact.disposal.state === "pending-disposal" && artifact.disposal.phase === "unlink-pending") return;
		throw new Error("artifact is unexpectedly missing");
	}
	const links = isPendingMigrationArtifactClaim(archivePath, artifact) ? 2n : 1n;
	const identity = readMigrationArtifactIdentity(currentPath, links);
	if (!sameMigrationArtifact(identity, artifact.identity, { ignoreDevice: true })) throw new Error("artifact identity or contents changed");
	return identity;
}
/** Coalesce only exact raw copies; the surviving original preserves every rollback byte. */
async function settleDuplicateSessionSqliteArchives(params) {
	const { claims, inventory: { report, references } } = collectHistoricalArchiveSources(params);
	const failures = [];
	const survivors = /* @__PURE__ */ new Map();
	const selected = [];
	const replacements = /* @__PURE__ */ new Map();
	const assertSurvivor = (refs) => {
		const move = survivors.get(refs[0].move.archivePath)[0].move;
		if (hasSymbolicLinkInDirectoryPath(path.dirname(move.archivePath))) throw new Error("Retained duplicate archive directory changed.");
		assertRecoveryOriginal(move.archivePath, move.artifact);
	};
	for (const group of claims) {
		const target = group[0][0].target;
		if (!params.targets.some((candidate) => candidate.agentId === target.agentId && candidate.storePath === target.storePath && candidate.sqlitePath === target.sqlitePath)) continue;
		const survivor = group.find((refs) => refs.every((ref) => ref.move.artifact.disposal.state === "retained"));
		if (!survivor) continue;
		for (const refs of group.filter((candidate) => candidate !== survivor)) {
			const item = report.artifacts.find((candidate) => candidate.path === refs[0].move.archivePath);
			survivors.set(item.path, survivor);
			try {
				assertSurvivor(refs);
				const artifact = resolveRecoveryArtifact(refs);
				if (refs.some((ref) => ref.move.artifact.disposal.state === "disposed") && statMigrationPath(item.path)) throw new Error("Archive was recreated after disposal.");
				if (artifact.disposal.state !== "disposed") {
					assertRecoveryOriginal(item.path, artifact);
					item.outcome = "candidate";
					selected.push(item);
				}
				replacements.set(item.path, survivor[0].move);
			} catch (error) {
				failures.push({
					target,
					issues: [{
						code: "historical_transcript_deferred",
						message: `${item.path}: ${String(error)}; original retained.`
					}]
				});
			}
		}
	}
	await disposeRecoveryArtifacts({
		selected,
		references,
		assertDestinations: assertSurvivor
	});
	for (const [archivePath] of replacements) {
		const refs = references.get(archivePath);
		if (refs.every((ref) => ref.move.artifact.disposal.state === "disposed")) assertSurvivor(refs);
		else {
			replacements.delete(archivePath);
			const item = selected.find((candidate) => candidate.path === archivePath);
			failures.push({
				target: refs[0].target,
				issues: [{
					code: "historical_transcript_deferred",
					message: `${archivePath}: ${item.detail ?? item.reason}; original retained.`
				}]
			});
		}
	}
	return [...failures, ...coalesceSessionSqliteArchiveReferences(replacements, [...new Set([...references.values()].flatMap((refs) => refs.map((ref) => ref.run)))])];
}
/** The CLI supplies source-only configuration again under authority before exact confirmation. */
async function retireSessionSqliteRecovery(params) {
	await assertOpenClawStateWriteAllowedAtPath({
		databasePath: path.join(params.preview.stateDir, "state", "openclaw.sqlite"),
		env: params.env,
		recoverOrphanedSidecars: false
	});
	return withDoctorSqliteMaintenanceLock({
		env: params.env,
		operation: "update recovery cleanup",
		run: async (authority) => {
			const { report, references, manifestPaths } = collectRecoveryInventory({
				cfg: await params.readConfig(),
				env: params.env
			});
			authority.assertCurrent();
			if (report.stateDir !== params.preview.stateDir || JSON.stringify(report.artifacts) !== JSON.stringify(params.preview.artifacts)) throw new Error("Recovery selection changed; preview cleanup again.");
			await assertOpenClawStateWriteAllowedAtPath({
				databasePath: path.join(report.stateDir, "state", "openclaw.sqlite"),
				env: params.env,
				recoverOrphanedSidecars: false
			});
			const adoptions = /* @__PURE__ */ new Map();
			const assertDestinations = createRecoveryDestinationVerifier(report.stateDir);
			for (const item of report.artifacts) {
				if (item.outcome === "verification-required") {
					const refs = references.get(item.path);
					try {
						for (const ref of refs) {
							if (ref.move.artifact) continue;
							const artifact = verifyHistoricalMigrationArtifact({
								target: ref.target,
								move: ref.move,
								env: params.env
							});
							if (!artifact) throw new Error("historical-import-proof-unavailable");
							adoptions.set(ref, artifact);
						}
						item.outcome = "candidate";
						item.reason = "verified-historical-import";
					} catch (error) {
						item.outcome = "protected";
						item.reason = "historical-import-proof-unavailable";
						item.detail = String(error);
					}
				}
				if (item.outcome !== "candidate") continue;
				try {
					const refs = references.get(item.path);
					const artifact = resolveRecoveryArtifact(refs) ?? adoptions.get(refs[0]);
					assertRecoveryOriginal(item.path, artifact);
				} catch (error) {
					item.outcome = "blocked";
					item.reason = "artifact-verification-failed";
					item.detail = String(error);
				}
			}
			for (const item of report.artifacts) {
				if (item.outcome !== "candidate") continue;
				try {
					assertDestinations(references.get(item.path));
				} catch (error) {
					item.outcome = "blocked";
					item.reason = "destination-verification-failed";
					item.detail = String(error);
				}
			}
			protectRecoveryDependencies(report.artifacts, references, adoptions);
			const verified = summarizeRecoveryCleanup(report.stateDir, report.artifacts, "preview");
			const selected = verified.artifacts.filter((item) => item.outcome === "candidate");
			if (!await params.confirm(verified)) return {
				...verified,
				status: "refused"
			};
			authority.assertCurrent();
			const rechecked = collectRecoveryInventory({
				cfg: await params.readConfig(),
				env: params.env
			});
			if (rechecked.report.stateDir !== report.stateDir || JSON.stringify(rechecked.manifestPaths) !== JSON.stringify(manifestPaths) || JSON.stringify(rechecked.report.artifacts) !== JSON.stringify(params.preview.artifacts)) throw new Error("Recovery selection changed during confirmation; preview again.");
			for (const refs of references.values()) for (const ref of refs) {
				if (JSON.stringify(readSessionSqliteMigrationManifest(ref.run.manifestPath)) !== JSON.stringify(ref.run.manifest)) throw new Error("Recovery manifest changed during confirmation; preview again.");
				if (!(rechecked.references.get(ref.move.archivePath) ?? []).some((current) => current.trusted === ref.trusted && current.target.storePath === ref.target.storePath && current.target.sqlitePath === ref.target.sqlitePath)) throw new Error("Recovery target changed during confirmation; preview again.");
			}
			await assertOpenClawStateWriteAllowedAtPath({
				databasePath: path.join(report.stateDir, "state", "openclaw.sqlite"),
				env: params.env,
				recoverOrphanedSidecars: false
			});
			authority.assertCurrent();
			for (const item of selected) {
				const refs = references.get(item.path);
				assertDestinations(refs);
				assertRecoveryOriginal(item.path, resolveRecoveryArtifact(refs) ?? adoptions.get(refs[0]));
			}
			for (const [ref, artifact] of adoptions) {
				if (!selected.some((item) => item.path === ref.move.archivePath)) continue;
				if (ref.run.manifest.manifestVersion !== 4) ref.run.manifest.manifestVersion = 3;
				for (const move of [...ref.target.plannedMoves, ...ref.target.completedMoves]) if (move.archivePath === ref.move.archivePath) move.artifact = artifact;
			}
			await disposeRecoveryArtifacts({
				selected,
				references,
				assertDestinations,
				assertCurrent: () => authority.assertCurrent()
			});
			return summarizeRecoveryCleanup(report.stateDir, report.artifacts, report.artifacts.some((item) => item.outcome === "failed" || item.outcome === "blocked") ? "blocked" : "complete");
		}
	});
}
async function disposeRecoveryArtifacts({ selected, references, assertDestinations, assertCurrent }) {
	const runs = /* @__PURE__ */ new Set();
	for (const item of selected) {
		const refs = references.get(item.path);
		const disposal = refs.map(({ move }) => move.artifact.disposal).find((receipt) => receipt.state === "pending-disposal") ?? {
			state: "pending-disposal",
			intendedAt: (/* @__PURE__ */ new Date()).toISOString(),
			phase: "intent",
			claimPath: path.join(path.dirname(item.path), `.cleanup-${randomUUID()}`)
		};
		for (const ref of refs) {
			for (const move of [...ref.target.plannedMoves, ...ref.target.completedMoves]) if (move.archivePath === item.path && move.artifact) move.artifact.disposal = disposal;
			runs.add(ref.run);
		}
	}
	for (const run of runs) writeSessionSqliteMigrationManifest(run);
	let activeItem;
	const claims = selected.map((item) => {
		const refs = references.get(item.path);
		const artifact = refs[0].move.artifact;
		const disposal = artifact.disposal;
		if (disposal.state !== "pending-disposal" || path.dirname(disposal.claimPath) !== path.dirname(item.path) || !path.basename(disposal.claimPath).startsWith(".cleanup-")) throw new Error("invalid disposal claim");
		return {
			item,
			refs,
			artifact,
			disposal,
			present: false
		};
	});
	try {
		for (const claim of claims) {
			const { item, refs, artifact, disposal } = claim;
			activeItem = item;
			assertCurrent?.();
			assertDestinations(refs);
			if (hasSymbolicLinkInDirectoryPath(path.dirname(item.path))) throw new Error("archive directory changed");
			if (statMigrationPath(item.path)) {
				if (disposal.phase === "unlink-pending") throw new Error("archive was recreated after claim");
				const identity = assertRecoveryOriginal(item.path, artifact);
				if (!identity) throw new Error("artifact is unexpectedly missing");
				await moveMigrationArtifact(item.path, disposal.claimPath, identity);
			}
			assertCurrent?.();
			assertDestinations(refs);
			assertRecoveryOriginal(item.path, artifact);
			claim.present = statMigrationPath(disposal.claimPath) !== void 0;
			disposal.phase = "unlink-pending";
		}
		for (const run of runs) writeSessionSqliteMigrationManifest(run);
		for (const { item, artifact, disposal, present } of claims) {
			activeItem = item;
			if (hasSymbolicLinkInDirectoryPath(path.dirname(item.path))) throw new Error("archive directory changed");
			if (statMigrationPath(item.path)) throw new Error("archive was recreated after claim");
			assertRecoveryOriginal(item.path, artifact);
			if (present !== (statMigrationPath(disposal.claimPath) !== void 0)) throw new Error("disposal claim changed after intent");
		}
		assertCurrent?.();
		for (const { item, refs } of claims) {
			activeItem = item;
			assertDestinations(refs);
		}
		for (const { item, artifact, disposal } of claims) {
			activeItem = item;
			const claim = statMigrationPath(disposal.claimPath);
			if (claim) {
				fs.unlinkSync(disposal.claimPath);
				item.removedBytes = artifact.identity.size;
			}
			item.outcome = claim ? "removed" : "disposed";
			item.bytes = claim ? artifact.identity.size : 0;
			item.reason = claim ? "rollback-original-retired" : "completed-interrupted-disposal";
		}
		const syncedDirectories = /* @__PURE__ */ new Set();
		for (const { item, refs } of claims) {
			activeItem = item;
			const directory = path.dirname(item.path);
			if (item.outcome === "removed" && !syncedDirectories.has(directory)) {
				requireDirectorySync(await syncDirectory(directory), "Recovery artifact removal");
				syncedDirectories.add(directory);
			}
			assertCurrent?.();
			assertDestinations(refs);
			for (const ref of refs) for (const move of [...ref.target.plannedMoves, ...ref.target.completedMoves]) if (move.archivePath === item.path && move.artifact) move.artifact.disposal = {
				state: "disposed",
				disposedAt: (/* @__PURE__ */ new Date()).toISOString()
			};
		}
		for (const run of runs) writeSessionSqliteMigrationManifest(run);
	} catch (error) {
		if (activeItem) {
			activeItem.outcome = "failed";
			activeItem.reason = "artifact-retirement-failed";
			activeItem.detail = String(error);
		}
		for (const item of selected) if (item.outcome === "candidate") {
			item.outcome = "blocked";
			item.reason = "retirement-stopped";
		}
	}
}
//#endregion
export { collectHistoricalArchiveSources as a, readLegacySessionRecords as c, appendLegacyHistoricalTranscripts as i, collectRecoveryInventory as l, settleDuplicateSessionSqliteArchives as n, gatherLegacyArchiveCoverage as o, validateLegacySessionRecords as r, listUnreferencedJsonlFiles as s, retireSessionSqliteRecovery as t, inspectSessionSqliteRecovery as u };
