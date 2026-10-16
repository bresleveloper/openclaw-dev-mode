import { canUseRootFileOpen, matchRootFileOpenFailure, matchRootFileOpenFailure as matchRootFileOpenFailure$1, openRootFile, openRootFileSync as openRootFileSync$1, readFileDescriptorBounded, readFileDescriptorBoundedSync } from "@openclaw/fs-safe/advanced";
import { FsSafeError } from "@openclaw/fs-safe/errors";
//#region src/infra/boundary-file-read.ts
const MISSING_PATH_ERROR_CODES = /* @__PURE__ */ new Set(["ENOENT", "ENOTDIR"]);
function readFailureErrorCode(error) {
	const code = error && typeof error === "object" ? error.code : void 0;
	return typeof code === "string" && code ? code : void 0;
}
function isRootFileMissingFailure(failure) {
	return failure.reason === "path" && MISSING_PATH_ERROR_CODES.has(readFailureErrorCode(failure.error) ?? "");
}
/**
* Describes a root-scoped open failure without collapsing every cause into a
* containment violation. Only `validation` means the path failed the boundary or
* alias check; a missing artifact or an unreadable descriptor is an ordinary
* operational state, and reporting those as escapes sends operators hunting a
* security incident that never happened.
*/
function describeRootFileOpenFailure(params) {
	const unreadable = (code) => `${params.subject} could not be read${code ? ` (${code})` : ""}: ${params.filePath}`;
	return matchRootFileOpenFailure(params.failure, {
		path: (failure) => {
			const code = readFailureErrorCode(failure.error);
			return isRootFileMissingFailure(failure) ? `${params.subject} not found: ${params.filePath}` : unreadable(code);
		},
		validation: () => `${params.subject} escapes ${params.boundaryLabel} or fails alias checks: ${params.filePath}`,
		fallback: (failure) => unreadable(readFailureErrorCode(failure.error))
	});
}
function preserveOpenClawOverflowError(error, maxBytes) {
	if (error instanceof FsSafeError && error.code === "too-large") throw new RangeError(`File exceeds ${maxBytes} bytes`, { cause: error });
	throw error;
}
/** Read a pinned descriptor without changing OpenClaw's user-facing overflow error. */
async function readFileDescriptorBounded$1(fd, maxBytes) {
	try {
		return await readFileDescriptorBounded(fd, maxBytes);
	} catch (error) {
		return preserveOpenClawOverflowError(error, maxBytes);
	}
}
/** Synchronous variant for callers that own a pinned descriptor. */
function readFileDescriptorBoundedSync$1(fd, maxBytes) {
	try {
		return readFileDescriptorBoundedSync(fd, maxBytes);
	} catch (error) {
		return preserveOpenClawOverflowError(error, maxBytes);
	}
}
//#endregion
export { openRootFile as a, readFileDescriptorBoundedSync$1 as c, matchRootFileOpenFailure$1 as i, describeRootFileOpenFailure as n, openRootFileSync$1 as o, isRootFileMissingFailure as r, readFileDescriptorBounded$1 as s, canUseRootFileOpen as t };
