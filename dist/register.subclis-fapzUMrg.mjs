import { v as getSubCliEntriesCore } from "./argv-IYTsfFsq.mjs";
import { t as resolveCliArgvInvocation } from "./argv-invocation-DszZF2nA.mjs";
import { n as shouldEagerRegisterSubcommands } from "./command-registration-policy-DXto_g8D.mjs";
import { i as registerCommandGroups, r as registerCommandGroupByName } from "./register-command-groups-B0KGj8Ev.mjs";
import { i as buildCommandGroupEntries, n as registerSubCliByNameCore, r as registerSubCliCommandsCore } from "./register.subclis-core-Plx5Il0D.mjs";
//#region src/cli/program/register.subclis.ts
const completionEntries = buildCommandGroupEntries(getSubCliEntriesCore(), [[["completion"], async (program) => (await import("./completion-cli-DU8tm-Qt.mjs")).registerCompletionCli(program)]]);
/** Register one sub-CLI by name, including lazy command groups. */
async function registerSubCliByName(program, name, argv = process.argv, context = {}) {
	if (await registerSubCliByNameCore(program, name, argv, context)) return true;
	return registerCommandGroupByName(program, completionEntries, name);
}
/** Register sub-CLI commands according to eager/lazy startup policy. */
function registerSubCliCommands(program, argv = process.argv) {
	registerSubCliCommandsCore(program, argv);
	const { primary } = resolveCliArgvInvocation(argv);
	registerCommandGroups(program, completionEntries, {
		eager: shouldEagerRegisterSubcommands(),
		primary,
		registerPrimaryOnly: true
	});
}
//#endregion
export { registerSubCliCommands as n, registerSubCliByName as t };
