import { t as createDeferredCore } from "./deferred-D0La5CRk.mjs";
import { d as sleepWithAbort, s as raceWithTimeout } from "./src-D1BHGNTj.mjs";
import { s as registerSecretValueForRedaction } from "./secret-redaction-registry-DorVHn0l.mjs";
import { t as runCommandBuffered } from "./exec-DJvyCA0D.mjs";
import { i as tryListenOnPort } from "./ports-probe-DMGtt9dg.mjs";
import { t as getProcessSupervisor } from "./supervisor-j9Amjrh_.mjs";
import { t as detectBinary } from "./detect-binary-1PDZeQ8f.mjs";
import { i as probeRfbServer, t as classifyRfbSecurity } from "./rfb-probe-C71VHRO5.mjs";
import { n as HostDesktopCredentialsRequiredError } from "./host-source-errors-MaOVAU6G.mjs";
import { r as mintDesktopObserverToken } from "./observe-bridge-BjyJ23Lx.mjs";
import path from "node:path";
import fs from "node:fs/promises";
import os from "node:os";
import crypto from "node:crypto";
import { Readable } from "node:stream";
//#region src/gateway/desktop/host-guidance.ts
/** Platform-specific next steps for preparing a loopback-only host VNC server. */
const HOST_DESKTOP_GUIDANCE = {
	darwin: "Enable System Settings -> General -> Sharing -> Screen Sharing, or run `sudo launchctl enable system/com.apple.screensharing && sudo launchctl kickstart -k system/com.apple.screensharing`.",
	linux: "Install the managed desktop binaries with `apt install tigervnc-standalone-server tigervnc-tools xfce4-session dbus-daemon`, enable desktop.host.managed, or run a loopback-only VNC server yourself. For optional managed desktop audio, also install pulseaudio pulseaudio-utils; audio uses a private null sink, never the host microphone or physical system mix. gnome-remote-desktop uses unsupported VeNCrypt.",
	win32: "Install TightVNC with `SET_USEVNCAUTHENTICATION=1 SET_ALLOWLOOPBACK=1 ACCEPTHTTPCONNECTIONS=0` and listen on 127.0.0.1:5900. Locked or UAC sessions may render black."
};
/** Resolves guidance for supported gateway platforms, falling back to Linux-style setup. */
function getHostDesktopGuidance(platform) {
	return HOST_DESKTOP_GUIDANCE[platform] ?? HOST_DESKTOP_GUIDANCE.linux;
}
//#endregion
//#region src/gateway/desktop/managed-linux-audio.ts
const SINK_NAME = "openclaw_desktop";
const STARTUP_TIMEOUT_MS = 5e3;
const MAX_BUFFER_BYTES = 192e3;
const AUDIO_GUIDANCE = "Install pulseaudio and pulseaudio-utils for managed desktop audio.";
/** Private server/capture routing; apply to apps only after the server is ready. */
function managedLinuxAudioEnv(tempDir) {
	const runtimeDir = path.join(tempDir, "pulse");
	return {
		PULSE_SERVER: `unix:${path.join(runtimeDir, "native")}`,
		PULSE_SINK: SINK_NAME,
		PULSE_SOURCE: `${SINK_NAME}.monitor`,
		PULSE_RUNTIME_PATH: runtimeDir,
		PULSE_STATE_PATH: path.join(runtimeDir, "state"),
		PULSE_CLIENTCONFIG: path.join(runtimeDir, "client.conf")
	};
}
/** One server per desktop generation; capture processes exist only after source.start(). */
function createManagedLinuxAudio(params) {
	const { supervisor } = params;
	const env = {
		...params.env,
		...managedLinuxAudioEnv(params.tempDir)
	};
	const daemonEnv = {
		...env,
		LC_ALL: "C",
		PULSE_CONFIG: path.join(params.tempDir, "pulse", "daemon.conf")
	};
	delete daemonEnv.PULSE_SCRIPT;
	delete daemonEnv.PULSE_DLPATH;
	delete daemonEnv.NOTIFY_SOCKET;
	delete daemonEnv.PULSE_COOKIE;
	delete daemonEnv.PULSE_LOG;
	delete daemonEnv.PULSE_LOG_TARGET;
	const scopeKey = `managed-desktop-audio:${crypto.randomUUID()}`;
	const cleanup = supervisor.acquireScopeCleanup(scopeKey, { processTree: "required-all" });
	const ready = createDeferredCore();
	const serverReady = createDeferredCore();
	const daemonFailed = createDeferredCore();
	const captures = /* @__PURE__ */ new Set();
	const startupTimeoutMs = params.runtime?.startupTimeoutMs ?? STARTUP_TIMEOUT_MS;
	let active = true;
	let closing;
	let stderr = "";
	const result = { stop: () => stop() };
	const assertActive = () => {
		params.assertCurrent();
		if (!active) throw new Error(result.unavailableReason ?? "Managed desktop audio is stopped");
	};
	const stop = () => {
		if (closing) return closing;
		active = false;
		delete result.source;
		serverReady.reject(/* @__PURE__ */ new Error("Managed desktop audio stopped during startup"));
		const captureCleanup = Promise.allSettled([...captures].map((close) => close()));
		supervisor.cancelScope(scopeKey, "manual-cancel");
		closing = Promise.resolve().then(async () => {
			await launch;
			const outcomes = await captureCleanup;
			await cleanup();
			const failed = outcomes.find((outcome) => outcome.status === "rejected");
			if (failed) throw failed.reason;
		});
		return closing;
	};
	const unavailable = (error) => {
		const detail = error instanceof Error ? error.message : String(error);
		result.unavailableReason ??= `Managed desktop audio unavailable: ${detail}. ${AUDIO_GUIDANCE}`;
		stop().catch(() => {});
		daemonFailed.resolve();
	};
	serverReady.promise.catch(() => {});
	const timer = setTimeout(() => {
		unavailable(/* @__PURE__ */ new Error("private PulseAudio startup timed out"));
	}, startupTimeoutMs);
	timer.unref?.();
	const source = { async start(signal, assertAuthority) {
		const assertCaptureCurrent = () => {
			assertActive();
			signal.throwIfAborted();
			assertAuthority?.();
		};
		assertCaptureCurrent();
		const captureScope = `${scopeKey}:capture:${crypto.randomUUID()}`;
		const cleanupCapture = supervisor.acquireScopeCleanup(captureScope, { processTree: "required-all" });
		const firstData = createDeferredCore();
		let running = true;
		let stopped;
		let captureStderr = "";
		let captureRun;
		const stream = new Readable({
			read() {},
			highWaterMark: MAX_BUFFER_BYTES
		});
		stream.on("error", () => {});
		const stopCapture = () => {
			if (stopped) return stopped;
			running = false;
			clearTimeout(captureTimer);
			signal.removeEventListener("abort", abort);
			firstData.reject(/* @__PURE__ */ new Error("Desktop audio capture stopped"));
			stream.destroy();
			captureRun?.detachOutput?.();
			supervisor.cancelScope(captureScope, "manual-cancel");
			stopped = Promise.resolve().then(async () => {
				await captureLaunch;
				await cleanupCapture();
				captures.delete(stopCapture);
			});
			return stopped;
		};
		const failCapture = (error) => {
			if (!running) return;
			firstData.reject(error);
			stream.destroy(error);
			stopCapture().catch(() => {});
		};
		const abort = () => failCapture(/* @__PURE__ */ new Error("Desktop audio capture aborted"));
		const captureTimer = setTimeout(() => failCapture(/* @__PURE__ */ new Error("Desktop audio capture startup timed out")), startupTimeoutMs);
		captureTimer.unref?.();
		captures.add(stopCapture);
		signal.addEventListener("abort", abort, { once: true });
		stream.once("close", () => void stopCapture().catch(() => {}));
		const captureLaunch = Promise.resolve().then(async () => {
			try {
				captureRun = await supervisor.spawn({
					scopeKey: captureScope,
					mode: "child",
					argv: [
						"parec",
						`--server=${env.PULSE_SERVER}`,
						`--device=${SINK_NAME}.monitor`,
						"--raw",
						"--format=s16le",
						"--rate=48000",
						"--channels=2",
						"--channel-map=front-left,front-right",
						"--latency-msec=40"
					],
					env,
					exactEnv: true,
					stdinMode: "pipe-closed",
					captureOutput: false,
					assertCurrent: () => {
						assertCaptureCurrent();
						if (!running) throw new Error("Desktop audio capture stopped");
					},
					onStderr: (chunk) => {
						captureStderr = (captureStderr + chunk).slice(-4096);
					},
					onStdoutRaw: (chunk) => {
						if (!running || chunk.length === 0) return;
						if (stream.readableLength + chunk.length > MAX_BUFFER_BYTES) {
							failCapture(/* @__PURE__ */ new Error("Desktop audio viewer is not consuming audio"));
							return;
						}
						stream.push(chunk);
						firstData.resolve();
					}
				});
				captureRun.wait().then(() => failCapture(new Error(captureStderr.trim() || "Desktop audio capture exited")), (error) => failCapture(error instanceof Error ? error : new Error(String(error))));
			} catch (error) {
				failCapture(error instanceof Error ? error : new Error(String(error)));
			}
		});
		try {
			await firstData.promise;
			await captureLaunch;
			assertCaptureCurrent();
			if (!running) throw new Error("Desktop audio capture stopped during startup");
			return {
				stream,
				stop: stopCapture
			};
		} catch (error) {
			await stopCapture();
			throw error;
		} finally {
			clearTimeout(captureTimer);
		}
	} };
	const launch = Promise.resolve().then(async () => {
		try {
			const detect = params.runtime?.detectBinary ?? detectBinary;
			for (const binary of ["pulseaudio", "parec"]) {
				if (!await detect(binary)) throw new Error(`${binary} is not installed`);
				assertActive();
			}
			const runtimeDir = path.join(params.tempDir, "pulse");
			await fs.mkdir(runtimeDir, {
				recursive: true,
				mode: 448
			});
			await fs.writeFile(path.join(runtimeDir, "client.conf"), "autospawn = no\n", { mode: 384 });
			await fs.writeFile(path.join(runtimeDir, "daemon.conf"), "local-server-type = user\n", { mode: 384 });
			const script = path.join(runtimeDir, "default.pa");
			await fs.writeFile(script, [
				".fail",
				`load-module module-null-sink sink_name=${SINK_NAME} format=s16le rate=48000 channels=2 channel_map=front-left,front-right`,
				`set-default-sink ${SINK_NAME}`,
				`set-default-source ${SINK_NAME}.monitor`,
				"load-module module-native-protocol-unix auth-anonymous=1 auth-cookie-enabled=0",
				""
			].join("\n"), { mode: 384 });
			assertActive();
			(await supervisor.spawn({
				scopeKey,
				mode: "child",
				argv: [
					"pulseaudio",
					"--daemonize=no",
					"--fail=yes",
					"--use-pid-file=no",
					"--exit-idle-time=-1",
					"--disable-shm=yes",
					"--system=no",
					"--realtime=no",
					"--high-priority=no",
					"--disallow-exit=yes",
					"--disallow-module-loading=yes",
					"--log-target=stderr",
					"--log-level=info",
					"-n",
					"--file",
					script
				],
				env: daemonEnv,
				exactEnv: true,
				assertCurrent: assertActive,
				stdinMode: "pipe-closed",
				captureOutput: false,
				onStderr: (chunk) => {
					stderr = (stderr + chunk).slice(-4096);
					if (stderr.includes("Daemon startup complete.")) serverReady.resolve();
				}
			})).wait().then(() => unavailable(new Error(stderr.trim() || "private PulseAudio exited")), unavailable);
			await serverReady.promise;
			assertActive();
			result.source = source;
			result.failed = daemonFailed.promise;
		} catch (error) {
			unavailable(error);
		} finally {
			clearTimeout(timer);
			ready.resolve(result);
		}
	});
	return {
		ready: ready.promise.then(async (value) => {
			if (closing) await closing;
			return value;
		}),
		stop
	};
}
//#endregion
//#region src/gateway/desktop/managed-linux.ts
const MANAGED_DISPLAY_FIRST = 99;
const MANAGED_DISPLAY_LAST = 199;
const MANAGED_RESTART_LIMIT = 3;
const MANAGED_RESTART_WINDOW_MS = 3e5;
const AUDIO_RESTART_LIMIT = 3;
const AUDIO_RESTART_WINDOW_MS = 3e5;
const MANAGED_READINESS_TIMEOUT_MS = 15e3;
const MANAGED_READINESS_POLL_MS = 100;
const STDERR_TAIL_CHARS = 4096;
function buildTigerVncArgv(resources) {
	return [
		"Xtigervnc",
		`:${resources.display}`,
		"-geometry",
		"1920x1080",
		"-depth",
		"24",
		"-localhost",
		"yes",
		"-rfbport",
		String(resources.port),
		"-SecurityTypes",
		"VncAuth",
		"-PasswordFile",
		resources.passwordFile,
		"-AlwaysShared",
		"-AcceptSetDesktopSize",
		"-nolisten",
		"tcp",
		"-ac"
	];
}
function chooseDisplayNumber(socketNames) {
	const occupied = new Set(socketNames.flatMap((name) => {
		const match = /^X(\d+)$/u.exec(name);
		return match ? [Number.parseInt(match[1] ?? "", 10)] : [];
	}));
	for (let display = MANAGED_DISPLAY_FIRST; display <= MANAGED_DISPLAY_LAST; display += 1) if (!occupied.has(display)) return display;
	throw new Error(`managed Linux desktop could not find an unused X display between :${MANAGED_DISPLAY_FIRST} and :${MANAGED_DISPLAY_LAST}`);
}
function appendTail(current, chunk) {
	return (current + chunk).slice(-4096);
}
function lastStderrLine(stderr) {
	return stderr.split(/\r?\n/u).findLast((line) => line.trim())?.trim();
}
async function readDisplaySocketNames(socketDir) {
	try {
		return await fs.readdir(socketDir);
	} catch (error) {
		if (error.code === "ENOENT") return [];
		throw error;
	}
}
function binaryError(binary, error) {
	const reason = error instanceof Error ? error.message : String(error);
	return new Error(`managed Linux desktop could not start ${binary}: ${reason}. ${getHostDesktopGuidance("linux")}`, { cause: error });
}
function createManagedLinuxDesktop(params = {}) {
	const supervisor = params.supervisor ?? getProcessSupervisor();
	const nowMs = params.runtime?.nowMs ?? Date.now;
	const createAudio = params.runtime?.createAudio ?? createManagedLinuxAudio;
	const probeRfb = params.runtime?.probeRfb ?? probeRfbServer;
	const randomBytes = params.runtime?.randomBytes ?? crypto.randomBytes;
	const readinessPollMs = params.runtime?.readinessPollMs ?? MANAGED_READINESS_POLL_MS;
	const readinessTimeoutMs = params.runtime?.readinessTimeoutMs ?? MANAGED_READINESS_TIMEOUT_MS;
	const runPasswordTool = params.runtime?.runPasswordTool ?? runCommandBuffered;
	const wait = params.runtime?.sleep ?? ((ms) => sleepWithAbort(ms, void 0, { ref: false }));
	const tempRoot = params.runtime?.tempRoot ?? os.tmpdir();
	const pickPort = params.runtime?.tryListenOnPort ?? tryListenOnPort;
	const x11SocketDir = params.runtime?.x11SocketDir ?? "/tmp/.X11-unix";
	const scopeKey = `host-desktop-managed-linux:${crypto.randomUUID()}`;
	let status = { state: "not-started" };
	let resources;
	let pair;
	let startPromise;
	let stopPromise;
	let stopProcesses;
	let audioOwner;
	let epoch = 0;
	let stopping = false;
	let stderrTail = "";
	let restartTimes = [];
	let audioRestartTimes = [];
	const activeWaits = /* @__PURE__ */ new Set();
	const monitorTasks = /* @__PURE__ */ new Set();
	const isPairCurrent = (current) => !stopping && pair === current && current.current && !current.vnc.activity.resultSettled && !current.bus.activity.resultSettled && !current.session.activity.resultSettled;
	const publicResult = (active) => ({
		attachment: {
			kind: "tcp",
			host: "127.0.0.1",
			port: active.port
		},
		auth: "vnc-password",
		vncPassword: active.password,
		resolveAudio: () => {
			if (resources !== active) return;
			if (!pair || !isPairCurrent(pair)) throw new Error("managed Linux desktop is restarting; retry when it is ready");
			return pair.audio.source;
		},
		get audioUnavailableReason() {
			return resources === active && pair && isPairCurrent(pair) ? pair.audio.unavailableReason : void 0;
		}
	});
	const removeResources = async () => {
		const current = resources;
		resources = void 0;
		if (current) await fs.rm(current.tempDir, {
			recursive: true,
			force: true
		});
	};
	const markFailed = (error) => {
		const coordinates = resources ? {
			display: resources.display,
			port: resources.port
		} : status.state === "starting" || status.state === "failed" ? {
			display: status.display,
			port: status.port
		} : {};
		status = {
			state: "failed",
			error: error.message,
			...coordinates
		};
		params.onFailed?.(error.message);
	};
	const prepareResources = async () => {
		const tempDir = await fs.mkdtemp(path.join(tempRoot, "openclaw-managed-desktop-"));
		await fs.chmod(tempDir, 448);
		const plaintextFile = path.join(tempDir, "password.txt");
		const passwordFile = path.join(tempDir, "passwd");
		try {
			const password = randomBytes(12).toString("base64url").slice(0, 8);
			registerSecretValueForRedaction(password);
			await fs.writeFile(plaintextFile, password, {
				mode: 384,
				flag: "wx"
			});
			const passwordInput = await fs.readFile(plaintextFile);
			const filtered = await runPasswordTool(["tigervncpasswd", "-f"], {
				input: passwordInput,
				maxOutputBytes: {
					stdout: 64,
					stderr: 4096
				},
				timeoutMs: 1e4
			});
			if (filtered.termination !== "exit" || filtered.code !== 0 || filtered.stdout.length === 0) throw binaryError("tigervncpasswd", (filtered.error?.message ?? filtered.stderr.toString("utf8").trim()) || `exit code ${filtered.code ?? "none"}`);
			await fs.writeFile(passwordFile, filtered.stdout, {
				mode: 384,
				flag: "wx"
			});
			await fs.rm(plaintextFile, { force: true });
			const port = await pickPort({
				port: 0,
				host: "127.0.0.1",
				exclusive: true
			});
			const display = chooseDisplayNumber(await readDisplaySocketNames(x11SocketDir));
			const env = {
				...process.env,
				DISPLAY: `:${display}`,
				DBUS_SESSION_BUS_ADDRESS: `unix:path=${path.join(tempDir, "bus")}`,
				XDG_SESSION_TYPE: "x11"
			};
			delete env.WAYLAND_DISPLAY;
			delete env.SESSION_MANAGER;
			delete env.AT_SPI_BUS_ADDRESS;
			delete env.DBUS_SESSION_BUS_PID;
			return {
				tempDir,
				passwordFile,
				password,
				display,
				port,
				env: Object.freeze(env)
			};
		} catch (error) {
			await fs.rm(tempDir, {
				recursive: true,
				force: true
			});
			throw error;
		}
	};
	const waitUntilReady = async (active, activeEpoch) => {
		const deadline = nowMs() + readinessTimeoutMs;
		let lastProbe = "unreachable";
		for (;;) {
			if (activeEpoch !== epoch || stopping) break;
			const probe = await probeRfb({
				host: "127.0.0.1",
				port: active.port,
				timeoutMs: Math.min(1e3, readinessTimeoutMs)
			});
			lastProbe = probe.kind;
			if (probe.kind === "rfb" && probe.securityTypes.includes(2)) return;
			if (nowMs() >= deadline) break;
			await wait(readinessPollMs);
		}
		if (activeEpoch !== epoch || stopping) throw new Error("managed Linux desktop stopped during startup");
		throw new Error(`managed Linux desktop did not become ready on 127.0.0.1:${active.port} within ${readinessTimeoutMs}ms (last probe: ${lastProbe})`);
	};
	const stopPair = (current) => {
		if (current?.stopPromise) return current.stopPromise;
		if (current) current.current = false;
		const retiringAudio = audioOwner;
		const audioStopped = retiringAudio?.stop();
		audioStopped?.catch(() => void 0);
		const stopped = Promise.resolve().then(async () => {
			const failure = (await Promise.allSettled([...current?.computerLeases ?? []].map(async (lease) => {
				await lease.onStop();
				current?.computerLeases.delete(lease);
			}))).find((outcome) => outcome.status === "rejected");
			await audioStopped;
			if (audioOwner === retiringAudio) audioOwner = void 0;
			if (failure) throw failure.reason;
			supervisor.cancelScope(scopeKey, "manual-cancel");
			const cleanup = stopProcesses;
			await cleanup?.();
			await Promise.allSettled(activeWaits);
			if (stopProcesses === cleanup) stopProcesses = void 0;
			if (pair === current) pair = void 0;
		});
		if (current) {
			current.stopPromise = stopped;
			stopped.catch(() => {
				current.stopPromise = void 0;
			});
		}
		return stopped;
	};
	const waitForRun = (run) => {
		const pending = run.wait().catch((error) => ({
			reason: "spawn-error",
			exitCode: null,
			exitSignal: null,
			durationMs: Math.max(0, nowMs() - run.startedAtMs),
			stdout: "",
			stderr: error instanceof Error ? error.message : String(error),
			timedOut: false,
			noOutputTimedOut: false
		}));
		activeWaits.add(pending);
		pending.finally(() => activeWaits.delete(pending));
		return pending;
	};
	const spawnRun = async (binary, argv, activeEpoch, env, onStdout) => {
		try {
			return await supervisor.spawn({
				scopeKey,
				mode: "child",
				argv,
				...env ? { env } : {},
				assertCurrent: () => {
					if (activeEpoch !== epoch || stopping) throw new Error("managed Linux desktop stopped during startup");
				},
				...onStdout ? { onStdout } : {},
				stdinMode: "pipe-closed",
				maxCapturedOutputChars: STDERR_TAIL_CHARS,
				onStderr: (chunk) => {
					stderrTail = appendTail(stderrTail, chunk);
				}
			});
		} catch (error) {
			throw binaryError(binary, error);
		}
	};
	const describeExit = (binary, exit) => {
		return lastStderrLine(exit.stderr) ?? lastStderrLine(stderrTail) ?? `${binary} exited with code ${exit.exitCode ?? "none"}`;
	};
	const startPair = async (active, activeEpoch) => {
		status = {
			state: "starting",
			display: active.display,
			port: active.port
		};
		stopProcesses = supervisor.acquireScopeCleanup(scopeKey, { processTree: "required-all" });
		const vnc = await spawnRun("Xtigervnc", buildTigerVncArgv(active), activeEpoch);
		const vncExit = waitForRun(vnc);
		try {
			await Promise.race([waitUntilReady(active, activeEpoch), vncExit.then((exit) => {
				throw new Error(describeExit("Xtigervnc", exit));
			})]);
			if (activeEpoch !== epoch || stopping) throw new Error("managed Linux desktop stopped during startup");
			let audioPair = null;
			audioOwner = createAudio({
				supervisor,
				tempDir: active.tempDir,
				env: active.env,
				assertCurrent: () => {
					if (activeEpoch !== epoch || stopping || audioPair && !isPairCurrent(audioPair)) throw new Error("managed Linux desktop stopped");
				}
			});
			const audio = await audioOwner.ready;
			const env = audio.source ? Object.freeze({
				...active.env,
				...managedLinuxAudioEnv(active.tempDir)
			}) : active.env;
			const busReady = createDeferredCore();
			let busOutput = "";
			await fs.rm(path.join(active.tempDir, "bus"), { force: true });
			const bus = await spawnRun("dbus-daemon", [
				"dbus-daemon",
				"--session",
				"--nofork",
				"--nopidfile",
				"--print-address=1",
				`--address=${active.env.DBUS_SESSION_BUS_ADDRESS}`
			], activeEpoch, env, (chunk) => {
				busOutput = appendTail(busOutput, chunk);
				if (busOutput.includes("\n")) busReady.resolve();
			});
			const busExit = waitForRun(bus);
			await raceWithTimeout(Promise.race([
				busReady.promise,
				busExit.then((exit) => {
					throw new Error(describeExit("dbus-daemon", exit));
				}),
				vncExit.then((exit) => {
					throw new Error(describeExit("Xtigervnc", exit));
				})
			]), readinessTimeoutMs, () => {
				throw new Error("managed Linux desktop D-Bus session did not become ready");
			});
			const session = await spawnRun("startxfce4", ["startxfce4"], activeEpoch, env);
			const nextPair = {
				current: true,
				vnc,
				bus,
				session,
				vncExit,
				busExit,
				sessionExit: waitForRun(session),
				computerLeases: /* @__PURE__ */ new Set(),
				audio,
				env
			};
			audioPair = nextPair;
			pair = nextPair;
			status = {
				state: "running",
				display: active.display,
				port: active.port
			};
			return nextPair;
		} catch (error) {
			await stopPair(void 0);
			throw error;
		}
	};
	const monitorPair = (current, active, activeEpoch) => {
		const desktopExit = Promise.race([
			current.vncExit.then((exit) => describeExit("Xtigervnc", exit)),
			current.busExit.then((exit) => describeExit("dbus-daemon", exit)),
			current.sessionExit.then((exit) => describeExit("startxfce4", exit))
		]);
		const stillOwned = () => pair === current && activeEpoch === epoch && !stopping;
		const task = (async () => {
			for (;;) {
				const audio = current.audio;
				const failure = await Promise.race([desktopExit, ...audio.failed ? [audio.failed.then(() => audio.unavailableReason ?? "private PulseAudio exited")] : []]);
				if (!stillOwned()) return;
				if (isPairCurrent(current) && audio.failed) {
					const disableAudio = (reason) => {
						const retiringAudio = audioOwner ?? audio;
						current.audio = {
							stop: () => retiringAudio.stop(),
							unavailableReason: `Managed desktop audio unavailable: ${reason}. Healthy desktop applications remain running. Check pulseaudio and pulseaudio-utils, then restart the managed desktop if audio is needed.`
						};
					};
					try {
						await audio.stop();
						if (!stillOwned()) return;
						if (isPairCurrent(current)) {
							const now = nowMs();
							audioRestartTimes = audioRestartTimes.filter((startedAt) => now - startedAt < AUDIO_RESTART_WINDOW_MS);
							if (audioRestartTimes.length >= AUDIO_RESTART_LIMIT) {
								disableAudio(`${AUDIO_RESTART_LIMIT} restarts within 5 minutes: ${failure}`);
								continue;
							}
							audioRestartTimes.push(now);
							audioOwner = createAudio({
								supervisor,
								tempDir: active.tempDir,
								env: active.env,
								assertCurrent: () => {
									if (!stillOwned() || !isPairCurrent(current)) throw new Error("managed Linux desktop stopped");
								}
							});
							const recovered = await audioOwner.ready;
							if (!stillOwned()) return;
							current.audio = recovered;
							if (isPairCurrent(current)) {
								if (!recovered.source) {
									await recovered.stop();
									disableAudio(recovered.unavailableReason ?? "private PulseAudio recovery failed");
								}
								continue;
							}
						}
					} catch (error) {
						if (!stillOwned()) return;
						if (isPairCurrent(current)) {
							disableAudio(error instanceof Error ? error.message : String(error));
							continue;
						}
					}
				}
				const now = nowMs();
				restartTimes = restartTimes.filter((startedAt) => now - startedAt < MANAGED_RESTART_WINDOW_MS);
				if (restartTimes.length >= MANAGED_RESTART_LIMIT) {
					await stopPair(current);
					if (activeEpoch === epoch && !stopping) markFailed(/* @__PURE__ */ new Error(`managed Linux desktop failed after ${MANAGED_RESTART_LIMIT} restarts within 5 minutes: ${failure}`));
					return;
				}
				restartTimes.push(now);
				status = {
					state: "starting",
					display: active.display,
					port: active.port
				};
				await stopPair(current);
				if (activeEpoch !== epoch || stopping) return;
				const restarted = await startPair(active, activeEpoch);
				monitorPair(restarted, active, activeEpoch);
				return;
			}
		})().catch(async (error) => {
			try {
				await stopPair(current);
			} finally {
				if (activeEpoch === epoch && !stopping) markFailed(error instanceof Error ? error : new Error(String(error)));
			}
		});
		monitorTasks.add(task);
		task.finally(() => monitorTasks.delete(task)).catch(() => void 0);
	};
	const start = async (activeEpoch) => {
		try {
			resources = await prepareResources();
			if (activeEpoch !== epoch || stopping) throw new Error("managed Linux desktop stopped during startup");
			const started = await startPair(resources, activeEpoch);
			monitorPair(started, resources, activeEpoch);
			return resources;
		} catch (error) {
			if (activeEpoch === epoch && !stopping) markFailed(error instanceof Error ? error : new Error(String(error)));
			throw error;
		}
	};
	return {
		async acquire() {
			if (stopping || stopPromise) throw new Error("managed Linux desktop is stopping");
			if (status.state === "failed") throw new Error(status.error);
			if (status.state === "running" && resources && pair && isPairCurrent(pair)) return publicResult(resources);
			if (monitorTasks.size > 0) throw new Error("managed Linux desktop is restarting; retry when it is ready");
			if (!startPromise) {
				stopping = false;
				restartTimes = [];
				audioRestartTimes = [];
				stderrTail = "";
				const activeEpoch = ++epoch;
				startPromise = start(activeEpoch).finally(() => {
					startPromise = void 0;
				});
			}
			return publicResult(await startPromise);
		},
		async acquireComputer(request) {
			const current = pair;
			if (status.state !== "running" || !resources || !current || !isPairCurrent(current)) throw new Error("managed Linux desktop is unavailable for computer control");
			const lease = { onStop: () => request.onStop() };
			current.computerLeases.add(lease);
			return {
				env: current.env,
				isCurrent: () => isPairCurrent(current) && current.computerLeases.has(lease),
				release: () => {
					current.computerLeases.delete(lease);
				}
			};
		},
		stop() {
			if (stopPromise) return stopPromise;
			stopping = true;
			++epoch;
			const failed = status.state === "failed" ? status : void 0;
			const stopped = Promise.resolve().then(async () => {
				await stopPair(pair);
				await startPromise?.catch(() => void 0);
				await Promise.all(monitorTasks);
				await stopPair(pair);
				await removeResources();
				startPromise = void 0;
				restartTimes = [];
				audioRestartTimes = [];
				status = failed ?? { state: "not-started" };
				stopping = false;
			});
			stopPromise = stopped;
			stopped.finally(() => {
				stopPromise = void 0;
			}).catch(() => void 0);
			return stopped;
		},
		status() {
			return { ...status };
		}
	};
}
//#endregion
//#region src/gateway/desktop/host-source.ts
const DEFAULT_HOST_DESKTOP_PORT = 5900;
const HOST_DESKTOP_PROBE_TIMEOUT_MS = 1500;
function nonRfbError(port) {
	return `desktop.host.port ${port} is occupied by a non-VNC service; configure desktop.host.port for the loopback VNC server, then retry`;
}
function unavailableError(port, platform) {
	return `gateway host desktop is unavailable at 127.0.0.1:${port}. ${getHostDesktopGuidance(platform)}`;
}
function managedPlatformError(platform) {
	return `desktop.host.managed is available only on Linux; disable it on ${platform} or configure desktop.host.port for an existing loopback VNC server`;
}
function managedInspection(managedStatus) {
	const status = {
		enabled: true,
		state: "managed",
		managedState: managedStatus.state,
		port: DEFAULT_HOST_DESKTOP_PORT
	};
	if (managedStatus.state !== "not-started" && managedStatus.state !== "unknown") {
		status.port = managedStatus.port ?? DEFAULT_HOST_DESKTOP_PORT;
		if (managedStatus.display !== void 0) status.display = managedStatus.display;
	}
	if (managedStatus.state === "running") return {
		status: {
			...status,
			security: "VncAuth"
		},
		detail: `managed (running, display :${managedStatus.display}, port ${managedStatus.port}, security: VncAuth)`
	};
	if (managedStatus.state === "failed") return {
		status: {
			...status,
			error: managedStatus.error
		},
		detail: `managed (failed: ${managedStatus.error})`,
		unavailableReason: "unsupported"
	};
	return {
		status,
		detail: managedStatus.state === "unknown" ? "managed (configured; runtime state is available from the running Gateway status)" : managedStatus.state === "starting" ? "managed (starting)" : "managed (not started)"
	};
}
/** Probes the configured host desktop without reading or exposing password material. */
async function inspectHostDesktop(params) {
	if (params.config?.enabled !== true) return {
		status: {
			enabled: false,
			state: "disabled",
			port: params.config?.port ?? DEFAULT_HOST_DESKTOP_PORT
		},
		detail: "disabled; enable the Desktop lab with desktop.host.enabled=true"
	};
	return inspectConfiguredHostDesktop(params);
}
/** Setup inspection discovers a source without enabling access or starting a desktop. */
async function inspectHostDesktopSetup(params) {
	const inspection = await inspectConfiguredHostDesktop(params);
	if (inspection.status.state === "attached") return { state: "ready" };
	if (inspection.status.state === "managed") return { state: "managed" };
	return {
		state: inspection.unavailableReason === "not-listening" ? "needs-server" : "unsupported",
		detail: inspection.detail
	};
}
async function inspectConfiguredHostDesktop(params) {
	const port = params.config?.port ?? DEFAULT_HOST_DESKTOP_PORT;
	const platform = params.platform ?? process.platform;
	const probe = await (params.probeRfb ?? probeRfbServer)({
		host: "127.0.0.1",
		port,
		timeoutMs: HOST_DESKTOP_PROBE_TIMEOUT_MS
	});
	if (probe.kind === "unreachable" || probe.kind === "timeout") {
		if (params.config?.port === void 0 && params.config?.managed === true) {
			if (platform !== "linux") return {
				status: {
					enabled: true,
					state: "unavailable",
					port
				},
				detail: managedPlatformError(platform),
				unavailableReason: "unsupported"
			};
			return managedInspection(params.managedDesktop?.status() ?? { state: "unknown" });
		}
		return {
			status: {
				enabled: true,
				state: "unavailable",
				port
			},
			detail: unavailableError(port, platform),
			unavailableReason: "not-listening"
		};
	}
	if (probe.kind === "not-rfb") return {
		status: {
			enabled: true,
			state: "unavailable",
			port
		},
		detail: nonRfbError(port),
		unavailableReason: "not-rfb"
	};
	const auth = classifyRfbSecurity(probe.securityTypes);
	const security = auth === "unsupported" ? probe.securityTypes.includes(19) ? "VeNCrypt" : "unsupported" : {
		"vnc-password": "VncAuth",
		"ard-account": "ARD",
		none: "None"
	}[auth];
	if (auth === "vnc-password" || auth === "ard-account") return {
		status: {
			enabled: true,
			state: "attached",
			port,
			security
		},
		detail: `attached (127.0.0.1:${port}, security: ${security})`
	};
	const detail = auth === "none" ? `unavailable: unauthenticated VNC server at 127.0.0.1:${port}; require a password-protected VncAuth server, then retry` : `unavailable: ${security} security is not supported; configure a VncAuth server and desktop.host.passwordFile, then retry`;
	return {
		status: {
			enabled: true,
			state: "unavailable",
			port,
			security
		},
		detail,
		unavailableReason: "unsupported"
	};
}
/** Creates the host acquisition hook consumed by the source-agnostic desktop registry. */
function createHostDesktopSource(params) {
	const port = params.config.port ?? DEFAULT_HOST_DESKTOP_PORT;
	const platform = params.platform ?? process.platform;
	const probeRfb = params.probeRfb ?? probeRfbServer;
	const managedDesktop = params.managedDesktop ?? (params.config.managed === true && platform === "linux" ? createManagedLinuxDesktop() : void 0);
	let selectedManagedDesktop = false;
	const acquireAttached = async (probe) => {
		const security = classifyRfbSecurity(probe.securityTypes);
		if (security === "none") throw new Error(`refusing unauthenticated VNC server on 127.0.0.1:${port}; require a password-protected VncAuth server, then retry`);
		if (security === "unsupported") {
			const name = probe.securityTypes.includes(19) ? "VeNCrypt" : "the offered VNC security";
			throw new Error(`${name} is not supported; configure a VncAuth server and desktop.host.passwordFile, then retry`);
		}
		let vncPassword;
		if (params.config.passwordFile) {
			try {
				vncPassword = (await fs.readFile(params.config.passwordFile, "utf8")).replace(/[\r\n]+$/u, "");
			} catch (error) {
				const reason = error instanceof Error ? error.message : String(error);
				throw new Error(`could not read desktop.host.passwordFile ${params.config.passwordFile}: ${reason}; fix the absolute path or remove desktop.host.passwordFile so the UI can prompt`, { cause: error });
			}
			if (!vncPassword) throw new Error("desktop.host.passwordFile is empty; write the VNC password or remove desktop.host.passwordFile so the UI can prompt");
			registerSecretValueForRedaction(vncPassword);
		}
		return {
			attachment: {
				kind: "tcp",
				host: "127.0.0.1",
				port
			},
			auth: security,
			...vncPassword ? { vncPassword } : {}
		};
	};
	const acquire = async (assertCurrent) => {
		assertCurrent?.();
		selectedManagedDesktop = false;
		const probe = await probeRfb({
			host: "127.0.0.1",
			port,
			timeoutMs: HOST_DESKTOP_PROBE_TIMEOUT_MS
		});
		assertCurrent?.();
		if (probe.kind === "unreachable" || probe.kind === "timeout") {
			if (params.config.port === void 0 && params.config.managed === true) {
				if (platform !== "linux") throw new Error(managedPlatformError(platform));
				if (!managedDesktop) throw new Error("managed Linux desktop lifecycle is unavailable; retry");
				const acquired = await managedDesktop.acquire();
				assertCurrent?.();
				selectedManagedDesktop = true;
				return acquired;
			}
			throw new Error(unavailableError(port, platform));
		}
		if (probe.kind === "not-rfb") throw new Error(nonRfbError(port));
		return await acquireAttached(probe);
	};
	return {
		acquire,
		acquireComputer: async (computerParams) => {
			if (!selectedManagedDesktop || !managedDesktop) throw new Error("COMPUTER_HOST_UNAVAILABLE: the selected host desktop is an external VNC server; its local computer session is unknown");
			return await managedDesktop.acquireComputer(computerParams);
		},
		teardown: managedDesktop ? () => {
			selectedManagedDesktop = false;
			return managedDesktop.stop();
		} : void 0,
		inspect: () => inspectHostDesktop({
			config: params.config,
			platform,
			managedDesktop,
			probeRfb
		})
	};
}
/** Combines host acquisition, registry ownership, and observer-token minting. */
function createHostDesktopService(params) {
	const platform = params.platform ?? process.platform;
	let current;
	let nextOwnerEpoch = 0;
	const isCurrent = (runtime) => {
		const config = params.getConfig();
		return current === runtime && !runtime.controller.signal.aborted && config?.enabled === true && config.managed === runtime.config.managed && config.port === runtime.config.port && config.passwordFile === runtime.config.passwordFile;
	};
	const assertCurrent = (runtime) => {
		if (!isCurrent(runtime)) throw new Error("gateway host desktop configuration changed; retry");
	};
	const reconcileRuntimePolicy = async () => {
		const runtime = current;
		if (!runtime || isCurrent(runtime)) return;
		runtime.controller.abort();
		if (!runtime.stopping) runtime.stopping = params.registry.stop("host", runtime.ownerEpoch).then(() => {
			if (current === runtime) current = void 0;
		}, (error) => {
			runtime.stopping = void 0;
			throw error;
		});
		await runtime.stopping;
	};
	const resolveRuntime = async () => {
		await reconcileRuntimePolicy();
		const config = params.getConfig();
		if (config?.enabled !== true) return;
		if (!current) {
			const ownerEpoch = nextOwnerEpoch++;
			const managedDesktop = params.managedDesktop ?? (config.managed === true && platform === "linux" ? createManagedLinuxDesktop({ onFailed: () => {
				params.registry.stop("host", ownerEpoch);
			} }) : void 0);
			const snapshot = { ...config };
			current = {
				config: snapshot,
				ownerEpoch,
				controller: new AbortController(),
				source: createHostDesktopSource({
					config: snapshot,
					platform,
					...managedDesktop ? { managedDesktop } : {}
				})
			};
		}
		return current;
	};
	const acquire = async () => {
		const runtime = await resolveRuntime();
		if (!runtime) throw new Error("gateway host desktop is disabled; enable the Desktop lab (config: desktop.host.enabled=true)");
		assertCurrent(runtime);
		const acquired = await params.registry.acquire({
			sourceKey: "host",
			ownerEpoch: runtime.ownerEpoch,
			start: () => runtime.source.acquire(() => assertCurrent(runtime)),
			...runtime.source.teardown ? { teardown: runtime.source.teardown } : {}
		});
		assertCurrent(runtime);
		return {
			acquired,
			runtime
		};
	};
	return {
		async observe(observeParams) {
			const { acquired, runtime } = await acquire();
			assertCurrent(runtime);
			const auth = acquired.auth;
			const audio = acquired.resolveAudio?.();
			if (!auth) throw new Error("gateway host desktop authentication state is unavailable; retry observe");
			let preauth;
			if (auth === "ard-account") {
				const username = observeParams.credentials?.username?.trim() ?? "";
				const password = observeParams.credentials?.password ?? "";
				if (!username || !password) throw new HostDesktopCredentialsRequiredError();
				registerSecretValueForRedaction(password);
				preauth = {
					auth: "ard-account",
					credentials: {
						username,
						password
					}
				};
			}
			if (audio && auth === "vnc-password" && acquired.vncPassword) preauth = {
				auth,
				credentials: { password: acquired.vncPassword }
			};
			const minted = mintDesktopObserverToken({
				sourceKey: "host",
				ownerEpoch: runtime.ownerEpoch,
				control: observeParams.control,
				requester: {
					...observeParams.requester,
					signal: observeParams.requester?.signal ? AbortSignal.any([runtime.controller.signal, observeParams.requester.signal]) : runtime.controller.signal,
					isCurrent: () => isCurrent(runtime) && observeParams.requester?.isCurrent() !== false
				},
				attachment: acquired.attachment,
				...audio ? { audio } : {},
				...preauth ? { preauth } : {}
			});
			return {
				transport: "rfb",
				wsPath: `/desktop/observe?token=${minted.token}`,
				expiresAtMs: minted.expiresAtMs,
				control: observeParams.control,
				auth,
				...minted.audio ? {
					audio: minted.audio,
					preauthenticated: true
				} : {},
				...!audio && acquired.audioUnavailableReason ? { audioUnavailableReason: "setup-unavailable" } : {},
				...auth === "vnc-password" && acquired.vncPassword && !preauth ? { vncPassword: acquired.vncPassword } : {}
			};
		},
		async acquireComputer(computerParams) {
			const { runtime } = await acquire();
			assertCurrent(runtime);
			const activity = params.registry.retainActivity("host", runtime.ownerEpoch);
			if (!activity) throw new Error("COMPUTER_HOST_UNAVAILABLE: the host desktop stopped during acquisition");
			try {
				const computer = await runtime.source.acquireComputer(computerParams);
				if (!isCurrent(runtime) || !activity.isCurrent() || !computer.isCurrent()) {
					computer.release();
					throw new Error("COMPUTER_HOST_UNAVAILABLE: the host desktop stopped during acquisition");
				}
				return {
					env: computer.env,
					isCurrent: () => isCurrent(runtime) && activity.isCurrent() && computer.isCurrent(),
					release() {
						computer.release();
						activity.release();
					}
				};
			} catch (error) {
				activity.release();
				throw error;
			}
		},
		async status() {
			for (;;) {
				const runtime = await resolveRuntime();
				if (!runtime) return (await inspectHostDesktop({
					config: params.getConfig(),
					platform
				})).status;
				const inspection = await runtime.source.inspect();
				if (isCurrent(runtime)) return inspection.status;
			}
		},
		reconcileRuntimePolicy
	};
}
//#endregion
export { inspectHostDesktopSetup as i, createHostDesktopSource as n, inspectHostDesktop as r, createHostDesktopService as t };
