import type { NodeListNode, PairingList } from "./node-list-types.js";
/** Extracts pending and paired node arrays from permissive node.pair.list payloads. */
export declare function parsePairingList(value: unknown): PairingList;
/** Extracts the nodes array from a node.list response, treating malformed payloads as empty. */
export declare function parseNodeList(value: unknown): NodeListNode[];
