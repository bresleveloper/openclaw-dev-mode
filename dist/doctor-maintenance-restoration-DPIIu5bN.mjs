import { t as formatCliCommand } from "./command-format-DRYc0E-8.mjs";
import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { a as findServiceOwnershipRefusal, r as ServiceInspectionError } from "./service-inspection-error-axo4k_qi.mjs";
import { r as hasCommandProcessCleanupError } from "./exec-result-C4wNdxxi.mjs";
import { n as assertDoctorServiceSelection } from "./doctor-service-repair-policy-B56mlGZD.mjs";
//#region src/commands/doctor-maintenance-restoration.ts
async function restoreDoctorGatewayService(params) {
	const { before, serviceEnv, root, env, writeConfig, warnings, settle, assertCustody, assertRestoreAdmission } = params;
	let cfg = params.cfg;
	const [{ readGatewayServiceState, resolveGatewayService }, { withGatewayServiceOperationLock }, { revalidateManagedGatewayServiceAfterUpdate }] = await Promise.all([
		import("./service-CZPrn7FT.mjs"),
		import("./service-operation-lock-D8_cVGVO.mjs"),
		import("./update-command-service-maintenance-4p-CzvJm.mjs")
	]);
	const service = resolveGatewayService();
	return {
		service,
		state: await withGatewayServiceOperationLock(serviceEnv, async (assertCurrent) => {
			const assertInspectionCurrent = () => {
				assertCustody?.();
				assertCurrent();
			};
			const assertMaintenanceCurrent = () => {
				assertInspectionCurrent();
				assertRestoreAdmission?.();
			};
			assertMaintenanceCurrent();
			const readCurrent = () => settle(() => readGatewayServiceState(service, {
				env: serviceEnv,
				requireEffective: true,
				requireLoadedCommand: true,
				...process.platform === "linux" && before.serviceManagerUid !== void 0 ? { loadForInspection: {
					managerUid: before.serviceManagerUid,
					assertCurrent: assertInspectionCurrent
				} } : {}
			}));
			let current;
			let inspectionFailure;
			try {
				current = await readCurrent();
				if (current.inspectionReason) {
					inspectionFailure = new ServiceInspectionError(current.inspectionReason);
					const refusal = findServiceOwnershipRefusal(inspectionFailure);
					if (refusal) throw refusal;
				} else if (current.loadState.status === "unknown" || current.runtime?.status !== "running" && current.runtime?.status !== "stopped") inspectionFailure = new Error(current.loadState.status === "unknown" ? current.loadState.detail : current.runtime?.inspectionFailure?.detail ?? "Gateway runtime inspection was inconclusive.");
			} catch (error) {
				if (hasCommandProcessCleanupError(error)) throw error;
				const refusal = findServiceOwnershipRefusal(error);
				if (refusal) throw refusal;
				inspectionFailure = error;
			}
			assertMaintenanceCurrent();
			let installation = before.serviceUpdateVerdict;
			if (current) {
				assertDoctorServiceSelection(env, current.env);
				const inspected = current;
				const verdict = await settle(() => revalidateManagedGatewayServiceAfterUpdate({
					state: inspected,
					root,
					preManagedServiceStop: before,
					allowIncompleteInspection: true
				}));
				if (verdict.kind === "unavailable") inspectionFailure ??= new Error(verdict.message);
				else installation = verdict;
			}
			if (installation?.kind === "owned" && (installation.requiresInstallRootRefresh || writeConfig)) {
				if (!inspectionFailure) {
					const assertInstallationCurrent = () => {
						assertMaintenanceCurrent();
						params.assertInstallationAdmission?.();
					};
					assertInstallationCurrent();
					const [{ maybeRepairGatewayServiceConfig }, { createDoctorPrompter }] = await Promise.all([import("./doctor-gateway-services-DTfDdR6t.mjs"), import("./doctor-prompter-BbOgTw2S.mjs")]);
					assertInstallationCurrent();
					cfg = await settle(() => maybeRepairGatewayServiceConfig(cfg, "local", params.runtime, createDoctorPrompter({
						runtime: params.runtime,
						options: params.options
					}), {
						async writeConfig(nextConfig) {
							assertInstallationCurrent();
							if (!writeConfig) throw new Error("Doctor config writer is unavailable during service restoration.");
							const committed = await writeConfig(nextConfig);
							assertInstallationCurrent();
							return committed;
						},
						serviceMaintenance: {
							managerUid: before.serviceManagerUid,
							assertCurrent: assertInstallationCurrent,
							assertReadCurrent: assertInspectionCurrent
						}
					}));
					assertInstallationCurrent();
					const repairedState = await readCurrent();
					assertInstallationCurrent();
					assertDoctorServiceSelection(env, repairedState.env);
					const repaired = await settle(() => revalidateManagedGatewayServiceAfterUpdate({
						state: repairedState,
						root,
						preManagedServiceStop: before
					}));
					assertInstallationCurrent();
					if (repaired.kind === "owned" && !repaired.requiresInstallRootRefresh) {
						if (installation.requiresInstallRootRefresh || repairedState.runtime?.status === "running") return repairedState;
						current = repairedState;
					} else if (!installation.requiresInstallRootRefresh) throw new Error("Gateway service ownership changed during Doctor repair; inspect the service before restarting it.");
				}
				if (installation.requiresInstallRootRefresh) {
					const message = `Gateway service still targets ${installation.root}; Doctor could not reconcile it with ${root}. The previous installation remains stopped because state compatibility is unverified. Run ${formatCliCommand("openclaw gateway install --force", env)} from the intended install.`;
					warnings.push(message);
					params.runtime.log(message);
					return;
				}
			}
			if (inspectionFailure) {
				const warning = `Warning: Gateway restoration inspection was inconclusive: ${formatErrorMessage(inspectionFailure)} Starting the managed Gateway stopped by Doctor and verifying readiness.`;
				warnings.push(warning);
				params.runtime.log(warning);
			}
			assertMaintenanceCurrent();
			const restore = current && !inspectionFailure ? service.restart : service.start;
			await settle(async () => {
				await restore({
					env: current?.env ?? serviceEnv,
					stdout: params.options.json ? process.stderr : process.stdout,
					preserveDefinition: true,
					assertCurrent: assertMaintenanceCurrent,
					...before.serviceSystemdIdentity ? { systemdIdentity: before.serviceSystemdIdentity } : {}
				});
			});
			assertMaintenanceCurrent();
			return current ?? {
				env: serviceEnv,
				command: null
			};
		}),
		cfg
	};
}
//#endregion
export { restoreDoctorGatewayService };
