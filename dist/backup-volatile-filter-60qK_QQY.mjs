import { t as hasErrnoCode } from "./errno-FR4CRyya.mjs";
import fs from "node:fs/promises";
import path from "node:path";
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
const VOLATILE_DIRECTORY_RULES = [
	[[
		"sandbox/skills-workspaces",
		"cache/control-ui-assets",
		"tmp/plugin-captures"
	], void 0],
	[[
		"sessions",
		"cron/runs",
		"logs"
	], [".jsonl", ".log"]],
	[["delivery-queue", "session-delivery-queue"], [
		".json",
		".delivered",
		".tmp"
	]]
];
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
function relativePathParts(filePosix, root) {
	return isUnder(filePosix, root) ? path.posix.relative(root, filePosix).split("/").filter(Boolean) : [];
}
function isVolatileBackupPath(absolutePath, plan) {
	if (!absolutePath) return false;
	const filePosix = normalizePosix(absolutePath);
	for (const stateDir of plan.stateDirs) {
		if (!stateDir) continue;
		const stateDirPosix = normalizePosix(stateDir);
		if (isUnder(filePosix, stateDirPosix) && isLegacyAuditMigrationBackupPath(filePosix, stateDirPosix)) return true;
		const browserParts = relativePathParts(filePosix, path.posix.join(stateDirPosix, "browser"));
		if (browserParts.length === 3 && browserParts[1] === "user-data" && CHROMIUM_SINGLETON_FILES.has(browserParts[2] ?? "")) return true;
		for (const [directories, extensions] of VOLATILE_DIRECTORY_RULES) if ((!extensions || hasExtension(filePosix, extensions)) && directories.some((directory) => isUnder(filePosix, path.posix.join(stateDirPosix, directory)))) return true;
		if (hasExtension(filePosix, [".jsonl", ".log"])) {
			const agentParts = relativePathParts(filePosix, path.posix.join(stateDirPosix, "agents"));
			if (agentParts.length >= 3 && agentParts[1] === "sessions") return true;
		}
		if (isUnder(filePosix, stateDirPosix) && isTransientBackupPath(filePosix)) return true;
	}
	return false;
}
//#endregion
export { isLegacyAuditMigrationBackupPath as a, hasLegacyAuditBackupSources as i, isTransientSqliteBackupPath as n, isVolatileBackupPath as r, isTransientBackupPath as t };
