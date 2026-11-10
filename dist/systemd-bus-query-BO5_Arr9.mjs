import { a as asOptionalRecord } from "./record-coerce-TIsquoVR.mjs";
//#region src/daemon/systemd-bus-query.ts
function isSystemdManagerUid(value) {
	return typeof value === "number" && Number.isInteger(value) && value >= 0 && value < 4294967295;
}
function systemdUnitCallArgs(destination, unitName, method) {
	return [
		"call",
		destination,
		"/org/freedesktop/systemd1",
		"org.freedesktop.systemd1.Manager",
		method,
		"s",
		unitName
	];
}
/** Decode busctl's ordered property replies without accepting mismatched signatures. */
function decodeSystemdBusProperties(output, signatures, unavailable) {
	const properties = output.trim().split(/\r?\n/).map((line) => asOptionalRecord(JSON.parse(line)));
	if (properties.length !== signatures.length || properties.some((property, index) => property?.type !== signatures[index])) throw unavailable();
	return properties.map((property) => property?.data);
}
/** The caller retains its own transport, deadline, and authority checks. */
async function readSystemdBusCall(query, method, args, signature, unavailable) {
	const [value] = await query([
		"call",
		"org.freedesktop.DBus",
		"/org/freedesktop/DBus",
		"org.freedesktop.DBus",
		method,
		...args
	], [signature]) ?? [];
	if (!Array.isArray(value) || value.length !== 1) throw unavailable();
	return value[0];
}
async function readSystemdBusOwner(query, unavailable) {
	const owner = await readSystemdBusCall(query, "GetNameOwner", ["s", "org.freedesktop.systemd1"], "s", unavailable);
	if (typeof owner !== "string" || !/^:[0-9]+\.[0-9]+$/.test(owner)) throw unavailable();
	return owner;
}
function readSystemdUnitObjectPath(value, unavailable) {
	if (!Array.isArray(value) || value.length !== 1 || typeof value[0] !== "string" || !/^\/org\/freedesktop\/systemd1\/unit\/[A-Za-z0-9_]+$/.test(value[0])) throw unavailable();
	return value[0];
}
//#endregion
export { readSystemdUnitObjectPath as a, readSystemdBusOwner as i, isSystemdManagerUid as n, systemdUnitCallArgs as o, readSystemdBusCall as r, decodeSystemdBusProperties as t };
