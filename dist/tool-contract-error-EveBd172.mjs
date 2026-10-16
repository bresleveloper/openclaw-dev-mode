import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { i as createAbortError } from "./src-D1BHGNTj.mjs";
import "./abort-signal-QqAmLWTl.mjs";
import { i as sameSessionTranscriptTargetBinding } from "./transcript-target-binding-WjVavOYj.mjs";
import { o as stringifyCodeModeJsonSafe, u as createCodeModeResultReference } from "./code-mode-json-DLneEPkt.mjs";
import { n as ToolInputError } from "./tool-input-error-mjW74R8m.mjs";
import { s as isCodeModeControlTool } from "./code-mode-control-tools-CpOmDfxq.mjs";
import { i as copyAgentToolMetadata } from "./agent-tool-metadata-BiQWQ4ti.mjs";
import { a as attachInternalToolExecutionPreparer, p as getInternalToolExecutionPreparer } from "./internal-hooks-Cr0v44EY.mjs";
import { d as markToolExecutionNotStarted } from "./tool-result-error-DGhCl3TG.mjs";
import { randomUUID } from "node:crypto";
//#region src/agents/agent-tools.abort.ts
/**
* Abort-signal wrapping for agent tools.
* Combines per-call cancellation with run-level aborts while preserving
* identity-backed metadata on wrapped tools.
*/
function throwAbortError() {
	throw markToolExecutionNotStarted(createAbortError("Aborted"));
}
/**
* Races a tool execute promise against the combined abort signal so an abort
* settles the wrapped call immediately instead of awaiting the tool forever.
* JavaScript cannot cancel a running promise: a tool that never observes the
* signal keeps executing in the background and may settle later, but its late
* settlement is detached here so the result never lands in an aborted run.
* Tool settlements pass through untouched to preserve tool error semantics,
* including non-Error rejections.
*/
function raceWithAbortSignal(promise, signal, yieldRunSignal) {
	return new Promise((resolve, reject) => {
		const onAbort = () => {
			signal.removeEventListener("abort", onAbort);
			const reason = yieldRunSignal?.reason;
			if (yieldRunSignal?.aborted && signal.reason === reason && reason?.code === "sessions_yield" && reason.turnHandoff === true) return;
			reject(createAbortError("Aborted"));
		};
		signal.addEventListener("abort", onAbort, { once: true });
		promise.then((value) => {
			signal.removeEventListener("abort", onAbort);
			resolve(value);
		}, (error) => {
			signal.removeEventListener("abort", onAbort);
			reject(error);
		});
		if (signal.aborted) onAbort();
	});
}
/** Wrap a tool so every execute call observes the supplied run abort signal. */
function wrapToolWithAbortSignal(tool, abortSignal) {
	if (!abortSignal) return tool;
	const execute = tool.execute;
	if (!execute) return tool;
	const ownsCancellationOutcome = isCodeModeControlTool(tool);
	const wrappedTool = {
		...tool,
		execute: async (toolCallId, params, signal, onUpdate) => {
			const combinedSignal = signal ? AbortSignal.any([signal, abortSignal]) : abortSignal;
			if (combinedSignal.aborted) throwAbortError();
			const execution = execute(toolCallId, params, combinedSignal, onUpdate);
			return ownsCancellationOutcome ? await execution : await raceWithAbortSignal(execution, combinedSignal, tool.name === "sessions_yield" ? abortSignal : void 0);
		}
	};
	copyAgentToolMetadata(tool, wrappedTool, (source) => wrapToolWithAbortSignal(source, abortSignal));
	const sourcePreparer = getInternalToolExecutionPreparer(tool);
	if (sourcePreparer) attachInternalToolExecutionPreparer(wrappedTool, async (params) => {
		const combinedSignal = params.signal ? AbortSignal.any([params.signal, abortSignal]) : abortSignal;
		if (combinedSignal.aborted) throwAbortError();
		const yieldRunSignal = tool.name === "sessions_yield" ? abortSignal : void 0;
		const sourcePreparation = sourcePreparer({
			...params,
			signal: combinedSignal
		});
		let prepared;
		try {
			prepared = await raceWithAbortSignal(sourcePreparation, combinedSignal, yieldRunSignal);
		} catch (error) {
			sourcePreparation.then((latePreparation) => latePreparation.dispose(), () => void 0);
			throw error;
		}
		if (prepared.kind === "immediate") return prepared;
		return {
			kind: "ready",
			args: prepared.args,
			execute: (onImplementationStart) => {
				if (combinedSignal.aborted) throwAbortError();
				const execution = prepared.execute(onImplementationStart);
				return ownsCancellationOutcome ? execution : raceWithAbortSignal(execution, combinedSignal, yieldRunSignal);
			},
			dispose: prepared.dispose
		};
	});
	return wrappedTool;
}
//#endregion
//#region src/agents/code-mode-session-store.ts
const CUSTOM_TYPE = "openclaw.code-mode-store";
const MAX_VALUE_BYTES = 262144;
const MAX_TOTAL_BYTES = 1048576;
const stores$1 = /* @__PURE__ */ new WeakMap();
function disposeCodeModeSessionStore(owner) {
	const store = stores$1.get(owner);
	stores$1.delete(owner);
	store?.controller.abort();
	if (store && owner.current) stores$1.set(owner, {
		manager: store.manager,
		withOwnedTranscriptWrite: store.withOwnedTranscriptWrite,
		scope: store.scope,
		counterScope: owner.current.counterScope,
		controller: new AbortController(),
		commitTail: store.commitTail
	});
}
function bindCodeModeSessionStore(owner, manager, withOwnedTranscriptWrite = async (operation) => operation()) {
	stores$1.get(owner)?.controller.abort();
	stores$1.set(owner, {
		manager,
		withOwnedTranscriptWrite,
		counterScope: owner.current?.counterScope,
		controller: new AbortController(),
		commitTail: Promise.resolve()
	});
}
function readKey(key) {
	if (typeof key !== "string" || key.length === 0 || key.length > 256) throw new TypeError("Code Mode store key must be a non-empty string of at most 256 characters.");
	return key;
}
function encode(value, networkContent) {
	const json = stringifyCodeModeJsonSafe(value);
	const bytes = Buffer.byteLength(json, "utf8");
	if (bytes > MAX_VALUE_BYTES) throw new RangeError("Code Mode store value exceeds 256 KiB of serialized JSON.");
	return {
		json,
		bytes,
		networkContent
	};
}
function applyWrites(projection, writes) {
	const next = new Map(projection);
	for (const [key, value] of writes) if (value === null) next.delete(key);
	else next.set(key, value);
	let bytes = 0;
	for (const value of next.values()) bytes += value.bytes;
	if (bytes > MAX_TOTAL_BYTES) throw new RangeError("Code Mode store exceeds 1 MiB of serialized JSON; delete keys or store less data.");
	return next;
}
function replay(entries) {
	let projection = /* @__PURE__ */ new Map();
	for (const entry of entries) {
		if (entry.type !== "custom" || entry.customType !== CUSTOM_TYPE) continue;
		const data = entry.data;
		if (!isRecord(data) || !isRecord(data.set) || !Array.isArray(data.delete) || !isRecord(data.networkContent)) throw new Error("Code Mode session store contains an invalid transcript entry; repair the session before using store/load.");
		const writes = /* @__PURE__ */ new Map();
		for (const [key, value] of Object.entries(data.set)) {
			const networkContent = data.networkContent[key];
			if (typeof networkContent !== "boolean") throw new Error("Code Mode session store contains invalid content provenance; repair the session before using store/load.");
			writes.set(readKey(key), encode(value, networkContent));
		}
		for (const key of data.delete) writes.set(readKey(key), null);
		projection = applyWrites(projection, writes);
	}
	return projection;
}
/** store/load reuse the results bridge methods with a "session" selector (see the controller shim). */
function isCodeModeSessionStoreRequest(request) {
	return (request.method === "resultSave" || request.method === "resultLoad" || request.method === "resultDelete") && request.args[1] === "session";
}
/** Commits a completed cell's writes; returns a warning when persistence is unconfirmed. */
async function commitCodeModeSessionStore(access) {
	try {
		await access?.commit();
		return;
	} catch {
		return "Code Mode session store persistence could not be confirmed. The cell completed; verify the session transcript before relying on these values in a later cell or reply.";
	}
}
/** Each cell retains a private write buffer and the exact admitted run projection. */
function createCodeModeSessionStoreAccess(ctx, signal) {
	const owner = ctx.catalogRef;
	const store = owner ? stores$1.get(owner) : void 0;
	const scope = JSON.stringify([
		ctx.agentId,
		ctx.runId,
		ctx.sessionId,
		ctx.sessionKey
	]);
	const sessionId = store?.manager.getSessionId();
	const target = store?.manager.getSessionTarget();
	const writes = /* @__PURE__ */ new Map();
	let closed = false;
	let committing = false;
	const assertOwner = () => {
		ctx.abortSignal?.throwIfAborted();
		if (!owner?.current || !store || stores$1.get(owner) !== store || store.controller.signal.aborted || owner.current.counterScope !== store.counterScope) throw new Error("Code Mode store/load requires an active session-bound run; start a new interactive reply with a session.");
		store.scope ??= scope;
		if (store.scope !== scope || store.manager.getSessionId() !== sessionId || !sameSessionTranscriptTargetBinding(target, store.manager.getSessionTarget())) throw new Error("Code Mode store/load belongs to a different run or session; start a new interactive reply.");
		return store;
	};
	const assertCell = () => {
		signal.throwIfAborted();
		if (closed) throw new Error("Code Mode store/load is unavailable after the cell closed.");
		return assertOwner();
	};
	const projection = async () => {
		const active = assertCell();
		active.projection ??= (async () => {
			const manager = active.manager;
			if (target) {
				const { SessionManager } = await import("./session-manager-CWod7IzR.mjs");
				assertOwner();
				const replaySignal = ctx.abortSignal ? AbortSignal.any([ctx.abortSignal, active.controller.signal]) : active.controller.signal;
				return active.withOwnedTranscriptWrite(async () => {
					assertOwner();
					const leaf = manager.getLeafId();
					const full = await SessionManager.openAsync(target, manager.getCwd(), void 0, replaySignal);
					assertOwner();
					if (manager.getLeafId() !== leaf || leaf !== null && !full.getEntry(leaf)) throw new Error("Code Mode session store could not match the active transcript branch; retry in a new reply.");
					const entries = leaf === null ? [] : full.getBranch(leaf);
					if (leaf !== null && entries.at(-1)?.id !== leaf) throw new Error("Code Mode session store could not replay the active transcript branch; retry in a new reply.");
					return replay(entries);
				});
			}
			return replay(manager.getBranch());
		})();
		const current = await active.projection;
		assertCell();
		return current;
	};
	const write = async (key, value) => {
		const name = readKey(key);
		const current = await projection();
		if (committing) throw new Error("Code Mode store/load is unavailable while the cell is committing.");
		applyWrites(current, new Map(writes).set(name, value));
		writes.set(name, value);
	};
	return {
		async save(key, value, networkContent) {
			readKey(key);
			await write(key, value === void 0 ? null : encode(value, networkContent));
		},
		async delete(key) {
			await write(key, null);
		},
		async load(key) {
			const name = readKey(key);
			const current = await projection();
			const value = writes.has(name) ? writes.get(name) : current.get(name);
			return value ? {
				value: JSON.parse(value.json),
				networkContent: value.networkContent
			} : { networkContent: false };
		},
		async commit() {
			if (writes.size === 0) return;
			const active = assertCell();
			if (committing) throw new Error("Code Mode session store is already committing this cell.");
			committing = true;
			const pending = active.commitTail.then(async () => {
				const next = applyWrites(await projection(), writes);
				const set = Object.fromEntries([...writes].flatMap(([key, value]) => value ? [[key, JSON.parse(value.json)]] : []));
				const deleted = [...writes].filter(([, value]) => value === null).map(([key]) => key);
				const networkContent = Object.fromEntries([...writes].flatMap(([key, value]) => value ? [[key, value.networkContent]] : []));
				const { withSessionManagerWriteAssertion } = await import("./session-manager-write-admission-BmOgM0Am.mjs");
				assertCell();
				await active.withOwnedTranscriptWrite(() => withSessionManagerWriteAssertion(active.manager, assertCell, () => active.manager.appendCustomEntryAsync(CUSTOM_TYPE, {
					set,
					delete: deleted,
					networkContent
				})));
				assertCell();
				active.projection = Promise.resolve(next);
				writes.clear();
			});
			active.commitTail = pending.catch(() => {});
			try {
				await pending;
			} finally {
				closed = true;
				writes.clear();
			}
		},
		close() {
			closed = true;
			writes.clear();
		}
	};
}
//#endregion
//#region src/agents/code-mode-results.ts
const stores = /* @__PURE__ */ new WeakMap();
const MAX_RESULTS = 64;
function disposeCodeModeResults(owner) {
	stores.get(owner)?.close();
	disposeCodeModeSessionStore(owner);
}
/** Capture the result-store lifetime; an old cell must never adopt its replacement. */
function createCodeModeResultsAccess(ctx, config) {
	const owner = ctx.catalogRef;
	const catalog = owner?.current;
	const scope = JSON.stringify([
		ctx.agentId,
		ctx.runId,
		ctx.sessionId,
		ctx.sessionKey,
		catalog?.counterScope
	]);
	const maxBytes = Math.min(config.memoryLimitBytes, config.maxSnapshotBytes);
	let initialStore = owner ? stores.get(owner) : void 0;
	if (owner && catalog && !initialStore && !ctx.abortSignal?.aborted) {
		const signal = ctx.abortSignal;
		const created = {
			scope,
			maxBytes,
			bytes: 0,
			entries: /* @__PURE__ */ new Map(),
			close: () => {
				created.entries.clear();
				created.bytes = 0;
				signal?.removeEventListener("abort", created.close);
				if (stores.get(owner) === created) stores.delete(owner);
			}
		};
		stores.set(owner, created);
		signal?.addEventListener("abort", created.close, { once: true });
		initialStore = created;
	}
	const capturedStore = initialStore;
	const currentStore = () => {
		ctx.abortSignal?.throwIfAborted();
		if (!owner?.current || !capturedStore || owner.current.counterScope !== catalog?.counterScope || stores.get(owner) !== capturedStore) throw new ToolInputError("Code Mode results are unavailable after the run catalog changed or closed.");
		if (JSON.stringify([
			ctx.agentId,
			ctx.runId,
			ctx.sessionId,
			ctx.sessionKey,
			owner.current.counterScope
		]) !== scope || capturedStore.scope !== scope) throw new ToolInputError("Code Mode results belong to a different run or session.");
		return capturedStore;
	};
	const find = (id) => {
		if (typeof id !== "string" || !id) throw new ToolInputError("results reference id must be a non-empty string.");
		const store = currentStore();
		const entry = store.entries.get(id);
		if (!entry) throw new ToolInputError("Code Mode result is unavailable or expired; fetch fresh data if needed.");
		return {
			store,
			entry,
			id
		};
	};
	const retainJson = (json, networkContent) => {
		const bytes = Buffer.byteLength(json, "utf8");
		const store = currentStore();
		const allowance = Math.min(store.maxBytes, maxBytes);
		if (bytes > allowance) return { reason: "Not retained: result exceeds the data allowance. Return less data." };
		if (store.entries.size >= MAX_RESULTS || bytes > allowance - store.bytes) return { reason: "Not retained: result-store capacity exceeded. Delete references or return less data." };
		const id = `result_${randomUUID()}`;
		const reference = createCodeModeResultReference(id, json, JSON.parse(json));
		store.entries.set(id, {
			json,
			bytes,
			networkContent
		});
		store.bytes += bytes;
		return {
			reference,
			release: () => {
				if (store.entries.delete(id)) store.bytes -= bytes;
			}
		};
	};
	return {
		save(value, networkContent) {
			const retained = retainJson(stringifyCodeModeJsonSafe(value), networkContent);
			if ("reason" in retained) throw new ToolInputError("Code Mode results capacity exceeded; delete saved references or save a smaller value. Existing references are unchanged.");
			return retained.reference;
		},
		retain(source, networkContent) {
			if (source.kind !== "complete") return { reason: "Not retained: result exceeds the data allowance. Return less data." };
			try {
				return retainJson(source.json, networkContent);
			} catch (error) {
				if (error instanceof ToolInputError) return { reason: "Not retained: run catalog is unavailable or changed. Return less data." };
				throw error;
			}
		},
		load(id) {
			const { entry } = find(id);
			return {
				value: JSON.parse(entry.json),
				networkContent: entry.networkContent
			};
		},
		delete(id) {
			const { store, entry, id: key } = find(id);
			store.entries.delete(key);
			store.bytes -= entry.bytes;
			return true;
		}
	};
}
//#endregion
//#region src/agents/tool-schema-hints.ts
/** Bounded TypeScript-style hints for model-visible tool input and output schemas. */
const MAX_TOOL_SCHEMA_DECLARATION_CHARS = 32768;
const MAX_COMPACT_INPUT_HINT_CHARS = 300;
const MAX_COMPACT_OUTPUT_HINT_CHARS = 800;
const MAX_COMPACT_INPUT_SCHEMA_PROPERTIES = 16;
const MAX_COMPACT_OUTPUT_SCHEMA_PROPERTIES = 22;
const MAX_COMPACT_SCHEMA_PROPERTY_NAME_CHARS = 128;
const MAX_COMPACT_INPUT_DEPTH = 4;
const MAX_COMPACT_OUTPUT_DEPTH = 6;
const MAX_COMPACT_UNION_TYPES = 5;
const MAX_COMPACT_ENUM_VALUES = 8;
const MAX_COMPACT_ENUM_CHARS = 96;
const IDENTIFIER_RE = /^[A-Za-z_$][A-Za-z0-9_$]*$/u;
const NUMERIC_INPUT_BOUNDS = [
	["minimum", ">="],
	["maximum", "<="],
	["exclusiveMinimum", ">"],
	["exclusiveMaximum", "<"]
];
const UNSUPPORTED_SHAPE_KEYWORDS = [
	"$ref",
	"$dynamicRef",
	"$recursiveRef",
	"allOf",
	"patternProperties",
	"unevaluatedProperties",
	"dependentSchemas",
	"dependencies",
	"if",
	"then",
	"else",
	"prefixItems",
	"unevaluatedItems"
];
const INPUT_LIMITS = {
	maxChars: MAX_COMPACT_INPUT_HINT_CHARS,
	maxDepth: MAX_COMPACT_INPUT_DEPTH,
	maxProperties: MAX_COMPACT_INPUT_SCHEMA_PROPERTIES,
	numericInputConstraints: true
};
const OUTPUT_LIMITS = {
	maxChars: MAX_COMPACT_OUTPUT_HINT_CHARS,
	maxDepth: MAX_COMPACT_OUTPUT_DEPTH,
	maxProperties: MAX_COMPACT_OUTPUT_SCHEMA_PROPERTIES,
	numericInputConstraints: false
};
const UNKNOWN_HINT = {
	text: "unknown",
	complete: false
};
function completeHint(text) {
	return {
		text,
		complete: true
	};
}
function withSupportedShape(schema, hint) {
	return UNSUPPORTED_SHAPE_KEYWORDS.some((key) => Object.hasOwn(schema, key)) ? {
		...hint,
		complete: false
	} : hint;
}
function normalizeNullableSchemaForHint(schema) {
	if (!Object.hasOwn(schema, "nullable")) return schema;
	if (typeof schema.nullable !== "boolean") return;
	const types = typeof schema.type === "string" ? [schema.type] : Array.isArray(schema.type) && schema.type.every((value) => typeof value === "string") ? schema.type : void 0;
	if (!types) return;
	if (!schema.nullable) return schema;
	return {
		...schema,
		nullable: false,
		type: [.../* @__PURE__ */ new Set([...types, "null"])]
	};
}
function renderPrimitive(value) {
	if (value === null || typeof value === "string" || typeof value === "boolean" || typeof value === "number" && Number.isFinite(value)) return JSON.stringify(value);
}
function compactLiteralUnion(values, limits) {
	if (!Array.isArray(values) || values.length === 0 || values.length > (limits.declaration ? 256 : MAX_COMPACT_ENUM_VALUES)) return;
	const rendered = values.map(renderPrimitive);
	if (rendered.some((value) => value === void 0)) return;
	const result = [...new Set(rendered)].join(" | ");
	return result.length <= (limits.declaration ? limits.maxChars : MAX_COMPACT_ENUM_CHARS) ? completeHint(result) : void 0;
}
function compactSchemaUnion(schema, depth, limits) {
	const hasAnyOf = Object.hasOwn(schema, "anyOf");
	const hasOneOf = Object.hasOwn(schema, "oneOf");
	if (!hasAnyOf && !hasOneOf) return;
	if (hasAnyOf && hasOneOf) return UNKNOWN_HINT;
	const variants = hasAnyOf ? schema.anyOf : schema.oneOf;
	if (!Array.isArray(variants) || variants.length === 0 || variants.length > (limits.declaration ? 256 : MAX_COMPACT_ENUM_VALUES)) return UNKNOWN_HINT;
	if ([
		"const",
		"enum",
		"type",
		"properties",
		"required",
		"additionalProperties",
		"items"
	].some((key) => Object.hasOwn(schema, key))) return UNKNOWN_HINT;
	const literalVariants = variants.map((variant) => {
		if (!isRecord(variant) || !Object.hasOwn(variant, "const") || UNSUPPORTED_SHAPE_KEYWORDS.some((key) => Object.hasOwn(variant, key))) return;
		return variant.const;
	});
	if (literalVariants.every((value) => value !== void 0)) {
		const literalUnion = compactLiteralUnion(literalVariants, limits);
		if (literalUnion) return literalUnion;
	}
	if (variants.length > (limits.declaration ? 256 : MAX_COMPACT_UNION_TYPES)) return UNKNOWN_HINT;
	const rendered = variants.map((variant) => compactSchemaType(variant, depth + 1, limits));
	if (rendered.some((hint) => !hint.complete)) return UNKNOWN_HINT;
	return completeHint([...new Set(rendered.map((hint) => hint.text))].join(" | "));
}
function insertLexicallyBounded(values, value, limit) {
	if (limit <= 0) return;
	let low = 0;
	let high = values.length;
	while (low < high) {
		const middle = Math.floor((low + high) / 2);
		if ((values[middle] ?? "").localeCompare(value) < 0) low = middle + 1;
		else high = middle;
	}
	if (low >= limit) return;
	values.splice(low, 0, value);
	if (values.length > limit) values.pop();
}
function compactObjectHint(schema, depth, limits) {
	if (limits.declaration) {
		const properties = isRecord(schema.properties) ? schema.properties : {};
		const required = new Set(Array.isArray(schema.required) ? schema.required : []);
		const keys = [.../* @__PURE__ */ new Set([...Object.keys(properties), ...required])];
		if (keys.length > limits.maxProperties || !keys.every((key) => typeof key === "string" && key.length <= MAX_COMPACT_SCHEMA_PROPERTY_NAME_CHARS)) return UNKNOWN_HINT;
		const fields = keys.toSorted().map((key) => {
			const hint = compactSchemaType(properties[key], depth, limits);
			return (IDENTIFIER_RE.test(key) ? key : JSON.stringify(key)) + (required.has(key) ? "" : "?") + ": " + (hint.complete ? hint.text : "unknown");
		});
		if (schema.additionalProperties !== false) {
			const extra = compactSchemaType(schema.additionalProperties, depth, limits);
			fields.push("[key: string]: " + (keys.length === 0 && extra.complete ? extra.text : "unknown"));
		}
		return completeHint(fields.length ? "{ " + fields.join("; ") + " }" : "Record<string, never>");
	}
	if (!isRecord(schema.properties)) {
		const requiredValues = Array.isArray(schema.required) ? schema.required : [];
		return !(requiredValues.length > limits.maxProperties || requiredValues.some((value) => typeof value === "string")) && schema.additionalProperties === false ? completeHint("{}") : {
			text: "{ ... }",
			complete: false
		};
	}
	const properties = schema.properties;
	const requiredValues = Array.isArray(schema.required) ? schema.required : [];
	const invalidRequired = requiredValues.length <= limits.maxProperties && requiredValues.some((value) => typeof value !== "string");
	const required = new Set(requiredValues.slice(0, limits.maxProperties).filter((value) => typeof value === "string"));
	const requiredKeys = [];
	let missingRequired = false;
	for (const key of required) {
		if (key.length > MAX_COMPACT_SCHEMA_PROPERTY_NAME_CHARS) {
			missingRequired = true;
			continue;
		}
		if (!Object.hasOwn(properties, key)) {
			missingRequired = true;
			continue;
		}
		insertLexicallyBounded(requiredKeys, key, limits.maxProperties);
	}
	const optionalLimit = limits.maxProperties - requiredKeys.length;
	const optionalKeys = [];
	let optionalCount = 0;
	let oversizedOptionalKey = false;
	for (const key in properties) {
		if (!Object.hasOwn(properties, key) || required.has(key)) continue;
		optionalCount += 1;
		if (key.length > MAX_COMPACT_SCHEMA_PROPERTY_NAME_CHARS) {
			oversizedOptionalKey = true;
			continue;
		}
		insertLexicallyBounded(optionalKeys, key, optionalLimit);
	}
	const keys = [...requiredKeys, ...optionalKeys];
	const structurallyIncomplete = requiredValues.length > limits.maxProperties || invalidRequired || missingRequired || oversizedOptionalKey || optionalCount > optionalLimit;
	let omitted = structurallyIncomplete || schema.additionalProperties === true || isRecord(schema.additionalProperties);
	let complete = !structurallyIncomplete && schema.additionalProperties === false;
	let body = "";
	for (const key of keys) {
		const name = IDENTIFIER_RE.test(key) ? key : JSON.stringify(key);
		const propertyHint = compactSchemaType(properties[key], depth, limits);
		complete &&= propertyHint.complete;
		const part = `${name}${required.has(key) ? "" : "?"}: ${propertyHint.text}`;
		const next = body ? `${body}; ${part}` : part;
		if (next.length + 4 > limits.maxChars) {
			omitted = true;
			complete = false;
			break;
		}
		body = next;
	}
	if (!body) return keys.length === 0 && !omitted ? {
		text: "{}",
		complete
	} : {
		text: "{ ... }",
		complete: false
	};
	return {
		text: `{ ${body}${omitted ? "; ..." : ""} }`,
		complete
	};
}
function compactSchemaType(schema, depth = 0, limits = INPUT_LIMITS) {
	if (limits.remainingNodes && --limits.remainingNodes.value < 0) return UNKNOWN_HINT;
	if (!isRecord(schema)) return limits.declaration && schema === false ? completeHint("never") : UNKNOWN_HINT;
	if (limits.declaration && UNSUPPORTED_SHAPE_KEYWORDS.some((key) => Object.hasOwn(schema, key))) return UNKNOWN_HINT;
	if (Object.keys(schema).length === 0) return completeHint("unknown");
	if (depth >= limits.maxDepth) return UNKNOWN_HINT;
	const normalizedNullableSchema = normalizeNullableSchemaForHint(schema);
	if (!normalizedNullableSchema) return UNKNOWN_HINT;
	if (normalizedNullableSchema !== schema) return compactSchemaType(normalizedNullableSchema, depth, limits);
	const finish = (hint) => withSupportedShape(schema, hint);
	const schemaUnion = compactSchemaUnion(schema, depth, limits);
	if (schemaUnion) return finish(schemaUnion);
	const literal = renderPrimitive(schema.const);
	if (literal !== void 0) return finish(completeHint(literal));
	const enumUnion = compactLiteralUnion(schema.enum, limits);
	if (enumUnion) return finish(enumUnion);
	const type = schema.type;
	if (Array.isArray(type)) {
		if (type.length === 0 || type.length > MAX_COMPACT_UNION_TYPES || !type.every((value) => typeof value === "string")) return UNKNOWN_HINT;
		const rendered = type.map((value) => compactSchemaType({
			...schema,
			type: value
		}, depth + 1, limits));
		if (rendered.some((hint) => !hint.complete)) return UNKNOWN_HINT;
		return finish(completeHint([...new Set(rendered.map((hint) => hint.text))].join(" | ")));
	}
	if (type === "integer" || type === "number") {
		if (!limits.numericInputConstraints) return finish(completeHint("number"));
		const constraints = type === "integer" ? ["integer"] : [];
		for (const [key, operator] of NUMERIC_INPUT_BOUNDS) {
			const bound = schema[key];
			if (bound === void 0) continue;
			if (typeof bound !== "number" || !Number.isFinite(bound)) return UNKNOWN_HINT;
			constraints.push(`${operator} ${bound}`);
		}
		return finish(completeHint(`number${constraints.length > 0 ? ` /* ${constraints.join(", ")} */` : ""}`));
	}
	if (type === "array") {
		const itemHint = compactSchemaType(schema.items, depth + 1, limits);
		return finish({
			text: `Array<${itemHint.text}>`,
			complete: itemHint.complete
		});
	}
	if (type === "object") return finish(compactObjectHint(schema, depth + 1, limits));
	if (type === "string" || type === "boolean" || type === "null") return finish(completeHint(type));
	return UNKNOWN_HINT;
}
/** Full bounded declaration from the same schema as the compact hints.
* Unsupported shapes remain unknown; runtime validation still owns constraints.
*/
function toolSchemaDeclaration(schema) {
	const limits = {
		maxChars: MAX_TOOL_SCHEMA_DECLARATION_CHARS,
		maxDepth: 12,
		maxProperties: 256,
		numericInputConstraints: true,
		declaration: true,
		remainingNodes: { value: 4096 }
	};
	const hint = compactSchemaType(schema, 0, limits);
	return hint.complete && hint.text.length <= limits.maxChars ? hint.text : "unknown";
}
/** Compact one tool input schema. Unknown inputs remain explicit for safe describe fallback. */
function compactToolInputHint(schema) {
	if (!isRecord(schema)) return "unknown";
	const hint = schema.type === "object" ? compactObjectHint(schema, 0, INPUT_LIMITS) : compactSchemaType(schema, 0, INPUT_LIMITS);
	return hint.text.length <= INPUT_LIMITS.maxChars ? hint.text : "unknown";
}
/** Compact one trusted output schema. Omit incomplete hints instead of inviting field guesses. */
function compactToolOutputHint(schema) {
	const hint = compactSchemaType(schema, 0, OUTPUT_LIMITS);
	return hint.complete && hint.text.length <= OUTPUT_LIMITS.maxChars ? hint.text : void 0;
}
//#endregion
//#region src/agents/tool-contract-error.ts
const failures = /* @__PURE__ */ new WeakMap();
function markToolContractFailure(error, code) {
	failures.set(error, code);
	return error;
}
function getToolContractFailureCode(error) {
	return error instanceof Error ? failures.get(error) : void 0;
}
//#endregion
export { compactToolOutputHint as a, disposeCodeModeResults as c, createCodeModeSessionStoreAccess as d, isCodeModeSessionStoreRequest as f, compactToolInputHint as i, bindCodeModeSessionStore as l, wrapToolWithAbortSignal as m, markToolContractFailure as n, toolSchemaDeclaration as o, raceWithAbortSignal as p, MAX_TOOL_SCHEMA_DECLARATION_CHARS as r, createCodeModeResultsAccess as s, getToolContractFailureCode as t, commitCodeModeSessionStore as u };
