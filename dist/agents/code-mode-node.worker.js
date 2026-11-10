import { c as isRecord } from "../record-coerce-TIsquoVR.mjs";
import { n as ToolInputError } from "../tool-input-error-mjW74R8m.mjs";
import { t as observeGcSamples } from "../gc-observer-BGYErqy9.mjs";
import { n as serveWorkerTasks } from "../worker-task-server-sMsYUF1K.mjs";
import { a as buildUserSource, i as USER_SOURCE_FILE, n as prepareSource, o as normalizeSourceStack, s as CODE_MODE_CONTROLLER_SOURCE, t as CODE_MODE_MODULE_ACCESS_ERROR } from "../code-mode-source-DsethwuR.mjs";
import { a as captureCodeModeValue, n as EMPTY_CODE_MODE_OUTPUT, r as boundCodeModeError } from "../code-mode-json-DSNnk8AT.mjs";
import { t as CodeModeNodeProgress } from "../code-mode-node-progress-CPxIo4Cl.mjs";
import { types } from "node:util";
import { setImmediate } from "node:timers/promises";
import { getHeapStatistics } from "node:v8";
import { Script, createContext } from "node:vm";
//#region src/agents/code-mode-node.worker.ts
let cell;
process.on("unhandledRejection", (reason, promise) => cell?.rejections.set(promise, reason));
process.on("rejectionHandled", (promise) => cell?.rejections.delete(promise));
let gcStartedAt = performance.now();
let majorCollections = 0;
observeGcSamples((samples) => {
	for (const sample of samples) if (sample.kind === "mark_sweep_compact") majorCollections++;
	const now = performance.now();
	const elapsedMs = now - gcStartedAt;
	if (elapsedMs < 1e3) return;
	if (majorCollections >= elapsedMs / 50) {
		const heap = getHeapStatistics();
		if (heap.used_heap_size >= heap.heap_size_limit * .85) throw Object.assign(/* @__PURE__ */ new Error("Code Mode worker stopped after sustained garbage collection near its JavaScript heap limit"), { code: "ERR_CODE_MODE_GC_THRASH" });
	}
	gcStartedAt = now;
	majorCollections = 0;
});
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
	"skillsSearch",
	"skillsRead",
	"sleep",
	"swarmNote"
]);
function isBridgeMethod(method) {
	return bridgeMethods.has(method);
}
function compileController(source) {
	return new Script(source, { filename: "openclaw-code-mode:controller.js" });
}
const initializeScript = compileController(String.raw`
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
    globalThis.__openclawMaxPendingToolCalls = __openclawNodeMaxPending;
    delete globalThis.__openclawNodeMaxPending;
    ${CODE_MODE_CONTROLLER_SOURCE}

    (() => {
      const finish = globalThis.__openclawNodeFinish;
      delete globalThis.__openclawNodeFinish;
      const stringify = JSON.stringify;
      const string = String;
      const encodeError = (error) => {
        const bridgeCode = __openclawBridgeFailureCode(error) ?? null;
        const diagnostic = (read, fallback) => {
          try { return read(); } catch { return fallback; }
        };
        // Guest error properties may throw; recorded bridge identity must still reach finish.
        const stack = diagnostic(() => error?.stack, "");
        // Provenance records contain primitives and never inherit guest toJSON hooks.
        return stringify({
          __proto__: null,
          bridgeCode,
          name: diagnostic(() => string(error?.name ?? "Error"), "Error"),
          message: diagnostic(() => string(error?.message ?? error), "Error"),
          stack: typeof stack === "string" ? stack : "",
        });
      };
      Object.defineProperties(globalThis, {
        __openclawNodeEncodeError: { value: encodeError },
        __openclawNodeObserveResult: { value: (result) => {
          result.then(value => finish(true, value), error => finish(false, encodeError(error)));
        }},
      });
    })();
  `);
const settleScript = compileController("__openclawSettleBridge()");
const drainScript = compileController(`(() => {
    const error = __openclawAdmissionError();
    if (!error) __openclawDrainQueuedRequests();
    return error;
  })()`);
const observeResultScript = compileController("__openclawNodeObserveResult(__openclawResult)");
const rejectionScript = compileController(`(() => {
    const error = __openclawNodeRejection;
    delete globalThis.__openclawNodeRejection;
    return __openclawNodeEncodeError(error);
  })()`);
function evaluate(current, script) {
	if (current.deadline - performance.now() <= 0) throw new Error("code mode timeout exceeded");
	return script.runInContext(current.context);
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
function createCell(input, source, startedAt, progress, consumed) {
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
		replyIndex: 0,
		rejections: /* @__PURE__ */ new Map(),
		deadline,
		progress
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
	context["__openclawHostTakeBridgeReply"] = () => {
		const request = current.replies?.[current.replyIndex];
		if (!request) return;
		current.replyIndex++;
		const reply = {
			__proto__: null,
			id: request.id,
			ok: request.ok,
			json: request.json
		};
		request.json = "";
		return reply;
	};
	context["__openclawHostObserveNetworkContent"] = () => {
		current.networkContentObserved = true;
		current.progress.observeNetworkContent();
	};
	context["__openclawHostOutput"] = (json) => current.progress.append(json);
	context["__openclawNodeInit"] = new TextDecoder().decode(input.initialization);
	context["__openclawNodeMaxPending"] = input.config.maxPendingToolCalls;
	context["__openclawNodeFinish"] = (ok, json) => {
		current.outcome = {
			ok,
			json
		};
	};
	progress.deadline = performance.timeOrigin + deadline;
	consumed?.();
	evaluate(current, initializeScript);
	evaluate(current, new Script(program.source, { filename: USER_SOURCE_FILE }));
	evaluate(current, observeResultScript);
	return current;
}
function settle(current, requests) {
	current.replies = requests;
	current.replyIndex = 0;
	try {
		evaluate(current, settleScript);
	} finally {
		current.replies = void 0;
		current.replyIndex = 0;
		for (const request of requests) request.json = "";
		requests.length = 0;
	}
}
function formatGuestFailure(current, json) {
	const value = JSON.parse(json);
	if (value.bridgeCode === null && value.name === "ReferenceError" && /^(?:require|module|process) is not defined$/u.test(value.message)) return {
		code: "invalid_input",
		error: CODE_MODE_MODULE_ACCESS_ERROR
	};
	return {
		code: value.bridgeCode ?? "internal_error",
		...value.bridgeCode === null ? {} : { failurePhase: "bridge" },
		error: [`${value.name}: ${value.message}`, ...sourceFrames(value.stack, current.location)].join("\n")
	};
}
function failed(code, error, output = EMPTY_CODE_MODE_OUTPUT, failurePhase) {
	return {
		status: "failed",
		code,
		error,
		output,
		failurePhase: failurePhase ?? (code === "invalid_input" ? "input" : "guest"),
		bridgeDispatchStarted: false
	};
}
async function run(input, channel) {
	let output = EMPTY_CODE_MODE_OUTPUT;
	let consumed = channel?.consumeInput;
	const consume = () => {
		const receipt = consumed;
		consumed = void 0;
		receipt?.();
	};
	const config = input.config;
	const startedAt = performance.now();
	const progress = new CodeModeNodeProgress(input.progress);
	try {
		const current = input.kind === "exec" ? createCell(input, prepareSource(input.source), startedAt, progress, consume) : cell;
		if (!current) throw new Error("code mode continuation is no longer available");
		if (input.kind === "resume") {
			current.progress = progress;
			current.config = config;
			current.deadline = performance.now() + config.timeoutMs;
			progress.deadline = performance.timeOrigin + current.deadline;
			if (current.networkContentObserved) progress.observeNetworkContent();
			current.pendingRequests = input.pendingRequests ?? [];
			current.canceledRequestIds = [];
			settle(current, input.settledRequests);
		}
		for (;;) {
			consume();
			const admissionError = current.admissionError ?? evaluate(current, drainScript);
			if (admissionError !== void 0 && typeof admissionError !== "string") throw new Error("invalid code mode admission error");
			if (admissionError) throw new ToolInputError(admissionError);
			await setImmediate();
			output = progress.output();
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
					output,
					memoryUsedBytes: getHeapStatistics().used_heap_size,
					...current.networkContentObserved ? { networkContentObserved: true } : {}
				};
				if (!channel || !input.inlineHost) return {
					status: "waiting",
					...boundary,
					continuation: void 0
				};
				const response = await channel.request({
					status: "boundary",
					...boundary
				});
				output = EMPTY_CODE_MODE_OUTPUT;
				consumed = response.consumed;
				const command = response.input;
				if (command.kind === "checkpoint") {
					consume();
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
			let failureJson = outcome.ok ? void 0 : outcome.json;
			if (outcome.ok && current.rejections.size > 0) {
				current.context["__openclawNodeRejection"] = current.rejections.values().next().value;
				failureJson = String(evaluate(current, rejectionScript));
			}
			if (failureJson !== void 0) {
				const failure = formatGuestFailure(current, failureJson);
				channel?.notify({
					status: "failure",
					error: JSON.parse(failureJson),
					failurePhase: failure.failurePhase ?? "guest"
				});
				return failed(failure.code, boundCodeModeError(failure.error, config.maxOutputBytes), output, failure.failurePhase);
			}
			return {
				status: "completed",
				output,
				value: captureCodeModeValue(JSON.parse(outcome.json), config.maxOutputBytes, input.retainFinalValue ? Math.min(config.memoryLimitBytes, config.maxSnapshotBytes) : config.maxOutputBytes)
			};
		}
	} catch (error) {
		channel?.notify({
			status: "failure",
			error: types.isNativeError(error) ? {
				name: error.name,
				message: error.message,
				stack: error.stack
			} : String(error),
			failurePhase: "guest"
		});
		const timeout = types.isNativeError(error) && error.message === "code mode timeout exceeded";
		if (cell && output.count === 0 && !timeout) output = progress.output();
		return failed(timeout ? "timeout" : error instanceof ToolInputError ? "invalid_input" : "internal_error", boundCodeModeError(timeout ? "code mode timeout exceeded" : cell ? guestError(error, cell.location) : error instanceof Error ? error.message : String(error), config.maxOutputBytes), timeout ? progress.output() : output);
	} finally {
		consume();
	}
}
serveWorkerTasks(async (input, channel) => {
	if (!isRecord(input) || !isRecord(input.config) || input.kind !== "exec" && input.kind !== "resume") return failed("invalid_input", "invalid code mode worker input");
	const result = await run(input, channel);
	if (cell?.networkContentObserved) result.networkContentObserved = true;
	if (result.status !== "waiting") cell = void 0;
	return result;
}, { idleGc: false });
//#endregion
export {};
