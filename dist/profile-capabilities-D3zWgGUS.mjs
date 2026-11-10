import { n as resolveBrowserEngine } from "./registry-BGl7JLt4.mjs";
//#region extensions/browser/src/browser/profile-capabilities.ts
function getBrowserProfileCapabilities(profile) {
	return resolveBrowserEngine(profile.engine).capabilities(profile);
}
//#endregion
export { getBrowserProfileCapabilities as t };
