import { n as findModel } from "./catalog-g9or975s.mjs";
import { n as UnsupportedInputError, t as OnnxWorkerError } from "./protocol-CG1ILdRP.mjs";
import { resolveRuntimeWorkerArgv, spawnOomScoreAdjusted } from "openclaw/plugin-sdk/process-runtime";
import { isDecisionBatchV1Representable, validateDecisionResultV2 } from "openclaw/plugin-sdk/decisions";
import { createDeferred } from "openclaw/plugin-sdk/concurrency-runtime";
import { Guard } from "typebox/guard";
// extensions/onnx/src/decision-codec.ts
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
	const max = Math.max(...logits);
	const weights = logits.map((value) => Math.exp(value - max));
	const sum = weights.reduce((total, value) => total + value, 0);
	return weights.map((value) => value / sum);
}
function encodeOnnxDecisionInputs(state, questions) {
	const entries = Object.entries(questions);
	const text = render(state);
	return {
		entries,
		inputs: entries.map(([, question]) => {
			const selected = rubric(question);
			return {
				text,
				task: "decision",
				...selected,
				...question.instructions == null ? {} : { instructions: render(question.instructions) }
			};
		})
	};
}
function decodeOnnxDecisionResults(model, { entries, inputs }, results) {
	const answers = /* @__PURE__ */ new Map();
	let inputTokens = 0;
	entries.forEach(([id, question], index) => {
		const result = results[index];
		const labels = inputs[index].labels;
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
		model,
		answers: Object.fromEntries(answers),
		usage: { inputTokens }
	};
}
// extensions/onnx/src/decision-execution.ts
async function executeOnnxDecision(execution, client, warn) {
	execution.signal.throwIfAborted();
	if (!findModel(execution.modelId)) return {
		status: "unavailable",
		reason: "unsupported-input"
	};
	try {
		const encoded = encodeOnnxDecisionInputs(execution.state, execution.questions);
		const results = await client.classify(execution.modelId, encoded.inputs, execution.signal, execution.isAdmissible);
		execution.signal.throwIfAborted();
		return {
			status: "ok",
			result: decodeOnnxDecisionResults(execution.modelId, encoded, results)
		};
	} catch (error) {
		execution.signal.throwIfAborted();
		if (error instanceof UnsupportedInputError || error instanceof OnnxWorkerError && error.code === "unsupported-input") return {
			status: "unavailable",
			reason: "unsupported-input"
		};
		if (error instanceof OnnxWorkerError) {
			if (error.code === "model-missing" || error.code === "model-integrity") warn(`ONNX model ${execution.modelId} is missing or invalid. Run openclaw onnx verify ${execution.modelId}; use download or prepare a local export as listed by openclaw onnx models.`);
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
// extensions/onnx/src/decisions.ts
/** The standalone CLI still consumes the V1 data contract. */
function createOnnxProvider(client, warn) {
	return {
		id: "onnx",
		contractVersion: 1,
		evaluate(batch, context) {
			return executeOnnxDecision({
				modelId: context.model,
				state: batch.state,
				questions: batch.questions,
				signal: context.signal,
				isAdmissible: context.isAdmissible
			}, client, warn);
		}
	};
}
function createPreparedOnnxProvider(client, warn) {
	return {
		id: "onnx",
		contractVersion: 2,
		provider: {
			label: "ONNX",
			auth: [],
			authScope: "plugin",
			resolveSyntheticAuth: () => ({
				apiKey: "onnx-local",
				source: "onnx plugin",
				mode: "api-key"
			}),
			augmentModelCatalog: ({ entries }) => {
				const models = [];
				for (const entry of entries) {
					if (entry.provider !== "onnx") continue;
					const inference = entry.inference;
					if (!inference?.decision || inference.decision.protocol !== "decision-v1") {
						models.push(entry);
						continue;
					}
					const decision = inference.decision;
					models.push({
						...entry,
						inference: {
							...inference,
							decision: {
								...decision,
								protocol: "onnx-classifier",
								questions: {
									boolean: {
										...decision.questions?.boolean,
										probabilities: "boolean",
										abstention: false,
										requiresCriteria: true
									},
									choice: {
										...decision.questions?.choice,
										probabilities: "categorical",
										abstention: false,
										minOptions: 2
									},
									score: {
										...decision.questions?.score,
										probabilities: "categorical",
										abstention: false,
										minOptions: 2
									}
								},
								reasoning: { modes: ["auto"] }
							}
						}
					});
				}
				return models;
			}
		},
		async evaluate(batch, context) {
			if (!isDecisionBatchV1Representable(batch) || context.reasoning !== void 0 && context.reasoning !== "auto") return {
				status: "unavailable",
				reason: "unsupported-input"
			};
			const outcome = await executeOnnxDecision({
				modelId: context.model.id,
				state: batch.state.type === "text" ? batch.state.text : batch.state.value,
				questions: batch.questions,
				signal: context.signal,
				isAdmissible: context.isAdmissible
			}, client, warn);
			if (outcome.status !== "ok") return outcome;
			return validateDecisionResultV2(batch, outcome.result) ? outcome : {
				status: "unavailable",
				reason: "invalid-response"
			};
		}
	};
}
// extensions/onnx/src/worker-client.ts
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
		this.closed = false;
		this.workerUrl = options.workerUrl;
		this.config = options.config;
	}
	async classify(model, inputs, signal, isAdmissible) {
		signal.throwIfAborted();
		if (!model.length || !Guard.IsMaxLength(model, 128) || inputs.length < 1 || inputs.length > 32) throw new OnnxWorkerError("unsupported-input");
		let bytes = 0;
		for (const input of inputs) {
			bytes += Buffer.byteLength(JSON.stringify(input));
			if (!Guard.IsMaxLength(input.text, 262144) || input.labels.length < 2 || input.labels.length > 64 || input.labels.some((label) => !label.length || !Guard.IsMaxLength(label, 16384)) || !input.task.length || !Guard.IsMaxLength(input.task, 1024) || !Guard.IsMaxLength(input.instructions ?? "", 16384) || Object.values(input.descriptions ?? {}).some((value) => !Guard.IsMaxLength(value, 16384)) || bytes > 1048576) throw new OnnxWorkerError("unsupported-input");
		}
		return (await this.enqueue({
			kind: "classify",
			model,
			inputs
		}, signal, isAdmissible)).results;
	}
	async warm(models, signal) {
		await this.enqueue({
			kind: "warm",
			models
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
	enqueue(request, signal, isAdmissible) {
		signal.throwIfAborted();
		if (this.closed || this.queue.length + (this.active ? 1 : 0) >= 4) return Promise.reject(new OnnxWorkerError("runtime"));
		return new Promise((resolve, reject) => {
			const task = {
				request,
				signal,
				isAdmissible,
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
		try {
			if (task.isAdmissible && !task.isAdmissible()) throw new OnnxWorkerError("runtime");
		} catch (error) {
			this.finish(void 0, error);
			return;
		}
		if (!this.worker) {
			try {
				this.start(task.request);
			} catch {
				this.finish(void 0, new OnnxWorkerError("runtime"));
			}
			return;
		}
		this.send(this.worker, task.request);
	}
	start(request) {
		const child = spawnOomScoreAdjusted(process.execPath, resolveRuntimeWorkerArgv(this.workerUrl), {
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
		const { promise: closed, resolve: resolveClosed } = createDeferred();
		const worker = {
			child,
			retiring: false,
			closed,
			resolveClosed
		};
		this.worker = worker;
		child.on("message", (reply) => this.receive(worker, reply));
		const onFailure = () => {
			if (this.worker === worker) this.retire(new OnnxWorkerError("runtime"));
		};
		child.on("error", onFailure);
		child.once("disconnect", onFailure);
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
		this.send(worker, request);
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
	receive(worker, reply) {
		if (this.worker !== worker || worker.retiring) return;
		if (reply.kind === "error") {
			this.finish(void 0, new OnnxWorkerError(reply.code));
			return;
		}
		this.finish(reply);
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
export { createOnnxProvider as n, createPreparedOnnxProvider as r, InferenceWorkerClient as t };
