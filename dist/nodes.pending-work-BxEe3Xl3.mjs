import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { Ng as errorShape, ar as validateNodePendingEnqueueParams, ir as validateNodePendingDrainParams } from "./src-pLJQA6J5.mjs";
import { t as ErrorCodes } from "./gateway-error-details-Cl-eEOTQ.mjs";
import { r as captureNodeWakeLifecycle, s as releaseNodeWakeLifecycle } from "./node-wake-state-CWVR-GCk.mjs";
import { n as respondUnavailableOnThrow } from "./response-ajmyFl3V.mjs";
import { t as assertValidParams } from "./validation--xIH1Pj-.mjs";
import { i as removeNodePendingWorkItem, n as drainNodePendingWork, r as enqueueNodePendingWork } from "./node-pending-work-_S6wIYOp.mjs";
import { n as captureNodePairingGeneration } from "./device-pairing-node-state-DRDqvTKy.mjs";
import { a as isNodePairingWorkCurrent, n as maybeSendNodeWakeNudge, s as respondPairingChanged, t as wakeNodeForReconnect } from "./nodes.wake-reconnect-D6XkTwb8.mjs";
//#region src/gateway/server-methods/nodes.pending-work.ts
const nodePendingWorkHandlers = {
	"node.pending.drain": async ({ params, respond, client, context }) => {
		if (!assertValidParams(params, validateNodePendingDrainParams, "node.pending.drain", respond)) return;
		const nodeId = normalizeOptionalString(client?.connect?.device?.id ?? client?.connect?.client?.id);
		if (!nodeId) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "node.pending.drain requires a connected device identity"));
			return;
		}
		await respondUnavailableOnThrow(respond, async () => {
			const generation = context.nodeRegistry.get(nodeId)?.pairingGeneration;
			if (!generation || !client?.connId || !await context.nodeRegistry.isConnectionCurrentPairingState(client.connId)) {
				respondPairingChanged(respond, "pending work");
				return;
			}
			if (context.nodeRegistry.getForPairingGeneration(nodeId, generation)?.connId !== client.connId) {
				respondPairingChanged(respond, "pending work");
				return;
			}
			const drained = drainNodePendingWork(nodeId, {
				maxItems: params.maxItems,
				includeDefaultStatus: true,
				pairingGeneration: generation
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
				respondPairingChanged(respond, "pending work");
				return;
			}
			const wakeLifecycle = captureNodeWakeLifecycle(nodeId, generation.key);
			const isCurrent = () => isNodePairingWorkCurrent({
				nodeId,
				generation,
				lifecycle: wakeLifecycle
			});
			try {
				if (!await isCurrent()) {
					respondPairingChanged(respond, "pending work");
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
						if (!await isCurrent() || context.nodeRegistry.getForPairingGeneration(nodeId, generation.key) || !wake.available) break;
					}
					if (await isCurrent() && !context.nodeRegistry.getForPairingGeneration(nodeId, generation.key)) {
						const nudge = await maybeSendNodeWakeNudge(nodeId, {
							cfg,
							lifecycle: wakeLifecycle,
							generation
						});
						context.logGateway.info(`node pending wake nudge node=${nodeId} req=${wakeReqId} sent=${nudge.sent} throttled=${nudge.throttled} reason=${nudge.reason} durationMs=${nudge.durationMs} apnsStatus=${nudge.apnsStatus ?? -1} apnsReason=${nudge.apnsReason ?? "-"}`);
						context.logGateway.warn(`node pending wake done node=${nodeId} req=${wakeReqId} connected=false reason=not_connected`);
					} else if (await isCurrent()) context.logGateway.info(`node pending wake done node=${nodeId} req=${wakeReqId} connected=true`);
				}
				if (!await isCurrent()) {
					if (!queued.deduped) removeNodePendingWorkItem({
						nodeId,
						itemId: queued.item.id,
						pairingGeneration: generation.key
					});
					respondPairingChanged(respond, "pending work");
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
