import { c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
import "./string-coerce-runtime-BiZzULo_.js";
//#region extensions/browser/src/browser/bridge-auth-registry.ts
/**
* Ephemeral auth registry for loopback browser bridge servers.
*
* Dynamic sandbox/host ports need auth lookup without persisting tokens in
* config files, so callers store credentials only for the current process.
*/
const authByPort = /* @__PURE__ */ new Map();
/** Store auth material for a loopback bridge port in the current process. */
function setBridgeAuthForPort(port, auth) {
	if (!Number.isFinite(port) || port <= 0) return;
	const token = normalizeOptionalString(auth.token) ?? "";
	const password = normalizeOptionalString(auth.password) ?? "";
	authByPort.set(port, {
		token: token || void 0,
		password: password || void 0
	});
}
/** Read auth material for a loopback bridge port. */
function getBridgeAuthForPort(port) {
	if (!Number.isFinite(port) || port <= 0) return;
	return authByPort.get(port);
}
/** Drop auth material when a bridge server closes or changes port. */
function deleteBridgeAuthForPort(port) {
	if (!Number.isFinite(port) || port <= 0) return;
	authByPort.delete(port);
}
//#endregion
export { getBridgeAuthForPort as n, setBridgeAuthForPort as r, deleteBridgeAuthForPort as t };
