import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { n as formatByteSize } from "./format-C1IjPxxo.mjs";
import { r as asNullableRecord } from "./record-coerce-TIsquoVR.mjs";
import "./string-coerce-runtime-50qKeWeL.mjs";
import { u as readPositiveIntegerParam } from "./common-Dyxcwsy8.mjs";
import { t as callGatewayTool } from "./gateway-w2F8o2pH.mjs";
import "./number-runtime-CgyXj1A5.mjs";
import { a as resolveNodeIdFromList, n as listNodes } from "./nodes-utils-4cDvmWkE.mjs";
import "./agent-harness-runtime-BxShxpgh.mjs";
import "./param-readers-B4Zo5Lzz.mjs";
import { t as bindFileTransferAudit } from "./audit-context-DG4-osT1.mjs";
import { t as throwFromNodePayload } from "./errors-BAlYwh52.mjs";
import crypto from "node:crypto";
//#region extensions/file-transfer/src/shared/params.ts
function readGatewayCallOptions(params) {
	const opts = {};
	if (typeof params.gatewayUrl === "string" && params.gatewayUrl.trim()) opts.gatewayUrl = params.gatewayUrl.trim();
	if (typeof params.gatewayToken === "string" && params.gatewayToken.trim()) opts.gatewayToken = params.gatewayToken.trim();
	opts.timeoutMs = readPositiveIntegerParam(params, "timeoutMs");
	return opts;
}
function readClampedInt(params) {
	const requested = readPositiveIntegerParam(params.input, params.key) ?? params.defaultValue;
	return Math.max(params.hardMin, Math.min(requested, params.hardMax));
}
function humanSize(bytes) {
	return formatByteSize(bytes, {
		style: "legacy-binary",
		maxUnit: "mega",
		separator: " ",
		fractionDigits: (_value, unit) => unit === "byte" ? null : unit === "kilo" ? 1 : 2
	});
}
//#endregion
//#region extensions/file-transfer/src/tools/node-tool-invoke.ts
function readRequiredNodePath(params) {
	const node = normalizeOptionalString(params.node);
	const requestedPath = normalizeOptionalString(params.path);
	if (!node) throw new Error("node required");
	if (!requestedPath) throw new Error("path required");
	return {
		node,
		requestedPath
	};
}
async function invokeNodeToolPayload(input) {
	const gatewayOpts = readGatewayCallOptions(input.params);
	const nodes = await listNodes(gatewayOpts);
	if (nodes.length === 0) throw new Error("no paired nodes available; file-transfer tools require a paired node from nodes status. Use local file/exec tools for local workspace paths.");
	const nodeId = resolveNodeIdFromList(nodes, input.node, false);
	const nodeDisplayName = nodes.find((n) => n.nodeId === nodeId)?.displayName ?? input.node;
	const startedAt = Date.now();
	const audit = bindFileTransferAudit({
		op: input.command,
		nodeId,
		nodeDisplayName,
		requestedPath: input.requestedPath
	}, startedAt);
	const raw = await callGatewayTool("node.invoke", gatewayOpts, {
		nodeId,
		command: input.command,
		params: input.commandParams,
		idempotencyKey: crypto.randomUUID()
	});
	const payload = asNullableRecord(raw?.payload);
	if (!payload) {
		await audit({
			decision: "error",
			errorMessage: input.invalidPayloadMessage ?? "invalid payload",
			...input.errorAuditExtra
		});
		throw new Error(input.invalidPayloadError ?? `invalid ${input.command} payload`);
	}
	if (payload.ok === false || input.requireOk === true && payload.ok !== true) {
		await audit({
			canonicalPath: typeof payload.canonicalPath === "string" ? payload.canonicalPath : void 0,
			decision: "error",
			errorCode: typeof payload.code === "string" ? payload.code : void 0,
			errorMessage: typeof payload.message === "string" ? payload.message : void 0,
			...input.errorAuditExtra
		});
		throwFromNodePayload(input.command, payload);
	}
	return {
		audit,
		payload
	};
}
//#endregion
export { readClampedInt as i, readRequiredNodePath as n, humanSize as r, invokeNodeToolPayload as t };
