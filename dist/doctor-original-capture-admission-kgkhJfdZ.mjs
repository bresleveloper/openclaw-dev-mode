import { a as measureGatewayBootstrapStep } from "./startup-trace-AW_r3L-l.mjs";
import { i as resolveUpdateRehearsalRoot } from "./update-rehearsal-paths-CRhoE25Z.mjs";
import { t as DoctorMaintenanceRefusalError } from "./update-doctor-result-oZ38327j.mjs";
//#region src/commands/doctor-original-capture-admission.ts
/** The admitted owner checks deferred schemas before original capture or repair effects. */
function createDoctorOriginalCaptureHook(params) {
	return async ({ env, signal }) => {
		const [{ preserveDoctorOriginalState }, { getOpenClawDatabaseMaintenanceScope }] = await Promise.all([import("./doctor-original-capture-BxXg_Efb.mjs"), import("./openclaw-state-db-async-lifecycle-BqnN_0u7.mjs")]);
		const scope = getOpenClawDatabaseMaintenanceScope();
		if (!scope) throw new Error("Original state capture requires Doctor's admitted maintenance scope.");
		if (params.rehearsalRoot !== void 0) try {
			if (resolveUpdateRehearsalRoot(env) !== params.rehearsalRoot) throw new Error("Disposable Doctor namespace changed before maintenance admission.");
			const { guardUpdateDoctorSchemaUpgrade } = await import("./commands/doctor-update-schema-guard.js");
			scope.assertOwnerCurrent();
			if (resolveUpdateRehearsalRoot(process.env) !== params.rehearsalRoot) throw new Error("Disposable Doctor namespace changed before maintenance admission.");
			const guarded = await guardUpdateDoctorSchemaUpgrade({
				runtime: params.runtime,
				json: params.json,
				preserveSourceArtifacts: params.writeAuthority?.databaseGenerations ? true : void 0
			});
			scope.assertOwnerCurrent();
			if (guarded?.updateSchemaRehearsal) throw new Error("Deferred schema rehearsal cannot authorize repair of agents outside this disposable namespace.");
		} catch (cause) {
			throw new DoctorMaintenanceRefusalError(`Doctor rehearsal admission refused: ${cause instanceof Error ? cause.message : String(cause)}`, {
				kind: "data-at-risk",
				reason: "incomplete-migration"
			}, { cause });
		}
		await measureGatewayBootstrapStep("doctor.maintenance.preserve-original-state", () => preserveDoctorOriginalState({
			root: params.root,
			env,
			runtime: params.runtime,
			signal,
			assertCurrent: () => scope.assertOwnerCurrent(),
			writeAuthority: params.writeAuthority
		}));
	};
}
//#endregion
export { createDoctorOriginalCaptureHook };
