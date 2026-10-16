import { t as hasErrnoCode } from "./errno-FR4CRyya.mjs";
import path from "node:path";
import fs from "node:fs/promises";
//#region src/infra/backup-audit-paths.ts
const LEGACY_AUDIT_PATHS = [
	{
		directory: "logs",
		basename: "config-audit.jsonl"
	},
	{
		directory: "audit",
		basename: "system-agent.jsonl"
	},
	{
		directory: "audit",
		basename: "crestodian.jsonl"
	}
].map(({ directory, basename }) => {
	const escaped = basename.replace(/[.*+?^${}()|[\]\\]/gu, "\\$&");
	return {
		directory,
		pattern: new RegExp(`^(?:${escaped}|\\.${escaped}\\.doctor-importing(?:\\.(?:[2-9]|[1-9][0-9]+))?|${escaped}\\.migrated(?:\\.(?:[2-9]|[1-9][0-9]+))?\\.raw(?:\\.doctor-scrub-(?:progress|restore|staging))?)$`, "u")
	};
});
/** Raw audit artifacts inherit their export exclusion after quarantine. */
function isLegacyAuditMigrationBackupPath(sourcePath, stateDir) {
	const relativePath = path.relative(path.resolve(stateDir), path.resolve(sourcePath));
	if (!relativePath || relativePath.startsWith(`..${path.sep}`) || path.isAbsolute(relativePath)) return false;
	const directory = path.dirname(relativePath);
	const basename = path.basename(relativePath);
	const quarantineIndex = basename.indexOf(".quarantined-");
	const originalBasename = quarantineIndex < 0 ? basename : basename.slice(0, quarantineIndex);
	return LEGACY_AUDIT_PATHS.some((logical) => directory === logical.directory && logical.pattern.test(originalBasename));
}
async function hasLegacyAuditBackupSources(stateDir) {
	for (const { directory } of LEGACY_AUDIT_PATHS) {
		let entries;
		const directoryPath = path.join(stateDir, directory);
		try {
			entries = await fs.readdir(directoryPath);
		} catch (error) {
			if (hasErrnoCode(error, "ENOENT")) continue;
			throw error;
		}
		if (entries.some((entry) => isLegacyAuditMigrationBackupPath(path.join(directoryPath, entry), stateDir))) return true;
	}
	return false;
}
//#endregion
//#region src/infra/backup-volatile-filter.ts
const CHROMIUM_SINGLETON_FILES = /* @__PURE__ */ new Set([
	"SingletonCookie",
	"SingletonLock",
	"SingletonSocket"
]);
const SQLITE_MEMORY_TRANSIENT_PATH_PATTERN = /(?:^|\/)(?:[^/]+\.sqlite\.(?:generation-(?:lock|writer)|reindex-lock)\.sqlite|[^/]+\.sqlite\.(?:backup|memory-reindex|tmp)-[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})(?:-wal|-shm|-journal)?$/iu;
function normalizePosix(input) {
	if (!input) return input;
	return path.posix.normalize(input.replaceAll("\\", "/"));
}
function isUnder(childPosix, parentPosix) {
	if (!parentPosix) return false;
	const p = parentPosix.endsWith("/") ? parentPosix : `${parentPosix}/`;
	return childPosix === parentPosix || childPosix.startsWith(p);
}
function hasExtension(filePosix, extensions) {
	const ext = path.posix.extname(filePosix).toLowerCase();
	return extensions.includes(ext);
}
/** Transient names apply to every selected backup root, not just OpenClaw state. */
function isTransientBackupPath(filePath) {
	return /.+\.(?:sock$|pid$|tmp(?:\.|$))/iu.test(path.posix.basename(normalizePosix(filePath)));
}
function isTransientSqliteBackupPath(filePath) {
	const normalizedPath = normalizePosix(filePath);
	return SQLITE_MEMORY_TRANSIENT_PATH_PATTERN.test(normalizedPath);
}
function isAgentSessionTranscriptPath(filePosix, stateDirPosix) {
	const agentsRoot = path.posix.join(stateDirPosix, "agents");
	if (!isUnder(filePosix, agentsRoot)) return false;
	const parts = path.posix.relative(agentsRoot, filePosix).split("/").filter(Boolean);
	return parts.length >= 3 && parts[1] === "sessions";
}
function isManagedBrowserSingletonPath(filePosix, stateDirPosix) {
	const browserRoot = path.posix.join(stateDirPosix, "browser");
	if (!isUnder(filePosix, browserRoot)) return false;
	const parts = path.posix.relative(browserRoot, filePosix).split("/").filter(Boolean);
	return parts.length === 3 && parts[1] === "user-data" && CHROMIUM_SINGLETON_FILES.has(parts[2] ?? "");
}
function filePathCandidates(input) {
	const normalized = normalizePosix(input);
	if (normalized.startsWith("/") || /^[A-Za-z]:\//u.test(normalized)) return [normalized];
	return [normalized, normalizePosix(`/${normalized}`)];
}
function isVolatileBackupPath(absolutePath, plan) {
	if (!absolutePath) return false;
	const candidates = filePathCandidates(absolutePath);
	for (const stateDir of plan.stateDirs) {
		if (!stateDir) continue;
		const stateDirPosix = normalizePosix(stateDir);
		for (const filePosix of candidates) {
			if (isUnder(filePosix, stateDirPosix) && isLegacyAuditMigrationBackupPath(filePosix, stateDirPosix)) return true;
			if (isManagedBrowserSingletonPath(filePosix, stateDirPosix)) return true;
			for (const parts of [
				["sandbox", "skills-workspaces"],
				["cache", "control-ui-assets"],
				["tmp", "plugin-captures"]
			]) if (isUnder(filePosix, path.posix.join(stateDirPosix, ...parts))) return true;
			if (hasExtension(filePosix, [".jsonl", ".log"]) && (isAgentSessionTranscriptPath(filePosix, stateDirPosix) || [
				["sessions"],
				["cron", "runs"],
				["logs"]
			].some((parts) => isUnder(filePosix, path.posix.join(stateDirPosix, ...parts))))) return true;
			for (const queueDir of ["delivery-queue", "session-delivery-queue"]) if (isUnder(filePosix, path.posix.join(stateDirPosix, queueDir)) && hasExtension(filePosix, [
				".json",
				".delivered",
				".tmp"
			])) return true;
			if (isUnder(filePosix, stateDirPosix) && isTransientBackupPath(filePosix)) return true;
		}
	}
	return false;
}
//#endregion
export { isLegacyAuditMigrationBackupPath as a, hasLegacyAuditBackupSources as i, isTransientSqliteBackupPath as n, isVolatileBackupPath as r, isTransientBackupPath as t };
