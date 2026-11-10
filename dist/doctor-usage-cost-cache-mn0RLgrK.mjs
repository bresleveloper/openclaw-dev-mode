import { t as hasErrnoCode } from "./errno-FR4CRyya.mjs";
import { p as shortenHomePath } from "./utils-gjJ-tD2q.mjs";
import { r as resolveStateDir } from "./state-dir-C8s3cOPX.mjs";
import "./paths-orClZ-2Z.mjs";
import { t as formatErrorMessage } from "./errors-DPfGDWk1.mjs";
import { s as listOpenClawRegisteredAgentDatabases } from "./openclaw-agent-db-registry-listing-DCh0nEqi.mjs";
import "./openclaw-agent-db-_fC-kf1x.mjs";
import { t as note } from "./note-CmoIRLec.mjs";
import { n as deleteSessionCostUsageRollupsExcept, t as openUsageCostRefreshFailures } from "./session-cost-usage-refresh-health-i-ZqKyXu.mjs";
import { i as maybeScrubConfigAuditLog } from "./doctor-config-audit-scrub-BaCgf55_.mjs";
import { n as runDoctorAgentDatabaseOperationAsync } from "./doctor-agent-database-operation--LF6LcEu.mjs";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
//#region src/commands/doctor-usage-cost-cache.ts
const LEGACY_USAGE_COST_TEMP_GRACE_MS = 1e4;
const LEGACY_USAGE_COST_TEMP_PATTERNS = [
	/^\.usage-cost-cache\.\d+\.[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.tmp$/u,
	/^\.usage-cost-cache(?:\.json)?\.\d+\.tmp$/u,
	/^\.usage-cost-cache\.json\.lock\.\d+(?:\.\d+)?\.tmp$/u
];
async function readFilesystemEntryOrMissing(filePath, read) {
	try {
		return await read();
	} catch (error) {
		if (hasErrnoCode(error, "ENOENT")) return null;
		throw new Error(`${shortenHomePath(filePath)}: ${formatErrorMessage(error)}`, { cause: error });
	}
}
async function detectLegacyUsageCostCacheFiles(env = process.env) {
	const stateDir = resolveStateDir(env, os.homedir);
	const sessionDirs = [path.join(stateDir, "sessions")];
	const agentsDir = path.join(stateDir, "agents");
	const agentEntries = await readFilesystemEntryOrMissing(agentsDir, () => fs.readdir(agentsDir, { withFileTypes: true })) ?? [];
	for (const entry of agentEntries) if (entry.isDirectory()) sessionDirs.push(path.join(agentsDir, entry.name, "sessions"));
	const files = [];
	for (const sessionDir of sessionDirs) {
		const entries = await readFilesystemEntryOrMissing(sessionDir, () => fs.readdir(sessionDir, { withFileTypes: true })) ?? [];
		for (const entry of entries) {
			if (!entry.isFile()) continue;
			const filePath = path.join(sessionDir, entry.name);
			if (entry.name === ".usage-cost-cache.json" || entry.name === ".usage-cost-cache.json.lock") {
				files.push(filePath);
				continue;
			}
			if (LEGACY_USAGE_COST_TEMP_PATTERNS.some((pattern) => pattern.test(entry.name))) {
				const stats = await readFilesystemEntryOrMissing(filePath, () => fs.stat(filePath));
				if (stats && Date.now() - stats.mtimeMs >= LEGACY_USAGE_COST_TEMP_GRACE_MS) files.push(filePath);
			}
		}
	}
	return files.toSorted();
}
async function maybeRemoveLegacyUsageCostCacheFiles(params) {
	const files = await detectLegacyUsageCostCacheFiles(params.env).catch((error) => {
		const command = params.shouldRepair ? "openclaw doctor --fix" : "openclaw doctor";
		const action = params.shouldRepair ? "scan and cleanup" : "scan";
		note([
			`Legacy usage-cost cache ${action} could not be completed; ${params.shouldRepair ? "no sidecar files were removed" : "cache state may remain uninspected"}.`,
			`- ${formatErrorMessage(error)}`,
			`Resolve the filesystem error and rerun \`${command}\`.`
		].join("\n"), "Usage cost cache");
		return null;
	});
	if (!files?.length) return;
	if (!params.shouldRepair) {
		note(`${files.length} rebuildable usage-cost cache ${files.length === 1 ? "file remains" : "files remain"}. Run \`openclaw doctor --fix\` to remove ${files.length === 1 ? "it" : "them"}.`, "Usage cost cache");
		return;
	}
	const failures = [];
	for (const filePath of files) await fs.rm(filePath, { force: true }).catch((error) => {
		failures.push(`${filePath}: ${String(error)}`);
	});
	if (failures.length > 0) {
		note(`Failed removing legacy usage-cost cache files:\n${failures.join("\n")}`, "Usage cost cache");
		return;
	}
	note(`Removed ${files.length} rebuildable legacy usage-cost cache ${files.length === 1 ? "file" : "files"}; SQLite rebuilds the cache on demand.`, "Usage cost cache");
}
async function maybeRemoveLegacySkillUploadTree(params) {
	const stateDir = resolveStateDir(params.env ?? process.env, os.homedir);
	const uploadRoot = path.join(stateDir, "tmp", "skill-uploads");
	if (!await fs.lstat(uploadRoot).catch(() => null)) return;
	if (!params.shouldRepair) {
		note("Legacy skill-upload staging remains. Run `openclaw doctor --fix` to discard it; active uploads now live in SQLite and must be retried.", "Skill uploads");
		return;
	}
	try {
		await fs.rm(uploadRoot, {
			recursive: true,
			force: true
		});
	} catch (error) {
		note(`Failed removing legacy skill-upload staging: ${String(error)}`, "Skill uploads");
		return;
	}
	note("Removed legacy skill-upload staging; unfinished transient uploads must be retried.", "Skill uploads");
}
async function maybeRemoveObsoleteControlUiAssetCache(params) {
	const cacheRoot = path.join(resolveStateDir(params.env ?? process.env, os.homedir), "cache", "control-ui-assets");
	try {
		await fs.lstat(cacheRoot);
		if (!params.shouldRepair) {
			note(`Obsolete Control UI asset cache remains at ${shortenHomePath(cacheRoot)}. Run \`openclaw doctor --fix\` to remove it.`, "Control UI assets");
			return [];
		}
		await fs.rm(cacheRoot, {
			recursive: true,
			force: true
		});
		note(`Removed obsolete Control UI asset cache at ${shortenHomePath(cacheRoot)}.`, "Control UI assets");
	} catch (error) {
		if (!hasErrnoCode(error, "ENOENT")) {
			const warning = `Could not ${params.shouldRepair ? "remove" : "inspect"} obsolete Control UI asset cache at ${shortenHomePath(cacheRoot)}: ${formatErrorMessage(error)}. Resolve the filesystem error and rerun \`openclaw doctor --fix\`.`;
			note(warning, "Doctor warnings");
			return [warning];
		}
	}
	return [];
}
async function maybeRepairLegacyRuntimeFiles(shouldRepair, env) {
	const failures = await openUsageCostRefreshFailures(env).entries().catch((error) => {
		note(`Could not read usage refresh failure history: ${formatErrorMessage(error)}`, "Usage cost cache");
		return [];
	});
	if (failures.length > 0) note(failures.map(({ value }) => `- ${value.agentId}: ${value.sessionFile}: ${value.reason}`).join("\n"), "Usage cost cache");
	await maybeScrubConfigAuditLog({
		shouldRepair,
		env
	});
	await maybeRemoveLegacyUsageCostCacheFiles({
		shouldRepair,
		env
	});
	if (shouldRepair) {
		for (const entry of listOpenClawRegisteredAgentDatabases({ env })) if ((await fs.stat(entry.path).catch(() => null))?.isFile()) await runDoctorAgentDatabaseOperationAsync({
			agentId: entry.agentId,
			path: entry.path,
			run: () => deleteSessionCostUsageRollupsExcept({
				agentId: entry.agentId,
				env,
				databasePath: entry.path,
				liveKeys: /* @__PURE__ */ new Set(),
				rows: []
			})
		});
	}
	await maybeRemoveLegacySkillUploadTree({
		shouldRepair,
		env
	});
	return await maybeRemoveObsoleteControlUiAssetCache({
		shouldRepair,
		env
	});
}
//#endregion
export { maybeRepairLegacyRuntimeFiles };
