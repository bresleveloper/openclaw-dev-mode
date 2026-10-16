import { r as isMissingPathError } from "./errno-FR4CRyya.mjs";
import fs from "node:fs";
//#region src/infra/path-existence.ts
/** Only definite absence, including a non-directory ancestor, permits an absent verdict. */
function pathMayExistSync(filePath) {
	try {
		fs.lstatSync(filePath);
		return true;
	} catch (error) {
		return !isMissingPathError(error);
	}
}
//#endregion
export { pathMayExistSync as t };
