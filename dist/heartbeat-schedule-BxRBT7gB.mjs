import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { j as resolveIntegerOption } from "./number-coercion-CuVhdCBs.mjs";
import { o as readStoredDeviceIdentityReadOnly } from "./device-identity-store-id-VtwS0.mjs";
import { r as loadOrCreateDeviceIdentity } from "./device-identity-KmxGQO-v.mjs";
import { createHash } from "node:crypto";
//#region src/infra/heartbeat-schedule.ts
function resolveHeartbeatSchedulerSeed(explicitSeed, options = {}) {
	const normalized = normalizeOptionalString(explicitSeed);
	if (normalized) return normalized;
	const env = options.env ?? process.env;
	try {
		const identity = options.readOnly ? readStoredDeviceIdentityReadOnly({ env }) : loadOrCreateDeviceIdentity({ env });
		if (identity) return identity.deviceId;
	} catch {}
	return createHash("sha256").update(env.HOME ?? "").update("\0").update(process.cwd()).digest("hex");
}
function resolveHeartbeatPhaseMs(params) {
	const intervalMs = resolveIntegerOption(params.intervalMs, 1, { min: 1 });
	return createHash("sha256").update(`${params.schedulerSeed}:${params.agentId}`).digest().readUInt32BE(0) % intervalMs;
}
//#endregion
export { resolveHeartbeatSchedulerSeed as n, resolveHeartbeatPhaseMs as t };
