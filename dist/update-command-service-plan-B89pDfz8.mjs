import { r as asNullableRecord } from "./record-coerce-DItp3I4t.mjs";
import { t as stableStringify } from "./stable-stringify-CkQ0IEj1.mjs";
import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { n as resolveNodeVersionManager } from "./version-manager-path-CORhhR2Q.mjs";
import { n as ok, t as err } from "./result-BQGgYouL.mjs";
import { t as formatCliCommand } from "./command-format-DRYc0E-8.mjs";
import { r as parseTcpPortFromArgs } from "./tcp-port-BVV_ljmK.mjs";
import { v as resolveGatewayPort } from "./paths-DehQwyE0.mjs";
import { r as SUPPORTED_NODE_VERSION_RANGE } from "./node-version-DdJ6cN09.mjs";
import { i as nodeRuntimeFailure, n as detectCurrentSqliteCapabilities } from "./node-sqlite-DWn4GVXM.mjs";
import { n as sha256Hex } from "./node-crypto-Df3MIs6V.mjs";
import "./crypto-digest-D9Nqq3c7.mjs";
import { r as assertGatewayServiceMutationAllowed } from "./gateway-supervision-dG8swyHC.mjs";
import "./update-run-timeouts-Byb-PlTk.mjs";
import { p as tryReadJson } from "./json-files-C0HSMh2Z.mjs";
import { c as createRuntimeUpdateRecoverySteps, u as formatUpdateRecoverySteps } from "./update-outcome-ZpL2Kt9B.mjs";
import { n as createUpdateFailureFact } from "./update-failure-facts-THF-vx3i.mjs";
import { o as formatServiceInspectionReason } from "./service-inspection-error-axo4k_qi.mjs";
import { t as createConfigIO } from "./io.factory-ChIex6Yh.mjs";
import "./io-DuIKUcsW.mjs";
import { o as readActiveGatewayLockIdentity } from "./gateway-lock-CYjRlApN.mjs";
import { r as hasCommandProcessCleanupError } from "./exec-result-C4wNdxxi.mjs";
import { l as withCommandProcessScope } from "./exec-spawn-B7redWCL.mjs";
import { i as resolveManagedServiceNodeRunner, r as resolveGatewayServiceInstallationRefreshRoot, s as summarizeGatewayServiceLayout, t as gatewayServiceCommandMatchesRoot } from "./service-layout-DuzmQnH1.mjs";
import { a as resolveNodeRuntimeInfo } from "./runtime-paths-DifTYoyV.mjs";
import { o as nodeVersionSatisfiesEngine } from "./runtime-guard-QhifpZGP.mjs";
import { t as isContainerEnvironment } from "./container-environment-CNsJSTpY.mjs";
import { n as probePortUsage } from "./ports-probe-DxY7uEcU.mjs";
import { a as resolveGatewayService, i as readGatewayServiceState } from "./service-BCULlL85.mjs";
import { n as quotePowerShellArg, t as quoteCliArg } from "./quote-cli-arg-BEt71TUh.mjs";
import { r as resolveServiceRecoveryContext } from "./update-command-service-env-a79RyIGw.mjs";
import { A as createFreeBsdPkgOwnershipInspection } from "./update-runner-command-DJ8Zpaha.mjs";
import { t as resolveNodeRunner } from "./node-runner-Cua6MUxg.mjs";
import "./shared-Ca2ebFXK.mjs";
import path from "node:path";
import fs from "node:fs/promises";
import { Range, compare, minVersion, satisfies, valid, validRange } from "semver";
//#region src/cli/update-cli/update-command-service-plan.ts
var GatewayServiceUpdateOwnershipError = class extends Error {
	constructor(message, cause, inspectionReason) {
		super(inspectionReason ? formatServiceInspectionReason(inspectionReason) : message, { cause });
		this.name = "GatewayServiceUpdateOwnershipError";
		this.failureFacts = [createUpdateFailureFact({
			check: "managed-service",
			code: inspectionReason ?? "service-ownership-unverified",
			message: this.message
		})];
	}
};
function assertGatewayServiceAdmissionUnchanged(expectedService, serviceUpdateVerdict) {
	const expectedVerdict = expectedService?.serviceUpdateVerdict;
	if (expectedVerdict && expectedVerdict.kind !== serviceUpdateVerdict.kind) throw new GatewayServiceUpdateOwnershipError(serviceUpdateVerdict.kind === "unavailable" ? "Gateway service ownership could not be verified because inspection is unavailable. Run `openclaw gateway status --deep` and retry." : "Gateway service ownership changed after database admission; run `openclaw gateway status --deep` and retry.", void 0, serviceUpdateVerdict.kind === "unavailable" ? serviceUpdateVerdict.inspectionReason : void 0);
	if (expectedVerdict?.kind === "owned" && serviceUpdateVerdict.kind === "owned" && expectedVerdict.fingerprint !== serviceUpdateVerdict.fingerprint) throw new GatewayServiceUpdateOwnershipError("Gateway service definition changed after database admission; retry against its current configuration.", void 0);
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
		throw new GatewayServiceUpdateOwnershipError(err instanceof Error ? err.message : String(err), err);
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
	return detail ? `${GATEWAY_SERVICE_INSPECTION_WARNING} ${detail}` : GATEWAY_SERVICE_INSPECTION_WARNING;
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
	if (!params.allowIncompleteInspection && (state.loadState.status === "unknown" || state.runtime?.status !== "running" && state.runtime?.status !== "stopped" || process.platform === "linux" && observedSystemdManagerUid(state) === void 0)) return unavailable();
	const { managedDefinition: _managedDefinition, managedOverrides, ...effectiveCommand } = command;
	const serialized = stableStringify(managedOverrides && Object.keys(managedOverrides).length === 0 ? effectiveCommand : command);
	if (Buffer.byteLength(serialized) > 4194304) return unavailable();
	const root = params.root ?? (await summarizeGatewayServiceLayout(command))?.packageRootReal;
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
/** Recorded launchers cannot select an update's package, Node, or state without live inspection. */
async function readManagedGatewayServiceForUpdate(env, root, allowInstallRootChange = false) {
	return await withCommandProcessScope(async () => {
		let service;
		try {
			service = resolveGatewayService();
			const state = await readGatewayServiceState(service, {
				env,
				requireEffective: true,
				requireLoadedCommand: true,
				validateEnvBeforeStatusRead: assertGatewayServiceManagementAllowedForUpdate
			});
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
async function resolvePackageRuntimePreflight(params) {
	return await withCommandProcessScope(async () => {
		const nodeRunner = normalizeOptionalString(params.alreadyCurrent && !(params.service?.serviceUpdateVerdict?.kind === "owned" && params.service.serviceUpdateVerdict.requiresInstallRootRefresh) ? params.service?.serviceNodeRunner ?? params.nodeRunner : params.nodeRunner);
		const unchanged = () => nodeRunner ? { nodeRunner } : {};
		let target = params.target;
		if (!target && params.installedRoot) {
			const manifest = asNullableRecord(await tryReadJson(path.join(params.installedRoot, "package.json"), { maxBytes: 1048576 }));
			const version = normalizeOptionalString(manifest?.version);
			if (!version) return err("Cannot inspect the installed OpenClaw runtime requirement; repair its package.json before retrying openclaw update.");
			target = {
				version,
				nodeEngine: normalizeOptionalString(asNullableRecord(manifest?.engines)?.node) ?? null
			};
		}
		if (!target) return ok(unchanged());
		const runtime = await resolvePackageRuntimeForPreflight({
			nodeRunner,
			timeoutMs: params.timeoutMs
		});
		const satisfies = runtime.failure ? false : nodeVersionSatisfiesEngine(runtime.version, target.nodeEngine);
		const targetVersion = target.version;
		const unchangedRuntime = {
			...unchanged(),
			targetVersion
		};
		if (satisfies === true) return ok(unchangedRuntime);
		const canRefreshCurrentService = params.service?.running && params.service.serviceUpdateVerdict?.kind === "owned" && params.service.serviceUpdateVerdict.refreshDefinition;
		const fallbackNodeRunner = params.fallbackNodeRunner ?? (params.shouldRestart && nodeRunner && (params.alreadyCurrent ? canRefreshCurrentService : await gatewayServiceCommandUsesRoot({ root: params.root })) ? resolveNodeRunner() : void 0);
		if (nodeRunner && fallbackNodeRunner && fallbackNodeRunner !== nodeRunner) {
			const fallbackRuntime = await resolvePackageRuntimeForPreflight({
				nodeRunner: fallbackNodeRunner,
				timeoutMs: params.timeoutMs
			});
			if ((fallbackRuntime.failure ? false : nodeVersionSatisfiesEngine(fallbackRuntime.version, target.nodeEngine)) === true) return ok({
				nodeRunner: fallbackNodeRunner,
				replacedNodeRunner: nodeRunner,
				targetVersion
			});
		}
		if (satisfies !== false) return ok(unchangedRuntime);
		if (params.runtimeRecovery && target.nodeEngine) {
			const { resolveTargetNodeRuntime } = await import("./update-command-node-runtime-resolution-DD3nmWBG.mjs");
			const recovered = await resolveTargetNodeRuntime({
				engine: target.nodeEngine,
				recovery: params.runtimeRecovery,
				timeoutMs: params.timeoutMs
			});
			if (recovered) return ok({
				nodeRunner: recovered,
				replacedNodeRunner: nodeRunner ?? resolveNodeRunner(),
				targetVersion
			});
		}
		const runtimeLabel = runtime.nodeRunner ? `Node ${runtime.version ?? "unknown"} at ${runtime.nodeRunner}` : `Node ${runtime.version ?? "unknown"}`;
		const engineRange = target.nodeEngine ? validRange(target.nodeEngine) : null;
		const minimum = engineRange ? minVersion(engineRange)?.version ?? "unspecified" : "unspecified";
		const recommendation = minimumSupportedNodeVersion(engineRange ?? "*");
		const requirement = target.nodeEngine ? `Node ${target.nodeEngine}` : "a working Node runtime";
		const context = (params.service?.serviceUpdateVerdict)?.kind === "owned" && params.service?.serviceEnv ? resolveServiceRecoveryContext({
			serviceEnv: params.service.serviceEnv,
			serviceDefinitionEnv: params.service.serviceDefinitionEnv,
			invocationCwd: params.invocationCwd
		}) : void 0;
		const env = context?.env ?? params.service?.serviceEnv ?? process.env;
		const recoveryVersion = valid(targetVersion);
		const recoveryChannel = params.requestedChannel ?? (params.channel === "extended-stable" ? params.channel : void 0);
		const recoveryTarget = [
			"openclaw update",
			recoveryChannel ? `--channel ${recoveryChannel}` : "",
			params.sourceRoot || params.channel === "extended-stable" ? "" : `--tag ${recoveryVersion}`
		].filter(Boolean).join(" ");
		const retainedRoot = params.sourceRoot ?? params.root ?? params.installedRoot;
		const retainedEntry = retainedRoot ? path.resolve(retainedRoot, "openclaw.mjs") : void 0;
		const continuation = retainedEntry ? formatCliCommand(recoveryTarget, env).replace(/^openclaw\b/, () => `node ${process.platform === "win32" ? quotePowerShellArg(retainedEntry) : quoteCliArg(retainedEntry)}`) : void 0;
		const recoverySteps = recommendation && recoveryVersion ? createRuntimeUpdateRecoverySteps({
			nodeVersion: recommendation,
			targetVersion: recoveryVersion,
			manager: resolveNodeVersionManager(await tryRealpathOrResolve(runtime.nodeRunner ?? resolveNodeRunner()), env),
			container: isContainerEnvironment(),
			contextCommand: context?.command,
			continuation
		}) : void 0;
		if (recoverySteps?.at(-1)?.kind === "continue-update" && params.alreadyCurrent && nodeRunner && params.service?.serviceNodeRunner && !canRefreshCurrentService) recoverySteps.splice(-1, 0, {
			kind: "select-runtime",
			instruction: `The Gateway service still selects ${nodeRunner}. Before continuing, have its deployment owner select Node ${recommendation} in the service definition while retaining its installation, service account, and state/config selectors. Switching the shell runtime alone does not update that service definition.`
		});
		const upgrade = recoverySteps ? `Recovery:\n${formatUpdateRecoverySteps(recoverySteps)}` : recommendation ? "Select a published OpenClaw version before installing it under a supported Node runtime." : `No Node version satisfies both this range and this updater's supported range (${SUPPORTED_NODE_VERSION_RANGE}). This candidate version cannot be run by this updater with a supported Node release; install a supported Node and select a compatible OpenClaw target.`;
		return {
			...recoverySteps ? { recoverySteps } : {},
			...err([
				`openclaw@${targetVersion} requires ${requirement}; selected runtime is ${runtimeLabel}.`,
				...runtime.failure ? [runtime.failure] : [],
				upgrade
			].join("\n")),
			failureFacts: [createUpdateFailureFact({
				check: "node-runtime",
				code: "node-runtime-preflight",
				affectedKey: "engines.node",
				message: `Target package: openclaw@${valid(targetVersion) ?? "unknown"}; Minimum Node engine: ${minimum}; Running Node: ${valid(runtime.version ?? "") ?? "unknown"}`
			})]
		};
	});
}
function minimumSupportedNodeVersion(engineRange) {
	const candidate = new Range(engineRange);
	return new Range(SUPPORTED_NODE_VERSION_RANGE).set.flatMap((supported) => candidate.set.flatMap((required) => {
		const intersection = [...supported, ...required].map((entry) => entry.value).join(" ");
		const minimum = minVersion(intersection);
		if (!minimum) return [];
		const release = `${minimum.major}.${minimum.minor}.${minimum.patch}`;
		return satisfies(release, intersection) ? [release] : [];
	})).toSorted(compare)[0];
}
async function resolvePackageRuntimeForPreflight(params) {
	const nodeRunner = normalizeOptionalString(params.nodeRunner);
	if (!nodeRunner) {
		const version = process.versions.node ?? null;
		return {
			version,
			failure: nodeRuntimeFailure(version, await detectCurrentSqliteCapabilities())
		};
	}
	const runtime = await resolveNodeRuntimeInfo(nodeRunner, process.env, params.timeoutMs ?? 12e5);
	return {
		version: runtime.status === "probe-failed" ? null : runtime.version,
		failure: runtime.status === "probe-failed" ? runtime.error.message : runtime.capabilityError ?? null,
		nodeRunner
	};
}
async function tryRealpathOrResolve(value) {
	return await fs.realpath(path.resolve(value)).catch(() => path.resolve(value));
}
async function resolveManagedServicePackageUpdatePlan(params) {
	const pkgOwnership = params.pkgOwnership ?? createFreeBsdPkgOwnershipInspection(12e5);
	await pkgOwnership.assertUnowned(params.root);
	if (!isGatewayServiceManagementAllowedForUpdate(process.env)) return {
		rootRedirect: null,
		serviceUnitTarget: "not inspected (service management unavailable)"
	};
	const inspected = await readManagedGatewayServiceForUpdate(process.env);
	const command = inspected?.command ?? null;
	const layout = await summarizeGatewayServiceLayout(command);
	const serviceUnitTarget = layout?.entrypoint ?? "no service entrypoint found";
	if (!layout?.packageRootReal) return {
		rootRedirect: null,
		serviceUnitTarget
	};
	const serviceRoot = layout?.packageRoot;
	await pkgOwnership.assertUnowned(serviceRoot);
	const serviceNode = resolveManagedServiceNodeRunner(command);
	if (layout.entrypointSourceCheckout && await tryRealpathOrResolve(params.root) !== layout.packageRootReal) return {
		rootRedirect: null,
		serviceUnitTarget
	};
	if (serviceRoot && layout.entrypointSourceCheckout !== true && await tryRealpathOrResolve(params.root) !== layout.packageRootReal) return {
		serviceUnitTarget,
		...params.rebind !== false && process.platform !== "win32" && !command?.managedOverrides && !command?.managedDefinition && inspected?.verdict.refreshDefinition === true ? {
			rootRedirect: null,
			serviceRoot
		} : { rootRedirect: {
			root: serviceRoot,
			previousRoot: params.root
		} },
		...serviceNode ? { nodeRunner: serviceNode } : {}
	};
	if (!serviceNode) return {
		rootRedirect: null,
		serviceUnitTarget
	};
	const [serviceNodeReal, currentNodeReal] = await Promise.all([tryRealpathOrResolve(serviceNode), tryRealpathOrResolve(resolveNodeRunner())]);
	return {
		serviceUnitTarget,
		rootRedirect: null,
		...serviceNodeReal !== currentNodeReal ? { nodeRunner: serviceNode } : {}
	};
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
export { gatewayServiceCommandUsesRoot as a, observedSystemdManagerUid as c, resolveManagedServicePackageUpdatePlan as d, resolvePackageRuntimePreflight as f, assertGatewayServiceManagementAllowedForUpdate as i, readManagedGatewayServiceForUpdate as l, GatewayServiceUpdateOwnershipError as n, inspectManagedGatewayServiceBeforeUpdate as o, resolveUpdatedGatewayRestartPort as p, assertGatewayServiceAdmissionUnchanged as r, isGatewayServiceManagementAllowedForUpdate as s, GATEWAY_SERVICE_INSPECTION_WARNING as t, resolveGatewayServiceManagementBlockMessageForUpdate as u };
