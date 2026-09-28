import { r as defaultRuntime } from "./runtime-BC29JSZp.mjs";
import { l as pathExists } from "./utils-aKqR_F_U.mjs";
import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { t as VERSION } from "./version-BkM1aB4w.mjs";
import { c as normalizeUpdateChannel, f as resolveUpdateChannelDisplay } from "./update-channels-BDINqyML.mjs";
import { r as theme } from "./theme-DzaUZY4q.mjs";
import { c as readConfigFileSnapshot } from "./io.runtime-CZWcIUDk.mjs";
import "./config-DryArA1l.mjs";
import { s as resolveUpdateInstallIdentity } from "./update-check-CtYi2ZDp.mjs";
import { a as isEmptyDir, c as parseTimeoutMsOrExit, d as resolveGitInstallDir, m as resolveUpdateRoot, o as isGitCheckout } from "./shared-OuJSSGTT.mjs";
import { n as stylePromptMessage } from "./prompt-style-zarsDmI2.mjs";
import { t as selectStyled } from "./prompt-select-styled-Bv34-Wgx.mjs";
import { confirm, isCancel } from "@clack/prompts";
//#region src/cli/update-cli/wizard.ts
/** Run the TTY-only update wizard and preserve `updateCommand` as the single update executor. */
async function updateWizardCommand(opts = {}) {
	if (!process.stdin.isTTY) {
		defaultRuntime.error("Update wizard requires a TTY. Use `openclaw update --channel <stable|extended-stable|beta|dev>` instead.");
		defaultRuntime.exit(1);
		return;
	}
	const timeoutMs = parseTimeoutMsOrExit(opts.timeout);
	if (timeoutMs === null) return;
	const root = await resolveUpdateRoot();
	const [updateStatus, configSnapshot] = await Promise.all([resolveUpdateInstallIdentity({
		root,
		timeoutMs: timeoutMs ?? 3500
	}), readConfigFileSnapshot({ observe: false })]);
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
		options: [
			{
				value: "keep",
				label: `Keep current (${channelInfo.channel})`,
				hint: channelInfo.label
			},
			{
				value: "stable",
				label: "Stable",
				hint: "Tagged releases (npm latest)"
			},
			{
				value: "extended-stable",
				label: "Extended Stable",
				hint: "Monthly supported release (npm extended-stable)"
			},
			{
				value: "beta",
				label: "Beta",
				hint: "Prereleases (npm beta)"
			},
			{
				value: "dev",
				label: "Dev",
				hint: "Git main"
			}
		],
		initialValue: "keep"
	});
	if (typeof pickedChannel === "symbol") {
		defaultRuntime.log(theme.muted("Update cancelled."));
		defaultRuntime.exit(0);
		return;
	}
	const requestedChannel = pickedChannel === "keep" ? null : pickedChannel;
	if (requestedChannel === "dev" && updateStatus.installKind !== "git") {
		const gitDir = resolveGitInstallDir();
		if (!await isGitCheckout(gitDir)) {
			if (await pathExists(gitDir)) {
				if (!await isEmptyDir(gitDir)) {
					defaultRuntime.error(`OPENCLAW_GIT_DIR points at a non-git directory: ${gitDir}. Set OPENCLAW_GIT_DIR to an empty folder or an openclaw checkout.`);
					defaultRuntime.exit(1);
					return;
				}
			}
			const ok = await confirm({
				message: stylePromptMessage(`Create a git checkout at ${gitDir}? (override via OPENCLAW_GIT_DIR)`),
				initialValue: true
			});
			if (isCancel(ok) || !ok) {
				defaultRuntime.log(theme.muted("Update cancelled."));
				defaultRuntime.exit(0);
				return;
			}
		}
	}
	const restart = await confirm({
		message: stylePromptMessage("Restart the gateway service after update?"),
		initialValue: true
	});
	if (typeof restart === "symbol") {
		defaultRuntime.log(theme.muted("Update cancelled."));
		defaultRuntime.exit(0);
		return;
	}
	try {
		const { updateCommand } = await import("./update-command-DLoaP82q.mjs");
		await updateCommand({
			runtimeRecoveryEnv: opts.runtimeRecoveryEnv,
			channel: requestedChannel ?? void 0,
			restart,
			timeout: opts.timeout,
			acceptCapabilities: opts.acceptCapabilities
		});
	} catch (err) {
		defaultRuntime.error(formatErrorMessage(err));
		defaultRuntime.exit(1);
	}
}
//#endregion
export { updateWizardCommand };
