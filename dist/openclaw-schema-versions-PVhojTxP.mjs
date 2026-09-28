//#region src/state/openclaw-schema-versions.ts
function parseOpenClawSchemaVersions(value) {
	if (!value || typeof value !== "object" || Array.isArray(value)) return;
	const record = value;
	if (!Number.isInteger(record.state) || record.state < 0 || !Number.isInteger(record.agent) || record.agent < 0) return;
	return {
		state: record.state,
		agent: record.agent
	};
}
function parsePackageOpenClawSchemaVersions(packageJson) {
	if (!packageJson || typeof packageJson !== "object" || Array.isArray(packageJson)) return;
	const manifest = packageJson;
	const openclaw = manifest.openclaw;
	if (openclaw !== void 0) {
		if (!openclaw || typeof openclaw !== "object" || Array.isArray(openclaw)) return;
		const schemaVersions = openclaw.schemaVersions;
		if (schemaVersions !== void 0) return parseOpenClawSchemaVersions(schemaVersions);
	}
	if (manifest.name !== "openclaw" || typeof manifest.version !== "string") return;
	const legacy = /^2026\.([1-7])\.([1-9]\d*)$/.exec(manifest.version);
	if (!legacy || !Number.isSafeInteger(Number(legacy[2])) || legacy[1] === "7" && legacy[2] !== "1") return;
	return {
		state: 1,
		agent: 1
	};
}
//#endregion
export { parsePackageOpenClawSchemaVersions as n, parseOpenClawSchemaVersions as t };
