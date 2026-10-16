import { o as racePromiseWithAbortSignal } from "./src-D1BHGNTj.mjs";
import "./abort-signal-QqAmLWTl.mjs";
import { t as notifyListeners } from "./listeners-BogSNJ-R.mjs";
import { g as NODE_WORKER_BUNDLE_INSTALL_COMMAND } from "./node-commands-BLhGKTZa.mjs";
import "./worker-admission-CNeLWzVQ.mjs";
import { a as workerBootstrapOperationTimeoutMs } from "./bootstrap-timeouts-CDaMuZ4A.mjs";
import { o as parseNodeWorkerBundleInstallResult } from "./node-bundle-install-protocol-C0PbrQ0m.mjs";
import { t as sameWorkerBuild } from "./worker-build-identity-D_c48Wx_.mjs";
//#region src/gateway/worker-environments/node-worker-bundle-installer.ts
const megabytes = (bytes) => (bytes / 1e6).toFixed(1);
function createGatewayNodeWorkerBundleInstaller(options) {
	const now = options.now ?? Date.now;
	const active = /* @__PURE__ */ new Map();
	let version = 0;
	const publish = (entry, environmentIds = entry.observation.environmentIds) => {
		entry.lastPublicationAtMs = now();
		try {
			options.onObservationChange?.(entry.observation.nodeId, environmentIds);
		} catch {}
		notifyListeners(entry.progressListeners, void 0);
	};
	const install = async (params) => {
		let startedAtMs = now();
		const prefix = `worker runtime install: node=${params.deviceId} bundle=${params.artifact.bundleHash.slice(0, 12)}`;
		const elapsedSeconds = () => Math.max(0, (now() - startedAtMs) / 1e3);
		try {
			params.signal?.throwIfAborted();
			const transport = options.getTransport();
			if (!transport) throw new Error("Device worker node transport is unavailable");
			const node = await racePromiseWithAbortSignal(transport.getCurrentNode(params.deviceId), params.signal);
			params.signal?.throwIfAborted();
			if (!node) throw new Error("Device worker node is not connected with the installer dialect");
			const { artifact } = params;
			const isAuthorized = () => {
				params.assertCurrent?.();
				return !params.signal?.aborted && options.getTransport() === transport && transport.isCurrent(node);
			};
			if (!isAuthorized()) throw new Error("Device worker installation connection is no longer current");
			const bundlePrewarm = params.prewarm && (node.workerHost.bundlePrewarm ?? 0) >= 1 ? 1 : void 0;
			const key = `${node.nodeId}:${artifact.bundleHash}`;
			let entry = active.get(key);
			if (!entry) {
				startedAtMs = now();
				entry = {
					observation: {
						nodeId: node.nodeId,
						environmentIds: [],
						bundleHash: artifact.bundleHash,
						totalBytes: artifact.tarballBytes,
						transferredBytes: 0,
						phase: "transferring",
						startedAtMs,
						updatedAtMs: startedAtMs
					},
					references: 0,
					environmentReferences: /* @__PURE__ */ new Map(),
					progressListeners: /* @__PURE__ */ new Set(),
					lastProgressLogAtMs: startedAtMs,
					lastPublicationAtMs: startedAtMs
				};
				active.set(key, entry);
				options.log.info(`worker runtime install started (${params.reason}): node=${node.nodeId} bundle=${artifact.bundleHash.slice(0, 12)} size=${megabytes(artifact.tarballBytes)} MB`);
			}
			entry.references++;
			const progressListener = params.onProgress && (() => params.onProgress?.());
			if (progressListener) entry.progressListeners.add(progressListener);
			const environmentReferences = entry.environmentReferences.get(params.environmentId) ?? 0;
			entry.environmentReferences.set(params.environmentId, environmentReferences + 1);
			if (environmentReferences === 0) {
				entry.observation = {
					...entry.observation,
					environmentIds: [...entry.environmentReferences.keys()]
				};
				version++;
				publish(entry);
			} else if (progressListener) notifyListeners([progressListener], void 0);
			const currentEntry = entry;
			startedAtMs = currentEntry.observation.startedAtMs;
			let prepared;
			let serve;
			try {
				prepared = options.transfer.prepare({
					gatewayNamespace: options.gatewayNamespace,
					artifact,
					...bundlePrewarm ? { bundlePrewarm } : {},
					isAuthorized,
					signal: params.signal,
					onProgress: (servedBytes) => {
						const updatedAtMs = now();
						if (serve?.interrupted) serve = void 0;
						else if (serve && currentEntry.serve !== serve) return;
						serve ??= {
							startedAtMs: updatedAtMs,
							interrupted: false
						};
						const serveChanged = currentEntry.serve !== serve;
						if (serveChanged) {
							if (currentEntry.serve?.interrupted) options.log.info(`${prefix} transfer restarted`);
							currentEntry.serve = serve;
							currentEntry.lastProgressLogAtMs = updatedAtMs;
						}
						const observation = currentEntry.observation;
						const transferredBytes = Math.min(observation.totalBytes, servedBytes);
						if (!serveChanged && transferredBytes <= observation.transferredBytes) return;
						const transferSeconds = Math.max(0, (updatedAtMs - serve.startedAtMs) / 1e3);
						const phase = transferredBytes === observation.totalBytes ? "installing" : "transferring";
						const phaseChanged = phase !== observation.phase;
						currentEntry.observation = {
							...observation,
							transferredBytes,
							updatedAtMs,
							phase
						};
						version++;
						if (phase === "installing" && (phaseChanged || serveChanged)) options.log.info(`${prefix} transfer complete after ${transferSeconds.toFixed(1)}s; node is installing`);
						else if (updatedAtMs - currentEntry.lastProgressLogAtMs >= 3e4) {
							currentEntry.lastProgressLogAtMs = updatedAtMs;
							const bytesPerSecond = transferredBytes / Math.max(1, transferSeconds);
							const rate = bytesPerSecond >= 1e6 ? `${megabytes(bytesPerSecond)} MB/s` : `${(bytesPerSecond / 1e3).toFixed(1)} KB/s`;
							options.log.info(`${prefix} ${megabytes(transferredBytes)}/${megabytes(observation.totalBytes)} MB (${Math.round(transferredBytes / observation.totalBytes * 100)}%) ${rate}`);
						}
						if (serveChanged || phaseChanged || updatedAtMs - currentEntry.lastPublicationAtMs >= 2e3) publish(currentEntry);
					},
					onInterrupted: (servedBytes, reason) => {
						if (serve?.interrupted) return;
						serve ??= {
							startedAtMs: now(),
							interrupted: false
						};
						serve.interrupted = true;
						currentEntry.serve ??= serve;
						options.log.warn(`${prefix} transfer interrupted at ${megabytes(Math.min(artifact.tarballBytes, servedBytes))}/${megabytes(artifact.tarballBytes)} MB: ${reason}`);
					}
				});
				const result = await transport.invoke({
					node,
					command: NODE_WORKER_BUNDLE_INSTALL_COMMAND,
					params: prepared.input,
					timeoutMs: workerBootstrapOperationTimeoutMs(artifact),
					idempotencyKey: `${options.gatewayNamespace}:${artifact.bundleHash}`,
					isDispatchAuthorized: isAuthorized,
					...params.signal ? { signal: params.signal } : {}
				});
				if (!isAuthorized()) throw new Error("Device worker installation connection is no longer current");
				if (!result.ok) throw new Error(result.error?.message ? `Device worker bundle installation failed: ${result.error.message}` : "Device worker bundle installation failed");
				let payload = result.payload;
				if (result.payloadJSON) try {
					payload = JSON.parse(result.payloadJSON);
				} catch {
					payload = void 0;
				}
				const receipt = parseNodeWorkerBundleInstallResult(payload);
				if (!receipt || !sameWorkerBuild(receipt, artifact)) throw new Error("Device worker bundle installer returned a mismatched build receipt");
				if (currentEntry.references === 1) options.log.info(`${prefix} installed in ${elapsedSeconds().toFixed(1)}s`);
				return receipt;
			} finally {
				if (prepared) options.transfer.revoke(prepared.token);
				currentEntry.references--;
				if (progressListener) currentEntry.progressListeners.delete(progressListener);
				const remaining = currentEntry.environmentReferences.get(params.environmentId) - 1;
				if (remaining === 0) {
					currentEntry.environmentReferences.delete(params.environmentId);
					currentEntry.observation = {
						...currentEntry.observation,
						environmentIds: [...currentEntry.environmentReferences.keys()]
					};
					if (currentEntry.references === 0) active.delete(key);
					version++;
					publish(currentEntry, [...currentEntry.observation.environmentIds, params.environmentId]);
				} else currentEntry.environmentReferences.set(params.environmentId, remaining);
			}
		} catch (error) {
			const message = error instanceof Error ? error.message : String(error);
			options.log.warn(`${prefix} failed after ${elapsedSeconds().toFixed(1)}s: ${message}`);
			throw error;
		}
	};
	const readInstall = (matches) => {
		let latest;
		for (const entry of active.values()) if (matches(entry) && (!latest || entry.observation.updatedAtMs >= latest.updatedAtMs)) latest = entry.observation;
		return latest ? {
			...latest,
			environmentIds: [...latest.environmentIds]
		} : void 0;
	};
	return Object.assign(install, {
		readInstall: (nodeId) => readInstall((entry) => entry.observation.nodeId === nodeId),
		readInstallForEnvironment: (environmentId) => readInstall((entry) => entry.environmentReferences.has(environmentId)),
		version: () => version
	});
}
//#endregion
export { createGatewayNodeWorkerBundleInstaller };
