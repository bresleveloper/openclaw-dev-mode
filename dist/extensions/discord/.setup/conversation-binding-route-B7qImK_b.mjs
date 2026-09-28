import { m as shouldIgnoreStaleDiscordRouteBinding } from "./outbound-session-route-VulUE0yV.mjs";
import { logVerbose } from "openclaw/plugin-sdk/runtime-env";
import { resolveConfiguredBindingRoute, resolveRuntimeConversationBindingRoute } from "openclaw/plugin-sdk/conversation-binding-runtime";
//#region extensions/discord/src/monitor/conversation-binding-route.ts
function resolveDiscordConversationBindingRoute(params) {
	let runtimeRoute = resolveRuntimeConversationBindingRoute({
		route: params.route,
		touchBinding: params.touchBinding,
		conversation: {
			channel: "discord",
			accountId: params.accountId,
			conversationId: params.runtimeConversationId,
			parentConversationId: params.parentConversationId
		}
	});
	if (shouldIgnoreStaleDiscordRouteBinding({
		bindingRecord: runtimeRoute.bindingRecord,
		route: params.route
	})) {
		logVerbose(`discord: ignoring stale route binding for conversation ${params.runtimeConversationId} (${runtimeRoute.bindingRecord?.targetSessionKey} -> ${params.route.sessionKey})`);
		runtimeRoute = {
			bindingOwnerAvailable: true,
			bindingRecord: null,
			route: {
				...runtimeRoute.route,
				...params.route
			}
		};
	}
	const configuredRoute = runtimeRoute.bindingRecord ? null : resolveConfiguredBindingRoute({
		cfg: params.cfg,
		route: runtimeRoute.route,
		conversation: {
			channel: "discord",
			accountId: params.accountId,
			conversationId: params.configuredConversationId,
			parentConversationId: params.parentConversationId
		}
	});
	return {
		runtimeRoute,
		configuredRoute
	};
}
//#endregion
export { resolveDiscordConversationBindingRoute as t };
