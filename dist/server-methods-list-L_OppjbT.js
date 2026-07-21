import { o as listCoreAdvertisedGatewayMethodNames } from "./core-descriptors-DRUtdasO.js";
import { r as listLoadedChannelPlugins } from "./registry-loaded-C1Zaf4Uh.js";
import { t as GATEWAY_AUX_METHODS } from "./server-aux-methods-oZh-aSQp.js";
import { t as GATEWAY_EVENT_UPDATE_AVAILABLE } from "./events-CrZXFXYx.js";
//#region src/gateway/server-methods-list.ts
/** Lists core methods intentionally advertised to gateway clients. */
function listCoreGatewayMethods() {
	return listCoreAdvertisedGatewayMethodNames();
}
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
	return Array.from(/* @__PURE__ */ new Set([
		...listCoreGatewayMethods(),
		...GATEWAY_AUX_METHODS,
		...listChannelGatewayMethods()
	]));
}
/** Gateway event names that clients can subscribe to or receive over the wire. */
const GATEWAY_EVENTS = [
	"connect.challenge",
	"agent",
	"chat",
	"session.message",
	"session.operation",
	"session.tool",
	"sessions.changed",
	"presence",
	"tick",
	"talk.mode",
	"talk.event",
	"shutdown",
	"health",
	"heartbeat",
	"cron",
	"task",
	"node.pair.requested",
	"node.pair.resolved",
	"node.invoke.request",
	"device.pair.requested",
	"device.pair.resolved",
	"voicewake.changed",
	"voicewake.routing.changed",
	"exec.approval.requested",
	"exec.approval.resolved",
	"plugin.approval.requested",
	"plugin.approval.resolved",
	"terminal.data",
	"terminal.exit",
	GATEWAY_EVENT_UPDATE_AVAILABLE
];
//#endregion
export { listGatewayMethods as n, GATEWAY_EVENTS as t };
