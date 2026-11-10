import { r as resolveOpenClawPackageRootSync } from "./openclaw-root-CPodxfi3.mjs";
import { r as resolveOsHomeDir } from "./home-dir-AB7ik58U.mjs";
import { t as expandHomePrefix } from "./home-dir-CtsdYvX3.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { g as resolveConfigDir, p as shortenHomePath } from "./utils-gjJ-tD2q.mjs";
import { a as resolveAllAgentSessionStoreTargetsSync } from "./targets-DJGC6v85.mjs";
import { r as hydrateSessionStoreSkillPromptRefs } from "./skill-prompt-blobs-DIJpnTwW.mjs";
import { t as decodeXml } from "./xml-mfWEXuUN.mjs";
import { t as resolveBundledSkillsDir } from "./bundled-dir--MDSYPfU.mjs";
import { t as note } from "./note-CmoIRLec.mjs";
import fs from "node:fs";
import path from "node:path";
//#region src/commands/doctor-session-snapshots.ts
/** Advisory inspection of runtime snapshot paths retained in legacy session stores. */
const SESSION_SNAPSHOTS_CHECK_ID = "core/doctor/session-snapshots";
function resolveSessionSnapshotBundledSkillsDir() {
	const resolved = resolveBundledSkillsDir();
	if (resolved) return resolved;
	const packageRoot = resolveOpenClawPackageRootSync({
		argv1: process.argv[1],
		moduleUrl: import.meta.url,
		cwd: process.cwd()
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
	return [
		["skillsSnapshot.prompt", extractSkillLocations(snapshot?.prompt)],
		["skillsSnapshot.resolvedSkills", collectResolvedSkillPaths(snapshot?.resolvedSkills)],
		["systemPromptReport.injectedWorkspaceFiles", isRecord(report) ? collectInjectedWorkspaceFilePaths(report.injectedWorkspaceFiles) : []]
	].flatMap(([field, paths]) => paths.map((location) => ({
		field,
		path: location
	})));
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
function isBundledRuntimeSkillsPath(beforeSkillRoot) {
	const lower = beforeSkillRoot.map((segment) => segment.toLowerCase());
	const openclawIndex = lower.lastIndexOf("openclaw");
	return lower.some((segment) => segment === "dist-runtime" || segment === "node_modules" || segment.startsWith("openclaw@")) || openclawIndex > 0 && ["tmp", "temp"].includes(lower[openclawIndex - 1]);
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
	if (relativeSegments.join("/") === "imsg/SKILL.md") {
		const movedPath = path.join(resolveConfigDir(params.env), "plugin-skills", "imsg", "SKILL.md");
		if (fs.existsSync(movedPath)) return movedPath;
	}
	if (isInsidePath(params.bundledSkillsDir, expandedCachedPath)) return;
	const expectedPath = joinPathForRoot(params.bundledSkillsDir, ...relativeSegments);
	return fs.existsSync(expectedPath) ? expectedPath : void 0;
}
/** Finds cached bundled-skill paths that point at old runtime/temp package roots. */
function scanSessionStoreForStaleRuntimeSnapshotPaths(params) {
	const bundledSkillsDir = params.bundledSkillsDir?.trim();
	if (!bundledSkillsDir) return [];
	const findings = [];
	const seen = /* @__PURE__ */ new Set();
	for (const [sessionKey, entry] of Object.entries(params.store)) {
		if (!entry || typeof entry !== "object") continue;
		for (const cached of collectCachedSnapshotPaths(entry)) {
			const expectedPath = resolveExpectedBundledSkillPath({
				cachedPath: cached.path,
				bundledSkillsDir,
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
async function scanSessionSnapshotHealth(params, onError) {
	const bundledSkillsDir = resolveSessionSnapshotBundledSkillsDir();
	const stores = [];
	if (bundledSkillsDir) {
		const storePaths = resolveAllAgentSessionStoreTargetsSync(params.cfg, { env: params.env }).map((target) => target.storePath).filter((storePath) => fs.existsSync(storePath)).toSorted((a, b) => a.localeCompare(b));
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
		fixHint: "No repair is needed for this historical metadata. Doctor preserves migration originals; active sessions use stored SQLite state and the current runtime skill catalog."
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
		"  Historical metadata references an inactive runtime root. Originals are preserved; active sessions use stored SQLite state and the current runtime skill catalog. No cleanup or session reset is needed."
	];
	let shown = 0;
	for (const [storePath, findings] of findingsByStore) {
		lines.push(`  Store: ${shortenHomePath(storePath)}`);
		for (const finding of findings.slice(0, Math.max(0, 10 - shown))) {
			lines.push(`  - ${finding.sessionKey} ${finding.field}: ${shortenHomePath(finding.cachedPath)} -> ${shortenHomePath(finding.expectedPath)}`);
			shown += 1;
		}
		if (shown >= 10) break;
	}
	if (totalFindings > shown) lines.push(`  ...and ${totalFindings - shown} more stale cached path${totalFindings - shown === 1 ? "" : "s"}.`);
	note(lines.join("\n"), "Session snapshots");
}
//#endregion
export { detectSessionSnapshotHealthIssues, noteSessionSnapshotHealth, sessionSnapshotIssueToHealthFinding };
