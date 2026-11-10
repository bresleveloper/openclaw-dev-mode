import { i as pluginInstanceInvocation } from "./plugin-instance-invocation-DjfKDZW8.mjs";
import { r as loadConfig } from "./io.runtime-Ds5uC0Bf.mjs";
import { t as warnSessionPersistenceDeprecation } from "./session-persistence-deprecation-BRA1CvXF.mjs";
//#region src/plugin-sdk/runtime-config-legacy.ts
/** @deprecated Use readRuntimeConfig after awaiting captureRuntimeConfigAsyncReader()(). Final compatibility day: 2026-12-31. */
function getRuntimeConfig(options) {
	warnSessionPersistenceDeprecation("getRuntimeConfig", "readRuntimeConfig after awaiting captureRuntimeConfigAsyncReader()()", {
		pluginId: pluginInstanceInvocation.getStore()?.instance.pluginId,
		family: "runtime-config"
	});
	return loadConfig(options);
}
//#endregion
export { getRuntimeConfig as t };
