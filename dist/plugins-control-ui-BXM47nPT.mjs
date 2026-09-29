import { n as getPluginRegistryForContext } from "./gateway-request-scope-BLBH-Gpf.mjs";
import { n as GATEWAY_CLIENT_IDS } from "./client-info-B_ICKCYw.mjs";
import { t as ErrorCodes } from "./gateway-error-details-D85F07e9.mjs";
import { Jn as validatePluginsControlUiListParams, Xn as validatePluginsControlUiReportParams, Yn as validatePluginsControlUiReloadParams, Zn as validatePluginsControlUiStatusParams } from "./src-BRUl7oDv.mjs";
import { f as errorShape } from "./error-codes-DvB36bCj.mjs";
import { i as capturePluginLifecycleAuthority } from "./registry-lifecycle-BhTDZAHB.mjs";
import "./runtime-BvdPUus5.mjs";
import { t as assertValidParams } from "./validation-CFv_zneu.mjs";
import { a as reportControlUiPluginActivation, i as reloadControlUiPluginCatalog, n as listControlUiPluginActivations, r as listControlUiPluginCatalog } from "./control-ui-plugin-assets-DhwUK4rL.mjs";
//#region src/gateway/server-methods/plugins-control-ui.ts
function captureCatalogAuthority() {
	const registry = getPluginRegistryForContext();
	return registry ? capturePluginLifecycleAuthority(registry) ?? (() => false) : () => getPluginRegistryForContext() === null;
}
const pluginsControlUiHandlers = {
	"plugins.controlUi.report": ({ params, client, respond, context }) => {
		if (!assertValidParams(params, validatePluginsControlUiReportParams, "plugins.controlUi.report", respond)) return;
		if (!(client?.connId && context.getClientConnIds?.((candidate) => candidate === client).has(client.connId)) || client.connect.client.id !== GATEWAY_CLIENT_IDS.CONTROL_UI) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "Activation reports require a connected Control UI"));
			return;
		}
		if (!reportControlUiPluginActivation(client, params)) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "Activation report is for an inactive browser revision"));
			return;
		}
		respond(true, { ok: true });
	},
	"plugins.controlUi.status": ({ params, respond, context }) => {
		if (!assertValidParams(params, validatePluginsControlUiStatusParams, "plugins.controlUi.status", respond)) return;
		const clients = [];
		context.getClientConnIds?.((client) => {
			if (client.connId && client.connect.client.id === GATEWAY_CLIENT_IDS.CONTROL_UI) clients.push({
				connId: client.connId,
				activations: listControlUiPluginActivations(client, params.pluginId)
			});
			return false;
		});
		if (clients.length > 128) {
			respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, "Too many connected Control UI clients"));
			return;
		}
		respond(true, { clients: clients.toSorted((left, right) => left.connId.localeCompare(right.connId)) });
	},
	"plugins.controlUi.list": async ({ params, respond }) => {
		if (!assertValidParams(params, validatePluginsControlUiListParams, "plugins.controlUi.list", respond)) return;
		try {
			const isCurrent = captureCatalogAuthority();
			const catalog = await listControlUiPluginCatalog();
			if (!isCurrent()) throw new Error("plugin registry was replaced");
			respond(true, catalog);
		} catch {
			respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, "Control UI plugin catalog is unavailable"));
		}
	},
	"plugins.controlUi.reload": async ({ params, respond, context }) => {
		if (!assertValidParams(params, validatePluginsControlUiReloadParams, "plugins.controlUi.reload", respond)) return;
		try {
			const isCurrent = captureCatalogAuthority();
			const catalog = await reloadControlUiPluginCatalog(params.pluginId);
			if (!isCurrent()) throw new Error("plugin registry was replaced");
			context.broadcast("plugins.controlUi.changed", { revision: catalog.revision });
			respond(true, catalog);
		} catch {
			respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, "Control UI reload failed. Confirm the plugin is active, build its browser assets, and retry."));
		}
	}
};
//#endregion
export { pluginsControlUiHandlers };
