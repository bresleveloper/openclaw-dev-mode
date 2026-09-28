import { E as resolveStateDir } from "./paths-DehQwyE0.mjs";
import { t as loadDeviceIdentityIfPresentAsync } from "./device-identity-async-CB1i57hb.mjs";
//#region src/node-host/local-id.ts
const localNodeIdByStateDir = /* @__PURE__ */ new Map();
async function resolveLocalNodeId(env = process.env) {
	const stateDir = resolveStateDir(env);
	const cached = localNodeIdByStateDir.get(stateDir);
	if (cached) return cached;
	const nodeId = (await loadDeviceIdentityIfPresentAsync({ env }))?.deviceId ?? null;
	if (nodeId) localNodeIdByStateDir.set(stateDir, nodeId);
	return nodeId;
}
//#endregion
export { resolveLocalNodeId as t };
