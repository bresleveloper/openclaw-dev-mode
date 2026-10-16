import { Ga as validateStorageLocationsProbeParams, Wa as validateStorageLocationsListParams } from "./src-l2dWvEsN.mjs";
import { n as getLoadedRuntimePluginRegistry } from "./active-runtime-registry-B1mWK6o9.mjs";
import { i as probeStorageLocation, n as listStorageLocations } from "./locations-CJoKVjt6.mjs";
import { r as defineValidatedGatewayMethod } from "./validation-Bu27N0nv.mjs";
//#region src/gateway/server-methods/storage.ts
const storageHandlers = {
	"storage.locations.list": defineValidatedGatewayMethod("storage.locations.list", validateStorageLocationsListParams, ({ context, respond }) => {
		respond(true, { locations: listStorageLocations(context.getRuntimeConfig(), getLoadedRuntimePluginRegistry() ?? void 0) }, void 0);
	}),
	"storage.locations.probe": defineValidatedGatewayMethod("storage.locations.probe", validateStorageLocationsProbeParams, async ({ params, context, respond }) => {
		respond(true, await probeStorageLocation({
			name: params.name,
			config: context.getRuntimeConfig(),
			registry: getLoadedRuntimePluginRegistry() ?? { storageProviders: /* @__PURE__ */ new Map() }
		}), void 0);
	})
};
//#endregion
export { storageHandlers };
