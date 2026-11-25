import { n as loadCopilotSdk } from "./sdk-loader-MZ7UHepf.mjs";
import { resolve } from "node:path";
import { toStringifiedError } from "openclaw/plugin-sdk/error-runtime";
// extensions/copilot/src/runtime.ts
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
	const createEntry = (key, cacheKey, clientOptions, runtimeArtifact) => {
		const entry = {
			key,
			cacheKey,
			refCount: 0,
			client: Promise.resolve().then(async () => {
				try {
					const client = await sdkFactory(clientOptions);
					if (runtimeArtifact) try {
						await client.start();
						const { validateCopilotRuntimeArtifact } = await import("./runtime-artifact-DQ8Ia6k4.mjs");
						if (!await validateCopilotRuntimeArtifact(runtimeArtifact)) throw new Error("[copilot] runtime changed while starting; retry setup verification");
					} catch (error) {
						await client.stop().catch(() => void 0);
						throw error;
					}
					return client;
				} catch (error) {
					maybeDeleteEntry(entry);
					throw toStringifiedError(error);
				}
			})
		};
		entries.set(cacheKey, entry);
		return entry;
	};
	const acquire = async (inputKey, optionsForCreate, runtimeArtifactRequest) => {
		if (runtimeArtifactRequest && optionsForCreate.connection) throw new Error("[copilot] runtime verification requires the packaged stdio runtime");
		const capture = runtimeArtifactRequest ? await (await import("./runtime-artifact-DQ8Ia6k4.mjs")).captureCopilotRuntimeArtifact(optionsForCreate.env) : void 0;
		const expected = runtimeArtifactRequest?.expected;
		if (expected && (capture?.binding.id !== expected.id || capture.binding.fingerprint !== expected.fingerprint)) throw new Error("[copilot] verified runtime changed; rerun setup verification");
		const runtimeArtifact = capture?.binding;
		const clientMode = optionsForCreate.mode;
		const key = {
			agentId: inputKey.agentId,
			copilotHome: normalizeCopilotHome(optionsForCreate.copilotHome),
			authMode: inputKey.authMode,
			authProfileId: inputKey.authProfileId,
			authProfileVersion: inputKey.authProfileVersion,
			...clientMode === "empty" ? { clientMode } : {},
			...runtimeArtifact ? { runtimeArtifactFingerprint: runtimeArtifact.fingerprint } : {}
		};
		const cacheKey = JSON.stringify(key);
		const clientOptions = normalizeClientCreateOptions(optionsForCreate, key.copilotHome);
		if (capture) clientOptions.connection = capture.connection;
		const toHandle = (client) => ({
			key,
			client,
			...runtimeArtifact ? { runtimeArtifact } : {}
		});
		while (true) {
			if (disposePromise) throw createDisposedError();
			const entry = entries.get(cacheKey) ?? createEntry(key, cacheKey, clientOptions, runtimeArtifact);
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
			return toHandle(client);
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
function normalizeClientCreateOptions(options, normalizedCopilotHome) {
	const { copilotHome: _copilotHome, ...clientOptions } = options;
	return {
		...clientOptions,
		baseDirectory: normalizedCopilotHome
	};
}
function normalizeCopilotHome(copilotHome) {
	let normalizedHome = resolve(copilotHome);
	if (process.platform === "win32") normalizedHome = normalizedHome.toLowerCase();
	return normalizedHome;
}
export { createCopilotClientPool };
