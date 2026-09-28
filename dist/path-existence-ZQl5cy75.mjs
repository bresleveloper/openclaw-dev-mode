import { t as hasErrnoCode } from "./errno-CkbDOfLk.mjs";
import fs from "node:fs";
//#region src/infra/path-existence.ts
/** Only a definite missing leaf permits callers to treat a path as absent. */
function pathMayExistSync(filePath) {
	try {
		fs.lstatSync(filePath);
		return true;
	} catch (error) {
		return !hasErrnoCode(error, "ENOENT");
	}
}
//#endregion
export { pathMayExistSync as t };
