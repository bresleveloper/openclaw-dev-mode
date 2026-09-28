import { n as formatByteSize } from "./format-C1IjPxxo.mjs";
import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { d as readPositiveIntegerParam } from "./common-XfKigJno.mjs";
import "./string-coerce-runtime-C_MKhRVt.mjs";
import { t as callGatewayTool } from "./gateway-DVDJurQC.mjs";
import "./number-runtime-CGwowceO.mjs";
import { i as resolveNodeIdFromList, t as listNodes } from "./nodes-utils-CdKXjEQN.mjs";
import "./agent-harness-runtime-DJD87w0k.mjs";
import "./param-readers-BfezLD6d.mjs";
import { t as appendFileTransferAudit } from "./audit-Dh3xo0Ly.mjs";
import { t as throwFromNodePayload } from "./errors-BMjwWT6s.mjs";
import crypto from "node:crypto";
//#region extensions/file-transfer/src/shared/params.ts
function readGatewayCallOptions(params) {
	const opts = {};
	if (typeof params.gatewayUrl === "string" && params.gatewayUrl.trim()) opts.gatewayUrl = params.gatewayUrl.trim();
	if (typeof params.gatewayToken === "string" && params.gatewayToken.trim()) opts.gatewayToken = params.gatewayToken.trim();
	opts.timeoutMs = readPositiveIntegerParam(params, "timeoutMs");
	return opts;
}
function readTrimmedString(params, key) {
	return normalizeOptionalString(params[key]) ?? "";
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
	const node = readTrimmedString(params, "node");
	const requestedPath = readTrimmedString(params, "path");
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
	const raw = await callGatewayTool("node.invoke", gatewayOpts, {
		nodeId,
		command: input.command,
		params: input.commandParams,
		idempotencyKey: crypto.randomUUID()
	});
	const payload = raw?.payload && typeof raw.payload === "object" && !Array.isArray(raw.payload) ? raw.payload : null;
	if (!payload) {
		await appendFileTransferAudit({
			op: input.command,
			nodeId,
			nodeDisplayName,
			requestedPath: input.requestedPath,
			decision: "error",
			errorMessage: input.invalidPayloadMessage ?? "invalid payload",
			durationMs: Date.now() - startedAt,
			...input.errorAuditExtra
		});
		throw new Error(input.invalidPayloadError ?? `invalid ${input.command} payload`);
	}
	if (payload.ok === false || input.requireOk === true && payload.ok !== true) {
		await appendFileTransferAudit({
			op: input.command,
			nodeId,
			nodeDisplayName,
			requestedPath: input.requestedPath,
			canonicalPath: typeof payload.canonicalPath === "string" ? payload.canonicalPath : void 0,
			decision: "error",
			errorCode: typeof payload.code === "string" ? payload.code : void 0,
			errorMessage: typeof payload.message === "string" ? payload.message : void 0,
			durationMs: Date.now() - startedAt,
			...input.errorAuditExtra
		});
		throwFromNodePayload(input.command, payload);
	}
	return {
		nodeDisplayName,
		nodeId,
		payload,
		startedAt
	};
}
//#endregion
export { readClampedInt as i, readRequiredNodePath as n, humanSize as r, invokeNodeToolPayload as t };
