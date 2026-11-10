import { T as normalizeExecutableToken, d as isShellWrapperExecutable, p as resolveShellWrapperTransportArgv, t as POSIX_PARSEABLE_SHELL_WRAPPERS } from "./shell-wrapper-resolution-kxOrsoTv.mjs";
//#region src/infra/command-explainer/format.ts
function spanToCommandSpan(span) {
	if (!Number.isSafeInteger(span.startIndex) || !Number.isSafeInteger(span.endIndex)) return null;
	if (span.startIndex < 0 || span.endIndex <= span.startIndex) return null;
	return {
		startIndex: span.startIndex,
		endIndex: span.endIndex
	};
}
function isUnsupportedShellWrapperArgv(argv) {
	const executable = (resolveShellWrapperTransportArgv([...argv]) ?? argv)[0];
	if (!executable) return false;
	const normalizedExecutable = normalizeExecutableToken(executable);
	return isShellWrapperExecutable(normalizedExecutable) && !POSIX_PARSEABLE_SHELL_WRAPPERS.has(normalizedExecutable);
}
/** Converts a parsed command explanation into source spans suitable for approval UI. */
function formatCommandSpans(explanation) {
	if (explanation.topLevelCommands.some((command) => isUnsupportedShellWrapperArgv(command.argv))) return [];
	const commandSpans = [];
	for (const command of [...explanation.topLevelCommands, ...explanation.nestedCommands]) {
		const commandSpan = spanToCommandSpan(command.executableSpan);
		if (commandSpan) commandSpans.push(commandSpan);
	}
	return commandSpans;
}
//#endregion
export { isUnsupportedShellWrapperArgv as n, formatCommandSpans as t };
