import { n as findModel } from "./catalog-Bgbx4LHv.mjs";
import { i as UnsupportedInputError, t as OnnxWorkerError } from "./protocol-lN8zQ8J3.mjs";
import { n as readModelArtifact, r as resolveModelFiles } from "./artifacts-Du35Uk5d.mjs";
import { Tokenizer } from "@huggingface/tokenizers";
import { InferenceSession, Tensor } from "onnxruntime-node";
//#region extensions/onnx/src/models/tokenize.ts
function tokenIds(value) {
	return Array.isArray(value) && value.every((id) => typeof id === "number" && Number.isSafeInteger(id) && id >= 0);
}
function encodeModelText(tokenizer, text, options) {
	const encoded = tokenizer.encode(text, options);
	if (!encoded || typeof encoded !== "object" || !("ids" in encoded) || !("attention_mask" in encoded) || !tokenIds(encoded.ids) || !tokenIds(encoded.attention_mask) || encoded.ids.length === 0 || encoded.ids.length !== encoded.attention_mask.length || encoded.attention_mask.some((mask) => mask !== 0 && mask !== 1)) throw new Error("Tokenizer returned invalid native tensor inputs.");
	return {
		ids: encoded.ids,
		attention_mask: encoded.attention_mask
	};
}
//#endregion
//#region extensions/onnx/src/models/deberta.ts
function createDebertaAdapter({ session, tokenizer, maxTokens }) {
	return { async classify({ text, labels, instructions, descriptions }) {
		const premise = instructions ? `${instructions}\n${text}` : text;
		const encoded = labels.map((label) => {
			const hypothesis = descriptions?.[label] ?? `This example is ${label}.`;
			const pair = encodeModelText(tokenizer, premise, {
				text_pair: hypothesis,
				add_special_tokens: true
			});
			if (pair.ids.length > maxTokens) throw new UnsupportedInputError("DeBERTa input exceeds its token limit; shorten the state or rubric.");
			return pair;
		});
		const logits = [];
		const pad = tokenizer.token_to_id("[PAD]");
		if (pad === void 0) throw new Error("DeBERTa tokenizer is missing its padding token.");
		for (let offset = 0; offset < encoded.length; offset += 8) {
			const batch = encoded.slice(offset, offset + 8);
			const length = Math.max(...batch.map((pair) => pair.ids.length));
			const ids = new BigInt64Array(batch.length * length).fill(BigInt(pad));
			const attention = new BigInt64Array(ids.length);
			batch.forEach((pair, row) => {
				ids.set(BigInt64Array.from(pair.ids, BigInt), row * length);
				attention.set(BigInt64Array.from(pair.attention_mask, BigInt), row * length);
			});
			const shape = [batch.length, length];
			const scores = (await session.run({
				input_ids: new Tensor("int64", ids, shape),
				attention_mask: new Tensor("int64", attention, shape)
			})).logits;
			if (!scores || scores.type !== "float32" || scores.dims.length !== 2 || !(scores.data instanceof Float32Array) || scores.dims[0] !== batch.length || scores.dims[1] !== 2 || scores.data.length !== batch.length * 2) throw new Error("DeBERTa returned an invalid entailment tensor.");
			for (let row = 0; row < batch.length; row++) {
				const entailment = scores.data[row * 2];
				if (!Number.isFinite(entailment)) throw new Error("DeBERTa returned non-finite logits.");
				logits.push(entailment);
			}
		}
		return {
			logits,
			inputTokens: encoded.reduce((sum, pair) => sum + pair.ids.length, 0)
		};
	} };
}
//#endregion
//#region extensions/onnx/src/models/gliclass.ts
function createGliclassAdapter(context) {
	const labelToken = context.tokenizer.token_to_id("<<LABEL>>");
	const separatorToken = context.tokenizer.token_to_id("<<SEP>>");
	const exampleToken = context.tokenizer.token_to_id("<<EXAMPLE>>");
	if (labelToken === void 0 || separatorToken === void 0 || labelToken === separatorToken) throw new Error("GLiClass tokenizer is missing its label and separator tokens.");
	return { async classify(input) {
		const labels = input.labels.map((label) => input.descriptions?.[label] ?? label);
		const text = input.instructions ? `${input.instructions}\n${input.text}` : input.text;
		if (labels.length < 2 || labels.length > 64 || labels.some((label) => !label.trim()) || new Set(labels).size !== labels.length || [text, ...labels].some((value) => /<<LABEL>>|<<SEP>>|<<EXAMPLE>>/.test(value.normalize("NFKC")))) throw new UnsupportedInputError("GLiClass requires 2–64 distinct labels and input without its reserved markers.");
		const packed = `${labels.map((label) => `<<LABEL>>${label}`).join("")}<<SEP>>${text}`;
		const encoded = encodeModelText(context.tokenizer, packed);
		if (encoded.ids.length > context.maxTokens) throw new UnsupportedInputError(`GLiClass input exceeds its ${context.maxTokens}-token limit; shorten the state or rubric.`);
		if (encoded.ids.filter((token) => token === labelToken).length !== labels.length || encoded.ids.filter((token) => token === separatorToken).length !== 1 || exampleToken !== void 0 && encoded.ids.includes(exampleToken)) throw new UnsupportedInputError("GLiClass input changes the number of rubric markers.");
		const shape = [1, encoded.ids.length];
		const scores = (await context.session.run({
			input_ids: new Tensor("int64", BigInt64Array.from(encoded.ids, BigInt), shape),
			attention_mask: new Tensor("int64", BigInt64Array.from(encoded.attention_mask, BigInt), shape)
		})).logits;
		if (!scores || scores.type !== "float32" || !(scores.data instanceof Float32Array) || scores.dims.length !== 2 || scores.dims[0] !== 1 || scores.dims[1] !== labels.length || scores.data.length !== labels.length) throw new Error("GLiClass returned an invalid label-logit shape.");
		const logits = Array.from(scores.data);
		if (logits.some((value) => !Number.isFinite(value))) throw new Error("GLiClass returned non-finite label logits.");
		return {
			logits,
			inputTokens: encoded.ids.length
		};
	} };
}
//#endregion
//#region extensions/onnx/src/models/gliner.ts
const WORDS = /(?:https?:\/\/[^\s]+|www\.[^\s]+)|[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}|@[a-z0-9_]+|[\p{L}\p{N}_]+(?:[-_][\p{L}\p{N}_]+)*|\S/giu;
const RESERVED = /\[(?:P|L|C|E|R|DESCRIPTION|EXAMPLE|OUTPUT|SEP_TEXT|SEP_STRUCT)\]|[()]/u;
function indices(values) {
	return new Tensor("int64", BigInt64Array.from(values, BigInt), [1, values.length]);
}
function mask(length, value = 1) {
	return new Tensor("float32", new Float32Array(length).fill(value), [1, length]);
}
function createGlinerAdapter({ session, tokenizer, maxTokens }) {
	return { async classify({ text, labels, task, instructions, descriptions }) {
		if ([
			task,
			...labels,
			instructions,
			...labels.map((label) => descriptions?.[label])
		].some((value) => value !== void 0 && (!value.trim() || RESERVED.test(value)))) throw new UnsupportedInputError("GLiNER2.5 rubric contains an empty or reserved schema token.");
		let prompt = instructions ? `${task}: ${instructions}` : task;
		for (const label of labels) if (descriptions?.[label]) prompt += ` [DESCRIPTION] ${label}: ${descriptions[label]}`;
		const inputIds = [];
		const append = (token) => {
			const encoded = encodeModelText(tokenizer, token, { add_special_tokens: false }).ids;
			if (encoded.length === 0 || inputIds.length + encoded.length > maxTokens) throw new UnsupportedInputError("GLiNER2.5 input exceeds the token limit or is empty.");
			inputIds.push(...encoded);
		};
		for (const token of [
			"(",
			"[P]",
			prompt,
			"("
		]) append(token);
		const classificationPositions = [];
		for (const label of labels) {
			classificationPositions.push(inputIds.length);
			append("[L]");
			append(label);
		}
		for (const token of [
			")",
			")",
			"[SEP_TEXT]"
		]) append(token);
		const normalized = /[.!?]$/.test(text) ? text : `${text}.`;
		const wordPositions = [];
		for (const match of normalized.matchAll(WORDS)) {
			wordPositions.push(inputIds.length);
			append(match[0].toLowerCase());
		}
		const feeds = {
			input_ids: indices(inputIds),
			attention_mask: indices(inputIds.map(() => 1)),
			text_word_indices: indices(wordPositions),
			text_word_mask: mask(wordPositions.length),
			query_marker_indices: indices([0]),
			query_marker_mask: mask(1, 0),
			cls_marker_indices: indices(classificationPositions),
			cls_marker_mask: mask(labels.length),
			rel_marker_indices: indices([0]),
			rel_marker_mask: mask(1, 0)
		};
		const output = (await session.run(feeds, ["cls_logits"])).cls_logits;
		if (!output || output.type !== "float32" || output.dims.length !== 2 || output.dims[0] !== 1 || output.dims[1] !== labels.length) throw new Error("GLiNER2.5 returned an invalid classification tensor.");
		const logits = Array.from(output.data, Number);
		if (logits.some((value) => !Number.isFinite(value))) throw new Error("GLiNER2.5 returned non-finite classification logits.");
		return {
			logits,
			inputTokens: inputIds.length
		};
	} };
}
//#endregion
//#region extensions/onnx/src/model-loader.ts
function jsonObject(data) {
	const parsed = JSON.parse(data.toString("utf8"));
	if (parsed === null || typeof parsed !== "object" || Array.isArray(parsed)) throw new OnnxWorkerError("model-integrity");
	return parsed;
}
var ModelCache = class {
	constructor(config) {
		this.config = config;
		this.models = /* @__PURE__ */ new Map();
	}
	async get(id) {
		const existing = this.models.get(id);
		if (existing) {
			this.models.delete(id);
			this.models.set(id, existing);
			return existing.adapter;
		}
		const model = findModel(id);
		if (!model) throw new UnsupportedInputError("Unknown ONNX model.");
		const files = await resolveModelFiles(this.config.modelDir, model);
		const buffers = /* @__PURE__ */ new Map();
		for (const file of files) buffers.set(file.name, await readModelArtifact(this.config.modelDir, model, file));
		const modelBytes = buffers.get("model.onnx");
		const tokenizerBytes = buffers.get("tokenizer.json");
		if (!modelBytes || !tokenizerBytes) throw new OnnxWorkerError("model-integrity");
		const tokenizerConfig = buffers.get("tokenizer_config.json");
		const tokenizer = new Tokenizer(jsonObject(tokenizerBytes), tokenizerConfig ? jsonObject(tokenizerConfig) : {});
		if (this.models.size >= this.config.maxLoadedModels) {
			const first = this.models.entries().next().value;
			if (first) {
				this.models.delete(first[0]);
				await first[1].session.release();
			}
		}
		const session = await InferenceSession.create(modelBytes, {
			executionProviders: ["cpu"],
			intraOpNumThreads: this.config.threads,
			interOpNumThreads: 1,
			logSeverityLevel: 3
		});
		try {
			const context = {
				session,
				tokenizer,
				maxTokens: model.maxTokens
			};
			const adapter = model.family === "gliclass" ? createGliclassAdapter(context) : model.family === "gliner" ? createGlinerAdapter(context) : createDebertaAdapter(context);
			this.models.set(id, {
				session,
				adapter
			});
			return adapter;
		} catch (error) {
			await session.release();
			throw error;
		}
	}
};
//#endregion
export { ModelCache };
