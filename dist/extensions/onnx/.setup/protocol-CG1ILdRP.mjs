// extensions/onnx/src/models/types.ts
var UnsupportedInputError = class extends Error {};
// extensions/onnx/src/protocol.ts
var OnnxWorkerError = class extends Error {
	constructor(code) {
		super(`ONNX worker: ${code}`);
		this.code = code;
	}
};
export { UnsupportedInputError as n, OnnxWorkerError as t };
