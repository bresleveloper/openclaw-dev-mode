import { i as validateR2Settings, t as describeR2Target } from "./settings-ozezGD11.mjs";
//#region extensions/cloudflare/api.ts
const r2StorageProvider = {
	id: "r2",
	label: "Cloudflare R2",
	validateSettings: validateR2Settings,
	describeTarget: describeR2Target,
	async open(params) {
		const { openR2Backend } = await import("./extensions/cloudflare/runtime-api.js");
		return openR2Backend(params);
	}
};
//#endregion
export { r2StorageProvider as t };
