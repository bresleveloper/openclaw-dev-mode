//#region src/claws/provenance-agent-origin.ts
/** Versioned ownership payload for agent state that predates Claw enrollment. */
const CLAW_INSTALL_RECORD_ADOPTED_SCHEMA_VERSION = "openclaw.clawInstallRecord.v3";
function isAdoptedAgentPaths(value) {
	if (!value || typeof value !== "object" || Array.isArray(value)) return false;
	if (!("origin" in value) || !("paths" in value)) return false;
	return value.origin === "adopted" && Array.isArray(value.paths) && value.paths.every((path) => typeof path === "string");
}
function decodeClawAgentOwnership(value, schemaVersion) {
	const parsed = JSON.parse(value);
	if (schemaVersion === "openclaw.clawInstallRecord.v3") {
		if (!isAdoptedAgentPaths(parsed)) throw new Error("Adopted Claw install record has invalid agent ownership data.");
		return {
			origin: "adopted",
			paths: [...parsed.paths]
		};
	}
	if (schemaVersion !== "openclaw.clawInstallRecord.v1" && schemaVersion !== "openclaw.clawInstallRecord.v2") throw new Error(`Unsupported Claw install record schema ${JSON.stringify(schemaVersion)}.`);
	if (!Array.isArray(parsed) || !parsed.every((path) => typeof path === "string")) throw new Error("Created Claw install record has invalid agent ownership data.");
	return {
		origin: "created",
		paths: [...parsed]
	};
}
function encodeClawAgentOwnership(paths, origin) {
	return origin === "adopted" ? {
		schemaVersion: CLAW_INSTALL_RECORD_ADOPTED_SCHEMA_VERSION,
		agentOwnedPathsJson: JSON.stringify({
			origin,
			paths
		})
	} : {
		schemaVersion: "openclaw.clawInstallRecord.v2",
		agentOwnedPathsJson: JSON.stringify(paths)
	};
}
//#endregion
//#region src/claws/provenance-schema-version.ts
const LEGACY_CLAW_INSTALL_RECORD_SCHEMA_VERSION = "openclaw.clawInstallRecord.v1";
const CLAW_INSTALL_RECORD_SCHEMA_VERSION = "openclaw.clawInstallRecord.v2";
function parseClawInstallRecordSchemaVersion(value) {
	if (value === LEGACY_CLAW_INSTALL_RECORD_SCHEMA_VERSION || value === "openclaw.clawInstallRecord.v2" || value === "openclaw.clawInstallRecord.v3") return value;
	throw new Error(`Unsupported Claw install record schema ${JSON.stringify(value)}.`);
}
//#endregion
export { encodeClawAgentOwnership as a, decodeClawAgentOwnership as i, parseClawInstallRecordSchemaVersion as n, CLAW_INSTALL_RECORD_ADOPTED_SCHEMA_VERSION as r, CLAW_INSTALL_RECORD_SCHEMA_VERSION as t };
