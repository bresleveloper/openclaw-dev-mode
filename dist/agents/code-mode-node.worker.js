import { c as isRecord } from "../record-coerce-DItp3I4t.mjs";
import { n as serveWorkerTasks } from "../worker-task-server-CwtaNZgU.mjs";
import { a as normalizeSourceStack, i as buildUserSource, o as CODE_MODE_CONTROLLER_SOURCE, r as USER_SOURCE_FILE, t as prepareSource } from "../code-mode-source-Bw0nRM9I.mjs";
import { a as captureCodeModeValue, i as captureCodeModeOutput, n as EMPTY_CODE_MODE_OUTPUT, r as boundCodeModeError } from "../code-mode-json-Cek5lI0P.mjs";
import { n as ToolInputError } from "../tool-input-error-mjW74R8m.mjs";
import { types } from "node:util";
import { setImmediate } from "node:timers/promises";
import { getHeapStatistics } from "node:v8";
import { Script, createContext } from "node:vm";
//#region src/agents/code-mode-node.worker.ts
let cell;
process.on("unhandledRejection", (reason, promise) => cell?.rejections.set(promise, reason));
process.on("rejectionHandled", (promise) => cell?.rejections.delete(promise));
const bridgeMethods = /* @__PURE__ */ new Set([
	"search",
	"describe",
	"callValue",
	"resultSave",
	"resultLoad",
	"resultDelete",
	"nodes",
	"yield",
	"namespace",
	"agentSpawn",
	"agentWait",
	"skillsList",
	"skillsRead",
	"sleep",
	"swarmNote"
]);
function isBridgeMethod(method) {
	return bridgeMethods.has(method);
}
const initializeScript = new Script(String.raw`
    (() => {
      // Keep native encoding prototypes private when this worker is reused.
      const Encoder = globalThis.__openclawNodeTextEncoder;
      const Decoder = globalThis.__openclawNodeTextDecoder;
      const Bytes = Uint8Array;
      delete globalThis.__openclawNodeTextEncoder;
      delete globalThis.__openclawNodeTextDecoder;
      Object.defineProperties(globalThis, {
        TextEncoder: { value: class TextEncoder {
          #encoder = new Encoder();
          get encoding() { return this.#encoder.encoding; }
          encode(input) { return new Bytes(this.#encoder.encode(input)); }
          encodeInto(input, destination) {
            const { read, written } = this.#encoder.encodeInto(input, destination);
            return { read, written };
          }
        }, enumerable: true },
        TextDecoder: { value: class TextDecoder {
          #decoder;
          constructor(label, options) { this.#decoder = new Decoder(label, options); }
          get encoding() { return this.#decoder.encoding; }
          get fatal() { return this.#decoder.fatal; }
          get ignoreBOM() { return this.#decoder.ignoreBOM; }
          decode(input, options) { return this.#decoder.decode(input, options); }
        }, enumerable: true },
      });
    })();

    Object.assign(globalThis, JSON.parse(__openclawNodeInit));
    delete globalThis.__openclawNodeInit;
    ${CODE_MODE_CONTROLLER_SOURCE}

    (() => {
      const finish = globalThis.__openclawNodeFinish;
      delete globalThis.__openclawNodeFinish;
      const stringify = JSON.stringify;
      Object.defineProperty(globalThis, "__openclawNodeObserveResult", { value: (result) => {
        result.then(value => finish(true, value), error => finish(false, stringify({
          name: String(error?.name ?? "Error"),
          message: String(error?.message ?? error),
          stack: typeof error?.stack === "string" ? error.stack : "",
        })));
      }});
    })();
  `, { filename: "openclaw-code-mode:controller.js" });
const settleScript = new Script("for (const reply of JSON.parse(__openclawNodeReplies)) __openclawSettleBridge(reply.id, reply.ok, reply.json); delete globalThis.__openclawNodeReplies;", { filename: "openclaw-code-mode:controller.js" });
const drainScript = new Script(`(() => {
    const error = __openclawAdmissionError();
    if (!error) __openclawDrainQueuedRequests();
    return error;
  })()`, { filename: "openclaw-code-mode:controller.js" });
const outputScript = new Script("__openclawTakeOutputJson()", { filename: "openclaw-code-mode:controller.js" });
const observeResultScript = new Script("__openclawNodeObserveResult(__openclawResult)", { filename: "openclaw-code-mode:controller.js" });
const rejectionScript = new Script(`(() => {
    const error = __openclawNodeRejection;
    delete globalThis.__openclawNodeRejection;
    return JSON.stringify({name: String(error?.name ?? "Error"), message: String(error?.message ?? error), stack: typeof error?.stack === "string" ? error.stack : ""});
  })()`, { filename: "openclaw-code-mode:controller.js" });
function evaluate(current, script) {
	const remaining = current.deadline - performance.now();
	if (remaining <= 0) throw new Error("code mode timeout exceeded");
	return script.runInContext(current.context, {
		timeout: Math.max(1, Math.ceil(remaining)),
		breakOnSigint: false
	});
}
function sourceFrames(stack, location) {
	return normalizeSourceStack(stack, location)?.split("\n").filter((line) => line.includes("openclaw-code-mode:user.js") && /^\s+at /u.test(line)) ?? [];
}
function guestError(error, location) {
	if (!types.isNativeError(error)) return String(error);
	const frames = sourceFrames(error.stack, location);
	if (frames.length === 0 && error.name === "SyntaxError") {
		const syntax = /^openclaw-code-mode:user\.js:(\d+)\n[^\n]*\n([ \t]*)\^/u.exec(error.stack ?? "");
		const line = syntax?.[1];
		const prefix = syntax?.[2];
		if (line !== void 0 && prefix !== void 0) frames.push(...sourceFrames(`    at ${USER_SOURCE_FILE}:${line}:${prefix.length + 1}`, location));
	}
	return [`${error.name}: ${error.message}`, ...frames].join("\n");
}
function createCell(input, source, startedAt) {
	const preparedAt = performance.now();
	const deadline = Math.min(startedAt + input.config.timeoutMs, preparedAt + (input.executionTimeoutMs ?? Infinity));
	if (deadline <= preparedAt) throw new Error("code mode timeout exceeded");
	const program = buildUserSource(source, input.prelude, "utf16");
	const context = createContext(Object.create(null), { microtaskMode: "afterEvaluate" });
	const current = {
		context,
		config: input.config,
		location: program.location,
		pendingRequests: [],
		canceledRequestIds: [],
		rejections: /* @__PURE__ */ new Map(),
		deadline
	};
	cell = current;
	context["__openclawNodeTextEncoder"] = TextEncoder;
	context["__openclawNodeTextDecoder"] = TextDecoder;
	context["__openclawHostRequest"] = (method, argsJson, id, stack) => {
		if (current.pendingRequests.length >= current.config.maxPendingToolCalls) {
			current.admissionError = "too many pending code mode tool calls";
			throw new Error(current.admissionError);
		}
		if (!isBridgeMethod(method)) throw new Error("unsupported code mode bridge method");
		const args = JSON.parse(argsJson);
		if (!Array.isArray(args)) throw new Error("invalid code mode bridge arguments: expected an array");
		if (!id.startsWith(`bridge:${method}:`) || !/^bridge:[A-Za-z]+:[1-9]\d*$/u.test(id)) throw new Error("invalid code mode bridge id");
		if (current.pendingRequests.some((request) => request.id === id)) throw new Error("duplicate code mode bridge id");
		current.pendingRequests.push({
			id,
			method,
			args
		});
		return sourceFrames(typeof stack === "string" ? stack.slice(0, 8192) : "", current.location).join("\n");
	};
	context["__openclawHostCancelRequest"] = (id) => {
		const index = current.pendingRequests.findIndex((request) => request.id === id);
		if (index >= 0) {
			current.pendingRequests.splice(index, 1);
			current.canceledRequestIds.push(id);
		}
	};
	context["__openclawHostObserveNetworkContent"] = () => {
		current.networkContentObserved = true;
	};
	context["__openclawNodeInit"] = JSON.stringify({
		__openclawCatalog: input.catalog,
		__openclawNamespaces: input.namespaces,
		__openclawApiFiles: input.apiFiles ?? [],
		__openclawSwarmEnabled: input.swarmEnabled === true,
		__openclawMaxPendingToolCalls: input.config.maxPendingToolCalls
	});
	context["__openclawNodeFinish"] = (ok, json) => {
		current.outcome = {
			ok,
			json
		};
	};
	evaluate(current, initializeScript);
	evaluate(current, new Script(program.source, { filename: USER_SOURCE_FILE }));
	evaluate(current, observeResultScript);
	return current;
}
function settle(current, requests) {
	current.context["__openclawNodeReplies"] = JSON.stringify(requests);
	try {
		evaluate(current, settleScript);
	} finally {
		for (const request of requests) request.json = "";
		requests.length = 0;
	}
}
function takeOutput(current) {
	const json = evaluate(current, outputScript);
	return JSON.parse(String(json));
}
function formatGuestFailure(current, json) {
	const value = JSON.parse(json);
	if (value.name === "ReferenceError" && /^(?:require|module|process) is not defined$/u.test(value.message)) return {
		code: "invalid_input",
		error: "code mode module access is disabled."
	};
	return {
		code: "internal_error",
		error: [`${value.name}: ${value.message}`, ...sourceFrames(value.stack, current.location)].join("\n")
	};
}
function failed(code, error, output = EMPTY_CODE_MODE_OUTPUT) {
	return {
		status: "failed",
		code,
		error,
		output,
		failurePhase: code === "invalid_input" ? "input" : "guest",
		bridgeDispatchStarted: false
	};
}
async function run(input, channel) {
	let output = [];
	let consumed = channel?.consumeInput;
	const config = input.config;
	const startedAt = performance.now();
	try {
		const current = input.kind === "exec" ? createCell(input, prepareSource(input.source), startedAt) : cell;
		if (!current) throw new Error("code mode continuation is no longer available");
		if (input.kind === "resume") {
			current.config = config;
			current.deadline = performance.now() + config.timeoutMs;
			current.pendingRequests = input.pendingRequests ?? [];
			current.canceledRequestIds = [];
			settle(current, input.settledRequests);
		}
		for (;;) {
			consumed?.();
			consumed = void 0;
			const admissionError = current.admissionError ?? evaluate(current, drainScript);
			if (admissionError !== void 0 && typeof admissionError !== "string") throw new Error("invalid code mode admission error");
			if (admissionError) throw new ToolInputError(admissionError);
			await setImmediate();
			output = takeOutput(current);
			const pending = !current.outcome;
			if (pending && current.pendingRequests.length === 0) throw new Error("code mode promise is pending without host work");
			if (pending || current.pendingRequests.length > 0) {
				const settlementMode = pending ? { kind: "awaiting" } : {
					kind: "draining",
					requiredRequestIds: current.pendingRequests.map((request) => request.id)
				};
				const boundary = {
					pendingRequests: current.pendingRequests,
					canceledRequestIds: current.canceledRequestIds,
					settlementMode,
					output: captureCodeModeOutput(output, config.maxOutputBytes),
					memoryUsedBytes: getHeapStatistics().used_heap_size,
					...current.networkContentObserved ? { networkContentObserved: true } : {}
				};
				if (!channel) return {
					status: "waiting",
					...boundary,
					continuation: void 0
				};
				const response = await channel.request({
					status: "boundary",
					...boundary
				});
				output = [];
				consumed = response.consumed;
				const command = response.input;
				if (command.kind === "checkpoint") {
					consumed();
					consumed = void 0;
					return {
						status: "waiting",
						...boundary,
						continuation: void 0,
						output: EMPTY_CODE_MODE_OUTPUT
					};
				}
				if (command.kind !== "continue") throw new Error("invalid code mode continuation");
				if (!Number.isFinite(command.timeoutMs) || command.timeoutMs <= 0 || command.timeoutMs > config.timeoutMs) throw new Error("code mode timeout exceeded");
				current.deadline = performance.now() + command.timeoutMs;
				current.pendingRequests = command.pendingRequests;
				current.canceledRequestIds = [];
				settle(current, command.settledRequests);
				continue;
			}
			const outcome = current.outcome;
			if (!outcome.ok) {
				const failure = formatGuestFailure(current, outcome.json);
				return failed(failure.code, boundCodeModeError(failure.error, config.maxOutputBytes), captureCodeModeOutput(output, config.maxOutputBytes));
			}
			if (current.rejections.size > 0) {
				current.context["__openclawNodeRejection"] = current.rejections.values().next().value;
				const encoded = evaluate(current, rejectionScript);
				const failure = formatGuestFailure(current, String(encoded));
				return failed(failure.code, boundCodeModeError(failure.error, config.maxOutputBytes), captureCodeModeOutput(output, config.maxOutputBytes));
			}
			return {
				status: "completed",
				output: captureCodeModeOutput(output, config.maxOutputBytes),
				value: captureCodeModeValue(JSON.parse(outcome.json), config.maxOutputBytes, input.retainFinalValue ? Math.min(config.memoryLimitBytes, config.maxSnapshotBytes) : config.maxOutputBytes)
			};
		}
	} catch (error) {
		const timeout = types.isNativeError(error) && /Script execution timed out|code mode timeout exceeded/u.test(error.message);
		if (cell && output.length === 0) {
			if (timeout) cell.deadline = performance.now() + 50;
			try {
				output = takeOutput(cell);
			} catch {}
		}
		return failed(timeout ? "timeout" : error instanceof ToolInputError ? "invalid_input" : "internal_error", boundCodeModeError(timeout ? "code mode timeout exceeded" : cell ? guestError(error, cell.location) : error instanceof Error ? error.message : String(error), config.maxOutputBytes), captureCodeModeOutput(output, config.maxOutputBytes));
	}
}
serveWorkerTasks(async (input, channel) => {
	if (!isRecord(input) || !isRecord(input.config) || input.kind !== "exec" && input.kind !== "resume") return failed("invalid_input", "invalid code mode worker input");
	const result = await run(input, channel);
	if (cell?.networkContentObserved) result.networkContentObserved = true;
	if (result.status !== "waiting") cell = void 0;
	return result;
});
//#endregion
export {};
