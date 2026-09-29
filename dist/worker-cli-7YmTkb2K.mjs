import { Option } from "commander";
//#region src/cli/worker-cli.ts
/** Register the restricted cloud worker runtime entry point. */
function registerWorkerCli(program) {
	program.command("worker").description("Run the restricted cloud worker runtime").addOption(new Option("--internal-worker-ipc").hideHelp()).action(async (options) => {
		const { runWorkerProcess } = await import("./worker-process-nhzGXJwX.mjs");
		await runWorkerProcess({ internalWorkerIpc: options.internalWorkerIpc === true });
	});
}
//#endregion
export { registerWorkerCli };
