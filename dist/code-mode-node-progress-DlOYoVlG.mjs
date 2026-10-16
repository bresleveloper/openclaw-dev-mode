//#region src/agents/code-mode-node-progress.ts
const HEADER_BYTES = 64;
var CodeModeNodeProgress = class {
	constructor(buffer) {
		this.buffer = typeof buffer === "number" ? new SharedArrayBuffer(HEADER_BYTES + buffer) : buffer;
		this.state = new Int32Array(this.buffer, 0, 2);
		this.headers = new DataView(this.buffer);
		this.bytes = Buffer.from(this.buffer, HEADER_BYTES);
	}
	get deadline() {
		return this.headers.getFloat64(56);
	}
	set deadline(value) {
		this.headers.setFloat64(56, value);
	}
	get networkContentObserved() {
		return Atomics.load(this.state, 1) === 1;
	}
	observeNetworkContent() {
		Atomics.store(this.state, 1, 1);
	}
	append(json) {
		const active = Atomics.load(this.state, 0);
		const [count, originalBytes, length] = this.header(active);
		const part = (count === 0 ? "[" : ",") + json;
		const total = originalBytes + Buffer.byteLength(part);
		const written = originalBytes === length ? this.bytes.write(part, length) : 0;
		const next = 8 + (1 - active) * 24;
		this.headers.setFloat64(next, count + 1);
		this.headers.setFloat64(next + 8, total);
		this.headers.setFloat64(next + 16, length + written);
		Atomics.store(this.state, 0, 1 - active);
	}
	resetOutput() {
		const next = 1 - Atomics.load(this.state, 0);
		for (let field = 0; field < 3; field++) this.headers.setFloat64(8 + next * 24 + field * 8, 0);
		Atomics.store(this.state, 0, next);
	}
	output() {
		const [count, originalBytes, length] = this.header(Atomics.load(this.state, 0));
		const json = count === 0 ? "[]" : this.bytes.toString("utf8", 0, length);
		return {
			count,
			source: count === 0 || originalBytes + 1 <= this.bytes.length ? {
				kind: "complete",
				json: count === 0 ? json : json + "]"
			} : {
				kind: "prefix",
				json,
				originalBytes: originalBytes + 1
			}
		};
	}
	header(index) {
		const offset = 8 + index * 24;
		return [
			this.headers.getFloat64(offset),
			this.headers.getFloat64(offset + 8),
			this.headers.getFloat64(offset + 16)
		];
	}
};
//#endregion
export { CodeModeNodeProgress as t };
