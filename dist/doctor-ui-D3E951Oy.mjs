import { n as resolveOpenClawPackageRoot } from "./openclaw-root-Cur9Uhkp.mjs";
import { s as resolveRuntimeServiceBuildId } from "./version-BkM1aB4w.mjs";
import { i as runCommandWithTimeout } from "./exec-shcN2-sN.mjs";
import { n as ensureControlUiAssetsBuilt, o as resolveControlUiAssetHealth, r as formatControlUiSourceCommand, s as resolveControlUiDistIndexPathForRoot } from "./control-ui-assets-C3-n9r4b.mjs";
import { t as note } from "./note-UlSlsJKw.mjs";
import path from "node:path";
import fs from "node:fs/promises";
//#region src/commands/doctor-ui.ts
/** Doctor checks and repairs Control UI build identity and protocol freshness. */
/** Detects unusable installed UI assets and subsequent source protocol changes. */
async function detectUiProtocolFreshnessIssues(opts = {}) {
	const root = opts.root ?? await resolveOpenClawPackageRoot({
		moduleUrl: import.meta.url,
		argv1: opts.argv1 ?? process.argv[1],
		cwd: opts.cwd ?? process.cwd()
	});
	if (!root) return [];
	const uiHealth = await resolveControlUiAssetHealth({
		root,
		expectedBuildId: resolveRuntimeServiceBuildId()
	});
	const uiIndexPath = uiHealth.indexPath ?? resolveControlUiDistIndexPathForRoot(root);
	try {
		const canBuild = await fs.stat(path.join(root, "ui/package.json")).then(() => true, () => false);
		const issue = {
			root,
			uiIndexPath,
			canBuild
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
/** Converts a UI protocol freshness issue into a doctor lint health finding. */
function uiProtocolFreshnessIssueToHealthFinding(issue) {
	return {
		checkId: "core/doctor/ui-protocol-freshness",
		severity: "warning",
		message: formatUiProtocolFreshnessIssue(issue),
		path: issue.uiIndexPath,
		fixHint: issue.canBuild ? issue.kind === "missing-assets" ? "Run `openclaw doctor --fix` to build Control UI assets." : `Run \`openclaw doctor --fix --force\` to rebuild Control UI assets, or run \`${formatControlUiSourceCommand(issue.root, "build")}\`.` : "Reinstall OpenClaw to restore bundled Control UI assets."
	};
}
/** Converts a UI freshness issue into the process repair effect used by lint dry runs. */
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
	return [issue.kind === "missing-assets" ? "- Control UI assets are missing or incomplete." : issue.changesSinceBuild.length === 0 ? "Control UI assets do not match the current Gateway build." : `UI assets are older than the protocol schema.\nFunctional changes since last build:\n${issue.changesSinceBuild.map((line) => `- ${line}`).join("\n")}`, issue.canBuild ? `- Run: ${formatControlUiSourceCommand(issue.root, "build")}` : "- Reinstall OpenClaw to restore bundled Control UI assets."].join("\n");
}
/** Prompts to build or rebuild Control UI assets when doctor detects missing or stale output. */
async function maybeRepairUiProtocolFreshness(runtime, prompter) {
	for (const issue of await detectUiProtocolFreshnessIssues()) {
		const stale = issue.kind === "stale-assets";
		note(formatUiProtocolFreshnessIssue(issue), stale ? "UI Freshness" : "UI");
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
