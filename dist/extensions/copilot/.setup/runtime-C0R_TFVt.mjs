import { createRequire } from "node:module";
import path, { resolve, sep } from "node:path";
import { toStringifiedError } from "openclaw/plugin-sdk/error-runtime";
import { existsSync } from "node:fs";
import { pathToFileURL } from "node:url";
import { resolveStateDir } from "openclaw/plugin-sdk/state-paths";
//#region extensions/copilot/package.json
var dependencies = { "@github/copilot-sdk": "1.0.16" };
//#endregion
//#region extensions/copilot/src/sdk-loader.ts
function resolveCopilotSdkFallbackDir(env = process.env) {
	return path.join(resolveStateDir(env), "npm-runtime", "copilot");
}
const COPILOT_SDK_SPEC = `@github/copilot-sdk@${dependencies["@github/copilot-sdk"]}`;
let cached;
async function loadCopilotSdk(options = {}) {
	const useCache = options.cache !== false;
	if (useCache && cached) return cached;
	const promise = doLoad(options);
	if (useCache) {
		cached = promise.catch((err) => {
			cached = void 0;
			throw err;
		});
		return cached;
	}
	return promise;
}
async function doLoad(options) {
	const fallbackDir = options.fallbackDir ?? resolveCopilotSdkFallbackDir();
	const primaryImport = options.primaryImport ?? (async () => await import("@github/copilot-sdk"));
	let primaryErr;
	try {
		return await primaryImport();
	} catch (err) {
		primaryErr = err;
	}
	const fallbackPath = path.join(fallbackDir, "node_modules", "@github", "copilot-sdk");
	if (!existsSync(fallbackPath)) throw createMissingSdkError(primaryErr, void 0, fallbackPath);
	const fallbackImport = options.fallbackImport ?? (async () => {
		const entry = createRequire(path.join(fallbackDir, "package.json")).resolve("@github/copilot-sdk");
		return await import(pathToFileURL(entry).href);
	});
	try {
		return await fallbackImport(fallbackPath);
	} catch (fallbackErr) {
		throw createMissingSdkError(primaryErr, fallbackErr, fallbackPath);
	}
}
function createMissingSdkError(primaryErr, fallbackErr, fallbackPath) {
	const lines = [
		"[copilot] @github/copilot-sdk is not installed.",
		"",
		"The external @openclaw/copilot plugin depends on @github/copilot-sdk",
		"including its platform-specific Copilot runtime package.",
		"Reinstall the plugin once with:",
		"",
		"  openclaw plugins install @openclaw/copilot",
		"",
		"For source checkouts or offline repair, install the SDK directly:",
		"",
		`  npm install ${COPILOT_SDK_SPEC}`,
		"",
		`The legacy fallback location is still checked at\n  ${fallbackPath}`,
		"",
		"Primary resolution error:",
		`  ${summarizeError(primaryErr)}`
	];
	if (fallbackErr !== void 0) lines.push("", "Fallback resolution error:", `  ${summarizeError(fallbackErr)}`);
	const err = new Error(lines.join("\n"));
	err.code = "COPILOT_SDK_MISSING";
	return err;
}
function summarizeError(value) {
	if (value === void 0 || value === null) return "(none)";
	if (value instanceof Error) return value.message || String(value);
	if (typeof value === "string") return value;
	try {
		return JSON.stringify(value);
	} catch {
		return Object.prototype.toString.call(value);
	}
}
//#endregion
//#region extensions/copilot/src/runtime.ts
const DEFAULT_IDLE_TTL_MS = 3e5;
const POOL_DISPOSED_MESSAGE = "[copilot-pool] pool disposed";
function createCopilotClientPool(options = {}) {
	const sdkFactory = options.sdkFactory ?? (async (clientOptions) => {
		return new (await (loadCopilotSdk())).CopilotClient(clientOptions);
	});
	const idleTtlMs = options.idleTtlMs ?? DEFAULT_IDLE_TTL_MS;
	const entries = /* @__PURE__ */ new Map();
	const releasedHandles = /* @__PURE__ */ new WeakSet();
	let disposePromise;
	const createDisposedError = () => /* @__PURE__ */ new Error(POOL_DISPOSED_MESSAGE);
	const maybeDeleteEntry = (entry) => {
		if (entries.get(entry.cacheKey) === entry) entries.delete(entry.cacheKey);
	};
	const stopEntry = (entry) => {
		if (entry.stopping) return entry.stopping;
		clearTimeout(entry.idleTimer);
		entry.stopping = (async () => {
			try {
				return await (await entry.client).stop();
			} catch (error) {
				return [toStringifiedError(error)];
			} finally {
				maybeDeleteEntry(entry);
			}
		})();
		return entry.stopping;
	};
	const createEntry = (key, cacheKey, clientOptions) => {
		const entry = {
			key,
			cacheKey,
			refCount: 0,
			client: Promise.resolve().then(async () => {
				try {
					return await sdkFactory(clientOptions);
				} catch (error) {
					maybeDeleteEntry(entry);
					throw toStringifiedError(error);
				}
			})
		};
		entries.set(cacheKey, entry);
		return entry;
	};
	const acquire = async (inputKey, optionsForCreate) => {
		const key = normalizePoolKey(inputKey, optionsForCreate.copilotHome, optionsForCreate.mode);
		const cacheKey = JSON.stringify(key);
		const clientOptions = normalizeClientCreateOptions(optionsForCreate, key.copilotHome);
		while (true) {
			if (disposePromise) throw createDisposedError();
			const entry = entries.get(cacheKey) ?? createEntry(key, cacheKey, clientOptions);
			if (entry.stopping) {
				await entry.stopping;
				continue;
			}
			clearTimeout(entry.idleTimer);
			entry.refCount += 1;
			const client = await entry.client;
			if (disposePromise) {
				await stopEntry(entry);
				throw createDisposedError();
			}
			return {
				key: entry.key,
				client
			};
		}
	};
	const release = async (handle) => {
		if (releasedHandles.has(handle)) return;
		releasedHandles.add(handle);
		const entry = entries.get(JSON.stringify(handle.key));
		if (!entry || entry.stopping || await entry.client !== handle.client) return;
		entry.refCount -= 1;
		if (entry.refCount > 0) return;
		if (disposePromise) {
			await stopEntry(entry);
			return;
		}
		entry.idleTimer = setTimeout(() => {
			stopEntry(entry);
		}, idleTtlMs);
	};
	const dispose = async () => {
		if (disposePromise) {
			await disposePromise;
			return [];
		}
		const snapshot = [...entries.values()];
		for (const entry of snapshot) clearTimeout(entry.idleTimer);
		disposePromise = (async () => {
			const errors = [];
			for (const entry of snapshot) {
				const stopErrors = await stopEntry(entry);
				errors.push(...stopErrors);
			}
			entries.clear();
			return errors;
		})();
		return await disposePromise;
	};
	return {
		acquire,
		release,
		dispose,
		size: () => entries.size
	};
}
function normalizePoolKey(key, rawCopilotHome, clientMode) {
	return {
		agentId: key.agentId,
		copilotHome: normalizeCopilotHome(rawCopilotHome),
		authMode: key.authMode,
		authProfileId: key.authProfileId,
		authProfileVersion: key.authProfileVersion,
		...clientMode === "empty" ? { clientMode } : {}
	};
}
function normalizeClientCreateOptions(options, normalizedCopilotHome) {
	const { copilotHome: _copilotHome, ...clientOptions } = options;
	return {
		...clientOptions,
		baseDirectory: normalizedCopilotHome
	};
}
function normalizeCopilotHome(copilotHome) {
	let normalizedHome = resolve(copilotHome);
	if (normalizedHome.endsWith(sep) && normalizedHome.length > 1) normalizedHome = normalizedHome.slice(0, -1);
	if (process.platform === "win32") normalizedHome = normalizedHome.toLowerCase();
	return normalizedHome;
}
//#endregion
export { createCopilotClientPool };
