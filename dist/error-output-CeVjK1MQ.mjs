import { L as getCoreCliCommandNamesCore, n as getCommandPathWithRootOptions, v as getSubCliEntriesCore } from "./argv-IYTsfFsq.mjs";
import { t as formatCliCommand } from "./command-format-DRYc0E-8.mjs";
import { i as stripAnsi } from "./ansi-CWsy0bu4.mjs";
import { r as theme } from "./theme-DzaUZY4q.mjs";
import { t as formatDocsLink } from "./links-B3qXeqz-.mjs";
import { t as ExpectedCliError } from "./failure-output-Cct-llrO.mjs";
import { t as levenshteinDistance } from "./levenshtein-distance-5ose6ySZ.mjs";
//#region src/cli/program/command-suggestions.ts
const EXPLICIT_COMMAND_ALIASES = /* @__PURE__ */ new Map([["upgrade", "update"], ["udpate", "update"]]);
const MAX_SUGGESTIONS = 3;
function uniqueSortedCommandNames(commands) {
	return [...new Set([...commands].filter(Boolean))].toSorted((left, right) => left.localeCompare(right));
}
function formatCliCommandSuggestions(input, commandPath = [], candidates) {
	const normalizedInput = input.trim().toLowerCase();
	if (!normalizedInput) return;
	const knownCommands = uniqueSortedCommandNames(candidates ?? (commandPath.length === 0 ? [...getCoreCliCommandNamesCore(), ...getSubCliEntriesCore().map((entry) => entry.name)] : []));
	const explicitAlias = EXPLICIT_COMMAND_ALIASES.get(normalizedInput);
	if (explicitAlias && knownCommands.includes(explicitAlias)) return formatCliSuggestionLines([explicitAlias], commandPath);
	const suggestions = findCliCommandSuggestions(normalizedInput, knownCommands);
	if (suggestions.length === 0) return;
	return formatCliSuggestionLines(suggestions, commandPath);
}
function findCliCommandSuggestions(input, candidates) {
	const maxDistance = Math.max(1, Math.floor(input.length * .4));
	return candidates.map((command) => ({
		command,
		distance: levenshteinDistance(input, command)
	})).filter(({ command, distance }) => command !== input && distance <= maxDistance).toSorted((left, right) => left.distance - right.distance || left.command.localeCompare(right.command)).slice(0, MAX_SUGGESTIONS).map(({ command }) => command);
}
function formatCliSuggestionLines(suggestions, commandPath) {
	const commandPrefix = ["openclaw", ...commandPath].join(" ");
	return `Did you mean this?\n${suggestions.map((command) => `  ${formatCliCommand(`${commandPrefix} ${command}`)}`).join("\n")}`;
}
//#endregion
//#region src/cli/program/error-output.ts
function stripCommanderErrorPrefix(raw) {
	return raw.trim().replace(/^error:\s*/i, "").trim();
}
function quote(value) {
	return `"${value}"`;
}
function resolveHelpCommand(argv, options) {
	const commandPath = options?.commandPath ?? (argv ? getCommandPathWithRootOptions(argv, 2) : []);
	if (commandPath.length === 0) return formatCliCommand("openclaw --help");
	return formatCliCommand(`openclaw ${commandPath.join(" ")} --help`);
}
function lines(...items) {
	return `${items.filter((item) => Boolean(item)).join("\n")}\n`;
}
function formatHelpHint(argv, options) {
	const command = resolveHelpCommand(argv, options);
	return `${theme.muted("Try:")} ${theme.command(command)}`;
}
function formatDocsHint() {
	return `${theme.muted("Docs:")} ${formatDocsLink("/cli", "docs.openclaw.ai/cli")}`;
}
function formatCliMachineOutput(humanOutput) {
	const docs = `Docs: ${formatDocsLink("/cli", "docs.openclaw.ai/cli", { force: false })}`;
	return stripAnsi(humanOutput).replace(/^Docs:.*$/mu, docs);
}
function formatUnknownCommandMessage(command, commandPath) {
	return commandPath.length > 0 ? `OpenClaw ${commandPath.join(" ")} has no command ${quote(command)}.` : `OpenClaw does not know the command ${quote(command)}.`;
}
function formatCliUnknownCommandOutput(command, options = {}) {
	const commandPath = options.commandPath ?? [];
	const hasParentCommand = commandPath.length > 0;
	return lines(theme.error(formatUnknownCommandMessage(command, commandPath)), formatCliCommandSuggestions(command, commandPath, options.commandNames), formatHelpHint(options.argv, { commandPath }), hasParentCommand ? void 0 : `${theme.muted("Plugin command?")} ${theme.command(formatCliCommand("openclaw plugins list"))}`, formatDocsHint());
}
function createCliParseError(raw, options = {}, errorOptions = {}) {
	const message = stripCommanderErrorPrefix(raw);
	const unknownCommand = message.match(/^unknown command ['"`](.+?)['"`]/i);
	if (unknownCommand) {
		const command = unknownCommand[1] ?? "";
		const commandPath = options.commandPath ?? [];
		const humanOutput = formatCliUnknownCommandOutput(command, options);
		return new ExpectedCliError({
			message: formatUnknownCommandMessage(command, commandPath),
			humanOutput,
			humanOutputWritten: errorOptions.humanOutputWritten,
			machineOutput: formatCliMachineOutput(humanOutput)
		});
	}
	const humanOutput = formatCliParseErrorOutput(raw, options);
	return new ExpectedCliError({
		message,
		humanOutput,
		humanOutputWritten: errorOptions.humanOutputWritten,
		machineOutput: formatCliMachineOutput(humanOutput)
	});
}
function createCliUnknownCommandError(command, options = {}) {
	const commandPath = options.commandPath ?? [];
	const humanOutput = formatCliUnknownCommandOutput(command, options);
	return new ExpectedCliError({
		message: formatUnknownCommandMessage(command, commandPath),
		humanOutput,
		machineOutput: formatCliMachineOutput(humanOutput)
	});
}
function formatOrdinaryCliParseErrorMessage(message) {
	const unknownOption = message.match(/^unknown option ['"`](.+?)['"`]/i);
	if (unknownOption) return `OpenClaw does not recognize option ${quote(unknownOption[1] ?? "")}.`;
	const missingArgument = message.match(/^missing required argument ['"`](.+?)['"`]/i);
	if (missingArgument) return `Missing required argument ${quote(missingArgument[1] ?? "")}.`;
	const missingOption = message.match(/^required option ['"`](.+?)['"`] not specified/i);
	if (missingOption) return `Missing required option ${quote(missingOption[1] ?? "")}.`;
	if (/^too many arguments\b/i.test(message)) return "Too many arguments for this command.";
	return `OpenClaw could not parse this command: ${message}`;
}
/** Convert Commander parse errors into OpenClaw-specific help and docs guidance. */
function formatCliParseErrorOutput(raw, options = {}) {
	const message = stripCommanderErrorPrefix(raw);
	const unknownCommand = message.match(/^unknown command ['"`](.+?)['"`]/i);
	if (unknownCommand) return formatCliUnknownCommandOutput(unknownCommand[1] ?? "", options);
	const output = formatOrdinaryCliParseErrorMessage(message);
	return lines(theme.error(output), formatHelpHint(options.argv, { commandPath: options.commandPath }));
}
//#endregion
export { createCliUnknownCommandError as n, formatCliParseErrorOutput as r, createCliParseError as t };
