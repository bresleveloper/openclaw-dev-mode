import { r as defaultRuntime } from "./runtime-BazLsT0s.mjs";
import { l as pathExists } from "./utils-gjJ-tD2q.mjs";
import { t as VERSION } from "./version-jg_14gWz.mjs";
import { c as normalizeUpdateChannel, d as resolveUpdateChannelDisplay } from "./update-channels-l0GQCX9n.mjs";
import { r as theme } from "./theme-DzaUZY4q.mjs";
import { s as resolveUpdateInstallIdentity } from "./update-check-hpRujh0z.mjs";
import { a as isGitCheckout, c as parseUpdateTimeoutMs, i as isEmptyDir, p as resolveUpdateRoot, u as resolveGitInstallDir } from "./shared-DRiGAorf.mjs";
import { c as readUpdateConfigFileSnapshot } from "./update-command-config-CDBhVGHw.mjs";
import { n as stylePromptMessage } from "./prompt-style-zarsDmI2.mjs";
import { n as reportHostOwnedUpdate } from "./host-owned-dJce67Ov.mjs";
import { t as selectStyled } from "./prompt-select-styled-DNEVEnJM.mjs";
import { confirm, isCancel } from "@clack/prompts";
//#region src/cli/update-cli/wizard.ts
async function updateWizardCommand(opts = {}) {
	if (!process.stdin.isTTY) {
		defaultRuntime.error("Update wizard requires a TTY. Use `openclaw update --channel <stable|extended-stable|beta|dev>` instead.");
		defaultRuntime.exit(1);
		return;
	}
	const cancel = () => {
		defaultRuntime.log(theme.muted("Update cancelled."));
		defaultRuntime.exit(0);
	};
	const timeoutMs = parseUpdateTimeoutMs(opts.timeout);
	const root = await resolveUpdateRoot();
	const [updateStatus, configSnapshot] = await Promise.all([resolveUpdateInstallIdentity({
		root,
		timeoutMs: timeoutMs ?? 3500
	}), readUpdateConfigFileSnapshot({ observe: false })]);
	if (updateStatus.installKind === "host") reportHostOwnedUpdate(updateStatus.installOwner ?? null, {});
	if (updateStatus.installKind === "immutable") {
		defaultRuntime.log("Use openclaw update for official main, or openclaw update --sha <full-sha> for an exact revision. Immutable activation runs only when explicitly enabled in the adoption record; --no-restart prepares only.");
		return;
	}
	const configChannel = configSnapshot.valid ? normalizeUpdateChannel(configSnapshot.config.update?.channel) : null;
	const channelInfo = resolveUpdateChannelDisplay({
		configChannel,
		currentVersion: VERSION,
		installKind: updateStatus.installKind,
		gitTag: updateStatus.git?.tag ?? null,
		gitBranch: updateStatus.git?.branch ?? null
	});
	const pickedChannel = await selectStyled({
		message: "Update channel",
		options: [{
			value: "keep",
			label: `Keep current (${channelInfo.channel})`,
			hint: channelInfo.label
		}, ...[
			[
				"stable",
				"Stable",
				"Tagged releases (npm latest)"
			],
			[
				"extended-stable",
				"Extended Stable",
				"Monthly supported release (npm extended-stable)"
			],
			[
				"beta",
				"Beta",
				"Prereleases (npm beta)"
			],
			[
				"dev",
				"Dev",
				"Git main"
			]
		].map(([value, label, hint]) => ({
			value,
			label,
			hint
		}))],
		initialValue: "keep"
	});
	if (typeof pickedChannel === "symbol") return cancel();
	const requestedChannel = pickedChannel === "keep" ? null : pickedChannel;
	if (requestedChannel === "dev" && updateStatus.installKind !== "git") {
		const gitDir = resolveGitInstallDir();
		if (!await isGitCheckout(gitDir)) {
			if (await pathExists(gitDir) && !await isEmptyDir(gitDir)) {
				defaultRuntime.error(`OPENCLAW_GIT_DIR points at a non-git directory: ${gitDir}. Set OPENCLAW_GIT_DIR to an empty folder or an openclaw checkout.`);
				defaultRuntime.exit(1);
				return;
			}
			const ok = await confirm({
				message: stylePromptMessage(`Create a git checkout at ${gitDir}? (override via OPENCLAW_GIT_DIR)`),
				initialValue: true
			});
			if (isCancel(ok) || !ok) return cancel();
		}
	}
	const restart = await confirm({
		message: stylePromptMessage("Restart the gateway service after update?"),
		initialValue: true
	});
	if (typeof restart === "symbol") return cancel();
	const { updateCommand } = await import("./update-command-BfCoUpxf.mjs");
	await updateCommand({
		runtimeRecoveryEnv: opts.runtimeRecoveryEnv,
		channel: requestedChannel ?? void 0,
		restart,
		timeout: opts.timeout,
		acceptCapabilities: opts.acceptCapabilities
	});
}
//#endregion
export { updateWizardCommand };
