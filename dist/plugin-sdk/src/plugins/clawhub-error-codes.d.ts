/** Stable ClawHub install error codes used by plugin install policy and diagnostics. */
export declare const CLAWHUB_INSTALL_ERROR_CODE: {
    readonly INVALID_SPEC: "invalid_spec";
    readonly PACKAGE_NOT_FOUND: "package_not_found";
    readonly VERSION_NOT_FOUND: "version_not_found";
    readonly NO_INSTALLABLE_VERSION: "no_installable_version";
    readonly SKILL_PACKAGE: "skill_package";
    readonly UNSUPPORTED_FAMILY: "unsupported_family";
    readonly PRIVATE_PACKAGE: "private_package";
    readonly INCOMPATIBLE_PLUGIN_API: "incompatible_plugin_api";
    readonly INCOMPATIBLE_GATEWAY: "incompatible_gateway";
    readonly ARTIFACT_UNAVAILABLE: "artifact_unavailable";
    readonly MISSING_ARCHIVE_INTEGRITY: "missing_archive_integrity";
    readonly ARTIFACT_DOWNLOAD_UNAVAILABLE: "artifact_download_unavailable";
    readonly ARCHIVE_INTEGRITY_MISMATCH: "archive_integrity_mismatch";
};
/** Union of stable ClawHub install error code values. */
export type ClawHubInstallErrorCode = (typeof CLAWHUB_INSTALL_ERROR_CODE)[keyof typeof CLAWHUB_INSTALL_ERROR_CODE];
