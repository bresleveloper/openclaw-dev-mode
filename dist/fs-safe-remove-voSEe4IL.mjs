import "./fs-safe-defaults-D3xd3zKO.mjs";
import { r as isMissingPathError } from "./errno-CkbDOfLk.mjs";
import path from "node:path";
import { FsSafeError } from "@openclaw/fs-safe/errors";
import { root } from "@openclaw/fs-safe/root";
//#region src/infra/fs-safe-remove.ts
function isNotFoundError(error) {
	return isMissingPathError(error) || isMissingPathError(findMappedFilesystemCause(error));
}
function findMappedFilesystemCause(error) {
	const removalObservation = error instanceof FsSafeError && error.details?.operation === "remove" && (error.details.phase === "enumerate" || error.details.phase === "inspect");
	if (error?.code !== "path-alias" && !removalObservation) return;
	const cause = error.cause;
	const causeCode = cause?.code;
	return typeof causeCode === "string" && /^E[A-Z0-9_]+$/u.test(causeCode) ? cause : void 0;
}
async function removePathWithinRoot(params) {
	const root$1 = await root(params.rootDir);
	const suppressNotFound = params.force !== false;
	const recursive = params.recursive === true;
	try {
		await root$1.remove(params.relativePath, {
			recursive,
			force: suppressNotFound,
			mutationSymlinks: "follow-parents-within-root",
			...recursive ? {
				order: "sorted",
				maxEntries: Infinity,
				maxDepth: Infinity
			} : {}
		});
	} catch (error) {
		if (error instanceof FsSafeError && error.code === "symlink") {
			const descendantPath = error.details?.operation === "remove" && typeof error.details.relativePath === "string" ? error.details.relativePath : "";
			const relativePath = descendantPath ? path.join(params.relativePath, descendantPath) : params.relativePath;
			throw new FsSafeError("symlink", `symlink not allowed: ${relativePath}`);
		}
		if (isNotFoundError(error)) {
			if (suppressNotFound) return;
			throw new FsSafeError("not-found", "file not found", { cause: error instanceof Error ? error : void 0 });
		}
		const filesystemCause = findMappedFilesystemCause(error);
		if (filesystemCause) throw filesystemCause;
		throw error;
	}
}
//#endregion
export { removePathWithinRoot as t };
