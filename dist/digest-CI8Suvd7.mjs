import { i as sha256StableValue, n as sha256Hex } from "./node-crypto-BG4u3UnX.mjs";
//#region src/claws/digest.ts
function digestClawValue(value) {
	return `sha256:${sha256StableValue(value).digest}`;
}
function digestClawBytes(value) {
	return `sha256:${sha256Hex(value)}`;
}
//#endregion
export { digestClawValue as n, digestClawBytes as t };
