import { a as normalizeLowercaseStringOrEmpty } from "../../string-coerce-DW4mBlAt.js";
import "../../string-coerce-runtime-ZbuYDJgZ.js";
import { t as definePluginEntry } from "../../plugin-entry-CM_XK0Yw.js";
//#region extensions/acpx/setup-api.ts
/**
* ACPX setup plugin entry. It auto-enables setup when ACP config already points
* at the embedded ACPX runtime backend.
*/
var setup_api_default = definePluginEntry({
	id: "acpx",
	name: "ACPX Setup",
	description: "Lightweight ACPX setup hooks",
	register(api) {
		api.registerAutoEnableProbe(({ config }) => {
			const backendRaw = normalizeLowercaseStringOrEmpty(config.acp?.backend);
			return (config.acp?.enabled === true || config.acp?.dispatch?.enabled === true || backendRaw === "acpx") && (!backendRaw || backendRaw === "acpx") ? "ACP runtime configured" : null;
		});
	}
});
//#endregion
export { setup_api_default as default };
