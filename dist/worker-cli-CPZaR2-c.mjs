import { Option } from "commander";
//#region src/cli/worker-cli.ts
/** Register the restricted cloud worker runtime entry point. */
function registerWorkerCli(program) {
	program.command("worker").description("Run the restricted cloud worker runtime").addOption(new Option("--internal-worker-ipc").hideHelp()).addOption(new Option("--internal-worker-native-inference").hideHelp()).action(async (options) => {
		const { runWorkerProcess } = await import("./worker-process-DpEMU_w9.mjs");
		await runWorkerProcess({ internalWorkerIpc: options.internalWorkerIpc === true });
	});
}
//#endregion
export { registerWorkerCli };
