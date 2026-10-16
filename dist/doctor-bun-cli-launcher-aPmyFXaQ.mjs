import { t as quoteCliArg } from "./quote-cli-arg-BEt71TUh.mjs";
import { n as resolveBunGlobalInstallOwner } from "./detect-package-manager-DsIv0glm.mjs";
import { t as note } from "./note-Byxgt4MB.mjs";
import { n as inspectBunCliLauncher, o as resolveBunGlobalBinDir, r as installBunCliLauncher, t as getBunCliLauncherPathIssue } from "./bun-cli-launcher-B-XyqX49.mjs";
import fs from "node:fs";
import path from "node:path";
//#region src/commands/doctor-bun-cli-launcher.ts
function hasPersistentNode() {
	for (const directory of (process.env.PATH ?? "").split(path.delimiter)) {
		const executable = path.resolve(directory || ".", "node");
		try {
			fs.accessSync(executable, fs.constants.X_OK);
			if (!fs.statSync(executable).isFile()) continue;
			if (/^bun-node-(?:[0-9a-f]+|[0-9]+-(?:[0-9a-f]+|debug)(?:-[0-9a-f]{16})?)$/u.test(path.basename(path.dirname(executable))) && fs.realpathSync(executable) === fs.realpathSync(process.execPath)) continue;
			return true;
		} catch {}
	}
	return false;
}
async function noteBunCliLauncherIssues(params) {
	if (!params.root || !process.versions.bun || process.platform === "win32" || params.prompter.repairMode.updateInProgress || hasPersistentNode()) return;
	const owner = resolveBunGlobalInstallOwner(params.root);
	if (!owner) return;
	const entryPath = path.join(params.root, "openclaw.mjs");
	const pathIssue = getBunCliLauncherPathIssue({
		bunPath: process.execPath,
		entryPath
	});
	if (pathIssue) {
		const command = `${quoteCliArg(process.execPath)} ${quoteCliArg(entryPath)}`;
		note(`${pathIssue}. Run ${command} instead.`, "Bun CLI launcher");
		return;
	}
	try {
		const binDir = resolveBunGlobalBinDir({
			bunPath: process.execPath,
			cwd: owner.globalProjectRoot,
			env: {
				...process.env,
				BUN_INSTALL_GLOBAL_DIR: owner.globalProjectRoot,
				...owner.bunInstall ? { BUN_INSTALL: owner.bunInstall } : {}
			}
		});
		const launcher = {
			packageRoot: params.root,
			bunPath: process.execPath,
			binDir
		};
		const inspection = inspectBunCliLauncher(launcher);
		if (inspection.state === "current") return;
		if (inspection.state === "conflict") {
			note(`The openclaw command at ${inspection.path} belongs to another installation. Resolve the conflicting command before repairing this Bun installation.`, "Bun CLI launcher");
			return;
		}
		note(`The Bun CLI launcher is ${inspection.state}: ${inspection.path}. The openclaw command needs a launcher that uses this installation's Bun executable.`, "Bun CLI launcher");
		if (!await params.prompter.confirmAutoFix({
			message: "Repair the openclaw command for this Bun installation?",
			initialValue: false
		})) return;
		const installed = installBunCliLauncher(launcher);
		note(`Repaired the Bun CLI launcher: ${installed.path}`, "Bun CLI launcher");
	} catch (error) {
		note(`Could not repair the Bun CLI launcher: ${error instanceof Error ? error.message : String(error)}. Run Doctor with --fix through this package's Bun entry point after resolving the problem.`, "Bun CLI launcher");
	}
}
//#endregion
export { noteBunCliLauncherIssues };
