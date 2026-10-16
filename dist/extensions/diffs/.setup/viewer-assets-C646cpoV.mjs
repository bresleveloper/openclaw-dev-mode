import crypto from "node:crypto";
import fs from "node:fs/promises";
import { fileURLToPath } from "node:url";
//#region extensions/diffs/src/viewer-assets.ts
const VIEWER_ASSET_PREFIX = "/plugins/diffs/assets/";
const VIEWER_RUNTIME_PATH = `${VIEWER_ASSET_PREFIX}viewer-runtime.js`;
const LANGUAGE_PACK_VIEWER_ASSET_PREFIX = "/plugins/diffs-language-pack/assets/";
const VIEWER_RUNTIME_RELATIVE_IMPORT_PATH = "./viewer-runtime.js";
const VIEWER_RUNTIME_CANDIDATE_RELATIVE_PATHS = [
	"./assets/viewer-runtime.js",
	"../assets/viewer-runtime.js",
	"./extensions/diffs/assets/viewer-runtime.js"
];
const LANGUAGE_PACK_RUNTIME_CANDIDATE_RELATIVE_PATHS = [
	"../../diffs-language-pack/assets/viewer-runtime.js",
	"../diffs-language-pack/assets/viewer-runtime.js",
	"./extensions/diffs-language-pack/assets/viewer-runtime.js"
];
function isMissingFileError(error) {
	return error instanceof Error && "code" in error && error.code === "ENOENT";
}
const getServedViewerAsset = createViewerAssetHandler(VIEWER_ASSET_PREFIX, VIEWER_RUNTIME_CANDIDATE_RELATIVE_PATHS);
const getServedLanguagePackViewerAsset = createViewerAssetHandler(LANGUAGE_PACK_VIEWER_ASSET_PREFIX, LANGUAGE_PACK_RUNTIME_CANDIDATE_RELATIVE_PATHS, true);
function createViewerAssetHandler(prefix, relativePaths, optional = false) {
	const loaderPath = `${prefix}viewer.js`;
	const runtimePath = `${prefix}viewer-runtime.js`;
	let cache = null;
	const loadRuntimeAssets = async (runtimeUrl) => {
		const cached = cache;
		const runtimeFilePath = fileURLToPath(runtimeUrl);
		const runtimeStat = await fs.stat(runtimeFilePath);
		if (cached && cached.mtimeMs === runtimeStat.mtimeMs) return cached;
		const runtimeBody = await fs.readFile(runtimeFilePath);
		const hash = crypto.createHash("sha1").update(runtimeBody).digest("hex").slice(0, 12);
		cache = {
			mtimeMs: runtimeStat.mtimeMs,
			runtimeBody,
			loaderBody: `import "${VIEWER_RUNTIME_RELATIVE_IMPORT_PATH}?v=${hash}";\n`
		};
		return cache;
	};
	return async (pathname) => {
		if (pathname !== loaderPath && pathname !== runtimePath) return null;
		try {
			const runtimeUrl = await resolveRuntimeFileUrl(relativePaths);
			const assets = await loadRuntimeAssets(runtimeUrl);
			return {
				body: pathname === loaderPath ? assets.loaderBody : assets.runtimeBody,
				contentType: "text/javascript; charset=utf-8"
			};
		} catch (error) {
			if (optional && isMissingFileError(error)) return null;
			throw error;
		}
	};
}
async function resolveRuntimeFileUrl(relativePaths) {
	let missingFileError = null;
	for (const relativePath of relativePaths) {
		const candidateUrl = new URL(relativePath, import.meta.url);
		try {
			await fs.stat(fileURLToPath(candidateUrl));
			return candidateUrl;
		} catch (error) {
			if (isMissingFileError(error)) {
				missingFileError = error;
				continue;
			}
			throw error;
		}
	}
	if (missingFileError) throw missingFileError;
	throw new Error("viewer runtime asset candidates were not checked");
}
//#endregion
export { getServedViewerAsset as a, getServedLanguagePackViewerAsset as i, VIEWER_ASSET_PREFIX as n, VIEWER_RUNTIME_PATH as r, LANGUAGE_PACK_VIEWER_ASSET_PREFIX as t };
