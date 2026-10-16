import { c as readLockPayload, d as resolveGatewayOwnerStatus, n as GatewayLockError, u as resolveGatewayLockPaths } from "./gateway-lock-B6mKYs2x.mjs";
import path from "node:path";
import os from "node:os";
//#region src/infra/gateway-lock-legacy.ts
/** Published 2026.6.33 Gateways predate state-local locks and SQLite coordinators. */
async function readLegacyGatewayLockIdentity(env) {
	const uid = process.getuid?.();
	const lockDir = path.join(os.tmpdir(), uid === void 0 ? "openclaw" : `openclaw-${uid}`);
	const { configLockPath } = resolveGatewayLockPaths(env, lockDir);
	const payload = await readLockPayload(configLockPath, true).catch((cause) => {
		throw new GatewayLockError(`Legacy Gateway lock could not be read at ${configLockPath}; inspect that file as the Gateway service account before retrying maintenance.`, cause);
	});
	if (!payload) return;
	const state = await resolveGatewayOwnerStatus(payload.pid, payload, process.platform);
	return state === "dead" ? void 0 : {
		pid: payload.pid,
		state,
		path: configLockPath
	};
}
async function assertLegacyGatewayStoppedForMaintenance(env) {
	const owner = await readLegacyGatewayLockIdentity(env);
	if (owner) throw new GatewayLockError(`Legacy Gateway lock ${owner.path} still has a live or unverified owner (PID ${owner.pid}).`);
}
//#endregion
export { readLegacyGatewayLockIdentity as n, assertLegacyGatewayStoppedForMaintenance as t };
