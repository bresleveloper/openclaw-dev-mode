import { a as resolveGlobalSingleton } from "./global-singleton-DrXvEBww.mjs";
import { o as getPluginRuntimeGatewayRequestScope } from "./gateway-request-scope-1BXD1G3l.mjs";
import { b as registerOpenClawStateDatabaseLifecycleListener, x as requireOpenClawStateDatabaseIdentity } from "./openclaw-state-db-cache-R1v7ogY0.mjs";
import { i as openOpenClawStateDatabase } from "./openclaw-state-db-BtDOU_3j.mjs";
import { t as createWorkerSessionPlacementStore } from "./placement-store-C-b90PUO.mjs";
//#region src/gateway/session-worker-placement-context.ts
const localPlacementState = resolveGlobalSingleton(Symbol.for("openclaw.localSessionWorkerPlacementContext"), () => ({}), (state) => {
	state.placement = void 0;
});
registerOpenClawStateDatabaseLifecycleListener((event) => {
	const placement = localPlacementState.placement;
	if (placement && event.kind !== "opened" && event.kind !== "open-error" && (event.path === placement.path || event.identity?.key === placement.identityKey)) localPlacementState.placement = void 0;
});
/** Uses the live Gateway owner when present; embedded runtimes share the same lightweight DB. */
function resolveSessionWorkerPlacementContext(owner) {
	const gatewayContext = getPluginRuntimeGatewayRequestScope()?.context ?? owner;
	if (gatewayContext?.workerSessionPlacementService) return gatewayContext;
	if (!localPlacementState.placement) {
		const database = openOpenClawStateDatabase();
		localPlacementState.placement = {
			store: createWorkerSessionPlacementStore({ database }),
			path: database.path,
			identityKey: requireOpenClawStateDatabaseIdentity(database).key
		};
	}
	return { workerSessionPlacementService: localPlacementState.placement.store };
}
//#endregion
export { resolveSessionWorkerPlacementContext as t };
