import os from "node:os";
//#region extensions/anthropic/session-catalog-home.ts
function resolveClaudeCatalogHomeDir(env = process.env) {
	return env.HOME?.trim() || env.USERPROFILE?.trim() || os.homedir();
}
//#endregion
export { resolveClaudeCatalogHomeDir as t };
