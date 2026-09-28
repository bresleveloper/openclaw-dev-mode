import "./fs-safe-defaults-D3xd3zKO.mjs";
import { root } from "@openclaw/fs-safe/root";
//#region src/infra/root-walk.ts
async function* walkRootDirectory(rootDir, relativePath, options) {
	yield* (await root(rootDir)).walk(relativePath, options);
}
//#endregion
export { walkRootDirectory as t };
