import { r as asNullableRecord } from "./record-coerce-TIsquoVR.mjs";
import { t as isNonEmptyProtocolString } from "./protocol-value-normalization-Oati9UF1.mjs";
//#region packages/gateway-protocol/src/node-permissions.ts
const NODE_PERMISSION_STATES = [
	"not-determined",
	"denied",
	"restart-required",
	"stale-grant",
	"disabled-in-openclaw"
];
/** Read native error details without loading the protocol schema registry in the UI. */
function readNodePermissionDetails(value) {
	const record = asNullableRecord(value);
	const state = NODE_PERMISSION_STATES.find((candidate) => candidate === record?.state);
	if (!record || !Array.isArray(record.capabilities) || record.capabilities.length === 0 || !record.capabilities.every(isNonEmptyProtocolString) || new Set(record.capabilities).size !== record.capabilities.length || !state) return;
	return {
		capabilities: record.capabilities,
		state
	};
}
function readNodePermissionRequest(value) {
	const record = asNullableRecord(value);
	const details = readNodePermissionDetails(value);
	if (!record || !details || !isNonEmptyProtocolString(record.nodeId) || !isNonEmptyProtocolString(record.command) || record.nodeName !== void 0 && !isNonEmptyProtocolString(record.nodeName)) return;
	return {
		...details,
		nodeId: record.nodeId,
		command: record.command,
		...record.nodeName !== void 0 ? { nodeName: record.nodeName } : {}
	};
}
//#endregion
export { readNodePermissionDetails as n, readNodePermissionRequest as r, NODE_PERMISSION_STATES as t };
