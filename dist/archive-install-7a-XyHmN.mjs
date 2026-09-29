import { d as pathExists } from "./fs-safe-BAPek8At.mjs";
import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { i as getAgentWorkspaceAccess, t as WorkspaceAccessUnavailableError } from "./workspace-access-BNUXOhfF.mjs";
import { r as installPackageDir } from "./install-package-dir-DZA6fMda.mjs";
import { t as evaluateSkillInstallPolicy } from "./install-security-scan-jk08Rpmf.mjs";
import { n as resolveWorkspaceSkillInstallDir } from "./install-paths-DBBNLgEr.mjs";
import { t as checkClawHubSkillPlanAtPath } from "./skill-tree-digest-DQM6dl_F.mjs";
import { i as snapshotCommittedSkillArtifactBestEffort, n as hasCommittedSkillChangeHooks, r as resolveCommittedSkillChangeSource, t as dispatchCommittedSkillChangeBestEffort } from "./skill-change-hook-B1sraZ1j.mjs";
import { n as withExtractedArchiveRoot } from "./install-flow-C5F-D6Ey.mjs";
import path from "node:path";
//#region src/skills/lifecycle/archive-install.ts
const DEFAULT_SKILL_ARCHIVE_ROOT_MARKERS = ["SKILL.md"];
/** Accepted root marker names for ClawHub skill archive uploads. */
const CLAWHUB_SKILL_ARCHIVE_ROOT_MARKERS = [
	"SKILL.md",
	"skill.md",
	"skills.md",
	"SKILL.MD"
];
function installFailure(error, failureKind) {
	return {
		ok: false,
		error,
		failureKind
	};
}
async function hasSkillArchiveRoot(rootDir, rootMarkers) {
	for (const candidate of rootMarkers) if (await pathExists(path.join(rootDir, candidate))) return true;
	return false;
}
function scanBlockedFailureKind(blocked) {
	return blocked.code === "security_scan_failed" ? "unavailable" : "invalid-request";
}
const TRANSIENT_ARCHIVE_ERROR_PATTERNS = [
	"enoent",
	"enospc",
	"eio",
	"eacces",
	"eperm",
	"ebusy",
	"emfile",
	"enfile",
	"timeout",
	"timed out"
];
function archiveFailureKind(error) {
	const lower = error.toLowerCase();
	if (lower.startsWith("failed to install skill:")) return "unavailable";
	for (const pattern of TRANSIENT_ARCHIVE_ERROR_PATTERNS) if (lower.includes(pattern)) return "unavailable";
	return "invalid-request";
}
async function installExtractedSkillRoot(params) {
	try {
		const changeSource = resolveCommittedSkillChangeSource(params.policy?.origin.type);
		const sourceVersionValue = params.policy?.origin.version ?? params.policy?.origin.commit;
		const sourceVersion = typeof sourceVersionValue === "string" || typeof sourceVersionValue === "number" ? String(sourceVersionValue) : void 0;
		const captureChanges = hasCommittedSkillChangeHooks();
		const workspaceAccess = getAgentWorkspaceAccess(params.workspaceDir, "loadSkills");
		const access = workspaceAccess?.loadSkills ? workspaceAccess : void 0;
		if (access && !access.applySkillRoot) throw new WorkspaceAccessUnavailableError("Remote workspace skill installation is unavailable");
		const applyRoot = access?.applySkillRoot ?? applyExtractedSkillRoot;
		const { policy: _policy, ...files } = params;
		const result = await applyRoot({
			...files,
			...captureChanges ? { changes: {
				source: changeSource,
				sourceVersion
			} } : {},
			beforeInstall: async (mode) => {
				if (!params.policy) return;
				const scanResult = await evaluateSkillInstallPolicy({
					config: params.policy.config,
					onInstallPolicyWarning: params.policy.onInstallPolicyWarning,
					installId: params.policy.installId ?? "archive",
					logger: params.logger ?? {},
					origin: params.policy.origin,
					requestedSpecifier: params.policy.requestedSpecifier,
					source: params.policy.source,
					mode,
					skillName: params.slug,
					sourceDir: params.extractedRoot
				});
				return scanResult?.blocked ? {
					error: scanResult.blocked.reason,
					failureKind: scanBlockedFailureKind(scanResult.blocked)
				} : void 0;
			}
		});
		if (!result.ok) return result;
		if (captureChanges) await dispatchCommittedSkillChangeBestEffort({
			action: result.mode === "update" ? "updated" : "created",
			source: changeSource,
			workspaceDir: params.workspaceDir,
			before: result.before,
			after: result.after,
			logger: params.logger
		});
		return {
			ok: true,
			targetDir: result.targetDir
		};
	} catch (err) {
		return installFailure(formatErrorMessage(err), "unavailable");
	}
}
/** Native file replacement on the workspace host; policy and hook dispatch stay with the caller. */
async function applyExtractedSkillRoot(params) {
	try {
		if (!await hasSkillArchiveRoot(params.extractedRoot, params.rootMarkers ?? DEFAULT_SKILL_ARCHIVE_ROOT_MARKERS)) return installFailure("archive is missing SKILL.md", "invalid-request");
		let targetDir;
		try {
			targetDir = resolveWorkspaceSkillInstallDir(params.workspaceDir, params.slug);
		} catch (err) {
			return installFailure(formatErrorMessage(err), "invalid-request");
		}
		const targetExists = await pathExists(targetDir);
		const effectiveMode = params.mode === "update" && targetExists ? "update" : "install";
		if (params.mode === "install" && targetExists) return installFailure(`Skill already exists at ${targetDir}. Re-run with force/update.`, "invalid-request");
		const before = params.changes && effectiveMode === "update" ? await snapshotCommittedSkillArtifactBestEffort({
			skillDir: targetDir,
			skillKey: params.slug,
			source: params.changes.source,
			logger: params.logger
		}) : void 0;
		const policyFailure = await params.beforeInstall?.(effectiveMode);
		if (policyFailure) return installFailure(policyFailure.error, policyFailure.failureKind);
		const expectedClawHubState = params.expectedClawHubState;
		let replacementBlocked;
		const install = await installPackageDir({
			sourceDir: params.extractedRoot,
			targetDir,
			mode: effectiveMode,
			timeoutMs: params.timeoutMs ?? 12e4,
			logger: params.logger,
			copyErrorPrefix: "failed to install skill",
			hasDeps: false,
			depsLogMessage: "",
			...expectedClawHubState !== void 0 ? { afterBackup: async (backupDir) => {
				const current = expectedClawHubState ? await checkClawHubSkillPlanAtPath(expectedClawHubState, backupDir) : {
					ok: false,
					error: `Skill ${JSON.stringify(params.slug)} appeared during update.`
				};
				replacementBlocked = current.ok ? void 0 : `${current.error} Updating replaces the installed skill directory.`;
				return replacementBlocked ? {
					ok: false,
					error: replacementBlocked
				} : { ok: true };
			} } : {}
		});
		if (!install.ok) return {
			...installFailure(install.error, replacementBlocked ? "invalid-request" : "unavailable"),
			...replacementBlocked ? { replacementBlocked } : {}
		};
		const after = params.changes ? await snapshotCommittedSkillArtifactBestEffort({
			skillDir: targetDir,
			skillKey: params.slug,
			source: params.changes.source,
			sourceVersion: params.changes.sourceVersion,
			logger: params.logger
		}) : void 0;
		return {
			ok: true,
			targetDir,
			mode: effectiveMode,
			before,
			after
		};
	} catch (err) {
		return installFailure(formatErrorMessage(err), "unavailable");
	}
}
async function installSkillArchiveFromPath(params) {
	const result = await withExtractedArchiveRoot({
		archivePath: params.archivePath,
		tempDirPrefix: "openclaw-skill-archive-",
		timeoutMs: params.timeoutMs ?? 12e4,
		logger: params.logger,
		rootMarkers: ["SKILL.md"],
		onExtracted: async (rootDir) => await installExtractedSkillRoot({
			workspaceDir: params.workspaceDir,
			slug: params.slug,
			extractedRoot: rootDir,
			mode: params.force ? "update" : "install",
			timeoutMs: params.timeoutMs,
			logger: params.logger,
			policy: params.policy
		})
	});
	if (!result.ok) {
		const error = result.error.includes("unexpected archive layout") ? "archive is missing SKILL.md" : result.error;
		return installFailure(error, "failureKind" in result && (result.failureKind === "invalid-request" || result.failureKind === "unavailable") ? result.failureKind : archiveFailureKind(error));
	}
	return result;
}
//#endregion
export { installSkillArchiveFromPath as i, applyExtractedSkillRoot as n, installExtractedSkillRoot as r, CLAWHUB_SKILL_ARCHIVE_ROOT_MARKERS as t };
