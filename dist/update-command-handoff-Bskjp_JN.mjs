import { w as parseStrictPositiveInteger } from "./number-coercion-CLj0HTDM.mjs";
import { c as isGatewayServiceEnv } from "./constants-CJCmIHb-.mjs";
import { r as isPidAlive } from "./pid-alive-CXdZEzr_.mjs";
import { c as normalizeUpdateChannel } from "./update-channels-BDINqyML.mjs";
import { t as createManagedHandoffLeaseStore } from "./update-managed-service-handoff-lease-B6JBgh1M.mjs";
import { r as getSelfAndAncestorPidsSync } from "./restart-stale-pids-DjtzhbID.mjs";
import { s as resolveSystemdServiceName } from "./systemd-service-files-tGuARbbA.mjs";
import { i as resolveGatewayInstallEntrypoint } from "./gateway-entrypoint-Cko-Hb6h.mjs";
import { a as resolveManagedGatewayServiceCommand } from "./service-types-d44oynyj.mjs";
import { i as detectRespawnSupervisor } from "./supervisor-markers-DL2AtFkv.mjs";
import { D as resolveUpdateInstallRoot } from "./restart-sentinel-KM6PPxhT.mjs";
import { l as writeControlPlaneUpdateRestartSentinel, s as readControlPlaneUpdateSentinelMeta, t as CONTROL_PLANE_UPDATE_HANDOFF_STARTED_REASON } from "./update-control-plane-sentinel-BWZUhXdG.mjs";
import { h as recordUpdateRunStep } from "./update-run-ledger-DE3m4CLB.mjs";
import { t as resolveGatewayRestartDeferralTimeoutMs } from "./restart-budget-4VeKpJhh.mjs";
import { i as resolveInstallationTarget } from "./installation-target-context-CrBRhZSM.mjs";
import { t as formatInstallationTargetCommand } from "./installation-target-format-B8ZeqO2M.mjs";
import { n as resolveOwnedManagedUpdateEnv } from "./update-command-service-env-a79RyIGw.mjs";
import { c as isCurrentForegroundUpdateHandoffProcess, d as parkForegroundUpdateHandoff, m as transferManagedServiceUpdateHandoff, p as startManagedServiceUpdateHandoff, r as cancelManagedServiceUpdateHandoff } from "./update-managed-service-handoff-BdMa8sfK.mjs";
import { t as resolveNodeRunner } from "./node-runner-Cua6MUxg.mjs";
import { i as releaseUpdateCommandPreflightForHandoff } from "./update-command-executor-BQrAUjan.mjs";
import { n as UpdatePreMutationError } from "./shared-OuJSSGTT.mjs";
import { n as printResult } from "./progress-Duz1sEcD.mjs";
//#region src/cli/update-cli/update-command-handoff.ts
function parsePositivePid(value) {
	if (typeof value === "number") return Number.isFinite(value) && value > 0 ? Math.floor(value) : null;
	const trimmed = typeof value === "string" ? value.trim() : "";
	return /^\d+$/u.test(trimmed) ? parseStrictPositiveInteger(trimmed) ?? null : null;
}
/** EX_TEMPFAIL: ownership transferred successfully, but the update is not terminal yet. */
const UPDATE_HANDOFF_IN_PROGRESS_EXIT_CODE = 75;
const GATEWAY_ANCESTRY_SHELL_GUIDANCE = "Run this command from a shell outside the gateway service.";
function gatewayAncestryBlockMessage(pid) {
	const gatewayPid = parsePositivePid(pid);
	if (gatewayPid === null) return;
	if (!(isGatewayServiceEnv(process.env) && parsePositivePid(process.env["OPENCLAW_GATEWAY_SERVICE_PID"]) === gatewayPid) && !getSelfAndAncestorPidsSync().has(gatewayPid)) return;
	return `This command is running inside the gateway process tree (gateway PID ${gatewayPid}).
Stopping or restarting the gateway from here would kill this command, so it cannot safely manage the gateway that owns it.
${GATEWAY_ANCESTRY_SHELL_GUIDANCE}`;
}
const ANCESTRY_BLOCK_MARKER = "inside the gateway process tree";
const UPDATE_CHAT_HANDOFF_GUIDANCE = "From chat, the OpenClaw owner can start the update with the gateway update action or /update, which hands it to a managed helper.";
function appendUpdateChatHandoffGuidance(blockMessage) {
	return blockMessage.includes(UPDATE_CHAT_HANDOFF_GUIDANCE) ? blockMessage : `${blockMessage}\n${UPDATE_CHAT_HANDOFF_GUIDANCE}`;
}
/** Update-specific follow-up for an ancestry block: the chat path hands off to the managed helper. */
function formatUpdateAncestryBlockMessage(blockMessage) {
	if (!blockMessage.includes(ANCESTRY_BLOCK_MARKER)) return blockMessage;
	return appendUpdateChatHandoffGuidance(blockMessage.split("\n").filter((line) => line !== GATEWAY_ANCESTRY_SHELL_GUIDANCE).join("\n"));
}
function gatewayMaintenanceBlockMessage(state, root, operation = "stop") {
	const ancestors = getSelfAndAncestorPidsSync();
	const store = createManagedHandoffLeaseStore();
	const claim = store.read(resolveUpdateInstallRoot(root));
	const lease = claim.kind === "current" ? claim.lease : void 0;
	if (lease?.action.kind === "triage" && lease.action.phase === "running" && lease.action.lifetime.kind === "native" && lease.action.lifetime.placement.kind === "attached" && lease.action.lifetime.unit === `${resolveSystemdServiceName(state.env)}.service` && [lease.executor, lease.helper].every((owner) => ancestors.has(owner.pid) && isPidAlive(owner.pid) && store.readProcessStartIdentity(owner.pid) === owner.startIdentity)) return "This maintenance command cannot stop the Gateway from inside its automatic triage process tree: stopping the service would cancel this repair. Use read-only diagnosis or safe offline artifact repair followed by an atomic `openclaw gateway restart`, or run stop-requiring maintenance from a shell outside automatic triage. Report this blocker if repair cannot proceed safely.";
	return operation === "handoff" ? void 0 : gatewayAncestryBlockMessage(state.runtime?.pid);
}
async function handoffUpdateFromGateway(params) {
	if (process.env.OPENCLAW_UPDATE_RUN_HANDOFF === "1" || process.platform !== "linux" && process.platform !== "darwin") return false;
	const parentPid = parsePositivePid(params.state.runtime?.pid);
	const supervisor = detectRespawnSupervisor(process.env, process.platform, { includeLinuxOpenClawGatewayServiceMarker: true }) ?? (gatewayAncestryBlockMessage(parentPid) ? process.platform === "linux" ? "systemd" : "launchd" : null);
	if (!parentPid || !supervisor) return false;
	params.stopProgress();
	const env = resolveOwnedManagedUpdateEnv({
		serviceEnv: params.state.env,
		serviceDefinitionEnv: resolveManagedGatewayServiceCommand(params.state.command)?.environment,
		invocationCwd: params.invocationCwd
	});
	const argv1 = await resolveGatewayInstallEntrypoint(params.root);
	if (!argv1) throw new UpdatePreMutationError("managed-service-handoff-failed", "Cannot locate the installed updater; run `openclaw doctor` before retrying.");
	if (params.opts.run?.executorFence) {
		releaseUpdateCommandPreflightForHandoff(params.opts.run.executorFence);
		delete params.opts.run.executorFence;
	}
	const started = await startManagedServiceUpdateHandoff({
		runId: params.opts.run?.runId,
		root: params.root,
		invocationCwd: params.invocationCwd,
		parentPid,
		supervisor,
		env,
		execPath: params.nodeRunner ?? resolveNodeRunner(),
		argv1,
		timeoutMs: params.timeoutMs,
		restartDrainTimeoutMs: resolveGatewayRestartDeferralTimeoutMs(),
		channel: normalizeUpdateChannel(params.opts.channel) ?? void 0,
		tag: params.tag,
		devTarget: params.devTarget,
		acceptCapabilities: params.opts.acceptCapabilities,
		reapplyLocalOverrides: params.opts.reapplyLocalOverrides,
		meta: { runId: params.opts.run?.runId }
	});
	if (started.status === "joined") throw new UpdatePreMutationError("managed-service-handoff-already-running", "Another managed update is already running. Check progress with `openclaw update status`.");
	const identity = {
		kind: "managed-update-handoff",
		handoffId: started.handoffId,
		installRoot: started.installRoot
	};
	const target = resolveInstallationTarget(env);
	const statusCommand = formatInstallationTargetCommand([
		"openclaw",
		"update",
		"status"
	], target, { env });
	const healthCommand = formatInstallationTargetCommand([
		"openclaw",
		"gateway",
		"status",
		"--deep"
	], target, { env });
	const guidance = `Update is not finished. It will continue in the background so it can restart the Gateway.\nLog: ${started.logPath}\nCheck progress: ${statusCommand}`;
	const result = {
		runId: params.opts.run?.runId,
		status: "skipped",
		mode: params.mode,
		root: started.installRoot,
		reason: CONTROL_PLANE_UPDATE_HANDOFF_STARTED_REASON,
		steps: [{
			name: "managed-service update handoff",
			command: started.command,
			cwd: started.installRoot,
			durationMs: 0,
			exitCode: null,
			stdoutTail: guidance
		}],
		durationMs: 0
	};
	try {
		await writeControlPlaneUpdateRestartSentinel({
			result,
			meta: {
				runId: params.opts.run?.runId,
				handoffId: started.handoffId,
				root: started.installRoot
			}
		}, env);
		if (!await transferManagedServiceUpdateHandoff(identity)) throw new Error(`Managed update ownership transfer failed. Inspect ${started.logPath} and run ${healthCommand} before retrying.`);
	} catch (error) {
		await cancelManagedServiceUpdateHandoff(identity);
		throw error;
	}
	if (params.opts.run) recordUpdateRunStep(params.opts.run.runId, {
		step: "managed-service update handoff",
		status: "completed",
		endedAtMs: Date.now()
	}, { env: params.opts.run.env });
	await printResult(result, params.opts, { nextAction: guidance });
	process.exitCode = UPDATE_HANDOFF_IN_PROGRESS_EXIT_CODE;
	return true;
}
async function parkForegroundUpdateForActivation(params, assertCurrent) {
	assertCurrent();
	const run = params.opts.run;
	if (run?.completionOwner === "gateway-restart" && !run.gatewayRestartRequired) {
		await parkForegroundUpdateHandoff({
			root: params.root,
			run
		});
		assertCurrent();
	}
}
/** Invalid handoff metadata may not fall back to another native owner. */
async function resolveForegroundUpdateAdmission(params) {
	const env = params.env ?? process.env;
	const meta = params.meta === void 0 ? await readControlPlaneUpdateSentinelMeta(env) : params.meta;
	const claimed = meta?.completionOwner === "gateway-restart";
	if (!claimed && !params.expectedForeground && !meta?.foregroundOrigin && !(env["OPENCLAW_CONTROL_PLANE_UPDATE_SENTINEL_META"]?.trim() && meta === null)) return false;
	if (!claimed || !params.root || !await isCurrentForegroundUpdateHandoffProcess({
		root: params.root,
		runId: env["OPENCLAW_UPDATE_RUN_ID"],
		env
	})) throw new UpdatePreMutationError("managed-service-preflight", "The update handoff metadata or this Gateway's current ownership could not be verified. Retry the update from its current owner.");
	return true;
}
//#endregion
export { resolveForegroundUpdateAdmission as a, parkForegroundUpdateForActivation as i, gatewayMaintenanceBlockMessage as n, handoffUpdateFromGateway as r, formatUpdateAncestryBlockMessage as t };
