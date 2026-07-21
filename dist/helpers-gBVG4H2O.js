import { b as parseStrictPositiveInteger } from "./number-coercion-CJQ8TR--.js";
import "./parse-finite-number-Z7n6tXLk.js";
import { InvalidArgumentError } from "commander";
//#region src/cli/program/helpers.ts
/** Commander option collector for repeatable string flags. */
function collectOption(value, previous = []) {
	return [...previous, value];
}
/** Parse an optional positive integer, treating empty values as unset. */
function parsePositiveIntOrUndefined(value) {
	if (value === void 0 || value === null || value === "") return;
	return parseStrictPositiveInteger(value);
}
/** Parse a positive integer without treating empty values specially. */
function parseStrictPositiveIntOrUndefined(value) {
	return parseStrictPositiveInteger(value);
}
/** Commander argument parser for required positive integer options. */
function parseStrictPositiveIntOption(value, flag) {
	const parsed = parseStrictPositiveInteger(value);
	if (parsed === void 0) throw new InvalidArgumentError(`${flag} must be a positive integer.`);
	return parsed;
}
/** Return positional args captured by a Commander action command. */
function resolveActionArgs(actionCommand) {
	if (!actionCommand) return [];
	const args = actionCommand.args;
	return Array.isArray(args) ? args : [];
}
function isDefaultOptionValue(command, name) {
	if (typeof command.getOptionValueSource !== "function") return false;
	return command.getOptionValueSource(name) === "default";
}
function appendOptionValue(out, flag, value) {
	if (value === void 0) return;
	if (value === false) {
		if (flag.startsWith("--no-")) out.push(flag);
		return;
	}
	if (value === true) {
		out.push(flag);
		return;
	}
	const arg = stringifyOptionValue(value);
	if (arg !== void 0) out.push(flag, arg);
}
function stringifyOptionValue(value) {
	if (typeof value === "string") return value;
	if (typeof value === "number" && Number.isFinite(value)) return String(value);
	if (typeof value === "bigint") return value.toString();
}
/** Reconstruct explicit option tokens from a Commander command for lazy reparsing. */
function resolveCommandOptionArgs(command) {
	if (!command) return [];
	const out = [];
	for (const option of command.options) {
		const name = option.attributeName();
		if (isDefaultOptionValue(command, name)) continue;
		const flag = option.long ?? option.short;
		if (!flag) continue;
		const value = command.getOptionValue(name);
		if (Array.isArray(value)) {
			for (const item of value) appendOptionValue(out, flag, item);
			continue;
		}
		appendOptionValue(out, flag, value);
	}
	return out;
}
//#endregion
export { resolveActionArgs as a, parseStrictPositiveIntOrUndefined as i, parsePositiveIntOrUndefined as n, resolveCommandOptionArgs as o, parseStrictPositiveIntOption as r, collectOption as t };
