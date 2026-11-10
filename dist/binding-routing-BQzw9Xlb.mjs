import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { s as raceWithTimeout } from "./src-Bzfi3cQM.mjs";
import { r as buildAgentMainSessionKey } from "./incognito-session-key-BWpn88lo.mjs";
import { M as parseAgentSessionKey, l as resolveAgentIdFromSessionKey } from "./session-key-CSDERtm3.mjs";
import { t as warnPluginSdkDeprecation } from "./sdk-deprecation-DjTmOhOX.mjs";
import { i as logVerbose } from "./globals-XVSoVbNQ.mjs";
import { n as deriveLastRoutePolicy } from "./resolve-route-DvaXhzgP.mjs";
import { C as readSessionBindingInspectionConversation } from "./current-conversation-bindings.kernel-CQnqjy0h.mjs";
import { c as withConversationBindingRouteFacts, o as resolveConversationBindingAgentId, r as projectConfiguredConversationBindingRouteFacts, s as resolveConversationBindingSelection } from "./conversation-binding-route-facts-CtoNotaw.mjs";
import { n as inspectSessionBindingByConversation, t as getSessionBindingService } from "./session-binding-service-ByKk9LiJ.mjs";
import { t as resolveConfiguredBinding } from "./configured-binding-registry-QGs3UeEc.mjs";
import { t as ensureConfiguredBindingTargetReady } from "./binding-targets-CTP_yJ8f.mjs";
//#region src/channels/plugins/binding-routing.ts
const CONFIGURED_BINDING_ROUTE_READY_TIMEOUT_MS = 3e4;
function resolveConfiguredBindingConversationRef(params) {
	const { channel, accountId, conversationId, parentConversationId } = "conversation" in params ? params.conversation : params;
	return {
		channel,
		accountId,
		conversationId,
		...parentConversationId !== void 0 ? { parentConversationId } : {}
	};
}
function resolveConfiguredBindingRoute(params) {
	const bindingResolution = resolveConfiguredBinding({
		cfg: params.cfg,
		conversation: resolveConfiguredBindingConversationRef(params)
	}) ?? null;
	const boundSessionKey = bindingResolution?.statefulTarget.sessionKey.trim();
	if (!bindingResolution || !boundSessionKey) return {
		bindingResolution,
		route: projectConfiguredConversationBindingRouteFacts(params.route)
	};
	const boundAgentId = resolveAgentIdFromSessionKey(boundSessionKey, bindingResolution.statefulTarget.agentId);
	return {
		bindingResolution,
		boundSessionKey,
		boundAgentId,
		route: projectConfiguredConversationBindingRouteFacts({
			...params.route,
			sessionKey: boundSessionKey,
			agentId: boundAgentId,
			lastRoutePolicy: deriveLastRoutePolicy({
				sessionKey: boundSessionKey,
				mainSessionKey: params.route.mainSessionKey
			}),
			matchedBy: "binding.channel"
		})
	};
}
function selectRuntimeConversationBindingRoute(inspection) {
	const selection = resolveConversationBindingSelection(inspection.status === "available" ? inspection.binding : null);
	const bindingRecord = selection.kind === "none" ? null : selection.binding;
	const explicitAgentId = selection.kind === "agent" ? parseAgentSessionKey(selection.sessionKey)?.agentId ?? normalizeOptionalString(selection.binding.metadata?.agentId) : void 0;
	const boundAgentId = selection.kind === "agent" && explicitAgentId ? resolveConversationBindingAgentId(selection.binding, explicitAgentId) : void 0;
	return {
		selection,
		routeSelection: {
			inspection,
			bindingOwnerAvailable: inspection.status === "available",
			bindingRecord,
			boundAgentId
		}
	};
}
/** Projects prepared ownership facts without reading or changing binding storage. */
function inspectRuntimeConversationBindingRoute(params) {
	const { inspection } = params;
	const { selection, routeSelection } = selectRuntimeConversationBindingRoute(inspection);
	const { bindingRecord } = routeSelection;
	const baseRoute = params.resolveRoute ? params.resolveRoute(routeSelection) : params.route;
	const inspectedConversation = readSessionBindingInspectionConversation(inspection);
	if (inspection.status === "unavailable") return {
		bindingOwnerAvailable: false,
		bindingRecord: null,
		route: inspectedConversation ? withConversationBindingRouteFacts({ ...baseRoute }, { kind: "unavailable" }, baseRoute.agentId, inspectedConversation) : baseRoute
	};
	const conversation = inspectedConversation ?? inspection.binding?.conversation;
	const observe = (route) => conversation ? withConversationBindingRouteFacts(route, selection, baseRoute.agentId, conversation) : route;
	if (selection.kind !== "agent") {
		if (selection.kind === "none" && selection.ignoredCronSessionKey) logVerbose(`ignored runtime conversation binding to isolated cron run session ${selection.ignoredCronSessionKey}`);
		return {
			bindingOwnerAvailable: true,
			bindingRecord,
			...selection.kind === "plugin" ? { pluginId: selection.pluginId } : {},
			route: observe({ ...baseRoute })
		};
	}
	const boundSessionKey = selection.sessionKey;
	const resolvedBoundAgentId = resolveConversationBindingAgentId(selection.binding, baseRoute.agentId);
	const mainSessionKey = resolvedBoundAgentId === baseRoute.agentId ? baseRoute.mainSessionKey : buildAgentMainSessionKey({
		agentId: resolvedBoundAgentId,
		mainKey: parseAgentSessionKey(baseRoute.mainSessionKey)?.rest
	});
	return {
		bindingOwnerAvailable: true,
		bindingRecord,
		boundSessionKey,
		boundAgentId: resolvedBoundAgentId,
		route: observe({
			...baseRoute,
			sessionKey: boundSessionKey,
			agentId: resolvedBoundAgentId,
			mainSessionKey,
			lastRoutePolicy: deriveLastRoutePolicy({
				sessionKey: boundSessionKey,
				mainSessionKey
			}),
			matchedBy: "binding.channel"
		})
	};
}
/**
* Resolves runtime routing after the binding owner settles its activity mutation.
* Route callbacks may await a parent conversation before selecting a fallback.
* Legacy adapters may still perform synchronous persistence during migration.
*/
async function resolveRuntimeConversationBindingRouteAsync(params) {
	const routeInput = params.resolveRoute ? { resolveRoute: params.resolveRoute } : { route: { ...params.route } };
	const conversation = resolveConfiguredBindingConversationRef(params);
	const service = getSessionBindingService();
	const inspection = await service.inspectByConversationAsync(conversation);
	const result = inspectRuntimeConversationBindingRoute({
		route: routeInput.resolveRoute ? await routeInput.resolveRoute(selectRuntimeConversationBindingRoute(inspection).routeSelection) : routeInput.route,
		inspection
	});
	if (result.bindingRecord && params.touchBinding !== false) await service.touchAsync(result.bindingRecord.bindingId, void 0, result.bindingRecord.conversation);
	return result;
}
/** @deprecated Use resolveRuntimeConversationBindingRouteAsync; final compatibility day: 2026-12-31. */
function resolveRuntimeConversationBindingRoute(params) {
	warnPluginSdkDeprecation({
		family: "conversation-bindings",
		method: "resolveRuntimeConversationBindingRoute",
		replacement: "resolveRuntimeConversationBindingRouteAsync",
		compatibility: "The synchronous route retains its immediate inspection and touch behavior."
	});
	const inspection = inspectSessionBindingByConversation(resolveConfiguredBindingConversationRef(params));
	const result = inspectRuntimeConversationBindingRoute({
		...params,
		inspection
	});
	if (params.touchBinding !== false && result.bindingRecord) getSessionBindingService().touch(result.bindingRecord.bindingId, void 0, result.bindingRecord.conversation);
	return result;
}
async function ensureConfiguredBindingRouteReady(params) {
	const readyPromise = ensureConfiguredBindingTargetReady(params);
	const timeoutToken = Symbol("configured-binding-route-ready-timeout");
	const result = await raceWithTimeout(readyPromise, CONFIGURED_BINDING_ROUTE_READY_TIMEOUT_MS, () => timeoutToken, { ref: false });
	if (result !== timeoutToken) return result;
	logVerbose(`configured binding route ready check timed out after ${CONFIGURED_BINDING_ROUTE_READY_TIMEOUT_MS / 1e3}s`);
	readyPromise.then((lateResult) => logVerbose(`configured binding route ready check settled after timeout (ok=${lateResult.ok})`), (err) => logVerbose(`configured binding route ready check rejected after timeout: ${String(err)}`));
	return {
		ok: false,
		error: "Configured binding route ready check timed out"
	};
}
//#endregion
export { resolveRuntimeConversationBindingRouteAsync as a, resolveRuntimeConversationBindingRoute as i, inspectRuntimeConversationBindingRoute as n, resolveConfiguredBindingRoute as r, ensureConfiguredBindingRouteReady as t };
