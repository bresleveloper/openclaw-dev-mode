import { t as formatErrorMessage } from "./errors-O33D01XW.mjs";
import { t as formatCliCommand } from "./command-format-DwEdrDKL.mjs";
import { r as hasCommandProcessCleanupError } from "./exec-result-s7WOth0N.mjs";
import { o as findServiceOwnershipRefusal, r as ServiceInspectionError } from "./service-inspection-error-Bsltcpi4.mjs";
import { t as isManagedGatewayServiceOffline } from "./update-command-service-publication-BkqAEDPc.mjs";
import { n as assertDoctorServiceSelection } from "./doctor-service-repair-policy-D8FKJEDH.mjs";
//#region src/commands/doctor-maintenance-restoration.ts
async function restoreDoctorGatewayService(params) {
	const { before, serviceEnv, root, env, writeConfig, warnings, settle, assertCustody, assertRestoreAdmission } = params;
	let cfg = params.cfg;
	const [{ readGatewayServiceState, resolveGatewayService }, { withGatewayServiceOperationLock }, { revalidateManagedGatewayServiceAfterUpdate }] = await Promise.all([
		import("./service-CEHmkj0v.mjs"),
		import("./service-operation-lock-Bpt5AZmN.mjs"),
		import("./update-command-service-maintenance-BOokBhnH.mjs")
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
			const readInspection = async () => {
				current = void 0;
				inspectionFailure = void 0;
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
				return current;
			};
			await readInspection();
			assertMaintenanceCurrent();
			let installation = before.serviceUpdateVerdict;
			const inspectActivation = async () => {
				const state = current;
				if (inspectionFailure || !state?.command) return {
					kind: "inconclusive",
					reason: inspectionFailure ? formatErrorMessage(inspectionFailure) : "The current service launcher could not be verified."
				};
				if (installation?.kind !== "owned" || installation.requiresInstallRootRefresh) return {
					kind: "not-ours",
					reason: "The service does not target this installation."
				};
				if (state.running || !await settle(() => isManagedGatewayServiceOffline(state))) return {
					kind: "inconclusive",
					reason: "The service is not verified offline."
				};
				return { kind: "owned-offline" };
			};
			const mayRestore = async () => {
				if (before.stopped) return true;
				const inspection = await inspectActivation();
				assertMaintenanceCurrent();
				if (inspection.kind === "owned-offline") return true;
				const warning = `Warning: Gateway activation skipped (${inspection.kind}): ${inspection.reason} Run ${formatCliCommand("openclaw gateway status --deep", env)} before starting it.`;
				warnings.push(warning);
				params.runtime.log(warning);
				return false;
			};
			const revalidate = async (state, allowIncompleteInspection = false) => {
				try {
					return await settle(() => revalidateManagedGatewayServiceAfterUpdate({
						state,
						root,
						preManagedServiceStop: before,
						allowIncompleteInspection
					}));
				} catch (error) {
					if (before.stopped || hasCommandProcessCleanupError(error) || findServiceOwnershipRefusal(error)) throw error;
					inspectionFailure = error;
					return {
						kind: "unavailable",
						message: formatErrorMessage(error)
					};
				}
			};
			if (current) {
				assertDoctorServiceSelection(env, current.env);
				const verdict = await revalidate(current, before.stopped);
				if (verdict.kind === "unavailable") inspectionFailure ??= new Error(verdict.message);
				else installation = verdict;
			}
			if (!await mayRestore()) return;
			if (installation?.kind === "owned" && (installation.requiresInstallRootRefresh || writeConfig)) {
				const originalInstallation = installation;
				if (!inspectionFailure) {
					const assertInstallationCurrent = () => {
						assertMaintenanceCurrent();
						params.assertInstallationAdmission?.();
					};
					assertInstallationCurrent();
					const [{ maybeRepairGatewayServiceConfig }, { createDoctorPrompter }] = await Promise.all([import("./doctor-gateway-services-CVrVF37L.mjs"), import("./doctor-prompter-Bkf8i93H.mjs")]);
					assertInstallationCurrent();
					cfg = await settle(() => maybeRepairGatewayServiceConfig(cfg, "local", params.runtime, createDoctorPrompter({
						runtime: params.runtime,
						options: params.options,
						signal: params.signal
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
					const repairedState = before.stopped ? await readCurrent() : await readInspection();
					assertInstallationCurrent();
					if (!repairedState) {
						await mayRestore();
						return;
					}
					assertDoctorServiceSelection(env, repairedState.env);
					const repaired = await revalidate(repairedState);
					assertInstallationCurrent();
					if (repaired.kind === "owned" && !repaired.requiresInstallRootRefresh) {
						if (originalInstallation.requiresInstallRootRefresh || repairedState.runtime?.status === "running") return repairedState;
						current = repairedState;
					} else if (before.stopped && !originalInstallation.requiresInstallRootRefresh) throw new Error("Gateway service ownership changed during Doctor repair; inspect the service before restarting it.");
					if (!before.stopped) {
						current = repairedState;
						installation = repaired;
						if (!await mayRestore()) return;
					}
				}
				if (originalInstallation.requiresInstallRootRefresh) {
					const message = `Gateway service still targets ${originalInstallation.root}; Doctor could not reconcile it with ${root}. The previous installation remains stopped because state compatibility is unverified. Run ${formatCliCommand("openclaw gateway install --force", env)} from the intended install.`;
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
