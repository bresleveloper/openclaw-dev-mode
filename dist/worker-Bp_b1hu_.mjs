import { F as resolveTimerTimeoutMs } from "./number-coercion-CLj0HTDM.mjs";
import { r as asNullableRecord } from "./record-coerce-DItp3I4t.mjs";
import { n as requestExitAfterOneShotOutput } from "./one-shot-exit-maXyqxro.mjs";
import { Fn as object, Jn as string, Nt as array, Pn as number, cr as url } from "./schemas-BOYIvvln.mjs";
import { t as VERSION } from "./version-BkM1aB4w.mjs";
import "./client-CpsABkfT.mjs";
import { t as GatewayClientRequestError } from "./request-error-DXOPJLBU.mjs";
import { t as createPendingRequestRegistry } from "./pending-request-registry-6Top3fRe.mjs";
import { a as loadNodeHostConfig } from "./config-DLlmgxee.mjs";
import { n as prepareNodeHostRuntime, r as startNodeHostConnection, t as runStartupMigrations } from "./startup-state-migrations-DOODTIHe.mjs";
import { AsyncLocalStorage } from "node:async_hooks";
import { createInterface } from "node:readline";
//#region src/node-host/worker-support.ts
const connectionSchema = object({
	url: url(),
	protocol: number().int().positive(),
	capabilities: array(string()),
	tlsFingerprint: string().optional(),
	cloudflareAccess: object({
		clientId: string(),
		clientSecret: string()
	}).optional()
});
function parseNodeHostWorkerInput(line) {
	try {
		const parsed = asNullableRecord(JSON.parse(line));
		const type = typeof parsed?.type === "string" ? parsed.type : "";
		if (type === "stop") return { type };
		const generation = parsed?.generation;
		if (typeof generation !== "number" || !Number.isSafeInteger(generation) || generation < 0) return null;
		if (type === "gateway-connection") return {
			type,
			generation,
			connection: parsed?.connection === null ? null : connectionSchema.parse(parsed?.connection)
		};
		if (type === "runner-inventory-refresh") return {
			type,
			generation
		};
		if (type === "invoke") {
			const request = asNullableRecord(parsed?.request);
			if (request && typeof request.id === "string" && typeof request.nodeId === "string" && typeof request.command === "string") return {
				type,
				generation,
				request
			};
			return null;
		}
		if (type === "gateway-response") {
			const id = typeof parsed?.id === "string" ? parsed.id : "";
			if (!id) return null;
			return parsed?.ok === true ? {
				type,
				generation,
				id,
				ok: true,
				result: parsed.result
			} : {
				type,
				generation,
				id,
				ok: false,
				error: object({
					code: string(),
					message: string()
				}).parse(parsed?.error)
			};
		}
		if (type === "invoke-input") {
			const invokeId = typeof parsed?.invokeId === "string" ? parsed.invokeId : "";
			const seq = typeof parsed?.seq === "number" ? parsed.seq : -1;
			const payloadJSON = typeof parsed?.payloadJSON === "string" ? parsed.payloadJSON : null;
			return invokeId && Number.isInteger(seq) && seq >= 0 && payloadJSON !== null ? {
				type,
				generation,
				invokeId,
				seq,
				payloadJSON
			} : null;
		}
		if (type === "invoke-cancel") {
			const invokeId = typeof parsed?.invokeId === "string" ? parsed.invokeId : "";
			return invokeId ? {
				type,
				generation,
				invokeId
			} : null;
		}
		return null;
	} catch {
		return null;
	}
}
var NodeHostWorkerBridgeClient = class {
	setConnection(generation, connected) {
		this.pending.rejectAll(/* @__PURE__ */ new Error("node-host Gateway route changed"));
		this.generation = generation;
		this.connected = connected;
	}
	withConnection(generation, run) {
		return this.invocationGeneration.run(generation, run);
	}
	constructor(writeMessage) {
		this.writeMessage = writeMessage;
		this.nextRequestId = 1;
		this.generation = 0;
		this.connected = false;
		this.invocationGeneration = new AsyncLocalStorage();
		this.pending = createPendingRequestRegistry();
	}
	async request(method, params, opts) {
		const generation = this.invocationGeneration.getStore() ?? this.generation;
		if (!this.connected || generation !== this.generation) throw new Error("node-host Gateway route is closed");
		if (method === "node.invoke.result") {
			this.writeMessage({
				type: "invoke-result",
				generation,
				result: params ?? {}
			});
			return {};
		}
		if (method === "node.event") {
			this.writeMessage({
				type: "node-event",
				generation,
				event: params ?? {}
			});
			return {};
		}
		const id = `gateway-${this.nextRequestId++}`;
		const timeoutMs = resolveTimerTimeoutMs(opts?.timeoutMs, 15e3);
		const pending = this.pending.add(id, {
			value: void 0,
			timeoutMs,
			timeoutError: () => /* @__PURE__ */ new Error(`Gateway request timed out: ${method}`)
		});
		if (!pending) throw new Error(`Gateway request id collision: ${id}`);
		this.writeMessage({
			type: "gateway-request",
			generation,
			id,
			method,
			params: params ?? {},
			timeoutMs
		});
		return await pending.promise;
	}
	handleResponse(message) {
		if (message.generation !== this.generation) return false;
		const pending = this.pending.take(message.id);
		if (!pending) return false;
		if (message.ok) pending.resolve(message.result);
		else pending.reject(new GatewayClientRequestError({
			code: message.error.code,
			message: message.error.message
		}));
		return true;
	}
	close() {
		this.connected = false;
		this.pending.rejectAll(/* @__PURE__ */ new Error("node-host worker stopped"));
	}
};
async function stopNodeHostWorkerFromSignal(input, stop, exitCode) {
	const stopped = stop(exitCode);
	input.close();
	await stopped;
}
//#endregion
//#region src/node-host/worker.ts
/** Private JSONL worker exposing the CLI node-host runtime to the macOS app. */
function writeMessage(message) {
	process.stdout.write(`${JSON.stringify(message)}\n`);
}
function writeStderrLine(message) {
	process.stderr.write(`${message}\n`);
}
async function runNodeHostWorker(options = {}) {
	await runStartupMigrations({ log: {
		info: writeStderrLine,
		warn: writeStderrLine
	} });
	const nodeConfig = await loadNodeHostConfig();
	const prepared = await prepareNodeHostRuntime({
		enableDuplexPluginCommands: true,
		enableWorkerRuns: true,
		installedAppsSharingEnabled: nodeConfig?.installedAppsSharing === true,
		desktopSharingEnabled: options.desktopSharingEnabled
	});
	const client = new NodeHostWorkerBridgeClient(writeMessage);
	let stopping = false;
	let resolveStopped;
	const stopped = new Promise((resolve) => {
		resolveStopped = resolve;
	});
	const stop = async (exitCode) => {
		if (stopping) return;
		stopping = true;
		try {
			client.close();
			await runtime.close();
			process.exitCode = exitCode;
		} finally {
			resolveStopped?.();
		}
	};
	let generation = 0;
	let connected = false;
	let readySent = false;
	let workerHostingEnabled = false;
	let currentManifest = prepared.manifest;
	const runtime = startNodeHostConnection({
		prepared,
		client,
		writeStderrLine,
		onWorkerHostingChanged: (enabled) => {
			workerHostingEnabled = enabled;
			if (readySent) writeMessage({
				type: "worker-hosting",
				enabled
			});
		},
		onManifestChanged: (manifest) => {
			currentManifest = manifest;
			if (readySent) {
				connected = false;
				client.setConnection(generation, false);
				runtime.disconnect();
				writeMessage({
					type: "manifest",
					version: VERSION,
					manifest
				});
			}
		}
	});
	writeMessage({
		type: "ready",
		version: VERSION,
		manifest: currentManifest,
		workerHostingEnabled
	});
	readySent = true;
	const input = createInterface({
		input: process.stdin,
		crlfDelay: Infinity
	});
	input.on("line", (line) => {
		const message = parseNodeHostWorkerInput(line);
		if (!message) {
			writeMessage({
				type: "protocol-error",
				error: "invalid worker request"
			});
			return;
		}
		if (message.type === "gateway-connection") {
			if (message.generation <= generation) return;
			generation = message.generation;
			connected = message.connection !== null;
			client.setConnection(generation, connected);
			runtime.disconnect();
			if (message.connection) {
				const connectionGeneration = generation;
				runtime.connect(message.connection, { request: (...args) => client.withConnection(connectionGeneration, () => client.request(...args)) });
			}
			return;
		}
		if (message.type === "gateway-response") {
			client.handleResponse(message);
			return;
		}
		if (message.type === "stop") {
			input.close();
			stop(0);
			return;
		}
		if (!connected || message.generation !== generation) return;
		if (message.type === "runner-inventory-refresh") {
			runtime.refreshRunnerInventory();
			return;
		}
		if (message.type === "invoke-input") {
			runtime.handleInput(message.invokeId, message.seq, message.payloadJSON);
			return;
		}
		if (message.type === "invoke-cancel") {
			runtime.cancel(message.invokeId);
			return;
		}
		client.withConnection(generation, () => runtime.invoke(message.request));
	});
	input.on("close", () => void stop(0));
	const onInterrupt = () => void stopNodeHostWorkerFromSignal(input, stop, 130);
	const onTerminate = () => void stopNodeHostWorkerFromSignal(input, stop, 143);
	process.once("SIGINT", onInterrupt);
	process.once("SIGTERM", onTerminate);
	try {
		await stopped;
	} finally {
		process.off("SIGINT", onInterrupt);
		process.off("SIGTERM", onTerminate);
		requestExitAfterOneShotOutput();
	}
}
//#endregion
export { runNodeHostWorker as t };
