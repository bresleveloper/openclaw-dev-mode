import { f as resolveGatewayProfileSuffix, l as normalizeWindowsTaskIdentity } from "./constants-BLghGsId.mjs";
import { t as stableStringify } from "./stable-stringify-Djn3uxNo.mjs";
import { r as isPathInside, t as hasNodeErrorCode } from "./path-guards-CH7noY0Z.mjs";
import { t as formatCliCommand } from "./command-format-DwEdrDKL.mjs";
import { s as throwSqliteLifecycleErrors } from "./sqlite-lifecycle-errors-DuOygjcn.mjs";
import { n as createOpenClawDatabaseMaintenanceScope } from "./openclaw-state-db-async-lifecycle-DLKxSPCk.mjs";
import { c as resolveOpenClawStateSqlitePath } from "./openclaw-state-db.paths-DfifnSGp.mjs";
import { n as acquireGatewayStateOwner } from "./gateway-state-owner-DmHycK5o.mjs";
import { r as hasCommandProcessCleanupError } from "./exec-result-s7WOth0N.mjs";
import { r as ServiceInspectionError } from "./service-inspection-error-Bsltcpi4.mjs";
import { r as isGatewayServiceStateLive } from "./service-runtime-Cbp6mAbj.mjs";
import { n as resolveLaunchAgentLabel } from "./launchd-label-CDVrpZuO.mjs";
import { n as updateInstallRootsMatch } from "./update-install-root-DH-onosx.mjs";
import { o as readActiveGatewayLockIdentity } from "./gateway-lock-B6mKYs2x.mjs";
import { n as UpdatePreMutationError } from "./shared-D-l8dmoD.mjs";
import { u as resolveTaskName } from "./schtasks-layout-BWyDzx-H.mjs";
import { _ as readWindowsStartupFallbackRuntimeForUpdate, f as isScheduledTaskDefinitelyNotRunning } from "./schtasks-B_YCch7R.mjs";
import { c as summarizeGatewayServiceLayout, n as gatewayServiceCommandOverlapsPhysicalInstallation } from "./service-layout-BNLNn9Ng.mjs";
import { n as probePortUsage } from "./ports-probe-DMGtt9dg.mjs";
import { t as mergeGatewayServiceEnv } from "./service-env-merge-BU8q8IlG.mjs";
import { c as resolveSystemdServiceName } from "./systemd-service-files-D_ieSNFm.mjs";
import { t as withGatewayServiceOperationLock } from "./service-operation-lock-CDhrUo4O.mjs";
import { i as readGatewayServiceState, n as resolveGatewayService } from "./service-Cw6bpVrf.mjs";
import { l as resolveSystemdTemplateInstanceName } from "./systemd-scope-DSaa1Sqr.mjs";
import { c as observedSystemdManagerUid, i as assertGatewayServiceManagementAllowedForUpdate, n as GatewayServiceUpdateOwnershipError, o as inspectManagedGatewayServiceBeforeUpdate, p as resolveUpdatedGatewayRestartPort } from "./update-command-service-plan-VzuhDrTH.mjs";
import { r as listManagedOpenClawGatewayServices } from "./inspect-CwFFxdv6.mjs";
import path from "node:path";
import fs from "node:fs/promises";
import { isDeepStrictEqual } from "node:util";
//#region src/daemon/managed-gateway-bindings.ts
/** Bind discovered native service selectors without granting lifecycle authority. */
/** Inspect the exact discovered owner; Startup definitions must never borrow Task state. */
async function readManagedGatewayBindingState(binding, options = {}) {
	if (process.platform === "darwin") {
		const { readLoadedLaunchAgentState } = await import("./launchd-runtime-CQC1Zgzi.mjs");
		return readLoadedLaunchAgentState(binding.env, {
			...options,
			plistPath: binding.launchAgentPlistPath
		});
	}
	const { readGatewayServiceState, resolveGatewayService } = await import("./service-CEHmkj0v.mjs");
	let timeoutMs = options.timeoutMs;
	if (binding.windowsStartupEntry) {
		const { WINDOWS_POWERSHELL_COLD_SPAWN_TIMEOUT_MS } = await import("./windows-powershell-spawn-BsupaPNX.mjs");
		timeoutMs = Math.min(timeoutMs ?? WINDOWS_POWERSHELL_COLD_SPAWN_TIMEOUT_MS, WINDOWS_POWERSHELL_COLD_SPAWN_TIMEOUT_MS);
	}
	return readGatewayServiceState(resolveGatewayService(), {
		env: binding.env,
		requireEffective: true,
		requireLoadedCommand: true,
		...binding.systemdReadTarget ? { systemdReadTarget: binding.systemdReadTarget } : {},
		...binding.windowsStartupEntry ? { windowsStartupEntry: binding.windowsStartupEntry } : {},
		...timeoutMs === void 0 ? {} : { timeoutMs }
	});
}
function bindingSelectorKey(binding) {
	return [
		resolveGatewayProfileSuffix(binding.env.OPENCLAW_PROFILE),
		binding.scope ?? binding.systemdReadTarget?.scope ?? "",
		binding.systemdReadTarget?.unitPath ?? "",
		binding.launchAgentPlistPath ?? "",
		binding.windowsStartupEntry ? path.win32.normalize(binding.windowsStartupEntry).toLowerCase() : "",
		binding.env.OPENCLAW_SYSTEMD_UNIT ?? "",
		binding.env.OPENCLAW_LAUNCHD_LABEL ?? "",
		binding.env.OPENCLAW_WINDOWS_TASK_NAME ?? ""
	].join("\0");
}
function hostBindingEnv(env, extras) {
	const host = {
		...env.HOME !== void 0 ? { HOME: env.HOME } : {},
		...env.USERPROFILE !== void 0 ? { USERPROFILE: env.USERPROFILE } : {}
	};
	for (const key of [
		"DBUS_SESSION_BUS_ADDRESS",
		"XDG_RUNTIME_DIR",
		"USER",
		"LOGNAME",
		"SUDO_USER"
	]) if (Object.hasOwn(env, key)) host[key] = env[key];
	return {
		...host,
		...extras
	};
}
function profileEnvFields(profile) {
	return profile === "default" ? {} : { OPENCLAW_PROFILE: profile };
}
/**
* Enumerate installed managed Gateway selectors for runtime mutation checks.
*/
async function discoverManagedGatewayBindings(env, options = {}) {
	const results = [];
	const seen = /* @__PURE__ */ new Set();
	const push = (binding) => {
		const key = bindingSelectorKey(binding);
		if (seen.has(key)) return;
		seen.add(key);
		results.push(binding);
	};
	if (options.includeInvoking) push({ env });
	try {
		const { services, errors } = await listManagedOpenClawGatewayServices(env, { requireComplete: true });
		if (options.requireComplete && errors.length > 0) throw new Error("Managed Gateway inventory could not be completely inspected.");
		for (const svc of services) {
			if (svc.platform === "linux") {
				const unitName = resolveSystemdTemplateInstanceName(svc.label, { OPENCLAW_SYSTEMD_UNIT: svc.label });
				push({
					scope: svc.scope,
					...svc.sourcePath ? { systemdReadTarget: {
						scope: svc.scope,
						unitName,
						unitPath: svc.sourcePath
					} } : {},
					env: hostBindingEnv(env, { OPENCLAW_SYSTEMD_UNIT: unitName })
				});
				continue;
			}
			if (svc.platform === "darwin") {
				push({
					scope: svc.scope,
					...svc.sourcePath ? { launchAgentPlistPath: svc.sourcePath } : {},
					env: hostBindingEnv(env, { OPENCLAW_LAUNCHD_LABEL: svc.label })
				});
				continue;
			}
			if (svc.windowsProfile === void 0) continue;
			if (svc.windowsStartupEntry !== void 0) {
				push({
					scope: "user",
					windowsStartupEntry: svc.windowsStartupEntry,
					env: hostBindingEnv(env, profileEnvFields(svc.windowsProfile))
				});
				continue;
			}
			push({
				scope: "system",
				env: hostBindingEnv(env, {
					...profileEnvFields(svc.windowsProfile),
					OPENCLAW_WINDOWS_TASK_NAME: svc.label.replace(/^\\+/, "").trim() || svc.label
				})
			});
		}
	} catch (error) {
		if (options.requireComplete || hasCommandProcessCleanupError(error)) throw error;
	}
	return results;
}
/** Name an observed owner; these diagnostics confer no control authority. */
function describeManagedGatewayBinding(binding, state) {
	if (state.launchAgent) return `launchd job ${JSON.stringify(state.launchAgent.target)} loaded from ${JSON.stringify(state.launchAgent.sourcePath)}`;
	if (binding.windowsStartupEntry) return `Startup entry ${JSON.stringify(binding.windowsStartupEntry)}`;
	if (process.platform === "win32") return `Scheduled Task ${JSON.stringify(resolveTaskName(binding.env))}`;
	const target = binding.systemdReadTarget;
	const unit = state.runtime?.systemd?.unit ?? target?.unitName ?? `${resolveSystemdServiceName(binding.env)}.service`;
	return `systemd ${state.runtime?.systemd?.scope ?? target?.scope ?? "user"} unit ${JSON.stringify(unit)}`;
}
//#endregion
//#region src/cli/update-cli/update-command-service-revalidation.ts
function matchesStoppedService(before, state, inspection, allowIncompleteInspection = false) {
	const verdict = before.serviceUpdateVerdict;
	const refreshDefinition = verdict?.kind === "owned" && verdict.refreshDefinition;
	const resolveName = process.platform === "darwin" ? resolveLaunchAgentLabel : process.platform === "win32" ? (env) => normalizeWindowsTaskIdentity(resolveTaskName(env)) : resolveSystemdServiceName;
	return Boolean(before.serviceEnv && state.command && verdict && "fingerprint" in verdict && resolveGatewayProfileSuffix(before.serviceEnv.OPENCLAW_PROFILE) === resolveGatewayProfileSuffix(state.env.OPENCLAW_PROFILE) && resolveName(before.serviceEnv) === resolveName(state.env) && (process.platform !== "linux" || before.serviceManagerUid === void 0 || allowIncompleteInspection && observedSystemdManagerUid(state) === void 0 || before.serviceManagerUid === observedSystemdManagerUid(state)) && (refreshDefinition || "fingerprint" in inspection && inspection.fingerprint === verdict.fingerprint));
}
/** Observe other consumers; discovery never grants permission to stop them. */
async function assertManagedGatewayArtifactPublication(params) {
	params.assertCurrent();
	const serving = params.selected;
	const servingVerdict = serving?.serviceUpdateVerdict;
	if ((params.phase !== "before-stop" || !params.shouldRestart) && params.updateInstallKind === "git" && serving?.running && !serving.stopped && servingVerdict?.kind === "owned" && params.roots.some((root) => updateInstallRootsMatch(root, servingVerdict.root))) throw new UpdatePreMutationError("runtime-artifact-publication", `Cannot replace Git runtime artifacts in ${servingVerdict.root}: its Gateway${serving.servicePid === void 0 ? "" : ` (PID ${serving.servicePid})`} is still running and this update did not stop it. Stop that Gateway through its service manager, then rerun \`${formatCliCommand("openclaw update", serving.serviceEnv)}\` without \`--no-restart\`. The serving runtime was left unchanged.`);
	const bindings = await discoverManagedGatewayBindings(params.env);
	params.assertCurrent();
	const readBinding = async (binding) => {
		const state = await readManagedGatewayBindingState(binding, { timeoutMs: params.timeoutMs }).catch((error) => {
			if (hasCommandProcessCleanupError(error)) throw error;
		});
		params.assertCurrent();
		return state;
	};
	const before = params.phase === "before-stop" || params.updateInstallKind !== "git" && !params.shouldRestart ? serving : void 0;
	const retained = before?.serviceUpdateVerdict;
	let selectedState;
	const selectedConsumer = async (binding, state) => {
		if (!before?.serviceEnv || retained?.kind !== "owned") return false;
		let observed = state;
		if (process.platform === "linux") observed = {
			...state,
			env: mergeGatewayServiceEnv({
				...state.env,
				OPENCLAW_PROFILE: before.serviceEnv.OPENCLAW_PROFILE
			}, state.command)
		};
		if (process.platform === "darwin") {
			if (!state.launchAgent || before.servicePid !== void 0 && before.servicePid !== state.runtime?.pid) return false;
			const { readCorrespondingLaunchAgentCommand } = await import("./launchd-runtime-CQC1Zgzi.mjs");
			const command = await readCorrespondingLaunchAgentCommand(before.serviceEnv, state.launchAgent, params.timeoutMs);
			params.assertCurrent();
			if (!command) return false;
			observed = {
				...state,
				command,
				env: mergeGatewayServiceEnv(before.serviceEnv, command)
			};
		}
		const startupEntry = binding.windowsStartupEntry;
		if (startupEntry !== void 0) {
			selectedState ??= await readBinding({ env: before.serviceEnv });
			const normalize = (value) => path.win32.normalize(value).toLowerCase();
			if (!selectedState?.command?.startupEntryPaths?.some((entry) => normalize(entry) === normalize(startupEntry)) || !state.command?.sourcePath || !selectedState.command.sourcePath || normalize(state.command.sourcePath) !== normalize(selectedState.command.sourcePath)) return false;
			const effectiveCommand = (command) => {
				const { sourcePath: _sourcePath, definitionPaths: _definitionPaths, startupEntryPaths: _startupEntryPaths, ...effective } = command;
				return effective;
			};
			if (!isDeepStrictEqual(effectiveCommand(state.command), effectiveCommand(selectedState.command))) return false;
			observed = selectedState;
		}
		const inspection = await inspectManagedGatewayServiceBeforeUpdate({
			state: observed,
			root: retained.root,
			retainedCommand: true
		});
		params.assertCurrent();
		return matchesStoppedService({
			...before,
			serviceUpdateVerdict: {
				...retained,
				refreshDefinition: false
			}
		}, observed, inspection);
	};
	for (const binding of bindings) {
		const state = await readBinding(binding);
		if (!state || !isGatewayServiceStateLive(state)) continue;
		for (const root of params.roots) {
			const overlaps = await (params.inspectOverlap ?? gatewayServiceCommandOverlapsPhysicalInstallation)(root, state.command);
			params.assertCurrent();
			if (overlaps !== true || await selectedConsumer(binding, state)) continue;
			const owner = describeManagedGatewayBinding(binding, state);
			throw new UpdatePreMutationError("runtime-artifact-publication", `Cannot replace ${root}: another managed Gateway (${owner}) is still using this installation. Stop that Gateway through its own service manager or Startup process, then retry the update. Its files and service were left unchanged.`);
		}
	}
	params.assertCurrent();
}
async function revalidateManagedGatewayServiceAfterUpdate(params) {
	const before = params.preManagedServiceStop;
	const verdict = before?.serviceUpdateVerdict;
	assertGatewayServiceManagementAllowedForUpdate(params.state.env);
	const managerUid = observedSystemdManagerUid(params.state);
	if (params.allowIncompleteInspection && before?.serviceManagerUid !== void 0 && managerUid !== void 0 && managerUid !== before.serviceManagerUid) throw new GatewayServiceUpdateOwnershipError("Gateway service ownership or manager identity changed; inspect it before restarting manually.", void 0, void 0, "service-ownership-changed");
	const inspection = await inspectManagedGatewayServiceBeforeUpdate({
		...params,
		retainedCommand: verdict?.kind === "owned" || verdict?.kind === "unresolved",
		allowInstallRootChange: params.allowInstallRootChange && !verdict
	});
	if ((params.allowInstallRootChange || verdict?.kind === "owned" && verdict.requiresInstallRootRefresh) && before && verdict?.kind === "owned" && verdict.refreshDefinition && (inspection.kind === "foreign" || inspection.kind === "unresolved") && (params.state.definitionMutationCapability?.kind ?? "writable") === "writable") {
		const retained = await inspectManagedGatewayServiceBeforeUpdate({
			state: params.state,
			root: verdict.root,
			retainedCommand: true,
			allowIncompleteInspection: params.allowIncompleteInspection
		});
		if (matchesStoppedService({
			...before,
			serviceUpdateVerdict: {
				...verdict,
				refreshDefinition: false
			}
		}, params.state, retained, params.allowIncompleteInspection)) return {
			...verdict,
			requiresInstallRootRefresh: true
		};
	}
	if (before && verdict && (verdict.kind === "owned" || verdict.kind === "unresolved") && !(params.allowIncompleteInspection && inspection.kind === "unavailable") && (inspection.kind !== verdict.kind || !matchesStoppedService(before, params.state, inspection, params.allowIncompleteInspection))) throw new GatewayServiceUpdateOwnershipError(inspection.kind === "unavailable" ? params.state.runtime?.inspectionFailure?.timeoutMs !== void 0 ? inspection.message : "Gateway service ownership could not be verified because inspection is unavailable. Run `openclaw gateway status --deep` and retry." : "Gateway service ownership or manager identity changed; inspect it before restarting manually.", void 0, inspection.kind === "unavailable" ? inspection.inspectionReason : void 0, inspection.kind === "unavailable" ? void 0 : "service-ownership-changed");
	return inspection.kind === "owned" && verdict?.kind === "owned" && !verdict.refreshDefinition ? {
		...inspection,
		refreshDefinition: false
	} : inspection;
}
//#endregion
//#region src/cli/update-cli/update-command-service-publication.ts
async function isManagedGatewayServiceOffline(state) {
	return state.runtime?.status === "stopped" && (process.platform === "darwin" ? state.loadState.status === "not-loaded" : process.platform === "win32" ? isScheduledTaskDefinitelyNotRunning(resolveTaskName(state.env)) || (await readWindowsStartupFallbackRuntimeForUpdate(state.env).catch(() => null))?.status === "stopped" : process.platform === "linux");
}
/** Changed runtime artifacts require an offline physical target, not logical
* ownership of a deployment's current/releases namespace. No service is stopped here. */
async function withGatewayRuntimeArtifactPublication(params, publish) {
	const assertCaller = params.assertCurrent;
	assertCaller();
	return await withGatewayServiceOperationLock(params.env, async (assertNative) => {
		let processOwner;
		let maintenance;
		const assertCurrent = () => {
			assertCaller();
			assertNative();
			processOwner?.assertCurrent();
		};
		const refuse = (cause) => {
			const inspectionDetail = cause instanceof ServiceInspectionError && cause.reason === "windows-task-inspection-failed" ? `${cause.message} ` : "";
			throw new UpdatePreMutationError("runtime-artifact-publication", `${inspectionDetail}Runtime artifacts changed, but the affected Gateway is running or its offline state could not be verified. Run \`${formatCliCommand("openclaw gateway status --deep", params.env)}\`, stop the affected Gateway with \`${formatCliCommand("openclaw gateway stop", params.env)}\`, and retry the original command.`, { cause });
		};
		const inspectionFailed = (error) => {
			assertCurrent();
			if (error instanceof UpdatePreMutationError) throw error;
			return refuse(error);
		};
		const service = resolveGatewayService();
		const identity = async (file) => {
			const real = await fs.realpath(file);
			assertCurrent();
			const stat = await fs.stat(file);
			assertCurrent();
			return {
				real,
				stat
			};
		};
		const outputIdentity = async (file) => {
			try {
				return await identity(file);
			} catch (error) {
				assertCurrent();
				if (!hasNodeErrorCode(error, "ENOENT")) throw error;
				const present = await fs.lstat(file).catch((statError) => {
					if (!hasNodeErrorCode(statError, "ENOENT")) throw statError;
				});
				assertCurrent();
				if (present) throw error;
				const parent = await outputIdentity(path.dirname(file));
				assertCurrent();
				return { real: path.join(parent.real, path.basename(file)) };
			}
		};
		const same = (a, b) => a.real === b.real || Boolean(a.stat && b.stat && a.stat.dev === b.stat.dev && a.stat.ino === b.stat.ino);
		const outputPaths = params.outputPaths ?? ["dist-runtime", path.join("dist", "extensions", "node_modules", "openclaw")];
		const parentPaths = /* @__PURE__ */ new Set([""]);
		for (const output of outputPaths) for (let parent = path.dirname(output); parent !== "."; parent = path.dirname(parent)) if (!outputPaths.some((replaced) => isPathInside(replaced, parent))) parentPaths.add(parent);
		const readInspection = async () => {
			assertCurrent();
			const parents = await Promise.all([...parentPaths].map((relative) => relative ? outputIdentity(path.join(params.root, relative)) : identity(params.root)));
			assertCurrent();
			if (parents.some((parent) => parent.stat && !parent.stat.isDirectory())) refuse();
			const target = parents[0];
			const destinations = await Promise.all(outputPaths.map((output) => outputIdentity(path.join(params.root, output))));
			assertCurrent();
			const state = await readGatewayServiceState(service, {
				env: params.env,
				requireEffective: true,
				requireLoadedCommand: true,
				timeoutMs: params.timeoutMs
			});
			assertCurrent();
			const database = await outputIdentity(resolveOpenClawStateSqlitePath(state.env));
			assertCurrent();
			const serviceName = process.platform === "darwin" ? resolveLaunchAgentLabel(state.env) : process.platform === "win32" ? resolveTaskName(state.env) : resolveSystemdServiceName(state.env);
			const nativeIdentity = stableStringify({
				command: state.command,
				serviceName,
				profile: resolveGatewayProfileSuffix(state.env.OPENCLAW_PROFILE),
				managerUid: observedSystemdManagerUid(state)
			});
			const inspectServing = async (command) => {
				const layout = await summarizeGatewayServiceLayout(command);
				assertCurrent();
				if (!layout?.packageRootReal || !layout.entrypointReal) return;
				const [installed, entrypoint] = await Promise.all([identity(layout.packageRootReal), outputIdentity(layout.entrypointReal)]);
				assertCurrent();
				const servingOutputs = await Promise.all(outputPaths.map((output) => outputIdentity(path.join(installed.real, output))));
				assertCurrent();
				const disjoint = !same(target, installed) && !destinations.some((destination) => same(destination, installed) || isPathInside(destination.real, entrypoint.real) || servingOutputs.some((output) => same(destination, output) || isPathInside(destination.real, output.real) || isPathInside(output.real, destination.real)));
				return {
					serving: {
						root: installed,
						entrypoint
					},
					disjoint
				};
			};
			const inspected = await inspectServing(state.command);
			const serving = inspected?.serving;
			const disjoint = inspected?.disjoint ?? false;
			if (!inspected && (state.command || state.installed || state.loadState.status !== "not-loaded" || !state.runtime?.missingUnit)) refuse();
			const absent = !state.command && !state.installed && state.loadState.status === "not-loaded" && state.runtime?.missingUnit === true;
			if (!disjoint && (state.running || !absent && (state.loadState.status === "unknown" || process.platform === "linux" && observedSystemdManagerUid(state) === void 0 || !await isManagedGatewayServiceOffline(state)))) refuse();
			assertCurrent();
			if (!disjoint) {
				const activeLock = await readActiveGatewayLockIdentity({
					env: state.env,
					requireInspection: true
				});
				assertCurrent();
				if (activeLock) refuse();
				const port = await resolveUpdatedGatewayRestartPort({
					serviceEnv: state.env,
					serviceCommand: state.command
				});
				assertCurrent();
				const usage = await probePortUsage(port);
				assertCurrent();
				if (usage !== "free") refuse();
			}
			await assertManagedGatewayArtifactPublication({
				roots: [params.root],
				env: params.env,
				timeoutMs: params.timeoutMs,
				assertCurrent,
				updateInstallKind: "git",
				shouldRestart: false,
				inspectOverlap: async (_root, command) => {
					const consumer = await inspectServing(command);
					return consumer ? !consumer.disjoint : null;
				}
			});
			return {
				state,
				disjoint,
				parents,
				destinations,
				database,
				nativeIdentity,
				serving
			};
		};
		const inspect = () => readInspection().catch(inspectionFailed);
		const before = await inspect();
		assertCurrent();
		if (before.serving && !before.serving.entrypoint.stat) refuse();
		const assertPublicationCurrent = async () => {
			const current = await inspect();
			assertCurrent();
			const changedIdentity = (previous, next) => previous.real !== next.real || Boolean(previous.stat && (!next.stat || previous.stat.dev !== next.stat.dev || previous.stat.ino !== next.stat.ino));
			if (before.disjoint !== current.disjoint || before.database.real !== current.database.real || before.nativeIdentity !== current.nativeIdentity || before.parents.some((parent, index) => changedIdentity(parent, current.parents[index])) || before.destinations.some((destination, index) => destination.real !== current.destinations[index].real) || before.serving && (!current.serving || changedIdentity(before.serving.root, current.serving.root) || before.serving.entrypoint.real !== current.serving.entrypoint.real || !before.destinations.some((destination) => isPathInside(destination.real, current.serving.entrypoint.real)) && changedIdentity(before.serving.entrypoint, current.serving.entrypoint))) refuse();
			assertCurrent();
		};
		const publicationFailures = [];
		let publicationResult;
		try {
			try {
				assertCurrent();
				if (!before.disjoint) {
					const owner = acquireGatewayStateOwner({ databasePath: before.database.real });
					processOwner = owner;
					maintenance = createOpenClawDatabaseMaintenanceScope({
						schemaMaintenance: true,
						assertOwnerCurrent: () => {
							assertNative();
							owner.assertCurrent();
						},
						assertDatabaseAccess: owner.assertDatabaseAccess
					});
				}
			} catch (error) {
				inspectionFailed(error);
			}
			const publishOwned = async () => {
				try {
					await assertPublicationCurrent();
					assertCurrent();
				} catch (error) {
					inspectionFailed(error);
				}
				const result = await publish(assertPublicationCurrent);
				assertCurrent();
				return result;
			};
			publicationResult = await (maintenance ? maintenance.run(publishOwned) : publishOwned());
		} catch (error) {
			publicationFailures.push(error);
		}
		try {
			await maintenance?.close();
		} catch (error) {
			if (!publicationFailures.includes(error)) publicationFailures.push(error);
		}
		try {
			processOwner?.release();
		} catch (error) {
			if (!publicationFailures.includes(error)) publicationFailures.push(error);
		}
		throwSqliteLifecycleErrors(publicationFailures, "Runtime publication and maintenance cleanup failed.");
		return publicationResult;
	});
}
//#endregion
export { revalidateManagedGatewayServiceAfterUpdate as i, withGatewayRuntimeArtifactPublication as n, assertManagedGatewayArtifactPublication as r, isManagedGatewayServiceOffline as t };
