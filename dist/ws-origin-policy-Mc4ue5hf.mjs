import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { n as sliceUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { l as isWebchatClient, n as isBrowserOperatorUiClient, t as isBrowserCopilotClient } from "./message-channel-j-k-Nup3.mjs";
import { i as normalizeChromeExtensionOrigin, n as checkGatewayWsBrowserOrigin } from "./origin-check-BATVw76z.mjs";
import { n as isGatewayAuthGrantCurrent, r as isGatewayAuthPolicyCurrent } from "./auth-policy-DNAJam1S.mjs";
import { r as invalidateGatewayPolicyClient } from "./ws-policy-close-BgtfQbi3.mjs";
import { randomUUID } from "node:crypto";
//#region src/gateway/device-token-client-lifecycle.ts
/** Retire the connected authority held by replaced or revoked role tokens. */
function retireDeviceTokenClients(context, deviceId, roles, reason) {
	for (const role of roles) context.invalidateClientsForDevice?.(deviceId, {
		role,
		reason
	});
	queueMicrotask(() => {
		for (const role of roles) context.disconnectClientsForDevice?.(deviceId, { role });
	});
}
//#endregion
//#region src/gateway/node-connection-notifications.ts
const PRIMARY_DELAY_MS = 750;
const FALLBACK_DELAY_MS = 5e3;
function isMacNotificationNode(node) {
	const platform = node.platform?.trim().toLowerCase() ?? "";
	return (platform === "darwin" || platform.startsWith("macos")) && node.commands.includes("system.notify");
}
function compareActivity(left, right) {
	const activeDelta = (right.lastActiveAtMs ?? -1) - (left.lastActiveAtMs ?? -1);
	if (activeDelta !== 0) return activeDelta;
	return (right.presenceUpdatedAtMs ?? -1) - (left.presenceUpdatedAtMs ?? -1);
}
function connectionLabel(node) {
	const raw = normalizeOptionalString(node.displayName) ?? node.nodeId;
	return sliceUtf16Safe(raw.replace(/\s+/g, " "), 0, 80);
}
/** One Gateway-runtime router for staged first-connection alerts. */
var NodeConnectionNotificationRouter = class {
	constructor(registry, scheduler) {
		this.registry = registry;
		this.scheduler = scheduler;
		this.pendingByNodeId = /* @__PURE__ */ new Map();
	}
	onConnected(source, isFirstConnection) {
		if (!isFirstConnection && !this.pendingByNodeId.has(source.nodeId)) return;
		const pending = {
			nodeId: source.nodeId,
			connId: source.connId,
			pairingIdentity: source.pairingIdentity,
			pairingGeneration: source.pairingGeneration
		};
		this.pendingByNodeId.set(source.nodeId, pending);
		this.scheduler.schedule({
			id: `node-connection/${pending.nodeId}`,
			delayMs: PRIMARY_DELAY_MS,
			run: () => this.deliverPrimary(pending)
		});
	}
	dispose() {
		this.scheduler.beginClose();
		this.pendingByNodeId.clear();
	}
	async deliverPrimary(pending) {
		const connected = await this.registry.listCurrentConnected();
		const source = this.currentSource(pending, connected);
		if (!source) {
			this.finishAlert(pending);
			return;
		}
		const primary = connected.filter(isMacNotificationNode).filter((node) => node.lastActiveAtMs !== void 0).toSorted(compareActivity).at(0);
		const delivered = primary ? await this.notify(primary, source, pending) : false;
		if (!this.attemptIsCurrent(pending)) return;
		if (delivered) {
			this.finishAlert(pending);
			return;
		}
		this.scheduler.schedule({
			id: `node-connection/${pending.nodeId}`,
			delayMs: FALLBACK_DELAY_MS,
			run: () => this.deliverFallback(pending, primary?.connId)
		});
	}
	async deliverFallback(pending, attemptedConnId) {
		const connected = await this.registry.listCurrentConnected();
		const source = this.currentSource(pending, connected);
		if (!source) {
			this.finishAlert(pending);
			return;
		}
		const targets = connected.filter(isMacNotificationNode).filter((node) => node.connId !== attemptedConnId);
		await Promise.all(targets.map(async (node) => await this.notify(node, source, pending)));
		this.finishAlert(pending);
	}
	currentSource(pending, connected) {
		if (!this.attemptIsCurrent(pending)) return;
		return connected.find((node) => node.nodeId === pending.nodeId && node.connId === pending.connId && node.pairingIdentity === pending.pairingIdentity && node.pairingGeneration === pending.pairingGeneration);
	}
	attemptIsCurrent(pending) {
		return !this.scheduler.signal.aborted && this.pendingByNodeId.get(pending.nodeId) === pending;
	}
	finishAlert(pending) {
		if (this.attemptIsCurrent(pending)) this.pendingByNodeId.delete(pending.nodeId);
	}
	async sourceIsCurrent(pending) {
		if (!this.attemptIsCurrent(pending)) return false;
		const connected = await this.registry.listCurrentConnected();
		if (!this.currentSource(pending, connected)) return false;
		return await this.registry.isConnectionCurrentPairingState(pending.connId);
	}
	async notify(target, source, pending) {
		try {
			if (!await this.sourceIsCurrent(pending) || !this.attemptIsCurrent(pending)) return false;
			return (await this.registry.invoke({
				nodeId: target.nodeId,
				expectedConnId: target.connId,
				expectedPairingGeneration: target.pairingGeneration,
				command: "system.notify",
				params: {
					title: "Node connected",
					body: `${connectionLabel(source)} connected to OpenClaw.`,
					priority: "active",
					delivery: "auto"
				},
				timeoutMs: 1e4,
				idempotencyKey: randomUUID()
			})).ok;
		} catch {
			return false;
		}
	}
};
const routersByRegistry = /* @__PURE__ */ new WeakMap();
/** Schedules a staged alert for one newly connected node. */
function scheduleNodeConnectionNotification(registry, source, options) {
	routersByRegistry.get(registry)?.onConnected(source, options.isFirstConnection);
}
/** Registers the Gateway's alert owner and returns its shutdown cleanup. */
function startNodeConnectionNotifications(registry, scheduler) {
	const router = new NodeConnectionNotificationRouter(registry, scheduler.scope());
	routersByRegistry.set(registry, router);
	return () => {
		router.dispose();
		routersByRegistry.delete(registry);
	};
}
//#endregion
//#region src/gateway/server/ws-origin-policy.ts
/** Retain attested transport facts only for connections governed by browser-origin policy. */
function resolveGatewayWsBrowserOrigin(params) {
	if (isBrowserCopilotClient(params.client) && normalizeChromeExtensionOrigin(params.origin)) return;
	if (!params.enforceOriginCheckForAnyClient && !isBrowserOperatorUiClient(params.client) && !isWebchatClient(params.client)) return;
	return {
		requestHost: params.requestHost,
		origin: params.origin,
		isLocalClient: params.isLocalClient
	};
}
/** Revocation follows committed publication; unrelated authenticated connections remain live. */
function disconnectDisallowedGatewayPolicyClients(clients, cfg) {
	for (const client of clients) if (client.browserOrigin && !checkGatewayWsBrowserOrigin(client.browserOrigin, cfg).ok) invalidateGatewayPolicyClient(client, {
		reason: "origin-policy-changed",
		code: 1008,
		message: "origin not allowed"
	});
	else if (!isGatewayAuthPolicyCurrent(client.authPolicy, cfg)) invalidateGatewayPolicyClient(client, {
		reason: "gateway-policy-changed",
		code: 4001,
		message: "gateway policy changed",
		revokeSource: !isGatewayAuthGrantCurrent(client.authPolicy, cfg)
	});
}
//#endregion
export { retireDeviceTokenClients as a, startNodeConnectionNotifications as i, resolveGatewayWsBrowserOrigin as n, scheduleNodeConnectionNotification as r, disconnectDisallowedGatewayPolicyClients as t };
