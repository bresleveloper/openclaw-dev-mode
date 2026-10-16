import { t as hasNodeErrorCode } from "./path-guards-CH7noY0Z.mjs";
import { t as createSubsystemLogger } from "./subsystem-I-uqdx4f.mjs";
import { FsSafeError } from "@openclaw/fs-safe/errors";
//#region src/infra/fs-safe-file-copy.ts
const log = createSubsystemLogger("infra/file-copy");
function isCloneUnavailable(error) {
	if (!(error instanceof FsSafeError)) return false;
	if (error.code === "unsupported-platform" || error.code === "helper-unavailable" && error.message === "native file cloning is unavailable") return true;
	return error.code === "helper-failed" && error.cause instanceof Error && error.cause.message.startsWith("FICLONE:") && [
		"EPERM",
		"ENOTSUP",
		"EOPNOTSUPP",
		"ENOSYS",
		"EXDEV"
	].some((code) => hasNodeErrorCode(error.cause, code));
}
/** One copy operation keeps native guards and warns once when cloning is unavailable. */
function createFileCopyWithCloneFallback() {
	let byteCopy = false;
	return async (root, relativePath, source, options, beforeByteCopy) => {
		if (byteCopy) {
			await beforeByteCopy?.();
			await root.copyIn(relativePath, source, {
				...options,
				clone: "never"
			});
			return;
		}
		let published = false;
		try {
			await root.copyIn(relativePath, source, {
				...options,
				clone: beforeByteCopy ? "always" : "auto",
				onDestinationPublished: (receipt) => {
					published = true;
					return options.onDestinationPublished?.(receipt);
				}
			});
		} catch (error) {
			if (published || !isCloneUnavailable(error)) throw error;
			if (!byteCopy) {
				byteCopy = true;
				log.warn("File cloning is unavailable; continuing with a guarded byte copy.");
			}
			await beforeByteCopy?.();
			await root.copyIn(relativePath, source, {
				...options,
				clone: "never"
			});
		}
	};
}
//#endregion
export { createFileCopyWithCloneFallback as t };
