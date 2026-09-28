import { p as listCoreAdvertisedGatewayMethodNames } from "./method-scopes-C7g7eSZh.mjs";
import { i as listLoadedChannelPlugins } from "./registry-loaded-CYq2sa_C.mjs";
import { i as GATEWAY_EVENT_UPDATE_RUN_CHANGED, n as GATEWAY_EVENT_NODE_RUNNER_INVENTORY_CHANGED, r as GATEWAY_EVENT_UPDATE_AVAILABLE, t as GATEWAY_EVENT_DEVICE_PAIR_CHANGED } from "./events-J-3spXBQ.mjs";
//#region src/gateway/server-methods-list.ts
function listChannelGatewayMethods() {
	const methods = [];
	for (const plugin of listLoadedChannelPlugins()) {
		methods.push(...plugin.gatewayMethods ?? []);
		for (const descriptor of plugin.gatewayMethodDescriptors ?? []) methods.push(descriptor.name);
	}
	return methods;
}
/** Returns the de-duplicated gateway method catalog advertised through method-list APIs. */
function listGatewayMethods() {
	return Array.from(/* @__PURE__ */ new Set([...listCoreAdvertisedGatewayMethodNames(), ...listChannelGatewayMethods()]));
}
/** Gateway event names that clients can subscribe to or receive over the wire. */
const GATEWAY_EVENTS = [
	"connect.challenge",
	"agent",
	"chat",
	"chat.metadata.changed",
	"models.snapshot",
	"ui.command",
	"session.approval",
	"session.message",
	"session.observer",
	"session.operation",
	"session.sharing",
	"session.sharing.evidence",
	"session.suggestion",
	"session.typing",
	"session.tool",
	"sessions.changed",
	"controlUi.sessionPullRequests.changed",
	"plugins.controlUi.changed",
	"presence",
	"tick",
	"talk.mode",
	"talk.event",
	"talk.voice.change",
	"shutdown",
	"gateway.suspension",
	"health",
	"heartbeat",
	"cron",
	"task",
	"task.suggestion",
	"node.pair.requested",
	"node.pair.resolved",
	"node.presence",
	"node.hostStats",
	GATEWAY_EVENT_NODE_RUNNER_INVENTORY_CHANGED,
	"node.invoke.cancel",
	"node.invoke.input",
	"node.invoke.request",
	GATEWAY_EVENT_DEVICE_PAIR_CHANGED,
	"device.pair.requested",
	"device.pair.resolved",
	"device.pair.setup.completed",
	"device.pair.setup.deliveryUncertain",
	"users.prefs.changed",
	"skills.changed",
	"plugins.changed",
	"plugins.install.progress",
	"voicewake.changed",
	"voicewake.routing.changed",
	"exec.approval.requested",
	"exec.approval.resolved",
	"question.requested",
	"question.resolved",
	"plugin.approval.requested",
	"plugin.approval.resolved",
	"openclaw.approval.requested",
	"openclaw.approval.resolved",
	"terminal.data",
	"terminal.exit",
	GATEWAY_EVENT_UPDATE_AVAILABLE,
	GATEWAY_EVENT_UPDATE_RUN_CHANGED,
	"portal.changed",
	"progressCard.changed",
	"mentions.changed"
];
//#endregion
export { listGatewayMethods as n, GATEWAY_EVENTS as t };
