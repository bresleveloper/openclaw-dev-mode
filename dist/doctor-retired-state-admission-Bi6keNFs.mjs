import { r as resolveStateDir } from "./state-dir-C8s3cOPX.mjs";
import "./paths-orClZ-2Z.mjs";
import { p as readCurrentConfigForResolution } from "./io.runtime-Ds5uC0Bf.mjs";
import { n as assertNoRetiredStateFiles } from "./state-migrations.retired-files-C6dUPU8_.mjs";
import { r as listReferencedLegacyOAuthSidecarPaths, t as assertNoRetiredOAuthSidecarsBeforeConfigRecovery } from "./doctor-auth-legacy-paths-BW9Ya4su.mjs";
import { t as assertNoRetiredRuntimeStateFiles } from "./state-migrations.retired-runtime-files-CwmWdny1.mjs";
//#region src/commands/doctor-retired-state-admission.ts
/** Refuse unsupported sources before Doctor stops the Gateway or changes shared state. */
function assertDoctorRetiredStateAdmission() {
	assertNoRetiredRuntimeStateFiles(resolveStateDir(process.env));
	assertNoRetiredOAuthSidecarsBeforeConfigRecovery({ env: process.env });
	const { config, env } = readCurrentConfigForResolution();
	assertNoRetiredStateFiles("OAuth credential sidecars", listReferencedLegacyOAuthSidecarPaths(env, config));
}
//#endregion
export { assertDoctorRetiredStateAdmission as t };
