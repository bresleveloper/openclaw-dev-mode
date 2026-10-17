import { r as defaultRuntime } from "./runtime-DlO3PTAd.mjs";
import { t as ExpectedCliError } from "./failure-output-gtb9zaTk.mjs";
import { i as readPackageVersion } from "./package-json-DuhFvY5l.mjs";
import { p as resolveUpdateRoot } from "./shared-D-l8dmoD.mjs";
import { o as refuseLegacyStateMigrationPlan, r as planLegacyStateMigrationsReadOnly } from "./state-migrations.doctor-C72bztZ1.mjs";
//#region src/cli/update-cli/update-command-migration-plan.ts
function requireSnapshotPath(value, flag) {
	if (!value.trim()) {
		const message = `${flag} must not be blank`;
		throw new ExpectedCliError({
			message,
			humanOutput: message,
			machineOutput: message
		});
	}
	return value;
}
async function updateMigrationPlanCommand(opts) {
	const root = await resolveUpdateRoot();
	const version = await readPackageVersion(root) ?? "unknown";
	let plan = await planLegacyStateMigrationsReadOnly({
		mode: "doctor",
		candidate: {
			root,
			version
		},
		snapshot: {
			homeDir: requireSnapshotPath(opts.snapshotHome, "--snapshot-home"),
			configPath: requireSnapshotPath(opts.snapshotConfig, "--snapshot-config"),
			stateDir: requireSnapshotPath(opts.snapshotState, "--snapshot-state")
		}
	});
	const observedVersion = await readPackageVersion(root);
	if (observedVersion !== version) plan = refuseLegacyStateMigrationPlan(plan, {
		code: "candidate-identity-changed",
		message: `Update version changed while migration planning was in progress: expected ${version}, observed ${observedVersion ?? "unknown"}.`
	});
	defaultRuntime.writeJson(plan);
	if (plan.outcome === "refused") defaultRuntime.exit(1);
}
//#endregion
export { updateMigrationPlanCommand };
