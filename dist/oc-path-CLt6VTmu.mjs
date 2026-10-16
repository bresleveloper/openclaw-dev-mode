import { t as definePluginEntry } from "./plugin-entry-2l_2QeB2.mjs";
import { t as registerOcPathCli } from "./cli-registration-Bjg-AsV_.mjs";
//#region extensions/oc-path/index.ts
var oc_path_default = definePluginEntry({
	id: "oc-path",
	name: "OC Path",
	description: "Adds the openclaw path CLI for oc:// workspace file addressing.",
	register(api) {
		registerOcPathCli(api);
	}
});
//#endregion
export { oc_path_default as t };
