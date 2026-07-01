import { C as getCoreCliCommandNames, y as getSubCliEntries } from "./argv-D0lt4C2b.js";
import { t as formatCliCommand } from "./command-format-2N79m0dg.js";
import { t as levenshteinDistance } from "./levenshtein-distance-BQbedMur.js";
//#region src/cli/program/command-suggestions.ts
const EXPLICIT_COMMAND_ALIASES = new Map([["upgrade", "update"], ["udpate", "update"]]);
const MAX_SUGGESTIONS = 3;
function uniqueSortedCommandNames(commands) {
	return [...new Set([...commands].filter(Boolean))].toSorted((left, right) => left.localeCompare(right));
}
function formatCliCommandSuggestions(input) {
	const normalizedInput = input.trim().toLowerCase();
	if (!normalizedInput) return;
	const knownCommands = uniqueSortedCommandNames([...getCoreCliCommandNames(), ...getSubCliEntries().map((entry) => entry.name)]);
	const explicitAlias = EXPLICIT_COMMAND_ALIASES.get(normalizedInput);
	if (explicitAlias && knownCommands.includes(explicitAlias)) return formatCliSuggestionLines([explicitAlias]);
	const suggestions = findCliCommandSuggestions(normalizedInput, knownCommands);
	if (suggestions.length === 0) return;
	return formatCliSuggestionLines(suggestions);
}
function findCliCommandSuggestions(input, candidates) {
	const maxDistance = Math.max(1, Math.floor(input.length * .4));
	return candidates.map((command) => ({
		command,
		distance: levenshteinDistance(input, command)
	})).filter(({ command, distance }) => command !== input && distance <= maxDistance).toSorted((left, right) => left.distance - right.distance || left.command.localeCompare(right.command)).slice(0, MAX_SUGGESTIONS).map(({ command }) => command);
}
function formatCliSuggestionLines(suggestions) {
	return `Did you mean this?\n${suggestions.map((command) => `  ${formatCliCommand(`openclaw ${command}`)}`).join("\n")}`;
}
//#endregion
export { formatCliCommandSuggestions as t };
