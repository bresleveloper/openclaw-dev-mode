import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { Bn as validateNodePendingEnqueueParams, zn as validateNodePendingDrainParams } from "./src-l2dWvEsN.mjs";
import { t as ErrorCodes } from "./gateway-error-details-DIefe7Zy.mjs";
import { f as errorShape } from "./error-codes-Dh56LniQ.mjs";
import { t as assertValidParams } from "./validation-Bu27N0nv.mjs";
import { n as respondUnavailableOnThrow } from "./response-BKwLtoRW.mjs";
import { i as removeNodePendingWorkItem, n as drainNodePendingWork, r as enqueueNodePendingWork } from "./node-pending-work-B3XaigaX.mjs";
import { r as captureNodeWakeLifecycle, s as releaseNodeWakeLifecycle } from "./node-wake-state-CWVR-GCk.mjs";
import { i as isNodePairingGenerationCurrent, n as captureNodePairingGeneration } from "./device-pairing-node-state-BWkfmloU.mjs";
import { a as isNodePairingWorkCurrent, n as maybeSendNodeWakeNudge, t as wakeNodeForReconnect } from "./nodes.wake-reconnect-CUdkaJLh.mjs";
//#region src/gateway/server-methods/nodes.pending-work.ts
function respondPairingChanged(respond) {
	respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, "node pairing changed while pending work was active", {
		retryable: true,
		details: { code: "PAIRING_CHANGED" }
	}));
}
const nodePendingWorkHandlers = {
	"node.pending.drain": async ({ params, respond, client, context }) => {
		if (!assertValidParams(params, validateNodePendingDrainParams, "node.pending.drain", respond)) return;
		const nodeId = normalizeOptionalString(client?.connect?.device?.id ?? client?.connect?.client?.id);
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
					for (const force of [false, true]) {
						const wake = await wakeNodeForReconnect({
							nodeId,
							context,
							cfg,
							generation,
							lifecycle: wakeLifecycle,
							requestId: wakeReqId,
							source: "pending",
							force
						});
						if (force) break;
						wakeTriggered = wake.available;
						if (!await isNodePairingWorkCurrent({
							nodeId,
							generation,
							lifecycle: wakeLifecycle
						}) || context.nodeRegistry.getForPairingGeneration(nodeId, generation.key) || !wake.available) break;
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
