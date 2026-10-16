import { n as getFileLockProcessStartTime, o as isPidDefinitelyDead } from "./pid-alive-CPS_shDt.mjs";
import { hostname } from "node:os";
//#region src/infra/update-run-driver.ts
function sameUpdateRunDriver(left, right) {
	return left.host === right.host && left.pid === right.pid && left.startIdentity === right.startIdentity;
}
function readUpdateRunDriver(pid = process.pid) {
	if (!Number.isSafeInteger(pid) || pid <= 0) return;
	const host = hostname();
	const startedAt = getFileLockProcessStartTime(pid);
	if (!host || host.length > 255 || startedAt === null || !Number.isSafeInteger(startedAt) || startedAt < 0) return;
	return {
		host,
		pid,
		startIdentity: String(startedAt)
	};
}
function inspectUpdateRunDriver(driver) {
	if (driver.host !== hostname()) return "unknown";
	if (isPidDefinitelyDead(driver.pid)) return "dead";
	const startedAt = getFileLockProcessStartTime(driver.pid);
	if (startedAt === null) return "unknown";
	return String(startedAt) === driver.startIdentity ? "alive" : "dead";
}
//#endregion
export { readUpdateRunDriver as n, sameUpdateRunDriver as r, inspectUpdateRunDriver as t };
