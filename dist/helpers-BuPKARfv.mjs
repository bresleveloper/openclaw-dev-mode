import { w as parseStrictPositiveInteger } from "./number-coercion-CLj0HTDM.mjs";
import { InvalidArgumentError } from "commander";
//#region src/cli/program/helpers.ts
/** Commander option collector for repeatable string flags. */
function collectOption(value, previous = []) {
	return [...previous, value];
}
/** Commander argument parser for required positive integer options. */
function parseStrictPositiveIntOption(value, flag) {
	const parsed = parseStrictPositiveInteger(value);
	if (parsed === void 0) throw new InvalidArgumentError(`${flag} must be a positive integer.`);
	return parsed;
}
//#endregion
export { parseStrictPositiveIntOption as n, collectOption as t };
