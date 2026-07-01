import { t as tryDispatchAcpReplyHook } from "../../acp-runtime-backend-BozKlDrz.js";
import { t as createAcpxRuntimeService } from "../../register.runtime-DDRGF4UA.js";
//#region extensions/acpx/index.ts
/**
* ACPX runtime plugin entry. It registers the embedded ACP backend service and
* wires reply-dispatch hooks into the plugin SDK runtime.
*/
const plugin = {
	id: "acpx",
	name: "ACPX Runtime",
	description: "Embedded ACP runtime backend with plugin-owned session and transport management.",
	register(api) {
		api.registerService(createAcpxRuntimeService({
			pluginConfig: api.pluginConfig,
			openKeyedStore: (options) => api.runtime.state.openKeyedStore(options)
		}));
		api.on("reply_dispatch", tryDispatchAcpReplyHook);
	}
};
//#endregion
export { plugin as default };
