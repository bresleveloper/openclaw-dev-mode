import { t as formatCliCommand } from "./command-format-DRYc0E-8.mjs";
import { r as hasCommandProcessCleanupError } from "./exec-result-C4wNdxxi.mjs";
import { c as withGatewayServiceInstallationRecovery, n as GatewayServiceAuthorityError, o as isUpdateOwnedGatewayServiceCommand, s as readGatewayServiceUpdateOriginalRoot } from "./service-update-authority-DujRnzx9.mjs";
import { r as resolveGatewayServiceInstallationRefreshRoot, t as gatewayServiceCommandMatchesRoot } from "./service-layout-DuzmQnH1.mjs";
import { n as auditGatewayServiceConfig } from "./service-audit-Bj8Y2WTD.mjs";
import { r as UPDATE_RUN_ID_ENV } from "./update-control-plane-sentinel-BWZUhXdG.mjs";
import { h as recordUpdateRunStep } from "./update-run-ledger-DE3m4CLB.mjs";
import { t as withGatewayServiceOperationLock } from "./service-operation-lock-D6KudVp5.mjs";
import { a as resolveGatewayService, i as readGatewayServiceState } from "./service-YFvztZiz.mjs";
import { i as settleGatewayServiceRebind } from "./service-rebind-CZ92-EFp.mjs";
import { t as captureGatewayServiceDefinitionBackup } from "./service-definition-backup-BlyRFg02.mjs";
import { isDeepStrictEqual } from "node:util";
//#region src/daemon/service-reconciliation.ts
/** Update repair shares the ordinary installer, retaining only facts needed for recovery. */
async function reconcileGatewayServiceDefinition(params) {
	return await withGatewayServiceOperationLock(params.env, async (assertCurrent) => {
		let warningIndex = 0;
		const warn = (message) => {
			params.warn(message);
			const runId = process.env[UPDATE_RUN_ID_ENV];
			if (runId && !isUpdateOwnedGatewayServiceCommand()) try {
				assertCurrent();
				recordUpdateRunStep(runId, {
					step: `warning:managed-service-reconciliation:${warningIndex++}`,
					status: "completed",
					endedAtMs: Date.now(),
					detail: message
				});
			} catch {
				params.warn("Could not record the service definition warning in update history.");
			}
		};
		const deny = (message) => {
			warn(message);
			throw new Error(`SERVICE_DEFINITION_UNKNOWN: ${message}`);
		};
		const command = params.command;
		if (!command) return deny("Gateway service definition could not be inspected; it was left unchanged.");
		const inspectHint = `Run ${formatCliCommand("openclaw gateway status --deep", params.env)} before retrying after the active maintenance or update finishes.`;
		let keys = [];
		let preservePolicy = [];
		const transaction = await captureGatewayServiceDefinitionBackup({
			env: params.env,
			command,
			assertCurrent,
			inspect: async () => {
				const current = await resolveGatewayService().readCommand(params.env, { requireEffective: true });
				assertCurrent();
				if (!isDeepStrictEqual(current, command)) throw new Error("Gateway service definition changed during inspection.");
				const roots = [params.root, readGatewayServiceUpdateOriginalRoot()].filter((root) => Boolean(root));
				const ownership = await Promise.all(roots.map((root) => gatewayServiceCommandMatchesRoot(root, command)));
				assertCurrent();
				if (!ownership.includes(true)) {
					const state = await readGatewayServiceState(resolveGatewayService(), {
						env: params.env,
						requireEffective: true
					});
					assertCurrent();
					if (!isDeepStrictEqual(state.command, command)) throw new Error("Gateway service definition changed during inspection.");
					const refreshRoot = await resolveGatewayServiceInstallationRefreshRoot({
						root: params.root,
						state
					});
					assertCurrent();
					const owned = refreshRoot && await gatewayServiceCommandMatchesRoot(refreshRoot, command);
					assertCurrent();
					if (!owned) throw new Error("Gateway service belongs to an unknown or foreign installation.");
				}
				const audit = await auditGatewayServiceConfig({
					env: params.env,
					command,
					expectedCommand: params.expectedCommand
				});
				assertCurrent();
				preservePolicy = [];
				for (const fact of audit.definitionDrift ?? []) if (fact.kind === "preserved") {
					preservePolicy.push(fact.key);
					warn(fact.message);
				}
				const edits = audit.definitionDrift?.filter((fact) => fact.kind === "unknown-edit" && !(process.platform === "linux" && command.sourcePath && fact.sourcePath !== command.sourcePath && fact.sourcePath && command.definitionPaths?.includes(fact.sourcePath))) ?? [];
				if (audit.definitionDriftError || edits.length) throw new Error([audit.definitionDriftError, ...edits.map((fact) => `${fact.key}: ${fact.message}`)].filter(Boolean).join(" "));
				keys = audit.definitionDrift?.filter((fact) => fact.kind === "outdated").map((fact) => fact.key) ?? [];
			}
		}).catch((error) => {
			if (hasCommandProcessCleanupError(error)) throw error;
			if (error instanceof GatewayServiceAuthorityError) {
				warn(`Service definition refresh was skipped; the definition was left unchanged: ${String(error)}. ${inspectHint}`);
				throw new GatewayServiceAuthorityError(error, error.outcome ?? "unchanged");
			}
			return deny(`Service definition inspection or backup failed; the definition was preserved: ${String(error)}`);
		});
		return await settleGatewayServiceRebind(assertCurrent, async () => {
			let recoveryResult;
			let recoveryError;
			try {
				return await withGatewayServiceInstallationRecovery(async () => {
					await params.install({
						...transaction.hooks,
						preservePolicy
					});
					assertCurrent();
					const receipt = await transaction.finish();
					warn(`${keys.length ? `Reconciled Gateway service definition: ${keys.join(", ")}.` : "Refreshed Gateway service definition."} Backup: ${transaction.backupPaths.join(", ")}`);
					return receipt;
				}, async () => {
					try {
						recoveryResult = await transaction.compensate();
						return recoveryResult;
					} catch (error) {
						recoveryError = error;
						throw error;
					}
				});
			} catch (error) {
				if (hasCommandProcessCleanupError(error)) {
					warn(`Service definition refresh did not settle; backups retained: ${transaction.backupPaths.join(", ")}`);
					throw error;
				}
				if (error instanceof GatewayServiceAuthorityError) {
					warn(error.outcome === "unchanged" || error.outcome === "restored" ? `Service definition refresh stopped; the previous definition was ${error.outcome === "restored" ? "restored" : "left unchanged"}: ${String(error)}. ${inspectHint}` : `Service definition recovery could not be verified: ${String(error)}; backups retained: ${transaction.backupPaths.join(", ")}. ${inspectHint}`);
					throw error;
				}
				if (recoveryResult === void 0) {
					warn(`Service definition refresh failed: ${String(error)}. Recovery could not be verified: ${String(recoveryError)}; backups retained: ${transaction.backupPaths.join(", ")}`);
					throw new GatewayServiceAuthorityError(new Error(`UPDATE_NATIVE_AUTHORITY: Service definition recovery is unverified: ${String(recoveryError)}`, { cause: error }), "recovery-pending");
				}
				return deny(`Service definition refresh failed; the previous definition was ${recoveryResult ? "restored" : "left unchanged"}: ${String(error)}`);
			}
		});
	});
}
//#endregion
export { reconcileGatewayServiceDefinition as t };
