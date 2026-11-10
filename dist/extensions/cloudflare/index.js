import { t as definePluginEntry } from "../../plugin-entry-D4OPnFRH.mjs";
import { t as r2StorageProvider } from "../../api-B7K4STgz.mjs";
//#region extensions/cloudflare/index.ts
var cloudflare_default = definePluginEntry({
	id: "cloudflare",
	name: "Cloudflare",
	description: "Cloudflare R2 storage for named OpenClaw storage locations.",
	register(api) {
		api.registerStorageProvider(r2StorageProvider);
	}
});
//#endregion
export { cloudflare_default as default };
