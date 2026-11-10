import { n as GATEWAY_CLIENT_IDS } from "./client-info-BgcoFakQ.mjs";
import { Ng as errorShape, _r as validatePluginsControlUiReportParams, gr as validatePluginsControlUiReloadParams, hr as validatePluginsControlUiListParams, vr as validatePluginsControlUiStatusParams } from "./src-pLJQA6J5.mjs";
import { t as ErrorCodes } from "./gateway-error-details-Cl-eEOTQ.mjs";
import { n as defineValidatedGatewayHandler } from "./validation--xIH1Pj-.mjs";
import { a as reportControlUiPluginActivation, i as reloadControlUiPluginCatalog, n as listControlUiPluginActivations, r as listControlUiPluginCatalog } from "./control-ui-plugin-assets-BWdGIhx2.mjs";
//#region src/gateway/server-methods/plugins-control-ui.ts
const pluginsControlUiHandlers = {
	"plugins.controlUi.report": defineValidatedGatewayHandler("plugins.controlUi.report", validatePluginsControlUiReportParams, ({ params, client, respond, context }) => {
		if (!(client?.connId && context.getClientConnIds?.((candidate) => candidate === client).has(client.connId)) || client.connect.client.id !== GATEWAY_CLIENT_IDS.CONTROL_UI) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "Activation reports require a connected Control UI"));
			return;
		}
		if (!reportControlUiPluginActivation(client, params)) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "Activation report is for an inactive browser revision"));
			return;
		}
		respond(true, { ok: true });
	}),
	"plugins.controlUi.status": defineValidatedGatewayHandler("plugins.controlUi.status", validatePluginsControlUiStatusParams, ({ params, respond, context }) => {
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
	}),
	"plugins.controlUi.list": defineValidatedGatewayHandler("plugins.controlUi.list", validatePluginsControlUiListParams, async ({ respond }) => {
		respond(true, await listControlUiPluginCatalog());
	}, () => errorShape(ErrorCodes.UNAVAILABLE, "Control UI plugin catalog is unavailable")),
	"plugins.controlUi.reload": defineValidatedGatewayHandler("plugins.controlUi.reload", validatePluginsControlUiReloadParams, async ({ params, respond, context }) => {
		const catalog = await reloadControlUiPluginCatalog(params.pluginId);
		context.broadcast("plugins.controlUi.changed", { revision: catalog.revision });
		respond(true, catalog);
	}, () => errorShape(ErrorCodes.UNAVAILABLE, "Control UI reload failed. Confirm the plugin is active, build its browser assets, and retry."))
};
//#endregion
export { pluginsControlUiHandlers };
