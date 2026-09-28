import { n as findModel } from "./catalog-Bgbx4LHv.mjs";
import { i as UnsupportedInputError, n as parseWorkerReply, r as parseWorkerRequest, t as OnnxWorkerError } from "./protocol-lN8zQ8J3.mjs";
import { spawn } from "node:child_process";
import { resolveRuntimeWorkerArgv } from "openclaw/plugin-sdk/process-runtime";
//#region extensions/onnx/src/decisions.ts
function render(value) {
	return typeof value === "string" ? value : JSON.stringify(value);
}
function rubric(question) {
	if (question.type === "choice") {
		const labels = Object.keys(question.criteria);
		return {
			labels,
			descriptions: Object.fromEntries(labels.map((label) => {
				const value = question.criteria[label];
				return [label, value === null || value === void 0 ? label : render(value)];
			}))
		};
	}
	if (question.type === "score") return {
		labels: question.criteria.map((_, index) => String(index)),
		descriptions: Object.fromEntries(question.criteria.flatMap((value, index) => value === null ? [] : [[String(index), render(value)]]))
	};
	if (question.criteria?.true == null || question.criteria.false == null) throw new UnsupportedInputError("ONNX Boolean questions require true and false criterion descriptions.");
	return {
		labels: ["true", "false"],
		descriptions: {
			true: render(question.criteria.true),
			false: render(question.criteria.false)
		}
	};
}
function probabilities(logits) {
	if (logits.length < 2 || logits.some((value) => !Number.isFinite(value))) throw new Error("ONNX returned invalid label logits.");
	const max = Math.max(...logits);
	const weights = logits.map((value) => Math.exp(value - max));
	const sum = weights.reduce((total, value) => total + value, 0);
	return weights.map((value) => value / sum);
}
function createOnnxProvider(client, warn) {
	return {
		id: "onnx",
		contractVersion: 1,
		async evaluate(batch, context) {
			context.signal.throwIfAborted();
			if (!findModel(context.model)) return {
				status: "unavailable",
				reason: "unsupported-input"
			};
			try {
				const entries = Object.entries(batch.questions);
				if (entries.length === 0 || entries.length > 32) throw new UnsupportedInputError("Unsupported batch size.");
				const text = render(batch.state);
				const inputs = entries.map(([, question]) => {
					const selected = rubric(question);
					if (selected.labels.length < 2 || selected.labels.length > 64) throw new UnsupportedInputError("Unsupported label count.");
					return {
						text,
						task: "decision",
						...selected,
						...question.instructions == null ? {} : { instructions: render(question.instructions) }
					};
				});
				const results = await client.classify(context.model, inputs, context.signal);
				context.signal.throwIfAborted();
				if (results.length !== entries.length) throw new Error("ONNX returned an incomplete batch.");
				const answers = /* @__PURE__ */ new Map();
				let inputTokens = 0;
				entries.forEach(([id, question], index) => {
					const result = results[index];
					const labels = inputs[index].labels;
					if (result.logits.length !== labels.length) throw new Error("ONNX returned an incomplete distribution.");
					const values = probabilities(result.logits);
					inputTokens += result.inputTokens;
					if (question.type === "boolean") answers.set(id, {
						type: "boolean",
						probabilityTrue: values[0]
					});
					else if (question.type === "score") {
						const score = Math.min(values.length - 1, values.reduce((sum, value, position) => sum + value * position, 0));
						answers.set(id, {
							type: "score",
							score,
							probabilities: values
						});
					} else {
						const best = values.indexOf(Math.max(...values));
						answers.set(id, {
							type: "choice",
							choice: labels[best],
							probabilities: Object.fromEntries(labels.map((label, position) => [label, values[position]]))
						});
					}
				});
				return {
					status: "ok",
					result: {
						model: context.model,
						answers: Object.fromEntries(answers),
						usage: { inputTokens }
					}
				};
			} catch (error) {
				context.signal.throwIfAborted();
				if (error instanceof UnsupportedInputError || error instanceof OnnxWorkerError && error.code === "unsupported-input") return {
					status: "unavailable",
					reason: "unsupported-input"
				};
				if (error instanceof OnnxWorkerError) {
					if (error.code === "model-missing" || error.code === "model-integrity") warn(`ONNX model ${context.model} is missing or invalid. Run openclaw onnx verify ${context.model}; use download or prepare a local export as listed by openclaw onnx models.`);
					else if (error.code === "dependency-unavailable") warn("ONNX Runtime is unavailable. Install the optional ONNX plugin dependencies for this platform.");
					return {
						status: "unavailable",
						reason: "transport"
					};
				}
				return {
					status: "unavailable",
					reason: "invalid-response"
				};
			}
		}
	};
}
//#endregion
//#region extensions/onnx/src/worker-client.ts
function workerEnv() {
	const env = {};
	for (const key of [
		"SystemRoot",
		"SYSTEMROOT",
		"WINDIR",
		"TEMP",
		"TMP",
		"TMPDIR"
	]) if (process.env[key]) env[key] = process.env[key];
	return env;
}
/** One warm, OS-killable inference process; native work retains its slot until close. */
var InferenceWorkerClient = class {
	constructor(options) {
		this.queue = [];
		this.nextId = 0;
		this.closed = false;
		this.workerUrl = new URL(options.workerUrl.href);
		this.config = { ...options.config };
	}
	async classify(model, inputs, signal) {
		const reply = await this.enqueue({
			kind: "classify",
			id: ++this.nextId,
			model,
			inputs: inputs.map((input) => ({
				...input,
				labels: [...input.labels]
			}))
		}, signal);
		if (reply.kind !== "results") throw new OnnxWorkerError("runtime");
		return reply.results;
	}
	async warm(models, signal) {
		await this.enqueue({
			kind: "warm",
			id: ++this.nextId,
			models: [...models]
		}, signal);
	}
	stop() {
		if (this.stopping) return this.stopping;
		this.closed = true;
		for (const task of this.queue.splice(0)) {
			task.signal.removeEventListener("abort", task.abort);
			task.reject(new OnnxWorkerError("runtime"));
		}
		const worker = this.worker;
		this.retire(new OnnxWorkerError("runtime"));
		this.stopping = worker?.closed ?? Promise.resolve();
		return this.stopping;
	}
	enqueue(request, signal) {
		signal.throwIfAborted();
		try {
			parseWorkerRequest(request);
		} catch {
			return Promise.reject(new OnnxWorkerError("unsupported-input"));
		}
		if (this.closed || this.queue.length + (this.active ? 1 : 0) >= 4) return Promise.reject(new OnnxWorkerError("runtime"));
		return new Promise((resolve, reject) => {
			const task = {
				request,
				signal,
				sent: false,
				resolve,
				reject,
				abort: () => this.cancel(task)
			};
			this.queue.push(task);
			signal.addEventListener("abort", task.abort, { once: true });
			if (signal.aborted) this.cancel(task);
			else this.dispatch();
		});
	}
	cancel(task) {
		if (this.active === task) {
			this.retire(task.signal.reason);
			return;
		}
		const index = this.queue.indexOf(task);
		if (index !== -1) {
			this.queue.splice(index, 1);
			task.signal.removeEventListener("abort", task.abort);
			task.reject(task.signal.reason);
		}
	}
	dispatch() {
		if (this.closed || this.active || this.worker?.retiring) return;
		const task = this.queue.shift();
		if (!task) return;
		this.active = task;
		if (!this.worker) {
			try {
				this.start();
			} catch {
				this.finish(void 0, new OnnxWorkerError("runtime"));
			}
			return;
		}
		if (this.worker.ready) {
			this.send(this.worker, task.request);
			task.sent = true;
		}
	}
	start() {
		const child = spawn(process.execPath, resolveRuntimeWorkerArgv(this.workerUrl), {
			env: workerEnv(),
			shell: false,
			windowsHide: true,
			stdio: [
				"ignore",
				"ignore",
				"ignore",
				"ipc"
			]
		});
		let resolveClosed;
		const worker = {
			child,
			ready: false,
			retiring: false,
			closed: new Promise((resolve) => {
				resolveClosed = resolve;
			}),
			resolveClosed: () => resolveClosed()
		};
		this.worker = worker;
		child.on("message", (message) => this.receive(worker, message));
		child.on("error", () => {
			if (this.worker === worker) this.retire(new OnnxWorkerError("runtime"));
		});
		child.once("disconnect", () => {
			if (this.worker === worker) this.retire(new OnnxWorkerError("runtime"));
		});
		child.once("close", () => {
			if (this.worker === worker) {
				this.worker = void 0;
				const task = this.active;
				if (task) this.finish(void 0, task.signal.aborted ? task.signal.reason : worker.failure ?? new OnnxWorkerError("runtime"));
				else this.dispatch();
			}
			worker.resolveClosed();
		});
		this.send(worker, {
			kind: "init",
			config: this.config
		});
	}
	send(worker, request) {
		try {
			worker.child.send(request, (error) => {
				if (error && this.worker === worker) this.retire(new OnnxWorkerError("runtime"));
			});
		} catch {
			if (this.worker === worker) this.retire(new OnnxWorkerError("runtime"));
		}
	}
	receive(worker, message) {
		if (this.worker !== worker || worker.retiring) return;
		let reply;
		try {
			reply = parseWorkerReply(message);
		} catch {
			this.retire(new OnnxWorkerError("runtime"));
			return;
		}
		const task = this.active;
		if (reply.kind === "ready" && !worker.ready && task) {
			worker.ready = true;
			task.sent = true;
			this.send(worker, task.request);
			return;
		}
		if (!worker.ready || !task?.sent || reply.kind === "ready" || reply.id !== task.request.id) {
			this.retire(new OnnxWorkerError("runtime"));
			return;
		}
		if (reply.kind === "error") {
			this.finish(void 0, new OnnxWorkerError(reply.code));
			return;
		}
		const request = task.request;
		if (reply.kind === "warmed" && request.kind === "warm" || reply.kind === "results" && request.kind === "classify" && reply.results.length === request.inputs.length && reply.results.every((result, index) => result.logits.length === request.inputs[index]?.labels.length && result.logits.every(Number.isFinite))) this.finish(reply);
		else this.retire(new OnnxWorkerError("runtime"));
	}
	finish(reply, failure) {
		const task = this.active;
		if (!task) return;
		this.active = void 0;
		task.signal.removeEventListener("abort", task.abort);
		if (reply) task.resolve(reply);
		else task.reject(failure);
		this.dispatch();
	}
	retire(failure) {
		const worker = this.worker;
		if (!worker || worker.retiring) return;
		worker.retiring = true;
		worker.failure = failure;
		worker.child.kill("SIGKILL");
	}
};
//#endregion
export { createOnnxProvider as n, InferenceWorkerClient as t };
