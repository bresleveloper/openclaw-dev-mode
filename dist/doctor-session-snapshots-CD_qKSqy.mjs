import { r as resolveOpenClawPackageRootSync } from "./openclaw-root-CBoxhfke.mjs";
import { r as resolveOsHomeDir } from "./home-dir-D0b-ywue.mjs";
import { t as expandHomePrefix } from "./home-dir-Dc6nN6HB.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { _ as resolveConfigDir, p as shortenHomePath } from "./utils-DgZn2dLu.mjs";
import { r as resolveStateDir } from "./state-dir-BHJORNly.mjs";
import "./paths-DGIwWbpu.mjs";
import { a as resolveAllAgentSessionStoreTargetsSync } from "./targets-BbcRkdUC.mjs";
import { r as hydrateSessionStoreSkillPromptRefs } from "./skill-prompt-blobs-nw-M-anz.mjs";
import { t as decodeXml } from "./xml-mfWEXuUN.mjs";
import { t as note } from "./note-Byxgt4MB.mjs";
import { t as resolveBundledSkillsDir } from "./bundled-dir-mhSRaiLk.mjs";
import fs from "node:fs";
import path from "node:path";
//#region src/commands/doctor-session-snapshots.ts
/** Advisory inspection of runtime snapshot paths retained in legacy session stores. */
const SESSION_SNAPSHOTS_CHECK_ID = "core/doctor/session-snapshots";
function resolveSessionSnapshotBundledSkillsDir(params) {
	const explicit = params?.bundledSkillsDir?.trim();
	if (explicit) return explicit;
	const resolved = resolveBundledSkillsDir({
		argv1: params?.argv1,
		moduleUrl: params?.moduleUrl,
		cwd: params?.cwd,
		execPath: params?.execPath
	});
	if (resolved) return resolved;
	const packageRoot = resolveOpenClawPackageRootSync({
		argv1: params?.argv1 ?? process.argv[1],
		moduleUrl: params?.moduleUrl ?? import.meta.url,
		cwd: params?.cwd ?? process.cwd()
	});
	return packageRoot ? path.join(packageRoot, "skills") : void 0;
}
function extractSkillLocations(prompt) {
	return typeof prompt === "string" ? [...prompt.matchAll(/<location>([\s\S]*?)<\/location>/g)].flatMap((match) => {
		const raw = match[1]?.trim();
		return raw ? [decodeXml(raw)] : [];
	}) : [];
}
function collectResolvedSkillPaths(value) {
	if (!Array.isArray(value)) return [];
	const paths = [];
	for (const skill of value) {
		if (!isRecord(skill)) continue;
		const sourceInfo = isRecord(skill.sourceInfo) ? skill.sourceInfo : void 0;
		for (const [filePath, baseDir] of [[skill.filePath, skill.baseDir], [sourceInfo?.path, sourceInfo?.baseDir]]) {
			if (typeof filePath === "string" && filePath.trim()) paths.push(filePath.trim());
			if (typeof baseDir === "string" && baseDir.trim()) paths.push(path.join(baseDir.trim(), "SKILL.md"));
		}
	}
	return paths;
}
function collectInjectedWorkspaceFilePaths(value) {
	if (!Array.isArray(value)) return [];
	return value.map((entry) => isRecord(entry) && typeof entry.path === "string" ? entry.path.trim() : "").filter(Boolean);
}
function collectCachedSnapshotPaths(entry) {
	const snapshot = entry.skillsSnapshot;
	const report = entry.systemPromptReport;
	const paths = [];
	for (const location of extractSkillLocations(snapshot?.prompt)) paths.push({
		field: "skillsSnapshot.prompt",
		path: location
	});
	for (const location of collectResolvedSkillPaths(snapshot?.resolvedSkills)) paths.push({
		field: "skillsSnapshot.resolvedSkills",
		path: location
	});
	if (isRecord(report)) for (const location of collectInjectedWorkspaceFilePaths(report.injectedWorkspaceFiles)) paths.push({
		field: "systemPromptReport.injectedWorkspaceFiles",
		path: location
	});
	return paths;
}
function isAbsolutePathLike(value) {
	return path.isAbsolute(value) || path.win32.isAbsolute(value);
}
function splitPathSegments(value) {
	return value.replace(/^[a-z]:/i, "").replaceAll("\\", "/").split("/").filter(Boolean);
}
function isWindowsAbsolutePath(value) {
	return /^[a-z]:/i.test(value) && ["/", "\\"].includes(value.slice(2, 3)) || value.startsWith("\\\\");
}
function isTempBackedOpenClawRoot(segments) {
	const lower = segments.map((segment) => segment.toLowerCase());
	const openclawIndex = lower.lastIndexOf("openclaw");
	if (openclawIndex < 1) return false;
	return lower[openclawIndex - 1] === "tmp" || lower[openclawIndex - 1] === "temp";
}
function isBundledRuntimeSkillsPath(beforeSkillRoot) {
	return beforeSkillRoot.map((segment) => segment.toLowerCase()).some((segment) => segment === "dist-runtime" || segment === "node_modules" || segment.startsWith("openclaw@")) || isTempBackedOpenClawRoot(beforeSkillRoot);
}
function extractBundledSkillRelativeSegments(cachedPath) {
	const segments = splitPathSegments(cachedPath);
	const skillRootIndex = segments.lastIndexOf("skills");
	if (skillRootIndex < 0 || !isBundledRuntimeSkillsPath(segments.slice(0, skillRootIndex))) return;
	const relativeSegments = segments.slice(skillRootIndex + 1);
	if (relativeSegments.length < 2 || relativeSegments.at(-1) !== "SKILL.md") return;
	return relativeSegments;
}
function isInsidePath(baseDir, candidatePath) {
	const baseIsWindows = isWindowsAbsolutePath(baseDir);
	if (baseIsWindows !== isWindowsAbsolutePath(candidatePath)) return false;
	const pathApi = baseIsWindows ? path.win32 : path;
	const relative = pathApi.relative(pathApi.resolve(baseDir), pathApi.resolve(candidatePath));
	return relative === "" || !relative.startsWith("..") && !pathApi.isAbsolute(relative);
}
function joinPathForRoot(root, ...segments) {
	return isWindowsAbsolutePath(root) ? path.win32.join(root, ...segments) : path.join(root, ...segments);
}
function resolveExpectedBundledSkillPath(params) {
	const osHomeDir = resolveOsHomeDir(params.env);
	const expandedCachedPath = osHomeDir ? expandHomePrefix(params.cachedPath, { home: osHomeDir }) : params.cachedPath;
	if (!isAbsolutePathLike(expandedCachedPath)) return;
	const relativeSegments = extractBundledSkillRelativeSegments(expandedCachedPath);
	if (!relativeSegments) return;
	const movedPath = resolveMovedBundledSkillPath({
		relativeSegments,
		pathExists: params.pathExists,
		env: params.env
	});
	if (movedPath) return movedPath;
	if (isInsidePath(params.bundledSkillsDir, expandedCachedPath)) return;
	const expectedPath = joinPathForRoot(params.bundledSkillsDir, ...relativeSegments);
	return params.pathExists(expectedPath) ? expectedPath : void 0;
}
function resolveMovedBundledSkillPath(params) {
	if (params.relativeSegments.join("/") !== "imsg/SKILL.md") return;
	const expectedPath = path.join(resolveConfigDir(params.env), "plugin-skills", "imsg", "SKILL.md");
	return params.pathExists(expectedPath) ? expectedPath : void 0;
}
/** Finds cached bundled-skill paths that point at old runtime/temp package roots. */
function scanSessionStoreForStaleRuntimeSnapshotPaths(params) {
	const bundledSkillsDir = params.bundledSkillsDir?.trim();
	if (!bundledSkillsDir) return [];
	const pathExists = params.pathExists ?? fs.existsSync;
	const findings = [];
	const seen = /* @__PURE__ */ new Set();
	for (const [sessionKey, entry] of Object.entries(params.store)) {
		if (!entry || typeof entry !== "object") continue;
		for (const cached of collectCachedSnapshotPaths(entry)) {
			const expectedPath = resolveExpectedBundledSkillPath({
				cachedPath: cached.path,
				bundledSkillsDir,
				pathExists,
				env: params.env
			});
			if (!expectedPath) continue;
			const key = `${sessionKey}\0${cached.field}\0${cached.path}`;
			if (seen.has(key)) continue;
			seen.add(key);
			findings.push({
				sessionKey,
				field: cached.field,
				cachedPath: cached.path,
				expectedPath
			});
		}
	}
	return findings;
}
async function listSessionStorePaths(stateDir) {
	const agentsDir = path.join(stateDir, "agents");
	let agentEntries;
	try {
		agentEntries = await fs.promises.readdir(agentsDir, { withFileTypes: true });
	} catch {
		return [];
	}
	return agentEntries.filter((entry) => entry.isDirectory()).map((entry) => path.join(agentsDir, entry.name, "sessions", "sessions.json")).filter((storePath) => fs.existsSync(storePath)).toSorted((a, b) => a.localeCompare(b));
}
function resolveSessionStorePaths(params) {
	if (!params.cfg) return;
	return resolveAllAgentSessionStoreTargetsSync(params.cfg, { env: params.env }).map((target) => target.storePath).filter((storePath) => fs.existsSync(storePath)).toSorted((a, b) => a.localeCompare(b));
}
function loadSessionStoreForSnapshotScan(storePath) {
	const parsed = JSON.parse(fs.readFileSync(storePath, "utf-8"));
	if (!isRecord(parsed)) return {};
	const store = parsed;
	hydrateSessionStoreSkillPromptRefs({
		storePath,
		store
	});
	return store;
}
async function scanSessionSnapshotHealth(params = {}, onError) {
	const bundledSkillsDir = resolveSessionSnapshotBundledSkillsDir({ bundledSkillsDir: params.bundledSkillsDir });
	const stores = [];
	if (bundledSkillsDir) {
		const storePaths = params.storePaths ?? resolveSessionStorePaths(params) ?? await listSessionStorePaths(resolveStateDir(params.env));
		for (const storePath of storePaths) {
			let store;
			try {
				store = loadSessionStoreForSnapshotScan(storePath);
			} catch (error) {
				onError?.(storePath, error);
				continue;
			}
			const findings = scanSessionStoreForStaleRuntimeSnapshotPaths({
				store,
				bundledSkillsDir,
				env: params.env
			});
			if (findings.length > 0) stores.push({
				storePath,
				findings
			});
		}
	}
	return {
		bundledSkillsDir,
		stores
	};
}
async function detectSessionSnapshotHealthIssues(params) {
	const { stores } = await scanSessionSnapshotHealth(params);
	return stores.flatMap(({ storePath, findings }) => findings.map((finding) => ({
		...finding,
		storePath
	})));
}
function sessionSnapshotIssueToHealthFinding(issue) {
	return {
		checkId: SESSION_SNAPSHOTS_CHECK_ID,
		severity: "info",
		message: `${issue.sessionKey} historical session metadata references an inactive runtime root.`,
		path: issue.storePath,
		target: issue.cachedPath,
		requirement: `Current bundled skill path: ${issue.expectedPath}`,
		fixHint: "No repair is needed for this historical metadata. Doctor preserves migration originals; active sessions use canonical SQLite state and the current runtime skill catalog."
	};
}
/** Reports historical snapshot paths without rewriting migration source bytes. */
async function noteSessionSnapshotHealth(params) {
	const { bundledSkillsDir, stores } = await scanSessionSnapshotHealth(params, (storePath, error) => {
		note(`- Failed to inspect session snapshot metadata in ${shortenHomePath(storePath)}: ${String(error)}`, "Session snapshots");
	});
	if (!bundledSkillsDir) return;
	const findingsByStore = new Map(stores.map(({ storePath, findings }) => [storePath, findings]));
	const totalFindings = [...findingsByStore.values()].reduce((total, findings) => total + findings.length, 0);
	if (totalFindings === 0) return;
	const affectedSessions = new Set([...findingsByStore.values()].flatMap((findings) => findings.map((finding) => finding.sessionKey)));
	const lines = [
		`- Found ${affectedSessions.size} session${affectedSessions.size === 1 ? "" : "s"} with stale cached session metadata paths.`,
		`  Live bundled skills root is healthy: ${shortenHomePath(bundledSkillsDir)}`,
		"  Historical metadata references an inactive runtime root. Originals are preserved; active sessions use canonical SQLite state and the current runtime skill catalog. No cleanup or session reset is needed."
	];
	let shown = 0;
	for (const [storePath, findings] of findingsByStore) {
		lines.push(`  Store: ${shortenHomePath(storePath)}`);
		for (const finding of findings.slice(0, Math.max(0, 10 - shown))) {
			lines.push(`  - ${finding.sessionKey} ${finding.field}: ${shortenHomePath(finding.cachedPath)} -> ${shortenHomePath(finding.expectedPath)}`);
			shown += 1;
			if (shown >= 10) break;
		}
		if (shown >= 10) break;
	}
	if (totalFindings > shown) lines.push(`  ...and ${totalFindings - shown} more stale cached path${totalFindings - shown === 1 ? "" : "s"}.`);
	note(lines.join("\n"), "Session snapshots");
}
if (process.env.VITEST || false) globalThis[Symbol.for("openclaw.doctorSessionSnapshotsTestApi")] = {
	resolveSessionSnapshotBundledSkillsDir,
	scanSessionStoreForStaleRuntimeSnapshotPaths
};
//#endregion
export { detectSessionSnapshotHealthIssues, noteSessionSnapshotHealth, sessionSnapshotIssueToHealthFinding };
