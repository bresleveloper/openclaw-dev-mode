import { l as resolveAgentIdFromSessionKey } from "./session-key-CBvmC8zz.mjs";
import { i as logVerbose } from "./globals-QODkv80i.mjs";
import { a as readSessionBindingInspectionConversation } from "./current-conversation-binding-row-De9sUoDf.mjs";
import { n as inspectSessionBindingByConversation, t as getSessionBindingService } from "./session-binding-service-n2QTfkUE.mjs";
import { n as deriveLastRoutePolicy } from "./resolve-route-zfKT6ZcU.mjs";
import { c as withConversationBindingRouteFacts, o as resolveConversationBindingAgentId, r as projectConfiguredConversationBindingRouteFacts, s as resolveConversationBindingSelection } from "./conversation-binding-route-facts-BzDZWweu.mjs";
import { t as resolveConfiguredBinding } from "./configured-binding-registry-CFlh3sPP.mjs";
import { t as ensureConfiguredBindingTargetReady } from "./binding-targets-By4zhSMx.mjs";
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
/**
* Rewrites an agent route when the current conversation matches a configured binding.
*/
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
	const inspectedConversation = readSessionBindingInspectionConversation(inspection);
	if (inspection.status === "unavailable") return {
		bindingOwnerAvailable: false,
		bindingRecord: null,
		route: inspectedConversation ? withConversationBindingRouteFacts({ ...params.route }, { kind: "unavailable" }, params.route.agentId, inspectedConversation) : params.route
	};
	const selection = resolveConversationBindingSelection(inspection.binding);
	const conversation = inspectedConversation ?? inspection.binding?.conversation;
	const observe = (route) => conversation ? withConversationBindingRouteFacts(route, selection, params.route.agentId, conversation) : route;
	if (selection.kind === "none") {
		if (selection.ignoredCronSessionKey) logVerbose(`ignored runtime conversation binding to isolated cron run session ${selection.ignoredCronSessionKey}`);
		return {
			bindingOwnerAvailable: true,
			bindingRecord: null,
			route: observe({ ...params.route })
		};
	}
	const bindingRecord = selection.binding;
	if (selection.kind === "plugin") return {
		bindingOwnerAvailable: true,
		bindingRecord,
		pluginId: selection.pluginId,
		route: observe({ ...params.route })
	};
	const boundSessionKey = selection.sessionKey;
	const boundAgentId = resolveConversationBindingAgentId(selection.binding, params.route.agentId);
	return {
		bindingOwnerAvailable: true,
		bindingRecord,
		boundSessionKey,
		boundAgentId,
		route: observe({
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
/**
* Rewrites an agent route using a persisted runtime conversation binding, when applicable.
*/
function resolveRuntimeConversationBindingRoute(params) {
	const result = inspectRuntimeConversationBindingRoute({
		route: params.route,
		inspection: inspectSessionBindingByConversation(resolveConfiguredBindingConversationRef(params))
	});
	if (params.touchBinding !== false && result.bindingRecord) getSessionBindingService().touch(result.bindingRecord.bindingId, void 0, result.bindingRecord.conversation);
	return result;
}
/**
* Ensures a configured binding target is ready without blocking route resolution indefinitely.
*/
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
