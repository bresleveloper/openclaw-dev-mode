//#region src/pairing/join-code.ts
const DEVICE_PAIRING_JOIN_CODE_RE = /^[A-Za-z0-9_-]{22}$/u;
function isDevicePairingJoinCode(value) {
	return DEVICE_PAIRING_JOIN_CODE_RE.test(value);
}
function parseDevicePairingJoinRequestPath(pathname) {
	if (pathname.endsWith("/j")) return "";
	const markerIndex = pathname.lastIndexOf("/j/");
	return markerIndex >= 0 ? pathname.slice(markerIndex + 3) : null;
}
//#endregion
export { parseDevicePairingJoinRequestPath as n, isDevicePairingJoinCode as t };
