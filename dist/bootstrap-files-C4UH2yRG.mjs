import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { o as resolveUserPath } from "./home-dir-Dc6nN6HB.mjs";
import { r as isRootFileMissingFailure } from "./boundary-file-read-CCth2Hwg.mjs";
import "./utils-DgZn2dLu.mjs";
import { g as resolveDefaultAgentId, r as resolveAgentConfig } from "./agent-scope-config-CDYpzA0r.mjs";
import { l as resolveAgentIdFromSessionKey } from "./session-key-C09ow4h0.mjs";
import "./agent-scope-CG17uXFn.mjs";
import { d as readUserProfileIdentity, i as hasMultipleSessionSharingIdentities } from "./user-profile-list-CtETKur7.mjs";
import { i as getAgentWorkspaceAccess } from "./workspace-access-DjFUgH7e.mjs";
import { g as resolveWorkspaceBootstrapPath, i as DEFAULT_MEMORY_FILENAME, n as DEFAULT_BOOTSTRAP_FILENAME, s as DEFAULT_USER_FILENAME } from "./workspace-bootstrap-policy-CPdXB_so.mjs";
import { i as getWorkspaceFileSourceRelativePath, l as workspaceFilesShareSourceIdentity, o as readWorkspaceFileWithGuards, s as setWorkspaceFileSourceIdentity } from "./workspace-bootstrap-publish-ZP86pZVJ.mjs";
import { c as loadWorkspaceBootstrapFiles, o as isWorkspaceSetupCompleted, r as filterBootstrapFilesForSession } from "./workspace-C0xiByg0.mjs";
import { t as prepareSessionTranscriptHydration } from "./session-transcript-hydration-Boy0sn8m.mjs";
import { r as isMemoryOriginEligibleForAutomaticInjection } from "./types-DTVBdCzw.mjs";
import { r as buildBootstrapContextForFiles } from "./bootstrap-DROECufe.mjs";
import { i as getOrLoadBootstrapFiles } from "./bootstrap-cache-BWoSWwko.mjs";
import { n as createInternalHookEvent, u as triggerInternalHook } from "./internal-hooks-HjIVcJaQ.mjs";
import { t as forkTrustsAllMemoryFiles } from "./fork-memory-provenance-trust-CMYjYe2y.mjs";
import { n as classifyActiveMemoryWorkspacePaths } from "./memory-runtime-B776pEel.mjs";
import path from "node:path";
//#region src/agents/bootstrap-hooks.ts
/** Runs bootstrap hooks and returns the effective bootstrap file list. */
async function applyBootstrapHookOverrides(params) {
	const sessionKey = params.sessionKey ?? params.sessionId ?? "unknown";
	const agentId = params.agentId ?? (params.sessionKey ? resolveAgentIdFromSessionKey(params.sessionKey) : void 0);
	const context = {
		workspaceDir: params.workspaceDir,
		bootstrapFiles: params.files,
		cfg: params.config,
		sessionKey: params.sessionKey,
		sessionId: params.sessionId,
		agentId
	};
	const event = createInternalHookEvent("agent", "bootstrap", sessionKey, context);
	await triggerInternalHook(event);
	const updated = event.context.bootstrapFiles;
	return Array.isArray(updated) ? updated : params.files;
}
//#endregion
//#region src/agents/workspace-personal-bootstrap.ts
/** Optional personal overlay; the caller supplies the session-selected human profile. */
async function loadPersonalUserBootstrapFile(dir, profileId, warn) {
	if (!profileId || !hasMultipleSessionSharingIdentities()) return;
	const canonicalId = readUserProfileIdentity(profileId)?.profileId;
	if (!canonicalId || !/^[a-zA-Z0-9][a-zA-Z0-9_-]{0,127}$/.test(canonicalId)) return;
	const workspaceDir = resolveUserPath(dir);
	const filePath = path.join(workspaceDir, "users", canonicalId, DEFAULT_USER_FILENAME);
	const loaded = await readWorkspaceFileWithGuards({
		filePath,
		workspaceDir,
		rejectAliases: true
	});
	if (!loaded.ok) {
		if (!isRootFileMissingFailure(loaded)) warn?.("Personal USER.md could not be read safely; using shared defaults.");
		return;
	}
	if (!hasMultipleSessionSharingIdentities() || readUserProfileIdentity(profileId)?.profileId !== canonicalId) return;
	const file = {
		name: DEFAULT_USER_FILENAME,
		path: filePath,
		content: loaded.content,
		missing: false,
		personalUser: true
	};
	setWorkspaceFileSourceIdentity(file, loaded.sourceIdentity);
	return file;
}
//#endregion
//#region src/agents/bootstrap-files.ts
const CONTINUATION_SCAN_MAX_RECORDS = 500;
const FULL_BOOTSTRAP_COMPLETED_CUSTOM_TYPE = "openclaw:bootstrap-context:full";
const BOOTSTRAP_WARNING_DEDUPE_LIMIT = 1024;
const seenBootstrapWarnings = /* @__PURE__ */ new Set();
function rememberBootstrapWarning(key) {
	if (seenBootstrapWarnings.has(key)) return false;
	if (seenBootstrapWarnings.size >= BOOTSTRAP_WARNING_DEDUPE_LIMIT) {
		const oldest = seenBootstrapWarnings.values().next().value;
		if (oldest) seenBootstrapWarnings.delete(oldest);
	}
	seenBootstrapWarnings.add(key);
	return true;
}
/** Resolves the effective bootstrap injection mode for a session agent. */
function resolveContextInjectionMode(config, agentId) {
	const agentMode = config && agentId ? resolveAgentConfig(config, agentId)?.contextInjection : void 0;
	if (agentMode === "always" || agentMode === "continuation-skip" || agentMode === "never") return agentMode;
	return config?.agents?.defaults?.contextInjection ?? "always";
}
/** Checks the active SQLite transcript branch for a valid full-bootstrap marker. */
async function hasCompletedBootstrapTurn(sessionTarget) {
	const { agentId, sessionId, sessionKey, storePath } = sessionTarget ?? {};
	if (!agentId || !sessionId || !sessionKey || !storePath) return false;
	try {
		const reader = prepareSessionTranscriptHydration({
			agentId,
			sessionId,
			sessionKey,
			storePath
		});
		const records = await reader.readRecentActiveEvents(CONTINUATION_SCAN_MAX_RECORDS);
		reader.assertCurrent();
		for (const entry of records.toReversed()) {
			const record = entry;
			if (record?.type === "compaction" || record?.type === "reset") return false;
			if (record?.type === "custom" && record.customType === "openclaw:bootstrap-context:full") return true;
		}
		return false;
	} catch {
		return false;
	}
}
/** Builds a session-scoped warning sink that dedupes repeated bootstrap warnings. */
function makeBootstrapWarn(params) {
	const warn = params.warn;
	if (!warn) return;
	const workspacePrefix = params.workspaceDir ?? "";
	return (message) => {
		if (!rememberBootstrapWarning(`${workspacePrefix}\u0000${params.sessionLabel}\u0000${message}`)) return;
		warn(`${message} (sessionKey=${params.sessionLabel})`);
	};
}
function sanitizeBootstrapFiles(files, workspaceDir, warn) {
	const workspaceRoot = resolveUserPath(workspaceDir);
	const seenPaths = /* @__PURE__ */ new Set();
	const sanitized = [];
	for (const file of files) {
		const pathValue = normalizeOptionalString(file.path) ?? "";
		if (!pathValue) {
			warn?.(`skipping bootstrap file "${file.name}" — missing or invalid "path" field (hook may have used "filePath" instead)`);
			continue;
		}
		const resolvedPath = resolveWorkspaceBootstrapPath(workspaceRoot, pathValue);
		const dedupeKey = path.normalize(path.relative(workspaceRoot, resolvedPath));
		if (seenPaths.has(dedupeKey)) continue;
		seenPaths.add(dedupeKey);
		sanitized.push({
			...file,
			path: resolvedPath
		});
	}
	return sanitized;
}
function filterCompletedWorkspaceBootstrapFile(files, setupCompleted, workspaceDir) {
	if (!setupCompleted) return files;
	const workspaceRoot = resolveUserPath(workspaceDir);
	const rootBootstrapPath = path.join(workspaceRoot, DEFAULT_BOOTSTRAP_FILENAME);
	return files.filter((file) => {
		if (file.name !== "BOOTSTRAP.md") return true;
		const pathValue = normalizeOptionalString(file.path);
		if (!pathValue) return true;
		return resolveWorkspaceBootstrapPath(workspaceRoot, pathValue) !== rootBootstrapPath;
	});
}
async function isWorkspaceSetupCompletedForContext(workspaceDir, readOnlyState = false) {
	try {
		return await isWorkspaceSetupCompleted(workspaceDir, readOnlyState ? { readOnly: true } : {});
	} catch {
		return false;
	}
}
function filterBootstrapFilesAfterHooks(params) {
	const sessionFiltered = filterBootstrapFilesForSession(params.files, params.session);
	const protectedFiles = params.protectedFiles ?? [];
	if (protectedFiles.length === 0) return sessionFiltered;
	return sessionFiltered.filter((file) => !protectedFiles.some((protectedFile) => {
		if (workspaceFilesShareSourceIdentity(file, protectedFile)) return true;
		const filePath = normalizeOptionalString(file.path);
		const protectedPath = normalizeOptionalString(protectedFile.path);
		return Boolean(filePath && protectedPath && path.resolve(filePath) === path.resolve(protectedPath));
	}));
}
async function resolveIneligibleAutomaticMemoryFiles(params) {
	if (forkTrustsAllMemoryFiles()) return [];
	const candidates = params.files.filter((file) => !file.missing && (file.name === DEFAULT_MEMORY_FILENAME || file.name === "USER.md"));
	if (candidates.length === 0 || !params.config) return [];
	let agentId;
	try {
		agentId = params.agentId ?? resolveDefaultAgentId(params.config);
	} catch (error) {
		params.warn?.(`excluding automatic memory context: ${String(error)}`);
		return candidates;
	}
	const relativePaths = candidates.map((file) => path.relative(resolveUserPath(params.workspaceDir), file.path).replaceAll(path.sep, "/"));
	let classificationResult;
	try {
		const access = getAgentWorkspaceAccess(params.workspaceDir);
		classificationResult = await classifyActiveMemoryWorkspacePaths({
			cfg: params.config,
			agentId,
			workspaceDir: params.workspaceDir,
			relativePaths,
			...access ? { readSources: candidates.map((file, index) => ({
				relativePath: relativePaths[index],
				canonicalRelativePath: getWorkspaceFileSourceRelativePath(file)
			})) } : {}
		});
		if (access && getAgentWorkspaceAccess(params.workspaceDir) !== access) throw new Error("Workspace access changed during memory classification");
	} catch (error) {
		params.warn?.(`excluding automatic memory context: ${String(error)}`);
		return candidates;
	}
	if (classificationResult.status === "unavailable") return [];
	if (classificationResult.status === "unsupported") {
		params.warn?.("excluding automatic memory context: selected memory runtime does not support provenance classification");
		return candidates;
	}
	const origins = new Map(classificationResult.classifications.map((entry) => [entry.relativePath, entry.originClass]));
	return candidates.filter((_file, index) => !isMemoryOriginEligibleForAutomaticInjection(origins.get(relativePaths[index])));
}
/** Prepare the same bounded workspace facts without invoking run-owned bootstrap hooks. */
async function resolveBootstrapFilesForPreparation(params) {
	return resolveBootstrapFiles({
		...params,
		readOnlyState: true
	}, "none");
}
async function resolveBootstrapFilesForRun(params) {
	return resolveBootstrapFiles(params, "registered");
}
async function resolveBootstrapFiles(params, hooks) {
	const access = getAgentWorkspaceAccess(params.workspaceDir);
	const session = {
		sessionKey: params.sessionKey ?? params.sessionId,
		chatType: params.chatType,
		workspaceDir: params.workspaceDir
	};
	const workspaceSetupCompleted = await isWorkspaceSetupCompletedForContext(params.workspaceDir, params.readOnlyState);
	const sharedFiles = params.sessionKey ? await getOrLoadBootstrapFiles({
		workspaceDir: params.workspaceDir,
		sessionKey: params.sessionKey
	}) : await loadWorkspaceBootstrapFiles(params.workspaceDir);
	const personalFile = await loadPersonalUserBootstrapFile(params.workspaceDir, params.bootstrapUserProfileId, params.warn);
	const userIndex = sharedFiles.findIndex((file) => file.name === DEFAULT_USER_FILENAME);
	const rawFiles = [...sharedFiles];
	if (personalFile) rawFiles.splice(userIndex < 0 ? rawFiles.length : userIndex + 1, 0, personalFile);
	const ineligibleAutomaticMemoryFiles = await resolveIneligibleAutomaticMemoryFiles({
		files: rawFiles,
		workspaceDir: params.workspaceDir,
		config: params.config,
		agentId: params.agentId,
		warn: params.warn
	});
	const rootMemoryFile = rawFiles.find((file) => file.name === DEFAULT_MEMORY_FILENAME && !file.missing);
	const protectedRootMemoryFile = rootMemoryFile && filterBootstrapFilesForSession([rootMemoryFile], session).length === 0 ? rootMemoryFile : void 0;
	const protectedFiles = [...protectedRootMemoryFile ? [protectedRootMemoryFile] : [], ...ineligibleAutomaticMemoryFiles];
	const sessionFiles = filterCompletedWorkspaceBootstrapFile(filterBootstrapFilesForSession(rawFiles, session).filter((file) => !ineligibleAutomaticMemoryFiles.some((ineligible) => workspaceFilesShareSourceIdentity(file, ineligible))), workspaceSetupCompleted, params.workspaceDir);
	const bootstrapFiles = params.contextMode === "lightweight" ? [] : sessionFiles;
	const hooked = hooks === "registered" ? await applyBootstrapHookOverrides({
		files: bootstrapFiles,
		workspaceDir: params.workspaceDir,
		config: params.config,
		sessionKey: params.sessionKey,
		sessionId: params.sessionId,
		agentId: params.agentId
	}) : bootstrapFiles;
	const filteredUpdated = filterCompletedWorkspaceBootstrapFile(filterBootstrapFilesAfterHooks({
		files: typeof hooks === "object" ? [...hooked, ...hooks.projected] : hooked,
		session,
		protectedFiles
	}), workspaceSetupCompleted, params.workspaceDir);
	if (getAgentWorkspaceAccess(params.workspaceDir) !== access) throw new Error("Workspace access changed while preparing bootstrap context");
	return sanitizeBootstrapFiles(filteredUpdated, params.workspaceDir, params.warn);
}
/** Resolves both raw bootstrap metadata and bounded context files for a run. */
async function resolveBootstrapContextForRun(params) {
	const bootstrapFiles = await resolveBootstrapFilesForRun(params);
	return {
		bootstrapFiles,
		contextFiles: buildBootstrapContextForFiles(bootstrapFiles, params)
	};
}
/** Applies declared additions through the normal bootstrap filters and budgets. */
async function resolveBootstrapContextWithProjectedHookFiles(params, projected) {
	const bootstrapFiles = await resolveBootstrapFiles({
		...params,
		readOnlyState: true
	}, { projected });
	return {
		bootstrapFiles,
		contextFiles: buildBootstrapContextForFiles(bootstrapFiles, params)
	};
}
//#endregion
export { resolveBootstrapContextWithProjectedHookFiles as a, resolveContextInjectionMode as c, resolveBootstrapContextForRun as i, hasCompletedBootstrapTurn as n, resolveBootstrapFilesForPreparation as o, makeBootstrapWarn as r, resolveBootstrapFilesForRun as s, FULL_BOOTSTRAP_COMPLETED_CUSTOM_TYPE as t };
