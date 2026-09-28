import { n as parseTcpPort } from "./tcp-port-BVV_ljmK.mjs";
//#region src/cli/shared/parse-port.ts
/** Re-export the canonical TCP port parser and limit for CLI callers. */
/** Parse a TCP port from unknown CLI/config input, returning null for invalid values. */
function parsePort(raw) {
	return parseTcpPort(raw);
}
//#endregion
export { parsePort as t };
