import { i as extractErrorCode } from "./error-coercion-CvJK4lmH.mjs";
import { o as resolveUserPath } from "./home-dir-Dc6nN6HB.mjs";
import { r as isMissingPathError } from "./errno-FR4CRyya.mjs";
import { p as shortenHomePath } from "./utils-DgZn2dLu.mjs";
import { n as formatErrorMessageWithCode } from "./errors-O33D01XW.mjs";
import { r as t } from "./i18n-Cuh2pEdZ.mjs";
import { r as resolveOnboardingWorkspaceConflict } from "./onboard-config-C_SVkFXX.mjs";
import fs from "node:fs";
import path from "node:path";
//#region src/wizard/setup.workspace.ts
function validateSetupWorkspacePath(workspaceDir) {
	let candidate = resolveUserPath(workspaceDir);
	while (true) {
		try {
			let stats = fs.lstatSync(candidate);
			if (stats.isSymbolicLink()) try {
				stats = fs.statSync(candidate);
			} catch (error) {
				if (isMissingPathError(error)) return t("wizard.setup.workspaceSymlinkNotDirectory", { path: candidate });
				throw error;
			}
			return stats.isDirectory() ? void 0 : t("wizard.setup.workspaceNotDirectory", { path: candidate });
		} catch (error) {
			if (!isMissingPathError(error)) return extractErrorCode(error) === "ELOOP" ? t("wizard.setup.workspaceSymlinkLoop", { path: candidate }) : t("wizard.setup.workspacePathError", {
				path: candidate,
				error: formatErrorMessageWithCode(error)
			});
		}
		const parent = path.dirname(candidate);
		if (parent === candidate) return t("wizard.setup.workspaceNotDirectory", { path: candidate });
		candidate = parent;
	}
}
/** Resolves a proposed setup workspace without silently remapping an existing fleet. */
async function resolveSetupWorkspaceSelection(params) {
	const workspaceError = validateSetupWorkspacePath(params.requestedWorkspaceDir);
	if (workspaceError) throw new Error(workspaceError);
	if (params.approvedWorkspaceDir && resolveUserPath(params.approvedWorkspaceDir) === resolveUserPath(params.requestedWorkspaceDir)) return {
		workspaceDir: params.requestedWorkspaceDir,
		allowWorkspaceChange: true
	};
	const conflict = params.hasAuthoredRoster === false ? void 0 : resolveOnboardingWorkspaceConflict(params.baseConfig, params.requestedWorkspaceDir);
	if (!conflict) return {
		workspaceDir: params.requestedWorkspaceDir,
		allowWorkspaceChange: false
	};
	await params.prompter.note(t("wizard.setup.workspaceConflictNotice", {
		current: shortenHomePath(conflict.currentWorkspaceDir),
		requested: shortenHomePath(conflict.requestedWorkspaceDir)
	}), t("wizard.setup.workspaceConflictTitle"));
	const allowWorkspaceChange = params.canConfirmMove !== false && await params.prompter.confirm({
		message: t("wizard.setup.workspaceConflictConfirm"),
		initialValue: false
	});
	return {
		workspaceDir: allowWorkspaceChange ? params.requestedWorkspaceDir : conflict.currentWorkspaceDir,
		allowWorkspaceChange,
		conflict
	};
}
//#endregion
export { validateSetupWorkspacePath as n, resolveSetupWorkspaceSelection as t };
