import { t as ExitError } from "./runtime-BazLsT0s.mjs";
import { t as formatErrorMessage } from "./errors-DPfGDWk1.mjs";
import { t as formatCliCommand } from "./command-format-CYoE8cOC.mjs";
import { r as isTerminalInteractive } from "./terminal-interactivity-D92bdO16.mjs";
//#region src/cli/invalid-config-recovery.ts
/** Offer a consent-gated doctor repair, then retry the failed operation once. */
async function offerInvalidConfigRecovery(params) {
	const command = formatCliCommand("openclaw doctor --fix");
	const printCommand = () => {
		params.runtime.error(`Run "${command}" to repair the config, then retry.`);
	};
	if (!isTerminalInteractive()) {
		printCommand();
		return { status: "declined" };
	}
	const { promptYesNo } = await import("./prompt-DtQCkeUH.mjs");
	if (!await promptYesNo(`Run "${command}" now?`, true)) {
		printCommand();
		return { status: "declined" };
	}
	try {
		const { doctorCommand } = await import("./doctor-BaPKVYp3.mjs");
		await doctorCommand(params.runtime, { repair: true });
	} catch (error) {
		if (error instanceof ExitError) throw error;
		params.runtime.error(`Failed to run "${command}": ${formatErrorMessage(error)}`);
		return { status: "retry-failed" };
	}
	try {
		return {
			status: "recovered",
			value: await params.retry()
		};
	} catch (error) {
		const { isInvalidConfigError } = await import("./io.invalid-config-CtEG7cba.mjs");
		if (!isInvalidConfigError(error)) throw error;
		params.runtime.error(`Config is still invalid after "${command}":`);
		params.runtime.error(formatErrorMessage(error));
		return { status: "retry-failed" };
	}
}
//#endregion
export { offerInvalidConfigRecovery };
