import { a as normalizeLowercaseStringOrEmpty } from "./string-coerce-DW4mBlAt.js";
import { n as isTruthyEnvValue } from "./env-CKmI-C4z.js";
import { t as formatCliCommand } from "./command-format-2N79m0dg.js";
import { r as runCommandWithTimeout } from "./exec-CIJxrT1J.js";
import { t as note } from "./note-DXV6Ywsc.js";
import { n as runGatewayUpdate } from "./update-runner-DAKsn-dw.js";
import { t as createUpdateProgress } from "./progress-B6Pju3Ol.js";
import path from "node:path";
import fs from "node:fs/promises";
//#region src/commands/doctor-update.ts
/** Optional pre-doctor update prompt for source checkouts and package installs. */
async function resolveComparablePath(target) {
	return await fs.realpath(target).catch(() => path.resolve(target));
}
async function detectOpenClawGitCheckout(root) {
	const res = await runCommandWithTimeout([
		"git",
		"-C",
		root,
		"rev-parse",
		"--show-toplevel"
	], { timeoutMs: 5e3 }).catch(() => null);
	if (!res) return "unknown";
	if (res.code !== 0) {
		if (normalizeLowercaseStringOrEmpty(res.stderr).includes("not a git repository")) return "not-git";
		return "unknown";
	}
	return await resolveComparablePath(res.stdout.trim()) === await resolveComparablePath(root) ? "git" : "not-git";
}
/** Offers to update OpenClaw before doctor when running interactively from an updatable install. */
async function maybeOfferUpdateBeforeDoctor(params) {
	if (!(!isTruthyEnvValue(process.env.OPENCLAW_UPDATE_IN_PROGRESS) && params.options.nonInteractive !== true && params.options.yes !== true && params.options.repair !== true && process.stdin.isTTY) || !params.root) return { updated: false };
	const git = await detectOpenClawGitCheckout(params.root);
	if (git === "git") {
		if (!await params.confirm({
			message: "Update OpenClaw from git before running doctor?",
			initialValue: true
		})) return { updated: false };
		note("Running update…", "Update");
		const { progress, stop } = createUpdateProgress(process.stdout.isTTY);
		let result;
		try {
			result = await runGatewayUpdate({
				cwd: params.root,
				argv1: process.argv[1],
				progress
			});
		} finally {
			stop();
		}
		note([
			`Status: ${result.status}`,
			`Mode: ${result.mode}`,
			result.root ? `Root: ${result.root}` : null,
			result.reason ? `Reason: ${result.reason}` : null
		].filter(Boolean).join("\n"), "Update result");
		if (result.status === "ok") {
			params.outro("Update completed (doctor already ran as part of the update).");
			return {
				updated: true,
				handled: true
			};
		}
		return {
			updated: true,
			handled: false
		};
	}
	if (git === "not-git") note(["This install is not a git checkout.", `Run \`${formatCliCommand("openclaw update")}\` to update via your package manager (npm/pnpm), then rerun doctor.`].join("\n"), "Update");
	return { updated: false };
}
//#endregion
export { maybeOfferUpdateBeforeDoctor };
