import "./redact-DJ8j6ADa.mjs";
import "./logger-Mnn26Jj7.mjs";
import "./subsystem-I-uqdx4f.mjs";
import { t as GatewayScheduler } from "./gateway-scheduler-BYbkpAYn.mjs";
import { r as getBoundLegacyPluginSdkResourceHost } from "./legacy-sdk-resource-host-DC4n8Jcn.mjs";
import "./logger-DskmrSVa.mjs";
import { f as startGatewayDiagnosticHeartbeat, p as stopGatewayDiagnosticHeartbeat } from "./diagnostic-BC19O2Si.mjs";
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
