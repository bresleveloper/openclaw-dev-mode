import { t as buildParseArgv } from "./argv-D0lt4C2b.js";
import { _ as uniqueStrings } from "./string-normalization-CRyoFBPt.js";
import { t as removeCommandByName } from "./command-tree-CA1ToIBK.js";
import { a as resolveActionArgs, o as resolveCommandOptionArgs } from "./helpers-gBVG4H2O.js";
//#region src/cli/program/action-reparse.ts
function getCommandPathFromRoot(command) {
	const path = [];
	let current = command;
	while (current?.parent) {
		const name = current.name();
		if (name) path.unshift(name);
		current = current.parent;
	}
	return path;
}
function buildFallbackArgv(program, actionCommand) {
	const actionArgsList = resolveActionArgs(actionCommand);
	const parentOptionArgs = actionCommand?.parent === program ? resolveCommandOptionArgs(program) : [];
	const commandPath = getCommandPathFromRoot(actionCommand);
	if (commandPath.length === 0) return [...parentOptionArgs, ...actionArgsList];
	return [
		...commandPath.slice(0, -1),
		...parentOptionArgs,
		commandPath[commandPath.length - 1],
		...actionArgsList
	];
}
function findRootCommand(cmd) {
	let current = cmd;
	while (current.parent) current = current.parent;
	return current;
}
/** Rebuild argv from Commander action args and re-run parsing after lazy registration. */
async function reparseProgramFromActionArgs(program, actionArgs) {
	const actionCommand = actionArgs.at(-1);
	const rootProgram = findRootCommand(actionCommand ?? program);
	const rawArgs = rootProgram.rawArgs;
	const fallbackArgv = buildFallbackArgv(program, actionCommand);
	const parseArgv = buildParseArgv({
		programName: rootProgram.name(),
		rawArgs,
		fallbackArgv
	});
	await rootProgram.parseAsync(parseArgv);
}
//#endregion
//#region src/cli/program/register-lazy-command.ts
/** Register a placeholder that loads the real command and reparses the original invocation. */
function registerLazyCommand({ program, name, description, options, removeNames, register }) {
	const placeholder = program.command(name).description(description);
	for (const option of options ?? []) placeholder.option(option.flags, option.description);
	placeholder.allowUnknownOption(true);
	placeholder.allowExcessArguments(true);
	placeholder.action(async (...actionArgs) => {
		const actionCommand = actionArgs.at(-1);
		if (actionCommand) actionCommand.args = [...resolveCommandOptionArgs(actionCommand), ...actionCommand.args ?? []];
		for (const commandName of new Set(removeNames ?? [name])) removeCommandByName(program, commandName);
		await register();
		await reparseProgramFromActionArgs(program, actionArgs);
	});
}
//#endregion
//#region src/cli/program/register-command-groups.ts
/** Return every command name owned by a lazy command group. */
function getCommandGroupNames(entry) {
	return entry.names ?? entry.placeholders.map((placeholder) => placeholder.name);
}
/** Find the group that owns a command name. */
function findCommandGroupEntry(entries, name) {
	return entries.find((entry) => getCommandGroupNames(entry).includes(name));
}
/** Remove all placeholder/loaded commands owned by a group before replacing it. */
function removeCommandGroupNames(program, entry) {
	for (const name of new Set(getCommandGroupNames(entry))) removeCommandByName(program, name);
}
/** Eagerly register one lazy command group by command name. */
async function registerCommandGroupByName(program, entries, name) {
	const entry = findCommandGroupEntry(entries, name);
	if (!entry) return false;
	removeCommandGroupNames(program, entry);
	await entry.register(program);
	return true;
}
/** Register one placeholder that loads and replaces its whole command group on demand. */
function registerLazyCommandGroup(program, entry, placeholder) {
	registerLazyCommand({
		program,
		name: placeholder.name,
		description: placeholder.description,
		options: placeholder.options,
		removeNames: uniqueStrings(getCommandGroupNames(entry)),
		register: async () => {
			await entry.register(program);
		}
	});
}
/** Register command groups either eagerly or as lazy placeholders for startup speed. */
function registerCommandGroups(program, entries, params) {
	if (params.eager) {
		for (const entry of entries) entry.register(program);
		return;
	}
	if (params.primary && params.registerPrimaryOnly) {
		const entry = findCommandGroupEntry(entries, params.primary);
		if (entry) {
			const placeholder = entry.placeholders.find((candidate) => candidate.name === params.primary);
			if (placeholder) registerLazyCommandGroup(program, entry, placeholder);
			return;
		}
	}
	for (const entry of entries) for (const placeholder of entry.placeholders) registerLazyCommandGroup(program, entry, placeholder);
}
//#endregion
export { registerLazyCommandGroup as a, registerCommandGroups as i, getCommandGroupNames as n, removeCommandGroupNames as o, registerCommandGroupByName as r, findCommandGroupEntry as t };
