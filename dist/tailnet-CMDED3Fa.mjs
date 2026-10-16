import { s as isIpInCidr } from "./ip-jvtZlu_y.mjs";
import { n as pickMatchingExternalInterfaceAddress } from "./network-interfaces-5_nTDEn5.mjs";
import os from "node:os";
//#region src/infra/tailnet.ts
const TAILNET_IPV4_CIDR = "100.64.0.0/10";
const TAILNET_IPV6_CIDR = "fd7a:115c:a1e0::/48";
/** Returns true when an address is inside Tailscale's CGNAT IPv4 range. */
function isTailnetIPv4(address) {
	return isIpInCidr(address, TAILNET_IPV4_CIDR);
}
function isTailnetIPv6(address) {
	return isIpInCidr(address, TAILNET_IPV6_CIDR);
}
/** Returns the first discovered Tailscale IPv4 address, if any. */
function pickPrimaryTailnetIPv4() {
	return pickMatchingExternalInterfaceAddress(os.networkInterfaces(), {
		family: "IPv4",
		matches: isTailnetIPv4
	});
}
/** Returns the first discovered Tailscale IPv6 address, if any. */
function pickPrimaryTailnetIPv6() {
	return pickMatchingExternalInterfaceAddress(os.networkInterfaces(), {
		family: "IPv6",
		matches: isTailnetIPv6
	});
}
//#endregion
export { pickPrimaryTailnetIPv4 as n, pickPrimaryTailnetIPv6 as r, isTailnetIPv4 as t };
