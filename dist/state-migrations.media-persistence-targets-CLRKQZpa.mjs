import { n as sanitizeForLog } from "./ansi-BeFJ0Uu7.mjs";
import { t as hasErrnoCode } from "./errno-FR4CRyya.mjs";
import { r as isPathInside } from "./path-guards-CH7noY0Z.mjs";
import { r as resolveStateDir } from "./state-dir-BHJORNly.mjs";
import "./paths-DGIwWbpu.mjs";
import { t as formatCliCommand } from "./command-format-DwEdrDKL.mjs";
import { a as resolveSqliteDatabaseFilePaths } from "./sqlite-files-BEC3zbaw.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import "./session-key-C09ow4h0.mjs";
import { a as isPersistentOpenClawAgentDatabasePath, r as createOpenClawAgentDatabasePathMatcher } from "./openclaw-agent-db.paths-DVbbFaej.mjs";
import { s as isSessionArchiveArtifactName } from "./artifacts-BvSTVPj-.mjs";
import { b as resolveOpenClawAgentDatabaseDiscoveryPaths } from "./openclaw-state-db-D1jWDzK3.mjs";
import { r as readAgentDatabaseDeletionSnapshot } from "./agent-deletion-journal.read-Bkjt0nDs.mjs";
import { n as unregisterOpenClawAgentDatabase } from "./openclaw-agent-db-registry-BJf044De.mjs";
import { n as resolveAgentSessionDirsFromAgentsDirSync } from "./session-dirs-SATsXf4g.mjs";
import { t as createAgentDatabaseDeletionClassifier } from "./agent-deletion-discovery-BRLBtW0y.mjs";
import { n as isTransientSqliteBackupPath } from "./backup-volatile-filter-I3J38C_Z.mjs";
import fs from "node:fs";
import path from "node:path";
//#region src/infra/state-migrations.media-persistence-targets.ts
function prepareAgentDatabaseMigrationDiscovery(params) {
	const stateDir = resolveStateDir(params.env);
	const preparedJournal = params.preparedDiscovery?.stateDir === stateDir && params.preparedDiscovery.discovery.deletionJournal.status === "unavailable" ? params.preparedDiscovery.discovery.deletionJournal : params.deletionJournal;
	const snapshot = params.registeredAgentDatabases && preparedJournal ? void 0 : readAgentDatabaseDeletionSnapshot(params.env);
	const registeredAgentDatabases = params.registeredAgentDatabases ?? snapshot?.registeredAgentDatabases ?? [];
	const deletionJournal = preparedJournal ?? snapshot?.retainedDeletions ?? {
		status: "unavailable",
		cause: "missing",
		reason: "shared state database missing"
	};
	return {
		stateDir,
		configuredAgentDatabaseTargets: params.configuredAgentDatabaseTargets,
		registeredAgentDatabases,
		discovery: discoverAgentDatabaseMigrationTargets({
			...params,
			registeredAgentDatabases,
			deletionJournal
		}),
		...params.preparedDiscovery?.stateDir === stateDir ? { preparedTranscriptArchives: params.preparedDiscovery.preparedTranscriptArchives } : {}
	};
}
/** Discover maintenance targets without mutating the registry or creating stores. */
function discoverAgentDatabaseMigrationTargets(params) {
	const warnings = [];
	const externalWarnings = [];
	const deletionJournal = params.deletionJournal ?? readAgentDatabaseDeletionSnapshot(params.env)?.retainedDeletions ?? {
		status: "unavailable",
		cause: "missing",
		reason: "shared state database missing"
	};
	const knownDeletions = deletionJournal.status === "present" ? deletionJournal : deletionJournal.status === "unavailable" ? deletionJournal.known : void 0;
	const retainedDeletions = knownDeletions?.entries ?? [];
	const classifyDeletion = createAgentDatabaseDeletionClassifier({
		...params,
		retainedDeletions: deletionJournal
	});
	const failures = [];
	const registryRemovals = [];
	const sourceIdentities = /* @__PURE__ */ new Map();
	const failure = (pathname, reason) => {
		warnings.push(reason);
		failures.push({
			path: pathname,
			reason
		});
	};
	const discard = (candidate, change) => {
		if (candidate.source === "registry" && deletionJournal.status !== "unavailable" && classifyDeletion(candidate.path) !== "held") registryRemovals.push({
			agentId: candidate.agentId,
			path: candidate.path,
			change
		});
	};
	const candidates = [
		...params.configuredAgentDatabaseTargets.map((target) => ({
			...target,
			source: "configured"
		})),
		...params.registeredAgentDatabases.map((entry) => ({
			...entry,
			source: "registry"
		})),
		...retainedDeletions.flatMap((entry) => entry.databasePaths.map((pathname) => ({
			agentId: entry.agentId,
			path: pathname,
			source: "disk"
		}))),
		...(knownDeletions?.held ?? []).map((target) => ({
			agentId: target.agentId,
			path: target.path,
			source: "deletion"
		}))
	];
	const activeStateDir = resolveStateDir(params.env);
	const agentsDir = path.join(activeStateDir, "agents");
	try {
		for (const sessionsDir of resolveAgentSessionDirsFromAgentsDirSync(agentsDir)) {
			const agentDir = path.dirname(sessionsDir);
			const databaseDir = path.join(agentDir, "agent");
			const agentId = normalizeAgentId(path.basename(agentDir));
			for (const pathname of resolveOpenClawAgentDatabaseDiscoveryPaths({
				agentDir: databaseDir,
				agentId,
				env: params.env
			})) candidates.push({
				agentId,
				path: pathname,
				source: "disk"
			});
		}
	} catch (error) {
		failure(agentsDir, `Could not enumerate agent databases under ${agentsDir}: ${String(error)}`);
	}
	let activeStateDirRealPath;
	try {
		activeStateDirRealPath = fs.realpathSync.native(activeStateDir);
	} catch (error) {
		if (!hasErrnoCode(error, "ENOENT")) failure(activeStateDir, `Could not resolve active state directory ${activeStateDir}: ${String(error)}`);
	}
	const configuredPathMatcher = createOpenClawAgentDatabasePathMatcher();
	const targets = [];
	const retainedTargets = [];
	const unverifiedTargets = [];
	const seenTargets = /* @__PURE__ */ new Set();
	for (const candidate of candidates) {
		const pathname = candidate.path;
		if (isTransientSqliteBackupPath(pathname)) continue;
		if (!isPersistentOpenClawAgentDatabasePath(pathname, params.env)) {
			discard(candidate, `Removed archived or transient agent database registry entry ${pathname}.`);
			continue;
		}
		let realPath;
		try {
			realPath = fs.realpathSync.native(pathname);
		} catch (error) {
			if (!hasErrnoCode(error, "ENOENT")) failure(pathname, `Could not resolve agent database ${pathname}: ${String(error)}`);
		}
		sourceIdentities.set(pathname, { realPath });
		const deletion = classifyDeletion(pathname, candidate.agentId);
		const isConfiguredPath = realPath !== void 0 && params.configuredAgentDatabaseTargets.some((configuredTarget) => {
			if (normalizeAgentId(configuredTarget.agentId) !== normalizeAgentId(candidate.agentId)) return false;
			try {
				return configuredPathMatcher(pathname, configuredTarget.path);
			} catch {
				return false;
			}
		});
		const isInsideActiveStateDir = Boolean(realPath && activeStateDirRealPath && (realPath === activeStateDirRealPath || isPathInside(activeStateDirRealPath, realPath)));
		if (realPath && !isInsideActiveStateDir && !isConfiguredPath && !deletion) {
			discard(candidate);
			const warning = `Skipped foreign agent database ${sanitizeForLog(pathname)}; it is outside the active state directory and is not a configured session store.`;
			warnings.push(warning);
			externalWarnings.push(warning);
			continue;
		}
		let stat;
		try {
			stat = fs.statSync(pathname, { bigint: true });
		} catch (error) {
			if (!hasErrnoCode(error, "ENOENT")) {
				failure(pathname, `Could not inspect ${candidate.source === "registry" ? "registered " : ""}agent database ${pathname}: ${String(error)}`);
				continue;
			}
		}
		if (!stat?.isFile()) {
			if (deletionJournal.status === "unavailable") try {
				if (resolveSqliteDatabaseFilePaths(pathname).some((file) => fs.lstatSync(file, { throwIfNoEntry: false }))) failure(pathname, `Could not verify held database ${pathname}: SQLite family artifacts remain without a regular main database. Restore the matching main database before reconstructing deletion history.`);
			} catch (error) {
				failure(pathname, `Could not inspect held database family ${pathname}: ${String(error)}`);
			}
			discard(candidate, `Removed missing agent database registry entry ${pathname}.`);
			if (candidate.source === "registry") warnings.push(`Skipped missing registered agent database ${pathname}.`);
			continue;
		}
		if (!realPath) {
			discard(candidate);
			failure(pathname, `Skipped agent database ${pathname}; its filesystem boundary is unresolved.`);
			continue;
		}
		const targetIdentity = typeof deletion === "string" ? JSON.stringify([normalizeAgentId(candidate.agentId), pathname]) : `${stat.dev}:${stat.ino}`;
		if (seenTargets.has(targetIdentity)) continue;
		if (deletion) {
			if (classifyDeletion(pathname)) {
				seenTargets.add(targetIdentity);
				if (typeof deletion === "string") unverifiedTargets.push({
					...candidate,
					realPath
				});
				else retainedTargets.push({
					...candidate,
					agentId: deletion.agentId,
					realPath
				});
				warnings.push(`Held agent ${sanitizeForLog(typeof deletion === "string" ? candidate.agentId : deletion.agentId)} database ${sanitizeForLog(pathname)} (${typeof deletion === "string" ? deletion === "held" ? "deletion journal reconstructed" : "deletion journal unavailable" : "retained-by-deletion"}); run ${formatCliCommand("openclaw doctor --fix", params.env)} to inspect restoration.`);
			}
			continue;
		}
		seenTargets.add(targetIdentity);
		targets.push({
			...candidate,
			path: pathname,
			realPath
		});
	}
	if (unverifiedTargets.length > 0) warnings.push(`Agent deletion journal ${deletionJournal.status === "unavailable" ? "missing" : "reconstructed"}; ${unverifiedTargets.length} store${unverifiedTargets.length === 1 ? "" : "s"} held back. Run ${formatCliCommand("openclaw doctor --fix", params.env)} to record recovery, then restore or delete each held agent explicitly.`);
	return {
		targets,
		retainedTargets,
		unverifiedTargets,
		deletionJournal,
		registryRemovals,
		warnings,
		externalWarnings,
		failures,
		sourceIdentities
	};
}
/** Held-only inventories need no writer lease; their advisory must survive unavailable admission. */
function agentDatabaseMigrationAdvisory(discovery) {
	if (discovery.deletionJournal.status !== "unavailable" && (discovery.targets.length > 0 || discovery.registryRemovals.length > 0 || discovery.failures.length > 0)) return;
	return {
		changes: [],
		warnings: discovery.warnings,
		warningDisposition: "recoverable"
	};
}
/** Migration alone owns cleanup of stale registry entries discovered above. */
function resolveAgentDatabaseMigrationTargets(params) {
	const snapshot = readAgentDatabaseDeletionSnapshot(params.env);
	const deletionJournal = params.preparedDiscovery?.stateDir === resolveStateDir(params.env) && params.preparedDiscovery.discovery.deletionJournal.status === "unavailable" ? params.preparedDiscovery.discovery.deletionJournal : snapshot?.retainedDeletions ?? {
		status: "unavailable",
		cause: "missing",
		reason: "shared state database missing"
	};
	const discovery = discoverAgentDatabaseMigrationTargets({
		...params,
		registeredAgentDatabases: snapshot?.registeredAgentDatabases ?? [],
		deletionJournal
	});
	for (const removed of discovery.registryRemovals) {
		unregisterOpenClawAgentDatabase({
			...removed,
			env: params.env
		});
		if (removed.change) params.changes.push(removed.change);
	}
	params.warnings.push(...discovery.warnings);
	return {
		targets: discovery.targets,
		recoverableWarningCount: discovery.failures.length > 0 ? 0 : discovery.warnings.length
	};
}
function listTranscriptArchives(directory) {
	let entries;
	try {
		entries = fs.readdirSync(directory, { withFileTypes: true });
	} catch (error) {
		if (hasErrnoCode(error, "ENOENT")) return [];
		throw error;
	}
	return entries.filter((entry) => entry.isFile() && entry.name.includes(".jsonl.") && isSessionArchiveArtifactName(entry.name)).map((entry) => path.join(directory, entry.name));
}
//#endregion
export { resolveAgentDatabaseMigrationTargets as a, prepareAgentDatabaseMigrationDiscovery as i, discoverAgentDatabaseMigrationTargets as n, listTranscriptArchives as r, agentDatabaseMigrationAdvisory as t };
