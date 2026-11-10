import { o as resolveSessionStorePathForScope } from "./session-store-path-BQkYPc4_.mjs";
import { r as captureGatewaySessionWorkAdmissions } from "./session-lifecycle-admission-BihxXo5j.mjs";
import "./device-provider-identity-v6nXqNq_.mjs";
import { r as isExactAttachedEnvironment } from "./placement-target-BGdJpPtJ.mjs";
//#region src/gateway/worker-environments/device-placement-demand.ts
function captureDemand(sources) {
	const gatewayContext = sources.resolveGatewayContext();
	const admissions = captureGatewaySessionWorkAdmissions(sources.resolveGatewayContext);
	const targets = /* @__PURE__ */ new Set();
	if (gatewayContext) for (const identities of admissions.targets.values()) for (const identity of identities) targets.add(identity);
	return {
		admissions,
		targets: [...targets],
		gatewayContext
	};
}
function projectDemand(sources, admissions, placements, excludeSessionId) {
	const config = sources.resolveGatewayContext()?.getRuntimeConfig();
	const demand = /* @__PURE__ */ new Map();
	const countedEnvironments = /* @__PURE__ */ new Set();
	for (const [scope, identities] of admissions.targets) for (const identity of identities) {
		const placement = placements.get(identity);
		if (!placement || scope !== resolveSessionStorePathForScope(placement, config) || placement.sessionId === excludeSessionId || placement.state !== "active" || placement.executionMode !== "worker-turn" || countedEnvironments.has(placement.environmentId) || !admissions.isActive({
			scope,
			sessionKey: placement.sessionKey,
			sessionId: placement.sessionId
		})) continue;
		const environment = sources.environments.get(placement.environmentId);
		if (environment?.providerId !== "device" || !environment.nodeDeviceId || !isExactAttachedEnvironment(environment, placement)) continue;
		countedEnvironments.add(environment.environmentId);
		demand.set(environment.nodeDeviceId, (demand.get(environment.nodeDeviceId) ?? 0) + 1);
	}
	return demand;
}
/** Projects admitted session work without turning idle placements into slot reservations. */
function createDevicePlacementDemandReader(sources) {
	return (excludeSessionId) => {
		const { admissions, targets } = captureDemand(sources);
		return targets.length ? projectDemand(sources, admissions, sources.placements.getMany(targets), excludeSessionId) : /* @__PURE__ */ new Map();
	};
}
function createDevicePlacementDemandReaderAsync(sources) {
	return async (excludeSessionId) => {
		const { admissions, targets, gatewayContext } = captureDemand(sources);
		if (!targets.length) return /* @__PURE__ */ new Map();
		const placements = await sources.placements.getManyAsync(targets);
		return sources.resolveGatewayContext() === gatewayContext ? projectDemand(sources, admissions, placements, excludeSessionId) : /* @__PURE__ */ new Map();
	};
}
//#endregion
export { createDevicePlacementDemandReader, createDevicePlacementDemandReaderAsync };
