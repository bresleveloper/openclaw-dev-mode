//#region extensions/crabbox/src/crabbox-worker-timeouts.ts
const CRABBOX_WARMUP_ATTEMPTS = 2;
const CRABBOX_WARMUP_TIMEOUT_MS = CRABBOX_WARMUP_ATTEMPTS * 15e5;
const CRABBOX_DESKTOP_WARMUP_TIMEOUT_MS = CRABBOX_WARMUP_ATTEMPTS * 3e6;
const CRABBOX_LIFECYCLE_TIMEOUT_MS = 12e4;
const CRABBOX_CONFIG_TIMEOUT_MS = 6e4;
const CRABBOX_STOP_TIMEOUT_MS = 1005e3;
const CRABBOX_COMMAND_SETTLEMENT_TIMEOUT_MS = 1e4;
const CRABBOX_HEARTBEAT_TIMEOUT_MS = 15e4;
const CRABBOX_MACHINE_CATALOG_TIMEOUT_MS = 5e3;
const WARM_IMAGE_COMMAND_TIMEOUT_MS = 6e4;
const WARM_IMAGE_COMMAND_ROUND_TRIP_TIMEOUT_MS = 18e4;
const WARM_IMAGE_NATIVE_WAIT_TIMEOUT_MS = 27e5;
function resolveCrabboxCheckpointCaptureTimeoutMs(provider) {
	return 288e4 + (provider === "machine0" ? 18e5 : provider === "daytona" ? 18e4 : 0);
}
function resolveCrabboxWarmImageCaptureTimeoutMs(provider) {
	return 48e4 + resolveCrabboxCheckpointCaptureTimeoutMs(provider) + 7 * CRABBOX_COMMAND_SETTLEMENT_TIMEOUT_MS;
}
const CRABBOX_MACHINE0_LIFECYCLE_TIMEOUT_MS = 3e5;
const CRABBOX_SETUP_TIMEOUT_MS = 9e5;
const CRABBOX_NODE_ENROLLMENT_TIMEOUT_FLOOR_MS = 9e5;
const CRABBOX_NODE_ENROLLMENT_DIAGNOSTIC_TIMEOUT_MS = 6e4;
function resolveCrabboxNodeEnrollmentTimeoutMs(bootstrapTimeoutMs) {
	return Math.max(CRABBOX_NODE_ENROLLMENT_TIMEOUT_FLOOR_MS, bootstrapTimeoutMs ?? 0);
}
function resolveCrabboxReadyPollIntervalMs(provider) {
	return provider === "machine0" ? 6e4 : 2e3;
}
function resolveCrabboxLifecycleTimeoutMs(provider) {
	return provider === "machine0" ? CRABBOX_MACHINE0_LIFECYCLE_TIMEOUT_MS : CRABBOX_LIFECYCLE_TIMEOUT_MS;
}
function resolveCrabboxProvisionBaseTimeoutMs(profile) {
	return (profile.desktop ? CRABBOX_DESKTOP_WARMUP_TIMEOUT_MS : CRABBOX_WARMUP_TIMEOUT_MS) + resolveCrabboxLifecycleTimeoutMs(profile.provider) * (profile.provider === "machine0" ? 2 : 1);
}
function countCrabboxProvisionSetupPhases(profile) {
	return Number(Boolean(profile.desktop)) + Number(Boolean(profile.setup));
}
function resolveCrabboxProvisionCallTimeoutMs(profile, nodeBootstrapTimeoutMs) {
	return resolveCrabboxProvisionBaseTimeoutMs(profile) + countCrabboxProvisionSetupPhases(profile) * CRABBOX_SETUP_TIMEOUT_MS + 2 * resolveCrabboxNodeEnrollmentTimeoutMs(nodeBootstrapTimeoutMs) + CRABBOX_NODE_ENROLLMENT_DIAGNOSTIC_TIMEOUT_MS + CRABBOX_STOP_TIMEOUT_MS + 3 * CRABBOX_COMMAND_SETTLEMENT_TIMEOUT_MS;
}
//#endregion
export { resolveCrabboxNodeEnrollmentTimeoutMs as _, CRABBOX_LIFECYCLE_TIMEOUT_MS as a, resolveCrabboxReadyPollIntervalMs as b, CRABBOX_SETUP_TIMEOUT_MS as c, WARM_IMAGE_COMMAND_ROUND_TRIP_TIMEOUT_MS as d, WARM_IMAGE_COMMAND_TIMEOUT_MS as f, resolveCrabboxLifecycleTimeoutMs as g, resolveCrabboxCheckpointCaptureTimeoutMs as h, CRABBOX_HEARTBEAT_TIMEOUT_MS as i, CRABBOX_STOP_TIMEOUT_MS as l, countCrabboxProvisionSetupPhases as m, CRABBOX_CONFIG_TIMEOUT_MS as n, CRABBOX_MACHINE_CATALOG_TIMEOUT_MS as o, WARM_IMAGE_NATIVE_WAIT_TIMEOUT_MS as p, CRABBOX_DESKTOP_WARMUP_TIMEOUT_MS as r, CRABBOX_NODE_ENROLLMENT_DIAGNOSTIC_TIMEOUT_MS as s, CRABBOX_COMMAND_SETTLEMENT_TIMEOUT_MS as t, CRABBOX_WARMUP_TIMEOUT_MS as u, resolveCrabboxProvisionBaseTimeoutMs as v, resolveCrabboxWarmImageCaptureTimeoutMs as x, resolveCrabboxProvisionCallTimeoutMs as y };
