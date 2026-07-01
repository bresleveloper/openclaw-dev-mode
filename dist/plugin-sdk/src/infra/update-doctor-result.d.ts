export declare const UPDATE_POST_INSTALL_DOCTOR_RESULT_PATH_ENV = "OPENCLAW_UPDATE_POST_INSTALL_DOCTOR_RESULT_PATH";
export declare const UPDATE_POST_INSTALL_DOCTOR_ADVISORY_EXIT_CODE = 86;
export type PackageUpdateStepAdvisory = {
    kind: "package-post-install-doctor";
    message: string;
};
export declare const PACKAGE_POST_INSTALL_DOCTOR_ADVISORY: PackageUpdateStepAdvisory;
export type UpdatePostInstallDoctorResult = {
    status: "advisory";
    advisory: PackageUpdateStepAdvisory & {
        reason: "deferred-configured-plugin-repair";
        details: string[];
    };
};
export declare function createUpdatePostInstallDoctorResultPath(): string;
export declare function createDeferredConfiguredPluginRepairDoctorResult(details: readonly string[]): UpdatePostInstallDoctorResult;
export declare function writeUpdatePostInstallDoctorResult(params: {
    resultPath: string;
    result: UpdatePostInstallDoctorResult;
}): Promise<void>;
export declare function consumeUpdatePostInstallDoctorResult(resultPath: string): Promise<UpdatePostInstallDoctorResult | null>;
