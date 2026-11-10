import { _ as shouldIgnoreStaleDiscordRouteBinding } from "./outbound-session-route-BtUpGBTb.mjs";
import { logVerbose } from "openclaw/plugin-sdk/runtime-env";
import { inspectRuntimeConversationBindingRoute, resolveConfiguredBindingRoute, resolveRuntimeConversationBindingRouteAsync } from "openclaw/plugin-sdk/conversation-binding-runtime";
//#region extensions/discord/src/monitor/conversation-binding-route.ts
function prepareDiscordBindingRoute(params) {
	let baseRoute;
	return {
		input: {
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
		},
		getBaseRoute: () => baseRoute
	};
}
function resolveDiscordConversationBindingRoute(params) {
	const prepared = prepareDiscordBindingRoute(params);
	return applyDiscordBindingRoute(params, inspectRuntimeConversationBindingRoute({
		...prepared.input,
		inspection: params.inspection
	}), prepared.getBaseRoute());
}
async function resolveDiscordConversationBindingRouteAsync(params) {
	const prepared = prepareDiscordBindingRoute(params);
	return applyDiscordBindingRoute(params, await resolveRuntimeConversationBindingRouteAsync(prepared.input), prepared.getBaseRoute());
}
function applyDiscordBindingRoute(params, resolvedRuntimeRoute, baseRoute) {
	let runtimeRoute = resolvedRuntimeRoute;
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
export { resolveDiscordConversationBindingRouteAsync as n, resolveDiscordConversationBindingRoute as t };
