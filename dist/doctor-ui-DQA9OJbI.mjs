import { n as resolveOpenClawPackageRoot } from "./openclaw-root-CBoxhfke.mjs";
import { s as resolveRuntimeServiceBuildId } from "./version-BJGPJZu6.mjs";
import { i as runCommandWithTimeout } from "./exec-DJvyCA0D.mjs";
import { n as readInstallOwner, t as formatInstallOwnerMessage } from "./install-owner-ImshV9Dw.mjs";
import { n as ensureControlUiAssetsBuilt, o as resolveControlUiAssetHealth, r as formatControlUiSourceCommand, s as resolveControlUiDistIndexPathForRoot } from "./control-ui-assets-CIZQnoxr.mjs";
import { t as note } from "./note-Byxgt4MB.mjs";
import path from "node:path";
import fs from "node:fs/promises";
//#region src/commands/doctor-ui.ts
async function detectUiProtocolFreshnessIssues(opts = {}) {
	const root = opts.root ?? await resolveOpenClawPackageRoot({
		moduleUrl: import.meta.url,
		argv1: opts.argv1 ?? process.argv[1],
		cwd: opts.cwd ?? process.cwd()
	});
	if (!root) return [];
	const installOwner = await readInstallOwner(root);
	const uiHealth = await resolveControlUiAssetHealth({
		root,
		expectedBuildId: resolveRuntimeServiceBuildId()
	});
	const uiIndexPath = uiHealth.indexPath ?? resolveControlUiDistIndexPathForRoot(root);
	try {
		const canBuild = !installOwner && await fs.stat(path.join(root, "ui/package.json")).then(() => true, () => false);
		const issue = {
			root,
			uiIndexPath,
			canBuild,
			...installOwner ? { installOwner } : {}
		};
		if (uiHealth.kind !== "ready") return [uiHealth.kind === "stale" ? {
			...issue,
			kind: "stale-assets",
			changesSinceBuild: []
		} : {
			...issue,
			kind: "missing-assets"
		}];
		if (!canBuild) return [];
		const changesSinceBuild = await (opts.collectChangesSinceBuild ?? collectProtocolSchemaChangesSince)(root, (await fs.stat(uiIndexPath)).mtime);
		if (changesSinceBuild === null || changesSinceBuild.length === 0) return [];
		return [{
			...issue,
			kind: "stale-assets",
			changesSinceBuild
		}];
	} catch {
		return [];
	}
}
async function collectProtocolSchemaChangesSince(root, uiMtime) {
	const gitLog = await runCommandWithTimeout([
		"git",
		"-C",
		root,
		"log",
		`--since=${uiMtime.toISOString()}`,
		"--format=%h %s",
		"packages/gateway-protocol/src"
	], { timeoutMs: 5e3 }).catch(() => null);
	if (!gitLog || gitLog.code !== 0) return null;
	if (!gitLog.stdout.trim()) return [];
	return gitLog.stdout.trim().split("\n");
}
function uiProtocolFreshnessIssueToHealthFinding(issue) {
	return {
		checkId: "core/doctor/ui-protocol-freshness",
		severity: "warning",
		message: formatUiProtocolFreshnessIssue(issue),
		path: issue.uiIndexPath,
		fixHint: issue.installOwner ? formatInstallOwnerMessage(issue.installOwner) : issue.canBuild ? issue.kind === "missing-assets" ? "Run `openclaw doctor --fix` to build Control UI assets." : `Run \`openclaw doctor --fix --force\` to rebuild Control UI assets, or run \`${formatControlUiSourceCommand(issue.root, "build")}\`.` : "Reinstall OpenClaw to restore bundled Control UI assets."
	};
}
function uiProtocolFreshnessIssueToRepairEffects(issue) {
	if (!issue.canBuild) return [];
	return [{
		kind: "process",
		action: issue.kind === "missing-assets" ? "would-build-control-ui" : "would-rebuild-control-ui",
		target: issue.root,
		dryRunSafe: false
	}];
}
function formatUiProtocolFreshnessIssue(issue) {
	return [issue.kind === "missing-assets" ? "- Control UI assets are missing or incomplete." : issue.changesSinceBuild.length === 0 ? "Control UI assets do not match the current Gateway build." : `UI assets are older than the protocol schema.\nFunctional changes since last build:\n${issue.changesSinceBuild.map((line) => `- ${line}`).join("\n")}`, issue.installOwner ? formatInstallOwnerMessage(issue.installOwner) : issue.canBuild ? `- Run: ${formatControlUiSourceCommand(issue.root, "build")}` : "- Reinstall OpenClaw to restore bundled Control UI assets."].join("\n");
}
async function maybeRepairUiProtocolFreshness(runtime, prompter) {
	for (const issue of await detectUiProtocolFreshnessIssues()) {
		const stale = issue.kind === "stale-assets";
		note(formatUiProtocolFreshnessIssue(issue), stale ? "UI Freshness" : "UI");
		if (issue.installOwner) continue;
		if (!issue.canBuild) {
			note(`Skipping UI ${stale ? "rebuild" : "build"}: ui/ sources not present.`, "UI");
			continue;
		}
		if (!(stale ? await prompter.confirmAggressiveAutoFix({
			message: "Rebuild stale Control UI assets now?",
			initialValue: true
		}) : await prompter.confirmAutoFix({
			message: "Build Control UI assets now?",
			initialValue: true
		}))) continue;
		const result = await ensureControlUiAssetsBuilt(runtime, {
			root: issue.root,
			expectedBuildId: resolveRuntimeServiceBuildId(),
			force: stale,
			onBuildStart: () => note(stale ? "Rebuilding stale UI assets... (this may take a moment)" : "Building Control UI assets... (this may take a moment)", "UI")
		});
		note(result.ok ? stale ? "UI rebuild complete." : "UI build complete." : result.message ?? `UI ${stale ? "rebuild" : "build"} failed.`, "UI");
	}
}
//#endregion
export { uiProtocolFreshnessIssueToRepairEffects as i, maybeRepairUiProtocolFreshness as n, uiProtocolFreshnessIssueToHealthFinding as r, detectUiProtocolFreshnessIssues as t };
