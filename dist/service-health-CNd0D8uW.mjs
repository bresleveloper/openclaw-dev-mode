import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
//#region src/plugins/service-health.ts
/** Health belongs to the exact service instance, including across registry publications. */
const states = /* @__PURE__ */ new WeakMap();
function createPluginServiceHealthReporter(service) {
	const state = {};
	states.set(service, state);
	let active = true;
	const canReport = () => active && states.get(service) === state;
	return {
		health: {
			reportFailure: (error) => {
				if (canReport()) state.failure = {
					pluginId: service.pluginId,
					serviceId: service.id,
					origin: service.origin,
					error: formatErrorMessage(error)
				};
			},
			clearFailure: () => {
				if (canReport()) delete state.failure;
			}
		},
		revoke: () => {
			active = false;
		}
	};
}
function listPluginServiceHealthFailures(registry) {
	return registry.services.flatMap((service) => {
		const failure = states.get(service)?.failure;
		return failure ? [failure] : [];
	}).toSorted((left, right) => left.pluginId.localeCompare(right.pluginId) || left.serviceId.localeCompare(right.serviceId));
}
//#endregion
export { listPluginServiceHealthFailures as n, createPluginServiceHealthReporter as t };
