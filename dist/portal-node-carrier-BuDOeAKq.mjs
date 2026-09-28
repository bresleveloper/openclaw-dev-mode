import { S as NODE_WORKER_PORTAL_STREAM_COMMAND } from "./node-commands-BLhGKTZa.mjs";
import { t as raceNodeWorkerOperation } from "./node-worker-abort-BBj2optb.mjs";
import { n as snapshotWorkerNodeCarrierBinding, t as isWorkerNodeCarrierBindingCurrent } from "./node-carrier-binding-Ghb74wmp.mjs";
//#region src/gateway/worker-environments/portal-node-carrier.ts
const UNSUPPORTED_NODE_PORTAL_MESSAGE = "Portals require a current cloud-worker node with portal stream support; move the session back to the gateway with sessions.move";
/** Opens one ticketed node connection per request while its durable portal owner remains current. */
function createWorkerNodePortalCarrier(options) {
	let runtime;
	const activePortals = /* @__PURE__ */ new Set();
	const bindingIsCurrent = (binding, capturedRuntime, node) => runtime === capturedRuntime && isWorkerNodeCarrierBindingCurrent(options.store.get(binding.environmentId), binding) && node.workerHost.portalStream === 1 && capturedRuntime.transport.isCurrent(node, false);
	const findCurrentNode = async (binding, capturedRuntime, signal) => {
		const discovery = capturedRuntime.transport.getCurrentNode(binding.nodeDeviceId);
		const node = signal ? await raceNodeWorkerOperation(discovery, signal, { aborted: "Worker environment node portal owner stopped" }) : await discovery;
		signal?.throwIfAborted();
		if (!node || !bindingIsCurrent(binding, capturedRuntime, node)) throw new Error(UNSUPPORTED_NODE_PORTAL_MESSAGE);
		return node;
	};
	const retireStream = (active) => {
		if (active.stopped) return;
		active.stopped = true;
		active.ticket?.cancel();
		active.controller.abort(/* @__PURE__ */ new Error("Worker environment node portal stream stopped"));
		active.stream?.destroy();
		active.portal.streams.delete(active);
	};
	const stopStream = async (active) => {
		retireStream(active);
		await active.invocation?.catch(() => void 0);
	};
	const closePortal = async (portal) => {
		if (portal.closed) return;
		portal.closed = true;
		portal.controller.abort(/* @__PURE__ */ new Error("Worker environment node portal owner stopped"));
		activePortals.delete(portal);
		await Promise.all([...portal.streams].map(stopStream));
	};
	const connectPortal = async (portal, remotePort) => {
		const capturedRuntime = runtime;
		if (!capturedRuntime || portal.closed || portal.controller.signal.aborted) throw new Error(UNSUPPORTED_NODE_PORTAL_MESSAGE);
		const active = {
			portal,
			controller: new AbortController(),
			stopped: false
		};
		portal.streams.add(active);
		try {
			const node = await findCurrentNode(portal.binding, capturedRuntime, active.controller.signal);
			active.ticket = capturedRuntime.streamBroker.mintPortal({
				nodeId: node.nodeId,
				connId: node.connId,
				pairingGeneration: node.pairingGeneration
			});
			active.invocation = capturedRuntime.transport.invoke({
				node,
				command: NODE_WORKER_PORTAL_STREAM_COMMAND,
				params: {
					ticket: active.ticket.ticket,
					attachPath: active.ticket.attachPath,
					port: remotePort
				},
				timeoutMs: 0,
				signal: active.controller.signal,
				isDispatchAuthorized: () => !portal.closed && bindingIsCurrent(portal.binding, capturedRuntime, node)
			});
			const invocationFinished = active.invocation.then((result) => {
				throw new Error(result.error?.message?.trim() || "Worker environment node portal closed before attachment");
			});
			invocationFinished.catch(() => void 0);
			active.stream = (await Promise.race([active.ticket.attached, invocationFinished])).stream;
			if (portal.closed || !bindingIsCurrent(portal.binding, capturedRuntime, node)) throw new Error("Worker environment node portal owner changed before attachment");
			active.stream.once("close", () => retireStream(active));
			active.invocation.finally(() => retireStream(active)).catch(() => void 0);
			return active.stream;
		} catch (error) {
			await stopStream(active);
			throw error;
		}
	};
	return {
		bindRuntime(next) {
			if (runtime && runtime !== next) for (const portal of activePortals) for (const stream of portal.streams) retireStream(stream);
			runtime = next;
		},
		async supports(environmentId, ownerEpoch) {
			const capturedRuntime = runtime;
			if (!capturedRuntime) return false;
			try {
				const binding = snapshotWorkerNodeCarrierBinding(options.store.get(environmentId), UNSUPPORTED_NODE_PORTAL_MESSAGE, ownerEpoch);
				await findCurrentNode(binding, capturedRuntime);
				return true;
			} catch {
				return false;
			}
		},
		async open(request) {
			const binding = snapshotWorkerNodeCarrierBinding(options.store.get(request.environmentId), UNSUPPORTED_NODE_PORTAL_MESSAGE, request.ownerEpoch);
			const capturedRuntime = runtime;
			if (!capturedRuntime) throw new Error(UNSUPPORTED_NODE_PORTAL_MESSAGE);
			const portal = {
				binding,
				controller: new AbortController(),
				streams: /* @__PURE__ */ new Set(),
				closed: false
			};
			activePortals.add(portal);
			try {
				await findCurrentNode(binding, capturedRuntime, portal.controller.signal);
				return {
					connect: () => connectPortal(portal, request.remotePort),
					close: () => closePortal(portal)
				};
			} catch (error) {
				await closePortal(portal);
				throw error;
			}
		},
		async stop(environmentId, ownerEpoch) {
			await Promise.all([...activePortals].filter((portal) => portal.binding.environmentId === environmentId && (ownerEpoch === void 0 || portal.binding.ownerEpoch === ownerEpoch)).map(closePortal));
		},
		async stopAll() {
			await Promise.all([...activePortals].map(closePortal));
		}
	};
}
//#endregion
export { createWorkerNodePortalCarrier };
