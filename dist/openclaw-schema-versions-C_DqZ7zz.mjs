import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
//#region src/state/openclaw-schema-versions.ts
function parseOpenClawSchemaVersions(value) {
	if (!isRecord(value)) return;
	const { state, agent } = value;
	if (typeof state !== "number" || !Number.isInteger(state) || state < 0 || typeof agent !== "number" || !Number.isInteger(agent) || agent < 0) return;
	return {
		state,
		agent
	};
}
function parsePackageOpenClawSchemaVersions(packageJson) {
	if (!isRecord(packageJson)) return;
	const openclaw = packageJson.openclaw;
	if (openclaw !== void 0) {
		if (!isRecord(openclaw)) return;
		const schemaVersions = openclaw.schemaVersions;
		if (schemaVersions !== void 0) return parseOpenClawSchemaVersions(schemaVersions);
	}
	if (packageJson.name !== "openclaw" || typeof packageJson.version !== "string") return;
	const legacy = /^2026\.([1-7])\.([1-9]\d*)$/.exec(packageJson.version);
	if (!legacy || !Number.isSafeInteger(Number(legacy[2])) || legacy[1] === "7" && legacy[2] !== "1") return;
	return {
		state: 1,
		agent: 1
	};
}
//#endregion
export { parsePackageOpenClawSchemaVersions as n, parseOpenClawSchemaVersions as t };
