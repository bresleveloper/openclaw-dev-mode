//#region src/cli/quote-cli-arg.ts
function quotePowerShellArg(value) {
	return `'${value.replace(/['‘-‛]/gu, "$&$&")}'`;
}
function quoteCliArg(value) {
	if (/^[A-Za-z0-9_/:=.,@%+-]+$/.test(value)) return value;
	return `'${value.replaceAll("'", "'\\''")}'`;
}
//#endregion
export { quotePowerShellArg as n, quoteCliArg as t };
