import { n as isNodeRuntime } from "./runtime-binary-GM6c0Hou.mjs";
import { n as resolveOpenClawPackageRoot } from "./openclaw-root-CPodxfi3.mjs";
import { t as resolveSubprocessExitCode } from "./subprocess-exit-code-AepaGf2z.mjs";
import { o as writeRuntimeJson, t as ExitError } from "./runtime-BazLsT0s.mjs";
import { o as isDefaultInstallIdentity } from "./paths-orClZ-2Z.mjs";
import { Jn as string, qn as strictObject, xn as literal } from "./schemas-BOYIvvln.mjs";
import { o as resolveExecutablePath } from "./executable-path-hXcbMo0b.mjs";
import { c as redactSupportString } from "./diagnostic-support-redaction-BP5XqJ7g.mjs";
import { n as prepareManagedHandoffLeaseStore, t as createManagedHandoffLeaseStore } from "./update-managed-service-handoff-lease-CPNRSilB.mjs";
import { a as triageFailureSchema } from "./update-managed-service-handoff-process-BULCClsA.mjs";
import { o as resolveWindowsSpawnProgramCandidate } from "./windows-spawn-BwP7BByc.mjs";
import { t as createAgentCleanupScope } from "./run-cleanup-timeout-CjK4qQ1w.mjs";
import { t as exitCliAfterOutput } from "./one-shot-exit-DmuNrGrj.mjs";
import { r as callGatewayFromCliWithTransport } from "./gateway-rpc-Wcwajg7Y.mjs";
import { n as readTriageUpdateFailure, r as sanitizeTriageUpdateFailure, t as readPendingTriageUpdateFailure } from "./triage-update-YKF7SYYY.mjs";
import { l as writeTriageUpdateFailure } from "./update-failure-report-artifact-ZpnzvCW7.mjs";
import { i as resolveInstallationTarget, r as installationTargetEnv } from "./installation-target-context-B9ZDUs_O.mjs";
import { r as createManagedUpdateRequesterAuthority, t as UpdateRequesterRevokedError } from "./update-requester-authority-BP771TSP.mjs";
import { i as UPDATE_RUN_ID_ENV, n as CONTROL_PLANE_UPDATE_SENTINEL_META_ENV } from "./update-control-plane-sentinel-BOyIUo0V.mjs";
import { n as stylePromptMessage } from "./prompt-style-zarsDmI2.mjs";
import { t as scrubDoctorErrorMessage } from "./doctor-error-message-CBAGGfGW.mjs";
import { n as formatTriageHandoffCommands, t as TRIAGE_EXTERNAL_AGENTS } from "./triage-handoff-lI9TJbQL.mjs";
import { n as createEmbeddedStateSignalBridge } from "./embedded-state-lock-CLsuR7uN.mjs";
import { t as renderTriagePrompt } from "./triage-prompt-y8MBbY7q.mjs";
import { realpathSync } from "node:fs";
import fs$1 from "node:fs/promises";
import path from "node:path";
import { spawn } from "node:child_process";
import { confirm } from "@clack/prompts";
//#region src/infra/triage-continuation.ts
const TRIAGE_HANDOFF_GRACE_MS = 3e4;
const continuationSchema = strictObject({
	type: literal("triage"),
	version: literal(2),
	failure: triageFailureSchema,
	installRoot: string().min(1).max(4096),
	owner: string().min(1).max(4096),
	requester: strictObject({
		channel: string().max(4096).optional(),
		accountId: string().max(4096).optional(),
		senderId: string().max(4096).optional(),
		authorizationSource: string().max(4096).optional()
	}).optional()
});
function ownsChildLease(root, action) {
	const store = createManagedHandoffLeaseStore();
	const result = store.read(root);
	return result.kind === "current" && result.lease.action.kind === action && result.lease.helper.pid === process.ppid && process.connected && store.owns(result.lease, "executor") ? result.lease : null;
}
async function exchangeWithParent(message, signal) {
	return await new Promise((resolve, reject) => {
		let settled = false;
		const finish = (error, value) => {
			if (settled) return;
			settled = true;
			clearTimeout(timer);
			process.removeListener("message", received);
			process.removeListener("disconnect", disconnected);
			signal?.removeEventListener("abort", aborted);
			if (error) reject(error);
			else resolve(value);
		};
		const received = (value) => finish(null, value);
		const disconnected = () => finish(/* @__PURE__ */ new Error("automatic triage owner disconnected"));
		const aborted = () => finish(/* @__PURE__ */ new Error("automatic triage admission cancelled"));
		const timer = setTimeout(() => finish(/* @__PURE__ */ new Error("automatic triage admission timed out")), TRIAGE_HANDOFF_GRACE_MS);
		process.once("message", received).once("disconnect", disconnected);
		signal?.addEventListener("abort", aborted, { once: true });
		if (signal?.aborted) {
			aborted();
			return;
		}
		if (!process.connected || !process.send) {
			disconnected();
			return;
		}
		process.send(message, (error) => {
			if (error) finish(error);
		});
	});
}
async function acceptTriageContinuation() {
	if (process.env.OPENCLAW_UPDATE_RUN_HANDOFF !== "1") return;
	if (!process.send || !process.connected) throw new Error("automatic triage requires its original connected owner; run openclaw triage manually");
	const store = await prepareManagedHandoffLeaseStore();
	const controller = new AbortController();
	const parent = store.processIdentity(process.ppid);
	let lease;
	let requesterAuthority;
	let watch;
	let disposed = false;
	let shutdown;
	const armShutdown = () => {
		if (!lease || shutdown) return;
		shutdown = setTimeout(() => {
			try {
				store.settle(lease, "uncertain");
			} finally {
				process.kill(process.pid, "SIGKILL");
			}
		}, TRIAGE_HANDOFF_GRACE_MS);
		shutdown.unref();
	};
	const cancel = (reason) => {
		if (disposed || controller.signal.aborted) return;
		armShutdown();
		try {
			if (lease) store.settle(lease, "closing");
		} catch {}
		controller.abort(reason instanceof Error ? reason : /* @__PURE__ */ new Error("automatic triage cancelled: live owner or claim lost"));
		if (lease?.action.kind === "triage" && lease.action.lifetime.kind === "native") try {
			store.stopNative(lease, true);
		} catch {}
	};
	const onMessage = (message) => {
		if (strictObject({
			type: literal("triage-cancel"),
			version: literal(2)
		}).safeParse(message).success) cancel();
	};
	const checkCurrent = () => {
		try {
			if (requesterAuthority && !requesterAuthority.isCurrent()) throw new UpdateRequesterRevokedError();
			if (disposed || !lease || !process.connected || process.ppid !== parent.pid || !store.owns(lease, "executor") || lease.action.kind === "triage" && lease.action.lifetime.kind === "native" && (lease.action.lifetime.placement.kind !== "attached" || !store.isInNativeScope(lease.action.lifetime))) cancel();
		} catch (error) {
			cancel(error);
		}
	};
	const assertCurrent = () => {
		checkCurrent();
		if (disposed) throw new Error("automatic triage continuation is closed");
		controller.signal.throwIfAborted();
	};
	const finish = async (cleanup) => {
		if (disposed) return;
		armShutdown();
		try {
			if (lease) store.settle(lease, cleanup);
		} finally {
			disposed = true;
			clearInterval(watch);
			process.removeListener("disconnect", cancel).removeListener("message", onMessage);
			controller.abort(/* @__PURE__ */ new Error("automatic triage continuation closed"));
			if (process.connected) process.disconnect?.();
		}
	};
	process.once("disconnect", cancel);
	try {
		const { failure, installRoot, owner, requester } = continuationSchema.parse(await exchangeWithParent({
			type: "triage-ready",
			version: 2
		}));
		const admitted = ownsChildLease(installRoot, "triage");
		if (!admitted || admitted.owner !== owner || admitted.action.kind !== "triage" || admitted.action.phase !== "running" || realpathSync(installRoot) !== installRoot || failure.installationRoot !== installRoot || JSON.stringify(admitted.helper) !== JSON.stringify(parent)) throw new Error("automatic triage lost its live root/generation claim");
		lease = admitted;
		if (admitted.action.lifetime.kind === "native") {
			const life = admitted.action.lifetime;
			if (life.placement.kind !== "attached" || !store.isInNativeScope(life)) throw new Error("automatic triage executor is outside its native scope");
		}
		requesterAuthority = requester ? await createManagedUpdateRequesterAuthority(requester) : void 0;
		process.on("message", onMessage);
		watch = setInterval(checkCurrent, 250);
		assertCurrent();
		delete process.env.OPENCLAW_UPDATE_RUN_HANDOFF;
		delete process.env[CONTROL_PLANE_UPDATE_SENTINEL_META_ENV];
		delete process.env.OPENCLAW_UPDATE_IN_PROGRESS;
		delete process.env[UPDATE_RUN_ID_ENV];
		return {
			failure,
			signal: controller.signal,
			assertCurrent,
			finish
		};
	} catch (error) {
		cancel();
		await finish("uncertain");
		throw error;
	}
}
//#endregion
//#region src/commands/triage.ts
function triageCollectionError(error, redaction) {
	const message = error instanceof Error ? error.message : String(error);
	return scrubDoctorErrorMessage(redactSupportString(message, redaction));
}
async function confirmAutomaticUpdateTriage(runtime, agent, signal) {
	const timeout = new AbortController();
	const timer = setTimeout(() => timeout.abort(), 3e4);
	let answer;
	try {
		answer = await confirm({
			message: stylePromptMessage(`Open ${agent} to diagnose and repair the installation now? [y/N]`),
			initialValue: false,
			signal: signal ? AbortSignal.any([signal, timeout.signal]) : timeout.signal
		});
	} finally {
		clearTimeout(timer);
	}
	if (timeout.signal.aborted && !signal?.aborted) runtime.log("No answer; skipping automatic repair.");
	return !timeout.signal.aborted && !signal?.aborted && answer === true;
}
async function collectTriageBundle(skipExport, redaction) {
	if (skipExport) return { kind: "skipped" };
	try {
		const rpc = {
			timeout: "3000",
			json: true
		};
		const [{ writeDiagnosticSupportExport }, { gatherDaemonStatus }] = await Promise.all([import("./diagnostic-support-export-Dpd-c773.mjs"), import("./status.gather-DTGkFxw8.mjs")]);
		return {
			kind: "available",
			path: (await writeDiagnosticSupportExport({
				readHealthSnapshot: async () => await callGatewayFromCliWithTransport("health", rpc, void 0, {
					defaultTimeoutMs: 3e3,
					sharedStateMode: "read-only"
				}),
				readStatusSnapshot: isDefaultInstallIdentity(redaction.env) ? async () => await gatherDaemonStatus({
					rpc,
					probe: true,
					requireRpc: false,
					deep: false
				}) : void 0
			})).path
		};
	} catch (error) {
		return {
			kind: "unavailable",
			reason: triageCollectionError(error, redaction)
		};
	}
}
async function triageCommand(runtime, options = {}, automatic) {
	if (!automatic && !options.json && !options.run && !options.noExport && !options.nonInteractive && !options.agent) {
		const continuation = await acceptTriageContinuation();
		if (continuation) {
			const bridge = createEmbeddedStateSignalBridge();
			try {
				const automaticRuntime = {
					...runtime,
					exit: (code) => {
						throw new ExitError(code);
					}
				};
				const cleanup = createAgentCleanupScope();
				try {
					return await cleanup.run(() => triageCommand(automaticRuntime, options, {
						failure: continuation.failure,
						signal: AbortSignal.any([continuation.signal, bridge.signal]),
						assertCurrent: continuation.assertCurrent
					}));
				} finally {
					await continuation.finish(cleanup.outcome);
				}
			} finally {
				bridge.dispose();
			}
		}
	}
	const isCurrent = () => {
		automatic?.signal.throwIfAborted();
		if (automatic && !automatic.diagnosticOnly) automatic.assertCurrent();
		return options.recovery?.isCurrent?.() !== false;
	};
	if (!isCurrent()) return;
	const interactive = process.stdin.isTTY && process.stdout.isTTY;
	const allowAgent = !automatic && options.json !== true && options.nonInteractive !== true && interactive;
	const deferDiagnostics = !automatic && allowAgent && Boolean(options.recovery || options.updateResult);
	let findings = [];
	if (!deferDiagnostics) try {
		const { collectDoctorFindings } = await import("./doctor-lint-runner-CrgYvHwq.mjs");
		findings = await collectDoctorFindings(runtime);
	} catch (error) {
		findings = [{
			checkId: "core/triage/doctor-collection",
			severity: "error",
			message: `Doctor checks unavailable: ${triageCollectionError(error, {
				env: process.env,
				stateDir: options.recovery?.target.stateDir ?? resolveInstallationTarget().stateDir
			})}`
		}];
	}
	const target = options.recovery?.target ?? resolveInstallationTarget();
	const targetEnv = {
		...process.env,
		...installationTargetEnv(target)
	};
	const agentCwd = automatic?.failure.installationRoot ?? options.recovery?.cwd;
	const agentOptions = agentCwd ? { cwd: agentCwd } : {};
	const redaction = {
		env: targetEnv,
		stateDir: target.stateDir
	};
	const pendingUpdate = !options.recovery && !options.updateResult ? await readPendingTriageUpdateFailure(targetEnv, redaction) : void 0;
	const updateFailure = options.recovery ? sanitizeTriageUpdateFailure(options.recovery.updateFailure, redaction) : options.updateResult ? await readTriageUpdateFailure(options.updateResult, redaction) : pendingUpdate ?? (automatic ? sanitizeTriageUpdateFailure({ error: `${automatic.failure.phase}: ${automatic.failure.error}` }, redaction) : void 0);
	const bundle = deferDiagnostics ? { kind: "deferred" } : await collectTriageBundle(options.noExport === true, redaction);
	const nodeExecutable = isNodeRuntime(process.execPath) ? process.execPath : process.platform === "win32" ? resolveExecutablePath("node.exe") : void 0;
	const externalAgents = TRIAGE_EXTERNAL_AGENTS.flatMap((agent) => {
		const executablePath = resolveExecutablePath(agent === "cursor" ? "cursor-agent" : agent);
		return executablePath ? [{
			agent,
			program: resolveWindowsSpawnProgramCandidate({
				command: executablePath,
				execPath: nodeExecutable
			})
		}] : [];
	});
	const handoff = externalAgents.find(({ agent, program }) => {
		return program.resolution !== "unresolved-wrapper" && (program.resolution !== "node-entrypoint" || nodeExecutable !== void 0) && (options.agent === void 0 || agent === options.agent);
	});
	const runEmbedded = options.run === true;
	const prompt = renderTriagePrompt({
		findings,
		bundle,
		redaction,
		updateFailure,
		failure: automatic?.failure
	});
	const canStartAgent = allowAgent && (runEmbedded || handoff !== void 0);
	const now = (/* @__PURE__ */ new Date()).toISOString().replace(/[:.]/gu, "-");
	const outputDir = path.join(target.stateDir, "logs", "support");
	let updateResultPath;
	let promptArtifact;
	try {
		updateResultPath = updateFailure ? await writeTriageUpdateFailure(updateFailure, { env: targetEnv }) : void 0;
		if (!isCurrent()) return;
		const file = path.join(outputDir, `openclaw-triage-prompt-${now}-${process.pid}.md`);
		await fs$1.mkdir(outputDir, {
			recursive: true,
			mode: 448
		});
		await fs$1.writeFile(file, prompt, {
			encoding: "utf8",
			mode: 384
		});
		promptArtifact = {
			ok: true,
			value: file
		};
	} catch (error) {
		if (!canStartAgent) throw error;
		promptArtifact = {
			ok: false,
			error: triageCollectionError(error, redaction)
		};
	}
	if (!isCurrent()) return;
	const promptPath = promptArtifact.ok ? promptArtifact.value : null;
	const handoffCommands = formatTriageHandoffCommands({
		target,
		env: targetEnv,
		prompt,
		promptPath,
		updateResultPath,
		agent: options.agent
	});
	const suggestedCommands = [...TRIAGE_EXTERNAL_AGENTS.map((agent) => handoffCommands.external[agent]), handoffCommands.embedded];
	const findingCounts = {
		error: 0,
		warning: 0,
		info: 0
	};
	for (const finding of findings) findingCounts[finding.severity] += 1;
	const report = {
		promptPath,
		bundlePath: bundle.kind === "available" ? bundle.path : null,
		bundleError: bundle.kind === "unavailable" ? bundle.reason : null,
		findings: findingCounts,
		detectedAgents: externalAgents.map(({ agent }) => agent),
		suggestedCommands
	};
	if (options.json === true) {
		writeRuntimeJson(runtime, report);
		return;
	}
	const manualAgent = handoff ?? externalAgents.find(({ agent }) => !options.agent || agent === options.agent);
	const needsConfirmation = interactive && options.nonInteractive !== true && canStartAgent && options.recovery !== void 0;
	const agentLabel = runEmbedded ? "the embedded OpenClaw agent using your configured model" : handoff?.agent;
	if (needsConfirmation) runtime.log(`Agent: ${agentLabel}. This will use your own account/tokens.`);
	if (promptArtifact.ok) runtime.log(`Debugging prompt: ${promptArtifact.value}`);
	else runtime.error(`Debugging prompt could not be saved: ${promptArtifact.error}`);
	if (bundle.kind === "available") runtime.log(`Sanitized diagnostics: ${bundle.path}`);
	else if (bundle.kind === "unavailable") runtime.log(`Diagnostics export unavailable: ${bundle.reason}`);
	if (!runEmbedded && manualAgent?.agent === "kimi") runtime.log("Kimi Code runs one prompt with its native automatic permission policy (no approval prompts).");
	const declined = needsConfirmation && agentLabel !== void 0 && !await confirmAutomaticUpdateTriage(runtime, agentLabel, options.recovery?.signal);
	if (!isCurrent()) return;
	if (declined || !allowAgent || runEmbedded || !handoff) {
		const useEmbeddedCommand = runEmbedded || !allowAgent && updateResultPath !== void 0 && !options.agent;
		if (declined || !allowAgent) runtime.log("No repair agent was started.");
		if (!useEmbeddedCommand && !manualAgent) {
			const agentName = options.agent === "cursor" ? "Cursor Agent (cursor-agent)" : options.agent;
			runtime.log(`No ${agentName ?? "supported coding-agent"} CLI executable was found on this process's PATH.`);
			runtime.log(`If already installed, add its executable to this shell's PATH; otherwise install ${agentName ?? "a supported coding-agent"} CLI, then run triage again.`);
			if (promptArtifact.ok) runtime.log("You can also open the saved debugging prompt in an agent you already use.");
		}
		const command = useEmbeddedCommand ? handoffCommands.embedded : manualAgent ? handoffCommands.external[manualAgent.agent] : handoffCommands.retry;
		runtime.log(runEmbedded && !declined && allowAgent ? "Manual recovery command:" : `Next step${!useEmbeddedCommand && manualAgent ? ` (${manualAgent.agent} detected)` : ""}:`);
		runtime.log(`  ${command}`);
		if (declined) return;
		if (!allowAgent && !runEmbedded) return;
	}
	if (!runEmbedded) {
		if (!handoff) {
			if (options.agent) {
				runtime.error(`${options.agent} is not found or unavailable for direct launch on PATH.`);
				exitCliAfterOutput(runtime, 1);
			}
			runtime.log("No coding agent can be launched directly; follow the next step above.");
			return;
		}
		let claudeSafeMode = false;
		if (handoff.agent === "claude") {
			const { probeClaudeSafeMode } = await import("./triage-claude-7N8viotB.mjs");
			const probe = await probeClaudeSafeMode({
				argv: [handoff.program.command, ...handoff.program.leadingArgv],
				env: targetEnv,
				signal: options.recovery?.signal,
				...agentOptions
			});
			if (!probe.ok) {
				runtime.error(`Failed to check Claude safe-mode support: ${triageCollectionError(probe.error, redaction)}`);
				runtime.log(`Run manually: ${handoffCommands.external.claude}`);
				exitCliAfterOutput(runtime, 1);
			}
			if (!isCurrent()) return;
			claudeSafeMode = probe.supported;
			if (!claudeSafeMode) runtime.log("Claude --safe-mode unavailable; running claude -p with normal customization settings.");
		}
		runtime.log(`Starting ${handoff.agent}; use --agent <name> to select another coding agent.`);
		const args = handoff.agent === "claude" ? [claudeSafeMode ? "--safe-mode" : "-p", prompt] : handoff.agent === "qwen" || handoff.agent === "agy" ? ["--prompt-interactive", prompt] : handoff.agent === "opencode" || handoff.agent === "kimi" ? ["--prompt", prompt] : [prompt];
		if (!isCurrent()) return;
		let exitCode;
		try {
			exitCode = await new Promise((resolve, reject) => {
				const child = spawn(handoff.program.command, [...handoff.program.leadingArgv, ...args], {
					stdio: "inherit",
					env: targetEnv,
					...agentOptions
				});
				child.once("error", reject);
				child.once("exit", (code, signal) => resolve(resolveSubprocessExitCode(code, signal)));
			});
		} catch (error) {
			runtime.error(`Failed to launch ${handoff.agent}: ${triageCollectionError(error, redaction)}`);
			runtime.log(`Run manually: ${handoffCommands.external[handoff.agent]}`);
			exitCliAfterOutput(runtime, 1);
		}
		if (exitCode !== 0) exitCliAfterOutput(runtime, exitCode);
		return;
	}
	if (!allowAgent) throw new Error("Embedded triage requires an interactive terminal; use a suggested handoff command.");
	const { runUpdateRepairLoop } = await import("./update-repair-agent-D-UEj25I.mjs");
	const installRoot = await resolveOpenClawPackageRoot({
		moduleUrl: import.meta.url,
		argv1: process.argv[1]
	});
	if (!isCurrent()) return;
	if (!installRoot) throw new Error("Cannot locate the OpenClaw installation; use a suggested handoff command.");
	const failedResult = updateFailure && "result" in updateFailure ? updateFailure.result : void 0;
	const result = await runUpdateRepairLoop({
		target: {
			stateDir: target.stateDir,
			configPath: target.configPath,
			workspaceDir: target.defaultWorkspaceDir,
			installRoot
		},
		context: {
			...updateFailure ?? { error: "Operator requested installation triage" },
			phase: "verifying",
			beforeVersion: failedResult?.before?.version ?? void 0,
			symptoms: findings.slice(0, 20).map((finding) => redactSupportString(`[${finding.severity}] ${finding.checkId}: ${finding.message}`, redaction, { maxLength: 200 }))
		},
		isCurrent,
		onEvent: (event) => {
			if (event.type === "turn-started" && isCurrent()) runtime.log(`Starting repair turn ${event.turn} with ${event.provider}/${event.model}.`);
		},
		validate: async (signal) => {
			try {
				const validateDoctor = async () => {
					const { validateTriageDoctor } = await import("./triage-doctor-B6tw9ASt.mjs");
					return validateTriageDoctor({
						installRoot,
						env: targetEnv,
						signal,
						redaction
					});
				};
				const { validateTriageUpdateResolution } = await import("./update-triage-resolution-BIi3pZME.mjs");
				const resolution = await validateTriageUpdateResolution({
					failure: updateFailure,
					implicit: !options.updateResult && !options.recovery,
					installRoot,
					env: targetEnv,
					signal,
					validateDoctor
				});
				return {
					...resolution,
					summary: triageCollectionError(resolution.summary, redaction),
					...resolution.stopReason ? { stopReason: triageCollectionError(resolution.stopReason, redaction) } : {}
				};
			} catch (error) {
				signal.throwIfAborted();
				const summary = `${updateFailure ? "Update resolution checks" : "Doctor checks"} unavailable: ${triageCollectionError(error, redaction)}${updateFailure ? " Next step: run `openclaw update status --json`, then `openclaw update repair`." : ""}`;
				return {
					ok: false,
					score: Number.MIN_SAFE_INTEGER,
					summary,
					...updateFailure ? { stopReason: summary } : {}
				};
			}
		}
	});
	if (!isCurrent()) return;
	if (result.status === "unavailable") {
		if (result.reason === "exec-denied-by-policy") throw new Error("The operator's policy denies unattended repair (exec-denied-by-policy). Use `openclaw triage` for an external handoff.");
		throw new Error(`Embedded agent unavailable: ${result.reason}. Run \`openclaw onboard\` or use a suggested handoff command.`);
	}
	for (const attempt of result.attempts) runtime.log(attempt.summary);
	const verdict = result.status === "repaired" && result.attempts.length === 0 ? "already resolved" : result.status;
	runtime.log(`Embedded repair ${verdict}: ${result.finalValidation.summary}`);
	if (result.status !== "repaired") {
		if (result.reason) runtime.error(result.reason);
		const timedOut = result.reason === "per-turn-budget" || result.reason === "wall-clock-budget";
		exitCliAfterOutput(runtime, timedOut ? 2 : 1);
	}
}
//#endregion
export { triageCommand };
