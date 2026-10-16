import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import "./string-coerce-runtime-50qKeWeL.mjs";
//#region extensions/browser/src/browser/bridge-auth-registry.ts
/**
* Ephemeral auth registry for loopback browser bridge servers.
*
* Dynamic sandbox/host ports need auth lookup without persisting tokens in
* config files, so callers store credentials only for the current process.
*/
const authByPort = /* @__PURE__ */ new Map();
function setBridgeAuthForPort(port, auth) {
	if (!Number.isFinite(port) || port <= 0) return;
	authByPort.set(port, {
		token: normalizeOptionalString(auth.token),
		password: normalizeOptionalString(auth.password)
	});
}
function getBridgeAuthForPort(port) {
	return authByPort.get(port);
}
function deleteBridgeAuthForPort(port) {
	authByPort.delete(port);
}
//#endregion
export { getBridgeAuthForPort as n, setBridgeAuthForPort as r, deleteBridgeAuthForPort as t };
