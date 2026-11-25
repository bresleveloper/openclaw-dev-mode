// packages/ai/src/transports/model-request-body.ts
const REQUEST_BODY = Symbol("modelRequestBody");
const payloadObservers = /* @__PURE__ */ new WeakMap();
/** Input observers may patch request settings; caller hooks still require editable input. */
function markModelPayloadObserver(observer, wrapped, isObserver) {
	payloadObservers.set(observer, {
		wrapped,
		isObserver
	});
	return observer;
}
function hasMutableModelPayloadHook(hook) {
	if (hook === void 0) return false;
	const observer = payloadObservers.get(hook);
	return !observer || observer.isObserver?.() === false || hasMutableModelPayloadHook(observer.wrapped);
}
/** A slice of JSON.stringify output; only keys need decoding to inspect its shape. */
var ModelRequestJson = class ModelRequestJson {
	constructor(json) {
		this.json = json;
	}
	*members() {
		const object = this.json[0] === "{";
		if (!object && this.json[0] !== "[") return;
		let index = 1;
		let item = 0;
		while (index < this.json.length - 1) {
			let key = String(item++);
			if (object) {
				const end = this.valueEnd(index);
				const encodedKey = this.json.slice(index + 1, end - 1);
				key = encodedKey.includes("\\") ? JSON.parse(this.json.slice(index, end)) : encodedKey;
				index = end + 1;
			}
			const end = this.valueEnd(index);
			yield [key, new ModelRequestJson(this.json.slice(index, end))];
			index = end + 1;
		}
	}
	valueEnd(start) {
		let depth = 0;
		for (let index = start; index < this.json.length; index++) {
			const char = this.json[index];
			if (char === "\"") {
				let escaped;
				do {
					index = this.json.indexOf("\"", index + 1);
					let slash = index - 1;
					while (this.json[slash] === "\\") slash--;
					escaped = (index - slash) % 2 === 0;
				} while (escaped);
				if (depth === 0) return index + 1;
			} else if (char === "{" || char === "[") depth++;
			else if (char === "}" || char === "]") {
				if (depth === 0) return index;
				depth--;
				if (depth === 0) return index + 1;
			} else if (depth === 0 && (char === "," || char === ":")) return index;
		}
		return this.json.length;
	}
};
/** Call-local state survives option spreads; no payload is cached across requests. */
function modelRequestBodyState(options, inheritFrom) {
	const state = Reflect.get(options, REQUEST_BODY) ?? (inheritFrom && Reflect.get(inheritFrom, REQUEST_BODY)) ?? {};
	Reflect.set(options, REQUEST_BODY, state);
	return state;
}
/** Observe JSON fetch bodies without opting into host-owned request encoding. */
function withModelRequestBodyBytes(options, fetch) {
	const state = modelRequestBodyState(options ?? {});
	state.reportsBytes = true;
	return (input, init) => {
		if (typeof init?.body === "string") state.onBytes?.(Buffer.byteLength(init.body, "utf8"));
		else if (init?.body instanceof Blob) state.onBytes?.(init.body.size);
		else if (init?.body instanceof Uint8Array) state.onBytes?.(init.body.byteLength);
		return fetch(input, init);
	};
}
function serializeModelRequestBody(payload, onSerializedPayload) {
	const json = JSON.stringify(payload);
	const request = json === void 0 ? void 0 : new ModelRequestJson(json);
	let stream = false;
	if (request?.json[0] === "{") {
		for (const [key, value] of request.members()) if (key === "stream") {
			stream = value.json === "true";
			break;
		}
	}
	if (onSerializedPayload) onSerializedPayload(json === void 0 ? void 0 : JSON.parse(json));
	return {
		body: new TextEncoder().encode(json),
		stream,
		json: request
	};
}
const encodedBodyStreams = /* @__PURE__ */ new WeakMap();
function markEncodedModelRequestBody(body, stream) {
	encodedBodyStreams.set(body, stream);
}
function encodedModelRequestBodyStream(body) {
	return typeof body === "object" && body !== null ? encodedBodyStreams.get(body) : void 0;
}
/** SDK RequestOptions.body overrides encoding while the original params retain stream metadata. */
function prepareModelRequestBody(options) {
	const state = options ? modelRequestBodyState(options) : {};
	state.enabled = true;
	return async (payload) => {
		const encoded = state.encode ? await state.encode(payload) : serializeModelRequestBody(payload);
		const body = encoded.body;
		state.onBytes?.(body.byteLength);
		markEncodedModelRequestBody(body, encoded.stream);
		return {
			body,
			headers: { "content-type": "application/json" }
		};
	};
}
export { encodedModelRequestBodyStream, hasMutableModelPayloadHook, markEncodedModelRequestBody, markModelPayloadObserver, modelRequestBodyState, prepareModelRequestBody, serializeModelRequestBody, withModelRequestBodyBytes };
