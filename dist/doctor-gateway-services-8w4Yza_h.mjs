import { n as isNodeRuntime } from "./runtime-binary-Cy5Lhult.mjs";
import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { t as formatCliCommand } from "./command-format-DRYc0E-8.mjs";
import { r as parseTcpPortFromArgs } from "./tcp-port-BVV_ljmK.mjs";
import { o as isDefaultInstallIdentity, v as resolveGatewayPort, x as resolveIsNixMode } from "./paths-DehQwyE0.mjs";
import { p as resolveSecretInputRef } from "./types.secrets-B5xWSzLp.mjs";
import { n as SUPPORTED_NODE_VERSIONS } from "./node-version-DdJ6cN09.mjs";
import { n as NON_DEFAULT_INSTALL_SERVICE_SKIP_REASON, r as assertGatewayServiceMutationAllowed } from "./gateway-supervision-dG8swyHC.mjs";
import { l as sanitizeServiceInspectionError } from "./service-inspection-error-axo4k_qi.mjs";
import { t as ConfigWritePostCommitError } from "./io.write-errors-C28rym6a.mjs";
import { b as isSystemdUnitActive } from "./systemd-service-files-tGuARbbA.mjs";
import { r as hasCommandProcessCleanupError } from "./exec-result-C4wNdxxi.mjs";
import { n as GatewayServiceAuthorityError } from "./service-update-authority-DujRnzx9.mjs";
import { b as isLaunchctlNotLoaded, v as execLaunchctl } from "./launchd-service-files-Cv2FPjBf.mjs";
import { a as resolveManagedGatewayServiceCommand, i as hasGatewayServiceLauncherOverride, r as hasGatewayServiceEnvironmentOverride, t as assertServiceDefinitionWritable } from "./service-types-d44oynyj.mjs";
import { n as inspectGatewayServiceInstallationDrift, s as summarizeGatewayServiceLayout } from "./service-layout-DuzmQnH1.mjs";
import { n as inspectGatewayHeapLimit, t as formatGatewayHeapLimitReport } from "./gateway-heap-9PZ2gCSQ.mjs";
import { t as OPENCLAW_WRAPPER_ENV_KEY } from "./program-args-Pr-IOsMq.mjs";
import { c as normalizeServiceEnvKey, d as readManagedServiceEnvKeysFromEnvironment } from "./service-managed-env-BpvQFzJj.mjs";
import { t as buildGatewayInstallPlan } from "./daemon-install-helpers-C4SsU1qw.mjs";
import { t as SERVICE_PROXY_ENV_KEYS } from "./service-env-DqHelw1y.mjs";
import { a as resolveNodeRuntimeInfo, l as resolveSystemNodeInfo, r as renderSystemNodeWarning } from "./runtime-paths-DifTYoyV.mjs";
import { i as resolveGatewayDaemonRuntime } from "./daemon-runtime-D15REPfs.mjs";
import { t as resolveGatewayAuthToken } from "./auth-token-resolution-U-tMi0Ou.mjs";
import { a as readDaemonRuntimePin } from "./runtime-pin-state-Bz2yXWLQ.mjs";
import { a as readEmbeddedGatewayToken, i as needsNodeRuntimeMigration, n as auditGatewayServiceConfig, t as SERVICE_AUDIT_CODES } from "./service-audit-Bj8Y2WTD.mjs";
import { n as mergeGatewayServiceEnv } from "./gateway-service-probe-hosts-D3Br9aVM.mjs";
import { t as withGatewayServiceOperationLock } from "./service-operation-lock-D6KudVp5.mjs";
import { a as resolveGatewayService, i as readGatewayServiceState } from "./service-YFvztZiz.mjs";
import { i as findSystemdGatewayInstallation, o as isSystemUnitActiveAndEnabled } from "./systemd-scope-ChBpir81.mjs";
import { c as uninstallLegacySystemdUnits, l as uninstallUserSystemdGatewayUnit } from "./systemd-j8mO8n69.mjs";
import { a as formatGatewayServiceInstallationDrift } from "./shared-Ba-Zp0iU.mjs";
import { i as renderGatewayServiceCleanupHints, n as findExtraGatewayServices } from "./inspect-BMBKoYK5.mjs";
import { t as note } from "./note-UlSlsJKw.mjs";
import { a as isServiceRepairDeferred, i as formatServiceRepairDeferredNote, l as shouldManageGatewayService, r as confirmDoctorServiceRepair, s as resolveServiceRepairPolicy } from "./doctor-service-repair-policy-C2VQLl6Z.mjs";
import { isDeepStrictEqual } from "node:util";
import path from "node:path";
import fs from "node:fs/promises";
import os from "node:os";
//#region src/commands/doctor-gateway-auth-token.ts
/**
* Resolves the token a managed gateway service can receive at install/update time.
*
* Exec SecretRefs are skipped by default because the service installer cannot safely evaluate
* arbitrary commands. Configured SecretRefs never fall back to ambient credentials.
*/
async function resolveGatewayAuthTokenForService(cfg, env, options = {}) {
	if (resolveSecretInputRef({
		value: cfg.gateway?.auth?.token,
		defaults: cfg.secrets?.defaults
	}).ref?.source === "exec" && options.allowExecSecretRefs !== true) return { unavailableReason: "gateway.auth.token SecretRef is configured but unavailable because exec SecretRef resolution is disabled." };
	const resolved = await resolveGatewayAuthToken({
		cfg,
		env,
		unresolvedReasonStyle: "detailed"
	});
	if (resolved.token) return { token: resolved.token };
	if (!resolved.secretRefConfigured) return {};
	if (resolved.unresolvedRefReason?.includes("resolved to an empty value")) return { unavailableReason: resolved.unresolvedRefReason };
	return { unavailableReason: `gateway.auth.token SecretRef is configured but unresolved (${resolved.unresolvedRefReason ?? "unknown reason"}).` };
}
//#endregion
//#region src/commands/doctor-gateway-installation.ts
async function canRepairRunningGatewayDefinition(params) {
	if ((await params.service.readRuntime(mergeGatewayServiceEnv(params.env, params.command)).catch(() => null))?.status === "running") return true;
	note(`Gateway native-policy repair requires a running managed service. The existing definition and stop state were preserved; inspect it with \`${formatCliCommand("openclaw gateway status --deep", params.env)}\` before using \`${formatCliCommand("openclaw gateway install --force", params.env)}\`.`, "Gateway service definition");
	return false;
}
/** One native writer retains Doctor custody through publication and recovery. */
async function installDoctorGatewayService(params) {
	try {
		const install = async (assertCurrent = params.maintenance?.assertCurrent) => {
			const publish = async (definitionTransaction) => {
				if (params.repair.kind === "definition" && !params.maintenance) {
					if (!await canRepairRunningGatewayDefinition({
						service: params.service,
						command: params.command,
						env: params.args.env
					})) throw new Error("Gateway stopped before native-policy repair; its definition was preserved.");
				}
				await params.service.install({
					...params.args,
					assertCurrent,
					definitionTransaction
				});
			};
			if (params.repair.kind === "definition") {
				const { reconcileGatewayServiceDefinition } = await import("./service-reconciliation-BBwRQ0Xn.mjs");
				await reconcileGatewayServiceDefinition({
					env: params.args.env,
					root: params.repair.root,
					command: params.command,
					expectedCommand: params.args,
					install: publish,
					warn: (message) => note(message, "Gateway service definition")
				});
			} else await publish();
		};
		if (params.repair.kind === "installation") {
			await repairGatewayServiceInstallation({
				service: params.service,
				command: params.command,
				activeRoot: params.repair.root,
				maintenance: params.maintenance,
				env: params.args.env,
				install
			});
			note("Gateway service installation reconciled with the active CLI.", "Gateway service installation");
		} else await install();
	} catch (err) {
		if (err instanceof GatewayServiceAuthorityError || hasCommandProcessCleanupError(err)) throw err;
		params.runtime.error(`Gateway service update failed: ${String(err)}`);
	}
}
/** Doctor consumes the updater's verified ownership; a recorded path alone grants no repair. */
async function assertGatewayServiceInstallationRepairAllowed(params) {
	const { inspectManagedGatewayServiceBeforeUpdate, GATEWAY_SERVICE_INSPECTION_WARNING } = await import("./update-command-service-plan-CChoUsoR.mjs");
	const maintenance = params.maintenance;
	const state = await readGatewayServiceState(params.service, {
		env: process.env,
		requireEffective: true,
		requireLoadedCommand: true,
		...maintenance?.managerUid !== void 0 ? { loadForInspection: {
			managerUid: maintenance.managerUid,
			assertCurrent: maintenance.assertCurrent,
			assertReadCurrent: maintenance.assertReadCurrent
		} } : {},
		validateEnvBeforeStatusRead: (env) => assertGatewayServiceMutationAllowed("repair the gateway service installation", env)
	}).catch((error) => {
		throw new Error(`${GATEWAY_SERVICE_INSPECTION_WARNING} ${sanitizeServiceInspectionError(error).message}`, { cause: error });
	});
	const verdict = await inspectManagedGatewayServiceBeforeUpdate({
		state,
		root: params.activeRoot,
		allowInstallRootChange: true
	});
	maintenance?.assertCurrent();
	if (verdict.kind === "unavailable") throw new Error(verdict.message);
	if (!isDeepStrictEqual(state.command, params.command)) throw new Error("Gateway service definition changed during Doctor; rerun doctor to inspect the current installation.");
	if (verdict.kind !== "owned" || !verdict.requiresInstallRootRefresh) throw new Error(`Gateway service installation is controlled by another owner; automatic installation repair was skipped. Inspect it with \`${formatCliCommand("openclaw gateway status --deep", state.env)}\`.`);
}
async function repairGatewayServiceInstallation(params) {
	await withGatewayServiceOperationLock(params.env, async (assertNative) => {
		const assertCurrent = () => {
			assertNative();
			params.maintenance?.assertCurrent();
		};
		await assertGatewayServiceInstallationRepairAllowed(params);
		assertCurrent();
		await params.install(assertCurrent);
		if (process.platform === "win32" && !params.maintenance) await params.service.restart({
			env: params.env,
			stdout: process.stdout,
			assertCurrent
		});
	});
}
const EXECSTART_REPAIR_CODES = /* @__PURE__ */ new Set([SERVICE_AUDIT_CODES.gatewayCommandMissing, SERVICE_AUDIT_CODES.gatewayEntrypointMismatch]);
function isExecStartRepairIssue(issue) {
	return EXECSTART_REPAIR_CODES.has(issue.code);
}
function resolveSystemdScopeFromServicePath(sourcePath) {
	const normalized = sourcePath?.replaceAll("\\", "/") ?? "";
	return normalized.startsWith("/etc/systemd/") || normalized.startsWith("/usr/lib/systemd/") || normalized.startsWith("/lib/systemd/") ? "system" : "user";
}
function resolveSystemdUnitNameFromServicePath(sourcePath) {
	const base = sourcePath ? path.posix.basename(sourcePath.replaceAll("\\", "/")) : "";
	return base.endsWith(".service") ? base : "openclaw-gateway.service";
}
async function resolveSystemdServiceRewriteBlock(command, issues) {
	if (process.platform !== "linux" || !issues.some(isExecStartRepairIssue)) return;
	const unitName = resolveSystemdUnitNameFromServicePath(command.sourcePath);
	const scope = resolveSystemdScopeFromServicePath(command.sourcePath);
	const active = await isSystemdUnitActive(process.env, unitName, scope);
	if (!active.ok) return `Could not determine whether gateway service ${unitName} is active: ${active.error}. Leaving supervisor metadata unchanged. Check \`systemctl${scope === "user" ? " --user" : ""} status ${unitName}\` and rerun doctor.`;
	if (!active.value) return;
	issues.splice(0, issues.length, ...issues.filter((issue) => !isExecStartRepairIssue(issue)));
	return `Gateway service ${unitName} is running; skipped command/entrypoint rewrites and leaving supervisor metadata unchanged. Stop the service first or use \`${formatCliCommand("openclaw gateway install --force")}\` when you want to replace the active launcher.`;
}
//#endregion
//#region src/commands/doctor-gateway-runtime-plan.ts
/** Builds Doctor service plans while preserving installed runtime and environment intent. */
async function buildExpectedGatewayServicePlan(params) {
	const managed = resolveManagedGatewayServiceCommand(params.command);
	const recordedNode = managed?.programArguments[0];
	let runtimePath = params.runtimePath;
	if (runtimePath === void 0 && !params.pinnedRuntimePath && params.runtime === "node" && !params.serviceInstallEnv["OPENCLAW_WRAPPER"]?.trim() && recordedNode && isNodeRuntime(recordedNode) && (await resolveNodeRuntimeInfo(recordedNode, params.serviceInstallEnv)).status === "supported") runtimePath = recordedNode;
	return buildGatewayInstallPlan({
		env: params.serviceInstallEnv,
		port: params.port,
		runtime: params.runtime,
		runtimePath,
		pinnedRuntimePath: params.pinnedRuntimePath,
		existingCommand: params.command,
		existingEnvironment: managed?.environment,
		existingEnvironmentValueSources: managed?.environmentValueSources,
		warn: (message, title) => note(message, title),
		config: params.cfg
	});
}
//#endregion
//#region src/commands/doctor-service-audit.ts
function formatServiceConfigIssues(issues) {
	return issues.map((issue) => issue.detail ? `- ${issue.message} (${issue.detail})` : `- ${issue.message}`);
}
function reportServiceDefinitionDrift(audit) {
	const messages = [...(audit.definitionDrift ?? []).map((fact) => fact.message), ...audit.definitionDriftError ? [audit.definitionDriftError] : []];
	if (messages.length > 0) note(messages.map((message) => `- ${message}`).join("\n"), "Gateway service definition");
}
/** Installation repair cannot implicitly approve other service-definition changes. */
function isServiceInstallationOnlyRepair(audit) {
	return !audit.definitionDriftError && !audit.definitionDrift?.length && audit.issues.every((issue) => issue.code === SERVICE_AUDIT_CODES.gatewayEntrypointMismatch);
}
function hasRepairableServiceDefinitionDrift(audit) {
	return !audit.definitionDriftError && audit.definitionDrift?.some((finding) => finding.kind === "outdated") === true && !audit.definitionDrift.some((finding) => finding.kind === "unknown-edit");
}
/** Native policy repair must not auto-approve unrelated command or credential changes. */
function isServiceDefinitionOnlyRepair(audit) {
	const policyCodes = /* @__PURE__ */ new Set([
		SERVICE_AUDIT_CODES.systemdAfterNetworkOnline,
		SERVICE_AUDIT_CODES.systemdWantsNetworkOnline,
		SERVICE_AUDIT_CODES.systemdRestartSec,
		SERVICE_AUDIT_CODES.systemdKillModeProcessOrNone,
		SERVICE_AUDIT_CODES.systemdKillModeControlGroup,
		SERVICE_AUDIT_CODES.systemdStopTimeout,
		"launchd-run-at-load",
		"launchd-keep-alive",
		"launchd-env-wrapper-outdated"
	]);
	return audit.issues.every((issue) => policyCodes.has(issue.code));
}
function isOperatorOwnedEnvironmentIssue(issue, command, environmentValueSources) {
	switch (issue.code) {
		case SERVICE_AUDIT_CODES.gatewayPathMissing:
		case SERVICE_AUDIT_CODES.gatewayPathMissingDirs:
		case SERVICE_AUDIT_CODES.gatewayPathNonMinimal: return hasGatewayServiceEnvironmentOverride(command, ["PATH"], { environmentValueSources });
		case SERVICE_AUDIT_CODES.gatewayTokenEmbedded:
		case SERVICE_AUDIT_CODES.gatewayTokenMismatch:
		case SERVICE_AUDIT_CODES.gatewayTokenDrift: return hasGatewayServiceEnvironmentOverride(command, ["OPENCLAW_GATEWAY_TOKEN"], { environmentValueSources });
		case SERVICE_AUDIT_CODES.gatewayPasswordEmbedded: return hasGatewayServiceEnvironmentOverride(command, ["OPENCLAW_GATEWAY_PASSWORD"], { environmentValueSources });
		case SERVICE_AUDIT_CODES.gatewayManagedEnvEmbedded: return hasGatewayServiceEnvironmentOverride(command, issue.environmentKeys ?? [], {
			environmentValueSources,
			normalizeKey: normalizeServiceEnvKey
		});
		case SERVICE_AUDIT_CODES.gatewayProxyEnvEmbedded: return hasGatewayServiceEnvironmentOverride(command, (issue.environmentKeys ?? []).filter((key) => SERVICE_PROXY_ENV_KEYS.some((proxyKey) => proxyKey === key)), { ignoreResets: true });
		default: return false;
	}
}
//#endregion
//#region src/commands/doctor-gateway-services.ts
/** Doctor repairs for installed gateway service config and duplicate legacy services. */
const DOCTOR_LAUNCHCTL_TIMEOUT_MS = 5e3;
const DOCTOR_LAUNCHCTL_CONFIRM_POLL_MS = 100;
async function confirmLegacyLaunchdServiceUnloaded(serviceTarget) {
	const deadline = Date.now() + DOCTOR_LAUNCHCTL_TIMEOUT_MS;
	while (Date.now() < deadline) {
		const remainingMs = Math.max(1, deadline - Date.now());
		const probe = await execLaunchctl(["print", serviceTarget], Math.min(DOCTOR_LAUNCHCTL_TIMEOUT_MS, remainingMs));
		if (probe.code !== 0) return isLaunchctlNotLoaded(probe);
		const delayMs = Math.min(DOCTOR_LAUNCHCTL_CONFIRM_POLL_MS, deadline - Date.now());
		if (delayMs <= 0) break;
		await new Promise((resolve) => {
			setTimeout(resolve, delayMs);
		});
	}
	return false;
}
const GATEWAY_SERVICES_EXTRA_CHECK_ID = "core/doctor/gateway-services/extra";
function extractDetailPath(detail, prefix) {
	if (!detail.startsWith(prefix)) return null;
	const value = detail.slice(prefix.length).trim();
	return value.length > 0 ? value : null;
}
async function filterInactiveExtraGatewayServices(services) {
	if (process.platform !== "linux") return services;
	const activeOrLegacy = [];
	for (const svc of services) {
		if (svc.platform !== "linux" || svc.legacy === true) {
			activeOrLegacy.push(svc);
			continue;
		}
		const active = await isSystemdUnitActive(process.env, svc.label, svc.scope);
		if (!active.ok || active.value) activeOrLegacy.push(svc);
	}
	return activeOrLegacy;
}
async function detectExtraGatewayServiceIssues(options = {}) {
	if (!isDefaultInstallIdentity(process.env) || !await shouldManageGatewayService()) return [];
	return await filterInactiveExtraGatewayServices(await findExtraGatewayServices(process.env, { deep: options.deep }));
}
function extraGatewayServiceToHealthFinding(service) {
	return {
		checkId: GATEWAY_SERVICES_EXTRA_CHECK_ID,
		severity: service.legacy === true ? "warning" : "info",
		message: `Other gateway-like service detected: ${service.label} (${service.scope}, ${service.detail})`,
		source: service.platform,
		target: service.label,
		fixHint: service.legacy === true ? "Run `openclaw doctor` interactively to review legacy gateway services and confirm supported cleanup." : "Run a single gateway per machine unless this extra gateway is intentional."
	};
}
function extraGatewayServiceToRepairEffects(service) {
	if (service.legacy !== true) return [];
	return [{
		kind: "service",
		action: "would-remove-legacy-gateway-service",
		target: service.label,
		dryRunSafe: false
	}];
}
async function cleanupLegacyLaunchdService(params) {
	const domain = typeof process.getuid === "function" ? `gui/${process.getuid()}` : "gui/501";
	await execLaunchctl([
		"bootout",
		domain,
		params.plistPath
	], DOCTOR_LAUNCHCTL_TIMEOUT_MS);
	await execLaunchctl(["unload", params.plistPath], DOCTOR_LAUNCHCTL_TIMEOUT_MS);
	if (!await confirmLegacyLaunchdServiceUnloaded(`${domain}/${params.label}`)) return {
		status: "failed",
		reason: "launchctl could not confirm unload"
	};
	const trashDir = path.join(os.homedir(), ".Trash");
	try {
		await fs.mkdir(trashDir, { recursive: true });
	} catch {}
	try {
		await fs.access(params.plistPath);
	} catch (error) {
		if (error.code === "ENOENT") return { status: "removed" };
		return {
			status: "failed",
			reason: "could not inspect plist"
		};
	}
	const dest = path.join(trashDir, `${params.label}-${Date.now()}.plist`);
	try {
		await fs.rename(params.plistPath, dest);
		return {
			status: "removed",
			destination: dest
		};
	} catch {
		return {
			status: "failed",
			reason: "could not move plist"
		};
	}
}
function classifyLegacyServices(legacyServices) {
	const darwinUserServices = [];
	const linuxUserServices = [];
	const failed = [];
	for (const svc of legacyServices) {
		if (svc.platform === "darwin") {
			if (svc.scope === "user") darwinUserServices.push(svc);
			else failed.push(`${svc.label} (${svc.scope})`);
			continue;
		}
		if (svc.platform === "linux") {
			if (svc.scope === "user") linuxUserServices.push(svc);
			else failed.push(`${svc.label} (${svc.scope})`);
			continue;
		}
		failed.push(`${svc.label} (${svc.platform})`);
	}
	return {
		darwinUserServices,
		linuxUserServices,
		failed
	};
}
async function cleanupLegacyDarwinServices(services) {
	const removed = [];
	const failed = [];
	for (const svc of services) {
		const plistPath = extractDetailPath(svc.detail, "plist:");
		if (!plistPath) {
			failed.push(`${svc.label} (missing plist path)`);
			continue;
		}
		const result = await cleanupLegacyLaunchdService({
			label: svc.label,
			plistPath
		});
		if (result.status === "removed") removed.push(result.destination ? `${svc.label} -> ${result.destination}` : svc.label);
		else failed.push(`${svc.label} (${result.reason})`);
	}
	return {
		removed,
		failed
	};
}
async function cleanupLegacyLinuxUserServices(services, runtime) {
	const removed = [];
	const failed = [];
	try {
		const removedUnits = await uninstallLegacySystemdUnits({
			env: process.env,
			stdout: process.stdout
		});
		const removedByLabel = new Map(removedUnits.map((unit) => [`${unit.name}.service`, unit]));
		for (const svc of services) {
			const removedUnit = removedByLabel.get(svc.label);
			if (!removedUnit) {
				failed.push(`${svc.label} (legacy unit name not recognized)`);
				continue;
			}
			removed.push(`${svc.label} -> ${removedUnit.unitPath}`);
		}
	} catch (err) {
		runtime.error(`Legacy Linux gateway cleanup failed: ${String(err)}`);
		for (const svc of services) failed.push(`${svc.label} (linux cleanup failed)`);
	}
	return {
		removed,
		failed
	};
}
/**
* Audits and optionally rewrites the installed local gateway service configuration.
*
* The repair preserves managed env sources and avoids Nix/remote installs.
* Updater-driven Doctor leaves service publication with update finalization.
*/
async function maybeRepairGatewayServiceConfig(cfg, mode, runtime, prompter, options) {
	if (!isDefaultInstallIdentity(process.env)) {
		note(NON_DEFAULT_INSTALL_SERVICE_SKIP_REASON, "Gateway");
		return cfg;
	}
	if (resolveIsNixMode(process.env)) {
		note("Nix mode detected; skip service updates.", "Gateway");
		return cfg;
	}
	if (mode === "remote") {
		note("Gateway mode is remote; skipped local service audit.", "Gateway");
		return cfg;
	}
	const serviceRepairPolicy = resolveServiceRepairPolicy();
	const serviceRepairDeferred = isServiceRepairDeferred(serviceRepairPolicy);
	const service = resolveGatewayService();
	let command;
	try {
		command = await service.readCommand(process.env);
	} catch {
		command = null;
	}
	if (!command) {
		const audit = await auditGatewayServiceConfig({
			env: process.env,
			command: null,
			platform: process.platform
		});
		reportServiceDefinitionDrift(audit);
		if (audit.issues.length > 0) note(formatServiceConfigIssues(audit.issues).join("\n"), "Gateway service config");
		return cfg;
	}
	const managedDefinition = resolveManagedGatewayServiceCommand(command) ?? command;
	note(formatGatewayHeapLimitReport(inspectGatewayHeapLimit(command.environment?.NODE_OPTIONS, {}, command.programArguments)), "Gateway heap");
	const managedWrapperPath = managedDefinition.environment?.[OPENCLAW_WRAPPER_ENV_KEY]?.trim();
	const pinSnapshot = readDaemonRuntimePin({
		kind: "gateway",
		env: process.env
	}, command);
	const serviceInstallEnv = {
		...process.env,
		...managedWrapperPath && !Object.hasOwn(process.env, "OPENCLAW_WRAPPER") ? { [OPENCLAW_WRAPPER_ENV_KEY]: managedWrapperPath } : {}
	};
	const serviceWrapperPath = normalizeOptionalString(command.environment?.[OPENCLAW_WRAPPER_ENV_KEY]);
	if (serviceWrapperPath) note(`Gateway service invokes ${OPENCLAW_WRAPPER_ENV_KEY}: ${serviceWrapperPath}`, "Gateway");
	const serviceLayout = await summarizeGatewayServiceLayout(command);
	const sourceCheckoutWarning = serviceLayout?.entrypointSourceCheckout ? [`Gateway service entrypoint resolves to a source checkout: ${serviceLayout.packageRootReal ?? serviceLayout.packageRoot ?? serviceLayout.entrypointReal ?? serviceLayout.entrypoint}.`, "Run `openclaw gateway install --force` from the intended package install to replace the gateway service definition."].join("\n") : null;
	const tokenRefConfigured = Boolean(resolveSecretInputRef({
		value: cfg.gateway?.auth?.token,
		defaults: cfg.secrets?.defaults
	}).ref);
	const gatewayTokenResolution = await resolveGatewayAuthTokenForService(cfg, process.env, { allowExecSecretRefs: options.allowExecSecretRefs === true });
	if (gatewayTokenResolution.unavailableReason) note(`Unable to verify gateway service token drift: ${gatewayTokenResolution.unavailableReason}`, "Gateway service config");
	const expectedGatewayToken = tokenRefConfigured ? void 0 : gatewayTokenResolution.token;
	const port = resolveGatewayPort(cfg, process.env);
	const hasInstallWrapper = Boolean(serviceInstallEnv[OPENCLAW_WRAPPER_ENV_KEY]?.trim());
	const activeRuntimePin = hasInstallWrapper ? void 0 : pinSnapshot.pin?.path;
	const runtimeChoice = hasInstallWrapper ? "node" : resolveGatewayDaemonRuntime(activeRuntimePin ? [activeRuntimePin] : managedDefinition.programArguments);
	const installedRuntimePath = runtimeChoice === "bun" ? activeRuntimePin ?? managedDefinition.programArguments[0] : void 0;
	const expectedPlan = await buildExpectedGatewayServicePlan({
		cfg,
		command,
		serviceInstallEnv,
		port,
		runtime: runtimeChoice,
		runtimePath: installedRuntimePath,
		pinnedRuntimePath: pinSnapshot.pin?.path
	});
	const expectedLayout = await summarizeGatewayServiceLayout(expectedPlan);
	const expectedRoot = expectedLayout?.packageRootReal;
	const installationDrift = expectedRoot ? await inspectGatewayServiceInstallationDrift(serviceLayout, expectedRoot) : void 0;
	const repairPort = installationDrift && cfg.gateway?.port === void 0 && !process.env.OPENCLAW_GATEWAY_PORT?.trim() ? parseTcpPortFromArgs(command.programArguments) ?? port : port;
	const expectedManagedServiceEnvKeys = readManagedServiceEnvKeysFromEnvironment(expectedPlan.environment);
	const audit = await auditGatewayServiceConfig({
		env: process.env,
		command,
		expectedGatewayToken,
		expectedManagedServiceEnvKeys,
		expectedServicePath: expectedPlan.environment.PATH,
		expectedPort: repairPort,
		...installationDrift ? { expectedCommand: expectedPlan } : {}
	});
	reportServiceDefinitionDrift(audit);
	const definitionRepair = !installationDrift && Boolean(expectedRoot) && !expectedLayout?.entrypointSourceCheckout && hasRepairableServiceDefinitionDrift(audit);
	if (audit.runtimeNote) note(audit.runtimeNote, "Gateway runtime");
	const serviceToken = readEmbeddedGatewayToken(command);
	if (tokenRefConfigured && serviceToken) audit.issues.push({
		code: SERVICE_AUDIT_CODES.gatewayTokenMismatch,
		message: "Gateway service OPENCLAW_GATEWAY_TOKEN should be unset when gateway.auth.token is SecretRef-managed",
		detail: "service token is stale",
		level: "recommended"
	});
	const needsNodeRuntime = !hasInstallWrapper && !activeRuntimePin && needsNodeRuntimeMigration(audit.issues);
	const systemNodeInfo = needsNodeRuntime ? await resolveSystemNodeInfo({ env: process.env }) : null;
	const systemNodePath = systemNodeInfo?.status === "supported" ? systemNodeInfo.path : null;
	if (needsNodeRuntime && !systemNodePath && runtimeChoice !== "node") {
		const warning = renderSystemNodeWarning(systemNodeInfo);
		if (warning) note(warning, "Gateway runtime");
		else note(`System Node ${SUPPORTED_NODE_VERSIONS} not found. Install via Homebrew/apt/choco and rerun doctor to migrate off Bun/version managers.`, "Gateway runtime");
	}
	const expectedRuntimePlan = needsNodeRuntime && systemNodePath ? await buildExpectedGatewayServicePlan({
		cfg,
		command,
		serviceInstallEnv,
		port: repairPort,
		runtime: "node",
		runtimePath: systemNodePath
	}) : expectedPlan;
	if (installationDrift && expectedRoot) {
		note(formatGatewayServiceInstallationDrift(installationDrift, void 0, serviceInstallEnv), "Gateway service installation");
		if (!serviceRepairDeferred) try {
			await assertGatewayServiceInstallationRepairAllowed({
				service,
				command,
				activeRoot: expectedRoot,
				maintenance: options.serviceMaintenance
			});
		} catch (error) {
			note(String(error), "Gateway service installation");
			return cfg;
		}
	}
	const runtimeLayout = expectedRuntimePlan === expectedPlan ? expectedLayout : await summarizeGatewayServiceLayout(expectedRuntimePlan);
	if (runtimeLayout?.entrypointReal && serviceLayout?.entrypointReal && runtimeLayout.entrypointReal !== serviceLayout.entrypointReal) audit.issues.push({
		code: SERVICE_AUDIT_CODES.gatewayEntrypointMismatch,
		message: "Gateway service entrypoint does not match the current install.",
		detail: `${serviceLayout?.entrypoint} -> ${runtimeLayout?.entrypoint}`,
		level: "recommended"
	});
	const serviceRewriteBlock = installationDrift ? void 0 : await resolveSystemdServiceRewriteBlock(command, audit.issues);
	if (serviceRewriteBlock) note(serviceRewriteBlock, "Gateway service config");
	const hasEntrypointMismatch = audit.issues.some((issue) => issue.code === SERVICE_AUDIT_CODES.gatewayEntrypointMismatch);
	const showSourceCheckoutWarning = sourceCheckoutWarning !== null && !hasEntrypointMismatch;
	if (audit.issues.length === 0 && !definitionRepair) {
		if (sourceCheckoutWarning !== null && !hasEntrypointMismatch) note(sourceCheckoutWarning, "Gateway service config");
		return cfg;
	}
	const consolidatedLines = [];
	let emittedSourceCheckoutWarning = false;
	if (sourceCheckoutWarning !== null && showSourceCheckoutWarning) {
		consolidatedLines.push(sourceCheckoutWarning, "");
		emittedSourceCheckoutWarning = true;
	}
	consolidatedLines.push(...formatServiceConfigIssues(audit.issues));
	note(consolidatedLines.join("\n"), "Gateway service config");
	if (audit.issues.length > 0 && audit.issues.every((issue) => issue.code === SERVICE_AUDIT_CODES.gatewayRuntimeProbeFailed)) return cfg;
	const needsAggressive = audit.issues.filter((issue) => issue.level === "aggressive").length > 0 || installationDrift !== void 0 && (audit.definitionDriftError !== void 0 || audit.definitionDrift?.some((finding) => finding.kind === "unknown-edit") === true);
	if (needsAggressive && !prompter.shouldForce) note("Custom or unexpected service edits detected. Rerun with --force to overwrite.", "Gateway service config");
	if (serviceRepairDeferred) {
		note(formatServiceRepairDeferredNote(), "Gateway service config");
		return cfg;
	}
	if (definitionRepair && !options.serviceMaintenance && !await canRepairRunningGatewayDefinition({
		service,
		command,
		env: serviceInstallEnv
	})) return cfg;
	if (serviceRewriteBlock) return cfg;
	if (process.platform === "linux" && audit.issues.some((issue) => isExecStartRepairIssue(issue) && hasGatewayServiceLauncherOverride(command) || issue.code === SERVICE_AUDIT_CODES.gatewayPortMismatch && hasGatewayServiceLauncherOverride(command, { includeWorkingDirectory: false }) || isOperatorOwnedEnvironmentIssue(issue, command, expectedPlan.environmentValueSources))) {
		const unitName = resolveSystemdUnitNameFromServicePath(command.sourcePath);
		const inspectCommand = `systemctl${resolveSystemdScopeFromServicePath(command.sourcePath) === "user" ? " --user" : ""} cat ${unitName}`;
		note(`Gateway service command, working directory, or environment comes from an operator-owned systemd drop-in; rewriting the managed unit cannot repair it. Inspect with \`${inspectCommand}\`, then update or remove the drop-in and rerun doctor.`, "Gateway service config");
		return cfg;
	}
	const gatewayTokenForRepair = expectedGatewayToken ?? readEmbeddedGatewayToken(managedDefinition);
	const configuredGatewayToken = typeof cfg.gateway?.auth?.token === "string" ? normalizeOptionalString(cfg.gateway.auth.token) : void 0;
	const needsConfigWrite = !tokenRefConfigured && !configuredGatewayToken && Boolean(gatewayTokenForRepair);
	if (!await prompter.confirmRuntimeRepair({
		message: needsAggressive ? "Overwrite gateway service config with current defaults now?" : "Update gateway service config to the recommended defaults now?",
		initialValue: needsAggressive ? prompter.shouldForce : true,
		requiresInteractiveConfirmation: !(installationDrift && isServiceInstallationOnlyRepair(audit)) && !(definitionRepair && !needsConfigWrite && isServiceDefinitionOnlyRepair(audit))
	})) {
		if (!emittedSourceCheckoutWarning) note("Run `openclaw gateway install --force` when you want to replace the gateway service definition.", "Gateway service config");
		return cfg;
	}
	try {
		for (const environment of [mergeGatewayServiceEnv(serviceInstallEnv, command), expectedRuntimePlan.environment]) {
			const capability = await service.readDefinitionMutationCapability?.({
				env: serviceInstallEnv,
				environment
			}).catch(() => ({
				kind: "unknown",
				reason: "inspection-failed"
			}));
			if (capability) assertServiceDefinitionWritable(capability);
		}
	} catch (err) {
		runtime.error(`Gateway service repair blocked: ${String(err)}`);
		return cfg;
	}
	let cfgForServiceInstall = cfg;
	if (needsConfigWrite) {
		const nextCfg = {
			...cfg,
			gateway: {
				...cfg.gateway,
				auth: {
					...cfg.gateway?.auth,
					mode: cfg.gateway?.auth?.mode ?? "token",
					token: gatewayTokenForRepair
				}
			}
		};
		try {
			cfgForServiceInstall = await options.writeConfig(nextCfg);
			note(expectedGatewayToken ? "Persisted gateway.auth.token from environment before reinstalling service." : "Persisted gateway.auth.token from existing service definition before reinstalling service.", "Gateway");
		} catch (err) {
			if (err instanceof ConfigWritePostCommitError) throw err;
			runtime.error(`Failed to persist gateway.auth.token before service repair: ${String(err)}`);
			return cfg;
		}
	}
	const updatedPlan = await buildExpectedGatewayServicePlan({
		cfg: cfgForServiceInstall,
		command,
		serviceInstallEnv,
		port: repairPort,
		runtime: needsNodeRuntime && systemNodePath ? "node" : runtimeChoice,
		runtimePath: needsNodeRuntime && systemNodePath ? systemNodePath : installedRuntimePath,
		pinnedRuntimePath: pinSnapshot.pin?.path
	});
	await installDoctorGatewayService({
		service,
		command,
		maintenance: options.serviceMaintenance,
		runtime,
		repair: installationDrift && expectedRoot ? {
			kind: "installation",
			root: expectedRoot
		} : definitionRepair && expectedRoot ? {
			kind: "definition",
			root: expectedRoot
		} : { kind: "config" },
		args: {
			...updatedPlan,
			runtimePinUpdate: {
				expected: pinSnapshot,
				pin: pinSnapshot.pin
			},
			env: serviceInstallEnv,
			stdout: process.stdout,
			warn: (message) => note(message, "Gateway")
		}
	});
	return cfgForServiceInstall;
}
/**
* Reports duplicate gateway-like services and removes legacy user services after confirmation.
*/
async function maybeScanExtraGatewayServices(options, runtime, prompter) {
	if (!isDefaultInstallIdentity(process.env)) {
		note(NON_DEFAULT_INSTALL_SERVICE_SKIP_REASON, "Gateway");
		return;
	}
	const extraServices = await detectExtraGatewayServiceIssues(options);
	if (extraServices.length === 0) return;
	note(extraServices.map((svc) => `- ${svc.label} (${svc.scope}, ${svc.detail})`).join("\n"), "Other gateway-like services detected");
	const legacyServices = extraServices.filter((svc) => svc.legacy === true);
	if (legacyServices.length > 0) {
		const serviceRepairPolicy = resolveServiceRepairPolicy();
		const serviceRepairDeferred = isServiceRepairDeferred(serviceRepairPolicy);
		if (serviceRepairDeferred) note(formatServiceRepairDeferredNote(), "Legacy gateway cleanup skipped");
		if (serviceRepairDeferred ? false : await confirmDoctorServiceRepair(prompter, {
			message: "Remove legacy gateway services now?",
			initialValue: true
		}, serviceRepairPolicy)) {
			const removed = [];
			const { darwinUserServices, linuxUserServices, failed } = classifyLegacyServices(legacyServices);
			if (darwinUserServices.length > 0) {
				const result = await cleanupLegacyDarwinServices(darwinUserServices);
				removed.push(...result.removed);
				failed.push(...result.failed);
			}
			if (linuxUserServices.length > 0) {
				const result = await cleanupLegacyLinuxUserServices(linuxUserServices, runtime);
				removed.push(...result.removed);
				failed.push(...result.failed);
			}
			if (removed.length > 0) note(removed.map((line) => `- ${line}`).join("\n"), "Legacy gateway removed");
			if (failed.length > 0) note(failed.map((line) => `- ${line}`).join("\n"), "Legacy gateway cleanup skipped");
		}
	}
	const cleanupHints = renderGatewayServiceCleanupHints(extraServices.filter((service) => service.legacy !== true));
	if (cleanupHints.length > 0) note(cleanupHints.map((hint) => `- ${hint}`).join("\n"), process.platform === "linux" ? "Inspection hints" : "Cleanup hints");
	note([
		"Recommendation: run a single gateway per machine for most setups.",
		"One gateway supports multiple agents.",
		"If you need multiple gateways (e.g., a rescue bot on the same host), isolate ports + config/state (see docs: /gateway#multiple-gateways-same-host)."
	].join("\n"), "Gateway recommendation");
}
/**
* Resolves a `dueling` systemd install (both a user-scope and a system-scope
* gateway unit present) by removing the redundant user-scope unit after
* confirmation, keeping the root-installed system-scope unit as authoritative.
*
* This is the fix for issue #79375: on Linux the two units bind the same port
* and SIGTERM each other in an endless restart loop. The canonical units are
* deliberately excluded from `findExtraGatewayServices`, so this detects the
* condition directly via `findSystemdGatewayInstallation`. Removing a unit
* under `$HOME` needs no root; the system-scope unit is never auto-removed
* (only a `sudo`-flavored hint is offered for that direction).
*/
async function maybeResolveDuelingSystemdGatewayScopes(runtime, prompter) {
	if (process.platform !== "linux") return;
	const installation = await findSystemdGatewayInstallation(process.env).catch(() => null);
	if (installation?.kind !== "dueling") return;
	const { user, system } = installation;
	note([
		"Both a user-scope and a system-scope OpenClaw gateway unit are installed:",
		`- user:   ${user.unitPath}`,
		`- system: ${system.unitPath}`,
		"They bind the same port and will SIGTERM each other in a restart loop."
	].join("\n"), "Dueling gateway services detected");
	if (!await isSystemUnitActiveAndEnabled(process.env, system.unitName).catch(() => false)) {
		note([
			"Could not verify the system-scope unit is both running and enabled at boot, so the",
			"user-scope unit may be your working gateway. Not removing anything",
			"automatically.",
			"If the system-scope unit is the one you want, activate it and re-run doctor:",
			`- sudo systemctl enable --now ${system.unitName}`,
			"If the user-scope unit is the one you want, remove the system unit:",
			`- sudo systemctl disable --now ${system.unitName} && sudo rm ${system.unitPath}`
		].join("\n"), "Gateway cleanup needs an owner decision");
		return;
	}
	note(["The system-scope unit is the active and boot-enabled supervisor and is", "treated as authoritative; the user-scope unit is the redundant leftover."].join("\n"), "System-scope unit owns the gateway");
	const policy = resolveServiceRepairPolicy();
	if (isServiceRepairDeferred(policy)) {
		note(formatServiceRepairDeferredNote(), "Gateway cleanup skipped");
		return;
	}
	if (!await confirmDoctorServiceRepair(prompter, {
		message: "Remove the redundant user-scope gateway unit and keep the system-scope unit?",
		initialValue: true
	}, policy)) {
		const hints = renderGatewayServiceCleanupHints();
		if (hints.length > 0) note(hints.map((hint) => `- ${hint}`).join("\n"), "Cleanup hints");
		return;
	}
	try {
		const result = await uninstallUserSystemdGatewayUnit({
			env: process.env,
			stdout: process.stdout
		});
		note(result.removed ? `Removed user-scope unit ${result.unitPath}.` : `User-scope unit already absent at ${result.unitPath}.`, "Redundant user gateway removed");
		runtime.log(result.disabled ? "Removed the redundant user-scope gateway unit. The system-scope unit is now the sole gateway manager." : `Removed the user-scope unit file, but systemctl was unavailable to stop it. Run: systemctl --user disable --now ${result.unitName} && systemctl --user daemon-reload`);
	} catch (err) {
		runtime.error(`Failed to remove redundant user-scope gateway unit: ${String(err)}`);
		const hints = renderGatewayServiceCleanupHints();
		if (hints.length > 0) note(hints.map((hint) => `- ${hint}`).join("\n"), "Cleanup hints");
	}
}
//#endregion
export { detectExtraGatewayServiceIssues, extraGatewayServiceToHealthFinding, extraGatewayServiceToRepairEffects, maybeRepairGatewayServiceConfig, maybeResolveDuelingSystemdGatewayScopes, maybeScanExtraGatewayServices };
