//#region src/plugins/install-types.ts
const PLUGIN_INSTALL_ERROR_CODE = {
	CONFIG_MUTATION_BLOCKED: "config_mutation_blocked",
	INVALID_NPM_SPEC: "invalid_npm_spec",
	INVALID_MIN_HOST_VERSION: "invalid_min_host_version",
	UNKNOWN_HOST_VERSION: "unknown_host_version",
	INCOMPATIBLE_HOST_VERSION: "incompatible_host_version",
	INCOMPATIBLE_PLUGIN_API: "incompatible_plugin_api",
	INVALID_PLUGIN_API: "invalid_plugin_api",
	MISSING_OPENCLAW_EXTENSIONS: "missing_openclaw_extensions",
	MISSING_PLUGIN_MANIFEST: "missing_plugin_manifest",
	EMPTY_OPENCLAW_EXTENSIONS: "empty_openclaw_extensions",
	INVALID_OPENCLAW_EXTENSIONS: "invalid_openclaw_extensions",
	NPM_METADATA_FAILURE: "npm_metadata_failure",
	NPM_PACKAGE_NOT_FOUND: "npm_package_not_found",
	RELEASE_COHORT_UNAVAILABLE: "release_cohort_unavailable",
	PLUGIN_ID_MISMATCH: "plugin_id_mismatch",
	SECURITY_SCAN_BLOCKED: "security_scan_blocked",
	SECURITY_SCAN_FAILED: "security_scan_failed",
	UNSUPPORTED_PLAIN_FILE_PLUGIN: "unsupported_plain_file_plugin"
};
/**
* Detects npm failures caused by a target that is not published, as opposed to a
* broken install. Channel-aware installs use this to widen the selector instead
* of failing when the requested release has no artifact.
*/
function isUnavailableNpmTarget(result) {
	return result.code === PLUGIN_INSTALL_ERROR_CODE.NPM_PACKAGE_NOT_FOUND;
}
//#endregion
export { isUnavailableNpmTarget as n, PLUGIN_INSTALL_ERROR_CODE as t };
