import { b as NODE_WORKER_DESKTOP_STREAM_COMMAND, y as NODE_WORKER_DESKTOP_LAUNCH_COMMAND } from "./node-commands-BLhGKTZa.mjs";
import { t as raceNodeWorkerOperation } from "./node-worker-abort-BBj2optb.mjs";
import { t as DesktopSessionStaleOwnerError } from "./session-registry-CuBlkFuF.mjs";
import { n as snapshotWorkerNodeCarrierBinding, t as isWorkerNodeCarrierBindingCurrent } from "./node-carrier-binding-Ghb74wmp.mjs";
import { isDeepStrictEqual } from "node:util";
//#region src/gateway/worker-environments/node-desktop-carrier.ts
const APP_LAUNCH_TIMEOUT_MS = 3e4;
function snapshotNodeDesktopBinding(record) {
	const message = "Worker environment node desktop owner is not active";
	const binding = snapshotWorkerNodeCarrierBinding(record, message);
	if (!record.desktop) throw new Error(message);
	return {
		...binding,
		desktop: structuredClone(record.desktop)
	};
}
function isBindingCurrent(store, binding) {
	const current = store.get(binding.environmentId);
	return Boolean(current && isWorkerNodeCarrierBindingCurrent(current, binding) && current.desktop !== null && isDeepStrictEqual(current.desktop, binding.desktop));
}
function invocationError(result) {
	const message = result.error?.message?.trim();
	return new Error(message || "worker node desktop stream closed before attachment");
}
function requireLaunchReady(result) {
	if (!result.ok) throw invocationError(result);
	let payload;
	try {
		payload = result.payloadJSON ? JSON.parse(result.payloadJSON) : void 0;
	} catch {
		throw new Error("Worker environment node desktop launcher returned malformed JSON");
	}
	if (!payload || typeof payload !== "object" || Array.isArray(payload) || Object.keys(payload).length !== 1 || !("status" in payload) || payload.status !== "ready") throw new Error("Worker environment node desktop launcher returned an invalid result");
}
function launchKey(binding, app) {
	return `${binding.environmentId}\0${app.id}`;
}
/** Carries one durable worker environment's desktop over its private node connection. */
function createWorkerNodeDesktopCarrier(options) {
	let runtime;
	const ownedEnvironmentIds = /* @__PURE__ */ new Set();
	const activeStreams = /* @__PURE__ */ new Set();
	const activeLaunches = /* @__PURE__ */ new Map();
	const bindingIsCurrent = (binding, capturedRuntime, node) => runtime === capturedRuntime && isBindingCurrent(options.store, binding) && capturedRuntime.transport.isCurrent(node, false);
	const findCurrentNode = async (binding, capturedRuntime, signal) => {
		signal.throwIfAborted();
		const node = await raceNodeWorkerOperation(capturedRuntime.transport.getCurrentNode(binding.nodeDeviceId), signal, {
			aborted: "Worker environment node desktop operation aborted",
			failed: "Node desktop operation failed"
		});
		signal.throwIfAborted();
		if (!node || !bindingIsCurrent(binding, capturedRuntime, node)) throw new Error("Worker environment node desktop connection is not current");
		return node;
	};
	const stopLaunch = async (active) => {
		active.controller.abort(/* @__PURE__ */ new Error("Worker environment node desktop owner stopped"));
		await active.operation.catch(() => void 0);
	};
	const stopOwnedOperations = async (environmentId, ownerEpoch) => {
		const streams = [...activeStreams].filter((active) => active.binding.environmentId === environmentId && (ownerEpoch === void 0 || active.binding.ownerEpoch === ownerEpoch));
		const launches = [...activeLaunches.values()].filter((active) => active.binding.environmentId === environmentId && (ownerEpoch === void 0 || active.binding.ownerEpoch === ownerEpoch));
		await Promise.all([...streams.map((active) => active.stream.stop()), ...launches.map(stopLaunch)]);
	};
	const claimOwner = async (binding) => {
		let advanced;
		try {
			advanced = options.desktopRegistry.claimOwnerEpoch(binding.environmentId, binding.ownerEpoch);
		} catch (error) {
			if (error instanceof DesktopSessionStaleOwnerError) throw new Error("Worker environment node desktop owner epoch is stale", { cause: error });
			throw error;
		}
		if (!advanced) return;
		const staleStreams = [...activeStreams].filter((active) => active.binding.environmentId === binding.environmentId && active.binding.ownerEpoch < binding.ownerEpoch);
		const staleLaunches = [...activeLaunches.values()].filter((active) => active.binding.environmentId === binding.environmentId && active.binding.ownerEpoch < binding.ownerEpoch);
		await options.desktopRegistry.stopSuperseded(binding.environmentId, binding.ownerEpoch);
		await Promise.all([...staleStreams.map((active) => active.stream.stop()), ...staleLaunches.map(stopLaunch)]);
	};
	const observe = async (request) => {
		const binding = snapshotNodeDesktopBinding(request.record);
		const active = {
			binding,
			stream: options.desktopRegistry.createStream({
				sourceKey: binding.environmentId,
				ownerEpoch: binding.ownerEpoch,
				onStopped: () => {
					activeStreams.delete(active);
				}
			})
		};
		const signal = request.requester?.signal ? AbortSignal.any([active.stream.signal, request.requester.signal]) : active.stream.signal;
		const assertRequesterCurrent = () => {
			signal.throwIfAborted();
			if (request.requester?.isCurrent() === false) throw new Error("Desktop observer connection is no longer current");
		};
		assertRequesterCurrent();
		activeStreams.add(active);
		ownedEnvironmentIds.add(binding.environmentId);
		try {
			await claimOwner(binding);
			assertRequesterCurrent();
			await options.desktopRegistry.activate({
				sourceKey: binding.environmentId,
				ownerEpoch: binding.ownerEpoch,
				teardown: async () => {
					await stopOwnedOperations(binding.environmentId, binding.ownerEpoch);
				}
			});
			assertRequesterCurrent();
			const capturedRuntime = runtime;
			if (!capturedRuntime) throw new Error("Worker environment node desktop runtime is unavailable");
			const node = await findCurrentNode(binding, capturedRuntime, signal);
			assertRequesterCurrent();
			if (!active.stream.reserve()) throw new Error("Worker environment desktop observer limit reached");
			const ticket = capturedRuntime.streamBroker.mint({
				nodeId: node.nodeId,
				connId: node.connId,
				pairingGeneration: node.pairingGeneration
			});
			const attached = await active.stream.connect(ticket, () => capturedRuntime.transport.invoke({
				node,
				command: NODE_WORKER_DESKTOP_STREAM_COMMAND,
				params: {
					ticket: ticket.ticket,
					attachPath: ticket.attachPath,
					port: binding.desktop.port,
					...binding.desktop.username ? { username: binding.desktop.username } : {},
					...binding.desktop.passwordFilePath ? { passwordFilePath: binding.desktop.passwordFilePath } : {}
				},
				timeoutMs: 0,
				signal,
				isDispatchAuthorized: () => !signal.aborted && request.requester?.isCurrent() !== false && bindingIsCurrent(binding, capturedRuntime, node)
			}));
			assertRequesterCurrent();
			if (!bindingIsCurrent(binding, capturedRuntime, node)) throw new Error("Worker environment node desktop owner changed before attachment");
			const expectedAuth = binding.desktop.username ? "ard-account" : "vnc-password";
			if (attached.auth !== expectedAuth || !attached.vncPassword) throw new Error("Worker environment node desktop did not provide managed authentication");
			const { DESKTOP_OBSERVE_PATH, mintDesktopObserverToken } = await import("./observe-bridge-CSkgehV0.mjs");
			assertRequesterCurrent();
			if (!bindingIsCurrent(binding, capturedRuntime, node)) throw new Error("Worker environment node desktop owner changed before publication");
			const attachment = active.stream.publish();
			if (!attachment) throw new Error("Worker environment node desktop owner changed before publication");
			const issuedAtMs = Date.now();
			const minted = mintDesktopObserverToken({
				sourceKey: binding.environmentId,
				ownerEpoch: binding.ownerEpoch,
				control: request.control,
				requester: request.requester,
				attachment,
				onAbandon: active.stream.stop,
				preauth: binding.desktop.username ? {
					auth: "ard-account",
					credentials: {
						username: binding.desktop.username,
						password: attached.vncPassword
					}
				} : {
					auth: "vnc-password",
					credentials: { password: attached.vncPassword }
				},
				nowMs: issuedAtMs
			});
			active.stream.expireAt(minted.expiresAtMs);
			return {
				transport: "rfb",
				wsPath: `${DESKTOP_OBSERVE_PATH}?token=${minted.token}`,
				expiresAtMs: minted.expiresAtMs,
				control: request.control
			};
		} catch (error) {
			await active.stream.stop();
			throw error;
		}
	};
	const launchApp = (request) => {
		const binding = snapshotNodeDesktopBinding(request.record);
		const advertisedApp = binding.desktop.apps?.find((app) => app.id === request.app.id);
		if (!advertisedApp || !isDeepStrictEqual(advertisedApp, request.app)) return Promise.reject(/* @__PURE__ */ new Error("Worker environment node desktop app descriptor is not current"));
		const app = structuredClone(advertisedApp);
		const key = launchKey(binding, app);
		const previous = activeLaunches.get(key);
		if (previous?.binding.ownerEpoch === binding.ownerEpoch && isDeepStrictEqual(previous.app, app)) return previous.operation;
		const controller = new AbortController();
		const operation = Promise.resolve().then(async () => {
			await claimOwner(binding);
			if (previous) {
				previous.controller.abort(/* @__PURE__ */ new Error("Worker environment node desktop launch owner replaced"));
				await previous.operation.catch(() => void 0);
			}
			controller.signal.throwIfAborted();
			const capturedRuntime = runtime;
			if (!capturedRuntime) throw new Error("Worker environment node desktop runtime is unavailable");
			const node = await findCurrentNode(binding, capturedRuntime, controller.signal);
			if (activeLaunches.get(key) !== entry) throw new Error("Worker environment node desktop launch owner was replaced");
			requireLaunchReady(await capturedRuntime.transport.invoke({
				node,
				command: NODE_WORKER_DESKTOP_LAUNCH_COMMAND,
				params: app,
				timeoutMs: APP_LAUNCH_TIMEOUT_MS,
				signal: controller.signal,
				isDispatchAuthorized: () => !controller.signal.aborted && bindingIsCurrent(binding, capturedRuntime, node)
			}));
			if (!bindingIsCurrent(binding, capturedRuntime, node)) throw new Error("Worker environment node desktop launch owner changed");
		});
		const entry = {
			binding,
			app,
			controller,
			operation
		};
		activeLaunches.set(key, entry);
		ownedEnvironmentIds.add(binding.environmentId);
		operation.finally(() => {
			if (activeLaunches.get(key) === entry) activeLaunches.delete(key);
		}).catch(() => void 0);
		return operation;
	};
	const stop = async (environmentId, ownerEpoch) => {
		await Promise.all([options.desktopRegistry.stop(environmentId, ownerEpoch), stopOwnedOperations(environmentId, ownerEpoch)]);
	};
	const stopAll = async () => {
		await Promise.all([...ownedEnvironmentIds].map((environmentId) => stop(environmentId)));
	};
	return {
		bindRuntime(next) {
			runtime = next;
		},
		launchApp,
		observe,
		stop,
		stopAll
	};
}
//#endregion
export { createWorkerNodeDesktopCarrier };
