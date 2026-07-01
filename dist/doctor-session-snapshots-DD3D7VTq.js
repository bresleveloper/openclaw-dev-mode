import { o as isRecord } from "./record-coerce-DHZ4bFlT.js";
import { t as expandHomePrefix } from "./home-dir-BjcCg_IW.js";
import { y as resolveStateDir } from "./paths-DyelItkH.js";
import { _ as shortenHomePath } from "./utils-BApvfmPs.js";
import { s as writeTextAtomic } from "./json-files-2umMHm0W.js";
import { o as resolveSessionSkillPromptBlobPath, r as hydrateSessionStoreSkillPromptRefs } from "./skill-prompt-blobs-CzsZaj42.js";
import { r as resolveAllAgentSessionStoreTargetsSync } from "./targets-7kfDzi_O.js";
import { t as resolveBundledSkillsDir } from "./bundled-dir-BCWH7qz6.js";
import { t as note } from "./note-DXV6Ywsc.js";
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
//#region src/commands/doctor-session-snapshots.ts
/** Doctor repair for stale runtime snapshot paths cached in session stores. */
function decodeXmlText(value) {
	return value.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, "\"").replace(/&apos;/g, "'").replace(/&amp;/g, "&");
}
function extractSkillLocations(prompt) {
	if (typeof prompt !== "string" || !prompt.trim()) return [];
	const locations = [];
	for (const match of prompt.matchAll(/<location>([\s\S]*?)<\/location>/g)) {
		const raw = match[1]?.trim();
		if (raw) locations.push(decodeXmlText(raw));
	}
	return locations;
}
function collectResolvedSkillPaths(value) {
	if (!Array.isArray(value)) return [];
	const paths = [];
	for (const skill of value) {
		if (!isRecord(skill)) continue;
		if (typeof skill.filePath === "string" && skill.filePath.trim()) paths.push(skill.filePath.trim());
		if (typeof skill.baseDir === "string" && skill.baseDir.trim()) paths.push(path.join(skill.baseDir.trim(), "SKILL.md"));
		if (isRecord(skill.sourceInfo)) {
			if (typeof skill.sourceInfo.path === "string" && skill.sourceInfo.path.trim()) paths.push(skill.sourceInfo.path.trim());
			if (typeof skill.sourceInfo.baseDir === "string" && skill.sourceInfo.baseDir.trim()) paths.push(path.join(skill.sourceInfo.baseDir.trim(), "SKILL.md"));
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
function isBundledRuntimeSkillsPath(cachedPath, skillRootIndex) {
	const beforeSkillRoot = splitPathSegments(cachedPath).slice(0, skillRootIndex);
	return beforeSkillRoot.map((segment) => segment.toLowerCase()).some((segment) => segment === "dist-runtime" || segment === "node_modules" || segment.startsWith("openclaw@")) || isTempBackedOpenClawRoot(beforeSkillRoot);
}
function extractBundledSkillRelativeSegments(cachedPath) {
	const segments = splitPathSegments(cachedPath);
	const skillRootIndex = segments.lastIndexOf("skills");
	if (skillRootIndex < 0 || !isBundledRuntimeSkillsPath(cachedPath, skillRootIndex)) return;
	const relativeSegments = segments.slice(skillRootIndex + 1);
	if (relativeSegments.length < 2 || relativeSegments.at(-1) !== "SKILL.md") return;
	return relativeSegments;
}
function isInsidePath(baseDir, candidatePath) {
	const baseIsWindows = isWindowsAbsolutePath(baseDir);
	if (baseIsWindows !== isWindowsAbsolutePath(candidatePath)) return false;
	const pathApi = baseIsWindows ? path.win32 : path;
	const relative = pathApi.relative(pathApi.resolve(baseDir), pathApi.resolve(candidatePath));
	return relative === "" || relative !== "" && !relative.startsWith("..") && !pathApi.isAbsolute(relative);
}
function joinPathForRoot(root, ...segments) {
	return isWindowsAbsolutePath(root) ? path.win32.join(root, ...segments) : path.join(root, ...segments);
}
function resolveExpectedBundledSkillPath(params) {
	const expandedCachedPath = expandHomePrefix(params.cachedPath, {
		home: params.homeDir,
		env: params.env
	});
	if (!isAbsolutePathLike(expandedCachedPath)) return;
	if (isInsidePath(params.bundledSkillsDir, expandedCachedPath)) return;
	const relativeSegments = extractBundledSkillRelativeSegments(expandedCachedPath);
	if (!relativeSegments) return;
	const expectedPath = joinPathForRoot(params.bundledSkillsDir, ...relativeSegments);
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
				homeDir: params.homeDir,
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
/** Replaces stale paths in raw, JSON-escaped, and XML-escaped prompt text. */
function replaceStalePathsInText(text, finding) {
	const jsonEscaped = JSON.stringify(finding.cachedPath).slice(1, -1);
	const jsonEscapedExpected = JSON.stringify(finding.expectedPath).slice(1, -1);
	const xmlEscaped = finding.cachedPath.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
	const xmlEscapedExpected = finding.expectedPath.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
	let result = text;
	if (result.includes(jsonEscaped)) result = result.replaceAll(jsonEscaped, jsonEscapedExpected);
	if (result.includes(xmlEscaped)) result = result.replaceAll(xmlEscaped, xmlEscapedExpected);
	if (result.includes(finding.cachedPath)) result = result.replaceAll(finding.cachedPath, finding.expectedPath);
	return result;
}
/** Reports and optionally repairs stale bundled skill paths in session snapshot metadata. */
async function noteSessionSnapshotHealth(params) {
	const bundledSkillsDir = params?.bundledSkillsDir ?? resolveBundledSkillsDir();
	if (!bundledSkillsDir) return;
	const storePaths = params?.storePaths ?? resolveSessionStorePaths({
		cfg: params?.cfg,
		env: params?.env
	}) ?? await listSessionStorePaths(resolveStateDir(params?.env));
	const findingsByStore = /* @__PURE__ */ new Map();
	for (const storePath of storePaths) {
		let store;
		try {
			store = loadSessionStoreForSnapshotScan(storePath);
		} catch (err) {
			note(`- Failed to inspect session snapshot metadata in ${shortenHomePath(storePath)}: ${String(err)}`, "Session snapshots");
			continue;
		}
		const findings = scanSessionStoreForStaleRuntimeSnapshotPaths({
			store,
			bundledSkillsDir,
			env: params?.env
		});
		if (findings.length > 0) findingsByStore.set(storePath, findings);
	}
	const totalFindings = [...findingsByStore.values()].reduce((total, findings) => total + findings.length, 0);
	if (totalFindings === 0) return;
	const affectedSessions = new Set([...findingsByStore.values()].flatMap((findings) => findings.map((finding) => finding.sessionKey)));
	if (params?.shouldRepair) {
		let repairedStores = 0;
		let totalReplacements = 0;
		let leftoverFindings = 0;
		for (const [storePath, findings] of findingsByStore) try {
			const raw = fs.readFileSync(storePath, "utf-8");
			const sessions = JSON.parse(raw);
			let modified = false;
			let storeCount = 0;
			for (const finding of findings) {
				const session = sessions[finding.sessionKey];
				if (!isRecord(session)) continue;
				const jsonEscaped = JSON.stringify(finding.cachedPath).slice(1, -1);
				const jsonEscapedExpected = JSON.stringify(finding.expectedPath).slice(1, -1);
				if (finding.field === "skillsSnapshot.prompt") {
					const snapshot = session.skillsSnapshot;
					if (!isRecord(snapshot)) continue;
					const promptRef = isRecord(snapshot.promptRef) ? snapshot.promptRef : void 0;
					if (promptRef && typeof promptRef.hash === "string") {
						const blobPath = resolveSessionSkillPromptBlobPath(storePath, promptRef.hash);
						if (blobPath && fs.existsSync(blobPath)) {
							const blobContent = fs.readFileSync(blobPath, "utf-8");
							const newBlob = replaceStalePathsInText(blobContent, finding);
							if (newBlob !== blobContent) {
								const newHash = crypto.createHash("sha256").update(newBlob, "utf8").digest("hex");
								const newBytes = Buffer.byteLength(newBlob, "utf8");
								const newBlobPath = resolveSessionSkillPromptBlobPath(storePath, newHash);
								if (newBlobPath) {
									await fs.promises.mkdir(path.dirname(newBlobPath), { recursive: true });
									await writeTextAtomic(newBlobPath, newBlob, {
										durable: false,
										mode: 384,
										tempPrefix: path.basename(newBlobPath)
									});
									snapshot.promptRef.hash = newHash;
									snapshot.promptRef.bytes = newBytes;
									storeCount++;
									modified = true;
								}
							}
						}
					} else if (typeof snapshot.prompt === "string") {
						const newPrompt = replaceStalePathsInText(snapshot.prompt, finding);
						if (newPrompt !== snapshot.prompt) {
							snapshot.prompt = newPrompt;
							storeCount++;
							modified = true;
						}
					}
				} else if (finding.field === "skillsSnapshot.resolvedSkills") {
					const snapshot = session.skillsSnapshot;
					if (!isRecord(snapshot) || !Array.isArray(snapshot.resolvedSkills)) continue;
					for (const entry of snapshot.resolvedSkills) {
						if (!isRecord(entry)) continue;
						const replaceResolvedSkillField = (target, field) => {
							if (typeof target[field] !== "string") return;
							let value = target[field];
							const original = value;
							const candidates = [{
								cached: jsonEscaped,
								expected: jsonEscapedExpected
							}, {
								cached: finding.cachedPath,
								expected: finding.expectedPath
							}];
							if (field === "baseDir") {
								for (const suffix of ["/SKILL.md", "\\SKILL.md"]) if (finding.cachedPath.endsWith(suffix)) {
									const cachedDir = finding.cachedPath.slice(0, -suffix.length);
									const expectedDir = finding.expectedPath.slice(0, -suffix.length);
									candidates.push({
										cached: JSON.stringify(cachedDir).slice(1, -1),
										expected: JSON.stringify(expectedDir).slice(1, -1)
									}, {
										cached: cachedDir,
										expected: expectedDir
									});
								}
							}
							for (const { cached, expected } of candidates) if (value.includes(cached)) value = value.replaceAll(cached, expected);
							if (value !== original) {
								target[field] = value;
								storeCount++;
								modified = true;
							}
						};
						for (const field of ["filePath", "baseDir"]) replaceResolvedSkillField(entry, field);
						if (isRecord(entry.sourceInfo)) for (const field of ["path", "baseDir"]) replaceResolvedSkillField(entry.sourceInfo, field);
					}
				} else if (finding.field === "systemPromptReport.injectedWorkspaceFiles") {
					const report = session.systemPromptReport;
					if (!isRecord(report) || !Array.isArray(report.injectedWorkspaceFiles)) continue;
					for (const entry of report.injectedWorkspaceFiles) {
						if (!isRecord(entry) || typeof entry.path !== "string") continue;
						let entryPath = entry.path;
						const original = entryPath;
						for (const { cached, expected } of [{
							cached: jsonEscaped,
							expected: jsonEscapedExpected
						}, {
							cached: finding.cachedPath,
							expected: finding.expectedPath
						}]) if (entryPath.includes(cached)) entryPath = entryPath.replaceAll(cached, expected);
						if (entryPath !== original) {
							entry.path = entryPath;
							storeCount++;
							modified = true;
						}
					}
				}
			}
			if (modified && storeCount > 0) {
				await writeTextAtomic(`${storePath}.bak.${Date.now()}`, raw, { mode: 384 });
				await writeTextAtomic(storePath, JSON.stringify(sessions, null, 2), { mode: 384 });
				totalReplacements += storeCount;
				repairedStores++;
				const leftovers = scanSessionStoreForStaleRuntimeSnapshotPaths({
					store: loadSessionStoreForSnapshotScan(storePath),
					bundledSkillsDir,
					env: params?.env
				});
				leftoverFindings += leftovers.length;
			}
		} catch (err) {
			note(`- Failed to repair session snapshot paths in ${shortenHomePath(storePath)}: ${String(err)}`, "Session snapshots");
		}
		if (repairedStores > 0) {
			const msg = `- Repaired ${totalReplacements} stale path${totalReplacements === 1 ? "" : "s"} across ${repairedStores} store${repairedStores === 1 ? "" : "s"}.`;
			if (leftoverFindings > 0) note(`${msg}\n  ${leftoverFindings} stale path${leftoverFindings === 1 ? "" : "s"} still remain (possibly non-bundled or non-repairable).`, "Session snapshots");
			else note(msg, "Session snapshots");
			return;
		}
	}
	const lines = [
		`- Found ${affectedSessions.size} session${affectedSessions.size === 1 ? "" : "s"} with stale cached session metadata paths.`,
		`  Live bundled skills root is healthy: ${shortenHomePath(bundledSkillsDir)}`,
		"  Cached session metadata still references an inactive runtime root; start a fresh session or reset the affected long-lived sessions after confirming history can be retired."
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
//#endregion
export { noteSessionSnapshotHealth };
