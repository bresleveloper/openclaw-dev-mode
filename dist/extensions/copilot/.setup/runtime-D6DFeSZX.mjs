import { createRequire } from "node:module";
import path, { normalize, resolve, sep } from "node:path";
import { toStringifiedError } from "openclaw/plugin-sdk/error-runtime";
import { existsSync } from "node:fs";
import { pathToFileURL } from "node:url";
import { resolveStateDir } from "openclaw/plugin-sdk/state-paths";
//#region extensions/copilot/package.json
var dependencies = { "@github/copilot-sdk": "1.0.13" };
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
		`The legacy fallback location is still probed at\n  ${fallbackPath}`,
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
	const now = options.now ?? Date.now;
	const entries = /* @__PURE__ */ new Map();
	const releasedHandles = /* @__PURE__ */ new WeakSet();
	let disposed = false;
	let disposePromise;
	let disposeCompleted = false;
	const createDisposedError = () => /* @__PURE__ */ new Error(POOL_DISPOSED_MESSAGE);
	const maybeDeleteEntry = (entry) => {
		if (entries.get(entry.cacheKey) === entry) entries.delete(entry.cacheKey);
	};
	const stopReadyOrIdleEntry = (entry, client, idleTimer) => {
		if (idleTimer) clearTimeout(idleTimer);
		if (entry.stopRan) {
			if (entry.state.kind === "stopping") return entry.state.promise;
			if (entry.state.kind === "stopped") return Promise.resolve([]);
		}
		entry.stopRan = true;
		const stopPromise = (async () => {
			try {
				return await client.stop();
			} catch (error) {
				return [toStringifiedError(error)];
			} finally {
				entry.state = { kind: "stopped" };
				maybeDeleteEntry(entry);
			}
		})();
		entry.state = {
			kind: "stopping",
			client,
			promise: stopPromise
		};
		return stopPromise;
	};
	const stopEntry = async (entry) => {
		switch (entry.state.kind) {
			case "creating":
				try {
					await entry.state.promise;
				} catch (error) {
					maybeDeleteEntry(entry);
					return [toStringifiedError(error)];
				}
				return stopEntry(entry);
			case "ready": return stopReadyOrIdleEntry(entry, entry.state.client);
			case "idle": return stopReadyOrIdleEntry(entry, entry.state.client, entry.state.idleTimer);
			case "stopping": return entry.state.promise;
			case "stopped": return [];
			default: return entry.state;
		}
	};
	const scheduleIdleStop = (entry, client) => {
		entry.state = {
			kind: "idle",
			client,
			idleTimer: setTimeout(() => {
				stopEntry(entry);
			}, idleTtlMs),
			idleSinceMs: now()
		};
	};
	const createEntry = (key, cacheKey, clientOptions) => {
		const entry = {
			key,
			cacheKey,
			refCount: 1,
			stopRan: false,
			state: {
				kind: "creating",
				promise: Promise.resolve(void 0)
			}
		};
		const createPromise = (async () => {
			try {
				const client = await sdkFactory(clientOptions);
				entry.state = {
					kind: "ready",
					client
				};
				return client;
			} catch (error) {
				entry.state = { kind: "stopped" };
				maybeDeleteEntry(entry);
				throw toStringifiedError(error);
			}
		})();
		entry.state = {
			kind: "creating",
			promise: createPromise
		};
		entries.set(cacheKey, entry);
		return {
			entry,
			createPromise
		};
	};
	const acquire = async (inputKey, optionsForCreate) => {
		const key = normalizePoolKey(inputKey, optionsForCreate.copilotHome, optionsForCreate.mode);
		const cacheKey = JSON.stringify(key);
		const clientOptions = normalizeClientCreateOptions(optionsForCreate, key.copilotHome);
		while (true) {
			if (disposed) throw createDisposedError();
			const existing = entries.get(cacheKey);
			if (!existing) {
				const created = createEntry(key, cacheKey, clientOptions);
				try {
					const client = await created.createPromise;
					if (disposed) {
						await stopEntry(created.entry);
						throw createDisposedError();
					}
					return {
						key: created.entry.key,
						client
					};
				} catch (error) {
					throw toStringifiedError(error);
				}
			}
			switch (existing.state.kind) {
				case "creating":
					existing.refCount += 1;
					try {
						const client = await existing.state.promise;
						if (disposed) {
							await stopEntry(existing);
							throw createDisposedError();
						}
						return {
							key: existing.key,
							client
						};
					} catch (error) {
						throw toStringifiedError(error);
					}
				case "ready":
					existing.refCount += 1;
					return {
						key: existing.key,
						client: existing.state.client
					};
				case "idle": {
					const client = existing.state.client;
					clearTimeout(existing.state.idleTimer);
					existing.refCount += 1;
					existing.state = {
						kind: "ready",
						client
					};
					return {
						key: existing.key,
						client
					};
				}
				case "stopping":
					await existing.state.promise;
					continue;
				case "stopped":
					maybeDeleteEntry(existing);
					continue;
			}
		}
	};
	const release = async (handle) => {
		if (releasedHandles.has(handle)) return;
		releasedHandles.add(handle);
		const entry = entries.get(JSON.stringify(handle.key));
		if (!entry) return;
		switch (entry.state.kind) {
			case "creating":
			case "stopping":
			case "stopped": return;
			case "ready":
			case "idle": if (entry.state.client !== handle.client) return;
		}
		if (entry.refCount <= 0) return;
		entry.refCount -= 1;
		if (entry.refCount > 0) return;
		if (disposed) {
			await stopEntry(entry);
			return;
		}
		if (entry.state.kind === "ready") {
			scheduleIdleStop(entry, entry.state.client);
			return;
		}
		if (entry.state.kind === "idle") {
			clearTimeout(entry.state.idleTimer);
			scheduleIdleStop(entry, entry.state.client);
		}
	};
	const dispose = async () => {
		if (disposeCompleted) return [];
		if (disposePromise) {
			await disposePromise;
			return [];
		}
		disposed = true;
		const snapshot = [...entries.values()];
		for (const entry of snapshot) if (entry.state.kind === "idle") clearTimeout(entry.state.idleTimer);
		disposePromise = (async () => {
			const errors = [];
			for (const entry of snapshot) {
				const stopErrors = await stopEntry(entry);
				errors.push(...stopErrors);
			}
			entries.clear();
			disposeCompleted = true;
			return errors;
		})();
		try {
			return await disposePromise;
		} finally {
			disposePromise = void 0;
		}
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
	normalizedHome = normalize(normalizedHome);
	if (normalizedHome.endsWith(sep) && normalizedHome.length > 1) normalizedHome = normalizedHome.slice(0, -1);
	if (process.platform === "win32") normalizedHome = normalizedHome.toLowerCase();
	return normalizedHome;
}
//#endregion
export { createCopilotClientPool };
