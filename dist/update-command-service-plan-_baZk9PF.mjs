import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { t as isBunRuntime } from "./runtime-binary-BAwmhhZ0.mjs";
import { t as stableStringify } from "./stable-stringify-Djn3uxNo.mjs";
import { r as parseTcpPortFromArgs } from "./tcp-port-8uSpDbMY.mjs";
import { b as resolveGatewayPort } from "./paths-DGIwWbpu.mjs";
import { n as sha256Hex } from "./node-crypto-BG4u3UnX.mjs";
import "./crypto-digest-y6oZN-_F.mjs";
import "./update-run-timeouts-Byb-PlTk.mjs";
import { r as hasCommandProcessCleanupError } from "./exec-result-s7WOth0N.mjs";
import { l as withCommandProcessScope } from "./exec-spawn-IxJJNQFo.mjs";
import { s as formatServiceInspectionReason } from "./service-inspection-error-Bsltcpi4.mjs";
import { r as assertGatewayServiceMutationAllowed } from "./gateway-supervision-CUdBruRD.mjs";
import { n as readInstallOwner, t as formatInstallOwnerMessage } from "./install-owner-ImshV9Dw.mjs";
import { y as createFreeBsdPkgOwnershipInspection } from "./update-global-rkW-mKvG.mjs";
import { r as createUpdateFailureFact } from "./update-failure-facts-CetdnXr-.mjs";
import { t as createConfigIO } from "./io.factory-DWrU5KGJ.mjs";
import "./io-CUI9EWW_.mjs";
import { o as readActiveGatewayLockIdentity } from "./gateway-lock-B6mKYs2x.mjs";
import { t as resolveNodeRunner } from "./node-runner-DIokVayT.mjs";
import "./shared-CiAI6uii.mjs";
import { n as hasGatewayServiceDefinitionOverrides } from "./service-types-CPk6CBn6.mjs";
import { a as resolveManagedServiceNodeRunner, c as summarizeGatewayServiceLayout, i as resolveGatewayServiceInstallationRefreshRoot, t as gatewayServiceCommandMatchesRoot } from "./service-layout-BNLNn9Ng.mjs";
import { n as probePortUsage } from "./ports-probe-DMGtt9dg.mjs";
import { t as withGatewayServiceOperationLock } from "./service-operation-lock-Dnqiud_w.mjs";
import { i as readGatewayServiceState, n as resolveGatewayService } from "./service-CCUynFdj.mjs";
import { a as resolveUpdateServiceHeapEnv } from "./update-command-service-env-lR0aWgPL.mjs";
import { s as resolvePinnedDaemonRuntimePath } from "./runtime-paths-D7k3lrcM.mjs";
import path from "node:path";
import fs from "node:fs/promises";
//#region src/cli/update-cli/update-command-service-plan.ts
var GatewayServiceUpdateOwnershipError = class extends Error {
	constructor(message, cause, inspectionReason, code) {
		super(inspectionReason ? formatServiceInspectionReason(inspectionReason) : message, { cause });
		this.name = "GatewayServiceUpdateOwnershipError";
		this.failureFacts = [createUpdateFailureFact({
			check: "managed-service",
			code: inspectionReason ?? code ?? "service-ownership-unverified",
			message: this.message
		})];
	}
};
function assertGatewayServiceAdmissionUnchanged(expectedService, serviceUpdateVerdict) {
	const expectedVerdict = expectedService?.serviceUpdateVerdict;
	if (expectedVerdict && expectedVerdict.kind !== serviceUpdateVerdict.kind) throw new GatewayServiceUpdateOwnershipError(serviceUpdateVerdict.kind === "unavailable" ? "Gateway service ownership could not be verified because inspection is unavailable. Run `openclaw gateway status --deep` and retry." : "Gateway service ownership changed after database admission; run `openclaw gateway status --deep` and retry.", void 0, serviceUpdateVerdict.kind === "unavailable" ? serviceUpdateVerdict.inspectionReason : void 0, serviceUpdateVerdict.kind === "unavailable" ? void 0 : "service-ownership-changed");
	if (expectedVerdict?.kind === "owned" && serviceUpdateVerdict.kind === "owned" && expectedVerdict.fingerprint !== serviceUpdateVerdict.fingerprint) throw new GatewayServiceUpdateOwnershipError("Gateway service definition changed after database admission; retry against its current configuration.", void 0, void 0, "service-definition-changed");
}
function resolveGatewayServiceManagementBlockMessageForUpdate(env = process.env) {
	try {
		assertGatewayServiceManagementAllowedForUpdate(env);
		return;
	} catch (err) {
		return err instanceof Error ? err.message : String(err);
	}
}
function assertGatewayServiceManagementAllowedForUpdate(env = process.env) {
	try {
		assertGatewayServiceMutationAllowed("manage the gateway service during update", env);
	} catch (err) {
		throw new GatewayServiceUpdateOwnershipError(err instanceof Error ? err.message : String(err), err, void 0, "service-mutation-refused");
	}
}
function isGatewayServiceManagementAllowedForUpdate(env = process.env) {
	return resolveGatewayServiceManagementBlockMessageForUpdate(env) === void 0;
}
const GATEWAY_SERVICE_INSPECTION_WARNING = "Gateway service inspection is unavailable; automatic service restart was skipped. Restart the Gateway you launched manually after the update. Any recorded service definition was left unchanged; inspect it with `openclaw gateway status --deep`.";
function serviceInspectionWarningMessage(state) {
	if (state.inspectionReason) return `${GATEWAY_SERVICE_INSPECTION_WARNING} ${formatServiceInspectionReason(state.inspectionReason)}`;
	if (process.platform === "freebsd") return `${GATEWAY_SERVICE_INSPECTION_WARNING} On FreeBSD, use the Gateway's rc.d or foreground process owner for service management.`;
	const runtime = state.runtime;
	const tasksCurrent = runtime?.systemd?.tasksCurrent;
	if (process.platform === "linux" && runtime?.status === "unknown" && (runtime.state === "inactive" || runtime.state === "failed") && !runtime.pid && tasksCurrent !== void 0 && tasksCurrent > 0) return `${GATEWAY_SERVICE_INSPECTION_WARNING} Processes remain in the systemd service cgroup (${tasksCurrent} tasks). Have their owner stop them before state maintenance.`;
	const detail = runtime?.inspectionFailure?.detail;
	return GATEWAY_SERVICE_INSPECTION_WARNING + (detail ? ` ${detail}` : "");
}
function observedSystemdManagerUid(state) {
	const uid = state.runtime?.systemd?.managerUid;
	return typeof uid === "number" && Number.isInteger(uid) && uid >= 0 && uid < 4294967295 ? uid : void 0;
}
async function inspectManagedGatewayServiceBeforeUpdate(params) {
	const { state } = params;
	const { command } = state;
	const unavailable = () => ({
		kind: "unavailable",
		message: serviceInspectionWarningMessage(state),
		...state.inspectionReason ? { inspectionReason: state.inspectionReason } : {}
	});
	if (!command) return !state.installed && state.loadState.status === "not-loaded" && !state.running && state.runtime?.missingUnit && await readActiveGatewayLockIdentity({
		env: state.env,
		requireInspection: true
	}).then((identity) => !identity, () => false) && await probePortUsage(await resolveUpdatedGatewayRestartPort({ serviceEnv: state.env })) === "free" ? { kind: "absent" } : unavailable();
	if (process.platform === "win32" && !command.sourcePath) return unavailable();
	if (!params.allowIncompleteInspection && (state.loadState.status === "unknown" || state.runtime?.status !== "running" && state.runtime?.status !== "stopped" || process.platform === "linux" && observedSystemdManagerUid(state) === void 0)) return unavailable();
	const { startupEntryPaths: _startupEntryPaths, ...fingerprintCommand } = command;
	if (!hasGatewayServiceDefinitionOverrides(fingerprintCommand)) {
		delete fingerprintCommand.managedDefinition;
		delete fingerprintCommand.managedOverrides;
	}
	const serialized = stableStringify(fingerprintCommand);
	if (Buffer.byteLength(serialized) > 4194304) return unavailable();
	const layout = await summarizeGatewayServiceLayout(command);
	const installOwner = await readInstallOwner(layout?.packageRootReal ?? null);
	if (installOwner) throw new GatewayServiceUpdateOwnershipError(formatInstallOwnerMessage(installOwner), void 0, void 0, "service-mutation-refused");
	const root = params.root ?? layout?.packageRootReal;
	if (!root) return unavailable();
	const ownsRoot = await gatewayServiceCommandUsesRoot({
		root,
		command
	});
	if (ownsRoot === null && !params.retainedCommand) return unavailable();
	if (ownsRoot === false) {
		const serviceRoot = params.allowInstallRootChange ? await resolveGatewayServiceInstallationRefreshRoot({
			root,
			state
		}) : void 0;
		if (serviceRoot) return {
			kind: "owned",
			root: serviceRoot,
			fingerprint: sha256Hex(serialized),
			refreshDefinition: true,
			requiresInstallRootRefresh: true
		};
		return { kind: "foreign" };
	}
	const fingerprint = sha256Hex(serialized);
	return ownsRoot ? {
		kind: "owned",
		root,
		fingerprint,
		refreshDefinition: (state.definitionMutationCapability?.kind ?? "writable") === "writable"
	} : {
		kind: "unresolved",
		root,
		fingerprint
	};
}
/** Update ownership requires the effective loaded command and an admitted manager route. */
function readGatewayServiceStateForUpdate(service, env, timeoutMs, inspection) {
	const read = (loadForInspection) => readGatewayServiceState(service, {
		env,
		requireEffective: true,
		requireLoadedCommand: true,
		loadForInspection,
		validateEnvBeforeStatusRead: assertGatewayServiceManagementAllowedForUpdate,
		timeoutMs
	}).then((state) => ({
		...state,
		env: resolveUpdateServiceHeapEnv(state.env, env, state.command?.programArguments)
	}));
	if (process.platform !== "linux" || inspection?.managerUid === void 0) return read();
	const { managerUid } = inspection;
	return withGatewayServiceOperationLock(env ?? process.env, async (assertNative) => {
		const assertCurrent = () => {
			assertNative();
			inspection.assertCurrent();
		};
		assertCurrent();
		const state = await read({
			managerUid,
			assertCurrent,
			assertReadCurrent: assertNative
		});
		assertCurrent();
		return state;
	});
}
/** Recorded launchers cannot select an update's package, Node, or state without live inspection. */
async function readManagedGatewayServiceForUpdate(env, root, allowInstallRootChange = false) {
	return await withCommandProcessScope(async () => {
		let service;
		try {
			service = resolveGatewayService();
			const state = await readGatewayServiceStateForUpdate(service, env);
			if (!state.command) return null;
			const inspection = await inspectManagedGatewayServiceBeforeUpdate({
				state,
				root,
				allowInstallRootChange
			});
			return inspection.kind === "owned" ? {
				...state,
				command: state.command,
				verdict: inspection
			} : null;
		} catch (error) {
			if (hasCommandProcessCleanupError(error)) throw error;
			if (error instanceof GatewayServiceUpdateOwnershipError && service) {
				if (await service.isLoaded({ env }).then(() => true, (probeError) => {
					if (hasCommandProcessCleanupError(probeError)) throw probeError;
					return false;
				})) throw error;
			}
			return null;
		}
	});
}
async function tryRealpathOrResolve(value) {
	return await fs.realpath(path.resolve(value)).catch(() => path.resolve(value));
}
async function resolveManagedServicePackageUpdatePlan(params) {
	const pkgOwnership = params.pkgOwnership ?? createFreeBsdPkgOwnershipInspection(12e5);
	await pkgOwnership.assertUnowned(params.root);
	const plan = {
		rootRedirect: null,
		serviceUnitTarget: "not inspected (service management unavailable)"
	};
	if (!isGatewayServiceManagementAllowedForUpdate(process.env)) return plan;
	const inspected = await readManagedGatewayServiceForUpdate(process.env);
	const command = inspected?.command ?? null;
	const layout = await summarizeGatewayServiceLayout(command);
	plan.serviceUnitTarget = layout?.entrypoint ?? "no service entrypoint found";
	if (!layout?.packageRootReal) return plan;
	const serviceRoot = layout?.packageRoot;
	await pkgOwnership.assertUnowned(serviceRoot);
	const differentRoot = await tryRealpathOrResolve(params.root) !== layout.packageRootReal;
	if (layout.entrypointSourceCheckout && differentRoot) return plan;
	const executable = command?.programArguments[0];
	const serviceBun = executable && isBunRuntime(executable);
	const serviceNode = serviceBun ? await resolvePinnedDaemonRuntimePath(executable, "bun", inspected?.env ?? process.env) : resolveManagedServiceNodeRunner(command);
	if (serviceNode && (differentRoot || serviceBun || await tryRealpathOrResolve(serviceNode) !== await tryRealpathOrResolve(resolveNodeRunner()))) plan.nodeRunner = serviceNode;
	if (serviceRoot && differentRoot) {
		if (!serviceBun && params.rebind !== false && process.platform !== "win32" && !hasGatewayServiceDefinitionOverrides(command) && inspected?.verdict.refreshDefinition === true) plan.serviceRoot = serviceRoot;
		else plan.rootRedirect = {
			root: serviceRoot,
			previousRoot: params.root
		};
	}
	return plan;
}
async function gatewayServiceCommandUsesRoot(params) {
	const expectedRoot = normalizeOptionalString(params.root);
	if (!expectedRoot) return null;
	const command = params.command === void 0 ? isGatewayServiceManagementAllowedForUpdate(params.env ?? process.env) ? (await readManagedGatewayServiceForUpdate(params.env ?? process.env))?.command ?? null : null : params.command;
	return await gatewayServiceCommandMatchesRoot(expectedRoot, command);
}
async function resolveUpdatedGatewayRestartPort(params) {
	const env = params.serviceEnv ?? params.processEnv ?? process.env;
	let config = params.config;
	if (params.serviceCommand) {
		const port = parseTcpPortFromArgs(params.serviceCommand.programArguments);
		if (port !== null) return port;
	}
	if (params.serviceCommand || !config) config = await createConfigIO({
		env,
		observe: false,
		pluginValidation: "skip",
		suppressFutureVersionWarning: true
	}).readBestEffortConfig();
	return resolveGatewayPort(config, env);
}
//#endregion
export { gatewayServiceCommandUsesRoot as a, observedSystemdManagerUid as c, resolveGatewayServiceManagementBlockMessageForUpdate as d, resolveManagedServicePackageUpdatePlan as f, assertGatewayServiceManagementAllowedForUpdate as i, readGatewayServiceStateForUpdate as l, tryRealpathOrResolve as m, GatewayServiceUpdateOwnershipError as n, inspectManagedGatewayServiceBeforeUpdate as o, resolveUpdatedGatewayRestartPort as p, assertGatewayServiceAdmissionUnchanged as r, isGatewayServiceManagementAllowedForUpdate as s, GATEWAY_SERVICE_INSPECTION_WARNING as t, readManagedGatewayServiceForUpdate as u };
