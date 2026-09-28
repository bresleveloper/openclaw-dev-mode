import "./src-CZ2wJvNB.mjs";
import { t as safeParseJson } from "./json-coercion-C7YSvZ9t.mjs";
import { t as ADMIN_SCOPE } from "./operator-scopes-D-CL26h0.mjs";
import { t as ErrorCodes } from "./gateway-error-details-D85F07e9.mjs";
import { nn as validateFsListDirResult, tn as validateFsListDirParams } from "./src-BRUl7oDv.mjs";
import { s as NODE_FS_LIST_DIR_COMMAND } from "./node-commands-BLhGKTZa.mjs";
import { f as errorShape, p as missingScopeErrorShape } from "./error-codes-DvB36bCj.mjs";
import { l as resolveNodeCommandAllowlist, o as isNodeCommandAllowed } from "./node-command-policy-CnGfXM76.mjs";
import { n as resolveWorkspacePathContainment } from "./workspace-path-containment-HweUC6hk.mjs";
import { t as listHostDirectories } from "./host-directory-listing-Cr8UEgwk.mjs";
import { t as errorShapeFromError } from "./error-shape-2QnntKjo.mjs";
//#region src/gateway/server-methods/fs.ts
const fsHandlers = { "fs.listDir": async ({ params, respond, context, client }) => {
	if (!validateFsListDirParams(params)) {
		respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "invalid fs parameters"));
		return;
	}
	try {
		if (params.nodeId) {
			const node = context.nodeRegistry.get(params.nodeId);
			if (!node) {
				respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, "node not connected"));
				return;
			}
			if (!node.commands.includes("fs.listDir")) {
				respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "node does not support directory browsing"));
				return;
			}
			const allowed = isNodeCommandAllowed({
				command: NODE_FS_LIST_DIR_COMMAND,
				declaredCommands: node.commands,
				allowlist: resolveNodeCommandAllowlist(context.getRuntimeConfig(), {
					...node,
					approvedCommands: node.commands
				})
			});
			if (!allowed.ok) {
				respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `node command not allowed: ${NODE_FS_LIST_DIR_COMMAND} (${allowed.reason})`, { details: {
					command: NODE_FS_LIST_DIR_COMMAND,
					reason: allowed.reason
				} }));
				return;
			}
			const result = await context.nodeRegistry.invoke({
				nodeId: params.nodeId,
				expectedConnId: node.connId,
				...node.pairingGeneration ? { expectedPairingGeneration: node.pairingGeneration } : {},
				command: NODE_FS_LIST_DIR_COMMAND,
				params: params.path ? { path: params.path } : {}
			});
			if (!result.ok) {
				respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, result.error?.message ?? "node browse failed"));
				return;
			}
			const payload = result.payloadJSON ? safeParseJson(result.payloadJSON) : result.payload;
			if (!validateFsListDirResult(payload)) {
				respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, "node returned an invalid directory listing"));
				return;
			}
			respond(true, payload, void 0);
			return;
		}
		if ((Array.isArray(client?.connect.scopes) ? client.connect.scopes : []).includes("operator.admin")) {
			respond(true, await listHostDirectories(params.path), void 0);
			return;
		}
		const containment = await resolveWorkspacePathContainment(params.path || void 0, context.getRuntimeConfig(), { allowMissing: true });
		if (!containment) {
			respond(false, void 0, missingScopeErrorShape({
				missingScope: ADMIN_SCOPE,
				requiredScopes: [ADMIN_SCOPE]
			}));
			return;
		}
		const listing = await listHostDirectories(containment.path);
		if (listing.path === containment.workspaceRoot) {
			const { parent: _parent, ...clamped } = listing;
			respond(true, clamped, void 0);
			return;
		}
		respond(true, listing, void 0);
	} catch (error) {
		respond(false, void 0, errorShapeFromError(ErrorCodes.INVALID_REQUEST, error));
	}
} };
//#endregion
export { fsHandlers };
