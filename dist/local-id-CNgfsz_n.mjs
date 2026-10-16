import { r as resolveStateDir } from "./state-dir-BHJORNly.mjs";
import "./paths-DGIwWbpu.mjs";
import { t as loadDeviceIdentityIfPresentAsync } from "./device-identity-async-CWlunAqt.mjs";
//#region src/node-host/local-id.ts
const localNodeIdByStateDir = /* @__PURE__ */ new Map();
async function resolveLocalNodeId(env = process.env) {
	const stateDir = resolveStateDir(env);
	const cached = localNodeIdByStateDir.get(stateDir);
	if (cached) return cached;
	const pending = loadDeviceIdentityIfPresentAsync({ env }).then((identity) => {
		const nodeId = identity?.deviceId ?? null;
		if (nodeId) localNodeIdByStateDir.set(stateDir, nodeId);
		else localNodeIdByStateDir.delete(stateDir);
		return nodeId;
	}, (error) => {
		localNodeIdByStateDir.delete(stateDir);
		throw error;
	});
	localNodeIdByStateDir.set(stateDir, pending);
	return pending;
}
//#endregion
export { resolveLocalNodeId as t };
