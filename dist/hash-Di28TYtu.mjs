import { n as sha256Hex } from "./node-crypto-Df3MIs6V.mjs";
//#region packages/memory-host-sdk/src/host/hash.ts
/** SHA-256 hash helper for stable cache/content keys. */
function hashText(value) {
	return sha256Hex(value);
}
//#endregion
export { hashText as t };
