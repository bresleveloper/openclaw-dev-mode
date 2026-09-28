import crypto from "node:crypto";
import fs from "node:fs/promises";
import { fileURLToPath } from "node:url";
//#region extensions/diffs/src/viewer-assets.ts
const VIEWER_ASSET_PREFIX = "/plugins/diffs/assets/";
const VIEWER_LOADER_PATH = `${VIEWER_ASSET_PREFIX}viewer.js`;
const VIEWER_RUNTIME_PATH = `${VIEWER_ASSET_PREFIX}viewer-runtime.js`;
const LANGUAGE_PACK_VIEWER_ASSET_PREFIX = "/plugins/diffs-language-pack/assets/";
const LANGUAGE_PACK_VIEWER_LOADER_PATH = `${LANGUAGE_PACK_VIEWER_ASSET_PREFIX}viewer.js`;
const LANGUAGE_PACK_VIEWER_RUNTIME_PATH = `${LANGUAGE_PACK_VIEWER_ASSET_PREFIX}viewer-runtime.js`;
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
let runtimeAssetCache = null;
let languagePackRuntimeAssetCache = null;
function isMissingFileError(error) {
	return error instanceof Error && "code" in error && error.code === "ENOENT";
}
async function getServedViewerAsset(pathname) {
	if (pathname !== VIEWER_LOADER_PATH && pathname !== VIEWER_RUNTIME_PATH) return null;
	const assets = await loadViewerAssets();
	if (pathname === VIEWER_LOADER_PATH) return {
		body: assets.loaderBody,
		contentType: "text/javascript; charset=utf-8"
	};
	if (pathname === VIEWER_RUNTIME_PATH) return {
		body: assets.runtimeBody,
		contentType: "text/javascript; charset=utf-8"
	};
	return null;
}
async function getServedLanguagePackViewerAsset(pathname) {
	if (pathname !== LANGUAGE_PACK_VIEWER_LOADER_PATH && pathname !== LANGUAGE_PACK_VIEWER_RUNTIME_PATH) return null;
	let assets;
	try {
		assets = await loadRuntimeAssets({
			runtimeUrl: await resolveRuntimeFileUrl(LANGUAGE_PACK_RUNTIME_CANDIDATE_RELATIVE_PATHS),
			cache: languagePackRuntimeAssetCache,
			updateCache: (cache) => {
				languagePackRuntimeAssetCache = cache;
			}
		});
	} catch (error) {
		if (isMissingFileError(error)) return null;
		throw error;
	}
	if (pathname === LANGUAGE_PACK_VIEWER_LOADER_PATH) return {
		body: assets.loaderBody,
		contentType: "text/javascript; charset=utf-8"
	};
	return {
		body: assets.runtimeBody,
		contentType: "text/javascript; charset=utf-8"
	};
}
async function loadViewerAssets() {
	return loadRuntimeAssets({
		runtimeUrl: await resolveRuntimeFileUrl(VIEWER_RUNTIME_CANDIDATE_RELATIVE_PATHS),
		cache: runtimeAssetCache,
		updateCache: (cache) => {
			runtimeAssetCache = cache;
		}
	});
}
async function loadRuntimeAssets(params) {
	const runtimePath = fileURLToPath(params.runtimeUrl);
	const runtimeStat = await fs.stat(runtimePath);
	if (params.cache && params.cache.mtimeMs === runtimeStat.mtimeMs) return params.cache;
	const runtimeBody = await fs.readFile(runtimePath);
	const hash = crypto.createHash("sha1").update(runtimeBody).digest("hex").slice(0, 12);
	const cache = {
		mtimeMs: runtimeStat.mtimeMs,
		runtimeBody,
		loaderBody: `import "${VIEWER_RUNTIME_RELATIVE_IMPORT_PATH}?v=${hash}";\n`
	};
	params.updateCache(cache);
	return cache;
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
