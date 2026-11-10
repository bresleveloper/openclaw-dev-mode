import { w as parseStrictPositiveInteger } from "./number-coercion-CkhMiRw8.mjs";
//#region src/cli/logs-cli.options.ts
function parseLogsPositiveInt(value, fallback, flag) {
	if (value === void 0) return fallback;
	const parsed = parseStrictPositiveInteger(value);
	if (parsed === void 0) throw new Error(`${flag} must be a positive integer.`);
	return parsed;
}
//#endregion
export { parseLogsPositiveInt as t };
