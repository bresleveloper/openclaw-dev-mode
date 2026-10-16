import { m as shouldIgnoreStaleDiscordRouteBinding } from "./outbound-session-route-BvBH4LC6.mjs";
import { logVerbose } from "openclaw/plugin-sdk/runtime-env";
import { resolveConfiguredBindingRoute, resolveRuntimeConversationBindingRoute } from "openclaw/plugin-sdk/conversation-binding-runtime";
//#region extensions/discord/src/monitor/conversation-binding-route.ts
function resolveDiscordConversationBindingRoute(params) {
	let baseRoute;
	let runtimeRoute = resolveRuntimeConversationBindingRoute({
		resolveRoute: (selection) => {
			baseRoute = params.resolveRoute(selection);
			return baseRoute;
		},
		touchBinding: params.touchBinding,
		conversation: {
			channel: "discord",
			accountId: params.accountId,
			conversationId: params.runtimeConversationId,
			parentConversationId: params.parentConversationId
		}
	});
	const route = baseRoute ?? runtimeRoute.route;
	if (shouldIgnoreStaleDiscordRouteBinding({
		bindingRecord: runtimeRoute.bindingRecord,
		route
	})) {
		logVerbose(`discord: ignoring stale route binding for conversation ${params.runtimeConversationId} (${runtimeRoute.bindingRecord?.targetSessionKey} -> ${route.sessionKey})`);
		runtimeRoute = {
			bindingOwnerAvailable: true,
			bindingRecord: null,
			route: {
				...runtimeRoute.route,
				...route
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
