import { w as parseStrictPositiveInteger } from "./number-coercion-CuVhdCBs.mjs";
//#region src/infra/tcp-port.ts
const MAX_TCP_PORT = 65535;
/** Parse a positive TCP port or return null for absent/invalid input. */
function parseTcpPort(raw) {
	const parsed = parseStrictPositiveInteger(raw);
	if (parsed === void 0 || parsed > 65535) return null;
	return parsed;
}
/** Extract the effective `--port` value from command arguments. */
function parseTcpPortFromArgs(programArguments) {
	if (!programArguments?.length) return null;
	let latestPort = null;
	for (let index = 0; index < programArguments.length; index += 1) {
		const argument = programArguments[index];
		let value;
		if (argument === "--port") value = programArguments[++index];
		else if (argument?.startsWith("--port=")) value = argument.slice(7);
		latestPort = parseTcpPort(value) ?? latestPort;
	}
	return latestPort;
}
//#endregion
export { parseTcpPort as n, parseTcpPortFromArgs as r, MAX_TCP_PORT as t };
