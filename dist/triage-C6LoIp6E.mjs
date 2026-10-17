import { n as isNodeRuntime } from "./runtime-binary-BAwmhhZ0.mjs";
import { n as resolveOpenClawPackageRoot } from "./openclaw-root-CBoxhfke.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { t as resolveSubprocessExitCode } from "./subprocess-exit-code-AepaGf2z.mjs";
import { a as writeRuntimeJson, t as ExitError } from "./runtime-DlO3PTAd.mjs";
import { t as exitCliAfterOutput } from "./one-shot-exit-Bd4757D_.mjs";
import { o as resolveExecutablePath } from "./executable-path-CP2HPhgU.mjs";
import { c as redactSupportString } from "./diagnostic-support-redaction-C72A4r6A.mjs";
import { C as tryResolveAmbientOwnerAgentId } from "./agent-scope-config-CDYpzA0r.mjs";
import { o as resolveAgentEffectiveModelPrimary } from "./agent-scope-CG17uXFn.mjs";
import { r as callGatewayFromCliWithTransport } from "./gateway-rpc-Cl_Z2Z7Q.mjs";
import { n as readTriageUpdateFailure, r as sanitizeTriageUpdateFailure, t as readPendingTriageUpdateFailure } from "./triage-update-CAZSHikj.mjs";
import { l as writeTriageUpdateFailure } from "./update-failure-report-artifact-DSFBsmLj.mjs";
import { i as resolveInstallationTarget, r as installationTargetEnv } from "./installation-target-context-BOfhXm_n.mjs";
import { n as recordAgentCleanupFailure, t as createAgentCleanupScope } from "./run-cleanup-timeout-PkWBWOyt.mjs";
import { o as resolveWindowsSpawnProgramCandidate } from "./windows-spawn-xKp8ggmt.mjs";
import { t as formatInstallationTargetCommand } from "./installation-target-format-DdNjHxEC.mjs";
import { n as stylePromptMessage } from "./prompt-style-zarsDmI2.mjs";
import { t as scrubDoctorErrorMessage } from "./doctor-error-message-CBAGGfGW.mjs";
import { n as createEmbeddedStateSignalBridge } from "./embedded-state-lock-BuzhrBON.mjs";
import { n as acceptTriageContinuation } from "./triage-continuation-GHGJYopG.mjs";
import { t as renderTriagePrompt } from "./triage-prompt-D1-a8WQ0.mjs";
import path from "node:path";
import fs from "node:fs/promises";
import { spawn } from "node:child_process";
import { confirm } from "@clack/prompts";
//#region src/commands/triage-handoff.ts
const TRIAGE_EXTERNAL_AGENTS = [
	"codex",
	"claude",
	"pi",
	"opencode",
	"muse",
	"grok",
	"cursor",
	"kimi",
	"qwen"
];
/** Keep executable manual commands and the complete JSON handoff pinned to the same target. */
function formatTriageHandoffCommands(params) {
	const { target, env, prompt, promptPath, updateResultPath } = params;
	const format = (argv, stdinPath) => formatInstallationTargetCommand(argv, target, {
		env,
		...stdinPath ? { stdinPath } : {}
	});
	const external = {
		claude: format([
			"claude",
			"-p",
			...promptPath ? [] : [prompt]
		], promptPath),
		codex: format([
			"codex",
			"exec",
			"--skip-git-repo-check",
			promptPath ? "-" : prompt
		], promptPath),
		cursor: format([
			"cursor-agent",
			"--print",
			...promptPath ? [] : [prompt]
		], promptPath),
		grok: format(["grok", ...promptPath ? ["--prompt-file", promptPath] : ["--single", prompt]]),
		kimi: format([
			"kimi",
			"--prompt",
			promptPath ? `Read the debugging prompt at ${promptPath} and follow its repair and verification instructions.` : prompt
		]),
		muse: format([
			"muse",
			"exec",
			...promptPath ? ["--prompt-file", promptPath] : [prompt]
		]),
		opencode: format([
			"opencode",
			"run",
			...promptPath ? [] : [prompt]
		], promptPath),
		pi: format([
			"pi",
			"--print",
			...promptPath ? [] : [prompt]
		], promptPath),
		qwen: format(["qwen", ...promptPath ? [] : [prompt]], promptPath)
	};
	const failureArgs = updateResultPath ? ["--update-result", updateResultPath] : [];
	return {
		external,
		embedded: format([
			"openclaw",
			"triage",
			"--run",
			...failureArgs
		]),
		retry: format([
			"openclaw",
			"triage",
			...params.agent ? ["--agent", params.agent] : [],
			...failureArgs
		])
	};
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
		const [{ writeDiagnosticSupportExport }, { gatherDaemonStatus }] = await Promise.all([import("./diagnostic-support-export-qi9Qdd2D.mjs"), import("./status.gather-C3V4F10H.mjs")]);
		return {
			kind: "available",
			path: (await writeDiagnosticSupportExport({
				readHealthSnapshot: async () => await callGatewayFromCliWithTransport("health", rpc, void 0, {
					defaultTimeoutMs: 3e3,
					sharedStateMode: "read-only"
				}),
				readStatusSnapshot: async () => await gatherDaemonStatus({
					rpc,
					probe: true,
					requireRpc: false,
					deep: false
				})
			})).path
		};
	} catch (error) {
		return {
			kind: "unavailable",
			reason: triageCollectionError(error, redaction)
		};
	}
}
/** Collect read-only diagnostics and hand the local repair to an available coding agent. */
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
	const allowAgent = automatic ? !automatic.diagnosticOnly : options.json !== true && options.nonInteractive !== true && interactive;
	const deferDiagnostics = !automatic && allowAgent && Boolean(options.recovery || options.updateResult);
	let findings = [];
	if (!deferDiagnostics) try {
		const { collectDoctorFindings } = await import("./doctor-lint-runner-D2ljUFfc.mjs");
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
	const updateFailure = options.recovery ? sanitizeTriageUpdateFailure(options.recovery.updateFailure, redaction) : options.updateResult ? await readTriageUpdateFailure(options.updateResult, redaction) : pendingUpdate;
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
		return program.resolution !== "unresolved-wrapper" && (program.resolution !== "node-entrypoint" || nodeExecutable !== void 0) && (automatic ? agent === "claude" || agent === "codex" : options.agent === void 0 || agent === options.agent);
	});
	let runEmbedded = options.run === true;
	if (automatic && !automatic.diagnosticOnly) {
		const { readConfigFileSnapshot } = await import("./config/config.js");
		const snapshot = await readConfigFileSnapshot({ observe: false });
		const config = snapshot.runtimeConfig ?? snapshot.config;
		const agentId = tryResolveAmbientOwnerAgentId(config);
		runEmbedded = Boolean(snapshot.exists && snapshot.valid && agentId && resolveAgentEffectiveModelPrimary(config, agentId));
	}
	const prompt = renderTriagePrompt({
		findings,
		bundle,
		redaction,
		updateFailure,
		failure: automatic?.failure,
		...runEmbedded && automatic && !automatic.diagnosticOnly ? { maintenanceHandoff: true } : {}
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
		await fs.mkdir(outputDir, {
			recursive: true,
			mode: 448
		});
		await fs.writeFile(file, prompt, {
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
	const needsConfirmation = interactive && options.nonInteractive !== true && canStartAgent && (options.recovery !== void 0 || automatic?.failure.kind === "update");
	const agentLabel = runEmbedded ? "the embedded OpenClaw agent using your configured model" : handoff?.agent;
	if (needsConfirmation) runtime.log(`Agent: ${agentLabel}. This will use your own account/tokens.`);
	if (promptArtifact.ok) runtime.log(`Debugging prompt: ${promptArtifact.value}`);
	else runtime.error(`Debugging prompt could not be saved: ${promptArtifact.error}`);
	if (bundle.kind === "available") runtime.log(`Sanitized diagnostics: ${bundle.path}`);
	else if (bundle.kind === "unavailable") runtime.log(`Diagnostics export unavailable: ${bundle.reason}`);
	if (!runEmbedded && manualAgent?.agent === "kimi") runtime.log("Kimi Code runs one prompt with its native automatic permission policy (no approval prompts).");
	const declined = needsConfirmation && agentLabel !== void 0 && !await confirmAutomaticUpdateTriage(runtime, agentLabel, automatic?.signal ?? options.recovery?.signal);
	if (!isCurrent()) return;
	if (declined || !allowAgent || runEmbedded || !handoff) {
		if (declined || !allowAgent) runtime.log("No repair agent was started.");
		if (!runEmbedded && !manualAgent) {
			const agentName = options.agent === "cursor" ? "Cursor Agent (cursor-agent)" : options.agent;
			runtime.log(`No ${agentName ?? "supported coding-agent"} CLI executable was found on this process's PATH.`);
			runtime.log(`If already installed, add its executable to this shell's PATH; otherwise install ${agentName ?? "a supported coding-agent"} CLI, then run triage again.`);
			if (promptArtifact.ok) runtime.log("You can also open the saved debugging prompt in an agent you already use.");
		}
		const command = runEmbedded ? handoffCommands.embedded : manualAgent ? handoffCommands.external[manualAgent.agent] : handoffCommands.retry;
		runtime.log(runEmbedded && !declined && allowAgent ? "Manual recovery command:" : `Next step${!runEmbedded && manualAgent ? ` (${manualAgent.agent} detected)` : ""}:`);
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
			if (automatic) runtime.error("No configured embedded agent or directly launchable external agent is available.");
			else runtime.log("No coding agent can be launched directly; follow the next step above.");
			return;
		}
		let claudeSafeMode = false;
		if (handoff.agent === "claude") {
			const { probeClaudeSafeMode } = await import("./triage-claude-DYux24sa.mjs");
			const probe = await probeClaudeSafeMode({
				argv: [handoff.program.command, ...handoff.program.leadingArgv],
				env: targetEnv,
				signal: automatic?.signal ?? options.recovery?.signal,
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
		const args = handoff.agent === "claude" ? [claudeSafeMode ? "--safe-mode" : "-p", prompt] : handoff.agent === "qwen" ? ["--prompt-interactive", prompt] : handoff.agent === "opencode" || handoff.agent === "kimi" ? ["--prompt", prompt] : [prompt];
		if (!isCurrent()) return;
		let exitCode;
		try {
			if (automatic) {
				const { runUtf8CommandWithTimeout } = await import("./exec-C89-C-hl.mjs");
				const automaticArgs = handoff.agent === "claude" ? [...claudeSafeMode ? ["--safe-mode"] : [], "-p"] : [
					"exec",
					"--skip-git-repo-check",
					"-"
				];
				if (!isCurrent()) return;
				const result = await runUtf8CommandWithTimeout([
					handoff.program.command,
					...handoff.program.leadingArgv,
					...automaticArgs
				], {
					input: prompt,
					env: {
						...targetEnv,
						OPENCLAW_SHELL: "exec"
					},
					...agentOptions,
					signal: automatic.signal,
					timeoutMs: 6e5,
					killProcessTree: true,
					killSignal: "SIGINT",
					outputCapture: "tail",
					maxOutputBytes: 32768
				});
				recordAgentCleanupFailure();
				for (const output of [result.stdout, result.stderr]) if (output.trim()) runtime.log(redactSupportString(output, redaction, { maxLength: 32768 }));
				exitCode = result.termination === "exit" ? result.code ?? 1 : 1;
				if (exitCode !== 0) {
					runtime.error(`${handoff.agent} triage failed (${result.termination}, exit ${result.code ?? "unknown"}).`);
					runtime.log(`Run manually: ${handoffCommands.external[handoff.agent]}`);
				}
			} else exitCode = await new Promise((resolve, reject) => {
				const child = spawn(handoff.program.command, [...handoff.program.leadingArgv, ...args], {
					stdio: "inherit",
					env: targetEnv,
					...agentOptions
				});
				child.once("error", reject);
				child.once("exit", (code, signal) => resolve(resolveSubprocessExitCode(code, signal)));
			});
		} catch (error) {
			if (automatic && isRecord(error) && (error.cleanup === "uncertain" || error.cleanup === "forced")) recordAgentCleanupFailure();
			runtime.error(`Failed to launch ${handoff.agent}: ${triageCollectionError(error, redaction)}`);
			runtime.log(`Run manually: ${handoffCommands.external[handoff.agent]}`);
			exitCliAfterOutput(runtime, 1);
		}
		if (exitCode !== 0) exitCliAfterOutput(runtime, exitCode);
		return;
	}
	if (!allowAgent) throw new Error("Embedded triage requires an interactive terminal; use a suggested handoff command.");
	if (automatic && !automatic.diagnosticOnly) {
		const { runAutomaticTriageRepair } = await import("./triage-automatic-repair-Dkohkx2n.mjs");
		return runAutomaticTriageRepair({
			runtime,
			target,
			targetEnv,
			prompt,
			isCurrent,
			installRoot: agentCwd ?? process.cwd(),
			signal: automatic.signal,
			allowGatewayActivation: automatic.failure.gateway === "verify-running",
			formatError: (error) => triageCollectionError(error, redaction)
		});
	}
	const { runUpdateRepairLoop } = await import("./update-repair-agent-BumEHqAv.mjs");
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
					const { validateTriageDoctor } = await import("./triage-doctor-CRMmnJGf.mjs");
					return validateTriageDoctor({
						installRoot,
						env: targetEnv,
						signal,
						redaction
					});
				};
				const { validateTriageUpdateResolution } = await import("./update-triage-resolution-BWUFWmTf.mjs");
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
