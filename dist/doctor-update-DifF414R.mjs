import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
import { n as isTruthyEnvValue } from "./env-BBJTTIuE.mjs";
import { t as formatCliCommand } from "./command-format-DwEdrDKL.mjs";
import { i as UPDATE_RUNNER_TIMEOUT_MS } from "./update-run-timeouts-Byb-PlTk.mjs";
import { i as runCommandWithTimeout } from "./exec-DJvyCA0D.mjs";
import { n as readInstallOwner, t as formatInstallOwnerMessage } from "./install-owner-ImshV9Dw.mjs";
import { t as note } from "./note-Byxgt4MB.mjs";
import { i as isForkUpdateBlocked } from "./fork-update-block-BNpONrZP.mjs";
import { a as isServiceRepairDeferred } from "./doctor-service-repair-policy-D8FKJEDH.mjs";
import path from "node:path";
import fs from "node:fs/promises";
//#region src/commands/doctor-update.ts
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
async function maybeOfferUpdateBeforeDoctor(params) {
	if (isForkUpdateBlocked()) return { updated: false };
	const installOwner = await readInstallOwner(params.root);
	if (installOwner) {
		note(formatInstallOwnerMessage(installOwner), "Update");
		return { updated: false };
	}
	if (!(!isTruthyEnvValue(process.env.OPENCLAW_UPDATE_IN_PROGRESS) && params.options.nonInteractive !== true && params.options.yes !== true && params.options.repair !== true && process.stdin.isTTY) || !params.root) return { updated: false };
	const git = await detectOpenClawGitCheckout(params.root);
	if (git === "git") {
		if (isServiceRepairDeferred()) {
			note("Update through the external supervisor's stop/update/finalize/restart workflow. Continuing Doctor without updating OpenClaw.", "Update");
			return { updated: false };
		}
		if (!await params.confirm({
			message: "Update OpenClaw from git before running doctor?",
			initialValue: true
		})) return { updated: false };
		const { updateCommand } = await import("./update-command-DTI3wKPM.mjs");
		let handled = false;
		let readinessReason;
		await updateCommand({
			sourceUpdate: { root: params.root },
			timeout: String(UPDATE_RUNNER_TIMEOUT_MS / 1e3),
			onResult: (result) => {
				readinessReason = result.status === "skipped" && (result.reason === "gateway-readiness-unverified" || result.reason === "still-starting") ? result.reason : void 0;
				handled = result.status === "ok" || readinessReason !== void 0;
			}
		});
		if (handled) params.outro(readinessReason ? "OpenClaw installed; Gateway readiness remains unverified. Keep recovery backups and check `openclaw gateway status --deep`." : "Update completed (doctor already ran as part of the update).");
		return {
			updated: true,
			handled,
			...readinessReason ? { reason: readinessReason } : {}
		};
	}
	if (git === "not-git") note(["This install is not a git checkout.", `Run \`${formatCliCommand("openclaw update")}\` to update via your package manager (npm/pnpm), then rerun doctor.`].join("\n"), "Update");
	return { updated: false };
}
//#endregion
export { maybeOfferUpdateBeforeDoctor };
