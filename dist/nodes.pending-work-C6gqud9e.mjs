import { t as ErrorCodes } from "./gateway-error-details-D85F07e9.mjs";
import { Ln as validateNodePendingDrainParams, Rn as validateNodePendingEnqueueParams } from "./src-BRUl7oDv.mjs";
import { f as errorShape } from "./error-codes-DvB36bCj.mjs";
import { t as assertValidParams } from "./validation-CFv_zneu.mjs";
import { n as respondUnavailableOnThrow } from "./response-Chzawb7u.mjs";
import { i as removeNodePendingWorkItem, n as drainNodePendingWork, r as enqueueNodePendingWork } from "./node-pending-work-DABiMyV_.mjs";
import { n as NODE_WAKE_RECONNECT_WAIT_MS, r as captureNodeWakeLifecycle, s as releaseNodeWakeLifecycle, t as NODE_WAKE_RECONNECT_RETRY_WAIT_MS } from "./node-wake-state-CWVR-GCk.mjs";
import { i as isNodePairingGenerationCurrent, n as captureNodePairingGeneration } from "./device-pairing-node-state-BxpHZHxS.mjs";
import { i as isNodePairingWorkCurrent, n as maybeWakeNodeWithApns, r as waitForNodeReconnect, t as maybeSendNodeWakeNudge } from "./nodes.wake-C0rSsIHu.mjs";
//#region src/gateway/server-methods/nodes.pending-work.ts
function respondPairingChanged(respond) {
	respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, "node pairing changed while pending work was active", {
		retryable: true,
		details: { code: "PAIRING_CHANGED" }
	}));
}
function resolveClientNodeId(client) {
	const trimmed = (client?.connect?.device?.id ?? client?.connect?.client?.id ?? "").trim();
	return trimmed.length > 0 ? trimmed : null;
}
/** Gateway handlers for queueing work until a paired node reconnects. */
const nodePendingWorkHandlers = {
	"node.pending.drain": async ({ params, respond, client, context }) => {
		if (!assertValidParams(params, validateNodePendingDrainParams, "node.pending.drain", respond)) return;
		const nodeId = resolveClientNodeId(client);
		if (!nodeId) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "node.pending.drain requires a connected device identity"));
			return;
		}
		await respondUnavailableOnThrow(respond, async () => {
			const generation = await captureNodePairingGeneration(nodeId);
			if (!generation || !await isNodePairingGenerationCurrent(generation)) {
				respondPairingChanged(respond);
				return;
			}
			const session = context.nodeRegistry.getForPairingGeneration(nodeId, generation.key);
			if (!client?.connId || session?.connId !== client.connId) {
				respondPairingChanged(respond);
				return;
			}
			const drained = drainNodePendingWork(nodeId, {
				maxItems: params.maxItems,
				includeDefaultStatus: true,
				pairingGeneration: generation.key
			});
			respond(true, {
				nodeId,
				...drained
			}, void 0);
		});
	},
	"node.pending.enqueue": async ({ params, respond, context }) => {
		if (!assertValidParams(params, validateNodePendingEnqueueParams, "node.pending.enqueue", respond)) return;
		const p = params;
		await respondUnavailableOnThrow(respond, async () => {
			const nodeId = p.nodeId.trim();
			const generation = await captureNodePairingGeneration(nodeId);
			if (!generation) {
				respondPairingChanged(respond);
				return;
			}
			const wakeLifecycle = captureNodeWakeLifecycle(nodeId, generation.key);
			try {
				if (!await isNodePairingWorkCurrent({
					nodeId,
					generation,
					lifecycle: wakeLifecycle
				})) {
					respondPairingChanged(respond);
					return;
				}
				const queued = enqueueNodePendingWork({
					nodeId,
					type: p.type,
					priority: p.priority,
					expiresInMs: p.expiresInMs,
					pairingGeneration: generation.key
				});
				let wakeTriggered = false;
				if (p.wake !== false && !queued.deduped && !context.nodeRegistry.getForPairingGeneration(nodeId, generation.key)) {
					const wakeReqId = queued.item.id;
					context.logGateway.info(`node pending wake start node=${nodeId} req=${wakeReqId} type=${queued.item.type}`);
					const cfg = context.getRuntimeConfig();
					const wake = await maybeWakeNodeWithApns(nodeId, {
						wakeReason: "node.pending",
						cfg,
						lifecycle: wakeLifecycle,
						generation
					});
					context.logGateway.info(`node pending wake stage=wake1 node=${nodeId} req=${wakeReqId} available=${wake.available} throttled=${wake.throttled} path=${wake.path} durationMs=${wake.durationMs} apnsStatus=${wake.apnsStatus ?? -1} apnsReason=${wake.apnsReason ?? "-"}`);
					wakeTriggered = wake.available;
					if (wake.available) {
						const reconnected = await waitForNodeReconnect({
							nodeId,
							context,
							timeoutMs: NODE_WAKE_RECONNECT_WAIT_MS,
							lifecycle: wakeLifecycle,
							pairingGeneration: generation.key
						});
						context.logGateway.info(`node pending wake stage=wait1 node=${nodeId} req=${wakeReqId} reconnected=${reconnected} timeoutMs=${NODE_WAKE_RECONNECT_WAIT_MS}`);
					}
					if (await isNodePairingWorkCurrent({
						nodeId,
						generation,
						lifecycle: wakeLifecycle
					}) && !context.nodeRegistry.getForPairingGeneration(nodeId, generation.key) && wake.available) {
						const retryWake = await maybeWakeNodeWithApns(nodeId, {
							force: true,
							wakeReason: "node.pending",
							cfg,
							lifecycle: wakeLifecycle,
							generation
						});
						context.logGateway.info(`node pending wake stage=wake2 node=${nodeId} req=${wakeReqId} force=true available=${retryWake.available} throttled=${retryWake.throttled} path=${retryWake.path} durationMs=${retryWake.durationMs} apnsStatus=${retryWake.apnsStatus ?? -1} apnsReason=${retryWake.apnsReason ?? "-"}`);
						if (retryWake.available) {
							const reconnected = await waitForNodeReconnect({
								nodeId,
								context,
								timeoutMs: NODE_WAKE_RECONNECT_RETRY_WAIT_MS,
								lifecycle: wakeLifecycle,
								pairingGeneration: generation.key
							});
							context.logGateway.info(`node pending wake stage=wait2 node=${nodeId} req=${wakeReqId} reconnected=${reconnected} timeoutMs=${NODE_WAKE_RECONNECT_RETRY_WAIT_MS}`);
						}
					}
					if (await isNodePairingWorkCurrent({
						nodeId,
						generation,
						lifecycle: wakeLifecycle
					}) && !context.nodeRegistry.getForPairingGeneration(nodeId, generation.key)) {
						const nudge = await maybeSendNodeWakeNudge(nodeId, {
							cfg,
							lifecycle: wakeLifecycle,
							generation
						});
						context.logGateway.info(`node pending wake nudge node=${nodeId} req=${wakeReqId} sent=${nudge.sent} throttled=${nudge.throttled} reason=${nudge.reason} durationMs=${nudge.durationMs} apnsStatus=${nudge.apnsStatus ?? -1} apnsReason=${nudge.apnsReason ?? "-"}`);
						context.logGateway.warn(`node pending wake done node=${nodeId} req=${wakeReqId} connected=false reason=not_connected`);
					} else if (await isNodePairingWorkCurrent({
						nodeId,
						generation,
						lifecycle: wakeLifecycle
					})) context.logGateway.info(`node pending wake done node=${nodeId} req=${wakeReqId} connected=true`);
				}
				if (!await isNodePairingWorkCurrent({
					nodeId,
					generation,
					lifecycle: wakeLifecycle
				})) {
					if (!queued.deduped) removeNodePendingWorkItem({
						nodeId,
						itemId: queued.item.id,
						pairingGeneration: generation.key
					});
					respondPairingChanged(respond);
					return;
				}
				respond(true, {
					nodeId,
					revision: queued.revision,
					queued: queued.item,
					wakeTriggered
				}, void 0);
			} finally {
				releaseNodeWakeLifecycle(nodeId, wakeLifecycle);
			}
		});
	}
};
//#endregion
export { nodePendingWorkHandlers };
