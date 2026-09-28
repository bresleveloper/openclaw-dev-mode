import { i as isCanonicalDottedDecimalIPv4 } from "./ip-CDH5BTTD.mjs";
//#region packages/net-policy/src/ipv4.ts
/** Validates the custom-bind IPv4 input and returns the user-facing error text. */
function validateDottedDecimalIPv4Input(value) {
	if (!value) return "IP address is required for custom bind mode";
	if (isCanonicalDottedDecimalIPv4(value)) return;
	return "Invalid IPv4 address (e.g., 192.168.1.100)";
}
//#endregion
export { validateDottedDecimalIPv4Input as t };
