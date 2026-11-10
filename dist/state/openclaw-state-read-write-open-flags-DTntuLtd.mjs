import { n as hasNodeErrorCode } from "./openclaw-state-read-path-DKRN8JwZ.mjs";
import fs from "node:fs";
function getFsSafeTestHooks() {}
//#endregion
//#region node_modules/.pnpm/@openclaw+fs-safe@0.26.5/node_modules/@openclaw/fs-safe/dist/write-open-flags.js
function resolveNonblockingWriteFlag(constants = fs.constants) {
	return process.platform !== "win32" && typeof constants.O_NONBLOCK === "number" ? constants.O_NONBLOCK : 0;
}
function isNonblockingWriteEnxio(error, flags) {
	return hasNodeErrorCode(error, "ENXIO") && (flags & (fs.constants.O_WRONLY | fs.constants.O_RDWR)) === fs.constants.O_WRONLY && (flags & resolveNonblockingWriteFlag()) !== 0;
}
async function isNonRegularWriteOpenError(error, filePath, flags) {
	return isNonRegularWriteOpenErrorSync(error, filePath, flags);
}
function isNonRegularWriteOpenErrorSync(error, filePath, flags) {
	if (!isNonblockingWriteEnxio(error, flags)) return false;
	try {
		return !fs.lstatSync(filePath).isFile();
	} catch {
		return false;
	}
}
//#endregion
export { getFsSafeTestHooks as i, isNonRegularWriteOpenErrorSync as n, resolveNonblockingWriteFlag as r, isNonRegularWriteOpenError as t };
