import { o as safeRealpathSync$1 } from "./boundary-path-CAv_plX7.mjs";
import { p as shortenHomePath } from "./utils-DgZn2dLu.mjs";
import { t as formatErrorMessage } from "./errors-O33D01XW.mjs";
import { i as findGitRoot } from "./git-commit-eT_9FBYG.mjs";
import { d as resolveAgentWorkspaceDir } from "./agent-scope-config-CDYpzA0r.mjs";
import { o as tryResolveDefaultAgentId } from "./agent-roster-BXD1uMJD.mjs";
import "./agent-scope-CG17uXFn.mjs";
import { a as resolveCanonicalRootMemoryPath, n as LEGACY_ROOT_MEMORY_FILENAME, o as resolveLegacyRootMemoryPath, s as resolveRootMemoryRepairDir, t as CANONICAL_ROOT_MEMORY_FILENAME } from "./root-memory-files-BUq0D-EI.mjs";
import { t as DEFAULT_AGENTS_FILENAME } from "./workspace-bootstrap-policy-CPdXB_so.mjs";
import "./workspace-C0xiByg0.mjs";
import { t as note } from "./note-Byxgt4MB.mjs";
import fs from "node:fs";
import path from "node:path";
import { readRegularFile } from "@openclaw/fs-safe/advanced";
import { safeStatSync } from "@openclaw/fs-safe/path";
import { isUtf8 } from "node:buffer";
//#region src/commands/doctor-workspace.ts
/** Doctor checks and repairs for workspace memory files and legacy workspace hints. */
const AGENTS_MD_MAX_BYTES = 1048576;
const ROOT_MEMORY_FILE_MAX_BYTES = 8388608;
const MEMORY_SYSTEM_PROMPT = [
	"Memory system not found in workspace.",
	"Paste this into your agent:",
	"",
	"Install the memory system by applying:",
	"https://github.com/openclaw/openclaw/commit/9ffea23f31ca1df5183b25668f8f814bee0fb34e",
	"https://github.com/openclaw/openclaw/commit/7d1fee70e76f2f634f1b41fca927ee663914183a"
].join("\n");
/** Returns the workspace git-backup tip when the workspace exists but is not a git repo. */
function collectWorkspaceBackupTip(workspaceDir) {
	if (!safeStatSync(workspaceDir)?.isDirectory()) return null;
	const resolvedWorkspaceDir = safeRealpathSync$1(workspaceDir);
	if (!resolvedWorkspaceDir || findGitRoot(resolvedWorkspaceDir)) return null;
	return "- Tip: back up the agent workspace in a private git repo; keep ~/.openclaw out of git (credentials, sessions). Details: /concepts/agent-workspace#git-backup-recommended-private";
}
async function shouldSuggestMemorySystem(workspaceDir) {
	if ((await listWorkspaceEntries(workspaceDir)).has("MEMORY.md")) try {
		if ((await fs.promises.stat(resolveCanonicalRootMemoryPath(workspaceDir))).isFile()) return false;
	} catch {}
	const agentsPath = path.join(workspaceDir, DEFAULT_AGENTS_FILENAME);
	try {
		const resolvedAgentsPath = await fs.promises.realpath(agentsPath);
		const { buffer } = await readRegularFile({
			filePath: resolvedAgentsPath,
			maxBytes: AGENTS_MD_MAX_BYTES
		});
		if (new RegExp(`\\b${"MEMORY.md".replace(".", "\\.")}\\b`).test(buffer.toString("utf-8"))) return false;
	} catch {}
	return true;
}
async function statIfExists(filePath) {
	try {
		const stat = await fs.promises.stat(filePath);
		if (!stat.isFile()) return { exists: false };
		return {
			exists: true,
			bytes: stat.size
		};
	} catch (err) {
		if (err?.code === "ENOENT") return { exists: false };
		throw err;
	}
}
async function listWorkspaceEntries(workspaceDir) {
	try {
		return new Set(await fs.promises.readdir(workspaceDir));
	} catch (err) {
		if (err?.code === "ENOENT") return /* @__PURE__ */ new Set();
		throw err;
	}
}
async function detectRootMemoryFiles(workspaceDir) {
	const resolvedWorkspace = path.resolve(workspaceDir);
	const canonicalPath = resolveCanonicalRootMemoryPath(resolvedWorkspace);
	const legacyPath = resolveLegacyRootMemoryPath(resolvedWorkspace);
	const entries = await listWorkspaceEntries(resolvedWorkspace);
	const [canonical, legacy] = await Promise.all([entries.has("MEMORY.md") ? statIfExists(canonicalPath) : Promise.resolve({ exists: false }), entries.has("memory.md") ? statIfExists(legacyPath) : Promise.resolve({ exists: false })]);
	return {
		workspaceDir: resolvedWorkspace,
		canonicalPath,
		legacyPath,
		canonicalExists: canonical.exists,
		legacyExists: legacy.exists,
		...typeof canonical.bytes === "number" ? { canonicalBytes: canonical.bytes } : {},
		...typeof legacy.bytes === "number" ? { legacyBytes: legacy.bytes } : {}
	};
}
function formatBytes(bytes) {
	return typeof bytes === "number" ? `${bytes} bytes` : "size unknown";
}
function formatRootMemoryFilesWarning(detection) {
	if (detection.canonicalExists && detection.legacyExists) return [
		"Split root durable memory files detected:",
		`- canonical: ${shortenHomePath(detection.canonicalPath)} (${formatBytes(detection.canonicalBytes)})`,
		`- legacy: ${shortenHomePath(detection.legacyPath)} (${formatBytes(detection.legacyBytes)})`,
		`OpenClaw uses ${CANONICAL_ROOT_MEMORY_FILENAME} as the canonical durable memory file.`,
		`Dreaming writes durable promotions to ${CANONICAL_ROOT_MEMORY_FILENAME}, so older facts in ${LEGACY_ROOT_MEMORY_FILENAME} can be shadowed.`,
		`Run "openclaw doctor --fix" to merge the legacy file into ${CANONICAL_ROOT_MEMORY_FILENAME} with a backup.`
	].join("\n");
	return null;
}
async function moveLegacyRootMemoryFileToArchive(params) {
	const repairDir = resolveRootMemoryRepairDir(params.workspaceDir);
	await fs.promises.mkdir(repairDir, { recursive: true });
	const archiveDir = path.join(repairDir, (/* @__PURE__ */ new Date()).toISOString().replaceAll(":", "-").replaceAll(".", "-"));
	await fs.promises.mkdir(archiveDir, { recursive: true });
	const archivePath = path.join(archiveDir, LEGACY_ROOT_MEMORY_FILENAME);
	await fs.promises.rename(params.legacyPath, archivePath);
	return archivePath;
}
function buildMergedLegacyRootMemorySection(params) {
	return [
		"",
		`## Imported From Legacy Root ${LEGACY_ROOT_MEMORY_FILENAME}`,
		"",
		`<!-- openclaw-root-memory-merge source=${LEGACY_ROOT_MEMORY_FILENAME} archived=${params.archivedLegacyPath} -->`,
		`This content came from legacy root \`${LEGACY_ROOT_MEMORY_FILENAME}\`, which was shadowed by \`${CANONICAL_ROOT_MEMORY_FILENAME}\`.`,
		"",
		params.legacyText.trim(),
		""
	].join("\n");
}
/** Archives and merges a legacy root memory file into canonical memory. */
async function migrateLegacyRootMemoryFile(workspaceDir) {
	const detection = await detectRootMemoryFiles(workspaceDir);
	const unchanged = {
		changed: false,
		canonicalPath: detection.canonicalPath,
		legacyPath: detection.legacyPath,
		mergedLegacy: false
	};
	if (!detection.canonicalExists || !detection.legacyExists) return unchanged;
	const skippedForReadFailure = (err) => {
		const message = err instanceof Error ? err.message : "";
		return {
			...unchanged,
			skipReason: message.startsWith("File exceeds") ? "a file exceeded the safe read limit" : message.startsWith("File is not valid UTF-8:") ? message : "a file could not be read"
		};
	};
	const readMemoryFile = async (filePath) => {
		const { buffer } = await readRegularFile({
			filePath,
			maxBytes: ROOT_MEMORY_FILE_MAX_BYTES
		});
		if (!isUtf8(buffer)) throw new Error(`File is not valid UTF-8: ${filePath}; preserve its bytes and convert a copy to UTF-8 before retrying`);
		return buffer.toString("utf-8");
	};
	try {
		await Promise.all([readMemoryFile(detection.canonicalPath), readMemoryFile(detection.legacyPath)]);
	} catch (err) {
		return skippedForReadFailure(err);
	}
	let archivedLegacyPath;
	try {
		archivedLegacyPath = await moveLegacyRootMemoryFileToArchive({
			workspaceDir: detection.workspaceDir,
			legacyPath: detection.legacyPath
		});
	} catch {
		return {
			...unchanged,
			skipReason: "legacy memory could not be archived atomically"
		};
	}
	let canonicalText;
	let legacyText;
	try {
		[canonicalText, legacyText] = await Promise.all([readMemoryFile(detection.canonicalPath), readMemoryFile(archivedLegacyPath)]);
	} catch (err) {
		return {
			...skippedForReadFailure(err),
			changed: true,
			archivedLegacyPath
		};
	}
	if (canonicalText !== legacyText) {
		const merged = `${canonicalText.trimEnd()}\n${buildMergedLegacyRootMemorySection({
			legacyText,
			archivedLegacyPath: shortenHomePath(archivedLegacyPath)
		})}`;
		await fs.promises.writeFile(detection.canonicalPath, merged, "utf-8");
	}
	return {
		changed: true,
		canonicalPath: detection.canonicalPath,
		legacyPath: detection.legacyPath,
		mergedLegacy: canonicalText !== legacyText,
		archivedLegacyPath
	};
}
async function noteWorkspaceMemoryHealth(cfg, scope) {
	try {
		const agentId = scope?.agentId ?? tryResolveDefaultAgentId(cfg);
		if (!agentId) throw new Error("Cannot inspect workspace memory until the agent roster has one default");
		const rootMemoryWarning = formatRootMemoryFilesWarning(await detectRootMemoryFiles(scope?.workspaceDir ?? resolveAgentWorkspaceDir(cfg, agentId)));
		if (rootMemoryWarning) note(`${scope?.labelAgent ? `Agent "${agentId}":\n` : ""}${rootMemoryWarning}`, "Workspace memory");
	} catch (err) {
		const prefix = scope?.labelAgent ? `Agent "${scope.agentId}": ` : "";
		note(`${prefix}Workspace memory audit could not be completed: ${formatErrorMessage(err)}`, "Doctor");
	}
}
/** Prompts to merge legacy root memory into canonical memory when both files exist. */
async function maybeRepairWorkspaceMemoryHealth(params) {
	try {
		const agentId = params.scope?.agentId ?? tryResolveDefaultAgentId(params.cfg);
		if (!agentId) throw new Error("Cannot repair workspace memory until the agent roster has one default");
		const configuredWorkspaceDir = params.scope?.workspaceDir ?? resolveAgentWorkspaceDir(params.cfg, agentId);
		const prefix = params.scope?.labelAgent ? `Agent "${agentId}": ` : "";
		const rootMemoryFiles = await detectRootMemoryFiles(configuredWorkspaceDir);
		if (!rootMemoryFiles.canonicalExists || !rootMemoryFiles.legacyExists) return;
		if (!await params.prompter.confirmRuntimeRepair({
			message: `${prefix}Merge legacy root memory.md into canonical MEMORY.md and remove the shadowed file?`,
			initialValue: true
		})) return;
		const migration = await migrateLegacyRootMemoryFile(configuredWorkspaceDir);
		const reason = migration.skipReason;
		if (reason) {
			note([
				`${prefix}Workspace memory root repair skipped (${reason}):`,
				`- canonical: ${migration.canonicalPath}`,
				`- legacy: ${migration.legacyPath}`,
				migration.archivedLegacyPath ? `- preserved archive: ${migration.archivedLegacyPath}` : null
			].filter((line) => Boolean(line)).join("\n"), "Doctor changes");
			return;
		}
		if (!migration.changed) return;
		const lines = [
			`${prefix}Workspace memory root merged:`,
			`- canonical: ${migration.canonicalPath}`,
			migration.archivedLegacyPath ? `- backup: ${migration.archivedLegacyPath}` : null,
			migration.mergedLegacy ? `- merged legacy content from: ${migration.legacyPath}` : null,
			`- removed legacy file: ${migration.legacyPath}`
		].filter(Boolean);
		note(lines.join("\n"), "Doctor changes");
	} catch (err) {
		const prefix = params.scope?.labelAgent ? `Agent "${params.scope.agentId}": ` : "";
		note(`${prefix}Workspace memory repair could not be completed: ${formatErrorMessage(err)}`, "Doctor");
	}
}
//#endregion
export { shouldSuggestMemorySystem as a, noteWorkspaceMemoryHealth as i, collectWorkspaceBackupTip as n, maybeRepairWorkspaceMemoryHealth as r, MEMORY_SYSTEM_PROMPT as t };
