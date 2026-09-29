import { r as captureGatewaySessionWorkAdmissions } from "./session-lifecycle-admission-Pys9TN37.mjs";
import { a as loadExactSessionEntryReadOnly } from "./session-accessor.sqlite-exact-read-Dk6_8wqr.mjs";
import "./session-accessor-l-4ZHvKn.mjs";
import "./device-provider-identity-v6nXqNq_.mjs";
import { i as isExactAttachedEnvironment } from "./placement-dispatch-failure-BRq2hfyf.mjs";
//#region src/gateway/worker-environments/device-placement-demand.ts
function createDevicePlacementDemandReader(sources) {
	return (excludeSessionId) => collectDevicePlacementDemand({
		...sources,
		excludeSessionId
	});
}
/** Projects admitted session work without turning idle placements into slot reservations. */
function collectDevicePlacementDemand(params) {
	const demand = /* @__PURE__ */ new Map();
	if (!params.resolveGatewayContext()) return demand;
	const admissions = captureGatewaySessionWorkAdmissions(params.resolveGatewayContext);
	const targets = /* @__PURE__ */ new Set();
	for (const identities of admissions.targets.values()) for (const identity of identities) targets.add(identity);
	if (targets.size === 0) return demand;
	const placements = params.placements.getMany([...targets]);
	const countedEnvironments = /* @__PURE__ */ new Set();
	for (const [scope, identities] of admissions.targets) for (const identity of identities) {
		const placement = placements.get(identity);
		if (!placement || placement.sessionId === params.excludeSessionId || placement.state !== "active" || placement.executionMode !== "worker-turn" || countedEnvironments.has(placement.environmentId) || !admissions.isActive({
			scope,
			sessionKey: placement.sessionKey,
			sessionId: placement.sessionId
		})) continue;
		if (loadExactSessionEntryReadOnly({
			storePath: scope,
			sessionKey: placement.sessionKey,
			agentId: placement.agentId,
			projection: "list"
		})?.entry.sessionId !== placement.sessionId) continue;
		const environment = params.environments.get(placement.environmentId);
		if (environment?.providerId !== "device" || !environment.nodeDeviceId || !isExactAttachedEnvironment(environment, placement)) continue;
		countedEnvironments.add(environment.environmentId);
		demand.set(environment.nodeDeviceId, (demand.get(environment.nodeDeviceId) ?? 0) + 1);
	}
	return demand;
}
//#endregion
export { createDevicePlacementDemandReader };
