import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { n as buildAgentMainSessionKey } from "./session-key-CmZ4o9-l.mjs";
import { M as parseAgentSessionKey, l as resolveAgentIdFromSessionKey } from "./session-key-C09ow4h0.mjs";
import { i as logVerbose } from "./globals-BXbZ1A_g.mjs";
import { n as deriveLastRoutePolicy } from "./resolve-route-Bzb6opva.mjs";
import { c as withConversationBindingRouteFacts, o as resolveConversationBindingAgentId, r as projectConfiguredConversationBindingRouteFacts, s as resolveConversationBindingSelection } from "./conversation-binding-route-facts-DCKt7P60.mjs";
import { n as inspectSessionBindingByConversation, t as getSessionBindingService } from "./session-binding-service-DzGpg6K8.mjs";
import { o as readSessionBindingInspectionConversation } from "./current-conversation-binding-row-BCcBsEeZ.mjs";
import { t as resolveConfiguredBinding } from "./configured-binding-registry-BLxqq5fF.mjs";
import { t as ensureConfiguredBindingTargetReady } from "./binding-targets-XIPa8ub-.mjs";
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
	if (!bindingResolution) return {
		bindingResolution: null,
		route: projectConfiguredConversationBindingRouteFacts(params.route)
	};
	const boundSessionKey = bindingResolution.statefulTarget.sessionKey.trim();
	if (!boundSessionKey) return {
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
/** Projects prepared ownership facts without reading or changing binding storage. */
function inspectRuntimeConversationBindingRoute(params) {
	const { inspection } = params;
	const selection = resolveConversationBindingSelection(inspection.status === "available" ? inspection.binding : null);
	const bindingRecord = selection.kind === "none" ? null : selection.binding;
	const explicitAgentId = selection.kind === "agent" ? parseAgentSessionKey(selection.sessionKey)?.agentId ?? normalizeOptionalString(selection.binding.metadata?.agentId) : void 0;
	const boundAgentId = params.resolveRoute && selection.kind === "agent" && explicitAgentId ? resolveConversationBindingAgentId(selection.binding, explicitAgentId) : void 0;
	const routeSelection = {
		inspection,
		bindingOwnerAvailable: inspection.status === "available",
		bindingRecord,
		boundAgentId
	};
	const baseRoute = params.resolveRoute ? params.resolveRoute(routeSelection) : params.route;
	const inspectedConversation = readSessionBindingInspectionConversation(inspection);
	if (inspection.status === "unavailable") return {
		bindingOwnerAvailable: false,
		bindingRecord: null,
		route: inspectedConversation ? withConversationBindingRouteFacts({ ...baseRoute }, { kind: "unavailable" }, baseRoute.agentId, inspectedConversation) : baseRoute
	};
	const conversation = inspectedConversation ?? inspection.binding?.conversation;
	const observe = (route) => conversation ? withConversationBindingRouteFacts(route, selection, baseRoute.agentId, conversation) : route;
	if (selection.kind === "none") {
		if (selection.ignoredCronSessionKey) logVerbose(`ignored runtime conversation binding to isolated cron run session ${selection.ignoredCronSessionKey}`);
		return {
			bindingOwnerAvailable: true,
			bindingRecord: null,
			route: observe({ ...baseRoute })
		};
	}
	if (selection.kind === "plugin") return {
		bindingOwnerAvailable: true,
		bindingRecord: selection.binding,
		pluginId: selection.pluginId,
		route: observe({ ...baseRoute })
	};
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
* Legacy adapters may still perform synchronous persistence during migration.
*/
async function resolveRuntimeConversationBindingRouteAsync(params) {
	const route = { ...params.route };
	const conversation = resolveConfiguredBindingConversationRef(params);
	const service = getSessionBindingService();
	let result = inspectRuntimeConversationBindingRoute({
		route,
		inspection: await service.inspectByConversationAsync(conversation)
	});
	for (let attempt = 0; attempt < 2; attempt += 1) {
		if (!result.bindingRecord) return result;
		const { bindingId, boundAt, targetSessionKey, targetKind } = result.bindingRecord;
		const scope = {
			channel: result.bindingRecord.conversation.channel,
			accountId: result.bindingRecord.conversation.accountId
		};
		await service.touchAsync(bindingId, void 0, scope);
		result = inspectRuntimeConversationBindingRoute({
			route,
			inspection: await service.inspectByConversationAsync(conversation)
		});
		if (!result.bindingRecord || result.bindingRecord.bindingId === bindingId && result.bindingRecord.boundAt === boundAt && result.bindingRecord.targetSessionKey === targetSessionKey && result.bindingRecord.targetKind === targetKind && result.bindingRecord.conversation.channel === scope.channel && result.bindingRecord.conversation.accountId === scope.accountId) return result;
	}
	throw new Error("Conversation binding changed repeatedly while recording activity. Retry the message.");
}
function resolveRuntimeConversationBindingRoute(params) {
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
	let timer;
	const timeoutToken = Symbol("configured-binding-route-ready-timeout");
	const timeoutPromise = new Promise((resolve) => {
		timer = setTimeout(() => resolve(timeoutToken), CONFIGURED_BINDING_ROUTE_READY_TIMEOUT_MS);
		timer.unref?.();
	});
	try {
		const result = await Promise.race([readyPromise, timeoutPromise]);
		if (result !== timeoutToken) return result;
		logVerbose(`configured binding route ready check timed out after ${CONFIGURED_BINDING_ROUTE_READY_TIMEOUT_MS / 1e3}s`);
		readyPromise.then((lateResult) => logVerbose(`configured binding route ready check settled after timeout (ok=${lateResult.ok})`), (err) => logVerbose(`configured binding route ready check rejected after timeout: ${String(err)}`));
		return {
			ok: false,
			error: "Configured binding route ready check timed out"
		};
	} finally {
		clearTimeout(timer);
	}
}
//#endregion
export { resolveRuntimeConversationBindingRouteAsync as a, resolveRuntimeConversationBindingRoute as i, inspectRuntimeConversationBindingRoute as n, resolveConfiguredBindingRoute as r, ensureConfiguredBindingRouteReady as t };
