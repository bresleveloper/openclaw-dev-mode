import { g as readRuntimeConfig } from "./runtime-snapshot-BBYDJbw9.mjs";
import { t as captureRuntimeConfigAsyncReader } from "./io.runtime-Ds5uC0Bf.mjs";
import { c as resolveMaintenanceConfigFromInput } from "./store-maintenance-BqMt1Twc.mjs";
import "./config-B3oiWDlr.mjs";
//#region src/config/sessions/store-maintenance-runtime.ts
function resolveMaintenanceConfig() {
	let maintenance;
	try {
		maintenance = readRuntimeConfig().session?.maintenance;
	} catch {}
	return resolveMaintenanceConfigFromInput(maintenance);
}
/** Use the canonical runtime policy even when a caller supplies only routing config. */
function captureMaintenanceConfigAsyncReader(assertCallerCurrent) {
	const read = captureRuntimeConfigAsyncReader({ assertCurrent: assertCallerCurrent });
	return Object.assign(async () => {
		let maintenance;
		try {
			maintenance = (await read()).session?.maintenance;
		} catch {
			read.assertCurrent();
		}
		read.assertCurrent();
		return resolveMaintenanceConfigFromInput(maintenance);
	}, { assertCurrent: read.assertCurrent });
}
//#endregion
export { resolveMaintenanceConfig as n, captureMaintenanceConfigAsyncReader as t };
