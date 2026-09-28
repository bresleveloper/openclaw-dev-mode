import { r as defaultRuntime } from "./runtime-BC29JSZp.mjs";
import { r as readPackageVersion } from "./package-json-skO3uhlG.mjs";
import { m as resolveUpdateRoot } from "./shared-OuJSSGTT.mjs";
import { o as refuseLegacyStateMigrationPlan, r as planLegacyStateMigrationsReadOnly } from "./state-migrations.doctor-BMSwQTIx.mjs";
//#region src/cli/update-cli/update-command-migration-plan.ts
function requireSnapshotPath(value, flag) {
	if (!value.trim()) throw new Error(`${flag} must not be blank`);
	return value;
}
async function createUpdateMigrationPlan(params) {
	const plan = await planLegacyStateMigrationsReadOnly({
		mode: "doctor",
		candidate: params.candidate,
		snapshot: params.snapshot,
		env: params.env
	});
	const observedVersion = await readPackageVersion(params.candidate.root);
	if (observedVersion !== params.candidate.version) return refuseLegacyStateMigrationPlan(plan, {
		code: "candidate-identity-changed",
		message: `Update version changed while migration planning was in progress: expected ${params.candidate.version}, observed ${observedVersion ?? "unknown"}.`
	});
	return plan;
}
async function updateMigrationPlanCommand(opts) {
	const root = await resolveUpdateRoot();
	const plan = await createUpdateMigrationPlan({
		candidate: {
			root,
			version: await readPackageVersion(root) ?? "unknown"
		},
		snapshot: {
			homeDir: requireSnapshotPath(opts.snapshotHome, "--snapshot-home"),
			configPath: requireSnapshotPath(opts.snapshotConfig, "--snapshot-config"),
			stateDir: requireSnapshotPath(opts.snapshotState, "--snapshot-state")
		}
	});
	defaultRuntime.writeJson(plan);
	if (plan.outcome === "refused") defaultRuntime.exit(1);
}
//#endregion
export { updateMigrationPlanCommand };
