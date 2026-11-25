import { n as __exportAll } from "./runtime-doctor-migrations-CSvRANPN.mjs";
// extensions/matrix/src/matrix/device-health.ts
var device_health_exports = /* @__PURE__ */ __exportAll({ listStaleOpenClawMatrixDevices: () => listStaleOpenClawMatrixDevices });
function listStaleOpenClawMatrixDevices(devices) {
	return devices.filter((device) => !device.current && device.displayName?.startsWith("OpenClaw ") === true);
}
export { listStaleOpenClawMatrixDevices as n, device_health_exports as t };
