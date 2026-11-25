import { d as resolveManagedCodexAppServerStartOptions, f as resolveManagedCodexNativeCommand, o as isManagedCodexDesktopCommand } from "./managed-binary-ARII6CR1.mjs";
import { i as resolveCodexWorkerAuthHelper, t as deriveCodexWorkerConfigurationVersion } from "./node-app-server-command-L0wPsY9S.mjs";
import { o as closeCodexAppServerTransportAndWait, t as createStdioTransport } from "./transport-stdio-CRWvp1Xm.mjs";
import { n as runCodexNodeExecServer } from "./node-exec-server.runtime-DvKVI7T0.mjs";
import { isRecord } from "openclaw/plugin-sdk/string-coerce-runtime";
import { createHash, randomUUID } from "node:crypto";
import { createBoundedLineFramer, killProcessTree } from "openclaw/plugin-sdk/process-runtime";
import path from "node:path";
import { resolveStateDir } from "openclaw/plugin-sdk/state-paths";
import fs from "node:fs/promises";
import { racePromiseWithAbortSignal } from "openclaw/plugin-sdk/time-runtime";
import { once } from "node:events";
import { createDeferred } from "openclaw/plugin-sdk/extension-shared";
import { sanitizeEnvVars } from "openclaw/plugin-sdk/sandbox";
import { WebSocket, WebSocketServer } from "ws";
// extensions/codex/src/node-app-server-process-owner.ts
/** Keeps worker placement custody until native process exit is observed. */
function createCodexNodeAppServerProcessOwner(params) {
	let settled = false;
	let settling;
	let stopping;
	const settle = async (confirmedExit = false) => {
		if (settled) return;
		const child = params.child();
		if (!confirmedExit && child && child.exitCode === null && child.signalCode === null) return;
		if (settling) return await settling;
		settling = (async () => {
			await params.release();
			params.activeProcesses.delete(stop);
			settled = true;
		})();
		try {
			await settling;
		} catch (error) {
			settling = void 0;
			throw error;
		}
	};
	const stop = async () => {
		if (stopping) return await stopping;
		stopping = (async () => {
			params.unsubscribe();
			const child = params.child();
			let confirmedExit = false;
			if (child && child.exitCode === null && child.signalCode === null) {
				if (process.platform === "win32" && child.pid) killProcessTree(child.pid, { graceMs: 1e3 });
				if (!(await closeCodexAppServerTransportAndWait(child, { exitTimeoutMs: 5e3 })).exited) throw new Error("Codex node app-server process did not terminate");
				confirmedExit = true;
			}
			await settle(confirmedExit);
		})();
		try {
			await stopping;
		} catch (error) {
			stopping = void 0;
			throw error;
		}
	};
	const observe = () => {
		params.activeProcesses.add(stop);
	};
	return {
		stop,
		observe
	};
}
// extensions/codex/src/node-app-server-workspace-environment.ts
/** The app-server selects this worker-local carrier; only typed file/process effects wait. */
async function createCodexNodeWorkspaceEnvironment(params) {
	const server = new WebSocketServer({
		host: "127.0.0.1",
		port: 0,
		maxPayload: 67108864
	});
	try {
		await once(server, "listening", { signal: params.signal });
	} catch (error) {
		server.close();
		throw error;
	}
	const address = server.address();
	if (!address || typeof address === "string") throw new Error("Worker execution environment did not bind loopback");
	const id = `openclaw-workspace-${randomUUID()}`;
	const route = `/${randomUUID()}`;
	const controller = new AbortController();
	const signal = AbortSignal.any([params.signal, controller.signal]);
	let acquired = false;
	let running;
	let socket;
	signal.addEventListener("abort", () => socket?.terminate(), { once: true });
	let closing;
	let serverClosed = false;
	const processes = /* @__PURE__ */ new Set();
	server.on("connection", (connected, request) => {
		if (acquired || request.url !== route || request.headers.origin || signal.aborted) {
			connected.close(1008, "Execution environment is unavailable");
			return;
		}
		acquired = true;
		socket = connected;
		const ready = createDeferred();
		let receive;
		const io = {
			signal,
			emitChunk: async () => {},
			onInput: () => {},
			frames: {
				send: (message) => new Promise((resolve, reject) => {
					if (connected.readyState !== WebSocket.OPEN) {
						reject(/* @__PURE__ */ new Error("Worker execution environment disconnected"));
						return;
					}
					connected.send(message, (error) => error ? reject(error) : resolve());
				}),
				onMessage: (listener) => {
					receive = listener;
					ready.resolve();
					return () => {
						receive = void 0;
					};
				}
			}
		};
		connected.on("message", (data) => {
			const bytes = Buffer.isBuffer(data) ? data : Array.isArray(data) ? Buffer.concat(data) : Buffer.from(data);
			(async () => {
				await ready.promise;
				signal.throwIfAborted();
				params.assertExecAuthorized();
				await receive?.(bytes);
			})().catch(() => controller.abort(/* @__PURE__ */ new Error("Worker execution environment request failed")));
		});
		connected.once("close", () => controller.abort(/* @__PURE__ */ new Error("Worker execution environment disconnected")));
		connected.once("error", () => controller.abort(/* @__PURE__ */ new Error("Worker execution environment transport failed")));
		running = runCodexNodeExecServer({
			...params,
			workspace: {
				...params.workspace,
				release: () => {}
			},
			io,
			activeProcesses: processes
		});
		running.finally(() => {
			ready.resolve();
			controller.abort(/* @__PURE__ */ new Error("Worker execution environment exited"));
		}).catch(() => void 0);
	});
	return {
		id,
		url: `ws://127.0.0.1:${address.port}${route}`,
		cwd: params.workspace.workspaceDir,
		signal,
		async close() {
			const operation = closing ??= (async () => {
				controller.abort(/* @__PURE__ */ new Error("Worker execution environment closed"));
				socket?.terminate();
				if (!serverClosed) await new Promise((resolve, reject) => {
					server.close((error) => {
						if (error) reject(error);
						else {
							serverClosed = true;
							resolve();
						}
					});
				});
				const outcomes = await Promise.allSettled([...processes].map((stop) => stop()));
				await running?.catch(() => void 0);
				const errors = outcomes.flatMap((outcome) => outcome.status === "rejected" ? [outcome.reason] : []);
				if (errors.length) throw new AggregateError(errors, "Worker execution environment cleanup did not settle");
			})();
			try {
				return await operation;
			} catch (error) {
				if (closing === operation) closing = void 0;
				throw error;
			}
		}
	};
}
// extensions/codex/src/node-resource-readiness.ts
/** Derives a connection-local effect fence from its admitted Gateway delivery owner. */
function createCodexNodeResourceReadiness(params) {
	const settled = createDeferred();
	let status = params.required ? "pending" : "ready";
	const assertReady = () => {
		params.signal.throwIfAborted();
		params.assertCurrent();
		if (status !== "ready") throw new Error("Private turn resource preparation is unavailable.");
	};
	return {
		readiness: params.required ? {
			async wait(signal) {
				await racePromiseWithAbortSignal(settled.promise, signal);
				assertReady();
			},
			assertCurrent() {
				assertReady();
			}
		} : void 0,
		settle(request) {
			if (!isRecord(request) || request.method !== "openclaw/resources/settle") return;
			params.signal.throwIfAborted();
			params.assertCurrent();
			const next = isRecord(request.params) ? request.params.status : void 0;
			const valid = params.required && status === "pending" && (typeof request.id === "string" || Number.isSafeInteger(request.id)) && Object.keys(request).every((key) => [
				"id",
				"method",
				"params",
				"jsonrpc"
			].includes(key)) && (request.jsonrpc === void 0 || request.jsonrpc === "2.0") && isRecord(request.params) && Object.keys(request.params).length === 1 && (next === "ready" || next === "failed");
			if (valid) {
				status = next;
				settled.resolve();
			}
			return {
				id: request.id,
				...valid ? { result: {} } : { error: {
					code: -32001,
					message: "Private resource preparation owner changed."
				} }
			};
		}
	};
}
// extensions/codex/src/node-app-server.runtime.ts
/** Owns one admitted worker-native app-server and its execution environment. */
const MAX_FRAME_BYTES = 67108864;
async function readPrivateFile(file) {
	const stat = await fs.lstat(file);
	if (!stat.isFile() || stat.size > 16384 || process.platform !== "win32" && (stat.mode & 63) !== 0) throw new Error("Worker Codex configuration must be a private regular file");
	return await fs.readFile(file, "utf8");
}
async function readWorkerCodexRuntime(command) {
	const directory = path.join(resolveStateDir(process.env), "codex-runtime");
	const stat = await fs.lstat(directory);
	if (!stat.isDirectory() || await fs.realpath(directory) !== directory || process.platform !== "win32" && (stat.mode & 63) !== 0) throw new Error("Worker Codex configuration directory is unsafe");
	const [version, config] = await Promise.all([readPrivateFile(path.join(directory, "version")), readPrivateFile(path.join(directory, "config.toml"))]);
	const helperPath = resolveCodexWorkerAuthHelper(config, directory);
	const helperScript = await readPrivateFile(helperPath);
	if (!command.endsWith("." + version) || version !== deriveCodexWorkerConfigurationVersion(config, helperPath, helperScript)) throw new Error("Worker Codex configuration version is invalid; reprovision the worker");
	return {
		directory,
		config
	};
}
function decodeFrame(frame) {
	if (!frame.byteLength || frame.byteLength > MAX_FRAME_BYTES || frame.includes(10) || frame.includes(13)) throw new Error("Worker app-server requires one bounded JSON-RPC frame");
	let request;
	try {
		request = JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(frame));
	} catch {
		throw new Error("Worker app-server received malformed JSON-RPC");
	}
	if (!isRecord(request) || typeof request.method !== "string" && !("id" in request && ("result" in request || "error" in request))) throw new Error("Worker app-server received an invalid JSON-RPC frame");
	return request;
}
async function runCodexNodeAppServer(params) {
	const controller = new AbortController();
	const signal = AbortSignal.any([params.io.signal, controller.signal]);
	const assertCurrent = () => {
		signal.throwIfAborted();
		params.assertExecAuthorized();
		params.workspace.processEnvironment?.assertCurrent();
	};
	const resources = createCodexNodeResourceReadiness({
		required: params.resourcePreparationRequired,
		signal,
		assertCurrent
	});
	const workspace = {
		...params.workspace,
		repositoryReadiness: resources.readiness
	};
	const frames = params.io.frames;
	let child;
	let unsubscribe;
	let environment;
	let writes = Promise.resolve();
	const effects = /* @__PURE__ */ new Set();
	const internal = /* @__PURE__ */ new Map();
	const owner = createCodexNodeAppServerProcessOwner({
		child: () => child,
		unsubscribe: () => {
			unsubscribe?.();
			controller.abort(/* @__PURE__ */ new Error("Worker app-server closed"));
			for (const pending of internal.values()) pending.reject(/* @__PURE__ */ new Error("Worker app-server closed"));
			internal.clear();
		},
		release: async () => {
			await writes.catch(() => {});
			await Promise.allSettled(effects);
			await environment?.close();
			workspace.release();
		},
		activeProcesses: params.activeProcesses
	});
	try {
		assertCurrent();
		if (!frames) throw new Error("Worker app-server requires duplex frames");
		const runtime = await readWorkerCodexRuntime(params.command);
		if (!workspace.homeDir) throw new Error("Worker app-server requires an owned workspace home");
		const home = path.join(workspace.homeDir, ".openclaw-worker", "codex", createHash("sha256").update(params.sessionId).digest("hex"));
		await fs.mkdir(home, {
			recursive: true,
			mode: 448
		});
		await fs.writeFile(path.join(home, "config.toml"), runtime.config, { mode: 384 });
		const resolved = await resolveManagedCodexAppServerStartOptions({
			transport: "stdio",
			command: "codex",
			commandSource: "managed",
			managedCommandOrder: "package-first",
			args: [
				"app-server",
				"--listen",
				"stdio://"
			],
			headers: {}
		}, { preferInstalled: false });
		const native = resolveManagedCodexNativeCommand(resolved.command);
		if (!native || isManagedCodexDesktopCommand(resolved.command)) throw new Error("Worker requires the pinned Codex package binary");
		const base = sanitizeEnvVars(process.env, {
			strictMode: true,
			customAllowedPatterns: [/^(?:SYSTEMROOT|WINDIR|COMSPEC|PATHEXT|TEMP|TMP|TMPDIR)$/iu]
		}).allowed;
		assertCurrent();
		const closed = createDeferred();
		const failed = createDeferred();
		failed.promise.catch(() => {});
		const onAbort = () => failed.reject(/* @__PURE__ */ new Error("Worker app-server cancelled"));
		signal.addEventListener("abort", onAbort, { once: true });
		let outgoing = Promise.resolve();
		try {
			child = await createStdioTransport({
				transport: "stdio",
				command: native,
				commandSource: "resolved-managed",
				args: resolved.args,
				headers: {},
				cwd: workspace.workspaceDir,
				env: {
					HOME: workspace.homeDir,
					CODEX_HOME: home,
					...process.platform === "win32" ? { USERPROFILE: workspace.homeDir } : {}
				},
				clearEnv: [
					"NODE_OPTIONS",
					"OPENAI_API_KEY",
					"OPENAI_API_PROXY_KEY",
					"CODEX_API_KEY"
				]
			}, workspace.processEnvironment?.prepare(base) ?? base, assertCurrent, (spawned) => {
				child = spawned;
				owner.observe();
				spawned.once("close", (code, exitSignal) => closed.resolve({
					code,
					signal: exitSignal
				}));
				spawned.once("error", failed.reject);
				spawned.stdin.on("error", failed.reject);
				spawned.stderr.resume();
				outgoing = (async () => {
					const framer = createBoundedLineFramer(MAX_FRAME_BYTES, "Worker app-server response exceeds 64 MiB");
					for await (const chunk of spawned.stdout) for (const frame of framer.push(Buffer.from(chunk))) {
						const message = decodeFrame(frame);
						const pending = typeof message.id === "string" ? internal.get(message.id) : void 0;
						if (pending) {
							internal.delete(String(message.id));
							if (message.error) pending.reject(/* @__PURE__ */ new Error("Worker environment registration failed"));
							else pending.resolve(message.result);
						} else await frames.send(workspace.processEnvironment ? Buffer.from(workspace.processEnvironment.redactOutput(frame.toString("utf8"))) : frame);
					}
					if (framer.pendingByteLength) throw new Error("Worker app-server ended with an incomplete frame");
				})();
				outgoing.catch(failed.reject);
			});
			const activeChild = child;
			const send = async (request) => {
				assertCurrent();
				if (!activeChild.stdin.write(JSON.stringify(request) + "\n")) await once(activeChild.stdin, "drain", { signal });
			};
			let registration;
			const ensureEnvironment = () => registration ??= (async () => {
				environment = await createCodexNodeWorkspaceEnvironment({
					workspace,
					signal,
					assertExecAuthorized: assertCurrent
				});
				const id = "openclaw-environment-" + randomUUID();
				const response = createDeferred();
				internal.set(id, response);
				await send({
					id,
					method: "environment/add",
					params: {
						environmentId: environment.id,
						execServerUrl: environment.url
					}
				});
				await Promise.race([response.promise, failed.promise]);
				assertCurrent();
			})();
			unsubscribe = frames.onMessage((frame) => {
				const request = decodeFrame(frame);
				const settled = resources.settle(request);
				if (settled) return frames.send(Buffer.from(JSON.stringify(settled)));
				if (resources.readiness && (String(request.method).startsWith("fs/") || request.method === "command/exec" || String(request.method).startsWith("fuzzyFileSearch/"))) {
					if (effects.size >= 64) throw new Error("Too many pending worker filesystem operations");
					const effect = (async () => {
						try {
							await resources.readiness.wait(signal);
							assertCurrent();
							await send(request);
						} catch {
							if (!signal.aborted) await frames.send(Buffer.from(JSON.stringify({
								id: request.id,
								error: {
									code: -32001,
									message: "Private resource preparation is unavailable; this operation did not run."
								}
							})));
						}
					})();
					effects.add(effect);
					effect.finally(() => effects.delete(effect)).catch(failed.reject);
					return;
				}
				const operation = writes.then(async () => {
					if (["thread/start", "turn/start"].includes(String(request.method))) {
						await ensureEnvironment();
						if (!environment || !isRecord(request.params)) throw new Error("Worker environment selection unavailable");
						const selected = request.params.environments;
						request.params.environments = Array.isArray(selected) && selected.length === 0 ? [] : [{
							environmentId: environment.id,
							cwd: workspace.workspaceDir
						}];
					}
					await send(request);
				});
				writes = operation.catch((error) => {
					failed.reject(error);
				});
				return operation;
			});
			const outcome = await Promise.race([closed.promise, failed.promise]);
			await outgoing;
			await frames.send(Buffer.from(JSON.stringify({
				method: "openclaw/process/exited",
				params: outcome
			})));
			if (outcome.code !== 0 || outcome.signal) throw new Error("Worker app-server exited unsuccessfully");
			return "Worker app-server exited";
		} finally {
			signal.removeEventListener("abort", onAbort);
		}
	} finally {
		await owner.stop();
	}
}
export { readWorkerCodexRuntime, runCodexNodeAppServer };
