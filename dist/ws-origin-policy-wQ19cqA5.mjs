import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { n as sliceUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { r as normalizeChromeExtensionOrigin, t as checkBrowserOrigin } from "./origin-check-Dh0t_-zy.mjs";
import { l as isWebchatClient, n as isBrowserOperatorUiClient, t as isBrowserCopilotClient } from "./message-channel-DDcHHhpX.mjs";
import { n as resolveGatewayAuthPolicyGeneration } from "./auth-policy-BO43FSUR.mjs";
import { r as invalidateGatewayPolicyClient } from "./ws-policy-close-fX60H7oF.mjs";
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
const DEFAULT_PRIMARY_DELAY_MS = 750;
const DEFAULT_FALLBACK_DELAY_MS = 5e3;
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
/** One gateway-runtime router with short-lived first-connection timers. */
var NodeConnectionNotificationRouter = class {
	constructor(registry, options = {}) {
		this.registry = registry;
		this.pendingByNodeId = /* @__PURE__ */ new Map();
		this.primaryDelayMs = options.primaryDelayMs ?? DEFAULT_PRIMARY_DELAY_MS;
		this.fallbackDelayMs = options.fallbackDelayMs ?? DEFAULT_FALLBACK_DELAY_MS;
	}
	onConnected(source, isFirstConnection) {
		if (!isFirstConnection && !this.pendingByNodeId.has(source.nodeId)) return;
		const previous = this.pendingByNodeId.get(source.nodeId);
		if (previous?.timer) clearTimeout(previous.timer);
		const pending = {
			nodeId: source.nodeId,
			connId: source.connId,
			pairingIdentity: source.pairingIdentity,
			pairingGeneration: source.pairingGeneration
		};
		this.pendingByNodeId.set(source.nodeId, pending);
		this.armTimer(pending, this.primaryDelayMs, () => this.deliverPrimary(pending));
	}
	dispose() {
		for (const pending of this.pendingByNodeId.values()) if (pending.timer) clearTimeout(pending.timer);
		this.pendingByNodeId.clear();
	}
	async deliverPrimary(pending) {
		const connected = await this.registry.listCurrentConnected();
		const source = this.currentSource(pending, connected);
		if (!source) {
			this.finishAlert(pending);
			return;
		}
		const primary = this.notificationTargets(connected).filter((node) => node.lastActiveAtMs !== void 0).toSorted(compareActivity).at(0);
		const delivered = primary ? await this.notify(primary, source, pending) : false;
		if (!this.attemptIsCurrent(pending)) return;
		if (delivered) {
			this.finishAlert(pending);
			return;
		}
		this.armTimer(pending, this.fallbackDelayMs, () => this.deliverFallback(pending, primary?.connId));
	}
	async deliverFallback(pending, attemptedConnId) {
		const connected = await this.registry.listCurrentConnected();
		const source = this.currentSource(pending, connected);
		if (!source) {
			this.finishAlert(pending);
			return;
		}
		const targets = this.notificationTargets(connected).filter((node) => node.connId !== attemptedConnId);
		await Promise.all(targets.map(async (node) => await this.notify(node, source, pending)));
		if (this.attemptIsCurrent(pending)) this.finishAlert(pending);
	}
	currentSource(pending, connected) {
		if (!this.attemptIsCurrent(pending)) return;
		return connected.find((node) => node.nodeId === pending.nodeId && node.connId === pending.connId && node.pairingIdentity === pending.pairingIdentity && node.pairingGeneration === pending.pairingGeneration);
	}
	attemptIsCurrent(pending) {
		return this.pendingByNodeId.get(pending.nodeId) === pending;
	}
	finishAlert(pending) {
		if (this.attemptIsCurrent(pending)) {
			if (pending.timer) clearTimeout(pending.timer);
			this.pendingByNodeId.delete(pending.nodeId);
		}
	}
	notificationTargets(connected) {
		return connected.filter(isMacNotificationNode);
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
	armTimer(pending, delayMs, deliver) {
		if (pending.timer) clearTimeout(pending.timer);
		pending.timer = setTimeout(() => {
			pending.timer = void 0;
			deliver();
		}, delayMs);
	}
};
const routersByRegistry = /* @__PURE__ */ new WeakMap();
/** Schedules a staged alert for one newly connected node. */
function scheduleNodeConnectionNotification(registry, source, options) {
	let router = routersByRegistry.get(registry);
	if (!options.isFirstConnection && !router) return;
	if (!router) {
		router = new NodeConnectionNotificationRouter(registry);
		routersByRegistry.set(registry, router);
	}
	router.onConnected(source, options.isFirstConnection);
}
/** Cancels staged alerts owned by a gateway node registry during shutdown. */
function disposeNodeConnectionNotifications(registry) {
	const router = routersByRegistry.get(registry);
	if (!router) return;
	router.dispose();
	routersByRegistry.delete(registry);
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
function checkGatewayWsBrowserOrigin(origin, cfg) {
	return checkBrowserOrigin({
		...origin,
		allowedOrigins: cfg.gateway?.controlUi?.allowedOrigins,
		allowHostHeaderOriginFallback: cfg.gateway?.controlUi?.dangerouslyAllowHostHeaderOriginFallback === true
	});
}
/** Revocation follows committed publication; unrelated authenticated connections remain live. */
function disconnectDisallowedGatewayPolicyClients(clients, cfg) {
	const generation = resolveGatewayAuthPolicyGeneration(cfg);
	for (const client of clients) if (client.authPolicyGeneration !== void 0 && client.authPolicyGeneration !== generation) invalidateGatewayPolicyClient(client, {
		reason: "gateway-policy-changed",
		code: 4001,
		message: "gateway policy changed"
	});
	else if (client.browserOrigin && !checkGatewayWsBrowserOrigin(client.browserOrigin, cfg).ok) invalidateGatewayPolicyClient(client, {
		reason: "origin-policy-changed",
		code: 1008,
		message: "origin not allowed"
	});
}
//#endregion
export { scheduleNodeConnectionNotification as a, disposeNodeConnectionNotifications as i, disconnectDisallowedGatewayPolicyClients as n, retireDeviceTokenClients as o, resolveGatewayWsBrowserOrigin as r, checkGatewayWsBrowserOrigin as t };
