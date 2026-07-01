import { _ as uniqueStrings } from "./string-normalization-CRyoFBPt.js";
import { s as isIpInCidr } from "./ip-0oQXo6_w.js";
import os from "node:os";
//#region src/infra/network-interfaces.ts
function normalizeNetworkInterfaceFamily(family) {
	if (family === "IPv4" || family === 4) return "IPv4";
	if (family === "IPv6" || family === 6) return "IPv6";
}
/** Reads the current network interface snapshot, allowing tests to inject a reader. */
function readNetworkInterfaces(networkInterfaces = os.networkInterfaces) {
	return networkInterfaces();
}
/** Best-effort interface read that returns undefined when OS inspection fails. */
function safeNetworkInterfaces(networkInterfaces = os.networkInterfaces) {
	try {
		return readNetworkInterfaces(networkInterfaces);
	} catch {
		return;
	}
}
/** Lists non-internal interface addresses, optionally filtered by IP family. */
function listExternalInterfaceAddresses(snapshot, family) {
	const addresses = [];
	if (!snapshot) return addresses;
	for (const [name, entries] of Object.entries(snapshot)) {
		if (!entries) continue;
		for (const entry of entries) {
			if (!entry || entry.internal) continue;
			const address = entry.address?.trim();
			if (!address) continue;
			const entryFamily = normalizeNetworkInterfaceFamily(entry.family);
			if (!entryFamily || family && entryFamily !== family) continue;
			addresses.push({
				name,
				address,
				family: entryFamily
			});
		}
	}
	return addresses;
}
/** Picks a matching external address, honoring preferred interface names first. */
function pickMatchingExternalInterfaceAddress(snapshot, params) {
	const { family, preferredNames = [], matches = () => true } = params;
	const addresses = listExternalInterfaceAddresses(snapshot, family);
	for (const name of preferredNames) {
		const preferred = addresses.find((entry) => entry.name === name && matches(entry.address));
		if (preferred) return preferred.address;
	}
	return addresses.find((entry) => matches(entry.address))?.address;
}
//#endregion
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
/** Lists unique Tailscale IPv4/IPv6 addresses from local external interfaces. */
function listTailnetAddresses() {
	const ipv4 = [];
	const ipv6 = [];
	for (const { address, family } of listExternalInterfaceAddresses(readNetworkInterfaces())) {
		if (family === "IPv4" && isTailnetIPv4(address)) ipv4.push(address);
		if (family === "IPv6" && isTailnetIPv6(address)) ipv6.push(address);
	}
	return {
		ipv4: uniqueStrings(ipv4),
		ipv6: uniqueStrings(ipv6)
	};
}
/** Returns the first discovered Tailscale IPv4 address, if any. */
function pickPrimaryTailnetIPv4() {
	return listTailnetAddresses().ipv4[0];
}
/** Returns the first discovered Tailscale IPv6 address, if any. */
function pickPrimaryTailnetIPv6() {
	return listTailnetAddresses().ipv6[0];
}
//#endregion
export { readNetworkInterfaces as a, pickMatchingExternalInterfaceAddress as i, pickPrimaryTailnetIPv4 as n, safeNetworkInterfaces as o, pickPrimaryTailnetIPv6 as r, isTailnetIPv4 as t };
