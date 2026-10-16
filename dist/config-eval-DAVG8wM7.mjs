import { i as getOrCreatePromise } from "./lazy-promise-DGqyc4Y4.mjs";
import { t as isBlockedObjectKey } from "./prototype-keys-CuYw53fZ.mjs";
import fs from "node:fs";
import path from "node:path";
//#region src/shared/config-eval.ts
/** Checks a config path with fallback defaults only when the path is unresolved. */
function isConfigPathTruthyWithDefaults(config, pathStr, defaults) {
	const parts = pathStr.split(".").filter(Boolean);
	let value = config;
	for (const part of parts) {
		if (typeof value !== "object" || value === null || isBlockedObjectKey(part)) {
			value = void 0;
			break;
		}
		value = value[part];
	}
	if (value === void 0 && !parts.some((part) => isBlockedObjectKey(part)) && Object.hasOwn(defaults, pathStr)) return defaults[pathStr] ?? false;
	return typeof value === "string" ? value.trim().length > 0 : value !== void 0 && value !== null && value !== false && value !== 0;
}
/** Enforces OS compatibility before allowing `always` to bypass runtime requirements. */
function evaluateRuntimeEligibility(params) {
	const osList = params.os ?? [];
	if (osList.length > 0 && !osList.includes(params.platform ?? process.platform) && !params.remotePlatforms?.some((platform) => osList.includes(platform))) return false;
	const requires = params.requires;
	if (params.always === true || !requires) return true;
	for (const envName of requires.env ?? []) if (!params.hasEnv(envName)) return false;
	for (const configPath of requires.config ?? []) if (!params.isConfigPathTruthy(configPath)) return false;
	for (const bin of requires.bins ?? []) if (!params.hasBin(bin) && !params.hasRemoteBin?.(bin)) return false;
	const requiredAnyBins = requires.anyBins ?? [];
	return requiredAnyBins.length === 0 || requiredAnyBins.some((bin) => params.hasBin(bin)) || Boolean(params.hasAnyRemoteBin?.(requiredAnyBins));
}
function windowsPathExtensions(raw) {
	return ["", ...(raw !== void 0 ? raw.split(";").map((v) => v.trim()) : [
		".EXE",
		".CMD",
		".BAT",
		".COM"
	]).filter(Boolean)];
}
const pendingBinaryAccess = /* @__PURE__ */ new Map();
let binaryCache;
function resolveBinaryCache() {
	const isWindows = process.platform === "win32";
	const pathEnv = process.env.PATH ?? "";
	const pathExt = isWindows ? process.env.PATHEXT ?? "" : "";
	if (binaryCache?.path !== pathEnv || binaryCache.pathExt !== pathExt) binaryCache = {
		path: pathEnv,
		pathExt,
		hits: /* @__PURE__ */ new Set()
	};
	return binaryCache;
}
function resolveBinarySearch(cache = resolveBinaryCache()) {
	const isWindows = process.platform === "win32";
	return {
		cache,
		isWindows,
		pathExt: isWindows ? process.env.PATHEXT : void 0,
		parts: cache.path.split(path.delimiter).filter(Boolean),
		extensions: isWindows ? windowsPathExtensions(process.env.PATHEXT) : [""]
	};
}
function* binaryCandidates(search, bin) {
	for (const part of search.parts) for (const ext of search.extensions) yield path.join(part, bin + ext);
}
/** Checks PATH for an executable binary, including PATHEXT candidates on Windows. */
function hasBinary(bin) {
	const cache = resolveBinaryCache();
	if (cache.hits.has(bin)) return true;
	const search = resolveBinarySearch(cache);
	for (const candidate of binaryCandidates(search, bin)) try {
		if (!search.isWindows && !fs.existsSync(candidate)) continue;
		fs.accessSync(candidate, fs.constants.X_OK);
		search.cache.hits.add(bin);
		return true;
	} catch {}
	return false;
}
/** Binary facts belong to one preparation; missing tools are probed again on the next build. */
async function prepareBinaryAvailability(bins, assertCurrent) {
	const search = resolveBinarySearch();
	const cwd = process.cwd();
	const pending = new Set(bins).values();
	const available = /* @__PURE__ */ new Set();
	let failure;
	const isCurrent = () => (process.env.PATH ?? "") === search.cache.path && (search.isWindows ? process.env.PATHEXT : void 0) === search.pathExt && process.cwd() === cwd;
	const probe = async (bin) => {
		if (search.cache.hits.has(bin)) {
			available.add(bin);
			return;
		}
		for (const candidate of binaryCandidates(search, bin)) {
			if (failure || !isCurrent()) return;
			assertCurrent?.();
			try {
				const resolvedCandidate = path.resolve(cwd, candidate);
				await getOrCreatePromise(pendingBinaryAccess, resolvedCandidate, () => fs.promises.access(resolvedCandidate, fs.constants.X_OK), { evictOnSettled: true });
			} catch {
				continue;
			}
			assertCurrent?.();
			if (isCurrent()) {
				available.add(bin);
				if (binaryCache === search.cache) search.cache.hits.add(bin);
			}
			return;
		}
	};
	const worker = async () => {
		try {
			for (;;) {
				if (failure || !isCurrent()) return;
				assertCurrent?.();
				const next = pending.next();
				if (next.done) return;
				await probe(next.value);
			}
		} catch (error) {
			failure ??= { error };
		}
	};
	await Promise.all(Array.from({ length: 4 }, worker));
	if (failure) throw failure.error;
	assertCurrent?.();
	return {
		hasBinary: (bin) => available.has(bin),
		isCurrent
	};
}
//#endregion
export { prepareBinaryAvailability as i, hasBinary as n, isConfigPathTruthyWithDefaults as r, evaluateRuntimeEligibility as t };
