import "./redact-BcXJu5HP.mjs";
import { r as getBoundLegacyPluginSdkResourceHost } from "./legacy-sdk-resource-host-DBY7FuQ8.mjs";
import "./logger-DR3u4tgD.mjs";
import "./subsystem-mStysHHC.mjs";
import { t as GatewayScheduler } from "./gateway-scheduler-DzQtXKjV.mjs";
import "./logger-DHVmYOKs.mjs";
import { f as startGatewayDiagnosticHeartbeat, p as stopGatewayDiagnosticHeartbeat } from "./diagnostic-Dz-YV3uh.mjs";
//#region src/plugin-sdk/logging-core.ts
/**
* Public SDK subpath for logging, diagnostics, and redaction helpers.
*/
let standaloneDiagnosticScheduler;
/** Standalone SDK callers own this schedule; Gateway plugins use their bound host. */
function startDiagnosticHeartbeat(config, opts) {
	const host = getBoundLegacyPluginSdkResourceHost();
	const scheduler = host ? host.scheduler : standaloneDiagnosticScheduler ??= new GatewayScheduler();
	startGatewayDiagnosticHeartbeat(scheduler, config, opts);
}
function stopDiagnosticHeartbeat() {
	stopGatewayDiagnosticHeartbeat();
	const scheduler = standaloneDiagnosticScheduler;
	standaloneDiagnosticScheduler = void 0;
	scheduler?.stop();
}
//#endregion
export { stopDiagnosticHeartbeat as n, startDiagnosticHeartbeat as t };
