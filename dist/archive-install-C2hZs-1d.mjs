import { t as formatErrorMessage } from "./errors-DPfGDWk1.mjs";
import { t as createSubsystemLogger } from "./subsystem-mStysHHC.mjs";
import { d as pathExists } from "./fs-safe-6Z4UiMS4.mjs";
import { i as getAgentWorkspaceAccess, t as WorkspaceAccessUnavailableError } from "./workspace-access-sFz3TNTx.mjs";
import { n as resolveWorkspaceSkillInstallDir } from "./install-paths-CdlkBGI2.mjs";
import { t as checkClawHubSkillPlanAtPath } from "./skill-tree-digest-DSQ1SW2C.mjs";
import { a as resolvePackageDirInstallTransaction, i as requestDeferredPackageDirInstall, r as installPackageDir } from "./install-package-dir-CWKW8ewy.mjs";
import { t as evaluateSkillInstallPolicy } from "./install-security-scan-w6F7ef4V.mjs";
import { i as snapshotCommittedSkillArtifactBestEffort, n as hasCommittedSkillChangeHooks, r as resolveCommittedSkillChangeSource, t as dispatchCommittedSkillChangeBestEffort } from "./skill-change-hook-CBGJbIIJ.mjs";
import { n as withExtractedArchiveRoot } from "./install-flow-BW-XNoSb.mjs";
import path from "node:path";
//#region src/skills/lifecycle/archive-install.ts
const DEFAULT_SKILL_ARCHIVE_ROOT_MARKERS = ["SKILL.md"];
const log = createSubsystemLogger("skills");
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
	return lower.startsWith("failed to install skill:") || TRANSIENT_ARCHIVE_ERROR_PATTERNS.some((pattern) => lower.includes(pattern)) ? "unavailable" : "invalid-request";
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
		if (params.deferCommit && access) throw new WorkspaceAccessUnavailableError("Transactional ClawHub skill replacement is unavailable for a remote workspace");
		const applyRoot = access?.applySkillRoot ?? applyExtractedSkillRoot;
		const { policy: _policy, ...files } = params;
		params.beforePersistentApply?.();
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
				params.beforePersistentApply?.();
				return scanResult?.blocked ? {
					error: scanResult.blocked.reason,
					failureKind: scanResult.blocked.code === "security_scan_failed" ? "unavailable" : "invalid-request"
				} : void 0;
			}
		});
		if (!result.ok) return result;
		const publishChange = async () => {
			try {
				const { refreshSkillsDiscovery } = await import("./refresh-C3a1Ipyv.mjs");
				await refreshSkillsDiscovery({
					workspaceDir: params.workspaceDir,
					config: params.policy?.config
				});
			} catch (error) {
				log.warn(`Skill installed, but discovery refresh failed: ${formatErrorMessage(error)}`);
			}
			if (captureChanges) await dispatchCommittedSkillChangeBestEffort({
				action: result.mode === "update" ? "updated" : "created",
				source: changeSource,
				workspaceDir: params.workspaceDir,
				before: result.before,
				after: result.after,
				logger: params.logger
			});
		};
		const transaction = result.transaction;
		if (!transaction) await publishChange();
		return {
			ok: true,
			targetDir: result.targetDir,
			...transaction ? { transaction: {
				commit: async (assertCurrent) => {
					await transaction.commit(assertCurrent);
					await publishChange();
				},
				rollback: (assertCurrent) => transaction.rollback(assertCurrent)
			} } : {}
		};
	} catch (err) {
		return installFailure(formatErrorMessage(err), "unavailable");
	}
}
/** Native file replacement on the workspace host; policy and hook dispatch stay with the caller. */
async function applyExtractedSkillRoot(params) {
	try {
		if (params.deferCommit && !params.assertOwned) return installFailure("Deferred skill replacement requires a live owner guard.", "invalid-request");
		if (!await hasSkillArchiveRoot(params.extractedRoot, params.rootMarkers ?? DEFAULT_SKILL_ARCHIVE_ROOT_MARKERS)) return installFailure("archive is missing SKILL.md", "invalid-request");
		let targetDir;
		try {
			targetDir = resolveWorkspaceSkillInstallDir(params.workspaceDir, params.slug);
		} catch (err) {
			return installFailure(formatErrorMessage(err), "invalid-request");
		}
		const targetExists = await pathExists(targetDir);
		if (params.deferCommit && params.expectedClawHubState && !targetExists) return installFailure("Guarded skill update target disappeared.", "invalid-request");
		const effectiveMode = params.mode === "update" && targetExists ? "update" : "install";
		if (params.mode === "install" && targetExists) return installFailure(`Skill already exists at ${targetDir}. Re-run with force/update.`, "invalid-request");
		const snapshot = (changes, includeSourceVersion = false) => snapshotCommittedSkillArtifactBestEffort({
			skillDir: targetDir,
			skillKey: params.slug,
			source: changes.source,
			...includeSourceVersion ? { sourceVersion: changes.sourceVersion } : {},
			logger: params.logger
		});
		const before = params.changes && effectiveMode === "update" ? await snapshot(params.changes) : void 0;
		const policyFailure = await params.beforeInstall?.(effectiveMode);
		if (policyFailure) return installFailure(policyFailure.error, policyFailure.failureKind);
		const expectedClawHubState = params.expectedClawHubState;
		let replacementBlocked;
		const installParams = {
			sourceDir: params.extractedRoot,
			targetDir,
			mode: effectiveMode,
			timeoutMs: params.timeoutMs ?? 12e4,
			logger: params.logger,
			copyErrorPrefix: "failed to install skill",
			beforePersistentApply: params.beforePersistentApply,
			authorizeMutation: params.authorizeMutation,
			requireExistingTarget: Boolean(params.deferCommit && expectedClawHubState),
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
		};
		const install = await installPackageDir(params.deferCommit ? requestDeferredPackageDirInstall(installParams, params.assertOwned) : installParams);
		if (!install.ok) return {
			...installFailure(install.error, replacementBlocked ? "invalid-request" : "unavailable"),
			...replacementBlocked ? { replacementBlocked } : {},
			...install.recoveryIncomplete ? { recoveryIncomplete: true } : {}
		};
		const transaction = resolvePackageDirInstallTransaction(install);
		if (params.deferCommit && !transaction) return {
			...installFailure("Transactional skill replacement did not return a receipt.", "unavailable"),
			recoveryIncomplete: true
		};
		const after = params.changes ? await snapshot(params.changes, true) : void 0;
		return {
			ok: true,
			targetDir,
			mode: effectiveMode,
			before,
			after,
			...transaction ? { transaction } : {}
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
			policy: params.policy,
			beforePersistentApply: params.beforePersistentApply
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
