import { t as __exportAll } from "./rolldown-runtime-8H4AJuhK.mjs";
//#region extensions/matrix/src/matrix/device-health.ts
var device_health_exports = /* @__PURE__ */ __exportAll({
	isOpenClawManagedMatrixDevice: () => isOpenClawManagedMatrixDevice,
	summarizeMatrixDeviceHealth: () => summarizeMatrixDeviceHealth
});
const OPENCLAW_DEVICE_NAME_PREFIX = "OpenClaw ";
function isOpenClawManagedMatrixDevice(displayName) {
	return displayName?.startsWith(OPENCLAW_DEVICE_NAME_PREFIX) === true;
}
function summarizeMatrixDeviceHealth(devices) {
	const currentDeviceId = devices.find((device) => device.current)?.deviceId ?? null;
	const openClawDevices = devices.filter((device) => isOpenClawManagedMatrixDevice(device.displayName));
	return {
		currentDeviceId,
		staleOpenClawDevices: openClawDevices.filter((device) => !device.current),
		currentOpenClawDevices: openClawDevices.filter((device) => device.current)
	};
}
//#endregion
export { isOpenClawManagedMatrixDevice as n, summarizeMatrixDeviceHealth as r, device_health_exports as t };
