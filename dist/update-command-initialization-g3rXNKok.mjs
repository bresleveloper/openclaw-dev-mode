import { t as hasNodeErrorCode } from "./path-guards-CH7noY0Z.mjs";
import { n as createOpenClawDatabaseMaintenanceScope } from "./openclaw-state-db-async-lifecycle-DLKxSPCk.mjs";
import { c as resolveOpenClawStateSqlitePath } from "./openclaw-state-db.paths-DfifnSGp.mjs";
import { n as acquireGatewayStateOwner } from "./gateway-state-owner-DmHycK5o.mjs";
import { t as SQLITE_SIDECAR_SUFFIXES } from "./sqlite-files-BEC3zbaw.mjs";
import { n as compareSemverStrings } from "./update-check-CWEQyown.mjs";
import { r as assertOpenClawStateWriteAllowedAtPath } from "./openclaw-state-ownership-BDcUGGMF.mjs";
import { r as isFailedUpdateStep } from "./update-run-step-BDxgGAu8.mjs";
import { l as requestUpdateDowngradeConfirmation, n as UpdatePreMutationError } from "./shared-D-l8dmoD.mjs";
import { t as assertUpdateRecoveryAdmission } from "./update-run-recovery-admission-DzSs7LNY.mjs";
import { r as runPackageUpdateDoctor } from "./update-command-package-BqeZr2Zr.mjs";
import { t as UnreportedUpdateAdmissionOutcome } from "./update-command-result-hCfuj3eW.mjs";
import fs from "node:fs/promises";
//#region src/cli/update-cli/update-command-initialization.ts
async function confirmFreshUpdateDowngrade(params) {
	const { target, opts } = params;
	if (!target.downgradeRisk || opts.yes) return;
	const decision = await requestUpdateDowngradeConfirmation({
		json: Boolean(opts.json),
		currentVersion: target.currentVersion,
		targetVersion: target.targetVersion,
		tag: target.tag
	});
	if (decision === "confirmed") return;
	throw new UnreportedUpdateAdmissionOutcome({
		root: target.root,
		mode: target.mode,
		installKind: target.updateInstallKind,
		opts,
		controlPlaneUpdateSentinelMeta: params.controlPlaneUpdateSentinelMeta,
		reason: decision === "cancelled" ? "cancelled" : "downgrade-confirmation-required",
		message: decision === "cancelled" ? "Update cancelled." : "Downgrade confirmation required.\nDowngrading can break configuration. Re-run in a TTY to confirm."
	}, { exitCode: decision === "cancelled" ? 0 : 1 });
}
/** Keep the original outcome when its owned-state cleanup also fails. */
async function withUpdateInitializationCleanup(operation, cleanup) {
	let result;
	try {
		result = await operation();
	} catch (error) {
		try {
			await cleanup();
		} catch (cleanupError) {
			if (cleanupError === error) throw error;
			throw new AggregateError([error, cleanupError], "Update initialization and cleanup failed", { cause: cleanupError });
		}
		throw error;
	}
	await cleanup();
	return result;
}
/** Missing state is not permission to recreate an interrupted database family. */
async function updateStateNeedsInitialization(env) {
	await assertUpdateRecoveryAdmission({ env });
	const databasePath = resolveOpenClawStateSqlitePath(env);
	await assertOpenClawStateWriteAllowedAtPath({
		databasePath,
		env,
		recoverOrphanedSidecars: false
	});
	try {
		await fs.lstat(databasePath);
		return false;
	} catch (error) {
		if (!hasNodeErrorCode(error, "ENOENT")) throw error;
	}
	for (const suffix of SQLITE_SIDECAR_SUFFIXES) {
		try {
			await fs.lstat(`${databasePath}${suffix}`);
		} catch (error) {
			if (hasNodeErrorCode(error, "ENOENT")) continue;
			throw error;
		}
		throw new UpdatePreMutationError("target-state-initialization", "The state database is missing but SQLite sidecars remain. Preserve the database family and restore its main file before updating.");
	}
	return true;
}
function acquireLegacyUpdateInitializationFence(params) {
	const databasePath = resolveOpenClawStateSqlitePath(params.env);
	const comparison = compareSemverStrings(params.targetVersion, "2026.7.1");
	if (params.targetSchemas.state !== 1 || comparison === null || comparison > 0) return;
	const owner = acquireGatewayStateOwner({ databasePath });
	const maintenance = createOpenClawDatabaseMaintenanceScope({
		schemaMaintenance: true,
		assertOwnerCurrent: owner.assertCurrent,
		assertDatabaseAccess: owner.assertDatabaseAccess
	});
	return {
		assertCurrent: owner.assertCurrent,
		run: (operation) => maintenance.run(operation),
		async release() {
			await maintenance.close();
			owner.release();
		}
	};
}
/** The selected release owns bootstrap; the parent may only inspect its result. */
async function initializeUpdateStateFromTarget(params) {
	await params.checkSchemas("before");
	params.assertCurrent();
	await updateStateNeedsInitialization(params.env);
	params.assertCurrent();
	const result = await runPackageUpdateDoctor({
		...params,
		managedServiceEnv: params.env
	});
	params.assertCurrent();
	await params.checkSchemas("after");
	if (!result || isFailedUpdateStep(result)) throw new UpdatePreMutationError("target-state-initialization", result?.stderrTail ?? "The selected release could not initialize its state database.");
	if (await updateStateNeedsInitialization(params.env)) throw new UpdatePreMutationError("target-state-initialization", "The selected release did not initialize a compatible state database.");
}
//#endregion
export { withUpdateInitializationCleanup as a, updateStateNeedsInitialization as i, confirmFreshUpdateDowngrade as n, initializeUpdateStateFromTarget as r, acquireLegacyUpdateInitializationFence as t };
