import { a as writeRuntimeJson } from "./runtime-DlO3PTAd.mjs";
import { p as shortenHomePath } from "./utils-DgZn2dLu.mjs";
import { r as resolveStateDir } from "./state-dir-BHJORNly.mjs";
import { t as formatErrorMessage } from "./errors-O33D01XW.mjs";
import { c as resolveOpenClawStateSqlitePath } from "./openclaw-state-db.paths-DfifnSGp.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import { m as resolveConfiguredAgentId } from "./agent-scope-config-CDYpzA0r.mjs";
import "./session-key-C09ow4h0.mjs";
import { r as getRuntimeConfig } from "./io.runtime-CPntde4x.mjs";
import "./config-CzeZu5J_.mjs";
import { t as assertNotUpdateCapturePath } from "./update-capture-paths-BuDS3zdN.mjs";
import { o as recordBackupOutcomeBestEffort, s as resolveBackupAgentRoot, u as resolveRequiredBackupPath } from "./backup-shared-B6KMCCJW.mjs";
import { t as createLocalSqliteSnapshotProvider } from "./local-repository-B-IjFY66.mjs";
import path from "node:path";
import fs from "node:fs/promises";
//#region src/commands/backup-sqlite.ts
const OPENCLAW_SNAPSHOT_READ_OPTIONS = { allowedDatabaseRoles: ["global", "agent"] };
async function backupSqliteCreateCommand(runtime, options) {
	const repositoryPath = resolveRequiredBackupPath(options.repository, "--repository");
	try {
		const database = await resolveSnapshotDatabase(options);
		const result = await createLocalSqliteSnapshotProvider({ repositoryPath }).create(database);
		const report = {
			ok: true,
			snapshotPath: result.ref.path,
			manifest: result.manifest
		};
		await recordBackupOutcomeBestEffort(runtime, {
			kind: "sqlite-snapshot",
			archivePath: report.snapshotPath,
			status: "ok"
		});
		if (options.json) writeRuntimeJson(runtime, report);
		else runtime.log([
			`SQLite snapshot created: ${shortenHomePath(report.snapshotPath)}`,
			`Database: ${formatDatabaseIdentity(report.manifest.database)}`,
			`Size: ${report.manifest.artifact.sizeBytes} bytes`
		].join("\n"));
		return report;
	} catch (error) {
		await recordBackupOutcomeBestEffort(runtime, {
			kind: "sqlite-snapshot",
			archivePath: repositoryPath,
			status: "failed",
			error: formatErrorMessage(error)
		});
		throw error;
	}
}
async function backupSqliteListCommand(runtime, options) {
	const repositoryPath = resolveRequiredBackupPath(options.repository, "--repository");
	const snapshots = await createLocalSqliteSnapshotProvider({
		repositoryPath,
		...OPENCLAW_SNAPSHOT_READ_OPTIONS
	}).list();
	const report = {
		ok: true,
		repositoryPath,
		snapshots
	};
	if (options.json) writeRuntimeJson(runtime, report);
	else if (snapshots.length === 0) runtime.log(`No SQLite snapshots in ${shortenHomePath(repositoryPath)}.`);
	else runtime.log(snapshots.map((snapshot) => `${snapshot.manifest.createdAt}  ${formatDatabaseIdentity(snapshot.manifest.database)}  ${snapshot.manifest.artifact.sizeBytes} bytes  ${shortenHomePath(snapshot.ref.path)}`).join("\n"));
	return report;
}
async function backupSqliteVerifyCommand(runtime, snapshot, options) {
	const resolved = resolveSnapshot(snapshot, options.scratch);
	const verified = await resolved.provider.verify(resolved.ref);
	const report = {
		ok: true,
		snapshotPath: resolved.ref.path,
		manifest: verified.manifest
	};
	if (options.json) writeRuntimeJson(runtime, report);
	else runtime.log(`SQLite snapshot verified: ${shortenHomePath(report.snapshotPath)} (${formatDatabaseIdentity(report.manifest.database)})`);
	return report;
}
async function backupSqliteRestoreCommand(runtime, snapshot, options) {
	const resolved = resolveSnapshot(snapshot);
	const targetPath = resolveRequiredBackupPath(options.target, "--target");
	const restored = await resolved.provider.restoreFresh(resolved.ref, targetPath);
	const report = {
		ok: true,
		snapshotPath: resolved.ref.path,
		targetPath,
		manifest: restored.manifest
	};
	if (options.json) writeRuntimeJson(runtime, report);
	else runtime.log(`SQLite snapshot restored: ${shortenHomePath(report.targetPath)} (${formatDatabaseIdentity(report.manifest.database)})`);
	return report;
}
async function resolveSnapshotDatabase(options) {
	const rawAgentId = options.agent?.trim();
	if (options.agent !== void 0 && !rawAgentId) throw new Error("--agent must not be blank");
	if (options.global === true && rawAgentId) throw new Error("Choose exactly one SQLite snapshot source: --global or --agent <id>.");
	if (options.global !== true && !rawAgentId) throw new Error("Choose a SQLite snapshot source: --global or --agent <id>.");
	if (options.global === true) {
		const selectedPath = resolveOpenClawStateSqlitePath();
		assertNotUpdateCapturePath(selectedPath, resolveStateDir());
		return {
			path: await fs.realpath(selectedPath),
			identity: { role: "global" }
		};
	}
	const config = getRuntimeConfig({ skipPluginValidation: true });
	const agentId = resolveConfiguredAgentId(config, normalizeAgentId(rawAgentId));
	const agentRoot = await resolveBackupAgentRoot(config, agentId);
	assertNotUpdateCapturePath(agentRoot.databasePath, resolveStateDir());
	return {
		path: await fs.realpath(agentRoot.databasePath),
		identity: {
			role: "agent",
			agentId
		}
	};
}
function resolveSnapshot(snapshot, scratch) {
	const snapshotPath = resolveRequiredBackupPath(snapshot, "<snapshot>");
	const repositoryPath = path.dirname(snapshotPath);
	const validationRootPath = scratch ? resolveRequiredBackupPath(scratch, "--scratch") : path.dirname(repositoryPath);
	return {
		provider: createLocalSqliteSnapshotProvider({
			repositoryPath,
			validationRootPath,
			...OPENCLAW_SNAPSHOT_READ_OPTIONS
		}),
		ref: { path: snapshotPath }
	};
}
function formatDatabaseIdentity(database) {
	if (database.role === "global") return "global";
	if (database.role === "agent") return `agent:${database.agentId}`;
	return database.id;
}
//#endregion
export { backupSqliteCreateCommand, backupSqliteListCommand, backupSqliteRestoreCommand, backupSqliteVerifyCommand };
