import { a as asRecord } from "./record-coerce-DHZ4bFlT.js";
//#region src/shared/node-list-parse.ts
/** Extracts pending and paired node arrays from permissive node.pair.list payloads. */
function parsePairingList(value) {
	const obj = asRecord(value);
	return {
		pending: Array.isArray(obj.pending) ? obj.pending : [],
		paired: Array.isArray(obj.paired) ? obj.paired : []
	};
}
/** Extracts the nodes array from a node.list response, treating malformed payloads as empty. */
function parseNodeList(value) {
	const obj = asRecord(value);
	return Array.isArray(obj.nodes) ? obj.nodes : [];
}
//#endregion
export { parsePairingList as n, parseNodeList as t };
