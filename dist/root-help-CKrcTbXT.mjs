import { I as getCoreCliCommandDescriptors, v as getSubCliEntriesCore } from "./argv-IYTsfFsq.mjs";
import { t as VERSION } from "./version-BkM1aB4w.mjs";
import { c as collectUniqueCommandDescriptors, s as addCommandDescriptorsToProgram } from "./manifest-DHkEL08H.mjs";
import { n as formatProgramHelpOutput, t as configureProgramHelp } from "./help-6XD0RtcW.mjs";
import { t as getPluginCliCommandDescriptors } from "./cli-root-descriptors-aleztF8K.mjs";
import { Command } from "commander";
//#region src/cli/program/root-help.ts
async function buildRootHelpProgram(renderOptions) {
	const program = new Command();
	const pluginDescriptors = renderOptions?.includePluginDescriptors === true || renderOptions?.config ? await getPluginCliCommandDescriptors(renderOptions.config, renderOptions.env, { pluginSdkResolution: renderOptions.pluginSdkResolution }) : [];
	configureProgramHelp(program, { programVersion: VERSION }, { commandsWithSubcommands: new Set(pluginDescriptors.filter((descriptor) => descriptor.hasSubcommands).map((descriptor) => descriptor.name)) });
	addCommandDescriptorsToProgram(program, collectUniqueCommandDescriptors([
		getCoreCliCommandDescriptors(),
		getSubCliEntriesCore(),
		pluginDescriptors
	]));
	return program;
}
/** Render root help text for tests, docs, and command output. */
async function renderRootHelpText(renderOptions) {
	const program = await buildRootHelpProgram(renderOptions);
	let output = "";
	program.configureOutput({ writeOut: (chunk) => output += formatProgramHelpOutput(chunk) });
	program.outputHelp();
	return output;
}
/** Write rendered root help directly to stdout. */
async function outputRootHelp(renderOptions) {
	process.stdout.write(await renderRootHelpText(renderOptions));
}
//#endregion
export { outputRootHelp };
