import { r as hasCommandProcessCleanupError } from "./exec-result-s7WOth0N.mjs";
import { a as getGatewayServiceUpdateNativeCommand, f as withServiceInspectionBudget, l as withGatewayServiceUpdateAuthority, n as GatewayServiceAuthorityError } from "./service-update-authority-CoX8GMUL.mjs";
import { n as GATEWAY_SERVICE_STOP_TIMEOUT_MS } from "./gateway-shutdown-budget-v-vGFkEN.mjs";
import { o as resolveManagedGatewayServiceCommand, t as assertServiceDefinitionWritable } from "./service-types-CPk6CBn6.mjs";
import { I as execSystemctlUser, _ as refreshSystemdUnitPolicy, c as resolveSystemdServiceName, g as preserveSystemdUnitPolicy, l as resolveSystemdUnitPath, q as reloadSystemdUserManager, w as parseSystemdTimeSpanMs } from "./systemd-service-files-BXSBYnK_.mjs";
import { t as withGatewayServiceOperationLock } from "./service-operation-lock-Dnqiud_w.mjs";
import { t as parseKeyValueOutput } from "./runtime-parse-CEreG6YC.mjs";
import { n as assertNoSystemGatewayOwnership } from "./systemd-scope-CKzHr-87.mjs";
import { n as withSystemdDefinitionMutation } from "./systemd-definition-mutation-DS-eP-Cj.mjs";
import { n as auditGatewayServiceConfig } from "./service-audit-DHuHgBps.mjs";
import { t as reconcileGatewayServiceDefinition } from "./service-reconciliation-bMI7HKUe.mjs";
//#region src/daemon/systemd-maintenance.ts
/** Read the effective native policy; absence is a diagnostic, not a stop refusal. */
async function readSystemdGatewayStopTimeout(state) {
	const unit = `${resolveSystemdServiceName(state.env)}.service`;
	const result = await withServiceInspectionBudget(() => execSystemctlUser(state.env, [
		"show",
		unit,
		"--no-page",
		"--property",
		"LoadState,TimeoutStopUSec"
	], 1e4));
	const properties = parseKeyValueOutput(result.stdout, "=");
	const timeout = parseSystemdTimeSpanMs(properties.timeoutstopusec ?? "");
	return result.code === 0 && properties.loadstate === "loaded" && timeout !== void 0 ? timeout === 0 ? Infinity : timeout : void 0;
}
/** Refresh policy without activation: an ordinary install would stop under the old budget. */
async function prepareSystemdGatewayMaintenance(params) {
	const { state, assertCurrent } = params;
	let inspectEffective = true;
	try {
		assertCurrent();
		const timeout = params.stopping ? await readSystemdGatewayStopTimeout(state) : Infinity;
		assertCurrent();
		const audit = await auditGatewayServiceConfig({
			env: state.env,
			command: state.command
		});
		assertCurrent();
		if (!audit.definitionDrift?.some((fact) => fact.kind === "outdated") && (timeout ?? 0) >= 33e4) return false;
		const command = resolveManagedGatewayServiceCommand(state.command);
		if (!command) {
			params.warn("The installed definition is unavailable for a managed refresh.");
			return false;
		}
		assertServiceDefinitionWritable(state.definitionMutationCapability ?? {
			kind: "unknown",
			reason: "inspection-failed"
		});
		await withGatewayServiceOperationLock(state.env, async (assertNative) => withGatewayServiceUpdateAuthority(assertCurrent, async () => {
			await reconcileGatewayServiceDefinition({
				env: state.env,
				root: params.root,
				command: state.command,
				expectedCommand: command,
				warn: params.warn,
				install: async (definitionTransaction) => {
					await withSystemdDefinitionMutation(state.env, command.environment ?? state.env, async (mutation) => {
						const unitPath = resolveSystemdUnitPath(state.env);
						const previous = mutation.snapshots.get(unitPath);
						if (!previous) throw new Error("The managed unit disappeared before its policy refresh.");
						await assertNoSystemGatewayOwnership(state.env);
						await mutation.publish(unitPath, preserveSystemdUnitPolicy(refreshSystemdUnitPolicy(previous.contents.toString("utf8")), previous.contents.toString("utf8"), definitionTransaction.preservePolicy), previous.mode);
						await definitionTransaction.beforeWrite();
						await assertNoSystemGatewayOwnership(state.env);
						await reloadSystemdUserManager(state.env, void 0, definitionTransaction.assertCurrent);
						await definitionTransaction.beforeWrite();
					}, { definitionTransaction });
				}
			});
		}, {
			updateOwned: false,
			assertRecoveryCurrent: assertNative,
			nativeCommand: getGatewayServiceUpdateNativeCommand()
		}));
		return true;
	} catch (error) {
		if (hasCommandProcessCleanupError(error) || error instanceof GatewayServiceAuthorityError) {
			inspectEffective = false;
			throw error;
		}
		assertCurrent();
		params.warn(`Gateway service policy refresh skipped: ${String(error)}`);
		return false;
	} finally {
		if (!params.stopping && inspectEffective) {
			assertCurrent();
			try {
				const effective = await readSystemdGatewayStopTimeout(state);
				assertCurrent();
				if ((effective ?? 0) < 33e4) params.warn(`Gateway effective service stop timeout is ${effective === void 0 ? "unverified" : `${effective}ms`}; ${GATEWAY_SERVICE_STOP_TIMEOUT_MS / 1e3}s or longer is required. Preserving operator overrides; the Gateway was not stopped.`);
			} catch (error) {
				assertCurrent();
				params.warn(`Gateway effective service stop timeout could not be verified: ${String(error)}`);
			}
		}
	}
}
//#endregion
export { readSystemdGatewayStopTimeout as n, prepareSystemdGatewayMaintenance as t };
