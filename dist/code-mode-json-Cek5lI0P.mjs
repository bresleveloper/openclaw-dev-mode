import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { t as truncateUtf8Prefix } from "./utf8-truncate-_hf7tp13.mjs";
import { r as jsonUtf8Bytes } from "./json-utf8-bytes-fm9i4b7G.mjs";
import { s as toolResultFitsBudget } from "./tool-result-limits-B-fhY8wF.mjs";
import { a as wrapExternalContent, i as truncateSanitizedExternalContent } from "./external-content-CLufk6dK.mjs";
//#region src/agents/code-mode-json-fit.ts
function createJsonPrefixFitter(text, maxBytes, overhead) {
	const bytes = Buffer.byteLength(text, "utf8");
	let encoded;
	let completeBytes;
	const checkpoints = [];
	let nextCheckpoint = 256;
	return (limit) => {
		if (limit <= 0) return "";
		if (bytes <= limit && (completeBytes ??= jsonUtf8Bytes(text)) + overhead(bytes) <= limit) return text;
		encoded ??= Buffer.from(text.slice(0, Math.ceil(Math.min(bytes, maxBytes))));
		let end = 0;
		let jsonBytes = 2;
		let low = 0;
		let high = checkpoints.length - 1;
		while (low <= high) {
			const middle = low + high >>> 1;
			const checkpoint = checkpoints[middle];
			if (checkpoint.end <= limit && checkpoint.jsonBytes + overhead(checkpoint.end) <= limit) {
				end = checkpoint.end;
				jsonBytes = checkpoint.jsonBytes;
				low = middle + 1;
			} else high = middle - 1;
		}
		while (end < encoded.byteLength) {
			const byte = encoded[end];
			const width = byte < 128 ? 1 : byte < 224 ? 2 : byte < 240 ? 3 : 4;
			const next = end + width;
			if (next >= bytes || next > limit) break;
			jsonBytes += byte === 34 || byte === 92 || byte === 8 || byte === 9 || byte === 10 || byte === 12 || byte === 13 ? 2 : byte < 32 ? 6 : width;
			if (jsonBytes + overhead(next) > limit) break;
			end = next;
			if (end >= nextCheckpoint) {
				checkpoints.push({
					end,
					jsonBytes
				});
				nextCheckpoint = end + 256;
			}
		}
		return encoded.subarray(0, end).toString("utf8");
	};
}
//#endregion
//#region src/agents/code-mode-result-preview.ts
const MAX_REFERENCE_BYTES = 768;
const MAX_VISITS = 128;
const MAX_DEPTH = 5;
const MAX_KEYS = 16;
const MAX_ARRAYS = 8;
function sampleIndices(length) {
	return length ? [.../* @__PURE__ */ new Set([
		0,
		Math.floor(length / 2),
		length - 1
	])] : [];
}
function kind(value) {
	return value === null ? "null" : Array.isArray(value) ? "array" : typeof value;
}
function previewText(value, maxBytes) {
	const prefix = truncateUtf8Prefix(value, maxBytes);
	return prefix === value ? value : `${prefix}…`;
}
function sampleShape(value) {
	if (!isRecord(value)) return kind(value);
	const fields = [];
	for (const key in value) {
		if (!Object.hasOwn(value, key)) continue;
		fields.push(`${JSON.stringify(previewText(key, 40))}:${kind(value[key])}`);
		if (fields.length === 6) break;
	}
	return `{${fields.join(",")}}`;
}
function sampledValue(value, depth = 0) {
	if (typeof value === "string") return previewText(value, 48);
	if (!isRecord(value) && !Array.isArray(value)) return value;
	if (depth >= 2) return Array.isArray(value) ? `[array: ${value.length} items]` : "[object]";
	if (Array.isArray(value)) return value.slice(0, 2).map((item) => sampledValue(item, depth + 1));
	const sample = Object.create(null);
	let keys = 0;
	for (const key in value) if (Object.hasOwn(value, key)) {
		sample[previewText(key, 40)] = sampledValue(value[key], depth + 1);
		if (++keys === 6) break;
	}
	return sample;
}
function envelopeFields(value) {
	if (!isRecord(value)) return;
	const candidates = [];
	let examined = 0;
	for (const key in value) {
		if (!Object.hasOwn(value, key)) continue;
		if (++examined > MAX_KEYS) break;
		const item = value[key];
		if ((item === null || typeof item !== "object") && (typeof item !== "string" || item.length <= 48)) candidates.push([previewText(key, 40), item]);
	}
	candidates.sort((a, b) => Number(typeof a[1] === "string") - Number(typeof b[1] === "string"));
	const fields = Object.create(null);
	let kept = 0;
	for (const [key, item] of candidates) {
		fields[key] = item;
		if (jsonUtf8Bytes(fields) > 96) delete fields[key];
		else if (++kept === 4) break;
	}
	return kept ? fields : void 0;
}
function inspectArrays(value) {
	const queue = [{
		value,
		path: "$",
		depth: 0
	}];
	const arrays = [];
	let limited = false;
	for (const entry of queue) {
		if (!isRecord(entry.value) && !Array.isArray(entry.value)) continue;
		if (Array.isArray(entry.value)) {
			arrays.push({
				path: entry.path,
				value: entry.value
			});
			arrays.sort((a, b) => b.value.length - a.value.length || (a.path < b.path ? -1 : a.path > b.path ? 1 : 0));
			if (arrays.length > MAX_ARRAYS) {
				arrays.pop();
				limited = true;
			}
		}
		if (entry.depth === MAX_DEPTH) {
			limited = true;
			continue;
		}
		const enqueue = (child, path) => {
			if (queue.length >= MAX_VISITS || Buffer.byteLength(path) > 192) limited = true;
			else queue.push({
				value: child,
				path,
				depth: entry.depth + 1
			});
		};
		if (Array.isArray(entry.value)) {
			const indices = sampleIndices(entry.value.length);
			limited ||= indices.length < entry.value.length;
			for (const childIndex of indices) enqueue(entry.value[childIndex], `${entry.path}[${childIndex}]`);
			continue;
		}
		let keys = 0;
		for (const key in entry.value) {
			if (!Object.hasOwn(entry.value, key)) continue;
			if (++keys > MAX_KEYS) {
				limited = true;
				break;
			}
			if (key.length > 192) {
				limited = true;
				continue;
			}
			const segment = /^[A-Za-z_$][A-Za-z0-9_$]*$/u.test(key) ? `.${key}` : `[${JSON.stringify(key)}]`;
			enqueue(entry.value[key], entry.path + segment);
		}
	}
	return {
		arrays,
		limited
	};
}
/** Keep the usable identity intact; only descriptive samples may shrink. */
function fitCodeModeResultReference(reference, maxBytes) {
	if (jsonUtf8Bytes(reference) <= maxBytes) return reference;
	const minimal = {
		...reference,
		shape: "",
		preview: "",
		previewTruncated: true
	};
	const remaining = maxBytes - jsonUtf8Bytes(minimal);
	if (remaining < 0) return;
	const shapeBytes = 2 + Math.floor(remaining / 3);
	const shape = createJsonPrefixFitter(reference.shape, shapeBytes, () => 0)(shapeBytes);
	const previewBytes = 2 + remaining - (jsonUtf8Bytes(shape) - 2);
	const preview = createJsonPrefixFitter(reference.preview, previewBytes, () => 0)(previewBytes);
	return {
		...minimal,
		shape,
		preview
	};
}
function createCodeModeResultReference(id, json, value) {
	const { arrays, limited } = inspectArrays(value);
	const samples = arrays.map(({ path, value: items }) => {
		const indices = sampleIndices(items.length);
		const shapes = [...new Set(indices.map((index) => sampleShape(items[index])))];
		return {
			path,
			count: items.length,
			observed: `sampled ${indices.length}/${items.length}${shapes.length > 1 ? " heterogeneous" : ""}: ${shapes.join(" | ")}`,
			items: indices.map((index) => ({
				index,
				value: sampledValue(items[index])
			}))
		};
	});
	const bytes = Buffer.byteLength(json, "utf8");
	const fitted = fitCodeModeResultReference({
		id,
		bytes,
		count: Array.isArray(value) ? value.length : value !== null && typeof value === "object" ? Object.keys(value).length : 1,
		shape: `${limited ? "limited traversal; " : ""}${samples.length ? samples.map((sample) => `${sample.path}: ${sample.count} items, ${sample.observed}`).join("; ") : sampleShape(value)}`,
		preview: bytes <= 256 ? json : JSON.stringify(samples.length ? {
			sampled: true,
			traversalLimited: limited,
			fields: envelopeFields(value),
			arrays: samples.map(({ observed: _observed, ...sample }) => sample)
		} : {
			sampled: true,
			traversalLimited: limited,
			value: sampledValue(value)
		}),
		previewTruncated: bytes > 256
	}, MAX_REFERENCE_BYTES);
	if (!fitted) throw new Error("Code Mode reference identity exceeds its descriptor allowance.");
	return fitted;
}
//#endregion
//#region src/agents/tool-search-control-result.ts
/** Shared by budget fitting and delivery so formatting cannot consume unreserved context. */
function serializeToolSearchControlResult(payload, compact = false) {
	return JSON.stringify(payload, null, compact ? void 0 : 2);
}
/** Shared by the source projector and final formatter; no terminal receipts are consumed here. */
function renderToolSearchControlText(text, networkContent) {
	if (!networkContent) return {
		text,
		truncated: false
	};
	const bounded = text.length <= 2e4 ? truncateSanitizedExternalContent(text, 2e4) : void 0;
	const truncated = bounded?.truncated ?? true;
	const modelText = !bounded || bounded.truncated ? `${truncateSanitizedExternalContent(text, 19988).text}\n[truncated]` : bounded.text;
	return {
		text: wrapExternalContent(modelText, { source: "api" }),
		truncated
	};
}
//#endregion
//#region src/agents/code-mode-json.ts
function toCodeModeJsonSafe(value) {
	if (value === void 0) return null;
	if (value === null || typeof value === "string" || typeof value === "boolean") return value;
	return JSON.parse(stringifyCodeModeJsonSafe(value));
}
/** Serialize once before checking a data allowance; detachment can happen after admission. */
function stringifyCodeModeJsonSafe(value) {
	try {
		return JSON.stringify(value) ?? "null";
	} catch {
		if (value instanceof Error) return JSON.stringify({
			name: value.name,
			message: value.message
		});
		switch (typeof value) {
			case "number": return JSON.stringify(value);
			case "bigint":
			case "symbol":
			case "function": return JSON.stringify(String(value));
			default: return JSON.stringify(Object.prototype.toString.call(value));
		}
	}
}
const EMPTY_CODE_MODE_OUTPUT = {
	count: 0,
	source: {
		kind: "complete",
		json: "[]"
	}
};
function sourceBytes(source) {
	return source.kind === "prefix" ? source.originalBytes : Buffer.byteLength(source.json, "utf8");
}
function retainSource(json, originalBytes, maxBytes) {
	return originalBytes <= maxBytes ? {
		kind: "complete",
		json
	} : {
		kind: "prefix",
		json: truncateUtf8Prefix(json, maxBytes),
		originalBytes
	};
}
/** Capture after guest conversion, before any public projection discards source facts. */
function captureCodeModeValue(value, maxBytes, structuredMaxBytes = maxBytes) {
	const json = stringifyCodeModeJsonSafe(value);
	const allowance = json.startsWith("{") || json.startsWith("[") ? Math.max(maxBytes, structuredMaxBytes) : maxBytes;
	return retainSource(json, Buffer.byteLength(json, "utf8"), allowance);
}
function captureCodeModeOutput(output, maxBytes) {
	if (output.length === 0) return EMPTY_CODE_MODE_OUTPUT;
	const json = JSON.stringify(output.map(toCodeModeJsonSafe));
	return {
		count: output.length,
		source: retainSource(json, Buffer.byteLength(json, "utf8"), maxBytes)
	};
}
const TRUNCATION_GUIDANCE = "Output truncated; rerun with narrower args.";
const RETAINED_GUIDANCE = "Full result saved for this run; use results.load(reference.id) in a later exec.";
function retainedMarker(reference, maxBytes) {
	const fitted = fitCodeModeResultReference(reference, maxBytes - (jsonUtf8Bytes({
		truncated: true,
		reference: null,
		guidance: RETAINED_GUIDANCE
	}) - 4));
	return fitted ? {
		truncated: true,
		reference: fitted,
		guidance: RETAINED_GUIDANCE
	} : void 0;
}
function createTruncationMarker(source, maxBytes, guidance = TRUNCATION_GUIDANCE) {
	const originalBytes = sourceBytes(source);
	const marker = {
		truncated: true,
		omittedBytes: originalBytes,
		guidance,
		prefix: ""
	};
	const fixedBytes = jsonUtf8Bytes(marker) - 2 - String(originalBytes).length;
	const fit = createJsonPrefixFitter(source.json, maxBytes, (prefixBytes) => fixedBytes + String(originalBytes - prefixBytes).length);
	return (limit) => {
		const prefix = fit(limit);
		return {
			...marker,
			omittedBytes: originalBytes - Buffer.byteLength(prefix, "utf8"),
			prefix
		};
	};
}
function createErrorFitter(error, maxBytes) {
	const suffix = " [error truncated]";
	const fit = createJsonPrefixFitter(error, maxBytes, () => 18);
	return (limit) => `${fit(limit)}${suffix}`;
}
function boundCodeModeError(error, maxBytes) {
	return jsonUtf8Bytes(error) <= maxBytes ? error : createErrorFitter(error, maxBytes)(maxBytes);
}
/** One bounded cumulative source and delivery receipt, shared across every worker leg. */
var CodeModeOutputState = class {
	constructor(maxBytes, modelBudget) {
		this.maxBytes = maxBytes;
		this.modelBudget = modelBudget;
		this.source = EMPTY_CODE_MODE_OUTPUT;
		this.delivered = {
			kind: "entries",
			count: 0
		};
	}
	append(leg) {
		if (leg.count === 0) return;
		if (this.source.count === 0) {
			this.source = leg;
			return;
		}
		const previous = this.source.source;
		const originalBytes = sourceBytes(previous) + sourceBytes(leg.source) - 1;
		const json = previous.kind === "prefix" ? previous.json : previous.json.slice(0, -1) + "," + leg.source.json.slice(1);
		this.source = {
			count: this.source.count + leg.count,
			source: retainSource(json, originalBytes, this.maxBytes)
		};
	}
	take(params = {}) {
		return this.takeResult({}, params);
	}
	takeResult(metadata, params = {}, networkContent = false, retainValue) {
		const fit = (channels) => {
			const project = this.createProjector(channels);
			const fits = (candidate) => {
				const rendered = renderToolSearchControlText(serializeToolSearchControlResult({
					...metadata,
					...candidate.channels
				}, true), networkContent);
				return !rendered.truncated && toolResultFitsBudget(rendered.text, this.modelBudget);
			};
			const projection = project(this.maxBytes);
			if ((this.modelBudget || networkContent) && !fits(projection)) {
				let low = 0;
				let high = this.maxBytes - 1;
				let best;
				while (low <= high) {
					const middle = Math.floor((low + high) / 2);
					const candidate = project(middle);
					if (fits(candidate)) {
						best = candidate;
						low = middle + 1;
					} else high = middle - 1;
				}
				return best;
			}
			return projection;
		};
		const original = fit(params);
		if (!original) throw new Error("Model tool-result budget cannot fit Code Mode status; use a larger model context.");
		let projection = original;
		const fitNonRetention = (guidance) => fit({
			...params,
			valueGuidance: guidance
		}) ?? fit({
			...params,
			valueGuidance: "Not retained; return less data."
		}) ?? original;
		if (retainValue && params.value && projection.valueTruncated && (params.value.json.startsWith("{") || params.value.json.startsWith("["))) {
			const saved = retainValue(params.value);
			if ("reference" in saved) {
				let delivered = false;
				try {
					const retained = fit({
						...params,
						reference: saved.reference
					});
					if (retained?.referenceUsed) {
						projection = retained;
						delivered = true;
					} else projection = fitNonRetention("Not retained: reference exceeds output budget. Return less data.");
				} finally {
					if (!delivered) saved.release();
				}
			} else projection = fitNonRetention(saved.reason);
		}
		const prior = this.delivered;
		const { channels, receipt } = projection;
		this.delivered = receipt;
		const output = receipt.kind === "entries" ? channels.output.slice(prior.kind === "entries" ? prior.count : 0) : prior.kind === "summary" && prior.originalBytes === receipt.originalBytes && prior.prefixBytes === receipt.prefixBytes ? [] : channels.output;
		return {
			...metadata,
			...channels,
			output
		};
	}
	createProjector(params) {
		const { count, source } = this.source;
		const { value, error: fullError, reference } = params;
		const outputBytes = count === 0 ? 0 : sourceBytes(source);
		const valueBytes = reference ? jsonUtf8Bytes({
			truncated: true,
			reference,
			guidance: RETAINED_GUIDANCE
		}) : value === void 0 ? 0 : sourceBytes(value);
		const minimumReference = reference ? retainedMarker({
			...reference,
			shape: "",
			preview: "",
			previewTruncated: true
		}, Infinity) : void 0;
		const referenceBytes = minimumReference ? jsonUtf8Bytes(minimumReference) : 0;
		const minimumOutputBytes = reference ? Math.min(outputBytes, jsonUtf8Bytes([createTruncationMarker(source, this.maxBytes)(0)])) : 0;
		const errorBytes = fullError === void 0 ? 0 : jsonUtf8Bytes(fullError);
		let completeOutput;
		let completeValue;
		let outputMarker;
		let valueMarker;
		let errorFitter;
		return (maxBytes) => {
			const errorAllowance = maxBytes - Math.min(outputBytes + valueBytes, Math.floor(maxBytes / 2));
			const error = fullError === void 0 || errorBytes <= errorAllowance ? fullError : (errorFitter ??= createErrorFitter(fullError, this.maxBytes))(errorAllowance);
			const remaining = maxBytes - (error === fullError ? errorBytes : jsonUtf8Bytes(error));
			const valueReservation = Math.max(Math.floor(remaining / 2), remaining >= referenceBytes + minimumOutputBytes ? referenceBytes : 0);
			const outputAllowance = remaining - Math.min(valueBytes, valueReservation);
			let output;
			let chargedOutputBytes;
			let receipt;
			if (outputBytes <= outputAllowance) {
				output = completeOutput ??= JSON.parse(source.json);
				chargedOutputBytes = outputBytes;
				receipt = {
					kind: "entries",
					count
				};
			} else {
				const marker = (outputMarker ??= createTruncationMarker(source, this.maxBytes))(outputAllowance - 2);
				const prefixBytes = Buffer.byteLength(marker.prefix, "utf8");
				output = [marker];
				chargedOutputBytes = jsonUtf8Bytes([marker]);
				receipt = {
					kind: "summary",
					originalBytes: outputBytes,
					prefixBytes
				};
			}
			const valueAllowance = remaining - chargedOutputBytes;
			const saved = reference ? retainedMarker(reference, valueAllowance) : void 0;
			const valueTruncated = value !== void 0 && (reference !== void 0 || value.kind !== "complete" || valueBytes > valueAllowance);
			return {
				receipt,
				valueTruncated,
				referenceUsed: saved !== void 0,
				channels: {
					output,
					...value === void 0 ? {} : saved ? { value: saved } : !reference && value.kind === "complete" && valueBytes <= remaining - chargedOutputBytes ? completeValue ??= { value: JSON.parse(value.json) } : { value: (valueMarker ??= createTruncationMarker(value, this.maxBytes, params.valueGuidance))(remaining - chargedOutputBytes) },
					...error === void 0 ? {} : { error }
				}
			};
		};
	}
};
//#endregion
export { captureCodeModeValue as a, renderToolSearchControlText as c, captureCodeModeOutput as i, serializeToolSearchControlResult as l, EMPTY_CODE_MODE_OUTPUT as n, stringifyCodeModeJsonSafe as o, boundCodeModeError as r, toCodeModeJsonSafe as s, CodeModeOutputState as t, createCodeModeResultReference as u };
