import { c as normalizeSortedUniqueTrimmedStringList } from "./string-normalization-CRyoFBPt.js";
import { mn as errorShape, pn as ErrorCodes } from "./schema-Ctppm7Dp.js";
import { X as validateEnvironmentsListParams, Z as validateEnvironmentsStatusParams } from "./src-CSp7rUPX.js";
import { i as listNodePairing } from "./node-pairing-mMAtozCU.js";
import { r as respondUnavailableOnThrow, t as respondInvalidParams } from "./nodes.helpers-DEkKdBJ_.js";
import { l as listDevicePairing } from "./device-pairing-DBBF4i61.js";
import { r as listKnownNodes, t as createKnownNodeCatalog } from "./node-catalog-Bd3-n2P4.js";
//#region src/gateway/server-methods/environments.ts
const GATEWAY_ENVIRONMENT = {
	id: "gateway",
	type: "local",
	label: "Gateway local",
	status: "available",
	capabilities: [
		"agent.run",
		"sessions",
		"tools",
		"workspace"
	]
};
function uniqueSortedStrings(...items) {
	return normalizeSortedUniqueTrimmedStringList(items.flatMap((item) => item ?? []));
}
/** Converts a known node entry into the public environment summary shape. */
function summarizeNodeEnvironment(node) {
	const capabilities = uniqueSortedStrings(node.caps, node.commands);
	return {
		id: `node:${node.nodeId}`,
		type: "node",
		label: node.displayName ?? node.nodeId,
		status: node.connected ? "available" : "unavailable",
		...capabilities.length > 0 ? { capabilities } : {}
	};
}
function listEnvironmentSummaries(nodes) {
	return [GATEWAY_ENVIRONMENT, ...nodes.map(summarizeNodeEnvironment)];
}
/** Lists the local Gateway plus paired/connected node environments. */
async function listEnvironments(context) {
	const [devicePairing, nodePairing] = await Promise.all([listDevicePairing(), listNodePairing()]);
	return listEnvironmentSummaries(listKnownNodes(createKnownNodeCatalog({
		pairedDevices: devicePairing.paired,
		pairedNodes: nodePairing.paired,
		connectedNodes: context.nodeRegistry.listConnected()
	})));
}
/** Gateway handlers for querying local and node execution environments. */
const environmentsHandlers = {
	"environments.list": async ({ params, respond, context }) => {
		if (!validateEnvironmentsListParams(params)) {
			respondInvalidParams({
				respond,
				method: "environments.list",
				validator: validateEnvironmentsListParams
			});
			return;
		}
		await respondUnavailableOnThrow(respond, async () => {
			respond(true, { environments: await listEnvironments(context) }, void 0);
		});
	},
	"environments.status": async ({ params, respond, context }) => {
		if (!validateEnvironmentsStatusParams(params)) {
			respondInvalidParams({
				respond,
				method: "environments.status",
				validator: validateEnvironmentsStatusParams
			});
			return;
		}
		await respondUnavailableOnThrow(respond, async () => {
			const environment = (await listEnvironments(context)).find((entry) => entry.id === params.environmentId);
			if (!environment) {
				respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "unknown environmentId"));
				return;
			}
			respond(true, environment, void 0);
		});
	}
};
//#endregion
export { environmentsHandlers };
