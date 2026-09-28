import { r as resolveGlobalSet } from "./global-singleton-Dc_stLtU.mjs";
import { t as createSubsystemLogger } from "./subsystem-DleLyu58.mjs";
import { t as isPluginJsonValue } from "./host-hook-json-BdcyDerH.mjs";
//#region src/plugins/gateway-events.ts
const log = createSubsystemLogger("plugins");
const sessionsChangedHandlers = resolveGlobalSet(Symbol.for("openclaw.pluginSessionsChangedHandlers"), "plugin-registry");
function createPluginServiceGatewayEvents({ pluginId, broadcast, lease }) {
	if (!broadcast) return;
	return {
		emit: (event, payload, opts) => {
			lease.assertActive("gateway event emitter");
			if (!/^[a-z][a-z0-9_-]*$/u.test(event)) throw new Error(`invalid plugin gateway event name: ${event}`);
			if (!isPluginJsonValue(payload)) throw new Error("plugin gateway event payload must be bounded JSON");
			if (opts?.scope !== "operator.read" && opts?.scope !== "operator.write" && opts?.scope !== "operator.admin") throw new Error("plugin gateway event scope must be an operator scope");
			broadcast(`plugin.${pluginId}.${event}`, payload, opts.scope);
		},
		onSessionsChanged: (handler) => {
			lease.assertActive("gateway event subscriber");
			return lease.retain(subscribePluginSessionsChanged(handler));
		}
	};
}
function subscribePluginSessionsChanged(handler) {
	const subscription = (event) => handler(event);
	sessionsChangedHandlers.add(subscription);
	return () => {
		sessionsChangedHandlers.delete(subscription);
	};
}
function hasPluginSessionsChangedSubscribers() {
	return sessionsChangedHandlers.size > 0;
}
function queuePluginSessionsChanged(payload) {
	if (!payload || typeof payload !== "object" || Array.isArray(payload)) return;
	const source = payload;
	if (typeof source.sessionKey !== "string" || source.sessionKey.length === 0) return;
	if (sessionsChangedHandlers.size === 0) return;
	const subscriptions = [...sessionsChangedHandlers];
	const event = {
		sessionKey: source.sessionKey,
		...typeof source.agentId === "string" ? { agentId: source.agentId } : {},
		...typeof source.label === "string" ? { label: source.label } : {},
		...typeof source.displayName === "string" ? { displayName: source.displayName } : {},
		...typeof source.reason === "string" ? { reason: source.reason } : {},
		...typeof source.phase === "string" ? { phase: source.phase } : {}
	};
	queueMicrotask(() => {
		for (const handler of subscriptions) {
			if (!sessionsChangedHandlers.has(handler)) continue;
			try {
				const result = handler(event);
				Promise.resolve(result).catch((error) => {
					log.warn(`plugin sessions.changed handler failed: ${String(error)}`);
				});
			} catch (error) {
				log.warn(`plugin sessions.changed handler failed: ${String(error)}`);
			}
		}
	});
}
//#endregion
export { hasPluginSessionsChangedSubscribers as n, queuePluginSessionsChanged as r, createPluginServiceGatewayEvents as t };
