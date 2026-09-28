import "./fs-safe-advanced-CJC-NYf3.mjs";
import { E as statRegularFileSync } from "./fs-safe-BAPek8At.mjs";
import "./path-guards-D5kuI0Tv.mjs";
import "./boundary-file-read-D-Aa04On.mjs";
import "./file-read-Csm265gq.mjs";
import "./file-descriptor-C_0BsNDD.mjs";
import "./directory-durability-BKe2aOQN.mjs";
import "./permissions-DOmAO-Zd.mjs";
import "./local-file-access-B6bU8SNO.mjs";
import "./file-range-Bpo5m0I4.mjs";
import "./fs-safe-remove-voSEe4IL.mjs";
//#region src/plugin-sdk/file-access-runtime.ts
/** Return whether a path resolves to a regular file, treating filesystem errors as missing. */
function fileExists(filePath) {
	try {
		return !statRegularFileSync(filePath).missing;
	} catch {
		return false;
	}
}
//#endregion
export { fileExists as t };
