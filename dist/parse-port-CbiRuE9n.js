import { n as parseTcpPort } from "./tcp-port-DPgvEEt3.js";
//#region src/cli/shared/parse-port.ts
/** Parse a TCP port from unknown CLI/config input, returning null for invalid values. */
function parsePort(raw) {
	return parseTcpPort(raw);
}
//#endregion
export { parsePort as t };
